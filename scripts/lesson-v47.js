// V47: a dedicated book upload page, between editing/review and reflection.
const shareVisits47=new Map();
function reviewedBook47(){const a=profile&&progress23(who24())?.achievement;return !!a&&[0,1,2,3,4].every(p=>a.reviewPages.includes(p));}
shareReady46=reviewedBook47;
function shareIdentity47(){const mode=isSolo()?'individu':'kumpulan',owner=mode==='individu'?profile.id:(roomSession?.code||profile.sessionId||teamMembers.map(m=>m.id).sort().join('-'));return {mode,owner,key:'jm-gallery-submit46:'+(G46.selected?.id||'none')+':'+owner+':'+storyKey};}
function shareScreen47(){
 const b=finalBook31(),selected=G46.selected,identity=shareIdentity47(),fingerprint=JSON.stringify([b.title,b.pageTitles,b.pages]);
 const renderKey=identity.key+':'+fingerprint;
 if(closing27.dataset.shareKey47!==renderKey||!$('#jm-upload-page47')){
  closing27.dataset.shareKey47=renderKey;
  let state=shareVisits47.get(identity.key);if(!state){state={name:identity.mode==='individu'?profile.name:(bookState().group||'Kumpulan '+(teamMembers[0]?.name||'Joran Minda')),busy:false,receipt:G46.load('jm-gallery-receipt47:'+identity.key,null)};shareVisits47.set(identity.key,state);}
  const receipt=state.receipt,uploaded=receipt?.fingerprint===fingerprint;
  closing27.innerHTML='<div id="jm-upload-page47" class="jm-upload-page47"><figure><img src="'+safe(assets[storyKey+'-cover'])+'" alt="Kulit buku cerita '+safe(b.title)+'"><figcaption><strong>'+safe(b.title)+'</strong><span>✓ Lima halaman sudah disemak</span><span>Buku '+(identity.mode==='individu'?'individu':'kumpulan')+'</span></figcaption></figure><form id="jm-upload-form47"><label>Nama paparan<input id="jm-upload-name47" class="jm-input" maxlength="80" required value="'+safe(state.name)+'"></label><div class="jm-pdf-actions48"><button type="button" id="jm-download-pdf48" class="jm-primary">Muat turun buku (PDF)</button><p id="jm-pdf-status48" role="status">Simpan salinan buku pada peranti kamu.</p></div><p id="jm-upload-destination47"></p><button type="submit" id="jm-upload-submit47" class="jm-primary" disabled>'+(uploaded?'Hantar semula buku':'Muat naik buku cerita')+'</button><p id="jm-upload-status47" role="status"></p><div id="jm-upload-shared47" hidden><label>Pautan buku untuk ibu bapa dan rakan<input id="jm-upload-url47" class="jm-input" readonly></label><div class="jm-gallery-actions46"><button type="button" id="jm-upload-copy47" class="jm-primary">Salin pautan buku</button><a id="jm-upload-linktree47" class="jm-secondary" target="_blank" rel="noopener noreferrer" hidden>Buka Linktree</a></div><p>Buku boleh dibaca selepas diluluskan oleh Guru.</p></div><p id="jm-upload-linktree-note47"></p></form></div>';
  const page=$('#jm-upload-page47'),form=$('#jm-upload-form47'),name=$('#jm-upload-name47'),submit=$('#jm-upload-submit47'),status=$('#jm-upload-status47'),shared=$('#jm-upload-shared47'),url=$('#jm-upload-url47'),linktree=$('#jm-upload-linktree47');
  const active=()=>page.isConnected&&closing27.dataset.shareKey47===renderKey;
  $('#jm-download-pdf48').onclick=()=>downloadSharedBook48(state);
  const showReceipt=()=>{if(!state.receipt)return;url.value=G46.link('galeri.html',{galeri:selected.id,buku:state.receipt.id});shared.hidden=false;};
  name.oninput=()=>{state.name=name.value;};
  $('#jm-upload-copy47').onclick=async()=>{try{await navigator.clipboard.writeText(url.value);status.textContent='Pautan buku disalin.';}catch{url.focus();url.select();status.textContent='Pautan dipilih. Tekan Ctrl+C untuk menyalin.';}};
  if(uploaded){showReceipt();status.textContent=G46.texts.sent;}
  else if(receipt)status.textContent='Buku sudah diubah. Hantar semula versi terkini sebelum berkongsi pautannya.';
  if(!selected){status.textContent=G46.texts.noGallery;}
  else G46.api({action:'info',gallery:selected.id},selected.uploadKey).then(info=>{
   if(!active())return;if(!info.canUpload)throw Error(G46.texts.noGallery);
   $('#jm-upload-destination47').textContent='Galeri: '+info.gallery.title;submit.disabled=false;
   cacheLinktree48(selected.id,info.gallery.linktree);if(info.gallery.linktree){linktree.href=info.gallery.linktree;linktree.hidden=false;}else $('#jm-upload-linktree-note47').textContent='Guru boleh meletakkan pautan galeri ini dalam Linktree.';
  }).catch(e=>{if(active()){status.textContent=e.message;}});
  form.onsubmit=async e=>{
   e.preventDefault();if(state.busy||state.pdfBusy||submit.disabled||!reviewedBook47()||!name.value.trim()||!selected)return;
   state.busy=true;name.disabled=true;submit.disabled=true;status.textContent='Sedang menghantar buku…';queue27();
   try{
    let submission=G46.load(identity.key,null);if(!G46.validId(submission)){submission=G46.randomId();G46.save(identity.key,submission);}
    const current=finalBook31();await G46.api({action:'submit',gallery:selected.id,submission,mode:identity.mode,story:storyKey,title:current.title,pages:current.pages,pageTitles:current.pageTitles,displayName:name.value.trim()},selected.uploadKey);
    state.receipt={id:submission,fingerprint:JSON.stringify([current.title,current.pageTitles,current.pages])};try{G46.save('jm-gallery-receipt47:'+identity.key,state.receipt);}catch{}
    if(active()){showReceipt();status.textContent=G46.texts.sent;submit.textContent='Hantar semula buku';}
   }catch(e){if(active()){status.textContent=e.message;}}
   finally{state.busy=false;if(active()){name.disabled=false;submit.disabled=false;queue27();}}
  };
 }
 const busy=shareVisits47.get(identity.key)?.busy||shareVisits47.get(identity.key)?.pdfBusy;
 nav27('Kongsi Buku Cerita','Penutup · Langkah 2 / 3','Seterusnya: Refleksi →',()=>{closeStage27='reflection';queue27();},{disabled:!!busy,status:busy?'Tunggu sehingga penghantaran selesai.':'Selepas ini: refleksi pembelajaran.',back:()=>{if(busy)return;bookPage=4;closeStage27='review';queue27();}});
 $('#jm-back27').disabled=!!busy;
}
openShare46=async function(){if(!reviewedBook47())return;stopVoice();aux27='';closeStage27='share';showView('book');queue27();};
const directionBefore47=shortDirection35;
shortDirection35=function(){if(view==='book'&&!aux27&&closeStage27==='share')return{icon:'book',text:G46.texts.instruction};return directionBefore47();};
const bookBefore47=bookScreen27;
bookScreen27=function(){
 bookBefore47();
 if(closeStage27!=='share')delete closing27.dataset.shareKey47;
};
root.dataset.version='47';$('#jm-version').textContent='Joran Minda · Versi 47 · Kongsi buku sebelum refleksi';queue27();
