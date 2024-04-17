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
import logo from "../../assets/img/logo.png";
import logoFull from "../../assets/img/logo_full.png";
import CustomNavItem from "./Menu/CustomNavItem";
import { useCallback, useEffect } from "react";

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
    <section className="menu">
      <Parallax
        bgImage={require("../../assets/img/" + header.image)}
        bgImageAlt="the cat"
        strength={200}
        className="text-white text-center p-5"
      >
        {isFixed && (
          <Container className="desktop-menu d-none d-lg-block fixed animate__animated animate__fadeIn">
            <Row className="p-2">
              <Col>
                <Nav pills style={{ justifyContent: "center" }}>
                  <CustomNavItem link="/" text="Accueil" />
                  <CustomNavItem link="/about" text="Histoire" />
                  <CustomNavItem link="/services" text="Services" />
                  <CustomNavItem link="/activites" text="Activités" />
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
                <CustomNavItem link="/about" text="Histoire" />
                <CustomNavItem link="/services" text="Services" />
              </Nav>
            </Col>
            <Col>
              <img alt="logo" src={logo} style={{ marginTop: "-25px" }} />
            </Col>
            <Col>
              <Nav pills>
                <CustomNavItem link="/activites" text="Activités" />
                <CustomNavItem link="/photos" text="Photos" />
                <CustomNavItem link="/contact" text="Contact" />
              </Nav>
            </Col>
          </Row>
        </Container>

        <Container className="d-lg-none">
          <Navbar color="faded white" light fixed={isFixed ? "top" : null}>
            <NavbarToggler onClick={toggle}>TEST</NavbarToggler>
            <Collapse isOpen={isOpen} navbar className="menu-mobile">
              <Nav navbar pills>
                <CustomNavItem link="/" text="Accueil" />
                <CustomNavItem link="/about" text="Histoire" />
                {/*<CustomNavItem link="/login" text="Login" />*/}
                <CustomNavItem link="/services" text="Services" />
                <CustomNavItem link="/activites" text="Activités" />
                <CustomNavItem link="/photos" text="Photos" />
                <CustomNavItem link="/contact" text="Contact" />
              </Nav>
            </Collapse>
          </Navbar>
          <Row>
            <Col>
              {isFixed ? (
                <img src={logoFull} alt="logo" />
              ) : (
                <img src={logo} alt="logo" />
              )}
            </Col>
          </Row>
        </Container>
        <Container className="animate__animated animate__fadeInDown">
          <Row>
            <Col className="header d-flex header align-items-center justify-content-center">
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
