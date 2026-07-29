# Derap

**Ritme kerja tim, terlihat jelas.**

Aplikasi manajemen proyek dan tugas untuk tim kecil sampai menengah di Indonesia (agensi kreatif, software house, tim internal). Ini adalah **demo portfolio Himay Studio**, bukan produk komersial. Semua data di dalamnya adalah data contoh.

Dibuat oleh [Himay Studio](https://himaystudio.com).

---

## Status pipeline

| Stage | Peran | Status |
| --- | --- | --- |
| 1 | Brand Strategist | Selesai |
| 2 | Asset Forge (logo dan favicon) | Selesai |
| 3 | Webapp Architect (arsitektur, scaffold, semua layar, MEDIA.md) | Belum mulai |
| 4 | Media Producer (generate aset) | Belum mulai |
| 5 | Frontend Builder (implementasi penuh, data demo, interaksi) | Belum mulai |
| 6 | QA Deploy Engineer | Belum mulai |
| 7 | Project Recorder (video walkthrough) | Belum mulai |
| 8 | Review Curator | Belum mulai |

Issue induk: HIM-282. Stage 1: HIM-286.

---

## Dokumen

Baca berurutan sebelum menyentuh kode.

| Berkas | Isi |
| --- | --- |
| [`BRAND.md`](./BRAND.md) | Riset niche, kompetitor, posisi, nama, nada bicara, do dan don't |
| [`DESIGN.md`](./DESIGN.md) | Token CSS lengkap, **tabel kontras terhitung**, tipografi, skala padat data, bentuk, gerak, tata letak |
| [`ART-DIRECTION.md`](./ART-DIRECTION.md) | Konsep logo, prompt siap pakai, spesifikasi favicon, arahan avatar dan tangkapan layar |
| [`LOGO.md`](./LOGO.md) | Prompt logo siap tempel, versi ringkas untuk dieksekusi langsung |

---

## Ringkasan sistem desain

| Aspek | Nilai |
| --- | --- |
| Warna brand | `#2440BE` nila tinta |
| Kanvas | `#F4F6F9` |
| Permukaan | `#FFFFFF` |
| Teks utama | `#131821` |
| Sidebar | `#0E1524` gelap, permanen |
| CTA konversi (landing dan login saja) | `#17803D` hijau |
| Font judul | Plus Jakarta Sans 600, 700 |
| Font antarmuka | Inter 400, 500, 600, basis 14px |
| Font kode dan angka | JetBrains Mono 400, 500 |
| Radius | **0 di mana mana**, termasuk avatar |
| Kode tugas | `DRP-<nomor>`, contoh `DRP-142` |

Setiap pasangan warna di `DESIGN.md` sudah dihitung rasio kontrasnya dengan rumus WCAG 2.1. Stage berikutnya tidak perlu menebak, tinggal pakai.

---

## Rencana modul

- **Dashboard**: tugas jatuh tempo, yang telat, beban tim, progres proyek.
- **Proyek**: daftar proyek, kesehatan proyek (On Track, Berisiko, Telat), pemilik, anggota, tanggal.
- **Tugas**: penanggung jawab, prioritas, label, tenggat, estimasi jam, sub tugas, checklist, komentar, lampiran mock, riwayat aktivitas.
- **Empat view setara**: Kanban (tarik lepas, bisa keyboard), Tabel (sortir, filter, kolom bisa dipilih), Kalender (berdasarkan tenggat), Timeline sederhana.
- **Sprint dan milestone**: kelompok pekerjaan berjangka, burndown sederhana.
- **Tim**: daftar anggota, beban kerja per orang, peran.
- **Timesheet**: catat jam per tugas, rekap per orang dan per proyek.
- **Pengaturan**: workspace, kolom status kustom, label.

---

## Rencana teknis

- Next.js dengan `output: 'export'` (static export).
- Data demo statis di `src/data/*.ts`, mutasi demo disimpan di localStorage, tanpa backend.
- Login demo: kredensial ditampilkan di layar login, satu klik masuk. Tidak ada autentikasi nyata.
- Deploy ke Cloudflare Pages project `himaystudio-portfolio-derap`, domain publik `portfolio-derap.himaystudio.com`.

---

## Aturan build yang mengikat

Sudah dijabarkan konkret di `DESIGN.md`. Ringkasnya:

- **R10** sudut siku, radius 0, termasuk avatar persegi.
- **R11 dan R58** tanpa em dash dan en dash, termasuk entity HTML. Diperiksa pada teks ter-render.
- **R12** dropdown kustom beranimasi dan bisa keyboard, `<select>` bawaan dilarang.
- **R20** kontras WCAG AA pada setiap kontrol, termasuk checkbox, toggle, badge, stepper.
- **R21** date picker kustom, input teks tanggal bebas dilarang.
- **R43** logo wajib dua varian, primary dan knockout putih.
- **R46** animasi tiap perpindahan halaman, 150 sampai 300ms, hormati `prefers-reduced-motion`.
- **R47, R48, R52** topbar mobile satu baris bersih, section lebih dari 3 item jadi carousel, tidak ada elemen bertumpuk.
- **R50** judul dan label sekunder wajib elemen blok terpisah.
- **R53** overlay layar penuh di-portal ke `document.body`, jangan bersarang di ancestor ber-`backdrop-filter`.
- **R57 dan R19** tanpa overflow horizontal di 375, 480, 768, 1025, 1440, diukur dengan panel tertutup maupun terbuka.
- **R59** semua link internal 200, tanpa halaman yatim.
- **R60** `aria-expanded` sinkron dengan panel yang benar benar terbuka.
- **R61** `rm -rf out .next` sebelum tiap build deploy.

---

Dibuat oleh [Himay Studio](https://himaystudio.com).
