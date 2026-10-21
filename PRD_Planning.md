# PRD — Web App LKPD Digital: Membuat Konten TikTok Kelas X

**Versi:** 0.3 — Pembaruan status backend dan integrasi  
**Tanggal:** 22 Oktober 2026  
**Sumber utama:** `LKPD_Konten_TikTok_Kelas_X.docx`  
**Platform rencana:** Google Apps Script Web App + Google Sheets; Google Drive untuk tautan video  
**Status:** Baseline PRD disepakati; prototipe `Index.html` tersedia; `Code.gs` backend dan dokumentasi awal telah disusun. Front-end masih memakai simulasi dan belum terhubung ke Google Sheets. Belum ada deployment atau uji runtime/produksi.

---

## 1. Tujuan aplikasi

Mengubah LKPD cetak **“Membuat Konten Media Sosial TikTok”** untuk kegiatan kokurikuler kelas X Fase E di SMA Negeri 1 Bancar menjadi aplikasi web yang nyaman digunakan dari ponsel. Aplikasi harus mempertahankan urutan, tujuan, istilah, serta tugas pada LKPD sumber dan membantu siswa mengisi tugas secara digital, menyimpan progres, menyerahkan hasil, serta membantu guru memantau dan menilai pekerjaan.

### Tujuan pembelajaran yang dipertahankan
- Menyusun ide, naskah, dan storyboard video TikTok yang menarik, bermanfaat, dan bertanggung jawab.
- Memproduksi dan menyunting video berdurasi 30–60 detik dengan format vertikal 9:16 secara kolaboratif.
- Menerapkan etika bermedia: izin merekam, privasi, hak cipta, bebas hoaks, SARA, dan perundungan.
- Menyajikan karya dan merefleksikan proses belajar menggunakan istilah yang tepat.

### Hasil yang diharapkan
1. Siswa mengisi LKPD secara bertahap melalui HP atau komputer.
2. Jawaban tersimpan ke Google Sheets dan dapat dilanjutkan kembali.
3. Setiap kelompok dapat mencatat perencanaan, peran, storyboard, logbook, pemeriksaan kualitas, dan informasi video final.
4. Siswa dapat mengisi bagian individu dan penilaian antarteman secara terpisah dari jawaban kelompok.
5. Guru dapat memantau kemajuan, memeriksa berkas/tautan yang dikumpulkan, memasukkan nilai LKPD, dan memberi catatan.

## 2. Target pengguna, peran, dan hak akses

### 2.1 Siswa
- Mengakses kelompok yang menjadi bagiannya.
- Mengisi Bagian A secara individu.
- Mengisi Bagian B–E bersama kelompok.
- Mengisi penilaian antarteman dan refleksi individu pada Bagian F secara pribadi.
- Menyimpan draf, memperbarui jawaban, melihat status penyelesaian, dan mengumpulkan tugas.
- Tidak dapat melihat jawaban pribadi siswa lain atau mengubah nilai/catatan guru.

### 2.2 Guru
- Melihat daftar siswa dan kelompok yang terdaftar.
- Memantau progres pengisian dan status pengumpulan.
- Membuka jawaban kelompok dan jawaban individu sesuai kebutuhan penilaian.
- Memeriksa tautan video dan komponen tugas yang diserahkan.
- Memasukkan nilai LKPD dan catatan guru.
- Mengunci atau membuka kembali pengumpulan bila diperlukan, dengan tindakan yang jelas tercatat.

### 2.3 Administrator aplikasi
Untuk versi awal, administrator dapat dirangkap oleh guru yang ditunjuk. Administrator mengatur daftar pengguna/role, kelompok, tahun atau sesi pembelajaran, dan konfigurasi dasar. Tidak perlu membuat role administrator terpisah bila guru hanya membutuhkan pengaturan sederhana.

### 2.4 Asumsi autentikasi awal
Rekomendasi awal adalah membatasi akses ke akun Google Workspace sekolah bila sekolah memang memilikinya. Hak akses harus diverifikasi di sisi server, bukan hanya dengan menyembunyikan tombol di tampilan. Jangan menyimpan kata sandi di Google Sheets.

**Pertanyaan terbuka penting:** apakah guru dan siswa SMA Negeri 1 Bancar memiliki akun Google Workspace sekolah yang dapat digunakan? Jika tidak, model akses perlu diputuskan ulang sebelum prototipe/backend. Aplikasi tidak boleh dianggap aman hanya karena URL-nya tidak dipublikasikan.

## 3. Cakupan fitur

### 3.1 Fitur inti versi pertama (MVP)

| Modul | Perilaku yang dibutuhkan | Sumber LKPD |
|---|---|---|
| Beranda siswa | Menampilkan identitas sesi/kelompok, progres, dan bagian yang perlu dilanjutkan | Alur LKPD |
| Identitas kelompok | Nama kelompok, kelas/hari-tanggal, anggota kelompok; dukung hingga 5 anggota sesuai format sumber | Sampul/identitas |
| Bagian A — Pertanyaan Pemantik | Form individu: nama dan tiga pertanyaan tentang video menarik, viral vs bermanfaat, serta keamanan unggahan | Bagian A |
| Bagian B.1 — Istilah Kunci | Lima istilah dan pencocokan pengertian: Hook, Storyboard, CTA, Engagement, rasio 9:16 | Bagian B.1 |
| Bagian B.2 — Anatomi Video | Judul/topik, hook, pesan utama, CTA, alasan menarik | Bagian B.2 |
| Bagian B.3 — Etika Digital | Contoh pelanggaran dan cara menghindari untuk izin merekam, privasi/data pribadi, hak cipta, hoaks, SARA/perundungan siber | Bagian B.3 |
| Bagian C.1 — Kartu Ide | Topik, target penonton, pesan utama, hook, CTA, sudut pandang pembeda | Bagian C.1 |
| Bagian C.2 — Pembagian Peran | Penulis naskah, sutradara, kameramen/talent, editor, pencatat logbook; satu orang boleh merangkap bila kelompok berisi 4 siswa | Bagian C.2 |
| Bagian C.3 — Naskah | Hook (0–3 detik), isi pesan, CTA | Bagian C.3 |
| Bagian C.4 — Storyboard | 4–6 adegan; visual/sudut kamera, teks/dialog/narasi, audio/musik, durasi; total 30–60 detik; rasio 9:16 | Bagian C.4 |
| Bagian C.5 — Kesiapan Produksi | Lokasi, properti/perlengkapan, aplikasi editing, sumber musik/suara bebas hak cipta, konfirmasi izin orang yang direkam | Bagian C.5 |
| Bagian D — Logbook | Catatan kemajuan pada rentang 40–47, 47–55, 55–65; kendala, dugaan penyebab, solusi, hasil; empat pemeriksaan teknis | Bagian D |
| Bagian E.1 — Uji Kualitas | Checklist hook, pesan, audio/teks, format, etika/keamanan; kolom perbaikan | Bagian E.1 |
| Bagian E.2 — Kemasan Video | Deskripsi cover, caption, 3–5 hashtag relevan, kredit musik/gambar, nama file video final | Bagian E.2 |
| Bagian F.1 — Tanggapan Kelompok | Kelompok yang ditanggapi, skor 1–4, hal yang bagus, saran | Bagian F.1 |
| Bagian F.2 — Penilaian Antarteman | Hingga tiga teman; skor 1–4 untuk kontribusi aktif, menghargai pendapat, tanggung jawab; total | Bagian F.2 |
| Bagian F.3 — Refleksi Kelompok | Tiga pertanyaan refleksi kelompok | Bagian F.3 |
| Bagian F.4 — Refleksi Individu | Tiga pertanyaan refleksi individu | Bagian F.4 |
| Pengumpulan | Status komponen: video final, naskah/storyboard, logbook, cover/caption/hashtag, penilaian antarteman/refleksi | Pengumpulan |
| Dashboard guru | Daftar kelompok/siswa, status progres dan pengumpulan, akses jawaban, input nilai LKPD, catatan guru | Alur penilaian sumber |
| Penyimpanan progres | Simpan draf dan waktu perubahan; status draf/dikumpulkan | Kebutuhan digital, usulan implementasi |

### 3.2 Logika bisnis khusus
- Bagian A dan F.4 adalah jawaban individu; Bagian B–E adalah pekerjaan kelompok; Bagian F memiliki komponen kelompok dan individu.
- Perubahan data kelompok tidak boleh menimpa jawaban individu siswa.
- Storyboard mengakomodasi 4–6 adegan dan menampilkan total durasi. Sistem memberi peringatan jika durasi total di luar 30–60 detik, tanpa menghapus jawaban.
- Hashtag diarahkan untuk 3–5 tag relevan.
- Skor untuk tanggapan kelompok dan penilaian antarteman memakai skala 1–4 sesuai LKPD.
- Nilai akhir LKPD ditulis oleh guru. Dokumen sumber tidak menyediakan rubrik pembobotan nilai akhir; versi awal tidak akan mengarang bobot atau nilai otomatis resmi.
- Publikasi ke akun TikTok publik bersifat opsional dan hanya setelah kurasi guru serta persetujuan peserta didik yang tampil dan orang tua/wali, sesuai catatan pada dokumen sumber.

### 3.3 Di luar cakupan MVP
- Membuat atau mengedit video langsung di aplikasi.
- Mengunggah otomatis ke TikTok atau mengakses API TikTok.
- Analitik engagement TikTok secara otomatis.
- Penilaian otomatis berbasis AI.
- Membuat video dapat diakses publik secara otomatis.
- Sistem LMS lengkap untuk banyak sekolah atau banyak mata pelajaran.

### 3.4 Fitur tambahan yang disarankan
1. **Simpan draf otomatis** saat siswa mengubah isian, ditambah indikator kapan terakhir tersimpan.
2. **Indikator progres per bagian** dan validasi sederhana untuk mencegah bagian wajib terlewat.
3. **Rekap pengumpulan guru** dengan filter kelas/kelompok/status dan pencarian.

Ketiga fitur ini direkomendasikan untuk MVP kecuali pengguna meminta penyederhanaan.

## 4. Alur kerja pengguna

### 4.1 Alur siswa
1. Membuka Web App dan masuk melalui metode akses yang diputuskan.
2. Melihat petunjuk singkat, tujuan, dan alur 90 menit.
3. Mengisi Bagian A secara individu.
4. Bergabung/membuka kelompok dan mengerjakan Bagian B–E bersama.
5. Mengisi Bagian F: tanggapan kelompok, penilaian teman secara pribadi, refleksi kelompok, dan refleksi individu.
6. Memasukkan tautan Google Drive video final dan status/tautan dokumen pendukung sesuai komponen pengumpulan.
7. Meninjau ringkasan, menyatakan pengumpulan, lalu melihat status terkirim atau perlu perbaikan.

### 4.2 Alur guru
1. Masuk ke dashboard guru.
2. Melihat progres tiap kelompok dan komponen yang belum dikumpulkan.
3. Membuka jawaban, memeriksa tautan video serta hasil kerja.
4. Memasukkan nilai LKPD dan catatan.
5. Mengubah status menjadi telah diperiksa atau perlu perbaikan jika alur tersebut diaktifkan.

## 5. Struktur data awal Google Sheets

Nama sheet dan kolom di bawah merupakan rancangan awal dan dapat disesuaikan sebelum integrasi. Setup database harus membuat sheet yang belum ada dan menambahkan header hanya untuk sheet baru; tidak boleh menghapus atau menimpa data lama.

| Sheet | Kolom awal yang disarankan | Kegunaan |
|---|---|---|
| `Konfigurasi` | key, value, updatedAt | Nama sekolah, sesi, konfigurasi umum; jangan taruh rahasia/token di sini |
| `Pengguna` | userId, email, nama, role, kelas, aktif, createdAt | Pemetaan identitas dan hak akses; tidak menyimpan kata sandi |
| `Kelompok` | groupId, namaKelompok, kelas, tanggalKegiatan, createdBy, status, createdAt, updatedAt | Data kelompok/sesi |
| `AnggotaKelompok` | membershipId, groupId, userId, namaTampilan, status | Relasi anggota dengan kelompok |
| `JawabanIndividu` | responseId, userId, groupId, bagian, payloadJson, status, updatedAt, submittedAt | Jawaban A, penilaian antarteman, refleksi pribadi; payload tervalidasi oleh server |
| `JawabanKelompok` | responseId, groupId, bagian, payloadJson, status, updatedBy, updatedAt, submittedAt | Jawaban B–E, refleksi kelompok, dan data bersama |
| `Pengumpulan` | submissionId, groupId, jenisProduk, urlDrive, namaFile, status, submittedAt, checkedBy, checkedAt | Tautan dan status lima komponen pengumpulan |
| `PenilaianGuru` | gradingId, groupId, userIdOpsional, nilaiLKPD, catatanGuru, graderEmail, updatedAt | Nilai LKPD dan catatan guru; nilai individu hanya bila guru menetapkan alurnya |
| `LogAktivitas` | logId, timestamp, actorEmail, action, entityType, entityId, outcome | Catatan aktivitas penting untuk audit dan penelusuran masalah, dengan minimisasi data |

### Catatan rancangan data
- Struktur `payloadJson` memudahkan menyimpan formulir dinamis, tetapi bentuk dan batas panjang payload harus ditetapkan di kode server. Data penting untuk rekap dapat dipisah ke kolom khusus bila diperlukan.
- Jangan menaruh seluruh jawaban individu ke satu baris jawaban kelompok.
- Validasi izin pengguna, kepemilikan kelompok, jenis bagian, format tautan, panjang teks, jumlah adegan, nilai 1–4, dan status dilakukan di server.
- Teks yang dimulai karakter formula spreadsheet harus dinetralkan sebelum disimpan sebagai teks untuk mencegah formula injection.
- Gunakan `LockService` untuk operasi tulis yang perlu menghindari benturan, dan ID unik untuk entri; kebutuhan bersamaan tetap perlu diuji.
- Google Sheets sesuai untuk uji coba satu kelas atau skala kecil-menengah, tetapi kapasitas dan konkurensi perlu dievaluasi jika jumlah pengguna meningkat.

## 6. Keamanan, privasi, dan akses

1. **Akses terbatas:** utamakan domain Google Workspace sekolah bila tersedia. Jika tidak tersedia, sepakati alternatif sebelum membuat autentikasi.
2. **Pemeriksaan server-side:** tiap operasi yang dilindungi memeriksa email/identitas dan role dari sumber tepercaya. Tombol tersembunyi di front-end bukan kontrol keamanan.
3. **Hak minimum:** siswa hanya boleh membaca/menulis jawaban miliknya dan jawaban kelompok tempat ia terdaftar; guru memperoleh akses sesuai cakupan tugasnya.
4. **Kredensial:** jangan menyimpan password plaintext atau meminta siswa menyerahkan kata sandi ke aplikasi. Jangan mengekspos token, kunci, atau detail stack trace ke browser.
5. **Google Drive:** tautan video tidak otomatis dijadikan publik. Pengguna harus memastikan guru dapat mengakses berkas; aplikasi menampilkan petunjuk izin berbagi yang sesuai.
6. **Data siswa:** kumpulkan hanya data yang diperlukan untuk pembelajaran; batasi akses spreadsheet dan file Drive. Hindari publikasi nama lengkap atau data pribadi pada tampilan publik.
7. **Izin rekaman:** sediakan konfirmasi izin orang yang direkam. Publikasi TikTok publik tetap opsional serta memerlukan kurasi guru dan persetujuan siswa yang tampil dan orang tua/wali sesuai LKPD sumber.
8. **Kesalahan:** tampilkan pesan yang mudah dipahami dan catat rincian teknis secara aman untuk debugging.
9. **Retensi data:** kebijakan berapa lama jawaban, identitas, dan tautan disimpan perlu disepakati sekolah; belum ditentukan pada sumber LKPD.
10. **Deploy:** konfigurasi “execute as” dan audiens yang boleh mengakses harus dipilih dengan mempertimbangkan sensitivitas data. Tidak boleh mengklaim aplikasi sudah aman atau siap produksi sebelum konfigurasi dan pengujian nyata.

## 7. Estimasi kompleksitas

**Tingkat: Menengah.**

Faktor yang menambah kompleksitas:
- pemisahan jawaban individu dan kelompok;
- autentikasi serta otorisasi role guru/siswa;
- formulir panjang dalam enam bagian dan penyimpanan draf;
- storyboard dinamis, rekap progres, pengumpulan tautan, serta penilaian;
- keamanan data peserta didik dan pengaturan izin Google Drive.

Cakupan satu kelas dan satu sesi pembelajaran menjaga implementasi tetap terkendali. Bila kemudian digunakan lintas sekolah, banyak kelas, atau ribuan pengguna serentak, desain penyimpanan dan kontrol akses perlu dievaluasi ulang.

## 8. Rekomendasi UI/UX

### 8.1 Prinsip desain
- **Mobile-first:** semua formulir nyaman di layar sekitar 360 px, dengan tombol mudah disentuh, label jelas, dan tidak mengandalkan tabel lebar.
- **Visual:** modern, dinamis, terinspirasi palet warna TikTok, tetapi tetap mudah dibaca dan pantas untuk aplikasi pembelajaran sekolah. Palet warna saja yang dijadikan inspirasi; aplikasi tidak meniru logo atau mengesankan bahwa aplikasi dibuat atau disponsori TikTok.
- **Palet warna revisi — TikTok-inspired:**

  | Peran UI | Warna | Kode HEX | Penggunaan |
  |---|---|---|---|
  | Hitam utama | Hitam | `#000000` | Header, navigasi, judul atau tombol utama |
  | Aksen cyan | Cyan terang | `#25F4EE` | Indikator progres, highlight, fokus, dan aksen dekoratif; gunakan teks hitam di atasnya |
  | Aksen merah-pink | Crimson/pink | `#FE2C55` | CTA sekunder, penanda penting, dan aksen interaksi; untuk teks tombol gunakan hitam bila latar pink dipakai |
  | Putih | Putih | `#FFFFFF` | Kartu, formulir, dan teks pada latar hitam |
  | Latar aplikasi | Abu-abu sangat muda | `#F7F7F8` | Latar halaman agar kartu putih tetap terpisah secara visual |
  | Teks utama | Hampir hitam | `#161823` | Isi, label, dan teks formulir di atas latar terang |
  | Garis/batas | Abu-abu muda | `#E5E5E8` | Border input, pemisah bagian, dan garis kartu |

  **Aturan pemakaian:** hitam dan putih menjadi dasar agar tampilan tidak terlalu ramai; cyan dan merah-pink digunakan sebagai aksen secara terukur, bukan memenuhi semua latar. Pertahankan kontras teks yang memadai, jangan mengandalkan warna saja untuk menyatakan status, dan gunakan label seperti “Tersimpan” atau “Perlu perbaikan”. Kode cyan `#25F4EE`, merah-pink `#FE2C55`, hitam `#000000`, dan putih `#FFFFFF` adalah palet TikTok yang banyak dirujuk; ini merupakan arahan visual terinspirasi merek, bukan pernyataan bahwa aplikasi adalah produk resmi TikTok.
- **Tipografi:** sans-serif yang mudah dibaca; ukuran isi sekitar 16 px pada ponsel.
- **Navigasi siswa:** progres enam bagian dengan menu bawah untuk 4–5 tujuan utama, atau daftar bagian sederhana yang tidak memenuhi layar. Detail tiap bagian memakai tombol “Sebelumnya” dan “Lanjut”.
- **Navigasi guru:** sidebar pada desktop dan menu hamburger/offcanvas pada ponsel karena dashboard memiliki lebih banyak fungsi.
- **Status:** gunakan label teks seperti Draf, Tersimpan, Terkumpul, Diperiksa, dan Perlu Perbaikan; jangan hanya membedakan status lewat warna.
- **Aksesibilitas:** label tiap input, fokus keyboard yang jelas, kontras memadai, pesan validasi dekat bidang terkait, dan area sentuh yang cukup.
- **Keadaan sistem:** desain harus memiliki loading, kosong, berhasil disimpan, kegagalan menyimpan, dan error akses.

### 8.2 Wireframe teks — Mobile (siswa)

```text
┌──────────────────────────────┐
│ LKPD DIGITAL                 │
│ Membuat Konten TikTok        │
│ Kelas X • Kelompok ...       │
├──────────────────────────────┤
│ Progres keseluruhan   3/6    │
│ [████████░░░░░░░░]           │
├──────────────────────────────┤
│ Bagian A • Pertanyaan        │
│ [Tersimpan / Belum selesai]  │
│ Bagian B • Konsep & Etika    │
│ Bagian C • Rencana Konten    │
│ Bagian D • Logbook           │
│ Bagian E • Uji Kualitas      │
│ Bagian F • Refleksi          │
├──────────────────────────────┤
│ Form bagian aktif            │
│ Label pertanyaan             │
│ [Kolom isian multi-baris]    │
│ [Simpan] [Lanjut →]          │
├──────────────────────────────┤
│ Beranda | LKPD | Kumpulkan   │
└──────────────────────────────┘
```

### 8.3 Wireframe teks — Mobile (guru)

```text
┌──────────────────────────────┐
│ ☰ Dashboard Guru             │
├──────────────────────────────┤
│ Kelompok terdaftar      ...  │
│ Pengumpulan lengkap     ...  │
│ Perlu diperiksa         ...  │
├──────────────────────────────┤
│ Cari kelompok/siswa          │
│ [Filter kelas] [Filter status]│
├──────────────────────────────┤
│ Kelompok A                   │
│ Progres ... • Status ...     │
│ [Lihat jawaban]              │
├──────────────────────────────┤
│ Kelompok B                   │
│ Progres ... • Status ...     │
│ [Lihat jawaban]              │
└──────────────────────────────┘
```

### 8.4 Wireframe teks — Desktop (siswa)

```text
┌──────────────┬────────────────────────────────────────────────────┐
│ LKPD DIGITAL │ Nama siswa • Kelas • Kelompok • Status simpan       │
│ Beranda      ├────────────────────────────────────────────────────┤
│ Bagian A     │ Judul bagian dan instruksi LKPD                     │
│ Bagian B     │                                                    │
│ Bagian C     │ Form aktif; bidang dikelompokkan per subbagian      │
│ Bagian D     │                                                    │
│ Bagian E     │ [Sebelumnya] [Simpan draf] [Lanjut]                 │
│ Bagian F     │                                                    │
│ Pengumpulan  │                                                    │
└──────────────┴────────────────────────────────────────────────────┘
```

### 8.5 Wireframe teks — Desktop (guru)

```text
┌──────────────┬────────────────────────────────────────────────────┐
│ SIDEBAR      │ Dashboard Guru                     Profil/keluar   │
│ Dashboard    ├────────────────────────────────────────────────────┤
│ Kelompok     │ Ringkasan: progres • terkumpul • perlu diperiksa    │
│ Siswa        ├────────────────────────────────────────────────────┤
│ Pengumpulan  │ Cari ... | Filter kelas ... | Filter status ...    │
│ Penilaian    ├────────────────────────────────────────────────────┤
│ Pengaturan   │ Daftar kelompok/siswa dalam tabel responsif         │
│              │ Detail → jawaban • tautan video • nilai • catatan   │
└──────────────┴────────────────────────────────────────────────────┘
```

## 9. Kriteria penerimaan

MVP dapat dinyatakan memenuhi PRD setelah pengujian di lingkungan Apps Script menunjukkan hal berikut:

1. Tampilan inti nyaman digunakan pada ponsel dan desktop tanpa konten penting terpotong secara horizontal.
2. Seluruh kolom/tugas dari Bagian A–F dan daftar pengumpulan sumber terwakili dalam UI.
3. Jawaban individu terpisah dari jawaban kelompok dan tidak dapat dilihat/diubah pengguna yang tidak berhak.
4. Pengguna dapat menyimpan draf, membuka kembali, dan melihat jawaban tersimpan dari Google Sheets.
5. Kegagalan menyimpan menampilkan status yang jelas; UI tidak mengklaim berhasil bila server gagal.
6. Validasi server-side menolak nilai di luar aturan, termasuk skor selain 1–4, hashtag di luar panduan 3–5 bila disubmit sebagai checklist final, dan storyboard yang memiliki kurang dari 4 atau lebih dari 6 adegan saat diajukan sebagai final.
7. Total durasi storyboard dihitung atau diperiksa dan siswa diberi peringatan bila di luar 30–60 detik.
8. Guru dapat memfilter progres/pengumpulan, melihat jawaban yang menjadi haknya, serta memasukkan nilai dan catatan.
9. Setup database tidak menghapus atau menimpa data yang sudah ada; sheet baru dibuat dengan header yang sesuai.
10. Sistem menangani daftar kosong, loading, halaman tanpa akses, URL Drive tidak valid, dan error server dengan pesan yang aman.
11. Tautan video tidak dibuat publik secara otomatis.
12. Tidak ada klaim bahwa aplikasi sudah dideploy atau lulus uji produksi sebelum langkah tersebut benar-benar dilakukan.

## 10. Asumsi dan pertanyaan terbuka

### Asumsi baseline untuk menyusun PRD
- Penggunaan awal untuk satu kelas, dengan perkiraan perencanaan sekitar 36 siswa; angka ini hanya asumsi sementara dan dapat diubah.
- Web App Apps Script mandiri adalah cara akses utama.
- Bagian A dan refleksi/penilaian individu pada F dikerjakan masing-masing siswa; Bagian B–E dan refleksi kelompok dikerjakan bersama.
- Pengumpulan video dilakukan melalui tautan Google Drive, bukan unggah file besar langsung dari web app.
- Guru memerlukan dashboard progres, pemeriksaan pengumpulan, input nilai LKPD, dan catatan guru.
- Progres/draf, pencarian/filter dasar, dan indikator status termasuk kebutuhan versi awal.

### Hal yang masih perlu dipastikan sebelum implementasi
1. Apakah sekolah memiliki akun/domain Google Workspace untuk guru dan siswa?
2. Apakah semua siswa punya akun Google yang dapat digunakan pada aplikasi, atau perlu mode akses alternatif?
3. Apakah satu guru saja yang mengelola aplikasi atau beberapa guru perlu akses?
4. Apakah penilaian akhir cukup berupa satu nilai LKPD dan catatan guru, atau sekolah memiliki rubrik resmi tersendiri?
5. Berapa lama data dan tautan karya perlu disimpan, dan siapa yang berhak mengakses spreadsheet/Drive?

Pertanyaan akses (1–2) masih wajib dipastikan sebelum model deployment dipilih dan aplikasi dipakai siswa. Backend saat ini gagal-tertutup (menolak akses) ketika email akun Google tidak dapat diverifikasi.

## 11. Tahapan kerja dan status

1. **Tahap 1 — PRD:** baseline kebutuhan dan palet warna telah disepakati. Pertanyaan akses Google Workspace masih terbuka.
2. **Tahap 2 — Prototipe UI:** `Index.html` tersedia dengan data demo dan palet TikTok-inspired. Prototipe belum terhubung ke Sheets.
3. **Tahap 3 — Backend:** `Code.gs` versi 1.0.0 telah disusun dengan setup database non-destruktif, validasi, API jawaban/pengumpulan, dashboard guru, penilaian, dan pencatatan aktivitas. Belum dijalankan pada project Apps Script pengguna.
4. **Tahap 3 — Integrasi front-end:** masih harus dilakukan. Tombol/formulir pada `Index.html` masih menggunakan simulasi browser dan perlu dihubungkan ke fungsi `google.script.run`.
5. **Tahap 4 — Dokumentasi:** draf `Panduan_Instalasi.md`, `Panduan_Custom_Domain.md`, dan `Dokumentasi_Aplikasi.md` telah disiapkan.
6. **Uji penerimaan:** masih harus dilakukan di spreadsheet dan akun uji. Belum ada deployment atau pengujian produksi.

### Catatan implementasi backend

- Nama sheet/header yang diwajibkan terdapat pada konstanta `SHEET_CONFIG` di `Code.gs`.
- API front-end tersedia dengan nama `apiGetBootstrap`, `apiGetMyAnswers`, `apiSaveAnswer`, `apiSubmitWork`, `apiGetTeacherDashboard`, `apiGetGroupDetails`, `apiSaveGrade`, dan `apiReviewSubmission`.
- Jawaban Bagian F dipisahkan antara `scope: 'group'` (refleksi kelompok) dan `scope: 'individual'` (tanggapan/penilaian teman serta refleksi pribadi) agar data pribadi tidak tercampur ke jawaban kelompok.
- Rentang nilai guru 0–100 adalah asumsi implementasi; LKPD sumber tidak menetapkan skala atau bobot nilai akhir. Konfirmasi rubrik sekolah sebelum digunakan.
- Apps Script dapat tidak mengungkap email aktif dalam konteks tertentu. Backend menolak akses bila email kosong atau tidak terdaftar; konfigurasi deployment dan akun harus diuji terlebih dahulu.

---

**Status keputusan:** PRD menjadi baseline untuk prototipe dan rancangan backend. Tahap berikutnya adalah menghubungkan `Index.html` ke API, lalu menguji akses dan penyimpanan dengan data uji sebelum deployment.
