import { useEffect, useState } from "react";
import axios from "axios";

// import addToast, { TOAST_ERROR } from "../helpers/toastr";
import useToggle from "./useToggle";

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
  const [dep, reload] = useToggle();

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
          // if (typeof customError === "function")
          //     addToast(customError(e), TOAST_ERROR);
          // else addToast(e.api_error || customError, TOAST_ERROR);
        }
        setIsLoading(false);
      })();
    }

    return () => source.cancel();
  }, [...deps, dep]); // eslint-disable-line react-hooks/exhaustive-deps

  return [state, isLoading, reload];
}
