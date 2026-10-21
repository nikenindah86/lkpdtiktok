/**
 * KONFIGURASI APLIKASI LKPD DIGITAL TIKTOK
 * ========================================================
 * File ini mengatur endpoint API backend dan pengaturan aplikasi.
 * 
 * PANDUAN PENGISIAN API_URL:
 * 1. Jika menggunakan Cloudflare Worker (Disarankan):
 *    Isi dengan URL Cloudflare Worker kamu, contoh:
 *    API_URL: "https://lkpdtiktok-api.namakamu.workers.dev"
 * 
 * 2. Jika menghubungkan langsung ke Google Apps Script Web App:
 *    Isi dengan URL Deployment Web App Apps Script (berakhiran /exec), contoh:
 *    API_URL: "https://script.google.com/macros/s/AKfycby.../exec"
 * 
 * 3. Jika dijalankan di dalam Google Apps Script (HTML Service):
 *    Aplikasi otomatis mendeteksi google.script.run tanpa memerlukan API_URL eksternal.
 */

const CONFIG = {
  // Ganti URL di bawah dengan URL Cloudflare Worker kamu atau URL Apps Script Exec
  API_URL: "https://lkpdtiktok-api.namakamu.workers.dev",

  // Informasi Sekolah dan Mata Pelajaran
  APP_TITLE: "LKPD Digital | Membuat Konten TikTok",
  SCHOOL_NAME: "SMA Negeri 1 Bancar",
  CLASS_NAME: "Kelas X Fase E",
  SEMESTER: "Ganjil / Genap",

  // Konfigurasi Penyimpanan Otomatis (Debounce autosave draf dalam milidetik)
  AUTOSAVE_DELAY_MS: 1500,

  // Default fallback PIN Pengajar (bisa disesuaikan di sheet Konfigurasi)
  DEFAULT_TEACHER_PIN: "123456",

  // Durasi animasi notifikasi Toast (milidetik)
  TOAST_DURATION_MS: 3000
};

// Ekspor ke window agar dapat diakses oleh index.html
if (typeof window !== "undefined") {
  window.APP_CONFIG = CONFIG;
}
