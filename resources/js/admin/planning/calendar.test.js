import { dayjs } from "../utils/format";
import { monthCells, occupancy } from "./calendar";

describe("monthCells", () => {
  it("commence le mois au bon jour de la semaine", () => {
    // Le 1er octobre 2026 est un jeudi : 3 cases vides (lundi à mercredi)
    const cells = monthCells(dayjs("2026-10-15"));
    expect(cells.slice(0, 3)).toEqual([null, null, null]);
    expect(cells[3].format("YYYY-MM-DD")).toBe("2026-10-01");
    expect(cells.filter(Boolean)).toHaveLength(31);
  });

  it("ne laisse pas de case vide pour un mois qui commence un lundi", () => {
    expect(monthCells(dayjs("2027-02-10"))[0].format("YYYY-MM-DD")).toBe(
      "2027-02-01",
    );
  });
});

describe("occupancy", () => {
  const booking = (id, arrival, departure, statut = "validée") => ({
    id,
    date_arrivee: arrival,
    date_depart: departure,
    statut,
  });

  it("occupe les nuits de l'arrivée à la veille du départ", () => {
    const map = occupancy([booking(1, "2026-11-06", "2026-11-10")]);
    expect([...map.keys()]).toEqual([
      "2026-11-06",
      "2026-11-07",
      "2026-11-08",
      "2026-11-09",
    ]);
  });

  it("ignore les annulations et fait primer les réservations validées", () => {
    const map = occupancy([
      booking(1, "2026-11-06", "2026-11-08", "en attente"),
      booking(2, "2026-11-07", "2026-11-09"),
      booking(3, "2026-11-01", "2026-11-03", "annulée"),
    ]);
    expect(map.get("2026-11-06").id).toBe(1);
    expect(map.get("2026-11-07").id).toBe(2);
    expect(map.has("2026-11-01")).toBe(false);
  });
});
