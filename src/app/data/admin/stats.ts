"use server";

import { requireAdmin } from "@/app/data/admin/require-admin";
import { db } from "@/lib/db";
import { BookingStatus, LessonStatus } from "@/generated/prisma";
import { startOfMonth, endOfMonth, subMonths, format } from "date-fns";

export async function getDashboardStats() {
  await requireAdmin();

  const now = new Date();
  const currentMonthStart = startOfMonth(now);
  const currentMonthEnd = endOfMonth(now);
  const lastMonthStart = startOfMonth(subMonths(now, 1));
  const lastMonthEnd = endOfMonth(subMonths(now, 1));

  // Get current month stats
  const [
    currentMonthLessons,
    currentMonthBookings,
    currentMonthUsers,
    totalActiveUsers,
    lastMonthLessons,
    lastMonthBookings,
    lastMonthUsers,
  ] = await Promise.all([
    // Current month lessons
    db.lesson.count({
      where: {
        status: LessonStatus.Published,
        createdAt: {
          gte: currentMonthStart,
          lte: currentMonthEnd,
        },
      },
    }),
    // Current month bookings
    db.booking.count({
      where: {
        bookedAt: {
          gte: currentMonthStart,
          lte: currentMonthEnd,
        },
      },
    }),
    // New users this month
    db.user.count({
      where: {
        createdAt: {
          gte: currentMonthStart,
          lte: currentMonthEnd,
        },
      },
    }),
    // Total active users
    db.user.count({
      where: {
        isActive: true,
        banned: {
          not: true,
        },
      },
    }),
    // Last month lessons
    db.lesson.count({
      where: {
        status: LessonStatus.Published,
        createdAt: {
          gte: lastMonthStart,
          lte: lastMonthEnd,
        },
      },
    }),
    // Last month bookings
    db.booking.count({
      where: {
        bookedAt: {
          gte: lastMonthStart,
          lte: lastMonthEnd,
        },
      },
    }),
    // Last month users
    db.user.count({
      where: {
        createdAt: {
          gte: lastMonthStart,
          lte: lastMonthEnd,
        },
      },
    }),
  ]);

  // Calculate percentage changes
  const lessonsChange =
    lastMonthLessons > 0
      ? ((currentMonthLessons - lastMonthLessons) / lastMonthLessons) * 100
      : 0;
  const bookingsChange =
    lastMonthBookings > 0
      ? ((currentMonthBookings - lastMonthBookings) / lastMonthBookings) * 100
      : 0;
  const usersChange =
    lastMonthUsers > 0
      ? ((currentMonthUsers - lastMonthUsers) / lastMonthUsers) * 100
      : 0;

  // Calculate growth rate (simplified as average of all metrics)
  const growthRate = (lessonsChange + bookingsChange + usersChange) / 3;

  return {
    lessons: {
      current: currentMonthLessons,
      change: lessonsChange,
    },
    bookings: {
      current: currentMonthBookings,
      change: bookingsChange,
    },
    users: {
      current: totalActiveUsers,
      change: usersChange,
    },
    growth: {
      current: growthRate,
      change: growthRate,
    },
  };
}

export async function getBookingChartData() {
  await requireAdmin();

  const now = new Date();
  const months = [];

  // Get last 6 months of data
  for (let i = 5; i >= 0; i--) {
    const monthStart = startOfMonth(subMonths(now, i));
    const monthEnd = endOfMonth(subMonths(now, i));

    const [confirmedBookings, pendingBookings, publishedLessons, draftLessons] =
      await Promise.all([
        db.booking.count({
          where: {
            status: BookingStatus.CONFIRMED,
            bookedAt: {
              gte: monthStart,
              lte: monthEnd,
            },
          },
        }),
        db.booking.count({
          where: {
            status: BookingStatus.PENDING,
            bookedAt: {
              gte: monthStart,
              lte: monthEnd,
            },
          },
        }),
        db.lesson.count({
          where: {
            status: LessonStatus.Published,
            createdAt: {
              gte: monthStart,
              lte: monthEnd,
            },
          },
        }),
        db.lesson.count({
          where: {
            status: LessonStatus.Draft,
            createdAt: {
              gte: monthStart,
              lte: monthEnd,
            },
          },
        }),
      ]);

    months.push({
      date: format(monthStart, "yyyy-MM-dd"),
      month: format(monthStart, "MMMM"),
      confirmed: confirmedBookings,
      pending: pendingBookings,
      published: publishedLessons,
      draft: draftLessons,
    });
  }

  return months;
}

export async function getAdminLessons() {
  await requireAdmin();

  const lessons = await db.lesson.findMany({
    include: {
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
    orderBy: [
      {
        startTime: "desc",
      },
      {
        createdAt: "desc",
      },
    ],
  });

  return lessons.map((lesson, index) => ({
    id: lesson.id,
    header: lesson.titleEn,
    type: lesson.Category?.nameEn || "Uncategorized",
    status:
      lesson.status === LessonStatus.Published
        ? "Published"
        : lesson.status === LessonStatus.Draft
          ? "Draft"
          : "Archived",
    target: `${lesson._count.Booking}/${lesson.maxCapacity}`,
    limit: `${lesson.maxCapacity}`,
    reviewer: lesson.instructor?.name || "No Instructor",
    startTime: lesson.startTime,
    level: lesson.level,
    location: lesson.location,
    position: lesson.position,
  }));
}

export type DashboardStatsType = Awaited<ReturnType<typeof getDashboardStats>>;
export type BookingChartDataType = Awaited<
  ReturnType<typeof getBookingChartData>
>;
export type AdminLessonType = {
  id: string;
  header: string;
  type: string;
  status: string;
  target: string;
  limit: string;
  reviewer: string;
  startTime: Date;
  level: string;
  location: string;
  position: number;
};
