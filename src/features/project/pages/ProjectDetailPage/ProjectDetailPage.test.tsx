import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter, Routes, Route } from "react-router";
import { describe, it, expect } from "vitest";
import type { ReactNode } from "react";

import { ApiClientProvider } from "@/contexts/ApiClientProvider";
import { AuthContext, type AuthContextType } from "@/contexts/AuthContext";
import { apiClient } from "@/libs/api/client";
import { ProjectDetailPage } from "./index";

const authenticatedAuth: AuthContextType = {
  isAuthenticated: true,
  user: { id: 1, email: "test@example.com", name: "Test User" },
  setToken: () => {},
  clearUserData: () => {},
};

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <ApiClientProvider client={apiClient}>
          <AuthContext.Provider value={authenticatedAuth}>
            <MemoryRouter initialEntries={["/projects/1"]}>
              <Routes>
                <Route path="/projects/:projectId" element={children} />
              </Routes>
            </MemoryRouter>
          </AuthContext.Provider>
        </ApiClientProvider>
      </QueryClientProvider>
    );
  };
}

describe("ProjectDetailPage", () => {
  it("renders project name and env groups", async () => {
    render(<ProjectDetailPage />, { wrapper: createWrapper() });
    await waitFor(() => {
      expect(screen.getAllByText("Test Project").length).toBeGreaterThanOrEqual(1);
    });
    await waitFor(() => {
      expect(screen.getByText("Production")).toBeInTheDocument();
    });
  });
});
