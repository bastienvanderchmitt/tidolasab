import { useRouteError } from "react-router-dom";

const Error = () => {
  const error = useRouteError();
  console.log("error", error);

  return <h1>ERROR</h1>;
};

export default Error;
