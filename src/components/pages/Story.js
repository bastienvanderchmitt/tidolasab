import { Badge, Col, Container, Row } from "reactstrap";
import franck_isa from "../../assets/img/story/franck_isa.jpeg";
import { useTranslation } from "react-i18next";

const Story = () => {
  const { t } = useTranslation();

  return (
    <Container className="story" style={{ paddingBottom: "100px" }}>
      <Row className="p-4 m-lg-4 story-header">
        <Col className="text-center">
          <h4 className="title-4 pt-4">{t("history.title")}</h4>
          <h4 className="title-2 pt-2">{t("history.subtitle")}</h4>
          <div className="pt-3 m-auto">
            <p>{t("history.description_1")}</p>
            <p>{t("history.description_2")}</p>
            <p>{t("history.description_3")}</p>
          </div>
        </Col>
      </Row>
      <Row className="w-75 py-4 m-auto">
        <Col>
          <div className="p-4">
            <img
              className="rounded shadow transform-perspective-left w-100"
              src={franck_isa}
              alt="Franck & Isabelle"
            />
          </div>
        </Col>
      </Row>
      <Row className="w-75 py-4 m-auto">
        <Col>
          <p className="title-3 d-sm-none">Franck :</p>
          <Badge className="m-2 title-3">{t("history.maintenance")}</Badge>
          <Badge className="m-2 title-3">{t("history.rhum")}</Badge>
        </Col>
        <Col>
          <p className="title-3 d-sm-none mt-4">Isabelle :</p>
          <Badge className="m-2 title-3">{t("history.reception")}</Badge>
          <Badge className="m-2 title-3">{t("history.bookings")}</Badge>
          <Badge className="m-2 title-3">{t("history.communication")}</Badge>
        </Col>
      </Row>
    </Container>
  );
};

export default Story;
