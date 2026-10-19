// V39: one coherent paragraph, accurate action cards, actual matching and separate records.
const P39=JoranPractice39;
const pictureBefore39=picture38;
picture38=function(id){const item=P39.images[id];if(!item?.v39)return pictureBefore39(id);const col=item.cell%3,row=Math.floor(item.cell/3),xs=item.sheet==='actions'?[0,416,837,1254]:item.sheet==='choices'?[0,415,838,1254]:[0,420,836,1254],ys=item.sheet==='actions'?[0,398,798,1254]:item.sheet==='choices'?[0,417,832,1254]:[0,395,820,1254],x=xs[col]+3,y=ys[row]+3,w=xs[col+1]-x-3,h=ys[row+1]-y-3;return '<span class="jm-picture38 jm-picture39" data-picture38="'+id+'"><img src="assets/'+item.sheet+'-v39.png" alt="'+safe(item.alt)+'" style="--iw39:'+125400/w+'%;--ih39:'+125400/h+'%;left:-'+x/w*100+'%;top:-'+y/h*100+'%" draggable="false"></span>';};
const questionsBefore39=practiceQuestions38;
practiceQuestions38=()=>currentLessonVersion34()>=39?P39.forStory(storyKey,lesson24().route):questionsBefore39();
const explainLegacy39=presentExplanation35,explainBusy39=new WeakSet();
presentExplanation35=function(){
 if(currentLessonVersion34()<39)return explainLegacy39();
 const index=lesson24().explanations[0]?1:0,f=panel24.querySelector('[data-pdp-explain="'+index+'"]');if(!f)return;
 const bank=lessonBank34(storyKey),target=bank[index],s=state27();s.explain39??={};const key=storyKey+':'+index,st=s.explain39[key]??={proof:null,review:false};
 // The displayed target and submitted target are the same captured object. No hidden stale select.
 const renderKey=key+':'+st.review;if(f.dataset.explain39!==renderKey){f.dataset.explain39=renderKey;f.removeAttribute('data-explain-stage35');
 f.innerHTML='<input type="hidden" name="value" value="'+safe(target.value)+'"><input type="hidden" name="proofIndex"><input type="hidden" name="text">'+(st.review?'<div class="jm-review39"><h3>Ayat pilihan kamu</h3><p class="jm-guided-sentence36"></p></div>':'<div class="jm-proof-cards39">'+bank.map((b,j)=>'<button type="button" data-proof35="'+j+'" aria-pressed="false">'+picture38(P39.proofImages[storyKey][j])+'<span>'+syl(b.action)+'</span></button>').join('')+'</div>');
 f.querySelectorAll('[data-proof35]').forEach(b=>b.onclick=()=>{if(!canLead26())return;st.proof=Number(b.dataset.proof35);saveWork();queue27();});
 audioPair37(f,st.review?'Dengar ayat saya':'Dengar pilihan',()=>speech36(st.review?[U36.sentence(target.value,bank[st.proof].action)]:bank.map(b=>b.action)));
 }
 const sentence=st.proof===null?'':U36.sentence(target.value,bank[st.proof].action);f.elements.value.value=target.value;f.elements.proofIndex.value=st.proof??'';f.elements.text.value=sentence;
 if(st.review)putHTML36(f.querySelector('.jm-guided-sentence36'),syl(sentence));
 f.querySelectorAll('[data-proof35]').forEach(b=>{b.setAttribute('aria-pressed',String(Number(b.dataset.proof35)===st.proof));const disabled=!canLead26();if(b.disabled!==disabled)b.disabled=disabled;});
 f.onsubmit=async e=>{e.preventDefault();if(st.proof===null||explainBusy39.has(st)||!canLead26())return;explainBusy39.add(st);try{const chosen=st.proof,correct=chosen===index;if(await saveLesson24({type:'lesson-explain',index,value:target.value,proofIndex:chosen,text:U36.sentence(target.value,bank[chosen].action)})){
 feedback36(correct?'Tahniah! Penerangan tepat.':'Mari semak penerangan.',[correct?'Tahniah! Nilai dan perbuatan sepadan.':'Jawapan belum tepat. Dua mata ditolak. Kamu boleh teruskan.',target.value+': '+target.action],go24);
 const copy=$('#jm-response-copy38');copy?.before(Object.assign(document.createElement('div'),{className:'jm-feedback-picture38',innerHTML:picture38(P39.proofImages[storyKey][index])}));
 }}finally{explainBusy39.delete(st);}};
 nav27('Terangkan nilai '+target.value.toLowerCase(),'Aktiviti 2 · Penjelasan '+(index+1)+' / 2',st.review?'Simpan penjelasan →':'Semak ayat →',()=>{if(st.proof===null)return;if(st.review)return f.onsubmit({preventDefault(){}});st.review=true;saveWork();queue27();},{disabled:!canLead26()||st.proof===null||explainBusy39.has(st),status:'',back:()=>{if(st.review){st.review=false;queue27();}else openReference30();}});
};
function matchingScreen39(){
 const f=$('#jm-pdp-practice');if(!f)return;const st=practiceState38(),qs=practiceQuestions38(),member=practiceMember28();st.selectedWord??=0;
 const key=member.id+':matching:'+!!st.matchChecked39;if(f.dataset.match39!==key){f.dataset.match39=key;f.dataset.picture38='matching39';f.onsubmit=e=>e.preventDefault();
 f.innerHTML='<header class="jm-practice-heading38"><div><h3>Latihan Pemulihan</h3><p><strong>'+safe(member.name)+'</strong> · Empat pasangan</p></div></header><div class="jm-matching39"><div class="jm-match-words39">'+qs.map((q,i)=>'<button type="button" data-word39="'+i+'"><b>'+(i+1)+'</b><span>'+syl(q.word)+'</span><em class="jm-match-tag39"></em></button>').join('')+'</div><div class="jm-match-pictures39">'+qs[0].options.map((o,j)=>'<button type="button" data-match39="'+j+'" aria-label="Gambar '+String.fromCharCode(65+j)+': '+safe(P39.images[o.image].alt)+'">'+picture38(o.image)+'<b>'+String.fromCharCode(65+j)+'</b><em class="jm-match-tag39"></em></button>').join('')+'</div></div><p class="jm-match-status39" role="status"></p>';
 f.querySelectorAll('[data-word39]').forEach(b=>b.onclick=()=>{if(st.matchChecked39||!canLead26())return;st.selectedWord=Number(b.dataset.word39);queue27();});
 f.querySelectorAll('[data-match39]').forEach(b=>b.onclick=()=>{if(st.matchChecked39||!canLead26())return;const j=Number(b.dataset.match39),i=st.selectedWord,previous=st.answers.findIndex(x=>x===j);if(previous>=0&&previous!==i)st.answers[previous]=null;st.answers[i]=j;saveWork();queue27();});
 audioPair37(f,'Dengar perkataan',()=>speech36(qs.map(q=>q.word)));
 }
 const locked=!!st.matchChecked39||!canLead26();
 f.querySelectorAll('[data-word39]').forEach(b=>{const i=Number(b.dataset.word39),j=st.answers[i];b.setAttribute('aria-pressed',String(st.selectedWord===i));if(b.disabled!==locked)b.disabled=locked;setText36(b.querySelector('em'),j==null?'Belum dipadankan':'↔ '+String.fromCharCode(65+j));});
 f.querySelectorAll('[data-match39]').forEach(b=>{const j=Number(b.dataset.match39),i=st.answers.findIndex(x=>x===j);b.setAttribute('aria-pressed',String(i===st.selectedWord));if(b.disabled!==locked)b.disabled=locked;setText36(b.querySelector('em'),i>=0?'Pasangan '+(i+1):'');});
 const count=qs.filter((q,i)=>st.answers[i]!=null).length;setText36(f.querySelector('.jm-match-status39'),st.matchChecked39?'Padanan telah disemak. Tekan Simpan latihan.':count+' daripada 4 pasangan dipilih.');
 const save=async()=>{if(savingPractice38.has(st))return;savingPractice38.add(st);try{if(await saveLesson24({type:'lesson-practice',answers:st.answers.slice()}))go24();}finally{savingPractice38.delete(st);queue27();}};
 nav27('Latihan Pemulihan','Aktiviti 3 · '+member.name,st.matchChecked39?'Simpan latihan →':'Semak padanan →',async()=>{if(count!==4||savingPractice38.has(st))return;if(st.matchChecked39)return save();st.matchChecked39=true;st.checked=qs.map(()=>true);saveWork();const correct=qs.filter((q,i)=>st.answers[i]===q.answer).length;feedback36(correct===4?'Tahniah! Padanan betul.':'Mari semak padanan.',[correct===4?P39.matched:P39.wrongMatch],save);$('#jm-response-copy38').after(Object.assign(document.createElement('div'),{className:'jm-match-review39',innerHTML:qs.map(q=>'<div>'+picture38(q.options[q.answer].image)+'<span>'+syl(q.word)+'</span></div>').join('')}));queue27();},{disabled:!canLead26()||count!==4||savingPractice38.has(st),back:openReference30,status:''});
}
const lessonLegacy39=lessonScreen27;
lessonScreen27=function(){if(active27()&&!aux27&&eligible24()===3&&lesson24().route==='pemulihan'&&!lesson24().practiced&&currentLessonVersion34()>=39){panel24.dataset.phase27='3';panel24.dataset.sub27='practice';panel24.dataset.focusMode35='practice';matchingScreen39();return;}lessonLegacy39();};
const directionLegacy39=shortDirection35;
shortDirection35=function(){if(active27()&&!aux27&&currentLessonVersion34()>=39){if(view==='lesson'&&eligible24()===2&&coreReady24()){const i=lesson24().explanations[0]?1:0,st=state27().explain39?.[storyKey+':'+i];return {icon:'heart',text:st?.review?'Baca ayat pilihan kamu. Tekan Simpan penjelasan.':P39.proofPrompts[storyKey][i]+' Pilih satu gambar.'};}if(view==='lesson'&&eligible24()===3&&lesson24().route==='pemulihan'&&!lesson24().practiced)return {icon:'match',text:P39.matching};}return directionLegacy39();};
function choiceImage39(text){const clean=text.trim();if(P39.values[clean])return P39.values[clean];for(const key of Object.keys(P39.proofImages)){const bank=lessonBank34(key);const i=bank.findIndex(b=>b.action===clean);if(i>=0)return P39.proofImages[key][i];}
 const rules=[[/bekerja sendiri/i,'alone'],[/bermain sahaja/i,'play'],[/cepat berlari/i,'run'],[/suka berehat/i,'rest'],[/menunggu sakit/i,'sick'],[/mengabaikan diri/i,'neglect'],[/memulangkan|ke rak|menyusun buku/i,'return'],[/mengoyak/i,'books1'],[/berdebu|menyapu|mengemas pondok/i,'sweep'],[/dompet|jujur/i,'honest'],[/menghormati|mendengar|nasihat/i,'respect'],[/menutup.*paip|menjimatkan air/i,'save'],[/mengambil.*secukup|kesederhanaan/i,'moderate'],[/berbagi|berkongsi.*makanan/i,'health6'],[/baki|bekal.*pulang/i,'health2'],[/sampah|mengutip/i,'health3'],[/membasuh.*tangan|sabun/i,'health0'],[/menutup.*makanan/i,'health1'],[/puji|menghargai/i,'thanks'],[/peti|tuala|tempat rehat/i,'bed'],[/memanggil.*Tok Wan/i,'call'],[/makanan.*Belang|memberi makan/i,'care0'],[/air.*Belang|menukar air/i,'care1'],[/menjaga Belang|tugas.*hari/i,'duties'],[/berjanji|setiap minggu/i,'promise'],[/menawarkan bantuan|anak pokok.*layu/i,'offer'],[/menyiram/i,'water'],[/menolong|membantu|bersama|kerjasama/i,'carry'],[/rajin/i,'sweep'],[/penyakit|mencegah/i,'wise']];return rules.find(([re])=>re.test(clean))?.[1]||null;}
function decorateChoice39(el){if(el.querySelector('.jm-choice-image39,.jm-picture38'))return;const id=choiceImage39(el.textContent);const span=document.createElement('span');span.className='jm-choice-image39';span.innerHTML=id?picture38(id):'<img src="'+safe(assets[storyKey+'-'+(Math.min(4,readPage||0)+1)])+'" alt="Gambar rujukan cerita">';el.prepend(span);}
const paintLegacy39=paint27;
paint27=function(){paintLegacy39();if(!active27())return;
 for(const p of root.querySelectorAll('.jm-pdp-reading')){const lines=p.querySelectorAll('.jm-story-line35');if(lines.length)for(const l of lines){l.style.display='inline';l.style.margin='0';}}
 for(const el of root.querySelectorAll('.jm-ni-options label,[data-note-choice36],[data-evidence35],#jm-diagnostic29 label,.jm-evidence-choice,#jm-sentences [data-sentence],[data-reflect36],#jm-pdp-induction label,.jm-fish-label'))decorateChoice39(el);
 for(const label of root.querySelectorAll('.jm-fish-label'))if(!label.querySelector('.jm-fish-answer39')){const copy=document.createElement('span');copy.className='jm-fish-answer39';for(const node of [...label.childNodes])if(!node.classList?.contains('jm-choice-image39'))copy.append(node);label.append(copy);}
 for(const context of root.querySelectorAll('.jm-context35'))if(!context.dataset.scene39){context.dataset.scene39='true';const caption=F35.captions[storyKey];context.innerHTML=(storyKey==='pondok'?picture38('hut'):'<img src="'+safe(assets[storyKey+'-1'])+'" alt="'+safe(caption)+'">')+'<span>'+syl(caption)+'</span>';}
 if(view==='game'&&(step===3||step===4&&bonusReady)){
  fishHear27.hidden=true;if(fishHear27.stop30)fishHear27.stop30.hidden=true;
 }
};
const extraLegacy39=renderExtra27;
renderExtra27=function(){extraLegacy39();if(aux27==='outcomes'&&!extra27.querySelector('.jm-outcome-art39')){const art=document.createElement('div');art.className='jm-outcome-art39';art.innerHTML=picture38('complete');extra27.prepend(art);extra27.classList.add('jm-outcomes39');const cards=extra27.querySelectorAll('.jm-criteria27 article');cards.forEach((c,i)=>{c.insertAdjacentHTML('afterbegin','<div class="jm-outcome-icon39">'+picture38(i?'carry':'books0')+'</div>');});}else if(aux27!=='outcomes')extra27.classList.remove('jm-outcomes39');};
// Extend syllable support only where learning content explicitly calls syl().
const sylLegacy39=syl;
syl=function(text){for(const w of String(text).match(/[A-Za-z]+(?:-[A-Za-z]+)*/g)||[])if(!dict[w.toLowerCase()])dict[w.toLowerCase()]=splitMalay28(w.toLowerCase());return sylLegacy39(text);};
exportRecords=async function(){const b=$('#jm-download-report');b.disabled=true;try{downloadBlob(JoranReport31.workbook39(teacherRecords,await reportTakes32(),stories),'pencapaian-individu-dan-kumpulan.xlsx');$('#jm-report-action-status').textContent='Excel dimuat turun: Individu, Kumpulan dan Ahli Kumpulan. Isi TP PBD pada ruangan kuning selepas menyemak bukti murid.';}catch(e){$('#jm-report-action-status').textContent='Excel belum dapat disediakan: '+e.message;}finally{b.disabled=false;}};
$('#jm-download-report').textContent='Excel: Individu dan Kumpulan';$('#jm-download-report').onclick=exportRecords;
root.dataset.version='39';$('#jm-version').textContent='Joran Minda · Versi 39 · Pilihan bergambar dan padanan';queue27();
