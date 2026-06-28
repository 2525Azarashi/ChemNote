import React from 'react';
import { BookOpen } from 'lucide-react';

interface MntbLogoProps {
  size?: 'sm' | 'md';
  className?: string;
}

export function MntbLogo({ size = 'md', className = '' }: MntbLogoProps) {
  const isSmall = size === 'sm';
  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`} aria-label="mntb ロゴ">
      <div className={`${isSmall ? 'w-8 h-8 rounded-xl' : 'w-9 h-9 md:w-10 md:h-10 rounded-2xl'} bg-gradient-to-br from-[#4FA3F0] to-[#2E86DE] flex items-center justify-center shadow-[0_6px_14px_-4px_rgba(46,134,222,0.6)] relative overflow-hidden`}>
        <BookOpen className={`${isSmall ? 'w-[18px] h-[18px]' : 'w-5 h-5 md:w-[22px] md:h-[22px]'} text-white opacity-95`} strokeWidth={2.4} aria-hidden="true" />
        <span className="absolute -bottom-1.5 right-1 text-[8px] font-black text-white/30 tracking-tighter">m</span>
      </div>
      <span className={`font-modern font-black ${isSmall ? 'text-lg' : 'text-xl md:text-2xl'} text-[#1B2631] tracking-[-0.08em] lowercase`}>
        mntb
      </span>
    </div>
  );
}
