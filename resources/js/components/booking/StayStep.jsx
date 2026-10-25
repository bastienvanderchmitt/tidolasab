import { Alert, Group, Stack, Text } from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { useMediaQuery } from "@mantine/hooks";
import { IconAlertCircle, IconClock } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import { useBookingContext } from "../../contexts/BookingContext";
import GuestsInput from "./GuestsInput";
import useStayPicker from "./useStayPicker";
import { formatDate } from "./format";
import classes from "./Booking.module.css";

const StayStep = ({ error }) => {
  const { t } = useTranslation();
  const isDesktop = useMediaQuery("(min-width: 48em)");
  const { checkIn, checkOut, quote } = useBookingContext();
  const stayPicker = useStayPicker();

  const hint = !checkIn
    ? t("stay.pick_arrival")
    : !checkOut
      ? t("stay.pick_departure", { date: formatDate(checkIn, { weekday: "long" }) })
      : t("stay.selected", {
          count: quote?.nights ?? 0,
          from: formatDate(checkIn),
          to: formatDate(checkOut),
        });

  return (
    <Stack gap="lg">
      <div>
        <h2 className={classes.stepTitle}>{t("stay.title")}</h2>
        <Text c="dimmed" aria-live="polite">
          {hint}
        </Text>
      </div>

      <div className={classes.calendar}>
        <DatePicker
          {...stayPicker}
          numberOfColumns={isDesktop ? 2 : 1}
          size={isDesktop ? "md" : "sm"}
        />
      </div>

      <Group gap="lg" className={classes.legend}>
        <span>
          <i data-kind="selected" /> {t("stay.legend_selected")}
        </span>
        <span>
          <i data-kind="taken" /> {t("stay.legend_taken")}
        </span>
      </Group>

      {error && (
        <Alert color="orange" icon={<IconAlertCircle size={18} />}>
          {t(error.key, error.params)}
        </Alert>
      )}

      <Group justify="space-between" className={classes.guests}>
        <div>
          <Text fw={500}>{t("booking.adults")}</Text>
          <Text size="sm" c="dimmed">
            {t("booking.adults_age")}
          </Text>
        </div>
        <GuestsInput />
      </Group>

      <Group gap="xs" c="dimmed" wrap="nowrap" align="flex-start">
        <IconClock size={18} style={{ flexShrink: 0, marginTop: 2 }} />
        <Text size="sm">
          {t("stay.schedule")} {t("booking.christmas")}
        </Text>
      </Group>
    </Stack>
  );
};

export default StayStep;
