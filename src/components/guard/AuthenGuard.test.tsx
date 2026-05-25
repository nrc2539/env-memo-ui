import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, it, expect } from "vitest";

import { AuthContext, type AuthContextType } from "@/contexts/AuthContext";
import AuthenGuard from "./AuthenGuard";

const defaultAuth: AuthContextType = {
  isAuthenticated: false,
  user: null,
  setToken: () => {},
  clearUserData: () => {},
};

const authenticatedAuth: AuthContextType = {
  isAuthenticated: true,
  user: { id: 1, email: "test@test.com", name: "Test User" },
  setToken: () => {},
  clearUserData: () => {},
};

describe("AuthenGuard", () => {
  it("when not authenticated, shows loading and does not render children", () => {
    render(
      <MemoryRouter>
        <AuthContext.Provider value={defaultAuth}>
          <AuthenGuard>
            <div>Protected Content</div>
          </AuthenGuard>
        </AuthContext.Provider>
      </MemoryRouter>,
    );
    expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("when authenticated, renders children", () => {
    render(
      <MemoryRouter>
        <AuthContext.Provider value={authenticatedAuth}>
          <AuthenGuard>
            <div>Protected Content</div>
          </AuthenGuard>
        </AuthContext.Provider>
      </MemoryRouter>,
    );
    expect(screen.getByText("Protected Content")).toBeInTheDocument();
  });
});
