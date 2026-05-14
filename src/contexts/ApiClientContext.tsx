import { createContext } from "react";
import type { AxiosInstance } from "axios";

interface ApiClientContextType {
  client: AxiosInstance;
}

export const ApiClientContext = createContext<ApiClientContextType>(
  {} as ApiClientContextType,
);
