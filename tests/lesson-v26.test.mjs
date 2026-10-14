import {test} from 'node:test';
import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
import {createHandler} from '../server/room-service.mjs';
class MemoryStore{data=new Map();async get(k){return structuredClone(this.data.get(k)||null);}async setJSON(k,v,o={}){if(o.onlyIfNew&&this.data.has(k))return{modified:false};this.data.set(k,structuredClone(v));return{modified:true};}async list({prefix}){return{blobs:[...this.data.keys()].filter(k=>k.startsWith(prefix)).map(key=>({key}))};}}
function client(){let at=1000000000;const handler=createHandler(new MemoryStore(),{now:()=>++at});return async(b,token)=>{const r=await handler(new Request('https://test.example/api',{method:'POST',headers:{'Content-Type':'application/json',...(token?{Authorization:'Bearer '+token}:{})},body:JSON.stringify(b)}));return {status:r.status,data:await r.json()};};}
test('V26 one teacher-appointed leader submits shared work; per-pupil recordings persist, are authorized and required; all certificates gated',async()=>{
 const call=client(),created=(await call({action:'create',name:'Kumpulan',kelas:'3 A',story:'belang',mode:'kumpulan',lesson:true,lessonVersion:26,leaderRole:'pencari'})).data,code=created.room.code,users=[];
 for(const role of ['pembaca','pencari','pencatat','pemancing'])users.push((await call({action:'join',code,role,name:role,kelas:'3 A'})).data);
 const leader=users[1],other=users[0],save=b=>call({action:'lesson-save',code,id:randomUUID(),...b},leader.token);
 assert.equal((await call({action:'lesson-save',code,id:randomUUID(),type:'lesson-puzzle',layout:[0,1,2,3,4,5]},other.token)).status,403);
 await save({type:'lesson-puzzle',layout:[0,1,2,3,4,5]});await save({type:'lesson-induction',choice:0});
 assert.equal((await save({type:'lesson-read',page:0})).status,409);
 const recordings=[];
 for(let page=0;page<5;page++){
  for(const u of users){const record={id:randomUUID(),memberId:u.member.id,story:'belang',page,text:JoranStory.lessonText('belang',page),audio:'data:audio/webm;base64,AAAA',mime:'audio/webm',duration:20};recordings.push(record);assert.equal((await call({action:'pupil-audio-save',code,record},leader.token)).status,200);}
  assert.equal((await save({type:'lesson-read',page})).status,200);
 }
 const rec=recordings[2];assert.equal((await call({action:'pupil-audio-save',code,record:{...rec,id:randomUUID()}},other.token)).status,403);
 assert.equal((await call({action:'pupil-audio-read',code,id:rec.id},other.token)).status,403);
 assert.equal((await call({action:'pupil-audio-save',code,record:rec},leader.token)).status,200);
 assert.equal((await call({action:'pupil-audio-save',code,record:{...rec,audio:'data:audio/webm;base64,AABB'}},leader.token)).status,409);
 const retake={...rec,id:randomUUID()};assert.equal((await call({action:'pupil-audio-save',code,record:retake},users[2].token)).status,200);
 assert.equal((await call({action:'pupil-audio-list',code},created.teacherToken)).data.records.length,21);
 const grade={intonation:'Baik',pause:'Memuaskan',pronunciation:'Baik',note:'Jeda selepas tanda noktah.'};
 assert.equal((await call({action:'pupil-audio-grade',code,id:rec.id,grade},leader.token)).status,403);
 assert.equal((await call({action:'pupil-audio-grade',code,id:rec.id,grade},created.teacherToken)).status,200);
 assert.equal((await call({action:'pupil-audio-list',code},created.teacherToken)).data.records.find(r=>r.id===retake.id).grade,undefined);
 await save({type:'lesson-values',answers:[1,0,2],evidence:[3,1,3]});let state=(await call({action:'state',code},leader.token)).data;assert(state.progress.every(p=>p.lesson.ready));
 assert.equal((await call({action:'turn',code,sequence:0,kind:'read'},other.token)).status,403);
 while(!state.flow.finished){const f=state.flow,kind=f.sequence<20?['read','evidence','note','choice'][f.step]:f.sequence===20?'bonus-note':'bonus',b={action:'turn',code,sequence:f.sequence,kind};if(kind==='evidence')b.choice=JoranStory.lessonMake('belang',f.page).evidence;if(kind==='choice')b.choice=JoranStory.lessonMake('belang',f.page).answer;if(kind==='bonus')b.choice=0;if(kind.includes('note'))b.text='Kami bekerjasama menjaga Belang.';const r=await call(b,leader.token);assert.equal(r.status,200,JSON.stringify(r));state.flow=r.data.flow;}
 for(const[index,value]of ['Kasih sayang','Kerjasama'].entries())await save({type:'lesson-explain',index,value,text:index?'Hana dan Iman membahagikan tugas.':'Hana membantu Belang.'});
 await save({type:'lesson-route',route:'pengukuhan'});await save({type:'lesson-practice',answers:[0,1],text:'Mereka saling membantu.'});
 assert.equal((await call({action:'certificate',code},leader.token)).status,409);
 assert.equal((await call({action:'completion',code,type:'reflection',text:'Kami akan membantu rakan.'},other.token)).status,403);
 for(let page=0;page<5;page++)await call({action:'completion',code,type:'review-page',page},leader.token);
 await call({action:'completion',code,type:'reflection',text:'Kami akan membantu rakan.'},leader.token);
 for(const u of users){const cert=await call({action:'certificate',code,memberId:u.member.id},leader.token);assert.equal(cert.status,200);assert.equal(cert.data.certificate.name,u.member.name);assert.equal(cert.data.certificate.points,100);}
 const report=(await call({action:'report',code},created.teacherToken)).data;assert(report.records.every(r=>r.groupShared26&&r.lessonPoints.total===100&&r.readingPages.length===5));
 const foreign=(await call({action:'create',name:'Lain',kelas:'3 A',story:'belang',mode:'kendiri',lesson:true,lessonVersion:26})).data;
 assert.equal((await call({action:'pupil-audio-read',code:foreign.room.code,id:rec.id},foreign.teacherToken)).status,403);
});
test('V26 individual rooms keep recordings and progress separate',async()=>{
 const call=client(),created=(await call({action:'create',name:'Individu',kelas:'3 A',story:'belang',mode:'kendiri',lesson:true,lessonVersion:26})).data,code=created.room.code;
 const a=(await call({action:'join',code,name:'A',kelas:'3 A',role:'kendiri'})).data,b=(await call({action:'join',code,name:'B',kelas:'3 A',role:'kendiri'})).data;
 const record={id:randomUUID(),memberId:a.member.id,story:'belang',page:0,text:JoranStory.lessonText('belang',0),audio:'data:audio/webm;base64,AAAA',mime:'audio/webm',duration:20};
 assert.equal((await call({action:'pupil-audio-save',code,record},a.token)).status,200);assert.equal((await call({action:'pupil-audio-list',code},b.token)).data.records.length,0);assert.equal((await call({action:'pupil-audio-read',code,id:record.id},b.token)).status,403);
 assert.equal((await call({action:'certificate',code},a.token)).status,409);
});
