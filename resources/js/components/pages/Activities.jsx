import { Container, SimpleGrid, Text } from "@mantine/core";
import { IconMapPin } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import location_23 from "../../assets/img/locations/location_23.webp";
import location_9 from "../../assets/img/locations/location_9.webp";
import location_20 from "../../assets/img/locations/location_20.webp";
import location_25 from "../../assets/img/locations/location_25.webp";
import location_24 from "../../assets/img/locations/location_24.webp";
import location_3_square from "../../assets/img/locations/location_3_square.webp";
import location_4_square from "../../assets/img/locations/location_4_square.webp";
import location_6_square from "../../assets/img/locations/location_6_square.webp";
import location_10_square from "../../assets/img/locations/location_10_square.webp";
import SectionTitle from "../common/SectionTitle";
import classes from "./Pages.module.css";

const photos = [
  location_20,
  location_10_square,
  location_6_square,
  location_4_square,
  location_25,
  location_9,
  location_23,
  location_3_square,
  location_24,
];

const Activities = () => {
  const { t } = useTranslation();

  return (
    <Container size="lg" className="section">
      <SectionTitle
        align="center"
        eyebrow={t("activities.title")}
        title={t("activities.subtitle")}
      >
        <p>{t("activities.description")}</p>
        <p>{t("activities.sub_description")}</p>
      </SectionTitle>

      <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="xl">
        {photos.map((photo, index) => {
          const key = `activities.activity_${index + 1}`;
          return (
            <article key={key} className={classes.activity}>
              <div className={classes.activityPhoto}>
                <img src={photo} alt="" loading="lazy" />
              </div>
              <div className={classes.activityBody}>
                <h3>{t(`${key}.title`)}</h3>
                <Text size="sm" c="dimmed" lh={1.65}>
                  {t(`${key}.description`)}
                </Text>
                <Text size="sm" className={classes.location}>
                  <IconMapPin size={16} /> {t(`${key}.location`)}
                </Text>
              </div>
            </article>
          );
        })}
      </SimpleGrid>
    </Container>
  );
};

export default Activities;
