import "server-only";

import { db } from "@/lib/db";
import { requireAdmin } from "./require-admin";
import { notFound } from "next/navigation";

export async function getAdminLesson(lessonId: string) {
  await requireAdmin();

  const data = db.lesson.findUnique({
    where: {
      id: lessonId,
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
      status: true,
      cancellationDeadlineHours: true,
      imageUrl: true,
      position: true,
    },
  });

  if (!data) return notFound();

  return data;
}

export type AdminLessonSingularType = Awaited<
  ReturnType<typeof getAdminLesson>
>;
