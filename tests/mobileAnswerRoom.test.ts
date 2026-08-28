/**
 * スマホの「解答画面の場所の使い方」を固定するテスト
 * ===================================================================
 *
 * 目的
 * ─────────────────────────────────────────────────────────
 * ご指摘（スマートフォン版）3件に対する修正が、あとから
 * 「良かれと思った別の変更」で静かに戻ってしまうのを防ぐ。
 *
 *   B-1 選択肢の文章の幅が狭い。画面の幅に合わせ、④も見えるようにしたい。
 *   B-2 採点結果のところ →問3 って書いてあるところに問3◯を持ってきてコンパクトにする
 *   B-3 解答打つ時にこんなに画面塞がれるとしんどい。
 *       (ア) 前へ 1/9 次へ 完了のところは必要だけど、それ以外の☑️とか色々消せないの？
 *
 * ★このテストの限界を先に書く★
 * ─────────────────────────────────────────────────────────
 * これは「ソースに意図した指定が入っているか」を見る静的な検査で、
 * 実際のブラウザで何px になるかは測っていない。
 * 幅・高さの実測は別途ブラウザ（390x844）で行い、その値は
 * 各修正箇所のコメントに残している。
 * つまりこのテストが緑でも「見た目が正しい」ことの証明にはならない。
 * 逆に、このテストが赤いときは「意図した指定が失われた」ことは確実に言える。
 * ここを混同しないこと。
 *
 * ★もう一つの限界★
 * ─────────────────────────────────────────────────────────
 * B-3 で本当に画面を塞いでいた 60% は、ブラウザの操作バーと
 * キーボード（☑️ の行を含む）で、Webページからは消せない。
 * このテストが守れるのは「アプリ側の 15%」だけである。
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const read = (p: string) => readFileSync(resolve(__dirname, '..', p), 'utf-8');

/**
 * コメントを取り除く。
 * 「コメントに書いてあるだけ」で通ってしまうテストは、
 * 実装が消えても緑のままになり、いちばん危ない。
 */
function stripComments(src: string): string {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/^[ \t]*\/\/.*$/gm, '');
}

const QUIZ = stripComments(read('src/components/Quiz.tsx'));
const EXPL = stripComments(read('src/components/Explanation.tsx'));

describe('B-1 選択肢の文章の幅（スマホ）', () => {
  it('★解答欄ページャーの矢印は「切り替える先があるとき」だけ描く★', () => {
    // 390px 幅では左右で 56px ＝ 画面幅の 14% を占めていた。
    // 以前は !isDesktop なら常に描き、行き先が無いときは invisible
    // （＝見えないのに場所は取る）だった。これが幅不足の最大要因。
    // このガード式は3箇所で使われる：
    //   1. 「n / 全体」の位置表示（もともとガードされていた）
    //   2. 左矢印（今回ガードを追加）
    //   3. 右矢印（今回ガードを追加）
    const guarded = QUIZ.match(
      /!isDesktop && mobileAnswerSubs\.length > 1 && \(/g,
    );
    expect(guarded, '位置表示＋左右矢印の3箇所がガードされていること').toHaveLength(3);

    // 矢印2つが確かにガード下にあることを、goMobileAns の呼び出しとセットで見る。
    // （位置表示だけがガードされていて矢印が素通し、という状態を弾く）
    for (const dir of ['-1', '1']) {
      const re = new RegExp(
        `!isDesktop && mobileAnswerSubs\\.length > 1 && \\([\\s\\S]{0,400}?goMobileAns\\(${dir.replace('-', '\\-')}\\)`,
      );
      expect(QUIZ, `goMobileAns(${dir}) の矢印がガード下にあること`).toMatch(re);
    }
  });

  it('★矢印を「!isDesktop だけ」で描く書き方に戻っていない★', () => {
    // 戻し方としていちばん起きやすいのがこれなので、形で禁じる。
    expect(QUIZ).not.toMatch(/\{!isDesktop && \(\s*<button\s+type="button"\s+onClick=\{\(\) => goMobileAns/);
  });

  it('本文つき選択肢（英文）はスマホで左右余白を詰め、PC では元に戻す', () => {
    // px-4 → px-2.5、md 以上は md:px-4 で従来寸法に戻す。
    expect(QUIZ).toContain("stacked ? 'px-2.5 md:px-4' : 'px-4'");
  });

  it('★本文つき選択肢では高さ上限 max-h-[5rem] を外す（④が切れる直接原因）★', () => {
    // 英文が3行になると約88px 必要なのに 80px で打ち切られ、
    // 4つ合計が枠を超えて ④ がはみ出していた。
    expect(QUIZ).toContain("listeningMobileNoFigure && !stacked ? 'max-h-[5rem]' : ''");
  });

  it('★マークだけの選択肢（①②③④）には高さ上限を残す★', () => {
    // ここを一緒に外すと4択が画面を縦に埋め尽くし、
    // 「空白が無駄」を別の形で作り直すことになる。
    // !stacked のときだけ上限が付く、という形であることを確認する。
    expect(QUIZ).toMatch(/!stacked \? 'max-h-\[5rem\]'/);
  });

  it('リスニングのスマホでは解答ペインの左右余白を詰める（PC は md:p-8 のまま）', () => {
    expect(QUIZ).toContain("listeningMobileSplit ? 'px-2' : 'px-4'");
    expect(QUIZ).toContain('md:p-8');
  });
});

describe('B-2 採点結果をコンパクトに（スマホ）', () => {
  it('音源・スクリプトは変数に束ねられている', () => {
    expect(EXPL).toContain('const audioPlayerBlock =');
  });

  it('★スマホは正誤ボタンの後、PC は従来位置で描く（両方で必ず1回描かれる）★', () => {
    // PC 用：従来位置での描画（!reorderMobile のときだけ）
    expect(EXPL).toContain('{!reorderMobile && audioPlayerBlock}');
    // スマホ用：正誤ボタンの後での、条件なしの描画
    //   （reorderMobile の true 分岐の中なので条件は不要）
    expect(EXPL).toMatch(/^\s*\{audioPlayerBlock\}\s*$/m);
    // 定義1回 + 使用2回 = 3回だけ現れる（増えていたら二重描画の疑い）
    const all = EXPL.match(/audioPlayerBlock/g);
    expect(all, '定義1回＋使用2回であること').toHaveLength(3);
  });

  it('★PC で音源プレーヤーが消えていない★', () => {
    // 一度、単純に移動させて PC 側で消してしまった。
    // 移動先が reorderMobile の true 分岐の中だったため。
    // 「!reorderMobile のときに描く経路」が必ず存在することを固定する。
    expect(EXPL).toMatch(/!reorderMobile && audioPlayerBlock/);
  });

  it('正誤ボタンの一覧と案内文は残っている（消さずに並べ替えただけ）', () => {
    expect(EXPL).toContain('上の正誤ボタンをタップすると、その問の解答・解説が開きます');
    expect(EXPL).toContain("grid grid-cols-4 gap-2");
  });

  it('採点結果の内訳（正解／不正解／未解答）を消していない', () => {
    expect(EXPL).toContain('正解 {correctSqs.length}');
    expect(EXPL).toContain('不正解 {incorrectSqs.length}');
    expect(EXPL).toContain('未解答 {unansweredSqs.length}');
  });
});

describe('B-3 入力時の画面占有（スマホ）', () => {
  it('★入力中に引っ込める帯は3つ（ヘッダー・タイマー・問題見出し）★', () => {
    const hides = QUIZ.match(/!isDesktop && keyboardVisible \? 'hidden' : ''/g);
    expect(hides, 'ヘッダー／タイマー／問題ペイン見出しの3箇所').toHaveLength(3);
  });

  it('★「(ア) 前へ 1/9 次へ 完了」バーは消していない★', () => {
    // ここは「必要」と明言された。消したら要件違反。
    expect(QUIZ).toContain('floating-answer-bar');
    expect(QUIZ).toContain('前へ');
    expect(QUIZ).toContain('次へ');
    expect(QUIZ).toContain('完了');
    expect(QUIZ).toContain('{focusedIndex + 1}/{inputNavSubs.length}');
  });

  it('★入力バーを keyboardVisible で隠す条件が付いていない★', () => {
    // 上の3箇所と同じ書き方を、うっかり入力バーにも足すと
    // 「必要」と言われたものを消すことになる。
    // 入力バーの描画条件が focusedSub 基準のままであることを確認する。
    expect(QUIZ).toContain(
      "{!isDesktop && focusedSub && (isShortAnswerType(focusedSub) || focusedSub.type === 'descriptive') && (",
    );
  });

  it('タイマーの計測自体は止めていない（表示だけ隠す）', () => {
    // 隠すついでに止めると、時間無制限で解けてしまう。
    expect(QUIZ).toContain('running={!showingExplanation}');
  });

  it('PC には keyboardVisible での非表示がかからない', () => {
    // 3箇所すべて !isDesktop が前置されていること。
    // isDesktop を外した書き方が混ざっていないかを見る。
    const bare = QUIZ.match(/(?<!!isDesktop && )keyboardVisible \? 'hidden'/g);
    expect(bare, 'isDesktop ガードなしの hidden が無いこと').toBeNull();
  });
});

describe('健全性', () => {
  it('★コメントを外しても各指定が残っている（コメントだけで通っていない）★', () => {
    // stripComments 後の文字列で検査していることの自己確認。
    expect(QUIZ).not.toContain('★B-1：選択肢の本文幅を稼ぐため');
    expect(QUIZ).not.toContain('★B-3：解答を打っている間だけ');
    // それでも実装は残っている
    expect(QUIZ).toContain("listeningMobileSplit ? 'px-2' : 'px-4'");
    expect(QUIZ).toContain("!isDesktop && keyboardVisible ? 'hidden' : ''");
  });

  it('PC 版の寸法クラスを消していない（md: / lg: の指定が生きている）', () => {
    expect(QUIZ).toContain('md:px-4');
    expect(QUIZ).toContain('md:p-8');
    expect(QUIZ).toContain('lg:w-[42%]');
    expect(QUIZ).toContain('lg:w-[58%]');
  });
});
