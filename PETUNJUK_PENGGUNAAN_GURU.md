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

## 2. Persiapan Awal Database (Dilakukan 1 Kali)

Sebelum sesi kokurikuler dimulai di kelas, pastikan database Google Sheets telah terisi struktur 6 kelompok dan 36 siswa:

### Opsi A (Langsung dari Web App - Paling Mudah):
1. Masuk ke **Dashboard Guru** di web app.
2. Klik tombol warna biru **⚡ Inisialisasi 6 Kelompok (36 Siswa)**.
3. Konfirmasi "Ya, Inisialisasi". Sistem otomatis membuat 6 kelompok (`Kelompok 1` s.d. `Kelompok 6`) dan mendaftarkan 36 akun siswa (6 siswa per kelompok).

### Opsi B (Dari Google Sheets Langsung):
1. Buka spreadsheet Google Sheets Anda.
2. Tunggu 2 detik hingga menu kustom **LKPD TikTok** muncul di menu bar atas.
3. Klik **LKPD TikTok > ⚡ Inisialisasi 6 Kelompok (36 Siswa)**.
4. Notifikasi konfirmasi berhasil akan muncul di pojok kanan bawah.

> **Tips Kustomisasi Nama Siswa:**
> Buka tab sheet **Pengguna** di Google Sheets. Anda dapat langsung mengedit nama siswa pada kolom `nama` sesuai nama asli absensi kelas tanpa mengubah kolom `userId`.

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
