/**
 * 対戦メニューの「ランク帯」（2026-09-28・市販ゲームの対戦入口にならった改善）
 * 称号と次の称号までの進捗を出す。計算はランキング画面と同じ関数を使うこと。
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { ratingProgress, ratingTitle } from '../src/battle/data/battleRanking';

const HOME = readFileSync('src/battle/ui/BattleHome.tsx', 'utf8');
const CSS = readFileSync('src/index.css', 'utf8');

describe('対戦メニューのランク帯', () => {
  it('称号と進捗はランキングと同じ ratingTitle / ratingProgress で出す（独自計算しない）', () => {
    expect(HOME).toMatch(/function RankStrip[\s\S]*ratingTitle\(rating\)[\s\S]*ratingProgress\(rating\)/u);
    expect(HOME).toContain('{row && <RankStrip rating={row.rating}/>}');
    expect(HOME).not.toContain('__rank');
  });

  it('進捗バーは読み上げ用に progressbar と値を持つ', () => {
    expect(HOME).toContain('role="progressbar"');
    expect(HOME).toContain('aria-valuenow');
  });

  it('次の称号までの残り点は ratingProgress と一致する', () => {
    expect(ratingTitle(1580).label).toBe('中級');
    expect(ratingProgress(1580)).toMatchObject({ next: '上級', remain: 70 });
    expect(ratingProgress(2100).remain).toBe(0);
  });

  it('ランキング・対戦履歴はメニュー下の並びから1タップで行ける（折りたたみの中に隠さない）', () => {
    const links = HOME.slice(HOME.indexOf('arena-menu-links'), HOME.indexOf('<FriendOnlineStrip'));
    expect(links).toContain("onChoose('ranking')");
    expect(links).toContain("onChoose('history')");
    const help = HOME.slice(HOME.indexOf('arena-rules-help'));
    expect(help).not.toContain("onChoose('ranking')");
  });

  it('動きは prefers-reduced-motion で止まる', () => {
    expect(CSS).toMatch(/prefers-reduced-motion:reduce\)\{\.arena-mode-card header>span\.arena-mode-pick\{animation:none\}/u);
  });
});
