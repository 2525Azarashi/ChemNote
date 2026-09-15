// TMPDIR=$PWD/.tmpwork node tests/manaHub.browser.mjs (running Vite required)
import { chromium } from 'playwright';
import assert from 'node:assert/strict';
const url = process.env.QUIZ_TEST_URL || 'http://localhost:3000';
const browser = await chromium.launch({ args: ['--disable-dev-shm-usage'] });
const errors = [];
try {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  await context.route('**/*', r => r.request().url().startsWith(url) ? r.continue() : r.abort());
  const page = await context.newPage();
  page.on('pageerror', e => errors.push(e.message));
  await page.addInitScript(() => {
    if (!localStorage.getItem('savedAppState')) localStorage.setItem('savedAppState', 'home');
    localStorage.setItem('isGuest', 'true'); localStorage.setItem('bgm_enabled', 'false');
  });
  const wallet = () => page.evaluate(() => JSON.parse(localStorage.getItem('battle_growth_local_v1_guest') || 'null')?.progress);
  const home = async () => { await page.getByRole('button', { name: 'ホーム画面へ移動', exact: true }).click(); await page.locator('[data-mana-dashboard]').waitFor(); };
  const fits = async () => {
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'page horizontal overflow');
    assert.ok(await page.locator('nav[aria-label="メインナビゲーション"] button').evaluateAll(nodes => nodes.every(n => { const r=n.getBoundingClientRect(); return r.width>=44 && r.height>=44; })), 'navigation targets under 44px');
  };
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  await page.locator('[data-mana-dashboard]').waitFor();
  await page.getByRole('button', { name: /デイリーボーナスを受け取る/ }).click();
  await page.getByRole('dialog').waitFor(); assert.equal((await wallet()).coins, 10);
  await page.keyboard.press('Tab'); assert.ok(await page.getByRole('dialog').evaluate(e=>e.contains(document.activeElement)));
  await page.keyboard.press('Escape');
  assert.ok(await page.getByRole('button', { name: /今日のボーナス受取済み/ }).isDisabled());
  await page.getByRole('button', { name: 'ショップ', exact: true }).click();
  await page.getByRole('heading', { name: 'マナコインショップ' }).waitFor();
  await page.getByRole('button', { name: /ミント.*60 マナコイン/ }).click();
  assert.equal((await wallet()).coins,10);
  assert.ok(await page.getByText(/コインが 50 足りません/).count());
  // Seed only the test wallet to exercise a real purchase without seven days of waiting.
  await page.evaluate(() => {
    const k='battle_growth_local_v1_guest'; const e=JSON.parse(localStorage.getItem(k));
    e.progress.coins=100;localStorage.setItem(k,JSON.stringify(e));
  });
  await home(); await page.getByRole('button',{name:'ショップ',exact:true}).click();
  await page.getByRole('button',{name:/ミント.*60 マナコイン/}).click();
  assert.equal((await wallet()).coins,100);
  await page.getByRole('button',{name:/ミント.*もう一度タップで交換/}).click();
  await page.waitForFunction(()=>JSON.parse(localStorage.getItem('battle_growth_local_v1_guest')).progress.equipped.frame==='frame_mint');
  assert.equal((await wallet()).coins,40);
  assert.ok(await page.getByRole('button',{name:/ミント.*装備中/}).isDisabled());
  await home();
  assert.ok(await page.locator('[data-mana-coins]').innerText().then(t=>t.includes('40')));
  assert.equal(await page.locator('.mana-avatar-button > div > div').evaluate(e=>getComputedStyle(e).borderTopColor),'rgb(116, 183, 163)');
  await page.reload({waitUntil:'domcontentloaded'}); await page.locator('[data-mana-dashboard]').waitFor();
  assert.equal((await wallet()).coins,40);
  for(const [width,height] of [[320,568],[390,844],[667,375],[1280,900]]) {
    await page.setViewportSize({width,height}); await fits();
    await page.screenshot({path:`.tmpwork/mana-home-${width}.png`});
    for(const label of ['ショップ','きせかえ','称号','ミッション']) {
      await page.getByRole('button',{name:label,exact:true}).click(); await page.locator('[data-growth-hub]').waitFor();await fits();
      await page.screenshot({path:`.tmpwork/mana-${label==='ショップ'?'shop':label==='きせかえ'?'outfit':label==='称号'?'badges':'missions'}-${width}.png`});
      await home();
    }
  }
  await page.setViewportSize({width:390,height:844});
  // Real review callbacks earn mission progress; claims are made from the global home entry.
  await page.evaluate(async()=>{
    const r=await import('/src/utils/reviewList.ts');
    for(let i=0;i<3;i++) {
      r.captureWrongAnswers('guest',[{chapterId:'c1',questionId:'mana-test-'+i,subQuestionId:'s',questionText:'Review test',correctAnswer:'A'}]);
      r.markReviewedCorrect('guest','c1::mana-test-'+i+'::s');r.markReviewedCorrect('guest','c1::mana-test-'+i+'::s');
    }
  });
  await page.waitForFunction(()=>JSON.parse(localStorage.getItem('battle_growth_local_v1_guest')).progress.holesFilled===3);
  await page.getByRole('button',{name:/^ミッション/}).click();
  const before=(await wallet()).coins; await page.getByRole('button',{name:'うけとる',exact:true}).click();
  await page.waitForFunction(n=>JSON.parse(localStorage.getItem('battle_growth_local_v1_guest')).progress.coins>n,before);
  assert.equal(await page.getByRole('button',{name:'うけとる',exact:true}).count(),0);
  await home();
  // A second tab publishes the existing wallet and the mounted home updates without reload.
  const other=await context.newPage();await other.goto(url,{waitUntil:'domcontentloaded'});
  await other.evaluate(async()=>{const s=await import('/src/battle/data/growthStore.ts');await s.equip('frame_paper');});
  await page.waitForFunction(()=>getComputedStyle(document.querySelector('.mana-avatar-button > div > div')).borderTopColor==='rgb(229, 231, 235)');
  await other.close();
  // Actual vocabulary selection and AI hook, including countdown and no double XP wallet.
  await page.getByRole('button',{name:'オンライン対戦へ移動',exact:true}).click();
  await page.getByRole('button',{name:'AIと対戦する',exact:true}).click();
  await page.getByRole('button',{name:/英単語・英熟語/}).click();
  console.log('VOCAB SELECTION:',(await page.locator('body').innerText()).slice(0,1300));
  // Selection may first offer units before difficulty.
  const all=page.getByRole('button',{name:/全単元|すべての単元/});
  await all.first().waitFor(); await all.first().click();
  await page.locator('#battle-ai-easy').click();
  await page.getByRole('button',{name:'はじめる',exact:true}).waitFor();
  const matches=(await wallet()).matches;
  await page.clock.install();await page.getByRole('button',{name:'はじめる',exact:true}).click();
  await page.screenshot({path:'.tmpwork/mana-vocab-countdown.png'});
  await page.clock.fastForward(5000);await page.screenshot({path:'.tmpwork/mana-vocab-playing.png'});
  for(let i=0;i<30;i++) {await page.clock.fastForward(60000);await page.waitForTimeout(60);if(await page.locator('#battle-result-growth').count())break;}
  await page.locator('#battle-result-growth').waitFor({timeout:15000});
  assert.equal((await wallet()).matches,matches+1);
  assert.equal(await page.getByRole('button',{name:/演習する/}).count(),0);
  assert.equal(await page.evaluate(()=>localStorage.getItem('battle_xp_guest')),null);
  await page.clock.fastForward(4000);assert.equal((await wallet()).matches,matches+1);
  await page.screenshot({path:'.tmpwork/mana-vocab-result.png'});
  assert.deepEqual(errors,[]);
  console.log('PASS: home bonus, insufficient balance, confirmed purchase, equipped avatar, persistence, 4 viewport sizes, all menu entries, real review mission, cross-tab wallet, vocabulary AI completion and canonical XP.');
} finally { await browser.close(); }
