import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router";
import { describe, it, expect } from "vitest";
import type { ReactNode } from "react";

import { ApiClientProvider } from "@/contexts/ApiClientProvider";
import { AuthContext, type AuthContextType } from "@/contexts/AuthContext";
import { apiClient } from "@/libs/api/client";
import { ForgotPasswordPage } from "./index";

const defaultAuth: AuthContextType = {
  isAuthenticated: false,
  user: null,
  setToken: () => { },
  clearUserData: () => { },
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

describe("ForgotPasswordPage", () => {
  it("renders email input", () => {
    render(<ForgotPasswordPage />, { wrapper: createWrapper() });
    expect(
      screen.getByPlaceholderText("Enter your email"),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /send reset link/i }),
    ).toBeInTheDocument();
  });

  it("calls forgotPassword API, shows success message", async () => {
    const user = userEvent.setup();
    render(<ForgotPasswordPage />, { wrapper: createWrapper() });
    await user.type(
      screen.getByPlaceholderText("Enter your email"),
      "test@example.com",
    );
    await user.click(
      screen.getByRole("button", { name: /send reset link/i }),
    );
    await waitFor(() => {
      expect(
        screen.getByText(/we've sent a password reset link/i),
      ).toBeInTheDocument();
    });
    expect(screen.getByText("test@example.com")).toBeInTheDocument();
  });
});
