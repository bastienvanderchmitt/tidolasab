import { NavItem, NavLink } from "reactstrap";
import { Link, useLocation } from "react-router-dom";

const CustomNavItem = ({ link, text, booking, callback }) => {
  const { pathname } = useLocation();

  return (
    <NavItem>
      <NavLink
        active={pathname === link}
        tag={Link}
        to={link}
        className={booking ? "booking" : ""}
        onClick={callback}
      >
        {text}
      </NavLink>
    </NavItem>
  );
};

export default CustomNavItem;
