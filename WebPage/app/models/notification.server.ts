import { User, NotificationTypes } from "@prisma/client";

import { prisma } from "~/db.server";
import { getUserById } from "./user.server";
import { connect } from "node:http2";

export type { Notification } from "@prisma/client";

export async function sendNotification(
  recipientId: User["id"],
  message: string,
  type: NotificationTypes,
  senderId?: User["id"],
) {
  if (!(await getUserById(recipientId))) {
    return null;
  }

  if (senderId && (await getUserById(senderId))) {
    return await prisma.notification.create({
      data: {
        recipient: {
          connect: { id: recipientId },
        },
        sender: {
          connect: { id: senderId },
        },
        message: message,
        isSeen: false,
        notificationType: type,
      },
    });
  }

  return await prisma.notification.create({
    data: {
      recipient: {
        connect: { id: recipientId },
      },
      message: message,
      isSeen: false,
      notificationType: type,
    },
  });
}

export async function getUserNotifications(userId: User["id"]) {
  return await prisma.notification.findMany({
    where: {
      recipientId: userId,
    },
    orderBy: {
      createdAt: "asc",
    },
  });
}
