import React, { useState, createContext } from "react";
import useContextFactory from "../hooks/useContextFactory";
const LayoutContext = createContext({});

export const useLayoutContext = () => {
  return useContextFactory("LayoutContext", LayoutContext);
};

const LayoutContextProvider = ({ children }) => {
  const [header, setHeader] = useState();

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
