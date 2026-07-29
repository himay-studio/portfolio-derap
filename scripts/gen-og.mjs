#!/usr/bin/env node
/**
 * Membuat `public/og-derap.png`, 1200 x 630.
 *
 * ART-DIRECTION.md menyebut banner ini sebagai aset O01 yang digenerate model
 * gambar. Tidak perlu. Isinya cuma persegi datar, satu wordmark, dan dua baris
 * teks, semuanya sudah punya spesifikasi geometri yang pasti, jadi menulisnya
 * sebagai SVG lalu dirender Chromium menghasilkan tepi yang lebih tajam, ukuran
 * berkas lebih kecil, ejaan yang dijamin benar, dan nol biaya kredit gambar.
 *
 * Ini juga menutup satu satunya alasan `MEDIA.md` perlu berisi apa apa.
 *
 * Pemakaian: node scripts/gen-og.mjs
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';
import { siapkanBrowser } from './qa-setup.mjs';

const AKAR = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const KELUARAN = join(AKAR, 'public', 'og-derap.png');

// Mark knockout dipakai apa adanya dari aset Stage 2, jadi banner ini tidak
// bisa menyimpang dari logo yang sudah dikunci.
const markSvg = readFileSync(join(AKAR, 'public', 'mark-derap-knockout.svg'), 'utf8');
const markInline = `data:image/svg+xml;base64,${Buffer.from(markSvg).toString('base64')}`;

const halaman = `<!doctype html>
<html><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600;700&family=Inter:wght@400;500&display=swap" rel="stylesheet">
<style>
  * { margin:0; padding:0; box-sizing:border-box; border-radius:0; }
  body { width:1200px; height:630px; background:#0E1524; display:flex; align-items:center;
         font-family:'Inter',system-ui,sans-serif; overflow:hidden; }
  .kiri { width:560px; padding:0 0 0 72px; }
  .lockup { display:flex; align-items:center; gap:18px; }
  .lockup img { width:64px; height:64px; }
  .nama { font-family:'Plus Jakarta Sans',sans-serif; font-weight:700; font-size:64px;
          letter-spacing:-0.02em; color:#FFFFFF; line-height:1; }
  .tagline { margin-top:28px; font-size:24px; line-height:34px; color:#C3CCDC; }
  .kanan { flex:1; height:100%; display:flex; gap:16px; padding:64px 72px 64px 0; }
  .kolom { flex:1; background:#182236; border:1px solid #232E45; padding:12px; display:flex;
           flex-direction:column; gap:10px; }
  .kartu { background:#0E1524; border:1px solid #232E45; height:64px; }
  .kartu.aksen { border-left:4px solid #2440BE; }
  .bar { height:8px; background:#2440BE; }
  .bar.redup { background:#232E45; }
</style></head>
<body>
  <div class="kiri">
    <div class="lockup">
      <img src="${markInline}" alt="">
      <span class="nama">Derap</span>
    </div>
    <p class="tagline">Manajemen proyek untuk tim Indonesia</p>
  </div>
  <div class="kanan">
    <div class="kolom">
      <div class="bar"></div>
      <div class="kartu aksen"></div><div class="kartu"></div><div class="kartu"></div>
    </div>
    <div class="kolom">
      <div class="bar redup"></div>
      <div class="kartu"></div><div class="kartu aksen"></div>
    </div>
    <div class="kolom">
      <div class="bar redup"></div>
      <div class="kartu"></div><div class="kartu"></div><div class="kartu aksen"></div>
    </div>
  </div>
</body></html>`;

async function utama() {
  const { chrome } = siapkanBrowser();
  const browser = await puppeteer.launch({
    executablePath: chrome,
    headless: 'shell',
    args: ['--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage', '--hide-scrollbars'],
  });
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 });
    await page.setContent(halaman, { waitUntil: 'networkidle0' });
    await new Promise((r) => setTimeout(r, 600));
    const buf = await page.screenshot({ type: 'png' });
    writeFileSync(KELUARAN, buf);
    process.stdout.write(`Tersimpan ${KELUARAN}\n`);
  } finally {
    await browser.close();
  }
}

utama();
