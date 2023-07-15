import { createContext } from "react";

export const AuthContext = createContext({
  isLoggedIn: false,
  userId: null,
  username: null,
  isPrivate: false,
  token: null,
  login: () => {},
  logout: () => {},
});
