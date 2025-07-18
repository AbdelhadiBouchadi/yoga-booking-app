"use server";

import { requireAdmin } from "@/app/data/admin/require-admin";
import { db } from "@/lib/db";

export async function getUsers() {
  await requireAdmin();

  try {
    const users = await db.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        createdAt: true,
        bookings: {
          select: {
            id: true,
            status: true,
          },
        },
        sessions: {
          select: {
            id: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return users;
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
}

export async function deleteUser(userId: string) {
  await requireAdmin();

  try {
    await db.user.delete({
      where: {
        id: userId,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Error deleting user:", error);
    throw new Error("Failed to delete user");
  }
}

export async function getUserById(userId: string) {
  await requireAdmin();

  try {
    const user = await db.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        bookings: {
          include: {
            lesson: {
              select: {
                id: true,
                titleEn: true,
                titleFr: true,
                startTime: true,
                endTime: true,
                status: true,
              },
            },
          },
          orderBy: {
            bookedAt: "desc",
          },
        },
        sessions: {
          orderBy: {
            createdAt: "desc",
          },
        },
        reviews: {
          include: {
            lesson: {
              select: {
                titleEn: true,
                titleFr: true,
              },
            },
            instructor: {
              select: {
                name: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    return user;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
}

export async function updateUserRole(userId: string, role: string) {
  await requireAdmin();

  try {
    await db.user.update({
      where: {
        id: userId,
      },
      data: {
        role: role,
      },
    });
    return { success: true };
  } catch (error) {
    console.error("Error updating user role:", error);
    throw new Error("Failed to update user role");
  }
}

export type GetUserType = Awaited<ReturnType<typeof getUsers>>[0];
export type GetUserByIdType = Awaited<ReturnType<typeof getUserById>>;
