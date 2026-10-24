import { useMemo, useState } from "react";
import {
  Card,
  Group,
  SegmentedControl,
  Select,
  SimpleGrid,
  Stack,
  Switch,
  Table,
  Text,
  Title,
  Tooltip,
} from "@mantine/core";
import { BarChart } from "@mantine/charts";
import {
  IconCash,
  IconClockHour4,
  IconInfoCircle,
  IconReceiptTax,
} from "@tabler/icons-react";
import { useRevenue } from "../api/queries";
import PageHeader from "../components/PageHeader";
import QueryState from "../components/QueryState";
import StatCard from "../components/StatCard";
import { MONTHS, money } from "../utils/format";
import { revenueAmount } from "./amount";

const CHANNELS = [
  { key: "Classique", label: "Directes" },
  { key: "Booking", label: "Booking" },
  { key: "AirBnb", label: "Airbnb" },
];

const BASIS_HELP = {
  stay: "Chaque paiement est compté dans l'année d'arrivée du séjour.",
  payment:
    "Chaque paiement est compté dans l'année où il est encaissé (ou attendu, pour un brouillon).",
};

const RevenuePage = () => {
  const [basis, setBasis] = useState("stay");
  const [withDrafts, setWithDrafts] = useState(true);
  const [withTax, setWithTax] = useState(true);
  const [selectedYear, setSelectedYear] = useState(null);
  const revenue = useRevenue(basis);

  const options = { withDrafts, withTax };
  const years = revenue.data?.years ?? [];
  const year =
    years.find((y) => String(y.year) === selectedYear) ??
    years.find((y) => y.year === new Date().getFullYear()) ??
    years[0];

  const monthly = useMemo(
    () =>
      (year?.months ?? []).map((m) => {
        const confirmed = revenueAmount(m, { withDrafts: false, withTax });
        return {
          mois: MONTHS[m.month - 1].slice(0, 4) + ".",
          Encaissé: confirmed,
          ...(withDrafts
            ? {
                Attendu:
                  Math.round((revenueAmount(m, options) - confirmed) * 100) /
                  100,
              }
            : {}),
        };
      }),
    [year, withDrafts, withTax], // eslint-disable-line react-hooks/exhaustive-deps
  );

  return (
    <>
      <PageHeader title="Chiffre d'affaires" description={BASIS_HELP[basis]} />

      <Card mb="lg" p="sm">
        <Group gap="lg" wrap="wrap">
          <SegmentedControl
            value={basis}
            onChange={setBasis}
            data={[
              { value: "stay", label: "Par année de séjour" },
              { value: "payment", label: "Par année d'encaissement" },
            ]}
          />
          <Switch
            label="Inclure les soldes attendus (brouillons)"
            checked={withDrafts}
            onChange={(e) => setWithDrafts(e.currentTarget.checked)}
          />
          <Group gap={4}>
            <Switch
              label="Inclure la taxe de séjour"
              checked={withTax}
              onChange={(e) => setWithTax(e.currentTarget.checked)}
            />
            <Tooltip
              label="Reversée à la commune : comprise dans le prix des réservations directes. Booking et Airbnb la collectent eux-mêmes."
              multiline
              w={280}
            >
              <IconInfoCircle size={16} color="var(--mantine-color-dimmed)" />
            </Tooltip>
          </Group>
        </Group>
      </Card>

      <QueryState query={revenue}>
        {() =>
          years.length === 0 ? (
            <Text c="dimmed">Aucun paiement enregistré.</Text>
          ) : (
            <Stack gap="lg">
              <Group justify="space-between">
                <Title order={4}>Année {year.year}</Title>
                <Select
                  w={120}
                  data={years.map((y) => String(y.year))}
                  value={String(year.year)}
                  onChange={setSelectedYear}
                  allowDeselect={false}
                />
              </Group>

              <SimpleGrid cols={{ base: 1, sm: 3 }}>
                <StatCard
                  label="Chiffre d'affaires"
                  value={money(revenueAmount(year, options))}
                  hint={
                    withTax ? "taxe de séjour comprise" : "hors taxe de séjour"
                  }
                  icon={IconCash}
                />
                <StatCard
                  label="Dont attendu"
                  value={money(
                    withDrafts
                      ? revenueAmount(year, options) -
                          revenueAmount(year, { ...options, withDrafts: false })
                      : 0,
                  )}
                  hint={
                    withDrafts ? "soldes en brouillon" : "brouillons exclus"
                  }
                  icon={IconClockHour4}
                  color="orange"
                />
                <StatCard
                  label="Taxe de séjour"
                  value={money(
                    year.tax_confirmed + (withDrafts ? year.tax_draft : 0),
                  )}
                  hint="à reverser"
                  icon={IconReceiptTax}
                  color="gray"
                />
              </SimpleGrid>

              <Card>
                <Text fw={600} mb="md">
                  Par mois
                </Text>
                <BarChart
                  h={280}
                  data={monthly}
                  dataKey="mois"
                  type="stacked"
                  valueFormatter={(v) => money(v)}
                  series={[
                    { name: "Encaissé", color: "lagon.7" },
                    ...(withDrafts
                      ? [{ name: "Attendu", color: "orange.5" }]
                      : []),
                  ]}
                  withLegend
                />
              </Card>

              <Card p={0}>
                <Text fw={600} p="md" pb={0}>
                  Par année
                </Text>
                <Table.ScrollContainer minWidth={700}>
                  <Table>
                    <Table.Thead>
                      <Table.Tr>
                        <Table.Th>Année</Table.Th>
                        {CHANNELS.map((c) => (
                          <Table.Th key={c.key} ta="right">
                            {c.label}
                          </Table.Th>
                        ))}
                        {withDrafts && (
                          <Table.Th ta="right">dont attendu</Table.Th>
                        )}
                        <Table.Th ta="right">Total</Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                      {years.map((y) => (
                        <Table.Tr
                          key={y.year}
                          onClick={() => setSelectedYear(String(y.year))}
                          style={{ cursor: "pointer" }}
                          bg={
                            y.year === year.year
                              ? "var(--mantine-color-lagon-light)"
                              : undefined
                          }
                        >
                          <Table.Td fw={600}>{y.year}</Table.Td>
                          {CHANNELS.map((c) => (
                            <Table.Td key={c.key} ta="right">
                              {money(revenueAmount(y.by_type[c.key], options))}
                            </Table.Td>
                          ))}
                          {withDrafts && (
                            <Table.Td ta="right" c="orange">
                              {money(
                                revenueAmount(y, options) -
                                  revenueAmount(y, {
                                    ...options,
                                    withDrafts: false,
                                  }),
                              )}
                            </Table.Td>
                          )}
                          <Table.Td ta="right" fw={700}>
                            {money(revenueAmount(y, options))}
                          </Table.Td>
                        </Table.Tr>
                      ))}
                    </Table.Tbody>
                  </Table>
                </Table.ScrollContainer>
              </Card>
            </Stack>
          )
        }
      </QueryState>
    </>
  );
};

export default RevenuePage;
