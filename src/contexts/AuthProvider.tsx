import { useState, useEffect, useCallback, type ReactNode } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import {
  getAccessToken,
  setTokens,
  clearTokens,
  registerLogoutHandler,
} from "../libs/api/client";
import { useAuthAction } from "@/hooks/actions/useAuthAction";
import type { UserProfileType } from "@/models/UserProfileType";
import { AuthContext } from "./AuthContext";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    () => !!getAccessToken(),
  );
  const { getProfile } = useAuthAction();
  const queryClient = useQueryClient();

  const { data: user } = useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
    enabled: isAuthenticated,
  });

  const clearUserData = useCallback(() => {
    setIsAuthenticated(false);
    queryClient.clear();
    clearTokens();
  }, [queryClient]);

  useEffect(() => {
    registerLogoutHandler(clearUserData);
    return () => registerLogoutHandler(null);
  }, [clearUserData]);

  const setToken = useCallback((accessToken: string, refreshToken: string) => {
    setTokens(accessToken, refreshToken);
    setIsAuthenticated(true);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user: (user as UserProfileType | undefined) ?? null,
        setToken,
        clearUserData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
