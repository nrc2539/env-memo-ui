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
import { SetupPasswordPage } from "./index";

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

describe("SetupPasswordPage", () => {
  it("shows loading view while validating token", async () => {
    server.use(
      http.post("*/api/auth/verify-token", async () => {
        await new Promise((r) => setTimeout(r, 50));
        return HttpResponse.json(mockUser);
      }),
    );

    render(
      <SetupPasswordPage />,
      { wrapper: createWrapper(["/setup-password?token=valid"]) },
    );

    expect(screen.getByText("Validating your link...")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByDisplayValue("Test User")).toBeInTheDocument();
    });
  });

  it("renders form with prefilled name and email after token verified", async () => {
    render(
      <SetupPasswordPage />,
      { wrapper: createWrapper(["/setup-password?token=valid"]) },
    );

    await waitFor(() => {
      expect(screen.getByDisplayValue("Test User")).toBeInTheDocument();
    });
    expect(screen.getByDisplayValue("test@example.com")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Create a password")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Confirm your password"),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /set up password/i }),
    ).toBeInTheDocument();
  });

  it("shows invalid link when no token in URL", async () => {
    render(<SetupPasswordPage />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText("Invalid link")).toBeInTheDocument();
    });
    expect(
      screen.getByRole("link", { name: /back to sign in/i }),
    ).toBeInTheDocument();
  });

  it("shows invalid link when verify-token fails", async () => {
    server.use(
      http.post("*/api/auth/verify-token", () =>
        HttpResponse.json({ message: "Invalid token" }, { status: 400 }),
      ),
    );

    render(
      <SetupPasswordPage />,
      { wrapper: createWrapper(["/setup-password?token=bad"]) },
    );

    await waitFor(() => {
      expect(screen.getByText("Invalid link")).toBeInTheDocument();
    });
  });

  it("shows validation errors for empty submit", async () => {
    const user = userEvent.setup();
    render(
      <SetupPasswordPage />,
      { wrapper: createWrapper(["/setup-password?token=valid"]) },
    );

    await waitFor(() => {
      expect(screen.getByDisplayValue("Test User")).toBeInTheDocument();
    });

    await user.clear(screen.getByDisplayValue("Test User"));
    await user.click(screen.getByRole("button", { name: /set up password/i }));

    await waitFor(() => {
      expect(screen.getByText("Name is required")).toBeInTheDocument();
    });
    expect(screen.getByText("Password is required")).toBeInTheDocument();
    expect(
      screen.getByText("Confirm password is required"),
    ).toBeInTheDocument();
  });

  it("shows validation error for mismatched passwords", async () => {
    const user = userEvent.setup();
    render(
      <SetupPasswordPage />,
      { wrapper: createWrapper(["/setup-password?token=valid"]) },
    );

    await waitFor(() => {
      expect(screen.getByDisplayValue("Test User")).toBeInTheDocument();
    });

    await user.type(
      screen.getByPlaceholderText("Create a password"),
      "ValidPass123!",
    );
    await user.type(
      screen.getByPlaceholderText("Confirm your password"),
      "Different12!",
    );
    await user.click(screen.getByRole("button", { name: /set up password/i }));

    await waitFor(() => {
      expect(
        screen.getByText("Passwords must match"),
      ).toBeInTheDocument();
    });
  });

  it("calls setup password API and shows success view", async () => {
    const user = userEvent.setup();
    render(
      <SetupPasswordPage />,
      { wrapper: createWrapper(["/setup-password?token=valid"]) },
    );

    await waitFor(() => {
      expect(screen.getByDisplayValue("Test User")).toBeInTheDocument();
    });

    await user.type(
      screen.getByPlaceholderText("Create a password"),
      "StrongPass12!",
    );
    await user.type(
      screen.getByPlaceholderText("Confirm your password"),
      "StrongPass12!",
    );
    await user.click(screen.getByRole("button", { name: /set up password/i }));

    await waitFor(() => {
      expect(
        screen.getByText("Password set up successfully"),
      ).toBeInTheDocument();
    });
    expect(
      screen.getByRole("link", { name: /back to sign in/i }),
    ).toBeInTheDocument();
  });
});
