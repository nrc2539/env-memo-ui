import { createContext } from "react";

export interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  setToken: (accessToken: string, refreshToken: string) => void;
  clearToken: () => void;
  getToken: () => string | null;
}

export const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType,
);
