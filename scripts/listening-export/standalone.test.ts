import { it, expect } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { SUBJECTS, getChaptersOfSubject } from '../src/data/allChapters';
import { SUBJECT_INDEX, SUBJECT_STATS } from '../src/data/chapterIndex.generated';
import { FEATURES, isSubjectEnabled } from '../src/config/features';
import { POOL_COUNTS, loadPool } from '../src/battle/data/battlePool';
import { defaultEnabledSubjects, normalizeRule } from '../src/battle/core/battleRules';
import { arenaRule } from '../src/battle/core/arenaRules';
const subject = 'english_listening';
it('exposes only listening across study catalogs and battles', () => {
  expect(SUBJECTS.map(s=>s.id)).toEqual([subject]);
  expect(SUBJECT_INDEX.map(s=>s.id)).toEqual([subject]);
  expect(Object.keys(SUBJECT_STATS)).toEqual([subject]);
  expect(Object.keys(POOL_COUNTS)).toEqual([subject]);
  expect(defaultEnabledSubjects()).toEqual([subject]);
  expect(FEATURES.battle).toBe(true);
  for(const other of ['math','chemistry','chemistry_basic','english_grammar','biology_basic','geography','rika','english_vocab']) {
    expect(isSubjectEnabled(other)).toBe(false);
    expect(normalizeRule(other,{enabled:true}).enabled).toBe(false);
  }
});
it('keeps nine units, __PRACTICE_TOTAL__ practice problems and their audio/images', () => {
  const chapters=getChaptersOfSubject(subject);
  expect(chapters).toHaveLength(9);
  expect(chapters.reduce((sum,c)=>sum+c.practiceProblems.length+c.miniTest.length,0)).toBe(__PRACTICE_TOTAL__);
  const audio=new Set<string>();const assets=new Set<string>();
  const walk=(value:unknown,key='')=>{
    if(typeof value==='string') {
      if(key==='audioUrl') {expect(value.startsWith('/')).toBe(true);audio.add(value);assets.add(value);}
      for(const hit of value.matchAll(/(?:src=["']|url\(["']?)(\/[^"'\s)>]+)/g))assets.add(hit[1]);
      if(value.startsWith('/')&&/\.(png|jpg|jpeg|webp|svg|mp3|mp4)(\?|$)/i.test(value))assets.add(value);
    }else if(Array.isArray(value))value.forEach(v=>walk(v));
    else if(value&&typeof value==='object')Object.entries(value).forEach(([k,v])=>walk(v,k));
  };
  walk(chapters);expect(audio.size).toBeGreaterThan(100);
  for(const path of assets)expect(existsSync(resolve('public','.'+decodeURIComponent(path.split('?')[0]))),path).toBe(true);
  console.log(`Verified ${audio.size} distinct audio URLs and ${assets.size} referenced local assets.`);
});
it('loads __POOL_TOTAL__ recorded battle questions with 55-second rounds',async()=>{
  const pool=await loadPool(subject);expect(pool).toHaveLength(__POOL_TOTAL__);
  expect(new Set(pool.map(q=>q.id)).size).toBe(__POOL_TOTAL__);
  for(const q of pool){expect(q.subject).toBe(subject);expect(q.audioUrl).toBeTruthy();expect(existsSync(resolve('public','.'+q.audioUrl!))).toBe(true);}
  expect(arenaRule(normalizeRule(subject,{})).timeLimitOverride).toBe(55);
  expect(await loadPool('math')).toEqual([]);
});
it('does not reuse integrated credentials or non-listening home links',()=>{
  const firebase=readFileSync('src/firebase.ts','utf8');
  expect(firebase).not.toContain('AIzaSy');expect(firebase).not.toContain('141618374149');
  expect(JSON.parse(readFileSync('.firebaserc','utf8')).projects.default).toBe('demo-manatobi-listening');
  expect(readFileSync('src/components/Home.tsx','utf8')).not.toContain('>まとめプリント</button>');
  expect(readFileSync('src/components/Home.tsx','utf8')).not.toContain('>全体のつながりを見る</button>');
});
it('ships only commercial audio listed in the ledger', () => {
  const status=JSON.parse(readFileSync('COMMERCIAL_AUDIO_STATUS.json','utf8'));
  const ledger=JSON.parse(readFileSync('listening_audio_ledger.json','utf8'));
  expect(status.totalTracks).toBe(ledger.length);
  if(status.status==='approved'){expect(status.legacyTracks).toEqual([]);for(const r of ledger)expect(r.status,r.audioUrl).toBe('replaced');}
  for(const r of ledger)expect(existsSync(resolve('public','.'+r.audioUrl)),r.audioUrl).toBe(true);
});
