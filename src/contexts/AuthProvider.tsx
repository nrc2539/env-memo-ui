import { useState, useMemo, useCallback, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";

import { getAccessToken, setTokens, clearTokens } from "../libs/api/client";
import { useAuthAction } from "@/hooks/actions/useAuthAction";
import { AuthContext, type UserProfile } from "./AuthContext";

interface AuthProviderProps {
  children: ReactNode;
}

const getInitialAuthState = () => {
  const storedToken = getAccessToken();
  return {
    token: storedToken,
    isAuthenticated: !!storedToken,
  };
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [token, setTokenState] = useState<string | null>(
    () => getInitialAuthState().token,
  );
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    () => getInitialAuthState().isAuthenticated,
  );

  const { getProfile } = useAuthAction();

  const { data: user } = useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
    enabled: isAuthenticated,
  });

  const setToken = useCallback((accessToken: string, refreshToken: string) => {
    setTokens(accessToken, refreshToken);
    setTokenState(accessToken);
    setIsAuthenticated(true);
  }, []);

  const clearToken = useCallback(() => {
    clearTokens();
    setTokenState(null);
    setIsAuthenticated(false);
  }, []);

  const getToken = useCallback((): string | null => {
    return getAccessToken();
  }, []);

  const value = useMemo(
    () => ({
      isAuthenticated,
      token,
      user: (user as UserProfile | undefined) ?? null,
      setToken,
      clearToken,
      getToken,
    }),
    [isAuthenticated, token, user, setToken, clearToken, getToken],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
