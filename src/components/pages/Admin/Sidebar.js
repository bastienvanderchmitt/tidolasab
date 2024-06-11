import { useAdminContext } from "../../../contexts/AdminContext";
import { Button, Nav, Navbar, NavItem, NavLink } from "reactstrap";
import { authService } from "../../../helpers/authService";
import { useNavigate } from "react-router-dom";
import logo from "../../../assets/img/logo_final.png";
import {
  faChartSimple,
  faFileLines,
  faPowerOff,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

const Sidebar = ({ active, setActive }) => {
  const { user, setIsAuthenticated } = useAdminContext();
  const navigate = useNavigate();

  const logOut = () => {
    authService.logout();
    setIsAuthenticated(false);
    navigate("/admin/login/");
  };

  return (
    <Navbar className="sidebar">
      <div className="logo">
        <img alt="logo" src={logo} />
      </div>
      <div className="sidebar-wrapper">
        <Nav navbar>
          <NavItem className="text-center mb-4 info">
            <h4 className="text-secondary mt-4">{user.name}</h4>
            <Button onClick={logOut} className="mt-4 text-primary">
              <FontAwesomeIcon icon={faPowerOff} className="me-2" />
              Déconnecter
            </Button>
          </NavItem>
          <NavItem>
            <NavLink
              href="#"
              active={active === "BOOKINGS"}
              onClick={() => setActive("BOOKINGS")}
            >
              <FontAwesomeIcon icon={faFileLines} className="me-4" size="xl" />
              RÉSERVATIONS
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              href="#"
              active={active === "CLIENTS"}
              onClick={() => setActive("CLIENTS")}
            >
              <FontAwesomeIcon icon={faUser} className="me-4" size="xl" />
              CLIENTS
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              href="#"
              active={active === "STATS"}
              onClick={() => setActive("STATS")}
            >
              <FontAwesomeIcon
                icon={faChartSimple}
                className="me-4"
                size="xl"
              />
              STATISTIQUES
            </NavLink>
          </NavItem>
        </Nav>
      </div>
    </Navbar>
  );
};

export default Sidebar;
