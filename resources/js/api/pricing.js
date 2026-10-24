import appAxios from "../helpers/axios";

export const getPricing = () => {
  return appAxios.get("pricing");
};
