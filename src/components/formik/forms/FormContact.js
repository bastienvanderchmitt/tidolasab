import React, { useMemo } from "react";
import * as Yup from "yup";
import { Formik } from "formik";
import { Button, Col, Form, Row } from "reactstrap";
import Field from "../Field";
import { sendEmail } from "../../../api/contact";
import { faPaperPlane, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import toast from "react-hot-toast";

const FormContact = () => {
  const initialValues = useMemo(() => {
    return {
      name: "",
      email: "",
      subject: "",
      message: "",
    };
  }, []);

  const validationSchema = useMemo(() => {
    return Yup.object().shape({
      name: Yup.string().required("Veuillez indiquer un nom."),
      email: Yup.string()
        .email("Veuillez indiquer un email valide.")
        .required("Veuillez indiquer un email."),
      subject: Yup.string().required("Veuillez indiquer un sujet."),
      message: Yup.string().required("Veuillez indiquer un message."),
    });
  }, []);

  const handleForm = async (values) => {
    try {
      await sendEmail({ ...values });
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
        <Form onSubmit={handleSubmit}>
          <div
            className="content-block-form with-action"
            id="client-form-content"
          >
            <div className="content">
              <Row>
                <Col className="form-group mb-4">
                  <Field type="text" name="name" placeholder="Nom" />
                </Col>
              </Row>
              <Row>
                <Col className="form-group mb-4">
                  <Field type="email" name="email" placeholder="Email" />
                </Col>
              </Row>
              <Row>
                <Col className="form-group mb-4">
                  <Field type="text" name="subject" placeholder="Sujet" />
                </Col>
              </Row>
              <Row>
                <Col className="form-group mb-4">
                  <Field type="textarea" name="message" placeholder="Message" />
                </Col>
              </Row>
            </div>
            <Button
              color="primary"
              type="submit"
              className="w-100 btn btn-primary text-white"
              disabled={!!isSubmitting}
            >
              {isSubmitting ? (
                <FontAwesomeIcon icon={faSpinner} spinPulse />
              ) : (
                <>
                  <FontAwesomeIcon icon={faPaperPlane} className="me-2" />
                  ENVOYER
                </>
              )}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default FormContact;
