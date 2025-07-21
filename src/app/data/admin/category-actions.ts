"use server";

import { requireAdmin } from "@/app/data/admin/require-admin";
import { aj, detectBot, fixedWindow } from "@/lib/arcjet";
import { db } from "@/lib/db";
import { categorySchema, CategorySchemaType } from "@/lib/validator";
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

export async function createCategory(
  values: CategorySchemaType,
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

    const validation = categorySchema.safeParse(values);

    if (!validation.success) {
      return {
        status: "error",
        message: "Invalid Form Data",
      };
    }

    const newCategory = await db.category.create({
      data: {
        nameEn: values.nameEn,
        nameFr: values.nameFr,
      },
    });

    revalidatePath("/admin/workshops");
    revalidatePath("/admin/lessons/create");

    return {
      status: "success",
      message: "Category Created Successfully",
      data: newCategory,
    };
  } catch (error) {
    console.error("Error creating category:", error);
    return {
      status: "error",
      message: "Failed to create category",
    };
  }
}

export async function deleteCategory(id: string): Promise<APIResponse> {
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

    await db.category.delete({
      where: { id },
    });

    revalidatePath("/admin/categories");
    revalidatePath("/admin/lessons/create");

    return {
      status: "success",
      message: "Category deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting category:", error);
    return {
      status: "error",
      message: "Failed to delete category",
    };
  }
}

export async function getCategories() {
  await requireAdmin();

  try {
    const categories = await db.category.findMany({
      orderBy: {
        nameEn: "asc",
      },
    });
    return categories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

export type GetCategoryType = Awaited<ReturnType<typeof getCategories>>[0];
