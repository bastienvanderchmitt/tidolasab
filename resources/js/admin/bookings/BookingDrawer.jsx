import { Link } from "react-router-dom";
import {
  Anchor,
  Button,
  Divider,
  Drawer,
  Group,
  Progress,
  Stack,
  Table,
  Text,
  Title,
} from "@mantine/core";
import {
  IconCheck,
  IconClockPause,
  IconEdit,
  IconTrash,
  IconX,
} from "@tabler/icons-react";
import { useBooking } from "../api/queries";
import QueryState from "../components/QueryState";
import {
  PaymentStatusBadge,
  StatusBadge,
  TypeBadge,
} from "../components/Badges";
import { daysUntil, date, guests, money, nights } from "../utils/format";
import { methodLabel } from "../utils/labels";
import { useBookingActions } from "./useBookingActions";
import { useConfirmDraft } from "../payments/ConfirmDraftModal";

const Row = ({ label, children }) => (
  <Group justify="space-between" gap="xs" wrap="nowrap">
    <Text size="sm" c="dimmed">
      {label}
    </Text>
    <Text size="sm" ta="right">
      {children}
    </Text>
  </Group>
);

/**
 * Détail d'une réservation : séjour, client, paiements et actions.
 */
const BookingDrawer = ({ bookingId, listItem, onClose }) => {
  const query = useBooking(bookingId);
  const actions = useBookingActions();
  const confirmDraft = useConfirmDraft();

  return (
    <Drawer
      opened={!!bookingId}
      onClose={onClose}
      position="right"
      size="md"
      title="Réservation"
    >
      <QueryState query={query}>
        {(booking) => {
          const client = booking.clients?.[0];
          const confirmed = booking.payments.filter(
            (p) => p.statut === "confirmé",
          );
          const paid = confirmed.reduce(
            (sum, p) => sum + Number(p.montant_paiement),
            0,
          );
          const total = Number(booking.prix_total);
          const summary = {
            ...listItem,
            ...booking,
            nom_client: client ? `${client.nom} ${client.prenom}` : null,
          };

          return (
            <Stack>
              <Group justify="space-between">
                <Title order={3}>
                  {client ? `${client.nom} ${client.prenom}` : "Fermeture"}
                </Title>
                <Group gap={6}>
                  <TypeBadge type={booking.type} />
                  <StatusBadge status={booking.statut} />
                </Group>
              </Group>

              <Stack gap={6}>
                <Row label="Arrivée">
                  {date(booking.date_arrivee, "dddd D MMMM YYYY")}
                </Row>
                <Row label="Départ">
                  {date(booking.date_depart, "dddd D MMMM YYYY")}
                </Row>
                <Row label="Durée">{nights(booking.nombre_nuits)}</Row>
                {booking.type !== "Fermeture" && (
                  <Row label="Voyageurs">
                    {guests(booking.adultes, booking.enfants)}
                  </Row>
                )}
              </Stack>

              {client && (
                <>
                  <Divider label="Client" labelPosition="left" />
                  <Stack gap={6}>
                    <Row label="Fiche">
                      <Anchor component={Link} to={`/clients/${client.id}`}>
                        Voir le client
                      </Anchor>
                    </Row>
                    {client.email && <Row label="Email">{client.email}</Row>}
                    {client.telephone && (
                      <Row label="Téléphone">{client.telephone}</Row>
                    )}
                    {client.adresse && (
                      <Row label="Adresse">{client.adresse}</Row>
                    )}
                  </Stack>
                </>
              )}

              {booking.type !== "Fermeture" && (
                <>
                  <Divider label="Paiement" labelPosition="left" />
                  <Stack gap={6}>
                    <Row label="Prix total">{money(total)}</Row>
                    {Number(booking.taxe_sejour) > 0 && (
                      <Row label="dont taxe de séjour">
                        {money(booking.taxe_sejour)}
                      </Row>
                    )}
                    <Row label="Encaissé">{money(paid)}</Row>
                    <Progress
                      value={
                        total > 0 ? Math.min(100, (paid / total) * 100) : 0
                      }
                      size="sm"
                    />
                  </Stack>

                  {booking.payments.length > 0 && (
                    <Table>
                      <Table.Tbody>
                        {booking.payments.map((p) => (
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
                              />
                            </Table.Td>
                            <Table.Td ta="right">
                              {money(p.montant_paiement)}
                            </Table.Td>
                            <Table.Td ta="right">
                              {p.statut === "brouillon" && (
                                <Button
                                  size="compact-xs"
                                  variant="light"
                                  onClick={() =>
                                    confirmDraft({
                                      ...p,
                                      nom_client: summary.nom_client,
                                    })
                                  }
                                >
                                  Encaisser
                                </Button>
                              )}
                            </Table.Td>
                          </Table.Tr>
                        ))}
                      </Table.Tbody>
                    </Table>
                  )}
                </>
              )}

              {booking.note && (
                <>
                  <Divider label="Note" labelPosition="left" />
                  <Text size="sm" style={{ whiteSpace: "pre-line" }}>
                    {booking.note}
                  </Text>
                </>
              )}

              <Divider />
              <Group gap="xs">
                {booking.statut === "en attente" && (
                  <Button
                    leftSection={<IconCheck size={16} />}
                    onClick={() => actions.openValidate(summary)}
                  >
                    Valider
                  </Button>
                )}
                <Button
                  variant="default"
                  leftSection={<IconEdit size={16} />}
                  onClick={() => actions.openEdit(booking)}
                >
                  Modifier
                </Button>
                {booking.statut === "validée" &&
                  booking.type !== "Fermeture" && (
                    <Button
                      variant="default"
                      leftSection={<IconClockPause size={16} />}
                      onClick={() => actions.setPending(summary)}
                    >
                      En attente
                    </Button>
                  )}
                {booking.statut !== "annulée" &&
                  booking.type !== "Fermeture" && (
                    <Button
                      variant="light"
                      color="orange"
                      leftSection={<IconX size={16} />}
                      onClick={() => actions.cancel(summary)}
                    >
                      Annuler
                    </Button>
                  )}
                <Button
                  variant="subtle"
                  color="red"
                  leftSection={<IconTrash size={16} />}
                  onClick={() => actions.remove(summary, onClose)}
                >
                  Supprimer
                </Button>
              </Group>
            </Stack>
          );
        }}
      </QueryState>
    </Drawer>
  );
};

export default BookingDrawer;
