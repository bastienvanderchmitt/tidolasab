import { useLayoutContext } from "../../contexts/LayoutContext";
import { useCallback, useEffect, useState } from "react";
import { pages } from "../../helpers/pages";
import { Col, Container, Row } from "reactstrap";
import Gallery from "react-photo-gallery";
import Carousel, { Modal, ModalGateway } from "react-images";

const Photos = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const [viewerIsOpen, setViewerIsOpen] = useState(false);

  const { setHeader } = useLayoutContext();

  useEffect(() => {
    setHeader(pages.photos);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const images = [
    {
      src: "https://picsum.photos/800/599?random=1",
      width: 4,
      height: 3,
    },
    {
      src: "https://picsum.photos/800/799?random=2",
      width: 1,
      height: 1,
    },
    {
      src: "https://picsum.photos/600/799?random=3",
      width: 3,
      height: 4,
    },
    {
      src: "https://picsum.photos/600/799?random=4",
      width: 3,
      height: 4,
    },
    {
      src: "https://picsum.photos/600/799?random=14",
      width: 3,
      height: 4,
    },
    {
      src: "https://picsum.photos/800/599?random=5",
      width: 4,
      height: 3,
    },
    {
      src: "https://picsum.photos/600/799?random=6",
      width: 3,
      height: 4,
    },
    {
      src: "https://picsum.photos/800/599?random=7",
      width: 4,
      height: 3,
    },
    {
      src: "https://picsum.photos/800/599?random=8",
      width: 4,
      height: 3,
    },
    {
      src: "https://picsum.photos/800/599?random=9",
      width: 4,
      height: 3,
    },
    {
      src: "https://picsum.photos/800/799?random=10",
      width: 1,
      height: 1,
    },
    {
      src: "https://picsum.photos/600/799?random=11",
      width: 3,
      height: 4,
    },
    {
      src: "https://picsum.photos/600/799?random=12",
      width: 3,
      height: 4,
    },
    {
      src: "https://picsum.photos/600/799?random=13",
      width: 3,
      height: 4,
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
    <Container className="photos">
      <Row className="p-4 m-lg-4 photos-header">
        <Col className="text-center">
          <h4 className="title-4 pt-4">NOS PLUS BEAUX CLICHÉS</h4>
          <h4 className="title-2 pt-2">
            Découvrez le paradis qui vous attends
          </h4>
          <p className="pt-3 m-auto">
            Que ce soit à la plage ou dans les terres, chaque moment est unique
            à Marie-Galante. Voici un aperçu de ce que vous pourrez observer
            lors de votre séjour chez nous.
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
