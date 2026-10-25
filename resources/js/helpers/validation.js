import { FIVE_DIGIT_POSTCODES } from "./countries";

/**
 * Formats des coordonnées, partagés par le site et l'admin.
 * Le serveur applique les mêmes règles (App\Rules\PhoneNumber, App\Rules\PostalCode).
 */

// Pas d'espace ni de double @, un domaine avec au moins un point et sans « .. »
export const isEmail = (value) =>
  /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/.test(value.trim());

// Chiffres, espaces, points, tirets et parenthèses, + en tête ; 8 à 15 chiffres
export const isPhone = (value) => {
  const trimmed = value.trim();
  if (!/^\+?[0-9 ().-]+$/.test(trimmed)) return false;
  const digits = trimmed.replace(/\D/g, "").length;
  return digits >= 8 && digits <= 15;
};

export const isPostalCode = (value, countryCode) => {
  const trimmed = value.trim();
  return FIVE_DIGIT_POSTCODES.includes(countryCode)
    ? /^\d{5}$/.test(trimmed)
    : /^[A-Za-z0-9][A-Za-z0-9 -]{1,9}$/.test(trimmed);
};

// Une adresse postale : au moins 5 caractères dont des lettres
export const isAddress = (value) =>
  value.trim().length >= 5 && /\p{L}/u.test(value);
