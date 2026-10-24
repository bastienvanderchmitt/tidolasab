import useDialog from "./useDialog";
import ConfirmDialog from "../components/dialogs/ConfirmDialog";

export default function useConfirmDialog() {
  const dialog = useDialog();

  return (message, title = undefined) =>
    dialog(<ConfirmDialog content={message} title={title} />);
}
