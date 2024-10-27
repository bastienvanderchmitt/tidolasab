import {
  Card,
  CardBody,
  CardImg,
  CardImgOverlay,
  CardText,
  CardTitle,
  Col,
  Container,
  Row,
} from "reactstrap";
import { faLocationPin } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import location_23 from "../../assets/img/locations/location_23.jpeg";
import location_9 from "../../assets/img/locations/location_9.jpeg";
import location_20 from "../../assets/img/locations/location_20.jpeg";
import location_25 from "../../assets/img/locations/location_25.jpeg";
import location_24 from "../../assets/img/locations/location_24.jpeg";
import location_3_square from "../../assets/img/locations/location_3_square.jpeg";
import location_4_square from "../../assets/img/locations/location_4_square.jpeg";
import location_6_square from "../../assets/img/locations/location_6_square.jpeg";
import location_10_square from "../../assets/img/locations/location_10_square.jpeg";
import { useTranslation } from "react-i18next";

const Activities = () => {
  const { t } = useTranslation();

  const activities = [
    {
      title: t("activities.activity_1.title"),
      img: location_20,
      description: t("activities.activity_1.description"),
      location: t("activities.activity_1.location"),
    },
    {
      title: t("activities.activity_2.title"),
      img: location_10_square,
      description: t("activities.activity_2.description"),
      location: t("activities.activity_2.location"),
    },
    {
      title: t("activities.activity_3.title"),
      img: location_6_square,
      description: t("activities.activity_3.description"),
      location: t("activities.activity_3.location"),
    },
    {
      title: t("activities.activity_4.title"),
      img: location_4_square,
      description: t("activities.activity_4.description"),
      location: t("activities.activity_4.location"),
    },
    {
      title: t("activities.activity_5.title"),
      img: location_25,
      description: t("activities.activity_5.description"),
      location: t("activities.activity_5.location"),
    },
    {
      title: t("activities.activity_6.title"),
      img: location_9,
      description: t("activities.activity_6.description"),
      location: t("activities.activity_6.location"),
    },
    {
      title: t("activities.activity_7.title"),
      img: location_23,
      description: t("activities.activity_7.description"),
      location: t("activities.activity_7.location"),
    },
    {
      title: t("activities.activity_8.title"),
      img: location_3_square,
      description: t("activities.activity_8.description"),
      location: t("activities.activity_8.location"),
    },
    {
      title: t("activities.activity_9.title"),
      img: location_24,
      description: t("activities.activity_9.description"),
      location: t("activities.activity_9.location"),
    },
  ];

  const Activity = ({ activity }) => {
    return (
      <Card className="my-2">
        <CardImg
          alt="Card image cap"
          src={activity.img}
          style={{
            height: 320,
          }}
          top
          width="100%"
        />
        <CardImgOverlay className="nav-pills">
          <CardTitle
            tag="h5"
            className="nav-link active p-2"
            style={{ width: "fit-content" }}
          >
            {activity.title}
          </CardTitle>
        </CardImgOverlay>
        <CardBody style={{ minHeight: "160px" }}>
          <CardText>{activity.description}</CardText>
          <CardText>
            <small
              className="text-muted"
              style={{ position: "absolute", bottom: "10px" }}
            >
              <FontAwesomeIcon
                icon={faLocationPin}
                className="me-2 text-secondary"
              />
              {activity.location}
            </small>
          </CardText>
        </CardBody>
      </Card>
    );
  };

  return (
    <Container className="activities" style={{ paddingBottom: "100px" }}>
      <Row className="p-4 m-lg-4 accommodation-header">
        <Col className="text-center">
          <h4 className="title-4 pt-4">{t("activities.title")}</h4>
          <h4 className="title-2 pt-2">{t("activities.subtitle")}</h4>
          <p className="pt-3">{t("activities.description")}</p>
          <p className="pt-3">{t("activities.sub_description")}</p>
        </Col>
      </Row>
      <Row className="p-4">
        {activities?.map((activity, key) => (
          <Col xs={12} sm={4} key={key}>
            <Activity activity={activity} />
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Activities;
