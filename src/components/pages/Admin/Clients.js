import { Col, Container, Row, Table } from "reactstrap";
import useApi from "../../../hooks/useApi";
import { getClients } from "../../../api/client";
import React from "react";

const Clients = () => {
  const [{ clients }] = useApi(getClients);
  return (
    <Container fluid className="clients">
      <Row>
        <Col md={2}>
          <h1 className="aurore">Clients</h1>
        </Col>
      </Row>
      <Row className="my-5">
        <Col>
          <AdminClient clients={clients} />
        </Col>
      </Row>
    </Container>
  );
};

const AdminClient = ({ clients, reload }) => {
  return (
    <Table
      striped
      hover
      bordered
      className="rounded"
      style={{ boxShadow: "0 6px 10px -4px rgba(0, 0, 0, .15)" }}
    >
      <thead>
        <tr className="text-center">
          <th>Id</th>
          <th>Nom</th>
          <th>Prénom</th>
          <th>Email</th>
          <th>Téléphone</th>
          <th>Adresse</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {clients?.map((c, i) => (
          <tr key={i} className="text-center">
            <th scope="row">{c.id}</th>
            <td>{c.nom}</td>
            <td>{c.prenom}</td>
            <td>{c.email}</td>
            <td>{c.telephone}</td>
            <td>{c.adresse}</td>
            <td></td>
          </tr>
        ))}
        <tr>
          <td
            colSpan={5}
            style={{ backgroundColor: "white", borderRight: "none" }}
          >
            <strong>Total :</strong>
          </td>
          <td
            style={{
              backgroundColor: "white",
              borderLeft: "none",
              borderRight: "none",
            }}
            className="text-center"
          >
            <strong>{clients?.length}</strong>
          </td>
          <td style={{ backgroundColor: "white", borderLeft: "none" }}></td>
        </tr>
      </tbody>
    </Table>
  );
};

export default Clients;
