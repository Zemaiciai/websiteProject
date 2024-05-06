import { useEffect, useState } from "react";
import OrderTimer from "./OrderTimer";
import { User } from "~/models/user.server";
import { Form, useNavigate } from "@remix-run/react";
import { Order, OrderStatus } from "@prisma/client";
import { useUser } from "~/utils";
interface OrderCardProps {
  order: Order;
  createdBy: User["userName"];
}

export default function OrderCard({ createdBy, order }: OrderCardProps) {
  const navigate = useNavigate();

  const [ended, setEnded] = useState(false);

  const handleOrderEnd = () => {
    setEnded(true);
  };

  const handleNavigateToOrder = () => {
    navigate(`/orders/${order.id}`);
  };

  return (
    <tr
      onClick={handleNavigateToOrder}
      className="cursor-pointer order-card-row bg-white outline outline-1 outline-gray-100"
    >
      <td className="order-name text-center max-w-[50px] truncate">
        {createdBy}
      </td>
      <td className="order-name text-center max-w-[100px] truncate cursor-pointer">
        {order.orderName}
      </td>
      <td className="order-status text-center truncate">
        <span
          className={`${
            order.orderStatus === "ACCEPTED"
              ? "text-green-400"
              : order.orderStatus === "DECLINED" && "text-green-400"
          } ml-1`}
        >
          {order.orderStatus}
        </span>
      </td>
      <td className="order-timer text-center text-nowrap">
        <OrderTimer
          orderEndDate={order.completionDate}
          handleOrderEnd={handleOrderEnd}
        />
      </td>
    </tr>
  );
}
