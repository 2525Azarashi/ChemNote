// Real components under StrictMode in Vite; actual encoded assets and title in production.
// TMPDIR=$PWD/.tmpwork node tests/cinematics.browser.mjs
import { chromium } from 'playwright';
import assert from 'node:assert/strict';
const production = process.env.PRODUCTION_TEST_URL || 'http://localhost:4173';
const dev = process.env.QUIZ_TEST_URL || 'http://localhost:3000';
const browser = await chromium.launch({ args: ['--disable-dev-shm-usage'] });
try {
  const page = await browser.newPage({ viewport: { width: 390, height: 664 } });
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto(production);
  await page.waitForFunction(() => document.querySelector('.launch-stage video')?.currentTime > .05);
  assert.ok(await page.locator('.launch-start').isEnabled());
  await page.waitForFunction(() => !document.querySelector('.launch-stage video'));
  assert.equal(await page.locator('.launch-equipped-pose').evaluate(e => getComputedStyle(e).visibility), 'visible');
  for (const name of ['attack', 'gacha', 'victory']) {
    const result = await page.evaluate(async name => {
      const video = document.createElement('video');
      video.src = `/cinematics/${name}.mp4`; video.muted = true; video.playsInline = true;
      document.body.append(video);
      await video.play();
      await new Promise((resolve, reject) => {
        video.onended = resolve; video.onerror = reject;
        setTimeout(() => reject(new Error('Movie did not finish')), 8000);
      });
      const result = { width: video.videoWidth, time: video.currentTime };
      video.remove(); return result;
    }, name);
    assert.equal(result.width, 720); assert.ok(result.time > 2);
  }
  await page.goto(dev);
  await page.locator('.launch-start').waitFor();
  await page.locator('.launch-start').click(); // audible playback gesture; movie never gates entry
  await page.evaluate(async () => {
    const React = (await import('/node_modules/.vite/deps/react.js')).default;
    const dom = await import('/node_modules/.vite/deps/react-dom_client.js');
    const { CinematicClip } = await import('/src/components/CinematicClip.tsx');
    const { BattleQuestionView } = await import('/src/battle/ui/BattleQuestionView.tsx');
    const { loadPool } = await import('/src/battle/data/battlePool.ts');
    document.getElementById('root').style.display = 'none';
    const host = document.createElement('div'); host.style.cssText = 'position:relative;height:500px';
    document.body.append(host);
    const createRoot = dom.createRoot || dom.default.createRoot;
    window.testRoot = createRoot(host);
    window.mountClip = (src = '/cinematics/gacha.mp4') => {
      window.completeCount = 0; window.activeHistory = [];
      window.testRoot.render(React.createElement(React.StrictMode, {}, React.createElement(CinematicClip, {
        key: String(Math.random()), src, label: '検証動画',
        onComplete: () => window.completeCount++, onActiveChange: active => window.activeHistory.push(active),
      })));
    };
    window.audioQuestions = await loadPool('english_listening');
    window.mountAudio = (index = 0, answered = false) => {
      const question = window.audioQuestions[index];
      window.testRoot.render(React.createElement(React.StrictMode, {}, React.createElement(BattleQuestionView, {
        question, index, total: 8, remainMs: 55000, limitSec: 55, answered, reveal: false,
        myChoice: -1, myPanel: [], onChoose() {}, onPushPanel() {}, onPopPanel() {}, onCyclePanel() {}, onCommitKana() {},
      })));
    };
  });
  const done = () => page.waitForFunction(() => window.completeCount === 1);
  await page.evaluate(() => window.mountClip());
  await page.waitForFunction(() => document.querySelector('.cinematic-clip video')?.currentTime > .05);
  await done(); assert.ok(await page.evaluate(() => window.activeHistory.includes(true)));
  await page.evaluate(() => window.mountClip());
  await page.getByRole('button', { name: '演出をスキップ', exact: true }).click();
  await done(); assert.equal(await page.locator('.cinematic-clip').count(), 0);
  await page.route('**/cinematics/missing.mp4', r => r.abort());
  await page.evaluate(() => window.mountClip('/cinematics/missing.mp4')); await done();
  await page.evaluate(() => {
    window.nativePlay = HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play = function () { return Promise.reject(new DOMException('Blocked', 'NotAllowedError')); };
    window.mountClip();
  });
  await done();
  await page.evaluate(() => { HTMLMediaElement.prototype.play = window.nativePlay; });
  let requests = 0;
  page.on('request', r => { if (r.url().includes('/cinematics/')) requests++; });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.evaluate(() => window.mountClip()); await done();
  assert.equal(requests, 0); assert.equal(await page.locator('video').count(), 0);
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.evaluate(() => {
    Object.defineProperty(navigator, 'connection', { configurable: true, value: { saveData: true } });
    window.mountClip();
  });
  await done(); assert.equal(requests, 0);
  await page.evaluate(() => { delete navigator.connection; window.mountAudio(); });
  await page.locator('.battle-listening-audio audio').waitFor();
  await page.waitForFunction(() => document.querySelector('.battle-listening-audio audio')?.currentTime > .1);
  assert.equal(await page.locator('[data-listening-evidence]').count(), 0);
  assert.equal(await page.getByText(/スクリプトを開く/).count(), 0);
  await page.evaluate(() => { window.previousAudio = document.querySelector('.battle-listening-audio audio'); window.mountAudio(1); });
  await page.waitForFunction(() => window.previousAudio.paused && document.querySelector('.battle-listening-audio audio') !== window.previousAudio);
  await page.waitForFunction(() => document.querySelector('.battle-listening-audio audio')?.currentTime > .1);
  await page.evaluate(() => window.mountAudio(1, true));
  await page.waitForFunction(() => document.querySelector('.battle-listening-audio audio').paused);
  await page.evaluate(() => {
    HTMLMediaElement.prototype.play = function () { return Promise.reject(new DOMException('Blocked', 'NotAllowedError')); };
    window.mountAudio(2);
  });
  await page.getByText('再生ボタンを押して音源を聞いてください', { exact: true }).waitFor();
  assert.ok(await page.locator('.battle-listening-audio audio').evaluate(e => e.controls));
  await page.evaluate(() => { HTMLMediaElement.prototype.play = window.nativePlay; window.testRoot.unmount(); });
  assert.deepEqual(errors, []);
  console.log('PASS: production native movies; StrictMode completion/skip/error/autoplay rejection; reduced-motion/saveData zero requests; listening native playback, question change/answer cleanup, script privacy and blocked-play controls.');
} finally { await browser.close(); }
