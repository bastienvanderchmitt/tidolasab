import ReactApexChart from "react-apexcharts";
import useApi from "../../../hooks/useApi";
import { getStats } from "../../../api/statistics";
import { Card, CardBody, Col, Row } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import {
  faCalendar,
  faEuroSign,
  faHashtag,
  faMoon,
  faUser,
  faUsers,
  faDoorOpen,
} from "@fortawesome/free-solid-svg-icons";
import { useAdminContext } from "../../../contexts/AdminContext";
import { useNavigate } from "react-router-dom";
import DatePicker from "../../formik/DatePicker";
import {
  getBookingStatusColor,
  getBookingStatusIcon,
  getBookingTypeColor,
  getBookingTypeIcon,
} from "../../../helpers/functions";

const Dashboard = () => {
  const { user } = useAdminContext();
  const navigate = useNavigate();

  const [{ statistics }] = useApi(getStats);

  const CardStat = ({ color, icon, number, alias, text }) => {
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
                <small className={"text-" + color + " opacity-50 small-text"}>
                  {alias}
                </small>
              </h5>
              <p className="opacity-50 mb-0">{text}</p>
            </Col>
          </Row>
        </CardBody>
      </Card>
    );
  };

  const CardSimple = ({ color, icon, number, alias, text }) => {
    return (
      <Row className="mt-2 mt-lg-0">
        {icon ? (
          <Col className="col-auto">
            <div className={"avatar avatar-50 bg-" + color + "-subtle rounded"}>
              <FontAwesomeIcon
                icon={icon}
                className={"text-" + color + " p-2"}
              />
            </div>
          </Col>
        ) : null}
        <Col>
          <h6 className="mb-0">
            <span className={"text-" + color}>{number}</span>{" "}
            <small className="opacity-50">{alias}</small>
          </h6>
          <p className="opacity-50 mb-0">{text}</p>
        </Col>
      </Row>
    );
  };

  return (
    <>
      {/*<BreadCrumb />*/}
      <div className="row align-items-center my-5 text-center text-sm-start">
        <div className="col-12 col-sm-auto mb-sm-0">
          <div
            className="rounded-circle border-gray border-1 bg-white"
            style={{ height: "120px", width: "120px" }}
          >
            <img
              alt="..."
              className="rounded-circle border-gray border-1 mb-4 mb-sm-0"
              src="https://picsum.photos/200"
              style={{ height: "120px", width: "120px" }}
            />
          </div>
        </div>
        <div className="col-12 col-sm">
          <h4 className="mb-0" style={{ color: "rgb(101, 119, 146)" }}>
            Bonjour !
          </h4>
          <h1 className="text-primary mb-4 mb-sm-0">{user.name}</h1>
          <p
            className="mb-0"
            style={{ fontStyle: "italic", color: "rgb(101, 119, 146)" }}
          >
            "Fais de ta vie un rêve et d'un rêve une réalité"{" "}
            <span className="text-primary ">- Antoine de Saint-Exupéry</span>
          </p>
        </div>
      </div>
      {statistics ? (
        <>
          <Row className="my-3 p-2">
            <Col lg={3}>
              <CardStat
                color="success"
                icon={faEuroSign}
                number={statistics.total_paiements + " €"}
                text="Paiements"
              />
            </Col>
            <Col lg={3}>
              <CardStat
                color="primary"
                icon={faCalendar}
                number={statistics.total_reservations}
                alias="réservations"
                text="Valides"
              />
            </Col>
            <Col lg={3}>
              <CardStat
                color="warning"
                icon={faUsers}
                number={statistics.total_clients}
                text="Clients"
              />
            </Col>
            <Col lg={3}>
              <CardStat
                color="info"
                icon={faDoorOpen}
                number={statistics.reservations_a_venir?.length}
                alias={
                  "réservation" +
                  (statistics.reservations_a_venir?.length > 1 ? "s" : "")
                }
                text="À venir"
              />
            </Col>
          </Row>
          <Row className="my-3 p-2">
            <Col lg={8} className="d-flex">
              <Card
                style={{
                  minHeight: "417px",
                  maxHeight: "477px",
                  overflow: "auto",
                }}
                className="flex-fill"
              >
                <CardBody>
                  <Row>
                    <Col>
                      <h4 className="text-primary ms-2">
                        Réservations à venir
                      </h4>
                    </Col>
                  </Row>
                  {statistics.reservations_a_venir?.map((booking, i) => (
                    <Row
                      className="bg-secondary-subtle p-2 pt-3 m-2 rounded next-booking"
                      onClick={() =>
                        navigate("/admin/client/" + booking.id_client)
                      }
                      style={{ cursor: "pointer" }}
                      key={i}
                    >
                      <Col lg={3} sm={6} xs={12}>
                        <CardSimple
                          color="success"
                          icon={faUser}
                          number={booking.nom_client}
                        />
                      </Col>
                      <Col lg={3} sm={6} xs={12}>
                        <CardSimple
                          color="warning"
                          icon={faCalendar}
                          number={
                            "Du " +
                            booking.date_arrivee +
                            " au " +
                            booking.date_depart
                          }
                        />
                      </Col>
                      <Col lg={3} sm={6} xs={12}>
                        <CardSimple
                          color="info"
                          icon={faMoon}
                          number={booking.nombre_nuits}
                          text="Nuits"
                        />
                      </Col>
                      <Col lg={3} sm={6} xs={12}>
                        <CardSimple
                          color="primary"
                          icon={faHashtag}
                          number={booking.adultes}
                          text="Adultes"
                        />
                      </Col>
                    </Row>
                  ))}
                </CardBody>
              </Card>
            </Col>
            <Col className="mt-4 mt-lg-0 d-flex">
              <Card className="flex-fill">
                <CardBody>
                  <DatePicker viewOnly />
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row className="my-3 p-2">
            <Col>
              <Card>
                <CardBody>
                  <Row>
                    {statistics.reservations_par_type?.map((s, i) => (
                      <Col lg={3} sm={6} xs={12} key={i}>
                        <CardSimple
                          color={getBookingTypeColor(s.type)}
                          icon={getBookingTypeIcon(s.type)}
                          number={s.total}
                          text={
                            s.type.toUpperCase() + (+s.total > 1 ? "S" : "")
                          }
                        />
                      </Col>
                    ))}
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row className="my-3 p-2">
            <Col>
              <StackedChart
                data={{
                  series: statistics?.reservations_par_annee?.series,
                  categories: statistics?.reservations_par_annee?.mois,
                  legend: "Réservations",
                }}
              />
            </Col>
          </Row>
          <Row className="p-2">
            {statistics.reservations_par_statut?.map((s, i) => (
              <Col lg={4} xs={12} key={i}>
                <CardStat
                  color={getBookingStatusColor(s.statut)}
                  icon={getBookingStatusIcon(s.statut)}
                  number={s.total}
                  text={s.statut.toUpperCase() + (+s.total > 1 ? "S" : "")}
                />
              </Col>
            ))}
          </Row>
          <Row className="my-3 p-2">
            <Col>
              <AreaChart
                data={{
                  series: statistics?.clients_par_annee?.series,
                  categories: statistics?.clients_par_annee?.mois,
                  legend: "Clients / Durée",
                }}
              />
            </Col>
          </Row>
        </>
      ) : null}
    </>
  );
};

export default Dashboard;

// const Chart = ({ data }) => {
//   const state = {
//     series: data.series,
//     options: {
//       chart: {
//         toolbar: {
//           show: false,
//         },
//         type: "bar",
//         height: 350,
//       },
//       plotOptions: {
//         bar: {
//           horizontal: false,
//           columnWidth: "55%",
//           borderRadius: 5,
//           borderRadiusApplication: "end",
//         },
//       },
//       dataLabels: {
//         enabled: false,
//       },
//       stroke: {
//         show: true,
//         width: 2,
//         colors: ["transparent"],
//       },
//       xaxis: {
//         categories: data.categories,
//       },
//       yaxis: {
//         title: {
//           text: data.legend,
//         },
//       },
//       fill: {
//         opacity: 1,
//       },
//     },
//   };
//
//   return (
//     <Card>
//       <CardBody>
//         <ReactApexChart
//           options={state.options}
//           series={state.series}
//           type="bar"
//           height={350}
//         />
//       </CardBody>
//     </Card>
//   );
// };

const StackedChart = ({ data }) => {
  const state = {
    series: data.series,
    options: {
      chart: {
        type: "bar",
        height: 350,
        stacked: true,
        stackType: "100%",
        toolbar: {
          show: false,
        },
      },
      plotOptions: {
        bar: {
          horizontal: true,
        },
      },
      stroke: {
        width: 1,
        colors: ["#fff"],
      },
      xaxis: {
        categories: data.categories,
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return val;
          },
        },
      },
      fill: {
        opacity: 1,
      },
      legend: {
        position: "top",
        horizontalAlign: "left",
        offsetX: 40,
      },
      colors: ["#0dcaf0", "#198754", "#0ea1ab", "#ffc107"],
    },
  };

  return (
    <Card>
      <CardBody>
        <ReactApexChart
          options={state.options}
          series={state.series}
          type="bar"
          height={350}
        />
      </CardBody>
    </Card>
  );
};

const AreaChart = ({ data }) => {
  const state = {
    series: data.series,
    options: {
      chart: {
        type: "area",
        height: 350,
        toolbar: {
          show: false,
        },
      },
      stroke: {
        curve: "smooth",
      },
      xaxis: {
        categories: data.categories,
      },
      dataLabels: {
        enabled: false,
      },
    },
  };

  return (
    <Card>
      <CardBody>
        <ReactApexChart
          options={state.options}
          series={state.series}
          type="area"
          height={350}
        />
      </CardBody>
    </Card>
  );
};
