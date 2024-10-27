import FormBooking from "../../formik/forms/FormBooking";
import { Col, Row } from "reactstrap";
import DatePicker from "../../formik/DatePicker";
import React from "react";
import { useTranslation } from "react-i18next";

const Sidebar = ({ callbackAdmin }) => {
  const { t } = useTranslation();

  return (
    <>
      {!!callbackAdmin && (
        <Row className="my-5">
          <Col>
            <DatePicker />
          </Col>
        </Row>
      )}
      <Row>
        <Col>
          <div className="sidebar">
            {!callbackAdmin && (
              <h4 className="title-2 pt-2 pb-4 text-center">
                {t("common.booking")}
              </h4>
            )}
            <FormBooking callbackAdmin={callbackAdmin} />
          </div>
        </Col>
      </Row>
      {!callbackAdmin && (
        <Row className="my-5">
          <Col>
            <DatePicker />
          </Col>
        </Row>
      )}
    </>
  );
};

export default Sidebar;
