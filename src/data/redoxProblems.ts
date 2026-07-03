// ⑥ 酸化還元反応 — 演習問題データ
// ユーザー作成の問題集PDF「酸化還元反応　問題　.pdf」を、本アプリの practiceProblems スキーマに合わせて収録したもの。
//
// スキーマ（既存の他章と完全に同一）:
//   { id, category, text, subQuestions[], explanation, surroundingKnowledge[], deepDiveTopics[] }
//   subQuestion: { id, label, type, options?/items?, correctAnswer, correctAnswerRate? }
//
// category の接頭辞（⑥-1 〜 ⑥-7）でサブ単元に振り分けられる。

export const redoxProblems = [
  // ============================================================
  // ⑥-1 酸化還元反応とは何か（酸化数）
  // ============================================================
  {
    "id": "p_c6_1_1",
    "category": "⑥-1 酸化還元とは (問1)",
    "text": "1 酸化と還元について以下の空欄を埋めなさい。\n\n【表】各定義における「還元された」「酸化された」の対応\n・酸素：還元された＝失う ／ 酸化された＝受け取る\n・酸化数：還元された＝（ ア ） ／ 酸化された＝（ イ ）\n・水素：還元された＝（ ウ ） ／ 酸化された＝（ エ ）\n・電子：還元された＝（ オ ） ／ 酸化された＝（ カ ）",
    "subQuestions": [
      { "id": "p_c6_1_1_a", "label": "（ ア ）酸化数：還元された", "type": "multiple_choice", "options": ["大きくなる", "小さくなる", "受け取る", "失う"], "correctAnswer": "小さくなる", "correctAnswerRate": 85 },
      { "id": "p_c6_1_1_i", "label": "（ イ ）酸化数：酸化された", "type": "multiple_choice", "options": ["大きくなる", "小さくなる", "受け取る", "失う"], "correctAnswer": "大きくなる", "correctAnswerRate": 85 },
      { "id": "p_c6_1_1_u", "label": "（ ウ ）水素：還元された", "type": "multiple_choice", "options": ["大きくなる", "小さくなる", "受け取る", "失う"], "correctAnswer": "受け取る", "correctAnswerRate": 80 },
      { "id": "p_c6_1_1_e", "label": "（ エ ）水素：酸化された", "type": "multiple_choice", "options": ["大きくなる", "小さくなる", "受け取る", "失う"], "correctAnswer": "失う", "correctAnswerRate": 80 },
      { "id": "p_c6_1_1_o", "label": "（ オ ）電子：還元された", "type": "multiple_choice", "options": ["大きくなる", "小さくなる", "受け取る", "失う"], "correctAnswer": "受け取る", "correctAnswerRate": 80 },
      { "id": "p_c6_1_1_ka", "label": "（ カ ）電子：酸化された", "type": "multiple_choice", "options": ["大きくなる", "小さくなる", "受け取る", "失う"], "correctAnswer": "失う", "correctAnswerRate": 80 }
    ],
    "explanation": "▼ 解答と解説\n（ア）小さくなる （イ）大きくなる （ウ）受け取る （エ）失う （オ）受け取る （カ）失う\n\n【中学までの復習】 酸化＝酸素を受け取る反応 ／ 還元＝酸素が失われる反応\n高校では、定義の種類が増える！\n\n・酸化の定義：酸素を<u>受けとる</u>、水素を<u>失う</u>、電子を<u>失う</u>\n・還元の定義：酸素を<u>失う</u>、水素を<u>受けとる</u>、電子を<u>受けとる</u>\n\n【覚え方】 酸素の酸化と還元の逆が水素と電子\n\n<u>酸化数</u>…化学反応において原子がどれだけ電子を受け取った・失ったかを表す数\n・酸化数が大きくなる → 酸化の数値が大きくなる ＝ <u>酸化する</u>\n・酸化数が小さくなる → 酸化の数値が小さくなる ＝ <u>還元する</u>",
    "surroundingKnowledge": [],
    "deepDiveTopics": []
  },
  {
    "id": "p_c6_1_2",
    "category": "⑥-1 酸化数を求める (問2)",
    "text": "2 次の下線をつけた原子の酸化数を求めよ。ひっかけや、より複雑な多原子イオンなどを含んでいます。\n\n(1) HNO3 の N (2) H2SO3 の S (3) O3 の O (4) KMnO4 の Mn (5) Fe2O3 の Fe\n(6) SO4^2− の S (7) PO4^3− の P (8) NH4NO3 の NO3 側の N (9) NH4NO3 の NH4 側の N (10) K2CrO4 の Cr (11) BaO2 の O (12) CaC2 の C\n\n※ 解答は「+5」「−2」のように符号をつけて答えること（0 のときは 0）。",
    "subQuestions": [
      { "id": "p_c6_1_2_1", "label": "(1) HNO3 の N", "type": "short_answer", "correctAnswer": "+5", "correctAnswerRate": 85 },
      { "id": "p_c6_1_2_2", "label": "(2) H2SO3 の S", "type": "short_answer", "correctAnswer": "+4", "correctAnswerRate": 80 },
      { "id": "p_c6_1_2_3", "label": "(3) O3 の O", "type": "short_answer", "correctAnswer": "0", "correctAnswerRate": 75 },
      { "id": "p_c6_1_2_4", "label": "(4) KMnO4 の Mn", "type": "short_answer", "correctAnswer": "+7", "correctAnswerRate": 80 },
      { "id": "p_c6_1_2_5", "label": "(5) Fe2O3 の Fe", "type": "short_answer", "correctAnswer": "+3", "correctAnswerRate": 80 },
      { "id": "p_c6_1_2_6", "label": "(6) SO4^2− の S", "type": "short_answer", "correctAnswer": "+6", "correctAnswerRate": 75 },
      { "id": "p_c6_1_2_7", "label": "(7) PO4^3− の P", "type": "short_answer", "correctAnswer": "+5", "correctAnswerRate": 70 },
      { "id": "p_c6_1_2_8", "label": "(8) NH4NO3 の NO3 側の N", "type": "short_answer", "correctAnswer": "+5", "correctAnswerRate": 60 },
      { "id": "p_c6_1_2_9", "label": "(9) NH4NO3 の NH4 側の N", "type": "short_answer", "correctAnswer": "−3", "correctAnswerRate": 60 },
      { "id": "p_c6_1_2_10", "label": "(10) K2CrO4 の Cr", "type": "short_answer", "correctAnswer": "+6", "correctAnswerRate": 70 },
      { "id": "p_c6_1_2_11", "label": "(11) BaO2 の O", "type": "short_answer", "correctAnswer": "−1", "correctAnswerRate": 55 },
      { "id": "p_c6_1_2_12", "label": "(12) CaC2 の C", "type": "short_answer", "correctAnswer": "−1", "correctAnswerRate": 50 }
    ],
    "explanation": "▼ 解答と解説\n(1) HNO3：+5 … H(+1) + N + O(−2)×3 = 0 より N = +5（硝酸）\n(2) H2SO3：+4 … H(+1)×2 + S + O(−2)×3 = 0 より S = +4（亜硫酸）\n(3) O3：0 … オゾンは単体なので、原子の酸化数は無条件で 0 です。\n(4) KMnO4：+7 … K(+1) + Mn + O(−2)×4 = 0 より Mn = +7（過マンガン酸カリウム）\n(5) Fe2O3：+3 … Fe×2 + O(−2)×3 = 0 より 2Fe = +6 → Fe = +3\n(6) SO4^2−：+6 … 硫酸イオン単体。S + O(−2)×4 = −2 より S = +6\n(7) PO4^3−：+5 … リン酸イオン。P + O(−2)×4 = −3 より P = +5\n(8)(9) NH4NO3：+5 と −3\n【重要】硝酸アンモニウム NH4NO3 のように、同じ原子が2箇所にある場合は、イオンに分けて考えます。この物質は NH4+ と NO3− からできているので、(8)は NO3− 中の N として計算し +5、(9)は NH4+ 中の N として計算し −3 となります。\n(10) K2CrO4：+6 … K(+1)×2 + Cr + O(−2)×4 = 0 より Cr = +6（クロム酸カリウム）\n(11) BaO2：−1 …【例外】過酸化バリウムです。Ba は2族なので +2 が確定します。Ba(+2) + O×2 = 0 より、過酸化水素と同様に O の酸化数は −1 となります。\n(12) CaC2：−1 … Ca(+2) + C×2 = 0 より C = −1（炭化カルシウム）\n\n【Point〜酸化数の決め方〜必ず酸化数には＋をつけること】\n❶ 単体：全ての原子の酸化数は 0（例：Cu、Fe、Au は全部 0）\n　 単体のイオン：酸化数はイオンの価数（例：Fe2+ の酸化数は +2、Fe3+ の酸化数は +3）\n❷ 化合物：全ての原子の酸化数の和は 0\n　 化合物のイオン：全ての原子の酸化数の和はイオンの価数\n【化合物を構成する原子の酸化数（優先順）】\n1. 水素 +1（必ず＋は必要）例：HCl → H[+1] Cl[−1]　例外：NaH → Na(+1) H(−1)（アルカリ金属が優先される）\n2. 酸素 −2　例：H2O　例外：H2O2 → O は −1（水素が優先される）\n3. フッ素 −1　例：HF\n4. アルカリ金属 +1　例：Na2O\n5. アルカリ土類金属 +2　例：MgO",
    "surroundingKnowledge": [],
    "deepDiveTopics": []
  },
  {
    "id": "p_c6_1_3",
    "category": "⑥-1 酸化数の変化 (問3)",
    "text": "3 次の化学反応式中の下線部の原子それぞれについて、酸化数の変化（例：+2 → 0）を踏まえて、「酸化された」「還元された」「どちらでもない」のいずれかで答えよ。\n\n(1) 2Al + 3H2SO4 ⟶ Al2(SO4)3 + 3H2 （Al）\n(2) K2Cr2O7 + 4H2SO4 + 3H2O2 ⟶ K2SO4 + Cr2(SO4)3 + 7H2O + 3O2 （過酸化水素の O）\n(3) Cu + 4HNO3(濃) ⟶ Cu(NO3)2 + 2H2O + 2NO2 （HNO3 の N）\n(4) Cl2 + 2KBr ⟶ 2KCl + Br2 （KBr の Br）\n(5) 3NO2 + H2O ⟶ 2HNO3 + NO （NO2 の N）",
    "subQuestions": [
      { "id": "p_c6_1_3_1", "label": "(1) Al", "type": "multiple_choice", "options": ["酸化された", "還元された", "どちらでもない", "酸化も還元も両方された"], "correctAnswer": "酸化された", "correctAnswerRate": 80 },
      { "id": "p_c6_1_3_2", "label": "(2) 過酸化水素の O", "type": "multiple_choice", "options": ["酸化された", "還元された", "どちらでもない", "酸化も還元も両方された"], "correctAnswer": "酸化された", "correctAnswerRate": 60 },
      { "id": "p_c6_1_3_3", "label": "(3) HNO3 の N", "type": "multiple_choice", "options": ["酸化された", "還元された", "どちらでもない", "酸化も還元も両方された"], "correctAnswer": "還元された", "correctAnswerRate": 65 },
      { "id": "p_c6_1_3_4", "label": "(4) KBr の Br", "type": "multiple_choice", "options": ["酸化された", "還元された", "どちらでもない", "酸化も還元も両方された"], "correctAnswer": "酸化された", "correctAnswerRate": 70 },
      { "id": "p_c6_1_3_5", "label": "(5) NO2 の N", "type": "multiple_choice", "options": ["酸化された", "還元された", "どちらでもない", "酸化も還元も両方された"], "correctAnswer": "酸化も還元も両方された", "correctAnswerRate": 45 }
    ],
    "explanation": "▼ 解答と解説\n(1) 変化：0 ⟶ +3 ／ 答：酸化された\n単体の Al（0）から、化合物中の Al3+（+3）へ酸化数が増加しています。\n\n(2) 変化：−1 ⟶ 0 ／ 答：酸化された\n強力な酸化剤（二クロム酸カリウム）と反応しているため、H2O2 中の O（−1）は電子を奪われて単体の O2（0）になります。酸化数が増加しているので「酸化された」になります（＝自身は還元剤として働いています）。\n\n(3) 変化：+5 ⟶ +4（および +5 のまま）／ 答：還元された\n硝酸中の N（+5）の一部は、NO2（+4）へと酸化数が減少するため「還元された」が正解です。なお、残りの半分は酸化数 +5 のまま Cu(NO3)2 に入っています。\n\n(4) 変化：−1 ⟶ 0 ／ 答：酸化された\nハロゲンの単体の酸化力の強さは Cl2 > Br2 なので、Cl2 が相手から電子を奪います。そのため、KBr 中の Br−（−1）は電子を失って単体の Br2（0）になり、酸化数が増加しています。\n\n(5) 変化：+4 ⟶ +5 と +2 ／ 答：酸化された、かつ還元された\nこれが入試で差がつく<u>不均化反応（自己酸化還元反応）</u>です。反応前の NO2 中の N は +4 ですが、これが HNO3（+5：酸化された）と NO（+2：還元された）に同時に分かれます。そのため、下線部の原子は酸化も還元も両方されているということになります。",
    "surroundingKnowledge": [],
    "deepDiveTopics": []
  },
  {
    "id": "p_c6_1_4",
    "category": "⑥-1 用語の確認 (問4)",
    "text": "4 次の [ ア ] 〜 [ ケ ] にあてはまる語句を下の解答群より選べ。\n\n一般に、物質が電子を失う変化を [ ア ] といい、電子を受け取る変化を [ イ ] という。\n反応前後で各原子の [ ウ ] を比較したとき、その値が増加していれば [ ア ] されたといい、減少していれば [ イ ] されたという。\nたとえば、硫酸鉄(II) FeSO4 水溶液に塩素ガス Cl2 を吹き込むと、鉄(II)イオンは [ エ ] されて鉄(III)イオンになり、その [ ウ ] は [ オ ] から [ カ ] に変化する。\nこのとき、塩素は相手を [ エ ] するので [ キ ] として働いており、鉄(II)イオンは相手を [ ク ] するので [ ケ ] として働いている。\n\n〔解答群〕 ① 酸化 ② 還元 ③ 酸化数 ④ 質量数 ⑤ 酸化剤 ⑥ 還元剤 ⑦ 0 ⑧ ＋1 ⑨ ＋2 ⑩ ＋3",
    "subQuestions": [
      { "id": "p_c6_1_4_a", "label": "[ ア ]", "type": "multiple_choice", "options": ["① 酸化", "② 還元", "③ 酸化数", "④ 質量数", "⑤ 酸化剤", "⑥ 還元剤"], "correctAnswer": "① 酸化", "correctAnswerRate": 85 },
      { "id": "p_c6_1_4_i", "label": "[ イ ]", "type": "multiple_choice", "options": ["① 酸化", "② 還元", "③ 酸化数", "④ 質量数", "⑤ 酸化剤", "⑥ 還元剤"], "correctAnswer": "② 還元", "correctAnswerRate": 85 },
      { "id": "p_c6_1_4_u", "label": "[ ウ ]", "type": "multiple_choice", "options": ["① 酸化", "② 還元", "③ 酸化数", "④ 質量数"], "correctAnswer": "③ 酸化数", "correctAnswerRate": 85 },
      { "id": "p_c6_1_4_e", "label": "[ エ ]", "type": "multiple_choice", "options": ["① 酸化", "② 還元"], "correctAnswer": "① 酸化", "correctAnswerRate": 75 },
      { "id": "p_c6_1_4_o", "label": "[ オ ]", "type": "multiple_choice", "options": ["⑦ 0", "⑧ ＋1", "⑨ ＋2", "⑩ ＋3"], "correctAnswer": "⑨ ＋2", "correctAnswerRate": 80 },
      { "id": "p_c6_1_4_ka", "label": "[ カ ]", "type": "multiple_choice", "options": ["⑦ 0", "⑧ ＋1", "⑨ ＋2", "⑩ ＋3"], "correctAnswer": "⑩ ＋3", "correctAnswerRate": 80 },
      { "id": "p_c6_1_4_ki", "label": "[ キ ]", "type": "multiple_choice", "options": ["⑤ 酸化剤", "⑥ 還元剤"], "correctAnswer": "⑤ 酸化剤", "correctAnswerRate": 75 },
      { "id": "p_c6_1_4_ku", "label": "[ ク ]", "type": "multiple_choice", "options": ["① 酸化", "② 還元"], "correctAnswer": "② 還元", "correctAnswerRate": 70 },
      { "id": "p_c6_1_4_ke", "label": "[ ケ ]", "type": "multiple_choice", "options": ["⑤ 酸化剤", "⑥ 還元剤"], "correctAnswer": "⑥ 還元剤", "correctAnswerRate": 75 }
    ],
    "explanation": "▼ 解答と解説\nア：酸化　イ：還元　ウ：酸化数　エ：酸化　オ：＋2（Fe2+ の酸化数）　カ：＋3（Fe3+ の酸化数）　キ：酸化剤　ク：還元　ケ：還元剤\n\n電子を<u>失う</u>変化が酸化、電子を<u>受け取る</u>変化が還元です。\nFe2+ は Cl2 に電子を奪われて Fe3+ になる（酸化される）ので、酸化数は +2 から +3 に増加します。\n相手を酸化する塩素は<u>酸化剤</u>、相手（塩素）を還元する Fe2+ は<u>還元剤</u>として働いています。",
    "surroundingKnowledge": [],
    "deepDiveTopics": []
  },
  {
    "id": "p_c6_1_5",
    "category": "⑥-1 用語の確認 (問5)",
    "text": "5 [ ア ] 〜 [ ケ ] にあてはまる語句を解答群より選べ。\n\n一般に、物質が電子を失う反応を [ ア ] という。反応前後で原子の [ イ ] が減少していれば、その原子は [ ウ ] されたという。\n過酸化水素 H2O2 中の酸素原子の [ イ ] は [ エ ] であり、これが強い酸化剤と反応すると [ オ ] を発生する。このとき、酸素原子の [ イ ] は [ カ ] に変化しているため、過酸化水素は [ キ ] として働いたことになる。\n酸化還元反応において、[ ク ] は電子を相手に与えて自身は [ ア ] される物質である。二酸化窒素 NO2 が水と反応して硝酸と一酸化窒素が生成する反応では、NO2 自身が [ ク ] と [ ケ ] の両方の役割を同時に果たしている。\n\n〔解答群〕 ① 酸化 ② 還元 ③ 酸化数 ④ イオン化傾向 ⑤ 酸化剤 ⑥ 還元剤 ⑦ 水素 ⑧ 酸素 ⑨ 0 ⑩ +1 ⑪ −1 ⑫ +2 ⑬ −2",
    "subQuestions": [
      { "id": "p_c6_1_5_a", "label": "[ ア ]", "type": "multiple_choice", "options": ["① 酸化", "② 還元", "③ 酸化数", "④ イオン化傾向"], "correctAnswer": "① 酸化", "correctAnswerRate": 85 },
      { "id": "p_c6_1_5_i", "label": "[ イ ]", "type": "multiple_choice", "options": ["① 酸化", "② 還元", "③ 酸化数", "④ イオン化傾向"], "correctAnswer": "③ 酸化数", "correctAnswerRate": 85 },
      { "id": "p_c6_1_5_u", "label": "[ ウ ]", "type": "multiple_choice", "options": ["① 酸化", "② 還元"], "correctAnswer": "② 還元", "correctAnswerRate": 80 },
      { "id": "p_c6_1_5_e", "label": "[ エ ]", "type": "multiple_choice", "options": ["⑨ 0", "⑩ +1", "⑪ −1", "⑫ +2", "⑬ −2"], "correctAnswer": "⑪ −1", "correctAnswerRate": 60 },
      { "id": "p_c6_1_5_o", "label": "[ オ ]", "type": "multiple_choice", "options": ["⑦ 水素", "⑧ 酸素"], "correctAnswer": "⑧ 酸素", "correctAnswerRate": 70 },
      { "id": "p_c6_1_5_ka", "label": "[ カ ]", "type": "multiple_choice", "options": ["⑨ 0", "⑩ +1", "⑪ −1", "⑫ +2", "⑬ −2"], "correctAnswer": "⑨ 0", "correctAnswerRate": 65 },
      { "id": "p_c6_1_5_ki", "label": "[ キ ]", "type": "multiple_choice", "options": ["⑤ 酸化剤", "⑥ 還元剤"], "correctAnswer": "⑥ 還元剤", "correctAnswerRate": 65 },
      { "id": "p_c6_1_5_ku", "label": "[ ク ]", "type": "multiple_choice", "options": ["⑤ 酸化剤", "⑥ 還元剤"], "correctAnswer": "⑥ 還元剤", "correctAnswerRate": 60 },
      { "id": "p_c6_1_5_ke", "label": "[ ケ ]", "type": "multiple_choice", "options": ["⑤ 酸化剤", "⑥ 還元剤"], "correctAnswer": "⑤ 酸化剤", "correctAnswerRate": 60 }
    ],
    "explanation": "▼ 解答と解説\nア：酸化（電子を失う＝酸化）　イ：酸化数　ウ：還元（酸化数が減少＝還元された）\nエ：−1（過酸化水素の O の酸化数は例外的に −1）　オ：酸素（還元剤として働くと O2 になる）\nカ：0（単体の O2 の酸化数は 0）　キ：還元剤　ク：還元剤（電子を相手に与える＝相手を還元する）\nケ：酸化剤（NO2 の不均化反応では、自身が酸化剤と還元剤を兼ねます）\n\n過酸化水素 H2O2 は通常は酸化剤ですが、KMnO4 のような最強クラスの酸化剤と出会うと還元剤に回り、O2 を発生します。O の酸化数は −1 → 0 に増加しています。",
    "surroundingKnowledge": [],
    "deepDiveTopics": []
  },
  {
    "id": "p_c6_1_6",
    "category": "⑥-1 酸化剤・還元剤の分類 (問6)",
    "text": "6 次の(ア)〜(キ)の反応において、酸化還元反応ではないものをすべて選べ。また、下線部①〜⑩の物質を次のように分類し、記号を書け。\n酸化剤 ⋯ ◯　還元剤 ⋯ Ⓡ　酸化剤・還元剤を含まない ⋯ ×\n\n(ア) 2Na2S2O3（①） + I2 ⟶ Na2S4O6 + 2NaI\n(イ) Fe3O4（②） + 8HCl ⟶ FeCl2 + 2FeCl3 + 4H2O\n(ウ) SO2（③） + 2H2S（④） ⟶ 3S + 2H2O\n(エ) Cr2O7^2−（⑤） + 2OH− ⟶ 2CrO4^2− + H2O\n(オ) Cu + 4HNO3（⑥）(濃) ⟶ Cu(NO3)2 + 2H2O + 2NO2\n(カ) NH4Cl（⑦） + NaOH ⟶ NaCl + H2O + NH3（⑧）\n(キ) 2KMnO4（⑨） + 5H2O2（⑩） + 3H2SO4 ⟶ 2MnSO4 + 5O2 + K2SO4 + 8H2O",
    "subQuestions": [
      { "id": "p_c6_1_6_x", "label": "酸化還元反応ではないもの（すべて選択）", "type": "multiple_choice", "options": ["(ア)", "(イ)", "(ウ)", "(エ)", "(オ)", "(カ)", "(キ)"], "correctAnswer": "(イ)・(エ)・(カ)", "correctAnswerRate": 50 },
      { "id": "p_c6_1_6_1", "label": "① Na2S2O3", "type": "multiple_choice", "options": ["◯ 酸化剤", "Ⓡ 還元剤", "× 含まない"], "correctAnswer": "Ⓡ 還元剤", "correctAnswerRate": 55 },
      { "id": "p_c6_1_6_2", "label": "② Fe3O4", "type": "multiple_choice", "options": ["◯ 酸化剤", "Ⓡ 還元剤", "× 含まない"], "correctAnswer": "× 含まない", "correctAnswerRate": 55 },
      { "id": "p_c6_1_6_3", "label": "③ SO2", "type": "multiple_choice", "options": ["◯ 酸化剤", "Ⓡ 還元剤", "× 含まない"], "correctAnswer": "◯ 酸化剤", "correctAnswerRate": 55 },
      { "id": "p_c6_1_6_4", "label": "④ H2S", "type": "multiple_choice", "options": ["◯ 酸化剤", "Ⓡ 還元剤", "× 含まない"], "correctAnswer": "Ⓡ 還元剤", "correctAnswerRate": 60 },
      { "id": "p_c6_1_6_5", "label": "⑤ Cr2O7^2−", "type": "multiple_choice", "options": ["◯ 酸化剤", "Ⓡ 還元剤", "× 含まない"], "correctAnswer": "× 含まない", "correctAnswerRate": 50 },
      { "id": "p_c6_1_6_6", "label": "⑥ HNO3", "type": "multiple_choice", "options": ["◯ 酸化剤", "Ⓡ 還元剤", "× 含まない"], "correctAnswer": "◯ 酸化剤", "correctAnswerRate": 65 },
      { "id": "p_c6_1_6_7", "label": "⑦ NH4Cl", "type": "multiple_choice", "options": ["◯ 酸化剤", "Ⓡ 還元剤", "× 含まない"], "correctAnswer": "× 含まない", "correctAnswerRate": 60 },
      { "id": "p_c6_1_6_8", "label": "⑧ NH3", "type": "multiple_choice", "options": ["◯ 酸化剤", "Ⓡ 還元剤", "× 含まない"], "correctAnswer": "× 含まない", "correctAnswerRate": 60 },
      { "id": "p_c6_1_6_9", "label": "⑨ KMnO4", "type": "multiple_choice", "options": ["◯ 酸化剤", "Ⓡ 還元剤", "× 含まない"], "correctAnswer": "◯ 酸化剤", "correctAnswerRate": 70 },
      { "id": "p_c6_1_6_10", "label": "⑩ H2O2", "type": "multiple_choice", "options": ["◯ 酸化剤", "Ⓡ 還元剤", "× 含まない"], "correctAnswer": "Ⓡ 還元剤", "correctAnswerRate": 55 }
    ],
    "explanation": "▼ 解答と解説\n【酸化還元反応ではないもの】（イ）（エ）（カ）\n（イ）Fe3O4 は FeO と Fe2O3 の混合物。塩酸との反応前後で各鉄原子の酸化数は +2, +3 のまま変化していないため、酸・塩基反応です。\n（エ）二クロム酸イオンからクロム酸イオンへの変化は、Cr の酸化数が +6 のままで変わらない、液性による平衡移動です。\n（カ）弱塩基の遊離反応であり、各原子の酸化数は変化していません。\n\n【下線部の分類】\n① Na2S2O3：Ⓡ 還元剤（S の平均酸化数が +2 → +2.5 に増加しているため）\n② Fe3O4：×（反応自体が酸化還元反応ではないため）\n③ SO2：◯ 酸化剤（S の酸化数が +4 → 0 に減少しているため）\n④ H2S：Ⓡ 還元剤（S の酸化数が −2 → 0 に増加しているため）\n⑤ Cr2O7^2−：×（反応自体が酸化還元反応ではないため）\n⑥ HNO3：◯ 酸化剤（銅を溶かす酸化剤として働いています。一部は酸のまま塩になっています）\n⑦ NH4Cl：×（反応自体が酸化還元反応ではないため）\n⑧ NH3：×（同上）\n⑨ KMnO4：◯ 酸化剤（Mn の酸化数が +7 → +2 に減少しているため）\n⑩ H2O2：Ⓡ 還元剤（KMnO4 に対しては還元剤として働き、O の酸化数が −1 → 0 に増加）\n\n<u>酸化剤</u>…相手を酸化させて、自身は還元する物質\n<u>還元剤</u>…相手を還元させて、自身は酸化する物質\n→ 反応の前後での酸化数の変化に注目する\n\n【例題】MnO2 + 4HCl → MnCl2 + 2H2O + Cl2 において酸化剤としてはたらいている物質は？\n→ Mn の酸化数は +4 から +2 に減少するから、MnO2（酸化マンガン(IV)）が酸化剤になる。",
    "surroundingKnowledge": [],
    "deepDiveTopics": []
  },
  {
    "id": "p_c6_2_1",
    "category": "⑥-2 半反応式（酸化剤） (問1)",
    "text": "1 次の(1)〜(11)の各式に電子 e−、および必要であれば H+ や H2O を書き加えて、酸化剤の半反応式を完成させよ。\n(1) Cl2 ⟶ Cl−\n(2) O2 ⟶ H2O\n(3) O3 ⟶ O2 + H2O\n(4) H2O2 ⟶ H2O\n(5) SO2 ⟶ S\n(6) H2SO4(熱濃) ⟶ SO2\n(7) HNO3(希) ⟶ NO\n(8) HNO3(濃) ⟶ NO2\n(9) MnO2 ⟶ Mn2+\n(10) MnO4^− ⟶ Mn2+\n(11) Cr2O7^2− ⟶ Cr3+",
    "subQuestions": [
      { "id": "p_c6_2_1_1", "label": "(1) Cl2 ⟶ Cl−", "type": "descriptive", "correctAnswer": "Cl2 + 2e− ⟶ 2Cl−", "correctAnswerRate": 70 },
      { "id": "p_c6_2_1_2", "label": "(2) O2 ⟶ H2O", "type": "descriptive", "correctAnswer": "O2 + 4H+ + 4e− ⟶ 2H2O", "correctAnswerRate": 55 },
      { "id": "p_c6_2_1_3", "label": "(3) O3 ⟶ O2 + H2O", "type": "descriptive", "correctAnswer": "O3 + 2H+ + 2e− ⟶ O2 + H2O", "correctAnswerRate": 50 },
      { "id": "p_c6_2_1_4", "label": "(4) H2O2 ⟶ H2O", "type": "descriptive", "correctAnswer": "H2O2 + 2H+ + 2e− ⟶ 2H2O", "correctAnswerRate": 60 },
      { "id": "p_c6_2_1_5", "label": "(5) SO2 ⟶ S", "type": "descriptive", "correctAnswer": "SO2 + 4H+ + 4e− ⟶ S + 2H2O", "correctAnswerRate": 50 },
      { "id": "p_c6_2_1_6", "label": "(6) H2SO4(熱濃) ⟶ SO2", "type": "descriptive", "correctAnswer": "H2SO4 + 2H+ + 2e− ⟶ SO2 + 2H2O", "correctAnswerRate": 50 },
      { "id": "p_c6_2_1_7", "label": "(7) HNO3(希) ⟶ NO", "type": "descriptive", "correctAnswer": "HNO3 + 3H+ + 3e− ⟶ NO + 2H2O", "correctAnswerRate": 55 },
      { "id": "p_c6_2_1_8", "label": "(8) HNO3(濃) ⟶ NO2", "type": "descriptive", "correctAnswer": "HNO3 + H+ + e− ⟶ NO2 + H2O", "correctAnswerRate": 55 },
      { "id": "p_c6_2_1_9", "label": "(9) MnO2 ⟶ Mn2+", "type": "descriptive", "correctAnswer": "MnO2 + 4H+ + 2e− ⟶ Mn2+ + 2H2O", "correctAnswerRate": 55 },
      { "id": "p_c6_2_1_10", "label": "(10) MnO4^− ⟶ Mn2+", "type": "descriptive", "correctAnswer": "MnO4^− + 8H+ + 5e− ⟶ Mn2+ + 4H2O", "correctAnswerRate": 60 },
      { "id": "p_c6_2_1_11", "label": "(11) Cr2O7^2− ⟶ Cr3+", "type": "descriptive", "correctAnswer": "Cr2O7^2− + 14H+ + 6e− ⟶ 2Cr3+ + 7H2O", "correctAnswerRate": 45 }
    ],
    "explanation": "▼ 解答と解説\n(1) Cl2 + 2e− ⟶ 2Cl−\n(2) O2 + 4H+ + 4e− ⟶ 2H2O\n(3) O3 + 2H+ + 2e− ⟶ O2 + H2O\n(4) H2O2 + 2H+ + 2e− ⟶ 2H2O\n(5) SO2 + 4H+ + 4e− ⟶ S + 2H2O\n(6) H2SO4 + 2H+ + 2e− ⟶ SO2 + 2H2O\n(7) HNO3 + 3H+ + 3e− ⟶ NO + 2H2O\n(8) HNO3 + H+ + e− ⟶ NO2 + H2O\n(9) MnO2 + 4H+ + 2e− ⟶ Mn2+ + 2H2O\n(10) MnO4^− + 8H+ + 5e− ⟶ Mn2+ + 4H2O\n(11) Cr2O7^2− + 14H+ + 6e− ⟶ 2Cr3+ + 7H2O\n\n【半反応式の作り方】\n① 酸化剤・還元剤を特定し、「反応前の物質 → 反応後の物質」を作る\n② 矢印の前後で酸素・水素以外の原子の数を合わせる\n③ 酸素の数が矢印の前後で同じになるように、水（H2O）を加える\n④ 水素の数が矢印の前後で同じになるように、水素イオン（H+）を加える\n⑤ 矢印の前後の電荷（価数）が同じになるように e− を加える",
    "surroundingKnowledge": [],
    "deepDiveTopics": []
  },
  {
    "id": "p_c6_2_2",
    "category": "⑥-2 半反応式（還元剤） (問2)",
    "text": "2 次の(1)〜(8)の各式に電子 e−、および必要であれば H+ や H2O を書き加えて、還元剤の半反応式を完成させよ。\n(1) Na ⟶ Na+\n(2) Fe2+ ⟶ Fe3+\n(3) I− ⟶ I2\n(4) H2S ⟶ S\n(5) H2 ⟶ H+\n(6) H2O2 ⟶ O2\n(7) SO2 ⟶ SO4^2−\n(8) H2C2O4 ⟶ CO2",
    "subQuestions": [
      { "id": "p_c6_2_2_1", "label": "(1) Na ⟶ Na+", "type": "descriptive", "correctAnswer": "Na ⟶ Na+ + e−", "correctAnswerRate": 75 },
      { "id": "p_c6_2_2_2", "label": "(2) Fe2+ ⟶ Fe3+", "type": "descriptive", "correctAnswer": "Fe2+ ⟶ Fe3+ + e−", "correctAnswerRate": 70 },
      { "id": "p_c6_2_2_3", "label": "(3) I− ⟶ I2", "type": "descriptive", "correctAnswer": "2I− ⟶ I2 + 2e−", "correctAnswerRate": 65 },
      { "id": "p_c6_2_2_4", "label": "(4) H2S ⟶ S", "type": "descriptive", "correctAnswer": "H2S ⟶ S + 2H+ + 2e−", "correctAnswerRate": 60 },
      { "id": "p_c6_2_2_5", "label": "(5) H2 ⟶ H+", "type": "descriptive", "correctAnswer": "H2 ⟶ 2H+ + 2e−", "correctAnswerRate": 70 },
      { "id": "p_c6_2_2_6", "label": "(6) H2O2 ⟶ O2", "type": "descriptive", "correctAnswer": "H2O2 ⟶ O2 + 2H+ + 2e−", "correctAnswerRate": 55 },
      { "id": "p_c6_2_2_7", "label": "(7) SO2 ⟶ SO4^2−", "type": "descriptive", "correctAnswer": "SO2 + 2H2O ⟶ SO4^2− + 4H+ + 2e−", "correctAnswerRate": 45 },
      { "id": "p_c6_2_2_8", "label": "(8) H2C2O4 ⟶ CO2", "type": "descriptive", "correctAnswer": "H2C2O4 ⟶ 2CO2 + 2H+ + 2e−", "correctAnswerRate": 50 }
    ],
    "explanation": "▼ 解答と解説\n(1) Na ⟶ Na+ + e−\n(2) Fe2+ ⟶ Fe3+ + e−\n(3) 2I− ⟶ I2 + 2e−\n(4) H2S ⟶ S + 2H+ + 2e−\n(5) H2 ⟶ 2H+ + 2e−\n(6) H2O2 ⟶ O2 + 2H+ + 2e−\n(7) SO2 + 2H2O ⟶ SO4^2− + 4H+ + 2e−\n(8) H2C2O4 ⟶ 2CO2 + 2H+ + 2e−\n\n還元剤は電子 e− を「放出する」側なので、e− は矢印の右側（生成物側）に書きます。作り方の手順は酸化剤の半反応式と同じです。\nなお、H2O2 と SO2 は相手によって酸化剤にも還元剤にもなる代表的な物質です。",
    "surroundingKnowledge": [],
    "deepDiveTopics": []
  },
  {
    "id": "p_c6_2_3",
    "category": "⑥-2 酸化還元反応の化学反応式 (問3)",
    "text": "3 次の(1)〜(5)の酸化剤・還元剤の組み合わせについて、最終的な化学反応式を完成させよ。（※すべて硫酸酸性（H2SO4 を使用）での反応とします）\n\n(1) 希硝酸 HNO3 と 硫酸鉄(II) FeSO4\nHNO3 + 3H+ + 3e− ⟶ NO + 2H2O\nFe2+ ⟶ Fe3+ + e−\n\n(2) 過酸化水素 H2O2 と ヨウ化カリウム KI\nH2O2 + 2H+ + 2e− ⟶ 2H2O\n2I− ⟶ I2 + 2e−\n\n(3) 二クロム酸カリウム K2Cr2O7 と 硫化水素 H2S\nCr2O7^2− + 14H+ + 6e− ⟶ 2Cr3+ + 7H2O\nH2S ⟶ S + 2H+ + 2e−\n\n(4) 過マンガン酸カリウム KMnO4 と シュウ酸 H2C2O4\nMnO4^− + 8H+ + 5e− ⟶ Mn2+ + 4H2O\nH2C2O4 ⟶ 2CO2 + 2H+ + 2e−\n\n(5) 濃硝酸 HNO3 と 銅 Cu\nHNO3 + H+ + e− ⟶ NO2 + H2O\nCu ⟶ Cu2+ + 2e−",
    "subQuestions": [
      { "id": "p_c6_2_3_1", "label": "(1) 希硝酸 と 硫酸鉄(II)", "type": "descriptive", "correctAnswer": "2HNO3 + 6FeSO4 + 3H2SO4 ⟶ 2NO + 4H2O + 3Fe2(SO4)3", "correctAnswerRate": 35 },
      { "id": "p_c6_2_3_2", "label": "(2) 過酸化水素 と ヨウ化カリウム", "type": "descriptive", "correctAnswer": "H2O2 + 2KI + H2SO4 ⟶ 2H2O + I2 + K2SO4", "correctAnswerRate": 45 },
      { "id": "p_c6_2_3_3", "label": "(3) 二クロム酸カリウム と 硫化水素", "type": "descriptive", "correctAnswer": "K2Cr2O7 + 3H2S + 4H2SO4 ⟶ Cr2(SO4)3 + 3S + 7H2O + K2SO4", "correctAnswerRate": 30 },
      { "id": "p_c6_2_3_4", "label": "(4) 過マンガン酸カリウム と シュウ酸", "type": "descriptive", "correctAnswer": "2KMnO4 + 5H2C2O4 + 3H2SO4 ⟶ 2MnSO4 + 10CO2 + 8H2O + K2SO4", "correctAnswerRate": 35 },
      { "id": "p_c6_2_3_5", "label": "(5) 濃硝酸 と 銅", "type": "descriptive", "correctAnswer": "Cu + 4HNO3 ⟶ Cu(NO3)2 + 2NO2 + 2H2O", "correctAnswerRate": 45 }
    ],
    "explanation": "▼ 解答と解説\n(1) 2HNO3 + 6FeSO4 + 3H2SO4 ⟶ 2NO + 4H2O + 3Fe2(SO4)3\n(2) H2O2 + 2KI + H2SO4 ⟶ 2H2O + I2 + K2SO4\n(3) K2Cr2O7 + 3H2S + 4H2SO4 ⟶ Cr2(SO4)3 + 3S + 7H2O + K2SO4\n(4) 2KMnO4 + 5H2C2O4 + 3H2SO4 ⟶ 2MnSO4 + 10CO2 + 8H2O + K2SO4\n(5) Cu + 4HNO3 ⟶ Cu(NO3)2 + 2NO2 + 2H2O\n\n【酸化還元反応の化学反応式の作り方】\n⑥ 酸化剤と還元剤の半反応式を、授受される電子の数が等しくなるように整数倍して足し合わせ、電子と一部の H+ を打ち消す\n① イオン反応式のイオンを元の物質（塩）に戻すために必要なイオンを推測する\n② 必要なイオン（K+ や SO4^2− など）を両辺に加えて化学反応式を完成させる",
    "surroundingKnowledge": [],
    "deepDiveTopics": []
  },
  {
    "id": "p_c6_2_4",
    "category": "⑥-2 SO2・H2O2 のはたらき (問4)",
    "text": "4 次の各反応において、下線部の物質（二酸化硫黄 SO2 または過酸化水素 H2O2）が、酸化剤として働いた場合は A、還元剤として働いた場合は B、どちらでもない場合は C と記せ。\n\n(ア) 硫酸酸性の過マンガン酸カリウム水溶液に<u>二酸化硫黄</u>を吹き込むと、溶液の赤紫色が消えた。\n(イ) 硫酸酸性の過マンガン酸カリウム水溶液に<u>過酸化水素水</u>を加えると、気体が発生して溶液の赤紫色が消えた。\n(ウ) <u>過酸化水素水</u>に少量の二酸化マンガン（粉末）を加えると、激しく気体が発生した。\n(エ) 酸化カルシウムの固体を容器に入れ、そこに<u>二酸化硫黄</u>を通すと、亜硫酸カルシウムが生成した。\n(オ) 硫酸鉄(II)水溶液に<u>過酸化水素水</u>を加えると、溶液が黄褐色（鉄(III)イオンの色）に変化した。",
    "subQuestions": [
      { "id": "p_c6_2_4_1", "label": "(ア) KMnO4 水溶液 + SO2", "type": "multiple_choice", "options": ["A（酸化剤）", "B（還元剤）", "C（どちらでもない）", "AとBの両方"], "correctAnswer": "B（還元剤）", "correctAnswerRate": 55 },
      { "id": "p_c6_2_4_2", "label": "(イ) KMnO4 水溶液 + H2O2", "type": "multiple_choice", "options": ["A（酸化剤）", "B（還元剤）", "C（どちらでもない）", "AとBの両方"], "correctAnswer": "B（還元剤）", "correctAnswerRate": 55 },
      { "id": "p_c6_2_4_3", "label": "(ウ) H2O2 + MnO2（触媒）", "type": "multiple_choice", "options": ["A（酸化剤）", "B（還元剤）", "C（どちらでもない）", "AとBの両方"], "correctAnswer": "AとBの両方", "correctAnswerRate": 35 },
      { "id": "p_c6_2_4_4", "label": "(エ) CaO + SO2", "type": "multiple_choice", "options": ["A（酸化剤）", "B（還元剤）", "C（どちらでもない）", "AとBの両方"], "correctAnswer": "C（どちらでもない）", "correctAnswerRate": 50 },
      { "id": "p_c6_2_4_5", "label": "(オ) FeSO4 水溶液 + H2O2", "type": "multiple_choice", "options": ["A（酸化剤）", "B（還元剤）", "C（どちらでもない）", "AとBの両方"], "correctAnswer": "A（酸化剤）", "correctAnswerRate": 55 }
    ],
    "explanation": "▼ 解答と解説\n(ア) 答：B（還元剤）\n過マンガン酸カリウム KMnO4 は非常に強力な酸化剤です。これと出会った SO2 は電子を奪われ、SO4^2−（S の酸化数 +6）へと酸化されます。相手を還元して赤紫色を消しているため、還元剤です。\n\n(イ) 答：B（還元剤）\n過酸化水素 H2O2 も通常は酸化剤ですが、最強クラスの酸化剤である KMnO4 が相手のときは電子を放出して単体の酸素 O2（酸化数 0）になります。H2O2 中の O の酸化数が −1 → 0 と増加しているため、還元剤です。\n\n(ウ) 答：A と B の両方（自己酸化還元）\n二酸化マンガン MnO2 はここでは「触媒」として働いています。この反応では 2H2O2 ⟶ 2H2O + O2 という分解が起きています。H2O2 中の O（−1）の一方は H2O（−2：還元された）になり、もう一方は O2（0：酸化された）になります。1つの物質が同時に酸化剤と還元剤の役目をこなしている（自己酸化還元反応）ため、A でもあり B でもあるというひっかけ問題です。\n\n(エ) 答：C（どちらでもない）\n反応式は CaO + SO2 ⟶ CaSO3 です。塩基性酸化物（CaO）と酸性酸化物（SO2）による、ただの酸・塩基反応（中和を伴う塩の生成）です。SO2 中の S の酸化数は +4 のまま変わっていません。\n\n(オ) 答：A（酸化剤）\n硫酸鉄(II)中の Fe2+ は、電子を放出して Fe3+ になりたがる代表的な還元剤です。これに出会った H2O2 は、本来の強い酸化力を発揮して相手から電子を奪い、自身は H2O（酸化数 −2）へと還元されます。よって酸化剤として働いています。",
    "surroundingKnowledge": [],
    "deepDiveTopics": []
  },
  {
    "id": "p_c6_3_1",
    "category": "⑥-3 酸化還元滴定（過酸化水素） (問1)",
    "text": "1 濃度不明の過酸化水素水 H2O2 の濃度を求めるため、次の【操作1】〜【操作3】からなる実験を行った。\n\n【操作1】 濃度不明の過酸化水素水 10.0 mL を [ ア ] を用いて正確に量り取り、100 mL の [ イ ] に入れて、標線まで純水を加えて正確に10倍に薄めた。\n【操作2】 薄めた過酸化水素水から [ ア ] を用いて正確に 10.0 mL をコニカルビーカーに量り取り、さらに適切な酸を加えて酸性にした。\n【操作3】 コニカルビーカーの溶液を温めながら、ビュレットから 1.00×10⁻² mol/L の過マンガン酸カリウム KMnO4 水溶液を滴下したところ、終点までに 16.0 mL を要した。",
    "subQuestions": [
      { "id": "p_c6_3_1_1", "label": "問1 空欄 [ ア ] にあてはまる実験器具", "type": "multiple_choice", "options": ["ホールピペット", "メスフラスコ", "ビュレット", "メスシリンダー", "駒込ピペット"], "correctAnswer": "ホールピペット", "correctAnswerRate": 65 },
      { "id": "p_c6_3_1_2", "label": "問1 空欄 [ イ ] にあてはまる実験器具", "type": "multiple_choice", "options": ["ホールピペット", "メスフラスコ", "ビュレット", "メスシリンダー", "コニカルビーカー"], "correctAnswer": "メスフラスコ", "correctAnswerRate": 65 },
      { "id": "p_c6_3_1_3", "label": "問2 【操作2】で用いてはならない酸をすべて選べ", "type": "multiple_choice", "options": ["① 希塩酸", "② 希硫酸", "③ 希硝酸"], "correctAnswer": "① 希塩酸・③ 希硝酸", "correctAnswerRate": 50 },
      { "id": "p_c6_3_1_4", "label": "問3 終点の決定方法（40字程度で説明）", "type": "descriptive", "correctAnswer": "滴下した過マンガン酸カリウム水溶液の赤紫色の斑点が、消えずに薄く残るようになったとき。", "correctAnswerRate": 45 },
      { "id": "p_c6_3_1_5", "label": "問4 薄める前の過酸化水素水のモル濃度 [mol/L]（有効数字3桁）", "type": "short_answer", "correctAnswer": "0.400 mol/L", "correctAnswerRate": 40 }
    ],
    "explanation": "▼ 解答と解説\n問1 ア：ホールピペット（一定体積を最も正確に量り取る器具）　イ：メスフラスコ（溶液を正確に一定の体積に薄める器具）\n\n問2 選ぶもの：①、③\n①（希塩酸）：塩化物イオン Cl− が、強力な酸化剤である過マンガン酸イオンによって自身が酸化されて塩素に変えられてしまい、過マンガン酸カリウムが余分に消費されてしまうため。\n③（希硝酸）：硝酸自体が強い酸化剤としての働きを持っているため、過酸化水素と過マンガン酸カリウムの間の純粋な酸化還元反応を邪魔してしまうため。\n\n問3 滴下した過マンガン酸カリウム水溶液の赤紫色の斑点が、消えずに薄く残るようになったとき。（45字）\n\n問4 答：0.400 mol/L\n過マンガン酸イオンと過酸化水素の反応における電子の授受の比は、それぞれの半反応式より、MnO4^− が 5e−、H2O2 が 2e− です。\n薄めた後の過酸化水素水のモル濃度を c [mol/L] とおくと、「酸化剤が受け取った電子の物質量 ＝ 還元剤が放出した電子の物質量」の関係より、\n1.00×10⁻² mol/L × \\frac{16.0}{1000} L × 5 = c [mol/L] × \\frac{10.0}{1000} L × 2\nこれを解くと、薄めた後の濃度は c = 0.0400 mol/L となります。\n【操作1】で10倍に薄めているため、求める元の濃度はこの10倍です。\n0.0400 mol/L × 10 = 0.400 mol/L",
    "surroundingKnowledge": [],
    "deepDiveTopics": []
  },
  {
    "id": "p_c6_3_2",
    "category": "⑥-3 酸化還元滴定（市販の過酸化水素水） (問2)",
    "text": "2 市販の過酸化水素水 H2O2 の濃度を求めるため、次の実験を行った。H = 1.00、O = 16.0 とする。\n\n市販の過酸化水素水 5.00 mL をホールピペットで正確に量り取り、100 mL のメスフラスコに入れて、純水を標線まで加えて正確に薄めた。この薄めた過酸化水素水から正確に 10.0 mL をコニカルビーカーに量り取り、希硫酸を加えて酸性にした。\nこの溶液に、ビュレットから 2.00×10⁻² mol/L の過マンガン酸カリウム KMnO4 水溶液を滴下したところ、終点までに 20.0 mL を要した。",
    "subQuestions": [
      { "id": "p_c6_3_2_1", "label": "(1) 滴定の終点を決定する方法（40字程度）", "type": "descriptive", "correctAnswer": "滴下した過マンガン酸カリウム水溶液の赤紫色が、消えずに薄く残るようになったとき。", "correctAnswerRate": 45 },
      { "id": "p_c6_3_2_2", "label": "(2) 硫酸の代わりに塩酸・硝酸を用いることができない理由", "type": "descriptive", "correctAnswer": "塩酸：塩化物イオンが過マンガン酸カリウムによって酸化されて塩素が発生し、過マンガン酸カリウムが余分に消費されてしまうため。硝酸：硝酸自身が強い酸化剤であり、過酸化水素と反応してしまい正確な滴定ができなくなるため。", "correctAnswerRate": 40 },
      { "id": "p_c6_3_2_3", "label": "(3) 硫酸酸性水溶液中における H2O2 と KMnO4 の化学反応式", "type": "descriptive", "correctAnswer": "2KMnO4 + 5H2O2 + 3H2SO4 ⟶ 2MnSO4 + K2SO4 + 8H2O + 5O2", "correctAnswerRate": 35 },
      { "id": "p_c6_3_2_4", "label": "(4) 薄めた後の過酸化水素水のモル濃度 [mol/L]（有効数字3桁）", "type": "short_answer", "correctAnswer": "0.100 mol/L", "correctAnswerRate": 45 },
      { "id": "p_c6_3_2_5", "label": "(5) 薄める前の市販の過酸化水素水の質量パーセント濃度 [%]（有効数字3桁、密度 1.00 g/cm³）", "type": "short_answer", "correctAnswer": "6.80 %", "correctAnswerRate": 35 }
    ],
    "explanation": "▼ 解答と解説\n(1) 滴下した過マンガン酸カリウム水溶液の赤紫色が、消えずに薄く残るようになったとき。\nコニカルビーカーの中に還元剤（H2O2）が残っている間は、滴下された赤紫色の MnO4^− はすぐに反応して無色の Mn2+ に変化します。しかし、H2O2 がすべて消費し尽くされた瞬間に、次に滴下された MnO4^− が反応できずにそのまま残るため、溶液全体が薄い赤紫色に着色します。これが終点です。\n\n(2) 塩酸：塩化物イオンが過マンガン酸カリウムによって酸化されて塩素が発生し、過マンガン酸カリウムが余分に消費されてしまうため。\n硝酸：硝酸自身が強い酸化剤であり、過酸化水素と反応してしまい正確な滴定ができなくなるため。\n酸化還元滴定で使用する酸は、「自身が酸化も還元もされないもの」でなければなりません。塩酸（HCl）の Cl− は還元剤として働いてしまい、硝酸（HNO3）の NO3^− は酸化剤として働いてしまうため、どちらも滴定の正確な数値を狂わせます。そのため、非常に安定している硫酸（H2SO4）が最適となります。\n\n(3) 2KMnO4 + 5H2O2 + 3H2SO4 ⟶ 2MnSO4 + K2SO4 + 8H2O + 5O2\n酸化剤： MnO4^− + 8H+ + 5e− ⟶ Mn2+ + 4H2O（×2）\n還元剤： H2O2 ⟶ O2 + 2H+ + 2e−（×5）\nこれらを足し合わせて 10e− を消去し、整理すると 2MnO4^− + 6H+ + 5H2O2 ⟶ 2Mn2+ + 8H2O + 5O2。最後に、反応に関与していない「2K+」と「3SO4^2−」を両辺に補うことで、化学反応式が完成します。\n\n(4) 0.100 mol/L\n薄めた後の濃度を c [mol/L] とおくと、\n2.00×10⁻² mol/L × \\frac{20.0}{1000} L × 5 = c [mol/L] × \\frac{10.0}{1000} L × 2\n2.00 = 20.0c　⟶ c = 0.100 mol/L\n\n(5) 6.80 %\n1. 元の市販溶液のモル濃度：5.00 mL → 100 mL へと 20倍に薄めているので、0.100 mol/L × 20 = 2.00 mol/L\n2. 元の溶液 1 L（1000 mL）あたり：密度 1.00 g/cm³ より溶液全体の質量は 1000 g。H2O2 の分子量は 34.0 なので、溶質の質量は 2.00 mol × 34.0 g/mol = 68.0 g\n3. 質量パーセント濃度 = \\frac{68.0 g}{1000 g} × 100 = 6.80 %",
    "surroundingKnowledge": [],
    "deepDiveTopics": []
  },
  {
    "id": "p_c6_3_3",
    "category": "⑥-3 ヨウ素滴定（ビタミンC） (問3)",
    "text": "3 次の文中の [ A ] には適切な語句を、[ B ] には下の選択肢から最も適切な記号を、[ C ]・[ D ] には有効数字2桁の数値を記せ。H = 1.00, C = 12.0, O = 16.0 とする。\n\nお茶やジュースなどの飲料には、内容物の変色や風味の劣化を防ぐためにビタミンC（アスコルビン酸 C6H8O6）が添加されている。これは、ビタミンC が非常に強い [ A ] 作用を持ち、食品が空気中の酸素によって酸化されるよりも先に自身が酸化されることで、食品の酸化を防ぐ [ B ] として用いられているためである。\nビタミンC は、ヨウ素 I2 と次の化学反応式のように反応する。\nC6H8O6 + I2 ⟶ 2I− + 2H+ + C6H6O6\nある市販のレモン果汁に含まれるビタミンC の量を調べるため、果汁 20 mL を正確に量り取り、指示薬として【指示薬】を少量加えた。ここに、5.0×10⁻³ mol/L のヨウ素水溶液（ヨウ素ヨウ化カリウム水溶液）をビュレットから滴下していったところ、溶液の色が変化して消えなくなった。終点までに要したヨウ素水溶液の体積は 12 mL であった。\nこの実験において、滴定の終点における色の変化は【色1】から【色2】への変化である。また、この果汁に含まれていたビタミンC のモル濃度は [ C ] mol/L であり、この果汁 1 L あたりに含まれるビタミンC の質量は [ D ] g である。\n\n〔 [ B ] の選択肢〕\n(ア) 酸化剤として還元防止剤　(イ) 還元剤として酸化防止剤\n(ウ) 酸としてpH調整剤　(エ) 塩基としてpH調整剤",
    "subQuestions": [
      { "id": "p_c6_3_3_1", "label": "[ A ] にあてはまる語句", "type": "short_answer", "correctAnswer": "還元", "correctAnswerRate": 60 },
      { "id": "p_c6_3_3_2", "label": "[ B ] にあてはまる記号", "type": "multiple_choice", "options": ["(ア) 酸化剤として還元防止剤", "(イ) 還元剤として酸化防止剤", "(ウ) 酸としてpH調整剤", "(エ) 塩基としてpH調整剤"], "correctAnswer": "(イ) 還元剤として酸化防止剤", "correctAnswerRate": 65 },
      { "id": "p_c6_3_3_3", "label": "【指示薬】の名称", "type": "short_answer", "correctAnswer": "デンプン溶液", "correctAnswerRate": 55 },
      { "id": "p_c6_3_3_4", "label": "終点における色の変化", "type": "short_answer", "correctAnswer": "無色から青紫色", "correctAnswerRate": 50 },
      { "id": "p_c6_3_3_5", "label": "[ C ] ビタミンCのモル濃度 [mol/L]（有効数字2桁）", "type": "short_answer", "correctAnswer": "3.0×10⁻³ mol/L", "correctAnswerRate": 40 },
      { "id": "p_c6_3_3_6", "label": "[ D ] 果汁 1 L あたりのビタミンCの質量 [g]（有効数字2桁）", "type": "short_answer", "correctAnswer": "0.53 g", "correctAnswerRate": 35 }
    ],
    "explanation": "▼ 解答と解説\n【A・B】 A：還元　B：(イ)\nビタミンC（アスコルビン酸）は、自身が電子を放出して酸化されやすい（＝相手を還元しやすい）物質です。食品が酸素によって酸化されるのを身代わりとなって防ぐため、「還元剤として酸化防止剤」の目的で広く利用されています。\n\n【指示薬・色の変化】 指示薬：デンプン溶液（またはデンプン水溶液）　色の変化：無色 から 青紫色（または赤紫色・青色）\nヨウ素 I2 を用いる滴定では、ヨウ素デンプン反応を利用するためにデンプン溶液を指示薬として使用します。\n果汁の中にビタミンC が存在している間は、滴下された I2 はすぐに還元されて無色の I− に変化するため、デンプンは着色しません。しかし、ビタミンC がすべて反応し尽くした終点直後、次に滴下されたわずか1滴の I2 がそのまま溶液中に残るため、デンプンと反応して溶液全体が無色から青紫色へと変化します。\n\n【C】 3.0×10⁻³ mol/L\n反応式より、ビタミンC（C6H8O6）1 mol は I2 1 mol とちょうど 1:1 の物質量比で過不足なく反応します。\nc [mol/L] × \\frac{20}{1000} L = 5.0×10⁻³ mol/L × \\frac{12}{1000} L\n20c = 6.0×10⁻²　⟶ c = 3.0×10⁻³ mol/L\n\n【D】 0.53 g\n1. ビタミンC の分子量：C6H8O6 = 12.0×6 + 1.00×8 + 16.0×6 = 176\n2. 果汁 1 L 中には 3.0×10⁻³ mol のビタミンC が含まれるので、質量は 3.0×10⁻³ mol × 176 g/mol = 0.528 g\n3. 有効数字2桁に四捨五入して 0.53 g",
    "surroundingKnowledge": [],
    "deepDiveTopics": []
  },
  {
    "id": "p_c6_3_4",
    "category": "⑥-3 COD測定（逆滴定） (問4)",
    "text": "4 ある河川から採取した試料水の汚染度を調べるため、有機物による化学的酸素要求量（COD）を測定する実験を行った。原子量は H = 1.0, C = 12, O = 16, Mn = 55 とし、水中に含まれる有機物以外の還元性物質や酸化性物質の影響は無視できるものとする。\n\n【操作Ⅰ】 試料水 100 mL を正確に量り取り、希硫酸を加えて酸性にした後、5.00×10⁻³ mol/L の過マンガン酸カリウム水溶液を 10.0 mL 加え、沸騰ウォーターバス中で30分間加熱し、試料水中の有機物を完全に酸化分解した。このとき、溶液は赤紫色を保っていた。\n【操作Ⅱ】 加熱後、ただちに 1.25×10⁻² mol/L のシュウ酸ナトリウム（Na2C2O4）水溶液を 5.00 mL 加えたところ、過剰にあった過マンガン酸カリウムがすべて反応し、溶液は無色透明になった。\n【操作Ⅲ】 この溶液を 60℃ に保ちながら、ビュレットから同じ 5.00×10⁻³ mol/L の過マンガン酸カリウム水溶液を滴下したところ、終点までに 1.50 mL を要した。",
    "subQuestions": [
      { "id": "p_c6_3_4_1", "label": "(1) [ ア ]MnO4^− + 5C2O4^2− + 16H+ ⟶ [ イ ]Mn2+ + [ ウ ]CO2 + 8H2O の ア・イ・ウ", "type": "short_answer", "correctAnswer": "ア：2、イ：2、ウ：10", "correctAnswerRate": 45 },
      { "id": "p_c6_3_4_2", "label": "(2) 有機物の酸化により消費された KMnO4 の物質量 [mol]（有効数字3桁）", "type": "short_answer", "correctAnswer": "1.75×10⁻⁵ mol", "correctAnswerRate": 25 },
      { "id": "p_c6_3_4_3", "label": "(3) 酸素 O2 が酸化剤としてはたらく際の半反応式", "type": "descriptive", "correctAnswer": "O2 + 4H+ + 4e− ⟶ 2H2O", "correctAnswerRate": 50 },
      { "id": "p_c6_3_4_4", "label": "(4) 試料水 1 L 中の有機物を酸化するのに必要な酸素の質量（COD値 [mg/L]、有効数字3桁）", "type": "short_answer", "correctAnswer": "7.00 mg/L", "correctAnswerRate": 20 }
    ],
    "explanation": "▼ 解答と解説\n(1) 答：ア：2、イ：2、ウ：10\n過マンガン酸イオン（酸化剤）とシュウ酸イオン（還元剤）の半反応式を組み合わせます。\nMnO4^− + 8H+ + 5e− ⟶ Mn2+ + 4H2O …①×2\nC2O4^2− ⟶ 2CO2 + 2e− …②×5\n電子の数を 10e− で揃えて足し合わせると、係数の比（2:5）になり、右辺の係数は Mn2+ が 2、CO2 が 10 と決まります。\n\n(2) 答：1.75×10⁻⁵ mol\nこの実験は過剰に加えた酸化剤（MnO4^−）の残りを、還元剤（C2O4^2−）で滴定する「逆滴定」です。\n最初に加えた総 MnO4^− ＝ 5.00×10⁻³ × \\frac{10.0}{1000} = 5.00×10⁻⁵ mol\n【操作Ⅲ】の MnO4^− ＝ 5.00×10⁻³ × \\frac{1.50}{1000} = 0.75×10⁻⁵ mol\n加えた Na2C2O4 の総量 ＝ 1.25×10⁻² × \\frac{5.00}{1000} = 6.25×10⁻⁵ mol\n有機物の反応に消費された MnO4^− の物質量を x [mol] とおくと、電子の物質量の等式より、\n(x + 0.75×10⁻⁵) × 5 = 6.25×10⁻⁵ × 2\n5x + 3.75×10⁻⁵ = 12.50×10⁻⁵\n5x = 8.75×10⁻⁵　⟶ x = 1.75×10⁻⁵ mol\n\n(3) 答：O2 + 4H+ + 4e− ⟶ 2H2O\n\n(4) 答：7.00 mg/L\nCOD とは、有機物の酸化に要した酸化剤（今回は MnO4^−）の量を、「もし酸素 O2 で酸化したらいくらになるか」に換算した値です。\n・MnO4^− は 1 mol あたり 5 mol の電子を奪う\n・O2 は 1 mol あたり 4 mol の電子を奪う（(3)の式より）\n試料水 100 mL 中の有機物が放出した電子の物質量は、1.75×10⁻⁵ mol × 5 = 8.75×10⁻⁵ mol (e−)\nこれを酸素 O2 の物質量に換算すると \\frac{8.75×10⁻⁵}{4} mol\n酸素の分子量は O2 = 32 なので、試料水 100 mL あたりの酸素の質量は、\n\\frac{8.75×10⁻⁵}{4} × 32 = 7.00×10⁻⁴ g = 0.700 mg\n求める COD は試料水 1 L（1000 mL）あたりの質量 [mg] なので、10倍にします。\n0.700 mg × 10 = 7.00 mg/L",
    "surroundingKnowledge": [],
    "deepDiveTopics": []
  },
  {
    "id": "p_c6_3_5",
    "category": "⑥-3 ヨウ素滴定（SO2・H2O2） (問5)",
    "text": "5 酸化還元反応を利用したヨウ素滴定に関する【実験1】および【実験2】を行った。滴定には指示薬としてデンプン溶液を用い、ヨウ素とチオ硫酸ナトリウムは次の化学反応式（式1）のように反応するものとする。\nI2 + 2Na2S2O3 ⟶ 2NaI + Na2S4O6 …(式1)\n\n【実験1】 工場の排気ガスに含まれる二酸化硫黄 SO2 の量を調べるため、排気ガス 10.0 L を 5.00×10⁻³ mol/L のヨウ素水溶液 100 mL にゆっくりと通し、排気ガス中の二酸化硫黄を完全に吸収・反応させた。\nこの反応溶液中に残ったヨウ素を定量するため、デンプン溶液を加えて 1.00×10⁻² mol/L のチオ硫酸ナトリウム水溶液で滴定したところ、24.0 mL を加えたときに溶液の色が変化して終点に達した。\n\n【実験2】 濃度不明の過酸化水素水 H2O2 の濃度を求めるため、この過酸化水素水 10.0 mL に過剰のヨウ化カリウム KI 水溶液と希硫酸を加えて、ヨウ素 I2 を完全に遊離させた。\nこの遊離したヨウ素を含む溶液にデンプン溶液を加え、同じ 1.00×10⁻² mol/L のチオ硫酸ナトリウム水溶液で滴定したところ、終点までに 32.0 mL を要した。",
    "subQuestions": [
      { "id": "p_c6_3_5_1", "label": "(1) SO2 をヨウ素水溶液に通したときの反応の化学反応式", "type": "descriptive", "correctAnswer": "SO2 + I2 + 2H2O ⟶ H2SO4 + 2HI", "correctAnswerRate": 35 },
      { "id": "p_c6_3_5_2", "label": "(2) 排気ガス 10.0 L 中の SO2 の物質量 [mol]（有効数字2桁）", "type": "short_answer", "correctAnswer": "3.8×10⁻⁴ mol", "correctAnswerRate": 30 },
      { "id": "p_c6_3_5_3", "label": "(3) 滴定の終点での溶液の色の変化", "type": "short_answer", "correctAnswer": "青紫色から無色", "correctAnswerRate": 50 },
      { "id": "p_c6_3_5_4", "label": "(4) 【実験2】の元の過酸化水素水のモル濃度 [mol/L]（有効数字2桁）", "type": "short_answer", "correctAnswer": "1.6×10⁻² mol/L", "correctAnswerRate": 30 }
    ],
    "explanation": "▼ 解答と解説\n(1) 答：SO2 + I2 + 2H2O ⟶ H2SO4 + 2HI\n酸化剤（ヨウ素）： I2 + 2e− ⟶ 2I−\n還元剤（二酸化硫黄）： SO2 + 2H2O ⟶ SO4^2− + 4H+ + 2e−\n電子の数が最初から 2e− で揃っているため、そのまま足し合わせることで、上記の化学反応式が得られます。\n\n(2) 答：3.8×10⁻⁴ mol（逆滴定）\n最初に用意した I2 の総物質量は、5.00×10⁻³ mol/L × \\frac{100}{1000} L = 5.00×10⁻⁴ mol\n滴定（式1）でチオ硫酸ナトリウムと反応した残りの I2 の物質量は、I2 : Na2S2O3 = 1 : 2 より、\n1.00×10⁻² mol/L × \\frac{24.0}{1000} L × \\frac{1}{2} = 1.20×10⁻⁴ mol\nしたがって、二酸化硫黄との反応で消費された I2 の物質量は、\n5.00×10⁻⁴ mol − 1.20×10⁻⁴ mol = 3.80×10⁻⁴ mol\n(1)の反応式より、SO2 と I2 は 1:1 で反応するため、排気ガス中の SO2 の物質量もこれと等しく 3.8×10⁻⁴ mol となります。\n\n(3) 答：青紫色 から 無色\nコニカルビーカーの中にヨウ素 I2 が存在している間は指示薬のデンプンにより溶液は青紫色を呈しています。ビュレットから滴下されたチオ硫酸ナトリウムにより I2 がすべて還元されて I−（無色）に変化した瞬間に、青紫色のヨウ素デンプン反応が消失して無色透明になります。\n\n(4) 答：1.6×10⁻² mol/L\n【実験2】の反応プロセスは以下の通りです。\n1. H2O2 + 2I− + 2H+ ⟶ 2H2O + I2（過酸化水素がヨウ素を遊離する）\n2. I2 + 2S2O3^2− ⟶ 2I− + S4O6^2−（遊離したヨウ素をチオ硫酸で滴定する）\n物質量の比に注目すると、H2O2 1 mol ⟶ I2 1 mol ⟶ Na2S2O3 2 mol となります。\n「放出した電子の総量＝受け取った電子の総量」の関係より、元の過酸化水素水のモル濃度を c [mol/L] とおくと、\nc [mol/L] × \\frac{10.0}{1000} L × 2 = 1.00×10⁻² mol/L × \\frac{32.0}{1000} L × 1\n20.0c = 3.20×10⁻²　⟶ c = 1.6×10⁻² mol/L",
    "surroundingKnowledge": [],
    "deepDiveTopics": []
  },
  {
    "id": "p_c6_4_1",
    "category": "⑥-4 酸化力・還元力の強さ (問1)",
    "text": "1 酸化還元反応の進行度合いから、物質の酸化作用および還元作用の強さを比較する次の問いに答えよ。\n\n(1) 次の(a)〜(c)の反応は、いずれも室温で右向き（正反応）に進行する。これらの結果から、酸化剤（相手を酸化する能力）としての働きが強い順に化学式（またはイオン式）を並べよ。\n(a) Cl2 + 2Br− ⟶ 2Cl− + Br2\n(b) Br2 + 2Fe2+ ⟶ 2Br− + 2Fe3+\n(c) 2Fe3+ + 2I− ⟶ 2Fe2+ + I2\n\n(2) 次の物質の組み合わせのうち、混合した後に常温で放置すると、酸化還元反応が進行するものをすべて選び、記号で答えよ。\n(ア) FeCl3 水溶液 と I2\n(イ) FeCl2 水溶液 と Br2\n(ウ) KBr 水溶液 と I2\n(エ) KI 水溶液 と Cl2",
    "subQuestions": [
      { "id": "p_c6_4_1_1", "label": "(1) 酸化剤として強い順", "type": "multiple_choice", "options": ["Cl2 > Br2 > Fe3+ > I2", "Cl2 > Fe3+ > Br2 > I2", "Br2 > Cl2 > Fe3+ > I2", "I2 > Fe3+ > Br2 > Cl2"], "correctAnswer": "Cl2 > Br2 > Fe3+ > I2", "correctAnswerRate": 55 },
      { "id": "p_c6_4_1_2", "label": "(2) 反応が進行するもの（すべて選択）", "type": "multiple_choice", "options": ["(ア)", "(イ)", "(ウ)", "(エ)"], "correctAnswer": "(イ)・(エ)", "correctAnswerRate": 45 }
    ],
    "explanation": "▼ 解答と解説\n(1) 答：Cl2 > Br2 > Fe3+ > I2\n酸化還元反応は、「より強い酸化剤」と「より強い還元剤」が反応して、「より弱い酸化剤」と「より弱い還元剤」が生じる方向に進みます。\n(a) より、左辺の酸化剤（Cl2）は右辺の酸化剤（Br2）より強い。 → Cl2 > Br2\n(b) より、左辺の酸化剤（Br2）は右辺の酸化剤（Fe3+）より強い。 → Br2 > Fe3+\n(c) より、左辺の酸化剤（Fe3+）は右辺の酸化剤（I2）より強い。 → Fe3+ > I2\nこれらを一本につなぐと、Cl2 > Br2 > Fe3+ > I2 となります。\n\n(2) 答：(イ)、(エ)\n(1)で求めた酸化力の強さの序列（Cl2 > Br2 > Fe3+ > I2）を利用します。左辺に「より強い酸化剤」が来る組み合わせなら反応が進行します。\n(ア) 酸化剤の候補は Fe3+ と I2。酸化力は Fe3+ > I2 なので、左辺に弱い方の I2 がいるこの組み合わせは反応しません。\n(イ) 酸化剤の候補は Br2 と Fe3+。酸化力は Br2 > Fe3+ なので、左辺に強い方の Br2 がいるため進行します（2Fe2+ + Br2 → 2Fe3+ + 2Br−）。\n(ウ) 酸化力は Br2 > I2 なので、左辺に弱い I2 があっても Br− から電子を奪えず反応しません。\n(エ) 酸化力は Cl2 > I2 なので、強い Cl2 が I− から電子を奪い、激しく反応します（2I− + Cl2 → I2 + 2Cl−）。",
    "surroundingKnowledge": [],
    "deepDiveTopics": []
  },
  {
    "id": "p_c6_4_2",
    "category": "⑥-4 金属の析出とハロゲンの酸化力 (問2)",
    "text": "2 金属の析出反応（イオン化傾向）およびハロゲンの置換反応における、酸化力・還元力の強さに関する次の問いに答えよ。\n\n(1) 硝酸銀 AgNO3 水溶液に銅片 Cu を浸すと、銅の表面に銀 Ag が析出し、溶液が青色に変化した。\n① この変化を表すイオン反応式を記せ。\n② この実験事実から、銅 Cu と銀 Ag のうち、還元剤としての働き（還元作用）が強いほうはどちらか。元素記号で答えよ。\n\n(2) 次の(a)〜(c)の化学反応がすべて自発的に起こることから、ハロゲン単体 F2, Cl2, Br2 を酸化作用（相手を酸化する能力）の強い順に化学式で並べよ。\n(a) 2NaCl + F2 ⟶ 2NaF + Cl2\n(b) 2KBr + Cl2 ⟶ 2KCl + Br2\n(c) 2NaF + Cl2 ⟶ 反応しない",
    "subQuestions": [
      { "id": "p_c6_4_2_1", "label": "(1)① イオン反応式", "type": "descriptive", "correctAnswer": "Cu + 2Ag+ ⟶ Cu2+ + 2Ag", "correctAnswerRate": 50 },
      { "id": "p_c6_4_2_2", "label": "(1)② 還元作用が強いほう", "type": "multiple_choice", "options": ["Cu", "Ag"], "correctAnswer": "Cu", "correctAnswerRate": 65 },
      { "id": "p_c6_4_2_3", "label": "(2) ハロゲン単体の酸化力の強い順", "type": "multiple_choice", "options": ["F2 > Cl2 > Br2", "Cl2 > F2 > Br2", "Br2 > Cl2 > F2", "F2 > Br2 > Cl2"], "correctAnswer": "F2 > Cl2 > Br2", "correctAnswerRate": 60 }
    ],
    "explanation": "▼ 解答と解説\n(1) 答：① Cu + 2Ag+ ⟶ Cu2+ + 2Ag　② Cu\n① 銅が電子を放出して陽イオンになり（Cu → Cu2+ + 2e−）、銀イオンがその電子を受け取って金属に析出（Ag+ + e− → Ag）します。電子の数を揃えて足すとこのイオン反応式になります。水溶液が青くなったのは、無色の Ag+ が減り、青色の Cu2+ が増えたためです。\n② 反応が右に進んだということは、「自身が電子を放出して相手を還元する力（＝還元剤としての働き）」が、銀よりも銅の方が強かったことを意味します（これは金属のイオン化傾向 Cu > Ag と一致します）。\n\n(2) 答：F2 > Cl2 > Br2\nハロゲン単体（17族）は、電子を受け取って陰イオンになりたがる性質（＝相手を酸化する能力）を持ちます。\n(a) より、F2 は Cl− を酸化して単体の Cl2 に変えることができるため、酸化力は F2 > Cl2。\n(b) より、Cl2 は Br− を酸化して単体の Br2 に変えることができるため、酸化力は Cl2 > Br2。\n(c) は、Cl2 の酸化力が F2 より弱いために（F− から電子を奪えないため）反応が起きないことを裏付けています。\nしたがって、酸化作用が強い順に並べると F2 > Cl2 > Br2 となります（周期表の上にあるハロゲンほど酸化力が強いという規則性通りです）。",
    "surroundingKnowledge": [],
    "deepDiveTopics": []
  },
  {
    "id": "p_c6_5_1",
    "category": "⑥-5 金属のイオン化傾向 (問1)",
    "text": "1 金属のイオン化傾向の相対的な大きさを調べるため、鉄（Fe）、銅（Cu）、銀（Ag）の3種類の金属片と、それぞれの金属イオンを含む水溶液（Fe2+ を含む水溶液、Cu2+ を含む水溶液、Ag+ を含む水溶液）を用いて実験を行った。\n次の表は、金属片を各水溶液に浸したときの変化の有無をまとめたものである。\n\n｜金属片 ＼ 水溶液｜Fe2+ を含む水溶液｜Cu2+ を含む水溶液｜Ag+ を含む水溶液｜\n｜鉄 (Fe)｜—｜（ア）｜（イ）｜\n｜銅 (Cu)｜変化なし｜—｜（ウ）｜\n｜銀 (Ag)｜変化なし｜変化なし｜—｜",
    "subQuestions": [
      { "id": "p_c6_5_1_1", "label": "(1)（ア）Fe を Cu2+ 水溶液に浸したとき（変化があればイオン反応式、なければ「変化なし」）", "type": "descriptive", "correctAnswer": "Fe + Cu2+ ⟶ Fe2+ + Cu", "correctAnswerRate": 55 },
      { "id": "p_c6_5_1_2", "label": "(1)（イ）Fe を Ag+ 水溶液に浸したとき", "type": "descriptive", "correctAnswer": "Fe + 2Ag+ ⟶ Fe2+ + 2Ag", "correctAnswerRate": 45 },
      { "id": "p_c6_5_1_3", "label": "(1)（ウ）Cu を Ag+ 水溶液に浸したとき", "type": "descriptive", "correctAnswer": "Cu + 2Ag+ ⟶ Cu2+ + 2Ag", "correctAnswerRate": 50 },
      { "id": "p_c6_5_1_4", "label": "(2) Fe、Cu、Ag をイオン化傾向の大きい順に並べよ", "type": "multiple_choice", "options": ["Fe > Cu > Ag", "Cu > Fe > Ag", "Ag > Cu > Fe", "Fe > Ag > Cu"], "correctAnswer": "Fe > Cu > Ag", "correctAnswerRate": 70 }
    ],
    "explanation": "▼ 解答と解説\n(1) 答：\n（ア）Fe + Cu2+ ⟶ Fe2+ + Cu\n（イ）Fe + 2Ag+ ⟶ Fe2+ + 2Ag\n（ウ）Cu + 2Ag+ ⟶ Cu2+ + 2Ag\n金属の単体（金属片）と金属イオンが反応するのは、「金属片のイオン化傾向 ＞ 水溶液中のイオンのイオン化傾向」のときです。\nイオン化傾向は Fe > Cu > Ag なので、鉄（Fe）は Cu2+ および Ag+ の両方よりイオンになりやすいため反応します（ア、イ）。銅（Cu）は Ag+ よりはイオンになりやすいため反応します（ウ）。\n（イ）と（ウ）では、銀イオンが Ag+（1価）で、鉄や銅が2価のイオン（Fe2+, Cu2+）になるため、電気的なバランス（電荷の総和）を合わせるために Ag+ の係数が 2 になります。\n\n(2) 答：Fe > Cu > Ag\n他の金属イオンを最もよく還元して自身が溶けた（イオンになった）鉄（Fe）が一番大きく、どの金属イオン水溶液に入れても全く反応しなかった銀（Ag）が一番小さくなります。",
    "surroundingKnowledge": [],
    "deepDiveTopics": []
  },
  {
    "id": "p_c6_5_2",
    "category": "⑥-5 金属の特定（イオン化傾向） (問2)",
    "text": "2 4種類の金属 A、B、C、D がある。これらは、カリウム（K）、マグネシウム（Mg）、亜鉛（Zn）、白金（Pt）のいずれかである。金属 A〜D を特定するために次の【実験1】〜【実験3】を行った。\n\n【実験1】 常温の水にそれぞれの金属を入れたところ、金属 A のみが激しく反応して水素を発生し、水溶液は塩基性を示した。他の金属は常温の水とは反応しなかった。\n【実験2】 金属 B、C、D をそれぞれ沸騰した水（熱水）に入れたところ、金属 B のみが反応して水素を発生した。\n【実験3】 残った金属 C と金属 D にそれぞれ希塩酸を加えたところ、金属 C は気体を発生しながら速やかに溶解したが、金属 D はまったく反応しなかった。",
    "subQuestions": [
      { "id": "p_c6_5_2_1", "label": "(1) 金属 A", "type": "multiple_choice", "options": ["K", "Mg", "Zn", "Pt"], "correctAnswer": "K", "correctAnswerRate": 70 },
      { "id": "p_c6_5_2_2", "label": "(1) 金属 B", "type": "multiple_choice", "options": ["K", "Mg", "Zn", "Pt"], "correctAnswer": "Mg", "correctAnswerRate": 65 },
      { "id": "p_c6_5_2_3", "label": "(1) 金属 C", "type": "multiple_choice", "options": ["K", "Mg", "Zn", "Pt"], "correctAnswer": "Zn", "correctAnswerRate": 65 },
      { "id": "p_c6_5_2_4", "label": "(1) 金属 D", "type": "multiple_choice", "options": ["K", "Mg", "Zn", "Pt"], "correctAnswer": "Pt", "correctAnswerRate": 70 },
      { "id": "p_c6_5_2_5", "label": "(2) 金属 A が常温の水と反応したときの化学反応式", "type": "descriptive", "correctAnswer": "2K + 2H2O ⟶ 2KOH + H2", "correctAnswerRate": 50 },
      { "id": "p_c6_5_2_6", "label": "(3) 金属 C が希塩酸に溶けたときに発生した気体の名称", "type": "short_answer", "correctAnswer": "水素", "correctAnswerRate": 70 },
      { "id": "p_c6_5_2_7", "label": "(3) 金属 D を王水以外で溶解させる方法", "type": "multiple_choice", "options": ["(a) 沸騰した熱水に浸す", "(b) 融解させて電気分解（融解塩電解）する", "(c) 加熱した濃硫酸（熱濃硫酸）に浸す"], "correctAnswer": "(b) 融解させて電気分解（融解塩電解）する", "correctAnswerRate": 45 }
    ],
    "explanation": "▼ 解答と解説\n(1) 答：A：K、B：Mg、C：Zn、D：Pt\n金属 A (K)：イオン化傾向が極めて大きいアルカリ金属（Li, K, Ca, Na）は、常温の水と激しく反応して水素を発生し、強塩基（水酸化物）を生じます。\n金属 B (Mg)：マグネシウムは常温の水とは反応しませんが、高温の水（熱水）とは反応して水素と水酸化マグネシウムを生じます。\n金属 C (Zn)：亜鉛は水素よりもイオン化傾向が大きいため、希塩酸（酸）に溶けて水素を発生します。\n金属 D (Pt)：白金（Pt）や金（Au）はイオン化傾向が全金属中で最も小さく、非常に安定しているため、通常の酸（希塩酸や硝酸など）には一切溶けず、王水にのみ溶けます。\n\n(2) 答：2K + 2H2O ⟶ 2KOH + H2\nカリウム K が水 H2O から OH− を奪って水酸化カリウム KOH（強塩基）になり、余った H が水素気体 H2 となって発生します。\n\n(3) 答：気体の名称：水素　記号：(b)\n金属が酸に溶けるときは水素 H2 が発生します（Zn + 2HCl → ZnCl2 + H2）。\n白金 Pt などの非常に安定した金属をどうしても単体からイオンにしたり、逆に化合物から単体を取り出したりしたい場合、水が存在する環境や熱をかけるだけでは太刀打ちできません。化合物を無理やり融かして直接電気の力でねじ伏せる「融解塩電解（電気分解）」(b) が必要になります。（※(c) の熱濃硫酸は、銅 Cu や銀 Ag を溶かすことはできますが、白金 Pt や金 Au を溶かすことはできません）",
    "surroundingKnowledge": [],
    "deepDiveTopics": []
  },
  {
    "id": "p_c6_5_3",
    "category": "⑥-5 金属の特定とトタン・ブリキ (問3)",
    "text": "3 6種類の金属 A、B、C、D、E、F がある。これらは、カリウム（K）、マグネシウム（Mg）、亜鉛（Zn）、鉄（Fe）、スズ（Sn）、白金（Pt）のいずれかである。これらの金属を特定するために【実験1】〜【実験5】を行った。\n\n【実験1】 常温の水にそれぞれの金属を入れたところ、金属 A のみが激しく反応して水素を発生し、その水溶液は強い塩基性を示した。他の金属は常温の水とは反応しなかった。\n【実験2】 残った金属を沸騰した水（熱水）に入れたところ、金属 B のみが反応して水素を発生した。\n【実験3】 残った金属にそれぞれ希塩酸を加えたところ、金属 C、D、E からは気体が発生して溶解したが、金属 F はまったく反応しなかった。\n【実験4】 金属 D のイオン（D2+）を含む水溶液に、金属 C の破片を入れたところ、金属 C の表面に金属 D が析出した。\n【実験5】 金属 D（単体）と金属 E（単体）をそれぞれ同じ濃度の希塩酸に浸したところ、金属 D の方が金属 E よりも激しく気体を発生しながら急速に溶解した。",
    "subQuestions": [
      { "id": "p_c6_5_3_1", "label": "(1) 金属 A〜F の元素記号（例：A：K、B：Mg、…）", "type": "descriptive", "correctAnswer": "A：K、B：Mg、C：Zn、D：Fe、E：Sn、F：Pt", "correctAnswerRate": 45 },
      { "id": "p_c6_5_3_2", "label": "(2) 金属 A が常温の水と反応したときの化学反応式", "type": "descriptive", "correctAnswer": "2K + 2H2O ⟶ 2KOH + H2", "correctAnswerRate": 50 },
      { "id": "p_c6_5_3_3", "label": "(3) 濃塩酸と濃硝酸を 3:1 の体積比で混合した強い酸化力を持つ水溶液の名称", "type": "short_answer", "correctAnswer": "王水", "correctAnswerRate": 65 },
      { "id": "p_c6_5_3_4", "label": "(4)① 犠牲防食の性質を持つのはトタンとブリキのどちらか", "type": "multiple_choice", "options": ["トタン", "ブリキ"], "correctAnswer": "トタン", "correctAnswerRate": 55 },
      { "id": "p_c6_5_3_5", "label": "(4)② その理由（イオン化傾向の違いを踏まえて説明）", "type": "descriptive", "correctAnswer": "亜鉛は鉄よりもイオン化傾向が大きいため、傷がついても亜鉛が鉄よりも先に電子を放出して酸化され（溶け出し）、鉄の腐食を身代わりとなって防ぐから。", "correctAnswerRate": 40 }
    ],
    "explanation": "▼ 解答と解説\n(1) 答：A：K（カリウム）、B：Mg（マグネシウム）、C：Zn（亜鉛）、D：Fe（鉄）、E：Sn（スズ）、F：Pt（白金）\n【実験1】より A = K：常温の水と反応するのはイオン化傾向が極めて大きいアルカリ金属です。\n【実験2】より B = Mg：常温の水とは反応せず、熱水とだけ反応するのはマグネシウムの特徴です。\n【実験3】より F = Pt：水素よりイオン化傾向が小さい（酸に溶けない）のは、残りのうち白金だけです。この時点で、残る C, D, E は「Zn, Fe, Sn」の3つに絞られます。\n【実験4】より C > D：D2+ に C を入れて D が析出したということは、イオンになりたがる力（イオン化傾向）は C > D です。\n【実験5】より D > E：同じ酸に対して、より激しく溶けた D の方が E よりもイオン化傾向が大きいです。\n4と5を組み合わせると、イオン化傾向は C > D > E の順になります。「Zn, Fe, Sn」をイオン化傾向の大きい順に並べると Zn > Fe > Sn なので、C = Zn, D = Fe, E = Sn と確定します。\n\n(2) 答：2K + 2H2O ⟶ 2KOH + H2\nカリウムは水と反応して、水酸化カリウム（強塩基）と水素を生成します。\n\n(3) 答：王水（おうすい）\n白金 Pt や金 Au は非常に安定していますが、濃塩酸と濃硝酸を 3:1 で混ぜた「王水」には錯イオンを形成して溶解します。\n\n(4) 答：① トタン\n② 理由：亜鉛は鉄よりもイオン化傾向が大きいため、傷がついても亜鉛が鉄よりも先に電子を放出して酸化され（溶け出し）、鉄の腐食を身代わりとなって防ぐから。\nトタン（鉄に亜鉛をめっき）：イオン化傾向は Zn > Fe なので、傷がつくと亜鉛が先に溶けて鉄に電子を供給し続け、鉄を守ります（犠牲防食）。\nブリキ（鉄にスズをめっき）：イオン化傾向は Fe > Sn なので、傷がつくと中の鉄の方が先に溶け出してしまい、急激にサビが進行します。",
    "surroundingKnowledge": [],
    "deepDiveTopics": []
  },
  {
    "id": "p_c6_6_1",
    "category": "⑥-6 ダニエル電池 (問1)",
    "text": "1 図のように、素焼き板で仕切られた容器の左側に硫酸亜鉛水溶液と亜鉛板 Zn を、右側に硫酸銅(Ⅱ)水溶液と銅板 Cu を浸し、導線でモーター（または検流計）をつないで電池（ダニエル電池）を作製した。次の各問いに答えよ。",
    "subQuestions": [
      { "id": "p_c6_6_1_1", "label": "(1) 正極（＋極）となるのはどちらか", "type": "multiple_choice", "options": ["亜鉛板", "銅板"], "correctAnswer": "銅板", "correctAnswerRate": 60 },
      { "id": "p_c6_6_1_2", "label": "(1) 導線中を流れる電子 e− の向き", "type": "multiple_choice", "options": ["ア：亜鉛板から銅板", "イ：銅板から亜鉛板"], "correctAnswer": "ア：亜鉛板から銅板", "correctAnswerRate": 55 },
      { "id": "p_c6_6_1_3", "label": "(2) 負極で起こる変化のイオン反応式", "type": "descriptive", "correctAnswer": "Zn ⟶ Zn2+ + 2e−", "correctAnswerRate": 55 },
      { "id": "p_c6_6_1_4", "label": "(2) 正極で起こる変化のイオン反応式", "type": "descriptive", "correctAnswer": "Cu2+ + 2e− ⟶ Cu", "correctAnswerRate": 55 },
      { "id": "p_c6_6_1_5", "label": "(3) 亜鉛側の Zn2+ のモル濃度の変化", "type": "multiple_choice", "options": ["増加", "減少", "変化なし"], "correctAnswer": "増加", "correctAnswerRate": 55 },
      { "id": "p_c6_6_1_6", "label": "(3) 銅側の Cu2+ のモル濃度の変化", "type": "multiple_choice", "options": ["増加", "減少", "変化なし"], "correctAnswer": "減少", "correctAnswerRate": 55 },
      { "id": "p_c6_6_1_7", "label": "(4) 素焼き板の役割：① 2つの水溶液が急速に [ a ] してしまうのを防ぐ", "type": "short_answer", "correctAnswer": "混合", "correctAnswerRate": 50 },
      { "id": "p_c6_6_1_8", "label": "(4) 素焼き板の役割：② 電気的バランスが崩れるのを防ぐため [ b ] を互いに行き来させる", "type": "short_answer", "correctAnswer": "イオン", "correctAnswerRate": 50 },
      { "id": "p_c6_6_1_9", "label": "(5) ボルタ電池で正極から発生する気体の化学式", "type": "short_answer", "correctAnswer": "H2", "correctAnswerRate": 50 },
      { "id": "p_c6_6_1_10", "label": "(5) 気体が電極を覆い電流が流れにくくなる現象の名称（漢字）", "type": "short_answer", "correctAnswer": "分極", "correctAnswerRate": 45 }
    ],
    "explanation": "▼ 解答と解説\n(1) 答：正極：銅板　電子の向き：ア\nイオン化傾向は Zn > Cu なので、イオンになりやすい亜鉛板が負極（−極）、銅板が正極（＋極）になります。電子 e− は負極（亜鉛）から正極（銅）に向かって導線を流れるため、向きは「ア」です（※電流の向きは逆の「銅から亜鉛」になります）。\n\n(2) 答：負極：Zn ⟶ Zn2+ + 2e−　正極：Cu2+ + 2e− ⟶ Cu\n負極では亜鉛が電子を放出して溶け出し、正極では水溶液中の銅イオン Cu2+ が、導線からやってきた電子を受け取って金属の銅として析出します。\n\n(3) 答：Zn2+：増加　Cu2+：減少\n(2)の反応の通り、左側では Zn2+ がどんどん溶け出すため濃度は増加し、右側では水溶液中の Cu2+ が消費されていくため濃度は減少します。\n\n(4) 答：a：混合（まざり合う）　b：イオン\n素焼き板は、2液が混ざるのを防ぎつつ、非常に小さな穴を通してイオンを行き来させることで、溶液全体の電気的中性を保つ役割（左側で過剰になった Zn2+ が右へ、または右側で過剰になった SO4^2− が左へ移動する）を持っています。\n\n(5) 答：気体の化学式：H2　現象名：分極（ぶんきょく）\nボルタ電池（Zn｜H2SO4aq｜Cu）では、正極の銅板表面で水溶液中の水素イオンが電子を受け取り、水素気体 H2 が発生します（2H+ + 2e− → H2）。この水素の泡が銅板を覆うと、反応が邪魔されて起電力が急激に低下します。この現象を分極といいます。",
    "surroundingKnowledge": [],
    "deepDiveTopics": []
  },
  {
    "id": "p_c6_6_2",
    "category": "⑥-6 電池と量的関係 (問2)",
    "text": "2 2種類の未知の金属 X と金属 Y がある。これらについて、次の【実験1】および【実験2】を行った。次の各問いに答えよ。\n\n【実験1】 金属 X と金属 Y をそれぞれ希硫酸に浸したところ、金属 X の表面からは激しく水素の泡が発生したが、金属 Y はまったく反応しなかった。\n【実験2】 2価の陽イオン Y2+ を含む水溶液に金属 X を浸したところ、金属 X が溶け出して3価の陽イオン X3+ に変化すると同時に、金属 X の表面に金属 Y が析出した。",
    "subQuestions": [
      { "id": "p_c6_6_2_1", "label": "(1) 金属 X と金属 Y のイオン化傾向の大きさ（不等号で）", "type": "multiple_choice", "options": ["X > Y", "Y > X"], "correctAnswer": "X > Y", "correctAnswerRate": 65 },
      { "id": "p_c6_6_2_2", "label": "(2) X・Y を電極、希硫酸を電解液とする電池について正しい記述", "type": "multiple_choice", "options": ["(ア) 金属 X が正極となり、電子を放出する", "(イ) 金属 X が負極となり、自身が酸化される", "(ウ) 金属 Y が負極となり、自身が還元される", "(エ) 金属 Y が正極となり、表面から Y のイオンが溶け出す"], "correctAnswer": "(イ) 金属 X が負極となり、自身が酸化される", "correctAnswerRate": 50 },
      { "id": "p_c6_6_2_3", "label": "(3) 金属 Y が n [mol] 析出したときに溶け出した金属 X の物質量（n を用いた式）", "type": "short_answer", "correctAnswer": "\\frac{2}{3}n mol", "correctAnswerRate": 35 }
    ],
    "explanation": "▼ 解答と解説\n(1) 答：X > Y\n【実験1】で希硫酸（H+）と反応して水素を出した X は、水素よりもイオン化傾向が大きいです（X > H）。反応しなかった Y は水素より小さいです（H > Y）。よって、X > Y です。これは【実験2】で X が溶けて Y が析出した（イオンになりたがる力が X の方が強い）ことからも一致します。\n\n(2) 答：(イ)\nイオン化傾向の大きい X が負極となり、自身が電子を放出して溶け出す（＝酸化される）ため、(イ) が正しい記述です。正極となる Y の表面では、溶液中の H+ が電子を受け取って還元され、水素が発生します。\n\n(3) 答：\\frac{2}{3}n [mol]\n「酸化剤が受け取った電子の物質量 ＝ 還元剤が放出した電子の物質量」という量的関係を使って等式を作ります。\n溶け出した金属 X の物質量を x [mol] とおきます。\nX は1つ溶けるときに3つの電子を放出します（X → X3+ + 3e−）。よって、放出した電子の総モルは 3x [mol] です。\nY2+ は1つ析出するときに2つの電子を受け取ります（Y2+ + 2e− → Y）。よって、受け取った電子の総モルは 2n [mol] です。\nこれが等しくなるため、3x = 2n　⟶ x = \\frac{2}{3}n [mol] となります。",
    "surroundingKnowledge": [],
    "deepDiveTopics": []
  },
  {
    "id": "p_c6_7_1",
    "category": "⑥-7 金属の製錬法 (問1)",
    "text": "1 金属のイオン化傾向の大きさと、天然からの単体の取り出し方（製錬法）に関する次の問いに答えよ。\n\n(1) 次の(ア)〜(エ)の金属のうち、天然で単体として産出されやすく、人類が最も古くから利用してきたとされる金属を1つ選び、元素記号で答えよ。\n(ア) アルミニウム　(イ) 鉄　(ウ) 銅　(エ) 金\n\n(2) 金属のイオン化傾向と製錬法の一般的な関係について説明した次の文の、空欄 [ a ] 〜 [ c ] にあてはまる最も適切な語句を答えよ。\nイオン化傾向が非常に大きいアルミニウムなどの金属の化合物は非常に安定しているため、炭素を用いた還元では単体を得ることができない。そのため、化合物を高温で融解させて電気分解する [ a ] という方法が用いられる。一方、鉄や銅などの中程度のイオン化傾向を持つ金属は、天然では主に [ b ] 物や硫化物として存在しており、これらをコークス（炭素）や [ c ] を用いて還元することで単体を取り出すことができる。",
    "subQuestions": [
      { "id": "p_c6_7_1_1", "label": "(1) 人類が最も古くから利用してきた金属（元素記号）", "type": "multiple_choice", "options": ["Al", "Fe", "Cu", "Au"], "correctAnswer": "Au", "correctAnswerRate": 55 },
      { "id": "p_c6_7_1_2", "label": "(2) [ a ] にあてはまる語句", "type": "short_answer", "correctAnswer": "融解塩電解", "correctAnswerRate": 45 },
      { "id": "p_c6_7_1_3", "label": "(2) [ b ] にあてはまる語句", "type": "short_answer", "correctAnswer": "酸化", "correctAnswerRate": 50 },
      { "id": "p_c6_7_1_4", "label": "(2) [ c ] にあてはまる語句", "type": "short_answer", "correctAnswer": "一酸化炭素", "correctAnswerRate": 45 }
    ],
    "explanation": "▼ 解答と解説\n(1) 答：Au\nイオン化傾向が極めて小さい金（Au）や白金（Pt）は、天然で酸化されずに単体の状態で見つかります。そのため、人類が最も古くから発見・利用できた金属です。\n\n(2) 答：a：融解塩電解（または溶融塩電解）、b：酸化、c：一酸化炭素\nイオン化傾向が大きい金属（Al 以上）のイオンは、水溶液を電気分解しても水分子が先に反応してしまうため、水を含まない状態で融解させて電気分解する「融解塩電解」が必要です。",
    "surroundingKnowledge": [],
    "deepDiveTopics": []
  },
  {
    "id": "p_c6_7_2",
    "category": "⑥-7 鉄の製錬（高炉） (問2)",
    "text": "2 高炉（溶鉱炉）に鉄鉱石（主成分 Fe2O3）、コークス C、石灰石 CaCO3 を入れ、下部から熱風を吹き込んで鉄の単体（銑鉄）を得る。",
    "subQuestions": [
      { "id": "p_c6_7_2_1", "label": "(1) 高炉内でコークスが不完全燃焼して生じ、鉄鉱石を直接還元する強力な還元剤としてはたらく気体の化学式", "type": "short_answer", "correctAnswer": "CO", "correctAnswerRate": 55 },
      { "id": "p_c6_7_2_2", "label": "(2) (1)の気体が赤鉄鉱 Fe2O3 を単体の鉄 Fe に還元するときの化学反応式", "type": "descriptive", "correctAnswer": "Fe2O3 + 3CO ⟶ 2Fe + 3CO2", "correctAnswerRate": 45 }
    ],
    "explanation": "▼ 解答と解説\n(1) 答：CO\nコークス C が熱風の酸素 O2 と激しく反応してまず CO2 になり、これがさらに高温のコークスと反応して一酸化炭素 CO が生じます。\n\n(2) 答：Fe2O3 + 3CO ⟶ 2Fe + 3CO2\nCO が Fe2O3 から酸素をすべて奪い、自身は CO2 になります。",
    "surroundingKnowledge": [],
    "deepDiveTopics": []
  },
  {
    "id": "p_c6_7_3",
    "category": "⑥-7 銅の電解精錬 (問3)",
    "text": "3 黄銅鉱から得られた不純物を含む粗銅（Cu のほかに Fe, Ni, Au, Pt などを含む）を精錬し、純度 99.99% 以上の純銅を得るため、硫酸銅(Ⅱ)水溶液を電解液とした電気分解を行った。",
    "subQuestions": [
      { "id": "p_c6_7_3_1", "label": "(1) 陽極（＋極）に用いるのはどちらか", "type": "multiple_choice", "options": ["粗銅", "純銅"], "correctAnswer": "粗銅", "correctAnswerRate": 55 },
      { "id": "p_c6_7_3_2", "label": "(2) 銅よりイオン化傾向の小さい Au や Pt が陽極の下に沈殿したものの名称", "type": "short_answer", "correctAnswer": "陽極泥", "correctAnswerRate": 50 }
    ],
    "explanation": "▼ 解答と解説\n(1) 答：粗銅\n陽極（＋極）＝ 粗銅：溶け出してイオンになる側です（Cu → Cu2+ + 2e−）。同時に Fe や Ni も溶け出します。\n陰極（−極）＝ 純銅：まわってきた電子を受け取って、水溶液中の Cu2+ が純粋な金属として析出する側です（Cu2+ + 2e− → Cu）。\n\n(2) 答：陽極泥（ようきょくでい）\n銅よりもイオン化傾向が小さい貴金属（Au, Pt, Ag など）は、電子を奪われてもイオンになりにくいため、陽極が溶けて崩壊していく過程でそのまま下にボロボロと落ちて溜まります。これが「陽極泥」であり、ここから金や白金を回収できるため工業的に非常に価値が高いです。",
    "surroundingKnowledge": [],
    "deepDiveTopics": []
  },
  {
    "id": "p_c6_7_4",
    "category": "⑥-7 アルミニウムの溶融塩電解 (問4)",
    "text": "4 アルミニウムの原料であるボーキサイトから酸化アルミニウム（アルミナ、Al2O3）を取り出し、これを単体に変化させる。しかし、アルミナは融点が約 2000℃ と非常に高く、そのまま融かすには大量のエネルギーが必要となる。",
    "subQuestions": [
      { "id": "p_c6_7_4_1", "label": "(1) アルミナの融点を約 1000℃ まで下げるために混合して一緒に融かす鉱物の名称", "type": "short_answer", "correctAnswer": "氷晶石", "correctAnswerRate": 50 },
      { "id": "p_c6_7_4_2", "label": "(2) 陰極（−極）で起こる反応のイオン反応式", "type": "descriptive", "correctAnswer": "Al3+ + 3e− ⟶ Al", "correctAnswerRate": 50 }
    ],
    "explanation": "▼ 解答と解説\n(1) 答：氷晶石（ひょうしょうせき）\nアルミナ単体の融点は 2054℃ ですが、氷晶石（Na3AlF6）という鉱物に混ぜて熱すると、約 960℃ でドロドロに融けるようになります（融点降下の応用）。\n\n(2) 答：Al3+ + 3e− ⟶ Al\n融解液中で自由に動けるようになっているアルミニウムイオン Al3+ が、陰極（−極）から流れ込んでくる電子 e− を3つ受け取ることで、液体状のアルミニウム単体（密度が大きいため容器の底に溜まる）となって析出します。",
    "surroundingKnowledge": [],
    "deepDiveTopics": []
  }
];
