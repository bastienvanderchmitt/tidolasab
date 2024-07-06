import appAxios from "../helpers/axios";

export const saveBooking = (data) => {
  return appAxios.post("booking/save.php", data);
};

export const getBookings = () => {
  return appAxios.get("booking/getAll.php");
};

export const getValidatedBookings = () => {
  return appAxios.get("booking/getValidated.php");
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
