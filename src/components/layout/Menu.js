import {
  Col,
  Collapse,
  Container,
  Nav,
  Navbar,
  NavbarToggler,
  Row,
} from "reactstrap";
import { Parallax } from "react-parallax";
import { useLayoutContext } from "../../contexts/LayoutContext";
import useToggle from "../../hooks/useToggle";
import logo from "../../assets/img/logo_final.png";
import logoFull from "../../assets/img/logo_full.png";
import CustomNavItem from "./Menu/CustomNavItem";
import { useCallback, useEffect } from "react";
import { faBars, faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";

const Menu = () => {
  const [isOpen, toggle] = useToggle(false);
  const [isFixed, toggleFixed] = useToggle(false);

  const handleScroll = useCallback(() => {
    const position = window.pageYOffset;
    if (!isFixed && position > 400) {
      toggleFixed();
    } else if (isFixed && position < 400) {
      toggleFixed();
    }
  }, [isFixed]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  const { header } = useLayoutContext();

  return (
    <section
      className={
        header.image !== "home_banner.jpeg" ? "menu small" : "menu big"
      }
    >
      <Parallax
        bgImage={require("../../assets/img/banners/" + header.image)}
        bgImageAlt="the cat"
        strength={200}
        className="text-white text-center p-5"
        // bgImageStyle={header.image !== "banner.jpg" ? { height: "450px" } : {}}
      >
        {isFixed && (
          <Container className="desktop-menu d-none d-lg-block fixed animate__animated animate__fadeIn">
            <Row className="p-2">
              <Col>
                <Nav pills style={{ justifyContent: "center" }}>
                  <CustomNavItem link="/" text="Accueil" />
                  <CustomNavItem link="/booking" text="Réservation" />
                  <CustomNavItem link="/story" text="Histoire" />
                  <CustomNavItem link="/activities" text="Activités" />
                  <CustomNavItem link="/photos" text="Photos" />
                  <CustomNavItem link="/contact" text="Contact" />
                </Nav>
              </Col>
            </Row>
          </Container>
        )}
        <Container className="desktop-menu d-none d-lg-block">
          <Row className="pt-4">
            <Col>
              <Nav pills>
                <CustomNavItem link="/" text="Accueil" />
                <CustomNavItem link="/booking" text="Réservation" />
                <CustomNavItem link="/story" text="Histoire" />
              </Nav>
            </Col>
            <Col className="logo-col">
              <Link to="/">
                <img alt="logo" src={logo} style={{ marginTop: "-25px" }} />
              </Link>
            </Col>
            <Col>
              <Nav pills>
                <CustomNavItem link="/activities" text="Activités" />
                <CustomNavItem link="/photos" text="Photos" />
                <CustomNavItem link="/contact" text="Contact" />
              </Nav>
            </Col>
          </Row>
        </Container>

        <Container className="d-lg-none">
          <Navbar
            color="faded white"
            light
            fixed={isFixed || isOpen ? "top" : null}
          >
            <NavbarToggler onClick={toggle}>
              <FontAwesomeIcon icon={faBars} className="p-2 text-primary" />
            </NavbarToggler>
            <Collapse isOpen={isOpen} navbar className="menu-mobile">
              <div onClick={toggle}>
                <FontAwesomeIcon
                  icon={faCircleXmark}
                  className="p-2 text-white"
                  size="2xl"
                />
              </div>
              <Nav navbar pills>
                <CustomNavItem link="/" text="Accueil" />
                <CustomNavItem link="/booking" text="Réservation" />
                <CustomNavItem link="/story" text="Histoire" />
                <CustomNavItem link="/activities" text="Activités" />
                <CustomNavItem link="/photos" text="Photos" />
                <CustomNavItem link="/contact" text="Contact" />
              </Nav>
            </Collapse>
          </Navbar>
          <Row>
            <Col>
              <Link to="/">
                {isFixed ? (
                  <img src={logoFull} alt="logo" />
                ) : (
                  <img src={logo} alt="logo" />
                )}
              </Link>
            </Col>
          </Row>
        </Container>
        <Container className="animate__animated animate__fadeInDown">
          <Row>
            <Col className="header d-flex header align-items-center justify-content-center  pb-2">
              <div className="titles">
                <div className="header-subtitle">{header.subtitle}</div>
                <h1 className="header-title">{header.title}</h1>
                <div className="header-description">{header.description}</div>
              </div>
            </Col>
          </Row>
        </Container>
      </Parallax>
    </section>
  );
};

export default Menu;
