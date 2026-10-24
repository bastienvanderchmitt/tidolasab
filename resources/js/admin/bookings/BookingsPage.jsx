import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Button,
  Card,
  Group,
  SegmentedControl,
  Select,
  Table,
  Text,
  TextInput,
  UnstyledButton,
} from "@mantine/core";
import {
  IconChevronDown,
  IconChevronUp,
  IconPlus,
  IconSearch,
} from "@tabler/icons-react";
import { useBookings } from "../api/queries";
import PageHeader from "../components/PageHeader";
import QueryState from "../components/QueryState";
import { StatusBadge, TypeBadge } from "../components/Badges";
import { BOOKING_TYPES } from "../utils/labels";
import { dayjs, money, nights, shortDate } from "../utils/format";
import BookingDrawer from "./BookingDrawer";
import { useBookingActions } from "./useBookingActions";

const SortHeader = ({ label, field, sort, onSort, align }) => (
  <Table.Th ta={align}>
    <UnstyledButton onClick={() => onSort(field)}>
      <Group
        gap={4}
        justify={align === "right" ? "flex-end" : "flex-start"}
        wrap="nowrap"
      >
        <Text size="sm" fw={600}>
          {label}
        </Text>
        {sort.field === field &&
          (sort.asc ? (
            <IconChevronUp size={14} />
          ) : (
            <IconChevronDown size={14} />
          ))}
      </Group>
    </UnstyledButton>
  </Table.Th>
);

const BookingsPage = () => {
  const bookings = useBookings();
  const { openCreate } = useBookingActions();
  const [params, setParams] = useSearchParams();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("upcoming");
  const [type, setType] = useState(null);
  const [year, setYear] = useState(null);
  const [sort, setSort] = useState({ field: "date_arrivee", asc: true });

  const selectedId = params.get("id");
  const openBooking = (id) => setParams(id ? { id } : {});

  const years = useMemo(
    () =>
      [
        ...new Set(
          (bookings.data ?? []).map((b) => dayjs(b.date_arrivee).year()),
        ),
      ]
        .sort((a, b) => b - a)
        .map(String),
    [bookings.data],
  );

  const rows = useMemo(() => {
    const today = dayjs().format("YYYY-MM-DD");
    const term = search.trim().toLowerCase();

    return (bookings.data ?? [])
      .filter((b) => {
        if (status === "upcoming")
          return b.date_depart >= today && b.statut !== "annulée";
        if (status === "past")
          return b.date_depart < today && b.statut !== "annulée";
        if (status === "all") return true;
        return b.statut === status;
      })
      .filter((b) => !type || b.type === type)
      .filter((b) => !year || dayjs(b.date_arrivee).year() === Number(year))
      .filter(
        (b) =>
          !term ||
          [b.nom_client, b.note].some((v) => v?.toLowerCase().includes(term)),
      )
      .sort((a, b) => {
        const va = a[sort.field];
        const vb = b[sort.field];
        const cmp =
          typeof va === "number" || !isNaN(va)
            ? Number(va) - Number(vb)
            : String(va ?? "").localeCompare(String(vb ?? ""));
        return sort.asc ? cmp : -cmp;
      });
  }, [bookings.data, search, status, type, year, sort]);

  const onSort = (field) =>
    setSort((s) => ({ field, asc: s.field === field ? !s.asc : true }));
  const listItem = rows.find((b) => String(b.id) === selectedId);

  return (
    <>
      <PageHeader
        title="Réservations"
        description="Toutes les réservations, directes et plateformes"
      >
        <Button
          leftSection={<IconPlus size={16} />}
          onClick={() => openCreate()}
        >
          Nouvelle réservation
        </Button>
      </PageHeader>

      <Card mb="md" p="sm">
        <Group gap="sm" wrap="wrap">
          <SegmentedControl
            value={status}
            onChange={setStatus}
            data={[
              { value: "upcoming", label: "À venir" },
              { value: "en attente", label: "En attente" },
              { value: "past", label: "Passées" },
              { value: "annulée", label: "Annulées" },
              { value: "all", label: "Toutes" },
            ]}
          />
          <Select
            placeholder="Type"
            clearable
            w={150}
            data={Object.entries(BOOKING_TYPES).map(([value, { label }]) => ({
              value,
              label,
            }))}
            value={type}
            onChange={setType}
          />
          <Select
            placeholder="Année"
            clearable
            w={120}
            data={years}
            value={year}
            onChange={setYear}
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

      <QueryState query={bookings}>
        {() => (
          <Card p={0}>
            <Table.ScrollContainer minWidth={800}>
              <Table>
                <Table.Thead>
                  <Table.Tr>
                    <SortHeader
                      label="Client"
                      field="nom_client"
                      sort={sort}
                      onSort={onSort}
                    />
                    <SortHeader
                      label="Arrivée"
                      field="date_arrivee"
                      sort={sort}
                      onSort={onSort}
                    />
                    <SortHeader
                      label="Nuits"
                      field="nombre_nuits"
                      sort={sort}
                      onSort={onSort}
                    />
                    <Table.Th>Type</Table.Th>
                    <Table.Th>Statut</Table.Th>
                    <SortHeader
                      label="Prix"
                      field="prix_total"
                      sort={sort}
                      onSort={onSort}
                      align="right"
                    />
                    <SortHeader
                      label="Encaissé"
                      field="total_paye"
                      sort={sort}
                      onSort={onSort}
                      align="right"
                    />
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {rows.length === 0 && (
                    <Table.Tr>
                      <Table.Td colSpan={7}>
                        <Text c="dimmed" ta="center" py="lg" size="sm">
                          Aucune réservation ne correspond à ces filtres.
                        </Text>
                      </Table.Td>
                    </Table.Tr>
                  )}
                  {rows.map((b) => (
                    <Table.Tr
                      key={b.id}
                      style={{ cursor: "pointer" }}
                      onClick={() => openBooking(String(b.id))}
                    >
                      <Table.Td>
                        <Text size="sm" fw={500}>
                          {b.nom_client || "—"}
                        </Text>
                        {b.note && (
                          <Text size="xs" c="dimmed" lineClamp={1} maw={260}>
                            {b.note}
                          </Text>
                        )}
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm">
                          {shortDate(b.date_arrivee)} →{" "}
                          {shortDate(b.date_depart)}
                        </Text>
                        <Text size="xs" c="dimmed">
                          {dayjs(b.date_arrivee).year()}
                        </Text>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm">{nights(b.nombre_nuits)}</Text>
                      </Table.Td>
                      <Table.Td>
                        <TypeBadge type={b.type} />
                      </Table.Td>
                      <Table.Td>
                        <StatusBadge status={b.statut} />
                      </Table.Td>
                      <Table.Td ta="right">
                        <Text size="sm">
                          {b.type === "Fermeture" ? "—" : money(b.prix_total)}
                        </Text>
                      </Table.Td>
                      <Table.Td ta="right">
                        {b.type !== "Fermeture" && (
                          <>
                            <Text size="sm" fw={500}>
                              {money(b.total_paye)}
                            </Text>
                            {Number(b.total_brouillon) > 0 && (
                              <Text size="xs" c="orange">
                                + {money(b.total_brouillon)} attendu
                              </Text>
                            )}
                          </>
                        )}
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </Table.ScrollContainer>
            <Text size="xs" c="dimmed" p="sm">
              {rows.length} réservation{rows.length > 1 ? "s" : ""}
            </Text>
          </Card>
        )}
      </QueryState>

      <BookingDrawer
        bookingId={selectedId}
        listItem={listItem}
        onClose={() => openBooking(null)}
      />
    </>
  );
};

export default BookingsPage;
