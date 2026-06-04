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
                    difficulty: 1,
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
                    difficulty: 1,
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
                    difficulty: 1,
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
                    difficulty: 1,
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
                    difficulty: 1,
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
                    difficulty: 1,
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
                    difficulty: 1,
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
                    difficulty: 2,
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
                    difficulty: 2,
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
    "explanations": [],
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
            },
            {
              id: "p_c1_1_4",
              category: "純物質の性質",
              text: "次のア〜エの記述について、純物質に当てはまるものをすべて選んでア〜エの記号で答えよ。（完答） \n\nア）一定の圧力のもとでは、沸騰する温度がいつも同じである。  \n\nイ）固体が融解し始める温度と融解し終わったときの温度が一致しない。  \n\nウ）固体が融解し始める温度と融解し終わった時の温度が一致する。  \n\nエ）温度、圧力が一定ならば、単位体積あたりの質量が一定である。",
              subQuestions: [
                { id: "p4_ans", label: "解答", type: "multiple_choice", options: ["ア", "イ", "ウ", "エ"], correctAnswer: "ア,ウ,エ", correctAnswerRate: 80 }
              ],
              explanation: JSON.stringify({
  "type": "logic_thought",
  "phase1": {
    "title": "フェーズ1：純物質の性質の分析",
    "overview": {
      "theme": "純物質と混合物の性質（融点・沸点・密度）",
      "type": "演繹型（既知知識の適用）",
      "concepts": "純物質、混合物、融点、沸点、密度"
    },
    "tree": "【純物質と混合物の性質判別】\n│\n├─ 条件：純物質か？\n│   ├─ はい（不純物なし）\n│   │   ├─ 融点・沸点：一定 [Step 1]\n│   │   └─ 密度：一定 [Step 2]\n│   │\n│   └─ いいえ（混合物）\n│       └─ 融点・沸点・密度：一定ではない（組成により変化） [Step 3]",
    "steps": [
      {
        "step": "Step 1",
        "tag": "性質理解",
        "target": "純物質の融点・沸点",
        "content": "純物質は決まった融点・沸点を持ち、状態変化中も温度が一定に保たれる。",
        "knowledge": "純物質の性質",
        "purpose": "ア、イ、ウの判定"
      },
      {
        "step": "Step 2",
        "tag": "性質理解",
        "target": "純物質の密度",
        "content": "純物質は、温度・圧力が一定ならば密度（単位体積あたりの質量）も一定である。",
        "knowledge": "密度の定義",
        "purpose": "エの判定"
      },
      {
        "step": "Step 3",
        "tag": "性質理解",
        "target": "混合物の性質",
        "content": "混合物は、成分の割合によって融点・沸点・密度が変化する。",
        "knowledge": "混合物の性質",
        "purpose": "イの誤り判定"
      }
    ]
  },
  "phase2": {
    "title": "フェーズ2：解答プロセスの構築",
    "explanations": [
      {
        "step": "Step 1",
        "tag": "判定",
        "subQuestionIds": ["p4_ans"],
        "subQuestionLabels": ["解答"],
        "content": "ア：純物質は決まった沸点を持つため正しい。\nイ：融点変化は混合物の特徴であるため誤り。\nウ：純物質は決まった融点を持つため正しい。\nエ：純物質は密度が一定であるため正しい。"
      }
    ],
    "stumblingPoints": []
  },
  "difficulty": 3
}),
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
                    theme: "物質の分類（単体）",
                    type: "知識再生型",
                    steps: [
                      "① 純物質のうち「1種類の元素からできている」という条件を確認する",
                      "② 1種類の元素のみから構成される純物質の呼称を想起する",
                      "③ 「単体」という用語が適切であると判断する"
                    ]
                  }
                },
                { id: "q1_d", label: "(エ)", type: "short_answer", correctAnswer: "化合物", correctAnswerRate: 85,
                  detailedExplanation: {
                    theme: "物質の分類（化合物）",
                    type: "知識再生型",
                    steps: [
                      "① 純物質のうち「2種類以上の元素からできている」という条件を確認する",
                      "② 2種類以上の元素から構成される純物質の呼称を想起する",
                      "③ 「化合物」という用語が適切であると判断する"
                    ]
                  }
                },
                { id: "q1_e", label: "(オ)", type: "short_answer", correctAnswer: "一定", correctAnswerRate: 85,
                  detailedExplanation: {
                    theme: "純物質の性質",
                    type: "知識再生型",
                    steps: [
                      "① 純物質の融点や沸点、密度などの数値がどのように現れるかを確認する",
                      "② 純粋な物質は固有の物性値を持っていることを想起する",
                      "③ 値が「一定」であると判断する"
                    ]
                  }
                },
                { id: "q1_f", label: "(カ)", type: "short_answer", correctAnswer: "変化", correctAnswerRate: 85,
                  detailedExplanation: {
                    theme: "混合物の性質",
                    type: "知識再生型",
                    steps: [
                      "① 混合物の融点や沸点、密度がどのようであるかを確認する",
                      "② 混合物は混ざっている物質の割合や種類によって、それらの物性値が変わることを想起する",
                      "③ 値が「変化」すると判断する"
                    ]
                  }
                }
              ],
              explanation: JSON.stringify({
                "type": "logic_thought",
                "phase1": {
                  "title": "化学物質の分類と物性",
                  "overview": "すべての物質は「純物質」と「混合物」に大別され、それぞれ異なる性質を持ちます。",
                  "tree": "物質の分類\n├ 純物質（単体、化合物）\n└ 混合物",
                  "steps": ["物質の基本分類", "純物質と混合物の性質の違い"]
                },
                "phase2": {
                  "explanations": [
                    {
                      "step": "物質の基本分類",
                      "tag": "分類",
                      "subQuestionIds": ["q1_a", "q1_b", "q1_c", "q1_d"],
                      "subQuestionLabels": ["(ア)", "(イ)", "(ウ)", "(エ)"],
                      "content": "1種類の物質からなるものが<b>純物質</b>、2種類以上の純物質が混ざり合ったものが<b>混合物</b>です。純物質はさらに、1種類の元素からなる<b>単体</b>と、2種類以上の元素からなる<b>化合物</b>に分けられます。"
                    },
                    {
                      "step": "純物質と混合物の性質の違い",
                      "tag": "性質",
                      "subQuestionIds": ["q1_e", "q1_f"],
                      "subQuestionLabels": ["(オ)", "(カ)"],
                      "content": "純物質（単体・化合物）は融点・沸点・密度が<b>一定</b>ですが、混合物は含有する成分の割合などによってこれらの値が<b>変化</b>します。"
                    }
                  ]
                }
              }),
              surroundingKnowledge: [],
              deepDiveTopics: []
            },
            {
              id: "q2",
              category: "物質の分類",
              text: "【問2】次の (1)〜(6) の物質を、(イ) 混合物、(ウ) 単体、(エ) 化合物に分類し、記号で答えよ。\n\n(1) 空気\n(2) 酸素\n(3) 食塩水\n(4) メタン\n(5) 黒鉛\n(6) 石油",
              subQuestions: [
                { id: "q2_1", label: "(1) 空気", type: "multiple_choice", options: ["(イ)", "(ウ)", "(エ)"], correctAnswer: "(イ)", correctAnswerRate: 85,
                  detailedExplanation: {
                    theme: "物質の分類（空気）",
                    type: "演繹型",
                    steps: [
                      "① 空気の構成要素について確認する",
                      "② 窒素や酸素など複数の気体が混ざり合っていることを想起する",
                      "③ 複数の純物質からなる混合物であると判断する",
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
                      "① 酸素分子の構成について確認する",
                      "② 酸素(O)という1種類の元素のみからなる純物質であることを想起する",
                      "③ 1種類の元素からなる「単体」であると判断する",
                      "④ 複数の元素からなる「化合物」や複数の物質が混ざった「混合物」を排除する",
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
                      "② 塩化ナトリウムと水という別々の純物質が混在していることを想起する",
                      "③ 複数の純物質からなる「混合物」であると判断する",
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
                      "① メタン分子の構成について確認する",
                      "② 炭素(C)と水素(H)という2種類の元素からなる純物質であることを想起する",
                      "③ 2種類以上の元素からなる「化合物」であると判断する",
                      "④ 1種類の元素からなる「単体」や複数の物質が混ざった「混合物」を排除する",
                      "⑤ 「化合物」である(エ)を最終判断とする"
                    ]
                  }
                },
                { id: "q2_5", label: "(5) 黒鉛", type: "multiple_choice", options: ["(イ)", "(ウ)", "(エ)"], correctAnswer: "(ウ)", correctAnswerRate: 85,
                  detailedExplanation: {
                    theme: "物質の分類（黒鉛）",
                    type: "演繹型",
                    steps: [
                      "① 黒鉛の構成元素について確認する",
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
                      "① 石油（原油）の構成について確認する",
                      "② 複数の炭化水素などが混ざり合っていることを想起する",
                      "③ 複数の純物質からなる混合物であると判断する",
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
                  "overview": "混合物、単体、化合物をそれぞれ正確に判別するための基本プロセスを身につけましょう。",
                  "tree": "物質の分類\n├ 混合物（複数の物質が混載）：空気、食塩水、石油\n└ 純物質（単一の化学式）\n   ├ 単体（1元素のみ）：酸素、黒鉛\n   └ 化合物（2元素以上）：メタン",
                  "steps": ["Step 1: 混合物と純物質の判定", "Step 2: 単体と化合物の判定"]
                },
                "phase2": {
                  "explanations": [
                    {
                      "step": "Step 1",
                      "tag": "混合物の判定",
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
          practiceProblems: [
            {
              id: "q_c1_2_A_1",
              category: "物質の分離と精製 (問1)",
              text: "【問1】次の文章の空欄（ア）〜（タ）に適する語句・例を答えよ。（語句網羅）\n\n混合物から目的物質を取り出す操作を（ア）といい、得られた物質をさらに純粋にする操作を（イ）という。固体と液体の混合物から固体を分けるには（ウ）を用い、ろ紙とろうとが必要である。沸点の違いを利用して液体を取り出す方法を（エ）といい、その装置では枝付きフラスコ、温度計、（オ）冷却器、アダプタ、三角フラスコを用いる。突沸を防ぐために（カ）を入れる。複数の液体混合物（例：液体空気、（キ））を段階的に沸点差で分ける方法は特に（ク）とよばれる。固体のまま気体になる性質を利用して分けるのが（ケ）であり、（コ）と砂の分離が代表例である（また（サ）やナフタレンも昇華しやすい）。温度による溶解度差を利用して固体を純粋に取り出すのが（シ）であり、（ス）の精製などに用いる。茶葉やヨウ素を有機溶媒に溶かして分けるのが（セ）、ろ紙への吸着力の差で色素を分けるのが（ソ）クロマトグラフィーである。気体の分離には（タ）クロマトグラフィーが用いられる。",
              subQuestions: [
                { id: "q1_a", label: "問1 (ア)", type: "short_answer", correctAnswer: "分離", correctAnswerRate: 85 },
                { id: "q1_b", label: "問1 (イ)", type: "short_answer", correctAnswer: "精製", correctAnswerRate: 85 },
                { id: "q1_c", label: "問1 (ウ)", type: "short_answer", correctAnswer: "ろ過", correctAnswerRate: 85 },
                { id: "q1_d", label: "問1 (エ)", type: "short_answer", correctAnswer: "蒸留", correctAnswerRate: 85 },
                { id: "q1_o", label: "問1 (オ)", type: "short_answer", correctAnswer: "リービッヒ", correctAnswerRate: 85 },
                { id: "q1_ka", label: "問1 (カ)", type: "short_answer", correctAnswer: "沸騰石", correctAnswerRate: 85 },
                { id: "q1_ki", label: "問1 (キ)", type: "short_answer", correctAnswer: "石油", correctAnswerRate: 85 },
                { id: "q1_ku", label: "問1 (ク)", type: "short_answer", correctAnswer: "分留", correctAnswerRate: 85 },
                { id: "q1_ke", label: "問1 (ケ)", type: "short_answer", correctAnswer: "昇華法", correctAnswerRate: 85 },
                { id: "q1_ko", label: "問1 (コ)", type: "short_answer", correctAnswer: "ヨウ素", correctAnswerRate: 85 },
                { id: "q1_sa", label: "問1 (サ)", type: "short_answer", correctAnswer: "ドライアイス", correctAnswerRate: 85 },
                { id: "q1_shi", label: "問1 (シ)", type: "short_answer", correctAnswer: "再結晶", correctAnswerRate: 85 },
                { id: "q1_su", label: "問1 (ス)", type: "short_answer", correctAnswer: "硝酸カリウム", correctAnswerRate: 85 },
                { id: "q1_se", label: "問1 (セ)", type: "short_answer", correctAnswer: "抽出", correctAnswerRate: 85 },
                { id: "q1_so", label: "問1 (ソ)", type: "short_answer", correctAnswer: "ペーパー", correctAnswerRate: 85 },
                { id: "q1_ta", label: "問1 (タ)", type: "short_answer", correctAnswer: "ガス", correctAnswerRate: 85 }
              ],
              explanation: "{\"type\": \"logic_thought\", \"phase1\": {\"title\": \"物質の分離と精製\", \"overview\": \"混合物から目的物質を分ける種々の物理的操作方法を整理・把握しましょう。\", \"tree\": \"分離と精製\\n├ 固体＋液体 分離 ── ろ過\\n├ 沸点の差を利用 ─── 蒸留 / 分留\\n├ 昇華性を利用 ──── 昇華法\\n├ 溶解度の温度差 ── 再結晶\\n├ 溶媒への溶解度差 ─ 抽出\\n└ 吸着力の差を利用 ─ クロマトグラフィー\", \"steps\": [\"基礎用語\", \"各分離法の特徴\", \"具体例の確認\"]}, \"phase2\": {\"explanations\": [{\"step\": \"基礎用語\", \"tag\": \"定義\", \"subQuestionIds\": [\"q1_a\", \"q1_b\"], \"content\": \"混合物から目的物質を取り出す操作を<b>分離</b>、それをさらに純粋にする操作を<b>精製</b>と呼びます。\"}, {\"step\": \"各分離法の特徴\", \"tag\": \"科学的原理\", \"subQuestionIds\": [\"q1_c\", \"q1_d\", \"q1_o\", \"q1_ka\", \"q1_ku\", \"q1_ke\", \"q1_shi\", \"q1_se\", \"q1_so\", \"q1_ta\"], \"content\": \"・<b>ろ過</b>：固体と液体をろ紙で分ける。\\n・<b>蒸留・分留</b>：沸点差を利用する。リービッヒ冷却器、突沸を防ぐための<b>沸騰石</b>を使用。原油などの液体混合物を段階的に分けるのが分留。\\n・<b>昇華法</b>：昇華しやすい物質（ヨウ素・ドライアイス・ナフタレンなど）を気化させて分ける。\\n・<b>再結晶</b>：温度による溶解度差を利用する（硝酸カリウム等）。\\n・<b>抽出</b>：特定の溶媒への溶けやすさの違いを利用する（茶、ヨウ素）。\\n・<b>クロマトグラフィー</b>：吸着力の違いを利用して色素等を分ける（ペーパー、ガス）。\"}, {\"step\": \"具体例の確認\", \"tag\": \"応用\", \"subQuestionIds\": [\"q1_ki\", \"q1_ko\", \"q1_sa\", \"q1_su\"], \"content\": \"分留を行う代表例は<b>石油（原油）</b>や液体空気です。また、昇華性の物質には<b>ヨウ素</b>や<b>ドライアイス</b>、再結晶を行う物質には<b>硝酸カリウム</b>があります。\"}], \"stumblingPoints\": [{\"point\": \"蒸留と分留の区別\", \"description\": \"単純な沸点差で液体の1成分のみを取り出すのが蒸留、沸点が異なる複数の液体混合物を順に加熱して分離するのが分留です。\"}, {\"point\": \"抽出とクロマトグラフィーの区別\", \"description\": \"特定の溶媒への「溶けやすさの差」を利用するのが抽出（カフェインなど）。展開剤や固定相への「吸着力・移動速度の差」を利用するのがクロマトグラフィー（インクの色素など）です。\"}]}}",
              surroundingKnowledge: [],
              deepDiveTopics: []
            },
            {
              id: "q_c1_2_A_2",
              category: "物質の分離と精製 (問2)",
              text: "【問2】次の (1)〜(8) の混合物について、最も適切な分離・精製法を【ア：ろ過、イ：蒸留、ウ：分留、エ：昇華法、オ：再結晶、カ：抽出、キ：クロマトグラフィー】から選べ。",
              subQuestions: [
                { id: "q2_1", label: "(1) 砂と食塩水の混合物から砂を除く", type: "multiple_choice", options: ["ア", "イ", "ウ", "エ", "オ", "カ", "キ"], correctAnswer: "ア", correctAnswerRate: 85 },
                { id: "q2_2", label: "(2) 食塩水から純粋な水を取り出す", type: "multiple_choice", options: ["ア", "イ", "ウ", "エ", "オ", "カ", "キ"], correctAnswer: "イ", correctAnswerRate: 85 },
                { id: "q2_3", label: "(3) 原油からガソリン・灯油・軽油を分ける", type: "multiple_choice", options: ["ア", "イ", "ウ", "エ", "オ", "カ", "キ"], correctAnswer: "ウ", correctAnswerRate: 85 },
                { id: "q2_4", label: "(4) ヨウ素と砂の混合物からヨウ素を取り出す", type: "multiple_choice", options: ["ア", "イ", "ウ", "エ", "オ", "カ", "キ"], correctAnswer: "エ", correctAnswerRate: 85 },
                { id: "q2_5", label: "(5) 少量のNaClを含むKNO₃を純粋なKNO₃にする", type: "multiple_choice", options: ["ア", "イ", "ウ", "エ", "オ", "カ", "キ"], correctAnswer: "オ", correctAnswerRate: 85 },
                { id: "q2_6", label: "(6) お茶の葉から、お湯でカフェインを取り出す", type: "multiple_choice", options: ["ア", "イ", "ウ", "エ", "オ", "カ", "キ"], correctAnswer: "カ", correctAnswerRate: 85 },
                { id: "q2_7", label: "(7) インクに含まれる色素を分離する", type: "multiple_choice", options: ["ア", "イ", "ウ", "エ", "オ", "カ", "キ"], correctAnswer: "キ", correctAnswerRate: 85 },
                { id: "q2_8", label: "(8) 液体空気から窒素と酸素を分ける", type: "multiple_choice", options: ["ア", "イ", "ウ", "エ", "オ", "カ", "キ"], correctAnswer: "ウ", correctAnswerRate: 85 }
              ],
              explanation: "▼ 解答・解説\n(1) ア (2) イ (3) ウ (4) エ (5) オ (6) カ (7) キ (8) ウ\n\n■ ポイント：\n・固体 + 液体 ──→ ろ過\n・液体 + 溶質（溶質を残す/液体を得る） ──→ 蒸留\n・複数液体（沸点差） ──→ 分留\n・昇華性物質（ヨウ素・ナフタレンなど） ──→ 昇華法\n・溶解度の温度依存差 ──→ 再結晶\n・特定の溶媒で抽出 ──→ 抽出\n・吸着力の差で分離 ──→ クロマトグラフィー",
              surroundingKnowledge: [],
              deepDiveTopics: []
            },
            {
              id: "q_c1_2_A_3",
              category: "物質の分離と精製 (問3)",
              text: "【問3】蒸留装置（図2）に関する次の問いに答えよ。\n\n<img src=\"https://lh3.googleusercontent.com/d/1kzR8OOwzTg6so_HZF9a5YCEo-tazaMmF\" alt=\"蒸留装置\" class=\"w-full max-w-md mx-auto my-4 rounded-lg shadow-sm border border-gray-200\" referrerPolicy=\"no-referrer\" />",
              subQuestions: [
                { id: "q3_1", label: "(1) 温度計の球部はどの位置に取り付けるべきか答えよ。", type: "descriptive", correctAnswer: "枝付きフラスコの枝の付け根（蒸気が出ていく位置）に温度計の球部を合わせる。沸点を正しく測るため。", gradingCriteria: ["枝", "付け根", "蒸気", "位置", "沸点", "測る"], correctAnswerRate: 85 },
                { id: "q3_2", label: "(2) リービッヒ冷却器に流す冷却水は、どちら側から入れて、どちら側から出すのが正しいか。理由とともに答えよ。", type: "descriptive", correctAnswer: "下から入れて上から出す。冷却器全体に水を満たし、効率よく冷却するため（また逆流を防ぐため）。", gradingCriteria: ["下から", "上から", "水で満たす", "冷却効率", "効率よく冷却"], correctAnswerRate: 85 },
                { id: "q3_3", label: "(3) 突沸を防ぐために加えるものを答えよ。", type: "short_answer", correctAnswer: "沸騰石", correctAnswerRate: 85 },
                { id: "q3_4", label: "(4) 加熱時に三角フラスコの口を密栓してはいけない理由を述べよ。", type: "descriptive", correctAnswer: "内部の蒸気で圧力が高まり、装置が破裂する危険があるから。", gradingCriteria: ["蒸気", "圧力", "高まり", "破裂", "危険", "密閉"], correctAnswerRate: 85 }
              ],
              explanation: "▼ 解答・解説\n(1) 枝付きフラスコの枝の付け根（蒸気が出ていく位置）に温度計の球部を合わせる。沸点を正しく測るため。\n(2) 下から入れて上から出す。冷却器全体に冷却水を満たし、効率よく冷却するため。\n(3) 沸騰石（素焼きのかけら、ガラスビーズなど）。\n(4) 内部の蒸気による圧力上昇にともない、装置やゴム栓が外れたり、ガラス器具が破裂するおそれがあり非常に危険なため、密栓しません（常に大気圧に開放するようアダプター部に隙間を開けます）。",
              surroundingKnowledge: [],
              deepDiveTopics: []
            },
            {
              id: "q_c1_2_A_4",
              category: "物質の分離と精製 (問4)",
              text: "【問4】（標準）KNO₃ と NaCl の混合物 20 g に水 50 g を加えて 60 ℃ で全量を溶かし、室温 20 ℃ までゆっくり冷却したところ、KNO₃ の純粋な結晶が析出した。これは何という分離法か。また、なぜ KNO₃ だけが析出し、NaCl はほとんど析出しなかったか、溶解度の温度依存性に着目して説明せよ。",
              subQuestions: [
                { id: "q4_1", label: "分離法の名称", type: "short_answer", correctAnswer: "再結晶", correctAnswerRate: 85 },
                { id: "q4_2", label: "理由の説明", type: "descriptive", correctAnswer: "KNO₃の溶解度は温度上昇とともに大きく増加するが、NaClの溶解度は温度によってほとんど変化しない。そのため高温で溶けていたKNO₃は温度を下げると溶解度が小さくなり結晶として析出する一方、NaClは溶けたままになる。", gradingCriteria: ["KNO3", "溶解度", "温度", "変化", "析出", "NaCl", "溶けたまま"], correctAnswerRate: 85 }
              ],
              explanation: "▼ 解答・解説\n分離法：再結晶（recrystallization）。\n理由：KNO₃の溶解度は温度上昇にともなって大きく増加する（温度依存性が大きい）が、NaClの溶解度は温度によってほとんど変化しない（温度依存性が非常に小さい）。そのため高温でたくさん溶けていたKNO₃は、温度を下げる（冷却する）と水に溶けきれなくなり溶解度の差にあたる量が純粋な結晶として析出する一方、NaClは溶解度が下がらないため溶けたまま液中に残る。",
              surroundingKnowledge: [],
              deepDiveTopics: []
            },
            {
              id: "q_c1_2_A_5",
              category: "物質の分離と精製 (問5)",
              text: "【問5】（文字式・文章題）ある物質Aの溶解度は、t [℃] で S(t) [g/100g 水] で与えられる（S(t)は単調増加）。70℃の飽和水溶液 M [g] を 20℃まで冷却したとき、析出する結晶の質量を、M, S(70), S(20) を用いて表せ。",
              subQuestions: [
                { id: "q5_formula", label: "析出する結晶の質量 [g]", type: "descriptive", correctAnswer: "M・{S(70)－S(20)} / {100＋S(70)}", gradingCriteria: ["M", "S(70)", "S(20)", "100"], correctAnswerRate: 85 }
              ],
              explanation: "▼ 解答・解説\n70℃飽和水溶液 M [g] の内訳：\n・水100 gに対して溶質がS(70) g溶けている溶液（全体100 + S(70) g）から、比率を考えると：\n   溶質の質量 ＝ M × S(70) / (100 + S(70)) [g]\n   水の質量 ＝ M × 100 / (100 + S(70)) [g]\n\n20℃に冷却したとき：\n・水100 gに対して溶ける溶質はS(20) gだから、上記の水W gに溶ける溶質は：\n   W × S(20) / 100 ＝ [M × {100 / (100 + S(70))}] × S(20) / 100 ＝ M × S(20) / (100 + S(70)) [g]\n\n析出する結晶の質量 ＝ 元の溶質 － 20℃で溶けたままの溶質\n   ＝ M × S(70) / (100 + S(70)) － M × S(20) / (100 + S(70))\n   ＝ M × {S(70) － S(20)} / {100 + S(70)} [g]",
              surroundingKnowledge: [],
              deepDiveTopics: []
            },
            {
              id: "q_c1_2_A_6",
              category: "物質の分離と精製 (問6)",
              text: "【問6】（記述）次の操作で誤りを一つずつ指摘し、正しい方法を述べよ。\n\n(1) ろ過の際、ろうとの先（細い管的先端）をビーカーの中央に向けて、ろ液を勢いよく流した。\n(2) 蒸留の実験を、ガラス器具をすべて密閉した状態で開始した。\n(3) ペーパークロマトグラフィーで、サンプルをつけた線が展開液（溶媒）の中に浸かるようにセットした。",
              subQuestions: [
                { id: "q6_1", label: "(1) ろ過の誤りと正しい方法", type: "descriptive", correctAnswer: "ろうとの先はビーカーの内壁に密着させる。液はねを防ぎ、液体が壁を伝うようにするため。", gradingCriteria: ["ろうとの先", "ビーカー", "内壁", "密着", "液はね", "壁を伝う"], correctAnswerRate: 85 },
                { id: "q6_2", label: "(2) 蒸留の誤りと正しい方法", type: "descriptive", correctAnswer: "装置は必ず大気開放（外気と通じる部分）を持たせる。完全密閉では圧力上昇で破裂する。", gradingCriteria: ["大気開放", "密閉", "圧力", "破裂"], correctAnswerRate: 85 },
                { id: "q6_3", label: "(3) クロマトグラフィーの誤りと正しい方法", type: "descriptive", correctAnswer: "サンプルをつけた線は展開液面より上にしなければならない。線が浸かるとサンプルが溶け出してしまう。", gradingCriteria: ["サンプル", "線", "展開液面", "上", "浸かる", "溶け出す"], correctAnswerRate: 85 }
              ],
              explanation: "▼ 解答・解説\n(1) ろうとの先はビーカーの内壁に密着させる。液はねを防ぎ、液体が流れる速度をスムーズ（表面張力の引き込みにより速くなる）にするためです。\n(2) 装置は必ず大気開放（外気と通じる部分）を持たせ、完全密閉しないようにします。完全密閉すると装置内の空気や加熱生成された蒸気によって内圧が高まり、ガラス器具が密栓部から破裂・爆発し大事故へ繋がります。\n(3) サンプルをつけた原線は展開液の液面より上の位置になるよう調整してセットする必要があります。もし線が展開液面より下に浸かってしまうと、色素が紙を登って分離する前に展開液の中にすべて溶け出してしまい分離できません。",
              surroundingKnowledge: [],
              deepDiveTopics: []
            },
            {
              id: "q_c1_2_A_7",
              category: "物質の分離と精製 (問7)",
              text: "【問7】次の混合物の組合せと、それを分離するのに最も適切な操作の対応で、誤っているものを一つ選べ。\n\n① 水とエタノール ─ 分留\n② ヨウ素と塩化ナトリウム ─ 昇華法\n③ 砂と砂糖水 ─ 蒸留\n④ 葉緑素を含む色素 ─ クロマトグラフィー\n⑤ アルミ缶と鉄缶 ─ 磁石による分別",
              subQuestions: [
                { id: "q7_wrong_option", label: "誤っている組み合わせ", type: "multiple_choice", options: ["①", "②", "③", "④", "⑤"], correctAnswer: "③", correctAnswerRate: 85 }
              ],
              explanation: "▼ 解答・解説\n答：③\n\n■ 砂と砂糖水を分けるには、まず『ろ過』で粒子が大きい「砂」を除き（＝固体と液体の分離）、その後に砂糖水全体から純粋な水を得るために『蒸留』を行います。単一のアプローチにあたる「蒸留」のみの単一操作では砂と砂糖と水を同時に適切に分けることはできないため、誤りです。",
              surroundingKnowledge: [],
              deepDiveTopics: []
            }
          ],
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
          topics: ["熱運動", "絶対温度", "物質の三態", "状態変化", "物理変化・化学変化"],
          practiceProblems: [
            {
              id: "q_c1_3_1",
              category: "粒子の熱運動と物質の三態 (問1)",
              text: `【問1】 次の文章の空欄（ア）〜（ソ）に適する語句・数値を答えよ。（語句網羅）\n物質を構成する粒子は静止しておらず、不規則な運動をしている。これを（ア）という。温度が高いほど粒子の平均の速さは（イ：大きく／小さく）なる。理論上、粒子の運動が止まる温度を（ウ）といい、セルシウス温度では（エ）℃である。これを基準にした温度を（オ）といい、単位は（カ）（記号 K）で表す。セルシウス温度 t [℃] と絶対温度 T [K] の関係は T = （キ）＋ t である。物質の三態は（ク）・液体・（ケ）であり、固体→液体への変化を（コ）、液体→気体への変化を（サ）、気体→液体への変化を（シ）、液体→固体への変化を（ス）という。固体から直接気体になる変化を（セ）といい、逆に気体から直接固体になる変化を（ソ）（または昇華）という。状態だけが変化し、別の物質に変わらない変化を物理変化、別の物質になる変化を化学変化という。`,
              subQuestions: [
                { id: "q_c1_3_1_a", label: "（ア）", type: "short_answer", correctAnswer: "熱運動", correctAnswerRate: 85 },
                { id: "q_c1_3_1_i", label: "（イ）", type: "multiple_choice", options: ["大きく", "小さく"], correctAnswer: "大きく", correctAnswerRate: 85 },
                { id: "q_c1_3_1_u", label: "（ウ）", type: "short_answer", correctAnswer: "絶対零度", correctAnswerRate: 85 },
                { id: "q_c1_3_1_e", label: "（エ）", type: "short_answer", correctAnswer: "−273", correctAnswerRate: 85 },
                { id: "q_c1_3_1_o", label: "（オ）", type: "short_answer", correctAnswer: "絶対温度", correctAnswerRate: 85 },
                { id: "q_c1_3_1_ka", label: "（カ）", type: "short_answer", correctAnswer: "ケルビン", correctAnswerRate: 85 },
                { id: "q_c1_3_1_ki", label: "（キ）", type: "short_answer", correctAnswer: "273", correctAnswerRate: 85 },
                { id: "q_c1_3_1_ku", label: "（ク）", type: "short_answer", correctAnswer: "固体", correctAnswerRate: 85 },
                { id: "q_c1_3_1_ke", label: "（ケ）", type: "short_answer", correctAnswer: "気体", correctAnswerRate: 85 },
                { id: "q_c1_3_1_ko", label: "（コ）", type: "short_answer", correctAnswer: "融解", correctAnswerRate: 85 },
                { id: "q_c1_3_1_sa", label: "（サ）", type: "short_answer", correctAnswer: "蒸発", correctAnswerRate: 85 },
                { id: "q_c1_3_1_shi", label: "（シ）", type: "short_answer", correctAnswer: "凝縮", correctAnswerRate: 85 },
                { id: "q_c1_3_1_su", label: "（ス）", type: "short_answer", correctAnswer: "凝固", correctAnswerRate: 85 },
                { id: "q_c1_3_1_se", label: "（セ）", type: "short_answer", correctAnswer: "昇華", correctAnswerRate: 85 },
                { id: "q_c1_3_1_so", label: "（ソ）", type: "short_answer", correctAnswer: "凝華", correctAnswerRate: 85 }
              ],
              explanation: "▼ 解答・解説\n（ア）熱運動 （イ）大きく （ウ）絶対零度 （エ）−273 （オ）絶対温度 （カ）ケルビン\n（キ）273 （ク）固体 （ケ）気体 （コ）融解 （サ）蒸発 （シ）凝縮 （ス）凝固 （セ）昇華 （ソ）凝華",
              surroundingKnowledge: [],
              deepDiveTopics: []
            },
            {
              id: "q_c1_3_2",
              category: "粒子の熱運動と物質の三態 (問2)",
              text: `【問2】 （基礎）次の温度をセルシウス温度から絶対温度に、あるいはその逆に換算せよ。\n(1) 27 ℃ → [ ] K\n(2) 0 ℃ → [ ] K\n(3) 100 ℃ → [ ] K\n(4) 200 K → [ ] ℃\n(5) 373 K → [ ] ℃\n(6) 25 ℃ → [ ] K`,
              subQuestions: [
                { id: "q_c1_3_2_1", label: "(1)", type: "short_answer", correctAnswer: "300", correctAnswerRate: 85 },
                { id: "q_c1_3_2_2", label: "(2)", type: "short_answer", correctAnswer: "273", correctAnswerRate: 85 },
                { id: "q_c1_3_2_3", label: "(3)", type: "short_answer", correctAnswer: "373", correctAnswerRate: 85 },
                { id: "q_c1_3_2_4", label: "(4)", type: "short_answer", correctAnswer: "-73", correctAnswerRate: 85 },
                { id: "q_c1_3_2_5", label: "(5)", type: "short_answer", correctAnswer: "100", correctAnswerRate: 85 },
                { id: "q_c1_3_2_6", label: "(6)", type: "short_answer", correctAnswer: "298", correctAnswerRate: 85 }
              ],
              explanation: "▼ 解答・解説\n(1) 300 K (2) 273 K (3) 373 K (4) −73 ℃ (5) 100 ℃ (6) 298 K\n■ T = 273 + t ⇄ t = T − 273.",
              surroundingKnowledge: [],
              deepDiveTopics: []
            },
            {
              id: "q_c1_3_3",
              category: "粒子の熱運動と物質の三態 (問3)",
              text: `【問3】 次のア〜カの現象は、固体・液体・気体の三態のどれからどれへの状態変化か答え、変化の名称を答えよ。\nア：冷凍庫の中で水が氷になる\nイ：洗濯物が乾く\nウ：ドライアイスが小さくなる（液体にならず）\nエ：露が朝、葉に付く\nオ：寒い朝、霜柱や霜が降りる\nカ：ロウソクのロウが溶ける`,
              subQuestions: [
                { id: "q_c1_3_3_a", label: "ア：変化", type: "short_answer", correctAnswer: "液体から固体", correctAnswerRate: 85 },
                { id: "q_c1_3_3_a_name", label: "ア：名称", type: "short_answer", correctAnswer: "凝固", correctAnswerRate: 85 },
                { id: "q_c1_3_3_i", label: "イ：変化", type: "short_answer", correctAnswer: "液体から気体", correctAnswerRate: 85 },
                { id: "q_c1_3_3_i_name", label: "イ：名称", type: "short_answer", correctAnswer: "蒸発", correctAnswerRate: 85 },
                { id: "q_c1_3_3_u", label: "ウ：変化", type: "short_answer", correctAnswer: "固体から気体", correctAnswerRate: 85 },
                { id: "q_c1_3_3_u_name", label: "ウ：名称", type: "short_answer", correctAnswer: "昇華", correctAnswerRate: 85 },
                { id: "q_c1_3_3_e", label: "エ：変化", type: "short_answer", correctAnswer: "気体から液体", correctAnswerRate: 85 },
                { id: "q_c1_3_3_e_name", label: "エ：名称", type: "short_answer", correctAnswer: "凝縮", correctAnswerRate: 85 },
                { id: "q_c1_3_3_o", label: "オ：変化", type: "short_answer", correctAnswer: "気体から固体", correctAnswerRate: 85 },
                { id: "q_c1_3_3_o_name", label: "オ：名称", type: "short_answer", correctAnswer: "凝華", correctAnswerRate: 85 },
                { id: "q_c1_3_3_ka", label: "カ：変化", type: "short_answer", correctAnswer: "固体から液体", correctAnswerRate: 85 },
                { id: "q_c1_3_3_ka_name", label: "カ：名称", type: "short_answer", correctAnswer: "融解", correctAnswerRate: 85 }
              ],
              explanation: "▼ 解答・解説\nア：液体→固体（凝固） イ：液体→気体（蒸発） ウ：固体→気体（昇華）\nエ：気体→液体（凝縮） オ：気体→固体（凝華） カ：固体→液体（融解）",
              surroundingKnowledge: [],
              deepDiveTopics: []
            },
            {
              id: "q_c1_3_4",
              category: "粒子の熱運動と物質の三態 (問4)",
              text: `【問4】 （標準）次の変化のうち、化学変化はどれか。すべて選び記号で答えよ。\nア：水を加熱して水蒸気にする\nイ：鉄が空気中でさびて酸化鉄になる\nウ：砂糖が水に溶ける\nエ：マグネシウムリボンが燃えて酸化マグネシウムになる\nオ：氷が水になる\nカ：銅板を加熱して黒く変色する（CuO 生成）`,
              subQuestions: [
                { id: "q_c1_3_4_ans", label: "記号", type: "short_answer", correctAnswer: "イ・エ・カ", correctAnswerRate: 85 }
              ],
              explanation: "▼ 解答・解説\n答：イ・エ・カ\n■ 化学変化は『別の物質に変わる』もの。さび（鉄→酸化鉄）、燃焼（Mg→MgO）、加熱酸化（Cu→CuO）は化学変化。\nア・オは状態変化（物理変化）、ウは溶解（物理変化）。",
              surroundingKnowledge: [],
              deepDiveTopics: []
            },
            {
              id: "q_c1_3_5",
              category: "粒子の熱運動と物質の三態 (問5)",
              text: `【問5】 （文字式・文章題）ある気体粒子の平均運動エネルギーは絶対温度 T に比例する（E = kT、kは比例定数）。温度を T₁ [K] から T₂ [K] に変えたとき、平均運動エネルギーは何倍になるか。T₁, T₂ の式で表せ。また、T₁ = 300 K, T₂ = 600 K の場合の値を求めよ。`,
              subQuestions: [
                { id: "q_c1_3_5_exp", label: "式", type: "short_answer", correctAnswer: "T2/T1", correctAnswerRate: 85 },
                { id: "q_c1_3_5_val", label: "値", type: "short_answer", correctAnswer: "2.0倍", correctAnswerRate: 85 }
              ],
              explanation: "▼ 解答・解説\n倍率 = E(T₂)/E(T₁) = (k·T₂)/(k·T₁) = T₂/T₁.\nT₁=300 K, T₂=600 K のとき：600/300 = 2.0 倍.\n■ 平均運動エネルギーは絶対温度に比例するため、絶対温度を2倍にすると平均運動エネルギーも2倍。",
              surroundingKnowledge: [],
              deepDiveTopics: []
            },
            {
              id: "q_c1_3_6",
              category: "粒子の熱運動と物質の三態 (問6)",
              text: `【問6】 （標準）次の問いに答えよ。\n(1) 1 atm（大気圧）下での水の融点・沸点を℃と K の両方で答えよ。\n(2) 大気圧でドライアイスは何℃で昇華するか、おおよその値を答えよ（−79℃前後）。\n(3) 絶対温度の値が負になることはあるか。理由を述べよ。`,
              subQuestions: [
                { id: "q_c1_3_6_1_mp_c", label: "(1)融点(℃)", type: "short_answer", correctAnswer: "0", correctAnswerRate: 85 },
                { id: "q_c1_3_6_1_mp_k", label: "(1)融点(K)", type: "short_answer", correctAnswer: "273", correctAnswerRate: 85 },
                { id: "q_c1_3_6_1_bp_c", label: "(1)沸点(℃)", type: "short_answer", correctAnswer: "100", correctAnswerRate: 85 },
                { id: "q_c1_3_6_1_bp_k", label: "(1)沸点(K)", type: "short_answer", correctAnswer: "373", correctAnswerRate: 85 },
                { id: "q_c1_3_6_2", label: "(2)", type: "short_answer", correctAnswer: "-79", correctAnswerRate: 85 },
                { id: "q_c1_3_6_3", label: "(3)", type: "short_answer", correctAnswer: "ならない。絶対零度（0 K = −273 ℃）が粒子の運動が止まる下限であり、それより低い温度は存在しない。", correctAnswerRate: 85 }
              ],
              explanation: "▼ 解答・解説\n(1) 融点：0 ℃ = 273 K 沸点：100 ℃ = 373 K\n(2) 約 −79 ℃（=194 K）。常圧で液体にならず固体→気体に直接変化（昇華）。\n(3) ならない。絶対零度（0 K = −273 ℃）が粒子の運動が止まる下限であり、それより低い温度は存在しない。",
              surroundingKnowledge: [],
              deepDiveTopics: []
            },
            {
              id: "q_c1_3_7",
              category: "粒子の熱運動と物質の三態 (問7)",
              text: `【問7】 右図（図3）の三態モデルにおいて、状態変化に伴うエネルギーの出入りについて、次のうち正しいものをすべて選べ。\nア：融解では熱を吸収する。\nイ：凝縮では熱を放出する。\nウ：昇華では熱を放出する。\nエ：蒸発では熱を吸収する。\nオ：凝固では熱を吸収する。`,
              subQuestions: [
                { id: "q_c1_3_7_ans", label: "記号", type: "short_answer", correctAnswer: "ア・イ・エ", correctAnswerRate: 85 }
              ],
              explanation: "▼ 解答・解説\n答：ア・イ・エ\n■ 粒子間の結合を切る向きの変化（融解・蒸発・昇華）は『吸熱』、結合をつくる向きの変化（凝固・凝縮・凝華）は『発熱』。\nウ：昇華は固→気で結合を切るので吸熱（誤り）。オ：凝固は液→固で発熱（誤り）。",
              surroundingKnowledge: [],
              deepDiveTopics: []
            }
          ]
        },
        {
          id: "c2_1",
          abstractTitle: "① 原子の構造と電子配置・元素の周期表",
          realTitle: "2章 物質の構成粒子",
          topics: ["原子の構造", "電子配置", "元素の周期表"],
          practiceProblems: [
            {
              id: "q_c2_1_1",
              category: "原子の構造と電子配置・元素の周期表 (問1)",
              text: "【問1】 次の文章の空欄（ア）〜（ト）に適する語句・数値・記号を答えよ。（語句網羅）\n\n原子は中心にある（ア）と、そのまわりを運動する（イ）からなる。（ア）は（ウ）と（エ）から構成されている。原子の直径は約（オ）m、（ア）の直径はその約（カ）分の1である。（ウ）の数を（キ）といい、これは元素ごとに決まっている。（キ）と（エ）の数の和を（ク）という。（キ）が等しく（ク）が異なる原子どうしを互いに（ケ）（アイソトープ）という。電子は（コ）とよばれる空間に存在し、（ア）に近い方から K, L, M, N, …殻 と名づけられている。n 番目の電子殻に収容できる電子の最大数は（サ）個で表される。最も外側の電子殻にある電子を（シ）といい、化学的性質を主に決める電子を（ス）という。（ス）の数は典型元素で（セ）の一の位と一致するが、（ソ）（18族）では 0 とみなす。周期表で縦の列を（タ）、横の行を（チ）という。1族のうちH以外を（ツ）金属、2族をアルカリ土類金属、17族を（テ）、18族を（ト）という。",
              subQuestions: [
                { id: "q_c2_1_1_a", label: "（ア）", type: "short_answer", correctAnswer: "原子核", correctAnswerRate: 85 },
                { id: "q_c2_1_1_i", label: "（イ）", type: "short_answer", correctAnswer: "電子", correctAnswerRate: 85 },
                { id: "q_c2_1_1_u", label: "（ウ）", type: "short_answer", correctAnswer: "陽子", correctAnswerRate: 85 },
                { id: "q_c2_1_1_e", label: "（エ）", type: "short_answer", correctAnswer: "中性子", correctAnswerRate: 85 },
                { id: "q_c2_1_1_o", label: "（オ） ※10⁻¹⁰ と入力", type: "short_answer", correctAnswer: "10⁻¹⁰", correctAnswerRate: 85 },
                { id: "q_c2_1_1_ka", label: "（カ）", type: "short_answer", correctAnswer: "1万〜10万", correctAnswerRate: 85 },
                { id: "q_c2_1_1_ki", label: "（キ）", type: "short_answer", correctAnswer: "原子番号", correctAnswerRate: 85 },
                { id: "q_c2_1_1_ku", label: "（ク）", type: "short_answer", correctAnswer: "質量数", correctAnswerRate: 85 },
                { id: "q_c2_1_1_ke", label: "（ケ）", type: "short_answer", correctAnswer: "同位体", correctAnswerRate: 85 },
                { id: "q_c2_1_1_ko", label: "（コ）", type: "short_answer", correctAnswer: "電子殻", correctAnswerRate: 85 },
                { id: "q_c2_1_1_sa", label: "（サ） ※2n² と入力", type: "short_answer", correctAnswer: "2n²", correctAnswerRate: 85 },
                { id: "q_c2_1_1_shi", label: "（シ）", type: "short_answer", correctAnswer: "最外殻電子", correctAnswerRate: 85 },
                { id: "q_c2_1_1_su", label: "（ス）", type: "short_answer", correctAnswer: "価電子", correctAnswerRate: 85 },
                { id: "q_c2_1_1_se", label: "（セ）", type: "short_answer", correctAnswer: "族番号", correctAnswerRate: 85 },
                { id: "q_c2_1_1_so", label: "（ソ）", type: "short_answer", correctAnswer: "貴ガス", correctAnswerRate: 85 },
                { id: "q_c2_1_1_ta", label: "（タ）", type: "short_answer", correctAnswer: "族", correctAnswerRate: 85 },
                { id: "q_c2_1_1_chi", label: "（チ）", type: "short_answer", correctAnswer: "周期", correctAnswerRate: 85 },
                { id: "q_c2_1_1_tsu", label: "（ツ）", type: "short_answer", correctAnswer: "アルカリ", correctAnswerRate: 85 },
                { id: "q_c2_1_1_te", label: "（テ）", type: "short_answer", correctAnswer: "ハロゲン", correctAnswerRate: 85 },
                { id: "q_c2_1_1_to", label: "（ト）", type: "short_answer", correctAnswer: "貴ガス", correctAnswerRate: 85 }
              ],
              explanation: "▼ 解答・解説\n（ア）原子核 （イ）電子 （ウ）陽子 （エ）中性子 （オ）10⁻¹⁰ （カ）1万〜10万\n（キ）原子番号 （ク）質量数 （ケ）同位体 （コ）電子殻 （サ）2n²\n（シ）最外殻電子 （ス）価電子 （セ）族番号 （ソ）貴ガス （タ）族 （チ）周期\n（ツ）アルカリ （テ）ハロゲン （ト）貴ガス（希ガスも正答ですが、本設問は共通呼称の「貴ガス」を基本にしています）",
              surroundingKnowledge: [],
              deepDiveTopics: []
            },
            {
              id: "q_c2_1_2",
              category: "原子の構造と電子配置・元素の周期表 (問2)",
              text: "【問2】 （基礎）次の原子について、(a)陽子数、(b)中性子数、(c)電子数、(d)質量数 を答えよ（中性原子とする）。\n\n(1) ¹H  (2) ¹²C  (3) ¹⁶O  (4) ²³Na  (5) ³⁵Cl  (6) ⁴⁰Ar",
              subQuestions: [
                { id: "q_c2_1_2_1a", label: "(1) ¹H (a)陽子数", type: "short_answer", correctAnswer: "1", correctAnswerRate: 85 },
                { id: "q_c2_1_2_1b", label: "(1) ¹H (b)中性子数", type: "short_answer", correctAnswer: "0", correctAnswerRate: 85 },
                { id: "q_c2_1_2_1c", label: "(1) ¹H (c)電子数", type: "short_answer", correctAnswer: "1", correctAnswerRate: 85 },
                { id: "q_c2_1_2_1d", label: "(1) ¹H (d)質量数", type: "short_answer", correctAnswer: "1", correctAnswerRate: 85 },
                { id: "q_c2_1_2_2a", label: "(2) ¹²C (a)陽子数", type: "short_answer", correctAnswer: "6", correctAnswerRate: 85 },
                { id: "q_c2_1_2_2b", label: "(2) ¹²C (b)中性子数", type: "short_answer", correctAnswer: "6", correctAnswerRate: 85 },
                { id: "q_c2_1_2_2c", label: "(2) ¹²C (c)電子数", type: "short_answer", correctAnswer: "6", correctAnswerRate: 85 },
                { id: "q_c2_1_2_2d", label: "(2) ¹²C (d)質量数", type: "short_answer", correctAnswer: "12", correctAnswerRate: 85 },
                { id: "q_c2_1_2_3a", label: "(3) ¹⁶O (a)陽子数", type: "short_answer", correctAnswer: "8", correctAnswerRate: 85 },
                { id: "q_c2_1_2_3b", label: "(3) ¹⁶O (b)中性子数", type: "short_answer", correctAnswer: "8", correctAnswerRate: 85 },
                { id: "q_c2_1_2_3c", label: "(3) ¹⁶O (c)電子数", type: "short_answer", correctAnswer: "8", correctAnswerRate: 85 },
                { id: "q_c2_1_2_3d", label: "(3) ¹⁶O (d)質量数", type: "short_answer", correctAnswer: "16", correctAnswerRate: 85 },
                { id: "q_c2_1_2_4a", label: "(4) ²³Na (a)陽子数", type: "short_answer", correctAnswer: "11", correctAnswerRate: 85 },
                { id: "q_c2_1_2_4b", label: "(4) ²³Na (b)中性子数", type: "short_answer", correctAnswer: "12", correctAnswerRate: 85 },
                { id: "q_c2_1_2_4c", label: "(4) ²³Na (c)電子数", type: "short_answer", correctAnswer: "11", correctAnswerRate: 85 },
                { id: "q_c2_1_2_4d", label: "(4) ²³Na (d)質量数", type: "short_answer", correctAnswer: "23", correctAnswerRate: 85 },
                { id: "q_c2_1_2_5a", label: "(5) ³⁵Cl (a)陽子数", type: "short_answer", correctAnswer: "17", correctAnswerRate: 85 },
                { id: "q_c2_1_2_5b", label: "(5) ³⁵Cl (b)中性子数", type: "short_answer", correctAnswer: "18", correctAnswerRate: 85 },
                { id: "q_c2_1_2_5c", label: "(5) ³⁵Cl (c)電子数", type: "short_answer", correctAnswer: "17", correctAnswerRate: 85 },
                { id: "q_c2_1_2_5d", label: "(5) ³⁵Cl (d)質量数", type: "short_answer", correctAnswer: "35", correctAnswerRate: 85 },
                { id: "q_c2_1_2_6a", label: "(6) ⁴⁰Ar (a)陽子数", type: "short_answer", correctAnswer: "18", correctAnswerRate: 85 },
                { id: "q_c2_1_2_6b", label: "(6) ⁴⁰Ar (b)中性子数", type: "short_answer", correctAnswer: "22", correctAnswerRate: 85 },
                { id: "q_c2_1_2_6c", label: "(6) ⁴⁰Ar (c)電子数", type: "short_answer", correctAnswer: "18", correctAnswerRate: 85 },
                { id: "q_c2_1_2_6d", label: "(6) ⁴⁰Ar (d)質量数", type: "short_answer", correctAnswer: "40", correctAnswerRate: 85 }
              ],
              explanation: "▼ 解答・解説\n(1) ¹H ：(a)1 (b)0 (c)1 (d)1\n(2) ¹²C：(a)6 (b)6 (c)6 (d)12\n(3) ¹⁶O：(a)8 (b)8 (c)8 (d)16\n(4) ²³Na：(a)11 (b)12 (c)11 (d)23\n(5) ³⁵Cl：(a)17 (b)18 (c)17 (d)35\n(6) ⁴⁰Ar：(a)18 (b)22 (c)18 (d)40\n\n■ 中性子数 = 質量数 − 陽子数。 中性原子なら 電子数 = 陽子数。",
              surroundingKnowledge: [],
              deepDiveTopics: []
            },
            {
              id: "q_c2_1_3",
              category: "原子の構造と電子配置・元素の周期表 (問3)",
              text: "【問3】 （基礎）次の原子の電子配置を K, L, M, N 殻の電子数で表せ（例：Na → K2 L8 M1）。\n\n(1) He  (2) C  (3) O  (4) F  (5) Ne  (6) Mg  (7) Cl  (8) K  (9) Ca",
              subQuestions: [
                { id: "q_c2_1_3_1", label: "(1) He", type: "short_answer", correctAnswer: "K2", correctAnswerRate: 85 },
                { id: "q_c2_1_3_2", label: "(2) C", type: "short_answer", correctAnswer: "K2 L4", correctAnswerRate: 85 },
                { id: "q_c2_1_3_3", label: "(3) O", type: "short_answer", correctAnswer: "K2 L6", correctAnswerRate: 85 },
                { id: "q_c2_1_3_4", label: "(4) F", type: "short_answer", correctAnswer: "K2 L7", correctAnswerRate: 85 },
                { id: "q_c2_1_3_5", label: "(5) Ne", type: "short_answer", correctAnswer: "K2 L8", correctAnswerRate: 85 },
                { id: "q_c2_1_3_6", label: "(6) Mg", type: "short_answer", correctAnswer: "K2 L8 M2", correctAnswerRate: 85 },
                { id: "q_c2_1_3_7", label: "(7) Cl", type: "short_answer", correctAnswer: "K2 L8 M7", correctAnswerRate: 85 },
                { id: "q_c2_1_3_8", label: "(8) K", type: "short_answer", correctAnswer: "K2 L8 M8 N1", correctAnswerRate: 85 },
                { id: "q_c2_1_3_9", label: "(9) Ca", type: "short_answer", correctAnswer: "K2 L8 M8 N2", correctAnswerRate: 85 }
              ],
              explanation: "▼ 解答・解説\n(1) He：K2\n(2) C：K2 L4\n(3) O：K2 L6\n(4) F：K2 L7\n(5) Ne：K2 L8\n(6) Mg：K2 L8 M2\n(7) Cl：K2 L8 M7\n(8) K：K2 L8 M8 N1\n(9) Ca：K2 L8 M8 N2\n\n■ K殻最大2, L殻最大8, M殻最大18個。KとLが詰まったら次はM。\nただしM殻は8個までで一旦止まりN殻に入る（K, Ca で M=8 のまま N に1, 2 個入る点に注意）。",
              surroundingKnowledge: [],
              deepDiveTopics: []
            },
            {
              id: "q_c2_1_4",
              category: "原子の構造と電子配置・元素の周期表 (問4)",
              text: "【問4】 （標準）次の問いに答えよ。\n\n(1) 価電子の数が等しい元素は周期表でどの位置関係にあるか。\n(2) 第3周期で価電子数が 0 の元素を答えよ。\n(3) ¹²C と ¹³C, ¹⁴C の関係を何というか。化学的性質はどうなるか述べよ。\n(4) 典型元素と遷移元素の違いを、価電子数の変化に着目して説明せよ。",
              subQuestions: [
                { id: "q_c2_1_4_1", label: "(1) 位置関係", type: "short_answer", correctAnswer: "同じ族", correctAnswerRate: 85 },
                { id: "q_c2_1_4_2", label: "(2) 元素名称（カタカナ）", type: "short_answer", correctAnswer: "アルゴン", correctAnswerRate: 85 },
                { id: "q_c2_1_4_3a", label: "(3) 関係名", type: "short_answer", correctAnswer: "同位体", correctAnswerRate: 85 },
                { id: "q_c2_1_4_3b", label: "(3) 化学的性質", type: "short_answer", correctAnswer: "ほぼ同じ", correctAnswerRate: 85 },
                { id: "q_c2_1_4_4", label: "(4) 価電子数に着目した説明", type: "descriptive", correctAnswer: "典型元素は族番号によって価電子数が規則的に変化（1族→1, 2族→2...）するのに対し、遷移元素は原子番号が変わっても価電子数がほぼ1または2で同じである。", correctAnswerRate: 85 }
              ],
              explanation: "▼ 解答・解説\n(1) 同じ族（同じ縦の列）にある。\n(2) アルゴン Ar（貴ガス、価電子数 0）。\n(3) 互いに同位体（アイソトープ）の関係。陽子数は同じで中性子数が異なる。電子配置が同じため化学的性質はほぼ同じ（質量に依存する物理的性質はわずかに異なる）。\n(4) 典型元素は族番号によって価電子数が規則的に変化する（1族→1, 2族→2, 13族→3, …, 17族→7, 18族→0）。\n遷移元素（3〜12族）は原子番号が変わっても価電子数がほぼ 1 or 2 で同じ（内殻に入るため）。隣接元素どうしの性質が似る。",
              surroundingKnowledge: [],
              deepDiveTopics: []
            },
            {
              id: "q_c2_1_5",
              category: "原子の構造と電子配置・元素の周期表 (問5)",
              text: "【問5】 （文字式・文章題）電子殻 n=1, 2, 3, 4 にそれぞれ収容できる電子の最大数を文字式 2n² で計算し、合計が 60 個になるためには何殻まで満たす必要があるかを示せ。",
              subQuestions: [
                { id: "q_c2_1_5_1", label: "n=1(K殻)最大数", type: "short_answer", correctAnswer: "2", correctAnswerRate: 85 },
                { id: "q_c2_1_5_2", label: "n=2(L殻)最大数", type: "short_answer", correctAnswer: "8", correctAnswerRate: 85 },
                { id: "q_c2_1_5_3", label: "n=3(M殻)最大数", type: "short_answer", correctAnswer: "18", correctAnswerRate: 85 },
                { id: "q_c2_1_5_4", label: "n=4(N殻)最大数", type: "short_answer", correctAnswer: "32", correctAnswerRate: 85 },
                { id: "q_c2_1_5_ans", label: "何殻まで満たす必要があるか", type: "short_answer", correctAnswer: "N殻", correctAnswerRate: 85 }
              ],
              explanation: "▼ 解答・解説\nn=1: 2·1² = 2 個 (K殻)\nn=2: 2·2² = 8 個 (L殻)\nn=3: 2·3² = 18 個 (M殻)\nn=4: 2·4² = 32 個 (N殻)\n合計：2+8+18+32 = 60 個 → N殻まで全部満たすと 60 個。",
              surroundingKnowledge: [],
              deepDiveTopics: []
            },
            {
              id: "q_c2_1_6",
              category: "原子の構造と電子配置・元素の周期表 (問6)",
              text: "【問6】 （共通テスト風応用）下の周期表の位置から、A〜Fの元素の(1)価電子数、(2)単体が金属か非金属かを答えよ。\n\nA：第3周期1族  B：第2周期16族  C：第3周期17族  D：第4周期2族  E：第2周期14族  F：第3周期18族",
              subQuestions: [
                { id: "q_c2_1_6_a1", label: "A (1)価電子数", type: "short_answer", correctAnswer: "1", correctAnswerRate: 85 },
                { id: "q_c2_1_6_a2", label: "A (2)単体分類", type: "multiple_choice", options: ["金属", "非金属"], correctAnswer: "金属", correctAnswerRate: 85 },
                { id: "q_c2_1_6_b1", label: "B (1)価電子数", type: "short_answer", correctAnswer: "6", correctAnswerRate: 85 },
                { id: "q_c2_1_6_b2", label: "B (2)単体分類", type: "multiple_choice", options: ["金属", "非金属"], correctAnswer: "非金属", correctAnswerRate: 85 },
                { id: "q_c2_1_6_c1", label: "C (1)価電子数", type: "short_answer", correctAnswer: "7", correctAnswerRate: 85 },
                { id: "q_c2_1_6_c2", label: "C (2)単体分類", type: "multiple_choice", options: ["金属", "非金属"], correctAnswer: "非金属", correctAnswerRate: 85 },
                { id: "q_c2_1_6_d1", label: "D (1)価電子数", type: "short_answer", correctAnswer: "2", correctAnswerRate: 85 },
                { id: "q_c2_1_6_d2", label: "D (2)単体分類", type: "multiple_choice", options: ["金属", "非金属"], correctAnswer: "金属", correctAnswerRate: 85 },
                { id: "q_c2_1_6_e1", label: "E (1)価電子数", type: "short_answer", correctAnswer: "4", correctAnswerRate: 85 },
                { id: "q_c2_1_6_e2", label: "E (2)単体分類", type: "multiple_choice", options: ["金属", "非金属"], correctAnswer: "非金属", correctAnswerRate: 85 },
                { id: "q_c2_1_6_f1", label: "F (1)価電子数", type: "short_answer", correctAnswer: "0", correctAnswerRate: 85 },
                { id: "q_c2_1_6_f2", label: "F (2)単体分類", type: "multiple_choice", options: ["金属", "非金属"], correctAnswer: "非金属", correctAnswerRate: 85 }
              ],
              explanation: "▼ 解答・解説\nA(Na)：(1) 1 (2) 金属 (3) Li, K など（1族）\nB(O) ：(1) 6 (2) 非金属 (3) S, Se（16族）\nC(Cl)：(1) 7 (2) 非金属 (3) F, Br, I（17族）\nD(Ca)：(1) 2 (2) 金属 (3) Mg, Be, Sr（2族）\nE(C) ：(1) 4 (2) 非金属 (3) Si, Ge（14族）\nF(Ar)：(1) 0 (2) 非金属（貴ガス、単原子分子） (3) Ne, Kr（18族）",
              surroundingKnowledge: [],
              deepDiveTopics: []
            },
            {
              id: "q_c2_1_7",
              category: "原子の構造と電子配置・元素の周期表 (問7)",
              text: "【問7】 （共通テスト風応用）ある原子Xは、陽子数が中性子数の3/4倍であり、質量数が28である。次の問いに答えよ。\n\n(1) 陽子数と中性子数を求めよ。\n(2) この原子の元素記号を答えよ。\n(3) この原子の電子配置を答えよ（例：K2 L8 M2）。",
              subQuestions: [
                { id: "q_c2_1_7_1p", label: "(1) 陽子数", type: "short_answer", correctAnswer: "12", correctAnswerRate: 85 },
                { id: "q_c2_1_7_1n", label: "(1) 中性子数", type: "short_answer", correctAnswer: "16", correctAnswerRate: 85 },
                { id: "q_c2_1_7_2", label: "(2) 元素記号", type: "short_answer", correctAnswer: "Mg", correctAnswerRate: 85 },
                { id: "q_c2_1_7_3", label: "(3) 電子配置", type: "short_answer", correctAnswer: "K2 L8 M2", correctAnswerRate: 85 }
              ],
              explanation: "▼ 解答・解説\n(1) 陽子数を p, 中性子数を n とおくと、p = (3/4)n かつ p+n = 28.\n(3/4)n + n = 28 → (7/4)n = 28 → n = 16, p = 12.\n陽子数は12、中性子数は16となります。\n(2) 陽子数12なので、原子番号12のマグネシウム Mg です（※実在性より計算結果を優先。²⁸Mgは存在する放射性同位体であるため²⁸Mgとなります）。\n(3) 電子数＝陽子数＝12より、電子配置は K2 L8 M2 となります。",
              surroundingKnowledge: [],
              deepDiveTopics: []
            }
          ],
          miniTest: [
            {
              id: "q_c2_1_1",
              category: "原子の構造と電子配置・元素の周期表 (問1)",
              text: "【問1】 次の文章の空欄（ア）〜（ト）に適する語句・数値・記号を答えよ。（語句網羅）\n\n原子は中心にある（ア）と、そのまわりを運動する（イ）からなる。（ア）は（ウ）と（エ）から構成されている。原子の直径は約（オ）m、（ア）の直径はその約（カ）分の1である。（ウ）の数を（キ）といい、これは元素ごとに決まっている。（キ）と（エ）の数の和を（ク）という。（キ）が等しく（ク）が異なる原子どうしを互いに（ケ）（アイソトープ）という。電子は（コ）とよばれる空間に存在し、（ア）に近い方から K, L, M, N, …殻 と名づけられている。n 番目の電子殻に収容できる電子の最大数は（サ）個で表される。最も外側の電子殻にある電子を（シ）といい、化学的性質を主に決める電子を（ス）という。（ス）の数は典型元素で（セ）の一の位と一致するが、（ソ）（18族）では 0 とみなす。周期表で縦の列を（タ）、横の行を（チ）という。1族のうちH以外を（ツ）金属、2族をアルカリ土類金属、17族を（テ）、18族を（ト）という。",
              subQuestions: [
                { id: "q_c2_1_1_a", label: "（ア）", type: "short_answer", correctAnswer: "原子核", correctAnswerRate: 85 },
                { id: "q_c2_1_1_i", label: "（イ）", type: "short_answer", correctAnswer: "電子", correctAnswerRate: 85 },
                { id: "q_c2_1_1_u", label: "（ウ）", type: "short_answer", correctAnswer: "陽子", correctAnswerRate: 85 },
                { id: "q_c2_1_1_e", label: "（エ）", type: "short_answer", correctAnswer: "中性子", correctAnswerRate: 85 },
                { id: "q_c2_1_1_o", label: "（オ） ※10⁻¹⁰ と入力", type: "short_answer", correctAnswer: "10⁻¹⁰", correctAnswerRate: 85 },
                { id: "q_c2_1_1_ka", label: "（カ）", type: "short_answer", correctAnswer: "1万〜10万", correctAnswerRate: 85 },
                { id: "q_c2_1_1_ki", label: "（キ）", type: "short_answer", correctAnswer: "原子番号", correctAnswerRate: 85 },
                { id: "q_c2_1_1_ku", label: "（ク）", type: "short_answer", correctAnswer: "質量数", correctAnswerRate: 85 },
                { id: "q_c2_1_1_ke", label: "（ケ）", type: "short_answer", correctAnswer: "同位体", correctAnswerRate: 85 },
                { id: "q_c2_1_1_ko", label: "（コ）", type: "short_answer", correctAnswer: "電子殻", correctAnswerRate: 85 },
                { id: "q_c2_1_1_sa", label: "（サ） ※2n² と入力", type: "short_answer", correctAnswer: "2n²", correctAnswerRate: 85 },
                { id: "q_c2_1_1_shi", label: "（シ）", type: "short_answer", correctAnswer: "最外殻電子", correctAnswerRate: 85 },
                { id: "q_c2_1_1_su", label: "（ス）", type: "short_answer", correctAnswer: "価電子", correctAnswerRate: 85 },
                { id: "q_c2_1_1_se", label: "（セ）", type: "short_answer", correctAnswer: "族番号", correctAnswerRate: 85 },
                { id: "q_c2_1_1_so", label: "（ソ）", type: "short_answer", correctAnswer: "貴ガス", correctAnswerRate: 85 },
                { id: "q_c2_1_1_ta", label: "（タ）", type: "short_answer", correctAnswer: "族", correctAnswerRate: 85 },
                { id: "q_c2_1_1_chi", label: "（チ）", type: "short_answer", correctAnswer: "周期", correctAnswerRate: 85 },
                { id: "q_c2_1_1_tsu", label: "（ツ）", type: "short_answer", correctAnswer: "アルカリ", correctAnswerRate: 85 },
                { id: "q_c2_1_1_te", label: "（テ）", type: "short_answer", correctAnswer: "ハロゲン", correctAnswerRate: 85 },
                { id: "q_c2_1_1_to", label: "（ト）", type: "short_answer", correctAnswer: "貴ガス", correctAnswerRate: 85 }
              ],
              explanation: "▼ 解答・解説\n（ア）原子核 （イ）電子 （ウ）陽子 （エ）中性子 （オ）10⁻¹⁰ （カ）1万〜10万\n（キ）原子番号 （ク）質量数 （ケ）同位体 （コ）電子殻 （サ）2n²\n（シ）最外殻電子 （ス）価電子 （セ）族番号 （ソ）貴ガス （タ）族 （チ）周期\n（ツ）アルカリ （テ）ハロゲン （ト）貴ガス（希ガスも正答ですが、本設問は共通呼称の「貴ガス」を基本にしています）",
              surroundingKnowledge: [],
              deepDiveTopics: []
            },
            {
              id: "q_c2_1_2",
              category: "原子の構造と電子配置・元素の周期表 (問2)",
              text: "【問2】 （基礎）次の原子について、(a)陽子数、(b)中性子数、(c)電子数、(d)質量数 を答えよ（中性原子とする）。\n\n(1) ¹H  (2) ¹²C  (3) ¹⁶O  (4) ²³Na  (5) ³⁵Cl  (6) ⁴⁰Ar",
              subQuestions: [
                { id: "q_c2_1_2_1a", label: "(1) ¹H (a)陽子数", type: "short_answer", correctAnswer: "1", correctAnswerRate: 85 },
                { id: "q_c2_1_2_1b", label: "(1) ¹H (b)中性子数", type: "short_answer", correctAnswer: "0", correctAnswerRate: 85 },
                { id: "q_c2_1_2_1c", label: "(1) ¹H (c)電子数", type: "short_answer", correctAnswer: "1", correctAnswerRate: 85 },
                { id: "q_c2_1_2_1d", label: "(1) ¹H (d)質量数", type: "short_answer", correctAnswer: "1", correctAnswerRate: 85 },
                { id: "q_c2_1_2_2a", label: "(2) ¹²C (a)陽子数", type: "short_answer", correctAnswer: "6", correctAnswerRate: 85 },
                { id: "q_c2_1_2_2b", label: "(2) ¹²C (b)中性子数", type: "short_answer", correctAnswer: "6", correctAnswerRate: 85 },
                { id: "q_c2_1_2_2c", label: "(2) ¹²C (c)電子数", type: "short_answer", correctAnswer: "6", correctAnswerRate: 85 },
                { id: "q_c2_1_2_2d", label: "(2) ¹²C (d)質量数", type: "short_answer", correctAnswer: "12", correctAnswerRate: 85 },
                { id: "q_c2_1_2_3a", label: "(3) ¹⁶O (a)陽子数", type: "short_answer", correctAnswer: "8", correctAnswerRate: 85 },
                { id: "q_c2_1_2_3b", label: "(3) ¹⁶O (b)中性子数", type: "short_answer", correctAnswer: "8", correctAnswerRate: 85 },
                { id: "q_c2_1_2_3c", label: "(3) ¹⁶O (c)電子数", type: "short_answer", correctAnswer: "8", correctAnswerRate: 85 },
                { id: "q_c2_1_2_3d", label: "(3) ¹⁶O (d)質量数", type: "short_answer", correctAnswer: "16", correctAnswerRate: 85 },
                { id: "q_c2_1_2_4a", label: "(4) ²³Na (a)陽子数", type: "short_answer", correctAnswer: "11", correctAnswerRate: 85 },
                { id: "q_c2_1_2_4b", label: "(4) ²³Na (b)中性子数", type: "short_answer", correctAnswer: "12", correctAnswerRate: 85 },
                { id: "q_c2_1_2_4c", label: "(4) ²³Na (c)電子数", type: "short_answer", correctAnswer: "11", correctAnswerRate: 85 },
                { id: "q_c2_1_2_4d", label: "(4) ²³Na (d)質量数", type: "short_answer", correctAnswer: "23", correctAnswerRate: 85 },
                { id: "q_c2_1_2_5a", label: "(5) ³⁵Cl (a)陽子数", type: "short_answer", correctAnswer: "17", correctAnswerRate: 85 },
                { id: "q_c2_1_2_5b", label: "(5) ³⁵Cl (b)中性子数", type: "short_answer", correctAnswer: "18", correctAnswerRate: 85 },
                { id: "q_c2_1_2_5c", label: "(5) ³⁵Cl (c)電子数", type: "short_answer", correctAnswer: "17", correctAnswerRate: 85 },
                { id: "q_c2_1_2_5d", label: "(5) ³⁵Cl (d)質量数", type: "short_answer", correctAnswer: "35", correctAnswerRate: 85 },
                { id: "q_c2_1_2_6a", label: "(6) ⁴⁰Ar (a)陽子数", type: "short_answer", correctAnswer: "18", correctAnswerRate: 85 },
                { id: "q_c2_1_2_6b", label: "(6) ⁴⁰Ar (b)中性子数", type: "short_answer", correctAnswer: "22", correctAnswerRate: 85 },
                { id: "q_c2_1_2_6c", label: "(6) ⁴⁰Ar (c)電子数", type: "short_answer", correctAnswer: "18", correctAnswerRate: 85 },
                { id: "q_c2_1_2_6d", label: "(6) ⁴⁰Ar (d)質量数", type: "short_answer", correctAnswer: "40", correctAnswerRate: 85 }
              ],
              explanation: "▼ 解答・解説\n(1) ¹H ：(a)1 (b)0 (c)1 (d)1\n(2) ¹²C：(a)6 (b)6 (c)6 (d)12\n(3) ¹⁶O：(a)8 (b)8 (c)8 (d)16\n(4) ²³Na：(a)11 (b)12 (c)11 (d)23\n(5) ³⁵Cl：(a)17 (b)18 (c)17 (d)35\n(6) ⁴⁰Ar：(a)18 (b)22 (c)18 (d)40\n\n■ 中性子数 = 質量数 − 陽子数。 中性原子なら 電子数 = 陽子数。",
              surroundingKnowledge: [],
              deepDiveTopics: []
            },
            {
              id: "q_c2_1_3",
              category: "原子の構造と電子配置・元素の周期表 (問3)",
              text: "【問3】 （基礎）次の原子の電子配置を K, L, M, N 殻の電子数で表せ（例：Na → K2 L8 M1）。\n\n(1) He  (2) C  (3) O  (4) F  (5) Ne  (6) Mg  (7) Cl  (8) K  (9) Ca",
              subQuestions: [
                { id: "q_c2_1_3_1", label: "(1) He", type: "short_answer", correctAnswer: "K2", correctAnswerRate: 85 },
                { id: "q_c2_1_3_2", label: "(2) C", type: "short_answer", correctAnswer: "K2 L4", correctAnswerRate: 85 },
                { id: "q_c2_1_3_3", label: "(3) O", type: "short_answer", correctAnswer: "K2 L6", correctAnswerRate: 85 },
                { id: "q_c2_1_3_4", label: "(4) F", type: "short_answer", correctAnswer: "K2 L7", correctAnswerRate: 85 },
                { id: "q_c2_1_3_5", label: "(5) Ne", type: "short_answer", correctAnswer: "K2 L8", correctAnswerRate: 85 },
                { id: "q_c2_1_3_6", label: "(6) Mg", type: "short_answer", correctAnswer: "K2 L8 M2", correctAnswerRate: 85 },
                { id: "q_c2_1_3_7", label: "(7) Cl", type: "short_answer", correctAnswer: "K2 L8 M7", correctAnswerRate: 85 },
                { id: "q_c2_1_3_8", label: "(8) K", type: "short_answer", correctAnswer: "K2 L8 M8 N1", correctAnswerRate: 85 },
                { id: "q_c2_1_3_9", label: "(9) Ca", type: "short_answer", correctAnswer: "K2 L8 M8 N2", correctAnswerRate: 85 }
              ],
              explanation: "▼ 解答・解説\n(1) He：K2\n(2) C：K2 L4\n(3) O：K2 L6\n(4) F：K2 L7\n(5) Ne：K2 L8\n(6) Mg：K2 L8 M2\n(7) Cl：K2 L8 M7\n(8) K：K2 L8 M8 N1\n(9) Ca：K2 L8 M8 N2\n\n■ K殻最大2, L殻最大8, M殻最大18個。KとLが詰まったら次はM。\nただしM殻は8個までで一旦止まりN殻に入る（K, Ca で M=8 のまま N に1, 2 個入る点に注意）。",
              surroundingKnowledge: [],
              deepDiveTopics: []
            },
            {
              id: "q_c2_1_4",
              category: "原子の構造と電子配置・元素の周期表 (問4)",
              text: "【問4】 （標準）次の問いに答えよ。\n\n(1) 価電子の数が等しい元素は周期表でどの位置関係にあるか。\n(2) 第3周期で価電子数が 0 の元素を答えよ。\n(3) ¹²C と ¹³C, ¹⁴C の関係を何というか。化学的性質はどうなるか述べよ。\n(4) 典型元素と遷移元素の違いを、価電子数の変化に着目して説明せよ。",
              subQuestions: [
                { id: "q_c2_1_4_1", label: "(1) 位置関係", type: "short_answer", correctAnswer: "同じ族", correctAnswerRate: 85 },
                { id: "q_c2_1_4_2", label: "(2) 元素名称（カタカナ）", type: "short_answer", correctAnswer: "アルゴン", correctAnswerRate: 85 },
                { id: "q_c2_1_4_3a", label: "(3) 関係名", type: "short_answer", correctAnswer: "同位体", correctAnswerRate: 85 },
                { id: "q_c2_1_4_3b", label: "(3) 化学的性質", type: "short_answer", correctAnswer: "ほぼ同じ", correctAnswerRate: 85 },
                { id: "q_c2_1_4_4", label: "(4) 価電子数に着目した説明", type: "descriptive", correctAnswer: "典型元素は族番号によって価電子数が規則的に変化（1族→1, 2族→2...）するのに対し、遷移元素は原子番号が変わっても価電子数がほぼ1または2で同じである。", correctAnswerRate: 85 }
              ],
              explanation: "▼ 解答・解説\n(1) 同じ族（同じ縦の列）にある。\n(2) アルゴン Ar（貴ガス、価電子数 0）。\n(3) 互いに同位体（アイソトープ）の関係。陽子数は同じで中性子数が異なる。電子配置が同じため化学的性質はほぼ同じ（質量に依存する物理的性質はわずかに異なる）。\n(4) 典型元素は族番号によって価電子数が規則的に変化する（1族→1, 2族→2, 13族→3, …, 17族→7, 18族→0）。\n遷移元素（3〜12族）は原子番号が変わっても価電子数がほぼ 1 or 2 で同じ（内殻に入るため）。隣接元素どうしの性質が似る。",
              surroundingKnowledge: [],
              deepDiveTopics: []
            },
            {
              id: "q_c2_1_5",
              category: "原子の構造と電子配置・元素の周期表 (問5)",
              text: "【問5】 （文字式・文章題）電子殻 n=1, 2, 3, 4 にそれぞれ収容できる電子の最大数を文字式 2n² で計算し、合計が 60 個になるためには何殻まで満たす必要があるかを示せ。",
              subQuestions: [
                { id: "q_c2_1_5_1", label: "n=1(K殻)最大数", type: "short_answer", correctAnswer: "2", correctAnswerRate: 85 },
                { id: "q_c2_1_5_2", label: "n=2(L殻)最大数", type: "short_answer", correctAnswer: "8", correctAnswerRate: 85 },
                { id: "q_c2_1_5_3", label: "n=3(M殻)最大数", type: "short_answer", correctAnswer: "18", correctAnswerRate: 85 },
                { id: "q_c2_1_5_4", label: "n=4(N殻)最大数", type: "short_answer", correctAnswer: "32", correctAnswerRate: 85 },
                { id: "q_c2_1_5_ans", label: "何殻まで満たす必要があるか", type: "short_answer", correctAnswer: "N殻", correctAnswerRate: 85 }
              ],
              explanation: "▼ 解答・解説\nn=1: 2·1² = 2 個 (K殻)\nn=2: 2·2² = 8 個 (L殻)\nn=3: 2·3² = 18 個 (M殻)\nn=4: 2·4² = 32 個 (N殻)\n合計：2+8+18+32 = 60 個 → N殻まで全部満たすと 60 個。",
              surroundingKnowledge: [],
              deepDiveTopics: []
            },
            {
              id: "q_c2_1_6",
              category: "原子の構造と電子配置・元素の周期表 (問6)",
              text: "【問6】 （共通テスト風応用）下の周期表の位置から、A〜Fの元素の(1)価電子数、(2)単体が金属か非金属かを答えよ。\n\nA：第3周期1族  B：第2周期16族  C：第3周期17族  D：第4周期2族  E：第2周期14族  F：第3周期18族",
              subQuestions: [
                { id: "q_c2_1_6_a1", label: "A (1)価電子数", type: "short_answer", correctAnswer: "1", correctAnswerRate: 85 },
                { id: "q_c2_1_6_a2", label: "A (2)単体分類", type: "multiple_choice", options: ["金属", "非金属"], correctAnswer: "金属", correctAnswerRate: 85 },
                { id: "q_c2_1_6_b1", label: "B (1)価電子数", type: "short_answer", correctAnswer: "6", correctAnswerRate: 85 },
                { id: "q_c2_1_6_b2", label: "B (2)単体分類", type: "multiple_choice", options: ["金属", "非金属"], correctAnswer: "非金属", correctAnswerRate: 85 },
                { id: "q_c2_1_6_c1", label: "C (1)価電子数", type: "short_answer", correctAnswer: "7", correctAnswerRate: 85 },
                { id: "q_c2_1_6_c2", label: "C (2)単体分類", type: "multiple_choice", options: ["金属", "非金属"], correctAnswer: "非金属", correctAnswerRate: 85 },
                { id: "q_c2_1_6_d1", label: "D (1)価電子数", type: "short_answer", correctAnswer: "2", correctAnswerRate: 85 },
                { id: "q_c2_1_6_d2", label: "D (2)単体分類", type: "multiple_choice", options: ["金属", "非金属"], correctAnswer: "金属", correctAnswerRate: 85 },
                { id: "q_c2_1_6_e1", label: "E (1)価電子数", type: "short_answer", correctAnswer: "4", correctAnswerRate: 85 },
                { id: "q_c2_1_6_e2", label: "E (2)単体分類", type: "multiple_choice", options: ["金属", "非金属"], correctAnswer: "非金属", correctAnswerRate: 85 },
                { id: "q_c2_1_6_f1", label: "F (1)価電子数", type: "short_answer", correctAnswer: "0", correctAnswerRate: 85 },
                { id: "q_c2_1_6_f2", label: "F (2)単体分類", type: "multiple_choice", options: ["金属", "非金属"], correctAnswer: "非金属", correctAnswerRate: 85 }
              ],
              explanation: "▼ 解答・解説\nA(Na)：(1) 1 (2) 金属 (3) Li, K など（1族）\nB(O) ：(1) 6 (2) 非金属 (3) S, Se（16族）\nC(Cl)：(1) 7 (2) 非金属 (3) F, Br, I（17族）\nD(Ca)：(1) 2 (2) 金属 (3) Mg, Be, Sr（2族）\nE(C) ：(1) 4 (2) 非金属 (3) Si, Ge（14族）\nF(Ar)：(1) 0 (2) 非金属（貴ガス、単原子分子） (3) Ne, Kr（18族）",
              surroundingKnowledge: [],
              deepDiveTopics: []
            },
            {
              id: "q_c2_1_7",
              category: "原子の構造と電子配置・元素の周期表 (問7)",
              text: "【問7】 （共通テスト風応用）ある原子Xは、陽子数が中性子数の3/4倍であり、質量数が28である。次の問いに答えよ。\n\n(1) 陽子数と中性子数を求めよ。\n(2) この原子の元素記号を答えよ。\n(3) この原子の電子配置を答えよ（例：K2 L8 M2）。",
              subQuestions: [
                { id: "q_c2_1_7_1p", label: "(1) 陽子数", type: "short_answer", correctAnswer: "12", correctAnswerRate: 85 },
                { id: "q_c2_1_7_1n", label: "(1) 中性子数", type: "short_answer", correctAnswer: "16", correctAnswerRate: 85 },
                { id: "q_c2_1_7_2", label: "(2) 元素記号", type: "short_answer", correctAnswer: "Mg", correctAnswerRate: 85 },
                { id: "q_c2_1_7_3", label: "(3) 電子配置", type: "short_answer", correctAnswer: "K2 L8 M2", correctAnswerRate: 85 }
              ],
              explanation: "▼ 解答・解説\n(1) 陽子数を p, 中性子数を n とおくと、p = (3/4)n かつ p+n = 28.\n(3/4)n + n = 28 → (7/4)n = 28 → n = 16, p = 12.\n陽子数は12、中性子数は16となります。\n(2) 陽子数12なので、原子番号12のマグネシウム Mg です（※実在性より計算結果を優先。²⁸Mgは存在する放射性同位体であるため²⁸Mgとなります）。\n(3) 電子数＝陽子数＝12より、電子配置は K2 L8 M2 となります。",
              surroundingKnowledge: [],
              deepDiveTopics: []
            }
          ]
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
          explanation: '<u>2種類以上の純物質</u>が混じり合ったもの。<u>一つの化学式で書くことができません</u>。（例：空気、海水、石油、塩酸、食塩水）\n\n【補足】\n・空気の割合：1位 窒素、2位 酸素、3位 アルゴン、4位 二酸化炭素\n・海水の割合：1位 水、2位 塩化ナトリウム、3位 塩化マグネシウム、4位 硫酸マグネシウム',
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
          explanation: '混じっている物質の種類やその割合により、融点や沸点などの値が<u>変化</u>します。\n例）水とエタノールの混合物を加熱すると、沸騰している間も温度が上昇し続けます。\n\n【補足】\n・化学的方法：電気分解などにより単体に分解する方法\n・物理的方法：ろ過、蒸留、再結晶などにより純物質に分類（分離）する方法',
          relatedQuestions: [
            { id: 'p1_ka', label: '演習問題⓵－１(カ)' },
            { id: 'p1_ko', label: '演習問題⓵－１(コ)' },
            { id: 'p1_sa', label: '演習問題⓵－１(サ)' }
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
          explanation: '<u>物質の構成成分</u> ＝ 直接的に触ることができないもの。物質を構成する<u>「種類」</u>や<u>「成分」</u>を指します。\n\n【補足】\n・液体の元素：臭素(Br)、水銀(Hg)',
          relatedQuestions: [
            { id: 'q3_2', label: '演習問題⓵－３(2)' },
            { id: 'q3_4', label: '演習問題⓵－３(4)' },
            { id: 'q3_6', label: '演習問題⓵－３(6)' },
            { id: 'p3_2', label: '類題⓵－３(2)' },
            { id: 'p3_3', label: '類題⓵－３(3)' },
            { id: 'p3_6', label: '類題⓵－３(6)' },
            { id: 'p3_7', label: '類題⓵－３(7)' }
          ]
        }
      ]
    }
  ]
};

export const separationTreeData: NodeData = {
  id: 'separation_root',
  label: '物質の分離と精製',
  step: null,
  explanation: '混合物から不純物を除き、目的の純物質を取り出す操作を分離、分離した物質の純度をより高める操作を精製といいます。\n物理的な性質（沸点、溶解度、吸着力など）の違いを利用します。',
  children: [
    {
      id: 'step1_group_sep',
      isGroup: true,
      label: '【Step1】固体と液体の分離',
      step: 1,
      children: [
        {
          id: 'filter',
          label: 'ろ過',
          step: 1,
          subLabel: 'ろ紙で固体を分離',
          explanation: '固体と液体の混合物から、ろ紙などを用いて固体を分離する操作。通過した液体を「ろ液」と呼ぶ。\n\n【注意点】\n・ガラス棒に伝わらせて注ぐ\n・ろうとの足を内壁につける\n・ガラス棒をろ紙につける\n\n例：砂を含む水溶液から砂を分離する。',
          relatedQuestions: [{ id: 'q2_1', label: '演習問題①-2(ろ過)' }],
        }
      ]
    },
    {
      id: 'step2_group_sep',
      isGroup: true,
      label: '【Step2】沸点の違いを利用',
      step: 2,
      children: [
        {
          id: 'distillation',
          label: '蒸留',
          step: 2,
          subLabel: '蒸気を冷却して分離',
          explanation: '液体の混合物を加熱して沸騰させ、その蒸気を冷却して沸点の低い成分を分離する。\n\n【注意点】\n・沸騰石を入れる（突沸防止）\n・液量は半分以下\n・温度計の球部は枝の付け根\n・冷却水は下から上へ\n・三角フラスコを密閉しない\n\n例：NaCl水溶液から水を分離。',
          relatedQuestions: [{ id: 'q2_2', label: '演習問題①-2(蒸留)' }],
        },
        {
          id: 'fractional',
          label: '分留',
          step: 2,
          subLabel: '沸点差で液体を分離',
          explanation: '沸点の異なる2種類以上の液体混合物を加熱し、異なる温度で蒸留して分離する。\n\n例：液体空気の分離、石油（原油）の分留。\n\n【原油の分留順】沸点低 : 石油ガス→ナフサ→灯油→軽油→重油→残留 : 沸点高',
          relatedQuestions: [{ id: 'q2_3', label: '演習問題①-2(分留)' }],
        }
      ]
    },
    {
      id: 'step3_group_sep',
      isGroup: true,
      label: '【Step3】特殊な性質を利用',
      step: 3,
      children: [
        {
          id: 'sublimation',
          label: '昇華法',
          step: 3,
          subLabel: '固体→気体の性質を利用',
          explanation: '昇華しやすい固体を含む混合物を加熱し、生じた気体を冷却して分離する。\n\n【重要物質】ドライアイス、ヨウ素、ナフタレン\n例：砂とヨウ素の混合物からヨウ素を分離する。',
          relatedQuestions: [{ id: 'q2_4', label: '演習問題①-2(昇華)' }],
        },
        {
          id: 'recrystallization',
          label: '再結晶',
          step: 3,
          subLabel: '温度による溶解度差を利用',
          explanation: '少量の不純物を含む固体を熱水に溶かし、冷却して目的の純粋な固体を得る操作。\n\n例：硝酸カリウムと少量の硫酸銅(II)五水和物の混合物から硝酸カリウムを分離する。',
          relatedQuestions: [{ id: 'q2_5', label: '演習問題①-2(再結)' }],
        },
        {
          id: 'extraction',
          label: '抽出',
          step: 3,
          subLabel: '特定の溶媒への溶けやすさ',
          explanation: '混合物に適切な溶媒を加えて、目的物質だけを溶かし出して分離する操作。\n\n例：ヨウ素とヨウ化カリウム水溶液からヨウ素を分離、茶葉から成分を溶かし出す。',
          relatedQuestions: [{ id: 'q2_6', label: '演習問題①-2(抽出)' }],
        },
        {
          id: 'chromatography',
          label: 'クロマトグラフィー',
          step: 3,
          subLabel: '吸着力の違いを利用',
          explanation: '物質の吸着力の違いを利用して分離する。ろ紙を用いる場合はペーパークロマトグラフィーと呼ぶ。\n\n【種類】カラムクロマトグラフィー、ガスクロマトグラフィー\n例：水性インクの色素分離。',
          relatedQuestions: [{ id: 'q2_7', label: '演習問題①-2(クロマト)' }],
        }
      ]
    }
  ]
};

export const thermalMotionTreeData: NodeData = {
  id: 'thermal_motion_root',
  label: '粒子の熱運動と物質の三態',
  step: null,
  explanation: 'すべての物質は粒子からできており、その粒子は熱運動と呼ばれる不規則な運動をしています。温度と状態変化の関係を整理しましょう。',
  children: [
    {
      id: 'step1_group_tm',
      isGroup: true,
      label: '【Step1】熱運動と温度',
      step: 1,
      children: [
        {
          id: 'thermal_motion',
          label: '熱運動',
          step: 1,
          subLabel: '粒子の不規則な運動',
          explanation: 'すべての粒子が同じ速さではなく、高温になるほど速さの平均値が大きくなる。',
          relatedQuestions: [{ id: 'q_c1_3_1_a', label: '演習問題①-3(熱運動)' }],
        },
        {
          id: 'diffusion',
          label: '気体の拡散',
          step: 1,
          subLabel: '粒子が自然に散らばる',
          explanation: '窒素と臭素の容器を繋ぐと均一に混ざる現象などが例。熱運動によって引き起こされる。',
          relatedQuestions: [],
        },
        {
          id: 'absolute_temp',
          label: '絶対温度（K）',
          step: 1,
          subLabel: 'セルシウス温度+273',
          explanation: '公式：T(K) = 273 + t(℃)\nすべての粒子が熱運動をしなくなる温度を「絶対零度（0K / -273℃）」と定義する。',
          relatedQuestions: [{ id: 'q_c1_3_2_1', label: '演習問題①-3(絶対温度)' }],
        }
      ]
    },
    {
      id: 'step2_group_tm',
      isGroup: true,
      label: '【Step2】物質の三態',
      step: 2,
      children: [
        {
          id: 'solid',
          label: '固体',
          step: 2,
          subLabel: '粒子が一定位置で振動',
          explanation: '粒子間の距離が小さく、引力が強く働く。形・体積ともにほぼ一定。',
          relatedQuestions: [],
        },
        {
          id: 'liquid',
          label: '液体',
          step: 2,
          subLabel: '粒子が自由に動き回る',
          explanation: '粒子間の距離は小さいが、引力を振り切って移動できる。形は自由に変わるが、体積はほぼ一定。',
          relatedQuestions: [],
        },
        {
          id: 'gas',
          label: '気体',
          step: 2,
          subLabel: '粒子が激しく飛び回る',
          explanation: '粒子間の距離が大きく、引力はほとんど働かない。形も体積も自由（温度や圧力で変化）。',
          relatedQuestions: [],
        }
      ]
    },
    {
      id: 'step3_group_tm',
      isGroup: true,
      label: '【Step3】状態変化',
      step: 3,
      children: [
        {
          id: 'state_change_names',
          label: '状態変化の名称',
          step: 3,
          subLabel: '融解・蒸発・凝縮など',
          explanation: '・固体→液体: 融解 (融点)\n・液体→気体: 蒸発・沸騰 (沸点)\n・気体→液体: 凝縮\n・液体→固体: 凝固\n・固体⇔気体: 昇華・凝華',
          relatedQuestions: [{ id: 'q_c1_3_3_a', label: '演習問題①-3(状態変化)' }],
        },
        {
          id: 'phys_chem_change',
          label: '物理変化と化学変化',
          step: 3,
          subLabel: '状態のみ or 物質そのもの',
          explanation: '状態変化は「物理変化」に分類される。原子の組み合わせが変わる場合は「化学変化」。',
          relatedQuestions: [{ id: 'q_c1_3_4_ans', label: '演習問題①-3(物理変化・化学変化)' }],
        },
        {
          id: 'heating_curve',
          label: '加熱中の温度一定',
          step: 3,
          subLabel: '状態変化中は温度が一定',
          explanation: '全ての物質の状態変化が終わるまで、加えられた熱エネルギーが状態変化に使われるため、温度（融点・沸点）は上昇しない。',
          relatedQuestions: [{ id: 'q_c1_3_7_ans', label: '演習問題①-3(三態モデルとエネルギー)' }],
        }
      ]
    }
  ]
};

export const atomicStructureTreeData: NodeData = {
  id: 'atomic_structure_root',
  label: '原子の構造・電子配置・周期表',
  step: null,
  explanation: '原子は極めて小さく、複雑な構造や規則的な性質を持っています。まずは原子の基本構成から順に整理しましょう。',
  children: [
    {
      id: 'step1_group_atom',
      isGroup: true,
      label: '【Step1：原子の構造】',
      step: 1,
      children: [
        {
          id: 'nucleus',
          label: '原子核',
          step: 1,
          subLabel: '陽子と中性子からなる',
          explanation: '原子の中心にある。原子の質量はほぼ原子核の質量で決まる（陽子 : 中性子 : 電子 ＝ 1 : 1 : 1/1840）。',
          relatedQuestions: [
            { id: 'q_c2_1_1_a', label: '問1(ア) 原子核' }
          ]
        },
        {
          id: 'proton',
          label: '陽子',
          step: 1,
          subLabel: '正の電荷を持つ粒子',
          explanation: '正 of 電荷を持ち、その数が元素固有の「原子番号」となります（陽子の数 ＝ 原子番号）。中性状態の原子では「陽子数 ＝ 電子数」で電気的に中性です。',
          relatedQuestions: [
            { id: 'q_c2_1_1_u', label: '問1(ウ) 陽子' },
            { id: 'q_c2_1_2_1a', label: '問2(1)(a) Hの陽子数' },
            { id: 'q_c2_1_2_2a', label: '問2(2)(a) Cの陽子数' },
            { id: 'q_c2_1_2_3a', label: '問2(3)(a) Oの陽子数' },
            { id: 'q_c2_1_2_4a', label: '問2(4)(a) Naの陽子数' },
            { id: 'q_c2_1_2_5a', label: '問2(5)(a) Clの陽子数' },
            { id: 'q_c2_1_2_6a', label: '問2(6)(a) Arの陽子数' },
            { id: 'q_c2_1_7_1p', label: '問7(1p) 陽子数計算' }
          ]
        },
        {
          id: 'neutron',
          label: '中性子',
          step: 1,
          subLabel: '電荷を持たない粒子',
          explanation: '荷電を持たない粒子。陽子とほぼ等しい質量を持つ。質量数 ＝ 陽子の数 ＋ 中性子の数。',
          relatedQuestions: [
            { id: 'q_c2_1_1_e', label: '問1(エ) 中性子' },
            { id: 'q_c2_1_2_1b', label: '問2(1)(b) Hの中性子数' },
            { id: 'q_c2_1_2_2b', label: '問2(2)(b) Cの中性子数' },
            { id: 'q_c2_1_2_3b', label: '問2(3)(b) Oの中性子数' },
            { id: 'q_c2_1_2_4b', label: '問2(4)(b) Naの中性子数' },
            { id: 'q_c2_1_2_5b', label: '問2(5)(b) Clの中性子数' },
            { id: 'q_c2_1_2_6b', label: '問2(6)(b) Arの中性子数' },
            { id: 'q_c2_1_7_1n', label: '問7(1n) 中性子数計算' }
          ]
        },
        {
          id: 'electron',
          label: '電子',
          step: 1,
          subLabel: '負の電荷を持つ極小粒子',
          explanation: '負の電荷を持つ。極めて軽く（陽子の1/1840の質量）、原子核のまわりに存在。原子の直径は約10⁻¹⁰m、原子核はその約1万～10万分の1のサイズ。',
          relatedQuestions: [
            { id: 'q_c2_1_1_i', label: '問1(イ) 電子' },
            { id: 'q_c2_1_1_o', label: '問1(オ) 直径10⁻¹⁰m' },
            { id: 'q_c2_1_1_ka', label: '問1(カ) サイズ比率' },
            { id: 'q_c2_1_2_1c', label: '問2(1)(c) Hの電子数' },
            { id: 'q_c2_1_2_2c', label: '問2(2)(c) Cの電子数' },
            { id: 'q_c2_1_2_3c', label: '問2(3)(c) Oの電子数' },
            { id: 'q_c2_1_2_4c', label: '問2(4)(c) Naの電子数' },
            { id: 'q_c2_1_2_5c', label: '問2(5)(c) Clの電子数' },
            { id: 'q_c2_1_2_6c', label: '問2(6)(c) Arの電子数' }
          ]
        }
      ]
    },
    {
      id: 'step2_group_atom',
      isGroup: true,
      label: '【Step2：原子の表示と種類】',
      step: 2,
      children: [
        {
          id: 'num_mass',
          label: '原子番号と質量数',
          step: 2,
          subLabel: '原子を特定・表示する数値',
          explanation: '・原子番号 ＝ 陽子の数（＝原子中の電子の数）\n・質量数 ＝ 陽子の数 ＋ 中性子の数。\n\n元素記号の左上に質量数、左下に原子番号を書き表す。',
          relatedQuestions: [
            { id: 'q_c2_1_1_ki', label: '問1(キ) 原子番号' },
            { id: 'q_c2_1_1_ku', label: '問1(ク) 質量数' },
            { id: 'q_c2_1_2_1d', label: '問2(1)(d) Hの質量数' },
            { id: 'q_c2_1_2_2d', label: '問2(2)(d) Cの質量数' },
            { id: 'q_c2_1_2_3d', label: '問2(3)(d) Oの質量数' },
            { id: 'q_c2_1_2_4d', label: '問2(4)(d) Naの質量数' },
            { id: 'q_c2_1_2_5d', label: '問2(5)(d) Clの質量数' },
            { id: 'q_c2_1_2_6d', label: '問2(6)(d) Arの質量数' },
            { id: 'q_c2_1_7_2', label: '問7(2) 元素記号特定' }
          ]
        },
        {
          id: 'isotope',
          label: '同位体 (アイソトープ)',
          step: 2,
          subLabel: '中性子の数が異なる同じ元素',
          explanation: '原子番号（陽子数）が等しく、質量数（中性子数）が異なる原子同士のこと。電子配置が同じため、化学的性質はほぼ等しい。\n\n【放射性同位体（ラジオアイソトープ）】 原子核が不安定で自発的に放射線を出して壊変するもの。\n【半減期】 放射性同位体の原子数が崩壊により元の半分になるまでの時間。\n\n【応用例：¹⁴C から古代木材の伐採年代の推定】 半減期が5730年であり、崩壊減少率から約11460年前（半減期の2倍経過）と推算できる。',
          relatedQuestions: [
            { id: 'q_c2_1_1_ke', label: '問1(ケ) 同位体' },
            { id: 'q_c2_1_4_3a', label: '問4(3) 同位体の定義' },
            { id: 'q_c2_1_4_3b', label: '問4(3) 化学的性質' }
          ]
        }
      ]
    },
    {
      id: 'step3_group_atom',
      isGroup: true,
      label: '【Step3：電子配置と価電子】',
      step: 3,
      children: [
        {
          id: 'shells',
          label: '電子殻と電子配置',
          step: 3,
          subLabel: 'K殻, L殻, M殻, N殻...',
          explanation: '電子が入る軌道（層）は「電子殻」と呼ばれる。内側からK殻、L殻、M殻、N殻…と順に入る。n番目の殻が収容できる最大電子数は 2n² 個。\n（K: 2個, L: 8個, M: 18個, N: 32個）\n\n★19番(K)・20番(Ca)の特例：M殻は最大18個まで入れるが、一度 8個（閉殻的な性質・安定状態）になると次に電子はN殻に入る（K: K2 L8 M8 N1 / Ca: K2 L8 M8 N2）。',
          relatedQuestions: [
            { id: 'q_c2_1_1_ko', label: '問1(コ) 電子殻' },
            { id: 'q_c2_1_1_sa', label: '問1(サ) 2n²' },
            { id: 'q_c2_1_3_1', label: '問3(1) Heの電子配置' },
            { id: 'q_c2_1_3_2', label: '問3(2) Cの電子配置' },
            { id: 'q_c2_1_3_3', label: '問3(3) Oの電子配置' },
            { id: 'q_c2_1_3_4', label: '問3(4) Fの電子配置' },
            { id: 'q_c2_1_3_5', label: '問3(5) Neの電子配置' },
            { id: 'q_c2_1_3_6', label: '問3(6) Mgの電子配置' },
            { id: 'q_c2_1_3_7', label: '問3(7) Clの電子配置' },
            { id: 'q_c2_1_3_8', label: '問3(8) Kの電子配置' },
            { id: 'q_c2_1_3_9', label: '問3(9) Caの電子配置' },
            { id: 'q_c2_1_5_1', label: '問5(1) K殻最大数' },
            { id: 'q_c2_1_5_2', label: '問5(2) L殻最大数' },
            { id: 'q_c2_1_5_3', label: '問5(3) M殻最大数' },
            { id: 'q_c2_1_5_4', label: '問5(4) N殻最大数' },
            { id: 'q_c2_1_5_ans', label: '問5(ans) 合計60個殻' },
            { id: 'q_c2_1_7_3', label: '問7(3) Mgの電子配置' }
          ]
        },
        {
          id: 'valence',
          label: '最外殻電子・価電子',
          step: 3,
          subLabel: '化学的性質を支配する電子',
          explanation: '・最外殻電子：最も外側の殻にある電子の数。\n・価電子：結合など化学的性質を支配する電子。\n\n★18族（貴ガス）は、ヘリウムで最外殻電子2個（その他は8個）ですが、非常に安定なため「価電子数は 0」とみなします。それ以外の元素では「最外殻電子数＝価電子数」となります。',
          relatedQuestions: [
            { id: 'q_c2_1_1_shi', label: '問1(シ) 最外殻電子' },
            { id: 'q_c2_1_1_su', label: '問1(ス) 価電子' },
            { id: 'q_c2_1_1_se', label: '問1(セ) 族番号' },
            { id: 'q_c2_1_1_so', label: '問1(ソ) 貴ガスの定義' },
            { id: 'q_c2_1_4_1', label: '問4(1) 価電子数と族の関係' },
            { id: 'q_c2_1_6_a1', label: '問6(A1) 価電子数' },
            { id: 'q_c2_1_6_b1', label: '問6(B1) 価電子数' },
            { id: 'q_c2_1_6_c1', label: '問6(C1) 価電子数' },
            { id: 'q_c2_1_6_d1', label: '問6(D1) 価電子数' },
            { id: 'q_c2_1_6_e1', label: '問6(E1) 価電子数' },
            { id: 'q_c2_1_6_f1', label: '問6(F1) 価電子数' }
          ]
        }
      ]
    },
    {
      id: 'step4_group_atom',
      isGroup: true,
      label: '【Step4：元素の周期表】',
      step: 'both',
      children: [
        {
          id: 'periodic_law',
          label: '周期律と周期表',
          step: 'both',
          subLabel: 'メンデレーエフが発見した規則的変化',
          explanation: '元素を原子番号順に並べると、似た性質の元素が規則的に現れる（これを「周期律」という）。これに基づき並べた表が「元素の周期表」です。',
          relatedQuestions: []
        },
        {
          id: 'groups',
          label: '族と周期',
          step: 'both',
          subLabel: '縦の列（族）と横の行（周期）',
          explanation: '・族: 周期表の【縦の列】（1~18族）。同じ族に属する元素は価電子数が等しく、化学的性質が互いに極めて似ている。\n・周期: 周期表の【横の行】（第1~7周期）。第3周期元素なら共通してK, L, M殻の3つの殻に電子を持つ。',
          relatedQuestions: [
            { id: 'q_c2_1_1_ta', label: '問1(タ) 族' },
            { id: 'q_c2_1_1_chi', label: '問1(チ) 周期' },
            { id: 'q_c2_1_4_1', label: '問4(1) 同じ族の価電子数' }
          ]
        },
        {
          id: 'elements',
          label: '典型元素と遷移元素',
          step: 'both',
          subLabel: '1,2,13～18族 ＆ 3～12族の差',
          explanation: '・典型元素（1, 2, 13~18族）: 原子番号の増加に伴い、価電子数が1から7へと周期的に変わり、性質が大きく異なる。非金属・金属両方が含まれる。\n・遷移元素（3~12族）: 全てが金属元素。最外殻電子はほぼ 1または2 で固定されたまま、内側のd軌道などが満たされるため、隣同士の元素の性質が互いに極めて類似する。',
          relatedQuestions: [
            { id: 'q_c2_1_4_4', label: '問4(4) 典型と遷移の説明' },
            { id: 'q_c2_1_6_a2', label: '問6(A2) 単体分類' },
            { id: 'q_c2_1_6_b2', label: '問6(B2) 単体分類' },
            { id: 'q_c2_1_6_c2', label: '問6(C2) 単体分類' },
            { id: 'q_c2_1_6_d2', label: '問6(D2) 単体分類' },
            { id: 'q_c2_1_6_e2', label: '問6(E2) 単体分類' },
            { id: 'q_c2_1_6_f2', label: '問6(F2) 単体分類' }
          ]
        },
        {
          id: 'specific',
          label: '特定グループ',
          step: 'both',
          subLabel: '同族元素の固有名称',
          explanation: '・アルカリ金属: 1族（Hを除く）\n・アルカリ土類金属: 2族（Be, Mgを除く場合もあるが、広義に含む）\n・ハロゲン: 17族（価電子数7、非常に反応性に富む）\n・貴ガス: 18族（価電子数0、最外殻はK殻で2個、他は8個で閉殻し、非常に安定な単原子気体）',
          relatedQuestions: [
            { id: 'q_c2_1_1_tsu', label: '問1(ツ) アルカリ' },
            { id: 'q_c2_1_1_te', label: '問1(テ) ハロゲン' },
            { id: 'q_c2_1_1_to', label: '問1(ト) 貴ガス' },
            { id: 'q_c2_1_4_2', label: '問4(2) アルゴン Ar' }
          ]
        }
      ]
    }
  ]
};
