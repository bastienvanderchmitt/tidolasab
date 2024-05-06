import appAxios from "../helpers/axios";

export const saveBooking = (data) => {
  return appAxios.post("booking/save.php", data);
};

export const getBookings = () => {
  return appAxios.get("booking/getAll.php");
};
