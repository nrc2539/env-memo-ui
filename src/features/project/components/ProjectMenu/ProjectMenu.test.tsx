import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";

import { ProjectMenu } from "./index";
import type { ProjectType } from "@/models/ProjectType";

const project: ProjectType = {
  id: 1,
  name: "Test",
  description: "Desc",
  createdAt: "2025-01-01T00:00:00Z",
  updatedAt: "2025-05-01T00:00:00Z",
  role: "OWNER" as const,
};

describe("ProjectMenu", () => {
  it("opens dropdown on settings click", async () => {
    const user = userEvent.setup();
    render(<ProjectMenu project={project} onEdit={vi.fn()} onDelete={vi.fn()} />);

    const settingsBtn = screen.getByRole("button");
    await user.click(settingsBtn);

    expect(screen.getByText("Edit project")).toBeInTheDocument();
    expect(screen.getByText("Delete project")).toBeInTheDocument();
  });

  it("calls onEdit when Edit project is clicked", async () => {
    const onEdit = vi.fn();
    const user = userEvent.setup();
    render(<ProjectMenu project={project} onEdit={onEdit} onDelete={vi.fn()} />);

    await user.click(screen.getByRole("button"));
    await user.click(screen.getByText("Edit project"));

    expect(onEdit).toHaveBeenCalledWith(project);
  });

  it("calls onDelete when Delete project is clicked", async () => {
    const onDelete = vi.fn();
    const user = userEvent.setup();
    render(<ProjectMenu project={project} onEdit={vi.fn()} onDelete={onDelete} />);

    await user.click(screen.getByRole("button"));
    await user.click(screen.getByText("Delete project"));

    expect(onDelete).toHaveBeenCalledWith(project);
  });
});
