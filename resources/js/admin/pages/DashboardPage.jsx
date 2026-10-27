import { Link } from "react-router-dom";
import {
  Anchor,
  Badge,
  Button,
  Card,
  Group,
  SimpleGrid,
  Stack,
  Table,
  Text,
  Title,
} from "@mantine/core";
import {
  IconBed,
  IconCalendarStats,
  IconCash,
  IconClockHour4,
} from "@tabler/icons-react";
import { useDashboard, useRevenue } from "../api/queries";
import PageHeader from "../components/PageHeader";
import StatCard from "../components/StatCard";
import QueryState from "../components/QueryState";
import { PaymentStatusBadge, TypeBadge } from "../components/Badges";
import { daysUntil, guests, money, nights, shortDate } from "../utils/format";
import { revenueAmount } from "../revenue/amount";
import { useBookingActions } from "../bookings/useBookingActions";
import { useConfirmDraft } from "../payments/ConfirmDraftModal";

const Section = ({ title, action, children }) => (
  <Card>
    <Group justify="space-between" mb="sm">
      <Title order={4}>{title}</Title>
      {action}
    </Group>
    {children}
  </Card>
);

const Empty = ({ children }) => (
  <Text c="dimmed" size="sm" py="md" ta="center">
    {children}
  </Text>
);

const DashboardPage = () => {
  const dashboard = useDashboard();
  const revenue = useRevenue("payment");
  const { openValidate } = useBookingActions();
  const confirmDraft = useConfirmDraft();
  const year = new Date().getFullYear();

  const currentYear = revenue.data?.years?.find((y) => y.year === year);

  return (
    <>
      <PageHeader
        title="Tableau de bord"
        description="Ce qui demande votre attention aujourd'hui"
      />

      <QueryState query={dashboard}>
        {(data) => {
          const overdue = data.drafts.filter(
            (d) => daysUntil(d.date_paiement) < 0,
          );
          const expected = data.drafts.reduce(
            (sum, d) => sum + Number(d.montant_paiement),
            0,
          );
          const toConfirm = data.pending_bookings.reduce(
            (sum, b) => sum + Number(b.prix_total),
            0,
          );

          return (
            <Stack gap="lg">
              <SimpleGrid cols={{ base: 1, xs: 2, lg: 4 }}>
                <StatCard
                  label={`Encaissé en ${year}`}
                  value={money(
                    revenueAmount(currentYear, {
                      withDrafts: false,
                      withTax: true,
                    }),
                  )}
                  hint="Paiements reçus cette année"
                  icon={IconCash}
                />
                <StatCard
                  label="Paiements attendus"
                  value={money(expected)}
                  hint={
                    overdue.length
                      ? `${overdue.length} en retard`
                      : `${data.drafts.length} paiement${data.drafts.length > 1 ? "s" : ""} brouillon`
                  }
                  icon={IconClockHour4}
                  color={overdue.length ? "red" : "orange"}
                />
                <StatCard
                  label={`Séjours ${year}`}
                  value={data.bookings_this_year}
                  hint={`${data.total_clients} clients au total`}
                  icon={IconBed}
                />
                <StatCard
                  label="Remplissage"
                  value={`${Math.round(data.occupancy_rate)} %`}
                  hint="Sur les 6 prochains mois"
                  icon={IconCalendarStats}
                />
              </SimpleGrid>

              <SimpleGrid cols={{ base: 1, lg: 2 }}>
                <Section
                  title="Réservations à valider"
                  action={
                    <Group gap="xs">
                      {toConfirm > 0 && (
                        <Text size="sm" c="dimmed">
                          {money(toConfirm)} à confirmer
                        </Text>
                      )}
                      <Badge color="yellow">
                        {data.pending_bookings.length}
                      </Badge>
                    </Group>
                  }
                >
                  {data.pending_bookings.length === 0 ? (
                    <Empty>Aucune réservation en attente.</Empty>
                  ) : (
                    <Stack gap="xs">
                      {data.pending_bookings.map((b) => (
                        <Group key={b.id} justify="space-between" wrap="nowrap">
                          <div>
                            <Group gap="xs" wrap="nowrap">
                              <Anchor
                                component={Link}
                                to={`/reservations?id=${b.id}`}
                                fw={600}
                              >
                                {b.nom_client || "Sans client"}
                              </Anchor>
                              <TypeBadge type={b.type} />
                            </Group>
                            <Text size="xs" c="dimmed">
                              {shortDate(b.date_arrivee)} →{" "}
                              {shortDate(b.date_depart)} ·{" "}
                              {nights(b.nombre_nuits)} · {money(b.prix_total)}
                            </Text>
                          </div>
                          <Button size="xs" onClick={() => openValidate(b)}>
                            {b.paiement_total_requis
                              ? "Valider (total)"
                              : "Valider"}
                          </Button>
                        </Group>
                      ))}
                    </Stack>
                  )}
                </Section>

                <Section
                  title="Paiements attendus"
                  action={
                    <Anchor
                      component={Link}
                      to="/paiements?statut=brouillon"
                      size="sm"
                    >
                      Tout voir
                    </Anchor>
                  }
                >
                  {data.drafts.length === 0 ? (
                    <Empty>Aucun solde en attente.</Empty>
                  ) : (
                    <Table>
                      <Table.Tbody>
                        {data.drafts.slice(0, 6).map((d) => {
                          const late = daysUntil(d.date_paiement) < 0;
                          return (
                            <Table.Tr key={d.id}>
                              <Table.Td>
                                <Text size="sm" fw={500}>
                                  {d.nom_client}
                                </Text>
                                <Text size="xs" c="dimmed">
                                  Échéance {shortDate(d.date_paiement)} ·
                                  arrivée {shortDate(d.date_arrivee)}
                                </Text>
                              </Table.Td>
                              <Table.Td>
                                <PaymentStatusBadge
                                  status="brouillon"
                                  overdue={late}
                                />
                              </Table.Td>
                              <Table.Td ta="right" fw={600}>
                                {money(d.montant_paiement)}
                              </Table.Td>
                              <Table.Td ta="right">
                                <Button
                                  size="xs"
                                  variant="light"
                                  onClick={() => confirmDraft(d)}
                                >
                                  Encaisser
                                </Button>
                              </Table.Td>
                            </Table.Tr>
                          );
                        })}
                      </Table.Tbody>
                    </Table>
                  )}
                </Section>
              </SimpleGrid>

              <Section
                title="Prochaines arrivées"
                action={
                  <Anchor component={Link} to="/planning" size="sm">
                    Planning
                  </Anchor>
                }
              >
                {data.upcoming_arrivals.length === 0 ? (
                  <Empty>Aucune arrivée prévue.</Empty>
                ) : (
                  <Table.ScrollContainer minWidth={600}>
                    <Table>
                      <Table.Thead>
                        <Table.Tr>
                          <Table.Th>Client</Table.Th>
                          <Table.Th>Séjour</Table.Th>
                          <Table.Th>Voyageurs</Table.Th>
                          <Table.Th>Type</Table.Th>
                          <Table.Th ta="right">Payé</Table.Th>
                        </Table.Tr>
                      </Table.Thead>
                      <Table.Tbody>
                        {data.upcoming_arrivals.map((b) => {
                          const days = daysUntil(b.date_arrivee);
                          return (
                            <Table.Tr key={b.id}>
                              <Table.Td>
                                <Anchor
                                  component={Link}
                                  to={`/reservations?id=${b.id}`}
                                  size="sm"
                                  fw={500}
                                >
                                  {b.nom_client}
                                </Anchor>
                              </Table.Td>
                              <Table.Td>
                                <Text size="sm">
                                  {shortDate(b.date_arrivee)} →{" "}
                                  {shortDate(b.date_depart)}
                                </Text>
                                <Text size="xs" c="dimmed">
                                  {days > 0
                                    ? `dans ${days} j`
                                    : days === 0
                                      ? "aujourd'hui"
                                      : "en cours"}
                                </Text>
                              </Table.Td>
                              <Table.Td>
                                <Text size="sm">
                                  {guests(b.adultes, b.enfants)}
                                </Text>
                              </Table.Td>
                              <Table.Td>
                                <TypeBadge type={b.type} />
                              </Table.Td>
                              <Table.Td ta="right">
                                <Text size="sm" fw={500}>
                                  {money(b.total_paye)}
                                </Text>
                                <Text size="xs" c="dimmed">
                                  sur {money(b.prix_total)}
                                </Text>
                              </Table.Td>
                            </Table.Tr>
                          );
                        })}
                      </Table.Tbody>
                    </Table>
                  </Table.ScrollContainer>
                )}
              </Section>
            </Stack>
          );
        }}
      </QueryState>
    </>
  );
};

export default DashboardPage;
