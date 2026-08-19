/**
 * ===================================================================
 * 「忘却曲線と定着度」ダッシュボードの UI/UX 改善テスト
 * ===================================================================
 *
 * ご要望（原文）:
 *   ■ 現状の問題
 *   1. 全科目の復習問題が1つのリストに混在しており、
 *      どの科目の問題かが視覚的に分かりにくい
 *   2. 復習カード内に「苦手タグ」「難易度タグ」「回数」「問題文冒頭」
 *      などの情報が詰め込まれすぎており、視認性が低い
 *   3. 忘却曲線グラフのx軸ラベル(当日/1日/3日/7日...)が重なって表示されている
 *
 *   ■ 改善方針
 *   【1. 科目別に分離する】科目タブ＋「すべて」＋科目ごとの平均定着度
 *   【2. 復習カードをシンプルに再設計する】3行・バッジ2つ・タップで詳細展開・余白増
 *   【3. 忘却曲線グラフの見直し】x軸ラベルの重なり解消・凡例のコンパクト化
 *   【4. 全体レイアウト】件数バッジ維持・既定3件＋「もっと見る」・タブ連動
 *
 * ■ このテストの方針
 *   SVG の実寸や CSS の見た目は jsdom では検証できない。そこで、
 *     - 判断ロジック（科目判定・集計・要約・間引き）は純関数として検証する
 *     - 見た目に関わる部分は「コンポーネントのソースに、意図した構造が
 *       書かれているか」を検証して退行を防ぐ
 *   という2本立てにしている。
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import {
  ALL_SUBJECTS,
  UNKNOWN_SUBJECT,
  averageRetentionPercent,
  badgesForItem,
  filterBySubjectTab,
  formatScope,
  retentionOf,
  reviewSubjectStyle,
  subjectOfChapterId,
  subjectOfReviewItem,
  summarizeBySubject,
  summarizeQuestion,
  REVIEW_SUBJECT_LABELS,
  REVIEW_SUBJECT_SHORT_LABELS,
} from '../src/utils/reviewSubject';
import {
  estimateLabelWidth,
  formatDayLabel,
  hasOverlap,
  pickAxisTicks,
} from '../src/utils/forgettingCurveAxis';
import { REVIEW_INTERVALS_DAYS, type ReviewItem } from '../src/utils/reviewList';
import { chemistryData } from '../src/data/chemistryData';
import { getAllAdvancedChapters } from '../src/data/chemistryAdvancedData';
import { getAllListeningChapters } from '../src/data/englishListeningData';

const CHART = readFileSync(
  resolve(__dirname, '../src/components/ForgettingCurveChart.tsx'),
  'utf-8'
);
const HUB = readFileSync(resolve(__dirname, '../src/components/StudyHub.tsx'), 'utf-8');

/** テスト用の復習アイテムを作る */
function item(over: Partial<ReviewItem> = {}): ReviewItem {
  const now = Date.now();
  return {
    key: over.key ?? 'k1',
    chapterId: over.chapterId ?? 'c1_1',
    chapterTitle: over.chapterTitle,
    questionIndex: over.questionIndex,
    questionId: over.questionId ?? 'q1',
    subQuestionId: over.subQuestionId ?? 's1',
    subLabel: over.subLabel,
    questionText: over.questionText,
    correctAnswer: over.correctAnswer,
    lastWrongAnswer: over.lastWrongAnswer,
    box: over.box ?? 0,
    dueAt: over.dueAt ?? now,
    wrongCount: over.wrongCount ?? 1,
    correctCount: over.correctCount ?? 0,
    createdAt: over.createdAt ?? now,
    updatedAt: over.updatedAt ?? now,
  };
}

// ============================================================
// 改善方針1: 科目別に分離する
// ============================================================
describe('改善1: 科目別に分離する', () => {
  it('章IDから科目を判定できる（化学基礎／化学／英語リスニング）', () => {
    expect(subjectOfChapterId('c1_1')).toBe('chemistry_basic');
    expect(subjectOfChapterId('c6_7')).toBe('chemistry_basic');
    expect(subjectOfChapterId('a1_1')).toBe('chemistry');
    expect(subjectOfChapterId('a14_5')).toBe('chemistry');
    expect(subjectOfChapterId('el3')).toBe('english_listening');
    expect(subjectOfChapterId('el1_A')).toBe('english_listening');
    expect(subjectOfChapterId('el6_B')).toBe('english_listening');
  });

  it('枝番付きの章ID（化学基礎の c1_2_A / c1_2_B）も取りこぼさない', () => {
    // 実データに存在する形。当初の正規表現はこれを拾えず null にしていた。
    expect(subjectOfChapterId('c1_2_A')).toBe('chemistry_basic');
    expect(subjectOfChapterId('c1_2_B')).toBe('chemistry_basic');
  });

  it('判定できない章ID・空文字は null（データを捨てず「その他」に回せる）', () => {
    expect(subjectOfChapterId('')).toBeNull();
    expect(subjectOfChapterId(null)).toBeNull();
    expect(subjectOfChapterId(undefined)).toBeNull();
    expect(subjectOfChapterId('mock_exam_1')).toBeNull();
    // 'el…' が 'e' 始まりで化学基礎に化けないこと（接頭辞の取り違え防止）
    expect(subjectOfChapterId('e1_1')).toBeNull();
  });

  it('★実データの全章IDが、いずれかの科目に正しく分類される', () => {
    // 化学基礎（chemistryData の parts → chapters）
    const basicIds = (chemistryData as any).parts.flatMap((p: any) =>
      (p.chapters || []).map((c: any) => c.id)
    );
    expect(basicIds.length).toBeGreaterThan(0);
    for (const id of basicIds) {
      expect(subjectOfChapterId(id), `化学基礎の章ID ${id}`).toBe('chemistry_basic');
    }

    // 化学（発展）
    const advIds = getAllAdvancedChapters().map((c: any) => c.id);
    expect(advIds.length).toBeGreaterThan(0);
    for (const id of advIds) {
      expect(subjectOfChapterId(id), `化学の章ID ${id}`).toBe('chemistry');
    }

    // 英語リスニング
    const elIds = getAllListeningChapters().map((c: any) => c.id);
    expect(elIds.length).toBeGreaterThan(0);
    for (const id of elIds) {
      expect(subjectOfChapterId(id), `リスニングの章ID ${id}`).toBe('english_listening');
    }

    // 3科目の章IDが互いに衝突していない（衝突すると科目判定が壊れる）
    const all = [...basicIds, ...advIds, ...elIds];
    expect(new Set(all).size).toBe(all.length);
  });

  it('科目が判定できないアイテムは「その他」に集約される（表示から消えない）', () => {
    const it1 = item({ key: 'x', chapterId: 'unknown_chapter' });
    expect(subjectOfReviewItem(it1)).toBe(UNKNOWN_SUBJECT);

    const summaries = summarizeBySubject([it1]);
    expect(summaries).toHaveLength(1);
    expect(summaries[0].subject).toBe(UNKNOWN_SUBJECT);
    expect(summaries[0].label).toBe('その他');
  });

  it('科目ごとに集計され、表示順は 化学基礎 → 化学 → 英語リスニング に固定される', () => {
    const items = [
      item({ key: 'el', chapterId: 'el3' }),
      item({ key: 'a', chapterId: 'a1_1' }),
      item({ key: 'c', chapterId: 'c1_1' }),
    ];
    expect(summarizeBySubject(items).map((s) => s.subject)).toEqual([
      'chemistry_basic',
      'chemistry',
      'english_listening',
    ]);
  });

  it('アイテムが0件の科目はタブに出さない（押しても何も無いタブを作らない）', () => {
    const summaries = summarizeBySubject([item({ chapterId: 'c1_1' })]);
    expect(summaries).toHaveLength(1);
    expect(summaries[0].subject).toBe('chemistry_basic');
  });

  it('★科目ごとの「平均定着度」が算出される', () => {
    const maxBox = REVIEW_INTERVALS_DAYS.length - 1; // 定着度100%
    const items = [
      // 化学基礎: box 0（0%）と box max（100%）→ 平均 50%
      item({ key: 'c1', chapterId: 'c1_1', box: 0 }),
      item({ key: 'c2', chapterId: 'c2_1', box: maxBox }),
      // リスニング: box max のみ → 100%
      item({ key: 'e1', chapterId: 'el3', box: maxBox }),
    ];
    const summaries = summarizeBySubject(items);
    const basic = summaries.find((s) => s.subject === 'chemistry_basic')!;
    const listening = summaries.find((s) => s.subject === 'english_listening')!;

    expect(basic.total).toBe(2);
    expect(basic.avgRetention).toBe(50);
    expect(listening.total).toBe(1);
    expect(listening.avgRetention).toBe(100);
  });

  it('科目ごとの「今日の復習」件数（dueCount）も集計される', () => {
    const now = 1_000_000;
    const items = [
      item({ key: 'a', chapterId: 'c1_1', dueAt: now - 1 }), // 期限切れ = 要復習
      item({ key: 'b', chapterId: 'c1_1', dueAt: now + 1 }), // まだ先
      item({ key: 'c', chapterId: 'el3', dueAt: now }), // ちょうど = 要復習
    ];
    const summaries = summarizeBySubject(items, now);
    expect(summaries.find((s) => s.subject === 'chemistry_basic')!.dueCount).toBe(1);
    expect(summaries.find((s) => s.subject === 'english_listening')!.dueCount).toBe(1);
  });

  it('「すべて」タブは全件、科目タブはその科目だけを返す', () => {
    const items = [
      item({ key: 'c', chapterId: 'c1_1' }),
      item({ key: 'a', chapterId: 'a1_1' }),
      item({ key: 'e', chapterId: 'el3' }),
    ];
    expect(filterBySubjectTab(items, ALL_SUBJECTS)).toHaveLength(3);
    expect(filterBySubjectTab(items, 'chemistry_basic').map((i) => i.key)).toEqual(['c']);
    expect(filterBySubjectTab(items, 'chemistry').map((i) => i.key)).toEqual(['a']);
    expect(filterBySubjectTab(items, 'english_listening').map((i) => i.key)).toEqual(['e']);
  });

  it('科目ごとに異なる識別色を持つ（リストで見分けられる）', () => {
    const stripes = (['chemistry_basic', 'chemistry', 'english_listening'] as const).map(
      (s) => reviewSubjectStyle(s).stripeClass
    );
    expect(new Set(stripes).size).toBe(3);
  });

  it('タブ用の短縮ラベルが用意されている（スマホ幅で4つ並べられる長さ）', () => {
    expect(REVIEW_SUBJECT_SHORT_LABELS.english_listening).toBe('英語');
    expect(REVIEW_SUBJECT_LABELS.english_listening).toBe('英語リスニング');
    for (const label of Object.values(REVIEW_SUBJECT_SHORT_LABELS)) {
      expect(label.length).toBeLessThanOrEqual(4);
    }
  });

  it('StudyHub に科目タブ（role=tablist / aria-selected）が実装されている', () => {
    expect(HUB).toMatch(/aria-label="科目を選択"/u);
    expect(HUB).toMatch(/role="tablist"/u);
    expect(HUB).toMatch(/role="tab"/u);
    expect(HUB).toMatch(/aria-selected=\{isActive\}/u);
    // 「すべて」タブが存在する
    expect(HUB).toMatch(/label: 'すべて'/u);
    // タブ上に科目ごとの平均定着度を出している
    expect(HUB).toMatch(/定着 \$\{t\.avg\}%/u);
  });
});

// ============================================================
// 改善方針2: 復習カードをシンプルに再設計する
// ============================================================
describe('改善2: 復習カードをシンプルに再設計する', () => {
  it('1行目「出題範囲」— リスニングは「第N回 第1問 A」形式', () => {
    const el = item({ chapterId: 'el1_A', chapterTitle: '第1問 A', questionIndex: 2 });
    expect(formatScope(el)).toBe('第2回 第1問 A');
  });

  it('1行目「出題範囲」— 化学系は「章名 第N問」形式', () => {
    const chem = item({
      chapterId: 'a1_1',
      chapterTitle: '1章 物質の状態と平衡',
      questionIndex: 3,
    });
    expect(formatScope(chem)).toBe('1章 物質の状態と平衡 第3問');
  });

  it('1行目「出題範囲」— 章名や問題番号が欠けた古いデータでも空にならない', () => {
    expect(formatScope(item({ chapterId: 'c1_1', chapterTitle: undefined, questionIndex: undefined })))
      .toBe('c1_1');
    expect(formatScope(item({ chapterId: 'c1_1', chapterTitle: '1章 物質の構成' }))).toBe(
      '1章 物質の構成'
    );
  });

  it('2行目「設問の要約」— 最初の1文だけに短縮される', () => {
    const text = '次の物質の組み合わせを考える。ただし気体は理想気体とする。さらに温度は一定である。';
    const summary = summarizeQuestion(text);
    expect(summary).toBe('次の物質の組み合わせを考える。');
    expect(summary).not.toContain('理想気体');
  });

  it('2行目「設問の要約」— 長い場合は末尾が省略記号になる', () => {
    const long = 'あ'.repeat(200);
    const summary = summarizeQuestion(long, 44);
    expect(summary.endsWith('…')).toBe(true);
    expect(summary.length).toBeLessThanOrEqual(45);
  });

  it('2行目「設問の要約」— HTMLタグを描画せずテキストだけにする（XSS対策も兼ねる）', () => {
    const summary = summarizeQuestion('<img src=x onerror=alert(1)>水の状態変化について。');
    expect(summary).not.toContain('<');
    expect(summary).not.toContain('onerror');
    expect(summary).toContain('水の状態変化について');
  });

  it('2行目「設問の要約」— 改行・連続空白が1行に畳まれる（カードが縦に伸びない）', () => {
    expect(summarizeQuestion('A: Can I borrow this book?\nB: Sure.')).not.toContain('\n');
  });

  it('2行目「設問の要約」— 問題文が無い場合も崩れない', () => {
    expect(summarizeQuestion(undefined)).toBe('（問題文なし）');
    expect(summarizeQuestion('')).toBe('（問題文なし）');
    expect(summarizeQuestion('   ')).toBe('（問題文なし）');
  });

  it('2行目「設問の要約」— 前置きだけの短い1文なら続きも含めて情報量を確保する', () => {
    // 「次の問いに答えよ。」だけでは何の問題か分からないので続きを見せる
    const summary = summarizeQuestion('次の問いに答えよ。水の沸点について正しいものを選べ。');
    expect(summary).toContain('沸点');
  });

  it('★3行目「タグ類」— バッジは最大2つに制限される', () => {
    const maxBox = REVIEW_INTERVALS_DAYS.length - 1;
    // 習得済み＋間違い多数＝バッジ候補が最も多くなるケース
    const badges = badgesForItem(item({ box: maxBox, wrongCount: 9 }));
    expect(badges.length).toBeLessThanOrEqual(2);
  });

  it('3行目「タグ類」— 2回以上間違えたものに「苦手」バッジが付く', () => {
    expect(badgesForItem(item({ wrongCount: 3 })).map((b) => b.kind)).toContain('weak');
    expect(badgesForItem(item({ wrongCount: 3 }))[0].label).toBe('苦手 3回');
    // 1回だけならまだ「苦手」と断定しない
    expect(badgesForItem(item({ wrongCount: 1 })).map((b) => b.kind)).not.toContain('weak');
  });

  it('3行目「タグ類」— 定着度バッジは必ず出る', () => {
    const badges = badgesForItem(item({ box: 0 }));
    expect(badges.map((b) => b.kind)).toContain('retention');
    expect(badges.find((b) => b.kind === 'retention')!.label).toBe('定着 0%');
  });

  it('3行目「タグ類」— 最終ボックス到達で「習得済み」バッジになる', () => {
    const maxBox = REVIEW_INTERVALS_DAYS.length - 1;
    expect(badgesForItem(item({ box: maxBox })).map((b) => b.kind)).toContain('mastered');
  });

  it('定着度は box を 0〜100% に正しく写像する', () => {
    const maxBox = REVIEW_INTERVALS_DAYS.length - 1;
    expect(retentionOf(item({ box: 0 }))).toBe(0);
    expect(retentionOf(item({ box: maxBox }))).toBe(1);
    // 範囲外の値でも 0〜1 に収まる（壊れたデータで NaN を出さない）
    expect(retentionOf(item({ box: -5 }))).toBe(0);
    expect(retentionOf(item({ box: 999 }))).toBe(1);
  });

  it('平均定着度は空配列でも 0 を返す（0除算で NaN にしない）', () => {
    expect(averageRetentionPercent([])).toBe(0);
  });

  it('★カードは3行構成（出題範囲／要約／バッジ）で実装されている', () => {
    expect(HUB).toMatch(/1行目: 出題範囲/u);
    expect(HUB).toMatch(/2行目: 設問の要約/u);
    expect(HUB).toMatch(/3行目: タグ類（右寄せ・最大2つ）/u);
    expect(HUB).toMatch(/\{formatScope\(item\)\}/u);
    expect(HUB).toMatch(/\{summarizeQuestion\(item\.questionText\)\}/u);
    // 3行目は右寄せ
    expect(HUB).toMatch(/flex items-center justify-end gap-1\.5/u);
    // 要約は2行までに抑える
    expect(HUB).toMatch(/line-clamp-2/u);
  });

  it('★補足情報（正答・自分の解答・回数・予定日）は常時表示せず、展開時のみ出す', () => {
    // 開閉状態を持つ
    expect(HUB).toMatch(/const \[open, setOpen\] = useState\(false\)/u);
    expect(HUB).toMatch(/aria-expanded=\{open\}/u);
    expect(HUB).toMatch(/aria-controls=\{detailId\}/u);
    // 詳細は open のときだけ描画される
    expect(HUB).toMatch(/\{open && \(/u);

    // 「正答」「あなたの解答」「間違い」「復習正解」は詳細ブロック内にある
    const detailStart = HUB.indexOf('{/* ===== 詳細（タップで展開）===== */}');
    expect(detailStart).toBeGreaterThan(0);
    const headerPart = HUB.slice(HUB.indexOf('const ReviewCard'), detailStart);
    const detailPart = HUB.slice(detailStart);

    for (const label of ['正答: ', 'あなたの解答: ', '間違い {item.wrongCount}回', '復習正解 {item.correctCount}回']) {
      expect(detailPart, `${label} は詳細に入っているべき`).toContain(label);
      expect(headerPart, `${label} は常時表示すべきでない`).not.toContain(label);
    }
    // 予定日（formatDue）も閉じているときは出さない
    expect(headerPart).not.toContain('formatDue(');
    expect(detailPart).toContain('formatDue(item.dueAt, now)');
  });

  it('カードの余白が確保され、科目識別の色帯が付いている', () => {
    // 閉じた状態のヘッダに padding（py-4 / sm:py-5）が入っている
    expect(HUB).toMatch(/pl-5 pr-4 py-4 sm:pl-6 sm:pr-5 sm:py-5/u);
    // 左端の色帯
    expect(HUB).toMatch(/absolute left-0 top-0 bottom-0 w-1\.5 \$\{style\.stripeClass\}/u);
  });

  it('カード全体をボタンで包まない（ボタンの入れ子を作らない）', () => {
    // 開閉トリガの button が閉じたあとに、詳細の操作ボタンが来る構造
    const trigger = HUB.indexOf('aria-controls={detailId}');
    const triggerEnd = HUB.indexOf('</button>', trigger);
    const detail = HUB.indexOf('{/* ===== 詳細（タップで展開）===== */}');
    expect(trigger).toBeGreaterThan(0);
    expect(triggerEnd).toBeGreaterThan(trigger);
    expect(detail).toBeGreaterThan(triggerEnd);
  });
});

// ============================================================
// 改善方針3: 忘却曲線グラフの見直し
// ============================================================
describe('改善3: 忘却曲線グラフの見直し', () => {
  // 実装と同じ座標系（ForgettingCurveChart.tsx より）
  const W = 320;
  const padL = 30;
  const padR = 12;
  const plotW = W - padL - padR;
  const maxDays = REVIEW_INTERVALS_DAYS[REVIEW_INTERVALS_DAYS.length - 1];
  const xForDays = (d: number) => padL + (Math.min(d, maxDays) / maxDays) * plotW;

  it('前提: 復習間隔をそのまま全部描くと、実際にラベルが重なる（＝ご指摘の再現）', () => {
    const allTicks = REVIEW_INTERVALS_DAYS.map((d) => ({
      days: d,
      label: formatDayLabel(d),
      x: xForDays(d),
    }));
    // 改善前の状態＝重なっている
    expect(hasOverlap(allTicks, 8)).toBe(true);
  });

  it('★間引き後は、PC幅でもスマホ幅でもラベルが重ならない', () => {
    for (const fontSize of [8, 11]) {
      const ticks = pickAxisTicks(REVIEW_INTERVALS_DAYS, xForDays, fontSize, 4);
      expect(hasOverlap(ticks, fontSize), `fontSize=${fontSize} で重なっている`).toBe(false);
    }
  });

  it('両端（当日・60日）は必ず残る — 軸の範囲が読み取れる', () => {
    for (const fontSize of [8, 11, 16]) {
      const ticks = pickAxisTicks(REVIEW_INTERVALS_DAYS, xForDays, fontSize, 4);
      expect(ticks[0].days).toBe(0);
      expect(ticks[ticks.length - 1].days).toBe(maxDays);
      expect(ticks[0].label).toBe('当日');
    }
  });

  it('スマホ幅（太い見積り）では、PC幅より強く間引かれる', () => {
    const pc = pickAxisTicks(REVIEW_INTERVALS_DAYS, xForDays, 8, 4);
    const mobile = pickAxisTicks(REVIEW_INTERVALS_DAYS, xForDays, 11, 4);
    expect(mobile.length).toBeLessThanOrEqual(pc.length);
    // どちらも最低2つ（両端）は残る
    expect(mobile.length).toBeGreaterThanOrEqual(2);
  });

  it('間引きは元の順序・日数を保つ（並べ替えや値の改変をしない）', () => {
    const ticks = pickAxisTicks(REVIEW_INTERVALS_DAYS, xForDays, 8, 4);
    const days = ticks.map((t) => t.days);
    expect(days).toEqual([...days].sort((a, b) => a - b));
    for (const d of days) {
      expect(REVIEW_INTERVALS_DAYS).toContain(d as any);
    }
  });

  it('ラベル文字列は「当日 / N日」形式', () => {
    expect(formatDayLabel(0)).toBe('当日');
    expect(formatDayLabel(1)).toBe('1日');
    expect(formatDayLabel(60)).toBe('60日');
  });

  it('文字幅の見積りは、全角を半角より広く数える', () => {
    expect(estimateLabelWidth('当日', 10)).toBeGreaterThan(estimateLabelWidth('60', 10));
  });

  it('目盛りが1つ以下でも落ちない', () => {
    expect(pickAxisTicks([], xForDays, 8)).toEqual([]);
    expect(pickAxisTicks([7], xForDays, 8)).toHaveLength(1);
  });

  it('グラフ側は間引き結果だけを描画している（全件描画に戻っていない）', () => {
    expect(CHART).toMatch(/pickAxisTicks\(/u);
    expect(CHART).toMatch(/\{ticks\.map\(\(t\) => \(/u);
    // 以前の「REVIEW_INTERVALS_DAYS を直接 map して text を描く」実装が残っていない
    expect(CHART).not.toMatch(/REVIEW_INTERVALS_DAYS\.map\(\(d\) => \(\s*<text/u);
  });

  it('★凡例はアイコン＋短縮ラベルで、正式名称は title に残す', () => {
    // 短縮ラベル
    for (const short of ['復習なし', '復習あり', '要復習', 'あなた']) {
      expect(CHART).toContain(`<span>${short}</span>`);
    }
    // 以前のフルネームは本文から消えている（折り返しの原因だった）
    expect(CHART).not.toContain('復習なしの忘却曲線\n');
    expect(CHART).not.toContain('間隔反復での定着\n');
    // 意味は title で保持
    expect(CHART).toMatch(/title="復習しなかった場合の忘却曲線（理論値）"/u);
    expect(CHART).toMatch(/title="間隔反復（復習）による理想的な定着"/u);
    expect(CHART).toMatch(/title="いま復習すべき問題（復習推奨）"/u);
    expect(CHART).toMatch(/title="あなたが解いた問題の現在の定着度"/u);
  });

  it('グラフは渡された items だけを見る（科目タブと連動できる）', () => {
    expect(CHART).toMatch(/subjectLabel\?: string/u);
    expect(CHART).toMatch(/\$\{subjectLabel\}の忘却曲線と定着度/u);
    expect(CHART).toMatch(/averageRetentionPercent\(items\)/u);
  });
});

// ============================================================
// 改善方針4: 全体レイアウト
// ============================================================
describe('改善4: 全体レイアウト', () => {
  it('★「今日の復習」件数バッジは維持されている', () => {
    expect(HUB).toMatch(/今日の復習 <span className="text-\[#E8688E\]">\{scopedDueItems\.length\}<\/span> 件/u);
    // 上部サマリーの件数バッジも残っている
    expect(HUB).toMatch(/今日の復習（全科目）/u);
  });

  it('★カードリストは既定3件で、「もっと見る」で展開する', () => {
    expect(HUB).toMatch(/const CollapsibleReviewList/u);
    expect(HUB).toMatch(/initialCount = 3/u);
    expect(HUB).toMatch(/initialCount=\{3\}/u);
    expect(HUB).toMatch(/もっと見る（あと\$\{hiddenCount\}件）/u);
    expect(HUB).toMatch(/表示を減らす/u);
    // 展開前は slice で絞る
    expect(HUB).toMatch(/items\.slice\(0, initialCount\)/u);
  });

  it('件数が3件以下のときは「もっと見る」を出さない', () => {
    // hasMore の条件がソースにあることで、無意味なボタンが出ないことを担保
    expect(HUB).toMatch(/const hasMore = items\.length > initialCount/u);
    expect(HUB).toMatch(/\{hasMore && \(/u);
  });

  it('★科目タブ切り替えでグラフと復習リストの両方が連動する', () => {
    // 両方が同じ scoped データを見ている
    expect(HUB).toMatch(/<ForgettingCurveChart items=\{scopedItems\}/u);
    expect(HUB).toMatch(/items=\{scopedDueItems\}/u);
    // scoped データは科目タブから導出されている
    expect(HUB).toMatch(/filterBySubjectTab\(reviewItems, subjectTab\)/u);
    // 同じ tabpanel に入っている
    expect(HUB).toMatch(/id="subject-scoped-panel"/u);
    expect(HUB).toMatch(/aria-controls="subject-scoped-panel"/u);
  });

  it('選択中の科目が消えたら「すべて」に戻す（選択が宙に浮かない）', () => {
    expect(HUB).toMatch(/setSubjectTab\(ALL_SUBJECTS\)/u);
    expect(HUB).toMatch(/!subjectSummaries\.some\(\(s\) => s\.subject === subjectTab\)/u);
  });

  it('「すべて」タブのときだけカードに科目名を出す', () => {
    expect(HUB).toMatch(/showSubject=\{subjectTab === ALL_SUBJECTS\}/u);
  });

  it('下部タブ（今日の復習／すべて）の件数も科目に連動する', () => {
    expect(HUB).toMatch(/id: 'today', label: '今日の復習', count: scopedDueItems\.length/u);
    expect(HUB).toMatch(/id: 'all', label: 'すべて', count: scopedItems\.length \+ notes\.length/u);
  });

  it('タップ領域は44px以上を維持している（既存のアクセシビリティ方針）', () => {
    expect(HUB).toMatch(/min-h-\[44px\]/u);
  });
});
