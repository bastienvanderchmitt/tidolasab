import { useLayoutContext } from "../../contexts/LayoutContext";
import { useEffect } from "react";
import { pages } from "../../helpers/pages";
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

const Activities = () => {
  const { setHeader } = useLayoutContext();

  useEffect(() => {
    setHeader(pages.activities);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const activities = [
    {
      title: "Plage de Moustique",
      img: "https://picsum.photos/600/600",
      description:
        "Découvrez la plage de Moustique, l'une des plus belles dœe l'île, avec ses eaux cristallines et son sable fin.",
      location: "Moustique",
    },
    {
      title: "Randonnée à la Distillerie Bielle",
      img: "https://picsum.photos/500/500",
      description:
        "Partez à la découverte de la Distillerie Bielle, l'une des plus anciennes de la Guadeloupe, et apprenez-en plus sur la production de rhum.",
      location: "Distillerie Bielle",
    },
    {
      title: "Snorkeling à la Pointe des Sables",
      img: "https://picsum.photos/350/350",
      description:
        "Explorez les fonds marins de la Pointe des Sables et découvrez la faune et la flore sous-marine de l'île.",
      location: "Pointe des Sables",
    },
    {
      title: "Visite du Musée du Rhum",
      img: "https://picsum.photos/450/450",
      description:
        "Découvrez l'histoire du rhum et de la canne à sucre à travers les expositions du Musée du Rhum.",
      location: "Grand-Bourg",
    },
    {
      title: "Kayak à la Rivière du Vieux-Fort",
      img: "https://picsum.photos/460/460",
      description:
        "Partez à la découverte de la Rivière du Vieux-Fort en kayak et admirez les paysages verdoyants de l'île.",
      location: "Rivière du Vieux-Fort",
    },
    {
      title: "Marché de Grand-Bourg",
      img: "https://picsum.photos/700/700",
      description:
        "Découvrez les saveurs et les couleurs du marché de Grand-Bourg, où vous trouverez des fruits, des légumes et des spécialités locales.",
      location: "Grand-Bourg",
    },
    {
      title: "Visite de l'Habitation Murat",
      img: "https://picsum.photos/750/750",
      description:
        "Découvrez l'histoire de l'Habitation Murat, une ancienne sucrerie, et admirez l'architecture créole de l'île.",
      location: "Capesterre",
    },
    {
      title: "Plage de Petite Anse",
      img: "https://picsum.photos/630/630",
      description:
        "Détendez-vous sur la plage de Petite Anse, une plage sauvage et préservée de l'île.",
      location: "Petite Anse",
    },
    {
      title: "Visite de l'Eglise Saint-Louis",
      img: "https://picsum.photos/520/520",
      description:
        "Découvrez l'histoire et l'architecture de l'Eglise Saint-Louis, une église du XVIIIe siècle située au cœur de Grand-Bourg.",
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
              <FontAwesomeIcon icon={faLocationPin} className="me-2" />
              {activity.location}
            </small>
          </CardText>
        </CardBody>
      </Card>
    );
  };

  return (
    <Container className="activities">
      <Row className="p-4 m-lg-4 accommodation-header">
        <Col className="text-center">
          <h4 className="title-4 pt-4">Partez à la découverte et ...</h4>
          <h4 className="title-2 pt-2">Vivez des moments inoubliables</h4>
          <p className="pt-3">
            Sur la belle île de Marie Galante les activités sont nombreuses.
            Restauration, visites, plages, activités nautiques, spa, randonnées
            pédestres… Découvrez également la culture Marie Galantaise dans
            toute son authenticité. La récolte des cannes à sucre, la récolte du
            bambou, la pêche avec les nasses, la ponte des tortues luth, la vie
            des moulins…
          </p>
        </Col>
      </Row>
      <Row className="p-4 mb-5">
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
