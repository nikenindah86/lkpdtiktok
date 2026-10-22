# Petunjuk Penggunaan Guru
## LKPD Digital & Modul Kokurikuler: Membuat Konten TikTok
**Fase E (Kelas X) - SMA Negeri 1 Bancar**

Panduan praktis bagi guru pengampu kokurikuler dalam mengelola pembelajaran, memantau pengerjaan 6 kelompok (36 siswa), memeriksa tugas kelompok dan individu, serta memberikan penilaian langsung yang terhubung ke Google Sheets secara real-time.

---

## 1. Akses dan Identitas Guru

- **Alamat Aplikasi Web:** [https://lkpdtiktok.pages.dev/](https://lkpdtiktok.pages.dev/)
- **Email Pengajar:** `guru@sman1bancar.sch.id`
- **PIN Guru Bawaan:** `123456`
- **Ubah PIN Guru:** Buka Google Sheets > tab sheet **Konfigurasi** > ubah baris `GURU_PIN`.

### Cara Masuk Dashboard Guru:
1. Buka aplikasi web di laptop atau smartphone.
2. Klik tombol **Tamu: Masuk ▾** di pojok kanan atas, atau tombol **Ganti Akun / Masuk Guru** pada halaman beranda.
3. Pilih tab **Masuk sebagai Guru**.
4. Masukkan PIN guru (`123456`), lalu klik **Buka Dashboard Guru →**.

---

## 2. Persiapan Awal Database & Daftar 36 Siswa (Dilakukan 1 Kali)

Sebelum sesi kokurikuler dimulai di kelas, database perlu diinisialisasi untuk 6 kelompok dan 36 siswa. **Guru TIDAK PERLU mengetik nama siswa satu per satu!**

### Langkah 1: Buat Struktur 6 Kelompok (1 Kali Klik)
Pilih salah satu cara berikut:
- **Dari Web App (Paling Cepat):** Masuk ke **Dashboard Guru** > klik tombol **⚡ Inisialisasi 6 Kelompok (36 Siswa)** > konfirmasi "Ya, Inisialisasi".
- **Dari Google Sheets:** Buka spreadsheet > tunggu menu kustom **LKPD TikTok** muncul di atas > klik **LKPD TikTok > ⚡ Inisialisasi 6 Kelompok (36 Siswa)**.

Sistem akan otomatis membuat 6 kelompok (`Kelompok 1` s.d. `Kelompok 6`) dengan kapasitas masing-masing 6 siswa (total 36 siswa).

---

### Langkah 2: Cara Mengisi / Memasukkan Nama 36 Siswa

Guru memiliki **3 Pilihan Sangat Praktis** sesuai preferensi:

#### Pilihan A: Biarkan Siswa Menuliskan Namanya Sendiri (Paling Santai bagi Guru)
- Guru **tidak perlu input nama apa pun** sebelum kelas dimulai. Cukup bagikan link web app kepada siswa.
- Saat siswa membuka web di HP masing-masing dan memilih kelompoknya (misal: `Kelompok 1`), siswa cukup memilih opsi **"+ Tulis Nama Baru"**.
- Siswa mengetik nama lengkapnya sendiri, lalu klik **Masuk & Mulai LKPD**.
- Nama tersebut akan otomatis tersimpan ke database Google Sheets dan langsung terdaftar resmi di kelompok tersebut.

#### Pilihan B: Copy-Paste Massal 36 Nama Sekaligus di Google Sheets (Hanya 10 Detik)
Jika guru sudah memiliki daftar absensi kelas di file Excel atau Word:
1. Buka spreadsheet Google Sheets Anda, lalu klik tab sheet **Pengguna**.
2. Di file Excel absensi Anda, **Copy** seluruh daftar 36 nama siswa (1 kolom ke bawah).
3. Di Google Sheets, letakkan kursor pada kolom **nama** di baris siswa pertama (sel `C3`), lalu tekan **Paste (Ctrl + V)**.
4. Selesai! Seluruh 36 nama siswa langsung terisi rapi dalam 10 detik tanpa perlu mengetik ulang satu per satu.

#### Pilihan C: Gunakan Nama Bawaan Sistem Terlebih Dahulu (Untuk Simulasi / Uji Coba)
- Saat tombol **⚡ Inisialisasi 6 Kelompok (36 Siswa)** diklik, sistem sudah otomatis menyertakan 36 nama siswa contoh yang terbagi rata (6 siswa per kelompok).
- Guru dapat langsung menguji coba seluruh alur pengisian dan penilaian tanpa perlu menyiapkan data apa pun.

---

## 3. Pembagian Tugas: Kelompok vs Individu

Aplikasi telah memisahkan penilaian tugas yang dikerjakan bersama kelompok dan tugas refleksi mandiri tiap siswa:

| Bagian LKPD | Jenis Tugas | Keterangan & Konten |
| :--- | :---: | :--- |
| **Modul Kokurikuler** | Wajib Dibaca | Panduan 4 mapel (B. Indonesia, Informatika, Seni Budaya, PKn), anatomi Hook 3 detik, alur storyboard, dan 4 pilar etika digital. |
| **Bagian A** | **Tugas Individu** | Pertanyaan pemantik diagnostik awal (stop scrolling, viral vs bermanfaat, keamanan digital). Diisi mandiri oleh ke-36 siswa. |
| **Bagian B** | **Tugas Kelompok** | Mencocokkan istilah teknis TikTok (Hook, CTA, Engagement, Storyboard, Rasio 9:16) dan analisis etika kelompok. |
| **Bagian C** | **Tugas Kelompok** | Perencanaan ide pembeda, naskah singkat, pembagian peran anggota, dan **Storyboard 4-6 Adegan (Total durasi 30-60 detik format vertikal 9:16)**. |
| **Bagian D** | **Tugas Kelompok** | Logbook pengerjaan menit ke menit, kendala perekaman, solusi kreatif, dan ceklist audio visual. |
| **Bagian E** | **Tugas Kelompok** | Quality Check kelayakan video, rancangan cover depan, caption persuasif, dan 3-5 hashtag wajib. |
| **Kumpul Video** | **Tugas Kelompok** | Pengumpulan tautan Google Drive video TikTok final format 9:16 durasi 30-60 detik. |
| **Bagian F** | **Individu & Kelompok** | Refleksi kelompok + **Penilaian Antarteman (Skala 1-4)**: keaktifan, menghargai pendapat, dan tanggung jawab peran rekan sekelompok. |

---

## 4. Cara Memantau & Menilai via Dashboard Guru

Pada Dashboard Guru, tersedia tabel pemantauan interaktif untuk 6 kelompok:

### Indikator Tabel:
- **Kelompok & Anggota (6 Siswa):** Menampilkan nama kelompok dan daftar 6 siswa.
- **Tugas Kelompok (B-E) & Video:** Menampilkan progres bagian B, C, D, E dan status pengumpulan tautan video Google Drive (`✓ Video Terkumpul` / `Belum Kumpul`).
- **Tugas Individu (A & F):** Menampilkan jumlah siswa yang telah mengumpulkan Bagian A (contoh: `6/6 Siswa Selesai`) dan Bagian F.
- **Nilai LKPD:** Menampilkan status nilai (`Belum Dinilai` atau nilai angka 0-100).

### Langkah Memeriksa & Memberi Nilai:
1. Klik tombol **Periksa & Nilai ➔** pada baris kelompok yang ingin diperiksa.
2. Modal multi-tab akan terbuka:
   - **Tab 1 (🎬 Video & Berkas):** Klik tombol `Buka Video di Google Drive` untuk menonton karya siswa, serta melihat caption dan hashtag yang mereka buat.
   - **Tab 2 (👥 Jawaban Kelompok B-E):** Periksa naskah, konsep, dan tabel 6 adegan storyboard beserta durasinya.
   - **Tab 3 (👤 Tugas Individu Bag. A):** Baca jawaban pemantik dari ke-6 anggota kelompok secara terpisah.
   - **Tab 4 (🤝 Penilaian Antarteman F):** Lihat refleksi kelompok dan skor penilaian rekan sejawat antarsiswa (skala 1-4).
   - **Tab 5 (📝 Beri Nilai Guru):** Masukkan nilai LKPD (skala 0-100) dan tuliskan catatan/umpan balik konstruktif guru, lalu klik **💾 Simpan Nilai ke Sheets**.
3. Nilai dan catatan guru langsung tersimpan di sheet **PenilaianGuru** dan otomatis tampil di kartu kelompok.

### Ekspor Rekap Nilai:
Klik tombol **📥 Ekspor CSV Rekap** di atas tabel untuk mengunduh rekapitulasi seluruh nilai dan status kelompok ke file CSV/Excel.

---

## 5. Alur Jadwal 90 Menit di Kelas

Ikuti panduan waktu ini agar proyek tuntas dalam 1 sesi pertemuan:

```
[00 - 10 Menit]  Pembukaan, pembagian kelompok, siswa login & isi Bagian A (Individu)
        ↓
[10 - 25 Menit]  Pelajari Modul & diskusikan Konsep + Etika Bagian B (Kelompok)
        ↓
[25 - 40 Menit]  Rancang Ide, Naskah, & Storyboard 4-6 Adegan Bagian C (Kelompok)
        ↓
[40 - 65 Menit]  Produksi & Rekam Video 9:16 di sekolah, catat Logbook D (Kelompok)
        ↓
[65 - 75 Menit]  Editing cepat CapCut, Quality Check E, upload Drive & Kumpul Video
        ↓
[75 - 90 Menit]  Penilaian antarteman F, Refleksi, Guru memberi Nilai di Dashboard
```

---

## 6. Pertanyaan Umum & Pemecahan Masalah (FAQ)

**T: Video siswa di Google Drive tidak bisa diputar oleh guru?**
> **J:** Ingatkan siswa agar pengaturan berbagi file di Google Drive diubah menjadi **"Anyone with the link can view"** (Siapa saja yang memiliki tautan dapat melihat).

**T: Siswa berganti perangkat HP saat mengisi LKPD, apakah jawaban hilang?**
> **J:** Tidak hilang. Siswa cukup memilih kembali kelompok dan namanya saat login. Aplikasi otomatis mengambil jawaban terakhir yang telah tersimpan di Google Sheets.

**T: Ingin menambah kelompok ke-7 atau kelompok baru?**
> **J:** Di Dashboard Guru, klik tombol **+ Kelompok Lain**, masukkan nama kelompok dan kelas, lalu klik Buat Kelompok.

**T: Kode Apps Script diperbarui di repository, apa yang harus dilakukan guru?**
> **J:** Buka Google Sheets > **Extensions > Apps Script** > salin isi file `Code.gs` terbaru > klik **Save** > klik **Deploy > Manage deployments > Edit (ikon pensil) > pilih New version > klik Deploy**.
