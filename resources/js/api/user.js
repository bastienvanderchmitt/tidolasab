import appAxios, { initCsrf } from "../helpers/axios";

export const login = async (data) => {
  await initCsrf();
  return appAxios.post("login", data);
};

export const logout = () => {
  return appAxios.post("logout");
};

export const getMe = () => {
  return appAxios.get("user");
};

export const create = (data) => {
  return appAxios.post("users", data);
};
