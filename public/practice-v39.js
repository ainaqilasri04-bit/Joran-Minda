(function(g){
'use strict';
const P=g.JoranPractice38,images={...P.images};
const extra=[['sweep','Hana mengemas pondok yang berdebu.'],['carry','Iman membantu Hana meletakkan buku di atas meja.'],['return','Memulangkan buku ke rak.'],['honest','Menyerahkan dompet yang ditemukan kepada guru.'],['respect','Mendengar orang yang lebih tua dengan sopan.'],['moderate','Mengambil makanan secukupnya.'],['save','Menutup paip selepas digunakan.'],['complete','Murid mempamerkan buku cerita yang siap.'],['hut','Pondok bacaan di taman.']];
const story=[['call','Hana memanggil Tok Wan untuk membantu anak kucing.'],['bed','Hana mengambil tuala dan Iman menyediakan tempat rehat.'],['duties','Melaksanakan tugas menjaga kucing mengikut jadual.'],['offer','Hana menawarkan bantuan menjaga anak pokok.'],['water','Iman membantu Hana menyiram pokok.'],['promise','Iman berjanji menjaga kebun setiap minggu.'],['brave','Berani meminta bantuan guru.'],['thanks','Tok Wan memuji usaha anak-anak.'],['wise','Memahami nasihat tentang mencegah penyakit.']];
for(const [sheet,list]of [['actions',extra],['story',story]])list.forEach(([id,alt],cell)=>{images[id]={sheet,cell,alt,v39:true};});
const choices=[['alone','Bekerja seorang diri.'],['play','Bermain bola.'],['run','Berlari dengan pantas.'],['rest','Berehat di bangku.'],['sick','Seorang anak yang kurang sihat.'],['neglect','Tidak menjaga kebersihan diri.'],['wash','Hana dan Iman membasuh tangan dengan sabun.'],['read','Membaca buku bersama-sama.'],['scene','Pemandangan pondok bacaan.']];
choices.forEach(([id,alt],cell)=>{images[id]={sheet:'choices',cell,alt,v39:true};});
const proofImages={belang:['call','bed','duties'],pondok:['sweep','carry','return'],pokok:['offer','water','promise'],sihat:['wash','health3','health2']};
const proofPrompts={belang:['Hana menunjukkan kasih sayang kepada anak kucing yang basah. Siapakah yang dipanggilnya untuk membantu?','Hana dan Iman bekerjasama menyediakan tempat rehat Belang. Apakah tugas mereka?'],pondok:['Hana menunjukkan kerajinan apabila melihat pondok berdebu. Apakah yang dilakukannya?','Iman bekerjasama dengan Hana untuk memindahkan buku. Apakah yang dilakukannya?'],pokok:['Hana bersikap baik hati apabila melihat anak pokok layu. Apakah yang ditawarkannya?','Iman bekerjasama dengan Hana untuk memberi air kepada pokok. Apakah yang dilakukannya?'],sihat:['Hana dan Iman menjaga kebersihan sebelum makan. Apakah yang mereka lakukan?','Hana dan Iman bekerjasama sebelum pulang. Apakah yang mereka kumpulkan?']};
const values={'Kasih sayang':'care3','Kejujuran':'honest','Berjimat cermat':'save','Kerjasama':'carry','Hormat-menghormati':'respect','Keberanian':'brave','Tanggungjawab':'duties','Kesederhanaan':'moderate','Kebersihan':'health0','Kerajinan':'sweep','Baik hati':'health6','Menghargai jasa':'thanks','Kebijaksanaan':'wise'};
const words={belang:[['Membelai','care3'],['Memberi air','care1'],['Memberi makanan','care0'],['Membersihkan','care2']],pondok:[['Menyapu','sweep'],['Memulangkan','return'],['Mengoyakkan','books1'],['Membaiki','books8']],pokok:[['Menyiram','garden0'],['Memetik','garden2'],['Memindahkan','garden5'],['Mendengar','respect']],sihat:[['Membasuh','health0'],['Menutup','health1'],['Berkongsi','health6'],['Mengutip','health3']]};
const questions={};
const O=(image,text)=>({image,text});
const Q=(prompt,options,answer)=>({prompt,options,answer});
for(const key of Object.keys(words)){
 const options=[2,0,3,1].map(i=>O(words[key][i][1],words[key][i][0]));
 questions[key]={pemulihan:words[key].map(([word,image])=>({word,prompt:'Suaikan perkataan '+word.toLowerCase()+' dengan gambar.',options,answer:options.findIndex(o=>o.image===image)})),pengukuhan:P.forStory(key,'pengukuhan'),pengayaan:[]};
}
questions.belang.pengayaan=[
 Q('Mengapakah kita perlu menyentuh anak kucing dengan lembut?',[O('care3','Supaya anak kucing berasa tenang.'),O('care4','Supaya anak kucing berasa takut.'),O('care0','Supaya bekas makanan menjadi penuh.')],0),
 Q('Air minuman kucing kotor. Apakah tindakan yang menjaga kesihatannya?',[O('care0','Menambah makanan sahaja.'),O('care1','Menggantikan air dengan air bersih.'),O('care4','Menjerit supaya kucing minum.')],1),
 Q('Mengapakah jadual penjagaan kucing berguna?',[O('care7','Supaya kucing tidur sepanjang hari.'),O('care4','Supaya murid boleh menakutkan kucing.'),O('duties','Supaya setiap murid tahu tugasnya.')],2),
 Q('Kawan kamu belum tahu menyediakan tempat rehat kucing. Bagaimanakah kamu boleh bekerjasama?',[O('bed','Membahagikan tugas menyediakan tuala dan peti.'),O('care3','Membelai kucing seorang diri.'),O('care4','Menjerit kepada kucing.')],0),
 Q('Mengapakah kita perlu membersihkan tempat tidur kucing?',[O('care0','Supaya makanan menjadi banyak.'),O('care2','Supaya kucing berehat di tempat yang bersih.'),O('care4','Supaya kucing berasa takut.')],1),
 Q('Kucing masih menggigil walaupun sudah dikeringkan. Apakah tindakan yang bijak?',[O('care4','Menjerit supaya kucing diam.'),O('books6','Membiarkan buku berselerak.'),O('call','Meminta orang dewasa membantu.')],2)
];
questions.pondok.pengayaan=[
 Q('Mengapakah buku perlu dipulangkan ke rak?',[O('return','Supaya pembaca lain mudah mencarinya.'),O('books6','Supaya lantai dipenuhi buku.'),O('books1','Supaya halaman buku terkoyak.')],0),
 Q('Kamu menemukan dompet di pondok. Apakah tindakan jujur?',[O('books6','Membiarkan buku di lantai.'),O('honest','Menyerahkan dompet itu kepada guru.'),O('books1','Mengoyakkan halaman buku.')],1),
 Q('Mengapakah dua orang membawa buku bersama-sama?',[O('books1','Supaya buku mudah dikoyakkan.'),O('books6','Supaya buku berselerak.'),O('carry','Supaya beban membawa buku lebih ringan.')],2),
 Q('Halaman buku hampir tertanggal. Apakah tindakan yang menjaga buku?',[O('books8','Membaiki halaman itu dengan bantuan guru.'),O('books1','Mengoyakkan halaman itu.'),O('books6','Membiarkan buku itu di lantai.')],0),
 Q('Mengapakah kita perlu mendengar pesanan penjaga pondok?',[O('books1','Supaya kita boleh merosakkan buku.'),O('respect','Supaya kita tahu cara menggunakan pondok dengan baik.'),O('books6','Supaya kita boleh menyepahkan buku.')],1),
 Q('Rakan kamu hendak membaca buku di atas lantai yang berdebu. Apakah cadangan yang baik?',[O('books1','Koyakkan halaman buku itu.'),O('books6','Biarkan semua buku di lantai.'),O('sweep','Bersihkan ruang itu dahulu.')],2)
];
questions.pokok.pengayaan=[
 Q('Mengapakah pokok perlu disiram dengan air secukupnya?',[O('garden4','Supaya pokok tumbuh segar.'),O('garden3','Supaya pokok menjadi layu.'),O('garden2','Supaya semua daun dipetik.')],0),
 Q('Hujan lebat akan turun. Pasu kecil berada di luar. Apakah rancangan yang sesuai?',[O('garden1','Tambahkan air sehingga melimpah.'),O('garden5','Pindahkan pasu ke tempat terlindung.'),O('garden2','Petik semua daun pokok.')],1),
 Q('Mengapakah kita perlu menutup paip selepas menyiram?',[O('garden1','Supaya air terus melimpah.'),O('garden2','Supaya daun boleh dipetik.'),O('save','Supaya air tidak dibazirkan.')],2),
 Q('Kamu perlu menjaga pokok semasa cuti. Apakah rancangan yang bertanggungjawab?',[O('promise','Tetapkan jadual penjagaan bersama orang dewasa.'),O('garden3','Biarkan tanah kering sepanjang cuti.'),O('garden2','Petik semua daun sebelum pulang.')],0),
 Q('Mengapakah Hana dan Iman membawa bekas air bersama-sama?',[O('garden2','Supaya mudah memetik daun.'),O('garden7','Supaya bekas yang berat lebih mudah dibawa.'),O('garden1','Supaya semua air melimpah.')],1),
 Q('Pokok baharu memerlukan penjagaan yang kamu belum tahu. Apakah cara mendapatkan maklumat?',[O('garden2','Petik daun tanpa bertanya.'),O('garden1','Siram sebanyak mungkin.'),O('respect','Dengar nasihat orang yang tahu menjaga pokok.')],2)
];
questions.sihat.pengayaan=[
 Q('Mengapakah tangan perlu dibasuh sebelum makan?',[O('health0','Supaya kotoran pada tangan dibersihkan.'),O('health5','Supaya sampah bertambah.'),O('health4','Supaya makanan dibuang.')],0),
 Q('Rakan terlupa membawa bekal. Kamu mempunyai makanan lebih. Apakah tindakan baik hati?',[O('health4','Buang makanan yang masih elok.'),O('health6','Kongsi makanan dengan rakan.'),O('health5','Tinggalkan sampah di situ.')],1),
 Q('Mengapakah makanan perlu ditutup?',[O('health4','Supaya makanan boleh dibuang.'),O('health5','Supaya tempat berkelah kotor.'),O('health1','Supaya makanan terlindung daripada kotoran.')],2),
 Q('Kamu hendak bersin di meja makan. Apakah tindakan yang menjaga orang lain?',[O('health7','Tutup hidung dan mulut dengan tisu.'),O('health4','Buang makanan di atas meja.'),O('health6','Kongsi makanan sebelum menutup mulut.')],0),
 Q('Mengapakah bekal yang masih elok disimpan untuk dibawa pulang?',[O('health4','Supaya lebih banyak makanan dibuang.'),O('health2','Supaya makanan tidak dibazirkan.'),O('health5','Supaya sampah dibiarkan di situ.')],1),
 Q('Apakah rancangan supaya tempat jamuan cepat bersih?',[O('health1','Tutup satu bekas makanan sahaja.'),O('health4','Buang semua makanan yang masih elok.'),O('health3','Bahagikan tugas mengutip sampah bersama-sama.')],2)
];
const data={images,questions,proofImages,proofPrompts,values,counts:P.counts,
 matching:'Tekan satu perkataan di sebelah kiri. Kemudian, tekan gambar yang sepadan di sebelah kanan. Suaikan keempat-empat pasangan. Tekan Semak padanan apabila siap.',
 camera:'Tekan Buka kamera, kemudian tekan Benarkan. Pastikan tangan kelihatan pada skrin. Buka ibu jari dan jari telunjuk. Halakan jari telunjuk kepada ikan. Rapatkan kedua-dua jari sehingga ikan dipilih. Kemudian, angkat tangan sedikit untuk menarik ikan.',
 cameraShort:'Dengan kamera: buka dua jari, halakan jari telunjuk kepada ikan, rapatkan jari sehingga ikan dipilih, kemudian angkat tangan sedikit.',
 matched:'Tahniah! Semua pasangan perkataan dan gambar betul.',wrongMatch:'Padanan disimpan. Mari lihat pasangan yang betul. Dua mata ditolak bagi setiap padanan yang belum tepat.'};
data.forStory=(story,route)=>questions[story][route];
data.direction=q=>q.prompt+' Pilih satu gambar jawapan.';
g.JoranPractice39=data;
})(globalThis);
