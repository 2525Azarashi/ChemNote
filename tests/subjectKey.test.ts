/**
 * ===================================================================
 * 「教科ID の型」を1か所に集約したことの検証
 * ===================================================================
 *
 * アプリの中では「教科ID の並び」
 *
 *   'chemistry_basic' | 'chemistry' | 'english_listening'
 *   | 'english_grammar' | 'math' | 'biology_basic'
 *
 * がまったく同じ形で9か所に手書きされていた。
 * 教科を1つ増やすと9か所すべてを直す必要があり、
 * 1か所でも漏れると「その画面にだけ新しい教科を渡せない」状態になる。
 *
 * 集約後は data/allChapters.ts の SubjectKey が唯一の定義になる。
 *
 * -------------------------------------------------------------------
 * ■ このテストが見ていること
 * -------------------------------------------------------------------
 * 型は実行時に消えてしまうので、型そのものを比べることはできない。
 * そこで次の2段構えで守る。
 *
 *   1. 値の面：SUBJECTS の教科IDが、集約前と同じ6つ・同じ並びであること
 *   2. 型の面：各ファイルが公開している型に「6つの教科IDすべて」を
 *      代入できること（＝どれか1つでも欠けたらコンパイルが通らない）
 *
 * 2 は @ts-expect-error ではなく実際の代入で確かめる。
 * tsc --noEmit と vitest の両方でチェックが効く。
 */

import { describe, it, expect } from 'vitest';
import { SUBJECTS, type SubjectKey } from '../src/data/allChapters';
import type { SubjectId } from '../src/components/SubjectSelection';
import type { CatalogSubject } from '../src/data/chapterCatalog';
import type { TipSubject as ThemeSubject } from '../src/data/subjectTheme';
import type { TipSubject as MascotSubject } from '../src/data/mascotTips';

/**
 * 集約前に9か所へ手書きされていた「型の並び」（そのまま書き写したもの）。
 * ここを変えるということは「教科が増減した」という意味なので、
 * そのときは意図して直す。
 *
 * 注意：これは型の宣言順であって、画面の表示順ではない。
 * 表示順は SUBJECTS のほうが持っていて、両者は一致していない
 * （型は english_grammar が4番目、SUBJECTS では6番目）。
 * 型の宣言順に意味は無いので、そこは揃えずそのままにしてある。
 */
const LEGACY_SUBJECT_IDS = [
  'chemistry_basic',
  'chemistry',
  'english_listening',
  'english_grammar',
  'math',
  'biology_basic',
] as const;

/**
 * SUBJECTS が持っている「表示順」。
 * ホームの教科別進捗バーと科目選択カードがこの順で並ぶので、
 * 型の集約でうっかり並びが変わっていないことをここで押さえる。
 */
const DISPLAY_ORDER = [
  'chemistry_basic',
  'chemistry',
  'english_listening',
  'math',
  'biology_basic',
  'english_grammar',
] as const;

describe('SubjectKey（教科IDの型）の集約', () => {
  it('SUBJECTS の表示順が変わっていない', () => {
    // 並び順は画面にそのまま出るので、集合ではなく配列として比べる。
    expect(SUBJECTS.map((s) => s.id)).toEqual([...DISPLAY_ORDER]);
  });

  it('型に並んでいる教科と SUBJECTS の教科が、過不足なく同じ顔ぶれ', () => {
    // 並び順は違ってよいが、顔ぶれがズレていると
    // 「型では渡せるのに SUBJECTS に無い教科」が生まれてしまう。
    expect([...LEGACY_SUBJECT_IDS].sort()).toEqual(SUBJECTS.map((s) => s.id).sort());
  });

  it('6つの教科IDすべてが SubjectKey として扱える（欠けたら型エラーになる）', () => {
    // 実際に代入してみることで、型から教科が抜け落ちていないことを確かめる。
    const all: SubjectKey[] = [...LEGACY_SUBJECT_IDS];
    expect(all).toHaveLength(6);
  });

  it('集約対象の各ファイルの型が、同じ6つの教科IDを受け取れる', () => {
    // 型エイリアスにしただけなので、どれも SubjectKey と同じものを指すはず。
    // 1つでも別物になっていれば、この代入でコンパイルが落ちる。
    const asSubjectId: SubjectId[] = [...LEGACY_SUBJECT_IDS];
    const asCatalog: CatalogSubject[] = [...LEGACY_SUBJECT_IDS];
    const asTheme: ThemeSubject[] = [...LEGACY_SUBJECT_IDS];
    const asMascot: MascotSubject[] = [...LEGACY_SUBJECT_IDS];

    // 逆向き（SubjectKey へ戻せること）も確かめる。
    // 片方向だけだと「広い型に代入できているだけ」の可能性が残るため。
    const backFromSubjectId: SubjectKey[] = asSubjectId;
    const backFromCatalog: SubjectKey[] = asCatalog;
    const backFromTheme: SubjectKey[] = asTheme;
    const backFromMascot: SubjectKey[] = asMascot;

    for (const list of [backFromSubjectId, backFromCatalog, backFromTheme, backFromMascot]) {
      expect(list).toEqual([...LEGACY_SUBJECT_IDS]);
    }
  });
});
