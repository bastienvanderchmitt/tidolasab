import {
  Badge,
  Button,
  Card,
  Col,
  Nav,
  NavItem,
  NavLink,
  Row,
  Table,
  UncontrolledTooltip,
} from "reactstrap";
import useApi from "../../../hooks/useApi";
import { cancel, getBookings, remove, waiting } from "../../../api/booking";
import React, { useMemo, useState } from "react";
import useToggle from "../../../hooks/useToggle";
import {
  faBan,
  faCheck,
  faCircleCheck,
  faCirclePlay,
  faMessage,
  faPause,
  faPauseCircle,
  faPlus,
  faSpinner,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { dateFormat } from "../../../helpers/dates";
import BookingModal from "./Modals/BookingModal";
import ValidateModal from "./Modals/ValidateModal";
import useConfirmDialog from "../../../hooks/useConfirmDialog";
import useSorting from "../../../hooks/useSorting";
import useDialog from "../../../hooks/useDialog";
import EditBookingModal from "./Modals/EditBookingModal";
import TypeBadge from "./TypeBadge";
import useModalDialog from "../../../hooks/useModalDialog";
import { DEFAULT_MAX_LENGTH } from "../../../helpers/env";
import BreadCrumb from "../../common/BreadCrumb";
import moment from "moment-timezone";
import { bookingTypes } from "../../../helpers/bookingTypes";

const Bookings = () => {
  const [isOpenAdd, toggleAdd] = useToggle();
  const [bookingToValidate, setBookingToValidate] = useState(null);
  const [filterType, setFilterType] = useState(null);
  const [{ bookings }, _, reload] = useApi(getBookings, null, null); // eslint-disable-line no-unused-vars

  const filteredBookings = useMemo(
    () =>
      !!filterType ? bookings?.filter((b) => b.type === filterType) : bookings,
    [bookings, filterType],
  );

  const waitingBookings = useMemo(
    () =>
      filteredBookings
        ?.filter((b) => b.statut === "en attente")
        .sort((a, b) => moment(a.date_arrivee).diff(moment(b.date_arrivee))),
    [filteredBookings],
  );

  const nextBookings = useMemo(
    () =>
      filteredBookings
        ?.filter(
          (b) =>
            b.statut === "validée" &&
            moment(b.date_depart).isSameOrAfter(moment()),
        )
        .sort((a, b) => moment(a.date_arrivee).diff(moment(b.date_arrivee))),
    [filteredBookings],
  );

  const validatedBookings = useMemo(
    () =>
      filteredBookings?.filter(
        (b) =>
          b.statut === "validée" && moment(b.date_depart).isBefore(moment()),
      ),
    [filteredBookings],
  );

  const canceledBookings = useMemo(
    () => filteredBookings?.filter((b) => b.statut === "annulée"),
    [filteredBookings],
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
            <>
              Voulez vous vraiment annuler la réservation de{" "}
              <span className="text-primary">{booking.nom_client}</span> ?
            </>,
          )
        ) {
          await cancel({ id: booking.id });
        }
      } else if (status === "delete") {
        if (
          await confirm(
            <>
              Voulez vous vraiment supprimer la réservation de{" "}
              <span className="text-primary">{booking.nom_client}</span> ?
            </>,
          )
        ) {
          await remove({ id: booking.id });
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

  const AdminBooking = ({ bookings, totalWithoutCanceled, withHistoric }) => {
    const [maxLength, setMaxLength] = useState(DEFAULT_MAX_LENGTH);

    const dialog = useDialog();
    const modal = useModalDialog();

    const {
      sortedData: bookingsToDisplay,
      requestSort,
      getSortIcon,
    } = useSorting(bookings);

    const filtered = useMemo(
      () =>
        totalWithoutCanceled
          ? bookings?.filter(
              (b) => b.type !== "Fermeture" && b.statut !== "annulée",
            )
          : bookings?.filter((b) => b.type !== "Fermeture"),
      [bookings, totalWithoutCanceled],
    );

    const total = useMemo(() => {
      return filtered?.reduce((acc, current) => {
        return acc + parseFloat(current.prix_total);
      }, 0);
    }, [filtered]);

    const totalNights = useMemo(() => {
      return filtered?.reduce((acc, current) => {
        return acc + parseInt(current.nombre_nuits);
      }, 0);
    }, [filtered]);

    const totalAdults = useMemo(() => {
      return filtered?.reduce((acc, current) => {
        return acc + parseInt(current.adultes);
      }, 0);
    }, [filtered]);

    const showBookings = useMemo(() => {
      return withHistoric
        ? bookingsToDisplay?.slice(0, maxLength)
        : bookingsToDisplay;
    }, [withHistoric, bookingsToDisplay, maxLength]);

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
        borderless
        className="rounded"
        responsive
        style={{
          boxShadow: "0 6px 10px -4px rgba(0, 0, 0, .15)",
        }}
      >
        <thead>
          <tr className="text-center">
            <th
              onClick={() => requestSort("nom_client")}
              style={{ cursor: "pointer" }}
            >
              Nom <FontAwesomeIcon icon={getSortIcon("nom_client")} />
            </th>
            <th
              onClick={() => requestSort("type")}
              style={{ cursor: "pointer" }}
            >
              Type <FontAwesomeIcon icon={getSortIcon("type")} />
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
            <th>Statut</th>
            <th
              onClick={() => requestSort("adultes")}
              style={{ cursor: "pointer" }}
            >
              Adultes <FontAwesomeIcon icon={getSortIcon("adultes")} />
            </th>
            <th
              onClick={() => requestSort("nombre_nuits")}
              style={{ cursor: "pointer" }}
            >
              Nuits <FontAwesomeIcon icon={getSortIcon("nombre_nuits")} />
            </th>
            <th
              onClick={() => requestSort("prix_total")}
              style={{ cursor: "pointer" }}
            >
              Prix <FontAwesomeIcon icon={getSortIcon("prix_total")} />
            </th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {withHistoric &&
          (maxLength < bookingsToDisplay?.length ||
            bookingsToDisplay?.slice(0, maxLength)?.length >
              DEFAULT_MAX_LENGTH) ? (
            <tr>
              <th colSpan="9" className="see-more">
                <div className="list-line action-see-more">
                  <div className="line-action" />
                  {maxLength < bookingsToDisplay?.length && (
                    <Button
                      className="btn-gold"
                      type="button"
                      color="quaternary"
                      size="xs"
                      outline
                      onClick={() =>
                        setMaxLength(maxLength + DEFAULT_MAX_LENGTH)
                      }
                    >
                      Voir l'historique
                    </Button>
                  )}

                  {bookingsToDisplay?.slice(0, maxLength)?.length >
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
          {showBookings?.map((b, i) => (
            <tr
              key={i}
              className="text-center"
              style={{ cursor: "pointer" }}
              onDoubleClick={async () => {
                const result = await dialog(<EditBookingModal booking={b} />);
                if (result.action === "success") reload();
              }}
            >
              <td>{b.nom_client}</td>
              <td>
                <TypeBadge type={b.type} />
              </td>
              <td>{dateFormat(b.date_arrivee)}</td>
              <td>{dateFormat(b.date_depart)}</td>
              <td>
                <StatusBadge status={b.statut} />
              </td>
              <td>{b.adultes}</td>
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
                    icon={faBan}
                    color="danger"
                  />
                ) : b.statut === "annulée" ? (
                  <ActionBtn
                    booking={b}
                    status={"delete"}
                    libelle={"Supprimer"}
                    icon={faTrash}
                    color="danger"
                  />
                ) : null}
                {!!b.note && (
                  <Button
                    id={"btn-payment-note-" + b.id}
                    onClick={async () => {
                      await modal(
                        b.note,
                        <>
                          Note :{" "}
                          <span className="text-primary">{b.nom_client}</span>
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
              colSpan={5}
              style={{ backgroundColor: "white", borderRight: "none" }}
            >
              <strong>
                Total :{" "}
                {bookings?.filter((b) => b.type !== "Fermeture")?.length}{" "}
                réservations
              </strong>
            </td>
            <td
              style={{
                backgroundColor: "white",
                borderLeft: "none",
                borderRight: "none",
              }}
              className="text-center"
            >
              <strong>{totalAdults}</strong>
            </td>
            <td
              style={{
                backgroundColor: "white",
                borderLeft: "none",
                borderRight: "none",
              }}
              className="text-center"
            >
              <strong>{totalNights}</strong>
            </td>
            <td
              style={{
                backgroundColor: "white",
                borderLeft: "none",
                borderRight: "none",
              }}
              className="text-center"
            >
              <strong>{total?.toFixed(2)} €</strong>
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
      <BreadCrumb
        button={
          <>
            <Button onClick={toggleAdd} className="gold-btn">
              <FontAwesomeIcon icon={faPlus} />
              <span className="d-none d-lg-inline-block ms-2">Ajouter</span>
            </Button>
            {/*<FormGroup switch>*/}
            {/*  <Label className="ms-3 pt-1 d-none d-lg-inline-block" check>*/}
            {/*    {!byStatus ? "Toutes" : "Statut"}*/}
            {/*  </Label>*/}
            {/*  <Input*/}
            {/*    type="switch"*/}
            {/*    onChange={() => {}}*/}
            {/*    checked={byStatus}*/}
            {/*    onClick={switchStatus}*/}
            {/*    style={{ height: "23px", width: "50px", cursor: "pointer" }}*/}
            {/*  />*/}
            {/*</FormGroup>*/}
          </>
        }
      />
      <Card className="p-2 m-2">
        <Row className="my-3">
          <Nav fill tabs style={{ cursor: "pointer" }} className="mx-2">
            <NavItem>
              <NavLink active={!filterType} onClick={() => setFilterType(null)}>
                Toutes
              </NavLink>
            </NavItem>
            {bookingTypes.map((type, i) => (
              <NavItem key={i}>
                <NavLink
                  active={type === filterType}
                  onClick={() => setFilterType(type)}
                >
                  {type}
                </NavLink>
              </NavItem>
            ))}
          </Nav>
        </Row>
        {waitingBookings?.length ? (
          <Row className="my-3 mx-2">
            <Col>
              <h4 className="text-warning">
                <FontAwesomeIcon icon={faPauseCircle} className="me-2" />
                En attente
              </h4>
              <AdminBooking
                bookings={waitingBookings}
                reload={reload}
                totalWithoutCanceled
              />
            </Col>
          </Row>
        ) : null}
        {nextBookings?.length ? (
          <Row className="my-3 mx-2">
            <Col>
              <h4 className="text-info">
                <FontAwesomeIcon icon={faCirclePlay} className="me-2" />A venir
                / en cours
              </h4>
              <AdminBooking
                bookings={nextBookings}
                reload={reload}
                totalWithoutCanceled
              />
            </Col>
          </Row>
        ) : null}
        {validatedBookings?.length ? (
          <Row className="my-3 mx-2">
            <Col>
              <h4 className="text-success">
                <FontAwesomeIcon icon={faCircleCheck} className="me-2" />
                Validées
              </h4>
              <AdminBooking
                bookings={validatedBookings}
                reload={reload}
                totalWithoutCanceled
                withHistoric
              />
            </Col>
          </Row>
        ) : null}
        {canceledBookings?.length ? (
          <Row className="my-3 mx-2">
            <Col>
              <h4 className="text-danger">
                <FontAwesomeIcon icon={faBan} className="me-2" />
                Annulés
              </h4>
              <AdminBooking
                bookings={canceledBookings}
                reload={reload}
                withHistoric
              />
            </Col>
          </Row>
        ) : null}
      </Card>
    </>
  );
};

export default Bookings;
