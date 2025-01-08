import React, { useMemo } from "react";
import * as Yup from "yup";
import { editBooking } from "../../../../api/booking";
import toast from "react-hot-toast";
import {
  Button,
  ButtonGroup,
  Col,
  Form,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
} from "reactstrap";
import { Formik } from "formik";
import Field from "../../../formik/Field";
import { bookingTypes } from "../../../../helpers/bookingTypes";

const EditBookingModal = ({ isOpen, close, booking }) => {
  const initialValues = useMemo(() => {
    return {
      id: booking.id,
      checkIn: booking.date_arrivee,
      checkOut: booking.date_depart,
      days: booking.nombre_nuits,
      adults: +booking.adultes,
      children: +booking.enfants,
      total: booking.prix_total,
      type: booking.type,
    };
  }, [booking]);

  const validationSchema = useMemo(() => {
    return Yup.object().shape({});
  }, []);

  const handleSubmit = async (values) => {
    try {
      const response = await editBooking(values);
      toast.success("Modification effectuée avec succès");
      return close({ action: "success", data: response.data });
    } catch (e) {
      return toast.error("Une erreur est survenue");
    }
  };

  const handleDateChange = (setFieldValue, values) => {
    const checkInDate = new Date(values.checkIn);
    const checkOutDate = new Date(values.checkOut);

    if (checkInDate && checkOutDate) {
      const timeDiff = checkOutDate - checkInDate;
      const days = Math.ceil(timeDiff / (1000 * 3600 * 24)); // Convertir en jours
      setFieldValue("days", days >= 0 ? days : 0); // Assurez-vous que days ne soit pas négatif
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      toggle={() => close({ action: "cancel" })}
      centered
      size="lg"
    >
      <Formik
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
        enableReinitialize
        initialValues={initialValues}
      >
        {({ isSubmitting, handleSubmit, setFieldValue, values }) => (
          <Form onSubmit={handleSubmit}>
            <ModalHeader>
              {booking ? "Edition" : "Ajout"} réservation
            </ModalHeader>
            <ModalBody>
              <Row>
                <Col className="form-group mb-4">
                  <Label>Type</Label>
                  <ButtonGroup className="w-100">
                    {bookingTypes.map((t, index) => (
                      <Button
                        key={index}
                        color="secondary"
                        outline
                        onClick={() => setFieldValue("type", t)}
                        active={values.type === t}
                      >
                        {t}
                      </Button>
                    ))}
                  </ButtonGroup>
                </Col>
              </Row>
              <Row>
                <Col className="form-group mb-4">
                  <Field
                    type="date"
                    name="checkIn"
                    label="Arrivée"
                    onChange={async (e) => {
                      await setFieldValue("checkIn", e.target.value);
                      handleDateChange(setFieldValue, {
                        ...values,
                        checkIn: e.target.value,
                      });
                    }}
                  />
                </Col>
                <Col className="form-group mb-4">
                  <Field
                    type="date"
                    name="checkOut"
                    label="Départ"
                    onChange={async (e) => {
                      await setFieldValue("checkOut", e.target.value);
                      handleDateChange(setFieldValue, {
                        ...values,
                        checkOut: e.target.value,
                      });
                    }}
                  />
                </Col>
              </Row>
              <Row>
                <Col className="form-group mb-4">
                  <Field type="number" name="adults" label="Adultes" min={0} />
                </Col>
                <Col className="form-group mb-4">
                  <Field
                    type="number"
                    name="children"
                    label="Enfants"
                    min={0}
                  />
                </Col>
                <Col className="form-group mb-4">
                  <Field
                    type="number"
                    name="total"
                    label="Total (€)"
                    min={0}
                    step="0.0001"
                  />
                </Col>
              </Row>
            </ModalBody>
            <ModalFooter className="d-flex justify-content-between">
              <Button
                type="button"
                color="tertiary"
                outline
                onClick={() => close({ action: "cancel" })}
              >
                Annuler
              </Button>
              <Button type="submit" color="secondary" disabled={isSubmitting}>
                Confirmer
              </Button>
            </ModalFooter>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default EditBookingModal;
