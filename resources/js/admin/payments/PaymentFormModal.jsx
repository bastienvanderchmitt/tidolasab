import { useMemo } from "react";
import {
  Alert,
  Button,
  Group,
  NumberInput,
  SegmentedControl,
  Select,
  Stack,
  Textarea,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import { IconInfoCircle } from "@tabler/icons-react";
import { paymentApi, useApiMutation, useBookings } from "../api/queries";
import { PAYMENT_METHODS, isRefund } from "../utils/labels";
import { isoDate, money, shortDate, dayjs } from "../utils/format";

/**
 * Ajout ou modification d'un paiement ou d'un remboursement (enregistré en montant
 * négatif). Pour un brouillon, seuls l'échéance, le moyen et la note se modifient :
 * son montant suit le prix de la réservation.
 */
const PaymentForm = ({ payment, bookingId, refund, onDone }) => {
  const isDraft = payment?.statut === "brouillon";
  const bookings = useBookings();
  const mutation = useApiMutation(paymentApi.save, (data) =>
    data.deposit < 0
      ? payment
        ? "Remboursement modifié"
        : "Remboursement enregistré"
      : payment
        ? "Paiement modifié"
        : "Paiement enregistré",
  );

  const form = useForm({
    initialValues: {
      kind: (payment ? isRefund(payment) : refund) ? "refund" : "payment",
      booking: String(payment?.id_reservation ?? bookingId ?? ""),
      deposit: payment ? Math.abs(Number(payment.montant_paiement)) : "",
      date: payment?.date_paiement ?? isoDate(new Date()),
      type: payment?.moyen_paiement ?? "virement",
      note: payment?.note ?? "",
    },
    validate: {
      booking: (v) => (v ? null : "Choisissez la réservation"),
      deposit: (v, values) => {
        if (!(v > 0)) return "Indiquez un montant positif";
        // À la création, le serveur refuserait un remboursement trop élevé
        const max = Number(selected(values.booking)?.remboursable ?? 0);
        return values.kind === "refund" && !payment && v > max
          ? `Au plus ${money(max)} remboursables sur cette réservation`
          : null;
      },
      date: (v) => (v ? null : "Indiquez la date"),
    },
  });

  const selected = (id) =>
    (bookings.data ?? []).find((b) => String(b.id) === id);
  const isRefundForm = form.values.kind === "refund";
  const booking = selected(form.values.booking);

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
        booking: Number(values.booking),
        deposit: values.kind === "refund" ? -values.deposit : values.deposit,
        date: values.date,
        type: values.type,
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
            Paiement attendu : son montant suit automatiquement le prix de la
            réservation.
          </Alert>
        )}
        {!isDraft && (
          <SegmentedControl
            data={[
              { value: "payment", label: "Paiement reçu" },
              { value: "refund", label: "Remboursement" },
            ]}
            {...form.getInputProps("kind")}
          />
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
          label={isRefundForm ? "Montant remboursé" : "Montant reçu"}
          suffix=" €"
          min={0}
          allowNegative={false}
          decimalScale={2}
          thousandSeparator=" "
          decimalSeparator=","
          disabled={isDraft}
          description={
            isRefundForm && booking && !payment
              ? `Remboursable : ${money(booking.remboursable)}`
              : undefined
          }
          {...form.getInputProps("deposit")}
        />
        {isRefundForm && !payment && booking?.statut === "validée" && (
          <Alert color="gray" icon={<IconInfoCircle size={18} />}>
            Séjour maintenu : seul le trop-perçu se rembourse. Pour un geste
            commercial, baissez d'abord le prix de la réservation.
          </Alert>
        )}
        <Group grow>
          <DatePickerInput
            label={
              isDraft
                ? "Échéance"
                : isRefundForm
                  ? "Date du remboursement"
                  : "Date du paiement"
            }
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

export const openPaymentForm = ({
  payment,
  bookingId,
  refund = false,
} = {}) => {
  const id = modals.open({
    title: payment
      ? isRefund(payment)
        ? "Modifier le remboursement"
        : "Modifier le paiement"
      : refund
        ? "Nouveau remboursement"
        : "Nouveau paiement",
    children: (
      <PaymentForm
        payment={payment}
        bookingId={bookingId}
        refund={refund}
        onDone={() => modals.close(id)}
      />
    ),
  });
};
