import {readFile,writeFile,mkdir,access} from 'node:fs/promises';
const project=new URL('../',import.meta.url),catalog=JSON.parse(await readFile(new URL('server/voice-catalog.json',project),'utf8'));
const dry=process.argv.includes('--dry-run'),approve=process.argv.includes('--approve-reviewed');
const audioDir=new URL('public/audio-ms/',project),clipDir=new URL('clips/',audioDir);await mkdir(clipDir,{recursive:true});
const manifest=()=>({locale:'ms-MY',voice:'ms-MY-YasminNeural',enabled:true,reviewed:false,clips:Object.fromEntries(catalog.clips.map(c=>[c.text,c.text==='Yeay!'?'audio-ms/yeay.mp3':'audio-ms/clips/'+c.id+'.mp3']))});
if(dry){console.log(JSON.stringify({locale:catalog.locale,voice:catalog.voice,clips:catalog.clips.length,characters:catalog.clips.reduce((n,c)=>n+c.text.length,0),networkRequests:0}));process.exit(0);}
if(approve){
 const {runInNewContext}=await import('node:vm');const sandbox={window:{}};runInNewContext(await readFile(new URL('manifest.js',audioDir),'utf8'),sandbox);
 const current=sandbox.window.JoranMalayAudio;
 for(const clip of Object.values(current.clips))await access(new URL('public/'+(typeof clip==='string'?clip:clip.src),project));
 current.reviewed=true;current.enabled=true;
 await writeFile(new URL('manifest.js',audioDir),'window.JoranMalayAudio='+JSON.stringify(current)+';\n');
 console.log('Reviewed audio enabled. Teacher story recordings remain separate.');process.exit(0);
}
const key=process.env.AZURE_SPEECH_KEY,region=process.env.AZURE_SPEECH_REGION;
if(!key||!region||!/^[a-z0-9]+$/.test(region)){console.error('Set AZURE_SPEECH_KEY and AZURE_SPEECH_REGION locally first. Do not paste keys into chat or commit them. No audio has been generated.');process.exit(1);}
const escape=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&apos;');
let count=0;
for(const clip of catalog.clips){
 if(clip.text==='Yeay!')continue;
 const path=new URL(clip.id+'.mp3',clipDir);try{await access(path);continue;}catch{}
 const ssml='<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="ms-MY"><voice name="ms-MY-YasminNeural"><prosody rate="-3%">'+escape(clip.text)+'</prosody></voice></speak>';
 const response=await fetch('https://'+region+'.tts.speech.microsoft.com/cognitiveservices/v1',{method:'POST',headers:{'Ocp-Apim-Subscription-Key':key,'Content-Type':'application/ssml+xml','X-Microsoft-OutputFormat':'audio-24khz-48kbitrate-mono-mp3','User-Agent':'JoranMinda'},body:ssml,signal:AbortSignal.timeout(45000)});
 if(!response.ok)throw Error('Malay audio request failed (HTTP '+response.status+'). Completed clips are retained.');
 const bytes=new Uint8Array(await response.arrayBuffer());if(bytes.length<100)throw Error('Empty audio response.');await writeFile(path,bytes);count++;console.log('Generated',count,'instruction clip(s).');
}
const rows=catalog.clips.map(c=>'<article><p>'+escape(c.text)+'</p><audio controls preload="none" src="'+(c.text==='Yeay!'?'yeay.mp3':'clips/'+c.id+'.mp3')+'"></audio></article>').join('\n');
await writeFile(new URL('semak-suara.html',audioDir),'<!doctype html><html lang="ms"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Semak suara bahasa Melayu</title><style>body{font:18px/1.7 sans-serif;max-width:850px;margin:auto;padding:24px;background:#fff8e9;color:#174d91}article{padding:18px 0;border-bottom:1px solid #b9cbd4}audio{width:100%}</style><h1>Semak sebutan sebelum digunakan</h1><p>Dengar setiap arahan. Semak sebutan, intonasi dan padanan teks. Selepas semuanya sesuai, jalankan npm run audio:approve.</p>'+rows+'</html>');
await writeFile(new URL('manifest.js',audioDir),'window.JoranMalayAudio='+JSON.stringify(manifest())+';\n');
console.log('Audio created. Review public/audio-ms/semak-suara.html, then run npm run audio:approve.');
