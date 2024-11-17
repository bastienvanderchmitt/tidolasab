import appAxios from "../helpers/axios";

export const getStats = () => {
  return appAxios.get("statistics/getStats.php");
};
