import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { forwardRef, useRef, useState } from "react";
import { createOrder } from "~/models/order.server";
import { getUserByEmail, getUserById } from "~/models/user.server";
import { requireUserId } from "~/session.server";
import Datepicker from "tailwind-datepicker-react";
import { IOptions } from "tailwind-datepicker-react/types/Options";

export const action = async ({ request }: ActionFunctionArgs) => {
  const userId = await requireUserId(request);
  const createdBy = await getUserById(userId);

  const formData = await request.formData();
  const workerEmail = String(formData.get("workerEmail"));
  const worker = await getUserByEmail(workerEmail);
  const completionDate = new Date(String(formData.get("completionDate")));
  const revisionDate = new Date(String(formData.get("revisionDate")));
  const description = String(formData.get("description"));
  const footageLink = String(formData.get("footageLink"));

  if (!createdBy || !worker) redirect("/orders");
  else {
    await createOrder(
      createdBy,
      worker,
      completionDate,
      revisionDate,
      description,
      footageLink,
    );
  }

  return null;
};

interface OrderInputProps {
  title: string;
  name: string;
}

const OrderStringInput = forwardRef<HTMLInputElement, OrderInputProps>(
  ({ title, name }, ref) => {
    return (
      <div>
        <label className="flex w-full flex-col gap-1">
          <span>{title}: </span>
          <input
            ref={ref}
            name={name}
            autoComplete="on"
            className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
          />
        </label>
      </div>
    );
  },
);

export default function NewOrderPage() {
  const workerEmailRef = useRef<HTMLInputElement>(null);
  const completionDateRef = useRef<HTMLInputElement>(null);
  const revisionDateRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLInputElement>(null);
  const footageLinkRef = useRef<HTMLInputElement>(null);

  const [show, setShow] = useState<boolean>(false);
  const handleChange = (selectedDate: Date) => {
    console.log(selectedDate);
  };
  const handleClose = (state: boolean) => {
    setShow(state);
  };

  const options: IOptions = {
    title: "Pabaigimo data",
    autoHide: true,
    todayBtn: false,
    clearBtn: true,
    clearBtnText: "Išvalyti",
    maxDate: new Date("2030-01-01"),
    minDate: new Date("1950-01-01"),
    theme: {
      background: "bg-custom-200 text-black",
      todayBtn: "bg-custom-200",
      clearBtn: "bg-custom-200",
      icons: "",
      text: "text-black",
      input: "text-black",
      inputIcon: "text-black",
      disabledText: "",
      selected: "text-white",
    },
    datepickerClassNames: "top-12 bg-custom-200",
    defaultDate: new Date(),
    language: "lt",
    disabledDates: [],
    weekDays: ["Pr", "An", "Tr", "Kt", "Pn", "Št", "Sk"],
    inputNameProp: "completionDate",
    inputPlaceholderProp: "Select Date",
    inputDateFormatProp: {
      day: "numeric",
      month: "numeric",
      year: "numeric",
    },
  };

  localStorage.theme = "light";

  return (
    <div className="w-full m-4">
      <Form method="post">
        <label className="flex w-full flex-col gap-1">
          <span>Pabaigos data: </span>
          <Datepicker
            options={options}
            onChange={handleChange}
            show={show}
            setShow={handleClose}
          />
        </label>

        <label className="flex w-full flex-col gap-1">
          <span>Revizijos data: </span>
          <Datepicker
            options={options}
            onChange={handleChange}
            show={show}
            setShow={handleClose}
          />
        </label>
        <OrderStringInput
          title={"Darbuotuojo el. pastas"}
          name={"workerEmail"}
          ref={workerEmailRef}
        />
        <OrderStringInput
          title={"Aprasymas"}
          name={"description"}
          ref={descriptionRef}
        />
        <OrderStringInput
          title={"Video nuoruoda"}
          name={"footageLink"}
          ref={footageLinkRef}
        />

        <div className="text-right">
          <button
            type="submit"
            className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400"
          >
            Save
          </button>
        </div>
      </Form>
    </div>
  );
}
