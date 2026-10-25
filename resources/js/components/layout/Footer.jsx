import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ActionIcon, Container, Group, SimpleGrid, Stack, Text } from "@mantine/core";
import {
  IconBrandFacebook,
  IconBrandInstagram,
  IconMail,
  IconMapPin,
  IconPhone,
} from "@tabler/icons-react";
import logo from "../../assets/img/logo_full.png";
import cgu from "../../assets/pdf/CGU.pdf";
import classes from "./Footer.module.css";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className={classes.footer}>
      <Container size="lg">
        <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing={40}>
          <Stack gap="sm">
            <Group gap="sm">
              <img src={logo} alt="" width={52} height={52} />
              <span className={classes.brand}>Ti' Dola Sab</span>
            </Group>
            <Text size="sm" c="dimmed" className={classes.muted}>
              {t("pages.home.title")}
            </Text>
          </Stack>

          <Stack gap="xs">
            <h3 className={classes.title}>{t("footer.contact")}</h3>
            <a href="tel:0690648904" className={classes.line}>
              <IconPhone size={16} /> 06 90 64 89 04
            </a>
            <a href="mailto:tidolasab@gmail.com" className={classes.line}>
              <IconMail size={16} /> tidolasab@gmail.com
            </a>
            <span className={classes.line}>
              <IconMapPin size={16} /> Morne Lolo, 97112 Grand-Bourg
            </span>
          </Stack>

          <Stack gap="xs">
            <h3 className={classes.title}>{t("footer.discover")}</h3>
            <Link to="/booking" className={classes.line}>
              {t("menu.booking")}
            </Link>
            <Link to="/activities" className={classes.line}>
              {t("menu.activities")}
            </Link>
            <Link to="/photos" className={classes.line}>
              {t("menu.photos")}
            </Link>
            <Link to="/story" className={classes.line}>
              {t("menu.history")}
            </Link>
          </Stack>

          <Stack gap="xs">
            <h3 className={classes.title}>{t("footer.social")}</h3>
            <Group gap="sm">
              <ActionIcon
                component="a"
                href="https://www.facebook.com/profile.php?id=61557470872317"
                target="_blank"
                rel="noreferrer"
                variant="light"
                color="sable"
                size="lg"
                radius="xl"
                aria-label="Facebook"
              >
                <IconBrandFacebook size={20} />
              </ActionIcon>
              <ActionIcon
                component="a"
                href="https://www.instagram.com/tidolasab?igsh=bHZnZTQ0OXRhNjRz"
                target="_blank"
                rel="noreferrer"
                variant="light"
                color="sable"
                size="lg"
                radius="xl"
                aria-label="Instagram"
              >
                <IconBrandInstagram size={20} />
              </ActionIcon>
            </Group>
          </Stack>
        </SimpleGrid>

        <div className={classes.bottom}>
          <span>© {new Date().getFullYear()} Ti' Dola Sab</span>
          <Group gap="lg">
            <Link to="/privacy">{t("footer.privacy")}</Link>
            <a href={cgu} download>
              {t("footer.cgu")}
            </a>
          </Group>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
