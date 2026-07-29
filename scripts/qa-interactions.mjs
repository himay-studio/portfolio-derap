#!/usr/bin/env node
/**
 * Uji interaksi Stage 5: pencarian global, Tambah Tugas yang benar benar
 * menyimpan ke localStorage, panel pratinjau (Drawer), dan komentar dengan
 * mention. `qa-check.mjs` mengukur markup dan kontras di semua rute, tapi
 * tidak pernah MENGKLIK apa pun, jadi tidak bisa membuktikan sebuah form
 * benar benar menyimpan atau sebuah panel benar benar terbuka. Skrip ini
 * mengisi celah itu.
 *
 * Pemakaian:  npm run build && node scripts/qa-interactions.mjs
 */
import { createServer } from 'node:http';
import { createReadStream, existsSync, statSync } from 'node:fs';
import { extname, join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';
import { siapkanBrowser } from './qa-setup.mjs';

const AKAR = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(AKAR, 'out');
const PORT = 4323;
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

const ok = (label, cond) => { console.log(`${cond ? 'OK  ' : 'GAGAL'} ${label}`); if (!cond) process.exitCode = 1; };

async function utama() {
  const { chrome } = siapkanBrowser();
  const srv = await server();
  const url = `http://127.0.0.1:${PORT}`;
  const browser = await puppeteer.launch({ executablePath: chrome, headless: 'shell', args: ['--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 960 });
  page.on('pageerror', (e) => console.log('PAGEERROR', e.message));
  page.on('console', (m) => { if (m.type() === 'error') console.log('CONSOLE ERROR', m.text()); });

  // 1. Pencarian global
  await page.goto(`${url}/app/tugas/`, { waitUntil: 'networkidle0' });
  await page.type('.tb-cari input', 'Sinkronisasi');
  await new Promise((r) => setTimeout(r, 400));
  const hasilCari = await page.$$eval('.tb-cari-pop .sel-opt', (els) => els.length);
  ok('Pencarian global menampilkan hasil untuk "Sinkronisasi"', hasilCari > 0);
  await page.keyboard.press('Escape');
  await page.evaluate(() => { document.querySelector('.tb-cari input').value = ''; });

  // 2. Tambah Tugas benar-benar tersimpan
  const jumlahSebelum = await page.$eval('.dv-ringkas', (el) => el.textContent);
  await page.evaluate(() => {
    [...document.querySelectorAll('button')].find((b) => b.textContent.includes('Tambah Tugas'))?.click();
  });
  await new Promise((r) => setTimeout(r, 350));
  const modalTerbuka = await page.$('.ovl-modal');
  ok('Modal Tambah Tugas terbuka', Boolean(modalTerbuka));

  await page.type('.ovl-modal input.input', 'Tugas asap Stage 5');
  await page.evaluate(() => {
    const ta = document.querySelector('.ovl-modal textarea');
    ta.value = 'Dibuat oleh smoke test Stage 5.';
    ta.dispatchEvent(new Event('input', { bubbles: true }));
  });
  // Pilih proyek lewat dropdown kustom (R12, bukan native select)
  await page.evaluate(() => {
    const trigger = [...document.querySelectorAll('.ovl-modal .sel-trigger')][0];
    trigger.click();
  });
  await new Promise((r) => setTimeout(r, 300));
  await page.evaluate(() => {
    const opt = document.querySelector('.ovl-modal .sel-opt');
    opt?.dispatchEvent(new Event('pointerdown', { bubbles: true }));
  });
  await new Promise((r) => setTimeout(r, 200));

  await page.evaluate(() => {
    [...document.querySelectorAll('.ovl-foot button')].find((b) => b.textContent.includes('Simpan Tugas'))?.click();
  });
  await new Promise((r) => setTimeout(r, 500));

  const drawerTerbuka = await page.$('.ovl-drawer');
  ok('Panel pratinjau (Drawer) terbuka otomatis setelah tugas baru dibuat', Boolean(drawerTerbuka));
  const drawerJudul = drawerTerbuka ? await page.$eval('.ovl-drawer h2', (el) => el.textContent) : '';
  ok('Panel pratinjau menampilkan judul tugas baru', drawerJudul.includes('Tugas asap Stage 5'));

  // Komentar dengan mention di dalam drawer
  await page.type('.ovl-drawer textarea', 'Halo @Ayu');
  await new Promise((r) => setTimeout(r, 250));
  const mentionMuncul = await page.$('.komentar-mention');
  ok('Popover mention muncul saat mengetik @', Boolean(mentionMuncul));
  await page.evaluate(() => {
    const opt = document.querySelector('.komentar-mention .sel-opt');
    opt?.dispatchEvent(new Event('pointerdown', { bubbles: true }));
  });
  await page.evaluate(() => {
    [...document.querySelectorAll('.ovl-drawer button')].find((b) => b.textContent.includes('Kirim komentar'))?.click();
  });
  await new Promise((r) => setTimeout(r, 300));
  const komentarMasuk = await page.$eval('.ovl-drawer', (el) => el.textContent);
  ok('Komentar dengan mention tersimpan dan tampil di panel', komentarMasuk.includes('Halo') && komentarMasuk.includes('Ayu'));

  await page.keyboard.press('Escape');
  await new Promise((r) => setTimeout(r, 300));
  const jumlahSesudah = await page.$eval('.dv-ringkas', (el) => el.textContent);
  ok(`Ringkasan jumlah tugas bertambah setelah simpan (${jumlahSebelum} -> ${jumlahSesudah})`, jumlahSebelum !== jumlahSesudah);

  // 3. Reload halaman, pastikan localStorage benar-benar menyimpan
  await page.reload({ waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 300));
  const jumlahSetelahReload = await page.$eval('.dv-ringkas', (el) => el.textContent);
  ok('Tugas baru bertahan setelah reload halaman (localStorage)', jumlahSetelahReload === jumlahSesudah);

  // 4. aria-expanded sinkron pada trigger pencarian (R60)
  await page.type('.tb-cari input', 'Ayu');
  await new Promise((r) => setTimeout(r, 300));
  const ariaExpanded = await page.$eval('.tb-cari input', (el) => el.getAttribute('aria-expanded'));
  ok('aria-expanded=true saat hasil pencarian tampil', ariaExpanded === 'true');

  // 5. R57, panel pencarian tertutup tidak menyumbang overflow
  await page.evaluate(() => { document.querySelector('.tb-cari input').blur(); });
  await page.mouse.click(700, 5);
  await new Promise((r) => setTimeout(r, 300));
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  ok(`Tidak ada overflow horizontal setelah panel pencarian ditutup (selisih ${overflow}px)`, overflow <= 0);

  await browser.close();
  srv.close();
}

utama();
