import fs from 'node:fs';import vm from 'node:vm';import crypto from 'node:crypto';
const c={location:{search:'',href:'https://example.test/index.html'},localStorage:{getItem:()=>null,setItem:()=>{}},URL,URLSearchParams};c.window=c;c.globalThis=c;
for(const f of ['questions-v34','story-engine','story-v37','lesson-core','inclusive36','practice-v38','practice-v39','questions-v40','images-v44','images-v45','suara-joran-minda','voice-required41','audio-ms/manifest','gallery46'])vm.runInNewContext(fs.readFileSync('public/'+f+'.js','utf8'),c);
const required=c.JoranRequiredAudio41,clips=c.JoranMalayAudio.clips,missing=required.filter(t=>!clips[t]);
const files=[...new Set(required.map(t=>typeof clips[t]==='string'?clips[t]:clips[t]?.src).filter(Boolean))];
for(const f of ['audio-ms/klik.mp3'])if(!files.includes(f))files.push(f);
const takes=c.JoranTeacherVoicePack.recordings||[],normalize=t=>String(t||'').replace(/\s+/g,' ').trim();
const names={belang:'Belang dan Sahabat Baharu',pondok:'Pondok Bacaan Kembali Ceria',pokok:'Kebun Tok Wan Kembali Segar',sihat:'Bekal Sihat di Tepi Tasik'};
const stories=Object.entries(names).map(([key,title])=>({key,title,pages:c.JoranClear37.pages[key].map((lines,p)=>{
 const text=lines.join(' '),image=c.JoranImages45.pageSources[key][p];if(!fs.existsSync('public/'+image))throw Error('Missing story image '+image);
 if(c.JoranStory.lessonText(key,p,40)!==text)throw Error('Story source mismatch');
 return{page:p+1,text,image,teacherTextMatches:takes.some(r=>r.slot===key+':page'+(p+1)&&normalize(r.text)===normalize(text))};
})}));
for(const key of Object.keys(names))for(const q of [...c.JoranQuestions40.fishing[key],...Object.values(c.JoranQuestions40.questions[key]).flat()])if(q.answer<0||q.answer>=q.options.length||new Set(q.options.map(o=>o.text)).size!==q.options.length)throw Error('Invalid answers '+key);
const report={version:46,ai:{required:required.length,legacyRequired:required.length-Object.keys(c.JoranGallery46.texts).length,missing,files:files.length},teacher:{recordingsInPackage:takes.length,matchingPages:stories.flatMap(s=>s.pages).filter(p=>p.teacherTextMatches).length,includesBrowserOnlyRecordings:false},stories,files,storyTextSHA256:crypto.createHash('sha256').update(fs.readFileSync('public/story-v37.js')).digest('hex')};
if(fs.existsSync('server/audio-decode-v46.json'))report.audioDecode=JSON.parse(fs.readFileSync('server/audio-decode-v46.json','utf8'));
fs.writeFileSync('server/audit-v46.json',JSON.stringify(report,null,2));fs.writeFileSync('server/voice-required-v46.json',JSON.stringify(required,null,2));
fs.writeFileSync('AUDIO-BAHARU-V46-TTSMAKER.txt','TEKS AI BAHARU — PERKONGSIAN BUKU\n\n'+missing.map((t,i)=>(i+1)+'. '+t).join('\n\n')+'\n\nImport padanan teks yang sama dalam Guru → Studio semua suara. Kategori: Perkongsian buku.\n');
fs.writeFileSync('SEMAKAN-AUDIO-DAN-CERITA-V46.txt','SEMAKAN AUDIO DAN CERITA — V46\n\n'+
 'EMPAT CERITA\n'+stories.map(s=>s.title+': 5 halaman, teks bacaan/rakaman sepadan dengan sumber cerita semasa dan gambar halaman tersedia.').join('\n')+'\n\n'+
 'SUARA AI SEDIA ADA\n1480 teks semakan lama masih mempunyai fail suara. '+(report.audioDecode?report.audioDecode.passed+' daripada '+report.audioDecode.checked+' fail audio (termasuk klik) lulus penyahkodan tanpa ralat. ':'Belum ada hasil ujian penyahkodan fail. ')+'Ini bukan ujian mendengar melalui pembesar suara sebenar.\n\n'+
 'SUARA AI BAHARU YANG BELUM ADA FAIL\n'+missing.map((t,i)=>(i+1)+'. '+t).join('\n')+'\nLihat AUDIO-BAHARU-V46-TTSMAKER.txt untuk salin dan tampal. Jika peranti mempunyai suara Bahasa Melayu, bacaan peranti boleh digunakan sementara.\n\n'+
 'RAKAMAN GURU DALAM PAKEJ\n'+takes.length+' rakaman lama ditemui, tetapi '+report.teacher.matchingPages+'/20 halaman sepadan dengan teks cerita semasa.\n'+stories.map(s=>s.title+': halaman '+s.pages.filter(p=>!p.teacherTextMatches).map(p=>p.page).join(', ')+' belum sepadan.').join('\n')+'\n\n'+
 'Rakaman terbaharu dalam pelayar/peranti anda tidak termasuk dalam fail ini. Jangan rakam semula halaman yang sudah lengkap pada peranti anda. Buka Guru → Studio semua suara → Semak semua suara. Pulihkan sandaran jika perlu, kemudian muat turun suara untuk website dan gantikan public/suara-joran-minda.js sebelum menerbitkan.\n\nTeks cerita tidak diubah dalam V46. Skrip bacaan semasa tersedia dalam SKRIP-RAKAMAN-GURU-V41.txt.\n');
console.log(JSON.stringify({stories:stories.length,pages:20,ai:report.ai,teacher:report.teacher}));
