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
      className="bg-white border-b  hover:bg-gray-50 "
    >
      <td className="px-6 py-4">{createdBy}</td>
      <td className="px-6 py-4">{order.orderName}</td>
      <td className="px-6 py-4">
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
      <td className="px-6 py-4">
        <OrderTimer
          orderEndDate={order.completionDate}
          handleOrderEnd={handleOrderEnd}
        />
      </td>
    </tr>
  );
}
