import { AUTH_TIME, AUTH_TOKEN, AUTH_USER } from "../helpers/types";

export const authService = {
  isLogginIn: function () {
    return !!localStorage.getItem(AUTH_USER);
  },

  getUser: function () {
    this.checkTimeout();
    const user = JSON.parse(localStorage.getItem(AUTH_USER));

    return user ? user : null;
  },

  setUser: function (data) {
    this.addTimeout();
    localStorage.setItem(AUTH_USER, JSON.stringify(data.user));
    this.setToken(data.token);
  },

  getToken: function () {
    this.checkTimeout();
    return localStorage.getItem(AUTH_TOKEN);
  },

  setToken: (token) => {
    localStorage.setItem(AUTH_TOKEN, token);
  },

  logout: () => {
    localStorage.clear();
  },

  checkTimeout: () => {
    const now = new Date().getTime() * 60 * 60 * 1000;
    const setupTime = parseInt(localStorage.getItem(AUTH_TIME));
    if (setupTime == null || now > setupTime) {
      localStorage.clear();
    }
  },

  addTimeout: () => {
    const now = new Date().getTime() * 24 * 60 * 60 * 1000;
    localStorage.setItem(AUTH_TIME, now.toString());
  },
};
