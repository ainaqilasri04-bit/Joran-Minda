// V54: import the supplied teacher backup, retaining short takes for review only.
const reviewRows54=(window.JoranTeacherVoiceReview54?.recordings||[]).filter(validVoiceRow33);
const reviewIds54=new Set(reviewRows54.map(takeIdentity53)),reviewUrls54=new Set(reviewRows54.map(r=>r.url));
const needsReview54=record=>!!record&&(reviewIds54.has(takeIdentity53(record))||reviewUrls54.has(record.url));
const matchesBefore54=recordingMatches;
recordingMatches=function(record,text){return !needsReview54(record)&&matchesBefore54(record,text);};
for(const row of reviewRows54){const r={...row,persisted:true,bundled33:true};recordings[takeKey(r.slot,r)]=r;}
const importedNote54=document.createElement('p');importedNote54.id='jm-imported-voices54';importedNote54.setAttribute('role','status');exportPanel53.prepend(importedNote54);
// Replace the old request to obtain the export: this backup has now been received.
for(const p of [...exportPanel53.querySelectorAll('p')])if(p.textContent.startsWith('Buka versi dan pelayar'))p.textContent='Jika menambah atau menggantikan rakaman selepas ini, muat turun fail suara baharu untuk mengemas kini website.';
function renderImported54(){
 const a=voiceAudit41(),ready=a.stories.reduce((n,s)=>n+s.pages.filter(p=>p.ready).length,0);
 importedNote54.textContent='Bacaan Guru tersedia: '+ready+' daripada 20 halaman. '+(ready===20?'Semua halaman mempunyai rakaman yang sepadan.':'Lihat Semakan suara sebelum terbit untuk halaman yang perlu dilengkapkan.');
 teacherNotice37.textContent='Rakaman daripada sandaran Guru telah dimasukkan. '+importedNote54.textContent;
}
const summaryBefore54=renderSummary33;
renderSummary33=function(){summaryBefore54();renderImported54();};
const studioBefore54=renderVoice;
renderVoice=function(){
 studioBefore54();if(studioKind33!=='story')return;
 $('#jm-studio-route').textContent='Pilih cerita dan halaman. Dengar semula rakaman yang disimpan. Rakam semula hanya halaman yang belum mempunyai bacaan lengkap.';
 const takes=recordingTakes(voiceKey()),selected=takes.find(t=>t.key===studioTakeKey);
 for(const option of $('#jm-saved-takes').options){const take=takes.find(t=>t.key===option.value);if(take&&needsReview54(take.record))option.textContent='Perlu semak · Rakaman singkat / hampir senyap · '+new Date(take.record.savedAt||0).toLocaleString('ms-MY');}
 if(selected&&needsReview54(selected.record)){
  const metadata=reviewRows54.find(r=>takeIdentity53(r)===takeIdentity53(selected.record));
  const usable=takes.some(t=>recordingMatches(t.record,currentPageText53(voiceKey())));
  voiceNotice('Rakaman ini '+(metadata?metadata.duration54+' saat dan ':'')+'perlu disemak. Rakaman ini tidak digunakan untuk bacaan murid. '+(usable?'Rakaman lain yang sepadan tersedia untuk murid.':'Rakam semula teks halaman ini, kemudian dengar semula.'));
 }
};
const publishBefore54=publishTake23;
publishTake23=async function(slot,record){if(needsReview54(record))throw Error('Rakaman terlalu singkat atau hampir senyap. Pilih atau rakam bacaan halaman yang lengkap sebelum berkongsi.');return publishBefore54(slot,record);};
renderSummary33();
root.dataset.version='54';$('#jm-version').textContent='Joran Minda · Versi 54 · Rakaman Guru telah dimasukkan';queue27();
