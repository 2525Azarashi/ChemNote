/**
 * 消去法タップの UX 改善（いただいたフィードバックへの対応）のテスト。
 *
 * ■ いただいたご指摘（要約）
 *   1. 「薄く消える」と「完全に消える」の意味の違いが伝わりにくい。
 *      色や透明度の違いだけだと、初見のユーザーは2段階あること自体に気づかない。
 *   2. 「今どの状態か」を視覚情報だけで判断する必要がある。
 *      見分けにくいと、事故的に選択肢を復活させてしまうリスクがある。
 *   3. （案B）状態ごとの見た目を明確化し、長押しで「一気にリセット」を追加する。
 *
 * ■ 実装が実際どうだったか（重要）
 *   ご指摘は「薄く消える → 完全に消える → 元に戻る」の3段階が前提でしたが、
 *   コードを確認すると消去の段階は1つ（斜線のみ）で、実際の循環は
 *      未選択 → 選択 → 斜線（消去）→ 未選択
 *   でした。つまり「消去の2段階」は存在せず、ご懸念のうち
 *   「薄い/完全の区別が伝わらない」は仕様上そもそも起きません。
 *   そのため案Bのうち「消去の段階ごとの描き分け」は対象外とし、
 *   残る本質的な課題＝「選択・斜線・未選択の3状態の見分けにくさ」と
 *   「事故的な復活のリスク」に絞って対応しています。
 *
 * ■ テストの方針
 *   Quiz.tsx は巨大で、描画には章データ・音声・Firebase など多くの前提が要る。
 *   ここでの関心は「意図した仕組みが入っているか」なので、
 *   ソースに対象の構造が含まれることを検査する方式にしている。
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const QUIZ = readFileSync(resolve(__dirname, '../src/components/Quiz.tsx'), 'utf-8');
const CSS = readFileSync(resolve(__dirname, '../src/index.css'), 'utf-8');

describe('前提: 消去の段階は1つで、循環は「未選択→選択→斜線→未選択」', () => {
  it('消去状態は配列への包含だけで表され、"薄い/完全"のような中間段階を持たない', () => {
    // 消去済み判定は「その選択肢が配列に入っているか」の2値のみ。
    expect(QUIZ).toContain('(eliminated[sqId] || []).includes(opt)');
    // 段階を数で持つ実装（0→1→2 のカウンタ）は存在しない。
    expect(QUIZ).not.toMatch(/eliminationLevel|strikeLevel|eliminateStage/);
  });

  it('斜線済みをタップすると、1回で未選択に戻る（段階を踏まない）', () => {
    expect(QUIZ).toMatch(/if \(struck\) \{[\s\S]{0,160}?restoreOption\(sq\.id, opt\)/);
  });
});

describe('改善1: 状態ごとの見た目を強くする（気づかれない・見分けにくいへの対応）', () => {
  it('★消去済みは「取り消し線＋グレー」だけでなく、破線の枠でも区別される', () => {
    // 色/透明度に依存せず、枠線の形状という別の手がかりを足している。
    expect(QUIZ).toContain('border-dashed');
  });

  it('★消去済みには✕バッジが重なり、色が見分けにくくても形で分かる', () => {
    expect(QUIZ).toMatch(/struck && \([\s\S]{0,400}?✕/);
    // 装飾なのでスクリーンリーダーからは隠す（読み上げは aria-label 側で行う）
    expect(QUIZ).toMatch(/struck && \([\s\S]{0,200}?aria-hidden="true"/);
  });

  it('★斜線を引いた瞬間にアニメーションが流れ、状態が変わったことを動きで伝える', () => {
    expect(QUIZ).toContain('animate-strike-out');
    expect(QUIZ).toContain('animate-draw-strike');
    expect(CSS).toContain('@keyframes strikeOutOption');
    expect(CSS).toContain('@keyframes drawStrikeLine');
  });

  it('アニメーションは直前に消した1つだけに流れる（全部が同時に動かない）', () => {
    // 対象は「設問ID + 選択肢」で1つに特定される。
    expect(QUIZ).toContain('const strikeAnimating = struck && justStruck ===');
    expect(QUIZ).toContain('setJustStruck(`${sqId}\\u0000${opt}`)');
  });

  it('動きを減らす設定の端末ではアニメーションを止める', () => {
    // prefers-reduced-motion を無視すると、酔いやすい方に負担をかけるため。
    expect(CSS).toMatch(/prefers-reduced-motion: reduce\)\s*\{[\s\S]{0,220}?animation: none/);
  });

  it('操作説明が、文字だけでなく各状態の見本付きで示される', () => {
    // 「斜線という段階がある」ことに初見で気づけるようにするため。
    expect(QUIZ).toContain('タップで選択');
    expect(QUIZ).toContain('もう一度で斜線');
    expect(QUIZ).toContain('さらにタップで元に戻る');
  });
});

describe('改善2: 長押しで一気にリセット（事故的な復活のリスクへの対応）', () => {
  it('★その設問の斜線をまとめて消す関数がある', () => {
    expect(QUIZ).toContain('const clearEliminated = (sqId: string)');
    // その設問のキーを丸ごと落とす（他の設問には触らない）
    expect(QUIZ).toMatch(/clearEliminated[\s\S]{0,320}?delete next\[sqId\]/);
  });

  it('★長押し（500ms）で発動し、Pointer Events でタッチ・マウス両方に対応する', () => {
    expect(QUIZ).toMatch(/setTimeout\([\s\S]{0,400}?clearEliminated\(sqId\)[\s\S]{0,200}?\}, 500\)/);
    expect(QUIZ).toContain('onPointerDown={() => beginLongPress(sq.id)}');
    // 指が離れた・外れた・キャンセルされた場合にタイマーを残さない
    for (const handler of ['onPointerUp={endLongPress}', 'onPointerLeave={endLongPress}', 'onPointerCancel={endLongPress}']) {
      expect(QUIZ, `${handler} が必要`).toContain(handler);
    }
  });

  it('★長押しの直後に通常タップが走らない（意図しない選択を防ぐ）', () => {
    // これが無いと、指を離した瞬間に onClick が発火して選択が入ってしまう。
    expect(QUIZ).toMatch(/if \(longPressFired\.current\) \{[\s\S]{0,160}?return;/);
  });

  it('斜線が1つも無いときは長押ししても何も起きない（誤爆しても害がない）', () => {
    expect(QUIZ).toMatch(/if \(!\(eliminated\[sqId\] \|\| \[\]\)\.length\) return;/);
  });

  it('長押し成立時は、モバイルの長押しメニューを抑制する', () => {
    expect(QUIZ).toMatch(/onContextMenu=\{\(e\) => \{[\s\S]{0,200}?preventDefault\(\)/);
  });

  it('アンマウント時にタイマーを片付ける（リークを残さない）', () => {
    expect(QUIZ).toContain('useEffect(() => () => endLongPress(), [])');
  });
});

describe('改善3: 状態を見た目以外でも分かるようにする', () => {
  it('★各選択肢の状態が aria-label で言葉として読み上げられる', () => {
    // 「視覚情報だけで判断させない」ためのラベル。
    expect(QUIZ).toContain('消去済み。タップで元に戻します');
    expect(QUIZ).toContain('選択中。タップで斜線を引きます');
  });

  it('★いま何個消しているかが件数として表示される', () => {
    expect(QUIZ).toContain('個を消去中（長押しでまとめて元に戻す）');
    // 件数の変化は読み上げにも伝える
    expect(QUIZ).toMatch(/aria-live="polite"[\s\S]{0,200}?個を消去中/);
  });

  it('消去中の表示は、1つも消していないときは出さない', () => {
    expect(QUIZ).toMatch(/\(eliminated\[sq\.id\] \|\| \[\]\)\.length > 0 && \(/);
  });
});

describe('回帰: 既存の設計を壊していない', () => {
  it('採点対象の解答（answers）と消去状態は別に保たれている', () => {
    // 混ぜると「消したつもりが解答になっていた」取り違えが起きるため。
    expect(QUIZ).toContain('const [eliminated, setEliminated] = useState<Record<string, string[]>>');
  });

  it('消去状態は端末に保存され、戻ってきても残る', async () => {
    // 以前は `expect(QUIZ).toContain('quiz_elim_')` だった。
    // ところが Quiz.tsx には別物の 'quiz_elim_hint_seen'（操作説明を見たか）
    // もあるので、保存キーを utils/quizStorageKeys.ts へ集約したあとでも
    // この文字列は残ってしまい、「消去状態が保存されているか」を
    // 確かめられていない状態（通っているが何も検証していない）だった。
    // 実際に使っているキー生成と、読み書き両方の存在で確認する。
    expect(QUIZ).toContain('quizElimKey(chapter.id, mode)');
    expect(QUIZ).toContain('localStorage.setItem(quizElimKey(chapter.id, mode)');
    expect(QUIZ).toContain('localStorage.getItem(quizElimKey(chapter.id, mode))');

    const { quizElimKey } = await import('../src/utils/quizStorageKeys');
    expect(quizElimKey('c1_1', 'practice')).toBe('quiz_elim_c1_1_practice');
    // 操作説明のキー（quiz_elim_hint_seen）とは別物であること
    expect(quizElimKey('c1_1', 'practice')).not.toBe('quiz_elim_hint_seen');
  });

  it('複数選択の設問では斜線を使わない（解除と消去の混同を避ける）', () => {
    expect(QUIZ).toMatch(/if \(isMultiple\) \{[\s\S]{0,700}?return;/);
  });

  it('消去モードの切替ボタンは復活していない', () => {
    // 「消去モード」の語はソースに残っているが、それは廃止理由を説明した
    // コメントのみ。実体（モードを持つ state）が無いことを確認する。
    expect(QUIZ).not.toMatch(/useState[^\n]*eliminationMode|useState[^\n]*isErasing/);
    expect(QUIZ).not.toMatch(/setEliminationMode|setIsErasing/);
  });
});
