import { useLayoutContext } from "../../contexts/LayoutContext";
import { useEffect } from "react";
import { pages } from "../../helpers/pages";

const Contact = () => {
  const { setHeader } = useLayoutContext();

  useEffect(() => {
    setHeader(pages.contact);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return <h1>Contact</h1>;
};

export default Contact;
