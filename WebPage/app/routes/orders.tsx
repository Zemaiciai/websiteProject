import { LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { useEffect, useState } from "react";
import { typedjson, useTypedLoaderData } from "remix-typedjson";

import OrdersPage from "~/components/OrderPage/OrdersPage";
import { getOrdersByUserId } from "~/models/order.server";

import { requireUserId } from "~/session.server";
import { useUser } from "~/utils";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await requireUserId(request);
  const userOrders = await getOrdersByUserId(userId, true);

  return typedjson(userOrders);
};

export default function WorkPage() {
  const user = useUser();
  const userOrders = useTypedLoaderData<typeof loader>();

  const [worker, setWorker] = useState(true);

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
