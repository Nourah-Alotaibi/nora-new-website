import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests",
  timeout: 45000,
  fullyParallel: false,
  workers: 1,
  reporter: [
    ["list"],
    ["html", { open: "never" }],
    ["json", { outputFile: "test-results/results.json" }],
  ],
  use: {
    baseURL: process.env.TEST_BASE_URL || "http://127.0.0.1:5173",
    channel: process.env.TEST_BROWSER || "msedge",
    headless: true,
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
    launchOptions: { args: ["--enable-webgl", "--ignore-gpu-blocklist"] },
  },
  webServer: process.env.TEST_BASE_URL
    ? undefined
    : {
        command: "npm run dev -- --port 5173",
        url: "http://127.0.0.1:5173",
        reuseExistingServer: true,
        timeout: 30000,
      },
});
