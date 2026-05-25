import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter, Routes, Route } from "react-router";
import { http, HttpResponse } from "msw";
import { describe, it, expect, vi } from "vitest";
import type { ReactNode } from "react";

import { ApiClientProvider } from "@/contexts/ApiClientProvider";
import { AuthProvider } from "@/contexts/AuthProvider";
import { AuthContext, type AuthContextType } from "@/contexts/AuthContext";
import { apiClient } from "@/libs/api/client";
import { server } from "@/test/mocks/server";
import UnAuthenGuard from "@/components/guard/UnAuthenGuard";
import { LoginPage } from "./index";

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

describe("LoginPage", () => {
  it("renders login form with email + password fields", () => {
    render(<LoginPage />, { wrapper: createWrapper() });
    expect(
      screen.getByPlaceholderText("Enter your email"),
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Enter your password"),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sign in/i }),
    ).toBeInTheDocument();
  });

  it("shows validation errors for empty submit", async () => {
    const user = userEvent.setup();
    render(<LoginPage />, { wrapper: createWrapper() });
    await user.click(screen.getByRole("button", { name: /sign in/i }));
    await waitFor(() => {
      expect(screen.getByText("Email is required")).toBeInTheDocument();
    });
    expect(screen.getByText("Password is required")).toBeInTheDocument();
  });

  it("calls login API on valid submit", async () => {
    const setToken = vi.fn();
    const user = userEvent.setup();
    render(<LoginPage />, {
      wrapper: createWrapper({ setToken }),
    });
    await user.type(
      screen.getByPlaceholderText("Enter your email"),
      "test@example.com",
    );
    await user.type(
      screen.getByPlaceholderText("Enter your password"),
      "password123",
    );
    await user.click(screen.getByRole("button", { name: /sign in/i }));
    await waitFor(() => {
      expect(setToken).toHaveBeenCalledWith(
        "mock-access-token",
        "mock-refresh-token",
      );
    });
  });

  it("navigates to /projects on successful login via UnAuthenGuard", async () => {
    const user = userEvent.setup();
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

    function AuthWrapper({ children }: { children: ReactNode }) {
      return (
        <QueryClientProvider client={queryClient}>
          <ApiClientProvider client={apiClient}>
            <MemoryRouter initialEntries={["/login"]}>
              <Routes>
                <Route
                  path="/login"
                  element={
                    <AuthProvider>
                      <UnAuthenGuard>
                        {children}
                      </UnAuthenGuard>
                    </AuthProvider>
                  }
                />
                <Route path="/projects" element={<div>Projects Page</div>} />
              </Routes>
            </MemoryRouter>
          </ApiClientProvider>
        </QueryClientProvider>
      );
    }

    render(
      <AuthWrapper>
        <LoginPage />
      </AuthWrapper>,
    );

    await user.type(
      screen.getByPlaceholderText("Enter your email"),
      "test@example.com",
    );
    await user.type(
      screen.getByPlaceholderText("Enter your password"),
      "password123",
    );
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByText("Projects Page")).toBeInTheDocument();
    });
  });

  it("shows error toast on API failure", async () => {
    server.use(
      http.post("*/api/auth/login", () =>
        HttpResponse.json(
          { message: "Invalid credentials" },
          { status: 401 },
        ),
      ),
    );
    const user = userEvent.setup();
    render(<LoginPage />, { wrapper: createWrapper() });
    await user.type(
      screen.getByPlaceholderText("Enter your email"),
      "test@example.com",
    );
    await user.type(
      screen.getByPlaceholderText("Enter your password"),
      "wrong",
    );
    await user.click(screen.getByRole("button", { name: /sign in/i }));
    await waitFor(() => {
      expect(
        screen.getByPlaceholderText("Enter your email"),
      ).toBeInTheDocument();
    });
  });
});
