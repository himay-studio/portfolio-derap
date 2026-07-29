# Derap, LAYOUT-ARCHITECTURE.md

Peta rute, hierarki komponen, dan keputusan desain beserta alasannya.

Stage: 3 (Webapp Architect) | Issue: HIM-298

---

## 1. Peta rute

Semuanya static export (`output: 'export'`, `trailingSlash: true`), 89 halaman.

| Rute | Isi | Komponen |
| --- | --- | --- |
| `/` | Landing produk satu layar, penjelasan singkat plus tombol masuk demo | `app/page.tsx` |
| `/login/` | Login demo, kredensial tampil di layar, satu klik masuk | `app/login/` |
| `/app/` | Dashboard, ringkasan jatuh tempo, telat, beban tim, progres proyek | `app/app/page.tsx` |
| `/app/proyek/` | Daftar proyek, 4 view | `ProyekClient` |
| `/app/proyek/<slug>/` | Detail proyek plus papan tugas proyek itu, 8 halaman | `[slug]/page.tsx` + `TugasProyek` |
| `/app/tugas/` | Daftar tugas, 4 view wajib | `TugasClient` |
| `/app/tugas/<id>/` | Detail tugas, 47 halaman | `[id]/page.tsx` |
| `/app/sprint/` | Daftar sprint, 3 view | `SprintClient` |
| `/app/sprint/<slug>/` | Detail sprint plus burndown, 8 halaman | `[slug]/page.tsx` |
| `/app/tim/` | Daftar anggota plus beban kerja per orang | `tim/page.tsx` |
| `/app/tim/<slug>/` | Detail anggota, 14 halaman | `[slug]/page.tsx` |
| `/app/timesheet/` | Catat jam, rekap per orang dan per proyek, 3 view | `TimesheetClient` |
| `/app/pengaturan/` | Workspace, zona waktu, jam kerja, aturan kerja | `WorkspaceForm` |
| `/app/pengaturan/status/` | Editor kolom status kustom | `StatusEditor` |
| `/app/pengaturan/label/` | Editor label | `LabelEditor` |

Pengaturan sengaja dipecah jadi **tiga rute**, bukan tiga tab semu di satu
halaman, supaya tiap layar punya alamat sendiri, bisa di-bookmark, dan ikut
tercakup pemeriksaan tautan R59.

---

## 2. Keputusan besar, dan alasannya

### 2.1 Lapisan view bersama, bukan empat implementasi yang kebetulan mirip

Ini keputusan arsitektur paling penting di build ini.

Modul Tugas wajib punya empat view setara: Kanban, Tabel, Kalender, dan
Timeline. Cara yang salah, dan cara yang paling gampang diambil, adalah menulis
empat komponen terpisah yang masing masing membaca `tasks` sendiri. Begitu itu
terjadi, penyaring dan urutan akan bercabang per view, dan tidak akan ada satu
pun view yang bisa dipercaya menampilkan himpunan yang sama.

Yang dipakai di sini:

```
src/components/views/
  types.ts          kontrak ViewItem, KolomTabel, GrupView, AdapterView
  DataViews.tsx     orkestrator, memegang pilihan view, kepadatan, kolom, papan
  ViewSwitcher.tsx  pemindah view
  KanbanView.tsx    \
  TableView.tsx      |  keempatnya HANYA tahu ViewItem,
  CalendarView.tsx   |  tidak pernah tahu bentuk Tugas atau Proyek
  TimelineView.tsx  /
  CardView.tsx      kartu dan daftar
  ItemCard.tsx      kartu bersama Kanban dan view Kartu
  useBoardDnd.ts    drag and drop papan, tetikus dan papan ketik
```

Tiap modul menyetor satu `AdapterView` di `src/lib/adapters.tsx` yang
menerjemahkan barisnya sendiri jadi `ViewItem` netral, ditambah definisi kolom
tabel dan definisi grup Kanban. Konsekuensi yang diinginkan:

- Menambah view baru cukup sekali di lapisan view, dan **semua modul langsung
  mendapatkannya**. Timesheet ikut dapat Kalender gratis, tanpa satu baris pun
  kode kalender di modul itu.
- Penyaring tinggal di halaman, DI LUAR `DataViews`. Datanya sudah tersaring
  sebelum masuk, jadi berpindah view **tidak mungkin** mereset penyaring, bukan
  karena hati hati, tapi karena penyaringnya memang tidak tinggal di sana.
- Papan Kanban membangun kolomnya dari `statusUrut`, bukan dari nama status yang
  ditulis harfiah. Mengubah kolom di `/app/pengaturan/status/` mengubah papan,
  badge tabel, warna kalender, dan warna timeline sekaligus.

Modul yang memakai lapisan ini: Tugas (4 view), Proyek (4), Sprint (3),
Timesheet (3), dan papan tugas di dalam halaman detail proyek.

### 2.2 Drag and drop papan ketik dirancang di Stage 3, bukan ditempel Stage 5

Kalau kartu Kanban dibuat sebagai `<div>` berisi tautan, satu satunya cara
menambahkan drag and drop papan ketik nanti adalah membongkar ulang markup
papan. Itu masalah arsitektur, dan tanggung jawabnya ada di stage ini.

Bentuk yang dipilih: **kartu itu sendiri adalah tautan**, jadi hanya ada satu
perhentian tab per kartu. Enter membuka detail lewat perilaku bawaan tautan,
sedangkan Space diambil alih untuk mengangkat kartu.

```
Space          angkat kartu, tekan lagi untuk meletakkan
Panah kiri kanan  pindah antar kolom saat terangkat
Panah atas bawah  geser posisi di dalam kolom
Escape         batalkan, kartu kembali ke tempat semula
```

Setiap perpindahan diumumkan lewat wilayah `aria-live`, karena pengguna pembaca
layar tidak melihat kartunya bergerak. Jalur tetikus memakai HTML5 drag and
drop, dan keduanya memanggil satu callback `onPindah(itemId, keGrup, keIndeks)`
yang sama, jadi tidak ada dua sumber kebenaran posisi.

Sudah diuji jalan, bukan diasumsikan: lihat bagian 6.

### 2.3 Sidebar kiri permanen, dan keadaan lipatnya tidak berkedip

Navigasi utama ada di sidebar kiri, tidak pernah di topbar. Sembilan item, jadi
dikelompokkan dengan label seksi.

Penanda menu aktif memakai **tiga penanda visual plus satu penanda semantik**:
isian brand, batang kiri 3px putih, teks putih, dan `aria-current="page"`.
Mengandalkan warna latar saja tidak cukup.

Keadaan lipat disimpan sebagai atribut `data-sidebar` pada `<html>` dan diset
oleh skrip kecil **sebelum paint pertama**. Kalau dibaca dari localStorage saat
render React, sidebar akan selalu berkedip lebar dulu lalu menyempit, dan pada
static export itu juga membuat markup server berbeda dari klien.

Saat menyempit, label tetap ada di DOM tapi disembunyikan secara visual, jadi
pembaca layar masih membacanya dan tooltip `title` melayani pengguna tetikus.

### 2.4 Aksi utama di kiri, di semua halaman

Urutan yang sama di setiap layar: remah, judul, baris aksi dengan aksi utama di
kiri, lalu penyaring dan pencarian di kanannya pada baris yang sama, baru
datanya. Tidak ada aksi utama di pojok kanan atas di mana pun.

Pemindah view duduk di header halaman, bukan di baris aksi, supaya baris aksi
tetap punya satu makna: apa yang bisa saya lakukan di halaman ini.

### 2.5 Kesehatan proyek dihitung, tidak disimpan

`src/lib/derived.ts` menghitung kesehatan proyek dari tenggat dan progres nyata,
dan nilainya sengaja **tidak** ada di `src/data/projects.ts`. Kalau ikut
disimpan, cepat atau lambat angka tersimpan dan angka terhitung akan berbeda,
dan tidak akan ada cara memutuskan mana yang benar.

Konsekuensinya, Kanban sengaja **tidak** ditawarkan untuk modul Proyek, karena
memindahkan kartu antar kolom kesehatan akan menyiratkan nilai itu bisa diatur
tangan. Proyek dapat Kartu, Tabel, Timeline, dan Kalender.

### 2.6 Overlay selalu di-portal ke `document.body`

Modal, Drawer, dan tirai navigasi mobile semuanya lewat `Portal`. Alasannya ada
di `src/components/ui/Portal.tsx`: elemen ber-`backdrop-filter`, `filter`,
`transform`, atau `will-change` menjadi containing block bagi seluruh keturunan
`position: fixed`, dan overlay yang bersarang di dalamnya akan kolaps setinggi
induknya. Yang membuatnya berbahaya, CSS-nya terbaca benar di kedua keadaan,
jadi verifikasinya harus mengukur `getBoundingClientRect()`.

Saat tertutup, komponen overlay **tidak merender apa apa**, jadi tidak ada
lapisan tak terlihat yang menjerat klik.

### 2.7 Panel mengambang: `display:none` saat tutup, dan posisi diukur saat buka

Satu mesin buka tutup dipakai semua lapisan mengambang: `useDisclosure`.

- Saat tertutup penuh, panel diberi atribut `hidden`, jadi `display: none` dan
  panelnya berhenti memakan layout. Panel yang cuma `opacity: 0` tetap
  menyumbang lebar ke `scrollWidth` dan bisa menyebabkan overflow horizontal
  yang tidak terlihat di screenshot mana pun, karena keadaan yang rusak justru
  keadaan yang tak terlihat.
- Saat terbuka, posisi panel **diukur** lalu digeser secukupnya supaya kedua
  tepinya tetap di dalam jendela. Menjangkar ke tepi pemicu saja tidak cukup:
  pemicu yang kebetulan duduk di ujung kanan baris penyaring akan melempar
  panelnya keluar jendela, dan `max-width` tidak menolong karena panelnya memang
  lebih sempit dari viewport, cuma salah posisi. Ini benar benar terjadi pada
  date picker di `/app/tugas/` dan `/app/timesheet/`, terukur, lalu diperbaiki.
- `aria-expanded` dan kondisi tampil panel dibaca dari **satu state yang sama**,
  jadi tidak mungkin berbeda. Pemicu hanya memakai `onClick`, tidak pernah
  `onFocus` pembuka bersama `onClick` toggler di elemen yang sama.

### 2.8 Responsif

| Lebar | Yang berubah |
| --- | --- |
| >= 1025px | Sidebar permanen, topbar penuh |
| <= 1200px | Nama dan peran di topbar disembunyikan, avatar dan menunya tetap |
| <= 1024px | Sidebar jadi tirai lewat hamburger, di-portal ke body |
| <= 768px | Tabel jadi daftar kartu, grid kalender jadi agenda, bagian sekunder berisi lebih dari 3 item jadi snap carousel |
| <= 560px | Label pemindah view disembunyikan secara visual, ikon plus tooltip plus label di DOM |
| <= 480px | Kolom Kanban 84vw, padding isi mengecil |

**Pengecualian R48 yang disengaja.** Daftar data utama (tugas, proyek, catatan
jam) tetap daftar vertikal panjang di mobile, tidak dijadikan carousel. Ini
mengikuti `DESIGN.md` bagian 6.2 yang menuliskannya eksplisit: carousel wajib
untuk bagian berisi lebih dari 3 item peer, "kecuali daftar tugas utama yang
memang daftar vertikal panjang". Yang menjadi carousel adalah bagian sekunder,
yaitu baris KPI di Dashboard, detail proyek, detail sprint, detail anggota, dan
Timesheet.

---

## 3. Hierarki komponen

```
app/layout.tsx                  font, metadata, skrip pra-paint sidebar
├── app/page.tsx                landing
├── app/login/                  login demo
└── app/app/layout.tsx          kerangka aplikasi
    ├── shell/Sidebar           sidebar kiri, collapsible, penanda aktif
    ├── shell/Topbar            56px, pencarian, notifikasi, menu akun
    │   └── shell/MobileNav     tirai, di-portal ke body
    └── shell/PageTransition    R46, key pada pathname, 260ms
        └── halaman
            ├── shell/PageHeader   remah, judul, baris aksi, KpiCard
            └── views/DataViews    lapisan view bersama
```

Komponen dasar yang dibangun sekali dan dipakai di semua modul:

| Komponen | Berkas | Catatan |
| --- | --- | --- |
| `Select` | `ui/Select.tsx` | R12, dropdown kustom, listbox, typeahead, `aria-activedescendant` |
| `DatePicker` | `ui/DatePicker.tsx` | R21, grid kalender, panah, PageUp dan PageDown, Home dan End |
| `Modal`, `Drawer` | `ui/Overlay.tsx` | R53, di-portal, jerat fokus, Escape |
| `Portal` | `ui/Portal.tsx` | satu satunya jalan ke `document.body` |
| `useDisclosure` | `ui/useDisclosure.ts` | mesin buka tutup bersama, R57 dan R60 |
| `Checkbox`, `Toggle`, `Stepper`, `SearchInput`, `SegmentedControl` | `ui/Controls.tsx` | batas `--border-control`, bukan `--border` |
| `Avatar`, `Badge`, `Chip`, `Progress`, `EmptyState`, `Skeleton`, `Placeholder` | `ui/Primitives.tsx` | avatar persegi, progres persegi |
| `DataTable` | `views/TableView.tsx` | sortir, header lengket, pilih baris, aksi massal, kepadatan |
| `BarChart`, `Burndown` | `charts/Charts.tsx` | dirender dari data, seri dibedakan pola garis plus label |

---

## 4. Data dan state

Data statis di `src/data/*.ts`, state di klien, tanpa backend.

| Berkas | Isi Stage 3 |
| --- | --- |
| `types.ts` | seluruh bentuk data |
| `team.ts` | 14 anggota |
| `projects.ts` | 8 proyek |
| `tasks.ts` | 47 tugas lewat penolong `mk`, lengkap dengan sub tugas, ceklis, komentar, lampiran |
| `sprints.ts` | 8 sprint |
| `timesheet.ts` | 49 catatan jam, dua minggu |
| `activity.ts` | 26 entri riwayat |
| `taxonomy.ts` | 6 kolom status, 3 prioritas, 10 label, pengaturan workspace |
| `site.ts` | merek, tautan, kredensial demo |

Semua tanggal string ISO `YYYY-MM-DD`, dan hari acuan aplikasi dikunci di
`HARI_INI = '2026-07-29'` (`src/lib/dates.ts`). Tidak ada `new Date()` tanpa
argumen di jalur render, karena static export mengharuskan markup server dan
klien identik.

Kunci localStorage semuanya terdaftar di `src/lib/storage.ts`:
`derap.sidebar.collapsed`, `derap.view.<modul>`, `derap.columns.<modul>`,
`derap.table.density`, `derap.board.moves.<modul>`, `derap.demo.signed-in`.

---

## 5. Yang sengaja ditunda ke Stage 5

Bukan yang terlupa, tapi yang memang bukan pekerjaan stage ini.

1. **Menggemukkan data demo.** 47 tugas dan 8 proyek sudah cukup supaya tata
   letak terlihat jujur, tapi semangat R41 minta terasa seperti bisnis nyata.
   Penolong `mk` di `tasks.ts` dibuat supaya menambah puluhan baris tidak
   berarti menyalin sepuluh field kosong tiap kali.
2. **Form yang benar benar menyimpan.** Semua modal Tambah dan Ubah berisi
   `Placeholder` beranotasi yang menyebut field apa saja yang perlu. Komponen
   dasarnya sudah siap, tinggal disambungkan ke state dan localStorage.
3. **Panel geser detail tugas.** `Drawer` sudah ada dan sudah diuji, belum
   dipakai. Detail tugas saat ini halaman penuh.
4. **Pencarian global di topbar.** Kotaknya berfungsi sebagai input, hasilnya
   belum disambungkan.
5. **Komentar, mention, dan unggah lampiran.** Tampilannya sudah ada, isinya
   statis.
6. **Empat tangkapan layar produk** untuk halaman landing, lihat `MEDIA.md`.
7. **Aksi massal tabel** memilih baris dan menampilkan bilahnya sudah jalan,
   tombolnya belum mengubah data.

---

## 6. Yang sudah diverifikasi dengan mengukur, bukan dengan membaca kode

Harness ada di repo dan bisa dijalankan ulang siapa saja.

```bash
node scripts/qa-setup.mjs     # menyiapkan Chromium di runtime tanpa root
node scripts/qa-check.mjs     # sapuan terukur, semua rute, 5 breakpoint
node scripts/qa-probe.mjs     # membuktikan harness-nya sendiri memang bekerja
node scripts/qa-shots.mjs     # 85 tangkapan layar ke qa-shots/
```

`qa-check.mjs` menguji, pada 375, 480, 768, 1025, dan 1440:

- **R19 dan R57** `scrollWidth <= innerWidth`, dengan semua panel tertutup DAN
  diulang dengan tiap panel terbuka.
- **R16.1** tepi kiri dan kanan tiap panel yang terbuka masih di dalam jendela.
- **R50** `innerText` per baris, menolak `[a-z][A-Z]` dalam satu baris
  ter-render. Memakai `textContent` di sini akan melaporkan positif palsu pada
  markup yang justru sudah benar.
- **R11 dan R58** em dan en dash pada teks TER-RENDER, karena `&#8212;` adalah
  teks JSX biasa yang tidak pernah muncul sebagai karakter literal di source.
- **R20** kontras terprogram sitewide, latar EFEKTIF ditelusuri ke atas melalui
  rantai leluhur, ambang 4.5:1 atau 3:1 sesuai ukuran dan bobot, kontrol
  nonaktif dikecualikan.
- **R60** `aria-expanded` dibaca bersama keadaan tampil panel yang sebenarnya,
  dengan pointer digeser menjauh dulu supaya `:hover` tidak menutupi keadaan
  aslinya, lalu diperiksa lagi setelah Escape.
- **R53** kotak tirai mobile diukur, bukan dibaca CSS-nya.
- **R59** semua tautan internal dicrawl, plus pemeriksaan halaman yatim.

Hasil terakhir: **nol temuan**.

`qa-probe.mjs` ada karena "nol temuan" hanya berarti sesuatu kalau pemeriksanya
memang menyentuh elemen. Probe menghitung yang diperiksa (440 elemen berteks di
`/app/tugas/`), menyuntikkan cacat kontras buatan untuk memastikan logikanya
memang menangkapnya, lalu menguji hal hal yang tidak bisa dibuktikan dengan
membaca markup: kartu Kanban benar benar pindah kolom lewat papan ketik dan
bertahan setelah muat ulang, pilihan view bertahan, sidebar tetap terlipat,
modal di-portal ke body dan menjerat fokus, tirai mobile setinggi viewport,
dan date picker bisa memilih tanggal dari papan ketik.

Tiga cacat nyata ditemukan probe ini dan sudah diperbaiki, ketiganya mustahil
terlihat di screenshot: fokus tidak pernah masuk ke modal karena jerat fokusnya
dibongkar pasang tiap render, isi portal belum ada di DOM saat jerat fokus
berjalan, dan jalur papan ketik date picker mati karena fokus dicoba saat
panelnya masih `display: none`.

---

*Disusun Stage 3 untuk HIM-298. Sumber kebenaran warna dan tipografi ada di
`DESIGN.md`, sumber kebenaran visual aset ada di `ART-DIRECTION.md`, sumber
kebenaran nada bicara ada di `BRAND.md`.*
