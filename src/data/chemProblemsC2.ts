/**
 * ===================================================================
 * 化学基礎 2章「物質の構成粒子」 の問題データ
 * ===================================================================
 *
 * このファイルにあるのは、次の単元の問題（演習・ミニテスト）だけ。
 *
 *   ・c2_1     ① 原子の構造と電子配置・元素の周期表
 *   ・c2_2     ② イオン
 *   ・c2_3     ③ イオン生成とエネルギー
 *   ・c2_4     ④ 原子の大きさとイオンの大きさ
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


/** c2_1 の演習問題。chemistryData.ts の "practiceProblems" にそのまま入る。 */
export const c2_1_Practice = [
  {
    "id": "q_c2_1_1",
    "category": "原子の構造と電子配置・元素の周期表 (問1)",
    "text": "【問1】 次の文章の空欄（ア）〜（ト）に適する語句・数値・記号を答えよ。（語句網羅）\n\n原子は中心にある（ア）と、そのまわりを運動する（イ）からなる。（ア）は（ウ）と（エ）から構成されている。原子の直径は約（オ）m、（ア）の直径はその約（カ）分の1である。（ウ）の数を（キ）といい、これは元素ごとに決まっている。（キ）と（エ）の数の和を（ク）という。（キ）が等しく（ク）が異なる原子どうしを互いに（ケ）（アイソトープ）という。電子は（コ）とよばれる空間に存在し、（ア）に近い方から K, L, M, N, …殻 と名づけられている。n 番目の電子殻に収容できる電子の最大数は（サ）個で表される。最も外側の電子殻にある電子を（シ）といい、化学的性質を主に決める電子を（ス）という。（ス）の数は典型元素で（セ）の一の位と一致するが、（ソ）（18族）では 0 とみなす。周期表で縦の列を（タ）、横の行を（チ）という。1族のうちH以外を（ツ）金属、2族をアルカリ土類金属、17族を（テ）、18族を（ト）という。",
    "subQuestions": [
      {
        "id": "q_c2_1_1_a",
        "label": "（ア）",
        "type": "short_answer",
        "correctAnswer": "原子核",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_1_1_i",
        "label": "（イ）",
        "type": "short_answer",
        "correctAnswer": "電子",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_1_1_u",
        "label": "（ウ）",
        "type": "short_answer",
        "correctAnswer": "陽子",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_1_1_e",
        "label": "（エ）",
        "type": "short_answer",
        "correctAnswer": "中性子",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_1_1_o",
        "label": "（オ） ※10⁻¹⁰ と入力",
        "type": "short_answer",
        "correctAnswer": "10⁻¹⁰",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_1_1_ka",
        "label": "（カ）",
        "type": "short_answer",
        "correctAnswer": "1万〜10万",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_1_1_ki",
        "label": "（キ）",
        "type": "short_answer",
        "correctAnswer": "原子番号",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_1_1_ku",
        "label": "（ク）",
        "type": "short_answer",
        "correctAnswer": "質量数",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_1_1_ke",
        "label": "（ケ）",
        "type": "short_answer",
        "correctAnswer": "同位体",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_1_1_ko",
        "label": "（コ）",
        "type": "short_answer",
        "correctAnswer": "電子殻",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_1_1_sa",
        "label": "（サ） ※2n² と入力",
        "type": "short_answer",
        "correctAnswer": "2n²",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_1_1_shi",
        "label": "（シ）",
        "type": "short_answer",
        "correctAnswer": "最外殻電子",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_1_1_su",
        "label": "（ス）",
        "type": "short_answer",
        "correctAnswer": "価電子",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_1_1_se",
        "label": "（セ）",
        "type": "short_answer",
        "correctAnswer": "族番号",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_1_1_so",
        "label": "（ソ）",
        "type": "short_answer",
        "correctAnswer": "貴ガス",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_1_1_ta",
        "label": "（タ）",
        "type": "short_answer",
        "correctAnswer": "族",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_1_1_chi",
        "label": "（チ）",
        "type": "short_answer",
        "correctAnswer": "周期",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_1_1_tsu",
        "label": "（ツ）",
        "type": "short_answer",
        "correctAnswer": "アルカリ",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_1_1_te",
        "label": "（テ）",
        "type": "short_answer",
        "correctAnswer": "ハロゲン",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_1_1_to",
        "label": "（ト）",
        "type": "short_answer",
        "correctAnswer": "貴ガス",
        "correctAnswerRate": 85
      }
    ],
    "explanation": "▼ 解答・解説\n（ア）原子核 （イ）電子 （ウ）陽子 （エ）中性子 （オ）10⁻¹⁰ （カ）1万〜10万\n（キ）原子番号 （ク）質量数 （ケ）同位体 （コ）電子殻 （サ）2n²\n（シ）最外殻電子 （ス）価電子 （セ）族番号 （ソ）貴ガス （タ）族 （チ）周期\n（ツ）アルカリ （テ）ハロゲン （ト）貴ガス（希ガスも正答ですが、本設問は共通呼称の「貴ガス」を基本にしています）",
    "surroundingKnowledge": [],
    "deepDiveTopics": []
  },
  {
    "id": "q_c2_1_2",
    "category": "原子の構造と電子配置・元素の周期表 (問2)",
    "text": "【問2】 （基礎）次の原子について、(a)陽子数、(b)中性子数、(c)電子数、(d)質量数 を答えよ（中性原子とする）。\n\n(1) ¹H  (2) ¹²C  (3) ¹⁶O  (4) ²³Na  (5) ³⁵Cl  (6) ⁴⁰Ar",
    "subQuestions": [
      {
        "id": "q_c2_1_2_1a",
        "label": "(1) ¹H (a)陽子数",
        "type": "short_answer",
        "correctAnswer": "1",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_1_2_1b",
        "label": "(1) ¹H (b)中性子数",
        "type": "short_answer",
        "correctAnswer": "0",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_1_2_1c",
        "label": "(1) ¹H (c)電子数",
        "type": "short_answer",
        "correctAnswer": "1",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_1_2_1d",
        "label": "(1) ¹H (d)質量数",
        "type": "short_answer",
        "correctAnswer": "1",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_1_2_2a",
        "label": "(2) ¹²C (a)陽子数",
        "type": "short_answer",
        "correctAnswer": "6",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_1_2_2b",
        "label": "(2) ¹²C (b)中性子数",
        "type": "short_answer",
        "correctAnswer": "6",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_1_2_2c",
        "label": "(2) ¹²C (c)電子数",
        "type": "short_answer",
        "correctAnswer": "6",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_1_2_2d",
        "label": "(2) ¹²C (d)質量数",
        "type": "short_answer",
        "correctAnswer": "12",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_1_2_3a",
        "label": "(3) ¹⁶O (a)陽子数",
        "type": "short_answer",
        "correctAnswer": "8",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_1_2_3b",
        "label": "(3) ¹⁶O (b)中性子数",
        "type": "short_answer",
        "correctAnswer": "8",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_1_2_3c",
        "label": "(3) ¹⁶O (c)電子数",
        "type": "short_answer",
        "correctAnswer": "8",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_1_2_3d",
        "label": "(3) ¹⁶O (d)質量数",
        "type": "short_answer",
        "correctAnswer": "16",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_1_2_4a",
        "label": "(4) ²³Na (a)陽子数",
        "type": "short_answer",
        "correctAnswer": "11",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_1_2_4b",
        "label": "(4) ²³Na (b)中性子数",
        "type": "short_answer",
        "correctAnswer": "12",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_1_2_4c",
        "label": "(4) ²³Na (c)電子数",
        "type": "short_answer",
        "correctAnswer": "11",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_1_2_4d",
        "label": "(4) ²³Na (d)質量数",
        "type": "short_answer",
        "correctAnswer": "23",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_1_2_5a",
        "label": "(5) ³⁵Cl (a)陽子数",
        "type": "short_answer",
        "correctAnswer": "17",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_1_2_5b",
        "label": "(5) ³⁵Cl (b)中性子数",
        "type": "short_answer",
        "correctAnswer": "18",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_1_2_5c",
        "label": "(5) ³⁵Cl (c)電子数",
        "type": "short_answer",
        "correctAnswer": "17",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_1_2_5d",
        "label": "(5) ³⁵Cl (d)質量数",
        "type": "short_answer",
        "correctAnswer": "35",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_1_2_6a",
        "label": "(6) ⁴⁰Ar (a)陽子数",
        "type": "short_answer",
        "correctAnswer": "18",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_1_2_6b",
        "label": "(6) ⁴⁰Ar (b)中性子数",
        "type": "short_answer",
        "correctAnswer": "22",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_1_2_6c",
        "label": "(6) ⁴⁰Ar (c)電子数",
        "type": "short_answer",
        "correctAnswer": "18",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_1_2_6d",
        "label": "(6) ⁴⁰Ar (d)質量数",
        "type": "short_answer",
        "correctAnswer": "40",
        "correctAnswerRate": 85
      }
    ],
    "explanation": "▼ 解答・解説\n(1) ¹H ：(a)1 (b)0 (c)1 (d)1\n(2) ¹²C：(a)6 (b)6 (c)6 (d)12\n(3) ¹⁶O：(a)8 (b)8 (c)8 (d)16\n(4) ²³Na：(a)11 (b)12 (c)11 (d)23\n(5) ³⁵Cl：(a)17 (b)18 (c)17 (d)35\n(6) ⁴⁰Ar：(a)18 (b)22 (c)18 (d)40\n\n■ 中性子数 = 質量数 − 陽子数。 中性原子なら 電子数 = 陽子数。",
    "surroundingKnowledge": [],
    "deepDiveTopics": []
  },
  {
    "id": "q_c2_1_3",
    "category": "原子の構造と電子配置・元素の周期表 (問3)",
    "text": "【問3】 （基礎）次の原子の電子配置を K, L, M, N 殻の電子数で表せ（例：Na → K2 L8 M1）。\n\n(1) He  (2) C  (3) O  (4) F  (5) Ne  (6) Mg  (7) Cl  (8) K  (9) Ca",
    "subQuestions": [
      {
        "id": "q_c2_1_3_1",
        "label": "(1) He",
        "type": "short_answer",
        "correctAnswer": "K2",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_1_3_2",
        "label": "(2) C",
        "type": "short_answer",
        "correctAnswer": "K2 L4",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_1_3_3",
        "label": "(3) O",
        "type": "short_answer",
        "correctAnswer": "K2 L6",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_1_3_4",
        "label": "(4) F",
        "type": "short_answer",
        "correctAnswer": "K2 L7",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_1_3_5",
        "label": "(5) Ne",
        "type": "short_answer",
        "correctAnswer": "K2 L8",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_1_3_6",
        "label": "(6) Mg",
        "type": "short_answer",
        "correctAnswer": "K2 L8 M2",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_1_3_7",
        "label": "(7) Cl",
        "type": "short_answer",
        "correctAnswer": "K2 L8 M7",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_1_3_8",
        "label": "(8) K",
        "type": "short_answer",
        "correctAnswer": "K2 L8 M8 N1",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_1_3_9",
        "label": "(9) Ca",
        "type": "short_answer",
        "correctAnswer": "K2 L8 M8 N2",
        "correctAnswerRate": 85
      }
    ],
    "explanation": "▼ 解答・解説\n(1) He：K2\n(2) C：K2 L4\n(3) O：K2 L6\n(4) F：K2 L7\n(5) Ne：K2 L8\n(6) Mg：K2 L8 M2\n(7) Cl：K2 L8 M7\n(8) K：K2 L8 M8 N1\n(9) Ca：K2 L8 M8 N2\n\n■ K殻最大2, L殻最大8, M殻最大18個。KとLが詰まったら次はM。\nただしM殻は8個までで一旦止まりN殻に入る（K, Ca で M=8 のまま N に1, 2 個入る点に注意）。",
    "surroundingKnowledge": [],
    "deepDiveTopics": []
  },
  {
    "id": "q_c2_1_4",
    "category": "原子の構造と電子配置・元素の周期表 (問4)",
    "text": "【問4】 （標準）次の問いに答えよ。\n\n(1) 価電子の数が等しい元素は周期表でどの位置関係にあるか。\n(2) 第3周期で価電子数が 0 の元素を答えよ。\n(3) ¹²C と ¹³C, ¹⁴C の関係を何というか。化学的性質はどうなるか述べよ。\n(4) 典型元素と遷移元素の違いを、価電子数の変化に着目して説明せよ。",
    "subQuestions": [
      {
        "id": "q_c2_1_4_1",
        "label": "(1) 位置関係",
        "type": "short_answer",
        "correctAnswer": "同じ族",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_1_4_2",
        "label": "(2) 元素名称（カタカナ）",
        "type": "short_answer",
        "correctAnswer": "アルゴン",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_1_4_3a",
        "label": "(3) 関係名",
        "type": "short_answer",
        "correctAnswer": "同位体",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_1_4_3b",
        "label": "(3) 化学的性質",
        "type": "short_answer",
        "correctAnswer": "ほぼ同じ",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_1_4_4",
        "label": "(4) 価電子数に着目した説明",
        "type": "descriptive",
        "correctAnswer": "典型元素は族番号によって価電子数が規則的に変化（1族→1, 2族→2...）するのに対し、遷移元素は原子番号が変わっても価電子数がほぼ1または2で同じである。",
        "correctAnswerRate": 85
      }
    ],
    "explanation": "▼ 解答・解説\n(1) 同じ族（同じ縦の列）にある。\n(2) アルゴン Ar（貴ガス、価電子数 0）。\n(3) 互いに同位体（アイソトープ）の関係。陽子数は同じで中性子数が異なる。電子配置が同じため化学的性質はほぼ同じ（質量に依存する物理的性質はわずかに異なる）。\n(4) 典型元素は族番号によって価電子数が規則的に変化する（1族→1, 2族→2, 13族→3, …, 17族→7, 18族→0）。\n遷移元素（3〜12族）は原子番号が変わっても価電子数がほぼ 1 or 2 で同じ（内殻に入るため）。隣接元素どうしの性質が似る。",
    "surroundingKnowledge": [],
    "deepDiveTopics": []
  },
  {
    "id": "q_c2_1_5",
    "category": "原子の構造と電子配置・元素の周期表 (問5)",
    "text": "【問5】 （文字式・文章題）電子殻 n=1, 2, 3, 4 にそれぞれ収容できる電子の最大数を文字式 2n² で計算し、合計が 60 個になるためには何殻まで満たす必要があるかを示せ。",
    "subQuestions": [
      {
        "id": "q_c2_1_5_1",
        "label": "n=1(K殻)最大数",
        "type": "short_answer",
        "correctAnswer": "2",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_1_5_2",
        "label": "n=2(L殻)最大数",
        "type": "short_answer",
        "correctAnswer": "8",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_1_5_3",
        "label": "n=3(M殻)最大数",
        "type": "short_answer",
        "correctAnswer": "18",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_1_5_4",
        "label": "n=4(N殻)最大数",
        "type": "short_answer",
        "correctAnswer": "32",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_1_5_ans",
        "label": "何殻まで満たす必要があるか",
        "type": "short_answer",
        "correctAnswer": "N殻",
        "correctAnswerRate": 85
      }
    ],
    "explanation": "▼ 解答・解説\nn=1: 2·1² = 2 個 (K殻)\nn=2: 2·2² = 8 個 (L殻)\nn=3: 2·3² = 18 個 (M殻)\nn=4: 2·4² = 32 個 (N殻)\n合計：2+8+18+32 = 60 個 → N殻まで全部満たすと 60 個。",
    "surroundingKnowledge": [],
    "deepDiveTopics": []
  },
  {
    "id": "q_c2_1_6",
    "category": "原子の構造と電子配置・元素の周期表 (問6)",
    "text": "【問6】 （共通テスト風応用）下の周期表の位置から、A〜Fの元素の(1)価電子数、(2)単体が金属か非金属かを答えよ。\n\nA：第3周期1族  B：第2周期16族  C：第3周期17族  D：第4周期2族  E：第2周期14族  F：第3周期18族",
    "subQuestions": [
      {
        "id": "q_c2_1_6_a1",
        "label": "A (1)価電子数",
        "type": "short_answer",
        "correctAnswer": "1",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_1_6_a2",
        "label": "A (2)単体分類",
        "type": "multiple_choice",
        "options": [
          "金属",
          "非金属"
        ],
        "correctAnswer": "金属",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_1_6_b1",
        "label": "B (1)価電子数",
        "type": "short_answer",
        "correctAnswer": "6",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_1_6_b2",
        "label": "B (2)単体分類",
        "type": "multiple_choice",
        "options": [
          "金属",
          "非金属"
        ],
        "correctAnswer": "非金属",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_1_6_c1",
        "label": "C (1)価電子数",
        "type": "short_answer",
        "correctAnswer": "7",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_1_6_c2",
        "label": "C (2)単体分類",
        "type": "multiple_choice",
        "options": [
          "金属",
          "非金属"
        ],
        "correctAnswer": "非金属",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_1_6_d1",
        "label": "D (1)価電子数",
        "type": "short_answer",
        "correctAnswer": "2",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_1_6_d2",
        "label": "D (2)単体分類",
        "type": "multiple_choice",
        "options": [
          "金属",
          "非金属"
        ],
        "correctAnswer": "金属",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_1_6_e1",
        "label": "E (1)価電子数",
        "type": "short_answer",
        "correctAnswer": "4",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_1_6_e2",
        "label": "E (2)単体分類",
        "type": "multiple_choice",
        "options": [
          "金属",
          "非金属"
        ],
        "correctAnswer": "非金属",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_1_6_f1",
        "label": "F (1)価電子数",
        "type": "short_answer",
        "correctAnswer": "0",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_1_6_f2",
        "label": "F (2)単体分類",
        "type": "multiple_choice",
        "options": [
          "金属",
          "非金属"
        ],
        "correctAnswer": "非金属",
        "correctAnswerRate": 85
      }
    ],
    "explanation": "▼ 解答・解説\nA(Na)：(1) 1 (2) 金属 (3) Li, K など（1族）\nB(O) ：(1) 6 (2) 非金属 (3) S, Se（16族）\nC(Cl)：(1) 7 (2) 非金属 (3) F, Br, I（17族）\nD(Ca)：(1) 2 (2) 金属 (3) Mg, Be, Sr（2族）\nE(C) ：(1) 4 (2) 非金属 (3) Si, Ge（14族）\nF(Ar)：(1) 0 (2) 非金属（貴ガス、単原子分子） (3) Ne, Kr（18族）",
    "surroundingKnowledge": [],
    "deepDiveTopics": []
  },
  {
    "id": "q_c2_1_7",
    "category": "原子の構造と電子配置・元素の周期表 (問7)",
    "text": "【問7】 （共通テスト風応用）ある原子Xは、陽子数が中性子数の3/4倍であり、質量数が28である。次の問いに答えよ。\n\n(1) 陽子数と中性子数を求めよ。\n(2) この原子の元素記号を答えよ。\n(3) この原子の電子配置を答えよ（例：K2 L8 M2）。",
    "subQuestions": [
      {
        "id": "q_c2_1_7_1p",
        "label": "(1) 陽子数",
        "type": "short_answer",
        "correctAnswer": "12",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_1_7_1n",
        "label": "(1) 中性子数",
        "type": "short_answer",
        "correctAnswer": "16",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_1_7_2",
        "label": "(2) 元素記号",
        "type": "short_answer",
        "correctAnswer": "Mg",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_1_7_3",
        "label": "(3) 電子配置",
        "type": "short_answer",
        "correctAnswer": "K2 L8 M2",
        "correctAnswerRate": 85
      }
    ],
    "explanation": "▼ 解答・解説\n(1) 陽子数を p, 中性子数を n とおくと、p = (3/4)n かつ p+n = 28.\n(3/4)n + n = 28 → (7/4)n = 28 → n = 16, p = 12.\n陽子数は12、中性子数は16となります。\n(2) 陽子数12なので、原子番号12のマグネシウム Mg です（※実在性より計算結果を優先。²⁸Mgは存在する放射性同位体であるため²⁸Mgとなります）。\n(3) 電子数＝陽子数=12より、電子配置は K2 L8 M2 となります。",
    "surroundingKnowledge": [],
    "deepDiveTopics": []
  }
];

/** c2_1 のミニテスト。chemistryData.ts の "miniTest" にそのまま入る。 */
export const c2_1_MiniTest = [
  {
    "id": "q_c2_1_1",
    "category": "原子の構造と電子配置・元素の周期表 (問1)",
    "text": "【問1】 次の文章の空欄（ア）〜（ト）に適する語句・数値・記号を答えよ。（語句網羅）\n\n原子は中心にある（ア）と、そのまわりを運動する（イ）からなる。（ア）は（ウ）と（エ）から構成されている。原子の直径は約（オ）m、（ア）の直径はその約（カ）分の1である。（ウ）の数を（キ）といい、これは元素ごとに決まっている。（キ）と（エ）の数の和を（ク）という。（キ）が等しく（ク）が異なる原子どうしを互いに（ケ）（アイソトープ）という。電子は（コ）とよばれる空間に存在し、（ア）に近い方から K, L, M, N, …殻 と名づけられている。n 番目の電子殻に収容できる電子の最大数は（サ）個で表される。最も外側の電子殻にある電子を（シ）といい、化学的性質を主に決める電子を（ス）という。（ス）の数は典型元素で（セ）の一の位と一致するが、（ソ）（18族）では 0 とみなす。周期表で縦の列を（タ）、横の行を（チ）という。1族のうちH以外を（ツ）金属、2族をアルカリ土類金属、17族を（テ）、18族を（ト）という。",
    "subQuestions": [
      {
        "id": "q_c2_1_1_a",
        "label": "（ア）",
        "type": "short_answer",
        "correctAnswer": "原子核",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_1_1_i",
        "label": "（イ）",
        "type": "short_answer",
        "correctAnswer": "電子",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_1_1_u",
        "label": "（ウ）",
        "type": "short_answer",
        "correctAnswer": "陽子",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_1_1_e",
        "label": "（エ）",
        "type": "short_answer",
        "correctAnswer": "中性子",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_1_1_o",
        "label": "（オ） ※10⁻¹⁰ と入力",
        "type": "short_answer",
        "correctAnswer": "10⁻¹⁰",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_1_1_ka",
        "label": "（カ）",
        "type": "short_answer",
        "correctAnswer": "1万〜10万",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_1_1_ki",
        "label": "（キ）",
        "type": "short_answer",
        "correctAnswer": "原子番号",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_1_1_ku",
        "label": "（ク）",
        "type": "short_answer",
        "correctAnswer": "質量数",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_1_1_ke",
        "label": "（ケ）",
        "type": "short_answer",
        "correctAnswer": "同位体",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_1_1_ko",
        "label": "（コ）",
        "type": "short_answer",
        "correctAnswer": "電子殻",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_1_1_sa",
        "label": "（サ） ※2n² と入力",
        "type": "short_answer",
        "correctAnswer": "2n²",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_1_1_shi",
        "label": "（シ）",
        "type": "short_answer",
        "correctAnswer": "最外殻電子",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_1_1_su",
        "label": "（ス）",
        "type": "short_answer",
        "correctAnswer": "価電子",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_1_1_se",
        "label": "（セ）",
        "type": "short_answer",
        "correctAnswer": "族番号",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_1_1_so",
        "label": "（ソ）",
        "type": "short_answer",
        "correctAnswer": "貴ガス",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_1_1_ta",
        "label": "（タ）",
        "type": "short_answer",
        "correctAnswer": "族",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_1_1_chi",
        "label": "（チ）",
        "type": "short_answer",
        "correctAnswer": "周期",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_1_1_tsu",
        "label": "（ツ）",
        "type": "short_answer",
        "correctAnswer": "アルカリ",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_1_1_te",
        "label": "（テ）",
        "type": "short_answer",
        "correctAnswer": "ハロゲン",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_1_1_to",
        "label": "（ト）",
        "type": "short_answer",
        "correctAnswer": "貴ガス",
        "correctAnswerRate": 85
      }
    ],
    "explanation": "▼ 解答・解説\n（ア）原子核 （イ）電子 （ウ）陽子 （エ）中性子 （オ）10⁻¹⁰ （カ）1万〜10万\n（キ）原子番号 （ク）質量数 （ケ）同位体 （コ）電子殻 （サ）2n²\n（シ）最外殻電子 （ス）価電子 （セ）族番号 （ソ）貴ガス （タ）族 （チ）周期\n（ツ）アルカリ （テ）ハロゲン （ト）貴ガス（希ガスも正答ですが、本設問は共通呼称の「貴ガス」を基本にしています）",
    "surroundingKnowledge": [],
    "deepDiveTopics": []
  },
  {
    "id": "q_c2_1_2",
    "category": "原子の構造と電子配置・元素の周期表 (問2)",
    "text": "【問2】 （基礎）次の原子について、(a)陽子数、(b)中性子数、(c)電子数、(d)質量数 を答えよ（中性原子とする）。\n\n(1) ¹H  (2) ¹²C  (3) ¹⁶O  (4) ²³Na  (5) ³⁵Cl  (6) ⁴⁰Ar",
    "subQuestions": [
      {
        "id": "q_c2_1_2_1a",
        "label": "(1) ¹H (a)陽子数",
        "type": "short_answer",
        "correctAnswer": "1",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_1_2_1b",
        "label": "(1) ¹H (b)中性子数",
        "type": "short_answer",
        "correctAnswer": "0",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_1_2_1c",
        "label": "(1) ¹H (c)電子数",
        "type": "short_answer",
        "correctAnswer": "1",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_1_2_1d",
        "label": "(1) ¹H (d)質量数",
        "type": "short_answer",
        "correctAnswer": "1",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_1_2_2a",
        "label": "(2) ¹²C (a)陽子数",
        "type": "short_answer",
        "correctAnswer": "6",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_1_2_2b",
        "label": "(2) ¹²C (b)中性子数",
        "type": "short_answer",
        "correctAnswer": "6",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_1_2_2c",
        "label": "(2) ¹²C (c)電子数",
        "type": "short_answer",
        "correctAnswer": "6",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_1_2_2d",
        "label": "(2) ¹²C (d)質量数",
        "type": "short_answer",
        "correctAnswer": "12",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_1_2_3a",
        "label": "(3) ¹⁶O (a)陽子数",
        "type": "short_answer",
        "correctAnswer": "8",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_1_2_3b",
        "label": "(3) ¹⁶O (b)中性子数",
        "type": "short_answer",
        "correctAnswer": "8",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_1_2_3c",
        "label": "(3) ¹⁶O (c)電子数",
        "type": "short_answer",
        "correctAnswer": "8",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_1_2_3d",
        "label": "(3) ¹⁶O (d)質量数",
        "type": "short_answer",
        "correctAnswer": "16",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_1_2_4a",
        "label": "(4) ²³Na (a)陽子数",
        "type": "short_answer",
        "correctAnswer": "11",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_1_2_4b",
        "label": "(4) ²³Na (b)中性子数",
        "type": "short_answer",
        "correctAnswer": "12",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_1_2_4c",
        "label": "(4) ²³Na (c)電子数",
        "type": "short_answer",
        "correctAnswer": "11",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_1_2_4d",
        "label": "(4) ²³Na (d)質量数",
        "type": "short_answer",
        "correctAnswer": "23",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_1_2_5a",
        "label": "(5) ³⁵Cl (a)陽子数",
        "type": "short_answer",
        "correctAnswer": "17",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_1_2_5b",
        "label": "(5) ³⁵Cl (b)中性子数",
        "type": "short_answer",
        "correctAnswer": "18",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_1_2_5c",
        "label": "(5) ³⁵Cl (c)電子数",
        "type": "short_answer",
        "correctAnswer": "17",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_1_2_5d",
        "label": "(5) ³⁵Cl (d)質量数",
        "type": "short_answer",
        "correctAnswer": "35",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_1_2_6a",
        "label": "(6) ⁴⁰Ar (a)陽子数",
        "type": "short_answer",
        "correctAnswer": "18",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_1_2_6b",
        "label": "(6) ⁴⁰Ar (b)中性子数",
        "type": "short_answer",
        "correctAnswer": "22",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_1_2_6c",
        "label": "(6) ⁴⁰Ar (c)電子数",
        "type": "short_answer",
        "correctAnswer": "18",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_1_2_6d",
        "label": "(6) ⁴⁰Ar (d)質量数",
        "type": "short_answer",
        "correctAnswer": "40",
        "correctAnswerRate": 85
      }
    ],
    "explanation": "▼ 解答・解説\n(1) ¹H ：(a)1 (b)0 (c)1 (d)1\n(2) ¹²C：(a)6 (b)6 (c)6 (d)12\n(3) ¹⁶O：(a)8 (b)8 (c)8 (d)16\n(4) ²³Na：(a)11 (b)12 (c)11 (d)23\n(5) ³⁵Cl：(a)17 (b)18 (c)17 (d)35\n(6) ⁴⁰Ar：(a)18 (b)22 (c)18 (d)40\n\n■ 中性子数 = 質量数 − 陽子数。 中性原子なら 電子数 = 陽子数。",
    "surroundingKnowledge": [],
    "deepDiveTopics": []
  },
  {
    "id": "q_c2_1_3",
    "category": "原子の構造と電子配置・元素の周期表 (問3)",
    "text": "【問3】 （基礎）次の原子の電子配置を K, L, M, N 殻の電子数で表せ（例：Na → K2 L8 M1）。\n\n(1) He  (2) C  (3) O  (4) F  (5) Ne  (6) Mg  (7) Cl  (8) K  (9) Ca",
    "subQuestions": [
      {
        "id": "q_c2_1_3_1",
        "label": "(1) He",
        "type": "short_answer",
        "correctAnswer": "K2",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_1_3_2",
        "label": "(2) C",
        "type": "short_answer",
        "correctAnswer": "K2 L4",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_1_3_3",
        "label": "(3) O",
        "type": "short_answer",
        "correctAnswer": "K2 L6",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_1_3_4",
        "label": "(4) F",
        "type": "short_answer",
        "correctAnswer": "K2 L7",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_1_3_5",
        "label": "(5) Ne",
        "type": "short_answer",
        "correctAnswer": "K2 L8",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_1_3_6",
        "label": "(6) Mg",
        "type": "short_answer",
        "correctAnswer": "K2 L8 M2",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_1_3_7",
        "label": "(7) Cl",
        "type": "short_answer",
        "correctAnswer": "K2 L8 M7",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_1_3_8",
        "label": "(8) K",
        "type": "short_answer",
        "correctAnswer": "K2 L8 M8 N1",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_1_3_9",
        "label": "(9) Ca",
        "type": "short_answer",
        "correctAnswer": "K2 L8 M8 N2",
        "correctAnswerRate": 85
      }
    ],
    "explanation": "▼ 解答・解説\n(1) He：K2\n(2) C：K2 L4\n(3) O：K2 L6\n(4) F：K2 L7\n(5) Ne：K2 L8\n(6) Mg：K2 L8 M2\n(7) Cl：K2 L8 M7\n(8) K：K2 L8 M8 N1\n(9) Ca：K2 L8 M8 N2\n\n■ K殻最大2, L殻最大8, M殻最大18個。KとLが詰まったら次はM。\nただしM殻は8個までで一旦止まりN殻に入る（K, Ca で M=8 のまま N に1, 2 個入る点に注意）。",
    "surroundingKnowledge": [],
    "deepDiveTopics": []
  },
  {
    "id": "q_c2_1_4",
    "category": "原子の構造と電子配置・元素の周期表 (問4)",
    "text": "【問4】 （標準）次の問いに答えよ。\n\n(1) 価電子の数が等しい元素は周期表でどの位置関係にあるか。\n(2) 第3周期で価電子数が 0 の元素を答えよ。\n(3) ¹²C と ¹³C, ¹⁴C の関係を何というか。化学的性質はどうなるか述べよ。\n(4) 典型元素と遷移元素の違いを、価電子数の変化に着目して説明せよ。",
    "subQuestions": [
      {
        "id": "q_c2_1_4_1",
        "label": "(1) 位置関係",
        "type": "short_answer",
        "correctAnswer": "同じ族",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_1_4_2",
        "label": "(2) 元素名称（カタカナ）",
        "type": "short_answer",
        "correctAnswer": "アルゴン",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_1_4_3a",
        "label": "(3) 関係名",
        "type": "short_answer",
        "correctAnswer": "同位体",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_1_4_3b",
        "label": "(3) 化学的性質",
        "type": "short_answer",
        "correctAnswer": "ほぼ同じ",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_1_4_4",
        "label": "(4) 価電子数に着目した説明",
        "type": "descriptive",
        "correctAnswer": "典型元素は族番号によって価電子数が規則的に変化（1族→1, 2族→2...）するのに対し、遷移元素は原子番号が変わっても価電子数がほぼ1または2で同じである。",
        "correctAnswerRate": 85
      }
    ],
    "explanation": "▼ 解答・解説\n(1) 同じ族（同じ縦の列）にある。\n(2) アルゴン Ar（貴ガス、価電子数 0）。\n(3) 互いに同位体（アイソトープ）の関係。陽子数は同じで中性子数が異なる。電子配置が同じため化学的性質はほぼ同じ（質量に依存する物理的性質はわずかに異なる）。\n(4) 典型元素は族番号によって価電子数が規則的に変化する（1族→1, 2族→2, 13族→3, …, 17族→7, 18族→0）。\n遷移元素（3〜12族）は原子番号が変わっても価電子数がほぼ 1 or 2 で同じ（内殻に入るため）。隣接元素どうしの性質が似る。",
    "surroundingKnowledge": [],
    "deepDiveTopics": []
  },
  {
    "id": "q_c2_1_5",
    "category": "原子の構造と電子配置・元素の周期表 (問5)",
    "text": "【問5】 （文字式・文章題）電子殻 n=1, 2, 3, 4 にそれぞれ収容できる電子の最大数を文字式 2n² で計算し、合計が 60 個になるためには何殻まで満たす必要があるかを示せ。",
    "subQuestions": [
      {
        "id": "q_c2_1_5_1",
        "label": "n=1(K殻)最大数",
        "type": "short_answer",
        "correctAnswer": "2",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_1_5_2",
        "label": "n=2(L殻)最大数",
        "type": "short_answer",
        "correctAnswer": "8",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_1_5_3",
        "label": "n=3(M殻)最大数",
        "type": "short_answer",
        "correctAnswer": "18",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_1_5_4",
        "label": "n=4(N殻)最大数",
        "type": "short_answer",
        "correctAnswer": "32",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_1_5_ans",
        "label": "何殻まで満たす必要があるか",
        "type": "short_answer",
        "correctAnswer": "N殻",
        "correctAnswerRate": 85
      }
    ],
    "explanation": "▼ 解答・解説\nn=1: 2·1² = 2 個 (K殻)\nn=2: 2·2² = 8 個 (L殻)\nn=3: 2·3² = 18 個 (M殻)\nn=4: 2·4² = 32 個 (N殻)\n合計：2+8+18+32 = 60 個 → N殻まで全部満たすと 60 個。",
    "surroundingKnowledge": [],
    "deepDiveTopics": []
  },
  {
    "id": "q_c2_1_6",
    "category": "原子の構造と電子配置・元素の周期表 (問6)",
    "text": "【問6】 （共通テスト風応用）下の周期表の位置から、A〜Fの元素の(1)価電子数、(2)単体が金属か非金属かを答えよ。\n\nA：第3周期1族  B：第2周期16族  C：第3周期17族  D：第4周期2族  E：第2周期14族  F：第3周期18族",
    "subQuestions": [
      {
        "id": "q_c2_1_6_a1",
        "label": "A (1)価電子数",
        "type": "short_answer",
        "correctAnswer": "1",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_1_6_a2",
        "label": "A (2)単体分類",
        "type": "multiple_choice",
        "options": [
          "金属",
          "非金属"
        ],
        "correctAnswer": "金属",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_1_6_b1",
        "label": "B (1)価電子数",
        "type": "short_answer",
        "correctAnswer": "6",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_1_6_b2",
        "label": "B (2)単体分類",
        "type": "multiple_choice",
        "options": [
          "金属",
          "非金属"
        ],
        "correctAnswer": "非金属",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_1_6_c1",
        "label": "C (1)価電子数",
        "type": "short_answer",
        "correctAnswer": "7",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_1_6_c2",
        "label": "C (2)単体分類",
        "type": "multiple_choice",
        "options": [
          "金属",
          "非金属"
        ],
        "correctAnswer": "非金属",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_1_6_d1",
        "label": "D (1)価電子数",
        "type": "short_answer",
        "correctAnswer": "2",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_1_6_d2",
        "label": "D (2)単体分類",
        "type": "multiple_choice",
        "options": [
          "金属",
          "非金属"
        ],
        "correctAnswer": "金属",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_1_6_e1",
        "label": "E (1)価電子数",
        "type": "short_answer",
        "correctAnswer": "4",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_1_6_e2",
        "label": "E (2)単体分類",
        "type": "multiple_choice",
        "options": [
          "金属",
          "非金属"
        ],
        "correctAnswer": "非金属",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_1_6_f1",
        "label": "F (1)価電子数",
        "type": "short_answer",
        "correctAnswer": "0",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_1_6_f2",
        "label": "F (2)単体分類",
        "type": "multiple_choice",
        "options": [
          "金属",
          "非金属"
        ],
        "correctAnswer": "非金属",
        "correctAnswerRate": 85
      }
    ],
    "explanation": "▼ 解答・解説\nA(Na)：(1) 1 (2) 金属 (3) Li, K など（1族）\nB(O) ：(1) 6 (2) 非金属 (3) S, Se（16族）\nC(Cl)：(1) 7 (2) 非金属 (3) F, Br, I（17族）\nD(Ca)：(1) 2 (2) 金属 (3) Mg, Be, Sr（2族）\nE(C) ：(1) 4 (2) 非金属 (3) Si, Ge（14族）\nF(Ar)：(1) 0 (2) 非金属（貴ガス、単原子分子） (3) Ne, Kr（18族）",
    "surroundingKnowledge": [],
    "deepDiveTopics": []
  },
  {
    "id": "q_c2_1_7",
    "category": "原子の構造と電子配置・元素の周期表 (問7)",
    "text": "【問7】 （共通テスト風応用）ある原子Xは、陽子数が中性子数の3/4倍であり、質量数が28である。次の問いに答えよ。\n\n(1) 陽子数と中性子数を求めよ。\n(2) この原子の元素記号を答えよ。\n(3) この原子の電子配置を答えよ（例：K2 L8 M2）。",
    "subQuestions": [
      {
        "id": "q_c2_1_7_1p",
        "label": "(1) 陽子数",
        "type": "short_answer",
        "correctAnswer": "12",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_1_7_1n",
        "label": "(1) 中性子数",
        "type": "short_answer",
        "correctAnswer": "16",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_1_7_2",
        "label": "(2) 元素記号",
        "type": "short_answer",
        "correctAnswer": "Mg",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_1_7_3",
        "label": "(3) 電子配置",
        "type": "short_answer",
        "correctAnswer": "K2 L8 M2",
        "correctAnswerRate": 85
      }
    ],
    "explanation": "▼ 解答・解説\n(1) 陽子数を p, 中性子数を n とおくと、p = (3/4)n かつ p+n = 28.\n(3/4)n + n = 28 → (7/4)n = 28 → n = 16, p = 12.\n陽子数は12、中性子数は16となります。\n(2) 陽子数12なので、原子番号12のマグネシウム Mg です（※実在性より計算結果を優先。²⁸Mgは存在する放射性同位体であるため²⁸Mgとなります）。\n(3) 電子数＝陽子数=12より、電子配置は K2 L8 M2 となります。",
    "surroundingKnowledge": [],
    "deepDiveTopics": []
  }
];

/** c2_2 の演習問題。chemistryData.ts の "practiceProblems" にそのまま入る。 */
export const c2_2_Practice = [
  {
    "id": "q_c2_2_1",
    "category": "イオン (問1)",
    "text": "【問1】 次の文章の空欄（ア）〜（ス）に適する語句・記号を答えよ。（語句網羅）\n\n原子が電子を失ったり受け取ったりして電気を帯びた粒子を（ア）という。正の電荷を帯びたものを（イ）、負の電荷を帯びたものを（ウ）という。1つの原子からなるものを（エ）イオン、2つ以上の原子のかたまりからなるものを（オ）イオンという。イオンの右肩につける数字を（カ）といい、価電子の授受の数を示す。原子は通常、最も近い貴ガス（希ガス）と同じ（キ）になるようにイオンになる。1族のNaはNa（ク）に、2族のCaはCa（ケ）に、17族のClはCl（コ）に、16族のOはO（サ）になる。代表的な多原子イオンには、NH₄（シ）、OH（ス）、NO₃⁻、SO₄²⁻、CO₃²⁻、PO₄³⁻などがある。",
    "subQuestions": [
      {
        "id": "q_c2_2_1_a",
        "label": "（ア）",
        "type": "short_answer",
        "correctAnswer": "イオン",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_2_1_i",
        "label": "（イ）",
        "type": "short_answer",
        "correctAnswer": "陽イオン",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_2_1_u",
        "label": "（ウ）",
        "type": "short_answer",
        "correctAnswer": "陰イオン",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_2_1_e",
        "label": "（エ）",
        "type": "short_answer",
        "correctAnswer": "単原子",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_2_1_o",
        "label": "（オ）",
        "type": "short_answer",
        "correctAnswer": "多原子",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_2_1_ka",
        "label": "（カ）",
        "type": "short_answer",
        "correctAnswer": "価数",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_2_1_ki",
        "label": "（キ）",
        "type": "short_answer",
        "correctAnswer": "電子配置",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_2_1_ku",
        "label": "（ク） ※半角または上付きの⁺ を入力",
        "type": "short_answer",
        "correctAnswer": "⁺",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_2_1_ke",
        "label": "（ケ） ※半角または上付きの²⁺ を入力",
        "type": "short_answer",
        "correctAnswer": "²⁺",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_2_1_ko",
        "label": "（コ） ※半角または上付きの⁻ を入力",
        "type": "short_answer",
        "correctAnswer": "⁻",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_2_1_sa",
        "label": "（サ） ※半角または上付きの²⁻ を入力",
        "type": "short_answer",
        "correctAnswer": "²⁻",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_2_1_shi",
        "label": "（シ） ※半角または上付きの⁺ を入力",
        "type": "short_answer",
        "correctAnswer": "⁺",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_2_1_su",
        "label": "（ス） ※半角または上付きの⁻ を入力",
        "type": "short_answer",
        "correctAnswer": "⁻",
        "correctAnswerRate": 85
      }
    ],
    "explanation": "▼ 解答・解説\n（ア）イオン （イ）陽イオン （ウ）陰イオン （エ）単原子 （オ）多原子\n（カ）価数 （キ）電子配置 （ク）⁺ （ケ）²⁺ （コ）⁻ （サ）²⁻\n（シ）⁺ （ス）⁻\n\n■ Na⁺(11→10 電子=Ne 型), Ca²⁺(20→18=Ar 型), Cl⁻(17→18=Ar 型), O²⁻(8→10=Ne 型).",
    "surroundingKnowledge": [],
    "deepDiveTopics": []
  },
  {
    "id": "q_c2_2_2",
    "category": "イオン (問2)",
    "text": "【問2】 （基礎）次のイオンの化学式と名称を答えよ。（上付き・下付き文字は右記をコピーしてご使用ください：⁺ , ⁻ , ²⁺ , ²⁻ , ³⁺ , ⁻ , ₄）",
    "subQuestions": [
      {
        "id": "q_c2_2_2_1",
        "label": "(1) ナトリウムイオン",
        "type": "short_answer",
        "correctAnswer": "Na⁺",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_2_2_2",
        "label": "(2) マグネシウムイオン",
        "type": "short_answer",
        "correctAnswer": "Mg²⁺",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_2_2_3",
        "label": "(3) アルミニウムイオン",
        "type": "short_answer",
        "correctAnswer": "Al³⁺",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_2_2_4",
        "label": "(4) 塩化物イオン",
        "type": "short_answer",
        "correctAnswer": "Cl⁻",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_2_2_5",
        "label": "(5) 酸化物イオン",
        "type": "short_answer",
        "correctAnswer": "O²⁻",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_2_2_6",
        "label": "(6) 硫化物イオン",
        "type": "short_answer",
        "correctAnswer": "S²⁻",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_2_2_7",
        "label": "(7) アンモニウムイオン",
        "type": "short_answer",
        "correctAnswer": "NH₄⁺",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_2_2_8",
        "label": "(8) 水酸化物イオン",
        "type": "short_answer",
        "correctAnswer": "OH⁻",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_2_2_9",
        "label": "(9) 硝酸イオン",
        "type": "short_answer",
        "correctAnswer": "NO₃⁻",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_2_2_10",
        "label": "(10) 硫酸イオン",
        "type": "short_answer",
        "correctAnswer": "SO₄²⁻",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_2_2_11",
        "label": "(11) 炭酸イオン",
        "type": "short_answer",
        "correctAnswer": "CO₃²⁻",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_2_2_12",
        "label": "(12) リン酸イオン",
        "type": "short_answer",
        "correctAnswer": "PO₄³⁻",
        "correctAnswerRate": 85
      }
    ],
    "explanation": "▼ 解答・解説\n(1) Na⁺ (2) Mg²⁺ (3) Al³⁺\n(4) Cl⁻ (5) O²⁻ (6) S²⁻\n(7) NH₄⁺ (8) OH⁻ (9) NO₃⁻\n(10) SO₄²⁻ (11) CO₃²⁻ (12) PO₄³⁻",
    "surroundingKnowledge": [],
    "deepDiveTopics": []
  },
  {
    "id": "q_c2_2_3",
    "category": "イオン (問3)",
    "text": "【問3】 （標準）次の陽イオンと陰イオンからなる化合物の組成式と名称を書け。\n※組成式の数字は普通の半角数字（例: CaCl2, (NH4)2SO4）で入力してください。多原子イオンが複数ある場合はカッコ ( ) でくくります。",
    "subQuestions": [
      {
        "id": "q_c2_2_3_1a",
        "label": "(1) Na⁺ と Cl⁻ [組成式]",
        "type": "short_answer",
        "correctAnswer": "NaCl",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_2_3_1b",
        "label": "(1) Na⁺ と Cl⁻ [名称]",
        "type": "short_answer",
        "correctAnswer": "塩化ナトリウム",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_2_3_2a",
        "label": "(2) Ca²⁺ と Cl⁻ [組成式]",
        "type": "short_answer",
        "correctAnswer": "CaCl2",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_2_3_2b",
        "label": "(2) Ca²⁺ と Cl⁻ [名称]",
        "type": "short_answer",
        "correctAnswer": "塩化カルシウム",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_2_3_3a",
        "label": "(3) Al³⁺ と O²⁻ [組成式]",
        "type": "short_answer",
        "correctAnswer": "Al2O3",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_2_3_3b",
        "label": "(3) Al³⁺ と O²⁻ [名称]",
        "type": "short_answer",
        "correctAnswer": "酸化アルミニウム",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_2_3_4a",
        "label": "(4) NH₄⁺ と SO₄²⁻ [組成式]",
        "type": "short_answer",
        "correctAnswer": "(NH4)2SO4",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_2_3_4b",
        "label": "(4) NH₄⁺ と SO₄²⁻ [名称]",
        "type": "short_answer",
        "correctAnswer": "硫酸アンモニウム",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_2_3_5a",
        "label": "(5) Na⁺ と CO₃²⁻ [組成式]",
        "type": "short_answer",
        "correctAnswer": "Na2CO3",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_2_3_5b",
        "label": "(5) Na⁺ と CO₃²⁻ [名称]",
        "type": "short_answer",
        "correctAnswer": "炭酸ナトリウム",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_2_3_6a",
        "label": "(6) Mg²⁺ と OH⁻ [組成式]",
        "type": "short_answer",
        "correctAnswer": "Mg(OH)2",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_2_3_6b",
        "label": "(6) Mg²⁺ と OH⁻ [名称]",
        "type": "short_answer",
        "correctAnswer": "水酸化マグネシウム",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_2_3_7a",
        "label": "(7) Ca²⁺ と PO₄³⁻ [組成式]",
        "type": "short_answer",
        "correctAnswer": "Ca3(PO4)2",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_2_3_7b",
        "label": "(7) Ca²⁺ と PO₄³⁻ [名称]",
        "type": "short_answer",
        "correctAnswer": "リン酸カルシウム",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_2_3_8a",
        "label": "(8) Al³⁺ と SO₄²⁻ [組成式]",
        "type": "short_answer",
        "correctAnswer": "Al2(SO4)3",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_2_3_8b",
        "label": "(8) Al³⁺ と SO₄²⁻ [名称]",
        "type": "short_answer",
        "correctAnswer": "硫酸アルミニウム",
        "correctAnswerRate": 85
      }
    ],
    "explanation": "▼ 解答・解説\n(1) NaCl 塩化ナトリウム\n(2) CaCl₂ 塩化カルシウム\n(3) Al₂O₃ 酸化アルミニウム\n(4) (NH₄)₂SO₄ 硫酸アンモニウム\n(5) Na₂CO₃ 炭酸ナトリウム\n(6) Mg(OH)₂ 水酸化マグネシウム\n(7) Ca₃(PO₄)₂ リン酸カルシウム\n(8) Al₂(SO₄)₃ 硫酸アルミニウム\n\n■ 組成式は陽イオン × m、陰イオン × n として、価数の積が等しくなる最小整数比 m:n をとる。",
    "surroundingKnowledge": [],
    "deepDiveTopics": []
  },
  {
    "id": "q_c2_2_4",
    "category": "イオン (問4)",
    "text": "【問4】 （文字式・文章題）一般に、価数 a の陽イオン A^(a+) と価数 b の陰イオン B^(b-) からなる化合物の組成式を、最小整数比で表す方法について説明せよ。（a, b は互いに素でない場合も含む）",
    "subQuestions": [
      {
        "id": "q_c2_2_4_ans",
        "label": "組成式の決定方法の説明",
        "type": "descriptive",
        "correctAnswer": "a と b の最小公倍数を L とすると、必要な陽イオン of 数 m = L/a，陰イオンの数 n = L/b となり、組成式は A_(L/a) B_(L/b) と表される（あるいは簡便には、価数を交差して約分する）。",
        "correctAnswerRate": 85
      }
    ],
    "explanation": "▼ 解答・解説\nL = a と b の最小公倍数 とすると、 A は L/a 個、B は L/b 個 必要。\nよって組成式は A_(L/a) B_(L/b) と表されます。\n\n例：a=2, b=3 → L=6, A₃B₂。（Al³⁺ と O²⁻ → Al₂O₃）\n\n※ 簡便には「陽イオンの価数を陰イオンの添え字に、陰イオンの価数を陽イオンの添え字にしてから約分」を行います。",
    "surroundingKnowledge": [],
    "deepDiveTopics": []
  },
  {
    "id": "q_c2_2_5",
    "category": "イオン (問5)",
    "text": "【問5】 （標準）次のイオンの電子配置を、ヘリウム型、ネオン型、アルゴン型のいずれかで答えよ。（「ヘリウム型」、「ネオン型」、「アルゴン型」と入力してください）",
    "subQuestions": [
      {
        "id": "q_c2_2_5_1",
        "label": "(1) Li⁺",
        "type": "short_answer",
        "correctAnswer": "ヘリウム型",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_2_5_2",
        "label": "(2) Na⁺",
        "type": "short_answer",
        "correctAnswer": "ネオン型",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_2_5_3",
        "label": "(3) Mg²⁺",
        "type": "short_answer",
        "correctAnswer": "ネオン型",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_2_5_4",
        "label": "(4) F⁻",
        "type": "short_answer",
        "correctAnswer": "ネオン型",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_2_5_5",
        "label": "(5) Cl⁻",
        "type": "short_answer",
        "correctAnswer": "アルゴン型",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_2_5_6",
        "label": "(6) K⁺",
        "type": "short_answer",
        "correctAnswer": "アルゴン型",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_2_5_7",
        "label": "(7) Ca²⁺",
        "type": "short_answer",
        "correctAnswer": "アルゴン型",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_2_5_8",
        "label": "(8) S²⁻",
        "type": "short_answer",
        "correctAnswer": "アルゴン型",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_2_5_9",
        "label": "(9) O²⁻",
        "type": "short_answer",
        "correctAnswer": "ネオン型",
        "correctAnswerRate": 85
      }
    ],
    "explanation": "▼ 解答・解説\n・ヘリウム型 (K2)：(1) Li⁺\n・ネオン型 (K2 L8)：(2) Na⁺ , (3) Mg²⁺ , (4) F⁻ , (9) O²⁻\n・アルゴン型 (K2 L8 M8)：(5) Cl⁻ , (6) K⁺ , (7) Ca²⁺ , (8) S²⁻\n\n■ いずれも貴ガスと同じ電子配置（等電子配置）になっている点が重要です。",
    "surroundingKnowledge": [],
    "deepDiveTopics": []
  },
  {
    "id": "q_c2_2_6",
    "category": "イオン (問6)",
    "text": "【問6】 （共通テスト風応用）次のうち、互いに等電子（電子数が同じ）であるイオン・原子の組合せを2組（電子数10個と18個のグループ）挙げよ。",
    "subQuestions": [
      {
        "id": "q_c2_2_6_g1",
        "label": "電子数10 (ネオン型)のグループ（左から原子番号の小さい順）",
        "type": "sorting",
        "items": [
          "Mg²⁺",
          "Ne",
          "Al³⁺",
          "F⁻",
          "O²⁻",
          "N³⁻",
          "Na⁺"
        ],
        "correctAnswer": "N³⁻ > O²⁻ > F⁻ > Ne > Na⁺ > Mg²⁺ > Al³⁺",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_2_6_g2",
        "label": "電子数18 (アルゴン型)のグループ（左から原子番号の小さい順）",
        "type": "sorting",
        "items": [
          "Ca²⁺",
          "Ar",
          "Cl⁻",
          "S²⁻",
          "K⁺"
        ],
        "correctAnswer": "S²⁻ > Cl⁻ > Ar > K⁺ > Ca²⁺",
        "correctAnswerRate": 85
      }
    ],
    "explanation": "▼ 解答・解説\n・電子数10 (ネオン型)のグループ：原子番号（陽子数）が小さい順に、N³⁻(7) > O²⁻(8) > F⁻(9) > Ne(10) > Na⁺(11) > Mg²⁺(12) > Al³⁺(13) となります。\n・電子数18 (アルゴン型)のグループ：原子番号（陽子数）が小さい順に、S²⁻(16) > Cl⁻(17) > Ar(18) > K⁺(19) > Ca²⁺(20) となります。",
    "surroundingKnowledge": [],
    "deepDiveTopics": []
  },
  {
    "id": "q_c2_2_7",
    "category": "イオン (問7)",
    "text": "【問7】 （共通テスト風応用）ある単原子イオン X²⁺ の電子配置が K2 L8 M8 であった。次の問いに答えよ。",
    "subQuestions": [
      {
        "id": "q_c2_2_7_sym",
        "label": "(1) Xの元素記号を答えよ。",
        "type": "short_answer",
        "correctAnswer": "Ca",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_2_7_num",
        "label": "(2) Xの原子番号を答えよ。",
        "type": "short_answer",
        "correctAnswer": "20",
        "correctAnswerRate": 85
      }
    ],
    "explanation": "▼ 解答・解説\n電子数 = 2+8+8 = 18 個。\nX²⁺は電子を 2個失ってこの状態になっているため、原子のときの電子数（=陽子数＝原子番号）は 18 + 2 = 20 個となります。\n原子番号20の元素はカルシウム（元素記号は Ca）です。\n\n答：元素記号: Ca, 原子番号: 20",
    "surroundingKnowledge": [],
    "deepDiveTopics": []
  }
];

/** c2_3 の演習問題。chemistryData.ts の "practiceProblems" にそのまま入る。 */
export const c2_3_Practice = [
  {
    "id": "q_c2_3_1",
    "category": "イオン生成とエネルギー (問1)",
    "text": "【問1】 次の文章の空欄（ア）〜（セ）に適する語句・記号を答えよ。（語句網羅）\n\n原子から最も外側の電子を1個取り去り、1価の（ア）にするのに必要なエネルギーを（イ）という。値が（ウ：大きい／小さい）ほど陽イオンになりにくく、（ウ）ほど（エ）と結合しやすい。原子に電子を1個与えて1価の（オ）にしたときに放出されるエネルギーを（カ）という。値が（キ：大きい／小さい）ほど陰イオンになりやすい。周期表で（ク：右上／左下）ほど（イ）は大きく、（ケ：右上／左下）ほど（カ）も大きい傾向がある。（イ）が最大なのは（コ）（18族）であり、特に He で最大。（カ）が最も大きいのは（サ）族の元素であり、特に（シ）が最大。アルカリ金属は（イ）が（ス）く（陽イオンになりやすい）、ハロゲンは（カ）が（セ）い（陰イオンになりやすい）。",
    "subQuestions": [
      {
        "id": "q_c2_3_1_a",
        "label": "（ア）",
        "type": "short_answer",
        "correctAnswer": "陽イオン",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_3_1_i",
        "label": "（イ）",
        "type": "short_answer",
        "correctAnswer": "イオン化エネルギー",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_3_1_u",
        "label": "（ウ） ※「大きい」または「小さい」",
        "type": "short_answer",
        "correctAnswer": "大きい",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_3_1_e",
        "label": "（エ）",
        "type": "short_answer",
        "correctAnswer": "非金属",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_3_1_o",
        "label": "（オ）",
        "type": "short_answer",
        "correctAnswer": "陰イオン",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_3_1_ka",
        "label": "（カ）",
        "type": "short_answer",
        "correctAnswer": "電子親和力",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_3_1_ki",
        "label": "（キ） ※「大きい」または「小さい」",
        "type": "short_answer",
        "correctAnswer": "大きい",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_3_1_ku",
        "label": "（ク） ※「右上」または「左下」",
        "type": "short_answer",
        "correctAnswer": "右上",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_3_1_ke",
        "label": "（ケ） ※「右上」または「左下」",
        "type": "short_answer",
        "correctAnswer": "右上",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_3_1_ko",
        "label": "（コ）",
        "type": "short_answer",
        "correctAnswer": "貴ガス",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_3_1_sa",
        "label": "（サ） ※半角数字",
        "type": "short_answer",
        "correctAnswer": "17",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_3_1_shi",
        "label": "（シ） ※元素記号または名称",
        "type": "short_answer",
        "correctAnswer": "Cl",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_3_1_su",
        "label": "（ス）",
        "type": "short_answer",
        "correctAnswer": "小さ",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_3_1_se",
        "label": "（セ）",
        "type": "short_answer",
        "correctAnswer": "大き",
        "correctAnswerRate": 85
      }
    ],
    "explanation": "▼ 解答・解説\n（ア）陽イオン （イ）イオン化エネルギー （ウ）大きい （エ）非金属（陰イオン）\n（オ）陰イオン （カ）電子親和力 （キ）大きい （ク）右上 （ケ）右上\n（コ）貴ガス （サ）17 （シ）Cl（塩素） （ス）小さ （セ）大き\n\n■ イオン化エネルギーが「小さい」ほど電子を放出しやすく陽イオンになりやすい。\n■ 電子親和力が「大きい」ほど電子を取り込んで安定化し、陰イオンになりやすい。",
    "surroundingKnowledge": [],
    "deepDiveTopics": []
  },
  {
    "id": "q_c2_3_2",
    "category": "イオン生成とエネルギー (問2)",
    "text": "【問2】 （基礎）次の元素を、第1イオン化エネルギーの大きい順に並べ替えよ。\n※下の元素カードをクリックして、大きい順に選択してください。",
    "subQuestions": [
      {
        "id": "q_c2_3_2_1",
        "label": "(1) Na, K, Li",
        "type": "sorting",
        "items": [
          "Na",
          "K",
          "Li"
        ],
        "correctAnswer": "Li > Na > K",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_3_2_2",
        "label": "(2) Li, C, F, Ne",
        "type": "sorting",
        "items": [
          "Li",
          "C",
          "F",
          "Ne"
        ],
        "correctAnswer": "Ne > F > C > Li",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_3_2_3",
        "label": "(3) Na, Mg, Al",
        "type": "sorting",
        "items": [
          "Na",
          "Mg",
          "Al"
        ],
        "correctAnswer": "Mg > Al > Na",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_3_2_4",
        "label": "(4) F, Cl, Br, I",
        "type": "sorting",
        "items": [
          "F",
          "Cl",
          "Br",
          "I"
        ],
        "correctAnswer": "F > Cl > Br > I",
        "correctAnswerRate": 85
      }
    ],
    "explanation": "▼ 解答・解説\n(1) Li > Na > K  （同族では原子番号大ほど小：電子殻が外側に広がる）\n(2) Ne > F > C > Li （同周期では原子番号大ほど大、貴ガス最大）\n(3) Mg > Al > Na  （Mg は閉殻型 M2 で安定、Al はM3 で1 個多いがNa よりは大）\n(4) F > Cl > Br > I （同族 ハロゲンも原子番号大ほど小）",
    "surroundingKnowledge": [],
    "deepDiveTopics": []
  },
  {
    "id": "q_c2_3_3",
    "category": "イオン生成とエネルギー (問3)",
    "text": "【問3】 （標準）図6（第1イオン化エネルギーのグラフ）について次に答えよ。",
    "subQuestions": [
      {
        "id": "q_c2_3_3_1",
        "label": "(1) 極大点（ピーク）にある元素群を答えよ。",
        "type": "short_answer",
        "correctAnswer": "貴ガス",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_3_3_2",
        "label": "(2) 極小点（谷）にある元素群を答えよ。",
        "type": "short_answer",
        "correctAnswer": "アルカリ金属",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_3_3_3",
        "label": "(3) 同じ周期内で、原子番号が増加すると第1イオン化エネルギーはどのように変化するか。",
        "type": "descriptive",
        "correctAnswer": "おおむね増加する（原子核の正電荷が強まり電子を強く引きつけるため）。ただし所々で凹凸あり。",
        "gradingCriteria": [
          "「おおむね増加する」という傾向",
          "「原子核の電荷（陽子数）が強まり電子を強く引きつける」理由",
          "「周期の途中で例外的に凹凸（減少）する箇所がある」記述"
        ],
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_3_3_4",
        "label": "(4) Be（4）→ B（5）でわずかに減少している。理由を簡潔に説明せよ。",
        "type": "descriptive",
        "correctAnswer": "Be は K2 L2（s²閉殻）で安定、B は K2 L3 で 1 個外側の電子を持つため、Be より少しのエネルギーで電子が奪える。",
        "gradingCriteria": [
          "「Beの電子殻または電子軌道（s面）が閉じた閉殻に近く安定」という言及",
          "「Bの電子は1個がさらに外側（p軌道）に入るため、核から離れて奪いやすい」",
          "「Beより少ないエネルギーで済む」"
        ],
        "correctAnswerRate": 85
      }
    ],
    "explanation": "▼ 解答・解説\n(1) 貴ガス（He, Ne, Ar）。 閉殻で電子配置が安定しており電子を奪うのに大きなエネルギーが必要。\n(2) アルカリ金属（Li, Na, K）。 価電子1個を放出して貴ガス型になりやすく、奪いやすい。\n(3) おおむね増加する（原子核 of 正電荷が強まり電子を強く引きつけるため）。ただし所々で凹凸あり。\n(4) Be は K2 L2（s²閉殻）で安定、B は K2 L3 で 1 個外側の電子を持つため、Be より少しのエネルギーで電子が奪える。",
    "surroundingKnowledge": [],
    "deepDiveTopics": []
  },
  {
    "id": "q_c2_3_4",
    "category": "イオン生成とエネルギー (問4)",
    "text": "【問4】 （標準）次の問いに答えよ。",
    "subQuestions": [
      {
        "id": "q_c2_3_4_1",
        "label": "(1) 電子親和力が最大の元素は何か。 ※元素記号または名称",
        "type": "short_answer",
        "correctAnswer": "Cl",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_3_4_2",
        "label": "(2) アルカリ金属が水と激しく反応するのは、なぜか。",
        "type": "descriptive",
        "correctAnswer": "アルカリ金属は第1イオン化エネルギーが特に小さく、価電子1個を容易に放出して陽イオンとなり、水との反応で水素を発生する。",
        "gradingCriteria": [
          "「第1イオン化エネルギーが極めて小さい/特に小さい」",
          "「価電子1個を容易に放出して陽イオンになりやすい」",
          "「水と反応して水素を生成する」"
        ],
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_3_4_3",
        "label": "(3) 貴ガス（希ガス）が化学的に安定な理由を電子配置の観点から述べよ。",
        "type": "descriptive",
        "correctAnswer": "貴ガスは最外殻電子が 2（He）または 8（Ne, Ar, …）の閉殻構造で電子配置が極めて安定しており、電子を授受しにくいため。",
        "gradingCriteria": [
          "「閉殻構造」または「最外殻電子数が2 or 8」であること",
          "「最も外側の電子配置が極めて安定している」",
          "「電子を新しく受け入れたり他から奪う必要がない（電子を授受しにくい）」"
        ],
        "correctAnswerRate": 85
      }
    ],
    "explanation": "▼ 解答・解説\n(1) Cl（塩素）。F は原子半径が小さく入った電子間の反発が大きいため Cl の方が大きい。\n(2) アルカリ金属は第1イオン化エネルギーが特に小さく、価電子1個を容易に放出して陽イオンとなり、水との反応で水素を発生する。\n(3) 貴ガスは最外殻電子が 2（He）または 8（Ne, Ar, …）の閉殻構造で電子配置が極めて安定しており、電子を授受しにくいため。",
    "surroundingKnowledge": [],
    "deepDiveTopics": []
  },
  {
    "id": "q_c2_3_5",
    "category": "イオン生成とエネルギー (問5)",
    "text": "【問5】 （文字式・文章題）1 mol の Na 原子をすべて Na⁺ にするのに必要なエネルギーは、Na の第1イオン化エネルギー I [kJ/mol] で表される。Na の原子量を 23.0 とするとき、Na 11.5 g をすべて Na⁺ にするのに必要なエネルギーを I の式で表せ。",
    "subQuestions": [
      {
        "id": "q_c2_3_5_ans",
        "label": "必要なエネルギーを表す式 [kJ]",
        "type": "short_answer",
        "correctAnswer": "0.5I",
        "correctAnswerRate": 85
      }
    ],
    "explanation": "▼ 解答・解説\nNa 11.5 g の物質量 = 11.5/23.0 = 0.500 mol.\n必要なエネルギー = 0.500 × I = I/2  [kJ]  （= 0.5I [kJ]）。\n\n■ イオン化エネルギーは『1 mol あたり』の値（単位 kJ/mol）。",
    "surroundingKnowledge": [],
    "deepDiveTopics": []
  },
  {
    "id": "q_c2_3_6",
    "category": "イオン生成とエネルギー (問6)",
    "text": "【問6】 （文字式・文章題）原子 X の第1イオン化エネルギーを I₁、第2イオン化エネルギーを I₂ と散る（一般に I₁<I₂）。元素 X が安定な2価陽イオン X²⁺ をつくるためには、I₁+I₂ のエネルギーを与える必要がある。下の表の元素について I₁+I₂ の値を計算し、最も2価陽イオンになりやすい元素を元素記号で答えよ。\n\nLi: I₁=520, I₂=7298 ／ Be: I₁=899, I₂=1757 ／ Mg: I₁=738, I₂=1451 ／ Na: I₁=496, I₂=4562 ／ Ca: I₁=590, I₂=1145 （単位 kJ/mol）",
    "subQuestions": [
      {
        "id": "q_c2_3_6_ans",
        "label": "最も2価陽イオンになりやすい元素の元素記号",
        "type": "short_answer",
        "correctAnswer": "Ca",
        "correctAnswerRate": 85
      }
    ],
    "explanation": "▼ 解答・解説\nLi: 520+7298=7818 Be: 899+1757=2656 Mg: 738+1451=2189\nNa: 496+4562=5058 Ca: 590+1145=1735\n\n最小は Ca → 2価陽イオンに最もなりやすい。\n\n■ 2 族（Mg, Ca）は I₁+I₂ が小さいので2 価陽イオンになりやすい。Na（1族）は I₂ が極端に大きいので2価にはなりにくい（Ne型を破ることになるため）。",
    "surroundingKnowledge": [],
    "deepDiveTopics": []
  },
  {
    "id": "q_c2_3_7",
    "category": "イオン生成とエネルギー (問7)",
    "text": "【問7】 （共通テスト風応用）次の文中の空欄（A）、（B）に当てはまる元素記号を答えよ。\n\n『同一周期において、第1イオン化エネルギーは18族の（A）で最大、1族の（B）で最小となる傾向にある。第3周期で考えると、（A）= [A] 、（B）= [B] である。』",
    "subQuestions": [
      {
        "id": "q_c2_3_7_a",
        "label": "（A）の元素記号",
        "type": "short_answer",
        "correctAnswer": "Ar",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_3_7_b",
        "label": "（B）の元素記号",
        "type": "short_answer",
        "correctAnswer": "Na",
        "correctAnswerRate": 85
      }
    ],
    "explanation": "▼ 解答・解説\n第3周期 18族 = Ar（アルゴン）。 第3周期 1族 = Na（ナトリウム）。\n\n■ 周期表の同一周期で、第1イオン化エネルギーは右上の貴ガスで最大、左下のアルカリ金属で最小。",
    "surroundingKnowledge": [],
    "deepDiveTopics": []
  }
];

/** c2_4 の演習問題。chemistryData.ts の "practiceProblems" にそのまま入る。 */
export const c2_4_Practice = [
  {
    "id": "q_c2_4_1",
    "category": "原子の大きさとイオンの大きさ (問1)",
    "text": "【問1】 次の文章の空欄（ア）〜（コ）に適する語句を答えよ。（語句網羅）\n\n原子の大きさ（原子半径）には次の傾向がある。(i) 同じ族（縦の列）では、原子番号が大きいほど電子殻が（ア）に増えるので原子半径は（イ：大きく／小さく）なる。(ii) 同じ周期（横の行）では、原子番号が大きいほど（ウ）の数が増えて電子を強く（エ）ため、原子半径は（オ：大きく／小さく）なる。陽イオンは、もとの原子から電子を失って一番外側の（カ）が1つなくなるので、もとの原子より半径が（キ：大きく／小さく）なる。陰イオンは、もとの原子に電子が加わって電子間の（ク）が大きくなるので、もとの原子より半径が（ケ：大きく／小さく）なる。等電子配置のイオンどうしを比べると、原子番号（陽子数）が（コ：大きい／小さい）ほどイオン半径は小さい。",
    "subQuestions": [
      {
        "id": "q_c2_4_1_a",
        "label": "（ア）",
        "type": "short_answer",
        "correctAnswer": "外側",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_4_1_i",
        "label": "（イ） ※「大きく」または「小さく」",
        "type": "short_answer",
        "correctAnswer": "大きく",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_4_1_u",
        "label": "（ウ）",
        "type": "short_answer",
        "correctAnswer": "陽子",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_4_1_e",
        "label": "（エ）",
        "type": "short_answer",
        "correctAnswer": "引きつける",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_4_1_o",
        "label": "（オ） ※「大きく」または「小さく」",
        "type": "short_answer",
        "correctAnswer": "小さく",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_4_1_ka",
        "label": "（カ）",
        "type": "short_answer",
        "correctAnswer": "電子殻",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_4_1_ki",
        "label": "（キ） ※「大きく」または「小さく」",
        "type": "short_answer",
        "correctAnswer": "小さく",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_4_1_ku",
        "label": "（ク）",
        "type": "short_answer",
        "correctAnswer": "反発",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_4_1_ke",
        "label": "（ケ） ※「大きく」または「小さく」",
        "type": "short_answer",
        "correctAnswer": "大きく",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_4_1_ko",
        "label": "（コ） ※「大きい」または「小さい」",
        "type": "short_answer",
        "correctAnswer": "大きい",
        "correctAnswerRate": 85
      }
    ],
    "explanation": "▼ 解答・解説\n（ア）外側 （イ）大きく （ウ）陽子（または原子核の電荷） （エ）引きつける\n（オ）小さく （カ）電子殻 （キ）小さく （ク）反発（クーロン反発） （ケ）大きく\n（コ）大きい\n\n■ (i) 同族では原子番号が大きいほど最も外側の電子殻が増えるため大きくなる。\n■ (ii) 同周期では最外殻は同じだが、原子番号が大きくなるほど陽子数（核の正電荷）が増え、より強く電子を引きつけるために小さくなる。\n■ 陽イオンになると、最外殻電子を失い、最外殻そのものが1つ減るため、非常に小さくなる。\n■ 陰イオンになると、電子間の反発が増大し、電子雲が広がって大きくなる。\n■ 電子配置が同じ（等電子配置）なら、陽子数（原子番号）が大きいほど電子を強く引きつけるため小さくなる。",
    "surroundingKnowledge": [],
    "deepDiveTopics": []
  },
  {
    "id": "q_c2_4_2",
    "category": "原子の大きさとイオンの大きさ (問2)",
    "text": "【問2】 （基礎）次の原子・イオンを半径の大きい順に並べよ。\n※下の元素カードをクリックして、大きい順に選択してください。",
    "subQuestions": [
      {
        "id": "q_c2_4_2_1",
        "label": "(1) Li, Na, K",
        "type": "sorting",
        "items": [
          "Li",
          "Na",
          "K"
        ],
        "correctAnswer": "K > Na > Li",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_4_2_2",
        "label": "(2) Na, Mg, Al",
        "type": "sorting",
        "items": [
          "Na",
          "Mg",
          "Al"
        ],
        "correctAnswer": "Na > Mg > Al",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_4_2_3",
        "label": "(3) F, Cl, Br",
        "type": "sorting",
        "items": [
          "F",
          "Cl",
          "Br"
        ],
        "correctAnswer": "Br > Cl > F",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_4_2_4",
        "label": "(4) O, F, Ne",
        "type": "sorting",
        "items": [
          "O",
          "F",
          "Ne"
        ],
        "correctAnswer": "Ne > F > O",
        "correctAnswerRate": 85
      }
    ],
    "explanation": "▼ 解答・解説\n(1) K > Na > Li （同族・原子番号大ほど大：電子殻が増えるため）\n(2) Na > Mg > Al （同周期・原子番号大ほど小：陽子数が増え電子を強く引きつけるため）\n(3) Br > Cl > F （同族・原子番号大ほど大）\n(4) Ne > F > O （同周期・原子番号大ほど小。ただし貴ガスの原子半径の定義に注意；本問は他原子と同列のスケール）\n※実際の入試では Ne は単原子分子で『分子半径』を扱う場合と『原子半径』を扱う場合があり、教科書の定義に従う。",
    "surroundingKnowledge": [],
    "deepDiveTopics": []
  },
  {
    "id": "q_c2_4_3",
    "category": "原子の大きさとイオンの大きさ (問3)",
    "text": "【問3】 （標準）次の各原子・イオンの半径について、大→小の順に並べ替えよ。\n※下の元素カードをクリックして、大きい順に選択してください。",
    "subQuestions": [
      {
        "id": "q_c2_4_3_1",
        "label": "(1) Na と Na⁺",
        "type": "sorting",
        "items": [
          "Na",
          "Na⁺"
        ],
        "correctAnswer": "Na > Na⁺",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_4_3_2",
        "label": "(2) Cl と Cl⁻",
        "type": "sorting",
        "items": [
          "Cl",
          "Cl⁻"
        ],
        "correctAnswer": "Cl⁻ > Cl",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_4_3_3",
        "label": "(3) Mg と Mg²⁺",
        "type": "sorting",
        "items": [
          "Mg",
          "Mg²⁺"
        ],
        "correctAnswer": "Mg > Mg²⁺",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_4_3_4",
        "label": "(4) O と O²⁻",
        "type": "sorting",
        "items": [
          "O",
          "O²⁻"
        ],
        "correctAnswer": "O²⁻ > O",
        "correctAnswerRate": 85
      }
    ],
    "explanation": "▼ 解答・解説\n(1) Na > Na⁺ （陽イオンはもとの原子より小さくなる：電子殻を1つ失うため）\n(2) Cl⁻ > Cl （陰イオンはもとの原子より大きくなる：電子間の反発が大きくなるため）\n(3) Mg > Mg²⁺\n(4) O²⁻ > O",
    "surroundingKnowledge": [],
    "deepDiveTopics": []
  },
  {
    "id": "q_c2_4_4",
    "category": "原子の大きさとイオンの大きさ (問4)",
    "text": "【問4】 （標準）等電子配置のイオン Na⁺, Mg²⁺, Al³⁺, F⁻, O²⁻ について、イオン半径の大きい順に並べよ。\n※下の元素カードをクリックして、大きい順に選択してください。",
    "subQuestions": [
      {
        "id": "q_c2_4_4_ans",
        "label": "イオン半径の大きい順",
        "type": "sorting",
        "items": [
          "Na⁺",
          "Mg²⁺",
          "Al³⁺",
          "F⁻",
          "O²⁻"
        ],
        "correctAnswer": "O²⁻ > F⁻ > Na⁺ > Mg²⁺ > Al³⁺",
        "correctAnswerRate": 85
      }
    ],
    "explanation": "▼ 解答・解説\n答：O²⁻ > F⁻ > Na⁺ > Mg²⁺ > Al³⁺\n\n■ いずれも電子数10（Ne型）。等電子配置では陽子数（原子番号）が大きいほど核が電子を強く引きつけて小さくなる。\n陽子数：O(8) < F(9) < Na(11) < Mg(12) < Al(13).",
    "surroundingKnowledge": [],
    "deepDiveTopics": []
  },
  {
    "id": "q_c2_4_5",
    "category": "原子の大きさとイオンの大きさ (問5)",
    "text": "【問5】 次の（1）、（2）の問いに答えよ。\n\n（1） イオン半径の大小として、正しいものは次のア～オのうちどれか。\nア） Na⁺ ＜ Mg²⁺  イ） Na⁺ ＜ Al³⁺  ウ） O²⁻ ＜ Al³⁺  エ） F⁻ ＜ O²⁻  オ） K⁺ ＜ Ca²⁺\n\n（2） 次の原子やイオンについて、大きい方を選んで元素記号またはイオン式で答えよ。\n① Li と Na  ② Li と Be  ③ Ca と Ca²⁺  ④ Cl と Cl⁻",
    "subQuestions": [
      {
        "id": "q_c2_4_5_1",
        "label": "（1） イオン半径の大小として、正しいものはどれか。",
        "type": "multiple_choice",
        "options": [
          "ア） Na⁺ ＜ Mg²⁺",
          "イ） Na⁺ ＜ Al³⁺",
          "ウ） O²⁻ ＜ Al³⁺",
          "エ） F⁻ ＜ O²⁻",
          "オ） K⁺ ＜ Ca²⁺"
        ],
        "correctAnswer": "エ） F⁻ ＜ O²⁻",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_4_5_2_1",
        "label": "（2） ① LiとNaで大きい方",
        "type": "multiple_choice",
        "options": [
          "Li",
          "Na"
        ],
        "correctAnswer": "Na",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_4_5_2_2",
        "label": "（2） ② LiとBeで大きい方",
        "type": "multiple_choice",
        "options": [
          "Li",
          "Be"
        ],
        "correctAnswer": "Li",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_4_5_2_3",
        "label": "（2） ③ CaとCa²⁺で大きい方",
        "type": "multiple_choice",
        "options": [
          "Ca",
          "Ca²⁺"
        ],
        "correctAnswer": "Ca",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_4_5_2_4",
        "label": "（2） ④ ClとCl⁻で大きい方",
        "type": "multiple_choice",
        "options": [
          "Cl",
          "Cl⁻"
        ],
        "correctAnswer": "Cl⁻",
        "correctAnswerRate": 85
      }
    ],
    "explanation": "▼ 解答・解説\n（1）答：エ） F⁻ ＜ O²⁻\n等電子配置（いずれもNe型）のイオンを比較すると、**陽子数（原子番号）が小さいほど、核が電子を引く力が弱まり、イオン半径は大きくなります。**\n陽子数：O²⁻(8) ＜ F⁻(9) ＜ Na⁺(11) ＜ Mg²⁺(12) ＜ Al³⁺(13)\nしたがって、イオン半径は：O²⁻ ＞ F⁻ ＞ Na⁺ ＞ Mg²⁺ ＞ Al³⁺ となります。\n各選択肢を検証すると、F⁻ ＜ O²⁻ だけが不等号の向きが正しくなっています。\n\n（2）大きい方は次の通りです。\n① **Na**\n同じ1族の元素（同族元素）では、**周期が大きい（下にある）ほど電子殻の数が多くなるため、原子半径は大きくなります**（Li：L殻まで、Na：M殻まで）。\n\n② **Li**\n同じ第2周期の元素（同周期元素）では、**原子番号が小さい（左にある）ほど原子核の正電荷が小さく、電子を引く力が弱いため、原子半径が大きくなります**。\n\n③ **Ca**\n金属原子が陽イオンになるとき、最外殻電子をすべて失って**電子殻が1つ減る（または最外殻が内側に移る）ため、イオン半径は元の原子半径より極めて小さくなります**（Ca ＞ Ca²⁺）。\n\n④ **Cl⁻**\n非金属原子が陰イオンになるとき、最外殻に電子が入り、電子同士の反発力が强まるため、**イオン半径は元の原子半径より僅かに大きくなります**（Cl ＜ Cl⁻）。",
    "surroundingKnowledge": [],
    "deepDiveTopics": []
  },
  {
    "id": "q_c2_4_6",
    "category": "原子の大きさとイオンの大きさ (問6)",
    "text": "【問6】 イオンが球形であるとみなしたとき、その半径をイオン半径という。次の各組のイオンについて、イオン半径が大きいのはどちらか答えよ。また、その理由を説明したそれぞれの文の空欄［ 15字以内 ］を適切に埋めよ。\n\n① O²⁻ と Na⁺\n理由：同じ電子配置では、［ 15字以内 ］ほど、イオン半径が大きいため。\n\n② Na⁺ と K⁺\n理由：同じ族では、［ 15字以内 ］ほど、イオン半径が大きいため。",
    "subQuestions": [
      {
        "id": "q_c2_4_6_1_ion",
        "label": "① O²⁻とNa⁺でイオン半径が大きい方",
        "type": "multiple_choice",
        "options": [
          "O²⁻",
          "Na⁺"
        ],
        "correctAnswer": "O²⁻",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_4_6_1_reason",
        "label": "① の理由の空欄［ 15字以内 ］に入る言葉",
        "type": "descriptive",
        "correctAnswer": "原子核中の正電荷が小さいイオン",
        "gradingCriteria": [
          "「正電荷（または陽子数や原子番号）が小さい（少ない）」という意味を含むこと",
          "「15字以内」でまとめられていること（例：「原子核中の正電荷が小さい」など）"
        ],
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_4_6_2_ion",
        "label": "② Na⁺とK⁺でイオン半径が大きい方",
        "type": "multiple_choice",
        "options": [
          "Na⁺",
          "K⁺"
        ],
        "correctAnswer": "K⁺",
        "correctAnswerRate": 85
      },
      {
        "id": "q_c2_4_6_2_reason",
        "label": "② の理由の空欄［ 15字以内 ］に入る言葉",
        "type": "descriptive",
        "correctAnswer": "外側の電子殻に電子があるイオン",
        "gradingCriteria": [
          "「外側の電子殻（または電子殻の数）に電子がある（または多い）」という意味を含むこと",
          "「15字以内」でまとめられていること（例：「外側の電子殻に電子がある」など）"
        ],
        "correctAnswerRate": 85
      }
    ],
    "explanation": "▼ 解答・解説\n① 答：**O²⁻**、理由の空欄：**原子核中の正電荷が小さい**（または「陽子数が少ない」「原子番号が小さい」など）\n\n【解説】\nO²⁻（原子番号8）と Na⁺（原子番号11）は、どちらも電子が10個で**等電子配置（Ne型）**です。\n等電子配置のイオンでは、**原子核の正電荷（陽子数）が小さいほど、核が電子を引く力が弱くなるため、イオン半径は大きくなります**。\n\n② 答：**K⁺**、理由の空欄：**外側の電子殻に電子がある**（または「電子殻の数（または数）が多い」「最外殻の主量子数が大きい」など）\n\n【解説】\nNa⁺ と K⁺ はどちらも1族の**同族元素のイオン**です。\n同じ族のイオンでは、下（原子番号が大きく周期が大きい）にあるものほど**より外側の電子殻に電子が存在する（電子殻の数が多い）ため、イオン半径が大きくなります**（Na⁺はL殻まで、K⁺はM殻まで電子が入るため）。",
    "surroundingKnowledge": [],
    "deepDiveTopics": []
  },
  {
    "id": "q_c2_4_7",
    "category": "原子の大きさとイオンの大きさ (問7)",
    "text": "【問7】 （共通テスト風応用）次のうち、原子半径が大きい順に正しく並んでいるものを選べ。\n\n① F > O > N > C \n② Li > Be > B > C \n③ K > Na > Li > H \n④ Mg > Si > P > Cl",
    "subQuestions": [
      {
        "id": "q_c2_4_7_ans",
        "label": "大から小に正しく並んでいるもの",
        "type": "multiple_choice",
        "options": [
          "①",
          "②",
          "③",
          "④"
        ],
        "correctAnswer": "③",
        "correctAnswerRate": 85
      }
    ],
    "explanation": "▼ 解答・解説\n答：③\n\n- ① F < O < N < C（同周期、Cが最大となる傾向）→ 誤り。\n- ② Li > Be > B > C（同周期、左ほど大）→ 正しい。\n- ③ K > Na > Li > H（同族1族、原子番号大ほど大）→ 最も明確に正しい。\n- ④ Mg > Si > P > Cl も、周期表で左にあるものほど原子半径が大きいため、傾向としては正しいが、Mg > Al > Si > P > S > Cl という順序の一部である。\n\n※入試ではより明確な選択肢として「③」が選ばれます。",
    "surroundingKnowledge": [],
    "deepDiveTopics": []
  }
];
