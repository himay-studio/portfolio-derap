#!/usr/bin/env node
/**
 * Tangkapan layar untuk R51.
 *
 * Dipisah dari `qa-check.mjs` karena menggabungkan 80 screenshot ke dalam
 * sapuan yang sama membuat Chromium mati di tengah jalan ("Navigating frame
 * was detached"). Di sini browser-nya dimulai ulang tiap breakpoint supaya
 * pemakaian memorinya tidak menumpuk.
 *
 * Diambil pada keadaan TERBURUK, bukan keadaan yang nyaman: gulir nol, papan
 * Kanban penuh di mobile, dan modal dalam keadaan terbuka.
 */

import { createServer } from 'node:http';
import { createReadStream, existsSync, mkdirSync, statSync } from 'node:fs';
import { dirname, extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';
import { siapkanBrowser } from './qa-setup.mjs';

const AKAR = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(AKAR, 'out');
const SHOTS = join(AKAR, 'qa-shots');
const PORT = 4321;
const LEBAR = [375, 480, 768, 1025, 1440];

const RUTE = [
  '/',
  '/login/',
  '/app/',
  '/app/proyek/',
  '/app/proyek/aplikasi-kasir-warung-pintar/',
  '/app/tugas/',
  '/app/tugas/t007/',
  '/app/sprint/',
  '/app/sprint/wpr-sprint-11/',
  '/app/tim/',
  '/app/tim/rangga-prasetyo/',
  '/app/timesheet/',
  '/app/pengaturan/',
  '/app/pengaturan/status/',
  '/app/pengaturan/label/',
];

const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.ico': 'image/x-icon', '.woff2': 'font/woff2', '.txt': 'text/plain' };

function server() {
  return new Promise((ok) => {
    const s = createServer((req, res) => {
      const j = decodeURIComponent(req.url.split('?')[0]);
      const f = extname(j) ? join(OUT, j) : join(OUT, j.replace(/\/$/, ''), 'index.html');
      if (!existsSync(f) || statSync(f).isDirectory()) { res.writeHead(404); res.end('404'); return; }
      res.writeHead(200, { 'content-type': MIME[extname(f)] ?? 'application/octet-stream' });
      createReadStream(f).pipe(res);
    });
    s.listen(PORT, () => ok(s));
  });
}

const nama = (j) => (j === '/' ? 'root' : j.replace(/^\/|\/$/g, '').split('/').join('_'));

async function utama() {
  const { chrome } = siapkanBrowser();
  const srv = await server();
  const url = `http://127.0.0.1:${PORT}`;

  const ARGS = ['--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage', '--hide-scrollbars', '--disable-background-networking', '--disable-extensions'];

  for (const lebar of LEBAR) {
    let browser = await puppeteer.launch({ executablePath: chrome, headless: 'shell', args: ARGS });
    let page = await browser.newPage();
    await page.setViewport({ width: lebar, height: lebar <= 480 ? 812 : 900 });
    const dir = join(SHOTS, String(lebar));
    mkdirSync(dir, { recursive: true });

    /**
     * Chromium di runtime ini kadang memutus koneksi di tengah rentetan
     * screenshot, bukan karena kehabisan memori (masih 56 GB bebas) tapi
     * karena renderer-nya sesekali mati. Jadi tiap halaman dicoba lagi dengan
     * browser baru sekali. Menyerah di sini berarti tidak ada bukti visual
     * sama sekali, dan R51 memperlakukan itu sebagai QA yang tidak terjadi.
     */
    const tangkap = async (jalur, berkas, siapkan) => {
      for (let percobaan = 0; percobaan < 2; percobaan += 1) {
        try {
          await page.goto(url + jalur, { waitUntil: 'networkidle0' });
          await new Promise((r) => setTimeout(r, 450));
          if (siapkan) await siapkan(page);
          await page.screenshot({ path: join(dir, berkas) });
          return;
        } catch (e) {
          process.stdout.write(`  ulang ${jalur} @${lebar}px setelah ${e.message.split('\n')[0]}\n`);
          try { await browser.close(); } catch { /* sudah mati */ }
          browser = await puppeteer.launch({ executablePath: chrome, headless: 'shell', args: ARGS });
          page = await browser.newPage();
          await page.setViewport({ width: lebar, height: lebar <= 480 ? 812 : 900 });
        }
      }
      throw new Error(`Gagal menangkap ${jalur} pada ${lebar}px setelah dua percobaan.`);
    };

    for (const jalur of RUTE) {
      await tangkap(jalur, `${nama(jalur)}.png`);
    }

    // Keadaan terburuk, bukan keadaan yang nyaman.
    await tangkap('/app/tugas/', 'tugas_modal-terbuka.png', async (p) => {
      await p.evaluate(() => {
        const b = [...document.querySelectorAll('button')].find((x) => x.textContent.includes('Tambah Tugas'));
        b?.click();
      });
      await new Promise((r) => setTimeout(r, 500));
    });

    if (lebar <= 1024) {
      await tangkap('/app/', 'app_tirai-terbuka.png', async (p) => {
        await p.click('.tb-hamburger');
        await new Promise((r) => setTimeout(r, 500));
      });
    } else {
      await tangkap('/app/tugas/', 'tugas_dropdown-terbuka.png', async (p) => {
        await p.click('.dv-penyaring [role="combobox"]');
        await p.mouse.move(2, 2);
        await new Promise((r) => setTimeout(r, 400));
      });
    }

    await browser.close();
    process.stdout.write(`${lebar}px selesai\n`);
  }

  srv.close();
  process.stdout.write(`Tangkapan layar ada di ${SHOTS}\n`);
}

utama();
