import { revenueAmount } from "./amount";

const row = { confirmed: 650, draft: 200, tax_confirmed: 8, tax_draft: 8 };

describe("revenueAmount", () => {
  it("compte les paiements encaissés, taxe comprise", () => {
    expect(revenueAmount(row, { withDrafts: false, withTax: true })).toBe(650);
  });

  it("ajoute les brouillons et leur taxe", () => {
    expect(revenueAmount(row, { withDrafts: true, withTax: true })).toBe(850);
    expect(revenueAmount(row, { withDrafts: true, withTax: false })).toBe(834);
  });

  it("retire la taxe des paiements encaissés", () => {
    expect(revenueAmount(row, { withDrafts: false, withTax: false })).toBe(642);
  });

  it("renvoie 0 sans données", () => {
    expect(revenueAmount(undefined, { withDrafts: true, withTax: true })).toBe(
      0,
    );
  });
});
