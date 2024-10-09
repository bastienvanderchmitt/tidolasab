import { Col, Container, Modal, ModalBody, ModalHeader, Row } from "reactstrap";
import Sidebar from "../../Booking/Sidebar";
import React from "react";

const BookingModal = ({ isOpen, toggle, callback }) => {
  return (
    <Modal isOpen={isOpen} toggle={toggle} className="modal-client" size="lg">
      <ModalHeader toggle={toggle}>Nouvelle réservation</ModalHeader>
      <ModalBody>
        <Container>
          <Row>
            <Col>
              <Sidebar callbackAdmin={callback} />
            </Col>
          </Row>
        </Container>
      </ModalBody>
    </Modal>
  );
};

export default BookingModal;
