import {
  Anchor,
  Select,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { countryOptions } from "../../helpers/countries";
import { suggestEmail } from "../../helpers/emailSuggestion";
import classes from "./Booking.module.css";

export const clientFields = [
  { name: "firstName", autoComplete: "given-name" },
  { name: "name", autoComplete: "family-name" },
  { name: "email", autoComplete: "email", type: "email" },
  {
    name: "phone",
    autoComplete: "tel",
    type: "tel",
    placeholder: "+33 6 12 34 56 78",
  },
  { name: "address", autoComplete: "street-address", span: 2 },
  { name: "postalCode", autoComplete: "postal-code" },
  { name: "city", autoComplete: "address-level2" },
  { name: "country", autoComplete: "country-name" },
];

const ClientStep = ({ form }) => {
  const { t, i18n } = useTranslation();
  const countries = useMemo(
    () => countryOptions(i18n.language),
    [i18n.language],
  );
  const emailSuggestion = suggestEmail(form.values.email);

  return (
    <Stack gap="lg">
      <div>
        <h2 className={classes.stepTitle}>{t("client.title")}</h2>
        <Text c="dimmed">{t("client.intro")}</Text>
      </div>
      <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
        {clientFields.map((field) =>
          field.name === "country" ? (
            <Select
              key={field.name}
              label={t("client.country")}
              data={countries}
              searchable
              allowDeselect={false}
              withAsterisk
              nothingFoundMessage={t("client.country_not_found")}
              {...form.getInputProps("country")}
            />
          ) : field.name === "email" ? (
            <div key={field.name}>
              <TextInput
                label={t("client.email")}
                type="email"
                autoComplete={field.autoComplete}
                withAsterisk
                {...form.getInputProps("email")}
              />
              {/* Faute de frappe probable dans le domaine : correction en un clic */}
              {emailSuggestion && (
                <Text size="sm" mt={6} c="orange.8">
                  {t("client.email_suggestion")}{" "}
                  <Anchor
                    component="button"
                    type="button"
                    size="sm"
                    fw={600}
                    onClick={() => form.setFieldValue("email", emailSuggestion)}
                  >
                    {emailSuggestion}
                  </Anchor>{" "}
                  ?
                </Text>
              )}
            </div>
          ) : (
            <TextInput
              key={field.name}
              label={t(`client.${field.name}`)}
              type={field.type ?? "text"}
              autoComplete={field.autoComplete}
              placeholder={field.placeholder}
              withAsterisk
              style={field.span ? { gridColumn: "1 / -1" } : undefined}
              {...form.getInputProps(field.name)}
            />
          ),
        )}
      </SimpleGrid>
    </Stack>
  );
};

export default ClientStep;
