# Derap, ART-DIRECTION.md

Arahan visual lengkap dan prompt siap pakai untuk Asset Forge (Stage 2) dan Media Producer (Stage 4).
Dokumen ini adalah sumber kebenaran untuk logo, favicon, dan seluruh aset gambar. Kalau ada yang bentrok dengan dokumen lain, dokumen ini yang menang untuk urusan visual aset.

Stage: 1 (Brand Strategist) | Issue: HIM-286

---

## 1. Ringkasan arah visual

Derap terlihat seperti **perkakas kerja, bukan brosur**. Tegas, presisi, tenang, sudut siku. Semua aset visual harus terasa seperti bagian dari satu antarmuka yang sama.

| Aspek | Keputusan |
| --- | --- |
| Bentuk | Sudut siku, radius 0, tanpa lengkung sama sekali (R10) |
| Gaya | Vektor datar, geometris, presisi. Tanpa gradien, tanpa bayangan, tanpa tekstur |
| Warna aset | Nila tinta `#2440BE`, tinta `#131821`, putih `#FFFFFF`. Netral abu untuk pendukung |
| Sudut kemiringan | 12 derajat ke depan, dipakai konsisten untuk semua elemen yang mengesankan gerak |
| Yang dilarang | Gradien ungu ke biru, render 3D, isometrik, maskot, ilustrasi orang bergaya korporat, mockup laptop mengambang, bayangan tebal, glow, neon |

---

## 2. Konsep logo

### 2.1 Ide

**Derap** berarti bunyi langkah kaki yang teratur dan berirama. Logo menerjemahkan itu jadi satu bentuk yang membawa dua bacaan sekaligus:

1. **Tiga langkah yang bergerak maju.** Tiga batang miring ke depan pada garis dasar yang sama, seperti jejak langkah yang beriring.
2. **Progres yang menanjak.** Ketiga batang itu meninggi dari kiri ke kanan, jadi terbaca sebagai grafik batang yang naik. Ini persis kategori produknya: manajemen proyek.

Satu bentuk, dua arti, dan keduanya benar. Itu yang membuat mark ini pantas dipakai bertahun tahun, bukan sekadar ikon dekoratif.

### 2.2 Geometri mark (spesifikasi presisi, bukan saran)

Kanvas 100 x 100 unit. Semua bentuk adalah jajar genjang siku (parallelogram), tanpa satu pun sudut membulat.

| Batang | Lebar | Tinggi | Posisi x (dasar) | Kemiringan |
| --- | --- | --- | --- | --- |
| 1 (kiri) | 18 | 38 | 12 | 12 derajat ke kanan |
| 2 (tengah) | 18 | 60 | 41 | 12 derajat ke kanan |
| 3 (kanan) | 18 | 82 | 70 | 12 derajat ke kanan |

- Ketiganya berdiri pada garis dasar yang sama di y = 90.
- Jarak antar batang 11 unit, sama rata.
- Kemiringan membuat bagian atas setiap batang bergeser ke kanan sekitar 12 sampai 17 unit dibanding dasarnya. Ini yang memberi kesan melangkah maju.
- Tidak ada garis dasar yang digambar. Garis dasarnya tersirat dari sejajarnya ketiga batang.

**Uji keterbacaan:** mark ini wajib tetap terbaca pada 16 x 16 px. Tiga batang miring dengan jarak sama rata lolos uji itu. Kalau Asset Forge menambah detail apa pun sampai mark jadi tidak terbaca di 16px, detail itu harus dibuang.

### 2.3 Lockup dengan wordmark

- Wordmark: **Derap**, huruf D kapital, sisanya kecil.
- Font wordmark: **Plus Jakarta Sans Bold (700)**, letter-spacing `-0.02em`.
- Susunan horizontal: mark di kiri, wordmark di kanan. Tinggi mark sama dengan tinggi huruf kapital D. Jarak antara mark dan wordmark sama dengan lebar satu batang (18 unit pada skala mark).
- Ruang aman di sekeliling lockup: sama dengan lebar satu batang, di keempat sisi.
- Ukuran minimum lockup: lebar 96px. Di bawah itu pakai mark saja.

### 2.4 Dua varian WAJIB (R43)

Ini bagian paling penting dari dokumen ini. Logo yang hanya punya satu varian akan hilang di footer gelap dan di sidebar gelap, dan itu kegagalan build yang berulang.

| Varian | Warna mark | Warna wordmark | Latar yang dituju | Contoh pemakaian |
| --- | --- | --- | --- | --- |
| **Primary** | `#2440BE` | `#131821` | Latar terang: `#FFFFFF`, `#F4F6F9` | halaman landing, halaman login, header terang, dokumen |
| **Knockout** | `#FFFFFF` | `#FFFFFF` | Latar gelap: `#0E1524`, `#131821`, `#2440BE` | **sidebar aplikasi**, footer gelap, favicon berlatar penuh |

Aturan mengikat:
- Sidebar Derap berlatar `--sidebar-bg` #0E1524. Sidebar **wajib** memakai varian **knockout**. Putih di atas #0E1524 menghasilkan 18.24:1.
- Kedua varian **tanpa latar sendiri**. Latar transparan. Mark tidak boleh berupa kotak berwarna yang membawa ground sendiri, karena itulah yang membuat logo berubah jadi persegi kosong saat ditaruh di footer sewarna. Ini kegagalan Legatara yang tidak boleh terulang.
- Satu satunya bentuk yang **boleh** punya ground penuh adalah **app icon dan favicon**, karena keduanya memang butuh bidang penuh. Di sana ground-nya `#2440BE` dengan batang putih.

### 2.5 Yang tidak boleh ada di logo

- Bukan huruf D yang digayakan. Sudah terlalu banyak.
- Bukan roda gigi, papan klip, tanda centang, jam, atau ikon rapat. Terlalu harfiah dan generik.
- Bukan orbit, titik mengelilingi lingkaran, atau bentuk swoosh.
- Tanpa gradien apa pun, termasuk gradien halus dalam satu warna.
- Tanpa sudut membulat, sekecil apa pun.
- Tanpa efek bayangan, glow, atau bevel.

---

## 3. Prompt logo siap pakai

Tempel apa adanya. Blok ini sudah lengkap dan berdiri sendiri.

### 3.1 Prompt varian PRIMARY (untuk latar terang)

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

### 3.2 Prompt varian KNOCKOUT (untuk latar gelap, WAJIB, R43)

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

### 3.3 Prompt MARK SAJA (ikon aplikasi dan favicon)

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

## 4. Favicon dan ikon aplikasi

Semuanya diturunkan dari master **mark saja 1024 x 1024** di bagian 3.3. Jangan menggambar ulang tiap ukuran.

### 4.1 Berkas yang wajib ada di `public/`

| Berkas | Ukuran | Format | Sumber |
| --- | --- | --- | --- |
| `favicon.ico` | 16, 32, 48 (multi resolusi dalam satu berkas) | ICO | master 1024 |
| `favicon-16x16.png` | 16 x 16 | PNG | master 1024 |
| `favicon-32x32.png` | 32 x 32 | PNG | master 1024 |
| `favicon-48x48.png` | 48 x 48 | PNG | master 1024 |
| `apple-touch-icon.png` | 180 x 180 | PNG | master 1024, tanpa transparansi, ground `#2440BE` penuh |
| `icon-192.png` | 192 x 192 | PNG | master 1024 |
| `icon-512.png` | 512 x 512 | PNG | master 1024 |
| `icon-maskable-512.png` | 512 x 512 | PNG | master 1024, batang diperkecil ke 60 persen lebar supaya aman di zona maskable |
| `logo-derap-primary.svg` | vektor | SVG | lockup primary |
| `logo-derap-primary.png` | 1024 lebar | PNG alpha | lockup primary |
| `logo-derap-knockout.svg` | vektor | SVG | lockup knockout |
| `logo-derap-knockout.png` | 1024 lebar | PNG alpha | lockup knockout |
| `mark-derap.svg` | vektor | SVG | mark saja, `#2440BE`, latar transparan |
| `mark-derap-knockout.svg` | vektor | SVG | mark saja, `#FFFFFF`, latar transparan |
| `og-derap.png` | 1200 x 630 | PNG | lihat bagian 5 |

### 4.2 Cara paling sederhana membuatnya

Dari satu master `mark-1024.png`, pakai `sharp` yang sudah tersedia lewat MCP `process_image`, atau ImageMagick:

```bash
for s in 16 32 48 180 192 512; do
  npx sharp-cli -i mark-1024.png -o public/icon-$s.png resize $s $s
done
# favicon.ico multi resolusi
convert public/icon-16.png public/icon-32.png public/icon-48.png public/favicon.ico
```

Catatan penting: pada 16 x 16 dan 32 x 32, hasil perkecilan otomatis sering membuat tepi batang jadi buram. Asset Forge **wajib** memeriksa hasil 16px secara visual dan, kalau perlu, menebalkan batang sedikit khusus untuk ukuran itu. Favicon buram adalah hal pertama yang terlihat di tab browser.

### 4.3 Preferensi SVG

Kalau Asset Forge sanggup membuat SVG langsung dari spesifikasi geometri di bagian 2.2, **itu lebih baik daripada menggenerate gambar**. Bentuknya hanya tiga jajar genjang dan satu teks, jadi SVG buatan tangan akan lebih tajam, lebih kecil, dan persis sesuai spesifikasi. Prompt di bagian 3 adalah jalur cadangan, bukan jalur utama.

---

## 5. Gambar Open Graph

Satu berkas, `public/og-derap.png`, 1200 x 630.

```
Flat vector Open Graph banner, 1200x630, for "Derap", an Indonesian project
management software product.

LAYOUT: solid very dark navy background #0E1524, edge to edge. On the left,
vertically centered, the white knockout Derap logo lockup (three ascending
forward-slanted parallelogram bars plus the wordmark "Derap"), all pure white
#FFFFFF. Below the logo, one line of smaller white text reading exactly:
"Manajemen proyek untuk tim Indonesia".

On the right half, a simplified abstract representation of a data-dense app
interface: flat rectangular blocks suggesting a kanban board with three columns
of stacked cards, drawn only as solid rectangles in dark slate #182236 with thin
#232E45 separators, plus a few small accent rectangles in ink indigo #2440BE.
Every rectangle has perfectly square corners. No readable text inside the blocks.

STYLE: flat vector, geometric, calm, high contrast, generous negative space,
corporate software brand.

TECHNICAL: 1200x630 pixels exactly, PNG, crisp edges.

NEGATIVE: no gradient, no glow, no 3D, no isometric, no floating laptop mockup,
no device frame, no drop shadow, no photo, no human figure, no mascot, no
rounded corners, no lorem ipsum, no misspelled text, no extra text beyond the
two specified strings, no em dash, no en dash.
```

Teks di banner ini hanya dua string, keduanya sudah ditulis lengkap di atas. Kalau model salah mengeja, perbaiki dengan menempelkan teks secara manual, jangan biarkan lolos.

---

## 6. Foto avatar anggota tim (data demo)

Aplikasi ini butuh avatar untuk sekitar 12 sampai 18 anggota tim di modul Tim, Tugas, dan Timesheet. Ini satu satunya aset fotografis di produk, dan justru yang paling gampang terlihat palsu.

### 6.1 Aturan

- **Persegi, bukan lingkaran** (R10). Rasio 1:1, dan komponen avatar tidak boleh memberi `border-radius`.
- Orang Indonesia, beragam usia (24 sampai 45), gender seimbang, gaya berpakaian kantor kasual yang wajar di Jakarta atau Bandung.
- **Setiap orang punya prompt SUBJECT sendiri** (R49). Dilarang memakai satu foto untuk beberapa anggota, dan dilarang memakai satu prompt generik untuk seluruh tim. Nama, usia, gaya rambut, pakaian, dan latar harus berbeda per orang.
- Konsisten sebagai satu set: arah cahaya, jarak potong (dari dada ke atas), dan latar sejenis, supaya deretan avatar di tabel terlihat rapi, bukan seperti tempelan acak.

### 6.2 PHOTO DNA (ditempel ke setiap prompt avatar, R33)

```
PHOTO DNA: shot on 85mm prime lens at f/2.0, natural soft window light from
camera left, gentle directional shadow on the opposite cheek, shallow but
believable depth of field, subtle film grain, natural skin texture with visible
pores and minor imperfections, neutral white balance, plain light grey office
wall background slightly out of focus, chest-up framing, subject looking at
camera with a relaxed neutral expression, candid workplace portrait, not a
studio headshot.
```

### 6.3 NEGATIVE (ditempel ke setiap prompt avatar, R33)

```
NEGATIVE: no plastic waxy skin, no over-smoothed face, no airbrushed retouching,
no hyper saturation, no HDR look, no symmetrical artificial reflections in the
eyes, no faux bokeh halo around the head, no extra fingers, no merged fingers,
no deformed hands, no floating objects, no perfect symmetry, no artificial
studio smear, no stock photo grin, no crossed arms corporate pose, no white
seamless studio backdrop, no logo on clothing, no readable text anywhere, no
watermark, no border, no vignette, no 3D render, no illustration, no cartoon.
```

### 6.4 Cadangan kalau foto tidak layak

Kalau hasil generate masih terbaca AI setelah dua kali percobaan per orang (R33), **jangan dipaksakan**. Ganti ke avatar inisial: kotak persegi berisi dua huruf inisial, latar diambil bergilir dari `--chart-1` sampai `--chart-6`, teks putih, font Plus Jakarta Sans 600. Semua kombinasi itu sudah lolos AA terhadap putih (lihat DESIGN.md bagian 2.7). Avatar inisial yang rapi jauh lebih baik daripada foto yang terlihat palsu.

---

## 7. Tangkapan layar produk untuk halaman landing

Halaman landing `/` menampilkan produk itu sendiri.

**Aturan utama: jangan menggenerate gambar antarmuka.** Ambil tangkapan layar dari aplikasi yang sudah dibangun di Stage 5. Antarmuka yang digenerate AI selalu berisi teks kacau dan tata letak yang tidak mungkin, dan itu justru merusak kepercayaan pada produk software.

Kalau Stage 3 butuh penampung sementara sebelum aplikasi jadi, pakai **blok placeholder beranotasi** (persegi abu dengan label teks yang menyebut layar apa yang akan ada di situ), bukan gambar AI. Stage 5 atau Stage 6 mengganti placeholder itu dengan tangkapan layar asli.

Ketentuan tangkapan layar:
- Diambil pada lebar 1440px, faktor skala 2x supaya tajam.
- Sudut siku, tanpa bingkai perangkat, tanpa mockup laptop, tanpa bayangan tebal, tanpa kemiringan perspektif.
- Data di dalamnya harus data demo yang realistis dan padat, bukan tiga baris contoh.
- Simpan sebagai `public/img/app-<nama-layar>.png`, misalnya `app-kanban.png`, `app-tabel.png`, `app-timeline.png`, `app-dashboard.png`.

---

## 8. Ikon antarmuka

- Satu set ikon garis (stroke), tebal garis **1.5px** pada ukuran 20px, ujung garis siku (`stroke-linecap: butt`, `stroke-linejoin: miter`), supaya sejalan dengan bahasa bentuk radius 0.
- Ukuran yang dipakai: 16px (dalam sel tabel dan badge), 20px (menu sidebar, tombol), 24px (header halaman).
- Ambil dari satu keluarga saja. **Lucide** direkomendasikan karena tersedia sebagai paket React, ringan, dan gaya garisnya cocok. Jangan mencampur dua keluarga ikon.
- Ikon **tidak pernah berdiri sendiri sebagai satu satunya penanda makna**. Selalu ada label teks atau, minimal, `aria-label` plus tooltip. Ini berlaku untuk penanda prioritas, tombol aksi baris tabel, dan sidebar yang sedang menyempit.
- Ikon **tidak digenerate AI**. Pakai paket ikon yang ada.

---

## 9. Daftar aset yang harus dihasilkan Stage 2 dan Stage 4

Stage 3 menyalin daftar ini ke `MEDIA.md` dan menambahkan jumlah avatar yang sebenarnya dibutuhkan, dengan **satu blok SUBJECT terpisah per avatar** (R49).

| Kode | Aset | Penanggung jawab | Jalur berkas |
| --- | --- | --- | --- |
| L01 | Lockup primary | Stage 2 | `public/logo-derap-primary.svg` dan `.png` |
| L02 | Lockup knockout putih (R43) | Stage 2 | `public/logo-derap-knockout.svg` dan `.png` |
| L03 | Mark saja, nila | Stage 2 | `public/mark-derap.svg` |
| L04 | Mark saja, putih | Stage 2 | `public/mark-derap-knockout.svg` |
| F01 | Set favicon lengkap | Stage 2 | `public/favicon.ico` plus PNG 16, 32, 48, 180, 192, 512, maskable 512 |
| O01 | Banner Open Graph | Stage 2 atau 4 | `public/og-derap.png` |
| A01 sampai A18 | Avatar anggota tim, satu prompt per orang | Stage 4 | `public/img/avatar/<nama-slug>.png` |
| S01 sampai S04 | Tangkapan layar aplikasi | Stage 5 atau 6, bukan digenerate | `public/img/app-<layar>.png` |

Media Producer wajib mencocokkan setiap jalur yang dideklarasikan dengan berkas yang benar benar ada di disk. Tidak boleh ada nama berkas yang meleset, berkas yang hilang, berkas nyasar, atau penanda placeholder yang tertinggal (R49).

---

## 10. Cara membuat logo lewat Google Flow (jalur gratis, kalau dibutuhkan)

Jalur utama Stage 2 adalah MCP `gemini-image` di dalam pipeline (R39). Blok ini adalah cadangan kalau aset perlu dibuat manusia.

1. Salin prompt dari bagian 3.1, lalu bagian 3.2, lalu bagian 3.3, **lengkap termasuk blok NEGATIVE**, jangan hanya bagian MARK saja. Tempel ke kolom chat Google Flow di https://labs.google/fx/id/tools/flow/project/1e873728-41ff-4e87-ab36-3de32f6ad416, di collection bernama `derap`.
2. Atur config: rasio **1:1** untuk logo, mark, dan favicon, rasio **16:9** untuk banner Open Graph. Resolusi **1K**. Model **Nano Banana** untuk gambar.
3. Generate. Maksimum **4 media sekaligus**, jangan lebih dari 4 berbarengan.
4. Lanjut ke prompt berikutnya tanpa mengunduh dulu.
5. Kalau sudah semua, pilih gambar hasilnya, unduh, lalu taruh di `public/` dengan nama berkas **persis** seperti kolom jalur di bagian 9. Salah nama berarti gambar rusak di build.

---

*Disusun oleh Brand Strategist (Stage 1) untuk HIM-286. Sumber kebenaran warna dan tipografi ada di `DESIGN.md`, sumber kebenaran nada bicara ada di `BRAND.md`.*
