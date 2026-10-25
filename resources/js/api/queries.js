import {
  QueryCache,
  QueryClient,
  useMutation,
  useQuery,
} from "@tanstack/react-query";
import { notifications } from "@mantine/notifications";
import i18n from "../i18n";
import { getReservedBookings, saveBooking } from "./booking";
import { sendEmail } from "./contact";
import { getPricing } from "./pricing";

/**
 * Client TanStack Query du site public. Une lecture qui échoue (après les nouvelles
 * tentatives) affiche un message ; les envois de formulaire gèrent leurs propres erreurs.
 */
export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) =>
      notifications.show({
        color: "red",
        message: error?.message || i18n.t("common.error"),
      }),
  }),
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      // Réseau coupé ou erreur serveur : deux nouvelles tentatives
      retry: (count, error) =>
        (error?.status === 0 || error?.status >= 500) && count < 2,
    },
  },
});

// Tarifs et saisons : ils ne changent qu'à la main, depuis l'admin
export const usePricing = () =>
  useQuery({
    queryKey: ["pricing"],
    queryFn: () => getPricing().then(({ data }) => data.pricing),
    staleTime: 10 * 60_000,
  });

// Dates déjà prises : rechargées au retour sur l'onglet, une réservation a pu être validée
export const useReservedBookings = () =>
  useQuery({
    queryKey: ["bookings", "reserved"],
    queryFn: () => getReservedBookings().then(({ data }) => data.bookings),
  });

export const useSaveBooking = () =>
  useMutation({
    mutationFn: (data) => saveBooking(data).then(({ data }) => data),
    // Les dates qui viennent d'être demandées ne sont plus libres
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["bookings", "reserved"] }),
  });

export const useSendContact = () =>
  useMutation({
    mutationFn: (data) => sendEmail(data).then(({ data }) => data),
  });
