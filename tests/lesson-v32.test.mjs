import {test} from 'node:test';
import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
import {createHandler} from '../server/room-service.mjs';
class MemoryStore{data=new Map();async get(k){return structuredClone(this.data.get(k)||null);}async setJSON(k,v,o={}){if(o.onlyIfNew&&this.data.has(k))return{modified:false};this.data.set(k,structuredClone(v));return{modified:true};}async delete(k){this.data.delete(k);}async list({prefix}){return{blobs:[...this.data.keys()].filter(k=>k.startsWith(prefix)).map(key=>({key}))};}}
function client(){let at=1000000000;const handler=createHandler(new MemoryStore(),{now:()=>++at});return async(b,token)=>{const r=await handler(new Request('https://test.example/api',{method:'POST',headers:{'Content-Type':'application/json',...(token?{Authorization:'Bearer '+token}:{})},body:JSON.stringify(b)}));return {status:r.status,data:await r.json()};};}
test('V32 matching accepts incorrect pairs, preserves contributor gates and deducts points before certificates',async()=>{
 const call=client(),created=(await call({action:'create',name:'Kumpulan',kelas:'3 A',story:'belang',mode:'kumpulan',lesson:true,lessonVersion:29,leaderRole:'pencari'})).data,code=created.room.code,users=[];
 for(const role of ['pembaca','pencari','pencatat','pemancing'])users.push((await call({action:'join',code,role,name:role,kelas:'3 A'})).data);
 const leader=users[0],other=users[1],save=(b,u=users[b.type==='lesson-read'?b.page%4:b.type==='lesson-check'||b.type==='lesson-explain'?b.index:0])=>call({action:'lesson-save',code,id:randomUUID(),...b},u.token);
 assert.equal((await call({action:'lesson-save',code,id:randomUUID(),type:'lesson-puzzle',layout:[0,1,2,3,4,5]},other.token)).status,403);
 await save({type:'lesson-puzzle',layout:[0,1,2,3,4,5]});await save({type:'lesson-induction',choice:0});
 assert.equal((await save({type:'lesson-read',page:0})).status,409);
 const recordings=[];
 for(let page=0;page<5;page++){
  for(const u of [users[page%4]]){const record={id:randomUUID(),memberId:u.member.id,story:'belang',page,text:JoranStory.lessonText('belang',page),audio:'data:audio/webm;base64,AAAA',mime:'audio/webm',duration:20};recordings.push(record);assert.equal((await call({action:'pupil-audio-save',code,record},u.token)).status,200);}
  assert.equal((await save({type:'lesson-read',page})).status,200);
 }
 assert.equal((await call({action:'pupil-audio-save',code,record:{...recordings[2],id:randomUUID()}},leader.token)).status,403);
 for(let index=0;index<3;index++){const result=await save({type:'lesson-check',index,answer:[1,0,2][index],evidence:[3,1,3][index]});assert.equal(result.status,200,JSON.stringify(result));}
 let state=(await call({action:'state',code},leader.token)).data;assert(state.progress.every(p=>p.lesson.ready));
 assert.equal((await call({action:'turn',code,sequence:0,kind:'read'},other.token)).status,403);
 while(!state.flow.finished){const f=state.flow,kind=f.sequence<20?['read','evidence','note','choice'][f.step]:f.sequence===20?'bonus-note':'bonus',b={action:'turn',code,sequence:f.sequence,kind};if(kind==='evidence')b.choice=f.page===0?0:JoranStory.lessonMake('belang',f.page).evidence;if(kind==='choice')b.choice=f.page===0?0:JoranStory.lessonMake('belang',f.page).answer;if(kind==='bonus')b.choice=0;if(kind.includes('note'))b.text='Kami bekerjasama menjaga Belang.';const acting=users.find(u=>u.member.role===f.role);const wrong=users.find(u=>u!==acting);assert.equal((await call(b,wrong.token)).status,403);const r=await call(b,acting.token);assert.equal(r.status,200,JSON.stringify(r));state.flow=r.data.flow;}
 for(const[index,value]of ['Kasih sayang','Kerjasama'].entries())await save({type:'lesson-explain',index,value,proofIndex:index,text:index?'Hana dan Iman membahagikan tugas.':'Hana membantu Belang.'});
 const answers=[[1,0,0],[1,0,2],[0,0,0],[1,0,0]],routes=['pengukuhan','pengayaan','pemulihan','pengukuhan'];
 for(const [i,u] of users.entries()){
 const diagnostic=await save({type:'lesson-diagnostic',subjectId:u.member.id,answers:answers[i]},u);assert.equal(diagnostic.status,200,JSON.stringify(diagnostic));
 const invalid=await save({type:'lesson-practice',subjectId:u.member.id,answers:[0,1],text:'Mereka membantu.'},users[(i+1)%4]);assert.equal(invalid.status,403);
 const payload=routes[i]==='pengayaan'?{text:'Kasih sayang kerana menjaga haiwan.',application:'Hana membantu anak kucing.'}:routes[i]==='pemulihan'?{activity:'matching',matches:[1,0,2],correct:3,text:'Mereka saling membantu.'}:{answers:i===0?[1,1]:[0,1],text:'Mereka saling membantu.'};
 if(routes[i]==='pemulihan'){const bad=await save({type:'lesson-practice',subjectId:u.member.id,activity:'matching',matches:[0,0,2],text:'Ujian.'},u);assert.notEqual(bad.status,200);}
 const practice=await save({type:'lesson-practice',subjectId:u.member.id,...payload},u);assert.equal(practice.status,200,JSON.stringify(practice));
 if(i<3)assert.equal((await call({action:'completion',code,type:'review-page',page:0},leader.token)).status,409);
 }
 const learning=(await call({action:'state',code},leader.token)).data.progress[0].lesson;assert.equal(learning.explainedCorrect,2);assert.equal(learning.practices.length,4);assert.equal(learning.practiced,true);assert.equal(learning.practices[2].activity,'matching');assert.equal(learning.practices[2].correct,1);assert.deepEqual(learning.practices[2].matches,[1,0,2]);assert.deepEqual(users.map(u=>learning.personalRoutes[u.member.id]),routes);
 assert.equal((await call({action:'certificate',code},leader.token)).status,409);
 assert.equal((await call({action:'completion',code,type:'reflection',text:'Kami akan membantu rakan.'},other.token)).status,403);
 for(let page=0;page<5;page++)await call({action:'completion',code,type:'review-page',page},users[page%4].token);
 await call({action:'completion',code,type:'reflection',text:'Kami akan membantu rakan.'},leader.token);
 for(const u of users){const cert=await call({action:'certificate',code,memberId:u.member.id},leader.token);assert.equal(cert.status,200);assert.equal(cert.data.certificate.name,u.member.name);assert.equal(cert.data.certificate.points,90);}
 const report=(await call({action:'report',code},created.teacherToken)).data;assert(report.records.every(r=>r.groupShared26&&r.lessonPoints.total===90&&r.readingPages.length>=1));
 const ids=users.map(u=>u.member.id);
 assert.equal((await call({action:'report-purge',code,ids,confirm:true},leader.token)).status,403);
 await call({action:'report-hide',code,ids},created.teacherToken);
 assert.equal((await call({action:'state',code},leader.token)).status,410);
 assert.equal((await call({action:'report-purge',code,ids,confirm:true},created.teacherToken)).status,200);
 const empty=(await call({action:'report',code},created.teacherToken)).data;assert.equal(empty.records.length,0);assert.equal(empty.archivedRecords.length,0);
 assert.equal((await call({action:'pupil-audio-list',code},created.teacherToken)).data.records.length,0);
 assert.equal((await call({action:'state',code},leader.token)).status,403);
 const rejoined=await call({action:'join',code,role:'pembaca',name:'Baharu',kelas:'3 A'});assert.equal(rejoined.status,201);assert.equal((await call({action:'state',code},rejoined.data.token)).data.flow.sequence,0);
});

test('V32 correct matching also satisfies guided objective 1 in individual mode',()=>{
 const members=[{id:'solo',name:'Murid'}],events=[{type:'lesson-induction',choice:0,at:1},...[0,1,2,3,4].map(page=>({type:'lesson-read',page,at:2+page})),{type:'lesson-values',answers:[0,0,0],at:7},...[0,1].map(index=>({type:'lesson-explain',index,value:['Kasih sayang','Kerjasama'][index],text:'Ayat.',guidedCorrect:true,at:8+index})),{type:'lesson-diagnostic',subjectId:'solo',answers:[0,0,0],correct:1,route:'pemulihan',at:10}];
 const result=JoranLesson.validate('belang',events,{type:'lesson-practice',activity:'matching',subjectId:'solo',matches:[0,1,2],text:'Hana membantu Belang.'},true,{version:29,members});assert(!result.error);assert.equal(result.event.correct,3);
 const lesson=JoranLesson.assess([...events,{...result.event,at:11}],'belang',{version:29,members});assert.equal(lesson.practiced,true);assert.equal(lesson.correct,3);assert.match(lesson.objective1,/bimbingan/);
});

test('V32 teacher table gives one shared score, names every member and omits removed records',async()=>{
 const {readFile}=await import('node:fs/promises'),{runInNewContext}=await import('node:vm');const ctx={Blob,TextEncoder,Intl,Date};ctx.window=ctx;runInNewContext(await readFile(new URL('../public/report-export.js',import.meta.url),'utf8'),ctx);
 const base={mode:'kumpulan',role:'pembaca',group:'Kumpulan Mawar',sessionId:'g1',story:'belang',kelas:'3 A',lessonPoints:{total:90},lesson:{identification:{},correct:2,explanations:[{text:'Ayat.',value:'Kerjasama',guidedCorrect:true}],explainedCorrect:1,personalRoutes:{a:'pemulihan'},practices:[{subjectId:'a',activity:'matching',route:'pemulihan',matches:[1,0,2],correct:1,text:'Bantu.'}]}};
 const records=[{...base,id:'a',name:'Amir'},{...base,id:'b',name:'Siti'},{...base,id:'deleted',name:'DIPADAM',archived:true}];const rows=ctx.JoranReport31.simpleRows(records,[],{belang:{title:'Belang'}});
 assert.equal(rows.filter(r=>r[0]==='REKOD').length,1);assert.equal(rows.filter(r=>r[0]==='Jumlah mata tugasan').length,1);assert.equal(rows.filter(r=>r[0].startsWith('Murid ·')).length,2);assert(!JSON.stringify(rows).includes('DIPADAM'));assert(rows.some(r=>r[1].includes('1 daripada 3')));assert(rows.some(r=>r[1].includes('Sasaran: sekurang-kurangnya 3')));assert(rows.some(r=>r[1].includes('Belum layak')));
 assert.equal(ctx.JoranReport31.simpleRows([],[],{})[0][0],'Tiada rekod aktif');
});
