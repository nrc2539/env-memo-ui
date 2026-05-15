import { createContext } from "react";

export interface UserProfile {
  id: number;
  email: string;
  name: string;
}

export interface AuthContextType {
  isAuthenticated: boolean;
  user: UserProfile | null;
  setToken: (accessToken: string, refreshToken: string) => void;
  clearUserData: () => void;
}

export const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType,
);
