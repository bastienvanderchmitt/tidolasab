import React, { useMemo, useRef } from "react";
import * as Yup from "yup";
import { Formik } from "formik";
import { Button, Col, Form, Row } from "reactstrap";
import Field from "../Field";
import { sendEmail } from "../../../api/contact";
import { faPaperPlane, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import ReCAPTCHA from "react-google-recaptcha";

const FormContact = () => {
  const { t } = useTranslation();
  const recaptchaRef = useRef();

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
      name: Yup.string().required(t("contact.name_validation")),
      email: Yup.string()
        .email(t("contact.email_validation"))
        .required(t("contact.email_required")),
      subject: Yup.string().required(t("contact.subject_validation")),
      message: Yup.string().required(t("contact.message_validation")),
    });
  }, [t]);

  const handleForm = async (values) => {
    try {
      const token = recaptchaRef.current.getValue();
      if (!token) {
        toast.error(t("contact.recaptcha_required"));
        return;
      }

      const { data } = await sendEmail({ ...values, recaptchaToken: token });
      if (data) toast.success(t("contact.sent"));
    } catch (e) {
      toast.error(e.error || t("common.error"));
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
                  <Field
                    type="text"
                    name="name"
                    placeholder={t("contact.name")}
                  />
                </Col>
              </Row>
              <Row>
                <Col className="form-group mb-4">
                  <Field
                    type="email"
                    name="email"
                    placeholder={t("contact.email")}
                  />
                </Col>
              </Row>
              <Row>
                <Col className="form-group mb-4">
                  <Field
                    type="text"
                    name="subject"
                    placeholder={t("contact.subject")}
                  />
                </Col>
              </Row>
              <Row>
                <Col className="form-group mb-4">
                  <Field
                    type="textarea"
                    name="message"
                    placeholder={t("contact.message")}
                  />
                </Col>
              </Row>
              <Row>
                <Col className="form-group mb-4">
                  <ReCAPTCHA
                    sitekey={"6LeV2q0qAAAAAHkX-olZaIJBgZX7VjcDOdXU7Qb1"}
                    ref={recaptchaRef}
                  />
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
