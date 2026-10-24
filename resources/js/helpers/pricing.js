/**
 * Calcul du prix d'un séjour, identique à App\Services\PricingService.
 * Les règles (tarifs, saisons, taxe) viennent de GET /api/pricing.
 */

const DAY = 24 * 60 * 60 * 1000;

const toUtc = (isoDate) => {
  const [year, month, day] = isoDate.split("-").map(Number);
  return Date.UTC(year, month - 1, day);
};

export const ratesFor = (pricing, year) => {
  const rate = [...pricing.rates]
    .sort((a, b) => a.from_year - b.from_year)
    .filter((r) => r.from_year <= year)
    .pop();

  return { low: rate.low, high: rate.high };
};

export const computeQuote = (pricing, checkIn, checkOut, adults) => {
  if (!pricing || !checkIn || !checkOut) return null;

  const start = toUtc(checkIn);
  const end = toUtc(checkOut);
  const { low: lowPrice, high: highPrice } = ratesFor(
    pricing,
    new Date(start).getUTCFullYear(),
  );

  let nights = 0;
  let lowNights = 0;
  for (let night = start; night < end; night += DAY) {
    nights++;
    if (pricing.low_season_months.includes(new Date(night).getUTCMonth() + 1)) {
      lowNights++;
    }
  }
  const highNights = nights - lowNights;

  const accommodation = highNights * highPrice + lowNights * lowPrice;
  const touristTax = nights * adults * pricing.tourist_tax;
  // 0 = pas de remise semaine
  const discount =
    nights && pricing.discount_nights_threshold > 0
      ? Math.round(
          Math.floor(nights / pricing.discount_nights_threshold) *
            (accommodation / nights / 2),
        )
      : 0;

  return {
    nights,
    highSeasonNights: highNights,
    lowSeasonNights: lowNights,
    highSeasonPrice: highPrice,
    lowSeasonPrice: lowPrice,
    touristTax,
    discount,
    total: accommodation + touristTax - discount,
  };
};
