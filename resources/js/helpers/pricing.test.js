import { computeQuote } from "./pricing";

// Mêmes cas que tests/Unit/PricingServiceTest.php
const pricing = {
  rates: [
    { from_year: 0, low: 100, high: 110 },
    { from_year: 2027, low: 105, high: 115 },
  ],
  low_season_months: [9, 10],
  tourist_tax: 2,
  discount_nights_threshold: 7,
};

describe("computeQuote", () => {
  it("facture chaque nuit en haute saison avec la taxe de séjour", () => {
    expect(computeQuote(pricing, "2026-12-01", "2026-12-04", 2)).toMatchObject({
      nights: 3,
      highSeasonNights: 3,
      touristTax: 12,
      total: 342,
    });
  });

  it("ne facture pas le jour du départ", () => {
    expect(computeQuote(pricing, "2026-10-30", "2026-11-01", 1)).toMatchObject({
      nights: 2,
      lowSeasonNights: 2,
      total: 204,
    });
  });

  it("répartit un séjour sur les deux saisons", () => {
    expect(computeQuote(pricing, "2026-10-30", "2026-11-02", 1).total).toBe(
      316,
    );
  });

  it("offre une demi-nuit par tranche de 7 nuits", () => {
    expect(computeQuote(pricing, "2026-09-01", "2026-09-08", 1)).toMatchObject({
      discount: 50,
      total: 664,
    });
    expect(computeQuote(pricing, "2026-09-01", "2026-09-15", 1).discount).toBe(
      100,
    );
  });

  it("applique les tarifs selon l'année d'arrivée", () => {
    expect(computeQuote(pricing, "2027-02-01", "2027-02-03", 1).total).toBe(
      234,
    );
    expect(
      computeQuote(pricing, "2026-12-30", "2027-01-02", 1).highSeasonPrice,
    ).toBe(110);
  });

  it("désactive la remise avec un seuil à 0", () => {
    const noDiscount = { ...pricing, discount_nights_threshold: 0 };
    expect(
      computeQuote(noDiscount, "2026-09-01", "2026-09-08", 1).discount,
    ).toBe(0);
  });

  it("ne calcule rien sans dates", () => {
    expect(computeQuote(pricing, "", "", 1)).toBeNull();
  });
});
