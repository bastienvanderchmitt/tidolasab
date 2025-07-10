import {
  addDays,
  endOfMonth,
  isWithinInterval,
  startOfDay,
  startOfMonth,
  differenceInDays,
  format,
} from "date-fns";
import { fr } from "date-fns/locale";

/**
 * Début Novembre -> Fin Août
 *
 * @param startDate
 * @param endDate
 * @returns {number}
 */
export const getDaysHighSeason = (startDate, endDate) => {
  const intervals = {
    previous: {
      novemberStart: new Date(startDate.getFullYear() - 1, 10, 1),
      augustEnd: endOfMonth(new Date(endDate.getFullYear(), 7, 31)),
    },
    current: {
      novemberStart: new Date(startDate.getFullYear(), 10, 1),
      augustEnd: endOfMonth(new Date(endDate.getFullYear() + 1, 7, 31)),
    },
  };

  let days = 0;
  let currentDate = startDate;

  while (currentDate <= endDate) {
    if (
      isWithinInterval(currentDate, {
        start: intervals.previous.novemberStart,
        end: intervals.previous.augustEnd,
      }) ||
      isWithinInterval(currentDate, {
        start: intervals.current.novemberStart,
        end: intervals.current.augustEnd,
      })
    ) {
      days++;
    }
    currentDate = addDays(currentDate, 1);
  }

  return days;
};

/**
 * Début Septembre -> Fin Octobre
 *
 * @param startDate
 * @param endDate
 * @returns {number}
 */
export const getDaysLowSeason = (startDate, endDate) => {
  const septembreStart = startOfMonth(new Date(startDate.getFullYear(), 8, 1));
  const octoberEnd = endOfMonth(new Date(startDate.getFullYear(), 9, 31));

  let days = 0;
  let currentDate = startDate;

  while (currentDate <= endDate) {
    if (
      isWithinInterval(currentDate, { start: septembreStart, end: octoberEnd })
    ) {
      days++;
    }
    currentDate = addDays(currentDate, 1);
  }

  return days;
};

export const getFrenchDate = (date, withYear) => {
  return date
    ? format(date, withYear ? "d MMMM yyyy" : "d MMMM", { locale: fr })
    : "";
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
