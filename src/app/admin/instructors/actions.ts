"use server";

import { requireAdmin } from "@/app/data/admin/require-admin";
import { aj, detectBot, fixedWindow } from "@/lib/arcjet";
import { db } from "@/lib/db";
import { instructorSchema, InstructorSchemaType } from "@/lib/validator";
import { APIResponse } from "@/types";
import { request } from "@arcjet/next";
import { revalidatePath } from "next/cache";
import { randomUUID } from "crypto";

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

export async function createInstructor(
  values: InstructorSchemaType,
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

    const validation = instructorSchema.safeParse(values);

    if (!validation.success) {
      return {
        status: "error",
        message: "Invalid Form Data",
      };
    }

    // Check if user with this email already exists
    const existingUser = await db.user.findUnique({
      where: { email: values.email },
    });

    if (existingUser) {
      return {
        status: "error",
        message: "A user with this email already exists",
      };
    }

    await db.user.create({
      data: {
        id: randomUUID(),
        name: values.name,
        email: values.email,
        emailVerified: false,
        role: "instructor",
        phone: values.phone,
        bioFr: values.bioFr,
        bioEn: values.bioEn,
        specialties: values.specialties,
        certifications: values.certifications || [],
        experience: values.experience,
        image: values.image || null,
        images: values.images || [],
        isActive: true,
        rating: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    revalidatePath("/admin/instructors");

    return {
      status: "success",
      message: "Instructor Created Successfully",
    };
  } catch (error) {
    console.error("Error creating instructor:", error);
    return {
      status: "error",
      message: "Failed to create instructor",
    };
  }
}

export async function deleteInstructor(id: string): Promise<APIResponse> {
  const session = await requireAdmin();

  try {
    const req = await request();

    const decision = await arcjet.protect(req, {
      fingerprint: session?.user.id as string,
    });

    if (decision.isDenied()) {
      return {
        status: "error",
        message: "Access denied",
      };
    }

    // Check if instructor has any associated lessons
    const lessonsCount = await db.lesson.count({
      where: {
        instructorId: id,
        status: {
          not: "Archived",
        },
      },
    });

    if (lessonsCount > 0) {
      return {
        status: "error",
        message:
          "Cannot delete instructor with active lessons. Please reassign or archive their lessons first.",
      };
    }

    // Soft delete by setting isActive to false instead of hard delete
    await db.user.update({
      where: {
        id,
        role: "instructor",
      },
      data: {
        isActive: false,
        updatedAt: new Date(),
      },
    });

    revalidatePath("/admin/instructors");

    return {
      status: "success",
      message: "Instructor deactivated successfully",
    };
  } catch (error) {
    console.error("Error deleting instructor:", error);
    return {
      status: "error",
      message: "Failed to deactivate instructor",
    };
  }
}

export async function getInstructors() {
  await requireAdmin();

  try {
    const instructors = await db.user.findMany({
      where: {
        role: "instructor",
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        bioEn: true,
        bioFr: true,
        specialties: true,
        certifications: true,
        experience: true,
        rating: true,
        image: true,
        createdAt: true,
        _count: {
          select: {
            lessonsAsInstructor: {
              where: {
                status: {
                  not: "Archived",
                },
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return instructors;
  } catch (error) {
    console.error("Error fetching instructors:", error);
    return [];
  }
}

export async function updateInstructor(
  id: string,
  values: InstructorSchemaType,
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

    const validation = instructorSchema.safeParse(values);

    if (!validation.success) {
      return {
        status: "error",
        message: "Invalid Form Data",
      };
    }

    // Check if another user with this email already exists
    const existingUser = await db.user.findFirst({
      where: {
        email: values.email,
        id: { not: id },
      },
    });

    if (existingUser) {
      return {
        status: "error",
        message: "A user with this email already exists",
      };
    }

    await db.user.update({
      where: {
        id,
        role: "instructor",
      },
      data: {
        name: values.name,
        email: values.email,
        phone: values.phone,
        bioFr: values.bioFr,
        bioEn: values.bioEn,
        specialties: values.specialties,
        certifications: values.certifications || [],
        experience: values.experience,
        image: values.image || null,
        images: values.images || [],
        updatedAt: new Date(),
      },
    });

    revalidatePath("/admin/instructors");

    return {
      status: "success",
      message: "Instructor Updated Successfully",
    };
  } catch (error) {
    console.error("Error updating instructor:", error);
    return {
      status: "error",
      message: "Failed to update instructor",
    };
  }
}

export async function getInstructorById(id: string) {
  await requireAdmin();

  try {
    const instructor = await db.user.findUnique({
      where: {
        id,
        role: "instructor",
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        bioEn: true,
        bioFr: true,
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
            startTime: true,
            endTime: true,
            status: true,
            _count: {
              select: {
                Booking: true,
              },
            },
          },
          where: {
            status: {
              not: "Archived",
            },
          },
          orderBy: {
            startTime: "asc",
          },
        },
        instructorReviews: {
          select: {
            id: true,
            rating: true,
            comment: true,
            createdAt: true,
            user: {
              select: {
                name: true,
              },
            },
          },
          where: {
            isApproved: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    return instructor;
  } catch (error) {
    console.error("Error fetching instructor:", error);
    return null;
  }
}

export type GetInstructorType = Awaited<ReturnType<typeof getInstructors>>[0];
export type GetInstructorByIdType = Awaited<
  ReturnType<typeof getInstructorById>
>;
