import { useEffect, useMemo, useRef } from "react";
import {
  Button,
  Group,
  NumberInput,
  SegmentedControl,
  Select,
  SimpleGrid,
  Stack,
  Text,
  Textarea,
  TextInput,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import {
  bookingApi,
  useApiMutation,
  useClients,
  useQuote,
} from "../api/queries";
import { BOOKING_TYPES } from "../utils/labels";
import { dayjs, nights } from "../utils/format";

const TYPE_OPTIONS = Object.entries(BOOKING_TYPES).map(
  ([value, { label }]) => ({ value, label }),
);

const moneyInput = {
  suffix: " €",
  decimalScale: 2,
  min: 0,
  thousandSeparator: " ",
  decimalSeparator: ",",
};

/**
 * Création ou modification d'une réservation depuis l'admin.
 * Pour une réservation directe, le prix et la taxe sont proposés par le calcul serveur.
 */
const BookingFormModal = ({ booking, defaults = {}, onDone }) => {
  const isEdit = !!booking;
  const clients = useClients();
  const mutation = useApiMutation(
    isEdit ? bookingApi.update : bookingApi.create,
    isEdit ? "Réservation modifiée" : "Réservation créée",
  );

  const form = useForm({
    initialValues: {
      type: booking?.type ?? defaults.type ?? "Classique",
      dates: [
        booking?.date_arrivee ?? defaults.checkIn ?? null,
        booking?.date_depart ?? defaults.checkOut ?? null,
      ],
      adults: booking?.adultes ?? 2,
      children: booking?.enfants ?? 0,
      total: booking ? Number(booking.prix_total) : 0,
      touristTax: booking ? Number(booking.taxe_sejour) : 0,
      note: booking?.note ?? "",
      clientMode: "new",
      clientId: null,
      name: "",
      firstName: "",
      email: "",
      phone: "",
      address: "",
      language: "fr",
    },
    validate: {
      dates: ([start, end]) =>
        start && end && dayjs(end).isAfter(start)
          ? null
          : "Choisissez les dates d'arrivée et de départ",
      adults: (v, values) =>
        values.type === "Fermeture" || v >= 1 ? null : "Au moins un adulte",
      clientId: (v, values) =>
        !isEdit &&
        values.type !== "Fermeture" &&
        values.clientMode === "existing" &&
        !v
          ? "Choisissez un client"
          : null,
      name: (v, values) =>
        !isEdit &&
        values.type !== "Fermeture" &&
        values.clientMode === "new" &&
        !v
          ? "Indiquez le nom"
          : null,
      email: (v) => (!v || /^\S+@\S+\.\S+$/.test(v) ? null : "Email invalide"),
    },
  });

  const { type, dates, adults } = form.values;
  const [checkIn, checkOut] = dates;
  const isClosure = type === "Fermeture";
  const isDirect = type === "Classique";
  const nightCount =
    checkIn && checkOut ? dayjs(checkOut).diff(checkIn, "day") : 0;

  // Prix proposé pour une réservation directe, recalculé quand le séjour change.
  // En modification, le prix enregistré est gardé tant que le séjour ne change pas.
  const quoteParams = { checkIn, checkOut, adults: Math.max(1, adults) };
  const quote = useQuote(
    quoteParams,
    isDirect && !!checkIn && !!checkOut && nightCount > 0,
  );
  const savedStay = useRef(isEdit ? JSON.stringify(quoteParams) : null);
  useEffect(() => {
    if (!isDirect || !quote.data) return;
    if (JSON.stringify(quoteParams) === savedStay.current) return;
    savedStay.current = null;
    form.setFieldValue("total", quote.data.total);
    form.setFieldValue("touristTax", quote.data.tourist_tax);
  }, [quote.data, isDirect]); // eslint-disable-line react-hooks/exhaustive-deps

  const clientOptions = useMemo(
    () =>
      (clients.data ?? []).map((c) => ({
        value: String(c.id),
        label: [`${c.nom} ${c.prenom}`.trim(), c.email]
          .filter(Boolean)
          .join(" · "),
      })),
    [clients.data],
  );

  const submit = form.onSubmit((values) => {
    const payload = {
      checkIn: values.dates[0],
      checkOut: values.dates[1],
      adults: values.adults,
      children: values.children,
      type: values.type,
      total: isClosure ? 0 : values.total,
      touristTax: isDirect ? values.touristTax : 0,
      note: values.note || null,
    };

    if (isEdit) {
      mutation.mutate({ id: booking.id, ...payload }, { onSuccess: onDone });
      return;
    }

    if (!isClosure) {
      Object.assign(
        payload,
        values.clientMode === "existing"
          ? { clientId: Number(values.clientId) }
          : {
              name: values.name,
              firstName: values.firstName,
              email: values.email || null,
              phone: values.phone || null,
              address: values.address || null,
              language: values.language,
            },
      );
    }

    mutation.mutate(payload, { onSuccess: onDone });
  });

  return (
    <form onSubmit={submit}>
      <Stack>
        <SegmentedControl
          fullWidth
          data={TYPE_OPTIONS}
          {...form.getInputProps("type")}
        />

        <DatePickerInput
          type="range"
          label="Séjour"
          placeholder="Arrivée – départ"
          valueFormat="D MMM YYYY"
          allowSingleDateInRange={false}
          {...form.getInputProps("dates")}
          description={nightCount > 0 ? nights(nightCount) : null}
        />

        {!isClosure && (
          <SimpleGrid cols={2}>
            <NumberInput
              label="Adultes"
              min={1}
              max={20}
              {...form.getInputProps("adults")}
            />
            <NumberInput
              label="Enfants"
              min={0}
              max={20}
              {...form.getInputProps("children")}
            />
          </SimpleGrid>
        )}

        {!isClosure && (
          <SimpleGrid cols={isDirect ? 2 : 1}>
            <NumberInput
              label="Prix total"
              description={
                isDirect
                  ? "Proposé selon les tarifs, modifiable"
                  : "Montant versé par la plateforme"
              }
              {...moneyInput}
              {...form.getInputProps("total")}
            />
            {isDirect && (
              <NumberInput
                label="dont taxe de séjour"
                description="Comprise dans le prix"
                {...moneyInput}
                {...form.getInputProps("touristTax")}
              />
            )}
          </SimpleGrid>
        )}

        {!isEdit && !isClosure && (
          <>
            <SegmentedControl
              data={[
                { value: "new", label: "Nouveau client" },
                { value: "existing", label: "Client existant" },
              ]}
              {...form.getInputProps("clientMode")}
            />
            {form.values.clientMode === "existing" ? (
              <Select
                label="Client"
                placeholder="Rechercher un client"
                searchable
                nothingFoundMessage="Aucun client"
                data={clientOptions}
                {...form.getInputProps("clientId")}
              />
            ) : (
              <>
                <SimpleGrid cols={2}>
                  <TextInput label="Nom" {...form.getInputProps("name")} />
                  <TextInput
                    label="Prénom"
                    {...form.getInputProps("firstName")}
                  />
                  <TextInput
                    label="Email"
                    type="email"
                    {...form.getInputProps("email")}
                  />
                  <TextInput
                    label="Téléphone"
                    {...form.getInputProps("phone")}
                  />
                </SimpleGrid>
                <TextInput label="Adresse" {...form.getInputProps("address")} />
                <Select
                  label="Langue des emails"
                  data={[
                    { value: "fr", label: "Français" },
                    { value: "en", label: "Anglais" },
                  ]}
                  allowDeselect={false}
                  {...form.getInputProps("language")}
                />
              </>
            )}
            {isDirect && (
              <Text size="xs" c="dimmed">
                Si le client a un email, il reçoit la confirmation de
                réservation avec le RIB et le contrat.
              </Text>
            )}
          </>
        )}

        <Textarea
          label="Note"
          autosize
          minRows={2}
          {...form.getInputProps("note")}
        />

        <Group justify="flex-end">
          <Button type="submit" loading={mutation.isPending}>
            {isEdit ? "Enregistrer" : "Créer la réservation"}
          </Button>
        </Group>
      </Stack>
    </form>
  );
};

export default BookingFormModal;
