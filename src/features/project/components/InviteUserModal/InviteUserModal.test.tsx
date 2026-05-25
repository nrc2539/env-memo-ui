import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";

import { Role } from "@/enums/roleEnum";
import { InviteUserModal } from "./index";

describe("InviteUserModal", () => {
  it("renders the invite title", () => {
    render(
      <InviteUserModal
        isOpen
        availableRoles={[Role.OWNER, Role.EDITOR, Role.VIEWER]}
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
      />,
    );
    expect(
      screen.getByRole("heading", { name: /invite user/i }),
    ).toBeInTheDocument();
  });

  it("calls onSubmit with email and role", async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();
    render(
      <InviteUserModal
        isOpen
        availableRoles={[Role.OWNER, Role.EDITOR, Role.VIEWER]}
        onSubmit={onSubmit}
        onCancel={vi.fn()}
      />,
    );

    await user.type(screen.getByPlaceholderText("Enter user email"), "new@example.com");

    await user.click(screen.getByRole("button", { name: /select a role/i }));
    await user.click(screen.getByText("Editor"));

    await user.click(screen.getByRole("button", { name: /invite/i }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({ email: "new@example.com", role: "EDITOR" }),
        expect.anything(),
      );
    });
  });

  it("shows validation error for invalid email", async () => {
    const user = userEvent.setup();
    render(
      <InviteUserModal
        isOpen
        availableRoles={[Role.EDITOR]}
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
      />,
    );

    await user.type(screen.getByPlaceholderText("Enter user email"), "bad-email");
    await user.click(screen.getByRole("button", { name: /invite/i }));

    await waitFor(() => {
      expect(screen.getByText("Invalid email")).toBeInTheDocument();
    });
  });

  it("calls onCancel when cancel is clicked", async () => {
    const onCancel = vi.fn();
    const user = userEvent.setup();
    render(
      <InviteUserModal
        isOpen
        availableRoles={[Role.EDITOR]}
        onSubmit={vi.fn()}
        onCancel={onCancel}
      />,
    );

    await user.click(screen.getByRole("button", { name: /cancel/i }));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });
});
