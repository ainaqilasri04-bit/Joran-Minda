import {readFile,writeFile} from 'node:fs/promises';import {createHash} from 'node:crypto';import {runInNewContext} from 'node:vm';
const root=new URL('../',import.meta.url),ctx={window:{}};ctx.globalThis=ctx;
for(const name of ['questions-v34.js','story-engine.js','story-v37.js','lesson-core.js','practice-v38.js','practice-v39.js','questions-v40.js','support-v41.js','inclusive36.js','audio-ms/manifest.js'])runInNewContext(await readFile(new URL('public/'+name,root),'utf8'),ctx);
const all=[];
for(const version of [37,38,39,40])all.push(...JSON.parse(await readFile(new URL('server/voice-required-v'+version+'.json',root),'utf8')));
for(const key of ['belang','pondok','pokok','sihat']){
 try{all.push(...JSON.parse(await readFile(new URL('server/voice-observed41-'+key+'.json',root),'utf8')));}catch(e){if(e.code!=='ENOENT')throw e;}
 const story=ctx.JoranStory.stories?.[key];
 all.push(...ctx.JoranSupport41.proofPrompts[key],...ctx.JoranSupport41.proofPrompts[key].map(t=>t+' Pilih satu gambar.'));
}
all.push(...ctx.JoranSupport41.cameraSteps,ctx.JoranSupport41.camera,ctx.JoranSupport41.cameraChoice,ctx.JoranSupport41.preview,'Dua mata ditolak. Kamu boleh teruskan.');
const unique=[...new Set(all.filter(Boolean).map(t=>t.replace(/\s+/g,' ').trim()))];
const clips=unique.filter(t=>!ctx.window.JoranMalayAudio.clips[t]).map(text=>({id:'v41-'+createHash('sha256').update(text).digest('hex').slice(0,12),text}));
await writeFile(new URL('server/voice-new-v41.json',root),JSON.stringify({version:41,clips},null,2));
await writeFile(new URL('server/voice-required-v41.json',root),JSON.stringify(unique,null,2));
await writeFile(new URL('public/voice-required41.js',root),'window.JoranRequiredAudio41='+JSON.stringify(unique)+';\n');
console.log({required:unique.length,newClips:clips.length});
