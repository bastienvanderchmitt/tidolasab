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

const Statistics = () => {
  const [{ statistics }] = useApi(getStats);
  console.log("statistics", statistics);
  return (
    <>
      <Row className="admin-title g-0">
        <Col md={2}>
          <h1 className="aurore">Statistiques</h1>
        </Col>
      </Row>
      <Container fluid className="statistics admin-content">
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
      </Container>
    </>
  );
};

export default Statistics;
