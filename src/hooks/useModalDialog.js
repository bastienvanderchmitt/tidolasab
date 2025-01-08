import useDialog from "./useDialog";
import ModalDialog from "../components/dialogs/ModalDialog";

export default function useModalDialog() {
  const dialog = useDialog();

  return (message, title = undefined) =>
    dialog(<ModalDialog content={message} title={title} />);
}
