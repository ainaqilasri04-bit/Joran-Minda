// V60: three explicit entry routes; teacher settings are authoritative.
let entryAccess60='local',accessBusy60=false,blockedCode60='',accessProbe60=false;
const teacherRooms60=new Map();
const entryAccessSelect60=$('#jm-session-access');
entryAccessSelect60.replaceChildren(new Option('1. Main tanpa kod','local'),new Option('2. Kelas guru: satu peranti','device'),new Option('3. Kelas guru: peranti berasingan','room'));
entryAccessSelect60.closest('label').firstChild.textContent='Bagaimana kamu mahu bermain?';
const entrySummary60=makeBox23('p','jm-entry-summary60','');entryDestination58.after(entrySummary60);entrySummary60.setAttribute('role','status');
const css60=document.createElement('style');css60.textContent=`
#jm19 #jm-entry-summary60:empty{display:none}
#jm19 #jm-entry-summary60{padding:12px;border:2px solid #29786b;border-radius:12px;background:#f1f7ee;font-size:18px;line-height:1.5}
#jm19 #jm-session-access{height:auto;min-height:52px;max-width:100%;font-size:17px}
#jm19 #jm-room-access60{display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin:16px 0;padding:12px;background:#eff6ef;border:1px solid #aac8b7;border-radius:12px}
#jm19 #jm-room-state60{font-weight:700;flex:1 1 200px}
#jm19 #jm-toggle-room60{min-height:48px;background:#a83123;color:white;border:0;border-radius:10px;padding:12px 18px;font:inherit;font-weight:700;cursor:pointer}
#jm19 #jm-toggle-room60[data-closed=true]{background:#236b54}
#jm19 #jm-review-bar52{flex-wrap:wrap;max-width:100%;min-width:0}
#jm19 #jm-shell27 #jm-edit-open31{display:block;min-height:48px;max-width:100%;white-space:normal;line-height:1.35;touch-action:manipulation}
#jm19 #jm-book-editor31{box-sizing:border-box;width:min(720px,calc(100vw - 24px));max-height:calc(100dvh - 24px);overflow:auto}
#jm19 #jm-room-paused60{width:min(480px,calc(100vw - 24px));box-sizing:border-box;max-height:90dvh;overflow:auto;border:2px solid #286b61;border-radius:18px;padding:22px;color:#163b35}
#jm19 #jm-room-paused60::backdrop{background:#102d42a3}
#jm19 #jm-room-paused60 button{min-height:48px;margin:6px 4px}
@media(max-width:600px){#jm19 #jm-shell27 #jm-edit-open31{width:100%;font-size:17px;padding:12px}#jm19 #jm-review-bar52{width:100%;margin:6px 0}#jm19 #jm-book-editor31{padding:14px}#jm19 #jm-book-editor31 footer{position:sticky;bottom:-14px;gap:8px}#jm19 #jm-book-editor31 footer button{min-height:48px;flex:1 1 140px;font-size:16px}#jm19 #jm-book-editor31 input,#jm19 #jm-book-editor31 textarea{font-size:18px}}
`;document.head.append(css60);
// Keep the edit action above the instructions even when a phone header scrolls.
$('.jm-location27').prepend(reviewBar52);
const entryRoom60=()=>entryAccess60==='device'?targetClass59:entryAccess60==='room'?verifiedRoom21?.room:null;
const linkedRoom60=()=>roomSession?.code?{code:roomSession.code,story:roomData?.room.story||profile?.story}:localState59()?{code:localState59().code,story:localState59().story}:null;
const kind60=room=>room?.mode==='kendiri'?'solo':'group';
const modeName60=mode=>mode==='kendiri'?'Individu':'Berkumpulan · 4 ahli';
function entrySettings60(){
 const room=entryRoom60(),kind=room?kind60(room):root.dataset.entryMode||'solo';
 entryAccessSelect60.value=entryAccess60;entryAccessSelect60.closest('label').hidden=false;
 classBox59.hidden=entryAccess60!=='device';roomEntry21.hidden=entryAccess60!=='room';
 $('.jm-mode-cards').hidden=entryAccess60!=='local';
 $('#jm-entry-story').disabled=entryAccess60!=='local';$('#jm-story-field').hidden=entryAccess60!=='local';
 $('#jm-student-class').readOnly=entryAccess60!=='local';
 $('#jm-enter').disabled=accessBusy60||(entryAccess60!=='local'&&!room);
 entryDestination58.textContent=entryAccess60==='local'?'Pilih individu atau kumpulan. Tidak perlu kod guru. Keputusan disimpan di sini sahaja. Guru boleh menyemaknya menggunakan peranti dan pelayar yang sama.':entryAccess60==='device'?'Gunakan pautan guru. Seorang murid menggunakan satu komputer, tablet atau telefon. Jika berkumpulan, empat ahli berkongsi peranti itu. Keputusan dihantar kepada guru.':'Gunakan pautan guru. Setiap ahli masuk dengan nama sendiri melalui komputer, tablet atau telefon yang berasingan. Semua ahli menyertai bilik yang sama. Keputusan dihantar kepada guru.';
 entrySummary60.textContent=room?'Ditetapkan oleh Guru: '+modeName60(room.mode)+' · '+stories[room.story].title+' · '+room.kelas:'';
 if(room){$('#jm-entry-story').value=room.story;$('#jm-student-class').value=room.kelas;}
 $('#jm-enter').textContent=entryAccess60==='local'?'Mula latihan →':'Mula aktiviti kelas →';
 $('#jm-entry-status').textContent='Tempoh PdP: 60 minit.';
 $('.jm-entry-intro p').textContent=kind==='solo'?'Baca, cari dan nilai. Lengkapkan aktiviti dengan nama sendiri.':'Empat ahli berbincang bersama. Ahli yang namanya diserlahkan menekan butang.';
 $('#jm-play-device').textContent='Main tanpa kod';
 if(entryAccess60==='room'){codeTools21.hidden=false;codeField21.hidden=false;roomEntry21.querySelector('h3').textContent='Kelas guru: peranti berasingan';roomEntry21.querySelector('p').textContent='Masukkan kod Guru dan tekan Semak kod. Mod dan buku cerita ditetapkan oleh Guru.';}
}
modeChanged=function(){modeBefore58();entrySettings60();};
setEntryKind=function(kind){
 const room=entryRoom60();if(room)kind=kind60(room);
 $('#jm-play-mode').value=kind==='solo'?(entryAccess60==='room'?'home':'solo'):(entryAccess60==='room'?'online':'local');
 modeChanged();
};
function setAccess60(value){
 entryAccess60=['local','device','room'].includes(value)?value:'local';
 targetClass59=null;verifiedRoom21=null;lookupTicket21++;
 $('#jm-student-class').value='';$('#jm-class-status59').textContent='Buka pautan kelas atau masukkan kod daripada Guru.';
 roomInfo21.hidden=true;setEntryKind(root.dataset.entryMode||'solo');
}
entryAccessSelect60.onchange=()=>setAccess60(entryAccessSelect60.value);
$('#jm-play-device').onclick=()=>setAccess60('local');
$$('[data-play-kind]').forEach(b=>b.onclick=()=>{if(entryAccess60==='local')setEntryKind(b.dataset.playKind);});

// All code lookups use live server state: a cached room cannot reopen a closed class.
let lookup60=0;
async function resolveEntry60(code){
 const ticket=++lookup60;accessBusy60=true;entrySettings60();
 try{
  const result=await api({action:'room-info',code},null);if(ticket!==lookup60)return false;
  const room=result.room;
  if(room.accessMode==='device'||room.accessMode==='room')entryAccess60=room.accessMode;
  if(entryAccess60==='device'){targetClass59=room;$('#jm-class-code59').value=room.code;$('#jm-class-status59').textContent='Kelas disahkan. Keputusan dihantar kepada Guru.';}
  else{verifiedRoom21=result;joinCode21.value=room.code;roomInfo21.textContent=room.name+' · '+room.kelas;roomInfo21.hidden=false;roomNotice21('Bilik disahkan. Isi nama dan sertai aktiviti.');}
  setEntryKind(kind60(room));
  if(entryAccess60==='room'){
   for(const option of $('#jm-student-role').options)option.disabled=(result.takenRoles||[]).includes(option.value);
   if($('#jm-student-role').selectedOptions[0]?.disabled)$('#jm-student-role').value='';restoreRoleChoice21();
  }
  return true;
 }catch(e){
  if(ticket===lookup60){targetClass59=null;verifiedRoom21=null;$('#jm-class-status59').textContent=e.message;roomNotice21(e.message,true);}
  return false;
 }finally{if(ticket===lookup60){accessBusy60=false;entrySettings60();}}
}
checkClass59=()=>resolveEntry60(code59());
lookupRoom21=()=>resolveEntry60(normalizeRoomCode21(joinCode21.value));
$('#jm-check-class59').onclick=checkClass59;$('#jm-check-code').onclick=lookupRoom21;
$('#jm-class-code59').oninput=()=>{lookup60++;accessBusy60=false;targetClass59=null;entrySettings60();$('#jm-class-status59').textContent='Tekan Semak kelas.';};
joinCode21.addEventListener('input',()=>{lookup60++;accessBusy60=false;verifiedRoom21=null;entrySettings60();});
openMode28=function(kind){
 const params=new URL(location.href).searchParams;
 entryAccess60=params.has('kelas')?'device':params.has('bilik')?'room':'local';targetClass59=null;verifiedRoom21=null;
 openModeBefore58(kind);setEntryKind(kind);
 if(entryAccess60==='device'){$('#jm-class-code59').value=params.get('kelas');checkClass59();}
 if(entryAccess60==='room'){joinCode21.value=params.get('bilik');lookupRoom21();}
};
$('#jm-home-code').onclick=()=>{
 if(profile){leaveStudent();teamMembers=[];sharedFlow=null;}
 setAccess60('device');showView('entry');$('#jm-class-code59').focus();
};
$('#jm-home-code').textContent='Sertai kelas Guru';
const startBefore60=startStudent;
startStudent=async function(e){
 e.preventDefault();if(accessBusy60)return;
 if(entryAccess60!=='local'){
  if(!hosted58){$('#jm-entry-status').textContent='Buka laman Netlify untuk menyertai kelas Guru.';return;}
  const code=entryAccess60==='device'?code59():normalizeRoomCode21(joinCode21.value);
  if(!await resolveEntry60(code))return;
 }
 setEntryKind(root.dataset.entryMode||'solo');
 if(!$('#jm-entry-form').reportValidity())return;
 await startBefore60(e);lockStory60();if(profile&&linkedRoom60())probeRoom60();
};$('#jm-entry-form').onsubmit=startStudent;

const chooseStoryBefore60=chooseStory;
chooseStory=function(key){const assigned=linkedRoom60()?.story;if(assigned&&key!==assigned)return;return chooseStoryBefore60(key);};
function lockStory60(){
 const assigned=profile&&linkedRoom60()?.story;
 $('#jm-choose').hidden=!!assigned;if(assigned)$('#jm-story-picker').hidden=true;
 $$('[data-story]').forEach(b=>{const disabled=!!assigned&&b.dataset.story!==assigned;if(b.disabled!==disabled)b.disabled=disabled;});
}
const displayBefore60=displayProfile;displayProfile=function(){displayBefore60();lockStory60();};

// Closing a room is a server operation. Signing out is a separate local action.
const accessField60=makeBox23('label','jm-teacher-access-field60','Cara murid menggunakan peranti<select class="jm-input" id="jm-teacher-access60"><option value="device">Satu peranti bagi setiap individu / kumpulan</option><option value="room">Peranti masing-masing dalam talian</option></select>');
$('#jm-teacher-mode').closest('label').before(accessField60);
teacherModeHelp23=function(){
 const group=$('#jm-teacher-mode').value==='kumpulan',remote=$('#jm-teacher-access60').value==='room';
 roomHelp23.textContent=group?(remote?'Satu bilik untuk satu kumpulan empat ahli. Setiap ahli masuk menggunakan peranti sendiri.':'Satu pautan untuk kelas. Setiap kumpulan mengisi empat nama pada satu peranti. Rekod diasingkan mengikut kumpulan.'):'Satu pautan untuk kelas. Setiap murid mengisi nama sendiri. Rekod diasingkan mengikut individu.';
};$('#jm-teacher-access60').onchange=teacherModeHelp23;teacherModeHelp23();
teacherHelp21.textContent='Pilih peranti, mod dan cerita, kemudian tekan Dapatkan pautan murid. Tetapan ini digunakan untuk bilik baharu; bilik sedia ada mengekalkan tetapan asal.';
const roomAccess60=makeBox23('div','jm-room-access60','<span id="jm-room-state60" role="status"></span><button type="button" id="jm-toggle-room60">Tutup bilik</button>');$('#jm-teacher-room-info').after(roomAccess60);
const roomAccessHelp60=makeBox23('p','jm-room-access-help60','Tutup bilik menghentikan akses murid. Rekod sedia ada kekal untuk disemak. Keluar ruang guru hanya menutup paparan guru pada peranti ini.');roomAccess60.after(roomAccessHelp60);
$('#jm-teacher-signout').textContent='Keluar ruang guru';
function rememberTeacher60(room){
 if(!room?.code)return;teacherRooms60.set(room.code,room);
 if(teacherSession?.code===room.code){Object.assign(teacherSession,{mode:room.mode,story:room.story,accessMode:room.accessMode||'either',closed:!!room.closed});storeJSON('joran-minda-guru-v7',teacherSession);rememberRoom23();}
}
const apiBefore60=api;
api=async function(data,session=roomSession){
 const input=data.action==='create'?{...data,accessMode:$('#jm-teacher-access60').value}:data;
 try{
  const result=await apiBefore60(input,session);
  if(result.room&&['create','report','room-access'].includes(data.action)){rememberTeacher60(result.room);if(teacherSession?.code===result.room.code)teacherRoom();}
  return result;
 }catch(e){
  if(session&&roomSession&&session.code===roomSession.code&&session?.token===roomSession?.token&&/Bilik ditutup/.test(e.message))blockRoom60(session.code);
  throw e;
 }
};
const teacherBefore60=teacherRoom;teacherRoom=function(){
 teacherBefore60();const room=teacherRooms60.get(teacherSession?.code)||teacherSession;
 roomAccess60.hidden=!teacherSession;if(!teacherSession)return;
 if(room.mode){$('#jm-teacher-room-info').textContent=(room.name||teacherSession.name)+' · '+(room.kelas||teacherSession.kelas)+' · '+modeName60(room.mode)+' · '+stories[room.story].title;}
 const closed=!!room.closed;$('#jm-room-state60').textContent=closed?'Bilik ditutup — murid tidak boleh masuk atau menghantar jawapan.':'Bilik dibuka — murid boleh masuk.';
 const b=$('#jm-toggle-room60');b.textContent=closed?'Buka semula bilik':'Tutup bilik';b.dataset.closed=String(closed);
 const route=room.accessMode||'either';copyDevice59.hidden=route==='room';deviceLink59.hidden=route==='room';$('#jm-copy-room-link').hidden=route==='device';studentLink21.hidden=route==='device';
 copyDevice59.disabled=closed;$('#jm-copy-room-link').disabled=closed;$('#jm-copy-room-code').disabled=closed;
 copyDevice59.textContent='Salin pautan kelas · satu peranti';$('#jm-copy-room-link').textContent='Salin pautan · peranti masing-masing';
};
$('#jm-toggle-room60').onclick=async()=>{
 if(!teacherSession)return;const b=$('#jm-toggle-room60');b.disabled=true;
 try{const room=teacherRooms60.get(teacherSession.code)||teacherSession;await api({action:'room-access',closed:!room.closed},teacherSession);teacherRoom();teacherNotice21.textContent='Status bilik telah dikemas kini. Rekod murid dikekalkan.';}
 catch(e){teacherNotice21.textContent=e.message;}finally{b.disabled=false;}
};
teacherHelp58.querySelector('h3').textContent='Kelas dan rekod murid';
const teacherParagraphs60=teacherHelp58.querySelectorAll(':scope > p');
['1. Sediakan kelas: pilih peranti, mod individu atau berkumpulan, dan satu cerita.','2. Tekan Dapatkan pautan murid. Kongsi pautan yang dipaparkan; murid tidak perlu menaip kod.','3. Pilih Rekod kelas Guru dan Muat semula rekod. Tutup bilik apabila aktiviti berakhir.','Main tanpa kod menyimpan rekod pada peranti murid sahaja. Simpan kunci Guru untuk membuka rekod kelas pada peranti lain.'].forEach((t,i)=>{if(teacherParagraphs60[i])teacherParagraphs60[i].textContent=t;});

// Active pupils see a clear pause, while their existing work remains stored.
const paused60=makeBox23('dialog','jm-room-paused60','<h2>Bilik ditutup oleh Guru</h2><p>Aktiviti kelas dihentikan. Kerja yang sudah disimpan dikekalkan. Minta Guru membuka bilik semula untuk menyambung.</p><p id="jm-pause-status60" role="status"></p><button type="button" class="jm-primary" id="jm-recheck-room60">Semak semula</button><button type="button" class="jm-secondary" id="jm-pause-home60">Kembali ke menu</button>');root.append(paused60);
paused60.addEventListener('cancel',e=>e.preventDefault());
function blockRoom60(code){blockedCode60=code;stopVoice();if(profile&&view!=='teacher'&&!paused60.open)paused60.showModal();}
async function probeRoom60(){
 const active=linkedRoom60();if(!active||accessProbe60||navigator.onLine===false)return;
 accessProbe60=true;
 try{await api({action:'room-info',code:active.code},null);if(blockedCode60===active.code){blockedCode60='';if(paused60.open)paused60.close();}$('#jm-pause-status60').textContent='';}
 catch(e){if(/Bilik ditutup/.test(e.message))blockRoom60(active.code);$('#jm-pause-status60').textContent=e.message;}
 finally{accessProbe60=false;}
}
$('#jm-recheck-room60').onclick=probeRoom60;
$('#jm-pause-home60').onclick=()=>{paused60.close();blockedCode60='';leaveStudent();showView('home');};
setInterval(()=>{if(profile&&view!=='teacher')probeRoom60();},5000);window.addEventListener('online',probeRoom60);
const paintBefore60=paint27;paint27=function(){paintBefore60();lockStory60();};
function homeArrows61(){
 const button=$('#jm-home-group');
 if(!button.querySelector('[data-play-arrow61]'))button.innerHTML='Mula PdP berkumpulan <span data-play-arrow61 aria-hidden="true">▶</span>';
}
const showBefore60=showView;showView=function(v){if(v==='teacher'&&paused60.open)paused60.close();showBefore60(v);homeArrows61();if(v==='entry')entrySettings60();if(profile&&v!=='teacher'&&linkedRoom60())probeRoom60();};
root.dataset.version='61';$('#jm-version').textContent='Joran Minda · Versi 61 · Pilihan bermain yang jelas';
homeArrows61();
setAccess60('local');teacherRoom();
queueMicrotask(()=>{
 const params=new URL(location.href).searchParams;
 if(params.has('kelas')){entryAccess60='device';$('#jm-class-code59').value=params.get('kelas');setEntryKind('solo');showView('entry');checkClass59();}
 else if(params.has('bilik')){entryAccess60='room';joinCode21.value=params.get('bilik');setEntryKind('solo');showView('entry');lookupRoom21();}
 if(profile&&linkedRoom60())probeRoom60();
});
