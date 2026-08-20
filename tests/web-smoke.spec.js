const { test, expect } = require('@playwright/test');

const url = 'http://127.0.0.1:4173/index.html';

test('web game starts and renders a hand', async ({ page }) => {
  const errors = [];
  page.on('pageerror', e => errors.push(String(e)));
  await page.goto(url);
  await expect(page.locator('h1')).toContainText('经典斗地主');
  await page.locator('#start').click();
  const count = await page.locator('#hand .card').count();
  expect([17, 20]).toContain(count);
  await expect(page.locator('#status')).not.toHaveText('准备开始');
  expect(errors).toEqual([]);
});

test('controls respond without browser errors', async ({ page }) => {
  const errors = [];
  page.on('pageerror', e => errors.push(String(e)));
  await page.goto(url);
  await page.locator('#start').click();
  await page.waitForTimeout(1500);
  const hint = page.locator('#hint');
  if (await hint.isEnabled()) await hint.click();
  await page.waitForTimeout(300);
  expect(errors).toEqual([]);
});
