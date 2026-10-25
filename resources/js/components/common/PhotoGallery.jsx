import { useState } from "react";
import { ActionIcon, Modal } from "@mantine/core";
import { useHotkeys } from "@mantine/hooks";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import classes from "./PhotoGallery.module.css";

/**
 * Photos en colonnes, ou en mosaïque qui remplit toute la largeur (`mosaic`, 7 photos) ;
 * un clic ouvre la visionneuse (flèches du clavier actives).
 */
const PhotoGallery = ({ photos, columns = 3, mosaic = false }) => {
  const [current, setCurrent] = useState(null);
  const isOpen = current !== null;

  const move = (step) =>
    setCurrent((index) => (index + step + photos.length) % photos.length);

  useHotkeys([
    ["ArrowLeft", () => isOpen && move(-1)],
    ["ArrowRight", () => isOpen && move(1)],
  ]);

  return (
    <>
      <div
        className={mosaic ? classes.mosaic : classes.grid}
        style={{ "--columns": columns }}
      >
        {photos.map((photo, index) => (
          <button
            key={photo}
            type="button"
            className={classes.tile}
            onClick={() => setCurrent(index)}
          >
            <img src={photo} alt="" loading="lazy" />
          </button>
        ))}
      </div>

      <Modal
        opened={isOpen}
        onClose={() => setCurrent(null)}
        size="auto"
        padding={0}
        withCloseButton={false}
        classNames={{ content: classes.viewer }}
        overlayProps={{ backgroundOpacity: 0.85, blur: 4 }}
      >
        {isOpen && (
          <>
            <img src={photos[current]} alt="" className={classes.full} />
            <ActionIcon
              className={classes.prev}
              onClick={() => move(-1)}
              variant="white"
              radius="xl"
              size="xl"
              aria-label="Photo précédente"
            >
              <IconChevronLeft />
            </ActionIcon>
            <ActionIcon
              className={classes.next}
              onClick={() => move(1)}
              variant="white"
              radius="xl"
              size="xl"
              aria-label="Photo suivante"
            >
              <IconChevronRight />
            </ActionIcon>
          </>
        )}
      </Modal>
    </>
  );
};

export default PhotoGallery;
