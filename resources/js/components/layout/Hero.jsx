import { useTranslation } from "react-i18next";
import { IconStarFilled } from "@tabler/icons-react";
import classes from "./Hero.module.css";

const banners = import.meta.glob("../../assets/img/banners/*", {
  eager: true,
  import: "default",
});

/**
 * Bannière de la page : image plein cadre, titre et accroche (helpers/pages.js).
 */
const Hero = ({ page }) => {
  const { t } = useTranslation();

  return (
    <section
      className={classes.hero}
      data-large={page.large || undefined}
      style={{
        backgroundImage: `url(${banners[`../../assets/img/banners/${page.image}`]})`,
      }}
    >
      <div className={classes.content}>
        {page.subtitle && <p className={classes.subtitle}>{t(page.subtitle)}</p>}
        <h1 className={classes.title}>{t(page.title)}</h1>
        {page.large && (
          <div
            className={classes.stars}
            role="img"
            aria-label={t("a11y.stars", { count: 4 })}
          >
            {[1, 2, 3, 4].map((star) => (
              <IconStarFilled key={star} size={16} />
            ))}
          </div>
        )}
        {page.description && (
          <p className={`${classes.description} handwritten`}>
            {t(page.description)}
          </p>
        )}
      </div>
    </section>
  );
};

export default Hero;
