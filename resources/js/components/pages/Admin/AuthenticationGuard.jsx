import { useAdminContext } from "../../../contexts/AdminContext";
import { Navigate } from "react-router-dom";

const AuthenticationGuard = ({ component: Component }) => {
  const { user } = useAdminContext();

  return !user ? <Navigate to="/admin/login" replace /> : <Component />;
};

export default AuthenticationGuard;
