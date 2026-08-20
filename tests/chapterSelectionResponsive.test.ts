import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const source = readFileSync('src/components/ChapterSelection.tsx', 'utf8');

describe('章・大問タブのレスポンシブ表示', () => {
  it('スマホでは横スクロールとスナップで単元を切り替えられる', () => {
    expect(source).toContain('flex touch-pan-x snap-x snap-mandatory');
    expect(source).toContain('overflow-x-auto');
    expect(source).toContain('overscroll-x-contain');
    expect(source).toContain('shrink-0 snap-center');
    expect(source).toContain('w-[42vw]');
    expect(source).toContain('min-w-[8.5rem]');
  });

  it('タブレット以上では複数単元を見渡せるグリッドに戻る', () => {
    expect(source).toContain('sm:grid sm:grid-cols-3');
    expect(source).toContain('lg:grid-cols-4');
    expect(source).toContain('xl:grid-cols-5');
    expect(source).toContain('sm:w-auto sm:min-w-0 sm:max-w-none');
  });

  it('選択中タブを表示範囲の中央へ移動する', () => {
    expect(source).toContain('tabRefs.current[activeGroupTitle]?.scrollIntoView');
    expect(source).toContain("inline: 'center'");
    expect(source).toContain("block: 'nearest'");
  });

  it('ARIA のタブ構造を維持する', () => {
    expect(source).toContain('role="tablist"');
    expect(source).toContain('role="tab"');
    expect(source).toContain('aria-selected={isActive}');
    expect(source).toContain('role="tabpanel"');
    expect(source).toContain('aria-controls="chapter-tab-panel"');
  });
});
