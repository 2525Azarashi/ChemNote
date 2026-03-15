const fs = require('fs');

const data = fs.readFileSync('src/data/chemistryData.ts', 'utf8');

const newDeepThought = {
  "type": "deep_thought",
  "phase1": {
    "title": "フェーズ1：思考構造の分析（ユーザー確認フェーズ）",
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
        "content": "物質を分ける最初の基準として、物理的な方法（ろ過や蒸留など）で分離可能かを確認する。",
        "knowledge": "純物質と混合物の定義",
        "purpose": "純物質と混合物を大別する。"
      },
      {
        "step": "Step 2",
        "tag": "分類理解",
        "target": "混合物の性質と具体例",
        "content": "物理的に分けられるものは混合物であり、成分の割合によって性質が異なることを理解する。",
        "knowledge": "混合物の性質",
        "purpose": "混合物に関する問題（問1, 問2）を解く。"
      },
      {
        "step": "Step 3",
        "tag": "性質理解",
        "target": "純物質の性質",
        "content": "物理的に分けられないものは純物質であり、融点や沸点が一定であることを理解する。",
        "knowledge": "純物質の性質",
        "purpose": "純物質に関する問題（問1）を解く。"
      },
      {
        "step": "Step 4",
        "tag": "分類理解",
        "target": "化合物の定義と具体例",
        "content": "純物質のうち、2種類以上の元素からなるものを化合物とし、化学的に分解可能であることを理解する。",
        "knowledge": "化合物の定義",
        "purpose": "化合物に関する問題（問1, 問2）を解く。"
      },
      {
        "step": "Step 5",
        "tag": "分類理解",
        "target": "単体の定義と具体例",
        "content": "純物質のうち、1種類の元素からなるものを単体とし、これ以上分解できないことを理解する。",
        "knowledge": "単体の定義",
        "purpose": "単体に関する問題（問1, 問2）を解く。"
      },
      {
        "step": "Step 6",
        "tag": "文脈判断",
        "target": "単体としての使われ方",
        "content": "文脈において、実際に存在する物質（性質・状態・反応）を指している場合は「単体」と判断する。",
        "knowledge": "単体と元素の区別",
        "purpose": "問3の単体を特定する。"
      },
      {
        "step": "Step 7",
        "tag": "文脈判断",
        "target": "元素としての使われ方",
        "content": "文脈において、物質の成分（構成要素・含有）を指している場合は「元素」と判断する。",
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
        "subQuestionIds": ["p1_a", "p1_ke"],
        "subQuestionLabels": ["問1(ア)", "問1(ケ)"],
        "content": "【思考内容】\n物質を分ける最初の基準は「物理的に分けられるか」です。\n\n物理的な方法（ろ過や蒸留など）で分けられるものは「混合物」、分けられないものは「純物質」となります。\n純物質は「1種類」の粒子からできています。"
      },
      {
        "step": "Step 2",
        "tag": "性質・分類",
        "subQuestionIds": ["p1_ki", "p1_ku", "q2_1", "q2_3", "q2_6"],
        "subQuestionLabels": ["問1(キ)", "問1(ク)", "問2(1)", "問2(3)", "問2(6)"],
        "content": "【思考内容】\n混合物の性質と具体例を確認します。\n\n混合物は、成分の「割合」によって融点や沸点が「異」なります。\n具体例として、空気（窒素や酸素など）、食塩水（水と塩化ナトリウム）、石油（様々な炭化水素）などが挙げられます。"
      },
      {
        "step": "Step 3",
        "tag": "性質理解",
        "subQuestionIds": ["p1_i"],
        "subQuestionLabels": ["問1(イ)"],
        "content": "【思考内容】\n純物質の性質を確認します。\n\n純物質は組成が一定であるため、融点や沸点、密度などの値は物質ごとに「等しく」なります。"
      },
      {
        "step": "Step 4",
        "tag": "定義・分類",
        "subQuestionIds": ["p1_o", "p1_ko", "q2_4"],
        "subQuestionLabels": ["問1(オ)", "問1(コ)", "問2(4)"],
        "content": "【思考内容】\n化合物の定義と具体例を確認します。\n\n純物質のうち、2種類以上の元素からなるものを「化合物」といいます。\n化合物を分解するには、電気分解などの「化学」的な方法が必要です。\n具体例として、メタン（CH₄）などが挙げられます。"
      },
      {
        "step": "Step 5",
        "tag": "定義・分類",
        "subQuestionIds": ["p1_u", "p1_e", "p1_ka", "q2_2", "q2_5"],
        "subQuestionLabels": ["問1(ウ)", "問1(エ)", "問1(カ)", "問2(2)", "問2(5)"],
        "content": "【思考内容】\n単体の定義と具体例を確認します。\n\n純物質のうち、1種類の「元素」からなるものを「単体」といいます。\n具体例として、酸素（O₂）、黒鉛（C）などが挙げられます。\nまた、室温で液体の単体は「臭素」と水銀のみです。"
      },
      {
        "step": "Step 6",
        "tag": "文脈判断",
        "subQuestionIds": ["q3_2", "q3_4"],
        "subQuestionLabels": ["問3(2)", "問3(4)"],
        "content": "【思考内容】\n文脈における「単体」の使われ方を確認します。\n\n「実際に存在する物質（性質・状態・反応）」を指している場合は「単体」です。\n・乾燥空気の体積の約78％は窒素（N₂という気体）\n・水を電気分解すると、水素と酸素を生じる（H₂とO₂という気体が発生）"
      },
      {
        "step": "Step 7",
        "tag": "文脈判断",
        "subQuestionIds": ["q3_1", "q3_3"],
        "subQuestionLabels": ["問3(1)", "問3(3)"],
        "content": "【思考内容】\n文脈における「元素」の使われ方を確認します。\n\n「物質の成分（構成要素・含有）」を指している場合は「元素」です。\n・植物の生育には、窒素（Nという成分）が欠かせない\n・砂糖は、炭素や水素、酸素（C, H, Oという成分）からなる物質である"
      }
    ],
    "stumblingPoints": [
      {
        "step": "Step 2",
        "type": "概念混同",
        "content": "・入試のひっかけポイント：「名称は1つの単語に見えるが、実は水溶液（混合物）」というパターンに注意しましょう。\n代表例：塩酸（塩化水素の水溶液）、アンモニア水（アンモニアの水溶液）。これらは化学式「HCl」「NH₃」だけで表すことはできず、水（H₂O）との混合物です。"
      },
      {
        "step": "Step 6, 7",
        "type": "適用失敗",
        "content": "目的：文脈から「単体（物質）」と「元素（成分）」を論理的に切り分ける基準の再構築。\n以下の2つの文について、下線部が「単体」か「元素」か答えなさい。\nA：「カルシウムは、水と激しく反応して水素を発生する。」\nB：「牛乳には、カルシウムが豊富に含まれている。」\n（解答：Aは実際に反応している「物質」なので単体。Bは牛乳の中に金属の塊が入っているわけではなく「成分」なので元素。）"
      }
    ]
  }
};

const regex = /explanation:\s*JSON\.stringify\(([\s\S]*?)\),\s*surroundingKnowledge:/g;

let updatedData = data.replace(regex, (match, jsonString) => {
  try {
    const getObj = new Function(`return ${jsonString}`);
    const parsed = getObj();
    
    if (parsed.type === 'deep_thought' && parsed.phase1 && parsed.phase1.title === 'フェーズ1：思考構造の分析（ユーザー確認フェーズ）') {
      return `explanation: JSON.stringify(${JSON.stringify(newDeepThought, null, 2)}),\n              surroundingKnowledge:`;
    }
  } catch (e) {
    console.error("Error parsing object:", e);
  }
  return match;
});

fs.writeFileSync('src/data/chemistryData.ts', updatedData);
console.log("Updated chemistryData.ts");
