/**
 * ===================================================================
 * 手書き対戦問題（authored）の変換の検査
 * ===================================================================
 *
 * -------------------------------------------------------------------
 * ■ このテストが守っているもの
 * -------------------------------------------------------------------
 * 別の作業場（別ルーム）の AI が、既存の演習問題を読んだうえで
 * 「対戦の1画面で解ける大きさ」に割り直した問題を JSON で書く。
 * その JSON が対戦画面に出るまでの唯一の関門が
 * src/battle/core/authoredConvert.ts の convertAuthoredQuestion である。
 *
 * ここが1つ壊れると、
 *
 *   ・誰も正解できない問題が対戦に出る（両者0点。点数は残らないので追えない）
 *   ・作業場が丸一日かけて書いた問題が、理由も出ずに静かに消える
 *
 * のどちらかが起きる。★過去に実際に前者が起きている★
 * （gen-battle-pool.mts の USE_SYNTHESIZED_FORMATS。
 *   誤答を同じ章の他の設問の正解から機械的に「借りた」結果、
 *   借りた誤答が実は正しくて、正解が2つある問題ができた）
 *
 * -------------------------------------------------------------------
 * ■ tsc では捕まらない
 * -------------------------------------------------------------------
 * このリポジトリの tsconfig.json に strict は付いていない。
 * 「correct: true が2つある」「answer に押せない文字が入っている」は
 * 型としては正しい JSON なので、型検査では1つも捕まらない。
 * 実行して確かめるしかない。
 *
 * -------------------------------------------------------------------
 * ■ 何を見るか（すべて「実際に事故になる形」だけ）
 * -------------------------------------------------------------------
 *  1. 通るべきものが通る（choice / choice4 / kana の3形式）
 *  2. 正解の位置が options の中の正しい文字列を指している
 *  3. kana の panelOrder が、五十音表から実際に押して復元できる
 *  4. 落とすべきものを落とす（9パターン）
 *  5. 同じ JSON からは必ず同じ並びが出る（再生成の差分がレビューできる）
 *  6. 正解の位置が1か所に偏らない（人が書くと2番目に偏るのを消せているか）
 */
import { describe, it, expect } from 'vitest';
import {
  convertAuthoredQuestion,
  authoredRejectMessage,
  AUTHORED_TIME_MIN,
  AUTHORED_TIME_MAX,
  AUTHORED_MIN_OPTIONS,
  AUTHORED_MAX_OPTIONS,
} from '../src/battle/core/authoredConvert';
import type { AuthoredQuestion } from '../src/battle/core/authoredTypes';
import { KANA_KEYS, kanaTextOf } from '../src/battle/core/kanaKeyboard';

// ============================================================
// 見本（実際の見本ファイルと同じ形）
// ============================================================

/** 3択の見本。元データの「純物質／混合物／単体」の分類にあたる */
function choiceSample(over: Partial<AuthoredQuestion> = {}): AuthoredQuestion {
  return {
    id: 'a:c1_1:q1:q1_a:1',
    source: { chapterId: 'c1_1', problemId: 'q1', subQuestionId: 'q1_a' },
    format: 'choice',
    prompt: '物質のうち、1種類の物質だけでできているものを何というか。',
    label: '',
    options: [
      { text: '純物質', correct: true, why: '1種類の物質だけからなるものを純物質という。' },
      { text: '混合物', why: '2種類以上の純物質が混じったものなので当てはまらない。' },
      { text: '単体', why: '単体は「1種類の元素」からなるもので、物質の種類の話ではない。' },
    ],
    oneLine: '純物質。1種類の物質だけでできているので、融点・沸点が一定になる。',
    timeLimit: 13,
    ...over,
  };
}

/** 4択の見本 */
function choice4Sample(over: Partial<AuthoredQuestion> = {}): AuthoredQuestion {
  return {
    id: 'a:c1_1:q2:q2_4:1',
    source: { chapterId: 'c1_1', problemId: 'q2', subQuestionId: 'q2_4' },
    format: 'choice4',
    prompt: 'メタン CH₄ は、混合物・単体・化合物・同素体のどれに分類されるか。',
    label: '',
    options: [
      { text: '化合物', correct: true, why: 'CとHの2種類の元素からできた純物質である。' },
      { text: '混合物', why: '一定の組成をもつ純物質なので混合物ではない。' },
      { text: '単体', why: '単体は1種類の元素からなるもの。CH₄ は2種類。' },
      { text: '同素体', why: '同素体は同じ元素からなる別の単体どうしの関係を指す語。' },
    ],
    oneLine: '化合物。CとHの2種類の元素が結合した純物質なので、単体でも混合物でもない。',
    timeLimit: 13,
    ...over,
  };
}

/** 五十音キーボードの見本 */
function kanaSample(over: Partial<AuthoredQuestion> = {}): AuthoredQuestion {
  return {
    id: 'a:c1_1:q4:q4_1:1',
    source: { chapterId: 'c1_1', problemId: 'q4', subQuestionId: 'q4_1' },
    format: 'kana',
    prompt:
      '水と混ぜて加熱すると沸点が一定にならない混合物になる、消毒用アルコールの主成分である液体の名称をカタカナで答えよ。',
    label: '',
    answer: 'エタノール',
    answerWhy: '消毒用アルコールの主成分で、水と混ぜると沸点が一定にならない。',
    oneLine: 'エタノール。純物質は沸点が一定だが、水と混ぜた混合物では一定にならない。',
    timeLimit: 16,
    ...over,
  };
}

/** 変換に成功することを前提に、中身を取り出す */
function ok(q: AuthoredQuestion) {
  const r = convertAuthoredQuestion(q);
  if (r.ok !== true) {
    throw new Error(`変換に失敗した（通るはずの問題）: ${authoredRejectMessage(r.reason)}`);
  }
  return r.question;
}

// ============================================================
// 1. 通るべきものが通る
// ============================================================

describe('通るべき手書き問題', () => {
  it('3択は format: choice になり、選択肢が3つ残る', () => {
    const q = ok(choiceSample());
    expect(q.format).toBe('choice');
    expect(q.options).toHaveLength(3);
    expect(q.panelOrder).toEqual([]);
  });

  it('4択は format: choice4 になる（画面の並べ方が変わるので区別が要る）', () => {
    const q = ok(choice4Sample());
    expect(q.format).toBe('choice4');
    expect(q.options).toHaveLength(4);
  });

  it('★正解の位置が、正しい選択肢の文字列を指している★', () => {
    // ここが1つずれると「正しく答えたのに不正解」になる。
    const q = ok(choiceSample());
    expect(q.options[q.answerIndex]).toBe('純物質');

    const q4 = ok(choice4Sample());
    expect(q4.options[q4.answerIndex]).toBe('化合物');
  });

  it('元の source（章・大問・小問）がそのまま運ばれる（①→②の橋になる）', () => {
    const q = ok(choiceSample());
    expect(q.chapterId).toBe('c1_1');
    expect(q.problemId).toBe('q1');
    expect(q.subQuestionId).toBe('q1_a');
  });

  it('id の先頭が a: のまま保たれる（機械生成の q: / k: と見分けるため）', () => {
    expect(ok(choiceSample()).id.startsWith('a:')).toBe(true);
  });
});

// ============================================================
// 2. 五十音キーボード
// ============================================================

describe('五十音キーボード形式', () => {
  it('★panelOrder を押すと、元の答えが復元できる★', () => {
    // ここがずれると「正しく押したのに不正解」になる。
    // 番号表（KANA_KEYS）は永久に並びを変えてはいけない理由がこれ。
    const q = ok(kanaSample());
    expect(q.format).toBe('kana');
    expect(kanaTextOf(q.panelOrder)).toBe('エタノール');
    expect(q.panelOrder.map((i) => KANA_KEYS[i]).join('')).toBe('エタノール');
  });

  it('選択肢を1つも持たない（持たせると答えの文字数と使う文字が漏れる）', () => {
    const q = ok(kanaSample());
    expect(q.options).toEqual([]);
    expect(q.answerIndex).toBe(-1);
  });

  it('カタカナ以外（漢字・英字・数値）は落とす', () => {
    for (const answer of ['塩化ナトリウム', 'ethanol', '3.14', 'エタノール2']) {
      const r = convertAuthoredQuestion(kanaSample({ answer }));
      expect(r.ok, `${answer} は落ちるべき`).toBe(false);
    }
  });

  it('1文字の答えは落とす（押した瞬間に確定して手直しできない）', () => {
    expect(convertAuthoredQuestion(kanaSample({ answer: 'ア' })).ok).toBe(false);
  });

  it('9文字以上は落とす（制限時間内に押し終われない）', () => {
    expect(convertAuthoredQuestion(kanaSample({ answer: 'アイウエオカキクケ' })).ok).toBe(false);
  });

  it('★五十音表から押せない文字（ヲ）が混ざったら落とす★', () => {
    // 番号表には載っているが五十音表に置いていない文字。
    // 混ざると誰も入力できない＝両者0点確定の問題になる。
    const r = convertAuthoredQuestion(kanaSample({ answer: 'ヲタク' }));
    expect(r.ok).toBe(false);
    if (r.ok === false) expect(r.reason).toBe('kana_unreachable');
  });

  it('長音符（ー）は使える（「エタノール」が通っているので確認済み）', () => {
    expect(ok(kanaSample({ answer: 'イオン' })).panelOrder.length).toBe(3);
    expect(kanaTextOf(ok(kanaSample()).panelOrder)).toContain('ー');
  });
});

// ============================================================
// 3. 落とすべきものを落とす
// ============================================================

describe('落とすべき手書き問題', () => {
  it('id が a: で始まっていない', () => {
    const r = convertAuthoredQuestion(choiceSample({ id: 'q:c1_1:q1:q1_a' }));
    expect(r.ok).toBe(false);
    if (r.ok === false) expect(r.reason).toBe('id_format');
  });

  it('source が欠けている', () => {
    const r = convertAuthoredQuestion(
      choiceSample({ source: { chapterId: 'c1_1', problemId: '', subQuestionId: 'q1_a' } }),
    );
    expect(r.ok).toBe(false);
    if (r.ok === false) expect(r.reason).toBe('source_missing');
  });

  it('prompt と label が両方空（画面に何も出ない）', () => {
    const r = convertAuthoredQuestion(choiceSample({ prompt: '', label: '' }));
    expect(r.ok).toBe(false);
    if (r.ok === false) expect(r.reason).toBe('empty_text');
  });

  it('prompt が空でも label があれば通る（穴埋め型の設問がこの形）', () => {
    expect(ok(choiceSample({ prompt: '', label: '(1) 1種類の物質だけでできているもの' })).label)
      .toBeTruthy();
  });

  it('★correct: true が2つある（正解が2つ＝運で勝敗が決まる）★', () => {
    const bad = choiceSample();
    bad.options![1].correct = true;
    const r = convertAuthoredQuestion(bad);
    expect(r.ok).toBe(false);
    if (r.ok === false) expect(r.reason).toBe('options_correct_count');
  });

  it('correct: true が1つも無い（誰も正解できない）', () => {
    const bad = choiceSample();
    delete bad.options![0].correct;
    const r = convertAuthoredQuestion(bad);
    expect(r.ok).toBe(false);
    if (r.ok === false) expect(r.reason).toBe('options_correct_count');
  });

  it('★選択肢に中身が同じものがある（正解が2つあるのと同じ）★', () => {
    const bad = choiceSample({
      options: [
        { text: '純物質', correct: true, why: 'a' },
        { text: '純物質', why: 'b' },
        { text: '混合物', why: 'c' },
      ],
    });
    const r = convertAuthoredQuestion(bad);
    expect(r.ok).toBe(false);
    if (r.ok === false) expect(r.reason).toBe('options_duplicate');
  });

  it('選択肢の text が空', () => {
    const bad = choiceSample();
    bad.options![2].text = '   ';
    const r = convertAuthoredQuestion(bad);
    expect(r.ok).toBe(false);
    if (r.ok === false) expect(r.reason).toBe('options_empty_text');
  });

  it(`選択肢が1つ（下限 ${AUTHORED_MIN_OPTIONS} 未満）`, () => {
    const r = convertAuthoredQuestion(
      choiceSample({ options: [{ text: '純物質', correct: true, why: 'a' }] }),
    );
    expect(r.ok).toBe(false);
    if (r.ok === false) expect(r.reason).toBe('options_count');
  });

  it(`選択肢が7つ（上限 ${AUTHORED_MAX_OPTIONS} 超・スマホで読めない）`, () => {
    const many = Array.from({ length: 7 }, (_, i) => ({
      text: `選択肢${i}`,
      why: 'テスト',
      ...(i === 0 ? { correct: true } : {}),
    }));
    const r = convertAuthoredQuestion(choiceSample({ options: many }));
    expect(r.ok).toBe(false);
    if (r.ok === false) expect(r.reason).toBe('options_count');
  });

  it('2択は落とさない（元データが意図して作った2択を認める方針）', () => {
    const q = ok(
      choiceSample({
        prompt: '「植物の生育には窒素が欠かせない」の『窒素』は、単体・元素のどちらの意味か。',
        options: [
          { text: '元素', correct: true, why: '成分としての窒素を指しているので元素。' },
          { text: '単体', why: '単体なら窒素分子 N₂ そのものを指す文になる。' },
        ],
      }),
    );
    expect(q.format).toBe('choice');
    expect(q.options).toHaveLength(2);
  });

  it('選択肢が無い choice（kana と書き間違えた場合）', () => {
    const r = convertAuthoredQuestion(choiceSample({ options: undefined }));
    expect(r.ok).toBe(false);
    if (r.ok === false) expect(r.reason).toBe('options_count');
  });

  it('未知の format', () => {
    // 型では弾かれるが、JSON は型を通らずに来るのでここで止める
    const r = convertAuthoredQuestion(
      choiceSample({ format: 'panel' as unknown as AuthoredQuestion['format'] }),
    );
    expect(r.ok).toBe(false);
    if (r.ok === false) expect(r.reason).toBe('unknown_format');
  });
});

// ============================================================
// 4. 制限時間
// ============================================================

describe('制限時間', () => {
  it(`${AUTHORED_TIME_MIN} 秒未満は下限に丸める`, () => {
    expect(ok(choiceSample({ timeLimit: 3 })).timeLimit).toBe(AUTHORED_TIME_MIN);
  });

  it(`${AUTHORED_TIME_MAX} 秒超は上限に丸める（1問で試合が終わらないように）`, () => {
    expect(ok(choiceSample({ timeLimit: 300 })).timeLimit).toBe(AUTHORED_TIME_MAX);
  });

  it('書き忘れ（0 / undefined）でも落とさず下限にする', () => {
    expect(ok(choiceSample({ timeLimit: 0 })).timeLimit).toBe(AUTHORED_TIME_MIN);
    expect(
      ok(choiceSample({ timeLimit: undefined as unknown as number })).timeLimit,
    ).toBe(AUTHORED_TIME_MIN);
  });
});

// ============================================================
// 5. 再現性と、正解位置の偏り
// ============================================================

describe('選択肢の並べ替え', () => {
  it('★同じ JSON からは必ず同じ並びが出る★', () => {
    // 乱数を使うと、再生成の差分が「本当の変更」なのか
    // 「乱数のゆらぎ」なのか区別できず、レビューできなくなる。
    const a = ok(choice4Sample());
    const b = ok(choice4Sample());
    expect(a.options).toEqual(b.options);
    expect(a.answerIndex).toBe(b.answerIndex);
  });

  it('id が違えば並びも変わる（種が id なので同じ並びに固まらない）', () => {
    const seen = new Set<string>();
    for (let i = 0; i < 30; i += 1) {
      const q = ok(choice4Sample({ id: `a:c1_1:q2:q2_4:${i}` }));
      seen.add(q.options.join('|'));
    }
    expect(seen.size).toBeGreaterThan(1);
  });

  it('★正解の位置が1か所に偏らない（人が書くと2番目に偏る問題への対策）★', () => {
    const counts = [0, 0, 0, 0];
    const N = 400;
    for (let i = 0; i < N; i += 1) {
      const q = ok(choice4Sample({ id: `a:c1_1:q2:q2_4:${i}` }));
      counts[q.answerIndex] += 1;
    }
    // 4択なので理想は各25%。どの位置も 15%〜35% に収まっていればよい。
    for (const c of counts) {
      expect(c / N).toBeGreaterThan(0.15);
      expect(c / N).toBeLessThan(0.35);
    }
  });

  it('並べ替えても、答えは正しい文字列を指し続ける', () => {
    for (let i = 0; i < 50; i += 1) {
      const q = ok(choice4Sample({ id: `a:c1_1:q2:q2_4:${i}` }));
      expect(q.options[q.answerIndex]).toBe('化合物');
      expect(q.options).toHaveLength(4);
      expect(new Set(q.options).size).toBe(4);
    }
  });
});

// ============================================================
// 6. 落とした理由の文言
// ============================================================

describe('落とした理由の文言', () => {
  it('すべての理由に日本語の説明がある（作業場が読んで直せるように）', () => {
    const reasons = [
      'id_format',
      'source_missing',
      'empty_text',
      'kana_not_katakana',
      'kana_length',
      'kana_unreachable',
      'options_count',
      'options_empty_text',
      'options_correct_count',
      'options_duplicate',
      'unknown_format',
    ] as const;
    for (const r of reasons) {
      const msg = authoredRejectMessage(r);
      expect(msg, r).toBeTruthy();
      expect(msg, r).not.toBe('不明');
    }
  });
});
