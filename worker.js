/**
 * CLOUDFLARE WORKER REVERSE PROXY & CORS GATEWAY
 * ========================================================
 * File: worker.js
 * 
 * FUNGSI UTAMA:
 * 1. Menghilangkan masalah CORS saat Cloudflare Pages memanggil Google Apps Script.
 * 2. Menjawab preflight request HTTP OPTIONS secara instan dengan header CORS lengkap.
 * 3. Meneruskan request GET / POST ke Google Apps Script Web App (/exec) dengan aman,
 *    mengikuti redirect HTTP 302 bawaan Google secara otomatis.
 * 
 * CARA DEPLOY DI CLOUDFLARE WORKERS (GRATIS):
 * 1. Buka dashboard Cloudflare: https://dash.cloudflare.com/
 * 2. Masuk ke menu "Workers & Pages" > klik "Create application" > "Create Worker".
 * 3. Beri nama worker, misal: `lkpdtiktok-api` > klik "Deploy".
 * 4. Klik "Edit code", hapus semua kode bawaan, lalu salin dan tempel SELURUH isi file `worker.js` ini.
 * 5. Klik "Deploy".
 * 6. Masuk ke menu "Settings" > "Variables" pada Worker tersebut:
 *    Tambahkan Environment Variable:
 *    - Variable name: `GAS_URL`
 *    - Value: `https://script.google.com/macros/s/AKfycby.../exec` (URL Web App Apps Script kamu)
 * 7. Salin URL Worker kamu (contoh: `https://lkpdtiktok-api.namakamu.workers.dev`).
 * 8. Tempelkan URL tersebut ke dalam file `config.js` di baris `API_URL: "..."`.
 */

// Fallback URL jika env.GAS_URL belum diatur di Cloudflare Dashboard
const DEFAULT_GAS_URL = "https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec";

// Header CORS standar yang diizinkan untuk frontend Cloudflare Pages
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
  "Access-Control-Max-Age": "86400",
};

export default {
  async fetch(request, env, ctx) {
    // 1. Tangani HTTP OPTIONS (CORS Preflight)
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders,
      });
    }

    // 2. Ambil URL target Google Apps Script dari Environment Variable
    const targetGasUrl = env.GAS_URL || DEFAULT_GAS_URL;

    if (!targetGasUrl || targetGasUrl.includes("YOUR_DEPLOYMENT_ID")) {
      return new Response(
        JSON.stringify({
          status: "error",
          message: "GAS_URL belum dikonfigurasi di Environment Variable Cloudflare Worker atau DEFAULT_GAS_URL masih dummy. Buka Settings > Variables di dashboard Cloudflare Worker dan atur GAS_URL ke URL Web App Apps Script kamu.",
        }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json; charset=utf-8",
          },
        }
      );
    }

    try {
      const url = new URL(request.url);
      const gasUrl = new URL(targetGasUrl);

      // Teruskan query parameters jika ada
      url.searchParams.forEach((value, key) => {
        gasUrl.searchParams.set(key, value);
      });

      // Siapkan opsi fetch untuk Apps Script
      const fetchOptions = {
        method: request.method,
        redirect: "follow", // Wajib follow redirect 302 dari Google
      };

      if (request.method === "POST") {
        const bodyText = await request.text();
        fetchOptions.body = bodyText;
        // Menggunakan text/plain mencegah CORS redirect failure pada Apps Script
        fetchOptions.headers = {
          "Content-Type": "text/plain;charset=utf-8",
        };
      }

      // 3. Panggil Google Apps Script
      const gasResponse = await fetch(gasUrl.toString(), fetchOptions);
      const responseData = await gasResponse.text();

      // 4. Kembalikan response ke frontend Cloudflare Pages dengan header CORS
      return new Response(responseData, {
        status: gasResponse.status,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json; charset=utf-8",
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      });
    } catch (error) {
      return new Response(
        JSON.stringify({
          status: "error",
          message: "Cloudflare Worker gagal menghubungi Google Apps Script: " + (error.message || String(error)),
        }),
        {
          status: 502,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json; charset=utf-8",
          },
        }
      );
    }
  },
};
