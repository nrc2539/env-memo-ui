import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter, Routes, Route } from "react-router";
import { describe, it, expect } from "vitest";
import type { ReactNode } from "react";

import { ApiClientProvider } from "@/contexts/ApiClientProvider";
import { AuthContext, type AuthContextType } from "@/contexts/AuthContext";
import { apiClient } from "@/libs/api/client";
import { ProjectMemberPage } from "./index";

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
            <MemoryRouter initialEntries={["/projects/1/members"]}>
              <Routes>
                <Route
                  path="/projects/:projectId/members"
                  element={children}
                />
              </Routes>
            </MemoryRouter>
          </AuthContext.Provider>
        </ApiClientProvider>
      </QueryClientProvider>
    );
  };
}

describe("ProjectMemberPage", () => {
  it("renders member table", async () => {
    render(<ProjectMemberPage />, { wrapper: createWrapper() });
    await waitFor(() => {
      expect(screen.getByText("Project Member")).toBeInTheDocument();
    });
  });

  it("shows invite modal", async () => {
    const user = userEvent.setup();
    render(<ProjectMemberPage />, { wrapper: createWrapper() });
    await waitFor(() => {
      expect(screen.getByText("Project Member")).toBeInTheDocument();
    });
    await user.click(
      screen.getByRole("button", { name: /invite user/i }),
    );
    await waitFor(() => {
      expect(
        screen.getByPlaceholderText("Enter user email"),
      ).toBeInTheDocument();
    });
  });
});
