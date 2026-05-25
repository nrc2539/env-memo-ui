import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";

import { ApiClientProvider } from "@/contexts/ApiClientProvider";
import { apiClient } from "@/libs/api/client";
import { useAuthAction } from "./useAuthAction";

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

describe("useAuthAction", () => {
  it("login calls POST /auth/login with email/password, returns tokens", async () => {
    const { result } = renderHook(() => useAuthAction(), {
      wrapper: createWrapper(),
    });
    const response = await result.current.login(
      "test@example.com",
      "password123",
    );
    expect(response.accessToken).toBe("mock-access-token");
    expect(response.refreshToken).toBe("mock-refresh-token");
  });

  it("register calls POST /auth/register", async () => {
    const { result } = renderHook(() => useAuthAction(), {
      wrapper: createWrapper(),
    });
    await expect(
      result.current.register("Test User", "test@example.com", "Str0ng!pass"),
    ).resolves.toBeUndefined();
  });

  it("forgotPassword calls POST /auth/forgot-password", async () => {
    const { result } = renderHook(() => useAuthAction(), {
      wrapper: createWrapper(),
    });
    await expect(
      result.current.forgotPassword("test@example.com"),
    ).resolves.toBeUndefined();
  });

  it("getProfile calls GET /auth/profile, returns user data", async () => {
    const { result } = renderHook(() => useAuthAction(), {
      wrapper: createWrapper(),
    });
    const profile = await result.current.getProfile();
    expect(profile.email).toBe("test@example.com");
    expect(profile.name).toBe("Test User");
  });

  it("updateProfile calls PATCH /auth/profile with name", async () => {
    const { result } = renderHook(() => useAuthAction(), {
      wrapper: createWrapper(),
    });
    await expect(
      result.current.updateProfile("New Name"),
    ).resolves.toBeUndefined();
  });
});
