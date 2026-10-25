import { suggestEmail } from "./emailSuggestion";

describe("suggestEmail", () => {
  it.each([
    ["marie@gmial.com", "marie@gmail.com"],
    ["marie@gmail.con", "marie@gmail.com"],
    ["marie@hotmial.fr", "marie@hotmail.fr"],
    ["marie@orange.fe", "marie@orange.fr"],
    ["Marie@Wanado.fr", "marie@wanadoo.fr"],
    ["jean@mon-entreprise.cmo", "jean@mon-entreprise.com"],
  ])("corrige %s", (email, expected) => {
    expect(suggestEmail(email)).toBe(expected);
  });

  it.each([
    "marie@gmail.com",
    "jean@mon-entreprise.fr",
    "contact@tidolasab.com",
    "hans@gmx.de",
    "giulia@yahoo.it",
    "marie@gmail",
    "pas un email",
  ])("ne suggère rien pour %s", (email) => {
    expect(suggestEmail(email)).toBeNull();
  });
});
