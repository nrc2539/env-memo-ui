import { test, expect } from "@playwright/test";

test.use({ storageState: undefined });

test.describe("Unauthenticated flows", () => {
  test("landing page loads at /", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("EnvMemo")).toBeVisible();
  });

  test("login page renders with email and password fields", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByRole("heading", { name: "Sign in to your account" })).toBeVisible();
    await expect(page.getByPlaceholder("Enter your email")).toBeVisible();
    await expect(page.getByPlaceholder("Enter your password")).toBeVisible();
  });

  test("invalid credentials show error", async ({ page }) => {
    await page.route("**/api/auth/login", async (route) => {
      await route.fulfill({
        status: 401,
        contentType: "application/json",
        body: JSON.stringify({ code: 401, message: "Unauthorized" }),
      });
    });

    await page.goto("/login");
    await page.getByPlaceholder("Enter your email").fill("wrong@test.com");
    await page.getByPlaceholder("Enter your password").fill("wrong-password");
    await page.getByRole("button", { name: "Sign in" }).click();

    await expect(page.getByText("Login failed")).toBeVisible({ timeout: 10000 });
    await expect(page).toHaveURL(/\/login/);
  });

  test("register page renders at /register", async ({ page }) => {
    await page.goto("/register");
    await expect(page.getByRole("heading", { name: "Create your account" })).toBeVisible();
    await expect(page.getByPlaceholder("Enter your name")).toBeVisible();
    await expect(page.getByPlaceholder("Enter your email")).toBeVisible();
    await expect(page.getByPlaceholder("Create a password")).toBeVisible();
    await expect(page.getByPlaceholder("Confirm your password")).toBeVisible();
  });

  test("forgot password page renders at /forgot-password", async ({ page }) => {
    await page.goto("/forgot-password");
    await expect(page.getByRole("heading", { name: "Forgot password?" })).toBeVisible();
    await expect(page.getByPlaceholder("Enter your email")).toBeVisible();
  });
});
