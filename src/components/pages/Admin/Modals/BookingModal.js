import { Col, Container, Modal, ModalBody, ModalHeader, Row } from "reactstrap";
import Sidebar from "../../Booking/Sidebar";
import React, { useEffect } from "react";
import { useBookingContext } from "../../../../contexts/BookingContext";
import { faPlusSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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
      <ModalHeader toggle={toggle}>
        <FontAwesomeIcon icon={faPlusSquare} className="me-2" />
        Nouvelle réservation
      </ModalHeader>
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
