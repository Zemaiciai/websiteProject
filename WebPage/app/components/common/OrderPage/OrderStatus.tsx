import { OrderStatus } from "@prisma/client";
import { useEffect, useState } from "react";

interface RenderStatusProps {
  status: OrderStatus | undefined;
  box?: boolean;
}

export default function RenderStatus({ status, box }: RenderStatusProps) {
  const [statusColor, setStatusColor] = useState("");

  let orderStatusColorsDictionary: { [key: string]: string };

  if (box) {
    orderStatusColorsDictionary = {
      COMPLETED: "bg-red-400 text-red-900",
      CANCELLED: "bg-red-800 text-red-100",
      DECLINED: "bg-red-800 text-white",
      IN_PROGRESS: "bg-green-400 text-green-900",
      PAYED: "bg-green-800 text-white",
      PLACED: "bg-yellow-400 text-yellow-900",
      ACCEPTED: "bg-green-300 text-green-800",
    };
  } else if (!box) {
    orderStatusColorsDictionary = {
      COMPLETED: "text-green-400",
      CANCELLED: "text-red-400",
      DECLINED: "text-red-400",
      IN_PROGRESS: "text-green-400",
      PAYED: "text-green-800",
      PLACED: "text-yellow-400",
      ACCEPTED: "text-green-300",
    };
  }

  useEffect(() => {
    if (status === undefined) {
      setStatusColor("OrderTableRow.tsx");
      return;
    }

    if (orderStatusColorsDictionary[status] === undefined) {
      setStatusColor("OrderTableRow.tsx");
      return;
    }

    setStatusColor(orderStatusColorsDictionary[status]);
  }, [status]);

  return (
    <span
      className={`${statusColor} font-bold ${
        box && "text-[11px]"
      } rounded py-0.5 px-1`}
    >
      {status}
    </span>
  );
}
