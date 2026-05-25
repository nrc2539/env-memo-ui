import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router";
import { describe, it, expect } from "vitest";
import type { ReactNode } from "react";

import { ApiClientProvider } from "@/contexts/ApiClientProvider";
import { apiClient } from "@/libs/api/client";
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
});
