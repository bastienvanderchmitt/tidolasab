import {
  ActionIcon,
  Button,
  Card,
  Group,
  PasswordInput,
  Stack,
  Table,
  Text,
  TextInput,
  Tooltip,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { isEmail } from "../../helpers/validation";
import { modals } from "@mantine/modals";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import { useApiMutation, userApi, useUsers } from "../api/queries";
import { useAuth } from "../auth/AuthContext";
import PageHeader from "../components/PageHeader";
import QueryState from "../components/QueryState";
import { confirmAction } from "../components/confirm";
import PasswordRequirements from "./PasswordRequirements";
import { validatePassword } from "./passwordRules";

const UserForm = ({ onDone }) => {
  const mutation = useApiMutation(userApi.create, "Administrateur créé");
  const form = useForm({
    initialValues: { name: "", email: "", login: "", password: "" },
    validate: {
      name: (v) => (v ? null : "Indiquez le nom"),
      email: (v) => (isEmail(v) ? null : "Email invalide"),
      login: (v) => (v ? null : "Indiquez l'identifiant"),
      password: validatePassword,
    },
  });

  return (
    <form
      onSubmit={form.onSubmit((values) =>
        mutation.mutate(values, {
          onSuccess: onDone,
          onError: (e) => form.setErrors(e.errors ?? {}),
        }),
      )}
    >
      <Stack>
        <TextInput label="Nom" {...form.getInputProps("name")} />
        <TextInput
          label="Email"
          type="email"
          {...form.getInputProps("email")}
        />
        <TextInput
          label="Identifiant de connexion"
          {...form.getInputProps("login")}
        />
        <PasswordInput
          label="Mot de passe"
          autoComplete="new-password"
          {...form.getInputProps("password")}
        />
        <PasswordRequirements value={form.values.password} />
        <Group justify="flex-end">
          <Button type="submit" loading={mutation.isPending}>
            Créer
          </Button>
        </Group>
      </Stack>
    </form>
  );
};

const UsersPage = () => {
  const users = useUsers();
  const { user: me } = useAuth();
  const remove = useApiMutation(userApi.remove, "Administrateur supprimé");

  const openCreate = () => {
    const id = modals.open({
      title: "Nouvel administrateur",
      children: <UserForm onDone={() => modals.close(id)} />,
    });
  };

  return (
    <>
      <PageHeader
        title="Administrateurs"
        description="Personnes ayant accès à cette interface"
      >
        <Button leftSection={<IconPlus size={16} />} onClick={openCreate}>
          Ajouter
        </Button>
      </PageHeader>
      <QueryState query={users}>
        {(list) => (
          <Card p={0}>
            <Table>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Nom</Table.Th>
                  <Table.Th>Identifiant</Table.Th>
                  <Table.Th>Email</Table.Th>
                  <Table.Th />
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {list.map((u) => (
                  <Table.Tr key={u.id}>
                    <Table.Td fw={500}>
                      {u.name}
                      {u.id === me?.id && (
                        <Text span size="xs" c="dimmed">
                          {" "}
                          (vous)
                        </Text>
                      )}
                    </Table.Td>
                    <Table.Td>{u.login}</Table.Td>
                    <Table.Td>{u.email}</Table.Td>
                    <Table.Td ta="right">
                      {u.id !== me?.id && (
                        <Tooltip label="Supprimer">
                          <ActionIcon
                            variant="subtle"
                            color="red"
                            aria-label="Supprimer"
                            onClick={() =>
                              confirmAction({
                                title: "Supprimer l'administrateur",
                                message: `${u.name} n'aura plus accès à l'administration.`,
                                confirmLabel: "Supprimer",
                                onConfirm: () => remove.mutate(u.id),
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
          </Card>
        )}
      </QueryState>
    </>
  );
};

export default UsersPage;
