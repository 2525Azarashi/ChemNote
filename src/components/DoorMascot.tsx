import React, { useCallback, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { auth } from '../firebase';
import { mascotTips, TIP_CATEGORIES, TIP_TOTAL } from '../data/mascotTips';
import { markTipSeen, pickTip, readLastTipId, readSeenTipIds, resetSeenTips } from '../utils/tipRotation';

// 添付されたとびら君キャラクター（9種）。public/mascots に配置。
const mascots = [
  { src: '/mascots/basic.png', label: '基本のとびら君' },
  { src: '/mascots/walking.png', label: '歩いているとびら君' },
  { src: '/mascots/studying.png', label: '勉強しているとびら君' },
  { src: '/mascots/cheering.png', label: '応援しているとびら君' },
  { src: '/mascots/good.png', label: 'グッド！なとびら君' },
  { src: '/mascots/thinking.png', label: '考えているとびら君' },
  { src: '/mascots/happy.png', label: '喜んでいるとびら君' },
  { src: '/mascots/bowing.png', label: 'おじぎしているとびら君' },
  { src: '/mascots/sleeping.png', label: 'ねているとびら君' },
] as const;

export interface DoorMascotProps {
  className?: string;
  showSpeech?: boolean;
  size?: 'mini' | 'normal';
}

/** 現在のユーザー（未ログインはゲスト）を既読の保存先キーに使う */
const currentUid = (): string => auth.currentUser?.uid || 'guest';

/**
 * 1つ選んで「既読」として記録する。
 * ★未読を優先するので、開き続けていれば必ず全部の豆知識に出会える★
 * （以前は毎回ただのランダムで、一度も出ないものが残っていた）
 */
function selectTip() {
  const uid = currentUid();
  const picked = pickTip(mascotTips, readSeenTipIds(uid), readLastTipId(uid));
  if (!picked) return null;
  markTipSeen(uid, picked.tip.id);
  // ちょうど全部読み切ったら、次の巡のために既読をリセットする
  if (picked.justCompleted) resetSeenTips(uid);
  return picked;
}

export function DoorMascot({ className = '', showSpeech = true, size = 'normal' }: DoorMascotProps) {
  // マスコットの絵柄は表示ごとにランダム（従来どおり）
  const [mascot, setMascot] = useState(() => mascots[Math.floor(Math.random() * mascots.length)]);
  // 吹き出しを出さない使い方（アイコン用途）では豆知識を選ばない
  const [picked, setPicked] = useState(() => (showSpeech ? selectTip() : null));

  /** 「別の豆知識を見る」──読みたい人が自分のペースで次へ進めるようにする */
  const showNext = useCallback(() => {
    setMascot(mascots[Math.floor(Math.random() * mascots.length)]);
    setPicked(selectTip());
  }, []);

  const category = picked ? TIP_CATEGORIES[picked.tip.category] : null;

  return (
    <div className={`flex items-end gap-3 min-w-0 ${showSpeech ? 'w-full' : ''} ${className}`}>
      {/* マスコット画像：用途に応じて通常／ミニ表示を選べる */}
      <div className={`relative shrink-0 flex items-end justify-center ${size === 'mini' ? 'w-11 h-12' : 'w-20 h-24 sm:w-24 sm:h-28'}`}>
        <img
          src={mascot.src}
          alt={mascot.label}
          draggable={false}
          className="max-w-full max-h-full object-contain drop-shadow-md select-none"
        />
      </div>
      {showSpeech && picked && (
        // 吹き出しは残り幅いっぱいに広がり（flex-1 + min-w-0）、横はみ出し・テキスト切れを防ぐ
        <div className="relative bg-white/95 border border-[#F0C7D2]/70 rounded-2xl px-4 py-3 shadow-[0_10px_24px_-14px_rgba(217,160,160,0.65)] flex-1 min-w-0 mb-1">
          {/* 吹き出しの三角（左向き、マスコット側を指す） */}
          <div className="absolute left-[-7px] top-7 w-4 h-4 bg-white/95 border-l border-b border-[#F0C7D2]/70 rotate-45" />

          {/* 上段：分野バッジ＋読んだ数。
              「何の話か」が一目で分かり、集めていく手応えも作る。 */}
          <div className="flex items-center justify-between gap-2 mb-1.5">
            {category && (
              <span className="inline-flex items-center gap-1 shrink-0 text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FFF1F5] text-[#B03A5B] border border-[#F0C7D2]">
                <span aria-hidden="true">{category.emoji}</span>
                <span>{category.label}</span>
              </span>
            )}
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="text-[9px] sm:text-[10px] font-bold text-[#B03A5B]/70 tabular-nums">
                {picked.seenCount}／{picked.total}個
              </span>
              <button
                type="button"
                onClick={showNext}
                aria-label="別の豆知識を見る"
                title="別の豆知識を見る"
                className="p-1 rounded-full text-[#D9466E] hover:bg-[#FFF1F5] active:scale-95 transition"
              >
                <RefreshCw size={12} />
              </button>
            </div>
          </div>

          <p className="text-[11px] sm:text-xs leading-relaxed text-[#2C3E50] font-bold font-handwriting break-words">{picked.tip.text}</p>

          {/* 全部読み切った瞬間だけ、ねぎらいを添える */}
          {picked.seenCount === TIP_TOTAL && (
            <p className="mt-1.5 text-[9px] sm:text-[10px] font-bold text-[#D9466E]">
              🎉 豆知識を{TIP_TOTAL}個ぜんぶ読みました！ここからもう一巡します。
            </p>
          )}
        </div>
      )}
    </div>
  );
}
