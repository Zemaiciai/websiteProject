import { useEffect, useState } from "react";

import useDuration from "~/hooks/useDuration";

interface OrderCardTimerProps {
  orderEndDate: Date;
  handleOrderEnd: () => void;
}

export default function OrderTimer({
  orderEndDate,
  handleOrderEnd,
}: OrderCardTimerProps) {
  const day = orderEndDate.getDate();
  const month = orderEndDate.getMonth() + 1;
  const time = useDuration(orderEndDate);
  const year = orderEndDate.getFullYear();

  const [ending, setEnding] = useState(false);

  useEffect(() => {
    if (time.days === 0 && time.hours === 0 && time.minutes < 20)
      setEnding(true);
    else setEnding(false);

    if (time.endInMs <= 999) handleOrderEnd();
  }, [time.days, time.hours, time.minutes, time.endInMs, handleOrderEnd]);

  return (
    <div className="text-nowrap w-full">
      {time.days >= 3 ? (
        <span>
          {String(year)}-{String(month + 2).padStart(2, "0")}-
          {String(day).padStart(2, "0")}
        </span>
      ) : time.days >= 1 && time.days <= 3 ? (
        <span className="text-nowrap">
          {time.days}d&nbsp;
          {time.hours !== 0 && (
            <span>{String(time.hours).padStart(2, "0")}h</span>
          )}
        </span>
      ) : time.hours > 0 ? (
        <span>
          {String(time.hours).padStart(2, "0")}h{" "}
          {String(time.minutes).padStart(2, "0")}min
        </span>
      ) : (
        <span className={`${ending && "text-red-400"}`}>
          {String(time.minutes).padStart(2, "0")}:
          {String(time.seconds).padStart(2, "0")}
        </span>
      )}
    </div>
  );
}
