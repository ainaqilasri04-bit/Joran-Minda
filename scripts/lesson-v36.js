// V36: clear page-bound audio, guided responses and visible, stable controls.
const U36=JoranInclusive36,D36=U36.directions;
const putHTML36=(el,html)=>{if(el&&el.innerHTML!==html)el.innerHTML=html;};
const setText36=(el,text)=>{if(el&&el.textContent!==text)el.textContent=text;};
const speech36=(parts,target=$('#jm-status27'))=>speakSequence(parts,target);
function feedback36(title,parts,next){
 showResponse28(title,parts.join(' '),next);
 const hear=$('#jm-response-hear28');hear.onclick=()=>speech36(title.startsWith('Tahniah')?['Yeay!',...parts]:parts,$('#jm-response-audio28'));
 if($('#jm-effects').checked)hear.click();
}

// Keep the original five-page story and teacher takes. A player cannot move to a different page.
const pageAudioBefore36=listenPage;
listenPage=async function(page,button,note){
 const context=[view,storyKey,U36.pageFor(view,page24,readPage,bookPage)].join(':');
 if(!Number.isInteger(page)||page<0||page>4)return;
 stopVoice();const ticket=voiceSequence,key=storyKey;
 note.hidden=false;note.textContent='Memuatkan rakaman Guru untuk halaman '+(page+1)+'…';
 await restoreAudio();if(ticket!==voiceSequence||context!==[view,storyKey,U36.pageFor(view,page24,readPage,bookPage)].join(':'))return;
 if(roomSession&&!readingAudio(page,key))await roomReading(page);
 if(ticket!==voiceSequence||context!==[view,storyKey,U36.pageFor(view,page24,readPage,bookPage)].join(':'))return;
 const rec=readingAudio(page,key),expected=canonicalText23(key,page);
 if(!rec||!recordingMatches(rec,expected)){note.textContent='Rakaman Guru yang sepadan dengan halaman '+(page+1)+' belum ada. Rakam halaman ini dalam Studio suara.';return;}
 teacherButton33=button;button.dataset.idleLabel33=button.textContent;button.textContent='Sedang membaca halaman '+(page+1);
 try{const ok=await playMedia33(rec.url,expected,note,ticket,'teacher');if(ok&&ticket===voiceSequence){stopVoice();note.textContent='Bacaan halaman '+(page+1)+' selesai.';}}
 catch(e){if(ticket===voiceSequence){stopVoice();note.textContent=e.message;}}
};
// The earlier handler always played page three on the Cari step.
$('#jm-listen').onclick=()=>listenPage(readPage,$('#jm-listen'),$('#jm-audio-note'));
const messageBefore36=audioMessage;
audioMessage=function(message,target){
 if(root.dataset.speakingKind==='teacher'&&message.startsWith('Sedang dibaca:'))message='Suara Guru sedang membaca halaman yang dipaparkan.';
 messageBefore36(message,target);
};

presentReading35=function(){
 const stage=readStage35(),page=page24,l=lesson24(),done=l.readPages.includes(page)&&readingPageReady26(page),doc=JoranStory.lessonMake(storyKey,page,currentLessonVersion34());
 panel24.dataset.sub27='read';panel24.dataset.read35=String(stage);panel24.classList.remove('jm-whole-page35');
 let strip=panel24.querySelector('.jm-reading-steps35');if(!strip){strip=document.createElement('div');strip.className='jm-reading-steps35';panel24.prepend(strip);}putHTML36(strip,strip35(F35.stages,stage));
 const picture=panel24.querySelector('.jm-pdp-split>img'),paragraph=panel24.querySelector('.jm-pdp-reading');
 if(picture){const src=assets[storyKey+'-'+(page+1)];if(picture.getAttribute('src')!==src)picture.src=src;picture.alt=doc.title;}
 if(paragraph)putHTML36(paragraph,doc.sentences.map(t=>'<span class="jm-story-line35">'+syl(t)+'</span>').join(' '));
 panel24.querySelector('.jm-single-line35')?.remove();panel24.querySelector('.jm-compact35')?.remove();
 const listen=$('#jm-pdp-listen');if(listen){if(teacherButton33!==listen)setText36(listen,'Dengar Guru · Halaman '+(page+1));listen.onclick=()=>listenPage(page,listen,$('#jm-pdp-audio'));}
 const recorder=panel24.querySelector('.jm-recorder35');if(stage===2&&recorder&&strip.nextElementSibling!==recorder)strip.after(recorder);
 const back=()=>{if(stage>0)setReadStage35(stage-1);else if(page24>0){page24--;setReadStage35(2);renderLesson24();}else openReference30();};
 const phase='Aktiviti 1 · Ba — Baca · Halaman '+(page+1)+' / 5';
 if(stage<2)nav27(F35.stages[stage][1],phase,stage===0?'Baca cerita →':'Rakam bacaan →',()=>setReadStage35(stage+1),{status:'Halaman '+(page+1)+' daripada 5',back});
 else nav27('Rakam bacaan',phase,page<4?'Seterusnya: Halaman '+(page+2)+' →':'Seterusnya: Cari nilai →',async()=>{
  if(!readingPageReady26(page)||!canLead26())return;
  if(done){if(page<4){page24=page+1;focusState35().reads[readKey35()]=0;}else state27().reading=false;saveWork();renderLesson24();}
  else $('#jm-pdp-read')?.click();
 },{disabled:!readingPageReady26(page)||!canLead26(),status:readingPageReady26(page)?'✓ Rakaman halaman ini disimpan.':'Rakam halaman ini dahulu.',back});
};

const recorderBefore36=renderPupilAudio26;
renderPupilAudio26=function(container,page){
 recorderBefore36(container,page);const panel=container?.querySelector('.jm-pupil-audio26');if(!panel)return;
 panel.querySelectorAll('.jm-record-help35,.jm-record-history35').forEach(el=>el.remove());
 if(view!=='lesson'){
  panel.classList.add('jm-playback-only36');
  panel.querySelectorAll('[data-pupil-record],[data-pupil-stop]').forEach(el=>el.remove());
  for(const article of panel.querySelectorAll('article')){const latest=article.querySelector('details');article.querySelectorAll('details').forEach(d=>{if(d!==latest)d.remove();});if(latest)latest.open=true;}
  setText36(panel.querySelector('h3'),'Dengar bacaan semula · Halaman '+(page+1));
 }else{
  const help=document.createElement('ol');help.className='jm-record-steps36';help.innerHTML='<li>'+F35.icon('mic')+'<span>1. Tekan <b>Rakam bacaan</b>.</span></li><li>'+F35.icon('book')+'<span>2. Baca ayat di bawah.</span></li><li>'+F35.icon('check')+'<span>3. Tekan <b>Henti dan simpan</b>.</span></li>';panel.querySelector('h3').after(help);
 }
};

const checkMountBefore36=mountCheck35;
mountCheck35=function(card,i){
 checkMountBefore36(card,i);const question=U36.proofQuestions[storyKey][i];
 const prompt=card.querySelector('.jm-prompt29');if(prompt)putHTML36(prompt,syl(question));
 const hear=card.querySelector('.jm-hear-check35');if(hear)hear.onclick=()=>checkStage35(i)?speech36(lessonBank34(storyKey)[i].options.map(t=>t+'.')):speech36([question]);
};
const checkPresentBefore36=presentCheck35;
presentCheck35=function(){
 checkPresentBefore36();const q=state27().q||0,card=panel24.querySelector('[data-check="'+q+'"]');if(!card)return;if(checkStage35(q)!==0){const item=lessonBank34(storyKey)[q],doc=JoranStory.lessonMake(storyKey,item.page,currentLessonVersion34()),correct=doc.sentences.find(t=>t.includes(item.quote));putHTML36(card.querySelector('.jm-selected-proof35'),'<b>Ayat selepas semakan</b><br>'+syl(correct));return;}
 const select=card.querySelector('select'),item=lessonBank34(storyKey)[q],doc=JoranStory.lessonMake(storyKey,item.page,currentLessonVersion34());
 nav27('Ca — Cari jawapan dalam cerita','Aktiviti 1 · Soalan '+(q+1)+' / 3','Semak ayat →',()=>{
  if(select.value==='')return;const expected=doc.sentences.findIndex(t=>t.includes(item.quote)),ok=Number(select.value)===expected;
  // The submitted choice stays unchanged for assessment, including wrong choices.
  feedback36(ok?'Tahniah! Ayat tepat.':'Mari semak ayat.',[ok?D36.correctProof:D36.wrongProof,doc.sentences[expected]],()=>setCheckStage35(q,1));
 },{disabled:select.value===''||!canLead26(),status:'Pilih satu ayat yang menjawab soalan.',back:()=>{const st=state27();if(q>0){st.q=q-1;st.reviewCheck42=q-1;setCheckStage35(q-1,1);}else{st.reading=true;page24=4;setReadStage35(2);renderLesson24();}}});
};

// Two explicit choices form an explanation. Typing is an optional extension.
presentExplanation35=function(){
 const l=lesson24(),index=l.explanations[0]?1:0,form=panel24.querySelector('[data-pdp-explain="'+index+'"]');if(!form)return;
 mountExplanation35(form,index);const stage=explanationStage35(index),value=form.querySelector('[name=value]'),proof=form.querySelector('[name=proofIndex]'),text=form.querySelector('[name=text]'),bank=lessonBank34(storyKey),other=l.explanations[1-index]?.value;
 form.dataset.explainStage35=String(stage);
 let values=form.querySelector('.jm-value-buttons36');if(!values){values=document.createElement('div');values.className='jm-value-buttons36';value.after(values);values.innerHTML=bank.map((b,i)=>'<button type="button" data-explain-value36="'+i+'">'+F35.icon('heart')+'<span>'+syl(b.value)+'</span></button>').join('');
  values.querySelectorAll('button').forEach(b=>b.onclick=()=>{if(!canLead26())return;value.value=bank[Number(b.dataset.explainValue36)].value;text.dataset.auto36='';remember27();queue27();});}
 values.querySelectorAll('button').forEach(b=>{const v=bank[Number(b.dataset.explainValue36)].value;b.setAttribute('aria-pressed',String(value.value===v));const blocked=!canLead26()||other===v;if(b.disabled!==blocked)b.disabled=blocked;});
 for(const option of value.options){const disabled=option.value===other;if(option.disabled!==disabled)option.disabled=disabled;}
 form.querySelectorAll('[data-proof35]').forEach(b=>{b.setAttribute('aria-pressed',String(b.dataset.proof35===proof.value));const blocked=!canLead26();if(b.disabled!==blocked)b.disabled=blocked;b.onclick=()=>{if(!canLead26())return;proof.value=b.dataset.proof35;text.dataset.auto36='';remember27();queue27();};});
 const chosen=proof.value===''?null:bank[Number(proof.value)],scene=form.querySelector('.jm-explain-scene35 img');if(scene&&chosen){const src=assets[storyKey+'-'+(chosen.page+1)];if(scene.getAttribute('src')!==src)scene.src=src;}
 let review=form.querySelector('.jm-guided-review36');if(!review){review=document.createElement('div');review.className='jm-guided-review36';review.innerHTML='<p class="jm-guided-caption36">Ayat daripada pilihan kamu</p><p class="jm-guided-sentence36"></p><button type="button" class="jm-secondary" data-hear-guided36>Dengar ayat saya</button>';form.append(review);
  const optional=document.createElement('details');optional.className='jm-optional36';optional.innerHTML='<summary>Tambah ayat sendiri (pilihan)</summary>';text.closest('label').before(optional);optional.append(text.closest('label'));review.append(optional);}
 if(value.value&&chosen){const sentence=U36.sentence(value.value,chosen.action);putHTML36(review.querySelector('.jm-guided-sentence36'),syl(sentence));if(!text.dataset.auto36){text.value=sentence;text.dataset.auto36='true';remember27();}review.querySelector('[data-hear-guided36]').onclick=()=>speech36([U36.sentence(value.value,chosen.action)]);}
 const strip=form.querySelector('.jm-explain-steps35')||document.createElement('div');strip.className='jm-explain-steps35';putHTML36(strip,strip35([['heart','Pilih nilai'],['search','Pilih perbuatan'],['check','Semak ayat']],stage));if(!strip.parentNode)form.prepend(strip);
 nav27(['Pilih nilai murni','Pilih perbuatan watak','Baca penerangan kamu'][stage],'Aktiviti 2 · Penjelasan '+(index+1)+' / 2',['Pilih perbuatan →','Semak ayat saya →','Simpan penjelasan →'][stage],()=>{
  if(stage===0){if(!value.value||value.value===other)return;setExplanationStage35(index,1);}
  else if(stage===1){if(proof.value==='')return;setExplanationStage35(index,2);}
  else form.requestSubmit();
 },{disabled:!canLead26()||(stage===0?(!value.value||value.value===other):proof.value===''),status:stage===2?'Baca ayat kamu. Menulis tambahan ialah pilihan.':'Langkah '+(stage+1)+' daripada 3',back:stage?()=>setExplanationStage35(index,stage-1):openReference30});
};

const storyPageBefore36=storyPage;
storyPage=function(){const d=storyPageBefore36();if(isV25Story())return {...d,clue:U36.findQuestions[storyKey][readPage]||d.clue,question:U36.fishingQuestions[storyKey][readPage]||d.question};return d;};
fishingText30=function(){return bonus?'Apakah maksud peribahasa '+stories[storyKey].bonus+'?':U36.fishingQuestions[storyKey][readPage];};
const teamBefore36=renderTeam;
renderTeam=function(){
 teamBefore36();if(!isV25Story()||![2,4].includes(step))return;
 const choices=step===4?stories[storyKey].meaning:storyPage().labels,box=$('#jm-choice-cards'),input=$('#jm-discussion-notes');
 box.classList.add('jm-choice-buttons36');
 box.innerHTML=choices.map((choice,i)=>'<article class="jm-choice-card"><button type="button" class="jm-pick-note36" data-note-choice36="'+i+'" aria-pressed="false">'+F35.icon(step===4?'book':'heart')+'<span>'+syl(choice)+'</span></button><button type="button" class="jm-secondary" data-note-hear36="'+i+'">Dengar pilihan</button></article>').join('');
 let summary=$('#jm-note-summary36');if(!summary){summary=document.createElement('p');summary.id='jm-note-summary36';summary.className='jm-guided-sentence36';$('.jm-notes-form').prepend(summary);}
 const saved=step===4?bookState().bonusNotes:bookState().pageNotes[readPage];putHTML36(summary,syl(saved||'Tekan satu pilihan di atas.'));
 box.querySelectorAll('[data-note-choice36]').forEach(b=>{b.disabled=!myTurn();b.onclick=()=>{if(!myTurn())return;const choice=choices[Number(b.dataset.noteChoice36)],sentence=step===4?'Maksud pilihan saya: '+choice+'.':U36.sentence(choice,storyPage().sentences[storyPage().evidence]);input.value=sentence;input.oninput?.();putHTML36(summary,syl(sentence));box.querySelectorAll('[data-note-choice36]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));queue27();};});
 box.querySelectorAll('[data-note-hear36]').forEach(b=>b.onclick=()=>speech36([choices[Number(b.dataset.noteHear36)]+'.']));
 if(!input.closest('.jm-optional36')){const detail=document.createElement('details');detail.className='jm-optional36';detail.innerHTML='<summary>Tambah catatan sendiri (pilihan)</summary>';input.closest('label').before(detail);detail.append(input.closest('label'));}
};
const gameScreenBefore36=gameScreen27;
gameScreen27=function(){gameScreenBefore36();
 if(step===2||step===4&&!bonusReady){const before=$('#jm-start-fishing');nav27(step===4?'Pilih maksud peribahasa':'Pilih nilai kamu','Aktiviti 2 · '+(step===4?'Peribahasa':'Halaman '+(readPage+1)+' / 5'),'Mula memancing →',()=>before.click(),{disabled:before.disabled,status:'Tekan satu pilihan. Ayat disediakan untuk kamu.',back:openReference30});}
};

function choiceButton36(text,attr,value,selected=false){return '<button type="button" class="jm-choice36" '+attr+'="'+value+'" aria-pressed="'+selected+'">'+'<span class="jm-choice-label37">'+syl(text)+'</span></button>';}
function practiceState36(){const st=state27(),key=storyKey+':'+practiceMember28().id;if(!st.support36)st.support36={};return st.support36[key]||(st.support36[key]={matchPage:0,summary:null,action:null,value:null});}
function presentMatching36(){
 const f=$('#jm-pdp-practice'),s=matchState32(),st=practiceState36(),bank=lessonBank34(storyKey),member=practiceMember28();if(!f)return;
 const index=Math.min(2,st.matchPage||0),key=member.id+':'+s.step+':'+index;
 if(f.dataset.support36!==key){f.dataset.support36=key;f.removeAttribute('data-question27');f.onsubmit=e=>e.preventDefault();
  f.innerHTML='<header class="jm-practice-heading32"><h3>Latihan Pemulihan</h3><p>'+safe(member.name)+' · '+(s.step?'Semak satu ayat':'Padanan '+(index+1)+' daripada 3')+'</p></header>'+(s.step?'<div class="jm-summary-choices36">'+bank.map((b,i)=>choiceButton36(b.action,'data-match-summary36',i,st.summary===i)).join('')+'</div><p class="jm-guided-sentence36" id="jm-match-summary36"></p>':'<div class="jm-match-simple36">'+photo35(bank[index].page,'Lihat perbuatan watak')+'<div><p class="jm-action36">'+syl(bank[index].action)+'</p><p>Apakah nilai yang sepadan?</p><div class="jm-value-buttons36">'+[2,0,1].map(i=>choiceButton36(bank[i].value,'data-match-pick36',i,s.pairs[index]===i)).join('')+'</div></div></div>');
  f.querySelectorAll('[data-match-pick36]').forEach(b=>b.onclick=()=>{if(!canLead26())return;s.pairs=U36.choosePair(s.pairs,index,Number(b.dataset.matchPick36));s.selected=index;saveWork();queue27();});
  f.querySelectorAll('[data-match-summary36]').forEach(b=>b.onclick=()=>{if(!canLead26())return;st.summary=Number(b.dataset.matchSummary36);const i=st.summary;s.text=U36.sentence(bank[s.pairs[i]].value,bank[i].action);saveWork();queue27();});
 }
 f.querySelectorAll('[data-match-pick36]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.matchPick36)===s.pairs[index])));
 f.querySelectorAll('[data-match-summary36]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.matchSummary36)===st.summary)));
 if(s.step)setText36($('#jm-match-summary36'),s.text||'Pilih satu perbuatan di atas.');
 nav27('Latihan Pemulihan','Aktiviti 3 · '+member.name,s.step?'Simpan latihan →':index<2?'Seterusnya →':'Seterusnya: Semak ayat →',async()=>{
  if(!s.step){if(s.pairs[index]===null)return;if(index<2)st.matchPage=index+1;else if(s.pairs.every(x=>x!==null))s.step=1;else st.matchPage=s.pairs.findIndex(x=>x===null);saveWork();queue27();return;}
  if(st.summary===null||!s.text||savingMatch32)return;savingMatch32=true;
  try{if(await saveLesson24({type:'lesson-practice',activity:'matching',matches:s.pairs.slice(),text:s.text})){const correct=s.pairs.filter((v,i)=>v===i).length;showResponse28(correct===3?'Tahniah! Tiga padanan tepat.':'Latihan disimpan. Mari semak.',correct+' daripada 3 padanan tepat. '+(correct<3?'Potongan '+((3-correct)*2)+' mata daripada Aktiviti 3. ':'')+'Padanan yang betul: '+bank.map((b,i)=>(i+1)+'. '+b.action+' Nilainya ialah '+b.value.toLowerCase()+'.').join(' '),go24);}}
  finally{savingMatch32=false;}
 },{disabled:!canLead26()||savingMatch32||(s.step?st.summary===null:s.pairs[index]===null),status:s.step?'Baca ayat daripada padanan kamu.':'Satu gambar, satu padanan.',back:()=>{if(s.step)s.step=0;else st.matchPage=Math.max(0,index-1);saveWork();queue27();}});
}
function presentOtherPractice36(){
 const l=lesson24(),f=$('#jm-pdp-practice');if(!f||!l.route||l.route==='pemulihan')return;
 const st=practiceState36(),member=practiceMember28(),bank=lessonBank34(storyKey),count=f.querySelectorAll('fieldset').length;
 const answering=l.route==='pengukuhan'&&(state27().practice||0)<count;const existing=f.querySelector('.jm-guided-practice36');if(existing)existing.hidden=answering;f.querySelectorAll(':scope>.jm-optional36').forEach(d=>d.hidden=answering);if(answering)return;
 const text=f.querySelector('[name=text]');if(!text)return;
 if(!f.querySelector('.jm-guided-practice36')){
  const guide=document.createElement('section');guide.className='jm-guided-practice36';
  if(l.route==='pengayaan'){const data=U36.transfer[storyKey];guide.innerHTML='<h3>Latihan Pengayaan</h3><p class="jm-action36">'+syl(data.prompt)+'</p><div class="jm-guided-actions36">'+data.actions.map((a,i)=>choiceButton36(a,'data-transfer-action36',i)).join('')+'</div><p>Pilih nilai bagi tindakan kamu.</p><div class="jm-value-buttons36">'+data.values.map((a,i)=>choiceButton36(a,'data-transfer-value36',i)).join('')+'</div><p class="jm-guided-sentence36" id="jm-practice-sentence36"></p>';
   for(const p of f.querySelectorAll(':scope>p'))p.hidden=true;
  }else guide.innerHTML='<h3>Latihan Pengukuhan</h3><p>Pilih satu ayat tentang perbuatan baik.</p><div class="jm-summary-choices36">'+bank.map((b,i)=>choiceButton36(U36.sentence(b.value,b.action),'data-reinforce36',i)).join('')+'</div><p class="jm-guided-sentence36" id="jm-practice-sentence36"></p>';
  f.append(guide);
  for(const label of f.querySelectorAll(':scope>label')){const detail=document.createElement('details');detail.className='jm-optional36';detail.innerHTML='<summary>Tambah idea sendiri (pilihan)</summary>';label.before(detail);detail.append(label);}
  guide.querySelectorAll('[data-reinforce36]').forEach(b=>b.onclick=()=>{if(!canLead26())return;st.summary=Number(b.dataset.reinforce36);text.value=U36.sentence(bank[st.summary].value,bank[st.summary].action);remember27();queue27();});
  guide.querySelectorAll('[data-transfer-action36]').forEach(b=>b.onclick=()=>{if(!canLead26())return;st.action=Number(b.dataset.transferAction36);f.querySelector('[name=application]').value=U36.transfer[storyKey].actions[st.action];remember27();queue27();});
  guide.querySelectorAll('[data-transfer-value36]').forEach(b=>b.onclick=()=>{if(!canLead26())return;st.value=Number(b.dataset.transferValue36);remember27();queue27();});
 }
 if(l.route==='pengayaan'&&st.action!==null&&st.value!==null){const d=U36.transfer[storyKey],key=st.action+':'+st.value;if(text.dataset.choices36!==key){text.value=U36.sentence(d.values[st.value],f.querySelector('[name=application]').value||d.actions[st.action]);text.dataset.choices36=key;remember27();}}
 setText36($('#jm-practice-sentence36'),text.value||'Pilih jawapan di atas.');
 for(const [attr,selected]of [['data-reinforce36',st.summary],['data-transfer-action36',st.action],['data-transfer-value36',st.value]])f.querySelectorAll('['+attr+']').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.getAttribute(attr))===selected)));
 nav27(l.route==='pengayaan'?'Latihan Pengayaan':'Latihan Pengukuhan','Aktiviti 3 · '+member.name,'Simpan latihan →',()=>f.requestSubmit(),{disabled:!canLead26()||!text.value.trim()||(l.route==='pengayaan'&&(st.action===null||st.value===null)),status:'Baca ayat pilihan kamu. Tambahan tulisan ialah pilihan.',back:()=>{if(l.route==='pengukuhan'){state27().practice=count-1;queue27();}else openReference30();}});
}
const lessonScreenBefore36=lessonScreen27;
lessonScreen27=function(){if(active27()&&!aux27&&matching32()){panel24.dataset.phase27='3';panel24.dataset.sub27='practice';panel24.dataset.focusMode35='practice';presentMatching36();return;}lessonScreenBefore36();if(!active27()||aux27)return;if(eligible24()===3)presentOtherPractice36();};

const bookScreenBefore36=bookScreen27;
bookScreen27=function(){bookScreenBefore36();if(closeStage27!=='reflection')return;const input=$('#jm-reflect27');if(!input)return;const prompt=closing27.querySelector('h2+p');setText36(prompt,'Pilih satu amalan baik di bawah.');for(const p of closing27.querySelectorAll(':scope>p'))if(p!==prompt&&!p.classList.contains('jm-pdp-kicker')&&!p.id)p.remove();
 const choices=document.createElement('div');choices.className='jm-reflection-choices36';choices.innerHTML=U36.reflections[storyKey].map((t,i)=>choiceButton36(t,'data-reflect36',i,input.value===t)).join('');input.before(choices);
 choices.querySelectorAll('button').forEach(b=>{b.disabled=!canLead26();b.onclick=()=>{input.value=U36.reflections[storyKey][Number(b.dataset.reflect36)];input.oninput?.();choices.querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));};});
 const extra=document.createElement('details');extra.className='jm-optional36';extra.innerHTML='<summary>Tulis refleksi sendiri (pilihan)</summary>';input.before(extra);extra.append(input);
};

shortDirection35=function(){
 if(aux27)return {icon:'check',text:instructionBefore35()};
 if(view==='book')return {icon:'book',text:closeStage27==='reflection'?D36.reflection:D36.review};
 if(view==='game')return {icon:step<2?'book':step===2?'heart':'fish',text:step===0?D36.reread:step===1?D36.find:step===2?D36.notes:step===4&&!bonusReady?D36.bonus:D36.fish};
 const phase=eligible24(),l=lesson24();if(phase===0)return {icon:'puzzle',text:l.puzzle?D36.idea:D36.puzzle};
 if(readingScreen35())return {icon:['eye','book','mic'][readStage35()],text:readStage35()===0?D36.look:readStage35()===1?D36.read:pupilAudio26.busy()?D36.recording:readingPageReady26(page24)?D36.recorded:D36.record};
 if(phase===1)return {icon:'search',text:checkStage35(state27().q||0)?D36.value:D36.proof};
 if(phase===2)return {icon:'heart',text:[D36.explainValue,D36.explainAction,D36.explainReview][explanationStage35(l.explanations[0]?1:0)]};
 if(diagnostic30())return {icon:'person',text:D36.diagnostic};
 if(matching32())return {icon:'match',text:matchState32().step?D36.matchReview:D36.matching};
 if(phase===3)return {icon:'pencil',text:l.route==='pengayaan'?D36.enrich:(state27().practice||0)<2?D36.reinforcement:D36.reinforceReview};
 return {icon:'check',text:D36.saved};
};

// Home has three clear entry points. Teacher results and studio remain one click away.
const homeTeacher36=document.createElement('button');homeTeacher36.type='button';homeTeacher36.className='jm-start-game jm-teacher-entry36';homeTeacher36.textContent='Guru · Keputusan dan suara';homeTeacher36.onclick=()=>showView('teacher');$('#jm-home-group').after(homeTeacher36);
const teacherStudio36=document.createElement('button');teacherStudio36.type='button';teacherStudio36.className='jm-secondary';teacherStudio36.textContent='Studio suara Guru';teacherStudio36.onclick=()=>showView('voice');$('[data-panel=teacher]').prepend(teacherStudio36);
const paintBefore36=paint27;
paint27=function(){paintBefore36();root.dataset.home36=String(view==='home');if(!active27())return;
 for(const button of root.querySelectorAll('button[data-help="notes"],button[data-help="bonusNotes"],#jm-hear-notes')){button.hidden=true;if(button.stop30)button.stop30.hidden=true;}
 for(const button of root.querySelectorAll('button'))if(/Dengar cara mencatat/.test(button.textContent)){button.hidden=true;if(button.stop30)button.stop30.hidden=true;}
 const row=$('#jm-contributor28');if(row)row.classList.add('jm-name36');
 $('#jm-hear27').onclick=hearInstructions28;
};
root.dataset.version='36';$('#jm-version').textContent='Joran Minda · Versi 36 · Baca, pilih dan belajar bersama';
queue27();
