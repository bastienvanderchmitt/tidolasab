import Essentials from "./Home/Essentials";
import { Col, Container, Row } from "reactstrap";
import Room from "./Booking/Room";
import Sidebar from "./Booking/Sidebar";
import RoomImages from "./Booking/RoomImages";

const Booking = () => {
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
      </Container>
      <RoomImages />
      <Essentials fromBooking />
    </>
  );
};

export default Booking;
