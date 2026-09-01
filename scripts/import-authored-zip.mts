/**
 * ===================================================================
 * 別の作業場が作った ZIP を取り込む
 * ===================================================================
 *
 * 使い方:
 *   npx tsx scripts/import-authored-zip.mts <zipファイル> [--dry-run]
 *
 * -------------------------------------------------------------------
 * ■ ★なぜ ZIP なのか（PR にしない理由）★
 * -------------------------------------------------------------------
 * 教科ごとに別の作業場（別ルーム）で同時に作業する。
 * それぞれの作業場が PR を出すと、次のことが起きる。
 *
 *   ・同じファイル（例: src/battle/data/battlePool.ts）を
 *     複数の作業場が同時に書き換える
 *   ・後からマージした PR が、先にマージした PR の変更を
 *     ★上書きして消す★
 *   ・生成ファイル（pool.*.generated.ts）は行数が数百あるので、
 *     コンフリクトが起きても人間には正しい解決が判断できない
 *
 * そこで作業場には ★JSON を ZIP で出すだけ★ をさせる。
 * 取り込みと生成ファイルの再生成は、本体（このリポジトリ）が1か所で行う。
 * これなら上書きは起きない。
 *
 *   作業場A（化学基礎）  ─→ chemistry_basic.zip  ┐
 *   作業場B（生物基礎）  ─→ biology_basic.zip    ├─→ 本体で取り込み → 1つのPR
 *   作業場C（地理）      ─→ geography.zip        ┘
 *
 * ★作業場は git を一切触らない。★ これが崩れないための条件である。
 *
 * -------------------------------------------------------------------
 * ■ 取り込みの流れ
 * -------------------------------------------------------------------
 *   1. ZIP を展開して、中の *.json を取り出す
 *   2. ★展開先を src/battle/data/authored/ の中に限定する★
 *      （ZIP の中に "../../etc/passwd" のような細工がされていても外に出さない）
 *   3. 取り込む前に検証をかけ、エラーがあれば ★1件も書かずに中止★
 *   4. 既存ファイルと衝突したら、どちらを残すか報告して中止
 *      （黙って上書きしない。上書きを防ぐのがこの仕組みの目的なので）
 *
 * -------------------------------------------------------------------
 * ■ unzip コマンドに頼らない
 * -------------------------------------------------------------------
 * ZIP の展開は Node だけで行う（外部コマンドの有無に左右されないため）。
 * ZIP の格納方式は stored(0) と deflate(8) の2つだけ扱う。
 * 実用上、JSON を固めた ZIP はこの2つ以外にならない。
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from 'node:fs';
import { resolve, dirname, join, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { inflateRawSync } from 'node:zlib';
import { execFileSync } from 'node:child_process';

const HERE = dirname(fileURLToPath(import.meta.url));
const AUTHORED_DIR = resolve(HERE, '../src/battle/data/authored');
const ROOT = resolve(HERE, '..');

// ============================================================
// ZIP の展開（Node の zlib だけで行う）
// ============================================================

interface ZipEntry {
  name: string;
  data: Buffer;
}

/**
 * ZIP を展開する。
 *
 * ★中央ディレクトリ（末尾）から読む★
 * ローカルヘッダだけを順に読む実装は、圧縮サイズが
 * データ記述子（末尾）に書かれている場合に長さが分からず壊れる。
 * 中央ディレクトリには必ず正しいサイズが入っているので、そちらを使う。
 */
function unzip(buf: Buffer): ZipEntry[] {
  // End of Central Directory を末尾から探す（コメントがあるので後ろから走査）
  const SIG_EOCD = 0x06054b50;
  let eocd = -1;
  for (let i = buf.length - 22; i >= 0 && i > buf.length - 22 - 65536; i -= 1) {
    if (buf.readUInt32LE(i) === SIG_EOCD) {
      eocd = i;
      break;
    }
  }
  if (eocd < 0) throw new Error('ZIP として読めない（End of Central Directory が無い）');

  const count = buf.readUInt16LE(eocd + 10);
  let ptr = buf.readUInt32LE(eocd + 16);

  const out: ZipEntry[] = [];
  const SIG_CEN = 0x02014b50;

  for (let n = 0; n < count; n += 1) {
    if (buf.readUInt32LE(ptr) !== SIG_CEN) throw new Error('ZIP の中央ディレクトリが壊れている');
    const method = buf.readUInt16LE(ptr + 10);
    const compSize = buf.readUInt32LE(ptr + 20);
    const nameLen = buf.readUInt16LE(ptr + 28);
    const extraLen = buf.readUInt16LE(ptr + 30);
    const commentLen = buf.readUInt16LE(ptr + 32);
    const localOffset = buf.readUInt32LE(ptr + 42);
    const name = buf.slice(ptr + 46, ptr + 46 + nameLen).toString('utf8');
    ptr += 46 + nameLen + extraLen + commentLen;

    // ディレクトリは飛ばす
    if (name.endsWith('/')) continue;

    // ローカルヘッダから実データの開始位置を求める
    const lhNameLen = buf.readUInt16LE(localOffset + 26);
    const lhExtraLen = buf.readUInt16LE(localOffset + 28);
    const start = localOffset + 30 + lhNameLen + lhExtraLen;
    const raw = buf.slice(start, start + compSize);

    let data: Buffer;
    if (method === 0) data = raw;
    else if (method === 8) data = inflateRawSync(raw);
    else throw new Error(`対応していない圧縮方式(${method}): ${name}`);

    out.push({ name, data });
  }
  return out;
}

// ============================================================
// 取り込み
// ============================================================

function main(): void {
  const args = process.argv.slice(2);
  const zipPath = args.find((a) => !a.startsWith('-'));
  const dryRun = args.includes('--dry-run');

  if (!zipPath) {
    console.log('使い方: npx tsx scripts/import-authored-zip.mts <zipファイル> [--dry-run]');
    process.exit(1);
  }
  if (!existsSync(zipPath)) {
    console.error(`ファイルが無い: ${zipPath}`);
    process.exit(1);
  }

  console.log(`ZIP: ${zipPath}`);
  const entries = unzip(readFileSync(zipPath));
  console.log(`  中身 ${entries.length} 件`);

  // ---- JSON だけを拾う ----
  const jsons = entries.filter((e) => e.name.toLowerCase().endsWith('.json'));
  const others = entries.filter((e) => !e.name.toLowerCase().endsWith('.json'));

  if (others.length > 0) {
    console.log(`\n  JSON 以外は取り込まない（${others.length}件）:`);
    for (const o of others.slice(0, 20)) console.log(`    - ${o.name}`);
    console.log('  ※ 指示書やメモは ZIP に入れてよいが、取り込まれるのは JSON だけである。');
  }

  if (jsons.length === 0) {
    console.error('\n★JSON が1つも無い。取り込むものがない。★');
    process.exit(1);
  }

  // ---- 展開先を決める（ディレクトリを潰して basename だけ使う） ----
  //
  // ★ここが安全の要★
  // ZIP の中の名前をそのままパスに使うと "../../" で外に書けてしまう。
  // ディレクトリ構造は使わず、ファイル名だけを取り出して
  // authored/ の直下に置く。これで外に出る経路が無くなる。
  const plan: { name: string; target: string; body: string }[] = [];
  const seenNames = new Set<string>();
  let bad = 0;

  for (const e of jsons) {
    // ★ZIP の中の名前に ".." が入っていたら、その時点で作りが怪しいので断る。
    //   basename() を通せば外には出ないが、
    //   「外に出そうとした ZIP をそのまま受け入れた」という記録が残らないのは良くない。
    if (e.name.split(/[/\\]/).includes('..')) {
      console.error(`  ★親ディレクトリを指す名前は受け付けない: ${e.name}`);
      bad += 1;
      continue;
    }
    const name = basename(e.name);
    if (!name || name.startsWith('.') || name.includes('/') || name.includes('\\')) {
      console.error(`  ★不正なファイル名なので飛ばす: ${e.name}`);
      bad += 1;
      continue;
    }
    if (seenNames.has(name)) {
      console.error(`  ★ZIP の中に同じ名前のファイルが2つある: ${name}`);
      bad += 1;
      continue;
    }
    seenNames.add(name);

    const body = e.data.toString('utf8');
    try {
      JSON.parse(body);
    } catch (err) {
      console.error(`  ★JSON として読めない: ${name}\n     ${String(err)}`);
      bad += 1;
      continue;
    }

    const target = join(AUTHORED_DIR, name);
    if (!target.startsWith(AUTHORED_DIR)) {
      console.error(`  ★展開先が authored/ の外に出る: ${e.name}`);
      bad += 1;
      continue;
    }
    plan.push({ name, target, body });
  }

  if (bad > 0) {
    console.error(`\n★${bad} 件の問題があるので、1件も書かずに中止する。★`);
    process.exit(1);
  }

  // ---- 既存ファイルとの衝突を見る ----
  //
  // ★黙って上書きしない★
  // この仕組みの目的は「上書きを起こさないこと」なので、
  // 取り込みの側で上書きしたら意味がない。
  mkdirSync(AUTHORED_DIR, { recursive: true });
  const existing = new Set(readdirSync(AUTHORED_DIR).filter((f) => f.endsWith('.json')));
  const collisions = plan.filter((p) => existing.has(p.name));

  if (collisions.length > 0) {
    console.log(`\n--- 既にあるファイルと同じ名前（${collisions.length}件） ---`);
    for (const c of collisions) {
      const old = readFileSync(c.target, 'utf8');
      const same = old === c.body;
      console.log(`  ${c.name}  ${same ? '（中身も同一 → 何もしない）' : '★中身が違う★'}`);
    }
    const changed = collisions.filter((c) => readFileSync(c.target, 'utf8') !== c.body);
    if (changed.length > 0) {
      console.error(
        '\n★中身の違う同名ファイルがある。上書きすると前の作業が消えるので中止する。★\n' +
          '  作業場に「ファイル名に章IDを入れる」よう指示すること。\n' +
          '  例: chemistry_basic.c1_1.json / chemistry_basic.c1_2_A.json\n' +
          '  意図して差し替えるなら、先に既存ファイルを手で消してから再実行する。',
      );
      process.exit(1);
    }
  }

  // ---- 書き込み ----
  const toWrite = plan.filter((p) => !existing.has(p.name));
  console.log(`\n--- 取り込む ${toWrite.length} 件 ---`);
  for (const p of toWrite) console.log(`  + ${p.name}  (${(p.body.length / 1024).toFixed(1)} KB)`);

  if (dryRun) {
    console.log('\n--dry-run なので書き込まない。');
    return;
  }
  if (toWrite.length === 0) {
    console.log('  新しく取り込むものは無い。');
    return;
  }

  for (const p of toWrite) writeFileSync(p.target, p.body, 'utf8');

  // ---- 検証（ここで落ちたら書いたものを消す） ----
  //
  // ★検証を通らないものを残さない★
  // 残すと、次に誰かが生成をかけたときに壊れた問題が対戦に出てしまう。
  console.log('\n--- 検証 ---');
  try {
    const out = execFileSync('npx', ['tsx', 'scripts/verify-authored-battle.mts'], {
      cwd: ROOT,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    console.log(out);
  } catch (err: any) {
    console.log(err.stdout || '');
    console.log(err.stderr || '');
    // 書いたものを取り消す
    for (const p of toWrite) {
      try {
        execFileSync('rm', ['-f', p.target]);
      } catch {
        /* 消せなくても続ける */
      }
    }
    console.error(
      '\n★検証で落ちたので、取り込んだファイルを取り消した。★\n' +
        '  上のエラーを作業場に渡して直させること。',
    );
    process.exit(1);
  }

  console.log('取り込み完了。次に生成をかける:');
  console.log('  npm run gen:battle-pool');
}

main();
