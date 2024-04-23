import mg_beach from "../../../assets/img/discover/mg_beach.jpg";
import { Col, Container, Row } from "reactstrap";

const Discover = () => {
  return (
    <div className="discover">
      <Container>
        <Row className="p-4 discover-content">
          <Col className="p-5" xs={12} xl={6}>
            <Row>
              <Col>
                <h4 className="title-4 pt-4">Découvrez l'île</h4>
                <span className="title-2">Tant de choses à découvrir !</span>
              </Col>
            </Row>
            <p className="pt-4">
              Sur la belle île de Marie Galante les activités sont nombreuses.
              Restauration, visites, plages, activités nautiques, spa,
              randonnées pédestres…
            </p>
            <p>
              Découvrez également la culture Marie Galantaise dans toute son
              authenticité. La récolte des cannes à sucre, la récolte du bambou,
              la pêche avec les nasses, la ponte des tortues luth, la vie des
              moulins…
            </p>
          </Col>
          <Col>
            <div className="position-relative">
              <div className="image-zoom">
                <img src={mg_beach} className="w-100" alt="beach" />
                <div className="offset-border"></div>
                <div className="overlay-label">
                  <div className="overlay-label-text">VOIR</div>
                </div>
              </div>
            </div>
            <h4 className="aurore pt-3">Snorkeling sur la plage abandonnée</h4>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Discover;
