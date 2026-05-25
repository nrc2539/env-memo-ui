import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router";
import { describe, it, expect } from "vitest";

import { AuthContext, type AuthContextType } from "@/contexts/AuthContext";
import UnAuthenGuard from "./UnAuthenGuard";

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

describe("UnAuthenGuard", () => {
  it("when authenticated, redirects to /projects", () => {
    render(
      <MemoryRouter initialEntries={["/login"]}>
        <Routes>
          <Route
            path="/login"
            element={
              <AuthContext.Provider value={authenticatedAuth}>
                <UnAuthenGuard>
                  <div>Login Page</div>
                </UnAuthenGuard>
              </AuthContext.Provider>
            }
          />
          <Route path="/projects" element={<div>Projects Page</div>} />
        </Routes>
      </MemoryRouter>,
    );
    expect(screen.queryByText("Login Page")).not.toBeInTheDocument();
    expect(screen.getByText("Projects Page")).toBeInTheDocument();
  });

  it("when not authenticated, renders children", () => {
    render(
      <MemoryRouter initialEntries={["/login"]}>
        <AuthContext.Provider value={defaultAuth}>
          <UnAuthenGuard>
            <div>Login Page</div>
          </UnAuthenGuard>
        </AuthContext.Provider>
      </MemoryRouter>,
    );
    expect(screen.getByText("Login Page")).toBeInTheDocument();
  });
});
