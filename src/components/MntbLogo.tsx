import React from 'react';
import logoUrl from '../assets/mntb_logo.png';

interface MntbLogoProps {
  /**
   * 表示サイズ。
   *  - sm   … ヘッダー内などの小さい置き場所
   *  - md   … 既定
   *  - hero … タイトル画面の主役として大きく見せる
   *           （以前はロゴの下に「まなとび」の文字を重ねていたが、
   *             ロゴ自体がアプリ名を表しているため文字を撤去し、
   *             代わりにロゴを大きくして「顔」としての役割を持たせている）
   */
  size?: 'sm' | 'md' | 'hero';
  className?: string;
}

const SIZE_CLASS: Record<NonNullable<MntbLogoProps['size']>, string> = {
  sm: 'h-8 md:h-9',
  md: 'h-10 md:h-12',
  hero: 'h-20 sm:h-24 md:h-28',
};

export function MntbLogo({ size = 'md', className = '' }: MntbLogoProps) {
  return (
    <img
      src={logoUrl}
      alt="まなとび"
      draggable={false}
      className={`select-none object-contain ${SIZE_CLASS[size]} w-auto ${className}`}
    />
  );
}
