/**
 * ===================================================================
 * 化学基礎 4章「物質量と化学反応式」 の問題データ
 * ===================================================================
 *
 * このファイルにあるのは、次の単元の問題（演習・ミニテスト）だけ。
 *
 *   ・c4_1     ① 原子量
 *   ・c4_2     ② 物質量
 *   ・c4_3     ③ 化学反応式とイオン反応式の作り方
 *   ・c4_4     ④ 濃度
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
 * ■ このファイルは何も import しない（葉）
 * -------------------------------------------------------------------
 * 問題データはただの定数なので、他のファイルを一切参照しない。
 * どこから読み込んでも循環参照にならない。
 */


/** c4_1 の演習問題。chemistryData.ts の "practiceProblems" にそのまま入る。 */
export const c4_1_Practice = [
  {
    "id": "q_c4_1_1",
    "category": "原子量 (問1)",
    "text": "炭素の原子量を求めよ。相対質量12が99%、相対質量13が1%とする。",
    "subQuestions": [
      {
        "id": "q_c4_1_1_ans",
        "label": "炭素の原子量（小数第二位まで）",
        "type": "short_answer",
        "correctAnswer": "12.01",
        "correctAnswerRate": 85
      }
    ],
    "explanation": "▼ 解答・解説\n炭素の原子量 ＝ 12 × (99/100) ＋ 13 × (1/100) ＝ 11.88 ＋ 0.13 ＝ 12.01\nよって、12.01\n\n・原子量は、各同位体の相対質量に存在比（存在割合）を掛け合わせた平均値（加重平均）です。",
    "surroundingKnowledge": [],
    "deepDiveTopics": []
  },
  {
    "id": "q_c4_1_2",
    "category": "原子量 (問2)",
    "text": "自然界の多くの元素には同位体が存在し、その存在割合はほぼ一定である。天然に存在するホウ素は10Bが20%、11Bが80%である。質量数と相対質量が等しいとするとき、天然に存在するホウ素の原子量を求めなさい。",
    "subQuestions": [
      {
        "id": "q_c4_1_2_ans",
        "label": "ホウ素の原子量（少数第一位まで）",
        "type": "short_answer",
        "correctAnswer": "10.8",
        "correctAnswerRate": 85
      }
    ],
    "explanation": "▼ 解答・解説\n質量数と相対質量が等しいので、質量数を相対質量とみて、ホウ素の原子量を加重平均で計算します：\nホウ素の原子量 ＝ 10 × (20/100) ＋ 11 × (80/100) ＝ 2.0 ＋ 8.8 ＝ 10.8\nよって、10.8",
    "surroundingKnowledge": [],
    "deepDiveTopics": []
  },
  {
    "id": "q_c4_1_3",
    "category": "原子量 (問3)",
    "text": "塩素には、相対質量35.0の35Clと、相対質量37.0の37Clの2種類の同位体が存在する。塩素の原子量を35.5とするとき、35Clの存在割合（%）を求めよ。",
    "subQuestions": [
      {
        "id": "q_c4_1_3_ans",
        "label": "35Clの存在割合（%）※数値のみ",
        "type": "short_answer",
        "correctAnswer": "75",
        "correctAnswerRate": 85
      }
    ],
    "explanation": "▼ 解答・解説\n原子量はわかっているが、存在割合が分からない場合、方程式を立てればよい。\n求めたい35Clの割合を x ％とおくと、もう一方の37Clの割合は自動的に（100－x）%となる。\n\n塩酸の原子量の式を立てる：\n35.5 ＝ 35.0 × (x/100) ＋ 37.0 × (100－x)/100\n3550 ＝ 35.0x ＋ 3700 － 37.0x\n-2.0x ＝ -150\nx ＝ 75\nより、35Clの存在割合は 75% となる。",
    "surroundingKnowledge": [],
    "deepDiveTopics": []
  },
  {
    "id": "q_c4_1_4",
    "category": "原子量 (問4-1)",
    "text": "12C原子 1 個の質量が Mc [g] のとき、ある元素 X の同位体の一つである原子 A（質量 MA [g]）の相対質量を、MA、Mc を用いて表せ。最も適切な選択肢を選べ。",
    "subQuestions": [
      {
        "id": "q_c4_1_4_ans",
        "label": "原子Aの相対質量",
        "type": "multiple_choice",
        "options": [
          "12 * MA / MC",
          "12 * MC / MA",
          "MA / (12 * MC)",
          "MC / (12 * MA)"
        ],
        "correctAnswer": "12 * MA / MC",
        "correctAnswerRate": 85
      }
    ],
    "explanation": "▼ 解答・解説\n「質量数12の炭素の質量を12」ということを基準に考えていこう。\n原子A（質量 MA [g]）の相対質量を x とすると、12C基準との比率は：\n12 : MC ＝ x : MA\nx ＝ 12 * MA / MC となる。",
    "surroundingKnowledge": [],
    "deepDiveTopics": []
  },
  {
    "id": "q_c4_1_5",
    "category": "原子量 (問4-2)",
    "text": "この元素 X には原子 A のほかに原子 B（1個の質量 MB [g]）という同位体が存在する。これらの同位体の存在比が 原子 A : 原子 B ＝ 2 : 1 であるとき、この元素 X の原子量を、MA、MB、MC を用いて表せ。最も適切なものを選べ。",
    "subQuestions": [
      {
        "id": "q_c4_1_5_ans",
        "label": "元素X of 原子量",
        "type": "multiple_choice",
        "options": [
          "(8 * MA + 4 * MB) / MC",
          "(12 * MA + 6 * MB) / MC",
          "(8 * MA + 4 * MB) * MC",
          "(10 * MA + 5 * MB) / MC"
        ],
        "correctAnswer": "(8 * MA + 4 * MB) / MC",
        "correctAnswerRate": 85
      }
    ],
    "explanation": "▼ 解答・解説\n公式から、元素 X の同位体の相対質量はそれぞれ：\n原子A ＝ 12 * MA / MC\n原子B ＝ 12 * MB / MC\n\n存在比が 原子A : 原子B ＝ 2 : 1 であるから、その存在割合は 原子A が 2/3、原子B が 1/3 となる。\n元素 X の原子量 ＝ (12 * MA / MC) × (2/3) ＋ (12 * MB / MC) × (1/3)\n= (8 * MA) / MC ＋ (4 * MB) / MC\n= (8 * MA ＋ 4 * MB) / MC となる。",
    "surroundingKnowledge": [],
    "deepDiveTopics": []
  },
  {
    "id": "q_c4_1_6",
    "category": "原子量 (問5)",
    "text": "次の文章を読み、下の各問いに答えよ。\n\n天然の多くの元素には同位体が存在し、その存在割合はほぼ一定である。原子の実際の質量は 10^-24 g 〜 10^-22 g と極めて小さいため、化学の計算では、(a) ある特定の原子 1 個の質量を「12」とした（ ア ）質量を基準として用いる。この基準によって定められた値には、グラム（g）などの（ イ ）はつけない。同じ元素（原子番号が同じ原子）であっても、同位体によって質量が変わってくるのは、原子核を構成する粒子のうち（ ウ ）の数が異なるためである。各元素の同位体の（ ア ）質量と天然存在比から求めた平均値のことを、その元素の（ エ ）と呼ぶ。",
    "subQuestions": [
      {
        "id": "q_c4_1_6_1",
        "label": "（1）空欄（ア）〜（エ）に当てはまる適切な語句の組み合わせ",
        "type": "multiple_choice",
        "options": [
          "ア: 相対, イ: 単位, ウ: 中性子, エ: 原子量",
          "ア: 相対, イ: グラム, ウ: 陽子, エ: 原子量",
          "ア: 絶対, イ: 単位, ウ: 中性子, エ: 分子量",
          "ア: 比較, イ: 単位, ウ: 電子, エ: 原子量"
        ],
        "correctAnswer": "ア: 相対, イ: 単位, ウ: 中性子, エ: 原子量",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c4_1_6_2",
        "label": "（2）原子の実際の質量を使わず、相対質量という基準を定めて使用するのはなぜか。",
        "type": "multiple_choice",
        "options": [
          "原子1個の実際の質量は極めて小さく、そのままだと数値の扱いが不便だから。",
          "原子の質量は時間経過と共に自然崩壊等で狂いやすく、不安定だから。",
          "同位体すべての実際の質量が完全に等しいため、絶対量を表す必要がないから。"
        ],
        "correctAnswer": "原子1個の実際の質量は極めて小さく、そのままだと数値の扱いが不便だから。",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c4_1_6_3",
        "label": "（3）文章中の傍線部(a)の「ある特定の原子」とは何か。",
        "type": "multiple_choice",
        "options": [
          "質量数12の炭素原子 (12C)",
          "質量数1の水素原子 (1H)",
          "質量数16の酸素原子 (16O)",
          "質量数14の窒素原子 (14N)"
        ],
        "correctAnswer": "質量数12の炭素原子 (12C)",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c4_1_6_4",
        "label": "（4）マグネシウムには、24Mg（相対質量 24.0、存在比 79%）、25Mg（相対質量 25.0、存在比 10%）、26Mg（相対質量 26.0、存在比 11%）の 3 つの同位体がある。マグネシウムの原子量を求めよ。",
        "type": "short_answer",
        "correctAnswer": "24.32",
        "correctAnswerRate": 85
      }
    ],
    "explanation": "▼ 解答・解説\n(1)（ア）相対 （イ）単位 （ウ）中性子 （エ）原子量\n(2) 原子1個の実際の質量は極めて小さく、そのままだと数値の扱いが不便だからです。\n(3) 質量数12の炭素原子 (12C)。\n(4) 3つの同位体の相対質量と存在比を掛け合わせて、和を求めます：\nマグネシウムの原子量 ＝ 24.0 × (79/100) ＋ 25.0 × (10/100) ＋ 26.0 × (11/100) ＝ 18.96 ＋ 2.5 ＋ 2.86 ＝ 24.32",
    "surroundingKnowledge": [],
    "deepDiveTopics": []
  },
  {
    "id": "q_c4_1_7",
    "category": "原子量 (問6)",
    "text": "同位体と原子量に関する記述として下線部に誤りを含むものを、次の①〜④のうちから 1 つ選べ。",
    "subQuestions": [
      {
        "id": "q_c4_1_7_ans",
        "label": "誤りを含む記述（①〜④）",
        "type": "multiple_choice",
        "options": [
          "① 原子の実際の質量（絶対質量）は極めて小さく扱いにくいため、特定の原子を基準とした相対質量が用いられる。",
          "② 相対質量は、質量数12の炭素原子1個の質量を「12」としたとき、他の原子の質量がその何倍にあたるかを表した「比」であるため単位はない。",
          "③ 同じ元素（原子番号が同じ原子）であっても、同位体によって質量が変わってくるのは、原子核を構成する粒子のうち陽子の数が異なるためである。",
          "④ 各元素の同位体の相対質量にそれぞれの天然存在比（%）を掛け合わせて求めた平均値のことを、その元素の原子量と呼ぶ。"
        ],
        "correctAnswer": "③ 同じ元素（原子番号が同じ原子）であっても、同位体によって質量が変わってくるのは、原子核を構成する粒子のうち陽子の数が異なるためである。",
        "correctAnswerRate": 85
      }
    ],
    "explanation": "▼ 解答・解説\n正しい選択肢は ③ です。\n同位体において、質量（重さ）が変わってしまう原因は、「陽子」ではなく、原子核を構成する「中性子」の数が異なるためです。同じ元素であれば陽子数は常に同じになります。",
    "surroundingKnowledge": [],
    "deepDiveTopics": []
  }
];

/** c4_2 の演習問題。chemistryData.ts の "practiceProblems" にそのまま入る。 */
export const c4_2_Practice = [
  {
    "id": "q_c4_2_1",
    "category": "物質量 (問1)",
    "text": "空気の平均モル質量を求めよ。ただし、空気を窒素分子と酸素分子が 4 : 1 の物質量比で存在しているものとし、原子量は N=14、O=16 とする。",
    "subQuestions": [
      {
        "id": "q_c4_2_1_ans",
        "label": "空気の平均モル質量（g/mol、小数第一位まで）※数値のみ",
        "type": "short_answer",
        "correctAnswer": "28.8",
        "correctAnswerRate": 85
      }
    ],
    "explanation": "▼ 解答・解説\n窒素 N2 のモル質量 ＝ 14 × 2 ＝ 28 g/mol\n酸素 O2 のモル質量 ＝ 16 × 2 ＝ 32 g/mol\n\n窒素と酸素が 4 : 1 で混合しているので、空気の平均モル質量は加重平均で求めます：\n平均モル質量 ＝ 28 × (4/5) ＋ 32 × (1/5) ＝ 22.4 ＋ 6.4 ＝ 28.8 g/mol",
    "surroundingKnowledge": [],
    "deepDiveTopics": []
  },
  {
    "id": "q_c4_2_2",
    "category": "物質量 (問2)",
    "text": "水分子が 1.2 × 10^24 個存在するとき、水分子と水素原子は何 mol ずつ存在するか。解答の形式（例「水分子2.0mol、水素原子4.0mol」）に従って答えよ。ただし、アボガドロ定数は 6.0 × 10^23 個/molであるとする。",
    "subQuestions": [
      {
        "id": "q_c4_2_2_ans",
        "label": "それぞれの物質量（アボガドロ変換、例を参照）",
        "type": "short_answer",
        "correctAnswer": "水分子2.0mol、水素原子4.0mol",
        "correctAnswerRate": 85
      }
    ],
    "explanation": "▼ 解答・解説\n・水分子の物質量 ＝ 1.2 × 10^24 [個]/ (6.0 × 10^23 [個/mol]) ＝ 2.0 mol\n・水素原子の物質量：水分子 H2O 1個の中に水素原子 H は 2個 含まれます。よって、水が 2.0 mol あれば、そこに含まれる水素原子は 2倍 の 4.0 mol となります：\n  2.0 mol × 2 ＝ 4.0 mol （水素原子は 水の2倍 と考える）\nよって、水分子 2.0 mol、水素原子 4.0 mol",
    "surroundingKnowledge": [],
    "deepDiveTopics": []
  },
  {
    "id": "q_c4_2_3",
    "category": "物質量 (問3)",
    "text": "水分子が 2.0 mol あるとき、その質量は何 g か。ただし、モル質量は H=1.0、O=16 （H2O = 18 g/mol）とする。数値のみ答えよ。",
    "subQuestions": [
      {
        "id": "q_c4_2_3_ans",
        "label": "水の質量 [g]",
        "type": "short_answer",
        "correctAnswer": "36",
        "correctAnswerRate": 85
      }
    ],
    "explanation": "▼ 解答・解説\n水のモル質量は H2O なので、1.0 × 2 ＋ 16 ＝ 18 g/mol となり、1 mol ＝ 18 g です。\n2.0 mol ある場合、その質量は：\n2.0 mol × 18 g/mol ＝ 36 g",
    "surroundingKnowledge": [],
    "deepDiveTopics": []
  },
  {
    "id": "q_c4_2_4",
    "category": "物質量 (問4)",
    "text": "二酸化炭素が 88 g あったとき、これは標準状態で何 L か。ただし、モル質量は C=12、O=16とし、気体のモル体積は 22.4 L/mol とする。数値のみ答えよ。",
    "subQuestions": [
      {
        "id": "q_c4_2_4_ans",
        "label": "標準状態での体積 [L]",
        "type": "short_answer",
        "correctAnswer": "44.8",
        "correctAnswerRate": 85
      }
    ],
    "explanation": "▼ 解答・解説\n二酸化炭素のモル質量は CO2 ＝ 12 ＋ 16 × 2 ＝ 44 g/mol。よって 1 mol ＝ 44 g を使います。\n二酸化炭素 88 g を物質量に変換すると：\n88 g / 44 g/mol ＝ 2.0 mol\n\n標準状態での体積は、1 mol ＝ 22.4 L より：\n2.0 mol × 22.4 L/mol ＝ 44.8 L\nこのように、いったん「g → mol」に変換してから「mol → L」にします（単位を含めて約分できる関係を意識すると良いです）。",
    "surroundingKnowledge": [],
    "deepDiveTopics": []
  },
  {
    "id": "q_c4_2_5",
    "category": "物質量 (問5)",
    "text": "標準状態において、8.96 L の窒素 N2 和 5.60 L の酸素 O2 を混合すると、質量は何 g になるか。原子量は N=14、O=16 とし、モル体積を 22.4 L/mol とする。最も近い数値を答えよ。",
    "subQuestions": [
      {
        "id": "q_c4_2_5_ans",
        "label": "混合気体の質量 [g] ※数値のみ",
        "type": "short_answer",
        "correctAnswer": "19.2",
        "correctAnswerRate": 85
      }
    ],
    "explanation": "▼ 解答・解説\n窒素と酸素それぞれを g に変えて和をとればよいです：\n\n1. 窒素 N2 のモル質量：N2 ＝ 14 × 2 ＝ 28 g/mol。\n   8.96 L × (1 mol / 22.4 L) × (28 g / 1 mol) ＝ 11.2 g\n2. 酸素 O2 のモル質量：O2 ＝ 16 × 2 ＝ 32 g/mol。\n   5.60 L × (1 mol / 22.4 L) × (32 g / 1 mol) ＝ 8.0 g\n3. 合計質量 ＝ 11.2 g ＋ 8.0 g ＝ 19.2 g",
    "surroundingKnowledge": [],
    "deepDiveTopics": []
  },
  {
    "id": "q_c4_2_6",
    "category": "物質量 (問6)",
    "text": "標準状態（0℃、1.013×10^5 Pa）において、密度が 1.34 g/L である気体の分子量を求めよ。モル体積を 22.4 L/mol とする。四捨五入して整数で答えよ。",
    "subQuestions": [
      {
        "id": "q_c4_2_6_ans",
        "label": "気体の分子量",
        "type": "short_answer",
        "correctAnswer": "30",
        "correctAnswerRate": 85
      }
    ],
    "explanation": "▼ 解答・解説\n求めるのは気体の分子量（≒ 1mol あたりの質量 [g]）です。\n密度と標準状態での体積がわかっているので、「mol → L → g → mol」と図を1周（または単位変換）していきます。\n1 mol あたりの質量 M [g/mol] とおき、1 mol あたりの体積と密度をかけると：\n1 mol × 22.4 L/mol × 1.34 g/L ＝ 30.016 g\nよってモル質量は M ≒ 30.016 ≒ 30 (g/mol)。分子量は 30 となります。",
    "surroundingKnowledge": [],
    "deepDiveTopics": []
  },
  {
    "id": "q_c4_2_7",
    "category": "物質量 (問7)",
    "text": "アボガドロ定数を NA [/mol]、気体のモル体積を Vm [L/mol]（標準状態）として、密度 d [g/cm^3] のある金属 a [cm^3] 中には n 個の原子が含まれていたとき、この金属のモル質量 M [g/mol] を求める式として、最も適切なものを選べ。",
    "subQuestions": [
      {
        "id": "q_c4_2_7_ans",
        "label": "金属のモル質量 M",
        "type": "multiple_choice",
        "options": [
          "a * d * NA / n",
          "n * Vm / (a * d)",
          "a * d * Vm / (n * NA)",
          "n * NA / (a * d)"
        ],
        "correctAnswer": "a * d * NA / n",
        "correctAnswerRate": 85
      }
    ],
    "explanation": "▼ 解答・解説\nスタートを「cm^3」、ゴールを「個」とおいて、そのルート（経路）にモル質量 M の変換（g → mol）を入れ込みます（「cm^3 → g → mol → 個」）：\na [cm^3] × d [g/cm^3] × (1 [mol] / M [g]) × NA [個] / 1 [mol] ＝ n [個]\n(a * d * NA) / M ＝ n\n\nこれを求めるモル質量 M について解くと：\nM ＝ a * d * NA / n となります。",
    "surroundingKnowledge": [],
    "deepDiveTopics": []
  },
  {
    "id": "q_c4_2_8",
    "category": "物質量 (問8)",
    "text": "原子量 M の金属 A がある。この金属 5.4 g を空気中の酸素と反応させたところ、化合物 A2O3 が 10.2 g 得られた。このとき、金属 A の原子量 M を求めよ。原子量は O=16 とし、整数で答えよ。（ヒント：結合した酸素は 10.2−5.4=4.8 g。A2O3 の比 A：O=2：3 より A の物質量を求める。）",
    "subQuestions": [
      {
        "id": "q_c4_2_8_ans",
        "label": "金属Aの原子量 M",
        "type": "short_answer",
        "correctAnswer": "27",
        "correctAnswerRate": 85
      }
    ],
    "explanation": "▼ 解答・解説\n化学式の係数は、構成する原子の物質量の比を表すことを利用します。\n1. 結合した酸素の質量 ＝ 10.2 g － 5.4 g ＝ 4.8 g\n2. 酸素原子 O の物質量 ＝ 4.8 g / 16 g/mol ＝ 0.30 mol\n3. 化合物 A2O3 では A : O ＝ 2 : 3 なので、A の物質量 ＝ 0.30 mol × (2/3) ＝ 0.20 mol\n4. よって M ＝ 5.4 g / 0.20 mol ＝ 27 [g/mol]。（金属 A はアルミニウム Al）",
    "surroundingKnowledge": [],
    "deepDiveTopics": []
  }
];

/** c4_3 の演習問題。chemistryData.ts の "practiceProblems" にそのまま入る。 */
export const c4_3_Practice = [
  {
    "id": "q_c4_3_1",
    "category": "反応式の作り方 (問1)",
    "text": "次の化学反応式、イオン反応式の係数 a 〜 k をそれぞれ半角数字で答えよ。係数が「1」の場合も省略せずに「1」と書くこと。\n\n① ( a ) Mg ＋ ( b ) O2 → ( c ) MgO\n② ( d ) FeS2 ＋ ( e ) O2 → ( f ) Fe2O3 ＋ ( g ) SO2\n③ ( h ) Fe^2+ ＋ ( i ) Cl2 → ( j ) Fe^3+ ＋ ( k ) Cl^-",
    "subQuestions": [
      {
        "id": "q_c4_3_1_a",
        "label": "a",
        "group": "① ( a ) Mg ＋ ( b ) O2 → ( c ) MgO",
        "type": "short_answer",
        "correctAnswer": "2",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c4_3_1_b",
        "label": "b",
        "group": "① ( a ) Mg ＋ ( b ) O2 → ( c ) MgO",
        "type": "short_answer",
        "correctAnswer": "1",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c4_3_1_c",
        "label": "c",
        "group": "① ( a ) Mg ＋ ( b ) O2 → ( c ) MgO",
        "type": "short_answer",
        "correctAnswer": "2",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c4_3_1_d",
        "label": "d",
        "group": "② ( d ) FeS2 ＋ ( e ) O2 → ( f ) Fe2O3 ＋ ( g ) SO2",
        "type": "short_answer",
        "correctAnswer": "4",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c4_3_1_e",
        "label": "e",
        "group": "② ( d ) FeS2 ＋ ( e ) O2 → ( f ) Fe2O3 ＋ ( g ) SO2",
        "type": "short_answer",
        "correctAnswer": "11",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c4_3_1_f",
        "label": "f",
        "group": "② ( d ) FeS2 ＋ ( e ) O2 → ( f ) Fe2O3 ＋ ( g ) SO2",
        "type": "short_answer",
        "correctAnswer": "2",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c4_3_1_g",
        "label": "g",
        "group": "② ( d ) FeS2 ＋ ( e ) O2 → ( f ) Fe2O3 ＋ ( g ) SO2",
        "type": "short_answer",
        "correctAnswer": "8",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c4_3_1_h",
        "label": "h",
        "group": "③ ( h ) Fe^2+ ＋ ( i ) Cl2 → ( j ) Fe^3+ ＋ ( k ) Cl^-",
        "type": "short_answer",
        "correctAnswer": "2",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c4_3_1_i",
        "label": "i",
        "group": "③ ( h ) Fe^2+ ＋ ( i ) Cl2 → ( j ) Fe^3+ ＋ ( k ) Cl^-",
        "type": "short_answer",
        "correctAnswer": "1",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c4_3_1_j",
        "label": "j",
        "group": "③ ( h ) Fe^2+ ＋ ( i ) Cl2 → ( j ) Fe^3+ ＋ ( k ) Cl^-",
        "type": "short_answer",
        "correctAnswer": "2",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c4_3_1_k",
        "label": "k",
        "group": "③ ( h ) Fe^2+ ＋ ( i ) Cl2 → ( j ) Fe^3+ ＋ ( k ) Cl^-",
        "type": "short_answer",
        "correctAnswer": "2",
        "correctAnswerRate": 85
      }
    ],
    "explanation": "▼ 解答・解説\n① Oの原子数を左右で等しくするために、右辺を 2MgO にします。これより Mg は 2 になるため、a=2, b=1, c=2 となります。\n② Fe2O3 の Fe は 2原子なので、仮に d=2 と置くと Sの数から g=4 となります。この時右辺のOは 3+4×2=11原子なので、左辺 e ＝ 11/2 となります。全体を2倍にして、分数を排した最も簡単な整数比にすると：d=4, e=11, f=2, g=8 となります。\n③ 電荷と原子数を合わせます。右辺の Cl^- は 2個 (k=2) となります。このとき右辺の電荷は +3×j － 2。左辺は +2×h。 h ＝ j ＝ 2 とすると、左辺電気量=+4、右辺電気量=+6-2=+4。原子数・電荷が両立して一致します。よって：h=2, i=1, j=2, k=2。",
    "surroundingKnowledge": [],
    "deepDiveTopics": []
  },
  {
    "id": "q_c4_3_2",
    "category": "反応式の作り方 (問2)",
    "text": "次の化学変化を全半角文字、または下付き文字を活用して正しい化学反応式で表せ。（スペースは詰めても空けても正しく採点されます）",
    "subQuestions": [
      {
        "id": "q_c4_3_2_1",
        "label": "① カルシウムを水に入れると、水酸化カルシウムが生成し、水素が発生する。",
        "type": "short_answer",
        "correctAnswer": "Ca+2H2O→Ca(OH)2+H2",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c4_3_2_2",
        "label": "② 酸化マンガン(IV)に濃塩酸を加えて加熱すると、塩化マンガン(II) MnCl2 と水が生成し、塩素が発生する。",
        "type": "short_answer",
        "correctAnswer": "MnO2+4HCl→MnCl2+2H2O+Cl2",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c4_3_2_3",
        "label": "③ ブタン C4H10 が完全燃焼した。",
        "type": "short_answer",
        "correctAnswer": "2C4H10+13O2→8CO2+10H2O",
        "correctAnswerRate": 85
      }
    ],
    "explanation": "▼ 解答・解説\n① カルシウム Ca に水をかけると、水酸化カルシウム Ca(OH)2 （※Caは2価の陽イオン、OHは1価の陰イオンなので2個結合）と水素 H2 が生じます：Ca ＋ 2H2O → Ca(OH)2 ＋ H2\n② 酸化マンガン(IV)に濃塩酸を加えて加熱。実験室における典型的な塩素発生法です：MnO2 ＋ 4HCl → MnCl2 ＋ 2H2O ＋ Cl2\n③ ブタン C4H10 の燃焼：1分子に対して O2 が 6.5個（13/2分子）必要となるので、全体を2倍して 2C4H10 ＋ 13O2 → 8CO2 ＋ 10H2O とします。",
    "surroundingKnowledge": [],
    "deepDiveTopics": []
  },
  {
    "id": "q_c4_3_3",
    "category": "反応式の作り方 (問3)",
    "text": "次の化学反応式・イオン反応式の空欄（ア）〜（ソ）に入る最も簡単な整数比の係数を答えよ。ただし、係数が「1」になる場合も省略せずに「1」と答えること。",
    "subQuestions": [
      {
        "id": "q_c4_3_3_a",
        "label": "ア",
        "group": "(1) (ア) C3H8 ＋ (イ) O2 → (ウ) CO2 ＋ (エ) H2O",
        "type": "short_answer",
        "correctAnswer": "1",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c4_3_3_b",
        "label": "イ",
        "group": "(1) (ア) C3H8 ＋ (イ) O2 → (ウ) CO2 ＋ (エ) H2O",
        "type": "short_answer",
        "correctAnswer": "5",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c4_3_3_c",
        "label": "ウ",
        "group": "(1) (ア) C3H8 ＋ (イ) O2 → (ウ) CO2 ＋ (エ) H2O",
        "type": "short_answer",
        "correctAnswer": "3",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c4_3_3_d",
        "label": "エ",
        "group": "(1) (ア) C3H8 ＋ (イ) O2 → (ウ) CO2 ＋ (エ) H2O",
        "type": "short_answer",
        "correctAnswer": "4",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c4_3_3_o",
        "label": "オ",
        "group": "(2) (オ) Cu ＋ (カ) HNO3 → (キ) Cu(NO3)2 ＋ (ク) H2O ＋ (ケ) NO",
        "type": "short_answer",
        "correctAnswer": "3",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c4_3_3_ka",
        "label": "カ",
        "group": "(2) (オ) Cu ＋ (カ) HNO3 → (キ) Cu(NO3)2 ＋ (ク) H2O ＋ (ケ) NO",
        "type": "short_answer",
        "correctAnswer": "8",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c4_3_3_ki",
        "label": "キ",
        "group": "(2) (オ) Cu ＋ (カ) HNO3 → (キ) Cu(NO3)2 ＋ (ク) H2O ＋ (ケ) NO",
        "type": "short_answer",
        "correctAnswer": "3",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c4_3_3_ku",
        "label": "ク",
        "group": "(2) (オ) Cu ＋ (カ) HNO3 → (キ) Cu(NO3)2 ＋ (ク) H2O ＋ (ケ) NO",
        "type": "short_answer",
        "correctAnswer": "4",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c4_3_3_ke",
        "label": "ケ",
        "group": "(2) (オ) Cu ＋ (カ) HNO3 → (キ) Cu(NO3)2 ＋ (ク) H2O ＋ (ケ) NO",
        "type": "short_answer",
        "correctAnswer": "2",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c4_3_3_ko",
        "label": "コ",
        "group": "(3) (コ) MnO4^- ＋ (サ) H2O2 ＋ (シ) H^+ → (ス) Mn^2+ ＋ (セ) H2O ＋ (ソ) O2",
        "type": "short_answer",
        "correctAnswer": "2",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c4_3_3_sa",
        "label": "サ",
        "group": "(3) (コ) MnO4^- ＋ (サ) H2O2 ＋ (シ) H^+ → (ス) Mn^2+ ＋ (セ) H2O ＋ (ソ) O2",
        "type": "short_answer",
        "correctAnswer": "5",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c4_3_3_shi",
        "label": "シ",
        "group": "(3) (コ) MnO4^- ＋ (サ) H2O2 ＋ (シ) H^+ → (ス) Mn^2+ ＋ (セ) H2O ＋ (ソ) O2",
        "type": "short_answer",
        "correctAnswer": "6",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c4_3_3_su",
        "label": "ス",
        "group": "(3) (コ) MnO4^- ＋ (サ) H2O2 ＋ (シ) H^+ → (ス) Mn^2+ ＋ (セ) H2O ＋ (ソ) O2",
        "type": "short_answer",
        "correctAnswer": "2",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c4_3_3_se",
        "label": "セ",
        "group": "(3) (コ) MnO4^- ＋ (サ) H2O2 ＋ (シ) H^+ → (ス) Mn^2+ ＋ (セ) H2O ＋ (ソ) O2",
        "type": "short_answer",
        "correctAnswer": "8",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c4_3_3_so",
        "label": "ソ",
        "group": "(3) (コ) MnO4^- ＋ (サ) H2O2 ＋ (シ) H^+ → (ス) Mn^2+ ＋ (セ) H2O ＋ (ソ) O2",
        "type": "short_answer",
        "correctAnswer": "5",
        "correctAnswerRate": 85
      }
    ],
    "explanation": "▼ 解答・解説\n(1) 目算法で解きます。ア=1 と置くと、C数よりウ=3、H数よりエ=4。右辺のOは 3×2+4=10原子となり、左辺イ=5。よって：1, 5, 3, 4。\n(2) 銅と希硝酸の酸化還元反応（未定係数法または酸化還元半反応式）。3Cu ＋ 8HNO3 → 3Cu(NO3)2 ＋ 4H2O ＋ 2NO。よって：3, 8, 3, 4, 2。\n(3) 過マンガン酸イオンと過酸化水素の酸化還元. 2MnO4^- ＋ 5H2O2 ＋ 6H^+ → 2Mn^2+ ＋ 8H2O ＋ 5O2。よって：2, 5, 6, 2, 8, 5。",
    "surroundingKnowledge": [],
    "deepDiveTopics": []
  },
  {
    "id": "q_c4_3_4",
    "category": "量的関係 (問4〜5)",
    "text": "炭酸カルシウムを主成分とする石灰石 2.8 g に、ある濃度の塩酸を加えると、二酸化炭素が発生した。このとき、加えた塩酸の体積（mL）と発生した二酸化炭素の質量（g）の関係は、折れ線グラフ（50mL で折れ曲がり、発生質量 1.10 g で一定）をなすことがわかった。（H=1.0、C=12、O=16、Cl=35.5、Ca=40）\n\n(1) 石灰石と塩酸の反応の化学反応式を答えよ。\n(2) 用いた塩酸のモル濃度（mol/L）を求めよ。数値（有効数字2桁）のみ答えよ。",
    "subQuestions": [
      {
        "id": "q_c4_3_4_1",
        "label": "（1）石灰石と塩酸の反応式",
        "type": "multiple_choice",
        "options": [
          "CaCO3 + 2HCl → CaCl2 + H2O + CO2",
          "Ca(OH)2 + 2HCl → CaCl2 + 2H2O",
          "CaCO3 + HCl → CaCl2 + HCO3",
          "CaO + 2HCl → CaCl2 + H2O"
        ],
        "correctAnswer": "CaCO3 + 2HCl → CaCl2 + H2O + CO2",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c4_3_4_2",
        "label": "（2）用いた塩酸のモル濃度 [mol/L]",
        "type": "short_answer",
        "correctAnswer": "1.0",
        "correctAnswerRate": 85
      }
    ],
    "explanation": "▼ 解答・解説\n(1) 石灰石（炭酸カルシウム CaCO3）に酸をかけると弱酸の遊離反応が起きます：\n    CaCO3 ＋ 2HCl → CaCl2 ＋ H2O ＋ CO2\n(2) グラフから、塩酸を 50 mL 加えたとき、CO2 は 1.10 g 発生して反応が過不足なく終了しています：\n    ・生じる CO2 (分子量44) の物質量 ＝ 1.10 g / 44 g/mol ＝ 0.025 mol\n    ・反応式から必要な HCl 物質量 ＝ CO2 物質量の 2倍 ＝ 0.050 mol\n    ・塩酸の体積 50 mL ＝ 50 / 1000 ＝ 0.050 L\n    ・よって塩酸のモル濃度 ＝ 0.050 mol / 0.050 L ＝ 1.0 mol/L です。",
    "surroundingKnowledge": [],
    "deepDiveTopics": []
  },
  {
    "id": "q_c4_3_5",
    "category": "量的関係 (問6〜7)",
    "text": "炭酸カルシウムと塩酸の過不足反応（続き）について、以下の問いに答えよ。（H=1.0、C=12、O=16、Cl=35.5、Ca=40）\n\n(1) 石灰石 2.8 g 中に含まれる炭酸カルシウムの純度（含有率）は何 ％ か。数値（有効数字2桁）のみ答えよ。\n(2) 標準状態で 1.96 L の CO2 を発生させたいとき、この石灰石は何 g 必要か。数値（有効数字2桁）のみ答えよ。",
    "subQuestions": [
      {
        "id": "q_c4_3_5_1",
        "label": "（1）炭酸カルシウムの純度 [%]",
        "type": "short_answer",
        "correctAnswer": "89",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c4_3_5_2",
        "label": "（2）必要な石灰石の質量 [g]",
        "type": "short_answer",
        "correctAnswer": "9.8",
        "correctAnswerRate": 85
      }
    ],
    "explanation": "▼ 解答・解説\n(1) 反応した炭酸カルシウム（式量100）の物質量は、発生した二酸化炭素の物質量（0.025 mol）と等しいので：\n    ・CaCO3 質量 ＝ 0.025 mol × 100 g/mol ＝ 2.5 g\n    ・純度 ＝ (2.5 g / 2.8 g) × 100 ≒ 89.2% ≒ 89% となります。\n(2) 2.8 g の石灰石（CaCO3 は 2.5 g）から発生する標準状態 of CO2 の体積を算出します：\n    ・CO2 の体積 ＝ 22.4 L/mol × 0.025 mol ＝ 0.56 L\n    1.96 L の CO2 を発生させるために必要な石灰石の質量を x [g] とおくと、比例関係より：\n    2.8 g : 0.56 L ＝ x g : 1.96 L\n    x ＝ 2.8 × (1.96 / 0.56) ＝ 2.8 × 3.5 ＝ 9.8 g となります。",
    "surroundingKnowledge": [],
    "deepDiveTopics": []
  }
];

/** c4_4 の演習問題。chemistryData.ts の "practiceProblems" にそのまま入る。 */
export const c4_4_Practice = [
  {
    "id": "q_c4_4_1",
    "category": "溶液の濃度 (問1)",
    "text": "10% の塩化ナトリウム水溶液 180 g と 20% の塩化ナトリウム水溶液 120 g を混合した水溶液の質量パーセント濃度を求めよ。数値のみ答えよ。",
    "subQuestions": [
      {
        "id": "q_c4_4_1_ans",
        "label": "混合後の質量パーセント濃度 [%]",
        "type": "short_answer",
        "correctAnswer": "14",
        "correctAnswerRate": 85
      }
    ],
    "explanation": "▼ 解答・解説\n質量パーセント濃度の基本公式（溶質 / 溶液全体の質量 × 100）に沿って解きます：\n\n1. まず、溶質の質量（分子）を求める：\n   180 g × (10/100) ＋ 120 g × (20/100) ＝ 18 ＋ 24 ＝ 42 g\n2. 次に、溶液の質量（分母）を求める：\n   180 g ＋ 120 g ＝ 300 g\n3. 分数を作って 100 を掛ける：\n   (42 g / 300 g) × 100 ＝ 14%\nよって、14% です。",
    "surroundingKnowledge": [],
    "deepDiveTopics": []
  },
  {
    "id": "q_c4_4_2",
    "category": "溶液の濃度 (問2)",
    "text": "モル質量 M [g/mol] の物質 w [g] を水に溶解させて、体積を V [L] とした。この水溶液のモル濃度（mol/L）を求める最も適切な式を選べ。",
    "subQuestions": [
      {
        "id": "q_c4_4_2_ans",
        "label": "モル濃度の式",
        "type": "multiple_choice",
        "options": [
          "w / (M * V)",
          "M * w / V",
          "V * w / M",
          "M * V / w"
        ],
        "correctAnswer": "w / (M * V)",
        "correctAnswerRate": 85
      }
    ],
    "explanation": "▼ 解答・解説\nモル濃度の定義は、モル濃度 [mol/L] ＝ 溶質の物質量 [mol] / 溶液の体積 [L] です：\n\n1. まずは溶質の物質量（分子）を求める（必ず求めたい mol 単位を作る）：\n   w [g] をモル質量 M [g/mol] で単位変換して： w [g] × (1 mol / M [g]) ＝ w/M [mol]\n2. 次に、溶液の体積（分母）を求める：\n   問題文から V [L]\n3. 分数を作ってモル濃度を求める：\n   (w/M) [mol] / V [L] ＝ w / (M * V) [mol/L]\nよって、「w / (M * V)」が正解です。",
    "surroundingKnowledge": [],
    "deepDiveTopics": []
  },
  {
    "id": "q_c4_4_3",
    "category": "溶液の濃度 (問3)",
    "text": "12 mol/L の塩酸（塩化水素 HCl の水溶液）を水でうすめて 2.0 mol/L の塩酸を 150 mL つくりたい。12 mol/L の塩酸は何 mL 必要か。数値のみ答えよ。",
    "subQuestions": [
      {
        "id": "q_c4_4_3_ans",
        "label": "必要な濃塩酸の体積 [mL]",
        "type": "short_answer",
        "correctAnswer": "25",
        "correctAnswerRate": 85
      }
    ],
    "explanation": "▼ 解答・解説\n「水でうすめても溶質（塩化水素）の物質量は変わらない」という原則を用い、二つの塩酸で方程式を作ります：\n\n1. うすめた後の塩酸に含まれる塩化水素の物質量を求める：\n   150 mL × (1 L / 1000 mL) × (2.0 mol / 1 L) ＝ 0.30 mol\n2. 必要な塩酸を x [mL] とおき、溶質の物質量で方程式を作る：\n   x [mL] × (1 L / 1000 mL) × (12 mol / 1 L) ＝ 0.30 mol\n   12x / 1000 ＝ 0.30\n   12x ＝ 300\n   x ＝ 25 mL",
    "surroundingKnowledge": [],
    "deepDiveTopics": []
  },
  {
    "id": "q_c4_4_4",
    "category": "溶液の濃度 (問4)",
    "text": "質量パーセント濃度が P ％ の硫酸水溶液の密度が d [g/cm^3] であった。この硫酸水溶液のモル濃度は何 mol/L か。ただし、硫酸の分子量を M とする。正しい式を選べ。",
    "subQuestions": [
      {
        "id": "q_c4_4_4_ans",
        "label": "硫酸水溶液のモル濃度",
        "type": "multiple_choice",
        "options": [
          "10 * d * P / M",
          "d * P / (10 * M)",
          "1000 * d * P / M",
          "10 * M * d / P"
        ],
        "correctAnswer": "10 * d * P / M",
        "correctAnswerRate": 85
      }
    ],
    "explanation": "▼ 解答・解説\n溶質・溶液のそれぞれの値を求められない時は、溶液の体積を 1 L（1000 cm^3）とおいて考えます：\n\n1. 溶液の体積から、密度を用いて溶質の質量を求める：\n   溶液の質量 ＝ 1 L × 1000 cm^3 / 1 L × d g / 1 cm^3 ＝ 1000d [g]\n2. 分子と分母を単位変換する：\n   1000d [g] × (P / 100) × (1 mol / M [g]) / 1 L ＝ 10 * d * P / M [mol/L]\nよって、「10 * d * P / M」が正解です。",
    "surroundingKnowledge": [],
    "deepDiveTopics": []
  },
  {
    "id": "q_c4_4_5",
    "category": "溶液の濃度 (問5)",
    "text": "分子量 M の物質を水に溶解させ、モル濃度 c [mol/L] にした水溶液がある。水溶液の密度を d [g/cm^3] とするとき、この水溶液の質量パーセント濃度は何 ％ か。正しい式を選べ。",
    "subQuestions": [
      {
        "id": "q_c4_4_5_ans",
        "label": "質量パーセント濃度",
        "type": "multiple_choice",
        "options": [
          "c * M / (10 * d)",
          "10 * d * c / M",
          "c * M / (1000 * d)",
          "10 * c * M / d"
        ],
        "correctAnswer": "c * M / (10 * d)",
        "correctAnswerRate": 85
      }
    ],
    "explanation": "▼ 解答・解説\n質量パーセント比が求められないので、同様に溶液の体積を 1 L（1000 cm^3）とおきます：\n\n1. 溶質のモル質量は M [g/mol]、モル濃度は c [mol/L] なので、1 L あたりの溶質の質量は：\n   1 L × (c mol / 1 L) × (M g / 1 mol) ＝ cM [g]\n2. 溶液 1 L（1000 cm^3）の質量を密度 d [g/cm^3] から求める：\n   1 L × 1000 cm^3 / 1 L × d g / 1 cm^3 ＝ 1000d [g]\n3. 割合の分数を作り、「× 100」をする：\n   (cM [g] / 1000d [g]) × 100 ＝ c * M / (10 * d) [%]\nよって、「c * M / (10 * d)」が正解です。",
    "surroundingKnowledge": [],
    "deepDiveTopics": []
  }
];
