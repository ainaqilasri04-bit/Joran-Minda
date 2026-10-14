import {createHash} from 'node:crypto';
const clean=(v,n=600)=>typeof v==='string'?v.trim().slice(0,n):'';
const fail=(status,message)=>{const e=Error(message);e.status=status;throw e;};
export function readingPages(records,id,story){return [...new Set(records.filter(r=>r.memberId===id&&r.story===story&&r.text===globalThis.JoranStory.lessonText(story,r.page)).map(r=>r.page))];}
export async function pupilAudioAction({b,user,room,store,get,entries,now}){
 if(!b.action.startsWith('pupil-audio-'))return null;
 const prefix=`room/${room.code}/`,members=await entries(prefix+'members/',80),self=members.find(m=>m.id===user.id),leader=self?.role===room.leaderRole&&room.mode!=='kendiri'&&room.lessonVersion>=26&&room.lessonVersion<29;
 const canAccess=id=>user.kind==='teacher'||id===user.id||leader;
 if(b.action==='pupil-audio-list'){
  const records=await entries(prefix+'pupil-meta/',Number.MAX_SAFE_INTEGER);
  return {records:records.filter(r=>user.kind==='teacher'||room.mode!=='kendiri'||r.memberId===user.id)};
 }
 if(b.action==='pupil-audio-save'){
  const r=b.record,m=members.find(m=>m.id===r?.memberId);
  if(user.kind!=='student'||!m||!canAccess(m.id))fail(403,'Hanya murid sendiri atau ketua kumpulan boleh menyimpan bacaan ini.');
  if(!r||!Number.isInteger(r.page)||r.page<0||r.page>4||r.story!==room.story||r.text!==globalThis.JoranStory.lessonText(room.story,r.page)||typeof r.audio!=='string'||r.audio.length>3500000||!/^data:audio\/(webm|mp4|mpeg|wav|ogg|x-wav)(;[^,]*)?;base64,[A-Za-z0-9+/=]+$/.test(r.audio)||!Number.isFinite(r.duration)||r.duration<0||r.duration>125||!/^[a-f0-9-]{36}$/.test(r.id))fail(400,'Rakaman tidak sah. Gunakan rakaman satu halaman, maksimum 2 minit dan 2.5 MB.');
  if(room.lessonVersion>=28&&room.mode!=='kendiri'){const order=['pembaca','pencari','pencatat','pemancing'],assigned=members.slice().sort((a,b)=>order.indexOf(a.role)-order.indexOf(b.role))[r.page%4];if(assigned?.id!==m.id)fail(403,'Halaman ini mempunyai pembaca lain. Rakam halaman yang ditetapkan untuk kamu.');}
  const existing=await get(prefix+'pupil-meta/'+r.id),digest=createHash('sha256').update(r.audio).digest('hex');
  if(existing){if(existing.memberId!==m.id||existing.digest!==digest)fail(409,'Pengenal rakaman telah digunakan.');return {ok:true};}
  const record={id:r.id,memberId:m.id,name:m.name,kelas:m.kelas,story:room.story,page:r.page,text:r.text,duration:r.duration,mime:clean(r.mime,80),at:now(),digest,submittedBy:user.id};
  await store.setJSON(prefix+'pupil-voice/'+r.id,{...record,audio:r.audio},{onlyIfNew:true});
  const verified=await get(prefix+'pupil-voice/'+r.id);if(verified?.audio!==r.audio||verified?.memberId!==m.id)fail(409,'Rakaman belum dapat disahkan. Cuba hantar semula.');
  await store.setJSON(prefix+'pupil-meta/'+r.id,record,{onlyIfNew:true});return {ok:true};
 }
 const id=clean(b.id,50);if(!/^[a-f0-9-]{36}$/.test(id))fail(400,'Rakaman tidak sah.');
 const record=await get(prefix+'pupil-meta/'+id);if(!record||!canAccess(record.memberId))fail(403,'Rakaman ini tidak boleh dibuka daripada akaun ini.');
 if(b.action==='pupil-audio-read')return {record:await get(prefix+'pupil-voice/'+id)};
 if(b.action==='pupil-audio-grade'){
  if(user.kind!=='teacher')fail(403,'Hanya Guru boleh menilai bacaan.');
  const levels=['Perlu bimbingan','Memuaskan','Baik'],grade={intonation:b.grade?.intonation,pause:b.grade?.pause,pronunciation:b.grade?.pronunciation,note:clean(b.grade?.note,300),at:now()};
  if(![grade.intonation,grade.pause,grade.pronunciation].every(v=>levels.includes(v)))fail(400,'Lengkapkan penilaian intonasi, jeda dan sebutan.');
  await store.setJSON(prefix+'pupil-meta/'+id,{...record,grade});return {ok:true};
 }
 fail(400,'Tindakan rakaman tidak sah.');
}
