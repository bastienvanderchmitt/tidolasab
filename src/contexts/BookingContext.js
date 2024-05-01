import React, { useState, createContext, useEffect, useCallback } from "react";
import useContextFactory from "../hooks/useContextFactory";
const BookingContext = createContext({});

export const useBookingContext = () => {
  return useContextFactory("BookingContext", BookingContext);
};

const BookingContextProvider = ({ children }) => {
  const [selectedDates, setSelectedDates] = useState([]);
  const [total, setTotal] = useState(0);

  const checkIn =
    selectedDates?.length && selectedDates[0]
      ? selectedDates[0]?.toISOString().slice(0, 10)
      : "";

  const checkOut =
    selectedDates?.length && selectedDates[1]
      ? selectedDates[1]?.toISOString().slice(0, 10)
      : "";

  const getDays = useCallback(() => {
    if (selectedDates[0] && selectedDates[1]) {
      let diffTime = selectedDates[0].getTime() - selectedDates[1].getTime();
      return Math.abs(Math.round(diffTime / (1000 * 3600 * 24)));
    } else return null;
  }, [selectedDates]);

  useEffect(() => {
    const days = getDays();
    const price = 100;
    days ? setTotal(days * price) : setTotal(null);
  }, [getDays, setTotal]);

  return (
    <BookingContext.Provider
      value={{
        selectedDates,
        setSelectedDates,
        checkIn,
        checkOut,
        total,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export default BookingContextProvider;
