import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter, Routes, Route } from "react-router";
import { describe, it, expect } from "vitest";
import type { ReactNode } from "react";

import { ApiClientProvider } from "@/contexts/ApiClientProvider";
import { AuthContext, type AuthContextType } from "@/contexts/AuthContext";
import { apiClient } from "@/libs/api/client";
import UnAuthenGuard from "@/components/guard/UnAuthenGuard";
import { RegisterPage } from "./index";

const defaultAuth: AuthContextType = {
  isAuthenticated: false,
  user: null,
  setToken: () => {},
  clearUserData: () => {},
};

function createWrapper(authCtx?: Partial<AuthContextType>) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  const mergedAuth = { ...defaultAuth, ...authCtx };
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <ApiClientProvider client={apiClient}>
          <MemoryRouter>
            <AuthContext.Provider value={mergedAuth}>
              {children}
            </AuthContext.Provider>
          </MemoryRouter>
        </ApiClientProvider>
      </QueryClientProvider>
    );
  };
}

describe("RegisterPage", () => {
  it("renders registration form", () => {
    render(<RegisterPage />, { wrapper: createWrapper() });
    expect(
      screen.getByPlaceholderText("Enter your name"),
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Enter your email"),
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Create a password"),
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Confirm your password"),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /create account/i }),
    ).toBeInTheDocument();
  });

  it("shows validation errors for password mismatch", async () => {
    const user = userEvent.setup();
    render(<RegisterPage />, { wrapper: createWrapper() });
    await user.type(
      screen.getByPlaceholderText("Enter your name"),
      "Test User",
    );
    await user.type(
      screen.getByPlaceholderText("Enter your email"),
      "test@example.com",
    );
    await user.type(
      screen.getByPlaceholderText("Create a password"),
      "Str0ng!pass",
    );
    await user.type(
      screen.getByPlaceholderText("Confirm your password"),
      "Different!pass",
    );
    await user.click(
      screen.getByRole("button", { name: /create account/i }),
    );
    await waitFor(() => {
      expect(screen.getByText("Passwords must match")).toBeInTheDocument();
    });
  });

  it("calls register API on valid submit, navigates to /login", async () => {
    const user = userEvent.setup();
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

    render(
      <QueryClientProvider client={queryClient}>
        <ApiClientProvider client={apiClient}>
          <MemoryRouter initialEntries={["/register"]}>
            <Routes>
              <Route
                path="/register"
                element={
                  <UnAuthenGuard>
                    <RegisterPage />
                  </UnAuthenGuard>
                }
              />
              <Route path="/login" element={<div>Login Page</div>} />
            </Routes>
          </MemoryRouter>
        </ApiClientProvider>
      </QueryClientProvider>,
    );

    await user.type(
      screen.getByPlaceholderText("Enter your name"),
      "Test User",
    );
    await user.type(
      screen.getByPlaceholderText("Enter your email"),
      "test@example.com",
    );
    await user.type(
      screen.getByPlaceholderText("Create a password"),
      "Str0ng!pass",
    );
    await user.type(
      screen.getByPlaceholderText("Confirm your password"),
      "Str0ng!pass",
    );
    await user.click(
      screen.getByRole("button", { name: /create account/i }),
    );

    await waitFor(() => {
      expect(screen.getByText("Login Page")).toBeInTheDocument();
    });
  });
});
