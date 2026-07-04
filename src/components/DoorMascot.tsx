import React, { useMemo } from 'react';

const chemistryFacts = [
  // ── 基本知識 ──
  '水は約4℃で密度が最大。氷が浮くのは固体になるとすき間の多い構造になるからです。',
  '同素体は「同じ元素の単体で性質が違うもの」。炭素なら黒鉛・ダイヤモンド・フラーレンが代表例です。',
  '陽イオンは電子を失ってできる粒子。原子核の正電荷が相対的に強くなるので半径は小さくなりやすいです。',
  '中和では H⁺ と OH⁻ が結びついて水ができます。量的関係は「価数×物質量」でそろえるのがコツ。',
  '酸化は「電子を失う」、還元は「電子を受け取る」。酸素や水素だけでなく電子で考えると安定します。',
  '物質量 mol は粒子数を数えるための単位。1 mol は 6.02×10²³ 個です。',
  '共有結合は非金属元素どうしが電子対を共有する結合。分子の形は電子対の反発で決まります。',
  '炎色反応は金属元素の確認に便利。Na は黄色、K は赤紫色、Cu は青緑色が代表です。',
  'ろ過は「液体に溶けない固体」を分ける操作。溶けている物質はろ紙を通過します。',
  '同位体は陽子数が同じで中性子数が違う原子。化学的性質はほぼ同じです。',
  '電子配置は内側の殻から K(2)→L(8)→M(8)…の順に入ります。最外殻電子＝価電子が反応のカギ。',
  '希ガス（貴ガス）は最外殻が満たされて安定。だから単原子分子で存在し反応しにくいのです。',
  'イオン結合は金属＋非金属、共有結合は非金属どうし、金属結合は金属どうし、と覚えると整理しやすい。',
  'モル質量[g/mol]は原子量・分子量に g をつけた値。質量÷モル質量＝物質量です。',
  'アボガドロの法則：同温・同圧で同体積の気体は同数の分子を含む。標準状態で1 mol＝22.4 L。',
  '強酸（HCl, H₂SO₄, HNO₃）と強塩基（NaOH, KOH）はしっかり覚えておくと中和計算が速くなります。',
  'pH が1小さくなると水素イオン濃度は10倍。pH 3 は pH 5 の100倍の酸性です。',
  '酸化数のルール：単体は0、化合物中のHは+1、Oは−2が基本（例外もあり）。',
  'ダニエル電池は負極(亜鉛)が溶け、正極(銅)に析出。「イオン化傾向の大きい金属が溶ける」と覚えよう。',
  '金属のイオン化傾向：リッチに貸そうかな…（K Ca Na Mg Al Zn Fe Ni Sn Pb H Cu Hg Ag Pt Au）。',

  // ── 共通テスト・試験で使えるテクニック ──
  '単位を必ず書いて計算しよう。単位がそろえば計算式の形は自然と決まります（次元解析）。',
  '有効数字は「与えられた数値の最小桁数」に合わせる。最後にまとめて四捨五入するとミスが減ります。',
  '中和滴定は「酸の価数×モル＝塩基の価数×モル」。この1本の式に当てはめれば多くの問題が解けます。',
  '気体の問題は PV=nRT を軸に。R=8.31×10³ [Pa·L/(K·mol)]、温度は必ずK（℃+273）で。',
  '「水溶液の希釈」では溶質の物質量は不変。C₁V₁=C₂V₂ ですばやく処理できます。',
  '化学反応式の係数は質量保存（原子の数）で合わせる。係数比＝物質量比＝（気体なら）体積比。',
  'グラフ問題は「軸・傾き・切片・変化点」に着目。傾きが何を表すか先に考えると速い。',
  '選択肢問題は「明らかに違う選択肢」から消去。極端な値や単位ミスの選択肢は外しやすい。',
  '中和点の前後でpHが急変（中和滴定曲線）。指示薬は変色域がpHジャンプに重なるものを選ぶ。',
  '酸化還元の量的関係は「やり取りした電子の物質量が等しい」。半反応式を書くと立式が安定します。',
  'mol計算は「与えられた量→mol→求めたい量」の3ステップ。途中をmolに統一すると迷いません。',
  '溶解度や濃度の問題は「溶質・溶媒・溶液」のどれを指すか必ず確認。質量パーセント濃度との混同に注意。',
  '共通テストは時間勝負。計算が重い問題は後回しにして、知識問題で確実に得点しよう。',
  '「正しいものを選べ」か「誤っているものを選べ」か、設問の指示に必ず印をつけてから解こう。',
  '炎色反応・気体の性質・沈殿の色は暗記が得点に直結。スキマ時間に語呂で覚えるのが効率的。',
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
    <div className={`flex items-end gap-3 w-full min-w-0 ${className}`}>
      {/* マスコット画像：サイズを固定し、カードの高さがぶれないようにする */}
      <div className="relative w-20 h-24 sm:w-24 sm:h-28 shrink-0 flex items-end justify-center">
        <img
          src={selected.mascot.src}
          alt={selected.mascot.label}
          draggable={false}
          className="max-w-full max-h-full object-contain drop-shadow-md select-none"
        />
      </div>
      {showSpeech && (
        // 吹き出しは残り幅いっぱいに広がり（flex-1 + min-w-0）、横はみ出し・テキスト切れを防ぐ
        <div className="relative bg-white/95 border border-[#F0C7D2]/70 rounded-2xl px-4 py-3 shadow-[0_10px_24px_-14px_rgba(217,160,160,0.65)] flex-1 min-w-0 mb-1">
          {/* 吹き出しの三角（左向き、マスコット側を指す） */}
          <div className="absolute left-[-7px] top-7 w-4 h-4 bg-white/95 border-l border-b border-[#F0C7D2]/70 rotate-45" />
          {/* 見出しラベル（「化学基礎ミニ豆知識」）は削除し、セリフのみを表示 */}
          <p className="text-[11px] sm:text-xs leading-relaxed text-[#2C3E50] font-bold font-handwriting break-words">{selected.fact}</p>
        </div>
      )}
    </div>
  );
}
