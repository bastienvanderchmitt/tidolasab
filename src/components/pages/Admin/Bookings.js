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
import { cancel, getBookings, validate, waiting } from "../../../api/booking";
import React, { useMemo } from "react";
import useToggle from "../../../hooks/useToggle";
import {
  faCheck,
  faPause,
  faSpinner,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Bookings = () => {
  const [reloading, reload] = useToggle(false);
  const [byStatus, switchStatus] = useToggle(false);
  const [{ bookings }] = useApi(getBookings, null, null, [reloading]);

  const waitingBookings = useMemo(
    () => bookings?.filter((b) => b.statut === "en attente"),
    [bookings],
  );

  const validatedBookings = useMemo(
    () => bookings?.filter((b) => b.statut === "validée"),
    [bookings],
  );

  // const runningBookings = useMemo(
  //   () => bookings?.filter((b) => b.statut === "en cours"),
  //   [bookings],
  // );
  //
  // const pastBookings = useMemo(
  //   () => bookings?.filter((b) => b.statut === "passée"),
  //   [bookings],
  // );

  const canceledBookings = useMemo(
    () => bookings?.filter((b) => b.statut === "annulée"),
    [bookings],
  );

  return (
    <Container fluid className="bookings">
      <Row>
        <Col>
          <h1 className="aurore">Réservations</h1>
        </Col>
        <Col xs={1}>
          <Button onClick={switchStatus}>
            {!byStatus ? "Toutes" : "Par statut"}
          </Button>
        </Col>
      </Row>
      {byStatus ? (
        <>
          <Row className="my-5">
            <Col>
              <h4>En attente</h4>
              <AdminBooking bookings={waitingBookings} reload={reload} />
            </Col>
          </Row>
          <Row className="my-5">
            <Col>
              <h4>Validées</h4>
              <AdminBooking bookings={validatedBookings} reload={reload} />
            </Col>
          </Row>
          <Row className="my-5">
            <Col>
              <h4>Annulés</h4>
              <AdminBooking bookings={canceledBookings} reload={reload} />
            </Col>
          </Row>
        </>
      ) : (
        <Row className="my-5">
          <Col>
            <AdminBooking bookings={bookings} reload={reload} />
          </Col>
        </Row>
      )}
    </Container>
  );
};

const ActionBtn = ({ booking, status, libelle, icon, color, reload }) => {
  const [loading, toggleLoading] = useToggle();

  const updateBooking = async (booking, status) => {
    toggleLoading();
    if (status === "validée") {
      await validate({ id: booking.id });
    } else if (status === "annulée") {
      await cancel({ id: booking.id });
    } else {
      await waiting({ id: booking.id });
    }
    toggleLoading();
    reload();
  };

  return (
    <>
      <Button
        id={"btn-" + color + "-" + booking.id}
        onClick={() => updateBooking(booking, status)}
        color={color}
        className="me-2 p-0 pe-1 ps-1"
        disabled={!!loading}
      >
        <FontAwesomeIcon
          icon={loading ? faSpinner : icon}
          spinPulse={!!loading}
        />
      </Button>
      <UncontrolledTooltip
        placement="top"
        target={"btn-" + color + "-" + booking.id}
      >
        {libelle}
      </UncontrolledTooltip>
    </>
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

  return (
    <Table
      striped
      hover
      bordered
      className="rounded"
      style={{
        boxShadow: "0 6px 10px -4px rgba(0, 0, 0, .15)",
      }}
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
            <th scope="row">{b.id}</th>
            <td>{b.date_arrivee}</td>
            <td>{b.date_depart}</td>
            <td>
              <StatusBadge status={b.statut} />
            </td>
            <td>{b.adultes}</td>
            <td>{b.enfants}</td>
            <td>{b.nombre_nuits}</td>
            <td>{b.prix_total} €</td>
            <td>
              {b.statut !== "en attente" ? (
                <ActionBtn
                  booking={b}
                  status={"en attente"}
                  libelle={"Passer en attente"}
                  icon={faPause}
                  color="warning"
                  reload={reload}
                />
              ) : null}
              {b.statut !== "validée" ? (
                <ActionBtn
                  booking={b}
                  status={"validée"}
                  libelle={"Valider"}
                  icon={faCheck}
                  color="success"
                  reload={reload}
                />
              ) : null}
              {b.statut !== "annulée" ? (
                <ActionBtn
                  booking={b}
                  status={"annulée"}
                  libelle={"Annuler"}
                  icon={faTrash}
                  color="danger"
                  reload={reload}
                />
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
