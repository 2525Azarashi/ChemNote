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
              text: "物質の分類と性質に関する次の文章を読み、あとの問いに答えよ。\n\n物質は、現在およそ120種類存在する原子の種類である「元素」から構成されている。物質は大きく分けると、1種類の物質でできている ( ア ) と、2種類以上の ( ア ) が混じり合った ( イ ) に分けられる。 ( ア ) は、酸素や鉄のように1種類の元素からできている ( ウ ) と、水や塩化ナトリウムのように2種類以上の元素からできている ( エ ) が存在する\n\nまた、物質を区別する上で、融点や沸点、密度といった性質も重要である。( ア ) の場合はこれらの値が物質ごとに ( オ ) となるが、( イ ) の場合は、混じっている物質の種類やその割合によって値が ( カ ) するという違いがある。この違いは、①<u>水とエタノールなどの加熱</u>で確認をすることができる。\n\n問1 文章中の空欄 ( ア ) ～ ( カ ) に入る最も適切な語句を答えよ。",
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
              text: `問４　下線部①は、水・エタノールの（ ア ）の加熱と、水とエタノールの（ イ ）の加熱のグラフを示したものである。この３つのグラフ①～③をそれぞれ、水のグラフ・エタノールのグラフ・水とエタノールの混合物のグラフに分類し、①～③で示せ。\n\n<img src="https://lh3.googleusercontent.com/d/1yxjXWysRGIgYKPMpQx_N9OWYNf_W6DvT" alt="加熱のグラフ" class="w-full max-w-md mx-auto my-4 rounded-lg shadow-sm border border-gray-200" referrerPolicy="no-referrer" />`,
              subQuestions: [
                { id: "q4_1", label: "水のグラフ", type: "multiple_choice", options: ["①", "②", "③"], correctAnswer: "①", correctAnswerRate: 85 },
                { id: "q4_2", label: "エタノールのグラフ", type: "multiple_choice", options: ["①", "②", "③"], correctAnswer: "③", correctAnswerRate: 85 },
                { id: "q4_3", label: "水とエタノールの( イ )のグラフ", type: "multiple_choice", options: ["①", "②", "③"], correctAnswer: "②", correctAnswerRate: 85 }
              ],
              explanation: "混合物は、純物質に比べて融点・沸点・密度が安定しないことを覚えておきましょう。",
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
