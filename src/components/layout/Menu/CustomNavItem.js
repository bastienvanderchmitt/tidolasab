import { NavItem, NavLink } from "reactstrap";
import { useLocation } from "react-router-dom";

const CustomNavItem = ({ link, text }) => {
  const { pathname } = useLocation();

  return (
    <NavItem>
      <NavLink active={pathname === link} href={link}>
        {text}
      </NavLink>
    </NavItem>
  );
};

export default CustomNavItem;
