# Derap, DESIGN.md

Sistem desain Derap. Aplikasi manajemen proyek padat data, terang, sudut siku.
Semua angka kontras di dokumen ini **dihitung**, bukan ditaksir, memakai rumus WCAG 2.1 relative luminance. Stage 3, 5, dan 6 tidak perlu menebak.

Stage: 1 (Brand Strategist) | Issue: HIM-286

---

## 0. Prinsip desain

1. **Data dulu, dekorasi belakangan.** Setiap piksel harus membawa informasi. Kalau sebuah elemen bisa dihapus tanpa mengurangi arti, hapus.
2. **Garis, bukan bayangan.** Permukaan dipisahkan oleh garis 1px. Bayangan hanya dipakai lapisan mengambang (dropdown, popover, modal).
3. **Warna itu sinyal.** Kanvas dan permukaan netral. Warna semantik hanya dipakai untuk status. Warna brand hanya untuk elemen aktif dan aksi utama.
4. **Sudut siku, radius 0** (R10). Tanpa pengecualian di aplikasi ini, termasuk avatar dan badge.
5. **Kepadatan bisa diatur.** Tabel punya tiga tinggi baris: rapat, normal, longgar. Normal adalah bawaan.
6. **Kontras adalah syarat, bukan preferensi** (R20). Setiap kontrol, termasuk checkbox, toggle, badge, stepper, wajib lolos WCAG AA.

---

## 1. Token warna lengkap

Salin blok ini apa adanya ke `src/app/globals.css`.

```css
:root {
  /* ---------- Netral (kanvas dan permukaan) ---------- */
  --bg:              #F4F6F9;  /* kanvas aplikasi, di belakang semua kartu */
  --surface:         #FFFFFF;  /* kartu, panel, baris tabel, modal */
  --surface-2:       #EDF0F5;  /* header tabel, isian halus, baris zebra */
  --surface-3:       #E4E8EF;  /* kolom Kanban, area tarik lepas, keadaan tekan */
  --border:          #D5DAE3;  /* garis pemisah dekoratif, batas kartu dan sel tabel */
  --border-control:  #767F8F;  /* WAJIB untuk batas kontrol: input, checkbox, toggle, radio, stepper */

  /* ---------- Teks ---------- */
  --text:            #131821;  /* teks utama, judul, nilai sel tabel */
  --text-muted:      #4E586A;  /* teks sekunder, label kolom, metadata */
  --text-subtle:     #616B7A;  /* teks paling redup, timestamp, placeholder */
  --text-on-brand:   #FFFFFF;  /* teks di atas isian brand atau semantik pekat */

  /* ---------- Brand ---------- */
  --brand:           #2440BE;  /* nila tinta. Menu aktif, tombol aksi utama, cincin fokus, seri grafik pertama */
  --brand-hover:     #1C34A0;  /* keadaan hover dan tekan pada isian brand */
  --brand-deep:      #16277A;  /* teks brand di atas latar brand-soft, judul pada panel brand */
  --brand-soft:      #E8EBFA;  /* baris terpilih, latar chip brand, sorotan halus */

  /* ---------- Sidebar (gelap, permanen) ---------- */
  --sidebar-bg:      #0E1524;  /* latar sidebar kiri */
  --sidebar-surface: #182236;  /* hover item menu, panel dalam sidebar */
  --sidebar-text:    #C3CCDC;  /* label menu tidak aktif */
  --sidebar-muted:   #8792A6;  /* judul kelompok menu, teks pendukung */
  --sidebar-border:  #232E45;  /* garis pemisah di dalam sidebar */
  --sidebar-active:  #2440BE;  /* isian item menu aktif, teksnya putih */

  /* ---------- Semantik status ---------- */
  --success:         #157F45;  /* Selesai, On Track */
  --success-soft:    #E3F3EA;
  --success-on-soft: #0D5D31;

  --warning:         #9A5B00;  /* Berisiko, Menunggu */
  --warning-soft:    #FBEFD9;
  --warning-on-soft: #8A5200;

  --danger:          #C0263A;  /* Telat, Diblokir, aksi merusak */
  --danger-soft:     #FBE7EA;
  --danger-on-soft:  #96182B;

  --info:            #1A6FA8;  /* Sedang Berjalan, catatan netral */
  --info-soft:       #E3F0F8;
  --info-on-soft:    #14567F;

  /* ---------- CTA konversi (halaman landing dan login saja) ---------- */
  --cta:             #17803D;  /* hijau R5, tombol Coba Demo di halaman / dan /login */
  --cta-hover:       #126430;

  /* ---------- Seri grafik (burndown, beban tim, progres) ---------- */
  --chart-1:         #2440BE;  /* nila, seri utama */
  --chart-2:         #0F766E;  /* teal */
  --chart-3:         #9A5B00;  /* amber pekat */
  --chart-4:         #7C3AED;  /* violet */
  --chart-5:         #B83280;  /* magenta */
  --chart-6:         #3F6212;  /* olive */
  --chart-neutral:   #616B7A;  /* garis ideal atau pembanding */
  --chart-grid:      #D5DAE3;  /* garis kisi */
  --chart-fill-warn: #F59E0B;  /* isian batang Berisiko, teksnya WAJIB --text, bukan putih */

  /* ---------- Elevasi ---------- */
  --elev-popover: 0 1px 2px rgba(19, 24, 33, 0.08), 0 8px 24px rgba(19, 24, 33, 0.12);
  --elev-modal:   0 16px 48px rgba(19, 24, 33, 0.20);

  /* ---------- Bentuk ---------- */
  --radius: 0;         /* R10. Tidak ada pengecualian di aplikasi ini */
  --border-width: 1px;
  --focus-ring: 2px solid var(--brand);
  --focus-offset: 2px;

  /* ---------- Gerak (R46) ---------- */
  --dur-fast: 120ms;   /* hover, ganti warna */
  --dur:      180ms;   /* dropdown, panel, ganti view */
  --dur-slow: 260ms;   /* transisi antar halaman, modal */
  --ease:     cubic-bezier(0.2, 0.8, 0.2, 1);

  /* ---------- Jarak (basis 4px) ---------- */
  --sp-1: 4px;  --sp-2: 8px;  --sp-3: 12px; --sp-4: 16px;
  --sp-5: 20px; --sp-6: 24px; --sp-8: 32px; --sp-10: 40px;
  --sp-12: 48px; --sp-16: 64px;

  /* ---------- Tata letak ---------- */
  --sidebar-w: 248px;
  --sidebar-w-collapsed: 64px;
  --topbar-h: 56px;
  --content-max: 1440px;
}

@media (prefers-reduced-motion: reduce) {
  :root { --dur-fast: 0ms; --dur: 0ms; --dur-slow: 0ms; }
}
```

---

## 2. Tabel kontras terhitung (acuan verifikasi R20)

Ambang WCAG: **4.5:1** untuk teks normal, **3:1** untuk teks besar (18.66px bold atau 24px reguler) dan untuk komponen antarmuka non teks seperti batas kontrol.

### 2.1 Teks di atas permukaan terang

| Teks | Permukaan | Rasio | Status |
| --- | --- | --- | --- |
| `--text` #131821 | `--surface` #FFFFFF | **17.79:1** | AAA |
| `--text` #131821 | `--bg` #F4F6F9 | **16.43:1** | AAA |
| `--text` #131821 | `--surface-2` #EDF0F5 | **15.58:1** | AAA |
| `--text` #131821 | `--surface-3` #E4E8EF | **14.48:1** | AAA |
| `--text-muted` #4E586A | `--surface` #FFFFFF | **7.17:1** | AAA |
| `--text-muted` #4E586A | `--bg` #F4F6F9 | **6.62:1** | AA |
| `--text-muted` #4E586A | `--surface-2` #EDF0F5 | **6.28:1** | AA |
| `--text-muted` #4E586A | `--surface-3` #E4E8EF | **5.84:1** | AA |
| `--text-subtle` #616B7A | `--surface` #FFFFFF | **5.40:1** | AA |
| `--text-subtle` #616B7A | `--bg` #F4F6F9 | **4.98:1** | AA |
| `--text-subtle` #616B7A | `--surface-2` #EDF0F5 | **4.72:1** | AA |
| `--text-subtle` #616B7A | `--surface-3` #E4E8EF | 4.39:1 | **TIDAK LOLOS** |

> **Aturan mengikat.** `--text-subtle` **dilarang** dipakai di atas `--surface-3` (kolom Kanban, area tarik lepas). Di permukaan itu gunakan `--text-muted` yang menghasilkan 5.84:1. Ini satu satunya kombinasi netral yang gagal, dan sengaja dicantumkan supaya tidak terpakai tanpa sadar.

### 2.2 Brand

| Depan | Belakang | Rasio | Status | Dipakai untuk |
| --- | --- | --- | --- | --- |
| `--brand` #2440BE | `--surface` #FFFFFF | **8.23:1** | AAA | tautan, ikon aktif, cincin fokus |
| `--brand` #2440BE | `--bg` #F4F6F9 | **7.60:1** | AAA | cincin fokus di atas kanvas |
| `--brand` #2440BE | `--surface-2` #EDF0F5 | **7.20:1** | AAA | ikon aktif di header tabel |
| `#FFFFFF` | `--brand` #2440BE | **8.23:1** | AAA | teks tombol aksi utama |
| `#FFFFFF` | `--brand-hover` #1C34A0 | **10.25:1** | AAA | teks tombol saat hover |
| `--brand-deep` #16277A | `--brand-soft` #E8EBFA | **11.02:1** | AAA | teks chip brand |
| `--brand` #2440BE | `--brand-soft` #E8EBFA | **6.93:1** | AA | ikon di dalam chip brand |
| `--text` #131821 | `--brand-soft` #E8EBFA | **14.99:1** | AAA | teks baris tabel terpilih |

### 2.3 Sidebar gelap

| Depan | Belakang | Rasio | Status |
| --- | --- | --- | --- |
| `--sidebar-text` #C3CCDC | `--sidebar-bg` #0E1524 | **11.28:1** | AAA |
| `#FFFFFF` | `--sidebar-bg` #0E1524 | **18.24:1** | AAA |
| `--sidebar-muted` #8792A6 | `--sidebar-bg` #0E1524 | **5.81:1** | AA |
| `--sidebar-text` #C3CCDC | `--sidebar-surface` #182236 | **9.83:1** | AAA |
| `--sidebar-muted` #8792A6 | `--sidebar-surface` #182236 | **5.07:1** | AA |
| `#FFFFFF` | `--sidebar-active` #2440BE | **8.23:1** | AAA |

### 2.4 Status semantik

Setiap status punya dua bentuk. **Isian pekat** (teks putih) untuk penekanan tinggi, dan **chip lembut** (teks gelap) untuk badge di dalam tabel dan kartu. Badge di tabel memakai bentuk lembut supaya tabel tidak jadi pelangi.

| Status | Isian pekat, teks putih | Chip lembut, teks `*-on-soft` | Teks pekat di `--surface` |
| --- | --- | --- | --- |
| Success #157F45 | **5.06:1** AA | #0D5D31 pada #E3F3EA = **6.96:1** AA | **5.06:1** AA |
| Warning #9A5B00 | **5.43:1** AA | #8A5200 pada #FBEFD9 = **5.61:1** AA | **5.43:1** AA |
| Danger #C0263A | **5.87:1** AA | #96182B pada #FBE7EA = **7.20:1** AAA | **5.87:1** AA |
| Info #1A6FA8 | **5.41:1** AA | #14567F pada #E3F0F8 = **6.78:1** AA | **5.41:1** AA |

Teks pekat semantik di atas `--bg` #F4F6F9: success **4.67:1**, warning **5.01:1**, danger **5.42:1**, info **5.00:1**. Semua lolos AA.

`--text` #131821 di atas keempat latar lembut: success **15.48:1**, warning **15.63:1**, danger **15.01:1**, info **15.32:1**. Semua AAA, jadi aman kalau badge memakai teks netral.

### 2.5 CTA konversi (hijau R5)

| Depan | Belakang | Rasio | Status |
| --- | --- | --- | --- |
| `#FFFFFF` | `--cta` #17803D | **5.01:1** | AA |
| `#FFFFFF` | `--cta-hover` #126430 | **7.26:1** | AAA |
| `--cta` #17803D | `--bg` #F4F6F9 | **4.63:1** | AA |

> **Batas pemakaian.** `--cta` hijau **hanya** untuk tombol konversi di halaman landing `/` dan `/login`, misalnya Coba Demo Sekarang dan Masuk sebagai Demo. Di dalam aplikasi, tombol aksi utama memakai `--brand`, bukan hijau, supaya hijau tetap berarti Selesai dan On Track. Jangan campur.

### 2.6 Batas kontrol (WCAG 1.4.11, ambang 3:1)

| Depan | Belakang | Rasio | Status |
| --- | --- | --- | --- |
| `--border-control` #767F8F | `--surface` #FFFFFF | **4.04:1** | Lolos |
| `--border-control` #767F8F | `--bg` #F4F6F9 | **3.73:1** | Lolos |
| `--border-control` #767F8F | `--surface-2` #EDF0F5 | **3.53:1** | Lolos |
| `--border-control` #767F8F | `--surface-3` #E4E8EF | **3.28:1** | Lolos |
| `--border` #D5DAE3 | `--surface` #FFFFFF | 1.40:1 | Dekoratif saja |

> **Aturan mengikat.** `--border` #D5DAE3 **dilarang** menjadi batas checkbox, radio, toggle, input, atau stepper, karena rasionya hanya 1.40:1. Kontrol wajib memakai `--border-control` #767F8F. `--border` hanya untuk garis pemisah dan batas kartu yang tidak membawa makna interaktif. Ini persis kelas kegagalan R20 pada Komodrift.

### 2.7 Grafik

Seri grafik dipilih supaya berbeda satu sama lain sekaligus lolos 4.5:1 di atas `--surface`, jadi label seri boleh ditulis dengan warna serinya sendiri.

| Token | Hex | Rasio pada #FFFFFF |
| --- | --- | --- |
| `--chart-1` nila | #2440BE | **8.23:1** |
| `--chart-2` teal | #0F766E | **5.47:1** |
| `--chart-3` amber pekat | #9A5B00 | **5.43:1** |
| `--chart-4` violet | #7C3AED | **5.70:1** |
| `--chart-5` magenta | #B83280 | **5.52:1** |
| `--chart-6` olive | #3F6212 | **7.08:1** |
| `--chart-neutral` | #616B7A | **5.40:1** |

`--chart-fill-warn` #F59E0B hanya untuk isian batang. Teks di atasnya **wajib** `--text` #131821 (**8.28:1**). Teks putih di atas amber ini gagal total, jangan pernah dipakai.

> Grafik **tidak boleh** membedakan seri hanya dengan warna. Sertakan label langsung, pola garis berbeda (solid, putus putus), atau penanda bentuk.

---

## 3. Tipografi

### 3.1 Keluarga huruf

| Peran | Font | Bobot yang dimuat | Alasan |
| --- | --- | --- | --- |
| Judul dan display | **Plus Jakarta Sans** | 600, 700 | Huruf buatan Indonesia (Tokotype). Geometris, tegas, modern, dan membawa akar lokal tanpa jadi dekoratif |
| Antarmuka dan isi | **Inter** | 400, 500, 600 | Standar de facto antarmuka padat data. Terbaca pada 12px, punya `tabular-nums`, tinggi x besar |
| Angka teknis dan kode | **JetBrains Mono** | 400, 500 | Kode tugas `DRP-142`, durasi, ID, selisih jam. Lebar tetap membuat kolom lurus |

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
```

Di Next.js gunakan `next/font/google` supaya ikut ter-inline saat static export.

```css
:root {
  --font-display: 'Plus Jakarta Sans', 'Inter', system-ui, sans-serif;
  --font-ui:      'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif;
  --font-mono:    'JetBrains Mono', ui-monospace, 'SF Mono', monospace;
}
body { font-family: var(--font-ui); font-size: 14px; line-height: 22px; color: var(--text); }
h1, h2, h3, h4 { font-family: var(--font-display); letter-spacing: -0.01em; }
```

### 3.2 Skala umum

Basis antarmuka aplikasi adalah **14px**, bukan 16px. Ini aplikasi padat data, dan 14px adalah ukuran kerja yang wajar untuk tabel panjang. Halaman landing `/` boleh naik ke basis 16px karena sifatnya pemasaran.

| Token | Ukuran / tinggi baris | Bobot | Font | Dipakai untuk |
| --- | --- | --- | --- | --- |
| `display-l` | 32 / 40 | 700 | display | judul hero halaman landing |
| `display-m` | 26 / 34 | 700 | display | judul halaman kosong, judul modal besar |
| `h1` | 22 / 30 | 700 | display | judul halaman aplikasi (Proyek, Tugas, Tim) |
| `h2` | 18 / 26 | 600 | display | judul bagian, judul kartu besar |
| `h3` | 16 / 24 | 600 | display | judul kartu, judul kolom Kanban |
| `body` | 14 / 22 | 400 | ui | isi, deskripsi tugas, isi komentar |
| `body-strong` | 14 / 22 | 500 | ui | judul tugas di dalam daftar, nilai penting |
| `ui-sm` | 13 / 20 | 400 | ui | metadata, teks pendukung, isi sel tabel |
| `caption` | 12 / 18 | 500 | ui | label field, teks bantuan, timestamp |
| `micro` | 11 / 16 | 600 | ui | header kolom tabel, teks badge. `text-transform: uppercase; letter-spacing: 0.06em` |

### 3.3 Skala khusus padat data

Bagian ini mengikat untuk Stage 3 dan Stage 5. Jangan mengarang ukuran sendiri.

| Elemen | Ukuran / tinggi baris | Bobot | Font | Catatan |
| --- | --- | --- | --- | --- |
| Sel tabel (teks) | 13 / 20 | 400 | ui | `--text` |
| Sel tabel (angka) | 13 / 20 | 500 | ui | `font-variant-numeric: tabular-nums`, rata kanan |
| Header kolom tabel | 11 / 16 | 600 | ui | uppercase, tracking 0.06em, `--text-muted` di atas `--surface-2` (6.28:1) |
| Kode tugas `DRP-142` | 12 / 16 | 500 | mono | tracking 0.02em, `--text-muted` |
| Badge status | 11 / 16 | 600 | ui | uppercase, padding 3px 8px, radius 0, chip lembut |
| Label prioritas | 11 / 16 | 600 | ui | ikon 12px plus teks, jangan ikon saja |
| Chip label dan tag | 12 / 18 | 500 | ui | padding 2px 8px, radius 0, batas 1px `--border-control` |
| Judul kartu Kanban | 13 / 20 | 500 | ui | maksimal 3 baris lalu potong dengan ellipsis |
| Meta kartu Kanban | 11 / 16 | 400 | ui | `--text-muted`, bukan `--text-subtle`, karena kartu berdiri di atas `--surface-3` |
| Durasi dan jam | 13 / 20 | 500 | mono | contoh `6.5j`, tabular |
| Angka besar ringkasan | 26 / 32 | 700 | display | tabular-nums, kartu KPI di dashboard |
| Label bawah angka KPI | 12 / 18 | 500 | ui | `--text-muted` |
| Label sumbu grafik | 11 / 16 | 400 | ui | `--text-muted` |

### 3.4 Tinggi baris tabel

| Mode | Tinggi | Padding vertikal sel |
| --- | --- | --- |
| Rapat | 32px | 6px |
| Normal (bawaan) | 40px | 10px |
| Longgar | 52px | 16px |

Pilihan kepadatan disimpan di localStorage bersama pilihan view.

### 3.5 Aturan R50 untuk judul plus label sekunder

Setiap item yang membawa judul dan label sekunder (kartu Kanban, baris tabel, item dropdown, item breadcrumb, lockup merek di sidebar) **wajib** merender label sekunder sebagai elemen blok terpisah dengan `gap` eksplisit. Dua node teks inline yang bersebelahan tanpa pemisah akan menempel saat dirender.

```css
.item-text { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
.item-text .title { display: block; font: 500 13px/20px var(--font-ui); color: var(--text); }
.item-text .meta  { display: block; font: 400 11px/16px var(--font-ui); color: var(--text-muted); }
```

Verifikasi wajib membaca `innerText` per baris, **bukan** `textContent`, lalu menolak baris yang cocok dengan `[a-z][A-Z]`. Ini termasuk **lockup merek** di sidebar dan footer. Kalau wordmark Derap diberi anak `<small>` berisi tagline, `<small>` bawaannya `display: inline` dan akan terbaca `DerapRitme kerja tim`. Buat blok terpisah.

---

## 4. Bentuk, batas, dan elevasi

### 4.1 Bentuk (R10)

**Radius 0 di seluruh aplikasi. Tanpa pengecualian.** Aplikasi ini tidak punya tombol WhatsApp mengambang, jadi satu satunya pengecualian R10 tidak berlaku di sini.

Yang paling sering keliru dan harus ditegaskan:
- **Avatar berbentuk persegi**, bukan lingkaran. Ini refleks yang paling sering lolos di aplikasi manajemen proyek. Avatar 24px, 32px, dan 40px, semuanya persegi.
- Chip, tag, badge, tombol, input, modal, dropdown, tooltip: semuanya siku.
- Indikator progres berbentuk batang persegi. **Tidak ada cincin progres bulat.**
- Penanda titik pada timeline berbentuk persegi kecil 8px, bukan bulat.

### 4.2 Batas

| Konteks | Token | Tebal |
| --- | --- | --- |
| Batas kartu dan panel | `--border` | 1px |
| Pemisah baris tabel | `--border` | 1px, hanya bawah |
| Batas kontrol form | `--border-control` | 1px |
| Kontrol dalam keadaan fokus | `--brand` | 1px batas plus cincin fokus |
| Penanda menu aktif di sidebar | isian `--sidebar-active` | plus batang kiri 3px `#FFFFFF` |
| Batas kolom Kanban | `--border` | 1px, latar `--surface-3` |

### 4.3 Fokus keyboard

```css
:focus-visible {
  outline: var(--focus-ring);
  outline-offset: var(--focus-offset);
}
```
Cincin fokus memakai `--brand` yang menghasilkan 8.23:1 di atas `--surface` dan 7.60:1 di atas `--bg`, jauh di atas ambang 3:1. Fokus **tidak boleh** dihilangkan di mana pun, termasuk pada kartu Kanban yang bisa ditarik.

### 4.4 Elevasi

Hanya ada tiga tingkat.

| Tingkat | Nilai | Dipakai untuk |
| --- | --- | --- |
| 0 | tanpa bayangan, hanya `--border` | kartu, panel, tabel, kolom Kanban |
| 1 | `--elev-popover` | dropdown, popover, date picker, menu konteks, tooltip |
| 2 | `--elev-modal` | modal, panel geser detail tugas |

Overlay layar penuh (modal, panel geser, tirai sidebar mobile) **wajib** dirender sebagai sibling dari `<header>` atau di-portal ke `document.body` (R53). Jangan pernah menyarangkannya di dalam elemen yang punya `backdrop-filter`, `filter`, `transform`, atau `will-change`, karena elemen itu menjadi containing block dan `position: fixed` akan terpotong ke kotak induknya.

---

## 5. Gerak (R46 dan R12)

| Kejadian | Durasi | Easing | Properti |
| --- | --- | --- | --- |
| Hover tombol dan baris | `--dur-fast` 120ms | `--ease` | background, border-color |
| Buka tutup dropdown | `--dur` 180ms | `--ease` | `grid-template-rows: 0fr` ke `1fr`, opacity |
| Putar chevron dropdown | `--dur` 180ms | `--ease` | `transform: rotate(180deg)` |
| Ganti view (Kanban, Tabel, Kalender, Timeline) | `--dur` 180ms | `--ease` | opacity plus `translateY(6px)` |
| Ganti halaman | `--dur-slow` 260ms | `--ease` | opacity plus `translateY(8px)` |
| Buka modal | `--dur-slow` 260ms | `--ease` | opacity plus `scale(0.98)` ke `1` |
| Kartu Kanban diangkat | `--dur-fast` 120ms | `--ease` | `--elev-popover` plus `translateY(-2px)` |

Semua durasi menjadi 0ms saat `prefers-reduced-motion: reduce`. Transisi halaman **tidak boleh** menunda paint pertama atau memblokir interaksi.

Dropdown wajib komponen kustom, `<select>` bawaan browser dilarang (R12). `aria-expanded` pada pemicu **wajib** sinkron dengan panel yang benar benar terbuka (R60). Jangan memasang pembuka `onFocus` bersama toggler `onClick` di elemen yang sama, karena klik nyata memicu fokus lebih dulu lalu klik langsung menutupnya kembali.

---

## 6. Pola tata letak

### 6.1 Kerangka aplikasi

```
+----------------+--------------------------------------------------+
| Sidebar 248px  | Topbar 56px                                       |
| gelap          +--------------------------------------------------+
| collapsible    | Header halaman: judul + pemindah view             |
| ke 64px        | Baris aksi: tombol aksi utama di KIRI             |
|                +--------------------------------------------------+
|                | Isi (tabel / kanban / kalender / timeline)        |
+----------------+--------------------------------------------------+
```

- **Tombol aksi utama selalu di kiri**, sejajar dengan awal isi. Bukan di pojok kanan atas. Konsisten di setiap halaman. Filter dan pencarian menyusul di sebelah kanannya pada baris yang sama.
- **Pemindah view** duduk di header halaman, berbentuk kelompok tombol siku bersebelahan, yang aktif memakai isian `--brand` dengan teks putih (8.23:1). Pilihan terakhir disimpan di localStorage.
- Sidebar collapsible menyimpan keadaannya juga di localStorage. Dalam keadaan menyempit, hanya ikon yang tampil, dan setiap ikon wajib punya tooltip berisi label.

### 6.2 Mobile

- Di bawah 1025px sidebar berubah menjadi tirai yang dipicu tombol hamburger. Tirai di-portal ke `document.body` (R53).
- Topbar mobile satu baris flex `space-between`, tinggi tetap, setiap anak di slot sendiri, tap target minimal 44 x 44px, tanpa elemen bertumpuk (R47 dan R52).
- Tabel berubah menjadi daftar kartu. Bagian yang berisi lebih dari 3 item peer wajib jadi snap carousel horizontal (R48), kecuali daftar tugas utama yang memang daftar vertikal panjang dengan paginasi atau gulir tak hingga.
- Tidak boleh ada overflow horizontal di 375, 480, 768, 1025, dan 1440. Diukur dengan `document.documentElement.scrollWidth <= window.innerWidth`, dengan semua panel tertutup dan diulang dengan tiap panel terbuka (R19 dan R57). Panel dropdown wajib membawa `max-width: calc(100vw - 2rem)` dan menjangkar menjauhi tepi terdekat.

### 6.3 Peta warna status ke modul

| Konsep | Token | Bentuk tampil |
| --- | --- | --- |
| Proyek On Track | `--success-soft` plus `--success-on-soft` | chip lembut |
| Proyek Berisiko | `--warning-soft` plus `--warning-on-soft` | chip lembut |
| Proyek Telat | `--danger-soft` plus `--danger-on-soft` | chip lembut |
| Tugas Selesai | `--success` | ikon centang plus teks dicoret `--text-subtle` |
| Tugas Sedang Berjalan | `--info-soft` plus `--info-on-soft` | chip lembut |
| Tugas Diblokir | `--danger` | isian pekat, teks putih. Satu satunya badge pekat di tabel |
| Prioritas Tinggi | `--danger` | ikon panah atas plus teks Tinggi |
| Prioritas Sedang | `--warning` | ikon minus plus teks Sedang |
| Prioritas Rendah | `--text-muted` | ikon panah bawah plus teks Rendah |
| Beban tim di bawah kapasitas | `--success` | batang progres |
| Beban tim mendekati kapasitas | `--chart-fill-warn` | batang progres, label `--text` |
| Beban tim melebihi kapasitas | `--danger` | batang progres, teks putih |

Setiap status wajib membawa **teks**, bukan hanya warna. Papan Kanban harus tetap terbaca oleh pengguna buta warna.

---

## 7. Yang tidak boleh dilakukan

1. Jangan menambah warna di luar token ini. Kalau butuh warna baru, itu tanda ada makna baru yang belum didefinisikan.
2. Jangan memakai `--cta` hijau di dalam aplikasi. Hijau di dalam aplikasi berarti Selesai dan On Track.
3. Jangan memakai `--border` sebagai batas kontrol form. Rasionya 1.40:1.
4. Jangan memakai `--text-subtle` di atas `--surface-3`. Rasionya 4.39:1.
5. Jangan memakai teks putih di atas `--chart-fill-warn` #F59E0B.
6. Jangan memakai radius selain 0. Termasuk avatar.
7. Jangan memakai bayangan pada elemen yang tidak mengambang.
8. Jangan memakai `<select>` bawaan browser, dan jangan memakai input teks bebas untuk tanggal.
9. Jangan menaruh tombol aksi utama di pojok kanan atas.
10. Jangan memakai em dash atau en dash, termasuk bentuk entity HTML.

---

*Semua rasio di dokumen ini dihitung dengan rumus WCAG 2.1 relative luminance pada 29 Juli 2026. Stage 6 boleh memverifikasi ulang, dan angkanya harus cocok.*
