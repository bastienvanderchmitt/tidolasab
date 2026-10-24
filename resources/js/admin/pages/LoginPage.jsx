import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import {
  Alert,
  Button,
  Center,
  Paper,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconAlertTriangle } from "@tabler/icons-react";
import { useAuth } from "../auth/AuthContext";

const LoginPage = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const form = useForm({
    initialValues: { login: "", password: "" },
    validate: {
      login: (v) => (v ? null : "Indiquez votre identifiant"),
      password: (v) => (v ? null : "Indiquez votre mot de passe"),
    },
  });

  if (user) return <Navigate to="/" replace />;

  const submit = form.onSubmit(async (values) => {
    setError(null);
    try {
      await login(values);
      navigate("/", { replace: true });
    } catch (e) {
      setError(e.message);
    }
  });

  return (
    <Center mih="100vh" bg="var(--mantine-color-lagon-light)" p="md">
      <Paper withBorder shadow="md" p="xl" w={380} maw="100%">
        <form onSubmit={submit}>
          <Stack>
            <div>
              <Title order={2}>Ti' Dola Sab</Title>
              <Text c="dimmed" size="sm">
                Connexion à l'administration
              </Text>
            </div>
            {error && (
              <Alert color="red" icon={<IconAlertTriangle size={18} />}>
                {error}
              </Alert>
            )}
            <TextInput
              label="Identifiant"
              autoComplete="username"
              autoFocus
              {...form.getInputProps("login")}
            />
            <PasswordInput
              label="Mot de passe"
              autoComplete="current-password"
              {...form.getInputProps("password")}
            />
            <Button type="submit" loading={form.submitting} fullWidth mt="xs">
              Se connecter
            </Button>
          </Stack>
        </form>
      </Paper>
    </Center>
  );
};

export default LoginPage;
