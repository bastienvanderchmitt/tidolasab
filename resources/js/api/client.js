import appAxios from "../helpers/axios";

export const saveClient = ({ id, ...data }) => {
  return appAxios.put(`clients/${id}`, data);
};

export const deleteClient = ({ id }) => {
  return appAxios.delete(`clients/${id}`);
};

export const getClients = () => {
  return appAxios.get("clients");
};

export const getClient = (id) => {
  return appAxios.get(`clients/${id}`);
};
