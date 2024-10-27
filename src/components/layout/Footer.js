import { Col, Container, Row } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook, faInstagram } from "@fortawesome/free-brands-svg-icons";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <section className="footer text-center bg-dark text-white">
      <Container fluid>
        <Row className="text-center">
          <Col className="footer-card">
            <h6 className="footer-title">{t("footer.address")}</h6>
            <p>Morne Lolo, 97112, Grand-Bourg</p>
          </Col>
          <Col className="footer-card">
            <h6 className="footer-title">{t("common.phone")}</h6>
            <a href="tel:0690648904" style={{ textDecorationColor: "#B99D75" }}>
              <p className="gold">06 90 64 89 04</p>
            </a>
          </Col>
          <Col className="footer-card">
            <h6 className="footer-title">Email</h6>
            <a
              href="mailto:tidolasab@gmail.com"
              style={{ textDecorationColor: "#B99D75" }}
            >
              <p className="gold">tidolasab@gmail.com</p>
            </a>
          </Col>
          <Col className="footer-card">
            <h6 className="footer-title">{t("footer.social")}</h6>
            <p>
              <a
                href="https://www.facebook.com/profile.php?id=61557470872317"
                target="_blank"
                rel="noreferrer"
              >
                <FontAwesomeIcon icon={faFacebook} className="me-4" size="xl" />
              </a>
              <a
                href="https://www.instagram.com/tidolasab?igsh=bHZnZTQ0OXRhNjRz"
                target="_blank"
                rel="noreferrer"
              >
                <FontAwesomeIcon icon={faInstagram} size="xl" />
              </a>
            </p>
          </Col>
        </Row>
        <Row>
          <Col className="py-4">© Copyright Tidolasab.</Col>
          {/*<Col className="footer-col">*/}
          {/*  <Row>*/}
          {/*<Col>*/}
          {/*  <a href="/privacy">Confidentialité</a>*/}
          {/*</Col>*/}
          {/*<Col>*/}
          {/*  <a href="/terms-of-use">Conditions d'utilisation</a>*/}
          {/*</Col>*/}
          {/*<Col>*/}
          {/*  <a href="/policy">Politique</a>*/}
          {/*</Col>*/}
          {/*</Row>*/}
          {/*</Col>*/}
        </Row>
      </Container>
    </section>
  );
};

export default Footer;
