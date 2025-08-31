import {
  Card,
  CardBody,
  CardText,
  CardTitle,
  Col,
  Container,
  ListGroup,
  ListGroupItem,
  Row,
} from "reactstrap";
import useApi from "../../../hooks/useApi";
import { getStats } from "../../../api/statistics";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClipboardList,
  faMoneyBillWave,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import BreadCrumb from "../../common/BreadCrumb";
import React from "react";

const Statistics = () => {
  const [{ statistics }] = useApi(getStats);
  console.log("statistics", statistics);

  const CardStat = ({ color, icon, number, alias, text }) => {
    return (
      <Card className={"bg-" + color + "-subtle card-client"}>
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
                <small className="opacity-50">{alias}</small>
              </h5>
              <p className="opacity-50 mb-0">{text}</p>
            </Col>
          </Row>
        </CardBody>
      </Card>
    );
  };

  return (
    <>
      <BreadCrumb />
      <Row className="mb-4">
        <Col md={4}>
          <Card className="text-center shadow-sm">
            <CardBody>
              <FontAwesomeIcon icon={faUsers} size="2x" className="mb-2" />
              <CardTitle tag="h5">Total Clients</CardTitle>
              <CardText>{statistics?.total_clients}</CardText>
            </CardBody>
          </Card>
        </Col>
        {/*<Col md={4}>*/}
        {/*  <Card className="text-center shadow-sm">*/}
        {/*    <CardBody>*/}
        {/*      <div className="row align-items-center">*/}
        {/*        <div className="col-auto">*/}
        {/*          <div className="avatar avatar-50 text-center rounded bg-success-subtle text-success-emphasis p-3">*/}
        {/*            <FontAwesomeIcon*/}
        {/*              icon={faUsers}*/}
        {/*              size="2x"*/}
        {/*              className="mb-2"*/}
        {/*            />*/}
        {/*          </div>*/}
        {/*        </div>*/}
        {/*        <div className="col px-0">*/}
        {/*          <p className="h4 mb-0">{statistics?.total_clients}</p>*/}
        {/*          <p className="text-secondary small">Clients</p>*/}
        {/*        </div>*/}
        {/*        <div className="col-auto">*/}
        {/*          <div className="summarychart height-50 width-60">*/}
        {/*            <canvas*/}
        {/*              id="areachartgreen1"*/}
        {/*              style={{*/}
        {/*                display: "block",*/}
        {/*                boxSizing: "border-box",*/}
        {/*                height: "50px",*/}
        {/*                width: "60px",*/}
        {/*              }}*/}
        {/*              width="60"*/}
        {/*              height="50"*/}
        {/*            ></canvas>*/}
        {/*          </div>*/}
        {/*        </div>*/}
        {/*      </div>*/}
        {/*    </CardBody>*/}
        {/*  </Card>*/}
        {/*</Col>*/}
        <Col md={4}>
          <Card className="text-center shadow-sm">
            <CardBody>
              <FontAwesomeIcon
                icon={faClipboardList}
                size="2x"
                className="mb-2"
              />
              <CardTitle tag="h5">Réservations à venir</CardTitle>
              <CardText>{statistics?.total_reservations}</CardText>
            </CardBody>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center shadow-sm">
            <CardBody>
              <FontAwesomeIcon
                icon={faMoneyBillWave}
                size="2x"
                className="mb-2"
              />
              <CardTitle tag="h5">Total Paiements</CardTitle>
              <CardText>
                {parseFloat(statistics?.total_paiements).toFixed(2)} €
              </CardText>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* Pourcentage de Remplissage */}
      <Row className="mb-4">
        <Col>
          <Card className="text-center shadow-sm">
            <CardBody>
              <CardTitle tag="h5">Pourcentage de Remplissage</CardTitle>
              <CardText>
                {statistics?.pourcentage_remplissage
                  ? `${parseFloat(statistics?.pourcentage_remplissage).toFixed(2)}%`
                  : "Données non disponibles"}
              </CardText>
            </CardBody>
          </Card>
        </Col>
      </Row>

      <Row className="my-4">
        <Col>
          <h2>Réservations par Statut</h2>
          <ListGroup>
            {statistics?.reservations_par_statut.map((statut) => (
              <ListGroupItem key={statut.statut}>
                {statut.statut}: <strong>{statut.total}</strong>
              </ListGroupItem>
            ))}
          </ListGroup>
        </Col>
      </Row>
    </>
  );
};

export default Statistics;
