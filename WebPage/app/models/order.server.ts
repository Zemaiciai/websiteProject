import {
  OrderStatus,
  type Order,
  type Password,
  type User,
} from "@prisma/client";
import bcrypt from "bcryptjs";

import { prisma } from "~/db.server";
import { getUserByEmail, getUserById } from "./user.server";

export type { Order } from "@prisma/client";

export async function getOrderById(id: Order["id"]) {
  return prisma.order.findUnique({ where: { id } });
}

export async function getOrdersByUserId(
  userId: User["id"],
  includeUserName?: boolean,
): Promise<Order[] | null> {
  try {
    let includeCreatedBy = {};
    if (includeUserName) {
      includeCreatedBy = { createdBy: { select: { userName: true } } };
    }

    const workerOrders = await prisma.order.findMany({
      where: {
        workerId: userId,
      },
      include: includeCreatedBy,
    });

    if (workerOrders.length > 0) {
      return workerOrders;
    }

    const customerOrders = await prisma.order.findMany({
      where: {
        customerId: userId,
      },
      include: includeCreatedBy,
    });

    if (customerOrders.length > 0) {
      return customerOrders;
    }

    return null;
  } catch (error) {
    console.error("Error fetching orders by user ID:", error);
    return null;
  }
}

export async function getOrdersByEmail(email: User["email"]) {
  const user = await getUserByEmail(email);
  if (!user) return null;

  return getOrdersByUserId(user.id);
}

export async function createOrder(
  orderName: string,
  createdBy: User,
  worker: User,
  completionDate: Date,
  revisionDate: Date,
  description: string,
  footageLink: string,
) {
  return prisma.order.create({
    data: {
      orderName: orderName,
      completionDate: completionDate,
      revisionDate: revisionDate,
      orderStatus: OrderStatus.PLACED,
      description: description,
      footageLink: footageLink,
      worker: {
        connect: { id: worker.id },
      },
      createdBy: {
        connect: { id: createdBy.id },
      },
    },
  });
}

export async function deleteOrdersByEmail(email: User["email"]) {
  const orders = await getOrdersByEmail(email);

  if (!orders) return null;

  for (const order of orders) {
    await prisma.order.delete({
      where: { id: order.id },
    });
  }

  return true;
}
