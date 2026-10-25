import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Anchor,
  Card,
  Group,
  SegmentedControl,
  Select,
  SimpleGrid,
  Table,
  Text,
  TextInput,
} from "@mantine/core";
import {
  IconAlertTriangle,
  IconMailOpened,
  IconSearch,
  IconSend,
} from "@tabler/icons-react";
import { useEmails } from "../api/queries";
import PageHeader from "../components/PageHeader";
import QueryState from "../components/QueryState";
import StatCard from "../components/StatCard";
import { EmailStatusBadge } from "../components/Badges";
import { EMAIL_TYPES, emailStatus, emailTypeLabel } from "../utils/labels";
import { date, dayjs } from "../utils/format";
import EmailDetailModal from "./EmailDetailModal";

const TYPE_OPTIONS = Object.entries(EMAIL_TYPES).map(([value, label]) => ({
  value,
  label,
}));

const EmailsPage = () => {
  const emails = useEmails();
  const [status, setStatus] = useState("all");
  const [type, setType] = useState(null);
  const [search, setSearch] = useState("");
  const [openedId, setOpenedId] = useState(null);

  const rows = useMemo(() => {
    const term = search.trim().toLowerCase();

    return (emails.data ?? [])
      .filter((e) => status === "all" || emailStatus(e) === status)
      .filter((e) => !type || e.type === type)
      .filter(
        (e) =>
          !term ||
          [e.destinataire, e.nom_client, e.sujet].some((v) =>
            v?.toLowerCase().includes(term),
          ),
      );
  }, [emails.data, status, type, search]);

  // Statistiques des 30 derniers jours, indépendantes des filtres
  const stats = useMemo(() => {
    const since = dayjs().subtract(30, "day");
    const recent = (emails.data ?? []).filter((e) =>
      dayjs(e.created_at).isAfter(since),
    );
    const sent = recent.filter((e) => e.statut === "envoyé");
    return {
      sent: sent.length,
      opened: sent.filter((e) => e.ouvert_le).length,
      failed: recent.filter((e) => e.statut === "échec").length,
    };
  }, [emails.data]);

  return (
    <>
      <PageHeader title="Emails" description="Emails envoyés aux clients" />

      <SimpleGrid cols={{ base: 1, sm: 3 }} mb="md">
        <StatCard
          label="Envoyés (30 jours)"
          value={stats.sent}
          icon={IconSend}
        />
        <StatCard
          label="Ouverts (30 jours)"
          value={
            stats.sent > 0
              ? `${Math.round((stats.opened / stats.sent) * 100)} %`
              : "—"
          }
          hint="Indicatif : certaines messageries bloquent le suivi"
          icon={IconMailOpened}
        />
        <StatCard
          label="Échecs (30 jours)"
          value={stats.failed}
          hint={stats.failed > 0 ? "À renvoyer depuis le détail" : undefined}
          icon={IconAlertTriangle}
          color={stats.failed > 0 ? "red" : "gray"}
        />
      </SimpleGrid>

      <Card mb="md" p="sm">
        <Group gap="sm" wrap="wrap">
          <SegmentedControl
            value={status}
            onChange={setStatus}
            data={[
              { value: "all", label: "Tous" },
              { value: "en file", label: "En file" },
              { value: "envoyé", label: "Envoyés" },
              { value: "ouvert", label: "Ouverts" },
              { value: "échec", label: "Échecs" },
            ]}
          />
          <Select
            placeholder="Type"
            clearable
            w={240}
            data={TYPE_OPTIONS}
            value={type}
            onChange={setType}
          />
          <TextInput
            placeholder="Rechercher un destinataire, un client ou un sujet"
            leftSection={<IconSearch size={16} />}
            value={search}
            onChange={(e) => setSearch(e.currentTarget.value)}
            style={{ flex: 1, minWidth: 200 }}
          />
        </Group>
      </Card>

      <QueryState query={emails}>
        {() => (
          <Card p={0}>
            <Table.ScrollContainer minWidth={800}>
              <Table highlightOnHover>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Date</Table.Th>
                    <Table.Th>Destinataire</Table.Th>
                    <Table.Th>Email</Table.Th>
                    <Table.Th>Statut</Table.Th>
                    <Table.Th>Réservation</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {rows.length === 0 && (
                    <Table.Tr>
                      <Table.Td colSpan={5}>
                        <Text c="dimmed" ta="center" py="lg" size="sm">
                          Aucun email ne correspond à ces filtres.
                        </Text>
                      </Table.Td>
                    </Table.Tr>
                  )}
                  {rows.map((e) => (
                    <Table.Tr
                      key={e.id}
                      onClick={() => setOpenedId(e.id)}
                      style={{ cursor: "pointer" }}
                    >
                      <Table.Td>
                        <Text size="sm">{date(e.created_at)}</Text>
                        <Text size="xs" c="dimmed">
                          {date(e.created_at, "HH:mm")}
                        </Text>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm">{e.nom_client || e.destinataire}</Text>
                        {e.nom_client && (
                          <Text size="xs" c="dimmed">
                            {e.destinataire}
                          </Text>
                        )}
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm">{emailTypeLabel(e.type)}</Text>
                        {e.sujet && (
                          <Text size="xs" c="dimmed" lineClamp={1} maw={280}>
                            {e.sujet}
                          </Text>
                        )}
                      </Table.Td>
                      <Table.Td>
                        <EmailStatusBadge email={e} />
                        {e.ouvert_le && e.ouvertures > 1 && (
                          <Text size="xs" c="dimmed">
                            {e.ouvertures} ouvertures
                          </Text>
                        )}
                      </Table.Td>
                      <Table.Td>
                        {e.id_reservation ? (
                          <Anchor
                            component={Link}
                            to={`/reservations?id=${e.id_reservation}`}
                            size="sm"
                            onClick={(event) => event.stopPropagation()}
                          >
                            Voir
                          </Anchor>
                        ) : (
                          <Text size="sm" c="dimmed">
                            —
                          </Text>
                        )}
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </Table.ScrollContainer>
          </Card>
        )}
      </QueryState>

      <EmailDetailModal emailId={openedId} onClose={() => setOpenedId(null)} />
    </>
  );
};

export default EmailsPage;
