import {
  NotificationTypes,
  OrderStatus,
  OrderSubmission,
  type Order,
  type User,
} from "@prisma/client";

import { prisma } from "~/db.server";
import { getUserByEmail } from "./user.server";
import { sendNotification } from "./notification.server";
import OrdersTable from "~/components/common/OrderPage/OrdersTable";
import { connect } from "node:http2";

export type { Order } from "@prisma/client";

export async function updateOrderStatus(
  newStatus: OrderStatus,
  orderId: Order["id"],
) {
  const updatedOrder = await prisma.order.update({
    where: { id: orderId },
    data: { orderStatus: newStatus },
  });

  return updatedOrder;
}

export async function getOrderById(id: Order["id"], includeUserID?: boolean) {
  if (includeUserID) {
    const orderWithIDs = await prisma.order.findUnique({
      where: { id },
      include: {
        createdBy: { select: { id: true } },
        worker: { select: { id: true } },
      },
    });

    return orderWithIDs;
  } else {
    const orderNoIDs = await prisma.order.findUnique({ where: { id } });

    return orderNoIDs;
  }
}

export async function checkOrders() {
  const currentDate = new Date();

  const orders = await prisma.order.findMany({
    where: {
      completionDate: { lte: currentDate },
      orderStatus: {
        in: [OrderStatus.PLACED, OrderStatus.ACCEPTED],
      },
    },
  });

  await Promise.all(
    orders.map(async (order) => {
      console.log(`Sending notifications and updating status for ${order.id}`);

      await sendNotification(
        order.customerId,
        `Užsakymui ${order.orderName} pasibaigė laikas`,
        NotificationTypes.ORDER_TIME_ENDED,
        order.id,
      );
      await sendNotification(
        order.workerId,
        `Užsakymui ${order.orderName} pasibaigė laikas`,
        NotificationTypes.ORDER_TIME_ENDED,
        order.id,
      );
      await updateOrderStatus(OrderStatus.TIME_ENDED, order.id);
    }),
  );
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

export async function updateOrder(
  orderId: Order["id"],
  orderName?: string,
  createdBy?: User,
  worker?: User,
  completionDate?: Date,
  revisionDays?: number,
  description?: string,
  footageLink?: string,
) {
  const check = await getOrderById(orderId);

  if (
    (check?.orderStatus === OrderStatus.DECLINED ||
      check?.orderStatus === OrderStatus.PLACED) &&
    worker?.id !== check?.workerId
  ) {
    return prisma.order.update({
      where: { id: orderId },
      data: {
        orderName: orderName,
        completionDate: completionDate,
        revisionDays: revisionDays,
        description: description,
        footageLink: footageLink,
        orderStatus: OrderStatus.PLACED,
        worker: {
          connect: { id: worker?.id },
        },
        createdBy: {
          connect: { id: createdBy?.id },
        },
      },
    });
  } else {
    return prisma.order.update({
      where: { id: orderId },
      data: {
        orderName: orderName,
        completionDate: completionDate,
        revisionDays: revisionDays,
        description: description,
        footageLink: footageLink,
        createdBy: {
          connect: { id: createdBy?.id },
        },
      },
    });
  }
}

export async function createOrder(
  orderName: string,
  createdBy: User,
  worker: User,
  completionDate: Date,
  revisionDays: number,
  description: string,
  footageLink: string,
) {
  return prisma.order.create({
    data: {
      orderName: orderName,
      completionDate: completionDate,
      revisionDays: revisionDays,
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

export async function calculateOrdersByUserID(userId: User["id"]) {
  const orders = await getOrdersByUserId(userId);

  const completedOrders = orders?.filter(
    (order) =>
      order.orderStatus === OrderStatus.COMPLETED ||
      order.orderStatus === OrderStatus.PAYED,
  );
  const rejectedOrders = orders?.filter((order) =>
    order.orderStatus.includes(OrderStatus.DECLINED),
  );

  const completedOrdersCount = completedOrders?.length;
  const allOrdersCount = Number(orders?.length) - Number(rejectedOrders);

  const result = (Number(completedOrdersCount) / Number(allOrdersCount)) * 100;
  if (result > 0) {
    return result;
  }
  return 0;
}

export async function getTasksRemaining(userId: User["id"]) {
  const orders = await getOrdersByUserId(userId);

  const inProgressOrders = orders?.filter(
    (order) => order.orderStatus == OrderStatus.ACCEPTED,
  );

  const inProgressOrdersCount = inProgressOrders?.length;

  if (Number(inProgressOrdersCount) > 0) {
    return inProgressOrdersCount;
  }
  return 0;
}

async function createNewSubmission(
  submissionLink: OrderSubmission["submissionLink"],
  additionalDescription?: OrderSubmission["additionalDescription"],
) {
  return await prisma.orderSubmission.create({
    data: {
      submissionLink: submissionLink,
      additionalDescription: additionalDescription,
    },
  });
}

export async function addSubmission(
  orderId: Order["id"],
  submissionLink: OrderSubmission["submissionLink"],
  additionalDescription?: OrderSubmission["additionalDescription"],
) {
  const submission = await createNewSubmission(
    submissionLink,
    additionalDescription,
  );

  return prisma.order.update({
    where: { id: orderId },
    data: { workSubmission: { connect: { id: submission.id } } },
  });
}

export async function updateSubmission(
  submissionId: OrderSubmission["id"],
  submissionLink: OrderSubmission["submissionLink"],
  additionalDescription?: OrderSubmission["additionalDescription"],
) {
  return prisma.orderSubmission.update({
    where: { id: submissionId },
    data: {
      submissionLink: submissionLink,
      additionalDescription: additionalDescription,
    },
  });
}

export async function getOrderSubmission(orderId: Order["id"]) {
  const order = await getOrderById(orderId);

  if (!order || !order.submissionId) {
    return null;
  }

  return prisma.orderSubmission.findUnique({
    where: { id: order.submissionId },
  });
}
