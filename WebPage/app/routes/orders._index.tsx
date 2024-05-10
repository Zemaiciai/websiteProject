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

export default function OrdersPage() {
  const data = useTypedLoaderData<typeof loader>();
  const [worker, setWorker] = useState(false);
  const [searchQueries, setSearchQueries] = useState<{ [key: string]: string }>(
    {
      mainTable: "",
      importantTable: "",
    },
  );
  const [activeTab, setActiveTab] = useState("allOrders");

  useEffect(() => {
    if (!data.isClient) {
      setWorker(true);
    }
  }, []);

  const handleSearch = (
    event: React.ChangeEvent<HTMLInputElement>,
    tableName: string,
  ) => {
    setSearchQueries({
      ...searchQueries,
      [tableName]: event.target.value,
    });
  };

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <>
      <div className="pt-2 pl-6 pr-6 pb-6 bg-custom-200 text-medium mt-3 ml-3 mr-1 w-full md:w-[calc(100% - 360px)]">
        <ul className="flex flex-wrap -mb-px border-b border-gray-200">
          <li className="me-2">
            <button
              className={`inline-block p-4  ${
                activeTab === "allOrders"
                  ? "border-custom-800 border-b-2 rounded-t-lg"
                  : "hover:text-gray-600 hover:border-gray-300"
              }`}
              onClick={() => handleTabClick("allOrders")}
            >
              Visi užsakymai
            </button>
          </li>
          <li className="me-2">
            <button
              className={`inline-block p-4  ${
                activeTab === "importantOrders"
                  ? "border-custom-800 border-b-2 rounded-t-lg"
                  : "hover:text-gray-600 hover:border-gray-300"
              }`}
              onClick={() => handleTabClick("importantOrders")}
            >
              Svarbūs užsakymai
            </button>
          </li>
        </ul>
        {activeTab === "allOrders" && (
          <>
            <div className="flex justify-between pb-5"></div>
            <OrdersTable
              orderCards={data.orders}
              handleSearch={(event) => handleSearch(event, "mainTable")}
              searchQuery={searchQueries.mainTable}
              title={`${worker ? "Darbų sąrašas" : "Jūsų užsakymų sąrašas"}`}
            />
          </>
        )}
        {activeTab === "importantOrders" && (
          <>
            <div className="flex justify-between pb-5"></div>
            <OrdersTable
              orderCards={data.orders}
              handleSearch={(event) => handleSearch(event, "importantTable")}
              searchQuery={searchQueries.importantTable}
              important={true}
              title={"Priminimų sąrašas"}
            />
          </>
        )}
      </div>
      <div className="p-6 bg-custom-200 text-medium mt-3 mr-3 ">
        <div className="flex justify-center ">
          <Link
            className="w-full cursor-pointer bg-custom-800 hover:bg-custom-850 text-white font-bold py-2 px-8 rounded text-nowrap"
            to={"new"}
          >
            Sukurti užsakymą
          </Link>
        </div>
      </div>
    </>
  );
}
