/**
 * ===================================================================
 * 作業場（別ルーム）が、書いた JSON を ZIP に固めるためのもの
 * ===================================================================
 *
 * 使い方（作業場で実行する）:
 *   npm run pack:authored -- chemistry_basic
 *   npm run pack:authored -- chemistry_basic.c1_1
 *   npm run pack:authored -- --all
 *
 *   → build/authored-zip/<名前>.zip ができる。
 *     このファイルだけを本体に渡す。
 *
 * -------------------------------------------------------------------
 * ■ ★作業場は git を触らない★
 * -------------------------------------------------------------------
 * commit も push も PR も作らない。
 * 教科ごとに別の作業場が同時に動くので、それぞれが PR を出すと
 * 後からマージしたものが先のものを上書きして消してしまう。
 * 生成ファイル（pool.*.generated.ts）は数百行あるので、
 * コンフリクトが出ても人間には正しい解決が判断できない。
 *
 * だから受け渡しは ★ZIP 1つだけ★ にする。
 * 取り込みと再生成は本体が1か所でまとめて行う。
 *
 * -------------------------------------------------------------------
 * ■ 固める前に必ず検証する
 * -------------------------------------------------------------------
 * 検証（verify-authored-battle.mts）が通らないものは ZIP にしない。
 * 通らないものを渡すと、本体側で取り込みが丸ごと中止になり、
 * 他の教科の取り込みまで止まってしまう。
 *
 * ※ --force を付ければ検証を飛ばせるが、
 *   それは「本体に直してもらう」ことを意味するので基本は使わない。
 *
 * -------------------------------------------------------------------
 * ■ zip コマンドに頼らない
 * -------------------------------------------------------------------
 * 作業場の環境に zip コマンドがあるとは限らないので、
 * Node の zlib だけで ZIP を書く（deflate + CRC32）。
 */

import { readdirSync, readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { deflateRawSync } from 'node:zlib';
import { execFileSync } from 'node:child_process';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, '..');
const AUTHORED_DIR = resolve(ROOT, 'src/battle/data/authored');
const OUT_DIR = resolve(ROOT, 'build/authored-zip');

// ============================================================
// CRC32（ZIP が要求するので自前で持つ）
// ============================================================

const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n += 1) {
    let c = n;
    for (let k = 0; k < 8; k += 1) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();

function crc32(buf: Buffer): number {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i += 1) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

// ============================================================
// ZIP を書く
// ============================================================

interface PackEntry {
  name: string;
  body: Buffer;
}

function buildZip(entries: PackEntry[]): Buffer {
  const locals: Buffer[] = [];
  const centrals: Buffer[] = [];
  let offset = 0;

  for (const e of entries) {
    const nameBuf = Buffer.from(e.name, 'utf8');
    const comp = deflateRawSync(e.body, { level: 9 });
    const crc = crc32(e.body);

    // ローカルファイルヘッダ
    const lh = Buffer.alloc(30);
    lh.writeUInt32LE(0x04034b50, 0); // 署名
    lh.writeUInt16LE(20, 4); // 展開に必要なバージョン
    lh.writeUInt16LE(0x0800, 6); // ★ビット11 = ファイル名は UTF-8★
    lh.writeUInt16LE(8, 8); // deflate
    lh.writeUInt16LE(0, 10); // 時刻（固定：中身が同じなら同じ ZIP になるように）
    lh.writeUInt16LE(0x0021, 12); // 日付（固定 1980-01-01 では不正なので最小の有効値）
    lh.writeUInt32LE(crc, 14);
    lh.writeUInt32LE(comp.length, 18);
    lh.writeUInt32LE(e.body.length, 22);
    lh.writeUInt16LE(nameBuf.length, 26);
    lh.writeUInt16LE(0, 28);

    locals.push(lh, nameBuf, comp);

    // 中央ディレクトリ
    const cd = Buffer.alloc(46);
    cd.writeUInt32LE(0x02014b50, 0);
    cd.writeUInt16LE(20, 4); // 作成バージョン
    cd.writeUInt16LE(20, 6); // 展開に必要なバージョン
    cd.writeUInt16LE(0x0800, 8);
    cd.writeUInt16LE(8, 10);
    cd.writeUInt16LE(0, 12);
    cd.writeUInt16LE(0x0021, 14);
    cd.writeUInt32LE(crc, 16);
    cd.writeUInt32LE(comp.length, 20);
    cd.writeUInt32LE(e.body.length, 24);
    cd.writeUInt16LE(nameBuf.length, 28);
    cd.writeUInt16LE(0, 30); // extra
    cd.writeUInt16LE(0, 32); // comment
    cd.writeUInt16LE(0, 34); // ディスク番号
    cd.writeUInt16LE(0, 36); // 内部属性
    cd.writeUInt32LE(0, 38); // 外部属性
    cd.writeUInt32LE(offset, 42);

    centrals.push(cd, nameBuf);
    offset += lh.length + nameBuf.length + comp.length;
  }

  const localBuf = Buffer.concat(locals);
  const centralBuf = Buffer.concat(centrals);

  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0);
  eocd.writeUInt16LE(0, 4);
  eocd.writeUInt16LE(0, 6);
  eocd.writeUInt16LE(entries.length, 8);
  eocd.writeUInt16LE(entries.length, 10);
  eocd.writeUInt32LE(centralBuf.length, 12);
  eocd.writeUInt32LE(localBuf.length, 16);
  eocd.writeUInt16LE(0, 20);

  return Buffer.concat([localBuf, centralBuf, eocd]);
}

// ============================================================
// 本体
// ============================================================

function main(): void {
  const args = process.argv.slice(2);
  const force = args.includes('--force');
  const all = args.includes('--all');
  const prefix = args.find((a) => !a.startsWith('-'));

  if (!prefix && !all) {
    console.log('使い方:');
    console.log('  npm run pack:authored -- chemistry_basic');
    console.log('  npm run pack:authored -- chemistry_basic.c1_1');
    console.log('  npm run pack:authored -- --all');
    process.exit(1);
  }

  if (!existsSync(AUTHORED_DIR)) {
    console.error(`まだ1つも書かれていない: ${AUTHORED_DIR}`);
    process.exit(1);
  }

  // ---- 対象を選ぶ ----
  //
  // ★example は入れない★
  // 見本は本体に既にあるので、渡すと「同名・中身違い」で
  // 取り込みが止まる原因になる。
  const files = readdirSync(AUTHORED_DIR)
    .filter((f) => f.endsWith('.json'))
    .filter((f) => !f.includes('.example.'))
    .filter((f) => (all ? true : f.startsWith(prefix!)))
    .sort();

  if (files.length === 0) {
    console.error(`対象のファイルが無い（prefix: ${prefix ?? '--all'}）`);
    console.error(`  ${AUTHORED_DIR} の中身:`);
    for (const f of readdirSync(AUTHORED_DIR)) console.error(`    ${f}`);
    process.exit(1);
  }

  // ---- 検証（通らないものは固めない） ----
  if (!force) {
    console.log('--- 検証 ---');
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
      console.error(
        '\n★検証が通らないので ZIP にしない。★\n' +
          '  上のエラーを1件も残さず直してから、もう一度実行すること。\n' +
          '  （どうしても本体に直してもらうなら --force を付ける。基本は使わない）',
      );
      process.exit(1);
    }
  }

  // ---- 固める ----
  const entries: PackEntry[] = files.map((f) => ({
    name: f,
    body: readFileSync(join(AUTHORED_DIR, f)),
  }));

  // 何が入っているかを ZIP 自身に書いておく（本体側の人が中身を開かずに分かるように）
  const manifest = [
    '# この ZIP の中身',
    '',
    `作成日時: ${new Date().toISOString()}`,
    `ファイル数: ${entries.length}`,
    '',
    ...entries.map((e) => {
      const j = JSON.parse(e.body.toString('utf8'));
      const n = Array.isArray(j.questions) ? j.questions.length : 0;
      return `- ${e.name}  subject=${j.subject} chapter=${j.chapterId} 問題数=${n}`;
    }),
    '',
    '取り込み方（本体側で実行する）:',
    '  npm run import:authored -- <このzip> --dry-run',
    '  npm run import:authored -- <このzip>',
    '  npm run gen:battle-pool',
    '',
  ].join('\n');
  entries.push({ name: 'MANIFEST.txt', body: Buffer.from(manifest, 'utf8') });

  mkdirSync(OUT_DIR, { recursive: true });
  const zipName = `${all ? 'authored-all' : prefix}.zip`;
  const zipPath = join(OUT_DIR, zipName);
  const zip = buildZip(entries);
  writeFileSync(zipPath, zip);

  console.log(`\n--- できた ---`);
  console.log(`  ${zipPath}  (${(zip.length / 1024).toFixed(1)} KB)`);
  for (const e of entries) console.log(`    - ${e.name}`);
  console.log('\nこの ZIP だけを本体に渡す。★git は触らない。★');
}

main();
