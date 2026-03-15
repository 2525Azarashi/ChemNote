const fs = require('fs');

const data = fs.readFileSync('src/data/chemistryData.ts', 'utf8');

const newExplanations = [
  {
    "step": "Step 1",
    "tag": "定義確認",
    "subQuestionIds": ["p1_a", "p1_i", "p1_u", "p1_e", "p1_o", "p1_ka", "p1_ki", "p1_ku", "p1_ke", "p1_ko"],
    "subQuestionLabels": ["問1(ア)", "問1(イ)", "問1(ウ)", "問1(エ)", "問1(オ)", "問1(カ)", "問1(キ)", "問1(ク)", "問1(ケ)", "問1(コ)"],
    "content": "【思考内容】\n物質を分ける最初の基準は「物理的に分けられるか」です。\n\n物理的な方法（ろ過や蒸留など）で分けられるものは「混合物」、分けられないものは「純物質」となります。\n純物質は「1種類」の粒子からできています。"
  },
  {
    "step": "Step 2",
    "tag": "性質・分類",
    "subQuestionIds": ["q2_1", "q2_3", "q2_6"],
    "subQuestionLabels": ["問2(1)", "問2(3)", "問2(6)"],
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
    "subQuestionIds": ["q2_4"],
    "subQuestionLabels": ["問2(4)"],
    "content": "【思考内容】\n化合物の定義と具体例を確認します。\n\n純物質のうち、2種類以上の元素からなるものを「化合物」といいます。\n化合物を分解するには、電気分解などの「化学」的な方法が必要です。\n具体例として、メタン（CH₄）などが挙げられます。"
  },
  {
    "step": "Step 5",
    "tag": "定義・分類",
    "subQuestionIds": ["q2_2", "q2_5"],
    "subQuestionLabels": ["問2(2)", "問2(5)"],
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
];

const regex = /explanation:\s*JSON\.stringify\(([\s\S]*?)\),\s*surroundingKnowledge:/g;

let updatedData = data.replace(regex, (match, jsonString) => {
  try {
    const getObj = new Function(`return (${jsonString})`);
    const parsed = getObj();
    
    if (parsed.type === 'deep_thought' && parsed.phase2) {
      parsed.phase2.explanations = newExplanations;
      return `explanation: JSON.stringify(${JSON.stringify(parsed, null, 2)}),\n              surroundingKnowledge:`;
    }
  } catch (e) {
    console.error("Error parsing object:", e);
  }
  return match;
});

fs.writeFileSync('src/data/chemistryData.ts', updatedData);
console.log("Updated chemistryData.ts explanations");
