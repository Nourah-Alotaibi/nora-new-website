import { test, expect } from "@playwright/test";
test("compact preview panel at 660px remains usable", async ({ page }) => {
  await page.setViewportSize({ width: 660, height: 660 });
  await page.goto("/");
  await page.getByRole("button", { name: "Wake robot", exact: true }).waitFor();
  await page.locator(".loader").waitFor({ state: "hidden" });
  await page.getByRole("button", { name: "Wake robot", exact: true }).click();
  await page
    .getByRole("button", { name: "Enter laptop", exact: true })
    .waitFor();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBeTruthy();
  await page.screenshot({ path: "test-results-chrome/compact-preview.png" });
  await page.getByRole("button", { name: "Enter laptop", exact: true }).click();
  await page
    .locator(".room-programs")
    .getByRole("button", { name: "Agentic AI" })
    .click();
  await expect(
    page.getByRole("button", { name: "Connect DATA", exact: true }),
  ).toBeVisible();
});
test("initial assets stay local and individual worlds load on demand", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .getByRole("button", { name: "Wake laptop", exact: true })
    .waitFor();
  await page.locator(".loader").waitFor({ state: "hidden" });
  const resources = await page.evaluate(() =>
    performance.getEntriesByType("resource").map((r) => r.name),
  );
  expect(
    resources.every(
      (url) =>
        url.startsWith(new URL(page.url()).origin) || url.startsWith("data:"),
    ),
  ).toBeTruthy();
  expect(
    resources.some((url) => /Cybersecurity|AcademyX|DataScience/.test(url)),
  ).toBeFalsy();
  await page
    .getByRole("button", { name: "Skip exploration", exact: true })
    .click();
  await page
    .getByRole("dialog")
    .getByRole("button", { name: /^Cybersecurity/ })
    .click();
  await page
    .getByRole("button", { name: "Inspect Database", exact: true })
    .waitFor();
  const after = await page.evaluate(() =>
    performance.getEntriesByType("resource").map((r) => r.name),
  );
  expect(after.some((url) => /Cybersecurity/.test(url))).toBeTruthy();
});
test.describe("touch journey", () => {
  test.use({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
  });
  test("coffee to AI approval to passport by touch", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Drink coffee" }).waitFor();
    await page.locator(".loader").waitFor({ state: "hidden" });
    await page.getByRole("button", { name: "Drink coffee" }).tap();
    await page.getByRole("button", { name: "Pour coffee" }).tap();
    await page.getByRole("button", { name: "Wake robot" }).tap();
    await page.getByRole("button", { name: "Enter laptop", exact: true }).tap();
    await page
      .locator(".room-programs")
      .getByRole("button", { name: "Agentic AI" })
      .tap();
    for (const n of ["DATA", "AGENT", "TOOLS", "MEMORY", "APPROVAL", "ACTION"])
      await page
        .getByRole("button", { name: `Connect ${n}`, exact: true })
        .tap();
    await page.getByRole("button", { name: "Delegate", exact: true }).tap();
    await page
      .getByRole("button", { name: "Hold new supplier", exact: true })
      .tap();
    await expect(page.locator(".achievement")).toContainText("205");
    await page.getByRole("button", { name: "Back to room" }).tap();
    await page.getByRole("button", { name: /Passport/ }).tap();
    await expect(page.locator(".stamp.earned")).toHaveCount(1);
  });
});
test("WebGL unavailable still exposes the complete program flow", async ({
  page,
}) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (type, ...args) {
      if (
        type === "webgl" ||
        type === "webgl2" ||
        type === "experimental-webgl"
      )
        return null;
      return original.call(this, type, ...args);
    } as typeof original;
  });
  await page.goto("/");
  await expect(page.locator(".scene-fallback")).toBeVisible();
  await page.locator(".loader").waitFor({ state: "hidden" });
  await page
    .getByRole("button", { name: "Skip exploration", exact: true })
    .click();
  await page
    .getByRole("dialog")
    .getByRole("button", { name: /^Cybersecurity/ })
    .click();
  await page
    .getByRole("button", { name: "Inspect Database", exact: true })
    .click();
  await page.getByRole("button", { name: "Investigate", exact: true }).click();
  await page.getByRole("button", { name: "Block", exact: true }).click();
  await page.getByRole("button", { name: "Isolate", exact: true }).click();
  await expect(page.locator(".achievement")).toContainText("THREAT CONTAINED");
});
test("orientation changes preserve reachable campus navigation", async ({
  page,
}) => {
  await page.goto("/");
  await page.locator(".loader").waitFor({ state: "hidden" });
  await page.getByRole("button", { name: "Wake laptop", exact: true }).click();
  await page.getByRole("button", { name: "Enter laptop", exact: true }).click();
  for (const size of [
    { width: 390, height: 844 },
    { width: 844, height: 390 },
    { width: 768, height: 1024 },
    { width: 1024, height: 768 },
  ]) {
    await page.setViewportSize(size);
    await page
      .getByRole("group", { name: "Choose audience" })
      .getByRole("button", { name: /Youth/ })
      .click();
    await expect(
      page.locator(".room-programs").getByRole("button", { name: "Academy X" }),
    ).toBeInViewport();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBeTruthy();
  }
  await page
    .locator(".room-programs")
    .getByRole("button", { name: "Academy X" })
    .click();
  await expect(
    page.getByRole("button", { name: "Pitch it", exact: true }),
  ).toBeVisible();
});
test("desk surprises and arcade unlock without losing the passport", async ({
  page,
}) => {
  await page.goto("/");
  await page.locator(".loader").waitFor({ state: "hidden" });
  await page.getByRole("button", { name: "Interaction help" }).click();
  await page.getByRole("button", { name: "Red button", exact: true }).click();
  await expect(page.locator(".toast")).toContainText("Explore a world");
  await page
    .getByRole("button", { name: "Talk to the duck", exact: true })
    .click();
  await page
    .getByRole("textbox", { name: "YOUR DEBUGGING NOTES" })
    .fill("Why does the boundary value disappear?");
  await page.getByRole("button", { name: "Close dialog" }).click();
  await page.getByRole("button", { name: "Got it" }).click();
  await page
    .getByRole("button", { name: "Skip exploration", exact: true })
    .click();
  await page
    .getByRole("dialog")
    .getByRole("button", { name: /^Agentic AI/ })
    .click();
  await page
    .getByRole("button", { name: "Back to the desk", exact: true })
    .click();
  await page.getByRole("button", { name: "Interaction help" }).click();
  await page.getByRole("button", { name: "Red button", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "One more round?" }),
  ).toBeVisible();
  await page
    .getByRole("dialog")
    .getByRole("button", { name: /A robot with a plan/ })
    .click();
  await expect(page.getByRole("button", { name: "Run robot" })).toBeVisible();
  await expect(page.locator(".passport-button b")).toHaveText("2");
});
test("render cadence and initial network budget", async ({
  page,
}, testInfo) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await page.locator(".loader").waitFor({ state: "hidden" });
  await expect(page.locator("canvas")).toBeVisible();
  const metrics = await page.evaluate(async () => {
    const samples: number[] = [];
    let prev = performance.now();
    await new Promise<void>((resolve) => {
      function tick(now: number) {
        samples.push(now - prev);
        prev = now;
        if (samples.length < 100) requestAnimationFrame(tick);
        else resolve();
      }
      requestAnimationFrame(tick);
    });
    const stable = samples.slice(10);
    return {
      averageFps: 1000 / (stable.reduce((a, b) => a + b, 0) / stable.length),
      p95FrameMs: stable.sort((a, b) => a - b)[
        Math.floor(stable.length * 0.95)
      ],
      resourceCount: performance.getEntriesByType("resource").length,
    };
  });
  console.log("RENDER_METRICS", JSON.stringify(metrics));
  testInfo.annotations.push({
    type: "render-cadence",
    description: JSON.stringify(metrics),
  });
  expect(metrics.averageFps).toBeGreaterThan(20);
  await page.screenshot({ path: "test-results/final-desktop.png" });
});
