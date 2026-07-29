# Derap, LOGO.md

Lembar kerja ringkas untuk Asset Forge (Stage 2). Cukup baca berkas ini untuk mengeksekusi logo dan favicon.

> **Sumber kebenaran lengkap ada di [`ART-DIRECTION.md`](./ART-DIRECTION.md)** (geometri presisi, aturan lockup, ruang aman, arahan avatar dan tangkapan layar). Berkas ini adalah ekstrak yang siap dieksekusi. Kalau ada yang bentrok, `ART-DIRECTION.md` yang menang.

---

## Jalur eksekusi yang direkomendasikan

Bentuk logo Derap hanya **tiga jajar genjang dan satu teks**. Kalau kamu sanggup menulis SVG langsung dari spesifikasi geometri di bawah, **lakukan itu**, hasilnya akan lebih tajam, lebih kecil, dan persis sesuai spesifikasi dibanding hasil generate. Prompt di bagian bawah adalah jalur cadangan.

### Spesifikasi geometri, kanvas 100 x 100

Tiga jajar genjang siku, berdiri pada garis dasar y = 90, tanpa satu pun sudut membulat.

| Batang | Lebar | Tinggi | x dasar | Kemiringan |
| --- | --- | --- | --- | --- |
| 1 | 18 | 38 | 12 | 12 derajat ke kanan |
| 2 | 18 | 60 | 41 | 12 derajat ke kanan |
| 3 | 18 | 82 | 70 | 12 derajat ke kanan |

Jarak antar batang 11 unit, sama rata. Garis dasar tidak digambar, hanya tersirat.

Arti bentuknya: tiga langkah yang bergerak maju (derap), sekaligus grafik batang yang menanjak (manajemen proyek). Satu bentuk, dua bacaan.

### Wordmark

**Derap**, D kapital sisanya kecil, **Plus Jakarta Sans Bold 700**, letter-spacing `-0.02em`. Mark di kiri, wordmark di kanan, tinggi mark sama dengan tinggi kapital D, jarak antar keduanya selebar satu batang.

---

## Dua varian WAJIB (R43)

Ini bagian yang paling sering gagal di build sebelumnya. Logo satu varian akan lenyap di sidebar gelap.

| Varian | Mark | Wordmark | Latar |
| --- | --- | --- | --- |
| **Primary** | `#2440BE` | `#131821` | terang: `#FFFFFF`, `#F4F6F9` |
| **Knockout** | `#FFFFFF` | `#FFFFFF` | gelap: `#0E1524`, `#131821`, `#2440BE` |

- Kedua varian **latarnya transparan**. Mark **tidak boleh** berupa kotak berwarna yang membawa ground sendiri. Ground sendiri itulah yang membuat logo berubah jadi persegi kosong di footer sewarna (kegagalan Legatara).
- Sidebar aplikasi berlatar `#0E1524`, jadi sidebar **wajib** memakai varian knockout. Putih di atas `#0E1524` menghasilkan 18.24:1.
- Satu satunya bentuk yang boleh punya ground penuh adalah **app icon dan favicon**: ground `#2440BE`, batang putih.

---

## Prompt siap tempel

Tempel **utuh**, termasuk blok NEGATIVE. Jangan hanya bagian MARK.

### 1. Varian PRIMARY

```
Flat vector logo for "Derap", an Indonesian project management software product.

MARK: three geometric parallelogram bars standing on a shared invisible baseline,
ascending in height from left to right (short, medium, tall), each bar slanted
forward 12 degrees to the right. Equal 11-unit gaps between bars. Bar widths are
identical. The slant makes them read as three marching footsteps in motion, and
the ascending heights make them read as a rising bar chart. Perfectly sharp
corners on every shape, zero corner radius, no rounding anywhere.

WORDMARK: the word "Derap" placed to the right of the mark, capital D followed by
lowercase "erap", set in a bold geometric grotesque sans serif, tight letter
spacing. Mark height equals the cap height of the D. Gap between mark and wordmark
equals one bar width.

COLOR: bars in deep ink indigo #2440BE. Wordmark in near-black ink #131821.
Fully transparent background, no container shape, no colored ground behind the logo.

STYLE: clean flat vector, crisp geometric edges, precision instrument feeling,
corporate software brand, minimal, confident, calm.

TECHNICAL: transparent background, PNG with alpha, 1:1 square canvas, centered
with generous even padding, high resolution 1024x1024, pixel-sharp edges.

NEGATIVE: no gradient, no gradient mesh, no drop shadow, no glow, no bevel, no
emboss, no 3D, no isometric, no photo, no photorealism, no texture, no grain,
no rounded corners, no circles, no ovals, no swoosh, no orbit, no gear, no
clipboard, no checkmark, no clock, no mascot, no human figure, no generic stock
icon look, no colored square background plate, no border frame, no watermark,
no extra text, no tagline, no lorem ipsum, no misspelling of the word Derap.
```

### 2. Varian KNOCKOUT putih (R43)

```
Flat vector logo for "Derap", an Indonesian project management software product.
This is the WHITE KNOCKOUT variant, made to sit on dark backgrounds.

MARK: three geometric parallelogram bars standing on a shared invisible baseline,
ascending in height from left to right (short, medium, tall), each bar slanted
forward 12 degrees to the right. Equal 11-unit gaps between bars. Identical bar
widths. Perfectly sharp corners, zero corner radius, no rounding anywhere.

WORDMARK: the word "Derap" to the right of the mark, capital D followed by
lowercase "erap", bold geometric grotesque sans serif, tight letter spacing.
Mark height equals the cap height of the D.

COLOR: every element is PURE WHITE #FFFFFF, both the bars and the wordmark.
Single solid white, no tint, no shade, no gradient. Fully transparent background,
no container shape, no colored ground behind the logo.

STYLE: clean flat vector, crisp geometric edges, minimal, confident.

TECHNICAL: transparent background, PNG with alpha, 1:1 square canvas, centered
with generous even padding, high resolution 1024x1024, pixel-sharp edges.
Must stay fully legible when placed on a very dark navy background #0E1524.

NEGATIVE: no gradient, no drop shadow, no glow, no bevel, no 3D, no photo, no
texture, no rounded corners, no circles, no ovals, no colored square background
plate, no dark outline around the white shapes, no border frame, no watermark,
no extra text, no tagline, no mascot, no human figure, no misspelling of Derap.
```

### 3. MARK saja, untuk app icon dan favicon

```
Flat vector app icon for "Derap", an Indonesian project management software product.

Solid square tile, perfectly square corners, zero corner radius, filled with deep
ink indigo #2440BE, edge to edge with no border and no padding on the tile itself.

Inside the tile, knocked out in pure white #FFFFFF: three parallelogram bars on a
shared invisible baseline, ascending in height from left to right, each slanted
forward 12 degrees to the right, equal gaps, identical widths. The bars occupy
about 70 percent of the tile width, optically centered.

STYLE: flat vector, crisp geometric edges, high contrast, designed to stay legible
at 16x16 pixels.

TECHNICAL: 1:1 square canvas, 1024x1024, PNG, pixel-sharp edges, no antialiasing
artifacts on the bar edges.

NEGATIVE: no gradient, no shadow, no glow, no bevel, no 3D, no rounded corners,
no circle, no text, no letter D, no wordmark, no border frame, no watermark,
no photo, no texture.
```

---

## Favicon dan berkas keluaran

Semua ukuran diturunkan dari satu master **mark 1024 x 1024** (prompt nomor 3). Jangan menggambar ulang tiap ukuran.

| Berkas | Ukuran | Catatan |
| --- | --- | --- |
| `public/favicon.ico` | 16, 32, 48 multi resolusi | satu berkas ICO |
| `public/favicon-16x16.png` | 16 | periksa ketajaman secara visual |
| `public/favicon-32x32.png` | 32 | |
| `public/favicon-48x48.png` | 48 | |
| `public/apple-touch-icon.png` | 180 | tanpa transparansi, ground `#2440BE` penuh |
| `public/icon-192.png` | 192 | |
| `public/icon-512.png` | 512 | |
| `public/icon-maskable-512.png` | 512 | batang diperkecil ke 60 persen lebar, aman di zona maskable |
| `public/logo-derap-primary.svg` dan `.png` | vektor dan 1024 lebar | lockup primary, alpha |
| `public/logo-derap-knockout.svg` dan `.png` | vektor dan 1024 lebar | lockup knockout, alpha |
| `public/mark-derap.svg` | vektor | mark saja `#2440BE`, transparan |
| `public/mark-derap-knockout.svg` | vektor | mark saja `#FFFFFF`, transparan |

Cara paling sederhana:

```bash
for s in 16 32 48 180 192 512; do
  npx sharp-cli -i mark-1024.png -o public/icon-$s.png resize $s $s
done
convert public/icon-16.png public/icon-32.png public/icon-48.png public/favicon.ico
```

**Wajib diperiksa:** hasil perkecilan ke 16 x 16 sering membuat tepi batang buram. Lihat hasilnya, dan kalau perlu tebalkan batang khusus untuk ukuran itu. Favicon buram adalah hal pertama yang terlihat orang di tab browser.

---

## Serah terima

Taruh semua berkas jadi langsung di `public/` pada repo ini. Nama berkas harus **persis** seperti tabel di atas, salah nama berarti gambar rusak saat build.

---

## Cara membuat lewat Google Flow (jalur gratis, kalau dibutuhkan)

Jalur utama Stage 2 adalah MCP `gemini-image` di dalam pipeline (R39). Blok ini cadangan kalau aset perlu dibuat manusia.

1. Salin prompt nomor 1, lalu 2, lalu 3 di atas, **lengkap termasuk blok NEGATIVE**, jangan hanya bagian MARK. Tempel ke kolom chat Google Flow di https://labs.google/fx/id/tools/flow/project/1e873728-41ff-4e87-ab36-3de32f6ad416, di collection bernama `derap`.
2. Atur config: rasio **1:1**, resolusi **1K**, model **Nano Banana**.
3. Generate. Maksimum **4 media sekaligus**, jangan lebih dari 4 berbarengan.
4. Lanjut ke prompt berikutnya tanpa mengunduh dulu.
5. Kalau sudah semua, pilih gambarnya, unduh, lalu taruh di `public/` dengan nama berkas persis seperti tabel di atas.

---

*Disusun oleh Brand Strategist (Stage 1) untuk HIM-286.*
