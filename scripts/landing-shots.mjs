#!/usr/bin/env node
/**
 * Empat tangkapan layar produk untuk halaman landing (S01 sampai S04 di
 * MEDIA.md). Bukan pekerjaan generate, diambil langsung dari `out/` hasil
 * `npm run build`, 1440px, skala 2x, disimpan langsung ke `public/img/`
 * dengan nama persis seperti tabel MEDIA.md.
 *
 * Pemakaian:  npm run build && node scripts/landing-shots.mjs
 */

import { createServer } from 'node:http';
import { createReadStream, existsSync, mkdirSync, statSync } from 'node:fs';
import { extname, join, resolve } from 'node:path';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';
import { siapkanBrowser } from './qa-setup.mjs';

const AKAR = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(AKAR, 'out');
const IMG = join(AKAR, 'public', 'img');
const PORT = 4322;

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

async function utama() {
  mkdirSync(IMG, { recursive: true });
  const { chrome } = siapkanBrowser();
  const srv = await server();
  const url = `http://127.0.0.1:${PORT}`;
  const ARGS = ['--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage', '--hide-scrollbars', '--disable-background-networking', '--disable-extensions'];

  const browser = await puppeteer.launch({ executablePath: chrome, headless: 'shell', args: ARGS });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 960, deviceScaleFactor: 2 });

  const jepret = async (jalur, berkas, ubahView) => {
    await page.goto(url + jalur, { waitUntil: 'networkidle0' });
    await new Promise((r) => setTimeout(r, 500));
    if (ubahView) {
      await page.evaluate((label) => {
        const b = [...document.querySelectorAll('.vs-btn')].find((x) => x.title === label);
        b?.click();
      }, ubahView);
      await new Promise((r) => setTimeout(r, 500));
    }
    await page.screenshot({ path: join(IMG, berkas) });
    process.stdout.write(`  ${berkas}\n`);
  };

  // S01, papan Kanban, view bawaan Tugas.
  await jepret('/app/tugas/', 'app-kanban.png');
  // S02, view Tabel di halaman yang sama.
  await jepret('/app/tugas/', 'app-tabel.png', 'Tabel');
  // S03, view Timeline di halaman Proyek.
  await jepret('/app/proyek/', 'app-timeline.png', 'Timeline');
  // S04, Dashboard.
  await jepret('/app/', 'app-dashboard.png');

  await browser.close();
  srv.close();
  process.stdout.write(`Tangkapan layar landing tersimpan di ${IMG}\n`);
}

utama();
