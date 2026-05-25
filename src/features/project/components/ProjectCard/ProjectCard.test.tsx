import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, it, expect, vi } from "vitest";

import { Role } from "@/enums/roleEnum";
import type { ProjectType } from "@/models/ProjectType";
import { ProjectCard } from "./index";

const baseProject: ProjectType = {
  id: 1,
  name: "Test Project",
  description: "A test project",
  createdAt: "2025-01-01T00:00:00Z",
  updatedAt: "2025-05-01T00:00:00Z",
  role: Role.OWNER,
};

function renderWithRouter(ui: React.ReactElement) {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
}

describe("ProjectCard", () => {
  it("renders project name and description", () => {
    renderWithRouter(
      <ProjectCard project={baseProject} onEdit={vi.fn()} onDelete={vi.fn()} />,
    );
    expect(screen.getByText("Test Project")).toBeInTheDocument();
    expect(screen.getByText("A test project")).toBeInTheDocument();
  });

  it("renders 'No description' when description is empty", () => {
    renderWithRouter(
      <ProjectCard
        project={{ ...baseProject, description: "" }}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />,
    );
    expect(screen.getByText("No description")).toBeInTheDocument();
  });

  it("does not render ProjectMenu for non-owner roles", () => {
    renderWithRouter(
      <ProjectCard
        project={{ ...baseProject, role: Role.VIEWER }}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />,
    );
    expect(screen.getByText("Test Project")).toBeInTheDocument();
    const links = screen.getAllByRole("link");
    expect(links[0]).toHaveAttribute("href", "/projects/1");
  });
});
