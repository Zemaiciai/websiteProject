import { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { useState } from "react";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import Message from "~/components/DashBoardCustomMessagesDesign/Message";
import OrdersTableForDashboard from "~/components/common/OrderPage/OrdersTableForDashboard";

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

  const placedOrderFiltered = data?.orders?.filter((order) =>
    order.orderStatus.includes("PLACED"),
  );

  const placedOrderFilteredCount = placedOrderFiltered?.length;

  return (
    <>
      {/* Flex container */}
      <div className="flex flex-col h-full">
        {/* Custom messages section */}
        <div className="bg-custom-100 overflow-auto">
          {/* Custom messages */}
          {data.customMessages.map(
            (message) =>
              message.visibility && (
                <div key={message.id}>
                  <Message msg={message.message} priority={message.priority} />
                </div>
              ),
          )}
        </div>
        {/* Main content */}
        <div className="flex flex-col md:flex-row flex-grow mb-3 ml-4 mr-4">
          <div className="md:w-5/6 bg-custom-200 text-medium p-4 mr-4 mb-4 md:mb-0">
            {/* Your statistics */}
            <div className="pt-2 pl-3 pr-6 pb-6 mb-4">
              <h1 className="text-3xl font-mono font-extralight pb-3 pt-2">
                Jūsų statistika
              </h1>
            </div>
            {/* Divider */}
            <div className="-mx-4 mb-4 flex items-center">
              <hr className="border-custom-100 w-full border-[7px]" />
            </div>
            {/* Recent orders */}
            <div className="pt-2 pl-3 pr-6 pb-6">
              <h1 className="text-3xl font-mono font-extralight pb-3 pt-2">
                Penki naujausi užsakymai
              </h1>
              <div className="w-full">
                <OrdersTableForDashboard
                  orderCards={data.orders}
                  title={`${
                    worker ? "Darbų sąrašas" : "Jūsų užsakymų sąrašas"
                  }`}
                />
              </div>
            </div>
          </div>
          {/* Sidebar */}
          <div className="md:w-1/6 bg-custom-200 text-medium p-4 text-center">
            <div className="flex flex-col justify-center">
              <h1 className="text-3xl font-mono font-extralight pb-3 pt-2">
                Pranešimai
              </h1>
              <div className="-mx-5">
                {Number(placedOrderFilteredCount) > 0 && (
                  <Message msg={"Turite naujų užsakymų!"} priority={"3"} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
