"use server";

import { requireAdmin } from "@/app/data/admin/require-admin";
import { aj, detectBot, fixedWindow } from "@/lib/arcjet";
import { db } from "@/lib/db";
import { instructorSchema, InstructorSchemaType } from "@/lib/validator";
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

    await db.instructor.create({
      data: {
        name: values.name,
        email: values.email,
        phone: values.phone,
        bioFr: values.bioFr,
        bioEn: values.bioEn,
        specialties: values.specialties,
        certifications: values.certifications || [],
        experience: values.experience,
        imageUrl: values.imageUrl || "",
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

    await db.instructor.delete({
      where: { id },
    });

    revalidatePath("/admin/instructors");

    return {
      status: "success",
      message: "Instructor deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting instructor:", error);
    return {
      status: "error",
      message: "Failed to delete instructor",
    };
  }
}

export async function getInstructors() {
  await requireAdmin();

  try {
    const instructors = await db.instructor.findMany({
      where: {
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        email: true,
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

export type GetInstructorType = Awaited<ReturnType<typeof getInstructors>>[0];
