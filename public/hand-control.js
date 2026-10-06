/* Joran Minda v15. Camera opens before downloading the hand detector. */
(function(global){
'use strict';
const clamp=(n,a=0,b=1)=>Math.max(a,Math.min(b,n));
class Gesture{
 constructor(){this.reset();}
 reset(){this.armed=false;this.target=-1;this.since=0;this.locked=-1;this.base=0;this.lockedAt=0;this.done=false;}
 feed(s,now,hold=450,lift=.12){
  if(!s||![s.ratio,s.palm].every(Number.isFinite)){this.reset();return {state:'missing',progress:0};}
  if(this.done)return {state:'done'};
  if(this.locked>=0){
   if(now-this.lockedAt>=300&&this.base-s.palm>=lift){this.done=true;return{state:'caught',index:this.locked};}
   return{state:'lift',index:this.locked,progress:clamp((this.base-s.palm)/lift)};
  }
  if(s.ratio>.6){this.armed=true;this.target=-1;this.since=now;}
  if(!this.armed)return{state:'open',progress:0};
  if(s.ratio<.36&&s.target>=0){
   if(this.target!==s.target){this.target=s.target;this.since=now;}
   const progress=clamp((now-this.since)/hold);
   if(progress===1){this.locked=s.target;this.base=s.palm;this.lockedAt=now;return{state:'selected',index:s.target,progress:0};}
   return{state:'pinch',index:s.target,progress};
  }
  this.target=-1;this.since=now;return{state:'aim',progress:0};
 }
}
const workerCode=`
let detector=null;
async function unpack(encoded){
 const raw=atob(encoded),bytes=new Uint8Array(raw.length);for(let i=0;i<raw.length;i++)bytes[i]=raw.charCodeAt(i);
 return new Uint8Array(await new Response(new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'))).arrayBuffer());
}
self.onmessage=async function(event){const m=event.data;
 if(m.type==='init'){try{
  self.exports={};
  let bundle;
  if(m.inline)bundle=await unpack(m.inline.bundle);
  else{const response=await fetch(m.paths.bundle);if(!response.ok)throw Error('Bundle unavailable');bundle=await response.text();}
  const bundleURL=URL.createObjectURL(new Blob([bundle],{type:'text/javascript'}));
  try{importScripts(bundleURL);}finally{URL.revokeObjectURL(bundleURL);}
  const {FilesetResolver,HandLandmarker}=self.exports;
  let files,model,loaderURL,wasmURL;
  if(m.inline){
   const [loader,wasm,buffer]=await Promise.all([unpack(m.inline.loader),unpack(m.inline.wasm),unpack(m.inline.model)]);
   loaderURL=URL.createObjectURL(new Blob([loader],{type:'text/javascript'}));wasmURL=URL.createObjectURL(new Blob([wasm],{type:'application/wasm'}));
   files={wasmLoaderPath:loaderURL,wasmBinaryPath:wasmURL};model={modelAssetBuffer:buffer};
  }else{files=await FilesetResolver.forVisionTasks(m.paths.wasm);model={modelAssetPath:m.paths.model};}
  try{detector=await HandLandmarker.createFromOptions(files,{baseOptions:{...model,delegate:'CPU'},runningMode:'VIDEO',numHands:1,minHandDetectionConfidence:.55,minHandPresenceConfidence:.55,minTrackingConfidence:.55});}
  finally{if(loaderURL)URL.revokeObjectURL(loaderURL);if(wasmURL)URL.revokeObjectURL(wasmURL);}
  self.postMessage({type:'ready'});
 }catch(e){self.postMessage({type:'error',message:String(e.message||e)});}return;}
 if(m.type==='frame'){try{
  if(!detector)throw Error('Detector unavailable');
  const result=detector.detectForVideo(m.bitmap,m.time);
  self.postMessage({type:'result',landmarks:result.landmarks[0]||null,time:m.time});
 }catch(e){self.postMessage({type:'error',message:String(e.message||e)});}finally{m.bitmap?.close();}}
};`;
function mount(bridge){
 const root=bridge.root,$=s=>root.querySelector(s),$$=s=>Array.from(root.querySelectorAll(s));
 const panel=$('#jm-hand-panel'),stage=$('#jm-stage'),video=$('#jm-hand-video'),status=$('#jm-hand-status'),cursor=$('#jm-hand-cursor'),practice=$('#jm-hand-practice');
 let prefs={trained:false,easy:true,mirror:true};try{Object.assign(prefs,JSON.parse(localStorage.getItem('joran-minda-tangan-v11')||'{}'));}catch{}
 const save=()=>{try{localStorage.setItem('joran-minda-tangan-v11',JSON.stringify(prefs));}catch{}};
 let active=false,loading=false,token=0,stream=null,worker=null,workerURL=null,raf=0,timer=0,watch=0,busy=false,lastFrame=0,busyAt=0,context='',smooth=null,lastSeen=0,mode='game',practiceDone=false,cancelInit=null;
 const gesture=new Gesture();
 const instructions='Halakan jari telunjuk kepada ikan. Rapatkan ibu jari dan jari telunjuk sehingga ikan dipilih. Kemudian, angkat tangan sedikit untuk menarik ikan. Kamu juga boleh menggunakan butang pancing.';
 function say(text){if(status.textContent!==text){status.textContent=text;$('#jm-hand-live-status').textContent=text;}}
 function phase(name,state,text){const e=$('[data-camera-phase="'+name+'"]');if(e){e.dataset.state=state;e.textContent=text;}}
 function disposeDetector(){
  if(cancelInit){const cancel=cancelInit;cancelInit=null;cancel();}
  clearTimeout(timer);cancelAnimationFrame(raf);raf=0;
  if(worker){worker.terminate();worker=null;}if(workerURL){URL.revokeObjectURL(workerURL);workerURL=null;}
  active=false;busy=false;
 }
 function detectorFailed(message){
  disposeDetector();loading=false;gesture.reset();clearTargets();cursor.hidden=true;practice.hidden=true;progress(0);drawHand(null);
  stage.classList.remove('jm-hand-active','jm-hand-training');
  phase('detector','error','3. Pengesan tangan: belum tersedia');
  $('#jm-hand-start').disabled=false;$('#jm-hand-start').textContent='Cuba pengesan tangan semula';
  $('#jm-hand-practise-again').disabled=false;$('#jm-hand-reset').hidden=true;$('#jm-hand-play').hidden=true;
  $('#jm-hand-detected').textContent='Kamera berfungsi · pengesan belum tersedia';say(message);
 }
 function clearTargets(){$$('.jm-hand-target').forEach(e=>e.classList.remove('jm-hand-target'));}
 function drawHand(points){
  const canvas=$('#jm-hand-landmarks'),ctx=canvas.getContext('2d');ctx.clearRect(0,0,canvas.width,canvas.height);
  const label=$('#jm-hand-detected');label.textContent=points?'Tangan dikesan · gerakkan jari':'Tangan belum dikesan';
  if(!points)return;
  const xy=p=>[(prefs.mirror?1-p.x:p.x)*canvas.width,p.y*canvas.height];
  ctx.strokeStyle='#fff19b';ctx.lineWidth=4;for(const chain of [[0,1,2,3,4],[0,5,6,7,8],[5,9,10,11,12],[9,13,14,15,16],[13,17,18,19,20],[0,17]]){ctx.beginPath();chain.forEach((id,i)=>{const p=xy(points[id]);i?ctx.lineTo(...p):ctx.moveTo(...p);});ctx.stroke();}
  for(let i=0;i<points.length;i++){const p=xy(points[i]);ctx.beginPath();ctx.arc(p[0],p[1],i===8||i===4?8:4,0,Math.PI*2);ctx.fillStyle=i===8?'#ffe45e':'#176ca5';ctx.fill();}
 }
 function progress(value){$('#jm-hand-progress').value=value||0;}
 function stop(message){
  token++;active=false;loading=false;clearTimeout(timer);clearInterval(watch);cancelAnimationFrame(raf);raf=0;
  if(stream){stream.getTracks().forEach(t=>t.stop());stream=null;}video.pause();video.srcObject=null;
  disposeDetector();
  busy=false;smooth=null;gesture.reset();clearTargets();cursor.hidden=true;practice.hidden=true;
  stage.classList.remove('jm-hand-active','jm-hand-training');$('#jm-hand-layout').classList.remove('jm-camera-layout');$('#jm-hand-monitor').hidden=true;drawHand(null);$('#jm-hand-camera').hidden=true;
  $('#jm-hand-start').disabled=false;$('#jm-hand-stop').hidden=true;$('#jm-hand-reset').hidden=true;$('#jm-hand-play').hidden=true;
  $('#jm-hand-start').textContent=prefs.trained?'Buka kamera · Mod Tangan':'Buka kamera · Cuba latihan';
  $('#jm-hand-practise-again').disabled=false;progress(0);if(message)say(message);
  phase('camera','idle','1. Kamera: belum dibuka');phase('video','idle','2. Paparan video: belum tersedia');phase('detector','idle','3. Pengesan tangan: belum dimulakan');
 }
 function toGame(){mode='game';practiceDone=false;practice.hidden=true;stage.classList.remove('jm-hand-training');$('#jm-hand-play').hidden=true;gesture.reset();clearTargets();say('Buka dua jari, kemudian halakan jari telunjuk kepada ikan pilihan kumpulan.');}
 function toPractice(){mode='practice';practiceDone=false;gesture.reset();clearTargets();practice.hidden=false;stage.classList.add('jm-hand-training');$('#jm-hand-play').hidden=false;$('#jm-hand-play').textContent='Langkau latihan';$('#jm-hand-practice-result').textContent='Cuba tangkap ikan latihan. Tiada markah diberikan.';say('Latihan: buka dua jari dan halakan jari telunjuk kepada ikan latihan.');}
 function paths(){
  if(global.JoranHandPaths)return global.JoranHandPaths;
  const base=new URL('hand/',document.baseURI).href;
  return{bundle:base+'vision_bundle.js',wasm:base+'wasm',model:base+'hand_landmarker.task'};
 }
 async function start(forcePractice=false){
  if(active||loading)return;if(!bridge.canUse()){say('Tunggu giliran pemancing dahulu. Mod Tangan boleh dibuka semasa giliran kamu.');return;}
  const policy=document.permissionsPolicy||document.featurePolicy;
  if(policy?.allowsFeature&&!policy.allowsFeature('camera')){phase('camera','error','1. Kamera: disekat oleh paparan ini');say('Paparan ini menyekat kamera. Muat turun fail HTML, kemudian buka fail itu terus dalam Chrome. Izin kamera tidak boleh diberikan dari pratonton ini.');return;}
  if(!global.isSecureContext||!navigator.mediaDevices?.getUserMedia){phase('camera','error','1. Kamera: paparan tidak menyokong akses');say('Kamera tidak tersedia dalam paparan ini. Muat turun fail HTML dan buka terus dalam Chrome, atau gunakan laman permainan HTTPS.');return;}
  loading=true;const current=++token;context=bridge.context();$('#jm-hand-start').disabled=true;$('#jm-hand-stop').hidden=false;$('#jm-hand-practise-again').disabled=true;
  clearInterval(watch);watch=setInterval(()=>{if((active||loading||stream)&&(!bridge.canUse()||bridge.context()!==context||document.hidden))stop('Kamera ditutup. Buka semula apabila tiba giliran memancing.');},200);
  phase('camera','waiting','1. Kamera: menunggu izin');phase('video','idle','2. Paparan video: menunggu kamera');phase('detector','idle','3. Pengesan tangan: menunggu video');
  say('Tekan Benarkan / Allow apabila Chrome meminta izin kamera.');
  try{
   // Request camera immediately on the user's click, independently of AI assets.
   if(!stream){
    const camera=await navigator.mediaDevices.getUserMedia({video:{facingMode:'user',width:{ideal:640},height:{ideal:480}},audio:false});
    if(current!==token){camera.getTracks().forEach(t=>t.stop());return;}
    stream=camera;stream.getVideoTracks().forEach(t=>t.addEventListener('ended',()=>{if(current===token||stream===camera)stop('Kamera terputus. Buka semula kamera atau gunakan butang pancing.');}));
   }
   phase('camera','ok','1. Kamera: izin diberikan');
   $('#jm-hand-monitor').hidden=false;$('#jm-hand-layout').classList.add('jm-camera-layout');$('#jm-hand-camera').hidden=false;
   video.srcObject=stream;
   video.style.transform=prefs.mirror?'scaleX(-1)':'none';
   await video.play();if(current!==token)return;
   phase('video','ok','2. Paparan video: kamera berfungsi');$('#jm-hand-detected').textContent='Kamera berfungsi · menyediakan pengesan';
   $('#jm-hand-layout').scrollIntoView({block:'start',behavior:'instant'});
  }catch(e){if(current!==token)return;
   const message=e.name==='NotAllowedError'?'Kamera tidak dibenarkan. Dalam tetapan laman Chrome, tukar Kamera kepada Benarkan / Allow. Semak juga izin kamera dalam tetapan komputer, kemudian cuba semula.':e.name==='NotFoundError'?'Kamera tidak ditemui. Sambungkan atau aktifkan kamera komputer, kemudian cuba semula.':e.name==='NotReadableError'?'Kamera tidak dapat dibuka. Tutup aplikasi lain yang menggunakan kamera, kemudian cuba semula.':'Kamera gagal dibuka. Kod: '+(e.name||'UnknownError')+'. Cuba semula dalam Chrome.';
   stop(message);phase('camera','error','1. Kamera: '+(e.name||'gagal'));return;
  }
  if(!global.Worker||!global.createImageBitmap||!global.OffscreenCanvas){detectorFailed('Kamera sudah berfungsi. Pelayar ini belum menyokong pengesan tangan. Buka fail ini dalam Chrome terkini.');return;}
  phase('detector','waiting','3. Pengesan tangan: sedang dimuatkan');say('Kamera sudah berfungsi. Pengesan tangan sedang dimuatkan. Tunggu sebentar…');
  try{
   workerURL=URL.createObjectURL(new Blob([workerCode],{type:'text/javascript'}));worker=new Worker(workerURL);
   await new Promise((resolve,reject)=>{
    cancelInit=()=>reject(new DOMException('Cancelled','AbortError'));
    timer=setTimeout(()=>reject(new Error('DetectorTimeout')),30000);
    worker.onmessage=e=>{if(e.data.type==='ready')resolve();else if(e.data.type==='error')reject(Error('DetectorLoadError'));};worker.onerror=()=>reject(Error('DetectorLoadError'));worker.postMessage({type:'init',paths:paths(),inline:global.JoranHandEmbedded||null});
   });
   if(current!==token)return;cancelInit=null;clearTimeout(timer);
   active=true;loading=false;lastFrame=0;lastSeen=0;smooth=null;busy=false;
   phase('detector','ok','3. Pengesan tangan: sedia');$('#jm-hand-reset').hidden=false;stage.classList.add('jm-hand-active');
   if(forcePractice||!prefs.trained)toPractice();else toGame();
   worker.onmessage=e=>{if(current!==token)return;if(e.data.type==='result'){busy=false;handle(e.data.landmarks,e.data.time);}else if(e.data.type==='error')detectorFailed('Kamera berfungsi, tetapi pengesan tangan terganggu. Tekan Cuba pengesan tangan semula.');};
   worker.onerror=()=>{if(current===token)detectorFailed('Kamera berfungsi, tetapi pengesan tangan terganggu. Tekan Cuba pengesan tangan semula.');};raf=requestAnimationFrame(frame);
  }catch(e){if(current!==token)return;cancelInit=null;detectorFailed('Kamera sudah berfungsi. Pengesan tangan belum dapat dimuatkan'+(e.message==='DetectorTimeout'?' dalam masa 30 saat':'')+(global.JoranHandEmbedded?'. Buka fail ini dalam Chrome terkini, kemudian tekan Cuba pengesan tangan semula.':'. Semak sambungan laman, kemudian tekan Cuba pengesan tangan semula.'));}
 }
 async function frame(now){
  if(!active)return;
  if(!bridge.canUse()||bridge.context()!==context){stop('Kamera ditutup selepas giliran memancing.');return;}
  raf=requestAnimationFrame(frame);
  if(busy){if(now-busyAt>8000)stop('Pengesanan tangan terlalu perlahan. Gunakan butang pancing atau cuba semula.');return;}
  if(now-lastFrame<80||video.readyState<2)return;
  lastFrame=now;busy=true;busyAt=now;const current=token;
  try{const bitmap=await createImageBitmap(video);if(!active||current!==token){bitmap.close();return;}worker.postMessage({type:'frame',bitmap,time:now},[bitmap]);}catch{if(current===token)stop('Imej kamera belum dapat dibaca. Gunakan butang pancing.');}
 }
 function handle(points,now){
  if(!active||!bridge.canUse())return;
  if(!points||points.length<21||!points.every(p=>Number.isFinite(p.x)&&Number.isFinite(p.y))){
   drawHand(null);gesture.feed(null,now);clearTargets();cursor.hidden=true;progress(0);smooth=null;
   if(!lastSeen||now-lastSeen>700)say('Angkat satu tangan ke aras kamera. Pastikan seluruh tangan kelihatan dalam kotak kamera dan cahaya mencukupi.');return;
  }
  lastSeen=now;drawHand(points);
  const tip=points[8],x=clamp(((prefs.mirror?1-tip.x:tip.x)-.12)/.76),y=clamp((tip.y-.1)/.78);
  smooth=smooth?{x:smooth.x*.55+x*.45,y:smooth.y*.55+y*.45}:{x,y};
  const rect=stage.getBoundingClientRect(),water=rect.height*.42,px=smooth.x*rect.width,py=water+smooth.y*(rect.height-water-12);
  cursor.hidden=false;cursor.style.left=px+'px';cursor.style.top=py+'px';
  if(practiceDone)return;
  const targets=mode==='practice'?[$('#jm-hand-practice-fish')]:$$('.jm-fish');let target=-1,best=Infinity;
  targets.forEach((el,i)=>{const r=el.getBoundingClientRect(),pad=prefs.easy?24:10,cx=rect.left+px,cy=rect.top+py;if(cx>=r.left-pad&&cx<=r.right+pad&&cy>=r.top-pad&&cy<=r.bottom+pad){const d=Math.hypot(cx-(r.left+r.width/2),cy-(r.top+r.height/2));if(d<best){target=i;best=d;}}});
  clearTargets();if(target>=0)targets[target].classList.add('jm-hand-target');
  const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y),palmWidth=Math.max(.035,distance(points[5],points[17]));
  const result=gesture.feed({target,ratio:distance(points[4],points[8])/palmWidth,palm:(points[0].y+points[5].y+points[9].y+points[17].y)/4},now,prefs.easy?400:550,prefs.easy?.09:.14);
  progress(result.progress);cursor.dataset.gesture=result.state;
  if(result.state==='open')say('Buka ibu jari dan jari telunjuk dahulu.');
  if(result.state==='aim')say(target>=0?'Ikan sudah disasarkan. Rapatkan ibu jari dan jari telunjuk.':'Gerakkan tangan supaya sasaran kecil berada pada ikan pilihan kamu.');
  if(result.state==='pinch')say('Bagus. Kekalkan dua jari yang dirapatkan seketika…');
  if(result.state==='selected'){
   if(mode==='game')bridge.choose(result.index);
   say('Ikan dipilih. Sekarang angkat tangan sedikit untuk menariknya.');
  }
  if(result.state==='lift')say('Angkat tangan sedikit. Jika mahu memilih semula, tekan Pilih semula.');
  if(result.state==='caught'){
   clearTargets();progress(1);
   if(mode==='practice'){practiceDone=true;prefs.trained=true;save();$('#jm-hand-practice-result').textContent='Tahniah! Kamu sudah berjaya menangkap ikan latihan.';$('#jm-hand-play').textContent='Mula memancing';say('Latihan berjaya! Tekan Mula memancing untuk memilih jawapan kumpulan.');bridge.reward?.();}
   else if(bridge.canUse()&&bridge.selection()===result.index){bridge.cast();stop('Ikan sedang dipancing. Kamera sudah ditutup.');}
   else{gesture.reset();say('Pilihan berubah. Buka dua jari dan pilih semula ikan.');}
  }
 }
 $('#jm-hand-open').onclick=()=>{panel.hidden=!panel.hidden;$('#jm-hand-open').setAttribute('aria-expanded',String(!panel.hidden));if(!panel.hidden)status.focus({preventScroll:true});else stop('Mod Tangan ditutup. Butang pancing boleh digunakan.');};
 $('#jm-hand-quick-stop').onclick=()=>stop('Kamera ditutup. Kamu boleh menggunakan butang pancing.');
 $('#jm-hand-start').onclick=()=>start(false);$('#jm-hand-stop').onclick=()=>stop('Kamera ditutup. Kamu boleh menggunakan butang pancing.');
 $('#jm-hand-practise-again').onclick=()=>start(true);$('#jm-hand-play').onclick=toGame;
 $('#jm-hand-reset').onclick=()=>{gesture.reset();smooth=null;clearTargets();progress(0);if(mode==='game')bridge.clearSelection();else{practiceDone=false;$('#jm-hand-practice-result').textContent='Cuba tangkap ikan latihan. Tiada markah diberikan.';}say('Buka dua jari dan pilih ikan semula.');};
 $('#jm-hand-hear').onclick=()=>bridge.speak(instructions);
 $('#jm-hand-easy').checked=prefs.easy;$('#jm-hand-easy').onchange=e=>{prefs.easy=e.target.checked;save();gesture.reset();};
 $('#jm-hand-mirror').checked=prefs.mirror;$('#jm-hand-mirror').onchange=e=>{prefs.mirror=e.target.checked;save();video.style.transform=prefs.mirror?'scaleX(-1)':'none';gesture.reset();smooth=null;};
 document.addEventListener('visibilitychange',()=>{if(document.hidden&&(active||loading||stream))stop('Kamera ditutup apabila tab ditinggalkan.');});
 global.addEventListener('pagehide',()=>stop());
 const manual=()=>{if(active||loading||stream)stop('Kawalan biasa dipilih. Kamera sudah ditutup.');};
 $('#jm-fishes').addEventListener('pointerdown',manual,true);$('#jm-fishes').addEventListener('keydown',e=>{if(['Enter',' '].includes(e.key))manual();},true);
 $('#jm-cast').addEventListener('click',()=>{if(active||loading||stream)stop('Ikan sedang dipancing. Kamera sudah ditutup.');});
 stop();
 return{stop};
}
global.JoranHand={mount,Gesture};
if(typeof module!=='undefined')module.exports={Gesture};
})(typeof window!=='undefined'?window:globalThis);
