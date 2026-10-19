// V48: download the edited book on the sharing page; status is written only.
for(const text of [G46.texts.sent,G46.texts.noGallery])voiceCatalog33.delete(normalizeVoice(text));
const oldOutcome48=S42.outcomes;
S42.outcomes='Lihat pencapaian Objektif 1 dan Objektif 2. Kemudian, tekan Baca cerita rakan di Linktree.';
voiceCatalog33.delete(normalizeVoice(oldOutcome48));
voiceCatalog33.set(normalizeVoice(S42.outcomes),{text:S42.outcomes,category:'Perkongsian buku',story:''});
window.JoranRequiredAudio41=[...new Set(window.JoranRequiredAudio41.filter(t=>t!==oldOutcome48).concat(S42.outcomes))];renderSummary33();
const linktreeCache48=new Map();
function validLinktree48(value){try{const u=new URL(value);return u.protocol==='https:'&&u.hostname==='linktr.ee'&&u.pathname!=='/'&&!u.username&&!u.password?u.href:'';}catch{return '';}}
function cacheLinktree48(id,value){linktreeCache48.set(id,validLinktree48(value));}
async function downloadSharedBook48(state){
 if(state.pdfBusy||state.busy||!reviewedBook47())return;
 const button=$('#jm-download-pdf48'),status=$('#jm-pdf-status48');
 state.pdfBusy=true;button.disabled=true;button.textContent='Menyediakan PDF…';status.textContent='Tunggu sebentar. Buku kamu sedang disediakan.';queue27();
 try{
  const result=await exportBook();
  if(status.isConnected)status.textContent=result?.ok?'PDF siap. Semak senarai muat turun pelayar.':$('#jm-publish-status').textContent||'PDF belum dapat disediakan. Cuba lagi.';
 }catch(e){if(status.isConnected)status.textContent=e.message||'PDF belum dapat disediakan. Cuba lagi.';}
 finally{state.pdfBusy=false;if(button.isConnected){button.disabled=false;button.textContent='Muat turun buku (PDF)';}queue27();}
}
const extraBefore48=renderExtra27;
renderExtra27=function(){
 extraBefore48();if(aux27!=='outcomes')return;
 const gallery=G46.selected?.id||config46()?.id,local=galleries46.find(g=>g.id===gallery);
 let url=validLinktree48(local?.linktree)||linktreeCache48.get(gallery)||'';
 nav27('Objektif dan kriteria kejayaan','Pencapaian akhir','Baca cerita rakan di Linktree ↗',()=>{if(!url)return;persistSession23();window.open(url,'_blank','noopener,noreferrer');},{disabled:!url,status:url?'Pilih buku rakan dalam galeri di Linktree.':gallery?'Menyemak pautan Linktree…':'Pautan Linktree belum disediakan oleh Guru.',back:()=>{aux27='certificate';queue27();}});
 if(!gallery||url)return;
 const button=$('#jm-next27'),isCurrent=()=>aux27==='outcomes'&&gallery===(G46.selected?.id||config46()?.id);
 G46.api({action:'info',gallery}).then(info=>{if(!isCurrent())return;url=validLinktree48(info.gallery.linktree);cacheLinktree48(gallery,url);button.disabled=!url;$('#jm-status27').textContent=url?'Pilih buku rakan dalam galeri di Linktree.':'Pautan Linktree belum disediakan oleh Guru.';}).catch(()=>{if(isCurrent())$('#jm-status27').textContent='Pautan Linktree belum dapat dibuka. Minta bantuan Guru.';});
};
root.dataset.version='48';$('#jm-version').textContent='Joran Minda · Versi 48 · Simpan PDF dan kongsi buku';queue27();
