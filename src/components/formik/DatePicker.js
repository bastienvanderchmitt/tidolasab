import React from "react";
import Calendar from "@demark-pro/react-booking-calendar";
import { fr } from "date-fns/locale";
import { months } from "../../helpers/months";
import { useBookingContext } from "../../contexts/BookingContext";

const reserved = [
  {
    startDate: new Date(2024, 4, 1),
    endDate: new Date(2024, 4, 5),
  },
  {
    startDate: new Date(2024, 4, 16),
    endDate: new Date(2024, 4, 24),
  },
];

const DatePicker = ({ formRef }) => {
  const { selectedDates, setSelectedDates } = useBookingContext();
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

  return (
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
          // console.log("props", props);
          return (
            <div
              className={
                props.state.isReserved
                  ? "day-footer-cell booked"
                  : "day-footer-cell"
              }
            >
              {props.state.isReserved
                ? "Réservé"
                : props.state.isSelectedStart
                  ? "Début"
                  : props.state.isSelectedEnd
                    ? "Fin"
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
        locale: fr,
      }}
      classNamePrefix="calendar"
      range={true}
      // numOfMonths={2}
      // variant="events"
    />
  );
};

export default DatePicker;
