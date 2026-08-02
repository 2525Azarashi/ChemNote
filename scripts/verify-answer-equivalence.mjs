/**
 * 解答判定の緩和（answerEquivalence）の検証スクリプト
 *
 *   1) 「緩和されてほしいケース」がすべて正解になるか
 *   2) 「絶対に正解にしてはいけないケース」が不正解のままか
 *   3) アプリ内の全設問について、他の設問の正解が誤って通らないか（衝突検査）
 *
 * 実行: npx tsx scripts/verify-answer-equivalence.mjs
 */
import { isAnswerCorrect } from '../src/utils/answerJudge.ts';
import { chemistryData } from '../src/data/chemistryData.ts';
import { mockExam } from '../src/data/mockExamData.ts';

let pass = 0;
let fail = 0;
const failures = [];

function expect(label, correctAnswer, userAnswer, shouldBe, acceptedAnswers) {
  const sq = { id: 't', type: 'short_answer', correctAnswer, acceptedAnswers };
  const got = isAnswerCorrect(sq, userAnswer);
  if (got === shouldBe) {
    pass += 1;
  } else {
    fail += 1;
    failures.push(`${label}: 正解="${correctAnswer}" 入力="${userAnswer}" 期待=${shouldBe} 実際=${got}`);
  }
}

// ---------------------------------------------------------------
// 1) 緩和されてほしいケース（true になるべき）
// ---------------------------------------------------------------
const SHOULD_ACCEPT = [
  ['ひらがな→漢字(同義語)', 'ろ過', 'ロ過'],
  ['ひらがな/カタカナ', 'デンプン溶液', 'でんぷん溶液'],
  ['異体字', 'ろ過', '濾過'],
  ['長音のゆれ', 'ビュレット', 'ビューレット'],
  ['全角英数', 'H2O', 'Ｈ２Ｏ'],
  ['下付き数字', 'H2O', 'H₂O'],
  ['上付き電荷', 'Na+', 'Na⁺'],
  ['空白の有無', 'mol/L', 'mol / L'],
  ['句読点の有無', '再結晶', '再結晶。'],
  ['括弧の有無', '水素イオン', '（水素イオン）'],
  ['括弧内の別解', '水素イオン（H+）', 'H+'],
  ['括弧を外した形', '水素イオン（H+）', '水素イオン'],
  ['またはの分解', 'メチルオレンジ（またはメチルレッド）', 'メチルレッド'],
  ['単位の省略', '40 mL', '40'],
  ['単位の大小文字', '40 mL', '40ml'],
  ['単位の換算', '40 mL', '0.040 L'],
  ['有効数字のゆれ', '2.0', '2'],
  ['指数表記(×10)', '5.0×10-2 mol/L', '0.050 mol/L'],
  ['指数表記(e)', '5.0×10-2', '5.0e-2'],
  ['約の前置き', '8.0', '約8.0'],
  ['同義語(貴ガス)', '貴ガス', '希ガス'],
  ['同義語(18族)', '貴ガス', '18族元素'],
  ['同義語(電子配置)', 'ネオン型', 'Ne型'],
  ['同義語(溶融塩)', '融解塩電解', '溶融塩電解'],
  ['同義語(黒鉛)', '黒鉛', 'グラファイト'],
  ['同義語(黄リン)', '黄リン', '白リン'],
  ['同義語(器具)', '三角フラスコ', 'コニカルビーカー'],
  ['同義語(もろい)', '脆い', 'もろい'],
  ['色の接尾辞', '赤', '赤色'],
  ['色のゆれ', '橙', 'オレンジ色'],
  ['順序(不等号→矢印)', 'Li > Na > K', 'Li→Na→K'],
  ['順序(区切りなし)', 'ウ→オ→エ', 'ウオエ'],
  ['イオン半径の順序', 'O2- > F- > Na+', 'O2-→F-→Na+'],
  ['選択肢の丸数字', '②', '2'],
  ['ひらがな読み', 'ろ過', 'ろか'],
  ['acceptedAnswers 側も緩和', 'ダミー', '希ガス', ['貴ガス']],
];
for (const [label, correct, user, accepted] of SHOULD_ACCEPT) {
  expect(`[緩和] ${label}`, correct, user, true, accepted);
}

// ---------------------------------------------------------------
// 2) 絶対に通してはいけないケース（false のままであるべき）
// ---------------------------------------------------------------
const SHOULD_REJECT = [
  ['別の物質', '塩化ナトリウム', '塩化カリウム'],
  ['別の数値', '40 mL', '41 mL'],
  ['単位違いの同数値', '40 mL', '40 L'],
  ['桁違い', '5.0×10-2', '5.0×10-3'],
  ['順序が逆', 'Li > Na > K', 'K > Na > Li'],
  ['向きが逆の用語', '昇華', '凝華'],
  ['電荷が違う', 'Na+', 'Na-'],
  ['係数が違う', '2H2O', '3H2O'],
  ['空解答', '水', ''],
  ['空白のみ', '水', '   '],
  ['部分一致は不可', '水酸化ナトリウム', '水酸化'],
  ['別の色', '赤色', '青色'],
  ['別の選択肢', 'ア', 'イ'],
  ['酸と塩基', '酸性', '塩基性'],
  ['複数解答の片方だけ(中黒)', '(ア)・(オ)', 'オ'],
  ['複数解答の片方だけ(と)', '(ア) と (オ)', 'オ'],
  ['複数解答の一部だけ', '(イ)・(エ)・(カ)', '(イ)・(エ)'],
  ['複数解答の片方だけ(物質)', '（イ）NaNO₃、（エ）K₂SO₄', '（イ）'],
];
for (const [label, correct, user] of SHOULD_REJECT) {
  expect(`[却下] ${label}`, correct, user, false);
}

// ---------------------------------------------------------------
// 3) 実データの衝突検査
//    「ある設問の正解」が「別の設問の正解」を誤って通してしまわないか。
//    同一設問内で複数の正解表現がある場合を除き、
//    別の意味の解答が通ってしまうのは緩和のやり過ぎ。
// ---------------------------------------------------------------
const subQuestions = [];

for (const part of chemistryData.parts) {
  for (const chapter of part.chapters || []) {
    for (const problem of [...(chapter.practiceProblems || []), ...(chapter.miniTest || [])]) {
      for (const sq of problem?.subQuestions || []) {
        if (sq?.type === 'descriptive') continue;
        if (typeof sq?.correctAnswer !== 'string' || !sq.correctAnswer.trim()) continue;
        subQuestions.push({ ...sq, _where: `${chapter.id}/${problem.id}/${sq.id}` });
      }
    }
  }
}
for (const q of mockExam.questions || []) {
  for (const sq of q?.subQuestions || []) {
    if (sq?.type === 'descriptive') continue;
    if (typeof sq?.correctAnswer !== 'string' || !sq.correctAnswer.trim()) continue;
    subQuestions.push({ ...sq, _where: `mock/${q.id}/${sq.id}` });
  }
}

// 正解文字列 → その文字列を正解とする設問の集合
const answerOwners = new Map();
for (const sq of subQuestions) {
  const key = sq.correctAnswer.trim();
  if (!answerOwners.has(key)) answerOwners.set(key, []);
  answerOwners.get(key).push(sq._where);
}
const distinctAnswers = [...answerOwners.keys()];

// 自己一致（正解をそのまま入力したら必ず正解）の確認
let selfFail = 0;
for (const sq of subQuestions) {
  if (!isAnswerCorrect(sq, sq.correctAnswer)) {
    selfFail += 1;
    if (selfFail <= 10) failures.push(`[自己一致NG] ${sq._where}: "${sq.correctAnswer}"`);
  }
  for (const alt of sq.acceptedAnswers || []) {
    if (!isAnswerCorrect(sq, alt)) {
      selfFail += 1;
      if (selfFail <= 10) failures.push(`[別解NG] ${sq._where}: "${alt}"`);
    }
  }
}

// 衝突検査：異なる正解文字列どうしが同一視されていないか
const collisions = [];
for (let i = 0; i < distinctAnswers.length; i += 1) {
  for (let j = i + 1; j < distinctAnswers.length; j += 1) {
    const a = distinctAnswers[i];
    const b = distinctAnswers[j];
    const sqA = { id: 'a', type: 'short_answer', correctAnswer: a };
    if (isAnswerCorrect(sqA, b)) collisions.push([a, b]);
  }
}

// 表記ゆれで衝突するのは「もともと同義」の場合もあるので、内容を出して目視できるようにする
console.log('====================================================');
console.log(' 解答緩和ロジックの検証');
console.log('====================================================');
console.log(`ユニットテスト        : ${pass} pass / ${fail} fail`);
console.log(`対象設問数            : ${subQuestions.length}`);
console.log(`異なる正解文字列      : ${distinctAnswers.length}`);
console.log(`自己一致の失敗        : ${selfFail}`);
console.log(`異なる正解どうしの衝突: ${collisions.length}`);
if (collisions.length) {
  console.log('--- 衝突一覧（要確認） ---');
  collisions.slice(0, 60).forEach(([a, b]) => console.log(`  "${a}"  ⇔  "${b}"`));
  if (collisions.length > 60) console.log(`  … 他 ${collisions.length - 60} 件`);
}
if (failures.length) {
  console.log('--- 失敗一覧 ---');
  failures.forEach((f) => console.log(`  ${f}`));
}
console.log('====================================================');

if (fail > 0 || selfFail > 0) process.exit(1);
