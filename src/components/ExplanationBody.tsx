import React from 'react';
import { formatText } from '../utils/textFormatter';

/**
 * ExplanationBody
 * ------------------------------------------------------------------
 * 学習フローチャート（ロジックツリー）のノード解説本文をレンダリングする。
 *
 * 【背景・方針】
 *  従来の解説テキストでは、表を「特徴 ｜ 純物質 ｜ 混合物」のように
 *  全角パイプを並べた “疑似テーブル” で表現していた。
 *  これは折り返しで列がずれて意味を失い、支援技術からも表として認識されない。
 *
 *  そこで解説データは **Markdown 形式のテーブル**（`| 見出し | 見出し |`）で記述し、
 *  このコンポーネントが本物の <table> 要素（thead / tbody / th / td）へ変換する。
 *  テーブル以外の行は従来どおり formatText（化学式の添字処理など）を通す。
 */

/** Markdown テーブルの区切り行（例: |---|:--:|---|） */
const DELIMITER_ROW = /^\s*\|?\s*:?-{1,}:?\s*(\|\s*:?-{1,}:?\s*)+\|?\s*$/;
/** Markdown テーブルの行（先頭が | で始まる行） */
const TABLE_ROW = /^\s*\|.*\|\s*$/;

type Alignment = 'left' | 'center' | 'right';

interface TableBlock {
  kind: 'table';
  header: string[];
  rows: string[][];
  align: Alignment[];
}

interface TextBlock {
  kind: 'text';
  text: string;
}

type Block = TableBlock | TextBlock;

/** `| a | b |` 形式の1行をセル配列へ分解する。 */
function splitRow(line: string): string[] {
  const trimmed = line.trim().replace(/^\|/, '').replace(/\|$/, '');
  return trimmed.split('|').map((cell) => cell.trim());
}

/** 区切り行（:--- / :---: / ---:）から各列の揃え方を決める。 */
function parseAlignments(line: string): Alignment[] {
  return splitRow(line).map((cell) => {
    const left = cell.startsWith(':');
    const right = cell.endsWith(':');
    if (left && right) return 'center';
    if (right) return 'right';
    return 'left';
  });
}

/**
 * 解説テキストを「テキストブロック」と「テーブルブロック」に分解する。
 * Markdown テーブルとして成立しない `|` 行は、誤変換を避けてテキスト扱いにする。
 */
export function parseExplanationBlocks(text: string): Block[] {
  const lines = text.split('\n');
  const blocks: Block[] = [];
  let buffer: string[] = [];

  const flushText = () => {
    if (buffer.length === 0) return;
    const joined = buffer.join('\n');
    // 前後の余分な空行だけのブロックは捨てる（テーブル前後の間隔は CSS で調整する）
    if (joined.trim() !== '') blocks.push({ kind: 'text', text: joined.replace(/^\n+|\n+$/g, '') });
    buffer = [];
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const next = lines[i + 1];

    // 「ヘッダー行 + 区切り行」が揃っているときだけテーブルとして解釈する
    if (TABLE_ROW.test(line) && next !== undefined && DELIMITER_ROW.test(next)) {
      flushText();
      const header = splitRow(line);
      const align = parseAlignments(next);
      const rows: string[][] = [];
      let j = i + 2;
      while (j < lines.length && TABLE_ROW.test(lines[j])) {
        rows.push(splitRow(lines[j]));
        j++;
      }
      blocks.push({ kind: 'table', header, rows, align });
      i = j - 1;
      continue;
    }

    buffer.push(line);
  }

  flushText();
  return blocks;
}

/** 解説テキストに Markdown テーブルが含まれるか判定する（軽量チェック）。 */
export function hasMarkdownTable(text: string): boolean {
  return parseExplanationBlocks(text).some((b) => b.kind === 'table');
}

const alignClass: Record<Alignment, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
};

/**
 * 表の配色。解説は「明るい下地（ミニテスト・学習フロー）」と
 * 「暗い下地（演習モードの解説パネル）」の両方に出るため、両対応させる。
 */
export type ExplanationTone = 'light' | 'dark';

const toneStyles: Record<ExplanationTone, {
  wrapper: string;
  headCell: string;
  rowHeadCell: string;
  bodyCell: string;
  rowEven: string;
  rowOdd: string;
}> = {
  light: {
    wrapper: 'border-slate-200 bg-white',
    headCell: 'border-slate-200 bg-slate-100 text-slate-700',
    rowHeadCell: 'border-slate-200 text-slate-700',
    bodyCell: 'border-slate-200 text-slate-700',
    rowEven: 'bg-white',
    rowOdd: 'bg-slate-50/70',
  },
  dark: {
    wrapper: 'border-[#3A506B]/60 bg-[#0B132B]/60',
    headCell: 'border-[#3A506B]/60 bg-[#1C2541] text-[#5BC0BE]',
    rowHeadCell: 'border-[#3A506B]/60 text-[#E0E1DD]',
    bodyCell: 'border-[#3A506B]/60 text-[#E0E1DD]/90',
    rowEven: 'bg-transparent',
    rowOdd: 'bg-[#1C2541]/40',
  },
};

interface ExplanationTableProps {
  block: TableBlock;
  tone: ExplanationTone;
  // このリポジトリは @types/react を導入していないため、JSX の key が
  // props として型チェックされる。明示的に受け取って型エラーを避ける。
  key?: React.Key;
}

function ExplanationTable({ block, tone }: ExplanationTableProps) {
  const colCount = block.header.length;
  const t = toneStyles[tone];
  return (
    // 列数が多い表はスマホで横スクロールできるようにする（文字を潰して縦書きにしない）
    <div className={`my-2 -mx-1 overflow-x-auto rounded-lg border shadow-sm ${t.wrapper}`}>
      {/*
        ★ご要望「化学基礎・化学含め様々な科目で解答解説と問題のフォントが
          あっていないので問題のフォントに合わせて。」★

        ここは解説の中の表。以前は font-handwriting を直書きしていたので、
        カード土台を font-modern に統一しても、表だけ Yomogi のまま残り
        「解説の中で書体が2種類混ざる」状態になっていた。

        書体は指定せず、カード土台（CARD_FONT_FAMILY = font-modern）から
        継承させる。こうすれば「問題のフォントに合わせる」という基準が
        1か所（土台）だけになり、将来書体を変えるときもここを触らずに済む。
        数式の単元では土台が font-math になるので、表も自動で数式書体に揃う。
      */}
      <table className="w-full min-w-full border-collapse text-[11px] sm:text-xs">
        <thead>
          <tr>
            {block.header.map((cell, i) => (
              <th
                key={i}
                scope="col"
                className={[
                  'border-b px-2 py-1.5 font-bold whitespace-normal break-words align-top',
                  t.headCell,
                  alignClass[block.align[i] ?? 'left'],
                ].join(' ')}
              >
                {formatText(cell)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {block.rows.map((row, r) => (
            <tr key={r} className={r % 2 === 1 ? t.rowOdd : t.rowEven}>
              {Array.from({ length: colCount }).map((_, c) => {
                const cell = row[c] ?? '';
                // 各行の1列目は行見出し（scope="row"）として扱い、表の意味構造を保つ
                if (c === 0) {
                  return (
                    <th
                      key={c}
                      scope="row"
                      className={[
                        'border-t px-2 py-1.5 font-bold whitespace-normal break-words align-top',
                        t.rowHeadCell,
                        alignClass[block.align[c] ?? 'left'],
                      ].join(' ')}
                    >
                      {formatText(cell)}
                    </th>
                  );
                }
                return (
                  <td
                    key={c}
                    className={[
                      'border-t border-l px-2 py-1.5 whitespace-normal break-words align-top',
                      t.bodyCell,
                      alignClass[block.align[c] ?? 'left'],
                    ].join(' ')}
                  >
                    {formatText(cell)}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export interface ExplanationBodyProps {
  text: string;
  className?: string;
  /** 表の配色。暗い背景のパネルに載せるときは 'dark' を指定する。 */
  tone?: ExplanationTone;
  /** ユーザーが選択したハイライト語（formatText にそのまま渡す） */
  highlights?: string[];
  /**
   * ★英語（リスニング・英文法）の解説では true にする★
   * 化学式の体裁付け（英字をセリフ体の span で包む処理）を止めるため。
   * 付けないと "The" "umbrella" のような単語まで化学式扱いになり、
   * 日本語（ゴシック）と書体が食い違って読みにくくなる。
   */
  prose?: boolean;
}

/**
 * 解説本文（テキスト＋Markdown テーブル）をレンダリングする。
 * テーブルを含まない場合は従来と完全に同じ出力（formatText のみ）になる。
 */
export function ExplanationBody({ text, className, tone = 'light', highlights = [], prose = false }: ExplanationBodyProps) {
  if (!text) return null;
  const blocks = parseExplanationBlocks(text);

  if (blocks.length === 1 && blocks[0].kind === 'text') {
    return <div className={className}>{formatText(text, highlights, { prose })}</div>;
  }

  return (
    <div className={className}>
      {blocks.map((block, i) =>
        block.kind === 'table' ? (
          <ExplanationTable key={`t-${i}`} block={block} tone={tone} />
        ) : (
          // テーブル以外の地の文は改行をそのまま活かす（元の pre-wrap 相当の見た目を保つ）
          <div key={`p-${i}`} className="whitespace-pre-wrap">{formatText(block.text, highlights, { prose })}</div>
        )
      )}
    </div>
  );
}
