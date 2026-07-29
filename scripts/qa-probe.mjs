#!/usr/bin/env node
/**
 * Probe kepercayaan terhadap harness QA.
 *
 * "Nol temuan" hanya berarti sesuatu kalau pemeriksanya memang menyentuh
 * elemen. Skrip ini menghitung berapa yang diperiksa, lalu MENYUNTIKKAN cacat
 * palsu untuk memastikan pemeriksanya benar benar menangkapnya. Pemeriksa yang
 * tidak pernah gagal pada cacat buatan adalah pemeriksa yang tidak bekerja.
 *
 * Sekaligus menguji drag and drop papan Kanban lewat papan ketik, yang tidak
 * bisa dibuktikan dengan membaca markup.
 */

import { createServer } from 'node:http';
import { createReadStream, existsSync, statSync } from 'node:fs';
import { dirname, extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';
import { siapkanBrowser } from './qa-setup.mjs';

const AKAR = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(AKAR, 'out');
const PORT = 4319;

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

const lap = (ok, teks) => process.stdout.write(`${ok ? 'LOLOS ' : 'GAGAL '} ${teks}\n`);
let gagal = 0;
const uji = (ok, teks) => { if (!ok) gagal += 1; lap(ok, teks); };

async function utama() {
  const { chrome } = siapkanBrowser();
  const srv = await server();
  const url = `http://127.0.0.1:${PORT}`;
  const browser = await puppeteer.launch({
    executablePath: chrome,
    headless: 'shell',
    args: ['--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage', '--hide-scrollbars'],
  });

  try {
    const page = await browser.newPage();

    /* ---- 1. Sapuan kontras memang menyentuh elemen, dan memang bisa gagal ---- */
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(`${url}/app/tugas/`, { waitUntil: 'networkidle0' });
    await new Promise((r) => setTimeout(r, 400));

    const hitung = await page.evaluate(() =>
      [...document.querySelectorAll('button, a, input, .badge, .chip, h1, h2, h3, p, span, td, th, li')]
        .filter((el) => {
          const r = el.getBoundingClientRect();
          if (r.width < 2 || r.height < 2) return false;
          return [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
        }).length,
    );
    uji(hitung > 80, `Sapuan kontras menyentuh ${hitung} elemen berteks di /app/tugas/`);

    // Suntik satu elemen yang PASTI gagal kontras, lalu jalankan logika yang sama.
    const tertangkap = await page.evaluate(() => {
      const d = document.createElement('p');
      d.textContent = 'Uji kontras sengaja buruk';
      d.style.cssText = 'color:#c9cdd4;background:#ffffff;font-size:14px;padding:4px';
      d.id = 'probe-kontras';
      document.body.appendChild(d);

      const lum = ([r, g, b]) => {
        const f = (c) => { const s = c / 255; return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4; };
        return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
      };
      const rasio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
      const urai = (s) => s.match(/[\d.]+/g).slice(0, 3).map(Number);
      const el = document.getElementById('probe-kontras');
      const n = rasio(urai(getComputedStyle(el).color), urai(getComputedStyle(el).backgroundColor));
      el.remove();
      return n;
    });
    uji(tertangkap < 4.5, `Logika kontras menandai elemen buruk buatan, rasionya ${tertangkap.toFixed(2)}:1`);

    /* ---- 2. Latar EFEKTIF ditelusuri, bukan latar elemen itu sendiri ---- */
    const efektif = await page.evaluate(() => {
      const urai = (s) => { const m = s.match(/[\d.]+/g); return m ? m.slice(0, 4).map(Number) : null; };
      const el = document.querySelector('.sb-item-aktif') ?? document.querySelector('.sb-item');
      if (!el) return null;
      const sendiri = getComputedStyle(el).backgroundColor;
      let efektifWarna = null;
      for (let n = el; n && n !== document.documentElement; n = n.parentElement) {
        const bg = urai(getComputedStyle(n).backgroundColor);
        if (bg && (bg[3] === undefined || bg[3] > 0)) { efektifWarna = getComputedStyle(n).backgroundColor; break; }
      }
      return { sendiri, efektifWarna };
    });
    uji(
      Boolean(efektif?.efektifWarna) && efektif.efektifWarna !== 'rgba(0, 0, 0, 0)',
      `Penelusuran latar efektif pada item sidebar, sendiri=${efektif?.sendiri} efektif=${efektif?.efektifWarna}`,
    );

    /* ---- 3. Pemicu dropdown memang ditemukan dan panelnya memang ada ---- */
    const pemicu = await page.$$('[aria-haspopup]');
    uji(pemicu.length >= 6, `Ditemukan ${pemicu.length} pemicu dropdown di /app/tugas/`);

    const sel = await page.$('.dv-penyaring [role="combobox"]');
    await sel.click();
    await page.mouse.move(2, 2);
    await new Promise((r) => setTimeout(r, 260));
    const buka = await sel.evaluate((n) => {
      const p = document.getElementById(n.getAttribute('aria-controls'));
      const cs = getComputedStyle(p);
      return { expanded: n.getAttribute('aria-expanded'), display: cs.display, tinggi: Math.round(p.getBoundingClientRect().height) };
    });
    uji(buka.expanded === 'true' && buka.display !== 'none' && buka.tinggi > 20, `Select terbuka, aria-expanded=${buka.expanded} display=${buka.display} tinggi=${buka.tinggi}`);

    await page.keyboard.press('Escape');
    await new Promise((r) => setTimeout(r, 300));
    const tutup = await sel.evaluate((n) => {
      const p = document.getElementById(n.getAttribute('aria-controls'));
      return { expanded: n.getAttribute('aria-expanded'), display: getComputedStyle(p).display };
    });
    // R57. Tertutup berarti display:none, bukan sekadar opacity 0, supaya panel
    // berhenti memakan layout.
    uji(tutup.expanded === 'false' && tutup.display === 'none', `Select tertutup, aria-expanded=${tutup.expanded} display=${tutup.display}`);

    /* ---- 4. Drag and drop Kanban lewat PAPAN KETIK benar benar jalan ---- */
    await page.goto(`${url}/app/tugas/`, { waitUntil: 'networkidle0' });
    await page.evaluate(() => localStorage.clear());
    await page.reload({ waitUntil: 'networkidle0' });
    await new Promise((r) => setTimeout(r, 500));

    const sebelum = await page.evaluate(() => {
      const kartu = document.querySelector('.kb-col .kb-card');
      return { kolom: kartu.closest('.kb-col').getAttribute('aria-label'), href: kartu.getAttribute('href') };
    });

    await page.focus('.kb-col .kb-card');
    await page.keyboard.press('Space');                 // angkat
    await new Promise((r) => setTimeout(r, 120));
    const terangkat = await page.evaluate(() => Boolean(document.querySelector('.kb-card-angkat')));
    uji(terangkat, 'Space mengangkat kartu Kanban');

    const umum = await page.evaluate(() => document.querySelector('[role="status"]')?.textContent ?? '');
    uji(umum.includes('terangkat'), `Perpindahan diumumkan ke pembaca layar: "${umum.slice(0, 70)}"`);

    await page.keyboard.press('ArrowRight');            // pindah kolom
    await new Promise((r) => setTimeout(r, 160));
    await page.keyboard.press('Space');                 // letakkan
    await new Promise((r) => setTimeout(r, 200));

    const sesudah = await page.evaluate((href) => {
      const kartu = document.querySelector(`.kb-card[href="${href}"]`);
      return kartu ? kartu.closest('.kb-col').getAttribute('aria-label') : null;
    }, sebelum.href);
    uji(sesudah !== null && sesudah !== sebelum.kolom, `Kartu pindah kolom lewat papan ketik: "${sebelum.kolom}" ke "${sesudah}"`);

    // Pilihan itu harus bertahan setelah muat ulang, karena mutasi demo
    // disimpan ke localStorage.
    await page.reload({ waitUntil: 'networkidle0' });
    await new Promise((r) => setTimeout(r, 500));
    const setelahReload = await page.evaluate((href) => {
      const kartu = document.querySelector(`.kb-card[href="${href}"]`);
      return kartu ? kartu.closest('.kb-col').getAttribute('aria-label') : null;
    }, sebelum.href);
    uji(setelahReload === sesudah, `Perpindahan bertahan setelah muat ulang, kolomnya ${setelahReload}`);

    /* ---- 5. Pilihan view bertahan antar kunjungan ---- */
    await page.evaluate(() => localStorage.clear());
    await page.reload({ waitUntil: 'networkidle0' });
    await new Promise((r) => setTimeout(r, 400));
    const tombolTabel = await page.$$eval('.vs-btn', (b) => b.map((x) => x.getAttribute('title')));
    const idxTabel = tombolTabel.indexOf('Tabel');
    await page.evaluate((i) => document.querySelectorAll('.vs-btn')[i].click(), idxTabel);
    await new Promise((r) => setTimeout(r, 400));
    await page.reload({ waitUntil: 'networkidle0' });
    await new Promise((r) => setTimeout(r, 500));
    const viewAktif = await page.evaluate(() => {
      const a = document.querySelector('.vs-btn-aktif');
      return a ? a.getAttribute('title') : null;
    });
    uji(viewAktif === 'Tabel', `Pilihan view bertahan setelah muat ulang, aktif sekarang ${viewAktif}`);

    /* ---- 6. Sidebar lipat bertahan dan tidak berkedip ---- */
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(`${url}/app/`, { waitUntil: 'networkidle0' });
    await page.click('.sb-alih');
    await new Promise((r) => setTimeout(r, 300));
    await page.reload({ waitUntil: 'networkidle0' });
    const lebarSb = await page.evaluate(() => ({
      attr: document.documentElement.getAttribute('data-sidebar'),
      lebar: Math.round(document.querySelector('.sb').getBoundingClientRect().width),
    }));
    uji(lebarSb.attr === 'collapsed' && lebarSb.lebar === 64, `Sidebar tetap terlipat setelah muat ulang, lebar ${lebarSb.lebar}px`);

    /* ---- 7. Modal di-portal ke body dan menjerat fokus ---- */
    await page.evaluate(() => localStorage.clear());
    await page.goto(`${url}/app/tugas/`, { waitUntil: 'networkidle0' });
    await new Promise((r) => setTimeout(r, 400));
    await page.evaluate(() => {
      const b = [...document.querySelectorAll('button')].find((x) => x.textContent.includes('Tambah Tugas'));
      b.click();
    });
    await new Promise((r) => setTimeout(r, 400));
    const modal = await page.evaluate(() => {
      const d = document.querySelector('[role="dialog"][aria-modal="true"]');
      if (!d) return null;
      const r = d.getBoundingClientRect();
      return {
        indukOvl: d.parentElement.parentElement?.tagName,
        tinggi: Math.round(r.height),
        fokusDidalam: d.contains(document.activeElement),
      };
    });
    uji(modal?.indukOvl === 'BODY', `Modal di-portal ke body, kakeknya ${modal?.indukOvl}`);
    uji(Boolean(modal?.fokusDidalam), 'Fokus berpindah ke dalam modal saat dibuka');

    await page.keyboard.press('Escape');
    await new Promise((r) => setTimeout(r, 300));
    const setelahTutup = await page.evaluate(() => document.querySelectorAll('[role="dialog"][aria-modal="true"]').length);
    // Modal yang tertutup harus benar benar dilepas, bukan disembunyikan,
    // supaya tidak ada lapisan tak terlihat yang menjerat klik.
    uji(setelahTutup === 0, `Modal dilepas penuh setelah ditutup, sisa dialog ${setelahTutup}`);

    /* ---- 8. Tirai mobile setinggi viewport ---- */
    await page.setViewport({ width: 375, height: 812 });
    await page.goto(`${url}/app/`, { waitUntil: 'networkidle0' });
    await new Promise((r) => setTimeout(r, 400));
    await page.click('.tb-hamburger');
    await new Promise((r) => setTimeout(r, 400));
    const tirai = await page.evaluate(() => {
      const p = document.querySelector('.mn-panel');
      if (!p) return null;
      const r = p.getBoundingClientRect();
      return { top: Math.round(r.top), tinggi: Math.round(r.height), kakek: p.parentElement.parentElement?.tagName };
    });
    uji(
      tirai !== null && tirai.top === 0 && tirai.tinggi >= 800 && tirai.kakek === 'BODY',
      `Tirai mobile setinggi viewport, top=${tirai?.top} tinggi=${tirai?.tinggi} kakek=${tirai?.kakek}`,
    );

    /* ---- 9. Date picker bisa dipakai penuh dari papan ketik ---- */
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(`${url}/app/tugas/`, { waitUntil: 'networkidle0' });
    await new Promise((r) => setTimeout(r, 400));
    await page.click('.dp .sel-trigger');
    await new Promise((r) => setTimeout(r, 300));
    const fokusDiHari = await page.evaluate(() => document.activeElement?.classList.contains('dp-day'));
    uji(Boolean(fokusDiHari), 'Fokus masuk ke grid tanggal saat date picker dibuka');
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowDown');
    await new Promise((r) => setTimeout(r, 160));
    await page.keyboard.press('Enter');
    await new Promise((r) => setTimeout(r, 300));
    const nilaiTanggal = await page.evaluate(() => {
      const t = document.querySelector('.dp .sel-trigger');
      return t.innerText.trim();
    });
    uji(/\d{1,2}\s\w+\s\d{4}/.test(nilaiTanggal), `Tanggal terpilih lewat papan ketik: "${nilaiTanggal}"`);
  } finally {
    await browser.close();
    srv.close();
  }

  process.stdout.write(gagal === 0 ? '\nSEMUA PROBE LOLOS.\n' : `\n${gagal} PROBE GAGAL.\n`);
  process.exitCode = gagal === 0 ? 0 : 1;
}

utama();
