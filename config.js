/**
 * =========================================================================
 * KONFIGURASI GLOBAL FRONTEND — LKPD TIKTOK SMAN 1 BANCAR
 * =========================================================================
 * File: config.js
 * Diadaptasi dari pola Cloudflare Pages: santoso / aidukasi.net
 * =========================================================================
 */

const CONFIG = {
  // Bila di-deploy di Cloudflare Pages (lkpdtiktok.pages.dev), gunakan '/api' (diteruskan via _worker.js)
  // Bila dibuka secara lokal (file://), gunakan URL langsung Google Apps Script Web App
  API_URL: (typeof window !== 'undefined' && window.location && window.location.protocol === 'file:')
    ? 'https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec'
    : '/api',

  // Informasi Sekolah dan Mata Pelajaran
  APP_TITLE: "LKPD Digital | Membuat Konten TikTok",
  SCHOOL_NAME: "SMA Negeri 1 Bancar",
  CLASS_NAME: "Kelas X Fase E",

  // Konfigurasi Autosave (milidetik)
  AUTOSAVE_DELAY_MS: 1500,

  // Default fallback PIN Pengajar
  DEFAULT_TEACHER_PIN: "123456",

  // Durasi animasi notifikasi Toast (milidetik)
  TOAST_DURATION_MS: 3000
};

if (typeof window !== "undefined") {
  window.APP_CONFIG = CONFIG;
}
