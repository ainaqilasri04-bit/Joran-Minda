import {issueTeacherKey63,unlockTeacher63} from './teacher-keys.mjs';
import {classRouter62} from './class-groups.mjs';
import {pupilAudioAction,readingPages} from './pupil-audio.mjs';
import {groupState,validateAction,roleOrder} from './group-flow.mjs';
import '../public/achievement.js';
import '../public/lesson-core.js';
import { randomBytes, randomUUID, randomInt, createHash } from 'node:crypto';
const roles=['pembaca','pencari','pemancing','pencatat','kendiri'];
const guides=['mula','baca','cari','bincang','pancing','bonus','buku','rumah'];
const stories={belang:1,pondok:0,pokok:1,sihat:0};
const hash=t=>createHash('sha256').update(t).digest('hex');
const clean=(v,max=100)=>typeof v==='string'?v.trim().slice(0,max):'';
const roomCode=v=>typeof v==='string'?v.replace(/[\s-]/g,'').toUpperCase():'';
const validRoomCode=code=>/^(?:\d{6}|[A-F0-9]{10})$/.test(code);
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
export function createHandler(store,options={}){return classRouter62(store,options,createSingleHandler);}
function createSingleHandler(store,{now=()=>Date.now(),makeCode=()=>String(randomInt(100000,1000000)),makeTeacherKey}={}){
 const get=key=>store.get(key,{type:'json'});
 async function entries(prefix,limit=200){const {blobs}=await store.list({prefix});const keys=blobs.map(b=>b.key).sort().slice(-limit);return (await Promise.all(keys.map(get))).filter(Boolean);}
 async function auth(req,body){const token=(req.headers.get('authorization')||'').replace(/^Bearer /,'');if(!/^[a-f0-9]{64}$/.test(token))error(401,'Sila masuk ke bilik semula.');const user=await get('auth/'+hash(token));if(user?.kind==='student'&&(!(await get(`room/${user.code}/members/${user.id}`))||await get(`room/${user.code}/purged/${user.id}`)||(await get(`room/${user.code}/report-hidden/${user.id}`))?.hidden))error(410,'Rekod ini telah dipadam. Masuk semula sebagai murid baharu.');if(!user||user.code!==body.code)error(403,'Kunci bilik tidak sah.');const room=await get('rooms/'+user.code);if(!room||room.expires<now())error(410,'Bilik ini telah tamat. Minta kod bilik baharu daripada guru.');if(user.kind==='student'&&room.closed)error(423,'Bilik ditutup oleh Guru. Tunggu Guru membuka bilik semula.');return {user,room};}
 async function append(code,type,data){const id=(type==='events'&&data.memberId?data.memberId+'-':'')+String(now()).padStart(15,'0')+'-'+randomUUID();await store.setJSON(`room/${code}/${type}/${id}`,{...data,at:now()});}
 async function allEvents(code){return entries(`room/${code}/events/`,Number.MAX_SAFE_INTEGER);}
 return async(req)=>{try{
   if(req.method!=='POST')return json({error:'Gunakan permintaan POST.'},405);
   const origin=req.headers.get('origin');if(origin&&origin!==new URL(req.url).origin)error(403,'Permintaan dari laman lain tidak dibenarkan.');
   if(Number(req.headers.get('content-length')||0)>4000000)error(413,'Maklumat terlalu panjang.');
   const raw=await req.text();if(raw.length>4000000)error(413,'Maklumat terlalu panjang.');let b;try{b=JSON.parse(raw);}catch{error(400,'Maklumat tidak sah.');}if(!b||typeof b!=='object')error(400,'Maklumat tidak sah.');if(raw.length>18000&&!['audio-save','pupil-audio-save'].includes(b.action))error(413,'Maklumat terlalu panjang.');
   if(b.action==='teacher-unlock63')return json(await unlockTeacher63(store,b,{now}));
   if(b.action==='ping'){
     await get('system/healthcheck-v1');
     return json({ok:true,service:'joran-minda-kelas',version:40,lessonVersions:[24,25,26,28,29,34,37,38,39,40]});
   }
   if(b.action==='room-info'){
     const code=roomCode(b.code);
     if(!validRoomCode(code))error(400,'Masukkan kod 6 angka daripada Guru. Kod lama 10 aksara juga diterima.');
     const room=await get('rooms/'+code);
     if(!room||room.expires<now())error(404,'Kod bilik tidak ditemui atau telah tamat. Semak kod dengan Guru.');
     if(room.closed)error(423,'Bilik ditutup oleh Guru. Minta Guru membuka bilik semula.');
     const occupied=room.mode==='kendiri'?[]:await entries(`room/${code}/roles/`,4);
     return json({room:{code:room.code,name:room.name,kelas:room.kelas,story:room.story,mode:room.mode,expires:room.expires,lessonVersion:room.lessonVersion,leaderRole:room.leaderRole,accessMode:room.accessMode||'either',closed:!!room.closed},takenRoles:occupied.map(r=>r.role)});
   }
   if(b.action==='create'){
     const name=clean(b.name,60),kelas=clean(b.kelas,40),story=clean(b.story,12);if(!name||!kelas||!(story in stories))error(400,'Isi nama kumpulan, kelas dan kisah.');
     let meet='';if(b.meet){try{const url=new URL(b.meet);if(url.protocol!=='https:')throw 0;meet=url.href.slice(0,500);}catch{error(400,'Pautan pertemuan mesti bermula dengan https://.');}}
     if(b.groupCount62!==undefined&&(!Number.isInteger(b.groupCount62)||b.groupCount62<1||b.groupCount62>12))error(400,'Pilih antara 1 hingga 12 kumpulan.');
     const token=randomBytes(32).toString('hex'),created=now();
     for(let attempt=0;attempt<8;attempt++){
      const code=makeCode();if(!/^\d{6}$/.test(code))throw Error('Invalid room code generator');
      const room={code,name,kelas,story,meet,closed:false,groupCount62:b.mode!=='kendiri'&&b.accessMode==='room'?(b.groupCount62||0):0,accessMode:['device','room'].includes(b.accessMode)?b.accessMode:'either',requireUpload52:false,version:23,lesson:b.lesson===true,lessonVersion:b.lesson===true&&[25,26,28,29,34,37,38,39,40].includes(b.lessonVersion)?b.lessonVersion:24,leaderRole:roleOrder.includes(b.leaderRole)?b.leaderRole:'pembaca',mode:b.mode==='kendiri'?'kendiri':'kumpulan',sessionAt:clean(b.sessionAt,40),created,expires:created+30*86400000};
      const written=await store.setJSON('rooms/'+code,room,{onlyIfNew:true});
      if(written.modified){
       let teacherKey63;
       try{await store.setJSON('auth/'+hash(token),{kind:'teacher',code});teacherKey63=await issueTeacherKey63(store,room,{makeTeacherKey});}
       catch(e){try{await store.delete('rooms/'+code);await store.delete('auth/'+hash(token));}catch{}throw e;}
       return json({room,teacherToken:token,teacherKey63},201);
      }
     }
     error(409,'Kod baharu belum dapat disediakan. Tekan Dapatkan pautan murid sekali lagi.');
   }
   if(b.action==='join'){
     const code=roomCode(b.code);if(!validRoomCode(code))error(400,'Semak kod 6 angka daripada Guru. Kod lama 10 aksara juga diterima.');
     const room=await get('rooms/'+code);if(!room||room.expires<now())error(404,'Bilik tidak ditemui atau telah tamat.');
     if(room.closed)error(423,'Bilik ditutup oleh Guru. Minta Guru membuka bilik semula.');
     if(room.accessMode==='device')error(409,'Kelas ini menggunakan satu peranti. Buka pautan kelas daripada Guru.');
     if(b.story&&b.story!==room.story)error(409,'Gunakan cerita yang ditetapkan oleh Guru.');
     const name=clean(b.name,60),kelas=clean(b.kelas,40),role=clean(b.role,20);if(!name||!kelas||!roles.includes(role))error(400,'Isi nama, kelas dan pilihan peranan.');if(kelas.toLowerCase()!==room.kelas.toLowerCase())error(400,'Kelas bilik ini ialah '+room.kelas+'. Semak kelas kamu.');
     const members=await entries(`room/${code}/members/`,101);if(members.length>=80)error(409,'Bilik ini penuh. Minta guru membuka bilik baharu.');
     const id=randomUUID(),token=randomBytes(32).toString('hex'),member={id,code,name,kelas,role,story:room.story,joined:now()};
     if(room.mode==='kendiri'&&role!=='kendiri'||room.mode!=='kendiri'&&role==='kendiri')error(400,room.mode==='kendiri'?'Pilih mod Rumah: latihan kendiri.':'Pilih mod Dalam talian bersama kumpulan.');
     if(room.version>=7&&room.mode!=='kendiri'){const claim=await store.setJSON(`room/${code}/roles/${role}`,{id,name,role},{onlyIfNew:true});if(!claim.modified)error(409,'Peranan ini telah dipilih. Pilih peranan lain bersama kumpulan.');}
     try{
      await store.setJSON(`room/${code}/members/${id}`,member);
      await store.setJSON('auth/'+hash(token),{kind:'student',code,id});
     }catch(e){
      // A failed join must not leave a phantom pupil occupying a group slot.
      try{await store.delete(`room/${code}/members/${id}`);await store.delete('auth/'+hash(token));const claim=await get(`room/${code}/roles/${role}`);if(claim?.id===id)await store.delete(`room/${code}/roles/${role}`);}catch{}
      throw e;
     }
     return json({room,member,token},201);
   }
   const authenticated=await auth(req,b),user=authenticated.user,room={...authenticated.room,requireUpload52:false},code=room.code;
   if(b.action==='teacher-key63'){if(user.kind!=='teacher')error(403,'Hanya Guru boleh menjana kata kunci kelas.');return json({teacherKey63:await issueTeacherKey63(store,room,{makeTeacherKey})});}
   if(b.action==='room-access'){
     if(user.kind!=='teacher')error(403,'Hanya Guru boleh menutup atau membuka bilik.');
     if(typeof b.closed!=='boolean')error(400,'Pilih buka atau tutup bilik.');
     room.closed=b.closed;room.accessChangedAt=now();await store.setJSON('rooms/'+code,room);return json({ok:true,room});
   }
   if(user.kind==='student'&&b.story&&b.story!==room.story)error(409,'Gunakan cerita yang ditetapkan oleh Guru.');
   const collaborative=room.lessonVersion>=26&&room.mode!=='kendiri';
   const pupilResult=await pupilAudioAction({b,user,room,store,get,entries,now});if(pupilResult)return json(pupilResult);
   const readingRows=room.lessonVersion>=26?await entries(`room/${code}/pupil-meta/`,Number.MAX_SAFE_INTEGER):[];
   const lessonMembers=await entries(`room/${code}/members/`,80);
   const requiredMembers=id=>room.mode==='kendiri'?lessonMembers.filter(m=>m.id===id):lessonMembers.slice().sort((a,b)=>roleOrder.indexOf(a.role)-roleOrder.indexOf(b.role));
   const readerFor=(page,id)=>requiredMembers(id)[page%requiredMembers(id).length];
   const lessonFor=(id,events)=>globalThis.JoranLesson.assess(events.filter(e=>e.memberId===id),room.story,{version:room.lessonVersion,members:requiredMembers(id)});
   const bookEditFor31=async id=>(await entries(`room/${code}/book-edits/${room.mode==='kendiri'?id:'group'}/`,200)).sort((a,b)=>b.revision-a.revision)[0]||null;
   const [receiptRows52,allEdits52]=await Promise.all([entries(`room/${code}/book-upload52/`,80),entries(`room/${code}/book-edits/`,16000)]),edits52=new Map();
   for(const m of lessonMembers){const candidates=room.mode==='kendiri'?allEdits52.filter(e=>e.memberId===m.id):allEdits52;edits52.set(m.id,candidates.reduce((best,e)=>!best||e.revision>best.revision?e:best,null));}
   const receiptFor52=id=>receiptRows52.find(r=>r.owner===(room.mode==='kendiri'?id:'group'))||null;
   const uploaded52=id=>{const receipt=receiptFor52(id);return !!receipt&&receipt.verifiedBy==='teacher'&&receipt.revision===(edits52.get(id)?.revision||0);};
   const resultFor=(m,events,members)=>{
     const r=globalThis.JoranAchievement.reportMember(m,events,members,room.mode);
     if(room.lesson){r.lesson=lessonFor(m.id,events);r.lessonPoints=globalThis.JoranLesson.points(r.lesson,r.achievement);r.certificateEligible=r.certificateEligible&&r.lesson.complete&&(room.mode==='kendiri'||members.every(x=>lessonFor(x.id,events).complete));}
     r.uploadReceipt52=receiptFor52(m.id);r.uploadConfirmed52=uploaded52(m.id);r.uploadConfirmationRequired=false;
     r.groupShared26=collaborative;r.readingPages=readingPages(readingRows,m.id,room.story,room.lessonVersion);
     if(room.lessonVersion>=28)r.certificateEligible=r.certificateEligible&&Array.from({length:5},(_,page)=>readingPages(readingRows,readerFor(page,m.id)?.id,room.story,room.lessonVersion).includes(page)).every(Boolean);
     else if(room.lessonVersion>=26)r.certificateEligible=r.certificateEligible&&(room.mode==='kendiri'?r.readingPages.length===5:members.length===4&&members.every(x=>readingPages(readingRows,x.id,room.story,room.lessonVersion).length===5));
     return r;
   };
   const flowFor=actions=>{const flow=groupState(actions,{rotate:room.version>=23});return collaborative&&room.lessonVersion<29?{...flow,role:room.leaderRole}:flow;};
   const actionsPrefix=`room/${code}/actions/${room.mode==='kendiri'?user.id+'/':''}`;
   const audioSlot=guides.includes(b.guide)?'guide-'+b.guide:Number.isInteger(b.page)&&b.page>=1&&b.page<=5?'page'+b.page:null;
   if(b.action==='audio-read'){if(!audioSlot)error(400,'Rakaman tidak sah.');const text=clean(b.text,450),variant=text?await get(`room/${code}/audio/${audioSlot}/${hash(text)}`):null,legacy=variant||await get(`room/${code}/audio/${audioSlot}`);return json({record:legacy&&(!text||legacy.text===text)?legacy:null});}
   if(b.action==='audio-save'){if(user.kind!=='teacher')error(403,'Hanya guru boleh berkongsi rakaman.');if(!audioSlot||typeof b.audio!=='string'||b.audio.length>3500000||!/^data:audio\/(webm|mp4|mpeg|wav|ogg|x-wav)(;[^,]*)?;base64,[A-Za-z0-9+/=]+$/.test(b.audio)||!clean(b.text,450))error(400,'Rakaman tidak sah atau terlalu besar. Gunakan rakaman pendek (maksimum 2.5 MB).');const record={audio:b.audio,text:clean(b.text,450)};await store.setJSON(`room/${code}/audio/${audioSlot}/${hash(record.text)}`,record);await store.setJSON(`room/${code}/audio/${audioSlot}`,record);return json({ok:true});}

   if(b.action==='state'){
     if(user.kind==='student')await store.setJSON(`room/${code}/presence/${user.id}`,{id:user.id,at:now()});
     const solo=room.mode==='kendiri'&&user.kind==='student';
     const [allMembers,allMessages,allDrafts,presence]=await Promise.all([solo?get(`room/${code}/members/${user.id}`).then(m=>m?[m]:[]):entries(`room/${code}/members/`,80),solo?[]:entries(`room/${code}/messages/`,60),solo?[]:entries(`room/${code}/drafts/`,20),solo?[{id:user.id,at:now()}]:entries(`room/${code}/presence/`,80)]);
     const members=allMembers;
     const actions=await entries(actionsPrefix,30),flow=flowFor(actions);
     const all=solo&&room.version>=23?await entries(`room/${code}/events/${user.id}-`,Number.MAX_SAFE_INTEGER):await allEvents(code),visible=solo?all.filter(e=>e.memberId===user.id):all,merged=[...actions,...visible].map(globalThis.JoranAchievement.normalize);
     const progress=members.map(m=>({id:m.id,name:m.name,...resultFor(m,merged,members),mode:room.mode,group:room.name,sessionId:room.code,lessonVersion:room.lessonVersion}));
     return json({progress,room,uploadReceipt52:receiptFor52(user.id),bookEdit:await bookEditFor31(user.id),self:user.kind==='student'?allMembers.find(m=>m.id===user.id):null,members:members.map(({id,name,role})=>({id,name,role,online:presence.some(p=>p.id===id&&now()-p.at<35000)})),messages:solo?allMessages.filter(m=>m.memberId===user.id||m.memberId==='teacher'):allMessages,drafts:solo?allDrafts.filter(d=>d.memberId===user.id):allDrafts,flow});
   }
   if(b.action==='book-upload-confirm'){
     if(user.kind!=='teacher')error(403,'Hanya Guru boleh mengesahkan penghantaran.');
     const m=lessonMembers.find(m=>m.id===b.memberId);if(!m||b.checked!==true)error(400,'Semak PDF murid dalam folder Google Drive dahulu.');
     let folder;try{folder=new URL(b.folder);if(folder.protocol!=='https:'||folder.hostname!=='drive.google.com'||folder.username||folder.password||folder.port||!/^\/drive\/folders\/[A-Za-z0-9_-]+$/.test(folder.pathname))throw 0;}catch{error(400,'Pautan folder Google Drive tidak sah.');}
     let content;try{content=JSON.parse(b.fingerprint);if(!Array.isArray(content)||content.length!==4||content[0]!==folder.href||typeof content[1]!=='string'||!content[1].trim()||content[1].length>70||![content[2],content[3]].every(list=>Array.isArray(list)&&list.length===5&&list.every(t=>typeof t==='string'&&t.trim()&&t.length<=450)))throw 0;}catch{error(400,'Maklumat buku tidak lengkap.');}
     const edit=edits52.get(m.id),revision=edit?.revision||0;if(b.revision!==revision)error(409,'Buku telah berubah. Hantar versi terkini dahulu.');
     if(edit&&JSON.stringify(content.slice(1))!==JSON.stringify([edit.title,edit.pageTitles,edit.pages]))error(409,'Buku tidak sepadan dengan versi terkini.');
     if(!edit&&JSON.stringify(content[3])!==JSON.stringify(Array.from({length:5},(_,i)=>globalThis.JoranStory.lessonText(room.story,i,room.lessonVersion))))error(409,'Ayat buku tidak sepadan.');
     const es=await allEvents(code),actions=await entries(`room/${code}/actions/`,2400),merged=[...es,...actions].map(globalThis.JoranAchievement.normalize),result=resultFor(m,merged,lessonMembers);
     if(result.achievement.reviewPages.length!==5)error(409,'Semak kelima-lima halaman dahulu.');
     const receipt={owner:room.mode==='kendiri'?m.id:'group',story:room.story,verifiedBy:'teacher',at:now(),folder:folder.href,fingerprint:b.fingerprint,revision};
     await store.setJSON(`room/${code}/book-upload52/${receipt.owner}`,receipt);return json({ok:true,receipt});
   }
   if(b.action==='story-state'){if(user.kind!=='teacher')error(403,'Hanya guru boleh memuatkan cerita bilik.');let prefix=`room/${code}/actions/`;if(room.mode==='kendiri'){const id=clean(b.memberId,50),m=await get(`room/${code}/members/${id}`);if(!m)error(400,'Pilih murid dalam bilik ini.');prefix+=id+'/';}return json({flow:flowFor(await entries(prefix,30))});}
   if(b.action==='report-hide'){
     if(user.kind!=='teacher')error(403,'Hanya Guru boleh memadam rekod daripada analisis.');
     if(!Array.isArray(b.ids)||!b.ids.length||b.ids.length>80||b.ids.some(id=>typeof id!=='string'||!/^[a-f0-9-]{36}$/.test(id)))error(400,'Pilih rekod murid yang sah.');
     const members=await entries(`room/${code}/members/`,80);
     if(b.ids.some(id=>!members.some(m=>m.id===id)))error(400,'Rekod bukan milik bilik ini.');
     for(const id of new Set(b.ids))await store.setJSON(`room/${code}/report-hidden/${id}`,{id,hidden:b.hidden!==false,at:now()});
     return json({ok:true});
   }
   if(b.action==='report-purge'){
     if(user.kind!=='teacher')error(403,'Hanya Guru boleh memadam sejarah secara kekal.');
     if(b.confirm!==true||!Array.isArray(b.ids)||!b.ids.length||b.ids.length>80)error(400,'Sahkan senarai rekod yang hendak dipadam.');
     const members=await entries(`room/${code}/members/`,80),hidden=await entries(`room/${code}/report-hidden/`,80),ids=[...new Set(b.ids)];
     if(ids.some(id=>!members.some(m=>m.id===id)||!hidden.some(h=>h.id===id&&h.hidden)))error(409,'Padam rekod daripada analisis dahulu. Muat semula senarai jika telah berubah.');
     if(room.mode!=='kendiri'&&members.some(m=>!ids.includes(m.id)))error(409,'Sejarah kumpulan dikongsi. Pilih semua rekod kumpulan ini untuk padam kekal.');
     for(const id of ids)await store.setJSON(`room/${code}/purged/${id}`,{id,at:now()});
     const {blobs}=await store.list({prefix:`room/${code}/`});
     for(const {key} of blobs){
       const relative=key.slice(`room/${code}/`.length);if(relative.startsWith('audio/')||relative.startsWith('purged/'))continue;
       const record=await get(key),owned=room.mode!=='kendiri'||ids.includes(record?.memberId)||ids.includes(record?.id)||ids.includes(record?.owner)||ids.some(id=>relative.startsWith('actions/'+id+'/'));
       if(owned)await store.delete(key);
     }
     const authKeys=await store.list({prefix:'auth/'});
     for(const {key} of authKeys.blobs){const record=await get(key);if(record?.kind==='student'&&record.code===code&&ids.includes(record.id))await store.delete(key);}
     return json({ok:true,deleted:ids});
   }
   if(b.action==='report'){
     if(user.kind!=='teacher')error(403,'Rekod pencapaian hanya untuk Guru.');
     const [members,events,actions,hidden]=await Promise.all([entries(`room/${code}/members/`,80),allEvents(code),entries(`room/${code}/actions/`,2400),entries(`room/${code}/report-hidden/`,80)]);
     const merged=[...events,...actions].map(globalThis.JoranAchievement.normalize);
     const records=members.map(m=>({...summarize(m,merged),...resultFor(m,merged,members),mode:room.mode,group:room.name,sessionId:room.code,lessonVersion:room.lessonVersion}));
     const excluded=r=>hidden.some(h=>h.id===r.id&&h.hidden);
     return json({room,flow:flowFor(actions),records:records.filter(r=>!excluded(r)),archivedRecords:records.filter(excluded)});
   }
   if(b.action==='message'){
     const text=clean(b.text,500);if(!text)error(400,'Tulis mesej dahulu.');const member=user.kind==='student'?await get(`room/${code}/members/${user.id}`):{id:'teacher',name:'Guru',role:'guru'};
     await append(code,'messages',{memberId:member.id,name:member.name,role:member.role,text});return json({ok:true});
   }
   if(b.action==='lesson-grade'){
     if(user.kind!=='teacher')error(403,'Hanya Guru boleh menyemak penjelasan.');
     if(!room.lesson||![0,1].includes(b.index)||typeof b.correct!=='boolean')error(400,'Semakan tidak sah.');
     const m=await get(`room/${code}/members/${clean(b.memberId,50)}`);if(!m)error(400,'Murid bukan ahli bilik ini.');
     const events=await allEvents(code),explanation=lessonFor(m.id,events).explanations[b.index];
     if(!explanation||explanation.text!==b.text||explanation.value!==b.value)error(409,'Jawapan murid telah berubah. Muatkan rekod semula.');
     for(const target of collaborative?await entries(`room/${code}/members/`,80):[m])await append(code,'events',{memberId:target.id,type:'lesson-grade',index:b.index,text:explanation.text,value:explanation.value,correct:b.correct,shared:collaborative});return json({ok:true});
   }
   if(user.kind!=='student')error(403,'Tindakan ini untuk murid.');const member=await get(`room/${code}/members/${user.id}`);if(!member)error(403,'Murid tidak ditemui.');
   if(b.action==='lesson-save'){
     if(collaborative&&room.lessonVersion<29&&member.role!==room.leaderRole)error(403,'Ketua menghantar jawapan yang dipersetujui bersama.');
     if(collaborative&&(await entries(`room/${code}/members/`,80)).length!==4)error(409,'Tunggu keempat-empat ahli menyertai kumpulan.');
     if(room.lessonVersion>=26&&b.type==='lesson-read'){const required=room.lessonVersion>=28?[readerFor(b.page,member.id)]:collaborative?await entries(`room/${code}/members/`,80):[member];if(required.some(m=>!readingPages(readingRows,m.id,room.story,room.lessonVersion).includes(b.page)))error(409,'Simpan rakaman pembaca yang ditetapkan untuk halaman ini dahulu.');}
     if(!room.lesson)error(400,'Bilik ini menggunakan aliran permainan terdahulu. Cipta bilik PdP baharu.');
     const events=await allEvents(code),actions=await entries(actionsPrefix,30),core=flowFor(actions);
     if(collaborative&&room.lessonVersion>=29){const l=lessonFor(member.id,events),ms=requiredMembers(member.id);const index=b.type==='lesson-read'?b.page:b.type==='lesson-check'?b.index:b.type==='lesson-explain'?b.index:0;const expected=['lesson-diagnostic','lesson-practice'].includes(b.type)?l.currentMember:ms[index%ms.length];if(expected?.id!==member.id)error(403,'Sekarang giliran '+(expected?.name||'rakan')+'. Penyumbang menekan sendiri.');}
     const result=globalThis.JoranLesson.validate(room.story,events.filter(e=>e.memberId===member.id),b,core.finished,{version:room.lessonVersion||24,members:requiredMembers(member.id)});
     if(result.error)error(409,result.error);
     const id=clean(b.id,50);if(!/^[a-f0-9-]{36}$/.test(id))error(400,'Pengenal aktiviti tidak sah.');
     const recipients=collaborative||b.type==='lesson-puzzle'&&room.mode!=='kendiri'?await entries(`room/${code}/members/`,80):[member];
     for(const recipient of recipients)await store.setJSON(`room/${code}/events/${recipient.id}-lesson-${id}`,{...result.event,memberId:recipient.id,at:now(),shared:collaborative},{onlyIfNew:true});return json({ok:true});
   }
   if(b.action==='completion'){
     if(collaborative&&room.lessonVersion<29&&member.role!==room.leaderRole)error(403,'Ketua menyimpan semakan dan refleksi bersama.');
     const flow=flowFor(await entries(actionsPrefix,30));
     if(!flow.finished)error(409,'Lengkapkan lima muka surat dan aktiviti peribahasa dahulu.');
     if(room.lesson&&!lessonFor(member.id,await allEvents(code)).complete)error(409,'Lengkapkan set induksi serta Aktiviti 1, 2 dan 3 sebelum penutup.');
     if(collaborative&&room.lessonVersion>=29){const ms=requiredMembers(member.id),expected=ms[(b.type==='review-page'?b.page:0)%ms.length];if(expected?.id!==member.id)error(403,'Sekarang giliran '+expected?.name+'.');}
     const type=clean(b.type,30),event={memberId:member.id,type,at:now()};
     if(type==='review-page'){
       if(!Number.isInteger(b.page)||b.page<0||b.page>4)error(400,'Muka surat tidak sah.');event.page=b.page;
       for(const target of collaborative?await entries(`room/${code}/members/`,80):[member])await store.setJSON(`room/${code}/events/${target.id}-review-${b.page}`,{...event,memberId:target.id,shared:collaborative},{onlyIfNew:true});
     }else if(type==='reflection'){
       event.text=clean(b.text,600);if(!event.text)error(400,'Tulis satu perkara yang kamu pelajari. Kata kunci juga diterima.');
       for(const target of collaborative?await entries(`room/${code}/members/`,80):[member])await store.setJSON(`room/${code}/events/${target.id}-reflection`,{...event,memberId:target.id,shared:collaborative});
     }else error(400,'Aktiviti penutup tidak sah.');
     return json({ok:true});
   }
   if(b.action==='certificate'){
     const members=await entries(`room/${code}/members/`,80),actions=await entries(actionsPrefix,30),events=await allEvents(code);
     const merged=[...actions,...events].map(globalThis.JoranAchievement.normalize);
     const certificateMember=collaborative&&(room.lessonVersion>=29||member.role===room.leaderRole)&&b.memberId?members.find(m=>m.id===b.memberId):member;if(!certificateMember)error(400,'Ahli tidak ditemui.');
     const result=resultFor(certificateMember,merged,members);
     if(!result.certificateEligible)error(409,room.mode==='kendiri'?'Sijil belum dibuka. Lengkapkan semua aktiviti dahulu.':'Sijil belum dibuka. Lengkapkan semua aktiviti, semakan buku, refleksi dan rakaman bacaan setiap ahli.');
     return json({certificate:{id:'JM-'+hash(code+':'+certificateMember.id+':23').slice(0,12).toUpperCase(),name:certificateMember.name,kelas:certificateMember.kelas,story:room.story,mode:room.mode,group:room.name,issuedAt:now(),points:result.lessonPoints?.total??result.achievement.points}});
   }
   if(b.action==='turn'){
     if(room.version<7)error(400,'Cipta bilik baharu untuk cerita bercabang.');
     const members=await entries(`room/${code}/members/`,80);if(room.mode!=='kendiri'&&!roleOrder.every(role=>members.some(m=>m.role===role)))error(409,'Tunggu sehingga keempat-empat peranan diisi.');
     if(room.lesson){const es=await allEvents(code),required=room.mode==='kendiri'?[member]:members;if(required.some(m=>!lessonFor(m.id,es).ready))error(409,'Lengkapkan set induksi dan Aktiviti 1. Dalam kumpulan, semua ahli perlu selesai sebelum permainan bersama.');}
     const current=flowFor(await entries(actionsPrefix,30));if(current.finished)error(409,'Cerita kumpulan telah selesai.');
     if(room.mode!=='kendiri'&&member.role!==current.role)error(403,'Sekarang giliran '+(members.find(m=>m.role===current.role)?.name||current.role)+'.');
     const result=validateAction(room.story,current,b,{lessonVersion:room.lessonVersion||0});if(result.error)error(result.status,result.error);
     const event={...result.event,memberId:member.id,name:member.name,at:now()};
     if(!result.advance){await append(code,'events',{...event,type:event.kind==='evidence'?'page-evidence':event.kind==='choice'?'story-choice':'bonus'});return json({correct:false,flow:current});}
     const saved=await store.setJSON(actionsPrefix+String(current.sequence).padStart(3,'0'),event,{onlyIfNew:true});if(!saved.modified)error(409,'Keputusan sudah disimpan. Semak giliran terkini.');
     // The immutable action itself is also the authoritative achievement record.
     return json({correct:event.correct!==false,advanced:true,flow:flowFor(await entries(actionsPrefix,30))});
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
   if(b.action==='book-edit'){
     if(!Number.isInteger(b.page)||b.page<0||b.page>4||!Number.isInteger(b.baseRevision)||b.baseRevision<0||b.baseRevision>=200)error(400,'Halaman atau versi buku tidak sah.');
     const members=await entries(`room/${code}/members/`,80),reader=room.mode==='kendiri'?member:members.slice().sort((a,b)=>roleOrder.indexOf(a.role)-roleOrder.indexOf(b.role))[b.page%4];
     if(reader?.id!==member.id)error(403,'Penyumbang halaman ini sahaja boleh menyimpan. Bincang bersama dahulu.');
     const title=clean(b.title,70),pageTitle=clean(b.pageTitle,70),text=clean(b.text,450);
     if(!title||!pageTitle||!text||b.title.length>70||b.pageTitle.length>70||b.text.length>450)error(400,'Isi tajuk dan ayat dalam had aksara.');
     const before=await bookEditFor31(member.id);
     if((before?.revision||0)!==b.baseRevision)error(409,'Buku telah dikemas kini oleh ahli lain. Salin ayat kamu, kembali ke buku, kemudian buka semula ruang suntingan.');
     const bookEdit={title,pages:before?.pages?.slice()||Array.from({length:5},(_,i)=>globalThis.JoranStory.lessonText(room.story,i,room.lessonVersion)),pageTitles:before?.pageTitles?.slice()||Array.from({length:5},(_,i)=>globalThis.JoranStory.lessonMake(room.story,i,room.lessonVersion).title),revision:b.baseRevision+1,memberId:member.id,at:now()};
     bookEdit.pages[b.page]=text;bookEdit.pageTitles[b.page]=pageTitle;
     const saved=await store.setJSON(`room/${code}/book-edits/${room.mode==='kendiri'?member.id:'group'}/${String(bookEdit.revision).padStart(4,'0')}`,bookEdit,{onlyIfNew:true});
     if(!saved.modified)error(409,'Ahli lain baru menyimpan buku. Salin ayat kamu dan buka semula ruang suntingan.');
     return json({ok:true,bookEdit});
   }
   if(b.action==='draft'){
     const d=b.draft;if(!d||typeof d.title!=='string'||!d.title.trim()||d.title.length>70||!Array.isArray(d.pages)||d.pages.length!==5||!d.pages.every(t=>typeof t==='string'&&t.trim()&&t.length<=450))error(400,'Lengkapkan tajuk dan lima muka surat dahulu.');
     await append(code,'drafts',{memberId:member.id,name:member.name,role:member.role,story:room.story,draft:{title:d.title,group:room.name,branch:d.branch===1?1:0,pages:d.pages,choices:Array.isArray(d.choices)&&d.choices.length===5&&d.choices.every(x=>[0,1,2].includes(x))?d.choices:[]}});return json({ok:true});
   }
   error(400,'Tindakan tidak dikenali.');
 }catch(e){return json({error:e.status?e.message:'Perkhidmatan bilik belum dapat menyimpan atau membaca rekod. Guru perlu menyemak fungsi bilik pada laman yang diterbitkan.',...(e.status?{}:{code:'ROOM_STORAGE_UNAVAILABLE'})},e.status||503);}};
}
