// V46: audio controls precede answers, undistorted panorama, book sharing.
function raiseAudio46(){
 for(const options of root.querySelectorAll('.jm-ni-options,.jm-evidence-options35,.jm-practice-options37')){
  const pair=options.querySelector(':scope > .jm-audio-pair37');if(pair&&options.firstElementChild!==pair)options.prepend(pair);pair?.classList.add('jm-audio-above46');
 }
 for(const parent of root.querySelectorAll('#jm-pdp-practice,[data-pdp-explain]')){
  const pair=parent.querySelector(':scope > .jm-audio-pair37'),choices=parent.querySelector(':scope > .jm-picture-choices38,:scope > .jm-proof-cards39,:scope > .jm-matching39,:scope > .jm-review39');
  if(pair&&choices&&choices.previousElementSibling!==pair)choices.before(pair);pair?.classList.add('jm-audio-above46');
 }
 const notes=$('.jm-note-audio37'),cards=$('#jm-choice-cards');if(notes&&cards&&cards.previousElementSibling!==notes)cards.before(notes);notes?.classList.add('jm-audio-above46');
}
const paintBefore46=paint27;paint27=function(){paintBefore46();raiseAudio46();};
const G46=window.JoranGallery46;
for(const text of Object.values(G46.texts))voiceCatalog33.set(normalizeVoice(text),{text,category:'Perkongsian buku',story:''});
$('#jm-audio-category33').add(new Option('Perkongsian buku','Perkongsian buku'));
renderSummary33();
const teacherGallery46=document.createElement('details');teacherGallery46.className='jm-gallery-tools46';teacherGallery46.id='jm-gallery-tools46';
teacherGallery46.innerHTML='<summary>Galeri hasil kerja dan Linktree</summary><p>Murid menghantar buku daripada permainan. Selepas disemak, Guru boleh memaparkannya kepada ibu bapa dan rakan.</p><label>Galeri saya<select id="jm-gallery-select46" class="jm-input"><option value="">Cipta galeri baharu</option></select></label><form id="jm-gallery-form46"><label>Nama galeri<input id="jm-gallery-name46" class="jm-input" maxlength="80" value="Galeri Buku Joran Minda" required></label><label>Pautan Linktree (pilihan)<input id="jm-gallery-linktree46" class="jm-input" type="url" placeholder="https://linktr.ee/namaanda"></label><button class="jm-primary" type="submit" id="jm-gallery-save46">Cipta galeri</button></form><p id="jm-gallery-status46" role="status"></p><div id="jm-gallery-links46" hidden><label>Pautan permainan untuk murid<input id="jm-gallery-student-url46" class="jm-input" readonly></label><p>Murid membuka pautan ini untuk bermain dan menghantar buku. Tidak perlu menaip kod galeri.</p><label>Pautan galeri untuk ibu bapa<input id="jm-gallery-parent-url46" class="jm-input" readonly></label><p>Dalam Linktree, pilih <b>+ Add</b>, tampal pautan galeri dan namakan <b>Galeri Buku Murid</b>.</p><div class="jm-gallery-actions46"><button type="button" class="jm-secondary" id="jm-gallery-copy46">Salin pautan galeri</button><button type="button" class="jm-secondary" id="jm-gallery-refresh46">Semak penghantaran</button><button type="button" class="jm-secondary" id="jm-gallery-backup46">Simpan akses Guru</button></div></div><label>Pulihkan akses Guru<input id="jm-gallery-restore46" type="file" accept="application/json,.json"></label><div id="jm-gallery-list46" class="jm-gallery-list46"></div>';
$('[data-panel=teacher]').append(teacherGallery46);
let galleries46=G46.load('jm-gallery-teacher46',[]),selectedGallery46=galleries46[0]?.id||'';
const config46=()=>galleries46.find(g=>g.id===selectedGallery46);
function saveGalleries46(){G46.save('jm-gallery-teacher46',galleries46);}
function teacherConfig46(){
 const picker=$('#jm-gallery-select46');picker.innerHTML='<option value="">Cipta galeri baharu</option>'+galleries46.map(g=>'<option value="'+safe(g.id)+'">'+safe(g.title)+'</option>').join('');picker.value=selectedGallery46;
 const config=config46();$('#jm-gallery-links46').hidden=!config;$('#jm-gallery-save46').textContent=config?'Simpan tetapan':'Cipta galeri';$('#jm-gallery-name46').value=config?.title||'Galeri Buku Joran Minda';$('#jm-gallery-linktree46').value=config?.linktree||'';
 if(config){$('#jm-gallery-student-url46').value=G46.pupilURL(config);$('#jm-gallery-parent-url46').value=G46.parentURL(config.id);G46.selected={id:config.id,uploadKey:config.uploadKey};}
 $('#jm-gallery-list46').replaceChildren();
}
teacherConfig46();
$('#jm-gallery-select46').onchange=()=>{selectedGallery46=$('#jm-gallery-select46').value;teacherConfig46();};
$('#jm-gallery-form46').onsubmit=async e=>{
 e.preventDefault();const button=$('#jm-gallery-save46'),status=$('#jm-gallery-status46'),config=config46();button.disabled=true;status.textContent='Menyimpan galeri…';
 try{const body={action:config?'settings':'create',gallery:config?.id,title:$('#jm-gallery-name46').value.trim(),linktree:$('#jm-gallery-linktree46').value.trim()};const r=await G46.api(body,config?.adminKey);
  const updated={...config,...r.gallery,adminKey:r.adminKey||config?.adminKey,uploadKey:r.uploadKey||config?.uploadKey};galleries46=galleries46.filter(g=>g.id!==updated.id);galleries46.unshift(updated);selectedGallery46=updated.id;saveGalleries46();teacherConfig46();status.textContent='Galeri sedia. Kongsi pautan permainan kepada murid dan letakkan pautan galeri dalam Linktree.';
 }catch(e){status.textContent=e.message;}finally{button.disabled=false;}
};
$('#jm-gallery-copy46').onclick=async()=>{const input=$('#jm-gallery-parent-url46');try{await navigator.clipboard.writeText(input.value);$('#jm-gallery-status46').textContent='Pautan galeri disalin. Tampal pautan ini dalam Linktree.';}catch{input.focus();input.select();$('#jm-gallery-status46').textContent='Pautan dipilih. Tekan Ctrl+C untuk menyalin.';}};
$('#jm-gallery-backup46').onclick=()=>{const c=config46();if(c)downloadBlob(new Blob([JSON.stringify({format:'joran-gallery-access46',...c},null,2)],{type:'application/json'}),'akses-guru-galeri-joran-minda.json');};
$('#jm-gallery-restore46').onchange=async e=>{const file=e.target.files[0];e.target.value='';if(!file)return;try{if(file.size>5000)throw Error('Pilih fail akses Guru yang betul.');const c=JSON.parse(await file.text());if(c.format!=='joran-gallery-access46'||!G46.validId(c.id)||!G46.validKey(c.adminKey)||!G46.validKey(c.uploadKey))throw Error('Fail akses Guru tidak sah.');const r=await G46.api({action:'review',gallery:c.id},c.adminKey);galleries46=galleries46.filter(g=>g.id!==c.id);galleries46.unshift({...c,...r.gallery});selectedGallery46=c.id;saveGalleries46();teacherConfig46();$('#jm-gallery-status46').textContent='Akses Guru dipulihkan.';await reviewGallery46();}catch(e){$('#jm-gallery-status46').textContent=e.message;}};
async function reviewGallery46(){
 const c=config46();if(!c)return;const list=$('#jm-gallery-list46'),status=$('#jm-gallery-status46');status.textContent='Memuatkan hasil murid…';
 try{const r=await G46.api({action:'review',gallery:c.id},c.adminKey);if(config46()?.id!==c.id)return;
  list.innerHTML=r.books.map(b=>'<article data-gallery-book46="'+safe(b.id)+'"><h3>'+safe(b.title)+'</h3><p><b>'+safe(b.displayName)+'</b> · '+(b.mode==='kumpulan'?'Kumpulan':'Individu')+'</p><p>'+(b.status==='published'?'✓ Dipaparkan kepada ibu bapa':'Menunggu semakan')+'</p><details><summary>Semak lima halaman</summary>'+b.pages.map((t,i)=>'<section><h4>'+safe(b.pageTitles[i])+'</h4><img style="width:100%;max-width:350px;height:auto" loading="lazy" src="assets/'+safe(b.story)+'-'+(i+1)+'.webp" alt="Halaman '+(i+1)+'"><p>'+safe(t)+'</p></section>').join('')+'</details><div class="jm-gallery-actions46"><button type="button" class="jm-primary" data-gallery-action46="'+(b.status==='published'?'unpublish':'publish')+'">'+(b.status==='published'?'Sembunyikan daripada galeri':'Luluskan dan paparkan')+'</button><button type="button" class="jm-delete46" data-gallery-action46="delete">Padam buku</button></div></article>').join('');
  list.querySelectorAll('[data-gallery-action46]').forEach(button=>button.onclick=async()=>{const article=button.closest('[data-gallery-book46]'),b=r.books.find(x=>x.id===article.dataset.galleryBook46),action=button.dataset.galleryAction46;if(action==='delete'&&!confirm('Padam buku '+b.title+' daripada galeri?'))return;button.disabled=true;try{await G46.api({action,gallery:c.id,book:b.id,revision:b.revision},c.adminKey);await reviewGallery46();}catch(e){status.textContent=e.message;button.disabled=false;}});
  status.textContent=r.books.length?r.books.length+' buku · '+r.books.filter(b=>b.status==='pending').length+' menunggu semakan.':'Belum ada buku dihantar.';
 }catch(e){status.textContent=e.message;}
}
$('#jm-gallery-refresh46').onclick=reviewGallery46;
const shareDialog46=document.createElement('dialog');shareDialog46.id='jm-share-dialog46';root.append(shareDialog46);let shareBusy46=false;
shareDialog46.addEventListener('cancel',e=>{if(shareBusy46)e.preventDefault();else stopVoice();});shareDialog46.addEventListener('close',()=>stopVoice());
function shareReady46(){return !!profile&&!!progress23(who24())?.certificateEligible;}
async function openShare46(){
 if(!shareReady46())return;stopVoice();const b=finalBook31(),selected=G46.selected,mode=isSolo()?'individu':'kumpulan';
 const name=mode==='individu'?profile.name:'Kumpulan '+(teamMembers[0]?.name||'Joran Minda');
 shareDialog46.innerHTML='<form class="jm-share-form46"><h2>Kongsi buku '+(mode==='individu'?'saya':'kumpulan')+'</h2><p id="jm-share-instruction46">'+safe(G46.texts.instruction)+'</p><div class="jm-share-summary46"><img src="'+safe(assets[storyKey+'-cover'])+'" alt="Kulit buku"><div><strong>'+safe(b.title)+'</strong><p>1 kulit hadapan dan 5 halaman cerita</p></div></div><label>Nama paparan dalam galeri<input class="jm-input" name="displayName" maxlength="80" required value="'+safe(name)+'"></label><p id="jm-share-target46"></p><p>Yang dikongsi: tajuk, nama paparan, ayat dan gambar buku.</p><div class="jm-gallery-actions46"><button type="button" class="jm-secondary" id="jm-share-close46">Kembali</button><button type="submit" class="jm-primary" id="jm-share-submit46" disabled>Muat naik buku</button></div><p id="jm-share-status46" role="status"></p><a id="jm-share-parent46" hidden target="_blank" rel="noopener noreferrer">Lihat galeri ibu bapa</a><a id="jm-share-linktree46" hidden target="_blank" rel="noopener noreferrer">Buka Linktree</a></form>';
 const instructions=$('#jm-share-instruction46'),pair=audioPair37(instructions.parentElement,'Dengar arahan',()=>speakMalay(G46.texts.instruction,$('#jm-share-status46')));instructions.after(pair);
 $('#jm-share-close46').onclick=()=>{if(!shareBusy46)shareDialog46.close();};shareDialog46.showModal();
 const status=$('#jm-share-status46'),submit=$('#jm-share-submit46');
 const responsePair=audioPair37(status.parentElement,'Dengar maklum balas',()=>speakMalay(status.textContent));status.after(responsePair);responsePair.hidden=true;
 if(!selected){status.textContent=G46.texts.noGallery;responsePair.hidden=false;return;}
 try{const info=await G46.api({action:'info',gallery:selected.id},selected.uploadKey);if(!info.canUpload)throw Error(G46.texts.noGallery);$('#jm-share-target46').textContent='Galeri: '+info.gallery.title;submit.disabled=false;
  const parent=$('#jm-share-parent46');parent.href=G46.parentURL(selected.id);parent.hidden=false;
  if(info.gallery.linktree){$('#jm-share-linktree46').href=info.gallery.linktree;$('#jm-share-linktree46').hidden=false;}
 }catch(e){status.textContent=e.message;}
 shareDialog46.querySelector('form').onsubmit=async e=>{
  e.preventDefault();if(shareBusy46||submit.disabled||!shareReady46())return;
  shareBusy46=true;submit.disabled=true;$('#jm-share-close46').disabled=true;status.textContent='Sedang menghantar buku…';
  try{const owner=mode==='individu'?profile.id:(roomSession?.code||profile.sessionId||teamMembers.map(m=>m.id).sort().join('-'));const key='jm-gallery-submit46:'+selected.id+':'+owner+':'+storyKey;let submission=G46.load(key,null);if(!G46.validId(submission)){submission=G46.randomId();G46.save(key,submission);}
   const current=finalBook31();await G46.api({action:'submit',gallery:selected.id,submission,mode,story:storyKey,title:current.title,pages:current.pages,pageTitles:current.pageTitles,displayName:shareDialog46.querySelector('[name=displayName]').value.trim()},selected.uploadKey);
   status.textContent=G46.texts.sent;responsePair.hidden=false;submit.textContent='Hantar semula versi terkini';
  }catch(e){status.textContent=e.message;responsePair.hidden=true;}finally{shareBusy46=false;submit.disabled=false;$('#jm-share-close46').disabled=false;}
 };
}
function shareButton46(parent){if(!parent||parent.querySelector('.jm-share-entry46'))return;const area=document.createElement('div');area.className='jm-share-entry46';const button=document.createElement('button');button.type='button';button.className='jm-primary';button.textContent='Kongsi buku kepada ibu bapa';button.disabled=!shareReady46();button.onclick=openShare46;area.append(button);parent.append(area);}
const bookBefore46=bookScreen27;bookScreen27=function(){bookBefore46();if(closeStage27==='book')shareButton46(closing27);};
const extraBefore46=renderExtra27;renderExtra27=function(){extraBefore46();if(aux27==='certificate'&&shareReady46())shareButton46(extra27.querySelector('.jm-certificate27'));};
root.dataset.version='46';$('#jm-version').textContent='Joran Minda · Versi 46 · Galeri buku dan paparan jelas';queue27();
