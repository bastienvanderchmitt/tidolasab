import { money } from "./format";

describe("money", () => {
  it("affiche les centimes seulement s'il y en a", () => {
    expect(money(1578.5).replace(/\s/g, " ")).toBe("1 578,50 €");
    expect(money("228.00").replace(/\s/g, " ")).toBe("228 €");
    expect(money(null).replace(/\s/g, " ")).toBe("0 €");
  });
});
