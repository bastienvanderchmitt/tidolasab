/**
 * Suggestion de correction d'une faute de frappe dans le domaine d'un email
 * (« gmial.com » → « gmail.com », « orange.fe » → « orange.fr »).
 */

const DOMAINS = [
  "gmail.com",
  "hotmail.fr",
  "hotmail.com",
  "yahoo.fr",
  "yahoo.com",
  "orange.fr",
  "wanadoo.fr",
  "free.fr",
  "sfr.fr",
  "laposte.net",
  "outlook.fr",
  "outlook.com",
  "live.fr",
  "icloud.com",
  "me.com",
  "bbox.fr",
  "neuf.fr",
  "aol.com",
  "msn.com",
  "gmx.fr",
  "proton.me",
  "protonmail.com",
];

const TLDS = [
  "com",
  "fr",
  "net",
  "org",
  "be",
  "ch",
  "de",
  "es",
  "it",
  "uk",
  "ca",
  "me",
  "eu",
  "gp",
  "mq",
];

// Distance de Damerau-Levenshtein restreinte : une inversion de lettres compte pour une faute
const distance = (a, b) => {
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      d[i][j] = Math.min(
        d[i - 1][j] + 1,
        d[i][j - 1] + 1,
        d[i - 1][j - 1] + cost,
      );
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
      }
    }
  }
  return d[a.length][b.length];
};

const closest = (value, candidates, maxDistance) => {
  let best = null;
  let bestDistance = maxDistance + 1;
  for (const candidate of candidates) {
    const current = distance(value, candidate);
    if (current < bestDistance) {
      best = candidate;
      bestDistance = current;
    }
  }
  return best;
};

export const suggestEmail = (email) => {
  const match = /^([^\s@]+)@([^\s@]+\.[^\s@]+)$/.exec(
    email.trim().toLowerCase(),
  );
  if (!match) return null;

  const [, local, domain] = match;
  if (DOMAINS.includes(domain)) return null;

  // Domaine courant mal tapé ; une seule faute tolérée sur un domaine court (« gmx.de » est légitime)
  const knownDomain = closest(domain, DOMAINS, domain.length > 8 ? 2 : 1);
  if (knownDomain) return `${local}@${knownDomain}`;

  // Sinon, seule l'extension est corrigée (« .con », « .fe »)
  const dot = domain.lastIndexOf(".");
  const tld = domain.slice(dot + 1);
  if (TLDS.includes(tld)) return null;
  const knownTld = closest(tld, TLDS, 1);
  return knownTld ? `${local}@${domain.slice(0, dot)}.${knownTld}` : null;
};
