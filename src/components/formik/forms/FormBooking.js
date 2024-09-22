import React, { useMemo } from "react";
import * as Yup from "yup";
import { Formik } from "formik";
import { Button, Form } from "reactstrap";
import Field from "../Field";
import { useBookingContext } from "../../../contexts/BookingContext";
import NumberField from "../NumberField";
import useToggle from "../../../hooks/useToggle";
import FormClient from "./FormClient";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import Price from "../../pages/Booking/Price";
import { priceLowSeason } from "../../../helpers/env";

const FormBooking = () => {
  const { checkIn, checkOut, setAdults, setChild } = useBookingContext();
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

  const handleForm = async () => {
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
        {({ handleSubmit, isSubmitting, onChange }) => (
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
                    onChange={(value) => setAdults(value)}
                    max={4}
                  />
                </div>
                <div className="form-group mb-4">
                  <NumberField
                    type="number"
                    name="children"
                    label="Enfants"
                    helpText="De 2 à 12 ans"
                    onChange={(value) => setChild(value)}
                    max={8}
                  />
                </div>
              </div>
              <Price />
              <div className="content-submit mt-4">
                <Button
                  type="submit"
                  className="w-100"
                  color="primary"
                  disabled={!!isSubmitting}
                >
                  {isSubmitting ? (
                    <FontAwesomeIcon icon={faSpinner} spinPulse />
                  ) : (
                    "Réserver"
                  )}
                </Button>
                <p className="prices">
                  <u>Tarifs :</u> à partir de <b>{priceLowSeason}€</b> par nuit.
                  Une demi-journée offerte par semaine. Taxe de séjour de 2€ par
                  nuit et par adulte.
                </p>
                <p className="conditions">
                  Le contrat de location vous sera transmis avec une demande de
                  versement d'un acompte de 50% (via virement bancaire) qui
                  confirmeront votre réservation. Le solde vous sera demandé 14
                  jours avant l'arrivée.
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
