/**
 * ランキング画面：スマホでは「固定される所」と「スクロールする所」を分ける契約。
 *
 * 利用者の指示：
 *   「ランキング画面も基本一画面に入るでしょ？ モンストのランキングとかそういうのって、
 *     固定されるところとスクロールしてるところが明確になってるわけでしょ？」
 *
 * 実測（.tmp_e2e/ranking_measure.mjs・brank_measure.mjs、Chromium）：
 *   学習量ランキング 390x844 … 外側スクロール 0px、一覧が内側で 7 行見える、
 *     「あなた」カードは内側スクロール後も上端に貼り付く（sticky）
 *   対戦ランキング 390x844 … 外側スクロール 0px、一覧 9 行見える、「もどる」は常に見える
 *   PC 1280x720 … 内側スクロール無し（今までどおりページ全体がスクロール）
 *
 * ここで守ること：
 *   ・切り替えはすべて @media (max-width: 767px) の中（PC は 1px も変えない）
 *   ・DOM の並びは変えず、クラス名／id のフックだけを足す
 *   ・情報は 1 つも消さない（display:none をランキングの CSS に書かない）
 */

import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const css = readFileSync('src/index.css', 'utf8');
const leaderboard = readFileSync('src/components/Leaderboard.tsx', 'utf8');
const battleRanking = readFileSync('src/battle/ui/BattleRanking.tsx', 'utf8');

/** 「ランキング（学習量）」節から「縦の短い端末」節の直前までの CSS を切り出す */
function rankingCssBlock(): string {
  const start = css.indexOf('ランキング（学習量）— スマホでは「固定＋スクロール」の2層にする');
  const end = css.indexOf('縦の短い端末（iPhone SE 系 568〜667px）', start);
  expect(start).toBeGreaterThan(0);
  expect(end).toBeGreaterThan(start);
  return css.slice(start, end);
}

describe('学習量ランキング（Leaderboard）', () => {
  it('固定部とスクロール部のフックがある（DOM 順は変えない）', () => {
    expect(leaderboard).toContain('className="ranking-hall-inner');
    expect(leaderboard).toContain('<div className="ranking-scroll">');
    expect(leaderboard).toContain('className="ranking-me-card');
    expect(leaderboard).toContain('className="ranking-battle-bridge');
    // 表彰台・自分カード・一覧は .ranking-scroll の中（見出し・タブより後）
    const scrollAt = leaderboard.indexOf('<div className="ranking-scroll">');
    expect(leaderboard.indexOf('className="ranking-tabs')).toBeLessThan(scrollAt);
    expect(leaderboard.indexOf('<RankingPodium')).toBeGreaterThan(scrollAt);
    expect(leaderboard.indexOf('className="ranking-me-card')).toBeGreaterThan(scrollAt);
    expect(leaderboard.indexOf('className="ranking-record-paper')).toBeGreaterThan(scrollAt);
  });

  it('CSS：外側は画面の高さに固定し、.ranking-scroll だけがスクロールする', () => {
    const block = rankingCssBlock();
    expect(block).toMatch(/\.ranking-hall\s*\{[^}]*height:\s*100dvh/);
    expect(block).toMatch(/\.ranking-hall\s*\{[^}]*overflow:\s*hidden/);
    expect(block).toMatch(/\.ranking-hall-inner\s*\{[^}]*flex-direction:\s*column/);
    expect(block).toMatch(/\.ranking-hall-inner > :not\(\.ranking-scroll\)\s*\{\s*flex:\s*none/);
    expect(block).toMatch(/\.ranking-scroll\s*\{[^}]*overflow-y:\s*auto/);
    expect(block).toMatch(/\.ranking-scroll\s*\{[^}]*min-height:\s*0/);
  });

  it('CSS：「あなた」カードはスクロール領域の中で上に貼り付く（sticky）', () => {
    const block = rankingCssBlock();
    expect(block).toMatch(/\.ranking-scroll \.ranking-me-card\s*\{[^}]*position:\s*sticky/);
    expect(block).toMatch(/\.ranking-scroll \.ranking-me-card\s*\{[^}]*top:\s*0/);
  });

  it('CSS：下部ナビ（71px）ぶんの下余白を確保して最後の行が隠れない', () => {
    const block = rankingCssBlock();
    expect(block).toMatch(/\.ranking-scroll\s*\{[^}]*padding-bottom:\s*calc\(84px \+ env\(safe-area-inset-bottom\)\)/);
  });

  it('CSS：すべて max-width: 767px の中（PC は変えない）・display:none を使わない', () => {
    const block = rankingCssBlock();
    const mediaHeads = block.match(/@media[^{]*\{/g) || [];
    expect(mediaHeads.length).toBeGreaterThan(0);
    for (const head of mediaHeads) expect(head).toContain('max-width: 767px');
    expect(block).not.toContain('display: none');
    expect(block).not.toContain('display:none');
  });
});

describe('対戦ランキング（BattleRanking）', () => {
  it('shell に battle-ranking、一覧に #battle-ranking-list のフックがある', () => {
    expect(battleRanking).toContain('className="battle-ranking"');
    expect(battleRanking).toContain('id="battle-ranking-list"');
    // タブは一覧の外（固定側）
    expect(battleRanking.indexOf('id="battle-ranking-tabs"')).toBeLessThan(
      battleRanking.indexOf('id="battle-ranking-list"'),
    );
  });

  it('CSS：shell は画面の高さに固定・一覧だけが内側でスクロール・下部ナビを避ける', () => {
    const start = css.indexOf('対戦ランキング（BattleRanking）— 同じ考え方');
    expect(start).toBeGreaterThan(0);
    const block = css.slice(start, start + 1600);
    expect(block).toMatch(/#battle-shell\.battle-ranking\s*\{[^}]*height:\s*100dvh/);
    expect(block).toMatch(/#battle-shell\.battle-ranking\s*\{[^}]*padding-bottom:\s*calc\(71px \+ env\(safe-area-inset-bottom\)\)/);
    expect(block).toMatch(/#battle-ranking-list\s*\{[^}]*overflow-y:\s*auto/);
    expect(block).toMatch(/@media \(max-width: 767px\)/);
    expect(block).not.toContain('display: none');
  });
});
