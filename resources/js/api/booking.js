import appAxios from "../helpers/axios";

export const saveBooking = (data) => {
  return appAxios.post("bookings", data);
};

export const editBooking = ({ id, ...data }) => {
  return appAxios.put(`bookings/${id}`, data);
};

export const getBookings = () => {
  return appAxios.get("bookings");
};

export const getReservedBookings = () => {
  return appAxios.get("bookings/reserved");
};

export const validate = ({ id, ...data }) => {
  return appAxios.post(`bookings/${id}/validate`, data);
};

export const cancel = ({ id }) => {
  return appAxios.post(`bookings/${id}/cancel`);
};

export const waiting = ({ id }) => {
  return appAxios.post(`bookings/${id}/pending`);
};

export const remove = ({ id }) => {
  return appAxios.delete(`bookings/${id}`);
};
