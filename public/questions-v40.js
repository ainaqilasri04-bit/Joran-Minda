(function(g){
'use strict';
// Each stage has a different task. Existing story pages and old room keys remain unchanged.
const O=(image,text)=>({image,text});
const Q=(prompt,correct,wrong1,wrong2,answer,kind)=>{const options=[wrong1,wrong2];options.splice(answer,0,correct);return {prompt,options,answer,kind};};
const fishing={
belang:[
 Q('Mengapakah Hana memanggil Tok Wan?',O('call','Untuk membantu anak kucing.'),O('read','Untuk membaca buku.'),O('play','Untuk bermain bola.'),1,'sebab'),
 Q('Mengapakah peti Belang dialas dengan kain lembut?',O('care7','Supaya Belang selesa berehat.'),O('care4','Supaya Belang ketakutan.'),O('books6','Supaya buku berselerak.'),2,'sebab'),
 Q('Apakah kesan suara Hana yang lembut kepada Belang?',O('care3','Belang menjadi tenang.'),O('care4','Belang menjadi takut.'),O('care0','Makanan Belang bertambah.'),0,'kesan'),
 Q('Mengapakah Hana dan Iman membahagikan tugas?',O('duties','Supaya Belang dijaga setiap hari.'),O('play','Supaya mereka bermain sahaja.'),O('alone','Supaya seorang membuat semua kerja.'),2,'sebab'),
 Q('Apakah hasil penjagaan Hana dan Iman?',O('care7','Belang semakin sihat.'),O('care4','Belang semakin takut.'),O('books6','Buku semakin berselerak.'),1,'kesan')],
pondok:[
 Q('Mengapakah pondok itu perlu dikemas?',O('sweep','Pondok itu berdebu.'),O('read','Rakan sedang membaca.'),O('play','Murid mahu bermain bola.'),0,'sebab'),
 Q('Mengapakah Tok Wan membaiki rak?',O('books8','Rak itu senget.'),O('read','Buku sedang dibaca.'),O('books2','Kertas hendak dikongsi.'),2,'sebab'),
 Q('Mengapakah label ditampal pada rak?',O('books0','Supaya buku mudah dicari.'),O('books1','Supaya buku mudah koyak.'),O('books6','Supaya buku berselerak.'),1,'sebab'),
 Q('Apakah kesan membuang sisa kertas ke dalam tong sampah?',O('health3','Pondok menjadi bersih.'),O('books6','Buku bertaburan di lantai.'),O('health5','Sampah semakin bertaburan.'),0,'kesan'),
 Q('Apakah faedah memulangkan buku ke rak?',O('read','Rakan lain mudah mencari buku.'),O('books1','Halaman buku menjadi koyak.'),O('books6','Lantai dipenuhi buku.'),2,'kesan')],
pokok:[
 Q('Mengapakah anak pokok itu layu?',O('garden3','Cuaca panas.'),O('garden0','Air diberi secukupnya.'),O('garden5','Pasu diletakkan di tempat teduh.'),2,'sebab'),
 Q('Apakah kesan menyiram pokok dengan air secukupnya?',O('garden4','Pokok menjadi segar.'),O('garden3','Pokok semakin layu.'),O('garden2','Semua daun dipetik.'),0,'kesan'),
 Q('Mengapakah Iman melukis gambar pada kad?',O('respect','Supaya pesanan mudah diingati.'),O('garden2','Supaya daun mudah dipetik.'),O('garden1','Supaya air melimpah.'),1,'sebab'),
 Q('Mengapakah Hana menyediakan jadual?',O('promise','Supaya mereka ingat akan tugas.'),O('garden2','Supaya semua daun dipetik.'),O('garden3','Supaya pokok dibiarkan layu.'),0,'sebab'),
 Q('Apakah hasil penjagaan pokok bersama-sama?',O('garden4','Anak pokok kembali segar.'),O('garden3','Anak pokok terus layu.'),O('garden1','Air terus melimpah.'),2,'kesan')],
sihat:[
 Q('Mengapakah Hana membasuh tangan sebelum menyediakan bekal?',O('health0','Supaya tangannya bersih.'),O('health4','Supaya bekal dibuang.'),O('health5','Supaya sampah bertambah.'),1,'sebab'),
 Q('Mengapakah tangan mereka kotor?',O('play','Mereka baru bermain.'),O('health0','Mereka baru membasuh tangan.'),O('health1','Mereka baru menutup bekas.'),0,'sebab'),
 Q('Mengapakah Iman menutup bekas makanan?',O('health1','Supaya makanan kekal bersih.'),O('health4','Supaya makanan dibuang.'),O('health5','Supaya tempat berkelah kotor.'),2,'sebab'),
 Q('Apakah kesan mengutip sampah bersama-sama?',O('health3','Tempat berkelah menjadi bersih.'),O('health5','Sampah terus bertaburan.'),O('health4','Makanan yang elok dibuang.'),1,'kesan'),
 Q('Apakah tujuan poster membasuh tangan?',O('health0','Mengingatkan orang menjaga kebersihan.'),O('health4','Mengajak orang membazir makanan.'),O('health5','Mengajak orang membuang sampah merata-rata.'),0,'sebab')]
};
const reinforcement={
belang:[
 Q('Lengkapkan ayat: Hana mengambil tuala, manakala Iman menyediakan _____.',O('bed','tempat rehat'),O('care0','makanan'),O('care1','air minuman'),2,'isi'),
 Q('Selepas bulunya dikeringkan, anak kucing itu diberi nama apa?',O('care7','Belang'),O('call','Hana'),O('duties','Iman'),0,'ingat'),
 Q('Lengkapkan ayat: Hana bercakap dengan suara yang _____.',O('care3','lembut'),O('care4','kuat'),O('play','bising'),1,'isi'),
 Q('Pada keesokan hari, apakah tugas Hana?',O('care0','Menyediakan makanan Belang.'),O('care1','Menukar air Belang.'),O('care2','Membersihkan peti Belang.'),0,'ingat'),
 Q('Selepas Belang kembali sihat, apakah yang dilakukannya?',O('care3','Bermain bersama Hana dan Iman.'),O('care4','Menggigil ketakutan.'),O('call','Meminta bantuan Tok Wan.'),2,'urutan')],
pondok:[
 Q('Lengkapkan ayat: Hana mengutip buku, manakala Iman _____.',O('sweep','mengelap meja'),O('books8','membaiki rak'),O('books2','berkongsi kertas'),1,'isi'),
 Q('Siapakah yang membaiki rak buku?',O('respect','Tok Wan'),O('sweep','Hana'),O('carry','Iman'),2,'ingat'),
 Q('Selepas rak dibaiki, apakah yang mereka lakukan?',O('books0','Menyusun buku di rak.'),O('play','Bermain bola.'),O('books1','Mengoyakkan buku.'),0,'urutan'),
 Q('Lengkapkan ayat: Hana berkongsi _____ untuk membuat penanda buku.',O('books2','kertas berwarna'),O('health6','makanan'),O('garden0','air'),1,'isi'),
 Q('Apakah yang mereka lakukan pada petang itu?',O('read','Mengajak rakan membaca.'),O('garden0','Menyiram pokok.'),O('care0','Memberi kucing makan.'),0,'urutan')],
pokok:[
 Q('Lengkapkan ayat: Tok Wan mengisi baldi dengan _____.',O('garden0','air'),O('garden2','daun'),O('health5','sampah'),0,'isi'),
 Q('Selepas menyiram pokok, apakah yang mereka kutip?',O('garden2','Daun kering.'),O('books6','Buku.'),O('health4','Makanan.'),2,'urutan'),
 Q('Siapakah yang menulis label penjagaan?',O('offer','Hana'),O('water','Iman'),O('respect','Tok Wan'),1,'ingat'),
 Q('Lengkapkan ayat: Label penjagaan diletakkan di sebelah _____.',O('garden5','pasu'),O('books0','rak buku'),O('care7','peti Belang'),0,'isi'),
 Q('Selepas pokok kembali segar, apakah yang Hana dan Iman catat?',O('garden4','Perubahan pokok.'),O('care8','Jadual Belang.'),O('health2','Baki bekal.'),2,'urutan')],
sihat:[
 Q('Lengkapkan ayat: Mereka membawa buah, roti dan _____.',O('health6','air kosong'),O('books0','buku'),O('garden5','pasu'),2,'isi'),
 Q('Sebelum berkongsi bekal, apakah yang mereka lakukan?',O('health0','Membasuh tangan.'),O('health3','Mengutip sampah.'),O('health2','Menyimpan baki bekal.'),0,'urutan'),
 Q('Lengkapkan ayat: Apabila kenyang, mereka menyimpan _____.',O('health2','baki bekal'),O('health5','sampah'),O('garden2','daun'),1,'isi'),
 Q('Siapakah yang mengajak Iman mengumpulkan sampah?',O('wash','Hana'),O('respect','Tok Wan'),O('care7','Belang'),2,'ingat'),
 Q('Selepas berkelah, apakah poster yang ingin mereka buat?',O('health0','Poster membasuh tangan.'),O('care0','Poster menjaga kucing.'),O('garden0','Poster menyiram pokok.'),0,'ingat')]
};
// New situations ask learners to apply values, not recall the story's sentences.
const enrichment={
belang:[
 Q('Kucing jiran tidak mahu makan. Siapakah yang patut kamu beritahu?',O('care5','Orang dewasa.'),O('care4','Kucing itu sahaja.'),O('play','Rakan yang sedang bermain.'),1,'situasi'),
 Q('Kawan kamu takut mendekati kucing. Apakah tindakan yang baik?',O('care3','Tunjukkan cara mendekati dengan lembut.'),O('care4','Jerit supaya dia mendekat.'),O('play','Tinggalkan dia untuk bermain.'),0,'situasi'),
 Q('Kamu tidak sihat pada hari bertugas. Bagaimanakah tugas menjaga kucing boleh diteruskan?',O('care8','Minta bantuan dan semak jadual.'),O('care4','Marah kepada kucing.'),O('rest','Diam dan biarkan tugas itu.'),2,'situasi'),
 Q('Dua orang mahu memberi kucing makan pada waktu yang sama. Apakah rancangan yang sesuai?',O('duties','Seorang sediakan makanan, seorang tukar air.'),O('care0','Kedua-duanya tambah makanan berkali-kali.'),O('care4','Bergaduh tentang tugas.'),1,'rancang'),
 Q('Tempat rehat kucing kotor tetapi kamu mahu bermain. Apakah yang patut didahulukan?',O('care2','Bersihkan tempat rehat.'),O('play','Terus bermain bola.'),O('rest','Berehat tanpa membersihkannya.'),0,'keutamaan'),
 Q('Kucing itu berundur apabila kamu menjerit. Bagaimanakah kamu membaiki tindakan itu?',O('care3','Bercakap dengan lembut.'),O('care4','Menjerit lebih kuat.'),O('run','Mengejarnya dengan pantas.'),2,'baiki')],
pondok:[
 Q('Buku yang kamu pinjam terkoyak. Apakah tindakan jujur?',O('books7','Beritahu guru dan serahkan buku itu.'),O('books6','Sembunyikan buku di lantai.'),O('books1','Koyakkan halaman yang lain.'),2,'situasi'),
 Q('Dua orang mahu membaca sebuah buku yang sama. Apakah cadangan kamu?',O('read','Baca bersama-sama.'),O('books1','Tarik buku hingga koyak.'),O('alone','Ambil buku untuk diri sendiri sahaja.'),0,'situasi'),
 Q('Sudut bacaan perlu dikemas sebelum kelas bermula. Apakah rancangan yang cepat dan teratur?',O('carry','Bahagikan tugas menyusun dan mengelap.'),O('alone','Biarkan seorang membuat semua kerja.'),O('play','Semua pergi bermain dahulu.'),1,'rancang'),
 Q('Kawan menggunakan semua kertas warna. Kamu masih memerlukannya. Apakah tindakan yang sopan?',O('books2','Minta berkongsi kertas.'),O('books1','Koyakkan kertasnya.'),O('care4','Jerit kepada kawan.'),0,'situasi'),
 Q('Kamu menemukan buku yang bukan milik kamu. Apakah tindakan yang sesuai?',O('books7','Serahkan buku kepada guru.'),O('books1','Koyakkan halaman buku.'),O('books6','Tinggalkan buku di lantai.'),2,'situasi'),
 Q('Kawan tersalah meletakkan buku. Bagaimanakah kamu membantunya?',O('return','Tunjukkan rak yang betul.'),O('care4','Marah kepadanya.'),O('books6','Sepahkan buku yang lain.'),1,'baiki')],
pokok:[
 Q('Sekolah akan bercuti. Bagaimanakah pokok kelas boleh terus dijaga?',O('garden6','Rancang penjagaan bersama guru.'),O('garden3','Biarkan pokok tanpa penjagaan.'),O('garden2','Petik semua daun.'),0,'rancang'),
 Q('Pasu kecil terdedah kepada hujan lebat. Apakah tindakan yang sesuai?',O('garden5','Pindahkan ke tempat terlindung.'),O('garden1','Tambah air hingga melimpah.'),O('garden2','Petik semua daun.'),1,'situasi'),
 Q('Rakan menyiram terlalu banyak air. Apakah nasihat kamu?',O('save','Hentikan air apabila sudah cukup.'),O('garden1','Teruskan hingga air melimpah.'),O('garden3','Jangan beri air selama-lamanya.'),2,'baiki'),
 Q('Kamu belum tahu cara menjaga pokok baharu. Apakah langkah pertama?',O('respect','Tanya orang yang tahu.'),O('garden2','Petik daunnya dahulu.'),O('garden1','Tuang semua air yang ada.'),0,'keutamaan'),
 Q('Bekas air berat dan rakan sukar membawanya. Bagaimanakah kamu membantu?',O('garden7','Bawa bersama-sama.'),O('run','Berlari meninggalkannya.'),O('play','Ajak rakan bermain sahaja.'),2,'situasi'),
 Q('Kamu terlupa giliran menjaga pokok. Apakah cara supaya tidak terlupa lagi?',O('promise','Semak jadual setiap hari.'),O('garden3','Biarkan pokok itu layu.'),O('play','Lupakan tugas dan bermain.'),1,'baiki')],
sihat:[
 Q('Kawan terlupa membawa bekal. Kamu ada makanan lebih. Apakah tindakan baik hati?',O('health6','Kongsi makanan dengannya.'),O('health4','Buang makanan yang lebih.'),O('alone','Makan sendiri tanpa peduli.'),1,'situasi'),
 Q('Kamu hendak bersin semasa makan. Bagaimanakah kamu menjaga orang lain?',O('health7','Tutup mulut dan hidung dengan tisu.'),O('health6','Terus hulurkan makanan.'),O('health4','Buang semua makanan.'),2,'situasi'),
 Q('Buah jatuh di tempat berdebu. Orang dewasa mengatakan buah itu masih boleh dibersihkan. Apakah langkah sebelum memakannya?',O('health8','Basuh buah itu dahulu.'),O('health6','Terus kongsi buah itu.'),O('health1','Tutup buah tanpa membasuhnya.'),0,'keutamaan'),
 Q('Selepas jamuan, meja perlu dikemas. Apakah rancangan yang melibatkan semua ahli?',O('health3','Bahagikan tugas mengemas.'),O('alone','Suruh seorang buat semua kerja.'),O('play','Semua pergi bermain.'),2,'rancang'),
 Q('Rakan mengambil terlalu banyak makanan. Apakah nasihat kamu?',O('moderate','Ambil makanan secukupnya.'),O('health4','Buang makanan yang masih elok.'),O('health5','Tinggalkan makanan di lantai.'),1,'baiki'),
 Q('Kamu selesai membasuh tangan tetapi paip masih terbuka. Apakah tindakan kamu?',O('save','Tutup paip itu.'),O('garden1','Biarkan air terus mengalir.'),O('play','Terus pergi bermain.'),0,'situasi')]
};
const questions=Object.fromEntries(Object.keys(fishing).map(k=>[k,{pemulihan:g.JoranPractice39.forStory(k,'pemulihan'),pengukuhan:reinforcement[k],pengayaan:enrichment[k]}]));
const texts={wrong:'Jawapan belum tepat.',right:'Tahniah!',fishRight:'Kamu berjaya memilih jawapan tentang cerita.',correctAnswer:'Jawapan yang tepat:',penalty:'Dua mata ditolak. Kamu boleh meneruskan.'};
g.JoranQuestions40={fishing,questions,texts,counts:g.JoranPractice39.counts,images:g.JoranPractice39.images,forStory:(key,route)=>questions[key][route]};
const oldMake=g.JoranStory.lessonMake;
g.JoranStory.lessonMake=function(key,page,version=25){const doc=oldMake(key,page,version);if(version<40)return doc;const q=fishing[key][page];return {...doc,question:q.prompt,labels:q.options.map(o=>o.text),answer:q.answer,answerPictures:q.options.map(o=>o.image),outcomes:q.options.map((o,i)=>i===q.answer?'Jawapan tentang cerita ini tepat.':'Jawapan belum tepat. Baca semula cerita.')};};
})(globalThis);
