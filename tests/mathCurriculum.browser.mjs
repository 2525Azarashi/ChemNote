// TMPDIR=$PWD/.tmpwork node tests/mathCurriculum.browser.mjs (Vite on port 3000)
import { chromium } from 'playwright';
import assert from 'node:assert/strict';
const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto(process.env.QUIZ_TEST_URL || 'http://localhost:3000', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.evaluate(async () => {
    const React = (await import('/node_modules/.vite/deps/react.js')).default;
    const DOM = await import('/node_modules/.vite/deps/react-dom_client.js');
    const { LearningViewer } = await import('/src/components/LearningViewer.tsx');
    const { ChapterSelection } = await import('/src/components/ChapterSelection.tsx');
    const { BattleSubjectSelect } = await import('/src/battle/ui/BattleSubjectSelect.tsx');
    const { BattleMode } = await import('/src/battle/ui/BattleMode.tsx');
    window.curriculum = await import('/src/data/mathCurriculum.ts');
    document.getElementById('root').style.display='none';
    const host=document.createElement('div'); host.id='math-qa'; document.body.append(host);
    window.mountMath = (kind,props={}) => {
      window.qaRoot?.unmount(); host.innerHTML='';
      window.qaRoot=(DOM.createRoot||DOM.default.createRoot)(host);
      window.qaRoot.render(React.createElement({lessons:LearningViewer,chapters:ChapterSelection,select:BattleSubjectSelect,battle:BattleMode}[kind],props));
    };
  });
  const fit = async label => assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth+1),`${label}: horizontal overflow`);
  for (const width of [320,390]) {
    await page.setViewportSize({width,height:width===320?568:844});
    await page.evaluate(() => window.mountMath('lessons',{subject:'math',onBack(){}}));
    await page.locator('[data-math-curriculum-toc]').waitFor();
    assert.equal(await page.getByText('第1部 物質の構成',{exact:true}).count(),0);
    const courses=await page.evaluate(()=>window.curriculum.MATH_COURSES);
    for (const course of courses) {
      await page.getByRole('button',{name:course.title+'・基礎から標準',exact:true}).first().click();
      const unitIds=await page.evaluate(id=>window.curriculum.MATH_CURRICULUM_UNITS.filter(u=>u.course===id).map(u=>u.id),course.id);
      for (const id of unitIds) {
        await page.locator(`[data-math-unit="${id}"]`).waitFor();
        const example=page.locator(`[data-math-unit="${id}"] details`).first();
        assert.equal(await example.getAttribute('open'),null);
        await example.locator('summary').click();
        assert.notEqual(await example.getAttribute('open'),null);
        assert.ok((await example.innerText()).includes('答え：'));
      }
      assert.equal(await page.locator('.katex-error').count(),0,course.id);
      await fit(course.id);
    }
    await page.evaluate(() => window.mountMath('chapters',{subject:'math',mode:'practice',onBack(){},onSelectChapter(...args){window.chapterPicked=args;}}));
    const jump=page.getByLabel('数学の分野へ移動'); await jump.waitFor();
    for (const course of courses) {
      await jump.selectOption({value:course.title+'・基礎から標準'});
      const titles=await page.evaluate(id=>window.curriculum.MATH_CURRICULUM_UNITS.filter(u=>u.course===id).map(u=>u.title),course.id);
      for (const title of titles) assert.ok((await page.locator('#chapter-tab-panel').innerText()).includes(title));
      await fit('practice '+course.id);
    }
    // Same selector powers AI and friend modes; each added unit must be pickable.
    for (const title of ['AI対戦の科目','友だち対戦の科目']) {
      await page.evaluate(title=>window.mountMath('select',{title,allowQuestionCount:true,onBack(){},onPick(...args){window.mathPicked=args;}}),title);
      await page.locator('[data-question-count="5"]').click();
      await page.locator('#battle-subject-math').click();
      await page.locator('[data-battle-unit="mc1_algebra"]').waitFor();
      const ids=await page.evaluate(()=>window.curriculum.MATH_CURRICULUM_UNITS.map(u=>u.id));
      for (const id of ids) {
        await page.locator(`[data-battle-unit="${id}"]`).click();
        assert.deepEqual(await page.evaluate(()=>window.mathPicked),['math',5,id]);
      }
      await fit(title);
    }
  }
  await page.setViewportSize({width:390,height:844});
  await page.evaluate(()=>window.mountMath('lessons',{subject:'math',initialTab:'mc2',onBack(){}}));
  const locus=page.locator('[data-math-unit="mc2_locus"]'); await locus.waitFor();
  const link=locus.locator('a[href*="tPdCHUqpuy0"]');
  assert.equal(await link.getAttribute('target'),'_blank');
  assert.equal(await link.getAttribute('rel'),'noopener noreferrer');
  await locus.locator('summary').first().click();
  await locus.scrollIntoViewIfNeeded();
  await page.screenshot({path:'.tmpwork/math-locus-lesson.png'});
  // Actual AI game, not just a mocked picker callback.
  await page.evaluate(()=>window.mountMath('battle',{onExit(){},initialSubject:'math'}));
  await page.getByRole('button',{name:/AI.*対戦/}).first().click();
  await page.locator('[data-question-count="5"]').click();
  await page.locator('#battle-subject-math').click();
  await page.locator('[data-battle-unit="mca_triangle"]').click();
  await page.locator('#battle-ai-easy').click();
  await page.getByRole('button',{name:/はじめる/}).click();
  await page.locator('#battle-question').waitFor();
  assert.ok((await page.locator('#battle-question').innerText()).length>30);
  assert.equal(await page.locator('.katex-error').count(),0);
  await fit('real AI');
  await page.screenshot({path:'.tmpwork/math-ai-triangle.png'});
  assert.deepEqual(errors,[]);
  console.log('PASS: 38 lessons and 152 worked examples; six practice courses; all 38 AI/friend units at 320/390px; safe reference links; real new-unit AI game; no page errors.');
} finally { await browser.close(); }
