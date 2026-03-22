import { NodeData } from '../components/InteractiveTree';

export const chemistryData = {
  parts: [
    {
      id: "part1",
      title: "第一部・化学基礎前半",
      chapters: [
        {
          id: "c1_1",
          abstractTitle: "① 純物質と混合物",
          realTitle: "1章 物質の構成",
          topics: ["純物質と混合物"],
          practiceProblems: [
            {
              id: "p_c1_1_1",
              category: "純物質と混合物",
              text: "問１ 次の文章の空欄に適する語句を答えなさい（選択肢がある場合はその中から正しい方を選びなさい）。\n\n物質は大きく「純物質」と「混合物」に分けられる。純物質は「（ ア ）種類の粒子からできている」ものであり、融点や沸点、密度などが物質ごとに（イ：　等しく　・　異　）なる。さらに純物質は、１種類の（ ウ ）からできている「（ エ ）」と、２種類以上の（ ウ ）からできている「（ オ ）」に分けられる。（ エ ）のうち、室温で液体として存在するのは（ カ ）と水銀だけである。一方、混合物は「（ キ ）種類以上の粒子からできている」ものであり、混じっている物質の種類やその（ ク ）によって融点や沸点などの値が（ケ：　等しく　・　異　）なる。混合物を純物質に分けるには、ろ過や蒸留などの「（ コ ）的方法」を用いるが、（ オ ）を（ エ ）に分解するには、電気分解などの「（ サ ）的方法」を用いる必要がある。",
              subQuestions: [
                { 
                  id: "p1_a", label: "(ア)", type: "short_answer", correctAnswer: "1", correctAnswerRate: 85,
                  detailedExplanation: {
                    theme: "純物質と混合物の定義",
                    type: "構造発見型",
                    steps: [
                      "① 「純物質」の定義を問う空欄であることを確認する",
                      "② 純物質と混合物の違いは粒子の種類数であることを想起する",
                      "③ 純物質は1種類の粒子からなることを確認する"
                    ]
                  }
                },
                { id: "p1_i", label: "(イ)", type: "multiple_choice", options: ["等しく", "異"], correctAnswer: "等しく", correctAnswerRate: 85,
                  detailedExplanation: {
                    theme: "純物質の性質",
                    type: "演繹型",
                    steps: [
                      "① 純物質の性質について述べている部分であると確認する",
                      "② 不純物がない場合の状態変化の特徴を想起する",
                      "③ 融点・沸点は一定値で現れることを確認する"
                    ]
                  }
                },
                { id: "p1_u", label: "(ウ)", type: "short_answer", correctAnswer: "元素", correctAnswerRate: 85,
                  detailedExplanation: {
                    theme: "単体・化合物の分類基準",
                    type: "構造発見型",
                    steps: [
                      "① 純物質の内部分類についての記述であると確認する",
                      "② 単体と化合物は元素の種類数で区別されると想起する",
                      "③ 粒子ではなく元素に着目する必要があると判断する"
                    ]
                  }
                },
                { id: "p1_e", label: "(エ)", type: "short_answer", correctAnswer: "単体", correctAnswerRate: 85,
                  detailedExplanation: {
                    theme: "単体の定義",
                    type: "演繹型",
                    steps: [
                      "① 「1種類の（ウ）」という条件に注目する",
                      "② （ウ）が元素であることを確認する",
                      "③ 元素が1種類のみの物質の名称を想起する"
                    ]
                  }
                },
                { id: "p1_o", label: "(オ)", type: "short_answer", correctAnswer: "化合物", correctAnswerRate: 85,
                  detailedExplanation: {
                    theme: "化合物の定義",
                    type: "演繹型",
                    steps: [
                      "① 「2種類以上の（ウ）」という条件に注目する",
                      "② 複数元素からなる純物質の名称を想起する",
                      "③ 単体との対比で整理する"
                    ]
                  }
                },
                { id: "p1_ka", label: "(カ)", type: "short_answer", correctAnswer: "臭素", correctAnswerRate: 85,
                  detailedExplanation: {
                    theme: "常温で液体の単体",
                    type: "知識再生型",
                    steps: [
                      "① 単体の状態（常温）に関する知識を問う問題と判断する",
                      "② 常温で液体の単体を思い出す",
                      "③ 水銀は既出であることを確認する"
                    ]
                  }
                },
                { id: "p1_ki", label: "(キ)", type: "short_answer", correctAnswer: "2", correctAnswerRate: 85,
                  detailedExplanation: {
                    theme: "混合物の定義",
                    type: "構造発見型",
                    steps: [
                      "① 「混合物」の定義を問う空欄であることを確認する",
                      "② 純物質との違いは粒子の種類数であることを想起する",
                      "③ 混合物は2種類以上の粒子からなることを確認する"
                    ]
                  }
                },
                { id: "p1_ku", label: "(ク)", type: "short_answer", correctAnswer: "割合（または組成）", correctAnswerRate: 85,
                  detailedExplanation: {
                    theme: "混合物の性質決定要因",
                    type: "構造発見型",
                    steps: [
                      "① 混合物の性質が何によって変わるかを問う文であると確認する",
                      "② 混合物は複数成分からなることを確認する",
                      "③ 各成分の量的関係が性質に影響することを想起する"
                    ]
                  }
                },
                { id: "p1_ke", label: "(ケ)", type: "multiple_choice", options: ["等しく", "異"], correctAnswer: "異", correctAnswerRate: 85,
                  detailedExplanation: {
                    theme: "混合物の性質（一定性）",
                    type: "演繹型",
                    steps: [
                      "① （ク）で割合が変わることを前提にする",
                      "② 割合が変化すると性質も変わることを確認する",
                      "③ 一定か変化するかで判断する"
                    ]
                  }
                },
                { id: "p1_ko", label: "(コ)", type: "short_answer", correctAnswer: "物理", correctAnswerRate: 85,
                  detailedExplanation: {
                    theme: "分離法（物理的方法）",
                    type: "概念区別型",
                    steps: [
                      "① ろ過・蒸留の操作内容を思い出す",
                      "② 操作によって物質の本質が変化するかを確認する",
                      "③ 化学変化が起きていないことを判断する"
                    ]
                  }
                },
                { id: "p1_sa", label: "(サ)", type: "short_answer", correctAnswer: "化学", correctAnswerRate: 85,
                  detailedExplanation: {
                    theme: "分解法（化学的方法）",
                    type: "概念区別型",
                    steps: [
                      "① 電気分解の操作内容を思い出す",
                      "② 元の物質が別の物質に変化しているかを確認する",
                      "③ 化学変化が起きていると判断する"
                    ]
                  }
                }
              ],
              explanation: JSON.stringify({
  "type": "logic_thought",
  "phase1": {
    "title": "フェーズ1：ロジック構造の分析（ユーザー確認フェーズ）",
    "overview": {
      "theme": "物質の分類（純物質と混合物、単体と化合物）および、構成要素の概念（元素と単体の区別）",
      "type": "演繹型（既知知識の適用）",
      "concepts": "純物質、混合物、単体、化合物、元素、同素体、物理的変化（分離）、化学的変化（分解）"
    },
    "tree": "【物質の分類と判別プロセス】\n│\n├─ 条件：物理的に分けられるか？ [Step 1]\n│   ├─ はい（分離可能・融点一定でない）\n│   │   └─ 結論：【混合物】 [問1, 問2] [Step 2]\n│   │\n│   └─ いいえ（分離不可・1種類の物質）\n│       └─ 結論：【純物質】 [問1] [Step 3]\n│           │\n│           ├─ 条件：構成元素が1種類か？\n│           │   ├─ いいえ（化学的に分解可能）\n│           │   │   └─ 結論：【化合物】 [問1, 問2] [Step 4]\n│           │   │\n│           │   └─ はい（分解不可）\n│           │       └─ 結論：【単体】 [問1, 問2] [Step 5]\n│           │\n│           └─ 条件：文脈における「名前」の使われ方\n│               ├─ 実際に存在する物質（性質・状態・反応）\n│               │   └─ 結論：【単体】 [問3] [Step 6]\n│               │\n│               └─ 物質の成分（構成要素・含有）\n│                   └─ 結論：【元素】 [問3] [Step 7]",
    "steps": [
      {
        "step": "Step 1",
        "tag": "条件抽出",
        "target": "物理的に分けられるか？",
        "content": "物質を分ける最初の基準として、<u>物理的な方法</u>（ろ過や蒸留など）で分離可能かを確認する。",
        "knowledge": "純物質と混合物の定義",
        "purpose": "純物質と混合物を大別する。"
      },
      {
        "step": "Step 2",
        "tag": "分類理解",
        "target": "混合物の性質と具体例",
        "content": "物理的に分けられるものは<u>混合物</u>であり、成分の割合によって性質が異なることを理解する。",
        "knowledge": "混合物の性質",
        "purpose": "混合物に関する問題（問1, 問2）を解く。"
      },
      {
        "step": "Step 3",
        "tag": "性質理解",
        "target": "純物質の性質",
        "content": "物理的に分けられないものは<u>純物質</u>であり、融点や沸点が一定であることを理解する。",
        "knowledge": "純物質の性質",
        "purpose": "純物質に関する問題（問1）を解く。"
      },
      {
        "step": "Step 4",
        "tag": "分類理解",
        "target": "化合物の定義と具体例",
        "content": "純物質のうち、2種類以上の元素からなるものを<u>化合物</u>とし、化学的に分解可能であることを理解する。",
        "knowledge": "化合物の定義",
        "purpose": "化合物に関する問題（問1, 問2）を解く。"
      },
      {
        "step": "Step 5",
        "tag": "分類理解",
        "target": "単体の定義と具体例",
        "content": "純物質のうち、1種類の元素からなるものを<u>単体</u>とし、これ以上分解できないことを理解する。",
        "knowledge": "単体の定義",
        "purpose": "単体に関する問題（問1, 問2）を解く。"
      },
      {
        "step": "Step 6",
        "tag": "文脈判断",
        "target": "単体としての使われ方",
        "content": "文脈において、実際に存在する物質（性質・状態・反応）を指している場合は<u>「単体」</u>と判断する。",
        "knowledge": "単体と元素の区別",
        "purpose": "問3の単体を特定する。"
      },
      {
        "step": "Step 7",
        "tag": "文脈判断",
        "target": "元素としての使われ方",
        "content": "文脈において、物質の成分（構成要素・含有）を指している場合は<u>「元素」</u>と判断する。",
        "knowledge": "単体と元素の区別",
        "purpose": "問3の元素を特定する。"
      }
    ]
  },
  "phase2": {
    "title": "フェーズ2：解答プロセスの構築（解説生成フェーズ）",
    "explanations": [
  {
    "step": "Step 1",
    "tag": "定義確認",
    "subQuestionIds": [
      "p1_a",
      "p1_i",
      "p1_u",
      "p1_e",
      "p1_o",
      "p1_ka",
      "p1_ki",
      "p1_ku",
      "p1_ke",
      "p1_ko",
      "p1_sa"
    ],
    "subQuestionLabels": [
      "問1(ア)",
      "問1(イ)",
      "問1(ウ)",
      "問1(エ)",
      "問1(オ)",
      "問1(カ)",
      "問1(キ)",
      "問1(ク)",
      "問1(ケ)",
      "問1(コ)",
      "問1(サ)"
    ],
    "content": "【ロジック内容】\n物質を分ける最初の基準は「物理的に分けられるか」です。\n\n物理的な方法（ろ過や蒸留など）で分けられるものは「混合物」、分けられないものは「純物質」となります。\n純物質は「1種類」の粒子からできています。"
  },
  {
    "step": "Step 2",
    "tag": "性質・分類",
    "subQuestionIds": [
      "q2_1",
      "q2_3",
      "q2_6"
    ],
    "subQuestionLabels": [
      "問2(1)",
      "問2(3)",
      "問2(6)"
    ],
    "content": "【ロジック内容】\n混合物の性質と具体例を確認します。\n\n混合物は、成分の「割合」によって融点や沸点が「異」なります。\n具体例として、空気（窒素や酸素など）、食塩水（水と塩化ナトリウム）、石油（様々な炭化水素）などが挙げられます。"
  },
  {
    "step": "Step 3",
    "tag": "性質理解",
    "subQuestionIds": [
      "p1_i"
    ],
    "subQuestionLabels": [
      "問1(イ)"
    ],
    "content": "【ロジック内容】\n純物質の性質を確認します。\n\n純物質は組成が一定であるため、融点や沸点、密度などの値は物質ごとに「等しく」なります。"
  },
  {
    "step": "Step 4",
    "tag": "定義・分類",
    "subQuestionIds": [
      "q2_4"
    ],
    "subQuestionLabels": [
      "問2(4)"
    ],
    "content": "【ロジック内容】\n化合物の定義と具体例を確認します。\n\n純物質のうち、2種類以上の元素からなるものを「化合物」といいます。\n化合物を分解するには、電気分解などの「化学」的な方法が必要です。\n具体例として、メタン（CH₄）などが挙げられます。"
  },
  {
    "step": "Step 5",
    "tag": "定義・分類",
    "subQuestionIds": [
      "q2_2",
      "q2_5"
    ],
    "subQuestionLabels": [
      "問2(2)",
      "問2(5)"
    ],
    "content": "【ロジック内容】\n単体の定義と具体例を確認します。\n\n純物質のうち、1種類の「元素」からなるものを「単体」といいます。\n具体例として、酸素（O₂）、黒鉛（C）などが挙げられます。\nまた、室温で液体の単体は「臭素」と水銀のみです。"
  },
  {
    "step": "Step 6",
    "tag": "文脈判断",
    "subQuestionIds": [
      "q3_2",
      "q3_4"
    ],
    "subQuestionLabels": [
      "問3(2)",
      "問3(4)"
    ],
    "content": "【ロジック内容】\n文脈における「単体」の使われ方を確認します。\n\n「実際に存在する物質（性質・状態・反応）」を指している場合は「単体」です。\n・乾燥空気の体積の約78％は窒素（N₂という気体）\n・水を電気分解すると、水素と酸素を生じる（H₂とO₂という気体が発生）"
  },
  {
    "step": "Step 7",
    "tag": "文脈判断",
    "subQuestionIds": [
      "q3_1",
      "q3_3"
    ],
    "subQuestionLabels": [
      "問3(1)",
      "問3(3)"
    ],
    "content": "【ロジック内容】\n文脈における「元素」の使われ方を確認します。\n\n「物質の成分（構成要素・含有）」を指している場合は「元素」です。\n・植物の生育には、窒素（Nという成分）が欠かせない\n・砂糖は、炭素や水素、酸素（C, H, Oという成分）からなる物質である"
  }
],
    "stumblingPoints": [
      {
        "step": "Step 1",
        "type": "概念混同",
        "content": "・入試のひっかけポイント：「名称は1つの単語に見えるが、実は水溶液（混合物）」というパターンに注意しましょう。\n代表例：塩酸（塩化水素の水溶液）、アンモニア水（アンモニアの水溶液）。これらは化学式「HCl」「NH₃」だけで表すことはできず、水（H₂O）との混合物です。"
      },
      {
        "step": "Step 3",
        "type": "適用失敗",
        "content": "目的：文脈から「単体（実体）」と「元素（成分）」を論理的に切り分ける基準の再構築。\n以下の2つの文について、下線部が「単体」か「元素」か答えなさい。\nA：「カルシウムは、水と激しく反応して水素を発生する。」\nB：「牛乳には、カルシウムが豊富に含まれている。」\n（解答：Aは実際に反応している「実体」なので単体。Bは牛乳の中に金属の塊が入っているわけではなく「成分」なので元素。）"
      }
    ]
  }
}),
              surroundingKnowledge: [],
              deepDiveTopics: []
            },
            {
              id: "p_c1_1_2",
              category: "物質の分類",
              text: "問２ 次の（１）〜（１５）の物質を、【Ａ：単体】【Ｂ：化合物】【Ｃ：混合物】に分類しなさい。\n\n（１） 酸素　　（２） 海水　　（３） 塩化ナトリウム　　（４） 塩酸　　（５） アンモニア\n（６） 空気　　（７） 石油（原油）　　（８） 鉄　　（９） プロパン　　（１０） ガソリン\n（１１） 水　　（１２） 木材　　（１３） キセノン　　（１４） 二酸化炭素　　（１５） 炭酸水素ナトリウム",
              subQuestions: [
                { id: "p2_1", label: "(1) 酸素", type: "multiple_choice", options: ["A", "B", "C"], correctAnswer: "A", correctAnswerRate: 85, detailedExplanation: { theme: "物質分類", type: "演繹型", steps: ["① 対象が単一物質かどうかを確認する", "② 酸素は1種類の元素のみからなることを想起する", "③ 他成分が含まれていないことを確認する", "④ 元素数に基づいて分類基準を適用する", "⑤ 分類を確定する"] } },
                { id: "p2_2", label: "(2) 海水", type: "multiple_choice", options: ["A", "B", "C"], correctAnswer: "C", correctAnswerRate: 85, detailedExplanation: { theme: "物質分類", type: "演繹型", steps: ["① 複数の物質（水・塩など）が含まれていることを確認する", "② 成分が物理的に混ざっている状態であると判断する", "③ 組成が一定でないことを確認する", "④ 純物質ではないと判断する", "⑤ 分類を確定する"] } },
                { id: "p2_3", label: "(3) 塩化ナトリウム", type: "multiple_choice", options: ["A", "B", "C"], correctAnswer: "B", correctAnswerRate: 85, detailedExplanation: { theme: "物質分類", type: "演繹型", steps: ["① NaとClの2種類の元素からなることを確認する", "② 一定比で結びついた物質であると判断する", "③ 混合物ではないことを確認する", "④ 元素数に基づいて分類する", "⑤ 分類を確定する"] } },
                { id: "p2_4", label: "(4) 塩酸", type: "multiple_choice", options: ["A", "B", "C"], correctAnswer: "C", correctAnswerRate: 85, detailedExplanation: { theme: "物質分類", type: "演繹型", steps: ["① 塩化水素が水に溶けた溶液であることを確認する", "② 複数成分が含まれていることを判断する", "③ 組成が変化しうることを確認する", "④ 混合物であると判断する", "⑤ 分類を確定する"] } },
                { id: "p2_5", label: "(5) アンモニア", type: "multiple_choice", options: ["A", "B", "C"], correctAnswer: "B", correctAnswerRate: 85, detailedExplanation: { theme: "物質分類", type: "演繹型", steps: ["① 窒素と水素からなることを確認する", "② 一定組成の物質であることを判断する", "③ 混合物ではないことを確認する", "④ 元素が複数であることから分類する", "⑤ 分類を確定する"] } },
                { id: "p2_6", label: "(6) 空気", type: "multiple_choice", options: ["A", "B", "C"], correctAnswer: "C", correctAnswerRate: 85, detailedExplanation: { theme: "物質分類", type: "演繹型", steps: ["① 複数の気体が含まれていることを確認する", "② 成分が一定でないことを判断する", "③ 混合状態であることを確認する", "④ 純物質ではないと判断する", "⑤ 分類を確定する"] } },
                { id: "p2_7", label: "(7) 石油（原油）", type: "multiple_choice", options: ["A", "B", "C"], correctAnswer: "C", correctAnswerRate: 85, detailedExplanation: { theme: "物質分類", type: "演繹型", steps: ["① 多種類の炭化水素を含むことを確認する", "② 成分が一定でないことを判断する", "③ 混合物であることを確認する", "④ 分離可能であることを想起する", "⑤ 分類を確定する"] } },
                { id: "p2_8", label: "(8) 鉄", type: "multiple_choice", options: ["A", "B", "C"], correctAnswer: "A", correctAnswerRate: 85, detailedExplanation: { theme: "物質分類", type: "演繹型", steps: ["① Feのみからなることを確認する", "② 他成分が含まれていないことを判断する", "③ 単一元素で構成されることを確認する", "④ 分類基準を適用する", "⑤ 分類を確定する"] } },
                { id: "p2_9", label: "(9) プロパン", type: "multiple_choice", options: ["A", "B", "C"], correctAnswer: "B", correctAnswerRate: 85, detailedExplanation: { theme: "物質分類", type: "演繹型", steps: ["① 炭素と水素からなることを確認する", "② 一定組成の物質であると判断する", "③ 混合物ではないことを確認する", "④ 元素が複数であることから分類する", "⑤ 分類を確定する"] } },
                { id: "p2_10", label: "(10) ガソリン", type: "multiple_choice", options: ["A", "B", "C"], correctAnswer: "C", correctAnswerRate: 85, detailedExplanation: { theme: "物質分類", type: "演繹型", steps: ["① 多種類の炭化水素の混合であることを確認する", "② 成分比が一定でないことを判断する", "③ 混合物であることを確認する", "④ 分離可能であることを想起する", "⑤ 分類を確定する"] } },
                { id: "p2_11", label: "(11) 水", type: "multiple_choice", options: ["A", "B", "C"], correctAnswer: "B", correctAnswerRate: 85, detailedExplanation: { theme: "物質分類", type: "演繹型", steps: ["① 水素と酸素からなることを確認する", "② 一定組成であることを判断する", "③ 単体ではないことを確認する", "④ 元素が複数であることから分類する", "⑤ 分類を確定する"] } },
                { id: "p2_12", label: "(12) 木材", type: "multiple_choice", options: ["A", "B", "C"], correctAnswer: "C", correctAnswerRate: 85, detailedExplanation: { theme: "物質分類", type: "演繹型", steps: ["① セルロースなど複数成分からなることを確認する", "② 成分が均一でないことを判断する", "③ 混合物であることを確認する", "④ 純物質ではないと判断する", "⑤ 分類を確定する"] } },
                { id: "p2_13", label: "(13) キセノン", type: "multiple_choice", options: ["A", "B", "C"], correctAnswer: "A", correctAnswerRate: 85, detailedExplanation: { theme: "物質分類", type: "演繹型", steps: ["① 希ガス元素であることを確認する", "② 単一元素からなることを判断する", "③ 他成分が含まれていないことを確認する", "④ 分類基準を適用する", "⑤ 分類を確定する"] } },
                { id: "p2_14", label: "(14) 二酸化炭素", type: "multiple_choice", options: ["A", "B", "C"], correctAnswer: "B", correctAnswerRate: 85, detailedExplanation: { theme: "物質分類", type: "演繹型", steps: ["① 炭素と酸素からなることを確認する", "② 一定組成であることを判断する", "③ 混合物ではないことを確認する", "④ 元素が複数であることから分類する", "⑤ 分類を確定する"] } },
                { id: "p2_15", label: "(15) 炭酸水素ナトリウム", type: "multiple_choice", options: ["A", "B", "C"], correctAnswer: "B", correctAnswerRate: 85, detailedExplanation: { theme: "物質分類", type: "演繹型", steps: ["① Na・H・C・Oからなることを確認する", "② 一定組成の物質であると判断する", "③ 混合物ではないことを確認する", "④ 元素が複数であることから分類する", "⑤ 分類を確定する"] } }
              ],
              explanation: "{\"type\": \"logic_thought\", \"phase1\": {\"title\": \"物質の分類\", \"overview\": \"物質を混合物、単体、化合物に分類する論理を整理します。\", \"tree\": \"物質\\n├ Step 1: 物質の分類\\n│ ├ 純物質\\n│ │ ├ 単体\\n│ │ └ 化合物\\n│ └ 混合物\\n└ Step 2: 物質の性質\", \"steps\": [\"Step 1: 物質の分類\", \"Step 2: 物質の性質\"]}, \"phase2\": {\"explanations\": [{\"step\": \"Step 1: 物質の分類\", \"tag\": \"分類\", \"subQuestionIds\": [\"p2_1\", \"p2_2\", \"p2_3\", \"p2_4\", \"p2_5\", \"p2_6\", \"p2_7\", \"p2_8\", \"p2_9\", \"p2_10\", \"p2_11\", \"p2_12\", \"p2_13\", \"p2_14\", \"p2_15\"], \"content\": \"物質は<u>純物質</u>と<u>混合物</u>に、純物質はさらに<u>単体</u>と<u>化合物</u>に分類されます。\"}], \"stumblingPoints\": []}}",
              surroundingKnowledge: [],
              deepDiveTopics: []
            },
            {
              id: "p_c1_1_3",
              category: "元素と単体",
              text: "問３ 次の(1)〜(10)の下線部は、「単体」と「元素」のどちらの意味で用いられているか。\n\n(1) 負傷者に<u>酸素</u>吸入を行った。\n(2) 水は、<u>水素</u>と<u>酸素</u>からできている。\n(3) <u>カルシウム</u>は、骨や歯に多く含まれている。\n(4) 飛行船には、かつて<u>水素</u>が詰められていたが、現在は<u>ヘリウム</u>が使われる。\n(5) ダイヤモンドは、<u>炭素</u>の同素体である。\n(6) 胃液には、<u>塩素</u>が含まれている。\n(7) 携帯電話のバッテリーには、<u>リチウム</u>が使われている。\n(8) 水を電気分解すると、陰極から<u>水素</u>が発生する。\n(9) <u>鉄</u>は、湿った空気中でさびやすい。\n(10) 地球の空気の約７８％は<u>窒素</u>である。",
              subQuestions: [
                { id: "p3_1", label: "(1)", type: "multiple_choice", options: ["単体", "元素"], correctAnswer: "単体", correctAnswerRate: 85, detailedExplanation: { theme: "単体と元素の文脈判断", type: "文脈判断型", steps: ["① 文が「実際に使用する物質」を指しているか確認する", "② 酸素吸入は気体としての酸素を意味すると判断する", "③ 構成要素ではなく実在物質であると整理する", "④ 元素概念ではないことを確認する", "⑤ 分類を確定する"] } },
                { id: "p3_2", label: "(2)", type: "multiple_choice", options: ["単体", "元素"], correctAnswer: "元素", correctAnswerRate: 85, detailedExplanation: { theme: "単体と元素の文脈判断", type: "文脈判断型", steps: ["① 物質の構成を説明する文であると確認する", "② 水の材料としての水素・酸素に注目する", "③ 構成要素として扱われていると判断する", "④ 単体ではないことを確認する", "⑤ 分類を確定する"] } },
                { id: "p3_3", label: "(3)", type: "multiple_choice", options: ["単体", "元素"], correctAnswer: "元素", correctAnswerRate: 85, detailedExplanation: { theme: "単体と元素の文脈判断", type: "文脈判断型", steps: ["① 物質中に含まれる成分を述べていると確認する", "② カルシウムが構成要素として扱われていると判断する", "③ 実在物質としての挙動ではないと整理する", "④ 元素概念であると判断する", "⑤ 分類を確定する"] } },
                { id: "p3_4", label: "(4)", type: "multiple_choice", options: ["単体", "元素"], correctAnswer: "単体", correctAnswerRate: 85, detailedExplanation: { theme: "単体と元素の文脈判断", type: "文脈判断型", steps: ["① 実際に使用される気体について述べていると確認する", "② 水素・ヘリウムが物質として扱われていると判断する", "③ 構成要素ではないことを確認する", "④ 単体としての扱いであると整理する", "⑤ 分類を確定する"] } },
                { id: "p3_5", label: "(5)", type: "multiple_choice", options: ["単体", "元素"], correctAnswer: "単体", correctAnswerRate: 85, detailedExplanation: { theme: "単体と元素の文脈判断", type: "文脈判断型", steps: ["① 同素体という語に注目する", "② 同素体は同じ元素からなる異なる単体であると想起する", "③ 炭素が物質として扱われていると判断する", "④ 元素概念ではないことを確認する", "⑤ 分類を確定する"] } },
                { id: "p3_6", label: "(6)", type: "multiple_choice", options: ["単体", "元素"], correctAnswer: "元素", correctAnswerRate: 85, detailedExplanation: { theme: "単体と元素の文脈判断", type: "文脈判断型", steps: ["① 胃液の成分について述べていると確認する", "② 塩素が構成要素として含まれていると判断する", "③ 実在物質として単独で扱われていないことを確認する", "④ 元素としての意味であると整理する", "⑤ 分類を確定する"] } },
                { id: "p3_7", label: "(7)", type: "multiple_choice", options: ["単体", "元素"], correctAnswer: "元素", correctAnswerRate: 85, detailedExplanation: { theme: "単体と元素の文脈判断", type: "文脈判断型", steps: ["① 材料として使われていることに注目する", "② リチウムが成分として利用されていると判断する", "③ 構成要素としての意味合いであると整理する", "④ 単体としての扱いではないことを確認する", "⑤ 分類を確定する"] } },
                { id: "p3_8", label: "(8)", type: "multiple_choice", options: ["単体", "元素"], correctAnswer: "単体", correctAnswerRate: 85, detailedExplanation: { theme: "単体と元素の文脈判断", type: "文脈判断型", steps: ["① 発生する気体について述べていると確認する", "② 水素が実際に生成される物質であると判断する", "③ 構成要素ではなく生成物であると整理する", "④ 単体として扱われていると確認する", "⑤ 分類を確定する"] } },
                { id: "p3_9", label: "(9)", type: "multiple_choice", options: ["単体", "元素"], correctAnswer: "単体", correctAnswerRate: 85, detailedExplanation: { theme: "単体と元素の文脈判断", type: "文脈判断型", steps: ["① 物質の性質（さびやすさ）を述べていると確認する", "② 鉄が実在する物質として扱われていると判断する", "③ 構成要素ではないことを確認する", "④ 単体としての性質であると整理する", "⑤ 分類を確定する"] } },
                { id: "p3_10", label: "(10)", type: "multiple_choice", options: ["単体", "元素"], correctAnswer: "単体", correctAnswerRate: 85, detailedExplanation: { theme: "単体と元素の文脈判断", type: "文脈判断型", steps: ["① 空気の成分割合について述べていると確認する", "② 窒素が実在する気体として扱われていると判断する", "③ 構成要素ではなく存在物質であると整理する", "④ 単体としての意味であると確認する", "⑤ 分類を確定する"] } }
              ],
              explanation: "{\"type\": \"logic_thought\", \"phase1\": {\"title\": \"元素と単体の識別\", \"overview\": \"文脈から「単体」と「元素」を識別する論理を整理します。\", \"tree\": \"Step 3: 単体と元素の識別\\n├ 単体（実体）：物質として存在\\n└ 元素（成分）：成分として存在\", \"steps\": [\"Step 3: 単体と元素の識別\"]}, \"phase2\": {\"explanations\": [{\"step\": \"Step 3: 単体と元素の識別\", \"tag\": \"判断\", \"subQuestionIds\": [\"p3_1\", \"p3_2\", \"p3_3\", \"p3_4\", \"p3_5\", \"p3_6\", \"p3_7\", \"p3_8\", \"p3_9\", \"p3_10\"], \"content\": \"実際に存在する物質（実体）なら<u>単体</u>、構成成分（概念）なら<u>元素</u>と判断します。\"}], \"stumblingPoints\": []}}",
              surroundingKnowledge: [],
              deepDiveTopics: []
            }
          ],
          miniTest: [
            {
              id: "q1",
              category: "物質の分類と性質",
              text: "物質の分類と性質に関する次の文章を読み、あとの問いに答えよ。\n\n物質は、現在およそ120種類存在する原子の種類である「元素」から構成されている。物質は大きく分けると、1種類の物質でできている ( ア ) と、2種類以上の ( ア ) が混じり合った ( イ ) に分けられる。 ( ア ) は、酸素や鉄のように1種類の元素からできている ( ウ ) と、水や塩化ナトリウムのように2種類以上の元素からできている ( エ ) が存在する\n\nまた、物質を区別する上で、融点や沸点、密度といった性質も重要である。( ア ) の場合はこれらの値が物質ごとに ( オ ) となるが、( イ ) の場合は、混じっている物質の種類やその割合によって値が ( カ ) するという違いがある。この違いは、①<u>水とエタノールなどの加熱</u>で確認をすることができる。\n\n問1 文章中の空欄 ( ア ) ～ ( カ ) に入る最も適切な語句を答えよ。",
              subQuestions: [
                { id: "q1_a", label: "(ア)", type: "short_answer", correctAnswer: "純物質", correctAnswerRate: 85,
                  detailedExplanation: {
                    theme: "物質の分類（純物質）",
                    type: "知識再生型",
                    steps: [
                      "① 物質が「1種類の物質でできている」という条件を確認する",
                      "② 物質の分類において、1種類の物質からなるものを何と呼ぶか想起する",
                      "③ 「純物質」と「混合物」の定義の違いを比較する",
                      "④ 2種類以上の物質が混じり合った「混合物」を誤答として排除する",
                      "⑤ 条件に合致する「純物質」を最終判断とする"
                    ]
                  }
                },
                { id: "q1_b", label: "(イ)", type: "short_answer", correctAnswer: "混合物", correctAnswerRate: 85,
                  detailedExplanation: {
                    theme: "物質の分類（混合物）",
                    type: "知識再生型",
                    steps: [
                      "① 物質が「2種類以上の(ア)が混じり合った」という条件を確認する",
                      "② (ア)が純物質であることを踏まえ、複数の純物質が混ざったものを何と呼ぶか想起する",
                      "③ 「純物質」と「混合物」の定義の違いを比較する",
                      "④ 1種類の物質からなる「純物質」を誤答として排除する",
                      "⑤ 条件に合致する「混合物」を最終判断とする"
                    ]
                  }
                },
                { id: "q1_c", label: "(ウ)", type: "short_answer", correctAnswer: "単体", correctAnswerRate: 85,
                  detailedExplanation: {
                    theme: "純物質の分類（単体）",
                    type: "知識再生型",
                    steps: [
                      "① 純物質のうち「1種類の元素からできている」という条件を確認する",
                      "② 純物質が「単体」と「化合物」に分類されることを想起する",
                      "③ 構成する元素の種類数（1種類か2種類以上か）で判断する",
                      "④ 2種類以上の元素からなる「化合物」を誤答として排除する",
                      "⑤ 条件に合致する「単体」を最終判断とする"
                    ]
                  }
                },
                { id: "q1_d", label: "(エ)", type: "short_answer", correctAnswer: "化合物", correctAnswerRate: 85,
                  detailedExplanation: {
                    theme: "純物質の分類（化合物）",
                    type: "知識再生型",
                    steps: [
                      "① 純物質のうち「2種類以上の元素からできている」という条件を確認する",
                      "② 純物質が「単体」と「化合物」に分類されることを想起する",
                      "③ 構成する元素の種類数（1種類か2種類以上か）で判断する",
                      "④ 1種類の元素からなる「単体」を誤答として排除する",
                      "⑤ 条件に合致する「化合物」を最終判断とする"
                    ]
                  }
                },
                { id: "q1_e", label: "(オ)", type: "short_answer", correctAnswer: "一定", correctAnswerRate: 85,
                  detailedExplanation: {
                    theme: "純物質の性質（融点・沸点）",
                    type: "演繹型",
                    steps: [
                      "① (ア)純物質の融点や沸点、密度といった性質について問われていることを確認する",
                      "② 純物質は不純物を含まないため、状態変化の温度がどうなるかを想起する",
                      "③ 物質ごとに固有の値を示すかどうかで判断する",
                      "④ 混合物のように割合で変化する「変化する」「異なる」などの表現を排除する",
                      "⑤ 常に同じ値を示す「一定」を最終判断とする"
                    ]
                  }
                },
                { id: "q1_f", label: "(カ)", type: "short_answer", correctAnswer: "変化", correctAnswerRate: 85,
                  detailedExplanation: {
                    theme: "混合物の性質（融点・沸点）",
                    type: "演繹型",
                    steps: [
                      "① (イ)混合物の融点や沸点、密度といった性質について問われていることを確認する",
                      "② 混合物は混じっている物質の種類や割合によって性質がどうなるかを想起する",
                      "③ 割合に応じて値が変動するかどうかで判断する",
                      "④ 純物質のように固有の値を示す「一定」などの表現を排除する",
                      "⑤ 値が変動することを示す「変化」を最終判断とする"
                    ]
                  }
                }
              ],
              explanation: "{\"type\": \"logic_thought\", \"phase1\": {\"title\": \"物質の分類\", \"overview\": \"物質の分類構造を整理します。\", \"tree\": \"物質\\n├ Step 1: 物質の分類\\n│ ├ 純物質\\n│ │ ├ 単体\\n│ │ └ 化合物\\n│ └ 混合物\\n└ Step 2: 物質の性質\", \"steps\": [\"Step 1: 物質の分類\", \"Step 2: 物質の性質\"]}, \"phase2\": {\"explanations\": [{\"step\": \"Step 1: 物質の分類\", \"tag\": \"分類\", \"subQuestionIds\": [\"q1_a\", \"q1_b\", \"q1_c\", \"q1_d\"], \"content\": \"物質は<u>純物質</u>と<u>混合物</u>に、純物質はさらに<u>単体</u>と<u>化合物</u>に分類されます。\"}, {\"step\": \"Step 2: 物質の性質\", \"tag\": \"性質\", \"subQuestionIds\": [\"q1_e\", \"q1_f\"], \"content\": \"<u>純物質</u>は性質が一定ですが、<u>混合物</u>は割合により変化します。\"}], \"stumblingPoints\": [{\"node\": \"Step 1: 物質の分類\", \"point\": \"O₂を化合物と誤解する。\"}]}}",
              surroundingKnowledge: [],
              deepDiveTopics: []
            },
            {
              id: "q2",
              category: "物質の分類",
              text: "問2 次の (1)〜(6) の物質は、文章中の( イ )～（ エ ）のどれに分類されるか答えよ。\n(イ) 混合物　(ウ) 単体　(エ) 化合物\n\n(1) 空気　 (2) 酸素　 (3) 食塩水　 (4) メタン　 (5) 黒鉛　(6) 石油",
              subQuestions: [
                { id: "q2_1", label: "(1) 空気", type: "multiple_choice", options: ["(イ)", "(ウ)", "(エ)"], correctAnswer: "(イ)", correctAnswerRate: 85,
                  detailedExplanation: {
                    theme: "物質の分類（空気）",
                    type: "演繹型",
                    steps: [
                      "① 空気の成分について確認する",
                      "② 窒素、酸素、アルゴンなど複数の気体が含まれていることを想起する",
                      "③ 複数の純物質が混ざっている状態であると判断する",
                      "④ 単一の物質ではないため「単体」「化合物」を排除する",
                      "⑤ 「混合物」である(イ)を最終判断とする"
                    ]
                  }
                },
                { id: "q2_2", label: "(2) 酸素", type: "multiple_choice", options: ["(イ)", "(ウ)", "(エ)"], correctAnswer: "(ウ)", correctAnswerRate: 85,
                  detailedExplanation: {
                    theme: "物質の分類（酸素）",
                    type: "演繹型",
                    steps: [
                      "① 酸素の構成要素について確認する",
                      "② 酸素はOという1種類の元素のみからなることを想起する",
                      "③ 1種類の元素からなる純物質であると判断する",
                      "④ 複数の物質が混ざった「混合物」や、複数の元素からなる「化合物」を排除する",
                      "⑤ 「単体」である(ウ)を最終判断とする"
                    ]
                  }
                },
                { id: "q2_3", label: "(3) 食塩水", type: "multiple_choice", options: ["(イ)", "(ウ)", "(エ)"], correctAnswer: "(イ)", correctAnswerRate: 85,
                  detailedExplanation: {
                    theme: "物質の分類（食塩水）",
                    type: "演繹型",
                    steps: [
                      "① 食塩水の成分について確認する",
                      "② 水（溶媒）と塩化ナトリウム（溶質）が含まれていることを想起する",
                      "③ 複数の純物質が混ざっている状態であると判断する",
                      "④ 単一の物質ではないため「単体」「化合物」を排除する",
                      "⑤ 「混合物」である(イ)を最終判断とする"
                    ]
                  }
                },
                { id: "q2_4", label: "(4) メタン", type: "multiple_choice", options: ["(イ)", "(ウ)", "(エ)"], correctAnswer: "(エ)", correctAnswerRate: 85,
                  detailedExplanation: {
                    theme: "物質の分類（メタン）",
                    type: "演繹型",
                    steps: [
                      "① メタンの構成要素について確認する",
                      "② 炭素(C)と水素(H)の2種類の元素からなることを想起する",
                      "③ 2種類以上の元素からなる純物質であると判断する",
                      "④ 1種類の元素からなる「単体」や、複数の物質が混ざった「混合物」を排除する",
                      "⑤ 「化合物」である(エ)を最終判断とする"
                    ]
                  }
                },
                { id: "q2_5", label: "(5) 黒鉛", type: "multiple_choice", options: ["(イ)", "(ウ)", "(エ)"], correctAnswer: "(ウ)", correctAnswerRate: 85,
                  detailedExplanation: {
                    theme: "物質の分類（黒鉛）",
                    type: "演繹型",
                    steps: [
                      "① 黒鉛の構成要素について確認する",
                      "② 黒鉛は炭素(C)という1種類の元素のみからなることを想起する",
                      "③ 1種類の元素からなる純物質であると判断する",
                      "④ 複数の物質が混ざった「混合物」や、複数の元素からなる「化合物」を排除する",
                      "⑤ 「単体」である(ウ)を最終判断とする"
                    ]
                  }
                },
                { id: "q2_6", label: "(6) 石油", type: "multiple_choice", options: ["(イ)", "(ウ)", "(エ)"], correctAnswer: "(イ)", correctAnswerRate: 85,
                  detailedExplanation: {
                    theme: "物質の分類（石油）",
                    type: "演繹型",
                    steps: [
                      "① 石油の成分について確認する",
                      "② 多種類の炭化水素が含まれていることを想起する",
                      "③ 複数の純物質が混ざっている状態であると判断する",
                      "④ 単一の物質ではないため「単体」「化合物」を排除する",
                      "⑤ 「混合物」である(イ)を最終判断とする"
                    ]
                  }
                }
              ],
              explanation: JSON.stringify({
                "type": "logic_thought",
                "phase1": {
                  "title": "物質の分類",
                  "overview": "物質を混合物、単体、化合物に分類する論理を整理します。",
                  "tree": "物質の分類\n├ Step 1: 混合物の判別\n│ └ 複数成分が混ざっているか？\n└ Step 2: 純物質の分類\n  ├ 単体（1種類）\n  └ 化合物（2種類以上）",
                  "steps": ["Step 1: 混合物の判別", "Step 2: 純物質の分類"]
                },
                "phase2": {
                  "explanations": [
                    {
                      "step": "Step 1",
                      "tag": "混合物の判別",
                      "subQuestionIds": ["q2_1", "q2_3", "q2_6"],
                      "subQuestionLabels": ["(1) 空気", "(3) 食塩水", "(6) 石油"],
                      "content": "空気や食塩水、石油などは「複数の純物質が混ざったもの」なので混合物です。"
                    },
                    {
                      "step": "Step 2",
                      "tag": "純物質の分類",
                      "subQuestionIds": ["q2_2", "q2_4", "q2_5"],
                      "subQuestionLabels": ["(2) 酸素", "(4) メタン", "(5) 黒鉛"],
                      "content": "酸素や黒鉛は1種類の元素からなる「単体」、メタンは2種類以上の元素からなる「化合物」です。"
                    }
                  ]
                }
              }),
              surroundingKnowledge: [],
              deepDiveTopics: []
            },
            {
              id: "q3",
              category: "元素と単体",
              text: "問３ 物質の構成成分としての「元素」と、実際に存在する物質としての「単体」を区別することは非常に重要である。次の (1)〜(4) の下線部が、「単体」と「元素」のどちらの意味で用いられているか答えよ。\n\n(1) 植物の生育には、<u>窒素</u>が欠かせない。\n(2) 乾燥空気の体積の約78％は<u>窒素</u>である。\n(3) 砂糖は、<u>炭素</u>や<u>水素</u>、<u>酸素</u>からなる物質である。\n(4) 水を電気分解すると、<u>水素</u>と<u>酸素</u>を生じる。",
              subQuestions: [
                { id: "q3_1", label: "(1)", type: "multiple_choice", options: ["元素", "単体"], correctAnswer: "元素", correctAnswerRate: 85,
                  detailedExplanation: {
                    theme: "単体と元素の文脈判断",
                    type: "文脈判断型",
                    steps: [
                      "① 文が「実際に使用する物質」か「構成成分」かを判断する",
                      "② 植物の生育に欠かせない「窒素」は、肥料などに含まれる成分としての窒素を指していると確認する",
                      "③ 窒素ガス（気体）そのものを吸収しているわけではないことを想起する",
                      "④ 実在する物質としての「単体」を誤答として排除する",
                      "⑤ 成分としての意味である「元素」を最終判断とする"
                    ]
                  }
                },
                { id: "q3_2", label: "(2)", type: "multiple_choice", options: ["元素", "単体"], correctAnswer: "単体", correctAnswerRate: 85,
                  detailedExplanation: {
                    theme: "単体と元素の文脈判断",
                    type: "文脈判断型",
                    steps: [
                      "① 文が「実際に使用する物質」か「構成成分」かを判断する",
                      "② 空気の体積の約78％を占める「窒素」は、気体として実在する物質を指していると確認する",
                      "③ 窒素分子（N₂）という具体的な物質の存在割合を述べていることを想起する",
                      "④ 抽象的な成分としての「元素」を誤答として排除する",
                      "⑤ 実在する物質としての意味である「単体」を最終判断とする"
                    ]
                  }
                },
                { id: "q3_3", label: "(3)", type: "multiple_choice", options: ["元素", "単体"], correctAnswer: "元素", correctAnswerRate: 85,
                  detailedExplanation: {
                    theme: "単体と元素の文脈判断",
                    type: "文脈判断型",
                    steps: [
                      "① 文が「実際に使用する物質」か「構成成分」かを判断する",
                      "② 砂糖を構成する「炭素」「水素」「酸素」は、物質の材料（成分）を指していると確認する",
                      "③ 砂糖の中に黒鉛（炭素の単体）や水素ガスが含まれているわけではないことを想起する",
                      "④ 実在する物質としての「単体」を誤答として排除する",
                      "⑤ 成分としての意味である「元素」を最終判断とする"
                    ]
                  }
                },
                { id: "q3_4", label: "(4)", type: "multiple_choice", options: ["元素", "単体"], correctAnswer: "単体", correctAnswerRate: 85,
                  detailedExplanation: {
                    theme: "単体と元素の文脈判断",
                    type: "文脈判断型",
                    steps: [
                      "① 文が「実際に使用する物質」か「構成成分」かを判断する",
                      "② 水を電気分解して生じる「水素」と「酸素」は、発生した気体そのものを指していると確認する",
                      "③ 実際に集めることができる実在の物質であることを想起する",
                      "④ 抽象的な成分としての「元素」を誤答として排除する",
                      "⑤ 実在する物質としての意味である「単体」を最終判断とする"
                    ]
                  }
                }
              ],
              explanation: JSON.stringify({
                "type": "logic_thought",
                "phase1": {
                  "title": "元素と単体の識別",
                  "overview": "文脈から「単体」と「元素」を識別する論理を整理します。",
                  "tree": "単体と元素の識別\n└ Step 3: 文脈判断\n  ├ 単体（実体）：物質として存在\n  └ 元素（成分）：成分として存在",
                  "steps": ["Step 3: 文脈判断"]
                },
                "phase2": {
                  "explanations": [
                    {
                      "step": "Step 3",
                      "tag": "文脈判断",
                      "subQuestionIds": ["q3_1", "q3_2", "q3_3", "q3_4"],
                      "subQuestionLabels": ["(1)", "(2)", "(3)", "(4)"],
                      "content": "見分けるコツは「直接触れられるもの（ガスとして実体がある、など）＝単体」、「直接触れられないもの（成分として含まれている、など）＝元素」と考えることです。(2)や(4)は気体として実体があるので単体、(1)や(3)は成分の話をしているので元素となります。"
                    }
                  ]
                }
              }),
              surroundingKnowledge: [],
              deepDiveTopics: []
            },
            {
              id: "q4",
              category: "状態変化のグラフ",
              text: `問４　下線部①は、水・エタノールの（ ア ）の加熱と、水とエタノールの（ イ ）の加熱のグラフを示したものである。この３つのグラフ①～③をそれぞれ、水のグラフ・エタノールのグラフ・水とエタノールの混合物のグラフに分類し、①～③で示せ。\n\n<img src="https://lh3.googleusercontent.com/d/1yxjXWysRGIgYKPMpQx_N9OWYNf_W6DvT" alt="加熱のグラフ" class="w-full max-w-md mx-auto my-4 rounded-lg shadow-sm border border-gray-200" referrerPolicy="no-referrer" />`,
              subQuestions: [
                { id: "q4_1", label: "水のグラフ", type: "multiple_choice", options: ["①", "②", "③"], correctAnswer: "①", correctAnswerRate: 85,
                  detailedExplanation: {
                    theme: "状態変化のグラフ（水）",
                    type: "演繹型",
                    steps: [
                      "① 水が純物質であることを確認する",
                      "② 純物質の加熱グラフの特徴を想起する",
                      "③ 沸騰中（状態変化中）は温度が一定に保たれることを確認する",
                      "④ 温度が変化し続けるグラフ②を排除する",
                      "⑤ 水の沸点が100℃であることから、100℃で一定になるグラフ①を最終判断とする"
                    ]
                  }
                },
                { id: "q4_2", label: "エタノールのグラフ", type: "multiple_choice", options: ["①", "②", "③"], correctAnswer: "③", correctAnswerRate: 85,
                  detailedExplanation: {
                    theme: "状態変化のグラフ（エタノール）",
                    type: "演繹型",
                    steps: [
                      "① エタノールが純物質であることを確認する",
                      "② 純物質の加熱グラフの特徴を想起する",
                      "③ 沸騰中（状態変化中）は温度が一定に保たれることを確認する",
                      "④ 温度が変化し続けるグラフ②を排除する",
                      "⑤ エタノールの沸点が約78℃であることから、約78℃で一定になるグラフ③を最終判断とする"
                    ]
                  }
                },
                { id: "q4_3", label: "水とエタノールの( イ )のグラフ", type: "multiple_choice", options: ["①", "②", "③"], correctAnswer: "②", correctAnswerRate: 85,
                  detailedExplanation: {
                    theme: "状態変化のグラフ（混合物）",
                    type: "演繹型",
                    steps: [
                      "① 水とエタノールの(イ)が混合物であることを確認する",
                      "② 混合物の加熱グラフの特徴を想起する",
                      "③ 沸騰中（状態変化中）も温度が一定に保たれず、徐々に上昇することを確認する",
                      "④ 温度が一定になるグラフ①、③を純物質のグラフとして排除する",
                      "⑤ 沸騰中も温度が変化し続けるグラフ②を最終判断とする"
                    ]
                  }
                }
              ],
              explanation: "{\"type\": \"logic_thought\", \"phase1\": {\"title\": \"状態変化のグラフ\", \"overview\": \"加熱グラフの違いを整理します。\", \"tree\": \"加熱グラフ\\n├ 純物質：温度一定\\n└ 混合物：温度変化\", \"steps\": [\"純物質\", \"混合物\"]}, \"phase2\": {\"explanations\": [{\"step\": \"純物質\", \"tag\": \"分析\", \"subQuestionIds\": [\"q4_1\", \"q4_2\"], \"content\": \"加熱中<u>温度一定</u>です。\"}, {\"step\": \"混合物\", \"tag\": \"分析\", \"subQuestionIds\": [\"q4_3\"], \"content\": \"加熱中<u>温度変化</u>します。\"}], \"stumblingPoints\": []}}",
              surroundingKnowledge: [],
              deepDiveTopics: []
            }
          ]
        },
        {
          id: "c1_2_A",
          abstractTitle: "②-A 物質の分離と精製",
          realTitle: "1章 物質の構成",
          topics: ["分離と精製", "蒸留", "分留", "再結晶", "抽出", "クロマトグラフィー", "昇華法"],
          miniTest: [
            {
              id: "q_c1_2_B_1",
              category: "物質の分離と精製 (問1)",
              text: "B　物質の分離と精製に関する次の文章を読み、あとの問いに答えよ。\n\n自然界に存在する物質の多くは混合物である。混合物から目的の物質を取り出す操作を ( ア ) といい、取り出した物質からさらに不純物を取り除いて純度を高める操作を ( イ ) という。物質の ( ア ) には、物質が持つ様々な性質（沸点、溶解度、吸着力など）の違いが利用される。\n\n液体とそれに溶けない固体の混合物は、ろ紙などを用いた ( ウ ) によって分けることができる。 また、溶液を加熱して沸騰させ、生じた蒸気を冷却して再び液体として取り出す方法を ( エ ) という。この ( エ ) の操作を行う際、使用する器具の名称や装置の組み立てには、いくつかの重要な注意点がある。\n\n沸点の異なる2種類以上の「液体の混合物」から、加熱温度を変えて各成分に分離する操作は特に ( オ ) と呼ばれ、液体空気の分離や原油の精製などに用いられる。\n\n固体物質の分離にも様々な方法がある。少量の不純物を含む固体を熱水などに溶かし、冷却して温度による ( カ ) の違いを利用して純粋な結晶を得る方法を ( キ ) という。また、目的の物質だけをよく溶かす溶媒を用いて混合物から成分を分離する方法を ( ク ) といい、物質の ( ケ ) の違いを利用して分離する方法を ( コ ) という。さらに、ドライアイスやヨウ素のように、固体が液体を経ずに直接気体になる性質を利用して分離する方法を ( サ ) という。\n\n問1 文章中の空欄 ( ア ) ～ ( サ ) に入る最も適切な語句を答えよ。",
              subQuestions: [
                { id: "q1_a", label: "問1 (ア)", type: "short_answer", correctAnswer: "分離", correctAnswerRate: 85 },
                { id: "q1_b", label: "問1 (イ)", type: "short_answer", correctAnswer: "精製", correctAnswerRate: 85 },
                { id: "q1_c", label: "問1 (ウ)", type: "short_answer", correctAnswer: "ろ過", correctAnswerRate: 85 },
                { id: "q1_d", label: "問1 (エ)", type: "short_answer", correctAnswer: "蒸留", correctAnswerRate: 85 },
                { id: "q1_e", label: "問1 (オ)", type: "short_answer", correctAnswer: "分留", correctAnswerRate: 85 },
                { id: "q1_f", label: "問1 (カ)", type: "short_answer", correctAnswer: "溶解度", correctAnswerRate: 85 },
                { id: "q1_g", label: "問1 (キ)", type: "short_answer", correctAnswer: "再結晶", correctAnswerRate: 85 },
                { id: "q1_h", label: "問1 (ク)", type: "short_answer", correctAnswer: "抽出", correctAnswerRate: 85 },
                { id: "q1_i", label: "問1 (ケ)", type: "short_answer", correctAnswer: "吸着力", correctAnswerRate: 85 },
                { id: "q1_j", label: "問1 (コ)", type: "short_answer", correctAnswer: "クロマトグラフィー", correctAnswerRate: 85 },
                { id: "q1_k", label: "問1 (サ)", type: "short_answer", correctAnswer: "昇華法", correctAnswerRate: 85 }
              ],
              explanation: "問1 (ア) 分離　(イ) 精製　(ウ) ろ過　(エ) 蒸留　(オ) 分留 (カ) 溶解度　(キ) 再結晶　(ク) 抽出　(ケ) 吸着力　(コ) クロマトグラフィー　(サ) 昇華法\n解説: 分離と精製の基本用語です。「分離（取り出す）」と「精製（さらに純度を高める）」の違いや、それぞれの分離法が「物質の何の性質の違い（沸点、溶解度など）を利用しているか」はテストでよく狙われるのでセットで覚えておきましょう。",
              surroundingKnowledge: [],
              deepDiveTopics: []
            },
            {
              id: "q_c1_2_B_2",
              category: "物質の分離と精製 (問2)",
              text: "B　（リード文続き）\n...液体とそれに溶けない固体の混合物は、ろ紙などを用いた ( ウ: ろ過 ) によって分けることができる。\n\n問2 ( ウ ) の操作（ろ過）を行う際の注意点について、次の(1)・(2)の理由を簡潔に答えよ。\n(1) 液体をろうとに注ぐ際、直接注がずにガラス棒を伝わらせて注ぐのはなぜか。\n(2) ろうとの足の先端は、受け器のビーカーの内壁に密着させるようにして置くのはなぜか。",
              subQuestions: [
                { id: "q2_1_reason", label: "問2 (1) 理由", type: "descriptive", correctAnswer: "液体が周囲に飛び散るのを防ぐため", gradingCriteria: ["液体が周囲に飛び散るのを防ぐため"], correctAnswerRate: 85 },
                { id: "q2_2_reason", label: "問2 (2) 理由", type: "descriptive", correctAnswer: "ろ過された液体が壁面を伝わってスムーズに落ちるようにするため", gradingCriteria: ["ろ過された液体が壁面を伝わってスムーズに落ちるようにするため"], correctAnswerRate: 85 }
              ],
              explanation: "問2 (1) 液体が周囲に飛び散るのを防ぐため。 (2) ろ過された液体が壁面を伝わってスムーズに落ちるようにするため。（液体の飛び散りを防ぎ、ろ過の速度を速める効果がある）\n解説: ろ紙の注意点としてプリントに記載されている内容です。(2)については、ろうとの先をビーカーの内壁につけることで、液体の表面張力が働き、ポタポタ落ちるよりもスピーディーにろ過できるメリットもあります。",
              surroundingKnowledge: [],
              deepDiveTopics: []
            },
            {
              id: "q_c1_2_B_3",
              category: "物質の分離と精製 (問3)",
              text: `B　（リード文続き）\n...また、溶液を加熱して沸騰させ、生じた蒸気を冷却して再び液体として取り出す方法を ( エ: 蒸留 ) という。この ( エ ) の操作を行う際、使用する器具の名称や装置の組み立てには、いくつかの重要な注意点がある。\n\n<img src="https://lh3.googleusercontent.com/d/1kzR8OOwzTg6so_HZF9a5YCEo-tazaMmF" alt="蒸留装置" class="w-full max-w-md mx-auto my-4 rounded-lg shadow-sm border border-gray-200" referrerPolicy="no-referrer" />\n\n問3 ( エ ) の操作（蒸留）に用いる装置について、次の(1)〜(6)の問いに答えよ。\n(1)　図のA～Dの器具の名称を記せ。\n(2)　この図ではDの位置が間違っている。正しくは枝付きフラスコのどこに温度計を持ってくるべきか。\n(3)　Bの器具の冷却水はどの方向（「上から下」または「下から上」）に流すべきか。また、そのように流す理由を簡潔に答えよ。\n(4)　三角フラスコは、密栓してはならない。その理由を簡潔に答えよ。\n(5)　Aの器具に入れている沸騰石の役割を答えよ。\n(6)  Aの器具に入れる液体の量はどれぐらいにすればよいか答えよ。`,
              subQuestions: [
                { id: "q3_1_A", label: "問3 (1) A", type: "short_answer", correctAnswer: "枝付きフラスコ", correctAnswerRate: 85 },
                { id: "q3_1_B", label: "問3 (1) B", type: "short_answer", correctAnswer: "リービッヒ冷却器", correctAnswerRate: 85 },
                { id: "q3_1_C", label: "問3 (1) C", type: "short_answer", correctAnswer: "三角フラスコ", correctAnswerRate: 85 },
                { id: "q3_1_D", label: "問3 (1) D", type: "short_answer", correctAnswer: "温度計", correctAnswerRate: 85 },
                { id: "q3_2", label: "問3 (2) 位置", type: "short_answer", correctAnswer: "枝の付け根付近", correctAnswerRate: 85 },
                { id: "q3_3_dir", label: "問3 (3) 方向", type: "short_answer", correctAnswer: "下から上", correctAnswerRate: 85 },
                { id: "q3_3_reason", label: "問3 (3) 理由", type: "descriptive", correctAnswer: "冷却効率を高めるため", gradingCriteria: ["冷却効率を高めるため"], correctAnswerRate: 85 },
                { id: "q3_4", label: "問3 (4) 理由", type: "descriptive", correctAnswer: "圧力が上昇して危険だから", gradingCriteria: ["圧力が上昇して危険だから"], correctAnswerRate: 85 },
                { id: "q3_5", label: "問3 (5) 役割", type: "descriptive", correctAnswer: "突沸を防ぐため", gradingCriteria: ["突沸を防ぐため"], correctAnswerRate: 85 },
                { id: "q3_6", label: "問3 (6) 量", type: "descriptive", correctAnswer: "半分以下", gradingCriteria: ["半分以下"], correctAnswerRate: 85 }
              ],
              explanation: "問3\n(1) A：枝付きフラスコ　B：リービッヒ冷却器　C：三角フラスコ　D：温度計\n(2) 枝の付け根付近\n(3) 方向：下から上 　 理由：冷却器内を水で満たすため。\n(4) 三角フラスコ内の圧力が上昇して危険だから。\n(5) 突沸（急な沸騰）を防ぐため。\n(6) 液量は半分以下にする。\n解説: 蒸留装置のセッティングは記述問題で頻出です。(1)の器具の名前は確実に書けるようにしておきましょう。(2)の図は、温度計が液体の温度を測ってしまっている「よくある間違い図」です。測りたいのは「今まさに枝に向かっている蒸気の温度」なので、枝の付け根付近が正解です。",
              surroundingKnowledge: [],
              deepDiveTopics: []
            },
            {
              id: "q_c1_2_B_4",
              category: "物質の分離と精製 (問4)",
              text: "B　（リード文続き）\n...沸点の異なる2種類以上の「液体の混合物」から、加熱温度を変えて各成分に分離する操作は特に ( オ: 分留 ) と呼ばれ、液体空気の分離や原油の精製などに用いられる。\n\n問4 原油（石油）を ( オ ) によって分離する際、精留塔から取り出される成分について次の問いに答えよ。上のア〜オを、沸点が低く精留塔の「上から出てくる順」に正しく並べ替えよ。\n ア：軽油　　イ：残油（重油など）　　ウ：石油ガス・LPガス　　エ：灯油　　オ：ナフサ（粗製ガソリン）",
              subQuestions: [
                { id: "q4_order", label: "問4 順序", type: "short_answer", correctAnswer: "ウオエア", correctAnswerRate: 85 }
              ],
              explanation: "問4 ウ → オ → エ → ア → イ\n解説: 原油の分留（精留塔）は、「沸点の低いものほど上から出てくる（気体になりやすいから）」という順番を把握する問題です。上から順に「①石油ガス・LPガス → ②ナフサ（粗製ガソリン） → ③灯油 → ④軽油 → ⑤残油（重油など）」となります。",
              surroundingKnowledge: [],
              deepDiveTopics: []
            },
            {
              id: "q_c1_2_B_5",
              category: "物質の分離と精製 (問5)",
              text: "B　（リード文続き）\n...固体物質の分離にも様々な方法がある。少量の不純物を含む固体を熱水などに溶かし、冷却して温度による ( カ ) の違いを利用して純粋な結晶を得る方法を ( キ ) という。また、目的の物質だけをよく溶かす溶媒を用いて混合物から成分を分離する方法を ( ク ) といい、物質の ( ケ ) の違いを利用して分離する方法を ( コ ) という。さらに、ドライアイスやヨウ素のように、固体が液体を経ずに直接気体になる性質を利用して分離する方法を ( サ ) という。\n\n問5 次の (a) ～ (f) の混合物を分離・精製するのに最も適した方法の名称をそれぞれ答えよ。\n(a) ヨウ素とヨウ化カリウムを含む水溶液から、特定の溶媒を加えてヨウ素だけを溶かし出す。\n(b) 水性インクのシミがついたろ紙の先端を水に浸し、各色素の移動速度の違いを利用して分ける。\n(c) 砂が混ざったヨウ素を加熱し、ヨウ素の気体を冷却して取り出す。\n(d) 少量の硫酸銅(Ⅱ)五水和物を含む硝酸カリウムの固体を熱水に溶かし、その後ゆっくりと冷却する。\n(e) 塩化ナトリウム水溶液（食塩水）を加熱し、純粋な水を取り出す。\n(f) 茶葉に熱湯を注ぎ、お茶の成分を溶かし出す。",
              subQuestions: [
                { id: "q5_a", label: "問5 (a)", type: "short_answer", correctAnswer: "抽出", correctAnswerRate: 85 },
                { id: "q5_b", label: "問5 (b)", type: "short_answer", correctAnswer: "クロマトグラフィー", correctAnswerRate: 85 },
                { id: "q5_c", label: "問5 (c)", type: "short_answer", correctAnswer: "昇華法", correctAnswerRate: 85 },
                { id: "q5_d", label: "問5 (d)", type: "short_answer", correctAnswer: "再結晶", correctAnswerRate: 85 },
                { id: "q5_e", label: "問5 (e)", type: "short_answer", correctAnswer: "蒸留", correctAnswerRate: 85 },
                { id: "q5_f", label: "問5 (f)", type: "short_answer", correctAnswer: "抽出", correctAnswerRate: 85 }
              ],
              explanation: "問5\n(a) 抽出\n(b) クロマトグラフィー（または ペーパークロマトグラフィー）\n(c) 昇華法\n(d) 再結晶\n(e) 蒸留\n(f) 抽出\n解説: プリント右側の表に載っている具体例から分離法を当てる頻出問題です。(a)と(f)は「適切な溶媒を加えて、目的の物質だけを分離する」ので抽出です。(c)のヨウ素やナフタレン、ドライアイスは「昇華しやすい物質」のため昇華法を選びます。(d)は温度による溶解度変化を利用する再結晶です。",
              surroundingKnowledge: [],
              deepDiveTopics: []
            }
          ]
        },
        {
          id: "c1_2_B",
          abstractTitle: "②-B 物質の構成と成分元素の検出",
          realTitle: "1章 物質の構成",
          topics: ["同素体", "炎色反応", "成分元素の検出"],
          miniTest: [
            {
              id: "q_c1_2_A_1",
              category: "物質の構成と成分元素の検出 (問1)",
              text: "A　物質の構成と分離・精製に関する次の文章を読み、あとの問いに答えよ。\n\n物質は様々な元素から構成されている。同じ元素からなる単体であっても、結合のしかたや配列が異なるために性質が異なる物質が存在し、これらを互いに ( ア ) という。代表的なものとして、S（硫黄）、C（炭素）、O（酸素）、P（リン）の4つの元素が知られている。 また、物質に含まれる元素を確認する方法として、特定の元素を含む物質を炎の中に入れると特有の色を示す ( イ ) という現象を利用する方法がある。\n\nさらに、化学反応を用いて①成分元素を検出することもできる。例えば、ある未知の化合物を完全燃焼させたところ、無色の気体Aと無色の液体Bが生じた。気体Aを ( ウ ) に通すと白濁したことから、元の化合物には ( エ ) 元素が含まれていることがわかる。液体Bを、硫酸銅(Ⅱ)無水塩に触れさせると色が変化したことから、液体Bは水であり、元の化合物には ( オ ) 元素が含まれていたことがわかる。また、水溶液に硝酸銀水溶液を加えて白色沈殿が生じた場合、その水溶液には ( カ ) 元素が含まれていることが確認できる。\n\n問1 文章中の空欄 ( ア ) ～ ( カ ) に入る最も適切な語句、または元素名を答えよ。",
              subQuestions: [
                { id: "q1_a", label: "問1 (ア)", type: "short_answer", correctAnswer: "同素体", correctAnswerRate: 85 },
                { id: "q1_b", label: "問1 (イ)", type: "short_answer", correctAnswer: "炎色反応", correctAnswerRate: 85 },
                { id: "q1_c", label: "問1 (ウ)", type: "short_answer", correctAnswer: "石灰水", correctAnswerRate: 85 },
                { id: "q1_d", label: "問1 (エ)", type: "short_answer", correctAnswer: "炭素", correctAnswerRate: 85 },
                { id: "q1_e", label: "問1 (オ)", type: "short_answer", correctAnswer: "水素", correctAnswerRate: 85 },
                { id: "q1_f", label: "問1 (カ)", type: "short_answer", correctAnswer: "塩素", correctAnswerRate: 85 }
              ],
              explanation: "問1 (ア) 同素体 (イ) 炎色反応 (ウ) 石灰水 (エ) 炭素（C） (オ) 水素（H） (カ) 塩素（Cl）",
              surroundingKnowledge: [],
              deepDiveTopics: []
            },
            {
              id: "q_c1_2_A_2",
              category: "物質の構成と成分元素の検出 (問2)",
              text: "A　（リード文続き）\n...代表的なものとして、S（硫黄）、C（炭素）、O（酸素）、P（リン）の4つの元素が知られている。\n\n問2 (ア: 同素体) に関して、硫黄、炭素、酸素、リンの性質について次の問いに答えよ。\n(1) 硫黄(S)の同素体を3つ、名称で答えよ。また、そのうち「常温で安定で黄色」のもの、「淡黄色で針状」のものをそれぞれ選べ。\n(2) 炭素(C)の同素体を4つ、名称で答えよ。また、そのうち「非常に硬く電気を通さない」もの、「やわらかく電気をよく導く」ものをそれぞれ選べ。\n(3) 酸素(O)の同素体である「オゾン」は、どのような色とにおいをもつか。それぞれ簡潔に答えよ。\n(4) リン(P)の同素体のうち、猛毒で自然発火するため「水中に保存」するものは何か。また、毒性が低く「マッチの側薬」などに使われるものは何か。名称で答えよ。",
              subQuestions: [
                { id: "q2_1_stable", label: "問2 (1) 常温で安定", type: "short_answer", correctAnswer: "斜方硫黄", correctAnswerRate: 85 },
                { id: "q2_1_needle", label: "問2 (1) 針状", type: "short_answer", correctAnswer: "単斜硫黄", correctAnswerRate: 85 },
                { id: "q2_2_hard", label: "問2 (2) 硬い", type: "short_answer", correctAnswer: "ダイヤモンド", correctAnswerRate: 85 },
                { id: "q2_2_soft", label: "問2 (2) 導く", type: "short_answer", correctAnswer: "黒鉛", correctAnswerRate: 85 },
                { id: "q2_3_color", label: "問2 (3) オゾンの色", type: "short_answer", correctAnswer: "淡青色", correctAnswerRate: 85 },
                { id: "q2_3_smell", label: "問2 (3) オゾンのにおい", type: "short_answer", correctAnswer: "特異臭", correctAnswerRate: 85 },
                { id: "q2_4_poison", label: "問2 (4) 水中保存", type: "short_answer", correctAnswer: "黄リン", correctAnswerRate: 85 },
                { id: "q2_4_match", label: "問2 (4) マッチ", type: "short_answer", correctAnswer: "赤リン", correctAnswerRate: 85 }
              ],
              explanation: "問2\n(1) 同素体：斜方硫黄、単斜硫黄、ゴム状硫黄 　常温で安定で黄色：斜方硫黄 　淡黄色で針状：単斜硫黄\n(2) 同素体：ダイヤモンド、黒鉛、フラーレン、カーボンナノチューブ\n非常に硬く電気を通さない：ダイヤモンド 　やわらかく電気をよく導く：黒鉛\n(3) 色：淡青色　におい：特異臭\n(4) 　水中に保存：黄リン マッチの側薬：赤リン\n\n解説: プリントに書かれている同素体の特徴（色や硬さ、保存方法）は、テストでそのまま記述や選択肢として問われます。特にリンの保存方法と、硫黄の「斜方」「単斜」の違いは完璧にしておきましょう。",
              surroundingKnowledge: [],
              deepDiveTopics: []
            },
            {
              id: "q_c1_2_A_3",
              category: "物質の構成と成分元素の検出 (問3)",
              text: "A　（リード文続き）\n...また、物質に含まれる元素を確認する方法として、特定の元素を含む物質を炎の中に入れると特有の色を示す ( イ: 炎色反応 ) という現象を利用する方法がある。\n\n問3 (イ) に関して、次の元素が含まれる物質を炎の中に入れたとき、それぞれ何色の炎になるか答えよ。\n(1) Li （リチウム） (2) Na （ナトリウム） (3) K （カリウム） (4) Cu （銅）\n(5) Ca （カルシウム） (6) Sr （ストロンチウム） (7) Ba （バリウム）",
              subQuestions: [
                { id: "q3_1", label: "問3 (1) Li", type: "short_answer", correctAnswer: "赤", correctAnswerRate: 85 },
                { id: "q3_2", label: "問3 (2) Na", type: "short_answer", correctAnswer: "黄", correctAnswerRate: 85 },
                { id: "q3_3", label: "問3 (3) K", type: "short_answer", correctAnswer: "紫", correctAnswerRate: 85 },
                { id: "q3_4", label: "問3 (4) Cu", type: "short_answer", correctAnswer: "青緑", correctAnswerRate: 85 },
                { id: "q3_5", label: "問3 (5) Ca", type: "short_answer", correctAnswer: "橙", correctAnswerRate: 85 },
                { id: "q3_6", label: "問3 (6) Sr", type: "short_answer", correctAnswer: "紅", correctAnswerRate: 85 },
                { id: "q3_7", label: "問3 (7) Ba", type: "short_answer", correctAnswer: "黄緑", correctAnswerRate: 85 }
              ],
              explanation: "問3 (1) 赤 （赤色） (2) 黄 （黄色） (3) 紫 （紫色） (4) 青緑 （青緑色）\n(5) 橙 （橙色） (6) 紅 （紅色） (7) 黄緑 （黄緑色）\n解説: 「リアカー(Li赤) 無き(Na黄、K紫) 動力(Cu青緑) 借りるとう(Ca橙) するもくれない(Sr紅) 馬力(Ba黄緑)」で確実に暗記します。",
              surroundingKnowledge: [],
              deepDiveTopics: []
            },
            {
              id: "q_c1_2_A_4",
              category: "物質の構成と成分元素の検出 (問4)",
              text: "A　（リード文続き）\n...さらに、化学反応を用いて①成分元素を検出することもできる。例えば、ある未知の化合物を完全燃焼させたところ、無色の気体Aと無色の液体Bが生じた。気体Aを ( ウ: 石灰水 ) に通すと白濁したことから、元の化合物には ( エ ) 元素が含まれていることがわかる。液体Bを、硫酸銅(Ⅱ)無水塩に触れさせると色が変化したことから、液体Bは水であり、元の化合物には ( オ ) 元素が含まれていたことがわかる。また、水溶液に硝酸銀水溶液を加えて白色沈殿が生じた場合、その水溶液には ( カ ) 元素が含まれていることが確認できる。\n\n問4 下線部①に関して、次の問いに答えよ。\n(1) 二酸化炭素を( ウ )に通して白濁したとき、生じている白色の沈殿物の名称と、その化学式を答えよ。\n(2) 文章中の下線部について、液体B（水）が触れたとき、硫酸銅(Ⅱ)無水塩は何色から何色に変化するか。\n(3) 液体B（水）の確認には、青色の塩化コバルト紙を用いることもできる。水に触れると塩化コバルト紙は何色に変化するか。\n(4) 水溶液に硝酸銀(AgNO₃)水溶液を加えたときに生じる「白色沈殿」の物質の名称と、その化学式を答えよ。\n(5) 水溶液中の硫黄(S)元素を検出するためには、酢酸鉛(Ⅱ)水溶液を加える。このとき生じる沈殿の色と、その沈殿物の化学式を答えよ。",
              subQuestions: [
                { id: "q4_1_name", label: "問4 (1) 沈殿名称", type: "short_answer", correctAnswer: "炭酸カルシウム", correctAnswerRate: 85 },
                { id: "q4_1_chem", label: "問4 (1) 化学式", type: "short_answer", correctAnswer: "CaCO3", correctAnswerRate: 85 },
                { id: "q4_2_color", label: "問4 (2) 色変化", type: "short_answer", correctAnswer: "青", correctAnswerRate: 85 },
                { id: "q4_3_color", label: "問4 (3) 色変化", type: "short_answer", correctAnswer: "赤", correctAnswerRate: 85 },
                { id: "q4_4_name", label: "問4 (4) 沈殿名称", type: "short_answer", correctAnswer: "塩化銀", correctAnswerRate: 85 },
                { id: "q4_4_chem", label: "問4 (4) 化学式", type: "short_answer", correctAnswer: "AgCl", correctAnswerRate: 85 },
                { id: "q4_5_color", label: "問4 (5) 沈殿色", type: "short_answer", correctAnswer: "黒", correctAnswerRate: 85 },
                { id: "q4_5_chem", label: "問4 (5) 化学式", type: "short_answer", correctAnswer: "PbS", correctAnswerRate: 85 }
              ],
              explanation: "問4\n(1) 炭酸カルシウム (CaCO3)\n(2) 白色から青色\n(3) 青色から赤色\n(4) 塩化銀 (AgCl)\n(5) 黒色 (PbS)",
              surroundingKnowledge: [],
              deepDiveTopics: []
            }
          ]
        },
        {
          id: "c1_3",
          abstractTitle: "③ 粒子の熱運動と物質の三態",
          realTitle: "1章 物質の構成",
          topics: [],
          miniTest: [
            {
              id: "q_c1_3_1",
              category: "粒子の熱運動と物質の三態 (問1)",
              text: `粒子の熱運動と物質の三態に関する次の文章を読み、あとの問いに答えよ。\n\n物質を構成する粒子は、常に不規則な運動を行っている。これを ( ア ) という。すべての粒子が同じ速さで運動しているわけではなく、温度が高くなるほどその速さの平均値は ( イ：大きく / 小さく ) なる。温度を下げていくと粒子の運動は次第に穏やかになり、理論上、すべての粒子が ( ア ) をしなくなる温度が存在する。この温度をセルシウス温度で ( ウ ) ℃といい、これを ( エ ) と呼ぶ。( エ ) を基準とした温度を絶対温度といい、単位には ( オ ) が用いられる。\n\nまた、別々の入れ物に入れておいた窒素と臭素をくっつけるとやがて均一な混合気体になるように、物質の構成粒子が自然に散らばっていく現象を ( カ ) という。\n\n物質は温度などの条件によって、固体、液体、気体の3つの状態をとる。これを物質の三態という。物質が状態を変えることを「状態変化」といい、これは物質そのものは変化せず状態のみが変わる ( キ ) 変化である。一方で、原子の組み合わせが変化し、物質が別の物質に変わることを ( ク ) 変化という。\n\n状態変化に伴い、粒子の様子も大きく変化する。なお、純物質の場合、固体から液体へ、あるいは液体から気体へ状態変化している間は、加熱を続けても温度は一定に保たれる特徴がある。\n\n固体のときは粒子間の距離が小さく、強い引力が働くため、粒子はほぼ一定の位置にとどまってその場でわずかに ( ケ ) しているのみである。そのため形や体積は一定である。\n\n加熱して ( コ ) 点に達し、固体から液体になることを ( サ ) という。液体になると粒子は自由に動き回るため、体積はほぼ一定だが形は自由に変形する。\n\nさらに加熱して ( シ ) 点に達し、液体の内部からも気体が発生することを沸騰といい、液体から気体になる状態変化を ( ス ) という。気体になると粒子間の引力はほとんど働かず、粒子は激しく飛び回るため、体積は温度や圧力によって大きく変化する。\n\n問1 文章中の空欄 ( ア ) ～ ( ス ) に入る最も適切な語句、または数値を答えよ。\n（※(イ)は選択肢から選ぶこと）`,
              subQuestions: [
                { id: "q_c1_3_1_a", label: "問1 (ア)", type: "short_answer", correctAnswer: "熱運動", correctAnswerRate: 85 },
                { id: "q_c1_3_1_i", label: "問1 (イ)", type: "multiple_choice", options: ["大きく", "小さく"], correctAnswer: "大きく", correctAnswerRate: 85 },
                { id: "q_c1_3_1_u", label: "問1 (ウ)", type: "short_answer", correctAnswer: "-273", correctAnswerRate: 85 },
                { id: "q_c1_3_1_e", label: "問1 (エ)", type: "short_answer", correctAnswer: "絶対零度", correctAnswerRate: 85 },
                { id: "q_c1_3_1_o", label: "問1 (オ)", type: "short_answer", correctAnswer: "K", correctAnswerRate: 85 },
                { id: "q_c1_3_1_ka", label: "問1 (カ)", type: "short_answer", correctAnswer: "拡散", correctAnswerRate: 85 },
                { id: "q_c1_3_1_ki", label: "問1 (キ)", type: "short_answer", correctAnswer: "物理", correctAnswerRate: 85 },
                { id: "q_c1_3_1_ku", label: "問1 (ク)", type: "short_answer", correctAnswer: "化学", correctAnswerRate: 85 },
                { id: "q_c1_3_1_ke", label: "問1 (ケ)", type: "short_answer", correctAnswer: "振動", correctAnswerRate: 85 },
                { id: "q_c1_3_1_ko", label: "問1 (コ)", type: "short_answer", correctAnswer: "融", correctAnswerRate: 85 },
                { id: "q_c1_3_1_sa", label: "問1 (サ)", type: "short_answer", correctAnswer: "融解", correctAnswerRate: 85 },
                { id: "q_c1_3_1_shi", label: "問1 (シ)", type: "short_answer", correctAnswer: "沸", correctAnswerRate: 85 },
                { id: "q_c1_3_1_su", label: "問1 (ス)", type: "short_answer", correctAnswer: "蒸発", correctAnswerRate: 85 }
              ],
              explanation: "問1\n(ア) 熱運動\n(イ) 大きく\n(ウ) -273\n(エ) 絶対零度\n(オ) K（ケルビン）\n(カ) 拡散\n(キ) 物理\n(ク) 化学\n(ケ) 振動\n(コ) 融\n(サ) 融解\n(シ) 沸\n(ス) 蒸発\n解説: 絶対零度は－２７３℃であり、すべての粒子が熱運動をしなくなる温度です。固体の粒子は静止しているわけではなく、定位置で「振動」している点もテストでよく狙われます。",
              surroundingKnowledge: [],
              deepDiveTopics: []
            },
            {
              id: "q_c1_3_2",
              category: "粒子の熱運動と物質の三態 (問2)",
              text: `問2 セルシウス温度と絶対温度の変換について、次の問いに答えよ。\n(1) セルシウス温度が２７℃のとき、絶対温度は何Kか。\n(2) 絶対温度が353Kのとき、セルシウス温度は何℃か。`,
              subQuestions: [
                { id: "q_c1_3_2_1", label: "問2 (1)", type: "short_answer", correctAnswer: "300K", correctAnswerRate: 85 },
                { id: "q_c1_3_2_2", label: "問2 (2)", type: "short_answer", correctAnswer: "80℃", correctAnswerRate: 85 }
              ],
              explanation: "問2\n(1) 300K\n(2) 80℃\n解説: 「絶対温度 T = 273 + t (セルシウス温度)」の公式を用います。\n(1) T = 273 + 27 = 300\n(2) 353 = 273 + tより、t = 353 - 273 = 80",
              surroundingKnowledge: [],
              deepDiveTopics: []
            },
            {
              id: "q_c1_3_3",
              category: "粒子の熱運動と物質の三態 (問3)",
              text: `問3 次の (a) ～ (d) の状態変化の名称をそれぞれ答えよ。\n(a) 気体 から 液体 になること\n(b) 液体 から 固体 になること\n(c) 固体 から 直接気体 になること\n(d) 気体 から 直接固体 になること`,
              subQuestions: [
                { id: "q_c1_3_3_a", label: "問3 (a)", type: "short_answer", correctAnswer: "凝縮", correctAnswerRate: 85 },
                { id: "q_c1_3_3_b", label: "問3 (b)", type: "short_answer", correctAnswer: "凝固", correctAnswerRate: 85 },
                { id: "q_c1_3_3_c", label: "問3 (c)", type: "short_answer", correctAnswer: "昇華", correctAnswerRate: 85 },
                { id: "q_c1_3_3_d", label: "問3 (d)", type: "short_answer", correctAnswer: "凝華", correctAnswerRate: 85 }
              ],
              explanation: "問3\n(a) 凝縮\n(b) 凝固\n(c) 昇華\n(d) 凝華\n解説: 状態変化の図は矢印の向きと名前を完全に一致させておきましょう。特に、気体→固体を「凝華」と呼ぶ点は要注意です。",
              surroundingKnowledge: [],
              deepDiveTopics: []
            },
            {
              id: "q_c1_3_4",
              category: "粒子の熱運動と物質の三態 (問4)",
              text: `問4 固体が融解している間や、液体が沸騰している間、継続して加熱しているにもかかわらず温度が一定に保たれる。その理由は「加えられた熱エネルギーが、(　　　) ために使われるから」である。 (　　) の内容が「全ての物質での(　　)が終わる」となるように適切な語句を答えよ。`,
              subQuestions: [
                { id: "q_c1_3_4_1", label: "問4", type: "short_answer", correctAnswer: "状態変化", correctAnswerRate: 85 }
              ],
              explanation: "問4\n状態変化\n解説: プリント右下の「全ての物質での状態変化が終わるまで、温度は一定に保たれる」という記述からの出題です。加えられた熱が温度上昇ではなく、粒子間の引力を断ち切って状態を変えるために使われるためです。",
              surroundingKnowledge: [],
              deepDiveTopics: []
            }
          ]
        },
        {
          id: "c2_1",
          abstractTitle: "① 原子の構造と電子配置・元素の周期表",
          realTitle: "2章 物質の構成粒子",
          topics: [],
          miniTest: []
        },
        {
          id: "c2_2",
          abstractTitle: "② イオン",
          realTitle: "2章 物質の構成粒子",
          topics: [],
          miniTest: []
        },
        {
          id: "c2_3",
          abstractTitle: "③ イオン生成とエネルギー",
          realTitle: "2章 物質の構成粒子",
          topics: [],
          miniTest: []
        },
        {
          id: "c2_4",
          abstractTitle: "④ 原子の大きさとイオンの大きさ",
          realTitle: "2章 物質の構成粒子",
          topics: [],
          miniTest: []
        },
        {
          id: "c3_1",
          abstractTitle: "① 結合の種類",
          realTitle: "3章 化学結合",
          topics: ["イオン結合", "共有結合", "配位結合", "金属結合", "分子間力による結合"],
          miniTest: []
        },
        {
          id: "c3_2",
          abstractTitle: "② 結晶の種類と性質",
          realTitle: "3章 化学結合",
          topics: [],
          miniTest: []
        },
        {
          id: "c3_3",
          abstractTitle: "③ 分子の相互作用と性質",
          realTitle: "3章 化学結合",
          topics: ["分子間力", "水素結合", "分子の極性", "電気陰性度について"],
          miniTest: []
        }
      ]
    },
    {
      id: "part2",
      title: "第二部・化学基礎後半",
      chapters: [
        { id: "c4", abstractTitle: "セクション4：物質の変化と量", realTitle: "④物質量と化学反応式", topics: [], miniTest: [] },
        { id: "c5", abstractTitle: "セクション5：酸と塩基の反応", realTitle: "⑤酸と塩基", topics: [], miniTest: [] },
        { id: "c6", abstractTitle: "セクション6：電子のやり取り", realTitle: "⑥酸化還元反応", topics: [], miniTest: [] }
      ]
    }
  ]
};

export const substanceTreeData: NodeData = {
  id: 'root',
  label: '物質',
  step: null,
  explanation: '私たちの周りにあるすべてのものは<u>「物質」</u>でできています。物質は、その構成成分によって<u>「純物質」</u>と<u>「混合物」</u>に大きく分類されます。\n\n【基礎用語の定義】\n・<u>元素</u>：物質を構成する原子の種類。現在はおよそ120種類が存在する。\n・<u>元素記号</u>：元素を表すラテン語由来の文字。',
  children: [
    {
      id: 'step1_group',
      label: '【Step1】物質の分類',
      isGroup: true,
      step: 1,
      children: [
        {
          id: 'pure_1',
          label: '純物質',
          subLabel: '1種類の物質',
          step: 1,
          explanation: '<u>1種類の物質</u>だけでできているもの。固有の性質（融点・沸点・密度など）を持ち、<u>一つの化学式</u>で書くことができます。',
          relatedQuestions: [
            { id: 'p1_a', label: '演習問題⓵－１(ア)' },
            { id: 'p1_i', label: '演習問題⓵－１(イ)' },
            { id: 'p1_e', label: '演習問題⓵－１(エ)' }
          ],
          children: [
            {
              id: 'simple_1',
              label: '単体',
              step: 1,
              subLabel: '1種類の元素',
              explanation: '<u>1種類の元素</u>からなる純物質。（例：酸素 O2、窒素 N2、鉄 Fe）',
              relatedQuestions: [
                { id: 'p1_u', label: '演習問題⓵－１(ウ)' },
                { id: 'p2_1', label: '問2(1) 酸素' },
                { id: 'p2_8', label: '問2(8) 鉄' },
                { id: 'p2_13', label: '問2(13) キセノン' }
              ]
            },
            {
              id: 'compound_1',
              label: '化合物',
              step: 1,
              subLabel: '2種類以上の元素',
              explanation: '<u>2種類以上の元素</u>からなる純物質。（例：水 H2O、塩化ナトリウム NaCl）',
              relatedQuestions: [
                { id: 'p1_o', label: '演習問題⓵－１(オ)' },
                { id: 'p2_3', label: '問2(3) 塩化ナトリウム' },
                { id: 'p2_5', label: '問2(5) アンモニア' },
                { id: 'p2_9', label: '問2(9) プロパン' },
                { id: 'p2_11', label: '問2(11) 水' },
                { id: 'p2_14', label: '問2(14) 二酸化炭素' },
                { id: 'p2_15', label: '問2(15) 炭酸水素ナトリウム' }
              ]
            }
          ]
        },
        {
          id: 'mixture_1',
          label: '混合物',
          subLabel: '2種類以上の純物質',
          step: 1,
          explanation: '<u>2種類以上の純物質</u>が混じり合ったもの。<u>一つの化学式で書くことができません</u>。（例：空気、海水、石油、塩酸、食塩水）',
          relatedQuestions: [
            { id: 'p1_ki', label: '演習問題⓵－１(キ)' },
            { id: 'p1_ku', label: '演習問題⓵－１(ク)' },
            { id: 'p2_2', label: '問2(2) 海水' },
            { id: 'p2_4', label: '問2(4) 塩酸' },
            { id: 'p2_6', label: '問2(6) 空気' },
            { id: 'p2_7', label: '問2(7) 石油' },
            { id: 'p2_10', label: '問2(10) ガソリン' },
            { id: 'p2_12', label: '問2(12) 木材' }
          ]
        }
      ]
    },
    {
      id: 'step2_group',
      label: '【Step2】物質の性質',
      isGroup: true,
      step: 2,
      children: [
        {
          id: 'pure_prop',
          label: '純物質の性質',
          subLabel: '融点・沸点・密度が一定',
          step: 2,
          explanation: '融点や沸点、密度などが物質ごとに<u>一定</u>となります。',
          relatedQuestions: [
            { id: 'p1_ke', label: '演習問題⓵－１(ケ)' }
          ]
        },
        {
          id: 'mixture_prop',
          label: '混合物の性質',
          subLabel: '割合により値が変化する',
          step: 2,
          explanation: '混じっている物質の種類やその割合により、融点や沸点などの値が<u>変化</u>します。\n例）水とエタノールの混合物を加熱すると、沸騰している間も温度が上昇し続けます。',
          relatedQuestions: [
            { id: 'p1_ka', label: '演習問題⓵－１(カ)' }
          ]
        }
      ]
    },
    {
      id: 'step3_group',
      label: '【Step3】単体と元素の識別',
      isGroup: true,
      step: 3,
      children: [
        {
          id: 'simple_2',
          label: '単体（実体）',
          subLabel: '直接触れることができる',
          step: 3,
          explanation: '<u>実際に存在する物質</u> ＝ 直接的に触ることができるもの。具体的な性質（色、融点、沸点など）を持つ<u>「実体」</u>を指します。',
          relatedQuestions: [
            { id: 'q3_1', label: '演習問題⓵－３(1)' },
            { id: 'q3_3', label: '演習問題⓵－３(3)' },
            { id: 'q3_5', label: '演習問題⓵－３(5)' },
            { id: 'p3_1', label: '類題⓵－３(1)' },
            { id: 'p3_4', label: '類題⓵－３(4)' },
            { id: 'p3_5', label: '類題⓵－３(5)' },
            { id: 'p3_8', label: '類題⓵－３(8)' },
            { id: 'p3_9', label: '類題⓵－３(9)' },
            { id: 'p3_10', label: '類題⓵－３(10)' }
          ]
        },
        {
          id: 'element_2',
          label: '元素（成分）',
          subLabel: '構成成分（概念的）',
          step: 3,
          explanation: '<u>物質の構成成分</u> ＝ 直接的に触ることができないもの。物質を構成する<u>「種類」</u>や<u>「成分」</u>を指します。',
          relatedQuestions: [
            { id: 'q3_2', label: '演習問題⓵－３(2)' },
            { id: 'q3_4', label: '演習問題⓵－３(4)' },
            { id: 'q3_6', label: '演習問題⓵－３(6)' },
            { id: 'p3_2', label: '類題⓵－３(2)' },
            { id: 'p3_3', label: '類題⓵－３(3)' },
            { id: 'p3_6', label: '類題⓵－３(6)' },
            { id: 'p3_7', label: '類題⓵－３(7)' }
          ]
        },
        {
          id: 'separation_1',
          label: '分離・精製',
          step: 3,
          explanation: '混合物から純物質を取り出す操作。\n・物理的方法：ろ過、蒸留、再結晶、抽出、昇華法など\n・化学的方法：電気分解など',
          relatedQuestions: [
            { id: 'p1_ko', label: '演習問題⓵－１(コ)' },
            { id: 'p1_sa', label: '演習問題⓵－１(サ)' }
          ]
        },
        {
          id: 'id_criteria',
          label: '識別のポイント',
          step: 3,
          explanation: '文章中の言葉がどちらを指しているかを見極める基準：\n\n⓵ <u>液体の元素</u>を確認する：臭素(Br)、水銀(Hg)\n⓶ 化学的方法・物理的方法の定義を確認する\n・<u>化学的方法</u>：電気分解などにより単体に分解する方法\n・<u>物理的方法</u>：ろ過、蒸留、再結晶などにより純物質に分類する方法\n⓷ 空気の割合・海水の割合\n・空気：1位 窒素、2位 酸素、3位 アルゴン、4位 二酸化炭素\n・海水：1位 水、2位 塩化ナトリウム、3位 塩化マグネシウム、4位 硫酸マグネシウム'
        }
      ]
    }
  ]
};
