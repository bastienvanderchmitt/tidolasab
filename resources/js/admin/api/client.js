import axios from "axios";
import * as Sentry from "@sentry/react";

const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
  withXSRFToken: true,
  headers: { Accept: "application/json", "Accept-Language": "fr" },
});

// Cookie XSRF-TOKEN requis par Sanctum avant la connexion
export const initCsrf = () =>
  axios.get("/sanctum/csrf-cookie", { withCredentials: true });

let onUnauthenticated = () => {};
export const setUnauthenticatedHandler = (handler) => {
  onUnauthenticated = handler;
};

/**
 * Toutes les erreurs sont rejetées sous la forme { status, message, errors }.
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;

    if (!response) {
      Sentry.captureException(error);
      return Promise.reject({
        status: 0,
        message: "Serveur injoignable, vérifiez votre connexion.",
        errors: {},
      });
    }

    if (response.status === 401 || response.status === 419) {
      onUnauthenticated();
    }

    return Promise.reject({
      status: response.status,
      message: response.data?.message || "Une erreur est survenue.",
      errors: response.data?.errors || {},
    });
  },
);

export default api;
