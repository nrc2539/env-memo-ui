import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useContext } from "react";
import { describe, it, expect, beforeEach } from "vitest";

import { ApiClientProvider } from "./ApiClientProvider";
import { apiClient, clearTokens } from "@/libs/api/client";
import { AuthProvider } from "./AuthProvider";
import { AuthContext } from "./AuthContext";

function TestConsumer() {
  const auth = useContext(AuthContext);
  return (
    <div>
      <div data-testid="isAuthenticated">
        {String(auth.isAuthenticated)}
      </div>
      <div data-testid="user">{auth.user ? auth.user.name : "null"}</div>
    </div>
  );
}

function TestActions() {
  const auth = useContext(AuthContext);
  return (
    <div>
      <div data-testid="isAuthenticated">
        {String(auth.isAuthenticated)}
      </div>
      <button
        data-testid="setToken"
        onClick={() => auth.setToken("new-at", "new-rt")}
      >
        Set Token
      </button>
      <button
        data-testid="clearUserData"
        onClick={() => auth.clearUserData()}
      >
        Clear
      </button>
    </div>
  );
}

function renderWithProviders(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
      mutations: { retry: false },
    },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <ApiClientProvider client={apiClient}>
        {ui}
      </ApiClientProvider>
    </QueryClientProvider>,
  );
}

describe("AuthProvider", () => {
  beforeEach(() => {
    clearTokens();
  });

  it("renders children when not authenticated", () => {
    renderWithProviders(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>,
    );
    expect(screen.getByTestId("isAuthenticated")).toHaveTextContent("false");
    expect(screen.getByTestId("user")).toHaveTextContent("null");
  });

  it("fetches profile when authenticated", async () => {
    localStorage.setItem("act", "mock-access-token");
    renderWithProviders(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>,
    );
    await waitFor(() => {
      expect(screen.getByTestId("isAuthenticated")).toHaveTextContent("true");
    });
    await waitFor(() => {
      expect(screen.getByTestId("user")).toHaveTextContent("Test User");
    });
    clearTokens();
  });

  it("setToken stores tokens and sets isAuthenticated", async () => {
    renderWithProviders(
      <AuthProvider>
        <TestActions />
      </AuthProvider>,
    );
    expect(screen.getByTestId("isAuthenticated")).toHaveTextContent("false");
    await userEvent.click(screen.getByTestId("setToken"));
    expect(localStorage.getItem("act")).toBe("new-at");
    expect(localStorage.getItem("rft")).toBe("new-rt");
    expect(screen.getByTestId("isAuthenticated")).toHaveTextContent("true");
    clearTokens();
  });

  it("clearUserData clears tokens and isAuthenticated", async () => {
    localStorage.setItem("act", "test-token");
    localStorage.setItem("rft", "test-rt");
    renderWithProviders(
      <AuthProvider>
        <TestActions />
      </AuthProvider>,
    );
    await userEvent.click(screen.getByTestId("clearUserData"));
    expect(localStorage.getItem("act")).toBeNull();
    expect(localStorage.getItem("rft")).toBeNull();
    expect(screen.getByTestId("isAuthenticated")).toHaveTextContent("false");
  });
});
