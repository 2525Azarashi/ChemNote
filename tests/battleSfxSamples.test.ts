import { existsSync, readFileSync, statSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

import { SAMPLE_SFX, isSampleSfx, sampleUrl } from '../src/battle/audio/sfxSamples';

const read = (p: string) => readFileSync(p, 'utf8');

describe('対戦効果音ファイル（public/sfx/battle）', () => {
  it('一覧のすべての音が mp3 で置かれていて、軽い（各60KB以下）', () => {
    for (const name of SAMPLE_SFX) {
      const path = `public${sampleUrl(name)}`;
      expect(existsSync(path), path).toBe(true);
      const size = statSync(path).size;
      expect(size).toBeGreaterThan(500);
      expect(size).toBeLessThan(60 * 1024);
    }
  });

  it('対戦エンジン・報酬演出の効果音名はすべてファイルがある', () => {
    const engine = read('src/battle/audio/battleAudio.ts');
    const union = engine.slice(engine.indexOf('export type BattleSfx'), engine.indexOf(';', engine.indexOf('export type BattleSfx')));
    const fb = read('src/battle/ui/feedback.ts');
    const fbUnion = fb.slice(fb.indexOf('export type SfxName'), fb.indexOf(';', fb.indexOf('export type SfxName')));
    const names = [...`${union}${fbUnion}`.matchAll(/'([a-z-]+)'/g)].map((m) => m[1]);
    expect(names.length).toBeGreaterThan(20);
    for (const n of names) expect(isSampleSfx(n), n).toBe(true);
  });

  it('商用利用可のライセンス文と生成スクリプトが同梱されている', () => {
    expect(read('public/sfx/battle/LICENSE_SFX.md')).toContain('商用利用できます');
    expect(existsSync('scripts/sfx/gen_battle_sfx.py')).toBe(true);
  });

  it('ファイルが読めないときは合成音にフォールバックする', () => {
    expect(read('src/battle/audio/battleAudio.ts')).toContain('if (playSample(ctx, g, sfx, SAMPLE_GAIN)) return;');
    expect(read('src/battle/ui/feedback.ts')).toContain('} else if (ac) {');
  });

  it('勉強アプリ向けの調整：対戦中は全体のクリック音と二重に鳴らさない／カウントは 3・2・1 だけ', () => {
    expect(read('src/hooks/useGlobalClickSound.ts')).toContain(".arena-live-stage, [data-own-sfx]");
    expect(read('src/battle/ui/BattleLiveStage.tsx')).toContain("Number(countLabel) <= 3) play('countdown')");
  });

  it('新しい場面の音が繋がっている', () => {
    expect(read('src/battle/hooks/useBattleLive.ts')).toContain("sfx.push('overtaken')");
    expect(read('src/battle/hooks/useBattleLive.ts')).toContain("sfx.push('caught-up')");
    expect(read('src/battle/ui/BattleLiveStage.tsx')).toContain("play('timeup')");
    expect(read('src/battle/ui/BattleMissions.tsx')).toContain("r.reward.jackpot ? 'jackpot' : 'chest'");
  });
});
