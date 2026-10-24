import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ActionIcon,
  Anchor,
  Button,
  Card,
  Group,
  Menu,
  SegmentedControl,
  Select,
  SimpleGrid,
  Table,
  Text,
  TextInput,
} from "@mantine/core";
import {
  IconCash,
  IconClockHour4,
  IconDots,
  IconEdit,
  IconPlus,
  IconSearch,
  IconTrash,
} from "@tabler/icons-react";
import { paymentApi, useApiMutation, usePayments } from "../api/queries";
import PageHeader from "../components/PageHeader";
import QueryState from "../components/QueryState";
import StatCard from "../components/StatCard";
import { PaymentStatusBadge, TypeBadge } from "../components/Badges";
import { confirmAction } from "../components/confirm";
import { PAYMENT_METHODS, methodLabel } from "../utils/labels";
import { date, dayjs, daysUntil, money, shortDate } from "../utils/format";
import { useConfirmDraft } from "./ConfirmDraftModal";
import { openPaymentForm } from "./PaymentFormModal";

const isOverdue = (p) =>
  p.statut === "brouillon" && daysUntil(p.date_paiement) < 0;

const PaymentsPage = () => {
  const payments = usePayments();
  const confirmDraft = useConfirmDraft();
  const remove = useApiMutation(paymentApi.remove, "Paiement supprimé");
  const [params] = useSearchParams();
  const [status, setStatus] = useState(params.get("statut") ?? "all");
  const [year, setYear] = useState(null);
  const [method, setMethod] = useState(null);
  const [search, setSearch] = useState("");

  const years = useMemo(
    () =>
      [
        ...new Set(
          (payments.data ?? []).map((p) => dayjs(p.date_paiement).year()),
        ),
      ]
        .sort((a, b) => b - a)
        .map(String),
    [payments.data],
  );

  const rows = useMemo(() => {
    const term = search.trim().toLowerCase();

    return (payments.data ?? [])
      .filter((p) => {
        if (status === "confirmé" || status === "brouillon")
          return p.statut === status;
        if (status === "overdue") return isOverdue(p);
        return true;
      })
      .filter((p) => !year || dayjs(p.date_paiement).year() === Number(year))
      .filter((p) => !method || p.moyen_paiement === method)
      .filter(
        (p) =>
          !term ||
          [`${p.nom} ${p.prenom}`, p.note].some((v) =>
            v?.toLowerCase().includes(term),
          ),
      )
      .sort((a, b) =>
        // Les soldes attendus d'abord, du plus urgent au plus lointain
        a.statut !== b.statut
          ? a.statut === "brouillon"
            ? -1
            : 1
          : a.statut === "brouillon"
            ? a.date_paiement.localeCompare(b.date_paiement)
            : b.date_paiement.localeCompare(a.date_paiement),
      );
  }, [payments.data, status, year, method, search]);

  const sum = (list) =>
    list.reduce((total, p) => total + Number(p.montant_paiement), 0);
  const confirmedRows = rows.filter((p) => p.statut === "confirmé");
  const draftRows = rows.filter((p) => p.statut === "brouillon");

  const askDelete = (p) =>
    confirmAction({
      title: "Supprimer le paiement",
      message: `Supprimer le paiement de ${money(p.montant_paiement)} du ${date(p.date_paiement)} ? Le solde attendu de la réservation sera recalculé.`,
      confirmLabel: "Supprimer",
      onConfirm: () => remove.mutate(p.id),
    });

  return (
    <>
      <PageHeader
        title="Paiements"
        description="Encaissements et soldes attendus (brouillons)"
      >
        <Button
          leftSection={<IconPlus size={16} />}
          onClick={() => openPaymentForm()}
        >
          Nouveau paiement
        </Button>
      </PageHeader>

      <SimpleGrid cols={{ base: 1, sm: 2 }} mb="md">
        <StatCard
          label="Encaissé (sélection)"
          value={money(sum(confirmedRows))}
          hint={`${confirmedRows.length} paiements`}
          icon={IconCash}
        />
        <StatCard
          label="Attendu (sélection)"
          value={money(sum(draftRows))}
          hint={`${draftRows.filter(isOverdue).length} en retard`}
          icon={IconClockHour4}
          color="orange"
        />
      </SimpleGrid>

      <Card mb="md" p="sm">
        <Group gap="sm" wrap="wrap">
          <SegmentedControl
            value={status}
            onChange={setStatus}
            data={[
              { value: "all", label: "Tous" },
              { value: "confirmé", label: "Encaissés" },
              { value: "brouillon", label: "Attendus" },
              { value: "overdue", label: "En retard" },
            ]}
          />
          <Select
            placeholder="Année"
            clearable
            w={120}
            data={years}
            value={year}
            onChange={setYear}
          />
          <Select
            placeholder="Moyen"
            clearable
            w={140}
            data={PAYMENT_METHODS}
            value={method}
            onChange={setMethod}
          />
          <TextInput
            placeholder="Rechercher un client ou une note"
            leftSection={<IconSearch size={16} />}
            value={search}
            onChange={(e) => setSearch(e.currentTarget.value)}
            style={{ flex: 1, minWidth: 200 }}
          />
        </Group>
      </Card>

      <QueryState query={payments}>
        {() => (
          <Card p={0}>
            <Table.ScrollContainer minWidth={800}>
              <Table>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Date</Table.Th>
                    <Table.Th>Client</Table.Th>
                    <Table.Th>Séjour</Table.Th>
                    <Table.Th>Moyen</Table.Th>
                    <Table.Th>Statut</Table.Th>
                    <Table.Th ta="right">Montant</Table.Th>
                    <Table.Th />
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {rows.length === 0 && (
                    <Table.Tr>
                      <Table.Td colSpan={7}>
                        <Text c="dimmed" ta="center" py="lg" size="sm">
                          Aucun paiement ne correspond à ces filtres.
                        </Text>
                      </Table.Td>
                    </Table.Tr>
                  )}
                  {rows.map((p) => (
                    <Table.Tr key={p.id}>
                      <Table.Td>
                        <Text size="sm">{date(p.date_paiement)}</Text>
                        {p.statut === "brouillon" && (
                          <Text size="xs" c="dimmed">
                            échéance
                          </Text>
                        )}
                      </Table.Td>
                      <Table.Td>
                        {p.id_client ? (
                          <Anchor
                            component={Link}
                            to={`/clients/${p.id_client}`}
                            size="sm"
                          >
                            {p.nom} {p.prenom}
                          </Anchor>
                        ) : (
                          <Text size="sm">—</Text>
                        )}
                        {p.note && (
                          <Text size="xs" c="dimmed" lineClamp={1} maw={220}>
                            {p.note}
                          </Text>
                        )}
                      </Table.Td>
                      <Table.Td>
                        <Group gap={6} wrap="nowrap">
                          <Anchor
                            component={Link}
                            to={`/reservations?id=${p.id_reservation}`}
                            size="sm"
                          >
                            {shortDate(p.date_arrivee)}{" "}
                            {dayjs(p.date_arrivee).year()}
                          </Anchor>
                          <TypeBadge type={p.type_reservation} />
                        </Group>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm">{methodLabel(p.moyen_paiement)}</Text>
                      </Table.Td>
                      <Table.Td>
                        <PaymentStatusBadge
                          status={p.statut}
                          overdue={isOverdue(p)}
                        />
                      </Table.Td>
                      <Table.Td ta="right">
                        <Text
                          size="sm"
                          fw={600}
                          c={Number(p.montant_paiement) < 0 ? "red" : undefined}
                        >
                          {money(p.montant_paiement)}
                        </Text>
                      </Table.Td>
                      <Table.Td ta="right">
                        <Group gap={4} justify="flex-end" wrap="nowrap">
                          {p.statut === "brouillon" && (
                            <Button
                              size="compact-xs"
                              variant="light"
                              onClick={() =>
                                confirmDraft({
                                  ...p,
                                  nom_client: `${p.nom} ${p.prenom}`,
                                })
                              }
                            >
                              Encaisser
                            </Button>
                          )}
                          <Menu position="bottom-end" withinPortal>
                            <Menu.Target>
                              <ActionIcon
                                variant="subtle"
                                color="gray"
                                aria-label="Actions"
                              >
                                <IconDots size={16} />
                              </ActionIcon>
                            </Menu.Target>
                            <Menu.Dropdown>
                              <Menu.Item
                                leftSection={<IconEdit size={14} />}
                                onClick={() => openPaymentForm({ payment: p })}
                              >
                                Modifier
                              </Menu.Item>
                              {p.statut === "confirmé" && (
                                <Menu.Item
                                  color="red"
                                  leftSection={<IconTrash size={14} />}
                                  onClick={() => askDelete(p)}
                                >
                                  Supprimer
                                </Menu.Item>
                              )}
                            </Menu.Dropdown>
                          </Menu>
                        </Group>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </Table.ScrollContainer>
          </Card>
        )}
      </QueryState>
    </>
  );
};

export default PaymentsPage;
