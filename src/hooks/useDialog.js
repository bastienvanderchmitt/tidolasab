import { useDialogContext } from "../contexts/DialogContext";

export default function useDialog() {
  const { addDialog } = useDialogContext();

  return (component) =>
    new Promise((resolve) => addDialog({ component, resolve }));
}
