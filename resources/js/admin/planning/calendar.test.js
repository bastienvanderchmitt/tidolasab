import {
  addDays,
  addMonths,
  daysBetween,
  monthCells,
  occupancy,
  suggestedCheckOut,
} from "./calendar";

describe("monthCells", () => {
  it("commence le mois au bon jour de la semaine", () => {
    // Le 1er octobre 2026 est un jeudi : 3 cases vides (lundi à mercredi)
    const cells = monthCells("2026-10-15");
    expect(cells.slice(0, 3)).toEqual([null, null, null]);
    expect(cells[3]).toBe("2026-10-01");
    expect(cells.filter(Boolean)).toHaveLength(31);
    expect(cells.at(-1)).toBe("2026-10-31");
  });

  it("ne laisse pas de case vide pour un mois qui commence un lundi", () => {
    expect(monthCells("2027-02-10")[0]).toBe("2027-02-01");
  });
});

describe("dates", () => {
  it("compte les jours sans dépendre des changements d'heure", () => {
    // Passage à l'heure d'hiver le 25 octobre 2026
    expect(addDays("2026-10-24", 2)).toBe("2026-10-26");
    expect(daysBetween("2026-10-24", "2026-10-27")).toBe(3);
  });

  it("passe au mois suivant ou précédent", () => {
    expect(addMonths("2026-12-15", 1)).toBe("2027-01-01");
    expect(addMonths("2026-01-31", -1)).toBe("2025-12-01");
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

describe("suggestedCheckOut", () => {
  const nightsMap = occupancy([
    {
      id: 1,
      date_arrivee: "2026-11-10",
      date_depart: "2026-11-12",
      statut: "validée",
    },
  ]);

  it("propose deux nuits", () => {
    expect(suggestedCheckOut("2026-11-01", nightsMap)).toBe("2026-11-03");
  });

  it("s'arrête à l'arrivée de la réservation suivante", () => {
    expect(suggestedCheckOut("2026-11-09", nightsMap)).toBe("2026-11-10");
  });
});
