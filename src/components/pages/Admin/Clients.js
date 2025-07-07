import { Button, Col, Container, Row, Table } from "reactstrap";
import useApi from "../../../hooks/useApi";
import { deleteClient, getClients } from "../../../api/client";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faMessage, faTrash } from "@fortawesome/free-solid-svg-icons";
import ClientModal from "./Modals/ClientModal";
import useDialog from "../../../hooks/useDialog";
import useToggle from "../../../hooks/useToggle";
import useConfirmDialog from "../../../hooks/useConfirmDialog";
import toast from "react-hot-toast";
import useSorting from "../../../hooks/useSorting";
import TypeBadge from "./TypeBadge";
import useModalDialog from "../../../hooks/useModalDialog";
import { DEFAULT_MAX_LENGTH } from "../../../helpers/env";

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
  const [maxLength, setMaxLength] = useState(DEFAULT_MAX_LENGTH);

  const dialog = useDialog();
  const confirm = useConfirmDialog();
  const modal = useModalDialog();

  const {
    sortedData: sortedClients,
    requestSort,
    getSortIcon,
  } = useSorting(clients);

  const updateClient = async (client) => {
    const result = await dialog(<ClientModal client={client} />);
    if (result.action === "success") reload();
  };

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
          <th
            onClick={() => requestSort("types_reservations")}
            style={{ cursor: "pointer" }}
          >
            Type <FontAwesomeIcon icon={getSortIcon("types_reservations")} />
          </th>
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
        {maxLength < sortedClients?.length ||
        sortedClients?.slice(0, maxLength)?.length > DEFAULT_MAX_LENGTH ? (
          <tr>
            <th colSpan="9" className="see-more">
              <div className="list-line action-see-more">
                <div className="line-action" />
                {maxLength < sortedClients?.length && (
                  <Button
                    type="button"
                    color="quaternary"
                    size="xs"
                    outline
                    onClick={() => setMaxLength(maxLength + DEFAULT_MAX_LENGTH)}
                  >
                    Voir l'historique
                  </Button>
                )}

                {sortedClients?.slice(0, maxLength)?.length >
                  DEFAULT_MAX_LENGTH && (
                  <Button
                    type="button"
                    color="quaternary"
                    size="xs"
                    outline
                    onClick={() => setMaxLength(DEFAULT_MAX_LENGTH)}
                  >
                    Réduire
                  </Button>
                )}
                <div className="line-action" />
              </div>
            </th>
          </tr>
        ) : null}
        {sortedClients?.slice(0, maxLength)?.map((c, i) => (
          <tr
            key={i}
            className="text-center"
            onDoubleClick={() => updateClient(c)}
            style={{ cursor: "pointer" }}
          >
            <td>
              {c.types_reservations?.split(",")?.map((type, j) => (
                <TypeBadge type={type} key={j} />
              ))}
            </td>
            <td>{c.nom}</td>
            <td>{c.prenom}</td>
            <td>{c.email}</td>
            <td>{c.telephone}</td>
            <td>{c.adresse}</td>
            <td>
              <Button
                id={"btn-client-" + c.id}
                onClick={() => updateClient(c)}
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
              {!!c.note && (
                <Button
                  id={"btn-client-note-" + c.id}
                  onClick={async () => {
                    await modal(
                      c.note,
                      <>
                        Note :{" "}
                        <span className="text-primary">
                          {c.nom + " " + c.prenom}
                        </span>
                      </>,
                    );
                  }}
                  color="info"
                  className="me-2 p-0 pe-1 ps-1"
                >
                  <FontAwesomeIcon icon={faMessage} />
                </Button>
              )}
            </td>
          </tr>
        ))}
        <tr>
          <td
            colSpan={6}
            style={{ backgroundColor: "white", borderRight: "none" }}
          >
            <strong>Total : {clients?.length} clients</strong>
          </td>
          <td style={{ backgroundColor: "white", borderLeft: "none" }}></td>
        </tr>
      </tbody>
    </Table>
  );
};

export default Clients;
