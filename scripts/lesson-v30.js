// V30: explicit prompts, accessible audio controls and non-destructive references.
const prompts30={
 belang:['Siapakah yang dipanggil oleh Hana untuk membantu anak kucing? Pilih ayat yang menceritakannya.','Ayat manakah menunjukkan Hana dan Iman menyediakan dua barang untuk Belang?','Ayat manakah menunjukkan Hana dan Iman menjalankan tugas menjaga Belang setiap hari?'],
 pondok:['Ayat manakah menunjukkan Hana mahu mengemas pondok yang berdebu?','Ayat manakah menunjukkan Iman membantu Hana meletakkan buku?','Apakah yang dilakukan oleh semua pembaca selepas membaca? Pilih ayat yang menceritakannya.'],
 pokok:['Ayat manakah menunjukkan Hana mahu membantu menjaga anak pokok?','Ayat manakah menunjukkan Iman membantu Hana menyiram anak pokok?','Apakah janji Iman kepada Tok Wan? Pilih ayat yang menceritakannya.'],
 sihat:['Apakah yang dilakukan oleh Hana dan Iman sebelum makan? Pilih ayat yang menceritakannya.','Ayat manakah menunjukkan Hana mengajak Iman menjaga kebersihan tempat berkelah?','Apakah yang dilakukan oleh mereka terhadap baki bekal? Pilih ayat yang menceritakannya.']
};
const questionBefore30=question24;
question24=function(item,i,prefix,saved){let html=questionBefore30(item,i,prefix,saved);if(prefix==='value')html=html.replace('Apakah perbuatan baik yang ditunjukkan dalam gambar dan petikan?',safe(prompts30[storyKey][i]));const spoken=(prefix==='value'?prompts30[storyKey][i]:item.action+' Apakah nilai yang ditunjukkan?')+' Pilihan jawapan: '+item.options.join('. ')+'.';return html.replace('</fieldset>','<button type="button" class="jm-secondary" data-hear-check30="'+safe(spoken)+'">Dengar soalan dan pilihan</button></fieldset>');};
root.addEventListener('click',e=>{const b=e.target.closest('[data-hear-check30]');if(b)speakMalay(b.dataset.hearCheck30,$('#jm-status27'));});

function diagnostic30(){return view==='lesson'&&!aux27&&eligible24()===3&&!lesson24().route;}
const directionsBefore30=instructionText28;
instructionText28=function(){
 if(diagnostic30())return 'Jawab sendiri dahulu tanpa bantuan rakan. Baca situasi dan pilih satu nilai murni. Jawapan tiga soalan ini menentukan latihan kamu: pemulihan, pengukuhan atau pengayaan. Selepas semakan awal, kamu boleh berbincang dengan rakan.';
 if(view==='game'&&step===2)return 'Baca ayat bukti. Pilih nilai yang sesuai. Catat nilai dan sebab kamu memilihnya. Kemudian, simpan catatan dan pancing jawapan. Dalam kumpulan, bincang bersama. Penyumbang menekan butang sendiri.';
 return directionsBefore30();
};

// A single cancellable playback path. Packaged clips do not need a device voice.
let cancelAudio30=null,audioTarget30=null;
function voiceTarget30(target){return target?.getClientRects().length?target:active27()?$('#jm-status27'):audioTarget30?.isConnected?audioTarget30:$('#jm-status27');}
root.addEventListener('click',e=>{const b=e.target.closest('button');if(!b||!isAudioButton31(b))return;let status=b.parentElement.querySelector(':scope>.jm-audio-status30');if(!status){status=document.createElement('p');status.className='jm-audio-status30';status.setAttribute('role','status');status.hidden=true;(b.nextElementSibling?.classList.contains('jm-stop30')?b.nextElementSibling:b).after(status);}audioTarget30=status;},true);
const stopBefore30=stopVoice;
stopVoice=function(){stopBefore30();cancelAudio30?.();cancelAudio30=null;delete root.dataset.audioLoading;};
const clipBefore30=packagedMalayClip;
packagedMalayClip=function(text){return window.JoranMalayAudio?.clips?.[normalizeVoice(text)]||clipBefore30(text);};
async function playClips30(texts,target,kind='help'){
 stopVoice();const ticket=voiceSequence;target=voiceTarget30(target);
 try{
  for(const text of texts){
   if(ticket!==voiceSequence)return;const clip=packagedMalayClip(text);if(!clip)throw Error('Audio penuh untuk teks ini belum disertakan.');
   const sprite=typeof clip==='object',player=new Audio(sprite?clip.src:clip);speechPlayer=activeVoice=player;player.preload='auto';player.playbackRate=kind==='cheer'?1:Number(prefs.speechRate)||.9;player.volume=kind==='cheer'?Math.max(0,Math.min(1,Number(prefs.cheerVolume)/100)):1;
   aiSpeaking=true;root.dataset.speakingKind=kind;root.dataset.speakingText=text;root.dataset.audioLoading='true';updateMusic();audioMessage('Memuatkan suara…',target);
   const wait=(event,ready,timeout)=>new Promise((resolve,reject)=>{let timer;const clean=()=>{clearTimeout(timer);player.removeEventListener(event,done);player.removeEventListener('error',fail);cancelAudio30=null;};const done=()=>{clean();resolve();};const fail=()=>{clean();reject(Error('Audio belum dapat dimuatkan. Tekan Dengar untuk mencuba semula.'));};cancelAudio30=()=>{clean();resolve();};if(ready()){done();return;}player.addEventListener(event,done,{once:true});player.addEventListener('error',fail,{once:true});timer=setTimeout(fail,timeout);});
   await wait('loadedmetadata',()=>player.readyState>=1,10000);if(ticket!==voiceSequence)return;
   if(sprite&&clip.start>0){const seek=wait('seeked',()=>Math.abs(player.currentTime-clip.start)<.05,10000);player.currentTime=clip.start;await seek;}
   if(ticket!==voiceSequence)return;delete root.dataset.audioLoading;audioMessage('Sedang dibaca: '+text,target);delete root.dataset.audioUnavailable;
   const ended=new Promise((resolve,reject)=>{let timer,guard;const clean=()=>{clearInterval(timer);clearTimeout(guard);player.onended=player.onerror=null;cancelAudio30=null;};const done=()=>{clean();player.pause();resolve();};cancelAudio30=done;player.onended=done;player.onerror=()=>{clean();reject(Error('Audio terhenti. Tekan Dengar untuk mencuba semula.'));};const end=sprite?clip.start+clip.duration:kind==='cheer'?Math.min(player.duration,2.6):player.duration;timer=setInterval(()=>{if(player.currentTime>=end||ticket!==voiceSequence)done();},30);guard=setTimeout(()=>{clean();player.pause();reject(Error('Audio terhenti. Tekan Dengar untuk mencuba semula.'));},Math.max(12000,(end-(sprite?clip.start:0))/player.playbackRate*1000+12000));});
   // Attach the rejection handler before play() so no stalled playback leaks a promise.
   const settled=ended.then(()=>null,e=>e);try{await player.play();}catch{cancelAudio30?.();throw Error('Tekan Dengar sekali lagi untuk membenarkan suara dimainkan.');}const error=await settled;if(error)throw error;
  }
  if(ticket!==voiceSequence)return;stopVoice();audioMessage('Selesai. Kamu boleh mendengar semula.',target);return true;
 }catch(e){if(ticket!==voiceSequence)return;stopVoice();root.dataset.audioUnavailable='true';audioMessage(e.message,target);}
}
const nativeBefore30=speakMalayDevice;
speakMalayDevice=async function(text,target){target=voiceTarget30(target);if(packagedMalayClip(text))return playClips30([text],target);return nativeBefore30(text,target);};
speakSequence=async function(texts,target,kind='help'){const list=texts.filter(Boolean);if(list.every(t=>packagedMalayClip(t)))return playClips30(list,target,kind);return speakMalayDevice(list.join(' '),target);};
speakMalay=function(text,target){return speakSequence([text],target);};
// Exact existing recording for note-taking; do not substitute an unrelated clip for a value.
helpText.notes=narration28.nilai;helpText.bonusNotes=narration28.peribahasa;
hearInstructions28=async function(){delete root.dataset.audioGuide;return speakMalay(instructionText28(),$('#jm-status27'));};
hearGuide=hearInstructions28;$('#jm-hear27').onclick=hearInstructions28;$('#jm-hear-guide').onclick=hearInstructions28;
function fishingText30(){return bonus?'Apakah maksud peribahasa '+stories[storyKey].bonus+'?':'Ayat bukti: '+storyPage().sentences[storyPage().evidence]+' Apakah nilai murni yang ditunjukkan oleh perbuatan ini?';}
hearQuestion=function(){return speakMalay(step===1?storyPage().clue:fishingText30(),$('#jm-status27'));};
$('#jm-hear-question').onclick=hearQuestion;$('#jm-hear-options').onclick=()=>hearChoices();
const fishChoices30=document.createElement('button');fishChoices30.type='button';fishChoices30.className='jm-secondary';fishChoices30.textContent='Dengar pilihan';fishChoices30.onclick=()=>hearChoices();fishTools27.append(fishChoices30);

function stopButton30(button){
 if(button.closest('#jm-reference30'))return;if(button.stop30){button.stop30.hidden=!button.getClientRects().length;return;}button.dataset.stopPaired30='true';
 const stop=document.createElement('button');stop.type='button';stop.className='jm-secondary jm-stop30';stop.textContent='Hentikan suara';stop.setAttribute('aria-label','Hentikan suara: '+button.textContent.trim());stop.onclick=()=>{stopVoice();const status=button.closest('dialog')?.querySelector('[role=status]')||voiceTarget30();if(status){status.hidden=false;status.textContent='Suara dihentikan.';}};stop.hidden=!button.getClientRects().length;button.stop30=stop;button.after(stop);
}
function pairAudio30(){root.querySelectorAll('button').forEach(b=>{if(isAudioButton31(b))stopButton30(b);});}
let pairing30=false;
new MutationObserver(()=>{if(pairing30)return;pairing30=true;queueMicrotask(()=>{pairAudio30();pairing30=false;});}).observe(root,{childList:true,subtree:true});
const responseBefore30=showResponse28;
showResponse28=function(title,text,then){responseBefore30(title,text,then);stopButton30($('#jm-response-hear28'));$('#jm-response-hear28').onclick=async()=>{if(title.startsWith('Tahniah')&&(packagedMalayClip(text)||availableMalayVoices().length)){const done=await playClips30(['Yeay!'],$('#jm-response-audio28'),'cheer');if(!done||!response28.open)return;}return speakMalay(text,$('#jm-response-audio28'));};};

// Previous completed screens are references. Their controls cannot submit or rescore.
const reference30=makeBox23('dialog','jm-reference30','');root.append(reference30);
reference30.addEventListener('close',()=>{reference30.innerHTML='';});
let referenceIndex30=0,history30=[],historyOwner30='',lastSnapshot30=null;
function snapshot30(){
 const container=aux27?extra27:view==='lesson'?panel24:view==='book'?closing27:$('[data-panel=game]');
 const copy=container.cloneNode(true),original=[container,...container.querySelectorAll('*')],clones=[copy,...copy.querySelectorAll('*')];
 original.forEach((el,i)=>{const clone=clones[i];if(!clone||!clone.parentNode&&i)return;const style=getComputedStyle(el);if(el.hidden||style.display==='none'||style.visibility==='hidden'||['SCRIPT','STYLE','DIALOG'].includes(el.tagName)){clone.remove();return;}clone.removeAttribute('id');clone.removeAttribute('name');clone.removeAttribute('autofocus');for(const attr of [...clone.attributes])if(attr.name.startsWith('on')||attr.name.startsWith('data-'))clone.removeAttribute(attr.name);if(el instanceof HTMLInputElement){clone.checked=el.checked;clone.value=el.value;clone.disabled=true;}if(el instanceof HTMLSelectElement){clone.value=el.value;clone.disabled=true;}if(el instanceof HTMLTextAreaElement){clone.textContent=el.value;clone.disabled=true;}if(el.tagName==='BUTTON'){if(el.hasAttribute('data-sentence')){const text=document.createElement('p');text.className='jm-sentence';text.innerHTML=clone.innerHTML;clone.replaceWith(text);}else clone.remove();}if(el.tagName==='A')clone.removeAttribute('href');if(el.tagName==='AUDIO')clone.remove();});
 return {title:$('#jm-title27').textContent,phase:$('#jm-phase27').textContent,html:copy.outerHTML};
}
function renderReference30(){const item=history30[referenceIndex30];reference30.innerHTML='<p class="jm-pdp-kicker">Rujuk semula · '+safe(item?.phase||'Permulaan')+'</p><h2>'+safe(item?.title||'Cara belajar')+'</h2><p>Jawapan dan mata kamu kekal. Tekan Sambung tugasan untuk meneruskan.</p><div class="jm-reference-content30">'+(item?.html||'<p>Ba · Baca cerita. Ca · Cari perbuatan watak. Ni · Tentukan nilai murni.</p>')+'</div><footer><button type="button" class="jm-secondary" id="jm-ref-prev30" '+(referenceIndex30<=0?'disabled':'')+'>← Sebelumnya</button><button type="button" class="jm-secondary" id="jm-ref-next30" '+(referenceIndex30>=history30.length-1?'disabled':'')+'>Berikutnya →</button><button type="button" class="jm-primary" id="jm-ref-close30">Sambung tugasan →</button></footer>';
 $('#jm-ref-prev30').onclick=()=>{referenceIndex30--;renderReference30();};$('#jm-ref-next30').onclick=()=>{referenceIndex30++;renderReference30();};$('#jm-ref-close30').onclick=()=>reference30.close();
}
function openReference30(){stopVoice();remember27();referenceIndex30=Math.max(0,history30.length-1);renderReference30();if(!reference30.open)reference30.showModal();}
const navBefore30=nav27;
nav27=function(title,phase,next,action,options={}){navBefore30(title,phase,next,action,{...options,back:options.back||openReference30});};

// Render the entire above-water illustration, including all three heads.
const scenery30=$('.jm-scenery');scenery30.innerHTML='<svg viewBox="0 0 1536 480" preserveAspectRatio="xMidYMid meet" aria-hidden="true"><image href="'+assets.lake+'" width="1536" height="1024"/></svg>';
const written30=makeBox23('p','jm-written30','');written30.className='jm-written30';main27.prepend(written30);
const paintBefore30=paint27;
paint27=function(){
 paintBefore30();if(!active27())return;
 const text=instructionText28();if(written30.textContent!=='Arahan: '+text)written30.textContent='Arahan: '+text;
 const row=$('#jm-contributor28');if(diagnostic30()){
  const member=practiceMember28();row.innerHTML='Jawab sendiri: <strong>'+safe(member.name)+'</strong><span>Tanpa bantuan rakan dahulu · Rakan menunggu giliran</span>';
  $('#jm-status27').textContent=roomSession&&!canLead26()?'Giliran '+member.name+' menjawab sendiri. Tunggu dahulu.':'Jawab sendiri. Selepas semakan ini, rakan boleh membantu dalam latihan.';
 }
 if(view==='game'){
  const q=$('#jm-question'),doc=storyPage();if(bonus){q.innerHTML='<strong>'+syl('Apakah maksud peribahasa '+stories[storyKey].bonus+'?')+'</strong>';}
  else q.innerHTML='<span class="jm-evidence-label30">Ayat bukti · Halaman '+(readPage+1)+'</span><p>'+syl(doc.sentences[doc.evidence])+'</p><strong>'+syl(currentLessonVersion34()>=34?doc.question:'Apakah nilai murni yang ditunjukkan oleh perbuatan ini?')+'</strong>';
 }
 pairAudio30();
 const owner=profile?.id+':'+storyKey;if(owner!==historyOwner30){history30=[];lastSnapshot30=null;historyOwner30=owner;}
 const key=[view,aux27,$('#jm-phase27').textContent,$('#jm-title27').textContent,view==='game'?readPage+':'+step:''].join('|');
 if(lastSnapshot30&&lastSnapshot30.key!==key){history30.push(lastSnapshot30.snapshot);if(history30.length>60)history30.shift();}
 lastSnapshot30={key,snapshot:snapshot30()};
};
// Outside learning screens, the same explicit Back action returns to the menu.
for(const panel of $$('[data-panel]'))if(!['home','game','book'].includes(panel.dataset.panel)&&!panel.querySelector('[data-back-menu30]')){const b=document.createElement('button');b.type='button';b.className='jm-secondary';b.dataset.backMenu30='';b.textContent='← Kembali';b.onclick=()=>{stopVoice();showView('home');};panel.prepend(b);}
pairAudio30();
root.dataset.version='30';$('#jm-version').textContent='Joran Minda · Versi 30 · Arahan jelas dan rujukan semula';
window.JoranDiagnostics30=()=>({...window.JoranDiagnostics28(),version:30,audio:{malayDeviceVoices:availableMalayVoices().length,packagedClips:Object.keys(window.JoranMalayAudio?.clips||{}).length},referenceCount:history30.length});
