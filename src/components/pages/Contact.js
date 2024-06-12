import { useLayoutContext } from "../../contexts/LayoutContext";
import { useEffect } from "react";
import { pages } from "../../helpers/pages";
import { Col, Container, Row } from "reactstrap";
import banner from "../../assets/img/locations/location_11.jpeg";
import FormContact from "../formik/forms/FormContact";

const Contact = () => {
  const { setHeader } = useLayoutContext();

  useEffect(() => {
    setHeader(pages.contact);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Container fluid>
      <Row>
        <Col lg={6} className="informations">
          <h4 className="title-4 pt-4">Informations</h4>
          <h5 className="title-2 pt-2">Tidolasab</h5>
          <p>1212 Morne Lolo</p>
          <p>97112, Grand Bourg</p>
          <p>
            <strong>Phone Number:</strong>{" "}
            <a href="tel:+6793456788">+679 345 67 88</a>
            <br />
            <strong>Email:</strong>{" "}
            <a href="mailto:tidolasab@gmail.com">tidolasab@gmail.com</a>
          </p>
        </Col>
        <Col lg={6} style={{ backgroundImage: "url(" + banner + ")" }}>
          <div className="contact-panel">
            <div className="form-contact">
              <h4 className="title-4 pt-4 text-center">Contact</h4>
              <h5 className="title-2 pb-4 text-center">Discutons !</h5>
              <FormContact />
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Contact;
