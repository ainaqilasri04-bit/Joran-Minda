import{readFile,stat}from'node:fs/promises';
const html=await readFile(new URL('../public/index.html',import.meta.url),'utf8');if(!html.includes('jm-entry-form')||!html.includes('jm-chat-form'))throw Error('Classroom UI missing');
for(const story of ['belang','pondok','pokok','sihat'])for(const page of ['cover',1,2,3,4,5])if((await stat(new URL('../public/assets/'+story+'-'+page+'.webp',import.meta.url))).size<32)throw Error('Empty asset: '+story+'-'+page);
console.log('Build checked: 4 stories, 20 page illustrations, 4 covers, registration and classroom features.');
for(const asset of ['hand-control.js','hand/vision_bundle.js','hand/hand_landmarker.task','hand/wasm/vision_wasm_internal.js','hand/wasm/vision_wasm_internal.wasm','hand/wasm/vision_wasm_nosimd_internal.js','hand/wasm/vision_wasm_nosimd_internal.wasm'])if((await stat(new URL('../public/'+asset,import.meta.url))).size<32)throw Error('Hand-control asset missing: '+asset);
if(!html.includes('jm-hand-start')||!html.includes('JoranHand.mount'))throw Error('Hand-control integration missing');
console.log('Hand control and bundled MediaPipe resources checked.');

for (const page of ["public/index.html", "public/cuba-kamera.html"]) {
 const pageHtml = await readFile(new URL('../'+page,import.meta.url), 'utf8');
 if (pageHtml.includes("jm-hand-shadow") || !pageHtml.includes("jm-hand-landmarks")) throw new Error("Invalid hand tracking display: " + page);
}
console.log("Hand tracking checked: camera landmarks available, no hand silhouette in full game or practice.");

const {runInNewContext}=await import('node:vm');
const audioContext={window:{}};
runInNewContext(await readFile(new URL('../public/audio-ms/manifest.js',import.meta.url),'utf8'),audioContext);
const audio=audioContext.window.JoranMalayAudio,catalog=JSON.parse(await readFile(new URL('../server/voice-catalog.json',import.meta.url),'utf8'));
if(audio?.locale!=='ms-MY'||!(audio.enabled||audio.reviewed))throw Error('Bundled Malay audio not enabled');
for(const{ text }of catalog.clips){const cue=audio.clips[text];if(!cue)throw Error('Malay audio missing for: '+text);if(typeof cue==='object'&&!(cue.start>=0&&cue.duration>0&&/^audio-ms\/[a-z0-9-]+\.mp3$/.test(cue.src)))throw Error('Invalid audio cue');}
for(const cue of Object.values(audio.clips)){const path=typeof cue==='string'?cue:cue.src;if((await stat(new URL('../public/'+path,import.meta.url))).size<1000)throw Error('Audio file missing: '+path);}
if(!html.includes('jm-habitat')||!html.includes('data-ambient-paused')||!html.includes('jm-water-snail'))throw Error('Underwater habitat missing');
console.log('V20 checked: animated habitat and '+catalog.clips.length+' bundled Malay audio cues.');

if(!html.includes('jm-local-voice')||!html.includes('jm-test-cheer')||!html.includes('jm-image-zoom'))throw Error('Inclusive controls missing');
