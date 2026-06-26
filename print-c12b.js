import { chemistryData } from './src/data/chemistryData.ts';

const ch2 = chemistryData.parts[0].chapters[2];
console.log(`Chapter ID: ${ch2.id} [${ch2.abstractTitle}]`);
if (ch2.miniTest) {
  ch2.miniTest.forEach((t, idx) => {
    console.log(`\n--- Test [${idx}] ID: ${t.id} Category: ${t.category} ---`);
    console.log(t.text.substring(0, 300) + '...');
  });
}
