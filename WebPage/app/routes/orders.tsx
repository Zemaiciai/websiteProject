import { LoaderFunctionArgs, json } from "@remix-run/node";

import { useEffect, useState } from "react";
import { useLoaderData } from "react-router";
import OrdersPage from "~/components/OrderPage/OrdersPage";
import { Order, getOrdersByUserId } from "~/models/order.server";

import { requireUserId } from "~/session.server";
import { useUser } from "~/utils";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await requireUserId(request);
  const userOrders = await getOrdersByUserId(userId);

  return json(userOrders);
};

export default function WorkPage() {
  const user = useUser();
  const userOrders = useLoaderData() as Order[];
  const [worker, setWorker] = useState(true);

  // THIS IS VERY STUPID
  // FOR SOME REASON AFTER GETTING THE DATE FROM THE LOADER
  // IT GETS CONVERTED TO A STRING
  // TODO: CHANGE THIS
  if (userOrders) {
    userOrders.forEach((order) => {
      order.completionDate = new Date(order.completionDate);
      order.revisionDate = new Date(order.revisionDate);
    });
  }

  console.log(typeof userOrders[0].completionDate);

  useEffect(() => {
    if (user && user.id === "worker") {
      setWorker(true);
    }
  }, [user]);

  return (
    <div className="main">
      <OrdersPage orders={userOrders} />
    </div>
  );
}
