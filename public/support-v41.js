(function(g){'use strict';
const cameraSteps=[
 'Tekan Guna kamera. Kemudian, tekan Buka kamera dan pilih Benarkan.',
 'Tunjukkan seluruh tangan. Halakan jari telunjuk kepada ikan pilihan kamu.',
 'Rapatkan ibu jari dan jari telunjuk sehingga ikan dipilih.',
 'Angkat tangan sedikit untuk menarik ikan.'
];
const proofPrompts={
 belang:['Anak kucing itu basah dan menggigil. Siapakah yang dipanggil oleh Hana untuk membantu anak kucing itu?','Bagaimanakah Hana dan Iman menyediakan tempat rehat Belang bersama-sama?'],
 pondok:['Hana melihat pondok yang berdebu. Apakah tindakan Hana untuk mengemas pondok itu?','Bagaimanakah Iman membantu Hana memindahkan buku ke atas meja?'],
 pokok:['Anak pokok itu layu. Apakah bantuan yang ditawarkan oleh Hana?','Bagaimanakah Iman membantu Hana memberi air kepada anak pokok?'],
 sihat:['Sebelum makan, apakah yang Hana dan Iman lakukan supaya tangan mereka bersih?','Sebelum pulang, apakah yang Hana dan Iman kumpulkan untuk membersihkan tempat berkelah?']
};
g.JoranSupport41={cameraSteps,camera:cameraSteps.join(' '),cameraChoice:'Kamu juga boleh menggunakan kamera. Ikut panduan di bawah.',preview:'Kamera tersedia dalam projek penuh di Netlify. Dalam pratonton ini, pilih ikan dengan klik atau sentuhan.',proofPrompts};
g.JoranPractice39.proofPrompts=proofPrompts;
g.JoranPractice39.camera=cameraSteps.join(' ');
})(globalThis);
