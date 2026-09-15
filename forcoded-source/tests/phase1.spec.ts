import { test, expect } from "@playwright/test";
async function load(page) {
  await page.goto("/");
  await expect(page.locator(".loader")).toBeHidden({ timeout: 25000 });
}
async function openAI(page) {
  await page
    .getByRole("button", { name: "Skip exploration", exact: true })
    .click();
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Agentic AI" })
    .click();
  await expect(
    page.getByRole("button", { name: "Connect DATA", exact: true }),
  ).toBeVisible();
}
async function connectAll(page) {
  for (const n of ["DATA", "AGENT", "TOOLS", "MEMORY", "APPROVAL", "ACTION"])
    await page
      .getByRole("button", { name: `Connect ${n}`, exact: true })
      .click();
}
test("complete vertical slice with real approval and persistent passport", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await load(page);
  await page.getByRole("button", { name: "Drink coffee", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("A little coffee");
  await page.getByRole("button", { name: "Pour coffee", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("Freshly poured");
  await page.getByRole("button", { name: "Wake robot", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Enter laptop", exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Enter laptop", exact: true }).click();
  await expect(
    page.getByRole("group", { name: "Choose audience" }),
  ).toBeVisible();
  await page
    .locator(".room-programs")
    .getByRole("button", { name: "Agentic AI" })
    .click();
  await expect(
    page.getByRole("button", { name: "Delegate", exact: true }),
  ).toBeDisabled();
  await page
    .getByRole("button", { name: "Connect ACTION", exact: true })
    .click();
  await expect(
    page.getByRole("status").filter({ hasText: "Connect DATA first" }),
  ).toBeVisible();
  await connectAll(page);
  await page.getByRole("button", { name: "Delegate", exact: true }).click();
  await expect(
    page.getByRole("region", { name: "Human approval" }),
  ).toBeVisible();
  await expect(page.locator(".achievement")).toHaveCount(0);
  await page.getByRole("button", { name: "Approve all", exact: true }).click();
  await expect(page.locator(".achievement")).toContainText("445 demo credits");
  await expect(
    page.getByRole("link", { name: "Apply at CODED" }),
  ).toHaveAttribute("href", "https://coded.kw/bootcamps/agentic-ai");
  await page
    .getByRole("button", { name: "Back to room", exact: true })
    .click();
  await expect(
    page.getByRole("group", { name: "Choose audience" }),
  ).toBeVisible();
  await page.getByRole("button", { name: /Passport/ }).click();
  await expect(page.getByRole("dialog").locator(".stamp.earned")).toHaveCount(
    1,
  );
  await page.getByRole("button", { name: "Close dialog" }).click();
  await page.reload();
  await expect(page.locator(".passport-button b")).toHaveText("1");
  expect(errors).toEqual([]);
});
test("hold path processes only approved invoices; reset cancels execution", async ({
  page,
}) => {
  await load(page);
  await openAI(page);
  await connectAll(page);
  await page.getByRole("button", { name: "Delegate", exact: true }).click();
  await page.getByRole("button", { name: "Reset workflow" }).click();
  await expect(
    page.getByRole("region", { name: "Human approval" }),
  ).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "Delegate", exact: true }),
  ).toBeDisabled();
  await connectAll(page);
  await page.getByRole("button", { name: "Delegate", exact: true }).click();
  await page
    .getByRole("button", { name: "Hold new supplier", exact: true })
    .click();
  await expect(page.locator(".achievement")).toContainText("205 demo credits");
});
test("reduced motion, malformed storage, keyboard dialogs and matcher", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript(() =>
    localStorage.setItem("coded-passport", '{"invalid":true}'),
  );
  await load(page);
  await expect(page.locator(".app")).toHaveClass(/reduced-motion/);
  await page
    .getByRole("button", { name: "Find my path", exact: false })
    .first()
    .click();
  await page.getByRole("button", { name: "Professional", exact: true }).click();
  await page
    .getByRole("button", { name: "Cybersecurity", exact: true })
    .click();
  await page.getByRole("button", { name: "Show me the way" }).click();
  await expect(page.locator(".room-programs .matched")).toHaveText(
    /Cybersecurity/,
  );
  await page.getByRole("button", { name: /Passport/ }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page
    .getByRole("button", { name: "Back to the desk", exact: true })
    .click();
  await page.getByRole("button", { name: "Wake laptop", exact: true }).click();
  await page.getByRole("button", { name: "Enter laptop", exact: true }).click();
  await expect(page.locator(".portal")).toHaveCount(0);
});
for (const width of [320, 375, 390, 430, 768, 1024, 1440, 1920, 2560])
  test(`responsive layout and interaction at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: width < 700 ? 844 : 1000 });
    await load(page);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBeTruthy();
    await page.screenshot({ path: `test-results/desk-${width}.png` });
    await page
      .getByRole("button", { name: "Wake laptop", exact: true })
      .click();
    await page
      .getByRole("button", { name: "Enter laptop", exact: true })
      .click();
    await expect(
      page.getByRole("group", { name: "Choose audience" }),
    ).toBeVisible();
    for (const audience of ["Youth", "Juniors", "Professionals"])
      await page
        .getByRole("group", { name: "Choose audience" })
        .getByRole("button", { name: new RegExp(audience) })
        .click();
    await page
      .locator(".room-programs")
      .getByRole("button", { name: "Agentic AI" })
      .click();
    await connectAll(page);
    await expect(
      page.getByRole("button", { name: "Delegate", exact: true }),
    ).toBeEnabled();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBeTruthy();
    await page.screenshot({
      path: `test-results/agent-${width}.png`,
      fullPage: true,
    });
  });
