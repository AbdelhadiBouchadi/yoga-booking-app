"use server";

import { requireAdmin } from "@/app/data/admin/require-admin";
import { LessonLevel, LessonStatus } from "@/generated/prisma";
import { aj, detectBot, fixedWindow } from "@/lib/arcjet";
import { db } from "@/lib/db";
import { lessonSchema, LessonSchemaType } from "@/lib/validator";
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
      max: 5,
    }),
  );

export async function createLesson(
  values: LessonSchemaType,
): Promise<APIResponse> {
  const session = await requireAdmin();

  try {
    const req = await request();

    const decision = await arcjet.protect(req, {
      fingerprint: session?.user.id as string,
    });

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return {
          status: "error",
          message: "You've been blocked due to rate limiting",
        };
      } else {
        return {
          status: "error",
          message:
            "Malicious activity detected. Please contact us if you think this is a mistake",
        };
      }
    }

    const validation = lessonSchema.safeParse(values);

    if (!validation.success) {
      return {
        status: "error",
        message: "Invalid Form Data",
      };
    }

    await db.$transaction(async (tx) => {
      // Get the highest position in the category
      const maxPos = await tx.lesson.findFirst({
        where: {
          categoryId: values.categoryId,
        },
        select: {
          position: true,
        },
        orderBy: {
          position: "desc",
        },
      });

      // Create lesson with next position
      await tx.lesson.create({
        data: {
          titleEn: values.titleEn,
          titleFr: values.titleFr,
          shortDescriptionEn: values.shortDescriptionEn,
          shortDescriptionFr: values.shortDescriptionFr,
          descriptionEn: values.descriptionEn,
          descriptionFr: values.descriptionFr,
          categoryId: values.categoryId,
          instructorId: values.instructorId,
          location: values.location,
          startTime: values.startTime,
          endTime: values.endTime,
          level: values.level as LessonLevel,
          maxCapacity: values.maxCapacity,
          duration: values.duration,
          status: values.status as LessonStatus,
          cancellationDeadlineHours: values.cancellationDeadlineHours,
          imageUrl: values.imageUrl || "",
          position: (maxPos?.position ?? 0) + 1,
        },
      });
    });

    revalidatePath("/admin/sessions");

    return {
      status: "success",
      message: "Session Created Succesfully",
    };
  } catch (error) {
    console.error(error);
    return {
      status: "error",
      message: "Failed to create session",
    };
  }
}

export interface TimeSlot {
  time: string;
  available: boolean;
}

export async function checkInstructorAvailability(
  instructorId: string,
  date: Date,
  excludeLessonId?: string,
): Promise<TimeSlot[]> {
  try {
    // Get the start and end of the selected date
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    // Get all lessons for this instructor on this date
    const existingLessons = await db.lesson.findMany({
      where: {
        instructorId,
        startTime: {
          gte: startOfDay,
          lte: endOfDay,
        },
        status: {
          not: LessonStatus.Archived,
        },
        ...(excludeLessonId && {
          id: {
            not: excludeLessonId,
          },
        }),
      },
      select: {
        id: true,
        startTime: true,
        endTime: true,
        duration: true,
      },
    });

    // Generate time slots from 6 AM to 10 PM (30-minute intervals)
    const timeSlots: TimeSlot[] = [];
    for (let hour = 6; hour <= 22; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, "0")}:${minute
          .toString()
          .padStart(2, "0")}`;

        // Create a Date object for this time slot
        const slotDateTime = new Date(date);
        slotDateTime.setHours(hour, minute, 0, 0);

        // Check if this time slot conflicts with any existing lesson
        const isAvailable = !existingLessons.some((lesson) => {
          const lessonStart = new Date(lesson.startTime);
          const lessonEnd = new Date(lesson.endTime);

          // Check if the time slot overlaps with the lesson
          return slotDateTime >= lessonStart && slotDateTime < lessonEnd;
        });

        timeSlots.push({
          time: timeString,
          available: isAvailable,
        });
      }
    }

    return timeSlots;
  } catch (error) {
    console.error("Error checking instructor availability:", error);
    // Return all slots as available if there's an error
    const timeSlots: TimeSlot[] = [];
    for (let hour = 6; hour <= 22; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, "0")}:${minute
          .toString()
          .padStart(2, "0")}`;
        timeSlots.push({
          time: timeString,
          available: true,
        });
      }
    }
    return timeSlots;
  }
}

export async function deleteLesson(lessonId: string): Promise<APIResponse> {
  await requireAdmin();

  try {
    await db.lesson.delete({
      where: {
        id: lessonId,
      },
    });

    return {
      status: "success",
      message: "Workshop Removed Successfully",
    };
  } catch {
    return {
      status: "error",
      message: "An Error Occured",
    };
  }
}
