import { test, expect } from "@playwright/test";
async function open(page, name) {
  await page
    .getByRole("button", { name: "Skip exploration", exact: true })
    .click();
  await page
    .getByRole("dialog")
    .getByRole("button", { name: new RegExp("^" + name) })
    .click();
}
for (const width of [390, 1280])
  test(`phase three: app, ML, project debugging and pitch at ${width}`, async ({
    page,
  }) => {
    test.setTimeout(65000);
    await page.setViewportSize({ width, height: 900 });
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto("/");
    await page.locator(".loader").waitFor({ state: "hidden" });
    await open(page, "AI App Developer");
    await expect(
      page.getByRole("button", { name: "Ship it", exact: true }),
    ).toBeDisabled();
    await page.getByRole("button", { name: "UI A usable interface" }).click();
    await page
      .getByRole("textbox", { name: "New task" })
      .fill("Test the prototype");
    await page.getByRole("button", { name: "Add task", exact: true }).click();
    await expect(page.locator(".incident-log")).toContainText("needs an API");
    for (const f of [
      "API Read and write tasks",
      "DATABASE Remember your work",
      "AUTH Protect the workspace",
      "ANALYTICS Understand activity",
    ])
      await page.getByRole("button", { name: f, exact: true }).click();
    await page.getByRole("button", { name: "Enter as demo user" }).click();
    await page.getByRole("button", { name: "Add task", exact: true }).click();
    await expect(page.locator(".demo-tasks")).toContainText(
      "Test the prototype",
    );
    await page
      .getByRole("button", { name: "Delete Test the prototype", exact: true })
      .click();
    await expect(page.locator(".demo-tasks")).not.toContainText(
      "Test the prototype",
    );
    await page.getByRole("button", { name: "Ship it", exact: true }).click();
    await expect(page.locator(".achievement")).toContainText("SHIPPED");
    await open(page, "AI & Data Science");
    await expect(
      page.getByRole("button", { name: "Train model", exact: true }),
    ).toBeDisabled();
    await expect(page.locator(".data-table tbody tr")).toHaveCount(10);
    await page.getByRole("button", { name: "Clean data" }).click();
    await expect(page.locator(".data-table tbody tr")).toHaveCount(8);
    await page
      .getByRole("button", { name: "Train model", exact: true })
      .click();
    await expect(page.locator(".incident-log")).toContainText("0.37");
    await page
      .getByRole("button", { name: "Deploy model", exact: true })
      .click();
    await expect(page.locator(".prediction strong")).toHaveText("40.4");
    await page.getByRole("slider").press("End");
    await expect(page.locator(".prediction strong")).toHaveText("71.3");
    await page
      .getByRole("button", { name: "Mean baseline", exact: true })
      .click();
    await expect(
      page.getByRole("button", { name: "Deploy model", exact: true }),
    ).toBeDisabled();
    await page
      .getByRole("button", { name: "Train model", exact: true })
      .click();
    await expect(page.locator(".incident-log")).toContainText("31.00");
    await open(page, "UniCODE");
    await page.getByRole("button", { name: "Run tests", exact: true }).click();
    await expect(page.locator(".incident-log")).toContainText("FAIL");
    await page
      .getByRole("combobox", { name: "FIX THE COMPARISON" })
      .selectOption(">=");
    await page.getByRole("button", { name: "Run tests", exact: true }).click();
    await expect(page.locator(".incident-log")).toContainText("PASS");
    await page.getByRole("button", { name: "Commit project" }).click();
    await page.getByRole("button", { name: "Deploy demo" }).click();
    await expect(page.locator(".achievement")).toContainText(
      "SOMETHING YOU CAN SHOW",
    );
    await open(page, "Academy X");
    await page
      .getByRole("textbox", { name: "PROJECT NAME", exact: true })
      .fill("Campus Swap");
    await page.getByRole("button", { name: "Pitch it", exact: true }).click();
    await expect(page.locator(".pitch-script")).toContainText("Campus Swap");
    await expect(page.locator(".program-panel")).toContainText("Girls only");
    await expect(page.locator(".program-panel")).toContainText("FREE");
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBeTruthy();
    await page.screenshot({
      path: `test-results/academy-${width}.png`,
      fullPage: true,
    });
    expect(errors).toEqual([]);
  });
