import { readFileSync } from 'node:fs';
import { describe, it, expect } from 'vitest';

import {
  JOIN_CODE_ALPHABET,
  JOIN_CODE_LENGTH,
  generateJoinCode,
  normalizeJoinCode,
  isValidJoinCode,
  validateClassroomInput,
  validateJoinCodeInput,
  resolveRosterName,
  aggregateClass,
  SCHOOL_NAME_MAX,
  CLASS_NAME_MAX,
} from '../src/utils/classroomCore';

/**
 * ===================================================================
 * クラス機能（参加コード・集計）のテスト
 * ===================================================================
 * 現場で最も事故りやすいのは
 *   ① 参加コードの読み間違い（黒板に書いて写す）
 *   ② 他人の学習データが見えてしまう
 * の2つなので、そこを重点的に検証する。
 */

describe('参加コードの文字集合（黒板に書いて写せること）', () => {
  it('紛らわしい文字を含まない', () => {
    // 0とO、1とI/L、8とB、UとV は手書き・読み上げで混同されるため除外
    for (const char of ['0', 'O', '1', 'I', 'L', 'B', '8', 'U', 'V']) {
      expect(JOIN_CODE_ALPHABET, `${char} は紛らわしいので使わない`).not.toContain(char);
    }
  });

  it('英大文字と数字だけで構成される', () => {
    expect(JOIN_CODE_ALPHABET).toMatch(/^[A-Z0-9]+$/);
  });

  it('十分な組み合わせ数がある（総当りされにくい）', () => {
    const combinations = JOIN_CODE_ALPHABET.length ** JOIN_CODE_LENGTH;
    expect(combinations).toBeGreaterThan(100_000_000);
  });

  it('重複した文字が含まれていない', () => {
    expect(new Set(JOIN_CODE_ALPHABET).size).toBe(JOIN_CODE_ALPHABET.length);
  });
});

describe('参加コードの生成', () => {
  it('決まった長さになる', () => {
    expect(generateJoinCode()).toHaveLength(JOIN_CODE_LENGTH);
  });

  it('許可された文字だけを使う', () => {
    for (let i = 0; i < 200; i += 1) {
      expect(isValidJoinCode(generateJoinCode())).toBe(true);
    }
  });

  it('乱数を固定すれば再現する（テスト可能な設計）', () => {
    const fixed = () => 0;
    expect(generateJoinCode(fixed)).toBe(JOIN_CODE_ALPHABET[0].repeat(JOIN_CODE_LENGTH));
  });

  it('乱数が 1 に近くても範囲外にならない', () => {
    const almostOne = () => 0.9999999;
    expect(isValidJoinCode(generateJoinCode(almostOne))).toBe(true);
  });
});

describe('参加コードの入力ゆれの吸収', () => {
  it('小文字で打っても通る', () => {
    expect(normalizeJoinCode('a3k9df')).toBe('A3K9DF');
  });

  it('空白やハイフンを入れても通る', () => {
    expect(normalizeJoinCode('A3K 9DF')).toBe('A3K9DF');
    expect(normalizeJoinCode('A3K-9DF')).toBe('A3K9DF');
    expect(normalizeJoinCode('A3K_9DF')).toBe('A3K9DF');
  });

  it('桁が足りないときは理由が分かる文言を返す', () => {
    const result = validateJoinCodeInput('A3K');
    expect(result.ok).toBe(false);
    expect(result.message).toContain('6文字');
  });

  it('空入力を弾く', () => {
    expect(validateJoinCodeInput('').ok).toBe(false);
    expect(validateJoinCodeInput('   ').ok).toBe(false);
  });

  it('使えない文字（O や I）は理由を説明して弾く', () => {
    // ゼロとオーの打ち間違いは現場で最も多い
    const result = validateJoinCodeInput('A3KO9D');
    expect(result.ok).toBe(false);
    expect(result.message).toContain('似ている文字');
  });

  it('正しいコードは通り、正規化された値を返す', () => {
    const result = validateJoinCodeInput(' a3k9df ');
    expect(result.ok).toBe(true);
    expect(result.code).toBe('A3K9DF');
  });
});

describe('クラス作成入力の検証', () => {
  const valid = { schoolName: '〇〇高校', className: '2年A組', subject: 'chemistry_basic' as const };

  it('正しい入力は通る', () => {
    expect(validateClassroomInput(valid).ok).toBe(true);
  });

  it('学校名が空だと弾く', () => {
    const result = validateClassroomInput({ ...valid, schoolName: '  ' });
    expect(result.ok).toBe(false);
    expect(result.message).toContain('学校名');
  });

  it('クラス名が空だと弾く', () => {
    const result = validateClassroomInput({ ...valid, className: '' });
    expect(result.ok).toBe(false);
    expect(result.message).toContain('クラス名');
  });

  it('長すぎる名前を弾く（保存容量の暴走を防ぐ）', () => {
    expect(validateClassroomInput({ ...valid, schoolName: 'あ'.repeat(SCHOOL_NAME_MAX + 1) }).ok).toBe(false);
    expect(validateClassroomInput({ ...valid, className: 'あ'.repeat(CLASS_NAME_MAX + 1) }).ok).toBe(false);
  });

  it('未知の科目を弾く', () => {
    // 「math」は正式な科目になったため、真に未定義の値でテストする。
    expect(validateClassroomInput({ ...valid, subject: 'physics' as any }).ok).toBe(false);
  });

  it('追加された科目（数学・生物基礎）を受け付ける', () => {
    expect(validateClassroomInput({ ...valid, subject: 'math' }).ok).toBe(true);
    expect(validateClassroomInput({ ...valid, subject: 'biology_basic' }).ok).toBe(true);
  });
});

describe('先生の画面に出す名前', () => {
  it('先生が付けた出席番号を優先する', () => {
    expect(resolveRosterName({ displayName: 'とびら太郎', rosterName: '01 田中' })).toBe('01 田中');
  });

  it('未設定なら生徒のニックネームを使う', () => {
    expect(resolveRosterName({ displayName: 'とびら太郎' })).toBe('とびら太郎');
  });

  it('どちらも無ければ分かる文言を出す（空欄で見落とさない）', () => {
    expect(resolveRosterName({ displayName: '' })).toBe('（名前未設定）');
    expect(resolveRosterName({ displayName: '  ', rosterName: '  ' })).toBe('（名前未設定）');
  });
});

describe('クラス集計（先生が最初に見る画面）', () => {
  const makeStudent = (overrides: any = {}) => ({
    uid: 'u1',
    displayName: '生徒',
    solvedTotal: 10,
    activeDaysIn14: 5,
    lastStudiedAt: '2026-01-15',
    review: { overdue: 0 },
    engagement: { score: 70 },
    ...overrides,
  });

  const now = new Date(2026, 0, 16, 12, 0, 0).getTime();

  it('在籍0人でも壊れない（0除算しない）', () => {
    const result = aggregateClass([], now);
    expect(result.memberCount).toBe(0);
    expect(result.avgSolved).toBe(0);
    expect(result.avgEngagement).toBe(0);
    expect(result.needsAttention).toEqual([]);
  });

  it('一度も学習していない生徒を数える（最初に声を掛ける対象）', () => {
    const result = aggregateClass(
      [
        makeStudent({ uid: 'a', lastStudiedAt: null }),
        makeStudent({ uid: 'b', lastStudiedAt: null }),
        makeStudent({ uid: 'c' }),
      ],
      now,
    );
    expect(result.neverStudied).toBe(2);
  });

  it('直近7日に学習した生徒を数える', () => {
    const result = aggregateClass(
      [
        makeStudent({ uid: 'a', lastStudiedAt: '2026-01-15' }), // 1日前
        makeStudent({ uid: 'b', lastStudiedAt: '2025-12-01' }), // かなり前
      ],
      now,
    );
    expect(result.activeIn7).toBe(1);
  });

  it('平均を出す', () => {
    const result = aggregateClass(
      [
        makeStudent({ uid: 'a', solvedTotal: 10, engagement: { score: 60 } }),
        makeStudent({ uid: 'b', solvedTotal: 20, engagement: { score: 80 } }),
      ],
      now,
    );
    expect(result.avgSolved).toBe(15);
    expect(result.avgEngagement).toBe(70);
  });

  it('未処理の復習が多い生徒を上位に出す（平均に隠れさせない）', () => {
    const result = aggregateClass(
      [
        makeStudent({ uid: 'a', review: { overdue: 2 } }),
        makeStudent({ uid: 'b', review: { overdue: 9 } }),
        makeStudent({ uid: 'c', review: { overdue: 0 } }),
      ],
      now,
    );

    expect(result.needsAttention).toHaveLength(2);
    expect(result.needsAttention[0].uid).toBe('b');
    expect(result.needsAttention[0].overdue).toBe(9);
  });

  it('気になる生徒は最大5人までに絞る（画面が埋まらないように）', () => {
    const students = Array.from({ length: 12 }, (_, index) =>
      makeStudent({ uid: `u${index}`, review: { overdue: index + 1 } }),
    );
    expect(aggregateClass(students, now).needsAttention).toHaveLength(5);
  });
});

// ===================================================================
// セキュリティルールの監査
// ===================================================================
describe('Firestore ルール：他人の学習データが見えないこと', () => {
  const rules = readFileSync(new URL('../firestore.rules', import.meta.url), 'utf-8');

  it('study_progress の list を禁止している（全生徒の吸い出しを防ぐ）', () => {
    const section = rules.slice(rules.indexOf('match /study_progress/'));
    const block = section.slice(0, section.indexOf('match /study_access/'));
    expect(block).toContain('allow list: if false');
  });

  it('study_progress を書けるのは本人だけ（先生に成績を書き換えさせない）', () => {
    const section = rules.slice(rules.indexOf('match /study_progress/'));
    const block = section.slice(0, section.indexOf('match /study_access/'));
    expect(block).toMatch(/allow create, update: if isOwner\(userId\)/);
  });

  it('先生の閲覧は study_access の存在を条件にしている', () => {
    expect(rules).toContain('teacherHasAccess()');
    expect(rules).toContain("exists(/databases/$(database)/documents/study_access/$(userId + '_' + request.auth.uid))");
  });

  it('閲覧許可を作れるのは生徒本人だけ（先生が勝手に作れない）', () => {
    const section = rules.slice(rules.indexOf('match /study_access/'));
    const block = section.slice(0, section.indexOf('match /classrooms/'));
    expect(block).toContain('request.resource.data.studentUid == request.auth.uid');
  });

  it('閲覧許可のIDと中身の食い違いを禁止している（別人の許可を作れない）', () => {
    const section = rules.slice(rules.indexOf('match /study_access/'));
    expect(section).toContain("accessId == request.resource.data.studentUid + '_' + request.resource.data.teacherUid");
  });

  it('閲覧許可を取り消せるのは生徒本人だけ', () => {
    const section = rules.slice(rules.indexOf('match /study_access/'));
    const block = section.slice(0, section.indexOf('match /classrooms/'));
    expect(block).toMatch(/allow delete: if isAuthenticated\(\)\s*&& resource\.data\.studentUid == request\.auth\.uid/);
  });

  it('uid の偽装を防いでいる（他人の進捗として書き込めない）', () => {
    const section = rules.slice(rules.indexOf('match /study_progress/'));
    expect(section).toContain('data.uid == userId');
    expect(section).toContain('data.uid == request.auth.uid');
  });

  it('復習リストの件数に上限がある（ドキュメント1MiB制限の保護）', () => {
    expect(rules).toContain('data.reviewItems.size() <= 600');
  });

  it('更新時刻はサーバー時刻を強制している（端末時計の偽装対策）', () => {
    const section = rules.slice(rules.indexOf('match /study_progress/'));
    expect(section).toContain('data.updatedAt == request.time');
  });
});

describe('Firestore ルール：クラスと参加コード', () => {
  const rules = readFileSync(new URL('../firestore.rules', import.meta.url), 'utf-8');

  it('class_codes の list を禁止している（コードの総当り列挙を防ぐ）', () => {
    const section = rules.slice(rules.indexOf('match /class_codes/'));
    const block = section.slice(0, section.indexOf('match /class_members/'));
    expect(block).toContain('allow list: if false');
  });

  it('classrooms の list を禁止している（全国のクラス列挙を防ぐ）', () => {
    const section = rules.slice(rules.indexOf('match /classrooms/'));
    const block = section.slice(0, section.indexOf('match /class_codes/'));
    expect(block).toContain('allow list: if false');
  });

  it('参加コードの形式をルール側でも検証している', () => {
    expect(rules).toContain("matches('^[ACDEFGHJKMNPQRSTWXYZ2345679]{6}$')");
  });

  it('既にあるコードを他人が奪えない', () => {
    const section = rules.slice(rules.indexOf('match /class_codes/'));
    expect(section).toContain('resource.data.teacherUid == request.auth.uid');
  });

  it('クラスの参加コードと担任は変更できない（生徒の参加先すり替えを防ぐ）', () => {
    const section = rules.slice(rules.indexOf('match /classrooms/'));
    expect(section).toContain('request.resource.data.joinCode == resource.data.joinCode');
    expect(section).toContain('request.resource.data.teacherUid == resource.data.teacherUid');
  });

  it('在籍レコードのIDと中身の食い違いを禁止している', () => {
    const section = rules.slice(rules.indexOf('match /class_members/'));
    expect(section).toContain("memberId == data.classId + '_' + data.uid");
  });

  it('クラスに参加できるのは生徒本人のみ（先生が勝手に登録できない）', () => {
    const section = rules.slice(rules.indexOf('match /class_members/'));
    expect(section).toContain('request.resource.data.uid == request.auth.uid');
  });

  it('在籍レコードは担任か本人しか読めない', () => {
    const section = rules.slice(rules.indexOf('match /class_members/'));
    expect(section).toContain('isClassTeacher');
    expect(section).toMatch(/allow get, list: if isAuthenticated\(\)/);
  });
});

describe('クライアント実装がルールの前提を守っていること', () => {
  const source = readFileSync(new URL('../src/utils/classroom.ts', import.meta.url), 'utf-8');

  it('先生は生徒ごとに1件ずつ get する（list に頼らない）', () => {
    expect(source).toContain('getDoc(doc(db, STUDY_PROGRESS_COLLECTION, member.uid))');
  });

  it('クラス参加時に閲覧許可を作る（これが無いと先生は何も見えない）', () => {
    expect(source).toContain('STUDY_ACCESS_COLLECTION');
    expect(source).toContain('studyAccessDocId(uid, classroom.teacherUid)');
  });

  it('退出時に閲覧許可も取り消す（抜けたのに見られる状態を残さない）', () => {
    const section = source.slice(source.indexOf('export async function leaveClassroom'));
    expect(section).toContain('deleteDoc');
    expect(section).toContain('STUDY_ACCESS_COLLECTION');
  });

  it('コードの重複を確認してからクラスを確定する（別クラスに入る事故を防ぐ）', () => {
    expect(source).toContain('CLASS_CODES_COLLECTION, candidate');
  });

  it('生徒が自分の参加クラスを確認できる（無断で見られている状態を作らない）', () => {
    expect(source).toContain('fetchMyMemberships');
  });

  it('権限エラーを日本語に翻訳している（現場で意味が伝わるように）', () => {
    expect(source).toContain('permission-denied');
    expect(source).not.toContain('Missing or insufficient permissions.');
  });

  it('1人分の取得が失敗しても画面全体を落とさない', () => {
    const section = source.slice(source.indexOf('export async function fetchClassSummaries'));
    expect(section).toContain('catch');
  });
});
