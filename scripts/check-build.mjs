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

for(const file of ['public/achievement.js','public/enhancements.css']) if((await stat(new URL('../'+file,import.meta.url))).size<100)throw Error('V23 file missing: '+file);
const engine=await readFile(new URL('../public/story-engine.js',import.meta.url),'utf8');
if(!html.includes(engine.trim()))throw Error('Story text in browser and server differs.');
if(!html.includes('jm-download-certificate')||!html.includes('jm-hide-selected')||!html.includes('jm-resume-last'))throw Error('V23 completion controls missing');
console.log('V23 checked: stable narration, task breakdown, report archive, resume and certificate gates.');
for(const file of ['public/lesson-core.js','public/lesson.css','public/panduan-pdp.html'])if((await stat(new URL('../'+file,import.meta.url))).size<100)throw Error('PdP file missing: '+file);
const lessonUI=await readFile(new URL('lesson-ui.js',import.meta.url),'utf8');
if(!html.includes(lessonUI.trim()))throw Error('PdP source and inline app differ.');
console.log('V24 checked: five PdP phases, individual criteria, differentiated practice and teacher guide.');

const v25=await readFile(new URL('lesson-v25.js',import.meta.url),'utf8');if(!html.includes(v25.trim()))throw Error('V25 UI not synchronized');console.log('V25 checked: puzzle, BaCaNi, value fishing and complete-book export.');
const v26=await readFile(new URL('lesson-v26.js',import.meta.url),'utf8');if(!html.includes(v26.trim()))throw Error('V26 UI not synchronized');
for(const path of ['public/pupil-audio.js','server/pupil-audio.mjs'])if((await stat(new URL('../'+path,import.meta.url))).size<100)throw Error('Pupil recording module missing');
console.log('V26 checked: fixed group leader, shared answers, pupil reading recordings, teacher assessment and gated group certificates.');

const v27=await readFile(new URL('lesson-v27.js',import.meta.url),'utf8');if(!html.includes(v27.trim()))throw Error('V27 UI not synchronized');
console.log('V27 checked: sequential pupil screens, visible Next, separate task checklist, marks and certificates.');

for(const version of [28,29,30,31,32,33,34]){const source=await readFile(new URL('lesson-v'+version+'.js',import.meta.url),'utf8');if(!html.includes(source.trim()))throw Error('V'+version+' UI not synchronized');}
if((await stat(new URL('../public/audio-ms/klik.mp3',import.meta.url))).size<1000)throw Error('Click recording missing');console.log('V29 checked: personal practice routes, contributor turns, permanent history cleanup, recorded click and short Malay guide fallback.');

if((await stat(new URL('../public/assets/lake-panorama-v32.png',import.meta.url))).size<10000)throw Error('Panorama V32 missing');
console.log('V32 checked: panorama, matching practice, plain teacher table and illustrated certificate.');

const currentVoices=JSON.parse(await readFile(new URL('../server/voice-catalog-v33.json',import.meta.url),'utf8'));
const missingVoices=currentVoices.clips.filter(({text})=>!audio.clips[text]);
const protectedVoiceTexts=JSON.parse(await readFile(new URL('../server/voice-required-v33.json',import.meta.url),'utf8'));
if(protectedVoiceTexts.some(text=>!audio.clips[text]))throw Error('Previously supplied Malay audio is missing. Restore the existing audio before publishing.');
const pending34=JSON.parse(await readFile(new URL('../server/voice-pending-v34.json',import.meta.url),'utf8'));
const knownPending=new Set(pending34.clips.map(c=>c.text));
if(missingVoices.some(c=>!knownPending.has(c.text)))throw Error('Unexpected missing audio; restore existing files before publishing.');
if(missingVoices.length)console.warn('V34 REVIEW BUILD: '+missingVoices.length+' new texts await bundled audio. Existing audio preserved; new texts use device Malay voice only when available. See SEMAKAN-SEBELUM-TERBIT-V34.txt.');
else console.log('All '+currentVoices.clips.length+' catalogue texts have bundled audio.');
