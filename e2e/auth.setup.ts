import { test as setup } from "@playwright/test";

const authFile = "e2e/.auth/storageState.json";

setup("authenticate", async ({ page }) => {
  await page.route("**/api/auth/login", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        accessToken: "fake-access-token",
        refreshToken: "fake-refresh-token",
      }),
    });
  });

  await page.route("**/api/auth/profile", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        id: 1,
        email: "test@test.com",
        name: "Test User",
      }),
    });
  });

  await page.goto("/login");
  await page.fill("input[name=\"email\"]", "test@test.com");
  await page.fill("input[name=\"password\"]", "test-password");
  await page.click("button[type=\"submit\"]");

  await page.waitForURL(/\/projects/);
  await page.context().storageState({ path: authFile });
});
