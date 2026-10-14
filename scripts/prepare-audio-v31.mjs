// Prepare the missing, finite pupil-facing narration without changing existing audio.
import {readFile,writeFile} from 'node:fs/promises';
import {runInNewContext} from 'node:vm';
import {createHash} from 'node:crypto';
const base=new URL('../',import.meta.url),read=p=>readFile(new URL(p,base),'utf8');
const ctx={window:{}};ctx.globalThis=ctx;runInNewContext(await read('public/story-engine.js'),ctx);runInNewContext(await read('public/lesson-core.js'),ctx);runInNewContext(await read('public/audio-ms/manifest.js'),ctx);
const engine=ctx.JoranStory||ctx.window.JoranStory,lesson=ctx.JoranLesson||ctx.window.JoranLesson;
const source=await read('scripts/lesson-v30.js');runInNewContext(source.slice(source.indexOf('const prompts30='),source.indexOf('const questionBefore30'))+'globalThis.prompts=prompts30;',ctx);
const texts=new Set(),add=t=>{if(t&&!/mengikut masa sendiri|panduan ringkas/i.test(t))texts.add(t.replace(/\s+/g,' ').trim());};
for(const file of ['scripts/lesson-v28.js','scripts/lesson-v29.js','scripts/lesson-v30.js','scripts/lesson-v31.js']){
 const s=await read(file);for(const m of s.matchAll(/'([^'\n]{25,})'/g)){
  const text=m[1];if(/^[A-Z][A-Za-zÀ-ž ,.!?;:–0-9/—-]+[.!?]$/.test(text)&&!/V29|V30|Audio|audio|suara.*peranti|MP3|ms-MY|Simpanan|Rakaman dipadam|sejarah|Kunci bilik|Indeks|berikutnya\.$/.test(text))add(text);
 }
}
add('Semua ahli bekerjasama. Penyumbang yang namanya diserlahkan menekan butang sendiri. Rakan lain membantu.');
for(const [key,items]of Object.entries(lesson.bank)){
 for(const[i,x]of items.entries()){
  add(ctx.prompts[key][i]);add(ctx.prompts[key][i]+' Pilihan jawapan: '+x.options.join('. ')+'.');add(x.action+' Apakah nilai yang ditunjukkan? Pilihan jawapan: '+x.options.join('. ')+'.');
  add(x.value+': '+x.action+' Kamu berjaya menghubungkan perbuatan dengan nilai murni.');
  add(x.value+': '+x.action+' Jawapan direkodkan. Dua mata ditolak bagi setiap pilihan yang kurang tepat. Kamu boleh meneruskan.');
  add(x.value+': '+x.action+' Dua mata ditolak. Kamu boleh meneruskan.');
  add('Nilai '+x.value.toLowerCase()+' ditunjukkan melalui perbuatan berikut: '+x.action+' Penjelasan telah disimpan dalam buku cerita.');
 }
 for(let page=0;page<5;page++){
  const doc=engine.lessonMake(key,page),proof=doc.sentences[doc.evidence];
  add(doc.clue);add('Ayat bukti: '+proof+' Apakah nilai murni yang ditunjukkan oleh perbuatan ini?');
  add('Ayat bukti: '+proof+' Teruskan menentukan nilai murni.');add('Jawapan yang tepat: '+proof+' Dua mata ditolak. Kamu boleh meneruskan.');
  for(const value of doc.labels)add(value+'.');
  add('Kamu berjaya mengenal pasti nilai murni: '+doc.labels[doc.answer]+'.');
  for(const answer of [proof,doc.labels[doc.answer]]){add('Kamu berjaya memilih jawapan yang tepat: '+answer+'.');add('Jawapan yang tepat ialah '+answer+'. Dua mata ditolak. Teruskan permainan.');add('Jawapan yang tepat ialah '+answer+'. Dua mata ditolak. Kamu boleh meneruskan.');}
 }
 const summary=items.map(x=>x.value+': '+x.action).join(' ');
 for(const ending of [' Semua ahli telah menyumbang. Teruskan ke penutup.',' Bincang bersama dan teruskan kepada ahli yang berikutnya.']){
  add(summary+ending);add('Idea dan sebab kamu telah disimpan.'+ending);add('Padanan pertama tepat. Padanan kedua perlu dibetulkan. Nilai yang tepat ialah '+items[1].value+'.'+ending);
 }
}
const existing=new Set(Object.keys(ctx.window.JoranMalayAudio.clips)),clips=[...texts].filter(t=>!existing.has(t)).map(text=>({id:createHash('sha256').update(text).digest('hex').slice(0,20),text}));
await writeFile(new URL('server/voice-pending-v31.json',base),JSON.stringify({locale:'ms-MY',voice:'ms-MY-YasminNeural',status:'awaiting_audio_generation',includesTeacherStoryNarration:false,clips},null,2)+'\n');
console.log(JSON.stringify({pending:clips.length,networkRequests:0,existingAudioUnchanged:true}));
