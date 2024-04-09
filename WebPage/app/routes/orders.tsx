import { OrderStatus } from "@prisma/client";
import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { useEffect, useState } from "react";
import { typedjson, useTypedLoaderData } from "remix-typedjson";

import OrdersPage from "~/components/OrderPage/OrdersPage";
import { getOrdersByUserId, updateOrderStatus } from "~/models/order.server";

import { requireUserId } from "~/session.server";
import { useUser } from "~/utils";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await requireUserId(request);
  const userOrders = await getOrdersByUserId(userId, true);

  return typedjson(userOrders);
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const state = formData.get("action");
  const orderId = String(formData.get("orderId"));
  let newStatus: OrderStatus | undefined;

  if (state === "Priimti") newStatus = OrderStatus.ACCEPTED;
  if (state === "Atmesti") newStatus = OrderStatus.DECLINED;

  if (newStatus !== undefined && orderId) {
    const order = await updateOrderStatus(newStatus, orderId);
    console.log(order);
    return order;
  }

  return state;
};

export default function WorkPage() {
  const user = useUser();
  const userOrders = useTypedLoaderData<typeof loader>();

  const [worker, setWorker] = useState(false);

  useEffect(() => {
    if (user && user.role === "worker") {
      setWorker(true);
    }
  }, [user]);

  return (
    <div className="main">
      <OrdersPage orders={userOrders} worker={worker} />
    </div>
  );
}
