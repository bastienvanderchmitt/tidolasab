import { useCallback, useState } from "react";
import { Col, Container, Row } from "reactstrap";
import Gallery from "react-photo-gallery";
import Carousel, { Modal, ModalGateway } from "react-images";
import location_1 from "../../assets/img/locations/location_1.jpeg";
import location_2 from "../../assets/img/locations/location_2.jpeg";
import location_3 from "../../assets/img/locations/location_3.jpeg";
import location_4 from "../../assets/img/locations/location_4.jpeg";
import location_5 from "../../assets/img/locations/location_5.jpeg";
// import location_6 from "../../assets/img/locations/location_6.jpeg";
import location_7 from "../../assets/img/locations/location_7.jpeg";
// import location_8 from "../../assets/img/locations/location_8.jpeg";
import location_9 from "../../assets/img/locations/location_9.jpeg";
import location_10 from "../../assets/img/locations/location_10.jpeg";
import location_11 from "../../assets/img/locations/location_11.jpeg";
// import location_12 from "../../assets/img/locations/location_12.jpeg";
// import location_13 from "../../assets/img/locations/location_13.jpeg";
import location_14 from "../../assets/img/locations/location_14.jpeg";
import location_15 from "../../assets/img/locations/location_15.jpeg";
import location_16 from "../../assets/img/locations/location_16.jpeg";
import location_17 from "../../assets/img/locations/location_17.jpeg";
// import location_18 from "../../assets/img/locations/location_18.jpeg";
// import location_19 from "../../assets/img/locations/location_19.jpeg";
// import location_20 from "../../assets/img/locations/location_20.jpeg";
// import location_21 from "../../assets/img/locations/location_21.jpeg";
import location_22 from "../../assets/img/locations/location_22.jpeg";

const Photos = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const [viewerIsOpen, setViewerIsOpen] = useState(false);

  const images = [
    {
      src: location_1,
      width: 4,
      height: 3,
    },
    {
      src: location_2,
      width: 2,
      height: 1,
    },
    {
      src: location_3,
      width: 3,
      height: 4,
    },
    {
      src: location_7,
      width: 3,
      height: 3,
    },
    {
      src: location_10,
      width: 2.5,
      height: 2,
    },
    {
      src: location_9,
      width: 4,
      height: 3,
    },
    {
      src: location_22,
      width: 3,
      height: 3,
    },
    {
      src: location_4,
      width: 3,
      height: 2,
    },
    {
      src: location_11,
      width: 5,
      height: 3,
    },
    {
      src: location_17,
      width: 2,
      height: 2,
    },
    {
      src: location_5,
      width: 2,
      height: 2,
    },
    {
      src: location_16,
      width: 2,
      height: 1,
    },
    {
      src: location_15,
      width: 3,
      height: 2,
    },
    {
      src: location_14,
      width: 1,
      height: 1,
    },
  ];

  const openLightbox = useCallback((event, { photo, index }) => {
    setCurrentImage(index);
    setViewerIsOpen(true);
  }, []);

  const closeLightbox = () => {
    setCurrentImage(0);
    setViewerIsOpen(false);
  };

  return (
    <Container className="photos" style={{ paddingBottom: "100px" }}>
      <Row className="p-4 m-lg-4 photos-header">
        <Col className="text-center">
          <h4 className="title-4 pt-4">NOS PLUS BEAUX CLICHÉS</h4>
          <h4 className="title-2 pt-2">Découvrez le paradis qui vous attend</h4>
          <p className="pt-3 m-auto">
            Que ce soit à la plage ou dans les terres, chaque moment est unique
            à Marie-Galante.
          </p>
          <p>
            Voici un aperçu de ce que vous pourrez observer lors de votre séjour
            chez nous.
          </p>
        </Col>
      </Row>
      <Row className="p-4 photos-panel text-center">
        <Gallery photos={images} onClick={openLightbox} />
        <ModalGateway>
          {viewerIsOpen ? (
            <Modal onClose={closeLightbox}>
              <Carousel
                currentIndex={currentImage}
                views={images.map((x) => ({
                  ...x,
                  srcset: x.srcSet,
                  caption: x.title,
                }))}
              />
            </Modal>
          ) : null}
        </ModalGateway>
      </Row>
    </Container>
  );
};

export default Photos;
