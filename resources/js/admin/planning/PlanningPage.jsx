import { useMemo, useState } from "react";
import {
  ActionIcon,
  Box,
  Button,
  Card,
  Group,
  SimpleGrid,
  Text,
  Tooltip,
} from "@mantine/core";
import {
  IconChevronLeft,
  IconChevronRight,
  IconPlus,
} from "@tabler/icons-react";
import { useBookings } from "../api/queries";
import PageHeader from "../components/PageHeader";
import QueryState from "../components/QueryState";
import { BOOKING_TYPES } from "../utils/labels";
import { money, nights } from "../utils/format";
import BookingDrawer from "../bookings/BookingDrawer";
import { useBookingActions } from "../bookings/useBookingActions";
import {
  addDays,
  addMonths,
  dayLabel,
  monthCells,
  monthLabel,
  occupancy,
  suggestedCheckOut,
  todayISO,
  weekday,
} from "./calendar";
import classes from "./PlanningPage.module.css";

const WEEKDAYS = ["lun.", "mar.", "mer.", "jeu.", "ven.", "sam.", "dim."];
const MONTHS_SHOWN = 3;

const colorOf = (booking) => BOOKING_TYPES[booking.type]?.color ?? "gray";
const nameOf = (booking) =>
  booking.nom_client || BOOKING_TYPES[booking.type]?.label;
const isPending = (booking) => booking.statut === "en attente";

const summary = (booking) =>
  [
    nameOf(booking),
    nights(booking.nombre_nuits),
    booking.type !== "Fermeture" && money(booking.prix_total),
    isPending(booking) && "en attente",
  ]
    .filter(Boolean)
    .join(" · ");

const barStyle = (booking) => {
  const color = colorOf(booking);
  return isPending(booking)
    ? {
        background: `var(--mantine-color-${color}-2)`,
        color: `var(--mantine-color-${color}-9)`,
      }
    : {
        background: `var(--mantine-color-${color}-6)`,
        color: "var(--mantine-color-white)",
      };
};

/**
 * Demi-case colorée : la moitié gauche est la nuit de la veille, la droite celle du jour.
 */
const Bar = ({ booking, side, start, end, onOpen }) => (
  <Tooltip label={summary(booking)} withinPortal>
    <button
      type="button"
      aria-label={summary(booking)}
      className={[
        classes.bar,
        classes[side],
        start && classes.start,
        end && classes.end,
        isPending(booking) && classes.pending,
      ]
        .filter(Boolean)
        .join(" ")}
      style={barStyle(booking)}
      onClick={(event) => {
        event.stopPropagation();
        onOpen(booking);
      }}
    />
  </Tooltip>
);

const Day = ({ day, today, nightsMap, onOpen, onCreate }) => {
  const night = nightsMap.get(day);
  const previous = nightsMap.get(addDays(day, -1));
  const isPast = day < today;
  const canCreate = !night && !isPast;

  // Nom sur la première nuit de la réservation dans la ligne (semaine du mois),
  // étalé sur les nuits suivantes de la même ligne
  const showLabel =
    night &&
    (previous?.id !== night.id || weekday(day) === 0 || day.endsWith("-01"));
  const sameRow = (d) => weekday(d) !== 0 && d.slice(0, 7) === day.slice(0, 7);
  let span = 1;
  while (
    showLabel &&
    sameRow(addDays(day, span)) &&
    nightsMap.get(addDays(day, span))?.id === night.id
  ) {
    span++;
  }
  // La barre s'arrête au milieu de la case du départ, ou au bord de la ligne
  const continues = nightsMap.get(addDays(day, span))?.id === night?.id;

  const cellClasses = [
    classes.cell,
    isPast && classes.past,
    canCreate && classes.free,
    day === today && classes.today,
  ]
    .filter(Boolean)
    .join(" ");

  const content = (
    <div
      className={cellClasses}
      role={canCreate ? "button" : undefined}
      tabIndex={canCreate ? 0 : undefined}
      onClick={canCreate ? () => onCreate(day) : undefined}
      onKeyDown={
        canCreate
          ? (event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onCreate(day);
              }
            }
          : undefined
      }
    >
      <span className={classes.number}>{Number(day.slice(8))}</span>
      {canCreate && <IconPlus size={14} className={classes.add} />}
      {previous && (
        <Bar
          booking={previous}
          side="left"
          end={previous.id !== night?.id}
          onOpen={onOpen}
        />
      )}
      {night && (
        <Bar
          booking={night}
          side="right"
          start={previous?.id !== night.id}
          end={false}
          onOpen={onOpen}
        />
      )}
      {showLabel && (
        <span
          className={classes.label}
          style={{
            width: continues
              ? `calc(${span} * 100% - 50% - 14px)`
              : `calc(${span} * 100% - 16px)`,
            color: barStyle(night).color,
          }}
        >
          {nameOf(night)}
        </span>
      )}
    </div>
  );

  return canCreate ? (
    <Tooltip
      label={`Nouvelle réservation le ${dayLabel(day)}`}
      openDelay={400}
      withinPortal
    >
      {content}
    </Tooltip>
  ) : (
    content
  );
};

const Month = ({ month, today, nightsMap, onOpen, onCreate }) => {
  const cells = monthCells(month);
  const days = cells.filter(Boolean);
  // Taux d'occupation : nuits validées, hors fermetures
  const booked = days.filter((d) => {
    const b = nightsMap.get(d);
    return b && b.statut === "validée" && b.type !== "Fermeture";
  }).length;

  return (
    <Card>
      <Group justify="space-between" mb="sm" align="baseline">
        <Text fw={600} tt="capitalize">
          {monthLabel(month)}
        </Text>
        <Text size="xs" c="dimmed">
          {nights(booked)} · {Math.round((booked / days.length) * 100)} %
        </Text>
      </Group>
      <div className={classes.grid}>
        {WEEKDAYS.map((d) => (
          <div key={d} className={classes.weekday}>
            {d}
          </div>
        ))}
        {cells.map((day, i) =>
          day ? (
            <Day
              key={day}
              day={day}
              today={today}
              nightsMap={nightsMap}
              onOpen={onOpen}
              onCreate={onCreate}
            />
          ) : (
            <div
              key={`empty-${i}`}
              className={`${classes.cell} ${classes.empty}`}
            />
          ),
        )}
      </div>
    </Card>
  );
};

const Legend = () => (
  <Group gap="md" mb="md">
    {Object.entries(BOOKING_TYPES).map(([key, { label, color }]) => (
      <Group key={key} gap={6}>
        <Box
          w={22}
          h={12}
          style={{
            borderRadius: 6,
            background: `var(--mantine-color-${color}-6)`,
          }}
        />
        <Text size="sm">{label}</Text>
      </Group>
    ))}
    <Group gap={6}>
      <Box
        w={22}
        h={12}
        className={classes.pending}
        style={{
          borderRadius: 6,
          background: "var(--mantine-color-gray-3)",
        }}
      />
      <Text size="sm">En attente</Text>
    </Group>
  </Group>
);

const PlanningPage = () => {
  const bookings = useBookings();
  const { openCreate } = useBookingActions();
  const today = todayISO();
  const [first, setFirst] = useState(() => addMonths(today, 0));
  const [selected, setSelected] = useState(null);

  const nightsMap = useMemo(
    () => occupancy(bookings.data ?? []),
    [bookings.data],
  );
  const months = Array.from({ length: MONTHS_SHOWN }, (_, n) =>
    addMonths(first, n),
  );

  return (
    <>
      <PageHeader
        title="Planning"
        description="Cliquez sur un jour libre pour créer une réservation, sur une réservation pour l'ouvrir"
      >
        <Group gap="xs">
          <ActionIcon
            variant="default"
            size="lg"
            aria-label="Mois précédents"
            onClick={() => setFirst(addMonths(first, -MONTHS_SHOWN))}
          >
            <IconChevronLeft size={18} />
          </ActionIcon>
          <Button
            variant="default"
            onClick={() => setFirst(addMonths(today, 0))}
          >
            Aujourd'hui
          </Button>
          <ActionIcon
            variant="default"
            size="lg"
            aria-label="Mois suivants"
            onClick={() => setFirst(addMonths(first, MONTHS_SHOWN))}
          >
            <IconChevronRight size={18} />
          </ActionIcon>
        </Group>
      </PageHeader>

      <Legend />

      <QueryState query={bookings}>
        {() => (
          <SimpleGrid cols={{ base: 1, md: 2, xl: 3 }}>
            {months.map((month) => (
              <Month
                key={month}
                month={month}
                today={today}
                nightsMap={nightsMap}
                onOpen={setSelected}
                onCreate={(checkIn) =>
                  openCreate({
                    checkIn,
                    checkOut: suggestedCheckOut(checkIn, nightsMap),
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
