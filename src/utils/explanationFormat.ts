/**
 * ===================================================================
 * 解答・解説の統一フォーマット・エンジン
 * ===================================================================
 *
 * ■ 目的
 * アプリ内すべての問題の「解答・解説」を、次の3つの要件を満たす形に
 * 機械的かつ確実に整形する。手作業の書き換えでは必ず抜け漏れが出るため、
 * 「データ ＋ 単元別の指導テンプレート」から自動生成する方式を採る。
 *
 *   1. 解答の超・強調表示（視認性MAX）
 *      → ピンクの蛍光ペン＋太字。0.1秒で解答を発見できる。
 *      → 蛍光ペンは「文字全体の塗りつぶし」ではなく、まとめプリントと同じ
 *        ★文字の下だけに引くアンダーライン型★（下 40% のグラデーション）にする。
 *      → ★黄色は使用禁止★（フローチャート／ロジックツリーの強調色と衝突するため）
 *         このため、既存解説中の <u> タグ（textFormatter が黄色マーカーへ変換する）は
 *         問題解説に限り「黒い波線」のキーワード強調（KEY）へ置き換える。
 *
 *   2. 解説のプロセス化・体系化（記号の厳格な使い分け）
 *      → 思考手順は必ず ①②③…（丸数字）。各ステップは
 *        「太字の見出し ＋ 理由・着眼点のサブ説明」の2段構成。
 *      → 「STEP」はフローチャート／ロジックツリーの箇所を参照するときのみ使用する。
 *         このエンジンは思考手順に STEP を一切出力しない。
 *
 *   3. 「共通テスト出題傾向」特設ボックス
 *      → 解説の末尾に、視覚的に明確に区別されたボックスを設置する。
 *      → アプリ内の出題傾向データ（trendData.ts）と実際のセンター／共通テストの
 *        傾向を突き合わせた、単元別の分析を載せる（実際の問題文は掲載しない）。
 *
 * ■ なぜ Markdown の引用（>）ではなく <div> なのか
 * このアプリの本文レンダラ（utils/textFormatter.tsx）は Markdown を解釈せず、
 * HTML タグのみをそのまま通す。`>` は文字として表示されてしまうため、
 * 同等以上に「明確にデザインを変えた枠」を inline style の <div> で実現する。
 *
 * ■ 配色を inline style で明示する理由
 * 解説は練習モードではダークテーマ（#0B132B 系）、小テストではライトテーマの
 * 上に描画される。背景色だけ指定して文字色を指定しないと、
 * ダークテーマ側で「白文字 × 薄ピンク背景」となり判読不能になる。
 * そのため、すべてのマーカー／ボックスで文字色を必ず固定する。
 */

// -------------------------------------------------------------------
// 基本パーツ
// -------------------------------------------------------------------

/**
 * 解答マーカー（ピンクの蛍光ペン）。
 *
 * 以前は文字全体を塗りつぶす背景色だったが、まとめプリントの黄色マーカーと同じ
 * 「文字の下だけに引くアンダーライン型」に変更した。
 * 文字の下 40% にだけグラデーションを敷くので、文字そのものは読みやすいまま残る。
 * 文字色は指定しない（＝テーマの文字色を継承する）。ダークテーマでは明るい文字、
 * ライトテーマでは濃い文字のまま、下線だけがピンクに光る。
 */
export const ANS_STYLE =
  'background-image:linear-gradient(to top, rgba(233,104,142,0.85) 0%, rgba(244,169,196,0.75) 55%, rgba(244,169,196,0) 100%); background-repeat:no-repeat; background-size:100% 40%; background-position:0 100%; font-weight:bold; padding:0 3px 1px; border-radius:2px;';

export const ANS = (text: string): string =>
  `<span style="${ANS_STYLE}">${text}</span>`;

/**
 * キーワード強調。
 *
 * 以前はオレンジの塗りつぶしだったが、「大事な要素の下に黒い波線を引く」形に変更。
 * 色は currentColor（＝本文の文字色）にしてある。ダークテーマ（練習モード）では
 * 明るい波線、ライトテーマ（小テスト）では黒に近い波線になり、どちらでも必ず見える。
 */
export const KEY_STYLE =
  'font-weight:bold; -webkit-text-decoration:underline wavy currentColor; text-decoration:underline wavy currentColor; text-decoration-thickness:1.5px; text-underline-offset:5px; text-decoration-skip-ink:none;';

export const KEY = (text: string): string =>
  `<span style="${KEY_STYLE}">${text}</span>`;

/** 見出しラベル（枠線のみ・地味め）。セクションの切れ目を作る。 */
export const LABEL = (text: string): string =>
  `<span style="display:inline-block; border:1.5px solid #D9466E; color:#D9466E; background-color:#FFF1F5; font-weight:bold; font-size:0.86em; padding:1px 10px; border-radius:999px;">${text}</span>`;

/** 「共通テスト出題傾向」特設ボックスの外枠 */
export const BOX = (body: string): string =>
  `<div style="background-color:#FFF4E5; border:2px solid #FB8C00; border-left:9px solid #FB8C00; border-radius:10px; padding:10px 14px; margin-top:14px; color:#3E2723;">${body}</div>`;

/** 丸数字（①〜⑮）。思考手順の番号に使う。 */
const CIRCLED = ['①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧', '⑨', '⑩', '⑪', '⑫', '⑬', '⑭', '⑮'];

/** n 番目（0始まり）の丸数字。範囲外は (n+1) で代用する。 */
export function circledNumber(index: number): string {
  return CIRCLED[index] || `(${index + 1})`;
}

// -------------------------------------------------------------------
// 型
// -------------------------------------------------------------------

/** 思考手順の1ステップ */
export interface ThinkingStep {
  /** ステップの見出し（「〇〇を確認する」のように動詞で終える） */
  title: string;
  /** なぜそう考えるのか・着眼点の短い説明 */
  detail: string;
}

/** 単元別の「共通テスト出題傾向」ボックスの中身 */
export interface TrendInsight {
  /** 出典（例：「2021年 共通テスト 本試験 第1問 問5」） */
  sources: string[];
  /** 過去問で実際に問われた要素 */
  asked: string[];
  /** 頻出のひっかけ */
  traps: string[];
  /** 問題と傾向をリンクさせた実践的アドバイス */
  advice: string;
}

/** 単元（章）ごとの指導テンプレート */
export interface UnitTeaching {
  /** この単元の問題を解くときの標準的な思考手順 */
  steps: ThinkingStep[];
  /** 出題傾向ボックスの内容 */
  trend: TrendInsight;
}

// -------------------------------------------------------------------
// 単位変換（まとめプリントの「単位変換の図」）
// -------------------------------------------------------------------

/**
 * 単位変換の1ホップ（図の矢印1本ぶん）。
 *
 * 「単位変換の図」では、mol をハブにして
 *   個数 ←（÷ / × 6.0×10²³）→ mol ←（÷ / × M）→ 質量[g]
 *                              mol ←（÷ / × 22.4）→ 標準状態の体積[L]
 * という橋が架かっている。その1本を表す。
 */
export interface ConversionHop {
  /** 矢印に書く換算（例：「÷ 44 g/mol」「× 22.4 L/mol」「× 2（係数比）」） */
  arrow: string;
  /** 変換後に到達する単位（例：「mol」「L」「g」「個」） */
  to: string;
}

/**
 * 1問ぶんの「単位変換による解き方」。
 *
 * 物質量（mol）がからむ計算問題は、公式の暗記ではなく
 * 「スタートの単位 → mol → ゴールの単位」という一本道の乗り換えで必ず解ける。
 * その道順をデータとして持ち、解説の先頭に図と同じ形で提示する。
 */
export interface UnitConversionWalk {
  /** スタートの量（例：「88 g（二酸化炭素の質量）」） */
  start: string;
  /** スタートの単位（ルート図の左端。例：「g」） */
  startUnit: string;
  /** ゴール（例：「標準状態の体積 [L]」） */
  goal: string;
  /** mol を経由してゴールへ向かう矢印の並び */
  route: ConversionHop[];
  /** ①②③ の思考手順（見出し＋理由・着眼点の2段構成） */
  steps: ThinkingStep[];
  /** 換算をひと続きに書いた式（省略可） */
  oneLine?: string[];
  /** 単位の約分などによる検算コメント（省略可） */
  check?: string;
}

/** 整形に必要な小問の最小形 */
interface SubQuestionLike {
  id?: string;
  label?: string;
  type?: string;
  correctAnswer?: string;
  detailedExplanation?: { steps?: string[]; theme?: string } | null;
}

/** 整形に必要な問題の最小形 */
interface QuestionLike {
  id?: string;
  explanation?: string;
  subQuestions?: SubQuestionLike[];
}

// -------------------------------------------------------------------
// セクション生成
// -------------------------------------------------------------------

/** すでにこのエンジンで整形済みか（二重適用の防止） */
const ENHANCED_MARK = '<!--fmt-v1-->';

export function isEnhanced(explanation: unknown): boolean {
  return typeof explanation === 'string' && explanation.includes(ENHANCED_MARK);
}

/**
 * 【解答】ブロックを組み立てる。
 *
 * 解答の値は問題データ（subQuestions[].correctAnswer）そのものを使うため、
 * 文章から解答を推測することによる取り違えが原理的に起こらない。
 * 自由記述（descriptive）は「解答例」と明示する。
 */
export function buildAnswerBlock(question: QuestionLike): string {
  const subs = (question.subQuestions || []).filter((s) => s && s.correctAnswer);
  if (subs.length === 0) return '';

  const lines = subs.map((sub) => {
    const label = (sub.label || '').trim();
    const answer = String(sub.correctAnswer).trim();
    const isFree = sub.type === 'descriptive';
    const head = label ? `${label}　` : '';
    return `${head}${ANS(`${isFree ? '【解答例】' : '【解答】'}${answer}`)}`;
  });

  return `${LABEL('解 答')}\n${lines.join('\n')}`;
}

/**
 * 「単位変換で解く」ブロックを組み立てる。
 *
 * ■ なぜ専用ブロックにするのか
 * 物質量（mol）の計算は、公式を4つも5つも覚えると必ずどれかを取り違える。
 * まとめプリントの「単位変換の図」は、mol をハブにした乗り換え路線図として
 *   ・mol へ向かうときは ÷（割る）
 *   ・mol から離れるときは ×（掛ける）
 * という2つのルールだけで全問を貫く。この考え方を、解答の直後・詳しい解説の前に
 * 必ず同じ形で提示することで、生徒が毎回同じ手順を再現できるようにする。
 *
 * ■ 構成
 *   1. 変換ルート（［スタート単位］→ ［mol］→ ［ゴール単位］の一本道）
 *   2. ①②③ の思考手順（各ホップの理由つき）
 *   3. ひと続きの換算式（単位が約分されてゴールの単位だけが残ることを見せる）
 *   4. 検算コメント
 */
export function buildUnitConversionBlock(walk: UnitConversionWalk): string {
  const rows: string[] = [];

  rows.push(LABEL('単位変換で解く'));
  rows.push(
    `まとめプリントの${KEY('単位変換の図')}のとおり、${KEY('まず mol に直す')}→${KEY('次に求めたい単位へ変換する')}の一本道で解きます。`,
  );

  // --- 1. 変換ルート（路線図） ---
  const stations = [`［${walk.startUnit}］`, ...walk.route.map((hop) => `［${hop.to}］`)];
  const arrows = walk.route.map((hop) => hop.arrow);
  const routeLine = stations
    .map((station, index) => (index === 0 ? station : `─（${arrows[index - 1]}）→ ${station}`))
    .join(' ');
  rows.push('');
  rows.push(`<b>■ 変換ルート</b>`);
  rows.push(`　${routeLine}`);
  rows.push(`　スタート：${walk.start}　／　ゴール：${walk.goal}`);

  // --- 2. ①②③ の思考手順 ---
  if (walk.steps.length > 0) {
    rows.push('');
    rows.push('<b>■ ルートのたどり方</b>');
    walk.steps.forEach((step, index) => {
      rows.push(`<b>${circledNumber(index)} ${step.title}</b>`);
      if (step.detail) rows.push(`　└ ${step.detail}`);
    });
  }

  // --- 3. ひと続きの換算式 ---
  if (walk.oneLine && walk.oneLine.length > 0) {
    rows.push('');
    rows.push('<b>■ 一気に書くとこの1行</b>');
    walk.oneLine.forEach((line) => rows.push(`　${line}`));
  }

  // --- 4. 検算 ---
  if (walk.check) {
    rows.push('');
    rows.push(`<b>■ 単位で検算</b>`);
    rows.push(`　${walk.check}`);
  }

  return rows.join('\n');
}

/**
 * 思考手順（①②③）ブロックを組み立てる。
 *
 * 優先順位:
 *   ① 小問ごとに用意された detailedExplanation.steps（問題固有・最も具体的）
 *   ② 単元共通の思考手順テンプレート（unitTeaching.steps）
 * のうち、①があればそれを主、なければ②を使う。
 * ①がある場合でも、単元の型を意識させるため②を「この単元の型」として併記する。
 */
/**
 * 1ステップの文字列を「見出し」と「理由・着眼点」の2段に分ける。
 *
 * フォーマット要件2 は思考手順を
 *   ・太字のステップ見出し
 *   ・その下に理由／着眼点のサブ説明
 * の2段構成にすることを求めている。元データが
 *   「◯◯する：△△だから」「◯◯する。△△に注意」「◯◯する（△△のため）」
 * のように書かれている場合は、機械的に安全に分割できる。
 * 分割できない短い一文はそのまま見出しだけにする
 * （無内容なサブ説明を自動生成して水増しすると、かえって質が落ちるため）。
 */
function splitStepDetail(text: string): { head: string; detail: string } {
  const source = text.trim();

  // ① 「：」区切り（例：「価数を確認する：H₂SO₄は2価」）
  const colon = source.match(/^([^：:]{4,40})[：:]\s*(.+)$/s);
  if (colon && colon[2].trim().length >= 4) {
    return { head: colon[1].trim(), detail: colon[2].trim() };
  }

  // ② 「。」区切り（1文目を見出し、残りを説明に）
  const period = source.match(/^([^。]{4,40})。\s*(.+)$/s);
  if (period && period[2].trim().length >= 4) {
    return { head: period[1].trim(), detail: period[2].trim().replace(/。$/, '') };
  }

  // ③ 末尾の丸括弧を補足とみなす（例：「両辺の H を合わせる（H⁺ を8個加える）」）
  const paren = source.match(/^(.{4,40}?)\s*（([^（）]{6,})）\s*$/s);
  if (paren) {
    return { head: paren[1].trim(), detail: paren[2].trim() };
  }

  return { head: source, detail: '' };
}

export function buildStepsBlock(
  question: QuestionLike,
  teaching?: UnitTeaching,
  /** 上位で既に問題固有の思考手順（単位変換ブロック等）を出しているか */
  hasSpecificSteps = false,
): string {
  const parts: string[] = [];

  // --- ① 小問固有の思考手順 ---
  const detailed = (question.subQuestions || []).filter(
    (s) => s?.detailedExplanation?.steps && s.detailedExplanation.steps.length > 0,
  );

  if (detailed.length > 0) {
    const blocks = detailed.map((sub) => {
      const label = (sub.label || '').trim();
      const theme = sub.detailedExplanation?.theme;
      const heading = `<b>${label || '小問'}</b>${theme ? `　— ${theme}` : ''}`;
      const steps = (sub.detailedExplanation?.steps || []).map((raw, index) => {
        // 元データが「① …」で始まる場合は番号を重複させない
        const text = String(raw).trim();
        const hasCircle = /^[①-⑮]/.test(text);
        const body = hasCircle ? text.replace(/^[①-⑮]\s*/, '') : text;
        // 「見出し＋理由・着眼点」の2段構成にできる書き方なら分割する
        const { head, detail } = splitStepDetail(body);
        const line = `　<b>${circledNumber(index)} ${head}</b>`;
        return detail ? `${line}\n　　└ ${detail}` : line;
      });
      return `${heading}\n${steps.join('\n')}`;
    });
    parts.push(`${LABEL('解法の思考手順')}\n${blocks.join('\n\n')}`);
  }

  // --- ② 単元共通の思考手順テンプレート ---
  if (teaching?.steps?.length) {
    const rows = teaching.steps.map((step, index) => (
      `<b>${circledNumber(index)} ${step.title}</b>\n　└ ${step.detail}`
    ));
    // 問題固有の手順（小問の detailedExplanation／単位変換ブロック）が
    // すでに上にある場合は、こちらは「単元の型」として位置づける。
    const title = detailed.length > 0 || hasSpecificSteps ? 'この単元の思考の型' : '解法の思考手順';
    parts.push(`${LABEL(title)}\n${rows.join('\n')}`);
  }

  return parts.join('\n\n');
}

/**
 * 「共通テスト出題傾向」特設ボックスを組み立てる。
 * 実際の問題文は載せず、出典・問われた要素・ひっかけ・対策のみを記す。
 */
export function buildTrendBox(trend: TrendInsight): string {
  const rows: string[] = [];
  rows.push('<b>💡 【ココが狙われる！共通テスト・センター試験のリアル】</b>');

  if (trend.sources.length > 0) {
    rows.push('');
    rows.push(`<b>■ 出典</b>：${trend.sources.join('／')}`);
  }
  if (trend.asked.length > 0) {
    rows.push('');
    rows.push('<b>■ 過去問では、こういう要素が問われた！</b>');
    trend.asked.forEach((item) => rows.push(`　・${item}`));
  }
  if (trend.traps.length > 0) {
    rows.push('');
    rows.push('<b>■ このパターンのひっかけが多い！</b>');
    trend.traps.forEach((item) => rows.push(`　⚠️ ${item}`));
  }
  if (trend.advice) {
    rows.push('');
    rows.push('<b>■ 実践アドバイス</b>');
    rows.push(`　${trend.advice}`);
  }

  return BOX(rows.join('\n'));
}

// -------------------------------------------------------------------
// 既存解説の整形
// -------------------------------------------------------------------

/**
 * 既存の解説本文を、フォーマット要件に適合するよう整える。
 *
 *  - <u> は textFormatter が「黄色マーカー」に変換する仕様のため、
 *    黄色使用禁止の要件に従いオレンジのキーワード強調へ置換する。
 *  - 行頭の「▼ 解答・解説」のような重複見出しは、
 *    自動生成する【解 答】ラベルと二重になるため取り除く。
 */
export function normalizeLegacyBody(body: string): string {
  return qualifyStepReferences(
    body
      .replace(/<u>([\s\S]*?)<\/u>/g, (_match, inner) => KEY(String(inner)))
      // 「▼ 解答と解説」「▼ 解答・解説」「▼ 解説」など、自動生成する
      // 【解 答】ラベルと二重になる旧見出しを取り除く
      .replace(/^\s*▼\s*(?:解答\s*[・･と]?\s*)?解説\s*\n?/gm, '')
      .trim(),
  );
}

/**
 * 「STEP」はフローチャート（ロジックツリー）の箇所を参照するときだけ使う、という
 * フォーマット要件を満たすための正規化。
 *
 * 本文中に「STEP 1 に戻って…」のように *裸の* STEP 参照があると、
 * 思考手順の番号（①②③）と紛らわしい。直前 30 文字以内に
 * 「フローチャート」「ロジックツリー」が無い STEP 参照には、
 * 明示的に「フローチャートの」を補って、参照先が一目で分かるようにする。
 */
export function qualifyStepReferences(body: string): string {
  return body.replace(/(.{0,30}?)(STEP\s*\d+)/gis, (whole, before: string, step: string) => {
    if (/(?:フローチャート|ロジックツリー)[^。\n<]{0,30}$/.test(before)) return whole;
    return `${before}フローチャートの ${step.replace(/\s+/g, ' ')}`;
  });
}

/**
 * 解説が JSON（ロジックツリー等の構造化データ）かどうか。
 * これらは専用コンポーネントが描画するため、整形の対象外にする。
 */
export function isStructuredExplanation(explanation: string): boolean {
  const head = explanation.trimStart().slice(0, 40);
  return head.startsWith('{') && head.includes('"type"');
}

// -------------------------------------------------------------------
// 総合：1問ぶんの解答・解説を組み立てる
// -------------------------------------------------------------------

/**
 * 1問ぶんの解答・解説を、フォーマット要件を満たす形に再構成する。
 *
 * 構成（上から順に、生徒が見る順序）
 *   1. 【解 答】      … ピンクマーカー。まずここで答え合わせができる
 *   2. 【解法の思考手順】… ①②③。なぜその答えになるのかの筋道
 *   3. 【詳しい解説】  … 既存の解説本文（黄色を排除して継承）
 *   4. 💡 出題傾向ボックス … 単元別の実践分析
 *
 * @param question   問題オブジェクト
 * @param teaching   単元別の指導テンプレート（無い単元は省略可）
 * @returns 整形後の解説文字列（対象外なら元の値をそのまま返す）
 */
/** フローチャート（logic_thought）1ステップぶんの最小形 */
interface FlowchartStepLike {
  step?: string;
  target?: string;
  purpose?: string;
  content?: string;
}

/** 「Step 3」「STEP3」「3」などの表記ゆれから番号だけを取り出す */
function flowchartStepLabel(raw: unknown, index: number): string {
  const text = String(raw ?? '').trim();
  const matched = text.match(/(\d+)/);
  return `STEP ${matched ? matched[1] : index + 1}`;
}

/** タグ混じりの短文を、丸数字の見出しに載せられる素の文にする */
function plainSentence(value: unknown): string {
  return String(value ?? '')
    .replace(/<\/?[a-z][a-z0-9]*[^>]*>/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * フローチャートを持つ問題の思考手順を、フローチャートの各STEPに紐づけて組み立てる。
 *
 * ■ 記号の使い分け（要件どおり）
 *   ・「STEP」… 画面上のフローチャートの箇所を *参照* するときだけ使う
 *   ・「①②③」… 正解に至る思考の順番を示すときに使う
 * この関数は「① フローチャートの STEP 1 で〜を判定する」という形で両者を併用する。
 */
export function buildFlowchartSteps(steps: FlowchartStepLike[]): string {
  const rows = steps
    .map((step, index) => {
      const label = flowchartStepLabel(step?.step, index);
      const target = plainSentence(step?.target);
      const reason = plainSentence(step?.purpose) || plainSentence(step?.content);
      if (!target && !reason) return '';
      const head = target
        ? `フローチャートの ${label} にあるように、${target}を確認する`
        : `フローチャートの ${label} をたどる`;
      return `<b>${circledNumber(index)} ${head}</b>${reason ? `\n　└ ${reason}` : ''}`;
    })
    .filter(Boolean);

  if (rows.length === 0) return '';
  return `${LABEL('解法の思考手順')}\n上のフローチャートを ${flowchartStepLabel(steps[0]?.step, 0)} から順にたどると、次の順番で答えが決まります。\n${rows.join('\n')}`;
}

/**
 * ロジックツリー（logic_thought JSON）の問題向けの「補足ブロック」を組み立てる。
 *
 * これらの問題は explanation 自体がフローチャート描画用の構造化データなので、
 * 文字列を書き換えることができない。そこで【解答】【思考手順】【出題傾向】だけを
 * 別フィールド（explanationSupplement）として用意し、
 * フローチャートの下に並べて表示することで、
 * 全問題が同じフォーマット要件を満たすようにする。
 *
 * この種の問題だけはフローチャートが実在するため、
 * 思考手順の各段階から「STEP n」への参照を張る（要件2の記号の使い分け）。
 */
export function buildSupplement(
  question: QuestionLike,
  teaching?: UnitTeaching,
  flowchartSteps?: FlowchartStepLike[],
): string {
  const sections: string[] = [];

  const answerBlock = buildAnswerBlock(question);
  if (answerBlock) sections.push(answerBlock);

  // フローチャートがあるなら、それを参照する形の思考手順を最優先で置く
  const flowBlock = flowchartSteps?.length ? buildFlowchartSteps(flowchartSteps) : '';
  if (flowBlock) sections.push(flowBlock);

  const stepsBlock = buildStepsBlock(question, teaching);
  if (stepsBlock) {
    // フローチャート由来の手順を出したときは、単元テンプレート側の見出しが
    // 「解法の思考手順」と重複しないよう「この単元の思考の型」に寄せる
    sections.push(
      flowBlock
        ? stepsBlock.replace(LABEL('解法の思考手順'), LABEL('この単元の思考の型'))
        : stepsBlock,
    );
  }

  if (teaching?.trend) sections.push(buildTrendBox(teaching.trend));

  if (sections.length === 0) return '';
  return `${ENHANCED_MARK}${sections.join('\n\n')}`;
}

/**
 * logic_thought JSON から phase1.steps を安全に取り出す。
 * パースできない・形が違う場合は空配列を返す。
 */
export function extractFlowchartSteps(explanation: string): FlowchartStepLike[] {
  try {
    const parsed = JSON.parse(explanation);
    const steps = parsed?.phase1?.steps;
    return Array.isArray(steps) ? steps : [];
  } catch {
    return [];
  }
}

export function enhanceExplanation(
  question: QuestionLike,
  teaching?: UnitTeaching,
  /**
   * 物質量（mol）計算問題のための「単位変換の道順」。
   * 渡された場合は、解答の直後に「単位変換で解く」ブロックを挿入し、
   * 単元共通の思考手順テンプレートより優先して表示する
   * （この問題に固有の、より具体的な手順だから）。
   */
  unitConversion?: UnitConversionWalk,
): string {
  const original = typeof question.explanation === 'string' ? question.explanation : '';

  // 二重適用と、構造化データ（ロジックツリー JSON）は触らない
  if (isEnhanced(original) || (original && isStructuredExplanation(original))) return original;

  const sections: string[] = [];

  const answerBlock = buildAnswerBlock(question);
  if (answerBlock) sections.push(answerBlock);

  // 単位変換で解ける問題は、まず「単位変換の図」の道順を提示する。
  if (unitConversion) sections.push(buildUnitConversionBlock(unitConversion));

  const stepsBlock = buildStepsBlock(question, teaching, Boolean(unitConversion));
  if (stepsBlock) sections.push(stepsBlock);

  const body = normalizeLegacyBody(original);
  if (body) {
    // 解答ブロックを作れた場合のみ「詳しい解説」の見出しを付けて区別する
    sections.push(answerBlock ? `${LABEL('詳しい解説')}\n${body}` : body);
  }

  if (teaching?.trend) sections.push(buildTrendBox(teaching.trend));

  // 何も生成できなかった場合は元のまま返す（情報を失わせない）
  if (sections.length === 0) return original;

  return `${ENHANCED_MARK}${sections.join('\n\n')}`;
}
