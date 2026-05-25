import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter, Routes, Route } from "react-router";
import { http, HttpResponse } from "msw";
import { describe, it, expect } from "vitest";
import type { ReactNode } from "react";

import { ApiClientProvider } from "@/contexts/ApiClientProvider";
import { AuthContext, type AuthContextType } from "@/contexts/AuthContext";
import { apiClient } from "@/libs/api/client";
import { server } from "@/test/mocks/server";
import { mockProjectMember, mockInvitation, paginatedResponse } from "@/test/mocks/data";
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

  it("invites a user via modal and closes it", async () => {
    const user = userEvent.setup();
    render(<ProjectMemberPage />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText("Project Member")).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: /invite user/i }));

    await waitFor(() => {
      expect(
        screen.getByPlaceholderText("Enter user email"),
      ).toBeInTheDocument();
    });

    await user.type(
      screen.getByPlaceholderText("Enter user email"),
      "newuser@example.com",
    );

    await user.click(screen.getByRole("button", { name: /select a role/i }));
    await user.click(screen.getByText("Editor"));

    await user.click(screen.getByRole("button", { name: /^invite$/i }));

    await waitFor(() => {
      expect(
        screen.queryByRole("heading", { name: /invite user/i }),
      ).not.toBeInTheDocument();
    });
  });

  it("removes a member via confirmation modal", async () => {
    let members = [structuredClone(mockProjectMember)];

    server.use(
      http.get("*/api/projects/:projectId/members", () =>
        HttpResponse.json(paginatedResponse(members)),
      ),
      http.delete("*/api/projects/:projectId/members/:userId", () => {
        members = [];
        return HttpResponse.text(null, { status: 204 });
      }),
    );

    const user = userEvent.setup();
    render(<ProjectMemberPage />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText("Project Member")).toBeInTheDocument();
    });

    const removeBtn = screen.getByRole("button", { name: /remove project member/i });
    await user.click(removeBtn);

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: /remove member/i }),
      ).toBeInTheDocument();
    });

    const confirmHeading = screen.getByRole("heading", { name: /remove member/i });
    const confirmBtn = within(
      confirmHeading.closest('[class*="fixed"]')!,
    ).getByRole("button", { name: /^remove$/i });
    await user.click(confirmBtn);

    await waitFor(() => {
      expect(
        screen.queryByText("Project Member"),
      ).not.toBeInTheDocument();
    });
  });

  it("removes an invitation via confirmation modal", async () => {
    let invitations = [structuredClone(mockInvitation)];

    server.use(
      http.get("*/api/projects/:projectId/invitations", () =>
        HttpResponse.json(paginatedResponse(invitations)),
      ),
      http.delete("*/api/projects/:projectId/invitations/:invitationId", () => {
        invitations = [];
        return HttpResponse.text(null, { status: 204 });
      }),
    );

    const user = userEvent.setup();
    render(<ProjectMemberPage />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText("invited@example.com")).toBeInTheDocument();
    });

    const removeBtns = screen.getAllByRole("button", { name: /remove invitation/i });
    await user.click(removeBtns[0]);

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: /remove invitation/i }),
      ).toBeInTheDocument();
    });

    const removeHeading = screen.getByRole("heading", { name: /remove invitation/i });
    const removeBtn = within(
      removeHeading.closest('[class*="fixed"]')!,
    ).getByRole("button", { name: /^remove$/i });
    await user.click(removeBtn);

    await waitFor(() => {
      expect(
        screen.queryByText("invited@example.com"),
      ).not.toBeInTheDocument();
    });
  });

  it("resends an invitation", async () => {
    let resendCalled = false;

    server.use(
      http.post(
        "*/api/projects/:projectId/invitations/:invitationId/resend",
        () => {
          resendCalled = true;
          return HttpResponse.text(null, { status: 200 });
        },
      ),
    );

    const user = userEvent.setup();
    render(<ProjectMemberPage />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText("invited@example.com")).toBeInTheDocument();
    });

    const resendBtn = screen.getByRole("button", { name: /resend invitation/i });
    await user.click(resendBtn);

    await waitFor(() => {
      expect(resendCalled).toBe(true);
    });
  });
});
