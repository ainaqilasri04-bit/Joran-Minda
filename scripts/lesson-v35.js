// V35: one visible action, meaningful images and staged instructions.
// Learning events, original story text, scoring, room protocol and recordings stay authoritative.
const F35=JoranFocus35;
for(const key of ['belang','pondok','pokok','sihat']){const path='assets/focus35/'+key+'-situasi.png';assets[key+'-1']=window.JoranPreviewResources?.[path]||path;}
function focusState35(){const st=state27();return st.focus35||(st.focus35={reads:{},checks:{},explanations:{}});}
function readingScreen35(){return view==='lesson'&&!aux27&&eligible24()===1&&(state27().reading===true||lesson24().readPages.length<5||!readingReady26());}
function readKey35(){return storyKey+':'+page24;}
function readStage35(){return F35.readStage(focusState35(),readKey35(),lesson24().readPages.includes(page24)&&readingPageReady26(page24));}
function setReadStage35(stage){stopVoice();focusState35().reads[readKey35()]=stage;saveWork();queue27();main27.scrollTop=0;}
function checkStage35(q){return focusState35().checks[storyKey+':'+q]||0;}
function setCheckStage35(q,n){stopVoice();focusState35().checks[storyKey+':'+q]=n;saveWork();queue27();main27.scrollTop=0;}
function explanationStage35(i){return focusState35().explanations[storyKey+':'+i]||0;}
function setExplanationStage35(i,n){stopVoice();remember27();focusState35().explanations[storyKey+':'+i]=n;saveWork();queue27();main27.scrollTop=0;}
function photo35(page,caption='Gambar cerita'){return '<figure class="jm-photo35"><img src="'+safe(assets[storyKey+'-'+(page+1)])+'" alt="'+safe(caption)+'" loading="eager"><figcaption>'+safe(caption)+'</figcaption><button type="button" class="jm-secondary" data-zoom35 aria-label="Besarkan '+safe(caption)+'">Besarkan gambar</button></figure>';}
function strip35(items,current){return '<ol class="jm-steps35" aria-label="Langkah tugasan">'+items.map(([icon,label],i)=>'<li '+(i===current?'aria-current="step"':'')+'><span aria-hidden="true">'+(i<current?'✓':i+1)+'</span>'+F35.icon(icon)+'<b>'+safe(label)+'</b></li>').join('')+'</ol>';}
function neutral35(){return '<div class="jm-context35">'+F35.icon(F35.diagnosticSymbol(storyKey))+'<span>'+safe(F35.captions[storyKey])+'</span></div>';}
root.addEventListener('click',e=>{const b=e.target.closest('[data-zoom35]');if(!b)return;const picture=b.closest('figure')?.querySelector('img');if(!picture)return;const img=zoomDialog.querySelector('img');img.src=picture.src;img.alt=picture.alt;zoomDialog.showModal();});

// A short visual direction replaces the paragraph above each task.
const focusBanner35=document.createElement('div');focusBanner35.className='jm-focus-banner35';
const focusIcon35=document.createElement('span');focusIcon35.className='jm-focus-icon35';
const audioButtons35=document.createElement('div');audioButtons35.className='jm-focus-audio35';
focusBanner35.append(focusIcon35,written30,audioButtons35);$('.jm-location27').append(focusBanner35);
audioButtons35.append($('#jm-hear27'));stopButton30($('#jm-hear27'));if($('#jm-hear27').stop30)audioButtons35.append($('#jm-hear27').stop30);
const pupilMenu35=document.createElement('details');pupilMenu35.className='jm-pupil-menu35';pupilMenu35.innerHTML='<summary>Tugasan, markah dan sijil</summary>';
$('.jm-head27').append(pupilMenu35);pupilMenu35.append($('.jm-head27 nav'));
pupilMenu35.addEventListener('click',e=>{if(e.target.closest('button'))pupilMenu35.open=false;});

function shortDirection35(){
 if(aux27)return {icon:aux27==='certificate'?'star':'check',text:instructionBefore35()};
 if(view==='book')return {icon:closeStage27==='reflection'?'heart':'book',text:closeStage27==='reflection'?'Nyatakan satu nilai murni dan cara kamu akan mengamalkannya.':'Semak tajuk buku, tajuk halaman dan ayat.'};
 if(view==='game')return step===0?{icon:'book',text:'Baca halaman ini.'}:step===1?{icon:'search',text:'Cari ayat yang menunjukkan perbuatan watak.'}:step===2||step===4&&!bonusReady?{icon:'pencil',text:'Catat nilai dan sebab kamu memilihnya.'}:{icon:'fish',text:'Pilih satu ikan, kemudian tekan butang untuk memancing.'};
 const phase=eligible24(),l=lesson24();
 if(phase===0)return l.puzzle?{icon:'eye',text:'Selepas siap, kongsi idea.'}:{icon:'puzzle',text:'Tekan dua keping untuk menukar tempatnya.'};
 if(readingScreen35()){
  const stage=readStage35();return {icon:['eye','book','mic'][stage],text:stage===0?'Perhatikan watak dan peristiwa dalam cerita.':stage===1?'Baca halaman ini.':pupilAudio26.busy()?'Selepas membaca, tekan Henti dan simpan.':readingPageReady26(page24)?'Kemudian, tekan Seterusnya.':'Pembaca yang namanya dipaparkan menekan Rakam bacaan.'};
 }
 if(phase===1)return checkStage35(state27().q||0)?{icon:'heart',text:'Pilih nilai murni.'}:{icon:'search',text:'Cari ayat yang menunjukkan perbuatan watak.'};
 if(phase===2){const i=l.explanations[0]?1:0,n=explanationStage35(i);return {icon:['heart','search','pencil'][n],text:['Pilih nilai murni.','Padankan perbuatan watak yang menyokong nilai itu.','Kemudian, tulis penerangan sendiri.'][n]};}
 if(phase===3){
  if(diagnostic30())return {icon:'person',text:'Jawab sendiri dahulu tanpa bantuan rakan.'};
  if(matching32())return {icon:'match',text:matchState32().step?'Tulis ayat ringkas atau kata kunci.':'Tekan kad perbuatan, kemudian tekan nilai yang sepadan.'};
  if(l.route==='pengayaan')return {icon:'pencil',text:'Cadangkan satu perbuatan baik yang baharu.'};
  const count=$('#jm-pdp-practice')?.querySelectorAll('fieldset').length||0;
  return {icon:'pencil',text:(state27().practice||0)<count?'Pilih tindakan atau sebab yang paling sesuai.':'Kemudian, pilih satu jawapan kamu dan terangkan sebabnya.'};
 }
 return {icon:'check',text:'Kemudian, tekan Seterusnya.'};
}
const instructionBefore35=instructionText28;
instructionText28=function(){return active27()?shortDirection35().text:instructionBefore35();};
// All copies of “Dengar arahan” read exactly the short text displayed in the banner.
hearInstructions28=()=>speakMalay(instructionText28(),$('#jm-status27'));
hearGuide=hearInstructions28;$('#jm-hear27').onclick=hearInstructions28;$('#jm-hear-guide').onclick=hearInstructions28;

function presentReading35(){
 const stage=readStage35(),l=lesson24(),page=page24,done=l.readPages.includes(page)&&readingPageReady26(page);
 const doc=JoranStory.lessonMake(storyKey,page),focus=focusState35();if(!focus.lines)focus.lines={};
 const line=Math.max(0,Math.min(doc.sentences.length-1,focus.lines[readKey35()]||0));
 const changeLine=n=>{stopVoice();focus.lines[readKey35()]=n;panel24.classList.remove('jm-whole-page35');saveWork();queue27();main27.scrollTop=0;};
 panel24.dataset.sub27='read';panel24.dataset.read35=String(stage);
 let strip=panel24.querySelector('.jm-reading-steps35');if(!strip){strip=document.createElement('div');strip.className='jm-reading-steps35';panel24.prepend(strip);}
 const stripHTML=strip35(F35.stages,stage);if(strip.innerHTML!==stripHTML)strip.innerHTML=stripHTML;
 const picture=panel24.querySelector('.jm-pdp-split>img');if(picture){const src=assets[storyKey+'-'+(page+1)];if(picture.getAttribute('src')!==src)picture.setAttribute('src',src);picture.alt='Halaman '+(page+1)+' — '+JoranStory.lessonMake(storyKey,page).title;picture.style.cursor='zoom-in';}
 const paragraph=panel24.querySelector('.jm-pdp-reading');if(paragraph&&!paragraph.dataset.lines35){paragraph.dataset.lines35='true';paragraph.innerHTML=doc.sentences.map(t=>'<span class="jm-story-line35">'+syl(t)+'</span>').join('');}
 let single=panel24.querySelector('.jm-single-line35');if(paragraph&&!single){single=document.createElement('div');single.className='jm-single-line35';paragraph.before(single);}
 const lineHTML='<small>Ayat '+(line+1)+' daripada '+doc.sentences.length+'</small><p>'+syl(doc.sentences[line])+'</p>';
 if(single&&single.innerHTML!==lineHTML)single.innerHTML=lineHTML;
 const listen=$('#jm-pdp-listen');if(listen&&!listen.dataset.full35){listen.dataset.full35='true';listen.textContent='Dengar Guru — seluruh halaman';const action=listen.onclick;listen.onclick=e=>{panel24.classList.add('jm-whole-page35');return action?.(e);};
  const compact=document.createElement('button');compact.type='button';compact.className='jm-secondary jm-compact35';compact.textContent='Kembali kepada satu ayat';compact.onclick=()=>{stopVoice();panel24.classList.remove('jm-whole-page35');};listen.after(compact);}
 const recorder=panel24.querySelector('.jm-recorder35');if(stage===2&&recorder&&strip.nextElementSibling!==recorder)strip.after(recorder);
 const back=()=>{if(stage===1&&line>0)changeLine(line-1);else if(stage>0)setReadStage35(stage-1);else if(page24>0){page24--;setReadStage35(0);renderLesson24();}else openReference30();};
 const label=F35.stages[stage][1],phase='Aktiviti 1 · Ba — Baca · Halaman '+(page+1)+' / 5';
 if(stage<2)nav27(label,phase,stage===0?'Seterusnya: Baca →':line<doc.sentences.length-1?'Ayat seterusnya →':'Seterusnya: Rakam →',()=>{if(stage===1&&line<doc.sentences.length-1)changeLine(line+1);else setReadStage35(stage+1);},{status:stage===0?'Langkah 1 daripada 3':'Ayat '+(line+1)+' / '+doc.sentences.length,back});
 else nav27('Rakam bacaan',phase,page<4?'Simpan · Halaman seterusnya →':'Simpan · Cari nilai →',async()=>{
  if(!readingPageReady26(page))return;
  if(done){if(page24<4)page24++;else state27().reading=false;saveWork();renderLesson24();}
  else $('#jm-pdp-read')?.click();
 },{disabled:!readingPageReady26(page)||!canLead26(),status:readingPageReady26(page)?'✓ Rakaman disimpan':pupilAudio26.busy()?'● Sedang merakam…':'Rakam bacaan untuk meneruskan.',back});
}

function mountCheck35(card,i){
 if(card.dataset.focus35)return;card.dataset.focus35='true';
 const item=lessonBank34(storyKey)[i],doc=JoranStory.lessonMake(storyKey,item.page,currentLessonVersion34());
 const originalImage=card.querySelector('.jm-stimulus29');originalImage?.remove();
 card.insertAdjacentHTML('afterbegin',photo35(item.page,'Gambar halaman '+(item.page+1)));
 card.querySelector('.jm-mini-label')?.remove();
 for(const p of card.querySelectorAll(':scope>p'))if(!p.classList.contains('jm-evidence-status'))p.remove();
 const select=card.querySelector('[data-evidence-check]'),label=select.closest('label');label.classList.add('jm-evidence-select35');
 const prompt=label.querySelector('.jm-prompt29');if(prompt)prompt.innerHTML=syl(doc.clue);
 let options=document.createElement('div');options.className='jm-evidence-options35';options.setAttribute('role','group');options.setAttribute('aria-label',doc.clue);
 options.innerHTML=doc.sentences.map((text,j)=>'<button type="button" class="jm-evidence-option35" data-evidence35="'+j+'" aria-pressed="false"><b>'+(j+1)+'</b><span>'+syl(text)+'</span></button>').join('');label.after(options);
 const caption=document.createElement('p');caption.className='jm-selected-proof35';options.after(caption);
 options.querySelectorAll('button').forEach(b=>b.onclick=()=>{if(!canLead26())return;select.value=b.dataset.evidence35;select.onchange?.();remember27();queue27();});
 const hear=card.querySelector('[data-hear-check30]');if(hear){delete hear.dataset.hearCheck30;hear.classList.add('jm-hear-check35');hear.onclick=()=>checkStage35(i)?speakSequence(item.options.map(t=>t+'.'),$('#jm-status27')):speakMalay(doc.clue,$('#jm-status27'));}
}
function presentCheck35(){
 const q=state27().q||0,card=panel24.querySelector('[data-check="'+q+'"]');if(!card)return;
 mountCheck35(card,q);const stage=checkStage35(q),select=card.querySelector('select'),savedNext=$('#jm-next27').onclick,savedDisabled=$('#jm-next27').disabled;
 card.dataset.checkStage35=String(stage);
 const selected=select.value!==''?Number(select.value):null,doc=JoranStory.lessonMake(storyKey,lessonBank34(storyKey)[q].page,currentLessonVersion34());
 card.querySelectorAll('[data-evidence35]').forEach(b=>{b.setAttribute('aria-pressed',String(Number(b.dataset.evidence35)===selected));const blocked=!canLead26()||!!(lesson24().checks?.[q]&&Number.isInteger(state27().reviewCheck42));if(b.disabled!==blocked)b.disabled=blocked;});
 const summary=card.querySelector('.jm-selected-proof35');summary.innerHTML='<b>Ayat pilihan kamu</b><br>'+syl(selected===null?'Belum dipilih.':doc.sentences[selected]);
 const hear=card.querySelector('.jm-hear-check35');if(hear)hear.textContent=stage?'Dengar pilihan nilai':'Dengar soalan';
 const strip=card.querySelector('.jm-check-steps35')||document.createElement('div');strip.className='jm-check-steps35';const html=strip35([['search','Cari perbuatan'],['heart','Pilih nilai']],stage);if(strip.innerHTML!==html)strip.innerHTML=html;if(!strip.parentNode)card.prepend(strip);
 if(stage===0)nav27('Ca — Cari perbuatan watak','Aktiviti 1 · Soalan '+(q+1)+' / 3','Seterusnya: Pilih nilai →',()=>setCheckStage35(q,1),{disabled:selected===null||!canLead26(),status:'Tekan satu ayat.',back:()=>{state27().reading=true;page24=lessonBank34(storyKey)[q].page;setReadStage35(1);renderLesson24();}});
 else nav27('Ni — Pilih nilai murni','Aktiviti 1 · Soalan '+(q+1)+' / 3','Simpan jawapan →',()=>savedNext?.(),{disabled:savedDisabled,status:'Gunakan ayat yang kamu pilih.',back:()=>setCheckStage35(q,0)});
}

function mountExplanation35(form,index){
 if(form.dataset.focus35)return;form.dataset.focus35='true';
 const labels=[...form.querySelectorAll(':scope>label')];labels.forEach((el,i)=>el.dataset.explainField35=String(i));
 const proof=form.querySelector('[name=proofIndex]'),bank=lessonBank34(storyKey);
 const options=document.createElement('div');options.className='jm-proof-cards35';options.innerHTML=bank.map((item,i)=>'<button type="button" data-proof35="'+i+'" aria-pressed="false"><img src="'+safe(assets[storyKey+'-'+(item.page+1)])+'" alt="Gambar halaman '+(item.page+1)+'"><span>'+syl(item.action)+'</span></button>').join('');
 proof.closest('label').append(options);
 options.querySelectorAll('button').forEach(b=>b.onclick=()=>{if(!canLead26())return;proof.value=b.dataset.proof35;remember27();queue27();});
 const scene=document.createElement('div');scene.className='jm-explain-scene35';scene.innerHTML=photo35(bank[0].page,'Rujuk perbuatan watak');form.prepend(scene);
 const stem=document.createElement('p');stem.className='jm-sentence-frame35';stem.innerHTML=F35.icon('pencil')+'<span>_____ menunjukkan nilai _____ kerana _____.</span>';form.querySelector('textarea').closest('label').before(stem);
}
function presentExplanation35(){
 const i=lesson24().explanations[0]?1:0,form=panel24.querySelector('[data-pdp-explain="'+i+'"]');if(!form)return;
 mountExplanation35(form,i);const n=explanationStage35(i),savedNext=$('#jm-next27').onclick,savedDisabled=$('#jm-next27').disabled;
 form.dataset.explainStage35=String(n);const value=form.querySelector('[name=value]'),proof=form.querySelector('[name=proofIndex]');
 form.querySelectorAll('[data-proof35]').forEach(b=>{b.setAttribute('aria-pressed',String(b.dataset.proof35===proof.value));const blocked=!canLead26();if(b.disabled!==blocked)b.disabled=blocked;});
 if(proof.value!==''){const item=lessonBank34(storyKey)[Number(proof.value)],img=form.querySelector('.jm-explain-scene35 img');if(img)img.src=assets[storyKey+'-'+(item.page+1)];}
 const strip=form.querySelector('.jm-explain-steps35')||document.createElement('div');strip.className='jm-explain-steps35';const html=strip35([['heart','Nilai'],['search','Perbuatan'],['pencil','Sebab']],n);if(strip.innerHTML!==html)strip.innerHTML=html;if(!strip.parentNode)form.prepend(strip);
 nav27(['Pilih nilai murni','Pilih gambar perbuatan','Tulis penerangan'][n],'Aktiviti 2 · Penjelasan '+(i+1)+' / 2',n<2?'Seterusnya →':'Simpan penjelasan →',()=>{
  if(n===0){if(!value.value){value.reportValidity();return;}setExplanationStage35(i,1);}
  else if(n===1){if(proof.value===''){$('#jm-status27').textContent='Pilih satu gambar perbuatan dahulu.';return;}setExplanationStage35(i,2);}
  else savedNext?.();
 },{disabled:savedDisabled,status:n===2?'Jawapan kamu dimasukkan ke dalam buku cerita.':'Langkah '+(n+1)+' daripada 3',back:n?()=>setExplanationStage35(i,n-1):openReference30});
}

// Every practice question has a visual context; diagnostic art never labels the answer.
function presentPractice35(){
 if(diagnostic30()){
  const form=$('#jm-diagnostic29');if(!form)return;
  for(const card of form.querySelectorAll('fieldset'))if(!card.querySelector('.jm-context35'))card.insertAdjacentHTML('afterbegin',neutral35());
  return;
 }
 const f=$('#jm-pdp-practice');if(!f)return;
 if(lesson24().route!=='pengayaan')for(const p of f.querySelectorAll(':scope>p:not(.jm-pdp-frame):not([role=status])'))p.hidden=true;
 if(matching32()){
  const bank=lessonBank34(storyKey);
  for(const button of f.querySelectorAll('[data-action32]'))if(!button.querySelector('img')){const item=bank[Number(button.dataset.action32)],im=document.createElement('img');im.src=assets[storyKey+'-'+(item.page+1)];im.alt='Halaman '+(item.page+1);button.prepend(im);}
  for(const p of f.querySelectorAll('.jm-match-summary32>p'))if(!p.querySelector('img')){const i=[...p.parentElement.children].indexOf(p),im=document.createElement('img');im.src=assets[storyKey+'-'+(bank[i].page+1)];im.alt='Gambar perbuatan '+(i+1);p.prepend(im);}
 }else{
  for(const card of f.querySelectorAll('fieldset'))if(!card.querySelector('.jm-context35'))card.insertAdjacentHTML('afterbegin',neutral35());
  if(lesson24().route==='pengayaan'&&!f.querySelector('.jm-enrich-scene35')){const d=document.createElement('div');d.className='jm-enrich-scene35';d.innerHTML=neutral35();f.querySelector('h3')?.after(d);}
 }
}

function presentInduction35(){
 if(!lesson24().puzzle)return;
 const split=panel24.querySelector('.jm-pdp-split'),aside=split?.lastElementChild;
 if(aside&&!aside.querySelector('.jm-photo35'))aside.insertAdjacentHTML('afterbegin',photo35(storyKey==='belang'?1:0,'Gambar yang telah kamu susun'));
 const labels=[...panel24.querySelectorAll('#jm-pdp-induction label')];
 labels.forEach((label,i)=>{if(!label.querySelector('svg'))label.insertAdjacentHTML('afterbegin',F35.icon(['book','search','eye'][i]));});
}
const screenBefore35=lessonScreen27;
lessonScreen27=function(){
 screenBefore35();if(!active27()||aux27)return;
 panel24.dataset.focusMode35='';
 if(readingScreen35()){panel24.dataset.focusMode35='reading';presentReading35();}
 else if(eligible24()===1){panel24.dataset.focusMode35='check';presentCheck35();}
 else if(eligible24()===2&&coreReady24()){panel24.dataset.focusMode35='explain';presentExplanation35();}
 else if(eligible24()===3){panel24.dataset.focusMode35='practice';presentPractice35();}
 else if(eligible24()===0){panel24.dataset.focusMode35='induction';presentInduction35();}
};

// Keep only essential recording controls open. Older takes remain available, not deleted.
const recordBefore35=renderPupilAudio26;
renderPupilAudio26=function(container,page){
 recordBefore35(container,page);if(!container)return;const panel=container.querySelector('.jm-pupil-audio26');if(!panel)return;
 panel.classList.add('jm-recorder35');
 const topParagraphs=[...panel.querySelectorAll(':scope>p:not([role=status])')];
 if(topParagraphs.length){const help=document.createElement('details');help.className='jm-record-help35';help.innerHTML='<summary>Cara merakam</summary>';for(const p of topParagraphs)help.append(p);panel.append(help);}
 for(const article of panel.querySelectorAll(':scope>article')){
  const record=article.querySelector('[data-pupil-record]'),stop=article.querySelector('[data-pupil-stop]');
  if(record)record.innerHTML=F35.icon('mic')+'<span>'+(takes26(record.dataset.pupilRecord,page).length?'Rakam semula':'Rakam bacaan')+'</span>';
  if(stop)stop.innerHTML='<span class="jm-stop-square35" aria-hidden="true"></span><span>Henti dan simpan</span>';
  const takes=[...article.querySelectorAll(':scope>details')];takes.forEach(d=>d.open=false);
  if(takes[0])takes[0].querySelector('summary').textContent='Dengar / semak rakaman terkini';
  if(takes.length>1){const history=document.createElement('details');history.className='jm-record-history35';history.innerHTML='<summary>Rakaman terdahulu ('+(takes.length-1)+')</summary>';for(const d of takes.slice(1))history.append(d);article.append(history);}
 }
};

const gameBefore35=gameScreen27;
gameScreen27=function(){gameBefore35();
 if(step===2||step===4&&!bonusReady){const card=$('.jm-evidence-card');let figure=card?.querySelector('.jm-photo35');if(card&&!figure)card.insertAdjacentHTML('afterbegin',photo35(Math.min(readPage,4),'Rujuk gambar cerita'));
  else if(figure)figure.querySelector('img').src=assets[storyKey+'-'+(Math.min(readPage,4)+1)];
 }
};
const bookBefore35=bookScreen27;
bookScreen27=function(){bookBefore35();if(closeStage27==='reflection'&&!closing27.querySelector('.jm-reflection-visual35')){const d=document.createElement('div');d.className='jm-reflection-visual35';d.innerHTML=F35.icon('heart')+F35.icon('pencil');closing27.prepend(d);}};
const extraBefore35=renderExtra27;
renderExtra27=function(){extraBefore35();if(aux27==='tasks')extra27.querySelectorAll('[data-jump27]').forEach((b,i)=>{if(!b.querySelector('svg'))b.insertAdjacentHTML('afterbegin',F35.icon(['puzzle','book','fish','match','star'][i]));});};

// Focus mode is the default. The persistent footer stays reachable at every zoom level.
const paintBefore35=paint27;
paint27=function(){
 paintBefore35();if(!active27())return;
 shell27.classList.add('jm-focused35');
 const direction=shortDirection35();if(focusIcon35.dataset.icon!==direction.icon){focusIcon35.dataset.icon=direction.icon;focusIcon35.innerHTML=F35.icon(direction.icon);}
 if(written30.textContent!==direction.text)written30.textContent=direction.text;
 const row=$('#jm-contributor28'),member=readingScreen35()?reader28(page24):contributor29();
 if(row&&!aux27){const text=diagnostic30()?'Jawab sendiri':collaborative26()?'Giliran':'Nama';const html='<span>'+text+'</span> <strong>'+safe(member?.name||profile.name)+'</strong>'+(collaborative26()?'<span>'+(diagnostic30()?'Rakan menunggu':'Rakan lain membantu')+'</span>':'');if(row.innerHTML!==html)row.innerHTML=html;}
 // Pairing never leaves a stray stop button in the middle of the activity.
 if($('#jm-hear27').stop30&&$('#jm-hear27').stop30.parentNode!==audioButtons35)audioButtons35.append($('#jm-hear27').stop30);
 const old=$('#jm-schedule31');if(old)old.hidden=true;
};
const lessonBefore35=renderLesson24;renderLesson24=function(){lessonBefore35();const b=$('#jm-pdp-hear');if(b)b.onclick=hearInstructions28;};
root.dataset.version='35';$('#jm-version').textContent='Joran Minda · Versi 35 · Gambar jelas, satu langkah pada satu masa';
window.JoranDiagnostics35=()=>({...window.JoranDiagnostics34?.(),version:35,focus:profile?structuredClone(focusState35()):null,instruction:active27()?instructionText28():null,hasInstructionAudio:active27()?!!packagedMalayClip(instructionText28()):null});
queue27();
