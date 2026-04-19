import { test, expect } from "@playwright/test";

test("a bejelentkezési oldalon megjelenik az email és jelszó mező", async ({
  page,
}) => {
  await page.goto("http://localhost:3000/login");

  await expect(page).toHaveTitle(/Main page/i);
  await expect(
    page.locator('input[type="email"], input[name="email"]'),
  ).toBeVisible();
  await expect(page.locator('input[type="password"]')).toBeVisible();
});

test("a regisztrációs oldal sikeresen betöltődik", async ({ page }) => {
  await page.goto("http://localhost:3000/register");

  await expect(page).not.toHaveURL(/error/);
  await expect(page.locator("body")).toBeVisible();
});

test("a tanár főoldala megfelelően betöltődik", async ({ page }) => {
  await page.goto("http://localhost:3000/login");
  await page
    .locator('input[type="email"], input[name="email"]')
    .fill("matzika@fmail.hu");
  await page.locator('input[type="password"]').fill("yuiUIOL25.");
  await page.locator('button[type="submit"]').click();

  await page.waitForURL(/home/, { timeout: 10000 });

  await expect(page).toHaveURL(/home/);
  await expect(page.locator("body")).toBeVisible();
});

test("a diák főoldala megfelelően betöltődik", async ({ page }) => {
  await page.goto("http://localhost:3000/login");
  await page
    .locator('input[type="email"], input[name="email"]')
    .fill("roland.fulop@gmail.com");
  await page.locator('input[type="password"]').fill("wert1258RT.");
  await page.locator('button[type="submit"]').click();

  await page.waitForURL(/home/, { timeout: 10000 });

  await expect(page).toHaveURL(/home/);
  await expect(page.locator("body")).toBeVisible();
});
