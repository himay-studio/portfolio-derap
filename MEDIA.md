# Derap, MEDIA.md

Stage: 3 (Webapp Architect) | Issue: HIM-298

---

## Tidak ada satu pun aset yang perlu digenerate

Ini jawaban yang sebenarnya, bukan daftar kosong karena malas. Derap dirancang
supaya **tidak bergantung pada gambar hasil generate sama sekali**, dan untuk
aplikasi bisnis padat data ini memang bentuk yang benar, bukan kompromi karena
kredit gambar habis.

| Kebutuhan visual | Cara Derap menyelesaikannya | Berkas |
| --- | --- | --- |
| Avatar 14 anggota tim | Blok inisial persegi di atas warna seri grafik, pola yang dipakai Linear, Jira, dan Notion | dirender dari `src/data/team.ts` |
| Keadaan kosong di setiap layar | Bentuk geometris SVG yang ditulis tangan, sudut siku sesuai R10 | `EmptyArt` di `src/components/ui/Primitives.tsx` |
| Ikon antarmuka | Lucide, satu keluarga, stroke 1.5px, ujung garis siku | paket `lucide-react` |
| Grafik burndown, beban tim, sebaran status | SVG yang dirender dari data | `src/components/charts/Charts.tsx` |
| Batang progres, badge, chip | CSS | `src/app/app.css` |
| Logo dan favicon | Sudah ada dari Stage 2, jangan digenerate ulang | `public/logo-derap-*`, `public/mark-derap-*`, `public/favicon*` |
| Banner Open Graph | Sudah dibuat di Stage 3, ditulis tangan sebagai SVG lalu dirender Chromium | `public/og-derap.png` |

### Kenapa banner Open Graph tidak masuk daftar generate

`ART-DIRECTION.md` bagian 9 mencantumkan O01 `og-derap.png` sebagai tanggung
jawab Stage 2 atau Stage 4. Aset itu **sudah jadi**, dibuat di Stage 3 tanpa
model gambar sama sekali.

Isinya hanya bidang navy pekat, lockup knockout yang diambil apa adanya dari
`public/mark-derap-knockout.svg`, dua string teks yang sudah dikunci di
`ART-DIRECTION.md` bagian 5, dan beberapa persegi datar. Semuanya punya
spesifikasi geometri yang pasti, jadi menulisnya sebagai SVG lalu merendernya
dengan Chromium memberi tepi yang lebih tajam, berkas yang lebih kecil, dan
yang paling penting **ejaan yang dijamin benar**. Model gambar secara andal
mengacaukan teks yang terbaca dan mengarang nama merek, dan banner ini memuat
nama merek plus satu kalimat penuh.

Untuk membuat ulang:

```bash
node scripts/gen-og.mjs
```

### Tangkapan layar produk untuk halaman landing

Halaman `/` memakai **blok placeholder beranotasi**, bukan gambar. Setiap blok
menyebut sendiri layar apa yang akan menggantikannya dan di jalur mana.

Penggantinya adalah **tangkapan layar aplikasi yang sudah jadi**, diambil dari
build sendiri, bukan digenerate. Antarmuka hasil generate AI selalu berisi teks
kacau dan tata letak yang tidak mungkin, dan itu justru merusak kepercayaan pada
produk software (`ART-DIRECTION.md` bagian 7).

| Kode | Berkas | Diambil dari | Penanggung jawab |
| --- | --- | --- | --- |
| S01 | `public/img/app-kanban.png` | `/app/tugas/` view Kanban, 1440px, skala 2x | Stage 5 atau 6 |
| S02 | `public/img/app-tabel.png` | `/app/tugas/` view Tabel, 1440px, skala 2x | Stage 5 atau 6 |
| S03 | `public/img/app-timeline.png` | `/app/proyek/` view Timeline, 1440px, skala 2x | Stage 5 atau 6 |
| S04 | `public/img/app-dashboard.png` | `/app/` 1440px, skala 2x | Stage 5 atau 6 |

Alatnya sudah ada di repo dan sudah terbukti jalan di runtime ini:

```bash
npm run build
node scripts/qa-shots.mjs     # menulis qa-shots/<lebar>/<rute>.png
```

Tinggal salin berkas yang dipilih ke `public/img/` dengan nama persis seperti
tabel di atas, lalu ganti komponen `Placeholder` di `src/app/page.tsx` dengan
`<Image>`.

---

## Untuk Media Producer (Stage 4)

**Tidak ada pekerjaan generate gambar di build ini.** Jangan memanggil
`gemini-image_generate_image` untuk Derap. Kalau ada yang terasa kurang secara
visual, perbaikannya ada di komponen dan token warna, bukan di aset gambar.

Yang masih terbuka dan bukan pekerjaan gambar:

1. Empat tangkapan layar S01 sampai S04 di atas, diambil dari aplikasi sendiri.
2. Tidak ada yang lain.

---

*Disusun Stage 3 untuk HIM-298. Sumber kebenaran visual tetap `ART-DIRECTION.md`.*
