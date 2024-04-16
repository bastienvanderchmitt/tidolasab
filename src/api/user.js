import appAxios from "../helpers/axios";

export const login = (data) => {
  return appAxios.post("user/login.php");
};
