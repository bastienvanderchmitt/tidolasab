import beach_palm from "../../../assets/img/discover/beach_palm.png";
import { Parallax } from "react-parallax";
import { Col, Container, Row } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeartCircleCheck, faStar } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";
import Slider from "react-slick";

const Reviews = () => {
  const { t } = useTranslation();

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: null,
    prevArrow: null,
  };

  return (
    <>
      <Parallax
        blur={2}
        bgImage={beach_palm}
        bgImageAlt="the beach_palm"
        strength={200}
        className="text-white text-center p-sm-5"
      >
        <Container className="review">
          <Slider {...settings}>
            {[1, 2, 3].map((i) => (
              <div className="slick-image-container" key={i}>
                <Row className="p-sm-4 text-center">
                  <Col className="review-content align-self-center">
                    <FontAwesomeIcon
                      icon={faHeartCircleCheck}
                      className="review-icon"
                    />
                    <h4 className="title-review pt-2">{t("reviews.title")}</h4>
                    <p className="quote">{t("reviews.quote_" + i)}</p>
                    <p className="quote-user">{t("reviews.quote_user_" + i)}</p>
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
              </div>
            ))}
          </Slider>
        </Container>
      </Parallax>
    </>
  );
};

export default Reviews;
