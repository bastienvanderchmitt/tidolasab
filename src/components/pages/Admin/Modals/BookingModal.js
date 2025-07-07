import { Col, Container, Modal, ModalBody, ModalHeader, Row } from "reactstrap";
import Sidebar from "../../Booking/Sidebar";
import React, { useEffect } from "react";
import { useBookingContext } from "../../../../contexts/BookingContext";

const BookingModal = ({ isOpen, toggle, callback }) => {
  const { setAdults, setChild, setType, setSelectedDates } =
    useBookingContext();

  useEffect(() => {
    if (!isOpen) {
      setAdults(1);
      setChild(0);
      setType("Classique");
      setSelectedDates([]);
    }
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

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
