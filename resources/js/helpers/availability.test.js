import {
  isArrivalDisabled,
  isDepartureDisabled,
  minimumNightsFor,
  nightsBetween,
  takenNights,
  validateStay,
} from "./availability";

const pricing = {
  minimum_nights: 2,
  minimum_stay_periods: [
    { start: "2026-12-21", end: "2027-01-06", nights: 4 },
  ],
};

// Une réservation du 10 au 15 novembre, une autre du 17 au 20
const taken = takenNights([
  { date_arrivee: "2026-11-10", date_depart: "2026-11-15" },
  { date_arrivee: "2026-11-17", date_depart: "2026-11-20" },
]);

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date(2026, 10, 1, 12));
});

afterEach(() => {
  vi.useRealTimers();
});

describe("takenNights", () => {
  it("compte les nuits de l'arrivée à la veille du départ", () => {
    expect(taken.has("2026-11-10")).toBe(true);
    expect(taken.has("2026-11-14")).toBe(true);
    expect(taken.has("2026-11-15")).toBe(false);
  });
});

describe("isArrivalDisabled", () => {
  it("refuse une date passée", () => {
    expect(isArrivalDisabled("2026-10-31", taken, pricing)).toBe(true);
  });

  it("autorise l'arrivée le jour d'un départ", () => {
    expect(isArrivalDisabled("2026-11-15", taken, pricing)).toBe(false);
  });

  it("refuse une arrivée sans assez de nuits libres avant la suivante", () => {
    expect(isArrivalDisabled("2026-11-16", taken, pricing)).toBe(true);
    expect(isArrivalDisabled("2026-11-12", taken, pricing)).toBe(true);
  });
});

describe("isDepartureDisabled", () => {
  it("autorise le départ le jour d'une arrivée", () => {
    expect(isDepartureDisabled("2026-11-15", "2026-11-17", taken, pricing)).toBe(
      false,
    );
  });

  it("refuse un séjour qui chevauche une réservation", () => {
    expect(isDepartureDisabled("2026-11-15", "2026-11-18", taken, pricing)).toBe(
      true,
    );
  });

  it("applique la durée minimale de la période de Noël", () => {
    expect(isDepartureDisabled("2026-12-22", "2026-12-25", taken, pricing)).toBe(
      true,
    );
    expect(isDepartureDisabled("2026-12-22", "2026-12-26", taken, pricing)).toBe(
      false,
    );
  });
});

describe("minimumNightsFor", () => {
  it("prend la durée globale hors période", () => {
    expect(minimumNightsFor(pricing, "2026-11-01", "2026-11-03")).toBe(2);
  });

  it("prend la durée de la période qu'un séjour touche", () => {
    expect(minimumNightsFor(pricing, "2026-12-19", "2026-12-22")).toBe(4);
  });
});

describe("validateStay", () => {
  it("valide un séjour libre", () => {
    expect(validateStay("2026-11-01", "2026-11-05", taken, pricing)).toBeNull();
    expect(nightsBetween("2026-11-01", "2026-11-05")).toBe(4);
  });

  it("explique un séjour trop court", () => {
    expect(validateStay("2026-12-28", "2026-12-30", taken, pricing)).toEqual({
      key: "booking.errors.minimum",
      params: { nights: 4 },
    });
  });

  it("refuse des dates déjà prises", () => {
    expect(validateStay("2026-11-08", "2026-11-12", taken, pricing)).toEqual({
      key: "booking.errors.unavailable",
    });
  });
});
