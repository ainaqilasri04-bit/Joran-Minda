import {readFile,writeFile} from 'node:fs/promises';import {createHash} from 'node:crypto';import {runInNewContext} from 'node:vm';
import '../public/questions-v34.js';import '../public/story-engine.js';import '../public/story-v37.js';import '../public/lesson-core.js';import '../public/inclusive36.js';
const root=new URL('../',import.meta.url),read=p=>readFile(new URL(p,root),'utf8'),ctx={window:{}};runInNewContext(await read('public/audio-ms/manifest.js'),ctx);const manifest=ctx.window.JoranMalayAudio,U=JoranInclusive36;
const src=await read('public/index.html'),stories=JSON.parse(src.match(/const stories=(\{[^\n]+\});/)[1]);
const all=['Baca ayat pilihan kamu. Tekan Simpan penjelasan.','Tahniah! Semua jawapan tepat.','Ada jawapan yang belum tepat. Mari semak.','Jawapan yang betul:'];
for(const key of JoranStory.keys){const bank=JoranLesson.bankFor(key,37);for(const [i,b]of bank.entries()){
 all.push(U.proofQuestions[key][i]+' Pilih satu ayat.',b.action+' Apakah nilai yang ditunjukkan? Pilih satu jawapan.',b.action+' Apakah nilai yang sepadan? Pilih satu jawapan.',b.action+' Nilainya ialah '+b.value.toLowerCase()+'.',b.value,b.action);
 if(i<2)all.push('Perbuatan manakah yang menunjukkan nilai '+b.value.toLowerCase()+'? Pilih satu gambar.');
 for(const action of bank)all.push(U.sentence(b.value,action.action));
 }
 for(let page=0;page<5;page++){const d=JoranStory.lessonMake(key,page,37);all.push(U.findQuestions[key][page]+' Pilih satu ayat.',U.fishingQuestions[key][page]+' Pilih satu nilai.',U.fishingQuestions[key][page]+' Pilih ikan, kemudian tekan Pancing ikan ini.',d.sentences[d.evidence]);for(const label of d.labels)all.push(U.sentence(label,d.sentences[d.evidence]));}
 const bonus='Apakah maksud peribahasa '+stories[key].bonus+'?';all.push(bonus+' Pilih satu jawapan.',bonus+' Pilih ikan, kemudian tekan Pancing ikan ini.');
 for(const q of JoranLesson.diagnosticFor(key,37))all.push('Jawab sendiri dahulu. '+q.prompt+' Pilih satu jawapan.');
 for(const q of JoranLesson.practiceFor(key))all.push(q.prompt+' Pilih satu jawapan.',...q.options);
 const e=JoranClear37.enrichment[key];for(const q of e.questions)all.push(e.context+' '+q.prompt+' Pilih satu jawapan.',...q.options);
}
const unique=[...new Set(all)],clips=unique.filter(text=>!manifest.clips[text]).map(text=>({id:'v37-'+createHash('sha256').update(text).digest('hex').slice(0,12),text}));
await writeFile(new URL('server/voice-new-v37.json',root),JSON.stringify({version:37,clips},null,2)+'\n');
await writeFile(new URL('server/voice-required-v37.json',root),JSON.stringify(unique,null,2)+'\n');console.log({newClips:clips.length,required:unique.length});
