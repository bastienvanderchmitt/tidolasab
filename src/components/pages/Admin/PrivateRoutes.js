import { useAdminContext } from "../../../contexts/AdminContext";
import { Navigate, Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { Col, Container, Row } from "reactstrap";
import Sidebar from "./Sidebar";

const PrivateRoutes = () => {
  const { user } = useAdminContext();

  return !user ? (
    <Navigate to="/admin/login" replace />
  ) : (
    <>
      <Toaster />
      <Container fluid className="dashboard min-vh-100">
        {/* Top Header */}
        <Row>
          <Col className="g-0">
            <Sidebar />
            <Container>
              <Outlet />
            </Container>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default PrivateRoutes;
