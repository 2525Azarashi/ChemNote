import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { MATH_COURSES, MATH_CURRICULUM_UNITS as units, MATH_VIDEO_REFERENCES, buildCurriculumProblems } from '../src/data/mathCurriculum';
import { getAllMathChapters, getMathStats } from '../src/data/mathData';
import { MATH_CURRICULUM_HTML, MATH_CURRICULUM_PARTS } from '../src/data/learningContent/math_curriculum';
import { isAnswerCorrect } from '../src/utils/answerJudge';
import { normalizeNotation, isEquivalentAnswer } from '../src/utils/answerEquivalence';
import { loadPool } from '../src/battle/data/battlePool';
import { loadReviewExplanation } from '../src/battle/ui/BattleReviewDetails';
import { drawQuestionIds, effectiveRule } from '../src/battle/data/battle';
import { BattleText } from '../src/battle/ui/BattleText';
import { LearningViewer } from '../src/components/LearningViewer';

// Test-only arithmetic evaluator, independent of the deliberately conservative
// production equivalence engine. No eval; only the grammar below is accepted.
function valueOf(source: string, x = 0): number {
  const sourceText = normalizeNotation(source).replace(/円$|°$|倍$/, '');
  const tokens = sourceText.match(/sqrt|exp|ln|log|sin|cos|(?:\d+(?:\.\d*)?|\.\d+)|[()+\-*/^√πex]/g) || [];
  if (tokens.join('') !== sourceText) throw new Error(`Unsupported arithmetic: ${source}`);
  let at = 0;
  function atom(): number {
    const t = tokens[at++];
    if (t === '(') {
      const n = sum();
      if (tokens[at++] !== ')') throw new Error('Missing closing parenthesis');
      return n;
    }
    if (t === 'π') return Math.PI;
    if (t === 'e') return Math.E;
    if (t === 'x') return x;
    const fns: Record<string,(n:number)=>number> = { sqrt:Math.sqrt, '√':Math.sqrt, exp:Math.exp, ln:Math.log, log:Math.log, sin:Math.sin, cos:Math.cos };
    if (fns[t]) return fns[t](unary());
    if (t && /^\d|^\./.test(t)) return Number(t);
    throw new Error(`Unexpected token: ${t}`);
  }
  function unary(): number {
    if (tokens[at] === '+') { at++; return unary(); }
    if (tokens[at] === '-') { at++; return -unary(); }
    const a = atom();
    if (tokens[at] === '^') { at++; return a ** unary(); }
    return a;
  }
  function product(): number {
    let n = unary();
    while (at < tokens.length && !['+', '-', ')'].includes(tokens[at])) {
      if (tokens[at] === '/') { at++; n /= unary(); }
      else { if (tokens[at] === '*') at++; n *= unary(); }
    }
    return n;
  }
  function sum(): number {
    let n = product();
    while (tokens[at] === '+' || tokens[at] === '-') {
      const op = tokens[at++]; n += (op === '+' ? 1 : -1) * product();
    }
    return n;
  }
  const result = sum();
  if (at !== tokens.length || !Number.isFinite(result)) throw new Error(`Invalid arithmetic: ${source}`);
  return result;
}

// Independent arithmetic recomputation from each stated problem, not values read
// from correctAnswer. Null entries are symbolic/logical problems reviewed below
// and covered by full rendering, single-correct-option and source-link checks.
const numeric: Record<string, (number | null)[]> = {
  mc1_algebra: [null, Math.sqrt(72)-Math.sqrt(8), null, 1/(Math.sqrt(5)+2)],
  mc1_logic: [null, null, null, 40-24-19+8],
  mc1_inequality: [null, null, null, 4-7],
  mc1_quadratic: [null, null, null, -8/2],
  mc1_extrema: [Math.max((0-2)**2+1,(5-2)**2+1), null, null, -((2-3)**2)+8],
  mc1_trigonometry: [5**2+7**2-2*5*7*Math.cos(Math.PI/3), 6/(2*Math.sin(Math.PI/6)), 4*9*Math.sin(Math.PI/6)/2, -Math.sqrt(1-(3/5)**2)],
  mc1_data: [[1,3,5,7].reduce((s,x)=>s+(x-4)**2,0)/4, (10+11)/2-(2+4)/2, null, 2*3],
  mc1_hypothesis: [0.5**5, null, null, 2*0.5**5],
  mca_triangle: [null, 12*2/3, null, 30/(20/2)],
  mca_circle: [180-72, Math.sqrt(4*9), 3*8/4, 100/2],
  mca_space: [Math.hypot(2,3,6), 2-8+12, null, 18*5/3],
  mca_activity: [parseInt('1101',2), null, null, parseInt('132',5)],
  mc2_expression: [10*2**2, 2**3+2*2**2-2+4, 2*Math.sqrt(9), 2+3],
  mc2_complex: [null, null, 5**2-2*7, -1],
  mc2_equations: [null, 2, (6-8)/2, 2],
  mc2_coordinate: [null, Math.abs(3+4*2-1)/Math.hypot(3,4), null, (1+2*7)/3],
  mc2_locus: [null, null, 2*6, 6/2],
  mc2_trig: [Math.sin(Math.PI/12), null, Math.hypot(3,4), 2*3/5*4/5],
  mc2_exponential: [Math.log2(16)-1, null, 27**(2/3), Math.log2(4)],
  mc2_logarithm: [Math.log2(8)+Math.log2(4), Math.sqrt(2**3+1), Math.log2(3)*Math.log(8)/Math.log(3), Math.floor(20*0.3010)+1],
  mc2_derivative: [null, null, (-1)**3-3*(-1), 6-2],
  mc2_integral: [2**3+2, 2**2-2**3/3, 0, 1/2+2*2/2],
  mcb_sequences: [5+9*3, 2*3**4, Array.from({length:8},(_,i)=>4+2*i).reduce((a,b)=>a+b), Array.from({length:6},(_,i)=>3*2**i).reduce((a,b)=>a+b)],
  mcb_sums: [Array.from({length:10},(_,i)=>2*(i+1)+1).reduce((a,b)=>a+b), 2+3+6+9, [1,2,3,4,5].reduce((s,k)=>s+1/(k*(k+1)),0), [1,2,3,4].reduce((s,k)=>s+k*k,0)],
  mcb_recurrence: [null, null, null, 3*(3*(3*2-2)-2)-2],
  mcb_distribution: [1.5-1, 10*0.3, 6*0.5**4, 3**2*5],
  mcb_normal: [(58-50)/Math.sqrt(16), (1-0.6826)/2, 12/Math.sqrt(36), 100/25],
  mcb_inference: [null, 1/Math.sqrt(4), (106-100)/(15/Math.sqrt(25)), Math.sqrt(0.5*0.5/400)],
  mcb_society: [10000*1.1**2, (500-100)/(40-20), null, 1000*0.9**2],
  mc3_functions: [null, null, 2+2, 1/(1+1)],
  mc3_limits: [3/2, 6/(1-1/3), null, 0],
  mc3_differentiation: [null, null, null, 3/(3+1)],
  mc3_applications: [Math.exp(-1), null, 2+0.04/(2*Math.sqrt(4)), 3*3**2-12*3],
  mc3_area: [-Math.cos(Math.PI/2)+Math.cos(0), Math.E-1, 2*2, Math.log(3)],
  mc3_volume: [Math.PI*2**3/3, Math.PI*4**2/2, Math.hypot(2,6), 3**3/3+3],
  mcc_curves: [null, null, null, 4*Math.cos(Math.PI/3)],
  mcc_complexplane: [Math.hypot(3,4), null, null, 3],
  mcc_representation: [1*2+2*1, 2, null, (2+2+3+3)/2],
};

describe('current six-course mathematics expansion', () => {
  it('adds 38 units and 152 exercises without removing the 33 legacy units', () => {
    expect(units).toHaveLength(38);
    expect(units.flatMap(u => u.exercises)).toHaveLength(152);
    expect(getAllMathChapters()).toHaveLength(71);
    expect(getAllMathChapters().filter(c => !c.id.startsWith('mc'))).toHaveLength(33);
    expect(getMathStats()).toEqual({ chapters: 71, questions: 217 });
    expect(new Set(units.map(u => u.id)).size).toBe(38);
    expect(Object.keys(numeric).sort()).toEqual(units.map(u => u.id).sort());
    for (const course of MATH_COURSES) {
      const chapters = units.filter(u => u.course === course.id);
      expect(chapters.length).toBeGreaterThanOrEqual(3);
      expect(MATH_CURRICULUM_PARTS[course.id].map(p => p.id)).toEqual(chapters.map(c => c.id));
    }
  });

  it.each(units)('$id: single correct option, aliases, explanations and independent arithmetic', unit => {
    const problems = buildCurriculumProblems(unit);
    expect(problems).toHaveLength(4);
    expect(problems.map(p => p.subQuestions[0].type)).toEqual(['multiple_choice','multiple_choice','multiple_choice','short_answer']);
    for (const [i,p] of problems.entries()) {
      const sub = p.subQuestions[0];
      const key = `${unit.id}/${i+1}`;
      expect(isAnswerCorrect(sub, sub.correctAnswer), key).toBe(true);
      expect(isAnswerCorrect(sub, ''), key).toBe(false);
      for (const alias of sub.acceptedAnswers || []) expect(isAnswerCorrect(sub, alias), key).toBe(true);
      if (sub.options) {
        expect(new Set(sub.options).size, key).toBe(4);
        expect(sub.options.filter((option: string) => isAnswerCorrect(sub, option)), key).toEqual([sub.correctAnswer]);
      }
      expect(p.explanation.length, key).toBeGreaterThan(25);
      for (const text of [p.text,p.explanation,...sub.options || [],sub.correctAnswer]) {
        const html = renderToStaticMarkup(React.createElement(BattleText, {text, subject:'math'}));
        expect(html, key+':'+text).not.toContain('katex-error');
        expect(text, key).not.toMatch(/\uFFFD|undefined|NaN/);
      }
      const expected = numeric[unit.id][i];
      if (expected != null) {
        expect(valueOf(sub.correctAnswer), `${key}: independent arithmetic`).toBeCloseTo(expected, 9);
      }
    }
  });

  it('checks symbolic identities and the domain-sensitive conclusions', () => {
    const answer = (id: string, i: number) => units.find(u=>u.id===id)!.exercises[i].answer;
    const symbolic: [string,number,string][] = [
      ['mc1_algebra',0,'x^2-7x+12'], ['mc2_derivative',0,'3*x^2-3'],
      ['mc2_trig',0,'(sqrt(6)-sqrt(2))/4'], ['mc3_functions',1,'x/3+2/3'],
      ['mc3_differentiation',0,'2*exp(2*x)'],
    ];
    for (const [id,i,value] of symbolic) for (const x of [-3,-1,0,1,2,5]) {
      expect(valueOf(answer(id,i),x),id).toBeCloseTo(valueOf(value,x),8);
    }
    // These must remain different sets, while notation variants stay accepted.
    expect(isEquivalentAnswer('x>-4','x<-4')).toBe(false);
    expect(isEquivalentAnswer('x>-4','x>4')).toBe(false);
    expect(isEquivalentAnswer('x≥3','x>3')).toBe(false);
    expect(isEquivalentAnswer('x≥3','x>=3')).toBe(true);
    expect(isEquivalentAnswer('Li > Na > K','Li→Na→K')).toBe(true);
    for (const k of [-20,-1,0,0.1,5,8.9,9,10,20]) {
      const rootsPositiveDistinct = 36-4*k>0 && k>0;
      expect(rootsPositiveDistinct).toBe(k>0 && k<9);
    }
    expect(answer('mc1_quadratic',2)).toBe('0<k<9');
    expect(answer('mc2_logarithm',1)).toBe('3');
    expect(answer('mc2_locus',0)).toBe('y=2x-5、x≥1');
    for (const x of [1,2,5,101]) {
      const t=Math.sqrt(x-1);
      expect(t*t+1).toBeCloseTo(x);
      expect(2*t*t-3).toBeCloseTo(2*x-5);
    }
    expect(answer('mc3_functions',0)).toBe('x≥3');
    expect(answer('mc3_applications',1)).toBe('二次導関数は0だが変曲点ではない');
    expect(answer('mc1_hypothesis',2)).toBe('帰無仮説を棄却する証拠が足りない');
    expect(answer('mc1_logic',1)).toBe('十分条件だが必要条件ではない');
  });

  it('publishes 114 native choice questions with exact practice and explanation links', async () => {
    const pool = await loadPool('math');
    const added = pool.filter(q=>q.chapterId.startsWith('mc'));
    expect(added).toHaveLength(114);
    for (const unit of units) {
      const questions=added.filter(q=>q.chapterId===unit.id);
      expect(questions).toHaveLength(3);
      const ids=await drawQuestionIds('math',effectiveRule('math'),'curriculum-audit',unit.id);
      expect(new Set(ids)).toEqual(new Set(questions.map(q=>q.id)));
      const problems=buildCurriculumProblems(unit);
      for (const question of questions) {
        const source=problems.find(p=>p.id===question.problemId)!;
        expect(source).toBeDefined();
        expect(question.subQuestionId).toBe(source.subQuestions[0].id);
        expect(question.options).toEqual(source.subQuestions[0].options);
        expect(question.options[question.answerIndex]).toBe(source.subQuestions[0].correctAnswer);
        expect(question.prompt).toContain(source.text);
        expect(await loadReviewExplanation(question)).toBe(source.explanation);
      }
    }
  });

  it('keeps answers folded, references safe, and math contents free of chemistry sections', () => {
    for (const html of Object.values(MATH_CURRICULUM_HTML)) {
      expect(html).not.toMatch(/<script|<iframe|<details open/);
      expect(html).toContain('文部科学省');
    }
    const contents=renderToStaticMarkup(React.createElement(LearningViewer,{subject:'math',onBack:()=>{}}));
    expect(contents).toContain('data-math-curriculum-toc');
    expect(contents).not.toContain('第1部 物質の構成');
    expect(contents).not.toContain('物質量がわからない人へ');
    for (const reference of Object.values(MATH_VIDEO_REFERENCES)) {
      expect(reference.url).toMatch(/^https:\/\/www\.youtube\.com\/watch\?v=[\w-]+$/);
      expect(Object.values(MATH_CURRICULUM_HTML).join('')).toContain(`href="${reference.url}" target="_blank" rel="noopener noreferrer"`);
    }
    expect(Object.values(MATH_CURRICULUM_PARTS).flat().reduce((n,p)=>n+(p.html.match(/<details>/g)||[]).length,0)).toBe(152);
  });
});
