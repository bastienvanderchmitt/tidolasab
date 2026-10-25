import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { notifications } from "@mantine/notifications";
import api from "./client";

const get = (url, key, params) => () =>
  api.get(url, { params }).then(({ data }) => data[key]);

export const useDashboard = () =>
  useQuery({ queryKey: ["dashboard"], queryFn: get("dashboard", "dashboard") });

export const useBookings = () =>
  useQuery({ queryKey: ["bookings"], queryFn: get("bookings", "bookings") });

export const useBooking = (id) =>
  useQuery({
    queryKey: ["bookings", id],
    queryFn: get(`bookings/${id}`, "booking"),
    enabled: !!id,
  });

export const useClients = () =>
  useQuery({ queryKey: ["clients"], queryFn: get("clients", "clients") });

export const useClient = (id) =>
  useQuery({
    queryKey: ["clients", id],
    queryFn: get(`clients/${id}`, "client"),
    enabled: !!id,
  });

export const usePayments = () =>
  useQuery({ queryKey: ["payments"], queryFn: get("payments", "payments") });

export const useEmails = (params = {}) =>
  useQuery({
    queryKey: ["emails", params],
    queryFn: get("emails", "emails", params),
  });

export const useEmail = (id) =>
  useQuery({
    queryKey: ["emails", id],
    queryFn: get(`emails/${id}`, "email"),
    enabled: !!id,
  });

export const useRevenue = (basis) =>
  useQuery({
    queryKey: ["revenue", basis],
    queryFn: get("revenue", "revenue", { basis }),
  });

export const useSettings = () =>
  useQuery({ queryKey: ["settings"], queryFn: get("settings", "settings") });

export const useUsers = () =>
  useQuery({ queryKey: ["users"], queryFn: get("users", "users") });

export const useQuote = (params, enabled) =>
  useQuery({
    queryKey: ["quote", params],
    queryFn: get("pricing/quote", "quote", params),
    enabled,
    staleTime: 5 * 60_000,
  });

/**
 * Mutation qui affiche un message et rafraîchit toutes les données admin :
 * une réservation modifiée change aussi paiements, CA et tableau de bord.
 */
export const useApiMutation = (request, successMessage) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: request,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries();
      // Le message peut dépendre des données envoyées
      const message =
        typeof successMessage === "function"
          ? successMessage(variables)
          : successMessage;
      if (message) {
        notifications.show({ color: "teal", message });
      }
    },
    onError: (error) => {
      notifications.show({
        color: "red",
        title: "Erreur",
        message: error.message,
      });
    },
  });
};

export const bookingApi = {
  create: (data) => api.post("bookings", data),
  update: ({ id, ...data }) => api.put(`bookings/${id}`, data),
  validate: ({ id, ...data }) => api.post(`bookings/${id}/validate`, data),
  cancel: (id) => api.post(`bookings/${id}/cancel`),
  pending: (id) => api.post(`bookings/${id}/pending`),
  remove: (id) => api.delete(`bookings/${id}`),
};

export const clientApi = {
  update: ({ id, ...data }) => api.put(`clients/${id}`, data),
  remove: (id) => api.delete(`clients/${id}`),
};

export const paymentApi = {
  save: ({ id, ...data }) =>
    id ? api.put(`payments/${id}`, data) : api.post("payments", data),
  confirm: ({ id, ...data }) => api.post(`payments/${id}/confirm`, data),
  remove: (id) => api.delete(`payments/${id}`),
};

export const emailApi = {
  resend: (id) => api.post(`emails/${id}/resend`),
};

export const settingsApi = {
  update: (data) => api.put("settings", data),
};

export const userApi = {
  create: (data) => api.post("users", data),
  remove: (id) => api.delete(`users/${id}`),
  updatePassword: (data) => api.put("user/password", data),
};
