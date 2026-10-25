// Mêmes exigences que Password::defaults() (AppServiceProvider)
export const passwordRules = [
  { label: "12 caractères minimum", test: (v) => v.length >= 12 },
  { label: "Une majuscule et une minuscule", test: (v) => /[a-z]/.test(v) && /[A-Z]/.test(v) },
  { label: "Un chiffre", test: (v) => /\d/.test(v) },
  { label: "Un symbole (! ? - _ @ …)", test: (v) => /[^A-Za-z0-9]/.test(v) },
];

export const validatePassword = (value) =>
  passwordRules.every((rule) => rule.test(value))
    ? null
    : "Le mot de passe ne respecte pas les critères";
