import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ActionIcon,
  Card,
  Group,
  Table,
  Text,
  TextInput,
  Tooltip,
} from "@mantine/core";
import { IconSearch, IconTrash } from "@tabler/icons-react";
import { clientApi, useApiMutation, useClients } from "../api/queries";
import PageHeader from "../components/PageHeader";
import QueryState from "../components/QueryState";
import { TypeBadge } from "../components/Badges";
import { confirmAction } from "../components/confirm";
import { date, money } from "../utils/format";

const ClientsPage = () => {
  const clients = useClients();
  const navigate = useNavigate();
  const remove = useApiMutation(clientApi.remove, "Client supprimé");
  const [search, setSearch] = useState("");

  const rows = useMemo(() => {
    const term = search.trim().toLowerCase();
    return (clients.data ?? []).filter(
      (c) =>
        !term ||
        [c.nom, c.prenom, c.email, c.telephone, c.adresse].some((v) =>
          v?.toLowerCase().includes(term),
        ),
    );
  }, [clients.data, search]);

  return (
    <>
      <PageHeader
        title="Clients"
        description={`${clients.data?.length ?? 0} clients`}
      >
        <TextInput
          placeholder="Nom, email, téléphone…"
          leftSection={<IconSearch size={16} />}
          value={search}
          onChange={(e) => setSearch(e.currentTarget.value)}
          w={280}
        />
      </PageHeader>

      <QueryState query={clients}>
        {() => (
          <Card p={0}>
            <Table.ScrollContainer minWidth={760}>
              <Table>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Client</Table.Th>
                    <Table.Th>Contact</Table.Th>
                    <Table.Th>Séjours</Table.Th>
                    <Table.Th>Dernier séjour</Table.Th>
                    <Table.Th ta="right">Total payé</Table.Th>
                    <Table.Th />
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {rows.map((c) => (
                    <Table.Tr
                      key={c.id}
                      style={{ cursor: "pointer" }}
                      onClick={() => navigate(`/clients/${c.id}`)}
                    >
                      <Table.Td>
                        <Text size="sm" fw={500}>
                          {c.nom} {c.prenom}
                        </Text>
                        {c.note && (
                          <Text size="xs" c="dimmed" lineClamp={1} maw={240}>
                            {c.note}
                          </Text>
                        )}
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm">{c.email}</Text>
                        <Text size="xs" c="dimmed">
                          {c.telephone}
                        </Text>
                      </Table.Td>
                      <Table.Td>
                        <Group gap={6}>
                          <Text size="sm">{c.nombre_reservations}</Text>
                          {c.types_reservations?.split(",").map((t) => (
                            <TypeBadge key={t} type={t} />
                          ))}
                        </Group>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm">{date(c.dernier_sejour)}</Text>
                      </Table.Td>
                      <Table.Td ta="right">
                        <Text size="sm" fw={500}>
                          {money(c.total_paye)}
                        </Text>
                      </Table.Td>
                      <Table.Td ta="right" onClick={(e) => e.stopPropagation()}>
                        {Number(c.can_delete) === 1 && (
                          <Tooltip label="Supprimer (aucune réservation)">
                            <ActionIcon
                              variant="subtle"
                              color="red"
                              aria-label="Supprimer"
                              onClick={() =>
                                confirmAction({
                                  title: "Supprimer le client",
                                  message: `Supprimer ${c.nom} ${c.prenom} ?`,
                                  confirmLabel: "Supprimer",
                                  onConfirm: () => remove.mutate(c.id),
                                })
                              }
                            >
                              <IconTrash size={16} />
                            </ActionIcon>
                          </Tooltip>
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
    </>
  );
};

export default ClientsPage;
