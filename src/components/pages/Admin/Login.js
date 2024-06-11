import useApi from "../../../hooks/useApi";
import { login } from "../../../api/user";
import { authService } from "../../../helpers/authService";
import toast, { Toaster } from "react-hot-toast";
import { useAdminContext } from "../../../contexts/AdminContext";
import { Button } from "reactstrap";
import { Navigate, redirect } from "react-router-dom";
import Dashboard from "./Dashboard";

const Login = () => {
  const { setUser, setIsAuthenticated, isAuthenticated } = useAdminContext();

  const logIn = async () => {
    try {
      const { data } = await login({ login: "admin", password: "admin" });
      if (data?.user && data?.token) {
        data && authService.setUser(data);
        const user = authService.getUser();
        toast.success("Bienvenue " + user.name);

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
    <div>
      <Toaster />
      <h1>Login</h1>
      <Button onClick={logIn}>LOGIN</Button>
    </div>
  );
};

export default Login;
