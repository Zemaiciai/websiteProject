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
