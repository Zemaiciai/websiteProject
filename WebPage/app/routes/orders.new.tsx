import { ActionFunctionArgs, json, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { forwardRef, useRef, useState } from "react";
import { typedjson, useTypedActionData } from "remix-typedjson";
import OrderDatePicker from "~/components/common/OrderPage/OrderDatePicker";
import { createOrder } from "~/models/order.server";
import { getUserByEmail, getUserById } from "~/models/user.server";
import { requireUserId } from "~/session.server";
import { validateOrderData } from "~/utils";
interface OrderErrors {
  customerNotFound?: string;
  workerNotFound?: string;
  workerEmail?: string;
  sameUser?: string;
  orderName?: string;
  completionDate?: string;
  revisionDate?: string;
  description?: string;
  footageLink?: string;
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const userId = await requireUserId(request);
  const createdBy = await getUserById(userId);

  const formData = await request.formData();
  const orderName = String(formData.get("orderName"));
  const workerEmail = String(formData.get("workerEmail"));

  const completionDateString = formData.get("completionDate") as string;
  const revisionDateString = formData.get("revisionDate") as string;
  const completionDate = new Date(completionDateString);
  const revisionDate = new Date(revisionDateString);

  const description = String(formData.get("description"));
  const footageLink = String(formData.get("footageLink"));

  let validationErrors: OrderErrors | null = {};

  const additionalErrors = await validateOrderData(
    orderName,
    completionDate,
    workerEmail,
    revisionDate,
    description,
    footageLink,
  );

  const worker = await getUserByEmail(workerEmail);

  if (!createdBy) {
    validationErrors.customerNotFound = "Nerastas užsakovas";
  }
  if (!worker) {
    validationErrors.workerNotFound = "Nerastas darbuotuojas";
  }
  if (worker?.email === createdBy?.email) {
    validationErrors.sameUser = "Negalima sukurti užsakymo sau";
  }

  // If there are additional errors we append them to the existing validation errors
  if (additionalErrors !== null && typeof additionalErrors === "object") {
    validationErrors = { ...validationErrors, ...additionalErrors };
  }

  if (Object.keys(validationErrors).length > 0) {
    return json({ errors: validationErrors }, { status: 400 });
  }

  // the non-null assertion is done because we check above if the createdBy or worker is null
  // however typescript can't see that for some reason
  await createOrder(
    orderName,
    createdBy!, // Non-null assertion
    worker!, // Non-null assertion
    completionDate,
    revisionDate,
    description,
    footageLink,
  );

  return redirect("/orders");
};

interface OrderStringInputProps {
  title: string;
  error?: string;
  name: string;
  selectedDate?: Date;
  handleDateChange?: (
    event: React.ChangeEvent<HTMLSelectElement>,
    type: string,
    dateName: string,
  ) => void;
}

const OrderStringInput = forwardRef<HTMLInputElement, OrderStringInputProps>(
  ({ title, name, error }, ref) => {
    return (
      <div className="w-full md:w-1/2 px-3 mb-6">
        <div className="flex flex-col">
          <div className="relative">
            <input
              ref={ref}
              name={name}
              autoComplete="on"
              className="w-full rounded border border-gray-500 px-2 py-1 text-lg focus:outline-none placeholder-black"
              placeholder={title}
            />
            {error ? (
              <div
                className="pt-1 font-bold text-red-400 absolute bottom-9"
                id="firstname-error"
              >
                {error}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    );
  },
);

export default function NewOrderPage() {
  const actionData = useActionData<typeof action>();
  const workerEmailRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLInputElement>(null);
  const footageLinkRef = useRef<HTMLInputElement>(null);
  const completionDateRef = useRef<HTMLInputElement>(null);
  const revisionDateRef = useRef<HTMLInputElement>(null);
  const orderNameRef = useRef<HTMLInputElement>(null);

  const [selectedDate, setSelectedDate] = useState<{ [key: string]: Date }>({
    completionDate: new Date(),
    revisionDate: new Date(),
  });

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
      default:
        break;
    }

    setSelectedDate({
      ...selectedDate,
      [dateName]: newDate,
    });
  };

  return (
    <div className="p-6 flex flex-col bg-custom-200 text-medium w-full h-max ml-3 mt-3 mr-3">
      {actionData?.errors.sameUser ? (
        <div
          className="pt-1 font-bold text-red-400 m-0 absolute end-6"
          id="sameuser-error"
        >
          {actionData?.errors.sameUser}
        </div>
      ) : null}
      <h1 className="text-3xl font-mono font-font-extralight pb-3">
        Užsakymo sukurimas
      </h1>
      <Form method="post">
        <div className="flex flex-wrap -mx-3">
          <OrderDatePicker
            handleDateChange={handleDateChange}
            selectedDate={selectedDate.completionDate}
            title="Pabaigimo data:"
            name="completionDate"
            ref={completionDateRef}
          />
          <OrderDatePicker
            handleDateChange={handleDateChange}
            selectedDate={selectedDate.revisionDate}
            title="Revizijos data:"
            name="revisionDate"
            ref={revisionDateRef}
          />
          <OrderStringInput
            title={"Pavadinimas"}
            name={"orderName"}
            ref={orderNameRef}
            error={actionData?.errors.orderName}
          />
          <OrderStringInput
            title={"Darbuotuojo el. pastas"}
            name={"workerEmail"}
            ref={workerEmailRef}
            error={
              actionData?.errors.workerEmail ||
              actionData?.errors.workerNotFound
            }
          />
          <OrderStringInput
            title={"Aprasymas"}
            name={"description"}
            ref={descriptionRef}
            error={actionData?.errors.description}
          />
          <OrderStringInput
            title={"Video nuoruoda"}
            name={"footageLink"}
            ref={footageLinkRef}
            error={actionData?.errors.footageLink}
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