// V31: exact instruction text, editable final books and structured Excel reports.
function isAudioButton31(button){
 if(!button||button.matches('[data-sentence],[data-puzzle-slot],[data-voice-action="stop"],.jm-stop30')||button.closest('#jm-reference30'))return false;
 return /^(?:[\s🔊▶]+)?(?:Dengar\b|Cuba suara\b)/iu.test(button.textContent.trim());
}
const directionsBefore31=instructionText28;
instructionText28=function(){
 const text=directionsBefore31();
 if(view==='book'&&!aux27&&['review','book'].includes(closeStage27))return 'Baca semula halaman ini. Semak tajuk buku, tajuk halaman dan ayat. Jika perlu, tekan Baiki tajuk dan ayat. Simpan perubahan sebelum menekan Seterusnya.';
 return text.replace(/mengikut masa sendiri/gi,'mengikut masa yang ditetapkan oleh Guru');
};
// Every instruction control reads the same full paragraph shown to the pupil.
hearInstructions28=async function(){return speakMalay(instructionText28(),$('#jm-status27'));};
hearGuide=hearInstructions28;$('#jm-hear27').onclick=hearInstructions28;$('#jm-hear-guide').onclick=hearInstructions28;
helpText.notes='Baca ayat bukti. Pilih nilai yang sesuai. Catat nilai dan sebab kamu memilihnya. Kemudian, simpan catatan dan pancing jawapan. Dalam kumpulan, bincang bersama. Penyumbang menekan butang sendiri.';
const schedule31=makeBox23('p','jm-schedule31','PdP 60 minit · Set induksi 5 · Aktiviti 1 15 · Aktiviti 2 25 · Aktiviti 3 10 · Penutup 5');
$('.jm-location27').append(schedule31);

function finalBook31(){
 const b=JSON.parse(JSON.stringify(bookState())),edit=roomSession?roomData?.bookEdit:bookState().bookEdit31;
 b.pageTitles=Array.from({length:5},(_,i)=>JoranStory.lessonMake(storyKey,i).title);
 if(edit){b.title=edit.title;b.pages=edit.pages.slice();b.pageTitles=edit.pageTitles.slice();}
 return b;
}
const bookEditor31=makeBox23('dialog','jm-book-editor31','');root.append(bookEditor31);
let editPage31=0,editRevision31=0,editSaving31=false;
function editorOwner31(page){return isSolo()?profile:reader28(page);}
function canEdit31(page){return !roomSession||isSolo()||editorOwner31(page)?.id===profile?.id;}
function openBookEditor31(){
 stopVoice();editPage31=bookPage;editRevision31=(roomSession?roomData?.bookEdit:bookState().bookEdit31)?.revision||0;
 const b=finalBook31(),owner=editorOwner31(editPage31);
 bookEditor31.innerHTML='<form id="jm-edit-form31"><p class="jm-pdp-kicker">Semak dan baiki · Halaman '+(editPage31+1)+' / 5</p><h2>Baiki tajuk dan ayat</h2><p>'+(collaborative26()?'Bincang bersama. <strong>'+safe(owner?.name||'Penyumbang')+'</strong> menaip dan menyimpan perubahan.':'Baca semula ayat kamu sebelum menyimpan.')+'</p><label>Tajuk buku<input id="jm-book-title31" class="jm-input" maxlength="70" required value="'+safe(b.title)+'"></label><label>Tajuk halaman<input id="jm-page-title31" class="jm-input" maxlength="70" required value="'+safe(b.pageTitles[editPage31])+'"></label><label>Ayat halaman ini<textarea id="jm-page-text31" class="jm-input" rows="6" maxlength="450" required>'+safe(b.pages[editPage31])+'</textarea></label><p id="jm-edit-count31"></p><details><summary>Lihat ayat cerita asal</summary><p>'+safe(canonicalText23(storyKey,editPage31))+'</p></details><p id="jm-edit-status31" role="status"></p><footer><button type="button" class="jm-secondary" id="jm-edit-cancel31">Kembali tanpa menyimpan</button><button type="submit" class="jm-primary" '+(!canEdit31(editPage31)?'disabled':'')+'>Simpan perubahan</button></footer></form>';
 $('#jm-edit-cancel31').onclick=()=>{if(!editSaving31)bookEditor31.close();};
 const input=$('#jm-page-text31'),count=()=>$('#jm-edit-count31').textContent=input.value.length+' / 450 aksara';input.oninput=count;count();
 bookEditor31.querySelectorAll('input,textarea').forEach(el=>el.readOnly=!canEdit31(editPage31));
 $('#jm-edit-form31').onsubmit=saveBookEdit31;bookEditor31.showModal();$('#jm-book-title31').focus();
}
bookEditor31.addEventListener('cancel',e=>{if(editSaving31)e.preventDefault();});
async function saveBookEdit31(event){
 event.preventDefault();if(editSaving31||!canEdit31(editPage31))return;
 const title=$('#jm-book-title31').value.trim(),pageTitle=$('#jm-page-title31').value.trim(),text=$('#jm-page-text31').value.trim(),status=$('#jm-edit-status31');
 if(!title||!pageTitle||!text){status.textContent='Isi tajuk buku, tajuk halaman dan ayat dahulu.';return;}
 editSaving31=true;bookEditor31.querySelectorAll('button').forEach(b=>b.disabled=true);status.textContent='Menyimpan perubahan…';
 try{
  const b=finalBook31();b.title=title;b.pageTitles[editPage31]=pageTitle;b.pages[editPage31]=text;
  let edit={title:b.title,pages:b.pages,pageTitles:b.pageTitles,revision:editRevision31+1,at:Date.now()};
  if(roomSession){const result=await api({action:'book-edit',page:editPage31,baseRevision:editRevision31,title,pageTitle,text});edit=result.bookEdit;roomData.bookEdit=edit;}
  else{
   const old=bookState().bookEdit31;bookState().bookEdit31=edit;
   if(!storeJSON(storageKey,books)){bookState().bookEdit31=old;throw Error('Perubahan belum dapat disimpan. Ruang peranti mungkin penuh.');}
   const memberIds=new Set((isSolo()?[profile]:teamMembers).map(m=>m.id));for(const run of localRuns)if(memberIds.has(run.id))run.bookEdit31=edit;
   storeJSON('joran-minda-rekod-v7',localRuns);saveWork();
  }
  bookEditor31.close();queue27();requestAnimationFrame(()=>{main27.scrollTop=0;});
 }catch(e){status.textContent=e.message+' Ayat kamu masih ada di ruang ini.';}
 finally{editSaving31=false;bookEditor31.querySelectorAll('button').forEach(b=>b.disabled=false);}
}
const bookScreenBefore31=bookScreen27;
bookScreen27=function(){
 bookScreenBefore31();if(!['review','book'].includes(closeStage27)||!$('#jm-review-listen27'))return;
 const b=finalBook31(),area=$('#jm-review-listen27').parentElement;
 area.querySelector('h2').textContent=b.pageTitles[bookPage];area.querySelector('.jm-reading27').innerHTML=syl(b.pages[bookPage]);
 const title=document.createElement('p');title.className='jm-final-title31';title.textContent='Tajuk buku: '+b.title;area.prepend(title);
 const edit=document.createElement('button');edit.type='button';edit.className='jm-primary';edit.id='jm-edit-open31';edit.textContent='Baiki tajuk dan ayat';edit.onclick=openBookEditor31;area.append(edit);
 if(b.pages[bookPage]!==canonicalText23(storyKey,bookPage)){
  const listen=$('#jm-review-listen27');listen.textContent='Dengar cerita asal Guru';
  const details=document.createElement('details');details.className='jm-original31';details.innerHTML='<summary>Teks asal untuk rakaman Guru</summary><p>'+syl(canonicalText23(storyKey,bookPage))+'</p>';listen.before(details);
  listen.onclick=()=>{details.open=true;listenPage(bookPage,listen,$('#jm-review-audio27'));};
 }
};
const pollBefore31=pollRoom;pollRoom=async function(){const previous=roomData?.bookEdit?.revision;await pollBefore31();if(view==='book'&&!bookEditor31.open&&previous!==roomData?.bookEdit?.revision)queue27();};
const localReportBefore31=localReport23;localReport23=function(run){return {...localReportBefore31(run),bookEdit:run.bookEdit31||null};};

const paintBefore31=paint27;
paint27=function(){paintBefore31();if(!active27())return;
 const phase=aux27||view==='book'?4:view==='game'?2:eligible24();
 const minutes=[5,15,25,10,5],names=['Set induksi','Aktiviti 1','Aktiviti 2','Aktiviti 3','Penutup'];
 schedule31.textContent='PdP 60 minit · '+names[phase]+' '+minutes[phase]+' minit · Ikut masa yang ditetapkan oleh Guru.';
 const written=instructionText28();written30.textContent='Arahan: '+written;$('#jm-hear27').dataset.spokenText31=written;
};
root.dataset.version='31';$('#jm-version').textContent='Joran Minda · Versi 31 · Semak dan baiki buku';
window.JoranDiagnostics31=()=>({...window.JoranDiagnostics30(),version:31,instruction:instructionText28(),book:profile?finalBook31():null});
const exportBefore31=exportRecords;
exportRecords=async function(){
 const button=$('#jm-download-report'),status=$('#jm-report-action-status');button.disabled=true;
 try{const takes=$('#jm-report-source').value==='online'?(await api({action:'pupil-audio-list'},teacherSession)).records||[]:await pupilAudio26.all();downloadBlob(JoranReport31.workbook(teacherRecords,takes,stories),'rekod-joran-minda.xlsx');status.textContent='Excel dimuat turun: Individu, Kumpulan, Ahli Kumpulan, Mata Tugasan, Penerangan dan Bacaan. Rekod yang dipadam tidak disertakan.';}
 catch(e){status.textContent='Excel belum dapat disediakan: '+e.message;}
 finally{button.disabled=false;}
};
$('#jm-download-report').onclick=exportRecords;$('#jm-download-report').textContent='Muat turun rekod Excel (.xlsx)';
const teacherReadingBefore31=renderTeacherReading26;renderTeacherReading26=async function(){await teacherReadingBefore31();const b=$('#jm-reading-csv26');if(b){b.textContent='Muat turun Excel · lihat helaian Bacaan';b.onclick=exportRecords;}};
const voicesBefore31=populateMalayVoices;populateMalayVoices=function(){voicesBefore31();$('#jm-ai-availability').textContent='Audio dibaca mengikut teks tepat pada skrin. '+(availableMalayVoices().length?'Suara Bahasa Melayu peranti dikesan.':'Suara Bahasa Melayu peranti belum dikesan. Teks yang belum mempunyai fail audio tidak dapat dibaca pada peranti ini.');};populateMalayVoices();
$('#jm-test-ai').onclick=()=>speakMalay(narration28.baca,$('#jm-ai-availability'));
const finalPaint31=paint27;paint27=function(){finalPaint31();$('#jm-hear27').textContent='Dengar arahan';};

const entryDirections31='Sila pilih cara bermain. Masukkan nama dan kelas. Untuk mod kumpulan, isi nama keempat-empat ahli. Semua ahli bekerjasama; penyumbang yang namanya dipaparkan menekan butang sendiri.';
const entryWritten31=makeBox23('p','jm-entry-written31',entryDirections31);$('#jm-entry-ai').before(entryWritten31);$('#jm-entry-ai').onclick=()=>speakMalay(entryDirections31,$('#jm-entry-ai-status'));
const groupWritten31=$('#jm-local-setup>p');if(groupWritten31)groupWritten31.textContent=helpText.roles;
