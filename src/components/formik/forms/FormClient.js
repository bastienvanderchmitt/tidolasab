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

const FormClient = ({ isOpen, toggle }) => {
  const navigate = useNavigate();

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
      name: Yup.string().required("Veuillez indiquer un nom."),
      firstName: Yup.string().required("Veuillez indiquer un prénom."),
      email: Yup.string()
        .email("Veuillez indiquer un email valide.")
        .required("Veuillez indiquer un email."),
      phone: Yup.string().required("Veuillez indiquer un numéro de téléphone."),
      address: Yup.string().required("Veuillez indiquer une adresse."),
      postalCode: Yup.string().required("Veuillez indiquer un code postal."),
      city: Yup.string().required("Veuillez indiquer une ville."),
      country: Yup.string().required("Veuillez indiquer un pays."),
    });
  }, []);

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
      });
      if (res?.data?.bookingId) {
        toggle();
        setBooked(true);
        navigate("/success");
      }
    } catch (e) {
      // addToast(e.api_error || "Une erreur est survenue.", TOAST_ERROR);
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
                      <Field type="text" name="name" label="Nom" />
                    </Col>
                    <Col className="form-group mb-4">
                      <Field type="text" name="firstName" label="Prénom" />
                    </Col>
                  </Row>
                  <Row>
                    <Col className="form-group mb-4" xs={12} lg={6}>
                      <Field type="email" name="email" label="Email" />
                    </Col>
                    <Col className="form-group mb-4">
                      <Field type="text" name="phone" label="Téléphone" />
                    </Col>
                  </Row>
                  <Row>
                    <Col className="form-group mb-4" xs={12} lg={6}>
                      <Field type="text" name="address" label="Adresse" />
                    </Col>
                    <Col className="form-group mb-4">
                      <Field
                        type="text"
                        name="postalCode"
                        label="Code postal"
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col className="form-group mb-4">
                      <Field type="text" name="city" label="Ville" />
                    </Col>
                    <Col className="form-group mb-4">
                      <Field type="text" name="country" label="Pays" />
                    </Col>
                  </Row>
                </div>
                <div className="content-total">
                  <span className="title-total">Total :</span>
                  <span className="total">{total ? total + " €" : ""}</span>
                </div>
                <div className="content-detail">
                  <span className="title-detail">Nombre de nuits :</span>
                  <span className="detail">{days}</span>
                </div>
                {/*<span>*/}
                {/*  (du {checkIn} au {checkOut})*/}
                {/*</span>*/}
              </div>
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
                      // onClick={handleForm}
                    >
                      Réserver
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
