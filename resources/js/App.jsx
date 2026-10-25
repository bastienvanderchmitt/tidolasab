import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/notifications/styles.css";
import "./assets/global.css";
import "dayjs/locale/fr";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { MantineProvider } from "@mantine/core";
import { DatesProvider } from "@mantine/dates";
import { Notifications } from "@mantine/notifications";
import { useTranslation } from "react-i18next";
import { queryClient } from "./api/queries";
import { allRoutes } from "./routes/allRoutes";
import { theme } from "./theme";
import BookingContextProvider from "./contexts/BookingContext";

const router = createBrowserRouter(allRoutes);

// Calendriers dans la langue du site, semaine du lundi au dimanche
const LocalizedDates = ({ children }) => {
  const { i18n } = useTranslation();

  return (
    <DatesProvider
      settings={{ locale: i18n.language === "fr" ? "fr" : "en", firstDayOfWeek: 1 }}
    >
      {children}
    </DatesProvider>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider theme={theme} forceColorScheme="light">
        <LocalizedDates>
          <Notifications position="top-center" />
          <BookingContextProvider>
            <RouterProvider router={router} />
          </BookingContextProvider>
        </LocalizedDates>
      </MantineProvider>
    </QueryClientProvider>
  );
}

export default App;
