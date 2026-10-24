import appAxios from "../helpers/axios";

export const savePayment = ({ id, ...data }) => {
  return id
    ? appAxios.put(`payments/${id}`, data)
    : appAxios.post("payments", data);
};

export const getPayments = () => {
  return appAxios.get("payments");
};

export const deletePayment = ({ id }) => {
  return appAxios.delete(`payments/${id}`);
};
