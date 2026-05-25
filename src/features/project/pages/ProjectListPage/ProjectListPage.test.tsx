import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router";
import { http, HttpResponse } from "msw";
import { describe, it, expect } from "vitest";
import type { ReactNode } from "react";

import { ApiClientProvider } from "@/contexts/ApiClientProvider";
import { apiClient } from "@/libs/api/client";
import { server } from "@/test/mocks/server";
import { mockProject } from "@/test/mocks/data";
import { ProjectListPage } from "./index";

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
          <MemoryRouter>{children}</MemoryRouter>
        </ApiClientProvider>
      </QueryClientProvider>
    );
  };
}

describe("ProjectListPage", () => {
  it("renders project list", async () => {
    render(<ProjectListPage />, { wrapper: createWrapper() });
    await waitFor(() => {
      expect(screen.getByText("Test Project")).toBeInTheDocument();
    });
  });

  it("shows create project modal, submits, new project appears", async () => {
    const user = userEvent.setup();
    render(<ProjectListPage />, { wrapper: createWrapper() });
    await waitFor(() => {
      expect(screen.getByText("Test Project")).toBeInTheDocument();
    });
    await user.click(screen.getByRole("button", { name: /new project/i }));
    expect(
      screen.getByRole("heading", { name: /create new project/i }),
    ).toBeInTheDocument();
    await user.type(
      screen.getByPlaceholderText("Enter project name"),
      "New Name",
    );
    await user.click(
      screen.getByRole("button", { name: /^create$/i }),
    );
    await waitFor(() => {
      expect(
        screen.queryByRole("heading", { name: /create new project/i }),
      ).not.toBeInTheDocument();
    });
  });

  it("edits a project via modal", async () => {
    let projects = [structuredClone(mockProject)];

    server.use(
      http.get("*/api/projects", () =>
        HttpResponse.json({
          data: projects,
          meta: { total: 1, page: 1, limitPerPage: 9, totalPages: 1 },
        }),
      ),
      http.patch("*/api/projects/:projectId", async ({ request }) => {
        const body = (await request.json()) as { name: string };
        projects = projects.map((p) =>
          p.id === 1 ? { ...p, name: body.name } : p,
        );
        return HttpResponse.json(projects[0]);
      }),
    );

    const user = userEvent.setup();
    render(<ProjectListPage />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText("Test Project")).toBeInTheDocument();
    });

    const settingsBtn = screen.getAllByRole("button")[1];
    await user.click(settingsBtn);

    await user.click(screen.getByText("Edit project"));

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: /edit project/i }),
      ).toBeInTheDocument();
    });

    const nameInput = screen.getByPlaceholderText("Enter project name");
    await user.clear(nameInput);
    await user.type(nameInput, "Updated Project");

    await user.click(screen.getByRole("button", { name: /^save$/i }));

    await waitFor(() => {
      expect(
        screen.queryByRole("heading", { name: /edit project/i }),
      ).not.toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText("Updated Project")).toBeInTheDocument();
    });
  });

  it("deletes a project via confirmation modal", async () => {
    let projects = [structuredClone(mockProject)];

    server.use(
      http.get("*/api/projects", () =>
        HttpResponse.json({
          data: projects,
          meta: { total: projects.length, page: 1, limitPerPage: 9, totalPages: projects.length > 0 ? 1 : 0 },
        }),
      ),
      http.delete("*/api/projects/:projectId", () => {
        projects = [];
        return HttpResponse.text(null, { status: 204 });
      }),
    );

    const user = userEvent.setup();
    render(<ProjectListPage />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText("Test Project")).toBeInTheDocument();
    });

    const settingsBtn = screen.getAllByRole("button")[1];
    await user.click(settingsBtn);

    await user.click(screen.getByText("Delete project"));

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: /delete project/i }),
      ).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: /^delete$/i }));

    await waitFor(() => {
      expect(
        screen.getByText("No projects found"),
      ).toBeInTheDocument();
    });
  });
});
