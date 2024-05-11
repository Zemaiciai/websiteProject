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
  const user = useUser();
  const navigate = useNavigate();

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

  const handleNavigateToOrder = () => {
    navigate(`/orders/${order.id}`);
  };

  return (
    <tr
      onClick={handleNavigateToOrder}
      className="bg-white border-b  hover:bg-gray-50 cursor-pointer "
    >
      {user.role === "Darbuotojas" ? (
        <>
          <td className="px-6 py-4">{createdBy}</td>
          <td className="px-6 py-4">{order.orderName}</td>
          <td className="px-6 py-4">{order.orderStatus}</td>
          {order.orderStatus !== OrderStatus.PAYED &&
            order.orderStatus !== OrderStatus.COMPLETED && (
              <td className="px-6 py-4">
                <OrderTimer orderEndDate={order.completionDate} />
              </td>
            )}
        </>
      ) : (
        <>
          <td className="px-6 py-4">{createdBy}</td>
          <td className="px-6 py-4">{order.orderName}</td>
          <td
            className={`${
              order.orderStatus === OrderStatus.ACCEPTED && "text-lime-500"
            } 
            ${
              order.orderStatus === OrderStatus.DECLINED && "text-red-500"
            } px-6 py-4`}
          >
            {order.orderStatus}
          </td>
          {order.orderStatus !== OrderStatus.PAYED &&
          order.orderStatus !== OrderStatus.COMPLETED ? (
            <td className="px-6 py-4">
              <OrderTimer orderEndDate={order.completionDate} />
            </td>
          ) : (
            <td className="px-6 py-4"></td>
          )}
        </>
      )}
    </tr>
  );
}
