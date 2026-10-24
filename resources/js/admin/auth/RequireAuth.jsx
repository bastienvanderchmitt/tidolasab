import { Navigate, Outlet } from "react-router-dom";
import { Center, Loader } from "@mantine/core";
import { useAuth } from "./AuthContext";

const RequireAuth = () => {
  const { user, checking } = useAuth();

  if (checking) {
    return (
      <Center mih="100vh">
        <Loader />
      </Center>
    );
  }

  return user ? <Outlet /> : <Navigate to="/connexion" replace />;
};

export default RequireAuth;
