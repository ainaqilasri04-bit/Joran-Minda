// Retained teacher audio audit. Camera mode was removed in V43.
const S41=JoranSupport41;
function voiceAudit41(){
 const storyRows=Object.entries(stories).map(([key,s])=>({key,title:s.title,pages:Array.from({length:5},(_,p)=>({page:p+1,ready:!!readingAudio(p,key),text:canonicalText23(key,p)}))}));
 const required=window.JoranRequiredAudio41||[];
 return {stories:storyRows,ai:{total:required.length,missing:required.filter(text=>!packagedMalayClip(text))}};
}
const auditPanel41=document.createElement('section');auditPanel41.id='jm-voice-audit41';auditPanel41.innerHTML='<h3>Semakan suara sebelum terbit</h3><p>Semakan ini meliputi fail permainan dan rakaman yang disimpan pada peranti ini.</p><button type="button" class="jm-secondary" id="jm-check-voices41">Semak semua suara</button><div id="jm-voice-audit-result41" aria-live="polite"></div>';
hub33.after(auditPanel41);
function renderVoiceAudit41(){
 const a=voiceAudit41(),missing=a.ai.missing,box=$('#jm-voice-audit-result41');
 box.innerHTML='<p><strong>Suara AI:</strong> '+(a.ai.total===0?'Senarai semakan belum dimuatkan.':missing.length?missing.length+' teks belum mempunyai fail suara.':'Semua '+a.ai.total+' teks semakan mempunyai fail suara.')+'</p><table><thead><tr><th>Cerita</th><th>Rakaman Guru sepadan</th><th>Halaman yang perlu dirakam</th></tr></thead><tbody>'+a.stories.map(s=>'<tr><td>'+safe(s.title)+'</td><td>'+s.pages.filter(p=>p.ready).length+' / 5</td><td>'+safe(s.pages.filter(p=>!p.ready).map(p=>p.page).join(', ')||'Semua lengkap')+'</td></tr>').join('')+'</tbody></table>'+(missing.length?'<details><summary>Lihat teks AI yang belum lengkap</summary><ol>'+missing.map(t=>'<li>'+safe(t)+'</li>').join('')+'</ol></details>':'')+'<p>Jika rakaman baharu sudah ada pada peranti lain, pulihkan sandaran rakaman itu dahulu. Selepas merakam, muat turun suara untuk website sebelum menerbitkan.</p>';
}
$('#jm-check-voices41').onclick=async()=>{await restoreAudio();renderVoiceAudit41();};
const summaryBefore41=renderSummary33;
renderSummary33=function(){summaryBefore41();renderVoiceAudit41();};
root.dataset.version='41';$('#jm-version').textContent='Joran Minda · Versi 41 · Semakan suara';queue27();
