import { Container, SimpleGrid } from "@mantine/core";
import { IconQuote, IconStarFilled } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import beach_palm from "../../../assets/img/discover/beach_palm.webp";
import Reveal from "../../common/Reveal";
import classes from "./Home.module.css";

const Reviews = () => {
  const { t } = useTranslation();

  return (
    <section
      className={`section ${classes.reviews}`}
      style={{ backgroundImage: `url(${beach_palm})` }}
    >
      <Container size="lg">
        <Reveal component="p" className={`${classes.reviewsTitle} handwritten`}>
          {t("reviews.title")}
        </Reveal>
        <SimpleGrid cols={{ base: 1, md: 3 }} spacing="lg">
          {[1, 2, 3].map((i) => (
            <Reveal component="figure" key={i} index={i} className={classes.review}>
              <IconQuote size={28} className={classes.quoteIcon} />
              <blockquote>{t("reviews.quote_" + i)}</blockquote>
              <figcaption>
                <span>{t("reviews.quote_user_" + i)}</span>
                <span className={classes.stars}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <IconStarFilled key={star} size={13} />
                  ))}
                </span>
              </figcaption>
            </Reveal>
          ))}
        </SimpleGrid>
      </Container>
    </section>
  );
};

export default Reviews;
