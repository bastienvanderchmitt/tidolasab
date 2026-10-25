import { Container, SimpleGrid } from "@mantine/core";
import {
  IconAirConditioning,
  IconBeach,
  IconGlassCocktail,
  IconPlane,
  IconPool,
  IconSparkles,
  IconToolsKitchen2,
  IconWifi,
} from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import essentials_1 from "../../../assets/img/room/room_6.webp";
import essentials_2 from "../../../assets/img/room/view_3.webp";
import SectionTitle from "../../common/SectionTitle";
import classes from "./Home.module.css";

const essentials = [
  { icon: IconPlane, title: "airport_title", text: "airport_description" },
  { icon: IconBeach, title: "stuff_title", text: "stuff_description" },
  { icon: IconPool, title: "pool_title", text: "pool_description" },
  { icon: IconAirConditioning, title: "clim" },
  { icon: IconWifi, title: "wifi_title", text: "wifi_description" },
  { icon: IconGlassCocktail, title: "rhum_title", text: "rhum_description" },
  { icon: IconSparkles, title: "clean_title", text: "clean_description" },
  { icon: IconToolsKitchen2, title: "food_title", text: "food_description" },
];

const Essentials = () => {
  const { t } = useTranslation();

  return (
    <section className="section">
      <Container size="lg">
        <SimpleGrid cols={{ base: 1, md: 5 }} spacing={56}>
          <div className={classes.essentialsPhotos}>
            <img src={essentials_1} alt="" loading="lazy" />
            <img src={essentials_2} alt="" loading="lazy" />
            <p className="handwritten">{t("essentials.photo_title")}</p>
          </div>
          <div className={classes.essentialsList}>
            <SectionTitle
              eyebrow={t("essentials.title")}
              title={t("essentials.subtitle")}
            />
            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="xl" verticalSpacing="xl">
              {essentials.map(({ icon: Icon, title, text }) => (
                <div key={title} className={classes.essential}>
                  <span className={classes.essentialIcon}>
                    <Icon size={22} stroke={1.6} />
                  </span>
                  <div>
                    <h3>{t(`essentials.${title}`)}</h3>
                    {text && <p>{t(`essentials.${text}`)}</p>}
                  </div>
                </div>
              ))}
            </SimpleGrid>
          </div>
        </SimpleGrid>
      </Container>
    </section>
  );
};

export default Essentials;
