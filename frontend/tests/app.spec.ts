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

test("a főoldal átirányítja a nem authentikált felhasználókat", async ({
  page,
}) => {
  await page.goto("http://localhost:3000/home");

  await page.waitForURL(/login|register|\/$/, { timeout: 5000 });
  await expect(page).not.toHaveURL("/home");
});

test("a tanár főoldala megfelelően betöltődik", async ({ page }) => {
  await page.goto("http://localhost:3000/login");
  await page
    .locator('input[type="email"], input[name="email"]')
    .pressSequentially("janos.kovacs@szkola.hu");
  await page.locator('input[type="password"]').pressSequentially("SzkoLa123!");

  await expect(page.locator('button[type="submit"]')).toBeEnabled({
    timeout: 5000,
  });
  await page.locator('button[type="submit"]').click();

  await page.waitForURL(/home/, { timeout: 10000 });
  await expect(page).toHaveURL(/home/);
  await expect(page.locator("body")).toBeVisible();
});

test("a diák főoldala megfelelően betöltődik", async ({ page }) => {
  await page.goto("http://localhost:3000/login");
  await page
    .locator('input[type="email"], input[name="email"]')
    .pressSequentially("adam.lazar@szkola.hu");
  await page
    .locator('input[type="password"]')
    .pressSequentially("SzkoLaDiak1!");

  await expect(page.locator('button[type="submit"]')).toBeEnabled({
    timeout: 5000,
  });
  await page.locator('button[type="submit"]').click();

  await page.waitForURL(/home/, { timeout: 10000 });
  await expect(page).toHaveURL(/home/);
  await expect(page.locator("body")).toBeVisible();
});
