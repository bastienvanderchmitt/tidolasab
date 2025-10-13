import {
  Button,
  Col,
  Container,
  Form,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
} from "reactstrap";
import React, { useEffect, useMemo } from "react";
import Field from "../../../formik/Field";
import * as Yup from "yup";
import { validate } from "../../../../api/booking";
import toast from "react-hot-toast";
import { Formik } from "formik";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import moment from "moment-timezone";
import { paymentTypes } from "../../../../helpers/paymentTypes";
import Price from "../../Booking/Price";
import { useBookingContext } from "../../../../contexts/BookingContext";

const ValidateModal = ({ isOpen, toggle, booking, reload }) => {
  const { setAdults, setChild, setType, setSelectedDates } =
    useBookingContext();

  useEffect(() => {
    if (booking) {
      setAdults(+booking.adultes);
      setChild(+booking.enfants);
      setType(booking.type);

      // Parse YYYY-MM-DD
      const arriveeParts = booking.date_arrivee.split("-");
      const departParts = booking.date_depart.split("-");
      const arriveeYear = parseInt(arriveeParts[0], 10);
      const arriveeMonth = parseInt(arriveeParts[1], 10) - 1; // 0-based
      const arriveeDay = parseInt(arriveeParts[2], 10);
      const departYear = parseInt(departParts[0], 10);
      const departMonth = parseInt(departParts[1], 10) - 1;
      const departDay = parseInt(departParts[2], 10);

      // Offset CET hiver (janvier: +1h). 14:00 CET = 13:00 UTC ; 10:00 CET = 9:00 UTC
      const cetOffset = 1;
      const arrivalUtcHour = 14 - cetOffset; // 13
      const departUtcHour = 10 - cetOffset; // 9
      const dates = [
        new Date(
          Date.UTC(arriveeYear, arriveeMonth, arriveeDay, arrivalUtcHour, 0, 0),
        ),
        new Date(
          Date.UTC(departYear, departMonth, departDay, departUtcHour, 0, 0),
        ),
      ];

      dates[0]?.setHours(14);
      dates[1]?.setHours(10);
      dates[1]?.setMinutes(0);
      dates[1]?.setSeconds(0);
      setSelectedDates(dates);
    }
  }, [booking]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!isOpen) {
      setAdults(1);
      setChild(0);
      setType("Classique");
      setSelectedDates([]);
    }
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  const initialValues = useMemo(() => {
    return {
      type: "virement",
      deposit: booking?.prix_total / 2,
      date: moment().format("YYYY-MM-DD"),
    };
  }, [booking]);

  const validationSchema = useMemo(() => {
    return Yup.object().shape({
      deposit: Yup.number().required(
        "Veuillez indiquer un montant pour l'acompte.",
      ),
      date: Yup.date().required("Veuillez indiquer une date de paiement."),
    });
  }, []);

  const handleForm = async (values) => {
    try {
      const res = await validate({ id: booking.id, ...values });
      if (res?.data?.success) {
        toggle();
        toast.success("Réservation validée");
        reload();
      }
    } catch (e) {
      toast.error(e.error || "Une erreur est survenue.");
      console.log("e", e);
    }
  };

  return !booking ? null : (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleForm}
      enableReinitialize
    >
      {({ handleSubmit, isSubmitting, errors, values }) => (
        <Modal
          isOpen={isOpen}
          toggle={toggle}
          className="modal-client"
          size="lg"
        >
          <Form onSubmit={handleSubmit}>
            <ModalHeader toggle={toggle}>Valider réservation</ModalHeader>
            <ModalBody>
              <Container>
                <Row>
                  <Col>
                    <p>
                      Réservation au nom de{" "}
                      <span className="text-primary">{booking.nom_client}</span>{" "}
                      :
                    </p>
                    <Price reelTotal={booking.prix_total} />
                  </Col>
                  <Col>
                    <div>
                      <Field
                        type="select"
                        name="type"
                        label="Moyen de paiement"
                      >
                        {paymentTypes.map((t, index) => (
                          <option
                            key={index}
                            color="secondary"
                            value={t}
                            // onClick={() => setFieldValue("type", t)}
                            // active={values.type === t}
                          >
                            {t.toUpperCase()}
                          </option>
                        ))}
                      </Field>
                    </div>
                    <div className="pt-3">
                      <Field
                        type="number"
                        name="deposit"
                        label="Acompte versé (€)"
                        step="0.01"
                      />
                    </div>
                    <div className="pt-3">
                      <Field type="date" name="date" label="Date du paiement" />
                    </div>
                  </Col>
                </Row>
                <Row></Row>
              </Container>
            </ModalBody>
            <ModalFooter>
              <Row>
                <Col>
                  <Button color="secondary" onClick={toggle}>
                    Annuler
                  </Button>
                </Col>
                <Col>
                  <Button
                    color="primary"
                    type="submit"
                    disabled={!!isSubmitting}
                  >
                    {isSubmitting ? (
                      <FontAwesomeIcon icon={faSpinner} spinPulse />
                    ) : (
                      "Valider"
                    )}
                  </Button>
                </Col>
              </Row>
            </ModalFooter>
          </Form>
        </Modal>
      )}
    </Formik>
  );
};

export default ValidateModal;
