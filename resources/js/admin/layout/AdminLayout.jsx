import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  ActionIcon,
  AppShell,
  Avatar,
  Burger,
  Group,
  Menu,
  NavLink as MantineNavLink,
  Stack,
  Text,
  Tooltip,
  useComputedColorScheme,
  useMantineColorScheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconCalendarEvent,
  IconCash,
  IconChartBar,
  IconExternalLink,
  IconHome,
  IconLayoutDashboard,
  IconMail,
  IconLogout,
  IconMoon,
  IconSettings,
  IconSun,
  IconUserShield,
  IconUsers,
  IconBed,
} from "@tabler/icons-react";
import { useAuth } from "../auth/AuthContext";

const LINKS = [
  { to: "/", label: "Tableau de bord", icon: IconLayoutDashboard },
  { to: "/planning", label: "Planning", icon: IconCalendarEvent },
  { to: "/reservations", label: "Réservations", icon: IconBed },
  { to: "/clients", label: "Clients", icon: IconUsers },
  { to: "/paiements", label: "Paiements", icon: IconCash },
  { to: "/chiffre-affaires", label: "Chiffre d'affaires", icon: IconChartBar },
  { to: "/emails", label: "Emails", icon: IconMail },
  { to: "/reglages", label: "Réglages", icon: IconSettings },
  { to: "/administrateurs", label: "Administrateurs", icon: IconUserShield },
];

const ColorSchemeToggle = () => {
  const { setColorScheme } = useMantineColorScheme();
  const scheme = useComputedColorScheme("light");

  return (
    <Tooltip label={scheme === "dark" ? "Mode clair" : "Mode sombre"}>
      <ActionIcon
        variant="default"
        size="lg"
        aria-label="Changer de thème"
        onClick={() => setColorScheme(scheme === "dark" ? "light" : "dark")}
      >
        {scheme === "dark" ? <IconSun size={18} /> : <IconMoon size={18} />}
      </ActionIcon>
    </Tooltip>
  );
};

const AdminLayout = () => {
  const [opened, { toggle, close }] = useDisclosure();
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (to) =>
    to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 250, breakpoint: "sm", collapsed: { mobile: !opened } }}
      padding="lg"
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group gap="sm">
            <Burger
              opened={opened}
              onClick={toggle}
              hiddenFrom="sm"
              size="sm"
            />
            <Group gap={8}>
              <IconHome size={22} color="var(--mantine-color-lagon-7)" />
              <Text fw={700}>Ti' Dola Sab</Text>
              <Text c="dimmed" size="sm" visibleFrom="xs">
                administration
              </Text>
            </Group>
          </Group>

          <Group gap="xs">
            <Tooltip label="Voir le site">
              <ActionIcon
                component="a"
                href="/"
                target="_blank"
                variant="default"
                size="lg"
                aria-label="Voir le site"
              >
                <IconExternalLink size={18} />
              </ActionIcon>
            </Tooltip>
            <ColorSchemeToggle />
            <Menu position="bottom-end" withArrow>
              <Menu.Target>
                <ActionIcon
                  variant="subtle"
                  size="lg"
                  radius="xl"
                  aria-label="Mon compte"
                >
                  <Avatar color="lagon" radius="xl" size={32}>
                    {user?.name?.[0]}
                  </Avatar>
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Label>{user?.name}</Menu.Label>
                <Menu.Item
                  leftSection={<IconLogout size={16} />}
                  color="red"
                  onClick={async () => {
                    await logout();
                    navigate("/connexion");
                  }}
                >
                  Se déconnecter
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="sm">
        <Stack gap={4}>
          {LINKS.map(({ to, label, icon: Icon }) => (
            <MantineNavLink
              key={to}
              component={NavLink}
              to={to}
              label={label}
              active={isActive(to)}
              leftSection={<Icon size={18} stroke={1.6} />}
              onClick={close}
              style={{ borderRadius: "var(--mantine-radius-md)" }}
            />
          ))}
        </Stack>
      </AppShell.Navbar>

      <AppShell.Main bg="var(--mantine-color-body)">
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
};

export default AdminLayout;
