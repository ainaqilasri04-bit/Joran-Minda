import{readFile,stat}from'node:fs/promises';
const html=await readFile(new URL('../public/index.html',import.meta.url),'utf8');if(!html.includes('jm-entry-form')||!html.includes('jm-chat-form'))throw Error('Classroom UI missing');
for(const story of ['belang','pondok','pokok','sihat'])for(const page of ['cover',1,2,3,4,5])if((await stat(new URL('../public/assets/'+story+'-'+page+'.webp',import.meta.url))).size<32)throw Error('Empty asset: '+story+'-'+page);
console.log('Build checked: 4 stories, 20 page illustrations, 4 covers, registration and classroom features.');
if(/JoranHand\.mount|<script src="hand-control.js"|id="jm-hand-(?:open|panel|monitor)"/.test(html))throw Error('Removed camera feature is still mounted');
console.log('Click/touch fishing checked: camera controls and runtime absent.');

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

for(const version of [28,29,30,31,32,33,34,35,36,37,38]){const source=await readFile(new URL('lesson-v'+version+'.js',import.meta.url),'utf8');if(!html.includes(source.trim()))throw Error('V'+version+' UI not synchronized');}
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

const required37=JSON.parse(await readFile(new URL('../server/voice-required-v37.json',import.meta.url),'utf8'));
for(const text of required37)if(!audio.clips[text])throw Error('V37 exact audio missing: '+text);
for(const file of ['public/story-v37.js','public/clear37.css'])if((await stat(new URL('../'+file,import.meta.url))).size<100)throw Error('V37 file missing: '+file);
console.log('V37 checked: simplified stories, exact instruction audio and focused practice.');
const required38=JSON.parse(await readFile(new URL('../server/voice-required-v38.json',import.meta.url),'utf8'));
for(const text of required38)if(!audio.clips[text])throw Error('V38 exact audio missing: '+text);
for(const sheet of ['care','books','garden','health'])if((await stat(new URL('../public/assets/actions-'+sheet+'-v38.png',import.meta.url))).size<100000)throw Error('V38 image missing: '+sheet);
console.log('V38 checked: 4/5/6 picture exercises, exact home/practice/feedback audio and new action images.');

const required39=JSON.parse(await readFile(new URL('../server/voice-required-v39.json',import.meta.url),'utf8'));
for(const text of required39)if(!audio.clips[text])throw Error('V39 exact audio missing: '+text);
for(const file of ['practice-v39.js','picture39.css','report-template39.js'])if((await stat(new URL('../public/'+file,import.meta.url))).size<100)throw Error('V39 required file missing: '+file);
console.log('V39 checked: exact audio, matching and picture choices, separate Excel templates.');

const required40=JSON.parse(await readFile(new URL('../server/voice-required-v40.json',import.meta.url),'utf8'));
for(const text of required40)if(!audio.clips[text])throw Error('V40 exact audio missing: '+text);
for(const name of ['questions-v40.js','picture40.css','report-template40.js'])if(!html.includes(name))throw Error('V40 asset not loaded: '+name);
if(!html.includes((await readFile(new URL('lesson-v40.js',import.meta.url),'utf8')).trim()))throw Error('V40 UI not synchronized');
const questionsContext={};questionsContext.globalThis=questionsContext;
for(const file of ['questions-v34.js','story-engine.js','story-v37.js','lesson-core.js','practice-v38.js','practice-v39.js','questions-v40.js'])runInNewContext(await readFile(new URL('../public/'+file,import.meta.url),'utf8'),questionsContext);
for(const key of ['belang','pondok','pokok','sihat']){
 const q=questionsContext.JoranQuestions40,fish=q.fishing[key],reinforce=q.forStory(key,'pengukuhan'),enrich=q.forStory(key,'pengayaan');
 if(fish.length!==5||reinforce.length!==5||enrich.length!==6||q.forStory(key,'pemulihan').length!==4)throw Error('V40 question count wrong');
 const prompts=[...fish,...reinforce,...enrich].map(x=>x.prompt);if(new Set(prompts).size!==prompts.length)throw Error('Repeated V40 questions: '+key);
}
console.log('V40 checked: '+required40.length+' exact audio texts, distinct questions, visible-fish styles and two-sheet Excel export.');

const required41=JSON.parse(await readFile(new URL('../server/voice-required-v41.json',import.meta.url),'utf8'));
for(const text of required41)if(!audio.clips[text])throw Error('V41 exact audio missing: '+text);
for(const name of ['support-v41.js','support41.css','voice-required41.js'])if(!html.includes(name))throw Error('V41 support not loaded: '+name);
if(!html.includes((await readFile(new URL('lesson-v41.js',import.meta.url),'utf8')).trim()))throw Error('V41 UI not synchronized');
console.log('V41 checked: '+required41.length+' exact voice texts, teacher page audit.');

const required42=JSON.parse(await readFile(new URL('../server/voice-required-v42.json',import.meta.url),'utf8'));
for(const text of required42)if(!audio.clips[text])throw Error('V42 exact audio missing: '+text);
for(const name of ['support-v42.js','fishing43.css'])if(!html.includes(name))throw Error('V42 support not loaded: '+name);
if(!html.includes((await readFile(new URL('lesson-v42.js',import.meta.url),'utf8')).trim()))throw Error('V42 UI not synchronized');
console.log('V42 checked: '+required42.length+' exact voice texts, choice audio, focused outcome/certificate instructions and navigation.');

const required43=JSON.parse(await readFile(new URL('../server/voice-required-v43.json',import.meta.url),'utf8'));
for(const text of required43)if(!audio.clips[text])throw Error('V43 exact audio missing: '+text);
if(!html.includes('feedback-v43.js')||!html.includes((await readFile(new URL('lesson-v43.js',import.meta.url),'utf8')).trim()))throw Error('V43 feedback not synchronized');
console.log('V43 checked: '+required43.length+' active voice texts and separate value/proof feedback.');

const required44=JSON.parse(await readFile(new URL('../server/voice-required-v44.json',import.meta.url),'utf8'));
for(const text of required44)if(!audio.clips[text])throw Error('V44 exact audio missing: '+text);
for(const name of ['images-v44.js','images44.css'])if(!html.includes(name))throw Error('V44 pictures not loaded: '+name);
if(!html.includes((await readFile(new URL('lesson-v44.js',import.meta.url),'utf8')).trim()))throw Error('V44 UI not synchronized');
console.log('V44 checked: exact picture registry, story-picture integration and '+required44.length+' active voice texts.');

for(const version of [45,46])if(!html.includes((await readFile(new URL('lesson-v'+version+'.js',import.meta.url),'utf8')).trim()))throw Error('V'+version+' UI not synchronized');
for(const name of ['gallery46.js','refinements46.css'])if(!html.includes(name))throw Error('V46 support not loaded: '+name);
for(const name of ['public/galeri.html','public/galeri-view46.js','public/galeri46.css','public/fonts/Andika-Regular.woff2','netlify/functions/galeri.mjs','server/gallery-service.mjs'])if((await stat(new URL('../'+name,import.meta.url))).size<100)throw Error('V46 file missing: '+name);
const required46=JSON.parse(await readFile(new URL('../server/voice-required-v46.json',import.meta.url),'utf8'));
const expectedPending46=JSON.parse(await readFile(new URL('../server/audit-v46.json',import.meta.url),'utf8')).ai.missing;
const missing46=required46.filter(text=>!audio.clips[text]);
if(JSON.stringify(missing46)!==JSON.stringify(expectedPending46))throw Error('V46 audio audit differs from build');
console.log('V46 checked: gallery assets and UI. '+missing46.length+' new sharing texts await MP3. Existing 1480 texts retained.');
if(!html.includes((await readFile(new URL('lesson-v47.js',import.meta.url),'utf8')).trim())||!html.includes('sharing47.css'))throw Error('V47 upload page not synchronized');
console.log('V47 checked: a dedicated upload/share page between book review and reflection.');

if(!html.includes((await readFile(new URL('lesson-v48.js',import.meta.url),'utf8')).trim())||!html.includes('jm-download-pdf48'))throw Error('V48 PDF controls not synchronized');
console.log('V48 checked: PDF download on the sharing page, written status and Linktree reading destination.');

const required48=JSON.parse(await readFile(new URL('../server/voice-required-v48.json',import.meta.url),'utf8'));const missing48=required48.filter(t=>!audio.clips[t]);if(missing48.length!==2)throw Error('V48 pending audio count differs');console.log('V48 active audio: '+required48.length+' texts; '+missing48.length+' await MP3.');

if(!html.includes((await readFile(new URL('lesson-v49.js',import.meta.url),'utf8')).trim())||!html.includes('drive-config49.js')||!html.includes('drive49.css'))throw Error('V49 Drive flow not synchronized');
const required49=JSON.parse(await readFile(new URL('../server/voice-required-v49.json',import.meta.url),'utf8'));const missing49=required49.filter(t=>!audio.clips[t]);if(missing49.length!==0)throw Error('Active Google Drive audio missing');console.log('V51 checked: '+required49.length+' active AI texts have audio, including both imported Google Drive directions.');

const required52=JSON.parse(await readFile(new URL('../server/voice-required-v57.json',import.meta.url),'utf8')),missing52=required52.filter(text=>!audio.clips[text]);
const audit52=JSON.parse(await readFile(new URL('../server/audio-audit-v57.json',import.meta.url),'utf8'));
if(JSON.stringify(missing52)!==JSON.stringify(audit52.ai.missing))throw Error('V52 active audio inventory changed');
if(html.includes('jm-upload-approve52')||html.includes('jm-upload-gate52')||!html.includes('review52.css'))throw Error('V57 confirmation must be absent while review layout remains');
console.log('Current active audio checked: '+(required52.length-missing52.length)+' AI texts ready; '+missing52.length+' missing.');

const teacher53={window:{}};runInNewContext(await readFile(new URL('../public/suara-joran-minda.js',import.meta.url),'utf8'),teacher53);
const retired53=JSON.parse(await readFile(new URL('../server/retired-teacher-v53.json',import.meta.url),'utf8')).removedBundledTakes;
if(retired53.length!==20)throw Error('Expected exactly 20 known obsolete teacher recordings');
if(teacher53.window.JoranTeacherVoicePack.recordings.some(r=>retired53.some(old=>old.takeId===r.takeId)))throw Error('Obsolete teacher audio still bundled');
if(!html.includes((await readFile(new URL('lesson-v53.js',import.meta.url),'utf8')).trim()))throw Error('V53 recording controls not synchronized');
console.log('V53 checked: obsolete 20 removed, selected-take deletion and latest-only website export synchronized.');

const audit54=JSON.parse(await readFile(new URL('../server/audio-audit-v57.json',import.meta.url),'utf8'));
if(!html.includes('teacher-review54.js')||!html.includes((await readFile(new URL('lesson-v54.js',import.meta.url),'utf8')).trim()))throw Error('V54 import/review layer missing');
const bundled54=teacher53.window.JoranTeacherVoicePack.recordings;
if(bundled54.length!==audit54.teacher.ready||bundled54.length!==20)throw Error('V54 selected recording count differs');
for(const story of audit54.stories)for(const page of story.pages){const take=bundled54.find(r=>r.slot===story.key+':page'+page.page);if(page.ready?(!take||take.takeId!==page.takeId||take.text!==page.text):!!take)throw Error('V54 wrong selected page: '+story.key+' '+page.page);}
if(audit54.backup.decodeFailures!==0)throw Error('Uploaded audio decode failures unresolved');
console.log('Current teacher pack checked: all 20 pages ready; original uploaded audio bytes preserved.');

const import55=JSON.parse(await readFile(new URL('../server/audio-import-v55.json',import.meta.url),'utf8'));
if(audio.clips[import55.text]!==import55.path||missing52.length)throw Error('V55 confirmation audio or active AI coverage missing');
const {createHash:hash55}=await import('node:crypto');
if(hash55('sha256').update(await readFile(new URL('../public/'+import55.path,import.meta.url))).digest('hex')!==import55.sourceSha256)throw Error('V55 original audio bytes changed');
if(!html.includes((await readFile(new URL('lesson-v55.js',import.meta.url),'utf8')).trim()))throw Error('V55 UI version missing');
console.log('V55 checked: supplied confirmation MP3 preserved exactly; all '+required52.length+' active AI texts have audio.');

if(!html.includes('studio56.css')||!html.includes('audio-ms/export-hashes56.js')||!html.includes((await readFile(new URL('lesson-v56.js',import.meta.url),'utf8')).trim()))throw Error('V56 compact export or contrast layer missing');

if(!html.includes('mobile57.css')||!html.includes((await readFile(new URL('lesson-v57.js',import.meta.url),'utf8')).trim()))throw Error('V57 responsive layer missing');
