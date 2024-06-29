import appAxios from "../helpers/axios";

export const login = (data) => {
  return appAxios.post("user/login.php", data);
};

export const create = (data) => {
  return appAxios.post("user/create.php", data);
};
