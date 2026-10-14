// V33: exact-text narration, one cancellable player, and portable teacher recordings.
const speechSlot33=text=>'speech:'+encodeURIComponent(normalizeVoice(text));
const audioSlotBefore33=audioSlot;
audioSlot=key=>audioSlotBefore33(key)||(typeof key==='string'&&key.startsWith('speech:')&&key.length<=18000);
const voiceCatalog33=new Map((window.JoranVoiceCatalog?.clips||[]).map(x=>[normalizeVoice(x.text),x]));
for(const text of loadJSON('joran-minda-audio-texts-v33',[]))if(typeof text==='string'&&text.length<=5000&&!voiceCatalog33.has(normalizeVoice(text)))voiceCatalog33.set(normalizeVoice(text),{text,category:'Teks tambahan',story:''});
function registerSpeech33(text){text=normalizeVoice(text);if(!text||text.length>5000||voiceCatalog33.has(text))return;voiceCatalog33.set(text,{text,category:'Teks tambahan',story:''});storeJSON('joran-minda-audio-texts-v33',[...voiceCatalog33.values()].filter(x=>x.category==='Teks tambahan').map(x=>x.text).slice(-300));}
function validVoiceRow33(r){return r&&audioSlot(r.slot)&&typeof r.text==='string'&&r.text.length<=5000&&typeof r.name==='string'&&r.name.length<=300&&typeof r.url==='string'&&r.url.length<=22*1024*1024&&/^data:audio\/[a-z0-9.+-]+(?:;[^,]*)?;base64,[A-Za-z0-9+/=]+$/i.test(r.url)&&(!r.slot.startsWith('speech:')||r.slot===speechSlot33(r.text));}
// The shipped pack is readable on every device and never overwrites a newer local take.
for(const row of window.JoranTeacherVoicePack?.recordings||[])if(validVoiceRow33(row)){
 const rec={...row,takeId:row.takeId||'website',savedAt:Number(row.savedAt)||0,persisted:true,bundled33:true};
 recordings[takeKey(row.slot,rec)]=rec;if(row.slot.startsWith('speech:'))registerSpeech33(row.text);
}
function customClip33(text){return recordingTakes(speechSlot33(text)).find(t=>recordingMatches(t.record,normalizeVoice(text)))?.record||null;}
const exactClips33=new Map(Object.entries(window.JoranMalayAudio?.clips||{}).map(([text,clip])=>[normalizeVoice(text),clip]));
// Only exact text matches are accepted. Never cut a longer, different instruction to fit.
packagedMalayClip=function(text){return customClip33(text)?.url||exactClips33.get(normalizeVoice(text))||null;};

let cancelSpeech33=null,teacherButton33=null;
const stopVoiceBefore33=stopVoice;
stopVoice=function(){const cancel=cancelSpeech33;cancelSpeech33=null;cancel?.();stopVoiceBefore33();delete root.dataset.speakingText;$$('.jm-audio-status30').forEach(p=>{if(/^(Memuatkan suara|Sedang dibaca)/.test(p.textContent))p.textContent='Suara dihentikan.';});if(teacherButton33){teacherButton33.textContent=teacherButton33.dataset.idleLabel33||'Dengar Guru';teacherButton33=null;}updateMusic();};
// The persistent stop control must call the current cancellable player.
$('#jm-stop-ai').onclick=()=>stopVoice();
function audioWait33(start,ticket,timeout=90000){return new Promise((resolve,reject)=>{
 let timer,cleanup=()=>{},finished=false;
 const finish=error=>{if(finished)return;finished=true;clearTimeout(timer);cleanup();if(cancelSpeech33===cancel)cancelSpeech33=null;error?reject(error):resolve(ticket===voiceSequence);};
 const cancel=()=>finish();cancelSpeech33=cancel;
 timer=setTimeout(()=>finish(Error('Suara terhenti. Tekan Dengar untuk mencuba semula.')),timeout);
 try{cleanup=start(finish)||(()=>{});if(finished)cleanup();}catch(e){finish(e);}
});}
async function playMedia33(clip,text,target,ticket,kind='help'){
 const sprite=typeof clip==='object',player=new Audio(sprite?clip.src:clip);speechPlayer=activeVoice=player;
 player.preload='auto';player.playbackRate=kind==='cheer'||kind==='teacher'?1:Number(prefs.speechRate)||.9;
 player.volume=kind==='cheer'?Math.max(0,Math.min(1,Number(prefs.cheerVolume)/100)):1;
 root.dataset.audioLoading='true';audioMessage('Memuatkan suara…',target);
 const loaded=await audioWait33(done=>{const ok=()=>done(),bad=()=>done(Error('Fail audio tidak dapat dibuka. Semak rakaman dalam Studio semua suara.'));player.addEventListener('loadedmetadata',ok);player.addEventListener('error',bad);if(player.readyState>=1)ok();return()=>{player.removeEventListener('loadedmetadata',ok);player.removeEventListener('error',bad);};},ticket,12000);
 if(!loaded)return false;
 if(sprite&&clip.start>0){const sought=await audioWait33(done=>{const ok=()=>done();player.addEventListener('seeked',ok);player.currentTime=clip.start;return()=>player.removeEventListener('seeked',ok);},ticket,12000);if(!sought)return false;}
 delete root.dataset.audioLoading;root.dataset.speakingKind=kind;root.dataset.speakingText=text;aiSpeaking=true;updateMusic();audioMessage('Sedang dibaca: '+text,target);
 const end=sprite?clip.start+clip.duration:player.duration;
 return audioWait33(done=>{
  const complete=()=>done(),fail=()=>done(Error('Audio terhenti. Tekan Dengar untuk mencuba semula.'));
  player.onended=complete;player.onerror=fail;
  const timer=setInterval(()=>{if(sprite&&player.currentTime>=end)complete();},35);
  player.play().catch(()=>done(Error('Tekan Dengar sekali lagi untuk membenarkan suara dimainkan.')));
  return()=>{clearInterval(timer);player.onended=player.onerror=null;player.pause();};
 },ticket,Math.max(20000,(Number.isFinite(end)?end-(sprite?clip.start:0):120)/player.playbackRate*1000+15000));
}
async function playDevice33(text,target,ticket){
 let voices=availableMalayVoices();
 for(let i=0;i<10&&!voices.length&&window.speechSynthesis;i++){await new Promise(r=>setTimeout(r,100));if(ticket!==voiceSequence)return false;voices=availableMalayVoices();}
 if(!voices.length)throw Error('Fail suara bagi teks ini belum ada dan suara Bahasa Melayu peranti tidak tersedia. Guru boleh melengkapkannya dalam Studio semua suara.');
 if(ticket!==voiceSequence)return false;
 const utterance=new SpeechSynthesisUtterance(text);utterance.voice=voices.find(v=>v.voiceURI===prefs.voice)||voices[0];utterance.lang='ms-MY';utterance.rate=Number(prefs.speechRate)||.9;utterance.volume=1;aiUtterance=utterance;aiSpeaking=true;root.dataset.speakingText=text;root.dataset.speakingKind='help';audioMessage('Sedang dibaca: '+text,target);updateMusic();
 return audioWait33(done=>{utterance.onend=()=>done();utterance.onerror=e=>done(Error(e.error==='not-allowed'?'Tekan Dengar sekali lagi untuk membenarkan suara.':'Suara peranti terganggu. Tekan Dengar untuk mencuba semula.'));window.speechSynthesis.resume();window.speechSynthesis.speak(utterance);return()=>{utterance.onend=utterance.onerror=null;};},ticket,Math.max(30000,text.length*160));
}
speakSequence=async function(texts,target,kind='help'){
 stopVoice();const ticket=voiceSequence;target=voiceTarget30(target);delete root.dataset.audioUnavailable;
 $('#jm-stop-ai').hidden=false;$$('[data-voice-stop]').forEach(b=>b.disabled=false);
 try{
  await restoreAudio();if(ticket!==voiceSequence)return false;
  for(const input of texts.filter(Boolean)){
   const text=normalizeVoice(input);registerSpeech33(text);if(ticket!==voiceSequence)return false;
   const clip=packagedMalayClip(text),ok=clip?await playMedia33(clip,text,target,ticket,text==='Yeay!'?'cheer':kind):await playDevice33(text,target,ticket);
   if(!ok||ticket!==voiceSequence)return false;
  }
  if(ticket!==voiceSequence)return false;stopVoice();audioMessage('Selesai. Kamu boleh mendengar semula.',target);return true;
 }catch(e){if(ticket!==voiceSequence)return false;stopVoice();root.dataset.audioUnavailable='true';audioMessage(e.message,target);return false;}
};
speakMalay=(text,target)=>speakSequence([text],target);
speakMalayDevice=speakMalay;
playClips30=(texts,target,kind)=>speakSequence(texts,target,kind);
listenPage=async function(page,button,note){
 stopVoice();const ticket=voiceSequence,key=storyKey;note.hidden=false;note.textContent='Memuatkan rakaman Guru…';
 await restoreAudio();if(ticket!==voiceSequence||key!==storyKey)return;
 if(roomSession&&!readingAudio(page))await roomReading(page);
 if(ticket!==voiceSequence||key!==storyKey)return;
 const rec=readingAudio(page);if(!rec){note.textContent=audioRestoreError||'Rakaman Guru untuk halaman ini belum tersedia. Guru perlu merakam atau memulihkan salinan rakaman dalam Studio semua suara.';return;}
 teacherButton33=button;button.dataset.idleLabel33=button.textContent;button.textContent='Bacaan Guru sedang dimainkan';
 try{const ok=await playMedia33(rec.url,rec.text,note,ticket,'teacher');if(ok&&ticket===voiceSequence){stopVoice();note.textContent='Bacaan Guru selesai. Kamu boleh mendengar semula.';}}
 catch(e){if(ticket===voiceSequence){stopVoice();note.textContent=e.message;}}
};
// Read precisely the written feedback, with the brief cheer before success only.
const responseBefore33=showResponse28;
showResponse28=function(title,text,then){responseBefore33(title,text,then);registerSpeech33(text);$('#jm-response-hear28').onclick=()=>speakSequence(title.startsWith('Tahniah')&&$('#jm-effects').checked&&Number(prefs.cheerVolume)>0?['Yeay!',text]:[text],$('#jm-response-audio28'));};
playSuccess=function(kind){if(!$('#jm-effects').checked)return;const texts={correct:'Jawapan kamu tepat.',caught:'Kamu berjaya memancing jawapan yang tepat.',bonus:'Jawapan kamu tepat.',complete:'Tahniah! Buku cerita kamu telah siap.'};return speakSequence(['Yeay!',texts[kind]||texts.correct],$('#jm-guide-status'));};
$('#jm-hear-success').onclick=()=>playSuccess(bonus?'bonus':'caught');
$('#jm-test-cheer').onclick=()=>speakSequence(['Yeay!'],$('#jm-ai-availability'),'cheer');
const paintBefore33=paint27;paint27=function(){paintBefore33();if(active27())registerSpeech33(instructionText28());};

// Reuse the proven microphone and IndexedDB workflow for exact-text instruction recordings.
let studioKind33='story',selectedSpeech33='';
const studioSelection33=loadJSON('joran-minda-studio-v33',null);
if(studioSelection33&&stories[studioSelection33.story]&&/^page[1-5]$/.test(studioSelection33.part)){$('#jm-voice-story').value=studioSelection33.story;$('#jm-voice-part').value=studioSelection33.part;}
const voicePanel33=$('[data-panel=voice]');voicePanel33.querySelector('h2').textContent='Studio semua suara';
voicePanel33.querySelector('h2+p').textContent='Lengkapkan suara mengikut teks yang dipaparkan. Bacaan cerita menggunakan suara Guru. Arahan boleh menggunakan fail suara AI atau rakaman Guru.';
const hub33=makeBox23('section','jm-audio-hub33','<div class="jm-row"><button type="button" class="jm-primary" data-studio-kind33="story">Bacaan cerita Guru</button><button type="button" class="jm-secondary" data-studio-kind33="speech">Arahan, semakan dan tahniah</button></div><p id="jm-audio-summary33" role="status"></p><div id="jm-audio-filter33" hidden><label>Jenis suara<select id="jm-audio-category33" class="jm-input"><option value="">Semua jenis</option></select></label><label>Cerita<select id="jm-audio-story33" class="jm-input"><option value="">Semua cerita</option></select></label><label>Cari teks<input id="jm-audio-search33" class="jm-input" type="search" placeholder="Contoh: pemulihan atau tahniah"></label><label class="jm-toggle"><input type="checkbox" id="jm-audio-missing33" checked>Belum mempunyai fail suara sahaja</label><label class="jm-field">Pilih teks<select id="jm-audio-select33" class="jm-input" size="5"></select></label><p id="jm-audio-item33"></p><button type="button" class="jm-secondary" id="jm-audio-test33">Dengar suara teks ini</button><p id="jm-audio-test-status33" role="status"></p></div><details><summary>Simpan suara untuk website dan salinan sandaran</summary><p>Rakaman dalam pelayar ini tidak berpindah sendiri ke telefon atau komputer murid. Muat turun fail suara untuk website, kemudian gantikan fail <strong>public/suara-joran-minda.js</strong> dalam projek GitHub. Terbitkan kemas kini Netlify. Semua rakaman Guru dalam fail itu akan boleh didengar oleh pelawat laman.</p><div class="jm-row"><button type="button" class="jm-primary" id="jm-export-voices33">Muat turun suara untuk website</button><button type="button" class="jm-secondary" id="jm-backup-voices33">Sandaran semua suara Guru</button></div><label class="jm-field">Pulihkan sandaran semua suara<input type="file" id="jm-import-voices33" accept=".json,application/json"></label><p>Fail ini mengandungi suara arahan dan rakaman Guru yang disimpan. Rakaman bacaan murid tidak dimasukkan.</p><p id="jm-pack-status33" role="status"></p></details>');
voicePanel33.querySelector('.jm-audio-roles').replaceWith(hub33);
const voiceBefore33=voiceKey;voiceKey=function(){return studioKind33==='speech'?speechSlot33(selectedSpeech33):voiceBefore33();};
function filteredVoices33(){const category=$('#jm-audio-category33').value,story=$('#jm-audio-story33').value,q=$('#jm-audio-search33').value.toLocaleLowerCase('ms'),missing=$('#jm-audio-missing33').checked;return [...voiceCatalog33.values()].filter(x=>(!category||x.category===category)&&(!story||x.story===story)&&(!q||x.text.toLocaleLowerCase('ms').includes(q))&&(!missing||!packagedMalayClip(x.text)));}
function fillVoiceList33(){
 const complete=[...voiceCatalog33.values()].every(x=>!!packagedMalayClip(x.text));
 if(complete)$('#jm-audio-missing33').checked=false;
 const select=$('#jm-audio-select33'),items=filteredVoices33();select.replaceChildren(...items.map(x=>new Option(x.category+' · '+x.text,x.text)));
 if(items.some(x=>x.text===selectedSpeech33))select.value=selectedSpeech33;else selectedSpeech33=items[0]?.text||'';
 select.value=selectedSpeech33;$('#jm-audio-item33').textContent=items.length+' teks dalam senarai ini. '+(complete?'Semua teks katalog mempunyai fail suara. Pilih satu dan tekan Dengar suara teks ini.':'Pilih satu, kemudian rakam atau muat naik audio pada langkah 3.');renderVoice();
}
function renderSummary33(){const all=[...voiceCatalog33.values()],ready=all.filter(x=>!!packagedMalayClip(x.text)).length,storiesReady=Object.keys(stories).reduce((n,key)=>n+Array.from({length:5},(_,p)=>!!readingAudio(p,key)).filter(Boolean).length,0);$('#jm-audio-summary33').textContent=all.length+' teks arahan, pilihan dan maklum balas: '+ready+' mempunyai fail suara; '+(all.length-ready)+' belum mempunyai fail suara. Bacaan cerita Guru: '+storiesReady+'/20 halaman. '+(ready===all.length?'Semua suara katalog boleh dimainkan tanpa suara Melayu peranti.':availableMalayVoices().length?'Suara Melayu peranti juga tersedia.':'Suara Melayu peranti tidak dikesan.');}
for(const category of [...new Set([...voiceCatalog33.values()].map(x=>x.category))])$('#jm-audio-category33').add(new Option(category,category));
for(const [key,story]of Object.entries(stories))$('#jm-audio-story33').add(new Option(story.title,key));
for(const id of ['jm-audio-category33','jm-audio-story33','jm-audio-missing33'])$('#'+id).onchange=fillVoiceList33;
$('#jm-audio-search33').oninput=fillVoiceList33;
$('#jm-audio-select33').onchange=e=>{stopVoice();selectedSpeech33=e.target.value;studioTakeKey='';renderVoice();};
function setStudio33(kind){if(micState!=='idle')return;stopVoice();studioKind33=kind;studioTakeKey='';$('#jm-audio-filter33').hidden=kind!=='speech';hub33.querySelectorAll('[data-studio-kind33]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.studioKind33===kind)));kind==='speech'?fillVoiceList33():renderVoice();}
hub33.querySelectorAll('[data-studio-kind33]').forEach(b=>b.onclick=()=>setStudio33(b.dataset.studioKind33));
const renderVoiceBefore33=renderVoice;
renderVoice=function(){
 const speech=studioKind33==='speech';voicePanel33.querySelector('.jm-studio-pick').hidden=speech;$('#jm-voice-art').hidden=speech;$('#jm-record-pages').hidden=speech;voicePanel33.querySelector('.jm-share-audio-box').hidden=speech;
 voicePanel33.querySelector('.jm-voice-backup').hidden=speech;
 voicePanel33.querySelectorAll('.jm-voice-panel')[1].querySelector('h3').textContent=speech?'3. Rakam atau muat naik suara':'3. Rakam suara Guru';
 $('#jm-record-text').nextElementSibling.textContent=speech?'Baca seluruh teks tepat seperti yang dipaparkan. Rakaman ini dipautkan kepada teks tersebut.':'Rakaman mestilah sepadan dengan ayat cerita pada halaman ini. Dengar semula untuk menyemak bacaan.';
 if(!speech){storeJSON('joran-minda-studio-v33',{story:$('#jm-voice-story').value,part:$('#jm-voice-part').value});renderVoiceBefore33();renderSummary33();return;}
 $('#jm-voice-title').textContent='Teks suara yang dipilih';$('#jm-record-text').textContent=selectedSpeech33||'Tiada teks sepadan. Tukar penapis atau nyahpilih Belum mempunyai fail suara sahaja.';
 const takes=recordingTakes(voiceKey()),chosen=takes.find(t=>t.key===studioTakeKey)||takes[0],record=chosen?.record;studioTakeKey=chosen?.key||'';
 $('#jm-saved-takes').replaceChildren(...takes.map((t,i)=>new Option('Rakaman '+(takes.length-i)+' · '+new Date(t.record.savedAt).toLocaleString('ms-MY'),t.key)));$('#jm-saved-takes').value=studioTakeKey;
 const audio=$('#jm-audio'),download=$('#jm-download-audio');audio.hidden=download.hidden=!record;
 if(record){if(audio.getAttribute('src')!==record.url)audio.src=record.url;download.href=record.url;download.download=record.name;}else{audio.removeAttribute('src');download.removeAttribute('href');}
 $('#jm-saved-text').textContent=record?'Rakaman terbaharu dengan teks yang sama digunakan untuk murid. Rakaman terdahulu masih disimpan.':'Tiada rakaman Guru bagi teks ini.';
 $('#jm-playback-help').textContent='Baca skrip tepat seperti yang dipaparkan. Dengar semula untuk menyemak sebutan dan kelantangan.';
 if(micState==='idle')voiceNotice(packagedMalayClip(selectedSpeech33)?'Fail suara tersedia. Tekan Dengar suara teks ini untuk menyemak.':'Fail suara belum dimasukkan. Rakam di sini atau muat naik fail audio yang membaca teks ini.');
 updateMicControls();renderSummary33();
};
const updateMicBefore33=updateMicControls;updateMicControls=function(){updateMicBefore33();const busy=micState!=='idle';hub33.querySelectorAll('input,select,button').forEach(b=>b.disabled=busy);if(studioKind33==='speech'&&!selectedSpeech33){$('#jm-record-start').disabled=true;$('#jm-audio-file').disabled=true;$('#jm-audio-test33').disabled=true;}};
$('#jm-audio-test33').onclick=()=>selectedSpeech33&&speakMalay(selectedSpeech33,$('#jm-audio-test-status33'));
const acceptBefore33=acceptRecording;
acceptRecording=async function(key,blob,name,text){
 if(micState==='recording')throw Error('Hentikan rakaman sebelum menyimpan.');
 if(!blob?.size||blob.size>15*1024*1024)throw Error('Pilih rakaman yang tidak kosong dan di bawah 15 MB.');
 // Reject unreadable uploads before changing any saved take.
 await new Promise((resolve,reject)=>{const url=URL.createObjectURL(blob),a=new Audio(url);let timer;const done=error=>{clearTimeout(timer);a.onloadedmetadata=a.onerror=null;a.removeAttribute('src');URL.revokeObjectURL(url);error?reject(error):resolve();};a.onloadedmetadata=()=>done();a.onerror=()=>done(Error('Fail ini tidak boleh dimainkan. Pilih rakaman MP3, WAV, M4A atau WebM yang sah.'));timer=setTimeout(()=>done(Error('Rakaman belum dapat dibuka. Cuba fail audio yang lain.')),12000);});
 await acceptBefore33(key,blob,name,text);if(key.startsWith('speech:'))registerSpeech33(text);renderSummary33();
};
// Prevent the old page-status buttons from leaving the studio in instruction mode.
const auditBefore33=renderRecordingLibrary;renderRecordingLibrary=function(){auditBefore33();$('#jm-recording-audit').querySelectorAll('button').forEach(b=>{const old=b.onclick;b.onclick=()=>{studioKind33='story';$('#jm-audio-filter33').hidden=true;old();};});};
const originalStoryChange33=$('#jm-voice-story').onchange;$('#jm-voice-story').onchange=()=>{studioTakeKey='';originalStoryChange33();};
function voiceRows33(allTakes){const result=[],seen=new Set();for(const [key,r]of Object.entries(recordings)){if(!validVoiceRow33(r))continue;const identity=r.slot+'|'+r.takeId;if(seen.has(identity))continue;seen.add(identity);result.push(r);}if(allTakes)return result.map(r=>({...r}));const latest=new Map();for(const r of result){const k=r.slot+'|'+audioText(r.text),old=latest.get(k);if(!old||(r.savedAt||0)>(old.savedAt||0))latest.set(k,r);}return [...latest.values()].map(({slot,text,url,name,takeId,savedAt})=>({slot,text,url,name,takeId,savedAt}));}
async function exportVoicePack33(website){
 const status=$('#jm-pack-status33');await restoreAudio();const rows=voiceRows33(!website);if(!rows.length){status.textContent='Belum ada rakaman Guru untuk dimuat turun.';return;}
 const data={version:1,recordings:rows};if(!website)data.format='joran-minda-semua-suara';
 const text=website?'window.JoranTeacherVoicePack='+JSON.stringify(data).replace(/</g,'\\u003c')+';\n':JSON.stringify(data);
 const bytes=new Blob([text],{type:website?'text/javascript':'application/json'});if(website&&bytes.size>24*1024*1024){status.textContent='Fail suara melebihi 24 MB. Muat turun sandaran dan hantarkan untuk disediakan sebagai fail audio berasingan.';return;}
 downloadBlob(bytes,website?'suara-joran-minda.js':'sandaran-semua-suara-joran-minda.json');status.textContent=website?'Fail suara dimuat turun. Gantikan public/suara-joran-minda.js dalam GitHub dan tunggu Netlify menerbitkan kemas kini.':'Sandaran semua rakaman Guru dimuat turun. Simpan fail ini untuk memulihkan suara pada pelayar atau peranti lain.';
}
$('#jm-export-voices33').onclick=()=>exportVoicePack33(true);$('#jm-backup-voices33').onclick=()=>exportVoicePack33(false);
$('#jm-import-voices33').onchange=async e=>{
 const file=e.target.files[0];if(!file)return;const status=$('#jm-pack-status33');
 try{if(file.size>100*1024*1024)throw Error('Pilih fail sandaran di bawah 100 MB.');const data=JSON.parse(await file.text());if(data.version!==1||!['joran-minda-semua-suara','joran-minda-rakaman-guru'].includes(data.format)||!Array.isArray(data.recordings)||data.recordings.length>2000||data.recordings.some(r=>!validVoiceRow33(r)))throw Error('Fail sandaran suara tidak sah.');
  await restoreAudio();micState='saving';updateMicControls();
  const imported=data.recordings.map(r=>({...r,takeId:r.takeId||newId(),savedAt:Number(r.savedAt)||Date.now(),persisted:true}));
  await writeAudioRows(imported.map(r=>({...r,key:takeKey(r.slot,r)})));
  for(const r of imported){recordings[takeKey(r.slot,r)]=r;if(r.slot.startsWith('speech:'))registerSpeech33(r.text);}
  status.textContent='✓ '+imported.length+' rakaman dipulihkan. Rakaman sedia ada dikekalkan.';
 }catch(err){status.textContent=err.message;}finally{e.target.value='';micState='idle';renderVoice();updateMicControls();}
};
// The main teacher entry points lead directly to the same studio.
for(const b of $$('[data-view="voice"]'))b.textContent='Studio semua suara';
const hubLink33=makeBox23('button','jm-open-voices33','Studio semua suara',$('#jm-teacher-room'));hubLink33.type='button';hubLink33.className='jm-primary';hubLink33.onclick=()=>{showView('voice');setStudio33('story');};
populateMalayVoices=function(){const voices=availableMalayVoices(),select=$('#jm-ai-voice');select.replaceChildren(new Option('Gunakan fail suara yang disediakan',''));for(const v of voices)select.add(new Option(v.name+' · Bahasa Melayu',v.voiceURI));select.disabled=!voices.length;if(voices.some(v=>v.voiceURI===prefs.voice))select.value=prefs.voice;$('#jm-ai-availability').textContent='Fail suara dan rakaman Guru digunakan dahulu. '+(voices.length?'Suara Melayu peranti digunakan untuk teks yang belum mempunyai fail.':'Peranti ini tiada suara Melayu. Lengkapkan fail yang belum ada melalui Studio semua suara.');};
window.speechSynthesis?.addEventListener?.('voiceschanged',populateMalayVoices);populateMalayVoices();
root.dataset.version='33';$('#jm-version').textContent='Joran Minda · Versi 33 · Studio semua suara';
window.JoranDiagnostics33=()=>({...window.JoranDiagnostics31(),version:33,audio:{catalog:voiceCatalog33.size,files:[...voiceCatalog33.keys()].filter(t=>!!packagedMalayClip(t)).length,missing:[...voiceCatalog33.keys()].filter(t=>!packagedMalayClip(t)),deviceVoices:availableMalayVoices().length,teacherPages:Object.keys(stories).map(key=>({story:key,pages:Array.from({length:5},(_,p)=>!!readingAudio(p,key))}))}});
restoreAudio().then(()=>{renderSummary33();if(view==='voice')renderVoice();});
