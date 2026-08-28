// ------------------------------------------------------------
// 問題データ（章ごとのファイル）
// ------------------------------------------------------------
// 1章〜4章の問題は章のまとまりごとにファイルを分けている。
// ★問題を1問足すときは、下のファイルのうち該当する章のものだけを開けばよい。★
// このファイル（chemistryData.ts）は「どの章がどの配列を使うか」の
// 組み立て表であって、問題そのものは持っていない。
import {
  c1_1_Practice,
  c1_1_MiniTest,
  c1_2_A_Practice,
  c1_2_A_MiniTest,
  c1_2_B_Practice,
  c1_2_B_MiniTest,
  c1_3_Practice,
} from './chemProblemsC1';
import {
  c2_1_Practice,
  c2_1_MiniTest,
  c2_2_Practice,
  c2_3_Practice,
  c2_4_Practice,
} from './chemProblemsC2';
import { c3_1_Practice, c3_2_Practice, c3_3_Practice } from './chemProblemsC3';
import {
  c4_1_Practice,
  c4_2_Practice,
  c4_3_Practice,
  c4_4_Practice,
} from './chemProblemsC4';
// 5章（酸と塩基）・6章（酸化還元）は以前から別ファイルになっている。
import { acidBaseProblems } from './acidBaseProblems';
import { redoxProblems } from './redoxProblems';
// 解説の後処理は explanationPostProcess.ts に1つだけ置いている
// （整形関数・単元の教え方の取得も、その中で使う）。
import { applyExplanationPostProcess } from './explanationPostProcess';
import { getMolUnitConversion } from './molUnitConversions';

// ⑤ 酸と塩基 を他の単元（④-1 等）と同じ粒度のタブに分割するための補助関数。
// acidBaseProblems の各問題は category に "⑤-1 …" のような接頭辞を持つので、
// その接頭辞でフィルタして各サブ単元の practiceProblems を取り出す。
const acidBaseProblemsByPrefix = (prefix: string) =>
  acidBaseProblems.filter((p: any) => typeof p.category === 'string' && p.category.startsWith(prefix));

// ⑥ 酸化還元反応 も同様に category の "⑥-1 …" 接頭辞でフィルタする。
const redoxProblemsByPrefix = (prefix: string) =>
  redoxProblems.filter((p: any) => typeof p.category === 'string' && p.category.startsWith(prefix));

export const chemistryData = {
  "parts": [
    {
      "id": "part1",
      "title": "第一部・化学基礎前半",
      "chapters": [
        {
          "id": "c1_1",
          "abstractTitle": "① 純物質と混合物",
          "realTitle": "1章 物質の構成",
          "topics": [
            "純物質と混合物"
          ],
          "practiceProblems": c1_1_Practice,
          "miniTest": c1_1_MiniTest
        },
        {
          "id": "c1_2_A",
          "abstractTitle": "②-A 物質の分離と精製",
          "realTitle": "1章 物質の構成",
          "topics": [
            "分離と精製",
            "蒸留",
            "分留",
            "再結晶",
            "抽出",
            "クロマトグラフィー",
            "昇華法"
          ],
          "practiceProblems": c1_2_A_Practice,
          "miniTest": c1_2_A_MiniTest
        },
        {
          "id": "c1_2_B",
          "abstractTitle": "②-B 物質の構成と成分元素の検出",
          "realTitle": "1章 物質の構成",
          "topics": [
            "同素体",
            "炎色反応",
            "成分元素の検出"
          ],
          "practiceProblems": c1_2_B_Practice,
          "miniTest": c1_2_B_MiniTest
        },
        {
          "id": "c1_3",
          "abstractTitle": "③ 粒子の熱運動と物質の三態",
          "realTitle": "1章 物質の構成",
          "topics": [
            "熱運動",
            "絶対温度",
            "物質の三態",
            "状態変化",
            "物理変化・化学変化"
          ],
          "practiceProblems": c1_3_Practice
        },
        {
          "id": "c2_1",
          "abstractTitle": "① 原子の構造と電子配置・元素の周期表",
          "realTitle": "2章 物質の構成粒子",
          "topics": [
            "原子の構造",
            "電子配置",
            "元素の周期表"
          ],
          "practiceProblems": c2_1_Practice,
          "miniTest": c2_1_MiniTest
        },
        {
          "id": "c2_2",
          "abstractTitle": "② イオン",
          "realTitle": "2章 物質の構成粒子",
          "topics": [
            "電荷による分類",
            "構成による分類",
            "価数と安定性",
            "組成式の決定"
          ],
          "practiceProblems": c2_2_Practice
        },
        {
          "id": "c2_3",
          "abstractTitle": "③ イオン生成とエネルギー",
          "realTitle": "2章 物質の構成粒子",
          "topics": [
            "イオン化エネルギー",
            "電子親和力",
            "周期表の傾向",
            "最大値の特定",
            "エネルギーとイオンのなりやすさ",
            "連続イオン化エネルギー"
          ],
          "practiceProblems": c2_3_Practice,
          "miniTest": []
        },
        {
          "id": "c2_4",
          "abstractTitle": "④ 原子の大きさとイオンの大きさ",
          "realTitle": "2章 物質の構成粒子",
          "topics": [
            "原子半径の傾向",
            "同族での変化",
            "同周期での変化",
            "陽イオン・陰イオンの半径",
            "等電子配置イオンの半径",
            "周期表の傾向性"
          ],
          "practiceProblems": c2_4_Practice,
          "miniTest": []
        },
        {
          "id": "c3_1",
          "abstractTitle": "① 結合の種類",
          "realTitle": "3章 化学結合",
          "topics": [
            "イオン結合",
            "共有結合",
            "配位結合",
            "金属結合",
            "分子間力による結合"
          ],
          "practiceProblems": c3_1_Practice,
          "miniTest": []
        },
        {
          "id": "c3_2",
          "abstractTitle": "② 結晶の種類と性質",
          "realTitle": "3章 化学結合",
          "topics": [
            "イオン結晶",
            "分子結晶",
            "共有結合結晶",
            "金属結晶",
            "組成式と分子式",
            "分子の形と極性",
            "炭素の同素体",
            "配位結合",
            "単位格子",
            "延性・展性",
            "劈開"
          ],
          "practiceProblems": c3_2_Practice,
          "miniTest": []
        },
        {
          "id": "c3_3",
          "abstractTitle": "③ 分子の相互作用と性質",
          "realTitle": "3章 化学結合",
          "topics": [
            "分子間力",
            "水素結合",
            "分子の極性",
            "電気陰性度について"
          ],
          "practiceProblems": c3_3_Practice,
          "miniTest": []
        }
      ]
    },
    {
      "id": "part2",
      "title": "第二部・化学基礎後半",
      "chapters": [
        {
          "id": "c4_1",
          "abstractTitle": "① 原子量",
          "realTitle": "4章 物質量と化学反応式",
          "topics": [
            "同位体の相対質量",
            "元素の原子量",
            "存在割合の計算"
          ],
          "practiceProblems": c4_1_Practice,
          "miniTest": []
        },
        {
          "id": "c4_2",
          "abstractTitle": "② 物質量",
          "realTitle": "4章 物質量と化学反応式",
          "topics": [
            "アボガドロ定数",
            "モル質量とモル計算",
            "質量・体積の変換"
          ],
          "practiceProblems": c4_2_Practice,
          "miniTest": []
        },
        {
          "id": "c4_3",
          "abstractTitle": "③ 化学反応式とイオン反応式の作り方",
          "realTitle": "4章 物質量と化学反応式",
          "topics": [
            "反応式の作り方と係数決定",
            "未定係数法",
            "反応式を伴う量的計算"
          ],
          "practiceProblems": c4_3_Practice,
          "miniTest": []
        },
        {
          "id": "c4_4",
          "abstractTitle": "④ 濃度",
          "realTitle": "4章 物質量と化学反応式",
          "topics": [
            "質量パーセント濃度",
            "モル濃度",
            "濃度の希釈、変換"
          ],
          "practiceProblems": c4_4_Practice,
          "miniTest": []
        },
        {
          "id": "c5_1",
          "abstractTitle": "① 酸と塩基の定義",
          "realTitle": "5章 酸と塩基",
          "topics": [
            "アレニウスの定義",
            "ブレンステッド・ローリーの定義",
            "共役酸・共役塩基"
          ],
          "practiceProblems": acidBaseProblemsByPrefix("⑤-1"),
          "miniTest": []
        },
        {
          "id": "c5_2",
          "abstractTitle": "② 酸と塩基の強さ",
          "realTitle": "5章 酸と塩基",
          "topics": [
            "強酸・弱酸／強塩基・弱塩基",
            "電離度α",
            "価数"
          ],
          "practiceProblems": acidBaseProblemsByPrefix("⑤-2"),
          "miniTest": []
        },
        {
          "id": "c5_3",
          "abstractTitle": "③ pHについて",
          "realTitle": "5章 酸と塩基",
          "topics": [
            "pH=−log[H⁺]",
            "水のイオン積 Kw",
            "強酸・弱酸のpH計算"
          ],
          "practiceProblems": acidBaseProblemsByPrefix("⑤-3"),
          "miniTest": []
        },
        {
          "id": "c5_4",
          "abstractTitle": "④ 中和とは何か",
          "realTitle": "5章 酸と塩基",
          "topics": [
            "中和反応と塩の生成",
            "塩の分類と液性",
            "中和反応式"
          ],
          "practiceProblems": acidBaseProblemsByPrefix("⑤-4"),
          "miniTest": []
        },
        {
          "id": "c5_5",
          "abstractTitle": "⑤ 中和反応の計算",
          "realTitle": "5章 酸と塩基",
          "topics": [
            "酸の価数×物質量＝塩基の価数×物質量",
            "中和点・過不足の判定",
            "中和後のpH"
          ],
          "practiceProblems": acidBaseProblemsByPrefix("⑤-5"),
          "miniTest": []
        },
        {
          "id": "c5_6",
          "abstractTitle": "⑥ 中和滴定の道具と方法",
          "realTitle": "5章 酸と塩基",
          "topics": [
            "ホールピペット・ビュレット",
            "メスフラスコ・コニカルビーカー",
            "共洗いの要否"
          ],
          "practiceProblems": acidBaseProblemsByPrefix("⑤-6"),
          "miniTest": []
        },
        {
          "id": "c5_7",
          "abstractTitle": "⑦ 滴定曲線と二段階滴定",
          "realTitle": "5章 酸と塩基",
          "topics": [
            "滴定曲線の4タイプ",
            "指示薬と変色域",
            "二段階滴定・弱酸遊離"
          ],
          "practiceProblems": acidBaseProblemsByPrefix("⑤-7"),
          "miniTest": []
        },
        {
          "id": "c6_1",
          "abstractTitle": "① 酸化と還元・酸化数",
          "realTitle": "6章 酸化還元反応",
          "topics": [
            "酸化・還元の定義（酸素・水素・電子）",
            "酸化数の求め方",
            "酸化剤・還元剤の判定"
          ],
          "practiceProblems": redoxProblemsByPrefix("⑥-1"),
          "miniTest": []
        },
        {
          "id": "c6_2",
          "abstractTitle": "② 半反応式と酸化還元反応式",
          "realTitle": "6章 酸化還元反応",
          "topics": [
            "酸化剤の半反応式",
            "還元剤の半反応式",
            "化学反応式の完成",
            "SO2・H2O2 の二面性"
          ],
          "practiceProblems": redoxProblemsByPrefix("⑥-2"),
          "miniTest": []
        },
        {
          "id": "c6_3",
          "abstractTitle": "③ 酸化還元滴定と量的関係",
          "realTitle": "6章 酸化還元反応",
          "topics": [
            "過マンガン酸塩滴定",
            "ヨウ素滴定",
            "逆滴定・COD",
            "電子の物質量の等式"
          ],
          "practiceProblems": redoxProblemsByPrefix("⑥-3"),
          "miniTest": []
        },
        {
          "id": "c6_4",
          "abstractTitle": "④ 酸化力・還元力の強さ",
          "realTitle": "6章 酸化還元反応",
          "topics": [
            "反応の進行方向と強さの序列",
            "ハロゲンの酸化力",
            "金属の析出反応"
          ],
          "practiceProblems": redoxProblemsByPrefix("⑥-4"),
          "miniTest": []
        },
        {
          "id": "c6_5",
          "abstractTitle": "⑤ 金属のイオン化傾向",
          "realTitle": "6章 酸化還元反応",
          "topics": [
            "イオン化列と反応性",
            "水・酸との反応",
            "トタンとブリキ（犠牲防食）"
          ],
          "practiceProblems": redoxProblemsByPrefix("⑥-5"),
          "miniTest": []
        },
        {
          "id": "c6_6",
          "abstractTitle": "⑥ 電池",
          "realTitle": "6章 酸化還元反応",
          "topics": [
            "ダニエル電池",
            "ボルタ電池と分極",
            "電池の量的関係"
          ],
          "practiceProblems": redoxProblemsByPrefix("⑥-6"),
          "miniTest": []
        },
        {
          "id": "c6_7",
          "abstractTitle": "⑦ 金属の製錬と電気分解",
          "realTitle": "6章 酸化還元反応",
          "topics": [
            "製錬法とイオン化傾向",
            "鉄の高炉製錬",
            "銅の電解精錬",
            "アルミニウムの溶融塩電解"
          ],
          "practiceProblems": redoxProblemsByPrefix("⑥-7"),
          "miniTest": []
        }
      ]
    }
  ]
};

// ------------------------------------------------------------
// 化学基礎 1章：設問データ修正パッチ
// - 問題番号表示はUI側で進捗表示に統一するため、ここでは設問内容・解答形式を調整する。
// - 数字/英字の全角半角ゆれは answerJudge.ts の正規化で吸収する。
// ------------------------------------------------------------
const findPracticeChapter = (chapterId: string): any =>
  (chemistryData.parts as any[])
    .flatMap((part: any) => part.chapters || [])
    .find((chapter: any) => chapter.id === chapterId);

const findPracticeProblem = (chapterId: string, problemId: string): any =>
  findPracticeChapter(chapterId)?.practiceProblems?.find((problem: any) => problem.id === problemId);

const findSubQuestion = (chapterId: string, problemId: string, subQuestionId: string): any =>
  findPracticeProblem(chapterId, problemId)?.subQuestions?.find((sq: any) => sq.id === subQuestionId);

(() => {
  const c12a = findPracticeChapter('c1_2_A');
  if (c12a) {
    c12a.practiceProblems = (c12a.practiceProblems || []).filter(
      (problem: any) => !['q_c1_2_A_6', 'q_c1_2_A_8'].includes(problem.id)
    );
  }

  const filtration = findPracticeProblem('c1_2_A', 'q_c1_2_A_1');
  if (filtration) {
    // ②-A 問1（ろ過）: 添付の写真（ア〜エの4パターン）に差し替え
    filtration.text = String(filtration.text).replace('/fig_filtration_abcd.png', '/photo_filtration_abcd.jpg');
  }

  const distillation = findPracticeProblem('c1_2_A', 'q_c1_2_A_2');
  if (distillation) {
    // ②-A 問2（蒸留）: 添付の蒸留装置写真（①〜⑤）に差し替え
    distillation.text = String(distillation.text).replace('/fig_distillation_setup.png', '/photo_distillation_setup.jpg');
  }

  const fractional = findPracticeProblem('c1_2_A', 'q_c1_2_A_3');
  const fractionalOrder = findSubQuestion('c1_2_A', 'q_c1_2_A_3', 'q3_2');
  if (fractional) {
    fractional.text = String(fractional.text).replace(
      'ウ：石油ガス・LPガス　　エ：灯油　　オ：ナフサ（粗製ガソリン）',
      'ウ：石油ガス・LPガス　　エ：灯油　　オ：ナフサ（粗製ガソリン）\n\n※ 解答欄では、記号カードを「上から出てくる順」に並べ替えなさい。'
    );
  }
  if (fractionalOrder) {
    fractionalOrder.type = 'sorting';
    fractionalOrder.items = ['ア', 'イ', 'ウ', 'エ', 'オ'];
    fractionalOrder.correctAnswer = 'ウ > オ > エ > ア > イ';
    fractionalOrder.acceptedAnswers = ['ウ→オ→エ→ア→イ', 'ウオエアイ'];
  }

  const sublimation = findPracticeProblem('c1_2_A', 'q_c1_2_A_4');
  if (sublimation) {
    // ②-A 問4（昇華法）: 添付の昇華実験装置写真（①〜④）に差し替え
    sublimation.text = String(sublimation.text)
      .replace('/fig_sublimation_setups.png', '/photo_sublimation_setups.jpg')
      .replace(/\n\n※選択肢の図の意味：[\s\S]*?\n\n（2）/, '\n\n（2）');
  }
  const sublimationMulti = findSubQuestion('c1_2_A', 'q_c1_2_A_4', 'q_c1_2_A_4_2');
  if (sublimationMulti) {
    sublimationMulti.type = 'multiple_choice';
    sublimationMulti.options = ['ア', 'イ', 'ウ', 'エ', 'オ', 'カ', 'キ'];
    sublimationMulti.correctAnswer = 'イ・ウ・オ・キ';
    sublimationMulti.acceptedAnswers = ['イ、ウ、オ、キ', 'イウオキ'];
  }

  const extraction = findPracticeProblem('c1_2_A', 'q_c1_2_A_5');
  if (extraction) {
    // ②-A 問5（抽出）: 添付の分液漏斗写真に差し替え
    extraction.text = String(extraction.text).replace('/fig_separating_funnel.png', '/photo_separating_funnel.jpg');
  }
  const funnelName = findSubQuestion('c1_2_A', 'q_c1_2_A_5', 'q5_2');
  if (funnelName) {
    funnelName.acceptedAnswers = ['分液ろうと', '分液漏斗'];
  }

  const c13 = findPracticeChapter('c1_3');
  if (c13) {
    c13.practiceProblems = (c13.practiceProblems || []).filter(
      (problem: any) => !['q_c1_3_5', 'q_c1_3_6'].includes(problem.id)
    );
  }

  const stateChange = findPracticeProblem('c1_3', 'q_c1_3_3');
  if (stateChange) {
    const transitions = [
      ['a', 'ア', '液体', '固体', '凝固'],
      ['i', 'イ', '液体', '気体', '蒸発'],
      ['u', 'ウ', '固体', '気体', '昇華'],
      ['e', 'エ', '気体', '液体', '凝縮'],
      ['o', 'オ', '気体', '固体', '凝華'],
      ['ka', 'カ', '固体', '液体', '融解'],
    ];
    stateChange.text = String(stateChange.text).replace(
      'どれからどれへの状態変化か答え、変化の名称を答えよ。',
      '「何から何へ」の状態変化かを、（出発）から（到達）の2つの解答欄に分けて答え、変化の名称も答えよ。'
    );
    stateChange.subQuestions = transitions.flatMap(([key, label, from, to, name]) => [
      { id: `q_c1_3_3_${key}_from`, label: `${label}：出発`, type: 'short_answer', correctAnswer: from, correctAnswerRate: 85 },
      { id: `q_c1_3_3_${key}_to`, label: `${label}：到達`, type: 'short_answer', correctAnswer: to, correctAnswerRate: 85 },
      { id: `q_c1_3_3_${key}_name`, label: `${label}：名称`, type: 'short_answer', correctAnswer: name, correctAnswerRate: 85 },
    ]);
  }

  const chemicalChange = findSubQuestion('c1_3', 'q_c1_3_4', 'q_c1_3_4_ans');
  if (chemicalChange) {
    chemicalChange.type = 'multiple_choice';
    chemicalChange.options = ['ア', 'イ', 'ウ', 'エ', 'オ', 'カ'];
    chemicalChange.acceptedAnswers = ['イ、エ、カ', 'イエカ'];
  }

  const allotropePair = findSubQuestion('c1_2_B', 'q_c1_2_B_1', 'q_c1_2_B_1_2');
  if (allotropePair) {
    allotropePair.type = 'multiple_choice';
    allotropePair.options = ['ア', 'イ', 'ウ', 'エ', 'オ', 'カ'];
    allotropePair.correctAnswer = 'イ・ウ・オ';
    allotropePair.acceptedAnswers = ['イ、ウ、オ', 'イウオ'];
  }

  const allotropeDetails = findPracticeProblem('c1_2_B', 'q_c1_2_B_2');
  if (allotropeDetails) {
    allotropeDetails.text = String(allotropeDetails.text)
      .replace('【2】問1 硫黄、炭素、酸素、リンの性質について次の問いに答えよ。', '硫黄、炭素、酸素、リンの性質について次の問いに答えよ。')
      .replace('(1) 硫黄(S)の同素体を3つ、名称で答えよ。また、そのうち「常温で安定で黄色」のもの、「淡黄色で針状」のものをそれぞれ選べ。', '(1) 硫黄(S)の同素体のうち、「常温で安定で黄色」のもの、「淡黄色で針状」のものをそれぞれ答えよ。')
      .replace('(2) 炭素(C)的同素体を4つ、名称で答えよ。また、そのうち「非常に硬く電気を通さない」もの、「やわらかく電気をよく導く」ものをそれぞれ選べ。', '(2) 炭素(C)の同素体のうち、「非常に硬く電気を通さない」もの、「やわらかく電気をよく導く」ものをそれぞれ答えよ。');
    (allotropeDetails.subQuestions || []).forEach((sq: any) => {
      sq.label = String(sq.label).replace(/^問1\s*/, '');
    });
  }

  const flameColorAliases: Record<string, string[]> = {
    q_c1_2_B_3_1: ['赤色'],
    q_c1_2_B_3_2: ['黄色'],
    q_c1_2_B_3_3: ['紫色', '赤紫', '赤紫色'],
    q_c1_2_B_3_4: ['青緑色'],
    q_c1_2_B_3_5: ['橙色', 'だいだい色'],
    q_c1_2_B_3_6: ['紅色'],
    q_c1_2_B_3_7: ['黄緑色'],
  };
  Object.entries(flameColorAliases).forEach(([id, aliases]) => {
    const sq = findPracticeProblem('c1_2_B', 'q_c1_2_B_3')?.subQuestions?.find((item: any) => item.id === id);
    if (sq) sq.acceptedAnswers = aliases;
  });

  const elementInference = findPracticeProblem('c1_2_B', 'q_c1_2_B_4');
  if (elementInference) {
    elementInference.text = String(elementInference.text).replace(
      '元素記号ですべて推定せよ。',
      '元素記号ですべて推定せよ（半角・全角英字どちらでも可）。'
    );
  }

  const precipitateFormulas = ['q_c1_2_B_5_1_chem', 'q_c1_2_B_5_4_chem', 'q_c1_2_B_5_5_chem'];
  precipitateFormulas.forEach((id) => {
    const sq = findPracticeProblem('c1_2_B', 'q_c1_2_B_5')?.subQuestions?.find((item: any) => item.id === id);
    if (sq) sq.requiresChemicalPalette = true;
  });

  // ============================================================
  // 化学基礎 2章：物質の構成粒子 設問データ修正パッチ
  // （添付PDF「原子の構造と電子配置」に基づく修正・新規問題の追加）
  // 進捗N/7 は各章 practiceProblems[N-1] に対応する。
  // ============================================================

  // ------------------------------------------------------------
  // 全体の修正点：電子配置の表記を下付き文字ではなく
  //   K2L8M1 のように普通の半角数字をそのまま羅列する形に統一する。
  // ------------------------------------------------------------
  // 電子配置文字列を「K2L8M1」形式（スペースなし・普通の数字）へ正規化するヘルパー。
  const toPlainShellConfig = (value: string): string => {
    if (typeof value !== 'string') return value;
    // 下付き数字（₀-₉）→ 普通の数字
    let s = value.replace(/[\u2080-\u2089]/g, (ch) =>
      String.fromCharCode(ch.charCodeAt(0) - 0x2080 + 0x30)
    );
    // 殻記号と数字の間・殻どうしの間のスペースを詰める（例: "K2 L8 M1" → "K2L8M1"）
    s = s.replace(/([KLMNOPQ])\s*(\d+)/g, '$1$2').replace(/(\d)\s+([KLMNOPQ])/g, '$1$2');
    return s;
  };

  // ------------------------------------------------------------
  // ① 原子の構造と電子配置・元素の周期表 (c2_1)
  // ------------------------------------------------------------
  const c2_1 = findPracticeChapter('c2_1');
  if (c2_1) {
    // ①-1（進捗1/7 q_c2_1_1）：(オ) は上付き文字（10⁻¹⁰）の入力が必要なため、
    //   他単元と同じ上付き・下付き文字パレットを表示する。
    const q211_o = findSubQuestion('c2_1', 'q_c2_1_1', 'q_c2_1_1_o');
    if (q211_o) {
      q211_o.requiresChemicalPalette = true;
      q211_o.acceptedAnswers = Array.from(
        new Set([...(q211_o.acceptedAnswers || []), '10^-10', '10-10'])
      );
    }
    // (サ) 2n² も上付き入力が必要なので同様にパレットを出す（利便性向上）。
    const q211_sa = findSubQuestion('c2_1', 'q_c2_1_1', 'q_c2_1_1_sa');
    if (q211_sa) {
      q211_sa.requiresChemicalPalette = true;
      q211_sa.acceptedAnswers = Array.from(
        new Set([...(q211_sa.acceptedAnswers || []), '2n2', '2n^2'])
      );
    }

    // ①-2（進捗2/7 q_c2_1_2）：全角数字でも正解になるようにする。
    //   → 判定は answerJudge.ts の normalizeAnswer が全角→半角変換を行うため既に対応済み。
    //   念のため問題文に全角でも可である旨を明記する。
    const q212 = findPracticeProblem('c2_1', 'q_c2_1_2');
    if (q212 && !String(q212.text).includes('全角')) {
      q212.text = String(q212.text).replace(
        /（中性原子とする）。/,
        '（中性原子とする）。※数字は半角・全角どちらで入力しても正解になります。'
      );
    }

    // ①-3（進捗3/7 q_c2_1_3）：電子配置の答えを K2L8M1 形式（普通の数字の羅列）に統一。
    const q213 = findPracticeProblem('c2_1', 'q_c2_1_3');
    if (q213) {
      q213.text = String(q213.text).replace('（例：Na → K2 L8 M1）', '（例：Na → K2L8M1）');
      (q213.subQuestions || []).forEach((sq: any) => {
        const plain = toPlainShellConfig(sq.correctAnswer);
        const accepted = new Set<string>(sq.acceptedAnswers || []);
        // 従来のスペース区切り表記も引き続き正解として許容する。
        if (sq.correctAnswer && sq.correctAnswer !== plain) accepted.add(sq.correctAnswer);
        sq.correctAnswer = plain;
        sq.acceptedAnswers = Array.from(accepted);
      });
    }

    // ①-5（進捗5/7 q_c2_1_5）：問題を削除する。
    c2_1.practiceProblems = (c2_1.practiceProblems || []).filter(
      (problem: any) => problem.id !== 'q_c2_1_5'
    );

    // ①-new：上記修正を行ったうえで新しい問題を末尾に挿入する。
    //   PDF ①「原子の構造と電子配置」問2（放射線）・問4（周期表）を出典とする。
    if (!(c2_1.practiceProblems || []).some((p: any) => p.id === 'q_c2_1_new')) {
      c2_1.practiceProblems.push({
        id: 'q_c2_1_new',
        category: '原子の構造と電子配置・元素の周期表 (問)',
        text: '【問】 原子の構造・放射線・周期表について、次の問いに答えよ。',
        subQuestions: [
          {
            id: 'q_c2_1_new_1',
            label: '(1) 原子の直径は原子核の直径のおよそ何倍か（ア〜エから選べ）　ア）10倍　イ）100倍　ウ）1万〜10万倍　エ）1億倍',
            type: 'multiple_choice',
            options: ['ア', 'イ', 'ウ', 'エ'],
            correctAnswer: 'ウ',
            correctAnswerRate: 80,
          },
          {
            id: 'q_c2_1_new_2',
            label: '(2) 同位体のうち、放射線を放出して別の原子核に変わるものを特に何というか。',
            type: 'short_answer',
            correctAnswer: '放射性同位体',
            acceptedAnswers: ['ラジオアイソトープ', '放射性同位体（ラジオアイソトープ）'],
            correctAnswerRate: 75,
          },
          {
            id: 'q_c2_1_new_3',
            label: '(3) α線の実体は何か（電子／陽子／中性子／ヘリウムの原子核／高エネルギーの電磁波 から選べ）。',
            type: 'short_answer',
            correctAnswer: 'ヘリウムの原子核',
            acceptedAnswers: ['ヘリウム原子核', 'He原子核'],
            correctAnswerRate: 75,
          },
          {
            id: 'q_c2_1_new_4',
            label: '(4) β線の実体は何か（同上の群から選べ）。',
            type: 'short_answer',
            correctAnswer: '電子',
            correctAnswerRate: 80,
          },
          {
            id: 'q_c2_1_new_5',
            label: '(5) 木材中の¹⁴Cの割合が大気中の1/8に減少していた。半減期を5730年とすると、伐採されたのは今から何年前か（単位不要・数値のみ）。',
            type: 'short_answer',
            correctAnswer: '17190',
            correctAnswerRate: 60,
          },
          {
            id: 'q_c2_1_new_6',
            label: '(6) 常温で液体である元素を2つ、名称で答えよ（1つ目）。',
            type: 'short_answer',
            correctAnswer: '水銀',
            acceptedAnswers: ['臭素'],
            correctAnswerRate: 70,
          },
          {
            id: 'q_c2_1_new_7',
            label: '(7) 常温で液体である元素を2つ、名称で答えよ（2つ目）。',
            type: 'short_answer',
            correctAnswer: '臭素',
            acceptedAnswers: ['水銀'],
            correctAnswerRate: 70,
          },
          {
            id: 'q_c2_1_new_8',
            label: '(8) 1族元素（水素を除く）の総称を答えよ。',
            type: 'short_answer',
            correctAnswer: 'アルカリ金属',
            correctAnswerRate: 80,
          },
          {
            id: 'q_c2_1_new_9',
            label: '(9) 2族元素の総称を答えよ。',
            type: 'short_answer',
            correctAnswer: 'アルカリ土類金属',
            correctAnswerRate: 75,
          },
        ],
        explanation:
          '▼ 解答・解説\n(1) ウ。原子の直径（約10⁻¹⁰m）は原子核の直径（約10⁻¹⁴〜10⁻¹⁵m）のおよそ1万〜10万倍。\n(2) 放射性同位体（ラジオアイソトープ）。\n(3) α線＝ヘリウムの原子核（He²⁺の流れ）。\n(4) β線＝電子（の流れ）。\n(5) 1/8 = (1/2)³ なので半減期を3回経過。5730×3 = 17190年前。\n(6)(7) 常温で液体の元素は水銀 Hg と臭素 Br₂。\n(8) アルカリ金属（水素を除く1族）。\n(9) アルカリ土類金属（2族）。',
        surroundingKnowledge: [],
        deepDiveTopics: [],
      });
    }

    // ①-miniTest：小テスト（mode='mini_test'）は practiceProblems とは別の
    //   miniTest 配列を参照する。c2_1 の miniTest には修正前の設問（進捗5/7 の削除前・
    //   電子配置のスペース区切り表記・パレット未設定・新規問題なし）がそのまま残っていたため、
    //   上記の全修正を反映した practiceProblems と同一内容へ同期する。
    //   （他の 2章 単元 c2_2〜c2_4 は miniTest が空配列のため practiceProblems のみで完結する。）
    if (Array.isArray(c2_1.miniTest) && c2_1.miniTest.length > 0) {
      c2_1.miniTest = c2_1.practiceProblems;
    }
  }

  // ------------------------------------------------------------
  // ② イオン (c2_2)
  // ------------------------------------------------------------
  const c2_2 = findPracticeChapter('c2_2');
  if (c2_2) {
    // ②-3（進捗3/7 q_c2_2_3）：結晶の単元の問題である旨を明記する（削除より前に実施）。
    const q223 = findPracticeProblem('c2_2', 'q_c2_2_3');
    if (q223 && !String(q223.text).includes('結晶の単元')) {
      q223.text = String(q223.text).replace(
        '【問3】 （標準）',
        '【問3】 （標準）（結晶の単元の問題だが、イオンと関連するので出題）'
      );
    }

    // ②-1 / ②-4 / ②-6（進捗1・4・6/7）：問題を削除する。
    c2_2.practiceProblems = (c2_2.practiceProblems || []).filter(
      (problem: any) => !['q_c2_2_1', 'q_c2_2_4', 'q_c2_2_6'].includes(problem.id)
    );

    // ②-new：上記修正を行ったうえで新しい問題を末尾に挿入する。
    //   PDF ②「イオン」問2（多原子イオンの名称）・問3（イオンの電子数）を出典とする。
    if (!(c2_2.practiceProblems || []).some((p: any) => p.id === 'q_c2_2_new')) {
      c2_2.practiceProblems.push({
        id: 'q_c2_2_new',
        category: 'イオン (問)',
        text: '【問】 次の各イオンについて、名称または電子数を答えよ。',
        subQuestions: [
          {
            id: 'q_c2_2_new_1',
            label: '(1) H₃O⁺ の名称を答えよ。',
            type: 'short_answer',
            correctAnswer: 'オキソニウムイオン',
            acceptedAnswers: ['オキソニウム'],
            correctAnswerRate: 65,
          },
          {
            id: 'q_c2_2_new_2',
            label: '(2) CH₃COO⁻ の名称を答えよ。',
            type: 'short_answer',
            correctAnswer: '酢酸イオン',
            correctAnswerRate: 70,
          },
          {
            id: 'q_c2_2_new_3',
            label: '(3) HCO₃⁻ の名称を答えよ。',
            type: 'short_answer',
            correctAnswer: '炭酸水素イオン',
            acceptedAnswers: ['炭酸水素イオン（重炭酸イオン）', '重炭酸イオン'],
            correctAnswerRate: 65,
          },
          {
            id: 'q_c2_2_new_4',
            label: '(4) K⁺ 1個が持つ電子の数は何個か（数値のみ）。',
            type: 'short_answer',
            correctAnswer: '18',
            correctAnswerRate: 70,
          },
          {
            id: 'q_c2_2_new_5',
            label: '(5) Mg²⁺ 1個が持つ電子の数は何個か（数値のみ）。',
            type: 'short_answer',
            correctAnswer: '10',
            correctAnswerRate: 75,
          },
          {
            id: 'q_c2_2_new_6',
            label: '(6) S²⁻ 1個が持つ電子の数は何個か（数値のみ）。',
            type: 'short_answer',
            correctAnswer: '18',
            correctAnswerRate: 70,
          },
          {
            id: 'q_c2_2_new_7',
            label: '(7) NH₄⁺ 1個が持つ電子の数は何個か（数値のみ）。',
            type: 'short_answer',
            correctAnswer: '10',
            correctAnswerRate: 65,
          },
        ],
        explanation:
          '▼ 解答・解説\n(1) オキソニウムイオン。(2) 酢酸イオン。(3) 炭酸水素イオン。\n多原子イオンの名称と化学式の対応は頻出なので丸暗記が必須。\n(4) K⁺：19-1 = 18個（Arと同じ）。(5) Mg²⁺：12-2 = 10個（Neと同じ）。\n(6) S²⁻：16+2 = 18個（Arと同じ）。(7) NH₄⁺：(7+4×1)-1 = 10個（Neと同じ）。\nイオンは最も近い貴ガスと同じ安定な電子配置になろうとする。',
        surroundingKnowledge: [],
        deepDiveTopics: [],
      });
    }
  }

  // ------------------------------------------------------------
  // ③ イオン生成とエネルギー (c2_3)
  // ------------------------------------------------------------
  const c2_3 = findPracticeChapter('c2_3');
  if (c2_3) {
    // ③-3 / ③-4 / ③-5 / ③-6（進捗3・4・5・6/7）：問題を削除する。
    c2_3.practiceProblems = (c2_3.practiceProblems || []).filter(
      (problem: any) =>
        !['q_c2_3_3', 'q_c2_3_4', 'q_c2_3_5', 'q_c2_3_6'].includes(problem.id)
    );

    // ③-new：上記修正を行ったうえで新しい問題を末尾に挿入する。
    //   PDF ③「イオン化エネルギー」問1（空欄）・問3（グラフ選択）を出典とする。
    if (!(c2_3.practiceProblems || []).some((p: any) => p.id === 'q_c2_3_new')) {
      c2_3.practiceProblems.push({
        id: 'q_c2_3_new',
        category: 'イオン生成とエネルギー (問)',
        text:
          '【問】 イオン化エネルギーと電子親和力について、次の問いに答えよ。\n\n気体状態の原子から電子を1個取り去って1価の陽イオンにするのに必要なエネルギーを（　①　）という。この値が最も大きい元素は（　②　）である。一方、気体状態の原子が電子を1個受け取って1価の陰イオンになるときに放出されるエネルギーを（　③　）という。この値が全元素中で最大となるのは、フッ素ではなく（　④　）である。',
        subQuestions: [
          {
            id: 'q_c2_3_new_1',
            label: '① 空欄に入る語句を答えよ。',
            type: 'short_answer',
            correctAnswer: '(第一)イオン化エネルギー',
            acceptedAnswers: ['第一イオン化エネルギー', 'イオン化エネルギー', '第1イオン化エネルギー'],
            correctAnswerRate: 75,
          },
          {
            id: 'q_c2_3_new_2',
            label: '② 第一イオン化エネルギーが全元素中で最大となる元素を、元素名または元素記号で答えよ。',
            type: 'short_answer',
            correctAnswer: 'ヘリウム',
            acceptedAnswers: ['He', 'ヘリウム（He）'],
            correctAnswerRate: 70,
          },
          {
            id: 'q_c2_3_new_3',
            label: '③ 空欄に入る語句を答えよ。',
            type: 'short_answer',
            correctAnswer: '電子親和力',
            correctAnswerRate: 75,
          },
          {
            id: 'q_c2_3_new_4',
            label: '④ 電子親和力が全元素中で最大となる元素を、元素名または元素記号で答えよ。',
            type: 'short_answer',
            correctAnswer: '塩素',
            acceptedAnswers: ['Cl', '塩素（Cl）'],
            correctAnswerRate: 60,
          },
          {
            id: 'q_c2_3_new_5',
            label: '(2) 原子番号を横軸にとったとき、「貴ガス（18族）で0になる」グラフは、第1イオン化エネルギー・価電子・電子親和力のうちどれか。',
            type: 'short_answer',
            correctAnswer: '価電子',
            acceptedAnswers: ['価電子の数'],
            correctAnswerRate: 65,
          },
        ],
        explanation:
          '▼ 解答・解説\n① 第一イオン化エネルギー：小さいほど陽イオンになりやすい。\n② ヘリウム He。第一イオン化エネルギーは周期表の右上ほど大きく、貴ガスの中でも最上部の He が最大。\n③ 電子親和力：大きいほど陰イオンになりやすい。\n④ 塩素 Cl。電子親和力はハロゲン（17族）で大きいが、フッ素は原子半径が小さすぎて電子間の反発が強いため、最大は Cl となる（頻出の例外）。\n(2) 価電子は貴ガス（18族）で0になる。イオン化エネルギーは貴ガスで極大、電子親和力は貴ガスでほぼ0（負）になる点で区別する。',
        surroundingKnowledge: [],
        deepDiveTopics: [],
      });
    }
  }

  // ------------------------------------------------------------
  // ④ 原子の大きさとイオンの大きさ (c2_4)
  // ------------------------------------------------------------
  const c2_4 = findPracticeChapter('c2_4');
  if (c2_4) {
    // ④-new：新しい問題を末尾に挿入する。
    //   PDF ④「原子の大きさとイオンの大きさ」問1（空欄穴埋め）を出典とする。
    if (!(c2_4.practiceProblems || []).some((p: any) => p.id === 'q_c2_4_new')) {
      c2_4.practiceProblems.push({
        id: 'q_c2_4_new',
        category: '原子の大きさとイオンの大きさ (問)',
        text:
          '【問】 原子半径・イオン半径の周期的な傾向について、次の各空欄に入る語句を、それぞれの選択肢から選んで答えよ。',
        subQuestions: [
          {
            id: 'q_c2_4_new_a',
            label: '(ア) 同じ族では、原子番号が大きくなるほど原子半径は（大きく／小さく）なる。',
            type: 'multiple_choice',
            options: ['大きく', '小さく'],
            correctAnswer: '大きく',
            correctAnswerRate: 75,
          },
          {
            id: 'q_c2_4_new_i',
            label: '(イ) それは、原子番号が大きくなるにつれて（　）の数が多くなるためである。空欄に入る語句を答えよ。',
            type: 'short_answer',
            correctAnswer: '電子殻',
            correctAnswerRate: 70,
          },
          {
            id: 'q_c2_4_new_u',
            label: '(ウ) 同じ周期では、原子番号が大きくなるほど原子半径は（大きく／小さく）なる。',
            type: 'multiple_choice',
            options: ['大きく', '小さく'],
            correctAnswer: '小さく',
            correctAnswerRate: 70,
          },
          {
            id: 'q_c2_4_new_e',
            label: '(エ) それは、原子核中の（　）の数が多くなり電子が強く引き付けられるためである。空欄に入る語句を答えよ。',
            type: 'short_answer',
            correctAnswer: '陽子',
            correctAnswerRate: 70,
          },
          {
            id: 'q_c2_4_new_o',
            label: '(オ) 原子が電子を放出して陽イオンになると、もとの原子半径よりも（大きく／小さく）なる。',
            type: 'multiple_choice',
            options: ['大きく', '小さく'],
            correctAnswer: '小さく',
            correctAnswerRate: 70,
          },
          {
            id: 'q_c2_4_new_ka',
            label: '(カ) 原子が電子を受け取って陰イオンになると、もとの原子半径よりも（大きく／小さく）なる。',
            type: 'multiple_choice',
            options: ['大きく', '小さく'],
            correctAnswer: '大きく',
            correctAnswerRate: 70,
          },
          {
            id: 'q_c2_4_new_ki',
            label: '(キ) O²⁻, F⁻, Na⁺ のように同じ電子配置のイオンでは、原子番号が（大きい／小さい）ほどイオン半径は小さくなる。',
            type: 'multiple_choice',
            options: ['大きい', '小さい'],
            correctAnswer: '大きい',
            correctAnswerRate: 60,
          },
          {
            id: 'q_c2_4_new_ku',
            label: '(ク) それは、電子数が同じでも陽子数が多いほど原子核が電子を引き付ける力が（強く／弱く）なるためである。',
            type: 'multiple_choice',
            options: ['強く', '弱く'],
            correctAnswer: '強く',
            correctAnswerRate: 65,
          },
        ],
        explanation:
          '▼ 解答・解説\n(ア) 大きく：同族（縦）は下に行くほど電子殻が増えて原子半径が大きくなる。\n(イ) 電子殻。\n(ウ) 小さく：同周期（横）は右に行くほど陽子が増え、電子がギュッと引き付けられて小さくなる。\n(エ) 陽子。\n(オ) 小さく：陽イオンは最外殻の電子を失うため小さくなる。\n(カ) 大きく：陰イオンは電子が増え、電子間の反発により大きくなる。\n(キ) 大きい：等電子配置では原子番号（=陽子数）が大きいほど核の引力が強く、半径は小さくなる（例：O²⁻ > F⁻ > Na⁺ > Mg²⁺ > Al³⁺）。\n(ク) 強く。',
        surroundingKnowledge: [],
        deepDiveTopics: [],
      });
    }
  }
})();

// ------------------------------------------------------------
// 解答・解説の統一フォーマット適用パス
// ------------------------------------------------------------
// すべての章の練習問題・小テストの explanation を、
// 「① 解答のピンクマーカー ／ ② ①②③の思考手順 ／ ③ 共通テスト出題傾向ボックス」
// を満たす形に整形する。
//
// ・解答の値は subQuestions[].correctAnswer をそのまま使うため、
//   解説文から解答を推測することによる取り違えが起こらない。
// ・単元ごとの思考の型・出題傾向は unitTeaching.ts が供給する。
// ・ロジックツリー等の構造化データ（JSON文字列）は対象外。
// ・enhanceExplanation は冪等なので、二重に走っても内容は変わらない。
//
// 上のパッチ群がすべて適用されたあとに実行する必要があるため、
// この位置（最後のパッチ IIFE の直後）に置いている。
// 章のなめ方・ロジックツリーの除外・整形の順序は化学（chemistryAdvancedData.ts）と
// 同じ手順なので、explanationPostProcess.ts の1つだけを使う
// （以前はここにも同じループがあった）。
//
// ★この教科だけ「単位変換の道順」を渡す★
//   物質量（mol）計算の道順は化学基礎の単元にしか無いため、
//   unitConversionOf を渡すのはこちらだけ。
(() => {
  applyExplanationPostProcess(chemistryData, {
    unitConversionOf: (problemId) => getMolUnitConversion(problemId),
  });
})();

// ------------------------------------------------------------
// 学習フローチャート（ロジックツリー）の図データ
// ------------------------------------------------------------
// 図データは chemistryTreeData.ts へ移した（このファイルを
// 「問題を増やすときに開くファイル」に近づけるため）。
// 既存の呼び出し側が `from '../data/chemistryData'` のまま動くように、
// ここで同じ名前のまま再公開している。
export {
  componentDetectionTreeData,
  substanceTreeData,
  separationTreeData,
  thermalMotionTreeData,
  atomicStructureTreeData,
  ionTreeData,
  ionGenerationTreeData,
  ionSizeTreeData,
  chemicalBondTreeData,
  crystalTreeData,
  interactionTreeData,
  atomicWeightTreeData,
  amountOfSubstanceTreeData,
  chemicalEquationTreeData,
  concentrationTreeData,
  acidBaseTreeData,
  redoxTreeData,
} from './chemistryTreeData';
