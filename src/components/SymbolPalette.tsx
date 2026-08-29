/**
 * =====================================================================
 * 記号パレット（化学／数学）— 解答入力の補助キーボード
 * =====================================================================
 *
 * ■ なぜ Quiz.tsx から切り出したのか
 *   Quiz.tsx は 3,900 行あり、そのうち約 180 行がこのパレットの見た目だった。
 *   パレットは「解答入力欄のカーソル位置に文字を挿入する」だけの独立した部品で、
 *   クイズの進行（採点・タイマー・ページ送り）とは何もやり取りしない。
 *   独立した部品を独立したファイルへ置くと、
 *   ボタンの大きさや並びを直すときにクイズ本体を読まなくて済む。
 *
 * ■ 動きは 1 バイトも変えていない
 *   props・className・挿入時のキャレット計算は Quiz.tsx にあったものと同一。
 *   （tests/symbolPalettes.test.ts と tests/mathIntegral.test.ts が
 *     ボタンの組版と挿入値を固定している）
 */
import React, { useMemo } from 'react';
// 記号パレットのボタン面を「解答欄・解説と同じ組版」で描くために使う。
// renderLatex は KaTeX（数式）／mhchem（化学式）の HTML を返すので、
// 本文と同じ sanitizeInlineHtml を通してから貼る。
import { renderLatex } from '../utils/mathTypeset';
import { sanitizeInlineHtml } from '../utils/sanitizeHtml';
import {
  chemistryPaletteGroups,
  mathPaletteGroups,
  type PaletteGroup,
  type PaletteItem,
} from '../data/symbolPalettes';

/**
 * パレットのボタン1つ。
 *
 * ボタン面は KaTeX（数式）／mhchem（化学式）で組んだ HTML を描く。
 * 解答欄・解説と同じ組版エンジンなので、
 * 「押した記号」と「実際に出てくる記号」の字形が完全に一致する。
 *
 * ★item ごとに毎回 KaTeX を呼ぶとタップのたびに再組版してしまうため、
 *   useMemo で LaTeX 文字列をキーに結果を固定する。★
 */
const PaletteButton: React.FC<{
  item: PaletteItem;
  onInsert: (item: PaletteItem) => void;
}> = ({ item, onInsert }) => {
  const faceHtml = useMemo(() => {
    if (!item.tex) return null;
    // renderLatex の戻りは KaTeX の HTML。本文と同じ経路でサニタイズして貼る。
    return sanitizeInlineHtml(renderLatex(item.tex, { ariaLabel: item.desc }));
  }, [item.tex, item.desc]);

  return (
    <button
      type="button"
      // マウス/タッチダウンでの入力欄フォーカス喪失を防ぐ（キャレット維持のため）。
      onMouseDown={(e) => e.preventDefault()}
      onClick={() => onInsert(item)}
      // ■ タップしやすさ（ご要望「押しやすいように」「スマホの方も」）
      //   ・スマホは 1辺 56px 以上（Apple/Google の推奨 44px より大きく取る。
      //     記号は連続で押すので、隣を誤爆すると入力し直しになるため）
      //   ・押した瞬間に色と大きさが変わるので「入った」ことが分かる
      //   ・touch-manipulation でダブルタップ拡大の遅延（約300ms）を消す
      className={`group relative min-h-[3.5rem] md:min-h-[3.25rem] px-1.5 py-1.5 bg-white border border-stone-300
        hover:border-[#A9CCE3] hover:bg-[#EAF3F9] active:bg-[#D6E9F5] active:border-[#7FB3D5]
        rounded-xl shadow-xs cursor-pointer transition-colors touch-manipulation
        flex flex-col items-center justify-center gap-0.5 overflow-hidden
        ${item.wide ? 'col-span-2' : ''}`}
      title={item.desc}
      aria-label={item.desc}
    >
      {faceHtml ? (
        // palette-face … ボタンの中だけ数式を一段大きく組むためのフック
        //   （index.css の「6d. 記号パレットのボタン面」）。
        //   pointer-events-none で、数式の中の span を押しても
        //   クリックが必ず button 側で拾われるようにする。
        <span
          className="palette-face text-stone-800 leading-none pointer-events-none"
          dangerouslySetInnerHTML={{ __html: faceHtml }}
        />
      ) : (
        <span className="text-[16px] font-bold text-stone-800 font-sans leading-none pointer-events-none">
          {item.label}
        </span>
      )}
      {item.caption && (
        <span className="text-[9px] md:text-[10px] text-stone-500 leading-none font-sans pointer-events-none whitespace-nowrap max-w-full overflow-hidden text-ellipsis">
          {item.caption}
        </span>
      )}
    </button>
  );
};

/**
 * 記号パレット（化学・数学で共用）。
 *
 * ■ ★全グループを1画面に出しっぱなしにする理由★
 *   ご要望「探すのに時間を取らないようにしたい」。
 *
 *   これまで2つの方式を試して、どちらも「探す時間」が発生した。
 *     (a) 高さ 240px の枠内スクロール
 *         → 目的の記号がスクロールの外に隠れる。
 *           枠内スクロールとページスクロールが競合して指が滑る。
 *     (b) カテゴリのタブ切り替え
 *         → 「どのタブに入っているか」を当てる手間が増える。
 *           ₂ を押したいのに①タブ、²⁻ は②タブ…と、
 *           1つ入れるたびにタブを行き来することになる。
 *
 *   そこで収録を「キーボードで打てないものだけ」に絞り込み
 *   （化学 31個・数学 16個。symbolPalettes.ts の収録方針を参照）、
 *   全グループを縦に並べたまま1画面に収めた。
 *   スクロールもタブ操作もゼロで、目的の記号は常に見えている。
 *   グループの見出しを左に小さく添えているだけなので、
 *   探す動作は「目で1回見る」だけで済む。
 *
 * ■ 挿入の仕様
 *   入力欄の選択範囲（カーソル位置）へ value を挿入し、キャレットを更新する。
 *   item.caretBack があればその文字数だけ戻す（`√()` → かっこの内側）。
 *   参照が無い場合は末尾に追記するフォールバック動作。
 */
export function SymbolPalette({
  value,
  onChange,
  inputRef,
  title,
  groups,
}: {
  value: string;
  onChange: (next: string) => void;
  inputRef: React.RefObject<HTMLInputElement | HTMLTextAreaElement | null>;
  title: string;
  groups: PaletteGroup[];
}) {
  const insert = (item: PaletteItem) => {
    const text = item.value;
    const back = item.caretBack ?? 0;
    const el = inputRef.current;
    if (el && typeof el.selectionStart === 'number' && typeof el.selectionEnd === 'number') {
      const start = el.selectionStart;
      const end = el.selectionEnd;
      const next = value.slice(0, start) + text + value.slice(end);
      onChange(next);
      // 挿入後、キャレットを挿入文字列の直後（caretBack があればその手前）へ移動。
      const caret = start + Math.max(0, text.length - back);
      requestAnimationFrame(() => {
        try {
          el.focus();
          el.setSelectionRange(caret, caret);
        } catch {
          /* noop */
        }
      });
    } else {
      onChange(value + text);
    }
  };

  return (
    <div className="bg-stone-50 border border-stone-200/80 p-2 md:p-3 rounded-xl flex flex-col gap-2 w-full">
      <div className="text-[11px] md:text-xs text-stone-500 font-bold select-none px-0.5 flex items-center gap-1 flex-wrap">
        <span>{title}</span>
        <span className="font-normal text-stone-400">
          （打ちにくい記号だけ。タップでカーソル位置に入ります）
        </span>
      </div>

      {/*
        ★全グループを出しっぱなしにする★
        タブも枠内スクロールも作らない。上から下まで全部見えているので、
        「どこにあるか探す」動作が発生しない。
      */}
      {groups.map((grp) => (
        <div key={grp.group} className="flex flex-col gap-1">
          {/* グループ見出し＋使いどころ（1行）。目で1回なぞれば場所が分かる。 */}
          <div className="flex items-baseline gap-1.5 flex-wrap px-0.5">
            <span className="text-[11px] md:text-[12px] font-bold text-[#2C3E50] font-sans leading-none">
              {grp.group}
            </span>
            {grp.hint && (
              <span className="text-[9.5px] md:text-[10.5px] text-stone-500 font-sans leading-snug">
                {grp.hint}
              </span>
            )}
          </div>

          {/* 記号グリッド。1行の列数を画面幅で変え、1ボタンの幅を確保する。 */}
          <div className="grid grid-cols-4 min-[420px]:grid-cols-5 sm:grid-cols-6 md:grid-cols-8 gap-1.5 md:gap-2">
            {grp.items.map((item) => (
              <PaletteButton key={`${grp.group}-${item.label}`} item={item} onInsert={insert} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/** 化学記号パレット（SymbolPalette の化学版ラッパー）。 */
export function ChemistryPalette(props: {
  value: string;
  onChange: (next: string) => void;
  inputRef: React.RefObject<HTMLInputElement | HTMLTextAreaElement | null>;
}) {
  return <SymbolPalette {...props} title="化学記号パレット" groups={chemistryPaletteGroups} />;
}

/** 数学記号パレット（SymbolPalette の数学版ラッパー）。数III積分などの解答入力に使う。 */
export function MathPalette(props: {
  value: string;
  onChange: (next: string) => void;
  inputRef: React.RefObject<HTMLInputElement | HTMLTextAreaElement | null>;
}) {
  return <SymbolPalette {...props} title="数学記号パレット" groups={mathPaletteGroups} />;
}
