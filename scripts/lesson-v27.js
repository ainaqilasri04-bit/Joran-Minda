// V27: a pupil-facing sequence with persistent navigation and separate results.
let aux27='', extraKey27='', closeStage27='', selectedReader27='', renderQueued27=false, painting27=false;
const shell27=makeBox23('section','jm-shell27','');
shell27.hidden=true;
shell27.innerHTML='<header class="jm-head27"><strong>JORAN MINDA</strong><span id="jm-person27"></span><nav aria-label="Ruang murid"><button type="button" data-space27="tasks">Tugasan</button><button type="button" data-space27="marks">Markah</button><button type="button" data-space27="certificate">Sijil</button><button type="button" id="jm-exit27">Menu</button></nav></header><div class="jm-location27"><span id="jm-phase27"></span><strong id="jm-title27" tabindex="-1"></strong><button type="button" id="jm-hear27">Dengar arahan</button></div><main id="jm-main27"></main><footer class="jm-footer27"><button type="button" class="jm-secondary" id="jm-back27">← Kembali</button><p id="jm-status27" role="status" aria-live="polite"></p><button type="button" class="jm-primary" id="jm-next27">Seterusnya →</button></footer>';
root.append(shell27);
const inertNodes27=new Set();
const main27=$('#jm-main27');
const fishTools27=makeBox23('div','jm-fish-tools27','');fishTools27.append($('#jm-pause'));const fishHear27=document.createElement('button');fishHear27.type='button';fishHear27.className='jm-secondary';fishHear27.textContent='Dengar soalan';fishHear27.onclick=()=>hearQuestion();fishTools27.prepend(fishHear27);$('#jm-hand-layout').before(fishTools27);

for(const panel of [panel24,$('[data-panel="game"]'),$('[data-panel="book"]')])main27.append(panel);
const extra27=makeBox23('section','jm-extra27','',main27);extra27.className='jm-card27';extra27.hidden=true;
const closing27=makeBox23('section','jm-closing27','',main27);closing27.className='jm-card27';closing27.hidden=true;
function state27(){const b=bookState();if(!b.wizard27)b.wizard27={q:0,practice:0,drafts:{}};return b.wizard27;}
function active27(){return enabled24()&&['lesson','game','book'].includes(view);}
function queue27(){if(renderQueued27)return;renderQueued27=true;queueMicrotask(()=>{renderQueued27=false;paint27();});}
function nav27(title,phase,next,action,{disabled=false,status='',back=null}={}){
 $('#jm-title27').textContent=title;$('#jm-phase27').textContent=phase;
 const n=$('#jm-next27');n.textContent=next;n.disabled=disabled||pupilAudio26.busy();n.onclick=async()=>{if(n.disabled)return;stopVoice();const fishing=view==='game'&&(step===3||step===4&&bonusReady);await action?.();if(!fishing)main27.scrollTop=0;queue27();};
 const b=$('#jm-back27');b.hidden=!back;b.disabled=pupilAudio26.busy();b.onclick=()=>{stopVoice();back?.();main27.scrollTop=0;queue27();};
 $('#jm-status27').textContent=status;
}
function remember27(){const st=state27();panel24.querySelectorAll('form').forEach(f=>{const key=f.id||'explain'+f.dataset.pdpExplain;const d={};new FormData(f).forEach((v,k)=>d[k]=v);st.drafts[key]=d;});saveWork();}
function restoreForms27(){const drafts=state27().drafts;panel24.querySelectorAll('form').forEach(f=>{const d=drafts[f.id||'explain'+f.dataset.pdpExplain];if(d)for(const [name,value]of Object.entries(d)){for(const input of f.elements){if(input.name!==name)continue;if(input.type==='radio')input.checked=input.value===value;else input.value=value;}}f.oninput=()=>{remember27();queue27();};f.addEventListener('change',()=>{remember27();queue27();});});panel24.querySelectorAll('[data-evidence-check]').forEach(select=>{if(select.value)select.onchange?.();});}
function delegate27(selector,label,phase,title,status='',back=null){const button=$(selector);nav27(title,phase,label,()=>button?.click(),{disabled:!button||button.disabled,status,back});}
function tasks27(){const l=lesson24(),a=progress23(who24())?.achievement||A23.assess();
 return [
 {phase:0,label:'Set induksi',done:!!l.induction,detail:l.puzzle?'Puzzle siap · '+(l.induction?'idea disimpan':'kongsi idea dahulu'):'Susun 6 keping puzzle'},
 {phase:1,label:'Aktiviti 1 · BaCaNi',done:l.ready&&readingReady26(),detail:'Bacaan '+l.readPages.length+'/5 · Tiga jawapan '+(l.identification?'siap':'belum siap')},
 {phase:2,label:'Aktiviti 2 · Memancing',done:coreReady24()&&l.explained,detail:'Halaman dipancing '+bookState().choices.length+'/5 · Penjelasan '+l.explanations.filter(Boolean).length+'/2'},
 {phase:3,label:'Aktiviti 3 · Latihan',done:l.practiced,detail:l.practiced?'Latihan selesai':l.route?L24.routes[l.route]+' belum selesai':'Pilih satu latihan bersama Guru'},
 {phase:4,label:'Penutup',done:a.reviewPages.length===5&&!!a.reflection,detail:'Semakan buku '+a.reviewPages.length+'/5 · Refleksi '+(a.reflection?'siap':'belum siap')}
 ];
}
function jump27(phase){aux27='';closeStage27='';phaseOverride24=phase;const st=state27();st.reading=null;if(phase===1)page24=Math.max(0,Array.from({length:5},(_,p)=>p).find(p=>!readingPageReady26(p)||!lesson24().readPages.includes(p))??0);go24();}
function pending27(){const l=lesson24(),a=progress23(who24())?.achievement||A23.assess(),items=[];
 if(!l.induction)items.push('Set induksi');
 if(l.readPages.length<5)items.push('Bacaan: '+l.readPages.length+'/5 halaman');
 for(let page=0;page<5;page++)if(!readingPageReady26(page))items.push('Rakaman halaman '+(page+1)+': '+(reader28(page)?.name||'Pembaca'));
 if(!l.identification)items.push('Tiga jawapan BaCaNi');
 if(!coreReady24())items.push('Permainan memancing dan peribahasa');
 if(!l.explained)items.push('Penjelasan nilai: '+l.explanations.filter(Boolean).length+'/2');
 if(!l.practiced)items.push('Latihan Aktiviti 3');
 if(a.reviewPages.length<5)items.push('Semakan buku: '+a.reviewPages.length+'/5 halaman');
 if(!a.reflection)items.push('Refleksi penutup');return items;
}
function renderExtra27(){const l=lesson24(),p=progress23(who24()),a=p?.achievement||A23.assess();
 if(aux27==='tasks'){
  extra27.innerHTML='<h2>Tugasan '+(isSolo()?'saya':'kumpulan')+'</h2><p>✓ Siap &nbsp; · &nbsp; ● Belum siap</p><div class="jm-task-grid27">'+tasks27().map(t=>'<button type="button" data-jump27="'+t.phase+'" '+(t.phase>phase24()?'disabled':'')+'><b>'+(t.done?'✓ ':'● ')+t.label+'</b><span>'+safe(t.detail)+'</span></button>').join('')+'</div><p>Dalam kumpulan, semua ahli berbincang. Ketua menghantar jawapan bersama.</p>';
  extra27.querySelectorAll('[data-jump27]').forEach(b=>b.onclick=()=>jump27(Number(b.dataset.jump27)));
  nav27('Apa yang belum siap?','Peta pembelajaran','Sambung tugasan →',()=>jump27(phase24()),{status:tasks27().filter(t=>t.done).length+'/5 fasa siap'});
 }else if(aux27==='marks'){
  const pts=L24.points(l,a);extra27.innerHTML='<div class="jm-results27"><div><p class="jm-pdp-kicker">Mata tugasan '+(collaborative26()?'kumpulan':'saya')+'</p><h2>'+pts.total+' <small>/ 100</small></h2><p>'+ (pending27().length?'Pembelajaran masih berjalan.':'Semua aktiviti telah dilengkapkan!')+'</p><p>Mata diberikan untuk tugasan yang diselesaikan. Ketepatan penjelasan dan bacaan disemak oleh Guru.</p></div><div>'+scoreHtml24(l,a)+'</div></div><div class="jm-criteria27"><p><b>Kriteria 1</b><br>Nilai murni tepat: '+l.correct+'/3<br>'+safe(l.objective1)+'</p><p><b>Kriteria 2</b><br>Penjelasan tepat: '+l.explainedCorrect+'/2<br>'+safe(l.objective2)+'</p></div>';
  nav27('Markah dan pencapaian','Keputusan pembelajaran','Seterusnya: Sijil →',()=>{aux27='certificate';queue27();},{status:'Rakaman bacaan dinilai oleh Guru.',back:()=>{aux27='';if(view==='book')closeStage27='reflection';queue27();}});
 }else{
  const ready=!!p?.certificateEligible,missing=pending27();extra27.innerHTML='<div class="jm-certificate27"><div class="jm-badge27" aria-hidden="true">'+(ready?'★':'◇')+'</div><h2>'+(ready?'Tahniah! Sijil telah dibuka.':'Sijil belum dibuka')+'</h2><p>'+(ready?'Semua aktiviti, rakaman bacaan, semakan buku dan refleksi telah lengkap.':'Lengkapkan tugasan berikut untuk mendapatkan sijil:')+'</p>'+(ready?'<p>'+safe(isSolo()?profile.name:teamMembers.map(m=>m.name).join(' · '))+'</p><button type="button" class="jm-primary" id="jm-certificate27">'+(collaborative26()?'Muat turun sijil semua ahli (PDF)':'Muat turun sijil saya (PDF)')+'</button><p>Sijil penyertaan mengesahkan aktiviti lengkap.</p>':'<ul class="jm-pending27">'+missing.map(x=>'<li>'+safe(x)+'</li>').join('')+'<button type="button" class="jm-secondary" id="jm-locked-certificate27" disabled>Sijil dikunci</button>')+'<p id="jm-certificate-status27" role="status"></p></div>';
  const cert=$('#jm-certificate27');if(cert){cert.disabled=!canLead26();cert.onclick=async()=>{cert.disabled=true;cert.textContent='Menyediakan sijil…';try{if(collaborative26())await groupCertificates26.onclick();else await downloadCertificate23();$('#jm-certificate-status27').textContent=$('#jm-completion-status').textContent;}finally{cert.disabled=false;cert.textContent=collaborative26()?'Muat turun sijil semua ahli (PDF)':'Muat turun sijil saya (PDF)';}};}
  nav27(ready?'Pembelajaran selesai':'Lengkapkan dahulu','Sijil penyertaan',ready?'Lihat objektif pembelajaran →':'Sambung tugasan →',()=>{if(ready){aux27='outcomes';queue27();}else jump27(phase24());},{status:ready?'Semua tugasan siap. Syabas!':'Sijil diberikan selepas semua aktiviti siap.',back:()=>{aux27='marks';queue27();}});
 }
}
function bookScreen27(){const a=progress23(who24())?.achievement||A23.assess();if(!closeStage27){closeStage27=a.reviewPages.length<5?'review':!a.reflection?'share':'done';if(closeStage27==='review')bookPage=Array.from({length:5},(_,p)=>p).find(p=>!a.reviewPages.includes(p));}
 if(closeStage27==='share'){shareScreen47();return;}
 if(closeStage27==='done'){aux27='marks';queue27();return;}
 if(closeStage27==='review'||closeStage27==='book'){
  
  const doc=JoranStory.lessonMake(storyKey,bookPage,currentLessonVersion34());
  closing27.innerHTML='<div class="jm-review27"><img src="'+assets[storyKey+'-'+(bookPage+1)]+'" alt="Ilustrasi halaman '+(bookPage+1)+'"><div><p class="jm-pdp-kicker">Buku '+(isSolo()?'saya':'kumpulan')+' · Halaman '+(bookPage+1)+' / 5</p><h2>'+safe(doc.title)+'</h2><p class="jm-reading27">'+syl(canonicalText23(storyKey,bookPage))+'</p><button type="button" class="jm-secondary" id="jm-review-listen27">Dengar suara Guru</button><p id="jm-review-audio27" role="status"></p></div></div>'+(closeStage27==='book'?'<button class="jm-secondary" type="button" id="jm-book-download27">Muat turun buku lengkap (PDF)</button><p id="jm-book-status27" role="status"></p>':'');
  $('#jm-review-listen27').onclick=()=>listenPage(bookPage,$('#jm-review-listen27'),$('#jm-review-audio27'));
  if(closeStage27==='book'){
   $('#jm-book-download27').onclick=async()=>{const b=$('#jm-book-download27');b.disabled=true;await exportBook();$('#jm-book-status27').textContent=$('#jm-publish-status').textContent;b.disabled=false;};
   nav27('Buku cerita lengkap','Hasil pembelajaran',bookPage<4?'Seterusnya: Halaman '+(bookPage+2)+' →':'Kembali ke sijil →',()=>{if(bookPage<4)bookPage++;else aux27='certificate';queue27();},{status:'Cerita dan penerangan bersama terdapat dalam PDF.',back:()=>{if(bookPage>0)bookPage--;else aux27='certificate';queue27();}});
  }else nav27('Semak buku cerita','Penutup · Langkah 1 / 3',bookPage<4?'Sudah semak · Seterusnya →':'Sudah semak · Kongsi buku →',async()=>{await submitCompletion23('review-page',{page:bookPage});if(progress23(who24()).achievement.reviewPages.includes(bookPage)){if(bookPage<4)bookPage++;else closeStage27='share';}queue27();},{disabled:!canLead26()||completionBusy23,status:'Semakan selesai: '+a.reviewPages.length+'/5 halaman',back:bookPage>0?()=>{bookPage--;queue27();}:null});
 }else{
  closing27.innerHTML='<p class="jm-pdp-kicker">Satu refleksi '+(collaborative26()?'bersama kumpulan':'saya')+'</p><h2>Apakah nilai yang akan kamu amalkan?</h2><p>Lengkapkan ayat: Saya akan mengamalkan nilai _____ dengan _____.</p><label class="jm-field" for="jm-reflect27">Jawapan '+(collaborative26()?'kumpulan':'saya')+'</label><textarea id="jm-reflect27" class="jm-input" rows="4" maxlength="600" placeholder="Saya akan mengamalkan nilai ...">'+safe(state27().reflection??a.reflection??'')+'</textarea><p>Guru atau rakan boleh membantu menaip idea yang kamu sampaikan.</p><p id="jm-reflect-status27" role="status"></p>';
  const input=$('#jm-reflect27');input.disabled=!canLead26();input.oninput=()=>{state27().reflection=input.value;saveWork();};
  nav27('Refleksi penutup','Penutup · Langkah 3 / 3','Simpan refleksi · Lihat markah →',async()=>{const text=input.value.trim();if(!text){$('#jm-reflect-status27').textContent='Tulis satu nilai dan cara kamu mengamalkannya.';input.focus();return;}await submitCompletion23('reflection',{text});if(progress23(who24()).achievement.reflection){aux27='marks';closeStage27='done';}queue27();},{disabled:!canLead26()||completionBusy23,status:'Selepas ini: markah, kemudian sijil.',back:()=>{closeStage27='share';queue27();}});
 }
}
function lessonScreen27(){const l=lesson24(),phase=eligible24(),st=state27();panel24.dataset.phase27=phase;
 let sub='';
 if(phase===0){sub=l.puzzle?'idea':'puzzle';panel24.dataset.sub27=sub;
  if(!l.puzzle)nav27('Susun puzzle gambar','Set induksi','Seterusnya: Kongsi idea →',()=>{}, {disabled:true,status:'Susun keenam-enam keping. Bantuan dibenarkan.'});
  else delegate27('#jm-pdp-induction button[type=submit]','Simpan idea · Seterusnya →','Set induksi','Kongsi idea kamu','Pilih satu jawapan.');
 }else if(phase===1){
  const reading=st.reading===true||l.readPages.length<5||!readingReady26();sub=reading?'read':'values';panel24.dataset.sub27=sub;
  if(reading){
   if(l.readPages.includes(page24)&&readingPageReady26(page24))nav27('Baca dan rakam suara','Aktiviti 1 · Ba · Baca · Halaman '+(page24+1)+'/5','Seterusnya →',()=>{if(page24<4)page24++;else st.reading=false;saveWork();renderLesson24();},{status:'Halaman ini sudah dibaca dan rakaman disimpan.',back:page24?()=>{page24--;renderLesson24();}:null});
   else delegate27('#jm-pdp-read','Simpan bacaan · Seterusnya →','Aktiviti 1 · Ba · Baca · Halaman '+(page24+1)+'/5','Baca dan rakam suara',readingPageReady26(page24)?'Rakaman halaman ini lengkap.':'Rakam bacaan '+(reader28(page24)?.name||'pembaca')+' untuk membuka Seterusnya.',page24?()=>{page24--;renderLesson24();}:null);
  }else{
   const q=Math.min(2,st.q||0);panel24.querySelectorAll('.jm-bacani-check').forEach((f,i)=>f.hidden=i!==q);
   nav27('Cari perbuatan dan nilai','Aktiviti 1 · Ca · Cari → Ni · Nilai · Soalan '+(q+1)+'/3',q<2?'Seterusnya: Soalan '+(q+2)+' →':'Simpan tiga jawapan · Mula memancing →',()=>{const card=panel24.querySelector('[data-check="'+q+'"]');if(![...card.querySelectorAll('select,input:not(:disabled)')].every(x=>x.checkValidity())){card.querySelector('select:invalid,input:invalid')?.reportValidity();return;}remember27();if(q<2){st.q++;saveWork();lessonScreen27();}else $('#jm-pdp-values').requestSubmit();},{disabled:!canLead26(),status:'Pilih ayat bukti dahulu, kemudian nilai murni.',back:()=>{if(st.q>0){st.q--;lessonScreen27();}else{st.reading=true;page24=4;renderLesson24();}}});
  }
 }else if(phase===2&&coreReady24()){
  const index=l.explanations[0]?1:0;panel24.querySelectorAll('[data-pdp-explain]').forEach((f,i)=>f.hidden=i!==index);
  delegate27('[data-pdp-explain="'+index+'"] button[type=submit]','Simpan penjelasan · Seterusnya →','Aktiviti 2 · Penjelasan '+(index+1)+'/2','Terangkan nilai murni','Jawapan ini dimasukkan ke dalam buku cerita.');
 }else if(phase===3){
  sub=l.route?'practice':'route';panel24.dataset.sub27=sub;
  if(!l.route)delegate27('#jm-pdp-route button','Pilih latihan · Seterusnya →','Aktiviti 3','Pilih latihan bersama Guru','Lengkapkan satu laluan sahaja.');
  else{
   const f=$('#jm-pdp-practice');if(!f)return;const qs=[...f.querySelectorAll('fieldset')],max=qs.length,q=Math.min(st.practice||0,max);f.dataset.question27=q;
   qs.forEach((card,i)=>card.hidden=i!==q);f.querySelectorAll('details').forEach((d,i)=>d.hidden=i!==q);
   f.querySelectorAll(':scope>label').forEach(x=>x.hidden=q!==max);
   nav27(q<max?'Lengkapkan padanan':'Tulis penerangan', 'Aktiviti 3 · '+L24.routes[l.route]+' · '+(q+1)+'/'+(max+1),q<max?'Seterusnya →':'Simpan latihan · Ke penutup →',()=>{remember27();if(q<max){const invalid=qs[q].querySelector('input:invalid');if(invalid){invalid.reportValidity();return;}st.practice=q+1;saveWork();lessonScreen27();}else f.requestSubmit();},{disabled:!canLead26(),status:'Latihan pilihan Guru.',back:q?()=>{st.practice=q-1;lessonScreen27();}:null});
  }
 }else delegate27('#jm-pdp-wait','Semak kumpulan →','Aktiviti 2','Bersedia bersama kumpulan');
}
function gameScreen27(){const phase='Aktiviti 2 · '+(step<4?'Halaman '+(readPage+1)+'/5':'Peribahasa');
 if(celebrating)delegate27('#jm-continue','Seterusnya →',phase,'Semak jawapan kamu');
 else if(step<=1)delegate27('#jm-next-step','Seterusnya →',phase,step===0?'Ba · Baca semula petikan':'Ca · Cari perbuatan watak',step===0?'Rakaman yang telah disimpan boleh didengar atau dirakam semula.':'Tekan ayat yang menunjukkan perbuatan watak.');
 else if(step===2||step===4&&!bonusReady)delegate27('#jm-start-fishing','Simpan jawapan · Pancing →',phase,step===4?'Bincang maksud peribahasa':'Ni · Nilai murni dan sebab','Semua ahli memberikan idea; penyumbang mencatat persetujuan.');
 else delegate27('#jm-cast','Pancing ikan ini',phase,'Ni · Nilai — pancing jawapan','Pilih ikan yang membawa jawapan tepat.');
}
function paint27(){if(painting27)return;painting27=true;try{
 const active=active27();shell27.hidden=!active;root.classList.toggle('jm-wizard27',active);document.documentElement.classList.toggle('jm-open27',active);if(active){for(const el of root.children){if(el!==shell27&&!['SCRIPT','STYLE','DIALOG'].includes(el.tagName)&&!el.inert){el.inert=true;inertNodes27.add(el);}}}else{for(const el of inertNodes27)el.inert=false;inertNodes27.clear();}if(!active)return;if(!aux27)extraKey27='';
 $('#jm-person27').textContent=collaborative26()?bookState().group+' · Ketua: '+(leader26()?.name||'Menunggu'):profile.name;
 shell27.dataset.aux=aux27?'true':'false';shell27.dataset.view=view;extra27.hidden=!aux27;closing27.hidden=!!aux27||view!=='book';
 shell27.querySelectorAll('[data-space27]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.space27===aux27)));
 if(aux27){const key=JSON.stringify([aux27,lesson24(),progress23(who24())?.certificateEligible,pending27(),L24.points(lesson24(),progress23(who24())?.achievement),teamMembers.map(m=>m.name)]);if(key!==extraKey27){extraKey27=key;renderExtra27();}}else if(view==='book')bookScreen27();else if(view==='lesson')lessonScreen27();else gameScreen27();
 }finally{painting27=false;}}
for(const button of shell27.querySelectorAll('[data-space27]'))button.onclick=()=>{stopVoice();remember27();aux27=button.dataset.space27;main27.scrollTop=0;paint27();};
$('#jm-exit27').onclick=()=>{aux27='';showView('home');};
$('#jm-hear27').onclick=()=>{if(aux27)speakMalayDevice($('#jm-title27').textContent+'. '+$('#jm-status27').textContent,$('#jm-status27'));else if(view==='lesson')$('#jm-pdp-hear').click();else if(view==='game')$('#jm-hear-guide').click();else speakMalayDevice(closeStage27==='reflection'?'Nyatakan satu nilai murni dan cara kamu akan mengamalkannya. Kemudian, tekan Simpan refleksi.':'Baca dan semak halaman buku. Tekan Sudah semak untuk ke halaman seterusnya.',$('#jm-status27'));};
const lessonBefore27=renderLesson24;renderLesson24=function(){lessonBefore27();if(enabled24()){restoreForms27();queue27();}};
const viewBefore27=showView;showView=function(v){const before=view;viewBefore27(v);if(view==='game'&&before!=='game')renderStory();queue27();};
const flowBefore27=renderFlow;renderFlow=function(){flowBefore27();queue27();};
const finishBefore27=renderFinish23;renderFinish23=function(){finishBefore27();queue27();};
const castBefore27=updateCast;updateCast=function(){castBefore27();queue27();};
go24=function(){aux27='';showView('lesson');main27.scrollTop=0;};
focusFlow=function(){main27.scrollTop=0;queue27();};
const startBefore27=startStudent;startStudent=async function(e){aux27='';closeStage27='';selectedReader27='';await startBefore27(e);queue27();};$('#jm-entry-form').onsubmit=startStudent;
const audioBefore27=renderPupilAudio26;renderPupilAudio26=function(container,page){const lastPage=/halaman (\d+)/i.exec(pupilAudioNotice26);if(!pupilAudio26.busy()&&pupilAudioNotice26.startsWith('✓ Rakaman')&&lastPage&&Number(lastPage[1])!==page+1)pupilAudioNotice26='';audioBefore27(container,page);if(!container||!active27())return;const panel=container.querySelector('.jm-pupil-audio26');if(!panel)return;
 const members=readingMembers26();if(!members.some(m=>m.id===selectedReader27))selectedReader27=roomSession&&!canLead26()?profile.id:members.find(m=>!takes26(m.id,page).length)?.id||profile.id;
 let nav=panel.querySelector('.jm-voice-tabs27');if(!nav){nav=document.createElement('nav');nav.className='jm-voice-tabs27';panel.querySelector('h3').after(nav);}nav.setAttribute('aria-label','Rakaman suara setiap murid');
 nav.innerHTML=members.map(m=>'<button type="button" data-reader27="'+m.id+'" aria-pressed="'+(m.id===selectedReader27)+'">'+safe(m.name)+(takes26(m.id,page).some(r=>r.persisted!==false&&(!roomSession||r.synced))?' ✓':'')+'</button>').join('');
 panel.querySelectorAll(':scope>article').forEach((a,i)=>a.hidden=members[i]?.id!==selectedReader27);nav.querySelectorAll('button').forEach(b=>b.onclick=()=>{selectedReader27=b.dataset.reader27;renderPupilAudio26(container,page);});queue27();
};
const submitBefore27=submitCompletion23;submitCompletion23=async function(type,extra){await submitBefore27(type,extra);queue27();};
// Native controls still own validation and persistence. Mirror only their enabled state.
new MutationObserver(records=>{if(records.some(r=>r.attributeName==='disabled'&&!r.target.closest('#jm-shell27 header,#jm-shell27 footer,#jm-extra27,#jm-closing27')))queue27();}).observe(main27,{attributes:true,attributeFilter:['disabled'],subtree:true});
root.dataset.version='27';$('#jm-version').textContent='Joran Minda · Versi 27 · Satu tugasan pada satu masa';
