/**
 * ===================================================================
 * 対戦モード：★試合後にだけ出す解答★（請求⑦-A）の門
 * ===================================================================
 *
 * -------------------------------------------------------------------
 * ■ この機能は何をするものか
 * -------------------------------------------------------------------
 * このアプリの構造は
 *
 *     ① オンライン対戦  ⇒  ② 演習・インプット
 *
 * である。①だけで終わると「楽しかった」で終わって、
 * 間違えた問題は間違えたまま残る。
 * そこでリザルト画面に
 *
 *     ・試合後の答え
 *     ・ひと言の理由（authored の oneLine）
 *     ・この単元を演習する（②への入口）
 *
 * を出す。この3つが「対戦 ⇒ 演習」の橋である。
 *
 * -------------------------------------------------------------------
 * ■ ★このテストが守っている、たったひとつの本質★
 * -------------------------------------------------------------------
 * 「答えは ★試合が終わってから★ 端末に来る」という約束である。
 *
 * 出題プール（pool.<教科>.generated.ts）は ★対戦が始まる前に★
 * 読み込まれる。そこに解答文（oneLine）を1問でも混ぜると、
 * 開発者ツールのネットワークタブを開くだけで全問の答えが読める。
 * この対戦はレートが動くので、それは不正の入口そのものになる。
 *
 * 出題プールが correctAnswer を持たない（answerIndex しか持たない）のは
 * まさにこの理由で、oneLine は「答えそのもの」なので同じ扱いにする。
 *
 * ★この約束はコメントでは守れない。★
 * 生成器を1行変えれば簡単に混ざるし、混ざっても画面は正常に動くので
 * 誰も気づかない（気づくのは外部の誰かが気づいたときになる）。
 * だからここで機械的に見る。
 *
 * -------------------------------------------------------------------
 * ■ 何を見るか
 * -------------------------------------------------------------------
 *  1. ★出題プールのファイルに解答文が1文字も入っていない★（本質）
 *  2. 解答は別ファイル（answer.<教科>.generated.ts）に出ている
 *  3. 解答の出題IDが、実在する出題のIDである（画面で引けない解答が無い）
 *  4. 解答の本文が空でない／長すぎない（画面が崩れない）
 *  5. ANSWER_COUNTS が実データと一致（索引が嘘をつかない）
 *  6. ★解答を読む関数を呼んでいるのはリザルト画面だけ★
 *     （待機画面・対戦画面から呼ぶと、試合前に答えが落ちてくる）
 *  7. 手書き問題は全問が解答を持っている（作問の取りこぼしが無い）
 */

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, it, expect } from 'vitest';
import {
  ANSWER_COUNTS,
  POOL_COUNTS,
  loadBattleAnswers,
  loadPool,
} from '../src/battle/data/battlePool';

const ROOT = resolve(__dirname, '..');
const DATA_DIR = resolve(ROOT, 'src/battle/data');
const UI_DIR = resolve(ROOT, 'src/battle/ui');

/** 検査する教科（索引に載っているものすべて） */
const SUBJECTS = Object.keys(POOL_COUNTS);

/**
 * 1行解答の上限。
 * 検証器（scripts/verify-authored-battle.mts の ONELINE_MAX）と
 * 変換器（src/battle/core/authoredConvert.ts の ONELINE_MAX）と同じ 120。
 */
const ONELINE_MAX = 120;

describe('試合後の解答 — ★出題プールに答えが混ざっていないこと★', () => {
  it('★出題プールのファイルに解答文（oneLine）が1文字も入っていない★', async () => {
    /**
     * ここが落ちたときに疑うのは1か所だけである:
     *   scripts/gen-battle-pool.mts の toTuple() に oneLine を足していないか。
     *
     * 「リザクトに出したいから、いっそプールに入れてしまえ」は
     * ★対戦前に答えを配る★ことなので、絶対にやってはいけない。
     * 解答は renderAnswerFile() が別ファイルに出す。
     */
    for (const subject of SUBJECTS) {
      const poolPath = resolve(DATA_DIR, `pool.${subject}.generated.ts`);
      if (!existsSync(poolPath)) continue;
      const poolText = readFileSync(poolPath, 'utf8');

      const answers = await loadBattleAnswers(subject);
      if (answers.size === 0) continue;

      // 解答文を（先頭から）何本か抜いて、プールの本文に現れないことを見る。
      // 全件見ると 1500 本 × 500KB の総当たりになるので、
      // 先頭・中間・末尾から拾って十分な数だけ見る。
      const all = Array.from(answers.values());
      const picks = [
        ...all.slice(0, 20),
        ...all.slice(Math.floor(all.length / 2), Math.floor(all.length / 2) + 20),
        ...all.slice(-20),
      ];
      const leaked = picks.filter((one) => one.length >= 10 && poolText.includes(one));
      expect(
        leaked.slice(0, 3),
        `★${subject} の出題プールに解答文が入っている★ ` +
          '（対戦が始まる前に答えが端末へ落ちてしまう。' +
          'gen-battle-pool.mts の toTuple() に oneLine を足していないか確認すること）',
      ).toEqual([]);
    }
  });

  it('解答は教科ごとの別ファイル（answer.*.generated.ts）に出ている', () => {
    const files = readdirSync(DATA_DIR).filter(
      (f) => f.startsWith('answer.') && f.endsWith('.generated.ts'),
    );
    // 索引に載っている教科ぶんだけ出ていること（0問の教科も空ファイルが出る）
    for (const subject of SUBJECTS) {
      expect(
        files,
        `${subject} の解答ファイルが無い（npm run gen:battle-pool を実行したか）`,
      ).toContain(`answer.${subject}.generated.ts`);
    }
  });

  it('解答ファイルは他のモジュールを import しない（葉モジュール）', () => {
    /**
     * ★教科データ（約2.6MB）を巻き込まないこと★
     * 解答ファイルが何かを import すると、リザルト画面を出した瞬間に
     * その依存ぶんまで落ちてくる。プール本体と同じ約束にしておく。
     */
    for (const subject of SUBJECTS) {
      const p = resolve(DATA_DIR, `answer.${subject}.generated.ts`);
      if (!existsSync(p)) continue;
      const text = readFileSync(p, 'utf8');
      const imports = text.match(/^\s*import\s/gm) || [];
      expect(imports, `answer.${subject}.generated.ts が import を持っている`).toEqual([]);
    }
  });
});

describe('試合後の解答 — 中身', () => {
  it('★解答の出題IDが、実在する出題のIDである★', async () => {
    /**
     * ここがズレると、画面は「答えの無い問題」として黙って行を出さない。
     * 表示が静かに欠けるだけなので、目では気づけない。
     */
    for (const subject of SUBJECTS) {
      const answers = await loadBattleAnswers(subject);
      if (answers.size === 0) continue;
      const pool = await loadPool(subject);
      const ids = new Set(pool.map((q) => q.id));
      const orphan = Array.from(answers.keys()).filter((id) => !ids.has(id));
      expect(
        orphan.slice(0, 5),
        `${subject}: 出題プールに無い出題IDの解答がある（${orphan.length}件）`,
      ).toEqual([]);
    }
  });

  it('解答の本文が空でなく、120文字を超えない', async () => {
    for (const subject of SUBJECTS) {
      const answers = await loadBattleAnswers(subject);
      const bad = Array.from(answers.entries()).filter(
        ([, one]) => !one.trim() || Array.from(one).length > ONELINE_MAX,
      );
      expect(
        bad.slice(0, 5).map(([id, one]) => `${id}(${Array.from(one).length}字)`),
        `${subject}: 解答の長さが範囲外`,
      ).toEqual([]);
    }
  });

  it('ANSWER_COUNTS が実データと一致する', async () => {
    for (const subject of SUBJECTS) {
      const answers = await loadBattleAnswers(subject);
      expect(
        ANSWER_COUNTS[subject] ?? 0,
        `${subject}: ANSWER_COUNTS が実データとズレている（再生成が必要）`,
      ).toBe(answers.size);
    }
  });

  it('★手書き問題（a: で始まる出題）は全問が解答を持っている★', async () => {
    /**
     * 手書き問題は oneLine を必須欄として書いてもらっている
     * （verify:authored が 10〜120 文字で検査している）。
     * ここが欠けていたら、生成器が oneLine を運び忘れている。
     */
    for (const subject of SUBJECTS) {
      const pool = await loadPool(subject);
      const authored = pool.filter((q) => q.id.startsWith('a:'));
      if (authored.length === 0) continue;
      const answers = await loadBattleAnswers(subject);
      const missing = authored.filter((q) => !answers.get(q.id)).map((q) => q.id);
      expect(
        missing.slice(0, 5),
        `${subject}: 手書き問題なのに解答が無い（${missing.length}件 / 全${authored.length}件）。` +
          'gen-battle-pool.mts が oneLine を運べていない可能性がある',
      ).toEqual([]);
    }
  });
});

describe('試合後の解答 — ★読み込むのはリザルト画面だけ★', () => {
  it('loadBattleAnswers を呼ぶのは BattleResult.tsx だけ', () => {
    /**
     * ★これがこのテストの一番の役目★
     *
     * 解答を別ファイルに分けても、待機画面や対戦画面から読んでしまえば
     * 「試合前に答えが端末に来る」ことになり、分けた意味が消える。
     * しかも画面の見た目は何も変わらないので、レビューでも気づけない。
     *
     * 呼び出し箇所をファイル名で固定しておけば、
     * 別の画面から呼んだ瞬間にここが落ちる。
     */
    const allowed = new Set(['BattleResult.tsx']);
    const callers: string[] = [];
    for (const f of readdirSync(UI_DIR)) {
      if (!f.endsWith('.tsx') && !f.endsWith('.ts')) continue;
      const text = readFileSync(resolve(UI_DIR, f), 'utf8');
      if (text.includes('loadBattleAnswers')) callers.push(f);
    }
    expect(
      callers.filter((f) => !allowed.has(f)),
      '★リザルト画面以外から解答を読み込んでいる★ ' +
        '（試合が終わる前に答えが端末へ落ちる。リザルトで読むこと）',
    ).toEqual([]);
    expect(callers, 'BattleResult.tsx が解答を読み込んでいない').toContain('BattleResult.tsx');
  });

  it('対戦中の画面（BattleQuestionView / BattleLobby）は解答ファイルを import しない', () => {
    for (const f of ['BattleQuestionView.tsx', 'BattleLobby.tsx', 'BattleMatching.tsx']) {
      const p = resolve(UI_DIR, f);
      if (!existsSync(p)) continue;
      const text = readFileSync(p, 'utf8');
      expect(text.includes('answer.'), `${f} が解答ファイルを直接 import している`).toBe(false);
      expect(text.includes('loadBattleAnswers'), `${f} が解答を読み込んでいる`).toBe(false);
    }
  });
});

describe('対戦 ⇒ 演習 の橋（この単元を演習する）', () => {
  it('★リザルトの演習ボタンがアプリ本体まで配線されている★', () => {
    /**
     * onPractice は
     *   App.tsx → BattleMode → BattleRoomScreen → BattleResult
     * と手渡しで下りていく。途中の1段が渡し忘れていると、
     * ボタンが「出ない」だけで、エラーにはならない（＝気づけない）。
     * 4段すべてに名前があることを見る。
     */
    const chain: Array<[string, string]> = [
      ['src/App.tsx', 'onPractice={handlePracticeFromBattle}'],
      ['src/battle/ui/BattleMode.tsx', 'onPractice={onPractice}'],
      ['src/battle/ui/BattleRoomScreen.tsx', 'onPractice={onPractice}'],
      ['src/battle/ui/BattleResult.tsx', 'onPractice(subject, row.chapterId)'],
    ];
    for (const [file, needle] of chain) {
      const text = readFileSync(resolve(ROOT, file), 'utf8');
      expect(
        text.includes(needle),
        `${file} で「この単元を演習する」の配線が切れている（${needle} が無い）`,
      ).toBe(true);
    }
  });

  it('リザルト画面は教科データ本体（allChapters / chemistryData）を import しない', () => {
    /**
     * 章名を出すために教科データ本体を読むと、対戦モードのチャンクに
     * 約2.6MBが入ってしまう（過去に同じ失敗をしている）。
     * 章名は軽い索引（chapterIndex.generated.ts）から引くこと。
     */
    const text = readFileSync(resolve(UI_DIR, 'BattleResult.tsx'), 'utf8');
    const importLines = (text.match(/^import[\s\S]*?from\s+'[^']+';/gm) || []).join('\n');
    expect(
      /from '.*data\/chemistryData'/.test(importLines),
      'BattleResult が教科データ本体を import している',
    ).toBe(false);
    // allChapters は「型だけ」なら許す（型は実行時に消える）。値の import は不可。
    const valueFromAllChapters = /^import\s+(?!type)[^;]*from\s+'.*data\/allChapters';/m.test(
      importLines,
    );
    expect(
      valueFromAllChapters,
      'BattleResult が allChapters から値を import している（型だけにすること）',
    ).toBe(false);
    expect(
      text.includes('chapterIndex.generated'),
      'BattleResult が章名を軽い索引から引いていない',
    ).toBe(true);
  });
});
