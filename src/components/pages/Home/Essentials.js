import { Col, Container, Row } from "reactstrap";
import essentials_1 from "../../../assets/img/room/room_6.jpeg";
import essentials_2 from "../../../assets/img/room/view_1.jpeg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlane,
  faWifi,
  faBroomBall,
  faUmbrellaBeach,
  faWheelchair,
  faMartiniGlassCitrus,
} from "@fortawesome/free-solid-svg-icons";

const Essential = ({ title, text, icon }) => {
  return (
    <Col sm={12} md={6} className="essential">
      <Row>
        <Col xs={3}>
          <FontAwesomeIcon icon={icon} />
        </Col>
        <Col>
          <h5>{title}</h5>
          <p>{text}</p>
        </Col>
      </Row>
    </Col>
  );
};

const Essentials = () => {
  return (
    <Container className="essentials">
      <Row className="p-4">
        <Col className="px-5 d-none d-md-block">
          <div className="image-zoom">
            <img alt="essential 1" src={essentials_1} className="w-100" />
          </div>
          <h4 className="aurore pt-3">
            Inspiré de notre histoire, en pleine nature pour offrir une
            expérience de vie différente.
          </h4>
        </Col>
        <Col>
          <Row>
            <Col>
              <h4 className="title-4">
                DÉCOUVREZ LES SERVICES QUE NOUS PROPOSONS
              </h4>
            </Col>
          </Row>
          <Row>
            <Col>
              <h4 className="title-2 pt-2">
                L'essentiel pour un séjour Douillet et Confortable
              </h4>
            </Col>
          </Row>
          <Row className="pt-5">
            <Essential
              title="Airport Pick-up"
              icon={faPlane}
              text="Nous pouvons venir vous chercher à l'aéroport ou à l'arrivée du Ferry."
            />
            <Essential
              title="Prêt de matériel"
              icon={faUmbrellaBeach}
              text="Transats à disposition pour des moments de farniente."
            />
          </Row>
          <Row>
            <Essential
              title="Wifi & Internet"
              icon={faWifi}
              text="Connexion incluse dans la location."
            />
            <Essential
              title="Apéro local"
              icon={faMartiniGlassCitrus}
              text="Venez découvrir les cocktails et rhums de l'île."
            />
          </Row>
          <Row className="pb-4">
            <Essential
              title="Blanchisserie"
              icon={faBroomBall}
              text="Lorem ipsum proin gravida velit auctor sde re sit amet
                    space."
            />
            <Essential
              title="Accès handicapé"
              icon={faWheelchair}
              text="Le gite est accessible pour les personnes en situation de handicap."
            />
          </Row>
          <Row>
            <Col>
              <div className="image-zoom">
                <img alt="logo" src={essentials_2} className="w-100" />
              </div>
            </Col>
          </Row>
          <Row>
            <Col className="pt-4 px-5 d-md-none">
              <div className="image-zoom">
                <img alt="logo" src={essentials_1} className="w-100" />
              </div>
              <h4 className="aurore pt-3">
                Inspiré de notre histoire, en pleine nature pour offrir une
                expérience de vie différente.
              </h4>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default Essentials;
