import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";

import { ProjectModal } from "./index";

describe("ProjectModal", () => {
  it("renders create title when isEdit is false", () => {
    render(
      <ProjectModal
        isOpen
        isEdit={false}
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
      />,
    );
    expect(
      screen.getByRole("heading", { name: /create new project/i }),
    ).toBeInTheDocument();
  });

  it("renders edit title when isEdit is true", () => {
    render(
      <ProjectModal
        isOpen
        isEdit
        initialValues={{ name: "My Project", description: "Desc" }}
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
      />,
    );
    expect(
      screen.getByRole("heading", { name: /edit project/i }),
    ).toBeInTheDocument();
  });

  it("calls onSubmit with form values", async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();
    render(
      <ProjectModal
        isOpen
        isEdit={false}
        onSubmit={onSubmit}
        onCancel={vi.fn()}
      />,
    );

    await user.type(screen.getByPlaceholderText("Enter project name"), "New Project");
    await user.type(
      screen.getByPlaceholderText("Enter project description (optional)"),
      "A description",
    );
    await user.click(screen.getByRole("button", { name: /^create$/i }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({ name: "New Project", description: "A description" }),
        expect.anything(),
      );
    });
  });

  it("calls onCancel when cancel is clicked", async () => {
    const onCancel = vi.fn();
    const user = userEvent.setup();
    render(
      <ProjectModal
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
