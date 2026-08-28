/**
 * ===================================================================
 * 科目ごとの配色（サブジェクトテーマ）
 * ===================================================================
 *
 * ■ なぜ作ったか
 * これまで「とびら君の吹き出し」や見出しの装飾は、どの科目でも
 * 同じピンク（#F0C7D2 / rgba(217,160,160,…)）が直接書き込まれていた。
 * 科目が3つ（化学基礎・化学・英語リスニング）に増えた結果、
 *   ・いま何の科目を開いているのか、色から判断できない
 *   ・化学基礎で作った配色が、リスニングでは内容と噛み合わない
 * という状態になっていた。
 *
 * ■ どうしたか
 * 「科目 → 配色」の対応をこのファイル1か所に集約した。
 * 既存パレット（ネイビー #2C3E50 系＋やわらかいパステル）から外れないよう、
 * 各科目の色は次の考え方で選んでいる。
 *   ・化学基礎 … これまでどおりのダスティローズ（アプリの原点の色）
 *   ・化学（発展）… 一段落ち着いたブルー。基礎の上に積む「深い」印象
 *   ・英語リスニング … 音・語学を思わせるミントグリーン
 *
 * ■ 使い方
 *   const theme = subjectTheme(subject);
 *   <div className={theme.bubbleBorderClass} style={{ boxShadow: theme.bubbleShadow }} />
 *
 * Tailwind は任意の値を `border-[#RRGGBB]` の形で書けるが、
 * クラス名を動的に組み立てると JIT が拾えないため、
 * **完成したクラス名を文字列として持つ**（結合しない）ようにしている。
 */

// 教科IDの型は allChapters.ts の SubjectKey が唯一の定義
import type { SubjectKey } from './allChapters';

/**
 * 配色を引くときに渡す教科ID。
 * 実体は SubjectKey（アプリ全体で唯一の教科ID定義）。
 */
export type TipSubject = SubjectKey;

export interface SubjectTheme {
  /** 科目の表示名（吹き出しの見出しなどに使う） */
  label: string;
  /** 主役の色（濃いめ・文字色にも耐える） */
  accent: string;
  /** 主役の色の薄い版（枠線・チップの背景） */
  accentSoft: string;
  /** 面の色（カードの背景） */
  surface: string;
  /** 吹き出しの枠線クラス（Tailwind の完成形） */
  bubbleBorderClass: string;
  /** 吹き出しの背景クラス（Tailwind の完成形） */
  bubbleBgClass: string;
  /** 吹き出しの影（style 属性に渡す） */
  bubbleShadow: string;
  /** 分野チップの文字色クラス */
  chipTextClass: string;
  /** 分野チップの背景クラス */
  chipBgClass: string;
  /** 進捗バーの色クラス */
  progressBarClass: string;
}

const THEMES: Record<TipSubject, SubjectTheme> = {
  // 化学基礎：アプリの原点の色。既存画面と地続きに見えるようにする。
  chemistry_basic: {
    label: '化学基礎',
    accent: '#C0847E',
    accentSoft: '#F0C7D2',
    surface: '#FFFDF2',
    bubbleBorderClass: 'border-[#F0C7D2]/70',
    bubbleBgClass: 'bg-white/95',
    bubbleShadow: '0 10px 24px -14px rgba(217,160,160,0.65)',
    chipTextClass: 'text-[#A8635D]',
    chipBgClass: 'bg-[#F0C7D2]/35',
    progressBarClass: 'bg-[#D9A0A0]',
  },
  // 化学（発展）：基礎の上に積み上げる科目なので、一段深いブルーで「発展」を示す。
  chemistry: {
    label: '化学',
    accent: '#4A7FA0',
    accentSoft: '#A9CCE3',
    surface: '#F6FAFD',
    bubbleBorderClass: 'border-[#A9CCE3]/80',
    bubbleBgClass: 'bg-[#FBFDFF]/95',
    bubbleShadow: '0 10px 24px -14px rgba(74,127,160,0.55)',
    chipTextClass: 'text-[#3C6B8A]',
    chipBgClass: 'bg-[#A9CCE3]/35',
    progressBarClass: 'bg-[#6FA8C5]',
  },
  // 数学：論理・構造のイメージで落ち着いたインディゴ。他科目のどの色とも離す。
  math: {
    label: '数学',
    accent: '#5B5EA6',
    accentSoft: '#C7C9E8',
    surface: '#F7F7FD',
    bubbleBorderClass: 'border-[#C7C9E8]/80',
    bubbleBgClass: 'bg-[#FBFBFF]/95',
    bubbleShadow: '0 10px 24px -14px rgba(91,94,166,0.55)',
    chipTextClass: 'text-[#4A4D8C]',
    chipBgClass: 'bg-[#C7C9E8]/35',
    progressBarClass: 'bg-[#8B8ECB]',
  },
  // 生物基礎：生命・植物のイメージでオリーブグリーン。リスニングのミントより黄み寄り。
  biology_basic: {
    label: '生物基礎',
    accent: '#7A9A4B',
    accentSoft: '#D5E3B8',
    surface: '#F9FCF3',
    bubbleBorderClass: 'border-[#D5E3B8]/80',
    bubbleBgClass: 'bg-[#FCFEF7]/95',
    bubbleShadow: '0 10px 24px -14px rgba(122,154,75,0.55)',
    chipTextClass: 'text-[#5F7A38]',
    chipBgClass: 'bg-[#D5E3B8]/35',
    progressBarClass: 'bg-[#9CBB6B]',
  },
  // 英語リスニング：音・語学のイメージでミントグリーン。化学の2色とはっきり区別する。
  english_listening: {
    label: '英語リスニング',
    accent: '#3E9C93',
    accentSoft: '#A9E0D8',
    surface: '#F5FCFA',
    bubbleBorderClass: 'border-[#A9E0D8]/80',
    bubbleBgClass: 'bg-[#F8FEFC]/95',
    bubbleShadow: '0 10px 24px -14px rgba(62,156,147,0.55)',
    chipTextClass: 'text-[#2F7C74]',
    chipBgClass: 'bg-[#A9E0D8]/35',
    progressBarClass: 'bg-[#5BC0BE]',
  },
  // 英文法：同じ英語でもリスニング（ミント）と見違えられないと困るので、
  // 色相を大きく隢して温色の琥痈（アンバー）にする。
  // 既存 5 色（ローズ・ブルー・インディゴ・オリーブ・ミント）のどれとも衝突しない。
  english_grammar: {
    label: '英文法',
    accent: '#C77B3C',
    accentSoft: '#EFD3B4',
    surface: '#FDF8F2',
    bubbleBorderClass: 'border-[#EFD3B4]/80',
    bubbleBgClass: 'bg-[#FFFBF6]/95',
    bubbleShadow: '0 10px 24px -14px rgba(199,123,60,0.55)',
    chipTextClass: 'text-[#9D5C24]',
    chipBgClass: 'bg-[#EFD3B4]/35',
    progressBarClass: 'bg-[#D9975A]',
  },
};

/** 科目に対応する配色を返す。未知の値でも化学基礎にフォールバックして画面を落とさない。 */
export function subjectTheme(subject: TipSubject | undefined): SubjectTheme {
  return (subject && THEMES[subject]) || THEMES.chemistry_basic;
}

/** テスト・検証用に一覧を公開する（実装と期待値が乖離しないようにするため）。 */
export const SUBJECT_THEMES = THEMES;
