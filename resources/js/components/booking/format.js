import i18n from "../../i18n";

const locale = () => (i18n.language === "fr" ? "fr-FR" : "en-GB");

// Date YYYY-MM-DD lisible, sans passer par le fuseau du navigateur
export const formatDate = (isoDate, options = {}) => {
  if (!isoDate) return "";
  const [year, month, day] = isoDate.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day)).toLocaleDateString(locale(), {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
    ...options,
  });
};

export const formatPrice = (amount) =>
  new Intl.NumberFormat(locale(), {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: Number.isInteger(+amount) ? 0 : 2,
  }).format(amount);
