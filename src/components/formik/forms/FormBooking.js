import React, { useMemo } from "react";
import * as Yup from "yup";
import { Formik } from "formik";
import { Button, Form } from "reactstrap";
import Field from "../Field";
import { useBookingContext } from "../../../contexts/BookingContext";
import NumberField from "../NumberField";
import useToggle from "../../../hooks/useToggle";
import FormClient from "./FormClient";

const FormBooking = () => {
  const { checkIn, checkOut, total, days, setAdults, setChild } =
    useBookingContext();
  const [isOpen, toggle] = useToggle();

  const initialValues = useMemo(() => {
    return {
      checkIn: checkIn,
      checkOut: checkOut,
      adults: 1,
      children: 0,
    };
  }, [checkIn, checkOut]);

  const validationSchema = useMemo(() => {
    return Yup.object().shape({
      checkIn: Yup.date().required("Veuillez indiquer une date d'arrivée."),
      checkOut: Yup.date().required("Veuillez indiquer une date de départ."),
      adults: Yup.number().required("Veuillez indiquer le nombre d'adultes."),
    });
  }, []);

  const handleForm = async (values) => {
    setAdults(values.adults);
    setChild(values.children);
    toggle();
  };

  const scrollToCalendar = (e) => {
    e.preventDefault();
    const element = document.getElementById("booking-calendar");
    window.scroll({
      top: element.offsetTop - 300,
      behavior: "smooth",
    });
  };

  return (
    <>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleForm}
        enableReinitialize
      >
        {({ handleSubmit, isSubmitting }) => (
          <Form onSubmit={handleSubmit} className="w-100">
            <div
              className="content-block-form with-action"
              id="booking-form-content"
            >
              <div className="content">
                <div className="form-group mb-4">
                  <Field
                    type="date"
                    name="checkIn"
                    label="Arrivée le :"
                    onClick={scrollToCalendar}
                  />
                </div>
                <div className="form-group mb-4">
                  <Field
                    type="date"
                    name="checkOut"
                    label="Départ le :"
                    onClick={scrollToCalendar}
                  />
                </div>
                <div className="form-group mb-4">
                  <NumberField
                    type="number"
                    name="adults"
                    label="Adultes"
                    helpText="13 ans et plus"
                  />
                </div>
                <div className="form-group mb-4">
                  <NumberField
                    type="number"
                    name="children"
                    label="Enfants"
                    helpText="De 2 à 12 ans"
                  />
                </div>
              </div>
              <div className="content-total">
                <span className="title-total">Total :</span>
                <span className="total">{total ? total + " €" : ""}</span>
              </div>
              {days && (
                <div className="content-detail">
                  <span className="title-total">Nombre de nuits :</span>
                  <span className="total">{days}</span>
                </div>
              )}
              <div className="content-submit mt-4">
                <Button
                  type="submit"
                  className="w-100"
                  color="primary"
                  disabled={!!isSubmitting}
                >
                  Réserver
                </Button>
                <p className="conditions">
                  Envoi du contrat de location sous conditions de versement d'un
                  acompte de 50% à la réservation (via virement bancaire). Le
                  solde vous sera demandé 14 jours avant l'arrivée.
                </p>
              </div>
            </div>
          </Form>
        )}
      </Formik>
      <FormClient isOpen={isOpen} toggle={toggle} />
    </>
  );
};

export default FormBooking;
