/**
 * ===================================================================
 * 手書き対戦問題（authored）の検証
 * ===================================================================
 *
 * 使い方:
 *   npx tsx scripts/verify-authored-battle.mts                 # 全部見る
 *   npx tsx scripts/verify-authored-battle.mts chemistry_basic # 教科を絞る
 *   npx tsx scripts/verify-authored-battle.mts --survey chemistry_basic
 *        …… 「今どの小問が対戦に出ていないか」の一覧を出す（作業の入口）
 *   npx tsx scripts/verify-authored-battle.mts --file docs/battle-authoring/example.json
 *        …… authored/ の外にある1ファイルだけを見る（見本の検査に使う）
 *
 * -------------------------------------------------------------------
 * ■ このスクリプトが存在する理由
 * -------------------------------------------------------------------
 * 別の作業場の AI に問題を書かせる。書いたものが正しいかを
 * ★人間が1問ずつ目で見るのは無理★ である（化学基礎だけで数百問になる）。
 *
 * 過去に機械変換で失敗したときの壊れ方は、次の3つに集約できる。
 *
 *   1. 誤答が実は正しかった（他の設問から借りたため）
 *   2. リード文を切ったら答えが一意でなくなった
 *   3. 表記ゆれを固定できなかった
 *
 * これは全部 ★機械で検出できる★。検出できるものは機械に見させる。
 * 人間が見るべきなのは「機械が通したものが本当に良問か」だけにする。
 *
 * -------------------------------------------------------------------
 * ■ 何を見ているか（落ちる条件）
 * -------------------------------------------------------------------
 *  A. 形の検査
 *     ・id / source / format / prompt / label / timeLimit があるか
 *     ・id が `a:` で始まり、source と一致しているか
 *     ・id が重複していないか
 *
 *  B. ★元データに実在するか★
 *     ・source の chapterId / problemId / subQuestionId が実在するか
 *       → 存在しない小問を指す問題は「読まずに書いた」ものである
 *
 *  C. 選択式の検査
 *     ・選択肢が 2〜6 個
 *     ・correct がちょうど1つ
 *     ・選択肢が重複していない（正規化して比較。正解が2つある状態を防ぐ）
 *     ・★選択肢どうしが包含関係にない★
 *       「単体」と「単体・化合物」が並ぶと、どちらも正しく見える
 *     ・why が全選択肢にある（誤答の根拠を書けない＝借りてきた誤答）
 *     ・choice4 は4個ちょうど、choice は 2,3,5,6 個
 *
 *  D. かな入力の検査
 *     ・答えがカタカナ（＋長音）だけ
 *     ・2〜8文字
 *     ・★五十音表から実際に押せる文字だけ★（kanaKeysOf が見る）
 *       押せない文字が混ざると両者0点確定の問題になる
 *
 *  E. ★根拠の照合（これが中核）★
 *     ・正解の文字列が、元の大問の本文／解説／小問の正解のどこかに
 *       実在するかを見る。実在しなければ grounding 欄が要る。
 *     ・grounding を書いた場合は、その文字列自体が元データに
 *       ★一字一句★ 実在するかを照合する。
 *     → 「元データを読まずに、それらしい問題を作った」のをここで止める。
 *
 *  F. 画面に載るかの検査
 *     ・prompt が150文字以内
 *     ・prompt に「上の文章」「次の図」など画面に無いものへの参照が無い
 *     ・timeLimit が 8〜30
 *     ・oneLine が 10〜120 文字
 *
 * -------------------------------------------------------------------
 * ■ 警告（warn）と失敗（error）を分けている
 * -------------------------------------------------------------------
 * 落とすべきものだけを落とす。「たぶん怪しい」ものは warn にして、
 * 書いた側が判断できるようにする。warn があってもビルドは通る。
 */

import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { resolve, dirname, join, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

import { SUBJECTS, getChaptersOfSubject } from '../src/data/allChapters';
import { normalizeAnswer } from '../src/utils/answerJudge';
import { kanaKeysOf } from '../src/battle/core/kanaKeyboard';
import type { AuthoredFile, AuthoredQuestion } from '../src/battle/core/authoredTypes';

const HERE = dirname(fileURLToPath(import.meta.url));
const AUTHORED_DIR = resolve(HERE, '../src/battle/data/authored');

// ============================================================
// 元データの索引を作る
// ============================================================

interface SqInfo {
  subject: string;
  chapterId: string;
  problemId: string;
  sqId: string;
  type: string;
  label: string;
  correctAnswer: string;
  acceptedAnswers: string[];
  options: string[];
  /** 大問の本文 */
  problemText: string;
  /** 大問の解説（構造化JSONの場合もあるので文字列化して持つ） */
  explanation: string;
}

/** `chapterId/problemId/sqId` → 情報 */
const INDEX = new Map<string, SqInfo>();
/** `chapterId/problemId` → その大問の全文（本文＋解説＋全小問の正解） */
const PROBLEM_TEXT = new Map<string, string>();
/** chapterId → 章が存在するか */
const CHAPTERS = new Map<string, { subject: string; abstractTitle: string; realTitle: string }>();

function asText(v: unknown): string {
  if (v == null) return '';
  if (typeof v === 'string') return v;
  try {
    return JSON.stringify(v);
  } catch {
    return String(v);
  }
}

function buildIndex(): void {
  for (const subject of SUBJECTS) {
    for (const chapter of getChaptersOfSubject(subject.id) as any[]) {
      const ch = chapter as any;
      CHAPTERS.set(ch.id, {
        subject: subject.id,
        abstractTitle: ch.abstractTitle || '',
        realTitle: ch.realTitle || '',
      });
      const problems = [...(ch.miniTest || []), ...(ch.practiceProblems || [])];
      for (const p of problems) {
        const pKey = `${ch.id}/${p.id}`;
        const explanation = asText(p.explanation) + asText(p.explanationSupplement);
        const answers = (p.subQuestions || [])
          .map((s: any) => `${asText(s.correctAnswer)} ${asText(s.acceptedAnswers)}`)
          .join(' ');
        // 大問の全文。根拠照合はこの文字列に対して行う。
        const full = [asText(p.text), explanation, answers, asText(p.imageCaption)].join('\n');
        // miniTest と practiceProblems に同じ大問が入ることがあるので上書きせず結合
        PROBLEM_TEXT.set(pKey, (PROBLEM_TEXT.get(pKey) || '') + '\n' + full);

        for (const sq of p.subQuestions || []) {
          const key = `${ch.id}/${p.id}/${sq.id}`;
          if (INDEX.has(key)) continue;
          INDEX.set(key, {
            subject: subject.id,
            chapterId: ch.id,
            problemId: p.id,
            sqId: sq.id,
            type: sq.type || '',
            label: String(sq.label || ''),
            correctAnswer: String(sq.correctAnswer ?? ''),
            acceptedAnswers: (sq.acceptedAnswers || []).map((a: any) => String(a)),
            options: (sq.options || []).map((o: any) => String(o)),
            problemText: asText(p.text),
            explanation,
          });
        }
      }
    }
  }
}

// ============================================================
// 検証
// ============================================================

interface Issue {
  file: string;
  id: string;
  level: 'error' | 'warn';
  message: string;
}

const MIN_OPTIONS = 2;
const MAX_OPTIONS = 6;
const KANA_MIN_CHARS = 2;
const KANA_MAX_CHARS = 8;
const PROMPT_MAX_CHARS = 150;
const ONELINE_MIN = 10;
const ONELINE_MAX = 120;
const TIME_MIN = 8;
const TIME_MAX = 30;

/**
 * 画面に無いものを指す言い回し。
 * 対戦は1問1画面なので「上の文章」は存在しない。
 */
const DANGLING_REFS = [
  '上の文章',
  '上の文',
  '次の文章中',
  '前問',
  '上記の',
  '上図',
  '下図',
  '次の図',
  '右の図',
  '左の図',
  '上の表',
  '次の表',
  '本文中',
  '文章中の',
];

/** 照合用にゆるく正規化する（空白・全半角・記号のゆれを吸収） */
function loose(s: string): string {
  return normalizeAnswer(s)
    .replace(/[\s　]/g, '')
    .replace(/[・，,、。．.]/g, '')
    .toLowerCase();
}

function validateQuestion(
  q: AuthoredQuestion,
  file: string,
  fileSubject: string,
  fileChapterId: string,
  seenIds: Set<string>,
  issues: Issue[],
): void {
  const push = (level: 'error' | 'warn', message: string): void => {
    issues.push({ file, id: q.id || '(id無し)', level, message });
  };

  // ---- A. 形 ----
  if (!q.id || typeof q.id !== 'string') return push('error', 'id が無い');
  if (!q.id.startsWith('a:')) push('error', `id は "a:" で始めること（今: ${q.id}）`);
  if (seenIds.has(q.id)) push('error', 'id が重複している');
  seenIds.add(q.id);

  if (!q.source || !q.source.chapterId || !q.source.problemId || !q.source.subQuestionId) {
    return push('error', 'source（chapterId / problemId / subQuestionId）が足りない');
  }
  const { chapterId, problemId, subQuestionId } = q.source;

  if (chapterId !== fileChapterId) {
    push('error', `source.chapterId (${chapterId}) がファイルの chapterId (${fileChapterId}) と違う`);
  }

  const expectPrefix = `a:${chapterId}:${problemId}:${subQuestionId}:`;
  if (!q.id.startsWith(expectPrefix)) {
    push('error', `id は "${expectPrefix}<連番>" の形にすること（今: ${q.id}）`);
  }

  // ---- B. 元データに実在するか ----
  const key = `${chapterId}/${problemId}/${subQuestionId}`;
  const src = INDEX.get(key);
  if (!src) {
    return push(
      'error',
      `元データに存在しない小問を指している: ${key}` +
        '（存在しない小問を指す＝元データを読まずに書いた問題である）',
    );
  }
  if (src.subject !== fileSubject) {
    push('error', `source の教科 (${src.subject}) がファイルの教科 (${fileSubject}) と違う`);
  }

  // ---- F. 画面に載るか ----
  const prompt = String(q.prompt ?? '');
  const label = String(q.label ?? '');
  if (prompt.length === 0 && label.length === 0) {
    push('error', 'prompt と label が両方とも空（画面に何も出ない）');
  }
  if (prompt.length > PROMPT_MAX_CHARS) {
    push('error', `prompt が長すぎる（${prompt.length}文字 / 上限${PROMPT_MAX_CHARS}）`);
  }
  for (const ref of DANGLING_REFS) {
    if (prompt.includes(ref) || label.includes(ref)) {
      push(
        'error',
        `「${ref}」は対戦画面に存在しないものを指している。` +
          '必要な情報は prompt の中に書き切ること',
      );
      break;
    }
  }
  const t = Number(q.timeLimit);
  if (!Number.isFinite(t) || t < TIME_MIN || t > TIME_MAX) {
    push('error', `timeLimit は ${TIME_MIN}〜${TIME_MAX} の整数（今: ${q.timeLimit}）`);
  }
  const oneLine = String(q.oneLine ?? '');
  if (oneLine.length < ONELINE_MIN || oneLine.length > ONELINE_MAX) {
    push(
      'error',
      `oneLine は ${ONELINE_MIN}〜${ONELINE_MAX}文字（今: ${oneLine.length}文字）。` +
        '試合後に「答え＋ひと言の理由」を出すための欄',
    );
  }

  // ---- 正解の文字列を決める（あとで根拠照合に使う） ----
  let correctText = '';

  if (q.format === 'choice4' || q.format === 'choice') {
    // ---- C. 選択式 ----
    const options = q.options || [];
    if (options.length < MIN_OPTIONS || options.length > MAX_OPTIONS) {
      return push('error', `選択肢は ${MIN_OPTIONS}〜${MAX_OPTIONS}個（今: ${options.length}個）`);
    }
    if (q.format === 'choice4' && options.length !== 4) {
      push('error', `format が choice4 なら選択肢はちょうど4個（今: ${options.length}個）`);
    }
    if (q.format === 'choice' && options.length === 4) {
      push('error', '選択肢が4個なら format は choice4 にすること');
    }

    const corrects = options.filter((o) => o && o.correct === true);
    if (corrects.length !== 1) {
      return push('error', `correct: true はちょうど1つ（今: ${corrects.length}個）`);
    }
    correctText = String(corrects[0].text ?? '');

    const norms: string[] = [];
    for (const [i, o] of options.entries()) {
      const text = String(o?.text ?? '').trim();
      if (!text) {
        push('error', `選択肢[${i}] の text が空`);
        continue;
      }
      if (!o.why || String(o.why).trim().length < 4) {
        push(
          'error',
          `選択肢[${i}]「${text}」に why が無い。` +
            'なぜこれが正解／誤りかを書けない選択肢は、根拠なく置かれた誤答である',
        );
      }
      norms.push(loose(text));
    }
    // 重複
    if (new Set(norms).size !== norms.length) {
      push('error', '選択肢が重複している（正解が2つある状態になる）');
    }
    // 包含関係
    for (let i = 0; i < norms.length; i += 1) {
      for (let j = i + 1; j < norms.length; j += 1) {
        const a = norms[i];
        const b = norms[j];
        if (!a || !b) continue;
        if (a.includes(b) || b.includes(a)) {
          push(
            'error',
            `選択肢「${options[i].text}」と「${options[j].text}」が包含関係にある。` +
              'どちらも正しく見えるので、片方を別の語に差し替えること',
          );
        }
      }
    }
  } else if (q.format === 'kana') {
    // ---- D. かな入力 ----
    const answer = String(q.answer ?? '').trim();
    correctText = answer;
    if (!answer) return push('error', 'kana なのに answer が無い');
    if (!/^[ァ-ヶー]+$/.test(answer)) {
      return push(
        'error',
        `kana の答えはカタカナ（＋長音）だけ（今: "${answer}"）。` +
          '漢字・ひらがな・数字は表記ゆれで「正しく答えたのに不正解」が起きる',
      );
    }
    const chars = Array.from(answer);
    if (chars.length < KANA_MIN_CHARS || chars.length > KANA_MAX_CHARS) {
      push('error', `kana の答えは ${KANA_MIN_CHARS}〜${KANA_MAX_CHARS}文字（今: ${chars.length}文字）`);
    }
    if (!kanaKeysOf(answer)) {
      push(
        'error',
        `"${answer}" に五十音表から押せない文字が含まれている（両者0点確定の問題になる）`,
      );
    }
    if (q.options && q.options.length > 0) {
      push('error', 'kana に options は書かない');
    }
    if (!q.answerWhy || String(q.answerWhy).trim().length < 4) {
      push('error', 'kana には answerWhy（なぜそれが答えか）が要る');
    }
  } else {
    return push('error', `format が不正: ${String(q.format)}（choice4 / choice / kana のいずれか）`);
  }

  // ---- E. ★根拠の照合★ ----
  const haystack = loose(PROBLEM_TEXT.get(`${chapterId}/${problemId}`) || '');
  const needle = loose(correctText);
  const grounded = needle.length > 0 && haystack.includes(needle);

  if (!grounded) {
    const g = String(q.grounding ?? '').trim();
    if (!g) {
      push(
        'error',
        `正解「${correctText}」が元の大問（${problemId}）の本文・解説・解答のどこにも見つからない。` +
          '元データに無い内容を作った可能性がある。' +
          '正しいなら grounding 欄に、元データから一字一句そのまま根拠を引用すること',
      );
    } else if (!haystack.includes(loose(g))) {
      push(
        'error',
        `grounding「${g.slice(0, 40)}…」が元の大問（${problemId}）に見つからない。` +
          '一字一句そのまま引用すること（要約・言い換えは不可）',
      );
    }
  }

  // ---- 参考: 元の小問の正解と食い違っていないか（warn） ----
  if (correctText && src.correctAnswer) {
    const same =
      loose(correctText) === loose(src.correctAnswer) ||
      src.acceptedAnswers.some((a) => loose(a) === loose(correctText));
    const contains = loose(src.correctAnswer).includes(loose(correctText));
    if (!same && !contains && grounded) {
      issues.push({
        file,
        id: q.id,
        level: 'warn',
        message:
          `元の小問の正解は「${src.correctAnswer}」だが、この問題の正解は「${correctText}」。` +
          '大問を割った結果として正しいならよいが、聞いている内容がずれていないか確認すること',
      });
    }
  }
}

// ============================================================
// 未出題の小問を一覧する（--survey）
// ============================================================

/**
 * 生成器の isAnswerable() 相当。
 * 選択肢が揃っていても「画面から何を答えるか読み取れない」設問は
 * 生成器が捨てている（化学基礎で107件）。ここで同じ判定をしないと
 * 「もう出ている」と誤認して作業対象を取りこぼす。
 */
function bareLabel(label: string): string {
  return label
    .replace(/^問\s*\d+\s*/, '')
    .replace(/^[（(]\s*[ア-ンA-Za-z0-9]{1,3}\s*[)）]\s*/, '')
    .replace(/^[①-⑩]\s*/, '')
    .trim();
}

function extractBlankKey(label: string): string | null {
  const m = label.match(/[（(]\s*([ア-ンA-Za-z])\s*[)）]/);
  if (m) return m[1];
  const bare = label.replace(/^問\s*\d+\s*/, '').trim();
  if (/^[ア-ン]$/.test(bare)) return bare;
  return null;
}

function readableOnScreen(sq: any, problemText: string): boolean {
  const label = String(sq.label || '');
  const key = extractBlankKey(label);
  if (key) {
    const esc = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    if (new RegExp(`[（(]\\s*${esc}\\s*[)）]`).test(problemText)) return true;
  }
  return bareLabel(label).length >= 6; // 生成器の SELF_CONTAINED_MIN_CHARS
}

function survey(subjectFilter: string): void {
  const reasons: Record<string, number> = {};
  const rows: string[] = [];
  const byChapter = new Map<string, { total: number; done: number }>();

  for (const subject of SUBJECTS) {
    if (subjectFilter && subject.id !== subjectFilter) continue;
    for (const chapter of getChaptersOfSubject(subject.id) as any[]) {
      const ch = chapter as any;
      const seen = new Set<string>();
      let total = 0;
      let done = 0;
      for (const p of [...(ch.miniTest || []), ...(ch.practiceProblems || [])]) {
        for (const sq of p.subQuestions || []) {
          const key = `${ch.id}/${p.id}/${sq.id}`;
          if (seen.has(key)) continue;
          seen.add(key);
          total += 1;
          const type = sq.type || '(none)';
          const ans = String(sq.correctAnswer ?? '').trim();
          const opts = (sq.options || []).map((o: any) => String(o).trim()).filter(Boolean);

          let reason = '';
          if (type === 'multiple_choice') {
            if (opts.length < 2 || opts.length > 6) reason = `選択肢数が範囲外(${opts.length})`;
            else if (!opts.some((o: string) => normalizeAnswer(o) === normalizeAnswer(ans)))
              reason = '正解が選択肢に一致しない（複数選択など）';
            else if (!readableOnScreen(sq, String(p.text || '')))
              reason = '画面から何を答えるか読み取れない（記号だけの設問）';
          } else if (type === 'short_answer') {
            if (!/^[ァ-ヶー]+$/.test(ans)) reason = 'カタカナでない答え（漢字・数値・式）';
            else if (Array.from(ans).length < 2 || Array.from(ans).length > 8)
              reason = `カタカナだが文字数が範囲外(${Array.from(ans).length})`;
            else if (!readableOnScreen(sq, String(p.text || '')))
              reason = '画面から何を答えるか読み取れない（記号だけの設問）';
          } else {
            reason = `${type}（生成器が見ない）`;
          }
          if (reason) {
            reasons[reason] = (reasons[reason] || 0) + 1;
            rows.push(`${key}\t${type}\t${reason}\t${String(sq.label || '').slice(0, 40)}\t${ans.slice(0, 30)}`);
          } else {
            done += 1;
          }
        }
      }
      byChapter.set(ch.id, { total, done });
    }
  }

  console.log(`\n=== ${subjectFilter || '全教科'}：機械生成では対戦に出せない小問 ===\n`);
  for (const [k, v] of Object.entries(reasons).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${String(v).padStart(4)}  ${k}`);
  }
  console.log(`\n  合計 ${rows.length} 件が手書きの対象\n`);
  console.log('=== 章別（機械生成で出せる見込み / 総小問） ===');
  for (const [ch, v] of byChapter) {
    const info = CHAPTERS.get(ch);
    console.log(
      `  ${ch.padEnd(8)} ${String(v.done).padStart(3)} / ${String(v.total).padStart(4)}   ${info?.realTitle || ''} ${info?.abstractTitle || ''}`,
    );
  }
}

// ============================================================
// 実行
// ============================================================

function main(): void {
  const args = process.argv.slice(2);
  const isSurvey = args.includes('--survey');
  const fileFlag = args.indexOf('--file');
  const bare = args.filter((a) => !a.startsWith('-'));
  // --file の直後の引数は「教科名」ではなくパスなので、教科の絞り込みから外す
  const explicitFile = fileFlag >= 0 ? args[fileFlag + 1] : '';
  const subjectFilter = bare.find((a) => a !== explicitFile) || '';

  buildIndex();

  if (isSurvey) {
    survey(subjectFilter);
    return;
  }

  // ★--file が付いていたら、そのファイル1つだけを見る★
  // 見本（docs/battle-authoring/ に置く）は authored/ の中に入れない。
  // 見本を authored/ に常駐させると、作業場が同じ章を本気で書いたときに
  // 必ず id が重複して、正しい作業が弾かれてしまうため。
  let baseDir = AUTHORED_DIR;
  let files: string[];

  if (explicitFile) {
    const abs = resolve(process.cwd(), explicitFile);
    if (!existsSync(abs)) {
      console.error(`ファイルが無い: ${explicitFile}`);
      process.exit(1);
    }
    baseDir = dirname(abs);
    files = [basename(abs)];
  } else {
    if (!existsSync(AUTHORED_DIR)) {
      console.log('authored ディレクトリが無い（まだ手書き問題は1つも無い）');
      return;
    }
    files = readdirSync(AUTHORED_DIR)
      .filter((f) => f.endsWith('.json'))
      .sort();

    if (files.length === 0) {
      console.log('手書き問題のファイルがまだ1つも無い。');
      console.log('作り方は docs/battle-authoring/ を参照。');
      return;
    }
  }

  const issues: Issue[] = [];
  const seenIds = new Set<string>();
  let totalQuestions = 0;
  const perSubject: Record<string, number> = {};
  const coveredSq = new Set<string>();

  for (const f of files) {
    const path = join(baseDir, f);
    let data: AuthoredFile;
    try {
      data = JSON.parse(readFileSync(path, 'utf8')) as AuthoredFile;
    } catch (e) {
      issues.push({ file: f, id: '-', level: 'error', message: `JSON として読めない: ${String(e)}` });
      continue;
    }
    if (!data.subject || !data.chapterId || !Array.isArray(data.questions)) {
      issues.push({
        file: f,
        id: '-',
        level: 'error',
        message: 'subject / chapterId / questions が要る',
      });
      continue;
    }
    if (!CHAPTERS.has(data.chapterId)) {
      issues.push({
        file: f,
        id: '-',
        level: 'error',
        message: `存在しない章: ${data.chapterId}`,
      });
      continue;
    }
    for (const q of data.questions) {
      totalQuestions += 1;
      perSubject[data.subject] = (perSubject[data.subject] || 0) + 1;
      if (q?.source) {
        coveredSq.add(`${q.source.chapterId}/${q.source.problemId}/${q.source.subQuestionId}`);
      }
      validateQuestion(q, f, data.subject, data.chapterId, seenIds, issues);
    }
  }

  const errors = issues.filter((i) => i.level === 'error');
  const warns = issues.filter((i) => i.level === 'warn');

  console.log(`\n=== 手書き対戦問題の検証 ===`);
  console.log(`  ファイル ${files.length} 件 / 問題 ${totalQuestions} 問`);
  console.log(`  元の小問 ${coveredSq.size} 件をカバー`);
  for (const [s, n] of Object.entries(perSubject)) console.log(`    ${s.padEnd(20)} ${n}問`);

  if (warns.length > 0) {
    console.log(`\n--- 警告 ${warns.length} 件（ビルドは通る） ---`);
    for (const w of warns.slice(0, 40)) console.log(`  [${w.file}] ${w.id}\n     ${w.message}`);
    if (warns.length > 40) console.log(`  … ほか ${warns.length - 40} 件`);
  }

  if (errors.length > 0) {
    console.log(`\n--- ★エラー ${errors.length} 件★ ---`);
    for (const e of errors.slice(0, 80)) console.log(`  [${e.file}] ${e.id}\n     ${e.message}`);
    if (errors.length > 80) console.log(`  … ほか ${errors.length - 80} 件`);
    console.log(`\n★${errors.length} 件のエラーがある。直すまで取り込めない。★\n`);
    process.exit(1);
  }

  console.log(`\n★エラー0件。取り込める。★\n`);
}

main();
