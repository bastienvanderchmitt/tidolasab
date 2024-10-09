import { useAdminContext } from "../../../contexts/AdminContext";
import {
  Button,
  Col,
  Collapse,
  Nav,
  Navbar,
  NavbarToggler,
  NavItem,
  NavLink,
  Row,
} from "reactstrap";
import { authService } from "../../../helpers/authService";
import { useNavigate } from "react-router-dom";
import logo from "../../../assets/img/logo_final.png";
import {
  faChartSimple,
  faEuroSign,
  faFileLines,
  faPowerOff,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";

const Sidebar = ({ active, setActive }) => {
  const { user, setIsAuthenticated } = useAdminContext();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  const logOut = () => {
    authService.logout();
    setIsAuthenticated(false);
    navigate("/admin/login/");
  };

  return (
    <>
      <Navbar
        className="d-block d-lg-none bg-secondary-subtle"
        expand={true}
        // fixed="top"
      >
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="me-auto" navbar>
            <Row>
              {/*<Col>*/}
              {/*  <NavItem className="text-center info">*/}
              {/*    <h4 className="text-secondary">{user.name}</h4>*/}
              {/*  </NavItem>*/}
              {/*</Col>*/}
              <Col>
                <NavItem>
                  <NavLink
                    href="#"
                    active={active === "BOOKINGS"}
                    onClick={() => setActive("BOOKINGS")}
                  >
                    <FontAwesomeIcon icon={faFileLines} className="me-1" />
                  </NavLink>
                </NavItem>
              </Col>
              <Col>
                <NavItem>
                  <NavLink
                    href="#"
                    active={active === "CLIENTS"}
                    onClick={() => setActive("CLIENTS")}
                  >
                    <FontAwesomeIcon icon={faUser} className="me-1" />
                  </NavLink>
                </NavItem>
              </Col>
              <Col>
                <NavItem>
                  <NavLink
                    href="#"
                    active={active === "PAIEMENTS"}
                    onClick={() => setActive("PAIEMENTS")}
                  >
                    <FontAwesomeIcon icon={faEuroSign} className="me-1" />
                  </NavLink>
                </NavItem>
              </Col>
              <Col>
                <NavItem>
                  <NavLink
                    href="#"
                    active={active === "STATS"}
                    onClick={() => setActive("STATS")}
                  >
                    <FontAwesomeIcon icon={faChartSimple} className="me-1" />
                  </NavLink>
                </NavItem>
              </Col>
              <Col>
                <NavItem>
                  <Button onClick={logOut} className="text-primary mt-2 ms-4">
                    <FontAwesomeIcon icon={faPowerOff} className="me-1" />
                  </Button>
                </NavItem>
              </Col>
            </Row>
          </Nav>
        </Collapse>
      </Navbar>
      <Navbar className="sidebar d-none d-lg-block">
        <div className="logo">
          <img alt="logo" src={logo} />
        </div>
        <div className="sidebar-wrapper">
          <Nav navbar>
            <NavItem className="text-center mb-4 info">
              <h4 className="text-secondary mt-4">{user.name}</h4>
              <Button onClick={logOut} className="mt-4 text-primary">
                <FontAwesomeIcon icon={faPowerOff} className="me-2" />
                <span>Déconnecter</span>
              </Button>
            </NavItem>
            <NavItem>
              <NavLink
                href="#"
                active={active === "BOOKINGS"}
                onClick={() => setActive("BOOKINGS")}
              >
                <Row>
                  <Col xs={2}>
                    <FontAwesomeIcon
                      icon={faFileLines}
                      className="me-4"
                      size="xl"
                    />
                  </Col>
                  <Col>
                    <span>RÉSERVATIONS</span>
                  </Col>
                </Row>
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                href="#"
                active={active === "CLIENTS"}
                onClick={() => setActive("CLIENTS")}
              >
                <Row>
                  <Col xs={2}>
                    <FontAwesomeIcon icon={faUser} className="me-4" size="xl" />
                  </Col>
                  <Col>
                    <span>CLIENTS</span>
                  </Col>
                </Row>
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                href="#"
                active={active === "PAIEMENTS"}
                onClick={() => setActive("PAIEMENTS")}
              >
                <Row>
                  <Col xs={2}>
                    <FontAwesomeIcon
                      icon={faEuroSign}
                      className="me-4"
                      size="xl"
                    />
                  </Col>
                  <Col>
                    <span>PAIEMENTS</span>
                  </Col>
                </Row>
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                href="#"
                active={active === "STATS"}
                onClick={() => setActive("STATS")}
              >
                <Row>
                  <Col xs={2}>
                    <FontAwesomeIcon
                      icon={faChartSimple}
                      className="me-4"
                      size="xl"
                    />
                  </Col>
                  <Col>
                    <span>STATISTIQUES</span>
                  </Col>
                </Row>
              </NavLink>
            </NavItem>
          </Nav>
        </div>
      </Navbar>
    </>
  );
};

export default Sidebar;
