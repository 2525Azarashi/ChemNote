import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

/**
 * ===================================================================
 * 対戦ロビーは、スマホでも 3 つのモードのボタンが初期表示に入る
 * ===================================================================
 *
 * ご指摘（原文）：
 *   > この対戦画面なんだけど、全国対戦とAI対戦の下が隠れてるよね？
 *   > 俺一画面に基本全部入れろって指示を出したはずだよね。直して。
 *
 * ■ 実測（ログイン済み・変更前 → 変更後、ボタンが下部ナビの下に隠れた px）
 *   320x568  218 → 0
 *   360x640  128 → 0
 *   375x667  101 → 0
 *   390x844    0 → 0（ランキング・履歴も 169 → 0）
 *
 * ■ この検査が守ること
 *   ① 縦の短いスマホ向けの圧縮ブロックが CSS に存在する
 *   ② 圧縮は幅 767px 以下に閉じている（PC を巻き込まない）
 *   ③ ボタンの最小高さは 44px を下回らない（押しやすさ）
 *   ④ 3 つのモードカードと 4 つの動作ボタンはすべて残っている（消して収めない）
 *
 * 実際の px は .tmp_e2e/lobby_measure.mjs（Chromium）で測る。
 * ここではソースの契約だけを固定する。
 */

const CSS = readFileSync('src/index.css', 'utf8');
const HOME = readFileSync('src/battle/ui/BattleHome.tsx', 'utf8');

describe('① ② 圧縮ブロックとその範囲', () => {
  it('ロビーの圧縮ブロックが 760px 以下・600px 以下の 2 段で存在する', () => {
    expect(CSS).toMatch(/@media \(max-height: 760px\) and \(max-width: 767px\)\s*\{[^}]*battle-lobby/u);
    expect(CSS).toMatch(/@media \(max-height: 600px\) and \(max-width: 767px\)\s*\{[^}]*battle-lobby #battle-title p \{ display: none; \}/u);
  });

  it('ロビーを触るメディアクエリはすべて幅 767px 以下に閉じている', () => {
    const blocks = CSS.match(/@media[^{]*\{(?:[^{}]*\{[^}]*\})*[^}]*\}/gu) ?? [];
    const lobbyBlocks = blocks.filter((b) => /\.lobby-|battle-lobby/u.test(b) && /max-height/u.test(b));
    expect(lobbyBlocks.length).toBeGreaterThan(0);
    for (const b of lobbyBlocks) {
      const head = b.slice(0, b.indexOf('{'));
      expect(head, `★PC を巻き込むクエリ: ${head}★`).toMatch(/max-width:\s*(?:[1-6]\d\d|7[0-5]\d|76[0-7])px/u);
    }
  });
});

describe('③ 押しやすさ', () => {
  it('圧縮後もモードのボタンは 44px 以上', () => {
    const m = CSS.match(/@media \(max-height: 760px\) and \(max-width: 767px\)[\s\S]*?\.lobby-mode-actions > button \{[^}]*min-height:\s*(\d+)px/u);
    expect(m).not.toBeNull();
    expect(Number(m![1])).toBeGreaterThanOrEqual(44);
  });
});

describe('④ 消して収めていない', () => {
  it('3 つのモードカードと 4 つの動作がすべて残っている', () => {
    for (const kind of ['friend', 'national', 'ai']) expect(HOME).toContain(`kind="${kind}"`);
    for (const label of ['部屋をつくる', '合言葉で参加する', '相手をさがす', 'AIと対戦する']) expect(HOME).toContain(label);
    expect(HOME).toContain('対戦ランキング');
    expect(HOME).toContain('たいせん履歴');
  });

  it('600px 以下で消すのは飾りと重複だけ（ボタン・カードは消さない）', () => {
    const i = CSS.indexOf('@media (max-height: 600px) and (max-width: 767px) {\n  .battle-lobby #battle-title p');
    expect(i).toBeGreaterThan(0);
    const block = CSS.slice(i, CSS.indexOf('\n}', i));
    const hidden = block.match(/^\s*([^{\n]+)\s*\{\s*display:\s*none/gmu) ?? [];
    expect(hidden.length).toBeGreaterThan(0);
    for (const h of hidden) {
      // 消してよいのは飾り（タグ・副題・下線・注意書き）だけ。
      // カード本体・ボタン・ランキング／履歴・レートカード本体は消してはいけない。
      expect(h).not.toMatch(/lobby-mode-actions|\.lobby-mode\s*\{|lobby-mode-(?:friend|national|ai)\s*\{|lobby-record-links|\.lobby-player-pass\s*\{/u);
    }
  });
});
