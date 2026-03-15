import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'src/data/chemistryData.ts');
let content = fs.readFileSync(filePath, 'utf-8');

const newTree = `物質の判別プロセス
│
├─ 条件：組成が一定か？（物理的に分けられるか） [Step 1]
│   ├─ 知識：物理的方法（ろ過・蒸留など）で分離可能 [Step 6]
│   │   └─ 推論：融点・沸点が一定でない [Step 5]
│   │       └─ 結論：【混合物】（例：海水、空気、塩酸）
│   │
│   └─ 知識：物理的方法で分離不可（1種類の物質）
│       └─ 結論：【純物質】 [Step 2]
│           │
│           ├─ 条件：構成元素が1種類か？ [Step 3]
│           │   ├─ 知識：化学的方法（電気分解など）で分解可能 [Step 7]
│           │   │   └─ 推論：2種類以上の元素からなる
│           │   │       └─ 結論：【化合物】（例：塩化ナトリウム）
│           │   │
│           │   └─ 知識：これ以上分解できない
│           │       └─ 推論：1種類の元素からなる
│           │           └─ 結論：【単体】（例：酸素、鉄）
│           │               └─ 例外知識：常温で液体の単体（臭素、水銀） [Step 4]
│           │
│           └─ 条件：文脈における「名前」の使われ方
│               ├─ 知識：実際に存在する物質（性質・状態・反応）を指す
│               │   └─ 結論：【単体】（例：酸素吸入、水素が発生）
│               │
│               └─ 知識：物質の成分（構成要素・含有）を指す
│                   └─ 結論：【元素】（例：水は酸素からできている）`;

const regex = /id:\s*"p_c1_1_1",[\s\S]*?explanation:\s*JSON\.stringify\(([\s\S]*?)\),\n\s*surroundingKnowledge:/;
const match = content.match(regex);

if (match) {
  let explanationObj = JSON.parse(match[1]);
  explanationObj.phase1.tree = newTree;
  
  const newExplanationStr = JSON.stringify(explanationObj, null, 2);
  const newContent = content.replace(match[1], newExplanationStr);
  
  fs.writeFileSync(filePath, newContent, 'utf-8');
  console.log('Successfully updated chemistryData.ts');
} else {
  console.log('Could not find the explanation block for p_c1_1_1');
}
