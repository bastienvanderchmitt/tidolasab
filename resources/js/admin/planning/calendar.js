import { dayjs } from "../utils/format";

/**
 * Nuit occupée (date « YYYY-MM-DD ») → réservation, hors annulations.
 * Une réservation validée prime sur une demande en attente pour la même nuit.
 */
export const occupancy = (bookings) => {
  const nightsMap = new Map();
  bookings
    .filter((b) => b.statut !== "annulée")
    .forEach((b) => {
      for (
        let d = dayjs(b.date_arrivee);
        d.isBefore(b.date_depart, "day");
        d = d.add(1, "day")
      ) {
        const key = d.format("YYYY-MM-DD");
        if (!nightsMap.has(key) || b.statut === "validée")
          nightsMap.set(key, b);
      }
    });
  return nightsMap;
};

/**
 * Cases d'un mois en semaines commençant le lundi : null pour les cases vides du début.
 */
export const monthCells = (month) => {
  const start = month.startOf("month");
  const offset = (start.day() + 6) % 7;

  return [
    ...Array(offset).fill(null),
    ...Array.from({ length: start.daysInMonth() }, (_, i) =>
      start.add(i, "day"),
    ),
  ];
};
