import { Col, Container, Row } from "reactstrap";

const Statistics = () => {
  return (
    <>
      <Row className="admin-title g-0">
        <Col md={2}>
          <h1 className="aurore">Statistiques</h1>
        </Col>
      </Row>
      <Container fluid className="statistics admin-content"></Container>
    </>
  );
};

export default Statistics;
