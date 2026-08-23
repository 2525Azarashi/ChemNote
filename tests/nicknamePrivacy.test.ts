/**
 * 全国ランキングの名前マスキング＋プロフィール改名の即時反映
 *
 * ■ 背景（ご要望）
 *   1. プロフィールで名前を変えてもランキングの名前が変わらない
 *      → 保存時に leaderboard_total / leaderboard_chapter を同期する
 *   2. 全国ランキングに本名を入れている子がいて個人情報が心配
 *      → 全国スコープでは名前を部分マスク（先頭1文字＋＊）
 *   3. フレンドランキングは従来どおりフル表示（変更しない）
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { maskNickname, displayNicknameForNational } from '../src/utils/nicknamePrivacy';

const read = (p: string) => readFileSync(resolve(__dirname, '..', p), 'utf-8');

describe('maskNickname（純粋関数）', () => {
  it('先頭1文字だけ見せて残りを＊にする', () => {
    expect(maskNickname('山田太郎')).toBe('山＊＊＊');
    expect(maskNickname('佐藤')).toBe('佐＊');
  });

  it('＊は最大3個（名前の長さという情報も漏らさない）', () => {
    expect(maskNickname('とてもながいニックネームです')).toBe('と＊＊＊');
  });

  it('1文字の名前でも必ず＊を付ける（マスク済みであることを明示）', () => {
    expect(maskNickname('あ')).toBe('あ＊');
    expect(maskNickname('K')).toBe('K＊');
  });

  it('空文字・空白のみは全部＊にする', () => {
    expect(maskNickname('')).toBe('＊＊＊');
    expect(maskNickname('   ')).toBe('＊＊＊');
  });

  it('絵文字（サロゲートペア）を壊さない', () => {
    expect(maskNickname('😀太郎')).toBe('😀＊＊');
  });

  it('自分の行はマスクしない', () => {
    expect(displayNicknameForNational('山田太郎', true)).toBe('山田太郎');
    expect(displayNicknameForNational('山田太郎', false)).toBe('山＊＊＊');
  });
});

describe('全国ランキング画面がマスクを使う', () => {
  const UI = read('src/components/Leaderboard.tsx');

  it('全国スコープの3経路（合計・章別・期間別）すべてでマスクする', () => {
    const count = (UI.match(/displayNicknameForNational\(r\.entry\.nickname/g) || []).length;
    expect(count).toBe(3);
  });

  it('フレンド競争の経路はマスクしない（従来どおりフル表示）', () => {
    // フレンド分岐は entry.nickname をそのまま使う
    expect(UI).toContain('nickname: entry.nickname,');
    const friendsBranch = UI.slice(
      UI.indexOf("scope === 'friends'"),
      UI.indexOf("tab === 'total'"),
    );
    expect(friendsBranch).not.toContain('displayNicknameForNational');
  });
});

describe('結果画面の章ランキング・解答中の順位ピルもマスクする', () => {
  it('ChapterRankingPanel（全国の章ランキング）', () => {
    const PANEL = read('src/components/ChapterRankingPanel.tsx');
    expect(PANEL).toContain('displayNicknameForNational');
    // 表彰台と「あと○点で○位（相手名）」の両方をマスク
    expect((PANEL.match(/displayNicknameForNational\(/g) || []).length).toBeGreaterThanOrEqual(2);
  });

  it('useLiveStanding（解答中の「すぐ上の相手」表示）', () => {
    const HOOK = read('src/hooks/useLiveStanding.ts');
    expect(HOOK).toContain('displayNicknameForNational');
  });

  it('フレンド機能（FriendPanel / friends.ts）は変更しない', () => {
    expect(read('src/components/FriendPanel.tsx')).not.toContain('displayNicknameForNational');
    expect(read('src/utils/friends.ts')).not.toContain('displayNicknameForNational');
  });
});

describe('プロフィール改名のランキング反映', () => {
  const LEADERBOARD = read('src/utils/leaderboard.ts');

  it('syncRankingNickname が公開されている', () => {
    expect(LEADERBOARD).toContain('export async function syncRankingNickname(');
  });

  it('leaderboard_total（ensureRankingEntry 経由）と leaderboard_chapter の両方を更新する', () => {
    const fn = LEADERBOARD.slice(
      LEADERBOARD.indexOf('export async function syncRankingNickname('),
      LEADERBOARD.indexOf('// ランキング取得'),
    );
    expect(fn).toContain('ensureRankingEntry()');
    expect(fn).toContain("'leaderboard_chapter'");
    expect(fn).toContain("where('uid', '==', user.uid)");
    // スコアには触れず nickname / photoURL だけ merge する
    expect(fn).toContain('{ nickname, photoURL }, { merge: true }');
  });

  it('失敗してもアプリを止めない', () => {
    const fn = LEADERBOARD.slice(
      LEADERBOARD.indexOf('export async function syncRankingNickname('),
      LEADERBOARD.indexOf('// ランキング取得'),
    );
    expect(fn).toContain('catch');
    expect(fn).toContain('console.warn');
  });

  it('プロフィール保存時（設定画面）に同期を呼ぶ', () => {
    const MODAL = read('src/components/ProfileModal.tsx');
    expect(MODAL).toContain("import { syncRankingNickname } from '../utils/leaderboard'");
    expect(MODAL).toContain('void syncRankingNickname().catch(() => {})');
    // フレンド検索用プロフィール（friend_profiles / friend_codes）も同時に最新化
    expect(MODAL).toContain('void ensureFriendProfile().catch(() => {})');
  });

  it('初回オンボーディングの保存時にも同期を呼ぶ', () => {
    const ONBOARDING = read('src/components/Onboarding.tsx');
    expect(ONBOARDING).toContain('void syncRankingNickname().catch(() => {})');
  });

  it('期間別ランキングは「最新プレイの名前」を採用する（改名前の古い名前で上書きしない）', () => {
    const fn = LEADERBOARD.slice(
      LEADERBOARD.indexOf('export async function fetchPeriodRanking('),
    );
    // ベストスコア更新時に nickname を差し替える古いコードが残っていないこと
    expect(fn).not.toContain('cur.nickname = d.nickname || cur.nickname;');
  });
});
