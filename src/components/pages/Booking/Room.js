import { Badge, Col, Row } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faWifi,
  faLocationDot,
  faUsers,
  faBed,
  faBathtub,
} from "@fortawesome/free-solid-svg-icons";

const Amenity = ({ text, icon }) => {
  return (
    <Col sm={12} md={6} className="amenity">
      <Row>
        <Col xs={1}>
          <FontAwesomeIcon icon={icon} />
        </Col>
        <Col>
          <p>{text}</p>
        </Col>
      </Row>
    </Col>
  );
};

const amenities = [
  { icon: faWifi, text: "Wifi" },
  { icon: faWifi, text: "Air conditionné" },
  { icon: faWifi, text: "Plaques à induction" },
  { icon: faWifi, text: "Micro-ondes" },
  { icon: faWifi, text: "Cafetière" },
  { icon: faWifi, text: "Réfrigérateur / Congélateur" },
  { icon: faWifi, text: "Grille-pain" },
  { icon: faWifi, text: "Bouilloire" },
  { icon: faWifi, text: "Vaisselle pour 4 personnes" },
  { icon: faBathtub, text: "Douche italienne" },
  { icon: faWifi, text: "WC indépendant" },
  { icon: faWifi, text: "Serviettes de bain" },
];

const Room = () => {
  return (
    <Row className="room">
      <h4 className="title-2 pt-2">Case Ti'Dola Sab</h4>
      <div className="title-4">Verdure / Calme & Reposant / Nature</div>
      <Row>
        <Col className="room-content">
          <ul>
            <li>
              <FontAwesomeIcon icon={faUsers} className="me-2" />
              <span>4 personnes</span>
            </li>
            <li>
              <FontAwesomeIcon icon={faBed} className="me-2" />
              <span>1 lit King size en 160</span>
            </li>
            <li>
              <FontAwesomeIcon icon={faBed} className="me-2" />
              <span>1 BZ en 140</span>
            </li>
            <li>
              <FontAwesomeIcon icon={faBathtub} className="me-2" />
              <span>1 salle de bain</span>
            </li>
            <li>
              <FontAwesomeIcon icon={faWifi} className="me-2" />
              <span>Wifi</span>
            </li>
          </ul>
        </Col>
      </Row>
      <Row className="pt-4">
        <p>
          Dans un cadre de verdure luxuriante, notre Case Ti'Dola Sab est une
          habitation indépendante toute en bois, construction récente avec tout
          le confort nécessaire.
        </p>
        <p>
          Une grande terrasse couverte de 20m<sup>2</sup> vous attend pour vos
          moments de détente, ombragée par un magnifique Ylang Ylang odorant.
        </p>
      </Row>
      <Row>
        <h4 className="title-3 pt-4">
          Les plus belles plages de l'île sont à 10min :
        </h4>
        <div className="room-list">
          <Badge>Folle Anse</Badge>
          <Badge>St Louis</Badge>
          <Badge>l'Anse de Mays</Badge>
          <Badge>l'Anse Canot</Badge>
          <Badge>Vieux Fort</Badge>
          <Badge>la Feuillère et petite Ans</Badge>
          <Badge>Grand Bourg</Badge>
        </div>
      </Row>
      <Row className="amenities">
        <h4 className="title-2 pt-5 pb-4">Équipements de la chambre</h4>
        {amenities.map((amenity, key) => (
          <Amenity icon={amenity.icon} text={amenity.text} key={key} />
        ))}
      </Row>
      {/*<Row>*/}
      {/*  <h4 className="title-2 pt-5 pb-4">Qu'est-ce qui est inclus ?</h4>*/}
      {/*  <div className="room-list">*/}
      {/*    <Badge>Private balcony</Badge>*/}
      {/*    <Badge>140x200 cm Elite bed</Badge>*/}
      {/*    <Badge>Upholstered seat beside the panoramic window</Badge>*/}
      {/*    <Badge>TV-UHD screen for watching mountaineering films</Badge>*/}
      {/*    <Badge>*/}
      {/*      Writing desk with USB ports for documenting your adventures*/}
      {/*    </Badge>*/}
      {/*    <Badge>Room safe for your top mountain photos</Badge>*/}
      {/*    <Badge>*/}
      {/*      Service station with Lavazza coffee machine, kettle and tea*/}
      {/*    </Badge>*/}
      {/*    <Badge>Bathroom with rain shower</Badge>*/}
      {/*    <Badge>Comfortable terry towels and bathrobes</Badge>*/}
      {/*  </div>*/}
      {/*</Row>*/}
      <Row>
        <h4 className="title-2 pt-5 pb-4">
          <FontAwesomeIcon icon={faLocationDot} className="me-4 text-primary" />
          Accès et situation
        </h4>
        <p>
          Nous sommes très bien situé pour visiter et parcourir l'île avec notre
          emplacement central. Les 3 grandes viles Grand-Bourg, Capesterre et St
          Louis sont à 10min de Ti'Dola Sab.
        </p>
        <p>
          Pour faire vos courses, 2min à pied et vous pouvez vous ravitailler
          sur Morne Lolo.
        </p>
        <p>La distillerie Bielle est à 2min en voiture !</p>
      </Row>
    </Row>
  );
};

export default Room;
