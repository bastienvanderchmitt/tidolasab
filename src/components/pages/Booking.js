import { useLayoutContext } from "../../contexts/LayoutContext";
import React, { useEffect } from "react";
import { pages } from "../../helpers/pages";
import Essentials from "./Home/Essentials";
import { Col, Container, Row } from "reactstrap";
import Room from "./Booking/Room";
import Sidebar from "./Booking/Sidebar";
import DatePicker from "../formik/DatePicker";

const Booking = () => {
  const { setHeader } = useLayoutContext();

  useEffect(() => {
    setHeader(pages.booking);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <Container>
        <Row>
          <Col lg={8}>
            <Room />
          </Col>
          <Col lg={4}>
            <Sidebar />
          </Col>
        </Row>
        <Row>
          <Col>
            <DatePicker />
          </Col>
        </Row>
      </Container>
      <Essentials />
    </>
  );
};

export default Booking;
