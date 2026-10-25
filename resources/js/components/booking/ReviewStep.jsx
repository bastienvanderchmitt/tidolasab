import {
  Alert,
  Anchor,
  Box,
  Paper,
  SimpleGrid,
  Stack,
  Text,
} from "@mantine/core";
import { IconInfoCircle } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import { useBookingContext } from "../../contexts/BookingContext";
import PriceSummary from "./PriceSummary";
import VerificationPanel from "./VerificationPanel";
import { countryName } from "../../helpers/countries";
import { formatDate } from "./format";
import classes from "./Booking.module.css";

const Block = ({ title, onEdit, children }) => {
  const { t } = useTranslation();

  return (
    <Paper withBorder p="lg">
      <Text className={classes.blockTitle}>
        {title}
        <Anchor component="button" type="button" size="sm" onClick={onEdit}>
          {t("review.edit")}
        </Anchor>
      </Text>
      {children}
    </Paper>
  );
};

const ReviewStep = ({ form, goTo, verification, onCodeComplete }) => {
  const { t, i18n } = useTranslation();
  const { checkIn, checkOut, adults, quote } = useBookingContext();
  const client = form.values;

  return (
    <Stack gap="lg">
      <div>
        <h2 className={classes.stepTitle}>{t("review.title")}</h2>
        <Text c="dimmed">{t("review.intro")}</Text>
      </div>

      <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
        <Block title={t("review.stay")} onEdit={() => goTo(0)}>
          <Text>
            {formatDate(checkIn, { weekday: "short", year: "numeric" })} →{" "}
            {formatDate(checkOut, { weekday: "short", year: "numeric" })}
          </Text>
          <Text size="sm" c="dimmed">
            {t("quick.nights", { count: quote?.nights ?? 0 })} ·{" "}
            {t("booking.adults_count", { count: adults })}
          </Text>
        </Block>
        <Block title={t("review.contact")} onEdit={() => goTo(1)}>
          <Text>
            {client.firstName} {client.name}
          </Text>
          <Text size="sm" c="dimmed">
            {client.email} · {client.phone}
          </Text>
          <Text size="sm" c="dimmed">
            {client.address}, {client.postalCode} {client.city},{" "}
            {countryName(client.country, i18n.language)}
          </Text>
        </Block>
      </SimpleGrid>

      {/* En mobile, la carte récapitulative n'est pas affichée */}
      <Box hiddenFrom="md">
        <Paper withBorder p="lg">
          <PriceSummary withDeposit />
        </Paper>
      </Box>

      <Alert color="lagon" variant="light" icon={<IconInfoCircle size={18} />}>
        {t("booking.conditions")}
      </Alert>

      <VerificationPanel
        verification={verification}
        email={client.email}
        onComplete={onCodeComplete}
        onEditEmail={() => goTo(1)}
      />
    </Stack>
  );
};

export default ReviewStep;
