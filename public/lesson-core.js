(function(g){
'use strict';
const phases=[['Set induksi',5,'Puzzle gambar dan kongsi idea'],['Aktiviti 1',15,'Baca dan cari nilai'],['Aktiviti 2',25,'Pancing dan terangkan'],['Aktiviti 3',10,'Latihan mengikut keperluan'],['Penutup',5,'Refleksi dan pencapaian']];
const bank={
 belang:[
  {page:0,action:'Hana memanggil Tok Wan untuk membantu anak kucing.',value:'Kasih sayang',options:['Keberanian','Kasih sayang','Kejujuran'],answer:1},
  {page:1,action:'Hana mengambil tuala, manakala Iman menyediakan tempat rehat Belang.',value:'Kerjasama',options:['Kerjasama','Kesederhanaan','Keberanian'],answer:0},
  {page:3,action:'Hana dan Iman melaksanakan tugas menjaga Belang setiap hari.',value:'Tanggungjawab',options:['Kejujuran','Kesederhanaan','Tanggungjawab'],answer:2}
 ],
 pondok:[
  {page:0,action:'Hana menawarkan diri untuk mengemas pondok yang berdebu.',value:'Kerajinan',options:['Keberanian','Kerajinan','Kejujuran'],answer:1},
  {page:1,action:'Iman membantu Hana meletakkan buku di atas meja yang bersih.',value:'Kerjasama',options:['Kerjasama','Kesederhanaan','Keberanian'],answer:0},
  {page:4,action:'Semua pembaca memulangkan buku ke rak setelah selesai membaca.',value:'Tanggungjawab',options:['Kejujuran','Kesederhanaan','Tanggungjawab'],answer:2}
 ],
 pokok:[
  {page:0,action:'Hana menawarkan bantuan untuk menjaga anak pokok yang layu.',value:'Baik hati',options:['Keberanian','Baik hati','Kejujuran'],answer:1},
  {page:1,action:'Iman membantu Hana menyiram anak pokok dengan cermat.',value:'Kerjasama',options:['Kerjasama','Kesederhanaan','Keberanian'],answer:0},
  {page:3,action:'Iman berjanji untuk membantu Tok Wan menjaga kebun setiap minggu.',value:'Tanggungjawab',options:['Kejujuran','Kesederhanaan','Tanggungjawab'],answer:2}
 ],
 sihat:[
  {page:1,action:'Hana dan Iman membasuh tangan dengan sabun sebelum makan.',value:'Kebersihan',options:['Keberanian','Kebersihan','Kejujuran'],answer:1},
  {page:3,action:'Hana mengajak Iman mengumpulkan sampah sebelum pulang.',value:'Kerjasama',options:['Kerjasama','Kesederhanaan','Keberanian'],answer:0},
  {page:2,action:'Mereka menyimpan baki bekal untuk dibawa pulang.',value:'Berjimat cermat',options:['Kejujuran','Keberanian','Berjimat cermat'],answer:2}
 ]};
const quotes={
 belang:['Hana segera memanggil Tok Wan untuk membantu anak kucing itu.','Hana mengambil tuala bersih, manakala Iman menyediakan peti beralas kain lembut.','Mereka melaksanakan tugas masing-masing setiap hari.'],
 pondok:['Hana menawarkan diri untuk mengemas pondok yang berdebu itu.','Iman membantu Hana meletakkan buku di atas meja yang bersih.','Semua pembaca memulangkan buku ke rak setelah selesai membaca.'],
 pokok:['Hana segera menawarkan bantuan untuk menjaga anak pokok itu.','Iman membantu Hana menyiram anak pokok dengan cermat.','Iman berjanji untuk membantu Tok Wan menjaga kebun setiap minggu.'],
 sihat:['membasuh tangan dengan sabun sebelum makan.','Hana mengajak Iman mengumpulkan sampah supaya tempat berkelah kekal bersih.','mereka menyimpan baki bekal untuk dibawa pulang.']
};
for(const [key,items] of Object.entries(bank))items.forEach((item,i)=>item.quote=quotes[key][i]);
function bankFor(story,version=0){
 return version>=34?bank[story].map((item,i)=>{const options=g.JoranQuestions34.identification[story][i];return {...item,options,answer:options.indexOf(item.value)};}):bank[story];
}
function diagnosticFor(story,version=0){return version>=34?g.JoranQuestions34.diagnostic[story]:bank[story];}
function practiceFor(story){return g.JoranQuestions34.reinforcement[story];}
const routes={pemulihan:'Mari cuba dengan bantuan',pengukuhan:'Mari kukuhkan kefahaman',pengayaan:'Mari cipta idea baharu'};
function assess(events=[],story='belang',{version=0,members=[]}={}){
 const items=bankFor(story,version);
 const es=events.filter(e=>String(e.type||'').startsWith('lesson-')).slice().sort((a,b)=>(a.at||0)-(b.at||0));
 const last=t=>es.filter(e=>e.type==='lesson-'+t).at(-1);
 const induction=last('induction'),readPages=[...new Set(es.filter(e=>e.type==='lesson-read').map(e=>e.page))];
 const checks=[0,1,2].map(i=>es.filter(e=>e.type==='lesson-check'&&e.index===i).at(-1));
 const combined=checks.every(Boolean)?{type:'lesson-values',answers:checks.map(e=>e.answer),evidence:checks.map(e=>e.evidence),evidenceCorrect:checks.map(e=>e.evidenceCorrect),at:Math.max(...checks.map(e=>e.at||0))}:null;
 const identifications=es.filter(e=>e.type==='lesson-values'),identification=combined||identifications.at(-1),first=combined||identifications[0];
 const score=e=>e?.activity==='matching'?e.matches.reduce((n,x,i)=>n+Number(x===i),0):(e?.answers?.reduce((n,x,i)=>n+Number(x===items[i].answer),0)||0);
 const explanations=[0,1].map(index=>es.filter(e=>e.type==='lesson-explain'&&e.index===index).at(-1)||null);
 const grades=explanations.map((e,index)=>e?es.filter(x=>x.type==='lesson-grade'&&x.index===index&&x.text===e.text&&x.value===e.value).at(-1)||null:null);
 let route=last('route')?.route||null,practice=es.filter(e=>e.type==='lesson-practice'&&e.route===route).at(-1)||null;
 const personal=version>=29||es.some(e=>e.version>=29),diagnostics=members.map(m=>es.filter(e=>e.type==='lesson-diagnostic'&&e.subjectId===m.id).at(-1)||null);
 const personalRoutes=Object.fromEntries(members.map((m,i)=>[m.id,diagnostics[i]?.route||es.filter(e=>e.type==='lesson-practice'&&e.subjectId===m.id).at(-1)?.route||null]));
 const ready=!!induction&&readPages.length===5&&!!identification,explained=explanations.every(Boolean);
 const modern=version>=28||es.some(e=>e.version>=28);
 const practices=modern?members.map(m=>es.filter(e=>e.type==='lesson-practice'&&e.route===(personal?personalRoutes[m.id]:route)&&e.subjectId===m.id).at(-1)||null):[practice];
 const currentMember=members.find((m,i)=>!practices[i])||members[0];
 if(personal){route=personalRoutes[currentMember?.id]||null;practice=practices[members.indexOf(currentMember)]||null;}
 const practiced=modern?practices.length>0&&practices.every(Boolean):!!practice&&(route==='pengayaan'?!!practice.text:practice.correct===(route==='pemulihan'?3:2));
 const corrected=modern?(practiced&&practices.every(e=>e.version<38&&e.route==='pemulihan'&&e.correct===3)):practice?.route==='pemulihan'&&practiced&&practice.at>=(identification?.at||0);
 const correct=score(corrected?practice:identification),firstCorrect=score(first),explainedCorrect=explanations.filter((e,i)=>grades[i]?grades[i].correct===true:modern&&e?.guidedCorrect===true).length,graded=explanations.filter((e,i)=>grades[i]||modern&&typeof e?.guidedCorrect==='boolean').length;
 return {version:Math.max(version,personal?29:modern?28:version),checks,diagnostics,personalRoutes,currentMember,members:members.map(m=>({id:m.id,name:m.name})),practices,events:es,puzzle:last('puzzle'),induction,readPages,identification,correct,firstCorrect,explanations,grades,explainedCorrect,graded,ready,explained,route,practice,practiced,complete:ready&&explained&&practiced,
  recommended:firstCorrect<3?'pemulihan':'pengukuhan',
  objective1:!identification?'Belum dijawab':correct>=3?(corrected?'Kriteria 1 dicapai dengan bimbingan':'Kriteria 1 dicapai'):'Perlu bimbingan',
  objective2:!explained?'Belum lengkap':graded<2?'Menunggu semakan Guru':explainedCorrect>=2?(grades.every(Boolean)?'Kriteria 2 dicapai · disemak Guru':'Kriteria 2 dicapai · ayat berpandu'):'Perlu bimbingan'};
}
function validate(story,events,body,coreComplete=false,{version=24,members=[]}={}){
 const items=bankFor(story,version);
 const a=assess(events,story,{version,members}),type=body.type,event={type,...(version>=28?{version}:{})};
 const fail=message=>({error:message});
 const text=v=>typeof v==='string'?v.trim().slice(0,600):'';
 const choices=(v,n)=>Array.isArray(v)&&v.length===n&&v.every(x=>Number.isInteger(x)&&x>=0&&x<=2);
 if(type==='lesson-puzzle'){
  if(!Array.isArray(body.layout)||body.layout.length!==6||body.layout.some((n,i)=>n!==i))return fail('Susun keenam-enam keping gambar sehingga lengkap.');
  event.layout=[0,1,2,3,4,5];event.helped=body.helped===true;
 }else if(type==='lesson-induction'){
  if(version>=25&&!a.puzzle)return fail('Lengkapkan puzzle gambar dahulu.');
  if(![0,1,2].includes(body.choice))return fail('Pilih satu jawapan untuk set induksi.');event.choice=body.choice;
 }else if(type==='lesson-read'){
  if(!a.induction)return fail('Lengkapkan set induksi dahulu.');
  if(!Number.isInteger(body.page)||body.page<0||body.page>4)return fail('Muka surat tidak sah.');event.page=body.page;
 }else if(type==='lesson-check'&&version>=29){
  if(a.readPages.length!==5)return fail('Baca kelima-lima halaman dahulu.');
  if(![0,1,2].includes(body.index)||![0,1,2].includes(body.answer))return fail('Pilih satu nilai.');
  if(a.checks[body.index])return fail('Jawapan ini telah disimpan. Teruskan ke soalan berikutnya.');
  const page=globalThis.JoranStory.lessonMake(story,items[body.index].page,version);
  if(!Number.isInteger(body.evidence)||body.evidence<0||body.evidence>=page.sentences.length)return fail('Pilih ayat bukti.');
  event.index=body.index;event.answer=body.answer;event.evidence=body.evidence;event.evidenceCorrect=page.sentences[body.evidence].includes(items[body.index].quote);
 }else if(type==='lesson-values'){
  if(version>=29)return fail('Simpan setiap soalan mengikut giliran penyumbang.');
  if(a.readPages.length!==5)return fail('Baca kelima-lima muka surat dahulu.');
  if(!choices(body.answers,3))return fail('Jawab ketiga-tiga soalan nilai murni.');event.answers=body.answers.slice();
  if(version>=25){const expected=items.map(x=>globalThis.JoranStory.lessonMake(story,x.page,version).sentences.findIndex(t=>t.includes(x.quote)));if(!Array.isArray(body.evidence)||body.evidence.length!==3||body.evidence.some((x,i)=>version>=28?(!Number.isInteger(x)||x<0||x>3):x!==expected[i]))return fail('Semak semula ayat perbuatan watak pada langkah Ca.');event.evidence=body.evidence.slice();event.evidenceCorrect=expected.map((x,i)=>x===body.evidence[i]);}
 }else if(type==='lesson-explain'){
  if(!a.ready||!coreComplete)return fail('Lengkapkan Aktiviti 1 dan permainan Aktiviti 2 dahulu.');
  if(![0,1].includes(body.index)||!items.some(x=>x.value===body.value)||!text(body.text))return fail('Pilih nilai dan tulis penjelasan kamu.');
  if(a.explanations[1-body.index]?.value===body.value)return fail('Nilai ini sudah digunakan. Pilih satu lagi nilai untuk penjelasan ini.');
  if(version>=39&&body.value!==items[body.index].value)return fail('Nilai mesti sepadan dengan soalan penerangan.');
  event.index=body.index;event.value=body.value;event.text=text(body.text);
  if(version>=28){if(![0,1,2].includes(body.proofIndex))return fail('Pilih perbuatan watak untuk melengkapkan ayat berpandu.');event.proofIndex=body.proofIndex;event.guidedCorrect=items[body.proofIndex].value===body.value;event.guidedText='Nilai '+body.value.toLowerCase()+' ditunjukkan melalui perbuatan berikut: '+items[body.proofIndex].action;}
 }else if(type==='lesson-diagnostic'&&version>=29){
  if(!a.explained||!coreComplete)return fail('Lengkapkan Aktiviti 2 dahulu.');
  const subject=members.find(m=>m.id===body.subjectId);
  if(!subject||a.currentMember?.id!==subject.id)return fail('Ikut giliran ahli yang dipaparkan.');
  if(a.diagnostics.some(e=>e?.subjectId===subject.id))return fail('Semakan awal telah disimpan. Lengkapkan latihan kamu.');
  if(!choices(body.answers,3))return fail('Lengkapkan tiga soalan semakan awal.');
  event.subjectId=subject.id;event.subjectName=subject.name;event.answers=body.answers.slice();event.correct=diagnosticFor(story,version).reduce((n,x,i)=>n+Number(x.answer===body.answers[i]),0);
  event.route=event.correct<2?'pemulihan':event.correct===2?'pengukuhan':'pengayaan';
 }else if(type==='lesson-route'){
  if(version>=29)return fail('Laluan ditentukan oleh semakan awal setiap murid.');
  if(!a.explained||!coreComplete)return fail('Hantar kedua-dua penjelasan dahulu.');
  if(!routes[body.route])return fail('Pilih latihan yang sah.');event.route=body.route;
 }else if(type==='lesson-practice'){
  if(!a.route||!coreComplete)return fail('Pilih latihan Aktiviti 3 dahulu.');event.route=a.route;
  if(version>=28){const subject=members.find(m=>m.id===body.subjectId);if(!subject||version>=29&&a.currentMember?.id!==subject.id)return fail('Pilih ahli yang sedang menyumbang.');event.subjectId=subject.id;event.subjectName=subject.name;}
  if(version>=38){
   if(a.practices.some(e=>e?.subjectId===body.subjectId))return fail('Latihan ini telah disimpan. Teruskan ke tugasan berikutnya.');
   const qs=(version>=40?g.JoranQuestions40:version>=39?g.JoranPractice39:g.JoranPractice38).forStory(story,a.route),n=qs.length;
   if(!Array.isArray(body.answers)||body.answers.length!==n||body.answers.some((v,i)=>!Number.isInteger(v)||v<0||v>=qs[i].options.length))return fail('Lengkapkan kesemua '+n+' soalan latihan ini.');
   if(version>=39&&a.route==='pemulihan'&&new Set(body.answers).size!==n)return fail('Gunakan setiap gambar sekali sahaja.');
   event.activity=a.route==='pemulihan'?(version>=39?'matching-pictures':'word-picture'):a.route==='pengayaan'?(version>=39?'reasoning':'transfer'):'comprehension';
   event.answers=body.answers.slice();event.total=n;event.correct=qs.reduce((sum,q,i)=>sum+Number(body.answers[i]===q.answer),0);
   event.items=qs.map((q,i)=>({question:q.prompt,selected:q.options[body.answers[i]].text,expected:q.options[q.answer].text,correct:body.answers[i]===q.answer}));
   event.text=event.items.map((x,i)=>(i+1)+'. '+x.selected).join(' ');
  }else if(a.route==='pengayaan'){
   if(version>=37){if(!choices(body.answers,2))return fail('Jawab kedua-dua soalan pengayaan.');const qs=g.JoranClear37.enrichment[story].questions;event.activity='scenario';event.answers=body.answers.slice();event.correct=qs.reduce((n,q,i)=>n+Number(q.answer===body.answers[i]),0);event.application=qs[0].options[body.answers[0]];event.text=qs[1].options[body.answers[1]];}else if(!text(body.text)||!text(body.application))return fail('Tulis tindakan watak dan nilai yang ditunjukkan.');if(version<37){event.text=text(body.text);event.application=text(body.application);}
  }else if(a.route==='pemulihan'&&body.activity==='matching'&&version>=29){
   if(!choices(body.matches,3)||new Set(body.matches).size!==3)return fail('Padankan ketiga-tiga perbuatan dengan tiga nilai yang berlainan.');
   if(!text(body.text))return fail('Lengkapkan ayat ringkas dengan bantuan kata kunci.');
   event.activity='matching';event.matches=body.matches.slice();event.correct=event.matches.reduce((n,x,i)=>n+Number(x===i),0);event.text=text(body.text);
  }else{
   const n=a.route==='pemulihan'?3:2;if(!choices(body.answers,n))return fail('Lengkapkan semua pilihan jawapan.');event.answers=body.answers.slice();
   const key=a.route==='pemulihan'?items.map(x=>x.answer):version>=34?practiceFor(story).map(x=>x.answer):[0,1];event.correct=key.reduce((n,k,i)=>n+Number(k===body.answers[i]),0);
   if(!text(body.text))return fail('Tulis penjelasan ringkas. Kata kunci juga diterima.');event.text=text(body.text);
  }
 }else return fail('Aktiviti PdP tidak sah.');
 return {event};
}
function points(lesson,achievement){
 const t=achievement?.tasks||[],done=id=>t.find(x=>x.id===id)?.done||0;
 const game=done('read')+done('proof')*2+done('written')+done('choices')*2+Number(done('proverb')===2)*5;
 const rows=[
  {label:'Set induksi',points:lesson.induction?5:0,max:5},
  {label:'Aktiviti 1 · bacaan dan tiga jawapan',points:lesson.readPages.length+(lesson.identification?15:0),max:20},
  {label:'Aktiviti 2 · permainan dan dua penjelasan',points:game+lesson.explanations.filter(Boolean).length*5,max:45},
  {label:'Aktiviti 3 · latihan susulan',points:lesson.practiced?20:0,max:20},
  {label:'Penutup · semakan buku dan refleksi',points:done('review')+Number(done('reflection')===1)*5,max:10}
 ];
 if(lesson.version>=28){
  const firstValues=lesson.version>=29?lesson.identification:lesson.events.find(e=>e.type==='lesson-values'),evidenceWrong=firstValues?.evidenceCorrect?.filter(x=>!x).length||0,valueWrong=firstValues?3-lesson.firstCorrect:0;
  const practiceErrors=lesson.practices.reduce((n,e)=>n+(e&&(e.route!=='pengayaan'||e.version>=37)?Math.max(0,(e.version>=38?e.total:(e.route==='pemulihan'?3:2))-e.correct):0),0);
  rows[3].points=lesson.practices.length?20*lesson.practices.filter(Boolean).length/lesson.practices.length:0;
  const deductions=[0,(evidenceWrong+valueWrong)*2,(achievement?.errors||0)*2+lesson.explanations.filter(e=>e&&e.guidedCorrect===false).length*2,practiceErrors*2,0];
  rows.forEach((r,i)=>{r.earned=r.points;r.deduction=Math.min(r.points,deductions[i]);r.points-=r.deduction;});
 }return {rows,total:rows.reduce((n,r)=>n+r.points,0),deduction:rows.reduce((n,r)=>n+(r.deduction||0),0)};
}
g.JoranLesson={phases,bank,bankFor,diagnosticFor,practiceFor,routes,assess,validate,points,version:34};
})(globalThis);
