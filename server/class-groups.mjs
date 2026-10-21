import {createHash} from 'node:crypto';
const hash=s=>createHash('sha256').update(s).digest('hex');
const json=(body,status=200)=>new Response(JSON.stringify(body),{status,headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'}});
const fail=(status,message)=>{throw Object.assign(Error(message),{status});};

// One public class code, isolated four-pupil workspaces. Credentials remain
// unique to each pupil and to the class teacher; short keys are exchanged for private server tokens.
export function classRouter62(store,options,single){
 const now=options.now||(()=>Date.now()),get=k=>store.get(k,{type:'json'}),base=single(store,options);
 return async req=>{try{
  if(req.method!=='POST')return base(req);
  if(Number(req.headers.get('content-length')||0)>4000000)fail(413,'Maklumat terlalu panjang.');
  const origin=req.headers.get('origin');if(origin&&origin!==new URL(req.url).origin)fail(403,'Permintaan dari laman lain tidak dibenarkan.');
  const raw=await req.clone().text();if(raw.length>4000000)fail(413,'Maklumat terlalu panjang.');
  let b;try{b=JSON.parse(raw);}catch{return base(req);}
  if(!b||typeof b!=='object')return base(req);
  const code=String(b.code||'').replace(/[\s-]/g,'').toUpperCase();
  const parent=await get('rooms/'+code);
  if(!parent?.groupCount62||parent.mode==='kendiri'||parent.accessMode!=='room')return base(req);
  if(parent.expires<now())fail(410,'Kelas ini telah tamat. Minta kod baharu daripada Guru.');
  const bearer=(req.headers.get('authorization')||'').replace(/^Bearer /,''),user=await get('auth/'+hash(bearer));
  const teacher=user?.kind==='teacher'&&user.code===code;
  const ids=Array.from({length:parent.groupCount62},(_,i)=>String(i+1));
  const valid=id=>ids.includes(String(id||''));
  const prefix=id=>`class62/${code}/${id}/`;
  function scoped(id){
   const p=prefix(id);
   return {
    async get(k){
     if(k==='rooms/'+code){const latest=await get(k);return latest?{...latest,name:'Kumpulan '+id,className62:latest.name,groupId62:id,groupCount62:0}:null;}
     if(k.startsWith('auth/')){const a=await get(k);return a?.code===code&&(a.kind==='teacher'||a.groupId62===id)?a:null;}
     if(k.startsWith(`room/${code}/audio/`))return get(k);
     return get(p+k);
    },
    setJSON(k,v,o){if(k.startsWith('auth/'))return store.setJSON(k,{...v,groupId62:id},o);return store.setJSON(p+k,v,o);},
    async delete(k){if(k.startsWith('auth/')){const a=await get(k);if(a?.kind==='student'&&a.code===code&&a.groupId62===id)return store.delete(k);return;}return store.delete(p+k);},
    async list({prefix:q=''}){
     if(q==='auth/'){const r=await store.list({prefix:q}),blobs=[];for(const item of r.blobs){const a=await get(item.key);if(a?.kind==='student'&&a.code===code&&a.groupId62===id)blobs.push(item);}return{blobs};}
     const r=await store.list({prefix:p+q});return{blobs:r.blobs.map(item=>({...item,key:item.key.slice(p.length)}))};
    }
   };
  }
  const call=(id,body=b)=>single(scoped(id),options)(new Request(req.url,{method:'POST',headers:req.headers,body:JSON.stringify({...body,code})}));
  async function dataOf(response){const data=await response.json();if(!response.ok)fail(response.status,data.error||'Rekod tidak dapat dimuatkan.');return data;}
  async function groupOfMember(id){if(typeof id!=='string')return null;for(const g of ids)if(await get(prefix(g)+`room/${code}/members/${id}`))return g;return null;}
  async function groupOfAudio(id){if(typeof id!=='string')return null;for(const g of ids)if(await get(prefix(g)+`room/${code}/pupil-meta/${id}`))return g;return null;}
  if(b.action==='room-info'){
   if(parent.closed)fail(423,'Bilik ditutup oleh Guru. Minta Guru membuka bilik semula.');
   if(b.groupId62&&!valid(b.groupId62))fail(400,'Pilih kumpulan yang disediakan oleh Guru.');
   const result=await dataOf(await base(req)),groups=[];
   for(const id of ids){const r=await scoped(id).list({prefix:`room/${code}/roles/`}),rows=await Promise.all(r.blobs.map(x=>scoped(id).get(x.key)));groups.push({id,name:'Kumpulan '+id,count:rows.filter(Boolean).length,takenRoles:rows.filter(Boolean).map(x=>x.role)});}
   return json({...result,room:{...result.room,groupCount62:parent.groupCount62},groups62:groups,takenRoles:groups.find(g=>g.id===String(b.groupId62))?.takenRoles||[]});
  }
  if(b.action==='join'){
   if(parent.closed)fail(423,'Bilik ditutup oleh Guru. Minta Guru membuka bilik semula.');
   if(!valid(b.groupId62))fail(400,'Pilih kumpulan kamu dahulu.');
   return call(String(b.groupId62));
  }
  if(!user||user.code!==code)return base(req);
  if(user.kind==='student'){
   if(!valid(user.groupId62))fail(403,'Sesi kumpulan tidak sah. Masuk semula.');
   if(b.groupId62&&String(b.groupId62)!==user.groupId62)fail(403,'Sesi ini milik kumpulan lain. Pilih nama dan kumpulan kamu sendiri.');
   return call(user.groupId62);
  }
  if(!teacher)return base(req);
  if(['report','pupil-audio-list'].includes(b.action)){
   const result=await dataOf(await base(req));result.records||=[];if(b.action==='report')result.archivedRecords||=[];
   for(const id of ids){const data=await dataOf(await call(id));for(const field of ['records','archivedRecords'])if(data[field])result[field].push(...data[field].map(r=>({...r,group:'Kumpulan '+id,groupId62:id,sessionId:code+':group:'+id,recordSource:'Kelas · kumpulan '+id})));}
   return json(result);
  }
  if(['report-hide','report-purge'].includes(b.action)){
   if(!Array.isArray(b.ids)||!b.ids.length||b.ids.length>80)fail(400,'Pilih rekod murid yang sah.');
   const batches=new Map();for(const id of b.ids){const g=await groupOfMember(id);if(!g)fail(400,'Rekod bukan milik kelas ini.');if(!batches.has(g))batches.set(g,[]);batches.get(g).push(id);}
   if(b.action==='report-purge')for(const [g,selected]of batches){const members=await scoped(g).list({prefix:`room/${code}/members/`});if(b.confirm!==true||members.blobs.some(x=>!selected.includes(x.key.split('/').at(-1))))fail(409,'Pilih semua ahli kumpulan yang hendak dipadam secara kekal.');for(const id of selected)if(!(await scoped(g).get(`room/${code}/report-hidden/${id}`))?.hidden)fail(409,'Padam rekod daripada analisis dahulu.');}
   for(const [g,ids]of batches)await dataOf(await call(g,{...b,ids}));return json({ok:true});
  }
  const g=b.action.startsWith('pupil-audio-')?await groupOfAudio(b.id):await groupOfMember(b.memberId);
  if(g)return call(g);
  // Shared teacher narration and open/close actions belong to the parent class.
  return base(req);
 }catch(e){return json({error:e.status?e.message:'Kelas belum dapat dimuatkan. Semak sambungan dan cuba lagi.'},e.status||503);}};
}
