import { useMemo } from "react";

// Before 2027 price
const priceLowBefore = 100;
const priceLowAfter = 105;

// After 2026 price
const priceHightBefore = 110;
const priceHightAfter = 115;

// Logique de calcul interne
const calculateDynamicPrice = (priceBefore, date, priceAfter) => {
  const year = new Date(date ? date : null).getFullYear();
  return year >= 2027 ? priceAfter : priceBefore;
};

export const usePriceLowSeason = (checkInDate) => {
  return useMemo(
    () => calculateDynamicPrice(priceLowBefore, checkInDate, priceLowAfter),
    [checkInDate],
  );
};

export const usePriceHighSeason = (checkInDate) => {
  return useMemo(
    () => calculateDynamicPrice(priceHightBefore, checkInDate, priceHightAfter),
    [checkInDate],
  );
};
