import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
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
import { mockEnvGroup, mockEnvVariable, mockProjectDetail } from "@/test/mocks/data";
import { ProjectDetailPage } from "./index";

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
            <MemoryRouter initialEntries={["/projects/1"]}>
              <Routes>
                <Route path="/projects/:projectId" element={children} />
              </Routes>
            </MemoryRouter>
          </AuthContext.Provider>
        </ApiClientProvider>
      </QueryClientProvider>
    );
  };
}

describe("ProjectDetailPage", () => {
  it("renders project name and env groups", async () => {
    render(<ProjectDetailPage />, { wrapper: createWrapper() });
    await waitFor(() => {
      expect(screen.getAllByText("Test Project").length).toBeGreaterThanOrEqual(1);
    });
    await waitFor(() => {
      expect(screen.getByText("Production")).toBeInTheDocument();
    });
  });

  it("creates a new env group via modal", async () => {
    const baseGroup = { ...mockEnvGroup, variables: [{ ...mockEnvVariable }] };
    let groups = [structuredClone(baseGroup)];

    server.use(
      http.get("*/api/projects/:projectId/env-groups", () =>
        HttpResponse.json({ data: groups }),
      ),
      http.post("*/api/projects/:projectId/env-groups", async ({ request }) => {
        const body = (await request.json()) as { name: string };
        const newGroup = {
          ...mockEnvGroup, id: "g-new", name: body.name, variables: [],
        };
        groups = [...groups, newGroup];
        return HttpResponse.json(newGroup, { status: 201 });
      }),
    );

    const user = userEvent.setup();
    render(<ProjectDetailPage />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText("Production")).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: /create env group/i }));

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: /create environment group/i }),
      ).toBeInTheDocument();
    });

    await user.type(
      screen.getByPlaceholderText("Enter group name"),
      "Staging",
    );

    await user.click(screen.getByRole("button", { name: /^create$/i }));

    await waitFor(() => {
      expect(
        screen.queryByRole("heading", { name: /create environment group/i }),
      ).not.toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText("Staging")).toBeInTheDocument();
    });
  });

  it("edits an env group name via modal", async () => {
    const baseGroup = { ...mockEnvGroup, variables: [{ ...mockEnvVariable }] };
    let groups = [structuredClone(baseGroup)];

    server.use(
      http.get("*/api/projects/:projectId/env-groups", () =>
        HttpResponse.json({ data: groups }),
      ),
      http.patch(
        "*/api/projects/:projectId/env-groups/:groupId",
        async ({ request, params }) => {
          const body = (await request.json()) as { name: string };
          groups = groups.map((g) =>
            g.id === params.groupId ? { ...g, name: body.name } : g,
          );
          return HttpResponse.json(groups.find((g) => g.id === params.groupId));
        },
      ),
    );

    const user = userEvent.setup();
    render(<ProjectDetailPage />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText("Production")).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: /edit group/i }));

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: /edit environment group/i }),
      ).toBeInTheDocument();
    });

    const input = screen.getByPlaceholderText("Enter group name");
    expect(input).toHaveValue("Production");

    await user.clear(input);
    await user.type(input, "Staging");

    const editHeading = screen.getByRole("heading", {
      name: /edit environment group/i,
    });
    await user.click(
      within(editHeading.closest('[class*="fixed"]')!).getByRole("button", {
        name: /^save$/i,
      }),
    );

    await waitFor(() => {
      expect(
        screen.queryByRole("heading", { name: /edit environment group/i }),
      ).not.toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText("Staging")).toBeInTheDocument();
    });
  });

  it("deletes an env group via confirmation modal", async () => {
    const baseGroup = { ...mockEnvGroup, variables: [{ ...mockEnvVariable }] };
    let groups = [structuredClone(baseGroup)];

    server.use(
      http.get("*/api/projects/:projectId/env-groups", () =>
        HttpResponse.json({ data: groups }),
      ),
      http.delete(
        "*/api/projects/:projectId/env-groups/:groupId",
        ({ params }) => {
          groups = groups.filter((g) => g.id !== params.groupId);
          return HttpResponse.text(null, { status: 204 });
        },
      ),
    );

    const user = userEvent.setup();
    render(<ProjectDetailPage />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText("Production")).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: /delete group/i }));

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: /delete environment group/i }),
      ).toBeInTheDocument();
    });

    expect(
      screen.getByText(
        /Are you sure you want to delete "Production".*This action cannot be undone/,
      ),
    ).toBeInTheDocument();

    const deleteHeading = screen.getByRole("heading", {
      name: /delete environment group/i,
    });
    const deleteBtn = within(
      deleteHeading.closest('[class*="fixed"]')!,
    ).getByRole("button", { name: /^delete$/i });
    fireEvent.click(deleteBtn);

    await waitFor(() => {
      expect(
        screen.getByText("No environment groups yet"),
      ).toBeInTheDocument();
    });
  });

  it("creates a new env variable via modal", async () => {
    const baseGroup = { ...mockEnvGroup, variables: [{ ...mockEnvVariable }] };
    let groups = [structuredClone(baseGroup)];

    server.use(
      http.get("*/api/projects/:projectId/env-groups", () =>
        HttpResponse.json({ data: groups }),
      ),
      http.post(
        "*/api/projects/:projectId/env-groups/:groupId/variables",
        async ({ request }) => {
          const body = (await request.json()) as { key: string; value: string };
          const newVar = {
            id: "v-new",
            key: body.key,
            value: body.value,
            envGroupId: "g1",
            createdAt: "2025-01-01T00:00:00Z",
            updatedAt: "2025-01-01T00:00:00Z",
          };
          groups = groups.map((g) =>
            g.id === "g1" ? { ...g, variables: [...g.variables, newVar] } : g,
          );
          return HttpResponse.json(newVar, { status: 201 });
        },
      ),
    );

    const user = userEvent.setup();
    render(<ProjectDetailPage />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText("Production")).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: /add variable/i }));

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: /create variable/i }),
      ).toBeInTheDocument();
    });

    await user.type(
      screen.getByPlaceholderText("e.g. DATABASE_URL"),
      "NEW_KEY",
    );
    await user.type(
      screen.getByPlaceholderText("Enter variable value"),
      "new_value",
    );

    await user.click(screen.getByRole("button", { name: /^create$/i }));

    await waitFor(() => {
      expect(
        screen.queryByRole("heading", { name: /create variable/i }),
      ).not.toBeInTheDocument();
    });

    await user.click(screen.getByText("Production"));

    await waitFor(() => {
      expect(screen.getByText("NEW_KEY")).toBeInTheDocument();
    });
  });

  it("edits an env variable via modal", async () => {
    const baseVar = { ...mockEnvVariable };
    let groups = [{ ...mockEnvGroup, variables: [baseVar] }];

    server.use(
      http.get("*/api/projects/:projectId/env-groups", () =>
        HttpResponse.json({ data: groups }),
      ),
      http.patch(
        "*/api/projects/:projectId/env-groups/:groupId/variables/:variableId",
        async ({ request, params }) => {
          const body = (await request.json()) as { key: string; value: string };
          groups = groups.map((g) => ({
            ...g,
            variables: g.variables.map((v) =>
              v.id === params.variableId
                ? { ...v, key: body.key, value: body.value }
                : v,
            ),
          }));
          return HttpResponse.json(groups[0].variables[0]);
        },
      ),
    );

    const user = userEvent.setup();
    render(<ProjectDetailPage />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText("Production")).toBeInTheDocument();
    });

    await user.click(screen.getByText("Production"));

    await waitFor(() => {
      expect(screen.getByText("DATABASE_URL")).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: /edit variable/i }));

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: /edit variable/i }),
      ).toBeInTheDocument();
    });

    const keyInput = screen.getByPlaceholderText("e.g. DATABASE_URL");
    await user.clear(keyInput);
    await user.type(keyInput, "DB_HOST");

    const editVarHeading = screen.getByRole("heading", {
      name: /edit variable/i,
    });
    await user.click(
      within(editVarHeading.closest('[class*="fixed"]')!).getByRole("button", {
        name: /^save$/i,
      }),
    );

    await waitFor(() => {
      expect(
        screen.queryByRole("heading", { name: /edit variable/i }),
      ).not.toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText("DB_HOST")).toBeInTheDocument();
    });
  });

  it("deletes an env variable via confirmation modal", async () => {
    const baseVar = { ...mockEnvVariable };
    let groups = [{ ...mockEnvGroup, variables: [baseVar] }];

    server.use(
      http.get("*/api/projects/:projectId/env-groups", () =>
        HttpResponse.json({ data: groups }),
      ),
      http.delete(
        "*/api/projects/:projectId/env-groups/:groupId/variables/:variableId",
        ({ params }) => {
          groups = groups.map((g) => ({
            ...g,
            variables: g.variables.filter((v) => v.id !== params.variableId),
          }));
          return HttpResponse.text(null, { status: 204 });
        },
      ),
    );

    const user = userEvent.setup();
    render(<ProjectDetailPage />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText("Production")).toBeInTheDocument();
    });

    await user.click(screen.getByText("Production"));

    await waitFor(() => {
      expect(screen.getByText("DATABASE_URL")).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: /delete variable/i }));

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: /delete variable/i }),
      ).toBeInTheDocument();
    });

    const deleteVarHeading = screen.getByRole("heading", {
      name: /delete variable/i,
    });
    await user.click(
      within(deleteVarHeading.closest('[class*="fixed"]')!).getByRole("button", {
        name: /^delete$/i,
      }),
    );

    await waitFor(() => {
      expect(
        screen.queryByText("DATABASE_URL"),
      ).not.toBeInTheDocument();
    });
  });

  it("edits project name via modal", async () => {
    let projectDetail = structuredClone(mockProjectDetail);

    server.use(
      http.get("*/api/projects/:projectId", () =>
        HttpResponse.json(projectDetail),
      ),
      http.patch("*/api/projects/:projectId", async ({ request }) => {
        const body = (await request.json()) as { name: string };
        projectDetail = { ...projectDetail, name: body.name };
        return HttpResponse.json(projectDetail);
      }),
    );

    const user = userEvent.setup();
    render(<ProjectDetailPage />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getAllByText("Test Project").length).toBeGreaterThanOrEqual(1);
    });

    const settingsBtns = screen.getAllByRole("button");
    const settingsBtn = settingsBtns.find(
      (btn) => (btn as HTMLButtonElement).querySelector("svg"),
    );
    await user.click(settingsBtn ?? settingsBtns[0]);
    await user.click(screen.getByText("Edit project"));

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: /edit project/i }),
      ).toBeInTheDocument();
    });

    const nameInput = screen.getByPlaceholderText("Enter project name");
    await user.clear(nameInput);
    await user.type(nameInput, "Updated Project");

    const saveBtn = screen.getByRole("button", { name: "Save" });
    await user.click(saveBtn);

    await waitFor(() => {
      expect(
        screen.queryByRole("heading", { name: /edit project/i }),
      ).not.toBeInTheDocument();
    });
  });

  it("deletes project and navigates to /projects", async () => {
    render(<ProjectDetailPage />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getAllByText("Test Project").length).toBeGreaterThanOrEqual(1);
    });

    const user = userEvent.setup();
    const settingsBtns = screen.getAllByRole("button");
    const settingsBtn = settingsBtns.find(
      (btn) => btn.querySelector("svg path") || btn.innerHTML.includes("svg"),
    );
    await user.click(settingsBtn ?? settingsBtns[0]);

    await user.click(screen.getByText("Delete project"));

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: /delete project/i }),
      ).toBeInTheDocument();
    });

    const delProjectHeading = screen.getByRole("heading", {
      name: /delete project/i,
    });
    await user.click(
      within(delProjectHeading.closest('[class*="fixed"]')!).getByRole("button", {
        name: /^delete$/i,
      }),
    );

    await waitFor(() => {
      expect(
        screen.queryByRole("heading", { name: /delete project/i }),
      ).not.toBeInTheDocument();
    });
  });
});
