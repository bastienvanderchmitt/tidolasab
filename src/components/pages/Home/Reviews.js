import crick from "../../../assets/img/crick.jpg";
import { Parallax } from "react-parallax";
import { Col, Container, Row } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeartCircleCheck, faStar } from "@fortawesome/free-solid-svg-icons";

const Reviews = () => {
  return (
    <>
      <Parallax
        blur={2}
        bgImage={crick}
        bgImageAlt="the crick"
        strength={200}
        className="text-white text-center p-5"
      >
        <Container className="review">
          <Row className="p-4 text-center">
            <Col className="review-content align-self-center">
              <FontAwesomeIcon
                icon={faHeartCircleCheck}
                className="review-icon"
              />
              <h4 className="title-review pt-2">Nos clients racontent</h4>
              <p className="quote">
                “Everything here was great: the staff, the room layout, the
                property amenities with indoor pool, and the quality of the
                food. But the high point is the view from the mountains.”
              </p>
              <p className="quote-user">ANNA WILLIAMS – TRIPADVISOR</p>
              <div>
                {[1, 2, 3, 4, 5].map(() => (
                  <FontAwesomeIcon icon={faStar} className="review-star" />
                ))}
              </div>
            </Col>
          </Row>
        </Container>
      </Parallax>
    </>
  );
};

export default Reviews;
