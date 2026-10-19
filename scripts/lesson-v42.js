// V42: immediate previous screens, complete choice audio and a steady pond.
const S42=JoranSupport42;
const checkBefore42=presentCheck35;
presentCheck35=function(){
 checkBefore42();const q=state27().q||0,card=panel24.querySelector('[data-check="'+q+'"]'),options=card?.querySelector('.jm-evidence-options35');
 if(options&&!options.querySelector('.jm-audio-pair37')){
  const pair=audioPair37(options,'Dengar pilihan',()=>speech36(JoranStory.lessonMake(storyKey,lessonBank34(storyKey)[q].page,currentLessonVersion34()).sentences));
  options.prepend(pair);pair.setAttribute('aria-label','Dengar semua pilihan ayat');
 }
 if(card&&lesson24().checks?.[q]&&Number.isInteger(state27().reviewCheck42)){
  card.querySelectorAll('input,select,[data-evidence35]').forEach(el=>{if(!el.disabled)el.disabled=true;});
  const stage=checkStage35(q);
  nav27(stage?'Ni — Pilih nilai murni':'Ca — Cari jawapan dalam cerita','Aktiviti 1 · Soalan '+(q+1)+' / 3','Seterusnya →',()=>{
   if(!stage)setCheckStage35(q,1);
   else{const pending=lesson24().checks.findIndex(e=>!e);if(q+1<pending)state27().reviewCheck42=q+1;else delete state27().reviewCheck42;renderLesson24();}
  },{status:'Jawapan ini telah disimpan.',back:()=>{
   if(stage)setCheckStage35(q,0);
   else if(q>0){state27().reviewCheck42=q-1;setCheckStage35(q-1,1);}
   else{delete state27().reviewCheck42;state27().reading=true;page24=4;setReadStage35(2);renderLesson24();}
  }});
 }
};
const directionBefore42=shortDirection35;
shortDirection35=function(){
 if(aux27==='outcomes')return {icon:'check',text:S42.outcomes};
 if(aux27==='certificate')return {icon:'star',text:progress23(who24())?.certificateEligible?(collaborative26()?S42.certificateGroup:S42.certificateSolo):S42.certificateLocked};
 return directionBefore42();
};
const gameBefore42=gameScreen27;
gameScreen27=function(){
 gameBefore42();const b=$('#jm-back27');b.disabled=pupilAudio26.busy()||cast;
 if(!roomSession&&!celebrating&&(step>=1&&step<=3||step===4&&bonusReady))b.onclick=()=>{
  if(b.disabled)return;stopVoice();resetCast();
  if(step===4)bonusReady=false;else step--;
  renderStory();renderTeam();renderQuestion();renderFlow();main27.scrollTop=0;queue27();
 };
};
// Capture the final screen, after every presentation layer has finished.
// Live forms use their adjacent step. Completed-task references never rescore.
let historyKey42='';
const paintBefore42=paint27;
paint27=function(){
 paintBefore42();if(!active27())return;
 if(aux27)setText36($('#jm-hear27'),'Dengar arahan');
 const owner=profile?.id+':'+storyKey;
 if(owner!==historyOwner30){history30=[];lastSnapshot30=null;historyOwner30=owner;historyKey42='';}
 const key=[view,aux27,$('#jm-phase27').textContent,$('#jm-title27').textContent,view==='game'?readPage+':'+step: view==='book'?bookPage+':'+closeStage27:page24+':'+(state27().q||0)+':'+panel24.dataset.read35+':'+checkStage35(state27().q||0)].join('|');
 if(!reference30.open&&key!==historyKey42){
  if(lastSnapshot30&&lastSnapshot30.key!==key){history30.push(lastSnapshot30.snapshot);if(history30.length>80)history30.shift();}
  historyKey42=key;
 }
 if(!reference30.open)lastSnapshot30={key,snapshot:snapshot30()};
};
root.dataset.version='42';$('#jm-version').textContent='Joran Minda · Versi 42 · Pilihan bersuara dan navigasi jelas';queue27();
