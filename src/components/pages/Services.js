import { useLayoutContext } from "../../contexts/LayoutContext";
import { useEffect } from "react";
import { pages } from "../../helpers/pages";

const Services = () => {
  const { setHeader } = useLayoutContext();

  useEffect(() => {
    setHeader(pages.services);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return <h1>Services</h1>;
};

export default Services;
