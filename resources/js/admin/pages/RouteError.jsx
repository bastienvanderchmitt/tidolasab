import { useEffect } from "react";
import { isRouteErrorResponse, useRouteError } from "react-router-dom";
import { Button, Center, Stack, Text, Title } from "@mantine/core";
import * as Sentry from "@sentry/react";

/**
 * Le routeur intercepte les erreurs de rendu : on les remonte à Sentry.
 */
const RouteError = () => {
  const error = useRouteError();
  const notFound = isRouteErrorResponse(error) && error.status === 404;

  useEffect(() => {
    if (error && !notFound) Sentry.captureException(error);
  }, [error, notFound]);

  return (
    <Center mih="100vh" p="md">
      <Stack align="center" gap="sm">
        <Title order={2}>
          {notFound ? "Page introuvable" : "Une erreur est survenue"}
        </Title>
        <Text c="dimmed" ta="center">
          {notFound
            ? "Cette page n'existe pas."
            : "Nous en avons été informés. Vous pouvez recharger la page."}
        </Text>
        <Button onClick={() => (window.location.href = "/admin")}>
          Retour au tableau de bord
        </Button>
      </Stack>
    </Center>
  );
};

export default RouteError;
