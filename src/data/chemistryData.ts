import { acidBaseProblems } from './acidBaseProblems';
import { redoxProblems } from './redoxProblems';

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
          "practiceProblems": [
            {
              "id": "p_c1_1_1",
              "category": "純物質と混合物",
              "text": "問1 次の文章の空欄に適する語句を答えなさい（選択肢がある場合はその中から正しい方を選びなさい）。\n\n物質は大きく「純物質」と「混合物」に分けられる。純物質は「（ ア ）種類の粒子からできている」ものであり、融点や沸点、密度などの値が、その量や採取場所によらず常に（イ：　等しく　・　異　）なる。さらに純物質は、1種類の（ ウ ）からできている「（ エ ）」と、2種類以上の（ ウ ）からできている「（ オ ）」に分けられる。（ エ ）のうち、室温で液体として存在するのは（ カ ）と水銀だけである。一方、混合物は「（ キ ）種類以上の粒子からできている」ものであり、混じっている物質の種類やその（ ク ）によって融点や沸点などの値が（ケ：　等しく　・　異　）なる。混合物を純物質に分けるには、ろ過や蒸留などの「（ コ ）的方法」を用いるが、（ オ ）を（ エ ）に分解するには、電気分解などの「（ サ ）的方法」を用いる必要がある。",
              "subQuestions": [
                {
                  "id": "p1_a",
                  "label": "(ア)",
                  "type": "short_answer",
                  "correctAnswer": "1",
                  "correctAnswerRate": 85,
                  "detailedExplanation": {
                    "theme": "純物質と混合物の定義",
                    "type": "構造発見型",
                    "difficulty": 1,
                    "steps": [
                      "① 「純物質」の定義を問う空欄であることを確認する",
                      "② 純物質と混合物の違いは粒子の種類数であることを想起する",
                      "③ 純物質は1種類の粒子からなることを確認する"
                    ]
                  }
                },
                {
                  "id": "p1_i",
                  "label": "(イ)",
                  "type": "multiple_choice",
                  "options": [
                    "等しく",
                    "異"
                  ],
                  "correctAnswer": "等しく",
                  "correctAnswerRate": 85,
                  "detailedExplanation": {
                    "theme": "純物質の性質",
                    "type": "演繹型",
                    "difficulty": 1,
                    "steps": [
                      "① 純物質の性質について述べている部分であると確認する",
                      "② 不純物がない場合の状態変化の特徴を想起する",
                      "③ 融点・沸点は一定値で現れることを確認する"
                    ]
                  }
                },
                {
                  "id": "p1_u",
                  "label": "(ウ)",
                  "type": "short_answer",
                  "correctAnswer": "元素",
                  "correctAnswerRate": 85,
                  "detailedExplanation": {
                    "theme": "単体・化合物の分類基準",
                    "type": "構造発見型",
                    "difficulty": 1,
                    "steps": [
                      "① 純物質の内部分類についての記述であると確認する",
                      "② 単体と化合物は元素の種類数で区別されると想起する",
                      "③ 粒子ではなく元素に着目する必要があると判断する"
                    ]
                  }
                },
                {
                  "id": "p1_e",
                  "label": "(エ)",
                  "type": "short_answer",
                  "correctAnswer": "単体",
                  "correctAnswerRate": 85,
                  "detailedExplanation": {
                    "theme": "単体の定義",
                    "type": "演繹型",
                    "difficulty": 1,
                    "steps": [
                      "① 「1種類の（ウ）」という条件に注目する",
                      "② （ウ）が元素であることを確認する",
                      "③ 元素が1種類のみの物質の名称を想起する"
                    ]
                  }
                },
                {
                  "id": "p1_o",
                  "label": "(オ)",
                  "type": "short_answer",
                  "correctAnswer": "化合物",
                  "correctAnswerRate": 85,
                  "detailedExplanation": {
                    "theme": "化合物の定義",
                    "type": "演繹型",
                    "difficulty": 1,
                    "steps": [
                      "① 「2種類以上の（ウ）」という条件に注目する",
                      "② 複数元素からなる純物質の名称を想起する",
                      "③ 単体との対比で整理する"
                    ]
                  }
                },
                {
                  "id": "p1_ka",
                  "label": "(カ)",
                  "type": "short_answer",
                  "correctAnswer": "臭素",
                  "correctAnswerRate": 85,
                  "detailedExplanation": {
                    "theme": "常温で液体の単体",
                    "type": "知識再生型",
                    "steps": [
                      "① 単体の状態（常温）に関する知識を問う問題と判断する",
                      "② 常温で液体の単体を思い出す",
                      "③ 水銀は既出であることを確認する"
                    ]
                  }
                },
                {
                  "id": "p1_ki",
                  "label": "(キ)",
                  "type": "short_answer",
                  "correctAnswer": "2",
                  "correctAnswerRate": 85,
                  "detailedExplanation": {
                    "theme": "混合物の定義",
                    "type": "構造発見型",
                    "difficulty": 1,
                    "steps": [
                      "① 「混合物」の定義を問う空欄であることを確認する",
                      "② 純物質との違いは粒子の種類数であることを想起する",
                      "③ 混合物は2種類以上の粒子からなることを確認する"
                    ]
                  }
                },
                {
                  "id": "p1_ku",
                  "label": "(ク)",
                  "type": "short_answer",
                  "correctAnswer": "割合（または組成）",
                  "correctAnswerRate": 85,
                  "detailedExplanation": {
                    "theme": "混合物の性質決定要因",
                    "type": "構造発見型",
                    "difficulty": 1,
                    "steps": [
                      "① 混合物の性質が何によって変わるかを問う文であると確認する",
                      "② 混合物は複数成分からなることを確認する",
                      "③ 各成分の量的関係が性質に影響することを想起する"
                    ]
                  }
                },
                {
                  "id": "p1_ke",
                  "label": "(ケ)",
                  "type": "multiple_choice",
                  "options": [
                    "等しく",
                    "異"
                  ],
                  "correctAnswer": "異",
                  "correctAnswerRate": 85,
                  "detailedExplanation": {
                    "theme": "混合物の性質（一定性）",
                    "type": "演繹型",
                    "steps": [
                      "① （ク）で割合が変わることを前提にする",
                      "② 割合が変化すると性質も変わることを確認する",
                      "③ 一定か変化するかで判断する"
                    ]
                  }
                },
                {
                  "id": "p1_ko",
                  "label": "(コ)",
                  "type": "short_answer",
                  "correctAnswer": "物理",
                  "correctAnswerRate": 85,
                  "detailedExplanation": {
                    "theme": "分離法（物理的方法）",
                    "type": "概念区別型",
                    "difficulty": 2,
                    "steps": [
                      "① ろ過・蒸留の操作内容を思い出す",
                      "② 操作によって物質の本質が変化するかを確認する",
                      "③ 化学変化が起きていないことを判断する"
                    ]
                  }
                },
                {
                  "id": "p1_sa",
                  "label": "(サ)",
                  "type": "short_answer",
                  "correctAnswer": "化学",
                  "correctAnswerRate": 85,
                  "detailedExplanation": {
                    "theme": "分解法（化学的方法）",
                    "type": "概念区別型",
                    "difficulty": 2,
                    "steps": [
                      "① 電気分解の操作内容を思い出す",
                      "② 元の物質が別の物質に変化しているかを確認する",
                      "③ 化学変化が起きていると判断する"
                    ]
                  }
                }
              ],
              "explanation": "{\"type\":\"logic_thought\",\"phase1\":{\"title\":\"フェーズ1：ロジック構造の分析（ユーザー確認フェーズ）\",\"overview\":{\"theme\":\"物質の分類（純物質と混合物、単体と化合物）および、構成要素の概念（元素と単体の区別）\",\"type\":\"演繹型（既知知識の適用）\",\"concepts\":\"純物質、混合物、単体、化合物、元素、同素体、物理的変化（分離）、化学的変化（分解）\"},\"tree\":\"【物質の分類と判別プロセス】\\n│\\n├─ 条件：物理的に分けられるか？ [Step 1]\\n│   ├─ はい（分離可能・融点一定でない）\\n│   │   └─ 結論：【混合物】 [問1, 問2] [Step 2]\\n│   │\\n│   └─ いいえ（分離不可・1種類の物質）\\n│       └─ 結論：【純物質】 [問1] [Step 3]\\n│           │\\n│           ├─ 条件：構成元素が1種類か？\\n│           │   ├─ いいえ（化学的に分解可能）\\n│           │   │   └─ 結論：【化合物】 [問1, 問2] [Step 4]\\n│           │   │\\n│           │   └─ はい（分解不可）\\n│           │       └─ 結論：【単体】 [問1, 問2] [Step 5]\\n│           │\\n│           └─ 条件：文脈における「名前」の使われ方\\n│               ├─ 実際に存在する物質（性質・状態・反応）\\n│               │   └─ 結論：【単体】 [問3] [Step 6]\\n│               │\\n│               └─ 物質の成分（構成要素・含有）\\n│                   └─ 結論：【元素】 [問3] [Step 7]\",\"steps\":[{\"step\":\"Step 1\",\"tag\":\"条件抽出\",\"target\":\"物理的に分けられるか？\",\"content\":\"物質を分ける最初の基準として、<u>物理的な方法</u>（ろ過や蒸留など）で分離可能かを確認する。\",\"knowledge\":\"純物質と混合物の定義\",\"purpose\":\"純物質と混合物を大別する。\"},{\"step\":\"Step 2\",\"tag\":\"分類理解\",\"target\":\"混合物の性質と具体例\",\"content\":\"物理的に分けられるものは<u>混合物</u>であり、成分の割合によって性質が異なることを理解する。\",\"knowledge\":\"混合物の性質\",\"purpose\":\"混合物に関する問題（問1, 問2）を解く。\"},{\"step\":\"Step 3\",\"tag\":\"性質理解\",\"target\":\"純物質の性質\",\"content\":\"物理的に分けられないものは<u>純物質</u>であり、融点や沸点が一定であることを理解する。\",\"knowledge\":\"純物質の性質\",\"purpose\":\"純物質に関する問題（問1）を解く。\"},{\"step\":\"Step 4\",\"tag\":\"分類理解\",\"target\":\"化合物の定義と具体例\",\"content\":\"純物質のうち、2種類以上の元素からなるものを<u>化合物</u>とし、化学的に分解可能であることを理解する。\",\"knowledge\":\"化合物の定義\",\"purpose\":\"化合物に関する問題（問1, 問2）を解く。\"},{\"step\":\"Step 5\",\"tag\":\"分類理解\",\"target\":\"単体の定義と具体例\",\"content\":\"純物質のうち、1種類の元素からなるものを<u>単体</u>とし、これ以上分解できないことを理解する。\",\"knowledge\":\"単体の定義\",\"purpose\":\"単体に関する問題（問1, 問2）を解く。\"},{\"step\":\"Step 6\",\"tag\":\"文脈判断\",\"target\":\"単体としての使われ方\",\"content\":\"文脈において、実際に存在する物質（性質・状態・反応）を指している場合は<u>「単体」</u>と判断する。\",\"knowledge\":\"単体と元素の区別\",\"purpose\":\"問3の単体を特定する。\"},{\"step\":\"Step 7\",\"tag\":\"文脈判断\",\"target\":\"元素としての使われ方\",\"content\":\"文脈において、物質の成分（構成要素・含有）を指している場合は<u>「元素」</u>と判断する。\",\"knowledge\":\"単体と元素の区別\",\"purpose\":\"問3の元素を特定する。\"}]},\"phase2\":{\"title\":\"フェーズ2：解答プロセスの構築（解説生成フェーズ）\",\"explanations\":[],\"stumblingPoints\":[{\"step\":\"Step 1\",\"type\":\"概念混同\",\"content\":\"・入試のひっかけポイント：「名称は1つの単語に見えるが、実は水溶液（混合物）」というパターンに注意しましょう。\\n代表例：塩酸（塩化水素の水溶液）、アンモニア水（アンモニアの水溶液）。これらは化学式「HCl」「NH₃」だけで表すことはできず、水（H₂O）との混合物です。\"},{\"step\":\"Step 3\",\"type\":\"適用失敗\",\"content\":\"目的：文脈から「単体（実体）」と「元素（成分）」を論理的に切り分ける基準の再構築。\\n以下の2つの文について、下線部が「単体」か「元素」か答えなさい。\\nA：「カルシウムは、水と激しく反応して水素を発生する。」\\nB：「牛乳には、カルシウムが豊富に含まれている。」\\n（解答：Aは実際に反応している「実体」なので単体。Bは牛乳の中に金属の塊が入っているわけではなく「成分」なので元素。）\"}]}}",
              "surroundingKnowledge": [],
              "deepDiveTopics": []
            },
            {
              "id": "p_c1_1_2",
              "category": "物質の分類",
              "text": "問2 次の（1）〜（15）の物質を、【A：単体】【B：化合物】【C：混合物】に分類しなさい。\n\n（1） 酸素　　（2） 海水　　（3） 塩化ナトリウム　　（4） 塩酸　　（5） アンモニア\n（6） 空気　　（7） 石油（原油）　　（8） 鉄　　（9） プロパン　　（10） ガソリン\n（11） 水　　（12） 木材　　（13） キセノン　　（14） 二酸化炭素　　（15） 炭酸水素ナトリウム",
              "subQuestions": [
                {
                  "id": "p2_1",
                  "label": "(1) 酸素",
                  "type": "multiple_choice",
                  "options": [
                    "A",
                    "B",
                    "C"
                  ],
                  "correctAnswer": "A",
                  "correctAnswerRate": 85,
                  "detailedExplanation": {
                    "theme": "物質分類",
                    "type": "演繹型",
                    "steps": [
                      "① 対象が単一物質かどうかを確認する",
                      "② 酸素は1種類の元素のみからなることを想起する",
                      "③ 他成分が含まれていないことを確認する",
                      "④ 元素数に基づいて分類基準を適用する",
                      "⑤ 分類を確定する"
                    ]
                  }
                },
                {
                  "id": "p2_2",
                  "label": "(2) 海水",
                  "type": "multiple_choice",
                  "options": [
                    "A",
                    "B",
                    "C"
                  ],
                  "correctAnswer": "C",
                  "correctAnswerRate": 85,
                  "detailedExplanation": {
                    "theme": "物質分類",
                    "type": "演繹型",
                    "steps": [
                      "① 複数の物質（水・塩など）が含まれていることを確認する",
                      "② 成分が物理的に混ざっている状態であると判断する",
                      "③ 組成が一定でないことを確認する",
                      "④ 純物質ではないと判断する",
                      "⑤ 分類を確定する"
                    ]
                  }
                },
                {
                  "id": "p2_3",
                  "label": "(3) 塩化ナトリウム",
                  "type": "multiple_choice",
                  "options": [
                    "A",
                    "B",
                    "C"
                  ],
                  "correctAnswer": "B",
                  "correctAnswerRate": 85,
                  "detailedExplanation": {
                    "theme": "物質分類",
                    "type": "演繹型",
                    "steps": [
                      "① NaとClの2種類の元素からなることを確認する",
                      "② 一定比で結びついた物質であると判断する",
                      "③ 混合物ではないことを確認する",
                      "④ 元素数に基づいて分類する",
                      "⑤ 分類を確定する"
                    ]
                  }
                },
                {
                  "id": "p2_4",
                  "label": "(4) 塩酸",
                  "type": "multiple_choice",
                  "options": [
                    "A",
                    "B",
                    "C"
                  ],
                  "correctAnswer": "C",
                  "correctAnswerRate": 85,
                  "detailedExplanation": {
                    "theme": "物質分類",
                    "type": "演繹型",
                    "steps": [
                      "① 塩化水素が水に溶けた溶液であることを確認する",
                      "② 複数成分が含まれていることを判断する",
                      "③ 組成が変化しうることを確認する",
                      "④ 混合物であると判断する",
                      "⑤ 分類を確定する"
                    ]
                  }
                },
                {
                  "id": "p2_5",
                  "label": "(5) アンモニア",
                  "type": "multiple_choice",
                  "options": [
                    "A",
                    "B",
                    "C"
                  ],
                  "correctAnswer": "B",
                  "correctAnswerRate": 85,
                  "detailedExplanation": {
                    "theme": "物質分類",
                    "type": "演繹型",
                    "steps": [
                      "① 窒素と水素からなることを確認する",
                      "② 一定組成の物質であることを判断する",
                      "③ 混合物ではないことを確認する",
                      "④ 元素が複数であることから分類する",
                      "⑤ 分類を確定する"
                    ]
                  }
                },
                {
                  "id": "p2_6",
                  "label": "(6) 空気",
                  "type": "multiple_choice",
                  "options": [
                    "A",
                    "B",
                    "C"
                  ],
                  "correctAnswer": "C",
                  "correctAnswerRate": 85,
                  "detailedExplanation": {
                    "theme": "物質分類",
                    "type": "演繹型",
                    "steps": [
                      "① 複数の気体が含まれていることを確認する",
                      "② 成分が一定でないことを判断する",
                      "③ 混合状態であることを確認する",
                      "④ 純物質ではないと判断する",
                      "⑤ 分類を確定する"
                    ]
                  }
                },
                {
                  "id": "p2_7",
                  "label": "(7) 石油（原油）",
                  "type": "multiple_choice",
                  "options": [
                    "A",
                    "B",
                    "C"
                  ],
                  "correctAnswer": "C",
                  "correctAnswerRate": 85,
                  "detailedExplanation": {
                    "theme": "物質分類",
                    "type": "演繹型",
                    "steps": [
                      "① 多種類の炭化水素を含むことを確認する",
                      "② 成分が一定でないことを判断する",
                      "③ 混合物であることを確認する",
                      "④ 分離可能であることを想起する",
                      "⑤ 分類を確定する"
                    ]
                  }
                },
                {
                  "id": "p2_8",
                  "label": "(8) 鉄",
                  "type": "multiple_choice",
                  "options": [
                    "A",
                    "B",
                    "C"
                  ],
                  "correctAnswer": "A",
                  "correctAnswerRate": 85,
                  "detailedExplanation": {
                    "theme": "物質分類",
                    "type": "演繹型",
                    "steps": [
                      "① Feのみからなることを確認する",
                      "② 他成分が含まれていないことを判断する",
                      "③ 単一元素で構成されることを確認する",
                      "④ 分類基準を適用する",
                      "⑤ 分類を確定する"
                    ]
                  }
                },
                {
                  "id": "p2_9",
                  "label": "(9) プロパン",
                  "type": "multiple_choice",
                  "options": [
                    "A",
                    "B",
                    "C"
                  ],
                  "correctAnswer": "B",
                  "correctAnswerRate": 85,
                  "detailedExplanation": {
                    "theme": "物質分類",
                    "type": "演繹型",
                    "steps": [
                      "① 炭素と水素からなることを確認する",
                      "② 一定組成の物質であると判断する",
                      "③ 混合物ではないことを確認する",
                      "④ 元素が複数であることから分類する",
                      "⑤ 分類を確定する"
                    ]
                  }
                },
                {
                  "id": "p2_10",
                  "label": "(10) ガソリン",
                  "type": "multiple_choice",
                  "options": [
                    "A",
                    "B",
                    "C"
                  ],
                  "correctAnswer": "C",
                  "correctAnswerRate": 85,
                  "detailedExplanation": {
                    "theme": "物質分類",
                    "type": "演繹型",
                    "steps": [
                      "① 多種類の炭化水素の混合であることを確認する",
                      "② 成分比が一定でないことを判断する",
                      "③ 混合物であることを確認する",
                      "④ 分離可能であることを想起する",
                      "⑤ 分類を確定する"
                    ]
                  }
                },
                {
                  "id": "p2_11",
                  "label": "(11) 水",
                  "type": "multiple_choice",
                  "options": [
                    "A",
                    "B",
                    "C"
                  ],
                  "correctAnswer": "B",
                  "correctAnswerRate": 85,
                  "detailedExplanation": {
                    "theme": "物質分類",
                    "type": "演繹型",
                    "steps": [
                      "① 水素と酸素からなることを確認する",
                      "② 一定組成であることを判断する",
                      "③ 単体ではないことを確認する",
                      "④ 元素が複数であることから分類する",
                      "⑤ 分類を確定する"
                    ]
                  }
                },
                {
                  "id": "p2_12",
                  "label": "(12) 木材",
                  "type": "multiple_choice",
                  "options": [
                    "A",
                    "B",
                    "C"
                  ],
                  "correctAnswer": "C",
                  "correctAnswerRate": 85,
                  "detailedExplanation": {
                    "theme": "物質分類",
                    "type": "演繹型",
                    "steps": [
                      "① セルロースなど複数成分からなることを確認する",
                      "② 成分が均一でないことを判断する",
                      "③ 混合物であることを確認する",
                      "④ 純物質ではないと判断する",
                      "⑤ 分類を確定する"
                    ]
                  }
                },
                {
                  "id": "p2_13",
                  "label": "(13) キセノン",
                  "type": "multiple_choice",
                  "options": [
                    "A",
                    "B",
                    "C"
                  ],
                  "correctAnswer": "A",
                  "correctAnswerRate": 85,
                  "detailedExplanation": {
                    "theme": "物質分類",
                    "type": "演繹型",
                    "steps": [
                      "① 希ガス元素であることを確認する",
                      "② 単一元素からなることを判断する",
                      "③ 他成分が含まれていないことを確認する",
                      "④ 分類基準を適用する",
                      "⑤ 分類を確定する"
                    ]
                  }
                },
                {
                  "id": "p2_14",
                  "label": "(14) 二酸化炭素",
                  "type": "multiple_choice",
                  "options": [
                    "A",
                    "B",
                    "C"
                  ],
                  "correctAnswer": "B",
                  "correctAnswerRate": 85,
                  "detailedExplanation": {
                    "theme": "物質分類",
                    "type": "演繹型",
                    "steps": [
                      "① 炭素と酸素からなることを確認する",
                      "② 一定組成であることを判断する",
                      "③ 混合物ではないことを確認する",
                      "④ 元素が複数であることから分類する",
                      "⑤ 分類を確定する"
                    ]
                  }
                },
                {
                  "id": "p2_15",
                  "label": "(15) 炭酸水素ナトリウム",
                  "type": "multiple_choice",
                  "options": [
                    "A",
                    "B",
                    "C"
                  ],
                  "correctAnswer": "B",
                  "correctAnswerRate": 85,
                  "detailedExplanation": {
                    "theme": "物質分類",
                    "type": "演繹型",
                    "steps": [
                      "① Na・H・C・Oからなることを確認する",
                      "② 一定組成の物質であると判断する",
                      "③ 混合物ではないことを確認する",
                      "④ 元素が複数であることから分類する",
                      "⑤ 分類を確定する"
                    ]
                  }
                }
              ],
              "explanation": "{\"type\": \"logic_thought\", \"phase1\": {\"title\": \"物質の分類\", \"overview\": \"物質を混合物、単体、化合物に分類する論理を整理します。\", \"tree\": \"物質\\n├ Step 1: 物質の分類\\n│ ├ 純物質\\n│ │ ├ 単体\\n│ │ └ 化合物\\n│ └ 混合物\\n└ Step 2: 物質の性質\", \"steps\": [\"Step 1: 物質の分類\", \"Step 2: 物質の性質\"]}, \"phase2\": {\"explanations\": [{\"step\": \"Step 1: 物質の分類\", \"tag\": \"分類\", \"subQuestionIds\": [\"p2_1\", \"p2_2\", \"p2_3\", \"p2_4\", \"p2_5\", \"p2_6\", \"p2_7\", \"p2_8\", \"p2_9\", \"p2_10\", \"p2_11\", \"p2_12\", \"p2_13\", \"p2_14\", \"p2_15\"], \"content\": \"物質は<u>純物質</u>と<u>混合物</u>に、純物質はさらに<u>単体</u>と<u>化合物</u>に分類されます。\"}], \"stumblingPoints\": []}}",
              "surroundingKnowledge": [],
              "deepDiveTopics": []
            },
            {
              "id": "p_c1_1_3",
              "category": "元素と単体",
              "text": "問3 次の(1)〜(10)の下線部は、「単体」と「元素」のどちらの意味で用いられているか。\n\n(1) 負傷者に<u>酸素</u>吸入を行った。\n(2) 水は、<u>水素</u>と<u>酸素</u>からできている。\n(3) <u>カルシウム</u>は、骨や歯に多く含まれている。\n(4) 飛行船には、かつて<u>水素</u>が詰められていたが、現在は<u>ヘリウム</u>が使われる。\n(5) ダイヤモンドは、<u>炭素</u>の同素体である。\n(6) 胃液には、<u>塩素</u>が含まれている。\n(7) 携帯電話のバッテリーには、<u>リチウム</u>が使われている。\n(8) 水を電気分解すると、陰極から<u>水素</u>が発生する。\n(9) <u>鉄</u>は、湿った空気中でさびやすい。\n(10) 地球の空気の約78%は<u>窒素</u>である。",
              "subQuestions": [
                {
                  "id": "p3_1",
                  "label": "(1)",
                  "type": "multiple_choice",
                  "options": [
                    "単体",
                    "元素"
                  ],
                  "correctAnswer": "単体",
                  "correctAnswerRate": 85,
                  "detailedExplanation": {
                    "theme": "単体と元素の文脈判断",
                    "type": "文脈判断型",
                    "steps": [
                      "① 文が「実際に使用する物質」を指しているか確認する",
                      "② 酸素吸入は気体としての酸素を意味すると判断する",
                      "③ 構成要素ではなく実在物質であると整理する",
                      "④ 元素概念ではないことを確認する",
                      "⑤ 分類を確定する"
                    ]
                  }
                },
                {
                  "id": "p3_2",
                  "label": "(2)",
                  "type": "multiple_choice",
                  "options": [
                    "単体",
                    "元素"
                  ],
                  "correctAnswer": "元素",
                  "correctAnswerRate": 85,
                  "detailedExplanation": {
                    "theme": "単体と元素の文脈判断",
                    "type": "文脈判断型",
                    "steps": [
                      "① 物質の構成を説明する文であると確認する",
                      "② 水の材料としての水素・酸素に注目する",
                      "③ 構成要素として扱われていると判断する",
                      "④ 単体ではないことを確認する",
                      "⑤ 分類を確定する"
                    ]
                  }
                },
                {
                  "id": "p3_3",
                  "label": "(3)",
                  "type": "multiple_choice",
                  "options": [
                    "単体",
                    "元素"
                  ],
                  "correctAnswer": "元素",
                  "correctAnswerRate": 85,
                  "detailedExplanation": {
                    "theme": "単体と元素の文脈判断",
                    "type": "文脈判断型",
                    "steps": [
                      "① 物質中に含まれる成分を述べていると確認する",
                      "② カルシウムが構成要素として扱われていると判断する",
                      "③ 実在物質としての挙動ではないと整理する",
                      "④ 元素概念であると判断する",
                      "⑤ 分類を確定する"
                    ]
                  }
                },
                {
                  "id": "p3_4",
                  "label": "(4)",
                  "type": "multiple_choice",
                  "options": [
                    "単体",
                    "元素"
                  ],
                  "correctAnswer": "単体",
                  "correctAnswerRate": 85,
                  "detailedExplanation": {
                    "theme": "単体と元素の文脈判断",
                    "type": "文脈判断型",
                    "steps": [
                      "① 実際に使用される気体について述べていると確認する",
                      "② 水素・ヘリウムが物質として扱われていると判断する",
                      "③ 構成要素ではないことを確認する",
                      "④ 単体としての扱いであると整理する",
                      "⑤ 分類を確定する"
                    ]
                  }
                },
                {
                  "id": "p3_5",
                  "label": "(5)",
                  "type": "multiple_choice",
                  "options": [
                    "単体",
                    "元素"
                  ],
                  "correctAnswer": "元素",
                  "correctAnswerRate": 85,
                  "detailedExplanation": {
                    "theme": "単体と元素の文脈判断",
                    "type": "文脈判断型",
                    "steps": [
                      "① 同素体という語に注目する",
                      "② 同素体は「同じ元素からなる異なる単体」であると想起する",
                      "③ ここでの「炭素」は特定の物質（黒鉛やダイヤモンド）そのものではなく、共通の成分を指していると判断する",
                      "④ 成分（概念）としての「元素」であることを確認する",
                      "⑤ 分類を確定する"
                    ]
                  }
                },
                {
                  "id": "p3_6",
                  "label": "(6)",
                  "type": "multiple_choice",
                  "options": [
                    "単体",
                    "元素"
                  ],
                  "correctAnswer": "元素",
                  "correctAnswerRate": 85,
                  "detailedExplanation": {
                    "theme": "単体と元素の文脈判断",
                    "type": "文脈判断型",
                    "steps": [
                      "① 胃液の成分について述べていると確認する",
                      "② 塩素が構成要素として含まれていると判断する",
                      "③ 実在物質として単独で扱われていないことを確認する",
                      "④ 元素としての意味であると整理する",
                      "⑤ 分類を確定する"
                    ]
                  }
                },
                {
                  "id": "p3_7",
                  "label": "(7)",
                  "type": "multiple_choice",
                  "options": [
                    "単体",
                    "元素"
                  ],
                  "correctAnswer": "元素",
                  "correctAnswerRate": 85,
                  "detailedExplanation": {
                    "theme": "単体と元素の文脈判断",
                    "type": "文脈判断型",
                    "steps": [
                      "① 材料として使われていることに注目する",
                      "② リチウムが成分として利用されていると判断する",
                      "③ 構成要素としての意味合いであると整理する",
                      "④ 単体としての扱いではないことを確認する",
                      "⑤ 分類を確定する"
                    ]
                  }
                },
                {
                  "id": "p3_8",
                  "label": "(8)",
                  "type": "multiple_choice",
                  "options": [
                    "単体",
                    "元素"
                  ],
                  "correctAnswer": "単体",
                  "correctAnswerRate": 85,
                  "detailedExplanation": {
                    "theme": "単体と元素の文脈判断",
                    "type": "文脈判断型",
                    "steps": [
                      "① 発生する気体について述べていると確認する",
                      "② 水素が実際に生成される物質であると判断する",
                      "③ 構成要素ではなく生成物であると整理する",
                      "④ 単体として扱われていると確認する",
                      "⑤ 分類を確定する"
                    ]
                  }
                },
                {
                  "id": "p3_9",
                  "label": "(9)",
                  "type": "multiple_choice",
                  "options": [
                    "単体",
                    "元素"
                  ],
                  "correctAnswer": "単体",
                  "correctAnswerRate": 85,
                  "detailedExplanation": {
                    "theme": "単体と元素の文脈判断",
                    "type": "文脈判断型",
                    "steps": [
                      "① 物質の性質（さびやすさ）を述べていると確認する",
                      "② 鉄が実在する物質として扱われていると判断する",
                      "③ 構成要素ではないことを確認する",
                      "④ 単体としての性質であると整理する",
                      "⑤ 分類を確定する"
                    ]
                  }
                },
                {
                  "id": "p3_10",
                  "label": "(10)",
                  "type": "multiple_choice",
                  "options": [
                    "単体",
                    "元素"
                  ],
                  "correctAnswer": "単体",
                  "correctAnswerRate": 85,
                  "detailedExplanation": {
                    "theme": "単体と元素の文脈判断",
                    "type": "文脈判断型",
                    "steps": [
                      "① 空気の成分割合について述べていると確認する",
                      "② 窒素が実在する気体として扱われていると判断する",
                      "③ 構成要素ではなく存在物質であると整理する",
                      "④ 単体としての意味であると確認する",
                      "⑤ 分類を確定する"
                    ]
                  }
                }
              ],
              "explanation": "{\"type\": \"logic_thought\", \"phase1\": {\"title\": \"元素と単体の識別\", \"overview\": \"文脈から「単体」と「元素」を識別する論理を整理します。\", \"tree\": \"Step 3: 単体と元素の識別\\n├ 単体（実体）：物質として存在\\n└ 元素（成分）：成分として存在\", \"steps\": [\"Step 3: 単体と元素の識別\"]}, \"phase2\": {\"explanations\": [{\"step\": \"Step 3: 単体と元素の識別\", \"tag\": \"判断\", \"subQuestionIds\": [\"p3_1\", \"p3_2\", \"p3_3\", \"p3_4\", \"p3_5\", \"p3_6\", \"p3_7\", \"p3_8\", \"p3_9\", \"p3_10\"], \"content\": \"実際に存在する物質（実体）なら<u>単体</u>、構成成分（概念）なら<u>元素</u>と判断します。\"}], \"stumblingPoints\": []}}",
              "surroundingKnowledge": [],
              "deepDiveTopics": []
            },
            {
              "id": "p_c1_1_4",
              "category": "純物質の性質",
              "text": "次のア〜エの記述について、純物質に当てはまるものをすべて選んでア〜エの記号で答えよ。（完答） \n\nア）一定の圧力のもとでは、沸騰する温度がいつも同じである。  \n\nイ）固体が融解し始める温度と融解し終わったときの温度が一致しない。  \n\nウ）固体が融解し始める温度と融解し終わった時の温度が一致する。  \n\nエ）温度、圧力が一定ならば、単位体積あたりの質量が一定である。",
              "subQuestions": [
                {
                  "id": "p4_ans",
                  "label": "解答",
                  "type": "multiple_choice",
                  "options": [
                    "ア",
                    "イ",
                    "ウ",
                    "エ"
                  ],
                  "correctAnswer": "ア,ウ,エ",
                  "correctAnswerRate": 80
                }
              ],
              "explanation": "{\"type\":\"logic_thought\",\"phase1\":{\"title\":\"フェーズ1：純物質の性質の分析\",\"overview\":{\"theme\":\"純物質と混合物の性質（融点・沸点・密度）\",\"type\":\"演繹型（既知知識の適用）\",\"concepts\":\"純物質、混合物、融点、沸点、密度\"},\"tree\":\"【純物質と混合物の性質判別】\\n│\\n├─ 条件：純物質か？\\n│   ├─ はい（不純物なし）\\n│   │   ├─ 融点・沸点：一定 [Step 1]\\n│   │   └─ 密度：一定 [Step 2]\\n│   │\\n│   └─ いいえ（混合物）\\n│       └─ 融点・沸点・密度：一定ではない（組成により変化） [Step 3]\",\"steps\":[{\"step\":\"Step 1\",\"tag\":\"性質理解\",\"target\":\"純物質の融点・沸点\",\"content\":\"純物質は決まった融点・沸点を持ち、状態変化中も温度が一定に保たれる。\",\"knowledge\":\"純物質の性質\",\"purpose\":\"ア、イ、ウの判定\"},{\"step\":\"Step 2\",\"tag\":\"性質理解\",\"target\":\"純物質の密度\",\"content\":\"純物質は、温度・圧力が一定ならば密度（単位体積あたりの質量）も一定である。\",\"knowledge\":\"密度の定義\",\"purpose\":\"エの判定\"},{\"step\":\"Step 3\",\"tag\":\"性質理解\",\"target\":\"混合物の性質\",\"content\":\"混合物は、成分の割合によって融点・沸点・密度が変化する。\",\"knowledge\":\"混合物の性質\",\"purpose\":\"イの誤り判定\"}]},\"phase2\":{\"title\":\"フェーズ2：解答プロセスの構築\",\"explanations\":[{\"step\":\"Step 1\",\"tag\":\"判定\",\"subQuestionIds\":[\"p4_ans\"],\"subQuestionLabels\":[\"解答\"],\"content\":\"ア：純物質は決まった沸点を持つため正しい。\\nイ：融点変化は混合物の特徴であるため誤り。\\nウ：純物質は決まった融点を持つため正しい。\\nエ：純物質は密度が一定であるため正しい。\"}],\"stumblingPoints\":[]},\"difficulty\":3}",
              "surroundingKnowledge": [],
              "deepDiveTopics": []
            }
          ],
          "miniTest": [
            {
              "id": "q1",
              "category": "物質の分類と性質",
              "text": "物質の分類と性質に関する次の文章を読み、あとの問いに答えよ。\n\n物質は、現在およそ120種類存在する原子の種類である「元素」から構成されている。物質は大きく分けると、1種類の物質でできている ( ア ) と、2種類以上の ( ア ) が混じり合った ( イ ) に分けられる。 ( ア ) は、酸素や鉄のように1種類の元素からできている ( ウ ) と、水や塩化ナトリウムのように2種類以上の元素からできている ( エ ) が存在する\n\nまた、物質を区別する上で、融点や沸点、密度といった性質も重要である。( ア ) の場合はこれらの値が物質ごとに ( オ ) となるが、( イ ) の場合は、混じっている物質の種類やその割合によって値が ( カ ) するという違いがある。この違いは、①<u>水とエタノールなどの加熱</u>で確認をすることができる。\n\n問1 文章中の空欄 ( ア ) ～ ( カ ) に入る最も適切な語句を答えよ。",
              "subQuestions": [
                {
                  "id": "q1_a",
                  "label": "(ア)",
                  "type": "short_answer",
                  "correctAnswer": "純物質",
                  "correctAnswerRate": 85,
                  "detailedExplanation": {
                    "theme": "物質の分類（純物質）",
                    "type": "知識再生型",
                    "steps": [
                      "① 物質が「1種類の物質でできている」という条件を確認する",
                      "② 物質の分類において、1種類の物質からなるものを何と呼ぶか想起する",
                      "③ 「純物質」と「混合物」の定義の違いを比較する",
                      "④ 2種類以上の物質が混じり合った「混合物」を誤答として排除する",
                      "⑤ 条件に合致する「純物質」を最終判断とする"
                    ]
                  }
                },
                {
                  "id": "q1_b",
                  "label": "(イ)",
                  "type": "short_answer",
                  "correctAnswer": "混合物",
                  "correctAnswerRate": 85,
                  "detailedExplanation": {
                    "theme": "物質の分類（混合物）",
                    "type": "知識再生型",
                    "steps": [
                      "① 物質が「2種類以上の(ア)が混じり合った」という条件を確認する",
                      "② (ア)が純物質であることを踏まえ、複数の純物質が混ざったものを何と呼ぶか想起する",
                      "③ 「純物質」と「混合物」の定義の違いを比較する",
                      "④ 1種類の物質からなる「純物質」を誤答として排除する",
                      "⑤ 条件に合致する「混合物」を最終判断とする"
                    ]
                  }
                },
                {
                  "id": "q1_c",
                  "label": "(ウ)",
                  "type": "short_answer",
                  "correctAnswer": "単体",
                  "correctAnswerRate": 85,
                  "detailedExplanation": {
                    "theme": "純物質の分類（単体）",
                    "type": "知識再生型",
                    "steps": [
                      "① 純物質のうち「1種類の元素からできている」という条件を確認する",
                      "② 純物質が「単体」と「化合物」に分類されることを想起する",
                      "③ 構成する元素の種類数（1種類か2種類以上か）で判断する",
                      "④ 2種類以上の元素からなる「化合物」を誤答として排除する",
                      "⑤ 条件に合致する「単体」を最終判断とする"
                    ]
                  }
                },
                {
                  "id": "q1_d",
                  "label": "(エ)",
                  "type": "short_answer",
                  "correctAnswer": "化合物",
                  "correctAnswerRate": 85,
                  "detailedExplanation": {
                    "theme": "純物質の分類（化合物）",
                    "type": "知識再生型",
                    "steps": [
                      "① 純物質のうち「2種類以上の元素からできている」という条件を確認する",
                      "② 純物質が「単体」と「化合物」に分類されることを想起する",
                      "③ 構成する元素の種類数（1種類か2種類以上か）で判断する",
                      "④ 1種類の元素からなる「単体」を誤答として排除する",
                      "⑤ 条件に合致する「化合物」を最終判断とする"
                    ]
                  }
                },
                {
                  "id": "q1_e",
                  "label": "(オ)",
                  "type": "short_answer",
                  "correctAnswer": "一定",
                  "correctAnswerRate": 85,
                  "detailedExplanation": {
                    "theme": "純物質の性質（融点・沸点）",
                    "type": "演繹型",
                    "steps": [
                      "① (ア)純物質の融点や沸点、密度といった性質について問われていることを確認する",
                      "② 純物質は不純物を含まないため、状態変化の温度がどうなるかを想起する",
                      "③ 物質ごとに固有の値を示すかどうかで判断する",
                      "④ 混合物のように割合で変化する「変化する」「異なる」などの表現を排除する",
                      "⑤ 常に同じ値を示す「一定」を最終判断とする"
                    ]
                  }
                },
                {
                  "id": "q1_f",
                  "label": "(カ)",
                  "type": "short_answer",
                  "correctAnswer": "変化",
                  "correctAnswerRate": 85,
                  "detailedExplanation": {
                    "theme": "混合物の性質（融点・沸点）",
                    "type": "演繹型",
                    "steps": [
                      "① (イ)混合物の融点や沸点、密度といった性質について問われていることを確認する",
                      "② 混合物は混じっている物質の種類や割合によって性質がどうなるかを想起する",
                      "③ 割合に応じて値が変動するかどうかで判断する",
                      "④ 純物質のように固有の値を示す「一定」などの表現を排除する",
                      "⑤ 値が変動することを示す「変化」を最終判断とする"
                    ]
                  }
                }
              ],
              "explanation": "{\"type\": \"logic_thought\", \"phase1\": {\"title\": \"物質の分類\", \"overview\": \"物質の分類構造を整理します。\", \"tree\": \"物質\\n├ Step 1: 物質の分類\\n│ ├ 純物質\\n│ │ ├ 単体\\n│ │ └ 化合物\\n│ └ 混合物\\n└ Step 2: 物質の性質\", \"steps\": [\"Step 1: 物質の分類\", \"Step 2: 物質の性質\"]}, \"phase2\": {\"explanations\": [{\"step\": \"Step 1: 物質の分類\", \"tag\": \"分類\", \"subQuestionIds\": [\"q1_a\", \"q1_b\", \"q1_c\", \"q1_d\"], \"content\": \"物質は<u>純物質</u>と<u>混合物</u>に、純物質はさらに<u>単体</u>と<u>化合物</u>に分類されます。\"}, {\"step\": \"Step 2: 物質の性質\", \"tag\": \"性質\", \"subQuestionIds\": [\"q1_e\", \"q1_f\"], \"content\": \"<u>純物質</u>は性質が一定ですが、<u>混合物</u>は割合により変化します。\"}], \"stumblingPoints\": [{\"node\": \"Step 1: 物質の分類\", \"point\": \"O₂を化合物と誤解する。\"}]}}",
              "surroundingKnowledge": [],
              "deepDiveTopics": []
            },
            {
              "id": "q2",
              "category": "物質の分類",
              "text": "問2 次の (1)〜(6) の物質は、文章中の( イ )～（ エ ）のどれに分類されるか答えよ。\n(イ) 混合物　(ウ) 単体　(エ) 化合物\n\n(1) 空気　 (2) 酸素　 (3) 食塩水　 (4) メタン　 (5) 黒鉛　(6) 石油",
              "subQuestions": [
                {
                  "id": "q2_1",
                  "label": "(1) 空気",
                  "type": "multiple_choice",
                  "options": [
                    "(イ)",
                    "(ウ)",
                    "(エ)"
                  ],
                  "correctAnswer": "(イ)",
                  "correctAnswerRate": 85,
                  "detailedExplanation": {
                    "theme": "物質の分類（空気）",
                    "type": "演繹型",
                    "steps": [
                      "① 空気の成分について確認する",
                      "② 窒素、酸素、アルゴンなど複数の気体が含まれていることを想起する",
                      "③ 複数の純物質が混ざっている状態であると判断する",
                      "④ 単一の物質ではないため「単体」「化合物」を排除する",
                      "⑤ 「混合物」である(イ)を最終判断とする"
                    ]
                  }
                },
                {
                  "id": "q2_2",
                  "label": "(2) 酸素",
                  "type": "multiple_choice",
                  "options": [
                    "(イ)",
                    "(ウ)",
                    "(エ)"
                  ],
                  "correctAnswer": "(ウ)",
                  "correctAnswerRate": 85,
                  "detailedExplanation": {
                    "theme": "物質の分類（酸素）",
                    "type": "演繹型",
                    "steps": [
                      "① 酸素の構成要素について確認する",
                      "② 酸素はOという1種類の元素のみからなることを想起する",
                      "③ 1種類の元素からなる純物質であると判断する",
                      "④ 複数の物質が混ざった「混合物」や、複数の元素からなる「化合物」を排除する",
                      "⑤ 「単体」である(ウ)を最終判断とする"
                    ]
                  }
                },
                {
                  "id": "q2_3",
                  "label": "(3) 食塩水",
                  "type": "multiple_choice",
                  "options": [
                    "(イ)",
                    "(ウ)",
                    "(エ)"
                  ],
                  "correctAnswer": "(イ)",
                  "correctAnswerRate": 85,
                  "detailedExplanation": {
                    "theme": "物質の分類（食塩水）",
                    "type": "演繹型",
                    "steps": [
                      "① 食塩水の成分について確認する",
                      "② 水（溶媒）と塩化ナトリウム（溶質）が含まれていることを想起する",
                      "③ 複数の純物質が混ざっている状態であると判断する",
                      "④ 単一の物質ではないため「単体」「化合物」を排除する",
                      "⑤ 「混合物」である(イ)を最終判断とする"
                    ]
                  }
                },
                {
                  "id": "q2_4",
                  "label": "(4) メタン",
                  "type": "multiple_choice",
                  "options": [
                    "(イ)",
                    "(ウ)",
                    "(エ)"
                  ],
                  "correctAnswer": "(エ)",
                  "correctAnswerRate": 85,
                  "detailedExplanation": {
                    "theme": "物質の分類（メタン）",
                    "type": "演繹型",
                    "steps": [
                      "① メタンの構成要素について確認する",
                      "② 炭素(C)と水素(H)の2種類の元素からなることを想起する",
                      "③ 2種類以上の元素からなる純物質であると判断する",
                      "④ 1種類の元素からなる「単体」や、複数の物質が混ざった「混合物」を排除する",
                      "⑤ 「化合物」である(エ)を最終判断とする"
                    ]
                  }
                },
                {
                  "id": "q2_5",
                  "label": "(5) 黒鉛",
                  "type": "multiple_choice",
                  "options": [
                    "(イ)",
                    "(ウ)",
                    "(エ)"
                  ],
                  "correctAnswer": "(ウ)",
                  "correctAnswerRate": 85,
                  "detailedExplanation": {
                    "theme": "物質の分類（黒鉛）",
                    "type": "演繹型",
                    "steps": [
                      "① 黒鉛の構成要素について確認する",
                      "② 黒鉛は炭素(C)という1種類の元素のみからなることを想起する",
                      "③ 1種類の元素からなる純物質であると判断する",
                      "④ 複数の物質が混ざった「混合物」や、複数の元素からなる「化合物」を排除する",
                      "⑤ 「単体」である(ウ)を最終判断とする"
                    ]
                  }
                },
                {
                  "id": "q2_6",
                  "label": "(6) 石油",
                  "type": "multiple_choice",
                  "options": [
                    "(イ)",
                    "(ウ)",
                    "(エ)"
                  ],
                  "correctAnswer": "(イ)",
                  "correctAnswerRate": 85,
                  "detailedExplanation": {
                    "theme": "物質の分類（石油）",
                    "type": "演繹型",
                    "steps": [
                      "① 石油の成分について確認する",
                      "② 多種類の炭化水素が含まれていることを想起する",
                      "③ 複数の純物質が混ざっている状態であると判断する",
                      "④ 単一の物質ではないため「単体」「化合物」を排除する",
                      "⑤ 「混合物」である(イ)を最終判断とする"
                    ]
                  }
                }
              ],
              "explanation": "{\"type\":\"logic_thought\",\"phase1\":{\"title\":\"物質の分類\",\"overview\":\"物質を混合物、単体、化合物に分類する論理を整理します。\",\"tree\":\"物質の分類\\n├ Step 1: 混合物の判別\\n│ └ 複数成分が混ざっているか？\\n└ Step 2: 純物質の分類\\n  ├ 単体（1種類）\\n  └ 化合物（2種類以上）\",\"steps\":[\"Step 1: 混合物の判別\",\"Step 2: 純物質の分類\"]},\"phase2\":{\"explanations\":[{\"step\":\"Step 1\",\"tag\":\"混合物の判別\",\"subQuestionIds\":[\"q2_1\",\"q2_3\",\"q2_6\"],\"subQuestionLabels\":[\"(1) 空気\",\"(3) 食塩水\",\"(6) 石油\"],\"content\":\"空気や食塩水、石油などは「複数の純物質が混ざったもの」なので混合物です。\"},{\"step\":\"Step 2\",\"tag\":\"純物質の分類\",\"subQuestionIds\":[\"q2_2\",\"q2_4\",\"q2_5\"],\"subQuestionLabels\":[\"(2) 酸素\",\"(4) メタン\",\"(5) 黒鉛\"],\"content\":\"酸素や黒鉛は1種類の元素からなる「単体」、メタンは2種類以上の元素からなる「化合物」です。\"}]}}",
              "surroundingKnowledge": [],
              "deepDiveTopics": []
            },
            {
              "id": "q3",
              "category": "元素と単体",
              "text": "問3 物質の構成成分としての「元素」と、実際に存在する物質としての「単体」を区別することは非常に重要である。次の (1)〜(4) の下線部が、「単体」と「元素」のどちらの意味で用いられているか答えよ。\n\n(1) 植物の生育には、<u>窒素</u>が欠かせない。\n(2) 乾燥空気の体積の約78%は<u>窒素</u>である。\n(3) 砂糖は、<u>炭素</u>や<u>水素</u>、<u>酸素</u>からなる物質である。\n(4) 水を電気分解すると、<u>水素</u>と<u>酸素</u>を生じる。",
              "subQuestions": [
                {
                  "id": "q3_1",
                  "label": "(1)",
                  "type": "multiple_choice",
                  "options": [
                    "元素",
                    "単体"
                  ],
                  "correctAnswer": "元素",
                  "correctAnswerRate": 85,
                  "detailedExplanation": {
                    "theme": "単体と元素の文脈判断",
                    "type": "文脈判断型",
                    "steps": [
                      "① 文が「実際に使用する物質」か「構成成分」かを判断する",
                      "② 植物の生育に欠かせない「窒素」は、肥料などに含まれる成分としての窒素を指していると確認する",
                      "③ 窒素ガス（気体）そのものを吸収しているわけではないことを想起する",
                      "④ 実在する物質としての「単体」を誤答として排除する",
                      "⑤ 成分としての意味である「元素」を最終判断とする"
                    ]
                  }
                },
                {
                  "id": "q3_2",
                  "label": "(2)",
                  "type": "multiple_choice",
                  "options": [
                    "元素",
                    "単体"
                  ],
                  "correctAnswer": "単体",
                  "correctAnswerRate": 85,
                  "detailedExplanation": {
                    "theme": "単体と元素の文脈判断",
                    "type": "文脈判断型",
                    "steps": [
                      "① 文が「実際に使用する物質」か「構成成分」かを判断する",
                      "② 空気の体積の約78%を占める「窒素」は、気体として実在する物質を指していると確認する",
                      "③ 窒素分子（N₂）という具体的な物質の存在割合を述べていることを想起する",
                      "④ 抽象的な成分としての「元素」を誤答として排除する",
                      "⑤ 実在する物質としての意味である「単体」を最終判断とする"
                    ]
                  }
                },
                {
                  "id": "q3_3",
                  "label": "(3)",
                  "type": "multiple_choice",
                  "options": [
                    "元素",
                    "単体"
                  ],
                  "correctAnswer": "元素",
                  "correctAnswerRate": 85,
                  "detailedExplanation": {
                    "theme": "単体と元素の文脈判断",
                    "type": "文脈判断型",
                    "steps": [
                      "① 文が「実際に使用する物質」か「構成成分」かを判断する",
                      "② 砂糖を構成する「炭素」「水素」「酸素」は、物質の材料（成分）を指していると確認する",
                      "③ 砂糖の中に黒鉛（炭素の単体）や水素ガスが含まれているわけではないことを想起する",
                      "④ 実在する物質としての「単体」を誤答として排除する",
                      "⑤ 成分としての意味である「元素」を最終判断とする"
                    ]
                  }
                },
                {
                  "id": "q3_4",
                  "label": "(4)",
                  "type": "multiple_choice",
                  "options": [
                    "元素",
                    "単体"
                  ],
                  "correctAnswer": "単体",
                  "correctAnswerRate": 85,
                  "detailedExplanation": {
                    "theme": "単体と元素の文脈判断",
                    "type": "文脈判断型",
                    "steps": [
                      "① 文が「実際に使用する物質」か「構成成分」かを判断する",
                      "② 水を電気分解して生じる「水素」と「酸素」は、発生した気体そのものを指していると確認する",
                      "③ 実際に集めることができる実在の物質であることを想起する",
                      "④ 抽象的な成分としての「元素」を誤答として排除する",
                      "⑤ 実在する物質としての意味である「単体」を最終判断とする"
                    ]
                  }
                }
              ],
              "explanation": "{\"type\":\"logic_thought\",\"phase1\":{\"title\":\"元素と単体の識別\",\"overview\":\"文脈から「単体」と「元素」を識別する論理を整理します。\",\"tree\":\"単体と元素の識別\\n└ Step 3: 文脈判断\\n  ├ 単体（実体）：物質として存在\\n  └ 元素（成分）：成分として存在\",\"steps\":[\"Step 3: 文脈判断\"]},\"phase2\":{\"explanations\":[{\"step\":\"Step 3\",\"tag\":\"文脈判断\",\"subQuestionIds\":[\"q3_1\",\"q3_2\",\"q3_3\",\"q3_4\"],\"subQuestionLabels\":[\"(1)\",\"(2)\",\"(3)\",\"(4)\"],\"content\":\"見分けるコツは「直接触れられるもの（ガスとして実体がある、など）=単体」、「直接触れられないもの（成分として含まれている、など）=元素」と考えることです。(2)や(4)は気体として実体があるので単体、(1)や(3)は成分の話をしているので元素となります。\"}]}}",
              "surroundingKnowledge": [],
              "deepDiveTopics": []
            },
            {
              "id": "q4",
              "category": "状態変化のグラフ",
              "text": "問4　下線部①は、水・エタノールの（ ア ）の加熱と、水とエタノールの（ イ ）の加熱のグラフを示したものである。この3つのグラフ①～③をそれぞれ、水のグラフ・エタノールのグラフ・水とエタノールの混合物のグラフに分類し、①～③で示せ。\n\n<img src=\"/graph.jpg\" alt=\"加熱のグラフ\" class=\"w-full max-w-md mx-auto my-4 rounded-lg shadow-sm border border-gray-200\" referrerPolicy=\"no-referrer\" />",
              "subQuestions": [
                {
                  "id": "q4_1",
                  "label": "水のグラフ",
                  "type": "multiple_choice",
                  "options": [
                    "①",
                    "②",
                    "③"
                  ],
                  "correctAnswer": "①",
                  "correctAnswerRate": 85,
                  "detailedExplanation": {
                    "theme": "状態変化のグラフ（水）",
                    "type": "演繹型",
                    "steps": [
                      "① 水が純物質であることを確認する",
                      "② 純物質の加熱グラフの特徴を想起する",
                      "③ 沸騰中（状態変化中）は温度が一定に保たれることを確認する",
                      "④ 温度が変化し続けるグラフ②を排除する",
                      "⑤ 水の沸点が100℃であることから、100℃で一定になるグラフ①を最終判断とする"
                    ]
                  }
                },
                {
                  "id": "q4_2",
                  "label": "エタノールのグラフ",
                  "type": "multiple_choice",
                  "options": [
                    "①",
                    "②",
                    "③"
                  ],
                  "correctAnswer": "③",
                  "correctAnswerRate": 85,
                  "detailedExplanation": {
                    "theme": "状態変化のグラフ（エタノール）",
                    "type": "演繹型",
                    "steps": [
                      "① エタノールが純物質であることを確認する",
                      "② 純物質の加熱グラフの特徴を想起する",
                      "③ 沸騰中（状態変化中）は温度が一定に保たれることを確認する",
                      "④ 温度が変化し続けるグラフ②を排除する",
                      "⑤ エタノールの沸点が約78℃であることから、約78℃で一定になるグラフ③を最終判断とする"
                    ]
                  }
                },
                {
                  "id": "q4_3",
                  "label": "水とエタノールの( イ )のグラフ",
                  "type": "multiple_choice",
                  "options": [
                    "①",
                    "②",
                    "③"
                  ],
                  "correctAnswer": "②",
                  "correctAnswerRate": 85,
                  "detailedExplanation": {
                    "theme": "状態変化のグラフ（混合物）",
                    "type": "演繹型",
                    "steps": [
                      "① 水とエタノールの(イ)が混合物であることを確認する",
                      "② 混合物の加熱グラフの特徴を想起する",
                      "③ 沸騰中（状態変化中）も温度が一定に保たれず、徐々に上昇することを確認する",
                      "④ 温度が一定になるグラフ①、③を純物質のグラフとして排除する",
                      "⑤ 沸騰中も温度が変化し続けるグラフ②を最終判断とする"
                    ]
                  }
                }
              ],
              "explanation": "{\"type\": \"logic_thought\", \"phase1\": {\"title\": \"状態変化のグラフ\", \"overview\": \"加熱グラフの違いを整理します。\", \"tree\": \"加熱グラフ\\n├ 純物質：温度一定\\n└ 混合物：温度変化\", \"steps\": [\"純物質\", \"混合物\"]}, \"phase2\": {\"explanations\": [{\"step\": \"純物質\", \"tag\": \"分析\", \"subQuestionIds\": [\"q4_1\", \"q4_2\"], \"content\": \"加熱中<u>温度一定</u>です。\"}, {\"step\": \"混合物\", \"tag\": \"分析\", \"subQuestionIds\": [\"q4_3\"], \"content\": \"加熱中<u>温度変化</u>します。\"}], \"stumblingPoints\": []}}",
              "surroundingKnowledge": [],
              "deepDiveTopics": []
            }
          ]
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
          "practiceProblems": [
            {
              "id": "q_c1_2_A_1",
              "category": "物質の分離と精製 (1. ろ過)",
              "text": "1 ろ過に関する次の問いに答えよ。\n\n<img src=\"/fig_filtration_abcd.png\" alt=\"ろ過の操作 ア〜エ\" class=\"w-full max-w-md mx-auto my-4 rounded-lg shadow-sm border border-gray-200\" referrerPolicy=\"no-referrer\" />\n\n（1）ろ紙を通過して下に落ちた液体のことを何というか。\n\n（2）ろ過はどのような混合物の分離に用いる操作か。「固体」「液体」という言葉を用いて答えよ。\n\n（3）ろ過の操作として、最も適切な図を上の(ア)〜(エ)のうちから1つ選べ。\n\n※(ア)〜(エ)の図の意味：\n（ア）ガラス棒を使わずに直接ろうとに液を注いでいる\n（イ）ろうとの足がビーカーの内壁に密着していない\n（ウ）ガラス棒に伝わらせて液を注ぎ、ろうとの足がビーカーの内壁に密着している（正しい操作）\n（エ）ガラス棒の先がろ紙にあたっておらず、液がはねている",
              "subQuestions": [
                {
                  "id": "q_c1_2_A_1_1",
                  "label": "（1） ろ紙を通過して下に落ちた液体の名称",
                  "type": "short_answer",
                  "correctAnswer": "ろ液",
                  "correctAnswerRate": 90
                },
                {
                  "id": "q_c1_2_A_1_2",
                  "label": "（2） ろ過はどのような混合物の分離に用いる操作か（「固体」「液体」を用いて）",
                  "type": "descriptive",
                  "correctAnswer": "固体（不溶性の固体）と液体の混合物",
                  "gradingCriteria": [
                    "固体",
                    "液体",
                    "混合物"
                  ],
                  "correctAnswerRate": 85
                },
                {
                  "id": "q_c1_2_A_1_3",
                  "label": "（3） ろ過の最も適切な操作の図",
                  "type": "multiple_choice",
                  "options": [
                    "ア",
                    "イ",
                    "ウ",
                    "エ"
                  ],
                  "correctAnswer": "ウ",
                  "correctAnswerRate": 85
                }
              ],
              "explanation": "▼解答・解説\n（1） **ろ液**\nろ紙を通過して下に落ちた液体を「ろ液」といいます。\n\n（2） **固体（不溶性の固体）と液体の混合物**\nろ過とは、固体と液体の混合物から、ろ紙などを用いて固体を分離する操作のことです。\n\n（3） **ウ**\nろ過の正しい操作のポイントは次の3つです：\n① ガラス棒に伝わらせて液を注ぐ（液はねを防ぐ）\n② ろうとの足の長い方を、ビーカーの内壁につける（液はねを防ぎ、ろ過を速やかに進める）\n③ ガラス棒の先は、ろ紙の重なっている部分（3重になっている側）にあてる（ろ紙の破損を防ぐ）\n\nこの3つを満たしているのが（ウ）です。",
              "surroundingKnowledge": [],
              "deepDiveTopics": []
            },
            {
              "id": "q_c1_2_A_2",
              "category": "物質の分離と精製 (2. 蒸留)",
              "text": "2 塩化ナトリウム（NaCl）水溶液から水を分離するため、枝付きフラスコとリービッヒ冷却器を用いて蒸留を行った。以下の問いに答えよ。\n\n<img src=\"/fig_distillation_setup.png\" alt=\"蒸留装置 ①〜⑤\" class=\"w-full max-w-md mx-auto my-4 rounded-lg shadow-sm border border-gray-200\" referrerPolicy=\"no-referrer\" />\n\n(1) 図の①～⑤の器具・物質の名前を答えよ。\n(2) 枝付きフラスコに入れる液量はどのくらいにするべきか。\n(3) 加熱する際、フラスコ内にあらかじめ「沸騰石」を入れるのはなぜか。理由を答えよ。\n(4) 温度計の球部を枝の近くに設置する理由を答えよ。「〜の温度をはかるため」という形で答えよ。\n(5) リービッヒ冷却器に流す冷却水は、「下から上」「上から下」のどちらに流すべきか。また、それはなぜか.理由を答えよ。\n(6) 留出液を集める三角フラスコをゴム栓等で密閉してはいけないのはなぜか。理由を答えよ。",
              "subQuestions": [
                {
                  "id": "q2_1_1",
                  "label": "(1) ①",
                  "type": "short_answer",
                  "correctAnswer": "枝付きフラスコ",
                  "correctAnswerRate": 85
                },
                {
                  "id": "q2_1_2",
                  "label": "(1) ②",
                  "type": "short_answer",
                  "correctAnswer": "リービッヒ冷却器",
                  "correctAnswerRate": 85
                },
                {
                  "id": "q2_1_3",
                  "label": "(1) ③",
                  "type": "short_answer",
                  "correctAnswer": "ガスバーナー",
                  "acceptedAnswers": [
                    "バーナー",
                    "ブンゼンバーナー"
                  ],
                  "correctAnswerRate": 85
                },
                {
                  "id": "q2_1_4",
                  "label": "(1) ④",
                  "type": "short_answer",
                  "correctAnswer": "アダプター",
                  "correctAnswerRate": 85
                },
                {
                  "id": "q2_1_5",
                  "label": "(1) ⑤",
                  "type": "short_answer",
                  "correctAnswer": "三角フラスコ",
                  "correctAnswerRate": 85
                },
                {
                  "id": "q2_2_volume",
                  "label": "(2)",
                  "type": "short_answer",
                  "correctAnswer": "半分以下",
                  "correctAnswerRate": 85
                },
                {
                  "id": "q2_3_stone",
                  "label": "(3)",
                  "type": "descriptive",
                  "correctAnswer": "突沸（急な沸騰）を防ぐため",
                  "gradingCriteria": [
                    "突沸",
                    "沸騰",
                    "防ぐ"
                  ],
                  "correctAnswerRate": 85
                },
                {
                  "id": "q2_4_thermometer",
                  "label": "(4)",
                  "type": "descriptive",
                  "correctAnswer": "枝に向かう蒸気の温度をはかるため",
                  "gradingCriteria": [
                    "蒸気",
                    "温度",
                    "はかる"
                  ],
                  "correctAnswerRate": 85
                },
                {
                  "id": "q2_5_direction",
                  "label": "(5) 向き",
                  "type": "multiple_choice",
                  "options": [
                    "下から上",
                    "上から下"
                  ],
                  "correctAnswer": "下から上",
                  "correctAnswerRate": 85
                },
                {
                  "id": "q2_5_reason",
                  "label": "(5) 理由",
                  "type": "descriptive",
                  "correctAnswer": "冷却器内を水で満たし、冷却効率を高くするため",
                  "gradingCriteria": [
                    "水で満たす",
                    "冷却効率"
                  ],
                  "correctAnswerRate": 85
                },
                {
                  "id": "q2_6_close",
                  "label": "(6)",
                  "type": "descriptive",
                  "correctAnswer": "装置内の圧力が上昇し、器具が破損して危険だから",
                  "gradingCriteria": [
                    "圧力",
                    "上昇",
                    "破損",
                    "危険"
                  ],
                  "correctAnswerRate": 85
                }
              ],
              "explanation": "▼解答・解説\n(1) ① 枝付きフラスコ ② リービッヒ冷却器 ③ ガスバーナー ④ アダプター ⑤ 三角フラスコ\n(2) 半分以下\n(3) 突沸（急な沸騰）を防ぐため\n(4) 枝に向かう蒸気の温度をはかるため\n(5) 下から上。理由：冷却器内を水で満たし、冷却効率を高くするため\n(6) 装置内の圧力が上昇し、器具が破損して危険だから",
              "surroundingKnowledge": [],
              "deepDiveTopics": []
            },
            {
              "id": "q_c1_2_A_3",
              "category": "物質の分離と精製 (3. 分留)",
              "text": "3 沸点の異なる2種類以上の「液体の混合物」から、加熱温度を変えて各成分に分離する操作に関する次の問いに答えよ。\n\n(1) この分離操作の名称を答えよ。\n(2) 原油（石油）をこの操作によって分離する際、精留塔から取り出される成分について、次のア〜オを、沸点が低く精留塔の「上から出てくる順」に正しく並べ替えよ。\n\nア：軽油　　イ：残油（重油など）　　ウ：石油ガス・LPガス　　エ：灯油　　オ：ナフサ（粗製ガソリン）",
              "subQuestions": [
                {
                  "id": "q3_1",
                  "label": "(1)",
                  "type": "short_answer",
                  "correctAnswer": "分留",
                  "correctAnswerRate": 85
                },
                {
                  "id": "q3_2",
                  "label": "(2)",
                  "type": "short_answer",
                  "correctAnswer": "ウオエア",
                  "correctAnswerRate": 85
                }
              ],
              "explanation": "▼解答・解説\n(1) 分留（分別蒸留）\n(2) ウ → オ → エ → ア → イ\n解説: 原油の分留（精留塔）は、「沸点の低いものほど上から出てくる（気体になりやすいから）」という順番を把握する問題です。上から順に「①石油ガス・LPガス → ②ナフサ（粗製ガソリン） → ③灯油 → ④軽油 → ⑤残油（重油など）」となります。",
              "surroundingKnowledge": [],
              "deepDiveTopics": []
            },
            {
              "id": "q_c1_2_A_4",
              "category": "物質の分離と精製 (4. 昇華法)",
              "text": "4 昇華法に関する次の問いに答えよ。\n\n<img src=\"/fig_sublimation_setups.png\" alt=\"昇華実験装置 ①〜④\" class=\"w-full max-w-lg mx-auto my-4 rounded-lg shadow-sm border border-gray-200\" referrerPolicy=\"no-referrer\" />\n\n（1）ヨウ素の昇華性を利用して、できるだけ多くのヨウ素を集めたい。最も適当な分離法を、上の図の①〜④のうちから1つ選べ。\n\n※選択肢の図の意味：\n①：丸底フラスコの上に冷却装置がなく、ヨウ素の蒸気が逃げてしまう\n②：丸底フラスコの上に「冷水」を入れた丸底フラスコを載せ、下から混合物を加熱して冷水フラスコの底にヨウ素を析出させる（適切）\n③：冷水の中に混合物を入れるだけで、加熱をしないため昇華が起きない\n④：丸底フラスコの上に「温水」を入れた丸底フラスコを載せているため、蒸気が冷却されない\n\n（2）次の中から、昇華されやすい物質をすべて選べ。\nア．塩化ナトリウム（食塩）　イ．ヨウ素　ウ．ドライアイス　エ．鉄　オ．ナフタレン　カ．水（氷）　キ．パラジクロロベンゼン",
              "subQuestions": [
                {
                  "id": "q_c1_2_A_4_1",
                  "label": "（1） ヨウ素を最も多く集められる方法",
                  "type": "multiple_choice",
                  "options": [
                    "①",
                    "②",
                    "③",
                    "④"
                  ],
                  "correctAnswer": "②",
                  "correctAnswerRate": 85
                },
                {
                  "id": "q_c1_2_A_4_2",
                  "label": "（2） 昇華されやすい物質をすべて選べ",
                  "type": "multiple_choice",
                  "options": [
                    "ア",
                    "イ",
                    "ウ",
                    "エ",
                    "オ",
                    "カ",
                    "キ"
                  ],
                  "correctAnswer": "イ、ウ、オ、キ",
                  "correctAnswerRate": 85
                }
              ],
              "explanation": "▼解答・解説\n（1）**②**\n昇華法は「昇華しやすい固体を加熱して気体にし、冷却面でふたたび固体に戻して集める」分離法です。そのため、①下に加熱、②上に冷却面（冷水を入れたフラスコの底）の組合せが必要です。\n①は上に冷却面がなく蒸気が逃げる、③は加熱していない、④は上が温水なので蒸気が冷えず固体に戻りません。\n\n（2）**イ、ウ、オ、キ**（ヨウ素、ドライアイス、ナフタレン、パラジクロロベンゼン）\n\n【覚えるべき昇華しやすい物質】\n① ヨウ素　② ドライアイス（CO₂）　③ ナフタレン　④ パラジクロロベンゼン　（⑤ 安息香酸）\n\nア（食塩）、エ（鉄）、カ（水）は昇華しません。",
              "surroundingKnowledge": [],
              "deepDiveTopics": []
            },
            {
              "id": "q_c1_2_A_5",
              "category": "物質の分離と精製 (5. 抽出)",
              "text": "5 抽出に関する次の問いに答えよ。\n\n目的の物質だけをよく溶かす溶媒を用いて、混合物から成分を分離する操作を抽出という。\n\n<img src=\"/fig_separating_funnel.png\" alt=\"分液漏斗\" class=\"w-full max-w-xs mx-auto my-4 rounded-lg shadow-sm border border-gray-200\" referrerPolicy=\"no-referrer\" />\n\n(1) ヨウ素と水の混合物（ヨウ素水溶液）からヨウ素を分離したい。このとき加える溶媒として最も適当なものを、次のア〜ウから選べ。\nア. エタノール　イ. ヘキサン　ウ. 食塩水\n\n(2) (1)の操作を行う際に用いる、図のようなガラス器具の名称を答えよ。\n\n(3) 茶葉に湯を注いで、香りや風味の成分を溶かしだす操作も抽出の一種である。このように、抽出は身近な生活でも利用されている。次のうち、抽出の原理を利用していないものを1つ選べ。\nア. コーヒー豆からコーヒーをいれる\nイ. 昆布からだしをとる\nウ. 海水から塩を取り出す",
              "subQuestions": [
                {
                  "id": "q5_1",
                  "label": "(1)",
                  "type": "multiple_choice",
                  "options": [
                    "ア",
                    "イ",
                    "ウ"
                  ],
                  "correctAnswer": "イ",
                  "correctAnswerRate": 85
                },
                {
                  "id": "q5_2",
                  "label": "(2)",
                  "type": "short_answer",
                  "correctAnswer": "分液漏斗",
                  "correctAnswerRate": 85
                },
                {
                  "id": "q5_3",
                  "label": "(3)",
                  "type": "multiple_choice",
                  "options": [
                    "ア",
                    "イ",
                    "ウ"
                  ],
                  "correctAnswer": "ウ",
                  "correctAnswerRate": 85
                }
              ],
              "explanation": "▼解答・解説\n(1) イ (ヘキサン)\n(2) 分液漏斗（ぶんえきろうと）\n(3) ウ (海水から塩を取り出すのは蒸発・再結晶などを利用)",
              "surroundingKnowledge": [],
              "deepDiveTopics": []
            },
            {
              "id": "q_c1_2_A_6",
              "category": "物質の分離と精製 (6. 再結晶)",
              "text": "6 再結晶に関する次の問いに答えよ。\n\n少量の不純物を含む固体を熱水などの溶媒に溶かし、冷却して純粋な結晶を得る方法を再結晶という。\n\n(1) 再結晶は、物質の何という性質が温度によって異なることを利用しているか。\n\n(2) 少量の硫酸銅(Ⅱ)五水和物を含む硝酸カリウムの固体を熱水に溶かし、冷却すると、主にどちらの結晶が析出するか。\nア. 硫酸銅(Ⅱ)五水和物\nイ. 硝酸カリウム",
              "subQuestions": [
                {
                  "id": "q6_1",
                  "label": "(1)",
                  "type": "short_answer",
                  "correctAnswer": "溶解度",
                  "correctAnswerRate": 85
                },
                {
                  "id": "q6_2",
                  "label": "(2)",
                  "type": "multiple_choice",
                  "options": [
                    "ア",
                    "イ"
                  ],
                  "correctAnswer": "イ",
                  "correctAnswerRate": 85
                }
              ],
              "explanation": "▼解答・解説\n(1) 溶解度\n(2) イ (硝酸カリウム)\n解説: 硝酸カリウムは温度による溶解度の差が非常に大きいため、冷却すると多量に析出します。一方、少量の不純物（硫酸銅）はまだ溶解度以下なので溶けたままとなり、分離できます。",
              "surroundingKnowledge": [],
              "deepDiveTopics": []
            },
            {
              "id": "q_c1_2_A_7",
              "category": "物質の分離と精製 (7. 分離法の記述正誤)",
              "text": "7 物質を分離する操作に関する記述として下線部が正しいものを、次の①〜⑤のうちから 1 つ選べ。\n\n① <u>溶媒に対する溶けやすさの差を利用して、混合物から特定の物質を溶媒に溶かして分離する操作を抽出</u>という。\n② <u>沸点の差を利用して、液体の混合物から成分を分離する操作を昇華法</u>という。\n③ <u>固体と液体の混合物から、ろ紙などを用いて固体を分離する操作を再結晶</u>という。\n④ <u>不純物を含む固体を溶媒に溶かし、温度によって溶解度が異なることを利用して、より純粋な物質を析出させ分離する操作をろ過</u>という。\n⑤ <u>固体の混合物を加熱して、固体から直接気体になる成分を冷却して分離する操作を蒸留</u>という。",
              "subQuestions": [
                {
                  "id": "q4_1_correct_statement",
                  "label": "正しい選択肢",
                  "type": "multiple_choice",
                  "options": [
                    "①",
                    "②",
                    "③",
                    "④",
                    "⑤"
                  ],
                  "correctAnswer": "①",
                  "correctAnswerRate": 85
                }
              ],
              "explanation": "▼解答・解説\n正解：①\n【修正案】\n② 蒸留（または分留）\n③ ろ過\n④ 再結晶\n⑤ 昇華法",
              "surroundingKnowledge": [],
              "deepDiveTopics": []
            },
            {
              "id": "q_c1_2_A_8",
              "category": "物質の分離と精製 (8. 操作に対応する分離法)",
              "text": "8 次の文章（1）〜（5）に関連する分離法の名称をそれぞれ答えよ。\n\n<img src=\"/fig_separating_funnel.png\" alt=\"分液漏斗（抽出）\" class=\"w-full max-w-xs mx-auto my-4 rounded-lg shadow-sm border border-gray-200\" referrerPolicy=\"no-referrer\" />\n\n(1) 少量の不純物を含む固体を熱水に溶かし、冷却して純粋な結晶を得る。\n(2) ヨウ素と水の混合物にヘキサンを加え、ヨウ素だけを溶かしだして分離する。\n(3) 砂とヨウ素の混合物を加熱し、ヨウ素だけを気体にしてから再び固体にして集める。\n(4) 水性ペンのインクを、ろ紙などに対する吸着力の違いを利用して分離する。\n(5) 茶葉に湯を注ぎ、香りや風味の成分を溶かしだす。",
              "subQuestions": [
                {
                  "id": "q5_1_recrystallization",
                  "label": "(1)",
                  "type": "short_answer",
                  "correctAnswer": "再結晶",
                  "correctAnswerRate": 85
                },
                {
                  "id": "q5_2_extraction",
                  "label": "(2)",
                  "type": "short_answer",
                  "correctAnswer": "抽出",
                  "correctAnswerRate": 85
                },
                {
                  "id": "q5_3_sublimation",
                  "label": "(3)",
                  "type": "short_answer",
                  "correctAnswer": "昇華法",
                  "correctAnswerRate": 85
                },
                {
                  "id": "q5_4_chromatography",
                  "label": "(4)",
                  "type": "short_answer",
                  "correctAnswer": "ペーパークロマトグラフィー",
                  "correctAnswerRate": 85
                },
                {
                  "id": "q5_5_extraction2",
                  "label": "(5)",
                  "type": "short_answer",
                  "correctAnswer": "抽出",
                  "correctAnswerRate": 85
                }
              ],
              "explanation": "▼解答・解説\n(1) 再結晶\n(2) 抽出\n(3) 昇華法\n(4) ペーパークロマトグラフィー\n(5) 抽出",
              "surroundingKnowledge": [],
              "deepDiveTopics": []
            }
          ],
          "miniTest": [
            {
              "id": "q_c1_2_A_mt_1",
              "category": "物質の分離と精製 (問1)",
              "text": "B　物質の分離と精製に関する次の文章を読み、あとの問いに答えよ。\n\n自然界に存在する物質の多くは混合物である。混合物から目的の物質を取り出す操作を ( ア ) といい、取り出した物質からさらに不純物を取り除いて純度を高める操作を ( イ ) という。物質の ( ア ) には、物質が持つ様々な性質（沸点、溶解度、吸着力など）の違いが利用される。\n\n液体とそれに溶けない固体の混合物は、ろ紙などを用いた ( ウ ) によって分けることができる。 また、溶液を加熱して沸騰させ、生じた蒸気を冷却して再び液体として取り出す方法を ( エ ) という。この ( エ ) の操作を行う際、使用する器具の名称や装置の組み立てには、いくつかの重要な注意点がある。\n\n沸点の異なる2種類以上の「液体の混合物」から、加熱温度を変えて各成分に分離する操作は特に ( オ ) と呼ばれ、液体空気の分離や原油の精製などに用いられる。\n\n固体物質の分離にも様々な方法がある。少量の不純物を含む固体を熱水などに溶かし、冷却して温度による ( カ ) の違いを利用して純粋な結晶を得る方法を ( キ ) という。また、目的の物質だけをよく溶かす溶媒を用いて混合物から成分を分離する方法を ( ク ) といい、物質の ( ケ ) の違いを利用して分離する方法を ( コ ) という。さらに、ドライアイスやヨウ素のように、固体が液体を経ずに直接気体になる性質を利用して分離する方法を ( サ ) という。\n\n問1 文章中の空欄 ( ア ) ～ ( サ ) に入る最も適切な語句を答えよ。",
              "subQuestions": [
                {
                  "id": "q1_a",
                  "label": "問1 (ア)",
                  "type": "short_answer",
                  "correctAnswer": "分離",
                  "correctAnswerRate": 85
                },
                {
                  "id": "q1_b",
                  "label": "問1 (イ)",
                  "type": "short_answer",
                  "correctAnswer": "精製",
                  "correctAnswerRate": 85
                },
                {
                  "id": "q1_c",
                  "label": "問1 (ウ)",
                  "type": "short_answer",
                  "correctAnswer": "ろ過",
                  "correctAnswerRate": 85
                },
                {
                  "id": "q1_d",
                  "label": "問1 (エ)",
                  "type": "short_answer",
                  "correctAnswer": "蒸留",
                  "correctAnswerRate": 85
                },
                {
                  "id": "q1_e",
                  "label": "問1 (オ)",
                  "type": "short_answer",
                  "correctAnswer": "分留",
                  "correctAnswerRate": 85
                },
                {
                  "id": "q1_f",
                  "label": "問1 (カ)",
                  "type": "short_answer",
                  "correctAnswer": "溶解度",
                  "correctAnswerRate": 85
                },
                {
                  "id": "q1_g",
                  "label": "問1 (キ)",
                  "type": "short_answer",
                  "correctAnswer": "再結晶",
                  "correctAnswerRate": 85
                },
                {
                  "id": "q1_h",
                  "label": "問1 (ク)",
                  "type": "short_answer",
                  "correctAnswer": "抽出",
                  "correctAnswerRate": 85
                },
                {
                  "id": "q1_i",
                  "label": "問1 (ケ)",
                  "type": "short_answer",
                  "correctAnswer": "吸着力",
                  "correctAnswerRate": 85
                },
                {
                  "id": "q1_j",
                  "label": "問1 (コ)",
                  "type": "short_answer",
                  "correctAnswer": "クロマトグラフィー",
                  "correctAnswerRate": 85
                },
                {
                  "id": "q1_k",
                  "label": "問1 (サ)",
                  "type": "short_answer",
                  "correctAnswer": "昇華法",
                  "correctAnswerRate": 85
                }
              ],
              "explanation": "問1 (ア) 分離　(イ) 精製　(ウ) ろ過　(エ) 蒸留　(オ) 分留 (カ) 溶解度　(キ) 再結晶　(ク) 抽出　(ケ) 吸着力　(コ) クロマトグラフィー　(サ) 昇華法\n解説: 分離と精製の基本用語です。「分離（取り出す）」と「精製（さらに純度を高める）」の違いや、それぞれの分離法が「物質の何の性質の違い（沸点、溶解度など）を利用しているか」はテストでよく狙われるのでセットで覚えておきましょう。",
              "surroundingKnowledge": [],
              "deepDiveTopics": []
            },
            {
              "id": "q_c1_2_A_mt_2",
              "category": "物質の分離と精製 (問2)",
              "text": "B　（リード文続き）\n...液体とそれに溶けない固体の混合物は、ろ紙などを用いた ( ウ: ろ過 ) によって分けることができる。\n\n問2 ( ウ ) の操作（ろ過）を行う際の注意点について、次の(1)・(2)の理由を簡潔に答えよ。\n(1) 液体をろうとに注ぐ際、直接注がずにガラス棒を伝わらせて注ぐのはなぜか。\n(2) ろうとの足の先端は、受け器のビーカーの内壁に密着させるようにして置くのはなぜか。",
              "subQuestions": [
                {
                  "id": "q2_1_reason",
                  "label": "問2 (1) 理由",
                  "type": "descriptive",
                  "correctAnswer": "液体が周囲に飛び散るのを防ぐため",
                  "gradingCriteria": [
                    "液体が周囲に飛び散るのを防ぐため"
                  ],
                  "correctAnswerRate": 85
                },
                {
                  "id": "q2_2_reason",
                  "label": "問2 (2) 理由",
                  "type": "descriptive",
                  "correctAnswer": "ろ過された液体が壁面を伝わってスムーズに落ちるようにするため",
                  "gradingCriteria": [
                    "ろ過された液体が壁面を伝わってスムーズに落ちるようにするため"
                  ],
                  "correctAnswerRate": 85
                }
              ],
              "explanation": "問2 (1) 液体が周囲に飛び散るのを防ぐため。 (2) ろ過された液体が壁面を伝わってスムーズに落ちるようにするため。（液体の飛び散りを防ぎ、ろ過の速度を速める効果がある）\n解説: ろ紙の注意点としてプリントに記載されている内容です。(2)については、ろうとの先をビーカーの内壁につけることで、液体の表面張力が働き、ポタポタ落ちるよりもスピーディーにろ過できるメリットもあります。",
              "surroundingKnowledge": [],
              "deepDiveTopics": []
            },
            {
              "id": "q_c1_2_A_mt_3",
              "category": "物質の分離と精製 (問3)",
              "text": "B　（リード文続き）\n...また、溶液を加熱して沸騰させ、生じた蒸気を冷却して再び液体として取り出す方法を ( エ: 蒸留 ) という。この ( エ ) の操作を行う際、使用する器具の名称や装置の組み立てには、いくつかの重要な注意点がある。\n\n<img src=\"/graph2.jpg\" alt=\"蒸留装置\" class=\"w-full max-w-md mx-auto my-4 rounded-lg shadow-sm border border-gray-200\" referrerPolicy=\"no-referrer\" />\n\n問3 ( エ ) の操作（蒸留）に用いる装置について、次の(1)〜(6)の問いに答えよ。\n(1)　図のA～Dの器具の名称を記せ。\n(2)　この図ではDの位置が間違っている。正しくは枝付きフラスコのどこに温度計を持ってくるべきか。\n(3)　Bの器具の冷却水はどの方向（「上から下」または「下から上」）に流すべきか。また、そのように流す理由を簡潔に答えよ。\n(4)　三角フラスコは、密栓してはならない。その理由を簡潔に答えよ。\n(5)　Aの器具に入れている沸騰石の役割を答えよ。\n(6)  Aの器具に入れる液体の量はどれぐらいにすればよいか答えよ。",
              "subQuestions": [
                {
                  "id": "q3_1_A",
                  "label": "問3 (1) A",
                  "type": "short_answer",
                  "correctAnswer": "枝付きフラスコ",
                  "correctAnswerRate": 85
                },
                {
                  "id": "q3_1_B",
                  "label": "問3 (1) B",
                  "type": "short_answer",
                  "correctAnswer": "リービッヒ冷却器",
                  "correctAnswerRate": 85
                },
                {
                  "id": "q3_1_C",
                  "label": "問3 (1) C",
                  "type": "short_answer",
                  "correctAnswer": "三角フラスコ",
                  "correctAnswerRate": 85
                },
                {
                  "id": "q3_1_D",
                  "label": "問3 (1) D",
                  "type": "short_answer",
                  "correctAnswer": "温度計",
                  "correctAnswerRate": 85
                },
                {
                  "id": "q3_2",
                  "label": "問3 (2) 位置",
                  "type": "short_answer",
                  "correctAnswer": "枝の付け根付近",
                  "correctAnswerRate": 85
                },
                {
                  "id": "q3_3_dir",
                  "label": "問3 (3) 方向",
                  "type": "short_answer",
                  "correctAnswer": "下から上",
                  "correctAnswerRate": 85
                },
                {
                  "id": "q3_3_reason",
                  "label": "問3 (3) 理由",
                  "type": "descriptive",
                  "correctAnswer": "冷却効率を高めるため",
                  "gradingCriteria": [
                    "冷却効率を高めるため"
                  ],
                  "correctAnswerRate": 85
                },
                {
                  "id": "q3_4",
                  "label": "問3 (4) 理由",
                  "type": "descriptive",
                  "correctAnswer": "圧力が上昇して危険だから",
                  "gradingCriteria": [
                    "圧力が上昇して危険だから"
                  ],
                  "correctAnswerRate": 85
                },
                {
                  "id": "q3_5",
                  "label": "問3 (5) 役割",
                  "type": "descriptive",
                  "correctAnswer": "突沸を防ぐため",
                  "gradingCriteria": [
                    "突沸を防ぐため"
                  ],
                  "correctAnswerRate": 85
                },
                {
                  "id": "q3_6",
                  "label": "問3 (6) 量",
                  "type": "descriptive",
                  "correctAnswer": "半分以下",
                  "gradingCriteria": [
                    "半分以下"
                  ],
                  "correctAnswerRate": 85
                }
              ],
              "explanation": "問3\n(1) A：枝付きフラスコ　B：リービッヒ冷却器　C：三角フラスコ　D：温度計\n(2) 枝の付け根付近\n(3) 方向：下から上 　 理由：冷却器内を水で満たすため。\n(4) 三角フラスコ内の圧力が上昇して危険だから。\n(5) 突沸（急な沸騰）を防ぐため。\n(6) 液量は半分以下にする。\n解説: 蒸留装置のセッティングは記述問題で頻出です。(1)の器具の名前は確実に書けるようにしておきましょう。(2)の図は、温度計が液体の温度を測ってしまっている「よくある間違い図」です。測りたいのは「今まさに枝に向かっている蒸気の温度」なので、枝の付け根付近が正解です。",
              "surroundingKnowledge": [],
              "deepDiveTopics": []
            },
            {
              "id": "q_c1_2_A_mt_4",
              "category": "物質の分離と精製 (問4)",
              "text": "B　（リード文続き）\n...沸点の異なる2種類以上の「液体の混合物」から、加熱温度を変えて各成分に分離する操作は特に ( オ: 分留 ) と呼ばれ、液体空気の分離や原油の精製などに用いられる。\n\n問4 原油（石油）を ( オ ) によって分離する際、精留塔から取り出される成分について次の問いに答えよ。上のア〜オを、沸点が低く精留塔の「上から出てくる順」に正しく並べ替えよ。\n ア：軽油　　イ：残油（重油など）　　ウ：石油ガス・LPガス　　エ：灯油　　オ：ナフサ（粗製ガソリン）",
              "subQuestions": [
                {
                  "id": "q4_order",
                  "label": "問4 順序",
                  "type": "short_answer",
                  "correctAnswer": "ウオエア",
                  "correctAnswerRate": 85
                }
              ],
              "explanation": "問4 ウ → オ → エ → ア → イ\n解説: 原油の分留（精留塔）は、「沸点の低いものほど上から出てくる（気体になりやすいから）」という順番を把握する問題です。上から順に「①石油ガス・LPガス → ②ナフサ（粗製ガソリン） → ③灯油 → ④軽油 → ⑤残油（重油など）」となります。",
              "surroundingKnowledge": [],
              "deepDiveTopics": []
            },
            {
              "id": "q_c1_2_A_mt_5",
              "category": "物質の分離と精製 (問5)",
              "text": "B　（リード文続き）\n...固体物質の分離にも様々な方法がある。少量の不純物を含む固体を熱水などに溶かし、冷却して温度による ( カ ) の違いを利用して純粋な結晶を得る方法を ( キ ) という。また、目的の物質だけをよく溶かす溶媒を用いて混合物から成分を分離する方法を ( ク ) といい、物質の ( ケ ) の違いを利用して分離する方法を ( コ ) という。さらに、ドライアイスやヨウ素のように、固体が液体を経ずに直接気体になる性質を利用して分離する方法を ( サ ) という。\n\n問5 次の (a) ～ (f) の混合物を分離・精製するのに最も適した方法の名称をそれぞれ答えよ。\n(a) ヨウ素とヨウ化カリウムを含む水溶液から、特定の溶媒を加えてヨウ素だけを溶かし出す。\n(b) 水性インクのシミがついたろ紙の先端を水に浸し、各色素の移動速度の違いを利用して分ける。\n(c) 砂が混ざったヨウ素を加熱し、ヨウ素の気体を冷却して取り出す。\n(d) 少量の硫酸銅(Ⅱ)五水和物を含む硝酸カリウムの固体を熱水に溶かし、その後ゆっくりと冷却する。\n(e) 塩化ナトリウム水溶液（食塩水）を加熱し、純粋な水を取り出す。\n(f) 茶葉に熱湯を注ぎ、お茶の成分を溶かし出す。",
              "subQuestions": [
                {
                  "id": "q5_a",
                  "label": "問5 (a)",
                  "type": "short_answer",
                  "correctAnswer": "抽出",
                  "correctAnswerRate": 85
                },
                {
                  "id": "q5_b",
                  "label": "問5 (b)",
                  "type": "short_answer",
                  "correctAnswer": "クロマトグラフィー",
                  "correctAnswerRate": 85
                },
                {
                  "id": "q5_c",
                  "label": "問5 (c)",
                  "type": "short_answer",
                  "correctAnswer": "昇華法",
                  "correctAnswerRate": 85
                },
                {
                  "id": "q5_d",
                  "label": "問5 (d)",
                  "type": "short_answer",
                  "correctAnswer": "再結晶",
                  "correctAnswerRate": 85
                },
                {
                  "id": "q5_e",
                  "label": "問5 (e)",
                  "type": "short_answer",
                  "correctAnswer": "蒸留",
                  "correctAnswerRate": 85
                },
                {
                  "id": "q5_f",
                  "label": "問5 (f)",
                  "type": "short_answer",
                  "correctAnswer": "抽出",
                  "correctAnswerRate": 85
                }
              ],
              "explanation": "問5\n(a) 抽出\n(b) クロマトグラフィー（または ペーパークロマトグラフィー）\n(c) 昇華法\n(d) 再結晶\n(e) 蒸留\n(f) 抽出\n解説: プリント右側の表に載っている具体例から分離法を当てる頻出問題です。(a)と(f)は「適切な溶媒を加えて、目的の物質だけを分離する」ので抽出です。(c)のヨウ素やナフタレン、ドライアイスは「昇華しやすい物質」のため昇華法を選びます。(d)は温度による溶解度変化を利用する再結晶です。",
              "surroundingKnowledge": [],
              "deepDiveTopics": []
            }
          ]
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
          "practiceProblems": [
            {
              "id": "q_c1_2_B_1",
              "category": "物質の構成と成分元素の検出 (1)",
              "text": "【1】次の同素体についての問いに答えよ。\n\n(1) 次の記述にあてはまる同素体の名称を答えよ。\n① 硫黄（S）の同素体のうち、常温で最も安定しているものはどれか。\n② 炭素（C）の同素体のうち、柔らかくて電気を通し、鉛筆の芯などに使われるものは何か。\n③ 炭素（C）の同素体で、サッカーボールのような形をしており、有機溶媒に溶けるものは何か。\n④ 酸素（O）の同素体であるオゾン（O₃）の「色」と「においの特徴」をそれぞれ答えよ。\n⑤ リン（P）の同素体のうち、猛毒で自然発火する危険があるため、水中に保存するものは何か。\n⑥ リン（P）の同素体のうち、ほぼ無毒で、マッチの側薬などに使われるものは何か。\n\n(2) 互いに同素体の関係にある組み合わせを、次の（ア）〜（カ）のうちからすべて選び、記号で答えよ。\n（ア）ネオンとアルゴン\n（イ）赤リンと黄リン\n（ウ）ゴム状硫黄と単斜硫黄\n（エ）氷と水\n（オ）カーボンナノチューブとダイヤモンド\n（カ）ネオンとアルゴン",
              "subQuestions": [
                {
                  "id": "q_c1_2_B_1_1_1",
                  "label": "(1) ① 硫黄(S)の最も安定な同素体",
                  "type": "short_answer",
                  "correctAnswer": "斜方硫黄",
                  "correctAnswerRate": 85
                },
                {
                  "id": "q_c1_2_B_1_1_2",
                  "label": "(1) ② 炭素(C)の鉛筆の芯に使われる同素体",
                  "type": "short_answer",
                  "correctAnswer": "黒鉛",
                  "correctAnswerRate": 85
                },
                {
                  "id": "q_c1_2_B_1_1_3",
                  "label": "(1) ③ 炭素(C)のサッカーボール状の同素体",
                  "type": "short_answer",
                  "correctAnswer": "フラーレン",
                  "correctAnswerRate": 85
                },
                {
                  "id": "q_c1_2_B_1_1_4_color",
                  "label": "(1) ④ オゾンの色",
                  "type": "short_answer",
                  "correctAnswer": "淡青色",
                  "correctAnswerRate": 85
                },
                {
                  "id": "q_c1_2_B_1_1_4_smell",
                  "label": "(1) ④ オゾンのにおいの特徴",
                  "type": "short_answer",
                  "correctAnswer": "特異臭",
                  "correctAnswerRate": 85
                },
                {
                  "id": "q_c1_2_B_1_1_5",
                  "label": "(1) ⑤ リン(P)の水中保存する同素体",
                  "type": "short_answer",
                  "correctAnswer": "黄リン",
                  "correctAnswerRate": 85
                },
                {
                  "id": "q_c1_2_B_1_1_6",
                  "label": "(1) ⑥ リン(P)のマッチの側薬に使われる同素体",
                  "type": "short_answer",
                  "correctAnswer": "赤リン",
                  "correctAnswerRate": 85
                },
                {
                  "id": "q_c1_2_B_1_2",
                  "label": "(2) 同素体の組み合わせ（すべて）",
                  "type": "short_answer",
                  "correctAnswer": "イ、ウ、オ",
                  "correctAnswerRate": 85
                }
              ],
              "explanation": "【解答・解説】\n(1)\n① 斜方硫黄 （常温で最も安定な黄色の結晶です）\n② 黒鉛 （別名グラファイト。柔らかく電気をよく通します）\n③ フラーレン （C₆₀などがあり、サッカーボール状の分子構造です。有機溶媒に溶けます）\n④ 色：淡青色、におい：特異臭\n⑤ 黄リン （猛毒で自然発火するため水中に保存します）\n⑥ 赤リン （ほぼ無毒で、マッチの側薬に使われます）\n\n(2) イ、ウ、オ\n解説:\n・同素体とは、同じ元素の単体で、性質の異なる物質どうしのことです。頭文字「S, C, O, P（スコップ）」の4元素が代表例です。\n・イ（赤リンと黄リン：リンP）、ウ（ゴム状硫黄と単斜硫黄：硫黄S）、オ（カーボンナノチューブとダイヤモンド：炭素C）が同素体の関係にあります。\n・ア、カは異なる元素（ネオンとアルゴン）、エは同一物質の状態変化（氷と水：いずれもH₂O）なので同素体ではありません。",
              "surroundingKnowledge": [],
              "deepDiveTopics": []
            },
            {
              "id": "q_c1_2_B_2",
              "category": "物質の構成と成分元素の検出 (2-1)",
              "text": "【2】問1 硫黄、炭素、酸素、リンの性質について次の問いに答えよ。\n\n(1) 硫黄(S)の同素体を3つ、名称で答えよ。また、そのうち「常温で安定で黄色」のもの、「淡黄色で針状」のものをそれぞれ選べ。\n(2) 炭素(C)的同素体を4つ、名称で答えよ。また、そのうち「非常に硬く電気を通さない」もの、「やわらかく電気をよく導く」ものをそれぞれ選べ。\n(3) 酸素(O)の同素体である「オゾン」は、どのような色とにおいをもつか。それぞれ簡潔に答えよ。\n(4) リン(P)の同素体のうち、猛毒で自然発火するため「水中に保存」するものは何か。また、毒性が低く「マッチの側薬」などに使われるものは何か。名称で答えよ。",
              "subQuestions": [
                {
                  "id": "q_c1_2_B_2_1_stable",
                  "label": "問1 (1) 常温で安定な硫黄",
                  "type": "short_answer",
                  "correctAnswer": "斜方硫黄",
                  "correctAnswerRate": 85
                },
                {
                  "id": "q_c1_2_B_2_1_needle",
                  "label": "問1 (1) 針状の硫黄",
                  "type": "short_answer",
                  "correctAnswer": "単斜硫黄",
                  "correctAnswerRate": 85
                },
                {
                  "id": "q_c1_2_B_2_2_hard",
                  "label": "問1 (2) 非常に硬い炭素",
                  "type": "short_answer",
                  "correctAnswer": "ダイヤモンド",
                  "correctAnswerRate": 85
                },
                {
                  "id": "q_c1_2_B_2_2_soft",
                  "label": "問1 (2) 電気を通す炭素",
                  "type": "short_answer",
                  "correctAnswer": "黒鉛",
                  "correctAnswerRate": 85
                },
                {
                  "id": "q_c1_2_B_2_3_color",
                  "label": "問1 (3) オゾンの色",
                  "type": "short_answer",
                  "correctAnswer": "淡青色",
                  "correctAnswerRate": 85
                },
                {
                  "id": "q_c1_2_B_2_3_smell",
                  "label": "問1 (3) オゾンのにおい",
                  "type": "short_answer",
                  "correctAnswer": "特異臭",
                  "correctAnswerRate": 85
                },
                {
                  "id": "q_c1_2_B_2_4_poison",
                  "label": "問1 (4) リンの水中に保存するもの",
                  "type": "short_answer",
                  "correctAnswer": "黄リン",
                  "correctAnswerRate": 85
                },
                {
                  "id": "q_c1_2_B_2_4_match",
                  "label": "問1 (4) リンのマッチの側薬に使うもの",
                  "type": "short_answer",
                  "correctAnswer": "赤リン",
                  "correctAnswerRate": 85
                }
              ],
              "explanation": "【解答・解説】\n問1\n(1) 同素体：斜方硫黄、単斜硫黄、ゴム状硫黄\n常温で安定で黄色：斜方硫黄\n淡黄色で針状：単斜硫黄\n(2) 同素体：ダイヤモンド、黒鉛、フラーレン、カーボンナノチューブ\n非常に硬く電気を通さない：ダイヤモンド\nやわらかく電気をよく導く：黒鉛\n(3) 色：淡青色　におい：特異臭\n(4) 水中に保存：黄リン 　マッチの側薬：赤リン\n\n解説: プリントに書かれている同素体の特徴（色や硬さ、保存方法）はテストで頻出です。特にリンの保存方法と、硫黄の「斜方」「単斜」の違いは確実に覚えておきましょう。",
              "surroundingKnowledge": [],
              "deepDiveTopics": []
            },
            {
              "id": "q_c1_2_B_3",
              "category": "物質の構成と成分元素の検出 (2-2)",
              "text": "【2】問2 次の元素が含まれる物質を炎の中に入れたとき、それぞれ何色の炎になるか答えよ。\n\n(1) Li （リチウム）\n(2) Na （ナトリウム）\n(3) K （カリウム）\n(4) Cu （銅）\n(5) Ca （カルシウム）\n(6) Sr （ストロンチウム）\n(7) Ba （バリウム）",
              "subQuestions": [
                {
                  "id": "q_c1_2_B_3_1",
                  "label": "(1) Li",
                  "type": "short_answer",
                  "correctAnswer": "赤",
                  "correctAnswerRate": 85
                },
                {
                  "id": "q_c1_2_B_3_2",
                  "label": "(2) Na",
                  "type": "short_answer",
                  "correctAnswer": "黄",
                  "correctAnswerRate": 85
                },
                {
                  "id": "q_c1_2_B_3_3",
                  "label": "(3) K",
                  "type": "short_answer",
                  "correctAnswer": "紫",
                  "correctAnswerRate": 85
                },
                {
                  "id": "q_c1_2_B_3_4",
                  "label": "(4) Cu",
                  "type": "short_answer",
                  "correctAnswer": "青緑",
                  "correctAnswerRate": 85
                },
                {
                  "id": "q_c1_2_B_3_5",
                  "label": "(5) Ca",
                  "type": "short_answer",
                  "correctAnswer": "橙",
                  "correctAnswerRate": 85
                },
                {
                  "id": "q_c1_2_B_3_6",
                  "label": "(6) Sr",
                  "type": "short_answer",
                  "correctAnswer": "紅",
                  "correctAnswerRate": 85
                },
                {
                  "id": "q_c1_2_B_3_7",
                  "label": "(7) Ba",
                  "type": "short_answer",
                  "correctAnswer": "黄緑",
                  "correctAnswerRate": 85
                }
              ],
              "explanation": "【解答・解説】\n問2\n(1) 赤 （赤色）\n(2) 黄 （黄色）\n(3) 紫 （紫色）\n(4) 青緑 （青緑色）\n(5) 橙 （橙色）\n(6) 紅 （紅色）\n(7) 黄緑 （黄緑色）\n\n解説: 「リアカー(Li赤) 無き(Na黄、K紫) 動力(Cu青緑) 借りるとう(Ca橙) するもくれない(Sr紅) 馬力(Ba黄緑)」で確実に暗記します。",
              "surroundingKnowledge": [],
              "deepDiveTopics": []
            },
            {
              "id": "q_c1_2_B_4",
              "category": "物質の構成と成分元素の検出 (3)",
              "text": "【3】次の（あ）～（う）の文章を読んで、化合物A、B、Cにそれぞれ含まれる元素を、元素記号ですべて推定せよ。\n\n（あ）ある化合物Aの水溶液の炎色反応を調べると、青緑色を呈した。次に、この水溶液に酢酸鉛（Ⅱ）水溶液を加えると、黒色沈殿を生じた。\n\n（い）ある化合物Bを加熱すると、無色の気体と無色の液体を生じた。気体は石灰水を白濁させ、液体は白色の硫酸銅（Ⅱ）無水塩に触れると青色に変化した。また、元の化合物 B の炎色反応を調べると、橙色を呈した。\n\n（う）ある化合物Cの水溶液の炎色反応を調べると、赤紫色（紫）を呈した。次に、この水溶液に硝酸銀水溶液を加えると、白色沈殿を生じた。",
              "subQuestions": [
                {
                  "id": "q_c1_2_B_4_A_metal",
                  "label": "化合物Aに含まれる金属元素の元素記号",
                  "type": "short_answer",
                  "correctAnswer": "Cu",
                  "correctAnswerRate": 85
                },
                {
                  "id": "q_c1_2_B_4_A_nonmetal",
                  "label": "化合物Aに含まれる非金属元素の元素記号",
                  "type": "short_answer",
                  "correctAnswer": "S",
                  "correctAnswerRate": 85
                },
                {
                  "id": "q_c1_2_B_4_B_metal",
                  "label": "化合物Bに含まれる金属元素の元素記号",
                  "type": "short_answer",
                  "correctAnswer": "Ca",
                  "correctAnswerRate": 85
                },
                {
                  "id": "q_c1_2_B_4_B_nonmetal1",
                  "label": "化合物Bに含まれる、気体（石灰水を白濁）を構成する非金属元素の元素記号",
                  "type": "short_answer",
                  "correctAnswer": "C",
                  "correctAnswerRate": 85
                },
                {
                  "id": "q_c1_2_B_4_B_nonmetal2",
                  "label": "化合物Bに含まれる、液体（水を生成）を構成する非金属元素の元素記号",
                  "type": "short_answer",
                  "correctAnswer": "H",
                  "correctAnswerRate": 85
                },
                {
                  "id": "q_c1_2_B_4_C_metal",
                  "label": "化合物Cに含まれる金属元素の元素記号",
                  "type": "short_answer",
                  "correctAnswer": "K",
                  "correctAnswerRate": 85
                },
                {
                  "id": "q_c1_2_B_4_C_nonmetal",
                  "label": "化合物Cに含まれる非金属元素の元素記号",
                  "type": "short_answer",
                  "correctAnswer": "Cl",
                  "correctAnswerRate": 85
                }
              ],
              "explanation": "【解答・解説】\n化合物A：Cu, S\n化合物B：Ca, C, H\n化合物C：K, Cl\n\n解説:\n（あ）青緑色の炎色反応を示す金属元素は「銅（Cu）」です。また、酢酸鉛(Ⅱ)水溶液を加えて黒色沈殿（硫化鉛 PbS）が生じることから、非金属元素の「硫黄（S）」が含まれていることがわかります。\n\n（い）発生した気体が石灰水を白濁（炭酸カルシウム CaCO₃ 生成）させたことから「炭素（C）」元素、発生した液体が白色の硫酸銅(Ⅱ)無水塩を青色（硫酸銅(Ⅱ)五水和物 CuSO₄・5H₂O 生成）に変えた（=水である）ことから「水素（H）」元素が含まれていると判定できます。また、元の化合物 B の炎色反応が橙色であることから、金属元素の「カルシウム（Ca）」が含まれていることがわかります。\n\n（う）赤紫色（紫）の炎色反応を示す金属元素は「カリウム（K）」です。また、硝酸銀水溶液を加えて白色沈殿（塩化銀 AgCl）が生じたことから、非金属元素の「塩素（Cl）」が含まれていることがわかります。",
              "surroundingKnowledge": [],
              "deepDiveTopics": []
            },
            {
              "id": "q_c1_2_B_5",
              "category": "物質の構成と成分元素の検出 (4)",
              "text": "【4】次の問いに答えよ。\n\n(1) 二酸化炭素を石灰水（水酸化カルシウム水溶液）に通して白濁したとき、生じている白色の沈殿物の名称と、その化学式を答えよ。\n(2) 液体（水）が触れたとき、硫酸銅(Ⅱ)無水塩は何色から何色に変化するか。\n(3) 水の確認には、青色の塩化コバルト紙を用いることもできる。水に触れると塩化コバルト紙は何色に変化するか。\n(4) 水溶液に硝酸銀(AgNO₃)水溶液を加えたときに生じる「白色沈殿」の物質の名称と、その化学式を答えよ。\n(5) 水溶液中の硫黄(S)元素を検出するためには、酢酸鉛(Ⅱ)水溶液を加える。このとき生じる沈殿の色と、その沈殿物の化学式を答えよ。",
              "subQuestions": [
                {
                  "id": "q_c1_2_B_5_1_name",
                  "label": "(1) 白色の沈殿物の名称",
                  "type": "short_answer",
                  "correctAnswer": "炭酸カルシウム",
                  "correctAnswerRate": 85
                },
                {
                  "id": "q_c1_2_B_5_1_chem",
                  "label": "(1) 沈殿物の化学式",
                  "type": "short_answer",
                  "correctAnswer": "CaCO3",
                  "correctAnswerRate": 85
                },
                {
                  "id": "q_c1_2_B_5_2_color",
                  "label": "(2) 硫酸銅(Ⅱ)無水塩の色変化",
                  "type": "descriptive",
                  "correctAnswer": "白色から青色",
                  "gradingCriteria": [
                    "白色",
                    "青色"
                  ],
                  "correctAnswerRate": 85
                },
                {
                  "id": "q_c1_2_B_5_3_color",
                  "label": "(3) 塩化コバルト紙の色変化",
                  "type": "short_answer",
                  "correctAnswer": "赤色",
                  "correctAnswerRate": 85
                },
                {
                  "id": "q_c1_2_B_5_4_name",
                  "label": "(4) 生じる白色沈殿の名称",
                  "type": "short_answer",
                  "correctAnswer": "塩化銀",
                  "correctAnswerRate": 85
                },
                {
                  "id": "q_c1_2_B_5_4_chem",
                  "label": "(4) 白色沈殿の化学式",
                  "type": "short_answer",
                  "correctAnswer": "AgCl",
                  "correctAnswerRate": 85
                },
                {
                  "id": "q_c1_2_B_5_5_color",
                  "label": "(5) 生じる沈殿の色",
                  "type": "short_answer",
                  "correctAnswer": "黒色",
                  "correctAnswerRate": 85
                },
                {
                  "id": "q_c1_2_B_5_5_chem",
                  "label": "(5) 沈殿物の化学式",
                  "type": "short_answer",
                  "correctAnswer": "PbS",
                  "correctAnswerRate": 85
                }
              ],
              "explanation": "【解答・解説】\n(1) 炭酸カルシウム 　化学式：CaCO₃\n二酸化炭素を石灰水に通すと、水に溶けにくい炭酸カルシウムの白色沈殿が生じるため、全体が白く濁ります。\n\n(2) 白色から青色\n硫酸銅(Ⅱ)無水塩（白色粉末）は水分子を取り込むと硫酸銅(Ⅱ)五水和物（青色結晶）になります。\n\n(3) 赤色（または 桃色）\n乾燥状態では青色をしていますが、水に触れると水分を吸収して赤色（桃色）へと変化します。\n\n(4) 塩化銀 　化学式：AgCl\n水溶液中に塩素イオン(Cl⁻)が存在する場合、硝酸銀水溶液を加えると、銀イオン(Ag⁺)と結びついて水に溶けにくい塩化銀の白色沈殿が生じます。\n\n(5) 黒色 　化学式：PbS\n硫黄元素を含むイオンに鉛イオン(Pb²⁺)を反応させると、硫化鉛(Ⅱ)の黒色沈殿が生じます。",
              "surroundingKnowledge": [],
              "deepDiveTopics": []
            }
          ],
          "miniTest": [
            {
              "id": "q_c1_2_B_mt_1",
              "category": "物質の構成と成分元素の検出 (1)",
              "text": "【1】次の同素体についての問いに答えよ。\n\n(1) 次の記述にあてはまる同素体の名称を答えよ。\n① 硫黄（S）の同素体のうち、常温で最も安定しているものはどれか。\n② 炭素（C）の同素体のうち、柔らかくて電気を通し、鉛筆の芯などに使われるものは何か。\n③ 炭素（C）の同素体で、サッカーボールのような形をしており、有機溶媒に溶けるものは何か。\n④ 酸素（O）の同素体であるオゾン（O₃）の「色」と「においの特徴」をそれぞれ答えよ。\n⑤ リン（P）の同素体のうち、猛毒で自然発火する危険があるため、水中に保存するものは何か。\n⑥ リン（P）の同素体のうち、ほぼ無毒で、マッチの側薬などに使われるものは何か。\n\n(2) 互いに同素体の関係にある組み合わせを、次の（ア）〜（カ）のうちからすべて選び、記号で答えよ。\n（ア）ネオンとアルゴン\n（イ）赤リンと黄リン\n（ウ）ゴム状硫黄と単斜硫黄\n（エ）氷と水\n（オ）カーボンナノチューブとダイヤモンド\n（カ）ネオンとアルゴン",
              "subQuestions": [
                {
                  "id": "q_c1_2_B_1_1_1",
                  "label": "(1) ① 硫黄(S)の最も安定な同素体",
                  "type": "short_answer",
                  "correctAnswer": "斜方硫黄",
                  "correctAnswerRate": 85
                },
                {
                  "id": "q_c1_2_B_1_1_2",
                  "label": "(1) ② 炭素(C)の鉛筆の芯に使われる同素体",
                  "type": "short_answer",
                  "correctAnswer": "黒鉛",
                  "correctAnswerRate": 85
                },
                {
                  "id": "q_c1_2_B_1_1_3",
                  "label": "(1) ③ 炭素(C)のサッカーボール状の同素体",
                  "type": "short_answer",
                  "correctAnswer": "フラーレン",
                  "correctAnswerRate": 85
                },
                {
                  "id": "q_c1_2_B_1_1_4_color",
                  "label": "(1) ④ オゾンの色",
                  "type": "short_answer",
                  "correctAnswer": "淡青色",
                  "correctAnswerRate": 85
                },
                {
                  "id": "q_c1_2_B_1_1_4_smell",
                  "label": "(1) ④ オゾンのにおいの特徴",
                  "type": "short_answer",
                  "correctAnswer": "特異臭",
                  "correctAnswerRate": 85
                },
                {
                  "id": "q_c1_2_B_1_1_5",
                  "label": "(1) ⑤ リン(P)の水中保存する同素体",
                  "type": "short_answer",
                  "correctAnswer": "黄リン",
                  "correctAnswerRate": 85
                },
                {
                  "id": "q_c1_2_B_1_1_6",
                  "label": "(1) ⑥ リン(P)のマッチの側薬に使われる同素体",
                  "type": "short_answer",
                  "correctAnswer": "赤リン",
                  "correctAnswerRate": 85
                },
                {
                  "id": "q_c1_2_B_1_2",
                  "label": "(2) 同素体の組み合わせ（すべて）",
                  "type": "short_answer",
                  "correctAnswer": "イ、ウ、オ",
                  "correctAnswerRate": 85
                }
              ],
              "explanation": "【解答・解説】\n(1)\n① 斜方硫黄 （常温で最も安定な黄色の結晶です）\n② 黒鉛 （別名グラファイト。柔らかく電気をよく通します）\n③ フラーレン （C₆₀などがあり、サッカーボール状の分子構造です。有機溶媒に溶けます）\n④ 色：淡青色、におい：特異臭\n⑤ 黄リン （猛毒で自然発火するため水中に保存します）\n⑥ 赤リン （ほぼ無毒で、マッチの側薬に使われます）\n\n(2) イ、ウ、オ\n解説:\n・同素体とは、同じ元素の単体で、性質の異なる物質どうしのことです。頭文字「S, C, O, P（スコップ）」の4元素が代表例です。\n・イ（赤リンと黄リン：リンP）、ウ（ゴム状硫黄と単斜硫黄：硫黄S）、オ（カーボンナノチューブとダイヤモンド：炭素C）が同素体の関係にあります。\n・ア、カは異なる元素（ネオンとアルゴン）、エは同一物質の状態変化（氷と水：いずれもH₂O）なので同素体ではありません。",
              "surroundingKnowledge": [],
              "deepDiveTopics": []
            },
            {
              "id": "q_c1_2_B_mt_2",
              "category": "物質の構成と成分元素の検出 (2-1)",
              "text": "【2】問1 硫黄、炭素、酸素、リンの性質について次の問いに答えよ。\n\n(1) 硫黄(S)の同素体を3つ、名称で答えよ。また、そのうち「常温で安定で黄色」のもの、「淡黄色で針状」のものをそれぞれ選べ。\n(2) 炭素(C)的同素体を4つ、名称で答えよ。また、そのうち「非常に硬く電気を通さない」もの、「やわらかく電気をよく導く」ものをそれぞれ選べ。\n(3) 酸素(O)の同素体である「オゾン」は、どのような色とにおいをもつか。それぞれ簡潔に答えよ。\n(4) リン(P)の同素体のうち、猛毒で自然発火するため「水中に保存」するものは何か。また、毒性が低く「マッチの側薬」などに使われるものは何か。名称で答えよ。",
              "subQuestions": [
                {
                  "id": "q_c1_2_B_2_1_stable",
                  "label": "問1 (1) 常温で安定な硫黄",
                  "type": "short_answer",
                  "correctAnswer": "斜方硫黄",
                  "correctAnswerRate": 85
                },
                {
                  "id": "q_c1_2_B_2_1_needle",
                  "label": "問1 (1) 針状の硫黄",
                  "type": "short_answer",
                  "correctAnswer": "単斜硫黄",
                  "correctAnswerRate": 85
                },
                {
                  "id": "q_c1_2_B_2_2_hard",
                  "label": "問1 (2) 非常に硬い炭素",
                  "type": "short_answer",
                  "correctAnswer": "ダイヤモンド",
                  "correctAnswerRate": 85
                },
                {
                  "id": "q_c1_2_B_2_2_soft",
                  "label": "問1 (2) 電気を通す炭素",
                  "type": "short_answer",
                  "correctAnswer": "黒鉛",
                  "correctAnswerRate": 85
                },
                {
                  "id": "q_c1_2_B_2_3_color",
                  "label": "問1 (3) オゾンの色",
                  "type": "short_answer",
                  "correctAnswer": "淡青色",
                  "correctAnswerRate": 85
                },
                {
                  "id": "q_c1_2_B_2_3_smell",
                  "label": "問1 (3) オゾンのにおい",
                  "type": "short_answer",
                  "correctAnswer": "特異臭",
                  "correctAnswerRate": 85
                },
                {
                  "id": "q_c1_2_B_2_4_poison",
                  "label": "問1 (4) リンの水中に保存するもの",
                  "type": "short_answer",
                  "correctAnswer": "黄リン",
                  "correctAnswerRate": 85
                },
                {
                  "id": "q_c1_2_B_2_4_match",
                  "label": "問1 (4) リンのマッチの側薬に使うもの",
                  "type": "short_answer",
                  "correctAnswer": "赤リン",
                  "correctAnswerRate": 85
                }
              ],
              "explanation": "【解答・解説】\n問1\n(1) 同素体：斜方硫黄、単斜硫黄、ゴム状硫黄\n常温で安定で黄色：斜方硫黄\n淡黄色で針状：単斜硫黄\n(2) 同素体：ダイヤモンド、黒鉛、フラーレン、カーボンナノチューブ\n非常に硬く電気を通さない：ダイヤモンド\nやわらかく電気をよく導く：黒鉛\n(3) 色：淡青色　におい：特異臭\n(4) 水中に保存：黄リン 　マッチの側薬：赤リン\n\n解説: プリントに書かれている同素体の特徴（色や硬さ、保存方法）はテストで頻出です。特にリンの保存方法と、硫黄の「斜方」「単斜」の違いは確実に覚えておきましょう。",
              "surroundingKnowledge": [],
              "deepDiveTopics": []
            },
            {
              "id": "q_c1_2_B_mt_3",
              "category": "物質の構成と成分元素の検出 (2-2)",
              "text": "【2】問2 次の元素が含まれる物質を炎の中に入れたとき、それぞれ何色の炎になるか答えよ。\n\n(1) Li （リチウム）\n(2) Na （ナトリウム）\n(3) K （カリウム）\n(4) Cu （銅）\n(5) Ca （カルシウム）\n(6) Sr （ストロンチウム）\n(7) Ba （バリウム）",
              "subQuestions": [
                {
                  "id": "q_c1_2_B_3_1",
                  "label": "(1) Li",
                  "type": "short_answer",
                  "correctAnswer": "赤",
                  "correctAnswerRate": 85
                },
                {
                  "id": "q_c1_2_B_3_2",
                  "label": "(2) Na",
                  "type": "short_answer",
                  "correctAnswer": "黄",
                  "correctAnswerRate": 85
                },
                {
                  "id": "q_c1_2_B_3_3",
                  "label": "(3) K",
                  "type": "short_answer",
                  "correctAnswer": "紫",
                  "correctAnswerRate": 85
                },
                {
                  "id": "q_c1_2_B_3_4",
                  "label": "(4) Cu",
                  "type": "short_answer",
                  "correctAnswer": "青緑",
                  "correctAnswerRate": 85
                },
                {
                  "id": "q_c1_2_B_3_5",
                  "label": "(5) Ca",
                  "type": "short_answer",
                  "correctAnswer": "橙",
                  "correctAnswerRate": 85
                },
                {
                  "id": "q_c1_2_B_3_6",
                  "label": "(6) Sr",
                  "type": "short_answer",
                  "correctAnswer": "紅",
                  "correctAnswerRate": 85
                },
                {
                  "id": "q_c1_2_B_3_7",
                  "label": "(7) Ba",
                  "type": "short_answer",
                  "correctAnswer": "黄緑",
                  "correctAnswerRate": 85
                }
              ],
              "explanation": "【解答・解説】\n問2\n(1) 赤 （赤色）\n(2) 黄 （黄色）\n(3) 紫 （紫色）\n(4) 青緑 （青緑色）\n(5) 橙 （橙色）\n(6) 紅 （紅色）\n(7) 黄緑 （黄緑色）\n\n解説: 「リアカー(Li赤) 無き(Na黄、K紫) 動力(Cu青緑) 借りるとう(Ca橙) するもくれない(Sr紅) 馬力(Ba黄緑)」で確実に暗記します。",
              "surroundingKnowledge": [],
              "deepDiveTopics": []
            },
            {
              "id": "q_c1_2_B_mt_4",
              "category": "物質の構成と成分元素の検出 (3)",
              "text": "【3】次の（あ）～（う）の文章を読んで、化合物A、B、Cにそれぞれ含まれる元素を、元素記号ですべて推定せよ。\n\n（あ）ある化合物Aの水溶液の炎色反応を調べると、青緑色を呈した。次に、この水溶液に酢酸鉛（Ⅱ）水溶液を加えると、黒色沈殿を生じた。\n\n（い）ある化合物Bを加熱すると、無色の気体と無色の液体を生じた。気体は石灰水を白濁させ、液体は白色の硫酸銅（Ⅱ）無水塩に触れると青色に変化した。また、元の化合物 B の炎色反応を調べると、橙色を呈した。\n\n（う）ある化合物Cの水溶液の炎色反応を調べると、赤紫色（紫）を呈した。次に、この水溶液に硝酸銀水溶液を加えると、白色沈殿を生じた。",
              "subQuestions": [
                {
                  "id": "q_c1_2_B_4_A_metal",
                  "label": "化合物Aに含まれる金属元素の元素記号",
                  "type": "short_answer",
                  "correctAnswer": "Cu",
                  "correctAnswerRate": 85
                },
                {
                  "id": "q_c1_2_B_4_A_nonmetal",
                  "label": "化合物Aに含まれる非金属元素の元素記号",
                  "type": "short_answer",
                  "correctAnswer": "S",
                  "correctAnswerRate": 85
                },
                {
                  "id": "q_c1_2_B_4_B_metal",
                  "label": "化合物Bに含まれる金属元素の元素記号",
                  "type": "short_answer",
                  "correctAnswer": "Ca",
                  "correctAnswerRate": 85
                },
                {
                  "id": "q_c1_2_B_4_B_nonmetal1",
                  "label": "化合物Bに含まれる、気体（石灰水を白濁）を構成する非金属元素の元素記号",
                  "type": "short_answer",
                  "correctAnswer": "C",
                  "correctAnswerRate": 85
                },
                {
                  "id": "q_c1_2_B_4_B_nonmetal2",
                  "label": "化合物Bに含まれる、液体（水を生成）を構成する非金属元素の元素記号",
                  "type": "short_answer",
                  "correctAnswer": "H",
                  "correctAnswerRate": 85
                },
                {
                  "id": "q_c1_2_B_4_C_metal",
                  "label": "化合物Cに含まれる金属元素の元素記号",
                  "type": "short_answer",
                  "correctAnswer": "K",
                  "correctAnswerRate": 85
                },
                {
                  "id": "q_c1_2_B_4_C_nonmetal",
                  "label": "化合物Cに含まれる非金属元素の元素記号",
                  "type": "short_answer",
                  "correctAnswer": "Cl",
                  "correctAnswerRate": 85
                }
              ],
              "explanation": "【解答・解説】\n化合物A：Cu, S\n化合物B：Ca, C, H\n化合物C：K, Cl\n\n解説:\n（あ）青緑色の炎色反応を示す金属元素は「銅（Cu）」です。また、酢酸鉛(Ⅱ)水溶液を加えて黒色沈殿（硫化鉛 PbS）が生じることから、非金属元素の「硫黄（S）」が含まれていることがわかります。\n\n（い）発生した気体が石灰水を白濁（炭酸カルシウム CaCO₃ 生成）させたことから「炭素（C）」元素、発生した液体が白色の硫酸銅(Ⅱ)無水塩を青色（硫酸銅(Ⅱ)五水和物 CuSO₄・5H₂O 生成）に変えた（=水である）ことから「水素（H）」元素が含まれていると判定できます。また、元の化合物 B の炎色反応が橙色であることから、金属元素の「カルシウム（Ca）」が含まれていることがわかります。\n\n（う）赤紫色（紫）の炎色反応を示す金属元素は「カリウム（K）」です。また、硝酸銀水溶液を加えて白色沈殿（塩化銀 AgCl）が生じたことから、非金属元素の「塩素（Cl）」が含まれていることがわかります。",
              "surroundingKnowledge": [],
              "deepDiveTopics": []
            },
            {
              "id": "q_c1_2_B_mt_5",
              "category": "物質の構成と成分元素の検出 (4)",
              "text": "【4】次の問いに答えよ。\n\n(1) 二酸化炭素を石灰水（水酸化カルシウム水溶液）に通して白濁したとき、生じている白色の沈殿物の名称と、その化学式を答えよ。\n(2) 液体（水）が触れたとき、硫酸銅(Ⅱ)無水塩は何色から何色に変化するか。\n(3) 水の確認には、青色の塩化コバルト紙を用いることもできる。水に触れると塩化コバルト紙は何色に変化するか。\n(4) 水溶液に硝酸銀(AgNO₃)水溶液を加えたときに生じる「白色沈殿」の物質の名称と、その化学式を答えよ。\n(5) 水溶液中の硫黄(S)元素を検出するためには、酢酸鉛(Ⅱ)水溶液を加える。このとき生じる沈殿の色と、その沈殿物の化学式を答えよ。",
              "subQuestions": [
                {
                  "id": "q_c1_2_B_5_1_name",
                  "label": "(1) 白色の沈殿物の名称",
                  "type": "short_answer",
                  "correctAnswer": "炭酸カルシウム",
                  "correctAnswerRate": 85
                },
                {
                  "id": "q_c1_2_B_5_1_chem",
                  "label": "(1) 沈殿物の化学式",
                  "type": "short_answer",
                  "correctAnswer": "CaCO3",
                  "correctAnswerRate": 85
                },
                {
                  "id": "q_c1_2_B_5_2_color",
                  "label": "(2) 硫酸銅(Ⅱ)無水塩の色変化",
                  "type": "descriptive",
                  "correctAnswer": "白色から青色",
                  "gradingCriteria": [
                    "白色",
                    "青色"
                  ],
                  "correctAnswerRate": 85
                },
                {
                  "id": "q_c1_2_B_5_3_color",
                  "label": "(3) 塩化コバルト紙の色変化",
                  "type": "short_answer",
                  "correctAnswer": "赤色",
                  "correctAnswerRate": 85
                },
                {
                  "id": "q_c1_2_B_5_4_name",
                  "label": "(4) 生じる白色沈殿の名称",
                  "type": "short_answer",
                  "correctAnswer": "塩化銀",
                  "correctAnswerRate": 85
                },
                {
                  "id": "q_c1_2_B_5_4_chem",
                  "label": "(4) 白色沈殿の化学式",
                  "type": "short_answer",
                  "correctAnswer": "AgCl",
                  "correctAnswerRate": 85
                },
                {
                  "id": "q_c1_2_B_5_5_color",
                  "label": "(5) 生じる沈殿の色",
                  "type": "short_answer",
                  "correctAnswer": "黒色",
                  "correctAnswerRate": 85
                },
                {
                  "id": "q_c1_2_B_5_5_chem",
                  "label": "(5) 沈殿物の化学式",
                  "type": "short_answer",
                  "correctAnswer": "PbS",
                  "correctAnswerRate": 85
                }
              ],
              "explanation": "【解答・解説】\n(1) 炭酸カルシウム 　化学式：CaCO₃\n二酸化炭素を石灰水に通すと、水に溶けにくい炭酸カルシウムの白色沈殿が生じるため、全体が白く濁ります。\n\n(2) 白色から青色\n硫酸銅(Ⅱ)無水塩（白色粉末）は水分子を取り込むと硫酸銅(Ⅱ)五水和物（青色結晶）になります。\n\n(3) 赤色（または 桃色）\n乾燥状態では青色をしていますが、水に触れると水分を吸収して赤色（桃色）へと変化します。\n\n(4) 塩化銀 　化学式：AgCl\n水溶液中に塩素イオン(Cl⁻)が存在する場合、硝酸銀水溶液を加えると、銀イオン(Ag⁺)と結びついて水に溶けにくい塩化銀の白色沈殿が生じます。\n\n(5) 黒色 　化学式：PbS\n硫黄元素を含むイオンに鉛イオン(Pb²⁺)を反応させると、硫化鉛(Ⅱ)の黒色沈殿が生じます。",
              "surroundingKnowledge": [],
              "deepDiveTopics": []
            }
          ]
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
          "practiceProblems": [
            {
              "id": "q_c1_3_1",
              "category": "粒子の熱運動と物質の三態 (問1)",
              "text": "【問1】 次の文章の空欄（ア）〜（ソ）に適する語句・数値を答えよ。（語句網羅）\n物質を構成する粒子は静止しておらず、不規則な運動をしている。これを（ア）という。温度が高いほど粒子の平均の速さは（イ：大きく／小さく）なる。理論上、粒子の運動が止まる温度を（ウ）といい、セルシウス温度では（エ）℃である。これを基準にした温度を（オ）といい、単位は（カ）（記号 K）で表す。セルシウス温度 t [℃] と絶対温度 T [K] の関係は T = （キ）+ t である。物質の三態は（ク）・液体・（ケ）であり、固体→液体への変化を（コ）、液体→気体への変化を（サ）、気体→液体への変化を（シ）、液体→固体への変化を（ス）という。固体から直接気体になる変化を（セ）といい、逆に気体から直接固体になる変化を（ソ）（または昇華）という。状態だけが変化し、別の物質に変わらない変化を物理変化、別の物質になる変化を化学変化という。",
              "subQuestions": [
                {
                  "id": "q_c1_3_1_a",
                  "label": "（ア）",
                  "type": "short_answer",
                  "correctAnswer": "熱運動",
                  "correctAnswerRate": 85
                },
                {
                  "id": "q_c1_3_1_i",
                  "label": "（イ）",
                  "type": "multiple_choice",
                  "options": [
                    "大きく",
                    "小さく"
                  ],
                  "correctAnswer": "大きく",
                  "correctAnswerRate": 85
                },
                {
                  "id": "q_c1_3_1_u",
                  "label": "（ウ）",
                  "type": "short_answer",
                  "correctAnswer": "絶対零度",
                  "correctAnswerRate": 85
                },
                {
                  "id": "q_c1_3_1_e",
                  "label": "（エ）",
                  "type": "short_answer",
                  "correctAnswer": "−273",
                  "correctAnswerRate": 85
                },
                {
                  "id": "q_c1_3_1_o",
                  "label": "（オ）",
                  "type": "short_answer",
                  "correctAnswer": "絶対温度",
                  "correctAnswerRate": 85
                },
                {
                  "id": "q_c1_3_1_ka",
                  "label": "（カ）",
                  "type": "short_answer",
                  "correctAnswer": "ケルビン",
                  "correctAnswerRate": 85
                },
                {
                  "id": "q_c1_3_1_ki",
                  "label": "（キ）",
                  "type": "short_answer",
                  "correctAnswer": "273",
                  "correctAnswerRate": 85
                },
                {
                  "id": "q_c1_3_1_ku",
                  "label": "（ク）",
                  "type": "short_answer",
                  "correctAnswer": "固体",
                  "correctAnswerRate": 85
                },
                {
                  "id": "q_c1_3_1_ke",
                  "label": "（ケ）",
                  "type": "short_answer",
                  "correctAnswer": "気体",
                  "correctAnswerRate": 85
                },
                {
                  "id": "q_c1_3_1_ko",
                  "label": "（コ）",
                  "type": "short_answer",
                  "correctAnswer": "融解",
                  "correctAnswerRate": 85
                },
                {
                  "id": "q_c1_3_1_sa",
                  "label": "（サ）",
                  "type": "short_answer",
                  "correctAnswer": "蒸発",
                  "correctAnswerRate": 85
                },
                {
                  "id": "q_c1_3_1_shi",
                  "label": "（シ）",
                  "type": "short_answer",
                  "correctAnswer": "凝縮",
                  "correctAnswerRate": 85
                },
                {
                  "id": "q_c1_3_1_su",
                  "label": "（ス）",
                  "type": "short_answer",
                  "correctAnswer": "凝固",
                  "correctAnswerRate": 85
                },
                {
                  "id": "q_c1_3_1_se",
                  "label": "（セ）",
                  "type": "short_answer",
                  "correctAnswer": "昇華",
                  "correctAnswerRate": 85
                },
                {
                  "id": "q_c1_3_1_so",
                  "label": "（ソ）",
                  "type": "short_answer",
                  "correctAnswer": "凝華",
                  "correctAnswerRate": 85
                }
              ],
              "explanation": "▼ 解答・解説\n（ア）熱運動 （イ）大きく （ウ）絶対零度 （エ）−273 （オ）絶対温度 （カ）ケルビン\n（キ）273 （ク）固体 （ケ）気体 （コ）融解 （サ）蒸発 （シ）凝縮 （ス）凝固 （セ）昇華 （ソ）凝華",
              "surroundingKnowledge": [],
              "deepDiveTopics": []
            },
            {
              "id": "q_c1_3_2",
              "category": "粒子の熱運動と物質の三態 (問2)",
              "text": "【問2】 （基礎）次の温度をセルシウス温度から絶対温度に、あるいはその逆に換算せよ。\n(1) 27 ℃ → [ ] K\n(2) 0 ℃ → [ ] K\n(3) 100 ℃ → [ ] K\n(4) 200 K → [ ] ℃\n(5) 373 K → [ ] ℃\n(6) 25 ℃ → [ ] K",
              "subQuestions": [
                {
                  "id": "q_c1_3_2_1",
                  "label": "(1)",
                  "type": "short_answer",
                  "correctAnswer": "300",
                  "correctAnswerRate": 85
                },
                {
                  "id": "q_c1_3_2_2",
                  "label": "(2)",
                  "type": "short_answer",
                  "correctAnswer": "273",
                  "correctAnswerRate": 85
                },
                {
                  "id": "q_c1_3_2_3",
                  "label": "(3)",
                  "type": "short_answer",
                  "correctAnswer": "373",
                  "correctAnswerRate": 85
                },
                {
                  "id": "q_c1_3_2_4",
                  "label": "(4)",
                  "type": "short_answer",
                  "correctAnswer": "-73",
                  "correctAnswerRate": 85
                },
                {
                  "id": "q_c1_3_2_5",
                  "label": "(5)",
                  "type": "short_answer",
                  "correctAnswer": "100",
                  "correctAnswerRate": 85
                },
                {
                  "id": "q_c1_3_2_6",
                  "label": "(6)",
                  "type": "short_answer",
                  "correctAnswer": "298",
                  "correctAnswerRate": 85
                }
              ],
              "explanation": "▼ 解答・解説\n(1) 300 K (2) 273 K (3) 373 K (4) −73 ℃ (5) 100 ℃ (6) 298 K\n■ T = 273 + t ⇄ t = T − 273.",
              "surroundingKnowledge": [],
              "deepDiveTopics": []
            },
            {
              "id": "q_c1_3_3",
              "category": "粒子の熱運動と物質の三態 (問3)",
              "text": "【問3】 次のア〜カの現象は、固体・液体・気体の三態のどれからどれへの状態変化か答え、変化の名称を答えよ。\nア：冷凍庫の中で水が氷になる\nイ：洗濯物が乾く\nウ：ドライアイスが小さくなる（液体にならず）\nエ：露が朝、葉に付く\nオ：寒い朝、霜柱や霜が降りる\nカ：ロウソクのロウが溶ける",
              "subQuestions": [
                {
                  "id": "q_c1_3_3_a",
                  "label": "ア：変化",
                  "type": "short_answer",
                  "correctAnswer": "液体から固体",
                  "correctAnswerRate": 85
                },
                {
                  "id": "q_c1_3_3_a_name",
                  "label": "ア：名称",
                  "type": "short_answer",
                  "correctAnswer": "凝固",
                  "correctAnswerRate": 85
                },
                {
                  "id": "q_c1_3_3_i",
                  "label": "イ：変化",
                  "type": "short_answer",
                  "correctAnswer": "液体から気体",
                  "correctAnswerRate": 85
                },
                {
                  "id": "q_c1_3_3_i_name",
                  "label": "イ：名称",
                  "type": "short_answer",
                  "correctAnswer": "蒸発",
                  "correctAnswerRate": 85
                },
                {
                  "id": "q_c1_3_3_u",
                  "label": "ウ：変化",
                  "type": "short_answer",
                  "correctAnswer": "固体から気体",
                  "correctAnswerRate": 85
                },
                {
                  "id": "q_c1_3_3_u_name",
                  "label": "ウ：名称",
                  "type": "short_answer",
                  "correctAnswer": "昇華",
                  "correctAnswerRate": 85
                },
                {
                  "id": "q_c1_3_3_e",
                  "label": "エ：変化",
                  "type": "short_answer",
                  "correctAnswer": "気体から液体",
                  "correctAnswerRate": 85
                },
                {
                  "id": "q_c1_3_3_e_name",
                  "label": "エ：名称",
                  "type": "short_answer",
                  "correctAnswer": "凝縮",
                  "correctAnswerRate": 85
                },
                {
                  "id": "q_c1_3_3_o",
                  "label": "オ：変化",
                  "type": "short_answer",
                  "correctAnswer": "気体から固体",
                  "correctAnswerRate": 85
                },
                {
                  "id": "q_c1_3_3_o_name",
                  "label": "オ：名称",
                  "type": "short_answer",
                  "correctAnswer": "凝華",
                  "correctAnswerRate": 85
                },
                {
                  "id": "q_c1_3_3_ka",
                  "label": "カ：変化",
                  "type": "short_answer",
                  "correctAnswer": "固体から液体",
                  "correctAnswerRate": 85
                },
                {
                  "id": "q_c1_3_3_ka_name",
                  "label": "カ：名称",
                  "type": "short_answer",
                  "correctAnswer": "融解",
                  "correctAnswerRate": 85
                }
              ],
              "explanation": "▼ 解答・解説\nア：液体→固体（凝固） イ：液体→気体（蒸発） ウ：固体→気体（昇華）\nエ：気体→液体（凝縮） オ：気体→固体（凝華） カ：固体→液体（融解）",
              "surroundingKnowledge": [],
              "deepDiveTopics": []
            },
            {
              "id": "q_c1_3_4",
              "category": "粒子の熱運動と物質の三態 (問4)",
              "text": "【問4】 （標準）次の変化のうち、化学変化はどれか。すべて選び記号で答えよ。\nア：水を加熱して水蒸気にする\nイ：鉄が空気中でさびて酸化鉄になる\nウ：砂糖が水に溶ける\nエ：マグネシウムリボンが燃えて酸化マグネシウムになる\nオ：氷が水になる\nカ：銅板を加熱して黒く変色する（CuO 生成）",
              "subQuestions": [
                {
                  "id": "q_c1_3_4_ans",
                  "label": "記号",
                  "type": "short_answer",
                  "correctAnswer": "イ・エ・カ",
                  "correctAnswerRate": 85
                }
              ],
              "explanation": "▼ 解答・解説\n答：イ・エ・カ\n■ 化学変化は『別の物質に変わる』もの。さび（鉄→酸化鉄）、燃焼（Mg→MgO）、加熱酸化（Cu→CuO）は化学変化。\nア・オは状態変化（物理変化）、ウは溶解（物理変化）。",
              "surroundingKnowledge": [],
              "deepDiveTopics": []
            },
            {
              "id": "q_c1_3_5",
              "category": "粒子の熱運動と物質の三態 (問5)",
              "text": "【問5】 （文字式・文章題）ある気体粒子の平均運動エネルギーは絶対温度 T に比例する（E = kT、kは比例定数）。温度を T₁ [K] から T₂ [K] に変えたとき、平均運動エネルギーは何倍になるか。T₁, T₂ の式で表せ。また、T₁ = 300 K, T₂ = 600 K の場合の値を求めよ。",
              "subQuestions": [
                {
                  "id": "q_c1_3_5_exp",
                  "label": "式",
                  "type": "short_answer",
                  "correctAnswer": "T2/T1",
                  "correctAnswerRate": 85
                },
                {
                  "id": "q_c1_3_5_val",
                  "label": "値",
                  "type": "short_answer",
                  "correctAnswer": "2.0倍",
                  "correctAnswerRate": 85
                }
              ],
              "explanation": "▼ 解答・解説\n倍率 = E(T₂)/E(T₁) = (k·T₂)/(k·T₁) = T₂/T₁.\nT₁=300 K, T₂=600 K のとき：600/300 = 2.0 倍.\n■ 平均運動エネルギーは絶対温度に比例するため、絶対温度を2倍にすると平均運動エネルギーも2倍。",
              "surroundingKnowledge": [],
              "deepDiveTopics": []
            },
            {
              "id": "q_c1_3_6",
              "category": "粒子の熱運動と物質の三態 (問6)",
              "text": "【問6】 （標準）次の問いに答えよ。\n(1) 1 atm（大気圧）下での水の融点・沸点を℃と K の両方で答えよ。\n(2) 大気圧でドライアイスは何℃で昇華するか、おおよその値を答えよ（−79℃前後）。\n(3) 絶対温度の値が負になることはあるか。理由を述べよ。",
              "subQuestions": [
                {
                  "id": "q_c1_3_6_1_mp_c",
                  "label": "(1)融点(℃)",
                  "type": "short_answer",
                  "correctAnswer": "0",
                  "correctAnswerRate": 85
                },
                {
                  "id": "q_c1_3_6_1_mp_k",
                  "label": "(1)融点(K)",
                  "type": "short_answer",
                  "correctAnswer": "273",
                  "correctAnswerRate": 85
                },
                {
                  "id": "q_c1_3_6_1_bp_c",
                  "label": "(1)沸点(℃)",
                  "type": "short_answer",
                  "correctAnswer": "100",
                  "correctAnswerRate": 85
                },
                {
                  "id": "q_c1_3_6_1_bp_k",
                  "label": "(1)沸点(K)",
                  "type": "short_answer",
                  "correctAnswer": "373",
                  "correctAnswerRate": 85
                },
                {
                  "id": "q_c1_3_6_2",
                  "label": "(2)",
                  "type": "short_answer",
                  "correctAnswer": "-79",
                  "correctAnswerRate": 85
                },
                {
                  "id": "q_c1_3_6_3",
                  "label": "(3)",
                  "type": "short_answer",
                  "correctAnswer": "ならない。絶対零度（0 K = −273 ℃）が粒子の運動が止まる下限であり、それより低い温度は存在しない。",
                  "correctAnswerRate": 85
                }
              ],
              "explanation": "▼ 解答・解説\n(1) 融点：0 ℃ = 273 K 沸点：100 ℃ = 373 K\n(2) 約 −79 ℃（=194 K）。常圧で液体にならず固体→気体に直接変化（昇華）。\n(3) ならない。絶対零度（0 K = −273 ℃）が粒子の運動が止まる下限であり、それより低い温度は存在しない。",
              "surroundingKnowledge": [],
              "deepDiveTopics": []
            },
            {
              "id": "q_c1_3_7",
              "category": "粒子の熱運動と物質の三態 (問7)",
              "text": "【問7】 右図（図3）の三態モデルにおいて、状態変化に伴うエネルギーの出入りについて、次のうち正しいものをすべて選べ。\nア：融解では熱を吸収する。\nイ：凝縮では熱を放出する。\nウ：昇華では熱を放出する。\nエ：蒸発では熱を吸収する。\nオ：凝固では熱を吸収する。",
              "subQuestions": [
                {
                  "id": "q_c1_3_7_ans",
                  "label": "記号",
                  "type": "multiple_choice",
                  "options": [
                    "ア",
                    "イ",
                    "ウ",
                    "エ",
                    "オ"
                  ],
                  "correctAnswer": "ア・イ・エ",
                  "correctAnswerRate": 85
                }
              ],
              "explanation": "▼ 解答・解説\n答：ア・イ・エ\n■ 粒子間の結合を切る向きの変化（融解・蒸発・昇華）は『吸熱』、結合をつくる向きの変化（凝固・凝縮・凝華）は『発熱』。\nウ：昇華は固→気で結合を切るので吸熱（誤り）。オ：凝固は液→固で発熱（誤り）。",
              "surroundingKnowledge": [],
              "deepDiveTopics": []
            }
          ]
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
          "practiceProblems": [
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
          ],
          "miniTest": [
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
          ]
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
          "practiceProblems": [
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
          ]
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
          "practiceProblems": [
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
          ],
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
          "practiceProblems": [
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
          ],
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
          "practiceProblems": [
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
              "id": "q_c3_1_3",
              "category": "化学結合の種類と特徴 (問3)",
              "text": "【問3】 （標準）次の問いに答えよ。",
              "subQuestions": [
                {
                  "id": "q_c3_1_3_1",
                  "label": "(1) 単結合・二重結合・三重結合の共有電子対の数をそれぞれ答え、例を1つずつ挙げよ。",
                  "type": "descriptive",
                  "correctAnswer": "単結合：1対。例：H-H, HCl などのいずれか。\n二重結合：2対。例：O=O, CO₂ などのいずれか。\n三重結合：3対。例：N≡N, HC≡CH などのいずれか。",
                  "gradingCriteria": [
                    "「単結合：1対」および例（H₂, HCl, Cl₂など）を記述している",
                    "「二重結合：2対」および例（O₂, CO₂など）を記述している",
                    "「三重結合：3対」および例（N₂などのいずれか）を記述している"
                  ],
                  "detailedExplanation": {
                    "theme": "共有結合における単結合・二重結合・三重結合",
                    "type": "概念説明型",
                    "difficulty": 2,
                    "steps": [
                      "① 単結合は共有電子対が1対で構成されることを説明し、水素分子 H₂ などの好例を挙げる。",
                      "② 二重結合は共有電子対が2対で構成されることを説明し、酸素分子 O₂ などの好例を挙げる。",
                      "③ 三重結合は共有電子対が3対で構成されることを説明し、窒素分子 N₂ などの好例を挙げる。"
                    ]
                  },
                  "correctAnswerRate": 85
                },
                {
                  "id": "q_c3_1_3_2",
                  "label": "(2) 配位結合と通常の共有結合は、できあがった結合の性質（結合の強さや長さ）に違いがあるか説明せよ。",
                  "type": "descriptive",
                  "correctAnswer": "配位結合は結合の形成過程（でき方）が異なるだけで、一旦できあがった結合の性質（長さや強さ）は通常の共有結合と全く区別できず、違いはない（等価である）。",
                  "gradingCriteria": [
                    "「できあがった結合の性質に違いはない」または「完全に同一で区別できない」と述べている",
                    "電子が分配される結果「すべて等価である」ことを説明している"
                  ],
                  "detailedExplanation": {
                    "theme": "配位結合と共有結合の等価性",
                    "type": "概念説明型",
                    "difficulty": 3,
                    "steps": [
                      "① 配位結合は一方の原子から非共有電子対が寄与して作られるというでき方（起源）の違いを思い出す。",
                      "② 結合した後は、電子軌道が通常の共有結合と共有化・非局在化されるため、結合の性質は同一であることを理解する。",
                      "③ よって、できあがりの構造特性（長さ、強さなど）は等価であり、全く区別できないと結論づける。"
                    ]
                  },
                  "correctAnswerRate": 85
                },
                {
                  "id": "q_c3_1_3_3",
                  "label": "(3) 共有結合における共有電子対・非共有電子対とは何かそれぞれ説明せよ。",
                  "type": "descriptive",
                  "correctAnswer": "共有電子対：原子がお互いに不対電子を出し合って、2つの原子の間で共有されて結合に直接関与している電子対。\n非共有電子対：結合に関与せず、1つの原子にのみペアとして局在（孤立）して存在している電子対。",
                  "gradingCriteria": [
                    "共有電子対：「原子同士で共有されている電子対（結合に関与する電子対）」であることを説明している",
                    "非共有電子対：「結合に関与しない、特定の原子に局在・孤立している電子対」であることを説明している"
                  ],
                  "detailedExplanation": {
                    "theme": "共有電子対と非共有電子対の区別",
                    "type": "概念説明型",
                    "difficulty": 2,
                    "steps": [
                      "① 共有電子対は、結合を形成する目的で原子間で共有されるペアであることを説明する。",
                      "② 非共有電子対（孤立電子対）は、最外殻で既にペアとなっており、他の原子と結合を作るのに活用されないペアであることを説明する。"
                    ]
                  },
                  "correctAnswerRate": 85
                }
              ],
              "explanation": "▼ 解答・解説\n(1) 単結合：1対（例：H-H, HCl）\n二重結合：2対（例：O=O, CO₂）\n三重結合：3対（例：N≡N, アセチレン HC≡CH）\n\n(2) 結合のでき方は異なりますが、できあがった結合の性質（長さや結合エネルギー）には一切の違いはありません。完全に等価であり、電子の出処がどこであったかは区別不可能です。\n\n(3) 共有電子対は2つの原子に共有されて結合に使われている軌道上にあります。非共有電子対は、その原子に単独（孤立）で保存されている不対でない電子ペアです。",
              "surroundingKnowledge": [],
              "deepDiveTopics": []
            },
            {
              "id": "q_c3_1_4",
              "category": "化学結合の種類と特徴 (問4)",
              "text": "【問4】 （標準）NH₄⁺（アンモニウムイオン）と H₃O⁺（オキソニウムイオン）の生成過程を、図と電子配置で説明せよ。また、配位結合の電子の供与体はどれか。",
              "subQuestions": [
                {
                  "id": "q_c3_1_4_ans",
                  "label": "NH₄⁺ と H₃O⁺ の生成過程・配位結合の供与体の説明",
                  "type": "descriptive",
                  "correctAnswer": "NH₄⁺：NH₃の中の窒素原子(N)がもつ非共有電子対を、水素イオン（H⁺）に一方的に提供して共有する。供与体は NH₃ の N。\nH₃O⁺：H₂Oの中の酸素原子(O)がもつ非共有電子対の1組を、水素イオン（H⁺）に一方的に提供して共有する。供与体は H₂O の O。\nできあがった結合は、元々あった共有結合と全く性質が同等であり、区別がつかない。",
                  "gradingCriteria": [
                    "NH₄⁺に関して：アンモニア（NH₃）の窒素原子(N)の非共有電子対を、水素イオン(H⁺)に提供して配位結合を形成する説明があること",
                    "NH₄⁺の電子供与体はアンモニアの窒素(N)であると明記していること",
                    "H₃O⁺に関して：水（H₂O）の酸素原子(O)の非共有電子対を、水素イオン(H⁺)に提供して配位結合を形成する説明があること",
                    "H₃O⁺の電子供与体は水の酸素(O)であると明記していること",
                    "完成した配位結合は、もともとの共有結合と完全に等価（区別不可）になると記述していること（加点要件）"
                  ],
                  "detailedExplanation": {
                    "theme": "アンモニウムイオンとオキソニウムイオンの配位結合形成",
                    "type": "概念説明型",
                    "difficulty": 3,
                    "steps": [
                      "① NH₃ の N には1つの非共有電子対、H₂O の O には2つの非共有電子対が存在する点を確認する。",
                      "② 電子が空の水素イオン H⁺ に対して、この非共有電子対の1組が一方的に提供（ドネーション）されることで共有結合と同等の状態になること（配位結合）を記述する。",
                      "③ 窒素 (N) および 酸素 (O) がそれぞれ電子対を差し出す役割（ドナー＝供与体）であることを明示する。"
                    ]
                  },
                  "correctAnswerRate": 85
                }
              ],
              "explanation": "▼ 解答・解説\n■ NH₄⁺ （アンモニウムイオン）\nアンモニア NH₃ の窒素原子が持つ「非共有電子対」1組を、空の orbital（軌道）を持つ水素イオン H⁺ に一方的に差し出すことで共有され、配位結合が作られます。供与体（ドナー）は NH₃（窒素N）。\n\n■ H₃O⁺ （オキソニウムイオン）\n水分子 H₂O の酸素原子が持つ「非共有電子対」の中の1組を、水素イオン H⁺ に一方的に差し出すことで共有され、配位結合が作られます。供与体（ドナー）は H₂O（酸素O）。\n\n※いずれのアンモニウムイオンも、結合形成が完了した後は、最初から存在していた共有結合ともともと配位結合であった分（の結合）が完全に均質になり、長さ・強さとも均等（区別不能）になります。",
              "surroundingKnowledge": [],
              "deepDiveTopics": []
            },
            {
              "id": "q_c3_1_5",
              "category": "化学結合の種類と特徴 (問5)",
              "text": "【問5】 （文字式・文章題）電気陰性度の差 Δχ から、次の組合せの結合は共有結合とイオン結合のどちらに近いと考えられるか、Δχ を計算して判断せよ。\n※電気陰性度 χ(H)=2.2, χ(C)=2.6, χ(N)=3.0, χ(O)=3.4, χ(F)=4.0, χ(Cl)=3.2, χ(Na)=0.9, χ(Mg)=1.3 とする。\n※判定基準: Δχ が大（おおむね 1.7 以上）でイオン結合、1.7 未満で共有結合と見なします。",
              "subQuestions": [
                {
                  "id": "q_c3_1_5_1",
                  "label": "(1) H-Cl",
                  "type": "multiple_choice",
                  "options": [
                    "共有結合 (Δχ = 1.0)",
                    "イオン結合 (Δχ = 1.0)"
                  ],
                  "correctAnswer": "共有結合 (Δχ = 1.0)",
                  "correctAnswerRate": 85
                },
                {
                  "id": "q_c3_1_5_2",
                  "label": "(2) Na-Cl",
                  "type": "multiple_choice",
                  "options": [
                    "共有結合 (Δχ = 2.3)",
                    "イオン結合 (Δχ = 2.3)"
                  ],
                  "correctAnswer": "イオン結合 (Δχ = 2.3)",
                  "correctAnswerRate": 85
                },
                {
                  "id": "q_c3_1_5_3",
                  "label": "(3) C-O",
                  "type": "multiple_choice",
                  "options": [
                    "共有結合 (Δχ = 0.8)",
                    "イオン結合 (Δχ = 0.8)"
                  ],
                  "correctAnswer": "共有結合 (Δχ = 0.8)",
                  "correctAnswerRate": 85
                },
                {
                  "id": "q_c3_1_5_4",
                  "label": "(4) Mg-O",
                  "type": "multiple_choice",
                  "options": [
                    "共有結合 (Δχ = 2.1)",
                    "イオン結合 (Δχ = 2.1)"
                  ],
                  "correctAnswer": "イオン結合 (Δχ = 2.1)",
                  "correctAnswerRate": 85
                }
              ],
              "explanation": "▼ 解答・解説\n(1) H-Cl：Δχ = |2.2 − 3.2| = 1.0 → 1.7未満のため 共有結合（極性を強く帯びる極性共有結合）。\n(2) Na-Cl：Δχ = |0.9 − 3.2| = 2.3 → 1.7以上のため イオン結合。\n(3) C-O：Δχ = |2.6 − 3.4| = 0.8 → 1.7未満のため 共有結合。\n(4) Mg-O：Δχ = |1.3 − 3.4| = 2.1 → 1.7以上のため イオン結合。",
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
          ],
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
            "単位格子",
            "延性・展性",
            "劈開"
          ],
          "practiceProblems": [
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
              "id": "q_c3_2_5",
              "category": "結晶の種類と性質 (問5)",
              "text": "【問5】 （文字式・文章題）\nある金属の結晶の単位格子1辺を a [nm]、密度を d [g/cm³] とし、単位格子に含まれる原子数を Z、その金属の原子量を M とする。Avogadro 定数を N_A とするとき、密度 d を a, Z, M, N_A で表したものとして正しい式を、以下の選択肢から選べ。ただし、1 nm = 10⁻⁷ cm とする。",
              "subQuestions": [
                {
                  "id": "q_c3_2_5_ans",
                  "label": "適切な文字式を選択してください",
                  "type": "multiple_choice",
                  "options": [
                    "d = (Z·M) / (N_A · a³ · 10⁻²¹)",
                    "d = (Z·M) / (N_A · a³ · 10⁻⁷)",
                    "d = (Z·M · N_A) / a³",
                    "d = a³ · N_A / (Z·M)"
                  ],
                  "correctAnswer": "d = (Z·M) / (N_A · a³ · 10⁻²¹)",
                  "correctAnswerRate": 85
                }
              ],
              "explanation": "▼ 解答・解説\n\n1個の原子の質量 = M/N_A [g]\n単位格子内の質量 = Z·M/N_A [g]\n単位格子の体積 = a³ × (10⁻⁷)³ = a³ × 10⁻²¹ [cm³] （a が nm 単位、1 nm=10⁻⁷ cm）\n\nよって、密度 = 質量 / 体積 より、\nd = (Z·M) / (N_A · a³ × 10⁻²¹) [g/cm³]\n\nしたがって正しい選択肢は、「d = (Z·M) / (N_A · a³ · 10⁻²¹)」です。",
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
            }
          ],
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
          "practiceProblems": [
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
              "id": "q_c3_3_5",
              "category": "分子の相互作用と性質 (問5)",
              "text": "【問5】 （文字式・文章題）\n電気陰性度を χ で表す。2原子分子 A-B における結合の極性の強さを、電気陰性度の差 Δχ = χ(B) − χ(A) (χ(B) > χ(A)) で評価する。電気陰性度の値を χ(H)=2.2, χ(C)=2.6, χ(N)=3.0, χ(O)=3.4, χ(F)=4.0, χ(Cl)=3.2 とするとき、次の結合の極性 Δχ を求め、極性が大きい順に並べよ。\n(1) C-H  (2) O-H  (3) N-H  (4) F-H  (5) Cl-H",
              "subQuestions": [
                {
                  "id": "q_c3_3_5_1",
                  "label": "(1) C-H の極性の強さ Δχ",
                  "type": "short_answer",
                  "correctAnswer": "0.4",
                  "correctAnswerRate": 85
                },
                {
                  "id": "q_c3_3_5_2",
                  "label": "(2) O-H の極性の強さ Δχ",
                  "type": "short_answer",
                  "correctAnswer": "1.2",
                  "correctAnswerRate": 85
                },
                {
                  "id": "q_c3_3_5_3",
                  "label": "(3) N-H の極性の強さ Δχ",
                  "type": "short_answer",
                  "correctAnswer": "0.8",
                  "correctAnswerRate": 85
                },
                {
                  "id": "q_c3_3_5_4",
                  "label": "(4) F-H の極性の強さ Δχ",
                  "type": "short_answer",
                  "correctAnswer": "1.8",
                  "correctAnswerRate": 85
                },
                {
                  "id": "q_c3_3_5_5",
                  "label": "(5) Cl-H の極性の強さ Δχ",
                  "type": "short_answer",
                  "correctAnswer": "1.0",
                  "correctAnswerRate": 85
                },
                {
                  "id": "q_c3_3_5_ranking",
                  "label": "極性が大きい順に並べたものとして正しいものを選べ",
                  "type": "multiple_choice",
                  "options": [
                    "F-H > O-H > Cl-H > N-H > C-H",
                    "F-H > O-H > N-H > Cl-H > C-H",
                    "Cl-H > F-H > O-H > N-H > C-H",
                    "C-H > N-H > Cl-H > O-H > F-H"
                  ],
                  "correctAnswer": "F-H > O-H > Cl-H > N-H > C-H",
                  "correctAnswerRate": 85
                }
              ],
              "explanation": "▼ 解答・解説\n(1) C-H：|2.6 - 2.2| = 0.4 \n(2) O-H：|3.4 - 2.2| = 1.2 \n(3) N-H：|3.0 - 2.2| = 0.8 \n(4) F-H：|4.0 - 2.2| = 1.8 \n(5) Cl-H：|3.2 - 2.2| = 1.0\n\nしたがって、極性の大きい順は：\nF-H (1.8) > O-H (1.2) > Cl-H (1.0) > N-H (0.8) > C-H (0.4)\n\nこれにより、電気陰性度の差が大きい結合ほど極性が強く、引き合う力も強力になります。",
              "surroundingKnowledge": [],
              "deepDiveTopics": []
            },
            {
              "id": "q_c3_3_6",
              "category": "分子の相互作用と性質 (問6)",
              "text": "【問6】 （文字式・文章題）\nある同族の水素化合物 HX（X=F, Cl, Br, I）について、分子量 M に対する沸点 T_b の傾向を考える。一般に分子間力のみ考えれば M が大きいほど T_b は高い。HX の M と T_b の実測値を以下に示す。\nHF：M=20, T_b=20℃ 、 HCl：M=36.5, T_b=−85℃ 、 HBr：M=81, T_b=−67℃ 、 HI：M=128, T_b=−35℃",
              "subQuestions": [
                {
                  "id": "q_c3_3_6_1",
                  "label": "(1) HF だけが M に対する単調な傾向から大きく外れている。理由を簡潔に述べよ。",
                  "type": "short_answer",
                  "correctAnswer": "水素結合が存在するため",
                  "correctAnswerRate": 85
                },
                {
                  "id": "q_c3_3_6_2",
                  "label": "(2) HCl, HBr, HI の沸点が分子量とともに上昇する原因は何の力か答えよ。",
                  "type": "short_answer",
                  "correctAnswer": "ファンデルワールス力",
                  "correctAnswerRate": 85
                }
              ],
              "explanation": "▼ 解答・解説\n(1) HF には水素結合が存在し、ファンデルワールス力に加えて分子間に強い引力がはたらくため、分子量が小さい割に沸点が異常に高い。\n(2) ファンデルワールス力（分子量の増加とともに大きくなる）。",
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
          ],
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
          "practiceProblems": [
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
          ],
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
          "practiceProblems": [
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
          ],
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
          "practiceProblems": [
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
          ],
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
          "practiceProblems": [
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
          ],
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
})();

export const componentDetectionTreeData = {
  "id": "p1_2B_root",
  "label": "元素と成分の検出",
  "step": null,
  "explanation": "同素体・炎色反応・沈殿反応・水の検出を、成分元素を見抜くための手がかりとして整理します。",
  "children": [
    {
      "id": "p1_2B_step1_group",
      "label": "【Step1：元素と元素記号】",
      "step": 1,
      "isGroup": true,
      "children": [
        {
          "id": "p1_2B_n1",
          "label": "元素と元素記号",
          "step": 1,
          "subLabel": "約120種類の元素",
          "explanation": "<u>元素</u>…物質を構成する原子の種類。現在はおよそ<u>120種類</u>の元素が存在。\n\n<u>元素記号</u>…元素を表すラテン語由来の1〜2文字の記号。\n\n<u>例</u>：H（水素 hydrogen）、O（酸素 oxygen）、Na（ナトリウム natrium）、Fe（鉄 ferrum）、Au（金 aurum）、Ag（銀 argentum）\n\n💡 元素記号の1文字目は必ず<u>大文字</u>、2文字目は必ず<u>小文字</u>！ CO（一酸化炭素）と Co（コバルト）は別物！"
        },
        {
          "id": "p1_2B_step1_group_qlink",
          "label": "📝 このStepの確認問題",
          "step": 1,
          "subLabel": "3問",
          "explanation": "このStepに対応する演習・確認問題です。タップして解答画面へ移動できます。",
          "relatedQuestions": [
            { "id": "q_c1_2_B_1_2", "label": "同素体の組み合わせ" },
            { "id": "q_c1_2_B_2_1_stable", "label": "硫黄の同素体" },
            { "id": "q_c1_2_B_2_2_hard", "label": "炭素の同素体" }
          ]
        }
      ]
    },
    {
      "id": "p1_2B_step2_group",
      "label": "【Step2：同素体（性質の異なる単体）】",
      "step": 2,
      "isGroup": true,
      "children": [
        {
          "id": "p1_2B_n3",
          "label": "同素体とは",
          "step": 2,
          "subLabel": "S・C・O・P が代表",
          "explanation": "<u>同素体</u>＝<u>同じ元素</u>からなるが、<u>性質の異なる単体</u>が存在するもの。\n\n💡 <u>覚え方「SCOP（スコップ）」</u>：S（硫黄）・C（炭素）・O（酸素）・P（リン）\n\n<u>★ 同素体をつくる主な4元素 ★</u>\n\n❶ <u>S</u> 硫黄　→ 斜方硫黄・単斜硫黄・ゴム状硫黄\n\n❷ <u>C</u> 炭素　→ ダイヤモンド・黒鉛・フラーレン・カーボンナノチューブ\n\n❸ <u>O</u> 酸素　→ 酸素 O₂・オゾン O₃\n\n❹ <u>P</u> リン　→ 黄リン（白リン）・赤リン"
        },
        {
          "id": "p1_2B_n4",
          "label": "硫黄 S の同素体",
          "step": 2,
          "subLabel": "斜方・単斜・ゴム状",
          "explanation": "同素体 ｜ 色・形状 ｜ 特徴\n斜方硫黄 S₈ ｜ 黄色の塊 ｜ 常温で最も安定\n単斜硫黄 S₈ ｜ 淡黄色・針状 ｜ 高温（96℃以上）で安定\nゴム状硫黄 Sₓ ｜ 黄色〜褐色・ゴム状 ｜ 硫黄を250℃に加熱後急冷"
        },
        {
          "id": "p1_2B_n5",
          "label": "炭素 C の同素体",
          "step": 2,
          "subLabel": "ダイヤ・黒鉛・フラーレン",
          "explanation": "同素体 ｜ 特徴 ｜ 電気伝導\nダイヤモンド ｜ 非常に硬い、無色透明、正四面体構造 ｜ ×（絶縁体）\n黒鉛（グラファイト） ｜ やわらかい、黒色、六角形の平面層状構造 ｜ ◯（例外的に通す）\nフラーレン C₆₀ ｜ サッカーボール状、有機溶媒に溶ける ｜ ×\nカーボンナノチューブ ｜ 管状（土管状）構造、非常に強い ｜ ◯\n\n💡 <u>黒鉛だけが電気を通す</u>のは共通テスト頻出！鉛筆の芯（Bほど黒鉛の割合が高い）"
        },
        {
          "id": "p1_2B_n6",
          "label": "酸素 O の同素体",
          "step": 2,
          "subLabel": "酸素 O₂・オゾン O₃",
          "explanation": "<u>① 酸素 O₂</u>：無色・無臭、空気中の約21%、生物の呼吸に必要\n\n<u>② オゾン O₃</u>：<u>淡青色・特異臭（生ぐさい臭い）</u>、成層圏の<u>オゾン層</u>で紫外線を吸収し地上を守る、殺菌・脱臭剤\n\n💡 オゾンは有毒気体。ヨウ化カリウムデンプン紙を青紫色に変える（酸化力）"
        },
        {
          "id": "p1_2B_n7",
          "label": "リン P の同素体",
          "step": 2,
          "subLabel": "黄リン・赤リン",
          "explanation": "同素体 ｜ 色 ｜ 毒性 ｜ 特徴・用途\n黄リン（白リン） ｜ 無〜淡黄色 ｜ 猛毒 ｜ 自然発火するため水中で保存\n赤リン ｜ 赤褐色 ｜ ほぼ無毒 ｜ マッチの側薬などに利用"
        },
        {
          "id": "p1_2B_n8",
          "label": "同素体 vs 同位体（区別）",
          "step": 2,
          "subLabel": "混同注意！",
          "explanation": "<u>★ 混同しやすい用語の区別 ★</u>\n\n・<u>同素体</u>＝同じ元素の異なる<u>単体</u>（性質が違う物質）　例：ダイヤ vs 黒鉛\n\n・<u>同位体</u>＝陽子数は同じで<u>中性子数が異なる原子</u>（２章で学習）　例：¹²C vs ¹⁴C\n\n⚠️ 「<u>同素体</u>である」の下線部＝<u>元素</u>（物質の種類を表す）\n「<u>ダイヤモンド</u>」の下線部＝<u>単体</u>（触れる物質）"
        },
        {
          "id": "p1_2B_step2_group_qlink",
          "label": "📝 このStepの確認問題",
          "step": 2,
          "subLabel": "3問",
          "explanation": "このStepに対応する演習・確認問題です。タップして解答画面へ移動できます。",
          "relatedQuestions": [
            { "id": "q_c1_2_B_3_1", "label": "Li" },
            { "id": "q_c1_2_B_3_4", "label": "Cu" },
            { "id": "q_c1_2_B_4_A_metal", "label": "化合物Aの金属元素" }
          ]
        }
      ]
    },
    {
      "id": "p1_2B_step3_group",
      "label": "【Step3：炎色反応】",
      "step": 3,
      "isGroup": true,
      "children": [
        {
          "id": "p1_2B_n10",
          "label": "炎色反応とは",
          "step": 3,
          "subLabel": "元素特有の色",
          "explanation": "<u>炎色反応</u>＝ある種類の元素を含む物質を炎の中に入れると、炎が<u>元素特有の色</u>になる反応。\n\n💡 花火の色はこの炎色反応を利用！"
        },
        {
          "id": "p1_2B_n11",
          "label": "7つの炎色（絶対暗記）",
          "step": 3,
          "subLabel": "リアカー無きK村…",
          "explanation": "<u>★ 覚え方「リアカー無きK村、動力借りるとするもくれない、馬力」★</u>\n\n元素 ｜ 炎色 ｜ 語呂\nLi（リチウム） ｜ 赤 ｜ リアカー\nNa（ナトリウム） ｜ 黄 ｜ 無き\nK（カリウム） ｜ 紫（赤紫） ｜ K村\nCu（銅） ｜ 青緑 ｜ 動力\nCa（カルシウム） ｜ 橙赤 ｜ 借りると\nSr（ストロンチウム） ｜ 紅（深赤） ｜ するも\nBa（バリウム） ｜ 黄緑 ｜ くれない\n\n💡 「馬力」は覚え方の一部で、Ba（バリウム）を強調して覚えるための語尾"
        },
        {
          "id": "p1_2B_n12",
          "label": "実験方法（白金線）",
          "step": 3,
          "subLabel": "検出の手順",
          "explanation": "<u>炎色反応の実験手順</u>\n\n❶ <u>白金線</u>を濃塩酸で洗い、バーナーの外炎に入れて色がつかないことを確認\n\n❷ 白金線に試料の水溶液をつけ、外炎の中に入れる\n\n❸ 出てくる炎の色を観察\n\n※ 白金線を使う理由：白金は炎色を示さず、化学的にも安定"
        },
        {
          "id": "p1_2B_step3_group_qlink",
          "label": "📝 このStepの確認問題",
          "step": 3,
          "subLabel": "3問",
          "explanation": "このStepに対応する演習・確認問題です。タップして解答画面へ移動できます。",
          "relatedQuestions": [
            { "id": "q_c1_2_B_5_1_chem", "label": "石灰水とCO₂" },
            { "id": "q_c1_2_B_5_4_chem", "label": "塩化銀" },
            { "id": "q_c1_2_B_5_5_chem", "label": "硫化鉛" }
          ]
        }
      ]
    },
    {
      "id": "p1_2B_step4_group",
      "label": "【Step4：成分元素の検出】",
      "step": 4,
      "isGroup": true,
      "children": [
        {
          "id": "p1_2B_n14",
          "label": "C・H・Cl・S の検出",
          "step": 4,
          "subLabel": "代表的な検出法",
          "explanation": "<u>液体や化合物に含まれる元素を調べる方法</u>：\n\n元素 ｜ 変換 ｜ 試薬 ｜ 結果\n炭素 C ｜ CO₂ に変える（加熱・燃焼） ｜ 石灰水 Ca(OH)₂ ｜ 白濁（CaCO₃生成）\n水素 H ｜ H₂O に変える ｜ 硫酸銅(Ⅱ)無水塩 CuSO₄ ｜ 青色（五水和物 CuSO₄·5H₂O に）\n塩素 Cl ｜ Cl⁻ に変える ｜ 硝酸銀 AgNO₃ 水溶液 ｜ 白色沈殿（AgCl 生成）\n硫黄 S ｜ S²⁻ に変える ｜ 酢酸鉛(Ⅱ) (CH₃COO)₂Pb 水溶液 ｜ 黒色沈殿（PbS 生成）\n\n💡 反応式もセットで覚える：\n\n・CO₂ + Ca(OH)₂ → CaCO₃ + H₂O\n\n・Ag⁺ + Cl⁻ → AgCl↓（白）\n\n・Pb²⁺ + S²⁻ → PbS↓（黒）"
        },
        {
          "id": "p1_2B_n15",
          "label": "応用：塩化コバルト紙による水の検出",
          "step": 4,
          "subLabel": "青→赤で水を検出",
          "explanation": "<u>塩化コバルト紙</u>：CoCl₂ をしみこませたろ紙\n\n乾燥時は<u>青色</u>、水に触れると<u>赤色（桃色）</u>に変化\n\n→ H の検出（H₂O の存在確認）に使える\n\n💡 硫酸銅(Ⅱ)無水塩と同じく、水と反応して色が変わる指示薬"
        }
      ]
    },
    {
      "id": "p1_2B_step5_group",
      "label": "【Step5：例題（炎色反応＋沈殿の応用）】",
      "step": 1,
      "isGroup": true,
      "children": [
        {
          "id": "p1_2B_n17",
          "label": "例題：化合物 X・Y の元素推定",
          "step": 1,
          "subLabel": "頻出パターン",
          "explanation": "<u>(あ)</u> 化合物Xの水溶液の炎色反応は<u>黄緑色</u>。硝酸銀水溶液で<u>白色沈殿</u>が生じた。X に含まれる元素は？\n\n→ 炎色黄緑＝<u>Ba</u>、白色沈殿＝<u>Cl</u>　答：<u>Ba と Cl</u>（BaCl₂ が考えられる）\n\n<u>(い)</u> 化合物Yを加熱すると、無色気体（石灰水を白濁）＋無色液体（青色塩化コバルト紙を赤変）＋白色固体（炎色黄色）が生じた。Y に含まれる元素は？\n\n→ 気体＝CO₂ で <u>C</u>、液体＝H₂O で <u>H</u>、炎色黄＝<u>Na</u>\n\n　答：<u>C・H・Na</u>（NaHCO₃ 炭酸水素ナトリウムが考えられる）\n\n💡 <u>解法のコツ</u>：観察された「色・沈殿・気体」から元素を1つずつ特定していく"
        }
      ]
    }
  ]
};

export const substanceTreeData = {
  "id": "p1_1_root",
  "label": "物質",
  "step": null,
  "explanation": "私たちの周りにあるすべてのものは<u>「物質」</u>でできています。物質は、その構成成分によって<u>「純物質」</u>と<u>「混合物」</u>に大きく分類されます。\n\n【基礎用語の定義】\n・<u>元素</u>：物質を構成する原子の種類。現在はおよそ120種類が存在する。\n・<u>元素記号</u>：元素を表すラテン語由来の文字。",
  "children": [
    {
      "id": "p1_1_step1_group",
      "label": "【Step1：物質の分類】",
      "step": 1,
      "isGroup": true,
      "children": [
        {
          "id": "p1_1_n1",
          "label": "純物質",
          "step": 1,
          "subLabel": "1種類の物質",
          "explanation": "<u>1種類の物質</u>だけでできているもの。固有の性質（融点・沸点・密度など）を持ち、<u>一つの化学式</u>で書くことができる。\n\n<u>例</u>：酸素 O₂、窒素 N₂、鉄 Fe、水 H₂O、塩化ナトリウム NaCl、ダイヤモンド C、ドライアイス CO₂",
          "relatedQuestions": [
            { "id": "p1_a", "label": "演習問題⓵－1(ア)" },
            { "id": "p1_i", "label": "演習問題⓵－1(イ)" },
            { "id": "p1_e", "label": "演習問題⓵－1(エ)" }
          ],
          "children": [
            {
              "id": "p1_1_n2",
              "label": "単体",
              "step": 1,
              "subLabel": "1種類の元素からなる純物質",
              "explanation": "<u>1種類の元素</u>からなる純物質。\n\n<u>例</u>：酸素 O₂、窒素 N₂、鉄 Fe、硫黄 S、銅 Cu、水銀 Hg（常温で液体・金属）、臭素 Br₂（常温で液体・非金属）\n\n💡 単体は<u>実際に触ることができる物質そのもの</u>を指す",
              "relatedQuestions": [
                { "id": "p1_u", "label": "演習問題⓵－1(ウ)" },
                { "id": "p2_1", "label": "問2(1) 酸素" },
                { "id": "p2_8", "label": "問2(8) 鉄" },
                { "id": "p2_13", "label": "問2(13) キセノン" }
              ]
            },
            {
              "id": "p1_1_n3",
              "label": "化合物",
              "step": 1,
              "subLabel": "2種類以上の元素からなる純物質",
              "explanation": "<u>2種類以上の元素</u>からなる純物質。\n\n<u>例</u>：水 H₂O、塩化ナトリウム NaCl、二酸化炭素 CO₂、<u>塩化水素 HCl</u> は化合物（<u>塩酸は塩化水素の水溶液＝混合物</u>と区別）",
              "relatedQuestions": [
                { "id": "p1_o", "label": "演習問題⓵－1(オ)" },
                { "id": "p2_3", "label": "問2(3) 塩化ナトリウム" },
                { "id": "p2_5", "label": "問2(5) アンモニア" },
                { "id": "p2_9", "label": "問2(9) プロパン" },
                { "id": "p2_11", "label": "問2(11) 水" },
                { "id": "p2_14", "label": "問2(14) 二酸化炭素" },
                { "id": "p2_15", "label": "問2(15) 炭酸水素ナトリウム" }
              ]
            }
          ]
        },
        {
          "id": "p1_1_n4",
          "label": "混合物",
          "step": 1,
          "subLabel": "2種類以上の純物質",
          "explanation": "<u>2種類以上の純物質</u>からなるもの。一つの化学式では書けない。\n\n<u>頻出例（暗記）</u>：空気（N₂+O₂+…）、海水、石油、<u>塩酸</u>（HCl水溶液）、食塩水、牛乳、ジュース、しょうゆ、みそ\n\n⚠️ <u>「塩化水素」は化合物、「塩酸」は混合物</u>という区別が頻出！",
          "relatedQuestions": [
            { "id": "p1_ki", "label": "演習問題⓵－1(キ)" },
            { "id": "p1_ku", "label": "演習問題⓵－1(ク)" },
            { "id": "p2_2", "label": "問2(2) 海水" },
            { "id": "p2_4", "label": "問2(4) 塩酸" },
            { "id": "p2_6", "label": "問2(6) 空気" },
            { "id": "p2_7", "label": "問2(7) 石油" },
            { "id": "p2_10", "label": "問2(10) ガソリン" },
            { "id": "p2_12", "label": "問2(12) 木材" }
          ]
        }
      ]
    },
    {
      "id": "p1_1_step2_group",
      "label": "【Step2：純物質と混合物の性質（融点・沸点・密度）】",
      "step": 2,
      "isGroup": true,
      "children": [
        {
          "id": "p1_1_n6",
          "label": "純物質の性質",
          "step": 2,
          "subLabel": "値は一定",
          "explanation": "純物質は<u>融点・沸点・密度などの値が物質ごとに一定</u>になる。\n\n例：水は1気圧で 融点 0℃、沸点 100℃、密度 1.0 g/cm³",
          "relatedQuestions": [
            { "id": "p1_ke", "label": "演習問題⓵－1(ケ)" }
          ]
        },
        {
          "id": "p1_1_n7",
          "label": "混合物の性質",
          "step": 2,
          "subLabel": "値は変化する",
          "explanation": "混合物は<u>混じっている物質の種類や割合によって値が変化</u>する。\n\n🔥【水とエタノールの混合物の加熱グラフ】\n\n温度↑\n\n　│　　　　　　　　／￣￣￣\n\n　│　　　／￣＼／\n\n　│　／（沸点が一定にならず変化する）\n\n　└─────→ 時間\n\n※純物質なら沸点で温度が一定に保たれるが、混合物は温度が連続的に変化する",
          "relatedQuestions": [
            { "id": "p1_ka", "label": "演習問題⓵－1(カ)" },
            { "id": "p1_ko", "label": "演習問題⓵－1(コ)" },
            { "id": "p1_sa", "label": "演習問題⓵－1(サ)" }
          ]
        },
        {
          "id": "p1_1_n8",
          "label": "見分け方まとめ表",
          "step": 2,
          "subLabel": "頻出パターン",
          "explanation": "特徴 ｜ 純物質 ｜ 混合物\n化学式 ｜ 1つで書ける ｜ 書けない\n融点・沸点 ｜ 一定 ｜ 一定でない\n密度 ｜ 一定 ｜ 比によって変化\n例 ｜ H₂O、Fe、NaCl ｜ 空気、海水、塩酸"
        }
      ]
    },
    {
      "id": "p1_1_step3_group",
      "label": "【Step3：単体と元素の識別】",
      "step": 3,
      "isGroup": true,
      "children": [
        {
          "id": "p1_1_n10",
          "label": "単体",
          "step": 3,
          "subLabel": "実在する物質＝触れる",
          "explanation": "<u>単体</u>＝実際に存在する物質、<u>直接的に触ることができる</u>。\n\n💡 例：「酸素は水に溶けにくい」→気体O₂そのものに触れる⇒単体"
        },
        {
          "id": "p1_1_n11",
          "label": "元素",
          "step": 3,
          "subLabel": "構成成分＝触れない",
          "explanation": "<u>元素</u>＝物質の構成成分、<u>直接的に触ることはできない</u>。\n\n💡 例：「食塩にはナトリウムと塩素が含まれる」→Naは単体ではなく構成成分⇒元素"
        },
        {
          "id": "p1_1_n12",
          "label": "例題で確認",
          "step": 3,
          "subLabel": "下線部は単体？元素？",
          "explanation": "<u>次の下線部が単体か元素か答えよ</u>\n\n(1) <u>酸素</u>は水に溶けにくい。→<u>単体</u>（O₂に触れる）\n\n(2) 食塩には<u>ナトリウム</u>と塩素が含まれている。→<u>元素</u>（構成成分）\n\n(3) 植物の生育には<u>窒素</u>が欠かせない。→<u>元素</u>（栄養素として）\n\n(4) 黄リンも赤リンも、リンの<u>同素体</u>である。→<u>元素</u>（種類を表す）\n\n(5) 水を電気分解すると、<u>水素</u>と酸素を生じる。→<u>単体</u>（H₂が発生）\n\n(6) 砂糖は、<u>炭素</u>や水素、酸素からなる物質である。→<u>元素</u>（構成成分）\n\n(7) 乾燥空気の体積の約78%は<u>窒素</u>である。→<u>単体</u>（N₂分子）\n\n(8) 骨には<u>カルシウム</u>が含まれている。→<u>元素</u>（構成成分）\n\n💡 <u>見分け方のコツ</u>：物質を指す文脈（触れる／気体・液体・固体そのもの）→単体／成分・栄養素・含まれる／種類→元素"
        },
        {
          "id": "p1_1_step3_group_qlink",
          "label": "📝 このStepの確認問題",
          "step": 3,
          "subLabel": "16問",
          "explanation": "このStepに対応する演習・確認問題です。タップして解答画面へ移動できます。",
          "relatedQuestions": [
            { "id": "q3_1", "label": "演習問題⓵－3(1)" },
            { "id": "q3_3", "label": "演習問題⓵－3(3)" },
            { "id": "q3_5", "label": "演習問題⓵－3(5)" },
            { "id": "p3_1", "label": "類題⓵－3(1)" },
            { "id": "p3_4", "label": "類題⓵－3(4)" },
            { "id": "p3_5", "label": "類題⓵－3(5)" },
            { "id": "p3_8", "label": "類題⓵－3(8)" },
            { "id": "p3_9", "label": "類題⓵－3(9)" },
            { "id": "p3_10", "label": "類題⓵－3(10)" },
            { "id": "q3_2", "label": "演習問題⓵－3(2)" },
            { "id": "q3_4", "label": "演習問題⓵－3(4)" },
            { "id": "q3_6", "label": "演習問題⓵－3(6)" },
            { "id": "p3_2", "label": "類題⓵－3(2)" },
            { "id": "p3_3", "label": "類題⓵－3(3)" },
            { "id": "p3_6", "label": "類題⓵－3(6)" },
            { "id": "p3_7", "label": "類題⓵－3(7)" }
          ]
        }
      ]
    }
  ]
};

export const separationTreeData = {
  "id": "p1_2A_root",
  "label": "混合物の分離",
  "step": null,
  "explanation": "混合物から不純物を除き、目的の純物質を取り出す操作を分離、分離した物質の純度をより高める操作を精製といいます。\n物理的な性質（沸点、溶解度、吸着力など）の違いを利用します。",
  "children": [
    {
      "id": "p1_2A_step1_group",
      "label": "【Step1：分離と精製の基本】",
      "step": 1,
      "isGroup": true,
      "children": [
        {
          "id": "p1_2A_n1",
          "label": "分離",
          "step": 1,
          "subLabel": "混合物から取り出す",
          "explanation": "<u>分離</u>＝混合物から欲しい物質を取り出す操作。"
        },
        {
          "id": "p1_2A_n2",
          "label": "精製",
          "step": 1,
          "subLabel": "さらに純粋にする",
          "explanation": "<u>精製</u>＝分離された物質をさらに純粋にすること。\n\n💡 分離＋精製 で「純物質を得る」流れ"
        },
        {
          "id": "p1_2A_n3",
          "label": "7つの分離法一覧",
          "step": 1,
          "subLabel": "早見表",
          "explanation": "分離法 ｜ 利用する性質 ｜ 頻出例\nろ過 ｜ 粒の大きさ ｜ 砂を含む水→砂と水\n再結晶 ｜ 溶解度の温度差 ｜ 不純物を含むKNO₃\n蒸留 ｜ 沸点の差 ｜ NaCl水溶液→水\n分留 ｜ 沸点の差（複数） ｜ 原油（石油の精製）\n昇華法 ｜ 昇華のしやすさ ｜ 砂とヨウ素→ヨウ素\n抽出 ｜ 溶媒への溶解度差 ｜ 茶葉から茶成分\nクロマトグラフィー ｜ 吸着力の差 ｜ 水性インクの色素分離"
        },
        {
          "id": "p1_2A_step1_group_qlink",
          "label": "📝 このStepの確認問題",
          "step": 1,
          "subLabel": "1問",
          "explanation": "このStepに対応する演習・確認問題です。タップして解答画面へ移動できます。",
          "relatedQuestions": [
            { "id": "q2_1", "label": "演習問題①-2(ろ過)" }
          ]
        }
      ]
    },
    {
      "id": "p1_2A_step2_group",
      "label": "【Step2：基本の分離法（固体と液体）】",
      "step": 2,
      "isGroup": true,
      "children": [
        {
          "id": "p1_2A_n5",
          "label": "ろ過",
          "step": 2,
          "subLabel": "固体と液体の分離",
          "explanation": "<u>ろ過</u>＝固体と液体の混合物から、ろ紙などを用いて<u>固体を分離</u>する操作。\n\nろ液…ろ紙を通過した液体。\n\n<u>例</u>：砂を含む水溶液から砂を分離\n\n<u>注意点（３つ必須）</u>\n\n① <u>ガラス棒に伝わらせて注ぐ</u>（液が飛び散らないように）\n\n② <u>ろうとの足を内壁につける</u>（毛細管現象を利用）\n\n③ <u>ガラス棒はろ紙につける</u>（三重に重なった側に）\n\n🧪【ろ過の装置】\n\nビーカー\n\n　│（ガラス棒）\n\n　▼\n\nろうと（ろ紙）→足を内壁につける\n\n　│\n\n　▼\n\nろ液（受けビーカー）"
        },
        {
          "id": "p1_2A_n6",
          "label": "再結晶",
          "step": 2,
          "subLabel": "溶解度の違いを利用",
          "explanation": "<u>再結晶</u>＝少量の不純物を含む固体を<u>熱水に溶かし、冷却</u>して目的の物質を結晶として得る。\n\n<u>例</u>：少量の硫酸銅(Ⅱ)五水和物を含む混合物から硝酸カリウム KNO₃ を分離\n\n<u>原理</u>：温度による<u>溶解度の変化</u>を利用\n\n　→ KNO₃は温度で溶解度が大きく変化（冷やすと結晶が出る）\n\n　→ 不純物は溶解度が小さく、少量なので溶けたまま残る",
          "relatedQuestions": [
            { "id": "q2_5", "label": "演習問題①-2(再結)" }
          ]
        },
        {
          "id": "p1_2A_step2_group_qlink",
          "label": "📝 このStepの確認問題",
          "step": 2,
          "subLabel": "2問",
          "explanation": "このStepに対応する演習・確認問題です。タップして解答画面へ移動できます。",
          "relatedQuestions": [
            { "id": "q2_2", "label": "演習問題①-2(蒸留)" },
            { "id": "q2_3", "label": "演習問題①-2(分留)" }
          ]
        }
      ]
    },
    {
      "id": "p1_2A_step3_group",
      "label": "【Step3：沸点の違いを利用】",
      "step": 3,
      "isGroup": true,
      "children": [
        {
          "id": "p1_2A_n8",
          "label": "蒸留",
          "step": 3,
          "subLabel": "沸点の違いで液体を分離",
          "explanation": "<u>蒸留</u>＝沸点の違いを利用して、固体が溶けた液体や液体同士の混合物を加熱・沸騰させ、その蒸気を冷却して<u>沸点の低い成分</u>を分離する操作。\n\n<u>例</u>：NaCl水溶液から水を分離\n\n<u>★５つの注意点（受験頻出！）★</u>\n\n① <u>沸騰石</u>を入れる → 突沸（急な沸騰）を防ぐ\n\n② 枝付きフラスコ内の液量は<u>半分以下</u>\n\n③ 温度計の球部は<u>枝の付け根</u>付近 → 枝に向かう蒸気の温度を測るため\n\n④ 冷却水は<u>下から上</u>へ流す → 冷却器内を水で満たすため\n\n⑤ 三角フラスコは<u>密閉しない</u> → 圧力上昇による破裂防止\n\n🧪【蒸留装置】\n\n[枝付きフラスコ＋温度計（枝の付け根）] → [リービッヒ冷却器（水：下→上）] → [三角フラスコ（密閉しない）]\n\n　↑沸騰石を入れる　　　　　　　　　　　　　　　　　↑蒸気が冷却され液体に戻る"
        },
        {
          "id": "p1_2A_n9",
          "label": "分留（分別蒸留）",
          "step": 3,
          "subLabel": "沸点の異なる液体を順次蒸留",
          "explanation": "<u>分留</u>＝沸点の異なる2種類以上の液体混合物を加熱し、<u>異なる温度で順次蒸留</u>して分離する。\n\n<u>★共通テスト頻出：原油の分留（製油所の精留塔）★</u>\n\n沸点 低 → 高 の順（塔の上から下へ）\n\n① <u>石油ガス・LPガス</u>（〜30℃）\n\n② <u>ナフサ（粗製ガソリン）</u>（30〜180℃）\n\n③ <u>灯油</u>（170〜250℃）\n\n④ <u>軽油</u>（240〜350℃）\n\n⑤ <u>重油（残油）</u>（350℃以上）\n\n💡 覚え方：<u>「LP・ナフサ・灯油・軽油・重油」＝ 「エル・ナ・トウ・ケイ・ジュウ」</u> と唱えて暗記"
        },
        {
          "id": "p1_2A_step3_group_qlink",
          "label": "📝 このStepの確認問題",
          "step": 3,
          "subLabel": "3問",
          "explanation": "このStepに対応する演習・確認問題です。タップして解答画面へ移動できます。",
          "relatedQuestions": [
            { "id": "q2_4", "label": "演習問題①-2(昇華)" },
            { "id": "q2_6", "label": "演習問題①-2(抽出)" },
            { "id": "q2_7", "label": "演習問題①-2(クロマト)" }
          ]
        }
      ]
    },
    {
      "id": "p1_2A_step4_group",
      "label": "【Step4：特殊な性質を利用】",
      "step": 4,
      "isGroup": true,
      "children": [
        {
          "id": "p1_2A_n11",
          "label": "昇華法",
          "step": 4,
          "subLabel": "昇華しやすい固体を分離",
          "explanation": "<u>昇華法</u>＝昇華しやすい固体を含む混合物を加熱し、<u>昇華して生じた気体を冷却</u>して分離。\n\n<u>必ず覚える</u>：<u>砂とヨウ素</u>の混合物→<u>ヨウ素を昇華</u>させて分離\n\n<u>昇華しやすい物質３つ</u>：<u>ドライアイス CO₂・ヨウ素 I₂・ナフタレン C₁₀H₈</u>\n\n💡 <u>覚え方「ドライ・ヨード・ナフタ」</u> で3つセット暗記"
        },
        {
          "id": "p1_2A_n12",
          "label": "抽出",
          "step": 4,
          "subLabel": "溶媒に溶ける成分のみ取り出す",
          "explanation": "<u>抽出</u>＝混合物に適切な溶媒を加えて、<u>目的物質だけを溶かして分離</u>する。\n\n<u>絶対覚える２つの例</u>\n\n① <u>ヨウ素とヨウ化カリウム</u>を含む水溶液からヨウ素をヘキサンで分離\n\n② <u>茶葉に湯を注ぎ</u>、湯に溶ける成分のみを溶かし出す（お茶を淹れる原理）\n\n💡 抽出は「<u>分液ろうと</u>」を使うことも頻出（有機化学で再登場）"
        },
        {
          "id": "p1_2A_n13",
          "label": "クロマトグラフィー",
          "step": 4,
          "subLabel": "吸着力の違いで分離",
          "explanation": "<u>クロマトグラフィー</u>＝<u>吸着力の違い</u>を利用して物質を分離。\n\n<u>例</u>：水性インクをつけたろ紙の先端を水に浸し、各色素に分離（＝<u>ペーパークロマトグラフィー</u>）\n\n<u>その他の種類</u>\n\n・カラムクロマトグラフィー：シリカゲル等を詰めたカラムに溶媒と混合物を流す\n\n・ガスクロマトグラフィー：気体にしてヘリウム・アルゴンなどと吸着剤の中を移動"
        }
      ]
    },
    {
      "id": "p1_2A_step5_group",
      "label": "【Step5：分離法の見分け・例題】",
      "step": 1,
      "isGroup": true,
      "children": [
        {
          "id": "p1_2A_n15",
          "label": "識別問題のポイント",
          "step": 1,
          "subLabel": "頻出パターン",
          "explanation": "<u>分離法を識別する例題</u>：下線部が正しいものを選べ。\n\n① 溶媒への溶解度の違いを利用→<u>抽出</u> ✓\n\n② 沸点の差を利用→蒸留（昇華法ではない） ✗\n\n③ 固体と液体をろ紙で分離→ろ過（再結晶ではない） ✗\n\n④ 固体→気体（昇華）→冷却→昇華法（蒸留ではない） ✗\n\n💡 <u>まとめ表：分離法と利用する性質</u>\n\n・再結晶＝温度による<u>溶解度</u>の変化\n\n・蒸留・分留＝<u>沸点</u>の差\n\n・昇華法＝<u>昇華</u>のしやすさ\n\n・抽出＝溶媒への<u>溶解度</u>差\n\n・クロマトグラフィー＝<u>吸着力</u>の差\n\n・ろ過＝粒の大きさ"
        },
        {
          "id": "p1_2A_n16",
          "label": "応用例題（分離手順）",
          "step": 1,
          "subLabel": "複数の分離法を組み合わせる",
          "explanation": "<u>例題</u>：ヨウ素・塩化ナトリウム・砂の混合物からそれぞれを分離するには？\n\n<u>解答手順</u>：\n\n❶ 混合物に水を加えて NaCl を溶かす\n\n❷ <u>ろ過</u>：水溶液（NaCl水溶液）と砂＋ヨウ素に分離\n\n❸ 砂＋ヨウ素を加熱：<u>昇華法</u>でヨウ素を分離、砂が残る\n\n❹ NaCl水溶液を<u>蒸留</u>または蒸発乾固→ NaCl を得る\n\n→ <u>ろ過 → 昇華法 → 蒸留</u> の順で分離\n\n💡 「性質の異なる物質」の混合物は<u>複数の分離法を組み合わせる</u>のがコツ！"
        }
      ]
    }
  ]
};

export const thermalMotionTreeData = {
  "id": "p1_3_root",
  "label": "熱運動と状態変化",
  "step": null,
  "explanation": "すべての物質は粒子からできており、その粒子は熱運動と呼ばれる不規則な運動をしています。温度と状態変化の関係を整理しましょう。",
  "children": [
    {
      "id": "p1_3_step1_group",
      "label": "【Step1：熱運動と温度】",
      "step": 1,
      "isGroup": true,
      "children": [
        {
          "id": "p1_3_n1",
          "label": "気体の拡散",
          "step": 1,
          "subLabel": "粒子が自然に散らばる",
          "explanation": "<u>気体の拡散</u>＝物質の構成粒子が自然に散らばっていく現象。\n\n<u>例</u>：別々の容器に入った窒素と臭素を接続→やがて均一な混合気体になる\n\n<u>例</u>：香水の匂いが部屋全体に広がる\n\n💡 拡散が起こる理由＝粒子が絶えず<u>熱運動</u>しているから"
        },
        {
          "id": "p1_3_n2",
          "label": "熱運動",
          "step": 1,
          "subLabel": "粒子の不規則な運動",
          "explanation": "<u>熱運動</u>＝物質を構成する粒子が行っている<u>不規則な運動</u>。\n\n・すべての粒子が同じ速さではない（分布がある）\n\n・<u>高温になるほど速さの平均値は大きくなる</u>",
          "relatedQuestions": [
            { "id": "q_c1_3_1_a", "label": "演習問題①-3(熱運動)" }
          ]
        },
        {
          "id": "p1_3_n3",
          "label": "温度の換算公式",
          "step": 1,
          "subLabel": "セ氏温度↔絶対温度",
          "explanation": "<u>セルシウス温度</u>＝℃で表す温度\n\n<u>絶対温度</u>＝K（ケルビン）で表す温度\n\n<u>【公式】T（絶対温度・K）＝ 273 ＋ t（セルシウス温度・℃）</u>\n\n<u>絶対零度</u>＝すべての粒子が熱運動をしなくなる温度\n\n　セルシウス温度 <u>−273℃</u> ＝ 絶対温度 <u>0 K</u>\n\n🌡️【温度換算の例】\n\n0 ℃ ⇔ 273 K\n\n25 ℃ ⇔ 298 K（室温）\n\n100 ℃ ⇔ 373 K（水の沸点）\n\n−273 ℃ ⇔ 0 K（絶対零度）"
        },
        {
          "id": "p1_3_step1_group_qlink",
          "label": "📝 このStepの確認問題",
          "step": 1,
          "subLabel": "1問",
          "explanation": "このStepに対応する演習・確認問題です。タップして解答画面へ移動できます。",
          "relatedQuestions": [
            { "id": "q_c1_3_2_1", "label": "演習問題①-3(絶対温度)" }
          ]
        }
      ]
    },
    {
      "id": "p1_3_step2_group",
      "label": "【Step2：物質の三態】",
      "step": 2,
      "isGroup": true,
      "children": [
        {
          "id": "p1_3_n5",
          "label": "物質の三態",
          "step": 2,
          "subLabel": "固体・液体・気体",
          "explanation": "<u>物質の三態</u>＝同じ物質で、温度などの条件を変化させた<u>固体・液体・気体</u>の３つの状態。\n\n⏬【三態の比較表】\n\n ｜ 固体 ｜ 液体 ｜ 気体\n粒子間距離 ｜ 小・引力大 ｜ やや小・引力あり ｜ 非常に大・引力ほぼなし\n熱運動 ｜ 小（その場で振動） ｜ 大（自由に動く） ｜ 非常に大（自由に飛ぶ）\n形 ｜ 一定 ｜ 容器に応じ変化 ｜ 容器に応じ変化\n体積 ｜ 一定 ｜ ほぼ一定 ｜ 温度・圧力で大きく変化"
        },
        {
          "id": "p1_3_n6",
          "label": "状態が決まる原理",
          "step": 2,
          "subLabel": "引力 vs 熱運動",
          "explanation": "<u>物質を構成する粒子間の引力と熱運動の大小関係で状態が決まる</u>。\n\n・低温＝引力 >> 熱運動 → <u>固体</u>（粒子が固定される）\n\n・中温＝引力 ≒ 熱運動 → <u>液体</u>（動くが密集）\n\n・高温＝引力 << 熱運動 → <u>気体</u>（自由に飛び回る）"
        }
      ]
    },
    {
      "id": "p1_3_step3_group",
      "label": "【Step3：状態変化の名称】",
      "step": 3,
      "isGroup": true,
      "children": [
        {
          "id": "p1_3_n8",
          "label": "状態変化の6つの名前",
          "step": 3,
          "subLabel": "融解・凝固・蒸発・凝縮・昇華・凝華",
          "explanation": "<u>状態変化</u>＝物質が固体・液体・気体と状態を変えること。\n\n🔥【三態と状態変化の相互関係】\n\n　　　　　　昇華 →\n\n　　┌───────────┐\n\n　　│　　　　　　　　　│\n\n　固体 ⇄ 液体 ⇄ 気体\n\n　　│ 融解／凝固 │ 蒸発／凝縮 │\n\n　　│　　　　　　　　　│\n\n　　└───────────┘\n\n　　　　　← 凝華（気→固）\n\n名称 ｜ 変化 ｜ 例\n融解 ｜ 固 → 液 ｜ 氷が水になる\n凝固 ｜ 液 → 固 ｜ 水が氷になる\n蒸発 ｜ 液 → 気 ｜ 水が水蒸気になる\n凝縮 ｜ 気 → 液 ｜ 水蒸気が水になる（結露）\n昇華 ｜ 固 → 気 ｜ ドライアイスが二酸化炭素気体に\n凝華 ｜ 気 → 固 ｜ 霜（水蒸気→氷）\n\n💡 昇華と凝華は<u>ペアで覚える</u>（旧課程では両方「昇華」だった）"
        },
        {
          "id": "p1_3_n9",
          "label": "融点・沸点",
          "step": 3,
          "subLabel": "状態変化中は温度一定",
          "explanation": "<u>融点</u>＝固体が融解（液体になる）ときの温度\n\n<u>沸点</u>＝液体が沸騰（内部からの蒸発）するときの温度\n\n💡 <u>状態変化が終わるまで、温度は一定に保たれる</u>（融解熱・蒸発熱として熱が吸収される）\n\n📈【加熱曲線】\n\n温度↑\n\n　│　　　　　　　　　　＿＿＿\n\n　│　沸点━━━━━━（気体化中）\n\n　│　　　　＿＿／\n\n　│　融点━━━（融解中）\n\n　│　＿／\n\n　└─────────────→ 時間\n\n※純物質は融点・沸点で温度が一定になる"
        },
        {
          "id": "p1_3_step3_group_qlink",
          "label": "📝 このStepの確認問題",
          "step": 3,
          "subLabel": "3問",
          "explanation": "このStepに対応する演習・確認問題です。タップして解答画面へ移動できます。",
          "relatedQuestions": [
            { "id": "q_c1_3_3_a", "label": "演習問題①-3(状態変化)" },
            { "id": "q_c1_3_4_ans", "label": "演習問題①-3(物理変化・化学変化)" },
            { "id": "q_c1_3_7_ans", "label": "演習問題①-3(三態モデルとエネルギー)" }
          ]
        }
      ]
    },
    {
      "id": "p1_3_step4_group",
      "label": "【Step4：物理変化と化学変化】",
      "step": 4,
      "isGroup": true,
      "children": [
        {
          "id": "p1_3_n11",
          "label": "物理変化と化学変化の違い",
          "step": 4,
          "subLabel": "物質が変わる？変わらない？",
          "explanation": "｜ 物理変化 ｜ 化学変化\n定義 ｜ 物質そのものは変わらず、状態のみが変わる ｜ 原子の組み合わせが変わり、別の物質になる\n例 ｜ 水の蒸発、氷が溶ける、鉄を叩いて薄くする ｜ 木の燃焼、鉄が錆びる、水の電気分解\n元に戻る？ ｜ 基本、条件を戻せば戻る ｜ 基本、元には戻らない\n\n💡 <u>状態変化はすべて物理変化</u>！（水⇔氷⇔水蒸気は同じH₂O）"
        },
        {
          "id": "p1_3_n12",
          "label": "例題：物理変化と化学変化の判別",
          "step": 4,
          "subLabel": "頻出",
          "explanation": "<u>次はどちらか答えよ</u>\n\n(1) ドライアイスが気体になる → <u>物理変化</u>（昇華、CO₂のまま）\n\n(2) ロウソクが燃える → <u>化学変化</u>（C・H が O₂ と反応、CO₂・H₂O ができる）\n\n(3) 鉄がさびる → <u>化学変化</u>（Fe → Fe₂O₃）\n\n(4) 塩水を蒸発させて塩が残る → <u>物理変化</u>（NaCl のまま）\n\n(5) 電気分解で水から水素と酸素 → <u>化学変化</u>（H₂O → H₂ + O₂）"
        }
      ]
    }
  ]
};

export const atomicStructureTreeData = {
  "id": "p2_1_root",
  "label": "原子の構造",
  "step": null,
  "explanation": "原子は極めて小さく、複雑な構造や規則的な性質を持っています。まずは原子の基本構成から順に整理しましょう。",
  "children": [
    {
      "id": "p2_1_step1_group",
      "label": "【Step1：原子の構造】",
      "step": 1,
      "isGroup": true,
      "children": [
        {
          "id": "p2_1_n1",
          "label": "原子",
          "step": 1,
          "subLabel": "物質の基本粒子",
          "explanation": "<u>原子</u>＝物質を構成する基本粒子。直径は<u>約10⁻¹⁰ m</u>程度。\n\n🔬【原子の構造】\n\n原子（10⁻¹⁰ m）\n\n　├─ 原子核（10⁻¹⁵〜10⁻¹⁴ m）\n\n　│　　├─ <u>陽子</u>（＋電荷）\n\n　│　　└─ <u>中性子</u>（電荷なし）\n\n　└─ <u>電子</u>（−電荷、原子核の周りに分布）"
        },
        {
          "id": "p2_1_n2",
          "label": "原子核",
          "step": 1,
          "subLabel": "陽子＋中性子",
          "explanation": "<u>原子核</u>＝陽子と中性子からなり、原子の中心に存在。\n\n・直径は約 <u>10⁻¹⁵〜10⁻¹⁴ m</u>（原子の<u>1/10万</u>ほど）\n\n・原子の<u>質量はほぼ原子核の質量</u>に等しい（陽子・中性子の数にほぼ比例）",
          "relatedQuestions": [
            { "id": "q_c2_1_1_a", "label": "問1(ア) 原子核" }
          ]
        },
        {
          "id": "p2_1_n3",
          "label": "陽子・中性子・電子の性質",
          "step": 1,
          "subLabel": "まとめ表",
          "explanation": "粒子 ｜ 電荷 ｜ 質量比 ｜ 場所\n陽子 ｜ ＋1 ｜ 1 ｜ 原子核\n中性子 ｜ 0 ｜ 1 ｜ 原子核\n電子 ｜ −1 ｜ 1/1840 ｜ 電子殻（原子核の外側）\n\n<u>★ 原子の性質まとめ ★</u>\n\n① 陽子の数 ＝ 電子の数 → <u>電気的に中性</u>\n\n② 陽子と電子は絶対値が等しい正・負の電荷（電気素量）\n\n③ 質量 ≒ 原子核の質量（電子は非常に軽い）"
        },
        {
          "id": "p2_1_step1_group_qlink",
          "label": "📝 このStepの確認問題",
          "step": 1,
          "subLabel": "39問",
          "explanation": "このStepに対応する演習・確認問題です。タップして解答画面へ移動できます。",
          "relatedQuestions": [
            { "id": "q_c2_1_1_u", "label": "問1(ウ) 陽子" },
            { "id": "q_c2_1_2_1a", "label": "問2(1)(a) Hの陽子数" },
            { "id": "q_c2_1_2_2a", "label": "問2(2)(a) Cの陽子数" },
            { "id": "q_c2_1_2_3a", "label": "問2(3)(a) Oの陽子数" },
            { "id": "q_c2_1_2_4a", "label": "問2(4)(a) Naの陽子数" },
            { "id": "q_c2_1_2_5a", "label": "問2(5)(a) Clの陽子数" },
            { "id": "q_c2_1_2_6a", "label": "問2(6)(a) Arの陽子数" },
            { "id": "q_c2_1_7_1p", "label": "問7(1p) 陽子数計算" },
            { "id": "q_c2_1_1_e", "label": "問1(エ) 中性子" },
            { "id": "q_c2_1_2_1b", "label": "問2(1)(b) Hの中性子数" },
            { "id": "q_c2_1_2_2b", "label": "問2(2)(b) Cの中性子数" },
            { "id": "q_c2_1_2_3b", "label": "問2(3)(b) Oの中性子数" },
            { "id": "q_c2_1_2_4b", "label": "問2(4)(b) Naの中性子数" },
            { "id": "q_c2_1_2_5b", "label": "問2(5)(b) Clの中性子数" },
            { "id": "q_c2_1_2_6b", "label": "問2(6)(b) Arの中性子数" },
            { "id": "q_c2_1_7_1n", "label": "問7(1n) 中性子数計算" },
            { "id": "q_c2_1_1_i", "label": "問1(イ) 電子" },
            { "id": "q_c2_1_1_o", "label": "問1(オ) 直径10⁻¹⁰m" },
            { "id": "q_c2_1_1_ka", "label": "問1(カ) サイズ比率" },
            { "id": "q_c2_1_2_1c", "label": "問2(1)(c) Hの電子数" },
            { "id": "q_c2_1_2_2c", "label": "問2(2)(c) Cの電子数" },
            { "id": "q_c2_1_2_3c", "label": "問2(3)(c) Oの電子数" },
            { "id": "q_c2_1_2_4c", "label": "問2(4)(c) Naの電子数" },
            { "id": "q_c2_1_2_5c", "label": "問2(5)(c) Clの電子数" },
            { "id": "q_c2_1_2_6c", "label": "問2(6)(c) Arの電子数" },
            { "id": "q_c2_1_1_ta", "label": "問1(タ) 族" },
            { "id": "q_c2_1_1_chi", "label": "問1(チ) 周期" },
            { "id": "q_c2_1_4_1", "label": "問4(1) 同じ族の価電子数" },
            { "id": "q_c2_1_4_4", "label": "問4(4) 典型と遷移の説明" },
            { "id": "q_c2_1_6_a2", "label": "問6(A2) 単体分類" },
            { "id": "q_c2_1_6_b2", "label": "問6(B2) 単体分類" },
            { "id": "q_c2_1_6_c2", "label": "問6(C2) 単体分類" },
            { "id": "q_c2_1_6_d2", "label": "問6(D2) 単体分類" },
            { "id": "q_c2_1_6_e2", "label": "問6(E2) 単体分類" },
            { "id": "q_c2_1_6_f2", "label": "問6(F2) 単体分類" },
            { "id": "q_c2_1_1_tsu", "label": "問1(ツ) アルカリ" },
            { "id": "q_c2_1_1_te", "label": "問1(テ) ハロゲン" },
            { "id": "q_c2_1_1_to", "label": "問1(ト) 貴ガス" },
            { "id": "q_c2_1_4_2", "label": "問4(2) アルゴン Ar" }
          ]
        }
      ]
    },
    {
      "id": "p2_1_step2_group",
      "label": "【Step2：原子番号・質量数・同位体】",
      "step": 2,
      "isGroup": true,
      "children": [
        {
          "id": "p2_1_n5",
          "label": "原子番号",
          "step": 2,
          "subLabel": "陽子の数",
          "explanation": "<u>原子番号</u>＝元素ごとに決まっている<u>陽子の数</u>（＝中性の原子では電子の数）。\n\n<u>記法</u>：左下に原子番号、左上に質量数\n\n<u>例</u>： ₁¹H　（原子番号1、質量数1の水素）\n\n<u>例</u>： ₆¹²C　（原子番号6、質量数12の炭素）"
        },
        {
          "id": "p2_1_n6",
          "label": "質量数",
          "step": 2,
          "subLabel": "陽子＋中性子",
          "explanation": "<u>質量数</u>＝<u>陽子の数 ＋ 中性子の数</u>。\n\n<u>【公式】質量数 ＝ 陽子の数 ＋ 中性子の数</u>\n\n<u>例</u>：₁₇³⁵Cl → 陽子17個、中性子18個、質量数35\n\n<u>例</u>：₁₇³⁷Cl → 陽子17個、中性子20個、質量数37"
        },
        {
          "id": "p2_1_n7",
          "label": "同位体（アイソトープ）",
          "step": 2,
          "subLabel": "陽子同じ・中性子違い",
          "explanation": "<u>同位体（アイソトープ）</u>＝<u>原子番号（＝陽子の数）が同じ</u>だが、<u>中性子の数（＝質量数）が異なる</u>原子どうし。\n\n<u>例</u>：¹²C・¹³C・¹⁴C はすべて炭素の同位体\n\n<u>例</u>：¹H・²H（重水素D）・³H（三重水素T）\n\n💡 化学的性質はほぼ同じ（電子配置が同じだから）。ただし質量が違うため、物理的性質は少し異なる。"
        },
        {
          "id": "p2_1_n8",
          "label": "放射性同位体・壊変",
          "step": 2,
          "subLabel": "α線・β線・γ線",
          "explanation": "<u>壊変（崩壊）</u>＝原子核が自発的に放射線を放って別の原子核になる現象\n\n<u>放射能</u>＝原子核が放射線を放つ性質\n\n<u>放射性同位体</u>＝放射能をもつ同位体\n\n放射線 ｜ 性質 ｜ 実体 ｜ 透過度\nα線 ｜ 原子番号−2・質量数−4 ｜ He原子核 ｜ 弱（紙で止まる）\nβ線 ｜ 原子番号＋1 ｜ 電子 ｜ 中（アルミで止まる）\nγ線 ｜ エネルギー低下のみ ｜ 電磁波 ｜ 大（鉛が必要）"
        },
        {
          "id": "p2_1_n9",
          "label": "半減期",
          "step": 2,
          "subLabel": "量が半分になる時間",
          "explanation": "<u>半減期</u>＝放射性同位体が壊変して元の量の半分になるのに要する時間。\n\n例：<u>¹⁴C の半減期 ＝ 5730年</u>（考古学の年代測定に使う）\n\n例：<u>²³⁸U の半減期 ＝ 約45億年</u>\n\n<u>例題</u>：木材中の¹⁴Cが大気中の1/4に減少→何年前？\n\n1 → 1/2 → 1/4 で2回半減 ⇒ 5730 × 2 ＝ <u>11460年前</u>\n\n💡 <u>n回半減後の量 ＝ 元の量 × (1/2)ⁿ</u>"
        },
        {
          "id": "p2_1_step2_group_qlink",
          "label": "📝 このStepの確認問題",
          "step": 2,
          "subLabel": "12問",
          "explanation": "このStepに対応する演習・確認問題です。タップして解答画面へ移動できます。",
          "relatedQuestions": [
            { "id": "q_c2_1_1_ki", "label": "問1(キ) 原子番号" },
            { "id": "q_c2_1_1_ku", "label": "問1(ク) 質量数" },
            { "id": "q_c2_1_2_1d", "label": "問2(1)(d) Hの質量数" },
            { "id": "q_c2_1_2_2d", "label": "問2(2)(d) Cの質量数" },
            { "id": "q_c2_1_2_3d", "label": "問2(3)(d) Oの質量数" },
            { "id": "q_c2_1_2_4d", "label": "問2(4)(d) Naの質量数" },
            { "id": "q_c2_1_2_5d", "label": "問2(5)(d) Clの質量数" },
            { "id": "q_c2_1_2_6d", "label": "問2(6)(d) Arの質量数" },
            { "id": "q_c2_1_7_2", "label": "問7(2) 元素記号特定" },
            { "id": "q_c2_1_1_ke", "label": "問1(ケ) 同位体" },
            { "id": "q_c2_1_4_3a", "label": "問4(3) 同位体の定義" },
            { "id": "q_c2_1_4_3b", "label": "問4(3) 化学的性質" }
          ]
        }
      ]
    },
    {
      "id": "p2_1_step3_group",
      "label": "【Step3：電子配置】",
      "step": 3,
      "isGroup": true,
      "children": [
        {
          "id": "p2_1_n11",
          "label": "電子殻",
          "step": 3,
          "subLabel": "K・L・M・N殻",
          "explanation": "<u>電子殻</u>＝電子が存在する、原子核を取り囲むいくつかの層。\n\n原子核に近い順から <u>K殻 → L殻 → M殻 → N殻 ...</u>\n\n🎯【電子殻のイメージ】\n\n　　　　　　N殻\n\n　　　　　M殻\n\n　　　　L殻\n\n　　　K殻\n\n　　◉ ← 原子核（＋）\n\n（内側から順に電子が入る）"
        },
        {
          "id": "p2_1_n12",
          "label": "最大収容数（2n²個）",
          "step": 3,
          "subLabel": "2, 8, 18, 32",
          "explanation": "<u>【公式】内側から n 番目の電子殻の最大電子数 ＝ 2n² 個</u>\n\n・K殻（n=1）→<u>2個</u>\n\n・L殻（n=2）→<u>8個</u>\n\n・M殻（n=3）→<u>18個</u>（ただし通常は8で安定を優先）\n\n・N殻（n=4）→<u>32個</u>\n\n💡 覚え方「<u>2・8・18・32</u>」← 2n² の値"
        },
        {
          "id": "p2_1_n13",
          "label": "電子配置のルール（20番まで）",
          "step": 3,
          "subLabel": "絶対暗記！",
          "explanation": "大学受験・定期テストでは、<u>電子配置を20番まで</u>書けるようにしておけば十分。\n\n<u>★ ルール ★</u>\n\n① 内側の電子殻から順番に詰める\n\n② <u>K・Caは特殊</u>：19番K・20番Caは<u>M殻ではなくN殻</u>に入る\n\n　→M殻に入るより<u>N殻に入った方が安定（=8を作りたい）</u>\n\n③ <u>最外殻電子の数 ＝ 族の一桁目</u>（貴ガス除く）\n\n④ <u>価電子の数 ＝ 族の一桁目</u>（貴ガスは0）\n\n原子番号 ｜ 元素 ｜ K ｜ L ｜ M ｜ N ｜ 族\n1 ｜ H ｜ 1 ｜ - ｜ - ｜ - ｜ 1\n2 ｜ He ｜ 2 ｜ - ｜ - ｜ - ｜ 18\n3 ｜ Li ｜ 2 ｜ 1 ｜ - ｜ - ｜ 1\n10 ｜ Ne ｜ 2 ｜ 8 ｜ - ｜ - ｜ 18\n11 ｜ Na ｜ 2 ｜ 8 ｜ 1 ｜ - ｜ 1\n17 ｜ Cl ｜ 2 ｜ 8 ｜ 7 ｜ - ｜ 17\n18 ｜ Ar ｜ 2 ｜ 8 ｜ 8 ｜ - ｜ 18\n19 ｜ K ｜ 2 ｜ 8 ｜ 8 ｜ 1 ｜ 1\n20 ｜ Ca ｜ 2 ｜ 8 ｜ 8 ｜ 2 ｜ 2"
        },
        {
          "id": "p2_1_n14",
          "label": "最外殻電子・価電子",
          "step": 3,
          "subLabel": "結合に関わる電子",
          "explanation": "<u>最外殻電子</u>＝原子中で、最も外側の電子殻にある電子\n\n<u>価電子</u>＝結合に重要な役割を果たす最外殻電子\n\n💡 <u>貴ガスの価電子は0</u>（安定なので他と結合しない）。それ以外の元素は<u>最外殻電子＝価電子</u>",
          "relatedQuestions": [
            { "id": "q_c2_1_1_shi", "label": "問1(シ) 最外殻電子" },
            { "id": "q_c2_1_1_su", "label": "問1(ス) 価電子" },
            { "id": "q_c2_1_1_se", "label": "問1(セ) 族番号" },
            { "id": "q_c2_1_1_so", "label": "問1(ソ) 貴ガスの定義" },
            { "id": "q_c2_1_6_a1", "label": "問6(A1) 価電子数" },
            { "id": "q_c2_1_6_b1", "label": "問6(B1) 価電子数" },
            { "id": "q_c2_1_6_c1", "label": "問6(C1) 価電子数" },
            { "id": "q_c2_1_6_d1", "label": "問6(D1) 価電子数" },
            { "id": "q_c2_1_6_e1", "label": "問6(E1) 価電子数" },
            { "id": "q_c2_1_6_f1", "label": "問6(F1) 価電子数" }
          ]
        },
        {
          "id": "p2_1_n15",
          "label": "閉殻構造",
          "step": 3,
          "subLabel": "貴ガス型＝安定",
          "explanation": "<u>閉殻構造</u>＝電子殻が最大数の電子で満たされた安定構造。\n\nHe（K殻2）、Ne（K2 L8）、Ar（K2 L8 M8）など\n\n原子はこの<u>貴ガス型配置</u>を取りたがる（＝反応・イオン化・化学結合の理由）。\n\n💡 「オクテット則」：最外殻に8個の電子を持とうとする性質"
        },
        {
          "id": "p2_1_step3_group_qlink",
          "label": "📝 このStepの確認問題",
          "step": 3,
          "subLabel": "17問",
          "explanation": "このStepに対応する演習・確認問題です。タップして解答画面へ移動できます。",
          "relatedQuestions": [
            { "id": "q_c2_1_1_ko", "label": "問1(コ) 電子殻" },
            { "id": "q_c2_1_1_sa", "label": "問1(サ) 2n²" },
            { "id": "q_c2_1_3_1", "label": "問3(1) Heの電子配置" },
            { "id": "q_c2_1_3_2", "label": "問3(2) Cの電子配置" },
            { "id": "q_c2_1_3_3", "label": "問3(3) Oの電子配置" },
            { "id": "q_c2_1_3_4", "label": "問3(4) Fの電子配置" },
            { "id": "q_c2_1_3_5", "label": "問3(5) Neの電子配置" },
            { "id": "q_c2_1_3_6", "label": "問3(6) Mgの電子配置" },
            { "id": "q_c2_1_3_7", "label": "問3(7) Clの電子配置" },
            { "id": "q_c2_1_3_8", "label": "問3(8) Kの電子配置" },
            { "id": "q_c2_1_3_9", "label": "問3(9) Caの電子配置" },
            { "id": "q_c2_1_5_1", "label": "問5(1) K殻最大数" },
            { "id": "q_c2_1_5_2", "label": "問5(2) L殻最大数" },
            { "id": "q_c2_1_5_3", "label": "問5(3) M殻最大数" },
            { "id": "q_c2_1_5_4", "label": "問5(4) N殻最大数" },
            { "id": "q_c2_1_5_ans", "label": "問5(ans) 合計60個殻" },
            { "id": "q_c2_1_7_3", "label": "問7(3) Mgの電子配置" }
          ]
        }
      ]
    },
    {
      "id": "p2_1_step4_group",
      "label": "【Step4：元素の周期表】",
      "step": 4,
      "isGroup": true,
      "children": [
        {
          "id": "p2_1_n17",
          "label": "周期律",
          "step": 4,
          "subLabel": "性質が周期的に表れる",
          "explanation": "<u>元素の周期律</u>＝性質のよく似た元素が周期的に表れること。\n\n理由：原子番号の増加に伴い、原子の<u>価電子の数が周期的に変化</u>するから。"
        },
        {
          "id": "p2_1_n18",
          "label": "周期表",
          "step": 4,
          "subLabel": "原子番号順に並べた表",
          "explanation": "<u>元素の周期表</u>＝元素を原子番号の順に、周期律に従って縦の同じ列に並べた表。\n\nロシアの<u>メンデレーエフ</u>により1869年に作成（当時は原子量順）。\n\n<u>族</u>＝周期表の縦の列（1〜18族）\n\n<u>周期</u>＝周期表の横の行（第1〜第7周期）\n\n<u>同族元素</u>＝同じ族に属する元素群（価電子が同じ→性質が似ている）"
        },
        {
          "id": "p2_1_n19",
          "label": "周期表の語呂合わせ（超重要）",
          "step": 4,
          "subLabel": "すいへーりーべー…",
          "explanation": "<u>★ 第1〜2周期（1〜10番）★</u>\n\n<u>すい・へー・りー・べー・ぼ・く・の・ふ・ね</u>\n\n　H・He・Li・Be・B・C・N・O・F・Ne\n\n<u>★ 第3周期（11〜18番）★</u>\n\n<u>なな・まが・り・シッ・プ・ス・クラー・ク</u>\n\n　Na・Mg・Al・Si・P・S・Cl・Ar\n\n<u>★ 第4周期の1・2族（19・20番）★</u>\n\n<u>か・か</u>\n\n　K・Ca\n\n💡 20番までは必ず覚える！これがすべての基礎になる。"
        },
        {
          "id": "p2_1_n20",
          "label": "典型元素と遷移元素",
          "step": 4,
          "subLabel": "1,2,13〜18族 vs 3〜12族",
          "explanation": "<u>典型元素</u>＝周期表の<u>1・2・13〜18族</u>の元素\n\n　　→ 同族で性質が似ている（価電子数が同じだから）\n\n<u>遷移元素</u>＝周期表の<u>3〜12族</u>の元素（すべて金属元素）\n\n　　→ 隣どうしで性質が似ている（最外殻電子が1〜2個で共通）\n\n💡 <u>遷移元素は複数の酸化数を持つ</u>（Fe²⁺・Fe³⁺、Cu⁺・Cu²⁺ など）"
        },
        {
          "id": "p2_1_n21",
          "label": "金属・非金属元素",
          "step": 4,
          "subLabel": "境目を覚える",
          "explanation": "<u>金属元素</u>＝単体が金属光沢を持ち、電気や熱をよく導く。周期表の<u>左〜中央</u>。\n\n<u>非金属元素</u>＝金属の性質を示さない元素。周期表の<u>右上（水素とホウ素以降の右上ブロック）</u>。\n\n💡 <u>常温で液体の元素2つ</u>：<u>水銀 Hg</u>（金属）と<u>臭素 Br₂</u>（非金属）\n\n💡 <u>常温で気体の元素11個</u>：H₂、N₂、O₂、F₂、Cl₂ と貴ガス6個（He、Ne、Ar、Kr、Xe、Rn）"
        },
        {
          "id": "p2_1_n22",
          "label": "重要な族の名前（4つ暗記）",
          "step": 4,
          "subLabel": "1・2・17・18族",
          "explanation": "族 ｜ 名前 ｜ 主な元素 ｜ 性質\n1族（Hを除く） ｜ アルカリ金属 ｜ Li, Na, K, Rb, Cs, Fr ｜ やわらかい、1価の陽イオンになりやすい\n2族 ｜ アルカリ土類金属 ｜ Be, Mg, Ca, Sr, Ba, Ra ｜ 2価の陽イオンになりやすい\n17族 ｜ ハロゲン ｜ F, Cl, Br, I, At ｜ 有色、1価の陰イオンになりやすい\n18族 ｜ 貴ガス（希ガス） ｜ He, Ne, Ar, Kr, Xe, Rn ｜ 非常に安定、単原子分子\n\n💡 <u>周期表の暗記の優先順位</u>：\n\n① 36番までの周期表\n\n② 1・2・17・18族は第7周期まで\n\n③ 金属と非金属の境目\n\n④ 典型と遷移の境目\n\n⑤ 常温液体（Hg・Br₂）"
        },
        {
          "id": "p2_1_n23",
          "label": "例題：電子配置と族・周期",
          "step": 4,
          "subLabel": "練習問題",
          "explanation": "<u>例題</u>：次の原子の電子配置、族、周期を答えよ。\n\n(1) ₁₁Na → K2 L8 M1、<u>1族・第3周期</u>（アルカリ金属）\n\n(2) ₈O → K2 L6、<u>16族・第2周期</u>\n\n(3) ₁₇Cl → K2 L8 M7、<u>17族・第3周期</u>（ハロゲン）\n\n(4) ₁₈Ar → K2 L8 M8、<u>18族・第3周期</u>（貴ガス）\n\n(5) ₂₀Ca → K2 L8 M8 N2、<u>2族・第4周期</u>（アルカリ土類金属）\n\n💡 <u>周期＝最外殻の番号（K=1, L=2, M=3, N=4）</u>\n\n<u>族＝最外殻電子の数（貴ガス以外）</u>"
        }
      ]
    }
  ]
};

export const ionTreeData = {
  "id": "p2_2_root",
  "label": "イオン",
  "step": null,
  "explanation": "原子が電子を失ったり受け取ったりして電気を帯びた粒子をイオンといいます。その電荷の種類、構成原子数、価数、および安定性について系統的に整理しましょう。",
  "children": [
    {
      "id": "p2_2_step1_group",
      "label": "【Step1：電荷による分類（陽イオン・陰イオン）】",
      "step": 1,
      "isGroup": true,
      "children": [
        {
          "id": "p2_2_n1",
          "label": "イオンとは",
          "step": 1,
          "subLabel": "電気を帯びた粒子",
          "explanation": "普通の原子は<u>陽子の数＝電子の数</u>で電気的に中性。\n\n<u>原子が電子を与えたり受け取ったりして電気を帯びた粒子</u>＝<u>イオン</u>。\n\n・電子を<u>失う</u> → 陽子が余る → <u>陽イオン（＋）</u>\n\n・電子を<u>受け取る</u> → 電子が余る → <u>陰イオン（−）</u>"
        },
        {
          "id": "p2_2_n2",
          "label": "陽イオン",
          "step": 1,
          "subLabel": "正電荷・電子を放出",
          "explanation": "<u>陽イオン</u>＝正の電荷をもつイオン（電子を放出してできる）\n\n<u>例</u>：Na⁺、Mg²⁺、Al³⁺、Fe²⁺、Fe³⁺、Ca²⁺、K⁺、H⁺、NH₄⁺\n\n💡 主に<u>金属元素</u>（1族・2族・遷移元素）が陽イオンになる",
          "relatedQuestions": [
            { "id": "q_c2_2_1_i", "label": "問1(イ) 陽イオン" },
            { "id": "q_c2_2_2_1", "label": "問2(1) Na⁺" },
            { "id": "q_c2_2_2_2", "label": "問2(2) Mg²⁺" },
            { "id": "q_c2_2_2_3", "label": "問2(3) Al³⁺" },
            { "id": "q_c2_2_2_7", "label": "問2(7) NH₄⁺" }
          ]
        },
        {
          "id": "p2_2_n3",
          "label": "陰イオン",
          "step": 1,
          "subLabel": "負電荷・電子を受け取る",
          "explanation": "<u>陰イオン</u>＝負の電荷をもつイオン（電子を受け取ってできる）\n\n<u>例</u>：Cl⁻、O²⁻、S²⁻、F⁻、Br⁻、I⁻、OH⁻、NO₃⁻、SO₄²⁻\n\n💡 主に<u>非金属元素</u>（特に17族ハロゲン、16族）が陰イオンになる",
          "relatedQuestions": [
            { "id": "q_c2_2_1_u", "label": "問1(ウ) 陰イオン" },
            { "id": "q_c2_2_2_4", "label": "問2(4) Cl⁻" },
            { "id": "q_c2_2_2_5", "label": "問2(5) O²⁻" },
            { "id": "q_c2_2_2_6", "label": "問2(6) S²⁻" },
            { "id": "q_c2_2_2_8", "label": "問2(8) OH⁻" },
            { "id": "q_c2_2_2_9", "label": "問2(9) NO₃⁻" },
            { "id": "q_c2_2_2_10", "label": "問2(10) SO₄²⁻" },
            { "id": "q_c2_2_2_11", "label": "問2(11) CO₃²⁻" },
            { "id": "q_c2_2_2_12", "label": "問2(12) PO₄³⁻" }
          ]
        }
      ]
    },
    {
      "id": "p2_2_step2_group",
      "label": "【Step2：構成による分類（単原子・多原子）】",
      "step": 2,
      "isGroup": true,
      "children": [
        {
          "id": "p2_2_n5",
          "label": "単原子イオン",
          "step": 2,
          "subLabel": "原子1個から",
          "explanation": "<u>単原子イオン</u>＝1つの原子からできるイオン\n\n<u>陽イオンの例</u>：H⁺、Na⁺、K⁺、Mg²⁺、Ca²⁺、Al³⁺、Fe²⁺、Fe³⁺、Cu²⁺、Zn²⁺、Ag⁺\n\n<u>陰イオンの例</u>：F⁻、Cl⁻、Br⁻、I⁻、O²⁻、S²⁻",
          "relatedQuestions": [
            { "id": "q_c2_2_1_e", "label": "問1(エ) 単原子" },
            { "id": "q_c2_2_7_sym", "label": "問7(1) Ca" }
          ]
        },
        {
          "id": "p2_2_n6",
          "label": "多原子イオン（絶対暗記）",
          "step": 2,
          "subLabel": "2個以上の原子から",
          "explanation": "<u>多原子イオン</u>＝2個以上の原子からできるイオン\n\n<u>★ 必須暗記の多原子イオン ★</u>\n\n<u>【陽イオン】</u>\n\n・<u>NH₄⁺</u>　アンモニウムイオン\n\n・<u>H₃O⁺</u>　オキソニウムイオン（水素イオンH⁺は水中でこの形）\n\n<u>【陰イオン・1価】</u>\n\n・<u>OH⁻</u>　水酸化物イオン\n\n・<u>NO₃⁻</u>　硝酸イオン\n\n・<u>HCO₃⁻</u>　炭酸水素イオン\n\n・<u>CH₃COO⁻</u>　酢酸イオン\n\n<u>【陰イオン・2価】</u>\n\n・<u>CO₃²⁻</u>　炭酸イオン\n\n・<u>SO₄²⁻</u>　硫酸イオン\n\n<u>【陰イオン・3価】</u>\n\n・<u>PO₄³⁻</u>　リン酸イオン\n\n💡 硝酸イオンNO₃⁻と亜硝酸イオンNO₂⁻、硫酸SO₄²⁻と亜硫酸SO₃²⁻の区別に注意"
        },
        {
          "id": "p2_2_step2_group_qlink",
          "label": "📝 このStepの確認問題",
          "step": 2,
          "subLabel": "3問",
          "explanation": "このStepに対応する演習・確認問題です。タップして解答画面へ移動できます。",
          "relatedQuestions": [
            { "id": "q_c2_2_1_o", "label": "問1(オ) 多原子" },
            { "id": "q_c2_2_1_shi", "label": "問1(シ) NH₄⁺" },
            { "id": "q_c2_2_1_su", "label": "問1(ス) OH⁻" }
          ]
        }
      ]
    },
    {
      "id": "p2_2_step3_group",
      "label": "【Step3：価数と安定性（貴ガス型を目指す）】",
      "step": 3,
      "isGroup": true,
      "children": [
        {
          "id": "p2_2_n8",
          "label": "陽性・陰性",
          "step": 3,
          "subLabel": "価電子数で決まる",
          "explanation": "<u>価電子1〜3個</u>の原子 → <u>陽イオンになりやすい＝陽性</u>（金属元素）\n\n<u>価電子6〜7個</u>の原子 → <u>陰イオンになりやすい＝陰性</u>（非金属元素）\n\n<u>価電子0（貴ガス）</u> → イオンにならない（すでに安定）\n\n理由：安定した<u>貴ガス型電子配置</u>を取りたいから\n\n💡 <u>族と価数の関係</u>：\n\n・1族→1価陽イオン（Na⁺、K⁺）\n\n・2族→2価陽イオン（Mg²⁺、Ca²⁺）\n\n・13族→3価陽イオン（Al³⁺）\n\n・16族→2価陰イオン（O²⁻、S²⁻）\n\n・17族→1価陰イオン（Cl⁻、F⁻）"
        },
        {
          "id": "p2_2_n9",
          "label": "イオン生成の例",
          "step": 3,
          "subLabel": "Na と Cl で考える",
          "explanation": "<u>Na（価電子1）</u>：電子1個を捨てる\n\n　Na → Na⁺ + e⁻　（電子配置は<u>Ne型</u>の閉殻に）\n\n<u>Cl（価電子7）</u>：電子1個を受け取る\n\n　Cl + e⁻ → Cl⁻　（電子配置は<u>Ar型</u>の閉殻に）\n\n🎯【NaとClのイオン化イメージ】\n\nNa（K2 L8 M1）→ M殻の1個を捨てる → Na⁺（K2 L8 = Ne型）\n\nCl（K2 L8 M7）→ M殻に1個受け取る → Cl⁻（K2 L8 M8 = Ar型）"
        },
        {
          "id": "p2_2_n10",
          "label": "例題：イオンの電子数",
          "step": 3,
          "subLabel": "閉殻数を数える",
          "explanation": "<u>各イオン1個が持つ電子数</u>：\n\n(1) K⁺ → 19−1 ＝ <u>18個</u>（Ar型）\n\n(2) Mg²⁺ → 12−2 ＝ <u>10個</u>（Ne型）\n\n(3) S²⁻ → 16+2 ＝ <u>18個</u>（Ar型）\n\n(4) OH⁻ → 8+1+1 ＝ <u>10個</u>（Ne型）\n\n(5) NH₄⁺ → 7+4−1 ＝ <u>10個</u>（Ne型）\n\n💡 <u>解法のコツ</u>：単原子・多原子いずれも<u>貴ガス配置（Ne型=10、Ar型=18）に近づきたい</u>ので、電子数は10や18になることが多い"
        },
        {
          "id": "p2_2_step3_group_qlink",
          "label": "📝 このStepの確認問題",
          "step": 3,
          "subLabel": "17問",
          "explanation": "このStepに対応する演習・確認問題です。タップして解答画面へ移動できます。",
          "relatedQuestions": [
            { "id": "q_c2_2_1_ka", "label": "問1(カ) 価数" },
            { "id": "q_c2_2_3_1a", "label": "問3(1) 組成" },
            { "id": "q_c2_2_3_2a", "label": "問3(2) 組成" },
            { "id": "q_c2_2_3_3a", "label": "問3(3) 組成" },
            { "id": "q_c2_2_3_4a", "label": "問3(4) 組成" },
            { "id": "q_c2_2_3_5a", "label": "問3(5) 組成" },
            { "id": "q_c2_2_3_6a", "label": "問3(6) 組成" },
            { "id": "q_c2_2_3_7a", "label": "問3(7) 組成" },
            { "id": "q_c2_2_3_8a", "label": "問3(8) 組成" },
            { "id": "q_c2_2_4_ans", "label": "問4 最小整数比" },
            { "id": "q_c2_2_1_ki", "label": "問1(キ) 電子配置" },
            { "id": "q_c2_2_1_ku", "label": "問1(ク) ⁺" },
            { "id": "q_c2_2_1_ke", "label": "問1(ケ) ²⁺" },
            { "id": "q_c2_2_1_ko", "label": "問1(コ) ⁻" },
            { "id": "q_c2_2_1_sa", "label": "問1(サ) ²⁻" },
            { "id": "q_c2_2_5_1", "label": "問5(1) Li⁺ 配置" },
            { "id": "q_c2_2_6_g1", "label": "問6(g1) 10個等電子" }
          ]
        }
      ]
    },
    {
      "id": "p2_2_step4_group",
      "label": "【Step4：組成式の決定（イオン結合物質の書き方）】",
      "step": 4,
      "isGroup": true,
      "children": [
        {
          "id": "p2_2_n12",
          "label": "組成式の決定ルール",
          "step": 4,
          "subLabel": "正負の電荷をゼロに",
          "explanation": "<u>組成式</u>＝陽イオンと陰イオンの数の割合を、<u>最も簡単な整数比</u>で表した化学式。\n\n<u>★ 決定手順 ★</u>\n\n❶ 陽イオンと陰イオンを並べる\n\n❷ 正負の電荷の合計が<u>ゼロ</u>になるように数を決める\n\n　（陽イオンの価数）×（陽イオンの数）＝（陰イオンの価数）×（陰イオンの数）\n\n❸ <u>陽イオンを先</u>、陰イオンを後に書く\n\n❹ 多原子イオンが2個以上ある場合は<u>( )でくくって</u>数字を添える\n\n❺ 名前は「陰イオン + 陽イオン」の順に読む（例：塩化ナトリウム）\n\n陽イオン ｜ 陰イオン ｜ 組成式 ｜ 名称\nNa⁺ ｜ Cl⁻ ｜ NaCl ｜ 塩化ナトリウム\nCa²⁺ ｜ Cl⁻ ｜ CaCl₂ ｜ 塩化カルシウム\nAl³⁺ ｜ O²⁻ ｜ Al₂O₃ ｜ 酸化アルミニウム\nNH₄⁺ ｜ SO₄²⁻ ｜ (NH₄)₂SO₄ ｜ 硫酸アンモニウム\nCa²⁺ ｜ OH⁻ ｜ Ca(OH)₂ ｜ 水酸化カルシウム\nFe³⁺ ｜ SO₄²⁻ ｜ Fe₂(SO₄)₃ ｜ 硫酸鉄(Ⅲ)"
        },
        {
          "id": "p2_2_n13",
          "label": "例題：組成式を書く",
          "step": 4,
          "subLabel": "価数のたすき掛け",
          "explanation": "<u>例題</u>：次のイオンからなる化合物の組成式と名称を書け。\n\n(1) Mg²⁺ と Cl⁻ → 2×1 = 1×2 → <u>MgCl₂</u>（塩化マグネシウム）\n\n(2) Al³⁺ と SO₄²⁻ → 3×2 = 2×3 → <u>Al₂(SO₄)₃</u>（硫酸アルミニウム）\n\n(3) NH₄⁺ と NO₃⁻ → 1×1 = 1×1 → <u>NH₄NO₃</u>（硝酸アンモニウム）\n\n(4) Fe²⁺ と OH⁻ → 2×1 = 1×2 → <u>Fe(OH)₂</u>（水酸化鉄(Ⅱ)）\n\n(5) K⁺ と PO₄³⁻ → 1×3 = 3×1 → <u>K₃PO₄</u>（リン酸カリウム）\n\n💡 <u>「たすき掛け」の考え方</u>：陽イオン価数を陰イオンの数へ、陰イオン価数を陽イオンの数へ持ってくる（約分できる場合は約分）"
        }
      ]
    }
  ]
};

export const ionGenerationTreeData = {
  "id": "p2_3_root",
  "label": "イオン化エネルギー・電子親和力",
  "step": null,
  "explanation": "原子から電子を取り去るのに必要なイオン化エネルギーや、電子を付け加えた際に放出される電子親和力、それらの周期表やグラフでの傾向について学びます。",
  "children": [
    {
      "id": "p2_3_step1_group",
      "label": "【Step1：エネルギーの定義】",
      "step": 1,
      "isGroup": true,
      "children": [
        {
          "id": "p2_3_n1",
          "label": "イオン化エネルギー",
          "step": 1,
          "subLabel": "陽イオン化で吸収",
          "explanation": "<u>（第一）イオン化エネルギー</u>＝原子が<u>1価の陽イオンになるとき</u>に<u>吸収するエネルギー</u>。\n\nA → A⁺ + e⁻　（エネルギーを<u>吸収</u>）\n\n<u>★ ルール ★</u>\n\n・イオン化エネルギーが<u>小さい</u>→ 陽イオンになりやすい\n\n・イオン化エネルギーが<u>大きい</u>→ 陽イオンになりにくい",
          "relatedQuestions": [
            { "id": "q_c2_3_1_i", "label": "問1(イ) イオン化エネルギー" },
            { "id": "q_c2_3_5_ans", "label": "問5 Iの計算" },
            { "id": "q_c2_3_6_ans", "label": "問6 2価陽イオンへのなりやすさ" }
          ]
        },
        {
          "id": "p2_3_n2",
          "label": "電子親和力",
          "step": 1,
          "subLabel": "陰イオン化で放出",
          "explanation": "<u>電子親和力</u>＝原子が<u>1価の陰イオンになるとき</u>に<u>放出するエネルギー</u>。\n\nA + e⁻ → A⁻　（エネルギーを<u>放出</u>）\n\n<u>★ ルール ★</u>\n\n・電子親和力が<u>大きい</u>→ 陰イオンになりやすい\n\n・電子親和力が<u>小さい</u>→ 陰イオンになりにくい\n\n💡 <u>混同注意</u>：イオン化エネルギーは「吸収」、電子親和力は「放出」。矢印の向きが逆！",
          "relatedQuestions": [
            { "id": "q_c2_3_1_ka", "label": "問1(カ) 電子親和力" }
          ]
        }
      ]
    },
    {
      "id": "p2_3_step2_group",
      "label": "【Step2：周期表における傾向】",
      "step": 2,
      "isGroup": true,
      "children": [
        {
          "id": "p2_3_n4",
          "label": "周期表での変化",
          "step": 2,
          "subLabel": "右上ほど大きい",
          "explanation": "<u>★ 重要 ★</u>\n\nイオン化エネルギーも電子親和力も、大まかには\n\n<u>周期表の左下ほど小さく、右上ほど大きい</u>\n\n🔼 右上：大　　　　　　\n\n　　／\n\n　／　元素の周期律に従って変化\n\n／\n\n🔽 左下：小\n\n💡 理由：右上ほど原子核が電子を強く引きつけるため、電子を取るのに大きな力が必要（イオン化E大）、電子を受け取るときに大きな安定化（電子親和力大）"
        },
        {
          "id": "p2_3_n5",
          "label": "同周期の傾向",
          "step": 2,
          "subLabel": "左→右で増加",
          "explanation": "<u>同周期</u>では原子番号が大きいほどイオン化エネルギー・電子親和力は<u>大きくなる</u>。\n\n理由：陽子の数が増え、電子を強く引きつけるから。"
        },
        {
          "id": "p2_3_n6",
          "label": "同族の傾向",
          "step": 2,
          "subLabel": "上→下で減少",
          "explanation": "<u>同族</u>では原子番号が大きいほどイオン化エネルギー・電子親和力は<u>小さくなる</u>。\n\n理由：電子殻の数が増え、最外殻の電子が原子核から遠くなり、引きつける力が弱くなるから。"
        },
        {
          "id": "p2_3_n7",
          "label": "代表例（Cl と Na の比較）",
          "step": 2,
          "subLabel": "性質の対比",
          "explanation": "｜ Na（第3周期左） ｜ Cl（第3周期右上）\nイオン化エネルギー ｜ 小（陽イオンになりやすい） ｜ 大（陽イオンになりにくい）\n電子親和力 ｜ 小（陰イオンになりにくい） ｜ 大（陰イオンになりやすい）\n実際のイオン ｜ Na⁺（1価陽イオン） ｜ Cl⁻（1価陰イオン）"
        },
        {
          "id": "p2_3_step2_group_qlink",
          "label": "📝 このStepの確認問題",
          "step": 2,
          "subLabel": "12問",
          "explanation": "このStepに対応する演習・確認問題です。タップして解答画面へ移動できます。",
          "relatedQuestions": [
            { "id": "q_c2_3_1_ku", "label": "問1(ク) 右上" },
            { "id": "q_c2_3_1_ke", "label": "問1(ケ) 右上" },
            { "id": "q_c2_3_2_1", "label": "問2(1) Na, K, Li" },
            { "id": "q_c2_3_2_2", "label": "問2(2) Li, C, F, Ne" },
            { "id": "q_c2_3_2_4", "label": "問2(4) F, Cl, Br, I" },
            { "id": "q_c2_3_7_a", "label": "問7(A) 最大" },
            { "id": "q_c2_3_7_b", "label": "問7(B) 最小" },
            { "id": "q_c2_3_1_u", "label": "問1(ウ) 陽イオンなりやすさ" },
            { "id": "q_c2_3_1_shi", "label": "問1(シ) Clが最大" },
            { "id": "q_c2_3_1_su", "label": "問1(ス) アルカリ小さ" },
            { "id": "q_c2_3_1_se", "label": "問1(セ) ハロゲン大き" },
            { "id": "q_c2_3_4_2", "label": "問4(2) 水と激しく反応" }
          ]
        }
      ]
    },
    {
      "id": "p2_3_step3_group",
      "label": "【Step3：最大値の特定】",
      "step": 3,
      "isGroup": true,
      "children": [
        {
          "id": "p2_3_n9",
          "label": "イオン化エネルギーの最大",
          "step": 3,
          "subLabel": "18族（貴ガス）",
          "explanation": "<u>イオン化エネルギーの最大は18族（貴ガス）</u>。\n\n特に<u>最大はヘリウム He</u>！\n\n💡 貴ガスは閉殻構造で安定→陽イオンにしたくないので大きなエネルギーが必要\n\n<u>各周期の最大</u>：\n\n第1周期→<u>He</u>（最大！）\n\n第2周期→<u>Ne</u>\n\n第3周期→<u>Ar</u>",
          "relatedQuestions": [
            { "id": "q_c2_3_3_1", "label": "問3(1) ピーク" }
          ]
        },
        {
          "id": "p2_3_n10",
          "label": "電子親和力の最大",
          "step": 3,
          "subLabel": "17族（ハロゲン）",
          "explanation": "<u>電子親和力の最大は17族（ハロゲン）</u>。\n\n特に<u>最大は塩素 Cl</u>（フッ素Fが右上だが例外！）\n\n⚠️ <u>例外：F より Cl の方が電子親和力が大きい</u>\n\n理由：Fは原子半径が小さすぎて、電子を受け取るときの電子間反発が大きいため\n\n電子親和力の最大：<u>Cl > F > Br > O > ...</u>",
          "relatedQuestions": [
            { "id": "q_c2_3_4_1", "label": "問4(1) 最大の元素" }
          ]
        }
      ]
    },
    {
      "id": "p2_3_step4_group",
      "label": "【Step4：グラフによる識別】",
      "step": 4,
      "isGroup": true,
      "children": [
        {
          "id": "p2_3_n12",
          "label": "3種のグラフの区別",
          "step": 4,
          "subLabel": "価電子・イオン化E・電子親和力",
          "explanation": "グラフ ｜ 縦軸範囲 ｜ 山の位置（最大） ｜ 特徴\n価電子 ｜ 0〜10 ｜ 17族（Cl・F）で7 ｜ 貴ガスで0まで急降下（ノコギリ状）\nイオン化エネルギー ｜ 0〜3000 kJ/mol ｜ 18族（貴ガス） ｜ Heが最大、右上ほど大きい\n電子親和力 ｜ 0〜500 kJ/mol ｜ 17族（ハロゲン） ｜ Clが最大、貴ガスはほぼ0\n\n💡 <u>グラフの見分け方の順序</u>：\n\n① 縦軸の値を見る（10以下→価電子、500まで→電子親和力、3000まで→イオン化E）\n\n② 最大値の位置（貴ガス→イオン化E、ハロゲン→電子親和力）"
        },
        {
          "id": "p2_3_step4_group_qlink",
          "label": "📝 このStepの確認問題",
          "step": 4,
          "subLabel": "5問",
          "explanation": "このStepに対応する演習・確認問題です。タップして解答画面へ移動できます。",
          "relatedQuestions": [
            { "id": "q_c2_3_3_2", "label": "問3(2) 谷" },
            { "id": "q_c2_3_3_3", "label": "問3(3) 原子番号増加に伴う変化" },
            { "id": "q_c2_3_3_4", "label": "問3(4) Be→Bの減少" },
            { "id": "q_c2_3_1_ki", "label": "問1(キ) 陰イオンなりやすさ" },
            { "id": "q_c2_3_4_3", "label": "問4(3) 貴ガスが化学的に安定な理由" }
          ]
        }
      ]
    },
    {
      "id": "p2_3_step5_group",
      "label": "【Step5：連続イオン化エネルギー（発展）】",
      "step": 1,
      "isGroup": true,
      "children": [
        {
          "id": "p2_3_n14",
          "label": "第二・第三イオン化エネルギー",
          "step": 1,
          "subLabel": "2価・3価陽イオン化",
          "explanation": "<u>第二イオン化エネルギー</u>＝1価陽イオンA⁺から、さらに電子を1個奪って2価陽イオンA²⁺にするエネルギー。\n\n<u>第三イオン化エネルギー</u>＝2価陽イオンA²⁺から3価陽イオンA³⁺にするエネルギー。\n\nA → A⁺ + e⁻ ・・・第一イオン化E\n\nA⁺ → A²⁺ + e⁻ ・・・第二イオン化E\n\nA²⁺ → A³⁺ + e⁻ ・・・第三イオン化E\n\n<u>★ 大原則 ★</u> 第一 < 第二 < 第三 < ...（後の電子ほど取りにくい）"
        },
        {
          "id": "p2_3_n15",
          "label": "グラフの急上昇位置＝族の推定",
          "step": 1,
          "subLabel": "閉殻を突破するとき",
          "explanation": "<u>連続イオン化エネルギーのグラフ</u>で、<u>急上昇する位置</u>を見ると原子の族が推定できる。\n\n<u>ルール</u>：<u>閉殻を突破する電子</u>を取るときにエネルギーが急上昇する\n\n<u>例</u>：Na（1族）→ 第一イオン化E小、<u>第二以降が急激に大</u>（Ne型閉殻を破るため）\n\n<u>例</u>：Mg（2族）→ 第一・第二イオン化Eが小、<u>第三以降が急激に大</u>\n\n<u>例</u>：Al（13族）→ 第一〜第三が小、<u>第四以降が急激に大</u>\n\n💡 <u>1族は第2から、2族は第3から、13族は第4から</u>急上昇！ 族＝急上昇の1個前まで"
        },
        {
          "id": "p2_3_n16",
          "label": "例題：族の推定",
          "step": 1,
          "subLabel": "連続イオン化E応用",
          "explanation": "<u>例題</u>：ある原子Xの連続イオン化エネルギーは\n\n第一：738、第二：1451、<u>第三：7733</u>、第四：10540（kJ/mol）だった。\n\nXは何族か？\n\n<u>解答</u>：第二→第三で急上昇（1451 → 7733）。\n\nつまり<u>2個の電子は取りやすく、3個目から急に取りにくい</u>。\n\n→ <u>2族の元素</u>（例：Mg）\n\n💡 急上昇の1つ前までの数＝取りやすい価電子の数＝族の一桁目"
        }
      ]
    }
  ]
};

export const ionSizeTreeData = {
  "id": "p2_4_root",
  "label": "原子・イオンの大きさ",
  "step": null,
  "explanation": "原子やイオンの大きさ（半径）は、最外殻の電子にかかる核からの引力や、電子殻の数、電子間の反発などによって決まります。これらの大小関係と周期表での傾向を系統的に整理しましょう。",
  "children": [
    {
      "id": "p2_4_step1_group",
      "label": "【Step1：原子半径の傾向（族・周期）】",
      "step": 1,
      "isGroup": true,
      "children": [
        {
          "id": "p2_4_n1",
          "label": "同じ族の場合",
          "step": 1,
          "subLabel": "下ほど大きい",
          "explanation": "<u>同族では原子番号が大きいほど原子半径が大きい</u>。\n\n理由：<u>電子殻の数が多くなる</u>から\n\n例：Na（K2 L8 M1）＞ Li（K2 L1）\n\n例：Cs ＞ Rb ＞ K ＞ Na ＞ Li（1族）"
        },
        {
          "id": "p2_4_n2",
          "label": "同じ周期の場合",
          "step": 1,
          "subLabel": "右ほど小さい",
          "explanation": "<u>同周期では原子番号が大きいほど原子半径が小さい</u>。\n\n理由：<u>陽子の数が多くなり、電子が原子核に強く引きつけられる</u>から\n\n例：Na（11）＞ Mg（12）＞ Al（13）＞ ... ＞ Cl（17）　（第3周期）\n\n💡 <u>周期表で左下に向かうほど原子は大きく、右上ほど小さい</u>\n\n（貴ガスは特殊なため、除いて考える）"
        },
        {
          "id": "p2_4_n3",
          "label": "原子半径の傾向まとめ図",
          "step": 1,
          "subLabel": "周期表での視覚化",
          "explanation": "📊【原子半径の傾向】\n\n　　　　　　　　　→ 小さい\n\n　　┌────────┐\n\n大　│ 　　　　　　│\n\nき　│周期表　　　　│\n\nい　│　　　　　　　│\n\n　　│　　　　　　　│\n\n　　└────────┘\n\n　　　　　　　　　→\n\n<u>周期表の右上ほど小さく、左下ほど大きい</u>\n\n💡 大きさランキング（同じ電子殻数の場合）：K > Ca > Na > Mg > Li > Be"
        },
        {
          "id": "p2_4_step1_group_qlink",
          "label": "📝 このStepの確認問題",
          "step": 1,
          "subLabel": "11問",
          "explanation": "このStepに対応する演習・確認問題です。タップして解答画面へ移動できます。",
          "relatedQuestions": [
            { "id": "q_c2_4_1_a", "label": "問1(ア) 外側" },
            { "id": "q_c2_4_1_i", "label": "問1(イ) 大きく" },
            { "id": "q_c2_4_2_1", "label": "問2(1) Li, Na, K" },
            { "id": "q_c2_4_2_3", "label": "問2(3) F, Cl, Br" },
            { "id": "q_c2_4_7_ans", "label": "問7 ③ K > Na > Li > H" },
            { "id": "q_c2_4_1_u", "label": "問1(ウ) 陽子" },
            { "id": "q_c2_4_1_e", "label": "問1(エ) 引きつける" },
            { "id": "q_c2_4_1_o", "label": "問1(オ) 小さく" },
            { "id": "q_c2_4_2_2", "label": "問2(2) Na, Mg, Al" },
            { "id": "q_c2_4_2_4", "label": "問2(4) O, F, Ne" },
            { "id": "q_c2_4_6_1", "label": "問6(1) 最大位置" }
          ]
        }
      ]
    },
    {
      "id": "p2_4_step2_group",
      "label": "【Step2：陽イオン・陰イオンの半径】",
      "step": 2,
      "isGroup": true,
      "children": [
        {
          "id": "p2_4_n5",
          "label": "復習：イオンになりやすさ",
          "step": 2,
          "subLabel": "貴ガス型を目指す",
          "explanation": "価電子1〜3個＝陽イオンになりやすい（陽性）\n\n価電子6〜7個＝陰イオンになりやすい（陰性）\n\n→ 安定した貴ガス型電子配置を取りたい"
        },
        {
          "id": "p2_4_n6",
          "label": "陽イオンの半径",
          "step": 2,
          "subLabel": "もとの原子より小",
          "explanation": "<u>陽イオンの半径 ＜ もとの原子半径</u>\n\n例1：Li⁺（K2、He型）＜ Li（K2 L1）\n\n例2：Na⁺（K2 L8、Ne型）＜ Na（K2 L8 M1）\n\n理由：<u>最外殻の電子がなくなる</u>ため、電子殻の数が減る（外側の殻がなくなる）",
          "relatedQuestions": [
            { "id": "q_c2_4_1_ka", "label": "問1(カ) 電子殻" },
            { "id": "q_c2_4_1_ki", "label": "問1(キ) 小さく" },
            { "id": "q_c2_4_3_1", "label": "問3(1) Na と Na⁺" },
            { "id": "q_c2_4_3_3", "label": "問3(3) Mg と Mg²⁺" }
          ]
        },
        {
          "id": "p2_4_n7",
          "label": "陰イオンの半径",
          "step": 2,
          "subLabel": "もとの原子より大",
          "explanation": "<u>陰イオンの半径 ＞ もとの原子半径</u>\n\n例1：Cl⁻（K2 L8 M8、Ar型）＞ Cl（K2 L8 M7）\n\n例2：O²⁻（K2 L8、Ne型）＞ O（K2 L6）\n\n理由：<u>電子が増えて電子同士の反発が強まる</u>ため、電子雲が広がる",
          "relatedQuestions": [
            { "id": "q_c2_4_1_ku", "label": "問1(ク) 反発(クーロン反発)" },
            { "id": "q_c2_4_1_ke", "label": "問1(ケ) 大きく" },
            { "id": "q_c2_4_3_2", "label": "問3(2) Cl と Cl⁻" },
            { "id": "q_c2_4_3_4", "label": "問3(4) O と O²⁻" }
          ]
        },
        {
          "id": "p2_4_step2_group_qlink",
          "label": "📝 このStepの確認問題",
          "step": 2,
          "subLabel": "11問",
          "explanation": "このStepに対応する演習・確認問題です。タップして解答画面へ移動できます。",
          "relatedQuestions": [
            { "id": "q_c2_4_1_ko", "label": "問1(コ) 大きい" },
            { "id": "q_c2_4_4_ans", "label": "問4 等電子イオン半径" },
            { "id": "q_c2_4_5_1", "label": "問5(1) イオン半径大小" },
            { "id": "q_c2_4_5_2_1", "label": "問5(2)① LiとNa" },
            { "id": "q_c2_4_5_2_2", "label": "問5(2)② LiとBe" },
            { "id": "q_c2_4_5_2_3", "label": "問5(2)③ CaとCa²⁺" },
            { "id": "q_c2_4_5_2_4", "label": "問5(2)④ ClとCl⁻" },
            { "id": "q_c2_4_6_1_ion", "label": "問6① O²⁻とNa⁺" },
            { "id": "q_c2_4_6_1_reason", "label": "問6① 理由" },
            { "id": "q_c2_4_6_2_ion", "label": "問6② Na⁺とK⁺" },
            { "id": "q_c2_4_6_2_reason", "label": "問6② 理由" }
          ]
        }
      ]
    },
    {
      "id": "p2_4_step3_group",
      "label": "【Step3：等電子配置イオンの半径】",
      "step": 3,
      "isGroup": true,
      "children": [
        {
          "id": "p2_4_n9",
          "label": "同じ電子配置のイオン",
          "step": 3,
          "subLabel": "原子番号大ほど小",
          "explanation": "<u>同じ電子配置のイオン半径は、原子番号が大きいほど小さい</u>\n\n<u>★頻出例：Ne型（10電子）のイオン ★</u>\n\n<u>O²⁻ ＞ F⁻ ＞ Na⁺ ＞ Mg²⁺ ＞ Al³⁺</u>\n\n（電子数8→9→10、10、10、10・・・じゃなくて全部10電子だが、陽子数は8→9→11→12→13と増える）\n\n<u>★頻出例：Ar型（18電子）のイオン ★</u>\n\n<u>S²⁻ ＞ Cl⁻ ＞ K⁺ ＞ Ca²⁺</u>\n\n理由：電子数が同じなのに<u>陽子数が増える→電子をより強く引きつける</u>"
        },
        {
          "id": "p2_4_n10",
          "label": "同族のイオン（別電子配置）",
          "step": 3,
          "subLabel": "下ほど大",
          "explanation": "<u>異なる電子配置（同族）のイオン半径は、原子番号が大きいほど大きい</u>\n\n例1：F⁻（Ne型）＜ Cl⁻（Ar型）＜ Br⁻（Kr型）（17族陰イオン）\n\n例2：Na⁺（Ne型）＜ K⁺（Ar型）＜ Rb⁺（Kr型）（1族陽イオン）\n\n理由：電子が外側の電子殻に入るから"
        },
        {
          "id": "p2_4_n11",
          "label": "例題：イオン半径の比較",
          "step": 3,
          "subLabel": "2つのパターン",
          "explanation": "<u>例題</u>：次の2つのイオン、大きいのはどちら？\n\n(1) O²⁻ と Na⁺ → 両方Ne型（10電子）、陽子少ないO²⁻の方が大　→ <u>O²⁻</u>\n\n(2) Na⁺ と K⁺ → 同じ1族陽イオン、原子番号大のK⁺が大　→ <u>K⁺</u>\n\n(3) Cl⁻ と S²⁻ → 両方Ar型（18電子）、陽子少ないS²⁻が大　→ <u>S²⁻</u>\n\n(4) Na⁺ と Cl⁻ → 電子配置は Ne型 vs Ar型、電子殻が多いCl⁻が大　→ <u>Cl⁻</u>\n\n(5) Mg²⁺ と Ca²⁺ → 同じ2族陽イオン、原子番号大のCa²⁺が大　→ <u>Ca²⁺</u>\n\n💡 <u>解法フロー</u>：\n\n① まず<u>電子配置が同じか？</u> Yes→陽子数が少ない方が大／No→②へ\n\n② <u>同族か？</u> Yes→原子番号大の方が大／No→電子殻数を比較"
        }
      ]
    },
    {
      "id": "p2_4_step4_group",
      "label": "【Step4：周期表の傾向性まとめ】",
      "step": 4,
      "isGroup": true,
      "children": [
        {
          "id": "p2_4_n13",
          "label": "大きさの傾向総まとめ",
          "step": 4,
          "subLabel": "全体像",
          "explanation": "比較対象 ｜ ルール ｜ 理由\n同族原子 ｜ 下ほど大 ｜ 電子殻数が増加\n同周期原子 ｜ 右ほど小 ｜ 陽子数増→電子を強く引く\n原子 vs 陽イオン ｜ 原子＞陽イオン ｜ 電子殻が1つ減少\n原子 vs 陰イオン ｜ 原子＜陰イオン ｜ 電子間反発で広がる\n等電子配置イオン ｜ 陽子多いほど小 ｜ 同じ電子数で陽子で引きつけ強く\n同族イオン ｜ 下ほど大 ｜ 電子殻数が増加"
        }
      ]
    }
  ]
};

export const chemicalBondTreeData = {
  "id": "p3_1_root",
  "label": "化学結合",
  "step": null,
  "explanation": "原子どうしを結びつけて物質を作る基本的な化学結合について整理しましょう。",
  "children": [
    {
      "id": "p3_1_step1_group",
      "label": "【Step1：化学結合の目的と種類】",
      "step": 1,
      "isGroup": true,
      "children": [
        {
          "id": "p3_1_n1",
          "label": "化学結合の目的",
          "step": 1,
          "subLabel": "貴ガス型を目指す",
          "explanation": "<u>Q1 なぜイオンになる物質が存在？</u>\n\n→ 安定した電子配置（貴ガス）を取りたいから\n\n<u>Q2 なぜ化学結合を行う？</u>\n\n→ 結合して、余ったり足りなかったりする電子を共有し、安定した電子配置を作りたいから"
        },
        {
          "id": "p3_1_n2",
          "label": "3大結合 + α（早見表）",
          "step": 1,
          "subLabel": "まず全体像",
          "explanation": "結合 ｜ 組合せ ｜ 結合の仕方 ｜ 例\nイオン結合 ｜ 金属＋非金属 ｜ 陽イオン⇔陰イオンのクーロン力 ｜ NaCl、CaCl₂\n共有結合 ｜ 非金属＋非金属 ｜ 電子対の共有 ｜ H₂O、CO₂、CH₄\n金属結合 ｜ 金属＋金属 ｜ 自由電子で結合 ｜ Cu、Fe、Al\n配位結合 ｜ 非金属＋非金属 ｜ 片方が電子対を一方的に提供（共有結合の一種） ｜ NH₄⁺、H₃O⁺\n分子間力 ｜ 分子どうし ｜ 弱い引力（結合ではない） ｜ I₂、CO₂、H₂O\n\n💡 <u>組合せ判定のコツ</u>：\n\n・金属＋非金属＝<u>イオン結合</u>\n\n・非金属＋非金属＝<u>共有結合</u>（or 配位結合）\n\n・金属＋金属＝<u>金属結合</u>"
        },
        {
          "id": "p3_1_step1_group_qlink",
          "label": "📝 このStepの確認問題",
          "step": 1,
          "subLabel": "23問",
          "explanation": "このStepに対応する演習・確認問題です。タップして解答画面へ移動できます。",
          "relatedQuestions": [
            { "id": "q_c3_1_1_a", "label": "問1(ア) 静電気" },
            { "id": "q_c3_1_1_i", "label": "問1(イ) イオン" },
            { "id": "q_c3_1_1_u", "label": "問1(ウ) 金属" },
            { "id": "q_c3_1_1_e", "label": "問1(エ) 非金属" },
            { "id": "q_c3_1_2_1", "label": "問2(1) NaCl" },
            { "id": "q_c3_1_2_6", "label": "問2(6) MgO" },
            { "id": "q_c3_1_2_10", "label": "問2(10) CaCl₂" },
            { "id": "q_c3_1_5_2", "label": "問5(2) Na-Cl" },
            { "id": "q_c3_1_5_4", "label": "問5(4) Mg-O" },
            { "id": "q_c3_1_7_ans", "label": "問7 ア" },
            { "id": "q_c3_1_1_o", "label": "問1(オ) 共有" },
            { "id": "q_c3_1_1_ka", "label": "問1(カ) 非金属" },
            { "id": "q_c3_1_2_2", "label": "問2(2) H₂O" },
            { "id": "q_c3_1_2_5", "label": "問2(5) CO₂" },
            { "id": "q_c3_1_2_8", "label": "問2(8) HCl" },
            { "id": "q_c3_1_2_9", "label": "問2(9) NH₃" },
            { "id": "q_c3_1_3_3", "label": "問3(3) 共有・非共有電子対" },
            { "id": "q_c3_1_5_1", "label": "問5(1) H-Cl" },
            { "id": "q_c3_1_5_3", "label": "問5(3) C-O" },
            { "id": "q_c3_1_1_ke", "label": "問1(ケ) 自由" },
            { "id": "q_c3_1_1_ko", "label": "問1(コ) 金属" },
            { "id": "q_c3_1_2_4", "label": "問2(4) Fe" },
            { "id": "q_c3_1_2_7", "label": "問2(7) Cu" }
          ]
        }
      ]
    },
    {
      "id": "p3_1_step2_group",
      "label": "【Step2：イオン結合】",
      "step": 2,
      "isGroup": true,
      "children": [
        {
          "id": "p3_1_n4",
          "label": "イオン結合とは",
          "step": 2,
          "subLabel": "金属＋非金属",
          "explanation": "<u>イオン結合</u>＝陽イオンと陰イオンの間に静電気的な引力（<u>クーロン力</u>）が働く結びつき。\n\n<u>金属元素＋非金属元素</u>　の組合せ\n\n<u>例：NaCl の作り方</u>\n\n❶ Na → Na⁺ + e⁻（Ne型に）\n\n❷ Cl + e⁻ → Cl⁻（Ar型に）\n\n❸ Na⁺ と Cl⁻ がクーロン力で引き合う\n\n❹ Na⁺ と Cl⁻ が連続したイオン構造（<u>イオン結晶</u>）\n\n🔗【NaClのイオン結合】\n\nNa（K2 L8 M1）　　Cl（K2 L8 M7）\n\n　　　　│ e⁻を渡す\n\n　　　　▼\n\nNa⁺（K2 L8＝Ne型）＋ Cl⁻（K2 L8 M8＝Ar型）\n\n　　　↑ ↓ クーロン力で引き合う\n\n　　NaCl（イオン結晶）"
        },
        {
          "id": "p3_1_step2_group_qlink",
          "label": "📝 このStepの確認問題",
          "step": 2,
          "subLabel": "11問",
          "explanation": "このStepに対応する演習・確認問題です。タップして解答画面へ移動できます。",
          "relatedQuestions": [
            { "id": "q_c3_1_1_se", "label": "問1(セ) 非共有" },
            { "id": "q_c3_1_1_sa", "label": "問1(サ) 単" },
            { "id": "q_c3_1_1_shi", "label": "問1(シ) 二重" },
            { "id": "q_c3_1_1_su", "label": "問1(ス) 三重" },
            { "id": "q_c3_1_3_1", "label": "問3(1) 単・二・三重結合" },
            { "id": "q_c3_1_1_ki", "label": "問1(キ) 非共有電子" },
            { "id": "q_c3_1_1_ku", "label": "問1(ク) 配位" },
            { "id": "q_c3_1_2_3", "label": "問2(3) NH₄Cl" },
            { "id": "q_c3_1_3_2", "label": "問3(2) 配位結合の性質の違い" },
            { "id": "q_c3_1_4_ans", "label": "問4 供与体" },
            { "id": "q_c3_1_6_ans", "label": "問6 全て同一でない結合" }
          ]
        }
      ]
    },
    {
      "id": "p3_1_step3_group",
      "label": "【Step3：共有結合（電子式・構造式）】",
      "step": 3,
      "isGroup": true,
      "children": [
        {
          "id": "p3_1_n6",
          "label": "共有結合とは",
          "step": 3,
          "subLabel": "非金属どうし",
          "explanation": "<u>共有結合</u>＝価電子が2個の原子の間で共有されて形成される結合。\n\n<u>非金属元素どうし</u>の組合せ\n\n<u>例：Cl₂</u>　お互い価電子7個（8までにあと1個足りない）\n\n→ 不対電子を1個ずつ出し合って<u>共有電子対</u>にする\n\n→ お互いの最外殻が8個（Ar型）で安定化"
        },
        {
          "id": "p3_1_n7",
          "label": "電子式",
          "step": 3,
          "subLabel": "最外殻電子を点で表記",
          "explanation": "<u>電子式</u>＝最外殻電子だけに注目する式。\n\n<u>★ 書くルール ★</u>\n\n① 元素記号の<u>上下左右</u>に最外殻電子を分散させて書く\n\n② 電子が5個以上のとき、はじめて電子対を作る\n\n③ 結合させるときは、<u>すべての不対電子が共有電子対</u>になるようにする\n\n<u>★ 用語 ★</u>\n\n・<u>電子対</u>：2個ペア\n\n・<u>不対電子</u>：1個（結合に使える電子）\n\n・<u>共有電子対</u>：結合に使われた電子対\n\n・<u>非共有電子対</u>：結合に使われない電子対\n\n🔬【電子式の例（水 H₂O）】\n\n　　 ⁚ Ö⁚\n\n　H : O : H\n\n　　 ⁚ ⁚\n\nO の周りに8個の電子（うち共有2組・非共有2組）\n\nH の周りに2個の電子（K殻閉殻）"
        },
        {
          "id": "p3_1_n8",
          "label": "構造式",
          "step": 3,
          "subLabel": "共有電子対を線で表記",
          "explanation": "<u>構造式</u>＝共有電子対1組を<u>1本の線（価標）</u>で表した化学式。\n\n・単結合＝1本（H–Cl）\n\n・二重結合＝2本（O=C=O）\n\n・三重結合＝3本（N≡N）\n\n<u>★ 原子価 ★</u>＝原子1個がもつ価標の数＝不対電子の数\n\nH: <u>1価</u>、O: <u>2価</u>、N: <u>3価</u>、C: <u>4価</u>、Cl・F: <u>1価</u>\n\n分子 ｜ 電子式（概略） ｜ 構造式 ｜ 結合の種類\nH₂ ｜ H:H ｜ H–H ｜ 単結合\nHCl ｜ H:Cl: ｜ H–Cl ｜ 単結合\nH₂O ｜ H:O:H ｜ H–O–H ｜ 単結合×2\nNH₃ ｜ H:N:H (H) ｜ H–N(–H)–H ｜ 単結合×3\nCH₄ ｜ H:C:H (H,H) ｜ H₂C(H)H ｜ 単結合×4\nCO₂ ｜ O::C::O ｜ O=C=O ｜ 二重結合×2\nN₂ ｜ N:::N ｜ N≡N ｜ 三重結合"
        },
        {
          "id": "p3_1_n9",
          "label": "単結合・二重結合・三重結合",
          "step": 3,
          "subLabel": "3つの結合パターン",
          "explanation": "<u>① 単結合（HCl）</u>：H–Cl\n\n<u>② 二重結合（CO₂・O₂）</u>：O=C=O、O=O\n\n<u>③ 三重結合（N₂）</u>：N≡N\n\n💡 結合に単・二重・三重と種類があるのは「<u>不対電子をすべて共有電子対にしなければいけない</u>」から\n\n⚠️ <u>結合の強さ・短さ</u>：三重結合 > 二重結合 > 単結合（結合が多いほど強く短い）"
        }
      ]
    },
    {
      "id": "p3_1_step4_group",
      "label": "【Step4：配位結合】",
      "step": 4,
      "isGroup": true,
      "children": [
        {
          "id": "p3_1_n11",
          "label": "配位結合とは",
          "step": 4,
          "subLabel": "片方が電子対を提供",
          "explanation": "<u>配位結合</u>＝一方の原子が<u>非共有電子対を一方的に提供</u>する共有結合。\n\n結合後の状態は<u>共有結合と全く同じ</u>＝区別できない。\n\n<u>★ 受験頻出の配位結合4種 ★</u>\n\n❶ <u>NH₄⁺</u>（アンモニウムイオン）＝NH₃＋H⁺\n\n　→ Nの非共有電子対がH⁺に配位\n\n❷ <u>H₃O⁺</u>（オキソニウムイオン）＝H₂O＋H⁺\n\n　→ Oの非共有電子対がH⁺に配位\n\n❸ <u>錯イオン</u>（金属イオンに非共有電子対が配位）\n\n　例：[Cu(NH₃)₄]²⁺ テトラアンミン銅(Ⅱ)イオン\n\n❹ <u>硫酸 H₂SO₄、硝酸 HNO₃、リン酸 H₃PO₄</u>\n\n　→ 酸素が一方的に電子を2個出すため、配位結合を含む\n\n🔬【NH₄⁺の生成】\n\n　H⁺ + :NH₃　→　[H–NH₃]⁺ = NH₄⁺\n\n　　　　↑\n\nNの非共有電子対がH⁺に配位\n\n＊できあがったN–Hの4本は全て等価（区別できない）"
        }
      ]
    },
    {
      "id": "p3_1_step5_group",
      "label": "【Step5：金属結合・分子間力】",
      "step": 1,
      "isGroup": true,
      "children": [
        {
          "id": "p3_1_n13",
          "label": "金属結合",
          "step": 1,
          "subLabel": "自由電子で結合",
          "explanation": "<u>金属結合</u>＝金属原子が価電子を出し合い、<u>自由電子</u>として金属全体で共有する結合。\n\n<u>金属元素どうし</u>の組合せ\n\n・金属原子が規則正しく配列＝<u>金属結晶</u>\n\n・自由電子が動き回る→<u>電気伝導性・熱伝導性・展性・延性</u>\n\n🔗【金属結合のイメージ】\n\nFe²⁺ Fe²⁺ Fe²⁺ Fe²⁺\n\n　⁻ ⁻ ⁻ ⁻ ⁻ ⁻ ⁻ ← 自由電子（金属全体を動き回る）\n\nFe²⁺ Fe²⁺ Fe²⁺ Fe²⁺\n\n（陽イオンが規則正しく並び、電子が海のように動く）"
        },
        {
          "id": "p3_1_n14",
          "label": "分子間力による結合",
          "step": 1,
          "subLabel": "弱い力",
          "explanation": "<u>分子間力</u>＝分子間に働く、イオン結合や共有結合より<u>はるかに弱い力</u>。\n\n分子が規則正しく配列した固体＝<u>分子結晶</u>\n\n<u>★ 絶対暗記の分子結晶3つ ★</u>\n\n❶ <u>ヨウ素 I₂</u>\n\n❷ <u>ドライアイス CO₂</u>\n\n❸ <u>ナフタレン C₁₀H₈</u>\n\n→ 穏やかに加熱で分子間力は切れるが分子は壊れない（<u>昇華</u>）\n\n💡 分子間力は「結合」というより「引力」で、共有結合や金属結合の 1/100 以下の強さ"
        },
        {
          "id": "p3_1_n15",
          "label": "結合の強さの比較",
          "step": 1,
          "subLabel": "共有＞イオン＞金属＞＞分子間",
          "explanation": "<u>★ 結合・引力の強さの順序 ★</u>\n\n<u>共有結合 > イオン結合 > 金属結合 >> 水素結合 > ファンデルワールス力</u>\n\n💡 結合が強いほど<u>融点・沸点が高い</u>。共有結合結晶（ダイヤモンド）は融点3550℃！"
        }
      ]
    }
  ]
};

export const crystalTreeData = {
  "id": "p3_2_root",
  "label": "結晶の種類",
  "step": null,
  "explanation": "結晶は構成する粒子とそれらを結びつける「化学結合」の種類により、大きく4大結晶に分類されます。\nそれぞれの結晶が持つ粒子・結合、そして融点や導電性などの性質を体系的に整理しましょう。",
  "children": [
    {
      "id": "p3_2_step1_group",
      "label": "【Step1：結晶の基本と組成式・分子式】",
      "step": 1,
      "isGroup": true,
      "children": [
        {
          "id": "p3_2_n1",
          "label": "結晶とは",
          "step": 1,
          "subLabel": "規則正しい配列＋融点一定",
          "explanation": "<u>結晶</u>＝原子・分子・イオンが規則正しく配列している固体＋融点が一定。\n\n<u>無定形固体（非晶質・アモルファス）</u>＝粒子が不規則配列、融点も一定でない。\n\n💡 例：ガラス、プラスチックは非晶質（アモルファス）"
        },
        {
          "id": "p3_2_n2",
          "label": "組成式と分子式",
          "step": 1,
          "subLabel": "化学式の書き分け",
          "explanation": "<u>組成式</u>＝構成イオン・原子の割合を<u>最も簡単な整数比</u>で表した式\n\n　　→ イオン結晶・共有結合結晶・金属結晶で使う\n\n<u>分子式</u>＝分子を作る原子の数で表した式\n\n　　→ 分子結晶で使う\n\n<u>★ 組成式の決め方（復習）★</u>\n\n（陽イオンの価数）×（陽イオンの数）＝（陰イオンの価数）×（陰イオンの数）\n\n例1：Na⁺ と Cl⁻ → <u>NaCl</u>（1×1＝1×1）\n\n例2：Ca²⁺ と Cl⁻ → <u>CaCl₂</u>（2×1＝1×2）\n\n例3：Al³⁺ と O²⁻ → <u>Al₂O₃</u>（3×2＝2×3）"
        },
        {
          "id": "p3_2_step1_group_qlink",
          "label": "📝 このStepの確認問題",
          "step": 1,
          "subLabel": "29問",
          "explanation": "このStepに対応する演習・確認問題です。タップして解答画面へ移動できます。",
          "relatedQuestions": [
            { "id": "q_c3_2_1_a", "label": "問1(ア) イオン" },
            { "id": "q_c3_2_1_e", "label": "問1(エ) 通さない" },
            { "id": "q_c3_2_1_o", "label": "問1(オ) 融解" },
            { "id": "q_c3_2_1_ka", "label": "問1(カ) 水溶液" },
            { "id": "q_c3_2_2_1", "label": "問2(1) NaCl" },
            { "id": "q_c3_2_2_8", "label": "問2(8) 塩化カルシウム" },
            { "id": "q_c3_2_3_4", "label": "問3(4) 性質" },
            { "id": "q_c3_2_4_1", "label": "問4(1) 電気伝功性" },
            { "id": "q_c3_2_1_ki", "label": "問1(キ) 分子" },
            { "id": "q_c3_2_1_ko", "label": "問1(コ) 通さない" },
            { "id": "q_c3_2_2_4", "label": "問2(4) ドライアイス" },
            { "id": "q_c3_2_2_5", "label": "問2(5) ヨウ素" },
            { "id": "q_c3_2_2_10", "label": "問2(10) ナフタレン" },
            { "id": "q_c3_2_2_12", "label": "問2(12) 氷" },
            { "id": "q_c3_2_3_2", "label": "問3(2) 性質" },
            { "id": "q_c3_2_1_sa", "label": "問1(サ) 共有結合" },
            { "id": "q_c3_2_1_se", "label": "問1(セ) 黒鉛" },
            { "id": "q_c3_2_2_2", "label": "問2(2) ダイヤモンド" },
            { "id": "q_c3_2_2_6", "label": "問2(6) 二酸化ケイ素" },
            { "id": "q_c3_2_2_9", "label": "問2(9) 黒鉛" },
            { "id": "q_c3_2_3_1", "label": "問3(1) 性質" },
            { "id": "q_c3_2_4_2", "label": "問4(2) 黒鉛の特性" },
            { "id": "q_c3_2_1_so", "label": "問1(ソ) 金属" },
            { "id": "q_c3_2_2_3", "label": "問2(3) 鉄" },
            { "id": "q_c3_2_2_7", "label": "問2(7) アルミニウム" },
            { "id": "q_c3_2_2_11", "label": "問2(11) 銅" },
            { "id": "q_c3_2_3_3", "label": "問3(3) 性質" },
            { "id": "q_c3_2_4_3", "label": "問4(3) 変形に強い理由" },
            { "id": "q_c3_2_7_ans", "label": "問7 未知の固体" }
          ]
        }
      ]
    },
    {
      "id": "p3_2_step2_group",
      "label": "【Step2：4種の結晶と特徴】",
      "step": 2,
      "isGroup": true,
      "children": [
        {
          "id": "p3_2_n4",
          "label": "イオン結晶",
          "step": 2,
          "subLabel": "Na⁺・Cl⁻",
          "explanation": "<u>イオン結晶</u>（化学式：組成式）\n\n<u>性質</u>\n\n❶ 融点は<u>高い</u>（クーロン力が強い）\n\n❷ 強い力を加えると<u>割れ、もろい</u>（<u>劈開</u>：同電荷同士が向かい合うと反発）\n\n❸ 結晶中は自由電子がない→<u>電気を通さない</u>\n\n❹ 融解した液体・水溶液は<u>電気を通す</u>（イオンが動けるから）\n\n❺ 多くは<u>水に溶けやすい</u>（極性溶媒に溶ける）\n\n<u>例</u>：NaCl、NaOH、KOH、CaCO₃、CaCl₂\n\n💥【劈開（へきかい）とは】\n\nNaClに力を加えると、Na⁺同士・Cl⁻同士が向き合ってしまう\n\n→ 反発で割れる → <u>特定の平面で割れやすい</u>"
        },
        {
          "id": "p3_2_n5",
          "label": "分子結晶",
          "step": 2,
          "subLabel": "I₂・CO₂・ナフタレン",
          "explanation": "<u>分子結晶</u>（化学式：分子式）\n\n<u>性質</u>\n\n❶ 融点は<u>低い</u>（分子間力が弱い）\n\n❷ 分子間力が切れやすい→<u>やわらかくもろい</u>\n\n❸ <u>昇華するものがある</u>（I₂、CO₂、C₁₀H₈）\n\n❹ 結晶も融解液も<u>電気を通さない</u>（イオンも自由電子もない）\n\n<u>例（絶対暗記）</u>：<u>ヨウ素 I₂・ドライアイス CO₂・ナフタレン C₁₀H₈</u>\n\nその他：氷 H₂O、砂糖 C₁₂H₂₂O₁₁"
        },
        {
          "id": "p3_2_n6",
          "label": "共有結合結晶",
          "step": 2,
          "subLabel": "ダイヤ・黒鉛・Si・SiO₂",
          "explanation": "<u>共有結合結晶（共有結合の結晶）</u>＝多数の非金属原子が次々と共有結合してできる結晶（化学式：組成式）\n\n<u>性質</u>\n\n❶ 融点は<u>極めて高い</u>（結合が強く多数）\n\n❷ <u>極めて硬く、変形しにくい</u>\n\n❸ 自由電子がない→<u>電気を通さない</u>\n\n　<u>※例外：黒鉛は電気を通す</u>（各炭素の1個の価電子が平面を動く）\n\n<u>例（この4つだけでOK）</u>：\n\n・<u>ダイヤモンド C</u>（正四面体構造・非常に硬い）\n\n・<u>黒鉛 C</u>（層状構造・電気通す）\n\n・<u>ケイ素 Si</u>（半導体）\n\n・<u>二酸化ケイ素 SiO₂</u>（石英・水晶・光ファイバー）"
        },
        {
          "id": "p3_2_n7",
          "label": "金属結晶",
          "step": 2,
          "subLabel": "Cu・Fe・Zn",
          "explanation": "<u>金属結晶</u>（化学式：組成式）\n\n<u>性質（自由電子がすべての鍵！）</u>\n\n❶ 自由電子が移動する→<u>結晶も液体も電気を通す</u>\n\n❷ <u>展性</u>：叩くと薄く広がる（例：金箔＝金の展性を利用）\n\n❸ <u>延性</u>：引っ張ると長く伸びる（例：金線・銅線）\n\n❹ 熱もよく伝える（自由電子が動くため）\n\n❺ 電気伝導性は<u>高温ほど低くなる</u>（原子の振動が電子を妨げる）\n\n<u>例</u>：Cu、Fe、Zn、Mg、Al、Ag、Au、Hg（液体）\n\n💡 <u>展性・延性ランキング</u>：Au ＞ Ag ＞ Cu ＞ Al ＞ Fe（金が最も広がりやすい）"
        },
        {
          "id": "p3_2_step2_group_qlink",
          "label": "📝 このStepの確認問題",
          "step": 2,
          "subLabel": "8問",
          "explanation": "このStepに対応する演習・確認問題です。タップして解答画面へ移動できます。",
          "relatedQuestions": [
            { "id": "q_c3_2_1_i", "label": "問1(イ) 高い" },
            { "id": "q_c3_2_1_ku", "label": "問1(ク) 低い" },
            { "id": "q_c3_2_1_shi", "label": "問1(シ) 極めて高い" },
            { "id": "q_c3_2_6_ans", "label": "問6 誤判定" },
            { "id": "q_c3_2_1_u", "label": "問1(ウ) 脆い" },
            { "id": "q_c3_2_1_ke", "label": "問1(ケ) 昇華" },
            { "id": "q_c3_2_1_su", "label": "問1(ス) 極めて硬い" },
            { "id": "q_c3_2_1_ta", "label": "問1(タ) 展性" }
          ]
        }
      ]
    },
    {
      "id": "p3_2_step3_group",
      "label": "【Step3：結晶の比較・見分け方】",
      "step": 3,
      "isGroup": true,
      "children": [
        {
          "id": "p3_2_n9",
          "label": "4種結晶の総まとめ表",
          "step": 3,
          "subLabel": "絶対覚える比較表",
          "explanation": "｜ 金属 ｜ イオン結晶 ｜ 分子結晶 ｜ 共有結合結晶\n構成粒子 ｜ 金属原子 ｜ 陽・陰イオン ｜ 分子 ｜ 非金属原子\n結合の種類 ｜ 金属結合 ｜ イオン結合 ｜ 共有結合（内部）＋分子間力 ｜ 共有結合\n化学式 ｜ 組成式 ｜ 組成式 ｜ 分子式 ｜ 組成式\n融点 ｜ 高低様々 ｜ 高い ｜ 低い ｜ 非常に高い\n電気伝導性（固体） ｜ ◯ ｜ × ｜ × ｜ ×（黒鉛のみ◯）\n電気伝導性（融解液） ｜ ◯ ｜ ◯ ｜ × ｜ ×\n硬さ ｜ 展性・延性 ｜ 硬いがもろい（劈開） ｜ やわらかくもろい ｜ 非常に硬い\n例 ｜ Cu, Fe, Zn ｜ NaCl, NaOH ｜ I₂, CO₂, H₂O ｜ C, Si, SiO₂, SiC\n\n<u>★ 考え方のコツ ★</u>\n\n❶ <u>分子結晶以外はすべて組成式</u>（3つは組成式、分子結晶だけ分子式）\n\n❷ 結晶の強さ：<u>共有結合 ＞ イオン結合 ＞ 金属結晶 ＞＞ 分子間力</u>\n\n❸ <u>電気を通すもの</u>：金属結晶（固体・液体）、イオン結晶（融解液・水溶液のみ）、黒鉛（例外）"
        },
        {
          "id": "p3_2_n10",
          "label": "ダイヤモンドと黒鉛の違い",
          "step": 3,
          "subLabel": "結合の手の数",
          "explanation": "<u>ダイヤモンド</u>\n\n・炭素原子が<u>4個の価電子すべて</u>を使って4個の炭素と共有結合\n\n・<u>正四面体</u>を単位とする立体網目構造\n\n・極めて硬く、融点高\n\n・自由電子なし→電気を通さない\n\n<u>黒鉛（グラファイト）</u>\n\n・炭素原子が<u>3個の価電子</u>を使って3個の炭素と共有結合\n\n・<u>正六角形の平面層状構造</u>（層は弱い分子間力で重なる）\n\n・うすくはがれやすく、やわらかい\n\n・残る1個の価電子が平面を動く→<u>例外的に電気を通す</u>\n\n💎【ダイヤモンド】　　　　✏️【黒鉛】\n\n　　C-C-C　　　　　　　　　C=C-C=C（六角形の層）\n\n　　│ │ │　　　　　　　　　│ │ │ │\n\n　　C-C-C（立体）　　　　　C=C-C=C\n\n　　│ │ │　　　　　　　　　　　│\n\n　　C-C-C　　　　　　　　　 弱い分子間力\n\n　　　　　　　　　　　　　　　　│\n\n　全4本の共有結合　　　　　C=C-C=C（次の層）"
        },
        {
          "id": "p3_2_n11",
          "label": "ケイ素と二酸化ケイ素",
          "step": 3,
          "subLabel": "半導体・光ファイバー",
          "explanation": "<u>ケイ素 Si</u>：\n\n・半導体の性質\n\n・地殻中に酸素に次いで多量に存在\n\n・コンピュータのIC（集積回路）・太陽電池の材料\n\n<u>二酸化ケイ素 SiO₂</u>：\n\n・Si:O ＝ 1:2 の比で共有結合\n\n・天然には<u>石英・水晶・ケイ砂</u>として存在\n\n・高温で融解後冷却→<u>石英ガラス</u>（光ファイバーの材料）"
        },
        {
          "id": "p3_2_n12",
          "label": "例題：結晶の分類",
          "step": 3,
          "subLabel": "見分け方の練習",
          "explanation": "<u>例題</u>：次の物質はどの結晶か？\n\n(1) NaCl → 金属＋非金属 → <u>イオン結晶</u>\n\n(2) I₂ → 非金属分子 → <u>分子結晶</u>（昇華）\n\n(3) Cu → 金属 → <u>金属結晶</u>（自由電子）\n\n(4) SiO₂ → 非金属＋非金属、多数結合 → <u>共有結合結晶</u>\n\n(5) 氷（H₂O） → 非金属分子 → <u>分子結晶</u>\n\n(6) 黒鉛 C → 非金属、多数結合 → <u>共有結合結晶</u>（電気通す例外！）\n\n(7) NaOH → 金属＋非金属イオン → <u>イオン結晶</u>\n\n💡 <u>迷ったら組成の元素で判断</u>：金属＋非金属＝イオン結晶／金属のみ＝金属結晶／非金属分子＝分子結晶／非金属で結晶性大＝共有結合結晶"
        },
        {
          "id": "p3_2_step3_group_qlink",
          "label": "📝 このStepの確認問題",
          "step": 3,
          "subLabel": "1問",
          "explanation": "このStepに対応する演習・確認問題です。タップして解答画面へ移動できます。",
          "relatedQuestions": [
            { "id": "q_c3_2_5_ans", "label": "問5 結晶の文字式" }
          ]
        }
      ]
    },
    {
      "id": "p3_2_step4_group",
      "label": "【Step4：単位格子（発展）】",
      "step": 4,
      "isGroup": true,
      "children": [
        {
          "id": "p3_2_n14",
          "label": "単位格子とは",
          "step": 4,
          "subLabel": "結晶格子の最小単位",
          "explanation": "<u>結晶格子</u>＝結晶内での粒子の空間配列の状態。\n\n<u>単位格子</u>＝繰り返し現れる最小単位の結晶格子。\n\n<u>頻出のイオン結晶構造</u>\n\n・<u>塩化ナトリウム型（NaCl型）</u>：Na⁺とCl⁻が交互に配列\n\n・<u>塩化セシウム型（CsCl型）</u>：Cs⁺の周りに8個のCl⁻\n\n💡 定期テストレベルでは名前が出ればOK、計算は「化学」（発展）で学習"
        }
      ]
    }
  ]
};

export const interactionTreeData = {
  "id": "p3_3_root",
  "label": "分子間力と性質",
  "step": null,
  "explanation": "分子間の相互作用とその強さは、結合の極性や分子量、特別な結合があるかによって決定します。\n電気陰性度からはじまる一連のステップに沿って整理しましょう。",
  "children": [
    {
      "id": "p3_3_step1_group",
      "label": "【Step1：電気陰性度】",
      "step": 1,
      "isGroup": true,
      "children": [
        {
          "id": "p3_3_n1",
          "label": "電気陰性度とは",
          "step": 1,
          "subLabel": "共有電子対を引く強さ",
          "explanation": "<u>電気陰性度</u>＝共有結合において、原子が<u>共有電子対を引きつける強さ</u>の指標。値が大きいほど電子を強く引きつける。\n\n💡 「電気陰性度」は電子を「奪う」力ではなく、「引きつける」力。共有結合の中での話。"
        },
        {
          "id": "p3_3_n2",
          "label": "電気陰性度の覚え方",
          "step": 1,
          "subLabel": "フォンクラックス水素金属",
          "explanation": "<u>★ 覚え方「フォンクラックス水素金属」★</u>\n\n<u>F ＞ O ＞ N ≦ Cl ＞ C ＞ S ＞ 水素 ＞ 金属</u>\n\n※<u>「N と Cl をなぜ逆？」</u>→ N は水素結合をつくるため、水素化合物の沸点が高くなるから（次のStep3参照）\n\n※周期表的には「右上ほど大きい」が、Fが最大（フッ素は最強の電気陰性度）\n\n💡 <u>覚え方の解説</u>：<u>フォ</u>(F) <u>ン</u>(O) <u>クラ</u>(N, Cl) <u>ッ</u>(C) <u>クス</u>(S) <u>水素</u> <u>金属</u>\n\n・Fが最大（4.0）、次にO（3.5）、N≒Cl（3.0）、C（2.5）、S（2.5）、H（2.2）、金属（1.0前後）"
        },
        {
          "id": "p3_3_n3",
          "label": "周期表での傾向",
          "step": 1,
          "subLabel": "右上ほど大",
          "explanation": "<u>電気陰性度は周期表の右上ほど大きい</u>（貴ガスを除く）。\n\n理由：右上ほど陽子が多く、原子半径が小さいため、電子を強く引きつける。\n\n💡 貴ガスは他と結合しないため、電気陰性度は定義しない（またはとても小さい）"
        },
        {
          "id": "p3_3_step1_group_qlink",
          "label": "📝 このStepの確認問題",
          "step": 1,
          "subLabel": "25問",
          "explanation": "このStepに対応する演習・確認問題です。タップして解答画面へ移動できます。",
          "relatedQuestions": [
            { "id": "q_c3_3_1_a", "label": "問1(ア) 電気陰性度" },
            { "id": "q_c3_3_1_i", "label": "問1(イ) 極性" },
            { "id": "q_c3_3_5_1", "label": "問5(1) C-H極性" },
            { "id": "q_c3_3_5_2", "label": "問5(2) O-H極性" },
            { "id": "q_c3_3_5_3", "label": "問5(3) N-H極性" },
            { "id": "q_c3_3_5_4", "label": "問5(4) F-H極性" },
            { "id": "q_c3_3_5_5", "label": "問5(5) Cl-H極性" },
            { "id": "q_c3_3_5_ranking", "label": "問5 極性の強さ順" },
            { "id": "q_c3_3_1_u", "label": "問1(ウ) 極性分子" },
            { "id": "q_c3_3_1_e", "label": "問1(エ) 無極性分子" },
            { "id": "q_c3_3_1_o", "label": "問1(オ) 折れ線形" },
            { "id": "q_c3_3_1_ka", "label": "問1(カ) 三角錐" },
            { "id": "q_c3_3_1_ki", "label": "問1(キ) 直線" },
            { "id": "q_c3_3_1_ku", "label": "問1(ク) 正四面体" },
            { "id": "q_c3_3_2_1", "label": "問2(1) H₂" },
            { "id": "q_c3_3_2_2", "label": "問2(2) HCl" },
            { "id": "q_c3_3_2_3", "label": "問2(3) H₂O" },
            { "id": "q_c3_3_2_4", "label": "問2(4) CH₄" },
            { "id": "q_c3_3_2_5", "label": "問2(5) CO₂" },
            { "id": "q_c3_3_2_6", "label": "問2(6) NH₃" },
            { "id": "q_c3_3_2_7", "label": "問2(7) N₂" },
            { "id": "q_c3_3_2_8", "label": "問2(8) HF" },
            { "id": "q_c3_3_2_9", "label": "問2(9) CCl₄" },
            { "id": "q_c3_3_2_10", "label": "問2(10) CHCl₃" },
            { "id": "q_c3_3_7_ans", "label": "問7 誤記述の判定" }
          ]
        }
      ]
    },
    {
      "id": "p3_3_step2_group",
      "label": "【Step2：分子の極性】",
      "step": 2,
      "isGroup": true,
      "children": [
        {
          "id": "p3_3_n5",
          "label": "極性とは",
          "step": 2,
          "subLabel": "電子の偏り",
          "explanation": "<u>極性</u>＝共有結合における<u>電子の偏り</u>のこと。\n\n<u>例1（Cl₂）</u>：同じClどうし→引き合う力が同じ→電子は偏らない→<u>極性なし</u>\n\n<u>例2（HCl）</u>：HとClで引き合う力が異なる→電子がCl側に偏る→<u>極性あり</u>（Cl側δ⁻、H側δ⁺）"
        },
        {
          "id": "p3_3_n6",
          "label": "矢印の向きの決め方",
          "step": 2,
          "subLabel": "電気陰性度の大きい方へ",
          "explanation": "<u>Q</u>：分子内の極性の矢印の向きはどう決める？\n\n<u>A</u>：<u>共有電子対（電子）が引っ張られる方向</u>に向けて矢印を引く。\n\n→ 電気陰性度の<u>大きい方</u>に向けて矢印\n\n🎯【極性の矢印例】\n\nH─→Cl　（電子がClに偏る）\n\nδ⁺　δ⁻"
        },
        {
          "id": "p3_3_n7",
          "label": "極性分子・無極性分子",
          "step": 2,
          "subLabel": "分子全体で判断",
          "explanation": "<u>極性分子</u>＝分子全体として極性がある\n\n<u>無極性分子</u>＝分子全体として極性がない\n\n⚠️ 注意：<u>分子の一部の結合で極性があっても、分子全体で極性があるとは限らない！</u>\n\n（結合の極性が打ち消し合うと無極性分子になる）"
        },
        {
          "id": "p3_3_n8",
          "label": "二原子分子の極性",
          "step": 2,
          "subLabel": "同じ原子か違うか",
          "explanation": "<u>二原子分子</u>では、1つの結合が分子全体の結合となる\n\n→ 結合に極性があれば<u>極性分子</u>\n\n<u>例</u>\n\n・Cl₂：Cl–Cl → 同じ原子 → <u>無極性分子</u>\n\n・H₂、N₂、O₂：同種二原子 → <u>無極性分子</u>\n\n・HCl、HF、HBr、HI：異種二原子 → <u>極性分子</u>\n\n・CO：異種二原子 → <u>極性分子</u>"
        },
        {
          "id": "p3_3_n9",
          "label": "多原子分子の極性（形で決まる）",
          "step": 2,
          "subLabel": "超重要！",
          "explanation": "<u>多原子分子では分子の形で極性が決まる</u>\n\n<u>無極性分子</u>（極性が打ち消される）\n\n・<u>CO₂（直線型）</u>：O=C=O　左右対称で打ち消し\n\n・<u>CH₄、CCl₄（正四面体型）</u>：4方向対称で打ち消し\n\n・<u>BF₃（正三角形型）</u>：3方向対称で打ち消し\n\n<u>極性分子</u>（極性が残る）\n\n・<u>H₂O、H₂S（折れ線型）</u>：非共有電子対で折れ曲がる\n\n・<u>NH₃（三角錐型）</u>：非共有電子対で歪む\n\n・<u>HCl（直線型）</u>：異種二原子で極性\n\n💡 <u>注意</u>：「二原子分子は直線だから無極性」は間違い！HClは直線でも極性分子。\n\n💡 <u>極性分子同士・無極性分子同士はよく溶け合う</u>\n\n・水⇔メタノール（極性同士）：混じる\n\n・水⇔ヘキサン（極性⇔無極性）：混じらない\n\n・ヨウ素⇔ヘキサン（無極性同士）：溶ける"
        },
        {
          "id": "p3_3_n10",
          "label": "分子の形の決定要因",
          "step": 2,
          "subLabel": "電子対同士の反発",
          "explanation": "<u>電子対同士の反発</u>により、分子の形は決まる。\n\n分子の形 ｜ 結合角 ｜ 例 ｜ 極性\n直線型 ｜ 180° ｜ H₂、HCl、CO₂ ｜ 異種＝極性、同種＝無極性、対称CO₂＝無極性\n折れ線型 ｜ 約104.5° ｜ H₂O、H₂S ｜ 極性（Oに非共有電子対2組）\n三角錐型 ｜ 約107° ｜ NH₃、PH₃ ｜ 極性（Nに非共有電子対1組）\n正四面体型 ｜ 109.5° ｜ CH₄、CCl₄ ｜ 対称＝無極性"
        },
        {
          "id": "p3_3_step2_group_qlink",
          "label": "📝 このStepの確認問題",
          "step": 2,
          "subLabel": "10問",
          "explanation": "このStepに対応する演習・確認問題です。タップして解答画面へ移動できます。",
          "relatedQuestions": [
            { "id": "q_c3_3_1_ke", "label": "問1(ケ) ファンデルワールス" },
            { "id": "q_c3_3_3_1", "label": "問3(1) 特徴" },
            { "id": "q_c3_3_6_2", "label": "問6(2) 原因力" },
            { "id": "q_c3_3_1_ko", "label": "問1(コ) 水素結合" },
            { "id": "q_c3_3_1_sa", "label": "問1(サ) 高い" },
            { "id": "q_c3_3_3_2", "label": "問3(2) 水素結合条件" },
            { "id": "q_c3_3_3_3", "label": "問3(3) 水素化合物特性" },
            { "id": "q_c3_3_4_ans", "label": "問4 H₂Oの沸点理由" },
            { "id": "q_c3_3_6_1", "label": "問6(1) HFの大きなずれ" },
            { "id": "q_c3_3_8_1", "label": "問8(1) 沸点予想：NH₃ vs PH₃" }
          ]
        }
      ]
    },
    {
      "id": "p3_3_step3_group",
      "label": "【Step3：分子間力（ファンデルワールス力・水素結合）】",
      "step": 3,
      "isGroup": true,
      "children": [
        {
          "id": "p3_3_n12",
          "label": "分子間力とは",
          "step": 3,
          "subLabel": "弱い引力2種類",
          "explanation": "<u>分子間力</u>は大きく分けて2種類（大学ではさらに細分化）。\n\n① <u>ファンデルワールス力</u>（すべての分子間に働く弱い力）\n\n② <u>水素結合</u>（F・O・N を含む分子間に働く特に強い力）"
        },
        {
          "id": "p3_3_n13",
          "label": "ファンデルワールス力",
          "step": 3,
          "subLabel": "分子量・極性で強くなる",
          "explanation": "<u>ファンデルワールス力</u>\n\n<u>特徴</u>\n\n❶ <u>分子量が大きいほど</u>分子が大きくなり、力も強い\n\n❷ <u>無極性分子より極性分子の方</u>が力が強い\n\n⇒ <u>ファンデルワールス力が強いと沸点・融点が高くなる</u>\n\n　（状態変化が起きづらいから）\n\n💡 <u>例（同族ハロゲンの沸点）</u>：F₂ < Cl₂ < Br₂ < I₂（分子量大→ファンデルワールス力大→沸点高）"
        },
        {
          "id": "p3_3_n14",
          "label": "水素結合",
          "step": 3,
          "subLabel": "F・O・N と H の間",
          "explanation": "<u>水素結合</u>\n\n<u>特徴</u>\n\n❶ 電気陰性度が特に大きい <u>F・O・N</u> の原子間などに、<u>H（水素原子）が仲立ち</u>する形で生じる\n\n❷ タンパク質やDNA、でんぷんなどの分子内・分子間にも生じる\n\n❸ ファンデルワールス力より強い\n\n⇒ <u>HF・H₂O・NH₃ は水素結合をつくるため沸点が異常に高い</u>\n\n　これが、電気陰性度で N と Cl を逆に覚える理由\n\n🔗【水素結合のイメージ（水）】\n\n　H－O <u>····</u> H－O <u>····</u> H－O\n\n　　│　　　　│　　　　│\n\n　　H　　　　H　　　　H\n\n（<u>····</u> が水素結合、共有結合H-Oより弱いが強い引力）"
        },
        {
          "id": "p3_3_n15",
          "label": "水素化合物の沸点比較（頻出グラフ）",
          "step": 3,
          "subLabel": "HF・H₂O・NH₃だけ異常",
          "explanation": "<u>14〜17族の水素化合物の沸点</u>\n\n族 ｜ 第2周期 ｜ 第3周期 ｜ 第4周期 ｜ 第5周期\n14族 ｜ CH₄ −162℃ ｜ SiH₄ −112℃ ｜ GeH₄ −88℃ ｜ SnH₄ −52℃\n15族 ｜ NH₃ −33℃ ⚠️高い ｜ PH₃ −88℃ ｜ AsH₃ −55℃ ｜ SbH₃ −17℃\n16族 ｜ H₂O 100℃ ⚠️非常に高い ｜ H₂S −60℃ ｜ H₂Se −41℃ ｜ H₂Te −2℃\n17族 ｜ HF 20℃ ⚠️高い ｜ HCl −85℃ ｜ HBr −67℃ ｜ HI −35℃\n\n💡 <u>覚えるべきポイント</u>：\n\n・14族はきれいに分子量順に沸点上昇（水素結合なし）\n\n・15族NH₃、16族H₂O、17族HFだけ<u>異常に沸点が高い</u>→<u>水素結合</u>のため\n\n・他の族はすべて分子量順（ファンデルワールス力）"
        },
        {
          "id": "p3_3_step3_group_qlink",
          "label": "📝 このStepの確認問題",
          "step": 3,
          "subLabel": "3問",
          "explanation": "このStepに対応する演習・確認問題です。タップして解答画面へ移動できます。",
          "relatedQuestions": [
            { "id": "q_c3_3_1_shi", "label": "問1(シ) 水" },
            { "id": "q_c3_3_1_su", "label": "問1(ス) 無極性溶媒" },
            { "id": "q_c3_3_8_2", "label": "問8(2) 溶解性予想" }
          ]
        }
      ]
    },
    {
      "id": "p3_3_step4_group",
      "label": "【Step4：水の特性（水素結合による）】",
      "step": 4,
      "isGroup": true,
      "children": [
        {
          "id": "p3_3_n17",
          "label": "水の異常性",
          "step": 4,
          "subLabel": "氷は水に浮く",
          "explanation": "<u>水の特性</u>：分子間に水素結合が働き、隙間の多い立体構造をとる。\n\n❶ <u>凝固すると体積が増え、密度が減少</u>\n\n　→ 氷では水素結合により隙間構造ができる\n\n　⇒ <u>氷は水に浮く</u>（液体の方が固体より密度大という珍しい性質）\n\n❷ <u>融解すると体積は減り、密度が増加</u>\n\n　→ 水素結合の一部が切れて隙間構造が壊れる\n\n❸ <u>4℃で水の体積は最小、密度は最大</u>（1.0 g/cm³）\n\n　→ 冬に湖の底が凍らない理由\n\n💡 <u>普通の物質</u>：固体＞液体の密度（融けると体積増える）\n\n<u>水の異常</u>：氷（0.92）＜水（4℃で1.00）"
        },
        {
          "id": "p3_3_n18",
          "label": "応用例題",
          "step": 4,
          "subLabel": "極性・水素結合の総合",
          "explanation": "<u>例題1</u>：次の分子の形と極性を答えよ。\n\n(1) CO₂ → <u>直線型・無極性</u>（対称で打ち消し）\n\n(2) H₂O → <u>折れ線型・極性</u>\n\n(3) NH₃ → <u>三角錐型・極性</u>\n\n(4) CH₄ → <u>正四面体型・無極性</u>（対称）\n\n(5) HCl → <u>直線型・極性</u>\n\n<u>例題2</u>：次の物質のうち、沸点が最も高いのはどれか？\n\n① CH₄　② HCl　③ H₂O　④ H₂S\n\n→ <u>答：③ H₂O</u>（水素結合をつくるため異常に沸点が高い）\n\n💡 沸点比較は「水素結合の有無」→「分子量」→「極性」の順で判断"
        }
      ]
    }
  ]
};

export const atomicWeightTreeData = {
  "id": "p4_1_root",
  "label": "原子量・分子量・式量",
  "step": null,
  "explanation": "原子の実際の質量は極めて小さく扱いにくいため、特定の基準に基づく相対質量が使われます。\n同位体の存在割合を考慮した平均値が「原子量」です。",
  "children": [
    {
      "id": "p4_1_step1_group",
      "label": "【Step1：相対質量が必要な理由】",
      "step": 1,
      "isGroup": true,
      "children": [
        {
          "id": "p4_1_n1",
          "label": "絶対質量の問題点",
          "step": 1,
          "subLabel": "10⁻²⁴〜10⁻²²g",
          "explanation": "<u>原子1個の絶対質量</u>＝約 10⁻²⁴〜10⁻²² g\n\n→ <u>非常に小さくて扱いが大変！</u>\n\n→ そこで<u>相対質量</u>を導入\n\n例：¹²C 原子1個 ＝ 1.9926×10⁻²³ g\n\n　　¹H 原子1個 ＝ 0.16735×10⁻²³ g\n\n→ そのまま計算するのは大変！"
        },
        {
          "id": "p4_1_step1_group_qlink",
          "label": "📝 このStepの確認問題",
          "step": 1,
          "subLabel": "4問",
          "explanation": "このStepに対応する演習・確認問題です。タップして解答画面へ移動できます。",
          "relatedQuestions": [
            { "id": "q_c4_1_4_ans", "label": "問4(1) 原子Aの相対質量" },
            { "id": "q_c4_1_6_3", "label": "問5(3) 傍線部(a)の原子" },
            { "id": "q_c4_1_6_2", "label": "問5(2) 相対質量の利点" },
            { "id": "q_c4_1_7_ans", "label": "問6 誤記述の判定" }
          ]
        }
      ]
    },
    {
      "id": "p4_1_step2_group",
      "label": "【Step2：相対質量の決め方】",
      "step": 2,
      "isGroup": true,
      "children": [
        {
          "id": "p4_1_n3",
          "label": "¹²Cを基準にする",
          "step": 2,
          "subLabel": "相対質量の基準",
          "explanation": "<u>★ 相対質量のルール ★</u>\n\n① <u>炭素¹²Cの質量を、質量数と同じ12にする</u>（基準）\n\n② 他の原子の相対質量を ¹²C の12を基準に考える\n\n<u>【公式】相対質量 ＝ 12 × (その原子1個の質量 ÷ ¹²C原子1個の質量)</u>\n\n<u>例題</u>：水素 ¹H の相対質量を求めよ\n\n¹H原子1個 ＝ 0.16735×10⁻²³ g、¹²C 1個 ＝ 1.9926×10⁻²³ g\n\n¹H相対質量 ＝ 12 × (0.16735×10⁻²³ / 1.9926×10⁻²³) ≒ <u>1.0078</u>\n\n💡 相対質量は<u>単位なし</u>！比の値だから。"
        },
        {
          "id": "p4_1_step2_group_qlink",
          "label": "📝 このStepの確認問題",
          "step": 2,
          "subLabel": "5問",
          "explanation": "このStepに対応する演習・確認問題です。タップして解答画面へ移動できます。",
          "relatedQuestions": [
            { "id": "q_c4_1_1_ans", "label": "問1 炭素の原子量" },
            { "id": "q_c4_1_2_ans", "label": "問2 ホウ素の原子量" },
            { "id": "q_c4_1_5_ans", "label": "問4(2) 元素Xの原子量" },
            { "id": "q_c4_1_6_4", "label": "問5(4) Mgの原子量" },
            { "id": "q_c4_1_3_ans", "label": "問3 塩素の存在割合" }
          ]
        }
      ]
    },
    {
      "id": "p4_1_step3_group",
      "label": "【Step3：原子量（同位体の存在比平均）】",
      "step": 3,
      "isGroup": true,
      "children": [
        {
          "id": "p4_1_n5",
          "label": "原子量とは",
          "step": 3,
          "subLabel": "同位体の存在比平均",
          "explanation": "<u>原子量</u>＝各元素の同位体の<u>相対質量と存在比から求めた平均値</u>（単位なし）。\n\n<u>【公式】原子量 ＝ Σ ( 同位体の相対質量 × 存在比(%)/100 )</u>\n\n<u>例題</u>：炭素の原子量を求めよ。¹²C は 99%、¹³C は 1%\n\n原子量 ＝ 12 × 99/100 ＋ 13 × 1/100 ＝ 11.88 ＋ 0.13 ＝ <u>12.01</u>\n\n💡 <u>特徴</u>：\n\n・原子量は<u>存在比最大の同位体の質量数に近い</u>\n\n・原子番号と原子量の大小は必ずしも一致しない（例：Ar と K は原子量逆転）\n\n・問題では必ず原子量が与えられる（暗記不要）"
        },
        {
          "id": "p4_1_n6",
          "label": "例題：塩素の原子量",
          "step": 3,
          "subLabel": "2つの同位体から",
          "explanation": "<u>例題</u>：塩素には ³⁵Cl（相対質量35）が75%、³⁷Cl（相対質量37）が25% ある。原子量を求めよ。\n\n<u>解答</u>：\n\n原子量 ＝ 35 × 75/100 ＋ 37 × 25/100\n\n　　　＝ 26.25 ＋ 9.25\n\n　　　＝ <u>35.5</u>\n\n💡 だから塩素の原子量は35.5になる（元素表の値と一致）"
        },
        {
          "id": "p4_1_n7",
          "label": "例題：存在割合の逆算",
          "step": 3,
          "subLabel": "応用問題",
          "explanation": "<u>例題</u>：銅の原子量は63.5。⁶³Cu と ⁶⁵Cu の2つの同位体がある。それぞれの存在割合を求めよ。\n\n<u>解答</u>：\n\n⁶³Cu の割合を x%、⁶⁵Cu の割合を (100−x)% とすると\n\n63 × x/100 ＋ 65 × (100−x)/100 ＝ 63.5\n\n63x ＋ 65(100−x) ＝ 6350\n\n63x ＋ 6500 − 65x ＝ 6350\n\n−2x ＝ −150\n\nx ＝ 75\n\n→ <u>⁶³Cu が 75%、⁶⁵Cu が 25%</u>\n\n💡 存在割合の合計は100%（片方を x、もう片方を 100−x とおく）"
        }
      ]
    },
    {
      "id": "p4_1_step4_group",
      "label": "【Step4：分子量・式量】",
      "step": 4,
      "isGroup": true,
      "children": [
        {
          "id": "p4_1_n9",
          "label": "分子量・式量とは",
          "step": 4,
          "subLabel": "原子量の和",
          "explanation": "<u>分子量</u>＝分子を構成する元素の<u>原子量の総和</u>（分子の相対質量）\n\n　→ 分子式で書ける物質（H₂O、CO₂、NH₃ など）\n\n<u>式量</u>＝分子でない物質（イオン結晶、金属など）の<u>組成式を構成する元素の原子量の総和</u>\n\n　→ NaCl、Na⁺、SO₄²⁻ など\n\n<u>例題</u>：原子量 C=12, N=14, O=16, H=1.0, S=32 として計算せよ\n\n(1) NO₂ ＝ 14＋16×2 ＝ <u>46</u>\n\n(2) C₂H₆ ＝ 12×2＋1×6 ＝ <u>30</u>\n\n(3) S²⁻ ＝ <u>32</u>（電子の質量は無視）\n\n(4) H₂SO₄ ＝ 1×2＋32＋16×4 ＝ <u>98</u>\n\n(5) NaCl ＝ 23＋35.5 ＝ <u>58.5</u>（Na=23、Cl=35.5）\n\n(6) (NH₄)₂SO₄ ＝ (14＋1×4)×2＋32＋16×4 ＝ 36＋32＋64 ＝ <u>132</u>\n\n💡 <u>イオンの式量</u>：電子の質量は無視するので、原子量の和と同じ"
        }
      ]
    }
  ]
};

export const amountOfSubstanceTreeData = {
  "id": "p4_2_root",
  "label": "物質量 mol",
  "step": null,
  "explanation": "原子・分子といった極めて小規模な粒子の集まりを、1単位「mol」として扱うことで、質量 [g] や体積 [L] などのマクロな量との変換が可能になります。",
  "children": [
    {
      "id": "p4_2_step1_group",
      "label": "【Step1：molとアボガドロ定数】",
      "step": 1,
      "isGroup": true,
      "children": [
        {
          "id": "p4_2_n1",
          "label": "molとは",
          "step": 1,
          "subLabel": "数の単位＝6.0×10²³個",
          "explanation": "<u>mol（モル）＝数の単位</u>。1 mol で物質が <u>6.0×10²³個</u> あることを表す。\n\n<u>アボガドロ定数 Nₐ ＝ 6.0×10²³ /mol</u>\n\n例：2 mol ＝ 2 × 6.0×10²³ ＝ <u>1.2×10²⁴ 個</u>\n\n例：0.5 mol ＝ 0.5 × 6.0×10²³ ＝ <u>3.0×10²³ 個</u>\n\n💡 「mol」は「ダース（1ダース＝12個）」の巨大版と考えるとイメージしやすい"
        },
        {
          "id": "p4_2_n2",
          "label": "なぜ 6.0×10²³ ？",
          "step": 1,
          "subLabel": "molの定義",
          "explanation": "<u>molの定義</u>：¹²C 12g に含まれる炭素原子の数を 1 mol とする\n\n→ 12g ÷ (¹²C 1個の質量 1.9926×10⁻²³ g) ≒ <u>6.02×10²³</u>個\n\n→ この値を<u>アボガドロ定数</u>と呼ぶ\n\n💡 <u>原子量とgのつなぎ役</u>：\n\n原子量M（無名数）→ その物質1molは M[g] という関係"
        },
        {
          "id": "p4_2_step1_group_qlink",
          "label": "📝 このStepの確認問題",
          "step": 1,
          "subLabel": "3問",
          "explanation": "このStepに対応する演習・確認問題です。タップして解答画面へ移動できます。",
          "relatedQuestions": [
            { "id": "q_c4_2_2_ans", "label": "問2 水分子と水素原子のmol" },
            { "id": "q_c4_2_1_ans", "label": "問1 空気の平均モル質量" },
            { "id": "q_c4_2_3_ans", "label": "問3 水分子の質量" }
          ]
        }
      ]
    },
    {
      "id": "p4_2_step2_group",
      "label": "【Step2：モル質量とモル体積】",
      "step": 2,
      "isGroup": true,
      "children": [
        {
          "id": "p4_2_n4",
          "label": "モル質量",
          "step": 2,
          "subLabel": "1 mol あたりのg",
          "explanation": "<u>モル質量 g/mol</u>＝原子量・分子量・式量に「g/mol」をつけたもの\n\n　→ <u>1 mol の質量を g で表したもの</u>\n\n例：H₂O のモル質量 ＝ 1×2＋16 ＝ <u>18 g/mol</u>\n\n　（つまり 1 mol の水は 18 g）\n\n例：NaCl のモル質量 ＝ 23＋35.5 ＝ <u>58.5 g/mol</u>\n\n例：CO₂ のモル質量 ＝ 12＋16×2 ＝ <u>44 g/mol</u>"
        },
        {
          "id": "p4_2_n5",
          "label": "標準状態の体積（22.4 L）",
          "step": 2,
          "subLabel": "気体は 1 mol = 22.4 L",
          "explanation": "<u>標準状態</u>＝ <u>0℃、1.013×10⁵ Pa</u>（1気圧）\n\n<u>★ 標準状態では、どんな気体でも 1 mol ＝ 22.4 L ★</u>\n\nこれを<u>モル体積</u>という\n\n<u>例題</u>：CO₂ が 88 g あったとき標準状態で何 L？\n\n88 g ÷ 44 (g/mol) ＝ 2 mol → 2 × 22.4 ＝ <u>44.8 L</u>\n\n💡 <u>気体の種類によらず 22.4 L</u>！（重い CO₂ も軽い H₂ も同じ）これがアボガドロの法則。"
        },
        {
          "id": "p4_2_n6",
          "label": "密度（気体・液体）",
          "step": 2,
          "subLabel": "質量と体積の関係",
          "explanation": "<u>密度</u>＝1 mL（1 cm³） あたり何 g か。単位は g/mL（＝g/cm³）\n\n例：水の密度 ＝ 1.0 g/mL ⇒ 1 g の水の体積は 1 mL\n\n例：Fe の密度 ＝ 7.9 g/cm³ ⇒ 1 cm³ の鉄は7.9g\n\n<u>例題</u>：水 3 mol の体積は？（水の密度 1.0 g/mL）\n\n3 mol × 18 g/mol ÷ 1.0 g/mL ＝ <u>54 mL</u>\n\n💡 <u>気体の密度</u>＝分子量 ÷ 22.4（標準状態、単位 g/L）"
        },
        {
          "id": "p4_2_step2_group_qlink",
          "label": "📝 このStepの確認問題",
          "step": 2,
          "subLabel": "5問",
          "explanation": "このStepに対応する演習・確認問題です。タップして解答画面へ移動できます。",
          "relatedQuestions": [
            { "id": "q_c4_2_4_ans", "label": "問4 CO2の標準状態体積" },
            { "id": "q_c4_2_5_ans", "label": "問5 混合気体の質量" },
            { "id": "q_c4_2_6_ans", "label": "問6 密度から分子量の算出" },
            { "id": "q_c4_2_7_ans", "label": "問7 モル質量を表す式" },
            { "id": "q_c4_2_8_ans", "label": "問8 金属Aの原子量" }
          ]
        }
      ]
    },
    {
      "id": "p4_2_step3_group",
      "label": "【Step3：単位変換マップ】",
      "step": 3,
      "isGroup": true,
      "children": [
        {
          "id": "p4_2_n8",
          "label": "molを中心にした変換",
          "step": 3,
          "subLabel": "molが変換のハブ",
          "explanation": "🔄【単位変換マップ（超重要）】\n\n　　　　　　　×モル質量M[g/mol]\n\n質量[g] ⇄────────⇄ <u>物質量[mol]</u>\n\n　　　　　　　÷モル質量M[g/mol]\n\n　　　　　　　　　│\n\n　　　　　　　　　│ ×6.0×10²³\n\n　　　　　　　　　▼\n\n　　　　　　　個数[個]\n\n　　　　　　　　　▲\n\n　　　　　　　　　│ ÷6.0×10²³\n\n　　　　　　　　　│\n\n　　　　　　　　　│ ×22.4[L/mol]\n\n　　　　　　　　　▼\n\n　　　　　　気体の体積[L]（標準状態）\n\n　　　　　　　　　▲\n\n　　　　　　　　　│ ÷22.4[L/mol]\n\n<u>★ 変換のまとめ ★</u>\n\n❶ 個数 → mol：÷ 6.0×10²³\n\n❷ mol → 個数：× 6.0×10²³\n\n❸ g → mol：÷ モル質量M\n\n❹ mol → g：× モル質量M\n\n❺ L（標準状態）→ mol：÷ 22.4\n\n❻ mol → L（標準状態）：× 22.4\n\n💡 <u>コツ</u>：どんな問題も「まず<u>mol</u>に直す→そこから求めたい単位に変換」"
        },
        {
          "id": "p4_2_n9",
          "label": "例題1：g ⇔ mol ⇔ 個数",
          "step": 3,
          "subLabel": "基本の変換",
          "explanation": "<u>例題</u>：（原子量 O=16、H=1、C=12）\n\n(1) H₂O 36g は何 mol？何個の分子？\n\n　36 ÷ 18 ＝ <u>2 mol</u>\n\n　2 × 6.0×10²³ ＝ <u>1.2×10²⁴ 個</u>\n\n(2) CO₂ 3.0×10²³ 個は何 mol？何 g？\n\n　3.0×10²³ ÷ 6.0×10²³ ＝ <u>0.5 mol</u>\n\n　0.5 × 44 ＝ <u>22 g</u>\n\n💡 <u>1 mol の物質＝分子量[g]＝6.0×10²³個</u>を軸に考える"
        },
        {
          "id": "p4_2_n10",
          "label": "例題2：mol ⇔ L（気体）",
          "step": 3,
          "subLabel": "標準状態",
          "explanation": "<u>例題</u>：\n\n(1) O₂ 標準状態で 5.6 L は何 mol？何 g？\n\n　5.6 ÷ 22.4 ＝ <u>0.25 mol</u>\n\n　0.25 × 32 ＝ <u>8.0 g</u>\n\n(2) N₂ 14 g は標準状態で何 L？\n\n　14 ÷ 28 ＝ 0.5 mol\n\n　0.5 × 22.4 ＝ <u>11.2 L</u>\n\n💡 気体の分子量：H₂=2、He=4、CH₄=16、N₂=28、O₂=32、CO₂=44、Cl₂=71 は暗記推奨"
        },
        {
          "id": "p4_2_n11",
          "label": "例題3：応用（原子量の算出）",
          "step": 3,
          "subLabel": "M を求める",
          "explanation": "<u>例題</u>：原子量Mの金属A 5.4g を酸化させて A₂O₃ が 10.2g 得られた。M を求めよ。\n\n<u>解答</u>：\n\nA のモル数 ＝ 5.4 / M\n\nA₂O₃ のモル数 ＝ 10.2 / (2M+48)\n\n反応式より A のモル数：A₂O₃ のモル数 ＝ 2：1\n\n→ (5.4 / M) : (10.2 / (2M+48)) = 2 : 1\n\n→ 5.4 / M = 2 × 10.2 / (2M+48)\n\n→ 5.4(2M+48) = 20.4M\n\n→ 10.8M + 259.2 = 20.4M\n\n→ 9.6M = 259.2\n\n→ <u>M = 27</u>（Alと同じ！）"
        }
      ]
    }
  ]
};

export const chemicalEquationTreeData = {
  "id": "p4_3_root",
  "label": "化学反応式",
  "step": null,
  "explanation": "化学変化を化学式やイオン式を用いて表現する「化学反応式」。係数の比はそのまま「反応する粒子の物質量の比」を表します。",
  "children": [
    {
      "id": "p4_3_step1_group",
      "label": "【Step1：化学反応式の基本ルール】",
      "step": 1,
      "isGroup": true,
      "children": [
        {
          "id": "p4_3_n1",
          "label": "化学反応式とは",
          "step": 1,
          "subLabel": "反応物→生成物",
          "explanation": "<u>化学反応式</u>＝反応する物質と生成する物質の関係を化学式で表した式。\n\n<u>★ ルール ★</u>\n\n① 反応物を左辺、生成物を右辺、矢印（→）で結ぶ\n\n② 同じ元素の原子の数が両辺で等しくなるよう<u>係数</u>を決める\n\n③ 係数は<u>最も簡単な整数比</u>、1は省略\n\n🔥【例：水素の燃焼】\n\n　2H₂ ＋ O₂ → 2H₂O\n\n左辺のH=4、O=2　　　右辺のH=4、O=2　→バランスOK"
        },
        {
          "id": "p4_3_n2",
          "label": "目算法と未定係数法（使い分け）",
          "step": 1,
          "subLabel": "2つの方法",
          "explanation": "基準 ｜ 目算法 ｜ 未定係数法\n式がシンプル ｜ ◎ ｜ △\n元素・化学式が少ない ｜ ◎ ｜ △\n酸化還元（複雑） ｜ × ｜ ◎\n原子数・電荷数を厳密に ｜ △ ｜ ◎\n目で見てバランスとれる ｜ ◎ ｜ ×\n\n💡 <u>基本は目算法、複雑なら未定係数法</u>。定期テストでは目算法でOKなことが多い。"
        },
        {
          "id": "p4_3_step1_group_qlink",
          "label": "📝 このStepの確認問題",
          "step": 1,
          "subLabel": "4問",
          "explanation": "このStepに対応する演習・確認問題です。タップして解答画面へ移動できます。",
          "relatedQuestions": [
            { "id": "q_c4_3_1_ans", "label": "問1 基礎的な係数決定" },
            { "id": "q_c4_3_3_ans", "label": "問3 応用的な係数決定" },
            { "id": "q_c4_3_2_ans", "label": "問2 化学変化の反応式作成" },
            { "id": "q_c4_3_4_ans", "label": "問4 石灰石と塩酸の反応式" }
          ]
        }
      ]
    },
    {
      "id": "p4_3_step2_group",
      "label": "【Step2：目算法（直感的に係数を決める）】",
      "step": 2,
      "isGroup": true,
      "children": [
        {
          "id": "p4_3_n4",
          "label": "目算法の手順",
          "step": 2,
          "subLabel": "最も複雑な物質を1に",
          "explanation": "<u>★ 目算法の手順 ★</u>\n\n❶ 係数を書かない反応式を立てる\n\n❷ <u>原子の種類が多い（複雑な）物質の係数を仮に 1</u> とする\n\n❸ 種類が少ない元素から順に係数を当てはめる\n\n❹ 分数になったら、最後に整数比に直す（両辺に同じ数を掛ける）\n\n<u>例題</u>：エタン C₂H₆ の完全燃焼\n\n❶ C₂H₆ ＋ O₂ → CO₂ ＋ H₂O\n\n❷ 一番複雑な C₂H₆ を「1」とする → 1・C₂H₆ ＋ b・O₂ → c・CO₂ ＋ d・H₂O\n\n❸ C：左辺2 → 右辺 c=2 → 2CO₂\n\n　H：左辺6 → 右辺 2d=6, d=3 → 3H₂O\n\n　O：右辺 2×2+3=7、左辺 2b=7 → <u>b=7/2</u>\n\n❹ 全体を2倍して整数に：<u>2C₂H₆ ＋ 7O₂ → 4CO₂ ＋ 6H₂O</u>\n\n💡 <u>コツ</u>：最後に O（酸素分子）で調整することが多い"
        },
        {
          "id": "p4_3_n5",
          "label": "頻出の化学反応式（暗記推奨）",
          "step": 2,
          "subLabel": "よく出る反応",
          "explanation": "種類 ｜ 化学反応式\n水素の燃焼 ｜ 2H₂ ＋ O₂ → 2H₂O\nメタンの燃焼 ｜ CH₄ ＋ 2O₂ → CO₂ ＋ 2H₂O\nエタンの燃焼 ｜ 2C₂H₆ ＋ 7O₂ → 4CO₂ ＋ 6H₂O\nプロパンの燃焼 ｜ C₃H₈ ＋ 5O₂ → 3CO₂ ＋ 4H₂O\n石灰石＋塩酸 ｜ CaCO₃ ＋ 2HCl → CaCl₂ ＋ H₂O ＋ CO₂\n亜鉛＋塩酸 ｜ Zn ＋ 2HCl → ZnCl₂ ＋ H₂\nNa＋水 ｜ 2Na ＋ 2H₂O → 2NaOH ＋ H₂\nアンモニアの合成 ｜ N₂ ＋ 3H₂ → 2NH₃"
        },
        {
          "id": "p4_3_step2_group_qlink",
          "label": "📝 このStepの確認問題",
          "step": 2,
          "subLabel": "3問",
          "explanation": "このStepに対応する演習・確認問題です。タップして解答画面へ移動できます。",
          "relatedQuestions": [
            { "id": "q_c4_3_5_ans", "label": "問5 塩酸のモル濃度" },
            { "id": "q_c4_3_6_ans", "label": "問6 石灰石中のCaCO3含有率" },
            { "id": "q_c4_3_7_ans", "label": "問7 石灰石の必要量計算" }
          ]
        }
      ]
    },
    {
      "id": "p4_3_step3_group",
      "label": "【Step3：イオン反応式と未定係数法】",
      "step": 3,
      "isGroup": true,
      "children": [
        {
          "id": "p4_3_n7",
          "label": "イオン反応式とは",
          "step": 3,
          "subLabel": "イオン式を含む反応式",
          "explanation": "<u>イオン反応式</u>＝化学反応式にイオンの化学式を含むもの。\n\n<u>★ ルール（化学反応式 + α）★</u>\n\n① 反応物（左辺）と生成物（右辺）\n\n② 両辺で<u>同じ元素の原子の数が等しい</u>\n\n③ <u>左辺の電荷の総和 ＝ 右辺の電荷の総和</u>（重要！）\n\n<u>例</u>：AgNO₃ 水溶液に NaCl 水溶液を加える\n\n　→ 通常の反応式：AgNO₃ ＋ NaCl → AgCl ＋ NaNO₃\n\n　→ イオン反応式：<u>Ag⁺ ＋ Cl⁻ → AgCl↓</u>（Na⁺ と NO₃⁻ は変化しないので省略）"
        },
        {
          "id": "p4_3_n8",
          "label": "未定係数法の手順",
          "step": 3,
          "subLabel": "連立方程式で解く",
          "explanation": "<u>★ 未定係数法の手順 ★</u>\n\n❶ アルファベット a, b, c, ... で係数を仮置き\n\n❷ 各元素について両辺の原子数の式を立てる\n\n❸ 係数の比を求めたいので、<u>1つの文字を 1 とおく</u>\n\n❹ 連立方程式を解いて全ての係数を求める\n\n❺ 分数になったら整数比に直す\n\n<u>例題</u>：NO₂ ＋ H₂O → NO ＋ HNO₃ の係数を決めよ\n\n❶ aNO₂ ＋ bH₂O → cNO ＋ dHNO₃\n\n❷ N：a ＝ c + d ・・・①\n\n　H：2b ＝ d ・・・②\n\n　O：2a + b ＝ c + 3d ・・・③\n\n❸ d = 1 とおく → ② より b = 1/2\n\n　① より a = c + 1\n\n　③ より 2(c+1) + 1/2 = c + 3\n\n　　2c + 2 + 0.5 = c + 3\n\n　　c = 0.5\n\n　→ a = 1.5, b = 0.5, c = 0.5, d = 1\n\n❹ 全部を2倍して整数に：<u>3NO₂ ＋ H₂O → NO ＋ 2HNO₃</u>"
        },
        {
          "id": "p4_3_n9",
          "label": "イオン反応式の未定係数法",
          "step": 3,
          "subLabel": "電荷の式も加える",
          "explanation": "<u>例題</u>：Cr₂O₇²⁻ ＋ H⁺ ＋ I⁻ → Cr³⁺ ＋ H₂O ＋ I₂ の係数を決めよ\n\n❶ aCr₂O₇²⁻ ＋ bH⁺ ＋ cI⁻ → dCr³⁺ ＋ eH₂O ＋ fI₂\n\n❷ Cr：2a=d　O：7a=e　H：b=2e　I：c=2f\n\n　<u>電荷</u>：−2a + b − c = 3d\n\n❸ a=1 とおく → d=2, e=7, b=14, c=2f\n\n　電荷式：−2 + 14 − c = 6\n\n　→ c = 6　→ f = 3\n\n❹ <u>Cr₂O₇²⁻ ＋ 14H⁺ ＋ 6I⁻ → 2Cr³⁺ ＋ 7H₂O ＋ 3I₂</u>\n\n💡 電荷の式も忘れずに！ 通常の元素の式だけでは解けない"
        }
      ]
    },
    {
      "id": "p4_3_step4_group",
      "label": "【Step4：化学反応式の係数が表す意味】",
      "step": 4,
      "isGroup": true,
      "children": [
        {
          "id": "p4_3_n11",
          "label": "係数の意味（重要）",
          "step": 4,
          "subLabel": "粒子・mol・体積の比",
          "explanation": "<u>★ 大前提 ★</u>\n\n化学反応式の係数は反応に関わる物質の<u>数の比（＝物質量の比）</u>\n\n※<u>質量の比ではない！</u>（分子量が違うから）\n\n<u>係数の比 ＝</u>\n\n　・<u>物質量[mol] の比</u>（絶対の関係）\n\n　・<u>粒子（分子・原子）数の比</u>\n\n　・<u>気体の体積の比</u>（同温・同圧のとき）\n\n<u>例：N₂ ＋ 3H₂ → 2NH₃</u>\n\n ｜ N₂ ｜ H₂ ｜ NH₃\n係数 ｜ 1 ｜ 3 ｜ 2\n分子数 ｜ 1個 ｜ 3個 ｜ 2個\n物質量 ｜ 1 mol ｜ 3 mol ｜ 2 mol\n気体の体積（標準状態） ｜ 22.4 L ｜ 67.2 L ｜ 44.8 L\n質量 ｜ 28 g ｜ 6 g ｜ 34 g"
        },
        {
          "id": "p4_3_n12",
          "label": "量的計算の手順",
          "step": 4,
          "subLabel": "3ステップ",
          "explanation": "<u>★ 量的計算の3ステップ ★</u>\n\n❶ 与えられた量を<u>mol に変換</u>（g÷分子量、L÷22.4、個÷6.0×10²³）\n\n❷ 反応式の<u>係数比から目的物質のmolを求める</u>\n\n❸ 目的物質のmolを<u>指定された単位に変換</u>（×分子量、×22.4、×6.0×10²³）\n\n🔄【量的計算の流れ】\n\n物質Aの量[g,L,個] → 物質A[mol] → 物質B[mol] → 物質Bの量[g,L,個]\n\n　　　　　　　　　　　　　　↑\n\n　　　　　　　　　　係数比を使って変換"
        },
        {
          "id": "p4_3_n13",
          "label": "例題：石灰石と塩酸",
          "step": 4,
          "subLabel": "頻出の応用問題",
          "explanation": "<u>例題</u>：石灰石（純度100% CaCO₃ とする）5.0g に十分な塩酸を加えたとき、発生する CO₂ は標準状態で何 L？\n\n（原子量 Ca=40, C=12, O=16）\n\n<u>解答</u>：\n\n反応式：<u>CaCO₃ ＋ 2HCl → CaCl₂ ＋ H₂O ＋ CO₂</u>\n\n❶ CaCO₃ 5.0g → 5.0 ÷ 100 ＝ 0.05 mol（分子量 100）\n\n❷ CaCO₃ と CO₂ の係数比は 1:1 → CO₂ も 0.05 mol\n\n❸ 0.05 × 22.4 ＝ <u>1.12 L</u>\n\n💡 <u>石灰石が不純物入り</u>の場合は、まず純度で純CaCO₃質量を出してから計算"
        },
        {
          "id": "p4_3_n14",
          "label": "例題：過不足の問題",
          "step": 4,
          "subLabel": "どちらが不足するか判断",
          "explanation": "<u>例題</u>：H₂ 4.0g と O₂ 16g を反応させた。生成する水は何 g？（H=1, O=16）\n\n<u>解答</u>：\n\n反応式：<u>2H₂ ＋ O₂ → 2H₂O</u>\n\nH₂ ＝ 4.0 ÷ 2 ＝ 2.0 mol\n\nO₂ ＝ 16 ÷ 32 ＝ 0.5 mol\n\n係数比 H₂:O₂ = 2:1 なので、H₂ 2.0 mol に対して O₂ は 1.0 mol 必要。\n\n→ <u>O₂ が不足</u>（0.5 mol しかない）\n\n→ O₂ 0.5 mol がすべて反応する\n\n→ H₂O は 0.5 × 2 = 1.0 mol 生成\n\n→ 1.0 × 18 = <u>18 g</u>\n\n💡 <u>過不足のコツ</u>：\n\n① 両方の物質のmolを求める\n\n② 係数比と実際のmol比を比較\n\n③ 少ない方（不足する方）が全部反応する\n\n④ 生成物のmolは、不足する側から計算"
        }
      ]
    }
  ]
};

export const concentrationTreeData = {
  "id": "p4_4_root",
  "label": "濃度",
  "step": null,
  "explanation": "溶媒（水など）に溶質が溶けた「溶液」。その濃さを示す質量パーセント濃度やモル濃度の定義、およびそれらの相互変換を学習します。",
  "children": [
    {
      "id": "p4_4_step1_group",
      "label": "【Step1：溶液・溶質・溶媒・調製】",
      "step": 1,
      "isGroup": true,
      "children": [
        {
          "id": "p4_4_n1",
          "label": "用語の確認",
          "step": 1,
          "subLabel": "溶質・溶媒・溶液",
          "explanation": "<u>溶質</u>＝溶けている物質（例：食塩水の食塩）\n\n<u>溶媒</u>＝溶かしている液体（例：食塩水の水）\n\n<u>溶液</u>＝溶質＋溶媒（溶媒が水のときは<u>水溶液</u>）\n\n<u>溶解</u>＝溶質が溶媒に溶け、溶液と均一に混じり合うこと\n\n🧪【溶液の関係図】\n\n　溶質（NaCl 58.5 g） ＋ 溶媒（水） → 溶液（食塩水）\n\n　　　　　　　　　　　　　　　　　　　　│\n\n　　　　　　　　　　　　　　　　　全体の質量 or 体積で濃度を表す"
        },
        {
          "id": "p4_4_n2",
          "label": "溶液の調製手順（メスフラスコ使用）",
          "step": 1,
          "subLabel": "1.00 mol/L の NaCl水溶液",
          "explanation": "<u>例：1.00 mol/L の塩化ナトリウム水溶液の調製（1 L）</u>\n\n❶ NaCl 1.00 mol（58.5 g）を正確に測り取る\n\n❷ ビーカーに NaCl と少量の蒸留水を入れ、溶かす\n\n❸ ビーカーから 1 L のメスフラスコに移し、蒸留水でビーカーをすすぎ、洗液も移す\n\n❹ 洗瓶や駒込ピペットで<u>標線</u>まで蒸留水を加える\n\n❺ 栓をして振り混ぜ、均一にする\n\n💡 <u>ポイント</u>：溶質を一度溶かしてから蒸留水を加えて<u>全量を 1 L にする</u>！\n\n「水 1 L に溶かす」ではなく「溶液の体積を 1 L にする」"
        },
        {
          "id": "p4_4_step1_group_qlink",
          "label": "📝 このStepの確認問題",
          "step": 1,
          "subLabel": "3問",
          "explanation": "このStepに対応する演習・確認問題です。タップして解答画面へ移動できます。",
          "relatedQuestions": [
            { "id": "q_c4_4_1_ans", "label": "問1 溶液の混合計算" },
            { "id": "q_c4_4_2_ans", "label": "問2 モル濃度の文字式表現" },
            { "id": "q_c4_4_3_ans", "label": "問4 希釈（濃度調整）計算" }
          ]
        }
      ]
    },
    {
      "id": "p4_4_step2_group",
      "label": "【Step2：3種類の濃度（公式）】",
      "step": 2,
      "isGroup": true,
      "children": [
        {
          "id": "p4_4_n4",
          "label": "質量パーセント濃度",
          "step": 2,
          "subLabel": "g/g × 100",
          "explanation": "<u>質量パーセント濃度(%)</u>＝溶液の質量に対する溶質の質量の割合（百分率）\n\n<u>【公式】質量%濃度 ＝ 溶質の質量(g) ／ 溶液の質量(g) × 100</u>\n\n　　　　　　　　　　＝ 溶質の質量 ／ (溶質の質量 ＋ 溶媒の質量) × 100\n\n<u>例</u>：NaCl 20g を水 80g に溶かすと？\n\n20 ÷ (20+80) × 100 ＝ <u>20 %</u>\n\n💡 <u>分母は溶液全体の質量</u>（溶質＋溶媒）！溶媒だけではない！"
        },
        {
          "id": "p4_4_n5",
          "label": "モル濃度",
          "step": 2,
          "subLabel": "mol/L",
          "explanation": "<u>モル濃度 (mol/L)</u>＝溶液 1 L 中に溶けている溶質の物質量(mol)\n\n<u>【公式】モル濃度 (mol/L) ＝ 溶質の物質量(mol) ／ 溶液の体積(L)</u>\n\n<u>変形</u>：\n\n・溶質の物質量(mol) ＝ モル濃度(mol/L) × 溶液の体積(L)\n\n・溶液の体積(L) ＝ 溶質の物質量(mol) ／ モル濃度(mol/L)\n\n<u>例</u>：NaCl 0.5 mol を溶液 250 mL にしたモル濃度は？\n\n0.5 ÷ 0.250 ＝ <u>2.0 mol/L</u>\n\n💡 <u>単位変換に注意</u>！ mL → L は ÷1000"
        },
        {
          "id": "p4_4_n6",
          "label": "質量モル濃度（参考）",
          "step": 2,
          "subLabel": "mol/kg",
          "explanation": "<u>質量モル濃度 (mol/kg)</u>＝<u>溶媒 1 kg</u> 中に含まれる溶質の物質量(mol)\n\n<u>【公式】質量モル濃度 (mol/kg) ＝ 溶質の物質量(mol) ／ 溶媒の質量(kg)</u>\n\n💡 <u>詳細は「化学」（3年）で学習</u>：凝固点降下・沸点上昇の計算で使用\n\n⚠️ <u>モル濃度との違い</u>：\n\n・モル濃度＝<u>溶液</u>の体積（L）で割る\n\n・質量モル濃度＝<u>溶媒</u>の質量（kg）で割る"
        },
        {
          "id": "p4_4_n7",
          "label": "3種の濃度まとめ表",
          "step": 2,
          "subLabel": "比較",
          "explanation": "濃度 ｜ 単位 ｜ 分子 ｜ 分母\n質量パーセント濃度 ｜ % ｜ 溶質の質量 [g] ｜ 溶液の質量 [g]\nモル濃度 ｜ mol/L ｜ 溶質の物質量 [mol] ｜ 溶液の体積 [L]\n質量モル濃度 ｜ mol/kg ｜ 溶質の物質量 [mol] ｜ 溶媒の質量 [kg]"
        },
        {
          "id": "p4_4_step2_group_qlink",
          "label": "📝 このStepの確認問題",
          "step": 2,
          "subLabel": "2問",
          "explanation": "このStepに対応する演習・確認問題です。タップして解答画面へ移動できます。",
          "relatedQuestions": [
            { "id": "q_c4_4_4_ans", "label": "問4 パーセント → モル濃度式" },
            { "id": "q_c4_4_5_ans", "label": "問5 モル濃度 → パーセント式" }
          ]
        }
      ]
    },
    {
      "id": "p4_4_step3_group",
      "label": "【Step3：濃度の混合と希釈】",
      "step": 3,
      "isGroup": true,
      "children": [
        {
          "id": "p4_4_n9",
          "label": "例題1：混合の質量%",
          "step": 3,
          "subLabel": "2つの溶液を混ぜる",
          "explanation": "<u>例題</u>：10% の NaCl 水溶液 180 g と、20% の NaCl 水溶液 120 g を混合した質量%濃度を求めよ。\n\n<u>解答</u>：\n\n① 溶質：180×10/100 ＋ 120×20/100 ＝ 18 ＋ 24 ＝ 42 g\n\n② 溶液：180 ＋ 120 ＝ 300 g\n\n③ 42/300 × 100 ＝ <u>14 %</u>\n\n💡 <u>コツ</u>：質量%は「溶質の質量」と「溶液の質量」に分解して足し合わせる"
        },
        {
          "id": "p4_4_n10",
          "label": "希釈の計算（頻出）",
          "step": 3,
          "subLabel": "物質量は不変",
          "explanation": "<u>例題</u>：12 mol/L の塩酸を水で薄めて 2.0 mol/L の塩酸を 150 mL 作りたい。12 mol/L の塩酸は何 mL 必要か？\n\n<u>★ ポイント ★</u> 水で薄めても<u>溶質の物質量は変わらない</u>\n\n❶ 薄めた後の物質量：2.0 × 150/1000 ＝ 0.30 mol\n\n❷ 12 mol/L 溶液のうち x mL 使う → x/1000 × 12 ＝ 0.30\n\n❸ x ＝ <u>25 mL</u>\n\n💡 <u>希釈の公式（C₁V₁ = C₂V₂）</u>\n\nモル濃度 × 体積 = モル濃度 × 体積\n\n（希釈前）　　（希釈後）"
        },
        {
          "id": "p4_4_n11",
          "label": "質量% ⇔ モル濃度の変換",
          "step": 3,
          "subLabel": "1L とおくのがコツ",
          "explanation": "<u>例題</u>：質量%濃度 P%、密度 d g/cm³ の硫酸（分子量 M）のモル濃度は？\n\n<u>★ コツ ★</u> 溶質・溶液の値が具体的に出ない時は<u>溶液1 Lとおく</u>\n\n❶ 1 L ＝ 1000 cm³、溶液の質量 ＝ 1000d [g]\n\n❷ 溶質の質量 ＝ 1000d × P/100 ＝ 10dP [g]\n\n❸ 溶質の物質量 ＝ 10dP/M [mol]\n\n❹ 溶液の体積 ＝ 1 L\n\n<u>モル濃度 ＝ 10dP/M [mol/L]</u>\n\n<u>例</u>：質量% 98%、密度 1.84 g/cm³ の濃硫酸のモル濃度は？（M=98）\n\n　→ 10 × 1.84 × 98 / 98 ＝ <u>18.4 mol/L</u>"
        },
        {
          "id": "p4_4_n12",
          "label": "モル濃度→質量%",
          "step": 3,
          "subLabel": "逆方向",
          "explanation": "<u>例題</u>：モル濃度 c mol/L、密度 d g/cm³ の水溶液（分子量 M）の質量%濃度は？\n\n❶ 1 L とおく：溶質の物質量 ＝ c mol、溶質の質量 ＝ cM g\n\n❷ 溶液の質量 ＝ 1000d g\n\n❸ <u>質量% ＝ cM/(1000d) × 100 ＝ cM/(10d) [%]</u>"
        }
      ]
    },
    {
      "id": "p4_4_step4_group",
      "label": "【Step4：濃度と反応式の組合せ問題】",
      "step": 4,
      "isGroup": true,
      "children": [
        {
          "id": "p4_4_n14",
          "label": "例題：モル濃度を使った反応計算",
          "step": 4,
          "subLabel": "応用",
          "explanation": "<u>例題</u>：2.0 mol/L の塩酸 50 mL に十分な亜鉛を加えたとき、発生する H₂ は標準状態で何 L？\n\n<u>解答</u>：\n\n反応式：<u>Zn ＋ 2HCl → ZnCl₂ ＋ H₂</u>\n\n❶ HCl の物質量：2.0 × 50/1000 ＝ 0.10 mol\n\n❷ HCl と H₂ の係数比は 2:1 → H₂ は 0.05 mol\n\n❸ 0.05 × 22.4 ＝ <u>1.12 L</u>\n\n💡 <u>「濃度」問題で必ず問われるパターン</u>：\n\n① モル濃度 → 物質量 mol へ\n\n② 反応式の係数比で目的物質へ\n\n③ 目的単位（L、g）に変換"
        },
        {
          "id": "p4_4_n15",
          "label": "例題：濃度と反応（過不足）",
          "step": 4,
          "subLabel": "応用問題",
          "explanation": "<u>例題</u>：石灰石 CaCO₃ 2.5 g に 1.0 mol/L の塩酸 100 mL を加えたとき、発生する CO₂ は標準状態で何 L？\n\n（Ca=40, C=12, O=16）\n\n<u>解答</u>：\n\n反応式：<u>CaCO₃ ＋ 2HCl → CaCl₂ ＋ H₂O ＋ CO₂</u>\n\n❶ CaCO₃ 2.5g ＝ 2.5/100 ＝ 0.025 mol\n\n　HCl 1.0 × 100/1000 ＝ 0.10 mol\n\n❷ CaCO₃ と HCl の係数比は 1:2 →\n\n　CaCO₃ 0.025 mol を反応させるには HCl 0.05 mol 必要\n\n　実際は HCl 0.10 mol あるので <u>CaCO₃ が全部反応（HClが過剰）</u>\n\n❸ CO₂ ＝ CaCO₃ と 1:1 → 0.025 mol → 0.025 × 22.4 ＝ <u>0.56 L</u>\n\n💡 濃度問題＋過不足問題＝共通テスト頻出パターン！"
        }
      ]
    }
  ]
};

export const acidBaseTreeData = {
  "id": "acidBaseTreeData_root",
  "label": "酸と塩基",
  "step": null,
  "explanation": "酸・塩基は「<u>定義</u>」→「<u>強さ・価数</u>」→「<u>pH と水のイオン積</u>」→「<u>中和とは何か</u>」→「<u>中和反応の計算</u>」→「<u>中和滴定の道具と方法</u>」→「<u>滴定曲線・二段階滴定</u>」の順に積み上げると理解しやすい単元です。各項目をタップすると詳しい解説が開きます。",
  "children": [
    {
      "id": "acidBaseTreeData_sec1",
      "label": "重要事項① 酸と塩基の定義（アレニウス／ブレンステッド・ローリー）",
      "step": 1,
      "isGroup": true,
      "children": [
        {
          "id": "acidBaseTreeData_sec1_1",
          "label": "【Step1：アレニウスの定義（水溶液限定）】",
          "step": 1,
          "isGroup": true,
          "children": [
            {
              "id": "acidBaseTreeData_sec1_1_1",
              "label": "アレニウスの酸",
              "step": 1,
              "subLabel": "電離して H⁺ を生じる物質",
              "explanation": "<u>アレニウスの酸</u>＝水に溶かして電離したとき、<u>H⁺（＝オキソニウムイオン H₃O⁺）</u>を生じる物質。\n\n<u>例①</u>：HCl → H⁺ + Cl⁻（塩酸）\n\n<u>例②</u>：H₂SO₄ → 2H⁺ + SO₄²⁻（硫酸）\n\n<u>例③</u>：HNO₃ → H⁺ + NO₃⁻（硝酸）\n\n<u>例④</u>：CH₃COOH ⇄ CH₃COO⁻ + H⁺（酢酸／可逆）\n\n<u>厳密には</u>：H⁺ は水分子と結びついて <u>オキソニウムイオン H₃O⁺</u> として存在する。\n\n例：HCl + H₂O → <u>H₃O⁺</u> + Cl⁻"
            },
            {
              "id": "acidBaseTreeData_sec1_1_2",
              "label": "アレニウスの塩基",
              "step": 1,
              "subLabel": "電離して OH⁻ を生じる物質",
              "explanation": "<u>アレニウスの塩基</u>＝水に溶かして電離したとき、<u>水酸化物イオン OH⁻</u>を生じる物質。\n\n<u>例①</u>：NaOH → Na⁺ + OH⁻\n\n<u>例②</u>：KOH → K⁺ + OH⁻\n\n<u>例③</u>：Ca(OH)₂ → Ca²⁺ + 2OH⁻\n\n<u>例④</u>：Ba(OH)₂ → Ba²⁺ + 2OH⁻\n\n<u>欠点</u>：<u>アンモニア NH₃ は OH⁻ を式中に含まないのに塩基性を示す</u> → アレニウスの定義では説明できない！\n\n→ そこで登場したのが「ブレンステッド・ローリーの定義」。"
            }
          ]
        },
        {
          "id": "acidBaseTreeData_sec1_2",
          "label": "【Step2：ブレンステッド・ローリーの定義（H⁺のやり取り）】",
          "step": 2,
          "isGroup": true,
          "children": [
            {
              "id": "acidBaseTreeData_sec1_2_1",
              "label": "ブレンステッドの酸",
              "step": 2,
              "subLabel": "H⁺ を「与える」物質",
              "explanation": "<u>ブレンステッド・ローリーの酸</u>＝反応において<u>H⁺（プロトン）を相手に与える</u>物質。\n\n<u>例①</u>：<u>HCl</u> + H₂O → H₃O⁺ + Cl⁻\n\n→ HCl が H⁺ を H₂O に与えた → <u>HCl が酸／H₂O が塩基</u>\n\n<u>ポイント</u>：水溶液以外の反応にも定義が使える！（気相・非水溶媒での反応もOK）"
            },
            {
              "id": "acidBaseTreeData_sec1_2_2",
              "label": "ブレンステッドの塩基",
              "step": 2,
              "subLabel": "H⁺ を「受け取る」物質",
              "explanation": "<u>ブレンステッド・ローリーの塩基</u>＝反応において<u>H⁺ を相手から受け取る</u>物質。\n\n<u>例②</u>：NH₃ + <u>H₂O</u> ⇄ NH₄⁺ + OH⁻\n\n→ H₂O が H⁺ を NH₃ に与えた → <u>H₂O が酸／NH₃ が塩基</u>\n\n<u>ここで注目！</u>：同じ H₂O が、相手によって<u>酸にも塩基にもなる</u>！\n\nこれを <u>両性物質（両性化合物）</u> と呼ぶ。"
            }
          ]
        },
        {
          "id": "acidBaseTreeData_sec1_3",
          "label": "【Step3：共役酸・共役塩基（発展）】",
          "step": 3,
          "isGroup": true,
          "children": [
            {
              "id": "acidBaseTreeData_sec1_3_1",
              "label": "共役の関係",
              "step": 3,
              "subLabel": "H⁺のやり取りペア",
              "explanation": "ブレンステッドの定義では、逆反応で H⁺ をやり取りするペアを<u>共役酸・共役塩基</u>とよぶ。\n\nNH₃ + H₂O ⇄ NH₄⁺ + OH⁻\n\n塩基 酸 共役酸 共役塩基\n\n・NH₃ の<u>共役酸</u>＝NH₄⁺（H⁺を1個受け取った形）\n\n・H₂O の<u>共役塩基</u>＝OH⁻（H⁺を1個失った形）\n\n💡 コツ：「H⁺を1個外した／1個くっつけた形」を作れば共役ペアの完成！"
            }
          ]
        },
        {
          "id": "acidBaseTreeData_sec1_4",
          "label": "【Step4：確認・練習】",
          "step": 4,
          "isGroup": true,
          "children": [
            {
              "id": "acidBaseTreeData_sec1_4_1",
              "label": "確認問題",
              "step": 4,
              "subLabel": "酸／塩基を答える",
              "explanation": "次の反応で、ブレンステッド・ローリーの酸・塩基はそれぞれ何か？\n\n❶ HCl + NH₃ → NH₄Cl\n\n→ <u>酸＝HCl（H⁺を与える）／塩基＝NH₃（H⁺を受け取る）</u>\n\n❷ CO₃²⁻ + H₂O ⇄ HCO₃⁻ + OH⁻\n\n→ <u>酸＝H₂O／塩基＝CO₃²⁻</u>\n\n❸ HSO₄⁻ + H₂O ⇄ SO₄²⁻ + H₃O⁺\n\n→ <u>酸＝HSO₄⁻／塩基＝H₂O</u>"
            }
          ]
        }
      ]
    },
    {
      "id": "acidBaseTreeData_sec2",
      "label": "重要事項② 酸と塩基の強さ（電離度・価数）",
      "step": 2,
      "isGroup": true,
      "children": [
        {
          "id": "acidBaseTreeData_sec2_1",
          "label": "【Step1：電離度αとは】",
          "step": 1,
          "isGroup": true,
          "children": [
            {
              "id": "acidBaseTreeData_sec2_1_1",
              "label": "電離度 α の定義",
              "step": 1,
              "subLabel": "電離した割合を示す値",
              "explanation": "<u>電離度 α</u>＝電解質が水に溶けたとき、<u>溶解した全体のうち電離した割合</u>。\n\n<u>電離度 α = 電離した電解質の物質量 ÷ 溶解した全体の物質量</u>\n\n（0 ＜ α ≦ 1）\n\n💡 濃度が<u>小さい（薄い）</u>ほど、電離度 α は<u>大きく</u>なる。\n\n<u>例題</u>：酢酸 0.10 mol を水に溶かすと H⁺ が 0.0010 mol 生じた。電離度は？\n\n<u>解答</u>：α = 0.0010 ÷ 0.10 = <u>0.010</u>"
            }
          ]
        },
        {
          "id": "acidBaseTreeData_sec2_2",
          "label": "【Step2：強酸・弱酸／強塩基・弱塩基】",
          "step": 2,
          "isGroup": true,
          "children": [
            {
              "id": "acidBaseTreeData_sec2_2_1",
              "label": "酸の強弱（暗記）",
              "step": 2,
              "subLabel": "強酸は3つだけ！",
              "explanation": "<u>強酸</u>＝水溶液中でほぼ完全に電離（α ≒ 1）\n\n<u>★ 強酸は3つだけ ★</u>\n\n<u>塩酸 HCl</u>／<u>硫酸 H₂SO₄</u>／<u>硝酸 HNO₃</u> と 3つ唱える！\n\n<u>弱酸</u>＝電離度 α が小さい酸（それ以外はほぼ弱酸）\n\n弱酸の代表：<u>HF</u>（フッ化水素）、<u>CH₃COOH</u>（酢酸）、<u>H₂S</u>（硫化水素）、<u>(COOH)₂</u>（シュウ酸）、<u>H₃PO₄</u>（リン酸）、<u>H₂CO₃</u>（炭酸）"
            },
            {
              "id": "acidBaseTreeData_sec2_2_2",
              "label": "塩基の強弱（暗記）",
              "step": 2,
              "subLabel": "1族＋Mg以外の2族＝強塩基",
              "explanation": "<u>強塩基</u>＝水溶液中でほぼ完全に電離（α ≒ 1）\n\n<u>★ 強塩基の覚え方 ★</u> <u>1族 と（Mgを除く）2族</u> の水酸化物\n\n・NaOH（水酸化ナトリウム）／KOH（水酸化カリウム）＝1族\n\n・Ca(OH)₂（水酸化カルシウム）／Ba(OH)₂（水酸化バリウム）＝2族\n\n<u>弱塩基</u>＝電離度が小さい塩基\n\n弱塩基の代表：<u>NH₃</u>（アンモニア）、<u>Mg(OH)₂</u>、<u>Cu(OH)₂</u>、<u>Al(OH)₃</u>、<u>Fe(OH)₃</u>"
            }
          ]
        },
        {
          "id": "acidBaseTreeData_sec2_3",
          "label": "【Step3：価数】",
          "step": 3,
          "isGroup": true,
          "children": [
            {
              "id": "acidBaseTreeData_sec2_3_1",
              "label": "酸の価数",
              "step": 3,
              "subLabel": "出せる H⁺ の数",
              "explanation": "<u>酸の価数</u>＝電離して H⁺ になれる<u>H の数</u>。\n\n価数強酸弱酸\n<u>1価</u>HCl、HNO₃HF、HBr、HI、CH₃COOH\n<u>2価</u>H₂SO₄H₂S、(COOH)₂（シュウ酸）、H₂CO₃\n<u>3価</u>―H₃PO₄（リン酸）\n\n<u>注意</u>：酢酸 CH₃COOH の H は <u>-COOH の H だけが電離</u>して1価。（メチル基-CH₃のHは電離しない）"
            },
            {
              "id": "acidBaseTreeData_sec2_3_2",
              "label": "塩基の価数",
              "step": 3,
              "subLabel": "出せる OH⁻ の数",
              "explanation": "<u>塩基の価数</u>＝電離して OH⁻ になれる<u>OH の数</u>（NH₃ は「H⁺を受け取る数」で1価）。\n\n価数強塩基弱塩基\n<u>1価</u>NaOH、KOHNH₃\n<u>2価</u>Ca(OH)₂、Ba(OH)₂Mg(OH)₂、Cu(OH)₂、Fe(OH)₂\n<u>3価</u>―Al(OH)₃、Fe(OH)₃"
            }
          ]
        },
        {
          "id": "acidBaseTreeData_sec2_4",
          "label": "【Step4：★超重要★ 分類まとめ表】",
          "step": 4,
          "isGroup": true,
          "children": [
            {
              "id": "acidBaseTreeData_sec2_4_1",
              "label": "酸と塩基の総まとめ表",
              "step": 4,
              "subLabel": "テスト直前に見返す表",
              "explanation": "強酸（α≒1）弱酸（α小）強塩基（α≒1）弱塩基（α小）\n1価HCl／HNO₃HF／CH₃COOH／HBr／HINaOH／KOHNH₃\n2価H₂SO₄H₂S／(COOH)₂／H₂CO₃Ca(OH)₂／Ba(OH)₂Mg(OH)₂／Cu(OH)₂\n3価―H₃PO₄―Al(OH)₃／Fe(OH)₃\n\n💡 <u>強酸3つ</u>と<u>強塩基（1族＋Ca,Ba）</u>だけ覚えれば、あとは全部「弱」でOK！"
            }
          ]
        }
      ]
    },
    {
      "id": "acidBaseTreeData_sec3",
      "label": "重要事項③ pH について（水のイオン積・計算）",
      "step": 3,
      "isGroup": true,
      "children": [
        {
          "id": "acidBaseTreeData_sec3_1",
          "label": "【Step1：pHの定義】",
          "step": 1,
          "isGroup": true,
          "children": [
            {
              "id": "acidBaseTreeData_sec3_1_1",
              "label": "pH（水素イオン指数）",
              "step": 1,
              "subLabel": "[H⁺] の指数を取り出した値",
              "explanation": "<u>pH の定義</u>：水素イオン濃度 [H⁺] を用いて、\n\n<u>[H⁺] = 1.0 × 10⁻ˣ mol/L</u> のとき <u>pH = x</u>\n\n（正式には pH = -log₁₀[H⁺] だが、化学基礎では指数の x を読むだけで OK！）\n\n🌡 <u>pH の目安</u>\n\npH ＜ 7 → <u>酸性</u>（数値が小さいほど強酸性）\n\npH ＝ 7 → <u>中性</u>\n\npH ＞ 7 → <u>塩基性</u>（数値が大きいほど強塩基性）"
            }
          ]
        },
        {
          "id": "acidBaseTreeData_sec3_2",
          "label": "【Step2：水のイオン積 Kw】",
          "step": 2,
          "isGroup": true,
          "children": [
            {
              "id": "acidBaseTreeData_sec3_2_1",
              "label": "水のイオン積 Kw",
              "step": 2,
              "subLabel": "[H⁺]×[OH⁻]は一定！",
              "explanation": "純水の中でも水はごくわずかに電離している：<u>H₂O ⇄ H⁺ + OH⁻</u>\n\n<u>【水のイオン積】25℃で一定</u>\n\n<u>Kw = [H⁺][OH⁻] = 1.0 × 10⁻¹⁴ (mol/L)²</u>\n\n→ 指数どうしの関係：<u>[H⁺]の指数 + [OH⁻]の指数 = -14</u>\n\n中性のとき：[H⁺] ＝ [OH⁻] ＝ 1.0 × 10⁻⁷ mol/L\n\n💡 使い方：[H⁺] が分かれば [OH⁻] を、[OH⁻] が分かれば [H⁺] を計算できる！"
            }
          ]
        },
        {
          "id": "acidBaseTreeData_sec3_3",
          "label": "【Step3：pH の計算パターン】",
          "step": 3,
          "isGroup": true,
          "children": [
            {
              "id": "acidBaseTreeData_sec3_3_1",
              "label": "強酸のpH計算",
              "step": 3,
              "subLabel": "α＝1として扱う",
              "explanation": "<u>強酸は α = 1</u>として計算する。\n\n<u>例題1</u>：0.010 mol/L の HCl 水溶液の pH は？\n\nHCl は1価の強酸なので → [H⁺] = 0.010 = 1.0 × 10⁻² mol/L\n\n∴ <u>pH = 2</u>\n\n<u>例題2</u>：0.050 mol/L の H₂SO₄ 水溶液の pH は？\n\nH₂SO₄ は2価の強酸なので → [H⁺] = 0.050 × 2 = 0.10 = 1.0 × 10⁻¹ mol/L\n\n∴ <u>pH = 1</u>"
            },
            {
              "id": "acidBaseTreeData_sec3_3_2",
              "label": "弱酸のpH計算",
              "step": 3,
              "subLabel": "濃度×価数×αを使う",
              "explanation": "<u>弱酸は電離度 α をかける</u>\n\n<u>[H⁺] = 酸のモル濃度 × 価数 × 電離度 α</u>\n\n<u>例題</u>：0.10 mol/L の酢酸（α = 0.010）の pH は？\n\n[H⁺] = 0.10 × 1 × 0.010 = 1.0 × 10⁻³ mol/L\n\n∴ <u>pH = 3</u>"
            },
            {
              "id": "acidBaseTreeData_sec3_3_3",
              "label": "塩基のpH計算",
              "step": 3,
              "subLabel": "Kwを利用して[H⁺]を求める",
              "explanation": "塩基は [OH⁻] を求めた後、<u>水のイオン積</u> を使って [H⁺] に変換する。\n\n<u>例題</u>：0.010 mol/L の NaOH 水溶液の pH は？\n\nNaOH は1価の強塩基 → [OH⁻] = 0.010 = 1.0 × 10⁻² mol/L\n\n水のイオン積より：[H⁺] × 1.0 × 10⁻² = 1.0 × 10⁻¹⁴\n\n∴ [H⁺] = 1.0 × 10⁻¹² mol/L → <u>pH = 12</u>\n\n<u>裏ワザ</u>：[OH⁻] = 10⁻² のとき、指数の和 = -14 より [H⁺] の指数 = -12 → pH = 12"
            }
          ]
        },
        {
          "id": "acidBaseTreeData_sec3_4",
          "label": "【Step4：希釈と pH】",
          "step": 4,
          "isGroup": true,
          "children": [
            {
              "id": "acidBaseTreeData_sec3_4_1",
              "label": "希釈による pH 変化",
              "step": 4,
              "subLabel": "薄めても pH は 7 を越えない",
              "explanation": "<u>酸を10倍に薄めると</u>：[H⁺] が 1/10 → pH は 1 増える\n\n<u>塩基を10倍に薄めると</u>：[OH⁻] が 1/10 → pH は 1 減る\n\n<u>⚠ 注意</u>：薄めすぎても pH は<u>「7」を超えることはない</u>！\n\n（薄い酸でも塩基性にはならない。水そのものの H⁺ が効いてくるため）"
            }
          ]
        },
        {
          "id": "acidBaseTreeData_sec3_5",
          "label": "【Step5：pH指示薬・pH測定】",
          "step": 1,
          "isGroup": true,
          "children": [
            {
              "id": "acidBaseTreeData_sec3_5_1",
              "label": "主な指示薬の変色域",
              "step": 1,
              "subLabel": "MO・PP・BTB",
              "explanation": "指示薬変色域pH酸性側塩基性側覚え方\n<u>メチルオレンジ MO</u>pH 3.1〜4.4<u>赤</u><u>黄</u>ベーコンエッグ（赤→黄）\n<u>フェノールフタレイン PP</u>pH 8.0〜9.8<u>無色</u><u>赤（桃）</u>塩基性で赤くなる\n<u>BTB溶液</u>pH 6.0〜7.6<u>黄</u>緑→<u>青</u>信号：黄・緑・青\nリトマス紙―青→赤赤→青酸性で赤変"
            }
          ]
        }
      ]
    },
    {
      "id": "acidBaseTreeData_sec4",
      "label": "重要事項④ 中和とは何か（塩の分類と液性）",
      "step": 4,
      "isGroup": true,
      "children": [
        {
          "id": "acidBaseTreeData_sec4_1",
          "label": "【Step1：中和反応とは】",
          "step": 1,
          "isGroup": true,
          "children": [
            {
              "id": "acidBaseTreeData_sec4_1_1",
              "label": "中和の定義",
              "step": 1,
              "subLabel": "酸の H⁺ + 塩基の OH⁻ → H₂O",
              "explanation": "<u>中和</u>＝酸の H⁺ と塩基の OH⁻ が結びついて、<u>水（H₂O）と塩（えん）</u>ができる反応。\n\n<u>本質の式</u>：<u>H⁺ + OH⁻ → H₂O</u>（発熱反応 ＝ 中和熱）\n\n<u>例①</u>：HCl + NaOH → NaCl + H₂O\n\n<u>例②</u>：H₂SO₄ + 2NaOH → Na₂SO₄ + 2H₂O\n\n<u>例③</u>：HCl + NH₃ → NH₄Cl（H₂Oが出ない中和もある！）\n\n💡 中和で生じるイオン化合物を<u>「塩（えん）」</u>とよぶ。塩＝酸の陰イオン＋塩基の陽イオン。"
            }
          ]
        },
        {
          "id": "acidBaseTreeData_sec4_2",
          "label": "【Step2：塩の分類（化学式で見分ける）】",
          "step": 2,
          "isGroup": true,
          "children": [
            {
              "id": "acidBaseTreeData_sec4_2_1",
              "label": "正塩・酸性塩・塩基性塩",
              "step": 2,
              "subLabel": "式の中に H や OH が残るかで判別",
              "explanation": "分類特徴（化学式）例\n<u>正塩</u>H も OH も含まない<u>NaCl</u>／Na₂SO₄／KNO₃／CH₃COONa／NH₄Cl／Na₂CO₃\n<u>酸性塩</u>式に<u>酸のH</u>が残る<u>NaHSO₄</u>／<u>NaHCO₃</u>／KH₂PO₄\n<u>塩基性塩</u>式に<u>塩基のOH</u>が残るMgCl(OH)／CuCl(OH)\n\n⚠ <u>「酸性塩＝酸性」ではない！</u> 分類（式の見た目）と液性（水に溶かしたときの pH）は別モノ！"
            }
          ]
        },
        {
          "id": "acidBaseTreeData_sec4_3",
          "label": "【Step3：液性の判定（超頻出！）】",
          "step": 3,
          "isGroup": true,
          "children": [
            {
              "id": "acidBaseTreeData_sec4_3_1",
              "label": "正塩の液性判定ルール",
              "step": 3,
              "subLabel": "元の「強い方が勝つ」",
              "explanation": "<u>正塩の液性は「もとの酸と塩基の強さ」で決まる！</u>\n\nもとの酸もとの塩基液性例\n<u>強酸</u><u>強塩基</u>中性NaCl（HCl+NaOH）／Na₂SO₄／KNO₃\n<u>強酸</u><u>弱塩基</u><u>酸性</u>NH₄Cl（HCl+NH₃）／CuSO₄\n<u>弱酸</u><u>強塩基</u><u>塩基性</u>CH₃COONa（酢酸+NaOH）／Na₂CO₃\n弱酸弱塩基ほぼ中性CH₃COONH₄\n\n💡 覚え方：<u>「強い方が勝つ！」</u> 強酸 vs 弱塩基 → 酸性が勝つ／弱酸 vs 強塩基 → 塩基性が勝つ"
            },
            {
              "id": "acidBaseTreeData_sec4_3_2",
              "label": "酸性塩の液性判定（例外注意！）",
              "step": 3,
              "subLabel": "NaHSO₄ vs NaHCO₃",
              "explanation": "酸性塩は<u>もとの酸・塩基の強さで判断する</u>のがルール。ただし例外あり。\n\n❶ <u>NaHSO₄</u>（強酸 H₂SO₄ + 強塩基 NaOH の酸性塩）\n\n→ 電離して H⁺ を出す → <u>酸性</u>！\n\n❷ <u>NaHCO₃</u>（弱酸 H₂CO₃ + 強塩基 NaOH の酸性塩）\n\n→ <u>塩基性</u>！（「強塩基＋弱酸の酸性塩」の場合のみ塩基性になる特殊ルール）\n\n⚠ <u>NaHCO₃（重曹）は水溶液が塩基性</u> ── これがテストの罠！"
            }
          ]
        },
        {
          "id": "acidBaseTreeData_sec4_4",
          "label": "【Step4：弱酸・弱塩基の遊離】",
          "step": 4,
          "isGroup": true,
          "children": [
            {
              "id": "acidBaseTreeData_sec4_4_1",
              "label": "弱酸の遊離",
              "step": 4,
              "subLabel": "強酸 + 弱酸の塩 → 弱酸が遊離",
              "explanation": "<u>「強い方が勝つ」</u>の応用：弱酸の塩に強酸を加えると、弱酸が追い出される。\n\n<u>例①</u>：CH₃COONa + HCl → CH₃COOH + NaCl（酢酸が遊離）\n\n<u>例②</u>：Na₂CO₃ + 2HCl → 2NaCl + H₂O + CO₂↑\n\n<u>例③</u>：CaCO₃ + 2HCl → CaCl₂ + H₂O + CO₂↑（石灰石＋塩酸）"
            },
            {
              "id": "acidBaseTreeData_sec4_4_2",
              "label": "弱塩基の遊離",
              "step": 4,
              "subLabel": "強塩基 + 弱塩基の塩 → 弱塩基が遊離",
              "explanation": "<u>例</u>：NH₄Cl + NaOH → NaCl + H₂O + NH₃↑（アンモニアが発生）\n\n🧪 <u>実験室でのアンモニア発生法</u>：塩化アンモニウム＋水酸化カルシウム を加熱！\n\n2NH₄Cl + Ca(OH)₂ → CaCl₂ + 2H₂O + 2NH₃↑"
            }
          ]
        }
      ]
    },
    {
      "id": "acidBaseTreeData_sec5",
      "label": "重要事項⑤ 中和反応の計算",
      "step": 1,
      "isGroup": true,
      "children": [
        {
          "id": "acidBaseTreeData_sec5_1",
          "label": "【Step1：中和の基本の式】",
          "step": 1,
          "isGroup": true,
          "children": [
            {
              "id": "acidBaseTreeData_sec5_1_1",
              "label": "中和の量的関係式",
              "step": 1,
              "subLabel": "これ1本ですべて解ける",
              "explanation": "過不足なく中和するには、\n\n<u>「酸が出す H⁺ の物質量」＝「塩基が出す OH⁻ の物質量」</u>\n\n<u>★中和の基本式★</u>\n\n<u>a × c × V = b × c' × V'</u>\n\na：酸の価数 c：酸のモル濃度[mol/L] V：酸の体積[L]\n\nb：塩基の価数 c'：塩基のモル濃度 V'：塩基の体積\n\n💡 <u>電離度 α には依存しない！</u> 弱酸でも最終的にはすべて中和されるため、α は式に入らない。"
            }
          ]
        },
        {
          "id": "acidBaseTreeData_sec5_2",
          "label": "【Step2：基本計算例】",
          "step": 2,
          "isGroup": true,
          "children": [
            {
              "id": "acidBaseTreeData_sec5_2_1",
              "label": "計算例①：濃度を求める",
              "step": 2,
              "subLabel": "1価と1価の中和",
              "explanation": "<u>例題1</u>：0.10 mol/L の NaOH 水溶液 20 mL を中和するのに、濃度未知の HCl 15 mL 必要だった。HCl のモル濃度は？\n\n<u>解答</u>：1 × c × (15/1000) = 1 × 0.10 × (20/1000)\n\nc = 0.10 × 20 ÷ 15 = <u>約 0.13 mol/L</u>"
            },
            {
              "id": "acidBaseTreeData_sec5_2_2",
              "label": "計算例②：価数の違う中和",
              "step": 2,
              "subLabel": "2価×1価",
              "explanation": "<u>例題2</u>：0.050 mol/L の H₂SO₄ 10 mL を中和するのに必要な 0.10 mol/L の NaOH の体積は？\n\n<u>解答</u>：<u>2</u> × 0.050 × (10/1000) = <u>1</u> × 0.10 × (V/1000)\n\nV = <u>10 mL</u>\n\n💡 <u>H₂SO₄ は2価</u>なので H⁺ が2倍出る → NaOH は同じ物質量では足りない！"
            }
          ]
        },
        {
          "id": "acidBaseTreeData_sec5_3",
          "label": "【Step3：応用パターン】",
          "step": 3,
          "isGroup": true,
          "children": [
            {
              "id": "acidBaseTreeData_sec5_3_1",
              "label": "固体を溶かした場合",
              "step": 3,
              "subLabel": "質量→物質量に変換",
              "explanation": "<u>例題3</u>：NaOH（式量40）0.40g を水に溶かして100mLとした水溶液を、0.10 mol/L の HCl で中和するのに必要な体積は？\n\nNaOHの物質量 = 0.40 ÷ 40 = 0.010 mol\n\nNaOHの濃度 = 0.010 ÷ 0.10 = 0.10 mol/L\n\n中和式：1×0.10×0.10 = 1×0.10×V → V = <u>0.10 L ＝ 100 mL</u>"
            },
            {
              "id": "acidBaseTreeData_sec5_3_2",
              "label": "気体を溶かした場合（NH₃・CO₂）",
              "step": 3,
              "subLabel": "気体の体積（標準状態22.4L）",
              "explanation": "<u>例題4</u>：標準状態で 224 mL のアンモニア NH₃ をすべて吸収するのに必要な 0.10 mol/L の HCl は何mL？\n\nNH₃ の物質量 = 224 ÷ 22400 = 0.010 mol\n\nNH₃は1価の塩基 → NH₃ + HCl → NH₄Cl\n\n中和式：1×c×V(HCl) = 1×0.010\n\n0.10 × V = 0.010 → <u>V = 0.10 L ＝ 100 mL</u>"
            },
            {
              "id": "acidBaseTreeData_sec5_3_3",
              "label": "逆滴定（過剰分を求める）",
              "step": 3,
              "subLabel": "気体分析に使う",
              "explanation": "<u>逆滴定</u>＝過剰の既知濃度の酸（塩基）を加え、余った分を別の塩基（酸）で滴定して求める方法。\n\n<u>例題5</u>：発生したNH₃を 0.10 mol/L の HCl 20 mL にすべて吸収させた。残った HCl を 0.10 mol/L の NaOH 12 mL で中和した。NH₃の物質量は？\n\n❶ 加えた HCl（H⁺）：0.10 × 0.020 = 2.0×10⁻³ mol\n\n❷ NaOH（OH⁻）で中和された余りの HCl：0.10 × 0.012 = 1.2×10⁻³ mol\n\n❸ NH₃ が吸収した H⁺ の物質量 = ❶ - ❷ = <u>0.8×10⁻³ mol</u>"
            }
          ]
        }
      ]
    },
    {
      "id": "acidBaseTreeData_sec6",
      "label": "重要事項⑥ 中和滴定の道具と方法",
      "step": 2,
      "isGroup": true,
      "children": [
        {
          "id": "acidBaseTreeData_sec6_1",
          "label": "【Step1：実験器具4つの用途と共洗い】",
          "step": 1,
          "isGroup": true,
          "children": [
            {
              "id": "acidBaseTreeData_sec6_1_1",
              "label": "4つの器具の一覧表",
              "step": 1,
              "subLabel": "超頻出！",
              "explanation": "器具用途共洗い理由\n<u>メスフラスコ</u>正確な濃度の溶液をつくる<u>不要</u>（純水で濡れたままOK）あとで純水を標線まで加えて希釈するため、水滴が残っても濃度に影響しない\n<u>ホールピペット</u>標線までの一定体積を正確に測り取る<u>必要</u>内部に水滴が残ると濃度が薄まってしまう\n<u>ビュレット</u>滴下体積を「滴下前 - 滴下後」で測る<u>必要</u>内部の水滴で濃度が変わると計算値が狂う\n<u>コニカルビーカー</u>中和反応させる容器<u>不要</u>（純水で濡れたままOK）水で薄まっても、入れた溶質の<u>物質量</u>は変わらないため中和計算に影響なし\n\n💡 <u>覚え方</u>：ホール<u>ト</u>ピペット・ビュレッ<u>ト</u>の「ト」＝「共洗いする」の「と」！\n\nメスフラスコ・コニカルビーカーは「ト」がつかない → 共洗い不要！"
            },
            {
              "id": "acidBaseTreeData_sec6_1_2",
              "label": "駒込ピペット・安全ピペッター",
              "step": 1,
              "subLabel": "補助器具",
              "explanation": "<u>駒込ピペット</u>：おおよその体積を測って移すのに使用（メスフラスコに純水を加える最後の微調整）。\n\n<u>安全ピペッター（ゴム球）</u>：ホールピペットの先端に取り付け、口で吸わずに液体を吸い上げるための道具。<u>直接口で吸ってはいけない</u>！"
            }
          ]
        },
        {
          "id": "acidBaseTreeData_sec6_2",
          "label": "【Step2：中和滴定の手順】",
          "step": 2,
          "isGroup": true,
          "children": [
            {
              "id": "acidBaseTreeData_sec6_2_1",
              "label": "滴定操作の6ステップ",
              "step": 2,
              "subLabel": "実験の流れ",
              "explanation": "❶ <u>メスフラスコ</u>に酸（塩基）を入れ、標線まで純水を加えて<u>一定濃度の溶液</u>を調製\n\n❷ <u>安全ピペッター</u>をつけた<u>ホールピペット</u>で溶液を標線まで測り取る\n\n❸ 測り取った溶液を<u>コニカルビーカー</u>に入れる\n\n❹ 指示薬（フェノールフタレイン等）を数滴加える\n\n❺ <u>ビュレット</u>に濃度未知の溶液を入れ、先端の空気を追い出し、<u>滴下前の目盛り</u>を読む\n\n❻ 少しずつ滴下して<u>指示薬の色が変化した点</u>で止め、目盛りを読み「滴下前－滴下後」から使用体積を求め、濃度を計算する\n\n🧪【滴定装置の図】\n\n［ビュレット（滴定液）］\n\n↓ ぽたぽた\n\n［コニカルビーカー（測り取った試料＋指示薬）］"
            }
          ]
        },
        {
          "id": "acidBaseTreeData_sec6_3",
          "label": "【Step3：注意点】",
          "step": 3,
          "isGroup": true,
          "children": [
            {
              "id": "acidBaseTreeData_sec6_3_1",
              "label": "頻出の注意点",
              "step": 3,
              "subLabel": "目盛り・気泡・終点",
              "explanation": "❶ ビュレットの目盛りは<u>液面の下端（メニスカス）</u>を読む\n\n❷ 目盛りは<u>最小目盛りの 1/10 まで</u>読む（例：0.05mL単位）\n\n❸ ビュレットの<u>先端の気泡</u>は必ず追い出す（体積が狂う原因）\n\n❹ 終点付近は<u>1滴ずつ</u>滴下し、色が消えなくなった点を終点とする\n\n❺ フェノールフタレインは<u>時間が経つと色が消える</u>ことがある → 直後の変色で判定"
            }
          ]
        }
      ]
    },
    {
      "id": "acidBaseTreeData_sec7",
      "label": "重要事項⑦ 滴定曲線と二段階滴定",
      "step": 3,
      "isGroup": true,
      "children": [
        {
          "id": "acidBaseTreeData_sec7_1",
          "label": "【Step1：滴定曲線とは】",
          "step": 1,
          "isGroup": true,
          "children": [
            {
              "id": "acidBaseTreeData_sec7_1_1",
              "label": "滴定曲線の基本",
              "step": 1,
              "subLabel": "縦軸pH・横軸滴下量",
              "explanation": "<u>滴定曲線</u>＝滴下量（横軸）と pH（縦軸）の関係を表すグラフ。\n\n中和点付近で pH が<u>急激に変化する（垂直に伸びる）</u>のが特徴。\n🎯 中和点で急激な pH ジャンプが起きる範囲を<u>「pHジャンプ」</u>とよぶ。\n\nこのジャンプ範囲に<u>変色域が入っている指示薬</u>を選ぶのが鉄則！"
            }
          ]
        },
        {
          "id": "acidBaseTreeData_sec7_2",
          "label": "【Step2：4つの滴定曲線パターン】",
          "step": 2,
          "isGroup": true,
          "children": [
            {
              "id": "acidBaseTreeData_sec7_2_1",
              "label": "① 強酸 + 強塩基",
              "step": 2,
              "subLabel": "中和点 pH ＝ 7（両方の指示薬OK）",
              "explanation": "<u>例</u>：HCl ＋ NaOH\n\n<u>中和点 pH ＝ 7（中性）</u>\n\npHジャンプの範囲がとても広い（約 pH3〜pH11）\n\n→ <u>メチルオレンジ MO・フェノールフタレイン PP どちらでもOK</u>\n\npH\n14│ ┌─\n│ ／\n7│─ ─ ─ ─ ─ ─ ─┤ ←ジャンプ（急激な変化）\n│ ／\n0│───────┘\n0 中和点 塩基滴下量"
            },
            {
              "id": "acidBaseTreeData_sec7_2_2",
              "label": "② 弱酸 + 強塩基",
              "step": 2,
              "subLabel": "中和点 pH ＞ 7（PP使用）",
              "explanation": "<u>例</u>：CH₃COOH ＋ NaOH\n\n<u>中和点 pH ＞ 7（塩基性）</u>（生じる CH₃COONa が加水分解して塩基性）\n\npHジャンプは塩基性側にのみ現れる（pH7〜pH11 付近）\n\n→ <u>フェノールフタレイン PP を使用</u>（変色域 pH 8〜10 が範囲内）\n\n→ <u>MO は使えない</u>（変色域 pH 3〜5 でジャンプ前に色が変わる）"
            },
            {
              "id": "acidBaseTreeData_sec7_2_3",
              "label": "③ 強酸 + 弱塩基",
              "step": 2,
              "subLabel": "中和点 pH ＜ 7（MO使用）",
              "explanation": "<u>例</u>：HCl ＋ NH₃\n\n<u>中和点 pH ＜ 7（酸性）</u>（生じる NH₄Cl が加水分解して酸性）\n\npHジャンプは酸性側にのみ現れる（pH3〜pH7付近）\n\n→ <u>メチルオレンジ MO を使用</u>（変色域 pH 3〜5 が範囲内）\n\n→ <u>PP は使えない</u>"
            },
            {
              "id": "acidBaseTreeData_sec7_2_4",
              "label": "④ 弱酸 + 弱塩基",
              "step": 2,
              "subLabel": "中和点 pH ≒ 7だが滴定不可",
              "explanation": "<u>例</u>：CH₃COOH ＋ NH₃\n\n<u>中和点 pH ≒ 7</u>だが、pHジャンプが<u>ほぼ現れない</u>！\n\n→ <u>どの指示薬も使えない → 滴定に不向き</u>"
            },
            {
              "id": "acidBaseTreeData_sec7_2_5",
              "label": "4パターンまとめ表",
              "step": 2,
              "subLabel": "これだけ暗記！",
              "explanation": "組み合わせ中和点 pH使える指示薬\n強酸 + 強塩基= 7<u>MO・PP 両方OK</u>\n弱酸 + 強塩基> 7<u>PP のみ</u>（強塩基側で変色）\n強酸 + 弱塩基< 7<u>MO のみ</u>（強酸側で変色）\n弱酸 + 弱塩基≒ 7<u>どちらも使えない</u>\n\n💡 <u>覚え方</u>：「強」がついている側で pH がジャンプする → その側で色が変わる指示薬を選ぶ！\n\n（強酸→酸性側で変わる MO／強塩基→塩基性側で変わる PP）"
            }
          ]
        },
        {
          "id": "acidBaseTreeData_sec7_3",
          "label": "【Step3：二段階滴定（Na₂CO₃ の滴定）】",
          "step": 3,
          "isGroup": true,
          "children": [
            {
              "id": "acidBaseTreeData_sec7_3_1",
              "label": "二段階滴定の原理",
              "step": 3,
              "subLabel": "中和が2段階で進む",
              "explanation": "炭酸ナトリウム Na₂CO₃ は<u>2価の弱塩基</u>で、HCl で中和すると<u>2段階</u>に反応が進む。\n\n<u>【第1段階（第1中和点まで）】塩基 → 弱塩基へ</u>\n\nNa₂CO₃ + HCl → NaCl + <u>NaHCO₃</u> （強い塩基性 → 弱い塩基性）\n\n→ 中和点 pH ＞ 7 → <u>指示薬 PP（フェノールフタレイン）</u>で赤 → 無色\n\n<u>【第2段階（第1→第2中和点）】弱塩基 → 弱酸へ</u>\n\nNaHCO₃ + HCl → NaCl + H₂O + CO₂↑ （弱い塩基性 → 酸性）\n\n→ 中和点 pH ＜ 7 → <u>指示薬 MO（メチルオレンジ）</u>で黄 → 赤\n\npH\n│ │ │\n11│─┐ │ │\n│ └─┐（第1中和点／PP変色）\n7│─ ─│─┐ │\n│ │ └─┐（第2中和点／MO変色）\n3│ │ │└──\n└──┴──┴──── 滴下量\nv1 v2"
            },
            {
              "id": "acidBaseTreeData_sec7_3_2",
              "label": "NaOHとNa₂CO₃の混合滴定",
              "step": 3,
              "subLabel": "頻出パターン！",
              "explanation": "NaOH（xmol）と Na₂CO₃（ymol）の混合水溶液を HCl で滴定するとき：\n\n<u>【第1段階】強塩基 → 弱塩基へ（PP：赤→無）</u>\n\n❶ NaOH + HCl → NaCl + H₂O （x mol の HCl 消費）\n\n❷ Na₂CO₃ + HCl → NaCl + NaHCO₃ （y mol の HCl 消費）\n\n→ 第1中和点までの HCl 消費量：<u>(x + y) mol</u>\n\n<u>【第2段階】弱塩基 → 弱酸へ（MO：黄→赤）</u>\n\n❸ NaHCO₃ + HCl → NaCl + H₂O + CO₂ （y mol の HCl 消費）\n\n→ 第1→第2中和点までの HCl 消費量：<u>y mol</u>\n\n💡 <u>x, y の求め方</u>\n\n① 第1中和点までの滴下量 V₁[L] × 濃度 c[mol/L] = x + y\n\n② 第1→第2中和点までの滴下量 V₂[L] × 濃度 c = y\n\n③ 差し引いて x = (V₁-V₂)×c、y = V₂×c を求める"
            },
            {
              "id": "acidBaseTreeData_sec7_3_3",
              "label": "二段階滴定 計算例題",
              "step": 3,
              "subLabel": "共通テスト頻出",
              "explanation": "<u>例題</u>：NaOH と Na₂CO₃ の混合水溶液に 0.10 mol/L HCl を滴下したところ、PP の色が消えたのは 25 mL、MO の色が変わったのはさらに 10 mL 追加した時点だった。含まれる NaOH と Na₂CO₃ の物質量は？\n\n❶ 第1→第2中和点分：<u>y mol</u> = 0.10 × (10/1000) = <u>1.0×10⁻³ mol</u>（Na₂CO₃）\n\n❷ 第1中和点まで：<u>x + y mol</u> = 0.10 × (25/1000) = 2.5×10⁻³ mol\n\n❸ よって NaOH = x = 2.5×10⁻³ - 1.0×10⁻³ = <u>1.5×10⁻³ mol</u>\n\n<u>答え：NaOH = 1.5×10⁻³ mol、Na₂CO₃ = 1.0×10⁻³ mol</u>"
            }
          ]
        }
      ]
    }
  ]
};


// ------------------------------------------------------------
// ⑥ 酸化還元反応 ロジックツリー
// 添付の「包括版フローチャート集（①）」の酸化還元セクションを、
// アプリの単元（c6_1〜c6_7）と設問ID（p_c6_*）に統合したロジックツリー。
// InteractiveTree / ChapterFlowchartModal / PracticeExplanationTree から参照される。
// ------------------------------------------------------------
export const redoxTreeData = {
  "id": "redoxTreeData_root",
  "label": "酸化還元反応",
  "step": null,
  "explanation": "酸化還元は「<u>定義・酸化数</u>」→「<u>半反応式・反応式</u>」→「<u>酸化還元滴定</u>」→「<u>酸化力・還元力の強さ</u>」→「<u>金属のイオン化傾向</u>」→「<u>電池</u>」→「<u>工業的製法</u>」の順に積み上げると理解しやすい単元です。すべての土台は「電子 e⁻ の受け渡し」と「酸化数の増減」という一つの原理です。",
  "children": [
    {
      "id": "redoxTreeData_sec1",
      "label": "重要事項① 酸化還元反応とは何か（酸化数）",
      "step": 1,
      "isGroup": true,
      "children": [
        {
          "id": "redoxTreeData_sec1_1",
          "label": "【Step1：酸化・還元の3つの見方】",
          "step": 1,
          "isGroup": true,
          "children": [
            {
              "id": "redoxTreeData_sec1_1_1",
              "label": "酸化とは？",
              "step": 1,
              "subLabel": "酸素/水素/電子/酸化数",
              "explanation": "<u>酸化</u>とは、次のどれかが起こること：\n\n❶ <u>酸素O を受け取る</u> （例：C + O₂ → CO₂）\n\n❷ <u>水素H を失う</u> （例：H₂S → S）\n\n❸ <u>電子e⁻ を失う</u> （例：Zn → Zn²⁺ + 2e⁻）\n\n❹ <u>酸化数が増加する</u> （例：Fe²⁺ → Fe³⁺、+2→+3で増加）\n\n💡 現代的定義では <u>「電子を失うこと＝酸化」</u> が最も本質的。"
            },
            {
              "id": "redoxTreeData_sec1_1_2",
              "label": "還元とは？",
              "step": 1,
              "subLabel": "酸化の逆",
              "explanation": "<u>還元</u>とは、次のどれかが起こること（酸化の完全な逆）：\n\n❶ <u>酸素O を失う</u> （例：CuO → Cu）\n\n❷ <u>水素H を受け取る</u> （例：N₂ → NH₃）\n\n❸ <u>電子e⁻ を受け取る</u> （例：Cu²⁺ + 2e⁻ → Cu）\n\n❹ <u>酸化数が減少する</u>\n\n🔑 <u>酸化と還元は必ず同時に起こる</u>！ 電子を出す物質があれば、必ず受け取る物質があるため。→ <u>酸化還元反応</u>とセットで呼ぶ。"
            }
          ]
        },
        {
          "id": "redoxTreeData_sec1_2",
          "label": "【Step2：酸化数の決定ルール】",
          "step": 2,
          "isGroup": true,
          "children": [
            {
              "id": "redoxTreeData_sec1_2_1",
              "label": "酸化数の基本ルール",
              "step": 2,
              "subLabel": "4つの原則を覚える",
              "explanation": "<u>❶ 単体</u>：すべての原子の酸化数は<u>0</u>\n\n例：H₂、O₂、Cu、Fe、Zn → すべて 0\n\n<u>❷ 単原子イオン</u>：酸化数はイオンの<u>価数（電荷）に等しい</u>\n\n例：Na⁺=+1、Cl⁻=-1、Fe²⁺=+2、Al³⁺=+3\n\n<u>❸ 化合物中</u>：すべての原子の酸化数の<u>和 = 0</u>\n\n例：H₂O → +1×2 + (-2) = 0 ✓\n\n<u>❹ 多原子イオン</u>：すべての原子の酸化数の<u>和 = イオンの価数</u>\n\n例：SO₄²⁻ → S + (-2)×4 = -2 ∴ S = +6"
            },
            {
              "id": "redoxTreeData_sec1_2_2",
              "label": "元素ごとの原則的な酸化数",
              "step": 2,
              "subLabel": "優先順位と例外",
              "explanation": "優先元素原則例外\n1<u>アルカリ金属（1族）</u><u>+1</u>なし\n2<u>アルカリ土類金属（2族）</u><u>+2</u>なし\n3<u>フッ素 F</u><u>-1</u>なし\n4<u>水素 H</u><u>+1</u>金属水素化物 NaH、CaH₂ では <u>-1</u>\n5<u>酸素 O</u><u>-2</u>過酸化物 H₂O₂・Na₂O₂ では <u>-1</u>／OF₂ では +2\n\n💡 <u>優先順位が高い元素から先に決めて</u>、残った元素は「化合物の和=0」から逆算する！"
            },
            {
              "id": "redoxTreeData_sec1_2_3",
              "label": "酸化数の計算練習",
              "step": 2,
              "subLabel": "頻出化合物",
              "explanation": "物質着目原子酸化数計算\nKMnO₄Mn<u>+7</u>+1 + Mn + (-2)×4 = 0\nK₂Cr₂O₇Cr<u>+6</u>+1×2 + Cr×2 + (-2)×7 = 0\nH₂SO₄S<u>+6</u>+1×2 + S + (-2)×4 = 0\nHNO₃N<u>+5</u>+1 + N + (-2)×3 = 0\nNH₃N<u>-3</u>N + (+1)×3 = 0\nH₂O₂O<u>-1</u>（過酸化物）+1×2 + O×2 = 0\nNaHH<u>-1</u>（例外）+1 + H = 0"
            }
          ]
        },
        {
          "id": "redoxTreeData_sec1_3",
          "label": "【Step3：酸化還元の判定】",
          "step": 3,
          "isGroup": true,
          "children": [
            {
              "id": "redoxTreeData_sec1_3_1",
              "label": "反応が酸化還元か見抜く",
              "step": 3,
              "subLabel": "酸化数の増減をチェック",
              "explanation": "<u>手順</u>：反応前後の各原子の酸化数を求め、<u>変化があれば酸化還元反応</u>！\n\n<u>例①</u>：2Cu + O₂ → 2CuO\n\nCu：0 → +2（酸化）／O：0 → -2（還元）\n\n→ <u>酸化還元反応</u>（酸化と還元が同時に起きている）\n\n<u>例②</u>：HCl + NaOH → NaCl + H₂O\n\nH：+1→+1／Cl：-1→-1／Na：+1→+1／O：-2→-2 変化なし\n\n→ <u>中和反応（酸化還元ではない）</u>\n\n💡 中和反応・沈殿反応は基本的に「電子の授受なし」→ 酸化還元ではない！"
            },
            {
              "id": "redoxTreeData_sec1_3_2",
              "label": "酸化剤・還元剤の定義",
              "step": 3,
              "subLabel": "「自分」と「相手」の視点",
              "explanation": "<u>酸化剤</u>＝<u>相手</u>を酸化する（＝自分は<u>還元される</u>／電子を受け取る）\n\n<u>還元剤</u>＝<u>相手</u>を還元する（＝自分は<u>酸化される</u>／電子を失う）\n\n⚠ <u>「酸化剤」は自分が「酸化される」わけではない！</u>\n\n「酸化剤」は\"相手を酸化する薬剤\"のことなので、自分自身は還元されている。用語のトラップに注意！"
            }
          ]
        }
      ]
    },
    {
      "id": "redoxTreeData_sec2",
      "label": "重要事項② 半反応式と酸化還元反応式の作り方",
      "step": 2,
      "isGroup": true,
      "children": [
        {
          "id": "redoxTreeData_sec2_1",
          "label": "【Step1：主要な酸化剤リスト（覚える！）】",
          "step": 1,
          "isGroup": true,
          "children": [
            {
              "id": "redoxTreeData_sec2_1_1",
              "label": "酸化剤一覧（反応前 → 反応後）",
              "step": 1,
              "subLabel": "これが暗記のスタート",
              "explanation": "酸化剤反応前→反応後半反応式\n過マンガン酸カリウム（酸性）MnO₄⁻（赤紫）→Mn²⁺（無色）<u>MnO₄⁻ + 8H⁺ + 5e⁻ → Mn²⁺ + 4H₂O</u>\n過マンガン酸カリウム（中性・塩基性）MnO₄⁻→MnO₂（黒褐色）MnO₄⁻ + 2H₂O + 3e⁻ → MnO₂ + 4OH⁻\nニクロム酸カリウムCr₂O₇²⁻（橙）→Cr³⁺（緑）<u>Cr₂O₇²⁻ + 14H⁺ + 6e⁻ → 2Cr³⁺ + 7H₂O</u>\n希硝酸HNO₃→NO（無色）HNO₃ + 3H⁺ + 3e⁻ → NO + 2H₂O\n濃硝酸HNO₃→NO₂（赤褐色）HNO₃ + H⁺ + e⁻ → NO₂ + H₂O\n熱濃硫酸H₂SO₄→SO₂H₂SO₄ + 2H⁺ + 2e⁻ → SO₂ + 2H₂O\n過酸化水素（通常）H₂O₂→H₂OH₂O₂ + 2H⁺ + 2e⁻ → 2H₂O\n二酸化硫黄（相手がH₂S時のみ）SO₂→SSO₂ + 4H⁺ + 4e⁻ → S + 2H₂O\nオゾンO₃→O₂O₃ + 2H⁺ + 2e⁻ → O₂ + H₂O\n塩素Cl₂→Cl⁻Cl₂ + 2e⁻ → 2Cl⁻\n酸素O₂→H₂OO₂ + 4H⁺ + 4e⁻ → 2H₂O\n\n💡 酸化剤の強さ覚え方：<u>「マンションの2階から兄さん流される」</u>（MnO₄⁻ > Cr₂O₇²⁻ > 希HNO₃ > 熱濃H₂SO₄ > H₂O₂ > SO₂ > H₂S）"
            }
          ]
        },
        {
          "id": "redoxTreeData_sec2_2",
          "label": "【Step2：主要な還元剤リスト】",
          "step": 2,
          "isGroup": true,
          "children": [
            {
              "id": "redoxTreeData_sec2_2_1",
              "label": "還元剤一覧（反応前 → 反応後）",
              "step": 2,
              "subLabel": "これも暗記！",
              "explanation": "還元剤反応前→反応後半反応式\nナトリウムNa→Na⁺Na → Na⁺ + e⁻\nマグネシウムMg→Mg²⁺Mg → Mg²⁺ + 2e⁻\nアルミニウムAl→Al³⁺Al → Al³⁺ + 3e⁻\n水素H₂→H⁺H₂ → 2H⁺ + 2e⁻\n鉄(Ⅱ)イオンFe²⁺→Fe³⁺Fe²⁺ → Fe³⁺ + e⁻\nスズ(Ⅱ)イオンSn²⁺→Sn⁴⁺Sn²⁺ → Sn⁴⁺ + 2e⁻\nヨウ化物イオンI⁻→I₂2I⁻ → I₂ + 2e⁻\n硫化水素H₂S→SH₂S → S + 2H⁺ + 2e⁻\n<u>シュウ酸</u>(COOH)₂→CO₂(COOH)₂ → 2CO₂ + 2H⁺ + 2e⁻\n二酸化硫黄（通常）SO₂→SO₄²⁻SO₂ + 2H₂O → SO₄²⁻ + 4H⁺ + 2e⁻\n過酸化水素（相手がKMnO₄等）H₂O₂→O₂H₂O₂ → O₂ + 2H⁺ + 2e⁻\n\n⚠ <u>H₂O₂ と SO₂ は「両性」</u>：\n\n・H₂O₂：<u>普通は酸化剤</u>だが、相手が MnO₄⁻ や Cr₂O₇²⁻ のとき<u>還元剤</u>になる\n\n・SO₂：<u>普通は還元剤</u>だが、相手が H₂S のとき<u>酸化剤</u>になる"
            }
          ]
        },
        {
          "id": "redoxTreeData_sec2_3",
          "label": "【Step3：半反応式の作り方（5ステップ）】",
          "step": 3,
          "isGroup": true,
          "children": [
            {
              "id": "redoxTreeData_sec2_3_1",
              "label": "半反応式作成の手順",
              "step": 3,
              "subLabel": "この順に組み立てる！",
              "explanation": "<u>【手順】</u>\n\n❶ 酸化剤・還元剤を特定し、「<u>反応前 → 反応後</u>」を書く\n\n❷ <u>O、H 以外</u>の原子の数を合わせる\n\n❸ 不足している<u>O を H₂O で</u>合わせる\n\n❹ 不足している<u>H を H⁺ で</u>合わせる\n\n❺ 両辺の<u>電荷（±）が等しくなるよう e⁻ を加える</u>\n\n<u>実演①</u>：KMnO₄（酸性）の半反応式を作ろう\n\n❶ MnO₄⁻ → Mn²⁺（反応前後を書く）\n\n❷ Mn の数は左右1個ずつでOK\n\n❸ 左辺に O が4個、右辺に0個 → 右辺に H₂O を4つ\n\nMnO₄⁻ → Mn²⁺ + 4H₂O\n\n❹ 右辺の H が 8個 → 左辺に H⁺ を 8個\n\nMnO₄⁻ + 8H⁺ → Mn²⁺ + 4H₂O\n\n❺ 電荷：左辺 = -1+8=+7、右辺 = +2 → 左辺が5多い → 左辺に e⁻ を5個\n\n<u>MnO₄⁻ + 8H⁺ + 5e⁻ → Mn²⁺ + 4H₂O</u> 完成！\n\n<u>実演②</u>：シュウ酸(COOH)₂の半反応式\n\n❶ (COOH)₂ → 2CO₂\n\n❷ C の数：左右 2 で OK\n\n❸ O の数：左右 4 で OK\n\n❹ 左辺の H が2個、右辺0個 → 右辺に H⁺ を2個\n\n(COOH)₂ → 2CO₂ + 2H⁺\n\n❺ 電荷：左0、右+2 → 右に e⁻ を2個\n\n<u>(COOH)₂ → 2CO₂ + 2H⁺ + 2e⁻</u> 完成！"
            }
          ]
        },
        {
          "id": "redoxTreeData_sec2_4",
          "label": "【Step4：酸化還元反応式の作り方】",
          "step": 4,
          "isGroup": true,
          "children": [
            {
              "id": "redoxTreeData_sec2_4_1",
              "label": "e⁻を消して反応式を組む",
              "step": 4,
              "subLabel": "酸化剤の式＋還元剤の式",
              "explanation": "<u>【手順】</u>\n\n❶ 酸化剤・還元剤それぞれの半反応式を作る\n\n❷ e⁻ の数が等しくなるよう、両式を整数倍する\n\n❸ 両式を足し合わせ、<u>e⁻を消去</u>する\n\n❹ 必要ならスペクテーターイオン（陽イオンなど）を加えて「化学反応式」に整える\n\n<u>実演</u>：KMnO₄ と (COOH)₂ の反応（硫酸酸性）\n\n❶ MnO₄⁻ + 8H⁺ + 5e⁻ → Mn²⁺ + 4H₂O … ①（酸化剤／e⁻5個受取）\n\n❷ (COOH)₂ → 2CO₂ + 2H⁺ + 2e⁻ … ②（還元剤／e⁻2個放出）\n\n❸ e⁻の最小公倍数10：①×2 と ②×5\n\n2MnO₄⁻ + 16H⁺ + 10e⁻ → 2Mn²⁺ + 8H₂O\n\n5(COOH)₂ → 10CO₂ + 10H⁺ + 10e⁻\n\n❹ 足し合わせて e⁻ を消す：\n\n2MnO₄⁻ + 16H⁺ + 5(COOH)₂ → 2Mn²⁺ + 8H₂O + 10CO₂ + 10H⁺\n\n❺ H⁺ を整理（16-10=6）：\n\n<u>2MnO₄⁻ + 6H⁺ + 5(COOH)₂ → 2Mn²⁺ + 8H₂O + 10CO₂</u>\n\nこれに K⁺、SO₄²⁻ を加えて完全な化学反応式にすると：\n\n<u>2KMnO₄ + 3H₂SO₄ + 5(COOH)₂ → K₂SO₄ + 2MnSO₄ + 8H₂O + 10CO₂</u>"
            }
          ]
        }
      ]
    },
    {
      "id": "redoxTreeData_sec3",
      "label": "重要事項③ 酸化剤と還元剤の量的関係（酸化還元滴定）",
      "step": 3,
      "isGroup": true,
      "children": [
        {
          "id": "redoxTreeData_sec3_1",
          "label": "【Step1：量的関係の式】",
          "step": 1,
          "isGroup": true,
          "children": [
            {
              "id": "redoxTreeData_sec3_1_1",
              "label": "酸化還元滴定の基本式",
              "step": 1,
              "subLabel": "e⁻の授受でつり合わせる",
              "explanation": "<u>★ 酸化還元滴定の量的関係 ★</u>\n\n<u>（酸化剤の物質量）×（受け取る e⁻ の数）</u>\n\n＝\n\n<u>（還元剤の物質量）×（放出する e⁻ の数）</u>\n\n💡 <u>e⁻の物質量が等しい！</u>という考え方。酸塩基滴定の「H⁺の物質量が等しい」と対応する。"
            }
          ]
        },
        {
          "id": "redoxTreeData_sec3_2",
          "label": "【Step2：KMnO₄とシュウ酸の滴定】",
          "step": 2,
          "isGroup": true,
          "children": [
            {
              "id": "redoxTreeData_sec3_2_1",
              "label": "実験の手順と特徴",
              "step": 2,
              "subLabel": "指示薬いらず！",
              "explanation": "<u>【手順】</u>\n\n❶ シュウ酸水溶液をコニカルビーカーに入れる\n\n❷ <u>希H₂SO₄</u>を加えて硫酸酸性にする\n\n❸ <u>60〜80℃</u>に加温する（反応速度を上げるため）\n\n❹ 濃度未知のKMnO₄水溶液をビュレットから滴下\n\n❺ 水溶液が<u>薄い赤紫色</u>に色付いた点を終点とする\n\n💡 <u>指示薬は不要</u>！ KMnO₄自身が赤紫色なので、反応が終わった直後から色が消えなくなる。\n\n→ KMnO₄自身が指示薬の役割を果たす。"
            },
            {
              "id": "redoxTreeData_sec3_2_2",
              "label": "なぜ H₂SO₄ を使うのか？",
              "step": 2,
              "subLabel": "HCl や HNO₃ は NG",
              "explanation": "KMnO₄ を酸性条件で使うが、<u>希硫酸 H₂SO₄</u>を使う理由：\n\n❌ <u>HCl は NG</u>：Cl⁻ が KMnO₄ に酸化されて Cl₂ になってしまう\n\n（KMnO₄ の Mn²⁺ 生成分が Cl⁻ の酸化に消費される → 誤差）\n\n❌ <u>HNO₃ は NG</u>：HNO₃ 自身が酸化剤として働いてしまい、シュウ酸を酸化する\n\n→ KMnO₄との滴定が正確にできない\n\n✅ <u>H₂SO₄ は OK</u>：SO₄²⁻ は酸化されにくく、H₂SO₄ 自身も酸化剤として働かない（希硫酸なので）"
            },
            {
              "id": "redoxTreeData_sec3_2_3",
              "label": "計算例題",
              "step": 2,
              "subLabel": "KMnO₄×5 = シュウ酸×2",
              "explanation": "<u>例題</u>：硫酸酸性のもと、0.050 mol/L のシュウ酸(COOH)₂水溶液 8.0 mL に、濃度未知のKMnO₄水溶液 10 mL を加えたら過不足なく反応した。KMnO₄のモル濃度は？\n\n❶ KMnO₄ は e⁻ を <u>5</u> 個受け取る（MnO₄⁻ + 8H⁺ + 5e⁻ → Mn²⁺ + 4H₂O）\n\n❷ (COOH)₂ は e⁻ を <u>2</u> 個放出する（(COOH)₂ → 2CO₂ + 2H⁺ + 2e⁻）\n\n<u>量的関係式</u>：\n\nc × (10/1000) × <u>5</u> = 0.050 × (8.0/1000) × <u>2</u>\n\nc × 0.010 × 5 = 0.050 × 0.008 × 2\n\nc = 0.00080 ÷ 0.050 = <u>0.016 mol/L</u>"
            }
          ]
        },
        {
          "id": "redoxTreeData_sec3_3",
          "label": "【Step3：ヨウ素滴定】",
          "step": 3,
          "isGroup": true,
          "children": [
            {
              "id": "redoxTreeData_sec3_3_1",
              "label": "ヨウ素滴定の原理",
              "step": 3,
              "subLabel": "2段階の滴定・デンプン指示薬",
              "explanation": "<u>目的</u>：濃度未知の酸化剤（例：H₂O₂）を、Na₂S₂O₃（チオ硫酸ナトリウム）で間接的に滴定する。\n\n<u>【第1段階】</u>試料の酸化剤（H₂O₂）に過剰のKIを加える\n\nH₂O₂ + 2KI + H₂SO₄ → I₂ + 2H₂O + K₂SO₄\n\n→ ヨウ素 I₂ が遊離（褐色）\n\n<u>【第2段階】</u>生じた I₂ を Na₂S₂O₃ で滴定\n\nI₂ + 2Na₂S₂O₃ → 2NaI + Na₂S₄O₆\n\n（テトラチオン酸ナトリウム）\n\n🎨 <u>指示薬：デンプン水溶液</u>\n\n・I₂ が残っている間はデンプンと結合して<u>青紫色</u>を示す（ヨウ素デンプン反応）\n\n・I₂ が I⁻ に変わりきると<u>青紫色が消える</u> → これが終点！"
            }
          ]
        },
        {
          "id": "redoxTreeData_sec3_4",
          "label": "【Step4：COD（化学的酸素要求量）】",
          "step": 4,
          "isGroup": true,
          "children": [
            {
              "id": "redoxTreeData_sec3_4_1",
              "label": "CODとは？",
              "step": 4,
              "subLabel": "水質汚濁の指標",
              "explanation": "<u>COD（Chemical Oxygen Demand）</u>＝家庭排水などに含まれる有機物によって、湖沼や海水がどの程度汚染されているかを示す指標。\n\n有機物を酸化剤（KMnO₄）で酸化するのに必要な酸化剤の量を、<u>O₂ の質量（mg/L）</u>に換算した値。\n\n<u>【測定手順】</u>\n\n❶ 試料水に H₂SO₄ と<u>過剰のKMnO₄</u>を加え、加熱して有機物を分解\n\n❷ 残った KMnO₄ を<u>過剰のNa₂C₂O₄（シュウ酸ナトリウム）</u>で還元\n\n❸ 残ったシュウ酸ナトリウムをKMnO₄で<u>逆滴定</u>\n\n<u>関係式</u>：\n\n（KMnO₄が受け取ったe⁻ 総量）＝（有機物が失ったe⁻）＋（Na₂C₂O₄が失ったe⁻）\n\n最終的に O₂ の質量に換算：O₂ + 4H⁺ + 4e⁻ → 2H₂O から、O₂ 1mol = e⁻ 4mol"
            }
          ]
        }
      ]
    },
    {
      "id": "redoxTreeData_sec4",
      "label": "重要事項④ 酸化剤・還元剤としての強さ",
      "step": 4,
      "isGroup": true,
      "children": [
        {
          "id": "redoxTreeData_sec4_1",
          "label": "【Step1：ハロゲンの酸化力】",
          "step": 1,
          "isGroup": true,
          "children": [
            {
              "id": "redoxTreeData_sec4_1_1",
              "label": "酸化力の順序",
              "step": 1,
              "subLabel": "F₂ > Cl₂ > Br₂ > I₂",
              "explanation": "<u>ハロゲン単体の酸化力</u>（＝e⁻を受け取る力の強さ）：\n\n<u>F₂ ＞ Cl₂ ＞ Br₂ ＞ I₂</u>\n\n（周期表で上ほど酸化力が強い＝原子半径が小さく電子を引き寄せやすい）"
            },
            {
              "id": "redoxTreeData_sec4_1_2",
              "label": "ハロゲンの置換反応",
              "step": 1,
              "subLabel": "強い酸化剤が電子を奪う",
              "explanation": "「<u>酸化力の強い単体</u>」が「<u>酸化力の弱い単体のイオン</u>」から電子を奪って反応する。\n\n<u>例①</u>：2NaBr + Cl₂ → 2NaCl + Br₂ （反応する）\n\n→ Cl₂ は Br₂ より酸化力が強い → 反応進行 ✓\n\n<u>例②</u>：2NaCl + Br₂ → 反応しない\n\n→ Br₂ は Cl₂ より酸化力が弱い → 反応進まない ✗\n\n<u>例③</u>：2KI + Br₂ → 2KBr + I₂ （反応する）\n\n→ 溶液が褐色に着色（I₂ が生成）\n\n💡 <u>ヨウ素デンプン反応</u>：I₂ が生じたことは、デンプン水溶液に加えて青紫色になれば確認できる！"
            }
          ]
        },
        {
          "id": "redoxTreeData_sec4_2",
          "label": "【Step2：H₂O₂ と SO₂ の両性】",
          "step": 2,
          "isGroup": true,
          "children": [
            {
              "id": "redoxTreeData_sec4_2_1",
              "label": "相手次第で酸化剤にも還元剤にも",
              "step": 2,
              "subLabel": "頻出パターン",
              "explanation": "<u>❶ H₂O₂（過酸化水素）</u>\n\n・基本は<u>酸化剤</u>：H₂O₂ + 2H⁺ + 2e⁻ → 2H₂O\n\n・相手が<u>MnO₄⁻</u>（もっと強い酸化剤）のとき → <u>還元剤</u>となり O₂ を発生\n\nH₂O₂ → O₂ + 2H⁺ + 2e⁻\n\n<u>❷ SO₂（二酸化硫黄）</u>\n\n・基本は<u>還元剤</u>：SO₂ + 2H₂O → SO₄²⁻ + 4H⁺ + 2e⁻\n\n・相手が<u>H₂S</u>（もっと強い還元剤）のとき → <u>酸化剤</u>となり S を析出\n\nSO₂ + 4H⁺ + 4e⁻ → S + 2H₂O\n\n（SO₂ + 2H₂S → 3S + 2H₂O：温泉地の硫黄析出）"
            }
          ]
        },
        {
          "id": "redoxTreeData_sec4_3",
          "label": "【Step3：金属の酸化力・還元力】",
          "step": 3,
          "isGroup": true,
          "children": [
            {
              "id": "redoxTreeData_sec4_3_1",
              "label": "イオン化傾向との関係",
              "step": 3,
              "subLabel": "イオン化傾向大＝還元力大",
              "explanation": "<u>イオン化傾向が大きい金属ほど、還元剤として強い</u>（e⁻を放出しやすい）\n\n<u>イオン化傾向が小さい金属イオンほど、酸化剤として強い</u>（e⁻を受け取りやすい）\n\n<u>例</u>：CuSO₄水溶液に Zn を入れると、Cu が析出する\n\nZn + Cu²⁺ → Zn²⁺ + Cu\n\n（Zn は Cu より還元力が強い → Cu²⁺ から電子を奪える）\n\n→ 詳細は次項「重要事項⑤ イオン化傾向」で扱う！"
            }
          ]
        }
      ]
    },
    {
      "id": "redoxTreeData_sec5",
      "label": "重要事項⑤ 金属のイオン化傾向と反応",
      "step": 1,
      "isGroup": true,
      "children": [
        {
          "id": "redoxTreeData_sec5_1",
          "label": "【Step1：イオン化列と語呂合わせ】",
          "step": 1,
          "isGroup": true,
          "children": [
            {
              "id": "redoxTreeData_sec5_1_1",
              "label": "金属のイオン化列",
              "step": 1,
              "subLabel": "Li〜Au、17元素",
              "explanation": "<u>イオン化傾向</u>＝金属が水溶液中で陽イオンになろうとする傾向。\n\n<u>大 ← Li ＞ K ＞ Ca ＞ Na ＞ Mg ＞ Al ＞ Zn ＞ Fe ＞ Ni ＞ Sn ＞ Pb ＞ (H₂) ＞ Cu ＞ Hg ＞ Ag ＞ Pt ＞ Au → 小</u>\n\n🎵 <u>語呂合わせ</u>：<u>「リッチに 貸そ か な！ ま あ あ て に す な！ ひ ど す ぎ 借 金！」</u>\n\n<u>リッチ</u>に ＝ Li\n\n<u>貸</u>そ ＝ K\n\n<u>か</u> ＝ Ca\n\n<u>な</u> ＝ Na\n\n<u>ま</u> ＝ Mg\n\n<u>あ</u> ＝ Al\n\n<u>あ</u> ＝ Zn（あえん）\n\n<u>て</u> ＝ Fe（てつ）\n\n<u>に</u> ＝ Ni\n\n<u>す</u> ＝ Sn（すず）\n\n<u>な</u> ＝ Pb（なまり）\n\n<u>ひ</u> ＝ (H₂)\n\n<u>ど</u> ＝ Cu（どう）\n\n<u>す</u> ＝ Hg（水銀＝すいぎん）\n\n<u>ぎ</u> ＝ Ag（銀）\n\n<u>借</u> ＝ Pt（白金）\n\n<u>金</u> ＝ Au"
            }
          ]
        },
        {
          "id": "redoxTreeData_sec5_2",
          "label": "【Step2：水との反応】",
          "step": 2,
          "isGroup": true,
          "children": [
            {
              "id": "redoxTreeData_sec5_2_1",
              "label": "水との反応（3段階）",
              "step": 2,
              "subLabel": "常温水／熱水／高温水蒸気",
              "explanation": "反応該当金属反応式（例）\n<u>常温の水</u>と反応Li, K, Ca, Na2Na + 2H₂O → 2NaOH + H₂↑\n<u>熱水</u>と反応MgMg + 2H₂O → Mg(OH)₂ + H₂↑\n<u>高温の水蒸気</u>と反応Al, Zn, Fe3Fe + 4H₂O → Fe₃O₄ + 4H₂↑\n反応しないNi以降（Ni, Sn, Pb, Cu, Hg, Ag, Pt, Au）―\n\n💡 覚え方：「常温は<u>リッチに貸そかな</u>まで、熱水は<u>マ</u>グ、水蒸気は<u>あ・あ・て</u>（Al, Zn, Fe）まで！」"
            }
          ]
        },
        {
          "id": "redoxTreeData_sec5_3",
          "label": "【Step3：酸との反応】",
          "step": 3,
          "isGroup": true,
          "children": [
            {
              "id": "redoxTreeData_sec5_3_1",
              "label": "希酸（HCl・希H₂SO₄）との反応",
              "step": 3,
              "subLabel": "H₂より上の金属",
              "explanation": "<u>希塩酸・希硫酸</u>と反応して<u>H₂ を発生</u>するのは、<u>H₂よりイオン化傾向が大きい金属</u>（Li〜Pb まで）。\n\n<u>例①</u>：Zn + 2HCl → ZnCl₂ + H₂↑\n\n<u>例②</u>：Fe + H₂SO₄ → FeSO₄ + H₂↑\n\n⚠ <u>Pb は表面がPbCl₂やPbSO₄で被覆されて反応が止まる</u>ため、実質的にはあまり進まない（テストの落とし穴）"
            },
            {
              "id": "redoxTreeData_sec5_3_2",
              "label": "酸化力の強い酸（熱濃H₂SO₄・希HNO₃・濃HNO₃）",
              "step": 3,
              "subLabel": "Cu, Hg, Ag も溶ける",
              "explanation": "H₂より下の <u>Cu、Hg、Ag</u> は希酸には溶けないが、<u>酸化力の強い酸</u>には溶ける！\n\n<u>❶ 銅と希硝酸</u>\n\n3Cu + 8HNO₃ → 3Cu(NO₃)₂ + 4H₂O + <u>2NO↑</u>（無色気体）\n\n<u>❷ 銅と濃硝酸</u>\n\nCu + 4HNO₃ → Cu(NO₃)₂ + 2H₂O + <u>2NO₂↑</u>（赤褐色気体）\n\n<u>❸ 銅と熱濃硫酸</u>\n\nCu + 2H₂SO₄ → CuSO₄ + 2H₂O + <u>SO₂↑</u>（刺激臭気体）\n\n💡 これらの酸は<u>電子を受け取る作用（酸化力）</u>によって、H₂を発生させない代わりに金属を溶かす。\nH⁺ ではなく NO₃⁻ や SO₄²⁻ が酸化剤として働く！"
            },
            {
              "id": "redoxTreeData_sec5_3_3",
              "label": "不動態を作る金属",
              "step": 3,
              "subLabel": "濃硝酸に溶けない",
              "explanation": "<u>不動態</u>＝金属表面に緻密な酸化被膜ができて、内部への反応が進まなくなる状態。\n\n<u>不動態を作る金属</u>：<u>Fe, Co, Ni, Al, Cr</u>（濃硝酸には溶けない！）\n\n🎵 語呂合わせ：<u>「鉄子にある苦労！」</u>\n\n鉄（Fe）子（Co）に（Ni）ある（Al）苦労（Cr）\n\n💡 <u>アルミ製の容器で濃硝酸を運搬できる</u>のはこの性質のおかげ！"
            },
            {
              "id": "redoxTreeData_sec5_3_4",
              "label": "王水との反応",
              "step": 3,
              "subLabel": "Pt, Au も溶かす",
              "explanation": "<u>王水</u>＝<u>濃硝酸 : 濃塩酸 ＝ 1 : 3</u>（体積比）で混合した溶液。\n\n最強の酸化力を持ち、<u>Pt（白金）や Au（金）</u>も溶かす！\n\n🎵 語呂合わせ：<u>「一生は三円！」</u>\n\n一（濃硝酸1）生（硝酸の「しょう」）は（体積比）三（濃塩酸3）円（塩酸の「えん」）\n\n<u>例</u>：Au + HNO₃ + 4HCl → HAuCl₄ + NO + 2H₂O（テトラクロロ金(III)酸）"
            }
          ]
        },
        {
          "id": "redoxTreeData_sec5_4",
          "label": "【Step4：空気との反応】",
          "step": 4,
          "isGroup": true,
          "children": [
            {
              "id": "redoxTreeData_sec5_4_1",
              "label": "空気中での酸化",
              "step": 4,
              "subLabel": "常温／加熱／強熱／反応しない",
              "explanation": "反応該当金属例\n<u>常温で速やかに酸化</u>Li, K, Ca, Na4Na + O₂ → 2Na₂O\n<u>加熱で酸化</u>Mg, Al, Zn, Fe, Ni, Sn, Pb, Cu2Cu + O₂ → 2CuO\n<u>強熱で酸化</u>Hg, Ag2Hg + O₂ → 2HgO\n<u>反応しない</u>Pt, Au―（永遠に光沢を保つ！）\n\n💡 だから金や白金はジュエリーとして人気！ 銀は強熱でも黒く硫化しやすいので手入れが必要。"
            }
          ]
        },
        {
          "id": "redoxTreeData_sec5_5",
          "label": "【Step5：★超重要★ イオン化傾向と反応性の総まとめ表】",
          "step": 1,
          "isGroup": true,
          "children": [
            {
              "id": "redoxTreeData_sec5_5_1",
              "label": "総まとめ表（テスト直前に見返す）",
              "step": 1,
              "subLabel": "これだけで完璧！",
              "explanation": "イオン化傾向大 ←──────────────────────→ 小\n元素Li, K, Ca, NaMgAl, Zn, FeNi, Sn, Pb, (H₂), Cu, Hg, Ag, Pt, Au\n水との反応常温の水と反応熱水と反応高温水蒸気と反応反応しない\n希酸との反応希塩酸・希硫酸と反応してH₂発生（Ni, Sn, Pbまで含む）Cu, Hg, Ag → 酸化力の強い酸のみ／Pt, Au → 王水のみ\n空気との反応常温で速やかに酸化加熱で酸化Hg, Ag → 強熱で／Pt, Au → 反応しない\n製法溶融塩電解（融解した塩を電気分解）CO 還元・電解精錬など\n\n<u>★ 覚え方総まとめ ★</u>\n\n水：<u>「常温リッチに貸そかな、熱水マ、水蒸気アアテ、以降は反応しない」</u>\n\n酸：<u>「H₂までは希酸OK、Cu Hg Agは酸化力強い酸、Pt Auは王水のみ！」</u>\n\n空気：<u>「リッチに貸そかな速やかに、次は加熱、Hg Agは強熱、Pt Auは反応しない」</u>"
            }
          ]
        }
      ]
    },
    {
      "id": "redoxTreeData_sec6",
      "label": "重要事項⑥ 電池（一次・二次・燃料）",
      "step": 2,
      "isGroup": true,
      "children": [
        {
          "id": "redoxTreeData_sec6_1",
          "label": "【Step1：電池の基本原理】",
          "step": 1,
          "isGroup": true,
          "children": [
            {
              "id": "redoxTreeData_sec6_1_1",
              "label": "電池の基本構造と用語",
              "step": 1,
              "subLabel": "正極・負極・起電力",
              "explanation": "<u>電池</u>＝酸化還元反応の化学エネルギーを電気エネルギーに変換する装置。\n\n<u>負極（-極）</u>＝<u>還元剤</u>が e⁻ を放出する電極（＝酸化される極）\n\n→ イオン化傾向の<u>大きい</u>金属\n\n<u>正極（+極）</u>＝<u>酸化剤</u>が e⁻ を受け取る電極（＝還元される極）\n\n→ イオン化傾向の<u>小さい</u>金属\n\n<u>起電力</u>＝両極間の電位差（電池のパワー）\n\n→ 2極のイオン化傾向の差が大きいほど大きい\n\n<u>放電</u>＝電池から電流を取り出すこと\n\n<u>充電</u>＝外部電源で逆反応を起こし、電池を元に戻すこと\n\n💡 電子は <u>負極 → 導線 → 正極</u> の順で流れる。電流はその逆方向（+ → -）に流れる。"
            },
            {
              "id": "redoxTreeData_sec6_1_2",
              "label": "一次電池と二次電池",
              "step": 1,
              "subLabel": "充電できるか否か",
              "explanation": "分類特徴代表例\n<u>一次電池</u>充電できない（使い切り）マンガン乾電池／アルカリマンガン乾電池／酸化銀電池／リチウム電池\n<u>二次電池（蓄電池）</u>充電して繰り返し使える鉛蓄電池／リチウムイオン電池／ニッケル水素電池\n<u>燃料電池</u>燃料と酸素を供給し続けて発電（連続型）リン酸形／固体高分子形"
            }
          ]
        },
        {
          "id": "redoxTreeData_sec6_2",
          "label": "【Step2：基礎電池：ボルタ／ダニエル】",
          "step": 2,
          "isGroup": true,
          "children": [
            {
              "id": "redoxTreeData_sec6_2_1",
              "label": "ボルタ電池",
              "step": 2,
              "subLabel": "歴史上初の電池・分極問題あり",
              "explanation": "<u>構成</u>：(-) Zn ｜ H₂SO₄ aq ｜ Cu (+)\n\n<u>起電力</u>：約 0.76 V（一次電池）\n\n<u>負極反応</u>（Zn 板が溶ける）：\n\n<u>Zn → Zn²⁺ + 2e⁻</u>\n\n<u>正極反応</u>（Cu 板の表面で H₂ が発生）：\n\n<u>2H⁺ + 2e⁻ → H₂↑</u>\n\n<u>全体</u>：Zn + 2H⁺ → Zn²⁺ + H₂\n\n⚠ <u>分極</u>：正極表面にH₂が付着 → 電流が流れにくくなる\n\n→ この問題を解消したのがダニエル電池。"
            },
            {
              "id": "redoxTreeData_sec6_2_2",
              "label": "ダニエル電池",
              "step": 2,
              "subLabel": "素焼き板で分極を防ぐ",
              "explanation": "<u>構成</u>：(-) Zn ｜ ZnSO₄ aq ｜｜ CuSO₄ aq ｜ Cu (+)\n\n（｜｜ は素焼き板を表す）\n\n<u>起電力</u>：約 1.10 V（一次電池）\n\n<u>負極反応</u>：<u>Zn → Zn²⁺ + 2e⁻</u>（Zn板が溶ける）\n\n<u>正極反応</u>：<u>Cu²⁺ + 2e⁻ → Cu</u>（Cu板にCuが析出）\n\n<u>全体</u>：Zn + Cu²⁺ → Zn²⁺ + Cu\n\n🧪【ダニエル電池の図】\n\n［Zn板］—ZnSO₄水溶液｜素焼き板｜CuSO₄水溶液—［Cu板］\n\n（-極） （+極）\n\n💡 <u>素焼き板の役割</u>：ZnSO₄とCuSO₄が急激に混ざるのを防ぐ\n\n（もし混ざると、Zn板が直接Cu²⁺と反応して電子が導線を流れず、電池として機能しない）\n\n💡 <u>ダニエル電池を長持ちさせるコツ</u>：\n\n❶ ZnSO₄ の濃度は<u>小さく</u>（Zn²⁺が溶けやすい環境）\n\n❷ CuSO₄ の濃度は<u>大きく</u>（Cu が析出しやすい環境）"
            }
          ]
        },
        {
          "id": "redoxTreeData_sec6_3",
          "label": "【Step3：実用電池 一次／二次】",
          "step": 3,
          "isGroup": true,
          "children": [
            {
              "id": "redoxTreeData_sec6_3_1",
              "label": "鉛蓄電池（二次電池の代表）",
              "step": 3,
              "subLabel": "自動車バッテリー",
              "explanation": "<u>構成</u>：(-) Pb ｜ H₂SO₄ aq ｜ PbO₂ (+)\n\n<u>起電力</u>：約 2.00 V\n\n<u>【放電時】</u>\n\n負極：<u>Pb + SO₄²⁻ → PbSO₄ + 2e⁻</u>\n\n正極：<u>PbO₂ + 4H⁺ + SO₄²⁻ + 2e⁻ → PbSO₄ + 2H₂O</u>\n\n全体：Pb + PbO₂ + 2H₂SO₄ → 2PbSO₄ + 2H₂O\n\n<u>【充電時】</u>：放電の逆反応が起きる（電気分解！）\n\n負極：PbSO₄ + 2e⁻ → Pb + SO₄²⁻\n\n正極：PbSO₄ + 2H₂O → PbO₂ + 4H⁺ + SO₄²⁻ + 2e⁻\n\n💡 <u>放電すると硫酸が薄くなる</u>（H₂SO₄が消費、H₂Oが生成）\n\n→ 電解液の密度を測れば充電状態がわかる！\n\n自動車バッテリーの点検はこの原理を利用。"
            },
            {
              "id": "redoxTreeData_sec6_3_2",
              "label": "燃料電池（クリーンエネルギー）",
              "step": 3,
              "subLabel": "H₂ + O₂ → H₂O のみ",
              "explanation": "<u>燃料電池</u>＝水素などの燃料と酸素を供給して発電する装置。\n\n<u>❶ リン酸形燃料電池（電解液：H₃PO₄）</u>\n\n負極：<u>H₂ → 2H⁺ + 2e⁻</u>（H₂ が電子を放出＝還元剤）\n\n正極：<u>O₂ + 4H⁺ + 4e⁻ → 2H₂O</u>（O₂ が電子を受け取る＝酸化剤）\n\n全体：<u>2H₂ + O₂ → 2H₂O</u>\n\n<u>❷ 固体高分子形燃料電池（電解液：KOH aqなどアルカリ）</u>\n\n負極：<u>H₂ + 2OH⁻ → 2H₂O + 2e⁻</u>\n\n正極：<u>O₂ + 2H₂O + 4e⁻ → 4OH⁻</u>\n\n全体：<u>2H₂ + O₂ → 2H₂O</u>\n\n🌱 <u>発生する物質が水だけ</u>＝<u>クリーンエネルギー</u>！\n\nFCV（燃料電池自動車）や家庭用エネファームで実用化。"
            },
            {
              "id": "redoxTreeData_sec6_3_3",
              "label": "リチウムイオン電池",
              "step": 3,
              "subLabel": "現代のスマホ・EV",
              "explanation": "<u>構成</u>：(-) Li_xC（黒鉛にLi挿入） ｜ LiPF₆（有機電解液） ｜ Li_(1-x)CoO₂ (+)\n\n<u>起電力</u>：約 <u>3.70 V</u>（非常に高い）\n\n<u>特徴</u>：軽量・小型・高エネルギー密度・二次電池\n\n<u>用途</u>：スマートフォン、ノートPC、電気自動車（EV）\n\n🔋 2019年ノーベル化学賞：吉野彰・グッドイナフ・ウィッティンガム（リチウムイオン電池の開発）"
            },
            {
              "id": "redoxTreeData_sec6_3_4",
              "label": "その他の実用電池",
              "step": 3,
              "subLabel": "乾電池・酸化銀電池・ニッケル水素",
              "explanation": "電池負極正極電解液種類用途\nマンガン乾電池ZnMnO₂（+炭素棒）ZnCl₂ aq一次時計・リモコン\nアルカリマンガン乾電池ZnMnO₂KOH aq一次大電流用途\n酸化銀電池ZnAg₂OKOH aq一次ボタン電池・腕時計\nニッケル水素電池水素吸蔵合金 MHNiO(OH)KOH aq二次ハイブリッドカー"
            }
          ]
        },
        {
          "id": "redoxTreeData_sec6_4",
          "label": "【Step4：電池の総まとめ表】",
          "step": 4,
          "isGroup": true,
          "children": [
            {
              "id": "redoxTreeData_sec6_4_1",
              "label": "主要電池の反応式一覧",
              "step": 4,
              "subLabel": "暗記用",
              "explanation": "電池負極反応正極反応起電力\nボルタZn → Zn²⁺ + 2e⁻2H⁺ + 2e⁻ → H₂0.76V\nダニエルZn → Zn²⁺ + 2e⁻Cu²⁺ + 2e⁻ → Cu1.10V\n鉛蓄電池Pb + SO₄²⁻ → PbSO₄ + 2e⁻PbO₂ + 4H⁺ + SO₄²⁻ + 2e⁻ → PbSO₄ + 2H₂O2.00V\n燃料電池（リン酸）H₂ → 2H⁺ + 2e⁻O₂ + 4H⁺ + 4e⁻ → 2H₂O約1.2V\nLiイオンLi_xC → C + xLi⁺ + xe⁻Li_(1-x)CoO₂ + xLi⁺ + xe⁻ → LiCoO₂3.70V"
            }
          ]
        }
      ]
    },
    {
      "id": "redoxTreeData_sec7",
      "label": "重要事項⑦ 工業的製法（Al・Fe・Cu）",
      "step": 3,
      "isGroup": true,
      "children": [
        {
          "id": "redoxTreeData_sec7_1",
          "label": "【Step1：アルミニウムの製法（溶融塩電解）】",
          "step": 1,
          "isGroup": true,
          "children": [
            {
              "id": "redoxTreeData_sec7_1_1",
              "label": "なぜ溶融塩電解？",
              "step": 1,
              "subLabel": "Alはイオン化傾向が大きすぎる",
              "explanation": "Al はイオン化傾向が非常に大きく、<u>水溶液の電気分解では H₂O が先に還元されてしまう</u>ため、Alを得ることができない！\n\n→ <u>アルミナ Al₂O₃ を融解</u>して電気分解する（溶融塩電解）。\n⚠ <u>Al₂O₃ の融点は約 2054℃</u>と非常に高い！ これを下げる工夫が必要。"
            },
            {
              "id": "redoxTreeData_sec7_1_2",
              "label": "Step1-4：ボーキサイト → アルミニウム",
              "step": 1,
              "subLabel": "4段階の製造工程",
              "explanation": "<u>Step1：ボーキサイトを濃NaOH水溶液に溶かす</u>\n\nAl₂O₃ + 2NaOH + 3H₂O → 2Na[Al(OH)₄]（テトラヒドロキシドアルミン酸ナトリウム）\n\n<u>Step2：多量の水で希釈し、Al(OH)₃を沈殿させる</u>\n\nNa[Al(OH)₄] → Al(OH)₃↓ + NaOH\n\n<u>Step3：Al(OH)₃を加熱してアルミナ Al₂O₃ を得る</u>\n\n2Al(OH)₃ → Al₂O₃ + 3H₂O\n\n<u>Step4：氷晶石 Na₃AlF₆ に Al₂O₃ を溶かして溶融塩電解</u>\n\n陰極：<u>Al³⁺ + 3e⁻ → Al</u>（アルミニウムが析出）\n\n陽極：<u>C + O²⁻ → CO + 2e⁻</u> および <u>C + 2O²⁻ → CO₂ + 4e⁻</u>\n\n（陽極の炭素電極が O²⁻ と反応して消費される）\n\n💡 <u>氷晶石 Na₃AlF₆ の役割</u>：Al₂O₃（融点2054℃）の融点を下げて、約 <u>1000℃</u> でも融解させる融剤。\n\n→ これにより電気エネルギーの消費を大幅削減。\n⚡ Al 1kg 製造に電力 <u>約14kWh</u> が必要！ アルミは「電気の缶詰」とも呼ばれる。\n\n→ リサイクルすれば新規製造の1/30以下のエネルギーで済む。"
            }
          ]
        },
        {
          "id": "redoxTreeData_sec7_2",
          "label": "【Step2：鉄の製法（溶鉱炉）】",
          "step": 2,
          "isGroup": true,
          "children": [
            {
              "id": "redoxTreeData_sec7_2_1",
              "label": "Step1：溶鉱炉での還元",
              "step": 2,
              "subLabel": "CO で酸化鉄を還元",
              "explanation": "<u>原料</u>：鉄鉱石（Fe₂O₃、Fe₃O₄）、<u>コークス C</u>、<u>石灰石 CaCO₃</u>\n\n❶ コークスの燃焼で CO を発生：\n\n2C + O₂ → 2CO\n\n❷ <u>CO による還元</u>で銑鉄を得る：\n\n<u>Fe₂O₃ + 3CO → 2Fe + 3CO₂</u>\n\n❸ 石灰石は鉄鉱石中の SiO₂ をスラグとして分離：\n\nCaCO₃ → CaO + CO₂\n\nCaO + SiO₂ → <u>CaSiO₃</u>（スラグ ＝ ケイ酸カルシウム）"
            },
            {
              "id": "redoxTreeData_sec7_2_2",
              "label": "Step2：転炉で銑鉄 → 鋼",
              "step": 2,
              "subLabel": "炭素成分を減らす",
              "explanation": "<u>銑鉄</u>（せんてつ）：溶鉱炉から得られる、炭素を約 4% 含む鉄（もろい・鋳物用）\n\n<u>転炉での処理</u>：銑鉄に<u>O₂を吹き込み加熱</u> → 炭素を CO₂ として除去\n\nC + O₂ → CO₂↑\n\n<u>鋼</u>（こう）：炭素を約 0.02〜2% に減らした鉄（強靭・建築・レール用）\n\n🏭【製鉄プロセス】\n\n鉄鉱石＋コークス＋石灰石\n\n↓（溶鉱炉：CO還元）\n\n銑鉄（C 約4%）\n\n↓（転炉：O₂吹込み）\n\n鋼（C 少ない）"
            }
          ]
        },
        {
          "id": "redoxTreeData_sec7_3",
          "label": "【Step3：銅の製法（電解精錬）】",
          "step": 3,
          "isGroup": true,
          "children": [
            {
              "id": "redoxTreeData_sec7_3_1",
              "label": "銅の電解精錬の仕組み",
              "step": 3,
              "subLabel": "粗銅 → 純銅（99.99%）",
              "explanation": "<u>構成</u>：陽極＝<u>粗銅</u>（99%程度）／陰極＝<u>純銅</u>（薄板）／電解液＝<u>CuSO₄ aq（硫酸酸性）</u>\n\n<u>【反応】</u>\n\n<u>陽極（粗銅）</u>：主に <u>Cu → Cu²⁺ + 2e⁻</u>（銅が溶け出す）\n\n<u>陰極（純銅）</u>：<u>Cu²⁺ + 2e⁻ → Cu</u>（純銅が析出）\n\n🔬【電解精錬の図】\n\n［粗銅］（+極）—CuSO₄水溶液—［純銅］（-極）\n\n（電源＋直流電流）\n\n（Cu²⁺として溶ける） （Cuとして析出）"
            },
            {
              "id": "redoxTreeData_sec7_3_2",
              "label": "陽極泥と不純物の行き先",
              "step": 3,
              "subLabel": "金・銀が回収できる！",
              "explanation": "<u>粗銅中の不純物</u>のうち：\n\n<u>❶ Cu よりイオン化傾向が大きい</u>（Zn, Fe, Ni など）\n\n→ Cuと一緒に Cu²⁺, Zn²⁺, Fe²⁺として<u>電解液中に溶解</u>（陰極では析出しない）\n\n<u>❷ Cu よりイオン化傾向が小さい</u>（Ag, Au など）\n\n→ 電子を放出しないため<u>溶けずに落下</u>し、陽極の下に<u>陽極泥（ようきょくでい）</u>として沈殿\n\n→ この陽極泥から<u>金や銀を回収</u>できる！（副産物）\n\n<u>❸ Pb</u>：PbSO₄ が難溶性なので陽極泥に沈殿する\n\n💰 <u>実は銅の電解精錬は「金・銀の回収工程」でもある！</u> 電気代のかなりの部分が回収された貴金属で相殺される。"
            },
            {
              "id": "redoxTreeData_sec7_3_3",
              "label": "電流を小さくする理由",
              "step": 3,
              "subLabel": "純度を保つため",
              "explanation": "電流を<u>小さくゆっくり</u>流す理由：\n\n・電流を大きくしすぎると、Cu より少し卑な不純物（Ni, Znなど）も陰極で析出してしまう\n\n・ゆっくり電解すると、イオン化傾向の順で確実に銅だけが析出する\n\n→ 純度 <u>99.99%</u> の純銅が得られる"
            }
          ]
        },
        {
          "id": "redoxTreeData_sec7_4",
          "label": "【Step4：3つの製法の総まとめ】",
          "step": 4,
          "isGroup": true,
          "children": [
            {
              "id": "redoxTreeData_sec7_4_1",
              "label": "Al・Fe・Cu 製法の比較",
              "step": 4,
              "subLabel": "イオン化傾向との対応",
              "explanation": "金属イオン化傾向製法主な反応\n<u>Al</u>大（H₂より上）<u>溶融塩電解</u>（融解したAl₂O₃ + 氷晶石）陰極：Al³⁺ + 3e⁻ → Al\n<u>Fe</u>中<u>CO還元</u>（溶鉱炉）Fe₂O₃ + 3CO → 2Fe + 3CO₂\n<u>Cu</u>小（H₂より下）<u>電解精錬</u>（水溶液電気分解）陰極：Cu²⁺ + 2e⁻ → Cu\n\n💡 <u>イオン化傾向が大きい金属</u>ほど、より強力な還元手段（電気分解）が必要！\n\n・Al は水溶液の電気分解ではダメ → 溶融塩電解\n\n・Fe は CO で還元できる（比較的簡単）\n\n・Cu は水溶液の電気分解で高純度化できる"
            }
          ]
        }
      ]
    }
  ]
};


