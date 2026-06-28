import React from 'react';
import logoUrl from '../assets/mntb_logo.png';

interface MntbLogoProps {
  size?: 'sm' | 'md';
  className?: string;
}

export function MntbLogo({ size = 'md', className = '' }: MntbLogoProps) {
  const isSmall = size === 'sm';
  return (
    <img
      src={logoUrl}
      alt="mntb ロゴ"
      draggable={false}
      className={`select-none object-contain ${isSmall ? 'h-8 md:h-9' : 'h-10 md:h-12'} w-auto ${className}`}
    />
  );
}
