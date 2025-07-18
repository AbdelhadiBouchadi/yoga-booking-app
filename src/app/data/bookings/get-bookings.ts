import "server-only";

import { db } from "@/lib/db";
import { requireAuth } from "@/app/data/require-auth";
import { requireAdmin } from "@/app/data/admin/require-admin";

export async function getUserBookings(userId?: string) {
  const session = await requireAuth();
  const targetUserId = userId || session.user.id;

  // Only allow users to see their own bookings unless they're admin
  if (targetUserId !== session.user.id && session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const bookings = await db.booking.findMany({
    where: {
      userId: targetUserId,
    },
    include: {
      lesson: {
        select: {
          id: true,
          titleEn: true,
          titleFr: true,
          shortDescriptionEn: true,
          shortDescriptionFr: true,
          imageUrl: true,
          location: true,
          startTime: true,
          endTime: true,
          level: true,
          maxCapacity: true,
          cancellationDeadlineHours: true,
          instructor: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          Category: {
            select: {
              nameEn: true,
              nameFr: true,
            },
          },
        },
      },
    },
    orderBy: [
      {
        lesson: {
          startTime: "asc",
        },
      },
    ],
  });

  return bookings;
}

export async function getAdminBookings(filters?: {
  status?: string;
  lessonId?: string;
  userId?: string;
  startDate?: Date;
  endDate?: Date;
}) {
  await requireAdmin();

  const bookings = await db.booking.findMany({
    where: {
      ...(filters?.status && { status: filters.status as any }),
      ...(filters?.lessonId && { lessonId: filters.lessonId }),
      ...(filters?.userId && { userId: filters.userId }),
      ...(filters?.startDate &&
        filters?.endDate && {
          lesson: {
            startTime: {
              gte: filters.startDate,
              lte: filters.endDate,
            },
          },
        }),
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
      lesson: {
        select: {
          id: true,
          titleEn: true,
          titleFr: true,
          location: true,
          startTime: true,
          endTime: true,
          level: true,
          maxCapacity: true,
          instructor: {
            select: {
              id: true,
              name: true,
            },
          },
          Category: {
            select: {
              nameEn: true,
              nameFr: true,
            },
          },
        },
      },
    },
    orderBy: [
      {
        lesson: {
          startTime: "desc",
        },
      },
      {
        bookedAt: "desc",
      },
    ],
  });

  return bookings;
}

export async function getLessonBookings(lessonId: string) {
  const session = await requireAuth();

  const bookings = await db.booking.findMany({
    where: {
      lessonId,
      status: {
        in: ["PENDING", "CONFIRMED"],
      },
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
    },
    orderBy: [
      {
        isWaitingList: "asc",
      },
      {
        position: "asc",
      },
      {
        bookedAt: "asc",
      },
    ],
  });

  // Only show user details to admins or instructors
  if (session.user.role !== "ADMIN") {
    return bookings.map((booking) => ({
      ...booking,
      user: {
        id: booking.user.id,
        name: booking.userId === session.user.id ? booking.user.name : "***",
        email: booking.userId === session.user.id ? booking.user.email : "***",
        image: booking.userId === session.user.id ? booking.user.image : null,
      },
    }));
  }

  return bookings;
}

export async function getBookingStats() {
  await requireAdmin();

  const [
    totalBookings,
    confirmedBookings,
    pendingBookings,
    cancelledBookings,
    completedBookings,
    noShowBookings,
  ] = await Promise.all([
    db.booking.count(),
    db.booking.count({ where: { status: "CONFIRMED" } }),
    db.booking.count({ where: { status: "PENDING" } }),
    db.booking.count({ where: { status: "CANCELLED" } }),
    db.booking.count({ where: { status: "COMPLETED" } }),
    db.booking.count({ where: { status: "NO_SHOW" } }),
  ]);

  return {
    total: totalBookings,
    confirmed: confirmedBookings,
    pending: pendingBookings,
    cancelled: cancelledBookings,
    completed: completedBookings,
    noShow: noShowBookings,
  };
}

export type UserBookingType = Awaited<ReturnType<typeof getUserBookings>>[0];
export type AdminBookingType = Awaited<ReturnType<typeof getAdminBookings>>[0];
export type LessonBookingType = Awaited<
  ReturnType<typeof getLessonBookings>
>[0];
export type BookingStatsType = Awaited<ReturnType<typeof getBookingStats>>;
