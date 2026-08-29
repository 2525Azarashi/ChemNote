import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

import { EL2_PROBLEMS } from '../src/data/englishListeningQ2Problems';
import { englishListeningData } from '../src/data/englishListeningData';

/**
 * ===================================================================
 * 英語リスニング 第2問（イラスト選択・16セット48問）の回帰テスト
 * ===================================================================
 *
 * ■ このテストが守っていること
 *   ① データそのものの整合（選択肢・正解・音源トラックの対応）
 *   ② 正解位置が偏っていない（①〜④が各12問）
 *      → 偏っていると「②を塗れば当たる」状態になり、耳を使わずに点が取れてしまう。
 *   ③ イラストのパス命名が設問IDと1対1で対応している（絵の貼り違え防止）
 *   ④ すでに public 配下にある画像は壊れていない（空ファイル混入防止）
 *   ⑤ 画像が48枚揃うまで単元へ流し込まれない（絵のない絵選択問題を出さない）
 *
 * ■ ④⑤について
 *   第2問は「4枚の絵を見比べて選ぶ」大問なので、絵が欠けた状態で公開すると
 *   マーク（①〜④）だけが並んで原理的に解けない。そのため
 *   englishListeningData.ts への登録は画像が全部揃ってからにしている。
 *   このテストは「揃ったら登録される／揃っていないなら登録されていない」の
 *   両方を、画像の実枚数から自動で切り替えて検査する（手で書き換えなくてよい）。
 */

const ROOT = path.resolve(__dirname, '..');
const IMG_DIR = path.join(ROOT, 'public/listening_q2');
const MARKS = ['①', '②', '③', '④'];

const allSub = EL2_PROBLEMS.flatMap((p) => p.subQuestions as any[]);

describe('第2問：16セット48問が収録されている', () => {
  it('16セット・各3問＝48問ある', () => {
    expect(EL2_PROBLEMS).toHaveLength(16);
    expect(allSub).toHaveLength(48);
    for (const p of EL2_PROBLEMS) {
      expect(p.subQuestions).toHaveLength(3);
    }
  });

  it('2回読み（本番と同じ）である', () => {
    for (const p of EL2_PROBLEMS) {
      expect(p.readCount).toBe(2);
    }
  });

  it('全設問がマーク式（①〜④）で、正解がその中にある', () => {
    for (const sq of allSub) {
      expect(sq.type).toBe('multiple_choice');
      expect(sq.options).toEqual(MARKS);
      expect(MARKS).toContain(sq.correctAnswer);
    }
  });

  it('各問に音源トラック（対話スクリプト）が対応づいている', () => {
    for (const p of EL2_PROBLEMS) {
      expect(p.audioTracks).toHaveLength(p.subQuestions.length);
      const subIds = (p.subQuestions as any[]).map((s) => s.id);
      for (const track of p.audioTracks as any[]) {
        expect(subIds).toContain(track.subId);
        expect(track.script.trim().length).toBeGreaterThan(5);
        // 2人の対話なので発話は必ず2つ以上。1つだと話者交替が耳で分からない。
        expect(track.turns.length).toBeGreaterThanOrEqual(2);
        for (const turn of track.turns) {
          expect(turn.who.trim().length).toBeGreaterThan(0);
          expect(turn.text.trim().length).toBeGreaterThan(0);
        }
      }
    }
  });

  it('IDがセット・問番号と一致している', () => {
    EL2_PROBLEMS.forEach((p, si) => {
      const setNo = si + 1;
      expect(p.id).toBe(`q_el2_set${setNo}`);
      (p.subQuestions as any[]).forEach((sq, qi) => {
        expect(sq.id).toBe(`q_el2_set${setNo}_${qi + 1}`);
      });
    });
  });
});

describe('第2問：正解位置が偏っていない（耳を使わずに解けないようにする）', () => {
  it('①〜④がそれぞれ12問ずつになっている', () => {
    const count: Record<string, number> = { '①': 0, '②': 0, '③': 0, '④': 0 };
    for (const sq of allSub) count[sq.correctAnswer] += 1;
    expect(count).toEqual({ '①': 12, '②': 12, '③': 12, '④': 12 });
  });

  it('最頻位置だけを塗っても25%しか当たらない', () => {
    const count: Record<string, number> = { '①': 0, '②': 0, '③': 0, '④': 0 };
    for (const sq of allSub) count[sq.correctAnswer] += 1;
    const best = Math.max(...Object.values(count));
    // PDF 原文のままだと ② が21問で 44% 当たってしまう。並べ替えで 25% に落としてある。
    expect(best / allSub.length).toBeLessThanOrEqual(0.25);
  });

  it('解説に選択肢のイラスト説明が入っている（絵と聞き取りの対応が確認できる）', () => {
    for (const p of EL2_PROBLEMS) {
      expect(p.explanation).toContain('選択肢のイラスト：');
      for (let n = 1; n <= 3; n += 1) {
        expect(p.explanation).toMatch(new RegExp(`^問${n}`, 'm'));
      }
    }
  });

  it('問題文には選択肢の日本語説明を出さない（絵を読み取る練習にするため）', () => {
    // 例：第1セット問1の選択肢文が問題文に混ざっていないこと
    const first = EL2_PROBLEMS[0];
    expect(first.explanation).toContain('ミルク');
    expect(first.text).not.toContain('ミルク');
  });
});

describe('第2問：イラストの割り当て', () => {
  it('imageUrl が設問IDと1対1で対応している', () => {
    EL2_PROBLEMS.forEach((p, si) => {
      const setNo = si + 1;
      (p.subQuestions as any[]).forEach((sq, qi) => {
        expect(sq.imageUrl).toBe(`/listening_q2/el2_set${setNo}_q${qi + 1}.jpg`);
        expect(typeof sq.imageCaption).toBe('string');
        expect(sq.imageCaption.length).toBeGreaterThan(0);
      });
    });
  });

  it('imageUrl は public 配下を指す（共有URLを資産にしない）', () => {
    for (const sq of allSub) {
      expect(sq.imageUrl).toMatch(/^\/listening_q2\/el2_set\d+_q\d\.jpg$/);
    }
  });

  it('画像が重複していない（絵の貼り違えを防ぐ）', () => {
    const urls = allSub.map((sq) => sq.imageUrl);
    expect(new Set(urls).size).toBe(urls.length);
  });

  it('すでに置かれている画像は壊れていない（空ファイルを混ぜない）', () => {
    for (const sq of allSub) {
      const file = path.join(ROOT, 'public', sq.imageUrl.replace(/^\//, ''));
      if (!fs.existsSync(file)) continue; // 未生成のぶんはここでは問わない（下で扱う）
      expect(fs.statSync(file).size, `画像が小さすぎる: ${sq.imageUrl}`).toBeGreaterThan(5000);
    }
  });

  it('並べ替え後のプロンプトが全問ぶん保存されている（同じ絵を再生成できる）', () => {
    // 絵は「並べ替え後の並び」で作らないと、選択肢・正解・解説とズレる。
    // そのプロンプトを1問1ファイルで残しているので、作り直しても並びが崩れない。
    const dir = path.join(ROOT, 'scripts/data/q2_prompts');
    expect(fs.existsSync(dir)).toBe(true);
    for (const sq of allSub) {
      const name = sq.imageUrl.replace('/listening_q2/', '').replace('.jpg', '.txt');
      const file = path.join(dir, name);
      expect(fs.existsSync(file), `プロンプトが無い: ${name}`).toBe(true);
      expect(fs.statSync(file).size).toBeGreaterThan(100);
    }
  });
});

describe('第2問：単元への配線は画像が揃ってから', () => {
  function el2Chapter(): any {
    for (const part of (englishListeningData as any).parts ?? []) {
      for (const ch of part.chapters ?? []) {
        if (ch.id === 'el2') return ch;
      }
    }
    return null;
  }

  it('el2 の単元自体は存在する', () => {
    expect(el2Chapter()).not.toBeNull();
  });

  it('画像が48枚揃っているときだけ演習問題が入っている', () => {
    const missing = allSub.filter(
      (sq) => !fs.existsSync(path.join(ROOT, 'public', sq.imageUrl.replace(/^\//, ''))),
    );
    const problems = el2Chapter().practiceProblems ?? [];
    if (missing.length === 0) {
      // 揃った → 16回ぶんが流し込まれていること
      expect(problems).toHaveLength(16);
      expect(problems[0].id).toBe('q_el2_set1');
    } else {
      // 未生成が残っている → 絵のない絵選択問題を出さないため未登録であること
      expect(problems).toHaveLength(0);
    }
  });

  it('画像ディレクトリが用意されている', () => {
    expect(fs.existsSync(IMG_DIR)).toBe(true);
  });
});
