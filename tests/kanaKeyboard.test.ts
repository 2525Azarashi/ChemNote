/**
 * ===================================================================
 * 五十音キーボード（みんはや方式）の健康診断
 * ===================================================================
 *
 * ■ このテストが守っているもの
 *
 * 出題プールは正解を ★KANA_KEYS の添字の並び★ で持っている。
 * 例: 「ダイヤモンド」→ [57, 1, 35, 66, 24, 61]
 * この数字は pool.*.generated.ts の中に書き込まれている。
 *
 * したがって
 *   ・KANA_KEYS の途中に文字を割り込ませる
 *   ・並べ替える
 *   ・表示表（KANA_LAYOUT）から到達できない文字が混ざる
 * のいずれかが起きると、★既存の全問の正解が静かに別の語に化ける★。
 * しかも型エラーにならない（ただの数値配列なので）。ここが唯一の検査になる。
 *
 * ■ 特に効くのは「到達できない文字」の検査
 *
 * KANA_KEYS には載っているが五十音表に置いていない文字（「ヲ」など）を
 * 答えに含む問題を作ると、★誰も入力できない＝両者0点確定★の問題になる。
 * 対戦中は「なぜ0点なのか」を後から追えないので、ここで止める。
 */
import { describe, it, expect } from 'vitest';
import {
  KANA_CYCLE,
  KANA_KEYS,
  KANA_KEY_INDEX,
  KANA_LAYOUT,
  KANA_MAX_INPUT,
  KANA_REACHABLE,
  cycleKanaKey,
  kanaKeysOf,
  kanaTextOf,
} from '../src/battle/core/kanaKeyboard';

describe('五十音キーボード — 番号表', () => {
  it('★文字が重複していない（重複すると答えが2通りになる）★', () => {
    const seen = new Map<string, number[]>();
    KANA_KEYS.forEach((c, i) => {
      const list = seen.get(c) || [];
      list.push(i);
      seen.set(c, list);
    });
    const dup = [...seen.entries()].filter(([, v]) => v.length > 1);
    expect(dup, `重複: ${dup.map(([c, v]) => `${c}=${v}`).join(' ')}`).toEqual([]);
  });

  it('★KANA_KEY_INDEX が KANA_KEYS と一致している★', () => {
    // 生成器はこの表で答えを番号に変え、画面は KANA_KEYS で番号を文字に戻す。
    // 片方だけ変えると往復して別の文字になる。
    KANA_KEYS.forEach((c, i) => {
      expect(KANA_KEY_INDEX.get(c), `${c} の番号`).toBe(i);
    });
    expect(KANA_KEY_INDEX.size).toBe(KANA_KEYS.length);
  });

  it('全キーがカタカナ1文字（ひらがな・漢字・空白が混ざっていない）', () => {
    const bad = KANA_KEYS.filter((c) => !/^[ァ-ヶー]$/.test(c));
    expect(bad).toEqual([]);
  });

  it('★清音46字が 0〜45 の位置にある（この前提で番号を割り当てた）★', () => {
    // ここがズレると、番号表の意図（0〜45=清音、46=長音…）が崩れ、
    // 後から文字を足す人が「途中に入れてよい」と誤解する。
    expect(KANA_KEYS[0]).toBe('ア');
    expect(KANA_KEYS[45]).toBe('ン');
    expect(KANA_KEYS[46]).toBe('ー');
    expect(KANA_KEYS[47]).toBe('ガ');
  });
});

describe('五十音キーボード — 表示表', () => {
  it('表のキー番号がすべて実在する', () => {
    for (const row of KANA_LAYOUT) {
      for (const key of row) {
        if (key === null) continue;
        expect(KANA_KEYS[key], `番号${key}が範囲外`).toBeTruthy();
      }
    }
  });

  it('★表に同じキーが2回出てこない（同じ文字のボタンが2つあると迷う）★', () => {
    const seen = new Set<number>();
    const dup: number[] = [];
    for (const row of KANA_LAYOUT) {
      for (const key of row) {
        if (key === null) continue;
        if (seen.has(key)) dup.push(key);
        seen.add(key);
      }
    }
    expect(dup.map((k) => KANA_KEYS[k])).toEqual([]);
  });

  it('5段 × 10行（スマホ1画面に収まる形）', () => {
    expect(KANA_LAYOUT.length).toBe(5);
    for (const row of KANA_LAYOUT) expect(row.length).toBe(10);
  });

  it('清音46字のうち、表に無いのは「ヲ」だけ（意図した除外であることの確認）', () => {
    // 「ヲ」は化学・生物の用語に出てこないので表から外して
    // 空きマスに長音「ー」を入れた。意図せず他の字が落ちていないかを見る。
    const onLayout = new Set<number>();
    for (const row of KANA_LAYOUT) for (const k of row) if (k !== null) onLayout.add(k);
    const missing: string[] = [];
    for (let i = 0; i <= 45; i += 1) if (!onLayout.has(i)) missing.push(KANA_KEYS[i]);
    expect(missing).toEqual(['ヲ']);
  });
});

describe('五十音キーボード — 濁点・半濁点の切り替え', () => {
  it('★切り替えは必ず一周して元に戻る（押しすぎても詰まらない）★', () => {
    // 戻れないと、間違えて押した人が制限時間を捨てることになる。
    for (const start of KANA_CYCLE.keys()) {
      let cursor = start;
      let steps = 0;
      do {
        cursor = cycleKanaKey(cursor);
        steps += 1;
      } while (cursor !== start && steps < 10);
      expect(cursor, `${KANA_KEYS[start]} から元に戻れない`).toBe(start);
      expect(steps, `${KANA_KEYS[start]} の輪が長すぎる`).toBeLessThanOrEqual(3);
    }
  });

  it('代表例が「みんはや」と同じ順で回る', () => {
    const cycleFrom = (c: string): string[] => {
      const start = KANA_KEY_INDEX.get(c)!;
      const out: string[] = [];
      let cursor = start;
      for (let i = 0; i < 4; i += 1) {
        cursor = cycleKanaKey(cursor);
        if (cursor === start) break;
        out.push(KANA_KEYS[cursor]);
      }
      return out;
    };
    expect(cycleFrom('カ')).toEqual(['ガ']);
    expect(cycleFrom('ハ')).toEqual(['バ', 'パ']);
    expect(cycleFrom('ツ')).toEqual(['ヅ', 'ッ']);
    expect(cycleFrom('ウ')).toEqual(['ゥ', 'ヴ']);
    expect(cycleFrom('ヤ')).toEqual(['ャ']);
  });

  it('切り替えられない文字は押しても変わらない（「ー」「ン」など）', () => {
    for (const c of ['ー', 'ン', 'ア'.replace('ア', 'ナ')]) {
      const key = KANA_KEY_INDEX.get(c)!;
      if (KANA_CYCLE.has(key)) continue;
      expect(cycleKanaKey(key)).toBe(key);
    }
  });
});

describe('五十音キーボード — 到達可能性', () => {
  it('★到達可能な文字は、表のキーか「゛゜小」でたどれる文字だけ★', () => {
    const onLayout = new Set<number>();
    for (const row of KANA_LAYOUT) for (const k of row) if (k !== null) onLayout.add(k);
    for (const key of KANA_REACHABLE) {
      if (onLayout.has(key)) continue;
      // 表に無いなら、表のどれかから切り替えでたどり着けなければならない
      const from = [...KANA_CYCLE.entries()].filter(([, to]) => to === key).map(([f]) => f);
      expect(from.length, `${KANA_KEYS[key]} にたどり着く経路が無い`).toBeGreaterThan(0);
    }
  });

  it('★「ヲ」は入力できない（表に無いので出題にも使えない）★', () => {
    const wo = KANA_KEY_INDEX.get('ヲ')!;
    expect(KANA_REACHABLE.has(wo)).toBe(false);
    expect(kanaKeysOf('ヲン')).toBeNull();
  });

  it('濁音・半濁音・小書き・ヴ がすべて入力できる', () => {
    for (const c of ['ガ', 'ジ', 'ヅ', 'ボ', 'パ', 'ァ', 'ョ', 'ッ', 'ヴ', 'ー']) {
      const key = KANA_KEY_INDEX.get(c);
      expect(key, `${c} が番号表に無い`).not.toBeUndefined();
      expect(KANA_REACHABLE.has(key!), `${c} が入力できない`).toBe(true);
    }
  });
});

describe('五十音キーボード — 変換の往復', () => {
  it('★実データの用語が番号に変えられ、文字に戻せる★', () => {
    // ここが崩れると「正しく答えたのに不正解」になる。
    const words = [
      'ダイヤモンド',
      'ガスバーナー',
      'ホールピペット',
      'コニカルビーカー',
      'シアノバクテリア',
      'ミトコンドリア',
      'デオキシリボース',
      'フラーレン',
      'アルゴン',
      'ヴ'.repeat(1) + 'ィーナス'.slice(0, 4),
    ];
    for (const w of words) {
      const keys = kanaKeysOf(w);
      expect(keys, `${w} を番号に変えられない`).not.toBeNull();
      expect(kanaTextOf(keys!), `${w} の往復が壊れている`).toBe(w);
    }
  });

  it('ひらがな・漢字・英字は入力対象にしない（null を返す）', () => {
    expect(kanaKeysOf('さんか')).toBeNull();
    expect(kanaKeysOf('酸化')).toBeNull();
    expect(kanaKeysOf('NaCl')).toBeNull();
    expect(kanaKeysOf('')).toBeNull();
  });

  it('未知の番号は無視して文字に戻す（壊れたデータで落ちない）', () => {
    expect(kanaTextOf([0, 9999, 1])).toBe('アイ');
    expect(kanaTextOf([])).toBe('');
  });

  it('★入力の上限が Firestore ルールの上限（12）を超えない★', () => {
    // ルール側が panel.size() <= 12 で拒否する。
    // 画面が13文字目を許すと「答えたのに消える」が起きる。
    expect(KANA_MAX_INPUT).toBeLessThanOrEqual(12);
  });
});
