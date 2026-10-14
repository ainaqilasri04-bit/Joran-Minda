// V34: different exercises at each stage; old rooms keep their original keys.
function currentLessonVersion34(){return roomSession?(roomData?.room.lessonVersion||24):(localRuns.find(r=>r.id===profile?.id)?.lessonVersion||34);}
function lessonBank34(key=storyKey,version=currentLessonVersion34()){return L24.bankFor(key,version);}
const questionBefore34=question24;
question24=function(item,i,prefix,saved){
 if(!item.prompt)return questionBefore34(item,i,prefix,saved);
 const spoken=item.prompt+' Pilihan jawapan: '+item.options.join('. ')+'.';
 return '<fieldset class="jm-pdp-question"><legend>Soalan '+(i+1)+'</legend><p>'+syl(item.prompt)+'</p>'+item.options.map((option,j)=>'<label><input type="radio" name="'+prefix+i+'" value="'+j+'" '+(saved?.[i]===j?'checked':'')+' required> '+syl(option)+'</label>').join('')+'<button type="button" class="jm-secondary" data-hear-check30="'+safe(spoken)+'">Dengar soalan dan pilihan</button></fieldset>';
};
const directionsBefore34=instructionText28;
instructionText28=function(){
 if(currentLessonVersion34()>=34&&diagnostic30())return 'Jawab sendiri dahulu tanpa bantuan rakan. Baca setiap soalan dan pilih satu jawapan. Jawapan tiga soalan ini menentukan latihan kamu: pemulihan, pengukuhan atau pengayaan. Selepas semakan awal, kamu boleh berbincang dengan rakan.';
 if(currentLessonVersion34()>=34&&view==='lesson'&&!aux27&&eligible24()===3&&lesson24().route==='pengukuhan')return 'Baca setiap situasi. Pilih tindakan atau sebab yang paling sesuai. Kemudian, pilih satu jawapan kamu dan terangkan sebabnya. Rakan boleh membantu selepas kamu mencuba sendiri.';
 if(currentLessonVersion34()>=34&&view==='lesson'&&!aux27&&eligible24()===3&&lesson24().route==='pengayaan')return JoranQuestions34.enrichment[storyKey];
 return directionsBefore34();
};
const fishingBefore34=fishingText30;
fishingText30=function(){return currentLessonVersion34()>=34&&!bonus?'Ayat bukti: '+storyPage().sentences[storyPage().evidence]+' '+storyPage().question:fishingBefore34();};
const teamBefore34=renderTeam;
renderTeam=function(){teamBefore34();if(currentLessonVersion34()>=34&&step<4)$('#jm-value-question').textContent=storyPage().question;};
const screenBefore34=lessonScreen27;
lessonScreen27=function(){screenBefore34();if(currentLessonVersion34()>=34&&eligible24()===3&&lesson24().route==='pengukuhan'){
 if((state27().practice||0)<2)$('#jm-title27').textContent='Pilih tindakan atau sebab';
 $('#jm-status27').textContent='Latihan pengukuhan untuk '+practiceMember28().name+'. Pilih jawapan dan terangkan sebabnya.';
}};
// The final poll wrapper covers state, recordings, lesson progression and book edits.
const pollBefore34=pollRoom;
pollRoom=JoranRoomSync.coalesce(()=>pollBefore34());
// Refresh promptly after a connection or tab returns; never submit a pupil answer automatically.
window.addEventListener('online',()=>{if(roomSession)pollRoom();});
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&roomSession)pollRoom();});
checkService21.onclick=async()=>{
 checkService21.disabled=true;teacherNotice21.dataset.error='false';teacherNotice21.textContent='Sedang menyemak sambungan bilik…';
 try{const result=await api({action:'ping'},null);if(result.service!=='joran-minda-kelas'||!result.lessonVersions?.includes(34))throw Error('Enjin bilik belum dikemas kini kepada versi 34. Terbitkan keseluruhan projek melalui GitHub supaya fungsi bilik turut dibina.');teacherNotice21.textContent='✓ Sambungan bilik versi 34 tersedia. Cipta bilik baharu untuk menggunakan soalan baharu.';}
 catch(e){teacherNotice21.dataset.error='true';teacherNotice21.textContent=e.message;}
 finally{checkService21.disabled=false;}
};
const apiBefore34=api;
api=async function(data,session=roomSession){
 if(data.action==='create'){
  const status=await apiBefore34({action:'ping'},null);
  if(!status.lessonVersions?.includes(34))throw Error('Enjin bilik belum versi 34. Kemas kini keseluruhan projek di GitHub dan tunggu penerbitan Netlify selesai. Kemudian, cipta bilik baharu.');
 }
 return apiBefore34(data,session);
};
// The recovery link may have an old session saved, so explain how rooms differ.
teacherHelp21.textContent='Isi kelas, pilih cerita dan mod. Satu kod kumpulan menempatkan empat ahli. Kod individu boleh digunakan oleh beberapa murid; kemajuan setiap murid diasingkan. Selepas mencipta bilik, kongsi pautan murid.';
root.dataset.version='34';$('#jm-version').textContent='Joran Minda · Versi 34 · Soalan pelbagai dan bilik disemak';

// Extend the existing syllable dictionary to all new instructions and choices.
for(const word of JSON.stringify(JoranQuestions34).match(/[a-z]+(?:-[a-z]+)*/ig)||[])if(!dict[word.toLowerCase()])dict[word.toLowerCase()]=splitMalay28(word.toLowerCase());

const journeyBefore34=renderJourney;
renderJourney=function(){
 if(!isV25Story())return journeyBefore34();
 const b=bookState();$('#jm-journey').hidden=!profile||!['game','book'].includes(view);
 $('#jm-journey-list').innerHTML=b.choices.length?b.choices.map((choice,i)=>{const p=JoranStory.lessonMake(storyKey,i,currentLessonVersion34());return '<li><strong>Halaman '+(i+1)+': '+safe(p.labels[choice])+'</strong><p>'+syl(p.outcomes[choice])+'</p></li>';}).join(''):'<li>Keputusan pertama kamu akan muncul di sini.</li>';
};
const notesBefore34=allNotes;
allNotes=function(b=bookState()){
 if(!isV25Story())return notesBefore34(b);
 return b.pageNotes.map((n,i)=>'Muka surat '+(i+1)+' · '+(b.choices[i]!==undefined?JoranStory.lessonMake(storyKey,i,currentLessonVersion34()).labels[b.choices[i]]:'Belum memilih')+'\n'+(n||'Belum ada catatan.')).join('\n\n')+'\n\nBonus peribahasa\n'+(b.bonusNotes||'Belum ada catatan.');
};

const pendingAudio34=(window.JoranVoiceCatalog?.clips||[]).filter(c=>!packagedMalayClip(c.text)).length;
if(pendingAudio34){const note=document.createElement('p');note.className='jm-pdp-frame';note.textContent='Semakan sebelum terbit: '+pendingAudio34+' teks baharu belum mempunyai fail suara. Rakaman cerita Guru dan audio terdahulu dikekalkan. Lengkapkan audio baharu dalam Studio semua suara sebelum digunakan pada peranti tanpa suara Bahasa Melayu.';teacherHelp21.after(note);}
