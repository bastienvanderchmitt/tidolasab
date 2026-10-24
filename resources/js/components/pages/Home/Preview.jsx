import { Col, Container, Row } from "reactstrap";
import Slider from "react-slick";
import palm_tree from "../../../assets/img/icons/palm_tree.png";
import caroussel_1 from "../../../assets/img/caroussel/caroussel_1.jpeg";
import caroussel_2 from "../../../assets/img/caroussel/caroussel_2.jpeg";
import caroussel_3 from "../../../assets/img/caroussel/caroussel_3.jpeg";
import caroussel_4 from "../../../assets/img/caroussel/caroussel_4.jpeg";
import caroussel_5 from "../../../assets/img/caroussel/caroussel_5.jpeg";
import caroussel_6 from "../../../assets/img/caroussel/caroussel_6.jpeg";
import caroussel_7 from "../../../assets/img/caroussel/caroussel_7.jpeg";
import { useTranslation } from "react-i18next";

const Preview = () => {
  const { t } = useTranslation();

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="preview">
      <Container>
        <Row className="p-4 text-center preview">
          <Col className="preview-content align-self-center">
            <img className="palm-tree" alt="palm_tree" src={palm_tree} />
            <h4 className="title-4 pt-4">{t("preview.welcome")}</h4>
            <h4 className="title-2 pt-2">{t("preview.title")}</h4>
            <p className="pt-5">{t("preview.subtitle")}</p>
          </Col>
        </Row>
        <Row>
          <Col>
            <div className="slider-container">
              <Slider {...settings}>
                <div className="slick-image-container">
                  <img src={caroussel_1} alt="caroussel_1" />
                </div>
                <div className="slick-image-container">
                  <img src={caroussel_2} alt="caroussel_2" />
                </div>
                <div className="slick-image-container">
                  <img src={caroussel_3} alt="caroussel_3" />
                </div>
                <div className="slick-image-container">
                  <img src={caroussel_4} alt="caroussel_4" />
                </div>
                <div className="slick-image-container">
                  <img src={caroussel_5} alt="caroussel_5" />
                </div>
                <div className="slick-image-container">
                  <img src={caroussel_6} alt="caroussel_6" />
                </div>
                <div className="slick-image-container">
                  <img src={caroussel_7} alt="caroussel_7" />
                </div>
              </Slider>
            </div>
            <h4 className="aurore pt-3">{t("preview.description")}</h4>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Preview;
