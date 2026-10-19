import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {runInNewContext} from 'node:vm';
import '../public/story-engine.js';import '../public/questions-v34.js';import '../public/lesson-core.js';import '../public/inclusive36.js';
const root=new URL('../',import.meta.url),read=p=>readFile(new URL(p,root),'utf8');
const ctx={window:{}};runInNewContext(await read('public/audio-ms/manifest.js'),ctx);
const manifest=ctx.window.JoranMalayAudio,ui=JoranInclusive36;
const src=await read('public/index.html'),stories=JSON.parse(src.match(/const stories=(\{[^\n]+\});/)[1]);
const all=[...Object.values(ui.directions),...Object.values(ui.proofQuestions).flat(),...Object.values(ui.findQuestions).flat(),...Object.values(ui.fishingQuestions).flat(),...Object.values(ui.reflections).flat()];
for(const key of JoranStory.keys){const bank=JoranLesson.bankFor(key,34);for(const a of bank){all.push(a.action,a.value+'.');for(const b of bank)all.push(ui.sentence(a.value,b.action));}
 for(let p=0;p<5;p++){const d=JoranStory.lessonMake(key,p,34);all.push(d.sentences[d.evidence]);}
 all.push(...stories[key].meaning.map(t=>t+'.'));const t=ui.transfer[key];all.push(t.prompt,...t.actions,...t.values.map(t=>t+'.'));
}
let catalogue;try{catalogue=JSON.parse(await read('server/voice-new-v36.json'));}catch{catalogue={version:36,clips:[]};}
const known=new Set(catalogue.clips.map(c=>c.text));
for(const text of new Set(all))if(!manifest.clips[text]&&!known.has(text)){catalogue.clips.push({id:'v36-'+createHash('sha256').update(text).digest('hex').slice(0,12),text});known.add(text);}
await writeFile(new URL('server/voice-new-v36.json',root),JSON.stringify(catalogue,null,2)+'\n');
console.log(JSON.stringify({totalV36:catalogue.clips.length,missing:catalogue.clips.filter(c=>!manifest.clips[c.text]).length}));
