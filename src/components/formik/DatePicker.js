import React, { useMemo } from "react";
import Calendar from "@demark-pro/react-booking-calendar";
import { fr, enUS } from "date-fns/locale";
import { useBookingContext } from "../../contexts/BookingContext";
import useApi from "../../hooks/useApi";
import { getReservedBookings } from "../../api/booking";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import moment from "moment-timezone";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";

const DatePicker = ({ formRef, viewOnly }) => {
  const { selectedDates, setSelectedDates } = useBookingContext();

  const { t, i18n } = useTranslation();
  const [{ bookings }, isLoading] = useApi(getReservedBookings);

  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const reserved = useMemo(
    () =>
      bookings?.map((b, i) => {
        const startMoment = moment.tz(b.date_arrivee, tz).startOf("day");
        const startDate = startMoment.add(1, "day").toDate();

        let endMoment = moment.tz(b.date_depart, tz).startOf("day");

        // If time between two bookings is too small
        if (i + 1 !== bookings.length) {
          const nextBooking = bookings[i + 1];
          if (
            moment(nextBooking.date_arrivee).isSame(endMoment) ||
            moment(nextBooking.date_arrivee)
              .subtract(1, "day")
              .isSame(endMoment)
          ) {
            endMoment.add(2, "day");
          }
        }

        const endDate = endMoment.toDate();

        return {
          startDate,
          endDate,
        };
      }),
    [bookings, tz],
  );

  const handleChange = (e) => {
    if (e.length === 2) {
      const startDate = e[0];
      const endDate = e[1];
      const duration = (endDate - startDate) / (1000 * 60 * 60 * 24); // Durée en jours

      if (duration < 2) {
        toast.error(t("booking.minimum_stay"));
        return;
      }
    }

    e[0]?.setHours(14);
    e[1]?.setHours(10);
    e[1]?.setMinutes(0);
    e[1]?.setSeconds(0);
    setSelectedDates(e);
    if (e[1]) {
      const element = document.getElementById("booking-form-content");
      window.scroll({
        top: element.offsetTop - 300,
        behavior: "smooth",
      });
    }
  };

  const months = useMemo(
    () =>
      i18n.language === "fr"
        ? [
            "Janvier",
            "Février",
            "Mars",
            "Avril",
            "Mai",
            "Juin",
            "Juillet",
            "Août",
            "Septembre",
            "Octobre",
            "Novembre",
            "Décembre",
          ]
        : [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
          ],
    [i18n.language],
  );

  return isLoading ? (
    <FontAwesomeIcon icon={faSpinner} spinPulse />
  ) : (
    <Calendar
      id="booking-calendar"
      selected={selectedDates}
      onChange={handleChange}
      dateOfStartMonth={1}
      disabled={!!viewOnly}
      components={{
        MonthContent: (props) => (
          <div>
            {months[props.month]} {props.year}
          </div>
        ),
        DayCellFooter: (props) => {
          const isFirstDayReserved = bookings.some((booking) => {
            const startDate = moment(booking.date_arrivee).startOf("day");
            const endDate = moment(booking.date_depart).startOf("day");
            return moment(props.date).isBetween(startDate, endDate, null, "[)");
          });
          return (
            <div
              className={
                (props.state.isReserved || isFirstDayReserved) &&
                !(props.state.isSelectedStart || props.state.isSelectedEnd)
                  ? "day-footer-cell booked"
                  : "day-footer-cell"
              }
            >
              {props.state.isSelectedStart
                ? t("booking.begin")
                : props.state.isSelectedEnd
                  ? t("booking.end")
                  : props.state.isReserved || isFirstDayReserved
                    ? t("booking.booked")
                    : ""}
            </div>
          );
        },
      }}
      isStart={true}
      // disabled={(date, state) => {
      //   // Vérifiez si la date est dans le passé
      //   if (state.isPast) {
      //     return true;
      //   }
      //
      //   // Vérifiez si la date est le premier jour d'une réservation
      //   const isFirstDayReserved = reserved.some((reservation) => {
      //     const startDate = moment(reservation.startDate)
      //       .add(1, "day")
      //       .startOf("day");
      //     return startDate.isSame(moment(date), "day");
      //   });
      //
      //   // Si c'est le premier jour d'une réservation, ne pas désactiver
      //   return isFirstDayReserved;
      // }}
      reserved={reserved}
      dateFnsOptions={{
        weekStartsOn: 1,
        locale: i18n.language === "fr" ? fr : enUS,
      }}
      classNamePrefix="calendar"
      range={true}
      // numOfMonths={2}
      // variant="events"
    />
  );
};

export default DatePicker;
