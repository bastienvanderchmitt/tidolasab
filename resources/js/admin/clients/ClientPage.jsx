import { Link, useParams } from "react-router-dom";
import {
  Anchor,
  Breadcrumbs,
  Button,
  Card,
  Grid,
  Group,
  SimpleGrid,
  Stack,
  Table,
  Text,
  Title,
} from "@mantine/core";
import {
  IconBed,
  IconCash,
  IconClockHour4,
  IconEdit,
  IconHourglass,
  IconMail,
  IconMapPin,
  IconPhone,
  IconPlus,
} from "@tabler/icons-react";
import { useClient } from "../api/queries";
import QueryState from "../components/QueryState";
import StatCard from "../components/StatCard";
import {
  PaymentStatusBadge,
  StatusBadge,
  TypeBadge,
} from "../components/Badges";
import { date, daysUntil, money, nights, shortDate } from "../utils/format";
import { isRefund, methodLabel } from "../utils/labels";
import { openClientForm } from "./ClientFormModal";
import { openPaymentForm } from "../payments/PaymentFormModal";
import { useConfirmDraft } from "../payments/ConfirmDraftModal";

const Contact = ({ icon: Icon, children, href }) =>
  children ? (
    <Group gap="xs" wrap="nowrap">
      <Icon size={16} color="var(--mantine-color-dimmed)" />
      {href ? (
        <Anchor href={href} size="sm">
          {children}
        </Anchor>
      ) : (
        <Text size="sm">{children}</Text>
      )}
    </Group>
  ) : null;

const ClientPage = () => {
  const { id } = useParams();
  const query = useClient(id);
  const confirmDraft = useConfirmDraft();

  return (
    <QueryState query={query}>
      {(client) => {
        const confirmed = client.payments.filter(
          (p) => p.statut === "confirmé",
        );
        const drafts = client.payments.filter((p) => p.statut === "brouillon");
        const sum = (list) =>
          list.reduce((total, p) => total + Number(p.montant_paiement), 0);
        const fullName = `${client.nom} ${client.prenom}`.trim();
        // Une demande en attente peut ne jamais aboutir : elle n'est pas comptée dans « Attendu »
        const pending = client.bookings.filter(
          (b) => b.statut === "en attente",
        );
        const toConfirm = pending.reduce(
          (total, b) => total + Number(b.prix_total),
          0,
        );

        return (
          <Stack gap="lg">
            <Breadcrumbs>
              <Anchor component={Link} to="/clients" size="sm">
                Clients
              </Anchor>
              <Text size="sm">{fullName}</Text>
            </Breadcrumbs>

            <Group justify="space-between">
              <Title order={2}>{fullName}</Title>
              <Button
                variant="default"
                leftSection={<IconEdit size={16} />}
                onClick={() => openClientForm(client)}
              >
                Modifier
              </Button>
            </Group>

            <Grid>
              <Grid.Col span={{ base: 12, md: 4 }}>
                <Card h="100%">
                  <Stack gap="sm">
                    <Contact
                      icon={IconMail}
                      href={client.email ? `mailto:${client.email}` : null}
                    >
                      {client.email}
                    </Contact>
                    <Contact
                      icon={IconPhone}
                      href={client.telephone ? `tel:${client.telephone}` : null}
                    >
                      {client.telephone}
                    </Contact>
                    <Contact icon={IconMapPin}>{client.adresse}</Contact>
                    <Text size="xs" c="dimmed">
                      Emails en{" "}
                      {client.language === "en" ? "anglais" : "français"}
                    </Text>
                    {client.note && (
                      <Text size="sm" style={{ whiteSpace: "pre-line" }}>
                        {client.note}
                      </Text>
                    )}
                  </Stack>
                </Card>
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 8 }}>
                <SimpleGrid cols={{ base: 1, sm: 2 }}>
                  <StatCard
                    label="Séjours"
                    value={client.bookings.length}
                    icon={IconBed}
                  />
                  <StatCard
                    label="Encaissé"
                    value={money(sum(confirmed))}
                    hint="Paiements reçus, remboursements déduits"
                    icon={IconCash}
                  />
                  <StatCard
                    label="Attendu"
                    value={money(sum(drafts))}
                    hint="Soldes et versements des séjours validés"
                    icon={IconClockHour4}
                    color="orange"
                  />
                  <StatCard
                    label="À confirmer"
                    value={money(toConfirm)}
                    hint={
                      pending.length
                        ? `${pending.length} demande${pending.length > 1 ? "s" : ""} en attente de validation`
                        : "Aucune demande en attente"
                    }
                    icon={IconHourglass}
                    color="yellow"
                  />
                </SimpleGrid>
              </Grid.Col>
            </Grid>

            <Card p={0}>
              <Group justify="space-between" p="md" pb="xs">
                <Title order={4}>Réservations</Title>
              </Group>
              <Table.ScrollContainer minWidth={600}>
                <Table>
                  <Table.Tbody>
                    {client.bookings.map((b) => (
                      <Table.Tr key={b.id}>
                        <Table.Td>
                          <Anchor
                            component={Link}
                            to={`/reservations?id=${b.id}`}
                            size="sm"
                            fw={500}
                          >
                            {shortDate(b.date_arrivee)} → {date(b.date_depart)}
                          </Anchor>
                          <Text size="xs" c="dimmed">
                            {nights(b.nombre_nuits)}
                          </Text>
                        </Table.Td>
                        <Table.Td>
                          <TypeBadge type={b.type} />
                        </Table.Td>
                        <Table.Td>
                          <StatusBadge status={b.statut} />
                        </Table.Td>
                        <Table.Td ta="right">{money(b.prix_total)}</Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </Table.ScrollContainer>
            </Card>

            <Card p={0}>
              <Group justify="space-between" p="md" pb="xs">
                <Title order={4}>Paiements</Title>
                {client.bookings.length > 0 && (
                  <Button
                    size="xs"
                    variant="light"
                    leftSection={<IconPlus size={14} />}
                    onClick={() =>
                      openPaymentForm({ bookingId: client.bookings[0].id })
                    }
                  >
                    Ajouter
                  </Button>
                )}
              </Group>
              {client.payments.length === 0 ? (
                <Text c="dimmed" size="sm" p="md" pt={0}>
                  Aucun paiement.
                </Text>
              ) : (
                <Table.ScrollContainer minWidth={600}>
                  <Table>
                    <Table.Tbody>
                      {client.payments.map((p) => (
                        <Table.Tr key={p.id}>
                          <Table.Td>
                            <Text size="sm">{date(p.date_paiement)}</Text>
                            <Text size="xs" c="dimmed">
                              {methodLabel(p.moyen_paiement)}
                              {p.note ? ` · ${p.note}` : ""}
                            </Text>
                          </Table.Td>
                          <Table.Td>
                            <PaymentStatusBadge
                              status={p.statut}
                              overdue={
                                p.statut === "brouillon" &&
                                daysUntil(p.date_paiement) < 0
                              }
                              refund={isRefund(p)}
                            />
                          </Table.Td>
                          <Table.Td
                            ta="right"
                            fw={500}
                            c={isRefund(p) ? "grape" : undefined}
                          >
                            {money(p.montant_paiement)}
                          </Table.Td>
                          <Table.Td ta="right">
                            {p.statut === "brouillon" ? (
                              <Button
                                size="compact-xs"
                                variant="light"
                                onClick={() =>
                                  confirmDraft({
                                    ...p,
                                    nom_client: fullName,
                                    type_reservation: client.bookings.find(
                                      (b) => b.id === p.id_reservation,
                                    )?.type,
                                  })
                                }
                              >
                                Encaisser
                              </Button>
                            ) : (
                              <Button
                                size="compact-xs"
                                variant="subtle"
                                onClick={() => openPaymentForm({ payment: p })}
                              >
                                Modifier
                              </Button>
                            )}
                          </Table.Td>
                        </Table.Tr>
                      ))}
                    </Table.Tbody>
                  </Table>
                </Table.ScrollContainer>
              )}
            </Card>
          </Stack>
        );
      }}
    </QueryState>
  );
};

export default ClientPage;
