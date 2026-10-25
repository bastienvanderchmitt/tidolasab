import { useRef } from "react";
import { ActionIcon, Container } from "@mantine/core";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import palm_tree from "../../../assets/img/icons/palm_tree.png";
import SectionTitle from "../../common/SectionTitle";
import classes from "./Home.module.css";

const photos = import.meta.glob("../../../assets/img/caroussel/*.webp", {
  eager: true,
  import: "default",
});

const Preview = () => {
  const { t } = useTranslation();
  const stripRef = useRef(null);

  // Défile d'une photo, la molette verticale ne faisant pas défiler en largeur
  const slide = (direction) => {
    const strip = stripRef.current;
    if (!strip) return;
    const edge = parseFloat(getComputedStyle(strip).paddingLeft);
    const starts = [...strip.querySelectorAll("img")].map(
      (photo) => photo.offsetLeft - strip.offsetLeft - edge,
    );
    // Photo actuellement alignée à gauche, puis la suivante ou la précédente
    const current = starts.findIndex((start) => start >= strip.scrollLeft - 2);
    const target = Math.min(
      Math.max(current + direction, 0),
      starts.length - 1,
    );
    strip.scrollTo({ left: starts[target], behavior: "smooth" });
  };

  return (
    <section className={`section ${classes.preview}`}>
      <Container size="lg">
        <img className={classes.palm} alt="" src={palm_tree} />
        <SectionTitle
          align="center"
          eyebrow={t("preview.welcome")}
          title={t("preview.title")}
        >
          <p>{t("preview.subtitle")}</p>
        </SectionTitle>
      </Container>

      <div className={classes.slider}>
        {/* Défilement horizontal natif, aimanté sur chaque photo */}
        <div ref={stripRef} className={classes.strip}>
          {Object.values(photos).map((photo) => (
            <img key={photo} src={photo} alt="" loading="lazy" />
          ))}
        </div>
        <ActionIcon
          className={classes.prev}
          onClick={() => slide(-1)}
          variant="white"
          radius="xl"
          size="xl"
          aria-label="Photo précédente"
        >
          <IconChevronLeft />
        </ActionIcon>
        <ActionIcon
          className={classes.next}
          onClick={() => slide(1)}
          variant="white"
          radius="xl"
          size="xl"
          aria-label="Photo suivante"
        >
          <IconChevronRight />
        </ActionIcon>
      </div>

      <Container size="lg">
        <p className={`${classes.caption} handwritten`}>
          {t("preview.description")}
        </p>
      </Container>
    </section>
  );
};

export default Preview;
