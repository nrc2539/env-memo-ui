import { createContext } from "react";

import type { UserProfileType } from "@/models/UserProfileType";

export interface AuthContextType {
  isAuthenticated: boolean;
  user: UserProfileType | null;
  setToken: (accessToken: string, refreshToken: string) => void;
  clearUserData: () => void;
}

export const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType,
);
