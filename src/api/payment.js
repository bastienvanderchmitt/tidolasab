import appAxios from "../helpers/axios";

export const savePayment = (data) => {
  return appAxios.post("payment/save.php", data);
};

export const getPayments = () => {
  return appAxios.get("payment/getAll.php");
};

export const deletePayment = (data) => {
  return appAxios.post("payment/delete.php", data);
};
