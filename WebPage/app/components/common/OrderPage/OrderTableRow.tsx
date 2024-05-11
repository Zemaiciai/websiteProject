import { useState } from "react";
import OrderTimer from "./OrderTimer";
import { User } from "~/models/user.server";
import { useNavigate } from "@remix-run/react";
import { Order } from "@prisma/client";
import RenderStatus from "./OrderStatus";
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
      className="bg-white border-b  hover:bg-gray-50 cursor-pointer "
    >
      <td className="px-6 py-4">{createdBy}</td>
      <td className="px-6 py-4">{order.orderName}</td>
      <td className="px-6 py-4">
        <RenderStatus status={order.orderStatus} />
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
