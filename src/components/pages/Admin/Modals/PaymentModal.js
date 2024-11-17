import React, { useMemo } from "react";
import * as Yup from "yup";
import { savePayment } from "../../../../api/payment";
import toast from "react-hot-toast";
import {
  Button,
  ButtonGroup,
  Col,
  Form,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
} from "reactstrap";
import { Formik } from "formik";
import Field from "../../../formik/Field";
import useApi from "../../../../hooks/useApi";
import { getBookings } from "../../../../api/booking";
import { paymentTypes } from "../../../../helpers/paymentTypes";

const PaymentModal = ({ isOpen, close, payment }) => {
  const [{ bookings }] = useApi(getBookings);

  const initialValues = useMemo(() => {
    return {
      deposit: payment ? payment.montant_paiement : "",
      date: payment ? payment.date_paiement : "",
      booking: payment ? payment.id_reservation : "",
      type: payment ? payment.moyen_paiement : "virement",
    };
  }, [payment]);

  const validationSchema = useMemo(() => {
    return Yup.object().shape({
      deposit: Yup.number().required(
        "Veuillez indiquer un montant pour l'acompte.",
      ),
      date: Yup.date().required("Veuillez indiquer une date de paiement."),
      booking: Yup.number().required("Veuillez indiquer une réservation."),
    });
  }, []);

  const handleSubmit = async (values) => {
    try {
      const data = payment
        ? { id: payment.id, id_reservation: payment.id_reservation, ...values }
        : values;
      const response = await savePayment(data);
      toast.success("Modification effectuée avec succès");
      return close({ action: "success", data: response.data });
    } catch (e) {
      return toast.error("Une erreur est survenue");
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
        {({ isSubmitting, handleSubmit, values, setFieldValue }) => (
          <Form onSubmit={handleSubmit}>
            <ModalHeader>{payment ? "Edition" : "Ajout"} paiement</ModalHeader>
            <ModalBody>
              <Row className="mt-3 mb-4">
                <Col>
                  <ButtonGroup className="w-100">
                    {paymentTypes.map((t, index) => (
                      <Button
                        key={index}
                        color="secondary"
                        outline
                        onClick={() => setFieldValue("type", t)}
                        active={values.type === t}
                      >
                        {t.toUpperCase()}
                      </Button>
                    ))}
                  </ButtonGroup>
                </Col>
              </Row>
              <Row>
                <Col className="form-group">
                  <Field
                    type="number"
                    name="deposit"
                    label="Acompte versé (€)"
                    step="0.01"
                  />
                </Col>
                <Col className="form-group">
                  <Field type="date" name="date" label="Date du paiement" />
                </Col>
              </Row>
              <Row className="mt-4">
                <Col className="form-group mb-4">
                  <Field
                    type="select"
                    name="booking"
                    label="Réservation associée"
                  >
                    <option></option>
                    {bookings?.map((b, i) => (
                      <option key={i} value={b.id}>
                        {b.nom_client} - du {b.date_depart} au {b.date_arrivee}{" "}
                        - {b.statut}
                      </option>
                    ))}
                  </Field>
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

export default PaymentModal;
