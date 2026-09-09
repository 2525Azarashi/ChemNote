// Against a running Vite server: TMPDIR=$PWD/.tmpwork node tests/growth.browser.mjs
import { chromium } from 'playwright';
import assert from 'node:assert/strict';
const browser = await chromium.launch();
const errors = [];
try {
  const page = await browser.newPage({viewport:{width:375,height:812},reducedMotion:'reduce'});
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto(process.env.QUIZ_TEST_URL || 'http://localhost:3000');
  await page.evaluate(async()=>{
    const R=(await import('/node_modules/.vite/deps/react.js')).default;
    const D=await import('/node_modules/.vite/deps/react-dom_client.js');
    const {BattleMode}=await import('/src/battle/ui/BattleMode.tsx');
    const {BattleResult}=await import('/src/battle/ui/BattleResult.tsx');
    const {BattleAiRoomScreen}=await import('/src/battle/ui/BattleAiRoomScreen.tsx');
    window.store=await import('/src/battle/data/growthStore.ts');
    window.core=await import('/src/battle/core/growth.ts');
    window.key=window.store.GROWTH_STORAGE_PREFIX+'guest';
    document.getElementById('root').style.display='none';
    const host=document.createElement('div');document.body.append(host);
    window.mountGrowth=(kind='mode',props={})=>{
      window.qaRoot?.unmount();
      window.qaRoot=(D.createRoot||D.default.createRoot)(host);
      window.qaRoot.render(R.createElement(kind==='result'?BattleResult:kind==='ai'?BattleAiRoomScreen:BattleMode,{onExit:()=>{},...props}));
    };
    window.progress=()=>JSON.parse(localStorage.getItem(window.key)||'null')?.progress;
    localStorage.removeItem(window.key); window.mountGrowth();
  });
  const progress=()=>page.evaluate(()=>window.progress());
  const fit=async()=>assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'horizontal page overflow');
  await page.getByRole('button',{name:'日替わりボーナス',exact:true}).click();
  await page.getByRole('dialog').waitFor();
  assert.equal((await progress()).coins,10);
  await page.keyboard.press('Tab');
  assert.ok(await page.getByRole('dialog').evaluate(e=>e.contains(document.activeElement)));
  await page.keyboard.press('Escape');
  assert.equal(await page.getByRole('dialog').count(),0);
  assert.equal(await page.getByRole('button',{name:'本日受取済み'}).isDisabled(),true);
  await page.getByRole('button',{name:'称号・きせかえ',exact:true}).click();
  await page.locator('#battle-profile-header').waitFor();await fit();
  assert.equal(await page.getByRole('switch').getAttribute('aria-checked'),'false');
  await page.getByRole('button',{name:'教科別',exact:true}).click();
  assert.ok(await page.getByText('まだ対戦の記録がありません。',{exact:true}).count());
  await page.getByRole('button',{name:'もどる',exact:true}).click();
  await page.evaluate(()=>{const x=JSON.parse(localStorage.getItem(window.key));x.progress.coins=100;localStorage.setItem(window.key,JSON.stringify(x));window.mountGrowth();});
  await page.getByRole('button',{name:'称号・きせかえ',exact:true}).click();
  await page.getByRole('button',{name:/さくら.*80 コイン/}).click();
  assert.equal((await progress()).coins,100);
  await page.getByRole('button',{name:/さくら.*もう一度タップで交換/}).click();
  await page.waitForFunction(()=>window.progress()?.equipped.frame==='frame_pink');
  assert.equal((await progress()).coins,20);
  assert.equal(await page.getByRole('button',{name:/さくら.*装備中/}).isDisabled(),true);
  await page.setViewportSize({width:320,height:568});await fit();
  await page.screenshot({path:'.tmpwork/growth-final-profile-320.png',fullPage:true});
  // Exercise the actual review-list callback, not just the reward function.
  await page.evaluate(async()=>{
    const reviews=await import('/src/utils/reviewList.ts');
    for(let i=0;i<3;i++) {
      reviews.captureWrongAnswers('guest',[{chapterId:'c1',questionId:'q'+i,subQuestionId:'s',questionText:'test',correctAnswer:'a',wrongAnswer:'b'}]);
      const k='c1::q'+i+'::s';reviews.markReviewedCorrect('guest',k);reviews.markReviewedCorrect('guest',k);
    }
  });
  await page.waitForFunction(()=>window.progress()?.holesFilled===3);
  await page.getByRole('button',{name:'もどる',exact:true}).click();
  await page.getByRole('button',{name:'ミッション',exact:true}).click();
  await page.locator('#battle-missions-summary').waitFor();await fit();
  const before=(await progress()).coins;
  await page.getByRole('button',{name:'うけとる',exact:true}).click();
  await page.waitForFunction(n=>window.progress().coins>n,before);
  assert.equal(await page.getByRole('button',{name:'うけとる',exact:true}).count(),0);
  await page.screenshot({path:'.tmpwork/growth-final-missions-320.png',fullPage:true});
  // Render the actual result component and exercise reward publication + replay.
  await page.evaluate(()=>{
    const score={uid:'guest',score:100,correctCount:1,totalTime:2,maxStreak:1,perQuestion:[{index:0,correct:true,timeUsed:2,base:100,speed:0,streak:0,total:100}]};
    window.resultProps={result:{me:score,opponent:{...score,score:0},outcome:'win',decidedByTime:false,needsSuddenDeath:false},questions:[],subject:'math',opponent:null,meNickname:'あなた',rating:null,ratingNote:'AI対戦ではレートは動きません',byForfeit:false,maskOpponent:false,growthMatchId:'ai:browser-result',growthOwnerUid:'guest',growthEligible:true};
    window.mountGrowth('result',window.resultProps);
  });
  await page.locator('#battle-result-growth').waitFor();await fit();
  assert.equal((await progress()).matches,1);
  assert.ok((await progress()).owned.includes('pose_good'));
  await page.screenshot({path:'.tmpwork/growth-final-result-320.png',fullPage:true});
  await page.evaluate(()=>window.mountGrowth('result',window.resultProps));
  await page.locator('#battle-result-growth').waitFor();assert.equal((await progress()).matches,1);
  // Real AI hook and game timers. Inactivity completes five questions without changing ratings.
  await page.clock.install();
  await page.evaluate(()=>window.mountGrowth('ai',{subject:'chemistry_basic',level:'easy',matchNo:1,questionCount:5,onRematch:()=>{},onChangeLevel:()=>{}}));
  await page.getByRole('button',{name:'はじめる',exact:true}).click();
  for(let i=0;i<12;i++) { await page.clock.fastForward(60000);await page.waitForTimeout(50);if(await page.locator('#battle-result-growth').count())break; }
  await page.locator('#battle-result-growth').waitFor({timeout:10000});
  assert.equal((await progress()).matches,2);
  await page.clock.fastForward(3000);assert.equal((await progress()).matches,2);
  assert.deepEqual(errors,[]);
  console.log('PASS: growth navigation, daily bonus, dialog keyboard, equipment purchase, reviews, mission claim, result replay, real AI completion, 320px layouts.');
}finally{await browser.close();}
