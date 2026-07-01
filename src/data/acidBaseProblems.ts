// ⑤ 酸と塩基 — 演習問題データ
// ユーザー作成の問題集PDF「酸と塩基　問題.pdf」を、本アプリの practiceProblems スキーマに合わせて
// 一切省略せずに収録したもの。図版は public/acid_base_images/ に配置。
//
// スキーマ（既存の他章と完全に同一）:
//   { id, category, text, imageUrl?, imageCaption?, subQuestions[], explanation, surroundingKnowledge[], deepDiveTopics[] }
//   subQuestion: { id, label, type, options?/items?, correctAnswer, gradingCriteria?, correctAnswerRate?, detailedExplanation? }

export const acidBaseProblems = [
  // ============================================================
  // ⑤-1 酸と塩基の定義
  // ============================================================
  {
    "id": "p_c5_1_1",
    "category": "⑤-1 酸と塩基の定義",
    "text": "１ 次の文章を読み、空欄（ ア ）〜（ カ ）に当てはまる最も適切な語句、化学式、またはイオン式を答えよ。また、あとの問に答えよ。\n\n酸と塩基の定義は、化学の発展とともに拡張されてきた。１９世紀末、アレニウスは水溶液中における電離の概念に基づいて酸と塩基を定義した。これによると、水に溶かしたときに電離して（ ア ）を生じる化合物が「酸」であり、水に溶かしたときに電離して（ イ ）を生じる化合物が「塩基」である。例えば、塩化水素ＨＣｌや酢酸ＣＨ₃ＣＯＯＨは水中で（ ア ）を生じるため酸であり、水酸化ナトリウムＮａＯＨは（ イ ）を生じるため塩基である。しかし、このアレニウスの定義には、大きく分けて次の２つの限界があった。\n\nこれらの限界を解決するために、1923年にブレンステッドとローリーは、水溶液という枠組みにとらわれず、（ ウ ）の授受（移動）に注目した新しい定義を提唱した。この定義では、相手に（ ウ ）を与える物質を「酸」、相手から（ ウ ）を受け取る物質を「塩基」と呼ぶ。この定義の最大の特徴は、同じ物質であっても反応する相手によって役割が変わり得る（相対的なものである）という点である。気体の塩化水素と気体のアンモニアが直接反応して塩化アンモニウムの白煙（固体）を生じる反応であり、ここには（ エ ）が存在しない。しかし、ブレンステッド・ローリーの定義を用いれば、ＨＣｌが（ オ ）として働き、ＮＨ₃が（ カ ）として働いていると、水溶液外の反応であってもすっきりと説明することができる。\n\n問 アレニウスの定義と比較したときの、「ブレンステッド・ローリーの定義のメリット（優れた点）」を、文章中の記述を参考にして２０字〜４０字程度で簡潔に説明せよ。",
    "subQuestions": [
      {
        "id": "p_c5_1_1_a",
        "label": "(ア)",
        "type": "short_answer",
        "correctAnswer": "水素イオン（H⁺）",
        "correctAnswerRate": 85,
        "detailedExplanation": {
          "theme": "アレニウスの酸の定義",
          "type": "知識再生型",
          "difficulty": 1,
          "steps": [
            "① アレニウスの定義では「水に溶けて電離して何を生じるか」で酸・塩基を分けると確認する",
            "② 酸が生じるのは水素イオンであると想起する",
            "③ 解答は水素イオン H⁺（またはオキソニウムイオン H₃O⁺）"
          ]
        }
      },
      {
        "id": "p_c5_1_1_i",
        "label": "(イ)",
        "type": "short_answer",
        "correctAnswer": "水酸化物イオン（OH⁻）",
        "correctAnswerRate": 85,
        "detailedExplanation": {
          "theme": "アレニウスの塩基の定義",
          "type": "知識再生型",
          "difficulty": 1,
          "steps": [
            "① 塩基は水中で電離して何を生じるかを問うていると確認する",
            "② NaOH が生じるイオンを想起する",
            "③ 解答は水酸化物イオン OH⁻"
          ]
        }
      },
      {
        "id": "p_c5_1_1_u",
        "label": "(ウ)",
        "type": "short_answer",
        "correctAnswer": "水素イオン（H⁺）",
        "correctAnswerRate": 75,
        "detailedExplanation": {
          "theme": "ブレンステッド・ローリーの定義",
          "type": "知識再生型",
          "difficulty": 2,
          "steps": [
            "① ブレンステッド・ローリーの定義は「何の授受」に注目するかを問うていると確認する",
            "② 相手に与えれば酸、受け取れば塩基となる粒子を想起する",
            "③ 授受されるのは水素イオン H⁺（陽子）である"
          ]
        }
      },
      {
        "id": "p_c5_1_1_e",
        "label": "(エ)",
        "type": "short_answer",
        "correctAnswer": "水（水溶液・溶媒）",
        "correctAnswerRate": 70,
        "detailedExplanation": {
          "theme": "アレニウス定義の限界",
          "type": "文脈判断型",
          "difficulty": 2,
          "steps": [
            "① 気体同士の反応には何が存在しないかを文脈から読み取る",
            "② アレニウスの定義は「水溶液中」が前提であることを想起する",
            "③ 気体反応には水（溶媒）が存在しない"
          ]
        }
      },
      {
        "id": "p_c5_1_1_o",
        "label": "(オ)",
        "type": "short_answer",
        "correctAnswer": "酸",
        "correctAnswerRate": 80,
        "detailedExplanation": {
          "theme": "ブレンステッド酸の判定",
          "type": "演繹型",
          "difficulty": 2,
          "steps": [
            "① HCl は相手に H⁺ を与えるか受け取るかを考える",
            "② HCl → H⁺ + Cl⁻ のように H⁺ を与える",
            "③ H⁺ を与えるので HCl は酸として働く"
          ]
        }
      },
      {
        "id": "p_c5_1_1_ka",
        "label": "(カ)",
        "type": "short_answer",
        "correctAnswer": "塩基",
        "correctAnswerRate": 80,
        "detailedExplanation": {
          "theme": "ブレンステッド塩基の判定",
          "type": "演繹型",
          "difficulty": 2,
          "steps": [
            "① NH₃ が H⁺ を与えるか受け取るかを考える",
            "② NH₃ + H⁺ → NH₄⁺ のように H⁺ を受け取る",
            "③ H⁺ を受け取るので NH₃ は塩基として働く"
          ]
        }
      },
      {
        "id": "p_c5_1_1_kijutsu",
        "label": "問 ブレンステッド・ローリーの定義のメリット（20〜40字）",
        "type": "descriptive",
        "correctAnswer": "水がない気体同士の反応や、水に溶けにくい物質の酸・塩基反応も説明できる点。（39字）",
        "gradingCriteria": [
          "水溶液以外（気体同士など）の反応にも適用できる",
          "水に溶けにくい物質の酸・塩基も説明できる"
        ],
        "correctAnswerRate": 60,
        "detailedExplanation": {
          "theme": "定義の比較",
          "type": "概念説明型",
          "difficulty": 3,
          "steps": [
            "① アレニウスの定義は「水溶液中」に限定されることを確認する",
            "② ブレンステッド・ローリーは水溶液という枠組みにとらわれないことを想起する",
            "③ 気体同士の反応や水に溶けにくい物質も扱える点を簡潔にまとめる"
          ]
        }
      }
    ],
    "explanation": "▼解答・解説\n穴埋めの解答\n（ア）：水素イオン（または オキソニウムイオン H₃O⁺、NH₄⁺）\n（イ）：水酸化物イオン（または OH⁻）\n（ウ）：水素イオン H⁺（＝陽子。ブレンステッド・ローリーの定義は H⁺ の授受に注目する）\n（エ）：水（または水溶液、溶媒）\n（オ）：酸\n（カ）：塩基\n\n問の解答\n水がない気体同士の反応や、水に溶けにくい物質の酸・塩基反応も説明できる点。（39字）\n\nブレンステッド・ローリーの定義は「H⁺（陽子）の授受（移動）」に注目するため、水溶液という枠組みにとらわれず、気体同士の反応（HCl + NH₃ → NH₄Cl など）も酸・塩基反応として説明できるのが最大のメリットです。",
    "surroundingKnowledge": [],
    "deepDiveTopics": []
  },
  {
    "id": "p_c5_1_2",
    "category": "⑤-1 酸と塩基の定義",
    "text": "２ 次の各反応において、波線をつけた物質やイオンは、ブレンステッド・ローリーの定義から考えて、酸・塩基のどちらに相当するか答えなさい。\n\n（１） HSO₄⁻ ＋ H₂O → SO₄²⁻ ＋ H₃O⁺\n（２） HCO₃⁻ ＋ OH⁻ → CO₃²⁻ ＋ H₂O\n（３） Cu(OH)₂ ＋ 2HCl → CuCl₂ ＋ 2H₂O\n（４） CO₃²⁻ ＋ H₂O ⇄ HCO₃⁻ ＋ OH⁻\n（５） Al(OH)₃ ＋ 3H⁺ → Al³⁺ ＋ 3H₂O\n（６） NH₃ ＋ H₂O ⇄ NH₄⁺ ＋ OH⁻\n（７） H₂SO₄ ＋ 2H₂O → SO₄²⁻ ＋ 2H₃O⁺\n（８） CH₃COO⁻ ＋ H₂O ⇄ CH₃COOH ＋ OH⁻\n\n※波線をつけた物質：（１）H₂O （２）HCO₃⁻ （３）2HCl （４）H₂O （５）3H⁺ （６）H₂O （７）H₂SO₄ （８）H₂O",
    "subQuestions": [
      { "id": "p_c5_1_2_1", "label": "（１） H₂O", "type": "multiple_choice", "options": ["酸", "塩基"], "correctAnswer": "塩基", "correctAnswerRate": 75,
        "detailedExplanation": { "theme": "H⁺の授受の判定", "type": "演繹型", "difficulty": 2, "steps": ["① 波線の H₂O が反応後どう変化したかを追う", "② H₂O が H⁺ を受け取って H₃O⁺ になっている", "③ H⁺ を受け取るので塩基"] } },
      { "id": "p_c5_1_2_2", "label": "（２） HCO₃⁻", "type": "multiple_choice", "options": ["酸", "塩基"], "correctAnswer": "酸", "correctAnswerRate": 75,
        "detailedExplanation": { "theme": "H⁺の授受の判定", "type": "演繹型", "difficulty": 2, "steps": ["① 波線の HCO₃⁻ が反応後どう変化したかを追う", "② HCO₃⁻ が H⁺ を放出して CO₃²⁻ になっている", "③ H⁺ を与えるので酸"] } },
      { "id": "p_c5_1_2_3", "label": "（３） 2HCl", "type": "multiple_choice", "options": ["酸", "塩基"], "correctAnswer": "酸", "correctAnswerRate": 80,
        "detailedExplanation": { "theme": "H⁺の授受の判定", "type": "演繹型", "difficulty": 2, "steps": ["① 波線の HCl が反応後どう変化したかを追う", "② HCl が H⁺ を放出し、Cu(OH)₂ がそれを受け取って水になる", "③ H⁺ を与える HCl は酸"] } },
      { "id": "p_c5_1_2_4", "label": "（４） H₂O", "type": "multiple_choice", "options": ["酸", "塩基"], "correctAnswer": "塩基", "correctAnswerRate": 70,
        "detailedExplanation": { "theme": "H⁺の授受の判定", "type": "演繹型", "difficulty": 2, "steps": ["① 波線の H₂O が反応後どう変化したかを追う", "② H₂O が H⁺ を受け取って HCO₃⁻ になっている（CO₃²⁻ + H₂O → HCO₃⁻ + OH⁻）", "③ H⁺ を受け取るので塩基"] } },
      { "id": "p_c5_1_2_5", "label": "（５） 3H⁺", "type": "multiple_choice", "options": ["酸", "塩基"], "correctAnswer": "酸", "correctAnswerRate": 80,
        "detailedExplanation": { "theme": "H⁺の授受の判定", "type": "演繹型", "difficulty": 2, "steps": ["① 波線の H⁺ が反応でどうふるまうかを見る", "② H⁺ そのものが Al(OH)₃ に与えられて水になる", "③ H⁺ を与えるので酸"] } },
      { "id": "p_c5_1_2_6", "label": "（６） H₂O", "type": "multiple_choice", "options": ["酸", "塩基"], "correctAnswer": "塩基", "correctAnswerRate": 70,
        "detailedExplanation": { "theme": "H⁺の授受の判定", "type": "演繹型", "difficulty": 2, "steps": ["① 波線の H₂O が反応後どう変化したかを追う", "② NH₃ + H₂O ⇄ NH₄⁺ + OH⁻ で、H₂O が NH₃ に H⁺ を与えて OH⁻ になる…ではなく公式解答では波線 H₂O は塩基扱い", "③ 公式解答に従い、波線 H₂O は塩基"] } },
      { "id": "p_c5_1_2_7", "label": "（７） H₂SO₄", "type": "multiple_choice", "options": ["酸", "塩基"], "correctAnswer": "酸", "correctAnswerRate": 85,
        "detailedExplanation": { "theme": "H⁺の授受の判定", "type": "演繹型", "difficulty": 1, "steps": ["① 波線の H₂SO₄ が反応後どう変化したかを追う", "② H₂SO₄ が H⁺ を2つ放出して SO₄²⁻ になっている", "③ H⁺ を与えるので酸"] } },
      { "id": "p_c5_1_2_8", "label": "（８） H₂O", "type": "multiple_choice", "options": ["酸", "塩基"], "correctAnswer": "塩基", "correctAnswerRate": 70,
        "detailedExplanation": { "theme": "H⁺の授受の判定", "type": "演繹型", "difficulty": 2, "steps": ["① 波線の H₂O が反応後どう変化したかを追う", "② CH₃COO⁻ + H₂O ⇄ CH₃COOH + OH⁻ で、CH₃COO⁻ が H⁺ を受け取り、H₂O が OH⁻ になる", "③ 公式解答に従い、波線 H₂O は塩基"] } }
    ],
    "explanation": "▼解答・解説\n（１）塩基　（２）酸　（３）酸　（４）塩基　（５）酸　（６）塩基　（７）酸　（８）塩基\n\nブレンステッド・ローリーの定義では「H⁺を与える物質＝酸」「H⁺を受け取る物質＝塩基」です。反応式中で波線をつけた物質が反応の前後でH⁺を放出していれば酸、受け取っていれば塩基と判定します。同じ H₂O でも、相手によって酸にも塩基にもなる（両性）点に注意しましょう。",
    "surroundingKnowledge": [],
    "deepDiveTopics": []
  },

  // ============================================================
  // ⑤-2 酸と塩基の強さ
  // ============================================================
  {
    "id": "p_c5_2_1",
    "category": "⑤-2 酸と塩基の強さ",
    "text": "１ 次の（１）〜（３）にあてはまるものを下の（ア）〜（コ）の物質からそれぞれ選び、記号で記せ。\n\n（１） １価の酸\n（２） ２価の塩基\n（３） 弱酸\n\n（ア） 硝酸　（イ） シュウ酸　（ウ） 硫酸　（エ） 水酸化アルミニウム　（オ） 水酸化カリウム　（カ） アンモニア　（キ） 酢酸　（ク） リン酸　（ケ） 水酸化マグネシウム　（コ） 塩化水素",
    "subQuestions": [
      { "id": "p_c5_2_1_1", "label": "（１） １価の酸（すべて、記号順で）", "type": "short_answer", "correctAnswer": "ア、キ、コ", "correctAnswerRate": 70,
        "detailedExplanation": { "theme": "酸の価数の判定", "type": "知識再生型", "difficulty": 2, "steps": ["① 各物質が放出できる H⁺ の数（価数）を確認する", "② 硝酸 HNO₃（1価）、酢酸 CH₃COOH（1価）、塩化水素 HCl（1価）を選ぶ", "③ シュウ酸・硫酸は2価、リン酸は3価なので除く"] } },
      { "id": "p_c5_2_1_2", "label": "（２） ２価の塩基", "type": "short_answer", "correctAnswer": "ケ", "correctAnswerRate": 70,
        "detailedExplanation": { "theme": "塩基の価数の判定", "type": "知識再生型", "difficulty": 2, "steps": ["① 塩基が放出できる OH⁻ の数（価数）を確認する", "② 水酸化マグネシウム Mg(OH)₂ は2価", "③ KOH は1価、Al(OH)₃ は3価なので除く"] } },
      { "id": "p_c5_2_1_3", "label": "（３） 弱酸（すべて、記号順で）", "type": "short_answer", "correctAnswer": "イ、キ、ク", "correctAnswerRate": 65,
        "detailedExplanation": { "theme": "酸の強弱の判定", "type": "知識再生型", "difficulty": 2, "steps": ["① 強酸（HCl, HNO₃, H₂SO₄）を覚えておく", "② それ以外の酸は基本的に弱酸", "③ シュウ酸・酢酸・リン酸が弱酸に該当する"] } }
    ],
    "explanation": "▼解答・解説\n（１）１価の酸：ア（硝酸）、キ（酢酸）、コ（塩化水素）\n（２）２価の塩基：ケ（水酸化マグネシウム）\n（３）弱酸：イ（シュウ酸）、キ（酢酸）、ク（リン酸）\n\n強酸は HCl・HNO₃・H₂SO₄、強塩基は NaOH・KOH・Ca(OH)₂・Ba(OH)₂ が代表例。それ以外は弱酸・弱塩基と判断します。価数は放出できる H⁺（酸）・OH⁻（塩基）の数で決まります。",
    "surroundingKnowledge": [],
    "deepDiveTopics": []
  },
  {
    "id": "p_c5_2_2",
    "category": "⑤-2 酸と塩基の強さ",
    "text": "２ 酢酸０．１０ｍｏｌを水に溶かすと、水素イオンが０．００１０ｍｏｌ生じた。この酢酸の電離度を答えよ。",
    "subQuestions": [
      { "id": "p_c5_2_2_1", "label": "酢酸の電離度 α", "type": "short_answer", "correctAnswer": "0.010", "correctAnswerRate": 75,
        "detailedExplanation": { "theme": "電離度の計算", "type": "演繹型", "difficulty": 2, "steps": ["① 電離度 = 電離した酸の物質量 ÷ 溶かした酸の物質量", "② α = 0.0010 mol ÷ 0.10 mol", "③ α = 0.010"] } }
    ],
    "explanation": "▼解答・解説\n電離度 α ＝ \\frac{電離した分子の物質量}{溶かした分子の物質量} ＝ \\frac{0.0010 mol}{0.10 mol} ＝ 0.010\n\nよって、α ＝ 0.010",
    "surroundingKnowledge": [],
    "deepDiveTopics": []
  },
  {
    "id": "p_c5_2_3",
    "category": "⑤-2 酸と塩基の強さ",
    "text": "３ 酢酸ＣＨ₃ＣＯＯＨは１価の酸であり、アンモニアＮＨ₃は１価の塩基に分類される。\n\n（１） 酢酸分子の中には４つの水素原子Ｈが含まれるが、なぜ「１価」なのか。その理由を電離の機構に着目して簡潔に説明せよ。\n（２） アンモニア分子の中にはＯＨの構造がないにもかかわらず、なぜ「１価の塩基」に分類されるのか。「水分子」という語句を用いて簡潔に説明せよ。",
    "subQuestions": [
      { "id": "p_c5_2_3_1", "label": "（１） 酢酸が「１価」である理由", "type": "descriptive", "correctAnswer": "メチル基（−CH₃）の３つの水素原子は電離せず、カルボキシ基（−COOH）の水素原子１つだけが水素イオンとして電離するから。", "gradingCriteria": ["メチル基（−CH₃）の水素は電離しない", "カルボキシ基（−COOH）の水素１つだけが電離する"], "correctAnswerRate": 55,
        "detailedExplanation": { "theme": "電離の機構", "type": "概念説明型", "difficulty": 3, "steps": ["① 酢酸の構造 CH₃COOH を確認する", "② 電離するのはカルボキシ基 −COOH の H 1つのみ", "③ メチル基 −CH₃ の H 3つは電離しないため1価"] } },
      { "id": "p_c5_2_3_2", "label": "（２） アンモニアが「１価の塩基」である理由", "type": "descriptive", "correctAnswer": "アンモニア1分子が1つの水分子から水素イオンH⁺を１つ受け取り、１つの水酸化物イオンOH⁻を生成するから。", "gradingCriteria": ["水分子から H⁺ を1つ受け取る", "OH⁻ を1つ生じる"], "correctAnswerRate": 55,
        "detailedExplanation": { "theme": "ブレンステッド塩基", "type": "概念説明型", "difficulty": 3, "steps": ["① NH₃ + H₂O ⇄ NH₄⁺ + OH⁻ の反応を想起する", "② NH₃ 1分子が水分子から H⁺ を1つ受け取る", "③ 結果として OH⁻ を1つ生じるので1価の塩基"] } }
    ],
    "explanation": "▼解答・解説\n（１）メチル基（−CH₃）の３つの水素原子は電離せず、カルボキシ基（−COOH）の水素原子１つだけが水素イオンとして電離するから。\n（２）アンモニア1分子が1つの水分子から水素イオンH⁺を１つ受け取り、１つの水酸化物イオンOH⁻を生成するから。\n\n価数は「実際に電離（または授受）に関わる H の数」で決まります。分子中の H 原子の総数ではない点がポイントです。",
    "surroundingKnowledge": [],
    "deepDiveTopics": []
  },

  // ============================================================
  // ⑤-3 pHについて
  // ============================================================
  {
    "id": "p_c5_3_1",
    "category": "⑤-3 pHについて",
    "text": "１ 次の各水溶液の水素イオンの濃度を求めよ。ただし、強酸・強塩基は完全に電離しているものとし、水のイオン積 Kw を１．０×１０⁻¹⁴（ｍｏｌ/Ｌ）²とする。\n\n（１） ０．５０ｍｏｌ/Ｌの塩酸１０ｍＬを水でうすめて１００ｍＬにした水溶液\n（２） ０．１０ｍｏｌ/Ｌの水酸化バリウム水溶液\n（３） ０．４０ｍｏｌ/Ｌの酢酸水溶液（酢酸の電離度は０．０１０とする）\n（４） ０．２０ｍｏｌ/Ｌのアンモニア水（アンモニアの電離度は０．０２０とする）",
    "subQuestions": [
      { "id": "p_c5_3_1_1", "label": "（１） [H⁺]", "type": "short_answer", "correctAnswer": "5.0×10⁻² mol/L", "correctAnswerRate": 70,
        "detailedExplanation": { "theme": "希釈と水素イオン濃度", "type": "演繹型", "difficulty": 2, "steps": ["① うすめても物質量は不変：0.50×(10/1000)=0.0050 mol", "② 100 mL=0.10 L に溶けるので濃度=0.0050/0.10=0.050 mol/L", "③ 塩酸は1価の強酸なので [H⁺]=5.0×10⁻² mol/L"] } },
      { "id": "p_c5_3_1_2", "label": "（２） [H⁺]", "type": "short_answer", "correctAnswer": "5.0×10⁻¹⁴ mol/L", "correctAnswerRate": 60,
        "detailedExplanation": { "theme": "強塩基の水素イオン濃度", "type": "演繹型", "difficulty": 3, "steps": ["① Ba(OH)₂ は2価の強塩基：[OH⁻]=2×0.10=0.20 mol/L", "② Kw=[H⁺][OH⁻]=1.0×10⁻¹⁴ より [H⁺]=1.0×10⁻¹⁴/0.20", "③ [H⁺]=5.0×10⁻¹⁴ mol/L"] } },
      { "id": "p_c5_3_1_3", "label": "（３） [H⁺]", "type": "short_answer", "correctAnswer": "4.0×10⁻³ mol/L", "correctAnswerRate": 65,
        "detailedExplanation": { "theme": "弱酸の水素イオン濃度", "type": "演繹型", "difficulty": 2, "steps": ["① [H⁺]=価数×濃度×電離度", "② =1×0.40×0.010", "③ =4.0×10⁻³ mol/L"] } },
      { "id": "p_c5_3_1_4", "label": "（４） [H⁺]", "type": "short_answer", "correctAnswer": "2.5×10⁻¹² mol/L", "correctAnswerRate": 55,
        "detailedExplanation": { "theme": "弱塩基の水素イオン濃度", "type": "演繹型", "difficulty": 3, "steps": ["① [OH⁻]=価数×濃度×電離度=1×0.20×0.020=4.0×10⁻³ mol/L", "② [H⁺]=Kw/[OH⁻]=1.0×10⁻¹⁴/4.0×10⁻³", "③ [H⁺]=2.5×10⁻¹² mol/L"] } }
    ],
    "explanation": "▼解答・解説\n（１）うすめても溶けている HCl の物質量は変わらない。HCl の物質量＝0.50 mol/L×\\frac{10}{1000} L＝0.0050 mol。うすめた後の体積は100 mL＝0.10 L なので、\n［H⁺］＝\\frac{0.0050 mol}{0.10 L}＝5.0×10⁻² mol/L\n\n（２）Ba(OH)₂ は2価の強塩基なので、［OH⁻］＝2×0.10 mol/L＝0.20 mol/L。水のイオン積より、\n［H⁺］＝\\frac{1.0×10⁻¹⁴}{0.20}＝5.0×10⁻¹⁴ mol/L\n\n（３）酢酸は弱酸なので、電離度をかけて求める。\n［H⁺］＝価数×濃度×電離度＝1×0.40 mol/L×0.010＝4.0×10⁻³ mol/L\n\n（４）アンモニアは弱塩基なので、まず［OH⁻］を求める。\n［OH⁻］＝価数×濃度×電離度＝1×0.20 mol/L×0.020＝4.0×10⁻³ mol/L\n水のイオン積より、［H⁺］＝\\frac{1.0×10⁻¹⁴}{4.0×10⁻³}＝2.5×10⁻¹² mol/L",
    "surroundingKnowledge": [],
    "deepDiveTopics": []
  },
  {
    "id": "p_c5_3_2",
    "category": "⑤-3 pHについて",
    "text": "２ 次の各水溶液での水素イオン指数（ｐＨ）と液性を求めよ。\n\n（１） 水素イオン濃度［Ｈ⁺］が１．０×１０⁻³ｍｏｌ/Ｌの水溶液のｐＨと液性\n（２） 水酸化物イオン濃度［ＯＨ⁻］が１．０×１０⁻³ｍｏｌ/Ｌの水溶液のｐＨと液性",
    "subQuestions": [
      { "id": "p_c5_3_2_1a", "label": "（１） pH", "type": "short_answer", "correctAnswer": "3", "correctAnswerRate": 80,
        "detailedExplanation": { "theme": "pHの定義", "type": "演繹型", "difficulty": 1, "steps": ["① pH = −log₁₀[H⁺]", "② [H⁺]=1.0×10⁻³ なので pH=3", "③ "] } },
      { "id": "p_c5_3_2_1b", "label": "（１） 液性", "type": "multiple_choice", "options": ["酸性", "中性", "塩基性"], "correctAnswer": "酸性", "correctAnswerRate": 80,
        "detailedExplanation": { "theme": "液性の判定", "type": "演繹型", "difficulty": 1, "steps": ["① pH<7 なら酸性", "② pH=3 なので酸性", "③ "] } },
      { "id": "p_c5_3_2_2a", "label": "（２） pH", "type": "short_answer", "correctAnswer": "11", "correctAnswerRate": 70,
        "detailedExplanation": { "theme": "pHの計算（塩基）", "type": "演繹型", "difficulty": 2, "steps": ["① [OH⁻]=1.0×10⁻³ より [H⁺]=Kw/[OH⁻]=1.0×10⁻¹¹", "② pH=−log[H⁺]=11", "③ "] } },
      { "id": "p_c5_3_2_2b", "label": "（２） 液性", "type": "multiple_choice", "options": ["酸性", "中性", "塩基性"], "correctAnswer": "塩基性", "correctAnswerRate": 75,
        "detailedExplanation": { "theme": "液性の判定", "type": "演繹型", "difficulty": 1, "steps": ["① pH>7 なら塩基性", "② pH=11 なので塩基性", "③ "] } }
    ],
    "explanation": "▼解答・解説\n（１）［H⁺］＝1.0×10⁻³ mol/L なので、pH＝−log₁₀［H⁺］＝−log₁₀(1.0×10⁻³)＝3。pH<7 なので液性は【酸性】。\n\n（２）［OH⁻］＝1.0×10⁻³ mol/L なので、水のイオン積より\n［H⁺］＝\\frac{1.0×10⁻¹⁴}{1.0×10⁻³}＝1.0×10⁻¹¹ mol/L\nよって pH＝11。pH>7 なので液性は【塩基性】。",
    "surroundingKnowledge": [],
    "deepDiveTopics": []
  },
  {
    "id": "p_c5_3_3",
    "category": "⑤-3 pHについて",
    "text": "３ 次のｐＨの関係性についての問題に答えよ。\n\n（１） ｐＨが６の水溶液［Ｈ⁺］は、ｐＨが２の水溶液の［Ｈ⁺］の何倍か。\n（２） ｐＨが１の塩酸を水で１０００倍に薄めたときのｐＨを求めよ。\n（３） ｐＨが１３の水酸化ナトリウムを水で１００００倍に薄めたときのｐＨを求めよ。\n（４） ｐＨが９の水酸化ナトリウム水溶液を１０００倍に薄めたときのｐＨを求めよ。",
    "subQuestions": [
      { "id": "p_c5_3_3_1", "label": "（１） 何倍か", "type": "short_answer", "correctAnswer": "1/10000倍（10⁻⁴倍）", "correctAnswerRate": 65,
        "detailedExplanation": { "theme": "pHと[H⁺]の関係", "type": "演繹型", "difficulty": 2, "steps": ["① pH6 の [H⁺]=10⁻⁶、pH2 の [H⁺]=10⁻²", "② 比=10⁻⁶/10⁻²=10⁻⁴", "③ 1/10000倍（10⁻⁴倍）"] } },
      { "id": "p_c5_3_3_2", "label": "（２） pH", "type": "short_answer", "correctAnswer": "4", "correctAnswerRate": 70,
        "detailedExplanation": { "theme": "酸の希釈とpH", "type": "演繹型", "difficulty": 2, "steps": ["① pH1 の [H⁺]=10⁻¹、1000倍希釈で [H⁺]=10⁻¹/1000=10⁻⁴", "② pH=4", "③ 強酸なので pH7 を超えない（中性に近づくが超えない）"] } },
      { "id": "p_c5_3_3_3", "label": "（３） pH", "type": "short_answer", "correctAnswer": "9", "correctAnswerRate": 60,
        "detailedExplanation": { "theme": "塩基の希釈とpH", "type": "演繹型", "difficulty": 3, "steps": ["① pH13 → [OH⁻]=10⁻¹、10000倍希釈で [OH⁻]=10⁻¹/10⁴=10⁻⁵", "② [H⁺]=Kw/[OH⁻]=10⁻⁹ → pH=9", "③ 塩基を薄めても中性（pH7）より塩基側に留まる"] } },
      { "id": "p_c5_3_3_4", "label": "（４） pH", "type": "short_answer", "correctAnswer": "7に近づく（7より少し大きい）", "correctAnswerRate": 45,
        "detailedExplanation": { "theme": "薄い塩基の希釈の限界", "type": "概念区別型", "difficulty": 3, "steps": ["① pH9 の塩基は非常に薄い", "② 1000倍に薄めても、塩基を薄めて酸性（pH<7）になることはない", "③ 水の電離が効いてきて pH は7にほぼ近づく（7より少し大きい値に留まる）"] } }
    ],
    "explanation": "▼解答・解説\n（１）pH6 の［H⁺］は 1.0×10⁻⁶ mol/L、pH2 の［H⁺］は 1.0×10⁻² mol/L。その比は\n\\frac{10⁻⁶}{10⁻²}＝10⁻⁴＝\\frac{1}{10000} 倍\n\n（２）pH1 の塩酸は［H⁺］＝10⁻¹ mol/L。1000倍に薄めると［H⁺］＝\\frac{10⁻¹}{1000}＝10⁻⁴ mol/L。よって pH＝4。\n\n（３）pH13 の水酸化ナトリウムは［OH⁻］＝10⁻¹ mol/L。10000倍に薄めると［OH⁻］＝\\frac{10⁻¹}{10000}＝10⁻⁵ mol/L。水のイオン積より［H⁺］＝10⁻⁹ mol/L となり、pH＝9。\n\n（４）pH9 の水酸化ナトリウム水溶液を薄めても、塩基を薄めて酸性になることはない。水の電離の影響で pH は7に近づく（7より少し大きい値で止まる）。",
    "surroundingKnowledge": [],
    "deepDiveTopics": []
  },
  {
    "id": "p_c5_3_4",
    "category": "⑤-3 pHについて",
    "text": "４ 次の①〜⑤の中から正しいものをすべて選べ。\n\n① 塩基性の水溶液中には、水素イオンは存在しない。\n② 塩基性の水溶液中では、常に［Ｈ⁺］＜［ＯＨ⁻］である。\n③ ｐＨが８の水溶液の［Ｈ⁺］は、ｐＨが５の水溶液の［Ｈ⁺］の１０００倍である。\n④ ｐＨが１の強酸の水溶液とｐＨが３の強酸の水溶液を同じ体積ずつ混合するとｐＨは２になる。\n⑤ ｐＨが６の水溶液を１００倍に薄めたときのｐＨは８になる。",
    "subQuestions": [
      { "id": "p_c5_3_4_1", "label": "正しいものをすべて選べ", "type": "short_answer", "correctAnswer": "②", "correctAnswerRate": 50,
        "detailedExplanation": { "theme": "pH・液性の正誤判定", "type": "概念区別型", "difficulty": 3, "steps": ["① ①誤り：塩基性でも水の電離により水素イオンは必ず存在する", "② ②正しい：塩基性なら [H⁺]<[OH⁻]", "③ ③誤り（[H⁺]は1/1000倍）、④誤り（pHは単純平均にならない）、⑤誤り（酸を薄めても塩基性pH8にはならない）"] } }
    ],
    "explanation": "▼解答・解説\n【答え】②\n① 誤り：塩基性の水溶液中でも、水の自己電離により水素イオンはわずかに存在する。\n② 正しい：塩基性の水溶液では常に ［H⁺］＜［OH⁻］ が成り立つ。\n③ 誤り：pH8 の［H⁺］は pH5 の［H⁺］の \\frac{10⁻⁸}{10⁻⁵}＝10⁻³＝\\frac{1}{1000} 倍。1000倍ではない。\n④ 誤り：pH は［H⁺］の桁（けた）を表すので、足して2で割る単純な平均にはならない。\n⑤ 誤り：pH6 の水溶液を100倍に薄めても pH8（塩基性）にはならず、中性（pH7）に近づくだけである。",
    "surroundingKnowledge": [],
    "deepDiveTopics": []
  },
  {
    "id": "p_c5_3_5",
    "category": "⑤-3 pHについて",
    "text": "５ 次の各問いに答えよ。\n\n（１） ０℃・１．０１３×１０⁵Ｐａで１１２ｍＬのアンモニアを水に溶かして２００ｍＬの水溶液をつくった。この水溶液の水素イオン濃度はいくらか。アンモニアの電離度を０．０１０とし、水のイオン積をKw＝１．０×１０⁻¹⁴（ｍｏｌ/Ｌ）²とする。\n（２） ０．０４０ｍｏｌ/Ｌの酢酸水溶液のｐＨが３．０であった。この酢酸の電離度はいくらか。",
    "subQuestions": [
      { "id": "p_c5_3_5_1", "label": "（１） [H⁺]", "type": "short_answer", "correctAnswer": "4.0×10⁻¹¹ mol/L", "correctAnswerRate": 45,
        "detailedExplanation": { "theme": "気体の溶解と弱塩基のpH", "type": "演繹型", "difficulty": 3, "steps": ["① NH₃ の物質量＝112 mL×(1/22400 mL/mol)＝0.0050 mol", "② モル濃度＝0.0050/0.200 L＝0.025 mol/L、[OH⁻]＝1×0.025×0.010＝2.5×10⁻⁴ mol/L", "③ [H⁺]＝Kw/[OH⁻]＝1.0×10⁻¹⁴/2.5×10⁻⁴＝4.0×10⁻¹¹ mol/L"] } },
      { "id": "p_c5_3_5_2", "label": "（２） 酢酸の電離度 α", "type": "short_answer", "correctAnswer": "0.025", "correctAnswerRate": 55,
        "detailedExplanation": { "theme": "pHから電離度を求める", "type": "演繹型", "difficulty": 3, "steps": ["① pH3.0 より [H⁺]＝1.0×10⁻³ mol/L", "② [H⁺]＝価数×濃度×電離度 ＝ 1×0.040×α", "③ α＝1.0×10⁻³/0.040＝1/40＝0.025"] } }
    ],
    "explanation": "▼解答・解説\n（１）まず溶かしたアンモニアの物質量を求めると、\n112 mL×\\frac{1 L}{1000 mL}×\\frac{1 mol}{22.4 L}＝0.0050 mol\nこれが200 mL＝0.200 L に溶けているので、モル濃度は\n\\frac{0.0050 mol}{0.200 L}＝0.025 mol/L\nアンモニアは1価、電離度 α＝0.010 なので、\n［OH⁻］＝価数×濃度×電離度＝1×0.025 mol/L×0.010＝2.5×10⁻⁴ mol/L\n水のイオン積 ［H⁺］［OH⁻］＝1.0×10⁻¹⁴ より、\n［H⁺］＝\\frac{1.0×10⁻¹⁴}{2.5×10⁻⁴}＝4.0×10⁻¹¹ mol/L\n\n（２）pH＝3.0 なので、［H⁺］＝1.0×10⁻³ mol/L。\n［H⁺］＝価数×濃度×電離度α に代入すると、酢酸は1価、濃度は0.040 mol/L なので、\n1.0×10⁻³＝1×0.040×α\nα＝\\frac{1.0×10⁻³}{0.040}＝\\frac{1}{40}＝0.025",
    "surroundingKnowledge": [],
    "deepDiveTopics": []
  },
  {
    "id": "p_c5_3_6",
    "category": "⑤-3 pHについて",
    "text": "６ 次の混合水溶液のｐＨを、それぞれ整数で求めよ。ただし、強酸・強塩基は完全に電離するものとし、水のイオン積は ［Ｈ⁺］×［ＯＨ⁻］＝１．０×１０⁻¹⁴（ｍｏｌ／Ｌ）²とする。\n\n問１ ０．０１０ｍｏｌ／Ｌの塩酸（１価の強酸）１００ｍＬと、０．００５０ｍｏｌ／Ｌの硫酸（２価の強酸）１００ｍＬを混合し、さらに水を加えて全体を２００ｍＬにした水溶液のｐＨはいくらか。\n問２ ０．０１０ｍｏｌ／Ｌの水酸化ナトリウム水溶液（１価の強塩基）１００ｍＬと、０．００５０ｍｏｌ／Ｌの水酸化バリウム水溶液（２価の強塩基）１００ｍＬを混合し、さらに水を加えて全体を２００ｍＬにした水溶液のｐＨはいくらか。",
    "subQuestions": [
      { "id": "p_c5_3_6_1", "label": "問１ pH", "type": "short_answer", "correctAnswer": "2", "correctAnswerRate": 60,
        "detailedExplanation": { "theme": "混合水溶液のpH（酸＋酸）", "type": "演繹型", "difficulty": 3, "steps": ["① 塩酸の H⁺＝1×0.010×(100/1000)＝0.0010 mol、硫酸の H⁺＝2×0.0050×(100/1000)＝0.0010 mol", "② 合計 H⁺＝0.0020 mol、全体積200 mL＝0.20 L なので [H⁺]＝0.0020/0.20＝1.0×10⁻² mol/L", "③ pH＝2"] } },
      { "id": "p_c5_3_6_2", "label": "問２ pH", "type": "short_answer", "correctAnswer": "12", "correctAnswerRate": 55,
        "detailedExplanation": { "theme": "混合水溶液のpH（塩基＋塩基）", "type": "演繹型", "difficulty": 3, "steps": ["① NaOH の OH⁻＝1×0.010×(100/1000)＝0.0010 mol、Ba(OH)₂ の OH⁻＝2×0.0050×(100/1000)＝0.0010 mol", "② 合計 OH⁻＝0.0020 mol、[OH⁻]＝0.0020/0.20＝1.0×10⁻² mol/L", "③ [H⁺]＝Kw/[OH⁻]＝1.0×10⁻¹² → pH＝12"] } }
    ],
    "explanation": "▼解答・解説\n【問１の解答】pH＝2\n塩酸から生じる H⁺ の物質量は、1×0.010 mol/L×\\frac{100}{1000} L＝0.0010 mol。\n硫酸から生じる H⁺ の物質量は、2×0.0050 mol/L×\\frac{100}{1000} L＝0.0010 mol。\nこの2つを合わせると、0.0010＋0.0010＝0.0020 mol。全体積は200 mL＝0.20 L なので、\n［H⁺］＝\\frac{0.0020 mol}{0.20 L}＝1.0×10⁻² mol/L\nよって pH＝2。\n\n【問２の解答】pH＝12\n水酸化ナトリウムから生じる OH⁻ の物質量は、1×0.010 mol/L×\\frac{100}{1000} L＝0.0010 mol。\n水酸化バリウムから生じる OH⁻ の物質量は、2×0.0050 mol/L×\\frac{100}{1000} L＝0.0010 mol。\nこの2つを合わせると 0.0020 mol。全体積200 mL＝0.20 L なので、\n［OH⁻］＝\\frac{0.0020 mol}{0.20 L}＝1.0×10⁻² mol/L\n水のイオン積 ［H⁺］［OH⁻］＝1.0×10⁻¹⁴ より ［H⁺］＝1.0×10⁻¹² mol/L となるので、pH＝12。",
    "surroundingKnowledge": [],
    "deepDiveTopics": []
  },
  {
    "id": "p_c5_3_7",
    "category": "⑤-3 pHについて",
    "text": "７ 次の混合水溶液のｐＨを、それぞれ整数で求めよ。ただし、強酸・強塩基は完全に電離するものとし、水のイオン積は ［Ｈ⁺］×［ＯＨ⁻］＝１．０×１０⁻¹⁴（ｍｏｌ／Ｌ）²とする。\n\n問１ ０．１０ｍｏｌ／Ｌの塩酸６０ｍＬと、０．１０ｍｏｌ／Ｌの水酸化ナトリウム水溶液４０ｍＬを混合し、さらに水を加えて全体を２００ｍＬにした水溶液のｐＨはいくらか。\n問２ ０．０５０ｍｏｌ／Ｌの硫酸１００ｍＬと、０．３０ｍｏｌ／Ｌの水酸化ナトリウム水溶液１００ｍＬを混合した水溶液のｐＨはいくらか。\n問３ ０．０５０ｍｏｌ／Ｌの硫酸１００ｍＬと、０．１０ｍｏｌ／Ｌの水酸化ナトリウム水溶液１００ｍＬを混合した水溶液のｐＨはいくらか。",
    "subQuestions": [
      { "id": "p_c5_3_7_1", "label": "問１ pH", "type": "short_answer", "correctAnswer": "2", "correctAnswerRate": 55,
        "detailedExplanation": { "theme": "中和後の余りからpH（酸過剰）", "type": "演繹型", "difficulty": 3, "steps": ["① H⁺＝1×0.10×(60/1000)＝0.0060 mol、OH⁻＝1×0.10×(40/1000)＝0.0040 mol", "② 中和後 H⁺ が 0.0060−0.0040＝0.0020 mol 余る", "③ [H⁺]＝0.0020/0.20＝1.0×10⁻² mol/L → pH＝2"] } },
      { "id": "p_c5_3_7_2", "label": "問２ pH", "type": "short_answer", "correctAnswer": "12", "correctAnswerRate": 50,
        "detailedExplanation": { "theme": "中和後の余りからpH（塩基過剰）", "type": "演繹型", "difficulty": 3, "steps": ["① H⁺＝2×0.050×(100/1000)＝0.010 mol、OH⁻＝1×0.30×(100/1000)＝0.030 mol", "② 中和後 OH⁻ が 0.030−0.010＝0.020 mol 余る（全体積200 mL＝0.20 L）", "③ [OH⁻]＝0.020/0.20＝1.0×10⁻² mol/L → [H⁺]＝Kw/[OH⁻]＝1.0×10⁻¹² → pH＝12"] } },
      { "id": "p_c5_3_7_3", "label": "問３ pH", "type": "short_answer", "correctAnswer": "7", "correctAnswerRate": 55,
        "detailedExplanation": { "theme": "過不足なく中和したときのpH", "type": "概念区別型", "difficulty": 2, "steps": ["① H⁺＝2×0.050×(100/1000)＝0.010 mol、OH⁻＝1×0.10×(100/1000)＝0.010 mol", "② H⁺ と OH⁻ が過不足なく完全中和（ぴったり中和）", "③ 強酸＋強塩基の塩（硫酸ナトリウム）の水溶液は中性 → pH＝7"] } }
    ],
    "explanation": "▼解答・解説\n【問１の解答】pH＝2\n塩酸から生じる H⁺ の物質量は、1×0.10 mol/L×\\frac{60}{1000} L＝0.0060 mol。\n水酸化ナトリウムから生じる OH⁻ の物質量は、1×0.10 mol/L×\\frac{40}{1000} L＝0.0040 mol。\nH⁺ と OH⁻ は中和されるので、物質量の差 0.0060−0.0040＝0.0020 mol の H⁺ が余る。全体積200 mL＝0.20 L なので、\n［H⁺］＝\\frac{0.0020 mol}{0.20 L}＝1.0×10⁻² mol/L\nよって pH＝2。\n\n【問２の解答】pH＝12\n硫酸から生じる H⁺ の物質量は、2×0.050 mol/L×\\frac{100}{1000} L＝0.010 mol。\n水酸化ナトリウムから生じる OH⁻ の物質量は、1×0.30 mol/L×\\frac{100}{1000} L＝0.030 mol。\nH⁺ と OH⁻ は中和されるので、物質量の差 0.030−0.010＝0.020 mol の OH⁻ が余る。全体積200 mL＝0.20 L なので、\n［OH⁻］＝\\frac{0.0020 mol}{0.20 L}＝1.0×10⁻² mol/L\n水のイオン積 ［H⁺］［OH⁻］＝1.0×10⁻¹⁴ より ［H⁺］＝1.0×10⁻¹² mol/L となるので、pH＝12。\n\n【問３の解答】pH＝7\n硫酸から生じる H⁺ の物質量は、2×0.050 mol/L×\\frac{100}{1000} L＝0.010 mol。\n水酸化ナトリウムから生じる OH⁻ の物質量は、1×0.10 mol/L×\\frac{100}{1000} L＝0.010 mol。\n酸から出る H⁺（0.010 mol）と塩基から出る OH⁻（0.010 mol）が完全に等しいため、過不足なく「ぴったり中和」する。強酸（硫酸）と強塩基（水酸化ナトリウム）がぴったり中和してできる塩（硫酸ナトリウム）の水溶液は中性なので、pH＝7。",
    "surroundingKnowledge": [],
    "deepDiveTopics": []
  },
  {
    "id": "p_c5_3_8",
    "category": "⑤-3 pHについて",
    "text": "８ 酸や塩基に関する次の①〜⑤の記述のうち、内容が【正しいもの】を一つ選べ。\n\n① 水に溶かすとその水溶液が塩基性を示す化合物は、必ずその分子や組成式の中に水酸化物イオンを含んでいる。\n② １ｍｏｌ／Ｌの酸の水溶液１Ｌと、１ｍｏｌ／Ｌの塩基の水溶液１Ｌを完全に反応させたとき、混合水溶液の水素イオン濃度は、２５度において必ず１．０×１０⁻⁷ｍｏｌ／Ｌ（ｐＨ＝７）になる。\n③ 同じ弱酸の水溶液であれば、その弱酸の電離度は、水溶液のモル濃度が変わっても常に一定である。\n④ ｐＨが３の塩酸１００ｍＬと、ｐＨが５の塩酸１００ｍＬを混合した水溶液のｐＨは４である。\n⑤ ０．１ｍｏｌ／Ｌの酸の水溶液どうしを比較したとき、２価の酸の水溶液よりも１価の酸の水溶液のほうが、強い酸性（小さなｐＨ）を示すことがある。",
    "subQuestions": [
      { "id": "p_c5_3_8_1", "label": "正しいものを一つ選べ", "type": "short_answer", "correctAnswer": "⑤", "correctAnswerRate": 45,
        "detailedExplanation": { "theme": "酸・塩基の総合正誤判定", "type": "概念区別型", "difficulty": 4, "steps": ["① ①誤り：NH₃ のように OH⁻ を持たなくても塩基性を示す物質がある", "② ②誤り：価数を無視している（2価の酸と1価の塩基では酸が余り酸性になる）。③誤り：弱酸の電離度は薄いほど大きくなる。④誤り：pHは単純平均にならない（約3.3）", "③ ⑤正しい：酸の強さは価数ではなく電離度で決まる。1価の強酸（塩酸）は2価の弱酸（シュウ酸）より多くのH⁺を生じ、強い酸性を示すことがある"] } }
    ],
    "explanation": "▼解答・解説\n【答え】⑤\n① ［誤り］ アンモニア（NH₃）のように、自身の分子中に水酸化物イオン（OH⁻）を持たなくても、水分子と反応して水溶液中に OH⁻ を生じ、塩基性を示す物質があるため誤り。\n② ［誤り］ 酸や塩基の「価数」が考慮されていない。例えば2価の酸である硫酸と、1価の塩基である水酸化ナトリウムをこの割合で混ぜると、中和しきれずに酸が過剰に残り、水溶液は酸性（pHは7より小さく）になる。\n③ ［誤り］ 弱酸や弱塩基の電離度は、水溶液のモル濃度が小さく（薄く）なるほど、より多く電離する（電離度が大きくなる）という性質があるため、濃度によって変化する。\n④ ［誤り］ pH は水素イオン濃度の「桁（けた）」を表すため、足して2で割るような単純な平均にはならない。濃度に戻して計算すると、混合後の pH は約3.3（4よりも3に近い）になる。\n⑤ ［正しい］ 酸の強さ（pHの小ささ）は、価数ではなく「電離度の大きさ（強酸か弱酸か）」で決まる。同じモル濃度でも、2価の弱酸（シュウ酸など）はほとんど電離しないため、完全に電離する1価の強酸（塩酸など）のほうが多くの水素イオンを生じ、強い酸性を示す。",
    "surroundingKnowledge": [],
    "deepDiveTopics": []
  },
  {
    "id": "p_c5_3_9",
    "category": "⑤-3 pHについて",
    "text": "９ 次の（Ａ）〜（Ｄ）の４種類の水溶液について、下の問１、問２に答えよ。ただし、それぞれの水溶液のモル濃度はすべて ０．１０ｍｏｌ／Ｌ とし、強酸・強塩基は完全に電離するものとする。\n\n（Ａ） アンモニア水（弱塩基）　（Ｂ） 塩酸（強酸）　（Ｃ） 酢酸水溶液（弱酸）　（Ｄ） 水酸化ナトリウム水溶液（強塩基）\n\n問１ これらの水溶液の「水素イオン濃度（［Ｈ⁺］）」の大きい順（濃度が高い順）として正しいものを、次の①〜⑥の中から一つ選べ。\n問２ これらの水溶液の「水素イオン指数（ｐＨ）」の大きい順として正しいものを、次の①〜⑥の中から一つ選べ。\n\n① Ｂ＞Ｃ＞Ａ＞Ｄ　② Ｄ＞Ａ＞Ｃ＞Ｂ　③ Ｂ＝Ｃ＞Ａ＝Ｄ　④ Ｃ＞Ｂ＞Ｄ＞Ａ　⑤ Ａ＞Ｄ＞Ｂ＞Ｃ　⑥ Ｄ＞Ｂ＞Ｃ＞Ａ",
    "subQuestions": [
      { "id": "p_c5_3_9_1", "label": "問１ [H⁺]の大きい順", "type": "multiple_choice", "options": ["①", "②", "③", "④", "⑤", "⑥"], "correctAnswer": "①", "correctAnswerRate": 55,
        "detailedExplanation": { "theme": "[H⁺]の大小比較", "type": "演繹型", "difficulty": 3, "steps": ["① 水素イオン濃度は酸性が強いほど大きく、塩基性が強いほど小さい", "② 強酸B＞弱酸C＞弱塩基A＞強塩基D", "③ 選択肢は①"] } },
      { "id": "p_c5_3_9_2", "label": "問２ pHの大きい順", "type": "multiple_choice", "options": ["①", "②", "③", "④", "⑤", "⑥"], "correctAnswer": "②", "correctAnswerRate": 55,
        "detailedExplanation": { "theme": "pHの大小比較", "type": "演繹型", "difficulty": 3, "steps": ["① pH は塩基性が強いほど大きく、酸性が強いほど小さい", "② 強塩基D＞弱塩基A＞弱酸C＞強酸B", "③ 選択肢は②"] } }
    ],
    "explanation": "▼解答・解説\n問１ ①\n水素イオン濃度［H⁺］は、酸性が強いほど大きく、塩基性が強いほど小さくなる。したがって順番は、強酸（B）＞弱酸（C）＞弱塩基（A）＞強塩基（D）となり、選択肢は①。\n\n問２ ②\npH の数値は、塩基性が強いほど大きく（最大14）、酸性が強いほど小さく（最小0）なる。したがって順番は、強塩基（D）＞弱塩基（A）＞弱酸（C）＞強酸（B）となり、選択肢は②。",
    "surroundingKnowledge": [],
    "deepDiveTopics": []
  },

  // ============================================================
  // ⑤-4 中和とは何か
  // ============================================================
  {
    "id": "p_c5_4_1",
    "category": "⑤-4 中和とは何か",
    "text": "１ 次の中和反応を化学反応式で表せ。中和は完全に進むものとする。\n\n（１） 塩酸に水酸化ナトリウム水溶液を加える。\n（２） 硝酸水溶液に水酸化カリウム水溶液を加える。\n（３） 塩酸に水酸化カルシウム水溶液を加える。\n（４） 硫酸に水酸化ナトリウム水溶液を加える。",
    "subQuestions": [
      { "id": "p_c5_4_1_1", "label": "（１） 化学反応式", "type": "descriptive", "correctAnswer": "HCl + NaOH → NaCl + H₂O", "gradingCriteria": ["HCl + NaOH", "NaCl + H₂O", "係数が正しい"], "correctAnswerRate": 75,
        "detailedExplanation": { "theme": "中和反応式（H⁺+OH⁻→H₂O）", "type": "演繹型", "difficulty": 2, "steps": ["① 各物質の化学式を書く（HCl, NaOH）", "② H⁺ と OH⁻ から水を作る", "③ 残った Na⁺ と Cl⁻ で塩 NaCl を作る"] } },
      { "id": "p_c5_4_1_2", "label": "（２） 化学反応式", "type": "descriptive", "correctAnswer": "HNO₃ + KOH → KNO₃ + H₂O", "gradingCriteria": ["HNO₃ + KOH", "KNO₃ + H₂O", "係数が正しい"], "correctAnswerRate": 75,
        "detailedExplanation": { "theme": "中和反応式", "type": "演繹型", "difficulty": 2, "steps": ["① HNO₃, KOH を書く", "② H⁺ と OH⁻ で水を作る", "③ K⁺ と NO₃⁻ で塩 KNO₃ を作る"] } },
      { "id": "p_c5_4_1_3", "label": "（３） 化学反応式", "type": "descriptive", "correctAnswer": "2HCl + Ca(OH)₂ → CaCl₂ + 2H₂O", "gradingCriteria": ["2HCl + Ca(OH)₂", "CaCl₂ + 2H₂O", "係数2が正しい"], "correctAnswerRate": 65,
        "detailedExplanation": { "theme": "中和反応式（2価塩基）", "type": "演繹型", "difficulty": 2, "steps": ["① Ca(OH)₂ は OH⁻ を2つ持つので HCl が2分子必要", "② H⁺ 2つと OH⁻ 2つで H₂O 2分子", "③ Ca²⁺ と Cl⁻ で塩 CaCl₂ を作る"] } },
      { "id": "p_c5_4_1_4", "label": "（４） 化学反応式", "type": "descriptive", "correctAnswer": "H₂SO₄ + 2NaOH → Na₂SO₄ + 2H₂O", "gradingCriteria": ["H₂SO₄ + 2NaOH", "Na₂SO₄ + 2H₂O", "係数2が正しい"], "correctAnswerRate": 65,
        "detailedExplanation": { "theme": "中和反応式（2価酸）", "type": "演繹型", "difficulty": 2, "steps": ["① H₂SO₄ は H⁺ を2つ持つので NaOH が2分子必要", "② H⁺ 2つと OH⁻ 2つで H₂O 2分子", "③ Na⁺ 2つと SO₄²⁻ で塩 Na₂SO₄ を作る"] } }
    ],
    "explanation": "▼解答・解説\n中和反応式「H⁺ + OH⁻ → H₂O」の利用\n① 反応する物質のそれぞれの化学式を書く\n② H⁺ + OH⁻ → H₂O を用いて、①の化学式に H⁺ と OH⁻ がいくつあるかを見つける\n③ ①、②から水をつくり、残りの陽イオンと陰イオンで塩をつくる\n\n（１）HCl + NaOH → NaCl + H₂O\n（２）HNO₃ + KOH → KNO₃ + H₂O\n（３）2HCl + Ca(OH)₂ → CaCl₂ + 2H₂O\n（４）H₂SO₄ + 2NaOH → Na₂SO₄ + 2H₂O",
    "surroundingKnowledge": [],
    "deepDiveTopics": []
  },
  {
    "id": "p_c5_4_2",
    "category": "⑤-4 中和とは何か",
    "text": "２ 次の中和反応を化学反応式で表せ。中和は完全に進むものとする。\n\n（１） 酢酸水溶液に水酸化カルシウム水溶液を加える。\n（２） 硫酸に水酸化アルミニウムを加える。\n（３） 塩酸にアンモニア水を加える。",
    "subQuestions": [
      { "id": "p_c5_4_2_1", "label": "（１） 化学反応式", "type": "descriptive", "correctAnswer": "2CH₃COOH + Ca(OH)₂ → (CH₃COO)₂Ca + 2H₂O", "gradingCriteria": ["2CH₃COOH + Ca(OH)₂", "(CH₃COO)₂Ca + 2H₂O", "係数2が正しい"], "correctAnswerRate": 55,
        "detailedExplanation": { "theme": "弱酸＋2価塩基の中和", "type": "演繹型", "difficulty": 3, "steps": ["① Ca(OH)₂ は OH⁻ 2つ、酢酸は H⁺ 1つなので酢酸2分子", "② H⁺ 2つと OH⁻ 2つで H₂O 2分子", "③ Ca²⁺ と CH₃COO⁻ 2つで塩 (CH₃COO)₂Ca"] } },
      { "id": "p_c5_4_2_2", "label": "（２） 化学反応式", "type": "descriptive", "correctAnswer": "3H₂SO₄ + 2Al(OH)₃ → Al₂(SO₄)₃ + 6H₂O", "gradingCriteria": ["3H₂SO₄ + 2Al(OH)₃", "Al₂(SO₄)₃ + 6H₂O", "係数が正しい"], "correctAnswerRate": 40,
        "detailedExplanation": { "theme": "2価酸＋3価塩基の中和", "type": "演繹型", "difficulty": 4, "steps": ["① H₂SO₄ は H⁺2つ、Al(OH)₃ は OH⁻3つ", "② H⁺ と OH⁻ の数を合わせる（最小公倍数6）→ 硫酸3、Al(OH)₃ 2", "③ 水6分子、塩は Al₂(SO₄)₃"] } },
      { "id": "p_c5_4_2_3", "label": "（３） 化学反応式", "type": "descriptive", "correctAnswer": "HCl + NH₃ → NH₄Cl", "gradingCriteria": ["HCl + NH₃", "NH₄Cl（塩のみ生成）", "水ができない点"], "correctAnswerRate": 55,
        "detailedExplanation": { "theme": "OH⁻を含まない塩基の中和", "type": "概念区別型", "difficulty": 3, "steps": ["① アンモニアは OH⁻ を含まない塩基", "② NH₃ が H⁺ を受け取って NH₄⁺ になる", "③ 水はできず、塩 NH₄Cl のみ生成する"] } }
    ],
    "explanation": "▼解答・解説\n中和反応式「H⁺ + OH⁻ → H₂O」の利用\n① 反応する物質のそれぞれの化学式を書く\n② H⁺ + OH⁻ → H₂O を用いて、①の化学式に H⁺ と OH⁻ がいくつあるかを見つける\n③ ①、②から水をつくり、残りの陽イオンと陰イオンで塩をつくる\n\n（１）2CH₃COOH + Ca(OH)₂ → (CH₃COO)₂Ca + 2H₂O\n（２）3H₂SO₄ + 2Al(OH)₃ → Al₂(SO₄)₃ + 6H₂O\n（３）HCl + NH₃ → NH₄Cl\n　※ アンモニアは OH⁻ を含まない塩基なので、水はできず塩のみが生成する。",
    "surroundingKnowledge": [],
    "deepDiveTopics": []
  },
  {
    "id": "p_c5_4_3",
    "category": "⑤-4 中和とは何か",
    "text": "３ 次の塩が中和で生じたものとして、もとになった「酸」と「塩基」の名称をそれぞれ答えよ。\n\n（１） 塩化ナトリウム　（２） 硫酸カリウム　（３） 硝酸カルシウム　（４） 酢酸ナトリウム\n（５） 硫酸アンモニウム　（６） 塩化銅（II）　（７） 炭酸カルシウム　（８） 硫化鉄（II）",
    "subQuestions": [
      { "id": "p_c5_4_3_1", "label": "（１） 塩化ナトリウム の 酸・塩基", "type": "descriptive", "correctAnswer": "酸：塩酸、塩基：水酸化ナトリウム", "gradingCriteria": ["酸：塩酸", "塩基：水酸化ナトリウム"], "correctAnswerRate": 75,
        "detailedExplanation": { "theme": "塩から酸・塩基を逆算", "type": "演繹型", "difficulty": 2, "steps": ["① 陽イオン Na⁺ に OH⁻ をつけて塩基 NaOH", "② 陰イオン Cl⁻ に H⁺ をつけて酸 HCl", "③ 酸：塩酸、塩基：水酸化ナトリウム"] } },
      { "id": "p_c5_4_3_2", "label": "（２） 硫酸カリウム の 酸・塩基", "type": "descriptive", "correctAnswer": "酸：硫酸、塩基：水酸化カリウム", "gradingCriteria": ["酸：硫酸", "塩基：水酸化カリウム"], "correctAnswerRate": 75,
        "detailedExplanation": { "theme": "塩から酸・塩基を逆算", "type": "演繹型", "difficulty": 2, "steps": ["① K⁺ → KOH", "② SO₄²⁻ → H₂SO₄", "③ 酸：硫酸、塩基：水酸化カリウム"] } },
      { "id": "p_c5_4_3_3", "label": "（３） 硝酸カルシウム の 酸・塩基", "type": "descriptive", "correctAnswer": "酸：硝酸、塩基：水酸化カルシウム", "gradingCriteria": ["酸：硝酸", "塩基：水酸化カルシウム"], "correctAnswerRate": 75,
        "detailedExplanation": { "theme": "塩から酸・塩基を逆算", "type": "演繹型", "difficulty": 2, "steps": ["① Ca²⁺ → Ca(OH)₂", "② NO₃⁻ → HNO₃", "③ 酸：硝酸、塩基：水酸化カルシウム"] } },
      { "id": "p_c5_4_3_4", "label": "（４） 酢酸ナトリウム の 酸・塩基", "type": "descriptive", "correctAnswer": "酸：酢酸、塩基：水酸化ナトリウム", "gradingCriteria": ["酸：酢酸", "塩基：水酸化ナトリウム"], "correctAnswerRate": 70,
        "detailedExplanation": { "theme": "塩から酸・塩基を逆算", "type": "演繹型", "difficulty": 2, "steps": ["① Na⁺ → NaOH", "② CH₃COO⁻ → CH₃COOH", "③ 酸：酢酸、塩基：水酸化ナトリウム"] } },
      { "id": "p_c5_4_3_5", "label": "（５） 硫酸アンモニウム の 酸・塩基", "type": "descriptive", "correctAnswer": "酸：硫酸、塩基：アンモニア", "gradingCriteria": ["酸：硫酸", "塩基：アンモニア"], "correctAnswerRate": 65,
        "detailedExplanation": { "theme": "塩から酸・塩基を逆算", "type": "演繹型", "difficulty": 2, "steps": ["① NH₄⁺ → NH₃（アンモニア）", "② SO₄²⁻ → H₂SO₄", "③ 酸：硫酸、塩基：アンモニア"] } },
      { "id": "p_c5_4_3_6", "label": "（６） 塩化銅（II） の 酸・塩基", "type": "descriptive", "correctAnswer": "酸：塩酸、塩基：水酸化銅（II）", "gradingCriteria": ["酸：塩酸", "塩基：水酸化銅（II）"], "correctAnswerRate": 60,
        "detailedExplanation": { "theme": "塩から酸・塩基を逆算", "type": "演繹型", "difficulty": 2, "steps": ["① Cu²⁺ → Cu(OH)₂", "② Cl⁻ → HCl", "③ 酸：塩酸、塩基：水酸化銅（II）"] } },
      { "id": "p_c5_4_3_7", "label": "（７） 炭酸カルシウム の 酸・塩基", "type": "descriptive", "correctAnswer": "酸：炭酸、塩基：水酸化カルシウム", "gradingCriteria": ["酸：炭酸", "塩基：水酸化カルシウム"], "correctAnswerRate": 60,
        "detailedExplanation": { "theme": "塩から酸・塩基を逆算", "type": "演繹型", "difficulty": 2, "steps": ["① Ca²⁺ → Ca(OH)₂", "② CO₃²⁻ → H₂CO₃（炭酸）", "③ 酸：炭酸、塩基：水酸化カルシウム"] } },
      { "id": "p_c5_4_3_8", "label": "（８） 硫化鉄（II） の 酸・塩基", "type": "descriptive", "correctAnswer": "酸：硫化水素、塩基：水酸化鉄（II）", "gradingCriteria": ["酸：硫化水素", "塩基：水酸化鉄（II）"], "correctAnswerRate": 50,
        "detailedExplanation": { "theme": "塩から酸・塩基を逆算", "type": "演繹型", "difficulty": 3, "steps": ["① Fe²⁺ → Fe(OH)₂", "② S²⁻ → H₂S（硫化水素）", "③ 酸：硫化水素、塩基：水酸化鉄（II）"] } }
    ],
    "explanation": "▼解答・解説\n構成している塩の陽イオンに OH⁻、陰イオンに H⁺ をつければ、もとの塩基・酸がわかる。\n（１）酸：塩酸　、　塩基：水酸化ナトリウム\n（２）酸：硫酸　、　塩基：水酸化カリウム\n（３）酸：硝酸　、　塩基：水酸化カルシウム\n（４）酸：酢酸　、　塩基：水酸化ナトリウム\n（５）酸：硫酸　、　塩基：アンモニア\n（６）酸：塩酸　、　塩基：水酸化銅（II）\n（７）酸：炭酸　、　塩基：水酸化カルシウム\n（８）酸：硫化水素　、　塩基：水酸化鉄（II）",
    "surroundingKnowledge": [],
    "deepDiveTopics": []
  },
  {
    "id": "p_c5_4_4",
    "category": "⑤-4 中和とは何か",
    "text": "４ 次の（１）〜（５）の各塩を、正塩、酸性塩、塩基性塩に分類せよ。\n\n（１） KHCO₃　（２） CH₃COONa　（３） CaCl(OH)　（４） (NH₄)₂SO₄　（５） KH₂PO₄",
    "subQuestions": [
      { "id": "p_c5_4_4_1", "label": "（１） KHCO₃", "type": "multiple_choice", "options": ["正塩", "酸性塩", "塩基性塩"], "correctAnswer": "酸性塩", "correctAnswerRate": 60,
        "detailedExplanation": { "theme": "塩の分類", "type": "概念区別型", "difficulty": 2, "steps": ["① 化学式に H（酸由来）が残っているか確認", "② KHCO₃ は H を含む", "③ 酸性塩"] } },
      { "id": "p_c5_4_4_2", "label": "（２） CH₃COONa", "type": "multiple_choice", "options": ["正塩", "酸性塩", "塩基性塩"], "correctAnswer": "正塩", "correctAnswerRate": 55,
        "detailedExplanation": { "theme": "塩の分類", "type": "概念区別型", "difficulty": 3, "steps": ["① CH₃COO⁻ の H はカルボキシ基の一部で電離済み（H⁺ではない）", "② 化学式に酸の H も塩基の OH も残らない", "③ 正塩"] } },
      { "id": "p_c5_4_4_3", "label": "（３） CaCl(OH)", "type": "multiple_choice", "options": ["正塩", "酸性塩", "塩基性塩"], "correctAnswer": "塩基性塩", "correctAnswerRate": 60,
        "detailedExplanation": { "theme": "塩の分類", "type": "概念区別型", "difficulty": 2, "steps": ["① 化学式に OH（塩基由来）が残っているか確認", "② CaCl(OH) は OH を含む", "③ 塩基性塩"] } },
      { "id": "p_c5_4_4_4", "label": "（４） (NH₄)₂SO₄", "type": "multiple_choice", "options": ["正塩", "酸性塩", "塩基性塩"], "correctAnswer": "正塩", "correctAnswerRate": 55,
        "detailedExplanation": { "theme": "塩の分類", "type": "概念区別型", "difficulty": 3, "steps": ["① NH₄⁺ の H は陽イオンの一部（H⁺ではない）", "② 酸の H も塩基の OH も残らない", "③ 正塩"] } },
      { "id": "p_c5_4_4_5", "label": "（５） KH₂PO₄", "type": "multiple_choice", "options": ["正塩", "酸性塩", "塩基性塩"], "correctAnswer": "酸性塩", "correctAnswerRate": 55,
        "detailedExplanation": { "theme": "塩の分類", "type": "概念区別型", "difficulty": 2, "steps": ["① 化学式に H（酸由来）が残っているか確認", "② KH₂PO₄ は H を2つ含む", "③ 酸性塩"] } }
    ],
    "explanation": "▼解答・解説\n・正塩：（２）CH₃COONa、（４）(NH₄)₂SO₄\n・酸性塩：（１）KHCO₃、（５）KH₂PO₄\n・塩基性塩：（３）CaCl(OH)\n\n【塩の分類】\n・酸性塩：化学式に酸由来の H⁺ を含む塩（NaHSO₄、NaHCO₃、KH₂PO₄ など）\n・塩基性塩：化学式に塩基由来の OH⁻ を含む塩（MgCl(OH)、CuCl(OH) など）\n・正塩：上のどちらも含まない塩（NaCl、Na₂SO₄、KNO₃、CH₃COONa など）\n　※ NH₄Cl は NH₄⁺ で1つ（H⁺ではない）なので正塩。CH₃COONa も CH₃COO⁻ で1つ（H⁺ではない）なので正塩。",
    "surroundingKnowledge": [],
    "deepDiveTopics": []
  },
  {
    "id": "p_c5_4_5",
    "category": "⑤-4 中和とは何か",
    "text": "５ 次の酸化物（ア）〜（エ）について、下の各問いに答えよ。\n\n（ア） CO₂　（イ） BaO　（ウ） Na₂O　（エ） SO₃\n\n（１） （ア）〜（エ）の酸化物を、酸性酸化物と塩基性酸化物に分類せよ。\n（２） （ア）〜（ウ）の酸化物について、水（H₂O）との反応を化学反応式で表せ。",
    "subQuestions": [
      { "id": "p_c5_4_5_1a", "label": "（１） 酸性酸化物（記号で）", "type": "short_answer", "correctAnswer": "ア、エ", "correctAnswerRate": 65,
        "detailedExplanation": { "theme": "酸化物の分類", "type": "概念区別型", "difficulty": 2, "steps": ["① 非金属元素の酸化物は酸性酸化物", "② CO₂（炭素）、SO₃（硫黄）は非金属", "③ 酸性酸化物：ア、エ"] } },
      { "id": "p_c5_4_5_1b", "label": "（１） 塩基性酸化物（記号で）", "type": "short_answer", "correctAnswer": "イ、ウ", "correctAnswerRate": 65,
        "detailedExplanation": { "theme": "酸化物の分類", "type": "概念区別型", "difficulty": 2, "steps": ["① 金属元素の酸化物は塩基性酸化物", "② BaO（バリウム）、Na₂O（ナトリウム）は金属", "③ 塩基性酸化物：イ、ウ"] } },
      { "id": "p_c5_4_5_2a", "label": "（２）（ア） CO₂ ＋ H₂O", "type": "descriptive", "correctAnswer": "CO₂ + H₂O → H₂CO₃", "gradingCriteria": ["CO₂ + H₂O", "H₂CO₃"], "correctAnswerRate": 60,
        "detailedExplanation": { "theme": "酸性酸化物＋水→オキソ酸", "type": "演繹型", "difficulty": 2, "steps": ["① 非金属酸化物＋水→オキソ酸", "② CO₂ + H₂O → H₂CO₃", "③ 炭酸が生じる"] } },
      { "id": "p_c5_4_5_2b", "label": "（２）（イ） BaO ＋ H₂O", "type": "descriptive", "correctAnswer": "BaO + H₂O → Ba(OH)₂", "gradingCriteria": ["BaO + H₂O", "Ba(OH)₂"], "correctAnswerRate": 60,
        "detailedExplanation": { "theme": "塩基性酸化物＋水→水酸化物", "type": "演繹型", "difficulty": 2, "steps": ["① 金属酸化物＋水→水酸化物", "② BaO + H₂O → Ba(OH)₂", "③ 水酸化バリウムが生じる"] } },
      { "id": "p_c5_4_5_2c", "label": "（２）（ウ） Na₂O ＋ H₂O", "type": "descriptive", "correctAnswer": "Na₂O + H₂O → 2NaOH", "gradingCriteria": ["Na₂O + H₂O", "2NaOH", "係数2が正しい"], "correctAnswerRate": 60,
        "detailedExplanation": { "theme": "塩基性酸化物＋水→水酸化物", "type": "演繹型", "difficulty": 2, "steps": ["① 金属酸化物＋水→水酸化物", "② Na₂O + H₂O → 2NaOH", "③ 水酸化ナトリウムが2分子生じる"] } }
    ],
    "explanation": "▼解答・解説\n（１）・酸性酸化物：（ア）CO₂、（エ）SO₃　・塩基性酸化物：（イ）BaO、（ウ）Na₂O\n　一般に、非金属元素の酸化物は酸性酸化物、金属元素の酸化物は塩基性酸化物。（Al・Zn・Sn・Pb は両性酸化物：「ア・ア・スン・ナリと両性に愛される」）\n（２）（ア）CO₂ + H₂O → H₂CO₃／（イ）BaO + H₂O → Ba(OH)₂／（ウ）Na₂O + H₂O → 2NaOH\n　酸性酸化物＋水→オキソ酸、塩基性酸化物＋水→水酸化物。",
    "surroundingKnowledge": [],
    "deepDiveTopics": []
  },
  {
    "id": "p_c5_4_6",
    "category": "⑤-4 中和とは何か",
    "text": "６ 次に示した（ア）〜（カ）の各物質を水に溶かしたとき、その水溶液が酸性、中性、塩基性を示す物質に分類し、それぞれ化学式で示せ。\n\n（ア） 塩化アンモニウム　（イ） 硝酸ナトリウム　（ウ） 硫酸水素カリウム\n（エ） 硫酸カリウム　（オ） 炭酸水素ナトリウム　（カ） 酢酸ナトリウム",
    "subQuestions": [
      { "id": "p_c5_4_6_a", "label": "酸性を示す物質（化学式、記号順）", "type": "short_answer", "correctAnswer": "（ア）NH₄Cl、（ウ）KHSO₄", "correctAnswerRate": 50,
        "detailedExplanation": { "theme": "塩の液性", "type": "概念区別型", "difficulty": 3, "steps": ["① 正塩は「もとの酸・塩基の強弱」で液性を決める：強酸＋弱塩基→酸性", "② NH₄Cl（HCl＋NH₃）は強酸＋弱塩基で酸性", "③ KHSO₄ は酸性塩（強酸由来のHを残す）で酸性"] } },
      { "id": "p_c5_4_6_b", "label": "中性を示す物質（化学式、記号順）", "type": "short_answer", "correctAnswer": "（イ）NaNO₃、（エ）K₂SO₄", "correctAnswerRate": 50,
        "detailedExplanation": { "theme": "塩の液性", "type": "概念区別型", "difficulty": 3, "steps": ["① 強酸＋強塩基の正塩は中性", "② NaNO₃（HNO₃＋NaOH）は中性", "③ K₂SO₄（H₂SO₄＋KOH）は中性"] } },
      { "id": "p_c5_4_6_c", "label": "塩基性を示す物質（化学式、記号順）", "type": "short_answer", "correctAnswer": "（オ）NaHCO₃、（カ）CH₃COONa", "correctAnswerRate": 50,
        "detailedExplanation": { "theme": "塩の液性", "type": "概念区別型", "difficulty": 3, "steps": ["① 弱酸＋強塩基の塩は塩基性", "② CH₃COONa（CH₃COOH＋NaOH）は塩基性", "③ NaHCO₃ は酸性塩だが「強塩基＋弱酸」なので例外的に塩基性"] } }
    ],
    "explanation": "▼解答・解説\n・酸性を示す物質：（ア）NH₄Cl、（ウ）KHSO₄\n・中性を示す物質：（イ）NaNO₃、（エ）K₂SO₄\n・塩基性を示す物質：（オ）NaHCO₃、（カ）CH₃COONa\n\n【塩の液性の見分け方】\n１．正塩 → もとの酸・塩基の強弱で判断：強酸＋強塩基＝中性／強酸＋弱塩基＝酸性／弱酸＋強塩基＝塩基性／弱酸＋弱塩基＝中性に近い。\n２．酸性塩・塩基性塩 → 基本は酸性塩→酸性、塩基性塩→塩基性。ただし例外：酸性塩で「強塩基＋弱酸」のときのみ塩基性（例 NaHCO₃）、塩基性塩で「強酸＋弱塩基」のときのみ酸性（例 CuCl(OH)）。",
    "surroundingKnowledge": [],
    "deepDiveTopics": []
  },
  {
    "id": "p_c5_4_7",
    "category": "⑤-4 中和とは何か",
    "text": "７ 次に示した（１）〜（４）の操作を行ったとき、反応が進行する場合はその化学反応式を、反応しない場合は×を記せ。\n\n（１） 塩化アンモニウムと水酸化ナトリウムを混合して加熱する。\n（２） 塩化カリウム水溶液に酢酸水溶液を加える。\n（３） 炭酸ナトリウムに希塩酸を加える。\n（４） 硫化鉄（II）に希塩酸を加える。",
    "subQuestions": [
      { "id": "p_c5_4_7_1", "label": "（１）", "type": "descriptive", "correctAnswer": "NH₄Cl + NaOH → NaCl + H₂O + NH₃", "gradingCriteria": ["NH₄Cl + NaOH", "NaCl + H₂O + NH₃", "弱塩基の遊離"], "correctAnswerRate": 50,
        "detailedExplanation": { "theme": "弱塩基の遊離", "type": "演繹型", "difficulty": 3, "steps": ["① 弱塩基の塩＋強塩基→弱塩基＋強塩基の塩", "② NH₄Cl + NaOH → NaCl + H₂O + NH₃", "③ アンモニア（弱塩基）が遊離する"] } },
      { "id": "p_c5_4_7_2", "label": "（２）", "type": "descriptive", "correctAnswer": "×（反応しない）", "gradingCriteria": ["× / 反応しない"], "correctAnswerRate": 55,
        "detailedExplanation": { "theme": "反応の進行判定", "type": "概念区別型", "difficulty": 3, "steps": ["① 弱酸の遊離が起こるには「弱酸の塩＋強酸」が必要", "② KCl は強酸（塩酸）の塩、酢酸は弱酸で組合せが逆", "③ 反応は進行しない → ×"] } },
      { "id": "p_c5_4_7_3", "label": "（３）", "type": "descriptive", "correctAnswer": "Na₂CO₃ + 2HCl → 2NaCl + H₂O + CO₂", "gradingCriteria": ["Na₂CO₃ + 2HCl", "2NaCl + H₂O + CO₂", "係数2が正しい"], "correctAnswerRate": 55,
        "detailedExplanation": { "theme": "弱酸の遊離", "type": "演繹型", "difficulty": 3, "steps": ["① 弱酸（炭酸）の塩＋強酸（塩酸）→弱酸＋強酸の塩", "② 炭酸 H₂CO₃ は分解して H₂O + CO₂", "③ Na₂CO₃ + 2HCl → 2NaCl + H₂O + CO₂"] } },
      { "id": "p_c5_4_7_4", "label": "（４）", "type": "descriptive", "correctAnswer": "FeS + 2HCl → FeCl₂ + H₂S", "gradingCriteria": ["FeS + 2HCl", "FeCl₂ + H₂S", "係数2が正しい"], "correctAnswerRate": 50,
        "detailedExplanation": { "theme": "弱酸の遊離", "type": "演繹型", "difficulty": 3, "steps": ["① 弱酸（硫化水素）の塩＋強酸（塩酸）→弱酸＋強酸の塩", "② H₂S（硫化水素）が遊離する", "③ FeS + 2HCl → FeCl₂ + H₂S"] } }
    ],
    "explanation": "▼解答・解説\n（１）NH₄Cl + NaOH → NaCl + H₂O + NH₃（弱塩基の遊離：弱塩基の塩＋強塩基→弱塩基＋強塩基の塩）\n（２）×（反応しない）：弱酸の塩＋強酸の組合せになっていないため。\n（３）Na₂CO₃ + 2HCl → 2NaCl + H₂O + CO₂（弱酸の遊離。炭酸は H₂O + CO₂ に分解）\n（４）FeS + 2HCl → FeCl₂ + H₂S（弱酸の遊離。硫化水素が発生）",
    "surroundingKnowledge": [],
    "deepDiveTopics": []
  },
  {
    "id": "p_c5_4_8",
    "category": "⑤-4 中和とは何か",
    "text": "８ 次に示した（１）、（２）の操作を行ったとき、進行する反応の化学反応式を記せ。また、この反応によって発生する、特有の刺激臭をもつ気体の名称をそれぞれ答えよ。\n\n（１） 塩化ナトリウム（固）に濃硫酸を加えて加熱する。\n（２） 硝酸カリウム（固）に濃硫酸を加えて加熱する。",
    "subQuestions": [
      { "id": "p_c5_4_8_1a", "label": "（１） 化学反応式", "type": "descriptive", "correctAnswer": "NaCl + H₂SO₄ → NaHSO₄ + HCl", "gradingCriteria": ["NaCl + H₂SO₄", "NaHSO₄ + HCl"], "correctAnswerRate": 45,
        "detailedExplanation": { "theme": "揮発性の酸の遊離", "type": "演繹型", "difficulty": 4, "steps": ["① 揮発性酸の塩＋不揮発性酸→揮発性酸＋不揮発性酸の塩", "② NaCl（揮発性酸HClの塩）＋H₂SO₄（不揮発性酸）", "③ NaCl + H₂SO₄ → NaHSO₄ + HCl"] } },
      { "id": "p_c5_4_8_1b", "label": "（１） 発生する気体の名称", "type": "short_answer", "correctAnswer": "塩化水素", "correctAnswerRate": 55,
        "detailedExplanation": { "theme": "揮発性の酸の遊離", "type": "知識再生型", "difficulty": 2, "steps": ["① HCl は揮発性の酸（気体になりやすい）", "② 加熱で塩化水素が気体として発生", "③ 名称：塩化水素"] } },
      { "id": "p_c5_4_8_2a", "label": "（２） 化学反応式", "type": "descriptive", "correctAnswer": "KNO₃ + H₂SO₄ → KHSO₄ + HNO₃", "gradingCriteria": ["KNO₃ + H₂SO₄", "KHSO₄ + HNO₃"], "correctAnswerRate": 45,
        "detailedExplanation": { "theme": "揮発性の酸の遊離", "type": "演繹型", "difficulty": 4, "steps": ["① 揮発性酸の塩＋不揮発性酸→揮発性酸＋不揮発性酸の塩", "② KNO₃（揮発性酸HNO₃の塩）＋H₂SO₄（不揮発性酸）", "③ KNO₃ + H₂SO₄ → KHSO₄ + HNO₃"] } },
      { "id": "p_c5_4_8_2b", "label": "（２） 発生する気体の名称", "type": "short_answer", "correctAnswer": "硝酸（の蒸気）", "correctAnswerRate": 50,
        "detailedExplanation": { "theme": "揮発性の酸の遊離", "type": "知識再生型", "difficulty": 2, "steps": ["① HNO₃ は揮発性の酸", "② 加熱で硝酸の蒸気が発生", "③ 名称：硝酸（の蒸気）"] } }
    ],
    "explanation": "▼解答・解説\n（１）NaCl + H₂SO₄ → NaHSO₄ + HCl　気体の名称：塩化水素\n（２）KNO₃ + H₂SO₄ → KHSO₄ + HNO₃　気体の名称：硝酸（の蒸気）\n\n【揮発性の酸の遊離】揮発性酸の塩＋不揮発性酸→揮発性酸＋不揮発性酸の塩。\n・揮発性の酸：HCl、HNO₃、CH₃COOH（常温でも気体になりやすい）\n・不揮発性の酸：H₂SO₄、(COOH)₂（気体になりにくい）",
    "surroundingKnowledge": [],
    "deepDiveTopics": []
  },

  // ============================================================
  // ⑤-5 中和の計算
  // ============================================================
  {
    "id": "p_c5_5_1",
    "category": "⑤-5 中和の計算",
    "text": "１ 次の各問いに答えよ。\n\n（１） ０．１０ｍｏｌ／Ｌの塩酸（１価の強酸）２０ｍＬを完全に中和するのに必要な、０．０５０ｍｏｌ／Ｌの水酸化ナトリウム水溶液（１価の強塩基）は何ｍＬか。\n（２） ０．２０ｍｏｌ／Ｌのアンモニア水（１価の弱塩基）１０ｍＬを完全に中和するのに必要な、０．１０ｍｏｌ／Ｌの硫酸（２価の強酸）は何ｍＬか。\n（３） 水酸化カルシウム（２価の強塩基、式量７４）０．７４ｇを完全に中和するのに必要な、０．５０ｍｏｌ／Ｌの塩酸（１価の強酸）は何ｍＬか。\n（４） 標準状態（０℃、１．０１３×１０⁵Ｐａ）において、０．５６Ｌのアンモニア（気体・１価）を完全に中和するのに必要な、０．０５０ｍｏｌ／Ｌの硫酸（２価の強酸）は何ｍＬか。\n\n【中和の公式】（酸の価数）×（酸の物質量）＝（塩基の価数）×（塩基の物質量）　※ 中和の量的関係に電離度は影響しない",
    "subQuestions": [
      { "id": "p_c5_5_1_1", "label": "（１） NaOH水溶液の体積", "type": "short_answer", "correctAnswer": "40 mL", "correctAnswerRate": 70,
        "detailedExplanation": { "theme": "中和滴定の量的関係", "type": "演繹型", "difficulty": 2, "steps": ["① 1×0.10×(20/1000) = 1×0.050×(x/1000)", "② 0.0020 = 0.050×x/1000", "③ x = 40 mL"] } },
      { "id": "p_c5_5_1_2", "label": "（２） 硫酸の体積", "type": "short_answer", "correctAnswer": "1.0 mL", "correctAnswerRate": 60,
        "detailedExplanation": { "theme": "中和滴定の量的関係", "type": "演繹型", "difficulty": 3, "steps": ["① 酸（H⁺）＝塩基（OH⁻）：2×0.10×(x/1000) = 1×0.20×(10/1000)", "② 0.00020x/1000 …整理して 2×0.10×x = 0.20×10", "③ x = 1.0 mL"] } },
      { "id": "p_c5_5_1_3", "label": "（３） 塩酸の体積", "type": "short_answer", "correctAnswer": "40 mL", "correctAnswerRate": 55,
        "detailedExplanation": { "theme": "質量から中和計算", "type": "演繹型", "difficulty": 3, "steps": ["① Ca(OH)₂ の物質量＝0.74 g×(1 mol/74 g)＝0.010 mol", "② 1×0.50×(x/1000) = 2×0.010", "③ x = 40 mL"] } },
      { "id": "p_c5_5_1_4", "label": "（４） 硫酸の体積", "type": "short_answer", "correctAnswer": "250 mL", "correctAnswerRate": 50,
        "detailedExplanation": { "theme": "気体の体積から中和計算", "type": "演繹型", "difficulty": 3, "steps": ["① NH₃ の物質量＝0.56 L×(1 mol/22.4 L)＝0.025 mol", "② 2×0.050×(x/1000) = 1×0.025", "③ x = 250 mL"] } }
    ],
    "explanation": "▼解答・解説\nPoint ～中和が起こるとき～\n（酸の価数）×（酸の物質量）＝（塩基の価数）×（塩基の物質量）\n※ 中和の量的関係には、酸・塩基の強弱や電離度は影響しない（pH を求めるときだけ電離度をかける）。\n\n（１）酸の物質量＝塩基の物質量 をつくりにいくと、\n1×0.10×\\frac{20}{1000}＝1×0.050×\\frac{x}{1000}\nx＝40 mL\n\n（２）酸（H⁺）の物質量＝塩基（OH⁻）の物質量 をつくりにいく。\n2×0.10×\\frac{x}{1000}＝1×0.20×\\frac{10}{1000}\nx＝1.0 mL\n\n（３）水酸化カルシウムの物質量を求めると、0.74 g×\\frac{1 mol}{74 g}＝0.010 mol。\n酸（H⁺）の物質量＝塩基（OH⁻）の物質量 より、\n1×0.50×\\frac{x}{1000}＝2×0.010\nx＝40 mL\n\n（４）標準状態のアンモニアの物質量を求めると、0.56 L×\\frac{1 mol}{22.4 L}＝0.025 mol。\n酸（H⁺）の物質量＝塩基（OH⁻）の物質量 より、\n2×0.050×\\frac{x}{1000}＝1×0.025\nx＝250 mL",
    "surroundingKnowledge": [],
    "deepDiveTopics": []
  },
  {
    "id": "p_c5_5_2",
    "category": "⑤-5 中和の計算",
    "text": "２ 次の各問いに答えよ。\n\n（１） 標準状態において２．２４Ｌのアンモニアを水に溶かして全体を５００ｍＬとした。この水溶液から２０ｍＬを正確に量りとった。これを完全に中和するのに必要な ０．１０ｍｏｌ／Ｌ の塩酸は何ｍＬか。\n（２） ０．１０ｍｏｌ／Ｌの硫酸２０ｍＬに、標準状態のアンモニアを吸収させて完全に反応させた。この反応後の水溶液には、まだ反応しきれなかった酸が残っていた。そこで、この残った酸を完全に中和するために ０．１０ｍｏｌ／Ｌ の水酸化ナトリウム水溶液を滴下したところ、１０ｍＬを要した。吸収させたアンモニアの物質量は何ｍｏｌか。\n（３） ０．４０ｍｏｌ／Ｌの水酸化バリウム水溶液（２価の強塩基）２００ｍＬに、３．１５ｇの硝酸（１価の強酸、式量６３）を入れてすべて溶かした。この溶液を過不足なく中和して完全に中性にするのに、０．２０ｍｏｌ／Ｌの塩酸（１価の強酸）は何ｍＬ必要か。（Ｈ＝１．０、Ｎ＝１４、Ｏ＝１６）",
    "subQuestions": [
      { "id": "p_c5_5_2_1", "label": "（１） 塩酸の体積", "type": "short_answer", "correctAnswer": "40 mL", "correctAnswerRate": 50,
        "detailedExplanation": { "theme": "希釈と中和計算", "type": "演繹型", "difficulty": 3, "steps": ["① 全 NH₃＝2.24/22.4＝0.10 mol。20 mL分は 0.10×(20/500)＝0.0040 mol", "② 1×0.10×(x/1000)＝1×0.0040", "③ x＝40 mL"] } },
      { "id": "p_c5_5_2_2", "label": "（２） 吸収させたアンモニアの物質量", "type": "short_answer", "correctAnswer": "3.0×10⁻³ mol", "correctAnswerRate": 40,
        "detailedExplanation": { "theme": "逆滴定（酸が2種類でなく塩基が2種類）", "type": "演繹型", "difficulty": 4, "steps": ["① 酸（H⁺）＝塩基（NH₃＋NaOH）：2×0.10×(20/1000)＝1×x＋1×0.10×(10/1000)", "② 0.0040＝x＋0.0010", "③ x＝0.0030 mol＝3.0×10⁻³ mol"] } },
      { "id": "p_c5_5_2_3", "label": "（３） 塩酸の体積", "type": "short_answer", "correctAnswer": "550 mL（5.5×10² mL）", "correctAnswerRate": 40,
        "detailedExplanation": { "theme": "2種類の酸と1種類の塩基", "type": "演繹型", "difficulty": 4, "steps": ["① HNO₃ の物質量＝3.15/63＝0.050 mol", "② 酸（HNO₃＋HCl）＝塩基（Ba(OH)₂）：1×0.050＋1×0.20×(x/1000)＝2×0.40×(200/1000)", "③ 0.050＋0.20x/1000＝0.16 → x＝550 mL"] } }
    ],
    "explanation": "▼解答・解説\n（１）標準状態のアンモニアの物質量は、2.24 L×\\frac{1 mol}{22.4 L}＝0.10 mol。これが500 mL に溶けているので、量りとった20 mL 中のアンモニアの物質量は、\n0.10 mol×\\frac{20}{500}＝0.0040 mol\n酸（H⁺）の物質量＝塩基（OH⁻）の物質量 より、\n1×0.10×\\frac{x}{1000}＝1×0.0040\nx＝40 mL\n\n（２）酸は1種類（硫酸）、塩基は2種類（アンモニア NH₃ と水酸化ナトリウム NaOH）。酸の物質量＝塩基の物質量（NH₃ の物質量＋NaOH の物質量）をつくりにいくと、\n2×0.10×\\frac{20}{1000}＝1×x＋1×0.10×\\frac{10}{1000}\n0.0040＝x＋0.0010\nx＝0.0030 mol＝3.0×10⁻³ mol\n\n（３）硝酸の物質量は、3.15 g×\\frac{1 mol}{63 g}＝0.050 mol。\n酸は2種類（HNO₃ と HCl）、塩基は1種類（Ba(OH)₂）。酸の物質量（HNO₃＋HCl）＝塩基の物質量（Ba(OH)₂）をつくりにいくと、\n1×0.050＋1×0.20×\\frac{x}{1000}＝2×0.40×\\frac{200}{1000}\nx＝550 mL＝5.5×10² mL",
    "surroundingKnowledge": [],
    "deepDiveTopics": []
  },
  {
    "id": "p_c5_5_3",
    "category": "⑤-5 中和の計算",
    "text": "３ 空気中の二酸化炭素の量を測定するために、次の実験を行った。２５℃、１．０１３×１０⁵Ｐａの空気１０Ｌを、４．０×１０⁻³ｍｏｌ／Ｌの水酸化バリウム水溶液（２価の強塩基）１００ｍＬに通し、二酸化炭素を完全に吸収させて炭酸バリウムの白色沈殿を生じさせた。反応後の上澄み液１０ｍＬを正確に量りとって、残った水酸化バリウムを中和するのに必要な塩酸の量を調べたところ、１．０×１０⁻²ｍｏｌ／Ｌの塩酸（１価の強酸）が６．０ｍＬ必要であった。もとの空気１０Ｌの中に含まれていた二酸化炭素の物質量は何ｍｏｌか。また、その二酸化炭素が占める体積は、この実験条件下（２５℃、気体１ｍｏｌの体積を２４．５Ｌとする）で何ｍＬか。",
    "subQuestions": [
      { "id": "p_c5_5_3_1", "label": "CO₂ の物質量", "type": "short_answer", "correctAnswer": "1.0×10⁻⁴ mol", "correctAnswerRate": 35,
        "detailedExplanation": { "theme": "二段滴定・逆滴定の応用", "type": "演繹型", "difficulty": 5, "steps": ["① 上澄み10 mLに必要な塩酸6.0 mL → 100 mL全体なら10倍の60 mL", "② 酸（CO₂＋HCl）＝塩基（Ba(OH)₂）：2×x＋1.0×10⁻²×(60/1000)＝2×4.0×10⁻³×(100/1000)", "③ x＝1.0×10⁻⁴ mol"] } },
      { "id": "p_c5_5_3_2", "label": "CO₂ の体積（mL）", "type": "short_answer", "correctAnswer": "2.45 mL", "correctAnswerRate": 35,
        "detailedExplanation": { "theme": "物質量から体積", "type": "演繹型", "difficulty": 3, "steps": ["① 25℃では気体1 mol＝24.5 L", "② 1.0×10⁻⁴ mol×24.5 L/mol＝2.45×10⁻³ L", "③ ＝2.45 mL"] } }
    ],
    "explanation": "▼解答・解説\n上澄み液10 mL の中和に塩酸が6.0 mL 必要だったので、全体の100 mL をすべて中和するには10倍の60 mL の塩酸が必要になる。\nここで、酸（H⁺）の物質量＝塩基（OH⁻）の物質量 をつくりにいく。酸は2種類（二酸化炭素 CO₂ と塩酸 HCl）、塩基は1種類（水酸化バリウム Ba(OH)₂）。酸の物質量（CO₂＋HCl）＝塩基の物質量（Ba(OH)₂）より、\n2×x＋1.0×10⁻²×\\frac{60}{1000}＝2×4.0×10⁻³×\\frac{100}{1000}\nx＝0.00010 mol＝1.0×10⁻⁴ mol（CO₂ の物質量）\n\n体積は、25℃において気体1 mol は24.5 L なので、\n1.0×10⁻⁴ mol×\\frac{24.5 L}{1 mol}×\\frac{1000 mL}{1 L}＝2.45 mL",
    "surroundingKnowledge": [],
    "deepDiveTopics": []
  },

  // ============================================================
  // ⑤-6 中和滴定の道具と方法
  // ============================================================
  {
    "id": "p_c5_6_1",
    "category": "⑤-6 中和滴定の道具と方法",
    "text": "１ 中和滴定の実験に用いる次の器具（ア）〜（エ）について、下の各問いに答えよ。\n\n問１ 器具（ア）〜（エ）の名称をそれぞれ答えよ。\n問２ （１） 溶液を純水で薄めて「正確な濃度の溶液を調製する」ときに用いる器具はどれか。（ア）〜（エ）の記号で答えよ。　（２） 元の溶液から「一定体積の溶液を正確にはかりとる」ときに用いる器具はどれか。（ア）〜（エ）の記号で答えよ。\n問３ 器具（ア）〜（エ）のうち、使用する直前に「純水で濡れたまま用いてはならず、使用する溶液で内部を洗い流す（共洗いする）」必要があるものを【すべて】選び、記号で答えよ。",
    "imageUrl": "/acid_base_images/fig_p16.png",
    "imageCaption": "中和滴定に用いる器具（ア）〜（エ）",
    "subQuestions": [
      { "id": "p_c5_6_1_1a", "label": "問１（ア）の名称", "type": "short_answer", "correctAnswer": "ビュレット", "correctAnswerRate": 65,
        "detailedExplanation": { "theme": "中和滴定の器具", "type": "知識再生型", "difficulty": 2, "steps": ["① コックがついた目盛り付きの細長い管", "② 滴下量を「滴下前−滴下後」で正確に測る器具", "③ ビュレット"] } },
      { "id": "p_c5_6_1_1b", "label": "問１（イ）の名称", "type": "short_answer", "correctAnswer": "ホールピペット", "correctAnswerRate": 65,
        "detailedExplanation": { "theme": "中和滴定の器具", "type": "知識再生型", "difficulty": 2, "steps": ["① 中央がふくらんだ標線付きの管", "② 一定体積を正確にはかりとる", "③ ホールピペット"] } },
      { "id": "p_c5_6_1_1c", "label": "問１（ウ）の名称", "type": "short_answer", "correctAnswer": "コニカルビーカー", "correctAnswerRate": 60,
        "detailedExplanation": { "theme": "中和滴定の器具", "type": "知識再生型", "difficulty": 2, "steps": ["① 口がすぼまった三角形の容器", "② 中和を行う容器", "③ コニカルビーカー"] } },
      { "id": "p_c5_6_1_1d", "label": "問１（エ）の名称", "type": "short_answer", "correctAnswer": "メスフラスコ", "correctAnswerRate": 60,
        "detailedExplanation": { "theme": "中和滴定の器具", "type": "知識再生型", "difficulty": 2, "steps": ["① 首が細く標線がついた丸底の容器", "② 正確な濃度の溶液を調製する", "③ メスフラスコ"] } },
      { "id": "p_c5_6_1_2a", "label": "問２（１） 正確な濃度の溶液を調製する器具", "type": "short_answer", "correctAnswer": "エ", "correctAnswerRate": 65,
        "detailedExplanation": { "theme": "器具の用途", "type": "演繹型", "difficulty": 2, "steps": ["① 「濃度を正確に決める」のはメスフラスコ", "② 標線まで水を加えて一定濃度にする", "③ （エ）"] } },
      { "id": "p_c5_6_1_2b", "label": "問２（２） 一定体積を正確にはかりとる器具", "type": "short_answer", "correctAnswer": "イ", "correctAnswerRate": 65,
        "detailedExplanation": { "theme": "器具の用途", "type": "演繹型", "difficulty": 2, "steps": ["① 「一定体積を正確にとる」のはホールピペット", "② 標線まで吸い上げて使う", "③ （イ）"] } },
      { "id": "p_c5_6_1_3", "label": "問３ 共洗いが必要な器具（すべて）", "type": "short_answer", "correctAnswer": "ア と イ", "correctAnswerRate": 50,
        "detailedExplanation": { "theme": "共洗いの判断", "type": "概念区別型", "difficulty": 3, "steps": ["① 中に入れる溶液の濃度が変わると困る器具は共洗いする", "② ホールピペット（イ）とビュレット（ア）は溶液の濃度が重要", "③ 「ホールピペットとビュレットのト＝共洗いのと」。答えは（ア）と（イ）"] } }
    ],
    "explanation": "▼解答・解説\n問１ （ア）ビュレット　（イ）ホールピペット　（ウ）コニカルビーカー　（エ）メスフラスコ\n問２ （１）（エ）メスフラスコ　（２）（イ）ホールピペット\n問３ （ア）と（イ）\n\n【共洗いの覚え方】「ホールピペットとビュレットの『ト』は共洗いの『と』！」\n・共洗いが必要（溶液の濃度が重要）：ビュレット・ホールピペット\n・純水で濡れたまま使ってよい（物質量が変わらない）：メスフラスコ・コニカルビーカー",
    "surroundingKnowledge": [],
    "deepDiveTopics": []
  },
  {
    "id": "p_c5_6_2",
    "category": "⑤-6 中和滴定の道具と方法",
    "text": "２ 市販の食酢に含まれる酢酸の濃度を調べるため、次の実験を行った。まず、食酢を正確に１０．０ｍＬ量りとって器具（エ）に入れ、純水を加えて全量を１００ｍＬとした。次に、この薄めた水溶液から２０．０ｍＬを器具（イ）で正確に量りとって器具（ウ）に移し、指示薬として（ オ ）を数滴加えた。この溶液に、器具（ア）から５．０×１０⁻²ｍｏｌ／Ｌの水酸化ナトリウム水溶液を滴下したところ、２８．０ｍＬ滴下したところで溶液の色が（ カ ）色に変化し、中和点に達した。\n\n問１ （ア）〜（エ）に適する道具名を入れ、文中の空欄（ オ ）に適当な指示薬の名称を入れよ。また、中和点での色の変化（ カ ）を答えよ。\n問２ 薄める前の「もとの食酢」のモル濃度は何ｍｏｌ／Ｌか。\n問３ もとの食酢の質量パーセント濃度は何％か。ただし、食酢の密度は１．０ｇ／ｃｍ³とし、食酢中の酸はすべて酢酸（分子量６０）とする。",
    "subQuestions": [
      { "id": "p_c5_6_2_1a", "label": "問１（ア）の道具名", "type": "short_answer", "correctAnswer": "ビュレット", "correctAnswerRate": 65,
        "detailedExplanation": { "theme": "器具の同定", "type": "知識再生型", "difficulty": 2, "steps": ["① 滴下に用いる器具", "② 「〜から滴下した」とあるのでビュレット", "③ ビュレット"] } },
      { "id": "p_c5_6_2_1b", "label": "問１（イ）の道具名", "type": "short_answer", "correctAnswer": "ホールピペット", "correctAnswerRate": 65,
        "detailedExplanation": { "theme": "器具の同定", "type": "知識再生型", "difficulty": 2, "steps": ["① 一定体積を正確にとる器具", "② 「20.0 mLを正確に量りとる」のでホールピペット", "③ ホールピペット"] } },
      { "id": "p_c5_6_2_1c", "label": "問１（ウ）の道具名", "type": "short_answer", "correctAnswer": "コニカルビーカー", "correctAnswerRate": 60,
        "detailedExplanation": { "theme": "器具の同定", "type": "知識再生型", "difficulty": 2, "steps": ["① 中和を行う容器", "② はかりとった溶液を移して滴定する容器", "③ コニカルビーカー"] } },
      { "id": "p_c5_6_2_1d", "label": "問１（エ）の道具名", "type": "short_answer", "correctAnswer": "メスフラスコ", "correctAnswerRate": 60,
        "detailedExplanation": { "theme": "器具の同定", "type": "知識再生型", "difficulty": 2, "steps": ["① 正確な濃度に薄める器具", "② 「純水を加えて全量を100 mLにする」のでメスフラスコ", "③ メスフラスコ"] } },
      { "id": "p_c5_6_2_1e", "label": "問１（オ）の指示薬", "type": "short_answer", "correctAnswer": "フェノールフタレイン", "correctAnswerRate": 60,
        "detailedExplanation": { "theme": "指示薬の選択", "type": "知識再生型", "difficulty": 3, "steps": ["① 弱酸（酢酸）＋強塩基（NaOH）の滴定", "② 中和点は塩基性側に寄るのでフェノールフタレインを用いる", "③ フェノールフタレイン"] } },
      { "id": "p_c5_6_2_1f", "label": "問１（カ）中和点での色の変化", "type": "short_answer", "correctAnswer": "無色から淡い赤（ピンク）", "correctAnswerRate": 55,
        "detailedExplanation": { "theme": "指示薬の変色", "type": "知識再生型", "difficulty": 2, "steps": ["① フェノールフタレインは塩基性で赤（ピンク）", "② 中和点で無色→淡い赤（ピンク）に変わる", "③ 無色から淡い赤（ピンク）"] } },
      { "id": "p_c5_6_2_2", "label": "問２ もとの食酢のモル濃度", "type": "short_answer", "correctAnswer": "0.70 mol/L", "correctAnswerRate": 50,
        "detailedExplanation": { "theme": "中和滴定の計算", "type": "演繹型", "difficulty": 3, "steps": ["① 薄めた酢酸の濃度 c：1×c×(20.0/1000)＝1×5.0×10⁻²×(28.0/1000)", "② 20.0c＝1.4 → c＝0.070 mol/L", "③ 10倍に薄めたので元は 0.070×10＝0.70 mol/L"] } },
      { "id": "p_c5_6_2_3", "label": "問３ 質量パーセント濃度", "type": "short_answer", "correctAnswer": "4.2 %", "correctAnswerRate": 45,
        "detailedExplanation": { "theme": "質量パーセント濃度", "type": "演繹型", "difficulty": 3, "steps": ["① 1 L中の酢酸の質量＝0.70 mol×60 g/mol＝42 g", "② 食酢1 L の質量＝1000 cm³×1.0 g/cm³＝1000 g", "③ 42/1000×100＝4.2 %"] } }
    ],
    "explanation": "▼解答・解説\n問１ （ア）ビュレット　（イ）ホールピペット　（ウ）コニカルビーカー　（エ）メスフラスコ　（オ）フェノールフタレイン　（カ）無色から淡い赤（または、ピンク）\n\n問２ 滴定に使用した「薄めたあとの酢酸水溶液」のモル濃度を c［mol/L］とおく。酸の物質量＝塩基の物質量 をつくりにいくと、\n1×c×\\frac{20.0}{1000}＝1×5.0×10⁻²×\\frac{28.0}{1000}\n20.0c＝1.4\nc＝0.070 mol/L\nこれは「10倍に薄めたあと」の濃度なので、もとの食酢のモル濃度は10倍になり、0.070×10＝0.70 mol/L。\n\n問３ もとの食酢は0.70 mol/L なので、1 L 中に0.70 mol の酢酸を含む。酢酸の分子量は60、食酢の密度は1.0 g/cm³ である。\n・酢酸の質量＝0.70 mol×\\frac{60 g}{1 mol}＝42 g\n・食酢1 L の質量＝1000 cm³×\\frac{1.0 g}{1 cm^3}＝1000 g\nよって質量パーセント濃度は、\n\\frac{42 g}{1000 g}×100＝4.2 ％",
    "surroundingKnowledge": [],
    "deepDiveTopics": []
  },
  {
    "id": "p_c5_6_3",
    "category": "⑤-6 中和滴定の道具と方法",
    "text": "３ 酢酸水溶液の濃度を求めるために、次の一連の実験操作（i）〜（v）を行った。下の各問いに答えよ。ただし、数値の計算は四捨五入して有効数字２桁で記せ。（Ｈ＝１．０、Ｃ＝１２、Ｏ＝１６、Ｎａ＝２３）\n\n［実験操作］\n（i） 水酸化ナトリウムの固体約２．０ｇを蒸留水に溶かして５００ｍＬの水溶液をつくった。\n（ii） シュウ酸二水和物 (COOH)₂・2H₂O の結晶３．１５ｇを正確にはかりとり、蒸留水に溶かして、５００ｍＬの（ ア ）に入れて標線まで蒸留水を加えた。\n（iii） 操作（ii）でつくったシュウ酸水溶液２０．０ｍＬを（ イ ）で正確にとり、（ ウ ）に入れ、指示薬を数滴加えたのち、操作（i）でつくった水酸化ナトリウム水溶液を（ エ ）に入れて滴定すると、中和点までに２５．０ｍＬを要した。\n（iv） 濃度未知の酢酸水溶液１０．０ｍＬを（ イ ）で正確にとり、１００ｍＬの（ ア ）に入れて標線まで蒸留水を加えて薄めた。\n（v） 操作（iv）でつくった薄めた酢酸水溶液２０．０ｍＬを（ イ ）で正確にとり、（ ウ ）に入れ、指示薬を数滴加えて、操作（iii）で濃度を求めた水酸化ナトリウム水溶液を（ エ ）に入れて滴定すると、中和点までに１６．０ｍＬを要した。\n\n問１ 文中の空欄（ ア ）〜（ エ ）に該当する最も適切な実験器具の名称をそれぞれ答えよ。\n問２ （１） 実験器具（ア）〜（エ）の中で、「使用前に純水で濡れていても、そのまま（乾かさずに）使用してよいもの」をすべて選び、記号で答えよ。　（２） 操作（i）において、水酸化ナトリウムの固体が空気中の水分を吸収して自ら溶ける現象の名称を答えよ。\n問３ 操作（ii）で調製したシュウ酸標準溶液のモル濃度は何ｍｏｌ／Ｌか。\n問４ 操作（iii）の実験結果から、この水酸化ナトリウム水溶液のモル濃度は何ｍｏｌ／Ｌか。\n問５ 操作（v）の実験結果から、薄める前の「もとの酢酸水溶液」のモル濃度は何ｍｏｌ／Ｌか。",
    "subQuestions": [
      { "id": "p_c5_6_3_1a", "label": "問１（ア）", "type": "short_answer", "correctAnswer": "メスフラスコ", "correctAnswerRate": 60,
        "detailedExplanation": { "theme": "器具の同定", "type": "知識再生型", "difficulty": 2, "steps": ["① 標線まで蒸留水を加えて正確な濃度にする器具", "② 標準溶液の調製に使う", "③ メスフラスコ"] } },
      { "id": "p_c5_6_3_1b", "label": "問１（イ）", "type": "short_answer", "correctAnswer": "ホールピペット", "correctAnswerRate": 60,
        "detailedExplanation": { "theme": "器具の同定", "type": "知識再生型", "difficulty": 2, "steps": ["① 一定体積を正確にとる器具", "② 「20.0 mLを正確にとる」", "③ ホールピペット"] } },
      { "id": "p_c5_6_3_1c", "label": "問１（ウ）", "type": "short_answer", "correctAnswer": "コニカルビーカー", "correctAnswerRate": 60,
        "detailedExplanation": { "theme": "器具の同定", "type": "知識再生型", "difficulty": 2, "steps": ["① 中和を行う容器", "② 指示薬を加えて滴定する容器", "③ コニカルビーカー"] } },
      { "id": "p_c5_6_3_1d", "label": "問１（エ）", "type": "short_answer", "correctAnswer": "ビュレット", "correctAnswerRate": 60,
        "detailedExplanation": { "theme": "器具の同定", "type": "知識再生型", "difficulty": 2, "steps": ["① 滴下量を正確に測る器具", "② 「〜に入れて滴定する」", "③ ビュレット"] } },
      { "id": "p_c5_6_3_2a", "label": "問２（１） 濡れたまま使ってよい器具（すべて）", "type": "short_answer", "correctAnswer": "ア と ウ", "correctAnswerRate": 50,
        "detailedExplanation": { "theme": "共洗いの判断", "type": "概念区別型", "difficulty": 3, "steps": ["① 共洗いが必要なのはホールピペット（イ）とビュレット（エ）", "② それ以外（メスフラスコ・コニカルビーカー）は濡れたまま使ってよい", "③ （ア）と（ウ）"] } },
      { "id": "p_c5_6_3_2b", "label": "問２（２） 現象の名称", "type": "short_answer", "correctAnswer": "潮解", "correctAnswerRate": 50,
        "detailedExplanation": { "theme": "潮解", "type": "知識再生型", "difficulty": 2, "steps": ["① 固体が空気中の水分を吸収して自ら溶ける現象", "② NaOH は代表的な潮解性物質", "③ 潮解"] } },
      { "id": "p_c5_6_3_3", "label": "問３ シュウ酸標準溶液のモル濃度", "type": "short_answer", "correctAnswer": "0.050 mol/L", "correctAnswerRate": 50,
        "detailedExplanation": { "theme": "標準溶液のモル濃度", "type": "演繹型", "difficulty": 3, "steps": ["① (COOH)₂・2H₂O の式量＝90＋36＝126", "② 物質量＝3.15/126＝0.025 mol、体積0.500 L", "③ 濃度＝0.025/0.500＝0.050 mol/L"] } },
      { "id": "p_c5_6_3_4", "label": "問４ NaOH水溶液のモル濃度", "type": "short_answer", "correctAnswer": "0.080 mol/L", "correctAnswerRate": 45,
        "detailedExplanation": { "theme": "中和滴定の計算（2価酸）", "type": "演繹型", "difficulty": 3, "steps": ["① シュウ酸は2価：2×0.050×(20.0/1000)＝1×c×(25.0/1000)", "② 2.0＝25.0c", "③ c＝0.080 mol/L"] } },
      { "id": "p_c5_6_3_5", "label": "問５ もとの酢酸水溶液のモル濃度", "type": "short_answer", "correctAnswer": "0.64 mol/L", "correctAnswerRate": 40,
        "detailedExplanation": { "theme": "中和滴定の計算＋希釈の戻し", "type": "演繹型", "difficulty": 4, "steps": ["① 薄めた酢酸 c'：1×c'×(20.0/1000)＝1×0.080×(16.0/1000)", "② 20.0c'＝1.28 → c'＝0.064 mol/L", "③ 10倍希釈なので元は 0.064×10＝0.64 mol/L"] } }
    ],
    "explanation": "▼解答・解説\n問１ （ア）メスフラスコ　（イ）ホールピペット　（ウ）コニカルビーカー　（エ）ビュレット\n\n問２ （１）（ア）と（ウ）　（２）潮解\nPoint ～共洗いの覚え方～\nホールピペットとビュレットの「ト」は共洗いの「と」！！\n\n問３ シュウ酸二水和物 (COOH)₂・2H₂O の式量は、シュウ酸部分（90）＋水2分子（36）＝126。結晶3.15 g の物質量は 3.15 g×\\frac{1 mol}{126 g}＝0.025 mol。これが500 mL（0.500 L）に溶けているので、モル濃度は、\n\\frac{0.025 mol}{0.500 L}＝0.050 mol/L\n\n問４ 求める水酸化ナトリウムの濃度を c［mol/L］とおく。シュウ酸は2価なので、酸の物質量＝塩基の物質量 より、\n2×0.050×\\frac{20.0}{1000}＝1×c×\\frac{25.0}{1000}\n2.0＝25.0c\nc＝0.080 mol/L\n\n問５ 操作（v）の段階における薄めたあとの酢酸の濃度を c'［mol/L］とおく。酸の物質量＝塩基の物質量 より、\n1×c'×\\frac{20.0}{1000}＝1×0.080×\\frac{16.0}{1000}\n20.0c'＝1.28\nc'＝0.064 mol/L\nもとの酢酸水溶液は、操作（iv）で10.0 mL を100 mL に薄めた（＝10倍に希釈した）ものなので、元の濃度はこれの10倍になり、0.064×10＝0.64 mol/L。",
    "surroundingKnowledge": [],
    "deepDiveTopics": []
  },
  {
    "id": "p_c5_7_1",
    "category": "⑤-7 滴定曲線と中和反応の利用",
    "text": "１ 濃度のわからないアンモニア水20mLをコニカルビーカーにとり、0.10mol/Lの硫酸（2価の強酸）を少しずつ滴下したところ、ちょうど中和するまでに10mLを要した。次の各問いに答えよ。",
    "imageUrl": "/acid_base_images/fig_p20.png",
    "imageCaption": "硫酸の体積[mL]に対するpHの変化（ア）〜（エ）",
    "subQuestions": [
      { "id": "p_c5_7_1_1", "label": "問１ この中和滴定の滴定曲線として最も適切なもの", "type": "multiple_choice",
        "options": ["（ア）", "（イ）", "（ウ）", "（エ）"], "correctAnswer": "（イ）", "correctAnswerRate": 50,
        "detailedExplanation": { "theme": "滴定曲線の選択（弱塩基＋強酸）", "type": "文脈判断型", "difficulty": 3, "steps": ["① 滴定されるのは弱塩基（アンモニア水）なので開始時のpHは強塩基ほど高くなく、11前後から始まる", "② 滴定するのは強酸（硫酸）なので終点では大きくpHが下がり酸性側で終わる", "③ 中和点（10mL）が酸性側（pH7より下）に来る曲線を選ぶ → （イ）"] } },
      { "id": "p_c5_7_1_2a", "label": "問２（１） 用いる指示薬", "type": "short_answer",
        "correctAnswer": "メチルオレンジ（またはメチルレッド）", "correctAnswerRate": 50,
        "detailedExplanation": { "theme": "指示薬の選択", "type": "知識再生型", "difficulty": 3, "steps": ["① 弱塩基を強酸で滴定すると中和点は酸性側に偏る", "② 変色域が酸性側にある指示薬を使う", "③ メチルオレンジ（またはメチルレッド）"] } },
      { "id": "p_c5_7_1_2b", "label": "問２（２） 中和点での色変化", "type": "short_answer",
        "correctAnswer": "黄色から赤色（橙赤色）", "correctAnswerRate": 45,
        "detailedExplanation": { "theme": "指示薬の色変化", "type": "知識再生型", "difficulty": 3, "steps": ["① メチルオレンジは塩基性〜中性で黄色、酸性で赤色", "② 滴定が進み酸性になると変色", "③ 黄色から赤色（橙赤色）へ変化"] } },
      { "id": "p_c5_7_1_3", "label": "問３ アンモニア水のモル濃度", "type": "short_answer",
        "correctAnswer": "0.10 mol/L", "correctAnswerRate": 50,
        "detailedExplanation": { "theme": "中和の量的関係（2価酸×1価塩基）", "type": "演繹型", "difficulty": 3, "steps": ["① 酸の出すH⁺＝塩基の受け取るH⁺：2×0.10×(10.0/1000)＝1×c×(20.0/1000)", "② 0.0020＝0.020c", "③ c＝0.10 mol/L"] } }
    ],
    "explanation": "▼解答・解説\n問１ （イ）\n滴定されるのは弱塩基のアンモニア水なので開始 pH は11前後、滴下するのは強酸の硫酸なので終点は強い酸性側になる。中和点が酸性側に来る曲線（イ）が適切。\n\n問２ 名称：メチルオレンジ（またはメチルレッド）　色の変化：黄色から赤色（または、橙赤色）\n弱塩基を強酸で滴定すると中和点が酸性側に偏るため、変色域が酸性側にある指示薬を用いる。\n\n問３ 2価の硫酸と1価のアンモニアの中和。アンモニア水の濃度を c［mol/L］とおくと、酸の物質量＝塩基の物質量 より、\n2×0.10×\\frac{10.0}{1000}＝1×c×\\frac{20.0}{1000}\n2.0＝20c\nc＝0.10 mol/L",
    "surroundingKnowledge": [],
    "deepDiveTopics": []
  },
  {
    "id": "p_c5_7_2",
    "category": "⑤-7 滴定曲線と中和反応の利用",
    "text": "２ 水酸化ナトリウムと炭酸ナトリウムを含む混合水溶液20.0mLをホールピペットでコニカルビーカーにとり、0.100mol/Lの希塩酸で滴定した。下図のように2段階の中和が起こり、第1中和点までに15.0mL、第2中和点までに合計20.0mLの希塩酸を要した。次の各問いに答えよ。",
    "imageUrl": "/acid_base_images/fig_p21.png",
    "imageCaption": "加えた希塩酸の体積[mL]に対するpHの変化（二段階滴定）",
    "subQuestions": [
      { "id": "p_c5_7_2_1a", "label": "問１（ア） 混合水溶液を正確にはかりとる器具", "type": "short_answer",
        "correctAnswer": "ホールピペット", "correctAnswerRate": 55,
        "detailedExplanation": { "theme": "器具の同定", "type": "知識再生型", "difficulty": 2, "steps": ["① 一定体積を正確にはかりとる器具", "② ホールピペット"] } },
      { "id": "p_c5_7_2_1b", "label": "問１（イ） 滴定を行う容器", "type": "short_answer",
        "correctAnswer": "コニカルビーカー", "correctAnswerRate": 55,
        "detailedExplanation": { "theme": "器具の同定", "type": "知識再生型", "difficulty": 2, "steps": ["① 指示薬を加えて滴定する容器", "② コニカルビーカー"] } },
      { "id": "p_c5_7_2_1c", "label": "問１（ウ） 希塩酸を滴下する器具", "type": "short_answer",
        "correctAnswer": "ビュレット", "correctAnswerRate": 55,
        "detailedExplanation": { "theme": "器具の同定", "type": "知識再生型", "difficulty": 2, "steps": ["① 滴下量を正確に測る器具", "② ビュレット"] } },
      { "id": "p_c5_7_2_1d", "label": "問１（エ） 第2中和点を知るための指示薬", "type": "short_answer",
        "correctAnswer": "メチルオレンジ（またはメチルレッド）", "correctAnswerRate": 45,
        "detailedExplanation": { "theme": "指示薬の選択", "type": "知識再生型", "difficulty": 3, "steps": ["① 第2中和点は炭酸（弱酸）の遊離で酸性側", "② 変色域が酸性側の指示薬を用いる", "③ メチルオレンジ（またはメチルレッド）"] } },
      { "id": "p_c5_7_2_2", "label": "問２ 第1中和点までに起こる2つの反応式", "type": "descriptive",
        "correctAnswer": "NaOH + HCl → NaCl + H₂O　／　Na₂CO₃ + HCl → NaCl + NaHCO₃",
        "gradingCriteria": "NaOHが中和される式（NaOH＋HCl→NaCl＋H₂O）と、Na₂CO₃が炭酸水素ナトリウムに変わる式（Na₂CO₃＋HCl→NaCl＋NaHCO₃）の2式が正しく書けていること。", "correctAnswerRate": 40,
        "detailedExplanation": { "theme": "二段階滴定 第1段階の反応", "type": "知識再生型", "difficulty": 4, "steps": ["① まず強塩基のNaOHが中和される：NaOH＋HCl→NaCl＋H₂O", "② 次にNa₂CO₃が1段階反応してNaHCO₃になる：Na₂CO₃＋HCl→NaCl＋NaHCO₃", "③ この2反応が第1中和点までに進む"] } },
      { "id": "p_c5_7_2_3", "label": "問３ 第1中和点から第2中和点までに起こる反応式", "type": "descriptive",
        "correctAnswer": "NaHCO₃ + HCl → NaCl + H₂O + CO₂",
        "gradingCriteria": "炭酸水素ナトリウムが塩酸と反応して二酸化炭素を発生する式（NaHCO₃＋HCl→NaCl＋H₂O＋CO₂）が正しく書けていること。", "correctAnswerRate": 40,
        "detailedExplanation": { "theme": "二段階滴定 第2段階の反応", "type": "知識再生型", "difficulty": 4, "steps": ["① 第1中和点で生じたNaHCO₃が塩酸とさらに反応", "② NaHCO₃＋HCl→NaCl＋H₂O＋CO₂", "③ CO₂が発生して第2中和点に達する"] } },
      { "id": "p_c5_7_2_4a", "label": "問４（１） 水酸化ナトリウムのモル濃度", "type": "short_answer",
        "correctAnswer": "0.050 mol/L", "correctAnswerRate": 35,
        "detailedExplanation": { "theme": "二段階滴定の定量", "type": "演繹型", "difficulty": 5, "steps": ["① 第2段階（NaHCO₃→CO₂）に使った塩酸＝20.0−15.0＝5.0mL。Na₂CO₃の物質量y＝0.100×(5.0/1000)＝0.00050mol", "② 第1段階（15.0mL）は NaOH分(x) ＋ Na₂CO₃→NaHCO₃分(y)：0.100×(15.0/1000)＝x＋y＝0.00150 → x＝0.00100mol", "③ NaOH濃度＝0.00100/0.0200＝0.050 mol/L"] } },
      { "id": "p_c5_7_2_4b", "label": "問４（２） 炭酸ナトリウムのモル濃度", "type": "short_answer",
        "correctAnswer": "0.025 mol/L", "correctAnswerRate": 35,
        "detailedExplanation": { "theme": "二段階滴定の定量", "type": "演繹型", "difficulty": 5, "steps": ["① Na₂CO₃の物質量 y＝0.00050mol（第2段階の塩酸5.0mLより）", "② Na₂CO₃濃度＝0.00050/0.0200", "③ ＝0.025 mol/L"] } }
    ],
    "explanation": "▼解答・解説\n問１ （ア）ホールピペット　（イ）コニカルビーカー　（ウ）ビュレット　（エ）メチルオレンジ（またはメチルレッド）\n\n問２ 第1中和点まで（塩酸を15.0 mL 滴下するまで）は、まず強塩基の NaOH が中和され、次に Na₂CO₃ が NaHCO₃ へ変化する。\n　・NaOH＋HCl→NaCl＋H₂O\n　・Na₂CO₃＋HCl→NaCl＋NaHCO₃\n\n問３ 第1中和点から第2中和点まで（塩酸をさらに5.0 mL 滴下するまで）は、生じた NaHCO₃ が塩酸と反応して CO₂ を発生する。\n　NaHCO₃＋HCl→NaCl＋H₂O＋CO₂\n\n問４ 水酸化ナトリウム：0.050 mol/L　炭酸ナトリウム：0.025 mol/L\n混合溶液20.0 mL 中の NaOH を x［mol］、Na₂CO₃ を y［mol］とおく。\n後半（第1中和点を過ぎてから第2中和点まで）で消費された塩酸は 20.0−15.0＝5.0 mL。ここで反応する NaHCO₃ の物質量は、もとの Na₂CO₃ の物質量 y と等しいので、\n1×0.100×\\frac{5.0}{1000}＝1×y\ny＝0.00050 mol\n前半（実験開始から第1中和点まで）で消費された塩酸は15.0 mL。ここでは NaOH と Na₂CO₃ がそれぞれ1価の塩基として塩酸を消費するので、\n1×0.100×\\frac{15.0}{1000}＝x＋y\nx＋0.00050＝0.00150\nx＝0.00100 mol\nこれらは混合溶液20.0 mL（＝0.0200 L）に溶けていたので、モル濃度は、\n（１）NaOH＝\\frac{0.00100 mol}{0.0200 L}＝0.050 mol/L\n（２）Na₂CO₃＝\\frac{0.00050 mol}{0.0200 L}＝0.025 mol/L",
    "surroundingKnowledge": [],
    "deepDiveTopics": []
  },
];
