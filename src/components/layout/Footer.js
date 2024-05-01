import { Col, Row } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faTwitter,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";

const Footer = () => {
  return (
    <section className="footer text-center bg-dark text-white">
      <Row className="text-center">
        <Col className="footer-card">
          <h6 className="footer-title">Adresse</h6>
          <p>1212 Morne Lolo 97112, Grand Bourg</p>
        </Col>
        <Col className="footer-card">
          <h6 className="footer-title">Téléphone</h6>
          <p>06 09 92 18 20</p>
        </Col>
        <Col className="footer-card">
          <h6 className="footer-title">Email</h6>
          <p>tidolasab@gmail.com</p>
        </Col>
        <Col className="footer-card">
          <h6 className="footer-title">Social</h6>
          <p>
            <FontAwesomeIcon icon={faFacebook} className="me-4" />
            <FontAwesomeIcon icon={faTwitter} className="me-4" />
            <FontAwesomeIcon icon={faInstagram} />
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
    </section>
  );
};

export default Footer;
