import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import * as Sentry from "@sentry/react";
import { useQueryClient } from "@tanstack/react-query";
import api, { initCsrf, setUnauthenticatedHandler } from "../api/client";

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

/**
 * La session est portée par le cookie Laravel : on demande au serveur qui est connecté.
 */
export const AuthProvider = ({ children }) => {
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  const forget = useCallback(() => {
    setUser(null);
    queryClient.clear();
  }, [queryClient]);

  useEffect(() => {
    setUnauthenticatedHandler(forget);
    api
      .get("user")
      .then(({ data }) => setUser(data.user))
      .catch(() => setUser(null))
      .finally(() => setChecking(false));
  }, [forget]);

  useEffect(() => {
    Sentry.setUser(user ? { id: user.id, username: user.login } : null);
  }, [user]);

  const login = async (credentials) => {
    await initCsrf();
    const { data } = await api.post("login", credentials);
    setUser(data.user);
  };

  const logout = async () => {
    try {
      await api.post("logout");
    } finally {
      forget();
    }
  };

  return (
    <AuthContext.Provider value={{ user, checking, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
