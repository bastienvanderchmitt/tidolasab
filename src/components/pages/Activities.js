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
// import location_15 from "../../assets/img/locations/location_15.jpeg";
import location_25 from "../../assets/img/locations/location_25.jpeg";
import location_24 from "../../assets/img/locations/location_24.jpeg";
import location_3_square from "../../assets/img/locations/location_3_square.jpeg";
import location_4_square from "../../assets/img/locations/location_4_square.jpeg";
import location_6_square from "../../assets/img/locations/location_6_square.jpeg";
import location_10_square from "../../assets/img/locations/location_10_square.jpeg";

const Activities = () => {
  const activities = [
    {
      title: "Plages",
      img: location_20,
      description: "Découvrez ses eaux cristallines et son sable fin.",
      location: "Anse Bambou",
    },
    {
      title: "Rhumeries",
      img: location_10_square,
      description:
        "Partez à la découverte des trois distilleries de Marie-Galante, et apprenez-en plus sur la production et la dégustation de ses différents rhum.",
      location: "Capesterre et Grand-Bourg",
    },
    {
      title: "Caye Plate",
      img: location_6_square,
      description: "D'une rare beauté et vertigineuse, la falaise Caye Plate.",
      location: "Saint-Louis",
    },
    {
      title: "Îlet de Vieux Fort",
      img: location_4_square,
      description:
        "Partez explorer la mangrove de Vieux Fort, sa plage mais aussi sa randonnée dans des paysages exceptionnels!",
      location: "Vieux Fort",
    },
    {
      title: "Habitation Roussel Trianon",
      img: location_25,
      description:
        "Découvrez l'histoire de l'Habitation Roussel Trianon, une ancienne sucrerie, et admirez l'architecture créole de l'île.",
      location: "Grand-Bourg",
    },
    {
      title: "Activités aquatiques",
      img: location_9,
      description:
        "Essayez-vous à la plongée ou au snorkeling et explorez la faune et la flore sous-marine de l'île.",
      location: "Toute l'île ",
    },
    {
      title: "Street Art",
      img: location_23,
      description:
        "Une véritable célébration de la culture locale, de l’art et de la créativité.",
      location: "Petite Anse",
    },
    {
      title: "Gueule Grand Gouffre",
      img: location_3_square,
      description:
        "Une arche naturelle creusée par la mer et un point de vue à couper le souffle.",
      location: "Saint-Louis",
    },
    {
      title: "Habitation Murat",
      img: location_24,
      description: "Vestiges d’une habitation sucrière et musée.",
      location: "Grand-Bourg",
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
          <h4 className="title-4 pt-4">Partez à la découverte et ...</h4>
          <h4 className="title-2 pt-2">Ecrivez votre histoire</h4>
          <p className="pt-3">
            En découvrant ses plages de sable blanc aux eaux turquoises, sa
            faune aquatique, ses forets tropicales, sa mangrove, ses sentiers de
            randonnées, sa gastronomie, ses trois rhumeries, ses moulins...
          </p>
          <p className="pt-3">
            Venez prendre le temps d'apprécier les charmes authentiques de
            Marie-Galante, ses habitants et sa culture antillaise.
          </p>
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
