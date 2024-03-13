import { useEffect, useState } from "react";

import useDuration from "~/hooks/useDuration";

interface ItemCardTimerProps {
  workEndDate: Date;
  handleWorkEnd: () => void;
}

export default function AuctionTimer({
  workEndDate,
  handleWorkEnd,
}: ItemCardTimerProps) {
  const day = workEndDate.getDate();
  const month = workEndDate.getMonth();
  const time = useDuration(workEndDate);

  const [ending, setEnding] = useState(false);

  useEffect(() => {
    if (time.days === 0 && time.hours === 0 && time.minutes < 20)
      setEnding(true);
    else setEnding(false);

    if (time.workEndInMs <= 999) handleWorkEnd();
  }, [time.days, time.hours, time.minutes, time.workEndInMs, handleWorkEnd]);

  return (
    <div>
      {time.days >= 3 ? (
        <span>
          {String(month + 1).padStart(2, "0")}-{String(day).padStart(2, "0")}
        </span>
      ) : time.days >= 1 && time.days <= 3 ? (
        <span>
          {time.days} d.&nbsp;
          {time.hours !== 0 && <p>{String(time.hours).padStart(2, "0")} h.</p>}
        </span>
      ) : time.hours > 0 ? (
        <span>
          {String(time.hours).padStart(2, "0")} h{" "}
          {String(time.minutes).padStart(2, "0")} min
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
