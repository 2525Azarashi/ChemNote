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
 *
 * ★2026-08-31 の方針変更★
 * 「問題が論理的に破綻している場合が多い」という指摘を受けて、
 * 対戦に出すのを ★元データが選択肢を持っている設問だけ★ に限定した
 * （＝対戦の問題は演習で解ける問題とまったく同じ内容になる）。
 * 短答・記述から誤答を借りて4択に作り替える動作（word / panel）は停止した。
 * 詳しい理由は scripts/gen-battle-pool.mts の冒頭と core/types.ts に書いてある。
 *
 * ★同日の追加：五十音キーボード（「みんはや」方式）★
 * 利用者から「1文字ずつ押していく方式をもっと導入してほしい」
 * 「ただし全ての問題をみんはや形式にしなくてもよい。四択問題も含めて」
 * と指定があったので、★選択式とかな入力を混ぜて出す★ことにした。
 * かな入力にするのはカタカナの答えだけ（表記ゆれが起きないため）。
 *
 * その結果、対戦に使える小問の数は次のようになった（npm run gen:battle-pool の実測）。
 *
 *   教科              4択   2〜3・5〜6択   かな入力   合計
 *   化学基礎           72       58         29      159
 *   英語リスニング    146        0          0      146
 *   英文法            100        0          0      100
 *   生物基礎            1       21         40       62
 *   地理               23        2          0       25
 *   化学（発展）        0        9          1       10
 *   数学                0        0          0        0
 *
 * ★かな入力が入ったことで生物基礎が22問→ 62問になった★。
 * この教科は用語の穴埋めが中心で選択肢を持つ設問が少なかったので、
 * かな入力の追加がそのまま収録数の回復になっている。
 *
 * 数学は選択肢もカタカナの答えも無いので ★対戦に出せない★（enabled: false）。
 * 化学（発展）は10問しか無いので、同じ問題が出ることを note に明記している。
 * リスニングは音声の再生時間そのものが必要なので、他教科と同じ秒数にできない。
 *
 * つまり「教科ごとに違う設定を持てること」は後から便利な機能ではなく、
 * ★無いと成立しない前提★である。
 *
 * -------------------------------------------------------------------
 * ■ formats と収録数の関係（ここを間違えると「選べるのに対戦できない」）
 * -------------------------------------------------------------------
 * ルールの formats に、その教科が1問も持っていない形式だけを書くと、
 * 教科選択には出るのに試合が始められない状態になる。
 * 収録数は ★形式別★ に data/battlePool.ts の poolCountOf() で数えること
 * （POOL_COUNTS は形式を問わない総数なので、この判定には使えない）。
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
  /**
   * ★選択式とかな入力を混ぜて出す★
   *
   * 利用者の指定は「みんはや形式をもっと導入してほしい。
   * ただし全てをそうしなくてよい。四択問題も含めて」だったので、
   * 3つの形式をすべて有効にしている。
   *   choice4 … 4択
   *   choice  … 2〜3択・5〜6択
   *   kana    … 五十音キーボードで1文字ずつ
   *
   * ★比率をここで固定していない★
   * 何問をかな入力にするかは kanaShare で指定する。
   * 形式の一覧（formats）と、そのうち何割をかな入力にするかは
   * 別の問題なので分けてある（formats をいじると
   * 「その形式を使わない」になってしまい、比率の調整にならない）。
   *
   * word / panel はプールに1問も無いので書かない
   * （書くとその分が0問になるだけ）。
   */
  formats: ['choice4', 'choice', 'kana'],
  /**
   * ★かな入力問題の割合（0〜1）★
   *
   * 0.3 なら10問のうち3問がかな入力で、残り7問は選択式になる。
   *
   * ★全問をかな入力にしない理由★
   * かな入力は思い出せないと ★完全に0点★ になる（選択式なら
   * 当てずっぽうでも当たる余地がある）。全問かな入力にすると
   * 覚えていない方が1問も取れず、対戦が成立しなくなる。
   * 3割なら「覚えている人が差をつけられる」と
   * 「覚えていなくても試合になる」の両方が成り立つ。
   *
   * 収録数が足りない場合は自動で減る（battleCore の出題組み立て側）。
   */
  kanaShare: 0.3,
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
   * 化学基礎 — 対戦の主力。159問（4択72／2〜3・5〜6択58／かな入力29）。
   * 10問出してもプールの6%なので、連戦しても既視感が出にくい。
   *
   * かな入力は29問。既定の3割（=3問）なら十分に回る。
   */
  chemistry_basic: {
    ...BASE,
    subject: 'chemistry_basic',
    questionCount: 10,
    note: '',
  },

  /**
   * 化学（発展） — 選択肢を持つ設問が9問しかない。
   *
   * ★9問しか無い教科で「同じ問題が出ない」ようにする方法は無い★
   * 1試合3問（最小）にしてもプールの3分の1を使うので、
   * 2試合すれば必ず見た問題に当たる。
   * ここで取れる態度は次の2つしかない。
   *   (a) 教科を無効にして選ばせない
   *   (b) 同じ問題が出ることを先に伝えたうえで遊べるようにする
   * 演習側には設問自体が74件あり、選択肢付きに書き直せば増やせる見込みが
   * あるので、消してしまう(a)ではなく(b)を選んだ。
   *
   * 問題数は5問。3問だと連勝ボーナスがほぼ効かず試合の形にならず、
   * 7問だとプールの8割を1試合で使い切ってしまうため、その間を取った。
   */
  chemistry: {
    ...BASE,
    subject: 'chemistry',
    questionCount: 5,
    /**
     * かな入力が1問しか無いので、既定の3割（=1.5問）を指定しても
     * 実際には1問しか出ない。★その1問が毎試合必ず出る★ことになるので、
     * かな入力は使わない（0）。収録が増えたら戻す。
     */
    kanaShare: 0,
    note: '収録数がとても少ないため5問マッチ／同じ問題が出ることがあります',
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
    /**
     * 収録146問すべてが元から4択（2〜3択もかな入力も1問も無い）。
     * ★かな入力を入れてはいけない教科でもある★—— 英語の答えを
     * 五十音で書くことになり、表記が一意に決まらない。
     */
    formats: ['choice4'],
    kanaShare: 0,
    note: 'イヤホン推奨。音声の再生が終わってから解答できます',
  },

  /**
   * 英文法 — 収録100問すべてが元から4択。短い問題文で回転が速い。
   */
  english_grammar: {
    ...BASE,
    subject: 'english_grammar',
    questionCount: 10,
    /** 英語なのでかな入力は使わない（リスニングと同じ理由） */
    formats: ['choice4'],
    kanaShare: 0,
    note: '',
  },

  /**
   * 数学 — ★対戦に出せない（enabled: false）★
   *
   * 収録171問はすべて短答で、選択肢を1つも持っていない。
   * 以前は「同じ章の他の答えを誤答として借りて4択にする」方式で出していたが、
   * 答えが「x^5/5 + C」のような式のため、
   *   ・借りた式が、その問いに対しても実は正しい（+C の扱い・約分の違い）
   *   ・積分定数や係数の表記ゆれを1つに固定できない
   * という形で ★問いとして成り立たない問題★ が混ざった。
   *
   * 演習側の数学は今まで通り解ける。対戦に出すには、
   * 元データ側に選択肢（誤答も含めて出題者が用意したもの）を足す必要がある。
   */
  math: {
    ...BASE,
    subject: 'math',
    enabled: false,
    questionCount: 8,
    pointsSpeedMax: 30,
    kanaShare: 0,
    note: '選択肢のある問題をこれから増やします',
  },

  /**
   * 生物基礎 — 62問（4択1／2〜3・5〜6択21／かな入力40）。
   *
   * ★この教科はかな入力の追加で一番救われた★
   * 選択肢を持つ設問が22件しかなく、6問マッチでも1試合でプールの27%を
   * 使ってしまう状態だった。生物基礎は「ミトコンドリア」「シアノバクテリア」
   * のようなカタカナ用語の穴埋めが中心なので、かな入力にできる答えが40件も
   * あり、22問 → 62問まで戻った。
   *
   * ★かな入力の割合を既定より上げている（0.3 → 0.4）★
   * プールの3分の2がかな入力なので、0.3 のままだと選択式22問だけを
   * 何度も引くことになり、かな入力40問が余る。0.4 にすると
   * 10問中4問がかな入力になり、両方が均等に減っていく。
   */
  biology_basic: {
    ...BASE,
    subject: 'biology_basic',
    questionCount: 10,
    kanaShare: 0.4,
    note: '',
  },

  /**
   * 地理総合・地理探究 — 使える小問が25件しかない。
   *
   * 10問出すとプールの40%を1試合で使い切ってしまう。
   * 5問に減らしても20%なので、それでも連戦すると同じ問題に当たる。
   * ★同じ問題が出やすいことを画面に明記する★ことで、
   * 「壊れている」と誤解されないようにしている。
   *
   * ★かな入力は 0 を明示している★
   * 地理の答えは地名・国名（漢字またはカタカナ以外）が中心で、
   * 五十音キーボードに載せられる答えが1件も無い。0.3 のままでも
   * 自動で選択式に振り替わるので実害は無いが、
   * 「なぜ地理でかな入力が出ないのか」を後から読んで分かるように書いておく。
   */
  geography: {
    ...BASE,
    subject: 'geography',
    questionCount: 5,
    kanaShare: 0,
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

  /**
   * ★ここに列挙し忘れた形式は「無かったこと」にされる★
   * 新しい形式を types.ts に足したら、必ずこの行にも足すこと。
   * 忘れると、運用者が Firestore にその形式を書いても静かに捨てられ、
   * 「設定したのに出ない」という原因の分かりにくい不具合になる。
   */
  const formats: BattleAnswerFormat[] = Array.isArray(r.formats)
    ? (r.formats.filter(
        (f): f is BattleAnswerFormat =>
          f === 'choice4' ||
          f === 'choice' ||
          f === 'kana' ||
          f === 'word' ||
          f === 'panel',
      ) as BattleAnswerFormat[])
    : base.formats;

  /**
   * かな入力の割合（0〜1）。
   *
   * ★整数に丸める num() を使えない★
   * num() は Math.round するので 0.3 が 0 になり、
   * 「かな入力が1問も出ない」に化ける。ここだけ小数のまま扱う。
   */
  const kanaShare: number =
    typeof r.kanaShare === 'number' && Number.isFinite(r.kanaShare)
      ? Math.min(1, Math.max(0, r.kanaShare))
      : base.kanaShare;

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
    kanaShare,
    note: typeof r.note === 'string' ? r.note.slice(0, 120) : base.note,
  };
}
