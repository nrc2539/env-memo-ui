import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";

import { EnvVariableModal } from "./index";

describe("EnvVariableModal", () => {
  it("renders create title when isEdit is false", () => {
    render(
      <EnvVariableModal
        isOpen
        isEdit={false}
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
      />,
    );
    expect(
      screen.getByRole("heading", { name: /create variable/i }),
    ).toBeInTheDocument();
  });

  it("renders edit title when isEdit is true", () => {
    render(
      <EnvVariableModal
        isOpen
        isEdit
        initialValues={{ key: "DB_URL", value: "postgres://..." }}
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
      />,
    );
    expect(
      screen.getByRole("heading", { name: /edit variable/i }),
    ).toBeInTheDocument();
  });

  it("calls onSubmit with key and value", async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();
    render(
      <EnvVariableModal
        isOpen
        isEdit={false}
        onSubmit={onSubmit}
        onCancel={vi.fn()}
      />,
    );

    await user.type(screen.getByPlaceholderText("e.g. DATABASE_URL"), "API_KEY");
    await user.type(screen.getByPlaceholderText("Enter variable value"), "sk-test");
    await user.click(screen.getByRole("button", { name: /^create$/i }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({ key: "API_KEY", value: "sk-test" }),
        expect.anything(),
      );
    });
  });

  it("shows validation error for key starting with a number", async () => {
    const user = userEvent.setup();
    render(
      <EnvVariableModal
        isOpen
        isEdit={false}
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
      />,
    );

    await user.type(screen.getByPlaceholderText("e.g. DATABASE_URL"), "1INVALID");
    await user.type(screen.getByPlaceholderText("Enter variable value"), "val");
    await user.click(screen.getByRole("button", { name: /^create$/i }));

    await waitFor(() => {
      expect(screen.getByText("Key cannot start with a number")).toBeInTheDocument();
    });
  });
});
