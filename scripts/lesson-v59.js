// V59: one-device work is mirrored to a protected class session, with a 60-minute timer.
const deviceStates59=loadJSON('joran-device-sync59',{});
let targetClass59=null,deviceBusy59=false,deviceError59='',entryBusy59=false;
const localState59=()=>!roomSession&&profile?deviceStates59[profile.id]:null;
const css59=document.createElement('style');css59.textContent=`
#jm19 #jm-sync58{display:none!important}
#jm19 #jm-clock59{font-size:18px;font-weight:700;white-space:nowrap;padding:5px 10px;border-radius:10px;background:#fff9e9;color:#214f4b;font-variant-numeric:tabular-nums}
#jm19 #jm-clock59[data-ended=true]{background:#fff0d5;color:#7b3b0a}
#jm19 #jm-device-class59{border:2px solid #218681;border-radius:14px;padding:12px;margin:12px 0;background:#f2f8f1}
#jm19 #jm-device-class59 .jm-row{display:flex;gap:8px;flex-wrap:wrap}
#jm19 #jm-device-class59 input{min-width:0;max-width:100%;flex:1}
#jm19 #jm-send-state59{font-size:14px;line-height:1.4;color:#174f4b}
@media(max-width:600px){#jm19 #jm-clock59{font-size:15px;padding:4px 8px}}
`;document.head.append(css59);sync58.hidden=true;sync58.remove();
const clock59=document.createElement('span');clock59.id='jm-clock59';clock59.setAttribute('aria-label','Baki masa pembelajaran');shell27.querySelector('.jm-head27').append(clock59);
function clockTick59(){
 clock59.hidden=!profile;if(!profile)return;
 const key='joran-clock59:'+profile.id;let saved=loadJSON(key,null);
 if(!saved){saved={start:Date.now(),end:0};storeJSON(key,saved);}
 const complete=allProgress23().length>0&&allProgress23().every(p=>p.achievement?.complete&&(!enabled24()||lesson24(p.id).complete));
 if(complete&&!saved.end){saved.end=Date.now();storeJSON(key,saved);}
 const seconds=Math.max(0,3600-Math.floor(((saved.end||Date.now())-saved.start)/1000));
 clock59.textContent=(saved.end?'Selesai · ':seconds?'Baki ':'Masa tamat · ')+String(Math.floor(seconds/60)).padStart(2,'0')+':'+String(seconds%60).padStart(2,'0');
 clock59.dataset.ended=String(!seconds);clock59.title='Sesi PdP 60 minit. Masa terus berjalan semasa halaman ditutup. Apabila tamat, jawapan dan rakaman kekal disimpan; rujuk Guru.';
}
setInterval(clockTick59,1000);
const paintBefore59=paint27;paint27=function(){paintBefore59();clockTick59();};

const classBox59=document.createElement('section');classBox59.id='jm-device-class59';
classBox59.innerHTML='<label for="jm-class-code59"><strong>Kelas Guru</strong></label><div class="jm-row"><input id="jm-class-code59" class="jm-input" inputmode="numeric" maxlength="14" placeholder="Kod kelas daripada Guru"><button type="button" id="jm-check-class59" class="jm-secondary">Semak kelas</button></div><p id="jm-class-status59" role="status">Buka pautan kelas daripada Guru supaya keputusan kamu dihantar kepada Guru.</p>';
entryDestination58.after(classBox59);
const linkedClass59=new URL(location.href).searchParams.get('kelas');
$('#jm-class-code59').value=linkedClass59||teacherSession?.code||'';
const code59=()=>$('#jm-class-code59').value.replace(/[\s-]/g,'').toUpperCase();
async function checkClass59(){
 const code=code59();targetClass59=null;
 if(!code){$('#jm-class-status59').textContent='Masukkan kod kelas atau buka pautan kelas daripada Guru.';return false;}
 $('#jm-check-class59').disabled=true;
 try{
  const result=await api({action:'room-info',code},null);targetClass59=result.room;
  storeJSON('joran-class59:'+code,targetClass59);
 }catch(e){
  const cached=loadJSON('joran-class59:'+code,null);
  if(cached&&cached.expires>Date.now()&&(navigator.onLine===false||e.status===undefined))targetClass59=cached;
  else{$('#jm-class-status59').textContent=e.message;return false;}
 }finally{$('#jm-check-class59').disabled=false;}
 $('#jm-student-class').value=targetClass59.kelas;$('#jm-entry-story').value=targetClass59.story;
 $('#jm-class-status59').textContent='Kelas '+targetClass59.kelas+' · '+targetClass59.name+'. Keputusan dan rakaman dihantar kepada Guru.';
 return true;
}
$('#jm-check-class59').onclick=checkClass59;
$('#jm-class-code59').oninput=()=>{targetClass59=null;$('#jm-class-status59').textContent='Tekan Semak kelas.';};
const modeBefore59=modeChanged;modeChanged=function(){
 modeBefore59();const device=$('#jm-session-access').value==='device';classBox59.hidden=!device||!hosted58;
 entryDestination58.textContent=device?(hosted58?'Main pada satu peranti. Keputusan dihantar kepada Guru melalui pautan kelas.':'Cuba pada peranti ini. Untuk menghantar keputusan kepada Guru, buka pautan kelas di Netlify.'):'Main bersama menggunakan peranti masing-masing. Sertai bilik Guru melalui pautan atau kod.';
 $('#jm-entry-status').textContent='Tempoh pembelajaran: 60 minit.';
 $('#jm-session-access').options[0].textContent='Main pada satu peranti';$('#jm-session-access').options[1].textContent='Main bersama dalam talian';
};
// V58's default-room behaviour is replaced by the two clearly separated choices.
openMode28=function(kind){
 openModeBefore58(kind);
 const linked=new URL(location.href).searchParams.get('bilik');
 if(linked){$('#jm-session-access').value='room';setEntryKind(kind);joinCode21.value=linked;lookupRoom21();}
 else{$('#jm-session-access').value='device';setEntryKind(kind);if(hosted58&&code59())checkClass59();}
 modeChanged();
};
$('#jm-play-device').textContent='Main pada satu peranti';
const saveDevice59=()=>storeJSON('joran-device-sync59',deviceStates59);
async function deviceRequest59(body,token){
 const ctrl=new AbortController(),timeout=setTimeout(()=>ctrl.abort(),20000);
 try{
  const response=await fetch('/.netlify/functions/device',{method:'POST',headers:{'Content-Type':'application/json',...(token?{Authorization:'Bearer '+token}:{})},body:JSON.stringify(body),signal:ctrl.signal});
  if(!(response.headers.get('content-type')||'').includes('application/json'))throw Error('Penerbitan V59 belum lengkap. Maklumkan kepada Guru.');
  const result=await response.json();if(!response.ok)throw Object.assign(Error(result.error||'Rekod belum dihantar.'),{status:response.status});return result;
 }finally{clearTimeout(timeout);}
}
const startBefore59=startStudent;
startStudent=async function(e){
 e.preventDefault();if(entryBusy59)return;entryBusy59=true;
 try{
  const device=$('#jm-session-access').value==='device';
  if(device&&hosted58&&(!targetClass59||targetClass59.code!==code59())&&!await checkClass59())return;
  if(device&&targetClass59){$('#jm-student-class').value=targetClass59.kelas;$('#jm-entry-story').value=targetClass59.story;}
  await startBefore59(e);if(!profile)return;
  if(device&&hosted58&&targetClass59&&!roomSession){
   const key=Array.from(crypto.getRandomValues(new Uint8Array(32)),x=>x.toString(16).padStart(2,'0')).join('');
   deviceStates59[profile.id]={id:newId(),key,code:targetClass59.code,story:storyKey,mode:isSolo()?'kendiri':'kumpulan',members:readingMembers26().map(m=>({id:m.id,name:m.name,role:m.role})),group:bookState().group,ack:{},audioAck:{},users:null,received:0};
   if(!saveDevice59())deviceError59='Simpanan pelayar gagal. Biarkan halaman terbuka dan maklumkan kepada Guru.';
   else syncDevices59();
  }
  clockTick59();
 }finally{entryBusy59=false;}
};$('#jm-entry-form').onsubmit=startStudent;

// Build resumable delivery commands from the saved learning events. Scores are
// recalculated by the existing server rules, rather than trusting client totals.
function deliveryPlan59(state){
 const runs=state.members.map(m=>localRuns.find(r=>r.id===m.id)).filter(Boolean);if(!runs.length)return[];
 const ms=state.members,actor=i=>ms[((i||0)%ms.length+ms.length)%ms.length].id;
 const lesson=runs[0].events.filter(e=>e.type?.startsWith('lesson-')&&e.type!=='lesson-grade');
 const lessonCmd=e=>({key:e.id,member:e.subjectId||actor(e.type==='lesson-read'?e.page:e.index),body:{...e,action:'lesson-save',id:e.id}});
 const first=lesson.filter(e=>['lesson-puzzle','lesson-induction','lesson-read','lesson-check','lesson-values'].includes(e.type)).map(lessonCmd);
 const core=new Map();for(const run of runs)for(const e of run.events){
  const position={read:0,'page-evidence':1,note:2,'story-choice':3}[e.type];
  const sequence=e.type==='bonus'?21:e.type==='note'&&e.round==='bonus'?20:position!==undefined&&Number.isInteger(e.page)?e.page*4+position:null;
  if(sequence===null||sequence<0||sequence>21||core.has(sequence))continue;
  const kind=sequence===20?'bonus-note':sequence===21?'bonus':['read','evidence','note','choice'][sequence%4];
  const member=state.mode==='kendiri'?actor(0):sequence<20?actor(sequence%4+Math.floor(sequence/4)):ms.find(m=>m.role===(sequence===20?'pencatat':'pemancing')).id;
  core.set(sequence,{key:'turn:'+sequence,member,body:{action:'turn',sequence,kind,choice:e.choice,text:e.text}});
 }
 const later=lesson.filter(e=>!['lesson-puzzle','lesson-induction','lesson-read','lesson-check','lesson-values'].includes(e.type)).map(lessonCmd);
 const ending=runs[0].events.filter(e=>['review-page','reflection'].includes(e.type)).map(e=>({key:e.id,member:actor(e.type==='review-page'?e.page:0),body:{action:'completion',type:e.type,page:e.page,text:e.text}}));
 return [...first,...[...core.values()].sort((a,b)=>a.body.sequence-b.body.sequence),...later,...ending];
}
async function syncDevices59(){
 if(deviceBusy59||!hosted58||navigator.onLine===false)return;deviceBusy59=true;
 try{
  for(const state of Object.values(deviceStates59)){
   if(state.disabled)continue;
   try{
   const plan=deliveryPlan59(state);if(!state.users){
    const result=await deviceRequest59({action:'begin',deviceId:state.id,key:state.key,code:state.code,members:state.members,mode:state.mode,group:state.group});
    state.users=result.users;saveDevice59();
   }
   const send=(member,body)=>deviceRequest59({...body,deviceId:state.id,code:state.code},state.users.find(u=>u.id===member)?.token);
   const takes=(await pupilAudio26.all()).filter(r=>state.members.some(m=>m.id===r.memberId)&&r.story===state.story).sort((a,b)=>(a.at||0)-(b.at||0));
   for(const r of takes){if(state.audioAck[r.id])continue;await send(r.memberId,{action:'pupil-audio-save',record:r,deliveryId:r.id});state.audioAck[r.id]=true;state.received=Date.now();saveDevice59();}
   for(const item of plan){
    if(state.ack[item.key])continue;
    await send(item.member,{...item.body,deliveryId:item.key});state.ack[item.key]=true;state.received=Date.now();saveDevice59();
   }
   const run=localRuns.find(r=>r.id===state.members[0].id),edit=run?.bookEdit31;
   if(edit&&state.bookAck!==JSON.stringify(edit)){
    let remote=(await send(state.members[0].id,{action:'state'})).bookEdit;
    for(let page=0;page<5;page++)if(!remote||remote.title!==edit.title||remote.pages[page]!==edit.pages[page]||remote.pageTitles[page]!==edit.pageTitles[page]){
     const response=await send(state.members[page%state.members.length].id,{action:'book-edit',baseRevision:remote?.revision||0,page,title:edit.title,pageTitle:edit.pageTitles[page],text:edit.pages[page]});remote=response.bookEdit;
    }
    state.bookAck=JSON.stringify(edit);saveDevice59();
   }
   state.error='';
   }catch(e){state.error=e.message;if(e.status===410)state.disabled=true;saveDevice59();}
  }
  deviceError59=localState59()?.error||'';
 }catch(e){deviceError59=e.message;}
 finally{deviceBusy59=false;renderSendState59();}
}
const sendState59=document.createElement('p');sendState59.id='jm-send-state59';sendState59.setAttribute('role','status');$('#jm-entry-status').after(sendState59);
function renderSendState59(){
 const s=localState59();sendState59.hidden=!s;
 if(s)sendState59.textContent=deviceError59?'Jawapan disimpan pada peranti. Belum dihantar: '+deviceError59:deliveryPlan59(s).some(c=>!s.ack[c.key])?'Jawapan disimpan. Menunggu penghantaran kepada Guru.':s.received?'Rekod telah dihantar kepada Guru.':'Sedang menyambungkan rekod dengan Guru.';
 const status=$('#jm-device-send-status59');if(status)status.textContent=sendState59.textContent;
}
const persistBefore59=persistSession23;let sendTimer59;
persistSession23=function(){persistBefore59();if(localState59()){clearTimeout(sendTimer59);sendTimer59=setTimeout(syncDevices59,700);}};
window.addEventListener('online',syncDevices59);setInterval(syncDevices59,10000);
const finishBefore59=renderFinish23;renderFinish23=function(){finishBefore59();if(!localState59())return;let status=$('#jm-device-send-status59');if(!status){status=document.createElement('p');status.id='jm-device-send-status59';status.setAttribute('role','status');finishBox23.append(status);}renderSendState59();};

// Teacher report and assessment keep their existing tables and delete controls.
const deviceMemberMap59=new Map(),deviceAudioMap59=new Map();
const apiBefore59=api;
api=async function(data,session=roomSession){
 const teacher=session?.token&&session?.token===teacherSession?.token&&session?.code===teacherSession?.code;
 if(!teacher)return apiBefore59(data,session);
 const call=(body,id)=>deviceRequest59({...body,code:session.code,...(id?{deviceId:id}:{})},session.token);
 if(data.action==='report'){
  const base=await apiBefore59(data,session),extra=await call({action:'teacher-report'});
  deviceMemberMap59.clear();for(const r of [...extra.records,...extra.archivedRecords])deviceMemberMap59.set(r.id,r.deviceSessionId);
  return {...base,records:[...base.records,...extra.records],archivedRecords:[...(base.archivedRecords||[]),...extra.archivedRecords]};
 }
 if(data.action==='pupil-audio-list'){
  const base=await apiBefore59(data,session),extra=await call({action:'teacher-audio-list'});
  deviceAudioMap59.clear();for(const r of extra.records)deviceAudioMap59.set(r.id,r.deviceSessionId);
  return {records:[...(base.records||[]),...extra.records]};
 }
 if(['report-hide','report-purge'].includes(data.action)){
  const groups=new Map();for(const id of data.ids||[]){const key=deviceMemberMap59.get(id)||'';if(!groups.has(key))groups.set(key,[]);groups.get(key).push(id);}
  for(const [key,ids]of groups)if(key)await call({...data,ids},key);else await apiBefore59({...data,ids},session);
  return {ok:true};
 }
 const id=data.action.startsWith('pupil-audio-')?deviceAudioMap59.get(data.id):deviceMemberMap59.get(data.memberId);
 return id?call(data,id):apiBefore59(data,session);
};
teacherHelp58.innerHTML='<h3>Keputusan semua murid</h3><p>1. Sediakan kelas dan tekan <strong>Dapatkan pautan murid</strong>.</p><p>2. Kongsi <strong>Pautan satu peranti</strong> untuk individu atau kumpulan yang berkongsi satu peranti. Kongsi <strong>Pautan bersama dalam talian</strong> jika ahli menggunakan peranti masing-masing.</p><p>3. Pilih <strong>Rekod kelas Guru</strong> dan tekan <strong>Muat semula rekod</strong>. Kedua-dua cara bermain disenaraikan mengikut individu dan kumpulan.</p><p>Tempoh PdP: 60 minit. Simpan kunci Guru untuk membuka rekod pada peranti lain.</p>';
// V58 uses these nodes in its existing event callbacks; keep them reachable.
const hiddenHelp59=document.createElement('div');hiddenHelp59.hidden=true;hiddenHelp59.innerHTML='<button id="jm-open-records58"></button><p id="jm-online-help58"></p>';teacherHelp58.append(hiddenHelp59);
$('#jm-report-source').options[1].textContent='Rekod kelas Guru · semua cara bermain';
const copyDevice59=document.createElement('button');copyDevice59.type='button';copyDevice59.className='jm-primary';copyDevice59.id='jm-copy-device-link59';copyDevice59.textContent='Salin pautan satu peranti';$('#jm-copy-room-link').before(copyDevice59);
const deviceLink59=document.createElement('input');deviceLink59.id='jm-device-link59';deviceLink59.className='jm-input';deviceLink59.readOnly=true;deviceLink59.setAttribute('aria-label','Pautan satu peranti untuk murid');copyStatus21.before(deviceLink59);
const teacherRoomBefore59=teacherRoom;teacherRoom=function(){teacherRoomBefore59();deviceLink59.hidden=!teacherSession;if(teacherSession){const link=new URL(location.href);link.search='';link.hash='';link.searchParams.set('kelas',teacherSession.code);deviceLink59.value=link.href;}};
$('#jm-copy-room-link').textContent='Salin pautan bersama dalam talian';
copyDevice59.onclick=async()=>{
 teacherRoom();if(!teacherSession)return;
 try{await navigator.clipboard.writeText(deviceLink59.value);copyStatus21.textContent='Pautan satu peranti disalin. Keputusan dihantar kepada Guru.';}catch{deviceLink59.focus();deviceLink59.select();copyStatus21.textContent='Salin pautan satu peranti yang dipilih dan berikan kepada murid.';}
};
root.dataset.version='59';$('#jm-version').textContent='Joran Minda · Versi 59 · PdP 60 minit dan rekod kelas';
modeChanged();clockTick59();
if(linkedClass59&&hosted58)queueMicrotask(()=>{$('#jm-session-access').value='device';setEntryKind('solo');showView('entry');checkClass59();});
