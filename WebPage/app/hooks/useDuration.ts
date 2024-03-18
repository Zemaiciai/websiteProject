import { useEffect, useState } from "react";

export default function useDuration(completionDate: Date) {
  const calculateTimeRemaining = () => {
    const endInMs = completionDate.getTime() - Date.now();

    let seconds = Math.trunc(Math.abs(endInMs) / 1000);

    const days = Math.trunc(seconds / 86400);
    seconds -= days * 86400;

    const hours = Math.trunc(seconds / 3600) % 24;
    seconds -= hours * 3600;

    const minutes = Math.trunc(seconds / 60) % 60;
    seconds -= minutes * 60;

    return { seconds, minutes, hours, days, endInMs };
  };

  const [time, setTime] = useState(calculateTimeRemaining());

  useEffect(() => {
    const updateTime = () => {
      setTime(calculateTimeRemaining());
    };
    updateTime();

    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, [completionDate]);

  return time;
}
