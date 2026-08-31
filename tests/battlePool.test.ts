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
 *  3. panel は panelOrder が空でなく、全要素が options の範囲内
 *  4. 選択肢に空文字・重複が無い（重複＝正解が2つある状態）
 *  5. 問題文が空でない（prompt と label の両方が空だと何も表示されない）
 *  6. 制限時間が現実的な範囲（8〜40秒）
 *  7. POOL_COUNTS が実データと一致（UIの「収録N問」が嘘にならない）
 *  8. 各教科で、そのルールが使う形式の問題が questionCount 以上ある
 *     （足りないと1試合を組めない＝対戦開始で落ちる）
 *  9. groupOf（同じ小問から作った問題）が1試合に重複しない前提が
 *     成り立つだけのグループ数がある
 */
import { describe, it, expect } from 'vitest';
import type { BattleQuestion } from '../src/battle/core/types';
import { POOL_COUNTS, loadPool, poolIdsOf, questionByIdSync } from '../src/battle/data/battlePool';
import { BATTLE_RULES, defaultRuleOf } from '../src/battle/core/battleRules';
import { buildQuestionOrder } from '../src/battle/core/battleCore';

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
        .filter((q) => q.format !== 'panel')
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
    const allowed = new Set(['choice4', 'word', 'panel']);
    for (const subject of SUBJECTS) {
      const list = await poolOf(subject);
      const bad = list.filter((q) => !allowed.has(q.format)).map(idOf);
      expect(bad).toEqual([]);
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

describe('出題プール — ルールとの対応', () => {
  it('BATTLE_RULES の有効な教科は、すべてプールを持っている', () => {
    // ルールだけ足してデータを生成し忘れると、
    // 教科カードが出るのに開始できない状態になる。
    for (const rule of Object.values(BATTLE_RULES)) {
      if (!rule.enabled) continue;
      expect(POOL_COUNTS[rule.subject], `${rule.subject} のプールが無い`).toBeGreaterThan(0);
    }
  });

  it('★収録数が少ない教科は questionCount が減らされている★', () => {
    // 利用者の懸念「問題数が少なかったらしんどい」への対応。
    // 1試合でプールの3割以上を消費する設定を禁止する。
    for (const rule of Object.values(BATTLE_RULES)) {
      if (!rule.enabled) continue;
      const count = POOL_COUNTS[rule.subject] || 0;
      const ratio = rule.questionCount / count;
      expect(
        ratio,
        `${rule.subject}: ${count}問しかないのに1試合${rule.questionCount}問（消費${Math.round(ratio * 100)}%）`,
      ).toBeLessThan(0.3);
    }
  });

  it('リスニングは制限時間が固定されている（再生時間で決まるため）', () => {
    expect(BATTLE_RULES.english_listening.timeLimitOverride).toBe(35);
  });
});
