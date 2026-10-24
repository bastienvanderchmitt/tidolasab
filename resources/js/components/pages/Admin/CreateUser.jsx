import { create } from "../../../api/user";
import toast, { Toaster } from "react-hot-toast";
import { useAdminContext } from "../../../contexts/AdminContext";
import {
  Button,
  Card,
  CardBody,
  CardTitle,
  Col,
  Container,
  Form,
  FormGroup,
  Row,
} from "reactstrap";
import { Navigate } from "react-router-dom";
import React, { useMemo } from "react";
import * as Yup from "yup";
import { Formik } from "formik";
import Field from "../../formik/Field";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const CreateUser = () => {
  const { isAuthenticated } = useAdminContext();

  const initialValues = useMemo(() => {
    return { username: "", email: "", login: "", password: "" };
  }, []);

  const validationSchema = useMemo(() => {
    return Yup.object().shape({
      username: Yup.string().required("Veuillez indiquer un username."),
      email: Yup.string().required("Veuillez indiquer un email."),
      login: Yup.string().required("Veuillez indiquer un login."),
      password: Yup.string().required("Veuillez indiquer un mot de passe."),
    });
  }, []);

  const handleForm = async (values) => {
    try {
      const { data } = await create({
        name: values.username,
        email: values.email,
        login: values.login,
        password: values.password,
      });
      if (data?.user) {
        toast.success("Utilisateur crée");
      }
    } catch (e) {
      toast.error(e.error || "Une erreur est survenue.");
      console.log("e", e);
    }
  };

  return !isAuthenticated ? (
    <Navigate to="/admin/login" replace />
  ) : (
    <Container>
      <Toaster />
      <Row className="justify-content-center" style={{ paddingTop: "15%" }}>
        <Col lg={4} md={6} sm={12}>
          <Card className="bg-transparent border-0">
            <CardBody className="text-center bg-transparent p-4 text-white">
              <CardTitle tag="h4" className="mt-4 text-black">
                Crée utilisateur
              </CardTitle>
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleForm}
                enableReinitialize
              >
                {({ handleSubmit, isSubmitting }) => (
                  <Form onSubmit={handleSubmit} className="w-100 mt-5">
                    <FormGroup>
                      <Field type="text" name="username" placeHolder="Nom" />
                    </FormGroup>
                    <FormGroup>
                      <Field type="email" name="email" placeHolder="Email" />
                    </FormGroup>
                    <FormGroup>
                      <Field type="text" name="login" placeHolder="Login" />
                    </FormGroup>
                    <FormGroup>
                      <Field
                        type="password"
                        name="password"
                        placeHolder="Mot de passe"
                      />
                    </FormGroup>
                    <Button
                      color="primary text-white"
                      block
                      disabled={isSubmitting}
                    >
                      <FontAwesomeIcon icon={faPlus} className="me-2" />
                      Créer
                    </Button>
                  </Form>
                )}
              </Formik>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CreateUser;
