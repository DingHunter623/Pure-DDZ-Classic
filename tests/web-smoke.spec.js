const { test, expect } = require('@playwright/test');

const url = process.env.PURE_DDZ_TEST_URL || 'http://127.0.0.1:4173/index.html';

function collectErrors(page) {
  const errors = [];
  page.on('pageerror', error => errors.push(String(error)));
  return errors;
}

test('opens without login and deals a complete hand', async ({ page }) => {
  const errors = collectErrors(page);
  await page.goto(url);
  await expect(page.getByRole('heading', { name: '纯净斗地主' })).toBeVisible();
  await page.evaluate(() => { Math.random = () => 0.25; });
  await page.getByRole('button', { name: '立即开始' }).click();
  await expect(page.locator('#round-number')).toHaveText('1');
  await expect(page.locator('#hand .card')).toHaveCount(17);
  await expect(page.locator('#bid-controls')).toBeVisible({ timeout: 5000 });
  await expect(page.locator('#status')).not.toHaveText('准备开始');
  expect(errors).toEqual([]);
});

test('settings use the exact official URL without a trailing slash', async ({ page }) => {
  const errors = collectErrors(page);
  await page.goto(url);
  await page.getByRole('button', { name: '先调整字体和声音' }).click();
  const official = page.locator('.official-info a').filter({ hasText: '官方网址' });
  await expect(official).toHaveAttribute('href', 'https://qilylean.com');
  await expect(official.locator('b')).toHaveText('https://qilylean.com');
  await expect(page.getByText('admin@qilylean.com', { exact: true })).toBeVisible();
  expect((await official.getAttribute('href')).endsWith('/')).toBe(false);
  expect(errors).toEqual([]);
});

test('core rule engine recognises common and explosive card types', async ({ page }) => {
  await page.goto(url);
  const results = await page.evaluate(() => ({
    straight: window.PureDDZTest.analyzeRanks([3, 4, 5, 6, 7]).type,
    bomb: window.PureDDZTest.analyzeRanks([11, 11, 11, 11]).type,
    rocket: window.PureDDZTest.analyzeRanks([16, 17]).type,
    triplePair: window.PureDDZTest.analyzeRanks([8, 8, 8, 9, 9]).type
  }));
  expect(results).toEqual({ straight: 'straight', bomb: 'bomb', rocket: 'rocket', triplePair: 'triple2' });
});

for (const viewport of [
  { name: 'phone portrait', width: 390, height: 844 },
  { name: 'phone landscape', width: 844, height: 390 },
  { name: 'tablet portrait', width: 820, height: 1180 },
  { name: 'tablet landscape', width: 1180, height: 820 }
]) {
  test(`${viewport.name} keeps the table and controls inside the viewport`, async ({ page }) => {
    const errors = collectErrors(page);
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto(url);
    await page.evaluate(() => { Math.random = () => 0.25; });
    await page.getByRole('button', { name: '立即开始' }).click();
    await expect(page.locator('#bid-controls')).toBeVisible({ timeout: 5000 });
    const layout = await page.evaluate(() => {
      const controls = document.querySelector('#bid-controls').getBoundingClientRect();
      return {
        horizontalOverflow: document.documentElement.scrollWidth - window.innerWidth,
        controlsLeft: controls.left,
        controlsRight: controls.right,
        controlsTop: controls.top,
        controlsBottom: controls.bottom,
        width: window.innerWidth,
        height: window.innerHeight
      };
    });
    expect(layout.horizontalOverflow).toBeLessThanOrEqual(1);
    expect(layout.controlsLeft).toBeGreaterThanOrEqual(0);
    expect(layout.controlsRight).toBeLessThanOrEqual(layout.width + 1);
    expect(layout.controlsTop).toBeGreaterThanOrEqual(0);
    expect(layout.controlsBottom).toBeLessThanOrEqual(layout.height + 1);
    expect(errors).toEqual([]);
  });
}
