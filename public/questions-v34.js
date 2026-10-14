(function(g){
'use strict';
// Versioned exercises. The twenty recorded story pages are deliberately unchanged.
const identification={
 belang:[['Kasih sayang','Kejujuran','Berjimat cermat'],['Hormat-menghormati','Keberanian','Kerjasama'],['Kesederhanaan','Tanggungjawab','Kebersihan']],
 pondok:[['Kesederhanaan','Kejujuran','Kerajinan'],['Kerjasama','Keberanian','Berjimat cermat'],['Kasih sayang','Tanggungjawab','Hormat-menghormati']],
 pokok:[['Keberanian','Baik hati','Kejujuran'],['Kesederhanaan','Berjimat cermat','Kerjasama'],['Tanggungjawab','Kebersihan','Hormat-menghormati']],
 sihat:[['Kebersihan','Kejujuran','Keberanian'],['Berjimat cermat','Hormat-menghormati','Kerjasama'],['Kesederhanaan','Berjimat cermat','Kasih sayang']]
};
const diagnostic={
 belang:[
  ['Belang kelihatan dahaga. Tindakan manakah menunjukkan kasih sayang?', ['Mengajak Belang berlari','Menyembunyikan mangkuk Belang','Menyediakan air bersih untuk Belang'],2],
  ['Mengapakah Hana dan Iman membahagikan tugas menjaga Belang?', ['Supaya mereka dapat bekerjasama','Supaya Iman membuat semua kerja','Supaya mereka boleh meninggalkan Belang'],0],
  ['Hari ini giliran kamu membersihkan tempat rehat Belang. Apakah tindakan yang bertanggungjawab?', ['Menunggu orang lain melakukannya','Membersihkannya mengikut jadual','Menyembunyikan jadual tugas'],1]
 ],
 pondok:[
  ['Rakan kamu sedang menyusun buku yang banyak. Apakah cara bekerjasama dengannya?', ['Membantu menyusun sebahagian buku','Mengambil buku yang telah disusun','Menyuruhnya menyiapkan kerja seorang diri'],0],
  ['Kamu sudah selesai membaca sebuah buku. Tindakan manakah menunjukkan tanggungjawab?', ['Meninggalkannya di bawah meja','Menyembunyikannya di dalam beg','Memulangkannya ke rak yang betul'],2],
  ['Mengapakah sikap Hana yang suka membantu mengemas pondok patut dicontohi?', ['Pondok akan dipenuhi lebih banyak sampah','Pondok menjadi kemas dan selesa','Buku menjadi sukar ditemukan'],1]
 ],
 pokok:[
  ['Anak pokok di kelas kelihatan layu. Apakah tindakan baik yang boleh kamu lakukan?', ['Membiarkan tanah terus kering','Meminta izin untuk menyiramnya','Memetik semua daunnya'],1],
  ['Kamu sudah berjanji untuk menjaga pokok pada hari Selasa. Apakah yang patut kamu lakukan?', ['Datang hanya apabila dipuji','Menyerahkan tugas tanpa memberitahu sesiapa','Melaksanakan tugas pada hari Selasa'],2],
  ['Rakan kamu membawa bekas air yang berat untuk menyiram pokok. Apakah tindakan yang menunjukkan kerjasama?', ['Membantu membawa bekas itu bersama-sama','Menyuruhnya membawa dengan lebih cepat','Meninggalkannya untuk bermain'],0]
 ],
 sihat:[
  ['Tangan kamu terkena tanah sebelum makan. Apakah tindakan yang menjaga kebersihan?', ['Mengelap tangan pada baju sahaja','Terus mengambil makanan','Membasuh tangan dengan sabun'],2],
  ['Masih ada bekal yang elok selepas kamu kenyang. Bagaimanakah kamu mengelakkan pembaziran?', ['Membuangnya ke dalam tong sampah','Menyimpannya dengan baik untuk dibawa pulang','Meninggalkannya di atas rumput'],1],
  ['Apakah cara bekerjasama semasa mengemas tempat berkelah?', ['Membahagikan tugas mengemas dengan rakan','Membiarkan seorang rakan mengemas semuanya','Berlumba untuk pulang dahulu'],0]
 ]
};
const reinforcement={
 belang:[
  ['Hana menjaga Belang hanya apabila mahu bermain dengannya. Apakah yang patut diperbaik?', ['Memberi Belang lebih banyak mainan','Menjaga keperluan Belang setiap hari','Menyuruh Belang mencari makanan sendiri'],1],
  ['Hana menyediakan makanan, manakala Iman menukar air Belang. Mengapakah ini contoh kerjasama?', ['Mereka melakukan semua tugas seorang diri','Mereka menunggu Tok Wan membuat kerja','Mereka membahagikan tugas dan saling membantu'],2]
 ],
 pondok:[
  ['Iman mahu berkongsi penanda buku dengan rakannya. Apakah nilai yang ditunjukkan?', ['Keberanian','Berjimat cermat','Baik hati'],2],
  ['Mengapakah buku perlu dipulangkan ke rak selepas dibaca?', ['Supaya pembaca lain mudah mencarinya','Supaya rak menjadi berselerak','Supaya buku tidak boleh dibaca lagi'],0]
 ],
 pokok:[
  ['Tok Wan sedang menerangkan cara menyiram pokok. Bagaimanakah kamu menunjukkan rasa hormat?', ['Bercakap kuat dengan rakan','Mendengar penerangannya dengan teliti','Meninggalkannya sebelum selesai'],1],
  ['Rakan terlupa jadual menjaga pokok. Apakah bantuan yang sesuai?', ['Mengingatkannya dan membantu menyemak jadual','Memadamkan namanya tanpa berbincang','Membiarkan pokok itu layu'],0]
 ],
 sihat:[
  ['Iman menutup bekas makanan selepas mengambil roti. Mengapakah tindakan itu baik?', ['Supaya makanan menjadi kotor','Supaya bekas sukar ditemukan','Supaya makanan kekal bersih'],2],
  ['Rakan kamu mahu pulang ketika sampah masih bertaburan. Apakah ajakan yang sesuai?', ['Mari kita tinggalkan sampah ini','Mari kita kutip sampah bersama-sama','Mari kita sembunyikan sampah di bawah tikar'],1]
 ]
};
const enrichment={
 belang:'Di kawasan sekolah, seekor anak kucing berada berhampiran longkang. Cadangkan cara mendapatkan bantuan orang dewasa dengan selamat. Terangkan nilai murni dalam tindakan kamu.',
 pondok:'Sudut bacaan kelas kamu berselerak selepas waktu rehat. Cadangkan dua tugas yang boleh dibahagikan dengan rakan. Terangkan nilai murni yang diamalkan.',
 pokok:'Kelas kamu akan bercuti selama beberapa hari. Cadangkan cara berbincang dengan Guru untuk memastikan pokok kelas terus dijaga. Terangkan nilai murni dalam cadangan kamu.',
 sihat:'Selepas jamuan kelas, masih ada makanan yang elok dan sampah di atas meja. Cadangkan tindakan yang mengelakkan pembaziran serta menjaga kebersihan. Terangkan nilai murni yang diamalkan.'
};
// [specific question, three values, answer index, evidence index, optional new clue]
const fishing={
 belang:[
  ['Hana meminta bantuan untuk anak kucing yang menggigil. Apakah nilai yang paling sesuai?', ['Kasih sayang','Berjimat cermat','Kejujuran'],0,3],
  ['Hana dan Iman menyediakan barang yang berbeza untuk Belang. Apakah nilai dalam pembahagian tugas ini?', ['Keberanian','Hormat-menghormati','Kerjasama'],2,1],
  ['Iman menyediakan air untuk Belang yang memerlukannya. Apakah nilai dalam tindakan Iman?', ['Kesederhanaan','Baik hati','Kejujuran'],1,2,'Cari ayat yang menunjukkan Iman menyediakan keperluan minuman Belang.'],
  ['Hana dan Iman menjalankan tugas setiap hari. Apakah nilai yang ditunjukkan?', ['Tanggungjawab','Keberanian','Berjimat cermat'],0,3],
  ['Tok Wan memuji usaha Hana dan Iman. Apakah sikap baik Tok Wan terhadap usaha mereka?', ['Kesederhanaan','Kebersihan','Menghargai jasa'],2,2,'Cari ayat yang menunjukkan Tok Wan menghargai usaha Hana dan Iman.']
 ],
 pondok:[
  ['Hana menawarkan diri untuk mengemas pondok. Apakah nilai yang ditunjukkan?', ['Keberanian','Kerajinan','Berjimat cermat'],1,1],
  ['Iman membantu Hana meletakkan buku di atas meja. Apakah nilai yang menghubungkan tindakan mereka?', ['Kerjasama','Kejujuran','Kesederhanaan'],0,1],
  ['Hana sudi berkongsi kertas dengan Iman. Apakah nilai yang ditunjukkan?', ['Hormat-menghormati','Keberanian','Baik hati'],2,1],
  ['Iman membuang sisa kertas ke dalam tong sampah. Apakah nilai yang paling jelas?', ['Berjimat cermat','Kebersihan','Kejujuran'],1,1],
  ['Semua pembaca memulangkan buku ke rak. Apakah nilai dalam menjaga buku yang digunakan bersama?', ['Tanggungjawab','Kesederhanaan','Keberanian'],0,1,'Cari ayat yang menunjukkan pembaca menjaga buku selepas membacanya.']
 ],
 pokok:[
  ['Hana menawarkan bantuan apabila melihat anak pokok layu. Apakah nilai yang ditunjukkan?', ['Kejujuran','Kesederhanaan','Baik hati'],2,2],
  ['Iman membantu Hana menyiram pokok. Apakah nilai yang ditunjukkan apabila mereka bekerja bersama?', ['Kerjasama','Berjimat cermat','Keberanian'],0,1],
  ['Hana mendengar penerangan Tok Wan dengan teliti. Apakah nilai dalam cara Hana mendengar?', ['Kebersihan','Hormat-menghormati','Kejujuran'],1,1],
  ['Iman berjanji untuk menjaga kebun setiap minggu. Apakah nilai dalam kesanggupan memikul tugas ini?', ['Kesederhanaan','Keberanian','Tanggungjawab'],2,1],
  ['Mengapakah Tok Wan menyamakan mereka dengan aur dan tebing? Pilih nilai yang sesuai.', ['Kerjasama','Kejujuran','Berjimat cermat'],0,2]
 ],
 sihat:[
  ['Hana membasuh tangan sebelum menyediakan makanan. Apakah nilai yang ditunjukkan?', ['Kesederhanaan','Kebersihan','Keberanian'],1,1],
  ['Tok Wan mengingatkan mereka supaya membasuh tangan dengan sabun. Apakah amalan yang ditekankan?', ['Kejujuran','Berjimat cermat','Kebersihan'],2,1],
  ['Mereka menyimpan baki bekal yang masih elok. Apakah nilai dalam mengelakkan pembaziran?', ['Berjimat cermat','Keberanian','Hormat-menghormati'],0,2,'Cari ayat yang menunjukkan mereka tidak membazirkan baki bekal.'],
  ['Hana mengajak Iman mengumpulkan sampah bersama. Apakah nilai dalam tindakan bersama ini?', ['Kejujuran','Kerjasama','Kesederhanaan'],1,1],
  ['Tok Wan menasihati mereka supaya mencegah penyakit. Apakah nilai dalam memilih langkah yang baik sebelum masalah berlaku?', ['Kebersihan','Keberanian','Kebijaksanaan'],2,2]
 ]
};
const expand=rows=>rows.map(([prompt,options,answer])=>({prompt,options,answer}));
g.JoranQuestions34={identification,diagnostic:Object.fromEntries(Object.entries(diagnostic).map(([k,v])=>[k,expand(v)])),reinforcement:Object.fromEntries(Object.entries(reinforcement).map(([k,v])=>[k,expand(v)])),enrichment,fishing,version:34};
})(globalThis);
