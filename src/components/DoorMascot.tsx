import React, { useMemo } from 'react';

const chemistryFacts = [
  '水は約4℃で密度が最大。氷が浮くのは固体になるとすき間の多い構造になるからです。',
  '同素体は「同じ元素の単体で性質が違うもの」。炭素なら黒鉛・ダイヤモンド・フラーレンが代表例です。',
  '陽イオンは電子を失ってできる粒子。原子核の正電荷が相対的に強くなるので半径は小さくなりやすいです。',
  '中和では H+ と OH- が結びついて水ができます。量的関係は「価数×物質量」でそろえるのがコツ。',
  '酸化は「電子を失う」、還元は「電子を受け取る」。酸素や水素だけでなく電子で考えると安定します。',
  '物質量 mol は粒子数を数えるための単位。1 mol は 6.02×10^23 個です。',
  '共有結合は非金属元素どうしが電子対を共有する結合。分子の形は共有電子対と非共有電子対の反発で決まります。',
  '炎色反応は金属元素の確認に便利。Na は黄色、K は赤紫色、Cu は青緑色が代表です。',
  'ろ過は「液体に溶けない固体」を分ける操作。溶けている物質はろ紙を通過します。',
];

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
}

export function DoorMascot({ className = '', showSpeech = true }: DoorMascotProps) {
  const selected = useMemo(() => {
    const mascot = mascots[Math.floor(Math.random() * mascots.length)];
    const fact = chemistryFacts[Math.floor(Math.random() * chemistryFacts.length)];
    return { mascot, fact };
  }, []);

  return (
    <div className={`flex flex-col md:flex-row items-center gap-3 ${className}`}>
      <div className="relative w-28 h-32 md:w-36 md:h-40 shrink-0 flex items-end justify-center">
        <img
          src={selected.mascot.src}
          alt={selected.mascot.label}
          draggable={false}
          className="max-w-full max-h-full object-contain drop-shadow-md select-none"
        />
      </div>
      {showSpeech && (
        <div className="relative bg-white/92 border border-[#F0C7D2]/70 rounded-2xl px-4 py-3 shadow-[0_10px_24px_-14px_rgba(217,160,160,0.65)] w-full md:w-[420px] md:max-w-[460px]">
          <div className="absolute left-1/2 md:left-[-7px] top-[-7px] md:top-8 w-4 h-4 bg-white/92 border-l border-t border-[#F0C7D2]/70 rotate-45" />
          <p className="text-[10px] font-bold tracking-widest text-[#D98AA0] font-modern mb-1">化学基礎ミニ豆知識</p>
          <p className="text-xs md:text-sm leading-relaxed text-[#2C3E50] font-bold font-handwriting">{selected.fact}</p>
        </div>
      )}
    </div>
  );
}
