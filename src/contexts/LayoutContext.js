import React, { useState, createContext } from "react";
import useContextFactory from "../hooks/useContextFactory";
import { pages } from "../helpers/pages";
const LayoutContext = createContext({});

export const useLayoutContext = () => {
  return useContextFactory("LayoutContext", LayoutContext);
};

const LayoutContextProvider = ({ children }) => {
  const [header, setHeader] = useState(pages.home);

  return (
    <LayoutContext.Provider
      value={{
        header,
        setHeader,
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
};

export default LayoutContextProvider;
