import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";

import { ApiClientProvider } from "@/contexts/ApiClientProvider";
import { apiClient } from "@/libs/api/client";
import { useProjectAction } from "./useProjectAction";

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
          {children}
        </ApiClientProvider>
      </QueryClientProvider>
    );
  };
}

describe("useProjectAction", () => {
  it("getProjects calls GET /projects, returns paginated response", async () => {
    const { result } = renderHook(() => useProjectAction(), {
      wrapper: createWrapper(),
    });
    const response = await result.current.getProjects();
    expect(response.data).toHaveLength(1);
    expect(response.data[0].name).toBe("Test Project");
    expect(response.meta.total).toBe(1);
  });

  it("createProject calls POST /projects, returns new project", async () => {
    const { result } = renderHook(() => useProjectAction(), {
      wrapper: createWrapper(),
    });
    const project = await result.current.createProject("New Project");
    expect(project.name).toBe("New Project");
  });

  it("updateProject calls PATCH /projects/:id", async () => {
    const { result } = renderHook(() => useProjectAction(), {
      wrapper: createWrapper(),
    });
    const updated = await result.current.updateProject(1, "Updated Project");
    expect(updated.name).toBe("Updated Project");
  });

  it("deleteProject calls DELETE /projects/:id", async () => {
    const { result } = renderHook(() => useProjectAction(), {
      wrapper: createWrapper(),
    });
    await expect(
      result.current.deleteProject(1),
    ).resolves.toBeUndefined();
  });

  it("getProjectDetail calls GET /projects/:id", async () => {
    const { result } = renderHook(() => useProjectAction(), {
      wrapper: createWrapper(),
    });
    const detail = await result.current.getProjectDetail(1);
    expect(detail.name).toBe("Test Project");
    expect(detail.members).toHaveLength(1);
  });
});
