import { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { useState } from "react";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import Message from "~/components/DashBoardCustomMessagesDesign/Message";
import OrdersTable from "~/components/common/OrderPage/OrdersTable";

import { getAllMessages } from "~/models/customMessage.server";
import { getOrdersByUserId } from "~/models/order.server";
import { isUserClient, requireUser, requireUserId } from "~/session.server";
export const meta: MetaFunction = () => [{ title: "Titulinis - Žemaičiai" }];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await requireUserId(request);
  const userOrders = await getOrdersByUserId(userId, true);
  const isClient = await isUserClient(request);
  const customMessages = await getAllMessages();

  return typedjson({
    orders: userOrders,
    isClient: isClient,
    customMessages: customMessages,
  });
};

const Dashboard = () => {
  const data = useTypedLoaderData<typeof loader>();
  const [worker, setWorker] = useState(false);
  const [searchQueries, setSearchQueries] = useState<{ [key: string]: string }>(
    {
      mainTable: "",
      importantTable: "",
    },
  );
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
    <div className="flex h-full w-full">
      <div className="flex flex-col h-full w-full bg-custom-100 overflow-auto">
        {data.customMessages.map(
          (message) =>
            message.visibility && (
              <div key={message.id}>
                <Message msg={message.message} priority={message.priority} />
              </div>
            ),
        )}
        <div className="flex grow mb-4 ml-4 mr-4">
          <div className="pt-2 pl-6 pr-6 pb-6 bg-custom-200 text-medium mt-3 ml-3 mr-1 w-full md:w-[calc(100% - 360px)]">
            <h1 className="text-3xl font-mono font-font-extralight pb-3">
              Penki naujausi užsakymai
            </h1>
            <div className="w-full">
              <OrdersTable
                orderCards={data.orders}
                handleSearch={(event) => handleSearch(event, "mainTable")}
                searchQuery={searchQueries.mainTable}
                title={`${worker ? "Darbų sąrašas" : "Jūsų užsakymų sąrašas"}`}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
