import { Text } from "@mantine/core";
import { modals } from "@mantine/modals";

/**
 * Demande confirmation avant une action irréversible.
 */
export const confirmAction = ({
  title,
  message,
  confirmLabel = "Confirmer",
  danger = true,
  onConfirm,
}) =>
  modals.openConfirmModal({
    title,
    children: <Text size="sm">{message}</Text>,
    labels: { confirm: confirmLabel, cancel: "Annuler" },
    confirmProps: { color: danger ? "red" : "lagon" },
    onConfirm,
  });
