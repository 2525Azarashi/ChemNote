/**
 * ===================================================================
 * 対戦用 出題プールの生成スクリプト
 * ===================================================================
 *
 *     npm run gen:battle-pool
 *
 * 教科データ本体（src/data/*.ts）から、対戦で出題できる小問だけを抜き出して
 *
 *     src/battle/data/battlePool.generated.ts
 *
 * を生成する。
 *
 * -------------------------------------------------------------------
 * ■ なぜ「生成」するのか（実行時に作らない理由）
 * -------------------------------------------------------------------
 * 対戦は「両者にまったく同じ問題を、同じ順で出す」ことが絶対条件である。
 * もし出題プールを実行時に組み立てると、
 *
 *   ・アプリを更新した直後、片方だけ新しいプールを持っている状態が起きる
 *     （＝同じ部屋なのに問題が違う、という最悪の不具合になる）
 *   ・誤答選択肢を実行時に抽選すると、両者で違う選択肢が並ぶ
 *
 * という2つの破綻が起きる。そこで
 *
 *   ・プールの内容（誤答選択肢・並び順・制限時間）はビルド時に確定させる
 *   ・実行時は「そのプールから、部屋IDを種にして問題を抽選する」だけにする
 *
 * という形にした。抽選は決定論的な乱数（battleCore.ts の buildQuestionOrder）
 * なので、種が同じなら誰の端末でも同じ並びになる。
 *
 * さらに、既存の scripts/gen-chapter-index.mts と同じ方式で
 * ★生成物が本体とズレていないかをテストで突き合わせる★
 * （src/battle/tests/battlePool.test.ts）。
 * 問題を足して再生成を忘れるとテストが落ちるので、
 * 古いプールが本番に出ることはない。
 *
 * -------------------------------------------------------------------
 * ■ 「記述の手打ち入力」を1つも作らない方針
 * -------------------------------------------------------------------
 * 対戦は制限時間が短い。日本語IMEの変換確定が入ると、
 * 端末やIMEの差で実力と無関係に勝敗が決まってしまう。
 * そこで、元が記述・短答の設問も ★押すだけで答えられる形★ に変換する。
 *
 *   choice4 … 元から4択（そのまま使う）
 *   word    … 4つの語句カードから選ぶ（元が短答・記述）
 *   panel   … 文字パネルを順に押して語を組み立てる（元が短答の2〜6文字）
 *
 * -------------------------------------------------------------------
 * ■ 誤答選択肢（ダミー）の作り方
 * -------------------------------------------------------------------
 * ★同じ章の他の設問の正解を誤答として使う。★
 *
 * これは「それっぽい嘘を作る」より確実で、かつ学習効果が高い。
 * 例: 「2種類以上の物質が混じり合ったものを何というか」の答え「混合物」に対して、
 * 同じ章にある「純物質」「単体」「化合物」が誤答として並ぶ。
 * どれも紛らわしいので、当てずっぽうでは当たらない。
 *
 * 同じ章に足りないときは、同じ教科の中から文字数の近いものを補う。
 * それでも4つに満たない設問は ★プールに入れない★（無理に出題しない）。
 *
 * 実測: 短答1036件のうち1021件は同じ章の中だけで誤答3つが確保できる。
 */

import { writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { SUBJECTS, getChaptersOfSubject } from '../src/data/allChapters';
import { calcSubQuestionTimeLimit } from '../src/utils/scoring';
import { normalizeAnswer } from '../src/utils/answerJudge';

const HERE = dirname(fileURLToPath(import.meta.url));
/** 生成物の出力先ディレクトリ（教科ごとに1ファイル＋索引1ファイルを置く） */
const OUT_DIR = resolve(HERE, '../src/battle/data');

// ============================================================
// 生成に使う設定
// ============================================================

/**
 * 対戦の制限時間の下限・上限（秒）。
 *
 * 既存の scoring.ts の見積り（20〜240秒）は「1人でじっくり解く」前提なので、
 * そのままだと対戦としては長すぎる。対戦では次の式で圧縮する。
 *
 *     対戦の秒数 = clamp(round(1人用の秒数 × BATTLE_TIME_RATIO), 下限, 上限)
 *
 * ★比率で圧縮する理由★
 * 全問同じ秒数にすると、問題文が長い問題（実データの上位10%は904文字以上）は
 * 読み終わる前に締切が来てしまう。1人用の見積りは問題文の長さ・選択肢の数を
 * 見ているので、比率で縮めれば「長い問題は長め」という関係が保たれる。
 */
const BATTLE_TIME_MIN = 8;
const BATTLE_TIME_MAX = 30;
const BATTLE_TIME_RATIO = 0.42;

/** 文字パネル形式にできる答えの文字数 */
const PANEL_MIN_CHARS = 2;
const PANEL_MAX_CHARS = 5;

/** 文字パネルに並べるダミー文字の数（正解の文字数に加えて並べる） */
const PANEL_DECOY_COUNT = 3;

/** 語句選択（word）で使う答えの最大文字数。これより長いとカードに収まらない */
const WORD_MAX_CHARS = 28;

/**
 * 対戦用に切り出す問題文（リード文）の最大文字数。
 *
 * ★リード文と設問文を別枠にしている理由★
 * 穴埋め問題は「長いリード文の中に空欄がある」形なので、
 * リード文を丸ごと切ると空欄そのものが消えてしまう。
 * そこで
 *   ・空欄の周辺だけを切り出す（extractBlankContext）
 *   ・設問文（ラベル）は別枠で必ず全文出す
 * という2段構えにしている。
 */
const PROMPT_MAX_CHARS = 150;

/** 空欄の前後をどれだけ残すか（文字数） */
const BLANK_CONTEXT_BEFORE = 90;
const BLANK_CONTEXT_AFTER = 50;

/** 設問文（ラベル）の最大文字数 */
const LABEL_MAX_CHARS = 110;

/**
 * ラベルが「それだけで答えられる問い」と見なす最小文字数。
 *
 * 「(ア)」「問3」のような参照記号を取り除いた残りがこれ以上あれば、
 * ラベル自体が問いになっていると判断する（実測: 146件が該当）。
 */
const SELF_CONTAINED_MIN_CHARS = 6;

/**
 * ラベル自体が問いのとき、リード文を添える上限文字数。
 * これを超えるリード文は捨てる（肝心の問いが埋もれるため）。
 */
const SELF_CONTAINED_LEAD_MAX = 70;

/** 空欄を表す目印。対戦画面ではここを強調表示する */
const BLANK_MARK = '［　？　］';

// ============================================================
// 型
// ============================================================

type Format = 'choice4' | 'word' | 'panel';

interface PoolQuestion {
  id: string;
  subject: string;
  chapterId: string;
  problemId: string;
  subQuestionId: string;
  format: Format;
  prompt: string;
  label: string;
  options: string[];
  answerIndex: number;
  panelOrder: number[];
  timeLimit: number;
  imageUrl?: string;
}

interface RawSub {
  subject: string;
  chapterId: string;
  problemId: string;
  problemText: string;
  imageUrl?: string;
  id: string;
  label: string;
  type: string;
  correctAnswer: string;
  acceptedAnswers: string[];
  options: string[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  raw: any;
}

// ============================================================
// 決定論的な乱数（生成の再現性のため）
// ============================================================

/**
 * 種から擬似乱数を作る（battleCore.ts と同じ mulberry32）。
 *
 * ★生成に Math.random() を使わない理由★
 * 使うと、同じ問題データから生成しても毎回違うプールができてしまう。
 * そうなると「再生成の差分」が本当の変更なのか乱数のゆらぎなのか
 * 区別できず、レビューできない。ここでは設問IDを種にするので、
 * 同じデータからは必ず同じプールが生成される。
 */
function hashString(input: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h >>> 0;
}

function createRandom(seed: number): () => number {
  let a = seed >>> 0;
  return function random(): number {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffleWith<T>(items: readonly T[], random: () => number): T[] {
  const arr = items.slice();
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    const tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
  }
  return arr;
}

// ============================================================
// 問題文の整形
// ============================================================

/**
 * 問題文から、対戦画面に出す部分だけを切り出す。
 *
 * ★なぜ切り出すのか★
 * 実データの問題文には、対戦では邪魔な情報が含まれている。
 *   ・「第1回　① 基本5文型（5問・4択）」のような見出し
 *   ・「【音源の聞き方】…」のような操作説明（数百文字）
 *   ・「────────」の区切り線
 *   ・問1〜問5 の全部（対戦では1問だけ出したい）
 * これをそのまま出すと、画面が説明文で埋まって肝心の設問が見えない。
 */
function cleanPrompt(text: string): string {
  const lines = String(text || '').split('\n');
  const kept: string[] = [];
  let skipping = false;

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;
    // 区切り線
    if (/^[─—\-=＝]{3,}$/.test(line)) continue;
    // 【…】で始まる操作説明のブロックは、次の空行までまとめて捨てる
    if (/^【.*】/.test(line)) {
      skipping = true;
      continue;
    }
    if (skipping) {
      // 説明の続き（句点で終わる説明文）を捨て続ける。
      // 「問1」など設問が始まったら再開する。
      if (/^問\s*\d+/.test(line) || /^[（(]?[ア-ンA-Za-z0-9]{1,3}[)）]/.test(line)) {
        skipping = false;
      } else {
        continue;
      }
    }
    // 「第1回　第1問 A（4問・2回読み）」のような見出し
    if (/^第\s*\d+\s*回/.test(line) && line.length < 60) continue;
    // 「①〜④のうちから1つずつ選びなさい」のような一括指示
    if (/[①-⑩]〜[①-⑩]/.test(line) && /選び/.test(line)) continue;
    kept.push(line);
  }

  const joined = kept.join('\n').trim();
  if (joined.length <= PROMPT_MAX_CHARS) return joined;
  return `${joined.slice(0, PROMPT_MAX_CHARS - 1)}…`;
}

/**
 * 問題文の中から「問N」のブロック（設問文＋①〜④）を切り出す。
 *
 * ★なぜ必要なのか（実測）★
 * 英文法100問・リスニング221問は、選択肢の配列が
 *
 *     options: ['①','②','③','④']
 *
 * という★記号だけ★になっていて、選択肢の本文は問題文の中にある。
 *
 *     問1　Your plan ______ good to me.
 *     ① sounds
 *     ② hears
 *     ③ listens
 *     ④ is heard
 *
 * これを解析せずに出題すると、対戦画面のカードが「①」「②」「③」「④」に
 * なってしまい、何も読めない画面になる。
 *
 * 実測の成功率:
 *   英文法        100/100 件（全件成功）
 *   リスニング    146/221 件（残り75件はイラスト選択問題で、
 *                 選択肢が絵なので対戦には使えない → プールに入れない）
 */
function parseNumberedBlocks(text: string): Map<number, { stem: string; options: string[] }> {
  const out = new Map<number, { stem: string; options: string[] }>();
  const lines = String(text || '').split('\n');
  let cur: { no: number; stem: string[]; opts: string[] } | null = null;

  const flush = (): void => {
    if (cur && cur.opts.length >= 2) {
      out.set(cur.no, { stem: cur.stem.join(' ').trim(), options: cur.opts });
    }
    cur = null;
  };

  for (const raw of lines) {
    const line = raw.trim();
    const mq = line.match(/^問\s*(\d+)[　\s]*(.*)$/);
    if (mq) {
      flush();
      cur = { no: Number(mq[1]), stem: mq[2] ? [mq[2]] : [], opts: [] };
      continue;
    }
    if (!cur) continue;
    const mo = line.match(/^([①②③④⑤⑥⑦⑧⑨⑩])[\s　]*(.+)$/);
    if (mo) {
      cur.opts.push(mo[2].trim());
      continue;
    }
    if (/^[─—\-=＝]{3,}$/.test(line)) {
      flush();
      continue;
    }
    if (line && cur.opts.length === 0) cur.stem.push(line);
  }
  flush();
  return out;
}

/** 選択肢が記号だけ（①②③④ / アイウエ / abcd）かどうか */
function isSymbolOnlyOptions(options: string[]): boolean {
  if (options.length === 0) return false;
  return options.every(
    (o) => /^[①-⑩\s]+$/.test(o) || /^[ア-ン]$/.test(o) || /^[a-dA-D]$/.test(o),
  );
}

/** 正解の選択肢が options の何番目かを求める（記号・本文の両方に対応） */
function findAnswerIndex(options: string[], correctAnswer: string): number {
  const target = normalizeAnswer(correctAnswer);
  if (!target) return -1;

  // ① そのまま一致
  const direct = options.findIndex((o) => normalizeAnswer(o) === target);
  if (direct >= 0) return direct;

  // ② 「①」のような記号で答えが指定されている場合、記号の位置を数える
  const symbols = '①②③④⑤⑥⑦⑧⑨⑩';
  const symIdx = symbols.indexOf(target);
  if (symIdx >= 0 && symIdx < options.length) return symIdx;

  // ③ 「ア」のような記号
  const kana = 'アイウエオカキクケコ';
  const kanaIdx = kana.indexOf(target);
  if (kanaIdx >= 0 && kanaIdx < options.length) return kanaIdx;

  // ④ 「a」「A」
  if (/^[a-jA-J]$/.test(target)) {
    const i = target.toLowerCase().charCodeAt(0) - 97;
    if (i < options.length) return i;
  }
  return -1;
}

// ============================================================
// 収集
// ============================================================

function collectAll(): RawSub[] {
  const rows: RawSub[] = [];
  /**
   * 収録済みの小問キー。
   *
   * ★重複を除く理由（実測 83 件）★
   * 教科データには、同じ大問が miniTest と practiceProblems の両方に
   * 登録されている章がある（chemistry_basic の c2_1 で 7 大問）。
   * 1人用では「小テスト」と「演習」という別の入口なので問題ないが、
   * 対戦プールにそのまま入れると、まったく同じ問題が2件並ぶ。
   * 抽選で両方引くと ★同じ問題が1試合に2回出る★ ので、先に潰す。
   */
  const seen = new Set<string>();

  for (const subject of SUBJECTS) {
    for (const chapter of getChaptersOfSubject(subject.id)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const ch = chapter as any;
      const problems = [...(ch.miniTest || []), ...(ch.practiceProblems || [])];
      for (const problem of problems) {
        for (const sq of problem.subQuestions || []) {
          const key = `${ch.id}/${problem.id}/${sq.id}`;
          if (seen.has(key)) continue;
          seen.add(key);

          rows.push({
            subject: subject.id,
            chapterId: String(ch.id),
            problemId: String(problem.id),
            problemText: String(problem.text || ''),
            imageUrl: problem.imageUrl ? String(problem.imageUrl) : undefined,
            id: String(sq.id),
            label: String(sq.label || ''),
            type: String(sq.type || 'text'),
            correctAnswer: String(sq.correctAnswer ?? ''),
            acceptedAnswers: Array.isArray(sq.acceptedAnswers)
              ? sq.acceptedAnswers.map((a: unknown) => String(a))
              : [],
            options: Array.isArray(sq.options) ? sq.options.map((o: unknown) => String(o)) : [],
            raw: sq,
          });
        }
      }
    }
  }
  return rows;
}

// ============================================================
// 変換: 元から4択のもの
// ============================================================

/**
 * 元から選択肢を持つ設問を choice4 に変換する。
 *
 * ・選択肢が5つ以上 → 正解＋誤答3つを選んで4つに切り詰める
 * ・選択肢が3つ以下 → 対戦では使わない（4択に揃えられないため）
 * ・選択肢が記号だけ → 問題文から本文を取り出して差し替える
 */
function convertChoice(row: RawSub, blocks: Map<number, { stem: string; options: string[] }>): PoolQuestion | null {
  let options = row.options;
  let stem = '';

  if (isSymbolOnlyOptions(options)) {
    // 選択肢の本文が問題文の中にある形式（英文法・リスニング）
    const m = row.label.match(/問\s*(\d+)/);
    if (!m) return null;
    const block = blocks.get(Number(m[1]));
    if (!block || block.options.length < 4) return null;
    options = block.options;
    stem = block.stem;
  }

  if (options.length < 4) return null;

  const answerIndex = findAnswerIndex(options, row.correctAnswer);
  if (answerIndex < 0) return null;

  const random = createRandom(hashString(`c4:${uniqueKey(row)}`));

  // 4つに絞る（正解は必ず含める）
  let finalOptions = options;
  if (options.length > 4) {
    const wrong = options.filter((_, i) => i !== answerIndex);
    const picked = shuffleWith(wrong, random).slice(0, 3);
    finalOptions = shuffleWith([options[answerIndex], ...picked], random);
  }

  const finalAnswer = finalOptions.findIndex(
    (o) => normalizeAnswer(o) === normalizeAnswer(options[answerIndex]),
  );
  if (finalAnswer < 0) return null;

  // 対戦画面に出す問題文と設問文。
  //
  // ★stem（問題文から切り出したその設問だけの文）があれば最優先★
  //   リード文全体より短く、かつその設問の内容そのものなので確実。
  // ★無ければ穴埋め問題と同じ組み立てを使う★
  //   4択でも「リード文の(ア)に入る語を選べ」型があり、
  //   リード文を先頭から切ると空欄が消える。また地理・生物には
  //   「問いはラベルにあり、リード文は資料の導入だけ」という型があるので、
  //   buildBlankPrompt に判定を任せる（同じ規則を2箇所に書かない）。
  const display = stem
    ? { prompt: cleanPrompt(stem), label: formatLabel(row.label) }
    : buildBlankPrompt(row);

  return {
    id: `q:${uniqueKey(row)}`,
    subject: row.subject,
    chapterId: row.chapterId,
    problemId: row.problemId,
    subQuestionId: row.id,
    format: 'choice4',
    prompt: display.prompt,
    label: display.label,
    options: finalOptions.map((o) => trimOption(o)),
    answerIndex: finalAnswer,
    panelOrder: [],
    timeLimit: battleTimeLimit(row),
    imageUrl: row.imageUrl,
  };
}

// ============================================================
// 変換: 短答・記述 → 語句選択（word）
// ============================================================

/**
 * 短答・記述の設問を「4つの語句カードから選ぶ」形に変換する。
 *
 * 誤答は同じ章の他の設問の正解から取る（無ければ同じ教科から補う）。
 * ★文字数の近いものを優先する★
 *   「混合物」の誤答に「液体が周囲に飛び散るのを防ぐため」が混ざると、
 *   長さだけで正解が分かってしまう（長い方が正解だと当てられる）。
 *   そこで、正解と文字数が近い候補を優先して並べる。
 */
function convertWord(
  row: RawSub,
  sameChapter: string[],
  sameSubject: string[],
): PoolQuestion | null {
  const answer = row.correctAnswer.trim();
  if (!answer) return null;
  if (answer.length > WORD_MAX_CHARS) return null;

  const answerNorm = normalizeAnswer(answer);

  /** 候補から、正解と同じもの・重複を除いて文字数の近い順に並べる */
  const rank = (pool: string[]): string[] => {
    const seen = new Set<string>([answerNorm]);
    const uniq: string[] = [];
    for (const c of pool) {
      const n = normalizeAnswer(c);
      if (!n || seen.has(n)) continue;
      // 正解が誤答の一部（またはその逆）になっているものは避ける。
      // 「単体」と「単体・化合物」が並ぶと、どちらも正しく見えてしまう。
      if (n.includes(answerNorm) || answerNorm.includes(n)) continue;
      seen.add(n);
      uniq.push(c.trim());
    }
    return uniq.sort(
      (a, b) => Math.abs(a.length - answer.length) - Math.abs(b.length - answer.length),
    );
  };

  const candidates = [...rank(sameChapter), ...rank(sameSubject)];
  // 章の候補で足りない場合に教科の候補が続くので、重複をもう一度除く
  const seen = new Set<string>([answerNorm]);
  const decoys: string[] = [];
  for (const c of candidates) {
    const n = normalizeAnswer(c);
    if (seen.has(n)) continue;
    seen.add(n);
    decoys.push(c);
    if (decoys.length === 3) break;
  }
  if (decoys.length < 3) return null;

  const random = createRandom(hashString(`w:${uniqueKey(row)}`));
  const options = shuffleWith([answer, ...decoys], random);
  const answerIndex = options.findIndex((o) => normalizeAnswer(o) === answerNorm);
  if (answerIndex < 0) return null;

  const display = buildBlankPrompt(row);
  // 何を答えるのか画面から読み取れない設問は出題しない（後述の判定に集約）
  if (!isAnswerable(display)) return null;

  return {
    id: `w:${uniqueKey(row)}`,
    subject: row.subject,
    chapterId: row.chapterId,
    problemId: row.problemId,
    subQuestionId: row.id,
    format: 'word',
    prompt: display.prompt,
    label: display.label,
    options: options.map((o) => trimOption(o)),
    answerIndex,
    panelOrder: [],
    timeLimit: battleTimeLimit(row),
    imageUrl: row.imageUrl,
  };
}

// ============================================================
// 変換: 短答 → 文字パネル（panel）
// ============================================================

/**
 * 短答の設問を「文字パネルを順に押して語を組み立てる」形に変換する。
 *
 * 例: 答えが「酸化」なら、パネルに ['化','素','酸','水'] を並べ、
 *     「酸」→「化」の順に押せば正解。
 *
 * ★手打ち入力の代わりとして入れている★
 * 語句選択（4択）だけだと「選択肢を見れば思い出せる」ので、
 * 用語をきちんと覚えているかを問えない。
 * 文字パネルは自分で語を組み立てる必要があるので、
 * 手打ち入力に近い手応えを、入力の速さに左右されずに出せる。
 *
 * ダミー文字は同じ章の他の答えに使われている文字から取る。
 * こうすると「その章で学ぶ用語」の文字が並ぶので、
 * 見た目で正解が浮かないうえ、紛らわしい語も作れてしまう
 * （例: 「酸化」を作るパネルで「水素」も作れる）。
 */
function convertPanel(row: RawSub, chapterChars: string[]): PoolQuestion | null {
  const answer = row.correctAnswer.trim();
  if (answer.length < PANEL_MIN_CHARS || answer.length > PANEL_MAX_CHARS) return null;
  // 日本語（漢字・ひらがな・カタカナ・長音）だけを対象にする。
  // 数式や英単語は1文字ずつ押す形に向かない（「x^5/5 + C」など）。
  if (!/^[\u4E00-\u9FFF\u3040-\u309F\u30A0-\u30FFー]+$/.test(answer)) return null;
  // 同じ文字が2回出る語は、押した順の判定が分かりにくくなるので避ける
  const chars = Array.from(answer);
  if (new Set(chars).size !== chars.length) return null;

  const used = new Set(chars);
  const decoyPool = chapterChars.filter((c) => !used.has(c));
  if (decoyPool.length < PANEL_DECOY_COUNT) return null;

  const random = createRandom(hashString(`p:${uniqueKey(row)}`));
  const decoys = shuffleWith([...new Set(decoyPool)], random).slice(0, PANEL_DECOY_COUNT);
  const options = shuffleWith([...chars, ...decoys], random);

  // 正解を押す順（options の添字）
  const panelOrder: number[] = [];
  const consumed = new Set<number>();
  for (const ch of chars) {
    const idx = options.findIndex((o, i) => o === ch && !consumed.has(i));
    if (idx < 0) return null;
    consumed.add(idx);
    panelOrder.push(idx);
  }

  const display = buildBlankPrompt(row);
  if (!isAnswerable(display)) return null;

  return {
    id: `p:${uniqueKey(row)}`,
    subject: row.subject,
    chapterId: row.chapterId,
    problemId: row.problemId,
    subQuestionId: row.id,
    format: 'panel',
    prompt: display.prompt,
    label: display.label,
    options,
    answerIndex: -1,
    panelOrder,
    timeLimit: battleTimeLimit(row),
    imageUrl: row.imageUrl,
  };
}

// ============================================================
// 共通のヘルパ
// ============================================================

/**
 * 対戦での制限時間（秒）。
 * 1人用の見積り（scoring.ts）を比率で圧縮し、下限・上限でクランプする。
 */
function battleTimeLimit(row: RawSub): number {
  const solo = calcSubQuestionTimeLimit({
    id: row.id,
    type: row.type,
    label: row.label,
    correctAnswer: row.correctAnswer,
    options: row.options,
    items: row.raw?.items,
  });
  const scaled = Math.round(solo * BATTLE_TIME_RATIO);
  return Math.min(BATTLE_TIME_MAX, Math.max(BATTLE_TIME_MIN, scaled));
}

/**
 * 短答・記述の設問について、対戦画面に出す問題文を作る。
 *
 * -------------------------------------------------------------------
 * ■ 実データの設問は2種類に分かれる（実測）
 * -------------------------------------------------------------------
 *   ① 空欄参照型（1076件）… ラベルが「(ア)」だけ。
 *      答えるべき場所はリード文の中の「( ア )」。
 *      ラベルだけ見せても何も分からないので、★リード文が必須★。
 *
 *   ② 自己完結型（146件）… ラベルが問いそのもの。
 *      例「（1） ろ紙を通過して下に落ちた液体の名称」→ 答え「ろ液」
 *      この場合リード文は文脈にすぎず、ラベルだけで答えられる。
 *
 * この2つを同じ扱いにすると、①では「(ア)」しか出ない画面になり、
 * ②では長いリード文で肝心の問いが埋もれる。そこで型を判定して分ける。
 *
 * -------------------------------------------------------------------
 * ■ 空欄参照型で「空欄の周辺だけ」を切り出す理由
 * -------------------------------------------------------------------
 * リード文は中央値268文字・上位10%で904文字ある。
 * 先頭から150文字で切ると、後半にある空欄が消えてしまう
 * （＝答えるべき場所が画面に無い問題になる）。
 * そこで★空欄の位置を見つけて、その前後だけを残す★。
 *
 * -------------------------------------------------------------------
 * ■ 他の空欄の答えを隠す
 * -------------------------------------------------------------------
 * 実データには「( エ: 蒸留 )」のように、答えが併記された空欄がある。
 * これをそのまま出すと、その空欄が別の問題として出題されたときに
 * 答えが見えてしまう。記号だけの「（エ）」に戻して隠す。
 */
interface Display {
  prompt: string;
  label: string;
  /** 画面を見て「何を答えればよいか」が分かるか（分からない設問は出題しない） */
  answerable: boolean;
}

function buildBlankPrompt(row: RawSub): Display {
  const labelKey = extractBlankKey(row.label);
  const bare = bareLabel(row.label);
  const selfContained = bare.length >= SELF_CONTAINED_MIN_CHARS;
  const label = formatLabel(row.label);

  // 他の空欄に併記された答えを隠す
  let text = String(row.problemText || '').replace(
    /[（(]\s*([ア-ンA-Za-z0-9]{1,3})\s*[:：][^)）]*[)）]/g,
    '（$1）',
  );

  if (labelKey) {
    // この設問が答える空欄を目印に置き換える
    const escaped = labelKey.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp(`[（(]\\s*${escaped}\\s*[)）]`, 'g');
    if (re.test(text)) {
      const marked = text.replace(re, BLANK_MARK);
      const context = extractBlankContext(marked);
      // 空欄の位置が特定できた。これが最良の形。
      if (context) return { prompt: context, label, answerable: true };
    }
  }

  if (selfContained) {
    // ラベル自体が問いになっている。
    // リード文は文脈にすぎないので、短ければ添え、長ければ捨てる
    // （長いリード文を付けると肝心の問いが埋もれる）。
    const lead = cleanPrompt(text);
    return {
      prompt: lead.length <= SELF_CONTAINED_LEAD_MAX ? lead : '',
      label,
      answerable: true,
    };
  }

  // ここに来るのは「ラベルが参照記号だけ」かつ「リード文に該当の空欄が
  // 見つからなかった」設問。★画面を見ても何を答えるか分からない★ので
  // 出題対象から外す（answerable: false）。
  // 無理に出すと「(ア) に入る語は？」だけが表示され、
  // 対戦相手も自分も運で押すしかない問題になってしまう。
  return { prompt: cleanPrompt(text), label, answerable: false };
}

/**
 * 画面から答えが読み取れる設問か。
 *
 * ★この判定を入れる理由★
 * 実データには「ラベルが (ア) だけ」かつ「リード文にその空欄の記号が
 * 見つからない」設問が一定数ある（元データの表記ゆれ・図中の空欄など）。
 * これを出題すると、両者にとって当てずっぽうの問題になり、
 * 対戦の結果が実力と無関係になる。数を減らしてでも外す。
 */
function isAnswerable(d: Display): boolean {
  if (!d.answerable) return false;
  // 問題文も設問文も無い（どちらも空）なら当然出せない
  return (d.prompt.length > 0 || d.label.length > 0);
}

/**
 * 目印（BLANK_MARK）の前後だけを切り出す。
 * 目印が無ければ null を返す（呼び出し側が通常の切り出しに落とす）。
 */
function extractBlankContext(marked: string): string | null {
  const pos = marked.indexOf(BLANK_MARK);
  if (pos < 0) return null;

  const head = marked.slice(0, pos);
  const tail = marked.slice(pos + BLANK_MARK.length);

  // 前側: 直近の文の区切り（。改行）から始める。無ければ文字数で切る。
  let before = head.slice(-BLANK_CONTEXT_BEFORE);
  const sep = Math.max(before.lastIndexOf('。'), before.lastIndexOf('\n'));
  if (sep >= 0 && before.length - sep > 12) before = before.slice(sep + 1);
  const truncatedHead = head.length > before.length;

  // 後側: 次の文の区切りまで。
  let after = tail.slice(0, BLANK_CONTEXT_AFTER);
  const end = after.search(/[。\n]/);
  if (end >= 0) after = after.slice(0, end + 1);
  const truncatedTail = tail.length > after.length && !/[。\n]$/.test(after);

  const body =
    `${truncatedHead ? '…' : ''}${before.trim()}${BLANK_MARK}${after.trim()}${truncatedTail ? '…' : ''}`;

  return body.replace(/\s*\n\s*/g, ' ').trim();
}

/**
 * ラベルが「それだけで答えられる問い」になっているか。
 *
 * 「(ア)」「(1)」のような参照だけなら false。
 * 「（1） ろ紙を通過して下に落ちた液体の名称」のように
 * 参照記号を取り除いても文が残るなら true。
 */
function bareLabel(label: string): string {
  return label
    .replace(/^問\s*\d+\s*/, '')
    .replace(/^[（(]\s*[ア-ンA-Za-z0-9]{1,3}\s*[)）]\s*/, '')
    .replace(/^[①-⑩]\s*/, '')
    .trim();
}

/** ラベル「問1 (ア)」から空欄の記号「ア」を取り出す（数字だけの (1) は空欄参照ではない） */
function extractBlankKey(label: string): string | null {
  // 「(ア)」のようなカナ・英字の参照だけを空欄参照と見なす。
  // 「(1)」「(2)」は設問の通し番号であって、リード文の空欄ではない
  // （実測: 数字を空欄記号として探すと139件が誤検出になる）。
  const m = label.match(/[（(]\s*([ア-ンA-Za-z])\s*[)）]/);
  if (m) return m[1];
  const bare = label.replace(/^問\s*\d+\s*/, '').trim();
  if (/^[ア-ン]$/.test(bare)) return bare;
  return null;
}

/** 設問文（ラベル）を対戦画面用に整える */
function formatLabel(label: string): string {
  const s = label.replace(/^問\s*\d+\s*/, '').replace(/\s+/g, ' ').trim();
  return s.length <= LABEL_MAX_CHARS ? s : `${s.slice(0, LABEL_MAX_CHARS - 1)}…`;
}

/**
 * 出題IDに使う、教科データ全体で一意なキー。
 *
 * ★小問IDだけでは一意にならない（実測）★
 *   小問ID だけ            → 131 件が衝突
 *   章ID + 小問ID          →  39 件が衝突
 *   章ID + 大問ID + 小問ID →   0 件（一意）
 *
 * 章をまたいで同じ小問ID（q1_a など）が使われているため、
 * 小問IDをそのまま出題IDにすると別の問題が同じIDになる。
 * 部屋には questionIds しか保存しないので、IDが衝突すると
 * ★対戦相手と違う問題が表示される★（最悪の不具合）。
 * また抽選の重複排除も効かなくなり、同じ問題が2回出る。
 *
 * 乱数の種にもこのキーを使う。種が衝突すると選択肢の並びまで
 * 同一になり、別問題なのに同じ並びという不自然な出題になる。
 */
function uniqueKey(row: RawSub): string {
  return `${row.chapterId}:${row.problemId}:${row.id}`;
}

/** 選択肢カードに収まるように整える */
function trimOption(option: string): string {
  const s = option.replace(/\s+/g, ' ').trim();
  return s.length <= 60 ? s : `${s.slice(0, 59)}…`;
}

// ============================================================
// 本体
// ============================================================

function build(): { pool: PoolQuestion[]; stats: Record<string, Record<string, number>> } {
  const rows = collectAll();

  // 問題文の解析結果は大問ごとに1回だけ行う（同じ大問の設問で共有する）
  const blocksByProblem = new Map<string, Map<number, { stem: string; options: string[] }>>();
  for (const row of rows) {
    if (!blocksByProblem.has(row.problemId)) {
      blocksByProblem.set(row.problemId, parseNumberedBlocks(row.problemText));
    }
  }

  // 誤答候補: 章ごと / 教科ごとの「正解の一覧」
  const answersByChapter = new Map<string, string[]>();
  const answersBySubject = new Map<string, string[]>();
  // 文字パネルのダミー文字: 章ごとに使われている文字
  const charsByChapter = new Map<string, Set<string>>();

  for (const row of rows) {
    const a = row.correctAnswer.trim();
    if (!a) continue;
    // 記号だけの答え（「①」「ア」）は誤答候補として意味がないので除く
    if (/^[①-⑩ア-ンa-dA-D]$/.test(a)) continue;

    if (row.type === 'short_answer' || row.type === 'descriptive' || row.type === 'text') {
      const ck = row.chapterId;
      if (!answersByChapter.has(ck)) answersByChapter.set(ck, []);
      answersByChapter.get(ck)!.push(a);
      if (!answersBySubject.has(row.subject)) answersBySubject.set(row.subject, []);
      answersBySubject.get(row.subject)!.push(a);

      // 文字パネルのダミー文字は「その章の用語に使われている文字」から取る。
      //
      // ★2文字未満の答えを除く理由★
      // 1文字の答えには「ア」「カ」「ギ」のような空欄参照の記号が混じっている
      // （元データで参照記号がそのまま correctAnswer に入っている設問がある）。
      // これをダミーに使うと、パネルに意味のないカタカナが並び、
      // 「明らかに使わない文字」として消去法のヒントになってしまう。
      if (a.length >= 2 && /^[\u4E00-\u9FFF\u3040-\u309F\u30A0-\u30FFー]+$/.test(a)) {
        if (!charsByChapter.has(ck)) charsByChapter.set(ck, new Set());
        for (const ch of a) charsByChapter.get(ck)!.add(ch);
      }
    }
  }

  const pool: PoolQuestion[] = [];
  const stats: Record<string, Record<string, number>> = {};
  const bump = (subject: string, key: string): void => {
    stats[subject] ??= { choice4: 0, word: 0, panel: 0, skipped: 0 };
    stats[subject][key] = (stats[subject][key] || 0) + 1;
  };

  for (const row of rows) {
    let made = 0;

    if (row.type === 'multiple_choice') {
      const q = convertChoice(row, blocksByProblem.get(row.problemId) || new Map());
      if (q) {
        pool.push(q);
        bump(row.subject, 'choice4');
        made += 1;
      }
    } else if (
      row.type === 'short_answer' ||
      row.type === 'descriptive' ||
      row.type === 'text'
    ) {
      const sameChapter = (answersByChapter.get(row.chapterId) || []).filter(
        (a) => a !== row.correctAnswer,
      );
      const sameSubject = (answersBySubject.get(row.subject) || []).filter(
        (a) => a !== row.correctAnswer,
      );

      const w = convertWord(row, sameChapter, sameSubject);
      if (w) {
        pool.push(w);
        bump(row.subject, 'word');
        made += 1;
      }

      // 文字パネルは短答のみ（記述の長文は組み立てられない）
      if (row.type !== 'descriptive') {
        const p = convertPanel(row, [...(charsByChapter.get(row.chapterId) || [])]);
        if (p) {
          pool.push(p);
          bump(row.subject, 'panel');
          made += 1;
        }
      }
    }
    // 'sorting' は対戦では使わない（並び替えは操作時間が長く、
    //  4択・パネルに変換すると元の設問の意図が失われる）

    if (made === 0) bump(row.subject, 'skipped');
  }

  // 出力の並びを安定させる（生成のたびに差分が出ないように）
  pool.sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
  return { pool, stats };
}

// ============================================================
// 出力（ファイル生成）
// ============================================================

/**
 * ===================================================================
 * 出力を「教科ごとのファイル」＋「タプル圧縮」にしている理由
 * ===================================================================
 *
 * ■ 1ファイルに全教科を入れると重すぎる
 * 全教科をまとめると整形JSONで約900KB になる。
 * 対戦画面を開いた瞬間にこれを読むと、化学基礎で対戦する人が
 * 英語・数学・地理の問題まで全部ダウンロードすることになる。
 * スマホの回線では体感で分かるレベルの遅さになる。
 *
 * → ★教科ごとに別ファイルにして、選ばれた教科だけを動的 import する。★
 *   化学基礎（最大の教科）でも 200KB 台、他は数十KB で済む。
 *
 * ■ オブジェクトではなくタプル（配列）で持つ理由
 * オブジェクト形式は 1 問ごとに
 *   "id": "subject": "chapterId": "format": "prompt": "label": ...
 * というキー名がそのまま文字列としてファイルに入る。
 * 1600問あるとキー名だけで 100KB を超える。
 * 配列にすればキー名は 1 回も出てこない。
 * 読み込み時に展開する関数（expand）を 1 つ置くだけで済む。
 *
 * ■ 整形（インデント）しない理由
 * JSON.stringify(x, null, 2) は 1 行ごとに空白が入り、
 * 実測でファイルサイズがほぼ 2 倍になる。
 * この生成ファイルは人が読むものではない（読むのは元データ側）ので、
 * 1 行 1 問の詰めた形で出す。差分は行単位で読めるので
 * レビュー可能性も保たれる。
 */

/** タプルの並び。expand() と必ず対応させること */
type Tuple = [
  id: string,
  chapterId: string,
  problemId: string,
  subQuestionId: string,
  format: number, // 0=choice4 1=word 2=panel
  prompt: string,
  label: string,
  options: string[],
  answerIndex: number,
  panelOrder: number[],
  timeLimit: number,
  imageUrl: string, // 無いときは ''
];

const FORMAT_CODE: Record<Format, number> = { choice4: 0, word: 1, panel: 2 };

function toTuple(q: PoolQuestion): Tuple {
  return [
    q.id,
    q.chapterId,
    q.problemId,
    q.subQuestionId,
    FORMAT_CODE[q.format],
    q.prompt,
    q.label,
    q.options,
    q.answerIndex,
    q.panelOrder,
    q.timeLimit,
    q.imageUrl || '',
  ];
}

/** 教科ごとの生成ファイルの中身を作る */
function renderSubjectFile(subject: string, pool: PoolQuestion[]): string {
  const lines = pool.map((q) => `  ${JSON.stringify(toTuple(q))},`).join('\n');

  return `/**
 * ===================================================================
 * 対戦用 出題プール: ${subject}（自動生成・手で編集しないこと）
 * ===================================================================
 *
 * ★このファイルは scripts/gen-battle-pool.mts が生成する。★
 * 手で書き換えても次の生成で消える。問題を直したいときは
 * 教科データ本体（src/data/*.ts）を直してから
 *
 *     npm run gen:battle-pool
 *
 * を実行すること。
 *
 * -------------------------------------------------------------------
 * ■ 収録数: ${pool.length} 問
 * -------------------------------------------------------------------
 *
 * ■ 中身は「タプルの配列」であって、読みやすさを捨てている。
 *   キー名（"prompt" など）を 1 問ごとに書くとファイルが倍以上になるため。
 *   並びの意味は battlePool.ts の expand() が持っている。
 *   ★並びを変えるときは expand() と必ず同時に変えること。★
 *
 * ■ このファイルは何も import しない（型すら import しない）。
 *   教科データ（約2.5MB）を間接的に読み込まないことが仕様である。
 */

/** [id, chapterId, problemId, subQuestionId, format, prompt, label, options, answerIndex, panelOrder, timeLimit, imageUrl] */
export const POOL: readonly unknown[][] = [
${lines}
];
`;
}

/** 教科ID → 生成ファイル名に使う安全な名前 */
function fileNameOf(subject: string): string {
  return `pool.${subject}.generated.ts`;
}

/**
 * 教科ファイルをまとめる索引を作る。
 *
 * ★静的 import ではなく動的 import にする理由★
 * ここで全教科を静的に import すると、分割した意味が消える
 * （バンドラが 1 つのチャンクにまとめてしまう）。
 * import() を使うと Vite が教科ごとに別チャンクを作り、
 * 選ばれた教科だけがネットワークを流れる。
 */
function renderIndexFile(subjects: string[], counts: Record<string, number>): string {
  const cases = subjects
    .map(
      (s) =>
        `    case '${s}':\n      return (await import('./${fileNameOf(s).replace(/\.ts$/, '')}')).POOL;`,
    )
    .join('\n');

  const countLines = subjects.map((s) => `  ${s}: ${counts[s] || 0},`).join('\n');

  return `/**
 * ===================================================================
 * 対戦用 出題プールの読み込み口（自動生成・手で編集しないこと）
 * ===================================================================
 *
 * ★このファイルは scripts/gen-battle-pool.mts が生成する。★
 *
 * -------------------------------------------------------------------
 * ■ 役割
 * -------------------------------------------------------------------
 * 教科ごとに分かれた生成ファイル（pool.*.generated.ts）を
 * ★必要になった教科だけ★ 動的に読み込む。
 *
 * 全教科をまとめると約900KBある。対戦画面を開いた時点で全部読むと、
 * 化学基礎で対戦する人が英語・数学・地理の問題まで
 * ダウンロードすることになる。教科は対戦開始時に決まっているので、
 * その1教科だけを取れば十分である。
 *
 * -------------------------------------------------------------------
 * ■ 一度読んだ教科は使い回す
 * -------------------------------------------------------------------
 * 1試合の中で何度も呼ばれる（問題を1問ずつ引く）ので、
 * 読み込み結果はモジュール内に保持する。
 * 同じ教科で連続して対戦しても再ダウンロードは起きない。
 */

import type { BattleAnswerFormat, BattleQuestion } from '../core/types';

/** 教科ごとの収録数（UIで「この教科は◯問あります」と出すために使う） */
export const POOL_COUNTS: Readonly<Record<string, number>> = {
${countLines}
};

const FORMATS: readonly BattleAnswerFormat[] = ['choice4', 'word', 'panel'];

/**
 * タプルを BattleQuestion に戻す。
 *
 * ★並びは生成ファイル側の toTuple() と対応している。★
 * どちらか片方だけ変えると全教科が壊れるので、必ず同時に変えること。
 */
function expand(subject: string, t: readonly unknown[]): BattleQuestion {
  return {
    id: t[0] as string,
    subject,
    chapterId: t[1] as string,
    problemId: t[2] as string,
    subQuestionId: t[3] as string,
    format: FORMATS[t[4] as number],
    prompt: t[5] as string,
    label: t[6] as string,
    options: t[7] as string[],
    answerIndex: t[8] as number,
    panelOrder: t[9] as number[],
    timeLimit: t[10] as number,
    imageUrl: (t[11] as string) || undefined,
  };
}

async function loadRaw(subject: string): Promise<readonly unknown[][]> {
  switch (subject) {
${cases}
    default:
      return [];
  }
}

/** 読み込み済みの教科（教科ID → 出題の配列） */
const cache = new Map<string, readonly BattleQuestion[]>();
/** 読み込み中の教科（同時に2回呼ばれても1回しか取りに行かないため） */
const inflight = new Map<string, Promise<readonly BattleQuestion[]>>();

/**
 * 教科の出題プールを読み込む。
 *
 * ★並び順はプールの並び（ID昇順）で固定★
 * 抽選は「部屋IDを種にした決定論的な乱数」でこの並びに対して行うため、
 * 順序が変わると同じ種でも違う問題が選ばれ、
 * 対戦相手と出題がズレる（＝対戦が成立しない）。
 * 生成時にID昇順で固定してあるので、問題を足さない限り順序は変わらない。
 */
export async function loadPool(subject: string): Promise<readonly BattleQuestion[]> {
  const cached = cache.get(subject);
  if (cached) return cached;

  const running = inflight.get(subject);
  if (running) return running;

  const promise = loadRaw(subject)
    .then((raw) => {
      const list = raw.map((t) => expand(subject, t));
      cache.set(subject, list);
      inflight.delete(subject);
      return list as readonly BattleQuestion[];
    })
    .catch((error) => {
      inflight.delete(subject);
      throw error;
    });

  inflight.set(subject, promise);
  return promise;
}

/**
 * 出題ID → 出題。
 * 部屋に保存されているのは questionIds だけなので、これで本体に戻す。
 * ★読み込み済みの教科でしか引けない★（先に loadPool を呼ぶこと）
 */
export function questionByIdSync(subject: string, id: string): BattleQuestion | undefined {
  const list = cache.get(subject);
  if (!list) return undefined;
  return list.find((q) => q.id === id);
}

/** 出題IDの一覧（形式で絞り込む）。抽選の母集団に使う */
export async function poolIdsOf(
  subject: string,
  formats: readonly BattleAnswerFormat[],
): Promise<string[]> {
  const list = await loadPool(subject);
  return list.filter((q) => formats.includes(q.format)).map((q) => q.id);
}

/** 読み込み済みの出題を全部返す（テスト・検証用） */
export function loadedPool(subject: string): readonly BattleQuestion[] {
  return cache.get(subject) || [];
}
`;
}

function main(): void {
  const { pool, stats } = build();

  const bySubject = new Map<string, PoolQuestion[]>();
  for (const q of pool) {
    if (!bySubject.has(q.subject)) bySubject.set(q.subject, []);
    bySubject.get(q.subject)!.push(q);
  }

  // 教科の並びは SUBJECTS の定義順（生成の再現性のため）
  const subjects = SUBJECTS.map((s) => s.id).filter((id) => bySubject.has(id));
  const counts: Record<string, number> = {};
  let totalBytes = 0;
  const perFile: Array<[string, number, number]> = [];

  for (const subject of subjects) {
    const list = bySubject.get(subject)!;
    counts[subject] = list.length;
    const source = renderSubjectFile(subject, list);
    const path = resolve(OUT_DIR, fileNameOf(subject));
    writeFileSync(path, source, 'utf8');
    const bytes = Buffer.byteLength(source, 'utf8');
    totalBytes += bytes;
    perFile.push([subject, list.length, bytes]);
  }

  const indexSource = renderIndexFile(subjects, counts);
  writeFileSync(resolve(OUT_DIR, 'battlePool.ts'), indexSource, 'utf8');
  totalBytes += Buffer.byteLength(indexSource, 'utf8');

  console.log(`[gen:battle-pool] 出題 ${pool.length} 件 / 合計 ${totalBytes.toLocaleString()} バイト`);
  console.log('[gen:battle-pool] 教科別（★対戦時はこのうち1教科だけを読み込む★）:');
  for (const [subject, count, bytes] of perFile) {
    const s = stats[subject] || {};
    console.log(
      `  ${subject.padEnd(20)} ${String(count).padStart(4)}問 ${String(Math.round(bytes / 1024)).padStart(4)}KB  ` +
        `(4択 ${String(s.choice4 || 0).padStart(3)} / 語句 ${String(s.word || 0).padStart(3)} / パネル ${String(s.panel || 0).padStart(3)})  ` +
        `未使用 ${s.skipped || 0}`,
    );
  }
}

main();
