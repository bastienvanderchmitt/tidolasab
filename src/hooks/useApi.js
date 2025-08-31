import { useEffect, useState } from "react";
import axios from "axios";
import useToggle from "./useToggle";
import toast from "react-hot-toast";

export default function useApi(
  fetch,
  params = null,
  customError = "Une erreur est survenue.",
  deps = [],
  callBack = null,
  condition = true,
  initialValue = {},
) {
  const [state, setState] = useState(initialValue);
  const [isLoading, setIsLoading] = useState(condition);
  const [dep, reload] = useToggle(false);

  // console.log("dep", dep);
  // console.log("deps", deps);

  useEffect(() => {
    const source = axios.CancelToken.source();

    if (condition) {
      (async () => {
        setIsLoading(true);
        try {
          const response = await fetch(params);

          response && setState(response.data);
          callBack && callBack(response.data);
        } catch (e) {
          console.log("error", e);
          if (typeof customError === "function") toast.error(customError(e));
          else toast.error(e.error || customError);
        }
        setIsLoading(false);
      })();
    }

    return () => source.cancel();
  }, [...deps, dep]); // eslint-disable-line react-hooks/exhaustive-deps

  return [state, isLoading, reload];
}
