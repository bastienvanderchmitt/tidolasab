import { Col, Container, Row } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faWifi,
  faBed,
  faUsers,
  faBathtub,
  faSquareParking,
  faHouse,
  faWaterLadder,
  faWind,
} from "@fortawesome/free-solid-svg-icons";
import accommodation from "../../../assets/img/room/view_2.jpeg";
import { Link } from "react-router-dom";

const Accommodation = () => {
  return (
    <Container className="accommodation">
      <Row className="p-4 accommodation-header">
        <Col className="text-center">
          <h4 className="title-4 pt-4">
            COMMENCEZ VOTRE SÉJOUR CONFORTABLEMENT
          </h4>
          <h4 className="title-2 pt-2">
            Détente et dépaysement assurés dans un cadre naturel
          </h4>
          <p className="pt-3">
            Au coeur d'une verdure luxuriante, bienvenue à Marie-Galante.
          </p>
        </Col>
      </Row>
      <Row>
        <Col className="p-4" xs={12} xl={6}>
          <Link to={"/photos"}>
            <div className="position-relative">
              <div className="image-zoom">
                <img
                  src={accommodation}
                  alt="accommodation"
                  className="w-100"
                />
                <div className="offset-border"></div>
              </div>
            </div>
            <h4 className="aurore pt-3 text-center">Vue depuis le jardin</h4>
          </Link>
        </Col>
        <Col className="p-4 text-center accommodation-content" xs={12} xl={6}>
          <div className="title-4">
            Jardin tropical / Calme & Reposant / Nature
          </div>
          <h4 className="title-2 pt-2">Case Ti' Dola Sab</h4>
          <div className="">
            <ul>
              <li>
                <FontAwesomeIcon icon={faUsers} className="me-2" />
                <span>2 personnes</span>
              </li>
              <li>
                <FontAwesomeIcon icon={faWaterLadder} className="me-2" />
                <span>Piscine</span>
              </li>
              <li>
                <FontAwesomeIcon icon={faWind} className="me-2" />
                <span>Climatisation</span>
              </li>
              <li>
                <FontAwesomeIcon icon={faBed} className="me-2" />
                <span>1 lit king size / 1 BZ</span>
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
          </div>
          <div className="">
            <p>
              Notre case Ti’ Dola Sab est une habitation indépendante toute en
              bois, de construction récente avec tout le confort nécessaire.
            </p>
          </div>
          <div className="more-btn">
            <Link to={"/booking"}>
              <span>Réserver</span>
            </Link>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Accommodation;
