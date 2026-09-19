import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
export function validateListeningHandoff(body) {
  const lines=String(body||'').split(/\r?\n/).map(s=>s.trim());
  const decisions=lines.filter(s=>s.startsWith('リスニング配布判断:'));
  const allowed=['リスニング配布判断: リスニングにも送ってください。','リスニング配布判断: リスニングには送らないでください。'];
  const errors=[];
  if(decisions.length!==1||!allowed.includes(decisions[0]))errors.push('リスニング配布判断は送る／送らないの一方を明記してください。');
  for(const field of ['リスニング配布理由:','リスニング対象:','リスニング受け渡し状況:']) {
    const rows=lines.filter(s=>s.startsWith(field));const value=rows[0]?.slice(field.length).trim()||'';
    if(rows.length!==1||value.length<2||/記入|選択してください|^（/.test(value))errors.push(field+'を具体的に記入してください。');
  }
  return errors;
}
if(process.argv[1] && import.meta.url===pathToFileURL(process.argv[1]).href) {
  const body=process.argv[2]==='--pr'
    ? JSON.parse(execFileSync('gh',['pr','view',process.argv[3],'--json','body'],{encoding:'utf8'})).body
    : readFileSync(process.argv[2]||0,'utf8');
  const errors=validateListeningHandoff(body);
  if(errors.length){console.error(errors.join('\n'));process.exitCode=1;}else console.log('PASS: listening delivery decision, reason, scope and status are explicit.');
}
