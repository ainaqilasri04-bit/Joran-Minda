import {readFile,writeFile} from 'node:fs/promises';
import {runInNewContext} from 'node:vm';
import {createHash} from 'node:crypto';
const root=new URL('../',import.meta.url),read=p=>readFile(new URL(p,root),'utf8');
const ctx={window:{}};ctx.globalThis=ctx;
for(const p of ['public/questions-v34.js','public/story-engine.js','public/lesson-core.js','public/audio-ms/manifest.js'])runInNewContext(await read(p),ctx);
const rows=new Map(),normal=t=>t.replace(/[“”]/g,'"').replace(/[‘’]/g,"'").replace(/\s+/g,' ').trim();
const add=(text,category='Maklum balas',story='')=>{text=normal(text);if(text&&!rows.has(text))rows.set(text,{id:createHash('sha256').update(text).digest('hex').slice(0,20),text,category,story});};
const pending=JSON.parse(await read('server/voice-pending-v31.json'));
for(const c of pending.clips)add(c.text);
// Current instruction paragraphs are taken verbatim from the UI source.
for(const f of [28,29,30,31,32,34]){const src=await read('scripts/lesson-v'+f+'.js');for(const m of src.matchAll(/(?='([^'\n]{25,})')/g)){const t=m[1];if(/^[A-Z][A-Za-zÀ-ž ,.!?;:–0-9/—-]+[.!?]$/.test(t)&&!/V2[89]|V3[012]|Audio|audio|suara.*peranti|MP3|ms-MY|Simpanan|Rakaman dipadam|sejarah|Kunci bilik|Indeks|Enjin bilik|mengikut masa sendiri|panduan ringkas/i.test(t)){add(t,'Arahan');rows.get(normal(t)).category='Arahan';}}}
const src=await read('scripts/lesson-v30.js');runInNewContext(src.slice(src.indexOf('const prompts30='),src.indexOf('const questionBefore30'))+'globalThis.prompts=prompts30;',ctx);
for(const [key,bank] of Object.entries(ctx.JoranLesson.bank)){
 for(const [i,b]of bank.entries()){
  for(const t of [b.value+'.',b.action,ctx.prompts[key][i],ctx.prompts[key][i]+' Pilihan jawapan: '+b.options.join('. ')+'.',b.action+' Apakah nilai yang ditunjukkan? Pilihan jawapan: '+b.options.join('. ')+'.']){add(t,'Soalan dan pilihan',key);Object.assign(rows.get(normal(t)),{category:'Soalan dan pilihan',story:key});}
 }
 for(let p=0;p<5;p++){const d=ctx.JoranStory.lessonMake(key,p);for(const t of [d.clue,...d.labels.map(t=>t+'.'),'Ayat bukti: '+d.sentences[d.evidence]+' Apakah nilai murni yang ditunjukkan oleh perbuatan ini?']){add(t,'Soalan dan pilihan',key);Object.assign(rows.get(normal(t)),{category:'Soalan dan pilihan',story:key});}}
 for(let correct=0;correct<=3;correct++)add(correct+' daripada 3 padanan tepat. '+(correct<3?'Potongan '+((3-correct)*2)+' mata daripada Aktiviti 3. ':'')+'Padanan yang betul: '+bank.map((b,i)=>(i+1)+'. '+b.action+' Nilainya ialah '+b.value.toLowerCase()+'.').join(' '),'Maklum balas',key);
}
for(const t of ['Tahniah!','Jawapan kamu tepat.','Kamu berjaya memancing jawapan yang tepat.','Tahniah! Buku cerita kamu telah siap.','Tahniah! Semua aktiviti pembelajaran telah dilengkapkan. Sijil kamu kini boleh dimuat turun.'])add(t,'Tahniah');
// V34 questions and choices exactly match the written screen.
for(const key of ctx.JoranStory.keys){
 const bank=ctx.JoranLesson.bankFor(key,34);
 for(const [i,b] of bank.entries())add(ctx.prompts[key][i]+' Pilihan jawapan: '+b.options.join('. ')+'.','Soalan dan pilihan',key);
 for(const row of [...ctx.JoranQuestions34.diagnostic[key],...ctx.JoranQuestions34.reinforcement[key]])add(row.prompt+' Pilihan jawapan: '+row.options.join('. ')+'.','Soalan dan pilihan',key);
 add(ctx.JoranQuestions34.enrichment[key],'Arahan',key);
 const feedback='Jawapan yang tepat: '+ctx.JoranLesson.practiceFor(key).map((q,i)=>(i+1)+'. '+q.options[q.answer]+'.').join(' ');
 for(const suffix of ['Semua ahli telah menyumbang. Teruskan ke penutup.','Bincang bersama dan teruskan kepada ahli yang berikutnya.'])add(feedback+' '+suffix,'Maklum balas',key);
 for(const row of ctx.JoranQuestions34.fishing[key]){const value=row[1][row[2]];for(const text of ['Kamu berjaya mengenal pasti nilai murni: '+value+'.','Kamu berjaya memilih jawapan yang tepat: '+value+'.','Jawapan yang tepat ialah '+value+'. Dua mata ditolak. Kamu boleh meneruskan.','Jawapan yang tepat ialah '+value+'. Dua mata ditolak. Teruskan permainan.'])add(text,'Maklum balas',key);}

 for(let p=0;p<5;p++){const d=ctx.JoranStory.lessonMake(key,p,34);for(const text of [d.clue,...d.labels.map(t=>t+'.'),'Ayat bukti: '+d.sentences[d.evidence]+' '+d.question])add(text,'Soalan dan pilihan',key);}
}
// Legacy bundled clips remain available but are listed separately from the current learning flow.
for(const text of Object.keys(ctx.window.JoranMalayAudio.clips))add(text,'Audio sedia ada');
const catalog={version:34,locale:'ms-MY',voice:'ms-MY-YasminNeural',includesTeacherStoryNarration:false,clips:[...rows.values()]};
await writeFile(new URL('server/voice-catalog-v33.json',root),JSON.stringify(catalog,null,2)+'\n');
await writeFile(new URL('public/voice-catalog.js',root),'window.JoranVoiceCatalog='+JSON.stringify(catalog)+';\n');
const waiting=catalog.clips.filter(c=>!ctx.window.JoranMalayAudio.clips[c.text]);
await writeFile(new URL('server/voice-pending-v34.json',root),JSON.stringify({version:34,status:waiting.length?'pending-approval':'complete',includesTeacherStoryNarration:false,clips:waiting},null,2)+'\n');
console.log(JSON.stringify({texts:rows.size,missing:[...rows.keys()].filter(t=>!ctx.window.JoranMalayAudio.clips[t]).length,generatedAudio:0}));
