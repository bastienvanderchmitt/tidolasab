import React from "react";
import ReactDOM from "react-dom/client";
import * as Sentry from "@sentry/react";
import "./index.css";
import App from "./App";
import "./i18n";

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  enabled: !!import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.MODE,
  release: import.meta.env.VITE_SENTRY_RELEASE,
  sendDefaultPii: false,
});

document.title = "Ti' Dola Sab";

const Fallback = () => (
  <div style={{ padding: "4rem 1rem", textAlign: "center" }}>
    <h1>Oups</h1>
    <p>Une erreur inattendue est survenue, nous en avons été informés.</p>
    <a href="/">Retour à l'accueil</a>
  </div>
);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Sentry.ErrorBoundary fallback={<Fallback />}>
    <App />
  </Sentry.ErrorBoundary>,
);
