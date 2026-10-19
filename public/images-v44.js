(function(g){
'use strict';
// Audited exact mappings. Never guess an illustration from a word such as "mengutip".
const P=g.JoranPractice39,Q=g.JoranQuestions40,C=g.JoranClear37,L=g.JoranLesson;
const images=P.images,normalize=t=>String(t).normalize('NFC').replace(/\s+/g,' ').trim().replace(/[.!?]+$/,'').toLowerCase();
const groups={
 'story-belang':['b1','b2','b3','b4','b5','b6'],
 'story-pondok':['p1','p2','p3','p4','p5','p6'],
 'story-pokok':['k1','k2','k3','k4','k5','k6'],
 'story-sihat':['s1','s2','s3','s4','s5','s6'],
 'actions-pondok44':['pPick','pWipe','pRepair','pTeam','pCarry','pFind','pClean','pTrash','pDecor'],
 objects44:['hana','iman','tokwan','paper','water','pot','books','box','towel'],
 'actions-care44':['cTalk','cFood','cWater','cClean','cScared','cOverfeed','shoutFriend','cChase','cHideBowl'],
 'actions-extra44':['posterWash','posterCat','posterPlant','dirtyHands','openTap','foodGrass','cleanTable','tearPaper','pullBook'],
 'actions-diagnostic44':['wait','hideSchedule','underTable','hideBook','eatAlone','wipeShirt','dirtyEat','askWater','doDuty']
};
const alts={
 b1:'Hana memanggil Tok Wan untuk membantu anak kucing yang basah di jeti.',b2:'Hana mengambil tuala, Iman menyediakan peti dan Tok Wan mengeringkan anak kucing.',b3:'Hana bercakap dengan lembut dan Iman menyediakan air bersih untuk Belang.',b4:'Hana menyediakan makanan dan Iman menukar air Belang mengikut jadual.',b5:'Belang yang sihat bermain bersama Hana dan Iman di beranda.',b6:'Belang, seekor anak kucing belang yang sihat.',
 p1:'Hana mengemas pondok berdebu dan Iman mengutip buku di lantai.',p2:'Hana mengutip buku, Iman mengelap meja dan Tok Wan membaiki rak.',p3:'Hana berkongsi kertas berwarna dengan Iman di hadapan rak berlabel.',p4:'Hana menggantung hiasan dan Iman membuang sisa kertas.',p5:'Hana, Iman dan rakan membaca serta memulangkan buku ke rak.',p6:'Rak buku yang senget.',
 k1:'Hana menawarkan bantuan menjaga anak pokok yang layu akibat cuaca panas.',k2:'Tok Wan mengisi baldi dan Iman membantu Hana menyiram anak pokok.',k3:'Tok Wan menerangkan penjagaan pokok, Hana menulis label dan Iman melukis kad.',k4:'Hana menyediakan jadual dan Iman berjanji membantu Tok Wan setiap minggu.',k5:'Hana dan Iman mencatat perubahan pokok yang kembali segar.',k6:'Daun kering yang gugur di atas tanah.',
 s1:'Hana membasuh tangan sebelum menyediakan bekal bersama Iman dan Tok Wan.',s2:'Hana membasuh tangan dengan sabun dan Iman menunggu giliran.',s3:'Iman menutup bekas makanan dan Hana menyimpan baki bekal di atas tikar.',s4:'Hana dan Iman mengutip sampah sementara Tok Wan melipat tikar.',s5:'Hana, Iman dan Tok Wan berbual tentang poster membasuh tangan dalam perjalanan pulang.',s6:'Sebotol dan segelas air kosong.',
 pPick:'Hana mengutip buku di atas lantai.',pWipe:'Iman mengelap meja dengan kain.',pRepair:'Tok Wan membaiki rak buku.',pTeam:'Dua orang membahagikan tugas menyusun buku dan mengelap meja.',pCarry:'Iman membantu Hana meletakkan buku di atas meja.',pFind:'Buku disusun di rak berlabel supaya mudah dicari.',pClean:'Pondok bacaan yang bersih dan ceria.',pTrash:'Iman membuang sisa kertas ke dalam tong sampah.',pDecor:'Hana dan Iman menggantung hiasan di pondok.',
 hana:'Hana.',iman:'Iman.',tokwan:'Tok Wan.',paper:'Kertas berwarna.',water:'Baldi berisi air.',pot:'Pasu.',books:'Buku.',box:'Peti beralas kain lembut.',towel:'Tuala bersih.',
 cTalk:'Hana bercakap dengan lembut kepada anak kucing.',cFood:'Hana menyediakan makanan untuk Belang.',cWater:'Iman menukar air minuman Belang.',cClean:'Iman membersihkan peti Belang.',cScared:'Anak kucing yang takut dan menggigil.',cOverfeed:'Dua orang menambah makanan kucing secara berlebihan.',shoutFriend:'Seorang murid menjerit kepada rakannya.',cChase:'Seorang murid mengejar anak kucing.',cHideBowl:'Seorang murid menyembunyikan mangkuk air kucing.',
 posterWash:'Poster bergambar amalan membasuh tangan.',posterCat:'Poster bergambar penjagaan kucing.',posterPlant:'Poster bergambar menyiram pokok.',dirtyHands:'Tangan kotor selepas bermain.',openTap:'Paip terbuka dengan air terus mengalir.',foodGrass:'Makanan ditinggalkan di atas rumput.',cleanTable:'Semua ahli membahagikan tugas mengemas meja makan.',tearPaper:'Mengoyakkan kertas berwarna.',pullBook:'Dua orang menarik buku hingga koyak.',
 wait:'Menunggu sambil membiarkan kerja mengemas.',hideSchedule:'Menyembunyikan jadual tugas.',underTable:'Meninggalkan buku di bawah meja.',hideBook:'Menyembunyikan buku di dalam beg.',eatAlone:'Makan sendiri tanpa mempedulikan rakan.',wipeShirt:'Mengelap tangan kotor pada baju.',dirtyEat:'Mengambil makanan dengan tangan kotor.',askWater:'Meminta izin orang dewasa untuk menyiram pokok.',doDuty:'Menyemak jadual dan melaksanakan tugas menjaga pokok.'
};
for(const [sheet,ids]of Object.entries(groups))for(const [cell,id]of ids.entries())images[id]={src:'assets/v44/'+id+'.webp',alt:alts[id],sheet,cell,v44:true};
const pages={belang:['b1','b2','b3','b4','b5'],pondok:['p1','p2','p3','p4','p5'],pokok:['k1','k2','k3','k4','k5'],sihat:['s1','s2','s3','s4','s5']};
P.proofImages={belang:['b1','b2','b4'],pondok:['p1','pCarry','return'],pokok:['k1','k2','k4'],sihat:['s2','s4','s3']};
// Every current question retains its wording, answer index, score and audio key.
const replacements={
 'Untuk membantu anak kucing.':'b1','Supaya Belang selesa berehat.':'care7','Belang menjadi tenang.':'cTalk','Supaya Belang dijaga setiap hari.':'b4','Belang semakin sihat.':'b5',
 'Pondok itu berdebu.':'p1','Rak itu senget.':'p6','Kertas hendak dikongsi.':'p3','Supaya buku mudah dicari.':'pFind','Pondok menjadi bersih.':'pClean','Rakan lain mudah mencari buku.':'pFind',
 'Cuaca panas.':'k1','Supaya pesanan mudah diingati.':'k3','Supaya mereka ingat akan tugas.':'k4',
 'Mereka baru bermain.':'dirtyHands','Tempat berkelah menjadi bersih.':'s4','Mengingatkan orang menjaga kebersihan.':'posterWash',
 'tempat rehat':'box','makanan':'cFood','air minuman':'cWater','Belang':'b6','Hana':'hana','Iman':'iman','Tok Wan':'tokwan','lembut':'cTalk','kuat':'care4',
 'Menyediakan makanan Belang.':'cFood','Menukar air Belang.':'cWater','Membersihkan peti Belang.':'cClean','Bermain bersama Hana dan Iman.':'b5','Menggigil ketakutan.':'cScared','Meminta bantuan Tok Wan.':'b1',
 'mengelap meja':'pWipe','membaiki rak':'pRepair','berkongsi kertas':'p3','kertas berwarna':'paper','air':'water','Mengajak rakan membaca.':'p5',
 'Daun kering.':'k6','Buku.':'books','Makanan.':'health6','pasu':'pot','rak buku':'pFind','peti Belang':'box','Perubahan pokok.':'k5',
 'air kosong':'s6','buku':'books','baki bekal':'health2','daun':'k6','Poster membasuh tangan.':'posterWash','Poster menjaga kucing.':'posterCat','Poster menyiram pokok.':'posterPlant',
 'Seorang sediakan makanan, seorang tukar air.':'b4','Kedua-duanya tambah makanan berkali-kali.':'cOverfeed','Bergaduh tentang tugas.':'shoutFriend','Bersihkan tempat rehat.':'cClean','Bercakap dengan lembut.':'cTalk','Mengejarnya dengan pantas.':'cChase',
 'Sembunyikan buku di lantai.':'underTable','Tarik buku hingga koyak.':'pullBook','Ambil buku untuk diri sendiri sahaja.':'hideBook','Bahagikan tugas menyusun dan mengelap.':'pTeam','Koyakkan kertasnya.':'tearPaper','Jerit kepada kawan.':'shoutFriend','Tunjukkan rak yang betul.':'pFind','Marah kepadanya.':'shoutFriend',
 'Semak jadual setiap hari.':'doDuty','Makan sendiri tanpa peduli.':'eatAlone','Bahagikan tugas mengemas.':'cleanTable','Tinggalkan makanan di lantai.':'foodGrass','Biarkan air terus mengalir.':'openTap',
 'Kucing itu sahaja.':'b6','Jerit supaya dia mendekat.':'shoutFriend'
};
// Correct cross-story contexts without relying on vague word matching.
for(const key of Object.keys(pages))for(const q of [...Q.fishing[key],...Q.forStory(key,'pengukuhan'),...Q.forStory(key,'pengayaan')])for(const o of q.options)if(replacements[o.text])o.image=replacements[o.text];
// Alternative wrong-choice pictures also show the described action, not a similar topic.
const exact=Object.fromEntries(Object.keys(pages).map(k=>[k,new Map()]));
const add=(key,text,id)=>{if(!images[id])throw Error('Unknown audited picture '+id);exact[key].set(normalize(text),id);};
const sentences={
 belang:[['b1','b1','b1','b1'],['b2','b2','b2','b6'],['cScared','cTalk','cWater','b3'],['b4','cFood','cWater','b4'],['b5','b5','thanks','b5']],
 pondok:[['p1','p1','p1'],['p2','pCarry','pRepair'],['pFind','p3','pFind'],['pDecor','pTrash','pClean'],['p5','return','thanks']],
 pokok:[['k1','k1','k1'],['water','k2','k6'],['k3','k3','k3'],['k4','k4','doDuty'],['garden4','k5','thanks']],
 sihat:[['s1','s1','s1'],['dirtyHands','s2','s2'],['health6','s3','health2'],['s4','s4','s4'],['s5','posterWash','s5']]
};
const diagnostic={
 belang:[['cChase','cHideBowl','cWater'],['b4','alone','play'],['wait','cClean','hideSchedule']],
 pondok:[['books0','books','alone'],['underTable','hideBook','pFind'],['health5','pClean','books6']],
 pokok:[['garden3','askWater','garden2'],['thanks','wait','doDuty'],['garden7','shoutFriend','play']],
 sihat:[['wipeShirt','dirtyEat','health0'],['health4','health2','foodGrass'],['cleanTable','alone','run']]
};
const reflections={belang:['b4','pCarry','doDuty'],pondok:['pCarry','pFind','pTeam'],pokok:['k2','doDuty','k2'],sihat:['health0','s4','health2']};
for(const key of Object.keys(pages)){
 for(const [p,lines]of C.pages[key].entries())lines.forEach((text,i)=>add(key,text,sentences[key][p][i]));
 L.bankFor(key,40).forEach((b,i)=>add(key,b.action,P.proofImages[key][i]));
 L.diagnosticFor(key,40).forEach((q,i)=>q.options.forEach((text,j)=>add(key,text,diagnostic[key][i][j])));
 if(g.JoranInclusive36)g.JoranInclusive36.reflections[key].forEach((text,i)=>add(key,text,reflections[key][i]));
 for(const q of [...Q.fishing[key],...Object.values(Q.questions[key]).flat()])for(const o of q.options)add(key,o.text,o.image);
 for(const [text,id]of Object.entries(P.values))add(key,text,id);
 for(const [text,id]of Object.entries({'Saling membantu':key==='pokok'?'k2':'pCarry','Bekerja sendiri':'alone','Bermain sahaja':'play','Rajin membantu':'pTeam','Cepat berlari':'run','Suka berehat':'rest','Mencegah penyakit':'posterWash','Menunggu sakit':'sick','Mengabaikan diri':'neglect'}))add(key,text,id);
}
g.JoranImages44={version:44,images,pages,groups,normalize,sentences,diagnostic,reflections,
 lookup:(key,text)=>exact[key]?.get(normalize(text))||null,
 rows:()=>Object.entries(exact).flatMap(([story,map])=>[...map].map(([text,image])=>({story,text,image,alt:images[image].alt})))
};
})(globalThis);
