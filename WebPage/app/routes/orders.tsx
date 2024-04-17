import { NotificationTypes, OrderStatus } from "@prisma/client";
import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/node";
import { useLocation } from "@remix-run/react";

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
  const user = useUser();
  const userOrders = useTypedLoaderData<typeof loader>();

  const [worker, setWorker] = useState(false);
  const [activeTab, setActiveTab] = useState("");
  const [linkClicked, setLinkClicked] = useState(false);

  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/orders") {
      setLinkClicked(false);
    }
  }, [location.pathname]);

  const handleLinkClick = () => {
    setLinkClicked(true);
  };

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  useEffect(() => {
    if (user && (user.role === "worker" || user.role == "Super Admin")) {
      setWorker(true);
    }
  }, [user]);

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
      <div className="w-screen h-screen flex flex-col bg-custom-100 overflow-auto pb-3">
        <NavBarHeader
          title={`${linkClicked ? "Užsakymo sukurimas" : "Darbų sąrašas"}`}
        />
        <OrdersPage
          orders={userOrders}
          worker={worker}
          linkClicked={linkClicked}
          handleLinkClick={handleLinkClick}
        />
      </div>
    </div>
  );
}
