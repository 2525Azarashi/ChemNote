// Built production assets required. TMPDIR=$PWD/.tmpwork node tests/mascotAudit.browser.mjs
import { chromium } from 'playwright';
import assert from 'node:assert/strict';
const url=process.env.PRODUCTION_TEST_URL || 'http://localhost:4173';
const browser=await chromium.launch({args:['--disable-dev-shm-usage']});
try {
 const context=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'no-preference'});
 await context.route('**/*',r=>r.request().url().startsWith(url)?r.continue():r.abort());
 const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(()=>{
  window.__audioPlays=0;window.__tones=0;
  const play=HTMLMediaElement.prototype.play;
  HTMLMediaElement.prototype.play=function(...args){window.__audioPlays++;return play.apply(this,args);};
  const create=AudioContext.prototype.createOscillator;
  AudioContext.prototype.createOscillator=function(...args){const node=create.apply(this,args);const start=node.start;node.start=function(...a){window.__tones++;return start.apply(this,a);};return node;};
  if(localStorage.getItem('mascot-audit-seeded'))return;
  localStorage.setItem('mascot-audit-seeded','true');localStorage.setItem('savedAppState','home');localStorage.setItem('isGuest','true');localStorage.setItem('bgm_enabled','off');
  // Fixture inventory only; all equips below are actual UI actions.
  localStorage.setItem('battle_growth_local_v1_guest',JSON.stringify({version:1,progress:{uid:'guest',coins:500,xp:500,wins:1,badges:{b_first_win:Date.now()},owned:['pose_basic','frame_paper','pose_cheering','pose_sleeping','frame_ocean'],equipped:{pose:'pose_basic',frame:'frame_paper',title:''}},receipts:[],day:''}));
 });
 const wallet=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('battle_growth_local_v1_guest')).progress);
 const home=async()=>{await page.getByRole('button',{name:'ホーム画面へ移動',exact:true}).click();await page.locator('.game-home-hud').waitFor();};
 await page.goto(url,{waitUntil:'domcontentloaded'});await page.locator('.walk-ready').waitFor();
 // Sample real CSS animations deterministically without slowing the test.
 const sample=async(ms)=>{
  await page.locator('.launch-arrival').evaluate((el,t)=>{for(const a of el.getAnimations({subtree:true})){a.pause();a.currentTime=t;}},ms);
  return page.locator('.launch-arrival').boundingBox();
 };
 const start=await sample(0);const middle=await sample(900);const end=await sample(1800);
 assert.ok(start.x<middle.x && middle.x<end.x,'mascot walks toward the center');
 assert.equal(await page.locator('.launch-equipped-pose').evaluate(e=>getComputedStyle(e).opacity),'1');
 assert.equal(await page.locator('.launch-walking-pose').evaluate(e=>getComputedStyle(e).opacity),'0');
 await sample(900);await page.screenshot({path:'.tmpwork/audit-title-walking.png'});await sample(1800);
 assert.ok(await page.locator('.launch-start').isEnabled(),'animation never blocks starting');
 // Regression: a title interaction previously prevented <audio> starting after mount.
 await page.getByRole('button',{name:'BGMをオンにする',exact:true}).click();await page.waitForTimeout(100);
 await page.locator('.launch-start').click();await page.locator('.game-home-hud').waitFor();
 await page.waitForFunction(()=>document.querySelector('audio')?.currentTime>0.05);
 assert.ok(await page.evaluate(()=>window.__audioPlays>0 && !document.querySelector('audio').paused));
 await page.getByRole('button',{name:'BGMを止める',exact:true}).click();
 await page.waitForFunction(()=>document.querySelector('audio').paused);
 await page.getByRole('button',{name:'きせかえ',exact:true}).click();
 await page.getByRole('button',{name:/応援.*タップで装備/}).click();
 await page.getByRole('button',{name:/マリン.*タップで装備/}).click();await home();
 assert.match(await page.locator('.home-mascot-art').getAttribute('src'),/cheering\.png/);
 assert.equal(await page.locator('.game-equipped-ring').evaluate(e=>getComputedStyle(e).borderTopColor),'rgb(77, 147, 174)');
 await page.getByRole('button',{name:'称号',exact:true}).click();
 await page.getByRole('button',{name:/初勝利/}).click();await home();
 assert.equal(await page.locator('.game-stage-caption').innerText(),'初勝利');
 assert.equal((await wallet()).coins,500,'equipping owned items costs no extra coins');
 await page.screenshot({path:'.tmpwork/audit-home-equipped.png'});
 await page.reload({waitUntil:'domcontentloaded'});await page.locator('.walk-ready').waitFor();await sample(1800);
 assert.match(await page.locator('.launch-equipped-pose').getAttribute('src'),/cheering\.png/);
 assert.equal(await page.locator('.launch-stage-floor').evaluate(e=>getComputedStyle(e).borderTopColor),'rgb(77, 147, 174)');
 assert.ok(await page.getByRole('button',{name:'BGMをオンにする',exact:true}).count(),'OFF preference survives reload');
 await page.locator('.launch-start').click();await page.locator('.game-home-hud').waitFor();
 assert.match(await page.locator('.home-mascot-art').getAttribute('src'),/cheering\.png/);
 assert.equal(await page.locator('.game-stage-caption').innerText(),'初勝利');
 await page.getByRole('button',{name:'オンライン対戦へ移動',exact:true}).click();
 await page.getByRole('button',{name:'AIと対戦する',exact:true}).click();
 await page.getByRole('button',{name:/英単語・英熟語/}).click();
 await page.getByRole('button',{name:/全単元|すべての単元/}).first().click();
 await page.locator('#battle-ai-easy').click();await page.getByRole('button',{name:'はじめる',exact:true}).click();
 await page.locator('.arena-fighter.mine img').waitFor();
 assert.match(await page.locator('.arena-fighter.mine img').getAttribute('src'),/cheering\.png/);
 await page.waitForFunction(()=>window.__tones>0);
 assert.ok(await page.locator('.arena-background-fx i').count());
 assert.ok(await page.evaluate(()=>document.querySelector('audio').paused),'normal BGM does not mix into battle');
 await page.screenshot({path:'.tmpwork/audit-battle-equipped.png'});
 assert.deepEqual(errors,[]);
 // A fresh reduced-motion context must show the equipped image immediately.
 const reduced=await browser.newContext({viewport:{width:320,height:568},reducedMotion:'reduce'});
 await reduced.route('**/*',r=>r.request().url().startsWith(url)?r.continue():r.abort());
 const quiet=await reduced.newPage();await quiet.goto(url,{waitUntil:'domcontentloaded'});await quiet.locator('.walk-ready').waitFor();
 assert.equal(await quiet.locator('.launch-arrival').evaluate(e=>getComputedStyle(e).animationName),'none');
 assert.equal(await quiet.locator('.launch-equipped-pose').evaluate(e=>getComputedStyle(e).opacity),'1');
 assert.ok(await quiet.getByRole('button',{name:'BGMをオフにする',exact:true}).count(),'fresh normal BGM default is ON');
 await quiet.screenshot({path:'.tmpwork/audit-title-reduced-motion.png'});
 await reduced.close();await context.close();
 console.log('PASS: walk-in trajectory, pose transition, reduced motion, immediate Start, title audio regression, OFF persistence, actual pose/frame/title equips, home and reload persistence, battle avatar and synthesized audio.');
}finally{await browser.close();}
