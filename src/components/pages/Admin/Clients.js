import { Button, Col, Container, Row, Table } from "reactstrap";
import useApi from "../../../hooks/useApi";
import { deleteClient, getClients } from "../../../api/client";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import ClientModal from "./Modals/ClientModal";
import useDialog from "../../../hooks/useDialog";
import useToggle from "../../../hooks/useToggle";
import useConfirmDialog from "../../../hooks/useConfirmDialog";
import toast from "react-hot-toast";
import useSorting from "../../../hooks/useSorting";

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
  const confirm = useConfirmDialog();

  const {
    sortedData: sortedClients,
    requestSort,
    getSortIcon,
  } = useSorting(clients);

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
          <th onClick={() => requestSort("nom")} style={{ cursor: "pointer" }}>
            Nom <FontAwesomeIcon icon={getSortIcon("nom")} />
          </th>
          <th
            onClick={() => requestSort("prenom")}
            style={{ cursor: "pointer" }}
          >
            Prénom <FontAwesomeIcon icon={getSortIcon("prenom")} />
          </th>
          <th
            onClick={() => requestSort("email")}
            style={{ cursor: "pointer" }}
          >
            Email <FontAwesomeIcon icon={getSortIcon("email")} />
          </th>
          <th
            onClick={() => requestSort("telephone")}
            style={{ cursor: "pointer" }}
          >
            Téléphone <FontAwesomeIcon icon={getSortIcon("telephone")} />
          </th>
          <th
            onClick={() => requestSort("adresse")}
            style={{ cursor: "pointer" }}
          >
            Adresse <FontAwesomeIcon icon={getSortIcon("adresse")} />
          </th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {sortedClients?.map((c, i) => (
          <tr key={i} className="text-center">
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
              {c.can_delete !== "0" && (
                <Button
                  id={"btn-client-delete-" + c.id}
                  onClick={async () => {
                    if (
                      await confirm(
                        <>
                          Voulez vous vraiment supprimer le client{" "}
                          <span className="text-primary">
                            {c.nom + " " + c.prenom}
                          </span>{" "}
                          ?
                        </>,
                      )
                    ) {
                      const res = await deleteClient({ id: c.id });
                      res?.data?.success
                        ? reload()
                        : toast.error(
                            res?.data?.message || "Une erreur est survenue.",
                          );
                    }
                  }}
                  color="danger"
                  className="me-2 p-0 pe-1 ps-1"
                >
                  <FontAwesomeIcon icon={faTrash} />
                </Button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default Clients;
