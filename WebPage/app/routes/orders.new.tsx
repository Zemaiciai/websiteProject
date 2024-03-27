import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { forwardRef, useRef, useState } from "react";
import OrderDatePicker from "~/components/common/OrderPage/OrderDatePicker";
import { createOrder } from "~/models/order.server";
import { getUserByEmail, getUserById } from "~/models/user.server";
import { requireUserId } from "~/session.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const userId = await requireUserId(request);
  const createdBy = await getUserById(userId);

  const formData = await request.formData();
  const orderName = String(formData.get("orderName"));
  const workerEmail = String(formData.get("workerEmail"));
  const worker = await getUserByEmail(workerEmail);

  const completionDateString = formData.get("completionDate") as string;
  const revisionDateString = formData.get("revisionDate") as string;
  const completionDate = new Date(completionDateString);
  const revisionDate = new Date(revisionDateString);

  const description = String(formData.get("description"));
  const footageLink = String(formData.get("footageLink"));

  console.log(revisionDate.getTime());

  if (!createdBy || !worker) redirect("/orders");
  else {
    await createOrder(
      orderName,
      createdBy,
      worker,
      completionDate,
      revisionDate,
      description,
      footageLink,
    );
  }
  return null; // redirect("/orders");
};

interface OrderStringInputProps {
  title: string;
  name: string;
  selectedDate?: Date;
  handleDateChange?: (
    event: React.ChangeEvent<HTMLSelectElement>,
    type: string,
    dateName: string,
  ) => void;
}

const OrderStringInput = forwardRef<HTMLInputElement, OrderStringInputProps>(
  ({ title, name }, ref) => {
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
          </div>
        </div>
      </div>
    );
  },
);

export default function NewOrderPage() {
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
    <div className="p-6 flex flex-col bg-custom-200 text-medium w-full h-max ml-3 mt-3 mr-3 ">
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
          />
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
