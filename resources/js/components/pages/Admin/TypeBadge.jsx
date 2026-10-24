import React, { useMemo } from "react";
import { Badge } from "reactstrap";
import { getBookingTypeColor } from "../../../helpers/functions";

const TypeBadge = ({ type }) => {
  const color = useMemo(() => getBookingTypeColor(type), [type]);
  return <Badge color={color}>{type.toUpperCase()}</Badge>;
};

export default TypeBadge;
