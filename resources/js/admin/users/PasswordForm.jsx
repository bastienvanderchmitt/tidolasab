import { Button, Group, PasswordInput, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useApiMutation, userApi } from "../api/queries";
import PasswordRequirements from "./PasswordRequirements";
import { validatePassword } from "./passwordRules";

/**
 * Changement du mot de passe de l'administrateur connecté.
 */
const PasswordForm = ({ onDone }) => {
  const mutation = useApiMutation(
    userApi.updatePassword,
    "Mot de passe modifié",
  );
  const form = useForm({
    initialValues: {
      current_password: "",
      password: "",
      password_confirmation: "",
    },
    validate: {
      current_password: (v) => (v ? null : "Indiquez votre mot de passe actuel"),
      password: (v, values) =>
        v && v === values.current_password
          ? "Choisissez un mot de passe différent de l'actuel"
          : validatePassword(v),
      password_confirmation: (v, values) =>
        v === values.password ? null : "Les mots de passe ne correspondent pas",
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
        <PasswordInput
          label="Mot de passe actuel"
          autoComplete="current-password"
          data-autofocus
          {...form.getInputProps("current_password")}
        />
        <PasswordInput
          label="Nouveau mot de passe"
          autoComplete="new-password"
          {...form.getInputProps("password")}
        />
        <PasswordRequirements value={form.values.password} />
        <PasswordInput
          label="Confirmation"
          autoComplete="new-password"
          {...form.getInputProps("password_confirmation")}
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

export default PasswordForm;
