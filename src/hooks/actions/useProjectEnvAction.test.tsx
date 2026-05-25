import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";

import { ApiClientProvider } from "@/contexts/ApiClientProvider";
import { apiClient } from "@/libs/api/client";
import { useProjectEnvAction } from "./useProjectEnvAction";

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

describe("useProjectEnvAction", () => {
  it("getEnvGroups calls GET /projects/:id/env-groups", async () => {
    const { result } = renderHook(() => useProjectEnvAction(), {
      wrapper: createWrapper(),
    });
    const groups = await result.current.getEnvGroups(1);
    expect(groups).toHaveLength(1);
    expect(groups[0].name).toBe("Production");
  });

  it("createEnvGroup calls POST /projects/:id/env-groups", async () => {
    const { result } = renderHook(() => useProjectEnvAction(), {
      wrapper: createWrapper(),
    });
    const group = await result.current.createEnvGroup(1, "Staging");
    expect(group.name).toBe("Staging");
  });

  it("createEnvVariable calls POST /projects/:id/env-groups/:gid/variables", async () => {
    const { result } = renderHook(() => useProjectEnvAction(), {
      wrapper: createWrapper(),
    });
    const variable = await result.current.createEnvVariable(
      1,
      "g1",
      "API_KEY",
      "secret123",
    );
    expect(variable.key).toBe("API_KEY");
    expect(variable.value).toBe("secret123");
  });

  it("deleteEnvVariable calls DELETE", async () => {
    const { result } = renderHook(() => useProjectEnvAction(), {
      wrapper: createWrapper(),
    });
    await expect(
      result.current.deleteEnvVariable(1, "g1", "v1"),
    ).resolves.toBeUndefined();
  });
});
