import React from "react";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";

const ModalDialog = ({ isOpen, close, title, content }) => {
  return (
    <Modal
      isOpen={isOpen}
      toggle={() => close(false)}
      zIndex={2000}
      className="modal-confirm"
    >
      {!!title && <ModalHeader>{title}</ModalHeader>}
      <ModalBody className="p-4">{content}</ModalBody>
      <ModalFooter className="justify-content-end">
        <Button color="secondary" onClick={() => close(true)}>
          Ok
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default ModalDialog;
