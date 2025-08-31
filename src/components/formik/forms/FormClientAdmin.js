import React, { useMemo } from "react";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { Button, Card, CardBody, CardFooter, Col, Form, Row } from "reactstrap";
import { Formik } from "formik";
import { saveClient } from "../../../api/client";
import Field from "../Field";

const FormClientAdmin = ({ client }) => {
  const initialValues = useMemo(() => {
    return {
      name: client ? client.nom : "",
      firstName: client ? client.prenom : "",
      email: client ? client.email : "",
      phone: client ? client.telephone : "",
      address: client ? client.adresse : "",
      note: client ? client.note : "",
    };
  }, [client]);

  const validationSchema = useMemo(() => {
    return Yup.object().shape({
      // name: Yup.string().required("Veuillez indiquer un nom."),
      // firstName: Yup.string().required("Veuillez indiquer un prénom."),
      // email: Yup.string()
      //   .email("Veuillez indiquer un email valide.")
      //   .required("Veuillez indiquer un email."),
      // phone: Yup.string().required("Veuillez indiquer un numéro de téléphone."),
      // address: Yup.string().required("Veuillez indiquer une adresse."),
    });
  }, []);

  const handleSubmit = async (values) => {
    try {
      const data = client ? { id: client.id, ...values } : values;
      await saveClient(data);
      toast.success("Modification effectuée avec succès");
    } catch (e) {
      return toast.error("Une erreur est survenue");
    }
  };

  return (
    <Formik
      onSubmit={handleSubmit}
      validationSchema={validationSchema}
      enableReinitialize
      initialValues={initialValues}
    >
      {({ isSubmitting, handleSubmit }) => (
        <Form onSubmit={handleSubmit}>
          <Card>
            <CardBody>
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
                <Col className="form-group mb-4">
                  <Field type="text" name="address" label="Adresse" />
                </Col>
              </Row>
              <Row>
                <Col className="form-group mb-4">
                  <Field type="textarea" name="note" label="Note" rows={5} />
                </Col>
              </Row>
            </CardBody>
            <CardFooter className="d-flex justify-content-between">
              <Button type="submit" color="secondary" disabled={isSubmitting}>
                Confirmer
              </Button>
            </CardFooter>
          </Card>
        </Form>
      )}
    </Formik>
  );
};

export default FormClientAdmin;
