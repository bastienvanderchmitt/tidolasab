import {
  Button,
  Group,
  SimpleGrid,
  Stack,
  Textarea,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import { clientApi, useApiMutation } from "../api/queries";

const ClientForm = ({ client, onDone }) => {
  const mutation = useApiMutation(clientApi.update, "Client modifié");

  const form = useForm({
    initialValues: {
      name: client.nom ?? "",
      firstName: client.prenom ?? "",
      email: client.email ?? "",
      phone: client.telephone ?? "",
      address: client.adresse ?? "",
      note: client.note ?? "",
    },
    validate: {
      email: (v) => (!v || /^\S+@\S+\.\S+$/.test(v) ? null : "Email invalide"),
    },
  });

  return (
    <form
      onSubmit={form.onSubmit((values) =>
        mutation.mutate({ id: client.id, ...values }, { onSuccess: onDone }),
      )}
    >
      <Stack>
        <SimpleGrid cols={2}>
          <TextInput label="Nom" {...form.getInputProps("name")} />
          <TextInput label="Prénom" {...form.getInputProps("firstName")} />
          <TextInput
            label="Email"
            type="email"
            {...form.getInputProps("email")}
          />
          <TextInput label="Téléphone" {...form.getInputProps("phone")} />
        </SimpleGrid>
        <TextInput label="Adresse" {...form.getInputProps("address")} />
        <Textarea
          label="Note"
          autosize
          minRows={3}
          {...form.getInputProps("note")}
        />
        <Group justify="flex-end">
          <Button type="submit" loading={mutation.isPending}>
            Enregistrer
          </Button>
        </Group>
      </Stack>
    </form>
  );
};

export const openClientForm = (client) => {
  const id = modals.open({
    title: "Modifier le client",
    size: "lg",
    children: <ClientForm client={client} onDone={() => modals.close(id)} />,
  });
};
