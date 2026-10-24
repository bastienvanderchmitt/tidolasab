import {
  faBan,
  faCircleCheck,
  faPauseCircle,
} from "@fortawesome/free-solid-svg-icons";
import { faAirbnb, faBootstrap } from "@fortawesome/free-brands-svg-icons";

export const getBookingStatusColor = (statut) => {
  return statut === "en attente"
    ? "warning"
    : statut === "validée"
      ? "success"
      : "danger";
};

export const getBookingStatusIcon = (statut) => {
  return statut === "en attente"
    ? faPauseCircle
    : statut === "validée"
      ? faCircleCheck
      : faBan;
};

export const getBookingTypeColor = (type) => {
  return type === "Booking"
    ? "success"
    : type === "Fermeture"
      ? "warning"
      : type === "AirBnb"
        ? "info"
        : "primary";
};

export const getBookingTypeIcon = (type) => {
  return type === "AirBnb"
    ? faAirbnb
    : type === "Booking"
      ? faBootstrap
      : type === "Classique"
        ? faCircleCheck
        : faBan;
};

export const getPaymentTypeColor = (paymentType) => {
  return paymentType === "virement"
    ? "success"
    : paymentType === "chèque"
      ? "secondary"
      : "primary";
};
