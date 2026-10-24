import React, { useState, createContext, useEffect, useMemo } from "react";
import useContextFactory from "../hooks/useContextFactory";
import { computeQuote } from "../helpers/pricing";
import useApi from "../hooks/useApi";
import { getPricing } from "../api/pricing";
const BookingContext = createContext({});

export const useBookingContext = () => {
  return useContextFactory("BookingContext", BookingContext);
};

const BookingContextProvider = ({ children }) => {
  const [selectedDates, setSelectedDates] = useState([]);
  const [total, setTotal] = useState(0);
  const [adults, setAdults] = useState(1);
  const [child, setChild] = useState(0);
  const [type, setType] = useState("Classique");
  const [booked, setBooked] = useState(false);

  const checkIn =
    selectedDates?.length && selectedDates[0]
      ? selectedDates[0]?.toISOString().slice(0, 10)
      : "";

  const checkOut =
    selectedDates?.length && selectedDates[1]
      ? selectedDates[1]?.toISOString().slice(0, 10)
      : "";

  const [{ pricing }] = useApi(getPricing);

  const quote = useMemo(
    () => computeQuote(pricing, checkIn, checkOut, adults),
    [pricing, checkIn, checkOut, adults],
  );

  const days = quote?.nights || null;
  const daysHighSeason = quote?.highSeasonNights ?? null;
  const daysLowSeason = quote?.lowSeasonNights ?? null;
  const priceLowSeason = quote?.lowSeasonPrice;
  const priceHighSeason = quote?.highSeasonPrice;
  const touristTax = quote?.touristTax ?? 0;
  const discount = quote?.discount ?? 0;

  // Indicatif : le serveur recalcule le prix à l'enregistrement
  useEffect(() => {
    setTotal(quote?.nights ? quote.total : null);
  }, [quote]);

  return (
    <BookingContext.Provider
      value={{
        selectedDates,
        setSelectedDates,
        checkIn,
        checkOut,
        days,
        total,
        setTotal,
        adults,
        setAdults,
        child,
        setChild,
        booked,
        setBooked,
        daysHighSeason,
        daysLowSeason,
        priceLowSeason,
        priceHighSeason,
        discount,
        touristTax,
        pricing,
        type,
        setType,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export default BookingContextProvider;
