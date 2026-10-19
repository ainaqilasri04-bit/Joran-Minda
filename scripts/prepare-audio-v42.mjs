import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {runInNewContext} from 'node:vm';
const root=new URL('../',import.meta.url),ctx={window:{}};ctx.globalThis=ctx;
for(const file of ['questions-v34.js','story-engine.js','story-v37.js','support-v42.js','audio-ms/manifest.js'])runInNewContext(await readFile(new URL('public/'+file,root),'utf8'),ctx);
const all=JSON.parse(await readFile(new URL('server/voice-required-v41.json',root),'utf8'));
all.push(...Object.values(ctx.JoranSupport42));
for(const key of ['belang','pondok','pokok','sihat'])for(let page=0;page<5;page++)all.push(...ctx.JoranStory.lessonMake(key,page,40).sentences);
const unique=[...new Set(all.filter(Boolean).map(t=>t.replace(/\s+/g,' ').trim()))];
const clips=unique.filter(t=>!ctx.window.JoranMalayAudio.clips[t]).map(text=>({id:'v42-'+createHash('sha256').update(text).digest('hex').slice(0,12),text}));
await writeFile(new URL('server/voice-new-v42.json',root),JSON.stringify({version:42,clips},null,2));
await writeFile(new URL('server/voice-required-v42.json',root),JSON.stringify(unique,null,2));
// The existing teacher audit reads this stable entry point.
await writeFile(new URL('public/voice-required41.js',root),'window.JoranRequiredAudio41='+JSON.stringify(unique)+';\n');
console.log({required:unique.length,newClips:clips.length});
