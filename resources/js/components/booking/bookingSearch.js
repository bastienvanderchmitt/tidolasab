// Paramètres d'URL de /booking, pour un lien partageable
export const bookingSearch = (checkIn, checkOut, adults) => {
  const params = new URLSearchParams();
  if (checkIn) params.set("checkIn", checkIn);
  if (checkOut) params.set("checkOut", checkOut);
  if (adults) params.set("adults", adults);
  const search = params.toString();
  return search ? `?${search}` : "";
};
