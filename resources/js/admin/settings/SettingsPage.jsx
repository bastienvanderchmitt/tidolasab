import { useEffect } from "react";
import {
  ActionIcon,
  Alert,
  Button,
  Card,
  Chip,
  Group,
  NumberInput,
  SimpleGrid,
  Stack,
  Table,
  Text,
  Title,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import {
  IconDeviceFloppy,
  IconInfoCircle,
  IconPlus,
  IconTrash,
} from "@tabler/icons-react";
import { settingsApi, useApiMutation, useSettings } from "../api/queries";
import PageHeader from "../components/PageHeader";
import QueryState from "../components/QueryState";
import { MONTHS, dayjs } from "../utils/format";

const euro = {
  suffix: " €",
  decimalScale: 2,
  min: 0,
  decimalSeparator: ",",
  thousandSeparator: " ",
};

const Section = ({ title, description, children }) => (
  <Card>
    <Title order={4}>{title}</Title>
    {description && (
      <Text size="sm" c="dimmed" mb="md">
        {description}
      </Text>
    )}
    {children}
  </Card>
);

const SettingsForm = ({ settings }) => {
  const mutation = useApiMutation(settingsApi.update, "Réglages enregistrés");

  const form = useForm({
    initialValues: {
      ...settings,
      low_season_months: settings.low_season_months.map(String),
      minimum_stay_periods: settings.minimum_stay_periods.map((p) => ({
        ...p,
        range: [p.start, p.end],
      })),
    },
  });

  useEffect(() => {
    form.resetDirty();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const submit = form.onSubmit((values) => {
    const payload = {
      ...values,
      low_season_months: values.low_season_months.map(Number),
      minimum_stay_periods: values.minimum_stay_periods.map(
        ({ range, nights }) => ({
          start: range[0],
          end: range[1],
          nights,
        }),
      ),
    };

    mutation.mutate(payload, {
      onSuccess: () => form.resetDirty(),
      // Les clés d'erreur du serveur (« rates.1.low »...) correspondent aux champs du formulaire
      onError: (error) => form.setErrors(error.errors ?? {}),
    });
  });

  const nextYear =
    Math.max(dayjs().year(), ...form.values.rates.map((r) => r.from_year)) + 1;
  const fullPaymentDays = Number(form.values.balance_due_days) + 1;

  return (
    <form onSubmit={submit}>
      <Stack gap="lg">
        <Alert variant="light" icon={<IconInfoCircle size={18} />}>
          Les changements s'appliquent immédiatement aux nouvelles réservations
          du site. Les réservations existantes gardent leur prix.
        </Alert>

        <Section
          title="Tarifs par nuit"
          description="Le tarif appliqué est celui de la dernière ligne dont l'année est atteinte par la date d'arrivée."
        >
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Arrivées à partir de</Table.Th>
                <Table.Th>Basse saison</Table.Th>
                <Table.Th>Haute saison</Table.Th>
                <Table.Th />
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {form.values.rates.map((rate, index) => (
                <Table.Tr key={index}>
                  <Table.Td>
                    {rate.from_year === 0 && index === 0 ? (
                      <Text size="sm">Tarif de base</Text>
                    ) : (
                      <NumberInput
                        min={2000}
                        max={2100}
                        w={110}
                        {...form.getInputProps(`rates.${index}.from_year`)}
                      />
                    )}
                  </Table.Td>
                  <Table.Td>
                    <NumberInput
                      w={130}
                      {...euro}
                      {...form.getInputProps(`rates.${index}.low`)}
                    />
                  </Table.Td>
                  <Table.Td>
                    <NumberInput
                      w={130}
                      {...euro}
                      {...form.getInputProps(`rates.${index}.high`)}
                    />
                  </Table.Td>
                  <Table.Td ta="right">
                    {form.values.rates.length > 1 && (
                      <ActionIcon
                        variant="subtle"
                        color="red"
                        aria-label="Retirer"
                        onClick={() => form.removeListItem("rates", index)}
                      >
                        <IconTrash size={16} />
                      </ActionIcon>
                    )}
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
          <Button
            variant="subtle"
            leftSection={<IconPlus size={16} />}
            mt="xs"
            onClick={() => {
              const last = form.values.rates[form.values.rates.length - 1];
              form.insertListItem("rates", {
                from_year: nextYear,
                low: last.low,
                high: last.high,
              });
            }}
          >
            Ajouter une année
          </Button>
        </Section>

        <SimpleGrid cols={{ base: 1, md: 2 }}>
          <Section
            title="Saisons"
            description="Mois en basse saison ; les autres mois sont facturés au tarif haute saison."
          >
            <Chip.Group multiple {...form.getInputProps("low_season_months")}>
              <Group gap={6}>
                {MONTHS.map((month, index) => (
                  <Chip key={month} value={String(index + 1)} size="sm">
                    {month}
                  </Chip>
                ))}
              </Group>
            </Chip.Group>
          </Section>

          <Section title="Taxe de séjour et remise">
            <Stack>
              <NumberInput
                label="Taxe de séjour"
                description="Par adulte et par nuit, ajoutée au prix des réservations directes"
                {...euro}
                {...form.getInputProps("tourist_tax")}
              />
              <NumberInput
                label="Remise longue durée"
                description="Une demi-nuit offerte par tranche de N nuits (0 = pas de remise)"
                suffix=" nuits"
                min={0}
                max={365}
                {...form.getInputProps("discount_nights_threshold")}
              />
            </Stack>
          </Section>
        </SimpleGrid>

        <Section
          title="Durées minimales"
          description="Appliquées aux réservations du site, pas à celles saisies dans l'admin."
        >
          <NumberInput
            label="Durée minimale d'un séjour"
            suffix=" nuits"
            min={1}
            max={60}
            w={240}
            mb="md"
            {...form.getInputProps("minimum_nights")}
          />

          <Text size="sm" fw={500} mb={4}>
            Périodes avec une durée minimale plus longue
          </Text>
          <Stack gap="xs">
            {form.values.minimum_stay_periods.length === 0 && (
              <Text size="sm" c="dimmed">
                Aucune période.
              </Text>
            )}
            {form.values.minimum_stay_periods.map((period, index) => (
              <Group key={index} align="flex-start" gap="sm">
                <DatePickerInput
                  type="range"
                  placeholder="Début – fin"
                  valueFormat="D MMM YYYY"
                  w={280}
                  {...form.getInputProps(`minimum_stay_periods.${index}.range`)}
                  error={
                    form.errors[`minimum_stay_periods.${index}.end`] ||
                    form.errors[`minimum_stay_periods.${index}.start`]
                  }
                />
                <NumberInput
                  suffix=" nuits min."
                  min={1}
                  max={60}
                  w={150}
                  {...form.getInputProps(
                    `minimum_stay_periods.${index}.nights`,
                  )}
                />
                <ActionIcon
                  variant="subtle"
                  color="red"
                  mt={6}
                  aria-label="Retirer la période"
                  onClick={() =>
                    form.removeListItem("minimum_stay_periods", index)
                  }
                >
                  <IconTrash size={16} />
                </ActionIcon>
              </Group>
            ))}
          </Stack>
          <Button
            variant="subtle"
            leftSection={<IconPlus size={16} />}
            mt="xs"
            onClick={() =>
              form.insertListItem("minimum_stay_periods", {
                range: [null, null],
                nights: 4,
              })
            }
          >
            Ajouter une période
          </Button>
        </Section>

        <Section title="Acompte et solde">
          <SimpleGrid cols={{ base: 1, sm: 2 }}>
            <NumberInput
              label="Acompte demandé à la réservation"
              suffix=" %"
              min={0}
              max={100}
              {...form.getInputProps("deposit_percent")}
            />
            <NumberInput
              label="Solde à régler avant l'arrivée"
              suffix=" jours"
              min={0}
              max={90}
              {...form.getInputProps("balance_due_days")}
            />
          </SimpleGrid>
          <Text size="sm" c="dimmed" mt="sm">
            Pour une arrivée dans moins de {fullPaymentDays} jours, la totalité
            du séjour est demandée dès la réservation. Le rappel du solde part{" "}
            {form.values.balance_due_days} jours avant l'arrivée.
          </Text>
        </Section>

        <Group justify="flex-end" pos="sticky" bottom={16}>
          <Button
            type="submit"
            size="md"
            leftSection={<IconDeviceFloppy size={18} />}
            loading={mutation.isPending}
            disabled={!form.isDirty()}
            style={{ boxShadow: "var(--mantine-shadow-md)" }}
          >
            Enregistrer les réglages
          </Button>
        </Group>
      </Stack>
    </form>
  );
};

const SettingsPage = () => {
  const settings = useSettings();

  return (
    <>
      <PageHeader
        title="Réglages"
        description="Tarifs, saisons, taxe de séjour, durées minimales et acompte"
      />
      <QueryState query={settings}>
        {(data) => <SettingsForm settings={data} />}
      </QueryState>
    </>
  );
};

export default SettingsPage;
