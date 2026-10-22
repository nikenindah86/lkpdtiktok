# LKPD Digital: Membuat Konten Media Sosial TikTok
### Kegiatan Kokurikuler Kelas X Fase E — SMA Negeri 1 Bancar

Aplikasi web interaktif untuk LKPD kokurikuler pembuatan video edukatif TikTok (30–60 detik, rasio 9:16). Terhubung **100% secara real-time** ke database Google Sheets tanpa data dummy, dilengkapi notifikasi modern **SweetAlert2**, serta kompatibel untuk deployment di **Cloudflare Pages** dengan **Cloudflare Worker** sebagai CORS reverse proxy.

---

## 📁 Struktur Berkas

| Berkas | Deskripsi & Peran |
|---|---|
| `index.html` | Frontend modern, responsif mobile, terhubung real-time ke Google Sheets & SweetAlert2. |
| `Code.gs` | Backend Google Apps Script dengan fungsi `setupDatabase()`, validasi LKPD A–F, dan REST API. |
| `config.js` | Pengaturan endpoint API frontend untuk Cloudflare Pages / Apps Script. |
| `_worker.js` | Cloudflare Pages Worker (Advanced Mode) sebagai reverse proxy CORS otomatis `/api` ke Apps Script. |
| `LKPD_Konten_TikTok_Kelas_X.docx` | Dokumen sumber LKPD cetak kurikulum Fase E. |
| `MODUL_KOKURIKULER_KONTEN_TIKTOK.docx` | Dokumen sumber Modul Kokurikuler guru. |
| `MODUL_KOKURIKULER_KONTEN_TIKTOK.md` | Materi modul digital yang terintegrasi langsung di dalam web app sebagai prasyarat pengerjaan. |
| `PRD_Planning.md` | Product Requirements Document (PRD) dan spesifikasi teknis sistem. |

---

## 🚀 Panduan Deployment Cloudflare Pages (Arsitektur `_worker.js`)

> **Keunggulan Metode Ini (seperti pada proyek santoso):**
> Anda **TIDAK PERLU** membuat Cloudflare Worker secara terpisah! Cukup hubungkan repositori ini ke **Cloudflare Pages**, file `_worker.js` otomatis bertindak sebagai edge proxy `/api` yang mengatasi CORS preflight dan redirect Google Apps Script secara instan.

### 1. Setup Backend Google Sheets (`Code.gs`)
1. Buka [Google Sheets](https://sheets.new) baru di browser Anda.
2. Beri nama spreadsheet, misal: `Database LKPD TikTok Kelas X`.
3. Klik menu **Ekstensi > Apps Script**.
4. Hapus kode bawaan di editor, lalu salin dan tempel seluruh isi file `Code.gs`.
5. Di menu dropdown fungsi di bagian atas editor, pilih fungsi **`setupDatabase`**, lalu klik **Run (Jalankan)**.
   > **Catatan:** Berikan izin akses Google saat diminta pertama kali. Fungsi ini otomatis membuat 9 sheet (`Konfigurasi`, `Pengguna`, `Kelompok`, `AnggotaKelompok`, `JawabanIndividu`, `JawabanKelompok`, `Pengumpulan`, `PenilaianGuru`, `LogAktivitas`) dan mengisi data starter awal.
6. Klik tombol **Deploy > New deployment (Penerapan baru)**:
   - Pilih jenis: **Web app**.
   - Description: `LKPD TikTok API v2`.
   - Execute as: **Me (Akun Google Anda)**.
   - Who has access: **Anyone (Siapa saja)**.
7. Klik **Deploy**, lalu salin **Web app URL** yang berakhiran `/exec`.

---

### 2. Deploy ke Cloudflare Pages
1. Pastikan repo sudah di-push ke GitHub: `https://github.com/nikenindah86/lkpdtiktok.git`.
2. Buka [Cloudflare Dashboard](https://dash.cloudflare.com/) > **Workers & Pages** > klik **Create application** > tab **Pages** > **Connect to Git**.
3. Pilih repositori `lkpdtiktok`.
4. Pada form konfigurasi build:
   - **Project name**: `lkpdtiktok`
   - **Production branch**: `main`
   - **Framework preset**: `None`
   - **Build command**: *(kosongkan)*
   - **Build output directory**: `/`
5. Buka bagian **`> Environment variables (advanced)`**:
   - Klik **Add variable**:
     - **Variable name**: `GAS_URL`
     - **Value**: Tempelkan Web app URL Apps Script (`https://script.google.com/macros/s/.../exec`) dari langkah 1.
6. Klik **Save and Deploy**.
7. Selesai! Web app LKPD Digital siap diakses melalui URL `https://lkpdtiktok.pages.dev`. File `_worker.js` akan otomatis mem-proxy semua request `/api` ke Google Apps Script tanpa hambatan CORS.

---

## 🔒 Hak Akses & Akun Bawaan

| Peran | Identitas Awal | Keterangan |
|---|---|---|
| **Guru** | Email: `guru@sman1bancar.sch.id`<br>PIN: `123456` | Akses penuh dashboard penilaian, periksa video, buat kelompok, dan unduh CSV. |
| **Siswa** | Pilih nama terdaftar atau tulis nama baru | Mengisi Bagian A–F, menyimpan draf otomatis, dan mengumpulkan video final. |

---

## ✨ Fitur Utama
- **Anti-Alert Bawaan:** 100% menggunakan notifikasi modern **SweetAlert2** dan custom real-time toast.
- **Koneksi Database Mutlak:** Tidak ada data dummy statis setelah inisialisasi; seluruh data kelompok, siswa, jawaban, dan nilai tersimpan langsung di Google Sheets.
- **Kalkulator Durasi Storyboard:** Memvalidasi durasi 30–60 detik secara langsung saat siswa mengisi Bagian C.4.
- **Validasi Hashtag & Drive:** Memastikan 3–5 hashtag dan URL video final Google Drive valid sebelum dikumpulkan.
