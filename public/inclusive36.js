(function(g){
'use strict';
const directions={
 puzzle:'Lihat gambar panduan. Tekan dua keping untuk menukar tempat. Susun sehingga gambar lengkap.',
 idea:'Lihat gambar yang telah siap. Pilih satu jawapan, kemudian tekan Simpan idea.',
 look:'Lihat gambar cerita. Perhatikan watak dan perkara yang berlaku. Kemudian, tekan Baca cerita.',
 read:'Baca ayat pada halaman ini satu demi satu. Tekan Dengar Guru jika kamu mahu mendengar bacaan. Kemudian, tekan Rakam bacaan.',
 record:'Tekan Rakam bacaan. Baca semua ayat pada halaman ini. Selepas selesai, tekan Henti dan simpan.',
 recording:'Baca semua ayat pada halaman ini. Selepas selesai membaca, tekan Henti dan simpan.',
 recorded:'Rakaman halaman ini sudah disimpan. Kamu boleh mendengarnya semula. Tekan Seterusnya untuk meneruskan.',
 proof:'Baca soalan dan pilih satu ayat yang menjawabnya. Kemudian, tekan Semak ayat.',
 value:'Lihat perbuatan watak yang dipaparkan. Pilih nilai murni yang sesuai. Kemudian, tekan Simpan jawapan.',
 reread:'Baca semula halaman ini. Kamu boleh mendengar suara Guru atau rakaman bacaan kamu. Kemudian, tekan Seterusnya.',
 find:'Baca soalan dan pilih ayat yang menjawabnya. Kemudian, tekan Seterusnya.',
 notes:'Lihat perbuatan watak. Tekan satu nilai pilihan kamu. Ayat pilihan kamu akan dipaparkan. Kemudian, tekan Mula memancing.',
 bonus:'Baca peribahasa. Tekan satu maksud pilihan kamu. Kemudian, tekan Mula memancing.',
 fish:'Pilih ikan yang membawa jawapan kamu. Kemudian, tekan Pancing ikan ini. Kamu juga boleh menggunakan gerakan tangan.',
 explainValue:'Pilih satu nilai murni untuk diterangkan. Kemudian, tekan Pilih perbuatan.',
 explainAction:'Pilih gambar perbuatan yang menunjukkan nilai pilihan kamu. Kemudian, tekan Semak ayat saya.',
 explainReview:'Baca ayat yang terhasil daripada pilihan kamu. Kamu boleh menambah ayat sendiri. Kemudian, tekan Simpan penjelasan.',
 diagnostic:'Jawab sendiri dahulu. Baca soalan dan pilih satu jawapan. Kemudian, tekan Seterusnya. Rakan menunggu giliran.',
 matching:'Lihat gambar dan baca perbuatan watak. Tekan nilai yang sepadan. Kemudian, tekan Seterusnya.',
 matchReview:'Pilih satu padanan untuk dibaca semula. Baca ayat yang dipaparkan. Kemudian, tekan Simpan latihan.',
 reinforcement:'Baca soalan dan pilih satu jawapan. Kemudian, tekan Seterusnya. Rakan boleh membantu selepas kamu mencuba.',
 reinforceReview:'Pilih satu ayat yang menerangkan tindakan baik. Baca ayat pilihan kamu. Kemudian, tekan Simpan latihan.',
 enrich:'Lihat situasi baharu. Pilih tindakan yang kamu mahu lakukan. Kemudian, pilih nilai yang sesuai.',
 enrichReview:'Baca tindakan dan nilai pilihan kamu. Kamu boleh menambah idea sendiri. Kemudian, tekan Simpan latihan.',
 review:'Semak tajuk dan ayat buku cerita. Tekan Ubah jika ada yang perlu dibaiki. Kemudian, tekan Sudah semak.',
 reflection:'Pilih satu amalan baik yang kamu mahu lakukan. Baca ayat pilihan kamu. Kemudian, tekan Simpan refleksi.',
 saved:'Pilihan kamu telah disimpan.',
 correctProof:'Tahniah! Kamu memilih ayat yang tepat.',
 wrongProof:'Ayat pilihan kamu belum tepat. Lihat ayat yang betul. Kamu boleh meneruskan.',
 chooseFirst:'Pilih satu jawapan dahulu.',
 recordingHelp:'Satu. Tekan Rakam bacaan. Dua. Baca ayat pada halaman ini. Tiga. Tekan Henti dan simpan.',
 guided:'Ayat ini dibina daripada pilihan kamu.',
 camera:'Angkat satu tangan. Halakan jari telunjuk kepada ikan. Rapatkan ibu jari dan jari telunjuk. Kemudian, angkat tangan sedikit untuk menarik ikan.'
};
const proofQuestions={
 belang:['Apakah yang Hana lakukan untuk membantu anak kucing?','Apakah barang yang disediakan oleh Hana dan Iman?','Apakah yang Hana dan Iman lakukan setiap hari?'],
 pondok:['Apakah yang Hana mahu lakukan di pondok?','Bagaimanakah Iman membantu Hana menyusun buku?','Apakah yang pembaca lakukan selepas membaca?'],
 pokok:['Apakah yang Hana lakukan apabila melihat anak pokok layu?','Bagaimanakah Iman membantu Hana menjaga anak pokok?','Apakah janji Iman kepada Tok Wan?'],
 sihat:['Apakah yang Hana dan Iman lakukan sebelum makan?','Apakah ajakan Hana kepada Iman sebelum pulang?','Apakah yang mereka lakukan dengan baki bekal?']
};
const findQuestions={"belang": ["Siapakah yang dipanggil oleh Hana untuk membantu anak kucing?", "Apakah barang yang disediakan oleh Hana dan Iman?", "Apakah minuman yang disediakan oleh Iman untuk Belang?", "Apakah yang dilakukan oleh Hana dan Iman setiap hari?", "Bagaimanakah Tok Wan menghargai usaha Hana dan Iman?"], "pondok": ["Apakah yang Hana mahu lakukan di pondok?", "Bagaimanakah Iman membantu Hana menguruskan buku?", "Apakah bahan yang dikongsi oleh Hana dengan Iman?", "Apakah yang Iman lakukan dengan sisa kertas?", "Apakah yang pembaca lakukan selepas membaca?"], "pokok": ["Apakah yang Hana mahu lakukan untuk anak pokok?", "Bagaimanakah Iman membantu Hana menjaga anak pokok?", "Bagaimanakah Hana mendengar penerangan Tok Wan?", "Apakah janji Iman kepada Tok Wan?", "Apakah peribahasa yang disebut oleh Tok Wan?"], "sihat": ["Apakah yang Hana lakukan sebelum menyediakan makanan?", "Apakah pesanan Tok Wan sebelum mereka makan?", "Apakah yang mereka lakukan dengan baki bekal?", "Apakah ajakan Hana kepada Iman sebelum pulang?", "Apakah pesanan Tok Wan tentang mencegah penyakit?"]};
const fishingQuestions={
 belang:['Hana meminta bantuan untuk Belang. Apakah nilai yang ditunjukkan?','Hana dan Iman membahagikan tugas. Apakah nilai yang ditunjukkan?','Iman menyediakan air untuk Belang. Apakah nilai yang ditunjukkan?','Mereka menjaga Belang setiap hari. Apakah nilai yang ditunjukkan?','Tok Wan memuji usaha mereka. Apakah nilai yang ditunjukkan?'],
 pondok:['Hana mahu mengemas pondok. Apakah nilai yang ditunjukkan?','Iman membantu Hana menyusun buku. Apakah nilai yang ditunjukkan?','Hana berkongsi kertas dengan Iman. Apakah nilai yang ditunjukkan?','Iman membuang sisa kertas ke dalam tong sampah. Apakah nilai yang ditunjukkan?','Pembaca memulangkan buku ke rak. Apakah nilai yang ditunjukkan?'],
 pokok:['Hana mahu membantu menjaga pokok. Apakah nilai yang ditunjukkan?','Iman membantu Hana menyiram pokok. Apakah nilai yang ditunjukkan?','Hana mendengar penerangan Tok Wan dengan teliti. Apakah nilai yang ditunjukkan?','Iman berjanji untuk menjaga kebun. Apakah nilai yang ditunjukkan?','Hana dan Iman saling membantu. Apakah nilai yang ditunjukkan?'],
 sihat:['Hana membasuh tangan sebelum menyediakan makanan. Apakah nilai yang ditunjukkan?','Tok Wan mengingatkan mereka supaya membasuh tangan. Apakah amalan yang diutamakan?','Mereka menyimpan baki bekal. Apakah nilai yang ditunjukkan?','Hana dan Iman mengutip sampah bersama. Apakah nilai yang ditunjukkan?','Tok Wan menasihati mereka supaya mencegah penyakit. Apakah nilai yang ditunjukkan?']
};
const transfer={
 belang:{prompt:'Seekor anak kucing berada dekat longkang sekolah. Apakah tindakan baik kamu?',actions:['Saya meminta bantuan Guru.','Saya memberitahu pengawal sekolah.','Saya mengajak rakan mencari Guru.'],values:['Kasih sayang','Kerjasama','Baik hati']},
 pondok:{prompt:'Sudut bacaan kelas berselerak. Apakah tindakan baik kamu?',actions:['Saya menyusun buku bersama rakan.','Saya mengelap meja bacaan.','Saya menyimpan buku di rak.'],values:['Kerjasama','Kerajinan','Tanggungjawab']},
 pokok:{prompt:'Kelas akan bercuti. Pokok kelas masih perlu dijaga. Apakah tindakan baik kamu?',actions:['Saya berbincang dengan Guru tentang penjagaan pokok.','Saya mengajak rakan membuat jadual menjaga pokok.','Saya meminta bantuan orang dewasa untuk menyiram pokok.'],values:['Tanggungjawab','Kerjasama','Baik hati']},
 sihat:{prompt:'Jamuan kelas telah selesai. Apakah tindakan baik kamu?',actions:['Saya menyimpan makanan yang masih elok.','Saya mengutip sampah bersama rakan.','Saya membersihkan meja makan.'],values:['Berjimat cermat','Kerjasama','Kebersihan']}
};
const reflections={
 belang:['Saya akan menyayangi haiwan dengan menjaganya.','Saya akan membantu rakan menyiapkan tugas.','Saya akan melaksanakan tugas setiap hari.'],
 pondok:['Saya akan menyusun buku bersama rakan.','Saya akan memulangkan buku selepas membaca.','Saya akan membantu mengemas sudut bacaan.'],
 pokok:['Saya akan membantu menjaga pokok.','Saya akan menyiram pokok mengikut jadual.','Saya akan bekerjasama dengan rakan di kebun.'],
 sihat:['Saya akan membasuh tangan sebelum makan.','Saya akan mengutip sampah bersama rakan.','Saya akan mengelakkan pembaziran makanan.']
};
const sentence=(value,action)=>'Saya memilih nilai '+String(value).toLowerCase()+'. '+action;
const pageFor=(view,lessonPage,gamePage,bookPage)=>view==='lesson'?lessonPage:view==='book'?bookPage:gamePage;
function choosePair(pairs,index,value){const next=pairs.slice(),previous=next[index],other=next.indexOf(value);if(other>=0&&other!==index)next[other]=previous;next[index]=value;return next;}
g.JoranInclusive36={directions,proofQuestions,findQuestions,fishingQuestions,transfer,reflections,sentence,pageFor,choosePair,version:36};
})(globalThis);
