import {test} from 'node:test';
import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
import {createHandler} from '../server/room-service.mjs';
class MemoryStore{data=new Map();async get(k){return structuredClone(this.data.get(k)||null);}async setJSON(k,v,o={}){if(o.onlyIfNew&&this.data.has(k))return{modified:false};this.data.set(k,structuredClone(v));return{modified:true};}async list({prefix}){return{blobs:[...this.data.keys()].filter(k=>k.startsWith(prefix)).map(key=>({key}))};}}
function client(){const store=new MemoryStore();let at=1000000000;const handler=createHandler(store,{now:()=>++at});return{store,call:async(b,token)=>{const r=await handler(new Request('https://test.example/api',{method:'POST',headers:{'Content-Type':'application/json',...(token?{Authorization:'Bearer '+token}:{})},body:JSON.stringify(b)}));return {status:r.status,data:await r.json()};}};}
async function setup(group=false){const c=client(),created=(await c.call({action:'create',name:'PdP',kelas:'3 A',story:'belang',mode:group?'kumpulan':'kendiri',lesson:true})).data,code=created.room.code,users=[];for(const role of group?['pembaca','pencari','pencatat','pemancing']:['kendiri'])users.push((await c.call({action:'join',code,role,name:role,kelas:'3 A'})).data);return {...c,...created,code,users};}
const save=(c,u,b)=>c.call({action:'lesson-save',code:c.code,id:randomUUID(),...b},u.token);
async function intro(c,u,answers=[1,0,2]){assert.equal((await save(c,u,{type:'lesson-induction',choice:0})).status,200);for(let page=0;page<5;page++)assert.equal((await save(c,u,{type:'lesson-read',page})).status,200);assert.equal((await save(c,u,{type:'lesson-values',answers})).status,200);}
async function game(c){let state=(await c.call({action:'state',code:c.code},c.users[0].token)).data.flow;while(!state.finished){const u=c.users.length===1?c.users[0]:c.users.find(u=>u.member.role===state.role),kind=state.sequence<20?['read','evidence','note','choice'][state.step]:state.sequence===20?'bonus-note':'bonus';const b={action:'turn',code:c.code,sequence:state.sequence,kind};if(kind==='evidence')b.choice=JoranStory.make('belang',state.page,[]).evidence;if(['choice','bonus'].includes(kind))b.choice=0;if(kind.includes('note'))b.text='Kami membantu kerana kita perlu bekerjasama.';const r=await c.call(b,u.token);assert.equal(r.status,200,JSON.stringify(r));state=r.data.flow;}}
async function explain(c,u){for(const[index,value]of ['Kasih sayang','Kerjasama'].entries())assert.equal((await save(c,u,{type:'lesson-explain',index,value,text:index?'Hana dan Iman membahagikan tugas menjaga Belang.':'Hana bercakap lembut supaya Belang berasa selamat.'})).status,200);}
async function practice(c,u,route='pengukuhan'){await save(c,u,{type:'lesson-route',route});return save(c,u,{type:'lesson-practice',answers:route==='pemulihan'?[1,0,2]:[0,1],text:'Kami bekerjasama dengan membantu rakan.',application:'Saya membantu rakan mengutip buku yang terjatuh.'});}
async function close(c,u){for(let page=0;page<5;page++)assert.equal((await c.call({action:'completion',code:c.code,type:'review-page',page},u.token)).status,200);assert.equal((await c.call({action:'completion',code:c.code,type:'reflection',text:'Saya akan menyayangi haiwan.'},u.token)).status,200);}
test('PdP server gates all five phases, grades only by teacher, keeps initial assessment and 100 task points separate',async()=>{
 const c=await setup(),u=c.users[0];
 assert.equal((await c.call({action:'turn',code:c.code,sequence:0,kind:'read'},u.token)).status,409);
 assert.equal((await save(c,u,{type:'lesson-values',answers:[1,0,2]})).status,409);
 assert.equal((await save(c,u,{type:'lesson-grade',correct:true,index:0})).status,409);
 await intro(c,u,[0,0,2]);await game(c);
 assert.equal((await c.call({action:'completion',code:c.code,type:'review-page',page:0},u.token)).status,409);
 await explain(c,u);assert.equal((await c.call({action:'certificate',code:c.code},u.token)).status,409);
 await save(c,u,{type:'lesson-route',route:'pemulihan'});await save(c,u,{type:'lesson-practice',answers:[0,0,2],text:'Saya mencuba.'});
 assert.equal((await c.call({action:'completion',code:c.code,type:'reflection',text:'Bypass'},u.token)).status,409);
 await practice(c,u,'pemulihan');await close(c,u);
 const state=(await c.call({action:'state',code:c.code},u.token)).data.progress[0];assert.equal(state.lesson.firstCorrect,2);assert.equal(state.lesson.correct,3);assert.match(state.lesson.objective1,/bimbingan/);assert.equal(state.lesson.graded,0);assert.equal(state.lessonPoints.total,100);assert.equal(state.certificateEligible,true);
 for(const[index,e]of state.lesson.explanations.entries()){const body={action:'lesson-grade',code:c.code,memberId:u.member.id,index,text:e.text,value:e.value,correct:true};assert.equal((await c.call(body,u.token)).status,403);assert.equal((await c.call(body,c.teacherToken)).status,200);}
 assert.equal((await c.call({action:'state',code:c.code},u.token)).data.progress[0].lesson.explainedCorrect,2);
 await save(c,u,{type:'lesson-explain',index:0,value:'Kasih sayang',text:'Jawapan yang disunting.'});const revised=(await c.call({action:'state',code:c.code},u.token)).data.progress[0].lesson;assert.equal(revised.graded,1);assert.equal(revised.objective2,'Menunggu semakan Guru');
 assert.equal((await c.call({action:'lesson-grade',code:c.code,memberId:u.member.id,index:0,text:'stale',value:'Kasih sayang',correct:true},c.teacherToken)).status,409);
});
test('PdP group begins after four individual readiness checks and certificates wait for every member across different practice routes',async()=>{
 const c=await setup(true);for(const u of c.users.slice(0,3))await intro(c,u);
 assert.equal((await c.call({action:'turn',code:c.code,sequence:0,kind:'read'},c.users[0].token)).status,409);
 await intro(c,c.users[3]);await game(c);
 for(const[i,u]of c.users.entries()){await explain(c,u);await practice(c,u,['pemulihan','pengukuhan','pengayaan','pengukuhan'][i]);if(i<3)await close(c,u);}
 assert.equal((await c.call({action:'certificate',code:c.code},c.users[0].token)).status,409);await close(c,c.users[3]);
 for(const u of c.users)assert.equal((await c.call({action:'certificate',code:c.code},u.token)).status,200);
 const records=(await c.call({action:'report',code:c.code},c.teacherToken)).data.records;assert(records.every(r=>r.lessonPoints.total===100));assert(records.every(r=>r.lesson.explainedCorrect===0));
});
test('each story has three correct target values grounded in canonical text; nonempty writing is not auto-graded',()=>{
 for(const[story,items]of Object.entries(JoranLesson.bank)){assert.equal(items.length,3);assert.equal(new Set(items.map(x=>x.value)).size,3);for(const x of items){assert.equal(x.options[x.answer],x.value);assert(JoranStory.lessonText(story,x.page).includes(x.quote));}}
 const l=JoranLesson.assess([{type:'lesson-explain',index:0,value:'Kasih sayang',text:'apa sahaja',at:1},{type:'lesson-explain',index:1,value:'Kerjasama',text:'apa sahaja',at:2}]);assert.equal(l.explained,true);assert.equal(l.explainedCorrect,0);assert.equal(l.objective2,'Menunggu semakan Guru');
});
