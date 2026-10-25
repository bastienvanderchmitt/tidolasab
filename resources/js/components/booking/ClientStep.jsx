import { SimpleGrid, Stack, Text, TextInput } from "@mantine/core";
import { useTranslation } from "react-i18next";
import classes from "./Booking.module.css";

export const clientFields = [
  { name: "firstName", autoComplete: "given-name" },
  { name: "name", autoComplete: "family-name" },
  { name: "email", autoComplete: "email", type: "email" },
  { name: "phone", autoComplete: "tel", type: "tel" },
  { name: "address", autoComplete: "street-address", span: 2 },
  { name: "postalCode", autoComplete: "postal-code" },
  { name: "city", autoComplete: "address-level2" },
  { name: "country", autoComplete: "country-name" },
];

const ClientStep = ({ form }) => {
  const { t } = useTranslation();

  return (
    <Stack gap="lg">
      <div>
        <h2 className={classes.stepTitle}>{t("client.title")}</h2>
        <Text c="dimmed">{t("client.intro")}</Text>
      </div>
      <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
        {clientFields.map((field) => (
          <TextInput
            key={field.name}
            label={t(`client.${field.name}`)}
            type={field.type ?? "text"}
            autoComplete={field.autoComplete}
            withAsterisk
            style={field.span ? { gridColumn: "1 / -1" } : undefined}
            {...form.getInputProps(field.name)}
          />
        ))}
      </SimpleGrid>
    </Stack>
  );
};

export default ClientStep;
