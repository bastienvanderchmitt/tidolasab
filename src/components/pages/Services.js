import { useLayoutContext } from "../../contexts/LayoutContext";
import { useEffect } from "react";
import { pages } from "../../helpers/pages";
import Essentials from "./Home/Essentials";

const Services = () => {
  const { setHeader } = useLayoutContext();

  useEffect(() => {
    setHeader(pages.services);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return <Essentials />;
};

export default Services;
