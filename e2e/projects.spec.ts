import { test, expect } from "@playwright/test";

test.use({ storageState: "e2e/.auth/storageState.json" });

const mockProjects = {
  data: [
    {
      id: 1,
      name: "Test Project",
      description: "A test project description",
      createdAt: "2025-01-01T00:00:00Z",
      updatedAt: "2025-05-01T00:00:00Z",
      role: "OWNER",
    },
  ],
  meta: {
    total: 1,
    page: 1,
    limitPerPage: 9,
    totalPages: 1,
  },
};

test.describe("Projects list", () => {
  test("renders project list with mocked data", async ({ page }) => {
    await page.route(/\/api\/auth\/profile/, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ id: 1, email: "test@test.com", name: "Test User" }),
      });
    });
    await page.route(/\/api\/projects/, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(mockProjects),
      });
    });

    await page.goto("/projects");
    await expect(page.getByRole("heading", { name: "Projects" })).toBeVisible({ timeout: 10000 });
    await expect(page.locator("h3").filter({ hasText: "Test Project" })).toBeVisible({ timeout: 10000 });
  });

  test("creates a new project via modal", async ({ page }) => {
    const mockResponse = { id: 2, name: "New Project", description: "New description", createdAt: "2025-06-01T00:00:00Z", updatedAt: "2025-06-01T00:00:00Z", role: "OWNER" };
    let projects = [...mockProjects.data];

    await page.route(/\/api\/auth\/profile/, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ id: 1, email: "test@test.com", name: "Test User" }),
      });
    });
    await page.route(/\/api\/projects/, async (route) => {
      if (route.request().method() === "POST") {
        projects = [...projects, mockResponse];
        await route.fulfill({
          status: 201,
          contentType: "application/json",
          body: JSON.stringify(mockResponse),
        });
      } else {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ data: projects, meta: { total: projects.length, page: 1, limitPerPage: 9, totalPages: 1 } }),
        });
      }
    });

    await page.goto("/projects");
    await expect(page.getByRole("heading", { name: "Projects" })).toBeVisible({ timeout: 10000 });
    await expect(page.locator("h3").filter({ hasText: "Test Project" })).toBeVisible({ timeout: 10000 });

    await page.getByRole("button", { name: "New Project" }).click();
    await expect(page.getByRole("heading", { name: "Create New Project" })).toBeVisible();

    await page.getByPlaceholder("Enter project name").fill("New Project");
    await page.getByPlaceholder("Enter project description (optional)").fill("New description");
    await page.getByRole("button", { name: "Create", exact: true }).click();

    await expect(page.getByText("Create New Project")).not.toBeVisible();
    await expect(page.locator("h3").filter({ hasText: "New Project" })).toBeVisible({ timeout: 10000 });
  });

  test("edits a project via modal", async ({ page }) => {
    const mockResponse = { id: 2, name: "Updated Project", description: "Updated desc", createdAt: "2025-06-01T00:00:00Z", updatedAt: "2025-06-01T00:00:00Z", role: "OWNER" };
    let projects = [...mockProjects.data];

    await page.route(/\/api\/auth\/profile/, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ id: 1, email: "test@test.com", name: "Test User" }),
      });
    });
    await page.route(/\/api\/projects/, async (route) => {
      if (route.request().method() === "PATCH") {
        const body = JSON.parse(route.request().postData() || "{}");
        projects = projects.map((p) => (p.id === 1 ? { ...p, name: body.name } : p));
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify(projects[0]),
        });
      } else {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ data: projects, meta: { total: projects.length, page: 1, limitPerPage: 9, totalPages: 1 } }),
        });
      }
    });

    await page.goto("/projects");
    await expect(page.getByRole("heading", { name: "Projects" })).toBeVisible({ timeout: 10000 });
    await expect(page.locator("h3").filter({ hasText: "Test Project" })).toBeVisible({ timeout: 10000 });

    await page.locator("button").filter({ has: page.locator(".tabler-icon-settings") }).click();
    await page.getByText("Edit project").click();
    await expect(page.getByRole("heading", { name: "Edit Project" })).toBeVisible();

    const nameInput = page.getByPlaceholder("Enter project name");
    await nameInput.clear();
    await nameInput.fill("Updated Project");
    await page.getByRole("button", { name: "Save", exact: true }).click();

    await expect(page.getByText("Edit Project")).not.toBeVisible();
    await expect(page.locator("h3").filter({ hasText: "Updated Project" })).toBeVisible({ timeout: 10000 });
  });

  test("deletes a project via confirmation modal", async ({ page }) => {
    let projects = [...mockProjects.data];

    await page.route(/\/api\/auth\/profile/, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ id: 1, email: "test@test.com", name: "Test User" }),
      });
    });
    await page.route(/\/api\/projects/, async (route) => {
      if (route.request().method() === "DELETE") {
        projects = [];
        await route.fulfill({ status: 204 });
      } else {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ data: projects, meta: { total: projects.length, page: 1, limitPerPage: 9, totalPages: projects.length > 0 ? 1 : 0 } }),
        });
      }
    });

    await page.goto("/projects");
    await expect(page.getByRole("heading", { name: "Projects" })).toBeVisible({ timeout: 10000 });
    await expect(page.locator("h3").filter({ hasText: "Test Project" })).toBeVisible({ timeout: 10000 });

    await page.locator("button").filter({ has: page.locator(".tabler-icon-settings") }).click();
    await page.getByRole("button", { name: "Delete project" }).click();
    await expect(page.getByRole("heading", { name: "Delete Project" })).toBeVisible();

    await page.getByRole("button", { name: "Delete", exact: true }).click();
    await expect(page.getByText("No projects found")).toBeVisible({ timeout: 10000 });
  });
});
