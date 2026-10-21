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
| `worker.js` | Script Cloudflare Worker sebagai reverse proxy CORS penghubung Cloudflare Pages ke Apps Script. |
| `LKPD_Konten_TikTok_Kelas_X.docx` | Dokumen sumber LKPD cetak kurikulum Fase E. |
| `MODUL_KOKURIKULER_KONTEN_TIKTOK.docx` | Modul ajar kokurikuler guru pembimbing. |
| `PRD_Planning.md` | Product Requirements Document (PRD) dan spesifikasi teknis sistem. |

---

## 🚀 Panduan Deployment & Konfigurasi

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

### 2. Setup Cloudflare Worker (`worker.js`)
*Cloudflare Worker berfungsi sebagai reverse proxy dan CORS gateway agar pemanggilan API dari Cloudflare Pages berjalan lancar tanpa terhalang CORS preflight.*

1. Buka [Cloudflare Dashboard](https://dash.cloudflare.com/) > menu **Workers & Pages**.
2. Klik **Create application** > pilih **Create Worker**.
3. Beri nama worker (misal: `lkpdtiktok-api`) > klik **Deploy**.
4. Klik **Edit code**, hapus kode bawaan, lalu tempel seluruh isi file `worker.js`.
5. Klik **Deploy**.
6. Masuk ke tab **Settings** pada Worker tersebut > pilih **Variables and Secrets**:
   - Klik **Add**:
     - Variable name: `GAS_URL`
     - Value: Tempelkan Web app URL Apps Script (`/exec`) dari langkah 1 tadi.
   - Klik **Save**.
7. Salin URL Worker Anda (contoh: `https://lkpdtiktok-api.namakamu.workers.dev`).

---

### 3. Setup Konfigurasi Frontend (`config.js`)
1. Buka file `config.js` di repositori ini.
2. Perbarui baris `API_URL` dengan URL Cloudflare Worker Anda:
   ```javascript
   const CONFIG = {
     API_URL: "https://lkpdtiktok-api.namakamu.workers.dev",
     ...
   };
   ```

---

### 4. Deploy ke Cloudflare Pages
1. Push repositori ini ke GitHub:
   ```bash
   git add .
   git commit -m "feat: setup LKPD TikTok app with live Google Sheets backend"
   git push origin main
   ```
2. Buka [Cloudflare Dashboard](https://dash.cloudflare.com/) > **Workers & Pages** > **Create application** > **Pages**.
3. Pilih **Connect to Git** dan hubungkan repositori `lkpdtiktok`.
4. Pada Build settings:
   - Framework preset: **None** (HTML/JS statis).
   - Build output directory: `/` (root repositori).
5. Klik **Save and Deploy**. Web app LKPD Digital siap diakses oleh siswa dan guru secara global!

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
