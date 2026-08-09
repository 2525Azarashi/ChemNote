import { readFileSync } from 'node:fs';
import { describe, it, expect } from 'vitest';

/**
 * ===================================================================
 * ホームの導線 と 無操作でホームへ戻る仕組み の回帰テスト
 * ===================================================================
 *
 * ご要望は3点あった。
 *
 *   ② ホーム（とびら君が話していて「共通テストまであと何日」が出る画面）の
 *      「学習を始める」を押したら、まず **科目選択** へ行くようにする。
 *      以前は学習モード選択へ直行していたため、別の科目を勉強したいときに
 *      ホームの「科目を変更」を探さなければならなかった。
 *
 *   ③ 「大問○/○問」の進捗を **教科ごと** に見られるようにする。
 *      （集計ロジック自体は tests/progress.test.ts 側で検証している）
 *
 *   ④ 数十分なにも操作されなかったら、ホーム画面へ戻す。
 *
 * これらは画面遷移とタイマーが絡むため、DOM を用意して React を
 * 実際に描画するのではなく「結線が壊れていないか」をソース上で確認する。
 * 遷移先の取り違えや、うっかり元の実装に戻す変更を検知するのが目的。
 */

const APP = readFileSync('src/App.tsx', 'utf8');
const HOOK = readFileSync('src/hooks/useIdleReset.ts', 'utf8');
const SUBJECT = readFileSync('src/components/SubjectSelection.tsx', 'utf8');

describe('② ホームの「学習を始める」→ 科目選択 → 学習モード選択', () => {
  it('handleStart が科目選択画面へ進む（mode_selection へ直行しない）', () => {
    // handleStart の本体を切り出して検査する
    const m = APP.match(/const handleStart = \(\) => \{([\s\S]*?)\n  \};/);
    expect(m, 'handleStart が見つからない').toBeTruthy();
    const body = m![1];

    expect(body).toContain("setAppState('subject_selection')");
    // 旧実装（モード選択へ直行）に戻っていないこと
    expect(body).not.toContain("setAppState('mode_selection')");
  });

  it('「学習を始める」から来た場合は、科目を選んだあと学習モード選択へ進む', () => {
    const m = APP.match(/const handleSelectSubject = \(subject: SubjectId\) => \{([\s\S]*?)\n  \};/);
    expect(m, 'handleSelectSubject が見つからない').toBeTruthy();
    const body = m![1];

    // 入口が 'start' のときだけモード選択、それ以外はホーム
    expect(body).toContain("subjectPickerOrigin === 'start'");
    expect(body).toContain("'mode_selection'");
    expect(body).toContain("'home'");
  });

  it('科目選択の入口は state で持つ（ref だと戻るボタンの描画が遅れる）', () => {
    expect(APP).toMatch(/const \[subjectPickerOrigin, setSubjectPickerOrigin\]\s*=/);
    // ref 実装が残っていないこと
    expect(APP).not.toContain('subjectPickerReturnsToMode');
  });

  it('入口ごとに origin を設定している（onboarding / start / change）', () => {
    // オンボーディング完了・ゲスト開始 → onboarding
    expect(APP).toMatch(/onComplete=\{\(\) => \{ setSubjectPickerOrigin\('onboarding'\)/);
    expect(APP).toMatch(/onGuest=\{\(\) => \{[^}]*setSubjectPickerOrigin\('onboarding'\)/);
    // ホームの「学習を始める」→ start
    expect(APP).toContain("setSubjectPickerOrigin('start')");
    // ホームの「科目を変更」→ change
    expect(APP).toContain("setSubjectPickerOrigin('change')");
  });

  it('オンボーディング直後だけ「ホームに戻る」を出さない（行き止まり防止）', () => {
    // onBack は origin が 'onboarding' のときのみ undefined
    expect(APP).toMatch(/subjectPickerOrigin === 'onboarding'\s*\?\s*undefined/);
  });

  it('SubjectSelection が任意の onBack を受け取り、渡されたときだけ描画する', () => {
    expect(SUBJECT).toMatch(/onBack\?:\s*\(\)\s*=>\s*void/);
    // 条件付きレンダリング（undefined ならボタン自体を出さない）
    expect(SUBJECT).toMatch(/\{onBack &&/);
    expect(SUBJECT).toContain('aria-label="ホームに戻る"');
    // クリック音（.cursor-pointer）とタップ領域44pxの作法を守る
    expect(SUBJECT).toMatch(/min-h-\[44px\][^"]*cursor-pointer|cursor-pointer[^"]*min-h-\[44px\]/);
  });
});

describe('④ 無操作が続いたらホーム画面へ戻る', () => {
  it('App が useIdleReset を使い、ホームへ戻している', () => {
    expect(APP).toContain("import { useIdleReset } from './hooks/useIdleReset'");
    expect(APP).toMatch(/useIdleReset\(\{[\s\S]*?onIdle: \(\) => setAppState\('home'\)/);
  });

  it('待ち時間は「数十分」＝30分', () => {
    const m = APP.match(/const IDLE_RESET_MS = ([^;]+);/);
    expect(m, 'IDLE_RESET_MS が見つからない').toBeTruthy();
    // 式をそのまま評価して実際のミリ秒を確かめる
    const ms = Number(eval(m![1]));
    expect(ms).toBe(30 * 60 * 1000);
    // 「数十分」の範囲（10分〜60分）に収まっていること
    expect(ms).toBeGreaterThanOrEqual(10 * 60 * 1000);
    expect(ms).toBeLessThanOrEqual(60 * 60 * 1000);
  });

  it('ホーム自身と、ログイン前の入口では作動させない', () => {
    const m = APP.match(/const idleResetEnabled =([\s\S]*?);/);
    expect(m, 'idleResetEnabled が見つからない').toBeTruthy();
    const cond = m![1];

    // すでにホームなら無効（同じ画面へ飛ばす意味がない）
    expect(cond).toContain("appState !== 'home'");
    // オンボーディングでは無効（戻る先のホームがまだ無い）
    expect(cond).toContain("appState !== 'onboarding'");
    // オンボーディング直後の科目選択も無効。ホーム経由の科目選択は対象に含める
    expect(cond).toContain("subjectPickerOrigin === 'onboarding'");
  });

  it('フックが操作イベントでタイマーを振り出しに戻す', () => {
    // タップ・キー入力・スクロールなど、主要な操作を拾っていること
    ['pointerdown', 'keydown', 'touchstart', 'scroll', 'click', 'wheel'].forEach((ev) => {
      expect(HOOK).toContain(`'${ev}'`);
    });
    expect(HOOK).toContain('addEventListener');
    expect(HOOK).toContain('setTimeout');
  });

  it('バックグラウンド復帰時に経過時間を実測する（スマホのタイマー抑制対策）', () => {
    // スマホは他アプリに移るとタイマーが止まるため、時計で測り直す
    expect(HOOK).toContain('visibilitychange');
    expect(HOOK).toMatch(/Date\.now\(\) - lastActivity >= timeoutMs/);
  });

  it('二重発火しない', () => {
    expect(HOOK).toContain('let fired = false');
    expect(HOOK).toMatch(/if \(fired\) return;/);
  });

  it('後片付けでタイマーとリスナーを外す（画面遷移のたびに積み上がらない）', () => {
    const m = HOOK.match(/return \(\) => \{([\s\S]*?)\n    \};/);
    expect(m, 'クリーンアップが見つからない').toBeTruthy();
    const cleanup = m![1];
    expect(cleanup).toContain('clearTimeout');
    expect(cleanup).toContain('removeEventListener');
    expect(cleanup).toContain('visibilitychange');
  });

  it('onIdle を ref に逃がしている（依存配列でタイマーが張り直されるのを防ぐ）', () => {
    // onIdle は毎レンダリングで別関数になりうる。依存に入れると永久に発火しない
    expect(HOOK).toContain('onIdleRef');
    expect(HOOK).toMatch(/\}, \[enabled, timeoutMs\]\);/);
  });
});
