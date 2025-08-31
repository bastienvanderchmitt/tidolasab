import { Navigate, useParams } from "react-router-dom";
import { Badge, Button, Card, CardBody, Col, Row } from "reactstrap";
import React, { useEffect, useMemo } from "react";
import useApi from "../../../hooks/useApi";
import { getClient } from "../../../api/client";
import toast, { LoaderIcon } from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBan,
  faCalendar,
  faCircleCheck,
  faEdit,
  faEnvelope,
  faEuro,
  faEuroSign,
  faFileInvoice,
  faFileInvoiceDollar,
  faFlag,
  faHashtag,
  faHouse,
  faMoon,
  faPauseCircle,
  faPen,
  faPhone,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import ClientModal from "./Modals/ClientModal";
import useDialog from "../../../hooks/useDialog";
import { dateFormat } from "../../../helpers/dates";
import BreadCrumb from "../../common/BreadCrumb";
import EditBookingModal from "./Modals/EditBookingModal";
import PaymentModal from "./Modals/PaymentModal";
import {
  getBookingStatusColor,
  getBookingStatusIcon,
  getBookingTypeColor,
} from "../../../helpers/functions";

const Client = () => {
  const { id } = useParams();
  const dialog = useDialog();

  const [{ client }, loading, reload] = useApi(getClient, id, null, [id]);

  const solde = useMemo(
    () =>
      client?.payments?.reduce(
        (sum, current) => sum + parseFloat(current.montant_paiement),
        0,
      ),
    [client?.payments],
  );

  const total = useMemo(
    () =>
      client?.bookings?.reduce(
        (sum, current) => sum + parseFloat(current.prix_total),
        0,
      ),
    [client?.bookings],
  );

  useEffect(() => {
    if (!loading && !client) toast.error("Client non trouvé");
  }, [loading, client]);

  const updateClient = async (client) => {
    const result = await dialog(<ClientModal client={client} />);
    if (result.action === "success") reload();
  };

  const CardClient = ({ color, icon, number, alias, text }) => {
    return (
      <Card className={"border-" + color + "-subtle border-2 card-client"}>
        <CardBody>
          <Row>
            <Col className="col-auto">
              <div className="avatar avatar-50 bg-white text-danger-emphasis rounded">
                <FontAwesomeIcon
                  icon={icon}
                  className={"text-" + color + " p-2"}
                />
              </div>
            </Col>
            <Col>
              <h5 className="mb-0">
                <span className={"text-" + color}>{number}</span>{" "}
                <small className="">{alias}</small>
              </h5>
              <p className=" mb-0">{text}</p>
            </Col>
          </Row>
        </CardBody>
      </Card>
    );
  };

  const CardAddress = ({ color, icon, text, alias }) => {
    return (
      <Row className="mb-3">
        <Col className="col-auto">
          <div
            className={
              "bg-" + color + "-subtle avatar avatar-50 text-white rounded"
            }
          >
            <FontAwesomeIcon icon={icon} className={"text-" + color + " p-2"} />
          </div>
        </Col>
        <Col>
          <p className="mb-0 mt-1" style={{ fontSize: "1em" }}>
            <span>{text}</span> <small className="">{alias}</small>
          </p>
        </Col>
      </Row>
    );
  };

  const CardText = ({ color, icon, number, alias, text }) => {
    return (
      <Row>
        {icon ? (
          <Col className="col-auto">
            <div className={"avatar bg-" + color + "-subtle rounded"}>
              <FontAwesomeIcon
                icon={icon}
                className={"text-" + color + " p-2"}
              />
            </div>
          </Col>
        ) : null}
        <Col>
          <div className="mb-0" style={{ fontSize: "16px" }}>
            <span className={"text-" + color}>{number}</span>{" "}
            <small className="">{alias}</small>
          </div>
          <p className="mb-0" style={{ fontSize: "15px" }}>
            {text}
          </p>
        </Col>
      </Row>
    );
  };

  const BookingCard = ({ booking }) => {
    const color = useMemo(
      () => getBookingStatusColor(booking.statut),
      [booking.statut],
    );

    const icon = useMemo(
      () => getBookingStatusIcon(booking.statut),
      [booking.statut],
    );

    return (
      <Card className="card-client rounded border-0">
        <div
          className={
            "bg-secondary-subtle p-3 rounded-top d-flex justify-content-between"
          }
        >
          <div>
            <h5 className={"text-primary"}>
              Réservation <TypeBadge type={booking.type} />
            </h5>
          </div>
          <span>
            <Button
              onClick={async () => {
                const result = await dialog(
                  <EditBookingModal booking={booking} />,
                );
                if (result.action === "success") reload();
              }}
            >
              <FontAwesomeIcon icon={faPen} />
              <span className="d-none d-lg-inline-block ms-2">Editer</span>
            </Button>
            <Badge color={color} className="ms-2 mt-0 p-lg-1 p-2">
              <FontAwesomeIcon icon={icon} size="lg" className="ms-lg-2" />
              <span className="d-none d-lg-inline-block ms-0 p-2">
                {booking.statut.toUpperCase()}
              </span>
            </Badge>
          </span>
        </div>
        <CardBody>
          <Row
            className="p-2"
            style={{ borderBottom: "1px solid rgb(229, 231, 235)" }}
          >
            <Col xs={12} lg={4} className="p-2">
              <CardText
                color="warning"
                icon={faCalendar}
                number={
                  <>
                    <span style={{ color: "#4182a9" }}>Du </span>
                    {dateFormat(booking.date_arrivee)}
                    <span style={{ color: "#4182a9" }}> au </span>
                    {dateFormat(booking.date_depart)}
                  </>
                }
              />
            </Col>
            <Col xs={12} lg={4} className="p-2">
              <CardText
                color="primary"
                icon={faEuro}
                number={booking.prix_total + " €"}
                text="Total"
              />
            </Col>
            <Col xs={12} lg={4} className="p-2">
              <CardText
                color="success"
                icon={faMoon}
                number={booking.nombre_nuits + " nuits"}
                text={
                  booking.adultes +
                  " adulte" +
                  (booking.adultes?.length > 1 ? "s" : "")
                }
              />
            </Col>
          </Row>
          <Row>
            <Col className="m-2 p-1">
              <span className="text-decoration-underline">Note :</span>{" "}
              <span className="fst-italic fs-5">
                {!!booking.note ? (
                  <span>{booking.note}</span>
                ) : (
                  <span className="fs-6">Aucune note</span>
                )}
              </span>
            </Col>
          </Row>
        </CardBody>
      </Card>
    );
  };

  const TypeBadge = ({ type }) => {
    const color = useMemo(() => getBookingTypeColor(type), [type]);
    return <span className={"text-" + color}>{type.toUpperCase()}</span>;
  };

  const RowPayment = ({ payment }) => {
    // const color = useMemo(
    //   () =>
    //     payment.moyen_paiement === "virement"
    //       ? "success"
    //       : payment.moyen_paiement === "chèque"
    //         ? "secondary"
    //         : "primary",
    //   [payment.moyen_paiement],
    // );
    //
    // const type =
    //   payment.moyen_paiement.charAt(0).toUpperCase() +
    //   payment.moyen_paiement.slice(1);

    return (
      <Row
        className={"row-payment g-0 p-3"}
        style={{ borderBottom: "1px solid rgb(229, 231, 235)" }}
      >
        <Col>
          <Row className="m-1">
            <Col xs={12} lg={4} className="my-3 m-lg-0">
              <CardText
                color="primary"
                icon={faEuro}
                number={payment.montant_paiement + " €"}
                text="Montant"
              />
            </Col>
            <Col xs={12} lg={5} className="my-3 m-lg-0">
              <CardText
                color="warning"
                icon={faCalendar}
                number={dateFormat(payment.date_paiement)}
                text={"Par " + payment.moyen_paiement}
              />
            </Col>
            <Col xs={12} lg={3} className="my-3 m-lg-0">
              <Button
                onClick={async () => {
                  const result = await dialog(
                    <PaymentModal payment={payment} />,
                  );
                  if (result.action === "success") reload();
                }}
              >
                <FontAwesomeIcon icon={faPen} />
                <span className="ms-2">Editer</span>
              </Button>
            </Col>
          </Row>
          {!!payment.note ? (
            <Row className="pt-3 ps-2">
              <Col>
                <div>
                  <span className="text-decoration-underline">Note :</span>{" "}
                  <span className="fst-italic">
                    {!!payment.note ? (
                      <span>{payment.note}</span>
                    ) : (
                      <span>Aucune note</span>
                    )}
                  </span>
                </div>
              </Col>
            </Row>
          ) : null}
        </Col>
      </Row>
    );
  };

  return !loading && !client ? (
    <Navigate to="/admin/" />
  ) : client ? (
    <>
      <BreadCrumb
        button={
          <Button
            size="xl"
            id={"btn-client-" + client.id}
            onClick={() => updateClient(client)}
            // color="primary"
            className="p-2 gold-btn"
          >
            <FontAwesomeIcon icon={faEdit} /> Editer
          </Button>
        }
      />

      {/*User Informations*/}
      <Row className="my-3">
        {/*Card User*/}
        <Col lg={4}>
          <Card className="card-user">
            <div className="image">
              <img alt="..." src="https://picsum.photos/700/400" />
            </div>
            <CardBody className="text-center">
              <div className="author">
                <img
                  alt="..."
                  className="avatar border-gray"
                  src="https://picsum.photos/200"
                />
              </div>
              <h3 className="text-primary">{client.nom}</h3>
              <h4 className="text-primary">{client.prenom}</h4>
            </CardBody>
          </Card>
        </Col>

        {/*Card Address*/}
        <Col lg={8}>
          <Card className="card-user">
            <CardBody style={{ minHeight: "297px" }}>
              <Row>
                <Col>
                  <Row className="my-2">
                    <Col>
                      <CardAddress
                        color="success"
                        icon={faEnvelope}
                        text={client.email}
                      />
                    </Col>
                  </Row>
                  <Row className="my-2">
                    <Col>
                      <CardAddress
                        color="primary"
                        icon={faPhone}
                        text={client.telephone}
                      />
                    </Col>
                  </Row>
                  <Row className="my-2">
                    <Col>
                      <CardAddress
                        color="warning"
                        icon={faHouse}
                        text={client.adresse}
                      />
                    </Col>
                  </Row>
                  <Row className="my-2">
                    <Col>
                      <CardAddress
                        color="secondary"
                        icon={faFlag}
                        text={client.language === "en" ? "Anglais" : "Français"}
                      />
                    </Col>
                  </Row>
                </Col>
                {/*{client.note && (*/}
                <Col className="m-2 me-4 p-3 rounded bg-body-secondary d-none d-lg-flex flex-column">
                  <div className="text-decoration-underline me-2">Note :</div>
                  <div>{client.note}</div>
                </Col>
                {/*)}*/}
              </Row>
              {client.note && (
                <Col className="m-1 p-3 rounded bg-body-secondary d-flex d-lg-none flex-column">
                  <div className="text-decoration-underline me-2">Note :</div>
                  <div>{client.note}</div>
                </Col>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/*Key Informations*/}
      <Row className="my-3">
        <Col lg={3}>
          <CardClient
            color="success"
            icon={faHashtag}
            number={client.bookings?.length}
            text={client.bookings?.length > 1 ? "Réservations" : "Réservation"}
          />
        </Col>
        <Col lg={3}>
          <CardClient
            color="primary"
            icon={faFileInvoice}
            number={solde + " €"}
            text="Solde actuel"
          />
        </Col>
        <Col lg={3}>
          <CardClient
            color="warning"
            icon={faEuroSign}
            number={total - solde + " €"}
            text={"A payer"}
          />
        </Col>
        <Col lg={3}>
          <CardClient
            color="info"
            icon={faFileInvoiceDollar}
            number={total + " €"}
            text={"Total"}
          />
        </Col>
      </Row>

      {/*Bookings and payments*/}
      <Row className="my-3">
        <Col xs={12} lg={7}>
          {client.bookings?.length > 0 ? (
            client.bookings?.map((b, i) => <BookingCard booking={b} key={i} />)
          ) : (
            <div className="p-3 fst-italic text-center">Aucune réservation</div>
          )}
        </Col>
        <Col xs={12} lg={5}>
          <Card className="card-client rounded border-0">
            <div className="bg-secondary-subtle p-3 rounded">
              <h5 className="text-primary" style={{ paddingBottom: "8px" }}>
                Paiements
              </h5>
            </div>
            <CardBody className="p-0">
              {client.payments?.length > 0 ? (
                client.payments?.map((p) => (
                  <RowPayment payment={p} key={p.id} />
                ))
              ) : (
                <div className="p-3 fst-italic text-center">Aucun paiement</div>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  ) : (
    <LoaderIcon />
  );
};

export default Client;
