import {
  Alert,
  Button,
  Group,
  NumberInput,
  Select,
  Stack,
  Text,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { IconInfoCircle } from "@tabler/icons-react";
import { bookingApi, useApiMutation } from "../api/queries";
import { BOOKING_TYPES, PAYMENT_METHODS, isPlatform } from "../utils/labels";
import { isoDate, money, nights, shortDate } from "../utils/format";

/**
 * Valide une réservation en enregistrant le premier paiement reçu.
 * Le reste devient automatiquement un paiement brouillon : solde d'une réservation
 * directe, ou versement attendu de la plateforme.
 */
const ValidateBookingModal = ({ booking, onDone }) => {
  const mutation = useApiMutation(bookingApi.validate, "Réservation validée");
  const total = Number(booking.prix_total);
  const isDirect = booking.type === "Classique";
  const platform = isPlatform(booking.type)
    ? BOOKING_TYPES[booking.type].label
    : null;

  const form = useForm({
    initialValues: {
      // La plateforme verse le séjour après le départ : rien n'est encore reçu
      deposit: platform ? 0 : Number(booking.acompte_attendu ?? total),
      date: isoDate(new Date()),
      type: "virement",
      dueDate: booking.versement_prevu ?? null,
    },
    validate: {
      deposit: (v) => (v >= 0 ? null : "Montant invalide"),
      date: (v) => (v ? null : "Indiquez la date du paiement"),
      dueDate: (v) =>
        platform && !v ? "Indiquez la date du versement attendu" : null,
    },
  });

  const remaining = Math.max(
    0,
    Math.round((total - Number(form.values.deposit || 0)) * 100) / 100,
  );

  const received = Number(form.values.deposit || 0) > 0;

  const submit = form.onSubmit(({ dueDate, ...values }) =>
    mutation.mutate(
      { id: booking.id, ...values, ...(platform ? { dueDate } : {}) },
      { onSuccess: onDone },
    ),
  );

  return (
    <form onSubmit={submit}>
      <Stack>
        <Text size="sm">
          <strong>{booking.nom_client || "Réservation"}</strong> ·{" "}
          {shortDate(booking.date_arrivee)} → {shortDate(booking.date_depart)} ·{" "}
          {nights(booking.nombre_nuits)} · {money(total)}
        </Text>

        {booking.paiement_total_requis && isDirect && (
          <Alert color="orange" icon={<IconInfoCircle size={18} />}>
            Arrivée dans moins de 15 jours : la totalité du séjour a été
            demandée au client.
          </Alert>
        )}

        <NumberInput
          label={platform ? `Déjà versé par ${platform}` : "Montant reçu"}
          description={
            platform
              ? "Laissez 0 si le versement n'a pas encore eu lieu"
              : undefined
          }
          suffix=" €"
          decimalScale={2}
          min={0}
          thousandSeparator=" "
          decimalSeparator=","
          {...form.getInputProps("deposit")}
        />
        {received && (
          <Group grow>
            <DatePickerInput
              label="Date du paiement"
              valueFormat="D MMM YYYY"
              {...form.getInputProps("date")}
            />
            <Select
              label="Moyen de paiement"
              data={PAYMENT_METHODS}
              allowDeselect={false}
              {...form.getInputProps("type")}
            />
          </Group>
        )}

        {platform && !received && (
          <>
            <DatePickerInput
              label="Versement attendu le"
              description="Délai après le départ réglable dans Réglages"
              valueFormat="D MMM YYYY"
              {...form.getInputProps("dueDate")}
            />
            <Text size="sm" c="dimmed">
              Le versement de <strong>{money(remaining)}</strong> sera créé en
              paiement attendu : encaissez-le à réception, au montant réellement
              versé.
            </Text>
          </>
        )}
        {isDirect && remaining > 0 && (
          <Text size="sm" c="dimmed">
            Le solde de <strong>{money(remaining)}</strong> sera créé en
            paiement brouillon, à encaisser avant l'arrivée.
          </Text>
        )}
        {isDirect && (
          <Text size="xs" c="dimmed">
            Le client reçoit un email de confirmation.
          </Text>
        )}

        <Group justify="flex-end">
          <Button type="submit" loading={mutation.isPending}>
            Valider la réservation
          </Button>
        </Group>
      </Stack>
    </form>
  );
};

export default ValidateBookingModal;
