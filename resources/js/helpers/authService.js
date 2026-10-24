import { AUTH_USER } from "./types";

/**
 * La session est portée par le cookie Laravel. On ne garde ici que l'utilisateur
 * connecté, pour l'affichage ; le serveur reste seul juge (401 sinon).
 */
export const authService = {
  getUser: () => {
    try {
      return JSON.parse(localStorage.getItem(AUTH_USER));
    } catch (e) {
      return null;
    }
  },

  setUser: (user) => {
    localStorage.setItem(AUTH_USER, JSON.stringify(user));
  },

  logout: () => {
    localStorage.removeItem(AUTH_USER);
  },
};
