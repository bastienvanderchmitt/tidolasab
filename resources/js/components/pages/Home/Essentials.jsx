import { Container } from "@mantine/core";
import {
  IconAirConditioning,
  IconBeach,
  IconGlassCocktail,
  IconPlane,
  IconPool,
  IconToolsKitchen2,
  IconWashMachine,
  IconWifi,
} from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import essentials_1 from "../../../assets/img/room/room_6.webp";
import essentials_2 from "../../../assets/img/room/view_3.webp";
import SectionTitle from "../../common/SectionTitle";
import Reveal from "../../common/Reveal";
import { responsive } from "../../../helpers/responsiveImage";
import classes from "./Home.module.css";

// Ce que font Isabelle et Frank pour leurs hôtes : la raison de réserver ici
const services = [
  { icon: IconPlane, title: "airport_title", text: "airport_description" },
  { icon: IconGlassCocktail, title: "rhum_title", text: "rhum_description" },
  { icon: IconToolsKitchen2, title: "food_title", text: "food_description" },
  { icon: IconBeach, title: "stuff_title", text: "stuff_description" },
];

// Équipements de la case, déjà vus en pastilles plus haut : liste compacte
const included = [
  { icon: IconPool, title: "pool_title", text: "pool_description" },
  { icon: IconAirConditioning, title: "clim" },
  { icon: IconWifi, title: "wifi_title", text: "wifi_description" },
  { icon: IconWashMachine, title: "clean_title", text: "clean_description" },
];

const Essentials = () => {
  const { t } = useTranslation();

  return (
    <section className="section">
      <Container size="lg">
        <div className={classes.essentials}>
          <Reveal className={classes.essentialsPhoto}>
            <img
              src={essentials_1}
              {...responsive(essentials_1, "(max-width: 62em) 100vw, 440px")}
              alt=""
              loading="lazy"
            />
          </Reveal>

          <div>
            <SectionTitle
              eyebrow={t("essentials.title")}
              title={t("essentials.subtitle")}
            />

            <h3 className={classes.essentialsGroup}>{t("essentials.hosts_title")}</h3>
            <ul className={classes.services}>
              {services.map(({ icon: Icon, title, text }, index) => (
                <Reveal
                  component="li"
                  key={title}
                  index={index % 2}
                  className={classes.service}
                >
                  <span className={classes.essentialIcon}>
                    <Icon size={22} stroke={1.6} />
                  </span>
                  <div>
                    <h4>{t(`essentials.${title}`)}</h4>
                    <p>{t(`essentials.${text}`)}</p>
                  </div>
                </Reveal>
              ))}
            </ul>

            <Reveal>
              <h3 className={classes.essentialsGroup}>
                {t("essentials.included_title")}
              </h3>
              <ul className={classes.included}>
                {included.map(({ icon: Icon, title, text }) => (
                  <li key={title}>
                    <Icon size={22} stroke={1.9} />
                    <div>
                      <strong>{t(`essentials.${title}`)}</strong>
                      {text && <p>{t(`essentials.${text}`)}</p>}
                    </div>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>

        {/* La case vue du ciel, dans son jardin : la légende manuscrite s'y pose */}
        <Reveal className={classes.aerial}>
          <img
            src={essentials_2}
            {...responsive(essentials_2, "(max-width: 75em) 100vw, 1140px")}
            alt=""
            loading="lazy"
          />
          <p className="handwritten">{t("essentials.photo_title")}</p>
        </Reveal>
      </Container>
    </section>
  );
};

export default Essentials;
