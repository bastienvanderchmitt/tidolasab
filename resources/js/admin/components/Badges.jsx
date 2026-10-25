import { Badge } from "@mantine/core";
import {
  BOOKING_STATUSES,
  BOOKING_TYPES,
  EMAIL_STATUSES,
  PAYMENT_STATUSES,
  REFUND_STATUS,
  emailStatus,
} from "../utils/labels";

export const StatusBadge = ({ status }) => {
  const { label, color } = BOOKING_STATUSES[status] ?? {
    label: status,
    color: "gray",
  };
  return (
    <Badge color={color} variant="light">
      {label}
    </Badge>
  );
};

export const TypeBadge = ({ type }) => {
  const { label, color } = BOOKING_TYPES[type] ?? {
    label: type,
    color: "gray",
  };
  return (
    <Badge color={color} variant="dot">
      {label}
    </Badge>
  );
};

export const PaymentStatusBadge = ({ status, overdue, refund }) => {
  const { label, color } = refund
    ? REFUND_STATUS
    : (PAYMENT_STATUSES[status] ?? { label: status, color: "gray" });
  return (
    <Badge color={overdue ? "red" : color} variant="light">
      {overdue ? "En retard" : label}
    </Badge>
  );
};

export const EmailStatusBadge = ({ email }) => {
  const { label, color } = EMAIL_STATUSES[emailStatus(email)] ?? {
    label: email.statut,
    color: "gray",
  };
  return (
    <Badge color={color} variant="light">
      {label}
    </Badge>
  );
};
