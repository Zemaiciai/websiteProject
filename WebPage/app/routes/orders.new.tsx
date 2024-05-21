import { NotificationTypes } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
  json,
  redirect,
} from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { useState } from "react";
import OrderDatePicker from "~/components/common/OrderPage/OrderDatePicker";
import OrderInput from "~/components/common/OrderPage/OrderInput";
import { sendNotification } from "~/models/notification.server";
import { createOrder } from "~/models/order.server";
import { getUserByEmail, getUserById } from "~/models/user.server";
import { isUserClient, requireUserId } from "~/session.server";
import { validateOrderData } from "~/utils";
export const meta: MetaFunction = () => [
  { title: "Naujas užsakymas - Žemaičiai" },
];
export const loader = async ({ request }: LoaderFunctionArgs) => {
  await isUserClient(request, true);
  await requireUserId(request);

  return null;
};

interface OrderErrors {
  customerNotFound?: string;
  workerNotFound?: string;
  workerEmail?: string;
  wrongUser?: string;
  orderName?: string;
  completionDate?: string;
  revisionDays?: string;
  description?: string;
  footageLink?: string;
  price?: string;
  editNotAllowed?: string;
  noErrors?: boolean;
}

export type { OrderErrors };

export const action = async ({ request }: ActionFunctionArgs) => {
  const userId = await requireUserId(request);
  const createdBy = await getUserById(userId);

  if (!(await isUserClient(request))) redirect("/orders");

  const formData = await request.formData();
  const orderName = String(formData.get("orderName")).trim();
  const workerEmail = String(formData.get("workerEmail"));

  const completionDateString = formData.get("completionDate") as string;
  const completionDate = new Date(completionDateString);

  const revisionDays = parseInt(String(formData.get("revisionDays")));
  const revisionDate = completionDate;
  if (revisionDays > 0) {
    revisionDate.setDate(revisionDate.getDate() + revisionDays);
  }

  console.log(completionDate);

  const description = String(formData.get("description"));
  const footageLink = String(formData.get("footageLink"));
  const price = String(formData.get("price"));
  let validationErrors: OrderErrors | null = {};

  const additionalErrors = await validateOrderData(
    revisionDays,
    orderName,
    completionDate,
    workerEmail,
    description,
    footageLink,
    price,
  );

  const worker = await getUserByEmail(workerEmail);

  if (!createdBy) {
    validationErrors.customerNotFound = "Nerastas užsakovas";
  }
  if (!worker) {
    validationErrors.workerNotFound = "Nerastas darbuotuojas";
  }
  if (worker?.email === createdBy?.email) {
    validationErrors.wrongUser = "Negalima sukurti užsakymo sau";
  } else if (worker?.role === "client")
    validationErrors.wrongUser = "Reikia pasirinkti darbuotoja, o ne klientą";

  // If there are additional errors we append them to the existing validation errors
  if (additionalErrors !== null && typeof additionalErrors === "object") {
    validationErrors = { ...validationErrors, ...additionalErrors };
  }

  if (Object.keys(validationErrors).length > 0) {
    return json({ errors: validationErrors }, { status: 400 });
  }
  const pricee = parseInt(String(formData.get("price")), 10);

  // the non-null assertion is done because we check above if the createdBy or worker is null
  // however typescript can't see that for some reason
  const order = await createOrder(
    orderName,
    createdBy!.id, // Non-null assertion
    worker!.id, // Non-null assertion
    completionDate,
    revisionDays,
    description,
    footageLink,
    pricee,
  );

  // Create a notification for the worker
  await sendNotification(
    worker!.id,
    `Jums vartotojas ${createdBy!.userName} priskirė naują užsakymą!`,
    NotificationTypes.ORDER_ASSIGNED,
    order.id,
  );

  return redirect("/orders");
};

export default function NewOrderPage() {
  const actionData = useActionData<typeof action>();

  const [selectedDate, setSelectedDate] = useState<{
    [key: string]: Date;
  }>({
    completionDate: new Date(),
  });

  const [selectedDay, setSelectedDay] = useState<string>("0");

  const handleDateChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
    type: string,
    dateName: string,
  ) => {
    const { value } = event.target;
    const newDate = new Date(selectedDate[dateName]);

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

    setSelectedDate({
      ...selectedDate,
      [dateName]: newDate,
    });
  };

  const handleDayChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;
    setSelectedDay(value);
  };

  return (
    <div className="p-6 flex flex-col bg-custom-200 text-medium w-full h-max">
      {actionData?.errors.wrongUser ? (
        <div
          className="pt-1 font-bold text-red-400 m-0 absolute end-6"
          id="sameuser-error"
        >
          {actionData?.errors.wrongUser}
        </div>
      ) : null}
      <h1 className="text-3xl font-mono font-font-extralight pb-3">
        Užsakymo sukurimas
      </h1>
      <Form method="post" action="/orders/new">
        <div className="flex flex-wrap -mx-3">
          <OrderDatePicker
            error={actionData?.errors.completionDate}
            handleDateChange={handleDateChange}
            selectedDate={selectedDate.completionDate}
            title="Pabaigos data:"
            name="completionDate"
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
              >
                <option value="" hidden selected disabled>
                  D
                </option>
                {[...Array(3).keys()].map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <OrderInput
            title={"Pavadinimas"}
            name={"orderName"}
            error={actionData?.errors.orderName}
          />
          <OrderInput
            title={"Darbuotuojo el. pastas"}
            name={"workerEmail"}
            error={
              actionData?.errors.workerEmail ||
              actionData?.errors.workerNotFound
            }
          />
          <OrderInput
            title={"Aprasymas"}
            name={"description"}
            error={actionData?.errors.description}
            bigger={true}
          />
          <OrderInput
            title={"Video nuoruoda"}
            name={"footageLink"}
            error={actionData?.errors.footageLink}
          />
          <OrderInput
            title={"Atlygis už darbą"}
            name={"price"}
            error={actionData?.errors.price}
          />
          <button
            type="submit"
            className="w-full rounded bg-custom-800 mt-5 px-2 py-2 text-white hover:bg-custom-850 transition duration-300 ease-in-out"
          >
            Sukurti užsakymą
          </button>
        </div>
      </Form>
    </div>
  );
}
