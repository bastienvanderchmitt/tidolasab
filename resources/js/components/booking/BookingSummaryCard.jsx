import { Divider, Group, Paper, Stack, Text } from "@mantine/core";
import { IconCalendarEvent, IconUsers } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import { useBookingContext } from "../../contexts/BookingContext";
import PriceSummary from "./PriceSummary";
import { formatDate } from "./format";
import cover from "../../assets/img/room/view_2.webp";
import classes from "./Booking.module.css";

const Moment = ({ label, date, time }) => (
  <div className={classes.moment}>
    <Text className={classes.momentLabel}>{label}</Text>
    <Text fw={500}>{date || "—"}</Text>
    <Text size="xs" c="dimmed">
      {time}
    </Text>
  </div>
);

/**
 * Récapitulatif collant de la page de réservation (desktop).
 */
const BookingSummaryCard = () => {
  const { t } = useTranslation();
  const { checkIn, checkOut, adults, quote } = useBookingContext();

  return (
    <Paper className={classes.summary}>
      <img src={cover} alt="" className={classes.summaryCover} />
      <Stack gap="md" p="lg">
        <div>
          <Text className="eyebrow">{t("accommodation.breadcrumb")}</Text>
          <Text className={classes.summaryTitle}>Case Ti' Dola Sab</Text>
        </div>

        <div className={classes.moments}>
          <Moment
            label={t("stay.arrival")}
            date={formatDate(checkIn, { weekday: "short" })}
            time={t("stay.arrival_time")}
          />
          <Moment
            label={t("stay.departure")}
            date={formatDate(checkOut, { weekday: "short" })}
            time={t("stay.departure_time")}
          />
        </div>

        <Group gap="lg" c="dimmed">
          <Group gap={6}>
            <IconCalendarEvent size={16} />
            <Text size="sm">
              {quote?.nights
                ? t("quick.nights", { count: quote.nights })
                : t("stay.no_dates")}
            </Text>
          </Group>
          <Group gap={6}>
            <IconUsers size={16} />
            <Text size="sm">{t("booking.adults_count", { count: adults })}</Text>
          </Group>
        </Group>

        {quote?.nights ? (
          <>
            <Divider />
            <PriceSummary withDeposit />
          </>
        ) : null}
      </Stack>
    </Paper>
  );
};

export default BookingSummaryCard;
