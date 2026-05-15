import { createContext } from "react";

export interface UserProfile {
  id: number;
  email: string;
  name: string;
}

export interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  user: UserProfile | null;
  setToken: (accessToken: string, refreshToken: string) => void;
  clearToken: () => void;
  getToken: () => string | null;
}

export const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType,
);
