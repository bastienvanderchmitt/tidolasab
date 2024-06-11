import { Col, Container, Row } from "reactstrap";
import Sidebar from "./Sidebar";
import { useState } from "react";
import Bookings from "./Bookings";
import Clients from "./Clients";
import Statistics from "./Statistics";

const Dashboard = () => {
  const [active, setActive] = useState("BOOKINGS");
  return (
    <Container fluid className="dashboard">
      <Row>
        <Col md={2}>
          <Sidebar active={active} setActive={setActive} />
        </Col>
        <Col md={10} className="p-4">
          {active === "BOOKINGS" ? (
            <Bookings />
          ) : active === "CLIENTS" ? (
            <Clients />
          ) : (
            <Statistics />
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
