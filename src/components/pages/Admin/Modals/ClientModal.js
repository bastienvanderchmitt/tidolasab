import React, { useMemo } from "react";
import * as Yup from "yup";
import { saveClient } from "../../../../api/client";
import toast from "react-hot-toast";
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
import { Formik } from "formik";
import Field from "../../../formik/Field";

const ClientModal = ({ isOpen, close, client }) => {
  const initialValues = useMemo(() => {
    return {
      name: client ? client.nom : "",
      firstName: client ? client.prenom : "",
      email: client ? client.email : "",
      phone: client ? client.telephone : "",
      address: client ? client.adresse : "",
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
      const response = await saveClient(data);
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
        {({ isSubmitting, handleSubmit }) => (
          <Form onSubmit={handleSubmit}>
            <ModalHeader>{client ? "Edition" : "Ajout"} client</ModalHeader>
            <ModalBody>
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

export default ClientModal;
