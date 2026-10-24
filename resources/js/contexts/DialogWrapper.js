import React, { useState } from "react";

const TIMEOUT = 300;

const DialogContainer = ({ dialog, close }) => {
  const [isOpen, setIsOpen] = useState(true);

  const handleClose = (result) => {
    setIsOpen(false);

    window.setTimeout(() => {
      dialog.resolve(result);
      close();
    }, TIMEOUT);
  };

  const Component = dialog.component;

  return React.cloneElement(Component, { isOpen, close: handleClose });
};

export default DialogContainer;
