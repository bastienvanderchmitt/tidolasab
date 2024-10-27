import beach_palm from "../../../assets/img/discover/beach_palm.png";
import { Parallax } from "react-parallax";
import { Col, Container, Row } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeartCircleCheck, faStar } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";

const Reviews = () => {
  const { t } = useTranslation();

  return (
    <>
      <Parallax
        blur={2}
        bgImage={beach_palm}
        bgImageAlt="the beach_palm"
        strength={200}
        className="text-white text-center p-5"
      >
        <Container className="review">
          <Row className="p-sm-4 text-center">
            <Col className="review-content align-self-center">
              <FontAwesomeIcon
                icon={faHeartCircleCheck}
                className="review-icon"
              />
              <h4 className="title-review pt-2">{t("reviews.title")}</h4>
              <p className="quote">{t("reviews.quote")}</p>
              <p className="quote-user">{t("reviews.quote_user")}</p>
              <div>
                {[1, 2, 3, 4, 5].map((_, key) => (
                  <FontAwesomeIcon
                    icon={faStar}
                    className="review-star"
                    key={key}
                  />
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
