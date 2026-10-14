// V29: personal support routes, pupil-controlled turns and complete history cleanup.
function modern29(){return !roomSession||(roomData?.room.lessonVersion||0)>=29;}
function contributor29(){
 const members=readingMembers26();if(!profile||isSolo())return profile;
 if(view==='game'){const role=roomSession?sharedFlow?.role:step<4?roleSequence[(readPage+step)%4]:step===4?(bonusReady?'pemancing':'pencatat'):roleSequence[bookPage%4];return members.find(m=>m.role===role)||members[0];}
 if(view==='book')return members[(closeStage27==='reflection'?0:bookPage)%members.length];
 const phase=eligible24(),l=lesson24();
 if(phase===1)return members[(l.readPages.length<5||state27().reading===true?page24:l.identification?state27().q||0:Math.max(0,l.checks?.findIndex(e=>!e)??0))%members.length];
 if(phase===2)return members[(l.explanations[0]?1:0)%members.length];
 if(phase===3)return l.currentMember||practiceMember28();return members[0];
}
const leadBefore29=canLead26;canLead26=function(){return modern29()?(!roomSession||isSolo()||!!aux27||profile?.id===contributor29()?.id):leadBefore29();};
const activeBefore29=activeMember;activeMember=function(){return modern29()&&profile?contributor29():activeBefore29();};
const practiceBefore29=practiceMember28;practiceMember28=function(){return modern29()?lesson24().currentMember||readingMembers26()[0]:practiceBefore29();};
const questionBefore29=question24;question24=function(item,i,prefix,saved){
 const html=questionBefore29(item,i,prefix,saved);if(prefix!=='value')return html;
 return html.replace('<br>'+safe(item.action)+'<select','<br><span class="jm-prompt29">Apakah perbuatan baik yang ditunjukkan dalam gambar dan petikan?</span><select').replace('<p class="jm-mini-label">','<img class="jm-stimulus29" src="'+assets[storyKey+'-'+(item.page+1)]+'" alt="Situasi halaman '+(item.page+1)+'"><p class="jm-mini-label">');
};
const lessonBefore29=renderLesson24;renderLesson24=function(){
 lessonBefore29();if(!enabled24()||!modern29())return;const l=lesson24(),phase=eligible24(),member=practiceMember28();
 if(phase===3&&!l.route){
  const old=$('#jm-pdp-route');if(old){const form=document.createElement('form');form.id='jm-diagnostic29';form.innerHTML='<p class="jm-pdp-kicker">Semakan awal untuk '+safe(member.name)+'</p><h3>Fikir dan pilih tindakan yang baik</h3><p>Jawab mengikut kefahaman sendiri dahulu. Selepas latihan dipilih, rakan boleh membantu.</p>'+L24.diagnosticFor(storyKey,currentLessonVersion34()).map((x,i)=>question24(x,i,'diagnostic',null)).join('')+'<button type="submit" class="jm-primary">Simpan semakan awal</button><p>0–1 tepat: pemulihan · 2 tepat: pengukuhan · 3 tepat: pengayaan. Ini cadangan latihan, bukan Tahap Penguasaan.</p>';old.replaceWith(form);form.onsubmit=async e=>{e.preventDefault();if(await saveLesson24({type:'lesson-diagnostic',subjectId:member.id,answers:answers24(form,'diagnostic',3)})){state27().diagnostic=0;delete state27().drafts['jm-diagnostic29'];saveWork();go24();}};restoreForms27();}
 }
 if(phase===3&&l.route){const f=$('#jm-pdp-practice');if(f){const d=l.diagnostics?.find(e=>e?.subjectId===member.id);const p=document.createElement('p');p.className='jm-pdp-frame';p.textContent=member.name+' · '+l.route+(d?' · Semakan awal '+d.correct+'/3':'');f.querySelector('h3').after(p);}}
 if(phase===2){const p=panel24.querySelector('h2+p');if(p)p.textContent='Semua ahli berbincang. Penyumbang menaip dan menghantar jawapan yang dipersetujui.';}
 panel24.querySelectorAll('.jm-stimulus29').forEach(img=>{img.tabIndex=0;img.setAttribute('role','button');img.setAttribute('aria-label','Besarkan gambar situasi');img.onclick=()=>{zoomDialog.querySelector('img').src=img.src;zoomDialog.querySelector('img').alt=img.alt;zoomDialog.showModal();};img.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();img.click();}};});
 queue27();
};
const screenBefore29=lessonScreen27;lessonScreen27=function(){
 if(!modern29())return screenBefore29();const l=lesson24(),phase=eligible24(),st=state27();
 if(phase===1&&l.readPages.length===5&&readingReady26()&&st.reading!==true&&!l.identification){
  const q=Math.max(0,l.checks?.findIndex(e=>!e)??0);st.q=q;panel24.dataset.phase27=1;panel24.dataset.sub27='values';panel24.querySelectorAll('.jm-bacani-check').forEach((x,i)=>x.hidden=i!==q);
  nav27('Cari perbuatan dan nilai','Aktiviti 1 · Baca, Cari, Nilai · Soalan '+(q+1)+'/3','Simpan jawapan · Seterusnya →',async()=>{const card=panel24.querySelector('[data-check="'+q+'"]'),select=card.querySelector('select'),choice=card.querySelector('input:checked');if(!select.value||!choice){select.reportValidity();card.querySelector('input:not(:disabled)')?.reportValidity();return;}remember27();if(await saveLesson24({type:'lesson-check',index:q,evidence:Number(select.value),answer:Number(choice.value)})){const r=lesson24(),check=r.checks[q],item=lessonBank34(storyKey)[q],correct=check.answer===item.answer&&check.evidenceCorrect;showResponse28(correct?'Tahniah! Jawapan tepat.':'Mari semak jawapan.',item.value+': '+item.action+(correct?' Kamu berjaya menghubungkan perbuatan dengan nilai murni.':' Jawapan direkodkan. Dua mata ditolak bagi setiap pilihan yang kurang tepat. Kamu boleh meneruskan.'),go24);}}, {disabled:!canLead26(),status:'Penyumbang memilih jawapan sendiri selepas perbincangan.'});return;
 }
 if(phase===3&&!l.route){
  const f=$('#jm-diagnostic29');if(!f)return;const q=Math.min(2,st.diagnostic||0),cards=[...f.querySelectorAll('fieldset')];panel24.dataset.phase27=3;panel24.dataset.sub27='diagnostic';cards.forEach((c,i)=>c.hidden=i!==q);
  nav27('Semakan awal '+practiceMember28().name,'Aktiviti 3 · Soalan '+(q+1)+'/3',q<2?'Seterusnya →':'Lihat latihan saya →',()=>{const input=cards[q].querySelector('input:invalid');if(input){input.reportValidity();return;}remember27();if(q<2){st.diagnostic=q+1;saveWork();queue27();}else f.requestSubmit();},{disabled:!canLead26(),status:'Jawapan kamu menentukan latihan yang sesuai.',back:q?()=>{st.diagnostic--;queue27();}:null});return;
 }
 screenBefore29();if(phase===3&&l.route){$('#jm-status27').textContent='Latihan '+l.route+' untuk '+practiceMember28().name+'. Rakan membantu.';const count=$('#jm-pdp-practice')?.querySelectorAll('fieldset').length||0;if((st.practice||0)>=count)$('#jm-next27').textContent=l.practices.filter(Boolean).length<readingMembers26().length-1?'Simpan latihan · Giliran seterusnya →':'Simpan latihan · Ke penutup →';}
};
const paintBefore29=paint27;paint27=function(){paintBefore29();if(!active27()||!modern29())return;const member=contributor29(),row=$('#jm-contributor28');if(row){row.innerHTML=collaborative26()?'Penyumbang: <strong>'+safe(member?.name||'Menunggu ahli')+'</strong><span>Tekan butang sendiri · Rakan lain membantu</span>':'<strong>'+safe(profile.name)+'</strong><span>Lengkapkan tugasan kamu</span>';row.dataset.member=member?.id||'';row.hidden=!!aux27;}
 $('#jm-person27').textContent=collaborative26()?bookState().group+' · Semua ahli bekerjasama':profile.name;
 if(roomSession&&collaborative26()&&!canLead26()&&!aux27)$('#jm-status27').textContent='Giliran '+(member?.name||'rakan')+'. Bincang dan bantu rakan kamu.';
};
const turnRender29=renderTurn;renderTurn=function(){turnRender29();if(!modern29()||!collaborative26())return;$('#jm-turn-name').textContent='Penyumbang: '+(contributor29()?.name||'Menunggu ahli');$('#jm-turn-task').textContent='Penyumbang menekan butang sendiri. Semua ahli membantu mencari jawapan.';$('#jm-turn-help').textContent='Serahkan peranti kepada penyumbang yang namanya diserlahkan.';};
const teamRender29=renderTeam;renderTeam=function(){teamRender29();if(modern29()&&collaborative26()){$('#jm-start-fishing').textContent=canLead26()?'Simpan jawapan · Mula memancing →':'Menunggu penyumbang';$('#jm-discussion-help').textContent='Semua ahli berbincang. Penyumbang menaip dan menyimpan jawapan bersama.';}};
const modeBefore29=modeChanged;modeChanged=function(){modeBefore29();$('#jm-local-leader-field26').hidden=true;if(root.dataset.entryMode==='group'){$('.jm-entry-intro p').textContent='Empat ahli bekerjasama. Nama penyumbang diserlahkan; ahli itu menekan butang sendiri.';if($('#jm-local-setup h3'))$('#jm-local-setup h3').textContent='Nama empat ahli kumpulan';}$('#jm-local-setup>p').textContent='Serahkan peranti mengikut nama penyumbang. Setiap ahli mendapat latihan yang sesuai dengan semakan awalnya.';};$('#jm-play-mode').onchange=modeChanged;modeChanged();
$('#jm-teacher-leader-field26').hidden=true;
const teacherHelp29=teacherModeHelp23;teacherModeHelp23=function(){teacherHelp29();$('#jm-teacher-leader-field26').hidden=true;if($('#jm-teacher-mode').value!=='kendiri')roomHelp23.textContent='Satu kod untuk empat ahli. Setiap ahli masuk dengan nama sendiri. Penyumbang yang ditetapkan menghantar jawapan; ahli lain membantu.';};$('#jm-teacher-mode').addEventListener('change',teacherModeHelp23);teacherModeHelp23();
const lookupBefore29=lookupRoom21;lookupRoom21=async function(){const ok=await lookupBefore29();if(ok&&verifiedRoom21?.room.lessonVersion>=29){for(const o of $('#jm-student-role').options){const i=roleSequence.indexOf(o.value);if(i>=0)o.textContent='Ahli '+(i+1);}roomNotice21('Masuk dengan nama sendiri. Ikut giliran penyumbang yang diserlahkan.');}return ok;};$('#jm-check-code').onclick=lookupRoom21;
const roleBefore29=roleChanged;roleChanged=function(){roleBefore29();if(verifiedRoom21?.room.lessonVersion>=29)$('#jm-role-help').textContent='Semua ahli bekerjasama. Penyumbang yang dipaparkan menekan sendiri.';};$('#jm-student-role').onchange=roleChanged;
const extraBefore29=renderExtra27;renderExtra27=function(){extraBefore29();if(aux27==='tasks')extra27.querySelector(':scope>p:last-child').textContent='Semua ahli berbincang. Penyumbang menekan sendiri. Latihan Aktiviti 3 mengikut semakan awal setiap ahli.';};
helpText.roles='Semua ahli bekerjasama. Penyumbang yang namanya diserlahkan menekan butang sendiri. Rakan lain membantu.';

// A short sample from the supplied click recording, with no overlapping beeps.
let clickAudio29=null;root.addEventListener('click',e=>{const el=e.target.closest('button,a[href],summary,input,select,textarea,[role=button]');if(!el||el.disabled||!$('#jm-effects').checked||micState!=='idle'||pupilAudio26.busy())return;try{if(!clickAudio29)clickAudio29=new Audio(window.JoranPreviewResources?.['audio-ms/klik.mp3']||'audio-ms/klik.mp3');clickAudio29.currentTime=0;clickAudio29.volume=.65;clickAudio29.play().catch(()=>{});}catch{}},true);

// Deleted records must not remain as resumable pupils, even across browser tabs.
const tombstoneKey29='joran-minda-dipadam-v29',inactiveKey29='joran-minda-dinyahaktif-v29';
function inactiveIds29(){return new Set([...loadJSON(tombstoneKey29,[]),...loadJSON(inactiveKey29,[])]);}
function clearResume29(ids){
 const saved=loadJSON('joran-minda-sesi-v23',null);if(saved?.teamMembers?.some(m=>ids.includes(m.id))||ids.includes(saved?.profile?.id)){localStorage.removeItem('joran-minda-sesi-v23');if(saved.storageKey)localStorage.removeItem(saved.storageKey);}
 if(profile&&(ids.includes(profile.id)||teamMembers.some(m=>ids.includes(m.id)))){const keepView=view;clearInterval(roomPoll);stopVoice();profile=null;teamMembers=[];roomSession=null;roomData=null;sharedFlow=null;for(const k of Object.keys(books))delete books[k];if(storageKey)localStorage.removeItem(storageKey);storageKey='';finished=false;aux27='';resumeButton23.hidden=true;displayProfile();if(!['teacher','voice'].includes(keepView))showView('home');else queue27();}
 resumeButton23.hidden=!loadJSON('joran-minda-sesi-v23',null)?.profile;$('#jm-home-start').innerHTML='Mula PdP individu <span aria-hidden="true">▶</span>';
}
const persistBefore29=persistSession23;persistSession23=function(){if(profile&&inactiveIds29().has(profile.id))return;return persistBefore29();};
const restoreBefore29=restoreSession23;restoreSession23=async function(saved){if(saved?.teamMembers?.some(m=>inactiveIds29().has(m.id)))throw Error('Rekod ini telah dipadam. Mulakan pembelajaran baharu atau pulihkan rekod melalui ruang Guru.');return restoreBefore29(saved);};
const hideBefore29=hideRecords23;hideRecords23=async function(ids,hidden=true){await hideBefore29(ids,hidden);const applied=hidden?reportArchive23.some(r=>ids.includes(r.id)):teacherRecords.some(r=>ids.includes(r.id));if(applied){const set=new Set(loadJSON(inactiveKey29,[]));for(const id of ids)hidden?set.add(id):set.delete(id);storeJSON(inactiveKey29,[...set]);if(hidden)clearResume29(ids);}};
async function purge29(ids){
 const online=$('#jm-report-source').value==='online';if(online)await api({action:'report-purge',ids,confirm:true},teacherSession);
 else{if(ids.some(id=>!localRuns.find(r=>r.id===id)?.archived))throw Error('Senarai berubah. Muatkan semula rekod.');const tombstones=new Set(loadJSON(tombstoneKey29,[]));for(const id of ids)tombstones.add(id);if(!storeJSON(tombstoneKey29,[...tombstones]))throw Error('Simpanan pelayar gagal. Belum dipadam.');await pupilAudio26.removeMembers(ids);const remaining=localRuns.filter(r=>!ids.includes(r.id));if(!storeJSON('joran-minda-rekod-v7',remaining))throw Error('Rakaman dipadam tetapi senarai belum dapat disimpan. Tekan Padam kekal semula.');localRuns=remaining;}
 clearResume29(ids);pendingPupil26=pendingPupil26.filter(r=>!ids.includes(r.memberId));pupilTakes26=pupilTakes26.filter(r=>!ids.includes(r.memberId));await refreshReport();$('#jm-report-action-status').textContent='✓ Sejarah, jawapan dan rakaman murid yang dipilih telah dipadam kekal.';
}
const reportBefore29=renderReport;renderReport=function(){reportBefore29();
 for(const card of $$('.jm-report-group28')){const ids=card.dataset.reportMembers28.split(','),rows=teacherRecords.filter(r=>ids.includes(r.id)),l=rows[0]?.lesson,stage=card.querySelector('[data-report-stage28="3"]');if(stage&&l){stage.innerHTML='<summary>4. Aktiviti 3 · Latihan setiap ahli</summary>'+rows.map(r=>{const d=l.diagnostics?.find(e=>e?.subjectId===r.id),p=l.practices?.find(e=>e?.subjectId===r.id);return '<article><h4>'+safe(r.name)+'</h4><p>Semakan awal: '+(d?d.correct+'/3':'Belum direkodkan')+' · Latihan: <strong>'+safe(l.personalRoutes?.[r.id]||p?.route||'Belum dipilih')+'</strong></p><p>'+safe(p?[p.application,p.text].filter(Boolean).join(' · '):'Belum menghantar sumbangan')+'</p>'+(p?.answers?'<p>Padanan tepat: '+p.correct+'/'+p.answers.length+'</p>':'')+'</article>';}).join('');}}
 let box=$('#jm-clean-history29');if(!box){box=document.createElement('section');box.id='jm-clean-history29';archiveBox23.after(box);}box.hidden=!reportArchive23.length;box.innerHTML='<h3>Bersihkan sejarah</h3><p>'+reportArchive23.length+' rekod dalam senarai dipadam. Padam kekal turut membuang jawapan, rakaman bacaan dan akses sambung murid tersebut.</p><button type="button" class="jm-delete28" id="jm-purge-open29">Padam semua sejarah dipadam</button><div id="jm-purge-confirm29" hidden><p><strong>Padam kekal '+reportArchive23.length+' rekod ini?</strong> Tindakan ini tidak boleh dipulihkan. Rekod yang masih aktif dikekalkan.</p><button type="button" class="jm-delete28" id="jm-purge-yes29">Ya, padam kekal</button> <button type="button" class="jm-secondary" id="jm-purge-no29">Batal</button><p role="status" id="jm-purge-status29"></p></div>';
 $('#jm-purge-open29').onclick=()=>$('#jm-purge-confirm29').hidden=false;$('#jm-purge-no29').onclick=()=>$('#jm-purge-confirm29').hidden=true;$('#jm-purge-yes29').onclick=async()=>{const b=$('#jm-purge-yes29');b.disabled=true;try{await purge29(reportArchive23.map(r=>r.id));}catch(e){$('#jm-purge-status29').textContent=e.message;b.disabled=false;}};
};
window.addEventListener('storage',e=>{if([tombstoneKey29,inactiveKey29].includes(e.key)){const ids=[...inactiveIds29()];localRuns=loadJSON('joran-minda-rekod-v7',[]);clearResume29(ids);}});
const archived29=localRuns.filter(r=>r.archived).map(r=>r.id);if(archived29.length){storeJSON(inactiveKey29,[...new Set([...loadJSON(inactiveKey29,[]),...archived29])]);clearResume29(archived29);}
root.dataset.version='29';$('#jm-version').textContent='Joran Minda · Versi 29 · Setiap ahli menyumbang';

// Every instruction control has a bundled Malay guide when device speech is absent.
// This is an explicitly labelled short guide, not a substitute transcript of new directions.
const shortGuide29='Kamu boleh bermain mengikut masa sendiri. Baca arahan bagi setiap langkah. Minta bantuan guru jika kamu memerlukannya.';
const clipsBefore29=packagedMalayClip;packagedMalayClip=function(text){
 if(normalizeVoice(text)===normalizeVoice(narration28.cari)){const original=clipsBefore29('Baca petunjuk yang diberikan. Kemudian, pilih ayat yang menunjukkan perbuatan baik watak. Jika jawapan belum tepat, cuba sekali lagi. Tiada markah akan ditolak.');if(original)return {...original,duration:7.8};}
 return clipsBefore29(text);
};
const instructionBefore29=instructionText28;instructionText28=function(){
 if(view==='lesson'&&eligible24()===3){const l=lesson24();return !l.route?'Jawab tiga soalan semakan awal mengikut kefahaman sendiri. Jawapan kamu menentukan latihan pemulihan, pengukuhan atau pengayaan. Selepas itu, rakan boleh membantu.':l.route==='pemulihan'?'Baca petunjuk dan lihat gambar. Pilih nilai yang sesuai dengan perbuatan watak. Kemudian, lengkapkan ayat penerangan dengan bantuan rakan atau Guru.':l.route==='pengukuhan'?'Tentukan sama ada padanan nilai dengan perbuatan watak tepat atau perlu dibetulkan. Kemudian, tulis penerangan ringkas.': 'Cadangkan satu perbuatan baik yang baharu. Terangkan nilai murni yang ditunjukkan melalui perbuatan itu. Semua ahli boleh memberikan idea; penyumbang menghantar jawapan.';}
 return instructionBefore29();
};
function guideClip29(){if(view==='game')return step===0?narration28.baca:step===1?narration28.cari:step===2?narration28.nilai:step===4&&!bonusReady?narration28.peribahasa:narration28.pancing;if(view==='book'&&closeStage27!=='reflection')return narration28.buku;if(view==='lesson'&&eligible24()===1)return lesson24().readPages.length<5||state27().reading===true?narration28.baca:narration28.cari;return shortGuide29;}
hearInstructions28=async function(){
 const text=instructionText28(),target=$('#jm-status27');if(packagedMalayClip(text)||availableMalayVoices().length)return speakMalay(text,target);
 const short=guideClip29();root.dataset.audioGuide='ringkas';const playing=sequenceBefore23([short],target,'help'),ticket=voiceSequence;await playing;if(ticket===voiceSequence&&!/Tekan Dengar|belum|tidak dapat|gagal/i.test(target.textContent))audioMessage('Panduan ringkas selesai. Ikut arahan bertulis bagi tugasan ini.',target);
};
hearGuide=hearInstructions28;$('#jm-hear27').onclick=hearInstructions28;$('#jm-hear-guide').onclick=hearInstructions28;
$('#jm-entry-ai').onclick=()=>speakMalay('Sila pilih cara bermain. Kemudian, masukkan nama dan kelas. Jika bermain secara berkumpulan, tetapkan peranan setiap ahli.',$('#jm-entry-ai-status'));
$('#jm-test-ai').onclick=()=>sequenceBefore23([shortGuide29],$('#jm-ai-availability'),'help');
const availabilityBefore29=populateMalayVoices;populateMalayVoices=function(){availabilityBefore29();$('#jm-ai-availability').textContent='Panduan ringkas Bahasa Melayu tersedia dalam fail permainan. Bacaan penuh arahan V29, pilihan nilai dan maklum balas baharu masih memerlukan suara Bahasa Melayu peranti. '+(availableMalayVoices().length?'Suara Melayu peranti dikesan.':'Suara Melayu peranti belum dikesan; panduan ringkas digunakan untuk butang Dengar arahan.');};populateMalayVoices();
const audioPaint29=paint27;paint27=function(){audioPaint29();if(active27())$('#jm-hear27').textContent=packagedMalayClip(instructionText28())||availableMalayVoices().length?'Dengar arahan':'Dengar panduan ringkas';};

const pollBefore29=pollRoom;pollRoom=async function(){await pollBefore29();if(modern29()&&roomSession&&view==='lesson'&&eligible24()===1&&state27().reading!==true){const l=lesson24(),next=Array.from({length:5},(_,i)=>i).find(i=>!l.readPages.includes(i));if(next!==undefined&&page24!==next){page24=next;renderLesson24();}}};

const apiBefore29=api;api=async function(data,session=roomSession){try{return await apiBefore29(data,session);}catch(e){if(session&&session===roomSession&&[401,403,410].includes(e.status)&&/dipadam|Kunci bilik tidak sah|Murid tidak ditemui/.test(e.message)){const ids=teamMembers.map(m=>m.id);clearResume29(ids);showView('home');classStatus('Rekod sesi ini telah dipadam. Mulakan pembelajaran baharu.');}throw e;}};
const displayBefore29=displayProfile;displayProfile=function(){displayBefore29();if(profile&&collaborative26())$('#jm-student-label').textContent=bookState().group+' · '+profile.kelas+' · Semua ahli bekerjasama';};
