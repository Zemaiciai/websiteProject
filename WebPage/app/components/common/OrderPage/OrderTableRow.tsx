import { useState } from "react";
import OrderTimer from "./OrderTimer";

interface OrderCardProps {
  orderedBy: string;
  orderName: string;
  completionDate: Date;
}

export default function OrderCard({
  orderName,
  completionDate,
  orderedBy,
}: OrderCardProps) {
  const [ended, setEnded] = useState(false);

  const handleOrderEnd = () => {
    setEnded(true);
  };

  return (
    <tr className="order-card-row bg-white outline outline-1 outline-gray-100">
      <td className="order-name text-center max-w-[100px] truncate ...">
        {orderedBy}
      </td>
      <td className="order-name text-center max-w-[100px] truncate ...">
        {orderName}
      </td>
      <td className="order-status text-center truncate ...">
        {ended ? "Baigtas" : "Daromas"}
      </td>
      <td className="order-timer text-center text-nowrap">
        <OrderTimer
          orderEndDate={completionDate}
          handleOrderEnd={handleOrderEnd}
        />
      </td>
    </tr>
  );
}
