import { NotificationTypes, OrderStatus } from "@prisma/client";
import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/node";
import { Outlet, useLocation } from "@remix-run/react";

import { useEffect, useState } from "react";
import { typedjson, useTypedLoaderData } from "remix-typedjson";

import OrdersPage from "~/components/OrderPage/OrdersPage";
import NavBar from "~/components/common/NavBar/NavBar";
import NavBarHeader from "~/components/common/NavBar/NavBarHeader";
import { sendNotification } from "~/models/notification.server";
import {
  getOrderById,
  getOrdersByUserId,
  updateOrderStatus,
} from "~/models/order.server";

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
  const order = await getOrderById(orderId, true);

  if (!order) return null;

  let newStatus: OrderStatus | undefined;

  if (state === "Priimti") {
    await sendNotification(order.workerId, NotificationTypes.ORDER_ACCEPTED);
    newStatus = OrderStatus.ACCEPTED;
  } else if (state === "Atmesti") {
    await sendNotification(order.customerId, NotificationTypes.ORDER_DECLINED);
    newStatus = OrderStatus.DECLINED;
  }

  if (newStatus !== undefined && orderId) {
    await updateOrderStatus(newStatus, orderId);

    return null;
  }

  return null;
};

export default function WorkPage() {
  const [activeTab, setActiveTab] = useState("");
  const [headerTitle, setHeaderTitle] = useState("");

  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/orders") {
      setHeaderTitle("Užsakymų sąrašas");
    } else {
      setHeaderTitle("Užsakymo sukurimas");
    }
  }, [location.pathname]);

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div className="jobs-page-container flex h-screen bg-custom-100">
      <div className="navbar-container">
        <NavBar
          title={"Orders"}
          handleTabClick={handleTabClick}
          redirectTo={"orders"}
          activeTab={activeTab}
          tabTitles={["TEST", "TEST", "TEST", "TEST", "TEST", "TEST", "TEST"]}
        />
      </div>
      <div className="w-screen h-screen flex flex-col bg-custom-100 overflow-auto">
        <NavBarHeader title={headerTitle} />
        <main className="h-full m-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
