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

test('uses QilyLean VI and maps the six business lines to the deck', async ({ page }) => {
  const errors = collectErrors(page);
  await page.goto(url);
  await expect(page.locator('.brand')).toContainText('QilyLean');
  await expect(page.locator('.clean-promise b')).toHaveCount(6);
  const themes = await page.evaluate(() => [
    { rank: 3, suit: '♠' },
    { rank: 3, suit: '♥' },
    { rank: 3, suit: '♣' },
    { rank: 3, suit: '♦' },
    { rank: 16, suit: '🃏' },
    { rank: 17, suit: '🃏' }
  ].map(window.PureDDZTest.cardTheme));
  expect(themes).toEqual(['新厂规划', '精益改善', '目视化', '数智工厂', 'APP开发', '官网建设']);
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

test('core rule engine recognises the complete classic card-type set', async ({ page }) => {
  await page.goto(url);
  const results = await page.evaluate(() => ({
    single: window.PureDDZTest.analyzeRanks([3]).type,
    pair: window.PureDDZTest.analyzeRanks([4, 4]).type,
    triple: window.PureDDZTest.analyzeRanks([5, 5, 5]).type,
    triple1: window.PureDDZTest.analyzeRanks([6, 6, 6, 7]).type,
    triple2: window.PureDDZTest.analyzeRanks([6, 6, 6, 7, 7]).type,
    straight: window.PureDDZTest.analyzeRanks([3, 4, 5, 6, 7]).type,
    pairStraight: window.PureDDZTest.analyzeRanks([3, 3, 4, 4, 5, 5]).type,
    airplane: window.PureDDZTest.analyzeRanks([3, 3, 3, 4, 4, 4]).type,
    airplane1: window.PureDDZTest.analyzeRanks([3, 3, 3, 4, 4, 4, 7, 8]).type,
    airplane2: window.PureDDZTest.analyzeRanks([3, 3, 3, 4, 4, 4, 7, 7, 8, 8]).type,
    four2: window.PureDDZTest.analyzeRanks([9, 9, 9, 9, 10, 11]).type,
    four2pair: window.PureDDZTest.analyzeRanks([9, 9, 9, 9, 10, 10, 11, 11]).type,
    bomb: window.PureDDZTest.analyzeRanks([11, 11, 11, 11]).type,
    rocket: window.PureDDZTest.analyzeRanks([16, 17]).type,
    invalidWithTwo: window.PureDDZTest.analyzeRanks([11, 12, 13, 14, 15])
  }));
  expect(results).toEqual({
    single: 'single', pair: 'pair', triple: 'triple', triple1: 'triple1', triple2: 'triple2',
    straight: 'straight', pairStraight: 'pairStraight', airplane: 'airplane', airplane1: 'airplane1',
    airplane2: 'airplane2', four2: 'four2', four2pair: 'four2pair', bomb: 'bomb', rocket: 'rocket', invalidWithTwo: null
  });
});

test('a human can call landlord, receive the bottom cards and play a suggested legal hand', async ({ page }) => {
  const errors = collectErrors(page);
  await page.goto(url);
  await page.evaluate(() => { Math.random = () => 0.25; });
  await page.getByRole('button', { name: '立即开始' }).click();
  await page.getByRole('button', { name: '3 分抢地主' }).click();
  await expect(page.locator('#me-role')).toHaveText('地主');
  await expect(page.locator('#hand .card')).toHaveCount(20);
  await page.getByRole('button', { name: 'AI 智能提示' }).click();
  expect(await page.locator('#hand .card.selected').count()).toBeGreaterThan(0);
  await page.getByRole('button', { name: '确认出牌' }).click();
  await expect.poll(() => page.locator('#hand .card').count()).toBeLessThan(20);
  await page.evaluate(() => window.PureDDZTest.stop());
  expect(errors).toEqual([]);
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
