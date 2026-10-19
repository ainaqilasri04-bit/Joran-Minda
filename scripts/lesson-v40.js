// V40: clear spoken result, visible whole fish, distinct tasks, two report tabs.
const Q40=JoranQuestions40;
for(const word of JSON.stringify(Q40).match(/[a-z]+(?:-[a-z]+)*/ig)||[])if(!dict[word.toLowerCase()])dict[word.toLowerCase()]=splitMalay28(word.toLowerCase());
// Split the same panorama at the water line so every fish lane stays underwater.
$('.jm-scenery').innerHTML='<div class="jm-sky-panorama40"><img src="'+panorama32+'" alt="Hana, Iman dan Tok Wan memancing di tasik."></div><div class="jm-water-panorama40"><img src="'+panorama32+'" alt=""></div>';
const pageBefore40=storyPage;
storyPage=function(){const d=pageBefore40();if(currentLessonVersion34()<40)return d;const q=Q40.fishing[storyKey][readPage];return {...d,question:q.prompt,labels:q.options.map(o=>o.text),answer:q.answer,answerPictures:q.options.map(o=>o.image)};};
const fishingBefore40=fishingText30;
fishingText30=function(){return currentLessonVersion34()>=40&&!bonus?storyPage().question:fishingBefore40();};
const promptBefore40=notePrompt37;
notePrompt37=function(){return currentLessonVersion34()>=40&&step!==4?storyPage().question+' Pilih satu jawapan.':promptBefore40();};
const practiceBefore40=practiceQuestions38;
practiceQuestions38=()=>currentLessonVersion34()>=40?Q40.forStory(storyKey,lesson24().route):practiceBefore40();

const imageBefore40=choiceImage39;
choiceImage39=function(text){if(currentLessonVersion34()>=40){const normalize=s=>s.trim().replace(/[.!?]+$/,'');for(const q of Q40.fishing[storyKey]){const o=q.options.find(o=>normalize(o.text)===normalize(text));if(o)return o.image;}}return imageBefore40(text);};
const teamBefore40=renderTeam;
renderTeam=function(){teamBefore40();if(currentLessonVersion34()<40||step!==2)return;
 const input=$('#jm-discussion-notes'),choices=storyPage().labels;
 for(const b of root.querySelectorAll('[data-note-choice36]'))b.onclick=()=>{if(!myTurn())return;input.value=choices[Number(b.dataset.noteChoice36)];input.oninput?.();putHTML36($('#jm-note-summary36'),syl(input.value));$('#jm-note-edit37').disabled=false;for(const other of root.querySelectorAll('[data-note-choice36]'))other.setAttribute('aria-pressed',String(other===b));queue27();};
 const audio=root.querySelector('.jm-note-audio37 button');if(audio)audio.onclick=()=>speech36(choices);
};
const screenBefore40=gameScreen27;
gameScreen27=function(){screenBefore40();if(currentLessonVersion34()<40)return;if(step===2){setText36($('#jm-title27'),'Pilih jawapan cerita');setText36($('#jm-status27'),isSolo()?'Pilih jawapan, kemudian pancing ikan.':'Pilih jawapan bersama, kemudian pancing ikan.');}else if(step===3&&!bonus)setText36($('#jm-title27'),'Pancing jawapan cerita');};
const castBefore40=updateCast;
updateCast=function(){castBefore40();if(currentLessonVersion34()>=40&&!bonus)$('#jm-fishing-mode').textContent='Pancing jawapan cerita';};
$('#jm-home-how').addEventListener('click',()=>{const list=$('#jm-how-screen ol');list.innerHTML=list.innerHTML.replace('pancing nilai, kumpulkan lima halaman','pancing jawapan tentang cerita, kumpulkan lima halaman');});

// The result is spoken first on both automatic playback and replay. Stop remains paired.
function response40(title,parts,next){
 const good=title.startsWith('Tahniah');
 const incorrect=!good&&(/belum tepat|semak|jawapan|padanan|penerangan/i.test(title)||parts.some(t=>/mata ditolak|kurang tepat|belum tepat|potongan/i.test(t)));
 let payload=parts.map(t=>t.replace(/\.{2,}/g,'.'));
 if(currentLessonVersion34()>=40)payload=payload.map(t=>t.replace('Kamu berjaya mengenal pasti nilai murni: ','Kamu berjaya memilih jawapan tentang cerita: '));
 const heading=good?title:incorrect?Q40.texts.wrong:title;
 const prefix=incorrect?Q40.texts.wrong:good&&!payload[0]?.startsWith('Tahniah')?Q40.texts.right:'';
 if(incorrect)payload=payload.map(t=>t.replace(/^Jawapan belum tepat\.\s*/,'')).filter(Boolean);
 const spoken=prefix?[prefix,...payload]:payload;
 response38(heading,spoken,next);
 // The heading already displays the opening sentence, so do not repeat it in the body.
 if(prefix)putHTML36($('#jm-response-copy38'),syl(payload.join(' ')));
 response28.dataset.result40=good?'correct':incorrect?'incorrect':'saved';
}
showResponse28=(title,text,next)=>response40(title,[text],next);
feedback36=(title,parts,next)=>response40(title,parts,next);

const paintBefore40=paint27;
paint27=function(){paintBefore40();if(!active27())return;
 for(const fish of root.querySelectorAll('.jm-fish')){
  const label=fish.querySelector('.jm-fish-label');if(label&&label.parentElement!==fish)fish.append(label);
  const img=fish.querySelector('.jm-fish-art');if(img)img.setAttribute('alt','');
 }
 if(currentLessonVersion34()>=40&&view==='lesson'&&eligible24()===3&&lesson24().route&&!lesson24().practiced){
  const route=lesson24().route;
  setText36($('#jm-status27'),'');
  const f=$('#jm-pdp-practice');if(f)f.dataset.task40=route;
 }
};

exportRecords=async function(){const button=$('#jm-download-report'),status=$('#jm-report-action-status');button.disabled=true;
 try{
  // Export the selected source freshly, without changing the teacher's current mode tab.
  let records;
  if($('#jm-report-source').value==='online'){
   if(!teacherSession)throw Error('Pilih bilik Guru dahulu.');
   records=(await api({action:'report'},teacherSession)).records||[];
  }else{await refreshPupilAudio26();localRuns=loadJSON('joran-minda-rekod-v7',localRuns);records=localRuns.filter(r=>!r.archived).map(localReport23);}
  teacherRecords=records;const takes=await reportTakes32(),rows=JoranReport31.comparisonRows40(records,takes,stories);
  downloadBlob(JoranReport31.workbook40(records,takes,stories),'pencapaian-individu-dan-kumpulan.xlsx');
  status.textContent='Excel dimuat turun: '+rows[0].length+' rekod individu dan '+rows[1].length+' rekod ahli kumpulan. Semua ahli disenaraikan dalam helaian Kumpulan.';
 }catch(e){status.textContent='Excel belum dapat disediakan: '+e.message;}finally{button.disabled=false;}
};
$('#jm-download-report').onclick=exportRecords;
root.dataset.version='40';$('#jm-version').textContent='Joran Minda · Versi 40 · Soalan berbeza dan ikan jelas';queue27();
