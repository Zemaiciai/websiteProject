export default function useHowLongAgo(date: Date) {
  const currentDate = new Date();
  const yearsAgo = date.getFullYear() - currentDate.getFullYear();
  if (yearsAgo > 0) return "Senai senai";
  const monthsAgo = date.getMonth() + yearsAgo * 12 - currentDate.getMonth();

  const msAgo = currentDate.getTime() - date.getTime();

  let secondsAgo = Math.trunc(Math.abs(msAgo) / 1000);
  const daysAgo = Math.trunc(secondsAgo / 86400);
  secondsAgo -= daysAgo * 86400;
  const hoursAgo = Math.trunc(secondsAgo / 3600) % 24;
  secondsAgo -= hoursAgo * 3600;
  const minutesAgo = Math.trunc(secondsAgo / 60) % 60;
  secondsAgo -= minutesAgo * 60;

  if (monthsAgo > 0) return `prieš ${monthsAgo} mėn.`;
  else if (daysAgo > 0) return `prieš ${daysAgo} d.`;
  else if (hoursAgo > 0) return `prieš ${hoursAgo} h.`;
  else if (minutesAgo > 0) return `prieš ${minutesAgo} min.`;
  else return "Ką tik";
}
