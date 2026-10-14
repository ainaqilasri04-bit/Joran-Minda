(function(g){
 'use strict';
 let promise;
 const open=()=>promise||(promise=new Promise((resolve,reject)=>{const request=indexedDB.open('joran-minda-bacaan-murid-v26',1);request.onupgradeneeded=()=>request.result.createObjectStore('takes',{keyPath:'id'});request.onsuccess=()=>resolve(request.result);request.onerror=()=>{promise=null;reject(request.error);};}));
 async function all(){const db=await open();return new Promise((resolve,reject)=>{const r=db.transaction('takes').objectStore('takes').getAll();r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});}
 async function put(record){const db=await open();await new Promise((resolve,reject)=>{const tx=db.transaction('takes','readwrite');tx.objectStore('takes').put(record);tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error);});const check=await get(record.id);if(check?.audio!==record.audio)throw Error('Rakaman belum dapat disahkan dalam simpanan.');return check;}
 async function get(id){const db=await open();return new Promise((resolve,reject)=>{const r=db.transaction('takes').objectStore('takes').get(id);r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});}
 async function removeMembers(ids){const db=await open(),rows=await all();return new Promise((resolve,reject)=>{const tx=db.transaction('takes','readwrite');for(const r of rows)if(ids.includes(r.memberId))tx.objectStore('takes').delete(r.id);tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error);});}
 const asData=blob=>new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(r.result);r.onerror=()=>reject(r.error);r.readAsDataURL(blob);});
 let active=null;
 async function start(onState,onSaved){
  if(active)throw Error('Hentikan rakaman semasa dahulu.');
  if(!navigator.mediaDevices?.getUserMedia||!g.MediaRecorder)throw Error('Mikrofon belum tersedia. Buka fail ini dalam Chrome atau gunakan laman HTTPS.');
  const state={stream:null,recorder:null,chunks:[],started:Date.now(),timer:null};active=state;onState('Memohon akses mikrofon…');
  try{
   state.stream=await navigator.mediaDevices.getUserMedia({audio:true});
   const mime=['audio/webm;codecs=opus','audio/mp4','audio/ogg;codecs=opus'].find(t=>MediaRecorder.isTypeSupported(t));
   state.recorder=new MediaRecorder(state.stream,mime?{mimeType:mime,audioBitsPerSecond:48000}:undefined);state.started=Date.now();
   state.recorder.ondataavailable=e=>{if(e.data.size)state.chunks.push(e.data);};
   state.recorder.onerror=()=>{state.failed=true;onState('Rakaman terganggu. Cuba rakam semula.');stop();};
   state.recorder.onstop=async()=>{
    clearTimeout(state.timer);state.stream.getTracks().forEach(t=>t.stop());
    try{if(state.failed)return;const blob=new Blob(state.chunks,{type:state.recorder.mimeType||'audio/webm'});if(!blob.size)throw Error('Rakaman kosong. Cuba semula.');if(blob.size>2500000)throw Error('Rakaman terlalu besar. Rakam satu halaman sahaja.');onState('Menyimpan rakaman…');await onSaved({audio:await asData(blob),duration:Math.round((Date.now()-state.started)/1000),mime:blob.type});}
    catch(e){onState('Belum disimpan: '+e.message);}finally{active=null;onState(null);}
   };
   state.recorder.start(250);state.timer=setTimeout(stop,120000);onState('Sedang merakam. Baca dengan jelas, kemudian tekan Henti dan simpan.');
  }catch(e){state.stream?.getTracks().forEach(t=>t.stop());active=null;onState(null);throw e;}
 }
 function stop(){if(active?.recorder?.state==='recording')active.recorder.stop();}
 g.JoranPupilAudio={all,put,get,removeMembers,start,stop,busy:()=>!!active};
})(globalThis);
