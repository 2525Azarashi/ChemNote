const fs = require('fs');

const data = fs.readFileSync('src/data/chemistryData.ts', 'utf8');

const step1Content = `【思考内容】
純物質と混合物の定義を確認する

【思考タグ】
定義確認

小問題

純物質とは
「（　）種類の粒子からできている物質」である。


純物質は構成粒子の種類が 1種類

組成が 一定

である物質である。

例えば

水 (H₂O)・酸素 (O₂)・鉄 (Fe)　などはすべて純物質である。

したがって　（ア）＝ 1`;

const step2Content = `【思考内容】
純物質の物理的性質の特徴を理解する

【思考タグ】
性質理解

純物質では、融点・沸点・密度などの値は物質ごとに （ 等しく / 異 ）なる。

純物質は、組成が一定、粒子の種類が一定であるため、融点・沸点などの値はその物質固有の値として一定になる。

例えば

物質	融点
水	0℃
エタノール	-114℃

したがって（イ）＝ 等しく`;

const step3Content = `【思考内容】
混合物の定義を確認する

【思考タグ】
定義確認

混合物とは
「（　）種類以上の純物質が混じり合った物質」である。


混合物は、2種類以上の純物質が混じり合った物質である。

例えば

空気（窒素、酸素、アルゴンなどの混合物）
海水（水、塩化ナトリウムなどの混合物）
塩酸（水、塩化水素の混合物）

したがって（ウ）＝ 2`;

const step4Content = `【思考内容】
混合物の物理的性質の特徴を理解する

【思考タグ】
性質理解

混合物では、融点・沸点・密度などの値は成分物質の混合割合によって（ 等しく / 異 ）なる。

混合物は、成分物質の混合割合によって性質が変化するため、融点・沸点・密度などの値も混合割合によって異なる。

例えば

食塩水（水と塩化ナトリウムの混合物）の沸点は、食塩の濃度が高いほど高くなる。

したがって（エ）＝ 異`;

const contents = {
  "Step 1": step1Content,
  "Step 2": step2Content,
  "Step 3": step3Content,
  "Step 4": step4Content
};

// Find the JSON.stringify call for explanation
const regex = /explanation:\s*JSON\.stringify\(([\s\S]*?)\),\s*surroundingKnowledge:/g;

let updatedData = data.replace(regex, (match, jsonString) => {
  try {
    // Evaluate the string to get the object, since it's a JS object literal inside JSON.stringify
    // Wait, if it's JSON.stringify({ ... }), it's a JS object literal.
    // Let's use eval or new Function to parse it.
    const getObj = new Function(`return ${jsonString}`);
    const parsed = getObj();
    
    if (parsed.type === 'deep_thought' && parsed.phase2 && parsed.phase2.explanations) {
      parsed.phase2.explanations.forEach(exp => {
        if (contents[exp.step]) {
          exp.content = contents[exp.step];
        }
      });
      return `explanation: JSON.stringify(${JSON.stringify(parsed, null, 2)}),\n              surroundingKnowledge:`;
    }
  } catch (e) {
    console.error("Error parsing object:", e);
  }
  return match;
});

fs.writeFileSync('src/data/chemistryData.ts', updatedData);
console.log("Updated chemistryData.ts");
