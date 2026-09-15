import { test, expect } from "@playwright/test";
for (const width of [390, 1440])
  test(`six rooms and floor navigation ${width}`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await page.locator(".loader").waitFor({ state: "hidden" });
    await page.getByRole("button", { name: "Wake robot", exact: true }).click();
    await page
      .getByRole("button", { name: "Enter laptop", exact: true })
      .click();
    const directory = page.getByRole("complementary", {
      name: "Campus directory",
    });
    await expect(directory).toBeVisible();
    await expect(
      page.getByRole("group", { name: "Choose room" }).getByRole("button"),
    ).toHaveCount(6);
    await page.getByRole("button", { name: "Downstairs", exact: true }).click();
    await expect(
      page.getByRole("button", { name: "Downstairs", exact: true }),
    ).toHaveAttribute("aria-pressed", "true");
    await page
      .getByRole("group", { name: "Choose room" })
      .getByRole("button", { name: /Academy X/ })
      .click();
    await expect(
      page
        .locator(".campus-programs")
        .getByRole("button", { name: /Academy X/ }),
    ).toBeVisible();
    await page
      .getByRole("button", { name: "Building overview", exact: true })
      .click();
    await page.locator(".toast").waitFor({state:"hidden"});
  await page.screenshot({
      path: `previews/six-room-phase1-${width}.png`,
      fullPage: true,
    });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBeTruthy();
  });
test("all six room mappings, return state and local model budgets", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  await page.locator(".loader").waitFor({ state: "hidden" });
  expect(
    await page.evaluate(() =>
      performance
        .getEntriesByType("resource")
        .some((r) => r.name.includes("/models/chair")),
    ),
  ).toBeFalsy();
  await page.getByRole("button", { name: "Wake robot", exact: true }).click();
  await page.getByRole("button", { name: "Enter laptop", exact: true }).click();
  const cases = [
    ["AI & App Studio", ["Agentic AI", "AI App Developer"]],
    ["Cybersecurity Lab", ["Cybersecurity"]],
    ["Data Science Lab", ["AI & Data Science"]],
    ["Youth Project Studio", ["Kuwait Codes", "UniCODE"]],
    ["Academy X Studio", ["Academy X"]],
    [
      "Juniors Discovery Lab",
      ["Holiday Camps", "Creative Workshops", "After School"],
    ],
  ] as const;
  for (const [room, expected] of cases) {
    await page
      .getByRole("group", { name: "Choose room" })
      .getByRole("button", { name: new RegExp(room.replace("&", "&")) })
      .click();
    for (const title of expected)
      await expect(
        page
          .locator(".campus-programs")
          .getByRole("button", { name: title, exact: false }),
      ).toBeVisible();
  }
  await page
    .getByRole("group", { name: "Choose room" })
    .getByRole("button", { name: /Academy X/ })
    .click();
  await page
    .locator(".campus-programs")
    .getByRole("button", { name: /Academy X/ })
    .click();
  await page.getByRole("button", { name: "Back to room", exact: true }).click();
  await expect(
    page
      .getByRole("group", { name: "Choose room" })
      .getByRole("button", { name: /Academy X/ }),
  ).toHaveAttribute("aria-pressed", "true");
  await page
    .getByRole("button", { name: "Building overview", exact: true })
    .click();
  await expect
    .poll(() =>
      page.locator("canvas").first().getAttribute("data-render-stats"),
    )
    .not.toBeNull();
  const stats = JSON.parse(
    (await page.locator("canvas").first().getAttribute("data-render-stats"))!,
  );
  console.log("CAMPUS_RENDER_STATS", stats);
  expect(stats.calls).toBeLessThan(600);
  expect(stats.triangles).toBeLessThan(400000);
  await page.locator(".toast").waitFor({state:"hidden"});
  await page.screenshot({
    path: "previews/six-room-desktop.png",
    fullPage: true,
  });
});
test("failed models keep navigation and offer retry", async ({ page }) => {
  await page.route("**/models/**", (route) => route.abort());
  await page.goto("/");
  await page.locator(".loader").waitFor({ state: "hidden" });
  await page.getByRole("button", { name: "Wake robot", exact: true }).click();
  await page.getByRole("button", { name: "Enter laptop", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Retry 3D assets" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Downstairs", exact: true }).click();
  await expect(
    page.getByRole("group", { name: "Choose room" }).getByRole("button"),
  ).toHaveCount(6);
});
test("duck text keeps native undo", async ({ page }) => {
  await page.goto("/");
  await page.locator(".loader").waitFor({ state: "hidden" });
  await page.getByRole("button", { name: "Interaction help" }).click();
  await page.getByRole("button", { name: "Talk to the duck" }).click();
  const notes = page.getByRole("textbox");
  await notes.pressSequentially("native undo");
  await notes.press("Control+z");
  await expect(notes).toHaveValue("");
});


