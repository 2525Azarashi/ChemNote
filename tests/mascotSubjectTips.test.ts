import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import {
  CATEGORY_SUBJECT,
  TIP_CATEGORIES,
  mascotTips,
  tipScopeOf,
  tipTotalForSubject,
  tipsForSubject,
  type TipCategory,
  type TipSubject,
} from '../src/data/mascotTips';
import { SUBJECT_THEMES, subjectTheme } from '../src/data/subjectTheme';

/**
 * ===================================================================
 * とびら君のセリフを「科目ごと」にした部分の回帰テスト
 * ===================================================================
 *
 * ■ 何が問題だったか
 *   豆知識は化学基礎の内容しか無く、科目という概念も持っていなかった。
 *   そのため化学（発展）や英語リスニングの画面を開いても
 *   「1 mol は 6.02×10²³ 個です」のような化学基礎の話が出てしまい、
 *   いま学んでいる内容と噛み合わなかった。
 *
 * ■ どう直したか
 *   ① 化学（発展）とリスニングの分野・セリフを追加した
 *   ② 各豆知識に「どの科目の画面で出してよいか」を持たせた
 *   ③ DoorMascot に subject を渡し、その科目のものだけを出す
 *
 * ■ ここで守りたいこと
 *   ・どの科目を開いても、必ずその科目の話が十分な数だけ出る
 *   ・科目をまたいで内容が混ざらない（リスニング画面に化学が出ない）
 *   ・既読の記録が科目ごとに分かれている（読み切り判定が壊れない）
 */

const SUBJECTS: TipSubject[] = ['chemistry_basic', 'chemistry', 'english_listening'];

describe('新しく足した分野が正しく登録されている', () => {
  it('化学（発展）の分野がそろっている', () => {
    for (const key of ['state', 'solution', 'thermo', 'equilibrium', 'inorganic', 'organic', 'polymer'] as TipCategory[]) {
      expect(TIP_CATEGORIES[key], `分野が無い: ${key}`).toBeTruthy();
      expect(CATEGORY_SUBJECT[key]).toBe('chemistry');
    }
  });

  it('英語リスニングの分野がそろっている', () => {
    for (const key of [
      'listeningBasic',
      'listeningSound',
      'listeningNumber',
      'listeningStrategy',
      'listeningTraining',
    ] as TipCategory[]) {
      expect(TIP_CATEGORIES[key], `分野が無い: ${key}`).toBeTruthy();
      expect(CATEGORY_SUBJECT[key]).toBe('english_listening');
    }
  });

  it('すべての分野にラベルと絵文字がある（吹き出しに出すため）', () => {
    for (const [key, meta] of Object.entries(TIP_CATEGORIES)) {
      expect(meta.label.length, key).toBeGreaterThan(0);
      expect(meta.emoji.length, key).toBeGreaterThan(0);
    }
  });

  it('宣言した分野はすべて実際に使われている（使われないラベルを残さない）', () => {
    const used = new Set(mascotTips.map((tip) => tip.category));
    for (const key of Object.keys(TIP_CATEGORIES) as TipCategory[]) {
      expect(used.has(key), `未使用の分野: ${key}`).toBe(true);
    }
  });
});

describe('科目ごとの絞り込み', () => {
  it('科目を渡さなければ全件返す（既存の呼び出しを壊さない）', () => {
    expect(tipsForSubject()).toHaveLength(mascotTips.length);
  });

  it('どの科目でも十分な数の豆知識が出る（すぐ一巡してしまわない）', () => {
    for (const subject of SUBJECTS) {
      expect(tipTotalForSubject(subject), subject).toBeGreaterThanOrEqual(30);
    }
  });

  it('リスニング画面に化学の話が混ざらない', () => {
    for (const tip of tipsForSubject('english_listening')) {
      const scope = tipScopeOf(tip);
      expect(scope === 'common' || scope === 'english_listening', `${tip.id}: ${scope}`).toBe(true);
    }
  });

  it('化学基礎の画面に化学（発展）専用の話が混ざらない', () => {
    for (const tip of tipsForSubject('chemistry_basic')) {
      expect(tipScopeOf(tip), tip.id).not.toBe('chemistry');
    }
  });

  it('化学（発展）の画面に化学基礎専用の話が混ざらない', () => {
    for (const tip of tipsForSubject('chemistry')) {
      expect(tipScopeOf(tip), tip.id).not.toBe('chemistry_basic');
    }
  });

  it('計算・試験の作法は化学の2科目で共有される', () => {
    const inBasic = tipsForSubject('chemistry_basic').some((tip) => tip.id === 't01');
    const inAdvanced = tipsForSubject('chemistry').some((tip) => tip.id === 't01');
    expect(inBasic).toBe(true);
    expect(inAdvanced).toBe(true);
  });

  it('科目を問わない作法（common）はリスニングでも出る', () => {
    const ids = tipsForSubject('english_listening').map((tip) => tip.id);
    expect(ids).toContain('t08');
    expect(ids).toContain('t14');
  });

  it('すべての豆知識がいずれかの科目で必ず出る（取りこぼしゼロ）', () => {
    const reachable = new Set(SUBJECTS.flatMap((s) => tipsForSubject(s).map((tip) => tip.id)));
    const unreachable = mascotTips.filter((tip) => !reachable.has(tip.id)).map((tip) => tip.id);
    expect(unreachable, `どの科目でも出ない: ${unreachable.join(', ')}`).toEqual([]);
  });
});

describe('追加したセリフの品質', () => {
  const added = mascotTips.filter((tip) => /^(ad_|ls_)/.test(tip.id));

  it('化学（発展）とリスニングのセリフを両方足している', () => {
    expect(added.filter((tip) => tip.id.startsWith('ad_')).length).toBeGreaterThanOrEqual(40);
    expect(added.filter((tip) => tip.id.startsWith('ls_')).length).toBeGreaterThanOrEqual(25);
  });

  it('ID が重複しない（既読管理が壊れない）', () => {
    const ids = mascotTips.map((tip) => tip.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('本文が重複していない', () => {
    const texts = mascotTips.map((tip) => tip.text);
    const dup = texts.filter((t, i) => texts.indexOf(t) !== i);
    expect(dup).toEqual([]);
  });

  it('口調が既存とそろっている（句点で終わる・長すぎない）', () => {
    for (const tip of added) {
      const text = tip.text.trim();
      expect(text.length, tip.id).toBeGreaterThan(10);
      expect(text.length, `${tip.id} が長すぎる`).toBeLessThanOrEqual(120);
      expect(/[。）)]$/.test(text), `${tip.id}: ${text}`).toBe(true);
    }
  });

  it('化学式の添字を Unicode で書いている（半角数字の裸書きをしない）', () => {
    // 素の <p> に出すため、H2O のような書き方だと添字にならず読みにくい
    for (const tip of added) {
      expect(/\b(H2O|CO2|O2|H2SO4|Na2CO3|NH3)\b/.test(tip.text), `${tip.id}: ${tip.text}`).toBe(false);
    }
  });

  it('リスニングのセリフに音の変化・数字・作戦・練習法が含まれている', () => {
    const joined = mascotTips
      .filter((tip) => tip.id.startsWith('ls_'))
      .map((tip) => tip.text)
      .join('\n');
    for (const keyword of ['連結', '脱落', '弱形', 'thirteen', 'シャドーイング', 'ディクテーション', '2回読み']) {
      expect(joined, `未反映: ${keyword}`).toContain(keyword);
    }
  });

  it('化学（発展）のセリフに主要テーマが含まれている', () => {
    const joined = mascotTips
      .filter((tip) => tip.id.startsWith('ad_'))
      .map((tip) => tip.text)
      .join('\n');
    for (const keyword of [
      '三重点',
      'ヘンリーの法則',
      'ヘスの法則',
      'ルシャトリエ',
      '溶解度積',
      '両性',
      '構造異性体',
      '重合度',
    ]) {
      expect(joined, `未反映: ${keyword}`).toContain(keyword);
    }
  });
});

describe('科目ごとの配色（サブジェクトテーマ）', () => {
  it('3科目すべてに配色が用意されている', () => {
    for (const subject of SUBJECTS) {
      expect(SUBJECT_THEMES[subject], subject).toBeTruthy();
    }
  });

  it('科目ごとに主役の色が異なる（色で科目を見分けられる）', () => {
    const accents = SUBJECTS.map((s) => subjectTheme(s).accent);
    expect(new Set(accents).size).toBe(SUBJECTS.length);
  });

  it('未知の値でも化学基礎にフォールバックする（画面を落とさない）', () => {
    expect(subjectTheme(undefined).accent).toBe(SUBJECT_THEMES.chemistry_basic.accent);
  });

  it('Tailwind のクラスは完成形で持つ（動的結合は JIT が拾えない）', () => {
    for (const subject of SUBJECTS) {
      const theme = subjectTheme(subject);
      expect(theme.bubbleBorderClass).toMatch(/^border-\[#[0-9A-Fa-f]{6}\]/);
      expect(theme.chipBgClass).toMatch(/^bg-\[#[0-9A-Fa-f]{6}\]/);
    }
  });

  it('色は16進表記で書かれている', () => {
    for (const subject of SUBJECTS) {
      const theme = subjectTheme(subject);
      expect(theme.accent).toMatch(/^#[0-9A-Fa-f]{6}$/);
      expect(theme.accentSoft).toMatch(/^#[0-9A-Fa-f]{6}$/);
      expect(theme.surface).toMatch(/^#[0-9A-Fa-f]{6}$/);
    }
  });
});

describe('画面への配線', () => {
  const read = (p: string) => readFileSync(resolve(__dirname, '..', p), 'utf-8');
  const mascot = read('src/components/DoorMascot.tsx');

  it('DoorMascot が subject を受け取る', () => {
    expect(mascot).toContain('subject?: TipSubject');
    expect(mascot).toContain("subject = 'chemistry_basic'");
  });

  it('DoorMascot が科目で絞った候補から選ぶ', () => {
    expect(mascot).toContain('tipsForSubject(subject)');
  });

  it('既読の保存先が科目ごとに分かれている（読み切り判定が混ざらない）', () => {
    expect(mascot).toContain('tipStorageKey');
    expect(mascot).toContain('`${currentUid()}:${subject}`');
  });

  it('吹き出しの色が科目ごとの配色になっている（ピンク直書きをやめた）', () => {
    expect(mascot).toContain('subjectTheme(subject)');
    expect(mascot).toContain('theme.bubbleBorderClass');
    expect(mascot).toContain('theme.bubbleShadow');
    expect(mascot).not.toContain('border-[#F0C7D2]/70');
  });

  it('各画面が自分の科目を DoorMascot に渡している', () => {
    expect(read('src/components/Home.tsx')).toContain('subject={subject}');
    expect(read('src/components/ChapterSelection.tsx')).toContain('<DoorMascot subject={subject}');
    expect(read('src/components/ModeSelection.tsx')).toContain('<DoorMascot subject={subject}');
    // 化学（発展）専用の画面は固定で渡す
    expect(read('src/components/AdvancedFieldSelection.tsx')).toContain('<DoorMascot subject="chemistry"');
  });

  it('単元選択画面の見出し色が科目ごとの配色になっている', () => {
    const chapter = read('src/components/ChapterSelection.tsx');
    expect(chapter).toContain('subjectTheme(subject)');
    expect(chapter).toContain('style={{ color: theme.accent }}');
  });

  it('モード選択画面の演習カードも科目ごとの配色になっている', () => {
    const mode = read('src/components/ModeSelection.tsx');
    expect(mode).toContain('subjectTheme(subject)');
    expect(mode).toContain('theme.accentSoft');
  });
});
