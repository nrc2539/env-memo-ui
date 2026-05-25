import { describe, it, expect, vi, beforeEach } from "vitest";

const requestHandlers = vi.hoisted(() => [] as Array<(config: Record<string, unknown>) => Record<string, unknown>>);
const responseHandlers = vi.hoisted(() => [] as Array<(error: Record<string, unknown>) => Promise<unknown>>);
const mockAxiosPost = vi.hoisted(() => vi.fn());
const mockApiClientFn = vi.hoisted(() => vi.fn());

vi.mock("axios", () => {
  const apiClientInstance = Object.assign(mockApiClientFn, {
    interceptors: {
      request: { use: (f: (c: unknown) => unknown) => { requestHandlers.push(f as typeof requestHandlers[0]); } },
      response: { use: (_: unknown, f: (e: unknown) => unknown) => { responseHandlers.push(f as typeof responseHandlers[0]); } },
    },
    defaults: { headers: {} },
    post: mockAxiosPost,
    get: vi.fn(),
  });

  const axiosFn = Object.assign(
    vi.fn(() => Promise.resolve({ data: {} })),
    {
      create: vi.fn(() => apiClientInstance),
      post: mockAxiosPost,
      get: vi.fn(),
      isAxiosError: vi.fn(),
      isCancel: vi.fn(),
      AxiosError: class extends Error {
        config: Record<string, unknown> = {};
        response: Record<string, unknown> = {};
        isAxiosError = true;
      },
    },
  );

  return { default: axiosFn };
});

import {
  getAccessToken,
  getRefreshToken,
  setTokens,
  clearTokens,
  registerLogoutHandler,
} from "./client";

beforeEach(() => {
  localStorage.clear();
  registerLogoutHandler(null);
  vi.clearAllMocks();
});

function createExpiredError(): Record<string, unknown> {
  return {
    config: { url: "/api/projects", headers: {}, _retry: undefined },
    response: { status: 401, data: { message: "Unauthorized" } },
  };
}

describe("getAccessToken / getRefreshToken / setTokens / clearTokens", () => {
  it("getAccessToken returns null initially", () => {
    expect(getAccessToken()).toBeNull();
  });

  it("getRefreshToken returns null initially", () => {
    expect(getRefreshToken()).toBeNull();
  });

  it("setTokens stores both tokens", () => {
    setTokens("access-123", "refresh-456");
    expect(localStorage.getItem("act")).toBe("access-123");
    expect(localStorage.getItem("rft")).toBe("refresh-456");
  });

  it("getAccessToken returns stored value", () => {
    localStorage.setItem("act", "my-access");
    expect(getAccessToken()).toBe("my-access");
  });

  it("getRefreshToken returns stored value", () => {
    localStorage.setItem("rft", "my-refresh");
    expect(getRefreshToken()).toBe("my-refresh");
  });

  it("clearTokens removes both tokens", () => {
    localStorage.setItem("act", "a");
    localStorage.setItem("rft", "b");
    clearTokens();
    expect(localStorage.getItem("act")).toBeNull();
    expect(localStorage.getItem("rft")).toBeNull();
  });
});

describe("request interceptor", () => {
  it("attaches Bearer token when token exists", () => {
    localStorage.setItem("act", "test-token");
    const config: Record<string, unknown> = { headers: {} };
    const result = requestHandlers[0](config) as Record<string, unknown>;
    expect((result.headers as Record<string, string>).Authorization).toBe("Bearer test-token");
  });

  it("does not attach token when no token stored", () => {
    const config: Record<string, unknown> = { headers: {} };
    const result = requestHandlers[0](config) as Record<string, unknown>;
    expect((result.headers as Record<string, string>).Authorization).toBeUndefined();
  });

  it("preserves existing headers", () => {
    localStorage.setItem("act", "tok");
    const config: Record<string, unknown> = { headers: { "X-Custom": "value" } };
    const result = requestHandlers[0](config) as Record<string, unknown>;
    const headers = result.headers as Record<string, string>;
    expect(headers["X-Custom"]).toBe("value");
    expect(headers.Authorization).toBe("Bearer tok");
  });
});

describe("response interceptor — passthrough cases", () => {
  it("rejects non-401 errors without interception", async () => {
    const error = {
      config: { url: "/api/projects", headers: {} },
      response: { status: 500, data: { message: "Server error" } },
    };
    await expect(responseHandlers[0](error)).rejects.toBe(error);
    expect(mockAxiosPost).not.toHaveBeenCalled();
  });

  it("does not intercept 401 on /auth/refresh endpoint", async () => {
    const error = {
      config: { url: "/auth/refresh", headers: {} },
      response: { status: 401, data: { message: "Unauthorized" } },
    };
    await expect(responseHandlers[0](error)).rejects.toBe(error);
    expect(mockAxiosPost).not.toHaveBeenCalled();
  });
});

describe("response interceptor — token refresh flow", () => {
  beforeEach(() => {
    localStorage.setItem("rft", "my-refresh-token");
  });

  it("refreshes token and retries original request on success", async () => {
    mockAxiosPost.mockResolvedValueOnce({
      data: { accessToken: "new-access", refreshToken: "new-refresh" },
    });
    mockApiClientFn.mockResolvedValueOnce({ data: "retried-ok" });

    const result = await responseHandlers[0](createExpiredError());

    expect(result).toEqual({ data: "retried-ok" });
    expect(mockAxiosPost).toHaveBeenCalledWith(
      expect.stringContaining("/auth/refresh"),
      { refreshToken: "my-refresh-token" },
    );
    expect(localStorage.getItem("act")).toBe("new-access");
    expect(localStorage.getItem("rft")).toBe("new-refresh");
  });

  it("calls _onLogout when refresh fails", async () => {
    const logoutHandler = vi.fn();
    registerLogoutHandler(logoutHandler);
    const refreshError = new Error("Refresh failed");
    mockAxiosPost.mockRejectedValueOnce(refreshError);

    await expect(responseHandlers[0](createExpiredError())).rejects.toThrow("Refresh failed");

    expect(logoutHandler).toHaveBeenCalledOnce();
  });

  it("does not retry when no refresh token is stored", async () => {
    localStorage.removeItem("rft");
    const refreshError = new Error("Request failed with status code 401");
    mockAxiosPost.mockRejectedValueOnce(refreshError);

    await expect(responseHandlers[0](createExpiredError())).rejects.toThrow();

    expect(mockAxiosPost).toHaveBeenCalledWith(
      expect.stringContaining("/auth/refresh"),
      { refreshToken: null },
    );
  });
});
