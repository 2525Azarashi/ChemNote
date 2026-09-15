import { beforeAll, beforeEach, afterAll, it, expect, vi } from 'vitest';
import { assertFails, initializeTestEnvironment, type RulesTestEnvironment } from '@firebase/rules-unit-testing';
import { doc, setDoc, getDoc, getDocs, collection, serverTimestamp } from 'firebase/firestore';
import { readFileSync } from 'node:fs';
const state=vi.hoisted(()=>({db:null as any,auth:{currentUser:null as any}}));
vi.mock('../src/firebase',()=>({get db(){return state.db;},auth:state.auth}));
vi.mock('../src/utils/leaderboard',()=>({resolveNickname:()=>state.auth.currentUser?.uid || 'test'}));
vi.mock('../src/battle/data/battlePool',()=>{
 const pool=Array.from({length:20},(_,i)=>({id:`arena-${i}`,chapterId:'c',problemId:`p${i}`,subQuestionId:'s',format:'choice4'}));
 return {loadPool:async()=>pool,poolIdsOf:async()=>pool.map(q=>q.id)};
});
import { findOrEnqueue, leaveQueue, watchMatched, startBattle } from '../src/battle/data/battle';
let env:RulesTestEnvironment;
const subject='chemistry_basic';
const login=(uid:string)=>{state.auth.currentUser={uid,photoURL:''};state.db=env.authenticatedContext(uid).firestore();};
beforeAll(async()=>{env=await initializeTestEnvironment({projectId:'mntb-arena-test',firestore:{host:'127.0.0.1',port:8080,rules:readFileSync('firestore.rules','utf8')}});},30000);
beforeEach(async()=>{await env.clearFirestore();login('a');});
afterAll(async()=>{await env?.cleanup();});
it('actual sessions ignore 12 old friend rooms, pair both players and start',async()=>{
 await env.withSecurityRulesDisabled(async c=>{
  for(let i=0;i<12;i++)await setDoc(doc(c.firestore(),'battle_rooms',`old-${i}`),{status:'waiting',mode:'friend',subject,joinCode:'ABCD',players:['a','old'],createdAt:serverTimestamp()});
 });
 expect((await findOrEnqueue(subject,'session-a')).roomId).toBeNull();
 const found:string[]=[];const errors:unknown[]=[];
 const stop=watchMatched(id=>found.push(id),e=>errors.push(e),{subject,sessionId:'session-a'});
 try{
  await new Promise(r=>setTimeout(r,150));expect(found).toEqual([]);
  login('b');const second=await findOrEnqueue(subject,'session-b');expect(second.roomId).toBeTruthy();
  await vi.waitFor(()=>expect(found).toContain(second.roomId),{timeout:5000});expect(errors).toEqual([]);
  const room=(await getDoc(doc(state.db,'battle_rooms',second.roomId!))).data()!;
  expect(room.mode).toBe('random');expect(room.joinCode).toBe('');expect(room.rules.scoringVersion).toBe(2);
  expect(room.profiles.a.matchSessionId).toBe('session-a');expect(room.profiles.b.matchSessionId).toBe('session-b');
  expect((await getDocs(collection(state.db,'battle_queue'))).empty).toBe(true);
  await startBattle(second.roomId!,20);
  expect((await getDoc(doc(state.db,'battle_rooms',second.roomId!))).get('status')).toBe('playing');
 }finally{stop();}
},20000);
it('old cleanup cannot delete a new session ticket',async()=>{
 await findOrEnqueue(subject,'old');await findOrEnqueue(subject,'new');await leaveQueue('old');
 expect((await getDoc(doc(state.db,'battle_queue','a'))).get('profile').matchSessionId).toBe('new');
 await leaveQueue('new');expect((await getDoc(doc(state.db,'battle_queue','a'))).exists()).toBe(false);
});
it('canceled searches create no ticket',async()=>{
 const c=new AbortController();c.abort();await expect(findOrEnqueue(subject,'canceled',c.signal)).rejects.toThrow();
 expect((await getDoc(doc(state.db,'battle_queue','a'))).exists()).toBe(false);
});
it('old scoring and other subjects stay separate',async()=>{
 await setDoc(doc(state.db,'battle_queue','a'),{uid:'a',subject,profile:{uid:'a',nickname:'a',photoURL:'',rating:1500},createdAt:serverTimestamp()});
 login('b');expect((await findOrEnqueue(subject,'b')).roomId).toBeNull();
 login('c');expect((await findOrEnqueue('math','c')).roomId).toBeNull();
 expect((await getDocs(collection(state.db,'battle_queue'))).size).toBe(3);
});
it('presence is writable by its owner and readable by friends, not strangers',async()=>{
 await env.withSecurityRulesDisabled(async c=>{
  await setDoc(doc(c.firestore(),'friend_profiles','a'),{uid:'a',nickname:'a'});
  await setDoc(doc(c.firestore(),'friends','b','items','a'),{uid:'a'});
 });
 const {updateDoc}=await import('firebase/firestore');
 await updateDoc(doc(state.db,'friend_profiles','a'),{presenceActive:true,presenceAt:serverTimestamp()});
 login('b');const p=await getDoc(doc(state.db,'friend_profiles','a'));
 expect(p.get('presenceActive')).toBe(true);expect(p.get('presenceAt').toMillis()).toBeGreaterThan(0);
 await assertFails(updateDoc(doc(state.db,'friend_profiles','a'),{presenceActive:false}));
 login('stranger');await assertFails(getDoc(doc(state.db,'friend_profiles','a')));
});
