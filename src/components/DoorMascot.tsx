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

const poses = [
  { label: '基本のとびら君', face: 'happy', arm: 'flag', accent: 'spark' },
  { label: '歩いているとびら君', face: 'smile', arm: 'pencil', accent: 'lines' },
  { label: '勉強しているとびら君', face: 'focus', arm: 'book', accent: 'none' },
  { label: '応援しているとびら君', face: 'closed', arm: 'megaphone', accent: 'confetti' },
  { label: '考えているとびら君', face: 'think', arm: 'chin', accent: 'question' },
  { label: 'おじぎしているとびら君', face: 'sleepy', arm: 'bow', accent: 'wave' },
] as const;

export interface DoorMascotProps {
  className?: string;
  showSpeech?: boolean;
}

export function DoorMascot({ className = '', showSpeech = true }: DoorMascotProps) {
  const selected = useMemo(() => {
    const pose = poses[Math.floor(Math.random() * poses.length)];
    const fact = chemistryFacts[Math.floor(Math.random() * chemistryFacts.length)];
    return { pose, fact };
  }, []);

  return (
    <div className={`flex flex-col md:flex-row items-center gap-3 ${className}`}>
      <div className="relative w-28 h-32 md:w-36 md:h-40 shrink-0" role="img" aria-label={selected.pose.label}>
        <MascotSvg pose={selected.pose} />
      </div>
      {showSpeech && (
        <div className="relative bg-white/92 border border-[#F0C7D2]/70 rounded-2xl px-4 py-3 shadow-[0_10px_24px_-14px_rgba(217,160,160,0.65)] max-w-sm">
          <div className="absolute left-1/2 md:left-[-7px] top-[-7px] md:top-8 w-4 h-4 bg-white/92 border-l border-t border-[#F0C7D2]/70 rotate-45" />
          <p className="text-[10px] font-bold tracking-widest text-[#D98AA0] font-modern mb-1">化学基礎ミニ豆知識</p>
          <p className="text-xs md:text-sm leading-relaxed text-[#2C3E50] font-bold font-handwriting">{selected.fact}</p>
        </div>
      )}
    </div>
  );
}

function MascotSvg({ pose }: { pose: typeof poses[number] }) {
  const closed = pose.face === 'closed' || pose.face === 'sleepy';
  const thinking = pose.face === 'think';
  return (
    <svg viewBox="0 0 150 170" className="w-full h-full drop-shadow-md" aria-hidden="true">
      {pose.accent === 'confetti' && (
        <g opacity="0.9">
          <circle cx="24" cy="22" r="2" fill="#F0A7B7" />
          <rect x="110" y="14" width="5" height="9" rx="2" fill="#F9D77E" transform="rotate(25 112 18)" />
          <circle cx="126" cy="44" r="2.5" fill="#8EC7E8" />
          <rect x="37" y="36" width="4" height="8" rx="2" fill="#A4D4AE" transform="rotate(-25 39 40)" />
        </g>
      )}
      {pose.accent === 'spark' && <path d="M115 28 l8 -10 M122 38 l12 -2 M32 30 l-8 -9" stroke="#F4C1CF" strokeWidth="5" strokeLinecap="round" />}
      {pose.accent === 'question' && <text x="112" y="38" fontSize="34" fill="#4FA3F0" fontWeight="900">?</text>}
      {pose.accent === 'wave' && <path d="M118 34 q12 8 7 20 M126 24 q19 12 12 33" fill="none" stroke="#8EC7E8" strokeWidth="4" strokeLinecap="round" opacity="0.8" />}

      <g transform={pose.face === 'sleepy' ? 'rotate(8 75 92)' : undefined}>
        <rect x="28" y="14" width="92" height="132" rx="44" fill="#276EA6" />
        <rect x="35" y="21" width="78" height="119" rx="38" fill="#3C93D1" />
        <path d="M45 135 V48 Q45 28 69 28 H99 Q109 28 109 39 V135 Z" fill="#F2BE83" />
        <path d="M46 134 V49 Q46 31 68 31 H98" fill="none" stroke="#FFE0B3" strokeWidth="2" opacity="0.45" />
        <path d="M34 24 C47 12 103 11 116 27" fill="none" stroke="#7EC4ED" strokeWidth="3" opacity="0.65" />
        <circle cx="102" cy="85" r="3" fill="#F7D66F" />
        <g fill="none" stroke="#7EC4ED" strokeWidth="1.5" opacity="0.55">
          <path d="M43 31 h8 m5 -6 h8" />
          <path d="M93 22 h8 m5 6 h7" />
          <circle cx="47" cy="43" r="2" />
          <circle cx="104" cy="37" r="2" />
        </g>

        <g>
          {closed ? (
            <>
              <path d="M61 68 q6 7 12 0" fill="none" stroke="#3A2B24" strokeWidth="4" strokeLinecap="round" />
              <path d="M85 68 q6 7 12 0" fill="none" stroke="#3A2B24" strokeWidth="4" strokeLinecap="round" />
            </>
          ) : (
            <>
              <circle cx="66" cy="67" r="8" fill="#3A2B24" />
              <circle cx="91" cy="67" r="8" fill="#3A2B24" />
              <circle cx="63" cy="64" r="3" fill="#fff" />
              <circle cx="88" cy="64" r="3" fill="#fff" />
            </>
          )}
          {thinking ? (
            <path d="M69 92 q9 6 19 0" fill="none" stroke="#3A2B24" strokeWidth="3" strokeLinecap="round" />
          ) : pose.face === 'sleepy' ? (
            <path d="M68 91 q10 6 20 0" fill="none" stroke="#3A2B24" strokeWidth="3" strokeLinecap="round" />
          ) : (
            <path d="M64 88 q14 18 30 0" fill="none" stroke="#3A2B24" strokeWidth="5" strokeLinecap="round" />
          )}
        </g>

        <path d="M44 142 l-8 17" stroke="#1E5A89" strokeWidth="8" strokeLinecap="round" />
        <path d="M96 142 l9 17" stroke="#1E5A89" strokeWidth="8" strokeLinecap="round" />
        <path d="M36 160 h14" stroke="#1E5A89" strokeWidth="7" strokeLinecap="round" />
        <path d="M101 160 h14" stroke="#1E5A89" strokeWidth="7" strokeLinecap="round" />

        {pose.arm === 'pencil' && <PencilArm />}
        {pose.arm === 'flag' && <FlagArm />}
        {pose.arm === 'book' && <BookArm />}
        {pose.arm === 'megaphone' && <MegaphoneArm />}
        {pose.arm === 'chin' && <ThinkingArm />}
        {pose.arm === 'bow' && <BowArm />}
      </g>
    </svg>
  );
}

function PencilArm() {
  return <><path d="M34 82 C12 82 12 53 25 43" fill="none" stroke="#1E5A89" strokeWidth="8" strokeLinecap="round" /><rect x="15" y="31" width="9" height="42" rx="4" fill="#F8D56B" transform="rotate(18 20 52)" /><path d="M13 31 l8 -9 l2 12" fill="#E7A44D" /></>;
}
function FlagArm() {
  return <><path d="M111 83 C134 79 137 55 124 46" fill="none" stroke="#1E5A89" strokeWidth="8" strokeLinecap="round" /><path d="M124 43 v48" stroke="#1E5A89" strokeWidth="4" strokeLinecap="round" /><path d="M125 45 l24 12 l-24 12 Z" fill="#F4C356" /></>;
}
function BookArm() {
  return <><path d="M35 101 C18 94 22 73 36 70" fill="none" stroke="#1E5A89" strokeWidth="8" strokeLinecap="round" /><path d="M111 101 C128 94 124 73 110 70" fill="none" stroke="#1E5A89" strokeWidth="8" strokeLinecap="round" /><path d="M51 86 q22 -11 44 0 v38 q-22 -10 -44 0 Z" fill="#2C6BA3" /><path d="M95 86 q15 -8 27 1 v36 q-12 -7 -27 1 Z" fill="#3E82BE" /><path d="M72 86 v38" stroke="#DDEEFF" strokeWidth="2" opacity="0.7" /></>;
}
function MegaphoneArm() {
  return <><path d="M112 83 C136 82 139 51 124 39" fill="none" stroke="#1E5A89" strokeWidth="8" strokeLinecap="round" /><path d="M121 39 l24 -11 v31 l-24 -11 Z" fill="#F4C356" /><rect x="114" y="39" width="11" height="13" rx="3" fill="#2C6BA3" /></>;
}
function ThinkingArm() {
  return <><path d="M112 94 C96 95 92 83 96 78" fill="none" stroke="#1E5A89" strokeWidth="8" strokeLinecap="round" /><circle cx="96" cy="78" r="5" fill="#1E5A89" /></>;
}
function BowArm() {
  return <><path d="M42 103 C58 118 89 118 105 103" fill="none" stroke="#1E5A89" strokeWidth="8" strokeLinecap="round" /></>;
}
