/**
 * 通信の立て直し（市販の対戦ゲーム並みに止まらない）の試験。
 */
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import {
  ADVANCE_RETRY_MS, connectionQuality, isTransientError, reconnectNotice, retryDelayMs, shouldRetryAdvance, smoothRtt,
} from '../src/battle/core/connection';

describe('isTransientError', () => {
  it.each(['unavailable', 'deadline-exceeded', 'aborted', 'resource-exhausted', 'internal'])('%s はやり直す', (code) => {
    expect(isTransientError({ code })).toBe(true);
  });
  it.each(['permission-denied', 'not-found', 'invalid-argument', 'failed-precondition', ''])('%s はやり直さない（ルールの拒否は何回送っても同じ）', (code) => {
    expect(isTransientError({ code })).toBe(false);
  });
  it('null や文字列でも落ちない', () => {
    expect(isTransientError(null)).toBe(false);
    expect(isTransientError('x')).toBe(false);
  });
});

describe('retryDelayMs', () => {
  it('倍々に伸び、上限で止まる', () => {
    expect(retryDelayMs(0, 0.5)).toBe(400);
    expect(retryDelayMs(1, 0.5)).toBe(800);
    expect(retryDelayMs(2, 0.5)).toBe(1600);
    expect(retryDelayMs(20, 0.5)).toBe(5000);
  });
  it('±20% の揺らぎがある（2人が同時に再送し続けない）', () => {
    expect(retryDelayMs(0, 0)).toBe(320);
    expect(retryDelayMs(0, 1)).toBe(480);
  });
});

describe('電波の強さ', () => {
  it('往復時間でアンテナの本数が決まる', () => {
    expect(connectionQuality(null, 'online')).toBe('good');
    expect(connectionQuality(120, 'online')).toBe('good');
    expect(connectionQuality(500, 'online')).toBe('fair');
    expect(connectionQuality(1500, 'online')).toBe('poor');
    expect(connectionQuality(50, 'offline')).toBe('offline');
  });
  it('1回だけ遅くても急に落ちない（なめらかにする）', () => {
    let r: number | null = null;
    for (let i = 0; i < 10; i += 1) r = smoothRtt(r, 100);
    r = smoothRtt(r, 2000);
    expect(connectionQuality(r, 'online')).not.toBe('poor');
  });
});

describe('進行の撃ち直し', () => {
  it('番号が変わらないまま一定時間たったら撃ち直す', () => {
    expect(shouldRetryAdvance({ firedAt: 1000, now: 1000 + ADVANCE_RETRY_MS - 1, indexChanged: false })).toBe(false);
    expect(shouldRetryAdvance({ firedAt: 1000, now: 1000 + ADVANCE_RETRY_MS, indexChanged: false })).toBe(true);
    expect(shouldRetryAdvance({ firedAt: 1000, now: 99999, indexChanged: true })).toBe(false);
    expect(shouldRetryAdvance({ firedAt: null, now: 99999, indexChanged: false })).toBe(false);
  });
});

describe('再接続の知らせ', () => {
  it('短い瞬断では言わない、長く切れていたら伝える', () => {
    expect(reconnectNotice(500)).toBeNull();
    expect(reconnectNotice(5000)).toContain('通信が戻りました');
  });
});

describe('配線（ソースの確認）', () => {
  const battle = readFileSync('src/battle/data/battle.ts', 'utf8');
  const hook = readFileSync('src/battle/hooks/useBattleRoom.ts', 'utf8');
  it('開始・解答・進行・結果の申告は再送つきの書き込みで送る', () => {
    const count = (battle.match(/await resilientWrite\(/g) || []).length;
    expect(count).toBeGreaterThanOrEqual(4);
    expect(battle).not.toMatch(/await timedWrite\(\(\) =>\s*updateDoc\(doc\(db, COL_ROOMS, roomId\), \{\s*\[`answers/);
  });
  it('部屋の購読は切れたら自動で張り直す（online / 画面復帰でも）', () => {
    expect(hook).toMatch(/addEventListener\('online', kick\)/);
    expect(hook).toMatch(/setSubscribeNo\(\(n\) => n \+ 1\)/);
  });
  it('送信中は答え合わせを出さない', () => {
    const screen = readFileSync('src/battle/ui/BattleRoomScreen.tsx', 'utf8');
    expect(screen).toMatch(/answered && opponentAnswered && !sending/);
  });
  it('詰まるネットワーク向けにロングポーリングの自動判定を有効にしている', () => {
    expect(readFileSync('src/firebase.ts', 'utf8')).toMatch(/experimentalAutoDetectLongPolling: true/);
  });
});
