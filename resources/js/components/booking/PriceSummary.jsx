import { Divider, Group, Stack, Text } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useBookingContext } from "../../contexts/BookingContext";
import { formatPrice } from "./format";

const Line = ({ label, value, ...props }) => (
  <Group justify="space-between" wrap="nowrap" {...props}>
    <Text size="sm">{label}</Text>
    <Text size="sm">{value}</Text>
  </Group>
);

/**
 * Détail du prix indicatif (le serveur recalcule le montant à l'enregistrement).
 */
const PriceSummary = ({ withDeposit, quote: givenQuote }) => {
  const { t } = useTranslation();
  const { quote: currentQuote, pricing } = useBookingContext();
  const quote = givenQuote ?? currentQuote;

  if (!quote?.nights) return null;

  const deposit = (quote.total * (pricing?.deposit_percent ?? 50)) / 100;

  return (
    <Stack gap={8}>
      {quote.highSeasonNights > 0 && (
        <Line
          label={t("price.line", {
            price: formatPrice(quote.highSeasonPrice),
            count: quote.highSeasonNights,
          })}
          value={formatPrice(quote.highSeasonNights * quote.highSeasonPrice)}
        />
      )}
      {quote.lowSeasonNights > 0 && (
        <Line
          label={t("price.line_low", {
            price: formatPrice(quote.lowSeasonPrice),
            count: quote.lowSeasonNights,
          })}
          value={formatPrice(quote.lowSeasonNights * quote.lowSeasonPrice)}
        />
      )}
      <Line label={t("price.tax")} value={formatPrice(quote.touristTax)} />
      {quote.discount > 0 && (
        <Line
          label={t("price.discount")}
          value={`− ${formatPrice(quote.discount)}`}
          c="teal.8"
        />
      )}
      <Divider my={4} />
      <Group justify="space-between">
        <Text fw={600}>{t("price.total")}</Text>
        <Text fw={600} size="lg">
          {formatPrice(quote.total)}
        </Text>
      </Group>
      {withDeposit && (
        <Text size="xs" c="dimmed">
          {t("price.deposit", {
            percent: pricing?.deposit_percent ?? 50,
            amount: formatPrice(deposit),
          })}
        </Text>
      )}
    </Stack>
  );
};

export default PriceSummary;
