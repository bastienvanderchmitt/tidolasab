import { Col, Container, Row } from "reactstrap";
import Slider from "react-slick";
import palm_tree from "../../../assets/img/palm_tree.png";
import caroussel_1 from "../../../assets/img/preview/caroussel_1.jpg";
import caroussel_2 from "../../../assets/img/preview/caroussel_2.jpg";
import caroussel_3 from "../../../assets/img/preview/caroussel_3.jpg";
import caroussel_4 from "../../../assets/img/preview/caroussel_4.jpg";

const Preview = () => {
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
            <h4 className="title-4 pt-4">BIENVENUE A TI' DOLA SAB</h4>
            <h4 className="title-2 pt-2">
              Dans la plus belle île de Guadeloupe, au coeur des Caraïbes
            </h4>
            <p className="pt-5">
              Paysages, nature, culture il y a tant de choses à découvrir.
              Partez en randonnée, visitez un site historique, découvrez les
              saveurs locales, prélassez vous sur la plage… Suivez votre rythme
              et laissez vous porter par la douce chaleur des Caraïbes.
            </p>
          </Col>
        </Row>
        <Row>
          <Col>
            {/*<div className="slider-container animate__animated animate__fadeInRight animate__slow">*/}
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
              </Slider>
            </div>
            <h4 className="aurore pt-3">
              Inspiré de notre histoire, en pleine nature pour offrir une
              expérience de vie différente.
            </h4>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Preview;
