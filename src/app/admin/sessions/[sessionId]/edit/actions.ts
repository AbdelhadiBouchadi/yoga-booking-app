"use server";

import { requireAdmin } from "@/app/data/admin/require-admin";
import { aj, detectBot, fixedWindow } from "@/lib/arcjet";
import { db } from "@/lib/db";
import { lessonSchema, LessonSchemaType } from "@/lib/validator";
import { APIResponse } from "@/types";
import { request } from "@arcjet/next";

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
