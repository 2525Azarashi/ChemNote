/**
 * 全国対戦の流れ：「相手が見つかったら自動で始まる」契約。
 *
 * 利用者の指摘：
 *   「全国対戦の画面を押す → 科目選択する → 何故かフレンド対戦の画面に行く」
 *
 * 原因：findOrEnqueue は 2 人揃った部屋を status:'waiting' で作るが、
 *   その後は フレンド対戦と同じ待機ロビー（合言葉・はじめる・相手を待っています）
 *   が出て、部屋主が「はじめる」を押すまで止まっていた。
 *
 * ここで守ること：
 *   1. nationalAutoStartDelayMs が「部屋主は即・相手側は遅延」で開始を許す
 *   2. フレンド対戦（joinCode あり）は自動開始しない
 *   3. useBattleRoom がこの判断を使って start() を呼ぶ配線になっている
 *   4. BattleLobby の全国対戦ぶんは「はじめる」「合言葉」を出さない
 */

import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import {
  NATIONAL_AUTO_START_FALLBACK_MS,
  nationalAutoStartDelayMs,
} from '../src/battle/core/battleCore';

const host = 'uidHost';
const guest = 'uidGuest';
const nationalRoom = {
  status: 'waiting',
  joinCode: '',
  hostUid: host,
  players: [host, guest] as readonly string[],
};

describe('nationalAutoStartDelayMs', () => {
  it('部屋主は 0ms（すぐ始める）', () => {
    expect(nationalAutoStartDelayMs(nationalRoom, host, true)).toBe(0);
  });

  it('相手側は部屋主の開始を待ってから代わりに始める（8秒）', () => {
    expect(nationalAutoStartDelayMs(nationalRoom, guest, true)).toBe(NATIONAL_AUTO_START_FALLBACK_MS);
    expect(NATIONAL_AUTO_START_FALLBACK_MS).toBe(8000);
  });

  it('フレンド対戦（合言葉あり）は自動では始めない', () => {
    expect(nationalAutoStartDelayMs({ ...nationalRoom, joinCode: 'ABCD' }, host, true)).toBeNull();
  });

  it('もう始まっている／終わった部屋には何もしない', () => {
    expect(nationalAutoStartDelayMs({ ...nationalRoom, status: 'playing' }, host, true)).toBeNull();
    expect(nationalAutoStartDelayMs({ ...nationalRoom, status: 'finished' }, host, true)).toBeNull();
    expect(nationalAutoStartDelayMs({ ...nationalRoom, status: 'aborted' }, host, true)).toBeNull();
  });

  it('1人しかいない部屋・参加者でない人・問題未読込では始めない', () => {
    expect(nationalAutoStartDelayMs({ ...nationalRoom, players: [host] }, host, true)).toBeNull();
    expect(nationalAutoStartDelayMs(nationalRoom, 'stranger', true)).toBeNull();
    expect(nationalAutoStartDelayMs(nationalRoom, '', true)).toBeNull();
    expect(nationalAutoStartDelayMs(nationalRoom, host, false)).toBeNull();
  });
});

describe('useBattleRoom の配線', () => {
  const src = readFileSync('src/battle/hooks/useBattleRoom.ts', 'utf8');

  it('nationalAutoStartDelayMs を使って start() を呼ぶ効果がある', () => {
    expect(src).toMatch(/import \{[^}]*nationalAutoStartDelayMs[^}]*\} from '\.\.\/core\/battleCore'/s);
    expect(src).toContain('nationalAutoStartDelayMs(');
    // 部屋ごとに 1 回だけ撃つガード
    expect(src).toContain('autoStartedForRef');
    // タイマーは片付ける（waiting → playing に変わったときに二重開始しない）
    expect(src).toMatch(/return \(\) => window\.clearTimeout\(timer\)/);
  });
});

describe('BattleLobby の全国対戦ぶん', () => {
  const src = readFileSync('src/battle/ui/BattleLobby.tsx', 'utf8');

  it('全国対戦の判定 isNational（joinCode 空）がある', () => {
    expect(src).toContain('const isNational = !room.joinCode;');
  });

  it('全国対戦では「はじめる」ボタンではなく「まもなく始まります」を出す', () => {
    expect(src).toMatch(/isNational \? \(\s*(\/\/[^\n]*\n\s*)?<BattleNotice message="まもなく始まります…"/);
  });

  it('全国対戦の案内カード（相手が見つかりました）がある', () => {
    expect(src).toContain('id="battle-national-matched"');
    expect(src).toContain('相手が見つかりました！');
    // 以前の素っ気ない「全国対戦の部屋です」は消えている
    expect(src).not.toContain('全国対戦の部屋です');
  });

  it('「合言葉を伝えましたか？」はフレンド対戦だけに出す', () => {
    expect(src).toMatch(/\{!isNational && \(\s*<p[^>]*>\s*合言葉を伝えましたか？/);
  });

  it('退出ボタンの文言は全国対戦で「やめる」', () => {
    expect(src).toContain("{isNational ? 'やめる' : '部屋をでる'}");
  });
});
