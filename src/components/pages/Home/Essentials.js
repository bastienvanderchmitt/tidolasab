import { Col, Container, Row } from "reactstrap";
import essentials_1 from "../../../assets/img/room/room_6.jpeg";
import essentials_2 from "../../../assets/img/room/view_1.jpeg";
import essentials_3 from "../../../assets/img/room/view_4.jpeg";
import essentials_4 from "../../../assets/img/room/view_5.jpeg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlane,
  faWifi,
  faBroomBall,
  faUmbrellaBeach,
  faBowlRice,
  faMartiniGlassCitrus,
  faWind,
  faSwimmingPool,
} from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";

const Essential = ({ title, text, icon }) => {
  return (
    <Col sm={12} md={6} className="essential">
      <Row>
        <Col xs={3}>
          <FontAwesomeIcon icon={icon} />
        </Col>
        <Col>
          <h5>{title}</h5>
          <p>{text}</p>
        </Col>
      </Row>
    </Col>
  );
};

const Essentials = ({ fromBooking }) => {
  const { t } = useTranslation();

  return (
    <Container className="essentials">
      <Row className="p-4">
        <Col className="px-5 d-none d-md-block">
          <div className="image-zoom">
            {fromBooking ? (
              <img alt="essentials_3" src={essentials_3} className="w-100" />
            ) : (
              <img alt="essentials_1" src={essentials_1} className="w-100" />
            )}
          </div>
          <h4 className="aurore pt-3">{t("essentials.photo_title")}</h4>
        </Col>
        <Col>
          <Row>
            <Col>
              <h4 className="title-4">{t("essentials.title")}</h4>
            </Col>
          </Row>
          <Row>
            <Col>
              <h4 className="title-2 pt-2">{t("essentials.subtitle")}</h4>
            </Col>
          </Row>
          <Row className="pt-5">
            <Essential
              title={t("essentials.airport_title")}
              icon={faPlane}
              text={t("essentials.airport_description")}
            />
            <Essential
              title={t("essentials.stuff_title")}
              icon={faUmbrellaBeach}
              text={t("essentials.stuff_description")}
            />
          </Row>
          <Row className="pt-1 pb-2">
            <Essential
              title={t("essentials.pool_title")}
              icon={faSwimmingPool}
              text={t("essentials.pool_description")}
            />
            <Essential title={t("essentials.clim")} icon={faWind} />
          </Row>
          <Row>
            <Essential
              title={t("essentials.wifi_title")}
              icon={faWifi}
              text={t("essentials.wifi_description")}
            />
            <Essential
              title={t("essentials.rhum_title")}
              icon={faMartiniGlassCitrus}
              text={t("essentials.rhum_description")}
            />
          </Row>
          <Row className="pb-4">
            <Essential
              title={t("essentials.clean_title")}
              icon={faBroomBall}
              text={t("essentials.clean_description")}
            />
            <Essential
              title={t("essentials.food_title")}
              icon={faBowlRice}
              text={t("essentials.food_description")}
            />
          </Row>
          <Row>
            <Col>
              <div className="position-relative">
                <div className="image-zoom">
                  {fromBooking ? (
                    <img
                      alt="essentials_4"
                      src={essentials_4}
                      className="w-100"
                    />
                  ) : (
                    <img
                      alt="essentials_2"
                      src={essentials_2}
                      className="w-100"
                    />
                  )}
                  <div className="offset-border"></div>
                </div>
              </div>
            </Col>
          </Row>
          <Row>
            <Col className="pt-4 px-5 d-md-none">
              <div className="image-zoom">
                {fromBooking ? (
                  <img
                    alt="essentials_3"
                    src={essentials_3}
                    className="w-100"
                  />
                ) : (
                  <img
                    alt="essentials_1"
                    src={essentials_1}
                    className="w-100"
                  />
                )}
              </div>
              <h4 className="aurore pt-3">{t("essentials.photo_title")}</h4>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default Essentials;
