import appAxios from "../helpers/axios";

export const saveBooking = (data) => {
  return appAxios.post("booking/save.php", data);
};

export const editBooking = (data) => {
  return appAxios.post("booking/edit.php", data);
};

export const getBookings = () => {
  return appAxios.get("booking/getAll.php");
};

export const getReservedBookings = () => {
  return appAxios.get("booking/getReserved.php");
};

export const validate = (data) => {
  return appAxios.post("booking/validate.php", data);
};

export const cancel = (data) => {
  return appAxios.post("booking/cancel.php", data);
};

export const waiting = (data) => {
  return appAxios.post("booking/wait.php", data);
};

export const remove = (data) => {
  return appAxios.post("booking/delete.php", data);
};
