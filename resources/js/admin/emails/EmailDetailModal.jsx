import { Link } from "react-router-dom";
import {
  Alert,
  Anchor,
  Button,
  Group,
  Modal,
  Stack,
  Text,
} from "@mantine/core";
import { IconAlertTriangle, IconSend } from "@tabler/icons-react";
import { emailApi, useApiMutation, useEmail } from "../api/queries";
import QueryState from "../components/QueryState";
import { EmailStatusBadge } from "../components/Badges";
import { confirmAction } from "../components/confirm";
import { emailTypeLabel } from "../utils/labels";
import { date } from "../utils/format";

const DATETIME = "D MMM YYYY à HH:mm";

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
 * Détail d'un email envoyé : statut, ouverture, aperçu du contenu et renvoi.
 */
const EmailDetail = ({ id, showBooking, onDone }) => {
  const query = useEmail(id);
  const resend = useApiMutation(emailApi.resend, "Email remis en file d'envoi");

  return (
    <QueryState query={query}>
      {(email) => (
        <Stack>
          <Stack gap={6}>
            <Row label="Type">{emailTypeLabel(email.type)}</Row>
            <Row label="Destinataire">{email.destinataire}</Row>
            {email.sujet && <Row label="Sujet">{email.sujet}</Row>}
            <Row label="Statut">
              <EmailStatusBadge email={email} />
            </Row>
            <Row label="Créé">{date(email.created_at, DATETIME)}</Row>
            {email.envoye_le && (
              <Row label="Envoyé">{date(email.envoye_le, DATETIME)}</Row>
            )}
            {email.ouvert_le && (
              <Row label="Ouvert">
                {date(email.ouvert_le, DATETIME)}
                {email.ouvertures > 1 && ` · ${email.ouvertures} fois`}
              </Row>
            )}
            {showBooking && email.id_reservation && (
              <Row label="Réservation">
                <Anchor
                  component={Link}
                  to={`/reservations?id=${email.id_reservation}`}
                  onClick={onDone}
                >
                  Voir la réservation
                </Anchor>
              </Row>
            )}
          </Stack>

          {email.statut === "échec" && email.erreur && (
            <Alert
              color="red"
              icon={<IconAlertTriangle size={18} />}
              title="Échec de l'envoi"
            >
              <Text size="sm" style={{ wordBreak: "break-word" }}>
                {email.erreur}
              </Text>
            </Alert>
          )}

          {email.statut === "envoyé" && !email.ouvert_le && (
            <Text size="xs" c="dimmed">
              Pas d'ouverture détectée : certaines messageries bloquent les
              images de suivi, l'email a donc pu être lu quand même.
            </Text>
          )}

          {email.html ? (
            <iframe
              title="Aperçu de l'email"
              srcDoc={email.html}
              sandbox=""
              style={{
                width: "100%",
                height: 420,
                border: "1px solid var(--mantine-color-default-border)",
                borderRadius: "var(--mantine-radius-md)",
                background: "#fff",
              }}
            />
          ) : (
            <Text size="sm" c="dimmed">
              Contenu pas encore généré : l'email est en attente d'envoi.
            </Text>
          )}

          {email.html && (
            <Group justify="flex-end">
              <Button
                variant="light"
                leftSection={<IconSend size={16} />}
                loading={resend.isPending}
                onClick={() =>
                  confirmAction({
                    title: "Renvoyer l'email",
                    message: `Renvoyer « ${email.sujet} » à ${email.destinataire} ?${email.type === "BookingReceived" ? " Les pièces jointes (RIB, contrat) ne sont pas renvoyées." : ""}`,
                    confirmLabel: "Renvoyer",
                    danger: false,
                    onConfirm: () =>
                      resend.mutate(email.id, { onSuccess: onDone }),
                  })
                }
              >
                Renvoyer
              </Button>
            </Group>
          )}
        </Stack>
      )}
    </QueryState>
  );
};

/**
 * Rendu dans l'arbre de la page (et non via le gestionnaire de modales de Mantine,
 * placé hors du routeur) : les liens vers les réservations y fonctionnent.
 */
const EmailDetailModal = ({ emailId, showBooking = true, onClose }) => (
  <Modal opened={!!emailId} onClose={onClose} title="Email" size="lg">
    {emailId && (
      <EmailDetail id={emailId} showBooking={showBooking} onDone={onClose} />
    )}
  </Modal>
);

export default EmailDetailModal;
