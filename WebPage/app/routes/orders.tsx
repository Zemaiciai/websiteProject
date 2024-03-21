import { LoaderFunctionArgs, json } from "@remix-run/node";

import { useEffect, useState } from "react";
import OrdersPage from "~/components/OrderPage/OrdersPage";

import { getUserById } from "~/models/user.server";
import { requireUserId } from "~/session.server";
import { useUser } from "~/utils";

/* TODO: Change this to return the actual orders of a user*/
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await requireUserId(request);
  const userOrders = await getUserById(userId);
  return json(userOrders);
};

export default function WorkPage() {
  const user = useUser();
  const [worker, setWorker] = useState(true);

  useEffect(() => {
    if (user && user.id === "worker") {
      setWorker(true);
    }
  }, [user]);

  return (
    <div className="main">
      <OrdersPage />
    </div>
  );
}
