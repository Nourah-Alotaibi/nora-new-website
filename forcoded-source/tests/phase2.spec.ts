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
  test(`phase two: cyber, all youth tracks and junior game at ${width}`, async ({
    page,
  }) => {
    test.setTimeout(65000);
    await page.setViewportSize({ width, height: 900 });
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto("/");
    await page.locator(".loader").waitFor({ state: "hidden" });
    await open(page, "Cybersecurity");
    await page
      .getByRole("button", { name: "Inspect Workstation", exact: true })
      .click();
    await page.getByRole("button", { name: "Isolate", exact: true }).click();
    await expect(page.locator(".incident-log")).toContainText(
      "no confirmed incident",
    );
    await page
      .getByRole("button", { name: "Inspect Database", exact: true })
      .click();
    await expect(page.locator(".incident-log")).toContainText("87 failed");
    await page.getByRole("button", { name: "Block", exact: true }).click();
    await expect(page.locator(".incident-log")).toContainText("Investigate");
    await page
      .getByRole("button", { name: "Investigate", exact: true })
      .click();
    await page.getByRole("button", { name: "Block", exact: true }).click();
    await page.getByRole("button", { name: "Isolate", exact: true }).click();
    await expect(page.locator(".achievement")).toContainText(
      "THREAT CONTAINED",
    );
    await open(page, "Kuwait Codes");
    await page.getByRole("button", { name: "Run Python", exact: true }).click();
    await expect(page.locator(".incident-log")).toContainText("Not quite");
    for (const b of ["light = sense_light()", "if light < 30:", "turn_on()"])
      await page.getByRole("button", { name: b, exact: true }).click();
    await page.getByRole("button", { name: "Run Python", exact: true }).click();
    await expect(page.locator(".incident-log")).toContainText(
      "smart light is on",
    );
    await page.getByRole("slider").press("End");
    await page.getByRole("button", { name: "Run Python", exact: true }).click();
    await expect(page.locator(".incident-log")).toContainText("stays off");
    await page
      .getByRole("group", { name: "Kuwait Codes tracks" })
      .getByRole("button", { name: "Web with AI", exact: true })
      .click();
    await expect(
      page.getByRole("button", { name: "Ship site" }),
    ).toBeDisabled();
    for (const b of ["Layout", "Content", "Interaction"])
      await page.getByRole("button", { name: b, exact: true }).click();
    await page.getByRole("button", { name: "Say hello" }).click();
    await expect(
      page.getByRole("button", { name: "Say hello (1)" }),
    ).toBeVisible();
    await page.getByRole("button", { name: "Ship site" }).click();
    await expect(page.locator(".achievement")).toContainText("SITE SHIPPED");
    await page
      .getByRole("group", { name: "Kuwait Codes tracks" })
      .getByRole("button", { name: "Cybersecurity", exact: true })
      .click();
    await page
      .getByRole("button", { name: "Send the password", exact: true })
      .click();
    await expect(page.locator(".incident-log")).toContainText("Look again");
    await page
      .getByRole("button", { name: "Report phishing", exact: true })
      .click();
    await expect(page.locator(".incident-log")).toContainText("Flag captured");
    await open(page, "Holiday Camps");
    await page.getByRole("button", { name: "Queue up", exact: true }).click();
    await page
      .getByRole("button", { name: "Queue right", exact: true })
      .click();
    await page.getByRole("button", { name: "Run robot" }).click();
    await expect(page.locator(".incident-log")).toContainText("Oops");
    await page.getByRole("button", { name: "Reset robot" }).click();
    for (const c of ["up", "up", "right", "right", "right"])
      await page
        .getByRole("button", { name: `Queue ${c}`, exact: true })
        .click();
    await page.getByRole("button", { name: "Run robot" }).click();
    await expect(page.locator(".incident-log")).toContainText("You did it");
    await page.getByRole("button", { name: /Passport/ }).click();
    await expect(page.locator(".stamp.earned")).toHaveCount(3);
    expect(errors).toEqual([]);
  });
