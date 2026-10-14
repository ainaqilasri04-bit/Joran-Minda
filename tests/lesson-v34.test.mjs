import {test} from 'node:test';
import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
import {readFile} from 'node:fs/promises';
import {runInNewContext,Script} from 'node:vm';
import {createHandler} from '../server/room-service.mjs';
import '../public/room-sync.js';
class Store{
 data=new Map();fail=null;
 async get(k){return structuredClone(this.data.get(k)||null);}
 async setJSON(k,v,o={}){if(this.fail?.(k,v))throw Error('simulated storage interruption');if(o.onlyIfNew&&this.data.has(k))return{modified:false};this.data.set(k,structuredClone(v));return{modified:true};}
 async delete(k){this.data.delete(k);}
 async list({prefix}){return{blobs:[...this.data.keys()].filter(k=>k.startsWith(prefix)).map(key=>({key}))};}
}
function client(store=new Store()){
 let clock=Date.now();const handler=createHandler(store,{now:()=>++clock});
 return async(b,token)=>{const res=await handler(new Request('https://test.example/.netlify/functions/kelas',{method:'POST',headers:{'Content-Type':'application/json',...(token?{Authorization:'Bearer '+token}:{})},body:JSON.stringify(b)}));return{status:res.status,...await res.json()};};
}
const order=['pembaca','pencari','pencatat','pemancing'];
const ok=r=>assert.equal(r.status,200,JSON.stringify(r));
const questionKeys={belang:[2,0,1],pondok:[0,2,1],pokok:[1,2,0],sihat:[2,1,0]};
const practiceKeys={belang:[1,2],pondok:[2,0],pokok:[1,0],sihat:[2,1]};

for(const story of ['belang','pondok','pokok','sihat'])for(const mode of ['kumpulan','kendiri'])test(`V34 ${story} ${mode}: code, recording, fishing, differentiated work, report and completion`,async()=>{
 const call=client(),made=await call({action:'create',name:'Ujian '+story,kelas:'3 A',story,mode,lesson:true,lessonVersion:34});
 assert.equal(made.status,201);assert.equal(made.room.lessonVersion,34);assert.match(made.room.code,/^\d{6}$/);
 const code=made.room.code,lookup=await call({action:'room-info',code:code.slice(0,3)+' - '+code.slice(3)});ok(lookup);assert.equal(lookup.room.lessonVersion,34);
 const users=[];
 for(const role of mode==='kumpulan'?order:['kendiri','kendiri']){const u=await call({action:'join',code,role,name:'Murid '+(users.length+1),kelas:'3 A'});assert.equal(u.status,201);users.push(u);}
 const members=mode==='kumpulan'?users:[users[0]],owner=(index=0)=>members[index%members.length];
 const save=(b,u=owner(b.type==='lesson-read'?b.page:b.index||0))=>call({action:'lesson-save',code,id:randomUUID(),...b},u.token);
 assert.equal((await call({action:'certificate',code},owner().token)).status,409);
 if(mode==='kumpulan')assert.equal((await save({type:'lesson-puzzle',layout:[0,1,2,3,4,5]},users[1])).status,403);
 ok(await save({type:'lesson-puzzle',layout:[0,1,2,3,4,5]}));ok(await save({type:'lesson-induction',choice:0}));
 for(let page=0;page<5;page++){
  const reader=owner(page);
  assert.equal((await save({type:'lesson-read',page})).status,409);
  const record={id:randomUUID(),memberId:reader.member.id,story,page,text:JoranStory.lessonText(story,page),audio:'data:audio/webm;base64,AAAA',mime:'audio/webm',duration:20};
  ok(await call({action:'pupil-audio-save',code,record},reader.token));ok(await save({type:'lesson-read',page}));
 }
 const bank=JoranLesson.bankFor(story,34);
 for(const [index,q] of bank.entries()){const evidence=JoranStory.lessonMake(story,q.page).sentences.findIndex(s=>s.includes(q.quote));assert(evidence>=0);ok(await save({type:'lesson-check',index,answer:q.answer,evidence}));}
 let state=await call({action:'state',code},owner().token);ok(state);assert.equal(state.progress[0].lesson.correct,3);
 if(mode==='kendiri'){
  const other=await call({action:'state',code},users[1].token);ok(other);assert.equal(other.members.length,1);assert.equal(other.flow.sequence,0);assert.equal(other.progress[0].lesson.induction,undefined);
  assert.equal((await call({action:'pupil-audio-list',code},users[1].token)).records.length,0);
 }
 let errors=0;
 while(!state.flow.finished){
  const f=state.flow,p=JoranStory.lessonMake(story,f.page,34),kind=f.sequence<20?['read','evidence','note','choice'][f.step]:f.sequence===20?'bonus-note':'bonus';
  const b={action:'turn',code,sequence:f.sequence,kind};
  if(kind==='evidence')b.choice=p.evidence;
  if(kind==='choice'){b.choice=f.page===0?(p.answer+1)%3:p.answer;if(f.page===0)errors++;}
  if(kind==='bonus')b.choice=0;
  if(kind.includes('note'))b.text='Tindakan watak menunjukkan nilai yang baik.';
  const acting=mode==='kumpulan'?users.find(u=>u.member.role===f.role):owner();
  if(mode==='kumpulan')assert.equal((await call(b,users.find(u=>u!==acting).token)).status,403);
  const response=await call(b,acting.token);ok(response);assert.equal(response.flow.sequence,f.sequence+1);
  if(kind==='choice')assert.equal(response.correct,f.page!==0);
  state.flow=response.flow;
 }
 for(let index=0;index<2;index++)ok(await save({type:'lesson-explain',index,value:bank[index].value,proofIndex:index,text:bank[index].action}));
 // Distinct diagnostics: two correct => reinforcement, three => enrichment, zero => matching.
 const routes=mode==='kumpulan'?['pengukuhan','pengayaan','pemulihan','pengukuhan']:['pengukuhan'];
 for(const [i,u] of members.entries()){
  const answers=questionKeys[story].map((key,j)=>routes[i]==='pemulihan'||routes[i]==='pengukuhan'&&j===2?(key+1)%3:key);
  ok(await save({type:'lesson-diagnostic',subjectId:u.member.id,answers},u));
  state=await call({action:'state',code},u.token);assert.equal(state.progress[0].lesson.personalRoutes[u.member.id],routes[i]);
  const payload=routes[i]==='pengayaan'?{application:'Kami membahagikan tugas bersama.',text:'Kami bekerjasama untuk membantu rakan.'}:routes[i]==='pemulihan'?{activity:'matching',matches:[0,1,2],text:bank[0].action}:{answers:practiceKeys[story],text:'Pilihan ini membantu menjaga keperluan bersama.'};
  ok(await save({type:'lesson-practice',subjectId:u.member.id,...payload},u));
  assert.equal((await call({action:'certificate',code},owner().token)).status,409);
 }
 state=await call({action:'state',code},owner().token);const lesson=state.progress[0].lesson;
 assert.equal(lesson.version,34);assert.equal(lesson.correct,3);assert.equal(lesson.explainedCorrect,2);assert(lesson.practiced);
 assert.equal(lesson.practices[0].correct,2,'new reinforcement key is used on the server');
 for(let page=0;page<5;page++)ok(await call({action:'completion',code,type:'review-page',page},owner(page).token));
 assert.equal((await call({action:'certificate',code},owner().token)).status,409);
 ok(await call({action:'completion',code,type:'reflection',text:'Saya akan mengamalkan nilai murni.'},owner().token));
 for(const u of members){const c=await call({action:'certificate',code,memberId:u.member.id},owner().token);ok(c);assert.equal(c.certificate.points,100-errors*2);assert.equal(c.certificate.name,u.member.name);}
 const report=await call({action:'report',code},made.teacherToken);ok(report);assert.equal(report.records.length,users.length);
 for(const u of members)assert.equal(report.records.find(r=>r.id===u.member.id).lessonPoints.total,98);
 if(mode==='kendiri')assert.equal((await call({action:'certificate',code},users[1].token)).status,409);
 assert.equal((await call({action:'report',code},owner().token)).status,403);
 // A new client with its saved token can resume the shared/personal state.
 const resumed=await call({action:'state',code},owner().token);assert.equal(resumed.flow.sequence,22);assert(resumed.progress[0].certificateEligible);
});

test('V34 failed storage does not strand a room code or reserve a pupil slot',async()=>{
 const store=new Store(),call=client(store),base={action:'create',name:'Ujian',kelas:'3 A',story:'belang',mode:'kumpulan',lesson:true,lessonVersion:34};
 store.fail=(k,v)=>k.startsWith('auth/')&&v.kind==='teacher';assert.equal((await call(base)).status,503);assert.equal([...store.data.keys()].filter(k=>k.startsWith('rooms/')).length,0);
 store.fail=null;const made=await call(base),code=made.room.code;
 for(const target of ['members','auth']){
  store.fail=(k,v)=>target==='members'?k.includes('/members/'):k.startsWith('auth/')&&v.kind==='student';
  assert.equal((await call({action:'join',code,name:'Ujian',kelas:'3 A',role:'pembaca'})).status,503);
  assert.deepEqual((await call({action:'room-info',code})).takenRoles,[]);
  assert.equal([...store.data.keys()].filter(k=>k.includes('/members/')).length,0);
 }
 store.fail=null;assert.equal((await call({action:'join',code,name:'Cuba semula',kelas:'3 A',role:'pembaca'})).status,201);
 const ping=await call({action:'ping'});ok(ping);assert(ping.lessonVersions.includes(34));
});

test('V34 question keys are varied, diagnostic questions differ, and story narration stays unchanged',()=>{
 for(const key of JoranStory.keys){
  const old=JoranLesson.bankFor(key,29),fresh=JoranLesson.bankFor(key,34),diagnostic=JoranLesson.diagnosticFor(key,34);
  assert.deepEqual(old.map(q=>q.answer),[1,0,2]);assert.deepEqual(diagnostic.map(q=>q.answer),questionKeys[key]);
  assert.equal(new Set(fresh.map(q=>q.options.join('|'))).size,3);
  for(const q of [...fresh,...diagnostic,...JoranLesson.practiceFor(key)]){assert.equal(new Set(q.options).size,3);assert(q.options[q.answer]);}
  for(let i=0;i<5;i++){const a=JoranStory.lessonMake(key,i,29),b=JoranStory.lessonMake(key,i,34);assert.deepEqual(b.sentences,a.sentences);assert.equal(b.title,a.title);assert(b.sentences[b.evidence]);assert.equal(b.labels[b.answer],b.value);}
 }
});

test('V34 polling coalesces slow overlapping reads and recovers after failure',async()=>{
 let active=0,max=0,calls=0,release;
 const first=new Promise(r=>release=r);
 const poll=JoranRoomSync.coalesce(async()=>{max=Math.max(max,++active);calls++;if(calls===1)await first;active--;});
 const a=poll();await Promise.resolve();const b=poll(),c=poll();release();await Promise.all([a,b,c]);assert.equal(max,1);assert.equal(calls,2);await poll();assert.equal(calls,3);
 let attempt=0;const recover=JoranRoomSync.coalesce(async()=>{if(!attempt++)throw Error('offline');});await assert.rejects(recover(),/offline/);await recover();assert.equal(attempt,2);
});

test('V34 inline source compiles and written questions match their listen text',async()=>{
 const html=await readFile(new URL('../public/index.html',import.meta.url),'utf8');
 for(const [i,m] of [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)].entries())if(m[1].trim())new Script(m[1],{filename:'inline-'+i});
 const src=await readFile(new URL('../scripts/lesson-v34.js',import.meta.url),'utf8');
 const chunk=src.slice(src.indexOf('const questionBefore34'),src.indexOf('const directionsBefore34'));
 const ctx={question24:()=>'',safe:s=>s,syl:s=>s};runInNewContext(chunk,ctx);
 for(const key of JoranStory.keys)for(const q of [...JoranQuestions34.diagnostic[key],...JoranQuestions34.reinforcement[key]]){
  const text=ctx.question24(q,0,'diagnostic',null);assert(text.includes(q.prompt));assert(text.includes('data-hear-check30="'+q.prompt+' Pilihan jawapan: '+q.options.join('. ')+'."'));assert.equal((text.match(/type="radio"/g)||[]).length,3);
 }
});
