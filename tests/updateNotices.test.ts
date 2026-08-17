/**
 * ===================================================================
 * お知らせ（更新履歴）機能のテスト
 * ===================================================================
 * ご要望：
 *   「1つ1つのアップデートをお知らせ機能としてユーザーが確認できるようにしたい。
 *     （簡易的な修正・追加内容と日時程度）」
 *
 * 押さえるべきこと：
 *   ・更新内容と「日時」が必ず入っている（日付だけでは要件を満たさない）
 *   ・新しいものが先に出る
 *   ・未読が分かる（バッジ）／開いたら既読になる
 *   ・ホームから開ける導線がある
 *   ・内部用語を利用者に見せない
 */
import { describe, it, expect, beforeEach } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { UPDATE_NOTICES, NOTICE_KIND_META } from '../src/data/updateNotices';
import {
  formatNoticeDateTime,
  loadReadIds,
  markAllNoticesRead,
  relativeNoticeLabel,
  sortedNotices,
  unreadNoticeCount,
  unreadNotices,
} from '../src/utils/updateNotices';

const ROOT = path.resolve(__dirname, '..');
const read = (p: string) => fs.readFileSync(path.join(ROOT, p), 'utf-8');

const HOME = read('src/components/Home.tsx');
const MODAL = read('src/components/UpdateNoticeModal.tsx');

/** localStorage のごく単純なモック（テスト間で状態を持ち越さない） */
function installStorage() {
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
}

beforeEach(() => {
  installStorage();
});

describe('お知らせデータの形が守られている', () => {
  it('1件以上ある', () => {
    expect(UPDATE_NOTICES.length).toBeGreaterThan(0);
  });

  it('IDが一意（既読管理が壊れないため）', () => {
    const ids = UPDATE_NOTICES.map((n) => n.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('日付は YYYY-MM-DD、時刻は HH:MM で入っている（日時まで出すご要望）', () => {
    for (const n of UPDATE_NOTICES) {
      expect(n.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(n.time).toMatch(/^\d{2}:\d{2}$/);
    }
  });

  it('見出しと箇条書きが空でない（「簡易的な内容」を必ず伴う）', () => {
    for (const n of UPDATE_NOTICES) {
      expect(n.title.trim().length).toBeGreaterThan(4);
      expect(n.items.length).toBeGreaterThan(0);
      for (const item of n.items) {
        expect(item.trim().length).toBeGreaterThan(4);
      }
    }
  });

  it('種別は表示メタが定義されているものだけ', () => {
    for (const n of UPDATE_NOTICES) {
      expect(NOTICE_KIND_META[n.kind]).toBeDefined();
    }
  });

  it('内部用語（ファイル名・関数名）を利用者に見せていない', () => {
    const banned = ['.tsx', '.ts', 'useState', 'props', 'Firestore', 'localStorage', 'API'];
    for (const n of UPDATE_NOTICES) {
      const text = `${n.title} ${n.items.join(' ')}`;
      for (const word of banned) {
        expect(text).not.toContain(word);
      }
    }
  });

  it('今回の4つのご要望が履歴に載っている', () => {
    const all = UPDATE_NOTICES.map((n) => `${n.title} ${n.items.join(' ')}`).join('\n');
    expect(all).toContain('消去法');
    expect(all).toContain('再生ボタン');
    expect(all).toContain('第1問A');
    expect(all).toContain('第1問B');
    expect(all).toContain('ランキング');
    expect(all).toContain('0pt');
  });
});

describe('並び順', () => {
  it('日時の新しい順に並ぶ', () => {
    const list = sortedNotices();
    for (let i = 1; i < list.length; i += 1) {
      const prev = `${list[i - 1].date} ${list[i - 1].time}`;
      const cur = `${list[i].date} ${list[i].time}`;
      expect(prev >= cur).toBe(true);
    }
  });
});

describe('未読管理', () => {
  it('初回はすべて未読', () => {
    expect(unreadNoticeCount()).toBe(UPDATE_NOTICES.length);
    expect(unreadNotices()).toHaveLength(UPDATE_NOTICES.length);
  });

  it('既読にすると未読が0件になる', () => {
    markAllNoticesRead();
    expect(unreadNoticeCount()).toBe(0);
    expect(loadReadIds().size).toBe(UPDATE_NOTICES.length);
  });

  it('壊れた保存値でもクラッシュせず、全件未読として扱う', () => {
    localStorage.setItem('update_notices_read_v1', '{{壊れたJSON');
    expect(() => unreadNoticeCount()).not.toThrow();
    expect(unreadNoticeCount()).toBe(UPDATE_NOTICES.length);
  });

  it('あとから古い日付のお知らせを足しても取りこぼさない（ID集合方式）', () => {
    // 既読にした時点のIDだけが記録される。IDが増えれば未読として現れる。
    markAllNoticesRead();
    const stored = JSON.parse(localStorage.getItem('update_notices_read_v1')!);
    expect(Array.isArray(stored)).toBe(true);
    // 1件分を既読から抜くと、その1件だけが未読に戻る
    localStorage.setItem('update_notices_read_v1', JSON.stringify(stored.slice(1)));
    expect(unreadNoticeCount()).toBe(1);
  });
});

describe('日時の表示', () => {
  it('絶対日時が「YYYY年M月D日 HH:MM」で出る', () => {
    const notice = { id: 'x', date: '2026-08-17', time: '19:05', kind: 'fix' as const, title: 't', items: ['a'] };
    expect(formatNoticeDateTime(notice)).toBe('2026年8月17日 19:05');
  });

  it('相対表記が今日／きのう／N日前で出る', () => {
    const now = new Date(2026, 7, 17);
    const mk = (date: string) => ({ id: date, date, time: '10:00', kind: 'fix' as const, title: 't', items: ['a'] });
    expect(relativeNoticeLabel(mk('2026-08-17'), now)).toBe('今日');
    expect(relativeNoticeLabel(mk('2026-08-16'), now)).toBe('きのう');
    expect(relativeNoticeLabel(mk('2026-08-14'), now)).toBe('3日前');
    // 1週間以上前は日付表記に落ちる
    expect(relativeNoticeLabel(mk('2026-07-01'), now)).toBe('2026年7月1日');
  });
});

describe('画面への組み込み', () => {
  it('ホームにお知らせを開くベルがある', () => {
    expect(HOME).toContain('UpdateNoticeModal');
    expect(HOME).toContain('setShowNotices(true)');
    expect(HOME).toContain('お知らせ');
    expect(HOME).toContain('unreadNoticeCount');
  });

  it('未読件数がバッジとして出る', () => {
    expect(HOME).toContain('unreadCount > 0');
    expect(HOME).toContain("unreadCount > 9 ? '9+' : unreadCount");
  });

  it('モーダルは開いたときに既読化し、閉じ方が複数用意されている', () => {
    expect(MODAL).toContain('markAllNoticesRead()');
    expect(MODAL).toContain("e.key === 'Escape'");
    expect(MODAL).toContain('aria-label="お知らせを閉じる"');
    expect(MODAL).toContain('閉じる');
  });

  it('開いた時点の未読には NEW が残る（何が新しいか読めるようにする）', () => {
    expect(MODAL).toContain('unreadAtOpen');
    expect(MODAL).toContain('NEW');
  });
});
