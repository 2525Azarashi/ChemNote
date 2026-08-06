/**
 * ===================================================================
 * 化学（発展）の分野選択画面
 * ===================================================================
 * 「化学」を選んだあとに表示され、
 *   理論化学 / 無機化学 / 有機化学
 * のどれを学習するかを選ばせる。
 *
 * 設計方針
 *  - 単元選択画面（ChapterSelection）と同じ notebook-paper 背景・
 *    手書きフォント・配色を用い、「別アプリ感」を出さない。
 *  - 各分野カードには、その分野に何章・何単元入っているかを
 *    データから算出して表示する（数字のハードコードをしない）。
 *  - タップ領域は 44px 以上を確保する。
 */

import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, ChevronRight, FlaskConical, Atom, Hexagon } from 'lucide-react';
import {
  ADVANCED_FIELDS,
  getAdvancedFieldStats,
  type AdvancedFieldId,
} from '../data/chemistryAdvancedData';
import { DoorMascot } from './DoorMascot';

interface AdvancedFieldSelectionProps {
  /** 分野を選んだとき */
  onSelectField: (field: AdvancedFieldId) => void;
  onBack: () => void;
}

/** 分野ごとのアイコンと配色（既存パレットの範囲内で色分けする） */
const FIELD_STYLE: Record<
  AdvancedFieldId,
  { icon: React.ComponentType<{ size?: number; className?: string }>; accent: string; bg: string; border: string }
> = {
  theoretical: { icon: FlaskConical, accent: '#2C3E50', bg: 'bg-[#EAF3F9]', border: 'border-[#A9CCE3]' },
  inorganic:   { icon: Atom,         accent: '#1E7D46', bg: 'bg-[#EAF6EF]', border: 'border-[#9ED0B4]' },
  organic:     { icon: Hexagon,      accent: '#B7791F', bg: 'bg-[#FBF3E3]', border: 'border-[#E5C67E]' },
};

export function AdvancedFieldSelection({ onSelectField, onBack }: AdvancedFieldSelectionProps) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex h-[calc(100dvh-env(safe-area-inset-top)-env(safe-area-inset-bottom))] min-h-0 w-full flex-col overflow-hidden notebook-paper p-3 pb-[calc(5.75rem+env(safe-area-inset-bottom))] sm:p-5 md:p-6 relative font-handwriting">
      <button
        onClick={onBack}
        className="absolute top-4 left-4 md:top-6 md:left-6 flex items-center gap-2 text-gray-500 hover:text-[#2C3E50] transition-colors font-bold font-handwriting bg-white/80 px-4 py-2 rounded-full shadow-sm z-10 min-h-[2.75rem]"
      >
        <ArrowLeft size={20} />
        <span className="font-handwriting">戻る</span>
      </button>

      <DoorMascot showSpeech={false} size="mini" className="absolute top-3 right-4 md:top-5 md:right-6 w-auto z-10" />

      <div className="shrink-0 text-center mb-4 mt-10 md:mt-0 font-handwriting">
        <p className="mb-1 text-[11px] md:text-xs font-bold tracking-widest text-[#D9A0A0]">CHEMISTRY</p>
        <h2 className="text-xl md:text-3xl font-handwriting font-bold text-[#2C3E50] mb-1.5 md:mb-2">
          化学
        </h2>
        <p className="text-sm md:text-base text-gray-600 font-handwriting font-bold">
          学習したい分野を選択してください
        </p>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-0.5 pb-4">
        <div className="mx-auto grid w-full max-w-4xl grid-cols-1 gap-3 sm:gap-4 md:grid-cols-3">
          {ADVANCED_FIELDS.map((field, index) => {
            const style = FIELD_STYLE[field.id];
            const Icon = style.icon;
            const stats = getAdvancedFieldStats(field.id);
            const hasQuestions = stats.questions > 0;

            return (
              <motion.button
                key={field.id}
                type="button"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: index * 0.08 }}
                onClick={() => onSelectField(field.id)}
                aria-label={`${field.title}の単元を表示する`}
                className={`group flex min-h-[168px] flex-col justify-between rounded-2xl border-2 ${style.border} ${style.bg} p-4 text-left shadow-sm transition-all hover:-translate-y-1 hover:shadow-md active:translate-y-0 cursor-pointer`}
              >
                <div>
                  <div className="flex items-center gap-2.5">
                    <span
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/85 shadow-xs"
                      style={{ color: style.accent }}
                    >
                      <Icon size={22} />
                    </span>
                    <div className="min-w-0">
                      <h3 className="text-base sm:text-lg font-bold leading-tight" style={{ color: style.accent }}>
                        {field.title}
                      </h3>
                      <p className="text-[10px] font-bold tracking-widest text-slate-400">
                        {field.latin.toUpperCase()}
                      </p>
                    </div>
                  </div>

                  <p className="mt-3 text-[12px] font-bold leading-relaxed text-slate-600">
                    {field.description}
                  </p>
                </div>

                <div className="mt-3 flex items-center justify-between border-t border-white/70 pt-2.5">
                  <span className="text-[11px] font-bold text-slate-500">
                    {stats.sections}章 ・ {stats.units}単元
                    {!hasQuestions && <span className="ml-1.5 text-slate-400">（問題準備中）</span>}
                  </span>
                  <ChevronRight
                    size={18}
                    className="shrink-0 transition-transform group-hover:translate-x-1"
                    style={{ color: style.accent }}
                  />
                </div>
              </motion.button>
            );
          })}
        </div>

        <p className="mx-auto mt-5 max-w-4xl text-center text-[11px] font-bold leading-relaxed text-slate-400">
          単元は教科書の並び順で表示しています。<br className="sm:hidden" />
          問題は順次追加していきます。
        </p>
      </div>
    </div>
  );
}
