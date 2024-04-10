import { prisma } from "~/db.server";
import { createCustomMessageLog } from "./adminLogs.server";

export async function createMessage(
  messageName: string,
  priority: string,
  message: string,
  admin: string,
) {
  createCustomMessageLog(messageName, admin);
  return prisma.customMessage.create({
    data: {
      name: messageName,
      priority: priority,
      message: message,
      visibility: true,
    },
  });
}

export async function changeMessageVisibility(index: string) {
  const messageget = await prisma.customMessage.findUnique({
    where: {
      id: index,
    },
  });

  if (messageget?.visibility === true) {
    const updatedMessage = await prisma.customMessage.update({
      where: {
        id: index,
      },
      data: {
        visibility: false,
      },
    });
    return updatedMessage;
  } else {
    const updatedMessage = await prisma.customMessage.update({
      where: {
        id: index,
      },
      data: {
        visibility: true,
      },
    });
    return updatedMessage;
  }
}

export async function getAllMessages() {
  return prisma.customMessage.findMany();
}
