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
import { POOL_COUNTS, POOL_FORMAT_COUNTS, ANSWER_COUNTS } from '../src/battle/data/battlePool';
import { getChaptersOfSubject } from '../src/data/allChapters';
import { EXTERNAL_SUBJECTS } from '../src/data/externalSubjects';
// 2026-09-29：英文法（演習＋対戦）と英単語・英熟語（対戦専用）をサブ機能として残す。主役はリスニング。
const STUDY_SUBJECTS = ['english_listening', 'english_grammar'];
const BATTLE_SUBJECTS = ['english_listening', 'english_grammar', 'english_vocab'];
const pick = <T,>(o: Readonly<Record<string, T>>, keys: string[]) => Object.fromEntries(keys.map(k => [k, o[k]]));

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const out = resolve(root, process.argv[2] || '.delivery/manatobi-listening');
if (!out.startsWith(root + '/.delivery/') || existsSync(out)) {
  throw new Error('Use a NEW directory under .delivery; an existing export is never overwritten.');
}
const sourceCommit = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim();
const tracked = execFileSync('git', ['ls-files', '-z'], { cwd: root, encoding: 'utf8' }).split('\0').filter(Boolean);
const top = new Set(['package.json', 'package-lock.json', 'tsconfig.json', 'vite.config.ts', 'index.html', 'metadata.json', 'vercel.json', 'firestore.rules', 'firestore.indexes.json']);
const scripts = new Set(['scripts/gen-chapter-index.mts', 'scripts/gen-battle-pool.mts', 'scripts/data/battle_prompt_repairs.json']);
const selectedTests = new Set(['tests/connectionCheck.test.ts', 'tests/listeningExplanation.test.ts', 'tests/listeningMaterials.browser.mjs', 'tests/cinematics.browser.mjs', 'tests/friends.rules.test.ts', 'tests/battle.rules.test.ts', 'tests/helpers/battleRules.ts', 'tests/leaderboard.rules.test.ts']);
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
  if (/^src\/battle\/data\/(pool|answer)\./.test(file) && !BATTLE_SUBJECTS.some(id => file.includes('.' + id + '.'))) continue;
  const data = readFileSync(resolve(root, file));
  originals[file] = sha(data);
  mkdirSync(dirname(resolve(out, file)), { recursive: true });
  copyFileSync(resolve(root, file), resolve(out, file));
}

initializer('src/config/features.ts', 'FEATURES', JSON.stringify({ ...FEATURES, chemistry_basic: false, chemistry: false, english_grammar: true, biology_basic: false, geography: false, math: false, rika: false, bgm: false }, null, 2) + ' as const');
initializer('src/data/allChapters.ts', 'SUBJECTS', "[{ id: 'english_listening', label: '英語リスニング', data: englishListeningData as unknown as PartsLike }, { id: 'english_grammar', label: '英文法', data: englishGrammarData as unknown as PartsLike }]");
put('src/data/allChapters.ts', text('src/data/allChapters.ts').replace(/^import \{ (?!englishListeningData|englishGrammarData)[^\n]+Data \} from '[^']+';\n/gm, ''));
initializer('src/data/chapterIndex.generated.ts', 'SUBJECT_INDEX', JSON.stringify(SUBJECT_INDEX.filter(s => STUDY_SUBJECTS.includes(s.id)), null, 2));
initializer('src/data/chapterIndex.generated.ts', 'SUBJECT_STATS', JSON.stringify(pick(SUBJECT_STATS, STUDY_SUBJECTS), null, 2));
initializer('src/data/externalSubjects.ts', 'EXTERNAL_SUBJECTS', JSON.stringify(EXTERNAL_SUBJECTS.filter(s => s.id === 'english_vocab'), null, 2));
initializer('src/battle/core/battleRules.ts', 'BATTLE_RULES', JSON.stringify({ english_listening: { ...BATTLE_RULES.english_listening, timeLimitOverride: 55 }, english_grammar: BATTLE_RULES.english_grammar, english_vocab: BATTLE_RULES.english_vocab }, null, 2));
edit('src/battle/core/battleRules.ts', '  const base = defaultRuleOf(subject);', "  const base = defaultRuleOf(subject);\n  if (!" + JSON.stringify(BATTLE_SUBJECTS) + ".includes(subject)) return base;");
// 対戦のリスニング問題数は統合版の現在値を使う（2026-09-29：固定の146から変更。第1問B・第2問の追加で増えた）
const LISTENING_POOL = POOL_COUNTS.english_listening;
for (const [name, value] of Object.entries({ POOL_COUNTS: pick(POOL_COUNTS, BATTLE_SUBJECTS), POOL_FORMAT_COUNTS: pick(POOL_FORMAT_COUNTS, BATTLE_SUBJECTS), ANSWER_COUNTS: pick(ANSWER_COUNTS, BATTLE_SUBJECTS) })) {
  initializer('src/battle/data/battlePool.ts', name, JSON.stringify(value));
}
put('src/battle/data/battlePool.ts', text('src/battle/data/battlePool.ts').replace(/    case '(?!english_listening'|english_grammar'|english_vocab')[^']+':\n      return \(await import\('[^']+'\)\)\.(POOL|ANSWERS);\n/g, ''));
// Dedicated UI and vocabulary are copied only to the listening edition.
for (const [template,target] of Object.entries({
  'ListeningHome.tsx':'src/components/ListeningHome.tsx',
  'ListeningSupport.tsx':'src/components/ListeningSupport.tsx',
  'ListeningSubjectSelection.tsx':'src/components/ListeningSubjectSelection.tsx',
  'listening-home.css':'src/components/listening-home.css',
  'listeningSupport.ts':'src/data/listeningSupport.ts',
  'gen-listening-vocabulary.mts':'scripts/gen-listening-vocabulary.mts',
})) put(target,readFileSync(resolve(root,'scripts/listening-export',template),'utf8').replaceAll('__GRAMMAR_POOL__',String(POOL_COUNTS.english_grammar)).replaceAll('__VOCAB_POOL__',String(POOL_COUNTS.english_vocab.toLocaleString('en-US'))));
const vocabSource='src/battle/data/external/english_vocab.json';
originals[vocabSource]=sha(readFileSync(resolve(root,vocabSource)));
put('src/data/listeningVocabularySource.json',readFileSync(resolve(root,vocabSource),'utf8'));
edit('src/App.tsx', "import { Home } from './components/Home';", "import { ListeningHome as Home } from './components/ListeningHome';\nimport { ListeningSubjectSelection } from './components/ListeningSubjectSelection';");
// 2026-09-29：ホームから科目をえらんだら、その科目の単元一覧へそのまま進む（英文法を選んでホームに戻されると迷うため）
edit('src/App.tsx', "onChangeSubject={() => { setSubjectPickerReturnTo('home'); setSubjectPickerOrigin('change'); setAppState('subject_selection'); }}", "onChangeSubject={() => { setSubjectPickerReturnTo('home'); setSubjectPickerOrigin('start'); setAppState('subject_selection'); }}");
// 2026-09-29：科目選択は専用画面（リスニング＋「英文法・英単語を固める」）。統合版の本棚は使わない。
edit('src/App.tsx', '              <SubjectSelection\n', '              <ListeningSubjectSelection\n');
edit('src/App.tsx', "                onRika={FEATURES.rika ? () => { setRikaTab('practice'); setAppState('rika'); } : undefined}\n              />", "                onRika={FEATURES.rika ? () => { setRikaTab('practice'); setAppState('rika'); } : undefined}\n                onBattle={FEATURES.battle ? () => setAppState('battle') : undefined}\n              />");
edit('src/App.tsx', '<Home onPickSubject=', "<Home onListeningStart={(chapter,index)=>{setAppMode('practice');handleSelectChapter(chapter,index,false,{startIndex:index,endIndex:index},'practice');}} onPickSubject=");
// Prevent inherited links from opening chemistry summaries or trees in the listening copy.
// 2026-09-29：ホームは統合版と同じ1画面の構造（とびら君・演習する／対戦する／復習ノート）をそのまま使う。
// 下の帯だけリスニング用に：［科目（今の科目）］［英文法・英単語を固める］。どちらも専用の科目選択画面へ。
edit('src/components/Home.tsx', "<button type=\"button\" onClick={() => onStudyMode ? onStudyMode('learning') : onStart()}><BookOpen size={16} />まとめプリント</button>", "<button type=\"button\" onClick={onChangeSubject} data-home-foundation><PenLine size={16} />英文法・英単語を固める</button>");
edit('src/components/Home.tsx', "<button type=\"button\" onClick={onChangeSubject}>{subjectLabel}・変更</button>}", "<button type=\"button\" onClick={onChangeSubject} aria-label={`科目をえらぶ（いまは${subjectLabel}）`}><Headphones size={16} />{subjectLabel}<small>・科目</small></button>}");
edit('src/components/Home.tsx', "Target, Zap } from 'lucide-react';", "Target, Zap, Headphones, PenLine } from 'lucide-react';");
edit('src/components/Home.tsx', 'aria-label="科目とまとめプリント"', 'aria-label="科目と英文法・英単語"');
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
import { getFirestore, initializeFirestore, connectFirestoreEmulator, disableNetwork, type Firestore } from 'firebase/firestore';
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
// 統合版と同じ：学校・塾の Wi-Fi などでストリーム通信が詰まる環境だけ、自動でロングポーリングに切り替える
function createDb(): Firestore {
  try { return initializeFirestore(app, { experimentalAutoDetectLongPolling: true }); } catch { return getFirestore(app); }
}
export const db = createDb();
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
// 2026-09-29：Apple サインイン追加で Google/Apple 共通の signInWith に集約されたため、そこを塞ぐ（両方止まる）
edit('src/utils/googleAuth.ts', 'export async function signInWith(method: SignInMethod): Promise<GoogleSignInOutcome> {', "export async function signInWith(method: SignInMethod): Promise<GoogleSignInOutcome> {\n  if (!FIREBASE_CONFIGURED && !USE_EMULATORS) return { ok: false, message: 'オンライン機能は初期設定が必要です。運営者はREADMEに従って専用Firebaseを設定してください。ゲストで演習・AI対戦を試せます。' };");
edit('src/utils/googleAuth.ts', 'export async function consumeGoogleRedirectResult(): Promise<User | null> {', 'export async function consumeGoogleRedirectResult(): Promise<User | null> {\n  if (!FIREBASE_CONFIGURED && !USE_EMULATORS) return null;');
edit('src/components/Onboarding.tsx', "import { auth } from '../firebase';", "import { auth, FIREBASE_CONFIGURED, USE_EMULATORS } from '../firebase';");
edit('src/components/Onboarding.tsx', '<h2 className="text-center text-2xl font-bold text-[#1B2631] sm:text-[28px]">ようこそ！</h2>', '<h2 className="text-center text-2xl font-bold text-[#1B2631] sm:text-[28px]">ようこそ！</h2>{!FIREBASE_CONFIGURED && !USE_EMULATORS && <p role="status">設定前のプレビューです。ゲストで演習・AI対戦を試せます。オンライン対戦には専用Firebaseの設定が必要です。</p>}');
// Do not send user registrations or feedback to the integrated app's spreadsheet.
initializer('src/utils/feedback.ts', 'DEFAULT_FEEDBACK_WEBHOOK_URL', "''");
// Do not reuse an unrelated analytics property. 2026-09-29：Service Worker（public/sw.js・オフライン学習）の登録はアプリ化に必要なので残す。
put('src/main.tsx', text('src/main.tsx').replace("import { Analytics } from '@vercel/analytics/react';\n", '').replace('    <Analytics />', ''));
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
for(const [name,value] of Object.entries({SUBJECT_INDEX:SUBJECT_INDEX.filter(s=>['english_listening','english_grammar'].includes(s.id)),SUBJECT_STATS:{english_listening:SUBJECT_STATS.english_listening,english_grammar:SUBJECT_STATS.english_grammar}})) {
 const ast=ts.createSourceFile('index.ts',source,ts.ScriptTarget.Latest,true);
 function visit(n:ts.Node){if(ts.isVariableDeclaration(n)&&n.name.getText(ast)===name&&n.initializer){const p=n.initializer;source=source.slice(0,p.getStart(ast))+JSON.stringify(value,null,2)+source.slice(p.end);}else ts.forEachChild(n,visit);}visit(ast);
}
writeFileSync('src/data/chapterIndex.generated.ts',source);
`);
// 音源の商用状況は台帳（scripts/data/listening_audio_ledger.json）から作る。手書きの値を置かない。
// 全部 replaced（商用の新音源）になったときだけ status=approved。1本でも旧音源が残れば公開ビルドは止まる。
const ledger: {audioUrl:string;status:string;provider:string;license:string;sha256:string}[] = JSON.parse(readFileSync(resolve(root,'scripts/data/listening_audio_ledger.json'),'utf8'));
const legacyLeft = ledger.filter(r => r.status !== 'replaced');
for (const r of ledger) if (r.status === 'replaced' && sha(readFileSync(resolve(root,'public'+r.audioUrl))) !== r.sha256) throw new Error('台帳と音源の中身が一致しない: '+r.audioUrl);
put('COMMERCIAL_AUDIO_STATUS.json',JSON.stringify({
  status: legacyLeft.length ? 'pending' : 'approved',
  totalTracks: ledger.length, replacedTracks: ledger.length - legacyLeft.length,
  legacyTracks: legacyLeft.map(r => r.audioUrl),
  licenseEvidence: { dir: 'license_evidence/', addedAt: '2026-09-29', receipts: ['#2084-3643-1031 Creator $12.10 (2026-09-20)', '#2495-9775-3869 Starter $6.00 (2026-09-28)', '#2466-8389-4576 $12.10 (2026-09-29)'], remark: 'providers 欄の「契約画面の証拠は未確認」は取り込み時点の記録。領収書は後日このフォルダに追加した。' },
  providers: [...new Set(ledger.filter(r=>r.status==='replaced').map(r=>r.provider+' / '+r.license))],
  note: 'ElevenLabs 有料契約中に運営者が直接生成。領収書3件（Creator 2026-09-20／Starter 2026-09-28／2026-09-29 更新）は license_evidence/ に同梱。音源ごとの生成元・sha256 は listening_audio_ledger.json',
},null,2));
for (const f of execFileSync('git', ['ls-files', 'audio_sources/commercial/license_evidence'], { cwd: root, encoding: 'utf8' }).split('\n').filter(Boolean)) {
  const dest = resolve(out, 'license_evidence', relative(resolve(root, 'audio_sources/commercial/license_evidence'), resolve(root, f)));
  mkdirSync(dirname(dest), { recursive: true }); copyFileSync(resolve(root, f), dest);
}
put('listening_audio_ledger.json', readFileSync(resolve(root,'scripts/data/listening_audio_ledger.json'),'utf8'));
// 専用版テストの期待値（大問数・対戦問題数）も統合版の現在値から作る
const PRACTICE_TOTAL = getChaptersOfSubject('english_listening').reduce((n,c)=>n+c.practiceProblems.length+c.miniTest.length,0);
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
pkg.scripts = {dev:'vite --port=3000 --host=0.0.0.0', build:'node scripts/check-release.mjs && vite build', 'build:demo':'vite build', preview:'vite preview', lint:'tsc --noEmit', 'gen:index':'tsx scripts/gen-chapter-index.mts && tsx scripts/scope-listening.mts', 'gen:battle-pool':'tsx scripts/gen-battle-pool.mts', 'gen:vocabulary':'tsx scripts/gen-listening-vocabulary.mts', test:'vitest run tests/standalone.test.ts tests/listeningExplanation.test.ts tests/connectionCheck.test.ts', 'firebase:check':'node scripts/check-firebase-setup.mjs', 'test:rules':'firebase emulators:exec --only firestore --project demo-manatobi-listening "vitest run tests/battle.rules.test.ts tests/friends.rules.test.ts tests/leaderboard.rules.test.ts tests/standalone-online.rules.test.ts"', 'test:browser':'node tests/standalone.browser.mjs'};
put('package.json', JSON.stringify(pkg, null, 2));
const lock=JSON.parse(text('package-lock.json')); lock.name=pkg.name;lock.version=pkg.version;Object.assign(lock.packages[''],{name:pkg.name,version:pkg.version,engines:pkg.engines});put('package-lock.json',JSON.stringify(lock,null,2));
put('vitest.config.ts', "import {defineConfig} from 'vitest/config';\nexport default defineConfig({test:{include:['tests/**/*.test.ts'],testTimeout:20000,hookTimeout:30000,fileParallelism:false}});\n");
put('README.md', readFileSync(resolve(root,'scripts/listening-export/README.md'),'utf8'));
// 2026-09-30：新しい Firebase につなぐ設定の確認スクリプト（読み取りのみ）
put('scripts/check-firebase-setup.mjs', readFileSync(resolve(root,'scripts/listening-export/check-firebase-setup.mjs'),'utf8'));
for(const file of ['standalone.test.ts','standalone.browser.mjs','standalone-online.rules.test.ts']) put('tests/'+file,readFileSync(resolve(root,'scripts/listening-export/'+file),'utf8').replaceAll('__POOL_TOTAL__',String(LISTENING_POOL)).replaceAll('__PRACTICE_TOTAL__',String(PRACTICE_TOTAL)).replaceAll('__GRAMMAR_POOL__',String(POOL_COUNTS.english_grammar)).replaceAll('__VOCAB_POOL__',String(POOL_COUNTS.english_vocab)));
put('README.md', text('README.md').replaceAll('__POOL_TOTAL__',String(LISTENING_POOL)).replaceAll('__PRACTICE_TOTAL__',String(PRACTICE_TOTAL)).replaceAll('__AUDIO_REPLACED__',String(ledger.length-legacyLeft.length)).replaceAll('__AUDIO_TOTAL__',String(ledger.length)).replaceAll('__GRAMMAR_POOL__',String(POOL_COUNTS.english_grammar)).replaceAll('__VOCAB_POOL__',String(POOL_COUNTS.english_vocab)));
put('DERIVATIVE_HANDOFF.md',readFileSync(resolve(root,'docs/LISTENING_DERIVATIVE.md'),'utf8'));
put('CLAUDE.md','This is the listening derivative. Read README.md and DERIVATIVE_HANDOFF.md. Preserve dedicated Firebase settings and listening-first UI. Every PR must explicitly state listening delivery decision, reason, affected files, and actual handoff status. Do not claim delivery to another room without evidence.\n');
execFileSync(process.execPath,['--import','tsx','scripts/gen-listening-vocabulary.mts'],{cwd:out,stdio:'inherit'});
// Validate that no export operation touched the source; persist a provenance manifest.
for(const [file, hash] of Object.entries(originals)) if(sha(readFileSync(resolve(root,file)))!==hash) throw new Error('Integrated source changed: '+file);
put('EXPORT_MANIFEST.json', JSON.stringify({edition:'manatobi-listening',sourceCommit,createdAt:new Date().toISOString(),sourceFiles:originals,notes:'Independent copy. Shared typed components retained; only listening catalogs and battle banks are enabled. No accounts, cloud data, secrets, node_modules, git history or build output included.'},null,2));
console.log('Listening copy created: '+relative(root,out));
console.log('Integrated source file hashes verified: '+Object.keys(originals).length);
