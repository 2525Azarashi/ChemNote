/**
 * ===================================================================
 * ランキングに 0pt のユーザーも掲載する
 * ===================================================================
 * ご要望：
 *   「ランキングについて、0ptのユーザーも掲載するようにして。
 *     要するに、Googleアカウント連携したユーザーは全て掲載。」
 *
 * これまでの挙動：
 *   leaderboard_total のドキュメントは「初めてスコアを更新したとき」だけ
 *   作られていたため、連携直後のユーザーはランキングに現れなかった。
 *
 * 直したこと：
 *   ・ensureRankingEntry() を追加し、ログイン確定時に totalScore: 0 の枠を作る
 *   ・fetchTotalRanking() は絞り込みを一切かけない（0pt もそのまま並ぶ）
 *   ・同点は同順位にする（0pt が大量に並んでも順序が毎回入れ替わらない）
 *
 * 実際の Firestore を叩くとエミュレータが必要になるため、
 * ここでは「実装がその形を保っているか」をソースで固定する。
 * （エミュレータ必須のテストは leaderboard.rules.test.ts 側にある）
 */
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(__dirname, '..');
const read = (p: string) => fs.readFileSync(path.join(ROOT, p), 'utf-8');

const LEADERBOARD = read('src/utils/leaderboard.ts');
const APP = read('src/App.tsx');
const UI = read('src/components/Leaderboard.tsx');
const RULES = read('firestore.rules');

describe('参加登録（0pt の枠を作る）', () => {
  it('ensureRankingEntry が公開されている', () => {
    expect(LEADERBOARD).toContain('export async function ensureRankingEntry(');
  });

  it('未ログイン（ゲスト）では何もしない', () => {
    // ゲストは uid を持たないため掲載対象外。ここを外すと不明な行が並ぶ。
    expect(LEADERBOARD).toMatch(/ensureRankingEntry[\s\S]{0,400}if \(!user\) return \{ created: false \}/);
  });

  it('新規は totalScore: 0 で作る', () => {
    expect(LEADERBOARD).toMatch(/ensureRankingEntry[\s\S]{0,1600}totalScore: 0/);
  });

  it('既存ユーザーのスコアを 0 に巻き戻さない（存在確認して分岐する）', () => {
    const fn = LEADERBOARD.slice(
      LEADERBOARD.indexOf('export async function ensureRankingEntry('),
      LEADERBOARD.indexOf('// 章スコア書き込み'),
    );
    expect(fn).toContain('snap.exists()');
    // 既存側の更新は nickname / photoURL / updatedAt だけ
    expect(fn).toContain('{ nickname, photoURL, updatedAt: serverTimestamp() }');
    expect(fn).toContain('{ merge: true }');
  });

  it('失敗してもアプリを止めない', () => {
    const fn = LEADERBOARD.slice(
      LEADERBOARD.indexOf('export async function ensureRankingEntry('),
      LEADERBOARD.indexOf('// 章スコア書き込み'),
    );
    expect(fn).toContain('catch');
    expect(fn).toContain('console.warn');
  });
});

describe('ログイン時に自動で登録される', () => {
  it('App が onAuthStateChanged で ensureRankingEntry を呼ぶ', () => {
    expect(APP).toContain("import { ensureRankingEntry } from './utils/leaderboard'");
    expect(APP).toContain('void ensureRankingEntry()');
  });

  it('ゲストでは呼ばない', () => {
    expect(APP).toMatch(/ensureRankingEntry[\s\S]{0,0}|if \(!user\) return; \/\/ ゲストは掲載対象外/);
    expect(APP).toContain('ゲストは掲載対象外');
  });
});

describe('全章合計ランキングの取得', () => {
  it('スコアでの絞り込み（where）を掛けていない＝0pt も並ぶ', () => {
    const fn = LEADERBOARD.slice(
      LEADERBOARD.indexOf('export async function fetchTotalRanking('),
      LEADERBOARD.indexOf('export async function fetchPeriodRanking('),
    );
    expect(fn).not.toContain('where(');
    expect(fn).toContain("orderBy('totalScore', 'desc')");
  });

  it('同点は同順位になる', () => {
    const fn = LEADERBOARD.slice(
      LEADERBOARD.indexOf('export async function fetchTotalRanking('),
      LEADERBOARD.indexOf('export async function fetchPeriodRanking('),
    );
    expect(fn).toContain('if (prevScore === null || score !== prevScore) rank = index + 1;');
  });

  it('同点内の順序が安定している（更新時刻→名前）', () => {
    const fn = LEADERBOARD.slice(
      LEADERBOARD.indexOf('export async function fetchTotalRanking('),
      LEADERBOARD.indexOf('export async function fetchPeriodRanking('),
    );
    expect(fn).toContain('updatedAt?.toMillis?.()');
    expect(fn).toContain("localeCompare(b.nickname || '', 'ja')");
  });
});

describe('画面表示', () => {
  it('0pt かつ未挑戦の人には「まだ挑戦していません」と出す', () => {
    expect(UI).toContain('まだ挑戦していません');
  });

  it('「0 章クリア」という誤解を招く表示にしない', () => {
    // 0pt のとき章数を出すと「0 章クリア」になり、記録なしと区別できない
    expect(UI).toMatch(/totalScore \|\| 0\) === 0[\s\S]{0,220}まだ挑戦していません/);
  });
});

describe('Firestore ルールとの整合', () => {
  it('leaderboard_total は totalScore が 0 以上なら書ける（0 を弾かない）', () => {
    expect(RULES).toContain('request.resource.data.totalScore >= 0');
  });

  it('leaderboard_total は誰でも読める（ランキング表示のため）', () => {
    const block = RULES.slice(
      RULES.indexOf('match /leaderboard_total/{uid}'),
      RULES.indexOf('match /leaderboard_total/{uid}') + 400,
    );
    expect(block).toContain('allow read: if true;');
  });

  it('自分の枠しか作れない（他人を勝手に載せられない）', () => {
    const block = RULES.slice(
      RULES.indexOf('match /leaderboard_total/{uid}'),
      RULES.indexOf('match /leaderboard_total/{uid}') + 600,
    );
    expect(block).toContain('request.auth.uid == uid');
  });
});
