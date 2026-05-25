import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";

import type { EnvVariableType } from "@/models/EnvVariableType";
import { VariablePreviewPanel } from "./index";

const vars: EnvVariableType[] = [
  {
    id: "v1",
    key: "DB_URL",
    value: "postgres://localhost/db",
    envGroupId: "g1",
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-01T00:00:00Z",
  },
  {
    id: "v2",
    key: "SECRET",
    value: "s3cret",
    envGroupId: "g1",
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-01T00:00:00Z",
  },
];

describe("VariablePreviewPanel", () => {
  it("shows empty state when no variables selected", () => {
    render(
      <VariablePreviewPanel
        isOpen
        selectedVars={[]}
        onClose={vi.fn()}
        onCopy={vi.fn()}
      />,
    );

    expect(
      screen.getByText("Select variables to preview them here."),
    ).toBeInTheDocument();
  });

  it("displays selected variables", () => {
    render(
      <VariablePreviewPanel
        isOpen
        selectedVars={vars}
        onClose={vi.fn()}
        onCopy={vi.fn()}
      />,
    );

    expect(screen.getByText("DB_URL=postgres://localhost/db")).toBeInTheDocument();
    expect(screen.getByText("SECRET=s3cret")).toBeInTheDocument();
  });

  it("shows copy all button with correct count", () => {
    render(
      <VariablePreviewPanel
        isOpen
        selectedVars={vars}
        onClose={vi.fn()}
        onCopy={vi.fn()}
      />,
    );

    expect(
      screen.getByText("Copy all (2 variables)"),
    ).toBeInTheDocument();
  });

  it("calls onCopy when copy button is clicked", async () => {
    const onCopy = vi.fn();
    const user = userEvent.setup();
    render(
      <VariablePreviewPanel
        isOpen
        selectedVars={[vars[0]]}
        onClose={vi.fn()}
        onCopy={onCopy}
      />,
    );

    const copyBtns = screen.getAllByRole("button", { name: /copy/i });
    await user.click(copyBtns[0]);

    expect(onCopy).toHaveBeenCalledWith("DB_URL=postgres://localhost/db");
  });
});
