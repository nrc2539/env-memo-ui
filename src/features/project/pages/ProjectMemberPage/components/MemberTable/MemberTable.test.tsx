import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";

import { Role } from "@/enums/roleEnum";
import type { ProjectMemberType } from "@/models/ProjectMemberType";
import { MemberTable } from "./index";

const members: ProjectMemberType[] = [
  {
    id: "m1",
    role: Role.OWNER,
    userId: 1,
    projectId: 1,
    createdAt: "2025-01-01T00:00:00Z",
    user: { id: 1, email: "owner@example.com", name: "Owner" },
  },
  {
    id: "m2",
    role: Role.EDITOR,
    userId: 2,
    projectId: 1,
    createdAt: "2025-01-01T00:00:00Z",
    user: { id: 2, email: "editor@example.com", name: "Editor" },
  },
];

describe("MemberTable", () => {
  it("renders member rows", () => {
    render(
      <MemberTable
        members={members}
        currentUserId={1}
        isOwner
        onRemove={vi.fn()}
      />,
    );

    expect(screen.getByText("Owner")).toBeInTheDocument();
    expect(screen.getByText("editor@example.com")).toBeInTheDocument();
  });

  it("shows remove buttons for owner role", () => {
    render(
      <MemberTable
        members={members}
        currentUserId={1}
        isOwner
        onRemove={vi.fn()}
      />,
    );

    const removeBtns = screen.getAllByRole("button");
    expect(removeBtns.length).toBeGreaterThan(0);
  });

  it("disables remove button for self", () => {
    render(
      <MemberTable
        members={members}
        currentUserId={1}
        isOwner
        onRemove={vi.fn()}
      />,
    );

    const removeBtns = screen.getAllByRole("button");
    const selfRemoveBtn = removeBtns[0];
    expect(selfRemoveBtn).toBeDisabled();
  });

  it("does not show remove column when not owner", () => {
    render(
      <MemberTable
        members={members}
        currentUserId={1}
        isOwner={false}
        onRemove={vi.fn()}
      />,
    );

    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("calls onRemove when remove button is clicked", async () => {
    const onRemove = vi.fn();
    const user = userEvent.setup();
    render(
      <MemberTable
        members={[members[1]]}
        currentUserId={1}
        isOwner
        onRemove={onRemove}
      />,
    );

    const removeBtn = screen.getByRole("button");
    await user.click(removeBtn);

    expect(onRemove).toHaveBeenCalledWith(members[1]);
  });
});
