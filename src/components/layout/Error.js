import { useRouteError } from "react-router-dom";
import Menu from "./Menu";
import Footer from "./Footer";
import { useLayoutContext } from "../../contexts/LayoutContext";
import { useEffect } from "react";
import { pages } from "../../helpers/pages";

const Error = () => {
  const error = useRouteError();
  console.log(error);

  const { setHeader } = useLayoutContext();

  useEffect(() => {
    setHeader(pages.error);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <Menu />
      <Footer />
    </>
  );
};

export default Error;
