import { Badge } from "@mantine/core";
import {
  BOOKING_STATUSES,
  BOOKING_TYPES,
  PAYMENT_STATUSES,
  REFUND_STATUS,
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
