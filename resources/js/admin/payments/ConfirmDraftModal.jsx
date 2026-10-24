import { Button, Group, NumberInput, Select, Stack, Text } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import { paymentApi, useApiMutation } from "../api/queries";
import { PAYMENT_METHODS } from "../utils/labels";
import { isoDate, money } from "../utils/format";

/**
 * Encaissement d'un solde attendu. Un montant inférieur laisse un nouveau brouillon pour le reste.
 */
const ConfirmDraftForm = ({ payment, onDone }) => {
  const mutation = useApiMutation(paymentApi.confirm, "Paiement encaissé");
  const expected = Number(payment.montant_paiement);

  const form = useForm({
    initialValues: {
      deposit: expected,
      date: isoDate(new Date()),
      type: payment.moyen_paiement || "virement",
    },
    validate: {
      deposit: (v) => (v > 0 ? null : "Montant invalide"),
      date: (v) => (v ? null : "Indiquez la date"),
    },
  });

  const rest =
    Math.round((expected - Number(form.values.deposit || 0)) * 100) / 100;

  return (
    <form
      onSubmit={form.onSubmit((values) =>
        mutation.mutate({ id: payment.id, ...values }, { onSuccess: onDone }),
      )}
    >
      <Stack>
        <Text size="sm">
          Solde attendu de <strong>{money(expected)}</strong>
          {payment.nom_client ? ` pour ${payment.nom_client}` : ""}.
        </Text>
        <NumberInput
          label="Montant reçu"
          suffix=" €"
          decimalScale={2}
          min={0}
          thousandSeparator=" "
          decimalSeparator=","
          {...form.getInputProps("deposit")}
        />
        <Group grow>
          <DatePickerInput
            label="Date de réception"
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
        {rest > 0 && (
          <Text size="sm" c="dimmed">
            Il restera {money(rest)} à encaisser, en nouveau paiement brouillon.
          </Text>
        )}
        <Group justify="flex-end">
          <Button type="submit" loading={mutation.isPending}>
            Encaisser
          </Button>
        </Group>
      </Stack>
    </form>
  );
};

export const useConfirmDraft = () => (payment) => {
  const id = modals.open({
    title: "Encaisser le solde",
    children: (
      <ConfirmDraftForm payment={payment} onDone={() => modals.close(id)} />
    ),
  });
};
