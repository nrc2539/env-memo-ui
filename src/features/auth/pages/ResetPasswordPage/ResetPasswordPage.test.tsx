import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router";
import { http, HttpResponse } from "msw";
import { describe, it, expect } from "vitest";
import type { ReactNode } from "react";

import { ApiClientProvider } from "@/contexts/ApiClientProvider";
import { AuthContext, type AuthContextType } from "@/contexts/AuthContext";
import { apiClient } from "@/libs/api/client";
import { server } from "@/test/mocks/server";
import { mockUser } from "@/test/mocks/data";
import { ResetPasswordPage } from "./index";

const defaultAuth: AuthContextType = {
  isAuthenticated: false,
  user: null,
  setToken: () => {},
  clearUserData: () => {},
};

function createWrapper(
  initialEntries?: string[],
  authCtx?: Partial<AuthContextType>,
) {
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
          <MemoryRouter initialEntries={initialEntries}>
            <AuthContext.Provider value={mergedAuth}>
              {children}
            </AuthContext.Provider>
          </MemoryRouter>
        </ApiClientProvider>
      </QueryClientProvider>
    );
  };
}

describe("ResetPasswordPage", () => {
  it("shows loading view while validating token", async () => {
    server.use(
      http.post("*/api/auth/verify-token", async () => {
        await new Promise((r) => setTimeout(r, 50));
        return HttpResponse.json(mockUser);
      }),
    );

    render(
      <ResetPasswordPage />,
      { wrapper: createWrapper(["/reset-password?token=valid"]) },
    );

    expect(screen.getByText("Validating your link...")).toBeInTheDocument();

    await waitFor(() => {
      expect(
        screen.getByPlaceholderText("Enter new password"),
      ).toBeInTheDocument();
    });
  });

  it("renders form after token verified", async () => {
    render(
      <ResetPasswordPage />,
      { wrapper: createWrapper(["/reset-password?token=valid"]) },
    );

    await waitFor(() => {
      expect(
        screen.getByPlaceholderText("Enter new password"),
      ).toBeInTheDocument();
    });
    expect(
      screen.getByPlaceholderText("Confirm new password"),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /reset password/i }),
    ).toBeInTheDocument();
  });

  it("shows invalid link when no token in URL", async () => {
    render(<ResetPasswordPage />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(
        screen.getByText("Invalid or expired link"),
      ).toBeInTheDocument();
    });
    expect(
      screen.getByRole("link", { name: /request new reset link/i }),
    ).toBeInTheDocument();
  });

  it("shows invalid link when verify-token fails", async () => {
    server.use(
      http.post("*/api/auth/verify-token", () =>
        HttpResponse.json({ message: "Invalid token" }, { status: 400 }),
      ),
    );

    render(
      <ResetPasswordPage />,
      { wrapper: createWrapper(["/reset-password?token=bad"]) },
    );

    await waitFor(() => {
      expect(
        screen.getByText("Invalid or expired link"),
      ).toBeInTheDocument();
    });
  });

  it("shows validation errors for empty submit", async () => {
    const user = userEvent.setup();
    render(
      <ResetPasswordPage />,
      { wrapper: createWrapper(["/reset-password?token=valid"]) },
    );

    await waitFor(() => {
      expect(
        screen.getByPlaceholderText("Enter new password"),
      ).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: /reset password/i }));

    await waitFor(() => {
      expect(screen.getByText("Password is required")).toBeInTheDocument();
    });
    expect(
      screen.getByText("Confirm password is required"),
    ).toBeInTheDocument();
  });

  it("shows validation error for mismatched passwords", async () => {
    const user = userEvent.setup();
    render(
      <ResetPasswordPage />,
      { wrapper: createWrapper(["/reset-password?token=valid"]) },
    );

    await waitFor(() => {
      expect(
        screen.getByPlaceholderText("Enter new password"),
      ).toBeInTheDocument();
    });

    await user.type(
      screen.getByPlaceholderText("Enter new password"),
      "ValidPass123!",
    );
    await user.type(
      screen.getByPlaceholderText("Confirm new password"),
      "Different12!",
    );
    await user.click(screen.getByRole("button", { name: /reset password/i }));

    await waitFor(() => {
      expect(
        screen.getByText("Passwords must match"),
      ).toBeInTheDocument();
    });
  });

  it("calls reset password API and shows success view", async () => {
    const user = userEvent.setup();
    render(
      <ResetPasswordPage />,
      { wrapper: createWrapper(["/reset-password?token=valid"]) },
    );

    await waitFor(() => {
      expect(
        screen.getByPlaceholderText("Enter new password"),
      ).toBeInTheDocument();
    });

    await user.type(
      screen.getByPlaceholderText("Enter new password"),
      "NewPass1234!",
    );
    await user.type(
      screen.getByPlaceholderText("Confirm new password"),
      "NewPass1234!",
    );
    await user.click(screen.getByRole("button", { name: /reset password/i }));

    await waitFor(() => {
      expect(
        screen.getByText("Password reset successful"),
      ).toBeInTheDocument();
    });
    expect(
      screen.getByRole("link", { name: /back to sign in/i }),
    ).toBeInTheDocument();
  });
});
