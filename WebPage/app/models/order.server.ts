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

export async function getOrdersByUserId(id: User["id"]) {
  let orders: Order[];
  orders = await prisma.order.findMany({ where: { workerId: id } });

  if (orders.length === 0) {
    orders = await prisma.order.findMany({ where: { customerId: id } });
  }

  return orders.length === 0 ? null : orders;
}

export async function getOrdersByEmail(email: User["email"]) {
  const user = await getUserByEmail(email);
  if (!user) return null;

  return getOrdersByUserId(user.id);
}

export async function createOrder(
  createdBy: User,
  worker: User,
  completionDate: Date,
  revisionDate: Date,
  description: string,
  footageLink: string,
) {
  console.log("!!CREATING ORDER!!");

  return prisma.order.create({
    data: {
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
