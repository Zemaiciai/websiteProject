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

  //Used for checking if theres any orders that need attention (when the worker hasnt yet declined or accepted the order)
  const placedOrderFiltered = data?.orders?.filter((order) =>
    order.orderStatus.includes("PLACED"),
  );
  const placedOrderFilteredCount = placedOrderFiltered?.length;

  //Used for checking if theres any orders that will expire from 8h to 4h
  const currentTime = new Date().getTime(); // Current time in milliseconds
  const fourHoursInMs = 4 * 60 * 60 * 1000; // 4 hours in milliseconds
  const eightHoursInMs = 8 * 60 * 60 * 1000; // 8 hours in milliseconds

  const eightHourOrderFiltered = data?.orders?.filter((order) => {
    if (order.completionDate instanceof Date) {
      const timeRemaining = order.completionDate.getTime() - currentTime;
      return timeRemaining < eightHoursInMs && timeRemaining >= fourHoursInMs;
    }
    return false;
  });
  const eightHourOrderFilteredCount = eightHourOrderFiltered?.length;

  //Used for checking if theres any orders that will expire in 4h
  const fourHourOrderFiltered = data?.orders?.filter((order) => {
    if (order.completionDate instanceof Date) {
      const timeRemaining = order.completionDate.getTime() - currentTime;
      return timeRemaining < fourHoursInMs && timeRemaining >= 0;
    }
    return false;
  });

  const fourHourOrderFilteredCount = fourHourOrderFiltered?.length;

  //Checking if the order is expired
  const expiredOrderFiltered = data?.orders?.filter((order) => {
    if (order.completionDate instanceof Date) {
      return order.completionDate.getTime() < currentTime;
    }
    return false;
  });

  const expiredOrderFilteredCount = expiredOrderFiltered?.length;

  //Used for checking if theres any orders that are completed but not paid
  const completedOrderFiltered = data?.orders?.filter((order) =>
    order.orderStatus.includes("COMPLETED"),
  );
  const completedOrderFilteredCount = completedOrderFiltered?.length;

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
                {/* FOR WORKER SIDE OF MESSAGES */}
                {Number(placedOrderFilteredCount) > 0 && !data.isClient && (
                  <Message msg={"Turite naujų užsakymų!"} priority={"3"} />
                )}
                {Number(eightHourOrderFilteredCount) > 0 && !data.isClient && (
                  <Message
                    msg={"Turite mažiau nei 8h atlikti užsakymą!"}
                    priority={"2"}
                  />
                )}
                {Number(fourHourOrderFilteredCount) > 0 && !data.isClient && (
                  <Message
                    msg={"Turite mažiau nei 4h atlikti užsakymą!"}
                    priority={"3"}
                  />
                )}
                {Number(expiredOrderFilteredCount) > 0 && !data.isClient && (
                  <Message msg={"Vėluojate atlikti užsakymą!"} priority={"3"} />
                )}
                {/* FOR CLIENT SIDE OF MESSAGES */}
                {Number(placedOrderFilteredCount) > 0 && data.isClient && (
                  <Message
                    msg={"Darbuotojas dar nepatvirtino užsakymo!"}
                    priority={"2"}
                  />
                )}
                {Number(eightHourOrderFilteredCount) > 0 && data.isClient && (
                  <Message
                    msg={"Darbuotojas turi mažiau nei 8h atlikti užsakymą!"}
                    priority={"2"}
                  />
                )}
                {Number(fourHourOrderFilteredCount) > 0 && data.isClient && (
                  <Message
                    msg={"Darbuotojas turi mažiau nei 4h atlikti užsakymą!"}
                    priority={"3"}
                  />
                )}
                {Number(expiredOrderFilteredCount) > 0 && data.isClient && (
                  <Message
                    msg={"Darbuotojas vėluoja atlikti užsakymą!"}
                    priority={"3"}
                  />
                )}
                {Number(completedOrderFilteredCount) > 0 && data.isClient && (
                  <Message msg={"Nesate apmokėję užsakymo!"} priority={"2"} />
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
