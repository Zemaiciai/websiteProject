import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import { Form } from "@remix-run/react";
import { useEffect, useState } from "react";
import {
  redirect,
  typedjson,
  useTypedActionData,
  useTypedLoaderData,
} from "remix-typedjson";
import OrderTimer from "~/components/common/OrderPage/OrderTimer";
import {
  getOrderById,
  updateOrder,
  updateOrderStatus,
} from "~/models/order.server";
import { User, getUserByEmail, getUserById } from "~/models/user.server";
import { isUserClient, requireUser } from "~/session.server";
import OrderDatePicker from "~/components/common/OrderPage/OrderDatePicker";
import OrderInput from "~/components/common/OrderPage/OrderInput";
import { validateOrderData } from "~/utils";
import { OrderErrors } from "./orders.new";
import {
  NotificationTypes,
  sendNotification,
} from "~/models/notification.server";
import { OrderStatus } from "@prisma/client";
import RenderStatus from "~/components/common/OrderPage/OrderStatus";
export { OrderStatus } from "@prisma/client";

export const meta: MetaFunction = () => [
  { title: "Užsakymo peržiūra - Žemaičiai" },
];

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  await requireUser(request);
  const { orderId } = params;

  if (!orderId) {
    throw new Error("order ID is missing");
  }
  const order = await getOrderById(orderId);
  if (!order) return redirect("/orders");

  const worker = await getUserById(order.workerId);
  const customer = await getUserById(order.customerId);

  if (!worker || !customer) throw new Error("Worker or customer not found");

  return order
    ? typedjson({
        order: order,
        worker: worker,
        customer: customer,
        isClient: await isUserClient(request),
      })
    : redirect("/orders");
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const intent = String(formData.get("intent"));
  const orderId = String(formData.get("orderId"));

  if (!orderId) return typedjson({ errors: null }, { status: 400 });

  switch (intent) {
    case "update":
      const currentOrder = await getOrderById(orderId);

      const newOrderName = String(formData.get("orderName"));
      const newWorkerEmail = String(formData.get("workerEmail"));
      const newCompletionDateString = formData.get("completionDate") as string;
      const newCompletionDate = new Date(newCompletionDateString);
      const newRevisionDays = parseInt(String(formData.get("revisionDays")));
      const newDescription = String(formData.get("description"));
      const newFootageLink = String(formData.get("footageLink"));

      const createdBy = await getUserById(currentOrder!.customerId);

      let validationErrors: OrderErrors | null = {};

      if (newRevisionDays !== null)
        newCompletionDate.setDate(
          newCompletionDate.getDate() + newRevisionDays,
        );

      const additionalErrors = await validateOrderData(
        newRevisionDays,
        newOrderName,
        newCompletionDate,
        newWorkerEmail,
        newDescription,
        newFootageLink,
      );

      const worker = await getUserByEmail(newWorkerEmail);

      if (!createdBy) {
        validationErrors.customerNotFound = "Nerastas užsakovas";
      }
      if (!worker) {
        validationErrors.workerNotFound = "Nerastas darbuotuojas";
      }
      if (worker?.email === createdBy?.email) {
        validationErrors.wrongUser = "Negalima sukurti užsakymo sau";
      } else if (worker?.role === "client")
        validationErrors.wrongUser =
          "Reikia pasirinkti darbuotoja, o ne klientą";

      // If there are additional errors we append them to the existing validation errors
      if (additionalErrors !== null && typeof additionalErrors === "object") {
        validationErrors = { ...validationErrors, ...additionalErrors };
      }

      if (Object.keys(validationErrors).length > 0) {
        return typedjson({ errors: validationErrors }, { status: 400 });
      }

      await updateOrder(
        orderId,
        newOrderName,
        createdBy!, // Non-null assertion
        worker!, // Non-null assertion
        newCompletionDate,
        newRevisionDays,
        newDescription,
        newFootageLink,
      );
      break;
    case "changeStatus":
      const state = formData.get("action");
      const order = await getOrderById(orderId, true);

      if (!order) return typedjson({ errors: null }, { status: 400 });

      const currentWorker = await getUserById(order.workerId);

      let newStatus: OrderStatus | undefined;

      switch (state) {
        case "Priimti":
          await sendNotification(
            order.customerId,
            `Užsakymą ${order.orderName} vartotojas ${currentWorker?.userName} priėmė`,
            NotificationTypes.ORDER_ACCEPTED,
            order.id,
          );
          newStatus = OrderStatus.ACCEPTED;
          break;
        case "Atmesti":
          await sendNotification(
            order.customerId,
            `Užsakymą ${order.orderName} vartotojas ${currentWorker?.userName} atmetė`,
            NotificationTypes.ORDER_DECLINED,
            order.id,
          );
          newStatus = OrderStatus.DECLINED;
          break;
        case "Sumokėti":
          await sendNotification(
            order.workerId,
            `Už užsakymą ${order.orderName} sumokėta`,
            NotificationTypes.ORDER_PAYED,
            order.id,
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
      }
  }

  return typedjson({ errors: null }, { status: 400 });
};

interface UserCardProps {
  user: User;
}

function UserCard({ user }: UserCardProps) {
  return (
    <div className="pt-5 flex w-1/2 flex-col flex-wrap justify-center">
      <span className="font-medium text-center">{user.role}</span>
      <div
        key={user.id}
        className="w-full bg-white border border-gray-200 rounded-lg shadow mb-4"
      >
        <div className="flex flex-col items-center pt-4 pb-10">
          <img
            className="w-24 h-24 mb-3 rounded-full shadow-lg"
            src="data:image/png;base64,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"
            alt={`${user.firstName} ${user.lastName}'s profile`}
          />
          <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">
            {user.firstName} {user.lastName}
          </h5>
          <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
        </div>
      </div>
    </div>
  );
}

export default function OrderDetailPage() {
  const { order, worker, customer, isClient } =
    useTypedLoaderData<typeof loader>();
  const actionData = useTypedActionData<typeof action>();

  const [activeTabUsers, setActiveTabUsers] = useState("mainPage");
  const handleTabClickUser = (tab: string) => {
    setActiveTabUsers(tab);
  };
  const [canPay, setCanPay] = useState(false);
  const [ended, setEnded] = useState(false);

  const [selectedDate, setSelectedDate] = useState(new Date());

  const [selectedDay, setSelectedDay] = useState<string>("0");

  const handleDateChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
    type: string,
  ) => {
    const { value } = event.target;
    let newDate = new Date(selectedDate);

    switch (type) {
      case "month":
        newDate.setMonth(parseInt(value, 10) - 1);
        break;
      case "day":
        newDate.setDate(parseInt(value, 10));
        break;
      case "year":
        newDate.setFullYear(parseInt(value, 10));
        break;
      case "hour":
        newDate.setHours(0, 0, 0, 0);
        newDate.setHours(parseInt(value));
        break;
      default:
        break;
    }

    setSelectedDate(newDate);
  };

  useEffect(() => {
    setSelectedDate(order.completionDate);
  }, [!selectedDate]);

  useEffect(() => {
    if (!ended) setCanPay(false);

    const statusToCanPayMap = {
      [OrderStatus.ACCEPTED]: false,
      [OrderStatus.CANCELLED]: false,
      [OrderStatus.COMPLETED]: true,
      [OrderStatus.DECLINED]: false,
      [OrderStatus.IN_PROGRESS]: false,
      [OrderStatus.PAYED]: false,
      [OrderStatus.PLACED]: false,
      [OrderStatus.REMOVED]: false,
    };

    setCanPay(statusToCanPayMap[order.orderStatus] || false);
  }, [order.orderStatus]);

  const handleDayChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;
    setSelectedDay(value);
  };

  const handleOrderEnd = () => {
    setEnded(true);
  };

  return (
    <>
      <div className="pt-2 pl-6 pr-6 pb-6 bg-custom-200 text-medium mr-1 w-full md:w-[calc(100% - 360px)]">
        <ul className="flex grow-0 w-full border-b border-gray-200 pb-3 pl-3 pt-4">
          <div className="flex h-full w-full justify-between">
            <h1 className="flex w-[36rem] font-bold text-2xl">
              <span className="truncate">Užsakymas: {order?.orderName}</span>
            </h1>
            <div className="flex ml-2 justify-center items-center">
              Statusas:
              <RenderStatus status={order.orderStatus} />
              <span className="flex text-nowrap ml-2">
                <span className="pr-1">Likęs laikas:</span>
                {
                  <OrderTimer
                    orderEndDate={order.completionDate}
                    handleOrderEnd={handleOrderEnd}
                  />
                }
              </span>
            </div>
          </div>
        </ul>
        {activeTabUsers === "mainPage" ? (
          <>
            <div>
              <h1 className="font-bold text-1xl pt-4 pl-3 text-wrap">
                Užsakymo aprašymas:
              </h1>
              <h1 className=" text-1xl pt-1 pl-3 text-wrap">
                {order.description}
              </h1>
            </div>
          </>
        ) : null}

        {activeTabUsers === "viewUsers" ? (
          <div className="flex w-full grow space-x-10">
            <UserCard user={worker} />
            <UserCard user={customer} />
          </div>
        ) : null}

        {activeTabUsers === "updateOrder" && (
          <div className="flex w-full grow space-x-10">
            <div className="p-6 flex flex-col bg-custom-200 text-medium w-full h-max">
              <Form method="put">
                <div className="flex flex-wrap -mx-3">
                  <input name="orderId" value={order.id} readOnly hidden />
                  <input type="hidden" name="intent" value="update" readOnly />
                  <OrderDatePicker
                    error={actionData?.errors?.completionDate}
                    handleDateChange={handleDateChange}
                    selectedDate={selectedDate}
                    title="Pabaigos data:"
                    name="completionDate"
                    defaultDate={order.completionDate}
                  />
                  <div className="w-full md:w-1/2 px-3 mb-4">
                    <div>
                      <input
                        name="revisionDays"
                        value={selectedDay}
                        readOnly={true}
                        hidden
                      />
                      <span>Revizijos dienos (MAX 2 dienos):</span>
                    </div>
                    <label>
                      <select
                        name="reivisonDays"
                        onChange={(e) => handleDayChange(e)}
                        className="cursor-pointer focus:outline-none"
                        defaultValue={order.revisionDays}
                      >
                        <option value="" selected disabled>
                          D
                        </option>
                        {[...Array(3).keys()].map((day) => (
                          <option
                            key={day}
                            value={day}
                            defaultValue={order.revisionDays}
                          >
                            {day}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>
                  <OrderInput
                    title={"Pavadinimas"}
                    name={"orderName"}
                    defaultValue={order.orderName}
                    error={actionData?.errors?.orderName}
                  />
                  <OrderInput
                    title={"Darbuotuojo el. pastas"}
                    name={"workerEmail"}
                    defaultValue={worker.email}
                    error={
                      actionData?.errors?.workerEmail ||
                      actionData?.errors?.workerNotFound ||
                      actionData?.errors?.wrongUser
                    }
                  />
                  <OrderInput
                    title={"Aprasymas"}
                    name={"description"}
                    defaultValue={
                      order.description !== null ? order.description : undefined
                    }
                    error={actionData?.errors?.description}
                    bigger={true}
                  />
                  <OrderInput
                    title={"Video nuoruoda"}
                    name={"footageLink"}
                    defaultValue={order.footageLink}
                    error={actionData?.errors?.footageLink}
                  />
                  <button
                    type="submit"
                    className="w-full rounded bg-custom-800 mt-5 px-2 py-2 text-white hover:bg-custom-850 transition duration-300 ease-in-out"
                  >
                    Atnaujinti užsakymą
                  </button>
                </div>
              </Form>
            </div>
          </div>
        )}
      </div>

      <div className="p-6 bg-custom-200 text-medium">
        <div className="flex justify-center pb-2">
          <button
            className={`w-full cursor-pointer bg-custom-800 hover:bg-custom-850 text-white font-bold py-2 px-8 rounded text-nowrap ${
              activeTabUsers === "mainPage"
                ? "text-white  py-2 bg-custom-900  border-black "
                : "text-white  py-2 bg-custom-800 hover:bg-custom-850 transition duration-300 ease-in-out border-black"
            } w-full`}
            onClick={() => handleTabClickUser("mainPage")}
          >
            Pagrindinis
          </button>
        </div>
        <div className="flex justify-center pb-2">
          <button
            className={`w-full cursor-pointer bg-custom-800 hover:bg-custom-850 text-white font-bold py-2 px-8 rounded text-nowrap ${
              activeTabUsers === "viewUsers"
                ? "text-white  py-2 bg-custom-900  border-black "
                : "text-white  py-2 bg-custom-800 hover:bg-custom-850 transition duration-300 ease-in-out border-black"
            } w-full`}
            onClick={() => handleTabClickUser("viewUsers")}
          >
            Peržiūrėti narius
          </button>
        </div>
        {isClient && (
          <div className="flex justify-center pb-2">
            <button
              className={`w-full cursor-pointer bg-custom-800 hover:bg-custom-850 text-white font-bold py-2 px-8 rounded text-nowrap ${
                activeTabUsers === "updateOrder"
                  ? "text-white  py-2 bg-custom-900  border-black "
                  : "text-white  py-2 bg-custom-800 hover:bg-custom-850 transition duration-300 ease-in-out border-black"
              } w-full`}
              onClick={() => handleTabClickUser("updateOrder")}
            >
              Keisti informacija
            </button>
          </div>
        )}
        {order.orderStatus === "PLACED" && !isClient && (
          <Form
            method="post"
            reloadDocument
            className="flex flex-col justify-center"
          >
            <input type="hidden" name="orderId" value={order.id} readOnly />
            <input type="hidden" name="intent" value="changeStatus" readOnly />
            <input
              type="submit"
              name="action"
              value="Priimti"
              className="w-full mb-2 cursor-pointer bg-custom-800 hover:bg-custom-850 text-white font-bold py-2 px-8 rounded text-nowrap"
            />
            <input
              type="submit"
              name="action"
              value="Atmesti"
              className="w-full cursor-pointer bg-custom-800 hover:bg-custom-850 text-white font-bold py-2 px-8 rounded text-nowrap"
            />
          </Form>
        )}
        {canPay && isClient && (
          <Form method="post" className="flex justify-center">
            <input type="hidden" name="orderId" value={order.id} readOnly />
            <input type="hidden" name="intent" value="changeStatus" readOnly />
            <input
              type="submit"
              name="action"
              value="Sumokėti"
              className="w-full mb-2 cursor-pointer bg-custom-800 hover:bg-custom-850 text-white font-bold py-2 px-8 rounded text-nowrap"
            />
          </Form>
        )}
      </div>
    </>
  );
}
