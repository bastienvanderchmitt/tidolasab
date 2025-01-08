import React, { useMemo } from "react";
import { Badge } from "reactstrap";

const TypeBadge = ({ type }) => {
  const color = useMemo(
    () =>
      type === "Booking"
        ? "success"
        : type === "Fermeture"
          ? "warning"
          : type === "AirBnb"
            ? "info"
            : "primary",
    [type],
  );
  return <Badge color={color}>{type.toUpperCase()}</Badge>;
};

export default TypeBadge;
