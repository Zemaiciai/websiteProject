import { OrderStatus } from "@prisma/client";
import { useEffect, useState } from "react";

interface RenderStatusProps {
  status: OrderStatus | undefined;
  box?: boolean;
}

export default function RenderStatus({ status, box }: RenderStatusProps) {
  let orderStatusColorsDictionary: { [key: string]: string };

  const orderStatusTextDictionary = {
    COMPLETED: "BAIGTAS",
    CANCELLED: "ATŠAUKTAS",
    DECLINED: "ATMESTAS",
    IN_PROGRESS: "VYKDOMAS",
    PAYED: "SUMOKĖTA",
    PLACED: "PRISKIRTAS",
    ACCEPTED: "PRIIMTAS",
  };

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

  const getStatusColor = (orderStatus: string | undefined) => {
    if (orderStatus === undefined) return "";

    return orderStatusColorsDictionary[orderStatus];
  };

  const getStatusText = (orderStatus: string | undefined) => {
    if (orderStatus === undefined) return "";

    return orderStatusTextDictionary[orderStatus];
  };

  return (
    <span
      className={`${getStatusColor(status)} font-bold ${
        box ? "text-[11px] py-0.5 px-1 rounded" : "ml-1"
      } `}
    >
      {getStatusText(status)}
    </span>
  );
}
