import { isAddress, isEmail, isPhone, isPostalCode } from "./validation";

// Mêmes cas que tests/Feature/BookingTest.php
describe("isEmail", () => {
  it.each(["marie@gmail.com", "j.d+gite@orange.fr"])("accepte %s", (email) => {
    expect(isEmail(email)).toBe(true);
  });

  it.each([
    "marie@gmail",
    "marie @gmail.com",
    "marie@@gmail.com",
    "marie@gmail..com",
    "marie@.com",
  ])("refuse %s", (email) => {
    expect(isEmail(email)).toBe(false);
  });
});

describe("isPhone", () => {
  it.each([
    "0690112233",
    "06 90 11 22 33",
    "+590 690 11 22 33",
    "+44 (0)20 7946 0958",
  ])("accepte %s", (phone) => {
    expect(isPhone(phone)).toBe(true);
  });

  it.each(["0690", "06 90 AB CD EF", "+33 6 12 34 56 78 90 12 34"])(
    "refuse %s",
    (phone) => {
      expect(isPhone(phone)).toBe(false);
    },
  );
});

describe("isPostalCode", () => {
  it("exige 5 chiffres en France et outre-mer", () => {
    expect(isPostalCode("97140", "GP")).toBe(true);
    expect(isPostalCode("9714", "FR")).toBe(false);
  });

  it("accepte les formats étrangers", () => {
    expect(isPostalCode("SW1A 1AA", "GB")).toBe(true);
    expect(isPostalCode("1000", "BE")).toBe(true);
  });
});

describe("isAddress", () => {
  it("demande au moins 5 caractères dont des lettres", () => {
    expect(isAddress("1 rue des Palmiers")).toBe(true);
    expect(isAddress("12345")).toBe(false);
    expect(isAddress("rue")).toBe(false);
  });
});
