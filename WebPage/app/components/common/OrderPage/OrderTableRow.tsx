import { useRef, useState } from "react";
import OrderTimer from "./OrderTimer";
import { User } from "~/models/user.server";
import { Form } from "@remix-run/react";
import { OrderStatus } from "@prisma/client";
import { useUser } from "~/utils";
interface OrderCardProps {
  createdBy: User["userName"];
  orderName: string;
  orderId: string;
  completionDate: Date;
  state: string;
}

export default function OrderCard({
  orderName,
  orderId,
  completionDate,
  createdBy,
  state,
}: OrderCardProps) {
  const user = useUser();

  const [ended, setEnded] = useState(false);

  const handleOrderEnd = () => {
    setEnded(true);
  };

  return (
    <tr className="order-card-row bg-white outline outline-1 outline-gray-100">
      {state === "PLACED" &&
      (user.role === "worker" || user.role === "Super Admin") ? (
        <>
          <td className="order-name text-center max-w-[50px] truncate ...">
            {createdBy}
          </td>
          <td className="order-name text-center max-w-[100px] truncate ...">
            {orderName}
          </td>
          <td className="order-status text-center truncate ...">{state}</td>
          <td className="order-status text-center truncate ...">
            <Form method="post" className="flex justify-center">
              <input type="hidden" name="orderId" value={orderId} readOnly />
              <input
                type="submit"
                name="action"
                value="Priimti"
                className="w-full cursor-pointer"
              />
              <input
                type="submit"
                name="action"
                value="Atmesti"
                className="w-full cursor-pointer"
              />
            </Form>
          </td>
        </>
      ) : (
        <>
          <td className="order-name text-center max-w-[100px] truncate ...">
            {createdBy}
          </td>
          <td className="order-name text-center max-w-[100px] truncate ...">
            {orderName}
          </td>
          <td
            className={`${state === OrderStatus.ACCEPTED && "text-lime-500"} 
            ${
              state === OrderStatus.DECLINED && "text-red-500"
            } order-name text-center max-w-[100px] truncate ...`}
          >
            {state}
          </td>
          <td className="order-timer text-center text-nowrap">
            <OrderTimer
              orderEndDate={completionDate}
              handleOrderEnd={handleOrderEnd}
            />
          </td>
        </>
      )}
    </tr>
  );
}
