import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
test("accessibility: desk, practical navigation and AI lab", async ({
  page,
}) => {
  await page.goto("/");
  await page.locator(".loader").waitFor({ state: "hidden" });
  const result = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  console.log(
    JSON.stringify(
      result.violations.map((v) => ({
        id: v.id,
        impact: v.impact,
        nodes: v.nodes.map((n) => ({
          target: n.target,
          summary: n.failureSummary,
        })),
      })),
      null,
      2,
    ),
  );
  expect(result.violations).toEqual([]);
  await page
    .getByRole("button", { name: "Skip exploration", exact: true })
    .click();
  const modal = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(modal.violations).toEqual([]);
  await page
    .getByRole("dialog")
    .getByRole("button", { name: /^Agentic AI/ })
    .click();
  const lab = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  console.log(
    JSON.stringify(
      lab.violations.map((v) => ({
        id: v.id,
        nodes: v.nodes.map((n) => ({
          target: n.target,
          summary: n.failureSummary,
        })),
      })),
      null,
      2,
    ),
  );
  expect(lab.violations).toEqual([]);
});

for (const name of [
  "Cybersecurity",
  "Kuwait Codes",
  "Holiday Camps",
  "AI App Developer",
  "AI & Data Science",
  "UniCODE",
  "Academy X",
])
  test(`accessibility: ${name}`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 900 });
    await page.goto("/");
    await page
      .getByRole("button", { name: "Skip exploration", exact: true })
      .waitFor();
    await page.locator(".loader").waitFor({ state: "hidden" });
    await page
      .getByRole("button", { name: "Skip exploration", exact: true })
      .click();
    await page
      .getByRole("dialog")
      .getByRole("button", { name: new RegExp("^" + name) })
      .click();
    await page.locator(".lab").waitFor({ state: "visible" });
    const report = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    console.log(
      name,
      JSON.stringify(
        report.violations.map((v) => ({
          id: v.id,
          nodes: v.nodes.map((n) => n.target),
        })),
      ),
    );
    expect(report.violations).toEqual([]);
  });
