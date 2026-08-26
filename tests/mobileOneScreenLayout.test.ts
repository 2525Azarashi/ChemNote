/**
 * =====================================================================
 * スマホ「1画面に収める」レイアウト契約
 * =====================================================================
 * ご要望（原文）：
 *   (7a) > こんな感じでさ、他の大問のUIも変えてくれない？第１問Aも第３問も
 *        > これから入る予定の第２問とその他も
 *        > （この再生マークを小さくするの結構いいと思った）
 *
 *   (7b) > ホーム画面と科目選択画面も同じように１画面に映るようにうまく調節して
 *
 *   (9)  > 全ての問題で適応できているかしっかりと確認すること。
 *        > 特に化学基礎とかは問題によって、問題文の長さが違うから、
 *        > コードで形式的に作ると問題によっておかしくなる可能性があるから注意ね。
 *        > あと、ホーム画面は特に学習を始めるを含め一画面を目指して。
 *
 *   (8)  > パソコン版は何も変更しないでね。スマホの話ね。
 *
 * ★このファイルが守る不変条件★
 *
 *  1. 高さの器（App シェル）は必ず「実際に見えている高さ」= dvh で確定させる。
 *     100vh は iOS Safari では URL バー込みの最大高さなので、実表示領域を超える。
 *     さらに min-height だと中身に合わせて伸びてしまい、子の % 高さが none 扱いになる。
 *
 *  2. flex の高さ連鎖を切らない（min-h-0 を各段に通す）。
 *     flex アイテムの既定は min-height:auto ＝「中身より縮まない」なので、
 *     min-h-0 が無いと flex-1 も overflow-y-auto も黙って無効化される。
 *
 *  3. 下部固定ナビは position:fixed ＝レイアウト高さ 0 なので、
 *     スクロールペイン側が自前で末尾余白（.pb-app-nav）を確保する。
 *
 *  4. ★ホームの「学習を始める」は中身の長さに依存せず必ず画面内★
 *     カードや進捗バーの高さはデータ（科目数・履歴）で変わるので、
 *     px を削る方式では必ず破れる。CSS order で並び順を変えて構造的に保証する。
 *
 *  5. ★PC（lg 以上）の見た目は変えない★
 *     order も compact 化も、必ず lg:（または md:/sm:）で元に戻す。
 */
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';

const ROOT = path.resolve(__dirname, '..');
const read = (p: string) => fs.readFileSync(path.join(ROOT, p), 'utf-8');

const APP = read('src/App.tsx');
const CSS = read('src/index.css');
const HOME = read('src/components/Home.tsx');
const SUBJECT = read('src/components/SubjectSelection.tsx');
const MODE = read('src/components/ModeSelection.tsx');
const MASCOT = read('src/components/DoorMascot.tsx');
const QUIZ = read('src/components/Quiz.tsx');
const EXPL = read('src/components/Explanation.tsx');

/**
 * ソースから「コメントを除いた実コード」を取り出す。
 *
 * なぜ必要か：
 *   このリポジトリは「なぜこう直したか」を長いコメントで残す方針なので、
 *   「◯◯というクラスをもう使っていないこと」を素朴な includes で確かめると
 *   経緯を説明した自分のコメントに一致して偽陽性になる。
 *   className={`...`} のテンプレートリテラル内部にもコメントが書かれるため、
 *   className 属性だけを正規表現で抜き出す方法でも防げない。
 *
 * 自作のスキャナで消そうとすると、文字列中の記号やテンプレートリテラルの
 * ${} 入れ子で必ず取りこぼす（実際に一度取りこぼした）。
 * ここでは TypeScript 自身の removeComments を使い、
 * 「コンパイラが見ているコード」と同じものを判定対象にする。
 */
const strippedCache = new Map<string, string>();
function stripComments(src: string): string {
  const cached = strippedCache.get(src);
  if (cached !== undefined) return cached;
  const out = ts.transpileModule(src, {
    compilerOptions: {
      removeComments: true,
      jsx: ts.JsxEmit.Preserve, // JSX を残す（className の文字列を見たいので）
      target: ts.ScriptTarget.ESNext,
      module: ts.ModuleKind.ESNext,
    },
    fileName: 'src.tsx',
  }).outputText;
  strippedCache.set(src, out);
  return out;
}

// =====================================================================
// L1: App シェルが高さの器になる（(7b) の真因）
// =====================================================================
describe('L1: App シェルは dvh で高さを確定させる', () => {
  it('シェルの高さは h-[100dvh]（min-h-screen ではない）', () => {
    // ★真因★ min-h-screen = min-height:100vh。
    //   ・100vh は iOS で URL バーを含むため実表示領域より大きい
    //   ・min-height なので中身が長いと器ごと伸びる
    //   結果として「確定した高さ」がどこにも無く、子の flex-1 は
    //   中身の高さいっぱいに膨らみ、内側スクロールが一切発生しなかった。
    expect(APP).toContain('h-[100dvh]');
    expect(APP).not.toMatch(/className=\{`min-h-screen w-full flex justify-center/u);
  });

  it('シェルは overflow-y-auto（overflow-hidden にしない）', () => {
    // ★自作の回帰を防ぐ★
    //   StudyHub / Leaderboard / Intro / ModeSelection / MockExam / LogicalTree は
    //   内側スクロールペインを持たない。ここを overflow-hidden にすると
    //   それらの画面のあふれた内容へ到達できなくなる。
    expect(APP).toContain('h-[100dvh] w-full flex justify-center relative overflow-y-auto');
  });

  it('内側ラッパが min-h-0 で高さ連鎖を子に渡す', () => {
    // min-h-0 が無いと、下の画面root の h-full / max-h-full が効かない。
    expect(APP).toContain('w-full relative min-h-0');
    expect(APP).toContain('max-w-5xl max-h-full flex flex-col');
  });

  it('下部ナビの safe-area が padding の重複で捨てられていない', () => {
    // ★静かなバグ★ 以前は pb-safe と pb-6 が同時に付いており、
    //   後勝ちで pb-6 が採用され env(safe-area-inset-bottom) が消えていた。
    expect(APP).toContain('pt-3 pb-[calc(0.9rem+env(safe-area-inset-bottom))] z-[60]');
    // 重複指定に戻っていないこと（className 文字列の中だけを見る。
    // 経緯を書いたコメント行に pb-safe / pb-6 が出てくるので行頭 className に限定）。
    expect(APP).not.toMatch(/className="[^"]*\bpb-safe\b[^"]*\bpb-6\b/u);
  });
});

// =====================================================================
// L2: 下部固定ナビぶんの余白を各ペインが自前で確保する
// =====================================================================
describe('L2: fixed ナビはレイアウト高さ 0 なので余白は各ペインが持つ', () => {
  it('.pb-app-nav が safe-area 込みで定義されている', () => {
    expect(CSS).toContain('.pb-app-nav');
    expect(CSS).toMatch(/\.pb-app-nav\s*\{\s*padding-bottom:\s*calc\(4\.75rem \+ env\(safe-area-inset-bottom\)\)/u);
  });

  it('ナビが出る画面（ホーム・モード選択）は .pb-app-nav を使う', () => {
    expect(HOME).toContain('pb-app-nav');
    expect(MODE).toContain('pb-app-nav');
  });

  it('ナビが出ない科目選択は pb-app-nav ではなく pb-safe', () => {
    // 科目選択では下部ナビを描画しないので、4.75rem も空けると無駄になる。
    expect(SUBJECT).toContain('pb-safe');
    expect(SUBJECT).not.toContain('pb-app-nav');
  });
});

// =====================================================================
// L3: ホームの「学習を始める」は中身の長さに依存せず画面内 ((9c))
// =====================================================================
describe('L3: ホームの CTA は order で構造的に画面内へ', () => {
  it('スクロールペインは min-h-0 + flex-col（order を効かせるため）', () => {
    expect(HOME).toContain('flex-1 min-h-0 overflow-y-auto lg:overflow-hidden');
    expect(HOME).toContain('flex flex-col lg:justify-center');
  });

  it('CTA はスマホで 2 番目、lg で元の 4 番目に戻る', () => {
    // ★px を削る方式は採らない★
    //   カード高さは科目数・学習履歴で変わるので、削った px は必ず食われる。
    //   並び順を変えれば CTA の位置は中身の長さから独立する。
    expect(HOME).toContain('order-2 lg:order-4');
  });

  it('あいさつ→CTA→カード→バナー→補助 の順に order が振られている', () => {
    expect(HOME).toContain('order-1');
    expect(HOME).toContain('order-3');
    expect(HOME).toContain('order-4 lg:order-2');
    expect(HOME).toContain('order-5');
  });

  it('★PC の並びは元のまま★（lg: で必ず打ち消す）', () => {
    // order-2 / order-4 はどちらも lg: で元の位置に戻す指定が対になっている。
    expect(HOME).toMatch(/order-2 lg:order-4/u);
    expect(HOME).toMatch(/order-4 lg:order-2/u);
  });

  it('ホーム root が高さ連鎖を受け取る', () => {
    expect(HOME).toContain('w-full h-full min-h-0 flex flex-col');
  });
});

// =====================================================================
// L4: 科目選択・モード選択もスマホだけ 1 画面に収める
// =====================================================================
describe('L4: 科目選択／モード選択（スマホのみ compact）', () => {
  it('科目選択 root とペインに高さ連鎖が通っている', () => {
    expect(SUBJECT).toContain('w-full h-full min-h-0 flex flex-col');
    expect(SUBJECT).toContain('flex-1 min-h-0 overflow-y-auto');
  });

  it('科目カードはスマホで 1 行・sm 以上で元の縦組み', () => {
    // ★sm:min-h-[210px] が残っていること＝PC/タブレットの見た目は不変★
    expect(SUBJECT).toContain('sm:min-h-[210px]');
    // 無条件の min-h-[210px]（sm: が付かない形）に戻っていないこと。
    // ※ `sm:min-h-[210px]` は : が単語境界なので \b では除外できない。
    expect(SUBJECT).not.toMatch(/(?<![\w:-])min-h-\[210px\]/u);
  });

  it('科目選択でスマホだけ隠す要素は必ず sm: で復帰する', () => {
    expect(SUBJECT).toContain('hidden sm:inline-flex');
    expect(SUBJECT).toContain('hidden sm:block');
    expect(SUBJECT).toContain('hidden sm:flex');
  });

  it('スマホでも「進める」ことが分かる手がかりを残す', () => {
    // 「この科目ではじめる」の帯を sm 以下で隠すため、代わりに矢印を出す。
    expect(SUBJECT).toContain("sm:hidden w-5 h-5 text-[#E8688E] shrink-0");
  });

  it('モード選択カードはスマホで横並び・md 以上で元の縦組み', () => {
    expect(MODE).toContain('flex flex-row md:flex-col');
    // ★md:contents★ md 以上ではラッパを消して元の中央寄せ 1 カラムに戻す。
    expect(MODE).toContain('md:contents');
  });

  it('モード選択カードはスマホだけ内部スクロールする', () => {
    expect(MODE).toContain('max-h-full sm:max-h-none overflow-y-auto sm:overflow-visible');
    expect(MODE).toContain('min-h-0 sm:min-h-[60vh]');
  });

  it('マスコットはスマホだけ小さく、sm 以上は元のサイズ', () => {
    expect(MASCOT).toContain('w-14 h-16 sm:w-24 sm:h-28');
    expect(MASCOT).toContain('px-3 py-2 sm:px-4 sm:py-3');
  });
});

// =====================================================================
// L4b: 科目が 6 つ（英文法追加）になっても科目選択はスマホ 1 画面 ((10))
// =====================================================================
// ご要望（原文）：
//   > 英文法単元別に追加してください。
//   > スマホの方はしっかりと科目選択画面で１画面に収まるようにしてください。
//
// 5 科目 → 6 科目で、実測 183px はみ出した。
// 削ってよいものと削ってはいけないものを分けて詰めた記録をここに固定する。
describe('L4b: 6 科目でもスマホ 1 画面（英文法追加後）', () => {
  it('英文法が科目として登録されている', () => {
    expect(SUBJECT).toContain("id: 'english_grammar'");
    expect(SUBJECT).toContain("english_grammar: '英文法'");
  });

  it('カード間隔・内側余白・アイコンをスマホだけ詰め、sm 以上は元の値に戻す', () => {
    // gap: スマホ 4px / sm 以上は従来の 8px・md 以上 20px
    expect(SUBJECT).toContain('gap-1 sm:gap-2 md:gap-5');
    // カード内側: スマホ 8px / sm 以上は従来の 20px・24px
    expect(SUBJECT).toContain('p-2 sm:p-5 md:p-6');
    // アイコン枠とグリフ
    expect(SUBJECT).toContain('w-9 h-9 sm:w-12 sm:h-12');
    expect(SUBJECT).toContain('w-4.5 h-4.5 sm:w-6 sm:h-6');

    // ★sm: の付かない裸の値に戻っていないこと（PC を巻き込む変更の防止）★
    //
    // ここは「ファイル全体を検索する」やり方をしてはいけない。
    // 実際にやってみたら、
    //   ・L388 の日本語コメント（gap-4=16px → gap-1=4px）
    //   ・L452 の `hidden sm:inline-flex ... gap-1 ...`（PC だけに出るバッジ。元から裸で正しい）
    // を拾って誤検出した。
    // 見張りたいのは「グリッドの gap」と「カードの内側余白」という
    // 特定の 2 箇所だけなので、その行に絞って調べる。
    const gridLine = SUBJECT.split('\n').find(l => l.includes('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3'));
    expect(gridLine).toBeDefined();
    // グリッドの gap は必ず「スマホ値 → sm: → md:」の 3 段で書く
    expect(gridLine).toMatch(/gap-\S+\s+sm:gap-\S+\s+md:gap-\S+/u);

    const cardLine = SUBJECT.split('\n').find(l => l.includes('group relative w-full h-full text-left rounded-'));
    expect(cardLine).toBeDefined();
    // カードの内側余白も同じく 3 段
    expect(cardLine).toMatch(/(?<![\w:-])p-\S+\s+sm:p-\S+\s+md:p-\S+/u);
  });

  it('ページ上部の余白（pt・header の mb・挨拶の mt）をスマホだけ詰める', () => {
    expect(SUBJECT).toContain('pt-3 sm:pt-10 md:pt-14');
    expect(SUBJECT).toContain('text-center mb-2 sm:mb-7 md:mb-9');
    expect(SUBJECT).toContain('mt-1.5 sm:mt-5');
  });

  it('「ようこそ、○○さん。」はスマホでは出さず（強制改行をやめる）、sm 以上で復帰する', () => {
    // 以前は <br className="sm:hidden"> で 2 行（42px）になっていた。
    // 挨拶はホーム画面で既に出ているので、この画面では 1 行に畳む。
    expect(SUBJECT).toContain('<span className="hidden sm:inline">');
    expect(SUBJECT).toMatch(/ようこそ、/u);
    // 強制改行が復活していないこと
    expect(SUBJECT).not.toContain('<br className="sm:hidden" />');
  });

  it('★連携バナーは div で包まず className で隠す★（包むと PC が崩れる）', () => {
    // pane は flex flex-col。バナー本体(motion.section)は「pane の直接の子」で
    // flex アイテムとして縮んでいる（実測 34px）。
    // div で包むと flex アイテムが div に変わり、中の section が
    // 本来の高さ（実測 187px）に伸びて PC のグリッドが 124px 下へずれる。
    expect(SUBJECT).toContain('{isGuest && <GoogleLinkBanner className="hidden sm:block" />}');
    // ラッパ div 方式に戻っていないこと
    expect(SUBJECT).not.toMatch(/<div className="hidden sm:block">\s*<GoogleLinkBanner/u);
  });

  it('ローマ字副題とハイライトのリストはスマホで隠し、sm 以上で復帰する', () => {
    expect(SUBJECT).toContain('hidden sm:block text-[10px] font-modern tracking-[0.2em] mt-0.5');
    expect(SUBJECT).toContain('hidden sm:block space-y-1.5 mb-0 sm:mb-4');
  });

  it('脚注（あとから切り替えられます）はスマホで隠し、sm 以上で復帰する', () => {
    expect(SUBJECT).toContain('hidden sm:block text-center text-[11px] text-[#8895A0] font-modern mt-3 sm:mt-7');
  });

  it('★収録ボリュームは消さない★——スマホでは科目名の真下に必ず出す', () => {
    // 行数を減らすために「位置を移した」だけで、情報は消していない。
    expect(SUBJECT).toContain('sm:hidden text-[10px] font-modern leading-snug mt-0.5');
    expect(SUBJECT).toContain('{subject.volume}');
  });

  it('★スマホ用の収録表記は専用の volume を使い、truncate しない★', () => {
    // highlights[0] は説明文なので長く、実測で 320〜430px の全幅で
    // 末尾が切れていた（英語リスニング・化学・数学）。
    // 切れると肝心の数字が読めず「情報を消した」のと同じになる。
    expect(SUBJECT).toContain('volume: string;');
    // sm:hidden の収録行に truncate が付いていないこと
    const volLine = SUBJECT.split('\n').find(l => l.includes('sm:hidden text-[10px] font-modern leading-snug'));
    expect(volLine).toBeDefined();
    expect(volLine).not.toContain('truncate');
    // highlights[0] の流用に戻っていないこと
    expect(SUBJECT).not.toContain('{subject.highlights[0]}');
  });

  it('6 科目すべてが volume（短い収録表記）を持つ', () => {
    // 1 つでも欠けるとその科目だけ収録数が読めなくなる。
    const volumes = SUBJECT.match(/^\s*volume: `/gmu) ?? [];
    expect(volumes.length).toBe(6);
  });
});

// =====================================================================
// L5: リスニングは「図があるか」で高さの配り先を切り替える ((7a))
// =====================================================================
describe('L5: 図の有無で余った高さの受け取り手を入れ替える', () => {
  it('図の有無を表すフラグがある', () => {
    // ★真の差分は大問番号ではなく imageUrl の有無★
    //   第1問B は図あり（余った高さを図が吸う）、
    //   第1問A・第3問は図なし（吸う相手がいない＝空白になる）。
    expect(QUIZ).toContain('const activeStepHasFigure = !!activeStepSub?.imageUrl');
    expect(QUIZ).toContain('const listeningMobileNoFigure = listeningMobileSplit && !activeStepHasFigure');
  });

  it('図が無いときは問題文ペインが flex-none になる', () => {
    expect(QUIZ).toContain(
      "${listeningMobileSplit && !listeningMobileNoFigure ? 'flex-1 min-h-0' : 'flex-none'}"
    );
  });

  it('図が無いときは解答ペインが余りをもらい、選択肢を下端へ寄せる', () => {
    expect(QUIZ).toContain("'flex-1 flex flex-col justify-end pt-2'");
  });

  it('図が無いときの問題文ペインには実表示高さ基準の上限を付ける', () => {
    // 長い設問文（化学基礎の長文など）でも解答欄を必ず残すための上限。
    expect(QUIZ).toContain("'h-auto max-h-[46dvh] shadow-md relative z-20'");
  });

  it('選択肢は伸ばしすぎない上限を持つ（auto-rows-fr の暴走防止）', () => {
    // auto-rows-fr は高さ上限が無いと 1 ボタンが画面の半分まで伸びる。
    expect(QUIZ).toContain('auto-rows-fr');
    expect(QUIZ).toContain('max-h-[5rem]');
  });

  it('★PC は従来のまま★（lg の 58/42 と h-full 分岐は不変）', () => {
    expect(QUIZ).toContain('lg:w-[58%]');
    expect(QUIZ).toContain('lg:w-[42%]');
    expect(QUIZ).toContain("isDesktop\n            ? 'h-full'");
  });
});

// =====================================================================
// L6: 「問題ごとに壊れない」ための不変条件 ((9) + (8) の(ア)(イ)欠け)
// =====================================================================
/**
 * ご指摘（原文）：
 *   > 全ての問題で適応できているかしっかりと確認すること。
 *   > 特に化学基礎とかは問題によって、問題文の長さが違うから、
 *   > コードで形式的に作ると問題によっておかしくなる可能性があるから注意ね。
 *   > (ア)(イ)とかのボタンが欠けてる
 *
 * ■ 実測した事実（.preview/enumerate.mts で全306問を計測）
 *     化学基礎の問題文    18文字 〜 1031文字（57倍）
 *     小問数              1 〜 24
 *   → 「この問題でちょうど良い px」を積み上げる作り方は必ずどこかで壊れる。
 *
 * ■ 実際に壊れていた問題（c5_7[0]・わずか95文字・図あり）
 *     360x600 で (ア)(イ)(ウ)(エ) が下部ナビの下に落ち、見えている選択肢 0/4。
 *     長文問題ではなく「短い問題」で壊れていた点が重要で、
 *     原因は問題文の長さではなく“取り分の決め方”そのものだった。
 *
 *   原因1: max-h-[42dvh] は名前が「画面の42%」だが、ペインが実際に
 *          分け合えるのは（ビューポート − ヘッダー − 下部ナビ）だけ。
 *            360x600 → 使える 453px に対し 42dvh=252px → 実質 56%
 *            390x664 → 使える 517px に対し 42dvh=279px → 実質 54%
 *   原因2: 消去法の操作説明（初回は開いた状態）が 360〜390px 幅で4行に
 *          折り返し、解答ペインの限られた高さを約150px 食っていた。
 *
 * ■ この describe が固定する「直し方の性質」
 *   px を削る対策は、次に来る長い問題文や長い説明文でまた破れる。
 *   そこで
 *     (1) 高さの取り分は「親（ペインを分け合う箱）に対する割合」で決める
 *         → 文字数もビューポートも影響しない
 *     (2) 選択肢を CSS order で説明文より前に出す
 *         → 説明文が何行に折り返しても選択肢は画面内に残る
 *   という、どちらも“中身の長さに依存しない”手段だけを使う。
 *   そして (8) の「パソコン版は何も変更しないでね」を守るため、
 *   すべて md: 以上で元に戻す。
 */
describe('L6: 高さの取り分を「文字数に依存しない基準」で決める', () => {
  it('問題文ペインの上限は親基準（%）であり、ビューポート基準(dvh)ではない', () => {
    // 親基準なのでヘッダー・下部ナビは自動的に差し引かれる。
    expect(QUIZ).toContain("'max-h-[50%] h-auto shadow-md relative z-20'");
  });

  it('★退行防止★ 実際のクラス指定に max-h-[42dvh] を復活させない', () => {
    /*
      経緯（なぜ 42dvh を捨てたのか）はコメントとして残してあるので、
      素朴に QUIZ.includes('42dvh') で判定すると自分のコメントに当たってしまう。
      さらに className={`...`} のテンプレートリテラル内部にも
      /* ... *​/ コメントが入るため「className だけ抜き出す」でも足りない。
      よって「コメントを取り除いたソース」を作ってから判定する。
    */
    const stripped = stripComments(QUIZ);
    // 取り除きすぎ／取り除けていないことの検知（番兵）
    expect(stripped).toContain("'max-h-[50%] h-auto shadow-md relative z-20'"); // 実コードは残る
    expect(stripped).not.toContain('ご指摘「問題によって問題文の長さが違うから'); // コメントは消える

    expect(stripped).not.toContain('42dvh');
  });

  it('解答ペインは flex-1 で「残り」を受け取る（上限を先取りしない）', () => {
    // 問題文側が割合で上限を持ち、解答側が残りを取る、という向きを固定する。
    // これが逆だと長文問題で解答欄が消える。
    expect(QUIZ).toContain('lg:w-[42%] min-h-0 overflow-y-auto');
  });
});

describe('L6: 選択肢は CSS order で必ず操作説明より前に出す', () => {
  it('選択肢グリッドが order-1（スマホのみ）', () => {
    expect(QUIZ).toContain('order-1 md:order-none');
  });

  it('操作説明パネル（展開時）が order-2（スマホのみ）', () => {
    expect(QUIZ).toMatch(/className="order-2 md:order-none flex flex-wrap items-center/u);
  });

  it('操作説明の折りたたみ表示（?ボタンだけ）も order-2', () => {
    // 展開・折りたたみのどちらの状態でも選択肢が先、という対称性が必要。
    expect(QUIZ).toContain('className="order-2 md:order-none flex justify-end"');
  });

  it('order が効くように親が flex-col である', () => {
    // order は flex/grid コンテナの子にしか効かない。
    // 親が block のままだと上の order-1/2 は黙って無視される。
    expect(QUIZ).toContain('<div className="flex w-full flex-col gap-2">');
  });

  it('★PC は従来の並び★（md 以上で order を解除している）', () => {
    // md:order-none が無い order-* はスマホ用の並びを PC に漏らす。
    const orders = QUIZ.match(/(?<![\w:-])order-\d(?![\w-])/gu) ?? [];
    expect(orders.length).toBeGreaterThan(0);
    // Quiz.tsx 内の order-* はすべて md:order-none と同じ className に同居する。
    const attrsWithOrder = (QUIZ.match(/className=(?:"[^"]*"|\{`[\s\S]*?`\})/gu) ?? [])
      .filter(a => /(?<![\w:-])order-\d(?![\w-])/u.test(a));
    expect(attrsWithOrder.length).toBeGreaterThan(0);
    for (const attr of attrsWithOrder) {
      expect(attr).toContain('md:order-none');
    }
  });
});

describe('L6: 操作説明はスマホだけ圧縮する（消さない）', () => {
  it('3段階（選ぶ→斜線→戻す）の説明はスマホでも短縮版が残る', () => {
    // ご要望(8)の「無くすのではなくて、小さくコンパクトにする」と同じ方針。
    expect(QUIZ).toContain('<span className="md:hidden">選ぶ</span>');
    expect(QUIZ).toContain('<span className="md:hidden">斜線</span>');
    expect(QUIZ).toContain('<span className="md:hidden">戻す</span>');
  });

  it('★PC の文言は従来のまま★（hidden md:inline で温存されている）', () => {
    expect(QUIZ).toContain('<span className="hidden md:inline">タップで選択</span>');
    expect(QUIZ).toContain('<span className="hidden md:inline">もう一度で斜線</span>');
    expect(QUIZ).toContain('<span className="hidden md:inline">さらにタップで元に戻る</span>');
  });

  it('長押しの補足はスマホでは出さない（3段階はチップ見本で伝わる）', () => {
    expect(QUIZ).toContain('<span className="hidden md:inline text-gray-400">／長押しでこの設問の斜線をまとめて消す</span>');
  });

  it('パネルの余白もスマホだけ詰める（md: で元の余白に戻す）', () => {
    expect(QUIZ).toContain('px-2 py-1 md:px-2.5 md:py-2');
    expect(QUIZ).toContain('gap-x-1.5 md:gap-x-2');
  });
});

describe('L7: 小問の横並び・設問一覧の重複除去（ご要望8／スマホのみ）', () => {
  it('横並び判定はスマホのときだけ行う（isDesktop なら常に null）', () => {
    // 「パソコン版は何も変更しないでね」を構造で保証する。
    // isDesktop が true の間は extractInlineQuestionRows を呼ばず null を返すので、
    // PC は必ず従来の ExplanationBody（縦積み）を通る。
    const stripped = stripComments(QUIZ);
    expect(stripped).toContain('isDesktop ? null : extractInlineQuestionRows(');
  });

  it('設問一覧の省略もスマホのときだけ（!isDesktop と AND されている）', () => {
    const stripped = stripComments(QUIZ);
    expect(stripped).toContain('!isDesktop && isSubQuestionListRedundant(currentQuestion)');
  });

  it('★判定を科目で決め打ちしていない★（isMathChapter 等で分岐していない）', () => {
    // ご注意(9)「コードで形式的に作ると問題によっておかしくなる」への対応。
    // 横並び・一覧省略の判定に科目名や単元フラグを使っていないことを固定する。
    const stripped = stripComments(QUIZ);
    const inlineDecl = stripped.match(/const inlineQuestionRows[\s\S]{0,400}?\]\);/u)?.[0] ?? '';
    expect(inlineDecl).not.toBe('');
    for (const forbidden of ['isMathChapter', 'requiresMathPalette', '数学', 'math']) {
      expect(inlineDecl).not.toContain(forbidden);
    }
  });

  it('横並びは grid ではなく flex-wrap（長い項目が来ても折り返すだけ）', () => {
    // grid は列幅を固定するため、判定をすり抜けた長い数式がはみ出す。
    // flex-wrap + basis-[calc(50%-0.25rem)] なら折り返しで済む。
    expect(QUIZ).toContain('<ul className="flex flex-wrap gap-x-2 gap-y-1.5">');
    expect(QUIZ).toContain('basis-[calc(50%-0.25rem)]');
  });

  it('横並びの各項目に min-w-0 があり、長い数式でも折り返せる', () => {
    // min-w-0 が無いと flex 子要素は縮まず、横にはみ出して文字が切れる。
    expect(QUIZ).toContain('flex min-w-0 grow basis-[calc(50%-0.25rem)] items-baseline gap-1');
  });

  it('横並びでもリード文は残る（情報を消さない）', () => {
    const stripped = stripComments(QUIZ);
    expect(stripped).toContain('inlineQuestionRows.lead &&');
  });

  it('条件を満たさない問題は従来の ExplanationBody にフォールバックする', () => {
    const stripped = stripComments(QUIZ);
    // 三項演算子の else 側に、元の描画がそのまま残っていること。
    expect(stripped).toMatch(/inlineQuestionRows \?[\s\S]*?<ExplanationBody[\s\S]*?cleanQuestionText\(currentQuestion\.text\)/u);
  });
});

describe('L8: 解説画面も演習画面と同じ小問横並びにする（ご要望8／スマホのみ）', () => {
  /**
   * なぜ Quiz.tsx とは別に固定するのか。
   *
   * 実測でわかったこと：
   *   同じ「(1)〜(4) が縦積みで (4) が画面外に切れる」不具合が、
   *   演習画面（Quiz.tsx）と解説画面（Explanation.tsx）の *両方* にあった。
   *   Quiz.tsx だけ直して完了にすると、ユーザーが写真を撮った
   *   解説画面は直っていない、という状態になる（実際に一度そうなった）。
   *   そこで「両画面が同じ判定関数を使っていること」をテストで縛る。
   */
  it('解説画面も同じ extractInlineQuestionRows を使う（判定ロジックを二重に書かない）', () => {
    // import 文は transpile で整形されるため、生ソースに対して確認する。
    expect(EXPL).toMatch(/import \{[^}]*extractInlineQuestionRows[^}]*\} from '\.\.\/utils\/questionDisplay'/u);
    // 呼び出し側（実コード）はコメントを除いた状態で確認する。
    expect(stripComments(EXPL)).toContain('extractInlineQuestionRows(cleanQuestionText(question.text))');
  });

  it('解説画面の横並びもスマホのときだけ（reorderMobile が false なら null）', () => {
    // reorderMobile = isMobile && !isResultView。PC では必ず null になり、
    // 従来の ExplanationBody（縦積み）を通る＝PCの見た目は不変。
    const stripped = stripComments(EXPL);
    expect(stripped).toMatch(/const inline = reorderMobile\s*\?\s*extractInlineQuestionRows\(/u);
    expect(stripped).toMatch(/const inline = reorderMobile[\s\S]{0,120}?:\s*null;/u);
  });

  it('解説画面の判定にも科目の決め打ちが無い', () => {
    const stripped = stripComments(EXPL);
    const decl = stripped.match(/const inline = reorderMobile[\s\S]{0,200}?null;/u)?.[0] ?? '';
    expect(decl).not.toBe('');
    for (const forbidden of ['isMathChapter', 'requiresMathPalette', '数学']) {
      expect(decl).not.toContain(forbidden);
    }
  });

  it('解説画面の横並びも grid ではなく flex-wrap＋min-w-0', () => {
    expect(EXPL).toContain('<ul className="flex flex-wrap gap-x-2 gap-y-1.5">');
    expect(EXPL).toContain('flex min-w-0 grow basis-[calc(50%-0.25rem)] items-baseline gap-1');
  });

  it('条件を満たさない問題は従来の ExplanationBody にフォールバックする', () => {
    const stripped = stripComments(EXPL);
    // if (!inline) { return <ExplanationBody .../> } の早期リターンが残っていること。
    expect(stripped).toMatch(/if \(!inline\)[\s\S]{0,260}?<ExplanationBody[\s\S]{0,160}?cleanQuestionText\(question\.text\)/u);
  });

  it('解説画面でもリード文は消えない', () => {
    expect(stripComments(EXPL)).toContain('inline.lead &&');
  });
});

describe('L9: 問題文と解説のフォントを一致させる（ご要望8／スマホのみ）', () => {
  /**
   * ★実測に基づく回帰テスト★
   *
   * 直す前（スマホ 390x664・数学 m1_1[0]）：
   *   問題文 font-size 16.95px / line-height 34.75px
   *   解説   font-size 18.08px / line-height 37.06px
   *
   * 原因は .math-content（src/index.css）が
   *   .math-content { font-size: 1.13em; line-height: 2.05; }
   * という「@layer に入っていない素の CSS」であること。
   * Tailwind の text-sm は @layer utilities なので詳細度で負け、
   * 解説側に書いてあった `text-sm md:text-base` は効いていなかった。
   * つまり実サイズは常に「親の font-size × 1.13」で、
   *   問題文 … 親ペインが text-[15px] → 16.95px
   *   解説   … 親が既定の 16px       → 18.08px
   * とずれていた。
   *
   * したがって「同じ要素に text-[15px] を足す」直し方では直らない
   * （実測で 18.08px のまま変わらなかった）。
   * *親* の基準サイズをそろえる必要がある。この構造をテストで固定する。
   */
  it('★同じ要素へのサイズ指定では直らないので、基準は親側に置く★', () => {
    const stripped = stripComments(EXPL);
    // 解説本文そのものの className は、スマホではサイズを指定しない（親から継承）。
    expect(stripped).toMatch(/const explBodyFontClass = `\$\{BODY_FONT_FAMILY\} \$\{reorderMobile \? '' : DESKTOP_BODY_FONT\}`/u);
    // 基準サイズは「包む側」に付けるための別トークンとして存在する。
    expect(stripped).toContain("const explBodyBaseClass = reorderMobile ? MOBILE_BODY_BASE : '';");
  });

  it('スマホの基準サイズは問題文ペインとまったく同じ文字列である', () => {
    const stripped = stripComments(EXPL);
    // 問題文ペイン側（max-h-[34dvh] のスクロール容器）と同一でなければ、
    // どちらかを変えたときに再びずれる。
    expect(stripped).toContain("const MOBILE_BODY_BASE = 'text-[15px] leading-[1.85]';");
    expect(stripped).toContain('max-h-[34dvh] overflow-y-auto overscroll-contain p-3 text-[15px] leading-[1.85]');
  });

  it('フォント指定が1か所に集約され、同じ長い文字列が重複していない', () => {
    const stripped = stripComments(EXPL);
    // 修正前は同一の長い三項演算子が2か所にコピーされており、
    // 片方だけ直す事故が起きやすかった。
    const dup = stripped.split("isMathChapter ? 'font-math math-content text-sm md:text-base'").length - 1;
    expect(dup).toBe(0);
    // 集約先が2か所（小問ごとの解説・大問共通の解説）から参照されている。
    const uses = stripped.split('${explBodyFontClass}').length - 1;
    expect(uses).toBeGreaterThanOrEqual(2);
  });

  it('「正解／あなたの解答」欄も同じ基準にそろえる（同じ数式を出す場所）', () => {
    const stripped = stripComments(EXPL);
    expect(stripped).toContain("const answerBoxBaseClass = reorderMobile ? MOBILE_BODY_BASE : '';");
    expect(stripped).toContain('${answerBoxBaseClass}');
  });

  it('★PCの見た目は不変★（DESKTOP_BODY_FONT が従来の指定のまま）', () => {
    const stripped = stripComments(EXPL);
    // 従来 PC は 数学: text-sm md:text-base / 非数学: text-xs md:text-sm だった。
    expect(stripped).toContain("const DESKTOP_BODY_FONT = isMathChapter ? 'text-sm md:text-base leading-relaxed' : 'text-xs md:text-sm leading-relaxed';");
    // スマホ専用の基準サイズが PC 分岐に混ざっていないこと。
    expect(stripped).not.toMatch(/DESKTOP_BODY_FONT[^\n]*text-\[15px\]/u);
  });

  it('フォント系（font-math / font-handwriting）の切り替えも1か所', () => {
    const stripped = stripComments(EXPL);
    expect(stripped).toContain("const BODY_FONT_FAMILY = isMathChapter ? 'font-math math-content' : 'font-handwriting';");
  });

  /**
   * ★★ ここから下は「全問スイープで取りこぼしを見つけた」ぶんの追加 ★★
   *
   * ご要望9「全ての問題で適応できているかしっかりと確認すること」に従って
   * 162 問を Playwright で横断計測したところ、*テストではなく検証手順の側*に
   * 重大な穴が見つかった。記録として残す。
   *
   * ■ 穴1：小問が1問だけの問題（実測10問。c4_1[0] / a1_1[0] / c5_2[1] など）
   *   これらは小問パネルが最初から開いた状態で解説画面に入る。
   *   検証スクリプトが「まず正誤チップを押す」実装だったため、
   *   *開いているパネルを閉じてしまい*、解説本文が DOM から消えていた。
   *   その結果フォント一致の判定が測定不能のまま「合格」と出ていた（偽合格）。
   *
   * ■ 穴2：もっと広い取りこぼし
   *   問題文コンテナの className は Explanation.tsx L1462 のスマホ分岐で
   *     非数学 : "text-gray-800"                       ← font-* が付かない
   *     数学   : "font-math math-content text-gray-800"
   *   となる。非数学では書体はカード最上位から *継承* されるので、
   *   要素自身には font-handwriting が書かれていない。
   *   検証側が font-* 必須のセレクタで問題文を探していたため、
   *   化学基礎・生物基礎・リスニングでは判定がまるごと素通りしており、
   *   実際に効いていたのは数学だけだった。
   *
   * ■ 直した後の実測（390x664・162問すべて）
   *   数学        : 問題文 16.95px / 解説 16.95px（STIX Two Math）
   *   それ以外    : 問題文 15px    / 解説 15px   （Yomogi）
   *   書体・行送りも一致。
   *
   * 下の2件は、この構造（＝継承で書体がそろう前提）が崩れたら気付けるようにする。
   */
  it('★スマホの問題文コンテナは書体を継承する形のままにする★', () => {
    const stripped = stripComments(EXPL);
    /*
     * スマホ分岐が '' （枠なし・サイズ指定なし）であることが、
     * 「親ペインの text-[15px] と、カード由来の書体をそのまま継承する」
     * という今の一致条件そのもの。
     * ここに独自のサイズや書体を足すと、解説側とずれて元の不具合に戻る。
     */
    expect(stripped).toMatch(/\$\{reorderMobile\s*\?\s*''\s*:\s*'p-4 rounded-lg border text-sm md:text-base leading-relaxed'\}\$\{mathBodyClass\}/u);
    // 数学だけ .math-content を足す形（非数学は空文字＝継承のまま）を維持する。
    expect(stripped).toContain("const mathBodyClass = isMathChapter ? ' font-math math-content' : '';");
  });

  it('★書体トークンは問題文と解説で同じ源から来る★（ご要望「フォントが違う」対策）', () => {
    const stripped = stripComments(EXPL);
    /*
     * 問題文側は mathBodyClass、解説側は BODY_FONT_FAMILY を使うが、
     * どちらも同じ isMathChapter から算出され、数学のときは同じ
     * 'font-math math-content' になる。
     * 非数学のときは両方とも書体を指定せず（問題文）／
     * font-handwriting（解説）で、カードの既定書体と一致する。
     * この2つが別々の条件で分岐し始めると書体がずれるので固定する。
     */
    expect(stripped).toMatch(/const mathBodyClass = isMathChapter \?/u);
    expect(stripped).toMatch(/const BODY_FONT_FAMILY = isMathChapter \?/u);
    // 章単位の判定は1か所だけ（問題ごとに別ロジックを作らない）。
    const decl = stripped.split('const isMathChapter =').length - 1;
    expect(decl).toBe(1);
  });
});

/**
 * =====================================================================
 * L10. リスニング解説の再配置と「コンパクト化（消さない）」
 * =====================================================================
 * ご要望（原文・8）：
 *   > 他にもリスニングの解説も音源は問題みたいに上の端に寄せて。
 *   > 音源のボタンと問題が上。下は合ってるか間違ってるかとスクリプトを載せて、
 *   > 解説は問1のボタンを押すと出てくる感じで。
 *   > 採点結果みたいなところと正解不正解とかこの単元の思考の型とかも
 *   > 無くすのではなくて、小さくコンパクトにする。
 *   > ☑️採点結果の右に、正解・不正解・未解答・フローチャートのボタンを持ってくる。
 *   > パソコン版は何も変更しないでね。スマホの話ね。
 *
 * ■ 実測で分かっていたこと（390x664 / el1_A[0]）
 *   ・上下のプレーヤーを入れ替えただけでは足りなかった。
 *     panel/review プレーヤーは
 *       ヘッドホンバッジ＋見出し＋サブ文＋速度＋各問ボタン＋もう1回
 *       ＋スクリプト＋「◯◯を2回続けて」
 *     で約430px あり、採点結果 top=377 のまま、
 *     問1チップ top=746・思考の型は画面外だった。
 *   ・compact 化後：問1チップ top=539（画面内）、溢れ 0。
 *
 * ■ このテストが固定する不変条件
 *   1. 上（問題文ペイン）は inline＝再生ボタンだけ、下は panel＝スクリプト付き。
 *      この役割は「スマホのときだけ」入れ替わる（PC は従来の向き）。
 *   2. compact でもスクリプトは絶対に残す（ご要望は「小さく」であって「無く」ではない）。
 *   3. compact はスマホ限定で、PC には渡らない。
 *   4. 採点結果の行に 正解／不正解／未解答／フローチャート が全部そろっている。
 *   5. 「この単元の思考の型」は消さず、見出しを保ったまま縮める。
 */
describe('L10. リスニング解説の再配置と、消さないコンパクト化', () => {
  const PLAYER = read('src/components/ListeningAudioPlayer.tsx');

  it('スマホでは上が inline（ボタンのみ）／下が panel（スクリプト付き）に入れ替わる', () => {
    const stripped = stripComments(EXPL);
    // 上（問題文ペイン側）：スマホ = practice + inline + horizontal
    expect(stripped).toContain("mode={reorderMobile ? 'practice' : 'review'}");
    expect(stripped).toContain("variant={reorderMobile ? 'inline' : 'panel'}");
    expect(stripped).toContain("orientation={reorderMobile ? 'horizontal' : 'vertical'}");
    // 下（採点結果側）：スマホ = review + panel（スクリプトを読む側）
    expect(stripped).toContain("mode={reorderMobile ? 'review' : 'practice'}");
    expect(stripped).toContain("variant={reorderMobile ? 'panel' : 'inline'}");
  });

  it('★compact はスマホ限定★（PC には渡らない）', () => {
    const stripped = stripComments(EXPL);
    expect(stripped).toContain('compact={reorderMobile}');
    // compact を無条件に渡していない（PC に漏れると見た目が変わる）
    expect(stripped).not.toMatch(/compact=\{true\}/u);
    expect(stripped).not.toMatch(/compact\s+/u);
  });

  it('compact は panel 限定の装飾で、inline には影響しない', () => {
    const stripped = stripComments(PLAYER);
    expect(stripped).toContain('const isCompact = compact && !isInline;');
  });

  it('★compact でもスクリプトは消えない★（ご要望は「小さく」＝残す）', () => {
    const stripped = stripComments(PLAYER);
    // スクリプト開閉ボタンの出現条件は isReview のみ（isCompact で消していない）
    expect(stripped).not.toMatch(/isReview\s*&&\s*!isCompact/u);
    // スクリプト本体（和訳・押さえたい表現）も従来どおり isReview && openScriptId
    expect(stripped).toContain('isReview &&');
    expect(stripped).toContain('openScriptId');
    // 「もう1回」「◯◯を2回続けて」は高さ優先で compact のときだけ省く
    expect(stripped).toContain('{!isCompact && (');
    expect(stripped).toContain('{!isCompact && readCount === 2 && list.length > 0 && (');
  });

  it('★PCの panel クラス文字列は従来のまま★（compact 分岐が非 compact 側を汚さない）', () => {
    const stripped = stripComments(PLAYER);
    // 変更前：`rounded-2xl border-2 p-3 sm:p-4 shadow-sm ...`
    // 三項に切り出しても、compact でない側は同じ並びで再現されている必要がある。
    expect(stripped).toContain("isCompact ? 'p-2' : 'p-3 sm:p-4'");
    expect(stripped).toMatch(/rounded-2xl border-2 \$\{[\s\S]*?\} shadow-sm/u);
    // 非 compact の各問ボタンも従来の指定を保つ
    expect(stripped).toContain("'min-h-[3rem] w-full gap-2 rounded-xl border-2 px-2.5 py-2 text-left'");
  });

  it('採点結果の右に 正解・不正解・未解答・フローチャート がそろっている', () => {
    const stripped = stripComments(EXPL);
    expect(stripped).toContain('正解 {correctSqs.length}');
    expect(stripped).toContain('不正解 {incorrectSqs.length}');
    expect(stripped).toContain('未解答 {unansweredSqs.length}');
    expect(stripped).toContain('フローチャート');
    // 同一の flex 行に収める（justify-between で左＝見出し／右＝内訳）
    expect(stripped).toMatch(/flex items-center justify-between gap-2 \$\{reorderMobile \? '' : 'flex-wrap'\}/u);
  });

  it('採点結果はスマホだけ縮み、PC の指定は元のまま', () => {
    const stripped = stripComments(EXPL);
    // スマホ：13px 見出し／10px 内訳。PC：サイズ指定なし（既定 16px）＋ text-xs。
    expect(stripped).toContain("reorderMobile ? 'min-w-0 gap-1.5 text-[13px]' : 'gap-2'");
    expect(stripped).toContain("reorderMobile ? 'whitespace-nowrap text-[10px]' : 'text-xs'");
    // PC 側の分岐にスマホ用サイズが混ざっていない
    expect(stripped).not.toMatch(/: 'gap-2 text-\[13px\]'/u);
  });

  it('★「この単元の思考の型」は消さずに縮める★', () => {
    const stripped = stripComments(EXPL);
    // 見出しそのものは残る
    expect(stripped).toContain('<span>この単元の思考の型</span>');
    // 縮めるのはスマホ（1問表示）のときだけ
    expect(stripped).toContain('const kataCompact = isMobile && singleQuestionIndex !== undefined;');
    // 副題と「開く／閉じる」の文字は compact のときだけ隠す（要素自体は残す）
    expect(stripped).toContain('{!kataCompact && (');
    expect(stripped).toContain("{!kataCompact && <span>{kataOpen ? '閉じる' : '開く'}</span>}");
    // PC 側の padding 指定は従来のまま
    expect(stripped).toContain("'gap-3 px-3 py-2.5 md:px-4 md:py-3'");
  });

  it('リスニングの問題文（選択肢①〜④を含む）を解説側で削っていない', () => {
    const stripped = stripComments(EXPL);
    // 実測：選択肢 ①〜④ は question.text の中にしか無い。
    // buildListeningLeadText などで短縮すると答えを見返せなくなるため、
    // 解説画面では問題文を丸ごと出す（cleanQuestionText のみ）。
    expect(stripped).toContain('cleanQuestionText(question.text)');
    expect(stripped).not.toContain('buildListeningLeadText');
  });

  /**
   * ★全問スイープで「不具合っぽく見えたが正しい挙動」だったもの★
   *
   * 162問の横断計測で7問（c5_2[2] c5_4[2] c5_4[6] c6_2[0] c6_2[1] c6_2[2]
   * a3_1[3]）が「採点結果が無い」と出た。調べると
   *   ・これらは小問がすべて記述式（type === 'descriptive'）で客観小問が0問
   *   ・画面自体は解説に到達しており、各小問の「解説」ボタンは並んでいる
   *     （c6_2[0] は実測で「解説」11個）
   * つまり「丸つけできる小問が無いので採点結果を出さず、
   * 代わりに『この単元の思考の型』を見せる」という *意図した* 分岐だった。
   *
   * ご要望9「問題によって問題文の長さが違うから、コードで形式的に作ると
   * 問題によっておかしくなる可能性があるから注意ね」に照らして、
   * 「採点結果を必ず出す」ような形式的な作りに変えてしまわないよう固定する。
   */
  it('★客観小問が0問の問題では採点結果を出さず、思考の型を必ず1回出す★', () => {
    const stripped = stripComments(EXPL);
    // 採点結果は客観小問があるときだけ
    expect(stripped).toContain('{objectiveSqs.length > 0 && (');
    // 客観小問が0問でも思考の型は落とさない（記述のみの問題の学習導線）
    expect(stripped).toContain('{qIndex === 0 && objectiveSqs.length === 0 && kataAccordion && (');
    /*
     * 記述式の除外条件は1か所だけ（問題ごとに別ロジックを作らない）。
     * ★ここは RAW ソースに対して見る★
     *   stripComments は TypeScript のトランスパイラなので型注釈が消え、
     *   `(sq: any) =>` は `(sq) =>` に変わる。
     *   型付きの形を確かめたいので stripped ではなく元のソースを使う。
     */
    expect(EXPL).toContain("question.subQuestions.filter((sq: any) => sq.type !== 'descriptive')");
    const decl = EXPL.split("const objectiveSqs =").length - 1;
    expect(decl).toBe(1);
    // 「採点結果を常に描く」形に戻っていないこと
    expect(stripped).not.toMatch(/\{objectiveSqs\.length >= 0 && \(/u);
  });
});
