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
import location_18 from "../../assets/img/locations/location_18.jpeg";
import location_9 from "../../assets/img/locations/location_9.jpeg";
import location_20 from "../../assets/img/locations/location_20.jpeg";
import location_15 from "../../assets/img/locations/location_15.jpeg";
import location_10_square from "../../assets/img/locations/location_10_square.jpeg";
import location_3_square from "../../assets/img/locations/location_3_square.jpeg";
import location_4_square from "../../assets/img/locations/location_4_square.jpeg";
import location_6_square from "../../assets/img/locations/location_6_square.jpeg";
import distillerie from "../../assets/img/discover/distillerie-vue-aerienne.jpg";

const Activities = () => {
  const activities = [
    {
      title: "Anse Bambou",
      img: location_20,
      description:
        "Découvrez l'une des plus belles plages de l'île, avec ses eaux cristallines et son sable fin.",
      location: "Anse Bambou",
    },
    {
      title: "Randonnée à la Distillerie Bielle",
      img: distillerie,
      description:
        "Partez à la découverte d'une des plus anciennes distilleries de la Guadeloupe, et apprenez-en plus sur la production de rhum.",
      location: (
        <>
          Distillerie Bielle - image{" "}
          <a
            href="https://www.rhum-outremer.com/distillerie-bielle"
            target="_blank"
            rel="noreferrer"
          >
            @rhum-outremer
          </a>
        </>
      ),
    },
    {
      title: "Caye Plate",
      img: location_6_square,
      description:
        "D'une rare beauté et vertigineux, la falaise Caye Plate est l'un des plus beaux sites à visiter à Marie-Galante.",
      location: "Plateau de l'Anse du Coq",
    },
    {
      title: "Îlet de Vieux Fort",
      img: location_4_square,
      description:
        "Partez explorer la mangrove de Vieux Fort, sa plage mais aussi sa randonnée dans des paysages exceptionnels !",
      location: "Îlet de Vieux Fort",
    },
    {
      title: "Habitation Roussel Trianon",
      img: location_15,
      description:
        "Découvrez l'histoire de l'Habitation Roussel Trianon, une ancienne sucrerie, et admirez l'architecture créole de l'île.",
      location: "Habitation Roussel Trianon",
    },
    {
      title: "Snorkeling à la Pointe des Sables",
      img: location_9,
      description:
        "Explorez les fonds marins de la Pointe des Sables et découvrez la faune et la flore sous-marine de l'île.",
      location: "Pointe des Sables",
    },
    {
      title: "Plage de Petite Anse",
      img: location_18,
      description:
        "Détendez-vous sur la plage de Petite Anse, une plage sauvage et préservée de l'île.",
      location: "Petite Anse",
    },
    {
      title: "Gueule grand gouffre",
      img: location_3_square,
      description:
        "Véritable trésor de l’île, cette arche naturelle creusée par la mer vous offrira des sensations fortes en entendant l’océan tourbillonner au fond du gouffre",
      location: "Capesterre",
    },

    {
      title: "Visite de Grand-Bourg",
      img: location_10_square,
      description:
        "Découvrez l'histoire et l'architecture de la ville ou détendez-vous après une journée bien remplie.",
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
        <CardBody>
          <CardText>{activity.description}</CardText>
          <CardText>
            <small className="text-muted">
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
          <h4 className="title-2 pt-2">Vivez des moments inoubliables</h4>
          <p className="pt-3">
            Sur la belle île de Marie-Galante les activités sont nombreuses.
            Restauration, visites, plages, activités nautiques, spa, randonnées
            pédestres… Découvrez également la culture Marie-Galantaise dans
            toute son authenticité. La récolte des cannes à sucre, la récolte du
            bambou, la pêche avec les nasses, la ponte des tortues luth, la vie
            des moulins…
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
