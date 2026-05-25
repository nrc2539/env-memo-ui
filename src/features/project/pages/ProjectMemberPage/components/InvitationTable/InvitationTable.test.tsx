import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";

import { Role } from "@/enums/roleEnum";
import { InvitationStatus } from "@/enums/invitationStatusEnum";
import type { InvitationType } from "@/models/InvitationType";
import { InvitationTable } from "./index";

const invitations: InvitationType[] = [
  {
    id: "i1",
    email: "invited@example.com",
    role: Role.VIEWER,
    status: InvitationStatus.PENDING,
    createdAt: "2025-01-02T00:00:00Z",
    updatedAt: "2025-01-02T00:00:00Z",
  },
  {
    id: "i2",
    email: "another@example.com",
    role: Role.EDITOR,
    status: InvitationStatus.PENDING,
    createdAt: "2025-01-03T00:00:00Z",
    updatedAt: "2025-01-03T00:00:00Z",
  },
];

describe("InvitationTable", () => {
  it("renders invitation rows", () => {
    render(
      <InvitationTable
        invitations={invitations}
        resendingIds={new Set()}
        onResend={vi.fn()}
        onRemove={vi.fn()}
      />,
    );

    expect(screen.getByText("invited@example.com")).toBeInTheDocument();
    expect(screen.getByText("another@example.com")).toBeInTheDocument();
    expect(screen.getAllByText("PENDING")).toHaveLength(2);
  });

  it("calls onResend when resend button is clicked", async () => {
    const onResend = vi.fn();
    const user = userEvent.setup();
    render(
      <InvitationTable
        invitations={[invitations[0]]}
        resendingIds={new Set()}
        onResend={onResend}
        onRemove={vi.fn()}
      />,
    );

    const resendBtn = screen.getByRole("button", { name: /resend invitation/i });
    await user.click(resendBtn);

    expect(onResend).toHaveBeenCalledWith(invitations[0]);
  });

  it("disables resend button while resending", () => {
    render(
      <InvitationTable
        invitations={[invitations[0]]}
        resendingIds={new Set(["i1"])}
        onResend={vi.fn()}
        onRemove={vi.fn()}
      />,
    );

    const resendBtn = screen.getByRole("button", { name: /resend invitation/i });
    expect(resendBtn).toBeDisabled();
  });

  it("calls onRemove when remove button is clicked", async () => {
    const onRemove = vi.fn();
    const user = userEvent.setup();
    render(
      <InvitationTable
        invitations={[invitations[0]]}
        resendingIds={new Set()}
        onResend={vi.fn()}
        onRemove={onRemove}
      />,
    );

    const removeBtns = screen.getAllByRole("button", { name: /remove invitation/i });
    await user.click(removeBtns[0]);

    expect(onRemove).toHaveBeenCalledWith(invitations[0]);
  });
});
