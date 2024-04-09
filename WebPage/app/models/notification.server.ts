import type { User, NotificationTypes } from "@prisma/client";

import { prisma } from "~/db.server";
import { getUserById } from "./user.server";

export async function sendNotification(
  userId: User["id"],
  type: NotificationTypes,
) {
  if (!(await getUserById(userId))) {
    return null;
  }

  return await prisma.notification.create({
    data: {
      recipient: {
        connect: { id: userId },
      },
      isSeen: false,
      notificationType: type,
    },
  });
}

export async function getUserNotifications(userId: User["id"]) {
  return await prisma.notification.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "asc",
    },
  });
}
