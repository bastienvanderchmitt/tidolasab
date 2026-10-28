import { useEffect, useRef, useState } from "react";
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
  const [current, setCurrent] = useState(0);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const list = Object.values(photos);

  // Positions de défilement qui alignent chaque photo sur la marge gauche
  const starts = () => {
    const strip = stripRef.current;
    const edge = parseFloat(getComputedStyle(strip).scrollPaddingLeft) || 0;
    return [...strip.querySelectorAll("img")].map(
      (photo) => photo.offsetLeft - edge,
    );
  };

  const onScroll = () => {
    const strip = stripRef.current;
    const max = strip.scrollWidth - strip.clientWidth;
    setAtStart(strip.scrollLeft <= 2);
    setAtEnd(strip.scrollLeft >= max - 2);
    // En fin de course, la dernière photo est considérée comme active
    const positions = starts();
    const index =
      strip.scrollLeft >= max - 2
        ? positions.length - 1
        : positions.reduce(
            (best, start, i) =>
              Math.abs(start - strip.scrollLeft) <
              Math.abs(positions[best] - strip.scrollLeft)
                ? i
                : best,
            0,
          );
    setCurrent(index);
  };

  const goTo = (index) => {
    const positions = starts();
    const target = Math.min(Math.max(index, 0), positions.length - 1);
    stripRef.current.scrollTo({ left: positions[target], behavior: "smooth" });
  };

  // Les flèches du clavier passent d'une photo à l'autre
  const onKeyDown = (event) => {
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      goTo(current + (event.key === "ArrowRight" ? 1 : -1));
    }
  };

  useEffect(() => {
    onScroll();
    window.addEventListener("resize", onScroll);
    return () => window.removeEventListener("resize", onScroll);
  }, []);

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

      <Container size="lg" className={classes.slider}>
        {/* Défilement horizontal natif, aimanté sur chaque photo */}
        <div
          ref={stripRef}
          className={classes.strip}
          onScroll={onScroll}
          onKeyDown={onKeyDown}
          tabIndex={0}
          aria-label={t("preview.title")}
        >
          {list.map((photo) => (
            <img key={photo} src={photo} alt="" loading="lazy" />
          ))}
        </div>
        <ActionIcon
          className={classes.prev}
          onClick={() => goTo(current - 1)}
          disabled={atStart}
          variant="white"
          radius="xl"
          size="xl"
          aria-label="Photo précédente"
        >
          <IconChevronLeft />
        </ActionIcon>
        <ActionIcon
          className={classes.next}
          onClick={() => goTo(current + 1)}
          disabled={atEnd}
          variant="white"
          radius="xl"
          size="xl"
          aria-label="Photo suivante"
        >
          <IconChevronRight />
        </ActionIcon>
      </Container>

      <div className={classes.dots}>
        {list.map((photo, index) => (
          <button
            key={photo}
            type="button"
            className={classes.dot}
            data-active={index === current || undefined}
            onClick={() => goTo(index)}
            aria-label={`Photo ${index + 1}`}
          />
        ))}
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
