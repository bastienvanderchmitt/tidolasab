import {
  Badge,
  Button,
  Col,
  Container,
  Row,
  Table,
  UncontrolledTooltip,
} from "reactstrap";
import useApi from "../../../hooks/useApi";
import { getBookings } from "../../../api/booking";
import React, { useMemo } from "react";
import useToggle from "../../../hooks/useToggle";
import { faCheck, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Bookings = () => {
  const [reloading, reload] = useToggle(false);
  const [byStatus, switchStatus] = useToggle(false);
  const [{ bookings }] = useApi(getBookings, null, null, [reloading]);

  const waitingBookings = useMemo(
    () => bookings?.filter((b) => b.etat_reservation === "en attente"),
    [bookings],
  );

  const validatedBookings = useMemo(
    () => bookings?.filter((b) => b.etat_reservation === "validée"),
    [bookings],
  );

  const runningBookings = useMemo(
    () => bookings?.filter((b) => b.etat_reservation === "en cours"),
    [bookings],
  );

  const pastBookings = useMemo(
    () => bookings?.filter((b) => b.etat_reservation === "passée"),
    [bookings],
  );

  const canceledBookings = useMemo(
    () => bookings?.filter((b) => b.etat_reservation === "annulée"),
    [bookings],
  );

  return (
    <Container fluid className="bookings">
      <Row>
        <Col>
          <h1>Réservations</h1>
        </Col>
        <Col xs={1}>
          <Button onClick={switchStatus}>
            {!byStatus ? "Toutes" : "Par statut"}
          </Button>
        </Col>
      </Row>
      {byStatus ? (
        <>
          <Row>
            <Col>
              <h4>En attente</h4>
              <AdminBooking bookings={waitingBookings} reload={reload} />
            </Col>
          </Row>
          <Row>
            <Col>
              <h4>Validés</h4>
              <AdminBooking bookings={runningBookings} reload={reload} />
            </Col>
          </Row>
          <Row>
            <Col>
              <h4>En cours</h4>
              <AdminBooking bookings={validatedBookings} reload={reload} />
            </Col>
          </Row>
          <Row>
            <Col>
              <h4>Passés</h4>
              <AdminBooking bookings={pastBookings} reload={reload} />
            </Col>
          </Row>
          <Row>
            <Col>
              <h4>Annulés</h4>
              <AdminBooking bookings={canceledBookings} reload={reload} />
            </Col>
          </Row>
        </>
      ) : (
        <Row>
          <Col>
            <AdminBooking bookings={bookings} reload={reload} />
          </Col>
        </Row>
      )}
    </Container>
  );
};

const AdminBooking = ({ bookings, reload }) => {
  const total = useMemo(
    () =>
      bookings?.reduce((acc, current) => {
        return acc + parseFloat(current.prix_total);
      }, 0),
    [bookings],
  );

  const StatusBadge = ({ status }) => {
    const color = useMemo(
      () =>
        status === "en attente"
          ? "warning"
          : status === "validée"
            ? "success"
            : status === "en cours"
              ? "primary"
              : status === "passée"
                ? "secondary"
                : "danger",
      [status],
    );
    return <Badge color={color}>{status.toUpperCase()}</Badge>;
  };

  const updateBooking = async (booking, status) => {
    console.log(status, booking);
    reload();
  };

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
          <th>Arrivée</th>
          <th>Départ</th>
          <th>Statut</th>
          <th>Adultes</th>
          <th>Enfants</th>
          <th>Nuits</th>
          <th>Prix</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {bookings?.map((b, i) => (
          <tr key={i} className="text-center">
            <th scope="row">{b.id_reservation}</th>
            <td>{b.date_arrivee}</td>
            <td>{b.date_depart}</td>
            <td>
              <StatusBadge status={b.etat_reservation} />
            </td>
            <td>{b.adultes}</td>
            <td>{b.enfants}</td>
            <td>{b.nombre_nuits}</td>
            <td>{b.prix_total} €</td>
            <td>
              {b.etat_reservation === "en attente" ? (
                <>
                  <Button
                    id={"validate-btn-" + b.id_reservation}
                    onClick={() => updateBooking(b, "validée")}
                    color="success"
                    className="me-2 p-0 pe-1 ps-1"
                  >
                    <FontAwesomeIcon icon={faCheck} />
                  </Button>
                  <UncontrolledTooltip
                    placement="top"
                    target={"validate-btn-" + b.id_reservation}
                  >
                    Valider
                  </UncontrolledTooltip>
                </>
              ) : null}
              {b.etat_reservation !== "annulée" ? (
                <>
                  <Button
                    id={"cancel-btn-" + b.id_reservation}
                    onClick={() => updateBooking(b, "annulée")}
                    color="danger"
                    className="me-2 p-0 pe-1 ps-1"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </Button>
                  <UncontrolledTooltip
                    placement="top"
                    target={"cancel-btn-" + b.id_reservation}
                  >
                    Annuler
                  </UncontrolledTooltip>
                </>
              ) : null}
            </td>
          </tr>
        ))}
        <tr>
          <td
            colSpan={7}
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

export default Bookings;
