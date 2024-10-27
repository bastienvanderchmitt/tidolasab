import mg_beach from "../../../assets/img/locations/location_4.jpeg";
import { Col, Container, Row } from "reactstrap";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Discover = () => {
  const { t } = useTranslation();

  return (
    <div className="discover">
      <Container>
        <Row className="p-4 discover-content">
          <Col className="p-5" xs={12} xl={6}>
            <Row>
              <Col>
                <h4 className="title-4 pt-4">{t("discover.title")}</h4>
              </Col>
            </Row>
            <p className="pt-4">{t("discover.description")}</p>
          </Col>
          <Col>
            <Link to={"/activities"}>
              <div className="position-relative">
                <div className="image-zoom">
                  <img src={mg_beach} className="w-100" alt="beach" />
                  <div className="offset-border"></div>
                  <div className="overlay-label">
                    <div className="overlay-label-text">
                      {t("discover.see")}
                    </div>
                  </div>
                </div>
              </div>
              <h4 className="aurore pt-3">{t("discover.image_title")}</h4>
            </Link>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Discover;
