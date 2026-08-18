/**
 * ===================================================================
 * 英語リスニング Wave D：1画面＝1問／選択肢を先に見せる／音源は問題側
 * ===================================================================
 * ご要望（原文）：
 *   > リスニングの修正をしたい。今リスニングは、第1問Aだったらどの回も
 *   > 問1〜問4を同じ進捗に入れてると思うんだけど、それもうやめて、
 *   > 問1で1つの進捗、問2で1つの進捗みたいな感じにしてほしい。
 *   > だから解説も修正な。で、後、問題文はスマホでスクロールとかしなくても
 *   > 選択肢の英文と図が一目に映るようにしてほしい。だから、選択肢の英文と図は
 *   > スマホだったら上に持ってきて、パソコンだったら右に持ってきてほしい。
 *   > 選択肢のところに英文を載せるのはまあいいけど、図は選択肢のところに
 *   > 載せるのやめよう。見にくい。いまこの音源の聞き方とかはもういらないので、
 *   > 問題をつけた今のこの上場面に4つの英文がしっかりと映るもしくは、
 *   > 図がしっかりと映るようにしてほしい。スクロールしてわざわざ答えるのめんどい。
 *   > 後音源はその画面の上側の問題のところに設置すること。
 *   > 選択肢のところに設置しても押しずらい
 *
 * これを D1〜D5 に分解してテストで固定する。
 *   D1  進捗を「問ごと」にする（回まるごと1進捗をやめる）
 *   D1b 解説も「その問だけ」に絞る
 *   D2  選択肢の英文・図はスマホでは上／PCでは右（スクロール不要）
 *   D3  図は選択肢の中に載せない
 *   D4  【音源の聞き方】等の定型ブロックを問題文から落とす
 *   D5  音源は画面上側の「問題のところ」に置く
 *
 * ★重要（回帰防止）★
 *   進捗を問ごとにするために教材データ（practiceProblems）を分割してはいけない。
 *   分割すると進捗台帳のキー（章ID::大問ID）が総入れ替えになり、
 *   これまでの学習記録が全部リセットされる。ここもテストで固定する。
 */
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import {
  buildListeningSteps,
  isPerSubQuestionListening,
  stepLabelOf,
  stepScoreKey,
} from '../src/utils/listeningSteps';
import { stripListeningHowToBlocks } from '../src/utils/listeningOptions';
import { EL1_A_EXTRA_PROBLEMS } from '../src/data/englishListeningQ1ASets';
import { EL1_B_PROBLEMS } from '../src/data/englishListeningQ1BProblems';
import { getAllListeningChapters } from '../src/data/englishListeningData';
import { chemistryData } from '../src/data/chemistryData';

const ROOT = path.resolve(__dirname, '..');
const read = (p: string) => fs.readFileSync(path.join(ROOT, p), 'utf-8');

const QUIZ = read('src/components/Quiz.tsx');
const EXPL = read('src/components/Explanation.tsx');
const PLAYER = read('src/components/ListeningAudioPlayer.tsx');
const FIGURE = read('src/components/QuestionFigure.tsx');

const chapter = (id: string) => {
  const c = getAllListeningChapters().find((x) => x.id === id);
  if (!c) throw new Error(`${id} が見つかりません`);
  return c;
};

// =====================================================================
// D1: 進捗を「問ごと」にする
// =====================================================================
describe('D1: 1画面＝1問（問1で1つの進捗、問2で1つの進捗）', () => {
  it('リスニングの大問は「1問ずつ」の対象になる', () => {
    // 第1問A・第1問B はどちらも音源つき・小問複数なので対象。
    expect(isPerSubQuestionListening(EL1_A_EXTRA_PROBLEMS[0])).toBe(true);
    expect(isPerSubQuestionListening(EL1_B_PROBLEMS[0])).toBe(true);
  });

  it('化学の大問は対象外（(1)の結果を(2)で使う構成を壊さない）', () => {
    // 音源を持たないので false。1問ずつに切ると前の設問を見返せず解けなくなる。
    const chem = (chemistryData as any).parts
      .flatMap((p: any) => p.chapters || [])
      .flatMap((c: any) => [...(c.miniTest || []), ...(c.practiceProblems || [])]);
    expect(chem.length).toBeGreaterThan(0);
    for (const p of chem) {
      expect(isPerSubQuestionListening(p)).toBe(false);
    }
  });

  it('音源はあっても小問が1つだけなら分割しない（分ける意味がない）', () => {
    expect(
      isPerSubQuestionListening({
        audioTracks: [{ subId: 'a' }],
        subQuestions: [{ id: 'a' }],
      }),
    ).toBe(false);
  });

  it('第1問A の1回ぶんが 問1〜問4 の4ステップに分かれる', () => {
    const steps = buildListeningSteps(EL1_A_EXTRA_PROBLEMS[0]);
    expect(steps.map((s) => s.label)).toEqual(['問1', '問2', '問3', '問4']);
    expect(steps.map((s) => s.index)).toEqual([0, 1, 2, 3]);
    // 各ステップのIDは、その回の小問IDと1対1で対応する
    expect(steps.map((s) => s.subQuestionId)).toEqual(
      EL1_A_EXTRA_PROBLEMS[0].subQuestions.map((sq: any) => sq.id),
    );
  });

  it('全リスニング大問でステップ数＝小問数（取りこぼしゼロ）', () => {
    for (const p of [...EL1_A_EXTRA_PROBLEMS, ...EL1_B_PROBLEMS]) {
      expect(buildListeningSteps(p).length).toBe(p.subQuestions.length);
    }
  });

  it('ラベルが「問N」で無いときも並び順から番号を作る（空表示にしない）', () => {
    expect(stepLabelOf({ label: '問 3 発話に合うイラスト' }, 0)).toBe('問3');
    expect(stepLabelOf({ label: '発話に合うイラスト' }, 1)).toBe('問2');
    expect(stepLabelOf({}, 2)).toBe('問3');
  });

  it('採点キーは「大問ID::小問ID」で、問ごとに別レコードになる', () => {
    expect(stepScoreKey('q_el1_A_set2', 'sq_x')).toBe('q_el1_A_set2::sq_x');
    expect(stepScoreKey('q1', 'a')).not.toBe(stepScoreKey('q1', 'b'));
  });

  it('Quiz が step の位置を端末に保存し、再開しても続きから解ける', () => {
    expect(QUIZ).toContain('quiz_step_');
    expect(QUIZ).toContain('const [stepIndex, setStepIndex]');
  });

  it('進捗ピルの分子・分母が問単位に切り替わる', () => {
    expect(QUIZ).toContain('const progressTotal = perStep ? listeningSteps.length : rangeCount');
    expect(QUIZ).toContain('const progressPosition = perStep ? safeStepIndex + 1 : rangePosition');
  });

  it('最後の問を解き終えるまで結果画面に進まない', () => {
    expect(QUIZ).toContain('const isLastStep = !perStep || safeStepIndex >= listeningSteps.length - 1');
    expect(QUIZ).toContain('const isLastQuestion = currentQuestionIndex >= rangeEnd && isLastStep');
  });

  it('「前へ」で回の先頭からでも前の回へ戻れる（押せないボタンを残さない）', () => {
    expect(QUIZ).toContain('const canGoPrevious');
    // 旧実装の「大問インデックスが0か」だけの判定は残っていない
    expect(QUIZ).not.toContain('currentQuestionIndex === 0');
  });

  it('解答欄には「いま解いている問」だけを描画する', () => {
    expect(QUIZ).toContain('const visibleGroupedSubQuestions');
    expect(QUIZ).toContain('visibleGroupedSubQuestions.map(');
  });
});

// =====================================================================
// D1 回帰防止：教材データは分割しない（学習記録を守る）
// =====================================================================
describe('D1 回帰防止：進捗台帳のキーを壊さない', () => {
  it('第1問A/B の大問数は据え置き（14 / 15）', () => {
    // ここが変わると solved_problems_v1 のキーが総入れ替えになり、
    // これまでの学習記録が全部「未着手」に戻る。
    expect(chapter('el1_A').practiceProblems.length).toBe(14);
    expect(chapter('el1_B').practiceProblems.length).toBe(15);
  });

  it('小問単位の採点は perQuestion ではなく perStep に入れる', () => {
    // progress.ts の backfillLegacyProgress は perQuestion のキーを
    // 「大問ID」としてそのまま読む。小問キーを混ぜると存在しない大問を
    // 解いたと数え、進捗が分母を超えてしまう。
    expect(QUIZ).toContain('perStep?: Record<string');
    expect(QUIZ).toMatch(/perQuestion:\s*perStep\s*\?\s*run\.perQuestion/);
    expect(QUIZ).toMatch(/perStep:\s*perStep\s*\?\s*\{\s*\.\.\.\(run\.perStep \|\| \{\}\)/);
  });
});

// =====================================================================
// D1b: 解説も「その問だけ」に絞る
// =====================================================================
describe('D1b: 解説も問ごと（先の問の正解が見えないようにする）', () => {
  it('Explanation が「いま解いた1問」を受け取れる', () => {
    expect(EXPL).toContain('focusSubQuestionId?: string | null');
    expect(EXPL).toContain('focusSubQuestionId }: ExplanationProps');
  });

  it('その問だけに subQuestions を絞り込む', () => {
    expect(EXPL).toContain('if (!focusSubQuestionId) return picked;');
    expect(EXPL).toContain('subs.filter((sq: any) => sq?.id === focusSubQuestionId)');
    expect(EXPL).toContain('subQuestions: hit,');
  });

  it('復習用の音源もその問のトラックだけにする', () => {
    expect(EXPL).toContain("tracks.filter((t: any) => t?.subId === focusSubQuestionId)");
  });

  it('Quiz が解説へ「いま解いた問」を渡している', () => {
    expect(QUIZ).toContain('focusSubQuestionId={perStep && activeStepSub ? activeStepSub.id : null}');
  });

  it('解説のスコアも問ごとの記録（perStep）から引く', () => {
    expect(QUIZ).toMatch(/run\.perStep\?\.\[stepScoreKey\(currentQuestion\.id, activeStepSub\.id\)\]/);
  });
});

// =====================================================================
// D2: 選択肢の英文と図を「スマホは上・PCは右」に置く
// =====================================================================
describe('D2: 選択肢の英文・図が一目に映る（スクロール不要）', () => {
  it('スマホでは解答ペイン（選択肢・図）を上に出す', () => {
    // flex-col-reverse で「問題文が下・解答が上」になる。
    // PC（lg:flex-row）では従来どおり左＝問題文／右＝解答。
    expect(QUIZ).toContain("listeningUnified ? 'flex-col-reverse' : 'flex-col'");
    expect(QUIZ).toContain('lg:flex-row');
  });

  it('リスニングでは問題文ペインの高さを絞って上側を解答に明け渡す', () => {
    // 50vh → 30vh。リード文（指示文）だけなのでこれで足りる。
    expect(QUIZ).toContain("listeningUnified ? 'max-h-[30vh]' : 'max-h-[50vh]'");
  });

  it('PC ではリスニングだけ右ペインを広げる（英文4つが折り返さない）', () => {
    expect(QUIZ).toContain("listeningUnified ? 'lg:w-[46%]' : 'lg:w-[58%]'");
    expect(QUIZ).toContain("listeningUnified ? 'lg:w-[54%]' : 'lg:w-[42%]'");
  });

  it('化学など従来の問題のレイアウトは変えない', () => {
    // listeningUnified=false 側の値が従来のまま残っていること。
    expect(QUIZ).toContain("'lg:w-[58%]'");
    expect(QUIZ).toContain("'lg:w-[42%]'");
    expect(QUIZ).toContain("'max-h-[50vh]'");
  });
});

// =====================================================================
// D3: 図は選択肢の中に載せない
// =====================================================================
describe('D3: 図を選択肢の中に載せない（見にくさの解消）', () => {
  it('図に高さ上限を付けられる', () => {
    expect(FIGURE).toContain('imgClassName');
    expect(FIGURE).toContain('imgClassName = \'\'');
  });

  it('リスニングの図は高さ上限つきで描画される（選択肢と同時に1画面）', () => {
    expect(QUIZ).toContain('imgClassName="max-h-[34vh] object-contain"');
    expect(QUIZ).toContain('imgClassName="max-h-[26vh] object-contain"');
  });

  it('図はタップで拡大できる（上限を付けても情報は失わない）', () => {
    expect(FIGURE).toContain('cursor-zoom-in');
    expect(FIGURE).toContain('setZoomed(true)');
  });
});

// =====================================================================
// D4: 【音源の聞き方】などの定型ブロックを落とす
// =====================================================================
describe('D4: 「音源の聞き方」等の定型説明を問題文から落とす', () => {
  it('【音源の聞き方】ブロックを丸ごと落とす', () => {
    const out = stripListeningHowToBlocks(
      ['第2回　第1問 A', '', '【音源の聞き方】', '・再生を押す', '・2回読み', '', '次の文を読め。'].join('\n'),
    );
    expect(out).not.toContain('音源の聞き方');
    expect(out).not.toContain('再生を押す');
    expect(out).toContain('次の文を読め。');
    expect(out).toContain('第2回　第1問 A');
  });

  it('【解き方のコツ】ブロックも落とす', () => {
    const out = stripListeningHowToBlocks(['【解き方のコツ】', '・先に選択肢を読む', '', '本文'].join('\n'));
    expect(out).not.toContain('解き方のコツ');
    expect(out).toContain('本文');
  });

  it('行の途中にある【難易度：…】は消さない（見出しではないので残す）', () => {
    const out = stripListeningHowToBlocks('第2回　第1問 A（4問・2回読み）　【難易度：易しめ（導入）】');
    expect(out).toContain('【難易度：易しめ（導入）】');
  });

  it('必要な見出し（【状況】など）は残す', () => {
    const out = stripListeningHowToBlocks(['【状況】', '空港のアナウンス', '', '本文'].join('\n'));
    expect(out).toContain('【状況】');
    expect(out).toContain('空港のアナウンス');
  });

  it('実データ（第1問A/B）から「音源の聞き方」が消える', () => {
    for (const p of [...EL1_A_EXTRA_PROBLEMS, ...EL1_B_PROBLEMS]) {
      expect(stripListeningHowToBlocks(p.text)).not.toContain('音源の聞き方');
    }
  });

  it('Quiz の問題文描画に組み込まれている（書いただけで未配線を防ぐ）', () => {
    expect(QUIZ).toContain('stripListeningHowToBlocks(');
    // stripListeningQuestionBlocks の結果をさらに通す二段構え
    expect(QUIZ).toMatch(
      /stripListeningHowToBlocks\(\s*stripListeningQuestionBlocks\(cleanQuestionText\(currentQuestion\.text\)\)/,
    );
  });
});

// =====================================================================
// D5: 音源は画面上側の「問題のところ」に置く
// =====================================================================
describe('D5: 音源は問題ブロックに横帯で置く（押しやすさ）', () => {
  it('inline に横並び（horizontal）モードがある', () => {
    expect(PLAYER).toContain("orientation?: 'vertical' | 'horizontal'");
    expect(PLAYER).toContain("const isRow = isInline && orientation === 'horizontal'");
  });

  it('Quiz が横帯モードで音源を描画する', () => {
    expect(QUIZ).toContain('orientation="horizontal"');
  });

  it('選択肢の左に細い縦列で差し込む旧レイアウトは廃止', () => {
    // 幅 4.5rem の縦列に押し込むと 再生/2回/0.75倍/標準 が小さくて押しにくい。
    expect(QUIZ).not.toContain("'flex flex-row items-start gap-3'");
  });

  it('横帯のボタンは 44px 以上のタップ領域を持つ', () => {
    expect(PLAYER).toContain('min-h-[3rem] min-w-[6rem] flex-1 flex-row');
    expect(PLAYER).toContain('min-h-[2.75rem] min-w-[4.25rem]');
    expect(PLAYER).toContain('min-h-[2.75rem] min-w-[3.5rem]');
  });

  it('見出しつきパネル（panel）は復活していない', () => {
    expect(QUIZ).not.toMatch(/<ListeningAudioPlayer(?![\s\S]{0,400}?variant="inline")/);
  });
});
