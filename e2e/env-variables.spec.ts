import { test, expect } from "@playwright/test";

test.use({ storageState: "e2e/.auth/storageState.json" });

const envGroups = [
  {
    id: "group-1",
    name: "Development",
    projectId: 1,
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-01T00:00:00Z",
    variables: [
      {
        id: "var-1",
        key: "DATABASE_URL",
        value: "postgres://localhost:5432/db",
        envGroupId: "group-1",
        createdAt: "2025-01-01T00:00:00Z",
        updatedAt: "2025-01-01T00:00:00Z",
      },
    ],
  },
];

test.describe("Environment variables", () => {
  test("displays env groups and variables", async ({ page }) => {
    await page.route(/\/api\/auth\/profile/, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ id: 1, email: "test@test.com", name: "Test User" }),
      });
    });
    await page.route(/\/api\/projects/, async (route) => {
      const url = route.request().url();
      if (url.endsWith("/projects/1") || url.includes("/projects/1?")) {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            id: 1,
            name: "Test Project",
            description: "A test project",
            createdAt: "2025-01-01T00:00:00Z",
            updatedAt: "2025-05-01T00:00:00Z",
            members: [{ userId: 1, role: "OWNER" }],
          }),
        });
      } else {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            data: [{ id: 1, name: "Test Project", description: "A test project", createdAt: "2025-01-01T00:00:00Z", updatedAt: "2025-05-01T00:00:00Z", role: "OWNER" }],
            meta: { total: 1, page: 1, limitPerPage: 9, totalPages: 1 },
          }),
        });
      }
    });
    await page.route(/\/api\/projects\/\d+\/env-groups/, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ data: envGroups }),
      });
    });

    await page.goto("/projects/1");
    await expect(page.getByText("Test Project").first()).toBeVisible({ timeout: 15000 });

    const accordionBtn = page.locator("button").filter({ hasText: "Development" });
    await expect(accordionBtn).toBeVisible({ timeout: 10000 });
    await accordionBtn.click();

    await expect(page.getByText("DATABASE_URL")).toBeVisible({ timeout: 5000 });
    await expect(page.getByText("postgres://localhost:5432/db")).toBeVisible();
  });

  test("creates a new variable via modal", async ({ page }) => {
    let currentGroups = JSON.parse(JSON.stringify(envGroups));

    await page.route(/\/api\/auth\/profile/, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ id: 1, email: "test@test.com", name: "Test User" }),
      });
    });
    await page.route(/\/api\/projects/, async (route) => {
      const url = route.request().url();
      if (url.endsWith("/projects/1") || url.includes("/projects/1?")) {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            id: 1,
            name: "Test Project",
            description: "A test project",
            createdAt: "2025-01-01T00:00:00Z",
            updatedAt: "2025-05-01T00:00:00Z",
            members: [{ userId: 1, role: "OWNER" }],
          }),
        });
      } else {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            data: [{ id: 1, name: "Test Project", description: "A test project", createdAt: "2025-01-01T00:00:00Z", updatedAt: "2025-05-01T00:00:00Z", role: "OWNER" }],
            meta: { total: 1, page: 1, limitPerPage: 9, totalPages: 1 },
          }),
        });
      }
    });
    await page.route(/\/api\/projects\/\d+\/env-groups/, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ data: currentGroups }),
      });
    });
    await page.route(/\/api\/projects\/\d+\/env-groups\/[^/]+\/variables/, async (route) => {
      if (route.request().method() !== "POST") {
        await route.fallback();
        return;
      }
      const body = JSON.parse(route.request().postData() || "{}");
      const newVar = {
        id: "var-new",
        key: body.key,
        value: body.value,
        envGroupId: "group-1",
        createdAt: "2025-06-01T00:00:00Z",
        updatedAt: "2025-06-01T00:00:00Z",
      };
      currentGroups[0].variables.push(newVar);
      await route.fulfill({
        status: 201,
        contentType: "application/json",
        body: JSON.stringify(newVar),
      });
    });

    await page.goto("/projects/1");
    await expect(page.getByText("Test Project").first()).toBeVisible({ timeout: 15000 });

    const accordionBtn = page.locator("button").filter({ hasText: "Development" });
    await expect(accordionBtn).toBeVisible({ timeout: 10000 });
    await accordionBtn.click();
    await expect(page.getByText("DATABASE_URL")).toBeVisible({ timeout: 5000 });

    await page.getByRole("button", { name: "Add variable" }).click();
    await expect(page.getByRole("heading", { name: "Create Variable" })).toBeVisible();

    await page.getByPlaceholder("e.g. DATABASE_URL").fill("API_KEY");
    await page.getByPlaceholder("Enter variable value").fill("sk-test-12345");
    await page.getByRole("button", { name: "Create", exact: true }).click();

    await expect(page.getByText("API_KEY")).toBeVisible({ timeout: 10000 });
    await expect(page.getByText("sk-test-12345")).toBeVisible();
  });

  test("creates a new env group via modal", async ({ page }) => {
    let currentGroups = JSON.parse(JSON.stringify(envGroups));

    await page.route(/\/api\/auth\/profile/, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ id: 1, email: "test@test.com", name: "Test User" }),
      });
    });
    await page.route(/\/api\/projects/, async (route) => {
      const url = route.request().url();
      if (url.endsWith("/projects/1") || url.includes("/projects/1?")) {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            id: 1, name: "Test Project", description: "A test project",
            createdAt: "2025-01-01T00:00:00Z", updatedAt: "2025-05-01T00:00:00Z",
            members: [{ userId: 1, role: "OWNER" }],
          }),
        });
      } else {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            data: [{ id: 1, name: "Test Project", description: "A test project", createdAt: "2025-01-01T00:00:00Z", updatedAt: "2025-05-01T00:00:00Z", role: "OWNER" }],
            meta: { total: 1, page: 1, limitPerPage: 9, totalPages: 1 },
          }),
        });
      }
    });
    await page.route(/\/api\/projects\/\d+\/env-groups/, async (route) => {
      if (route.request().method() === "POST") {
        const body = JSON.parse(route.request().postData() || "{}");
        const newGroup = {
          id: "group-new", name: body.name, projectId: 1,
          createdAt: "2025-06-01T00:00:00Z", updatedAt: "2025-06-01T00:00:00Z",
          variables: [],
        };
        currentGroups = [...currentGroups, newGroup];
        await route.fulfill({ status: 201, contentType: "application/json", body: JSON.stringify(newGroup) });
      } else {
        await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ data: currentGroups }) });
      }
    });

    await page.goto("/projects/1");
    await expect(page.getByText("Test Project").first()).toBeVisible({ timeout: 15000 });

    await page.getByRole("button", { name: "Create env group" }).click();
    await expect(page.getByRole("heading", { name: "Create Environment Group" })).toBeVisible();

    await page.getByPlaceholder("Enter group name").fill("Staging");
    await page.getByRole("button", { name: "Create", exact: true }).click();

    await expect(page.getByText("Create Environment Group")).not.toBeVisible();
    await expect(page.getByText("Staging")).toBeVisible({ timeout: 10000 });
  });

  test("edits an env group name", async ({ page }) => {
    let currentGroups = JSON.parse(JSON.stringify(envGroups));

    await page.route(/\/api\/auth\/profile/, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ id: 1, email: "test@test.com", name: "Test User" }),
      });
    });
    await page.route(/\/api\/projects/, async (route) => {
      const url = route.request().url();
      if (url.endsWith("/projects/1") || url.includes("/projects/1?")) {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            id: 1, name: "Test Project", description: "A test project",
            createdAt: "2025-01-01T00:00:00Z", updatedAt: "2025-05-01T00:00:00Z",
            members: [{ userId: 1, role: "OWNER" }],
          }),
        });
      } else {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            data: [{ id: 1, name: "Test Project", description: "A test project", createdAt: "2025-01-01T00:00:00Z", updatedAt: "2025-05-01T00:00:00Z", role: "OWNER" }],
            meta: { total: 1, page: 1, limitPerPage: 9, totalPages: 1 },
          }),
        });
      }
    });
    await page.route(/\/api\/projects\/\d+\/env-groups/, async (route) => {
      if (route.request().method() === "PATCH") {
        const body = JSON.parse(route.request().postData() || "{}");
        currentGroups = currentGroups.map((g: typeof currentGroups[0]) =>
          g.id === "group-1" ? { ...g, name: body.name } : g,
        );
        await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(currentGroups[0]) });
      } else {
        await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ data: currentGroups }) });
      }
    });

    await page.goto("/projects/1");
    await expect(page.getByText("Test Project").first()).toBeVisible({ timeout: 15000 });
    await expect(page.getByText("Development")).toBeVisible({ timeout: 10000 });

    await page.getByRole("button", { name: "Edit group" }).click();
    await expect(page.getByRole("heading", { name: "Edit Environment Group" })).toBeVisible();

    const nameInput = page.getByPlaceholder("Enter group name");
    await nameInput.clear();
    await nameInput.fill("Staging");
    await page.getByRole("button", { name: "Save", exact: true }).click();

    await expect(page.getByText("Edit Environment Group")).not.toBeVisible();
    await expect(page.getByText("Staging")).toBeVisible({ timeout: 10000 });
  });

  test("deletes an env group", async ({ page }) => {
    let currentGroups = JSON.parse(JSON.stringify(envGroups));

    await page.route(/\/api\/auth\/profile/, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ id: 1, email: "test@test.com", name: "Test User" }),
      });
    });
    await page.route(/\/api\/projects/, async (route) => {
      const url = route.request().url();
      if (url.endsWith("/projects/1") || url.includes("/projects/1?")) {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            id: 1, name: "Test Project", description: "A test project",
            createdAt: "2025-01-01T00:00:00Z", updatedAt: "2025-05-01T00:00:00Z",
            members: [{ userId: 1, role: "OWNER" }],
          }),
        });
      } else {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            data: [{ id: 1, name: "Test Project", description: "A test project", createdAt: "2025-01-01T00:00:00Z", updatedAt: "2025-05-01T00:00:00Z", role: "OWNER" }],
            meta: { total: 1, page: 1, limitPerPage: 9, totalPages: 1 },
          }),
        });
      }
    });
    await page.route(/\/api\/projects\/\d+\/env-groups/, async (route) => {
      if (route.request().method() === "DELETE") {
        currentGroups = [];
        await route.fulfill({ status: 204 });
      } else {
        await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ data: currentGroups }) });
      }
    });

    await page.goto("/projects/1");
    await expect(page.getByText("Test Project").first()).toBeVisible({ timeout: 15000 });
    await expect(page.getByText("Development")).toBeVisible({ timeout: 10000 });

    await page.getByRole("button", { name: "Delete group" }).click();
    await expect(page.getByRole("heading", { name: "Delete Environment Group" })).toBeVisible();

    await page.getByRole("button", { name: "Delete", exact: true }).click();

    await expect(page.getByText("No environment groups yet")).toBeVisible({ timeout: 10000 });
  });

  test("edits a variable via modal", async ({ page }) => {
    let currentGroups = JSON.parse(JSON.stringify(envGroups));

    await page.route(/\/api\/auth\/profile/, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ id: 1, email: "test@test.com", name: "Test User" }),
      });
    });
    await page.route(/\/api\/projects/, async (route) => {
      const url = route.request().url();
      if (url.endsWith("/projects/1") || url.includes("/projects/1?")) {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            id: 1, name: "Test Project", description: "A test project",
            createdAt: "2025-01-01T00:00:00Z", updatedAt: "2025-05-01T00:00:00Z",
            members: [{ userId: 1, role: "OWNER" }],
          }),
        });
      } else {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            data: [{ id: 1, name: "Test Project", description: "A test project", createdAt: "2025-01-01T00:00:00Z", updatedAt: "2025-05-01T00:00:00Z", role: "OWNER" }],
            meta: { total: 1, page: 1, limitPerPage: 9, totalPages: 1 },
          }),
        });
      }
    });
    await page.route(/\/api\/projects\/\d+\/env-groups/, async (route) => {
      await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ data: currentGroups }) });
    });
    await page.route(/\/api\/projects\/\d+\/env-groups\/[^/]+\/variables\/[^/]+/, async (route) => {
      if (route.request().method() === "PATCH") {
        const body = JSON.parse(route.request().postData() || "{}");
        currentGroups[0].variables[0] = { ...currentGroups[0].variables[0], key: body.key, value: body.value };
        await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(currentGroups[0].variables[0]) });
      } else {
        await route.fallback();
      }
    });

    await page.goto("/projects/1");
    await expect(page.getByText("Test Project").first()).toBeVisible({ timeout: 15000 });

    const accordionBtn = page.locator("button").filter({ hasText: "Development" });
    await expect(accordionBtn).toBeVisible({ timeout: 10000 });
    await accordionBtn.click();
    await expect(page.getByText("DATABASE_URL")).toBeVisible({ timeout: 5000 });

    await page.getByRole("button", { name: "Edit variable" }).click();
    await expect(page.getByRole("heading", { name: "Edit Variable" })).toBeVisible();

    const keyInput = page.getByPlaceholder("e.g. DATABASE_URL");
    await keyInput.clear();
    await keyInput.fill("DB_HOST");
    await page.getByRole("button", { name: "Save", exact: true }).click();

    await expect(page.getByText("Edit Variable")).not.toBeVisible();
    await expect(page.getByText("DB_HOST")).toBeVisible({ timeout: 10000 });
  });

  test("deletes a variable via confirmation modal", async ({ page }) => {
    let currentGroups = JSON.parse(JSON.stringify(envGroups));

    await page.route(/\/api\/auth\/profile/, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ id: 1, email: "test@test.com", name: "Test User" }),
      });
    });
    await page.route(/\/api\/projects/, async (route) => {
      const url = route.request().url();
      if (url.endsWith("/projects/1") || url.includes("/projects/1?")) {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            id: 1, name: "Test Project", description: "A test project",
            createdAt: "2025-01-01T00:00:00Z", updatedAt: "2025-05-01T00:00:00Z",
            members: [{ userId: 1, role: "OWNER" }],
          }),
        });
      } else {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            data: [{ id: 1, name: "Test Project", description: "A test project", createdAt: "2025-01-01T00:00:00Z", updatedAt: "2025-05-01T00:00:00Z", role: "OWNER" }],
            meta: { total: 1, page: 1, limitPerPage: 9, totalPages: 1 },
          }),
        });
      }
    });
    await page.route(/\/api\/projects\/\d+\/env-groups/, async (route) => {
      if (route.request().method() === "DELETE") {
        currentGroups[0].variables = [];
        await route.fulfill({ status: 204 });
      } else {
        await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ data: currentGroups }) });
      }
    });

    await page.goto("/projects/1");
    await expect(page.getByText("Test Project").first()).toBeVisible({ timeout: 15000 });

    const accordionBtn = page.locator("button").filter({ hasText: "Development" });
    await expect(accordionBtn).toBeVisible({ timeout: 10000 });
    await accordionBtn.click();
    await expect(page.getByText("DATABASE_URL")).toBeVisible({ timeout: 5000 });

    await page.getByRole("button", { name: "Delete variable" }).click();
    await expect(page.getByRole("heading", { name: "Delete Variable" })).toBeVisible();

    await page.getByRole("button", { name: "Delete", exact: true }).click();

    await expect(page.getByRole("cell", { name: "DATABASE_URL" })).not.toBeVisible();
  });
});
