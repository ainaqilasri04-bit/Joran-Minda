// V63: one class code for many groups, with a unique four-letter teacher key.
const groupField62=makeBox23('label','jm-group-field62','Kumpulan saya<select id="jm-group62" class="jm-input" aria-describedby="jm-group-help62"><option value="">Pilih kumpulan</option></select><span id="jm-group-help62" class="jm-small">Pilih nombor kumpulan yang diberikan oleh Guru. Empat ahli memilih kumpulan yang sama.</span>');
roomEntry21.append(groupField62);groupField62.hidden=true;
const groupSelect62=$('#jm-group62');let groupClass62='';
const countField62=makeBox23('label','jm-group-count-field62','Bilangan kumpulan<select id="jm-group-count62" class="jm-input"></select>');
accessField60.after(countField62);
$('#jm-group-count62').replaceChildren(...Array.from({length:12},(_,i)=>new Option((i+1)+' kumpulan · '+((i+1)*4)+' murid',String(i+1))));$('#jm-group-count62').value='6';
const css62=document.createElement('style');css62.textContent='#jm19 #jm-group-field62{display:grid;gap:10px;margin-top:14px;padding:14px;border:2px solid #277767;border-radius:12px;background:#fffdf5}#jm19 #jm-group-field62[hidden],#jm19 #jm-group-count-field62[hidden]{display:none}#jm19 #jm-group62,#jm19 #jm-group-count62{min-height:48px;font-size:18px;width:100%}#jm19 #jm-import-access62{min-height:48px;margin:10px 0}';document.head.append(css62);
function showGroups62(data){
 const current=groupClass62===data.room.code?groupSelect62.value:'';groupClass62=data.room.code;
 groupSelect62.replaceChildren(new Option('Pilih kumpulan',''),...(data.groups62||[]).map(g=>new Option(g.name+' · '+g.count+'/4 ahli',g.id)));
 if([...groupSelect62.options].some(o=>o.value===current))groupSelect62.value=current;
}
const settingsBefore62=entrySettings60;
entrySettings60=function(){
 settingsBefore62();const grouped=entryAccess60==='room'&&!!entryRoom60()?.groupCount62;
 groupField62.hidden=!grouped;groupSelect62.required=grouped;groupSelect62.disabled=!grouped;
 if(grouped){$('#jm-enter').disabled=accessBusy60||!groupSelect62.value;entryDestination58.textContent='Masukkan kod kelas. Pilih kumpulan kamu, kemudian isi nama sendiri. Semua ahli kumpulan berbincang bersama melalui peranti masing-masing.';}
};
groupSelect62.onchange=async()=>{if(entryAccess60==='room')await resolveEntry60(normalizeRoomCode21(joinCode21.value));};
teacherModeHelp23=function(){
 const group=$('#jm-teacher-mode').value==='kumpulan',remote=$('#jm-teacher-access60').value==='room';
 countField62.hidden=!(group&&remote);
 roomHelp23.textContent=group?(remote?'Satu kod untuk seluruh kelas. Tentukan bilangan kumpulan. Setiap kumpulan mempunyai empat ahli yang menggunakan peranti masing-masing.':'Satu kod untuk seluruh kelas. Setiap kumpulan berkongsi satu peranti dan mengisi empat nama ahli. Gunakan nama kumpulan yang berbeza.'):'Satu kod untuk seluruh kelas. Setiap murid masuk dengan nama sendiri. Keputusan diasingkan mengikut individu.';
};
$('#jm-teacher-access60').onchange=teacherModeHelp23;$('#jm-teacher-mode').addEventListener('change',teacherModeHelp23);teacherModeHelp23();
$('#jm-teacher-group').closest('label').firstChild.textContent='Nama kelas / sesi (pilihan)';
teacherHelp21.textContent='Pilih mod, cerita dan cara menggunakan peranti. Untuk peranti berasingan, tetapkan bilangan kumpulan. Satu kod boleh digunakan oleh seluruh kelas. Tetapan ini digunakan apabila mencipta kelas baharu.';
const teacherKeys63=loadJSON('joran-teacher-keys63',{});
const apiBefore62=api;
api=async function(data,session=roomSession){
 let input={...data};
 if(data.action==='create'&&data.mode==='kumpulan'&&$('#jm-teacher-access60').value==='room')input.groupCount62=Number($('#jm-group-count62').value);
 if(['room-info','join'].includes(data.action)&&groupSelect62.value&&groupClass62===String(data.code||session?.code||''))input.groupId62=groupSelect62.value;
 if(data.action==='state'&&!roomSession&&view==='entry'&&verifiedRoom21?.room.groupCount62&&groupSelect62.value)input.groupId62=groupSelect62.value;
 const result=await apiBefore62(input,session);
 if(data.action==='room-info')showGroups62(result);
 if(data.action==='create'&&result.teacherKey63){teacherKeys63[result.room.code]=result.teacherKey63;storeJSON('joran-teacher-keys63',teacherKeys63);}
 return result;
};
const teacherBefore62=teacherRoom;
teacherRoom=function(){teacherBefore62();const room=teacherRooms60.get(teacherSession?.code)||teacherSession;if(room?.groupCount62)$('#jm-teacher-room-info').textContent=(room.name||room.kelas)+' · '+room.kelas+' · '+room.groupCount62+' kumpulan · 4 ahli setiap kumpulan · '+stories[room.story].title;};

const keyBox63=makeBox23('section','jm-teacher-key-box63','<label for="jm-teacher-key63"><strong>Kata kunci Guru · 4 huruf</strong></label><div class="jm-row"><input id="jm-teacher-key63" class="jm-input" type="password" readonly aria-label="Kata kunci Guru empat huruf"><button id="jm-reveal-key63" class="jm-secondary" type="button">Lihat kata kunci</button><button id="jm-generate-key63" class="jm-secondary" type="button">Jana kata kunci 4 huruf</button></div><p class="jm-small">Simpan kata kunci ini untuk Guru sahaja. Kongsi kod kelas 6 angka dengan murid.</p><p id="jm-key-status63" role="status"></p>');
$('#jm-teacher-room-info').after(keyBox63);
const keyCss63=document.createElement('style');keyCss63.textContent='#jm19 #jm-teacher-key-box63{margin:14px 0;padding:16px;background:#fff7df;border:2px solid #b58627;border-radius:14px}#jm19 #jm-teacher-key-box63 .jm-row{display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-top:10px}#jm19 #jm-teacher-key63{width:140px;min-height:48px;font-size:26px;letter-spacing:5px;font-weight:bold}#jm19 #jm-teacher-key-box63 button{min-height:48px}';document.head.append(keyCss63);
let visibleClass63='';
const teacherBefore63=teacherRoom;
teacherRoom=function(){
 teacherBefore63();keyBox63.hidden=!teacherSession;if(!teacherSession)return;
 const input=$('#jm-teacher-key63'),key=teacherKeys63[teacherSession.code]||'';
 if(visibleClass63!==teacherSession.code){input.type='password';$('#jm-reveal-key63').textContent='Lihat kata kunci';visibleClass63=teacherSession.code;}
 input.value=key;input.hidden=!key;$('#jm-reveal-key63').hidden=!key;$('#jm-generate-key63').hidden=!!key;
 $('#jm-key-status63').textContent=key?'Kata kunci ini khusus untuk kelas '+teacherSession.code+'.':'Kelas ini belum mempunyai kata kunci empat huruf pada peranti ini. Jana kata kunci untuk kelas ini.';
};
$('#jm-reveal-key63').onclick=()=>{const input=$('#jm-teacher-key63'),show=input.type==='password';input.type=show?'text':'password';$('#jm-reveal-key63').textContent=show?'Sembunyikan kata kunci':'Lihat kata kunci';};
$('#jm-generate-key63').onclick=async()=>{
 if(!teacherSession)return;const session={...teacherSession},button=$('#jm-generate-key63');button.disabled=true;
 try{const result=await api({action:'teacher-key63'},session);teacherKeys63[session.code]=result.teacherKey63;storeJSON('joran-teacher-keys63',teacherKeys63);teacherRoom();$('#jm-key-status63').textContent='Kata kunci baharu telah dijana. Tekan Lihat kata kunci dan simpan empat huruf itu. Kata kunci terdahulu bagi kelas ini tidak lagi digunakan.';}
 catch(e){$('#jm-key-status63').textContent=e.message;}finally{button.disabled=false;}
};

// Four-letter keys are verified by the server, including on another device.
const restoreForm62=$('#jm-restore-room'),restoreKey62=$('#jm-restore-key');
restoreForm62.closest('details').querySelector('summary').textContent='Buka semula kelas Guru';
$('#jm-restore-code').closest('label').firstChild.textContent='Kod kelas';
restoreKey62.closest('label').firstChild.textContent='Kata kunci Guru';
restoreKey62.maxLength=4;restoreKey62.placeholder='Empat huruf';restoreKey62.pattern='[A-Za-z]{4}';restoreKey62.autocomplete='off';restoreKey62.setAttribute('autocapitalize','characters');
const keyHelp62=makeBox23('p','jm-key-help62','Masukkan kod kelas dan kata kunci empat huruf yang dijana untuk kelas itu. Boleh digunakan pada peranti Guru yang lain.',restoreForm62);
const importButton62=makeBox23('button','jm-import-access62','Muat masuk fail akses kelas',restoreForm62);importButton62.type='button';importButton62.className='jm-secondary';
const importInput62=document.createElement('input');importInput62.type='file';importInput62.accept='.json,.txt';importInput62.hidden=true;restoreForm62.append(importInput62);
const accessStatus62=makeBox23('p','jm-access-status62','',restoreForm62);accessStatus62.setAttribute('role','status');
const restoreSubmit62=restoreForm62.querySelector('button[type="submit"]');restoreSubmit62.textContent='Buka rekod kelas';
async function openTeacher62(candidate){
 const data=await api({action:'report'},candidate);
 teacherSession={...candidate,...data.room};storeJSON('joran-minda-guru-v7',teacherSession);teacherRoom();
 $('#jm-report-source').value='online';updateReportHelp21();await refreshReport();
 $('#jm-teacher-status').textContent='Kelas Guru telah dibuka.';accessStatus62.textContent='Kelas Guru telah dibuka.';return true;
}
restoreTeacher=async function(e){
 e.preventDefault();const code=normalizeRoomCode21($('#jm-restore-code').value),key=restoreKey62.value.trim().toUpperCase();
 if(!/^[A-Z]{4}$/.test(key)){accessStatus62.textContent='Masukkan kata kunci empat huruf bagi kelas ini.';return;}
 restoreSubmit62.disabled=true;accessStatus62.textContent='Sedang membuka kelas…';
 try{
  const result=await api({action:'teacher-unlock63',code,key},null);
  teacherKeys63[code]=key;storeJSON('joran-teacher-keys63',teacherKeys63);
  await openTeacher62({code,token:result.teacherToken});restoreKey62.value='';
 }catch(e){accessStatus62.textContent=e.message;}finally{restoreSubmit62.disabled=false;}
};restoreForm62.onsubmit=restoreTeacher;
saveTeacherKey=function(){
 if(!teacherSession)return;
 const data={format:'joran-minda-akses-guru',version:63,teacherKey63:teacherKeys63[teacherSession.code]||'',code:teacherSession.code,token:teacherSession.token,name:teacherSession.name,kelas:teacherSession.kelas,story:teacherSession.story};
 downloadBlob(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}),'akses-kelas-'+teacherSession.code+'.json');
};$('#jm-teacher-backup').onclick=saveTeacherKey;$('#jm-teacher-backup').textContent='Simpan fail akses kelas';
teacherAccess22.querySelector('summary').textContent='Simpan akses atau keluar';
if(teacherSmall22)teacherSmall22.textContent='Simpan fail akses sebagai sandaran. Untuk membuka kelas pada peranti lain, masukkan kod kelas dan kata kunci empat huruf. Murid hanya memerlukan kod kelas.';
importButton62.onclick=()=>importInput62.click();
async function importTeacher62(file){
 if(!file)return;importButton62.disabled=true;
 try{
  if(file.size>16000)throw Error('Pilih fail akses kelas (.json) atau kunci Guru lama (.txt).');
  const text=await file.text();let candidate;
  try{const d=JSON.parse(text);if(d.format==='joran-minda-akses-guru')candidate={code:d.code,token:d.token,teacherKey63:/^[A-Z]{4}$/.test(d.teacherKey63||'')?d.teacherKey63:''};}catch{}
  if(!candidate)candidate={code:text.match(/Kod bilik:\s*([A-Fa-f0-9]{6,10})/)?.[1],token:text.match(/Kunci guru:\s*([a-f0-9]{64})/)?.[1]};
  if(!/^(?:\d{6}|[A-Fa-f0-9]{10})$/.test(candidate.code||'')||!/^[a-f0-9]{64}$/.test(candidate.token||''))throw Error('Fail akses kelas tidak sah. Pilih fail yang disimpan melalui Ruang Guru.');
  candidate.code=candidate.code.toUpperCase();await openTeacher62(candidate);if(candidate.teacherKey63){teacherKeys63[candidate.code]=candidate.teacherKey63;storeJSON('joran-teacher-keys63',teacherKeys63);teacherRoom();}$('#jm-restore-code').value=candidate.code;restoreKey62.value='';
  accessStatus62.textContent='Akses kelas disimpan. Lihat kata kunci empat huruf di ruang kelas Guru. Jika belum ada, tekan Jana kata kunci 4 huruf.';
 }catch(e){accessStatus62.textContent=e.message;}finally{importInput62.value='';importButton62.disabled=false;}
}
importInput62.onchange=()=>importTeacher62(importInput62.files[0]);
// Sign-out hides the view, while retaining access on this teacher device.
$('#jm-teacher-signout').onclick=()=>{rememberRoom23();teacherSession=null;try{localStorage.removeItem('joran-minda-guru-v7');}catch{}teacherRoom();$('#jm-report-source').value='local';refreshReport();accessStatus62.textContent='Paparan Guru ditutup. Akses kelas kekal disimpan pada peranti ini.';};
const paragraphs62=teacherHelp58.querySelectorAll(':scope > p');
['1. Sediakan satu kelas. Pilih mod, cerita dan cara murid menggunakan peranti.','2. Kongsi satu kod atau pautan kelas kepada semua murid. Bagi peranti berasingan, setiap ahli memilih kumpulan yang diberikan oleh Guru.','3. Pilih Rekod kelas Guru dan Muat semula rekod. Hasil setiap kumpulan dipaparkan berasingan. Tutup bilik apabila aktiviti berakhir.','Setiap kelas mendapat kata kunci Guru yang berbeza, terdiri daripada empat huruf. Gunakan kod kelas bersama kata kunci itu untuk membuka rekod pada mana-mana peranti Guru. Main tanpa kod menyimpan rekod pada peranti murid sahaja.'].forEach((text,i)=>{if(paragraphs62[i])paragraphs62[i].textContent=text;});
root.dataset.version='63';$('#jm-version').textContent='Joran Minda · Versi 63 · Kata kunci Guru empat huruf';
entrySettings60();teacherRoom();
