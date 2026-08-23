const { test, expect } = require('@playwright/test');

const url = process.env.PURE_DDZ_TEST_URL || 'http://127.0.0.1:4173/index.html';

async function openRound(page) {
  await page.goto(url);
  await page.evaluate(() => { Math.random = () => 0.25; });
  await page.getByRole('button', { name: '专家模式开局' }).click();
  await expect(page.locator('#bid-controls')).toBeVisible({ timeout: 5000 });
}

test('desktop hand uses v1.2 visual-first readable cards and removes repeated footer labels', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await openRound(page);
  await expect(page.locator('#hand .card')).toHaveCount(17);
  await expect(page.locator('#hand .qily-card-footer')).toHaveCount(0);
  const metrics = await page.locator('#hand .card:not(.joker)').first().evaluate(card => {
    const box = card.getBoundingClientRect();
    const rank = card.querySelector('.qily-card-corner b');
    const theme = card.querySelector('.qily-card-theme > strong');
    const title = card.querySelector('.qily-card-theme > b');
    const site = card.querySelector('.qily-card-site');
    return {
      width: box.width,
      height: box.height,
      rankFont: rank ? parseFloat(getComputedStyle(rank).fontSize) : 0,
      themeFont: theme ? parseFloat(getComputedStyle(theme).fontSize) : 0,
      titleFont: title ? parseFloat(getComputedStyle(title).fontSize) : 0,
      site: site?.textContent || '',
      hasVisualCss: Boolean(document.getElementById('qily-visual-v120-css'))
    };
  });
  expect(metrics.hasVisualCss).toBe(true);
  expect(metrics.width).toBeGreaterThanOrEqual(118);
  expect(metrics.height).toBeGreaterThanOrEqual(176);
  expect(metrics.rankFont).toBeGreaterThanOrEqual(32);
  expect(metrics.themeFont).toBeGreaterThanOrEqual(26);
  expect(metrics.titleFont).toBeGreaterThanOrEqual(15);
  expect(metrics.site).toBe('启力精益 | https://qilylean.com');
});

test('phone keeps enlarged cards readable without page horizontal overflow', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await openRound(page);
  const metrics = await page.locator('#hand .card').first().evaluate(card => {
    const box = card.getBoundingClientRect();
    return {
      width: box.width,
      height: box.height,
      overflow: document.documentElement.scrollWidth - window.innerWidth
    };
  });
  expect(metrics.width).toBeGreaterThanOrEqual(80);
  expect(metrics.height).toBeGreaterThanOrEqual(120);
  expect(metrics.overflow).toBeLessThanOrEqual(1);
});
