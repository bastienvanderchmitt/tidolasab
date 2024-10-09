import { Button, Col, Container, Row, Table } from "reactstrap";
import useApi from "../../../hooks/useApi";
import { getClients } from "../../../api/client";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import ClientModal from "./Modals/ClientModal";
import useDialog from "../../../hooks/useDialog";
import useToggle from "../../../hooks/useToggle";

const Clients = () => {
  const [reloading, reload] = useToggle(false);
  const [{ clients }] = useApi(getClients, null, null, [reloading]);
  return (
    <>
      <Row className="admin-title g-0">
        <Col md={2}>
          <h1 className="aurore">Clients</h1>
        </Col>
      </Row>
      <Container fluid className="clients admin-content">
        <Row className="my-5">
          <Col>
            <AdminClient clients={clients} reload={reload} />
          </Col>
        </Row>
      </Container>
    </>
  );
};

const AdminClient = ({ clients, reload }) => {
  const dialog = useDialog();

  return (
    <Table
      striped
      hover
      bordered
      className="rounded"
      responsive
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
            <td>
              <Button
                id={"btn-client-" + c.id}
                onClick={async () => {
                  const result = await dialog(<ClientModal client={c} />);
                  if (result.action === "success") reload();
                }}
                color="primary"
                className="me-2 p-0 pe-1 ps-1"
              >
                <FontAwesomeIcon icon={faEdit} />
              </Button>
            </td>
          </tr>
        ))}
        {/*<tr>*/}
        {/*  <td*/}
        {/*    colSpan={5}*/}
        {/*    style={{ backgroundColor: "white", borderRight: "none" }}*/}
        {/*  >*/}
        {/*    <strong>Total :</strong>*/}
        {/*  </td>*/}
        {/*  <td*/}
        {/*    style={{*/}
        {/*      backgroundColor: "white",*/}
        {/*      borderLeft: "none",*/}
        {/*      borderRight: "none",*/}
        {/*    }}*/}
        {/*    className="text-center"*/}
        {/*  >*/}
        {/*    <strong>{clients?.length}</strong>*/}
        {/*  </td>*/}
        {/*</tr>*/}
      </tbody>
    </Table>
  );
};

export default Clients;
