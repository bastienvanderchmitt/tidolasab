import appAxios from "../helpers/axios";

export const saveBooking = (data) => {
  return appAxios.post("bookings", data);
};

export const getReservedBookings = () => {
  return appAxios.get("bookings/reserved");
};

export const sendVerificationCode = (data) => {
  return appAxios.post("bookings/verification-code", data);
};
