// V37: one question, one choice set, matching story text and explicit editing.
const C37=JoranClear37;
function audioPair37(parent,label,read){const row=document.createElement('div');row.className='jm-audio-pair37';const b=document.createElement('button');b.type='button';b.className='jm-secondary';b.textContent=label;b.onclick=read;row.append(b);parent.append(row);stopButton30(b);return row;}
function noteChoices37(){return step===4?stories[storyKey].meaning:storyPage().labels;}
function notePrompt37(){return step===4?'Apakah maksud peribahasa '+stories[storyKey].bonus+'? Pilih satu jawapan.':fishingText30()+' Pilih satu nilai.';}
const teamLegacy37=teamBefore36;
renderTeam=function(){
 teamLegacy37();if(!isV25Story()||![2,4].includes(step))return;
 const box=$('#jm-choice-cards'),input=$('#jm-discussion-notes'),notes=$('.jm-notes-form'),choices=noteChoices37();
 box.hidden=false;box.className='jm-choice-cards jm-notes37';
 box.innerHTML=choices.map((t,i)=>'<article class="jm-choice-card"><button type="button" class="jm-pick-note36" data-note-choice36="'+i+'" aria-pressed="false">'+F35.icon(step===4?'book':'heart')+'<span class="jm-choice-label37">'+syl(t)+'</span></button></article>').join('');
 box.parentElement.querySelectorAll('.jm-note-audio37').forEach(x=>x.remove());
 const sound=audioPair37(box.parentElement,'Dengar pilihan',()=>speech36(choices.map(t=>t+'.')));sound.classList.add('jm-note-audio37');box.after(sound);
 let summary=$('#jm-note-summary36');if(!summary){summary=document.createElement('p');summary.id='jm-note-summary36';summary.className='jm-guided-sentence36';notes.prepend(summary);}
 const saved=step===4?bookState().bonusNotes:bookState().pageNotes[readPage];putHTML36(summary,saved?syl(saved):'Pilihan kamu akan dipaparkan di sini.');
 box.querySelectorAll('[data-note-choice36]').forEach(b=>{b.disabled=!myTurn();b.onclick=()=>{if(!myTurn())return;const c=choices[Number(b.dataset.noteChoice36)];input.value=step===4?'Maksud peribahasa ini ialah '+c.charAt(0).toLowerCase()+c.slice(1)+'.':U36.sentence(c,storyPage().sentences[storyPage().evidence]);input.oninput?.();if($('#jm-note-edit37'))$('#jm-note-edit37').disabled=false;putHTML36(summary,syl(input.value));box.querySelectorAll('[data-note-choice36]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));queue27();};});
 // Keep the existing persistence handler; editing is an explicit, visible action.
 let editor=$('#jm-note-editor37');if(!editor){editor=document.createElement('div');editor.id='jm-note-editor37';editor.hidden=true;const label=input.closest('label');label.before(editor);editor.append(label);label.firstChild.textContent='Ayat kamu';const actions=document.createElement('div');actions.className='jm-edit-actions37';actions.innerHTML='<button type="button" class="jm-primary" data-note-save37>Simpan ayat</button><button type="button" class="jm-secondary" data-note-cancel37>Batal</button>';editor.append(actions);
 const edit=document.createElement('button');edit.id='jm-note-edit37';edit.type='button';edit.className='jm-secondary';edit.textContent='Ubah ayat';summary.after(edit);edit.onclick=()=>{editor.dataset.before=input.value;editor.hidden=false;edit.hidden=true;input.focus({preventScroll:true});};
 editor.querySelector('[data-note-save37]').onclick=()=>{if(!input.value.trim()){input.focus();return;}input.oninput?.();putHTML36(summary,syl(input.value));editor.hidden=true;edit.hidden=false;queue27();};
 editor.querySelector('[data-note-cancel37]').onclick=()=>{input.value=editor.dataset.before||'';input.oninput?.();putHTML36(summary,syl(input.value));editor.hidden=true;edit.hidden=false;};
 }
 const edit=$('#jm-note-edit37');edit.disabled=!myTurn()||!saved;editor.hidden=true;edit.hidden=false;
};

const checkBefore37=presentCheck35;
presentCheck35=function(){checkBefore37();const i=state27().q||0,card=panel24.querySelector('[data-check="'+i+'"]'),options=card?.querySelector('.jm-ni-options');if(options&&!options.querySelector('.jm-audio-pair37'))audioPair37(options,'Dengar pilihan',()=>speech36(lessonBank34(storyKey)[i].options.map(t=>t+'.')));};

// Fixed, distinct target values make each explanation question focused.
const explainBefore37=presentExplanation35;
presentExplanation35=function(){
 explainBefore37();const i=lesson24().explanations[0]?1:0,f=panel24.querySelector('[data-pdp-explain="'+i+'"]');if(!f)return;
 const bank=lessonBank34(storyKey),target=bank[i],stage=explanationStage35(i),value=f.querySelector('[name=value]'),proof=f.querySelector('[name=proofIndex]'),text=f.querySelector('[name=text]');
 // Present a named value and ask for the supporting action. This directly measures criterion 2.
 if(stage===0){value.value=target.value;setExplanationStage35(i,1);return;}
 value.value=target.value;
 const scene=f.querySelector('.jm-explain-scene35');if(scene){scene.hidden=true;}
 const strip=f.querySelector('.jm-explain-steps35');if(strip)putHTML36(strip,strip35([['search','Pilih perbuatan'],['check','Semak ayat']],stage-1));
 f.querySelectorAll('[data-proof35]').forEach(b=>{b.onclick=()=>{if(!canLead26())return;proof.value=b.dataset.proof35;text.value=U36.sentence(target.value,bank[Number(proof.value)].action);text.dataset.auto36='true';remember27();queue27();};});
 const review=f.querySelector('.jm-guided-review36');if(stage===2&&proof.value!==''){putHTML36(review.querySelector('.jm-guided-sentence36'),syl(text.value||U36.sentence(target.value,bank[Number(proof.value)].action)));if(text.closest('.jm-optional36')){f.append(text);text.hidden=true;}review.querySelector('.jm-optional36')?.remove();review.querySelector('[data-hear-guided36]').onclick=()=>speech36([text.value]);}
 nav27('Terangkan nilai '+target.value.toLowerCase(),'Aktiviti 2 · Penjelasan '+(i+1)+' / 2',stage===1?'Semak ayat →':'Simpan penjelasan →',()=>{if(stage===1){if(proof.value==='')return;setExplanationStage35(i,2);}else f.requestSubmit();},{disabled:!canLead26()||proof.value==='',status:'',back:stage===2?()=>setExplanationStage35(i,1):openReference30});
};

function practiceState37(){const st=state27(),key=storyKey+':'+practiceMember28().id;if(!st.practice37)st.practice37={};return st.practice37[key]||(st.practice37[key]={index:0,answers:[],busy:false});}
function practiceQuestions37(){return lesson24().route==='pengayaan'?C37.enrichment[storyKey].questions:L24.practiceFor(storyKey);}
async function savePractice37(body,correct,total,answers){const st=practiceState37();if(st.busy)return;st.busy=true;try{if(await saveLesson24(body)){feedback36(correct===total?'Tahniah! Semua jawapan tepat.':'Latihan disimpan.',[correct===total?'Tahniah! Semua jawapan tepat.':'Ada jawapan yang belum tepat. Mari semak.','Jawapan yang betul:',...answers],go24);}}finally{st.busy=false;}}
function practiceScreen37(){
 const f=$('#jm-pdp-practice');if(!f)return;
 const l=lesson24(),member=practiceMember28(),st=practiceState37(),bank=lessonBank34(storyKey),matching=l.route==='pemulihan',qs=matching?bank:practiceQuestions37(),n=qs.length,i=Math.min(st.index,n-1),match=matching?matchState32():null;
 const heading='Latihan '+({pemulihan:'Pemulihan',pengukuhan:'Pengukuhan',pengayaan:'Pengayaan'}[l.route]);
 const opts=matching?[2,0,1].map(j=>({text:bank[j].value,id:j})):qs[i].options.map((text,id)=>({text,id}));
 const page=matching?bank[i].page:l.route==='pengayaan'?C37.enrichment[storyKey].page:bank[i].page;
 const key=member.id+':'+l.route+':'+i;
 if(f.dataset.clear37!==key){f.dataset.clear37=key;f.removeAttribute('data-question27');f.onsubmit=e=>e.preventDefault();
 f.innerHTML='<header class="jm-practice-heading37"><h3>'+heading+'</h3><p>'+safe(member.name)+' · Soalan '+(i+1)+' daripada '+n+'</p></header><div class="jm-practice-layout37">'+photo35(page,l.route==='pengayaan'?'Gambar rujukan':'Lihat perbuatan watak')+'<div class="jm-practice-options37">'+opts.map(o=>choiceButton36(o.text,'data-practice37',o.id)).join('')+'</div></div>';
 f.querySelectorAll('[data-practice37]').forEach(b=>b.onclick=()=>{if(!canLead26())return;const choice=Number(b.dataset.practice37);if(matching)match.pairs=U36.choosePair(match.pairs,i,choice);else st.answers[i]=choice;saveWork();queue27();});
 audioPair37(f.querySelector('.jm-practice-options37'),'Dengar pilihan',()=>speech36(opts.map(o=>o.text)));
 }
 const selected=matching?match.pairs[i]:st.answers[i];f.querySelectorAll('[data-practice37]').forEach(b=>{b.setAttribute('aria-pressed',String(Number(b.dataset.practice37)===selected));const disabled=!canLead26()||st.busy;if(b.disabled!==disabled)b.disabled=disabled;});
 nav27(heading,'Aktiviti 3 · '+member.name,i<n-1?'Seterusnya →':'Simpan latihan →',async()=>{
  if(selected==null||st.busy)return;if(i<n-1){st.index++;saveWork();queue27();main27.scrollTop=0;return;}
  if(matching){const empty=match.pairs.findIndex(x=>x==null);if(empty>=0){st.index=empty;saveWork();queue27();return;}const text=bank.map((b,j)=>U36.sentence(bank[match.pairs[j]].value,b.action)).join(' ');await savePractice37({type:'lesson-practice',activity:'matching',matches:match.pairs.slice(),text},match.pairs.filter((x,j)=>x===j).length,n,bank.map(b=>b.action+' Nilainya ialah '+b.value.toLowerCase()+'.'));}
  else{const correct=qs.filter((q,j)=>st.answers[j]===q.answer).length;const text=qs.map((q,j)=>q.options[st.answers[j]]).join(' ');await savePractice37({type:'lesson-practice',activity:l.route==='pengayaan'?'scenario':undefined,answers:st.answers.slice(),application:l.route==='pengayaan'?qs[0].options[st.answers[0]]:undefined,text},correct,n,qs.map(q=>q.options[q.answer]));}
 },{disabled:!canLead26()||selected==null||st.busy,status:'',back:()=>{if(i>0){st.index--;saveWork();queue27();}else openReference30();}});
}
const lessonBefore37=lessonScreen27;
lessonScreen27=function(){if(active27()&&!aux27&&eligible24()===3&&lesson24().route&&!lesson24().practiced&&currentLessonVersion34()>=37){panel24.dataset.phase27='3';panel24.dataset.sub27='practice';panel24.dataset.focusMode35='practice';practiceScreen37();return;}lessonBefore37();};

const directionBefore37=shortDirection35;
shortDirection35=function(){
 if(!active27()||aux27)return directionBefore37();
 const pick=' Pilih satu jawapan.';
 if(view==='game'){
  if(step===1)return {icon:'search',text:U36.findQuestions[storyKey][readPage]+' Pilih satu ayat.'};
  if(step===2||step===4&&!bonusReady)return {icon:'heart',text:notePrompt37()};
  if(step===3||step===4&&bonusReady)return {icon:'fish',text:fishingText30()+' Pilih ikan, kemudian tekan Pancing ikan ini.'};
 }
 if(view==='lesson'){
  const l=lesson24(),phase=eligible24();
  if(phase===1&&!readingScreen35()){const q=state27().q||0;return {icon:checkStage35(q)?'heart':'search',text:checkStage35(q)?lessonBank34(storyKey)[q].action+' Apakah nilai yang ditunjukkan?'+pick:U36.proofQuestions[storyKey][q]+' Pilih satu ayat.'};}
  if(phase===2&&coreReady24()){const i=l.explanations[0]?1:0,target=lessonBank34(storyKey)[i];return {icon:'heart',text:explanationStage35(i)<2?'Perbuatan manakah yang menunjukkan nilai '+target.value.toLowerCase()+'? Pilih satu gambar.':'Baca ayat pilihan kamu. Tekan Simpan penjelasan.'};}
  if(diagnostic30()){const q=L24.diagnosticFor(storyKey,currentLessonVersion34())[Math.min(2,state27().diagnostic||0)];return {icon:'person',text:'Jawab sendiri dahulu. '+q.prompt+pick};}
  if(phase===3&&l.route&&currentLessonVersion34()>=37){const i=practiceState37().index;if(l.route==='pemulihan')return {icon:'match',text:lessonBank34(storyKey)[i].action+' Apakah nilai yang sepadan?'+pick};const q=practiceQuestions37()[i];return {icon:'pencil',text:(l.route==='pengayaan'?C37.enrichment[storyKey].context+' ':'')+q.prompt+pick};}
 }
 return directionBefore37();
};
// The single instruction/question pair stays together on every screen.
const paintLegacy37=paint27;
paint27=function(){paintLegacy37();if(!active27())return;
 const mainHear=$('#jm-hear27');setText36(mainHear,view==='game'&&step>0||view==='lesson'&&!readingScreen35()&&eligible24()>0?'Dengar soalan':'Dengar arahan');mainHear.onclick=hearInstructions28;
 if(mainHear.stop30&&mainHear.stop30.parentElement!==audioButtons35)audioButtons35.append(mainHear.stop30);
 for(const b of root.querySelectorAll('.jm-hear-check35,[data-help="find"],[data-help="notes"],[data-help="bonusNotes"],#jm-hear-notes')){if(!b.hidden)b.hidden=true;if(b.stop30&&!b.stop30.hidden)b.stop30.hidden=true;}
};

// Three primary entry points. Support links are grouped by purpose.
const homeHelp37=document.createElement('details');homeHelp37.className='jm-home-help37';homeHelp37.innerHTML='<summary>Bantuan dan tetapan</summary>';$('.jm-home-actions').append(homeHelp37);homeHelp37.append($('.jm-home-small-actions'));
const teacherTools37=document.createElement('details');teacherTools37.className='jm-teacher-tools37';teacherTools37.innerHTML='<summary>Panduan dan persediaan Guru</summary>';const teacherPanel37=$('[data-panel=teacher]');teacherPanel37.prepend(teacherTools37);
for(const id of ['jm-home-teacher','jm-home-studio','jm-pdp-guide','jm-version']){const el=$('#'+id);if(el)teacherTools37.append(el);}
const join37=$('#jm-home-code');if(join37){join37.className='jm-secondary';$('#jm-entry-form').before(join37);join37.textContent='Saya mempunyai kod daripada Guru';}
setText36(homeTeacher36,'Guru');
const teacherNotice37=document.createElement('p');teacherNotice37.className='jm-pdp-notice';teacherNotice37.textContent='Teks cerita semasa telah dipermudah. Rakaman lama kekal disimpan. Rakam semula halaman yang teksnya berubah supaya suara Guru sepadan dengan cerita.';$('[data-panel=voice]').prepend(teacherNotice37);
for(const word of JSON.stringify(C37).match(/[a-z]+(?:-[a-z]+)*/ig)||[])if(!dict[word.toLowerCase()])dict[word.toLowerCase()]=splitMalay28(word.toLowerCase());
const studioBefore37=renderVoice;
renderVoice=function(){studioBefore37();if(studioKind33==='story')$('#jm-studio-route').textContent='Baca skrip halaman ini. Rakaman yang sepadan dengan teks semasa digunakan untuk murid; rakaman lama kekal sebagai sandaran.';};
root.dataset.version='37';$('#jm-version').textContent='Joran Minda · Versi 37';
queue27();
