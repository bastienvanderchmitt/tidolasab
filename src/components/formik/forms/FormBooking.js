import React, { useMemo } from "react";
import * as Yup from "yup";
import { Formik } from "formik";
import { Button, ButtonGroup, Form } from "reactstrap";
import Field from "../Field";
import { useBookingContext } from "../../../contexts/BookingContext";
import NumberField from "../NumberField";
import useToggle from "../../../hooks/useToggle";
import FormClient from "./FormClient";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarDays, faSpinner } from "@fortawesome/free-solid-svg-icons";
import Price from "../../pages/Booking/Price";
import { priceLowSeason } from "../../../helpers/env";
import { useTranslation } from "react-i18next";
import { bookingTypes } from "../../../helpers/bookingTypes";

const FormBooking = ({ callbackAdmin }) => {
  const { checkIn, checkOut, setAdults, setChild, type, setType } =
    useBookingContext();
  const [isOpen, toggle] = useToggle();

  const { t } = useTranslation();

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
      checkIn: Yup.date().required(t("booking.checkIn_validation")),
      checkOut: Yup.date().required(t("booking.checkOut_validation")),
      adults: Yup.number().required(t("booking.adults_validation")),
    });
  }, [t]);

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
                    label={t("booking.checkIn")}
                    onClick={scrollToCalendar}
                    readOnly
                  />
                </div>
                <div className="form-group mb-4">
                  <Field
                    type="date"
                    name="checkOut"
                    label={t("booking.checkOut")}
                    onClick={scrollToCalendar}
                    readOnly
                  />
                </div>
                <div className="form-group mb-4">
                  <NumberField
                    type="number"
                    name="adults"
                    label={t("booking.adults")}
                    helpText={t("booking.adults_age")}
                    onChange={(value) => setAdults(value)}
                    max={2}
                  />
                </div>
                <div className="form-group mb-4 d-none">
                  <NumberField
                    type="number"
                    name="children"
                    label={t("booking.children")}
                    helpText={t("booking.children_age")}
                    onChange={(value) => setChild(value)}
                    max={4}
                  />
                </div>
              </div>
              <Price isAdmin={!!callbackAdmin} />
              {!!callbackAdmin && (
                <div className={"mt-5 mb-3"}>
                  <ButtonGroup className="w-100">
                    {bookingTypes.map((t, index) => (
                      <Button
                        key={index}
                        color="secondary"
                        outline
                        onClick={() => setType(t)}
                        active={type === t}
                      >
                        {t}
                      </Button>
                    ))}
                  </ButtonGroup>
                </div>
              )}
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
                    <>
                      <FontAwesomeIcon icon={faCalendarDays} className="me-2" />
                      {t("common.booking")}
                    </>
                  )}
                </Button>
                <p className="prices">
                  <u>{t("booking.prices")}</u>
                  {t("booking.from")}
                  <b>{priceLowSeason}€</b>
                  {t("booking.prices_text")}
                </p>
                {!callbackAdmin && (
                  <p className="conditions">{t("booking.conditions")}</p>
                )}
                <p className="conditions">{t("booking.christmas")}</p>
              </div>
            </div>
          </Form>
        )}
      </Formik>
      <FormClient
        isOpen={isOpen}
        toggle={toggle}
        callbackAdmin={callbackAdmin}
      />
    </>
  );
};

export default FormBooking;
