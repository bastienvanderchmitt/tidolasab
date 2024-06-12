import FormBooking from "../../formik/forms/FormBooking";
import { Col, Row } from "reactstrap";
import DatePicker from "../../formik/DatePicker";
import React from "react";

const Sidebar = () => {
  return (
    <>
      <Row>
        <Col>
          <div className="sidebar">
            <h4 className="title-2 pt-2 pb-4 text-center">Réserver</h4>
            <FormBooking />
          </div>
        </Col>
      </Row>
      <Row className="my-5">
        <Col>
          <DatePicker />
        </Col>
      </Row>
    </>
  );
};

export default Sidebar;
