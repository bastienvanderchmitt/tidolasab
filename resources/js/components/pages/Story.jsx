import { Badge, Container, Group, SimpleGrid, Stack, Text } from "@mantine/core";
import { useTranslation } from "react-i18next";
import franck_isa from "../../assets/img/story/franck_isa.webp";
import SectionTitle from "../common/SectionTitle";
import classes from "./Pages.module.css";

const Host = ({ name, roles }) => (
  <Stack gap="xs">
    <Text className="handwritten" fz={28} c="lagon.8">
      {name}
    </Text>
    <Group gap="xs">
      {roles.map((role) => (
        <Badge key={role} size="lg" variant="light" color="sable" c="sable.9" radius="xl" tt="none">
          {role}
        </Badge>
      ))}
    </Group>
  </Stack>
);

const Story = () => {
  const { t } = useTranslation();

  return (
    <Container size="lg" className="section">
      <SimpleGrid cols={{ base: 1, md: 2 }} spacing={64} className={classes.center}>
        <img
          className={classes.portrait}
          src={franck_isa}
          alt="Franck & Isabelle"
        />
        <div>
          <SectionTitle eyebrow={t("history.title")} title={t("history.subtitle")}>
            <p>{t("history.description_1")}</p>
            <p>{t("history.description_2")}</p>
            <p>{t("history.description_3")}</p>
          </SectionTitle>
          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
            <Host
              name="Franck"
              roles={[t("history.maintenance"), t("history.rhum")]}
            />
            <Host
              name="Isabelle"
              roles={[
                t("history.reception"),
                t("history.bookings"),
                t("history.communication"),
              ]}
            />
          </SimpleGrid>
        </div>
      </SimpleGrid>
    </Container>
  );
};

export default Story;
