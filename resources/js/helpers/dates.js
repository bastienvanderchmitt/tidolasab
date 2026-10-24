import { startOfDay, differenceInDays } from "date-fns";

export const getFrenchDate = (date, withYear) => {
  if (!date) return "";

  const options = {
    day: "numeric",
    month: "long",
    ...(withYear && { year: "numeric" }),
    timeZone: "Europe/Paris", // Force CET/CEST, ignore fuseau local
  };

  return date.toLocaleDateString("fr-FR", options);
};

export const getDaysFromNow = (date) => {
  const today = startOfDay(new Date());
  return differenceInDays(date, today);
};

export const dateFormat = (date) => {
  if (date) {
    const [year, month, day] = date.split("-");
    return `${day}/${month}/${year}`;
  } else return "";
};
