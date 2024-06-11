import React, { useState, createContext } from "react";
import useContextFactory from "../hooks/useContextFactory";
import { authService } from "../helpers/authService";
const AdminContext = createContext({});

export const useAdminContext = () => {
  return useContextFactory("AdminContext", AdminContext);
};

const AdminContextProvider = ({ children }) => {
  const currentUser = authService.getUser();
  const [isAuthenticated, setIsAuthenticated] = useState(!!currentUser);
  const [user, setUser] = useState(!!currentUser ? currentUser : null);

  return (
    <AdminContext.Provider
      value={{
        user,
        setUser,
        isAuthenticated,
        setIsAuthenticated,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export default AdminContextProvider;
