import { Alert, Center, Loader } from "@mantine/core";
import { IconAlertTriangle } from "@tabler/icons-react";

/**
 * Affiche le chargement ou l'erreur d'une requête, sinon son contenu.
 */
const QueryState = ({ query, children }) => {
  if (query.isPending) {
    return (
      <Center py="xl">
        <Loader />
      </Center>
    );
  }

  if (query.isError) {
    return (
      <Alert
        color="red"
        icon={<IconAlertTriangle />}
        title="Chargement impossible"
      >
        {query.error?.message}
      </Alert>
    );
  }

  return children(query.data);
};

export default QueryState;
