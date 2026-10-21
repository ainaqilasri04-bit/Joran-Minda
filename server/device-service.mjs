import {createHandler} from './room-service.mjs';
import {createHash} from 'node:crypto';
const hash=s=>createHash('sha256').update(s).digest('hex');
const uuid=s=>typeof s==='string'&&/^[a-f0-9-]{36}$/.test(s);
const clean=(s,n)=>typeof s==='string'?s.trim().slice(0,n):'';
const fail=(status,message)=>{throw Object.assign(Error(message),{status});};
const json=(v,status=200)=>new Response(JSON.stringify(v),{status,headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'}});
const roles=['pembaca','pencari','pencatat','pemancing'];

// Isolated sessions reuse the existing authoritative marking, recording and
// certificate rules. The parent class's teacher can assess every session.
export function createDeviceHandler(store,{now=()=>Date.now()}={}){
 const get=k=>store.get(k,{type:'json'});
 function scoped(code,id){
  const prefix=`device59/${code}/runs/${id}/`;
  return {
   async get(k){
    if(k.startsWith('auth/')){const a=await get(k);if(a?.kind==='teacher'&&a.code===code)return a;}
    return get(prefix+k);
   },
   setJSON:(k,v,o)=>store.setJSON(prefix+k,v,o),delete:k=>store.delete(prefix+k),
   async list({prefix:p=''}){const r=await store.list({prefix:prefix+p});return{blobs:r.blobs.map(b=>({...b,key:b.key.slice(prefix.length)}))};}
  };
 }
 return async req=>{try{
  if(req.method!=='POST')return json({error:'Gunakan POST.'},405);
  if(req.headers.get('origin')&&req.headers.get('origin')!==new URL(req.url).origin)fail(403,'Permintaan dari laman lain tidak dibenarkan.');
  const raw=await req.text();if(raw.length>4000000)fail(413,'Maklumat terlalu panjang.');
  let b;try{b=JSON.parse(raw);}catch{fail(400,'Maklumat tidak sah.');}
  if(!b||typeof b!=='object'||typeof b.action!=='string')fail(400,'Maklumat tidak sah.');
  const code=String(b.code||'').replace(/[\s-]/g,'').toUpperCase();
  if(!/^(?:\d{6}|[A-F0-9]{10})$/.test(code))fail(400,'Pautan kelas tidak sah.');
  const parent=await get('rooms/'+code);if(!parent||parent.expires<now())fail(410,'Pautan kelas telah tamat. Minta pautan baharu daripada Guru.');
  const bearer=(req.headers.get('authorization')||'').replace(/^Bearer /,'');
  const teacher=await get('auth/'+hash(bearer));
  const isTeacher=teacher?.kind==='teacher'&&teacher.code===code;
  async function call(id,body){
   return createHandler(scoped(code,id),{now})(new Request(req.url,{method:'POST',headers:{'Content-Type':'application/json',...(bearer?{Authorization:'Bearer '+bearer}:{})},body:JSON.stringify({...body,code})}));
  }
  if(b.action==='begin'){
   if(raw.length>18000||!uuid(b.deviceId)||!/^[a-f0-9]{64}$/.test(b.key||''))fail(400,'Pengenal sesi tidak sah.');
   const mode=b.mode==='kendiri'?'kendiri':b.mode==='kumpulan'?'kumpulan':null;
   if(!mode||!Array.isArray(b.members)||b.members.length!==(mode==='kendiri'?1:4))fail(400,'Isi semua nama ahli.');
   const members=b.members.map(m=>({id:m.id,name:clean(m.name,60),kelas:parent.kelas,role:m.role,story:parent.story,code,joined:now()}));
   if(members.some(m=>!uuid(m.id)||!m.name||!(mode==='kendiri'?m.role==='kendiri':roles.includes(m.role)))||new Set(members.map(m=>m.id)).size!==members.length||new Set(members.map(m=>m.role)).size!==members.length)fail(400,'Maklumat ahli tidak lengkap.');
   const key=`device59/${code}/sessions/${b.deviceId}`,secret=hash(b.key);
   const seed={id:b.deviceId,code,secret,mode,members,name:clean(b.group,60)||members[0].name,created:now()};
   await store.setJSON(key,seed,{onlyIfNew:true});const session=await get(key);
   if(session?.purged)fail(410,'Sesi ini telah dipadam oleh Guru.');
   if(session.secret!==secret||session.mode!==mode||JSON.stringify(session.members.map(m=>m.id))!==JSON.stringify(members.map(m=>m.id)))fail(403,'Kunci sesi tidak sah.');
   const child=scoped(code,b.deviceId);
   await child.setJSON('rooms/'+code,{...parent,name:session.name,mode,lesson:true,lessonVersion:40,version:23,leaderRole:roles[0]},{onlyIfNew:true});
   const users=[];
   for(const m of session.members){
    const token=hash(b.key+':'+m.id);
    if(await child.get(`room/${code}/purged/${m.id}`))fail(410,'Sesi ini telah dipadam oleh Guru.');
    await child.setJSON(`room/${code}/members/${m.id}`,m,{onlyIfNew:true});
    await child.setJSON('auth/'+hash(token),{kind:'student',code,id:m.id},{onlyIfNew:true});
    users.push({id:m.id,token});
   }
   return json({ok:true,users,deviceId:b.deviceId});
  }
  if(['teacher-report','teacher-audio-list'].includes(b.action)){
   if(!isTeacher)fail(403,'Hanya Guru boleh menyemak kelas ini.');
   const index=await store.list({prefix:`device59/${code}/sessions/`});
   const result={records:[],archivedRecords:[]};
   for(const {key} of index.blobs){
    const session=await get(key);if(!session||session.purged)continue;
    const response=await call(session.id,{action:b.action==='teacher-report'?'report':'pupil-audio-list'}),data=await response.json();
    if(!response.ok)fail(response.status,data.error||'Rekod belum dapat dimuatkan.');
    for(const field of ['records','archivedRecords'])for(const r of data[field]||[])result[field].push({...r,deviceSessionId:session.id,sessionId:'device:'+session.id,recordSource:'Satu peranti · pautan kelas'});
   }
   return json(result);
  }
  if(!uuid(b.deviceId)||raw.length>18000&&!['pupil-audio-save','audio-save'].includes(b.action))fail(400,'Sesi atau maklumat tidak sah.');
  const indexKey=`device59/${code}/sessions/${b.deviceId}`,session=await get(indexKey);
  if(!session||session.purged)fail(410,'Sesi ini tidak tersedia.');
  const child=scoped(code,b.deviceId),user=await child.get('auth/'+hash(bearer));
  if(!user||user.code!==code)fail(403,'Kunci sesi tidak sah.');
  if(user.kind==='student'&&(!await child.get(`room/${code}/members/${user.id}`)||await child.get(`room/${code}/purged/${user.id}`)||(await child.get(`room/${code}/report-hidden/${user.id}`))?.hidden))fail(410,'Rekod ini telah dipadam oleh Guru.');
  const receiptKey=b.deliveryId&&typeof b.deliveryId==='string'&&b.deliveryId.length<80?'delivery59/'+user.id+'/'+hash(b.deliveryId):null;
  const signature=hash(JSON.stringify(b));
  if(receiptKey){const old=await child.get(receiptKey);if(old){if(old.signature!==signature)fail(409,'Pengenal penghantaran telah digunakan.');return json(old.result,old.status);}}
  // A response can be lost after an event was committed but before its receipt.
  if(user.kind==='student'&&b.action==='lesson-save'&&uuid(b.id)){
   const old=await child.get(`room/${code}/events/${user.id}-lesson-${b.id}`);
   if(old){
    for(const field of ['type','index','page','answer','answers','evidence','subjectId','value','proofIndex','layout','choice'])if(b[field]!==undefined&&JSON.stringify(b[field])!==JSON.stringify(old[field]))fail(409,'Jawapan berbeza menggunakan pengenal yang sama.');
    return json({ok:true});
   }
  }
  const forwarded=await call(b.deviceId,b);
  if(receiptKey&&forwarded.ok)await child.setJSON(receiptKey,{signature,result:await forwarded.clone().json(),status:forwarded.status});
  if(b.action==='report-purge'&&forwarded.ok&&isTeacher)await store.setJSON(indexKey,{...session,purged:true});
  return forwarded;
 }catch(e){return json({error:e.status?e.message:'Rekod belum dapat dihantar. Semak Internet dan cuba lagi.'},e.status||503);}};
}
