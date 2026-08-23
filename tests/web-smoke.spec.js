const { test, expect } = require('@playwright/test');

const url = process.env.PURE_DDZ_TEST_URL || 'http://127.0.0.1:4173/index.html';

function collectErrors(page) {
  const errors = [];
  page.on('pageerror', error => errors.push(String(error)));
  return errors;
}

async function startGame(page) {
  await page.getByRole('button', { name: '专家模式开局' }).click();
}

test('opens without login and deals a complete hand in expert mode', async ({ page }) => {
  const errors = collectErrors(page);
  await page.goto(url);
  await expect(page.getByRole('heading', { name: '纯净斗地主 v1.2.0' })).toBeVisible();
  await expect(page.locator('#setting-difficulty')).toHaveValue('expert');
  await page.evaluate(() => { Math.random = () => 0.25; });
  await startGame(page);
  await expect(page.locator('#round-number')).toHaveText('1');
  await expect(page.locator('#hand .card')).toHaveCount(17);
  await expect(page.locator('#bid-controls')).toBeVisible({ timeout: 5000 });
  await expect(page.locator('#status')).not.toHaveText('准备开始');
  const runtime = await page.evaluate(() => ({
    version: window.PureDDZTest.version,
    difficulty: window.PureDDZTest.getState().settings.difficulty,
    hasExpert: Boolean(window.QilyLeanExpertAI),
    hasTheme: Boolean(window.QilyLeanCardTheme),
    history: window.PureDDZTest.expertMemory()?.history || []
  }));
  expect(runtime).toEqual({ version: '1.1.0', difficulty: 'expert', hasExpert: true, hasTheme: true, history: [] });
  expect(errors).toEqual([]);
});

test('expert theme keeps classic rank identifiers and renders QilyLean skill content', async ({ page }) => {
  const errors = collectErrors(page);
  await page.goto(url);
  await page.evaluate(() => { Math.random = () => 0.25; });
  await startGame(page);
  await expect(page.locator('#bid-controls')).toBeVisible({ timeout: 5000 });
  await expect(page.locator('#hand .qily-card')).toHaveCount(17);
  await expect(page.locator('#hand .qily-card-corner').first()).toBeVisible();
  const theme = await page.evaluate(() => ({
    rank3: window.QilyLeanCardTheme.rankThemes[3].title,
    rank15: window.QilyLeanCardTheme.rankThemes[15].title,
    spade: window.QilyLeanCardTheme.suitThemes['♠'].title,
    runtimeRoot: window.QilyLeanCardTheme.runtimeRoot
  }));
  expect(theme.rank3).toBe('现场事实');
  expect(theme.rank15).toBe('单件流');
  expect(theme.spade).toBe('工程能力');
  expect(theme.runtimeRoot).toContain(':4173/');
  expect(errors).toEqual([]);
});

test('big joker is avatar and small joker is C919 airplane using local assets', async ({ page }) => {
  const errors = collectErrors(page);
  await page.goto(url);
  const jokers = await page.evaluate(() => ({
    small: window.QilyLeanCardTheme.jokerThemes[16],
    big: window.QilyLeanCardTheme.jokerThemes[17]
  }));
  expect(jokers.small.title).toBe('小王');
  expect(jokers.small.code).toBe('C919');
  expect(jokers.small.image).toContain('/assets/pure-ddz/airplane-joker.png');
  expect(jokers.big.title).toBe('大王');
  expect(jokers.big.image).toContain('/assets/pure-ddz/avatar-king.webp');
  const smallResponse = await page.request.get(jokers.small.image);
  const bigResponse = await page.request.get(jokers.big.image);
  expect(smallResponse.ok()).toBe(true);
  expect(bigResponse.ok()).toBe(true);
  expect((await smallResponse.body()).length).toBeGreaterThan(10000);
  expect((await bigResponse.body()).length).toBeGreaterThan(10000);
  expect(errors).toEqual([]);
});

test('challenge mode is selectable and preserves public-memory AI', async ({ page }) => {
  const errors = collectErrors(page);
  await page.goto(url);
  await page.getByRole('button', { name: '先调整难度、字体和声音' }).click();
  await page.locator('#setting-difficulty').selectOption('challenge');
  await expect(page.locator('#setting-difficulty')).toHaveValue('challenge');
  const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('pure_ddz_settings_v2')));
  expect(stored.difficulty).toBe('challenge');
  const ai = await page.evaluate(() => ({
    challenge: window.QilyLeanExpertAI.DIFFICULTY.CHALLENGE,
    controls: window.QilyLeanExpertAI.memory.controlCardsRemaining()
  }));
  expect(ai.challenge).toBe('challenge');
  expect(ai.controls).toEqual({ bigJoker: 1, smallJoker: 1, twos: 4, aces: 4 });
  expect(errors).toEqual([]);
});

test('settings use the exact official URL without a trailing slash', async ({ page }) => {
  const errors = collectErrors(page);
  await page.goto(url);
  await page.getByRole('button', { name: '先调整难度、字体和声音' }).click();
  const official = page.locator('.official-info a').filter({ hasText: '官方网址' });
  await expect(official).toHaveAttribute('href', 'https://qilylean.com');
  await expect(official.locator('b')).toHaveText('https://qilylean.com');
  await expect(page.locator('.official-info a[href="mailto:admin@qilylean.com"] b')).toHaveText('admin@qilylean.com');
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
    await startGame(page);
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
