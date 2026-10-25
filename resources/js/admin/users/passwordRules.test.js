import { validatePassword } from "./passwordRules";

// Mêmes cas que tests/Feature/AuthTest.php
describe("validatePassword", () => {
  it("accepte un mot de passe robuste", () => {
    expect(validatePassword("Nouveau-mot-de-passe-42")).toBeNull();
  });

  it.each([
    ["trop court", "Court-42"],
    ["sans majuscule", "sans-majuscule-42"],
    ["sans chiffre", "Sans-Chiffre-Ici"],
    ["sans symbole", "SansSymbole42abc"],
  ])("refuse un mot de passe %s", (_, password) => {
    expect(validatePassword(password)).not.toBeNull();
  });
});
