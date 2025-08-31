import { Badge, Button, Col, Row, Table } from "reactstrap";
import useApi from "../../../hooks/useApi";
import React, { useMemo, useState } from "react";
import { deletePayment, getPayments } from "../../../api/payment";
import { dateFormat } from "../../../helpers/dates";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faMessage,
  faPlus,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import PaymentModal from "./Modals/PaymentModal";
import useDialog from "../../../hooks/useDialog";
import useToggle from "../../../hooks/useToggle";
import useConfirmDialog from "../../../hooks/useConfirmDialog";
import useSorting from "../../../hooks/useSorting";
import TypeBadge from "./TypeBadge";
import useModalDialog from "../../../hooks/useModalDialog";
import { DEFAULT_MAX_LENGTH } from "../../../helpers/env";
import BreadCrumb from "../../common/BreadCrumb";

const Payments = () => {
  const [reloading, reload] = useToggle(false);

  const dialog = useDialog();

  const [{ payments }] = useApi(getPayments, null, null, [reloading]);

  return (
    <>
      <BreadCrumb
        button={
          <Button
            onClick={async () => {
              const result = await dialog(<PaymentModal />);
              if (result.action === "success") reload();
            }}
            className="gold-btn"
          >
            <FontAwesomeIcon icon={faPlus} />
            <span className="d-none d-lg-inline-block ms-2">Ajouter</span>
          </Button>
        }
      />
      <Row className="my-3">
        <Col>
          <AdminPayments payments={payments} reload={reload} />
        </Col>
      </Row>
    </>
  );
};

const AdminPayments = ({ payments, reload }) => {
  const [maxLength, setMaxLength] = useState(10);

  const dialog = useDialog();
  const confirm = useConfirmDialog();
  const modal = useModalDialog();

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

  const TypePaymentBadge = ({ type }) => {
    const color = useMemo(
      () =>
        type === "virement"
          ? "success"
          : type === "chèque"
            ? "secondary"
            : "primary",
      [type],
    );
    return <Badge color={color}>{type.toUpperCase()}</Badge>;
  };

  const updatePayment = async (payment) => {
    const result = await dialog(<PaymentModal payment={payment} />);
    if (result.action === "success") reload();
  };

  return (
    <Table
      striped
      hover
      borderless
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
          <th
            onClick={() => requestSort("date_paiement")}
            style={{ cursor: "pointer" }}
          >
            Date paiement
            <FontAwesomeIcon icon={getSortIcon("date_paiement")} />
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
            onClick={() => requestSort("date_arrivee")}
            style={{ cursor: "pointer" }}
          >
            Arrivée <FontAwesomeIcon icon={getSortIcon("date_arrivee")} />
          </th>
          <th
            onClick={() => requestSort("date_depart")}
            style={{ cursor: "pointer" }}
          >
            Départ <FontAwesomeIcon icon={getSortIcon("date_depart")} />
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
        {maxLength < sortedPayments?.length ||
        sortedPayments?.slice(0, maxLength)?.length > DEFAULT_MAX_LENGTH ? (
          <tr>
            <th colSpan="9" className="see-more">
              <div className="list-line action-see-more">
                <div className="line-action" />
                {maxLength < sortedPayments?.length && (
                  <Button
                    className="btn-gold"
                    type="button"
                    color="quaternary"
                    size="xs"
                    outline
                    onClick={() => setMaxLength(maxLength + DEFAULT_MAX_LENGTH)}
                  >
                    Voir l'historique
                  </Button>
                )}

                {sortedPayments?.slice(0, maxLength)?.length >
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
        {sortedPayments?.slice(0, maxLength)?.map((p, i) => (
          <tr
            key={i}
            className="text-center"
            onDoubleClick={() => updatePayment(p)}
            style={{ cursor: "pointer" }}
          >
            <td>
              {p.types_reservations?.split(",")?.map((type, j) => (
                <TypeBadge type={type} key={j} />
              ))}
            </td>
            <td>{dateFormat(p.date_paiement)}</td>
            <td>{p.nom}</td>
            <td>{p.prenom}</td>
            <td>
              <TypePaymentBadge type={p.moyen_paiement} />
            </td>
            <td>{dateFormat(p.date_arrivee)}</td>
            <td>{dateFormat(p.date_depart)}</td>
            <td>{p.montant_paiement} €</td>
            <td>
              <Button
                id={"btn-payment-edit-" + p.id}
                onClick={() => updatePayment(p)}
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
              {!!p.note && (
                <Button
                  id={"btn-payment-note-" + p.id}
                  onClick={async () => {
                    await modal(
                      p.note,
                      <>
                        Note :{" "}
                        <span className="text-primary">
                          {p.nom + " " + p.prenom}
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
            colSpan={7}
            style={{ backgroundColor: "white", borderRight: "none" }}
          >
            <strong>Total : {payments?.length} paiements</strong>
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
