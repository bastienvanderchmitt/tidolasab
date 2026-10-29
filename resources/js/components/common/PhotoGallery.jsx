import { useState } from "react";
import { ActionIcon, Modal } from "@mantine/core";
import { useHotkeys } from "@mantine/hooks";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import { responsive } from "../../helpers/responsiveImage";
import Reveal from "./Reveal";
import classes from "./PhotoGallery.module.css";

/**
 * Photos en colonnes, ou en mosaïque qui remplit toute la largeur (`mosaic`, 7 photos) ;
 * un clic ouvre la visionneuse (flèches du clavier actives).
 */
const PhotoGallery = ({ photos, columns = 3, mosaic = false }) => {
  const { t } = useTranslation();
  const [current, setCurrent] = useState(null);
  const isOpen = current !== null;

  // Largeur affichée d'une vignette ; dans la mosaïque, la 1re, la 4e et la 5e
  // photo prennent deux colonnes
  const tileSizes = (index) => {
    if (!mosaic) return `(max-width: 48em) 50vw, ${Math.round(100 / columns)}vw`;
    return [0, 3, 4].includes(index)
      ? "(max-width: 48em) 100vw, 560px"
      : "(max-width: 48em) 50vw, 280px";
  };

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
          <Reveal
            component="button"
            key={photo}
            index={index % columns}
            type="button"
            className={classes.tile}
            onClick={() => setCurrent(index)}
            aria-label={t("a11y.enlarge_photo", { number: index + 1 })}
          >
            <img
              src={photo}
              {...responsive(photo, tileSizes(index))}
              alt=""
              loading="lazy"
            />
          </Reveal>
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
        transitionProps={{ transition: "pop", duration: 220, timingFunction: "var(--tds-ease-out)" }}
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
              aria-label={t("a11y.previous_photo")}
            >
              <IconChevronLeft />
            </ActionIcon>
            <ActionIcon
              className={classes.next}
              onClick={() => move(1)}
              variant="white"
              radius="xl"
              size="xl"
              aria-label={t("a11y.next_photo")}
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
