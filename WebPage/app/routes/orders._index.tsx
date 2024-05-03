import { useEffect, useState } from "react";

import { Link } from "@remix-run/react";
import OrdersTable from "~/components/common/OrderPage/OrdersTable";
import { isUserClient, requireUserId } from "~/session.server";
import {
  getOrderById,
  getOrdersByUserId,
  updateOrderStatus,
} from "~/models/order.server";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import { NotificationTypes, OrderStatus } from "@prisma/client";
import { sendNotification } from "~/models/notification.server";
import { getUserById } from "~/models/user.server";

export const meta: MetaFunction = () => [{ title: "Užsakymai - Žemaičiai" }];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await requireUserId(request);
  const userOrders = await getOrdersByUserId(userId, true);
  const isClient = await isUserClient(request);

  return typedjson({ orders: userOrders, isClient: isClient });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const state = formData.get("action");
  const orderId = String(formData.get("orderId"));
  const order = await getOrderById(orderId, true);

  if (!order) return null;

  const worker = await getUserById(order.workerId);
  const customer = await getUserById(order.customerId);

  let newStatus: OrderStatus | undefined;

  switch (state) {
    case "Priimti":
      await sendNotification(
        order.customerId,
        `Užsakymą ${order.orderName} vartotojas ${worker?.userName} priėmė`,
        NotificationTypes.ORDER_ACCEPTED,
      );
      newStatus = OrderStatus.ACCEPTED;
      break;
    case "Atmesti":
      await sendNotification(
        order.customerId,
        `Užsakymą ${order.orderName} vartotojas ${worker?.userName} atmetė`,
        NotificationTypes.ORDER_DECLINED,
      );
      newStatus = OrderStatus.DECLINED;
      break;
    case "Sumokėti":
      await sendNotification(
        order.workerId,
        `Už užsakymą ${order.orderName} sumokėta`,
        NotificationTypes.ORDER_PAYED,
      );
      newStatus = OrderStatus.PAYED;
      break;
    case "Pašalinti":
      newStatus = OrderStatus.REMOVED;
      break;
    default:
      newStatus = undefined;
      break;
  }

  if (newStatus !== undefined && orderId) {
    await updateOrderStatus(newStatus, orderId);

    return null;
  }

  return null;
};

export default function OrdersPage() {
  const data = useTypedLoaderData<typeof loader>();
  const [worker, setWorker] = useState(false);

  const [searchQueries, setSearchQueries] = useState<{ [key: string]: string }>(
    {
      mainTable: "",
      importantTable: "",
    },
  );

  useEffect(() => {
    if (!data.isClient) {
      setWorker(true);
    }
  });

  const handleSearch = (
    event: React.ChangeEvent<HTMLInputElement>,
    tableName: string,
  ) => {
    setSearchQueries({
      ...searchQueries,
      [tableName]: event.target.value,
    });
  };

  return (
    <div className="flex h-full p-4 space-x-4 bg-custom-200">
      <div className="orders-table grow flex justify-center place-items-start">
        <div className="w-full">
          <OrdersTable
            orderCards={data.orders}
            handleSearch={(event) => handleSearch(event, "mainTable")}
            searchQuery={searchQueries.mainTable}
            title={`${worker ? "Darbų sąrašas" : "Jūsų užsakymų sąrašas"}`}
          />
        </div>
      </div>

      <div className="customer-and-orderer-options flex-grow flex justify-center place-items-start">
        <div className="flex flex-col w-full">
          <div
            className={`flex button justify-center mb-4 ${worker && "hidden"}`}
          >
            <Link
              className="flex justify-center px-4 py-3 w-3/4 
                  text-white bg-custom-900 hover:bg-custom-850 
                  transition duration-300 ease-in-out rounded"
              to={"new"}
            >
              Sukurti užsakymą
            </Link>
          </div>
          <OrdersTable
            orderCards={data.orders}
            handleSearch={(event) => handleSearch(event, "importantTable")}
            searchQuery={searchQueries.importantTable}
            important={true}
            title={"Priminimų sąrašas"}
          />
        </div>
      </div>
    </div>
  );
}
