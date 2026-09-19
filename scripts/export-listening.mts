/** Create an independent listening edition; never edit integrated application files. */
import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync, existsSync, copyFileSync } from 'node:fs';
import { resolve, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import ts from 'typescript';
import { FEATURES } from '../src/config/features';
import { SUBJECT_INDEX, SUBJECT_STATS } from '../src/data/chapterIndex.generated';
import { BATTLE_RULES } from '../src/battle/core/battleRules';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const out = resolve(root, process.argv[2] || '.delivery/manatobi-listening');
if (!out.startsWith(root + '/.delivery/') || existsSync(out)) {
  throw new Error('Use a NEW directory under .delivery; an existing export is never overwritten.');
}
const sourceCommit = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim();
const tracked = execFileSync('git', ['ls-files', '-z'], { cwd: root, encoding: 'utf8' }).split('\0').filter(Boolean);
const top = new Set(['package.json', 'package-lock.json', 'tsconfig.json', 'vite.config.ts', 'index.html', 'metadata.json', 'vercel.json', 'firestore.rules', 'firestore.indexes.json']);
const scripts = new Set(['scripts/gen-chapter-index.mts', 'scripts/gen-battle-pool.mts', 'scripts/data/battle_prompt_repairs.json']);
const selectedTests = new Set(['tests/listeningExplanation.test.ts', 'tests/listeningMaterials.browser.mjs', 'tests/cinematics.browser.mjs', 'tests/friends.rules.test.ts', 'tests/battle.rules.test.ts', 'tests/helpers/battleRules.ts', 'tests/leaderboard.rules.test.ts']);
const originals: Record<string, string> = {};
const sha = (data: Buffer | string) => createHash('sha256').update(data).digest('hex');
function put(file: string, content: string) {
  const dest = resolve(out, file);
  if (!dest.startsWith(out + '/')) throw new Error('Unsafe export path');
  mkdirSync(dirname(dest), { recursive: true });
  writeFileSync(dest, content);
}
function text(file: string) { return readFileSync(resolve(out, file), 'utf8'); }
function edit(file: string, before: string, after: string) {
  const source = text(file);
  if (source.split(before).length !== 2) throw new Error(`Expected one match in ${file}: ${before.slice(0, 80)}`);
  put(file, source.replace(before, after));
}
function initializer(file: string, name: string, value: string) {
  const source = text(file);
  const ast = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const found: ts.VariableDeclaration[] = [];
  function visit(node: ts.Node) {
    if (ts.isVariableDeclaration(node) && node.name.getText(ast) === name && node.initializer) found.push(node);
    ts.forEachChild(node, visit);
  }
  visit(ast);
  if (found.length !== 1) throw new Error(`Missing or ambiguous declaration: ${file}/${name}`);
  const init = found[0].initializer!;
  put(file, source.slice(0, init.getStart(ast)) + value + source.slice(init.end));
}
for (const file of tracked) {
  if (!(file.startsWith('src/') || file.startsWith('public/') || top.has(file) || scripts.has(file) || selectedTests.has(file))) continue;
  // Other battle banks are not needed. Shared source is retained to preserve typed dependencies.
  if (/^src\/battle\/data\/(authored|external)\//.test(file)) continue;
  if (/^src\/battle\/data\/(pool|answer)\./.test(file) && !file.includes('.english_listening.')) continue;
  const data = readFileSync(resolve(root, file));
  originals[file] = sha(data);
  mkdirSync(dirname(resolve(out, file)), { recursive: true });
  copyFileSync(resolve(root, file), resolve(out, file));
}

initializer('src/config/features.ts', 'FEATURES', JSON.stringify({ ...FEATURES, chemistry_basic: false, chemistry: false, english_grammar: false, biology_basic: false, geography: false, math: false, rika: false, bgm: false }, null, 2) + ' as const');
initializer('src/data/allChapters.ts', 'SUBJECTS', "[{ id: 'english_listening', label: '英語リスニング', data: englishListeningData as unknown as PartsLike }]");
put('src/data/allChapters.ts', text('src/data/allChapters.ts').replace(/^import \{ (?!englishListeningData)[^\n]+Data \} from '[^']+';\n/gm, ''));
initializer('src/data/chapterIndex.generated.ts', 'SUBJECT_INDEX', JSON.stringify(SUBJECT_INDEX.filter(s => s.id === 'english_listening'), null, 2));
initializer('src/data/chapterIndex.generated.ts', 'SUBJECT_STATS', JSON.stringify({ english_listening: SUBJECT_STATS.english_listening }, null, 2));
initializer('src/data/externalSubjects.ts', 'EXTERNAL_SUBJECTS', '[]');
initializer('src/battle/core/battleRules.ts', 'BATTLE_RULES', JSON.stringify({ english_listening: { ...BATTLE_RULES.english_listening, timeLimitOverride: 55 } }, null, 2));
edit('src/battle/core/battleRules.ts', '  const base = defaultRuleOf(subject);', "  const base = defaultRuleOf(subject);\n  if (subject !== 'english_listening') return base;");
for (const [name, value] of Object.entries({ POOL_COUNTS: { english_listening: 146 }, POOL_FORMAT_COUNTS: { english_listening: { choice4: 146 } }, ANSWER_COUNTS: { english_listening: 0 } })) {
  initializer('src/battle/data/battlePool.ts', name, JSON.stringify(value));
}
put('src/battle/data/battlePool.ts', text('src/battle/data/battlePool.ts').replace(/    case '(?!english_listening')[^']+':\n      return \(await import\('[^']+'\)\)\.(POOL|ANSWERS);\n/g, ''));
// Dedicated UI and vocabulary are copied only to the listening edition.
for (const [template,target] of Object.entries({
  'ListeningHome.tsx':'src/components/ListeningHome.tsx',
  'ListeningSupport.tsx':'src/components/ListeningSupport.tsx',
  'listening-home.css':'src/components/listening-home.css',
  'listeningSupport.ts':'src/data/listeningSupport.ts',
  'gen-listening-vocabulary.mts':'scripts/gen-listening-vocabulary.mts',
})) put(target,readFileSync(resolve(root,'scripts/listening-export',template),'utf8'));
const vocabSource='src/battle/data/external/english_vocab.json';
originals[vocabSource]=sha(readFileSync(resolve(root,vocabSource)));
put('src/data/listeningVocabularySource.json',readFileSync(resolve(root,vocabSource),'utf8'));
edit('src/App.tsx', "import { Home } from './components/Home';", "import { ListeningHome as Home } from './components/ListeningHome';");
edit('src/App.tsx', '<Home onPickSubject=', "<Home onListeningStart={(chapter,index)=>{setAppMode('practice');handleSelectChapter(chapter,index,false,{startIndex:index,endIndex:index},'practice');}} onPickSubject=");
// Prevent inherited links from opening chemistry summaries or trees in the listening copy.
edit('src/components/Home.tsx', "onStudyMode('learning')", "onStudyMode('practice')");
edit('src/components/Home.tsx', '>まとめプリント</button>', '>大問を選ぶ</button>');
edit('src/components/Home.tsx', '<button type="button" onClick={onLogicalTree}>全体のつながりを見る</button>', '');
put('src/components/Home.tsx', text('src/components/Home.tsx').replaceAll('全科目の進捗を見る', 'リスニングの進捗を見る').replaceAll('教科別の記録を見る', '学習記録を見る'));
edit('src/App.tsx', "    if (mode === 'learning') {", "    if (mode === 'learning' && selectedSubject === 'english_listening') {\n      setAppMode('practice'); setAppState('chapters'); return;\n    }\n    if (mode === 'learning') {");
edit('src/App.tsx', "return (fallback as SubjectId) ?? 'chemistry_basic';", "return (fallback as SubjectId) ?? 'english_listening';");
edit('src/App.tsx', "return typeof value === 'string' && APP_STATES.has(value as AppState);", "return typeof value === 'string' && !['logical_tree', 'mock_exam', 'learning', 'advanced_fields', 'rika'].includes(value) && APP_STATES.has(value as AppState);");
edit('src/components/LaunchScreen.tsx', '学びの扉を、ひらこう。', 'マナトビ リスニング');
edit('src/components/LaunchScreen.tsx', 'ひとりでも、みんなでも。<br />とびら君と、今日もひとつ先へ。', '聞く力を、対戦する力に。<br />演習・復習・オンライン対戦');
put('src/components/Intro.tsx', `export function Intro({onBack,onBattle}:{onBack:()=>void;onBattle?:()=>void}) {
  return <main className="mtb-page overflow-y-auto pb-app-nav"><button className="mtb-back" onClick={onBack}>ホームに戻る</button>
    <h1>マナトビ リスニングの使い方</h1><h2>ひとりで演習</h2><p>第1問Aから第6問Bまで、大問を選び音源を聞いて解答します。解説ではスクリプト・和訳・聞き取りの決め手を確認できます。</p>
    <h2>対戦で力試し</h2><p>AI対戦はゲストでも遊べます。全国対戦とフレンド対戦にはGoogleログインが必要です。イヤホンを使い、音声が再生できることを確認してから始めてください。</p>
    <h2>復習と成長</h2><p>復習ノート・学習記録・ランキング・マナコイン・ガチャ・きせかえを引き継いだリスニング専用版です。オンライン保存には運営者によるFirebase設定が必要です。</p>
    {onBattle && <button className="mtb-back" onClick={onBattle}>対戦ロビーへ</button>}</main>;
}
`);
// Distinct Firebase app identity and no inherited production credentials.
put('src/firebase.ts', `import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator, disableNetwork } from 'firebase/firestore';
const env = import.meta.env;
export const FIREBASE_CONFIGURED = Boolean(env.VITE_FIREBASE_API_KEY && env.VITE_FIREBASE_PROJECT_ID && env.VITE_FIREBASE_AUTH_DOMAIN && env.VITE_FIREBASE_APP_ID);
export const USE_EMULATORS = env.VITE_USE_EMULATORS === 'true';
if (env.VITE_FIREBASE_PROJECT_ID === 'mntb-4ef06') throw new Error('統合版のFirebaseには接続できません。リスニング専用プロジェクトを設定してください。');
const projectId = FIREBASE_CONFIGURED ? env.VITE_FIREBASE_PROJECT_ID : 'demo-manatobi-listening';
const app = initializeApp({
  apiKey: FIREBASE_CONFIGURED ? env.VITE_FIREBASE_API_KEY : 'demo-listening-key',
  projectId, authDomain: FIREBASE_CONFIGURED ? env.VITE_FIREBASE_AUTH_DOMAIN : 'demo-manatobi-listening.firebaseapp.com',
  appId: FIREBASE_CONFIGURED ? env.VITE_FIREBASE_APP_ID : '1:123:web:listening',
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET, messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
}, 'manatobi-listening');
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
if (USE_EMULATORS) {
  if (!projectId.startsWith('demo-')) throw new Error('Emulator testing requires a demo- project ID.');
  connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });
  connectFirestoreEmulator(db, '127.0.0.1', 8080);
} else if (!FIREBASE_CONFIGURED) {
  // Guest preview only. Never connect to the integrated app or an unknown backend.
  void disableNetwork(db);
}
`);
edit('src/utils/googleAuth.ts', "import { auth, provider } from '../firebase';", "import { auth, provider, FIREBASE_CONFIGURED, USE_EMULATORS } from '../firebase';");
edit('src/utils/googleAuth.ts', 'export async function signInWithGoogle(): Promise<GoogleSignInOutcome> {', "export async function signInWithGoogle(): Promise<GoogleSignInOutcome> {\n  if (!FIREBASE_CONFIGURED && !USE_EMULATORS) return { ok: false, message: 'オンライン機能は初期設定が必要です。運営者はREADMEに従って専用Firebaseを設定してください。ゲストで演習・AI対戦を試せます。' };");
edit('src/utils/googleAuth.ts', 'export async function consumeGoogleRedirectResult(): Promise<User | null> {', 'export async function consumeGoogleRedirectResult(): Promise<User | null> {\n  if (!FIREBASE_CONFIGURED && !USE_EMULATORS) return null;');
edit('src/components/Onboarding.tsx', "import { auth } from '../firebase';", "import { auth, FIREBASE_CONFIGURED, USE_EMULATORS } from '../firebase';");
edit('src/components/Onboarding.tsx', '<h2 className="text-center text-2xl font-bold text-[#1B2631] sm:text-[28px]">ようこそ！</h2>', '<h2 className="text-center text-2xl font-bold text-[#1B2631] sm:text-[28px]">ようこそ！</h2>{!FIREBASE_CONFIGURED && !USE_EMULATORS && <p role="status">設定前のプレビューです。ゲストで演習・AI対戦を試せます。オンライン対戦には専用Firebaseの設定が必要です。</p>}');
// Do not send user registrations or feedback to the integrated app's spreadsheet.
initializer('src/utils/feedback.ts', 'DEFAULT_FEEDBACK_WEBHOOK_URL', "''");
// Do not reuse an unrelated analytics property or register a nonexistent service worker.
put('src/main.tsx', text('src/main.tsx').replace("import { Analytics } from '@vercel/analytics/react';\n", '').replace('    <Analytics />', '').replace(/\/\/ PWA Service Worker[^]*?\n}\n/, ''));
const index = text('index.html').replaceAll('マナトビ', 'マナトビ リスニング');
put('index.html', index);
const manifest = JSON.parse(text('public/manifest.json'));
Object.assign(manifest, { id: '/manatobi-listening', name: 'マナトビ リスニング', short_name: 'マナトビL', description: '英語リスニングの演習・解説・復習・オンライン対戦。' });
put('public/manifest.json', JSON.stringify(manifest, null, 2));
put('metadata.json', JSON.stringify({name: manifest.name, description: manifest.description}, null, 2));
for (const file of ['vercel.json', 'public/_headers']) put(file, text(file).replaceAll('https://mntb-4ef06.firebaseapp.com', 'https://*.firebaseapp.com'));
put('.firebaserc', JSON.stringify({projects: {default: 'demo-manatobi-listening'}}, null, 2));
put('firebase.json', JSON.stringify({firestore:{rules:'firestore.rules',indexes:'firestore.indexes.json'}, hosting:{public:'dist',ignore:['firebase.json','**/.*','**/node_modules/**'],rewrites:[{source:'**',destination:'/index.html'}]},emulators:{auth:{host:'127.0.0.1',port:9099},firestore:{host:'127.0.0.1',port:8080},ui:{enabled:false}}}, null, 2));
put('.env.example', `# Create a NEW Firebase project; never use the integrated app project.\nVITE_FIREBASE_API_KEY=\nVITE_FIREBASE_AUTH_DOMAIN=\nVITE_FIREBASE_PROJECT_ID=\nVITE_FIREBASE_APP_ID=\nVITE_FIREBASE_STORAGE_BUCKET=\nVITE_FIREBASE_MESSAGING_SENDER_ID=\n# Optional, local testing only:\nVITE_USE_EMULATORS=false\nVITE_FEEDBACK_WEBHOOK_URL=\nVITE_APP_VERSION=listening-1\n`);
put('.gitignore', 'node_modules/\ndist/\n.env*\n!.env.example\n.firebase/\n*.log\n.tmpwork/\ncoverage/\n/core\n');
// Regeneration keeps the subject catalog scoped instead of silently restoring other subjects.
put('scripts/scope-listening.mts', `import {readFileSync,writeFileSync} from 'node:fs';
import ts from 'typescript';
import {SUBJECT_INDEX,SUBJECT_STATS} from '../src/data/chapterIndex.generated';
let source=readFileSync('src/data/chapterIndex.generated.ts','utf8');
for(const [name,value] of Object.entries({SUBJECT_INDEX:SUBJECT_INDEX.filter(s=>s.id==='english_listening'),SUBJECT_STATS:{english_listening:SUBJECT_STATS.english_listening}})) {
 const ast=ts.createSourceFile('index.ts',source,ts.ScriptTarget.Latest,true);
 function visit(n:ts.Node){if(ts.isVariableDeclaration(n)&&n.name.getText(ast)===name&&n.initializer){const p=n.initializer;source=source.slice(0,p.getStart(ast))+JSON.stringify(value,null,2)+source.slice(p.end);}else ts.forEachChild(n,visit);}visit(ast);
}
writeFileSync('src/data/chapterIndex.generated.ts',source);
`);
put('COMMERCIAL_AUDIO_STATUS.json',JSON.stringify({status:'pending',expectedTracks:364,reason:'Kokoro regeneration and quality/license review not complete'},null,2));
put('COMMERCIAL_AUDIO_MIGRATION.md',readFileSync(resolve(root,'docs/COMMERCIAL_AUDIO_MIGRATION.md'),'utf8'));
put('scripts/check-release.mjs', `import {loadEnv} from 'vite';
import {readFileSync} from 'node:fs';
const audio=JSON.parse(readFileSync(new URL('../COMMERCIAL_AUDIO_STATUS.json',import.meta.url),'utf8'));
if(audio.status!=='approved'){console.error('公開ビルドを中止: 商用音声の差し替え・品質確認が未完了です。COMMERCIAL_AUDIO_MIGRATION.mdを確認してください。');process.exit(1);}
const env={...loadEnv('production',process.cwd(),''),...process.env};
const required=['VITE_FIREBASE_API_KEY','VITE_FIREBASE_PROJECT_ID','VITE_FIREBASE_AUTH_DOMAIN','VITE_FIREBASE_APP_ID'];
const missing=required.filter(k=>!env[k]?.trim());
if(missing.length || env.VITE_USE_EMULATORS==='true' || env.VITE_FIREBASE_PROJECT_ID==='mntb-4ef06' || env.VITE_FIREBASE_PROJECT_ID?.startsWith('demo-')) {
 console.error('公開ビルドを中止: 専用Firebase設定が必要です。READMEを参照してください。設定前の画面確認は npm run build:demo。',missing.join(', '));process.exit(1);
}
console.log('Release target: '+env.VITE_FIREBASE_PROJECT_ID);
`);
const pkg = JSON.parse(text('package.json'));
pkg.name = 'manatobi-listening'; pkg.version = '1.1.0'; pkg.engines = {node: '>=22'};
pkg.scripts = {dev:'vite --port=3000 --host=0.0.0.0', build:'node scripts/check-release.mjs && vite build', 'build:demo':'vite build', preview:'vite preview', lint:'tsc --noEmit', 'gen:index':'tsx scripts/gen-chapter-index.mts && tsx scripts/scope-listening.mts', 'gen:battle-pool':'tsx scripts/gen-battle-pool.mts', 'gen:vocabulary':'tsx scripts/gen-listening-vocabulary.mts', test:'vitest run tests/standalone.test.ts tests/listeningExplanation.test.ts', 'test:rules':'firebase emulators:exec --only firestore --project demo-manatobi-listening "vitest run tests/battle.rules.test.ts tests/friends.rules.test.ts tests/leaderboard.rules.test.ts tests/standalone-online.rules.test.ts"', 'test:browser':'node tests/standalone.browser.mjs'};
put('package.json', JSON.stringify(pkg, null, 2));
const lock=JSON.parse(text('package-lock.json')); lock.name=pkg.name;lock.version=pkg.version;Object.assign(lock.packages[''],{name:pkg.name,version:pkg.version,engines:pkg.engines});put('package-lock.json',JSON.stringify(lock,null,2));
put('vitest.config.ts', "import {defineConfig} from 'vitest/config';\nexport default defineConfig({test:{include:['tests/**/*.test.ts'],testTimeout:20000,hookTimeout:30000,fileParallelism:false}});\n");
put('README.md', readFileSync(resolve(root,'scripts/listening-export/README.md'),'utf8'));
for(const file of ['standalone.test.ts','standalone.browser.mjs','standalone-online.rules.test.ts']) put('tests/'+file,readFileSync(resolve(root,'scripts/listening-export/'+file),'utf8'));
put('DERIVATIVE_HANDOFF.md',readFileSync(resolve(root,'docs/LISTENING_DERIVATIVE.md'),'utf8'));
put('CLAUDE.md','This is the listening derivative. Read README.md and DERIVATIVE_HANDOFF.md. Preserve dedicated Firebase settings and listening-first UI. Every PR must explicitly state listening delivery decision, reason, affected files, and actual handoff status. Do not claim delivery to another room without evidence.\n');
execFileSync(process.execPath,['--import','tsx','scripts/gen-listening-vocabulary.mts'],{cwd:out,stdio:'inherit'});
// Validate that no export operation touched the source; persist a provenance manifest.
for(const [file, hash] of Object.entries(originals)) if(sha(readFileSync(resolve(root,file)))!==hash) throw new Error('Integrated source changed: '+file);
put('EXPORT_MANIFEST.json', JSON.stringify({edition:'manatobi-listening',sourceCommit,createdAt:new Date().toISOString(),sourceFiles:originals,notes:'Independent copy. Shared typed components retained; only listening catalogs and battle banks are enabled. No accounts, cloud data, secrets, node_modules, git history or build output included.'},null,2));
console.log('Listening copy created: '+relative(root,out));
console.log('Integrated source file hashes verified: '+Object.keys(originals).length);
