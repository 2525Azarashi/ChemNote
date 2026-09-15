// Run against `npm run preview -- --host 0.0.0.0 --port 4173`, never the Vite dev server.
// TMPDIR=$PWD/.tmpwork node tests/productionStartup.browser.mjs
import { chromium } from 'playwright';
import assert from 'node:assert/strict';
const url = process.env.PRODUCTION_TEST_URL || 'http://localhost:4173';
const browser = await chromium.launch({ args: ['--disable-dev-shm-usage'] });
let count = 0;
try {
  for (const width of [390, 1280]) {
    for (const state of [null, 'home', 'growth', 'battle']) {
      const context = await browser.newContext({ viewport: { width, height: 844 }, reducedMotion: 'reduce' });
      await context.route('**/*', r => r.request().url().startsWith(url) ? r.continue() : r.abort());
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', e => errors.push(e.message));
      if (state) await page.addInitScript(state => {
        localStorage.setItem('savedAppState', state);
        localStorage.setItem('savedSelectedSubject', 'math');
        localStorage.setItem('isGuest', 'true');
        localStorage.setItem('battle_growth_local_v1_guest', JSON.stringify({ version: 1,
          progress: { uid: 'guest', coins: 137, xp: 80, owned: ['pose_basic', 'frame_paper'], equipped: { pose: 'pose_basic', frame: 'frame_paper', title: '' } }, receipts: ['match:preserved'], day: '' }));
      }, state);
      const response = await page.goto(url, { waitUntil: 'domcontentloaded' });
      assert.equal(response.status(), 200);
      assert.ok(!(await response.text()).includes('/@vite/client'), 'must test built production assets');
      await page.waitForFunction(() => document.querySelector('#root')?.innerText.trim().length > 30, { timeout: 15000 });
      assert.equal(await page.title(), 'マナトビ');
      assert.equal(await page.locator('html').getAttribute('lang'), 'ja');
      assert.equal(await page.locator('meta[name="apple-mobile-web-app-title"]').getAttribute('content'), 'マナトビ');
      const manifest = await context.request.get(new URL(await page.locator('link[rel="manifest"]').getAttribute('href'), url).href);
      const meta = await manifest.json();
      assert.equal(meta.name, 'マナトビ'); assert.equal(meta.short_name, 'マナトビ');
      await page.locator('[data-launch-screen]').waitFor();
      assert.equal(await page.locator('nav[aria-label="メインナビゲーション"]').count(), 0);
      assert.equal(await page.getByRole('img', {name:'マナトビ',exact:true}).getAttribute('src'), '/manatobi-logo.jpg');
      await page.locator('.launch-start').click();
      if (state === 'home') {
        await page.locator('[data-mana-dashboard]').waitFor();
        assert.match(await page.locator('[data-mana-coins]').innerText(), /137/);
        await page.getByRole('button', { name: 'ショップ', exact: true }).click();
        await page.getByRole('heading', { name: 'マナコインショップ' }).waitFor();
        await page.getByRole('button', { name: 'ホーム画面へ移動', exact: true }).click();
        await page.locator('[data-mana-dashboard]').waitFor();
        await page.screenshot({ path: `.tmpwork/boot-fixed-${width}.png` });
      } else if (state === 'growth') await page.locator('[data-growth-hub]').waitFor();
      else if (state === 'battle') await page.getByRole('button', { name: 'AIと対戦する', exact: true }).waitFor();
      if (state) {
        const progress = await page.evaluate(() => JSON.parse(localStorage.getItem('battle_growth_local_v1_guest')));
        assert.equal(progress.progress.coins, 137); assert.equal(progress.progress.xp, 80);
        assert.deepEqual(progress.receipts, ['match:preserved']);
      }
      assert.deepEqual(errors, [], `${width}px / ${state || 'first launch'}`);
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
      count++;
      await context.close();
    }
  }
  console.log(`PASS: ${count} production startups, first launch and restored home/growth/battle, shop navigation, preserved wallet, HTML/iOS/PWA titles, no page errors.`);
} finally { await browser.close(); }
