import { type ReactNode } from "react";
import type { AxiosInstance } from "axios";

import { ApiClientContext } from "./ApiClientContext";

interface ApiClientProviderProps {
  children: ReactNode;
  client: AxiosInstance;
}

export function ApiClientProvider({
  children,
  client,
}: ApiClientProviderProps) {
  return (
    <ApiClientContext.Provider value={{ client }}>
      {children}
    </ApiClientContext.Provider>
  );
}
