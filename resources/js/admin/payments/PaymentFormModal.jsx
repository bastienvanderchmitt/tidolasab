import { useMemo } from "react";
import {
  Alert,
  Button,
  Group,
  NumberInput,
  Select,
  Stack,
  Textarea,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import { IconInfoCircle } from "@tabler/icons-react";
import { paymentApi, useApiMutation, useBookings } from "../api/queries";
import { PAYMENT_METHODS } from "../utils/labels";
import { isoDate, shortDate, dayjs } from "../utils/format";

/**
 * Ajout ou modification d'un paiement. Pour un brouillon, seuls l'échéance,
 * le moyen et la note se modifient : son montant suit le prix de la réservation.
 */
const PaymentForm = ({ payment, bookingId, onDone }) => {
  const isDraft = payment?.statut === "brouillon";
  const bookings = useBookings();
  const mutation = useApiMutation(
    paymentApi.save,
    payment ? "Paiement modifié" : "Paiement enregistré",
  );

  const form = useForm({
    initialValues: {
      booking: String(payment?.id_reservation ?? bookingId ?? ""),
      deposit: payment ? Number(payment.montant_paiement) : 0,
      date: payment?.date_paiement ?? isoDate(new Date()),
      type: payment?.moyen_paiement ?? "virement",
      note: payment?.note ?? "",
    },
    validate: {
      booking: (v) => (v ? null : "Choisissez la réservation"),
      deposit: (v) => (v !== "" && v !== null ? null : "Indiquez le montant"),
      date: (v) => (v ? null : "Indiquez la date"),
    },
  });

  const bookingOptions = useMemo(
    () =>
      (bookings.data ?? [])
        .filter((b) => b.type !== "Fermeture")
        .map((b) => ({
          value: String(b.id),
          label: `${b.nom_client || "Sans client"} · ${shortDate(b.date_arrivee)} ${dayjs(b.date_arrivee).year()}`,
        })),
    [bookings.data],
  );

  const submit = form.onSubmit((values) =>
    mutation.mutate(
      {
        id: payment?.id,
        ...values,
        booking: Number(values.booking),
        note: values.note || null,
      },
      { onSuccess: onDone },
    ),
  );

  return (
    <form onSubmit={submit}>
      <Stack>
        {isDraft && (
          <Alert color="orange" icon={<IconInfoCircle size={18} />}>
            Solde attendu : son montant suit automatiquement le prix de la
            réservation.
          </Alert>
        )}
        <Select
          label="Réservation"
          searchable
          disabled={isDraft}
          data={bookingOptions}
          nothingFoundMessage="Aucune réservation"
          {...form.getInputProps("booking")}
        />
        <NumberInput
          label="Montant"
          suffix=" €"
          decimalScale={2}
          thousandSeparator=" "
          decimalSeparator=","
          disabled={isDraft}
          description="Un montant négatif correspond à un remboursement"
          {...form.getInputProps("deposit")}
        />
        <Group grow>
          <DatePickerInput
            label={isDraft ? "Échéance" : "Date du paiement"}
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
        <Textarea
          label="Note"
          autosize
          minRows={2}
          {...form.getInputProps("note")}
        />
        <Group justify="flex-end">
          <Button type="submit" loading={mutation.isPending}>
            Enregistrer
          </Button>
        </Group>
      </Stack>
    </form>
  );
};

export const openPaymentForm = ({ payment, bookingId } = {}) => {
  const id = modals.open({
    title: payment ? "Modifier le paiement" : "Nouveau paiement",
    children: (
      <PaymentForm
        payment={payment}
        bookingId={bookingId}
        onDone={() => modals.close(id)}
      />
    ),
  });
};
