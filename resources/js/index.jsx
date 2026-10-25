import React from "react";
import ReactDOM from "react-dom/client";
import * as Sentry from "@sentry/react";
import App from "./App";
import CrashFallback from "./components/layout/CrashFallback";
import "./i18n";

// Point d'entrée : aucun composant n'est déclaré ici, sinon le React Refresh de Vite
// ré-importe ce module et l'application est montée deux fois.
Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  enabled: !!import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.MODE,
  release: import.meta.env.VITE_SENTRY_RELEASE,
  sendDefaultPii: false,
});

document.title = "Ti' Dola Sab";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Sentry.ErrorBoundary fallback={<CrashFallback />}>
    <App />
  </Sentry.ErrorBoundary>,
);
