"use server";

import { db } from "@/lib/db";

export async function getPublicInstructors() {
  try {
    const instructors = await db.user.findMany({
      where: {
        isInstructor: true,
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        email: true,
        bioEn: true,
        bioFr: true,
        descriptionEn: true,
        descriptionFr: true,
        specialties: true,
        certifications: true,
        experience: true,
        rating: true,
        image: true,
        images: true,
        _count: {
          select: {
            lessonsAsInstructor: {
              where: {
                status: "Published",
                startTime: {
                  gte: new Date(),
                },
              },
            },
            instructorReviews: {
              where: {
                isApproved: true,
              },
            },
          },
        },
        instructorReviews: {
          select: {
            rating: true,
          },
          where: {
            isApproved: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    // Calculate average rating for each instructor
    const instructorsWithAvgRating = instructors.map((instructor) => {
      const reviews = instructor.instructorReviews;
      const avgRating =
        reviews.length > 0
          ? reviews.reduce((sum, review) => sum + review.rating, 0) /
            reviews.length
          : 0;

      return {
        ...instructor,
        averageRating: Number(avgRating.toFixed(1)),
        totalReviews: instructor._count.instructorReviews,
        upcomingLessons: instructor._count.lessonsAsInstructor,
      };
    });

    return instructorsWithAvgRating;
  } catch (error) {
    console.error("Error fetching public instructors:", error);
    return [];
  }
}

export async function getPublicInstructorById(id: string) {
  try {
    const instructor = await db.user.findUnique({
      where: {
        id,
        isInstructor: true,
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        bioEn: true,
        bioFr: true,
        descriptionEn: true,
        descriptionFr: true,
        specialties: true,
        certifications: true,
        experience: true,
        rating: true,
        image: true,
        images: true,
        createdAt: true,
        lessonsAsInstructor: {
          select: {
            id: true,
            titleEn: true,
            titleFr: true,
            shortDescriptionEn: true,
            shortDescriptionFr: true,
            imageUrl: true,
            startTime: true,
            endTime: true,
            level: true,
            location: true,
            maxCapacity: true,
            duration: true,
            _count: {
              select: {
                Booking: {
                  where: {
                    status: {
                      in: ["CONFIRMED", "PENDING"],
                    },
                  },
                },
              },
            },
          },
          where: {
            status: "Published",
            startTime: {
              gte: new Date(),
            },
          },
          orderBy: {
            startTime: "asc",
          },
          take: 6, // Limit to next 6 upcoming lessons
        },
        instructorReviews: {
          select: {
            id: true,
            rating: true,
            comment: true,
            createdAt: true,
            isAnonymous: true,
            user: {
              select: {
                name: true,
                image: true,
              },
            },
          },
          where: {
            isApproved: true,
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 10, // Limit to latest 10 reviews
        },
      },
    });

    if (!instructor) {
      return null;
    }

    // Calculate average rating
    const reviews = instructor.instructorReviews;
    const avgRating =
      reviews.length > 0
        ? reviews.reduce((sum, review) => sum + review.rating, 0) /
          reviews.length
        : 0;

    return {
      ...instructor,
      averageRating: Number(avgRating.toFixed(1)),
      totalReviews: reviews.length,
      upcomingLessons: instructor.lessonsAsInstructor.length,
    };
  } catch (error) {
    console.error("Error fetching instructor by ID:", error);
    return null;
  }
}

export type PublicInstructorType = Awaited<
  ReturnType<typeof getPublicInstructors>
>[0];
export type PublicInstructorDetailType = Awaited<
  ReturnType<typeof getPublicInstructorById>
>;
