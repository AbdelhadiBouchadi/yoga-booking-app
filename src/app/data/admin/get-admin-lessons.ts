"use server";

import { requireAdmin } from "@/app/data/admin/require-admin";
import { db } from "@/lib/db";

export async function getAdminLessons() {
  await requireAdmin();

  const data = await db.lesson.findMany({
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      titleEn: true,
      titleFr: true,
      shortDescriptionEn: true,
      shortDescriptionFr: true,
      descriptionEn: true,
      descriptionFr: true,
      categoryId: true,
      instructorId: true,
      location: true,
      startTime: true,
      endTime: true,
      level: true,
      maxCapacity: true,
      duration: true,
      cancellationDeadlineHours: true,
      imageUrl: true,
    },
  });

  return data;
}

export type AdminLessonType = Awaited<ReturnType<typeof getAdminLessons>>[0];
