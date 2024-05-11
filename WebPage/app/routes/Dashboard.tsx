import { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import Message from "~/components/DashBoardCustomMessagesDesign/Message";
import OrdersTableForDashboard from "~/components/common/OrderPage/OrdersTableForDashboard";

import { getAllMessages } from "~/models/customMessage.server";
import { getConversations } from "~/models/messages.server";
import {
  calculateOrdersByUserID,
  getOrdersByUserId,
  getTasksRemaining,
} from "~/models/order.server";
import {
  checkingThirtyDaysLeft,
  getUserBalanceById,
  getUserById,
} from "~/models/user.server";
import { gettingAverageRating } from "~/models/userRatings.server";
import { isUserClient, requireUser, requireUserId } from "~/session.server";
export const meta: MetaFunction = () => [{ title: "Titulinis - Žemaičiai" }];

interface Conversation {
  id: string;
  participants: Participant[];
  updatedAt: Date;
  // Add other properties as needed
}

interface Participant {
  id: string;
  name: string;
  firstName: string; // Add firstName property
  lastName: string; // Add lastName property
  // Add other participant properties as needed
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await requireUserId(request);
  const userOrders = await getOrdersByUserId(userId, true);
  const isClient = await isUserClient(request);
  const customMessages = await getAllMessages();
  const user = await getUserById(userId);
  const thirtyDaysRemaining = await checkingThirtyDaysLeft(userId);

  const messagesList = await getConversations(userId);

  const percentageOfDoneWork = await calculateOrdersByUserID(userId);
  const tasksRemaining = await getTasksRemaining(userId);
  const userBalance = await getUserBalanceById(userId);

  const userAverageRating = await gettingAverageRating(userId);

  return typedjson({
    userId: userId,
    orders: userOrders,
    isClient: isClient,
    customMessages: customMessages,
    thirtyDaysRemaining: thirtyDaysRemaining,
    percentageOfDoneWork: percentageOfDoneWork,
    tasksRemaining: tasksRemaining,
    userBalance: userBalance,
    user: user,
    userAverageRating: userAverageRating,
    messagesList: messagesList,
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

  let eightHourOrderFiltered = data?.orders?.filter((order) => {
    if (order.completionDate instanceof Date) {
      const timeRemaining = order.completionDate.getTime() - currentTime;
      return timeRemaining < eightHoursInMs && timeRemaining >= fourHoursInMs;
    }
    return false;
  });

  eightHourOrderFiltered = eightHourOrderFiltered?.filter((order) =>
    order.orderStatus.includes("ACCEPTED"),
  );

  const eightHourOrderFilteredCount = eightHourOrderFiltered?.length;

  //Used for checking if theres any orders that will expire in 4h
  let fourHourOrderFiltered = data?.orders?.filter((order) => {
    if (order.completionDate instanceof Date) {
      const timeRemaining = order.completionDate.getTime() - currentTime;
      return timeRemaining < fourHoursInMs && timeRemaining >= 0;
    }
    return false;
  });

  fourHourOrderFiltered = fourHourOrderFiltered?.filter((order) =>
    order.orderStatus.includes("ACCEPTED"),
  );

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

  //Used for checking if any messages has to be displayed
  let checkingIfDisplayOfMessagesNeeded = false;
  if (
    Number(placedOrderFilteredCount) > 0 ||
    Number(eightHourOrderFilteredCount) > 0 ||
    Number(fourHourOrderFilteredCount) > 0 ||
    Number(expiredOrderFilteredCount) > 0
  ) {
    checkingIfDisplayOfMessagesNeeded = true;
  }

  //Checking for client side
  let checkingIfDisplayOfMessagesNeededForClient = false;
  if (Number(completedOrderFilteredCount) > 0) {
    checkingIfDisplayOfMessagesNeededForClient = true;
  }

  //For ratings
  const fullStars = Math.floor(Number(data.userAverageRating));
  const partialFillPercentage =
    (Number(data.userAverageRating) - fullStars) * 100;

  //To shwo five last messages
  const messagesList: Conversation[] =
    useLoaderData<typeof loader>().messagesList;
  messagesList.sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );

  let filteredMessagesList = messagesList;

  return (
    <>
      {/* Flex container */}
      <div className="flex flex-col h-full">
        {/* Custom messages section */}
        <div className="bg-custom-100 overflow-auto">
          {/* To show if contract is expiring soon */}
          {data.thirtyDaysRemaining && (
            <>
              <Message
                msg={
                  "Jūsų kontraktas baigs galioti už mažiau nei 30 dienų! Maloniai kviečiame susisiekti su administracija."
                }
                priority={"3"}
              />
            </>
          )}

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
            {!data.isClient && (
              <>
                <div className="pt-2 pl-3 pr-6 pb-6 mb-4">
                  <h1 className="text-3xl font-mono font-extralight pb-3 pt-2">
                    Jūsų statistika
                  </h1>
                  <div className="stats shadow-md grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="stat bg-white rounded-lg p-4 flex items-center justify-start">
                      <div className="stat-figure text-primary flex items-center justify-center w-12 h-12 bg-gray-200 rounded-full">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          className="w-8 h-8 stroke-current"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                          ></path>
                        </svg>
                      </div>
                      <div className="ml-4">
                        <div className="stat-title font-bold">
                          Jūsų uždarbis
                        </div>
                        <div className="stat-value text-primary">
                          {Number(data.userBalance).toFixed(2)}€
                        </div>
                        <div className="stat-desc">Tai tik jus motyvuoja!</div>
                      </div>
                    </div>

                    <div className="stat bg-white rounded-lg p-4 flex items-center justify-start">
                      <div className="stat-figure text-secondary flex items-center justify-center w-12 h-12 bg-gray-200 rounded-full">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          className="w-8 h-8 stroke-current"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M13 10V3L4 14h7v7l9-11h-7z"
                          ></path>
                        </svg>
                      </div>
                      <div className="ml-4">
                        <div className="stat-title font-bold">
                          Jūsų reitingas
                        </div>
                        <div className="stat-value text-secondary flex">
                          {[...Array(fullStars)].map((_, index) => (
                            <svg
                              key={index}
                              className="w-4 h-4 text-custom-800 me-1"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="currentColor"
                              viewBox="0 0 22 20"
                            >
                              <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                            </svg>
                          ))}
                          {partialFillPercentage > 0 && (
                            <svg
                              className="w-4 h-4 text-custom-800 me-1"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="currentColor"
                              viewBox="0 0 22 20"
                            >
                              <path
                                d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"
                                style={{
                                  clipPath: `inset(0 ${
                                    100 - partialFillPercentage
                                  }% 0 0)`,
                                }}
                              />
                            </svg>
                          )}
                        </div>
                        <div className="stat-desc">
                          {data.user?.ratingAmount} atsiliepimai
                        </div>
                      </div>
                    </div>

                    <div className="stat bg-white rounded-lg p-4 flex items-center justify-start">
                      <div className="stat-figure flex items-center justify-center w-12 h-12 bg-gray-200 rounded-full">
                        <div className="avatar online">
                          <div className="w-10 h-10 rounded-full overflow-hidden">
                            <img
                              src="https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg"
                              alt="Profile"
                              className="object-cover w-full h-full"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="stat-title font-bold">Esate atlike</div>
                        <div className="stat-value">
                          {Number(data.percentageOfDoneWork).toFixed(2)}% darbų
                        </div>
                        <div className="stat-desc text-secondary">
                          {Number(data.tasksRemaining)} darbų liko
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Divider */}
                <div className="-mx-4 mb-4 flex items-center">
                  <hr className="border-custom-100 w-full border-[7px]" />
                </div>
              </>
            )}

            {/*  */}
            {/*  */}
            {/*  */}
            {/*  */}
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
            {/* Divider */}
            <div className="-mx-4 mb-4 flex items-center">
              <hr className="border-custom-100 w-full border-[7px]" />
            </div>
            <div className="pt-2 pl-3 pr-6 pb-6 mb-4">
              <h1 className="text-3xl font-mono font-extralight pb-3 pt-2">
                Paskutinės penkios atnaujintos žinutės
              </h1>
              {filteredMessagesList.length > 0 ? (
                // Render the table if there are conversations
                <div>
                  <div className="flex justify-between pb-5"></div>
                  <div className="overflow-x-auto shadow-md sm:rounded-lg">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 ">
                      <thead className="text-xs text-gray-700 uppercase bg-gray-50 ">
                        <tr>
                          <th scope="col" className="p-4">
                            Vartotojas
                          </th>
                          <th scope="col" className="p-4">
                            Paskutinė žinutė
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* Map through conversations and render table rows */}
                        {filteredMessagesList.map((conversation) => (
                          <tr className="bg-white border-b ">
                            <Link
                              key={conversation.id}
                              to={`/messages/${conversation.id}`}
                              className="block"
                            >
                              <td className="px-6 py-4 cursor-pointer">
                                {/* Display participant information excluding the current user */}
                                {conversation.participants.map(
                                  (participant) =>
                                    participant.id !== data.userId && (
                                      <div key={participant.id}>
                                        <span>{participant.firstName}</span>{" "}
                                        <span>{participant.lastName}</span>
                                      </div>
                                    ),
                                )}
                              </td>
                            </Link>
                            <td className="px-6 py-4">
                              {conversation.updatedAt
                                ? new Date(conversation.updatedAt)
                                    .toLocaleDateString("en-CA", {
                                      year: "numeric",
                                      month: "2-digit",
                                      day: "2-digit",
                                    })
                                    .replace(/\//g, "-") +
                                  ", " +
                                  new Date(
                                    conversation.updatedAt,
                                  ).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: false,
                                  })
                                : null}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                // Render a message if there are no conversations
                <p className="mt-5">Nėra žinučių!</p>
              )}
            </div>
          </div>
          {/* Sidebar */}
          <div className="md:w-1/6 bg-custom-200 text-medium p-4 text-center">
            <div className="flex flex-col justify-center">
              <h1 className="text-3xl font-mono font-extralight pb-3 pt-2">
                Pranešimai
              </h1>
              {checkingIfDisplayOfMessagesNeeded ||
              checkingIfDisplayOfMessagesNeededForClient ? (
                <div className="-mx-5">
                  {/* Messages */}
                  {/* FOR WORKER SIDE OF MESSAGES */}
                  {Number(placedOrderFilteredCount) > 0 && !data.isClient && (
                    <Message msg={"Turite naujų užsakymų!"} priority={"3"} />
                  )}
                  {Number(eightHourOrderFilteredCount) > 0 &&
                    !data.isClient && (
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
                    <Message
                      msg={"Vėluojate atlikti užsakymą!"}
                      priority={"3"}
                    />
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
                </div>
              ) : (
                <h1 className="text-xl font-mono font-extralight pb-3 pt-2">
                  Neturite pranešimų
                </h1>
              )}
              {checkingIfDisplayOfMessagesNeededForClient && (
                <>
                  <div className="-mx-5">
                    {Number(completedOrderFilteredCount) > 0 &&
                      data.isClient && (
                        <Message
                          msg={"Nesate apmokėję užsakymo!"}
                          priority={"2"}
                        />
                      )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
