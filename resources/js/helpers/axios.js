import axios from "axios";
import * as Sentry from "@sentry/react";
import i18n from "../i18n";

const appAxios = axios.create({
  baseURL: "/api",
  withCredentials: true,
  withXSRFToken: true,
  headers: { Accept: "application/json" },
});

appAxios.interceptors.request.use((config) => {
  config.headers["Accept-Language"] = i18n.language || "fr";
  return config;
});

/**
 * Toutes les erreurs sont rejetées sous la forme :
 * { status, message, error (= message, pour l'existant), errors (champs invalides) }
 */
appAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;

    if (!response) {
      // Réseau coupé, timeout... : le serveur n'a rien vu, on le signale à Sentry
      Sentry.captureException(error);
      const message = i18n.t("common.error");
      return Promise.reject({
        status: 0,
        message,
        error: message,
        errors: {},
      });
    }

    const message = response.data?.message || i18n.t("common.error");
    return Promise.reject({
      status: response.status,
      message,
      error: message,
      errors: response.data?.errors || {},
    });
  },
);

export default appAxios;
