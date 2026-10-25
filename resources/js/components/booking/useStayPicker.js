import { useBookingContext } from "../../contexts/BookingContext";
import {
  isArrivalDisabled,
  isDepartureDisabled,
  today,
} from "../../helpers/availability";
import classes from "./StayPicker.module.css";

/**
 * Props communes aux calendriers de séjour (barre rapide et page de réservation) :
 * seules les dates d'arrivée possibles, puis les dates de départ compatibles,
 * sont cliquables.
 */
const useStayPicker = () => {
  const { checkIn, checkOut, setStay, taken, pricing } = useBookingContext();

  const pickingDeparture = !!checkIn && !checkOut;

  const excludeDate = (date) => {
    if (pickingDeparture && date > checkIn) {
      return isDepartureDisabled(checkIn, date, taken, pricing);
    }
    // Recliquer sur l'arrivée annule la sélection
    if (pickingDeparture && date === checkIn) return false;
    // Le départ choisi reste affiché, même s'il ne peut pas servir d'arrivée
    if (date === checkOut) return false;
    return isArrivalDisabled(date, taken, pricing);
  };

  const onChange = ([start, end]) => {
    // Un clic avant l'arrivée choisie devient la nouvelle arrivée
    if (pickingDeparture && end === checkIn && start < checkIn) {
      setStay([start, null]);
      return;
    }
    // Le départ affiché n'est pas forcément une arrivée possible : on repart de zéro
    if (start && !end && isArrivalDisabled(start, taken, pricing)) {
      setStay([null, null]);
      return;
    }
    setStay([start, end]);
  };

  return {
    type: "range",
    value: [checkIn, checkOut],
    onChange,
    excludeDate,
    minDate: today(),
    // Ouvre le calendrier sur le mois d'arrivée (lien partagé, barre rapide)
    defaultDate: checkIn ?? undefined,
    weekendDays: [],
    getDayProps: (date) => ({ "data-taken": taken.has(date) || undefined }),
    classNames: { day: classes.day },
  };
};

export default useStayPicker;
