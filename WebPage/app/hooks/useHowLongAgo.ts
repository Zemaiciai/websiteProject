export default function useHowLongAgo(date: Date) {
  const currentDate = new Date();
  const yearsAgo = currentDate.getFullYear() - date.getFullYear();
  const monthsAgo = currentDate.getMonth() - date.getMonth() + yearsAgo * 12;

  const msAgo = currentDate.getTime() - date.getTime();

  let secondsAgo = Math.trunc(Math.abs(msAgo) / 1000);
  const daysAgo = Math.trunc(secondsAgo / 86400);
  secondsAgo -= daysAgo * 86400;
  const hoursAgo = Math.trunc(secondsAgo / 3600) % 24;
  secondsAgo -= hoursAgo * 3600;
  const minutesAgo = Math.trunc(secondsAgo / 60) % 60;
  secondsAgo -= minutesAgo * 60;

  if (yearsAgo > 0 && yearsAgo < 10) {
    return `prieš ${yearsAgo} metus`;
  } else if (yearsAgo > 10) {
    return `prieš ${yearsAgo} metų`;
  }

  if (monthsAgo === 1) {
    return `prieš ${monthsAgo} mėnesį`;
  } else if (monthsAgo > 0 && monthsAgo < 10) {
    return `prieš ${monthsAgo} mėnesius`;
  } else if (monthsAgo > 10) {
    return `prieš ${monthsAgo} mėnesių`;
  }

  if (daysAgo === 1) {
    return `prieš ${daysAgo} dieną`;
  } else if (daysAgo > 1 && daysAgo < 10) {
    return `prieš ${daysAgo} dienas`;
  } else if (daysAgo > 10) {
    return `prieš ${daysAgo} dienų`;
  }

  if (hoursAgo === 1) {
    return `prieš ${hoursAgo} valandą`;
  } else if (hoursAgo > 1 && hoursAgo < 10) {
    return `prieš ${hoursAgo} valandas`;
  } else if (hoursAgo > 10) {
    return `prieš ${hoursAgo} valandų`;
  }
  if (minutesAgo === 1) {
    return `prieš ${minutesAgo} minutę`;
  } else if (minutesAgo > 1 && minutesAgo < 10) {
    return `prieš ${minutesAgo} minutes`;
  } else if (minutesAgo > 10) {
    return `prieš ${minutesAgo} minučių`;
  }

  return "Ką tik";
}
