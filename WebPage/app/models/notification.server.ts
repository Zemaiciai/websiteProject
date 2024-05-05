import { User, NotificationTypes } from "@prisma/client";

import { prisma } from "~/db.server";
import { getUserById } from "./user.server";
import { Notification } from "@prisma/client";

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

  if (senderId) {
    return await prisma.notification.create({
      data: {
        recipient: {
          connect: { id: recipientId },
        },
        senderId: senderId,
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

export async function getNotificationById(notificationId: Notification["id"]) {
  return await prisma.notification.findUnique({
    where: { id: notificationId },
  });
}

export async function updateNotificationStatus(
  notificationId: Notification["id"],
) {
  const notification = await getNotificationById(notificationId);

  if (notification?.isSeen)
    return await prisma.notification.update({
      where: { id: notificationId },
      data: {
        isSeen: false,
      },
    });
  else
    return await prisma.notification.update({
      where: { id: notificationId },
      data: {
        isSeen: true,
      },
    });
}

export async function updateNotificationStatusToRead(
  notificationId: Notification["id"],
) {
  const notification = await getNotificationById(notificationId);

  if (!notification?.isSeen)
    return await prisma.notification.update({
      where: { id: notificationId },
      data: {
        isSeen: true,
      },
    });
  else return;
}
