const { test, expect } = require('@playwright/test');

const url = process.env.PURE_DDZ_TEST_URL || 'http://127.0.0.1:4173/index.html';

async function waitForV120(page) {
  await page.waitForFunction(() => Boolean(window.QilyLeanV120 && window.PureDDZTest && window.QilyLeanCardTheme));
}

async function becomeLandlord(page) {
  await page.evaluate(() => { Math.random = () => 0.25; });
  await page.getByRole('button', { name: '专家模式开局' }).click();
  await expect(page.locator('#bid-controls')).toBeVisible({ timeout: 5000 });
  await page.locator('[data-bid="3"]').click();
  await expect(page.locator('#play-controls')).toBeVisible({ timeout: 5000 });
  await expect(page.locator('#me-role')).toHaveText('地主');
}

test('visual-first cards are larger and carry rank at top plus QilyLean site at bottom', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(url);
  await waitForV120(page);
  await becomeLandlord(page);
  const card = page.locator('#hand .card:not(.joker)').first();
  const metrics = await card.evaluate(el => {
    const box = el.getBoundingClientRect();
    const rank = el.querySelector('.qily-card-corner b');
    const site = el.querySelector('.qily-card-site');
    const theme = el.querySelector('.qily-card-theme > strong');
    return {
      width: box.width,
      height: box.height,
      rank: rank?.textContent || '',
      rankFont: rank ? parseFloat(getComputedStyle(rank).fontSize) : 0,
      themeFont: theme ? parseFloat(getComputedStyle(theme).fontSize) : 0,
      site: site?.textContent || ''
    };
  });
  expect(metrics.width).toBeGreaterThanOrEqual(118);
  expect(metrics.height).toBeGreaterThanOrEqual(176);
  expect(metrics.rank).toMatch(/^(A|2|3|4|5|6|7|8|9|10|J|Q|K)$/);
  expect(metrics.rankFont).toBeGreaterThanOrEqual(32);
  expect(metrics.themeFont).toBeGreaterThanOrEqual(26);
  expect(metrics.site).toBe('启力精益 | https://qilylean.com');
});

test('every played hand receives enlarged visual feedback instead of speech-only feedback', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(url);
  await waitForV120(page);
  await becomeLandlord(page);
  const first = page.locator('#hand .card:not(.joker)').first();
  await first.click();
  await expect(first).toHaveClass(/selected/);
  await page.locator('#play').click();
  await expect(page.locator('#v120-play-stage')).toHaveClass(/show/, { timeout: 3000 });
  await expect(page.locator('#v120-play-stage .v120-play-owner')).toContainText('我');
  await expect(page.locator('#v120-play-stage .v120-play-card')).toHaveCount(1);
  const visual = await page.locator('#v120-play-stage .v120-play-card').first().evaluate(el => {
    const box=el.getBoundingClientRect();
    return {width:box.width,height:box.height,site:el.querySelector('.qily-card-site')?.textContent||''};
  });
  expect(visual.width).toBeGreaterThanOrEqual(86);
  expect(visual.height).toBeGreaterThanOrEqual(130);
  expect(visual.site).toContain('qilylean.com');
});

test('Qily Autoplay replaces expert hint, defaults off and can be toggled on or off', async ({ page }) => {
  await page.goto(url);
  await waitForV120(page);
  await becomeLandlord(page);
  const autoplay = page.locator('#hint');
  await expect(autoplay).toHaveText('启力托管：关');
  await expect(autoplay).toHaveAttribute('aria-pressed', 'false');
  await expect(page.locator('#play')).toHaveText('出牌');
  await autoplay.click();
  await expect(autoplay).toHaveText('启力托管：开');
  await expect(autoplay).toHaveAttribute('aria-pressed', 'true');
  expect(await page.evaluate(() => localStorage.getItem('pure_ddz_qily_autoplay_v1'))).toBe('1');
  await autoplay.click();
  await expect(autoplay).toHaveText('启力托管：关');
  expect(await page.evaluate(() => localStorage.getItem('pure_ddz_qily_autoplay_v1'))).toBe('0');
});

test('portrait touch devices receive landscape-first guidance when browser lock is unavailable', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  const page = await context.newPage();
  await page.addInitScript(() => Object.defineProperty(navigator, 'maxTouchPoints', { configurable: true, get: () => 5 }));
  await page.goto(url);
  await waitForV120(page);
  await expect(page.locator('#v120-orientation-notice')).toHaveClass(/show/);
  await expect(page.getByRole('button', { name: '进入横屏牌桌' })).toBeVisible();
  await context.close();
});
