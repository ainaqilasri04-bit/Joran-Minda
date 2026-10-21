// V58: remove only the redundant narration under Cari answer choices.
const gameBeforePhone58=gameScreen27;
gameScreen27=function(){
 gameBeforePhone58();const listen=$('#jm-listen');listen.hidden=step===1;
 if(listen.stop30)listen.stop30.hidden=listen.hidden;
 if(listen.hidden)$('#jm-audio-note').hidden=true;
};

// V58: real room links, clear record destination, and truthful delivery status.
const hosted58=/^https?:$/.test(location.protocol);
let transferError58='',lastReceipt58=0,reportBusy58=false,voiceRetry58=false;
const style58=document.createElement('style');
style58.textContent=`
#jm19 #jm-teacher-help58{padding:16px;border:2px solid #218681;border-radius:16px;background:#e7f4ec;margin:12px 0}
#jm19 #jm-teacher-help58 p{margin:8px 0;line-height:1.5}
#jm19 #jm-teacher-help58 button{margin:4px 8px 4px 0}
#jm19 #jm-sync58{font-size:14px;line-height:1.3;max-width:100%;white-space:normal;overflow-wrap:anywhere;background:#edf7ed;color:#174d52;border-radius:8px;padding:4px 8px}
#jm19 #jm-sync58[data-state=error]{background:#fff0e8;color:#842d19}
#jm19 #jm-home-code{display:block!important}
#jm19 #jm-entry-destination58{padding:10px;border-left:4px solid #218681;background:#e7f4ec;line-height:1.5}
`;
document.head.append(style58);
const sync58=document.createElement('span');sync58.id='jm-sync58';sync58.setAttribute('role','status');
shell27.querySelector('.jm-head27').append(sync58);
function syncStatus58(){
 sync58.hidden=!profile;
 if(!profile)return;
 if(!roomSession){sync58.dataset.state='local';sync58.textContent='Latihan sendiri · rekod pada peranti ini sahaja';return;}
 const events=pendingEvents.filter(x=>x.session?.code===roomSession.code&&x.session?.token===roomSession.token).length;
 const voices=pupilTakes26.filter(r=>r.roomCode===roomSession.code&&r.memberId===profile.id&&r.synced===false).length;
 sync58.dataset.state=transferError58?'error':events||voices?'pending':'online';
 sync58.textContent='Bilik Guru '+roomSession.code+' · '+(transferError58?'Belum dihantar. Semak Internet.':events||voices?'Menunggu penghantaran '+(events+voices)+' rekod':lastReceipt58?'Rekod dihantar kepada Guru':'Bersambung dengan Guru');
 sync58.title=transferError58;
}
const apiBefore58=api;
api=async function(data,session=roomSession){
 try{
  const result=await apiBefore58(data,session);
  if(session&&session===roomSession&&['event','lesson-save','turn','completion','book-edit','pupil-audio-save'].includes(data.action)){
   transferError58='';lastReceipt58=Date.now();syncStatus58();
  }
  return result;
 }catch(e){
  if(session&&session===roomSession){transferError58=e.message;syncStatus58();}
  throw e;
 }
};
// A failed event for an old room must not block the active pupil's records.
flushEvents=async function(){
 if(eventBusy||!pendingEvents.length){syncStatus58();return;}
 eventBusy=true;
 try{
  const queue=pendingEvents.filter(x=>!roomSession||(x.session?.code===roomSession.code&&x.session?.token===roomSession.token));
  for(const item of queue){
   await api(item.data,item.session);
   transferError58='';lastReceipt58=Date.now();
   const index=pendingEvents.indexOf(item);if(index>=0)pendingEvents.splice(index,1);
   storeJSON('joran-minda-hantar-v7',pendingEvents);
  }
 }catch(e){transferError58=e.message;}
 finally{eventBusy=false;syncStatus58();}
};
async function retryVoice58(){
 if(voiceRetry58||!roomSession||!profile||pupilAudio26.busy()||navigator.onLine===false)return;
 voiceRetry58=true;const session=roomSession;
 try{
  const rows=await pupilAudio26.all();
  for(const r of rows.filter(r=>r.roomCode===session.code&&r.memberId===profile.id&&!r.synced)){
   if(session!==roomSession)break;
   await api({action:'pupil-audio-save',record:r},session);
   r.synced=true;await pupilAudio26.put(r);
   const meta=pupilTakes26.find(x=>x.id===r.id);if(meta)meta.synced=true;
  }
 }catch(e){transferError58=e.message;}
 finally{voiceRetry58=false;syncStatus58();}
}
window.addEventListener('online',()=>{flushEvents();retryVoice58();});
const retryTimer58=setInterval(()=>{if(!document.hidden&&roomSession){flushEvents();retryVoice58();}},15000);
const paintBefore58=paint27;paint27=function(){paintBefore58();syncStatus58();};

// Keep the existing two modes; online pupils enter through a room by default.
const entryDestination58=document.createElement('p');entryDestination58.id='jm-entry-destination58';
$('#jm-entry-form>h3').after(entryDestination58);
const modeBefore58=modeChanged;
modeChanged=function(){
 modeBefore58();
 const online=$('#jm-session-access').value==='room';
 entryDestination58.textContent=online?'Keputusan dan rakaman kamu dihantar kepada Guru dalam bilik ini.':hosted58?'Latihan sendiri: rekod hanya disimpan pada peranti ini. Untuk penilaian Guru, gunakan pautan atau kod bilik Guru.':'Fail ini untuk cuba pada peranti sendiri. Untuk penilaian merentas peranti, buka joranminda.netlify.app dan sertai bilik Guru.';
};
$('#jm-play-device').textContent='Cuba sendiri · rekod pada peranti ini';
$('#jm-session-access').options[0].textContent='Latihan sendiri · rekod pada peranti ini';
$('#jm-session-access').options[1].textContent='Kelas Guru · hantar keputusan dalam talian';
$('#jm-home-code').textContent='Sertai kelas Guru · pautan atau kod';
const openModeBefore58=openMode28;
openMode28=function(kind){
 openModeBefore58(kind);
 if(hosted58){
  const linked=new URL(location.href).searchParams.get('bilik');
  enteringByLink22=!!linked;codeTools21.hidden=false;codeField21.hidden=false;
  $('#jm-session-access').value='room';setEntryKind(kind);
  roomEntry21.querySelector('h3').textContent='Sertai kelas Guru';
  roomEntry21.querySelector('p').textContent='Masukkan kod daripada Guru, kemudian tekan Semak kod. Keputusan kamu dihantar kepada Guru.';
  if(linked){joinCode21.value=linked;lookupRoom21();}
  else if(!verifiedRoom21)roomNotice21('Minta pautan atau kod bilik daripada Guru.');
 }
 modeChanged();
};

const teacherHelp58=document.createElement('section');teacherHelp58.id='jm-teacher-help58';
teacherHelp58.innerHTML='<h3>Rekod murid daripada peranti lain</h3><p>1. Pilih kelas, cerita dan mod. Tekan <strong>Dapatkan pautan murid</strong>.</p><p>2. Tekan <strong>Salin pautan murid</strong> dan berikan pautan itu kepada murid.</p><p>3. Buka <strong>Rekod bilik Guru</strong> untuk menyemak jawapan dan rakaman mereka.</p><p class="jm-small">Pautan utama sahaja membuka latihan sendiri jika murid memilih tanpa kod. Akaun Google tidak menentukan rekod; kod bilik menghubungkan murid dengan Guru. Individu: satu bilik untuk kelas. Kumpulan: satu bilik bagi empat ahli.</p><button type="button" class="jm-primary" id="jm-setup-room58">Sediakan pautan murid</button><button type="button" class="jm-secondary" id="jm-open-records58">Lihat rekod bilik Guru</button><p id="jm-online-help58" role="status"></p>';
$('[data-panel=teacher]').prepend(teacherHelp58);
$('#jm-setup-room58').onclick=()=>{const form=$('#jm-create-room');for(let p=form.parentElement;p&&p!==root;p=p.parentElement)if(p.tagName==='DETAILS')p.open=true;form.scrollIntoView({block:'start'});$('#jm-teacher-class').focus({preventScroll:true});};
$('#jm-open-records58').onclick=async()=>{teacherRoom();if(!teacherSession){$('#jm-online-help58').textContent='Sediakan pautan dahulu, atau pulihkan bilik dengan kod dan kunci Guru.';return;}$('#jm-report-source').value='online';updateReportHelp21();await refreshReport();$('#jm-report-list').scrollIntoView({block:'start'});};
$('#jm-report-source').options[0].textContent='Peranti ini sahaja · latihan sendiri';
$('#jm-report-source').options[1].textContent='Rekod bilik Guru · semua peranti murid';
const teacherRoomBefore58=teacherRoom;
teacherRoom=function(){
 teacherRoomBefore58();
 $('#jm-open-records58').disabled=!teacherSession;
 if(!hosted58){$('#jm-online-help58').textContent='Buka laman Netlify untuk mencipta bilik dan melihat rekod dalam talian.';return;}
 $('#jm-online-help58').textContent=teacherSession?'Bilik aktif: '+teacherSession.code+'. Kongsi pautan murid bagi bilik ini.':'Belum ada bilik aktif pada pelayar ini. Sediakan pautan murid atau pulihkan akses Guru.';
};
const refreshBefore58=refreshReport;
refreshReport=async function(){
 if(reportBusy58)return;
 reportBusy58=true;
 try{await refreshBefore58();updateReportHelp21();}
 finally{reportBusy58=false;}
};
$('#jm-refresh-report').onclick=refreshReport;
const showBefore58=showView;
showView=function(v){
 if(v==='teacher'){teacherRoom();if(teacherSession&&hosted58)$('#jm-report-source').value='online';}
 showBefore58(v);
 if(v==='teacher'){updateReportHelp21();if(teacherSession&&hosted58)refreshReport();}
 syncStatus58();
};
const startBefore58=startStudent;
startStudent=async function(e){transferError58='';lastReceipt58=0;await startBefore58(e);syncStatus58();};
$('#jm-entry-form').onsubmit=startStudent;
modeChanged();
root.dataset.version='58';$('#jm-version').textContent='Joran Minda · Versi 58 · Audio telefon dan rekod bilik Guru';

