import mg_beach from "../../../assets/img/locations/location_4.jpeg";
import { Col, Container, Row } from "reactstrap";
import { Link } from "react-router-dom";

const Discover = () => {
  return (
    <div className="discover">
      <Container>
        <Row className="p-4 discover-content">
          <Col className="p-5" xs={12} xl={6}>
            <Row>
              <Col>
                <h4 className="title-4 pt-4">Découvrez l'île</h4>
                {/*<span className="title-2">Tant de choses à découvrir !</span>*/}
              </Col>
            </Row>
            <p className="pt-4">
              Découvrez « la galette » (surnom de l’île), ses plages de sable
              blanc aux eaux turquoises, sa faune aquatique, ses forets
              tropicales, sa mangrove, ses sentiers de randonnées, sa
              gastronomie, ses trois rhumeries, ses moulins...
            </p>
          </Col>
          <Col>
            <Link to={"/activities"}>
              <div className="position-relative">
                <div className="image-zoom">
                  <img src={mg_beach} className="w-100" alt="beach" />
                  <div className="offset-border"></div>
                  <div className="overlay-label">
                    <div className="overlay-label-text">VOIR</div>
                  </div>
                </div>
              </div>
              <h4 className="aurore pt-3">Des couleurs éblouissantes</h4>
            </Link>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Discover;
