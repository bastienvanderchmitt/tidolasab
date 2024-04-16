import axios from "axios";
import { app_api_url } from "./env";
// import { AUTH_TOKEN } from "./localStorageTypes";
// import { authService } from "./authService";

let currentExecutingRequests = {};

const appAxios = axios.create({
  // baseURL: process.env.REACT_APP_API_URL,
  baseURL: app_api_url,
});

appAxios.interceptors.request.use((config) => {
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();
  config.cancelToken = source.token;
  currentExecutingRequests[config.url] = source;

  // if (localStorage.getItem(AUTH_TOKEN)) {
  //   config.headers.Authorization = `Bearer ${localStorage.getItem(AUTH_TOKEN)}`;
  // }
  //
  // try {
  //   if (isDev && process.env.REACT_APP_XDEBUG === "true") {
  //     if (typeof config.params === "undefined") config.params = {};
  //     config.params.XDEBUG_SESSION = "PHPSTORM";
  //   }
  // } catch (e) {}

  return config;
});

appAxios.interceptors.response.use(
  (response) => {
    if (currentExecutingRequests[response.request.responseURL]) {
      // here you clean the request
      delete currentExecutingRequests[response.request.responseURL];
    }
    return response;
  },
  function (error) {
    const { config, response } = error;
    const originalRequest = config;

    // if (isDev) {
    //   if (response) console.error(response.data.error);
    //   else console.error(error);
    // }

    if (axios.isCancel(error)) {
      // here you check if this is a cancelled request to drop it silently (without error)
      return new Promise(() => {});
    }

    if (response.status === 401) {
      // const alreadyCanceled = !Object.keys(currentExecutingRequests).length;
      if (Object.keys(currentExecutingRequests).length) {
        Object.values(currentExecutingRequests).map((source) =>
          source.cancel(),
        );
        currentExecutingRequests = {};
      }
      // authService.logout();
      // !alreadyCanceled && addToast("Veuillez vous reconnecter.", TOAST_ERROR);
      // if (window.location.pathname !== "/connexion") {
      //   setTimeout(() => {
      //     window.location.href = "/connexion";
      //   }, 1000);
      // }
    } else {
      if (currentExecutingRequests[originalRequest.url]) {
        // here you clean the request
        delete currentExecutingRequests[originalRequest.url];
      }
      if (response && !(typeof response.data === "undefined")) {
        throw response.data;
      } else {
        throw error;
      }
    }
  },
);

export default appAxios;
