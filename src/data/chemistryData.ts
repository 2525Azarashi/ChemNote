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
          practiceProblems: [],
          miniTest: [
            {
              id: "q1",
              category: "物質の分類と性質",
              text: "物質の分類と性質に関する次の文章を読み、あとの問いに答えよ。\n\n物質は、現在およそ120種類存在する原子の種類である「元素」から構成されている。物質は大きく分けると、1種類の物質でできている ( ア ) と、2種類以上の ( ア ) が混じり合った ( イ ) に分けられる。 ( ア ) は、酸素や鉄のように1種類の元素からできている ( ウ ) と、水や塩化ナトリウムのように2種類以上の元素からできている ( エ ) が存在する\n\nまた、物質を区別する上で、融点や沸点、密度といった性質も重要である。( ア ) の場合はこれらの値が物質ごとに ( オ ) となるが、( イ ) の場合は、混じっている物質の種類やその割合によって値が ( カ ) するという違いがある。この違いは、①水とエタノールなどの加熱で確認をすることができる。\n\n問1 文章中の空欄 ( ア ) ～ ( カ ) に入る最も適切な語句を答えよ。",
              subQuestions: [
                { id: "q1_a", label: "(ア)", type: "short_answer", correctAnswer: "純物質", correctAnswerRate: 85 },
                { id: "q1_b", label: "(イ)", type: "short_answer", correctAnswer: "混合物", correctAnswerRate: 85 },
                { id: "q1_c", label: "(ウ)", type: "short_answer", correctAnswer: "単体", correctAnswerRate: 85 },
                { id: "q1_d", label: "(エ)", type: "short_answer", correctAnswer: "化合物", correctAnswerRate: 85 },
                { id: "q1_e", label: "(オ)", type: "short_answer", correctAnswer: "一定", correctAnswerRate: 85 },
                { id: "q1_f", label: "(カ)", type: "short_answer", correctAnswer: "変化", correctAnswerRate: 85 }
              ],
              explanation: "純物質は「一つの化学式で書ける」、混合物は「一つの化学式で書けない」と見分けるのもポイントです。また、水とエタノールの混合物を加熱するグラフのように、混合物は沸点などが一定になりません。",
              surroundingKnowledge: [],
              deepDiveTopics: []
            },
            {
              id: "q2",
              category: "物質の分類",
              text: "問2 次の (1)〜(6) の物質は、文章中の( イ )～（ エ ）のどれに分類されるか答えよ。\n(イ) 混合物　(ウ) 単体　(エ) 化合物\n\n(1) 空気　 (2) 酸素　 (3) 食塩水　 (4) メタン　 (5) 黒鉛　(6) 石油",
              subQuestions: [
                { id: "q2_1", label: "(1) 空気", type: "multiple_choice", options: ["(イ)", "(ウ)", "(エ)"], correctAnswer: "(イ)", correctAnswerRate: 85 },
                { id: "q2_2", label: "(2) 酸素", type: "multiple_choice", options: ["(イ)", "(ウ)", "(エ)"], correctAnswer: "(ウ)", correctAnswerRate: 85 },
                { id: "q2_3", label: "(3) 食塩水", type: "multiple_choice", options: ["(イ)", "(ウ)", "(エ)"], correctAnswer: "(イ)", correctAnswerRate: 85 },
                { id: "q2_4", label: "(4) メタン", type: "multiple_choice", options: ["(イ)", "(ウ)", "(エ)"], correctAnswer: "(エ)", correctAnswerRate: 85 },
                { id: "q2_5", label: "(5) 黒鉛", type: "multiple_choice", options: ["(イ)", "(ウ)", "(エ)"], correctAnswer: "(ウ)", correctAnswerRate: 85 },
                { id: "q2_6", label: "(6) 石油", type: "multiple_choice", options: ["(イ)", "(ウ)", "(エ)"], correctAnswer: "(イ)", correctAnswerRate: 85 }
              ],
              explanation: "空気や食塩水、海水、石油などは「複数の純物質が混ざったもの」なので混合物です。",
              surroundingKnowledge: [],
              deepDiveTopics: []
            },
            {
              id: "q3",
              category: "元素と単体",
              text: "問３ 物質の構成成分としての「元素」と、実際に存在する物質としての「単体」を区別することは非常に重要である。次の (1)〜(4) の下線部が、「単体」と「元素」のどちらの意味で用いられているか答えよ。\n\n(1) 植物の生育には、<u>窒素</u>が欠かせない。\n(2) 乾燥空気の体積の約78％は<u>窒素</u>である。\n(3) 砂糖は、<u>炭素</u>や<u>水素</u>、<u>酸素</u>からなる物質である。\n(4) 水を電気分解すると、<u>水素</u>と<u>酸素</u>を生じる。",
              subQuestions: [
                { id: "q3_1", label: "(1)", type: "multiple_choice", options: ["元素", "単体"], correctAnswer: "元素", correctAnswerRate: 85 },
                { id: "q3_2", label: "(2)", "type": "multiple_choice", options: ["元素", "単体"], correctAnswer: "単体", correctAnswerRate: 85 },
                { id: "q3_3", label: "(3)", "type": "multiple_choice", options: ["元素", "単体"], correctAnswer: "元素", correctAnswerRate: 85 },
                { id: "q3_4", label: "(4)", "type": "multiple_choice", options: ["元素", "単体"], correctAnswer: "単体", correctAnswerRate: 85 }
              ],
              explanation: "テストで最も狙われるポイントです！ 見分けるコツは「直接触れられるもの（ガスとして実体がある、など）＝単体」、「直接触れられないもの（成分として含まれている、など）＝元素」と考えることです。(2)や(4)は気体として実体があるので単体、(1)や(3)は成分の話をしているので元素となります。",
              surroundingKnowledge: [],
              deepDiveTopics: []
            },
            {
              id: "q4",
              category: "状態変化のグラフ",
              text: "問４　下線部①は、水・エタノールの（ ア ）の加熱と、水とエタノールの（ イ ）の加熱のグラフを示したものである。この３つのグラフ①～③をそれぞれ、水のグラフ・エタノールのグラフ・水とエタノールの混合物のグラフに分類し、①～③で示せ。\n\n<img src=\"/graph.jpg\" alt=\"加熱のグラフ\" class=\"w-full max-w-md mx-auto my-4 rounded-lg shadow-sm border border-gray-200\" />",
              subQuestions: [
                { id: "q4_1", label: "水のグラフ", type: "short_answer", correctAnswer: "①", correctAnswerRate: 85 },
                { id: "q4_2", label: "エタノールのグラフ", type: "short_answer", correctAnswer: "③", correctAnswerRate: 85 },
                { id: "q4_3", label: "水とエタノールの( イ )のグラフ", type: "short_answer", correctAnswer: "②", correctAnswerRate: 85 }
              ],
              explanation: "混合物は、純物質に比べて融点・沸点・密度が安定しないことを覚えておきましょう。",
              surroundingKnowledge: [],
              deepDiveTopics: []
            }
          ]
        },
        {
          id: "c1_2",
          abstractTitle: "② 物質の分離・精製法・区別",
          realTitle: "1章 物質の構成",
          topics: ["同素体", "炎色反応", "成分元素の検出"],
          miniTest: []
        },
        {
          id: "c1_3",
          abstractTitle: "③ 粒子の熱運動と物質の三態",
          realTitle: "1章 物質の構成",
          topics: [],
          miniTest: []
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
