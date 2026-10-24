import React, { useEffect } from "react";
import { useBookingContext } from "../../contexts/BookingContext";
import { Link, useNavigate } from "react-router-dom";
import { Col, Container, Row } from "reactstrap";
import { getDaysFromNow } from "../../helpers/dates";
import Price from "./Booking/Price";
import { useTranslation } from "react-i18next";

const Success = () => {
  const { total, booked, selectedDates } = useBookingContext();

  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    !booked && navigate("/");
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Container>
      <Row>
        <Row className="p-4">
          <Col className="p-5">
            <Row>
              <Col>
                <h4 className="title-4 pt-4 mb-2">{t("success.title")}</h4>
              </Col>
            </Row>
            <Row>
              <Col>
                <span className="title-2 mt-4">{t("success.subtitle")}</span>
              </Col>
            </Row>
            <Row className="my-4">
              <Col style={{ maxWidth: "650px" }}>
                <Price withParticipants />
              </Col>
            </Row>
            <Row className="my-4 py-4">
              <Col>
                <span className="title-3 mt-4">
                  {t("success.less")}{" "}
                  <span className="gold marcellus">
                    {getDaysFromNow(selectedDates[0])}
                  </span>{" "}
                  {t("success.patience")} &#128521;
                </span>
              </Col>
            </Row>
            <Row className="bg-secondary my-4 rounded">
              <p className="pt-4 px-4">
                {t("success.desc_1_1")}{" "}
                <span className="bold">{t("success.desc_1_2")}</span>
                {t("success.desc_1_3")} <span className="bold">RIB</span>
                {t("success.desc_1_4")}
              </p>
              <p className="px-4">
                {t("success.desc_2_1")}
                <span className="bold">{t("success.desc_2_2")}</span> (
                {total / 2} €).
              </p>
              <p className="px-4">
                {t("success.desc_3_1")}
                <span className="bold">{t("success.desc_3_2")}</span>
                {t("success.desc_3_3")}{" "}
                <span className="bold">{t("success.desc_3_4")}</span>.
              </p>
            </Row>
            <Row>
              <p className="pt-4">
                {t("success.activities_1")}{" "}
                <Link to="/activities">{t("success.activities")}</Link>
                {t("success.activities_2")}
              </p>
            </Row>
          </Col>
        </Row>
      </Row>
    </Container>
  );
};

export default Success;
