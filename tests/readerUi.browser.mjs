// TMPDIR=$PWD/.tmpwork node tests/readerUi.browser.mjs (Vite on port 3000)
import { chromium } from 'playwright';
import assert from 'node:assert/strict';
const browser = await chromium.launch();
try {
  const page=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});
  const errors=[]; page.on('pageerror',error=>errors.push(error.message));
  await page.goto(process.env.QUIZ_TEST_URL || 'http://localhost:3000',{waitUntil:'domcontentloaded'});
  await page.evaluate(async()=>{
    const R=(await import('/node_modules/.vite/deps/react.js')).default;
    const D=await import('/node_modules/.vite/deps/react-dom_client.js');
    const {LearningViewer}=await import('/src/components/LearningViewer.tsx');
    const {ModeSelection}=await import('/src/components/ModeSelection.tsx');
    const {ChapterSelection}=await import('/src/components/ChapterSelection.tsx');
    const {BattleMode}=await import('/src/battle/ui/BattleMode.tsx');
    document.getElementById('root').style.display='none';
    const host=document.createElement('div'); host.id='reader-test-host'; document.body.append(host);
    window.readerMount=(kind,props={})=>{
      window.testRoot?.unmount();host.innerHTML='';
      window.testRoot=(D.createRoot||D.default.createRoot)(host);
      window.testRoot.render(R.createElement({reader:LearningViewer,mode:ModeSelection,chapters:ChapterSelection,battle:BattleMode}[kind],{onBack(){},onExit(){},...props}));
    };
    window.print=()=>{
      window.lastPrint={classes:document.body.className,title:document.title,modal:!!document.querySelector('dialog[open]')};
      window.dispatchEvent(new Event('afterprint'));
    };
  });
  const fit=async label=>assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),label+' horizontal overflow');
  const inViewport=async locator=>{
    const box=await locator.boundingBox();const size=page.viewportSize();
    assert.ok(box && box.x>=0 && box.y>=0 && box.x+box.width<=size.width+1 && box.y+box.height<=size.height+1,JSON.stringify(box));
  };
  const sources=[['math','mc1'],['chemistry_basic','1-1'],['chemistry','adv-3'],['biology_basic','bio-basic']];
  for (const viewport of [{width:320,height:568},{width:390,height:844},{width:667,height:375},{width:1280,height:900}]) {
    await page.setViewportSize(viewport);
    for (const [subject,initialTab] of sources) {
      await page.evaluate(props=>window.readerMount('reader',props),{subject,initialTab});
      await page.locator('.learning-content').waitFor();
      await page.getByRole('button',{name:'標準',exact:true}).click();
      const metrics=await page.locator('.learning-content p').first().evaluate(e=>({width:e.getBoundingClientRect().width,font:parseFloat(getComputedStyle(e).fontSize)}));
      assert.ok(metrics.font>=16,`${subject}: ${metrics.font}`);
      if (viewport.width<640) assert.ok(metrics.width>=viewport.width-40,`${subject} narrow reading area: ${metrics.width}`);
      await fit(subject);
      await page.getByRole('button',{name:'印刷 / PDF',exact:true}).click();
      const dialog=page.getByRole('dialog',{name:'印刷・PDFに保存'});await dialog.waitFor();
      await inViewport(dialog);
      assert.equal(await dialog.evaluate(e=>e.parentElement===document.body && e.matches(':modal')),true);
      for(let i=0;i<8;i++) {await page.keyboard.press('Tab');assert.equal(await dialog.evaluate(e=>e.contains(document.activeElement)),true);}
      await page.keyboard.press('Escape');
      await dialog.waitFor({state:'hidden'});
      assert.equal(await page.locator('.reader-print-button').evaluate(e=>e===document.activeElement),true);
      for (const mode of ['answers','blank']) {
        await page.getByRole('button',{name:'印刷 / PDF',exact:true}).click();
        await dialog.getByRole('button',{name:mode==='answers'?'解答つきで印刷':'解答を伏せて印刷',exact:false}).click();
        const snap=await page.evaluate(()=>window.lastPrint);
        assert.ok(snap.classes.includes('lc-print-'+mode));
        assert.equal(snap.modal,false);
        assert.ok(snap.title.includes('まとめプリント'));
        await dialog.waitFor({state:'hidden'});
        assert.equal(await page.evaluate(()=>/lc-print-(answers|blank)/.test(document.body.className)),false);
      }
    }
  }
  await page.setViewportSize({width:390,height:844});
  await page.evaluate(()=>window.readerMount('reader',{subject:'math',initialTab:'mc1'}));
  await page.getByLabel('読むテーマ',{exact:true}).selectOption('mc1_algebra');
  assert.equal(await page.locator('[data-math-unit]').count(),1);
  await page.locator('.learning-content summary').first().click();
  await page.getByRole('button',{name:'大きめ',exact:true}).click();
  assert.equal(await page.locator('.learning-content details').first().getAttribute('open'),'');
  assert.equal(await page.locator('.learning-content p').first().evaluate(e=>getComputedStyle(e).fontSize),'19px');
  await page.getByRole('button',{name:'印刷 / PDF',exact:true}).click();
  await page.getByRole('button',{name:'解答つきで印刷',exact:false}).click();
  assert.ok((await page.evaluate(()=>window.lastPrint.title)).includes('数と式・実数'));
  await page.getByLabel('次のテーマ',{exact:true}).click();
  await page.locator('[data-math-unit="mc1_logic"]').waitFor();
  await page.getByLabel('前のテーマ',{exact:true}).click();
  await page.locator('[data-math-unit="mc1_algebra"]').waitFor();
  await page.evaluate(()=>window.readerMount('reader',{subject:'math',initialTab:'mc1'}));
  await page.locator('.learning-reader[data-reading-size="large"]').waitFor();
  await page.getByRole('button',{name:'標準',exact:true}).click();
  await page.getByLabel('読む章を選ぶ').selectOption('mc2');
  await page.getByLabel('読むテーマ',{exact:true}).selectOption('mc2_locus');
  await page.screenshot({path:'.tmpwork/ui-reader-mobile.png'});
  await page.getByRole('button',{name:'印刷 / PDF',exact:true}).click();
  await page.screenshot({path:'.tmpwork/ui-print-mobile.png'});
  await page.getByRole('button',{name:'読んでいた場所に戻る'}).click();
  // Browser print media/PDF keeps the established A4 presentation, not the screen UI.
  await page.emulateMedia({media:'print'});
  await page.evaluate(()=>document.body.classList.add('lc-print-answers'));
  assert.equal(await page.locator('.reader-header').isVisible(),false);
  assert.equal(await page.locator('.reader-settings').isVisible(),false);
  await page.pdf({path:'.tmpwork/ui-reader-answers.pdf',format:'A4',printBackground:true});
  await page.evaluate(()=>{document.body.classList.remove('lc-print-answers');document.body.classList.add('lc-print-blank');});
  await page.pdf({path:'.tmpwork/ui-reader-blank.pdf',format:'A4',printBackground:true});
  await page.evaluate(()=>document.body.classList.remove('lc-print-blank'));
  await page.emulateMedia({media:'screen'});
  // Study entry and unit actions still navigate to their real existing callbacks.
  for (const width of [320,390,1280]) {
    await page.setViewportSize({width,height:width===320?568:900});
    await page.evaluate(()=>window.readerMount('mode',{subject:'math',onSelectMode:mode=>window.pickedMode=mode,onBattle(){},onChangeSubject(){}}));
    await page.locator('.mode-desk').waitFor();await fit('mode');
    assert.ok(await page.locator('.mode-practice-copy p').evaluate(e=>parseFloat(getComputedStyle(e).fontSize)>=14));
    await page.getByRole('button',{name:'学習(インプット)を開く'}).click();
    assert.equal(await page.evaluate(()=>window.pickedMode),'learning');
    await page.getByRole('button',{name:'演習問題の単元を選ぶ'}).click();
    assert.equal(await page.evaluate(()=>window.pickedMode),'practice');
    if(width===390) await page.screenshot({path:'.tmpwork/ui-study-mobile.png'});
    await page.evaluate(()=>window.readerMount('chapters',{subject:'math',mode:'practice',onSelectChapter:(...args)=>window.pickedChapter=args}));
    await page.locator('[data-unit-id="mc1_algebra"]').waitFor();await fit('chapters');
    const card=page.locator('[data-unit-id="mc1_algebra"]');
    await card.getByRole('button',{name:'問題を選ぶ',exact:true}).click();
    const choice=card.locator('.chapter-question-list button').last();
    assert.ok((await choice.boundingBox()).height>=44);
    await choice.click();
    assert.deepEqual(await page.evaluate(()=>window.pickedChapter),['mc1_algebra',3,false]);
    await page.evaluate(()=>window.readerMount('battle',{initialSubject:'math'}));
    await page.locator('.battle-lobby').waitFor();await fit('battle lobby');
    await page.getByRole('button',{name:/AI.*対戦/}).first().click();
    await page.locator('#battle-subject-math').waitFor();
  }
  assert.deepEqual(errors,[]);
  console.log('PASS: 16 responsive reader/print layouts; bounded native modal, keyboard focus, both print modes, text preferences, topic navigation, print PDFs, and study/practice/battle actions.');
} finally {await browser.close();}
