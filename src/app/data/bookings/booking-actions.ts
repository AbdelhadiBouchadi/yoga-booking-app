"use server";

import { requireAuth } from "@/app/data/require-auth";
import { requireAdmin } from "@/app/data/admin/require-admin";
import { BookingStatus, CancellationReason } from "@/generated/prisma";
import { aj, detectBot, fixedWindow } from "@/lib/arcjet";
import { db } from "@/lib/db";
import {
  createBookingSchema,
  updateBookingStatusSchema,
  markAttendanceSchema,
  CreateBookingSchemaType,
  UpdateBookingStatusSchemaType,
  MarkAttendanceSchemaType,
} from "@/lib/validator";
import { APIResponse } from "@/types";
import { request } from "@arcjet/next";
import { revalidatePath } from "next/cache";

const arcjet = aj
  .withRule(
    detectBot({
      mode: "LIVE",
      allow: [],
    }),
  )
  .withRule(
    fixedWindow({
      mode: "LIVE",
      window: "1m",
      max: 10,
    }),
  );

export async function createBooking(
  values: CreateBookingSchemaType,
): Promise<APIResponse> {
  const session = await requireAuth();

  try {
    const req = await request();
    const decision = await arcjet.protect(req, {
      fingerprint: session.user.id,
    });

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return {
          status: "error",
          message: "Too many booking attempts. Please try again later.",
        };
      } else {
        return {
          status: "error",
          message: "Suspicious activity detected. Please contact support.",
        };
      }
    }

    const validation = createBookingSchema.safeParse(values);
    if (!validation.success) {
      return {
        status: "error",
        message: "Invalid booking data",
      };
    }

    const result = await db.$transaction(async (tx) => {
      // Check if lesson exists and is bookable
      const lesson = await tx.lesson.findUnique({
        where: { id: values.lessonId },
        select: {
          id: true,
          titleEn: true,
          startTime: true,
          endTime: true,
          maxCapacity: true,
          status: true,
          cancellationDeadlineHours: true,
          _count: {
            select: {
              Booking: {
                where: {
                  status: {
                    in: [BookingStatus.PENDING, BookingStatus.CONFIRMED],
                  },
                },
              },
            },
          },
        },
      });

      if (!lesson) {
        throw new Error("Lesson not found");
      }

      if (lesson.status !== "Published") {
        throw new Error("This lesson is not available for booking");
      }

      // Check if lesson has already started
      if (new Date() > new Date(lesson.startTime)) {
        throw new Error("Cannot book a lesson that has already started");
      }

      // Check if user already has a booking for this lesson
      const existingBooking = await tx.booking.findUnique({
        where: {
          userId_lessonId: {
            userId: values.userId,
            lessonId: values.lessonId,
          },
        },
      });

      if (existingBooking) {
        throw new Error("You already have a booking for this lesson");
      }

      // Check capacity
      const currentBookings = lesson._count.Booking;
      const isWaitingList = currentBookings >= lesson.maxCapacity;

      // Get position for waiting list
      let position = null;
      if (isWaitingList) {
        const lastWaitingListBooking = await tx.booking.findFirst({
          where: {
            lessonId: values.lessonId,
            isWaitingList: true,
          },
          orderBy: {
            position: "desc",
          },
          select: {
            position: true,
          },
        });
        position = (lastWaitingListBooking?.position || 0) + 1;
      }

      // Create the booking
      const booking = await tx.booking.create({
        data: {
          userId: values.userId,
          lessonId: values.lessonId,
          status: isWaitingList
            ? BookingStatus.PENDING
            : BookingStatus.CONFIRMED,
          isWaitingList,
          position,
          confirmedAt: isWaitingList ? null : new Date(),
        },
        include: {
          lesson: {
            select: {
              titleEn: true,
              titleFr: true,
              startTime: true,
              location: true,
            },
          },
        },
      });

      return { booking, isWaitingList };
    });

    revalidatePath("/bookings");
    revalidatePath(`/sessions/${values.lessonId}`);
    revalidatePath("/admin/bookings");

    return {
      status: "success",
      message: result.isWaitingList
        ? "You've been added to the waiting list. We'll notify you if a spot opens up."
        : "Booking confirmed successfully!",
      data: result.booking,
    };
  } catch (error) {
    console.error("Booking creation error:", error);
    return {
      status: "error",
      message:
        error instanceof Error ? error.message : "Failed to create booking",
    };
  }
}

export async function cancelBooking(
  bookingId: string,
  reason: CancellationReason = CancellationReason.USER_CANCELLED,
  note?: string,
): Promise<APIResponse> {
  const session = await requireAuth();

  try {
    const req = await request();
    const decision = await arcjet.protect(req, {
      fingerprint: session.user.id,
    });

    if (decision.isDenied()) {
      return {
        status: "error",
        message: "Too many requests. Please try again later.",
      };
    }

    const result = await db.$transaction(async (tx) => {
      // Get the booking with lesson details
      const booking = await tx.booking.findUnique({
        where: { id: bookingId },
        include: {
          lesson: {
            select: {
              startTime: true,
              cancellationDeadlineHours: true,
            },
          },
        },
      });

      if (!booking) {
        throw new Error("Booking not found");
      }

      // Check if user owns this booking (unless admin)
      if (booking.userId !== session.user.id && session.user.role !== "ADMIN") {
        throw new Error("You can only cancel your own bookings");
      }

      // Check cancellation deadline
      const cancellationDeadline = new Date(booking.lesson.startTime);
      cancellationDeadline.setHours(
        cancellationDeadline.getHours() -
          booking.lesson.cancellationDeadlineHours,
      );

      if (new Date() > cancellationDeadline && session.user.role !== "ADMIN") {
        throw new Error(
          `Cancellation deadline has passed. You must cancel at least ${booking.lesson.cancellationDeadlineHours} hours before the lesson.`,
        );
      }

      // Cancel the booking
      const cancelledBooking = await tx.booking.update({
        where: { id: bookingId },
        data: {
          status: BookingStatus.CANCELLED,
          cancelledAt: new Date(),
          cancellationReason: reason,
          cancellationNote: note,
        },
      });

      // If this was a confirmed booking, promote someone from waiting list
      if (!booking.isWaitingList) {
        const nextWaitingBooking = await tx.booking.findFirst({
          where: {
            lessonId: booking.lessonId,
            isWaitingList: true,
            status: BookingStatus.PENDING,
          },
          orderBy: {
            position: "asc",
          },
        });

        if (nextWaitingBooking) {
          await tx.booking.update({
            where: { id: nextWaitingBooking.id },
            data: {
              status: BookingStatus.CONFIRMED,
              isWaitingList: false,
              position: null,
              confirmedAt: new Date(),
            },
          });
        }
      }

      return cancelledBooking;
    });

    revalidatePath("/bookings");
    revalidatePath(`/sessions/${result.lessonId}`);
    revalidatePath("/admin/bookings");

    return {
      status: "success",
      message: "Booking cancelled successfully",
    };
  } catch (error) {
    console.error("Booking cancellation error:", error);
    return {
      status: "error",
      message:
        error instanceof Error ? error.message : "Failed to cancel booking",
    };
  }
}

export async function updateBookingStatus(
  bookingId: string,
  values: UpdateBookingStatusSchemaType,
): Promise<APIResponse> {
  await requireAdmin();

  try {
    const validation = updateBookingStatusSchema.safeParse(values);
    if (!validation.success) {
      return {
        status: "error",
        message: "Invalid status data",
      };
    }

    const booking = await db.booking.update({
      where: { id: bookingId },
      data: {
        status: values.status as BookingStatus,
        cancellationReason: values.cancellationReason as CancellationReason,
        cancellationNote: values.cancellationNote,
        cancelledAt: values.status === "CANCELLED" ? new Date() : null,
        confirmedAt: values.status === "CONFIRMED" ? new Date() : null,
      },
    });

    revalidatePath("/admin/bookings");
    revalidatePath(`/sessions/${booking.lessonId}`);

    return {
      status: "success",
      message: "Booking status updated successfully",
    };
  } catch (error) {
    console.error("Status update error:", error);
    return {
      status: "error",
      message: "Failed to update booking status",
    };
  }
}

export async function markAttendance(
  values: MarkAttendanceSchemaType,
): Promise<APIResponse> {
  await requireAdmin();

  try {
    const validation = markAttendanceSchema.safeParse(values);
    if (!validation.success) {
      return {
        status: "error",
        message: "Invalid attendance data",
      };
    }

    await db.booking.updateMany({
      where: {
        id: {
          in: values.bookingIds,
        },
      },
      data: {
        attendanceMarked: true,
        attended: values.attended,
      },
    });

    revalidatePath("/admin/bookings");

    return {
      status: "success",
      message: `Attendance marked for ${values.bookingIds.length} booking(s)`,
    };
  } catch (error) {
    console.error("Attendance marking error:", error);
    return {
      status: "error",
      message: "Failed to mark attendance",
    };
  }
}

export async function deleteBooking(bookingId: string): Promise<APIResponse> {
  try {
    await requireAdmin();

    const booking = await db.booking.findUnique({
      where: { id: bookingId },
      include: {
        lesson: true,
      },
    });

    if (!booking) {
      return {
        status: "error",
        message: "Booking not found",
      };
    }

    await db.$transaction(async (tx) => {
      // Delete the booking
      await tx.booking.delete({
        where: { id: bookingId },
      });

      // If this was a confirmed booking, promote someone from waiting list
      if (
        !booking.isWaitingList &&
        booking.status === BookingStatus.CONFIRMED
      ) {
        const nextWaitingBooking = await tx.booking.findFirst({
          where: {
            lessonId: booking.lessonId,
            isWaitingList: true,
            status: BookingStatus.PENDING,
          },
          orderBy: {
            position: "asc",
          },
        });

        if (nextWaitingBooking) {
          await tx.booking.update({
            where: { id: nextWaitingBooking.id },
            data: {
              status: BookingStatus.CONFIRMED,
              isWaitingList: false,
              position: null,
              confirmedAt: new Date(),
            },
          });

          // Update positions for remaining waiting list
          await tx.booking.updateMany({
            where: {
              lessonId: booking.lessonId,
              isWaitingList: true,
              position: {
                gt: nextWaitingBooking.position!,
              },
            },
            data: {
              position: {
                decrement: 1,
              },
            },
          });
        }
      }
    });

    revalidatePath("/admin/bookings");
    revalidatePath(`/sessions/${booking.lessonId}`);

    return {
      status: "success",
      message: "Booking deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting booking:", error);
    return {
      status: "error",
      message: "Failed to delete booking",
    };
  }
}
