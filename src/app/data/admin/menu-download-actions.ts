"use server";

import { requireAdmin } from "@/app/data/admin/require-admin";
import { aj, detectBot, fixedWindow } from "@/lib/arcjet";
import { db } from "@/lib/db";
import {
  downloadDocumentSchema,
  DownloadDocumentSchemaType,
} from "@/lib/validator";
import type { APIResponse } from "@/types";
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

export async function getActiveDownloadDocument() {
  try {
    const document = await db.downloadDocument.findFirst({
      where: {
        isActive: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return document;
  } catch (error) {
    console.error("Error fetching active download document:", error);
    return null;
  }
}

export async function getAllDownloadDocuments() {
  try {
    const documents = await db.downloadDocument.findMany({
      orderBy: {
        updatedAt: "desc",
      },
    });

    return documents;
  } catch (error) {
    console.error("Error fetching download documents:", error);
    return [];
  }
}

export async function updateDownloadDocument(
  values: DownloadDocumentSchemaType,
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

    const validation = downloadDocumentSchema.safeParse(values);

    if (!validation.success) {
      return {
        status: "error",
        message: "Invalid Form Data",
      };
    }

    await db.$transaction(async (tx) => {
      // Deactivate all existing documents
      await tx.downloadDocument.updateMany({
        where: {
          isActive: true,
        },
        data: {
          isActive: false,
        },
      });

      // Create new active document
      await tx.downloadDocument.create({
        data: {
          ...validation.data,
          isActive: true,
        },
      });
    });

    revalidatePath("/admin/download-document");
    revalidatePath("/");

    return {
      status: "success",
      message: "Download document updated successfully",
    };
  } catch (error) {
    console.error("Error updating download document:", error);
    return {
      status: "error",
      message: "Failed to update document",
    };
  }
}

export async function deleteDownloadDocument(id: string): Promise<APIResponse> {
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

    await db.downloadDocument.delete({
      where: {
        id,
      },
    });

    revalidatePath("/admin/menu-document");
    revalidatePath("/");

    return {
      status: "success",
      message: "Document deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting download document:", error);
    return {
      status: "error",
      message: "Failed to delete document",
    };
  }
}

export type DownloadDocumentType = Awaited<
  ReturnType<typeof getActiveDownloadDocument>
>;
