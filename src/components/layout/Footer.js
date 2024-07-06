import { Col, Container, Row } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faTwitter,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";

const Footer = () => {
  return (
    <section className="footer text-center bg-dark text-white">
      <Container fluid>
        <Row className="text-center">
          <Col className="footer-card">
            <h6 className="footer-title">Adresse</h6>
            <p>1212 Morne Lolo 97112, Grand Bourg</p>
          </Col>
          <Col className="footer-card">
            <h6 className="footer-title">Téléphone</h6>
            <a
              href="tel:+679 345 67 88"
              style={{ textDecorationColor: "#B99D75" }}
            >
              <p className="gold">+679 345 67 88</p>
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
            <h6 className="footer-title">Réseaux sociaux</h6>
            <p>
              <FontAwesomeIcon icon={faFacebook} className="me-4" size="xl" />
              <FontAwesomeIcon icon={faTwitter} className="me-4" size="xl" />
              <FontAwesomeIcon icon={faInstagram} size="xl" />
            </p>
          </Col>
        </Row>
        <Row>
          <Col className="footer-col">© Copyright Tidolasab.</Col>
          <Col className="footer-col">
            <Row>
              <Col>
                <a href="/privacy">Confidentialité</a>
              </Col>
              <Col>
                <a href="/terms-of-use">Conditions d'utilisation</a>
              </Col>
              <Col>
                <a href="/policy">Politique</a>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Footer;
