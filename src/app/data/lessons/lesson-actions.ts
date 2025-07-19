"use server";

import { db } from "@/lib/db";
import { LessonStatus } from "@/generated/prisma";

export async function getPublishedLessons() {
  try {
    const lessons = await db.lesson.findMany({
      where: {
        status: LessonStatus.Published,
        startTime: {
          gte: new Date(), // Only show future lessons
        },
      },
      include: {
        instructor: {
          select: {
            id: true,
            name: true,
            image: true,
            rating: true,
          },
        },
        Category: {
          select: {
            nameEn: true,
            nameFr: true,
          },
        },
        _count: {
          select: {
            Booking: {
              where: {
                status: {
                  in: ["PENDING", "CONFIRMED"],
                },
              },
            },
          },
        },
      },
      orderBy: {
        startTime: "asc",
      },
    });

    return lessons;
  } catch (error) {
    console.error("Error fetching lessons:", error);
    return [];
  }
}

export async function getLessonById(lessonId: string) {
  try {
    const lesson = await db.lesson.findUnique({
      where: {
        id: lessonId,
        status: LessonStatus.Published,
      },
      include: {
        instructor: {
          select: {
            id: true,
            name: true,
            image: true,
            bioEn: true,
            bioFr: true,
            specialties: true,
            rating: true,
          },
        },
        Category: {
          select: {
            nameEn: true,
            nameFr: true,
          },
        },
        _count: {
          select: {
            Booking: {
              where: {
                status: {
                  in: ["PENDING", "CONFIRMED"],
                },
              },
            },
          },
        },
      },
    });

    return lesson;
  } catch (error) {
    console.error("Error fetching lesson:", error);
    return null;
  }
}

export async function getLessonBookings(lessonId: string) {
  try {
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
          },
        },
      },
      orderBy: {
        bookedAt: "asc",
      },
    });

    return bookings;
  } catch (error) {
    console.error("Error fetching lesson bookings:", error);
    return [];
  }
}

export type PublishedLessonType = Awaited<
  ReturnType<typeof getPublishedLessons>
>[0];
export type LessonDetailType = Awaited<ReturnType<typeof getLessonById>>;
export type LessonBookingType = Awaited<
  ReturnType<typeof getLessonBookings>
>[0];
