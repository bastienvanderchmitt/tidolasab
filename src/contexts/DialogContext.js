import { createContext, useState } from "react";
import { v4 as uuid } from "uuid";
import DialogContainer from "./DialogWrapper";
import useContextFactory from "../hooks/useContextFactory";

const DialogContext = createContext({});
export const useDialogContext = () =>
  useContextFactory("dialog context", DialogContext);

const DialogContextProvider = ({ children }) => {
  const [dialogs, setDialogs] = useState({});

  const addDialog = (dialog) =>
    setDialogs((dialogs) => ({ ...dialogs, [uuid()]: dialog }));

  const closeDialog = (uid) => {
    setDialogs((dialogs) => {
      delete dialogs[uid];
      return { ...dialogs };
    });
  };

  return (
    <DialogContext.Provider value={{ addDialog }}>
      {children}
      {Object.entries(dialogs).map(([uid, dialog]) => (
        <DialogContainer
          key={uid}
          dialog={dialog}
          close={() => closeDialog(uid)}
        />
      ))}
    </DialogContext.Provider>
  );
};

export default DialogContextProvider;
