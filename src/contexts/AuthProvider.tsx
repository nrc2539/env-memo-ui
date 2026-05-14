import { useState, useMemo, useCallback, type ReactNode } from "react";

import { getAccessToken, setTokens, clearTokens } from "../libs/api/client";
import { AuthContext } from "./AuthContext";

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
      setToken,
      clearToken,
      getToken,
    }),
    [isAuthenticated, token, setToken, clearToken, getToken],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
