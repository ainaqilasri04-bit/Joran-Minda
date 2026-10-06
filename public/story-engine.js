(function(global){
  'use strict';
  const choose=(path,i,a,b)=>path[i]===1?b:a;
  const page=(title,sentences,evidence,clue,question,labels,outcomes)=>({title,sentences,evidence,clue,question,labels,outcomes});
const thirds={
 belang:[
 ['Bawa bantuan bersama','Hana memanggil Tok Wan, manakala Iman mengambil tuala bersih.','Lalu, Tok Wan mengeringkan Belang dengan tuala yang dibawa oleh Iman.'],
 ['Peti di beranda','Mereka menyediakan peti beralas kain lembut di beranda.','Kemudian, Belang berehat di dalam peti beralas kain lembut di beranda.'],
 ['Gilir menemani','Mereka bergilir-gilir menemani Belang supaya anak kucing itu berasa tenang.','Selepas ditemani secara bergilir-gilir, Belang mula mendekati Hana.'],
 ['Bahagikan tugas','Hana menjaga Belang, manakala Iman mengemas tempat rehatnya.',''],
 ['Pameran kenangan','Mereka mengadakan pameran gambar Belang untuk mengajak rakan menyayangi haiwan.','']
 ],
 pondok:[
 ['Bahagikan kerja','Hana mengutip buku, manakala Iman mengelap meja.','Kemudian, mereka meletakkan buku yang dikutip di atas meja yang bersih.'],
 ['Label rak buku','Mereka melabel rak supaya buku mudah dicari dan disimpan.','Seterusnya, setiap rak mempunyai label yang jelas.'],
 ['Hiasan dan penanda','Mereka membuat hiasan kertas dan penanda buku bersama-sama.','Selepas hiasan dan penanda buku siap, pondok itu kelihatan ceria.'],
 ['Jadual dan kad','Mereka menyediakan jadual mengemas dan kad peringatan untuk semua pembaca.',''],
 ['Sudut karya rakan','Mereka membuka sudut karya supaya rakan dapat mempamerkan hasil dan membaca bersama.','']
 ],
 pokok:[
 ['Periksa dan isi air','Hana memeriksa tanah, manakala Iman membantu Tok Wan mengisi baldi air.','Lalu, mereka menyiram tanah yang kering dengan air yang telah disediakan.'],
 ['Bersih dan susun','Mereka mengutip daun gugur sebelum menyusun pasu bersama Tok Wan.','Kemudian, Tok Wan memeriksa pasu yang tersusun di kawasan yang bersih.'],
 ['Label dan kad','Mereka menulis label pokok serta melukis kad penjagaan.','Seterusnya, label dan kad membantu mereka mengingati keperluan pokok.'],
 ['Jadual dan catatan','Mereka menyediakan jadual tugas serta mencatat pertumbuhan anak pokok.',''],
 ['Hari kebun bersama','Mereka mengadakan hari berkebun sambil berkongsi buku pengalaman dengan rakan.','']
 ],
 sihat:[
 ['Buah dan roti','Mereka menyediakan buah segar dan roti berinti di dalam bekas bertutup.','Selepas bekal buah dan roti disiapkan, mereka pergi ke tepi tasik.'],
 ['Bantu dan ingatkan','Mereka saling mengingatkan dan bergilir-gilir membasuh tangan dengan sabun.','Kemudian, mereka mengeringkan tangan setelah saling membantu menjaga kebersihan.'],
 ['Kongsi dan simpan','Mereka berkongsi sebahagian bekal dan menyimpan bakinya untuk dibawa pulang.','Selepas berkongsi bekal dan menyimpan bakinya, mereka mengemas bekas makanan.'],
 ['Bersihkan bersama','Hana mengumpulkan sampah, manakala Iman mengelap tempat makan.',''],
 ['Poster petua sihat','Mereka menghasilkan poster petua kebersihan untuk ditampal di dalam kelas.','']
 ]
};
const endingFacts={
 belang:[['Bantuan Tok Wan menenangkan Belang.','Tuala bersih membuat Belang selesa.','Tok Wan dan tuala bersih membantu Belang.'],['Belang berehat di dalam peti.','Belang berehat di atas kain.','Belang berehat di dalam peti beralas kain.'],['Hana duduk menemaninya.','Hana membaca cerita untuknya.','Mereka bergilir-gilir menemaninya.'],['Mereka bergilir-gilir menjaga Belang.','Mereka bergilir-gilir mengemas tempat rehat.','Mereka membahagikan tugas menjaga dan mengemas.']],
 pondok:[['Usaha bermula dengan mengutip buku.','Usaha bermula dengan mengelap meja.','Kerja mengutip dan mengelap dibahagikan.'],['Buku disusun mengikut jenis.','Buku disusun mengikut saiz.','Rak buku dilabel dengan jelas.'],['Hiasan menceriakan pondok.','Penanda buku sedia digunakan.','Hiasan dan penanda buku siap digunakan.'],['Jadual mengemas menjadi panduan.','Kad peringatan menjadi panduan.','Jadual dan kad menjadi panduan.']],
 pokok:[['Baldi air telah diisi.','Tanah telah diperiksa.','Tanah diperiksa dan baldi diisi.'],['Pasu dipindahkan ke tempat yang sesuai.','Daun gugur telah dikutip.','Daun dikutip dan pasu disusun.'],['Label pokok menjadi panduan.','Kad penjagaan menjadi panduan.','Label dan kad menjadi panduan.'],['Jadual tugas disediakan.','Pertumbuhan pokok dicatat.','Jadual dan catatan disediakan.']],
 sihat:[['Bekal buah telah disediakan.','Bekal roti telah disediakan.','Bekal buah dan roti telah disediakan.'],['Mereka membasuh tangan bergilir-gilir.','Mereka saling mengingatkan tentang kebersihan.','Mereka saling membantu dan mengingatkan.'],['Bekal dikongsi bersama.','Sebahagian bekal disimpan.','Bekal dikongsi dan bakinya disimpan.'],['Mereka mengumpulkan sampah.','Mereka mengelap tempat makan.','Mereka membahagikan tugas membersihkan tempat.']]
};
const finalProverbs={belang:'Mereka saling membantu bagai aur dengan tebing.',pondok:'Hana yang ringan tulang sentiasa rajin membantu.',pokok:'Mereka menjaga kebun bagai aur dengan tebing.',sihat:'Tok Wan berpesan bahawa mencegah lebih baik daripada mengubati.'};
function addThird(key,index,path,p){
 const third=thirds[key][index];p.labels.push(third[0]);p.outcomes.push(third[1]);
 if(index>0&&path[index-1]===2)p.sentences[0]=thirds[key][index-1][2];
 if(index===4){const f=endingFacts[key];const at=i=>f[i][[0,1,2].includes(path[i])?path[i]:0];p.sentences=['Akhirnya, usaha mereka membuahkan hasil. '+at(0)+' '+at(1),at(2)+' '+at(3),finalProverbs[key]];p.evidence=2;p.clue='Cari ayat yang mengandungi peribahasa dalam pengakhiran cerita.';}
 return p;
}

  function make(key,index,path=[]){
    const c=(i,a,b)=>choose(path,i,a,b);
    const data={
      belang:()=>[
        page('Bunyi di tepi jeti',[
          'Pada pagi Sabtu, Hana dan Iman berjalan bersama Tok Wan di tepi tasik.',
          'Hana terdengar bunyi anak kucing lalu mengajak mereka mencari puncanya.',
          'Seekor anak kucing bernama Belang sedang menggigil di tepi peti kayu.'
        ],1,'Cari ayat yang menunjukkan Hana mengambil berat.','Bagaimanakah mereka hendak membantu Belang?',
        ['Panggil Tok Wan','Ambil tuala bersih'],['Hana meminta Tok Wan membantu Belang.','Iman mengambil tuala bersih untuk mengeringkan Belang.']),
        page('Bantuan untuk Belang',[
          c(0,'Lalu, Tok Wan mendekati Belang dengan tenang.','Lalu, Tok Wan menggunakan tuala yang dibawa oleh Iman.'),
          'Belang masih kelihatan takut selepas bulunya dikeringkan.',
          'Hana bercakap dengan lembut supaya Belang berasa selamat.'
        ],2,'Cari ayat yang menunjukkan Hana menenangkan Belang.','Apakah tempat rehat yang sesuai untuk Belang?',
        ['Alas peti kayu','Bentang kain lembut'],['Mereka mengalas peti kayu dengan tuala bersih.','Mereka membentangkan kain lembut di sudut beranda.']),
        page('Belang mula tenang',[
          c(1,'Kemudian, Belang berehat di dalam peti yang beralas tuala.','Kemudian, Belang berehat di atas kain lembut di beranda.'),
          'Iman meletakkan semangkuk air bersih berhampiran Belang.',
          'Hana tersenyum apabila Belang berhenti menggigil.'
        ],1,'Cari ayat yang menunjukkan Iman menjaga keperluan Belang.','Bagaimanakah mereka hendak menemani Belang?',
        ['Duduk dengan tenang','Baca cerita perlahan'],['Hana dan Iman duduk dengan tenang di sisi Belang.','Hana membaca cerita dengan suara perlahan di sisi Belang.']),
        page('Janji sahabat',[
          c(2,'Selepas ditemani dengan tenang, Belang mula mendekati Hana.','Selepas mendengar suara Hana, Belang mula mendekatinya.'),
          'Tok Wan menyediakan makanan yang sesuai untuk Belang.',
          'Hana dan Iman menawarkan diri untuk membantu menjaga Belang.'
        ],2,'Cari ayat yang menunjukkan Hana dan Iman sanggup membantu.','Apakah tanggungjawab yang mereka mahu utamakan?',
        ['Gilir menjaga Belang','Gilir mengemas tempat'],['Mereka membuat jadual untuk bergilir-gilir menjaga Belang.','Mereka membuat jadual untuk bergilir-gilir mengemas tempat rehat Belang.']),
        page('Sahabat yang penyayang',[
          c(0,'Akhirnya, bantuan Tok Wan berjaya menenangkan Belang.','Akhirnya, tuala bersih itu membantu Belang berasa selesa.'),
          c(1,'Belang kini selesa di dalam peti.','Belang kini selesa di atas kain lembut.')+' '+c(2,'Hana menemaninya dengan tenang.','Hana membacakan cerita untuknya.'),
          c(3,'Mereka bergilir-gilir menjaga Belang bagai aur dengan tebing.','Mereka bergilir-gilir mengemas tempat rehat Belang bagai aur dengan tebing.')
        ],2,'Cari ayat yang menunjukkan mereka saling membantu.','Bagaimanakah kisah persahabatan ini berakhir?',
        ['Buku kenangan Belang','Poster sayangi haiwan'],['Mereka menghasilkan buku kenangan tentang sahabat baharu mereka.','Mereka menghasilkan poster untuk mengajak rakan menyayangi haiwan.'])
      ],
      pondok:()=>[
        page('Pondok yang sunyi',[
          'Pada hari Ahad, Hana dan Iman mengunjungi pondok bacaan bersama Tok Wan.',
          'Hana menawarkan diri untuk mengemas pondok yang berdebu itu.',
          'Beberapa buku berselerak di atas lantai.'
        ],1,'Cari ayat yang menunjukkan Hana rajin membantu.','Apakah kerja yang mahu dimulakan dahulu?',
        ['Kutip buku','Lap meja'],['Hana dan Iman mengutip buku lalu memasukkannya ke dalam bakul.','Hana dan Iman mengelap meja supaya buku dapat diletakkan di situ.']),
        page('Buku diselamatkan',[
          c(0,'Kemudian, mereka membawa bakul buku ke meja.','Kemudian, mereka mengutip buku lalu meletakkannya di atas meja yang bersih.'),
          'Tok Wan memeriksa sebuah rak yang senget.',
          'Iman membantu Hana menyusun buku dengan cermat.'
        ],2,'Cari ayat yang menunjukkan Iman bekerjasama dengan Hana.','Bagaimanakah buku itu hendak disusun?',
        ['Ikut jenis cerita','Ikut saiz buku'],['Mereka mengasingkan buku mengikut jenis cerita.','Mereka menyusun buku mengikut saiz supaya mudah diambil.']),
        page('Sentuhan kreatif',[
          c(1,'Seterusnya, buku haiwan dan buku pengembaraan disusun dalam kumpulan berbeza.','Seterusnya, buku besar dan buku kecil disusun dengan kemas.'),
          'Hana berkongsi kertas berwarna dengan Iman untuk menceriakan pondok.',
          'Tok Wan telah membetulkan rak itu.'
        ],1,'Cari ayat yang menunjukkan Hana sudi berkongsi.','Apakah hasil kreatif yang mahu mereka buat?',
        ['Hiasan kertas','Penanda buku'],['Mereka menghasilkan hiasan bunga dan ikan daripada kertas.','Mereka menghasilkan penanda buku daripada kertas berwarna.']),
        page('Pondok milik bersama',[
          c(2,'Selepas hiasan siap digantung, pondok itu kelihatan ceria.','Selepas penanda buku siap dibuat, mereka menyimpannya di dalam bekas.'),
          'Tok Wan mengajak mereka membaca sebuah cerita.',
          'Iman mengemas sisa kertas sebelum duduk bersama Hana.'
        ],2,'Cari ayat yang menunjukkan Iman bertanggungjawab selepas aktiviti.','Bagaimanakah mereka mahu menjaga pondok ini?',
        ['Jadual mengemas','Kad peringatan'],['Mereka menyediakan jadual mengemas secara bergilir-gilir.','Mereka menyediakan kad peringatan supaya buku dipulangkan ke tempatnya.']),
        page('Pondok kembali ceria',[
          c(0,'Akhirnya, usaha yang bermula dengan mengutip buku membuahkan hasil.','Akhirnya, usaha yang bermula dengan mengelap meja membuahkan hasil.'),
          c(1,'Buku disusun mengikut jenis.','Buku disusun mengikut saiz.')+' '+c(2,'Hiasan kertas menceriakan pondok.','Penanda buku sedia digunakan.'),
          'Hana yang ringan tulang membantu menyiapkan '+c(3,'jadual mengemas.','kad peringatan.')
        ],2,'Cari ayat yang menunjukkan Hana rajin membantu.','Bagaimanakah mereka mahu meraikan pondok ini?',
        ['Baca bersama rakan','Pamerkan karya'],['Mereka menjemput rakan membaca bersama-sama di pondok itu.','Mereka mengadakan pameran kecil hasil karya di pondok itu.'])
      ],
      pokok:()=>[
        page('Kebun yang dahaga',[
          'Pada suatu pagi, Hana dan Iman melawat kebun Tok Wan.',
          'Beberapa anak pokok kelihatan layu akibat cuaca panas.',
          'Hana segera menawarkan bantuan untuk menjaga anak pokok itu.'
        ],2,'Cari ayat yang menunjukkan Hana prihatin terhadap anak pokok.','Apakah bantuan yang mahu dimulakan dahulu?',
        ['Isi baldi air','Periksa tanah'],['Hana mengisi baldi air dengan bantuan Tok Wan.','Hana memeriksa tanah di dalam pasu dengan bimbingan Tok Wan.']),
        page('Air untuk anak pokok',[
          c(0,'Lalu, Tok Wan membawa baldi yang telah diisi ke tepi pasu.','Lalu, Tok Wan menunjukkan tanah yang kering lalu membawa air.'),
          'Iman membantu Hana menyiram anak pokok dengan cermat.',
          'Daun yang gugur berselerak di sekitar pasu.'
        ],1,'Cari ayat yang menunjukkan Iman bekerjasama dengan Hana.','Apakah langkah seterusnya untuk menjaga kebun?',
        ['Pindah pasu kecil','Kutip daun gugur'],['Mereka memindahkan pasu kecil ke tempat yang sesuai dengan bantuan Tok Wan.','Mereka mengutip daun yang gugur supaya kawasan pasu menjadi bersih.']),
        page('Kenali keperluan pokok',[
          c(1,'Kemudian, Tok Wan memeriksa pasu yang telah dipindahkan.','Kemudian, Tok Wan memeriksa kawasan pasu yang telah dibersihkan.'),
          'Setiap jenis pokok memerlukan penjagaan yang sesuai.',
          'Hana mendengar penerangan Tok Wan dengan teliti sebelum bertindak.'
        ],2,'Cari ayat yang menunjukkan Hana menghormati nasihat Tok Wan.','Bagaimanakah mereka mahu mengingati pesanan Tok Wan?',
        ['Tulis label pokok','Lukis kad penjagaan'],['Mereka menulis keperluan setiap pokok pada label.','Mereka melukis kad penjagaan untuk setiap jenis pokok.']),
        page('Tanggungjawab bersama',[
          c(2,'Seterusnya, mereka meletakkan label berhampiran pasu.','Seterusnya, mereka menyimpan kad penjagaan di dalam sebuah buku.'),
          'Iman berjanji untuk membantu Tok Wan menjaga kebun setiap minggu.',
          'Hana mahu melihat perubahan pada anak pokok itu.'
        ],1,'Cari ayat yang menunjukkan Iman sanggup memikul tanggungjawab.','Bagaimanakah mereka mahu meneruskan usaha ini?',
        ['Buat jadual tugas','Catat pertumbuhan'],['Mereka menyediakan jadual tugas untuk menjaga kebun.','Mereka menyediakan buku catatan pertumbuhan anak pokok.']),
        page('Kebun kembali segar',[
          c(0,'Beberapa hari kemudian, anak pokok yang telah disiram kembali segar.','Beberapa hari kemudian, penjagaan tanah dan siraman membantu pokok kembali segar.'),
          c(1,'Pasu tersusun di tempat yang sesuai.','Kawasan pasu bebas daripada daun gugur.')+' '+c(2,'Label pokok menjadi panduan.','Kad penjagaan menjadi panduan.'),
          'Mereka bekerja bagai aur dengan tebing sambil menggunakan '+c(3,'jadual tugas.','buku catatan.')
        ],2,'Cari ayat yang menunjukkan mereka bekerjasama menjaga kebun.','Bagaimanakah usaha mereka mahu dikongsi?',
        ['Ajak rakan berkebun','Hasilkan buku kebun'],['Mereka mengajak rakan membantu menjaga kebun Tok Wan.','Mereka menghasilkan buku kecil tentang pengalaman menjaga kebun.'])
      ],
      sihat:()=>[
        page('Bekal untuk berkelah',[
          'Pada pagi Sabtu, Hana dan Iman menyediakan bekal bersama Tok Wan.',
          'Hana membasuh tangan sebelum membantu menyediakan makanan.',
          'Tok Wan menyediakan air kosong untuk dibawa ke tepi tasik.'
        ],1,'Cari ayat yang menunjukkan Hana menjaga kebersihan diri.','Apakah bekal yang mahu mereka sediakan?',
        ['Buah segar','Roti berinti'],['Mereka menyediakan buah segar di dalam bekas bertutup.','Mereka menyediakan roti berinti di dalam bekas bertutup.']),
        page('Bersih sebelum makan',[
          c(0,'Selepas bekal buah disiapkan, mereka pergi ke tepi tasik.','Selepas bekal roti disiapkan, mereka pergi ke tepi tasik.'),
          'Hana dan Iman bermain sebentar sehingga tangan mereka terkena tanah.',
          'Tok Wan mengajak mereka membasuh tangan dengan sabun sebelum makan.'
        ],2,'Cari ayat yang menunjukkan Tok Wan mengingatkan mereka tentang kebersihan.','Bagaimanakah mereka mahu saling membantu?',
        ['Basuh bergilir-gilir','Saling ingatkan'],['Mereka membasuh tangan dengan sabun secara bergilir-gilir.','Mereka saling mengingatkan supaya membasuh tangan dengan sabun.']),
        page('Bekal yang dinikmati',[
          c(1,'Kemudian, mereka mengeringkan tangan selepas membasuhnya secara bergilir-gilir.','Kemudian, mereka mengeringkan tangan setelah saling mengingatkan tentang kebersihan.'),
          'Iman memastikan bekas makanan ditutup selepas dibuka.',
          'Tok Wan mengajak mereka duduk di tempat yang teduh.'
        ],1,'Cari ayat yang menunjukkan Iman menjaga kebersihan makanan.','Bagaimanakah bekal itu mahu digunakan?',
        ['Kongsi bekal','Simpan sebahagian'],['Mereka berkongsi bekal sambil berbual dengan gembira.','Mereka makan secukupnya lalu menyimpan sebahagian bekal untuk dibawa pulang.']),
        page('Tempat berkelah yang bersih',[
          c(2,'Selepas berkongsi bekal, mereka mengemas bekas makanan.','Selepas menyimpan baki bekal, mereka mengemas bekas makanan.'),
          'Tok Wan melipat tikar yang telah digunakan.',
          'Hana mengajak Iman membersihkan tempat berkelah sebelum pulang.'
        ],2,'Cari ayat yang menunjukkan Hana bertanggungjawab terhadap kebersihan tempat.','Apakah tugas yang mahu mereka dahulukan?',
        ['Kumpul sampah','Lap tempat makan'],['Mereka mengumpulkan sampah untuk dibuang ke dalam tong.','Mereka mengelap tempat makan dan membawa pulang semua sampah.']),
        page('Pesanan yang diingati',[
          'Akhirnya, '+c(0,'bekal buah','bekal roti')+' mereka '+c(2,'telah dikongsi bersama.','masih berbaki untuk dibawa pulang.'),
          'Mereka '+c(1,'membasuh tangan bergilir-gilir','saling mengingatkan supaya membasuh tangan')+' dan '+c(3,'mengumpulkan sampah selepas makan.','mengelap tempat makan sebelum pulang.'),
          'Tok Wan berpesan bahawa mencegah lebih baik daripada mengubati.'
        ],1,'Cari ayat yang menunjukkan amalan kebersihan mereka.','Bagaimanakah mereka mahu mengingati pesanan ini?',
        ['Buku petua bersih','Lagu kebersihan'],['Mereka menghasilkan buku petua kebersihan untuk dikongsi dengan rakan.','Mereka mencipta lagu kebersihan untuk dinyanyikan bersama rakan.'])
      ]
    };
    if(!data[key]||!Number.isInteger(index)||index<0||index>4)throw new Error('Muka surat tidak sah.');
    return addThird(key,index,path,data[key]()[index]);
  }
  function text(key,index,path){const p=make(key,index,path);return p.sentences.join(' ')+([0,1,2].includes(path[index])?' '+p.outcomes[path[index]]:'');}
  global.JoranStory={make,text,keys:['belang','pondok','pokok','sihat'],version:8};
})(globalThis);
