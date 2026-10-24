import { useMemo, useState } from "react";
import {
  ActionIcon,
  Badge,
  Box,
  Card,
  Group,
  SimpleGrid,
  Text,
  Tooltip,
  UnstyledButton,
} from "@mantine/core";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { useBookings } from "../api/queries";
import PageHeader from "../components/PageHeader";
import QueryState from "../components/QueryState";
import { BOOKING_TYPES } from "../utils/labels";
import { dayjs, money, nights } from "../utils/format";
import BookingDrawer from "../bookings/BookingDrawer";
import { useBookingActions } from "../bookings/useBookingActions";
import { monthCells, occupancy } from "./calendar";

const WEEKDAYS = ["lun.", "mar.", "mer.", "jeu.", "ven.", "sam.", "dim."];

const Month = ({ month, nightsMap, onOpen, onCreate }) => {
  const start = month.startOf("month");
  const offset = (start.day() + 6) % 7;
  const today = dayjs().format("YYYY-MM-DD");
  const cells = [
    ...Array(offset).fill(null),
    ...Array.from({ length: month.daysInMonth() }, (_, i) =>
      start.add(i, "day"),
    ),
  ];

  return (
    <Card>
      <Text fw={600} tt="capitalize" mb="sm">
        {month.format("MMMM YYYY")}
      </Text>
      <SimpleGrid cols={7} spacing={4} verticalSpacing={4}>
        {WEEKDAYS.map((d) => (
          <Text key={d} size="xs" c="dimmed" ta="center">
            {d}
          </Text>
        ))}
        {cells.map((day, i) => {
          if (!day) return <Box key={`empty-${i}`} />;
          const key = day.format("YYYY-MM-DD");
          const booking = nightsMap.get(key);
          const color = booking
            ? (BOOKING_TYPES[booking.type]?.color ?? "gray")
            : null;
          const isArrival = booking && booking.date_arrivee === key;
          const pending = booking?.statut === "en attente";

          const cell = (
            <UnstyledButton
              onClick={() =>
                booking ? onOpen(booking) : key >= today && onCreate(key)
              }
              h={52}
              p={4}
              style={{
                borderRadius: "var(--mantine-radius-sm)",
                border:
                  key === today
                    ? "2px solid var(--mantine-color-lagon-7)"
                    : "1px solid var(--mantine-color-default-border)",
                background: booking
                  ? `var(--mantine-color-${color}-${pending ? "1" : "6"})`
                  : key < today
                    ? "var(--mantine-color-default-hover)"
                    : undefined,
                color: booking && !pending ? "white" : undefined,
                overflow: "hidden",
              }}
            >
              <Text size="xs" fw={600}>
                {day.date()}
              </Text>
              {isArrival && (
                <Text size="10px" lineClamp={1} fw={500}>
                  {booking.nom_client || BOOKING_TYPES[booking.type]?.label}
                </Text>
              )}
            </UnstyledButton>
          );

          return booking ? (
            <Tooltip
              key={key}
              label={`${booking.nom_client || BOOKING_TYPES[booking.type]?.label} · ${nights(booking.nombre_nuits)}${
                booking.type !== "Fermeture"
                  ? ` · ${money(booking.prix_total)}`
                  : ""
              }${pending ? " · en attente" : ""}`}
            >
              {cell}
            </Tooltip>
          ) : (
            <Box key={key}>{cell}</Box>
          );
        })}
      </SimpleGrid>
    </Card>
  );
};

const PlanningPage = () => {
  const bookings = useBookings();
  const { openCreate } = useBookingActions();
  const [first, setFirst] = useState(dayjs().startOf("month"));
  const [selected, setSelected] = useState(null);

  const nightsMap = useMemo(
    () => occupancy(bookings.data ?? []),
    [bookings.data],
  );
  const months = [0, 1, 2].map((n) => first.add(n, "month"));

  return (
    <>
      <PageHeader
        title="Planning"
        description="Nuits occupées ; cliquez sur un jour libre pour créer une réservation"
      >
        <Group gap="xs">
          <ActionIcon
            variant="default"
            size="lg"
            aria-label="Mois précédents"
            onClick={() => setFirst(first.subtract(3, "month"))}
          >
            <IconChevronLeft size={18} />
          </ActionIcon>
          <UnstyledButton onClick={() => setFirst(dayjs().startOf("month"))}>
            <Text size="sm" fw={500}>
              Aujourd'hui
            </Text>
          </UnstyledButton>
          <ActionIcon
            variant="default"
            size="lg"
            aria-label="Mois suivants"
            onClick={() => setFirst(first.add(3, "month"))}
          >
            <IconChevronRight size={18} />
          </ActionIcon>
        </Group>
      </PageHeader>

      <Group gap="xs" mb="md">
        {Object.entries(BOOKING_TYPES).map(([key, { label, color }]) => (
          <Badge key={key} color={color} variant="filled">
            {label}
          </Badge>
        ))}
        <Badge color="gray" variant="light">
          En attente : couleur claire
        </Badge>
      </Group>

      <QueryState query={bookings}>
        {() => (
          <SimpleGrid cols={{ base: 1, md: 2, xl: 3 }}>
            {months.map((month) => (
              <Month
                key={month.format("YYYY-MM")}
                month={month}
                nightsMap={nightsMap}
                onOpen={(b) => setSelected(b)}
                onCreate={(checkIn) =>
                  openCreate({
                    checkIn,
                    checkOut: dayjs(checkIn).add(2, "day").format("YYYY-MM-DD"),
                  })
                }
              />
            ))}
          </SimpleGrid>
        )}
      </QueryState>

      <BookingDrawer
        bookingId={selected ? String(selected.id) : null}
        listItem={selected}
        onClose={() => setSelected(null)}
      />
    </>
  );
};

export default PlanningPage;
