// V49: PDF hand-off to a teacher-supplied Google Drive folder, without a gallery API.
const driveText49={
 share:'Tekan Muat turun buku (PDF). Kemudian, tekan Buka folder Google Drive. Dalam folder itu, pilih Baharu, kemudian Muat naik fail, dan pilih PDF buku kamu.',
 outcomes:'Lihat pencapaian Objektif 1 dan Objektif 2. Kemudian, tekan Baca cerita rakan di Google Drive.'
};
const retiredDrive49=[G46.texts.instruction,S42.outcomes];
for(const text of retiredDrive49)voiceCatalog33.delete(normalizeVoice(text));
G46.texts.instruction=driveText49.share;S42.outcomes=driveText49.outcomes;
for(const text of Object.values(driveText49))voiceCatalog33.set(normalizeVoice(text),{text,category:'Perkongsian buku',story:''});
window.JoranRequiredAudio41=[...new Set(window.JoranRequiredAudio41.filter(t=>!retiredDrive49.includes(t)).concat(Object.values(driveText49)))];renderSummary33();

function validDriveFolder49(value){
 try{
  if(typeof value!=='string'||value.length>2048)return '';
  const u=new URL(value.trim());
  if(u.protocol!=='https:'||u.hostname!=='drive.google.com'||u.port||u.username||u.password)return '';
  const match=u.pathname.match(/^\/drive\/(?:u\/\d+\/)?folders\/([A-Za-z0-9_-]+)\/?$/);
  const id=match?.[1]||(u.pathname==='/folderview'?u.searchParams.get('id'):'');
  if(!id||!(/^[A-Za-z0-9_-]+$/).test(id))return '';
  const clean=new URL('https://drive.google.com/drive/folders/'+id),key=u.searchParams.get('resourcekey');
  if(key&&/^[A-Za-z0-9_-]+$/.test(key))clean.searchParams.set('resourcekey',key);
  return clean.href;
 }catch{return '';}
}
function readDriveFolder49(){
 const param=new URL(location.href).searchParams.get('drive');
 // An explicit invalid link never falls back to a previous class's folder.
 if(param!==null)return validDriveFolder49(param);
 return validDriveFolder49(G46.load('jm-drive-folder49',''))||validDriveFolder49(window.JoranDriveConfig49?.folderUrl);
}
let driveFolder49=readDriveFolder49();
function driveGameLink49(){
 if(!driveFolder49||window.JoranStandalone35||!/^https?:$/.test(location.protocol))return '';
 const u=new URL(location.href);u.search='';u.hash='';u.searchParams.set('drive',driveFolder49);return u.href;
}
teacherGallery46.remove();
const teacherDrive49=document.createElement('section');teacherDrive49.id='jm-drive-settings49';teacherDrive49.className='jm-drive-settings49';
teacherDrive49.innerHTML='<h2>Folder Google Drive untuk buku murid</h2><p>Tampal pautan folder di sini. Murid menyimpan PDF dan memuat naik buku ke folder yang sama.</p><form id="jm-drive-form49"><label for="jm-drive-folder49">Pautan folder Google Drive</label><input id="jm-drive-folder49" class="jm-input" type="url" maxlength="2048" placeholder="https://drive.google.com/drive/folders/…"><div class="jm-drive-buttons49"><button type="submit" class="jm-primary">Simpan pautan folder</button><button type="button" id="jm-drive-test49" class="jm-secondary">Buka folder</button></div></form><p id="jm-drive-status49" role="status"></p><div id="jm-drive-share49"><label for="jm-drive-game49">Pautan permainan untuk murid</label><input id="jm-drive-game49" class="jm-input" readonly><button type="button" id="jm-drive-copy49" class="jm-primary">Salin pautan permainan</button><p>Berikan pautan permainan ini kepada murid supaya folder yang betul turut dibuka pada peranti mereka.</p></div><p id="jm-drive-preview49" hidden>Pautan folder boleh disimpan dalam pratonton ini. Selepas projek diterbitkan ke Netlify, simpan pautan folder sekali lagi di laman tersebut untuk mendapatkan pautan permainan bagi murid.</p><details><summary>Cara menyediakan folder</summary><ol><li>Cipta folder Google Drive bernama Buku Cerita Joran Minda.</li><li>Tekan Kongsi (Share). Berikan akaun murid akses Editor supaya mereka boleh menambah fail. Ibu bapa boleh diberikan akses Viewer untuk membaca.</li><li>Salin pautan folder dan tampal di atas.</li></ol><p>Murid perlu menggunakan akaun Google yang dibenarkan. Akses Editor turut membenarkan perubahan pada fail dalam folder; gunakan folder khas untuk aktiviti ini.</p><p>Semak PDF murid terus dalam folder Google Drive. Sistem permainan tidak mengesahkan muat naik secara automatik.</p></details>';
$('[data-panel=teacher]').prepend(teacherDrive49);
function paintDriveSettings49(){
 $('#jm-drive-folder49').value=driveFolder49;
 const link=driveGameLink49();$('#jm-drive-game49').value=link;$('#jm-drive-share49').hidden=!link;
 $('#jm-drive-preview49').hidden=!window.JoranStandalone35&&/^https?:$/.test(location.protocol);
 $('#jm-drive-test49').disabled=!driveFolder49;
}
paintDriveSettings49();
$('#jm-drive-form49').onsubmit=e=>{
 e.preventDefault();const raw=$('#jm-drive-folder49').value.trim(),url=validDriveFolder49(raw),status=$('#jm-drive-status49');
 if(raw&&!url){status.textContent='Tampal pautan folder Google Drive, bukan pautan satu fail. Pautan folder mengandungi /drive/folders/.';return;}
 try{G46.save('jm-drive-folder49',url);}catch{status.textContent='Pautan belum dapat disimpan. Benarkan simpanan pelayar dan cuba lagi.';return;}
 driveFolder49=url;
 try{const u=new URL(location.href);if(url)u.searchParams.set('drive',url);else u.searchParams.delete('drive');history.replaceState(null,'',u.href);}catch{}
 paintDriveSettings49();delete closing27.dataset.shareKey47;queue27();
 status.textContent=url?(driveGameLink49()?'Pautan disimpan. Salin pautan permainan di bawah untuk murid.':'Pautan disimpan pada peranti ini. Kamu boleh membuka folder untuk mencubanya.'):'Pautan folder telah dibuang.';
};
$('#jm-drive-test49').onclick=()=>{if(driveFolder49)window.open(driveFolder49,'_blank','noopener,noreferrer');};
$('#jm-drive-copy49').onclick=async()=>{
 const link=driveGameLink49(),status=$('#jm-drive-status49');if(!link)return;
 try{await navigator.clipboard.writeText(link);status.textContent='Pautan permainan disalin. Berikan kepada murid.';}
 catch{const input=$('#jm-drive-game49');input.focus();input.select();status.textContent='Pautan dipilih. Tekan Ctrl+C untuk menyalin.';}
};

shareScreen47=function(){
 const b=finalBook31(),mode=isSolo()?'individu':'kumpulan',owner=mode==='individu'?profile.id:(roomSession?.code||profile.sessionId||teamMembers.map(m=>m.id).sort().join('-'));
 const key='drive49:'+mode+':'+owner+':'+storyKey,renderKey=JSON.stringify([key,b.title,b.pageTitles,b.pages,driveFolder49]);
 let state=shareVisits47.get(key);if(!state){state={busy:false,pdfBusy:false};shareVisits47.set(key,state);}
 if(closing27.dataset.shareKey47!==renderKey||!$('#jm-drive-page49')){
  closing27.dataset.shareKey47=renderKey;
  const name=mode==='individu'?profile.name:(bookState().group||'Kumpulan Joran Minda');
  closing27.innerHTML='<div id="jm-drive-page49" class="jm-upload-page47"><figure><img src="'+safe(assets[storyKey+'-cover'])+'" alt="Kulit buku cerita '+safe(b.title)+'"><figcaption><strong>'+safe(b.title)+'</strong><span>'+safe(name)+' · Buku '+mode+'</span><span>✓ Lima halaman sudah disemak</span></figcaption></figure><div class="jm-drive-steps49"><section class="jm-pdf-actions48"><h3>1. Simpan buku kamu</h3><button type="button" id="jm-download-pdf48" class="jm-primary">Muat turun buku (PDF)</button><p id="jm-pdf-status48" role="status">PDF disimpan dalam muat turun peranti kamu.</p></section><section class="jm-drive-upload49"><h3>2. Hantar buku ke folder kelas</h3><button type="button" id="jm-drive-open49" class="jm-primary" '+(!driveFolder49?'disabled':'')+'>Buka folder Google Drive ↗</button><p id="jm-drive-pupil-status49" role="status">'+(driveFolder49?'Dalam Google Drive: pilih <b>Baharu (New) → Muat naik fail (File upload)</b>, kemudian pilih PDF buku kamu.':'Pautan folder belum disediakan. Minta bantuan Guru.')+'</p><p>Selepas fail selesai dimuat naik, kembali ke permainan untuk membuat refleksi.</p></section></div></div>';
  $('#jm-download-pdf48').onclick=()=>downloadSharedBook48(state);
  $('#jm-drive-open49').onclick=()=>{if(driveFolder49)window.open(driveFolder49,'_blank','noopener,noreferrer');};
 }
 const busy=state.pdfBusy;
 nav27('Kongsi Buku di Google Drive','Penutup · Langkah 2 / 3','Seterusnya: Refleksi →',()=>{if(busy)return;closeStage27='reflection';queue27();},{disabled:busy,status:busy?'Tunggu sehingga PDF siap.':'Selepas berkongsi buku, teruskan refleksi.',back:()=>{if(busy)return;bookPage=4;closeStage27='review';queue27();}});
 $('#jm-back27').disabled=busy;
};
// Bypass V48's Linktree lookup; no old gallery request is made on this page.
renderExtra27=function(){
 extraBefore48();if(aux27!=='outcomes')return;
 nav27('Objektif dan kriteria kejayaan','Pencapaian akhir','Baca cerita rakan di Google Drive ↗',()=>{if(!driveFolder49)return;persistSession23();window.open(driveFolder49,'_blank','noopener,noreferrer');},{disabled:!driveFolder49,status:driveFolder49?'Buka PDF rakan dalam folder Google Drive.':'Pautan folder belum disediakan oleh Guru.',back:()=>{aux27='certificate';queue27();}});
};
root.dataset.version='51';$('#jm-version').textContent='Joran Minda · Versi 51 · Audio arahan Google Drive lengkap';queue27();
