# Kemas kini V33: Studio semua suara

Pemain audio disatukan dan rakaman Guru boleh dieksport sebagai `public/suara-joran-minda.js` untuk peranti murid. Rujuk `SUARA-MELAYU.txt` untuk rakam, pulihkan dan terbitkan suara. **Kesemua 528 teks katalog kini mempunyai fail audio. Sebanyak 366 klip Melayu baharu melengkapkan 152 klip asal dan 10 klip TTSMaker pengguna.**

# Joran Minda V32

Permainan Bahasa Melayu Tahun 3 untuk satu PdP 60 minit, Formula BaCaNi dan buku cerita lengkap.

## Pembetulan V32

- Panorama tasik baharu memenuhi ruang permainan, dengan ikan pilihan di bawah permukaan air.
- Tajuk besar Latihan Pemulihan dipaparkan di dalam kotak latihan, bersama nama murid dan semakan awal, pada kedua-dua langkah.
- Pemulihan menjadi aktiviti suaikan tiga perbuatan dengan tiga nilai, diikuti ayat ringkas. Padanan disimpan bagi setiap murid; backend mengira ketepatan dan potongan mata.
- Ruang Guru mempunyai jadual dua lajur yang menerangkan keputusan secara terus. Eksport Excel mempunyai satu helaian Rekod Guru, tanpa helaian individu kosong di hadapan. Mata kumpulan dicatat sekali; semakan awal, latihan dan bacaan mengikut ahli.
- Sijil PDF dengan bingkai emas/hijau, motif daun dan ilustrasi tasik. Syarat semua aktiviti lengkap dikekalkan.
- Semakan buku boleh disunting seperti V31; aliran individu, kumpulan, rakaman bergilir dan pembersihan sejarah dikekalkan.

## Audio tersedia

152 klip asal, Yay dan klik dikekalkan. 10 arahan daripada fail TTSMaker pengguna serta 366 klip ms-MY-YasminNeural disertakan sebagai MP3 berasingan. Semua teks katalog boleh didengar tanpa suara Melayu peranti. Klip baharu diperiksa melalui tempoh, penyahkodan dan padanan metadata teks; semakan manusia terhadap sebutan masih diperlukan. Teks tambahan yang dicipta pengguna mungkin memerlukan rakaman baharu. Bacaan buku cerita Guru kini disertakan untuk semua 20 halaman menggunakan rakaman sebenar yang dimuat naik pengguna. Rakaman terbaharu setiap halaman dipilih dan ditukar kepada MP3 tanpa mengubah bacaan. Baca `SUARA-MELAYU.txt`.

`server/voice-autogen-v33.json` menyimpan teks, kategori, tempoh dan checksum setiap klip baharu. `scripts/generate-malay-edge.py` ialah alat penyediaan pilihan dengan edge-tts 7.3.1 dan ffmpeg/ffprobe; ia tidak dijalankan oleh pelayar atau proses build Netlify. Fail audio yang telah disediakan boleh terus diterbitkan.

## Menjalankan dan menerbitkan

`npm install`, `npm run dev`, `npm run build`, `npm test`.
Muat naik isi folder `joran-minda` ke akar repositori GitHub sedia ada. Netlify membaca `netlify.toml`, menggunakan folder `public` dan `netlify/functions`.
Sumber UI disimpan dalam `scripts/lesson-ui.js` dan lapisan V25 hingga V33; build menyegerakkannya ke `public/index.html`.
Pratonton HTML menyokong satu peranti. Bilik talian dan kamera menggunakan projek penuh.
Laman Netlify dan GitHub sedia ada belum dikemas kini secara automatik. Pakej mengandungi rakaman Guru sebenar bagi semua 20 halaman. Tiada data ujian murid atau kunci perkhidmatan disertakan.

## Aset visual V32

`public/assets/lake-panorama-v32.png` ialah PNG 2172 × 724 yang dijana dengan alat imagegen, mod suntingan berasaskan `public/assets/lake.webp`. Arahan visual: panorama permainan 3D mesra kanak-kanak di tasik Malaysia; Hana, Iman dan Tok Wan lengkap di jeti, kampung dan gunung merentasi seluruh lebar, air keratan rentas terbuka untuk ikan jawapan, tanpa teks atau ikan tertanam. Imej akhir disertakan dalam projek dan pratonton. Corak serta teks sijil dilukis melalui canvas dalam `scripts/lesson-v32.js`.

## Rakaman Guru siap diterbitkan

`public/suara-joran-minda.js` mengandungi 20 rakaman terbaharu yang sepadan dengan teks cerita semasa. Fail ini dimuatkan untuk semua pelawat, termasuk pelayar tanpa simpanan lama. Arahan AI kekal dalam `public/audio-ms`. `server/teacher-voice-v33.json` merekodkan pemilihan rakaman, tempoh dan checksum; `scripts/import-teacher-backup.py` ialah alat penyediaan daripada sandaran, bukan sebahagian proses build Netlify. Sandaran asal pengguna tidak diubah. Ketepatan bacaan lisan belum disemak oleh manusia.
