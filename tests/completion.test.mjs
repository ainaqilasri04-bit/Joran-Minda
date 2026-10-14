import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createHandler} from '../server/room-service.mjs';
class MemoryStore {
 data=new Map();
 async get(k){return structuredClone(this.data.get(k)||null);}
 async setJSON(k,v,o={}){if(o.onlyIfNew&&this.data.has(k))return{modified:false};this.data.set(k,structuredClone(v));return{modified:true};}
 async list({prefix}){return{blobs:[...this.data.keys()].filter(k=>k.startsWith(prefix)).map(key=>({key}))};}
}
function client(){const store=new MemoryStore(),handler=createHandler(store);let count=0;return {store,call:async(body,token)=>{const r=await handler(new Request('https://test.example/.netlify/functions/kelas',{method:'POST',headers:{'Content-Type':'application/json',...(token?{Authorization:'Bearer '+token}:{})},body:JSON.stringify(body)}));return{status:r.status,data:await r.json(),request:++count};}};}
async function core(call,code,users){let state=(await call({action:'state',code},users[0].token)).data.flow;const contributions=new Map();while(!state.finished){const user=users.length===1?users[0]:users.find(u=>u.member.role===state.role);const kind=state.sequence<20?['read','evidence','note','choice'][state.step]:state.sequence===20?'bonus-note':'bonus';const body={action:'turn',code,sequence:state.sequence,kind};if(kind==='evidence')body.choice=JoranStory.make('sihat',state.page,[]).evidence;if(kind==='bonus'||kind==='choice')body.choice=0;if(kind.includes('note'))body.text='Kami memilih tindakan yang menjaga kebersihan.';
 const result=await call(body,user.token);assert.equal(result.status,200,JSON.stringify(result));contributions.set(user.member.id,new Set([...(contributions.get(user.member.id)||[]),kind]));state=result.data.flow;}return contributions;}
async function review(call,code,user,{missingPage=-1,reflection=true}={}){for(let page=0;page<5;page++)if(page!==missingPage)assert.equal((await call({action:'completion',code,type:'review-page',page},user.token)).status,200);if(reflection)assert.equal((await call({action:'completion',code,type:'reflection',text:'Saya belajar menjaga kebersihan.'},user.token)).status,200);}
test('individual certificate requires every activity; duplicate review gives no extra points; another learner stays isolated',async()=>{
 const {call}=client(),made=(await call({action:'create',name:'Individu',kelas:'3 A',story:'sihat',mode:'kendiri'})).data,code=made.room.code;
 const a=(await call({action:'join',code,name:'Aina',kelas:'3 A',role:'kendiri'})).data,b=(await call({action:'join',code,name:'Budi',kelas:'3 A',role:'kendiri'})).data;
 assert.equal((await call({action:'certificate',code},a.token)).status,409);
 assert.equal((await call({action:'completion',code,type:'review-page',page:0},a.token)).status,409);
 assert.equal((await call({action:'event',code,type:'reflection',text:'forged'},a.token)).status,403);
 await call({action:'turn',code,sequence:0,kind:'read'},a.token);await call({action:'turn',code,sequence:1,kind:'evidence',choice:0},a.token);await core(call,code,[a]);assert.equal((await call({action:'certificate',code},a.token)).status,409);
 await review(call,code,a,{missingPage:4});assert.equal((await call({action:'certificate',code},a.token)).status,409);
 for(let n=0;n<3;n++)await call({action:'completion',code,type:'review-page',page:4},a.token);
 assert.equal((await call({action:'completion',code,type:'review-page',page:5},a.token)).status,400);
 assert.equal((await call({action:'completion',code,type:'reflection',text:'   '},a.token)).status,400);
 const certificate=await call({action:'certificate',code},a.token);assert.equal(certificate.status,200);assert.equal(certificate.data.certificate.points,100);const ownState=(await call({action:'state',code},a.token)).data;assert.equal(ownState.progress[0].achievement.firstCorrect,5);
 assert.equal((await call({action:'certificate',code},b.token)).status,409);
 const bState=(await call({action:'state',code},b.token)).data;assert.equal(bState.flow.sequence,0);assert.equal(bState.progress.length,1);assert.equal(bState.progress[0].achievement.points,0);assert(!JSON.stringify(bState).includes('Aina'));
 const report=(await call({action:'report',code},made.teacherToken)).data.records;assert.equal(report.find(r=>r.name==='Aina').achievement.points,100);assert.equal(report.find(r=>r.name==='Budi').certificateEligible,false);
});
test('group roles rotate, each child does all four task types, certificate waits for all four personal completions',async()=>{
 const {call}=client(),made=(await call({action:'create',name:'Kumpulan Aman',kelas:'3 A',story:'sihat'})).data,code=made.room.code,users=[];
 for(const role of ['pembaca','pencari','pencatat','pemancing'])users.push((await call({action:'join',code,name:role,kelas:'3 A',role})).data);
 const contributions=await core(call,code,users);for(const user of users)for(const kind of ['read','evidence','note','choice'])assert(contributions.get(user.member.id).has(kind));
 for(const u of users.slice(0,3))await review(call,code,u);
 for(const u of users)assert.equal((await call({action:'certificate',code},u.token)).status,409);
 await review(call,code,users[3],{reflection:false});assert.equal((await call({action:'certificate',code},users[0].token)).status,409);
 await call({action:'completion',code,type:'reflection',text:'Saya akan menjaga kebersihan.'},users[3].token);
 const certificates=[];for(const u of users){const r=await call({action:'certificate',code},u.token);assert.equal(r.status,200);assert.equal(r.data.certificate.name,u.member.name);certificates.push(r.data.certificate.id);}assert.equal(new Set(certificates).size,4);
 const report=(await call({action:'report',code},made.teacherToken)).data;for(const r of report.records){assert.equal(r.achievement.points,100);assert(r.certificateEligible);assert(r.contribution.corePoints>0);}
});
test('teacher can archive and restore reports without deleting pupil progress; student and cross-room requests are rejected',async()=>{
 const {call,store}=client(),made=(await call({action:'create',name:'Rekod',kelas:'3 A',story:'sihat',mode:'kendiri'})).data,code=made.room.code;
 const student=(await call({action:'join',code,name:'Aina',kelas:'3 A',role:'kendiri'})).data;
 assert.equal((await call({action:'report-hide',code,ids:[student.member.id]},student.token)).status,403);
 assert.equal((await call({action:'report-hide',code,ids:['00000000-0000-0000-0000-000000000000']},made.teacherToken)).status,400);
 const before=store.data.size;assert.equal((await call({action:'report-hide',code,ids:[student.member.id]},made.teacherToken)).status,200);assert(store.data.size>=before);
 let report=(await call({action:'report',code},made.teacherToken)).data;assert.equal(report.records.length,0);assert.equal(report.archivedRecords.length,1);
 assert.equal((await call({action:'state',code},student.token)).status,410); // archived pupils no longer resume until restored
 await call({action:'report-hide',code,ids:[student.member.id],hidden:false},made.teacherToken);report=(await call({action:'report',code},made.teacherToken)).data;assert.equal(report.records.length,1);assert.equal(report.archivedRecords.length,0);
});
