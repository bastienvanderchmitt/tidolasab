import appAxios from "../helpers/axios";

export const sendEmail = (data) => {
  return appAxios.post("contact/sendEmail.php", data);
};
