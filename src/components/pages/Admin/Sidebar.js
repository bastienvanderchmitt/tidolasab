import { useAdminContext } from "../../../contexts/AdminContext";
import {
  Button,
  Col,
  Collapse,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Nav,
  Navbar,
  NavbarToggler,
  NavItem,
  NavLink,
  Row,
  UncontrolledDropdown,
} from "reactstrap";
import { authService } from "../../../helpers/authService";
import { useLocation, useNavigate } from "react-router-dom";
import logo from "../../../assets/img/logo_final.png";
import {
  faBars,
  faPowerOff,
  faSignOutAlt,
  faTimes,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useCallback, useEffect, useState } from "react";
import { adminRoutes } from "../../../routes/allRoutes";
import SearchClient from "./SearchClient";
import useToggle from "../../../hooks/useToggle";

const Sidebar = () => {
  const { user, setIsAuthenticated } = useAdminContext();
  const navigate = useNavigate();
  const location = useLocation();

  const [isOpen, setIsOpen] = useState(false);
  const [isFixed, toggleFixed] = useToggle(false);

  const toggle = () => setIsOpen(!isOpen);

  const logOut = () => {
    authService.logout();
    setIsAuthenticated(false);
    navigate("/admin/login/");
  };

  const handleScroll = useCallback(() => {
    const position = window.pageYOffset;
    if (!isFixed && position > 50) {
      toggleFixed();
    } else if (isFixed && position < 50) {
      toggleFixed();
    }
  }, [isFixed]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  return (
    <>
      {/*Navbar Header*/}
      <Navbar
        className={
          isFixed
            ? "p-2 mb-2 navbar-expand-lg fixed-top active"
            : "p-2 mb-2 navbar-expand-lg fixed-top"
        }
        style={{ zIndex: "11", minHeight: "60px" }}
      >
        <div className="text-white d-block d-lg-none bg-secondary-subtle rounded">
          <Button color="link" onClick={toggle}>
            <FontAwesomeIcon icon={isOpen ? faTimes : faBars} />
          </Button>
        </div>

        {((isOpen && isFixed) || !isOpen) && (
          <img alt="logo" src={logo} style={{ width: "35px" }} />
        )}

        <h5
          className="d-none d-lg-flex jost text-primary mx-5 mt-1 p-2 rounded"
          style={{ fontWeight: "bold", backgroundColor: "#dee2e6" }}
        >
          Ti' Dola Sab
        </h5>

        <Nav pills className="d-none d-lg-flex">
          <NavItem>
            <NavLink
              href={"/admin/dashboard"}
              active={"/admin/dashboard" === location.pathname}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="5" y="4" width="4" height="4"></rect>
                <rect x="12" y="4" width="4" height="4"></rect>
                <rect x="12" y="11" width="4" height="4"></rect>
                <rect x="5" y="11" width="4" height="4"></rect>
              </svg>
              Dashboard
            </NavLink>
          </NavItem>
          {adminRoutes
            .filter((r) => !!r.icon)
            .map((r, i) => (
              <NavItem key={i}>
                <NavLink href={r.path} active={r.path === location.pathname}>
                  <span className="me-2">
                    <FontAwesomeIcon icon={r.icon} />
                  </span>
                  {/*<Col>*/}
                  <span>{r.label}</span>
                  {/*</Col>*/}
                </NavLink>
              </NavItem>
            ))}
        </Nav>

        <div className="admin-search ms-auto me-3 d-none d-lg-inline-block">
          <SearchClient />
        </div>

        <UncontrolledDropdown>
          <DropdownToggle nav caret className="text-primary">
            <FontAwesomeIcon icon={faUser} className="me-2" />
            <span className="d-none d-lg-inline-block">{user.name}</span>
          </DropdownToggle>
          <DropdownMenu end>
            <DropdownItem header>Mon compte</DropdownItem>
            <DropdownItem>Profil</DropdownItem>
            <DropdownItem divider />
            <DropdownItem className="text-danger" onClick={logOut}>
              <FontAwesomeIcon icon={faSignOutAlt} className="me-2" />
              Déconnexion
            </DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>
      </Navbar>

      {/*Navbar Menu*/}
      {isOpen ? (
        <div
          horizontal
          navbar
          style={{
            height: "100vH",
            width: "70vW",
            // position: "absolute",
            top: "0",
            left: "0",
            zIndex: "2",
            padding: "10px",
            paddingTop: "80px",
            backdropFilter: "blur(15px)",
            backgroundColor: "hsla(0, 0%, 100%, .85)",
            boxShadow: "2px 0 15px rgba(0, 0, 0, .1)",
          }}
          className="animate__animated animate__faster animate__fadeInLeft fixed-top"
        >
          {/*Mobile*/}
          <Nav className="d-flex d-lg-none" vertical>
            <NavItem onClick={() => setIsOpen(false)}>
              <NavLink
                href={"/admin/dashboard"}
                active={"/admin/dashboard" === location.pathname}
                style={{ fontSize: "18px" }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="4" width="4" height="4"></rect>
                  <rect x="9" y="4" width="4" height="4"></rect>
                  <rect x="9" y="11" width="4" height="4"></rect>
                  <rect x="2" y="11" width="4" height="4"></rect>
                </svg>
                Dashboard
              </NavLink>
            </NavItem>
            {adminRoutes
              .filter((r) => !!r.icon)
              .map((r, i) => (
                <NavItem
                  key={i}
                  onClick={() => setIsOpen(false)}
                  className="my-1"
                >
                  <NavLink
                    href={r.path}
                    active={r.path === location.pathname}
                    style={{ fontSize: "18px" }}
                  >
                    <span className="me-2">
                      <FontAwesomeIcon icon={r.icon} />
                    </span>
                    <span>{r.label}</span>
                  </NavLink>
                </NavItem>
              ))}
          </Nav>
        </div>
      ) : null}
    </>
  );
};

export default Sidebar;
