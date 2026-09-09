// TMPDIR=$PWD/.tmpwork node tests/battleJourney.browser.mjs
import { chromium } from 'playwright';
import assert from 'node:assert/strict';
const browser = await chromium.launch();
const base = process.env.QUIZ_TEST_URL || 'http://localhost:3000';
try {
  // Native input events + simulated IME. The only network-writing entry is mocked.
  const inputContext = await browser.newContext({ viewport: { width: 375, height: 812 } });
  const inputPage = await inputContext.newPage();
  await inputPage.route('**/src/battle/data/battle.ts*', async route => {
    const response = await route.fetch();
    let code = await response.text();
    assert.ok(code.includes('export async function joinRoomByCode(rawCode)'));
    code = code.replace('export async function joinRoomByCode(rawCode)', 'async function originalJoinRoomByCode(rawCode)');
    code += '\nexport async function joinRoomByCode(value) { window.joinRequests ??= []; window.joinRequests.push(value); await new Promise(r => setTimeout(r, 200)); throw new Error("テスト用:部屋がありません"); }';
    await route.fulfill({ response, body: code, contentType: 'application/javascript' });
  });
  await inputPage.goto(base);
  await inputPage.evaluate(async () => {
    const R = (await import('/node_modules/.vite/deps/react.js')).default;
    const D = await import('/node_modules/.vite/deps/react-dom_client.js');
    const { BattleFriendJoin } = await import('/src/battle/ui/BattleFriendJoin.tsx');
    document.getElementById('root').style.display = 'none';
    const host = document.createElement('div'); document.body.append(host);
    (D.createRoot || D.default.createRoot)(host).render(R.createElement(BattleFriendJoin, { onBack() {}, onJoined() {} }));
    window.joinRequests = [];
  });
  const input = inputPage.locator('#battle-code-input');
  await input.waitFor();
  for (const [letter, expected] of [['a','a'],['b','ab'],['c','abc'],['d','abcd']]) {
    await input.pressSequentially(letter); assert.equal(await input.inputValue(), expected);
  }
  assert.deepEqual(await inputPage.evaluate(() => window.joinRequests), []);
  await input.evaluate(el => el.setSelectionRange(1,2)); await input.pressSequentially('z');
  assert.equal(await input.inputValue(), 'azcd');
  await input.fill('');
  await input.evaluate(el => {
    el.dispatchEvent(new CompositionEvent('compositionstart', { bubbles: true }));
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(el, 'ａｂｃｄ');
    el.dispatchEvent(new InputEvent('input', { bubbles: true, data: 'ａｂｃｄ', isComposing: true }));
    el.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', keyCode: 229, isComposing: true, bubbles: true }));
  });
  assert.equal(await input.inputValue(), 'ａｂｃｄ');
  assert.equal(await inputPage.getByRole('button',{name:'部屋に入る',exact:true}).isDisabled(), true);
  assert.deepEqual(await inputPage.evaluate(() => window.joinRequests), []);
  await input.evaluate(el => el.dispatchEvent(new CompositionEvent('compositionend', { bubbles: true, data: 'ａｂｃｄ' })));
  await input.press('Enter'); await input.press('Enter');
  await inputPage.getByText('テスト用:部屋がありません').waitFor();
  assert.deepEqual(await inputPage.evaluate(() => window.joinRequests), ['ABCD']);
  await input.fill('ab cd'); await inputPage.getByRole('button',{name:'部屋に入る',exact:true}).click();
  await inputPage.getByText('テスト用:部屋がありません').waitFor();
  assert.deepEqual(await inputPage.evaluate(() => window.joinRequests), ['ABCD','ABCD']);
  await inputContext.close();

  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  await context.addInitScript(() => {
    localStorage.setItem('savedAppState','home'); localStorage.setItem('savedIsGuest','true');
    localStorage.setItem('battle_growth_local_v1_guest', JSON.stringify({version:1, progress:{uid:'guest',coins:850}, receipts:[],day:''}));
  });
  const page = await context.newPage(); const errors=[]; page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base);
  const nav = page.getByRole('navigation',{name:'メインナビゲーション'});
  await page.locator('[data-mana-coins]').waitFor();
  assert.ok((await page.locator('[data-mana-coins]').innerText()).includes('850'));
  await page.evaluate(async () => { await (await import('/src/battle/data/growthStore.ts')).touchLogin(); });
  await page.waitForFunction(() => document.querySelector('[data-mana-coins]')?.textContent.includes('860'));
  await nav.getByRole('button',{name:'オンライン対戦へ移動'}).click();
  await page.getByRole('button',{name:'AIと対戦する',exact:true}).waitFor();
  assert.equal(await nav.isVisible(),true);
  assert.equal(await page.getByRole('button',{name:/ホームにもどる/}).count(),0);
  await page.getByRole('button',{name:'AIと対戦する',exact:true}).click();
  await page.locator('[data-question-count="5"]').click();
  await page.locator('#battle-subject-chemistry_basic').click();
  await page.locator('[data-battle-unit="c6_1"]').click();
  await page.locator('#battle-ai-easy').click();
  await page.getByRole('button',{name:'はじめる',exact:true}).waitFor();
  await page.clock.install();
  await page.getByRole('button',{name:'はじめる',exact:true}).click();
  await page.locator('#battle-question').waitFor();
  assert.equal(await nav.isVisible(),true);
  page.once('dialog', dialog => dialog.dismiss());
  await nav.getByRole('button',{name:'ホーム画面へ移動'}).click();
  assert.equal(await page.locator('#battle-question').count(),1);
  for(let i=0;i<14;i++) { await page.clock.fastForward(60000);await page.waitForTimeout(60);if(await page.locator('#battle-result-detail').count())break; }
  await page.locator('#battle-result-detail').waitFor();
  assert.equal(await nav.isVisible(),true);
  const detail = page.locator('#battle-result-detail details').nth(1);
  await detail.locator('summary').click();
  await page.waitForFunction(() => [...document.querySelectorAll('[data-battle-explanation]')].some(el => el.textContent.includes('元の演習問題の解説')));
  const content = await detail.innerText(); assert.ok(content.length>150);
  await page.evaluate(() => {
    window.resultNode=document.querySelector('#battle-result-detail');
    window.detailNode=document.querySelectorAll('#battle-result-detail details')[1];
    window.beforeGrowth=localStorage.getItem('battle_growth_local_v1_guest');
  });
  const practice = page.locator('[data-practice-question]').nth(1);
  const id=await practice.getAttribute('data-practice-question');
  const target = await page.evaluate(async id => {
    const {loadPool}=await import('/src/battle/data/battlePool.ts');
    return (await loadPool('chemistry_basic')).find(q=>q.id===id);
  },id);
  await practice.click();
  await page.getByRole('button',{name:'バトル結果・解説に戻る',exact:true}).waitFor();
  assert.equal(await page.locator('#battle-screen-scroll').isVisible(),false);
  assert.equal(await page.evaluate(() => localStorage.getItem('savedSelectedChapterId')),target.chapterId);
  const range=await page.evaluate(()=>JSON.parse(localStorage.getItem('savedQuizRange')));
  assert.equal(range.startIndex,range.endIndex);
  await page.getByRole('button',{name:'バトル結果・解説に戻る',exact:true}).click();
  await page.locator('#battle-result-detail').waitFor({state:'visible'});
  assert.ok(await page.evaluate(() => window.resultNode===document.querySelector('#battle-result-detail') && window.detailNode.open));
  assert.equal(await page.evaluate(()=>localStorage.getItem('battle_growth_local_v1_guest')),await page.evaluate(()=>window.beforeGrowth));
  for(const width of [320,390]) {
    await page.setViewportSize({width,height:width===320?568:844});
    await page.locator('#battle-screen-scroll').evaluate(el=>{el.scrollTop=el.scrollHeight;});
    await page.getByRole('button',{name:'対戦メニューにもどる',exact:true}).scrollIntoViewIfNeeded();
    const bottom=await page.getByRole('button',{name:'対戦メニューにもどる',exact:true}).boundingBox();
    const bar=await nav.boundingBox(); assert.ok(bottom.y+bottom.height<=bar.y+1,'result footer hidden by navigation');
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  }
  await page.screenshot({path:'.tmpwork/battle-result-navigation.png',fullPage:true});
  await nav.getByRole('button',{name:'ホーム画面へ移動'}).click();
  await page.locator('[data-mana-coins]').waitFor();
  await page.screenshot({path:'.tmpwork/home-mana-coins.png',fullPage:true});
  assert.deepEqual(errors,[]);
  console.log('PASS: native input, IME, full-width/pasted codes, explicit single submission, home wallet updates, persistent tabs, exit cancellation, full source explanation, exact practice and retained result round-trip, no duplicate growth, 320/390px footer reachability.');
  await context.close();
} finally { await browser.close(); }
