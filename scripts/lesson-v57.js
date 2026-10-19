// V57: optional Drive sharing; reflection and certificates depend on learning tasks.
const retiredApproval57='Selepas memuat naik buku, tekan Minta Guru semak. Guru akan menyemak buku dalam Google Drive. Selepas Guru mengesahkan penghantaran, tekan Seterusnya untuk membuat refleksi.';
voiceCatalog33.delete(normalizeVoice(retiredApproval57));
window.JoranRequiredAudio41=window.JoranRequiredAudio41.filter(t=>normalizeVoice(t)!==normalizeVoice(retiredApproval57));
const shareBefore57=shareScreen47;
shareScreen47=function(){
 shareBefore57();
 if(!$('#jm-next27').disabled)$('#jm-status27').textContent='Kamu boleh terus ke refleksi.';
};
function fitPond57(){
 const stage=$('#jm-stage'),width=stage.getBoundingClientRect().width;
 if(width>0)stage.dataset.compact57=String(width<600);
}
function fitViewport57(){
 const viewport=window.visualViewport;
 // Browser zoom remains available; do not resize the app to a pinch-zoomed viewport.
 if(viewport&&viewport.scale!==1)return;
 const height=viewport?.height||window.innerHeight;
 if(height>0){root.style.setProperty('--jm-viewport57',Math.round(height)+'px');root.style.setProperty('--jm-header-limit57',Math.max(88,Math.round(height*.36))+'px');}
 fitPond57();
}
const paintBefore57=paint27;
paint27=function(){paintBefore57();fitPond57();};
const pondResize57=window.ResizeObserver?new ResizeObserver(fitPond57):null;pondResize57?.observe($('#jm-stage'));
window.addEventListener('resize',fitViewport57,{passive:true});
window.visualViewport?.addEventListener('resize',fitViewport57,{passive:true});
fitViewport57();
renderSummary33();
root.dataset.version='57';$('#jm-version').textContent='Joran Minda · Versi 57 · Refleksi terus dan paparan telefon';queue27();
