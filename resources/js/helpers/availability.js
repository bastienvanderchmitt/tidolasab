/**
 * Disponibilités du gîte, alignées sur le serveur :
 * - une nuit N est prise si une réservation a date_arrivee <= N < date_depart
 *   (Booking::scopeOverlapping) : on peut donc arriver le jour d'un départ ;
 * - durée minimale globale et par période (BookingService::ensureStayAllowed).
 * Toutes les dates sont des chaînes YYYY-MM-DD, sans fuseau horaire.
 */

const DAY = 24 * 60 * 60 * 1000;

const toUtc = (isoDate) => {
  const [year, month, day] = isoDate.slice(0, 10).split("-").map(Number);
  return Date.UTC(year, month - 1, day);
};

const toIso = (time) => new Date(time).toISOString().slice(0, 10);

export const addDays = (isoDate, days) => toIso(toUtc(isoDate) + days * DAY);

export const nightsBetween = (checkIn, checkOut) =>
  Math.round((toUtc(checkOut) - toUtc(checkIn)) / DAY);

export const today = () => {
  const now = new Date();
  return toIso(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
};

export const takenNights = (bookings) => {
  const taken = new Set();
  for (const booking of bookings ?? []) {
    const end = toUtc(booking.date_depart);
    for (let night = toUtc(booking.date_arrivee); night < end; night += DAY) {
      taken.add(toIso(night));
    }
  }
  return taken;
};

export const minimumNightsFor = (pricing, checkIn, checkOut) => {
  let minimum = Number(pricing?.minimum_nights ?? 1);
  for (const period of pricing?.minimum_stay_periods ?? []) {
    const overlaps = checkIn <= period.end && checkOut > period.start;
    if (overlaps) minimum = Math.max(minimum, Number(period.nights));
  }
  return minimum;
};

// Nombre de nuits libres consécutives à partir d'une date (plafonné)
const freeRun = (date, taken, limit) => {
  let nights = 0;
  while (nights < limit && !taken.has(addDays(date, nights))) nights++;
  return nights;
};

export const isArrivalDisabled = (date, taken, pricing) => {
  if (date < today()) return true;
  const minimum = Number(pricing?.minimum_nights ?? 1);
  return freeRun(date, taken, minimum) < minimum;
};

export const isDepartureDisabled = (checkIn, date, taken, pricing) => {
  if (date <= checkIn) return true;
  const nights = nightsBetween(checkIn, date);
  if (freeRun(checkIn, taken, nights) < nights) return true;
  return nights < minimumNightsFor(pricing, checkIn, date);
};

/**
 * Raison pour laquelle un séjour complet est refusé, sous forme de clé i18n
 * et de paramètres, ou null s'il est valide.
 */
export const validateStay = (checkIn, checkOut, taken, pricing) => {
  if (!checkIn || !checkOut) return { key: "booking.errors.dates_required" };
  if (checkIn < today()) return { key: "booking.errors.past" };

  const nights = nightsBetween(checkIn, checkOut);
  if (nights < 1 || freeRun(checkIn, taken, nights) < nights) {
    return { key: "booking.errors.unavailable" };
  }

  const minimum = minimumNightsFor(pricing, checkIn, checkOut);
  if (nights < minimum) {
    return { key: "booking.errors.minimum", params: { nights: minimum } };
  }
  return null;
};
