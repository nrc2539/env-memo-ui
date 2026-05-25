import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";

import { ApiClientProvider } from "@/contexts/ApiClientProvider";
import { apiClient } from "@/libs/api/client";
import { useProjectMemberAction } from "./useProjectMemberAction";

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

describe("useProjectMemberAction", () => {
  it("getProjectMembers calls GET /projects/:id/members", async () => {
    const { result } = renderHook(() => useProjectMemberAction(), {
      wrapper: createWrapper(),
    });
    const response = await result.current.getProjectMembers(1);
    expect(response.data).toHaveLength(1);
    expect(response.data[0].user.email).toBe("member@example.com");
  });

  it("inviteUserToProject calls POST /projects/:id/invitations", async () => {
    const { result } = renderHook(() => useProjectMemberAction(), {
      wrapper: createWrapper(),
    });
    await expect(
      result.current.inviteUserToProject(1, "new@example.com", "EDITOR"),
    ).resolves.toBeUndefined();
  });

  it("removeProjectMember calls DELETE /projects/:id/members/:userId", async () => {
    const { result } = renderHook(() => useProjectMemberAction(), {
      wrapper: createWrapper(),
    });
    await expect(
      result.current.removeProjectMember(1, 2),
    ).resolves.toBeUndefined();
  });

  it("getProjectInvitations calls GET /projects/:id/invitations", async () => {
    const { result } = renderHook(() => useProjectMemberAction(), {
      wrapper: createWrapper(),
    });
    const response = await result.current.getProjectInvitations(1);
    expect(response.data).toHaveLength(1);
    expect(response.data[0].email).toBe("invited@example.com");
  });
});
