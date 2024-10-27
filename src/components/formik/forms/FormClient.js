import React, { useMemo } from "react";
import * as Yup from "yup";
import { Formik } from "formik";
import {
  Button,
  Col,
  Form,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
} from "reactstrap";
import Field from "../Field";
import { useBookingContext } from "../../../contexts/BookingContext";
import { saveBooking } from "../../../api/booking";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Price from "../../pages/Booking/Price";
import { useTranslation } from "react-i18next";

const FormClient = ({ isOpen, toggle, callbackAdmin }) => {
  const navigate = useNavigate();

  const { t, i18n } = useTranslation();

  const { checkIn, checkOut, total, days, adults, child, setBooked } =
    useBookingContext();

  const initialValues = useMemo(() => {
    return {
      name: "",
      firstName: "",
      email: "",
      phone: "",
      address: "",
      postalCode: "",
      city: "",
      country: "",
    };
  }, []);

  const validationSchema = useMemo(() => {
    return Yup.object().shape({
      name: Yup.string().required(t("client.name_validation")),
      firstName: Yup.string().required(t("client.firstName_validation")),
      email: Yup.string()
        .email(t("client.email_validation"))
        .required(t("client.email_required")),
      phone: Yup.string().required(t("client.phone_validation")),
      address: Yup.string().required(t("client.address_validation")),
      postalCode: Yup.string().required(t("client.postalCode_validation")),
      city: Yup.string().required(t("client.city_validation")),
      country: Yup.string().required(t("client.country_validation")),
    });
  }, [t]);

  const handleForm = async (values) => {
    try {
      const res = await saveBooking({
        ...values,
        checkIn: checkIn,
        checkOut: checkOut,
        children: child,
        adults: adults,
        total: total,
        days: days,
        language: i18n.language,
        isAdmin: !!callbackAdmin,
      });
      if (res?.data?.bookingId) {
        toggle();
        setBooked(true);
        if (!!callbackAdmin) {
          callbackAdmin();
        } else {
          navigate("/success");
        }
      }
    } catch (e) {
      toast.error(e.error || "Une erreur est survenue.");
      console.log("e", e);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleForm}
      enableReinitialize
    >
      {({ handleSubmit, isSubmitting }) => (
        <Modal
          isOpen={isOpen}
          toggle={toggle}
          className="modal-client"
          size="lg"
        >
          <Form onSubmit={handleSubmit}>
            <ModalHeader toggle={toggle}>Réservation</ModalHeader>
            <ModalBody>
              <div
                className="content-block-form with-action"
                id="client-form-content"
              >
                <div className="content">
                  <Row>
                    <Col className="form-group mb-4">
                      <Field type="text" name="name" label={t("client.name")} />
                    </Col>
                    <Col className="form-group mb-4">
                      <Field
                        type="text"
                        name="firstName"
                        label={t("client.firstName")}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col className="form-group mb-4" xs={12} lg={6}>
                      <Field
                        type="email"
                        name="email"
                        label={t("client.email")}
                      />
                    </Col>
                    <Col className="form-group mb-4">
                      <Field
                        type="text"
                        name="phone"
                        label={t("client.phone")}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col className="form-group mb-4" xs={12} lg={6}>
                      <Field
                        type="text"
                        name="address"
                        label={t("client.address")}
                      />
                    </Col>
                    <Col className="form-group mb-4">
                      <Field
                        type="text"
                        name="postalCode"
                        label={t("client.postalCode")}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col className="form-group mb-4">
                      <Field type="text" name="city" label={t("client.city")} />
                    </Col>
                    <Col className="form-group mb-4">
                      <Field
                        type="text"
                        name="country"
                        label={t("client.country")}
                      />
                    </Col>
                  </Row>
                </div>

                <Row>
                  <Col>
                    <Price />
                  </Col>
                </Row>
              </div>
              <ModalFooter>
                <Row>
                  <Col>
                    <Button color="secondary" onClick={toggle}>
                      {t("common.cancel")}
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
                        t("common.booking")
                      )}
                    </Button>
                  </Col>
                </Row>
              </ModalFooter>
            </ModalBody>
          </Form>
        </Modal>
      )}
    </Formik>
  );
};

export default FormClient;
