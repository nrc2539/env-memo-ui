import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";

import { EnvGroupModal } from "./index";

describe("EnvGroupModal", () => {
  it("renders create title when isEdit is false", () => {
    render(
      <EnvGroupModal
        isOpen
        isEdit={false}
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
      />,
    );
    expect(
      screen.getByRole("heading", { name: /create environment group/i }),
    ).toBeInTheDocument();
  });

  it("renders edit title when isEdit is true", () => {
    render(
      <EnvGroupModal
        isOpen
        isEdit
        initialValues={{ name: "Production" }}
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
      />,
    );
    expect(
      screen.getByRole("heading", { name: /edit environment group/i }),
    ).toBeInTheDocument();
  });

  it("calls onSubmit with group name", async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();
    render(
      <EnvGroupModal
        isOpen
        isEdit={false}
        onSubmit={onSubmit}
        onCancel={vi.fn()}
      />,
    );

    await user.type(screen.getByPlaceholderText("Enter group name"), "Staging");
    await user.click(screen.getByRole("button", { name: /^create$/i }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({ name: "Staging" }),
        expect.anything(),
      );
    });
  });

  it("calls onCancel when cancel is clicked", async () => {
    const onCancel = vi.fn();
    const user = userEvent.setup();
    render(
      <EnvGroupModal
        isOpen
        isEdit={false}
        onSubmit={vi.fn()}
        onCancel={onCancel}
      />,
    );

    await user.click(screen.getByRole("button", { name: /cancel/i }));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });
});
