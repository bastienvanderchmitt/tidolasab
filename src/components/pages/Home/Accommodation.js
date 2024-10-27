import { Button, Col, Container, Row } from "reactstrap";
import accommodation from "../../../assets/img/room/view_2.jpeg";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Assets from "./Assets";
import { faCalendarDays } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

const Accommodation = () => {
  const { t } = useTranslation();

  return (
    <Container className="accommodation">
      <Row className="p-4 accommodation-header">
        <Col className="text-center">
          <h4 className="title-4 pt-4">{t("accommodation.title")}</h4>
          <h4 className="title-2 pt-2">{t("accommodation.subtitle")}</h4>
          <p className="pt-3">{t("accommodation.subtitle_2")}</p>
        </Col>
      </Row>
      <Row>
        <Col className="p-4" xs={12} xl={6}>
          <Link to={"/photos"}>
            <div className="position-relative">
              <div className="image-zoom">
                <img
                  src={accommodation}
                  alt="accommodation"
                  className="w-100"
                />
                <div className="offset-border"></div>
              </div>
            </div>
            <h4 className="aurore pt-3 text-center">
              {t("accommodation.photo_link")}
            </h4>
          </Link>
        </Col>
        <Col className="p-4 text-center accommodation-content" xs={12} xl={6}>
          <div className="title-4">{t("accommodation.breadcrumb")}</div>
          <h4 className="title-2 pt-2">Case Ti' Dola Sab</h4>
          <div>
            <Assets />
          </div>
          <div className="">
            <p>{t("accommodation.description")}</p>
          </div>
          <div className="more-btn">
            <Link to={"/booking"}>
              <Button
                color="primary"
                className="text-uppercase animate__animated animate__pulse animate__infinite"
              >
                <FontAwesomeIcon icon={faCalendarDays} className="me-2" />
                {t("common.booking")}
              </Button>
            </Link>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Accommodation;
