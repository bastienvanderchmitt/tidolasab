import { Container, Paper, SimpleGrid, Stack, Text } from "@mantine/core";
import { IconMail, IconMapPin, IconPhone } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import banner from "../../assets/img/locations/location_11.webp";
import SectionTitle from "../common/SectionTitle";
import Reveal from "../common/Reveal";
import ContactForm from "./Contact/ContactForm";
import classes from "./Pages.module.css";

const Contact = () => {
  const { t } = useTranslation();

  return (
    <Container size="lg" className="section">
      <SimpleGrid cols={{ base: 1, md: 2 }} spacing={56}>
        <Stack gap="xl">
          <SectionTitle eyebrow={t("contact.contact")} title={t("contact.title")}>
            <p>{t("pages.contact.description")}</p>
          </SectionTitle>
          <Reveal component={Stack} gap="md">
            <a href="tel:0690648904" className={classes.contactLine}>
              <IconPhone size={20} /> 06 90 64 89 04
            </a>
            <a href="mailto:tidolasab@gmail.com" className={classes.contactLine}>
              <IconMail size={20} /> tidolasab@gmail.com
            </a>
            <span className={classes.contactLine}>
              <IconMapPin size={20} /> Morne Lolo, 97112 Grand-Bourg
            </span>
          </Reveal>
          <Reveal
            component="img"
            src={banner}
            alt=""
            className={classes.contactPhoto}
            loading="lazy"
          />
        </Stack>
        <Reveal
          component={Paper}
          index={1}
          p={{ base: "lg", sm: "xl" }}
          className={classes.formCard}
        >
          <Text className="eyebrow" mb="lg">
            {t("contact.form_title")}
          </Text>
          <ContactForm />
        </Reveal>
      </SimpleGrid>
    </Container>
  );
};

export default Contact;
