import { Col, Container, Row } from "reactstrap";
import Sidebar from "./Sidebar";
import { useState } from "react";
import Bookings from "./Bookings";
import Clients from "./Clients";
import Statistics from "./Statistics";
import { Toaster } from "react-hot-toast";
import Payments from "./Payments";

const Dashboard = () => {
  const [active, setActive] = useState("BOOKINGS");
  return (
    <>
      <Toaster />
      <Container fluid className="dashboard min-vh-100">
        <Row>
          <Col lg={2} className="g-0">
            <Sidebar active={active} setActive={setActive} />
          </Col>
          <Col lg={10} className="g-0">
            {active === "BOOKINGS" ? (
              <Bookings />
            ) : active === "CLIENTS" ? (
              <Clients />
            ) : active === "PAIEMENTS" ? (
              <Payments />
            ) : (
              <Statistics />
            )}
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Dashboard;
