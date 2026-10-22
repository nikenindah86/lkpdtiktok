/**
 * =========================================================================
 * CLOUDFLARE PAGES WORKER PROXY — LKPD TIKTOK SMAN 1 BANCAR
 * =========================================================================
 * File: _worker.js
 * Fungsi: Reverse proxy bawaan Cloudflare Pages (Advanced Mode) untuk
 *         menghilangkan CORS error dari Google Apps Script.
 * Diadaptasi dari arsitektur Cloudflare Pages: santoso / aidukasi.net
 * =========================================================================
 * 
 * CARA KERJA:
 * 1. Cloudflare Pages otomatis mengenali file `_worker.js` di root folder.
 * 2. Semua request ke `/api` atau `/api?action=...` diteruskan ke Google Apps Script (GAS_URL).
 * 3. Semua request halaman web statis (index.html, config.js, dll) disajikan langsung oleh env.ASSETS.
 * 4. Anda TIDAK PERLU membuat Cloudflare Worker terpisah di dashboard Cloudflare!
 * 
 * PENGATURAN DI CLOUDFLARE PAGES:
 * Di dashboard Cloudflare Pages > Project lkpdtiktok > Settings > Environment variables:
 * - Variable name: GAS_URL
 * - Value: https://script.google.com/macros/s/AKfycby.../exec (URL Web App Apps Script Anda)
 * =========================================================================
 */

// Fallback jika env.GAS_URL belum diatur di dashboard Cloudflare Pages
const DEFAULT_GAS_URL = "https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec";

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const gasUrl = (env && env.GAS_URL) ? env.GAS_URL : DEFAULT_GAS_URL;

    // CORS Headers lengkap
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
      'Access-Control-Max-Age': '86400',
    };

    // 1. Tangani Preflight HTTP OPTIONS
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    // 2. Jika Request API (/api)
    if (url.pathname.startsWith('/api')) {
      const targetUrl = new URL(gasUrl);

      // Teruskan query parameters ke Google Apps Script
      url.searchParams.forEach((value, key) => {
        targetUrl.searchParams.set(key, value);
      });

      // Siapkan opsi fetch ke Apps Script
      const fetchOptions = {
        method: request.method,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'text/plain;charset=utf-8',
        },
        redirect: 'follow', // Wajib follow redirect 302 bawaan Google
      };

      if (request.method === 'POST') {
        try {
          fetchOptions.body = await request.text();
        } catch (e) {}
      }

      try {
        const gasResponse = await fetch(targetUrl.toString(), fetchOptions);
        const responseData = await gasResponse.text();

        return new Response(responseData, {
          status: gasResponse.status,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json; charset=utf-8',
            'Cache-Control': 'no-store, no-cache',
          },
        });
      } catch (err) {
        return new Response(JSON.stringify({
          status: 'error',
          message: 'Gagal terhubung ke Google Apps Script: ' + err.message,
        }), {
          status: 502,
          headers: { ...corsHeaders, 'Content-Type': 'application/json; charset=utf-8' },
        });
      }
    }

    // 3. Default: Sajikan aset statis Cloudflare Pages (HTML, JS, CSS)
    if (env && env.ASSETS) {
      return env.ASSETS.fetch(request);
    }

    return fetch(request);
  },
};
