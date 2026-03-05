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
          miniTest: [
            {
              id: "q1",
              category: "物質の分類",
              text: "物質を構成する原子の種類を（ ① ）といい、現在およそ１２０種類が存在する。私たちの身の回りにある物質は、大きく２つに分類できる。１種類の物質からできており、一つの化学式で表すことができるものを（ ② ）といい、2種類以上の（ ② ）が混じり合っており、一つの化学式で表すことができないものを（ ③ ）という。さらに、（ ② ）の中で、１種類の（ ① ）のみからできている物質を（ ④ ）といい、２種類以上の（ ① ）からできている物質を（ ⑤ ）と呼ぶ。\n\n問１. 文中の空欄（ ① ）～（ ⑤ ）にあてはまる最も適切な語句を答えよ。",
              subQuestions: [
                { id: "q1_1", label: "①", type: "short_answer", correctAnswer: "元素" },
                { id: "q1_2", label: "②", type: "short_answer", correctAnswer: "純物質" },
                { id: "q1_3", label: "③", type: "short_answer", correctAnswer: "混合物" },
                { id: "q1_4", label: "④", type: "short_answer", correctAnswer: "単体" },
                { id: "q1_5", label: "⑤", type: "short_answer", correctAnswer: "化合物" }
              ],
              explanation: "物質の分類の全体図（フローチャート）を思い描けるかがポイントです。\n・「一つの化学式で表せるか」→ 純物質 と 混合物\n・「何種類の成分からできているか」→ 成分の種類＝元素\n・ 1種類の元素→ 単体、2種類以上の元素→ 化合物",
              surroundingKnowledge: [
                "【基本問題・類似】私たちの身の回りにある物質は、大きく2つに分類される。1種類の物質からできており、固有の化学式一つで表すことができるものを（純物質）という。一方、空気や海水のように2種類以上の（純物質）が混ざり合っており、一つの化学式で表すことができないものを（混合物）という。 さらに、（純物質）はそれを構成する成分の種類である（元素）の数によって分けられる。1種類の（元素）のみからできている物質を（単体）といい、2種類以上の（元素）からできている物質を（化合物）という。"
              ],
              deepDiveTopics: [
                "【深掘り】純物質と混合物の見分け方\n純物質は化学式で表せるもの（例：H2O, NaCl）。混合物は複数の化学式が混ざっているもの（例：空気はN2, O2などの混合物）。"
              ]
            },
            {
              id: "q2",
              category: "物質の分類",
              text: "問２. 次の(ア)～(ク)の物質を、「単体」、「化合物」、「混合物」にそれぞれ分類せよ。\n(ア) 空気  (イ) 水  (ウ) 鉄  (エ) 塩酸 (オ) 塩化ナトリウム\n(カ) 石油  (キ) 海水  (ク) 窒素",
              subQuestions: [
                { id: "q2_a", label: "(ア) 空気", type: "multiple_choice", options: ["単体", "化合物", "混合物"], correctAnswer: "混合物" },
                { id: "q2_b", label: "(イ) 水", type: "multiple_choice", options: ["単体", "化合物", "混合物"], correctAnswer: "化合物" },
                { id: "q2_c", label: "(ウ) 鉄", type: "multiple_choice", options: ["単体", "化合物", "混合物"], correctAnswer: "単体" },
                { id: "q2_d", label: "(エ) 塩酸", type: "multiple_choice", options: ["単体", "化合物", "混合物"], correctAnswer: "混合物" },
                { id: "q2_e", label: "(オ) 塩化ナトリウム", type: "multiple_choice", options: ["単体", "化合物", "混合物"], correctAnswer: "化合物" },
                { id: "q2_f", label: "(カ) 石油", type: "multiple_choice", options: ["単体", "化合物", "混合物"], correctAnswer: "混合物" },
                { id: "q2_g", label: "(キ) 海水", type: "multiple_choice", options: ["単体", "化合物", "混合物"], correctAnswer: "混合物" },
                { id: "q2_h", label: "(ク) 窒素", type: "multiple_choice", options: ["単体", "化合物", "混合物"], correctAnswer: "単体" }
              ],
              explanation: "単体は1種類の元素からなる純物質（鉄Fe、窒素N2）。化合物は2種類以上の元素からなる純物質（水H2O、塩化ナトリウムNaCl）。混合物は2種類以上の純物質が混ざったもの（空気、塩酸、石油、海水）。塩酸は塩化水素HClと水H2Oの混合物であることに注意。",
              surroundingKnowledge: [
                "単体の例：酸素(O2)、水素(H2)、金(Au)",
                "化合物の例：二酸化炭素(CO2)、アンモニア(NH3)",
                "混合物の例：牛乳、岩石、合金"
              ],
              deepDiveTopics: [
                "【深掘り】塩酸はなぜ混合物か？\n「塩酸」は化合物の「塩化水素」を水に溶かした水溶液の名称です。そのため、塩化水素と水という2つの純物質が混ざった「混合物」に分類されます。"
              ]
            },
            {
              id: "q3",
              category: "純物質と混合物の性質",
              text: "問３. 純物質と混合物の性質に関する次の文章のうち、正しいものを1つ選び、記号で答えよ。\nア. 水とエタノールを混ぜ合わせた液体の沸点は、水と同じ100℃で一定となる。\nイ. 純物質であれば、物質の量が変わっても融点や沸点、密度は常に一定である。\nウ. 混合物の密度や融点は、混じっている物質の種類が同じであれば、その割合（濃度）が変わっても常に一定である。",
              subQuestions: [
                { id: "q3_1", label: "解答", type: "multiple_choice", options: ["ア", "イ", "ウ"], correctAnswer: "イ" }
              ],
              explanation: "混合物は、混ざっている物質の種類やその割合によって融点・沸点・密度が変化します。純物質は物質の量に関わらず、融点・沸点・密度は一定です。",
              surroundingKnowledge: [
                "【標準問題・類似】水（純物質）を加熱したとき、沸点は100℃で一定になる。しかし、食塩水（混合物）を加熱すると、沸騰している間も温度は少しずつ上昇し、一定にならない。このように、混合物の沸点や融点が一定にならないのはなぜか。→混ざっている物質の種類や、その割合によって性質が変化するから。"
              ],
              deepDiveTopics: [
                "【深掘り】純物質の性質\n純物質の性質について述べた次の文のうち、誤っているものはどれか。\nア. 物質の量が変わっても、密度は常に一定である。\nイ. 加熱する火の強さを変えれば、沸点は変化する。\nウ. どのような場所で採取しても、同じ物質であれば融点は一定である。\n→ 答えは「イ」。加熱する火の強さを変えても、沸点（温度）は変化しません（沸騰するまでの時間は変わります）。"
              ]
            },
            {
              id: "q4",
              category: "純物質と混合物の定義",
              text: "問４. 身近な物質である「塩水」は混合物に分類される。その理由を「化学式」という言葉を用いて簡潔に説明せよ。",
              subQuestions: [
                { 
                  id: "q4_1", 
                  label: "解答", 
                  type: "descriptive", 
                  correctAnswer: "水と塩化ナトリウムという2種類以上の純物質が混じっており、一つの化学式で表すことができないから。", 
                  gradingCriteria: [
                    "「2種類以上の純物質が混じっている」という内容が含まれている",
                    "「一つの化学式で表せない」という内容が含まれている"
                  ] 
                }
              ],
              explanation: "混合物は複数の純物質が混ざり合ったものであり、全体を一つの化学式で表すことはできません。塩水は水(H2O)と塩化ナトリウム(NaCl)の混合物です。",
              surroundingKnowledge: [
                "【論述問題・類似】「水」は化合物であるが、「塩酸」は化合物ではなく混合物に分類される。塩酸が混合物に分類される理由を、「化学式」という言葉を用いて説明しなさい。→塩酸は塩化水素と水が混ざったものであり、一つの化学式で表すことができないから。"
              ],
              deepDiveTopics: [
                "【深掘り】化学式で表せるかどうかの判断\n純物質は必ず1つの化学式で表せます。混合物は成分ごとの化学式はありますが、全体を1つの化学式で表すことはできません。"
              ]
            },
            {
              id: "q5",
              category: "元素と単体",
              text: "問５．次の(a)～(e)の文中の下線部は、「元素」と「単体」のどちらの意味で用いられているか答えよ。\n(a) 競技用の自転車には、軽くて丈夫な<u>チタン</u>合金が使われている。\n(b) 空気中の<u>酸素</u>を吸って、二酸化炭素を吐き出す。\n(c) 水は、<u>水素</u>と<u>酸素</u>から構成されている。\n(d) ダイヤモンドと黒鉛は、どちらも<u>炭素</u>の同素体である。\n(e) 傷口の消毒に、<u>ヨウ素</u>のアルコール溶液を用いた。",
              subQuestions: [
                { id: "q5_a", label: "(a)", type: "multiple_choice", options: ["元素", "単体"], correctAnswer: "元素" },
                { id: "q5_b", label: "(b)", type: "multiple_choice", options: ["元素", "単体"], correctAnswer: "単体" },
                { id: "q5_c", label: "(c)", type: "multiple_choice", options: ["元素", "単体"], correctAnswer: "元素" },
                { id: "q5_d", label: "(d)", type: "multiple_choice", options: ["元素", "単体"], correctAnswer: "元素" },
                { id: "q5_e", label: "(e)", type: "multiple_choice", options: ["元素", "単体"], correctAnswer: "単体" }
              ],
              explanation: "直接触れられる具体的な物質（実体）なら「単体」、物質を構成する成分（概念）なら「元素」と判断します。(d)の「同素体」は同じ「元素」からなる単体のことを指します。",
              surroundingKnowledge: [
                "【論述問題・類似】水は、「水素」と「酸素」から構成されている。この文の「水素」と「酸素」は、「単体」と「元素」のどちらの意味で使われているか。また、そのように判断できる理由を説明しなさい。→ 元素。水という物質の中に、気体としての水素や酸素（単体）がそのまま存在しているわけではなく、物質を構成する成分の種類として使われている言葉だから。"
              ],
              deepDiveTopics: [
                "【深掘り】元素と単体の見分け方のコツ\n「〜の単体」と言い換えて意味が通じれば「単体」、通じなければ「元素」です。例えば「水は（水素の単体）と（酸素の単体）から構成されている」はおかしいので、この場合は「元素」です。"
              ]
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
