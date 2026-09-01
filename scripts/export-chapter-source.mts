/**
 * ===================================================================
 * 1章ぶんの元データを、別の作業場が読める形で書き出す
 * ===================================================================
 *
 * 使い方:
 *   npx tsx scripts/export-chapter-source.mts chemistry_basic c1_1
 *   npx tsx scripts/export-chapter-source.mts chemistry_basic --all
 *
 * 出力先: build/chapter-source/<subject>/<chapterId>.md
 *
 * -------------------------------------------------------------------
 * ■ なぜ書き出すのか
 * -------------------------------------------------------------------
 * 別の作業場の AI に「元データを全部読んでから問題を作れ」と言うとき、
 * 読ませる対象が `src/data/chemProblemsC1.ts`（148KB）のような
 * 巨大な TypeScript ファイルだと、次の問題が起きる。
 *
 *   ・1章ぶんを読むために無関係な章まで読むことになる
 *   ・解説が構造化JSONで埋まっていて、地の文として読みにくい
 *   ・「この小問はどの大問に属するか」がネストで分かりにくい
 *
 * そこで ★章単位・人が読める Markdown★ に落とす。
 * 中身は元データそのままで、要約も省略もしない
 * （要約すると「読まずに書いた」問題が生まれる元になる）。
 *
 * -------------------------------------------------------------------
 * ■ 「対戦に出ているか」を各小問に印字する
 * -------------------------------------------------------------------
 * 作業の目的は「まだ対戦に出ていない小問を出せるようにする」ことなので、
 * どれが済んでいてどれが残っているかが見えないと作業が始まらない。
 * 各小問の見出しに [対戦済] / [★要作成] を付ける。
 */

import { writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { SUBJECTS, getChaptersOfSubject } from '../src/data/allChapters';
import { normalizeAnswer } from '../src/utils/answerJudge';

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT_ROOT = resolve(HERE, '../build/chapter-source');

function asText(v: unknown): string {
  if (v == null) return '';
  if (typeof v === 'string') return v;
  return JSON.stringify(v, null, 2);
}

/**
 * 構造化された解説（logic_thought 形式のJSON）を地の文に開く。
 *
 * 元データの explanation は
 *   {"type":"logic_thought","phase1":{"title":…,"overview":…,"steps":[…]},…}
 * のような形をしていることがある。JSON のまま出すと読みづらいので、
 * ★中身は1文字も落とさずに★ 見出しと本文に開く。
 */
function renderExplanation(v: unknown, depth = 0): string {
  const pad = '  '.repeat(depth);
  if (v == null) return '';
  if (typeof v === 'string') return v.trim() ? `${pad}${v}` : '';
  if (typeof v === 'number' || typeof v === 'boolean') return `${pad}${String(v)}`;
  if (Array.isArray(v)) {
    return v
      .map((item) => renderExplanation(item, depth))
      .filter(Boolean)
      .join('\n');
  }
  if (typeof v === 'object') {
    const out: string[] = [];
    for (const [k, val] of Object.entries(v as Record<string, unknown>)) {
      if (val == null || val === '') continue;
      const body = renderExplanation(val, depth + 1);
      if (!body.trim()) continue;
      // title / text のような単一行はキー名を添えて1行に
      if (typeof val === 'string' && !val.includes('\n')) {
        out.push(`${pad}- **${k}**: ${val}`);
      } else {
        out.push(`${pad}- **${k}**:`);
        out.push(body);
      }
    }
    return out.join('\n');
  }
  return '';
}

/**
 * その小問が機械生成で対戦に出せているか（gen-battle-pool の判定を再現）。
 *
 * ★選択肢が揃っているだけでは足りない★
 * 生成器は最後に isAnswerable() で「画面を見て何を答えるか分かるか」を見て、
 * 分からない設問を捨てている。化学基礎ではこれで107件が落ちている
 * （例: ラベルが「(1) 空気」だけで、選択肢が「(イ)/(ウ)/(エ)」という記号の設問）。
 * ここで同じ判定をしないと「対戦済」と嘘の印を付けてしまい、
 * 作業対象を取りこぼす。
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

/** 生成器の isAnswerable() 相当。画面から何を答えるか読み取れるか */
function readableOnScreen(sq: any, problemText: string): boolean {
  const label = String(sq.label || '');
  const key = extractBlankKey(label);
  if (key) {
    const esc = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    if (new RegExp(`[（(]\\s*${esc}\\s*[)）]`).test(problemText)) return true;
  }
  // 生成器の SELF_CONTAINED_MIN_CHARS = 6
  return bareLabel(label).length >= 6;
}

function battleStatus(sq: any, problemText: string): { ok: boolean; note: string } {
  const type = sq.type || '(none)';
  const ans = String(sq.correctAnswer ?? '').trim();
  const opts = (sq.options || []).map((o: any) => String(o).trim()).filter(Boolean);

  if (type === 'multiple_choice') {
    if (opts.length < 2 || opts.length > 6) return { ok: false, note: `選択肢数が範囲外(${opts.length})` };
    if (!opts.some((o: string) => normalizeAnswer(o) === normalizeAnswer(ans)))
      return { ok: false, note: '正解が選択肢に一致しない（複数選択など）' };
    if (!readableOnScreen(sq, problemText))
      return { ok: false, note: '画面から何を答えるか読み取れない（記号だけの設問）' };
    return { ok: true, note: '' };
  }
  if (type === 'short_answer') {
    if (!/^[ァ-ヶー]+$/.test(ans)) return { ok: false, note: 'カタカナでない答え' };
    const n = Array.from(ans).length;
    if (n < 2 || n > 8) return { ok: false, note: `カタカナだが文字数が範囲外(${n})` };
    if (!readableOnScreen(sq, problemText))
      return { ok: false, note: '画面から何を答えるか読み取れない（記号だけの設問）' };
    return { ok: true, note: '' };
  }
  return { ok: false, note: `${type}（生成器が見ない）` };
}

function exportChapter(subjectId: string, ch: any): string {
  const lines: string[] = [];
  const problems = [...(ch.miniTest || []), ...(ch.practiceProblems || [])];
  const seen = new Set<string>();

  lines.push(`# ${ch.realTitle || ''} ${ch.abstractTitle || ''}`);
  lines.push('');
  lines.push(`- 教科: \`${subjectId}\``);
  lines.push(`- 章ID: \`${ch.id}\``);
  if (ch.topics?.length) lines.push(`- トピック: ${ch.topics.join(' / ')}`);
  lines.push('');
  lines.push('> このファイルは `scripts/export-chapter-source.mts` が元データから');
  lines.push('> 自動生成したものです。**要約も省略もしていません。**');
  lines.push('> 手で編集しても意味がありません（次の生成で消えます）。');
  lines.push('');

  let total = 0;
  let done = 0;
  const todo: string[] = [];

  for (const p of problems) {
    const isMini = (ch.miniTest || []).includes(p);
    for (const sq of p.subQuestions || []) {
      const key = `${ch.id}/${p.id}/${sq.id}`;
      if (seen.has(key)) continue;
      total += 1;
      if (battleStatus(sq, String(p.text || '')).ok) done += 1;
      else todo.push(key);
    }
    // 走査は下でもう一度やるので seen はまだ埋めない
    void isMini;
  }
  seen.clear();

  lines.push('## この章の状況');
  lines.push('');
  lines.push(`| | 件数 |`);
  lines.push(`|---|---|`);
  lines.push(`| 大問 | ${problems.length} |`);
  lines.push(`| 小問（重複を除く） | ${total} |`);
  lines.push(`| うち機械生成で対戦に出せている | ${done} |`);
  lines.push(`| **★手で作る対象** | **${total - done}** |`);
  lines.push('');
  lines.push('---');
  lines.push('');

  for (const [pi, p] of problems.entries()) {
    const isMini = (ch.miniTest || []).indexOf(p) >= 0;
    lines.push(`## 大問 ${pi + 1}: \`${p.id}\`  ${isMini ? '（ミニテスト）' : '（演習問題）'}`);
    lines.push('');
    if (p.category) lines.push(`**分類**: ${p.category}`);
    lines.push('');
    lines.push('### 本文（リード文）');
    lines.push('');
    lines.push('```text');
    lines.push(String(p.text || '(本文なし)'));
    lines.push('```');
    lines.push('');
    if (p.imageUrl) {
      lines.push(`**図**: \`${p.imageUrl}\`${p.imageCaption ? ` — ${p.imageCaption}` : ''}`);
      lines.push('');
      lines.push('> ★図がある大問は注意★ 対戦画面にも図は出せるが、');
      lines.push('> 図を見ないと解けない問題は、図の中身を prompt の文章に');
      lines.push('> 書き起こせる場合だけ作ること。書き起こせないなら作らない。');
      lines.push('');
    }

    lines.push('### 小問');
    lines.push('');
    for (const sq of p.subQuestions || []) {
      const key = `${ch.id}/${p.id}/${sq.id}`;
      if (seen.has(key)) {
        continue;
      }
      seen.add(key);
      const st = battleStatus(sq, String(p.text || ''));
      const badge = st.ok ? '[対戦済]' : `[★要作成 — ${st.note}]`;
      lines.push(`#### ${badge} \`${sq.id}\``);
      lines.push('');
      lines.push(`- **設問文(label)**: ${String(sq.label ?? '(なし)')}`);
      lines.push(`- **種別(type)**: \`${sq.type || '(none)'}\``);
      lines.push(`- **正解(correctAnswer)**: \`${String(sq.correctAnswer ?? '')}\``);
      if (sq.acceptedAnswers?.length)
        lines.push(`- **別解(acceptedAnswers)**: ${sq.acceptedAnswers.map((a: any) => `\`${a}\``).join(' / ')}`);
      if (sq.options?.length)
        lines.push(`- **選択肢(options)**: ${sq.options.map((o: any) => `\`${o}\``).join(' / ')}`);
      if (sq.items) lines.push(`- **items**: \`${JSON.stringify(sq.items)}\``);
      if (sq.gradingCriteria) lines.push(`- **採点基準**: ${asText(sq.gradingCriteria)}`);
      if (sq.group) lines.push(`- **group**: ${sq.group}`);
      lines.push('');
      lines.push(`  → 手書き問題の \`source\`:`);
      lines.push('  ```json');
      lines.push(`  { "chapterId": "${ch.id}", "problemId": "${p.id}", "subQuestionId": "${sq.id}" }`);
      lines.push('  ```');
      lines.push('');
    }

    if (p.explanation) {
      lines.push('### 解説（この大問全体に付いている）');
      lines.push('');
      lines.push('> ★ここが一番の材料★ 誤答を作るときは、ここに書かれている');
      lines.push('> 「間違えやすい点」「区別のしかた」をそのまま誤答に使うこと。');
      lines.push('');
      const rendered = renderExplanation(p.explanation);
      lines.push(rendered || '```json\n' + asText(p.explanation) + '\n```');
      lines.push('');
    }
    if (p.explanationSupplement) {
      lines.push('### 解説の補足');
      lines.push('');
      lines.push(renderExplanation(p.explanationSupplement));
      lines.push('');
    }
    if (p.surroundingKnowledge) {
      lines.push('### 周辺知識');
      lines.push('');
      lines.push(renderExplanation(p.surroundingKnowledge));
      lines.push('');
    }
    if (p.deepDiveTopics) {
      lines.push('### 深掘り');
      lines.push('');
      lines.push(renderExplanation(p.deepDiveTopics));
      lines.push('');
    }
    lines.push('---');
    lines.push('');
  }

  lines.push('## 作成対象の小問一覧（コピー用）');
  lines.push('');
  lines.push('```');
  for (const t of todo) lines.push(t);
  lines.push('```');
  lines.push('');

  return lines.join('\n');
}

function main(): void {
  const args = process.argv.slice(2);
  const subjectId = args[0];
  const chapterArg = args[1];

  if (!subjectId) {
    console.log('使い方: npx tsx scripts/export-chapter-source.mts <subject> <chapterId|--all>');
    console.log('教科:', SUBJECTS.map((s) => s.id).join(', '));
    process.exit(1);
  }
  if (!SUBJECTS.some((s) => s.id === subjectId)) {
    console.error(`知らない教科: ${subjectId}`);
    console.log('教科:', SUBJECTS.map((s) => s.id).join(', '));
    process.exit(1);
  }

  const chapters = getChaptersOfSubject(subjectId) as any[];
  const targets = chapterArg === '--all' || !chapterArg ? chapters : chapters.filter((c) => c.id === chapterArg);

  if (targets.length === 0) {
    console.error(`章が見つからない: ${chapterArg}`);
    console.log('章:', chapters.map((c) => c.id).join(', '));
    process.exit(1);
  }

  const dir = join(OUT_ROOT, subjectId);
  mkdirSync(dir, { recursive: true });

  let bytes = 0;
  for (const ch of targets) {
    const md = exportChapter(subjectId, ch);
    const path = join(dir, `${ch.id}.md`);
    writeFileSync(path, md, 'utf8');
    bytes += Buffer.byteLength(md);
    console.log(`  ${path}  (${(Buffer.byteLength(md) / 1024).toFixed(1)} KB)`);
  }
  console.log(`\n${targets.length} 章 / 合計 ${(bytes / 1024).toFixed(1)} KB を書き出した。`);
}

main();
