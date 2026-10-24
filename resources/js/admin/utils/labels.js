export const BOOKING_STATUSES = {
  "en attente": { label: "En attente", color: "yellow" },
  validée: { label: "Validée", color: "teal" },
  annulée: { label: "Annulée", color: "gray" },
};

export const BOOKING_TYPES = {
  Classique: { label: "Directe", color: "blue" },
  Booking: { label: "Booking", color: "indigo" },
  AirBnb: { label: "Airbnb", color: "pink" },
  Fermeture: { label: "Fermeture", color: "dark" },
};

export const PAYMENT_METHODS = [
  { value: "virement", label: "Virement" },
  { value: "espèces", label: "Espèces" },
  { value: "chèque", label: "Chèque" },
];

export const PAYMENT_STATUSES = {
  confirmé: { label: "Encaissé", color: "teal" },
  brouillon: { label: "Attendu", color: "orange" },
};

export const methodLabel = (value) =>
  PAYMENT_METHODS.find((m) => m.value === value)?.label ?? value;
