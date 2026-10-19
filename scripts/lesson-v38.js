// V38: meaningful picture choices, 4/5/6 exercises and one automatic feedback queue.
const P38=JoranPractice38;
helpText.home=P38.home;
const homeInstruction38=document.createElement('p');homeInstruction38.className='jm-home-instruction38';homeInstruction38.textContent=P38.home;homeHelp37.prepend(homeInstruction38);
function picture38(id){const item=P38.images[id];if(!item)return '';const x=item.cell%3,y=Math.floor(item.cell/3);return '<span class="jm-picture38" data-picture38="'+id+'"><img src="assets/actions-'+item.sheet+'-v38.png" alt="'+safe(item.alt)+'" style="left:-'+x*100+'%;top:-'+y*100+'%" draggable="false"></span>';}
const savingPractice38=new WeakSet();
function practiceState38(){const s=state27(),key=storyKey+':'+practiceMember28().id+':'+lesson24().route;if(!s.practice38)s.practice38={};return s.practice38[key]||(s.practice38[key]={index:0,answers:[],checked:[]});}
function practiceQuestions38(){return P38.forStory(storyKey,lesson24().route);}
function practiceScreen38(){
 const f=$('#jm-pdp-practice');if(!f)return;
 const l=lesson24(),member=practiceMember28(),st=practiceState38(),qs=practiceQuestions38(),n=qs.length,i=Math.min(st.index,n-1),q=qs[i],heading='Latihan '+({pemulihan:'Pemulihan',pengukuhan:'Pengukuhan',pengayaan:'Pengayaan'}[l.route]);
 const key=member.id+':'+l.route+':'+i;
 if(f.dataset.picture38!==key){f.dataset.picture38=key;f.removeAttribute('data-clear37');f.removeAttribute('data-question27');f.onsubmit=e=>e.preventDefault();
 f.innerHTML='<header class="jm-practice-heading38"><div><h3>'+heading+'</h3><p><strong>'+safe(member.name)+'</strong> · Soalan '+(i+1)+' daripada '+n+'</p></div><div class="jm-progress38" aria-label="Soalan '+(i+1)+' daripada '+n+'">'+qs.map((_,j)=>'<span class="'+(j<i?'done':j===i?'current':'')+'">'+(j+1)+'</span>').join('')+'</div></header>'+(q.word?'<div class="jm-match-word38"><span>Perkataan</span><strong>'+syl(q.word)+'</strong><span class="jm-match-arrow38" aria-hidden="true">↓</span></div>':'')+'<div class="jm-picture-choices38">'+q.options.map((o,j)=>'<button type="button" class="jm-picture-choice38" data-practice38="'+j+'" aria-pressed="false">'+picture38(o.image)+'<span class="jm-picture-label38"><b aria-hidden="true">'+String.fromCharCode(65+j)+'</b><span>'+syl(o.text)+'</span></span><span class="jm-selected38" aria-hidden="true">✓ Dipilih</span></button>').join('')+'</div><p class="jm-review-answer38" hidden></p>';
 f.querySelectorAll('[data-practice38]').forEach(b=>b.onclick=()=>{if(!canLead26()||savingPractice38.has(st)||st.checked[i])return;stopVoice();st.answers[i]=Number(b.dataset.practice38);saveWork();queue27();});
 audioPair37(f,'Dengar pilihan',()=>speech36(q.options.map(o=>o.text)));
 }
 const selected=st.answers[i],checked=st.checked[i];f.querySelectorAll('[data-practice38]').forEach(b=>{const j=Number(b.dataset.practice38);b.setAttribute('aria-pressed',String(j===selected));b.dataset.correct38=String(!!checked&&j===q.answer);const disabled=!canLead26()||savingPractice38.has(st)||!!checked;if(b.disabled!==disabled)b.disabled=disabled;});
 const review=f.querySelector('.jm-review-answer38');review.hidden=!checked;if(checked)putHTML36(review,syl('Jawapan yang betul: '+q.options[q.answer].text));
 const advance=async()=>{if(i<n-1){st.index++;saveWork();queue27();return;}if(st.checked.filter(Boolean).length!==n||savingPractice38.has(st))return;savingPractice38.add(st);try{if(await saveLesson24({type:'lesson-practice',answers:st.answers.slice()})){go24();}}finally{savingPractice38.delete(st);queue27();}};
 nav27(heading,'Aktiviti 3 · '+member.name,checked?(i<n-1?'Seterusnya →':'Simpan latihan →'):'Semak jawapan →',async()=>{
  if(!canLead26()||selected==null||savingPractice38.has(st))return;
  if(checked)return advance();st.checked[i]=true;saveWork();const correct=selected===q.answer;
  feedback36(correct?'Tahniah! Jawapan betul.':'Mari lihat jawapan.',[correct?(q.word?P38.matched:P38.praise):P38.wrong,q.options[q.answer].text],advance);
  const text=$('#jm-response-copy38');if(text)text.before(Object.assign(document.createElement('div'),{className:'jm-feedback-picture38',innerHTML:picture38(q.options[q.answer].image)}));
  if(!correct){const note=document.createElement('p');note.className='jm-point-note38';note.textContent='Potongan: 2 mata. Kamu boleh teruskan.';$('#jm-response-copy38').after(note);}queue27();
 },{disabled:!canLead26()||selected==null||savingPractice38.has(st),status:savingPractice38.has(st)?'Menyimpan jawapan…':'',back:()=>{stopVoice();if(i>0){st.index--;saveWork();queue27();}else openReference30();}});
}
const lessonBefore38=lessonScreen27;
lessonScreen27=function(){if(active27()&&!aux27&&eligible24()===3&&lesson24().route&&!lesson24().practiced&&currentLessonVersion34()>=38){panel24.dataset.phase27='3';panel24.dataset.sub27='practice';panel24.dataset.focusMode35='practice';practiceScreen38();return;}lessonBefore38();};
const directionBefore38=shortDirection35;
shortDirection35=function(){if(active27()&&!aux27&&view==='lesson'&&eligible24()===3&&lesson24().route&&!lesson24().practiced&&currentLessonVersion34()>=38){const q=practiceQuestions38()[practiceState38().index];return {icon:q.word?'match':'pencil',text:P38.direction(q)};}return directionBefore38();};
const paintBefore38=paint27;
paint27=function(){paintBefore38();if(active27())putHTML36(written30,syl(shortDirection35().text));};
// Red and blue apply to syllables, not alternating entire words. Retain the user's colour switch.
for(const word of JSON.stringify(P38).match(/[a-z]+(?:-[a-z]+)*/ig)||[])if(!dict[word.toLowerCase()])dict[word.toLowerCase()]=splitMalay28(word.toLowerCase());
const syllables38={padankan:'pa-dan-kan',perkataan:'per-ka-ta-an',mengoyakkan:'me-ngo-yak-kan',mengutip:'me-ngu-tip',menyerahkan:'me-nye-rah-kan',ditemukan:'di-te-mu-kan',penerangan:'pe-ne-rang-an',penjagaan:'pen-ja-ga-an',secukupnya:'se-cu-kup-nya',secara:'se-ca-ra',berkongsi:'ber-kong-si',bersama:'ber-sa-ma',memindahkan:'me-min-dah-kan',terlindung:'ter-lin-dung',memadankan:'me-ma-dan-kan',kebersihan:'ke-ber-si-han',pengukuhan:'pe-ngu-ku-han',pemulihan:'pe-mu-li-han',pengayaan:'pe-nga-ya-an'};
for(const [word,parts]of Object.entries(syllables38))dict[word]=parts.split('-');
// One status line per player: remove old stale "stopped" messages when starting a new queue.
const sequenceBefore38=speakSequence;
speakSequence=async function(texts,target,kind='help'){
 for(const el of root.querySelectorAll('.jm-audio-status30')){el.textContent='';el.hidden=true;}
 return sequenceBefore38(texts,target,kind);
};
// Build the modal once; do not synthesize a click, which previously created a second status/queue.
function response38(title,parts,next){
 stopVoice();lastFeedback28=parts.join(' ');feedbackContinue28=next;const good=title.startsWith('Tahniah');
 response28.innerHTML='<p class="jm-pdp-kicker">'+(good?'Bagus, teruskan usaha!':'Semak jawapan')+'</p><h2>'+safe(title)+'</h2><p id="jm-response-copy38">'+syl(parts.join(' '))+'</p><div class="jm-feedback-audio38"><button type="button" class="jm-secondary" id="jm-response-hear28">Dengar maklum balas</button></div><p id="jm-response-audio28" role="status"></p><button type="button" class="jm-primary" id="jm-response-next28">Seterusnya →</button>';
 response28.dataset.correct38=String(good);if(!response28.open)response28.showModal();
 const hear=$('#jm-response-hear28');stopButton30(hear);
 hear.onclick=()=>speakSequence(good&&$('#jm-effects').checked&&Number(prefs.cheerVolume)>0?['Yeay!',...parts]:parts,$('#jm-response-audio28'));
 $('#jm-response-next28').onclick=()=>{stopVoice();response28.close();const fn=feedbackContinue28;feedbackContinue28=null;fn?.();};
 // Instruction audio stays opt-in; this is answer feedback after the learner's action.
 hear.onclick();
}
showResponse28=(title,text,next)=>response38(title,[text],next);
feedback36=(title,parts,next)=>response38(title,parts,next);
playSuccess=function(kind){const messages={correct:'Tahniah! Jawapan kamu betul.',caught:'Tahniah! Kamu berjaya memancing jawapan yang tepat.',bonus:'Tahniah! Jawapan kamu betul.',complete:'Tahniah! Buku cerita kamu telah siap.'};return speakSequence($('#jm-effects').checked&&Number(prefs.cheerVolume)>0?['Yeay!',messages[kind]||messages.correct]:[messages[kind]||messages.correct],$('#jm-guide-status'));};
// Teacher review follows question order, with selected and correct answers separated clearly.
const reportBefore38=renderReport;
renderReport=function(){reportBefore38();for(const card of $$('.jm-report-group28')){const ids=card.dataset.reportMembers28.split(','),record=teacherRecords.find(r=>r.id===ids[0]),l=record?.lesson;if(!l||l.version<38)continue;const stage=card.querySelector('[data-report-stage28="3"]');if(!stage)continue;stage.innerHTML='<summary>4. Aktiviti 3 · Latihan setiap ahli</summary>'+(l.members||[]).map(m=>{const e=l.practices.find(p=>p?.subjectId===m.id),route=e?.route||l.personalRoutes[m.id];return '<article><h4>'+safe(m.name)+'</h4><p>Latihan: <strong>'+safe(route||'Belum ditentukan')+'</strong> · '+(e?e.correct+' daripada '+e.total+' jawapan betul':'Belum lengkap')+'</p>'+(e?'<table class="jm-practice-table38"><thead><tr><th>Soalan</th><th>Jawapan murid</th><th>Jawapan betul</th><th>Semakan</th></tr></thead><tbody>'+e.items.map((q,i)=>'<tr><td>'+(i+1)+'. '+safe(q.question)+'</td><td>'+safe(q.selected)+'</td><td>'+safe(q.expected)+'</td><td>'+(q.correct?'Betul':'Belum tepat')+'</td></tr>').join('')+'</tbody></table>':'')+'</article>';}).join('');}};
root.dataset.version='38';$('#jm-version').textContent='Joran Minda · Versi 38 · Latihan bergambar';
queue27();
