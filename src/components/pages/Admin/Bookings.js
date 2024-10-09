import {
  Badge,
  Button,
  Col,
  Container,
  FormGroup,
  Input,
  Label,
  Row,
  Table,
  UncontrolledTooltip,
} from "reactstrap";
import useApi from "../../../hooks/useApi";
import { cancel, getBookings, waiting } from "../../../api/booking";
import React, { useMemo, useState } from "react";
import useToggle from "../../../hooks/useToggle";
import {
  faCheck,
  faPause,
  faPlus,
  faSpinner,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { dateFormat } from "../../../helpers/dates";
import BookingModal from "./Modals/BookingModal";
import ValidateModal from "./Modals/ValidateModal";
import useConfirmDialog from "../../../hooks/useConfirmDialog";

const Bookings = () => {
  const [reloading, reload] = useToggle(false);
  const [byStatus, switchStatus] = useToggle(true);
  const [isOpenAdd, toggleAdd] = useToggle();
  const [bookingToValidate, setBookingToValidate] = useState(null);
  const [{ bookings }] = useApi(getBookings, null, null, [reloading]);

  const waitingBookings = useMemo(
    () => bookings?.filter((b) => b.statut === "en attente"),
    [bookings],
  );

  const validatedBookings = useMemo(
    () => bookings?.filter((b) => b.statut === "validée"),
    [bookings],
  );

  const canceledBookings = useMemo(
    () => bookings?.filter((b) => b.statut === "annulée"),
    [bookings],
  );

  const ActionBtn = ({ booking, status, libelle, icon, color }) => {
    const [loading, toggleLoading] = useToggle();

    const confirm = useConfirmDialog();

    const updateBooking = async (booking, status) => {
      toggleLoading();
      if (status === "validée") {
        setBookingToValidate(booking);
      } else if (status === "annulée") {
        if (
          await confirm(
            "Voulez vous vraiment annuler la réservation de '" +
              booking.nom_client +
              "' ?",
          )
        ) {
          await cancel({ id: booking.id });
        }
      } else {
        if (
          await confirm(
            <>
              Voulez vous vraiment mettre en attente la réservation de{" "}
              <span className="text-primary">{booking.nom_client}</span> ?
            </>,
          )
        ) {
          await waiting({ id: booking.id });
        }
      }
      await toggleLoading();
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

  const AdminBooking = ({ bookings, totalWithoutCanceled }) => {
    const total = useMemo(() => {
      const filtered = totalWithoutCanceled
        ? bookings?.filter((b) => b.statut !== "annulée")
        : bookings;
      return filtered?.reduce((acc, current) => {
        return acc + parseFloat(current.prix_total);
      }, 0);
    }, [bookings, totalWithoutCanceled]);

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
        responsive
        style={{
          boxShadow: "0 6px 10px -4px rgba(0, 0, 0, .15)",
        }}
      >
        <thead>
          <tr className="text-center">
            <th>Id</th>
            <th>Nom</th>
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
              <td>{b.nom_client}</td>
              <td>{dateFormat(b.date_arrivee)}</td>
              <td>{dateFormat(b.date_depart)}</td>
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
                  />
                ) : null}
                {b.statut !== "validée" ? (
                  <ActionBtn
                    booking={b}
                    status={"validée"}
                    libelle={"Valider"}
                    icon={faCheck}
                    color="success"
                  />
                ) : null}
                {b.statut !== "annulée" ? (
                  <ActionBtn
                    booking={b}
                    status={"annulée"}
                    libelle={"Annuler"}
                    icon={faTrash}
                    color="danger"
                  />
                ) : null}
              </td>
            </tr>
          ))}
          <tr>
            <td
              colSpan={8}
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

  return (
    <>
      <BookingModal
        isOpen={isOpenAdd}
        toggle={toggleAdd}
        callback={() => {
          toggleAdd();
          reload();
        }}
      />
      <ValidateModal
        isOpen={!!bookingToValidate}
        toggle={() => setBookingToValidate(null)}
        booking={bookingToValidate}
        reload={reload}
      />
      <Row className="admin-title g-0">
        <Col>
          <h1 className="aurore">Réservations</h1>
        </Col>
        <Col className="pt-2" xs={5} sm={3} md={3} lg={4}>
          <Row>
            <Col>
              <Button onClick={toggleAdd} color="secondary">
                <FontAwesomeIcon icon={faPlus} />
                <span className="d-none d-lg-inline-block ms-2">Ajouter</span>
              </Button>
            </Col>
            <Col className="pt-1">
              <FormGroup switch>
                <Label className="ms-3 pt-1 d-none d-lg-inline-block" check>
                  {!byStatus ? "Toutes" : "Statut"}
                </Label>
                <Input
                  type="switch"
                  onChange={() => {}}
                  checked={byStatus}
                  onClick={switchStatus}
                  style={{ height: "23px", width: "50px", cursor: "pointer" }}
                />
              </FormGroup>
            </Col>
          </Row>
        </Col>
      </Row>
      <Container fluid className="bookings admin-content">
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
              <AdminBooking
                bookings={bookings}
                reload={reload}
                totalWithoutCanceled
              />
            </Col>
          </Row>
        )}
      </Container>
    </>
  );
};

export default Bookings;
