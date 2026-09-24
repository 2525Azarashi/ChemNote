import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {getAllListeningChapters} from '../src/data/englishListeningData';
const old=JSON.parse(readFileSync('scripts/data/listening_premium_manifest.json','utf8')) as any[];
const q6=JSON.parse(readFileSync('src/data/listeningSets/listening-q6.json','utf8'));
const oldByUrl=new Map(old.map(r=>[r.audioUrl,r]));
const q6ByFile=new Map<string,any>();
for(const set of q6.sets)for(const part of [set.partA,set.partB])q6ByFile.set(part.audio,part);
const jobs:any[]=[];
for(const c of getAllListeningChapters())for(const p of c.practiceProblems)for(const t of p.audioTracks||[]) {
 const prior=oldByUrl.get(t.audioUrl);const extended=q6ByFile.get(t.audioUrl.split('/').pop());
 const turns=t.turns?.length?t.turns:[{who:'solo',text:t.script}];const roles=[...new Set(turns.map((x:any)=>x.who))];
 const voices:Record<string,string>={};const notes:string[]=[];let female=0,male=0;
 for(const [index,who] of roles.entries()) {
  const declared=extended?.speakers?.find((s:any)=>s.name===who)||prior?.speakers?.[who];
  const description=JSON.stringify(declared||{});let sex='';
  if(/female|女性|女の子/i.test(description)||/^(W|Woman|Girl)$/i.test(who))sex='female';
  else if(/male|男性|男の子/i.test(description)||/^(M|Man|Boy)$/i.test(who))sex='male';
  else{sex=index%2===0?'female':'male';if(who!=='solo')notes.push('speaker role requires review: '+who);}
  const british=/British/i.test(description);
  const pool=sex==='female'?(british?['bf_emma','bf_isabella']:['af_heart','af_bella','af_nicole']):(british?['bm_george','bm_lewis']:['am_michael','am_fenrir','am_echo']);
  voices[who]=pool[(sex==='female'?female++:male++)%pool.length];
  if(/Australian|Canadian/i.test(description))notes.push('accent approximated with American English: '+who);
 }
 const segments=turns.map((turn:any)=>({speaker:turn.who,text:turn.text,voice:voices[turn.who],lang:voices[turn.who].startsWith('b')?'en-gb':'en-us'}));
 const digest=createHash('sha256').update(JSON.stringify(segments)).digest('hex');
 jobs.push({id:t.subId,audioUrl:t.audioUrl,chapter:c.id,problemId:p.id,segments,sourceSha256:digest,words:segments.reduce((n:number,s:any)=>n+s.text.split(/\s+/).length,0),notes,oldEngine:prior?.engine||'unverified',repetitions:1,reviewStatus:'pending'});
}
if(new Set(jobs.map(j=>j.audioUrl)).size!==jobs.length)throw new Error('Duplicate output paths');
mkdirSync('.tmpwork/kokoro',{recursive:true});
writeFileSync('.tmpwork/kokoro/jobs.json',JSON.stringify(jobs,null,2));
console.log(JSON.stringify({jobs:jobs.length,words:jobs.reduce((s,j)=>s+j.words,0),speakerReview:jobs.filter(j=>j.notes.length).length}));
