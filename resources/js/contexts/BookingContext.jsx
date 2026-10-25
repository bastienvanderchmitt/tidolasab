import React, { useState, createContext, useMemo } from "react";
import useContextFactory from "../hooks/useContextFactory";
import { computeQuote } from "../helpers/pricing";
import { takenNights } from "../helpers/availability";
import { usePricing, useReservedBookings } from "../api/queries";
const BookingContext = createContext({});

export const useBookingContext = () => {
  return useContextFactory("BookingContext", BookingContext);
};

/**
 * Séjour en cours de saisie, partagé entre la barre de réservation rapide,
 * la page de réservation et la page de confirmation.
 * Les dates sont des chaînes YYYY-MM-DD, sans fuseau horaire.
 */
const BookingContextProvider = ({ children }) => {
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [adults, setAdults] = useState(2);
  const [booked, setBooked] = useState(null);

  const { data: pricing } = usePricing();
  const { data: bookings, isPending: isLoadingBookings } =
    useReservedBookings();

  const taken = useMemo(() => takenNights(bookings), [bookings]);

  // Indicatif : le serveur recalcule le prix à l'enregistrement
  const quote = useMemo(
    () => computeQuote(pricing, checkIn, checkOut, adults),
    [pricing, checkIn, checkOut, adults],
  );

  const setStay = ([nextCheckIn, nextCheckOut]) => {
    setCheckIn(nextCheckIn || null);
    setCheckOut(nextCheckOut || null);
  };

  return (
    <BookingContext.Provider
      value={{
        checkIn,
        checkOut,
        setStay,
        adults,
        setAdults,
        quote,
        pricing,
        taken,
        isLoadingBookings,
        booked,
        setBooked,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export default BookingContextProvider;
