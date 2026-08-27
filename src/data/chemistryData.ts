import { acidBaseProblems } from './acidBaseProblems';
import { redoxProblems } from './redoxProblems';
import { pickCrystalProblems } from './crystalProblems';
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
              "text": "問4　下線部①は、水・エタノールの（ ア ）の加熱と、水とエタノールの（ イ ）の加熱のグラフを示したものである。この3つのグラフ①～③をそれぞれ、水のグラフ・エタノールのグラフ・水とエタノールの混合物のグラフに分類し、①～③で示せ。\n\n",
              "imageUrl": "/graph.jpg",
              "imageCaption": "加熱のグラフ",
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
              "text": "1 ろ過に関する次の問いに答えよ。\n\n（1）ろ紙を通過して下に落ちた液体のことを何というか。\n\n（2）ろ過はどのような混合物の分離に用いる操作か。「固体」「液体」という言葉を用いて答えよ。\n\n（3）ろ過の操作として、最も適切な図を、下の図の(ア)〜(エ)のうちから1つ選べ。\n\n※(ア)〜(エ)の図の意味：\n（ア）ガラス棒を使わずに直接ろうとに液を注いでいる\n（イ）ろうとの足がビーカーの内壁に密着していない\n（ウ）ガラス棒に伝わらせて液を注ぎ、ろうとの足がビーカーの内壁に密着している（正しい操作）\n（エ）ガラス棒の先がろ紙にあたっておらず、液がはねている",
              "imageUrl": "/fig_filtration_abcd.png",
              "imageCaption": "ろ過の操作 ア〜エ",
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
              "text": "2 塩化ナトリウム（NaCl）水溶液から水を分離するため、枝付きフラスコとリービッヒ冷却器を用いて蒸留を行った。以下の問いに答えよ。\n\n(1) 図の①～⑤の器具・物質の名前を答えよ。\n(2) 枝付きフラスコに入れる液量はどのくらいにするべきか。\n(3) 加熱する際、フラスコ内にあらかじめ「沸騰石」を入れるのはなぜか。理由を答えよ。\n(4) 温度計の球部を枝の近くに設置する理由を答えよ。「〜の温度をはかるため」という形で答えよ。\n(5) リービッヒ冷却器に流す冷却水は、「下から上」「上から下」のどちらに流すべきか。また、それはなぜか.理由を答えよ。\n(6) 留出液を集める三角フラスコをゴム栓等で密閉してはいけないのはなぜか。理由を答えよ。",
              "imageUrl": "/fig_distillation_setup.png",
              "imageCaption": "蒸留装置 ①〜⑤",
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
              "text": "4 昇華法に関する次の問いに答えよ。\n\n（1）ヨウ素の昇華性を利用して、できるだけ多くのヨウ素を集めたい。最も適当な分離法を、下の図の①〜④のうちから1つ選べ。\n\n※選択肢の図の意味：\n①：丸底フラスコの上に冷却装置がなく、ヨウ素の蒸気が逃げてしまう\n②：丸底フラスコの上に「冷水」を入れた丸底フラスコを載せ、下から混合物を加熱して冷水フラスコの底にヨウ素を析出させる（適切）\n③：冷水の中に混合物を入れるだけで、加熱をしないため昇華が起きない\n④：丸底フラスコの上に「温水」を入れた丸底フラスコを載せているため、蒸気が冷却されない\n\n（2）次の中から、昇華されやすい物質をすべて選べ。\nア．塩化ナトリウム（食塩）　イ．ヨウ素　ウ．ドライアイス　エ．鉄　オ．ナフタレン　カ．水（氷）　キ．パラジクロロベンゼン",
              "imageUrl": "/fig_sublimation_setups.png",
              "imageCaption": "昇華実験装置 ①〜④",
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
              "text": "5 抽出に関する次の問いに答えよ。\n\n目的の物質だけをよく溶かす溶媒を用いて、混合物から成分を分離する操作を抽出という。\n\n(1) ヨウ素と水の混合物（ヨウ素水溶液）からヨウ素を分離したい。このとき加える溶媒として最も適当なものを、次のア〜ウから選べ。\nア. エタノール　イ. ヘキサン　ウ. 食塩水\n\n(2) (1)の操作を行う際に用いる、図のようなガラス器具の名称を答えよ。\n\n(3) 茶葉に湯を注いで、香りや風味の成分を溶かしだす操作も抽出の一種である。このように、抽出は身近な生活でも利用されている。次のうち、抽出の原理を利用していないものを1つ選べ。\nア. コーヒー豆からコーヒーをいれる\nイ. 昆布からだしをとる\nウ. 海水から塩を取り出す",
              "imageUrl": "/fig_separating_funnel.png",
              "imageCaption": "分液漏斗",
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
              "text": "8 次の文章（1）〜（5）に関連する分離法の名称をそれぞれ答えよ。\n\n(1) 少量の不純物を含む固体を熱水に溶かし、冷却して純粋な結晶を得る。\n(2) ヨウ素と水の混合物にヘキサンを加え、ヨウ素だけを溶かしだして分離する。\n(3) 砂とヨウ素の混合物を加熱し、ヨウ素だけを気体にしてから再び固体にして集める。\n(4) 水性ペンのインクを、ろ紙などに対する吸着力の違いを利用して分離する。\n(5) 茶葉に湯を注ぎ、香りや風味の成分を溶かしだす。",
              "imageUrl": "/fig_separating_funnel.png",
              "imageCaption": "分液漏斗（抽出）",
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
              "text": "B　（リード文続き）\n...また、溶液を加熱して沸騰させ、生じた蒸気を冷却して再び液体として取り出す方法を ( エ: 蒸留 ) という。この ( エ ) の操作を行う際、使用する器具の名称や装置の組み立てには、いくつかの重要な注意点がある。\n\n問3 ( エ ) の操作（蒸留）に用いる装置について、次の(1)〜(6)の問いに答えよ。\n(1)　図のA～Dの器具の名称を記せ。\n(2)　この図ではDの位置が間違っている。正しくは枝付きフラスコのどこに温度計を持ってくるべきか。\n(3)　Bの器具の冷却水はどの方向（「上から下」または「下から上」）に流すべきか。また、そのように流す理由を簡潔に答えよ。\n(4)　三角フラスコは、密栓してはならない。その理由を簡潔に答えよ。\n(5)　Aの器具に入れている沸騰石の役割を答えよ。\n(6)  Aの器具に入れる液体の量はどれぐらいにすればよいか答えよ。",
              "imageUrl": "/graph2.jpg",
              "imageCaption": "蒸留装置",
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
            "組成式と分子式",
            "分子の形と極性",
            "炭素の同素体",
            "配位結合",
            "単位格子",
            "延性・展性",
            "劈開"
          ],
          "practiceProblems": [
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
