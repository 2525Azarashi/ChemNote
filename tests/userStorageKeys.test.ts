/**
 * ===================================================================
 * ユーザーごとの localStorage キー名（userStorageKeys）の特性テスト
 * ===================================================================
 *
 * ■ なにを守るテストか
 *
 * 保存済みのプロフィール・連続日数・修了章は、キー名が1文字違うだけで
 * 「保存したはずのデータが消えた」ように見える。しかもこの4つのキーは
 *
 *     profile_<uid>      プロフィール（名前・学年・文理）
 *     streak_<uid>       連続学習日数
 *     lastActive_<uid>   最後に学習した日（連続日数の判定に使う）
 *     completed_<uid>    修了した章のID配列
 *
 * が、8ファイル・23か所に **文字列リテラルで手書き** されていた。
 *
 * このテストは
 *   ① キー名が今まで作られていた文字列と1文字も違わないこと
 *   ② 実際に保存されている既存データが、集約後も同じキーで読めること
 * を固定する。
 *
 * ★ キー名は「今のユーザーの端末に既に入っている値」の在り処なので、
 *   変えてよいものではない。集約は「同じ文字列を1か所から作る」だけ。
 */
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import {
  PROFILE_KEY_PREFIX,
  STREAK_KEY_PREFIX,
  LAST_ACTIVE_KEY_PREFIX,
  COMPLETED_KEY_PREFIX,
  profileKey,
  streakKey,
  lastActiveKey,
  completedKey,
} from '../src/utils/userStorageKeys';

const ROOT = path.resolve(__dirname, '..');
const read = (p: string) => fs.readFileSync(path.join(ROOT, p), 'utf-8');

/** 集約前に各所で書かれていた形をそのまま写したもの（比較の基準） */
const legacy = {
  profile: (uid: string) => `profile_${uid}`,
  streak: (uid: string) => `streak_${uid}`,
  lastActive: (uid: string) => `lastActive_${uid}`,
  completed: (uid: string) => `completed_${uid}`,
};

/** 実際に出てくる uid の形をひととおり */
const UIDS = [
  'guest',
  'abc123',
  // Firebase の uid は28文字の英数字
  'Ab3xYz9QwErTyUiOpAsDfGhJkLzX',
  // 記号や日本語が入ることは無いが、入っても壊れないことを見る
  'user-with-dash',
  'user_with_underscore',
  '',
];

describe('キー名が集約前と1文字も違わない', () => {
  it('profile_ / streak_ / lastActive_ / completed_ の接頭辞', () => {
    // ここを書き換えると既存ユーザーのデータが読めなくなる。
    // 「うっかり変えた」を止めるための固定値。
    expect(PROFILE_KEY_PREFIX).toBe('profile_');
    expect(STREAK_KEY_PREFIX).toBe('streak_');
    expect(LAST_ACTIVE_KEY_PREFIX).toBe('lastActive_');
    expect(COMPLETED_KEY_PREFIX).toBe('completed_');
  });

  it('どの uid でも集約前とまったく同じ文字列になる', () => {
    for (const uid of UIDS) {
      expect(profileKey(uid), `profile_${uid}`).toBe(legacy.profile(uid));
      expect(streakKey(uid), `streak_${uid}`).toBe(legacy.streak(uid));
      expect(lastActiveKey(uid), `lastActive_${uid}`).toBe(legacy.lastActive(uid));
      expect(completedKey(uid), `completed_${uid}`).toBe(legacy.completed(uid));
    }
  });

  it('接頭辞 + uid の素直な連結である（余計な区切りを挟まない）', () => {
    for (const uid of UIDS) {
      expect(profileKey(uid)).toBe(`${PROFILE_KEY_PREFIX}${uid}`);
      expect(streakKey(uid)).toBe(`${STREAK_KEY_PREFIX}${uid}`);
      expect(lastActiveKey(uid)).toBe(`${LAST_ACTIVE_KEY_PREFIX}${uid}`);
      expect(completedKey(uid)).toBe(`${COMPLETED_KEY_PREFIX}${uid}`);
    }
  });

  it('4つのキーは互いに衝突しない', () => {
    const uid = 'guest';
    const keys = [profileKey(uid), streakKey(uid), lastActiveKey(uid), completedKey(uid)];
    expect(new Set(keys).size).toBe(4);
  });

  it('uid をそのまま使う（勝手に guest へ丸めない）', () => {
    // 呼び出し側は uid の決め方（`|| 'guest'` や `isGuest ? ...`）を
    // それぞれ違う理由で持っている。キー生成側がそこへ口を出すと
    // 「別人の進捗が見える」事故になりうるので、素通しにしている。
    expect(profileKey('someone')).toBe('profile_someone');
    expect(profileKey('')).toBe('profile_');
  });
});

describe('既に保存されているデータが同じキーで読める', () => {
  it('集約前のキーで書いた値を、集約後の関数で読み出せる', () => {
    const map = new Map<string, string>();
    const ls = {
      getItem: (k: string) => (map.has(k) ? map.get(k)! : null),
      setItem: (k: string, v: string) => void map.set(k, String(v)),
    };
    const uid = 'Ab3xYz9QwErTyUiOpAsDfGhJkLzX';

    // 集約前の書き方で保存（＝いまユーザーの端末に入っている状態）
    ls.setItem(legacy.profile(uid), JSON.stringify({ name: 'あざらし', grade: '高校3年' }));
    ls.setItem(legacy.streak(uid), '7');
    ls.setItem(legacy.lastActive(uid), 'Tue Aug 26 2026');
    ls.setItem(legacy.completed(uid), JSON.stringify(['c1_1', 'c1_2']));

    // 集約後の関数で読む
    expect(JSON.parse(ls.getItem(profileKey(uid))!).name).toBe('あざらし');
    expect(ls.getItem(streakKey(uid))).toBe('7');
    expect(ls.getItem(lastActiveKey(uid))).toBe('Tue Aug 26 2026');
    expect(JSON.parse(ls.getItem(completedKey(uid))!)).toEqual(['c1_1', 'c1_2']);
  });

  it('uid が違えば別のデータになる（他人の進捗が混ざらない）', () => {
    expect(profileKey('userA')).not.toBe(profileKey('userB'));
    expect(completedKey('guest')).not.toBe(completedKey('userA'));
  });
});

describe('旧データ引き継ぎ（progress）が completed_ を読めている', () => {
  it('completed_ だけ残っている章を復元できる', async () => {
    const map = new Map<string, string>();
    (globalThis as any).localStorage = {
      getItem: (k: string) => (map.has(k) ? map.get(k)! : null),
      setItem: (k: string, v: string) => void map.set(k, String(v)),
      removeItem: (k: string) => void map.delete(k),
      clear: () => map.clear(),
      key: (i: number) => [...map.keys()][i] ?? null,
      get length() {
        return map.size;
      },
    };

    const { backfillLegacyProgress, readSolvedMap } = await import('../src/utils/progress');

    // 旧データ：章 c1_1 を修了済みとして記録してある
    map.set(completedKey('u'), JSON.stringify(['c1_1']));

    const chapters = [
      {
        id: 'c1_1',
        miniTest: [{ id: 'q1' }, { id: 'q2' }],
        practiceProblems: [{ id: 'p1' }],
      },
    ];
    backfillLegacyProgress('u', chapters as any);

    // 章の全大問（3つ）が進捗として復元される
    expect(Object.keys(readSolvedMap('u')).length).toBe(3);
  });
});

describe('src の中にキー名の手書きが残っていない', () => {
  /**
   * 集約の意味は「1か所を直せば全部直る」こと。
   * 手書きが1つでも残っていると、そこだけ直し漏れる。
   */
  const FILES = [
    'src/App.tsx',
    'src/components/Home.tsx',
    'src/components/Onboarding.tsx',
    'src/components/ProfileModal.tsx',
    'src/components/SubjectSelection.tsx',
    'src/utils/googleAuth.ts',
    'src/utils/leaderboard.ts',
    'src/utils/userRegistry.ts',
    'src/utils/progress.ts',
  ];

  it('`profile_${...}` などのテンプレート手書きが無い', () => {
    // 集約先（userStorageKeys.ts）だけが接頭辞の文字列を持っている状態にする。
    const pattern = /`(profile|streak|lastActive|completed)_\$\{/;
    for (const file of FILES) {
      const src = read(file);
      const hit = src.match(pattern);
      expect(hit, `${file} にキー名の手書きが残っている: ${hit?.[0]}`).toBeNull();
    }
  });

  it('接頭辞の文字列を持っているのは userStorageKeys.ts だけ', () => {
    const src = read('src/utils/userStorageKeys.ts');
    for (const prefix of ["'profile_'", "'streak_'", "'lastActive_'", "'completed_'"]) {
      expect(src, `${prefix} が集約先に無い`).toContain(prefix);
    }
  });
});
