import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Burger, Button, Drawer, Group, Stack } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconCalendarEvent } from "@tabler/icons-react";
import logo from "../../assets/img/logo_full.png";
import LanguageSwitch from "./LanguageSwitch";
import classes from "./Header.module.css";

const links = [
  { to: "/", label: "menu.home" },
  { to: "/story", label: "menu.history" },
  { to: "/activities", label: "menu.activities" },
  { to: "/photos", label: "menu.photos" },
  { to: "/contact", label: "menu.contact" },
];

/**
 * En-tête fixe : transparent sur la bannière, il devient opaque au défilement.
 */
const Header = () => {
  const { t } = useTranslation();
  const [opened, { toggle, close }] = useDisclosure(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = links.map((link) => (
    <NavLink
      key={link.to}
      to={link.to}
      end
      onClick={close}
      className={({ isActive }) =>
        isActive ? `${classes.link} ${classes.active}` : classes.link
      }
    >
      {t(link.label)}
    </NavLink>
  ));

  const bookingButton = (
    <Button
      component={Link}
      to="/booking"
      onClick={close}
      leftSection={<IconCalendarEvent size={18} />}
    >
      {t("common.booking")}
    </Button>
  );

  return (
    <header
      className={classes.header}
      data-solid={scrolled || opened || undefined}
    >
      <div className={classes.inner}>
        <Link to="/" className={classes.brand} onClick={close}>
          <img src={logo} alt="" className={classes.logo} />
          <span className={classes.name}>Ti' Dola Sab</span>
        </Link>

        <Group gap="xl" visibleFrom="md" component="nav">
          {navLinks}
        </Group>

        <Group gap="sm" visibleFrom="md">
          <LanguageSwitch />
          {bookingButton}
        </Group>

        <Burger
          opened={opened}
          onClick={toggle}
          hiddenFrom="md"
          color={scrolled || opened ? "var(--tds-ink)" : "white"}
          aria-label={t("a11y.menu")}
        />
      </div>

      <Drawer
        opened={opened}
        onClose={close}
        position="right"
        size="80%"
        hiddenFrom="md"
        zIndex={300}
        title={<LanguageSwitch />}
      >
        <Stack gap="lg" className={classes.drawerNav}>
          {navLinks}
          {bookingButton}
        </Stack>
      </Drawer>
    </header>
  );
};

export default Header;
