import useApi from "../../hooks/useApi";
import { login } from "../../api/user";

const Login = () => {
  const [{ test }] = useApi(login);

  console.log("test", test);

  return <h1>Login</h1>;
};

export default Login;
