import { Badge, Button, Col, Container, Row, Table } from "reactstrap";
import useApi from "../../../hooks/useApi";
import React, { useMemo } from "react";
import { deletePayment, getPayments } from "../../../api/payment";
import { dateFormat } from "../../../helpers/dates";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import PaymentModal from "./Modals/PaymentModal";
import useDialog from "../../../hooks/useDialog";
import useToggle from "../../../hooks/useToggle";
import useConfirmDialog from "../../../hooks/useConfirmDialog";
import useSorting from "../../../hooks/useSorting";

const Payments = () => {
  const [reloading, reload] = useToggle(false);

  const dialog = useDialog();

  const [{ payments }] = useApi(getPayments, null, null, [reloading]);

  return (
    <>
      <Row className="admin-title g-0">
        <Col>
          <h1 className="aurore">Paiements</h1>
        </Col>
        <Col xs={1} className="me-2 pt-1">
          <Button
            onClick={async () => {
              const result = await dialog(<PaymentModal />);
              if (result.action === "success") reload();
            }}
            color="secondary"
          >
            <FontAwesomeIcon icon={faPlus} />
            <span className="d-none d-lg-inline-block ms-2">Ajouter</span>
          </Button>
        </Col>
      </Row>
      <Container fluid className="clients admin-content">
        <Row className="my-5">
          <Col>
            <AdminPayments payments={payments} reload={reload} />
          </Col>
        </Row>
      </Container>
    </>
  );
};

const AdminPayments = ({ payments, reload }) => {
  const dialog = useDialog();
  const confirm = useConfirmDialog();

  const total = useMemo(
    () =>
      payments?.reduce((acc, current) => {
        return acc + parseFloat(current.montant_paiement);
      }, 0),
    [payments],
  );

  const {
    sortedData: sortedPayments,
    requestSort,
    getSortIcon,
  } = useSorting(payments);

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
            onClick={() => requestSort("date_paiement")}
            style={{ cursor: "pointer" }}
          >
            Date <FontAwesomeIcon icon={getSortIcon("date_paiement")} />
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
            onClick={() => requestSort("moyen_paiement")}
            style={{ cursor: "pointer" }}
          >
            Moyen de paiement{" "}
            <FontAwesomeIcon icon={getSortIcon("moyen_paiement")} />
          </th>
          <th
            onClick={() => requestSort("montant_paiement")}
            style={{ cursor: "pointer" }}
          >
            Montant <FontAwesomeIcon icon={getSortIcon("montant_paiement")} />
          </th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {sortedPayments?.map((p, i) => (
          <tr key={i} className="text-center">
            <td>{dateFormat(p.date_paiement)}</td>
            <td>{p.nom}</td>
            <td>{p.prenom}</td>
            <td>
              <Badge color="primary">{p.moyen_paiement}</Badge>
            </td>
            <td>{p.montant_paiement} €</td>
            <td>
              <Button
                id={"btn-payment-edit-" + p.id}
                onClick={async () => {
                  const result = await dialog(<PaymentModal payment={p} />);
                  if (result.action === "success") reload();
                }}
                color="primary"
                className="me-2 p-0 pe-1 ps-1"
              >
                <FontAwesomeIcon icon={faEdit} />
              </Button>
              <Button
                id={"btn-payment-delete-" + p.id}
                onClick={async () => {
                  if (
                    await confirm(
                      <>
                        Voulez vous vraiment annuler le paiement de{" "}
                        <span className="text-primary">
                          {p.nom + " " + p.prenom}
                        </span>{" "}
                        de{" "}
                        <span className="text-primary">
                          {p.montant_paiement}€
                        </span>{" "}
                        ?
                      </>,
                    )
                  ) {
                    await deletePayment({ id: p.id });
                    reload();
                  }
                }}
                color="danger"
                className="me-2 p-0 pe-1 ps-1"
              >
                <FontAwesomeIcon icon={faTrash} />
              </Button>
            </td>
          </tr>
        ))}
        <tr>
          <td
            colSpan={4}
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
            <strong>{total} €</strong>
          </td>
          <td style={{ backgroundColor: "white", borderLeft: "none" }}></td>
        </tr>
      </tbody>
    </Table>
  );
};

export default Payments;
