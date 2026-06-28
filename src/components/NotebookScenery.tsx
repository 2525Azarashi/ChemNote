import React from 'react';

interface NotebookSceneryProps {
  className?: string;
}

/**
 * タイトル画面の背景に描く手書き風の風景。
 * - 左右に桜の木（幹・枝・桜の塊）をラフな線で描写
 * - 遠景に小さな学校の校舎
 * - すべて SVG のためレスポンシブで軽量。pointer-events-none で操作を妨げない。
 * - 地面に近い下部に配置し、カード群の背後にうっすら見えるようにする。
 */
export function NotebookScenery({ className = '' }: NotebookSceneryProps) {
  return (
    <div
      className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1200 600"
        preserveAspectRatio="xMidYMax slice"
        className="absolute bottom-0 left-0 w-full h-[78%] sm:h-[72%]"
        style={{ opacity: 0.5 }}
      >
        {/* ゆるやかな地面の線（ノートに手書きした地平線） */}
        <path
          d="M0 520 Q 200 505 420 514 T 820 510 T 1200 516"
          fill="none"
          stroke="#C7A88F"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.5"
        />

        {/* ===== 遠景：学校の校舎 ===== */}
        <g stroke="#7FA8C9" strokeWidth="2.2" strokeLinejoin="round" fill="#EAF2F8" opacity="0.75">
          {/* 本館 */}
          <rect x="520" y="440" width="190" height="78" rx="2" />
          {/* 窓（手書き風に少しずらす） */}
          <g stroke="#7FA8C9" strokeWidth="1.4" fill="none" opacity="0.85">
            <rect x="535" y="455" width="20" height="16" />
            <rect x="565" y="455" width="20" height="16" />
            <rect x="595" y="455" width="20" height="16" />
            <rect x="625" y="455" width="20" height="16" />
            <rect x="655" y="455" width="20" height="16" />
            <rect x="535" y="482" width="20" height="16" />
            <rect x="565" y="482" width="20" height="16" />
            <rect x="595" y="482" width="20" height="16" />
            <rect x="625" y="482" width="20" height="16" />
            <rect x="655" y="482" width="20" height="16" />
          </g>
          {/* 時計塔 */}
          <rect x="595" y="398" width="42" height="48" rx="2" fill="#EAF2F8" />
          <polygon points="595,398 616,372 637,398" fill="#D9A0A0" stroke="#C98A8A" />
          <circle cx="616" cy="420" r="9" fill="#FFFFFF" stroke="#7FA8C9" strokeWidth="1.4" />
          <line x1="616" y1="420" x2="616" y2="414" stroke="#7FA8C9" strokeWidth="1.2" />
          <line x1="616" y1="420" x2="621" y2="420" stroke="#7FA8C9" strokeWidth="1.2" />
          {/* 屋根（本館） */}
          <polygon points="520,440 615,418 710,440" fill="#C7DCEC" stroke="#7FA8C9" />
        </g>

        {/* ===== 左の桜の木 ===== */}
        <g>
          {/* 幹と枝 */}
          <path
            d="M150 520 C 150 470 138 440 150 400 M150 430 C 120 415 105 392 92 372 M150 442 C 178 425 196 405 210 384 M150 410 C 132 395 124 378 118 360 M150 412 C 170 398 182 382 190 366"
            fill="none"
            stroke="#9C6B4F"
            strokeWidth="7"
            strokeLinecap="round"
          />
          {/* 桜の塊（雲のように丸を重ねる） */}
          <g fill="#F8C2D4" opacity="0.85">
            <circle cx="100" cy="350" r="40" />
            <circle cx="150" cy="330" r="48" />
            <circle cx="205" cy="352" r="42" />
            <circle cx="130" cy="375" r="38" />
            <circle cx="180" cy="378" r="36" />
          </g>
          <g fill="#FBD0DC" opacity="0.7">
            <circle cx="120" cy="338" r="22" />
            <circle cx="170" cy="320" r="24" />
            <circle cx="195" cy="345" r="20" />
          </g>
          {/* 桜の塊の輪郭（手書き感） */}
          <path
            d="M70 358 Q 80 312 130 300 Q 175 286 205 308 Q 250 326 240 366 Q 232 402 188 408 Q 138 420 100 402 Q 64 388 70 358 Z"
            fill="none"
            stroke="#E59BB4"
            strokeWidth="2"
            opacity="0.55"
          />
        </g>

        {/* ===== 右の桜の木（やや小さめ） ===== */}
        <g>
          <path
            d="M1060 520 C 1060 478 1072 452 1060 416 M1060 444 C 1090 430 1106 410 1118 392 M1060 452 C 1034 438 1018 420 1006 402 M1060 426 C 1080 414 1090 398 1096 384"
            fill="none"
            stroke="#9C6B4F"
            strokeWidth="6"
            strokeLinecap="round"
          />
          <g fill="#F8C2D4" opacity="0.82">
            <circle cx="1015" cy="378" r="34" />
            <circle cx="1062" cy="360" r="42" />
            <circle cx="1110" cy="380" r="36" />
            <circle cx="1085" cy="400" r="30" />
          </g>
          <g fill="#FBD0DC" opacity="0.7">
            <circle cx="1035" cy="368" r="18" />
            <circle cx="1080" cy="352" r="20" />
          </g>
          <path
            d="M985 386 Q 994 346 1040 336 Q 1082 324 1112 344 Q 1150 362 1138 396 Q 1126 428 1086 430 Q 1040 438 1010 422 Q 980 408 985 386 Z"
            fill="none"
            stroke="#E59BB4"
            strokeWidth="1.8"
            opacity="0.5"
          />
        </g>
      </svg>
    </div>
  );
}
