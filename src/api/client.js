import appAxios from "../helpers/axios";

export const saveClient = (data) => {
  return appAxios.post("client/save.php", data);
};

export const getClients = () => {
  return appAxios.get("client/getAll.php");
};
