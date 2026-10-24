import React, { useState, createContext, useEffect, useCallback } from "react";
import * as Sentry from "@sentry/react";
import useContextFactory from "../hooks/useContextFactory";
import { authService } from "../helpers/authService";
import { getMe, logout } from "../api/user";
const AdminContext = createContext({});

export const useAdminContext = () => {
  return useContextFactory("AdminContext", AdminContext);
};

const AdminContextProvider = ({ children }) => {
  const currentUser = authService.getUser();
  const [user, setUser] = useState(currentUser);
  const isAuthenticated = !!user;

  const signIn = useCallback((loggedUser) => {
    authService.setUser(loggedUser);
    setUser(loggedUser);
  }, []);

  const signOut = useCallback(async () => {
    try {
      await logout();
    } catch (e) {
      // Session déjà expirée côté serveur
    }
    authService.logout();
    setUser(null);
  }, []);

  // Le serveur confirme que la session est toujours valide
  useEffect(() => {
    if (!currentUser) return;
    getMe()
      .then(({ data }) => signIn(data.user))
      .catch(() => setUser(null));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    Sentry.setUser(user ? { id: user.id, username: user.login } : null);
  }, [user]);

  return (
    <AdminContext.Provider
      value={{
        user,
        isAuthenticated,
        signIn,
        signOut,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export default AdminContextProvider;
