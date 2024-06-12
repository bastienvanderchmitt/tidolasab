import Gallery from "react-photo-gallery";
import Carousel, { Modal, ModalGateway } from "react-images";
import { Container, Row } from "reactstrap";
import { useCallback, useState } from "react";
import room_1 from "../../../assets/img/room/room_1.jpeg";
import room_2 from "../../../assets/img/room/room_2.jpeg";
import room_3 from "../../../assets/img/room/room_3.jpeg";
import room_4 from "../../../assets/img/room/room_4.jpeg";
import room_5 from "../../../assets/img/room/room_5.jpeg";
import room_7 from "../../../assets/img/room/room_7.jpeg";
import view_1 from "../../../assets/img/room/view_1.jpeg";
import view_2 from "../../../assets/img/room/view_2.jpeg";

const RoomImages = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const [viewerIsOpen, setViewerIsOpen] = useState(false);

  const images = [
    {
      src: room_2,
      width: 3,
      height: 3,
    },
    {
      src: room_7,
      width: 3,
      height: 3,
    },
    {
      src: view_1,
      width: 2,
      height: 1,
    },
    {
      src: room_3,
      width: 3,
      height: 4,
    },
    {
      src: view_2,
      width: 4,
      height: 3,
    },
    {
      src: room_4,
      width: 3,
      height: 3,
    },
    {
      src: room_5,
      width: 2.5,
      height: 2,
    },
    {
      src: room_1,
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
    <div className="room-images">
      <Container>
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
    </div>
  );
};

export default RoomImages;
