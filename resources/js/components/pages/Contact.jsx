import { Col, Container, Row } from "reactstrap";
import banner from "../../assets/img/locations/location_11.jpeg";
import FormContact from "../formik/forms/FormContact";
import { useTranslation } from "react-i18next";

const Contact = () => {
  const { t } = useTranslation();

  return (
    <Container fluid>
      <Row>
        <Col lg={6} className="informations">
          <h4 className="title-4 pt-4">Informations</h4>
          <h5 className="title-2 pt-2">Ti' Dola Sab</h5>
          <p>Morne Lolo</p>
          <p>97112 Grand-Bourg</p>
          <p>
            <strong>{t("common.phone")}:</strong>{" "}
            <a href="tel:0690648904">06 90 64 89 04</a>
            <br />
            <strong>Email:</strong>{" "}
            <a href="mailto:tidolasab@gmail.com">tidolasab@gmail.com</a>
          </p>
        </Col>
        <Col lg={6} style={{ backgroundImage: "url(" + banner + ")" }}>
          <div className="contact-panel">
            <div className="form-contact">
              <h4 className="title-4 pt-4 text-center">
                {t("contact.contact")}
              </h4>
              <h5 className="title-2 pb-4 text-center">{t("contact.title")}</h5>
              <FormContact />
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Contact;
