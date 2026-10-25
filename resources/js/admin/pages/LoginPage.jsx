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
import banner from "../../assets/img/locations/location_11.webp";
import logo from "../../assets/img/logo_full.png";
import classes from "./LoginPage.module.css";

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
    <Center
      mih="100vh"
      p="md"
      className={classes.background}
      style={{ backgroundImage: `url(${banner})` }}
    >
      <Paper shadow="xl" p="xl" w={380} maw="100%" className={classes.card}>
        <form onSubmit={submit}>
          <Stack>
            <Stack gap={4} align="center" ta="center">
              <img src={logo} alt="" className={classes.logo} />
              <Title order={2}>Ti' Dola Sab</Title>
              <Text c="dimmed" size="sm">
                Connexion à l'administration
              </Text>
            </Stack>
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
