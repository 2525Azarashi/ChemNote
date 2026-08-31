/**
 * ===================================================================
 * battleRules — 教科ごとの対戦ルール（既定値）
 * ===================================================================
 *
 * ★このファイルは他の src を一切 import しない（葉モジュール）。★
 * 教科IDの文字列だけを持ち、問題データ本体には触らない。
 * （教科名の表示は画面側が data/subjectLabels.ts から引く）
 *
 * -------------------------------------------------------------------
 * ■ なぜ教科ごとにルールを分けるのか（実測に基づく必然性）
 * -------------------------------------------------------------------
 * 「全教科10問・全問12秒」で統一しようとすると、実データでは成立しない。
 * 対戦に使える小問を数えると次のようになっている。
 *
 *   教科              4択    語句選択  文字パネル   合計
 *   化学基礎          189      645       278       950 (延べ)
 *   英語リスニング    221        0         0       221
 *   生物基礎            1      201       165       202
 *   数学                0      138         0       138
 *   英文法            100        0         0       100
 *   化学（発展）        7       52        10        69
 *   地理               25        0         0        25
 *
 * 地理は25問しか無いので、10問出題を繰り返すとすぐ同じ問題が回ってくる。
 * 数学は4択が0件で、答えが「x^5/5 + C」のような式なので文字パネルにも向かない。
 * リスニングは音声の再生時間そのものが必要なので、他教科と同じ秒数にできない。
 *
 * つまり「教科ごとに違う設定を持てること」は後から便利な機能ではなく、
 * ★無いと成立しない前提★である。
 *
 * -------------------------------------------------------------------
 * ■ 既定値と Firestore の関係
 * -------------------------------------------------------------------
 * 既定値はこのファイルに持つ（＝Firestore を1回も読まずに対戦が始められる）。
 * `battle_rules/{教科ID}` にドキュメントがあればそれを優先する。
 * 運用で「数学だけ問題数を6問にする」といった調整を、
 * アプリを作り直さずに Firebase コンソールからできるようにするため。
 *
 * 読み取り回数はキャッシュで1セッション1回に抑える（data/battleRules 側で実装）。
 */

import type { BattleAnswerFormat, BattleRule } from './types';

/**
 * すべての教科に共通の土台。
 * ここを変えると全教科の既定が変わる。
 */
const BASE: Omit<BattleRule, 'subject'> = {
  enabled: true,
  questionCount: 10,
  timeLimitOverride: null,
  pointsCorrect: 100,
  pointsSpeedMax: 50,
  pointsStreak: 15,
  tiebreak: 'time',
  formats: ['choice4', 'word', 'panel'],
  note: '',
};

/**
 * 教科ごとの既定ルール。
 *
 * ★ここに無い教科は「既定値（BASE）＋enabled:false」として扱う。★
 * 新しい教科のデータを後から追加したときは、
 *   1. データを src/data に足す
 *   2. npm run gen:battle-pool を実行してプールを作り直す
 *   3. このファイルに1件足して enabled: true にする
 * の3手順で対戦に出せるようになる。
 */
export const BATTLE_RULES: Readonly<Record<string, BattleRule>> = {
  /**
   * 化学基礎 — 対戦の主力。
   * 3形式すべてが十分な数あるので全部使う。
   */
  chemistry_basic: {
    ...BASE,
    subject: 'chemistry_basic',
    questionCount: 10,
    note: '',
  },

  /**
   * 化学（発展） — 使える小問が69件しかない。
   *
   * 10問出すとプールの14%を1試合で消費し、連戦するとすぐ既視感が出る。
   * そこで7問に減らして、1試合あたりの消費を10%に抑えている。
   * （データが増えたらこの数値を戻せばよい）
   */
  chemistry: {
    ...BASE,
    subject: 'chemistry',
    questionCount: 7,
    note: '収録数がまだ少ないため7問マッチです',
  },

  /**
   * 英語リスニング — 音声を聞く時間が必要。
   *
   * ★制限時間を固定している理由★
   * 他教科の秒数は「問題文を読む時間」から見積もっているが、
   * リスニングは音声の再生が終わるまで答えられない。
   * 読む速さではなく再生時間が下限を決めるので、
   * 問題ごとの見積りではなく一律35秒に固定した。
   *
   * ★音声について★
   * 収録音声（MP3）がある問題と、端末の音声読み上げに頼る問題が混在している。
   * 読み上げ速度は端末ごとに違うため、速さボーナスを 50→20 に下げて
   * 「端末が速い人が有利」になりにくくしている。
   * 正解の価値（100点）は他教科と同じなので、聞き取れるかどうかで決まる。
   */
  english_listening: {
    ...BASE,
    subject: 'english_listening',
    questionCount: 8,
    timeLimitOverride: 35,
    pointsSpeedMax: 20,
    formats: ['choice4'],
    note: 'イヤホン推奨。音声の再生が終わってから解答できます',
  },

  /**
   * 英文法 — 全問が元から4択。短い問題文で回転が速い。
   */
  english_grammar: {
    ...BASE,
    subject: 'english_grammar',
    questionCount: 10,
    formats: ['choice4'],
    note: '',
  },

  /**
   * 数学 — 4択が0件。答えは式なので文字パネルにも向かない。
   *
   * ★語句選択（word）だけで成立させている★
   * 「∫x^4 dx」の答え「x^5/5 + C」に対して、
   * 同じ章の他の答え（「-1/(2x^2) + C」など）を誤答として並べる。
   * 式の形が似ているものが並ぶので、当てずっぽうでは当たりにくい。
   *
   * 式を読む時間が要るので速さボーナスは控えめ（30）、
   * 問題数も8問にして1試合が長くなりすぎないようにしている。
   */
  math: {
    ...BASE,
    subject: 'math',
    questionCount: 8,
    pointsSpeedMax: 30,
    formats: ['word'],
    note: '式を選ぶ形式で出題されます',
  },

  /**
   * 生物基礎 — 用語の穴埋めが中心（201件）。
   * 語句選択と文字パネルの両方が使える。
   */
  biology_basic: {
    ...BASE,
    subject: 'biology_basic',
    questionCount: 10,
    formats: ['word', 'panel'],
    note: '',
  },

  /**
   * 地理総合・地理探究 — 使える小問が25件しかない。
   *
   * 10問出すとプールの40%を1試合で使い切ってしまう。
   * 5問に減らしても20%なので、それでも連戦すると同じ問題に当たる。
   * ★同じ問題が出やすいことを画面に明記する★ことで、
   * 「壊れている」と誤解されないようにしている。
   */
  geography: {
    ...BASE,
    subject: 'geography',
    questionCount: 5,
    formats: ['choice4'],
    note: '収録数が少ないため5問マッチ／同じ問題が出ることがあります',
  },
};

/**
 * 教科IDから既定ルールを引く。
 *
 * ★未知の教科IDでも落ちない★
 * 教科データを追加してプールを作り直したあと、このファイルへの追記を
 * 忘れた場合に備えて、既定値ベースの「無効なルール」を返す。
 * こうすると「教科選択に出ない」だけで済み、画面が壊れることはない。
 */
export function defaultRuleOf(subject: string): BattleRule {
  const found = BATTLE_RULES[subject];
  if (found) return found;
  return { ...BASE, subject, enabled: false, note: '' };
}

/** 対戦が有効な教科IDの一覧（既定値ベース） */
export function defaultEnabledSubjects(): string[] {
  return Object.values(BATTLE_RULES)
    .filter((r) => r.enabled)
    .map((r) => r.subject);
}

/**
 * Firestore から読んだ不定形のデータを BattleRule に整える。
 *
 * ★なぜ1フィールドずつ検査するのか★
 * `battle_rules` は運用者が Firebase コンソールから手で編集する場所なので、
 * 打ち間違い（questionCount に文字列が入る、formats に存在しない形式が入る）が
 * 起こりうる。そのまま信じると対戦中に画面が壊れる。
 * ここで既定値に寄せておけば、打ち間違いは「その項目が既定に戻る」だけで済む。
 *
 * 数値には上限も設けている。questionCount に 999 を入れられると
 * 1試合の書き込みが増えて無料枠を食い潰すため。
 */
export function normalizeRule(subject: string, raw: unknown): BattleRule {
  const base = defaultRuleOf(subject);
  if (!raw || typeof raw !== 'object') return base;
  const r = raw as Record<string, unknown>;

  const num = (v: unknown, fallback: number, min: number, max: number): number => {
    if (typeof v !== 'number' || !Number.isFinite(v)) return fallback;
    return Math.min(max, Math.max(min, Math.round(v)));
  };

  const formats: BattleAnswerFormat[] = Array.isArray(r.formats)
    ? (r.formats.filter(
        (f): f is BattleAnswerFormat => f === 'choice4' || f === 'word' || f === 'panel',
      ) as BattleAnswerFormat[])
    : base.formats;

  return {
    subject,
    enabled: typeof r.enabled === 'boolean' ? r.enabled : base.enabled,
    questionCount: num(r.questionCount, base.questionCount, 3, 20),
    timeLimitOverride:
      r.timeLimitOverride === null
        ? null
        : typeof r.timeLimitOverride === 'number'
          ? num(r.timeLimitOverride, 20, 5, 120)
          : base.timeLimitOverride,
    pointsCorrect: num(r.pointsCorrect, base.pointsCorrect, 1, 1000),
    pointsSpeedMax: num(r.pointsSpeedMax, base.pointsSpeedMax, 0, 500),
    pointsStreak: num(r.pointsStreak, base.pointsStreak, 0, 200),
    tiebreak:
      r.tiebreak === 'time' || r.tiebreak === 'sudden' || r.tiebreak === 'draw'
        ? r.tiebreak
        : base.tiebreak,
    formats: formats.length > 0 ? formats : base.formats,
    note: typeof r.note === 'string' ? r.note.slice(0, 120) : base.note,
  };
}
