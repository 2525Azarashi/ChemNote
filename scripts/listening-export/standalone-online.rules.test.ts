import { beforeAll,beforeEach,afterAll,it,expect,vi } from 'vitest';
import { initializeTestEnvironment,type RulesTestEnvironment,assertFails } from '@firebase/rules-unit-testing';
import { doc,getDoc,updateDoc } from 'firebase/firestore';
import { readFileSync } from 'node:fs';
const state=vi.hoisted(()=>({db:null as any,auth:{currentUser:null as any}}));
vi.mock('../src/firebase',()=>({get db(){return state.db;},auth:state.auth}));
vi.mock('../src/utils/leaderboard',()=>({resolveNickname:()=>state.auth.currentUser?.uid || 'test'}));
import { createFriendRoom,joinRoomByCode,findOrEnqueue,startBattle,submitAnswer,advanceQuestion,watchMatched } from '../src/battle/data/battle';
import { loadPool } from '../src/battle/data/battlePool';
let env:RulesTestEnvironment;
const subject='english_listening';
const login=(uid:string)=>{state.auth.currentUser={uid,photoURL:''};state.db=env.authenticatedContext(uid).firestore();};
beforeAll(async()=>{env=await initializeTestEnvironment({projectId:'demo-listening-online',firestore:{host:'127.0.0.1',port:8080,rules:readFileSync('firestore.rules','utf8')}});await loadPool(subject);},30000);
beforeEach(async()=>{await env.clearFirestore();login('listener-a');});
afterAll(async()=>{await env?.cleanup();});
it('two listening clients create/join/start and answer under security rules',async()=>{
 const created=await createFriendRoom(subject,{questionCount:3});
 login('listener-b');expect(await joinRoomByCode(created.joinCode)).toBe(created.roomId);
 login('listener-a');await startBattle(created.roomId,55);
 const room=await getDoc(doc(state.db,'battle_rooms',created.roomId));
 expect(room.get('subject')).toBe(subject);expect(room.get('players')).toEqual(['listener-a','listener-b']);
 expect(room.get('rules').timeLimitOverride).toBe(55);
 const pool=await loadPool(subject);expect(room.get('questionIds').every((id:string)=>pool.some(q=>q.id===id&&q.audioUrl))).toBe(true);
 await submitAnswer(created.roomId,0,{choice:0,panel:[]},false);
 login('listener-b');await submitAnswer(created.roomId,0,{choice:1,panel:[]},false);
 await advanceQuestion(created.roomId,1,55);
 expect((await getDoc(doc(state.db,'battle_rooms',created.roomId))).get('currentIndex')).toBe(1);
 login('outsider');await assertFails(updateDoc(doc(state.db,'battle_rooms',created.roomId),{currentIndex:2}));
},30000);
it('national listening queue pairs two sessions and notifies the waiting player',async()=>{
 expect((await findOrEnqueue(subject,'listening-a')).roomId).toBeNull();
 const found:string[]=[];const errors:unknown[]=[];
 const stop=watchMatched(id=>found.push(id),e=>errors.push(e),{subject,sessionId:'listening-a'});
 try {
  login('listener-b');const second=await findOrEnqueue(subject,'listening-b');expect(second.roomId).toBeTruthy();
  await vi.waitFor(()=>expect(found).toContain(second.roomId),{timeout:5000});expect(errors).toEqual([]);
  const room=await getDoc(doc(state.db,'battle_rooms',second.roomId!));expect(room.get('subject')).toBe(subject);expect(room.get('mode')).toBe('random');
 }finally{stop();}
},30000);
