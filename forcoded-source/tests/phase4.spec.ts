import { test, expect } from "@playwright/test";
for (const width of [390, 1280])
  test(`campus hub, project portals, builder wall and company path at ${width}`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await page.locator(".loader").waitFor({ state: "hidden" });
    await page
      .getByRole("button", { name: "Wake laptop", exact: true })
      .click();
    await page
      .getByRole("button", { name: "Enter laptop", exact: true })
      .click();
    await page
      .locator(".campus-extras")
      .getByRole("button", { name: "Demo stage", exact: true })
      .click();
    await expect(
      page
        .getByRole("dialog")
        .getByRole("heading", { name: "You learn by building." }),
    ).toBeVisible();
    await page
      .getByRole("group", { name: "Shared campus areas" })
      .getByRole("button", { name: "Project portals", exact: true })
      .click();
    await expect(page.locator(".project-portals>button")).toHaveCount(8);
    await page
      .getByRole("group", { name: "Shared campus areas" })
      .getByRole("button", { name: "Wall of builders", exact: true })
      .click();
    await expect(page.locator(".builder-wall>button")).toHaveCount(8);
    await page
      .locator(".builder-wall")
      .getByRole("button", { name: /Agentic AI/ })
      .click();
    await expect(
      page.getByRole("button", { name: "Connect DATA", exact: true }),
    ).toBeVisible();
    if (width < 700)
      await page.getByRole("button", { name: "Open menu" }).click();
    await page
      .getByRole("button", { name: "Find my path", exact: false })
      .filter({ visible: true })
      .click();
    await page.getByRole("button", { name: "Company", exact: true }).click();
    await page.getByRole("button", { name: "Automation", exact: true }).click();
    await page.getByRole("button", { name: "Show me the way" }).click();
    await expect(
      page.getByRole("link", { name: "Talk to CODED" }),
    ).toHaveAttribute("href", "https://coded.kw/companies");
    await page.keyboard.press("Escape");
    if (width < 700)
      await page.getByRole("button", { name: "Open menu" }).click();
    await page
      .getByRole("button", { name: "Apply", exact: true })
      .filter({ visible: true })
      .click();
    await expect(page.getByRole("dialog")).toContainText(
      "Your next chapter starts here.",
    );
    await expect(page.getByRole("dialog")).not.toContainText(/\d+\s?KD/);
  });
