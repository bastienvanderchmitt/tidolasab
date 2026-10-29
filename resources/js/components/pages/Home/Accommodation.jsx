import { Link } from "react-router-dom";
import { Button, Container, Group, SimpleGrid, Text } from "@mantine/core";
import { IconCalendarEvent, IconWheelchair } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import view_1 from "../../../assets/img/room/view_1.webp";
import view_2 from "../../../assets/img/room/view_2.webp";
import view_5 from "../../../assets/img/room/view_5.webp";
import SectionTitle from "../../common/SectionTitle";
import PhotoSlider from "../../common/PhotoSlider";
import Reveal from "../../common/Reveal";
import Assets from "./Assets";
import classes from "./Home.module.css";

const Accommodation = () => {
  const { t } = useTranslation();

  return (
    <section className={`section ${classes.highlighted}`}>
      <Container size="lg">
        <SectionTitle
          align="center"
          eyebrow={t("accommodation.title")}
          title={t("accommodation.subtitle")}
        >
          <p>{t("accommodation.subtitle_2")}</p>
        </SectionTitle>

        <SimpleGrid cols={{ base: 1, md: 2 }} spacing={56} className={classes.split}>
          <Reveal>
            <PhotoSlider
              photos={[view_1, view_2, view_5]}
              caption={t("accommodation.photo_link")}
            />
          </Reveal>
          <Reveal index={1}>
            <p className="eyebrow">{t("accommodation.breadcrumb")}</p>
            <h3 className={classes.cardTitle}>Case Ti' Dola Sab</h3>
            <Assets />
            <Group gap={8} c="dimmed" mt="md" wrap="nowrap" align="flex-start">
              <IconWheelchair size={18} style={{ flex: "none", marginTop: 2 }} />
              <Text size="sm" fs="italic">
                {t("accommodation.pmr")}
              </Text>
            </Group>
            <Text fw={500} size="lg" mt="lg">
              {t("accommodation.description")}
            </Text>
            <Button
              component={Link}
              to="/booking"
              size="md"
              mt="xl"
              leftSection={<IconCalendarEvent size={18} />}
            >
              {t("common.booking")}
            </Button>
          </Reveal>
        </SimpleGrid>
      </Container>
    </section>
  );
};

export default Accommodation;
