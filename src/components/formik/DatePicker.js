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

const DatePicker = ({ formRef }) => {
  const { selectedDates, setSelectedDates } = useBookingContext();

  const { t, i18n } = useTranslation();
  const [{ bookings }, isLoading] = useApi(getReservedBookings);

  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const reserved = useMemo(
    () =>
      bookings?.map((b) => {
        const startMoment = moment.tz(b.date_arrivee, tz).startOf("day");
        const startDate = startMoment.toDate();

        const endMoment = moment.tz(b.date_depart, tz).startOf("day");
        const endDate = endMoment.toDate();

        return {
          startDate,
          endDate,
        };
      }),
    [bookings, tz],
  );

  const handleChange = (e) => {
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
      components={{
        MonthContent: (props) => (
          <div>
            {months[props.month]} {props.year}
          </div>
        ),
        DayCellFooter: (props) => {
          return (
            <div
              className={
                props.state.isReserved
                  ? "day-footer-cell booked"
                  : "day-footer-cell"
              }
            >
              {props.state.isReserved
                ? t("booking.booked")
                : props.state.isSelectedStart
                  ? t("booking.begin")
                  : props.state.isSelectedEnd
                    ? t("booking.end")
                    : ""}
            </div>
          );
        },
      }}
      isStart={true}
      disabled={(date, state) => state.isPast}
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
