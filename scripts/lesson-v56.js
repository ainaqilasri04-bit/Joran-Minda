// V56: export the latest readings without duplicating identical installed AI audio.
let exportBusy56=false;
async function installedDuplicate56(row){
 if(!row.slot.startsWith('speech:'))return false;
 const expected=window.JoranPackagedHashes56?.[normalizeVoice(row.text)];
 if(!expected||!window.crypto?.subtle)return false; // Preserve the recording if verification is unavailable.
 try{
  const binary=atob(row.url.slice(row.url.indexOf(',')+1)),bytes=new Uint8Array(binary.length);
  for(let i=0;i<binary.length;i++)bytes[i]=binary.charCodeAt(i);
  const digest=await window.crypto.subtle.digest('SHA-256',bytes);
  return [...new Uint8Array(digest)].map(n=>n.toString(16).padStart(2,'0')).join('')===expected;
 }catch{return false;}
}
const exportBefore56=exportVoicePack33;
exportVoicePack33=async function(website){
 if(exportBusy56||deletionBusy53||pendingAudioWrites||micState!=='idle'){voiceNotice('Tunggu sehingga rakaman selesai disimpan.');return;}
 if(!website)return exportBefore56(false);
 const status=$('#jm-pack-status33'),button=$('#jm-export-voices33'),backup=$('#jm-backup-voices33');
 exportBusy56=true;button.disabled=true;backup.disabled=true;status.textContent='Sedang menyediakan fail suara…';
 try{
  const restored=await restoreAudio();if(!restored)throw Error('Simpanan suara belum dapat dibaca. Cuba semula sebelum mengeksport.');
  const candidates=voiceRows33(false),rows=[];let duplicates=0;
  if(!candidates.length){status.textContent='Belum ada rakaman Guru untuk dimuat turun.';return;}
  for(const row of candidates){if(await installedDuplicate56(row))duplicates++;else rows.push(row);}
  const data={version:1,recordings:rows};
  const text='window.JoranTeacherVoicePack='+JSON.stringify(data).replace(/</g,'\\u003c')+';\n';
  const blob=new Blob([text],{type:'text/javascript'});
  if(blob.size>24*1024*1024){
   // Never discard a custom recording or require the teacher to record it again.
   downloadBlob(new Blob([JSON.stringify({version:1,format:'joran-minda-semua-suara',recordings:voiceRows33(true)})],{type:'application/json'}),'sandaran-semua-suara-joran-minda.json');
   status.textContent='Fail suara masih besar. Sandaran semua suara telah dimuat turun secara automatik. Hantarkan fail sandaran itu untuk dimasukkan ke dalam projek. Semua rakaman dikekalkan.';return;
  }
  downloadBlob(blob,'suara-joran-minda.js');
  status.textContent='Fail suara dimuat turun ('+(blob.size/1024/1024).toFixed(1)+' MB). '+rows.filter(r=>currentPageText53(r.slot)!==null).length+' bacaan Guru disertakan. '+(duplicates?duplicates+' salinan audio arahan yang sama tidak diulang kerana sudah tersedia dalam projek. ':'')+'Gantikan public/suara-joran-minda.js dalam projek terkini, kemudian kemas kini Netlify.';
 }catch(error){status.textContent='Fail belum dimuat turun. '+(error.message||'Cuba semula atau gunakan Sandaran semua suara Guru.');}
 finally{exportBusy56=false;button.disabled=false;backup.disabled=false;renderTakeTools53();}
};
const exportHelp56=document.createElement('p');exportHelp56.id='jm-export-help56';
exportHelp56.textContent='Eksport memilih bacaan terkini yang sepadan. Audio arahan yang sama sudah tersedia dalam projek dan tidak disalin dua kali. Rakaman tambahan atau yang berbeza tetap disertakan. Sandaran semua suara menyimpan salinan penuh.';
$('#jm-pack-status33').before(exportHelp56);
renderSummary33();
root.dataset.version='56';$('#jm-version').textContent='Joran Minda · Versi 56 · Suara lengkap dan eksport lebih kecil';queue27();
