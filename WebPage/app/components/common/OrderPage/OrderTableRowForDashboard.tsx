import { useEffect, useState } from "react";
import OrderTimer from "./OrderTimer";
import { User } from "~/models/user.server";
import { Form } from "@remix-run/react";
import { Order, OrderStatus } from "@prisma/client";
import { useUser } from "~/utils";
interface OrderCardProps {
  order: Order;
  createdBy: User["userName"];
}

export default function OrderCard({ createdBy, order }: OrderCardProps) {
  const user = useUser();

  const [ended, setEnded] = useState(false);
  const [canPay, setCanPay] = useState(false);

  useEffect(() => {
    if (
      (ended &&
        order.orderStatus !== OrderStatus.PAYED &&
        (order.orderStatus === OrderStatus.ACCEPTED ||
          order.orderStatus === OrderStatus.COMPLETED)) ||
      order.orderStatus === OrderStatus.COMPLETED
    ) {
      setCanPay(true);
    }
  }, [order.orderStatus]);

  return (
    <tr className="order-card-row bg-white outline outline-1 outline-gray-100">
      {user.role === "Darbuotojas" ? (
        <>
          <td className="order-name text-center max-w-[50px] truncate">
            {createdBy}
          </td>
          <td className="order-name text-center max-w-[100px] truncate">
            {order.orderName}
          </td>
          <td className="order-status text-center truncate">
            {order.orderStatus}
          </td>
          <td className="order-status text-center truncate">
            <OrderTimer orderEndDate={order.completionDate}></OrderTimer>
          </td>
        </>
      ) : (
        <>
          <td className="order-name text-center max-w-[100px] truncate">
            {createdBy}
          </td>
          <td className="order-name text-center max-w-[100px] truncate">
            {order.orderName}
          </td>
          <td
            className={`${
              order.orderStatus === OrderStatus.ACCEPTED && "text-lime-500"
            } 
            ${
              order.orderStatus === OrderStatus.DECLINED && "text-red-500"
            } order-name text-center max-w-[100px] truncate`}
          >
            {order.orderStatus}
          </td>
          <td className="order-status text-center truncate">
            <OrderTimer orderEndDate={order.completionDate}></OrderTimer>
          </td>
        </>
      )}
    </tr>
  );
}
