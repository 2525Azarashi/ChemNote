import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ZoomIn, X } from 'lucide-react';

/**
 * QuestionFigure
 * ------------------------------------------------------------------
 * 問題・解説に付随する図版（PDF由来のイラストやグラフ）を、
 * アクセシブルかつ統一されたスタイルで表示するための共通コンポーネント。
 *
 * 目的（C1: 図・画像の改善）:
 *  - 図番号の自動採番（図1・図2 …）を figcaption 冒頭に付与する
 *  - alt テキストを必ず意味のある内容にする（キャプション→デフォルト文の順でフォールバック）
 *  - クリック / タップで拡大表示（ライトボックス）できるようにし、
 *    滴定曲線など細かい図をスマホでも読めるようにする
 *  - Quiz / Explanation で重複していた figure マークアップを一元化する
 */

interface QuestionFigureProps {
  /** 画像URL（public 配下の絶対パス等） */
  src: string;
  /** 図のキャプション（例: 「中和滴定に用いる器具（ア）〜（エ）」） */
  caption?: string;
  /**
   * 図番号。指定すると figcaption 冒頭に「図{number}」を表示する。
   * 省略時は番号を表示しない。
   */
  figureNumber?: number;
  /**
   * 明示的な代替テキスト。未指定の場合は caption、それも無ければ
   * 汎用的な説明文にフォールバックする。
   */
  alt?: string;
  /** 配色モード（小テスト=明色 / 演習=暗色）に合わせた文字色調整用 */
  tone?: 'light' | 'dark';
  /** figure の追加クラス（余白調整など） */
  className?: string;
}

export function QuestionFigure({
  src,
  caption,
  figureNumber,
  alt,
  tone = 'light',
  className = 'mt-5',
}: QuestionFigureProps) {
  const [zoomed, setZoomed] = useState(false);

  // 図番号ラベル（例: 「図3」）
  const figureLabel = typeof figureNumber === 'number' ? `図${figureNumber}` : '';

  // alt テキストの決定（アクセシビリティ）。
  // 明示 alt > 「図N: キャプション」> キャプション > 汎用文 の優先順位。
  const resolvedAlt =
    alt ||
    (caption
      ? figureLabel
        ? `${figureLabel}：${caption}`
        : caption
      : figureLabel
        ? `${figureLabel}（問題の図）`
        : '問題に付随する図');

  const captionColor = tone === 'dark' ? 'text-[#E0E1DD]/70' : 'text-gray-500';
  const numberColor = tone === 'dark' ? 'text-[#5BC0BE]' : 'text-[#2C3E50]';

  // Escキーでライトボックスを閉じる & 背景スクロールを固定
  const closeZoom = useCallback(() => setZoomed(false), []);
  useEffect(() => {
    if (!zoomed) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeZoom();
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [zoomed, closeZoom]);

  return (
    <>
      <figure className={className}>
        {/* 画像本体（クリックで拡大） */}
        <button
          type="button"
          onClick={() => setZoomed(true)}
          aria-label={`${resolvedAlt} を拡大表示する`}
          className="group relative block w-full cursor-zoom-in rounded-xl focus-visible:outline-2 focus-visible:outline-[#A9CCE3]"
        >
          <img
            src={src}
            alt={resolvedAlt}
            loading="lazy"
            decoding="async"
            className="max-w-full w-auto mx-auto rounded-xl border border-gray-200 bg-white shadow-sm transition-transform duration-200 group-hover:scale-[1.01]"
          />
          {/* 拡大ヒントのアイコン（44px 以上のタップ領域を確保） */}
          <span
            aria-hidden="true"
            className="absolute top-2 right-2 flex items-center justify-center w-11 h-11 rounded-full bg-white/85 text-[#2C3E50] shadow-sm opacity-70 group-hover:opacity-100 transition-opacity"
          >
            <ZoomIn size={18} />
          </span>
        </button>

        {(caption || figureLabel) && (
          <figcaption className={`mt-2 text-center text-xs font-modern leading-relaxed ${captionColor}`}>
            {figureLabel && <span className={`font-bold ${numberColor} mr-1`}>{figureLabel}</span>}
            {caption}
          </figcaption>
        )}
      </figure>

      {/* 拡大ライトボックス */}
      {createPortal(
        <AnimatePresence>
          {zoomed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-0 z-[120] flex items-center justify-center bg-[#1B2631]/80 backdrop-blur-sm p-4"
              onClick={closeZoom}
              role="dialog"
              aria-modal="true"
              aria-label={resolvedAlt}
            >
              <button
                type="button"
                onClick={closeZoom}
                aria-label="拡大表示を閉じる"
                className="absolute top-4 right-4 flex items-center justify-center w-11 h-11 rounded-full bg-white/90 text-[#1B2631] shadow-md hover:bg-white transition-colors z-10"
              >
                <X size={22} />
              </button>
              <motion.figure
                initial={{ scale: 0.92, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.92, opacity: 0 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="max-w-[95vw] max-h-[90vh] flex flex-col items-center"
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src={src}
                  alt={resolvedAlt}
                  className="max-w-full max-h-[80vh] w-auto object-contain rounded-lg bg-white shadow-2xl"
                />
                {(caption || figureLabel) && (
                  <figcaption className="mt-3 text-center text-sm text-white/90 font-modern leading-relaxed px-4">
                    {figureLabel && <span className="font-bold text-[#F9E79F] mr-1">{figureLabel}</span>}
                    {caption}
                  </figcaption>
                )}
              </motion.figure>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}
