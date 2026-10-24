import { useCallback, useState } from "react";
import { Col, Container, Row } from "reactstrap";
import Gallery from "react-photo-gallery";
import Carousel, { Modal, ModalGateway } from "react-images";
import { useTranslation } from "react-i18next";

import location_1 from "../../assets/img/locations/location_1.webp";
import location_2 from "../../assets/img/locations/location_2.webp";
import location_3 from "../../assets/img/locations/location_3.webp";
import location_4 from "../../assets/img/locations/location_4.webp";
import location_5 from "../../assets/img/locations/location_5.webp";
import location_7 from "../../assets/img/locations/location_7.webp";
import location_9 from "../../assets/img/locations/location_9.webp";
import location_10 from "../../assets/img/locations/location_10.webp";
import location_11 from "../../assets/img/locations/location_11.webp";
import location_12 from "../../assets/img/locations/location_12.webp";
import location_14 from "../../assets/img/locations/location_14.webp";
import location_15 from "../../assets/img/locations/location_15.webp";
import location_16 from "../../assets/img/locations/location_16.webp";
import location_17 from "../../assets/img/locations/location_17.webp";
import location_20 from "../../assets/img/locations/location_20.webp";
import location_21 from "../../assets/img/locations/location_21.webp";
import location_22 from "../../assets/img/locations/location_22.webp";
import location_26 from "../../assets/img/locations/location_26.webp";
import location_27 from "../../assets/img/locations/location_27.webp";
import location_28 from "../../assets/img/locations/location_28.webp";
import location_29 from "../../assets/img/locations/location_29.webp";
import location_30 from "../../assets/img/locations/location_30.webp";
import location_31 from "../../assets/img/locations/location_31.webp";
import location_32 from "../../assets/img/locations/location_32.webp";
import location_33 from "../../assets/img/locations/location_33.webp";
import location_34 from "../../assets/img/locations/location_34.webp";
import location_35 from "../../assets/img/locations/location_35.webp";
import location_36 from "../../assets/img/locations/location_36.webp";
import location_37 from "../../assets/img/locations/location_37.webp";
import location_38 from "../../assets/img/locations/location_38.webp";
import location_39 from "../../assets/img/locations/location_39.webp";
import location_40 from "../../assets/img/locations/location_40.webp";
import location_41 from "../../assets/img/locations/location_41.webp";
import location_42 from "../../assets/img/locations/location_42.webp";
import location_43 from "../../assets/img/room/view_2.webp";
import location_44 from "../../assets/img/room/view_3.webp";
import room_1 from "../../assets/img/room/room_1.webp";
import room_2 from "../../assets/img/room/room_2.webp";
import room_4 from "../../assets/img/room/room_4.webp";
import room_5 from "../../assets/img/room/room_5.webp";
import room_7 from "../../assets/img/room/room_7.webp";
import location_45 from "../../assets/img/locations/location_45.webp";
import location_46 from "../../assets/img/locations/location_46.webp";

const Photos = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const [viewerIsOpen, setViewerIsOpen] = useState(false);

  const { t } = useTranslation();

  const images = [
    {
      src: location_26,
      width: 3,
      height: 2,
    },
    {
      src: location_14,
      width: 2,
      height: 2,
    },
    {
      src: location_32,
      width: 3,
      height: 4,
    },
    {
      src: location_31,
      width: 3,
      height: 2,
    },
    {
      src: location_28,
      width: 3,
      height: 4,
    },
    {
      src: location_41,
      width: 3,
      height: 2,
    },
    {
      src: location_27,
      width: 1,
      height: 1,
    },
    {
      src: location_29,
      width: 1,
      height: 1,
    },
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
      src: location_42,
      width: 3,
      height: 2,
    },
    {
      src: location_12,
      width: 3,
      height: 2,
    },
    {
      src: location_43,
      width: 4,
      height: 2,
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
      src: location_20,
      width: 3,
      height: 2,
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
      src: location_44,
      width: 4,
      height: 2,
    },
    {
      src: room_1,
      width: 1.5,
      height: 2,
    },
    {
      src: room_2,
      width: 2,
      height: 2,
    },
    {
      src: room_4,
      width: 2,
      height: 2,
    },
    {
      src: room_5,
      width: 3,
      height: 3,
    },
    {
      src: room_7,
      width: 4,
      height: 2,
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
      src: location_35,
      width: 3,
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
      src: location_5,
      width: 2,
      height: 2,
    },
    {
      src: location_21,
      width: 3,
      height: 2,
    },
    {
      src: location_30,
      width: 3,
      height: 2,
    },
    {
      src: location_33,
      width: 2,
      height: 2,
    },
    {
      src: location_34,
      width: 1,
      height: 1,
    },
    {
      src: location_36,
      width: 2,
      height: 2,
    },
    {
      src: location_40,
      width: 2,
      height: 2,
    },
    {
      src: location_37,
      width: 3,
      height: 2,
    },
    {
      src: location_39,
      width: 2,
      height: 1,
    },
    {
      src: location_38,
      width: 2,
      height: 2,
    },
    {
      src: location_45,
      width: 2,
      height: 2,
    },
    {
      src: location_46,
      width: 2,
      height: 2,
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
          <h4 className="title-4 pt-4">{t("photos.title")}</h4>
          <h4 className="title-2 pt-2">{t("photos.subtitle")}</h4>
          <p className="pt-3 m-auto">{t("photos.description")}</p>
          <p>{t("photos.sub_description")}</p>
        </Col>
      </Row>
      <Row className="p-4 photos-panel text-center">
        <Gallery
          // Les photos ne sont chargées qu'à l'approche de l'écran
          photos={images.map((photo) => ({ ...photo, loading: "lazy" }))}
          onClick={openLightbox}
        />
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
