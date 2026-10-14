import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createHandler} from '../server/room-service.mjs';
class MemoryStore{
 constructor(){this.data=new Map();}
 async get(key){return structuredClone(this.data.get(key)||null);}
 async setJSON(key,value,options={}){if(options.onlyIfNew&&this.data.has(key))return{modified:false};this.data.set(key,structuredClone(value));return{modified:true};}
 async list({prefix}){return{blobs:[...this.data.keys()].filter(key=>key.startsWith(prefix)).map(key=>({key}))};}
}
function caller(handle){return async(body,token)=>{const response=await handle(new Request('http://localhost/.netlify/functions/kelas',{method:'POST',headers:{'Content-Type':'application/json',...(token?{Authorization:'Bearer '+token}:{})},body:JSON.stringify(body)}));return{status:response.status,data:await response.json()};};}
test('room lookup normalizes copied codes, discloses only room setup, and reports taken roles',async()=>{
 const store=new MemoryStore(),call=caller(createHandler(store));
 const made=(await call({action:'create',name:'Sahabat',kelas:'3 Aspirasi',story:'sihat',mode:'kumpulan',meet:'https://meet.example/private-call'})).data;
 assert.match(made.room.code,/^\d{6}$/);
 const code=made.room.code,copy=code.slice(0,5).toLowerCase()+' - '+code.slice(5).toLowerCase();
 const before=store.data.size;
 const lookup=await call({action:'room-info',code:copy});assert.equal(lookup.status,200);assert.equal(lookup.data.room.code,code);assert.equal(store.data.size,before);
 for(const secret of [made.teacherToken,'private-call','teacherToken','member'])assert(!JSON.stringify(lookup.data).includes(secret));
 assert.equal((await call({action:'room-info',code:code+'AA'})).status,400);
 assert.equal((await call({action:'room-info',code:'0000000000'})).status,404);
 const member=await call({action:'join',code:copy,name:'Murid A',kelas:'3 Aspirasi',role:'pembaca'});assert.equal(member.status,201);
 assert.deepEqual((await call({action:'room-info',code})).data.takenRoles,['pembaca']);
 const denied=await call({action:'report',code},member.data.token);assert.equal(denied.status,403);
 const record=store.data.get('rooms/'+code);record.expires=0;
 assert.equal((await call({action:'room-info',code})).status,404);
});
test('legacy ten-character rooms remain joinable after the short-code update',async()=>{
 const store=new MemoryStore(),call=caller(createHandler(store));
 const made=(await call({action:'create',name:'Kelas lama',kelas:'3 A',story:'belang',mode:'kendiri'})).data;
 const code='A1B2C3D4E5';await store.setJSON('rooms/'+code,{...made.room,code});
 const info=await call({action:'room-info',code:code.toLowerCase()});assert.equal(info.status,200);
 const joined=await call({action:'join',code,name:'Murid lama',kelas:'3 A',role:'kendiri'});assert.equal(joined.status,201);
 assert.equal((await call({action:'state',code},joined.data.token)).data.self.name,'Murid lama');
});
test('short-code collision retries never overwrite an existing room',async()=>{
 const store=new MemoryStore();const occupied={code:'123456',name:'Existing room',expires:Date.now()+10000};await store.setJSON('rooms/123456',occupied);
 let attempts=0;const call=caller(createHandler(store,{makeCode:()=>++attempts===1?'123456':'654321'}));
 const created=await call({action:'create',name:'New room',kelas:'3 A',story:'sihat'});
 assert.equal(created.status,201);assert.equal(created.data.room.code,'654321');assert.equal(attempts,2);assert.deepEqual(await store.get('rooms/123456'),occupied);
 const blocked=caller(createHandler(store,{makeCode:()=>'123456'}));
 assert.equal((await blocked({action:'create',name:'Another room',kelas:'3 A',story:'sihat'})).status,409);
 assert.deepEqual(await store.get('rooms/123456'),occupied);
});
test('health check actually reads storage and unavailable storage never returns a usable code',async()=>{
 const healthy=new MemoryStore(),good=caller(createHandler(healthy));
 assert.equal((await good({action:'ping'})).data.service,'joran-minda-kelas');assert.equal(healthy.data.size,0);
 const broken={async get(){throw Error('private provider detail');},async setJSON(){throw Error('secret credential');}};
 const bad=caller(createHandler(broken));
 for(const body of [{action:'ping'},{action:'create',name:'A',kelas:'3 A',story:'sihat'}]){
  const result=await bad(body);assert.equal(result.status,503);assert.equal(result.data.code,'ROOM_STORAGE_UNAVAILABLE');assert(!result.data.room);assert(!JSON.stringify(result).includes('secret credential'));
 }
});
