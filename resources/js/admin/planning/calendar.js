/**
 * Calculs du planning sur des dates « YYYY-MM-DD », en UTC : le résultat ne dépend
 * pas du fuseau du navigateur (un fuseau mal annoncé décalait les jours d'une case).
 */

const DAY_MS = 86_400_000;
const pad = (n) => String(n).padStart(2, "0");

const toUTC = (iso) => {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
};
const toISO = (date) => date.toISOString().slice(0, 10);

export const addDays = (iso, count) =>
  toISO(new Date(toUTC(iso).getTime() + count * DAY_MS));

export const daysBetween = (from, to) =>
  Math.round((toUTC(to) - toUTC(from)) / DAY_MS);

/**
 * Date du jour dans le fuseau de l'appareil.
 */
export const todayISO = () => {
  const now = new Date();
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
};

/**
 * Premier jour du mois, décalé de « count » mois.
 */
export const addMonths = (iso, count) => {
  const date = toUTC(iso);
  return toISO(
    new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + count, 1)),
  );
};

export const monthLabel = (iso) =>
  new Intl.DateTimeFormat("fr-FR", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(toUTC(iso));

export const dayLabel = (iso) =>
  new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "UTC",
  }).format(toUTC(iso));

/**
 * Lundi = 0 … dimanche = 6.
 */
export const weekday = (iso) => (toUTC(iso).getUTCDay() + 6) % 7;

/**
 * Cases d'un mois en semaines commençant le lundi : null pour les cases vides du début.
 */
export const monthCells = (iso) => {
  const first = addMonths(iso, 0);
  const length = daysBetween(first, addMonths(first, 1));

  return [
    ...Array(weekday(first)).fill(null),
    ...Array.from({ length }, (_, i) => addDays(first, i)),
  ];
};

/**
 * Nuit occupée (date d'arrivée de la nuit) → réservation, hors annulations.
 * Une réservation validée prime sur une demande en attente pour la même nuit.
 */
export const occupancy = (bookings) => {
  const nightsMap = new Map();
  bookings
    .filter((b) => b.statut !== "annulée")
    .forEach((b) => {
      for (let d = b.date_arrivee; d < b.date_depart; d = addDays(d, 1)) {
        if (!nightsMap.has(d) || b.statut === "validée") nightsMap.set(d, b);
      }
    });
  return nightsMap;
};

/**
 * Départ proposé pour une réservation créée depuis le planning : « nights » nuits,
 * raccourci si une réservation commence avant.
 */
export const suggestedCheckOut = (checkIn, nightsMap, nights = 2) => {
  let checkOut = addDays(checkIn, 1);
  while (daysBetween(checkIn, checkOut) < nights && !nightsMap.has(checkOut)) {
    checkOut = addDays(checkOut, 1);
  }
  return checkOut;
};
