import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button, Container, Paper, Text } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useMediaQuery } from "@mantine/hooks";
import { IconCalendarEvent, IconSearch } from "@tabler/icons-react";
import { useBookingContext } from "../../contexts/BookingContext";
import GuestsInput from "./GuestsInput";
import useStayPicker from "./useStayPicker";
import { formatPrice } from "./format";
import { bookingSearch } from "./bookingSearch";
import { ratesFor } from "../../helpers/pricing";
import classes from "./QuickBookingBar.module.css";

/**
 * Barre de réservation rapide, sous la bannière de chaque page.
 * Elle mène à /booking avec le séjour choisi dans l'URL.
 */
const QuickBookingBar = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isDesktop = useMediaQuery("(min-width: 62em)");
  const { checkIn, checkOut, adults, quote, pricing, isLoadingBookings } =
    useBookingContext();
  const stayPicker = useStayPicker();

  const submit = (event) => {
    event.preventDefault();
    navigate(`/booking${bookingSearch(checkIn, checkOut, adults)}`);
  };

  return (
    <Container size="lg" className={classes.wrapper}>
      <Paper component="form" onSubmit={submit} className={classes.bar}>
        <div className={classes.field}>
          <Text component="label" className={classes.label}>
            {t("quick.stay")}
          </Text>
          <DatePickerInput
            {...stayPicker}
            variant="unstyled"
            size="md"
            placeholder={t("quick.stay_placeholder")}
            valueFormat="D MMM YYYY"
            labelSeparator="→"
            numberOfColumns={isDesktop ? 2 : 1}
            leftSection={<IconCalendarEvent size={18} />}
            leftSectionPointerEvents="none"
            disabled={isLoadingBookings}
            popoverProps={{ shadow: "lg", radius: "lg" }}
            className={classes.input}
          />
        </div>

        <div className={classes.field}>
          <Text component="span" className={classes.label}>
            {t("quick.guests")}
          </Text>
          <GuestsInput />
        </div>

        <div className={classes.field} data-summary>
          {quote?.nights ? (
            <>
              <Text component="span" className={classes.label}>
                {t("quick.nights", { count: quote.nights })}
              </Text>
              <Text fw={600} size="lg">
                {formatPrice(quote.total)}
              </Text>
            </>
          ) : (
            pricing && (
              <Text size="sm" c="dimmed">
                {t("quick.min_price", {
                  price: formatPrice(
                    ratesFor(pricing, new Date().getFullYear()).low,
                  ),
                })}
              </Text>
            )
          )}
        </div>

        <Button
          type="submit"
          size="md"
          leftSection={<IconSearch size={18} />}
          className={classes.submit}
        >
          {checkIn && checkOut ? t("common.booking") : t("quick.availability")}
        </Button>
      </Paper>
    </Container>
  );
};

export default QuickBookingBar;
