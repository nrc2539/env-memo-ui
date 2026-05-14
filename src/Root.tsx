import { StrictMode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { ApiClientProvider } from "./contexts/ApiClientProvider";
import App from "./App";
import { AuthProvider } from "./contexts/AuthProvider";
import { apiClient } from "./libs/api/client";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

export function Root() {
  return (
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <ApiClientProvider client={apiClient}>
          <AuthProvider>
            <App />
          </AuthProvider>
        </ApiClientProvider>
      </QueryClientProvider>
    </StrictMode>
  );
}
