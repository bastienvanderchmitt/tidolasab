export const BOOKING_STATUSES = {
  "en attente": { label: "En attente", color: "yellow" },
  validée: { label: "Validée", color: "teal" },
  annulée: { label: "Annulée", color: "gray" },
};

export const BOOKING_TYPES = {
  Classique: { label: "Directe", color: "violet" },
  Booking: { label: "Booking", color: "blue" },
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

export const REFUND_STATUS = { label: "Remboursé", color: "grape" };

// Un remboursement est un paiement encaissé de montant négatif
export const isRefund = (p) =>
  p.statut === "confirmé" && Number(p.montant_paiement) < 0;

export const methodLabel = (value) =>
  PAYMENT_METHODS.find((m) => m.value === value)?.label ?? value;
