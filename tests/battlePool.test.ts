/**
 * ===================================================================
 * 対戦モード：出題プール（自動生成データ）の健康診断
 * ===================================================================
 *
 * ■ このテストが守っているもの
 *
 * 対戦の出題データは src/data/*.ts（学習用の教科データ本体）から
 * scripts/gen-battle-pool.mts が機械的に作り直している。
 * つまり「人が目で見ていないデータ」が本番の画面に出る。
 *
 * 学習用データは
 *   ・記述問題（自由入力）
 *   ・選択肢が2つしかない問題
 *   ・選択肢に正解が入っていない問題（解説側に答えがある形）
 * など、対戦に流用できない形をたくさん含んでいる。
 * 生成器はそれらを弾いているつもりだが、弾き漏れが1問あると
 * ★その1問が出た試合だけ、両者とも絶対に正解できない★という
 * 事故になる。しかも Firestore には点数を保存しないので
 * 「なぜ0点なのか」が後から追えない。
 *
 * ■ tsc では捕まらない
 *
 * このリポジトリの tsconfig.json には strict が付いていない。
 * 生成ファイルの中身は「タプルの配列」なので、
 *   options が3つしか無い / answerIndex が 7 になっている
 * といった壊れ方は型エラーにならず、実行時に静かに壊れる。
 * ここが唯一の検査になる。
 *
 * ■ 何を見るか（すべて「実際に事故になる形」だけ）
 *
 *  1. 出題IDがプール内で一意（重複すると questionByIdSync が取り違える）
 *  2. choice4 / word は選択肢がちょうど4つ、answerIndex が 0〜3
 *  3. choice は選択肢が2〜6つ、answerIndex が範囲内
 *  4. panel は panelOrder が空でなく、全要素が options の範囲内
 *  5. 選択肢に空文字・重複が無い（重複＝正解が2つある状態）
 *  6. 問題文が空でない（prompt と label の両方が空だと何も表示されない）
 *  7. 制限時間が現実的な範囲（8〜40秒）
 *  8. POOL_COUNTS が実データと一致（UIの「収録N問」が嘘にならない）
 *  9. 各教科で、そのルールが使う形式の問題が questionCount 以上ある
 *     （足りないと1試合を組めない＝対戦開始で落ちる）
 * 10. groupOf（同じ小問から作った問題）が1試合に重複しない前提が
 *     成り立つだけのグループ数がある
 * 11. POOL_FORMAT_COUNTS が実データと一致（教科選択の「収録N問」が
 *     「いま出せる数」を指していることの担保）
 *
 * ■ ★2026-08-31 に増えた形式 choice について★
 *
 * 元データには「元素／単体」「高／低」のように、出題者が意図して
 * 2つだけ並べた設問が実測109件ある。対戦のために選択肢を足して4択に
 * すると毛色の違う語が混ざって元の設問より簡単になるため、
 * ★足さずに2択のまま出す★方針にした。それが format: 'choice' である。
 * したがって「選択肢は必ず4つ」という検査は choice には当てはまらない。
 */
import { describe, it, expect } from 'vitest';
import type { BattleQuestion } from '../src/battle/core/types';
import {
  POOL_COUNTS,
  POOL_FORMAT_COUNTS,
  loadPool,
  poolCountOf,
  poolIdsOf,
  questionByIdSync,
} from '../src/battle/data/battlePool';
import { BATTLE_RULES, defaultRuleOf } from '../src/battle/core/battleRules';
import { buildQuestionOrder } from '../src/battle/core/battleCore';
import {
  KANA_MAX_INPUT,
  KANA_REACHABLE,
  kanaTextOf,
} from '../src/battle/core/kanaKeyboard';

/** 収録されている教科ID（生成ファイルがある教科） */
const SUBJECTS = Object.keys(POOL_COUNTS);

/**
 * 全教科を1回だけ読み込んで使い回す。
 * loadPool は動的 import なので、教科ごとに毎回呼ぶとテストが遅くなる。
 */
const pools = new Map<string, readonly BattleQuestion[]>();

async function poolOf(subject: string): Promise<readonly BattleQuestion[]> {
  const cached = pools.get(subject);
  if (cached) return cached;
  const list = await loadPool(subject);
  pools.set(subject, list);
  return list;
}

/**
 * 失敗したときに「どの問題か」を特定できるようにする。
 * 763問の中の1問が壊れているとき、
 * expect(true).toBe(false) だけ出ても直せない。
 */
function idOf(q: BattleQuestion): string {
  return `${q.subject}/${q.id}(${q.format})`;
}

describe('出題プール — 収録数', () => {
  it('POOL_COUNTS に書かれた教科すべてを読み込める', async () => {
    for (const subject of SUBJECTS) {
      const list = await poolOf(subject);
      expect(list.length, `${subject} が読み込めていない`).toBeGreaterThan(0);
    }
  });

  it('★POOL_COUNTS が実データと一致する（UIの「収録N問」が嘘にならない）★', async () => {
    // ここがズレるのは、教科データを直したあと
    // npm run gen:battle-pool を流していない場合である。
    for (const subject of SUBJECTS) {
      const list = await poolOf(subject);
      expect(list.length, `${subject} の収録数がPOOL_COUNTSと違う`).toBe(POOL_COUNTS[subject]);
    }
  });

  it('知らない教科は空配列を返す（例外を投げない）', async () => {
    const list = await loadPool('no_such_subject');
    expect(list).toEqual([]);
  });
});

describe('出題プール — 1問ずつの形', () => {
  it('★出題IDが教科内で一意★', async () => {
    for (const subject of SUBJECTS) {
      const list = await poolOf(subject);
      const seen = new Set<string>();
      const dup: string[] = [];
      for (const q of list) {
        if (seen.has(q.id)) dup.push(q.id);
        seen.add(q.id);
      }
      // 重複があると questionByIdSync が「先に見つかった方」を返すため、
      // 相手の端末と違う問題を表示する可能性がある。
      expect(dup, `${subject} に重複ID`).toEqual([]);
    }
  });

  it('教科IDが自分自身と一致している', async () => {
    for (const subject of SUBJECTS) {
      const list = await poolOf(subject);
      const wrong = list.filter((q) => q.subject !== subject).map(idOf);
      expect(wrong).toEqual([]);
    }
  });

  it('★問題文が空の問題が無い（prompt と label が両方空だと何も出ない）★', async () => {
    for (const subject of SUBJECTS) {
      const list = await poolOf(subject);
      const blank = list.filter((q) => !q.prompt.trim() && !q.label.trim()).map(idOf);
      expect(blank).toEqual([]);
    }
  });

  it('章ID・大問ID・小問IDが入っている（結果画面から復習に飛べる）', async () => {
    for (const subject of SUBJECTS) {
      const list = await poolOf(subject);
      const broken = list
        .filter((q) => !q.chapterId || !q.problemId || !q.subQuestionId)
        .map(idOf);
      expect(broken).toEqual([]);
    }
  });

  it('★制限時間が現実的な範囲（8〜40秒）★', async () => {
    // 8秒未満は読み終わらない。40秒超は対戦のテンポが壊れる。
    for (const subject of SUBJECTS) {
      const list = await poolOf(subject);
      const bad = list
        .filter((q) => !Number.isFinite(q.timeLimit) || q.timeLimit < 8 || q.timeLimit > 40)
        .map((q) => `${idOf(q)}=${q.timeLimit}s`);
      expect(bad).toEqual([]);
    }
  });

  it('★選択肢に空文字が無い★', async () => {
    for (const subject of SUBJECTS) {
      const list = await poolOf(subject);
      const bad = list.filter((q) => q.options.some((o) => !String(o).trim())).map(idOf);
      expect(bad).toEqual([]);
    }
  });

  it('★選択肢が重複していない（重複＝正解が2つある状態）★', async () => {
    // 「正解と同じ文字列のダミー」があると、
    // 正しく答えたのに不正解になる人が出る。
    for (const subject of SUBJECTS) {
      const list = await poolOf(subject);
      const bad = list
        // ★panel は同じ文字が2枚あってよい／kana は options を持たない★
        .filter((q) => q.format !== 'panel' && q.format !== 'kana')
        .filter((q) => new Set(q.options.map((o) => String(o).trim())).size !== q.options.length)
        .map((q) => `${idOf(q)} [${q.options.join(' / ')}]`);
      expect(bad).toEqual([]);
    }
  });
});

describe('出題プール — 形式ごとの決まり', () => {
  it('★choice4 / word は選択肢がちょうど4つ★', async () => {
    for (const subject of SUBJECTS) {
      const list = await poolOf(subject);
      const bad = list
        .filter((q) => q.format === 'choice4' || q.format === 'word')
        .filter((q) => q.options.length !== 4)
        .map((q) => `${idOf(q)}=${q.options.length}個`);
      expect(bad).toEqual([]);
    }
  });

  it('★choice4 / word は answerIndex が 0〜3★', async () => {
    // ここが -1 や 4 になっていると、その問題は誰も正解できない。
    for (const subject of SUBJECTS) {
      const list = await poolOf(subject);
      const bad = list
        .filter((q) => q.format === 'choice4' || q.format === 'word')
        .filter((q) => !Number.isInteger(q.answerIndex) || q.answerIndex < 0 || q.answerIndex > 3)
        .map((q) => `${idOf(q)}=${q.answerIndex}`);
      expect(bad).toEqual([]);
    }
  });

  it('★choice は選択肢が2〜6つ（1つだと問いにならない／7つ以上はスマホで読めない）★', async () => {
    // 元データが意図して作った2択・3択をそのまま出す形式。
    // 1つしか無いのは「選択肢の抽出に失敗した」状態なので出してはいけない。
    for (const subject of SUBJECTS) {
      const list = await poolOf(subject);
      const bad = list
        .filter((q) => q.format === 'choice')
        .filter((q) => q.options.length < 2 || q.options.length > 6)
        .map((q) => `${idOf(q)}=${q.options.length}個`);
      expect(bad).toEqual([]);
    }
  });

  it('★choice は answerIndex が選択肢の範囲内★', async () => {
    // choice は選択肢の数が問題ごとに違うので、
    // 「0〜3」ではなく「options.length 未満」で見る必要がある。
    for (const subject of SUBJECTS) {
      const list = await poolOf(subject);
      const bad = list
        .filter((q) => q.format === 'choice')
        .filter(
          (q) =>
            !Number.isInteger(q.answerIndex) ||
            q.answerIndex < 0 ||
            q.answerIndex >= q.options.length,
        )
        .map((q) => `${idOf(q)} answerIndex=${q.answerIndex} / options=${q.options.length}`);
      expect(bad).toEqual([]);
    }
  });

  it('★choice の選択肢が記号（①ア A）だけになっていない★', async () => {
    // 元データの選択肢が「(イ)」「(ウ)」だけの設問がある。
    // 生成器は問題文の凡例から本文に戻しているが、戻し漏れがあると
    // 「(イ)／(ウ)」だけが並んで、何を選んでいるのか分からない画面になる。
    const symbolOnly = /^[（(【]?[①-⑩ア-ンA-Za-z][)）】]?$/;
    for (const subject of SUBJECTS) {
      const list = await poolOf(subject);
      const bad = list
        .filter((q) => q.format === 'choice' || q.format === 'choice4')
        .filter((q) => q.options.every((o) => symbolOnly.test(String(o).trim())))
        .map((q) => `${idOf(q)} [${q.options.join(' / ')}]`);
      expect(bad).toEqual([]);
    }
  });

  it('★panel は panelOrder が空でなく、すべて options の範囲内★', async () => {
    for (const subject of SUBJECTS) {
      const list = await poolOf(subject);
      const bad = list
        .filter((q) => q.format === 'panel')
        .filter(
          (q) =>
            !Array.isArray(q.panelOrder) ||
            q.panelOrder.length === 0 ||
            q.panelOrder.some(
              (i) => !Number.isInteger(i) || i < 0 || i >= q.options.length,
            ),
        )
        .map((q) => `${idOf(q)} order=[${q.panelOrder}] options=${q.options.length}`);
      expect(bad).toEqual([]);
    }
  });

  it('panel はパネルが4〜10枚（少なすぎ・多すぎを弾く）', async () => {
    for (const subject of SUBJECTS) {
      const list = await poolOf(subject);
      const bad = list
        .filter((q) => q.format === 'panel')
        .filter((q) => q.options.length < 4 || q.options.length > 10)
        .map((q) => `${idOf(q)}=${q.options.length}枚`);
      expect(bad).toEqual([]);
    }
  });

  it('★手打ち入力の形式が1問も混ざっていない★', async () => {
    // 利用者の指定「さすがに手打ち入力は現実見ない」を
    // データ側でも担保する。生成器が記述問題を取り込むと
    // 画面に入力欄が出てしまう。
    // ★kana（五十音キーボード）は手打ち入力ではない★
    // アプリが描いたキーを押す形なのでIMEの変換が入らず、
    // 「押すだけで答えられる」という方針の中にある。
    const allowed = new Set(['choice4', 'choice', 'kana', 'word', 'panel']);
    for (const subject of SUBJECTS) {
      const list = await poolOf(subject);
      const bad = list.filter((q) => !allowed.has(q.format)).map(idOf);
      expect(bad).toEqual([]);
    }
  });

  // ------------------------------------------------------------
  // 五十音キーボード（「みんはや」方式）
  // ------------------------------------------------------------

  it('★kana は options を持たない（持つと答えが漏れる）★', async () => {
    // options に答えの文字を入れてしまうと、プールを見ただけで
    // 「何文字か」と「どの文字を使うか」が分かってしまう。
    // 画面には五十音表しか出さないので、options は不要でもある。
    for (const subject of SUBJECTS) {
      const list = await poolOf(subject);
      const bad = list
        .filter((q) => q.format === 'kana')
        .filter((q) => !Array.isArray(q.options) || q.options.length !== 0)
        .map((q) => `${idOf(q)} options=${q.options.length}`);
      expect(bad).toEqual([]);
    }
  });

  it('★kana は answerIndex が -1（選択肢の添字を持たない）★', async () => {
    for (const subject of SUBJECTS) {
      const list = await poolOf(subject);
      const bad = list
        .filter((q) => q.format === 'kana')
        .filter((q) => q.answerIndex !== -1)
        .map((q) => `${idOf(q)}=${q.answerIndex}`);
      expect(bad).toEqual([]);
    }
  });

  it('★kana の答えが2〜8文字（時間内に押し終わる長さ）★', async () => {
    // 1文字だと押した瞬間に確定する形になり、誤タップがそのまま誤答になる。
    // 9文字以上は、思い出せていても制限時間内に押し終わらない。
    for (const subject of SUBJECTS) {
      const list = await poolOf(subject);
      const bad = list
        .filter((q) => q.format === 'kana')
        .filter((q) => q.panelOrder.length < 2 || q.panelOrder.length > 8)
        .map((q) => `${idOf(q)}=${q.panelOrder.length}文字`);
      expect(bad).toEqual([]);
    }
  });

  it('★kana の全ての文字が画面のキーボードから押せる★', async () => {
    // ★これが最も重要な検査★
    // 番号表（KANA_KEYS）には載っているが、五十音表（KANA_LAYOUT）には
    // 置いていない文字（現在は「ヲ」）を答えに含む問題を出すと、
    // 誰も入力できない＝両者0点確定の問題になる。
    // 型エラーにもならず、テストが無いと気づけない。
    for (const subject of SUBJECTS) {
      const list = await poolOf(subject);
      const bad = list
        .filter((q) => q.format === 'kana')
        .filter((q) => q.panelOrder.some((k) => !KANA_REACHABLE.has(k)))
        .map((q) => `${idOf(q)} order=[${q.panelOrder}]`);
      expect(bad).toEqual([]);
    }
  });

  it('★kana の答えがカタカナだけで書ける（表記ゆれが起きない）★', async () => {
    // 漢字の答え（「酸化」）をかなで書かせると
    // 「さんか」「サンカ」「酸化」のどれが正解か決まらない。
    // これは文字パネル形式が止まった理由とまったく同じなので、
    // カタカナの答えに限っていることをデータ側でも守る。
    for (const subject of SUBJECTS) {
      const list = await poolOf(subject);
      const bad = list
        .filter((q) => q.format === 'kana')
        .filter((q) => !/^[ァ-ヶー]+$/.test(kanaTextOf(q.panelOrder)))
        .map((q) => `${idOf(q)}=${kanaTextOf(q.panelOrder)}`);
      expect(bad).toEqual([]);
    }
  });

  it('★kana が Firestore の受付上限（12文字）を超えない★', async () => {
    // ルール側が rec.panel.size() <= 12 で弾くので、
    // これを超える問題を出すと ★正しく答えても書き込みが拒否される★。
    for (const subject of SUBJECTS) {
      const list = await poolOf(subject);
      const bad = list
        .filter((q) => q.format === 'kana')
        .filter((q) => q.panelOrder.length > KANA_MAX_INPUT)
        .map((q) => `${idOf(q)}=${q.panelOrder.length}文字`);
      expect(bad).toEqual([]);
    }
  });

  it('★合成形式（word / panel）が1問も残っていない★', async () => {
    // 「問題が論理的に破綻している場合が多い」という指摘を受けて、
    // 短答・記述から誤答を借りて作る形式を止めた。
    // 生成器の USE_SYNTHESIZED_FORMATS を戻すとここが落ちるので、
    // 「戻すなら理由を解決してからテストも直す」ことが強制される。
    for (const subject of SUBJECTS) {
      const list = await poolOf(subject);
      const bad = list.filter((q) => q.format === 'word' || q.format === 'panel').map(idOf);
      expect(bad, `${subject} に合成形式が残っている`).toEqual([]);
    }
  });
});

describe('出題プール — 1試合を組めるか', () => {
  it('★各教科、ルールが使う形式で questionCount 問以上ある★', async () => {
    // ここが足りないと対戦開始時に問題を並べられず、
    // 部屋を作った直後に落ちる。
    for (const subject of SUBJECTS) {
      const rule = defaultRuleOf(subject);
      if (!rule.enabled) continue;
      const ids = await poolIdsOf(subject, rule.formats);
      expect(
        ids.length,
        `${subject}: 形式[${rule.formats.join(',')}]で${ids.length}問しかないのに${rule.questionCount}問出す設定`,
      ).toBeGreaterThanOrEqual(rule.questionCount);
    }
  });

  it('★重複なしで1試合ぶん並べられる（groupOf を考慮しても足りる）★', async () => {
    // 同じ小問から作られた問題（例：同じ設問の word 版と panel 版）は
    // 1試合に1問しか出さない。その絞り込みのあとでも
    // questionCount に届くかを実際に組んで確かめる。
    for (const subject of SUBJECTS) {
      const rule = defaultRuleOf(subject);
      if (!rule.enabled) continue;
      const list = await poolOf(subject);
      const usable = list.filter((q) => rule.formats.includes(q.format));
      const ids = usable.map((q) => q.id);
      const groupOf = new Map<string, string>();
      for (const q of usable) groupOf.set(q.id, q.subQuestionId);

      const order = buildQuestionOrder(ids, rule.questionCount, `room-${subject}`, (id) =>
        groupOf.get(id) || id,
      );
      expect(order.length, `${subject} が1試合ぶん組めない`).toBe(rule.questionCount);
      expect(new Set(order).size, `${subject} の出題に重複`).toBe(order.length);
    }
  });

  it('★同じ部屋IDなら両端末で同じ問題が並ぶ★', async () => {
    // 対戦が成立する最低条件。ここが崩れると
    // 相手と違う問題を解きながら点を比べることになる。
    const subject = 'chemistry_basic';
    const rule = defaultRuleOf(subject);
    const list = await poolOf(subject);
    const ids = list.filter((q) => rule.formats.includes(q.format)).map((q) => q.id);
    const a = buildQuestionOrder(ids, rule.questionCount, 'ROOM-XY12');
    const b = buildQuestionOrder(ids, rule.questionCount, 'ROOM-XY12');
    expect(a).toEqual(b);
  });

  it('組んだ出題IDが questionByIdSync で本体に戻せる', async () => {
    // 部屋に保存されるのは questionIds だけなので、
    // ここが戻せないと問題文を表示できない。
    const subject = 'chemistry_basic';
    const rule = defaultRuleOf(subject);
    const list = await poolOf(subject);
    const ids = list.filter((q) => rule.formats.includes(q.format)).map((q) => q.id);
    const order = buildQuestionOrder(ids, rule.questionCount, 'ROOM-AB34');
    for (const id of order) {
      const q = questionByIdSync(subject, id);
      expect(q, `${id} を戻せない`).toBeTruthy();
      expect(q?.id).toBe(id);
    }
  });
});

describe('出題プール — 形式別の収録数（索引）', () => {
  it('★POOL_FORMAT_COUNTS が実データと一致する★', async () => {
    // 教科選択の「収録N問」はここから引く。
    // ズレると「選べるのに対戦できない」教科が出る。
    for (const subject of SUBJECTS) {
      const list = await poolOf(subject);
      const actual: Record<string, number> = {};
      for (const q of list) actual[q.format] = (actual[q.format] || 0) + 1;
      const indexed = POOL_FORMAT_COUNTS[subject] || {};
      // 索引側は 0 の形式を書かないので、実データ側の並びで比べる
      for (const [format, n] of Object.entries(actual)) {
        expect(
          indexed[format as keyof typeof indexed],
          `${subject}/${format}: 索引${indexed[format as keyof typeof indexed]} 実データ${n}`,
        ).toBe(n);
      }
      // 索引に書いてあるのに実データに無い形式が無いこと
      for (const [format, n] of Object.entries(indexed)) {
        expect(actual[format] || 0, `${subject}/${format}: 索引にあるが実データに無い`).toBe(n);
      }
    }
  });

  it('★poolCountOf が形式別の合計を返す★', async () => {
    for (const subject of SUBJECTS) {
      const list = await poolOf(subject);
      // ★ここに形式を足し忘れると「全形式の合計」が全件にならない★
      // 新しい形式を作ったら必ずこの行にも足すこと。
      const all = poolCountOf(subject, ['choice4', 'choice', 'kana', 'word', 'panel']);
      expect(all, `${subject} の全形式合計`).toBe(list.length);
      expect(all).toBe(POOL_COUNTS[subject]);
    }
  });

  it('知らない教科・空の形式でも0を返す（例外を投げない）', () => {
    expect(poolCountOf('no_such_subject', ['choice4'])).toBe(0);
    expect(poolCountOf('chemistry_basic', [])).toBe(0);
  });

  it('★有効な教科は poolCountOf が questionCount 以上★', () => {
    // poolIdsOf を使う検査（動的 import）と同じことを、
    // 索引だけで（＝プールを読まずに）確かめる。
    // 教科選択の画面はこの索引しか見ないので、ここが本番の表示と同じ。
    for (const rule of Object.values(BATTLE_RULES)) {
      if (!rule.enabled) continue;
      const n = poolCountOf(rule.subject, rule.formats);
      expect(
        n,
        `${rule.subject}: 形式[${rule.formats.join(',')}]で${n}問しかないのに${rule.questionCount}問出す設定`,
      ).toBeGreaterThanOrEqual(rule.questionCount);
    }
  });
});

describe('出題プール — ルールとの対応', () => {
  it('BATTLE_RULES の有効な教科は、すべてプールを持っている', () => {
    // ルールだけ足してデータを生成し忘れると、
    // 教科カードが出るのに開始できない状態になる。
    for (const rule of Object.values(BATTLE_RULES)) {
      if (!rule.enabled) continue;
      expect(POOL_COUNTS[rule.subject], `${rule.subject} のプールが無い`).toBeGreaterThan(0);
    }
  });

  it('★収録数が少ない教科は、問題数を減らすか「同じ問題が出る」と明記している★', () => {
    // 利用者の懸念「問題数が少なかったらしんどい」への対応。
    //
    // 1試合でプールの3割以上を消費する設定は、連戦すると必ず既視感が出る。
    // ただし ★9問しか無い教科で「同じ問題が出ない」ようにする方法は無い★。
    // そこで禁止するのは「消費が多いこと」ではなく、
    // ★消費が多いのに黙っていること★ にした。
    // 先に伝えてあれば「壊れている」とは受け取られない。
    for (const rule of Object.values(BATTLE_RULES)) {
      if (!rule.enabled) continue;
      const count = poolCountOf(rule.subject, rule.formats);
      const ratio = rule.questionCount / count;
      if (ratio < 0.3) continue;
      expect(
        rule.note,
        `${rule.subject}: ${count}問しかないのに1試合${rule.questionCount}問（消費${Math.round(ratio * 100)}%）なのに note で断っていない`,
      ).toMatch(/同じ問題/);
    }
  });

  it('★1試合でプールを使い切る設定が無い（questionCount が収録数を超えない）★', () => {
    // 上の検査は「断ってあれば消費が多くてもよい」としているので、
    // 断り書きさえ書けば 10問しか無い教科で20問出す設定が通ってしまう。
    // それは断り書きでは救えない（試合が組めない）ので別に止める。
    for (const rule of Object.values(BATTLE_RULES)) {
      if (!rule.enabled) continue;
      const count = poolCountOf(rule.subject, rule.formats);
      expect(
        rule.questionCount,
        `${rule.subject}: ${count}問しかないのに1試合${rule.questionCount}問`,
      ).toBeLessThanOrEqual(count);
    }
  });

  it('★プールが無い教科は enabled: false になっている★', () => {
    // 数学は選択肢を持つ設問が0件になったので対戦から外した。
    // ルールだけ有効なまま残すと、教科カードは出ないのに
    // defaultEnabledSubjects() には現れて、別の画面で食い違う。
    for (const rule of Object.values(BATTLE_RULES)) {
      if ((POOL_COUNTS[rule.subject] || 0) > 0) continue;
      expect(rule.enabled, `${rule.subject}: プールが無いのに enabled`).toBe(false);
    }
  });

  it('リスニングは制限時間が固定されている（再生時間で決まるため）', () => {
    expect(BATTLE_RULES.english_listening.timeLimitOverride).toBe(35);
  });
});
