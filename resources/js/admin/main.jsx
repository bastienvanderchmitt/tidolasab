import React from "react";
import ReactDOM from "react-dom/client";
import * as Sentry from "@sentry/react";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MantineProvider } from "@mantine/core";
import { DatesProvider } from "@mantine/dates";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/charts/styles.css";
import "dayjs/locale/fr";
import { theme } from "./theme";
import { AuthProvider } from "./auth/AuthContext";
import RequireAuth from "./auth/RequireAuth";
import AdminLayout from "./layout/AdminLayout";
import RouteError from "./pages/RouteError";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import PlanningPage from "./planning/PlanningPage";
import BookingsPage from "./bookings/BookingsPage";
import ClientsPage from "./clients/ClientsPage";
import ClientPage from "./clients/ClientPage";
import PaymentsPage from "./payments/PaymentsPage";
import RevenuePage from "./revenue/RevenuePage";
import EmailsPage from "./emails/EmailsPage";
import SettingsPage from "./settings/SettingsPage";
import UsersPage from "./users/UsersPage";

// Point d'entrée de l'administration : aucun composant n'est déclaré ici (React Refresh)
Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  enabled: !!import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.MODE,
  release: import.meta.env.VITE_SENTRY_RELEASE,
  sendDefaultPii: false,
});

document.title = "Administration · Ti' Dola Sab";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: (count, error) => error?.status >= 500 && count < 2,
    },
  },
});

const router = createBrowserRouter(
  [
    {
      path: "/connexion",
      element: <LoginPage />,
      errorElement: <RouteError />,
    },
    {
      element: <RequireAuth />,
      errorElement: <RouteError />,
      children: [
        {
          element: <AdminLayout />,
          children: [
            { index: true, element: <DashboardPage /> },
            { path: "planning", element: <PlanningPage /> },
            { path: "reservations", element: <BookingsPage /> },
            { path: "clients", element: <ClientsPage /> },
            { path: "clients/:id", element: <ClientPage /> },
            { path: "paiements", element: <PaymentsPage /> },
            { path: "chiffre-affaires", element: <RevenuePage /> },
            { path: "emails", element: <EmailsPage /> },
            { path: "reglages", element: <SettingsPage /> },
            { path: "administrateurs", element: <UsersPage /> },
            { path: "*", element: <Navigate to="/" replace /> },
          ],
        },
      ],
    },
  ],
  { basename: "/admin" },
);

ReactDOM.createRoot(document.getElementById("admin")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <MantineProvider theme={theme} defaultColorScheme="auto">
        <DatesProvider settings={{ locale: "fr", firstDayOfWeek: 1 }}>
          <ModalsProvider>
            <Notifications position="top-right" />
            <AuthProvider>
              <RouterProvider router={router} />
            </AuthProvider>
          </ModalsProvider>
        </DatesProvider>
      </MantineProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);
