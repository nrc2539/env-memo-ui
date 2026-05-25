import { test, expect } from "@playwright/test";

test.describe("Password reset & setup flows", () => {
  test("reset password form renders and submits successfully", async ({ page }) => {
    await page.route(/\/api\/auth\/verify-token/, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ id: 1, email: "test@example.com", name: "Test User" }),
      });
    });

    await page.route(/\/api\/auth\/reset-password/, async (route) => {
      await route.fulfill({ status: 200 });
    });

    await page.goto("/reset-password?token=valid");

    await expect(page.getByPlaceholder("Enter new password")).toBeVisible({ timeout: 10000 });
    await expect(page.getByPlaceholder("Confirm new password")).toBeVisible();

    await page.getByPlaceholder("Enter new password").fill("NewPass1234!");
    await page.getByPlaceholder("Confirm new password").fill("NewPass1234!");
    await page.getByRole("button", { name: /reset password/i }).click();

    await expect(page.getByText("Password reset successful")).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole("link", { name: /back to sign in/i })).toBeVisible();
  });

  test("reset password shows invalid link without token", async ({ page }) => {
    await page.goto("/reset-password");
    await expect(page.getByText("Invalid or expired link")).toBeVisible();
    await expect(page.getByRole("link", { name: /request new reset link/i })).toBeVisible();
  });

  test("setup password form renders prefilled values and submits successfully", async ({ page }) => {
    await page.route(/\/api\/auth\/verify-token/, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ id: 1, email: "invited@example.com", name: "Invited User" }),
      });
    });

    await page.route(/\/api\/auth\/setup-password/, async (route) => {
      await route.fulfill({ status: 200 });
    });

    await page.goto("/setup-password?token=valid");

    await expect(page.locator('input[name="name"]')).toHaveValue("Invited User", { timeout: 10000 });
    await expect(page.locator('input[name="email"]')).toHaveValue("invited@example.com");
    await expect(page.getByPlaceholder("Create a password")).toBeVisible();
    await expect(page.getByPlaceholder("Confirm your password")).toBeVisible();

    await page.getByPlaceholder("Create a password").fill("StrongPass12!");
    await page.getByPlaceholder("Confirm your password").fill("StrongPass12!");
    await page.getByRole("button", { name: /set up password/i }).click();

    await expect(page.getByText("Password set up successfully")).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole("link", { name: /back to sign in/i })).toBeVisible();
  });

  test("setup password shows invalid link with bad token", async ({ page }) => {
    await page.route(/\/api\/auth\/verify-token/, async (route) => {
      await route.fulfill({
        status: 400,
        contentType: "application/json",
        body: JSON.stringify({ message: "Invalid token" }),
      });
    });

    await page.goto("/setup-password?token=bad");
    await expect(page.getByText("Invalid link")).toBeVisible({ timeout: 10000 });
  });
});
