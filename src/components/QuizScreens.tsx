/**
 * 演習画面（Quiz）と結果・解説画面（Explanation）のまとめ役
 *
 * ==================================================================
 * ■ なぜこのファイルを作ったのか
 * ==================================================================
 *
 * 起動時に必ずダウンロードされる JS の中で、いちばん重いのは
 * 問題データ本体（src/data 配下、実測 2.37 MB のチャンク）である。
 * これを起動時に固定していた静的な線は、実測でたった3本だった。
 *
 *   1. App.tsx           → allChapters   2,703,107 B（findChapterById）
 *   2. App.tsx           → chemistryData 1,253,813 B（handleReviewNote）
 *   3. ChapterSelection  → allChapters   2,703,107 B（getPartsOfSubject）
 *
 * このうち 1 がいちばん厄介だった。理由は★同期★だからである。
 *
 *     const selectedChapter = findChapterById(selectedChapterId);  // 描画中に実行
 *     …
 *     {appState === 'quiz' && selectedChapter && <Quiz chapter={selectedChapter} … />}
 *
 * findChapterById は全教科の章を連結して探すので、
 * 呼ぶだけで問題データ全部（2.7 MB）が必要になる。
 * しかも App.tsx の描画中に呼ばれているため、
 * 「必要になってから読む」形にするには非同期にするしかない。
 *
 * ==================================================================
 * ■ App.tsx 側で非同期にするのは駄目だった（表示が変わってしまう）
 * ==================================================================
 *
 * App.tsx の中で selectedChapter を await で取ろうとすると、
 * 解決するまでの間 selectedChapter が undefined になる。
 * すると上の条件式
 *
 *     appState === 'quiz' && selectedChapter && …
 *
 * が false になり、★演習画面が一瞬まったく描かれない★。
 * 「単元を選んだのに一瞬何も出ない」という、
 * 元のアプリには無かった見え方が生まれてしまう。
 * これは「表示を変えない」という約束に反する。
 *
 * ==================================================================
 * ■ そこで「画面ごと」遅延側に移した
 * ==================================================================
 *
 * 章を探す処理をこのファイル（＝遅延読み込みされる側）に移した。
 * App.tsx は章IDだけを渡し、章の実体を知らなくてよくなる。
 *
 *   App.tsx          … 章ID（文字列）だけを持つ。問題データを読まない
 *   このファイル      … 章IDから章を探し、Quiz / Explanation を描く
 *
 * この形にすると、App.tsx から src/data/allChapters への静的な線が消える。
 * そして「演習画面に入るまで問題データを読まない」が成立する。
 *
 * ==================================================================
 * ■ ちらつきを増やさないための約束
 * ==================================================================
 *
 * このファイル自身は App.tsx 側で React.lazy されるが、
 * fallback はあえて null（何も描かない）にしている。
 * ローディング表示を足すと「元には無かった表示」が一瞬出て消えることになり、
 * それ自体が見た目の変化になるため。
 *
 * ★重要★ 元のコードも
 *     {appState === 'quiz' && selectedChapter && …}
 * という形で「章が見つかるまで何も描かない」挙動だった。
 * つまり「読み込み中は何も出ない」は元からの挙動と同じであり、
 * 新しい待ち時間の見え方を持ち込んでいない。
 */
import React from 'react';
import { Quiz } from './Quiz';
import { Explanation } from './Explanation';
import { ErrorBoundary } from './ErrorBoundary';
import { findChapterById } from '../data/allChapters';

/** Quiz が結果として返す採点内容（App.tsx 側の onFinish にそのまま渡す） */
type QuizFinishResult = Parameters<React.ComponentProps<typeof Quiz>['onFinish']>[1];

interface QuizScreensProps {
  /** 'quiz'（演習中）か 'explanation'（結果・解説）か */
  screen: 'quiz' | 'explanation';
  /** 章ID。★問題データそのものではなく ID だけを受け取る★ */
  chapterId: string | null;
  mode: 'mini_test' | 'practice';
  answers: Record<string, string>;
  onFinish: (answers: Record<string, string>, result?: QuizFinishResult) => void;
  onBack: () => void;
  isGuest: boolean;
  isMobileView?: boolean;
  onExplanationChange?: (isExplanation: boolean) => void;
  resultTotalScore?: number;
  resultTotalCorrect?: number;
  resultTotalJudgeable?: number;
  resultTotalTimeSec?: number;
  questionRange?: { startIndex: number; endIndex: number } | null;
}

export function QuizScreens({
  screen,
  chapterId,
  mode,
  answers,
  onFinish,
  onBack,
  isGuest,
  isMobileView,
  onExplanationChange,
  resultTotalScore,
  resultTotalCorrect,
  resultTotalJudgeable,
  resultTotalTimeSec,
  questionRange,
}: QuizScreensProps) {
  /*
   * 章の解決はここで行う。
   *
   * ここは遅延読み込みされる側なので、この時点では
   * すでに問題データのチャンクが手元にある（＝同期で引ける）。
   * 元の App.tsx と同じ同期呼び出しのままなので、
   * 「探し方」も「見つからなかったときの挙動」も変わっていない。
   */
  const chapter = findChapterById(chapterId);

  /*
   * 見つからないときは何も描かない。
   * 元のコードの
   *     {appState === 'quiz' && selectedChapter && …}
   * と同じ挙動（条件が false なので何も出ない）を保っている。
   */
  if (!chapter) return null;

  if (screen === 'quiz') {
    return (
      <ErrorBoundary label="演習画面" onReset={onBack}>
        <Quiz
          mode={mode}
          chapter={chapter}
          onFinish={onFinish}
          onBack={onBack}
          isGuest={isGuest}
          isMobileView={isMobileView}
          onExplanationChange={onExplanationChange}
          questionRange={questionRange}
        />
      </ErrorBoundary>
    );
  }

  return (
    /* 結果・ランキング画面は問題データを一括で描画するため、
       1問でもデータ不備があると全体が表示できなくなる。
       エラーバウンダリで包み、真っ白な画面で操作不能にならないようにする。 */
    <ErrorBoundary label="結果・解説画面" onReset={onBack}>
      <Explanation
        mode={mode}
        chapter={chapter}
        answers={answers}
        onBack={onBack}
        isGuest={isGuest}
        // スマホではスマホ専用レイアウト（正誤一覧→タップで解説）で表示する。
        // PC は従来どおり（isMobileView=false → 2カラムレイアウト）。
        isMobileView={isMobileView}
        resultTotalScore={resultTotalScore}
        resultTotalCorrect={resultTotalCorrect}
        resultTotalJudgeable={resultTotalJudgeable}
        resultTotalTimeSec={resultTotalTimeSec}
        // 1回分（例：第3回演習）だけを解いたときは、その回だけを振り返る。
        // 解いていない回まで答え合わせに並ぶと、どこまでやったか分からなくなる。
        questionRange={questionRange}
      />
    </ErrorBoundary>
  );
}
