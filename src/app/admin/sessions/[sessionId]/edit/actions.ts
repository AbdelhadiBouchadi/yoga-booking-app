"use server";

import { requireAdmin } from "@/app/data/admin/require-admin";
import { LessonStatus } from "@/generated/prisma";
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

export async function editLesson(
  data: LessonSchemaType,
  lessonId: string,
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

    const result = lessonSchema.safeParse(data);

    if (!result.success) {
      return {
        status: "error",
        message: "Invalid Data",
      };
    }

    await db.lesson.update({
      where: {
        id: lessonId,
      },
      data: { ...result.data },
    });

    return {
      status: "success",
      message: "Session Updated Successfully",
    };
  } catch (error) {
    return {
      status: "success",
      message: "Failed to update session",
    };
  }
}

export async function duplicateLessonForNextWeek(oldLessonId: string) {
  const session = await requireAdmin();

  try {
    const req = await request();
    const decision = await arcjet.protect(req, {
      fingerprint: session?.user.id as string,
    });

    if (decision.isDenied()) {
      return {
        status: "error",
        message: "Action blocked due to rate limiting or bot detection.",
      };
    }

    const existingLesson = await db.lesson.findUnique({
      where: { id: oldLessonId },
    });

    if (!existingLesson) {
      return { status: "error", message: "Lesson not found." };
    }

    // Calculate dates exactly 7 days later
    const nextWeekStart = new Date(existingLesson.startTime);
    nextWeekStart.setDate(nextWeekStart.getDate() + 7);

    const nextWeekEnd = new Date(existingLesson.endTime);
    nextWeekEnd.setDate(nextWeekEnd.getDate() + 7);

    // Run as a transaction so it either all succeeds or all fails cleanly
    await db.$transaction(async (tx) => {
      // 1. Create the new lesson
      await tx.lesson.create({
        data: {
          titleEn: existingLesson.titleEn,
          titleFr: existingLesson.titleFr,
          descriptionEn: existingLesson.descriptionEn,
          descriptionFr: existingLesson.descriptionFr,
          shortDescriptionEn: existingLesson.shortDescriptionEn,
          shortDescriptionFr: existingLesson.shortDescriptionFr,
          imageUrl: existingLesson.imageUrl,
          location: existingLesson.location,
          level: existingLesson.level,
          position: existingLesson.position,
          maxCapacity: existingLesson.maxCapacity,
          duration: existingLesson.duration,
          isRecurring: existingLesson.isRecurring,
          cancellationDeadlineHours: existingLesson.cancellationDeadlineHours,
          instructorId: existingLesson.instructorId,
          categoryId: existingLesson.categoryId,
          startTime: nextWeekStart,
          endTime: nextWeekEnd,
          status: LessonStatus.Published,
        },
      });

      // 2. Archive the old lesson
      await tx.lesson.update({
        where: { id: oldLessonId },
        data: { status: LessonStatus.Archived },
      });

      // 3. Mark active bookings on the old lesson as COMPLETED
      await tx.booking.updateMany({
        where: {
          lessonId: oldLessonId,
          status: { in: ["PENDING", "CONFIRMED"] },
        },
        data: { status: "COMPLETED" },
      });
    });

    // Refresh the UI pages
    revalidatePath("/admin/workshops");
    revalidatePath("/sessions");

    return {
      status: "success",
      message: "Lesson moved to next week successfully!",
    };
  } catch (error) {
    console.error("Error duplicating lesson:", error);
    return { status: "error", message: "Failed to duplicate the lesson." };
  }
}
