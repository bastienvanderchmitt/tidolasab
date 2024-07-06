import { login } from "../../../api/user";
import { authService } from "../../../helpers/authService";
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
import logo from "../../../assets/img/logo_final.png";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import banner from "../../../assets/img/locations/location_11.jpeg";

const Login = () => {
  const { setUser, setIsAuthenticated, isAuthenticated } = useAdminContext();

  const initialValues = useMemo(() => {
    return { username: "", password: "" };
  }, []);

  const validationSchema = useMemo(() => {
    return Yup.object().shape({
      username: Yup.string().required("Veuillez indiquer un login."),
      password: Yup.string().required("Veuillez indiquer un mot de passe."),
    });
  }, []);

  const handleForm = async (values) => {
    try {
      const { data } = await login({
        login: values.username,
        password: values.password,
      });
      if (data?.user && data?.token) {
        data && authService.setUser(data);
        const user = authService.getUser();
        toast.success("Bienvenue " + user.name);

        // TODO : UseFull ???
        setUser(user);
        setIsAuthenticated(true);
      } else {
        toast.error("Identifiants inconnus");
      }
    } catch (e) {
      toast.error(e.error || "Une erreur est survenue.");
      console.log("e", e);
    }
  };

  return isAuthenticated ? (
    <Navigate to="/admin/" replace />
  ) : (
    <div
      style={{
        backgroundImage: "url(" + banner + ")",
        backgroundSize: "cover",
        height: "100vH",
        width: "100vW",
      }}
    >
      <Toaster />
      <Container>
        <Row className="justify-content-center" style={{ paddingTop: "15%" }}>
          <Col lg={4} md={6} sm={12}>
            <Card className="bg-transparent border-0">
              <CardBody className="text-center bg-transparent p-4 text-white">
                <img alt="logo" src={logo} style={{ marginTop: "-25px" }} />
                <CardTitle tag="h4" className="mt-4">
                  Connexion
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
                        <Field
                          type="text"
                          name="username"
                          placeHolder="Login"
                        />
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
                        <FontAwesomeIcon icon={faPaperPlane} className="me-2" />
                        Se connecter
                      </Button>
                    </Form>
                  )}
                </Formik>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;
