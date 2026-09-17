// TMPDIR=$PWD/.tmpwork node tests/arena.browser.mjs — built assets on port 4173.
import { chromium } from 'playwright';
import assert from 'node:assert/strict';
const url=process.env.PRODUCTION_TEST_URL || 'http://localhost:4173';
const browser=await chromium.launch({args:['--disable-dev-shm-usage']});
try {
  const context=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'});
  await context.route('**/*',r=>r.request().url().startsWith(url)?r.continue():r.abort());
  const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.addInitScript(()=>{
    if(localStorage.getItem('arena-seeded'))return;
    localStorage.setItem('arena-seeded','true');localStorage.setItem('savedAppState','home');localStorage.setItem('isGuest','true');localStorage.setItem('bgm_enabled','off');
    localStorage.setItem('battle_growth_local_v1_guest',JSON.stringify({version:1,progress:{uid:'guest',coins:100,xp:80,owned:['pose_basic','frame_paper','pose_cheering','pose_sleeping','frame_pink','frame_mint','frame_ocean','frame_lavender','frame_coral','frame_midnight','pose_walking','pose_studying','pose_thinking','frame_stitch','frame_medal','frame_bubbles','frame_sunrise','frame_constellation'],equipped:{pose:'pose_cheering',frame:'frame_mint',title:''}},receipts:[],day:''}));
  });
  const wallet=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('battle_growth_local_v1_guest')));
  const home=async()=>{await page.getByRole('button',{name:'ホーム画面へ移動',exact:true}).click();await page.locator('[data-mana-dashboard]').waitFor();};
  const fit=async(selector)=>{
    const r=await page.locator(selector).boundingBox();const nav=await page.locator('nav[aria-label="メインナビゲーション"]').boundingBox();
    assert.ok(r && nav && (nav.height>nav.width ? r.x>=nav.x+nav.width && r.y+r.height<=page.viewportSize().height+1 : r.y+r.height<=nav.y+1),`${selector} overlaps nav: ${JSON.stringify({r,nav})}`);
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'horizontal overflow');
  };
  const response=await page.goto(url,{waitUntil:'domcontentloaded'});assert.ok(!(await response.text()).includes('/@vite/client'));
  await page.locator('.launch-start').click();
  await page.locator('[data-mana-dashboard]').waitFor();
  assert.match(await page.locator('.home-mascot-art').getAttribute('src'),/cheering/);
  for(const [width,height] of [[320,568],[390,844],[1280,900]]) {
    await page.setViewportSize({width,height});await fit('.arena-home-bottom');
    const stage=await page.locator('.game-mascot-stage').boundingBox();
    const mascot=await page.locator('.game-mascot-button').boundingBox();
    const primary=await page.locator('.game-main-action').boundingBox();
    const solo=await page.locator('.game-solo').boundingBox();
    const review=await page.locator('.game-review').boundingBox();
    assert.ok(Math.abs((mascot.x+mascot.width/2)-(stage.x+stage.width/2))<2);
    assert.ok(primary.x>solo.x && primary.x<review.x && primary.height>solo.height);
    for(const selector of ['.game-hud-top button','.game-stage-shortcuts button','.game-study-bar select','.game-home-utility button']) {
      assert.ok(await page.locator(selector).evaluateAll(es=>es.every(e=>e.getBoundingClientRect().height>=44)),selector+' has 44px targets');
    }
    await page.screenshot({path:`.tmpwork/arena-production-home-${width}.png`});
    await page.getByRole('button',{name:'オンライン対戦へ移動',exact:true}).click();await page.locator('.arena-menu').waitFor();
    await fit('.arena-mode-card.ai');await fit('.arena-menu-links');
    await page.screenshot({path:`.tmpwork/arena-production-menu-${width}.png`});await home();
  }
  // Measure the entire screen and ancestor chain, not just one primary button.
  const noScroll = async selector => {
    const problems = await page.locator(selector).evaluate(root => {
      const issues = [];
      for (let e = root; e; e = e.parentElement) {
        if (e.scrollHeight > e.clientHeight + 1) issues.push(`${e.className}: ${e.scrollHeight} > ${e.clientHeight}`);
        if (e.scrollTop !== 0) issues.push(`${e.className}: already scrolled`);
      }
      const navRect = document.querySelector('.app-bottom-nav').getBoundingClientRect();
      const navTop = navRect.height > navRect.width ? innerHeight : navRect.top;
      for (const e of root.querySelectorAll('button,select,summary')) {
        if (e.closest('dialog') || !e.checkVisibility()) continue;
        const r = e.getBoundingClientRect();
        if (r.bottom > navTop + 1 || r.top < 0) issues.push(`clipped: ${e.textContent}`);
        const hit = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2);
        if (!e.contains(hit)) issues.push(`covered: ${e.textContent}`);
      }
      return issues;
    });
    assert.deepEqual(problems, [], `${selector} at ${JSON.stringify(page.viewportSize())}`);
  };
  for (const [width,height,top,bottom] of [[390,664,0,0],[390,664,0,34],[390,844,47,34],[320,568,0,0],[375,548,0,0],[1280,900,0,0]]) {
    await page.setViewportSize({width,height});
    await page.evaluate(([top,bottom]) => {
      document.documentElement.style.setProperty('--app-safe-top', `${top}px`);
      document.documentElement.style.setProperty('--app-safe-bottom', `${bottom}px`);
    }, [top,bottom]);
    for (const [label,selector] of [['ホーム画面へ移動','.game-home'],['オンライン対戦へ移動','.arena-menu'],['ガチャ・マイページへ移動','.mana-hub-gacha'],['学習画面へ移動','.mode-desk']]) {
      await page.getByRole('button',{name:label,exact:true}).click();
      await page.locator(selector).waitFor();
      await page.waitForTimeout(150); // ResizeObserver publishes nav height after safe-area/width changes.
      await noScroll(selector);
      if (width === 390 && bottom === 34 && top === 0) await page.screenshot({path:`.tmpwork/viewport-${selector.slice(1)}.png`});
    }
  }
  await page.evaluate(() => { document.documentElement.style.removeProperty('--app-safe-top'); document.documentElement.style.removeProperty('--app-safe-bottom'); });
  await page.setViewportSize({width:390,height:844});
  await home();
  await page.getByRole('button',{name:'学習状況',exact:true}).click();
  await page.getByRole('dialog',{name:'学習状況・その他',exact:true}).waitFor();
  await page.keyboard.press('Escape');
  assert.equal(await page.getByRole('button',{name:'学習状況',exact:true}).evaluate(e=>e===document.activeElement),true);
  await noScroll('.game-home');
  await page.getByRole('combobox',{name:'学習する科目'}).selectOption('math');
  assert.equal(await page.getByRole('combobox',{name:'学習する科目'}).inputValue(),'math');
  const nav=page.getByRole('navigation',{name:'メインナビゲーション',exact:true});
  assert.equal(await nav.getByRole('button').count(),6);
  await nav.getByRole('button',{name:'ガチャ・マイページへ移動',exact:true}).click();
  const combined=page.getByRole('navigation',{name:'ガチャとマイページの切り替え',exact:true});
  await combined.getByRole('button',{name:'マイページ',exact:true}).click();
  await page.getByRole('heading',{name:'学ぶ。ためる。自分らしく。'}).waitFor();
  await combined.getByRole('button',{name:'ガチャ',exact:true}).click();
  const previewBefore = await wallet();
  const previewLabel = await page.locator('.gacha-preview-info strong').innerText();
  await page.getByRole('button',{name:'次の装飾をプレビュー',exact:true}).click();
  assert.notEqual(await page.locator('.gacha-preview-info strong').innerText(),previewLabel);
  await page.getByRole('button',{name:'前の装飾をプレビュー',exact:true}).click();
  assert.equal(await page.locator('.gacha-preview-info strong').innerText(),previewLabel);
  assert.deepEqual(await wallet(),previewBefore);
  const collectionBefore = await wallet();
  await page.getByRole('button',{name:'コレクション・提供割合を見る',exact:true}).click();
  const collection = page.getByRole('dialog',{name:'装飾コレクション・提供割合',exact:true});
  await collection.waitFor();
  assert.equal(await collection.locator('.gacha-collection-grid li').count(),16);
  assert.equal(await collection.locator('.gacha-collection-grid img').count(),16);
  await collection.getByRole('button',{name:'所持済み',exact:true}).click();
  assert.equal(await collection.locator('.gacha-collection-grid li[data-owned=true]').count(),16);
  await collection.getByRole('button',{name:'未所持',exact:true}).click();
  assert.equal(await collection.locator('.gacha-collection-grid li').count(),0);
  await collection.getByText('全種類コレクション済みです。').waitFor();
  await collection.getByRole('button',{name:'すべて',exact:true}).click();
  await page.screenshot({path:'.tmpwork/gacha-collection.png'});
  await collection.getByRole('button',{name:'閉じる',exact:true}).click();
  assert.deepEqual(await wallet(),collectionBefore,'collection previews must not spend coins or equip items');
  assert.equal(await page.getByRole('button',{name:'コレクション・提供割合を見る',exact:true}).evaluate(e=>e===document.activeElement),true);
  await noScroll('.mana-hub-gacha');
  await page.getByRole('button',{name:/ガチャを1回引く/}).click();
  assert.equal((await wallet()).progress.coins,100);await page.getByRole('button',{name:'キャンセル',exact:true}).click();
  assert.equal((await wallet()).progress.coins,100);
  await page.getByRole('button',{name:/ガチャを1回引く/}).click();await page.getByRole('button',{name:'50枚で確定する',exact:true}).click();
  await page.locator('.gacha-result').waitFor();assert.equal((await wallet()).progress.coins,70);
  assert.equal((await wallet()).receipts.filter(r=>r.startsWith('gacha:')).length,1);
  assert.match(await page.locator('.gacha-result').innerText(),/重複.*20/s);
  await page.getByRole('button',{name:'この装飾をつける',exact:true}).click();
  await page.getByText('装備しました。ホームと対戦に反映されます。').waitFor();
  await page.screenshot({path:'.tmpwork/arena-production-gacha.png'});await home();
  assert.match(await page.locator('[data-mana-coins]').innerText(),/70/);
  await page.reload({waitUntil:'domcontentloaded'});await page.locator('.launch-start').click();await page.locator('[data-mana-dashboard]').waitFor();assert.equal((await wallet()).progress.coins,70);
  await page.getByRole('button',{name:'オンライン対戦へ移動',exact:true}).click();
  await page.getByRole('button',{name:'AIと対戦する',exact:true}).click();
  await page.getByRole('button',{name:/英単語・英熟語/}).click();
  await page.getByRole('button',{name:/全単元|すべての単元/}).first().click();
  await page.locator('#battle-ai-easy').click();await page.getByRole('button',{name:'はじめる',exact:true}).waitFor();
  const before=await wallet();await page.clock.install();await page.getByRole('button',{name:'はじめる',exact:true}).click();
  await page.clock.fastForward(100);
  await page.getByRole('timer',{name:'開始まで7秒'}).waitFor();
  assert.equal(await page.locator('#battle-question').count(),0);
  for(let n=6;n>=1;n--) {
    await page.clock.fastForward(1000);
    await page.getByRole('timer',{name:`開始まで${n}秒`}).waitFor();
    assert.equal(await page.locator('#battle-question').count(),0);
  }
  await page.screenshot({path:'.tmpwork/battle-ready-7sec.png'});
  await page.clock.fastForward(1000);
  await page.getByRole('timer',{name:'対戦開始'}).waitFor();
  assert.equal(await page.locator('#battle-question').count(),0);
  await page.clock.fastForward(600);await page.locator('#battle-question').waitFor();
  await page.screenshot({path:'.tmpwork/arena-production-live.png'});
  for(let i=0;i<30;i++) {
    if(await page.locator('#battle-result-growth').count())break;
    const answer=page.locator('#battle-question button:enabled').first();
    if(await answer.count())await answer.click();
    await page.clock.fastForward(60000);await page.waitForTimeout(80);
  }
  await page.locator('#battle-result-growth').waitFor({timeout:15000});
  const after=await wallet();assert.equal(after.progress.matches,(before.progress.matches||0)+1);
  assert.ok(after.progress.coins>=before.progress.coins+10,'active completion earns coins');
  assert.ok(await page.locator('.arena-reward').getByText(/完走/).count());
  assert.equal(await page.getByRole('button',{name:/演習する/}).count(),0,'vocab never links to unavailable study');
  assert.equal(await page.evaluate(()=>localStorage.getItem('battle_xp_guest')),null);
  await page.clock.fastForward(4000);assert.equal((await wallet()).progress.coins,after.progress.coins);
  await page.screenshot({path:'.tmpwork/arena-production-result.png'});
  assert.deepEqual(errors,[]);
  console.log('PASS: production Home/menu primary controls fit 3 viewports; subject switch; own mascot; gacha confirmation/cancel/refund/equip/persistence; vocabulary AI completion and one shared coin/XP reward; no page errors.');
} finally { await browser.close(); }
