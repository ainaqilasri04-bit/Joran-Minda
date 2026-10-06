# Joran Minda — versi 20

Permainan Bahasa Melayu Tahun 3 berasaskan Baca, Cari, Nilai. Pilih mod individu atau berkumpulan empat ahli. Lengkapkan lima muka surat, jawab bonus peribahasa dan hasilkan buku PDF.

## GitHub → Netlify

1. Ekstrak ZIP. Buka folder **joran-minda**.
2. Di GitHub, pilih **Add file → Upload files**. Seret semua kandungan di dalam folder itu. `package.json`, `netlify.toml`, `public`, `server` dan `netlify` mesti berada pada aras utama repositori. Tekan **Commit changes**. Muat naik fail dan folder yang telah diekstrak, bukan ZIP atau fail HTML tunggal.
3. Di Netlify, pilih **Add new project → Import an existing project → GitHub**. Pilih repositori tersebut dan benarkan akses yang diperlukan.
4. Semak tetapan berikut, kemudian pilih **Deploy**:

| Tetapan | Nilai |
| --- | --- |
| Base directory | Kosong |
| Build command | `npm run build` |
| Publish directory | `public` |
| Functions directory | `netlify/functions` |
| Node.js | `22`, sudah ditetapkan dalam `netlify.toml` |

Netlify memasang kebergantungan melalui `package-lock.json`. Fungsi bilik menggunakan Netlify Blobs melalui persekitaran Netlify; tiada kunci AI diperlukan untuk memainkan suara yang dibekalkan. Pakej ini mengandungi kurang daripada 100 fail, setiap satu di bawah 25 MiB, untuk memudahkan muat naik melalui pelayar GitHub.

Untuk repositori sedia ada, muat naik ke aras yang sama. Fail audio lama yang tidak lagi dirujuk boleh kekal; manifest baharu menggunakan audio versi 20. Setelah repositori dipautkan, commit seterusnya mencetuskan binaan Netlify secara automatik. Pakej ini belum diterbitkan melalui akaun pengguna.

Dokumentasi rasmi: [GitHub: muat naik fail](https://docs.github.com/en/repositories/working-with-files/managing-files/adding-a-file-to-a-repository), [Netlify: import repositori](https://docs.netlify.com/start/quickstarts/deploy-from-repository/), [Netlify: konfigurasi](https://docs.netlify.com/build/configure-builds/file-based-configuration/).

## Suara dan muzik

- Sepuluh skrip arahan umum dijana semula menggunakan suara Yasmin, Bahasa Melayu Malaysia (`ms-MY`), pada tempo hampir semula jadi. Skrip disertakan dalam `SKRIP-ARAHAN.txt`.
- Audio soalan dan pilihan sedia ada diproses secara tempatan: tempo diselaraskan, kelantangan diseragamkan dan hujung audio dilembutkan. Soalan serta pilihan cerita tidak dihantar semula ke perkhidmatan suara.
- Terdapat 152 padanan audio. Bacaan perenggan cerita tetap menggunakan rakaman Guru.
- Muzik **dimatikan secara lalai**. Apabila dihidupkan, tahap awalnya 12% dan maksimum 30%, menggunakan nada latar lembut tanpa melodi loceng berulang. Muzik berhenti ketika suara, sorakan atau rakaman dimainkan.
- Sorakan awal 40%, maksimum 2.6 saat, dengan pencegahan main bertindih. Sorakan menggunakan fail **Children Yay! Sound Effect.mp3** yang diberikan oleh pengguna: senyap awal dibuang, petikan 2.6 saat digunakan, kelantangan diseragamkan dan penghujung dilembutkan.
- **Bunyi Yay yang diminta sudah disertakan** dan dimainkan apabila murid menjawab dengan betul atau berjaya memancing. Guru boleh memuat naik MP3/WAV/M4A melalui **Tetapan → Sorakan pilihan Guru**. Pilihan itu disimpan pada pelayar berkenaan. Untuk menggunakannya bagi semua murid, gantikan `public/audio-ms/yeay.mp3` dengan MP3 yang dikehendaki dan commit perubahan.
- Halaman `public/audio-ms/semak-suara.html` membolehkan Guru mendengar setiap klip. Pengesahan teknikal bukan pengesahan sebutan manusia.

## Gambar dan rakaman

Gambar penuh menggunakan aset asal: ilustrasi 1536 × 1024, kulit 1024 × 1536, dan ikan 1774 × 887. Gambar cerita dipaparkan mengikut nisbah asal tanpa dipotong; **Besarkan gambar** membuka paparan yang lebih luas. Tiada gambar kecil daripada pratonton chat digunakan dalam pakej ini.

Untuk merakam cerita, buka **Guru: Rakam suara**, pilih cerita dan halaman, rakam atau muat naik audio, kemudian semak semula. Rakaman perlu sepadan dengan teks cabang cerita. Rakaman suara Guru belum dimasukkan. Mikrofon dan kamera memerlukan kebenaran pelayar; laman Netlify menggunakan HTTPS.

## Cuba pada komputer

`MAIN-JORAN-MINDA.html` membuka permainan pada peranti ini. Mod individu dan kumpulan satu peranti boleh dicuba tanpa bilik dalam talian. Untuk pembangunan tempatan: `npm ci`, `npm test`, `npm run build`, kemudian `npm run dev`.

Muat turun PDF menghasilkan kulit dan lima muka surat. Penerbitan buku ke Heyzine dilakukan melalui akaun sendiri.
