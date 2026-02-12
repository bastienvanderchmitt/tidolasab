import React, { useState, createContext, useEffect, useMemo } from "react";
import useContextFactory from "../hooks/useContextFactory";
import { getDaysHighSeason, getDaysLowSeason } from "../helpers/dates";
import { touristTax } from "../helpers/env";
import { usePriceHighSeason, usePriceLowSeason } from "../hooks/usePrices";
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

  const days = useMemo(() => {
    if (selectedDates[0] && selectedDates[1]) {
      let diffTime = selectedDates[0].getTime() - selectedDates[1].getTime();
      return Math.abs(Math.round(diffTime / (1000 * 3600 * 24)));
    } else return null;
  }, [selectedDates]);

  const daysHighSeason = useMemo(() => {
    return selectedDates[0] && selectedDates[1]
      ? getDaysHighSeason(selectedDates[0], selectedDates[1])
      : null;
  }, [selectedDates]);

  const daysLowSeason = useMemo(() => {
    return selectedDates[0] && selectedDates[1]
      ? getDaysLowSeason(selectedDates[0], selectedDates[1])
      : null;
  }, [selectedDates]);

  const priceLowSeason = usePriceLowSeason(checkIn);
  const priceHighSeason = usePriceHighSeason(checkIn);

  const discount = useMemo(() => {
    const freeHalfDays = Math.floor(days / 7);
    return Math.round(
      freeHalfDays *
        ((daysHighSeason * priceHighSeason + daysLowSeason * priceLowSeason) /
          days /
          2),
    );
  }, [days, daysHighSeason, daysLowSeason, priceLowSeason, priceHighSeason]);

  useEffect(() => {
    if (days) {
      setTotal(
        daysHighSeason * priceHighSeason +
          daysLowSeason * priceLowSeason +
          days * adults * touristTax -
          discount,
      );
    } else {
      setTotal(null);
    }
  }, [
    days,
    adults,
    daysHighSeason,
    daysLowSeason,
    priceLowSeason,
    priceHighSeason,
    discount,
    setTotal,
  ]);

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
        type,
        setType,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export default BookingContextProvider;
