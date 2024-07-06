import { useRouteError } from "react-router-dom";
import Menu from "./Menu";
import Footer from "./Footer";

const Error = () => {
  const error = useRouteError();
  console.log(error);

  return (
    <>
      <Menu />
      <Footer />
    </>
  );
};

export default Error;
