import { Badge, Col, Row } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faWifi,
  faLocationDot,
  faUsers,
  faBed,
  faBathtub,
  faHouse,
  faSquareParking,
} from "@fortawesome/free-solid-svg-icons";
import air_conditioning from "../../../assets/img/icons/air_conditioning.png";
import breakfast from "../../../assets/img/icons/breakfast.png";
import coffee_machine from "../../../assets/img/icons/coffee_machine.png";
import douche from "../../../assets/img/icons/douche.png";
import electric_kettle from "../../../assets/img/icons/electric_kettle.png";
import fridge from "../../../assets/img/icons/fridge.png";
import microwave from "../../../assets/img/icons/microwave.png";
import serviette from "../../../assets/img/icons/serviette.png";
import stove from "../../../assets/img/icons/stove.png";
import toaster from "../../../assets/img/icons/toaster.png";
import toilets from "../../../assets/img/icons/toilets.png";
import wifi_signal from "../../../assets/img/icons/wifi_signal.png";

const Amenity = ({ text, icon }) => {
  return (
    <Col sm={12} md={6} className="amenity">
      <Row>
        <Col xs={1} className="me-4">
          <img src={icon} alt={text} />
        </Col>
        <Col>
          <p>{text}</p>
        </Col>
      </Row>
    </Col>
  );
};

const amenities = [
  { icon: wifi_signal, text: "Wifi" },
  { icon: air_conditioning, text: "Brasseurs d'air" },
  { icon: stove, text: "Plaques à induction" },
  { icon: microwave, text: "Micro-ondes" },
  { icon: coffee_machine, text: "Cafetière" },
  { icon: fridge, text: "Réfrigérateur / Congélateur" },
  { icon: toaster, text: "Grille-pain" },
  { icon: electric_kettle, text: "Bouilloire" },
  { icon: breakfast, text: "Vaisselle pour 4 personnes" },
  { icon: douche, text: "Douche italienne" },
  { icon: toilets, text: "WC indépendant" },
  { icon: serviette, text: "Serviettes de bain" },
];

const Room = () => {
  return (
    <Row className="room">
      <h4 className="title-2 pt-2">Case Ti'Dola Sab</h4>
      <div className="title-4">Jardin tropical / Calme & Reposant / Nature</div>
      <Row>
        <Col className="room-content">
          <ul>
            <li>
              <FontAwesomeIcon icon={faUsers} className="me-2" />
              <span>2 personnes</span>
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
              <FontAwesomeIcon icon={faHouse} className="me-2" />
              <span>Grande terrasse</span>
            </li>
            <li>
              <FontAwesomeIcon icon={faWifi} className="me-2" />
              <span>Wifi</span>
            </li>
            <li>
              <FontAwesomeIcon icon={faSquareParking} className="me-2" />
              <span>Parking</span>
            </li>
          </ul>
        </Col>
      </Row>
      <Row className="pt-4 pb-4">
        <h5 className="pt-3 marcellus">
          <FontAwesomeIcon icon={faHouse} className="me-4 text-primary" />
          Logement
        </h5>
        <p>
          Dans un cadre de verdure luxuriante, notre Case Ti'Dola Sab est une
          habitation indépendante toute en bois, construction récente avec tout
          le confort nécessaire.
        </p>
        <p>
          Une grande terrasse couverte de 20m<sup>2</sup> vous attend pour vos
          moments de détente, ombragée par un magnifique Ylang Ylang odorant.
          Votre case est face à la forêt domaniale, écrin de verdure calme,
          reposant et dépaysant pour les amoureux de la nature.
        </p>
        <p>
          Il ne vous reste plus qu'à profiter d'instants magiques. Notre plaisir
          : vous accueillir et partager notre paradis. Une corbeille de bienvenu
          vous attend à votre arrivée (à partir de 16h et départ jusqu'à 11h).
        </p>
        <h5 className="pt-3 marcellus">
          <FontAwesomeIcon icon={faLocationDot} className="me-4 text-primary" />
          Accès et situation
        </h5>
        <p>
          Nous sommes très bien situé pour visiter et parcourir l'île avec notre
          emplacement central. Les 3 grandes villes Grand-Bourg, Capesterre et
          St Louis sont à 10min de Ti'Dola Sab. Pour faire vos courses, 2min à
          pied et vous pouvez vous ravitailler sur Morne Lolo. Une des trois
          distilleries est à 2 mn en voiture.
        </p>
      </Row>
      <Row>
        <h4 className="title-3 pt-4">
          Les plus belles plages de l'île sont à 10min :
        </h4>
        <div className="room-list">
          <Badge>Folle Anse</Badge>
          <Badge>Anse Bambou</Badge>
          <Badge>Anse de Mays</Badge>
          <Badge>Anse Canot</Badge>
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
    </Row>
  );
};

export default Room;
