import {readFile,writeFile} from 'node:fs/promises';import {createHash} from 'node:crypto';import {runInNewContext} from 'node:vm';
import '../public/questions-v34.js';import '../public/story-engine.js';import '../public/story-v37.js';import '../public/lesson-core.js';import '../public/practice-v38.js';import '../public/practice-v39.js';import '../public/questions-v40.js';
const root=new URL('../',import.meta.url),ctx={window:{}};runInNewContext(await readFile(new URL('public/audio-ms/manifest.js',root),'utf8'),ctx);
const all=Object.values(JoranQuestions40.texts),P=JoranQuestions40;
for(const key of Object.keys(P.fishing)){
 for(const q of P.fishing[key]){
  all.push(q.prompt,q.prompt+' Pilih satu jawapan.',q.prompt+' Pilih ikan, kemudian tekan Pancing ikan ini.');
  for(const o of q.options)all.push(o.text,o.text+'.');
  const answer=q.options[q.answer].text;
  all.push('Kamu berjaya memilih jawapan tentang cerita: '+answer+'.','Kamu berjaya memilih jawapan yang tepat: '+answer+'.','Jawapan yang tepat ialah '+answer+'. Dua mata ditolak. Kamu boleh meneruskan.','Jawapan yang tepat ialah '+answer+'. Dua mata ditolak. Teruskan permainan.');
 }
 for(const route of ['pengukuhan','pengayaan'])for(const q of P.questions[key][route])all.push(q.prompt+' Pilih satu gambar jawapan.',...q.options.map(o=>o.text));
}
const unique=[...new Set(all.filter(Boolean).flatMap(t=>[t,t.replace(/\.{2,}/g,'.')]))],clips=unique.filter(t=>!ctx.window.JoranMalayAudio.clips[t]).map(text=>({id:'v40-'+createHash('sha256').update(text).digest('hex').slice(0,12),text}));
await writeFile(new URL('server/voice-new-v40.json',root),JSON.stringify({version:40,clips},null,2));await writeFile(new URL('server/voice-required-v40.json',root),JSON.stringify(unique,null,2));console.log({newClips:clips.length,required:unique.length});
