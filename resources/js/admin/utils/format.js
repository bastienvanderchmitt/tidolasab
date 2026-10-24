import dayjs from "dayjs";
import "dayjs/locale/fr";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.locale("fr");
dayjs.extend(customParseFormat);

const euroFormat = (decimals) =>
  new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
const euroRound = euroFormat(0);
const euroCents = euroFormat(2);

// « 1 578 € » ou « 1 578,50 € », jamais « 1 578,5 € »
export const money = (amount) => {
  const value = Math.round((Number(amount) || 0) * 100) / 100;
  return (Number.isInteger(value) ? euroRound : euroCents).format(value);
};

export const date = (value, format = "D MMM YYYY") =>
  value ? dayjs(value).format(format) : "";

export const shortDate = (value) => date(value, "D MMM");

export const isoDate = (value) =>
  value ? dayjs(value).format("YYYY-MM-DD") : null;

export const nights = (count) => `${count} nuit${count > 1 ? "s" : ""}`;

export const guests = (adults, children) =>
  [
    `${adults} adulte${adults > 1 ? "s" : ""}`,
    children > 0 ? `${children} enfant${children > 1 ? "s" : ""}` : null,
  ]
    .filter(Boolean)
    .join(", ");

export const daysUntil = (value) =>
  dayjs(value).startOf("day").diff(dayjs().startOf("day"), "day");

export const MONTHS = Array.from({ length: 12 }, (_, i) =>
  dayjs().month(i).format("MMMM"),
);

export { dayjs };
