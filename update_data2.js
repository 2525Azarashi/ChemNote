import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'src/data/chemistryData.ts');
let content = fs.readFileSync(filePath, 'utf-8');

// The new explanations data
const newExplanations = [
  {
    "step": "Step 1",
    "tag": "定義確認",
    "content": "【思考内容】\n純物質と混合物の定義を確認する\n\n小問題\n\n純物質とは\n「（　）種類の粒子からできている物質」である。\n\n\n純物質は構成粒子の種類が 1種類\n\n組成が 一定\n\nである物質である。\n\n例えば\n\n水 (H₂O)・酸素 (O₂)・鉄 (Fe)　などはすべて純物質である。\n\nしたがって　（ア）＝ 1"
  },
  {
    "step": "Step 2",
    "tag": "性質理解",
    "content": "【思考内容】\n純物質の物理的性質の特徴を理解する\n\n純物質では、融点・沸点・密度などの値は物質ごとに （ 等しく / 異 ）なる。\n\n純物質は、組成が一定、粒子の種類が一定であるため、融点・沸点などの値はその物質固有の値として一定になる。\n\n例えば\n\n物質\t融点\n水\t0℃\nエタノール\t-114℃\n\nしたがって（イ）＝ 等しく"
  },
  {
    "step": "Step 3",
    "tag": "分類理解",
    "content": "【思考内容】\n純物質の分類を理解する\n\n純物質は次のように分類される。\n\n1種類の（　）からできている → （　）\n\n2種類以上の（　）からできている → （　）\n\n\n純物質は\n\n分類\t構成\n単体\t1種類の元素\n化合物\t2種類以上の元素\n\n例えば、\n\n単体　O₂・Fe・S₈\n\n化合物　H₂O・CO₂・NaCl\n\nしたがって\n\n（ウ）＝ 元素\n（エ）＝ 単体\n（オ）＝ 化合物"
  },
  {
    "step": "Step 4",
    "tag": "知識照合",
    "content": "【思考内容】\n\n常温で液体の単体を思い出す\n\n室温で液体として存在する単体元素は\n\n水銀　・（　）の2つである。\n\n\n常温で液体の元素は\n\n元素\t状態\n臭素\t液体\n水銀\t液体\n\n他の元素は固体・気体\n\nで存在する。したがって（カ）＝ 臭素"
  },
  {
    "step": "Step 5",
    "tag": "因果関係理解",
    "content": "【思考内容】\n\n混合物の性質の変化を理解する\n\n混合物では混じっている物質の種類やその（　）によって融点や沸点の値が（ 等しく / 異 ）なる。\n\n混合物では成分の種類・成分の割合が変わると性質も変化する。\n\n例\n\n食塩水\n\n濃度\t沸点\n5%\t約100.3℃\n20%\t約101℃\n\nつまり\n\n混合物では\n沸点は 一定ではない。\n\nしたがって\n\n（キ）＝ 割合\n（ク）＝ 異"
  },
  {
    "step": "Step 6",
    "tag": "知識照合",
    "content": "【思考内容】\n\n混合物の分離方法を理解する\n\n混合物を純物質に分けるときは\n\nろ過・蒸留などの（　）的方法を用いる。\n\n\n\n混合物の分離では物質の沸点・溶解度・粒子の大きさなどの 物理的性質の違い を利用する。\n\n例\n\n方法\t原理\nろ過\t粒子サイズ\n蒸留\t沸点\n\nしたがって（ケ）＝ 物理"
  },
  {
    "step": "Step 7",
    "tag": "因果関係理解",
    "content": "【思考内容】\n\n化合物の分解方法を理解する\n\n化合物を単体に分解するには\n電気分解などの（　）的方法が必要である。\n\n\n\n化合物は元素同士が 化学結合 してできている。\n\nそのため分解には電気分解・熱分解などの 化学反応 が必要になる。\n\n例\n\n水の電気分解\n\nH₂O→H₂ + O₂\n\nしたがって（コ）＝ 化学"
  }
];

// Find the explanation string for p_c1_1_1
const regex = /id:\s*"p_c1_1_1",[\s\S]*?explanation:\s*JSON\.stringify\(([\s\S]*?)\),\n\s*surroundingKnowledge:/;
const match = content.match(regex);

if (match) {
  let explanationObj = JSON.parse(match[1]);
  explanationObj.phase2.explanations = newExplanations;
  
  const newExplanationStr = JSON.stringify(explanationObj, null, 2);
  const newContent = content.replace(match[1], newExplanationStr);
  
  fs.writeFileSync(filePath, newContent, 'utf-8');
  console.log('Successfully updated chemistryData.ts');
} else {
  console.log('Could not find the explanation block for p_c1_1_1');
}
