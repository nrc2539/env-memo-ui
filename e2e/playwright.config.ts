import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: ".",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: "html",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "setup",
      testMatch: /.*\.setup\.ts/,
      use: { ...devices["Desktop Chrome"], headless: true },
    },
    {
      name: "unauthenticated",
      testMatch: /(auth|password-reset)\.spec\.ts/,
      use: { ...devices["Desktop Chrome"], headless: true },
      dependencies: [],
    },
    {
      name: "chromium",
      testMatch: /(projects|env-variables)\.spec\.ts/,
      use: {
        ...devices["Desktop Chrome"],
        headless: true,
        storageState: "e2e/.auth/storageState.json",
      },
      dependencies: ["setup"],
    },
  ],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});
