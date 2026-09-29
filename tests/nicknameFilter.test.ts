import { describe, it, expect } from 'vitest';
import { checkNickname, sanitizeNickname, NICKNAME_MAX } from '../src/features/safety/nicknameFilter';

describe('nicknameFilter（App Store 1.2: 他人に見える名前のフィルタ）', () => {
  it.each(['山田太郎', 'たいまつ', 'ばかり', 'Diet', 'Essex', 'あ', 'ﾀﾛｳ', 'ゆうき1', 'かえろう', 'よしねこ', 'こぶすけ', 'ころすけ', 'Skill', 'かたわら'])(
    '一般的な名前 %s は通す', (n) => expect(checkNickname(n).ok).toBe(true));
  it.each(['シネ', 'し ね', 'ｼﾈ', 'しねええ', 'ばか', 'ばかばか', 'KILLER', 'sex', 'えろ', 'たいま', '殺す', 'F.U.C.K'])(
    '不適切語 %s は弾く', (n) => expect(checkNickname(n).issue).toBe('blocked_word'));
  it.each(['運営スタッフ', '公式', 'admin'])('運営のなりすまし %s は弾く', (n) => expect(checkNickname(n).ok).toBe(false));
  it.each(['@abc_def', 'LINE ID: xx', '090-1234-5678', 'abc@example.com', 'kaede.com', 'https://x.y'])(
    '連絡先 %s は弾く', (n) => expect(checkNickname(n).issue).toBe('contact'));
  it('空・長すぎ・制御文字', () => {
    expect(checkNickname('  ').issue).toBe('empty');
    expect(checkNickname('あ'.repeat(NICKNAME_MAX + 1)).issue).toBe('too_long');
    expect(checkNickname('abc\u202Edef').issue).toBe('control_chars');
  });
  it('sanitizeNickname は使えない名前を既定名に差し替える', () => {
    expect(sanitizeNickname('しね')).toBe('マナトビユーザー');
    expect(sanitizeNickname('  たろう ')).toBe('たろう');
    expect([...sanitizeNickname('あ'.repeat(40))].length).toBe(NICKNAME_MAX);
  });
});

import { displaySafeNickname } from '../src/features/safety/nicknameFilter';
describe('displaySafeNickname（表示側の防波堤）', () => {
  it('普通の名前・マスク済みはそのまま、不適切な名前は伏せる', () => {
    expect(displaySafeNickname('たろう')).toBe('たろう');
    expect(displaySafeNickname('山＊＊＊')).toBe('山＊＊＊');
    expect(displaySafeNickname('しね')).toBe('（表示できない名前）');
    expect(displaySafeNickname('')).toBe('名前なし');
  });
});
