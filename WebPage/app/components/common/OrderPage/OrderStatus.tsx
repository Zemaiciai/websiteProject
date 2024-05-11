import { OrderStatus } from "@prisma/client";
import { useEffect, useState } from "react";

interface RenderStatusProps {
  status: OrderStatus;
}

export default function RenderStatus({ status }: RenderStatusProps) {
  const [statusColor, setStatusColor] = useState("");

  const orderStatusColorsDictionary = {
    COMPLETED: "text-green-400",
    CANCELLED: "text-red-400",
    DECLINED: "text-red-400",
    IN_PROGRESS: "text-green-400",
    PAYED: "text-green-800",
    PLACED: "text-yellow-400",
    ACCEPTED: "text-green-300",
  };

  useEffect(() => {
    if (orderStatusColorsDictionary[status] === undefined) {
      setStatusColor("OrderTableRow.tsx");
      return;
    }

    setStatusColor(orderStatusColorsDictionary[status]);
  }, [status]);

  return (
    <span className={`${statusColor} ml-1`}>
      {status.charAt(0) + status.substring(1).toLocaleLowerCase()}
    </span>
  );
}
