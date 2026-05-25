import { test, expect } from "@playwright/test";

test.use({ storageState: "e2e/.auth/storageState.json" });

const mockProjectDetail = {
  id: 1,
  name: "Test Project",
  description: "A test project",
  createdAt: "2025-01-01T00:00:00Z",
  updatedAt: "2025-05-01T00:00:00Z",
  members: [
    { id: "m1", role: "OWNER", userId: 1, projectId: 1, createdAt: "2025-01-01T00:00:00Z", user: { id: 1, email: "owner@test.com", name: "Owner" } },
    { id: "m2", role: "EDITOR", userId: 2, projectId: 1, createdAt: "2025-01-01T00:00:00Z", user: { id: 2, email: "editor@test.com", name: "Editor" } },
  ],
};

const mockMembersPage1 = {
  data: [
    { id: "m2", role: "EDITOR", userId: 2, projectId: 1, createdAt: "2025-01-01T00:00:00Z", user: { id: 2, email: "editor@test.com", name: "Editor" } },
  ],
  meta: { total: 1, page: 1, limitPerPage: 10, totalPages: 1 },
};

const mockInvitations = {
  data: [
    { id: "i1", email: "invited@example.com", role: "VIEWER", status: "PENDING", createdAt: "2025-01-02T00:00:00Z", updatedAt: "2025-01-02T00:00:00Z" },
  ],
  meta: { total: 1, page: 1, limitPerPage: 10, totalPages: 1 },
};

test.describe("Project members", () => {
  test("invites a user to the project", async ({ page }) => {
    await page.route(/\/api\/auth\/profile/, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ id: 1, email: "owner@test.com", name: "Owner" }),
      });
    });
    await page.route(/\/api\/projects\/\d+/, async (route) => {
      await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(mockProjectDetail) });
    });
    await page.route(/\/api\/projects\/\d+\/members/, async (route) => {
      await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(mockMembersPage1) });
    });
    await page.route(/\/api\/projects\/\d+\/invitations/, async (route) => {
      if (route.request().method() === "POST") {
        await route.fulfill({ status: 201 });
      } else {
        await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(mockInvitations) });
      }
    });

    await page.goto("/projects/1/members");
    await expect(page.getByRole("heading", { name: "Members" })).toBeVisible({ timeout: 10000 });

    await page.getByRole("button", { name: "Invite user" }).click();
    await expect(page.getByRole("heading", { name: "Invite User" })).toBeVisible();

    await page.getByPlaceholder("Enter user email").fill("newuser@example.com");
    await page.getByRole("button", { name: /select a role/i }).click();
    await page.getByRole("list").getByText("Editor").click();
    await page.getByRole("button", { name: "Invite", exact: true }).click();

    await expect(page.getByRole("heading", { name: "Invite User" })).not.toBeVisible();
  });

  test("removes a member via confirmation modal", async ({ page }) => {
    let members = [...mockMembersPage1.data];

    await page.route(/\/api\/auth\/profile/, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ id: 1, email: "owner@test.com", name: "Owner" }),
      });
    });
    await page.route(/\/api\/projects\/\d+/, async (route) => {
      await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(mockProjectDetail) });
    });
    await page.route(/\/api\/projects\/\d+\/members/, async (route) => {
      if (route.request().method() === "DELETE") {
        members = [];
        await route.fulfill({ status: 204 });
      } else {
        await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ data: members, meta: { total: members.length, page: 1, limitPerPage: 10, totalPages: members.length > 0 ? 1 : 0 } }) });
      }
    });

    await page.goto("/projects/1/members");
    await expect(page.getByRole("cell", { name: "Editor", exact: true })).toBeVisible({ timeout: 10000 });

    await page.getByRole("button", { name: /remove/i }).click();
    await expect(page.getByRole("heading", { name: "Remove Member" })).toBeVisible();

    await page.getByRole("button", { name: "Remove", exact: true }).click();
    await expect(page.getByRole("cell", { name: "Editor", exact: true })).not.toBeVisible();
  });

  test("removes an invitation via confirmation modal", async ({ page }) => {
    let invitations = [...mockInvitations.data];

    await page.route(/\/api\/auth\/profile/, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ id: 1, email: "owner@test.com", name: "Owner" }),
      });
    });
    await page.route(/\/api\/projects\/\d+/, async (route) => {
      await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(mockProjectDetail) });
    });
    await page.route(/\/api\/projects\/\d+\/members/, async (route) => {
      await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(mockMembersPage1) });
    });
    await page.route(/\/api\/projects\/\d+\/invitations/, async (route) => {
      if (route.request().method() === "DELETE") {
        invitations = [];
        await route.fulfill({ status: 204 });
      } else {
        await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ data: invitations, meta: { total: invitations.length, page: 1, limitPerPage: 10, totalPages: 1 } }) });
      }
    });

    await page.goto("/projects/1/members");
    await expect(page.getByText("invited@example.com")).toBeVisible({ timeout: 10000 });

    await page.getByRole("button", { name: "Remove invitation" }).click();
    await expect(page.getByRole("heading", { name: "Remove Invitation" })).toBeVisible();

    await page.getByRole("button", { name: "Remove", exact: true }).click();
    await expect(page.getByRole("cell", { name: "invited@example.com" })).not.toBeVisible();
  });

  test("resends an invitation", async ({ page }) => {
    let resendCalled = false;

    await page.route(/\/api\/auth\/profile/, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ id: 1, email: "owner@test.com", name: "Owner" }),
      });
    });
    await page.route(/\/api\/projects\/\d+/, async (route) => {
      await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(mockProjectDetail) });
    });
    await page.route(/\/api\/projects\/\d+\/members/, async (route) => {
      await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(mockMembersPage1) });
    });
    await page.route(/\/api\/projects\/\d+\/invitations/, async (route) => {
      await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(mockInvitations) });
    });
    await page.route(/\/api\/projects\/\d+\/invitations\/[^/]+\/resend/, async (route) => {
      resendCalled = true;
      await route.fulfill({ status: 200 });
    });

    await page.goto("/projects/1/members");
    await expect(page.getByText("invited@example.com")).toBeVisible({ timeout: 10000 });

    await page.getByRole("button", { name: "Resend invitation" }).click();
    await expect(async () => {
      expect(resendCalled).toBe(true);
    }).toPass({ timeout: 5000 });
  });
});
