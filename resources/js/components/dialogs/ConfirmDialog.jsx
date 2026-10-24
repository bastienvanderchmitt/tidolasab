import React from "react";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ConfirmDialog = ({ isOpen, close, title, content }) => {
  return (
    <Modal
      isOpen={isOpen}
      toggle={() => close(false)}
      zIndex={2000}
      className="modal-confirm"
    >
      <ModalHeader>{title || "Veuillez confirmer"}</ModalHeader>
      <ModalBody className="p-4">{content}</ModalBody>
      <ModalFooter className="justify-content-between">
        <Button color="tertiary" onClick={() => close(false)} outline>
          Annuler
        </Button>
        <Button color="secondary" onClick={() => close(true)}>
          <FontAwesomeIcon icon={faCheck} className="me-2" />
          Confirmer
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default ConfirmDialog;
