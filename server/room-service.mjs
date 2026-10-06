import {groupState,validateAction,roleOrder} from './group-flow.mjs';
import { randomBytes, randomUUID, createHash } from 'node:crypto';
const roles=['pembaca','pencari','pemancing','pencatat','kendiri'];
const guides=['mula','baca','cari','bincang','pancing','bonus','buku','rumah'];
const stories={belang:1,pondok:0,pokok:1,sihat:0};
const hash=t=>createHash('sha256').update(t).digest('hex');
const clean=(v,max=100)=>typeof v==='string'?v.trim().slice(0,max):'';
const error=(status,message)=>{const e=new Error(message);e.status=status;throw e;};
const json=(value,status=200)=>new Response(JSON.stringify(value),{status,headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'}});
export function summarize(member,events){
 const own=events.filter(e=>e.memberId===member.id).sort((a,b)=>a.at-b.at);const answer=t=>own.filter(e=>e.type===t);
 const evidence=[...answer('evidence'),...answer('page-evidence')],main=answer('main'),bonus=answer('bonus');const proofPages=new Set(answer('page-evidence').filter(e=>e.correct).map(e=>e.page)).size;const decisions=answer('story-choice');
 const reached=es=>es.findIndex(e=>e.correct);const tries=es=>reached(es)<0?es.length:reached(es)+1;
 return {id:member.id,name:member.name,kelas:member.kelas,role:member.role,story:member.story,joined:member.joined,
 pages:[...new Set(answer('read').map(e=>e.page))].length,evidence:evidence.some(e=>e.correct),evidenceAttempts:proofPages||answer('page-evidence').length?evidence.length:tries(evidence),
 main:main.some(e=>e.correct),mainAttempts:tries(main),bonus:bonus.some(e=>e.correct),bonusAttempts:tries(bonus),
 proofPages,decisions:decisions.map(e=>({page:e.page,choice:e.choice})),points:(proofPages?proofPages*2:main.some(e=>e.correct)?10:0)+new Set(decisions.map(e=>e.page)).size*2+(bonus.some(e=>e.correct)?5:0),book:answer('book').length>0,pdf:answer('pdf').length>0,
 notes:own.filter(e=>e.type==='note').map(e=>({round:e.round,text:e.text,page:e.page})),last:own.at(-1)?.at||member.joined};
}
export function createHandler(store,{now=()=>Date.now()}={}){
 const get=key=>store.get(key,{type:'json'});
 async function entries(prefix,limit=200){const {blobs}=await store.list({prefix});const keys=blobs.map(b=>b.key).sort().slice(-limit);return (await Promise.all(keys.map(get))).filter(Boolean);}
 async function auth(req,body){const token=(req.headers.get('authorization')||'').replace(/^Bearer /,'');if(!/^[a-f0-9]{64}$/.test(token))error(401,'Sila masuk ke bilik semula.');const user=await get('auth/'+hash(token));if(!user||user.code!==body.code)error(403,'Kunci bilik tidak sah.');const room=await get('rooms/'+user.code);if(!room||room.expires<now())error(410,'Bilik ini telah tamat. Minta kod bilik baharu daripada guru.');return {user,room};}
 async function append(code,type,data){const id=String(now()).padStart(15,'0')+'-'+randomUUID();await store.setJSON(`room/${code}/${type}/${id}`,{...data,at:now()});}
 async function allEvents(code){return entries(`room/${code}/events/`,Number.MAX_SAFE_INTEGER);}
 return async(req)=>{try{
   if(req.method!=='POST')return json({error:'Gunakan permintaan POST.'},405);
   const origin=req.headers.get('origin');if(origin&&origin!==new URL(req.url).origin)error(403,'Permintaan dari laman lain tidak dibenarkan.');
   if(Number(req.headers.get('content-length')||0)>4000000)error(413,'Maklumat terlalu panjang.');
   const raw=await req.text();if(raw.length>4000000)error(413,'Maklumat terlalu panjang.');let b;try{b=JSON.parse(raw);}catch{error(400,'Maklumat tidak sah.');}if(!b||typeof b!=='object')error(400,'Maklumat tidak sah.');if(raw.length>18000&&b.action!=='audio-save')error(413,'Maklumat terlalu panjang.');
   if(b.action==='ping')return json({ok:true});
   if(b.action==='create'){
     const name=clean(b.name,60),kelas=clean(b.kelas,40),story=clean(b.story,12);if(!name||!kelas||!(story in stories))error(400,'Isi nama kumpulan, kelas dan kisah.');
     let meet='';if(b.meet){try{const url=new URL(b.meet);if(url.protocol!=='https:')throw 0;meet=url.href.slice(0,500);}catch{error(400,'Pautan pertemuan mesti bermula dengan https://.');}}
     const code=randomBytes(5).toString('hex').toUpperCase(),token=randomBytes(32).toString('hex'),created=now();
     const room={code,name,kelas,story,meet,version:8,mode:b.mode==='kendiri'?'kendiri':'kumpulan',sessionAt:clean(b.sessionAt,40),created,expires:created+30*86400000};const written=await store.setJSON('rooms/'+code,room,{onlyIfNew:true});if(!written.modified)error(409,'Kod sedang digunakan. Cuba sekali lagi.');
     await store.setJSON('auth/'+hash(token),{kind:'teacher',code});return json({room,teacherToken:token},201);
   }
   if(b.action==='join'){
     const code=clean(b.code,10).toUpperCase();if(!/^[A-F0-9]{10}$/.test(code))error(400,'Semak kod bilik 10 aksara daripada guru.');
     const room=await get('rooms/'+code);if(!room||room.expires<now())error(404,'Bilik tidak ditemui atau telah tamat.');
     const name=clean(b.name,60),kelas=clean(b.kelas,40),role=clean(b.role,20);if(!name||!kelas||!roles.includes(role))error(400,'Isi nama, kelas dan pilihan peranan.');if(kelas.toLowerCase()!==room.kelas.toLowerCase())error(400,'Kelas bilik ini ialah '+room.kelas+'. Semak kelas kamu.');
     const members=await entries(`room/${code}/members/`,101);if(members.length>=80)error(409,'Bilik ini penuh. Minta guru membuka bilik baharu.');
     const id=randomUUID(),token=randomBytes(32).toString('hex'),member={id,code,name,kelas,role,story:room.story,joined:now()};
     if(room.mode==='kendiri'&&role!=='kendiri'||room.mode!=='kendiri'&&role==='kendiri')error(400,room.mode==='kendiri'?'Pilih mod Rumah: latihan kendiri.':'Pilih mod Dalam talian bersama kumpulan.');
     if(room.version>=7&&room.mode!=='kendiri'){const claim=await store.setJSON(`room/${code}/roles/${role}`,{id,name,role},{onlyIfNew:true});if(!claim.modified)error(409,'Peranan ini telah dipilih. Pilih peranan lain bersama kumpulan.');}
     await store.setJSON(`room/${code}/members/${id}`,member);await store.setJSON('auth/'+hash(token),{kind:'student',code,id});return json({room,member,token},201);
   }
   const {user,room}=await auth(req,b),code=room.code;
   const actionsPrefix=`room/${code}/actions/${room.mode==='kendiri'?user.id+'/':''}`;
   const audioSlot=guides.includes(b.guide)?'guide-'+b.guide:Number.isInteger(b.page)&&b.page>=1&&b.page<=5?'page'+b.page:null;
   if(b.action==='audio-read'){if(!audioSlot)error(400,'Rakaman tidak sah.');const text=clean(b.text,450),variant=text?await get(`room/${code}/audio/${audioSlot}/${hash(text)}`):null,legacy=variant||await get(`room/${code}/audio/${audioSlot}`);return json({record:legacy&&(!text||legacy.text===text)?legacy:null});}
   if(b.action==='audio-save'){if(user.kind!=='teacher')error(403,'Hanya guru boleh berkongsi rakaman.');if(!audioSlot||typeof b.audio!=='string'||b.audio.length>3500000||!/^data:audio\/(webm|mp4|mpeg|wav|ogg|x-wav)(;[^,]*)?;base64,[A-Za-z0-9+/=]+$/.test(b.audio)||!clean(b.text,450))error(400,'Rakaman tidak sah atau terlalu besar. Gunakan rakaman pendek (maksimum 2.5 MB).');const record={audio:b.audio,text:clean(b.text,450)};await store.setJSON(`room/${code}/audio/${audioSlot}/${hash(record.text)}`,record);await store.setJSON(`room/${code}/audio/${audioSlot}`,record);return json({ok:true});}
   if(b.action==='state'){
     if(user.kind==='student')await store.setJSON(`room/${code}/presence/${user.id}`,{id:user.id,at:now()});
     const [allMembers,allMessages,allDrafts,presence]=await Promise.all([entries(`room/${code}/members/`,80),entries(`room/${code}/messages/`,60),entries(`room/${code}/drafts/`,20),entries(`room/${code}/presence/`,80)]);
     const solo=room.mode==='kendiri'&&user.kind==='student';const members=solo?allMembers.filter(m=>m.id===user.id):allMembers;
     const flow=groupState(await entries(actionsPrefix,30));return json({room,self:user.kind==='student'?allMembers.find(m=>m.id===user.id):null,members:members.map(({id,name,role})=>({id,name,role,online:presence.some(p=>p.id===id&&now()-p.at<35000)})),messages:solo?allMessages.filter(m=>m.memberId===user.id||m.memberId==='teacher'):allMessages,drafts:solo?allDrafts.filter(d=>d.memberId===user.id):allDrafts,flow});
   }
   if(b.action==='story-state'){if(user.kind!=='teacher')error(403,'Hanya guru boleh memuatkan cerita bilik.');let prefix=`room/${code}/actions/`;if(room.mode==='kendiri'){const id=clean(b.memberId,50),m=await get(`room/${code}/members/${id}`);if(!m)error(400,'Pilih murid dalam bilik ini.');prefix+=id+'/';}return json({flow:groupState(await entries(prefix,30))});}
   if(b.action==='report'){if(user.kind!=='teacher')error(403,'Rekod pencapaian hanya untuk guru.');const [members,events]=await Promise.all([entries(`room/${code}/members/`,80),allEvents(code)]);const actions=await entries(`room/${code}/actions/`,2400);const merged=[...events,...actions.map(a=>({...a,type:a.kind==='evidence'?'page-evidence':a.kind==='choice'?'story-choice':['note','bonus-note'].includes(a.kind)?'note':a.kind,round:a.kind==='bonus-note'?'bonus':'main'}))];return json({room,flow:groupState(actions),records:members.map(m=>summarize(m,merged))});}
   if(b.action==='message'){
     const text=clean(b.text,500);if(!text)error(400,'Tulis mesej dahulu.');const member=user.kind==='student'?await get(`room/${code}/members/${user.id}`):{id:'teacher',name:'Guru',role:'guru'};
     await append(code,'messages',{memberId:member.id,name:member.name,role:member.role,text});return json({ok:true});
   }
   if(user.kind!=='student')error(403,'Tindakan ini untuk murid.');const member=await get(`room/${code}/members/${user.id}`);if(!member)error(403,'Murid tidak ditemui.');
   if(b.action==='turn'){
     if(room.version<7)error(400,'Cipta bilik baharu untuk cerita bercabang.');
     const members=await entries(`room/${code}/members/`,80);if(room.mode!=='kendiri'&&!roleOrder.every(role=>members.some(m=>m.role===role)))error(409,'Tunggu sehingga keempat-empat peranan diisi.');
     const current=groupState(await entries(actionsPrefix,30));if(current.finished)error(409,'Cerita kumpulan telah selesai.');
     if(room.mode!=='kendiri'&&member.role!==current.role)error(403,'Sekarang giliran '+(members.find(m=>m.role===current.role)?.name||current.role)+'.');
     const result=validateAction(room.story,current,b);if(result.error)error(result.status,result.error);
     const event={...result.event,memberId:member.id,name:member.name,at:now()};
     if(!result.advance){await append(code,'events',{...event,type:event.kind==='evidence'?'page-evidence':'bonus'});return json({correct:false,flow:current});}
     const saved=await store.setJSON(actionsPrefix+String(current.sequence).padStart(3,'0'),event,{onlyIfNew:true});if(!saved.modified)error(409,'Keputusan sudah disimpan. Semak giliran terkini.');
     // The immutable action itself is also the authoritative achievement record.
     return json({correct:true,flow:groupState(await entries(actionsPrefix,30))});
   }
   if(b.action==='event'){
     if(room.version>=7&&!['book','pdf'].includes(b.type))error(403,'Gunakan giliran kumpulan untuk merekod aktiviti.');
     const type=clean(b.type,20),event={memberId:member.id,type};
     if(type==='read'){if(!Number.isInteger(b.page)||b.page<0||b.page>4)error(400,'Muka surat tidak sah.');event.page=b.page;}
     else if(type==='page-evidence'||type==='story-choice'){if(!Number.isInteger(b.page)||b.page<0||b.page>4||![0,1,2].includes(b.choice))error(400,'Pilihan tidak sah.');event.page=b.page;event.choice=b.choice;event.correct=type==='page-evidence'?b.choice===globalThis.JoranStory.make(room.story,b.page,[]).evidence:null;}
     else if(['evidence','main','bonus'].includes(type)){if(!Number.isInteger(b.choice)||b.choice<0||b.choice>2)error(400,'Jawapan tidak sah.');event.choice=b.choice;event.correct=b.choice===(type==='evidence'?stories[room.story]:0);}
     else if(type==='note'){if(!['main','bonus'].includes(b.round)||!clean(b.text,600))error(400,'Catat idea dahulu.');event.round=b.round;event.text=clean(b.text,600);if(Number.isInteger(b.page))event.page=b.page;}
     else if(!['book','pdf'].includes(type))error(400,'Aktiviti tidak sah.');
     const id=clean(b.id,50);if(!/^[a-f0-9-]{36}$/.test(id))error(400,'Pengenal aktiviti tidak sah.');
     const result=await store.setJSON(`room/${code}/events/${member.id}-${id}`,{...event,at:now()},{onlyIfNew:true});
     // Each request ID has its own immutable event; report totals are derived from successes, never accumulated counters.
     return json({ok:result.modified});
   }
   if(b.action==='draft'){
     const d=b.draft;if(!d||typeof d.title!=='string'||!d.title.trim()||d.title.length>70||!Array.isArray(d.pages)||d.pages.length!==5||!d.pages.every(t=>typeof t==='string'&&t.trim()&&t.length<=450))error(400,'Lengkapkan tajuk dan lima muka surat dahulu.');
     await append(code,'drafts',{memberId:member.id,name:member.name,role:member.role,story:room.story,draft:{title:d.title,group:room.name,branch:d.branch===1?1:0,pages:d.pages,choices:Array.isArray(d.choices)&&d.choices.length===5&&d.choices.every(x=>[0,1,2].includes(x))?d.choices:[]}});return json({ok:true});
   }
   error(400,'Tindakan tidak dikenali.');
 }catch(e){return json({error:e.status?e.message:'Sambungan belum berjaya. Cuba lagi sebentar nanti.'},e.status||503);}};
}
