import{test}from'node:test';import assert from'node:assert/strict';import{createHandler}from'../server/room-service.mjs';import{groupState}from'../server/group-flow.mjs';
class MemoryStore{constructor(){this.m=new Map();}async get(k){return structuredClone(this.m.get(k)||null);}async setJSON(k,v,o={}){if(o.onlyIfNew&&this.m.has(k))return{modified:false};this.m.set(k,structuredClone(v));return{modified:true};}async list({prefix}){return{blobs:[...this.m.keys()].filter(k=>k.startsWith(prefix)).map(key=>({key}))};}}
test('four named roles, protected turns, one shared path, wrong answers and concurrent retries',async()=>{
 const store=new MemoryStore(),handle=createHandler(store);async function call(body,token){const res=await handle(new Request('http://localhost/.netlify/functions/kelas',{method:'POST',headers:{'Content-Type':'application/json',...(token?{Authorization:'Bearer '+token}:{})},body:JSON.stringify(body)}));return{status:res.status,data:await res.json()};}
 const made=await call({action:'create',name:'Kumpulan Budi',kelas:'3 A',story:'sihat'});assert.equal(made.status,201);const code=made.data.room.code,teacher=made.data.teacherToken;const members={};
 for(const role of ['pembaca','pencari','pencatat','pemancing']){members[role]=(await call({action:'join',code,name:role,kelas:'3 A',role})).data;assert(members[role].token);}
 assert.equal((await call({action:'join',code,name:'Pendua',kelas:'3 A',role:'pembaca'})).status,409);
 assert.equal((await call({action:'report',code},members.pembaca.token)).status,403);
 assert.equal((await call({action:'turn',code,sequence:0,kind:'read'},members.pencari.token)).status,403);
 const turn=async(sequence,kind,role,extra={})=>call({action:'turn',code,sequence,kind,...extra},members[role].token);
 let path=[];for(let page=0;page<5;page++){
  assert.equal((await turn(page*4,'read','pembaca')).status,200);
  const wrong=await turn(page*4+1,'evidence','pencari',{choice:0});assert.equal(wrong.data.correct,false);
  const proof=globalThis.JoranStory.make('sihat',page,path).evidence;assert.equal((await turn(page*4+1,'evidence','pencari',{choice:proof})).data.correct,true);
  assert.equal((await turn(page*4+2,'note','pencatat',{text:'Pilihan kami sesuai kerana membantu rakan.'})).status,200);
  const both=await Promise.all([turn(page*4+3,'choice','pemancing',{choice:1}),turn(page*4+3,'choice','pemancing',{choice:0})]);assert.deepEqual(both.map(r=>r.status).sort(),[200,409]);path=both.find(r=>r.status===200).data.flow.choices;
 }
 assert.equal((await turn(20,'bonus-note','pencatat',{text:'Mencegah penyakit.'})).status,200);assert.equal((await turn(21,'bonus','pemancing',{choice:2})).data.correct,false);assert.equal((await turn(21,'bonus','pemancing',{choice:0})).data.flow.finished,true);
 const state=(await call({action:'state',code},members.pembaca.token)).data;assert.equal(state.flow.choices.length,5);assert.equal(state.flow.sequence,22);assert.equal(state.members.length,4);assert(!JSON.stringify(state).includes(teacher));
 const report=(await call({action:'report',code},teacher)).data.records;const finder=report.find(r=>r.role==='pencari');assert.equal(finder.points,10);assert.equal(finder.proofPages,5);assert.equal(finder.evidenceAttempts,10);assert.equal(report.find(r=>r.role==='pembaca').points,0);assert.equal(report.find(r=>r.role==='pemancing').points,15);assert.equal(report.find(r=>r.role==='pencatat').notes.length,6);
 await Promise.all(Array.from({length:12},(_,i)=>call({action:'message',code,text:'Idea '+i},members.pembaca.token)));assert.equal((await call({action:'state',code},members.pencatat.token)).data.messages.length,12);
 const other=(await call({action:'create',name:'Lain',kelas:'3 A',story:'belang'})).data;assert.equal((await call({action:'state',code:other.room.code},members.pembaca.token)).status,403);
 const audio='data:audio/webm;base64,YQ==';assert.equal((await call({action:'audio-save',code,page:1,text:'Hana membaca.',audio},members.pembaca.token)).status,403);assert.equal((await call({action:'audio-save',code,page:1,text:'Hana membaca.',audio},teacher)).status,200);
 const cross=await handle(new Request('http://localhost/.netlify/functions/kelas',{method:'POST',headers:{Origin:'https://evil.example'},body:'{}'}));assert.equal(cross.status,403);
});
test('all 972 routes keep five coherent pages and every earlier choice affects the ending',()=>{for(const key of JoranStory.keys){const endings=new Set();for(let mask=0;mask<243;mask++){const path=Array.from({length:5},(_,i)=>Math.floor(mask/3**i)%3);for(let page=0;page<5;page++){const current=JoranStory.make(key,page,path),text=JoranStory.text(key,page,path);assert.equal(current.labels.length,3);assert(text.length<=450);assert(current.sentences[current.evidence]);assert(text.endsWith(current.outcomes[path[page]]));if(page>0){const altered=path.slice();altered[page-1]=(altered[page-1]+1)%3;assert.notEqual(current.sentences.join(' '),JoranStory.make(key,page,altered).sentences.join(' '));}}endings.add(JoranStory.text(key,4,path));}assert.equal(endings.size,243);}assert.equal(groupState().sequence,0);});
test('home work is isolated, resumable, scores once, and shares teacher instruction audio',async()=>{
 const store=new MemoryStore(),handle=createHandler(store);async function call(body,token){const res=await handle(new Request('http://localhost/.netlify/functions/kelas',{method:'POST',headers:{'Content-Type':'application/json',...(token?{Authorization:'Bearer '+token}:{})},body:JSON.stringify(body)}));return{status:res.status,data:await res.json()};}
 const made=(await call({action:'create',name:'Latihan Rumah',kelas:'3 A',story:'belang',mode:'kendiri'})).data,code=made.room.code,t=made.teacherToken;
 const a=(await call({action:'join',code,name:'Aina',kelas:'3 A',role:'kendiri'})).data,b=(await call({action:'join',code,name:'Budi',kelas:'3 A',role:'kendiri'})).data;
 assert.equal((await call({action:'join',code,name:'Lain',kelas:'3 A',role:'pembaca'})).status,400);
 const path=[2,2,2,2,2];
 for(let page=0;page<5;page++){for(const [offset,kind,extra]of[[0,'read',{}],[1,'evidence',{choice:JoranStory.make('belang',page,path).evidence}],[2,'note',{text:'Saya memilih untuk membantu.'}],[3,'choice',{choice:2}]]){const r=await call({action:'turn',code,sequence:page*4+offset,kind,...extra},a.token);assert.equal(r.status,200,JSON.stringify(r));}}
 await call({action:'turn',code,sequence:20,kind:'bonus-note',text:'Saling membantu.'},a.token);await call({action:'turn',code,sequence:21,kind:'bonus',choice:0},a.token);
 assert.equal((await call({action:'turn',code,sequence:21,kind:'bonus',choice:0},a.token)).status,409);
 const resumed=(await call({action:'state',code},a.token)).data;assert.equal(resumed.self.name,'Aina');assert.deepEqual(resumed.flow.choices,path);assert.equal(resumed.flow.sequence,22);assert.equal(resumed.members.length,1);assert(resumed.members[0].online);
 const other=(await call({action:'state',code},b.token)).data;assert.equal(other.flow.sequence,0);assert.equal(other.members[0].name,'Budi');assert.equal(other.self.id,b.member.id);
 const audio='data:audio/webm;base64,YQ==';assert.equal((await call({action:'audio-save',code,guide:'cari',text:'Cari ayat bukti.',audio},a.token)).status,403);assert.equal((await call({action:'audio-save',code,guide:'cari',text:'Cari ayat bukti.',audio},t)).status,200);assert.equal((await call({action:'audio-read',code,guide:'cari'},b.token)).data.record.audio,audio);
 const records=(await call({action:'report',code},t)).data.records;assert.equal(records.find(r=>r.name==='Aina').points,25);assert.equal(records.find(r=>r.name==='Budi').points,0);
 assert.equal((await call({action:'event',code,type:'bonus',choice:0},a.token)).status,403);
});
test('teacher loads current story and recordings are matched to exact branch text',async()=>{
 const handle=createHandler(new MemoryStore());async function call(body,token){const r=await handle(new Request('http://localhost/.netlify/functions/kelas',{method:'POST',headers:{'Content-Type':'application/json',...(token?{Authorization:'Bearer '+token}:{})},body:JSON.stringify(body)}));return{status:r.status,data:await r.json()};}
 const made=(await call({action:'create',name:'Cerita rumah',kelas:'3 A',story:'sihat',mode:'kendiri'})).data,code=made.room.code,teacher=made.teacherToken;
 const student=(await call({action:'join',code,name:'Aina',kelas:'3 A',role:'kendiri'})).data;
 assert.equal((await call({action:'story-state',code,memberId:student.member.id},student.token)).status,403);
 assert.equal((await call({action:'story-state',code,memberId:'invalid'},teacher)).status,400);
 assert.equal((await call({action:'story-state',code,memberId:student.member.id},teacher)).data.flow.sequence,0);
 const audio='data:audio/webm;base64,YQ==';for(const text of ['Hana membawa roti.','Hana membawa buah.'])assert.equal((await call({action:'audio-save',code,page:1,text,audio},teacher)).status,200);
 assert.equal((await call({action:'audio-read',code,page:1,text:'Hana membawa roti.'},student.token)).data.record.text,'Hana membawa roti.');assert.equal((await call({action:'audio-read',code,page:1,text:'Belang bermain.'},student.token)).data.record,null);
});
