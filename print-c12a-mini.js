import { chemistryData } from './src/data/chemistryData.ts';

const ch1 = chemistryData.parts[0].chapters[1];
console.log(`Chapter ID: ${ch1.id} [${ch1.abstractTitle}]`);
if (ch1.miniTest) {
  ch1.miniTest.forEach((t, idx) => {
    console.log(`\n--- Test [${idx}] ID: ${t.id} Category: ${t.category} ---`);
    console.log(t.text.substring(0, 300) + '...');
  });
}
