import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import { Await, Form } from "@remix-run/react";
import { Suspense, useEffect, useState } from "react";
import {
  redirect,
  typedjson,
  useTypedActionData,
  useTypedLoaderData,
} from "remix-typedjson";
import OrderTimer from "~/components/common/OrderPage/OrderTimer";
import {
  addSubmission,
  getOrderById,
  getOrderSubmission,
  updateOrder,
  updateOrderStatus,
  updateSubmission,
} from "~/models/order.server";
import { User, getUserByEmail, getUserById } from "~/models/user.server";
import { isUserClient } from "~/session.server";
import OrderDatePicker from "~/components/common/OrderPage/OrderDatePicker";
import OrderInput from "~/components/common/OrderPage/OrderInput";
import { validateOrderData, validateWorkSubmissionData } from "~/utils";
import { OrderErrors } from "./orders.new";
import {
  NotificationTypes,
  sendNotification,
} from "~/models/notification.server";
import { OrderStatus } from "@prisma/client";
import RenderStatus from "~/components/common/OrderPage/OrderStatus";
import YouTube from "react-youtube";
export { OrderStatus } from "@prisma/client";

export const meta: MetaFunction = () => [
  { title: "Užsakymo peržiūra - Žemaičiai" },
];

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
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
        workSubmission: await getOrderSubmission(orderId),
      })
    : redirect("/orders");
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const intent = String(formData.get("intent"));
  const orderId = String(formData.get("orderId"));
  const order = await getOrderById(orderId);

  const emptyError: OrderErrors | null = {};
  emptyError.noErrors = true;

  if (!order) return typedjson({ errors: emptyError }, { status: 400 });
  const customer = await getUserById(order.customerId);
  const worker = await getUserById(order.workerId);
  if (!worker || !customer)
    return typedjson({ errors: emptyError }, { status: 400 });

  switch (intent) {
    case "update":
      const newOrderName = String(formData.get("orderName")).trim();
      const newWorkerEmail = String(formData.get("workerEmail"));
      const newCompletionDateString = formData.get("completionDate") as string;
      const newCompletionDate = new Date(newCompletionDateString);
      const newRevisionDays = parseInt(String(formData.get("revisionDays")));
      const newDescription = String(formData.get("description"));
      const newFootageLink = String(formData.get("footageLink"));

      let validationErrors: OrderErrors | null = {};

      if (
        order.orderStatus !== OrderStatus.ACCEPTED &&
        order.completionDate.getTime() !== newCompletionDate.getTime()
      ) {
        validationErrors.editNotAllowed =
          "Užsakymo pabaigos laiką galima keisti tik tada jei užsakymas dar nėra priimtas ar pasibaigęs";
      }
      if (
        order.orderStatus !== OrderStatus.ACCEPTED &&
        newWorkerEmail !== worker.email
      ) {
        validationErrors.editNotAllowed =
          "Darbuotuoja keisti galima tik tada kai užsakymas dar nėra priimtas";
      }

      if (Object.keys(validationErrors).length > 0) {
        return typedjson({ errors: validationErrors }, { status: 400 });
      }

      if (newRevisionDays !== null)
        newCompletionDate.setDate(
          newCompletionDate.getDate() + newRevisionDays,
        );

      const additionalErrors = await validateOrderData(
        newRevisionDays,
        newOrderName,
        newCompletionDate,
        newWorkerEmail,
        order?.workerId,
        order?.orderStatus,
        newDescription,
        newFootageLink,
      );

      const newWorker = await getUserByEmail(newWorkerEmail);

      if (!customer) {
        validationErrors.customerNotFound = "Nerastas užsakovas";
      }

      if (!newWorker) {
        validationErrors.workerNotFound = "Nerastas darbuotuojas";
      } else if (newWorker.email === customer.email) {
        validationErrors.wrongUser = "Negalima sukurti užsakymo sau";
      } else if (newWorker.role === "client")
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
        customer,
        newWorker!, // Non-null assertion
        newCompletionDate,
        newRevisionDays,
        newDescription,
        newFootageLink,
      );

      let changesMade = "";

      if (newOrderName !== order.orderName) changesMade = "pavadinimą, ";
      if (newWorker!.id !== order.workerId) changesMade += "darbuotuoją, ";
      if (newCompletionDate.getTime() !== order.completionDate.getTime())
        changesMade += "pabaigos datą, ";
      if (newDescription !== order.description) changesMade += "aprašymą, ";
      if (newFootageLink !== order.footageLink)
        changesMade += "video nuorodą, ";

      if (changesMade.length > 0)
        await sendNotification(
          newWorker!.id,
          `Vartotojas ${
            customer.userName
          } užsakyme ${order?.orderName} pakeitė ${changesMade.substring(
            0,
            changesMade.length - 2,
          )}`,
          NotificationTypes.ORDER_UPDATED,
          orderId,
        );

      return typedjson({ errors: emptyError }, { status: 200 });
    case "changeStatus":
      const state = formData.get("action");

      if (!order) return typedjson({ errors: null }, { status: 400 });

      let newStatus: OrderStatus | undefined;

      switch (state) {
        case "Priimti":
          await sendNotification(
            order.customerId,
            `Užsakymą ${order.orderName} vartotojas ${worker.userName} priėmė`,
            NotificationTypes.ORDER_ACCEPTED,
            order.id,
          );
          newStatus = OrderStatus.ACCEPTED;
          break;
        case "Atmesti":
          await sendNotification(
            order.customerId,
            `Užsakymą ${order.orderName} vartotojas ${worker.userName} atmetė`,
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
          if (order.orderStatus == "LATE") newStatus = OrderStatus.PAYED_LATE;
          else newStatus = OrderStatus.PAYED;
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

      return typedjson({ errors: null }, { status: 200 });
      break;
    case "submitWork":
      const submissionLink = String(formData.get("submissionLink"));
      const additionalDescription = String(
        formData.get("additionalDescription"),
      );

      let workSubmissionErrors: OrderErrors | null = {};

      const workSubmissionAditionalErrors = await validateWorkSubmissionData(
        submissionLink,
        additionalDescription,
      );

      if (workSubmissionAditionalErrors != null) {
        workSubmissionErrors = {
          ...workSubmissionErrors,
          ...workSubmissionAditionalErrors,
        };
      }

      if (
        workSubmissionErrors === null ||
        Object.keys(workSubmissionErrors).length > 0
      ) {
        return typedjson({ errors: workSubmissionErrors }, { status: 400 });
      }

      if (order.submissionId) {
        const previousSubmission = await getOrderSubmission(order.id);

        if (!previousSubmission)
          return typedjson({ errors: emptyError }, { status: 200 });

        await updateSubmission(
          order.submissionId,
          submissionLink,
          additionalDescription,
        );

        let notificationMessege = "";

        if (
          previousSubmission?.additionalDescription !== additionalDescription &&
          previousSubmission?.submissionLink !== submissionLink
        ) {
          notificationMessege = "pakeitė įkelto darbo aprašymą ir nuorodą";
        } else if (
          previousSubmission?.additionalDescription !== additionalDescription
        ) {
          notificationMessege = "pakeitė įkelto darbo aprašymą";
        } else if (previousSubmission?.submissionLink !== submissionLink) {
          notificationMessege = "pakeitė įkelto darbo nuorodą";
        }

        if (notificationMessege.length > 0)
          await sendNotification(
            order.customerId,
            `${worker.userName} ${notificationMessege}`,
            NotificationTypes.ORDER_UPDATED,
            order.id,
          );
      } else {
        await addSubmission(order.id, submissionLink, additionalDescription);
        if (order.orderStatus == "TIME_ENDED") {
          await sendNotification(
            order.customerId,
            `${worker.userName} įkėlė darbą pavėluotai`,
            NotificationTypes.ORDER_UPDATED,
            order.id,
          );
          await updateOrderStatus(OrderStatus.LATE, order.id);
        } else {
          await sendNotification(
            order.customerId,
            `${worker.userName} įkėlė darbą`,
            NotificationTypes.ORDER_UPDATED,
            order.id,
          );
          await updateOrderStatus(OrderStatus.COMPLETED, order.id);
        }
      }

      return typedjson({ errors: emptyError }, { status: 200 });
    case "acceptSubmission":
      await sendNotification(
        worker.id,
        `Jūsų ikeltas darbas ${order.orderName} priimtas`,
        NotificationTypes.ORDER_COMPLETED,
      );

      return typedjson({ errors: null }, { status: 200 });
  }

  return typedjson({ errors: null }, { status: 200 });
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
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAP1BMVEW6urr///+4uLj5+fnGxsa8vLz8/Pz39/e/v7/CwsLz8/O1tbXQ0NDV1dX09PTl5eXt7e3a2trLy8vg4ODS0tJ+jrBMAAAGl0lEQVR4nO2diXajOgxAjbHAbMEs//+tTzahTUIyZbGxyNOdnjNNmybcepMXVCEYhmEYhmEYhmEYhmEYhmEYhmEYhmEYhmEYhjkf+MejrwHg8b+vw3mBRXyp5NfXUllVlZSuDKX7PPYF+QFsdUQhAWoc2jJPE0ual+0wKhCobJ9w5fLE8hISdD2UaZY8k6XlUGv3/esa2iuX0LdTyT0rTo/StgcpLtsqsRYK3Rm0QR695gfuy6bT+LyLKkroyrtSlixq6c/Xyg6u1+3Y3kNCc0vWkTfoeLEeR4JQZllw78HnGSUuVpAguzTJ1gnaFpmknbxWERbta+f5VzEmbXGhQpSqvBfgymqa2Y9SXUVRyn5D6T3Syys4Ymsa852G+XiJwV/W6U5BjHHqCxRiVdu2t6WXmXE/V1exBf5CqtsuvVnyRru7wUBG722DM7mWlNsiiDZ5E4OuL0I7LlIWFLJL9rXBX8ck6SjXU5XOl7lfMElVbI2PgDAHqujsmCWGbD2tmoN6s2RDcciwcx9devCzhqV28y9qQHW0m5kFsbOpyPnhBVWwP1pbWEJFLkKFqQh9gYVITFBgIOKnFU6UGB7FVlqwd1L4nj62zgKoWq+GLb2+RvvrZyypji30Asjax2D/S1ZTGxCl30pKsJqC8WxYEhMUhd9KitWU2GRf1l6C7gfBhNiiFE59F3ughwTTpIvt9Iz3jga7GlplKHx3NAnOg0kBa7cK13Oj1ZkeXkRcktOKar7fsPAblVrSIrbUEyqAIa1FRe+GGbUyLAK0Q1qG39/TeF2kmSA2HsoAMQ2tqC1EXEpraV823g2JbbLh/NA3xOaHOMf3PAPOaA0WATpTcus0YvBsOMQWWuC7IdaxhV4A6XFvzZICtRXhr9+3AN/VtKa2Q2rvC/G8f0hsi1SCFD7Dmsa9Ii3wl575OKjgXiOjeXD/8JGvH0FqMekP+uanEAnGMzOjp1o6xhb5hBTGQ/ydZcTW8x8AUF7KUJGtpEJ4OTXU0ZrcP4FDmI3djp0vbSke2pvBWBID8GOnoFN8DbKFaE9q2bP6R7Bn9UkfZcfLqw+VYS0JHmh7Buw9M9l2S3dzV0runNAbJFTN3slw2lTk4u03oGK/p6Liz/SXEBR2vq/MjlpqFLV5/Sewu5d6+z6G0ZLmnOkteKHNtv22vKG2bPFvsC1uvpf7Km1wAmxjnO7H/0vSfv/WgG2C1ypDu5Ik9aqcA7dG358f+7I3AO6S8V/R/eV46wr3TCC3BLySSvTtr+RT5g+r1/aCbJi9FlmJoh5uy+aY3Ya6EF+Qa8glGZKg+qE1ZW4ztmR5adqhVyCnFEMXBzVcohO7wAsA2mLTfeFjl85EXrT1PfCUvAzmj8V3GIZhfCCfiX05x4BpkmgXpmxaPQG6UKrv63FsLONY971ShQbrPU17QVwm9J4HcbdmplXd2JG+zNPfpG3JlKotzUs78jd1oafniyk8iHnxq7AFY0fzwgYx+aoJYm6Gri+EG/yB1qnSd6CcLprBpMlPoqiPG1LTM+4JBs3QYGmSb6DYqtRQvqwmZh8UF19Py0EByVh8mt/ZT8b26P5a1o73aI7OutT9gqRQ7yZJOxxvg5o7LBqONrEs1s7G50Fo02BtBTILG9h1FjbL5d4UWM/cX6XsCiozK5umdF5x8nOK9v4qtyZ+YlPXG0jYuPi7Hpv1M3KPYxtKb3zf5PxLZvq4eYaxgurO01mvt4L40emoVbWq/d9J8oqJmYZPNgdze/3FlPuriTJmuBXq7buE+zQNRDiLKaHammd2v2HSFudvnqKg/9vVPlOer1jdz82EL8TpHXJ1cn8jXQm+y0TuX3B6j/LURMpQBbhn9C9yfVqYCihojiTx3I57L6NPa4uyGpJzutFHxyQZzpv+NxtydfsTtPconIN0t6afW4TT++Vn9DY20j8nlHknaU44z4DTidF/hoi1pGP4iQb+CstIRegym55wRFr6STS7VzH0PAND/CkxWwxJ957Bpxkgxwhuj4yBq6kMkPJqGyb07pT33HpbCX6ffhexn3GCgTPVQYAcJlsxYRuiPnNG8Z5Mh2yIu/+CjE/6oIbd+j/iFIgs8C20bfxKGjZlpPdMs3swIXuaCMszS4ImAQuQPHA7QVPVBUgeuJ2g6Qb/D4axu1KbYpjLkA3ZMDpsyIZsGB82ZEM2jA8bsiEbxocN2ZAN48OGbMiG8WFDNmTD+LAhG7JhfNiQDdkwPmzIhmwYHzZkQzaMDxu+8B/ez2RfoHkyKgAAAABJRU5ErkJggg=="
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
  const { order, worker, customer, isClient, workSubmission } =
    useTypedLoaderData<typeof loader>();
  const actionData = useTypedActionData<typeof action>();

  const [activeTabUsers, setActiveTabUsers] = useState("mainPage");
  const handleTabClickUser = (tab: string) => {
    setActiveTabUsers(tab);
  };
  const [canPay, setCanPay] = useState(false);
  const [ended, setEnded] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<string>("0");
  const [showWarning, setShowWarning] = useState<boolean>(false);

  const YoutubeLinkToId = (link: string) => {
    const youtubePattern =
      /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})\b/;
    const match = link.match(youtubePattern);
    return match ? match[1] : undefined;
  };

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
      [OrderStatus.TIME_ENDED]: false,
      [OrderStatus.PAYED]: false,
      [OrderStatus.PLACED]: false,
      [OrderStatus.REMOVED]: false,
      [OrderStatus.LATE]: true,
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

  useEffect(() => {
    console.log(actionData);

    if (actionData && actionData.errors !== null) {
      showPopUp();
    }
  }, [actionData]);

  const showPopUp = () => {
    setShowMessage(false);

    if (actionData && actionData.errors?.noErrors) {
      setShowMessage(true);
    }
  };
  const handlePopUpAnimationEnd = () => {
    setShowMessage(false);
  };

  const showWarningPopUp = () => {
    setShowWarning(true);
  };
  const hideWarningPopUp = () => {
    setShowWarning(false);
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
                <OrderTimer
                  orderEndDate={order.completionDate}
                  handleOrderEnd={handleOrderEnd}
                />
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

        {activeTabUsers === "viewSubmission" && (
          <div className="flex pt-4">
            {workSubmission && (
              <div className="flex flex-col h-full w-full">
                <div className="flex space-x-4">
                  <div className="flex h-full flex-col">
                    <span className="font-bold">Darbo nuoroda: </span>
                    <YouTube
                      videoId={YoutubeLinkToId(workSubmission.submissionLink)}
                    />
                  </div>
                  <div className="flex flex-col w-full">
                    <span className="font-bold">Darbo aprašymas: </span>
                    <div>{workSubmission.additionalDescription}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTabUsers === "updateOrder" && (
          <div className="flex w-full grow space-x-10">
            <div className="p-6 flex flex-col bg-custom-200 text-medium w-full h-max">
              <Form method="put">
                {actionData?.errors?.editNotAllowed ? (
                  <div
                    className="pt-1 font-bold text-red-400 bottom-9"
                    id={`edit-not-allowed-error`}
                  >
                    {actionData?.errors?.editNotAllowed}
                  </div>
                ) : null}
                <Suspense>
                  <Await resolve={actionData}>
                    <div
                      className={`absolute left-[45%] -top-14 p-4 rounded bg-green-500 text-white ${
                        showMessage ? "animate-popup " : "-top-14"
                      }`}
                      onAnimationEnd={handlePopUpAnimationEnd}
                    >
                      Užsakymas sėkmingai atnaujintas!
                    </div>
                  </Await>
                </Suspense>
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
                    title={"Aprašymas"}
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
        {activeTabUsers === "submitWork" && (
          <div className="flex w-full grow space-x-10">
            <div className="p-6 flex flex-col bg-custom-200 text-medium w-full h-max">
              <Form method="post">
                <Suspense>
                  <Await resolve={actionData}>
                    <div
                      className={`absolute left-[45%] -top-14 p-4 rounded bg-green-500 text-white ${
                        showMessage ? "animate-popup " : "-top-14"
                      }`}
                      onAnimationEnd={handlePopUpAnimationEnd}
                    >
                      {order.submissionId
                        ? "Darbas sėkmingai atnaujintas!"
                        : "Darbas sėkmingai Įkeltas!"}
                    </div>
                  </Await>
                </Suspense>
                <div className="flex flex-wrap">
                  <input name="orderId" value={order.id} readOnly hidden />
                  <input name="intent" value="submitWork" readOnly hidden />
                  <OrderInput
                    title={"Papildomas aprašymas"}
                    name={"additionalDescription"}
                    defaultValue={
                      workSubmission?.additionalDescription !== null
                        ? workSubmission?.additionalDescription
                        : undefined
                    }
                    error={actionData?.errors?.description}
                    bigger={true}
                  />
                  <OrderInput
                    title={"Darbo nuoroda"}
                    name={"submissionLink"}
                    defaultValue={workSubmission?.submissionLink}
                    error={actionData?.errors?.footageLink}
                  />
                  <button
                    type="submit"
                    className="w-full rounded bg-custom-800 mt-5 px-2 py-2 text-white hover:bg-custom-850 transition duration-300 ease-in-out"
                  >
                    {order.submissionId === null
                      ? "Įkelti darbą"
                      : "Pakeisti darbą"}
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
        {!isClient &&
          (order.orderStatus === OrderStatus.ACCEPTED ||
            order.orderStatus === OrderStatus.TIME_ENDED) && (
            <div className="flex justify-center pb-2">
              <button
                className={`w-full cursor-pointer bg-custom-800 hover:bg-custom-850 text-white font-bold py-2 px-8 rounded text-nowrap ${
                  activeTabUsers === "submitWork"
                    ? "text-white  py-2 bg-custom-900  border-black "
                    : "text-white  py-2 bg-custom-800 hover:bg-custom-850 transition duration-300 ease-in-out border-black"
                } w-full`}
                onClick={() => handleTabClickUser("submitWork")}
              >
                {order.submissionId === null
                  ? "Įkelti darbą"
                  : "Pakeisti darbą"}
              </button>
            </div>
          )}
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
        {isClient && order.submissionId && (
          <div className="flex justify-center pb-2">
            <button
              className={`w-full cursor-pointer bg-custom-800 hover:bg-custom-850 text-white font-bold py-2 px-8 rounded text-nowrap ${
                activeTabUsers === "viewSubmission"
                  ? "text-white  py-2 bg-custom-900  border-black "
                  : "text-white  py-2 bg-custom-800 hover:bg-custom-850 transition duration-300 ease-in-out border-black"
              } w-full`}
              onClick={() => handleTabClickUser("viewSubmission")}
            >
              Įkeltas darbas
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
