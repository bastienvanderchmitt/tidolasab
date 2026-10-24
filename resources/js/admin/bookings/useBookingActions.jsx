import { modals } from "@mantine/modals";
import { bookingApi, useApiMutation } from "../api/queries";
import { confirmAction } from "../components/confirm";
import ValidateBookingModal from "./ValidateBookingModal";
import BookingFormModal from "./BookingFormModal";

/**
 * Actions sur une réservation, avec confirmation et notification.
 */
export const useBookingActions = () => {
  const cancel = useApiMutation(bookingApi.cancel, "Réservation annulée");
  const pending = useApiMutation(
    bookingApi.pending,
    "Réservation remise en attente",
  );
  const remove = useApiMutation(bookingApi.remove, "Réservation supprimée");

  const name = (booking) => booking.nom_client || "cette réservation";

  return {
    openValidate: (booking) => {
      const id = modals.open({
        title: "Valider la réservation",
        children: (
          <ValidateBookingModal
            booking={booking}
            onDone={() => modals.close(id)}
          />
        ),
      });
    },

    openEdit: (booking) => {
      const id = modals.open({
        title: "Modifier la réservation",
        size: "lg",
        children: (
          <BookingFormModal booking={booking} onDone={() => modals.close(id)} />
        ),
      });
    },

    openCreate: (defaults) => {
      const id = modals.open({
        title: "Nouvelle réservation",
        size: "lg",
        children: (
          <BookingFormModal
            defaults={defaults}
            onDone={() => modals.close(id)}
          />
        ),
      });
    },

    cancel: (booking) =>
      confirmAction({
        title: "Annuler la réservation",
        message: `Annuler la réservation de ${name(booking)} ? Le client est prévenu par email et le solde attendu est supprimé.`,
        confirmLabel: "Annuler la réservation",
        onConfirm: () => cancel.mutate(booking.id),
      }),

    setPending: (booking) =>
      confirmAction({
        title: "Remettre en attente",
        message: `Remettre la réservation de ${name(booking)} en attente ? Le client est prévenu par email.`,
        confirmLabel: "Remettre en attente",
        danger: false,
        onConfirm: () => pending.mutate(booking.id),
      }),

    remove: (booking, onDone) =>
      confirmAction({
        title: "Supprimer la réservation",
        message: `Supprimer définitivement la réservation de ${name(booking)} ? Une réservation déjà payée doit être annulée plutôt que supprimée.`,
        confirmLabel: "Supprimer",
        onConfirm: () => remove.mutate(booking.id, { onSuccess: onDone }),
      }),
  };
};
