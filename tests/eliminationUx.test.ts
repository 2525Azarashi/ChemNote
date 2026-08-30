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
// 選択肢ボタン群は components/MultipleChoiceControl.tsx へ切り出したので、
// 「選択肢そのものの見た目・操作」に関する検査はこちらを読む。
const MC = readFileSync(resolve(__dirname, '../src/components/MultipleChoiceControl.tsx'), 'utf-8');
// 消去状態そのものと長押しのしくみは hooks/useElimination.ts へまとめたので、
// 「state の持ち方・保存・タイマー」に関する検査はこちらを読む。
const ELIM = readFileSync(resolve(__dirname, '../src/hooks/useElimination.ts'), 'utf-8');
// 問題文ペイン（左58%／スマホ上）の JSX は components/ProblemPane.tsx へ切り出した。
const PROBLEM = readFileSync(resolve(__dirname, '../src/components/ProblemPane.tsx'), 'utf-8');
// 解答ペイン（右42%／スマホ下）の JSX は components/AnswerPane.tsx へ切り出した。
const ANSWER = readFileSync(resolve(__dirname, '../src/components/AnswerPane.tsx'), 'utf-8');
// ヘッダー帯（単元名・スコア・順位・進捗）は components/QuizHeader.tsx へ切り出した。
const HEADER = readFileSync(resolve(__dirname, '../src/components/QuizHeader.tsx'), 'utf-8');
// スマホ下部の固定バー2本（ナビ／入力補助）は
// components/MobileFloatingBar.tsx へ切り出した。
const FLOAT = readFileSync(resolve(__dirname, '../src/components/MobileFloatingBar.tsx'), 'utf-8');
// 設問から作る「表示用の派生値」（useMemo 17個）は
// hooks/useQuestionDerived.ts へ切り出した。
const DERIVED = readFileSync(resolve(__dirname, '../src/hooks/useQuestionDerived.ts'), 'utf-8');
// 採点処理の本体（137行）は utils/quizScoring.ts へ
const SCORING = readFileSync(resolve(__dirname, '../src/utils/quizScoring.ts'), 'utf-8');
// 解答解説の画面（早期 return の JSX 50行）は components/ExplanationScreen.tsx へ
const EXPL_SCREEN = readFileSync(resolve(__dirname, '../src/components/ExplanationScreen.tsx'), 'utf-8');
// リスニングの「問題の説明ページ」（早期 return の JSX 64行）は
// components/ListeningBriefing.tsx へ
const BRIEFING = readFileSync(resolve(__dirname, '../src/components/ListeningBriefing.tsx'), 'utf-8');
const CSS = readFileSync(resolve(__dirname, '../src/index.css'), 'utf-8');

describe('前提: 消去の段階は1つで、循環は「未選択→選択→斜線→未選択」', () => {
  it('消去状態は配列への包含だけで表され、"薄い/完全"のような中間段階を持たない', () => {
    // 消去済み判定は「その選択肢が配列に入っているか」の2値のみ。
    expect(ELIM).toContain('(eliminated[sqId] || []).includes(opt)');
    // 段階を数で持つ実装（0→1→2 のカウンタ）は存在しない。
    expect(QUIZ).not.toMatch(/eliminationLevel|strikeLevel|eliminateStage/);
  });

  it('斜線済みをタップすると、1回で未選択に戻る（段階を踏まない）', () => {
    expect(MC).toMatch(/if \(struck\) \{[\s\S]{0,160}?restoreOption\(sq\.id, opt\)/);
  });
});

describe('改善1: 状態ごとの見た目を強くする（気づかれない・見分けにくいへの対応）', () => {
  it('★消去済みは「取り消し線＋グレー」だけでなく、破線の枠でも区別される', () => {
    // 色/透明度に依存せず、枠線の形状という別の手がかりを足している。
    // 実体は選択肢ボタン（MultipleChoiceControl.tsx）側。以前は Quiz.tsx を見ていたが、
    // 問題文ペインの区切り線にも border-dashed があり、それに当たって通ってしまっていた。
    expect(MC).toContain('border-dashed');
  });

  it('★消去済みには✕バッジが重なり、色が見分けにくくても形で分かる', () => {
    expect(MC).toMatch(/struck && \([\s\S]{0,400}?✕/);
    // 装飾なのでスクリーンリーダーからは隠す（読み上げは aria-label 側で行う）
    expect(MC).toMatch(/struck && \([\s\S]{0,200}?aria-hidden="true"/);
  });

  it('★斜線を引いた瞬間にアニメーションが流れ、状態が変わったことを動きで伝える', () => {
    expect(MC).toContain('animate-strike-out');
    expect(MC).toContain('animate-draw-strike');
    expect(CSS).toContain('@keyframes strikeOutOption');
    expect(CSS).toContain('@keyframes drawStrikeLine');
  });

  it('アニメーションは直前に消した1つだけに流れる（全部が同時に動かない）', () => {
    // 対象は「設問ID + 選択肢」で1つに特定される。
    expect(MC).toContain('const strikeAnimating = struck && justStruck ===');
    expect(ELIM).toContain('setJustStruck(`${sqId}\\u0000${opt}`)');
  });

  it('動きを減らす設定の端末ではアニメーションを止める', () => {
    // prefers-reduced-motion を無視すると、酔いやすい方に負担をかけるため。
    expect(CSS).toMatch(/prefers-reduced-motion: reduce\)\s*\{[\s\S]{0,220}?animation: none/);
  });

  it('操作説明が、文字だけでなく各状態の見本付きで示される', () => {
    // 「斜線という段階がある」ことに初見で気づけるようにするため。
    expect(QUIZ).toContain('タップで選択');
    expect(MC).toContain('もう一度で斜線');
    expect(MC).toContain('さらにタップで元に戻る');
  });
});

describe('改善2: 長押しで一気にリセット（事故的な復活のリスクへの対応）', () => {
  it('★その設問の斜線をまとめて消す関数がある', () => {
    expect(ELIM).toContain('const clearEliminated = (sqId: string)');
    // その設問のキーを丸ごと落とす（他の設問には触らない）
    expect(ELIM).toMatch(/clearEliminated[\s\S]{0,320}?delete next\[sqId\]/);
  });

  it('★長押し（500ms）で発動し、Pointer Events でタッチ・マウス両方に対応する', () => {
    expect(ELIM).toMatch(/setTimeout\([\s\S]{0,400}?clearEliminated\(sqId\)[\s\S]{0,200}?\}, 500\)/);
    expect(MC).toContain('onPointerDown={() => beginLongPress(sq.id)}');
    // 指が離れた・外れた・キャンセルされた場合にタイマーを残さない
    for (const handler of ['onPointerUp={endLongPress}', 'onPointerLeave={endLongPress}', 'onPointerCancel={endLongPress}']) {
      expect(MC, `${handler} が必要`).toContain(handler);
    }
  });

  it('★長押しの直後に通常タップが走らない（意図しない選択を防ぐ）', () => {
    // これが無いと、指を離した瞬間に onClick が発火して選択が入ってしまう。
    expect(MC).toMatch(/if \(longPressFired\.current\) \{[\s\S]{0,160}?return;/);
  });

  it('斜線が1つも無いときは長押ししても何も起きない（誤爆しても害がない）', () => {
    expect(ELIM).toMatch(/if \(!\(eliminated\[sqId\] \|\| \[\]\)\.length\) return;/);
  });

  it('長押し成立時は、モバイルの長押しメニューを抑制する', () => {
    expect(MC).toMatch(/onContextMenu=\{\(e\) => \{[\s\S]{0,200}?preventDefault\(\)/);
  });

  it('アンマウント時にタイマーを片付ける（リークを残さない）', () => {
    expect(ELIM).toContain('useEffect(() => () => endLongPress(), [])');
  });
});

describe('改善3: 状態を見た目以外でも分かるようにする', () => {
  it('★各選択肢の状態が aria-label で言葉として読み上げられる', () => {
    // 「視覚情報だけで判断させない」ためのラベル。
    expect(MC).toContain('消去済み。タップで元に戻します');
    expect(MC).toContain('選択中。タップで斜線を引きます');
  });

  it('★いま何個消しているかが件数として表示される', () => {
    expect(MC).toContain('個を消去中（長押しでまとめて元に戻す）');
    // 件数の変化は読み上げにも伝える
    expect(MC).toMatch(/aria-live="polite"[\s\S]{0,200}?個を消去中/);
  });

  it('消去中の表示は、1つも消していないときは出さない', () => {
    expect(MC).toMatch(/\(eliminated\[sq\.id\] \|\| \[\]\)\.length > 0 && \(/);
  });
});

describe('回帰: 既存の設計を壊していない', () => {
  it('採点対象の解答（answers）と消去状態は別に保たれている', () => {
    // 混ぜると「消したつもりが解答になっていた」取り違えが起きるため。
    expect(ELIM).toContain('const [eliminated, setEliminated] = useState<Record<string, string[]>>');
  });

  it('消去状態は端末に保存され、戻ってきても残る', async () => {
    // 以前は `expect(QUIZ).toContain('quiz_elim_')` だった。
    // ところが Quiz.tsx には別物の 'quiz_elim_hint_seen'（操作説明を見たか）
    // もあるので、保存キーを utils/quizStorageKeys.ts へ集約したあとでも
    // この文字列は残ってしまい、「消去状態が保存されているか」を
    // 確かめられていない状態（通っているが何も検証していない）だった。
    // 実際に使っているキー生成と、読み書き両方の存在で確認する。
    // 引数名はフック側では chapterId（Quiz.tsx から chapter.id を渡す）。
    expect(ELIM).toContain('quizElimKey(chapterId, mode)');
    expect(ELIM).toContain('localStorage.setItem(quizElimKey(chapterId, mode)');
    expect(ELIM).toContain('localStorage.getItem(quizElimKey(chapterId, mode))');
    // Quiz.tsx 側は「章とモードを渡すだけ」になっている。
    expect(QUIZ).toContain('useElimination(chapter.id, mode)');

    const { quizElimKey } = await import('../src/utils/quizStorageKeys');
    expect(quizElimKey('c1_1', 'practice')).toBe('quiz_elim_c1_1_practice');
    // 操作説明のキー（quiz_elim_hint_seen）とは別物であること
    expect(quizElimKey('c1_1', 'practice')).not.toBe('quiz_elim_hint_seen');
  });

  it('★選択肢UIの実体は MultipleChoiceControl.tsx にあり、Quiz.tsx は渡すだけ', () => {
    // 切り出しが「コピーして両方に残っている」状態になっていないことを確かめる。
    // 実体が両方にあると、片方だけ直して不整合が出る事故が起きる。
    expect(QUIZ).toContain("from './MultipleChoiceControl'");
    expect(QUIZ).not.toContain('const strikeAnimating');
    expect(QUIZ).not.toContain('もう一度で斜線');
    // 分担：見た目は MultipleChoiceControl.tsx、状態は useElimination.ts、
    // Quiz.tsx はそれらをつなぐだけ。実体が2か所に増えていないことを固定する。
    expect(ELIM).toContain('const [eliminated, setEliminated] = useState<Record<string, string[]>>');
    expect(QUIZ).not.toContain('const [eliminated, setEliminated]');
    expect(MC).not.toContain('useState');
  });

  it('★問題文ペインの実体は ProblemPane.tsx にあり、Quiz.tsx は渡すだけ', () => {
    // 上と同じ考え方の逆方向ガード。切り出したのに Quiz.tsx 側に
    // 同じ JSX が残っている（＝コピーになっている）ことを検知する。
    expect(QUIZ).toContain("from './ProblemPane'");
    expect(QUIZ).toContain('<ProblemPane');
    // ペインの幅指定・高さ上限は切り出し先だけにある
    expect(PROBLEM).toContain('lg:w-[58%]');
    expect(QUIZ).not.toContain('lg:w-[58%]');
    expect(PROBLEM).toContain("'max-h-[50%] h-auto shadow-md relative z-20'");
    expect(QUIZ).not.toContain("'max-h-[50%] h-auto shadow-md relative z-20'");
    // 切り出し先は状態を持たない（見た目だけを預かる）
    expect(PROBLEM).not.toContain('useState');
  });

  it('★解答ペインの実体は AnswerPane.tsx にあり、Quiz.tsx は渡すだけ', () => {
    expect(QUIZ).toContain("from './AnswerPane'");
    expect(QUIZ).toContain('<AnswerPane');
    // 幅・余白の指定は切り出し先だけにある（コピーになっていない）
    expect(ANSWER).toContain('lg:w-[42%] min-h-0 overflow-y-auto');
    expect(QUIZ).not.toContain('lg:w-[42%]');
    // ページャーの矢印ガードも1箇所だけ
    expect(ANSWER).toContain('!isDesktop && mobileAnswerSubs.length > 1 && (');
    expect(QUIZ).not.toContain('!isDesktop && mobileAnswerSubs.length > 1 && (');
    // 切り出し先は状態を持たない（見た目だけを預かる）
    expect(ANSWER).not.toContain('useState');
  });

  it('★2つのペインは Quiz.tsx の JSX から重複なく1回ずつ呼ばれている', () => {
    // 「切り出したのに古い JSX も残っている」を数で弾く。
    expect((QUIZ.match(/<ProblemPane/g) || []).length).toBe(1);
    expect((QUIZ.match(/<AnswerPane/g) || []).length).toBe(1);
    // 記号パレット・図・音源の import は各ペインへ移り、Quiz.tsx には無い
    expect(QUIZ).not.toContain("from './SymbolPalette'");
    expect(QUIZ).not.toContain("from './QuestionFigure'");
    expect(QUIZ).not.toContain("from './ListeningAudioPlayer'");
  });

  it('★ヘッダー帯の実体は QuizHeader.tsx にあり、Quiz.tsx は渡すだけ', () => {
    expect(QUIZ).toContain("from './QuizHeader'");
    expect(QUIZ).toContain('<QuizHeader');
    // ★実測で分かった落とし穴★
    // ヘッダーの見出しは chapter.title でなく chapter.abstractTitle を使っている。
    // 形式的に chapterTitle として渡してしまうと、帯の文字が静かに変わる。
    expect(QUIZ).toContain('chapterAbstractTitle={chapter.abstractTitle}');
    expect(HEADER).toContain('chapterAbstractTitle');
    // 順位バッジとスコア周りの実体はヘッダー側へ移っている
    expect(HEADER).toContain('<LiveStandingPill');
    expect(QUIZ).not.toContain('<LiveStandingPill');
    // PC 向けのスコア枠の寸法もヘッダー側
    expect(HEADER).toContain('md:px-4');
    expect(QUIZ).not.toContain('md:px-4');
    // 帯は表示だけ。state を自分で持ち始めたら切り出しの意味が失われる。
    expect(HEADER).not.toContain('useState');
  });

  it('★スマホ下部の固定バー2本の実体は MobileFloatingBar.tsx にある', () => {
    expect(QUIZ).toContain("from './MobileFloatingBar'");
    expect(QUIZ).toContain('<MobileFloatingBar');
    // ★消してはいけないもの★
    // 「(ア) 前へ 1/9 次へ 完了」バーは「必要」と明言された。
    expect(FLOAT).toContain('floating-answer-bar');
    expect(FLOAT).toContain('{focusedIndex + 1}/{inputNavSubs.length}');
    expect(QUIZ).not.toContain('floating-answer-bar');
    expect(FLOAT).not.toContain('useState');
  });

  it('★ヘッダー帯と固定バーは Quiz.tsx から重複なく1回ずつ呼ばれている', () => {
    expect((QUIZ.match(/<QuizHeader/g) || []).length).toBe(1);
    expect((QUIZ.match(/<MobileFloatingBar/g) || []).length).toBe(1);
  });

  it('★表示用の派生値は useQuestionDerived フックが持ち、Quiz.tsx は呼ぶだけ', () => {
    expect(QUIZ).toContain("from '../hooks/useQuestionDerived'");
    expect(QUIZ).toContain('useQuestionDerived({');
    // ★ここに state と副作用を持ち込まないこと★
    // このフックは useMemo / useCallback だけの「純粋な派生値」の置き場。
    // useState や useEffect を追加すると、問の切り替えのときに
    // リセットされる順番が変わって、前の問の値を読み違える形で壊れる。
    //
    // ★コメントを除いて検査する理由★
    // このフックのヘッダーコメント自体に「useState を置かない」と
    // 書いてあるため、生テキストのままだと文章に引っかかって
    // 実装とは無関係に落ちる。実装だけを見たいのでコメントを外す。
    const derivedCode = DERIVED.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^[ \t]*\/\/.*$/gm, '');
    expect(derivedCode).not.toContain('useState');
    expect(derivedCode).not.toContain('useEffect');
    expect(derivedCode).not.toContain('useLayoutEffect');
    // 中身は useMemo / useCallback だけ
    expect(derivedCode).toContain('useMemo');
    expect(derivedCode).toContain('useCallback');
  });

  it('★フックの呼び出しは1回だけ（順番が崩れないことの保証）', () => {
    // React はフックを「呼ばれた順番」で対応付ける。
    // 条件分岐の中やループの中で呼んだり、2回呼んだりすると壊れる。
    expect((QUIZ.match(/useQuestionDerived\(/g) || []).length).toBe(1);
  });

  it('★採点処理の実体は utils/quizScoring.ts にあり、Quiz.tsx は呼ぶだけ', () => {
    expect(QUIZ).toContain("from '../utils/quizScoring'");
    expect(QUIZ).toContain('createScoreCurrentQuestion({');
    // 呼び出しは1回だけ（採点関数が2つできると二重採点の元になる）
    expect((QUIZ.match(/createScoreCurrentQuestion\(/g) || []).length).toBe(1);

    // ★変えてはいけない設計がフック側に残っていること★
    // 1問ずつモードの記録は perQuestion に入れず perStep に分ける。
    expect(SCORING).toMatch(/perQuestion:\s*perStep\s*\?\s*run\.perQuestion/);
    // 学習台帳への追記は採点確定（saveRun）より後。
    expect(SCORING.indexOf('markProblemSolved(uid')).toBeGreaterThan(
      SCORING.indexOf('saveRun(chapter.id, mode, nextRun)'),
    );
    // 二重採点ガードも一緒に移っていること。
    expect(SCORING).toContain('lastScoredQuestionRef.current === scoringKey');

    // Quiz.tsx 側に採点コードが残っていない（＝二重実装になっていない）
    expect(QUIZ).not.toContain('markProblemSolved(');
    expect(QUIZ).not.toContain('captureWrongAnswers(');
    expect(QUIZ).not.toContain('scoreProblem(');

    // ★ここにフックを持ち込まないこと★
    // 採点は「押した瞬間に走るただの関数」。フックを入れると
    // 呼び出し順の制約が生まれ、切り出しの安全性が崩れる。
    const scoringCode = SCORING.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^[ \t]*\/\/.*$/gm, '');
    expect(scoringCode).not.toContain('useState');
    expect(scoringCode).not.toContain('useEffect');
    expect(scoringCode).not.toContain('useMemo');
  });

  it('★解説画面とリスニング説明ページの実体は別ファイルにあり、Quiz.tsx は渡すだけ', () => {
    expect(QUIZ).toContain("from './ExplanationScreen'");
    expect(QUIZ).toContain("from './ListeningBriefing'");
    expect((QUIZ.match(/<ExplanationScreen/g) || []).length).toBe(1);
    expect((QUIZ.match(/<ListeningBriefing/g) || []).length).toBe(1);

    // ★実測で分かった落とし穴★ 見出しは chapter.title でなく chapter.abstractTitle
    expect(QUIZ).toContain('chapterAbstractTitle={chapter.abstractTitle}');
    expect(BRIEFING).toContain('chapterAbstractTitle');

    // ★消してはいけないもの★
    // 実況バナーは「採点した瞬間」に順位が動くので解説画面側にも必要。
    expect(EXPL_SCREEN).toContain('<OvertakeBanner');
    // 「問題をはじめる」ボタン（説明ページ→問1 への導線）
    expect(BRIEFING).toContain('問題をはじめる');
    expect(BRIEFING).toContain('この回の説明');

    // Quiz.tsx に古い JSX が残っていない
    expect(QUIZ).not.toContain('問題をはじめる');
    expect(QUIZ).not.toContain('この回の説明');
    expect(QUIZ).not.toContain('<Explanation ');

    // どちらもフックを持たない（＝呼び出し順に影響しない）
    for (const [name, code] of [['ExplanationScreen', EXPL_SCREEN], ['ListeningBriefing', BRIEFING]] as const) {
      const stripped = code.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^[ \t]*\/\/.*$/gm, '');
      expect(stripped, `${name} は state を持たない`).not.toContain('useState');
      expect(stripped, `${name} は副作用を持たない`).not.toContain('useEffect');
    }
  });

  it('★派生値の計算は Quiz.tsx に二重で残っていない', () => {
    // 「切り出したのに古い計算も残っている」を弾く。
    // 実測（grep）で、これらの宣言が Quiz.tsx から消えていることを確認済み。
    for (const decl of [
      'const groupedSubQuestions = useMemo',
      'const mobileAnswerSubs = useMemo',
      'const questionNeedsMathPalette = useMemo',
      'const listeningOptionTexts = useMemo',
      'const hasTrackFor = useCallback',
    ]) {
      expect(DERIVED, `${decl} はフック側にある`).toContain(decl);
      expect(QUIZ, `${decl} は Quiz.tsx に残っていない`).not.toContain(decl);
    }
  });

  it('複数選択の設問では斜線を使わない（解除と消去の混同を避ける）', () => {
    expect(MC).toMatch(/if \(isMultiple\) \{[\s\S]{0,700}?return;/);
  });

  it('消去モードの切替ボタンは復活していない', () => {
    // 「消去モード」の語はソースに残っているが、それは廃止理由を説明した
    // コメントのみ。実体（モードを持つ state）が無いことを確認する。
    expect(QUIZ).not.toMatch(/useState[^\n]*eliminationMode|useState[^\n]*isErasing/);
    expect(QUIZ).not.toMatch(/setEliminationMode|setIsErasing/);
  });
});
