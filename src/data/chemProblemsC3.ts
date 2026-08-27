/**
 * ===================================================================
 * 化学基礎 3章「化学結合」 の問題データ
 * ===================================================================
 *
 * このファイルにあるのは、次の単元の問題（演習・ミニテスト）だけ。
 *
 *   ・c3_1     ① 結合の種類
 *   ・c3_2     ② 結晶の種類と性質
 *   ・c3_3     ③ 分子の相互作用と性質
 *
 * -------------------------------------------------------------------
 * ■ 問題を1問足したいとき
 * -------------------------------------------------------------------
 * ★このファイルの該当する単元の配列に、1件足すだけでよい。★
 * chemistryData.ts 側は「この配列を使う」と書いてあるだけなので、
 * そちらを触る必要は無い。
 *
 * 問題の形（スキーマ）は他の単元とまったく同じ。
 *
 *   { id, category, text, imageUrl?, imageCaption?, subQuestions[],
 *     explanation, surroundingKnowledge[], deepDiveTopics[] }
 *
 *   subQuestion:
 *   { id, label, type, options?/items?, correctAnswer,
 *     gradingCriteria?, correctAnswerRate?, detailedExplanation? }
 *
 * -------------------------------------------------------------------
 * ■ なぜ chemistryData.ts から分けたのか
 * -------------------------------------------------------------------
 * 元は chemistryData.ts に全6章の問題が1つのファイルに入っていて、
 * 12,827行・801KB という大きさだった。1問足すだけのことでも、
 * 目的の単元がどこにあるかを探すのに時間がかかり、
 * すぐ隣の他の単元をうっかり壊す危険もあった。
 *
 * この分け方は、このアプリの中に既にあるやり方にそろえたもの。
 *   ・⑤酸と塩基  → acidBaseProblems.ts
 *   ・⑥酸化還元  → redoxProblems.ts
 *   ・結晶        → crystalProblems.ts
 *   ・英文法      → egProblemsGrammar1.ts 〜 8
 * 新しい仕組みは作っていない。
 *
 * -------------------------------------------------------------------
 * ■ 中身は1文字も変えていない
 * -------------------------------------------------------------------
 * 移動しただけ。移動の前後で chemistryData.ts の全 export を
 * キー順を固定して JSON 化し、完全に一致することを確認している。
 *
 * -------------------------------------------------------------------
 * ■ import しているのは結晶の問題だけ
 * -------------------------------------------------------------------
 * ② 結晶の種類と性質（c3_2）は、以前から結晶の問題を
 * crystalProblems.ts に置いて呼び出す作りになっている。
 * その1件だけを import している（元の chemistryData.ts と同じ書き方）。
 *
 * crystalProblems.ts 側は何も import しない葉なので、
 * この向き（chemProblemsC3 → crystalProblems）だけで循環にはならない。
 */

import { pickCrystalProblems } from './crystalProblems';


/** c3_1 の演習問題。chemistryData.ts の "practiceProblems" にそのまま入る。 */
export const c3_1_Practice = [
  {
    "id": "q_c3_1_1",
    "category": "化学結合の種類と特徴 (問1)",
    "text": "【問1】 次の文章の空欄（ア）〜（ソ）に適する語句を答えよ。（語句網羅）\n\n原子どうしを結びつけている力を化学結合という。代表的な化学結合は次の4種類である。\n\n(1) 陽イオンと陰イオンが（ア）力で引き合う結合を（イ）結合といい、（ウ）と（エ）の組合せで生じる（例：NaCl）。\n(2) 2 つの原子が電子対を出し合って共有する結合を（オ）結合といい、主に（カ）どうしの組合せで生じる（例：H₂O, NH₃）。\n(3) 一方の原子から（キ）対が提供されてもう一方の原子と共有する結合を（ク）結合といい、NH₄⁺、H₃O⁺ などにみられる。\n(4) 金属原子どうしが（ケ）電子を共有することで生じる結合を（コ）結合という。\n\n共有結合のうち、1組の電子対による結合を（サ）結合、2組による結合を（シ）結合、3組による結合を（ス）結合という。\n共有結合には、結合に使われていない（セ）電子対も存在する。\n電子の偏りに着目すると、結合の極性の強さは（ソ）の差で判断できる。",
    "subQuestions": [
      {
        "id": "q_c3_1_1_a",
        "label": "問1(ア) 陽・陰イオンを引き合わす力",
        "type": "short_answer",
        "correctAnswer": "静電気",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c3_1_1_i",
        "label": "問1(イ) 代表的な化学結合の一つ",
        "type": "short_answer",
        "correctAnswer": "イオン",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c3_1_1_u",
        "label": "問1(ウ) イオン結合を成す元素の一つ（主に何金属か）",
        "type": "short_answer",
        "correctAnswer": "金属",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c3_1_1_e",
        "label": "問1(エ) イオン結合を成すもう一つの元素（主に非何元素か）",
        "type": "short_answer",
        "correctAnswer": "非金属",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c3_1_1_o",
        "label": "問1(オ) 電子対を出し合う結合",
        "type": "short_answer",
        "correctAnswer": "共有",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c3_1_1_ka",
        "label": "問1(カ) 共有結合は主に○○元素どうしで生じるか",
        "type": "short_answer",
        "correctAnswer": "非金属",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c3_1_1_ki",
        "label": "問1(キ) 提供される電子対（何電子対か）",
        "type": "short_answer",
        "correctAnswer": "非共有電子",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c3_1_1_ku",
        "label": "問1(ク) 一方的に提供して共有する結合",
        "type": "short_answer",
        "correctAnswer": "配位",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c3_1_1_ke",
        "label": "問1(ケ) 金属原子が放出する電子",
        "type": "short_answer",
        "correctAnswer": "自由",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c3_1_1_ko",
        "label": "問1(コ) 金属電子に寄与する結合",
        "type": "short_answer",
        "correctAnswer": "金属",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c3_1_1_sa",
        "label": "問1(サ) 1組の電子対による結合",
        "type": "short_answer",
        "correctAnswer": "単",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c3_1_1_shi",
        "label": "問1(シ) 2組による結合",
        "type": "short_answer",
        "correctAnswer": "二重",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c3_1_1_su",
        "label": "問1(ス) 3組による結合",
        "type": "short_answer",
        "correctAnswer": "三重",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c3_1_1_se",
        "label": "問1(セ) 結合評価のされない電子（○○電子対か）",
        "type": "short_answer",
        "correctAnswer": "非共有",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c3_1_1_so",
        "label": "問1(ソ) 結合の極性の強さは何の差か",
        "type": "short_answer",
        "correctAnswer": "電気陰性度",
        "correctAnswerRate": 85
      }
    ],
    "explanation": "▼ 解答・解説\n- （ア）静電気（クーロン力）\n- （イ）イオン\n- （ウ）金属\n- （エ）非金属\n- （オ）共有\n- （カ）非金属\n- （キ）非共有電子\n- （ク）配位\n- （ケ）自由\n- （コ）金属\n- （サ）単\n- （シ）二重\n- （ス）三重\n- （セ）非共有\n- （ソ）電気陰性度\n\n■ 化学結合の4つの基本種類（イオン結合、共有結合、配位結合、金属結合）について総合的に解説した文章です。それぞれの特徴や構成元素、電子の共有の仕方について完璧に押さえましょう。",
    "surroundingKnowledge": [],
    "deepDiveTopics": []
  },
  {
    "id": "q_c3_1_2",
    "category": "化学結合の種類と特徴 (問2)",
    "text": "【問2】 （基礎）次の化合物・物質を構成する結合を、ア〜エからすべて選べ（複数可）。\nア：イオン結合、イ：共有結合、ウ：金属結合、エ：配位結合",
    "subQuestions": [
      {
        "id": "q_c3_1_2_1",
        "label": "(1) NaCl",
        "type": "multiple_choice",
        "options": [
          "ア",
          "イ",
          "ウ",
          "エ"
        ],
        "correctAnswer": "ア",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c3_1_2_2",
        "label": "(2) H₂O",
        "type": "multiple_choice",
        "options": [
          "ア",
          "イ",
          "ウ",
          "エ"
        ],
        "correctAnswer": "イ",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c3_1_2_3",
        "label": "(3) NH₄Cl",
        "type": "multiple_choice",
        "options": [
          "ア",
          "イ",
          "ウ",
          "エ"
        ],
        "correctAnswer": "ア,イ,エ",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c3_1_2_4",
        "label": "(4) Fe",
        "type": "multiple_choice",
        "options": [
          "ア",
          "イ",
          "ウ",
          "エ"
        ],
        "correctAnswer": "ウ",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c3_1_2_5",
        "label": "(5) CO₂",
        "type": "multiple_choice",
        "options": [
          "ア",
          "イ",
          "ウ",
          "エ"
        ],
        "correctAnswer": "イ",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c3_1_2_6",
        "label": "(6) MgO",
        "type": "multiple_choice",
        "options": [
          "ア",
          "イ",
          "ウ",
          "エ"
        ],
        "correctAnswer": "ア",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c3_1_2_7",
        "label": "(7) Cu",
        "type": "multiple_choice",
        "options": [
          "ア",
          "イ",
          "ウ",
          "エ"
        ],
        "correctAnswer": "ウ",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c3_1_2_8",
        "label": "(8) HCl",
        "type": "multiple_choice",
        "options": [
          "ア",
          "イ",
          "ウ",
          "エ"
        ],
        "correctAnswer": "イ",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c3_1_2_9",
        "label": "(9) NH₃",
        "type": "multiple_choice",
        "options": [
          "ア",
          "イ",
          "ウ",
          "エ"
        ],
        "correctAnswer": "イ",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c3_1_2_10",
        "label": "(10) CaCl₂",
        "type": "multiple_choice",
        "options": [
          "ア",
          "イ",
          "ウ",
          "エ"
        ],
        "correctAnswer": "ア",
        "correctAnswerRate": 85
      }
    ],
    "explanation": "▼ 解答・解説\n(1) NaCl : ア（Na⁺とCl⁻のイオン結合）\n(2) H₂O : イ（非金属同士の共有結合）\n(3) NH₄Cl : ア＋イ＋エ（アンモニウムイオン NH₄⁺ は、アンモニア NH₃ と水素イオン H⁺ が「共有結合」および「配位結合」で結合したものであり、その NH₄⁺ と 塩素イオン Cl⁻ の間は「イオン結合」で結合しています。したがって、3種類の結合のすべてが存在します）\n(4) Fe : ウ（金属元素のみの金属結合）\n(5) CO₂ : イ（非金属同士の共有結合）\n(6) MgO : ア（Mg²⁺とO²⁻のイオン結合）\n(7) Cu : ウ（金属結合）\n(8) HCl : イ（共有結合）\n(9) NH₃ : イ（共有結合）\n(10) CaCl₂ : ア（Ca²⁺とCl⁻のイオン結合）",
    "surroundingKnowledge": [],
    "deepDiveTopics": []
  },
  {
    "id": "q_c3_1_6",
    "category": "化学結合の種類と特徴 (問6)",
    "text": "【問6】 （共通テスト風応用）次の物質中の結合のうち、すべての結合が同じ種類でない（複数種類の結合を含む）ものを1つ選べ。\n\n① H₂\n② CH₄\n③ NaCl\n④ NH₄Cl\n⑤ CO₂",
    "subQuestions": [
      {
        "id": "q_c3_1_6_ans",
        "label": "複数種類の結合を含むもの",
        "type": "multiple_choice",
        "options": [
          "①",
          "②",
          "③",
          "④",
          "⑤"
        ],
        "correctAnswer": "④",
        "correctAnswerRate": 85
      }
    ],
    "explanation": "▼ 解答・解説\n答：④\n\n- ① H₂ : 全て「共有結合（単結合）」のみで構成されます。\n- ② CH₄ : 全て「共有結合（単結合）」のみで構成されます。\n- ③ NaCl : 「イオン結合」のみで構成されます。\n- ④ NH₄Cl : NH₄⁺（アンモニウムイオン）内部に窒素-水素間の「共有結合」と、それに加えて「配位結合」が存在します。さらに、NH₄⁺ という陽イオンと Cl⁻（塩化物イオン）という陰イオンとの間は「イオン結合」で結合しています。したがって、3種類もの異なる結合を同時に含んでおり、すべての結合が同じ種類ではありません。\n- ⑤ CO₂ : 全て炭素-酸素間の「共有結合（二重結合）」のみで構成されます。",
    "surroundingKnowledge": [],
    "deepDiveTopics": []
  },
  {
    "id": "q_c3_1_7",
    "category": "化学結合の種類と特徴 (問7)",
    "text": "【問7】 （共通テスト風応用）次の説明のうち、誤っているものをすべて選べ。\n\nア：イオン結合は陽イオンと陰イオンの静電気的引力による結合である。\nイ：共有結合は金属原子と非金属原子の間で生じる。\nウ：金属結合では、自由電子が金属原子の間を自由に動き回る。\nエ：配位結合は、結合のでき方は他の共有結合と異なるが、できあがった結合の性質は同じである。\nオ：水分子中の O-H 結合はイオン結合である。",
    "subQuestions": [
      {
        "id": "q_c3_1_7_ans",
        "label": "誤っているものの組合せ",
        "type": "multiple_choice",
        "options": [
          "ア",
          "イ",
          "ウ",
          "エ",
          "オ"
        ],
        "correctAnswer": "イ,オ",
        "correctAnswerRate": 85
      }
    ],
    "explanation": "▼ 解答・解説\n答：イ,オ（イとオが誤り）\n\n- ア：正しい。イオン結合は、クーロン力（電気的な引っ張り合い）のみによる結合です。\n- イ：誤り。共有結合は、一般に非金属原子どうしが価電子を共有することで結合します。金属と非金属の組み合わせはイオン結合を形成します。\n- ウ：正しい。自由電子が結晶全体を動き回ることで、熱・電気伝導性などの優れた特性が付与されます。\n- エ：正しい。できあがりの性質（長さ、強さなど）は通常の共有結合と完全に等価で区別できません。\n- オ：誤り。水分子 H₂O の O-H 結合は、非金属同士の「極性共有結合（共有結合）」です。電気陰性度の差はありますが、1.7未満（Δχ = 1.2）であるため共有結合に分類されます。",
    "surroundingKnowledge": [],
    "deepDiveTopics": []
  }
];

/** c3_2 の演習問題。chemistryData.ts の "practiceProblems" にそのまま入る。 */
export const c3_2_Practice = [
  // ── 教科書順①〜④（基本教科書「化学結合」の配列を厳守して先頭に配置）──
  //   ① イオン結合とイオン結晶（組成式・名称・へき開）
  //   ② 共有結合と分子（電子式・構造式・分子の形と極性）＝分子結晶の前提
  //   ③ 共有結合の結晶（炭素の同素体・ダイヤモンドと黒鉛）
  //   ④ 化学式の種類と物質中の化学結合（配位結合・金属結合まで出そろう）
  ...pickCrystalProblems(
    'p_c3_2_ion',
    'p_c3_2_molecule',
    'p_c3_2_covalent',
    'p_c3_2_formula'
  ),
  {
    "id": "q_c3_2_n1",
    "category": "結晶の種類と性質 (発展1 イオン結合とイオン結晶)",
    "text": "【発展1】 イオン結合とイオン結晶　［知識・技能／思考・判断・表現］\n\n問1 次のイオンの組合せでできる物質の「組成式」と「名称」を記せ。\n(1) Ca²⁺ と Cl⁻\n(2) Al³⁺ と O²⁻\n(3) NH₄⁺ と SO₄²⁻\n(4) Cu²⁺ と NO₃⁻\n\n問2 塩化ナトリウムなどのイオン結晶に強い力を加えると、特定の面に沿って割れやすい（へき開）。この理由を、「力を加えることによって」に続く形で50字程度で説明せよ。\n\n問3 イオンからなる物質は、分子式ではなく組成式で表される。その理由を「分子」という語を用いて簡潔に説明せよ。",
    "subQuestions": [
      {
        "id": "q_c3_2_n1_1f",
        "label": "問1(1) Ca²⁺ と Cl⁻ の組成式",
        "type": "short_answer",
        "correctAnswer": "CaCl2",
        "acceptedAnswers": [
          "CaCl₂"
        ],
        "correctAnswerRate": 85
      },
      {
        "id": "q_c3_2_n1_1n",
        "label": "問1(1) その名称",
        "type": "short_answer",
        "correctAnswer": "塩化カルシウム",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c3_2_n1_2f",
        "label": "問1(2) Al³⁺ と O²⁻ の組成式",
        "type": "short_answer",
        "correctAnswer": "Al2O3",
        "acceptedAnswers": [
          "Al₂O₃"
        ],
        "correctAnswerRate": 75
      },
      {
        "id": "q_c3_2_n1_2n",
        "label": "問1(2) その名称",
        "type": "short_answer",
        "correctAnswer": "酸化アルミニウム",
        "correctAnswerRate": 80
      },
      {
        "id": "q_c3_2_n1_3f",
        "label": "問1(3) NH₄⁺ と SO₄²⁻ の組成式",
        "type": "short_answer",
        "correctAnswer": "(NH4)2SO4",
        "acceptedAnswers": [
          "(NH₄)₂SO₄",
          "（NH4）2SO4",
          "（NH₄）₂SO₄"
        ],
        "correctAnswerRate": 60
      },
      {
        "id": "q_c3_2_n1_3n",
        "label": "問1(3) その名称",
        "type": "short_answer",
        "correctAnswer": "硫酸アンモニウム",
        "correctAnswerRate": 70
      },
      {
        "id": "q_c3_2_n1_4f",
        "label": "問1(4) Cu²⁺ と NO₃⁻ の組成式",
        "type": "short_answer",
        "correctAnswer": "Cu(NO3)2",
        "acceptedAnswers": [
          "Cu(NO₃)₂",
          "Cu（NO3）2",
          "Cu（NO₃）₂"
        ],
        "correctAnswerRate": 60
      },
      {
        "id": "q_c3_2_n1_4n",
        "label": "問1(4) その名称",
        "type": "short_answer",
        "correctAnswer": "硝酸銅(II)",
        "acceptedAnswers": [
          "硝酸銅(Ⅱ)",
          "硝酸銅（Ⅱ）",
          "硝酸銅（II）",
          "硝酸銅(2)",
          "硝酸銅"
        ],
        "correctAnswerRate": 55
      },
      {
        "id": "q_c3_2_n1_2",
        "label": "問2 へき開（割れやすい）理由を50字程度で（「力を加えることによって」に続けて）",
        "type": "descriptive",
        "correctAnswer": "イオンの配列がずれ、同符号の電荷をもつイオンどうしが隣り合って静電気的な反発力がはたらくから。",
        "correctAnswerRate": 45
      },
      {
        "id": "q_c3_2_n1_3",
        "label": "問3 イオンからなる物質を組成式で表す理由（「分子」を用いて）",
        "type": "descriptive",
        "correctAnswer": "多数の陽イオンと陰イオンが連続して規則正しく配列しており、分子という単位の粒子が存在しないから。",
        "correctAnswerRate": 50
      }
    ],
    "explanation": "▼ 解答・解説\n\n【問1】\n(1) <span style=\"background-image:linear-gradient(to top, rgba(233,104,142,0.85) 0%, rgba(244,169,196,0.75) 55%, rgba(244,169,196,0) 100%); background-repeat:no-repeat; background-size:100% 40%; background-position:0 100%; font-weight:bold; padding:0 3px 1px; border-radius:2px;\">【解答】組成式：CaCl₂　／　名称：塩化カルシウム</span>\n(2) <span style=\"background-image:linear-gradient(to top, rgba(233,104,142,0.85) 0%, rgba(244,169,196,0.75) 55%, rgba(244,169,196,0) 100%); background-repeat:no-repeat; background-size:100% 40%; background-position:0 100%; font-weight:bold; padding:0 3px 1px; border-radius:2px;\">【解答】組成式：Al₂O₃　／　名称：酸化アルミニウム</span>\n(3) <span style=\"background-image:linear-gradient(to top, rgba(233,104,142,0.85) 0%, rgba(244,169,196,0.75) 55%, rgba(244,169,196,0) 100%); background-repeat:no-repeat; background-size:100% 40%; background-position:0 100%; font-weight:bold; padding:0 3px 1px; border-radius:2px;\">【解答】組成式：(NH₄)₂SO₄　／　名称：硫酸アンモニウム</span>\n(4) <span style=\"background-image:linear-gradient(to top, rgba(233,104,142,0.85) 0%, rgba(244,169,196,0.75) 55%, rgba(244,169,196,0) 100%); background-repeat:no-repeat; background-size:100% 40%; background-position:0 100%; font-weight:bold; padding:0 3px 1px; border-radius:2px;\">【解答】組成式：Cu(NO₃)₂　／　名称：硝酸銅(II)</span>\n\n■ 思考手順（組成式のつくり方は、この3ステップで固定）\n① <span style=\"font-weight:bold; -webkit-text-decoration:underline wavy currentColor; text-decoration:underline wavy currentColor; text-decoration-thickness:1.5px; text-underline-offset:5px; text-decoration-skip-ink:none;\">イオンの価数を確認する</span>\n　・イオン結晶は結晶全体で電気的に中性。つまり「正電荷の総量＝負電荷の総量」になる個数比しか許されない。\n② <span style=\"font-weight:bold; -webkit-text-decoration:underline wavy currentColor; text-decoration:underline wavy currentColor; text-decoration-thickness:1.5px; text-underline-offset:5px; text-decoration-skip-ink:none;\">価数をたすき掛けして最も簡単な整数比を出す</span>\n　・Ca²⁺ と Cl⁻ … 2 と 1 を入れかえて Ca : Cl ＝ 1 : 2 → CaCl₂\n　・Al³⁺ と O²⁻ … 3 と 2 を入れかえて Al : O ＝ 2 : 3 → Al₂O₃\n　・NH₄⁺ と SO₄²⁻ … 1 と 2 を入れかえて 2 : 1 → (NH₄)₂SO₄\n　・Cu²⁺ と NO₃⁻ … 2 と 1 を入れかえて 1 : 2 → Cu(NO₃)₂\n③ <span style=\"font-weight:bold; -webkit-text-decoration:underline wavy currentColor; text-decoration:underline wavy currentColor; text-decoration-thickness:1.5px; text-underline-offset:5px; text-decoration-skip-ink:none;\">多原子イオンが2個以上なら ( ) でくくり、名称は「陰イオン → 陽イオン」の順に読む</span>\n　・(NH₄)₂SO₄ の ( ) を外して NH₄₂SO₄ と書くのは完全な誤り（原子数が変わってしまう）。\n　・銅のように複数の価数（Cu⁺, Cu²⁺）をとる金属は、名称にローマ数字を添えて 硝酸銅(II) とする。\n　・読み方は「塩化物イオン＋カルシウムイオン → 塩化カルシウム」のように、「〜物イオン」「〜イオン」を外して続けるだけ。\n\n⚠️ <span style=\"font-weight:bold; -webkit-text-decoration:underline wavy currentColor; text-decoration:underline wavy currentColor; text-decoration-thickness:1.5px; text-underline-offset:5px; text-decoration-skip-ink:none;\">ありがちなミス</span>：Al₂O₃ を「AlO」「Al₃O₂」としてしまう。たすき掛けは\"相手の価数を自分の右下に書く\"と覚える。\n\n【問2】\n<span style=\"background-image:linear-gradient(to top, rgba(233,104,142,0.85) 0%, rgba(244,169,196,0.75) 55%, rgba(244,169,196,0) 100%); background-repeat:no-repeat; background-size:100% 40%; background-position:0 100%; font-weight:bold; padding:0 3px 1px; border-radius:2px;\">【解答例】（力を加えることによって）イオンの配列が一列分ずれ、同符号の電荷をもつイオンどうしが向かい合って静電気的な反発力がはたらくから。（50字程度）</span>\n\n■ 思考手順（記述はこの3段構成で書けば必ず点になる）\n① 力を加える前の状態を書く … 陽イオンと陰イオンが交互に規則正しく並び、静電気力（クーロン力）で引き合って安定している。\n② 力を加えた後の変化を書く … 層が1列分ずれると、陽イオンの隣が陽イオン、陰イオンの隣が陰イオンになる。\n③ 結果を書く … <span style=\"font-weight:bold; -webkit-text-decoration:underline wavy currentColor; text-decoration:underline wavy currentColor; text-decoration-thickness:1.5px; text-underline-offset:5px; text-decoration-skip-ink:none;\">引力が反発力に反転する</span>ため、その面に沿ってパリッと割れる（＝へき開／劈開）。\n\n◎対比で覚える：金属結晶は同じようにずらしても、自由電子がすべての原子を結びつけ続けるので割れずに変形する（展性・延性）。\n　「イオン結晶＝硬いがもろい／金属結晶＝変形する」はセットで暗記する。\n\n【問3】\n<span style=\"background-image:linear-gradient(to top, rgba(233,104,142,0.85) 0%, rgba(244,169,196,0.75) 55%, rgba(244,169,196,0) 100%); background-repeat:no-repeat; background-size:100% 40%; background-position:0 100%; font-weight:bold; padding:0 3px 1px; border-radius:2px;\">【解答例】イオン結晶では多数の陽イオンと陰イオンが連続して規則正しく配列しており、「分子」という単位の粒子が存在しないから。そのためイオンの数の最も簡単な整数比（組成式）で表す。</span>\n\n◎ポイント：<span style=\"font-weight:bold; -webkit-text-decoration:underline wavy currentColor; text-decoration:underline wavy currentColor; text-decoration-thickness:1.5px; text-underline-offset:5px; text-decoration-skip-ink:none;\">組成式＝粒子の数の比</span> ／ <span style=\"font-weight:bold; -webkit-text-decoration:underline wavy currentColor; text-decoration:underline wavy currentColor; text-decoration-thickness:1.5px; text-underline-offset:5px; text-decoration-skip-ink:none;\">分子式＝分子1個に含まれる原子の実数</span>。\n　イオン結晶・金属結晶・共有結合の結晶は組成式、分子結晶だけが分子式（ロジックツリーの STEP 1「結晶の基本と組成式・分子式」で確認）。\n<div style=\"background-color:#FFF4E5; border:2px solid #FB8C00; border-left:9px solid #FB8C00; border-radius:10px; padding:10px 12px; margin-top:12px; color:#3E2723;\">💡 【ココが狙われる！共通テスト・センター試験のリアル】\n\n■ 出典：2017年 センター試験 本試 第1問 問4a（イオン結晶でないものを選ぶ）／2025年 共通テスト（物質と化学結合の対応）／2016年 センター試験（化学結合の正誤）\n\n■ 過去問では「組成式そのもの」より、こう聞かれた！\n　・与えられた物質が イオン結晶かどうか を判定させ、そのうえで「固体は電気を通すか」「融解液は通すか」まで一気に問う複合型。\n　・「イオン結合は金属元素と非金属元素の間にできる」という原則を、例外物質で揺さぶる出題。\n\n■ このパターンのひっかけが多い！\n　⚠️ NH₄Cl や (NH₄)₂SO₄ は 非金属元素だけ からできているのに イオン結晶。「金属＋非金属＝イオン結合」だけを暗記していると必ず外す。\n　⚠️ 「イオン結晶は硬い」→ ○ だが「割れにくい」→ × （硬いが もろい ＝へき開する）。硬さと もろさ を同一視させる選択肢は定番。\n\n■ 実践アドバイス\n　組成式を書けたら終わりにせず、その物質について「固体は電気を通さない／融解液・水溶液は通す」「融点は高い」「硬いがもろい」の3点セットまで即答できる状態にしておくこと。本問の問2（へき開の記述）は、そのまま2次・私大の論述でも問われる超頻出テーマ。</div>",
    "surroundingKnowledge": [],
    "deepDiveTopics": []
  },
  {
    "id": "q_c3_2_n2",
    "category": "結晶の種類と性質 (発展2 分子の構造・電子式・極性)",
    "text": "【発展2】 分子の構造・電子式・極性　［知識・技能］\n\n次の (a)〜(f) の分子について、以下の問いに答えよ。\n\n(a) H₂　(b) N₂　(c) CO₂　(d) H₂O　(e) NH₃　(f) CH₄\n\n(1) 三重結合をもつ分子はどれか。\n(2) 二重結合をもつ分子はどれか。\n(3) ①非共有電子対を最も多くもつ分子、②非共有電子対をもたない分子は、それぞれどれか。\n(4) 極性分子はどれか。\n(5) 各分子の形を次の (ア)〜(エ) からそれぞれ選べ。\n　(ア) 直線形　(イ) 折れ線形　(ウ) 三角錐形　(エ) 正四面体形\n(6) (b) N₂ と (d) H₂O の電子式、(c) CO₂ と (e) NH₃ の構造式を記せ。",
    "subQuestions": [
      {
        "id": "q_c3_2_n2_1",
        "label": "(1) 三重結合をもつ分子",
        "type": "multiple_choice",
        "options": [
          "(a) H₂",
          "(b) N₂",
          "(c) CO₂",
          "(d) H₂O",
          "(e) NH₃",
          "(f) CH₄"
        ],
        "correctAnswer": "(b) N₂",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c3_2_n2_2",
        "label": "(2) 二重結合をもつ分子",
        "type": "multiple_choice",
        "options": [
          "(a) H₂",
          "(b) N₂",
          "(c) CO₂",
          "(d) H₂O",
          "(e) NH₃",
          "(f) CH₄"
        ],
        "correctAnswer": "(c) CO₂",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c3_2_n2_3a",
        "label": "(3)① 非共有電子対を最も多くもつ分子",
        "type": "multiple_choice",
        "options": [
          "(a) H₂",
          "(b) N₂",
          "(c) CO₂",
          "(d) H₂O",
          "(e) NH₃"
        ],
        "correctAnswer": "(c) CO₂",
        "correctAnswerRate": 55
      },
      {
        "id": "q_c3_2_n2_3b",
        "label": "(3)② 非共有電子対をもたない分子（すべて）",
        "type": "multiple_choice",
        "options": [
          "(a) と (f)",
          "(a) と (b)",
          "(d) と (e)",
          "(c) と (f)",
          "(f) のみ"
        ],
        "correctAnswer": "(a) と (f)",
        "correctAnswerRate": 60
      },
      {
        "id": "q_c3_2_n2_4",
        "label": "(4) 極性分子（すべて）",
        "type": "multiple_choice",
        "options": [
          "(d) と (e)",
          "(c) と (d)",
          "(a) と (b)",
          "(c)・(d)・(e)",
          "(e) と (f)"
        ],
        "correctAnswer": "(d) と (e)",
        "correctAnswerRate": 65
      },
      {
        "id": "q_c3_2_n2_5a",
        "label": "(5)(a) H₂ の形",
        "type": "multiple_choice",
        "options": [
          "ア 直線形",
          "イ 折れ線形",
          "ウ 三角錐形",
          "エ 正四面体形"
        ],
        "correctAnswer": "ア 直線形",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c3_2_n2_5b",
        "label": "(5)(b) N₂ の形",
        "type": "multiple_choice",
        "options": [
          "ア 直線形",
          "イ 折れ線形",
          "ウ 三角錐形",
          "エ 正四面体形"
        ],
        "correctAnswer": "ア 直線形",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c3_2_n2_5c",
        "label": "(5)(c) CO₂ の形",
        "type": "multiple_choice",
        "options": [
          "ア 直線形",
          "イ 折れ線形",
          "ウ 三角錐形",
          "エ 正四面体形"
        ],
        "correctAnswer": "ア 直線形",
        "correctAnswerRate": 80
      },
      {
        "id": "q_c3_2_n2_5d",
        "label": "(5)(d) H₂O の形",
        "type": "multiple_choice",
        "options": [
          "ア 直線形",
          "イ 折れ線形",
          "ウ 三角錐形",
          "エ 正四面体形"
        ],
        "correctAnswer": "イ 折れ線形",
        "correctAnswerRate": 80
      },
      {
        "id": "q_c3_2_n2_5e",
        "label": "(5)(e) NH₃ の形",
        "type": "multiple_choice",
        "options": [
          "ア 直線形",
          "イ 折れ線形",
          "ウ 三角錐形",
          "エ 正四面体形"
        ],
        "correctAnswer": "ウ 三角錐形",
        "correctAnswerRate": 75
      },
      {
        "id": "q_c3_2_n2_5f",
        "label": "(5)(f) CH₄ の形",
        "type": "multiple_choice",
        "options": [
          "ア 直線形",
          "イ 折れ線形",
          "ウ 三角錐形",
          "エ 正四面体形"
        ],
        "correctAnswer": "エ 正四面体形",
        "correctAnswerRate": 80
      },
      {
        "id": "q_c3_2_n2_6a",
        "label": "(6) N₂ の電子式",
        "type": "descriptive",
        "correctAnswer": ":N:::N:（三重結合＋両端のNに非共有電子対1組ずつ）",
        "correctAnswerRate": 50
      },
      {
        "id": "q_c3_2_n2_6b",
        "label": "(6) H₂O の電子式",
        "type": "descriptive",
        "correctAnswer": "H:O:H（Oの上下に非共有電子対2組）",
        "correctAnswerRate": 55
      },
      {
        "id": "q_c3_2_n2_6c",
        "label": "(6) CO₂ の構造式",
        "type": "descriptive",
        "correctAnswer": "O＝C＝O",
        "correctAnswerRate": 70
      },
      {
        "id": "q_c3_2_n2_6d",
        "label": "(6) NH₃ の構造式",
        "type": "descriptive",
        "correctAnswer": "H－N（－H）－H（Nから3本の単結合でHが3個）",
        "correctAnswerRate": 65
      }
    ],
    "explanation": "▼ 解答・解説\n\n(1) <span style=\"background-image:linear-gradient(to top, rgba(233,104,142,0.85) 0%, rgba(244,169,196,0.75) 55%, rgba(244,169,196,0) 100%); background-repeat:no-repeat; background-size:100% 40%; background-position:0 100%; font-weight:bold; padding:0 3px 1px; border-radius:2px;\">【解答】(b) N₂</span>　　(2) <span style=\"background-image:linear-gradient(to top, rgba(233,104,142,0.85) 0%, rgba(244,169,196,0.75) 55%, rgba(244,169,196,0) 100%); background-repeat:no-repeat; background-size:100% 40%; background-position:0 100%; font-weight:bold; padding:0 3px 1px; border-radius:2px;\">【解答】(c) CO₂</span>\n(3) ① <span style=\"background-image:linear-gradient(to top, rgba(233,104,142,0.85) 0%, rgba(244,169,196,0.75) 55%, rgba(244,169,196,0) 100%); background-repeat:no-repeat; background-size:100% 40%; background-position:0 100%; font-weight:bold; padding:0 3px 1px; border-radius:2px;\">【解答】(c) CO₂</span>　② <span style=\"background-image:linear-gradient(to top, rgba(233,104,142,0.85) 0%, rgba(244,169,196,0.75) 55%, rgba(244,169,196,0) 100%); background-repeat:no-repeat; background-size:100% 40%; background-position:0 100%; font-weight:bold; padding:0 3px 1px; border-radius:2px;\">【解答】(a) H₂ ・ (f) CH₄</span>\n(4) <span style=\"background-image:linear-gradient(to top, rgba(233,104,142,0.85) 0%, rgba(244,169,196,0.75) 55%, rgba(244,169,196,0) 100%); background-repeat:no-repeat; background-size:100% 40%; background-position:0 100%; font-weight:bold; padding:0 3px 1px; border-radius:2px;\">【解答】(d) H₂O ・ (e) NH₃</span>\n(5) <span style=\"background-image:linear-gradient(to top, rgba(233,104,142,0.85) 0%, rgba(244,169,196,0.75) 55%, rgba(244,169,196,0) 100%); background-repeat:no-repeat; background-size:100% 40%; background-position:0 100%; font-weight:bold; padding:0 3px 1px; border-radius:2px;\">【解答】(a) ア　(b) ア　(c) ア　(d) イ　(e) ウ　(f) エ</span>\n(6) <span style=\"background-image:linear-gradient(to top, rgba(233,104,142,0.85) 0%, rgba(244,169,196,0.75) 55%, rgba(244,169,196,0) 100%); background-repeat:no-repeat; background-size:100% 40%; background-position:0 100%; font-weight:bold; padding:0 3px 1px; border-radius:2px;\">【解答】N₂ の電子式：:N⋮⋮N:（三重結合＋両端に非共有電子対1組ずつ）／H₂O の電子式：H:O:H（O の上下に非共有電子対2組）／CO₂ の構造式：O＝C＝O／NH₃ の構造式：N から3本の単結合が出て H が3個（H－N(－H)－H）</span>\n\n■ まず「1枚の表」に落とすのが最短ルート\n分子 ｜ 共有電子対 ｜ 非共有電子対 ｜ 形 ｜ 極性\nH₂ ｜ 1 ｜ 0 ｜ 直線形 ｜ 無極性\nN₂ ｜ 3（三重結合） ｜ 2 ｜ 直線形 ｜ 無極性\nCO₂ ｜ 4（二重結合×2） ｜ 4 ｜ 直線形 ｜ 無極性\nH₂O ｜ 2 ｜ 2 ｜ 折れ線形 ｜ 極性\nNH₃ ｜ 3 ｜ 1 ｜ 三角錐形 ｜ 極性\nCH₄ ｜ 4 ｜ 0 ｜ 正四面体形 ｜ 無極性\n\n■ 思考手順（電子式 → 形 → 極性 の順にたどる）\n① <span style=\"font-weight:bold; -webkit-text-decoration:underline wavy currentColor; text-decoration:underline wavy currentColor; text-decoration-thickness:1.5px; text-underline-offset:5px; text-decoration-skip-ink:none;\">各原子の最外殻電子数を書き、オクテット（H は2個）になるよう電子対を組む</span>\n　・O は6個、N は5個、C は4個、H は1個。足りない分だけ共有結合の手が出る（O は2本、N は3本、C は4本、H は1本）。\n② <span style=\"font-weight:bold; -webkit-text-decoration:underline wavy currentColor; text-decoration:underline wavy currentColor; text-decoration-thickness:1.5px; text-underline-offset:5px; text-decoration-skip-ink:none;\">共有に使わなかった電子対＝非共有電子対を数える</span>\n　・CO₂：O 1個につき非共有電子対2組 × 2個 ＝ 4組で最多。→ (3)① の答え。\n　・H₂ と CH₄：電子はすべて共有結合に使われ、非共有電子対は0組。→ (3)② の答え。\n③ <span style=\"font-weight:bold; -webkit-text-decoration:underline wavy currentColor; text-decoration:underline wavy currentColor; text-decoration-thickness:1.5px; text-underline-offset:5px; text-decoration-skip-ink:none;\">中心原子まわりの「結合の数＋非共有電子対の数」から形を決める</span>\n　・CO₂：中心 C に非共有電子対なし＋結合相手2個 → 直線形。\n　・H₂O：中心 O に非共有電子対2組＋結合相手2個 → 押し下げられて 折れ線形。\n　・NH₃：中心 N に非共有電子対1組＋結合相手3個 → 三角錐形。\n　・CH₄：中心 C に非共有電子対なし＋結合相手4個 → 正四面体形。\n④ <span style=\"font-weight:bold; -webkit-text-decoration:underline wavy currentColor; text-decoration:underline wavy currentColor; text-decoration-thickness:1.5px; text-underline-offset:5px; text-decoration-skip-ink:none;\">「結合の極性」を矢印で書き込み、足し算して残るかどうかで分子の極性を判定する</span>\n　・CO₂ は C＝O 結合自体には極性があるが、直線形で左右対称 → ベクトルが打ち消し合って 無極性分子。\n　・CH₄ も正四面体形で対称 → 無極性分子。\n　・H₂O（折れ線）・NH₃（三角錐）は形が非対称 → 打ち消されず 極性分子。\n\n◎最重要ポイント：<span style=\"font-weight:bold; -webkit-text-decoration:underline wavy currentColor; text-decoration:underline wavy currentColor; text-decoration-thickness:1.5px; text-underline-offset:5px; text-decoration-skip-ink:none;\">「結合の極性」と「分子の極性」は別もの</span>。必ず <span style=\"font-weight:bold; -webkit-text-decoration:underline wavy currentColor; text-decoration:underline wavy currentColor; text-decoration-thickness:1.5px; text-underline-offset:5px; text-decoration-skip-ink:none;\">分子の形（対称性）</span> まで考えてから判定すること。\n　この判定手順は、次の単元「③ 分子の相互作用と性質」の STEP 2「分子の極性」でそのまま使う土台になる。\n<div style=\"background-color:#FFF4E5; border:2px solid #FB8C00; border-left:9px solid #FB8C00; border-radius:10px; padding:10px 12px; margin-top:12px; color:#3E2723;\">💡 【ココが狙われる！共通テスト・センター試験のリアル】\n\n■ 出典：2020年 共通テスト（無極性分子を2つ選ぶ）／2021年 共通テスト 第1問 問5（極性分子と分子の形）／2024年 共通テスト 問8（CH₄・CCl₄ の立体判定）／2026年 共通テスト 問6（H₂O・CO₂・NH₃ の極性）／2017年 センター 問4b（直線形の分子）\n\n■ 過去問では、こういう要素が問われた！\n　・「分子の形」と「極性の有無」を必ずセットで問う。単独で形だけ聞く年はほとんどない。\n　・非共有電子対の数を数えさせ、そこから形（折れ線・三角錐）を導かせる、電子式と立体構造の融合問題。\n　・分子の極性を、水への溶けやすさ・沸点の高さ（水素結合）へ発展させる複合問題。\n\n■ このパターンのひっかけが多い！\n　⚠️ 最頻出は CO₂。「C＝O に極性があるから極性分子」と答えさせる誘導。正しくは 直線形で打ち消し合うので無極性。\n　⚠️ H₂O を「H－O－H だから直線形」と錯覚させる図。非共有電子対2組が結合を押し下げるので 折れ線形。\n　⚠️ NH₃ を「平面三角形」と答えさせる選択肢。非共有電子対があるので 三角錐形（平面三角形は BCl₃ など）。\n\n■ 実践アドバイス\n　演習では必ず「電子式を書く → 非共有電子対に丸をつける → 形を描く → 極性の矢印を足す」の4アクションを紙の上で実行すること。共通テストは選択肢を眺めるだけでは切れない作りになっており、この4アクションを30秒でできる生徒だけが確実に得点している。</div>",
    "surroundingKnowledge": [],
    "deepDiveTopics": []
  },
  {
    "id": "q_c3_2_n3",
    "category": "結晶の種類と性質 (発展3 炭素の同素体と共有結合の結晶)",
    "text": "【発展3】 炭素の同素体と共有結合の結晶　［思考・判断・表現］\n\n図は、炭素の2種類の同素体 (A)、(B) の結晶構造を模式的に表したものである。\n\n【図の説明】\n(A) … 1個の炭素原子が4個の炭素原子と結合し、(a) の結合による正四面体形の配列が立体的に繰り返される構造。\n(B) … 1個の炭素原子が3個の炭素原子と結合し、(b) の結合による正六角形の平面層が、(c) を隔てて積み重なっている構造。\n（(a)、(b) は炭素原子間の結合、(c) は層と層の間を示す。）\n\n(1) (A)、(B) の同素体の名称をそれぞれ記せ。\n(2) そもそも「同素体」とは何か。簡潔に説明せよ。また、炭素以外で同素体が存在する元素を1つ挙げ、その同素体の例を2つ記せ。\n(3) (a)、(b) の炭素原子間の結合の種類と、(c) にはたらく力の名称をそれぞれ記せ。\n(4) (A)、(B) のような結晶を何というか。\n(5) 結晶がきわめて硬いのは (A)、(B) のどちらか。また、その理由を構造に着目して説明せよ。\n(6) 結晶が電気をよく通すのは (A)、(B) のどちらか。また、その理由を「価電子」という語を用いて説明せよ。\n(7) (B) が薄くはがれやすく、やわらかい理由を説明せよ。",
    "subQuestions": [
      {
        "id": "q_c3_2_n3_1a",
        "label": "(1) (A) の名称",
        "type": "short_answer",
        "correctAnswer": "ダイヤモンド",
        "correctAnswerRate": 90
      },
      {
        "id": "q_c3_2_n3_1b",
        "label": "(1) (B) の名称",
        "type": "short_answer",
        "correctAnswer": "黒鉛",
        "acceptedAnswers": [
          "グラファイト",
          "黒鉛（グラファイト）"
        ],
        "correctAnswerRate": 85
      },
      {
        "id": "q_c3_2_n3_2a",
        "label": "(2) 「同素体」とは何か",
        "type": "descriptive",
        "correctAnswer": "同じ元素からなる単体で、性質の異なる物質どうし。",
        "correctAnswerRate": 60
      },
      {
        "id": "q_c3_2_n3_2b",
        "label": "(2) 炭素以外の元素とその同素体2つ",
        "type": "descriptive",
        "correctAnswer": "硫黄 S：斜方硫黄・単斜硫黄（酸素 O：酸素 O₂・オゾン O₃／リン P：黄リン・赤リン でも可）",
        "correctAnswerRate": 65
      },
      {
        "id": "q_c3_2_n3_3a",
        "label": "(3) (a) の結合の種類",
        "type": "short_answer",
        "correctAnswer": "共有結合",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c3_2_n3_3b",
        "label": "(3) (b) の結合の種類",
        "type": "short_answer",
        "correctAnswer": "共有結合",
        "correctAnswerRate": 80
      },
      {
        "id": "q_c3_2_n3_3c",
        "label": "(3) (c) にはたらく力の名称",
        "type": "short_answer",
        "correctAnswer": "分子間力",
        "acceptedAnswers": [
          "ファンデルワールス力",
          "分子間力（ファンデルワールス力）"
        ],
        "correctAnswerRate": 55
      },
      {
        "id": "q_c3_2_n3_4",
        "label": "(4) (A)、(B) のような結晶の名称",
        "type": "short_answer",
        "correctAnswer": "共有結合の結晶",
        "acceptedAnswers": [
          "共有結合結晶"
        ],
        "correctAnswerRate": 75
      },
      {
        "id": "q_c3_2_n3_5",
        "label": "(5) きわめて硬いのはどちらか",
        "type": "multiple_choice",
        "options": [
          "(A) ダイヤモンド",
          "(B) 黒鉛"
        ],
        "correctAnswer": "(A) ダイヤモンド",
        "correctAnswerRate": 90
      },
      {
        "id": "q_c3_2_n3_5r",
        "label": "(5) その理由（構造に着目して）",
        "type": "descriptive",
        "correctAnswer": "すべての炭素原子が4個の価電子を使い、隣り合う4個の原子と強い共有結合で正四面体状に結ばれ、立体網目構造をつくっているから。",
        "correctAnswerRate": 50
      },
      {
        "id": "q_c3_2_n3_6",
        "label": "(6) 電気をよく通すのはどちらか",
        "type": "multiple_choice",
        "options": [
          "(A) ダイヤモンド",
          "(B) 黒鉛"
        ],
        "correctAnswer": "(B) 黒鉛",
        "correctAnswerRate": 80
      },
      {
        "id": "q_c3_2_n3_6r",
        "label": "(6) その理由（「価電子」を用いて）",
        "type": "descriptive",
        "correctAnswer": "炭素原子の4個の価電子のうち3個だけが共有結合に使われ、残り1個が層に沿って自由に動くことができるから。",
        "correctAnswerRate": 45
      },
      {
        "id": "q_c3_2_n3_7",
        "label": "(7) (B) が薄くはがれやすくやわらかい理由",
        "type": "descriptive",
        "correctAnswer": "層内は強い共有結合だが、層と層の間は弱い分子間力で積み重なっているだけなので、層に沿ってはがれやすいから。",
        "correctAnswerRate": 50
      }
    ],
    "explanation": "▼ 解答・解説\n\n(1) <span style=\"background-image:linear-gradient(to top, rgba(233,104,142,0.85) 0%, rgba(244,169,196,0.75) 55%, rgba(244,169,196,0) 100%); background-repeat:no-repeat; background-size:100% 40%; background-position:0 100%; font-weight:bold; padding:0 3px 1px; border-radius:2px;\">【解答】(A) ダイヤモンド　／　(B) 黒鉛（グラファイト）</span>\n(2) <span style=\"background-image:linear-gradient(to top, rgba(233,104,142,0.85) 0%, rgba(244,169,196,0.75) 55%, rgba(244,169,196,0) 100%); background-repeat:no-repeat; background-size:100% 40%; background-position:0 100%; font-weight:bold; padding:0 3px 1px; border-radius:2px;\">【解答】同素体：同じ元素からなる単体で、性質の異なる物質どうし。／ 例：硫黄 S ─ 斜方硫黄・単斜硫黄（ゴム状硫黄でも可）、酸素 O ─ 酸素 O₂・オゾン O₃、リン P ─ 黄リン・赤リン のいずれか</span>\n(3) <span style=\"background-image:linear-gradient(to top, rgba(233,104,142,0.85) 0%, rgba(244,169,196,0.75) 55%, rgba(244,169,196,0) 100%); background-repeat:no-repeat; background-size:100% 40%; background-position:0 100%; font-weight:bold; padding:0 3px 1px; border-radius:2px;\">【解答】(a) 共有結合　(b) 共有結合　(c) 分子間力（ファンデルワールス力）</span>\n(4) <span style=\"background-image:linear-gradient(to top, rgba(233,104,142,0.85) 0%, rgba(244,169,196,0.75) 55%, rgba(244,169,196,0) 100%); background-repeat:no-repeat; background-size:100% 40%; background-position:0 100%; font-weight:bold; padding:0 3px 1px; border-radius:2px;\">【解答】共有結合の結晶</span>\n(5) <span style=\"background-image:linear-gradient(to top, rgba(233,104,142,0.85) 0%, rgba(244,169,196,0.75) 55%, rgba(244,169,196,0) 100%); background-repeat:no-repeat; background-size:100% 40%; background-position:0 100%; font-weight:bold; padding:0 3px 1px; border-radius:2px;\">【解答】(A)。すべての炭素原子が4個の価電子を使い、隣り合う4個の原子と強い共有結合で正四面体状に結ばれ、立体網目構造をつくっているから。</span>\n(6) <span style=\"background-image:linear-gradient(to top, rgba(233,104,142,0.85) 0%, rgba(244,169,196,0.75) 55%, rgba(244,169,196,0) 100%); background-repeat:no-repeat; background-size:100% 40%; background-position:0 100%; font-weight:bold; padding:0 3px 1px; border-radius:2px;\">【解答】(B)。炭素原子の4個の価電子のうち3個だけが共有結合に使われ、残りの1個が層に沿って自由に動くことができるから。</span>\n(7) <span style=\"background-image:linear-gradient(to top, rgba(233,104,142,0.85) 0%, rgba(244,169,196,0.75) 55%, rgba(244,169,196,0) 100%); background-repeat:no-repeat; background-size:100% 40%; background-position:0 100%; font-weight:bold; padding:0 3px 1px; border-radius:2px;\">【解答】層内は強い共有結合だが、層と層の間は弱い分子間力で積み重なっているだけなので、層に沿ってはがれやすいから。</span>\n\n■ 思考手順（この大問はすべて「価電子4個をどう使うか」から機械的に導ける）\n① <span style=\"font-weight:bold; -webkit-text-decoration:underline wavy currentColor; text-decoration:underline wavy currentColor; text-decoration-thickness:1.5px; text-underline-offset:5px; text-decoration-skip-ink:none;\">炭素の価電子は4個。それを何個ずつ結合に使っているかを図から読み取る</span>\n　・(A) は1個の C が 4個の C と結合 → 価電子4個を すべて 共有結合に使用。\n　・(B) は1個の C が 3個の C と結合 → 価電子は3個しか使わず、1個 余る。\n② <span style=\"font-weight:bold; -webkit-text-decoration:underline wavy currentColor; text-decoration:underline wavy currentColor; text-decoration-thickness:1.5px; text-underline-offset:5px; text-decoration-skip-ink:none;\">「使い切った → 動く電子がない」「余った → 動ける電子がある」と電気伝導性に直結させる</span>\n　・(A) 自由に動ける電子がない → 電気を通さない。\n　・(B) 余った1個の価電子が層に沿って動く → 例外的に電気を通す。→ (6) の答え。\n③ <span style=\"font-weight:bold; -webkit-text-decoration:underline wavy currentColor; text-decoration:underline wavy currentColor; text-decoration-thickness:1.5px; text-underline-offset:5px; text-decoration-skip-ink:none;\">結合の「強さ」と「向き」から硬さ・はがれやすさを導く</span>\n　・(A) 立体的な網目がすべて強い共有結合 → どの方向にもずれない → きわめて硬い。→ (5) の答え。\n　・(B) 層の中は強い共有結合だが、層どうしは弱い分子間力 → 層に沿ってすべる → やわらかく、はがれやすい（鉛筆の芯）。→ (7) の答え。\n\n■ 対比表（ダイヤモンドと黒鉛は「毎年どこかで出る」定番の比較）\n項目 ｜ (A) ダイヤモンド ｜ (B) 黒鉛\n結合に使う価電子 ｜ 4個すべて ｜ 3個（1個は層内を自由に動く）\n構造 ｜ 正四面体の立体網目 ｜ 正六角形の平面層＋弱い層間力\n硬さ ｜ きわめて硬い ｜ やわらかい・はがれやすい\n電気伝導性 ｜ なし ｜ あり（共有結合の結晶の例外）\n用途 ｜ 研磨剤・宝石 ｜ 鉛筆の芯・電極\n\n◎ポイント1：同素体をつくる代表元素は <span style=\"font-weight:bold; -webkit-text-decoration:underline wavy currentColor; text-decoration:underline wavy currentColor; text-decoration-thickness:1.5px; text-underline-offset:5px; text-decoration-skip-ink:none;\">S・C・O・P（スコップ）</span> の4つ。\n◎ポイント2：<span style=\"font-weight:bold; -webkit-text-decoration:underline wavy currentColor; text-decoration:underline wavy currentColor; text-decoration-thickness:1.5px; text-underline-offset:5px; text-decoration-skip-ink:none;\">同素体</span>（構造が違う 単体 どうし）と <span style=\"font-weight:bold; -webkit-text-decoration:underline wavy currentColor; text-decoration:underline wavy currentColor; text-decoration-thickness:1.5px; text-underline-offset:5px; text-decoration-skip-ink:none;\">同位体</span>（中性子数が違う 原子 どうし）の混同は最頻出のミス。\n◎ポイント3：フラーレン C₆₀ やカーボンナノチューブも炭素の同素体だが、フラーレンの結晶は 分子結晶。「炭素の同素体＝すべて共有結合の結晶」ではないことに注意（ロジックツリーの STEP 3「結晶の比較・見分け方」で再確認）。\n<div style=\"background-color:#FFF4E5; border:2px solid #FB8C00; border-left:9px solid #FB8C00; border-radius:10px; padding:10px 12px; margin-top:12px; color:#3E2723;\">💡 【ココが狙われる！共通テスト・センター試験のリアル】\n\n■ 出典：2018年 センター試験 第1問 問1b（共有結合の結晶の組合せ）／2024年 共通テスト 問5（ケイ素と二酸化ケイ素の結晶構造の正誤）／黒鉛の電気伝導性は複数年で選択肢に登場\n\n■ 過去問では、こういう要素が問われた！\n　・「共有結合の結晶」に該当する物質の 組合せ を選ばせる（ダイヤモンド・黒鉛・ケイ素 Si・二酸化ケイ素 SiO₂・炭化ケイ素 SiC の5つが候補の定番）。\n　・Si や SiO₂ について「1個の Si に何個の O が結合しているか」「立体網目構造か」という 構造の細部 を正誤で問う。\n　・同素体の定義そのものを、同位体・化合物と区別させる形で問う。\n\n■ このパターンのひっかけが多い！\n　⚠️ 「共有結合の結晶は電気を通さない」と言い切る選択肢 → 黒鉛という例外があるので × になる年と、「一般に通さない」と書かれて ○ になる年の 両方 がある。言い切りの強さを必ず読むこと。\n　⚠️ ダイヤモンドと黒鉛を「同位体」と書く選択肢は毎回のように出る鉄板の誤り。\n　⚠️ ドライアイス（分子結晶）を共有結合の結晶に混ぜてくる。CO₂ は 分子の内部 が共有結合なだけで、結晶をつくっている力は分子間力。\n\n■ 実践アドバイス\n　共有結合の結晶は 「C（ダイヤモンド・黒鉛）・Si・SiO₂・SiC」の4種類だけ を丸暗記し、それ以外の非金属物質が出たら「分子結晶では？」と疑うのが最速の解法。そのうえで、黒鉛については「価電子3個使用＋1個が動く」という理由まで書けるようにしておくと、記述でも共通テストの正誤でも失点しなくなる。</div>",
    "surroundingKnowledge": [],
    "deepDiveTopics": []
  },
  {
    "id": "q_c3_2_n4",
    "category": "結晶の種類と性質 (発展4 化学式の種類と物質中の化学結合)",
    "text": "【発展4】 化学式の種類と物質中の化学結合　［知識・技能／思考・判断・表現］\n\n問1 次の (ア)〜(カ) の化学式について答えよ。\n　(ア) H₂O　(イ) NaCl　(ウ) Cu　(エ) C（ダイヤモンド）　(オ) N₂　(カ) SiO₂\n　① 「分子式」で表されているものをすべて選べ。\n　② 残りの化学式が分子式ではなく「組成式」である理由を簡潔に述べよ。\n\n問2 次の物質の結晶中に存在する化学結合を、イオン結合・共有結合・配位結合・金属結合 の中からすべて選べ。\n　(a) ドライアイス CO₂\n　(b) 鉄 Fe\n　(c) 塩化アンモニウム NH₄Cl\n　(d) 二酸化ケイ素 SiO₂",
    "subQuestions": [
      {
        "id": "q_c3_2_n4_1",
        "label": "問1① 分子式で表されているもの",
        "type": "multiple_choice",
        "options": [
          "(ア) と (オ)",
          "(ア)・(イ)・(オ)",
          "(ウ)・(エ)・(カ)",
          "(ア)・(オ)・(カ)",
          "(ア) のみ"
        ],
        "correctAnswer": "(ア) と (オ)",
        "correctAnswerRate": 70
      },
      {
        "id": "q_c3_2_n4_1r",
        "label": "問1② 残りが組成式である理由",
        "type": "descriptive",
        "correctAnswer": "NaCl はイオン結晶、Cu は金属結晶、C と SiO₂ は共有結合の結晶であり、いずれも粒子が連続的に結合していて分子が存在しないから。",
        "correctAnswerRate": 50
      },
      {
        "id": "q_c3_2_n4_2a",
        "label": "問2(a) ドライアイス CO₂ の結晶中の化学結合",
        "type": "multiple_choice",
        "options": [
          "共有結合のみ",
          "イオン結合のみ",
          "金属結合のみ",
          "共有結合・分子間力",
          "イオン結合・共有結合・配位結合"
        ],
        "correctAnswer": "共有結合のみ",
        "correctAnswerRate": 55
      },
      {
        "id": "q_c3_2_n4_2b",
        "label": "問2(b) 鉄 Fe の結晶中の化学結合",
        "type": "multiple_choice",
        "options": [
          "共有結合のみ",
          "イオン結合のみ",
          "金属結合のみ",
          "イオン結合・金属結合"
        ],
        "correctAnswer": "金属結合のみ",
        "correctAnswerRate": 90
      },
      {
        "id": "q_c3_2_n4_2c",
        "label": "問2(c) 塩化アンモニウム NH₄Cl の結晶中の化学結合",
        "type": "multiple_choice",
        "options": [
          "イオン結合・共有結合・配位結合",
          "イオン結合のみ",
          "共有結合・配位結合",
          "イオン結合・共有結合"
        ],
        "correctAnswer": "イオン結合・共有結合・配位結合",
        "correctAnswerRate": 45
      },
      {
        "id": "q_c3_2_n4_2d",
        "label": "問2(d) 二酸化ケイ素 SiO₂ の結晶中の化学結合",
        "type": "multiple_choice",
        "options": [
          "共有結合のみ",
          "イオン結合のみ",
          "共有結合・イオン結合",
          "共有結合・分子間力"
        ],
        "correctAnswer": "共有結合のみ",
        "correctAnswerRate": 70
      }
    ],
    "explanation": "▼ 解答・解説\n\n【問1】\n① <span style=\"background-image:linear-gradient(to top, rgba(233,104,142,0.85) 0%, rgba(244,169,196,0.75) 55%, rgba(244,169,196,0) 100%); background-repeat:no-repeat; background-size:100% 40%; background-position:0 100%; font-weight:bold; padding:0 3px 1px; border-radius:2px;\">【解答】(ア) H₂O ・ (オ) N₂</span>\n② <span style=\"background-image:linear-gradient(to top, rgba(233,104,142,0.85) 0%, rgba(244,169,196,0.75) 55%, rgba(244,169,196,0) 100%); background-repeat:no-repeat; background-size:100% 40%; background-position:0 100%; font-weight:bold; padding:0 3px 1px; border-radius:2px;\">【解答例】NaCl はイオン結晶、Cu は金属結晶、C（ダイヤモンド）と SiO₂ は共有結合の結晶であり、いずれも粒子が連続的に結合していて「分子」が存在しないから。（そのため構成粒子の数の比で表す）</span>\n\n■ 思考手順（化学式は「分子があるか／ないか」の一点で決まる）\n① <span style=\"font-weight:bold; -webkit-text-decoration:underline wavy currentColor; text-decoration:underline wavy currentColor; text-decoration-thickness:1.5px; text-underline-offset:5px; text-decoration-skip-ink:none;\">その物質に「独立した1個の分子」が存在するか？を問う</span>\n　・H₂O、N₂ は、水分子・窒素分子という 独立した粒子 が実在する → 分子式。\n② <span style=\"font-weight:bold; -webkit-text-decoration:underline wavy currentColor; text-decoration:underline wavy currentColor; text-decoration-thickness:1.5px; text-underline-offset:5px; text-decoration-skip-ink:none;\">存在しないなら、粒子が無限につながった巨大な集合体だと考える</span>\n　・NaCl … Na⁺ と Cl⁻ が交互に無限に並ぶ（イオン結晶）。\n　・Cu … 金属原子と自由電子が無限に並ぶ（金属結晶）。\n　・C（ダイヤモンド）、SiO₂ … 原子が共有結合で無限につながる（共有結合の結晶）。\n③ <span style=\"font-weight:bold; -webkit-text-decoration:underline wavy currentColor; text-decoration:underline wavy currentColor; text-decoration-thickness:1.5px; text-underline-offset:5px; text-decoration-skip-ink:none;\">分子がないので「数の最も簡単な整数比」＝組成式で表す</span>\n　・SiO₂ は「Si 1個と O 2個の分子」ではなく、Si : O ＝ 1 : 2 という 比 を示しているだけ。\n\n◎覚え方：<span style=\"font-weight:bold; -webkit-text-decoration:underline wavy currentColor; text-decoration:underline wavy currentColor; text-decoration-thickness:1.5px; text-underline-offset:5px; text-decoration-skip-ink:none;\">分子結晶だけが分子式、残りの3結晶（イオン・共有結合・金属）はすべて組成式</span>（ロジックツリー STEP 1 の内容と完全に一致）。\n\n【問2】\n物質 ｜ 結晶中の化学結合\n(a) ドライアイス CO₂ ｜ <span style=\"background-image:linear-gradient(to top, rgba(233,104,142,0.85) 0%, rgba(244,169,196,0.75) 55%, rgba(244,169,196,0) 100%); background-repeat:no-repeat; background-size:100% 40%; background-position:0 100%; font-weight:bold; padding:0 3px 1px; border-radius:2px;\">【解答】共有結合</span>\n(b) 鉄 Fe ｜ <span style=\"background-image:linear-gradient(to top, rgba(233,104,142,0.85) 0%, rgba(244,169,196,0.75) 55%, rgba(244,169,196,0) 100%); background-repeat:no-repeat; background-size:100% 40%; background-position:0 100%; font-weight:bold; padding:0 3px 1px; border-radius:2px;\">【解答】金属結合</span>\n(c) 塩化アンモニウム NH₄Cl ｜ <span style=\"background-image:linear-gradient(to top, rgba(233,104,142,0.85) 0%, rgba(244,169,196,0.75) 55%, rgba(244,169,196,0) 100%); background-repeat:no-repeat; background-size:100% 40%; background-position:0 100%; font-weight:bold; padding:0 3px 1px; border-radius:2px;\">【解答】イオン結合・共有結合・配位結合</span>\n(d) 二酸化ケイ素 SiO₂ ｜ <span style=\"background-image:linear-gradient(to top, rgba(233,104,142,0.85) 0%, rgba(244,169,196,0.75) 55%, rgba(244,169,196,0) 100%); background-repeat:no-repeat; background-size:100% 40%; background-position:0 100%; font-weight:bold; padding:0 3px 1px; border-radius:2px;\">【解答】共有結合</span>\n\n■ 解説（差がつくのは (a) と (c)）\n・(a) CO₂：分子の中の C と O は共有結合。分子どうしを結びつけている <span style=\"font-weight:bold; -webkit-text-decoration:underline wavy currentColor; text-decoration:underline wavy currentColor; text-decoration-thickness:1.5px; text-underline-offset:5px; text-decoration-skip-ink:none;\">分子間力は「化学結合」には数えない</span> のがルール。ここを「分子間力も答えに入れる」としてしまう答案が非常に多い。\n・(c) NH₄Cl が本問の核心。NH₄⁺ の中の N－H 結合は、3本が通常の共有結合、残る1本は N の非共有電子対を H⁺ に提供してできた <span style=\"font-weight:bold; -webkit-text-decoration:underline wavy currentColor; text-decoration:underline wavy currentColor; text-decoration-thickness:1.5px; text-underline-offset:5px; text-decoration-skip-ink:none;\">配位結合</span>。さらに NH₄⁺ と Cl⁻ の間は <span style=\"font-weight:bold; -webkit-text-decoration:underline wavy currentColor; text-decoration:underline wavy currentColor; text-decoration-thickness:1.5px; text-underline-offset:5px; text-decoration-skip-ink:none;\">イオン結合</span>。つまり1つの結晶に3種類の結合が共存する。\n　なお配位結合は、いったんできてしまえば他の3本の共有結合と まったく区別できない（結合の長さも強さも同じ）。\n・(d) SiO₂：Si と O が交互に共有結合した立体網目構造（水晶・石英）。金属元素を含まないのでイオン結合ではない。\n\n◎ポイント：<span style=\"font-weight:bold; -webkit-text-decoration:underline wavy currentColor; text-decoration:underline wavy currentColor; text-decoration-thickness:1.5px; text-underline-offset:5px; text-decoration-skip-ink:none;\">配位結合＝共有電子対を一方の原子だけが提供する共有結合</span>。2大例は <span style=\"font-weight:bold; -webkit-text-decoration:underline wavy currentColor; text-decoration:underline wavy currentColor; text-decoration-thickness:1.5px; text-underline-offset:5px; text-decoration-skip-ink:none;\">NH₄⁺（アンモニウムイオン）</span> と <span style=\"font-weight:bold; -webkit-text-decoration:underline wavy currentColor; text-decoration:underline wavy currentColor; text-decoration-thickness:1.5px; text-underline-offset:5px; text-decoration-skip-ink:none;\">H₃O⁺（オキソニウムイオン）</span>。\n<div style=\"background-color:#FFF4E5; border:2px solid #FB8C00; border-left:9px solid #FB8C00; border-radius:10px; padding:10px 12px; margin-top:12px; color:#3E2723;\">💡 【ココが狙われる！共通テスト・センター試験のリアル】\n\n■ 出典：2022年 共通テスト 第1問 問1（H₃O⁺ における共有結合と配位結合）／2025年 共通テスト 問4（物質と化学結合の対応）／2016年 センター試験 問4（化学結合の正誤）／2017年 センター試験 問3（単結合のみからなる分子）\n\n■ 過去問では、こういう要素が問われた！\n　・物質名と「その結晶を成り立たせている結合」を1対1で対応させる、まさに本問と同型の出題。\n　・H₃O⁺ や NH₄⁺ を題材に「この中に配位結合は何本あるか」「配位結合と共有結合は区別できるか」を問う。\n　・化学式が組成式か分子式かを、結晶の種類とセットで判断させる。\n\n■ このパターンのひっかけが多い！\n　⚠️ 「NH₄⁺ の4本の N－H のうち、配位結合の1本だけ結合の長さが違う」→ ×。できたあとは 完全に等価 で区別できない。ほぼ毎回このニュアンスで狙われる。\n　⚠️ ドライアイスの結晶に「イオン結合がある」「共有結合はない」とする選択肢。分子の 内部 は共有結合、分子 どうし は分子間力、と2段階で答える癖をつける。\n　⚠️ 「氷は水素結合でできているから化学結合は水素結合だけ」→ ×。H₂O 分子内の O－H は共有結合。\n\n■ 実践アドバイス\n　選択肢の物質を見たら、必ず 「主たる結合＋粒子間の力」の2段で書き出す こと（例：CO₂ ＝ C＝O 共有結合 ＋ 分子間力／NH₄Cl ＝ 共有結合＋配位結合 ＋ イオン結合）。この2段書きができていれば、化学結合の正誤問題（出題確率70%）はほぼ落とさない。</div>",
    "surroundingKnowledge": [],
    "deepDiveTopics": []
  },
  {
    "id": "q_c3_2_1",
    "category": "結晶の種類と性質 (問1)",
    "text": "【問1】 次の文章の空欄（ア）〜（タ）に適する語句を答えよ。（語句網羅）\n\n結晶は構成粒子と結合の種類により次の4つに分類される。\n\n(1) 陽イオンと陰イオンが規則正しく並んだものを（ア）結晶という。融点は（イ）。硬いが（ウ）。固体状態では電気を（エ）が、（オ）液や（カ）には電気を通す。例：NaCl、CaCO₃。\n(2) 分子が分子間力で結びついて並んだ結晶を（キ）結晶という。融点は（ク）。（ケ）性をもつものが多い（ヨウ素、ドライアイス、ナフタレン）。電気は（コ）。例：I₂、CO₂、ナフタレン、氷。\n(3) すべての原子が共有結合で結びついた結晶を（サ）結晶という。融点は（シ）、（ス）。電気は通さない（ただし（セ）は例外で電気伝導性をもつ）。例：ダイヤモンド、Si、SiO₂、（セ）。\n(4) 金属原子が自由電子を共有してできた結晶を（ソ）結晶という。電気伝導性・熱伝導性をもち、（タ）・延性を示す。例：Cu, Fe, Al, Au, Ag。",
    "subQuestions": [
      {
        "id": "q_c3_2_1_a",
        "label": "問1(ア) 陽・陰イオンの規則的な結晶",
        "type": "short_answer",
        "correctAnswer": "イオン",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c3_2_1_i",
        "label": "問1(イ) イオン結晶の融点（高い／低い）",
        "type": "multiple_choice",
        "options": [
          "高い",
          "低い"
        ],
        "correctAnswer": "高い",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c3_2_1_u",
        "label": "問1(ウ) 強い力を与えた時の性質（硬いが○○）",
        "type": "short_answer",
        "correctAnswer": "脆い",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c3_2_1_e",
        "label": "問1(エ) イオン結晶の固体状態での導電性",
        "type": "short_answer",
        "correctAnswer": "通さない",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c3_2_1_o",
        "label": "問1(オ) 電導性を得られる状態（○○液）",
        "type": "short_answer",
        "correctAnswer": "融解",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c3_2_1_ka",
        "label": "問1(カ) 電導性を得られる状態（あるいは○○）",
        "type": "short_answer",
        "correctAnswer": "水溶液",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c3_2_1_ki",
        "label": "問1(キ) 分子が並んだ結晶の名称",
        "type": "short_answer",
        "correctAnswer": "分子",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c3_2_1_ku",
        "label": "問1(ク) 分子結晶の融点（高い／低い）",
        "type": "multiple_choice",
        "options": [
          "高い",
          "低い"
        ],
        "correctAnswer": "低い",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c3_2_1_ke",
        "label": "問1(ケ) ドライアイス等が見せる、固体から気体になる性質",
        "type": "short_answer",
        "correctAnswer": "昇華",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c3_2_1_ko",
        "label": "問1(コ) 分子結晶の電気伝導性",
        "type": "short_answer",
        "correctAnswer": "通さない",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c3_2_1_sa",
        "label": "問1(サ) すべての原子が共有結合で結びついた結晶",
        "type": "short_answer",
        "correctAnswer": "共有結合",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c3_2_1_shi",
        "label": "問1(シ) 共有結合結晶の融点の性質（○○高い）",
        "type": "short_answer",
        "correctAnswer": "極めて高い",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c3_2_1_su",
        "label": "問1(ス) 共有結合結晶の硬さの性質（○○硬い）",
        "type": "short_answer",
        "correctAnswer": "極めて硬い",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c3_2_1_se",
        "label": "問1(セ) 例外的に電気伝導性をもつ共有結合結晶",
        "type": "short_answer",
        "correctAnswer": "黒鉛",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c3_2_1_so",
        "label": "問1(ソ) 金属原子の結合からなる結晶",
        "type": "short_answer",
        "correctAnswer": "金属",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c3_2_1_ta",
        "label": "問1(タ) 叩いて薄く広がる、金属特有の性質",
        "type": "short_answer",
        "correctAnswer": "展性",
        "correctAnswerRate": 85
      }
    ],
    "explanation": "▼ 解答・解説\n（ア）イオン （イ）高い （ウ）脆い（割れやすい） （エ）通さない （オ）融解 （カ）水溶液 \n（キ）分子 （ク）低い （ケ）昇華 （コ）通さない \n（サ）共有結合 （シ）極めて高い （ス）極めて硬い （セ）黒鉛（グラファイト） \n（ソ）金属 （タ）展性\n\n■ 4つの主要な結晶（イオン、分子、共有結合、金属）の特徴を対比して覚えることが基礎でありもっとも重要なポイントです。",
    "surroundingKnowledge": [],
    "deepDiveTopics": []
  },
  // ── 教科書順⑤：4種類の結晶の分類（まとめ）──
  //   既存の語句網羅問題（q_c3_2_1）で用語を確認した直後に、
  //   「でき方・性質・例」を対応づける総整理問題を置く。
  ...pickCrystalProblems('p_c3_2_classify'),
  {
    "id": "q_c3_2_2",
    "category": "結晶の種類と性質 (問2)",
    "text": "【問2】 （基礎）次の物質を、ア：イオン結晶 イ：分子結晶 ウ：共有結合結晶 エ：金属結晶 に分類せよ。\n\n(1) NaCl (2) ダイヤモンド (3) 鉄 (4) ドライアイス (5) ヨウ素\n(6) 二酸化ケイ素 SiO₂ (7) アルミニウム (8) 塩化カルシウム\n(9) 黒鉛 (10) ナフタレン (11) 銅 (12) 氷",
    "subQuestions": [
      {
        "id": "q_c3_2_2_1",
        "label": "(1) NaCl",
        "type": "multiple_choice",
        "options": [
          "ア",
          "イ",
          "ウ",
          "エ"
        ],
        "correctAnswer": "ア",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c3_2_2_2",
        "label": "(2) ダイヤモンド",
        "type": "multiple_choice",
        "options": [
          "ア",
          "イ",
          "ウ",
          "エ"
        ],
        "correctAnswer": "ウ",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c3_2_2_3",
        "label": "(3) 鉄",
        "type": "multiple_choice",
        "options": [
          "ア",
          "イ",
          "ウ",
          "エ"
        ],
        "correctAnswer": "エ",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c3_2_2_4",
        "label": "(4) ドライアイス",
        "type": "multiple_choice",
        "options": [
          "ア",
          "イ",
          "ウ",
          "エ"
        ],
        "correctAnswer": "イ",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c3_2_2_5",
        "label": "(5) ヨウ素",
        "type": "multiple_choice",
        "options": [
          "ア",
          "イ",
          "ウ",
          "エ"
        ],
        "correctAnswer": "イ",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c3_2_2_6",
        "label": "(6) 二酸化ケイ素 SiO₂",
        "type": "multiple_choice",
        "options": [
          "ア",
          "イ",
          "ウ",
          "エ"
        ],
        "correctAnswer": "ウ",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c3_2_2_7",
        "label": "(7) アルミニウム",
        "type": "multiple_choice",
        "options": [
          "ア",
          "イ",
          "ウ",
          "エ"
        ],
        "correctAnswer": "エ",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c3_2_2_8",
        "label": "(8) 塩化カルシウム",
        "type": "multiple_choice",
        "options": [
          "ア",
          "イ",
          "ウ",
          "エ"
        ],
        "correctAnswer": "ア",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c3_2_2_9",
        "label": "(9) 黒鉛",
        "type": "multiple_choice",
        "options": [
          "ア",
          "イ",
          "ウ",
          "エ"
        ],
        "correctAnswer": "ウ",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c3_2_2_10",
        "label": "(10) ナフタレン",
        "type": "multiple_choice",
        "options": [
          "ア",
          "イ",
          "ウ",
          "エ"
        ],
        "correctAnswer": "イ",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c3_2_2_11",
        "label": "(11) 銅",
        "type": "multiple_choice",
        "options": [
          "ア",
          "イ",
          "ウ",
          "エ"
        ],
        "correctAnswer": "エ",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c3_2_2_12",
        "label": "(12) 氷",
        "type": "multiple_choice",
        "options": [
          "ア",
          "イ",
          "ウ",
          "エ"
        ],
        "correctAnswer": "イ",
        "correctAnswerRate": 85
      }
    ],
    "explanation": "▼ 解答・解説\n(1) ア (2) ウ (3) エ (4) イ (5) イ (6) ウ \n(7) エ (8) ア (9) ウ（共有結合結晶。黒鉛は例外的に電導性あり） \n(10) イ (11) エ (12) イ",
    "surroundingKnowledge": [],
    "deepDiveTopics": []
  },
  {
    "id": "q_c3_2_3",
    "category": "結晶の種類と性質 (問3)",
    "text": "【問3】 （基礎）次の性質をもつ結晶はどれか。ア〜エから選べ。\nア：イオン結晶、イ：分子結晶、ウ：共有結合結晶、エ：金属結晶",
    "subQuestions": [
      {
        "id": "q_c3_2_3_1",
        "label": "(1) 融点が極めて高く、極めて硬く、電気を通さない",
        "type": "multiple_choice",
        "options": [
          "ア",
          "イ",
          "ウ",
          "エ"
        ],
        "correctAnswer": "ウ",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c3_2_3_2",
        "label": "(2) 融点が低く、軽くたたくと割れる。電気を通さない",
        "type": "multiple_choice",
        "options": [
          "ア",
          "イ",
          "ウ",
          "エ"
        ],
        "correctAnswer": "イ",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c3_2_3_3",
        "label": "(3) 展性・延性をもち、電気・熱を通す",
        "type": "multiple_choice",
        "options": [
          "ア",
          "イ",
          "ウ",
          "エ"
        ],
        "correctAnswer": "エ",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c3_2_3_4",
        "label": "(4) 硬いがもろく、固体は電気を通さないが融解液は通す",
        "type": "multiple_choice",
        "options": [
          "ア",
          "イ",
          "ウ",
          "エ"
        ],
        "correctAnswer": "ア",
        "correctAnswerRate": 85
      }
    ],
    "explanation": "▼ 解答・解説\n(1) ウ（共有結合結晶） (2) イ（分子結晶） (3) エ（金属結晶） (4) ア（イオン結晶）",
    "surroundingKnowledge": [],
    "deepDiveTopics": []
  },
  {
    "id": "q_c3_2_n5",
    "category": "結晶の種類と性質 (発展5 4種類の結晶の分類)",
    "text": "【発展5】 4種類の結晶の分類　［思考・判断・表現］\n\n次の (1)〜(4) の4種類の結晶について、結晶のでき方を [A群] から、性質を [B群] から、物質の例を [C群] から、それぞれ1つずつ選び、記号で答えよ。\n\n(1) 金属結晶　(2) 共有結合の結晶　(3) 分子結晶　(4) イオン結晶\n\n[A群]（でき方）\n(ア) 陽イオンと陰イオンが静電気力（クーロン力）で引き合ってできる結合\n(イ) 原子どうしが価電子を出し合い、電子対を共有してできる結合\n(ウ) 分子どうしが弱い分子間力で引き合ってできる集合\n(エ) 自由電子が原子どうしを結びつけてできる結合\n\n[B群]（性質）\n(オ) きわめて硬く、融点が非常に高い。電気を通さないものが多い。\n(カ) 固体では電気を通さないが、融解したり水に溶かしたりすると電気を通す。\n(キ) 固体でも液体でも電気を通し、展性・延性を示す。\n(ク) やわらかく融点が低いものが多く、昇華するものもある。\n\n[C群]（物質の例）\n(ケ) ケイ素　(コ) ナフタレン　(サ) アルミニウム　(シ) 塩化カリウム",
    "subQuestions": [
      {
        "id": "q_c3_2_n5_1a",
        "label": "(1) 金属結晶 ─ でき方［A群］",
        "type": "multiple_choice",
        "options": [
          "ア",
          "イ",
          "ウ",
          "エ"
        ],
        "correctAnswer": "エ",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c3_2_n5_1b",
        "label": "(1) 金属結晶 ─ 性質［B群］",
        "type": "multiple_choice",
        "options": [
          "オ",
          "カ",
          "キ",
          "ク"
        ],
        "correctAnswer": "キ",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c3_2_n5_1c",
        "label": "(1) 金属結晶 ─ 例［C群］",
        "type": "multiple_choice",
        "options": [
          "ケ",
          "コ",
          "サ",
          "シ"
        ],
        "correctAnswer": "サ",
        "correctAnswerRate": 90
      },
      {
        "id": "q_c3_2_n5_2a",
        "label": "(2) 共有結合の結晶 ─ でき方［A群］",
        "type": "multiple_choice",
        "options": [
          "ア",
          "イ",
          "ウ",
          "エ"
        ],
        "correctAnswer": "イ",
        "correctAnswerRate": 80
      },
      {
        "id": "q_c3_2_n5_2b",
        "label": "(2) 共有結合の結晶 ─ 性質［B群］",
        "type": "multiple_choice",
        "options": [
          "オ",
          "カ",
          "キ",
          "ク"
        ],
        "correctAnswer": "オ",
        "correctAnswerRate": 80
      },
      {
        "id": "q_c3_2_n5_2c",
        "label": "(2) 共有結合の結晶 ─ 例［C群］",
        "type": "multiple_choice",
        "options": [
          "ケ",
          "コ",
          "サ",
          "シ"
        ],
        "correctAnswer": "ケ",
        "correctAnswerRate": 70
      },
      {
        "id": "q_c3_2_n5_3a",
        "label": "(3) 分子結晶 ─ でき方［A群］",
        "type": "multiple_choice",
        "options": [
          "ア",
          "イ",
          "ウ",
          "エ"
        ],
        "correctAnswer": "ウ",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c3_2_n5_3b",
        "label": "(3) 分子結晶 ─ 性質［B群］",
        "type": "multiple_choice",
        "options": [
          "オ",
          "カ",
          "キ",
          "ク"
        ],
        "correctAnswer": "ク",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c3_2_n5_3c",
        "label": "(3) 分子結晶 ─ 例［C群］",
        "type": "multiple_choice",
        "options": [
          "ケ",
          "コ",
          "サ",
          "シ"
        ],
        "correctAnswer": "コ",
        "correctAnswerRate": 75
      },
      {
        "id": "q_c3_2_n5_4a",
        "label": "(4) イオン結晶 ─ でき方［A群］",
        "type": "multiple_choice",
        "options": [
          "ア",
          "イ",
          "ウ",
          "エ"
        ],
        "correctAnswer": "ア",
        "correctAnswerRate": 90
      },
      {
        "id": "q_c3_2_n5_4b",
        "label": "(4) イオン結晶 ─ 性質［B群］",
        "type": "multiple_choice",
        "options": [
          "オ",
          "カ",
          "キ",
          "ク"
        ],
        "correctAnswer": "カ",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c3_2_n5_4c",
        "label": "(4) イオン結晶 ─ 例［C群］",
        "type": "multiple_choice",
        "options": [
          "ケ",
          "コ",
          "サ",
          "シ"
        ],
        "correctAnswer": "シ",
        "correctAnswerRate": 80
      }
    ],
    "explanation": "▼ 解答・解説\n\n結晶 ｜ でき方［A群］ ｜ 性質［B群］ ｜ 例［C群］\n(1) 金属結晶 ｜ <span style=\"background-image:linear-gradient(to top, rgba(233,104,142,0.85) 0%, rgba(244,169,196,0.75) 55%, rgba(244,169,196,0) 100%); background-repeat:no-repeat; background-size:100% 40%; background-position:0 100%; font-weight:bold; padding:0 3px 1px; border-radius:2px;\">エ</span> ｜ <span style=\"background-image:linear-gradient(to top, rgba(233,104,142,0.85) 0%, rgba(244,169,196,0.75) 55%, rgba(244,169,196,0) 100%); background-repeat:no-repeat; background-size:100% 40%; background-position:0 100%; font-weight:bold; padding:0 3px 1px; border-radius:2px;\">キ</span> ｜ <span style=\"background-image:linear-gradient(to top, rgba(233,104,142,0.85) 0%, rgba(244,169,196,0.75) 55%, rgba(244,169,196,0) 100%); background-repeat:no-repeat; background-size:100% 40%; background-position:0 100%; font-weight:bold; padding:0 3px 1px; border-radius:2px;\">サ（アルミニウム）</span>\n(2) 共有結合の結晶 ｜ <span style=\"background-image:linear-gradient(to top, rgba(233,104,142,0.85) 0%, rgba(244,169,196,0.75) 55%, rgba(244,169,196,0) 100%); background-repeat:no-repeat; background-size:100% 40%; background-position:0 100%; font-weight:bold; padding:0 3px 1px; border-radius:2px;\">イ</span> ｜ <span style=\"background-image:linear-gradient(to top, rgba(233,104,142,0.85) 0%, rgba(244,169,196,0.75) 55%, rgba(244,169,196,0) 100%); background-repeat:no-repeat; background-size:100% 40%; background-position:0 100%; font-weight:bold; padding:0 3px 1px; border-radius:2px;\">オ</span> ｜ <span style=\"background-image:linear-gradient(to top, rgba(233,104,142,0.85) 0%, rgba(244,169,196,0.75) 55%, rgba(244,169,196,0) 100%); background-repeat:no-repeat; background-size:100% 40%; background-position:0 100%; font-weight:bold; padding:0 3px 1px; border-radius:2px;\">ケ（ケイ素）</span>\n(3) 分子結晶 ｜ <span style=\"background-image:linear-gradient(to top, rgba(233,104,142,0.85) 0%, rgba(244,169,196,0.75) 55%, rgba(244,169,196,0) 100%); background-repeat:no-repeat; background-size:100% 40%; background-position:0 100%; font-weight:bold; padding:0 3px 1px; border-radius:2px;\">ウ</span> ｜ <span style=\"background-image:linear-gradient(to top, rgba(233,104,142,0.85) 0%, rgba(244,169,196,0.75) 55%, rgba(244,169,196,0) 100%); background-repeat:no-repeat; background-size:100% 40%; background-position:0 100%; font-weight:bold; padding:0 3px 1px; border-radius:2px;\">ク</span> ｜ <span style=\"background-image:linear-gradient(to top, rgba(233,104,142,0.85) 0%, rgba(244,169,196,0.75) 55%, rgba(244,169,196,0) 100%); background-repeat:no-repeat; background-size:100% 40%; background-position:0 100%; font-weight:bold; padding:0 3px 1px; border-radius:2px;\">コ（ナフタレン）</span>\n(4) イオン結晶 ｜ <span style=\"background-image:linear-gradient(to top, rgba(233,104,142,0.85) 0%, rgba(244,169,196,0.75) 55%, rgba(244,169,196,0) 100%); background-repeat:no-repeat; background-size:100% 40%; background-position:0 100%; font-weight:bold; padding:0 3px 1px; border-radius:2px;\">ア</span> ｜ <span style=\"background-image:linear-gradient(to top, rgba(233,104,142,0.85) 0%, rgba(244,169,196,0.75) 55%, rgba(244,169,196,0) 100%); background-repeat:no-repeat; background-size:100% 40%; background-position:0 100%; font-weight:bold; padding:0 3px 1px; border-radius:2px;\">カ</span> ｜ <span style=\"background-image:linear-gradient(to top, rgba(233,104,142,0.85) 0%, rgba(244,169,196,0.75) 55%, rgba(244,169,196,0) 100%); background-repeat:no-repeat; background-size:100% 40%; background-position:0 100%; font-weight:bold; padding:0 3px 1px; border-radius:2px;\">シ（塩化カリウム）</span>\n\n■ 思考手順（3つの群は「構成粒子」を軸にすれば一気につながる）\n① <span style=\"font-weight:bold; -webkit-text-decoration:underline wavy currentColor; text-decoration:underline wavy currentColor; text-decoration-thickness:1.5px; text-underline-offset:5px; text-decoration-skip-ink:none;\">まず A群で「何が集まっているか（構成粒子）」を確定する</span>\n　・(ア) 陽イオン＋陰イオン → イオン結晶　／　(イ) 原子＋価電子の共有 → 共有結合の結晶\n　・(ウ) 分子＋弱い分子間力 → 分子結晶　／　(エ) 原子＋自由電子 → 金属結晶\n② <span style=\"font-weight:bold; -webkit-text-decoration:underline wavy currentColor; text-decoration:underline wavy currentColor; text-decoration-thickness:1.5px; text-underline-offset:5px; text-decoration-skip-ink:none;\">B群は「電気を通すか」だけで4つに割り切れる</span>\n　・固体も液体も通す＋展性延性 → (キ) 金属結晶（自由電子が動くから）\n　・固体は通さないが融解液・水溶液は通す → (カ) イオン結晶（イオンが動けるようになるから）\n　・通さない＋きわめて硬い＋超高融点 → (オ) 共有結合の結晶\n　・通さない＋やわらかい＋低融点＋昇華 → (ク) 分子結晶\n③ <span style=\"font-weight:bold; -webkit-text-decoration:underline wavy currentColor; text-decoration:underline wavy currentColor; text-decoration-thickness:1.5px; text-underline-offset:5px; text-decoration-skip-ink:none;\">C群は元素の組合せで機械的に判定する</span>\n　・(サ) アルミニウム … 金属元素のみ → 金属結晶\n　・(ケ) ケイ素 … 非金属で巨大に共有結合 → 共有結合の結晶（ダイヤモンドと同じ構造）\n　・(コ) ナフタレン … 分子（C₁₀H₈、防虫剤）で昇華する → 分子結晶\n　・(シ) 塩化カリウム … 金属＋非金属（K⁺ と Cl⁻） → イオン結晶\n\n■ この表は暗記の最終形（ロジックツリー STEP 3「結晶の比較・見分け方」と同じ内容）\n結晶 ｜ 構成粒子 ｜ 粒子をつなぐ力 ｜ 融点 ｜ 電気伝導性 ｜ 代表例\n金属結晶 ｜ 金属原子（陽イオン） ｜ 金属結合（自由電子） ｜ さまざま ｜ 固体○ 液体○ ｜ Al, Fe, Cu\n共有結合の結晶 ｜ 原子 ｜ 共有結合 ｜ 非常に高い ｜ ×（黒鉛は例外で○） ｜ C, Si, SiO₂, SiC\n分子結晶 ｜ 分子 ｜ 分子間力（弱い） ｜ 低い ｜ × ｜ CO₂, I₂, ナフタレン, 氷\nイオン結晶 ｜ 陽イオン・陰イオン ｜ イオン結合（静電気力） ｜ 高い ｜ 固体× 融解液・水溶液○ ｜ NaCl, KCl\n\n◎ポイント：昇華する物質（<span style=\"font-weight:bold; -webkit-text-decoration:underline wavy currentColor; text-decoration:underline wavy currentColor; text-decoration-thickness:1.5px; text-underline-offset:5px; text-decoration-skip-ink:none;\">ドライアイス・ヨウ素・ナフタレン</span>）はすべて 分子結晶。共有結合の結晶は <span style=\"font-weight:bold; -webkit-text-decoration:underline wavy currentColor; text-decoration:underline wavy currentColor; text-decoration-thickness:1.5px; text-underline-offset:5px; text-decoration-skip-ink:none;\">C・Si・SiO₂・SiC の4つだけ</span> と割り切ってよい。\n<div style=\"background-color:#FFF4E5; border:2px solid #FB8C00; border-left:9px solid #FB8C00; border-radius:10px; padding:10px 12px; margin-top:12px; color:#3E2723;\">💡 【ココが狙われる！共通テスト・センター試験のリアル】\n\n■ 出典：2017年 センター試験 問4a（イオン結晶でないものを選ぶ）／2018年 センター試験 問1b（共有結合の結晶）／2021年 共通テスト 問7（単位格子モデル）／2024年 共通テスト 問5（ケイ素と SiO₂ の結晶構造）\n\n■ 過去問では、こういう要素が問われた！\n　・まさに本問と同じ「結晶の種類 × 性質 × 代表物質」の3点対応。共通テストでは表や実験結果の形に化けて出る。\n　・「電気伝導性」を軸に、固体のとき／融解したとき／水に溶かしたとき の3条件を区別させる。\n　・単位格子の図を見せ、含まれる粒子の数や結晶の種類を判断させる図示型（2021年）。\n\n■ このパターンのひっかけが多い！\n　⚠️ 「イオン結晶は電気を通す」だけの記述 → 条件（融解液・水溶液）が抜けていれば ×。逆に「固体でも通す」は明確な誤り。\n　⚠️ 黒鉛を「電気を通すから金属結晶」とする選択肢。黒鉛はあくまで 共有結合の結晶（例外的に電気を通すだけ）。\n　⚠️ 「分子結晶は分子間力が弱いから、分子内の結合も弱い」→ ×。分子 内部 の共有結合は強い。壊れやすいのは分子 どうし の結びつき。\n　⚠️ ヨウ素 I₂ を「共有結合の結晶」と分類させる誘導。I₂ は分子なので 分子結晶。\n\n■ 実践アドバイス\n　この4×5の比較表は、テスト直前に 白紙から書き出せる ようにしておくのが最強の対策。「結晶名 → 4つの性質」「性質 → 結晶名」の 双方向 で言えるかを必ずチェックすること。共通テストは後者（性質から逆算）で出題されることが多い。</div>",
    "surroundingKnowledge": [],
    "deepDiveTopics": []
  },
  {
    "id": "q_c3_2_4",
    "category": "結晶の種類と性質 (問4)",
    "text": "【問4】 （記述）次の記述問題に答えよ。",
    "subQuestions": [
      {
        "id": "q_c3_2_4_1",
        "label": "(1) イオン結晶が固体では電気を通さないが、融解液や水溶液では電気を通す理由を述べよ。",
        "type": "short_answer",
        "correctAnswer": "溶液中でイオンが自由に動けるため",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c3_2_4_2",
        "label": "(2) 黒鉛が共有結合結晶でありながら電気を通す理由を述べよ。",
        "type": "short_answer",
        "correctAnswer": "余った1個の電子が自由に動くため",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c3_2_4_3",
        "label": "(3) 金属が延性・展性を示す理由を、結合の特徴と関連づけて述べよ。",
        "type": "short_answer",
        "correctAnswer": "結合に方向性がないため",
        "correctAnswerRate": 85
      }
    ],
    "explanation": "▼ 解答・解説\n(1) 固体ではイオンが格子に固定されていて移動できないが、融解液や水溶液中ではイオンが自由に動けるため電気を運べる。\n(2) 黒鉛は炭素原子1個あたり4個 of 価電子のうち3個を共有結合に用い、残り1個が層内を自由に動くため。\n(3) 金属結合は自由電子による『方向性のない結合』なので、原子の位置を多少ずらしても結合が切れず、変形に強い。",
    "surroundingKnowledge": [],
    "deepDiveTopics": []
  },
  {
    "id": "q_c3_2_6",
    "category": "結晶の種類と性質 (問6)",
    "text": "【問6】 （共通テスト風応用）次のうち、結晶の種類と性質の対応として誤っているものを1つ選べ。",
    "subQuestions": [
      {
        "id": "q_c3_2_6_ans",
        "label": "誤っているものに該当する番号を1つ選べ",
        "type": "multiple_choice",
        "options": [
          "① イオン結晶 ─ 水によく溶けて電解質となる",
          "② 分子結晶 ─ 一般に融点が低く、昇華性のあるものがある",
          "③ 共有結合結晶 ─ 一般に電気を通すが、硬さは小さい",
          "④ 金属結晶 ─ 電気・熱をよく伝え、展性・延性を示す"
        ],
        "correctAnswer": "③ 共有結合結晶 ─ 一般に電気を通すが、硬さは小さい",
        "correctAnswerRate": 85
      }
    ],
    "explanation": "▼ 解答・解説\n答：③\n\n■ 共有結合結晶は一般に『電気を通さない』『極めて硬い』。黒鉛は例外。③は誤り。",
    "surroundingKnowledge": [],
    "deepDiveTopics": []
  },
  {
    "id": "q_c3_2_7",
    "category": "結晶の種類と性質 (問7)",
    "text": "【問7】 （共通テスト風応用）ある未知の固体 X に関し、次の実験結果を得た。\n\n・常温で固体、つやがあり、たたくと薄く広がる（展性あり）\n・電気をよく通す\n・水に溶けない\n\nこの固体は何結晶か。また、考えられる物質の例を1つ選べ。",
    "subQuestions": [
      {
        "id": "q_c3_2_7_ans",
        "label": "該当する結晶の種類と、その物質の例のペアを選べ",
        "type": "multiple_choice",
        "options": [
          "イオン結晶 （例：塩化ナトリウム NaCl）",
          "分子結晶 （例：ドライアイス CO₂）",
          "共有結合結晶 （例：ダイヤモンド C）",
          "金属結晶 （例：銅 Cu）"
        ],
        "correctAnswer": "金属結晶 （例：銅 Cu）",
        "correctAnswerRate": 85
      }
    ],
    "explanation": "▼ 解答・解説\n答：金属結晶。例：銅 Cu、鉄 Fe、アルミニウム Al など。\n\n■ 展性・電導性・つやがある（金属光沢）・水に溶けない、は金属結晶の典型的特徴です。",
    "surroundingKnowledge": [],
    "deepDiveTopics": []
  },
  {
    "id": "q_c3_2_n6",
    "category": "結晶の種類と性質 (総合演習 結晶の構造と性質)",
    "text": "【総合演習】 結晶の構造と性質　［思考・判断・表現（総合）］\n\n次の文章を読み、以下の問いに答えよ。\n\n5種類の固体 A〜E について、その性質を調べたところ、次のことがわかった。\n\nA：無色の結晶で融点が高い。固体の状態では電気を通さないが、①融解したり水に溶かしたりすると電気を通すようになる。\nB：きわめて硬い無色の結晶で、融点が非常に高く、固体でも液体でも電気をほとんど通さない。天然には水晶（石英）として存在する。\nC：無色の固体で、常圧では液体にならずに直接気体になる（昇華）。構成する分子は②直線形の無極性分子である。\nD：赤みを帯びた金属光沢をもち、③たたくと薄く広がり、引っ張ると細く延びる。電気や熱をよく導くため電線などに利用される。\nE：黒色でやわらかく、薄くはがれやすい固体である。金属ではないのに電気をよく通し、電極や鉛筆の芯に利用される。\n\n問1 A〜E の結晶の種類（金属結晶・共有結合の結晶・分子結晶・イオン結晶）をそれぞれ答えよ。\n\n問2 A〜E に当てはまる物質を、次の語群からそれぞれ1つずつ選べ。\n　〔語群〕 銅　アルミニウム　ドライアイス　ヨウ素　黒鉛　塩化マグネシウム　二酸化ケイ素\n\n問3 A は Mg²⁺ と Cl⁻ からなる物質である。\n　① A の組成式を記せ。\n　② 下線部①について、固体の A が電気を通さないのに、融解すると電気を通すようになる理由を「イオン」という語を用いて説明せよ。\n\n問4 下線部②について、C の分子は原子間の結合には極性があるにもかかわらず、分子全体としては無極性である。その理由を説明せよ。\n\n問5 下線部③のような金属の性質をそれぞれ何というか。また、D が電気をよく導き、たたいても割れずに変形する理由を「自由電子」という語を用いて説明せよ。\n\n問6 C が昇華しやすい理由を、結晶内の粒子間にはたらく力に着目して説明せよ。\n\n問7 次の (ア)〜(オ) の記述のうち、正しいものを2つ選べ。\n　(ア) 塩化ナトリウムの結晶中には、NaCl という分子が存在する。\n　(イ) 配位結合は、一方の原子の非共有電子対が共有されてできる結合であり、できたあとは他の共有結合と区別できない。\n　(ウ) ダイヤモンドと黒鉛は、互いに同位体である。\n　(エ) 水分子は直線形の分子なので、無極性分子である。\n　(オ) 氷は水分子が分子間力で集まってできた分子結晶であり、融点は低い。",
    "subQuestions": [
      {
        "id": "q_c3_2_n6_1a",
        "label": "問1 A の結晶の種類",
        "type": "multiple_choice",
        "options": [
          "金属結晶",
          "共有結合の結晶",
          "分子結晶",
          "イオン結晶"
        ],
        "correctAnswer": "イオン結晶",
        "correctAnswerRate": 80
      },
      {
        "id": "q_c3_2_n6_1b",
        "label": "問1 B の結晶の種類",
        "type": "multiple_choice",
        "options": [
          "金属結晶",
          "共有結合の結晶",
          "分子結晶",
          "イオン結晶"
        ],
        "correctAnswer": "共有結合の結晶",
        "correctAnswerRate": 80
      },
      {
        "id": "q_c3_2_n6_1c",
        "label": "問1 C の結晶の種類",
        "type": "multiple_choice",
        "options": [
          "金属結晶",
          "共有結合の結晶",
          "分子結晶",
          "イオン結晶"
        ],
        "correctAnswer": "分子結晶",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c3_2_n6_1d",
        "label": "問1 D の結晶の種類",
        "type": "multiple_choice",
        "options": [
          "金属結晶",
          "共有結合の結晶",
          "分子結晶",
          "イオン結晶"
        ],
        "correctAnswer": "金属結晶",
        "correctAnswerRate": 90
      },
      {
        "id": "q_c3_2_n6_1e",
        "label": "問1 E の結晶の種類",
        "type": "multiple_choice",
        "options": [
          "金属結晶",
          "共有結合の結晶",
          "分子結晶",
          "イオン結晶"
        ],
        "correctAnswer": "共有結合の結晶",
        "correctAnswerRate": 55
      },
      {
        "id": "q_c3_2_n6_2a",
        "label": "問2 A に当てはまる物質",
        "type": "short_answer",
        "correctAnswer": "塩化マグネシウム",
        "correctAnswerRate": 75
      },
      {
        "id": "q_c3_2_n6_2b",
        "label": "問2 B に当てはまる物質",
        "type": "short_answer",
        "correctAnswer": "二酸化ケイ素",
        "correctAnswerRate": 80
      },
      {
        "id": "q_c3_2_n6_2c",
        "label": "問2 C に当てはまる物質",
        "type": "short_answer",
        "correctAnswer": "ドライアイス",
        "acceptedAnswers": [
          "二酸化炭素"
        ],
        "correctAnswerRate": 70
      },
      {
        "id": "q_c3_2_n6_2d",
        "label": "問2 D に当てはまる物質",
        "type": "short_answer",
        "correctAnswer": "銅",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c3_2_n6_2e",
        "label": "問2 E に当てはまる物質",
        "type": "short_answer",
        "correctAnswer": "黒鉛",
        "acceptedAnswers": [
          "グラファイト"
        ],
        "correctAnswerRate": 85
      },
      {
        "id": "q_c3_2_n6_3a",
        "label": "問3① A の組成式",
        "type": "short_answer",
        "correctAnswer": "MgCl2",
        "acceptedAnswers": [
          "MgCl₂"
        ],
        "correctAnswerRate": 80
      },
      {
        "id": "q_c3_2_n6_3b",
        "label": "問3② 固体は通さず融解すると通す理由（「イオン」を用いて）",
        "type": "descriptive",
        "correctAnswer": "固体では陽イオンと陰イオンが決まった位置に固定されて動けないが、融解するとイオンが自由に動けるようになり電気を運べるから。",
        "correctAnswerRate": 55
      },
      {
        "id": "q_c3_2_n6_4",
        "label": "問4 C が無極性分子である理由",
        "type": "descriptive",
        "correctAnswer": "CO₂ 分子は直線形で、2つの C＝O 結合の極性が互いに反対向きで打ち消し合うから。",
        "correctAnswerRate": 55
      },
      {
        "id": "q_c3_2_n6_5a",
        "label": "問5 たたくと薄く広がる性質の名称",
        "type": "short_answer",
        "correctAnswer": "展性",
        "correctAnswerRate": 80
      },
      {
        "id": "q_c3_2_n6_5b",
        "label": "問5 引っ張ると細く延びる性質の名称",
        "type": "short_answer",
        "correctAnswer": "延性",
        "correctAnswerRate": 80
      },
      {
        "id": "q_c3_2_n6_5c",
        "label": "問5 電気を導き、割れずに変形する理由（「自由電子」を用いて）",
        "type": "descriptive",
        "correctAnswer": "金属中を自由電子が移動できるため電気をよく導き、また原子の配列がずれても自由電子がすべての原子を結びつけ続けるため、割れずに変形できるから。",
        "correctAnswerRate": 45
      },
      {
        "id": "q_c3_2_n6_6",
        "label": "問6 C が昇華しやすい理由",
        "type": "descriptive",
        "correctAnswer": "分子どうしを結びつけている分子間力が非常に弱いため、分子が結晶から離れやすいから。",
        "correctAnswerRate": 60
      },
      {
        "id": "q_c3_2_n6_7",
        "label": "問7 正しいものを2つ",
        "type": "multiple_choice",
        "options": [
          "(ア) と (イ)",
          "(イ) と (オ)",
          "(ウ) と (エ)",
          "(ア) と (オ)",
          "(イ) と (エ)"
        ],
        "correctAnswer": "(イ) と (オ)",
        "correctAnswerRate": 60
      }
    ],
    "explanation": "▼ 解答・解説\n\n【問1・問2】\n ｜ 結晶の種類 ｜ 物質 ｜ 判断の決め手\nA ｜ <span style=\"background-image:linear-gradient(to top, rgba(233,104,142,0.85) 0%, rgba(244,169,196,0.75) 55%, rgba(244,169,196,0) 100%); background-repeat:no-repeat; background-size:100% 40%; background-position:0 100%; font-weight:bold; padding:0 3px 1px; border-radius:2px;\">イオン結晶</span> ｜ <span style=\"background-image:linear-gradient(to top, rgba(233,104,142,0.85) 0%, rgba(244,169,196,0.75) 55%, rgba(244,169,196,0) 100%); background-repeat:no-repeat; background-size:100% 40%; background-position:0 100%; font-weight:bold; padding:0 3px 1px; border-radius:2px;\">塩化マグネシウム</span> ｜ 固体× ／ 融解液・水溶液○ の電気伝導性\nB ｜ <span style=\"background-image:linear-gradient(to top, rgba(233,104,142,0.85) 0%, rgba(244,169,196,0.75) 55%, rgba(244,169,196,0) 100%); background-repeat:no-repeat; background-size:100% 40%; background-position:0 100%; font-weight:bold; padding:0 3px 1px; border-radius:2px;\">共有結合の結晶</span> ｜ <span style=\"background-image:linear-gradient(to top, rgba(233,104,142,0.85) 0%, rgba(244,169,196,0.75) 55%, rgba(244,169,196,0) 100%); background-repeat:no-repeat; background-size:100% 40%; background-position:0 100%; font-weight:bold; padding:0 3px 1px; border-radius:2px;\">二酸化ケイ素</span> ｜ きわめて硬い・融点が非常に高い・水晶（石英）\nC ｜ <span style=\"background-image:linear-gradient(to top, rgba(233,104,142,0.85) 0%, rgba(244,169,196,0.75) 55%, rgba(244,169,196,0) 100%); background-repeat:no-repeat; background-size:100% 40%; background-position:0 100%; font-weight:bold; padding:0 3px 1px; border-radius:2px;\">分子結晶</span> ｜ <span style=\"background-image:linear-gradient(to top, rgba(233,104,142,0.85) 0%, rgba(244,169,196,0.75) 55%, rgba(244,169,196,0) 100%); background-repeat:no-repeat; background-size:100% 40%; background-position:0 100%; font-weight:bold; padding:0 3px 1px; border-radius:2px;\">ドライアイス</span> ｜ 昇華性＋無色＋直線形の無極性分子（CO₂）\nD ｜ <span style=\"background-image:linear-gradient(to top, rgba(233,104,142,0.85) 0%, rgba(244,169,196,0.75) 55%, rgba(244,169,196,0) 100%); background-repeat:no-repeat; background-size:100% 40%; background-position:0 100%; font-weight:bold; padding:0 3px 1px; border-radius:2px;\">金属結晶</span> ｜ <span style=\"background-image:linear-gradient(to top, rgba(233,104,142,0.85) 0%, rgba(244,169,196,0.75) 55%, rgba(244,169,196,0) 100%); background-repeat:no-repeat; background-size:100% 40%; background-position:0 100%; font-weight:bold; padding:0 3px 1px; border-radius:2px;\">銅</span> ｜ 赤みを帯びた光沢・展性延性・電線\nE ｜ <span style=\"background-image:linear-gradient(to top, rgba(233,104,142,0.85) 0%, rgba(244,169,196,0.75) 55%, rgba(244,169,196,0) 100%); background-repeat:no-repeat; background-size:100% 40%; background-position:0 100%; font-weight:bold; padding:0 3px 1px; border-radius:2px;\">共有結合の結晶</span> ｜ <span style=\"background-image:linear-gradient(to top, rgba(233,104,142,0.85) 0%, rgba(244,169,196,0.75) 55%, rgba(244,169,196,0) 100%); background-repeat:no-repeat; background-size:100% 40%; background-position:0 100%; font-weight:bold; padding:0 3px 1px; border-radius:2px;\">黒鉛</span> ｜ 非金属なのに電気を通す・薄くはがれる\n\n■ 思考手順（未知物質の同定は「電気伝導性 → 硬さ・融点 → 色や用途」の順で絞る）\n① <span style=\"font-weight:bold; -webkit-text-decoration:underline wavy currentColor; text-decoration:underline wavy currentColor; text-decoration-thickness:1.5px; text-underline-offset:5px; text-decoration-skip-ink:none;\">まず電気を通すかどうかで大きく2つに割る</span>\n　・固体で通す … D（金属光沢あり→金属結晶）と E（金属ではない→黒鉛の例外パターン）。\n　・固体で通さない … A・B・C。\n② <span style=\"font-weight:bold; -webkit-text-decoration:underline wavy currentColor; text-decoration:underline wavy currentColor; text-decoration-thickness:1.5px; text-underline-offset:5px; text-decoration-skip-ink:none;\">通さない組は「融解・水溶液で通るか」で決着する</span>\n　・融解液・水溶液で通る → イオンが動ける＝A は イオン結晶。\n　・液体でも通らない → B・C。ここは 融点と硬さ で分ける（超高融点・きわめて硬い → 共有結合の結晶 B ／ 昇華する → 分子結晶 C）。\n③ <span style=\"font-weight:bold; -webkit-text-decoration:underline wavy currentColor; text-decoration:underline wavy currentColor; text-decoration-thickness:1.5px; text-underline-offset:5px; text-decoration-skip-ink:none;\">語群から色・状態・用途のキーワードで1つに確定する</span>\n　・A：Mg²⁺ と Cl⁻ とあるので 塩化マグネシウム。\n　・B：「水晶（石英）」の一語で 二酸化ケイ素 に確定。\n　・C：昇華する分子結晶はヨウ素とドライアイスの2択だが、「無色」「直線形の無極性分子」から CO₂＝ドライアイス（ヨウ素 I₂ は 黒紫色 で誤り）。\n　・D：「赤みを帯びた」金属は 銅（アルミニウムは 銀白色 なので誤り）。\n　・E：非金属なのに電気を通す・鉛筆の芯 → 黒鉛。共有結合の結晶の 例外 として必ず押さえる。\n\n【問3】\n① <span style=\"background-image:linear-gradient(to top, rgba(233,104,142,0.85) 0%, rgba(244,169,196,0.75) 55%, rgba(244,169,196,0) 100%); background-repeat:no-repeat; background-size:100% 40%; background-position:0 100%; font-weight:bold; padding:0 3px 1px; border-radius:2px;\">【解答】MgCl₂</span>\n② <span style=\"background-image:linear-gradient(to top, rgba(233,104,142,0.85) 0%, rgba(244,169,196,0.75) 55%, rgba(244,169,196,0) 100%); background-repeat:no-repeat; background-size:100% 40%; background-position:0 100%; font-weight:bold; padding:0 3px 1px; border-radius:2px;\">【解答例】固体では陽イオンと陰イオンが決まった位置に固定されて動けないが、融解するとイオンが自由に動けるようになり、電気を運ぶことができるから。</span>\n　・Mg²⁺（2＋）と Cl⁻（1−）を電気的に中性になるよう 1 : 2 で組み合わせる（発展1と同じたすき掛け）。\n　・<span style=\"font-weight:bold; -webkit-text-decoration:underline wavy currentColor; text-decoration:underline wavy currentColor; text-decoration-thickness:1.5px; text-underline-offset:5px; text-decoration-skip-ink:none;\">電気伝導には「電荷を運ぶ粒子（イオン・自由電子）が動けること」が必要</span>。イオン結晶は「固体＝動けない／液体・水溶液＝動ける」の対比で書く。\n\n【問4】\n<span style=\"background-image:linear-gradient(to top, rgba(233,104,142,0.85) 0%, rgba(244,169,196,0.75) 55%, rgba(244,169,196,0) 100%); background-repeat:no-repeat; background-size:100% 40%; background-position:0 100%; font-weight:bold; padding:0 3px 1px; border-radius:2px;\">【解答例】CO₂ 分子は直線形で、2つの C＝O 結合の極性が互いに反対向きで打ち消し合うから。</span>\n　・発展2で確認した「結合の極性 ≠ 分子の極性」がそのまま問われている。必ず 分子の形（直線形） に言及すること。\n\n【問5】\n<span style=\"background-image:linear-gradient(to top, rgba(233,104,142,0.85) 0%, rgba(244,169,196,0.75) 55%, rgba(244,169,196,0) 100%); background-repeat:no-repeat; background-size:100% 40%; background-position:0 100%; font-weight:bold; padding:0 3px 1px; border-radius:2px;\">【解答】薄く広がる性質…展性　／　細く延びる性質…延性</span>\n<span style=\"background-image:linear-gradient(to top, rgba(233,104,142,0.85) 0%, rgba(244,169,196,0.75) 55%, rgba(244,169,196,0) 100%); background-repeat:no-repeat; background-size:100% 40%; background-position:0 100%; font-weight:bold; padding:0 3px 1px; border-radius:2px;\">【解答例】理由：金属中を自由電子が移動できるため電気をよく導き、また原子の配列がずれても自由電子がすべての原子を結びつけ続けるため、割れずに変形できるから。</span>\n　・◎対比：イオン結晶は「ずれると同符号イオンが反発して割れる」（発展1問2）、金属は「ずれても自由電子が結合を保つので変形できる」。<span style=\"font-weight:bold; -webkit-text-decoration:underline wavy currentColor; text-decoration:underline wavy currentColor; text-decoration-thickness:1.5px; text-underline-offset:5px; text-decoration-skip-ink:none;\">この2つは必ずセットで記述できるようにする</span>。\n\n【問6】\n<span style=\"background-image:linear-gradient(to top, rgba(233,104,142,0.85) 0%, rgba(244,169,196,0.75) 55%, rgba(244,169,196,0) 100%); background-repeat:no-repeat; background-size:100% 40%; background-position:0 100%; font-weight:bold; padding:0 3px 1px; border-radius:2px;\">【解答例】分子どうしを結びつけている分子間力が非常に弱いため、分子が結晶から離れやすいから。</span>\n　・「分子 内部 の共有結合が弱いから」と書くと ×。弱いのは あくまで分子 どうし をつなぐ力。\n\n【問7】\n<span style=\"background-image:linear-gradient(to top, rgba(233,104,142,0.85) 0%, rgba(244,169,196,0.75) 55%, rgba(244,169,196,0) 100%); background-repeat:no-repeat; background-size:100% 40%; background-position:0 100%; font-weight:bold; padding:0 3px 1px; border-radius:2px;\">【解答】(イ) ・ (オ)</span>\n・(ア) 誤り … NaCl はイオン結晶で 分子は存在しない。NaCl は組成式（イオンの数の比）。\n・(イ) 正しい … 配位結合は電子対の出どころが違うだけで、できてしまえば通常の共有結合とまったく同等（発展4 の NH₄Cl と同じ論点）。\n・(ウ) 誤り … ダイヤモンドと黒鉛は 同素体。同位体は中性子の数が異なる 原子 どうし。\n・(エ) 誤り … 水分子は 折れ線形 なので極性が打ち消されず 極性分子。\n・(オ) 正しい … 氷は分子結晶であり、分子結晶の融点は一般に低い。\n\n◎総まとめ：この1題で「イオン結晶と組成式（発展1）」「分子の形と極性（発展2）」「同素体と黒鉛（発展3）」「配位結合と分子の有無（発展4）」「4分類とその性質（発展5）」がすべて確認できる。テスト直前は <span style=\"font-weight:bold; -webkit-text-decoration:underline wavy currentColor; text-decoration:underline wavy currentColor; text-decoration-thickness:1.5px; text-underline-offset:5px; text-decoration-skip-ink:none;\">この総合演習だけでも解き直す</span> と、単元全体の穴が一気に洗い出せる。\n<div style=\"background-color:#FFF4E5; border:2px solid #FB8C00; border-left:9px solid #FB8C00; border-radius:10px; padding:10px 12px; margin-top:12px; color:#3E2723;\">💡 【ココが狙われる！共通テスト・センター試験のリアル】\n\n■ 出典：2017年 センター試験 問4a（イオン結晶でないもの）／2018年 センター試験 問1b（共有結合の結晶）／2021年 共通テスト 問5・問7（極性と分子の形／単位格子）／2024年 共通テスト 問5（Si・SiO₂ の結晶構造）／2025年 共通テスト 問4（物質と化学結合）／2026年 共通テスト 問6（H₂O・CO₂・NH₃ の極性）\n\n■ 過去問では、こういう要素が問われた！\n　・本問と同じ「実験結果から未知の固体を同定する」形式が、共通テストの思考力型問題として定着している。判断材料は ほぼ必ず電気伝導性・融点・硬さ・昇華性 の4つ。\n　・複数分野（結合の種類＋結晶の性質＋分子の極性）を1問に束ねた 総合正誤問題。まさに問7の形。\n　・「金属の展性・延性を自由電子で説明する」記述の内容が、正誤選択肢の形に変換されて出題される。\n\n■ このパターンのひっかけが多い！\n　⚠️ 「昇華する ＝ 分子結晶」は正しいが、逆に 「分子結晶はすべて昇華する」は誤り（氷や砂糖は昇華しない）。この逆命題のすり替えは頻出。\n　⚠️ 黒鉛を「電気を通すから金属結晶」とする定番の誤答誘導。E のような問題文で必ず仕掛けられている。\n　⚠️ 色の情報でふるいにかける出題（無色＝CO₂／黒紫色＝I₂、銀白色＝Al／赤色＝Cu）。物質の 見た目 を軽視していると、結晶の分類が合っていても物質名で失点する。\n　⚠️ 2027年に向けては、trend データの予測どおり 共有結合の結晶（ダイヤモンド・Si・SiO₂）の性質正誤 と 分子の極性 が最有力テーマ。本問の B・C はまさにその2大テーマの融合。\n\n■ 実践アドバイス\n　総合問題は「読んだ順に答える」のではなく、まず A〜E すべてに 電気伝導性の○×を書き込む ところから始めること。そのうえで4分類の比較表（発展5）を思い出せば、物質名は最後に自動的に決まる。共通テスト本番でも、この「表を先に埋める」手順が最も速く、最も事故が少ない。</div>",
    "surroundingKnowledge": [],
    "deepDiveTopics": []
  },
  // ── 教科書順⑥：章末の総合演習 ──
  //   結晶4分類・組成式・分子の極性・同素体・配位結合を1題で総点検する。
  ...pickCrystalProblems('p_c3_2_synthesis')
];

/** c3_3 の演習問題。chemistryData.ts の "practiceProblems" にそのまま入る。 */
export const c3_3_Practice = [
  {
    "id": "q_c3_3_1",
    "category": "分子の相互作用と性質 (問1)",
    "text": "【問1】 次の文章の空欄（ア）〜（ス）に適する語句・記号を答えよ。（語句網羅）\n\n共有結合する2原子間で電子対を引きつける強さを（ア）という。値が大きい順に概ね F > O > N ≒ Cl > C > S > H となる。結合する原子の（ア）に差があると、電子対が片方に偏り、結合に（イ）が生じる。分子全体としての（イ）の有無で、分子は（ウ）分子と（エ）分子に分類される。例として、水 H₂O は（オ）形で（ウ）分子、アンモニア NH₃ は（カ）形で（ウ）分子、二酸化炭素 CO₂ は（キ）形で（エ）分子、メタン CH₄ は（ク）形で（エ）分子である。\n分子間にはたらく弱い引力を一般に（ケ）力という。分子量が大きいほど、また（ウ）が大きいほどこの力は強くなる。特に F, O, N の原子と結合した H が、隣の分子の F, O, N と引き合う特に強い相互作用を（コ）結合という。この結合は H₂O, NH₃, HF などにみられ、その物質の沸点が同族の水素化合物に比べて異常に（サ）原因になっている。極性分子は極性をもつ溶媒、特に（シ）に溶けやすく、無極性分子は（ス）溶媒（ヘキサンなど）に溶けやすい。",
    "subQuestions": [
      {
        "id": "q_c3_3_1_a",
        "label": "問1(ア) 共有結合する2原子間で電子対を引きつける強さ",
        "type": "short_answer",
        "correctAnswer": "電気陰性度",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c3_3_1_i",
        "label": "問1(イ) 電子対が片方に偏り、結合に生じるもの",
        "type": "short_answer",
        "correctAnswer": "極性",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c3_3_1_u",
        "label": "問1(ウ) 分子全体としての(イ)の有無による分類（有）",
        "type": "short_answer",
        "correctAnswer": "極性",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c3_3_1_e",
        "label": "問1(エ) 分子全体としての(イ)の有無による分類（無）",
        "type": "short_answer",
        "correctAnswer": "無極性",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c3_3_1_o",
        "label": "問1(オ) 水 H₂O は何形か",
        "type": "short_answer",
        "correctAnswer": "折れ線",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c3_3_1_ka",
        "label": "問1(カ) アンモニア NH₃ は何形か",
        "type": "short_answer",
        "correctAnswer": "三角錐",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c3_3_1_ki",
        "label": "問1(キ) 二酸化炭素 CO₂ は何形か",
        "type": "short_answer",
        "correctAnswer": "直線",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c3_3_1_ku",
        "label": "問1(ク) メタン CH₄ は何形か",
        "type": "short_answer",
        "correctAnswer": "正四面体",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c3_3_1_ke",
        "label": "問1(ケ) 分子間にはたらく弱い引力（○○力）",
        "type": "short_answer",
        "correctAnswer": "ファンデルワールス",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c3_3_1_ko",
        "label": "問1(コ) F, O, Nの原子と結合したHが引き合う特に強い相互作用",
        "type": "short_answer",
        "correctAnswer": "水素",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c3_3_1_sa",
        "label": "問1(サ) その物質の沸点が同族の水素化合物に比べて異常に（高い／低い）",
        "type": "multiple_choice",
        "options": [
          "高い",
          "低い"
        ],
        "correctAnswer": "高い",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c3_3_1_shi",
        "label": "問1(シ) 極性分子は極性をもつ溶媒、特に何に溶けやすいか",
        "type": "short_answer",
        "correctAnswer": "水",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c3_3_1_su",
        "label": "問1(ス) 無極性分子は何溶媒に溶けやすいか",
        "type": "short_answer",
        "correctAnswer": "無極性",
        "correctAnswerRate": 85
      }
    ],
    "explanation": "▼ 解答・解説\n（ア）電気陰性度 （イ）極性 （ウ）極性 （エ）無極性\n（オ）折れ線（V字） （カ）三角錐 （キ）直線 （ク）正四面体\n（ケ）ファンデルワールス （コ）水素 （サ）高い\n（シ）水 （ス）無極性（有機）\n\n■ 共有結合における電子の偏り（電気陰性度差による極性）と、それが分子全体で打ち消し合わないこと（分子の立体形状）を統合して、極性分子・無極性分子を判断できるようにしましょう。",
    "surroundingKnowledge": [],
    "deepDiveTopics": []
  },
  {
    "id": "q_c3_3_2",
    "category": "分子の相互作用と性質 (問2)",
    "text": "【問2】 （基礎）次の分子を、ア：極性分子、イ：無極性分子 に分類せよ。\n\n(1) H₂ (2) HCl (3) H₂O (4) CH₄ (5) CO₂\n(6) NH₃ (7) N₂ (8) HF (9) CCl₄ (10) CHCl₃",
    "subQuestions": [
      {
        "id": "q_c3_3_2_1",
        "label": "(1) H₂",
        "type": "multiple_choice",
        "options": [
          "ア",
          "イ"
        ],
        "correctAnswer": "イ",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c3_3_2_2",
        "label": "(2) HCl",
        "type": "multiple_choice",
        "options": [
          "ア",
          "イ"
        ],
        "correctAnswer": "ア",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c3_3_2_3",
        "label": "(3) H₂O",
        "type": "multiple_choice",
        "options": [
          "ア",
          "イ"
        ],
        "correctAnswer": "ア",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c3_3_2_4",
        "label": "(4) CH₄",
        "type": "multiple_choice",
        "options": [
          "ア",
          "イ"
        ],
        "correctAnswer": "イ",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c3_3_2_5",
        "label": "(5) CO₂",
        "type": "multiple_choice",
        "options": [
          "ア",
          "イ"
        ],
        "correctAnswer": "イ",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c3_3_2_6",
        "label": "(6) NH₃",
        "type": "multiple_choice",
        "options": [
          "ア",
          "イ"
        ],
        "correctAnswer": "ア",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c3_3_2_7",
        "label": "(7) N₂",
        "type": "multiple_choice",
        "options": [
          "ア",
          "イ"
        ],
        "correctAnswer": "イ",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c3_3_2_8",
        "label": "(8) HF",
        "type": "multiple_choice",
        "options": [
          "ア",
          "イ"
        ],
        "correctAnswer": "ア",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c3_3_2_9",
        "label": "(9) CCl₄",
        "type": "multiple_choice",
        "options": [
          "ア",
          "イ"
        ],
        "correctAnswer": "イ",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c3_3_2_10",
        "label": "(10) CHCl₃",
        "type": "multiple_choice",
        "options": [
          "ア",
          "イ"
        ],
        "correctAnswer": "ア",
        "correctAnswerRate": 85
      }
    ],
    "explanation": "▼ 解答・解説\n極性分子（ア）：(2) HCl, (3) H₂O, (6) NH₃, (8) HF, (10) CHCl₃\n無極性分子（イ）：(1) H₂, (4) CH₄, (5) CO₂, (7) N₂, (9) CCl₄\n\n■ 同種2原子分子(H₂, N₂)は当然無極性です。二酸化炭素 CO₂ は二重結合の極性があるものの、直線対称なため打ち消し合って無極性分子となります。メタン CH₄ や四塩化炭素 CCl₄ も同様に、完全に均等で対称な正四面体構造のため、それぞれの極性が打ち消し合います。\n一方、H₂Oは折れ線、NH₃は三角錐のため打ち消し合わず、極性を持ちます。CHCl₃ はメタンの一部の水素が塩素に置き換わっており、対称性が崩れているため極性分子となります。",
    "surroundingKnowledge": [],
    "deepDiveTopics": []
  },
  {
    "id": "q_c3_3_3",
    "category": "分子の相互作用と性質 (問3)",
    "text": "【問3】 （標準）次の問いに答えよ。",
    "subQuestions": [
      {
        "id": "q_c3_3_3_1",
        "label": "(1) ファンデルワールス力の特徴を、極性・分子量との関係に着目して述べよ。",
        "type": "short_answer",
        "correctAnswer": "分子量が大きい、または極性が大きいほど強くなる",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c3_3_3_2",
        "label": "(2) 水素結合が生じる条件を述べよ。",
        "type": "short_answer",
        "correctAnswer": "F, O, Nに結合したHが非共有電子対と引き合う",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c3_3_3_3",
        "label": "(3) HF, HCl, HBr, HI のうち、水素結合をもつ分子はどれか。また、そられの沸点は一般的にどう変化するか。",
        "type": "short_answer",
        "correctAnswer": "HFのみ。HFが突出して高く、残りは分子量順に高くなる",
        "correctAnswerRate": 85
      }
    ],
    "explanation": "▼ 解答・解説\n(1) 全ての分子間にはたらく弱い引力。分子量が大きいほど、また分子の極性（双極子モーメント）が大きいほど強くなる。\n(2) F, O, N と直接結合した H が、別の分子の F, O, N の非共有電子対と引き合う。\n(3) 水素結合をもつのは HF のみ。沸点の傾向：HF > HI > HBr > HCl。\n本来 H-X の沸点は分子量とともに高くなるはずだが、HF は水素結合により異常に沸点が高くなります。",
    "surroundingKnowledge": [],
    "deepDiveTopics": []
  },
  {
    "id": "q_c3_3_4",
    "category": "分子の相互作用と性質 (問4)",
    "text": "【問4】 （標準）\nH₂O の沸点（100℃）は、同族の H₂S（−61℃）, H₂Se（−42℃）, H₂Te（−2℃）に比べて著しく高い。理由を簡潔に答えよ。",
    "subQuestions": [
      {
        "id": "q_c3_3_4_ans",
        "label": "H₂Oの沸点が著しく高い理由を述べよ",
        "type": "short_answer",
        "correctAnswer": "水分子間に強い水素結合が形成されるため",
        "correctAnswerRate": 85
      }
    ],
    "explanation": "▼ 解答・解説\n\nH₂O では分子間に水素結合が形成され、これがファンデルワールス力よりはるかに強いため、液体から気体に変化させるのに大きなエネルギーを要し、沸点が異常に高くなります。",
    "surroundingKnowledge": [],
    "deepDiveTopics": []
  },
  {
    "id": "q_c3_3_7",
    "category": "分子の相互作用と性質 (問7)",
    "text": "【問7】 （共通テスト風応用）次のうち、決定的に誤っているものを1つ選べ。",
    "subQuestions": [
      {
        "id": "q_c3_3_7_ans",
        "label": "誤っているものを1つ選べ",
        "type": "multiple_choice",
        "options": [
          "ア：水素結合はF, O, N と結合した H が関与する。",
          "イ：CO₂ は無極性分子だが、C=O 結合自体には極性がある。",
          "ウ：CCl₄ は極性分子である。",
          "エ：分子間力にはファンデルワールス力と水素結合が含まれる。",
          "オ：氷の密度が水より小さいのは、水素結合による隙間の多い構造のためである。"
        ],
        "correctAnswer": "ウ：CCl₄ は極性分子である。",
        "correctAnswerRate": 85
      }
    ],
    "explanation": "▼ 解答・解説\n答：ウ\n\n■ CCl₄ は対称的な正四面体構造で結合の極性が完全に打ち消し合い、分子全体としては無極性分子となります。したがって「極性分子である」としたウは誤りです。ア、イ、エ、オはすべて正しい記述です。",
    "surroundingKnowledge": [],
    "deepDiveTopics": []
  },
  {
    "id": "q_c3_3_8",
    "category": "分子の相互作用と性質 (問8)",
    "text": "【問8】 （共通テスト風応用）NH₃ と PH₃ について次の問いに答えよ。",
    "subQuestions": [
      {
        "id": "q_c3_3_8_1",
        "label": "(1) どちらが沸点が高いと予想されるか、理由を答えよ。",
        "type": "short_answer",
        "correctAnswer": "NH₃。水素結合をもつため",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c3_3_8_2",
        "label": "(2) どちらが水に溶けやすいか答えよ。",
        "type": "multiple_choice",
        "options": [
          "NH₃",
          "PH₃"
        ],
        "correctAnswer": "NH₃",
        "correctAnswerRate": 85
      }
    ],
    "explanation": "▼ 解答・解説\n(1) NH₃。NH₃ は N-H に水素結合をもつため、分子量が小さくても沸点が高い（NH₃: −33℃, PH₃: −88℃）。\n(2) NH₃。極性が大きく、しかも水素結合により水分子と強く相互作用するためよく溶けます。",
    "surroundingKnowledge": [],
    "deepDiveTopics": []
  }
];
