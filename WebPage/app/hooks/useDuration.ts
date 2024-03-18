import { useEffect, useState } from "react";

export default function useDuration(workEndDate: Date) {
  const calculateTimeRemaining = () => {
    const workEndInMs = workEndDate.getTime() - Date.now();

    let seconds = Math.trunc(Math.abs(workEndInMs) / 1000);

    const days = Math.trunc(seconds / 86400);
    seconds -= days * 86400;

    const hours = Math.trunc(seconds / 3600) % 24;
    seconds -= hours * 3600;

    const minutes = Math.trunc(seconds / 60) % 60;
    seconds -= minutes * 60;

    return { seconds, minutes, hours, days, workEndInMs };
  };

  const [time, setTime] = useState(calculateTimeRemaining());

  // TODO: CHANGE THIS VERY BAD THING THAT UPDATES EVERY 50ms
  //       this is done because when you change the pageNumber
  //       in the workTable the timer doesn't update
  //       THERE SHOULD BE A BETTER WAY
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(calculateTimeRemaining());
    }, 50);

    return () => {
      clearInterval(interval);
    };
  });

  return time;
}
