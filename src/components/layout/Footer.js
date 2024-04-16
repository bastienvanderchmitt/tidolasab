import { Col, Row } from "reactstrap";

const Footer = () => {
  return (
    <section className="footer text-center bg-dark text-white">
      <Row className="text-center">
        <Col className="footer-card">
          <h6 className="footer-title">Adresse</h6>
          <p>73120 Courchevel 1850, France</p>
        </Col>
        <Col className="footer-card">
          <h6 className="footer-title">Téléphone</h6>
          <p>06 09 92 18 20</p>
        </Col>
        <Col className="footer-card">
          <h6 className="footer-title">Email</h6>
          <p>bastienvanderchmitt@gmail.com</p>
        </Col>
        <Col className="footer-card">
          <h6 className="footer-title">Social</h6>
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
