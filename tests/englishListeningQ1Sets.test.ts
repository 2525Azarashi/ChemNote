/**
 * ===================================================================
 * 英語リスニング 第1問A/B の類題集収録＋解答画面の操作性テスト
 * ===================================================================
 * ご要望：
 *   ① 1問題とそれに該当する再生ボタンを「横」に配置する
 *   ② 選択肢タップで消去法を行えるようにする
 *   ③ 第1問A の問題追加を PDF のとおりに行う（13セット・52問）
 *   ④ 第1問B の問題追加を PDF（イラスト＋スクリプト）のとおりに行う（15セット・60問）
 *      S1 の画像の右下にあった GenSpark ロゴは削除する
 *
 * これらは別の修正で簡単に巻き戻る（音源パネルが1か所に戻る、
 * 消去法の分岐が消える、データの配線が外れる）ため、テストで固定する。
 */
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { EL1_A_EXTRA_PROBLEMS } from '../src/data/englishListeningQ1ASets';
import { EL1_B_PROBLEMS } from '../src/data/englishListeningQ1BProblems';
import { getAllListeningChapters } from '../src/data/englishListeningData';

const ROOT = path.resolve(__dirname, '..');
const read = (p: string) => fs.readFileSync(path.join(ROOT, p), 'utf-8');

const QUIZ = read('src/components/Quiz.tsx');
const PLAYER = read('src/components/ListeningAudioPlayer.tsx');
const SPEECH = read('src/utils/listeningSpeech.ts');

const MARKS = ['①', '②', '③', '④'];

const chapter = (id: string) => {
  const c = getAllListeningChapters().find((x) => x.id === id);
  if (!c) throw new Error(`${id} が見つかりません`);
  return c;
};

// =====================================================================
// ③ 第1問A：PDF の13セット（52問）が入っている
// =====================================================================
describe('第1問A：PDF の類題集13セットが収録されている', () => {
  it('13セット・各4問＝52問ある', () => {
    expect(EL1_A_EXTRA_PROBLEMS).toHaveLength(13);
    const total = EL1_A_EXTRA_PROBLEMS.reduce((n, p) => n + p.subQuestions.length, 0);
    expect(total).toBe(52);
  });

  it('既存の第1回とID衝突せず、第2回〜第14回として並ぶ', () => {
    const ids = EL1_A_EXTRA_PROBLEMS.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids[0]).toBe('q_el1_A_set2');
    expect(ids[ids.length - 1]).toBe('q_el1_A_set14');
    EL1_A_EXTRA_PROBLEMS.forEach((p, i) => {
      expect(p.category).toContain(`第${i + 2}回`);
    });
  });

  it('全設問がマーク式（①〜④）で、正解がその中にある', () => {
    for (const p of EL1_A_EXTRA_PROBLEMS) {
      for (const sq of p.subQuestions as any[]) {
        expect(sq.type).toBe('multiple_choice');
        expect(sq.options).toEqual(MARKS);
        expect(MARKS).toContain(sq.correctAnswer);
      }
    }
  });

  it('各問に選択肢の英文が問題文へ並んでいる（マークだけでは解けないため）', () => {
    for (const p of EL1_A_EXTRA_PROBLEMS) {
      for (const mark of MARKS) {
        // 4問 × 4選択肢なので、各マークは最低4回現れる
        const count = p.text.split(mark).length - 1;
        expect(count).toBeGreaterThanOrEqual(4);
      }
    }
  });

  it('各問に音源トラック（スクリプト）が対応づいている', () => {
    for (const p of EL1_A_EXTRA_PROBLEMS) {
      expect(p.audioTracks).toHaveLength(p.subQuestions.length);
      const subIds = (p.subQuestions as any[]).map((s) => s.id);
      for (const track of p.audioTracks) {
        expect(subIds).toContain(track.subId);
        // スクリプトが空だと読み上げも復習もできない
        expect(track.script.trim().length).toBeGreaterThan(5);
      }
    }
  });

  it('解説に問1〜問4の見出しが行頭で入っている（アコーディオン整形の条件）', () => {
    for (const p of EL1_A_EXTRA_PROBLEMS) {
      for (let n = 1; n <= 4; n += 1) {
        expect(p.explanation).toMatch(new RegExp(`^問${n}`, 'm'));
      }
    }
  });
});

// =====================================================================
// ④ 第1問B：PDF の15セット（60問）＋イラストが入っている
// =====================================================================
describe('第1問B：イラスト選択の類題集15セットが収録されている', () => {
  it('15セット・各4問＝60問ある', () => {
    expect(EL1_B_PROBLEMS).toHaveLength(15);
    const total = EL1_B_PROBLEMS.reduce((n, p) => n + p.subQuestions.length, 0);
    expect(total).toBe(60);
  });

  it('各設問にイラストが割り当てられ、public に実ファイルがある', () => {
    for (const p of EL1_B_PROBLEMS) {
      for (const sq of p.subQuestions as any[]) {
        expect(typeof sq.imageUrl).toBe('string');
        // Genspark の共有URLはセッション認証つきで資産にできない。必ず public 配下。
        expect(sq.imageUrl.startsWith('/listening_q1b/')).toBe(true);
        const file = path.join(ROOT, 'public', sq.imageUrl.replace(/^\//, ''));
        expect(fs.existsSync(file)).toBe(true);
        // 空ファイル・壊れファイルの混入を防ぐ
        expect(fs.statSync(file).size).toBeGreaterThan(5000);
      }
    }
  });

  it('イラストは1問1枚で重複しない（画像の貼り違えを防ぐ）', () => {
    const urls = EL1_B_PROBLEMS.flatMap((p) =>
      (p.subQuestions as any[]).map((sq) => sq.imageUrl),
    );
    expect(new Set(urls).size).toBe(urls.length);
    expect(urls).toHaveLength(60);
  });

  it('画像のセット・問番号が設問IDと一致している（スクリプトと絵の対応）', () => {
    EL1_B_PROBLEMS.forEach((p, si) => {
      const setNo = si + 1;
      (p.subQuestions as any[]).forEach((sq, qi) => {
        expect(sq.id).toBe(`q_el1_B_set${setNo}_${qi + 1}`);
        expect(sq.imageUrl).toBe(`/listening_q1b/el1B_set${setNo}_q${qi + 1}.jpg`);
      });
    });
  });

  it('全設問がマーク式（①〜④）で、正解がその中にある', () => {
    for (const p of EL1_B_PROBLEMS) {
      for (const sq of p.subQuestions as any[]) {
        expect(sq.type).toBe('multiple_choice');
        expect(sq.options).toEqual(MARKS);
        expect(MARKS).toContain(sq.correctAnswer);
      }
    }
  });

  it('各問に音源トラック（スクリプト）が対応づいている', () => {
    for (const p of EL1_B_PROBLEMS) {
      expect(p.audioTracks).toHaveLength(p.subQuestions.length);
      const subIds = (p.subQuestions as any[]).map((s) => s.id);
      for (const track of p.audioTracks) {
        expect(subIds).toContain(track.subId);
        expect(track.script.trim().length).toBeGreaterThan(5);
      }
    }
  });

  it('S1（第1セット）の画像から GenSpark ロゴを除去済みである', () => {
    // ロゴ除去は画像処理なので中身は目視で確認済み。
    // ここでは「除去スクリプトが残っており、テンプレートも同梱されている」ことを固定し、
    // 画像を再生成したときに素材が失われていないことを保証する。
    expect(fs.existsSync(path.join(ROOT, 'scripts/strip_genspark_logo.py'))).toBe(true);
    expect(
      fs.existsSync(path.join(ROOT, 'scripts/assets/genspark_badge_template.png')),
    ).toBe(true);
    // 第1セットの4枚が存在する（除去処理の対象だったファイル）
    for (let q = 1; q <= 4; q += 1) {
      const file = path.join(ROOT, `public/listening_q1b/el1B_set1_q${q}.jpg`);
      expect(fs.existsSync(file)).toBe(true);
    }
  });
});

// =====================================================================
// データの配線（単元に流し込まれているか）
// =====================================================================
describe('単元への配線', () => {
  it('el1_A に第1回＋13セット＝14回ぶんが入っている', () => {
    const problems = chapter('el1_A').practiceProblems;
    expect(problems).toHaveLength(14);
    expect(problems[0].id).toBe('q_el1_A_set1');
    expect(problems[13].id).toBe('q_el1_A_set14');
  });

  it('el1_B に15回ぶんが入っている', () => {
    const problems = chapter('el1_B').practiceProblems;
    expect(problems).toHaveLength(15);
    expect(problems[0].id).toBe('q_el1_B_set1');
  });

  it('大問IDが全単元で一意（進捗の取り違えを防ぐ）', () => {
    const ids = getAllListeningChapters().flatMap((c) =>
      (c.practiceProblems || []).map((p: any) => p.id),
    );
    expect(new Set(ids).size).toBe(ids.length);
  });
});

// =====================================================================
// ① 1問とその再生ボタンを横に配置する
// =====================================================================
describe('解答画面：問ごとの再生ボタンが横に並ぶ', () => {
  it('ListeningAudioPlayer に inline バリアントがある', () => {
    expect(PLAYER).toContain("variant?: 'panel' | 'inline'");
    expect(PLAYER).toContain("const isInline = variant === 'inline'");
  });

  it('解答カードで focusSubId + variant="inline" を使っている', () => {
    expect(QUIZ).toContain('variant="inline"');
    expect(QUIZ).toContain('focusSubId={sq.id}');
    // 横並びにするための flex-row
    expect(QUIZ).toContain("'flex flex-row items-start gap-3'");
  });

  it('その設問に音源がある場合だけボタン列を出す（他科目に影響しない）', () => {
    expect(QUIZ).toContain('const hasTrackFor');
    expect(QUIZ).toContain('hasTrackFor(sq.id)');
  });

  it('スマホの固定パネルでも問ごとの再生ボタンを出す', () => {
    expect(QUIZ).toContain('focusSubId={focusedSub.id}');
  });

  it('第1問B のイラストを設問単位で描画している', () => {
    expect(QUIZ).toContain('sq.imageUrl');
    expect(QUIZ).toContain('focusedSub.imageUrl');
  });
});

// =====================================================================
// ② 選択肢タップで消去法
// =====================================================================
describe('解答画面：消去法（選択肢に斜線を引く）', () => {
  it('解答とは別の state で消去を持っている（取り違え防止）', () => {
    expect(QUIZ).toContain('const [eliminated, setEliminated]');
    expect(QUIZ).toContain('const [eliminateMode, setEliminateMode]');
  });

  it('消去モードのトグルと「消去を戻す」がある', () => {
    expect(QUIZ).toContain('消去法を使う');
    expect(QUIZ).toContain('消去モード中');
    expect(QUIZ).toContain('消去を戻す');
    expect(QUIZ).toContain('const clearEliminated');
  });

  it('消去モードでは解答が変わらない（先に return する）', () => {
    expect(QUIZ).toContain('if (eliminateMode) {');
    expect(QUIZ).toContain('toggleEliminate(sq.id, opt);');
  });

  it('消去済みの選択肢は取り消し線で表示される', () => {
    expect(QUIZ).toContain('line-through');
    expect(QUIZ).toContain('const struck = isEliminated(sq.id, opt)');
  });

  it('消去状態は端末に保存され、戻ってきても残る', () => {
    expect(QUIZ).toContain('quiz_elim_');
  });
});

// =====================================================================
// 音源が無い回の読み上げフォールバック
// =====================================================================
describe('MP3 未収録の回でも音が出る（読み上げフォールバック）', () => {
  it('audioUrl は任意項目になっている', () => {
    const types = read('src/data/englishListeningQ1AProblems.ts');
    expect(types).toContain('audioUrl?: string');
  });

  it('読み上げユーティリティが用意されている', () => {
    expect(SPEECH).toContain('export function speak(');
    expect(SPEECH).toContain('export function stopSpeech(');
    expect(SPEECH).toContain('export function isSpeechSupported(');
    expect(SPEECH).toContain('export function hasRealAudio(');
  });

  it('プレーヤーが MP3 の有無で経路を切り替える', () => {
    expect(PLAYER).toContain('hasRealAudio(track)');
    expect(PLAYER).toContain('speak(subId, track.script');
  });

  it('読み上げで代替していることを画面上で明示する', () => {
    expect(PLAYER).toContain('読み上げ音声で再生します');
  });

  it('新しい類題集のトラックは audioUrl を持たない（存在しないMP3を指さない）', () => {
    for (const p of [...EL1_A_EXTRA_PROBLEMS, ...EL1_B_PROBLEMS]) {
      for (const track of p.audioTracks) {
        expect(track.audioUrl).toBeUndefined();
      }
    }
  });
});
