import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";

import type { EnvVariableType } from "@/models/EnvVariableType";
import { EnvVariableTable } from "./index";

const variables: EnvVariableType[] = [
  {
    id: "v1",
    key: "DATABASE_URL",
    value: "postgres://localhost:5432/db",
    envGroupId: "g1",
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-01T00:00:00Z",
  },
  {
    id: "v2",
    key: "API_KEY",
    value: "secret123",
    envGroupId: "g1",
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-01T00:00:00Z",
  },
];

describe("EnvVariableTable", () => {
  it("renders variable rows", () => {
    render(
      <EnvVariableTable
        variables={variables}
        selected={new Set()}
        onToggleAll={vi.fn()}
        onToggleVar={vi.fn()}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />,
    );

    expect(screen.getByText("DATABASE_URL")).toBeInTheDocument();
    expect(screen.getByText("postgres://localhost:5432/db")).toBeInTheDocument();
    expect(screen.getByText("API_KEY")).toBeInTheDocument();
    expect(screen.getByText("secret123")).toBeInTheDocument();
  });

  it("calls onEdit when edit button is clicked", async () => {
    const onEdit = vi.fn();
    const user = userEvent.setup();
    render(
      <EnvVariableTable
        variables={[variables[0]]}
        selected={new Set()}
        onToggleAll={vi.fn()}
        onToggleVar={vi.fn()}
        onEdit={onEdit}
        onDelete={vi.fn()}
      />,
    );

    const editBtn = screen.getByRole("button", { name: /edit variable/i });
    await user.click(editBtn);

    expect(onEdit).toHaveBeenCalledWith(variables[0]);
  });

  it("calls onDelete when delete button is clicked", async () => {
    const onDelete = vi.fn();
    const user = userEvent.setup();
    render(
      <EnvVariableTable
        variables={[variables[0]]}
        selected={new Set()}
        onToggleAll={vi.fn()}
        onToggleVar={vi.fn()}
        onEdit={vi.fn()}
        onDelete={onDelete}
      />,
    );

    const deleteBtns = screen.getAllByRole("button", { name: /delete variable/i });
    await user.click(deleteBtns[0]);

    expect(onDelete).toHaveBeenCalledWith(variables[0]);
  });

  it("does not render action buttons when onEdit/onDelete are undefined", () => {
    render(
      <EnvVariableTable
        variables={variables}
        selected={new Set()}
        onToggleAll={vi.fn()}
        onToggleVar={vi.fn()}
      />,
    );

    expect(
      screen.queryByRole("button", { name: /edit variable/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /delete variable/i }),
    ).not.toBeInTheDocument();
  });
});
