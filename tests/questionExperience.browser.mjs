// TMPDIR=$PWD/.tmpwork node tests/questionExperience.browser.mjs (Vite on port 3000)
import { chromium } from 'playwright';
import assert from 'node:assert/strict';
const browser = await chromium.launch();
const errors = [];
try {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  page.on('pageerror', e => errors.push(e.message));
  await page.goto(process.env.QUIZ_TEST_URL || 'http://localhost:3000');
  await page.evaluate(async () => {
    const R = (await import('/node_modules/.vite/deps/react.js')).default;
    const D = await import('/node_modules/.vite/deps/react-dom_client.js');
    const { BattleMode } = await import('/src/battle/ui/BattleMode.tsx');
    const { BattleQuestionView } = await import('/src/battle/ui/BattleQuestionView.tsx');
    const { BattleSubjectSelect } = await import('/src/battle/ui/BattleSubjectSelect.tsx');
    const { BattleAiRoomScreen } = await import('/src/battle/ui/BattleAiRoomScreen.tsx');
    window.pool = await import('/src/battle/data/battlePool.ts');
    window.format = (await import('/src/utils/textFormatter.tsx')).formatText;
    document.getElementById('root').style.display = 'none';
    const host = document.createElement('div'); document.body.append(host);
    window.mount = (kind, props = {}) => {
      window.qaRoot?.unmount(); window.qaRoot = (D.createRoot || D.default.createRoot)(host);
      const Component = { mode: BattleMode, question: BattleQuestionView, select: BattleSubjectSelect, ai: BattleAiRoomScreen }[kind];
      window.qaRoot.render(R.createElement(Component, { onExit() {}, ...props }));
    };
    window.selection = null;
    window.select = (allow = true) => window.mount('select', { title: 'テスト', allowQuestionCount: allow,
      onBack() {}, onPick: (...args) => { window.selection = args; } });
    window.select();
  });
  const fit = async () => assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'horizontal overflow');
  // Check every subject's unit UI and picking all/one unit on two mobile widths.
  for (const width of [320, 390]) {
    await page.setViewportSize({ width, height: width === 320 ? 568 : 844 });
    for (const subject of ['chemistry_basic', 'chemistry', 'english_listening', 'math', 'biology_basic', 'english_grammar', 'geography', 'rika']) {
      await page.evaluate(() => window.select());
      await page.locator('[data-question-count="5"]').click();
      await page.locator('#battle-subject-' + subject).click();
      await page.locator('[data-battle-unit="all"]').waitFor(); await fit();
      const buttons = page.locator('[data-battle-unit]:not([data-battle-unit="all"])');
      assert.ok(await buttons.count());
      const unit = await buttons.first().getAttribute('data-battle-unit');
      await buttons.first().click();
      assert.deepEqual(await page.evaluate(() => window.selection), [subject, 5, unit]);
      await page.locator('[data-battle-unit="all"]').click();
      assert.deepEqual(await page.evaluate(() => window.selection), [subject, 5]);
    }
  }
  await page.evaluate(() => window.select(false));
  await page.locator('#battle-subject-chemistry_basic').click();
  assert.deepEqual(await page.evaluate(() => window.selection), ['chemistry_basic']);
  assert.equal(await page.locator('[data-battle-unit]').count(), 0);
  // Actual Fe screenshot prompt; compare visible KaTeX markup with explicit charges.
  await page.evaluate(async () => {
    window.reported = (await window.pool.loadPool('chemistry_basic')).find(q => q.id === 'a:c6_1:p_c6_1_4:p_c6_1_4_ka:1');
    window.questionProps = { question: window.reported, index: 0, total: 5, remainMs: 20000,
      answered: false, reveal: false, myChoice: -1, myPanel: [], onChoose() {}, onPushPanel() {}, onPopPanel() {}, onCyclePanel() {}, onCommitKana() {} };
    window.mount('question', window.questionProps);
  });
  await page.locator('#battle-question').waitFor();
  assert.ok(await page.evaluate(() => {
    const explicit = document.createElement('div');
    explicit.innerHTML = window.format('Fe²⁺').props.dangerouslySetInnerHTML.__html;
    return document.querySelector('[aria-label="Fe2+"] .katex').innerHTML === explicit.querySelector('.katex').innerHTML;
  }));
  await page.screenshot({ path: '.tmpwork/question-fe-fixed.png', fullPage: true });
  for (const kind of ['correct', 'wrong', 'unanswered']) {
    await page.evaluate(kind => {
      const myChoice = kind === 'correct' ? window.reported.answerIndex : kind === 'wrong' ? (window.reported.answerIndex + 1) % 4 : -1;
      window.mount('question', { ...window.questionProps, remainMs: 0, answered: kind !== 'unanswered', reveal: true, myChoice });
    }, kind);
    await page.locator('[data-answer-feedback]').waitFor(); await fit();
    const text = await page.locator('[data-answer-feedback]').innerText();
    assert.ok(text.includes({ correct: '正解！', wrong: '不正解', unanswered: '未回答・時間切れ' }[kind]));
    assert.equal(await page.locator('#battle-question button:not([disabled])').count(), 0);
    await page.screenshot({ path: `.tmpwork/question-feedback-${kind}.png`, fullPage: true });
  }
  // Full real navigation: AI -> subject -> unit -> level -> actual game.
  await page.evaluate(() => window.mount('mode'));
  await page.getByRole('button', { name: /AI.*対戦/ }).first().click();
  await page.locator('[data-question-count="5"]').click();
  await page.locator('#battle-subject-chemistry_basic').click();
  await page.locator('[data-battle-unit="c6_1"]').waitFor();
  await page.screenshot({ path: '.tmpwork/question-unit-picker.png', fullPage: true });
  await page.locator('[data-battle-unit="c6_1"]').click();
  await page.locator('#battle-ai-easy').click();
  await page.getByRole('button', { name: /はじめる/ }).waitFor();
  await page.clock.install();
  await page.getByRole('button', { name: /はじめる/ }).click();
  await page.locator('#battle-question').waitFor();
  for (let second = 0; second < 60 && !await page.locator('[data-answer-feedback]').count(); second++) {
    await page.clock.runFor(1000);
  }
  await page.locator('[data-answer-feedback]').waitFor();
  const firstIndex = await page.locator('#battle-question').innerText();
  await page.clock.runFor(1000);
  assert.equal(await page.locator('#battle-question').innerText(), firstIndex);
  // Allow the 150ms deadline grace plus a React clock-tick commit before
  // the 3.5s hold begins. The first second above must remain visible.
  await page.clock.runFor(4000);
  await page.locator('[data-answer-feedback]').waitFor({ state: 'hidden' });
  assert.deepEqual(errors, []);
  console.log('PASS: 16 mobile unit menus, all/one-unit selections, national scope, real Fe charge rendering, three feedback states, full AI navigation and reveal hold.');
} finally { await browser.close(); }
