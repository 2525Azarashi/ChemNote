import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { mathData } from '../src/data/mathData';

/**
 * 数学「基礎問ドリル 第4章 図形の性質（№52〜65）」の図（SVG）が
 * 画面に出る形で持たれているかの回帰テスト。
 *
 *  - 図は問題文の <img> ではなく MathProblem.imageUrl / imageCaption に持たせる
 *    （ProblemPane が currentQuestion.imageUrl を QuestionFigure で描画する）。
 *  - imageUrl の指す SVG が public/fig_math に実在し、SVG として妥当であること。
 *  - №53〜65 の 13 問すべてに図が付いていること（№52 は座標問題で図なし）。
 */

const PUBLIC_DIR = resolve(__dirname, '..', 'public');

function collectMathQuestions(): any[] {
  const out: any[] = [];
  for (const part of (mathData as any).parts ?? []) {
    for (const chapter of part.chapters ?? []) {
      for (const q of chapter.practiceProblems ?? []) out.push({ ...q, __chapter: chapter.id });
    }
  }
  return out;
}

describe('数学 基礎問ドリル 図形の性質（№52〜65）の図', () => {
  const all = collectMathQuestions();
  const geo = all.filter((q) => /^q_iad_(5[2-9]|6[0-5])$/.test(q.id));

  it('№52〜65 の 14 大問が ia7_1 / ia7_2 / ia7_3 に入っている', () => {
    expect(geo.map((q) => q.id).sort()).toEqual(
      Array.from({ length: 14 }, (_, i) => `q_iad_${52 + i}`).sort(),
    );
    const byChapter: Record<string, string[]> = {};
    for (const q of geo) (byChapter[q.__chapter] ??= []).push(q.id);
    expect(Object.keys(byChapter).sort()).toEqual(['ia7_1', 'ia7_2', 'ia7_3']);
    expect(byChapter.ia7_1).toHaveLength(4);
    expect(byChapter.ia7_2).toHaveLength(7);
    expect(byChapter.ia7_3).toHaveLength(3);
  });

  it('№53〜65 は imageUrl（/fig_math/*.svg）と imageCaption を持つ', () => {
    for (const q of geo) {
      if (q.id === 'q_iad_52') {
        expect(q.imageUrl).toBeUndefined();
        continue;
      }
      expect(q.imageUrl, q.id).toMatch(/^\/fig_math\/drill\d{2}_[a-z_]+\.svg$/);
      expect(typeof q.imageCaption, q.id).toBe('string');
      expect((q.imageCaption as string).length, q.id).toBeGreaterThan(5);
    }
  });

  it('imageUrl の SVG が public に実在し、SVG として読める', () => {
    const seen = new Set<string>();
    for (const q of geo) {
      if (!q.imageUrl) continue;
      const file = resolve(PUBLIC_DIR, q.imageUrl.replace(/^\//, ''));
      expect(existsSync(file), `${q.id}: ${q.imageUrl} が無い`).toBe(true);
      const body = readFileSync(file, 'utf8');
      expect(body.startsWith('<svg'), q.imageUrl).toBe(true);
      expect(body.includes('viewBox='), q.imageUrl).toBe(true);
      expect(body.trimEnd().endsWith('</svg>'), q.imageUrl).toBe(true);
      expect(seen.has(q.imageUrl), `図の重複 ${q.imageUrl}`).toBe(false);
      seen.add(q.imageUrl);
    }
    expect(seen.size).toBe(13);
  });

  it('問題文に <img> を直接埋め込んでいない（サニタイザで消えるため）', () => {
    for (const q of all) {
      expect(String(q.text ?? '').includes('<img'), q.id).toBe(false);
    }
  });
});
