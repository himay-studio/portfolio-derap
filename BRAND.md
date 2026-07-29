# Derap, BRAND.md

Aplikasi manajemen proyek dan tugas untuk tim kecil sampai menengah di Indonesia.
Dokumen ini adalah sumber kebenaran brand untuk seluruh stage berikutnya (Asset Forge, Webapp Architect, Media Producer, Frontend Builder).

Stage: 1 (Brand Strategist) | Issue: HIM-286 | Parent: HIM-282

---

## 1. Identitas singkat

| Field | Nilai |
| --- | --- |
| Nama brand | **Derap** |
| Slug | `derap` |
| Repo | `https://github.com/himay-studio/portfolio-derap.git` |
| Cloudflare Pages project | `himaystudio-portfolio-derap` |
| Domain publik | `portfolio-derap.himaystudio.com` |
| Kategori | SaaS B2B, aplikasi manajemen proyek dan tugas |
| Bahasa produk | Bahasa Indonesia sepenuhnya, termasuk label tabel dan status |

**Tagline utama:** Ritme kerja tim, terlihat jelas.

**Tagline pendukung** (boleh dipakai bergantian di landing dan login, jangan dicampur dalam satu layar):
- Tenggat bukan lagi kejutan.
- Satu tempat untuk proyek, tugas, dan beban tim.

---

## 2. Riset niche

### Siapa penggunanya
Tim berukuran 8 sampai 80 orang di Indonesia yang mengerjakan pekerjaan berbasis proyek:
- **Agensi kreatif dan digital**: banyak klien berjalan bersamaan, tiap klien punya beberapa proyek, revisi sering, tenggat ketat.
- **Software house dan tim produk**: bekerja per sprint, butuh Kanban dan estimasi jam, butuh burndown yang jujur.
- **Tim internal perusahaan** (marketing, operasional, konstruksi ringan, event): proyek lintas divisi, penanggung jawab tersebar.

Tiga peran yang memakai layar berbeda:
1. **Pemilik atau manajer proyek**: butuh ringkasan kesehatan proyek, mana yang telat, siapa yang kelebihan beban.
2. **Anggota tim**: butuh daftar tugas miliknya sendiri, urut prioritas dan tenggat, plus tempat mencatat jam kerja.
3. **Klien atau pemangku kepentingan** (di luar cakupan demo, tapi memengaruhi bahasa): butuh progres yang bisa dibaca tanpa penjelasan.

### Masalah utama yang nyata di pasar
1. **Pekerjaan tersebar di grup WhatsApp dan spreadsheet.** Ini kompetitor sesungguhnya, bukan Asana. Keputusan tenggelam di chat, versi file berlipat, tidak ada satu pun tampilan yang benar.
2. **Telat baru ketahuan setelah telat.** Tidak ada sinyal dini. Status proyek hanya hidup di kepala manajer.
3. **Beban kerja tidak terlihat.** Satu orang menumpuk sepuluh tugas, yang lain kosong, dan tidak ada yang tahu sampai ada yang tumbang.
4. **Tool global terasa asing dan berlebihan.** Antarmuka berbahasa Inggris, harga dalam dolar, fitur otomasi berlapis yang tidak pernah dipakai. Tim akhirnya kembali ke spreadsheet.
5. **Jam kerja tidak tercatat.** Agensi tidak tahu proyek mana yang sebenarnya merugi karena jam yang terpakai tidak pernah dibandingkan dengan estimasi.

### Kompetitor (5, dengan posisi masing-masing)
| Kompetitor | Posisi | Kekuatan | Celah yang kita ambil |
| --- | --- | --- | --- |
| **Trello** | Papan Kanban ringan, banyak dipakai tim Indonesia karena gratis | Sangat mudah dimulai | Mentok saat proyek bertambah. Tidak ada tabel, timeline, timesheet, atau beban tim |
| **Asana** | Manajemen kerja kelas menengah ke atas | Multiple view matang, ekosistem luas | Bahasa Inggris sebagai default, harga per pengguna dalam dolar, terasa berat untuk tim 15 orang |
| **ClickUp** | Serba bisa, semua fitur di satu tempat | Fitur paling lengkap per rupiah | Padat sampai membingungkan. Onboarding tim non teknis lambat |
| **Jira** | Standar tim rekayasa perangkat lunak | Sprint, backlog, laporan agile kuat | Terlalu berorientasi rekayasa. Tim desain, konten, dan operasional menolak memakainya |
| **Cicle** | Pemain lokal, manajemen proyek berbahasa Indonesia | Relevan dengan cara kerja tim lokal, harga rupiah | Kedalaman view masih terbatas. Belum kuat di sisi timesheet dan beban tim |

Catatan tambahan: **Manpro** kuat di manajemen proyek konstruksi, dan **HashMicro** menjual modul proyek sebagai bagian dari paket ERP besar. Keduanya menyasar perusahaan besar, bukan tim 15 orang, jadi tidak head to head dengan Derap.

### Celah posisi yang Derap ambil
> Derap adalah manajemen proyek berbahasa Indonesia yang membuat **ritme kerja dan beban tim terlihat di layar pertama**, dengan kedalaman view setara tool global tapi tanpa kerumitannya.

Tiga hal yang jadi pembeda dan harus terasa di produk:
1. **Kesehatan proyek eksplisit.** Setiap proyek membawa label On Track, Berisiko, atau Telat yang dihitung dari tenggat dan progres, bukan diisi manual.
2. **Beban tim sebagai warga kelas satu.** Halaman Tim menunjukkan jam terpakai dibanding kapasitas per orang, bukan sekadar daftar nama.
3. **Empat view yang benar benar setara.** Kanban, Tabel, Kalender, dan Timeline bukan fitur tambahan, tapi empat cara membaca data yang sama, dan pilihan terakhir pengguna diingat.

---

## 3. Nama dan logika penamaan

**Derap** (KBBI: bunyi langkah kaki yang teratur dan berirama, misalnya derap langkah).

Kenapa ini nama yang tepat:
- **Metafora tepat sasaran.** Manajemen proyek pada dasarnya soal irama: sprint yang berulang, tenggat yang berjarak, tim yang bergerak bersama. Derap adalah kata Indonesia yang persis berarti itu, dan bukan terjemahan kaku dari kata Inggris.
- **Terdengar seperti nama produk software.** Dua suku kata, lima huruf, konsonan keras di awal dan akhir. Mudah diucap di rapat, mudah diketik, mudah jadi awalan kode tugas (`DRP-142`).
- **Positif tanpa berlebihan.** Bukan nama yang berteriak seperti Turbo atau Rocket, dan bukan pula kata generik seperti Alur atau Kerja yang sudah aus.
- **Tidak bentrok.** Riset menunjukkan tidak ada produk SaaS Indonesia arus utama yang memakai nama Derap. Slug `derap` juga belum dipakai repo portfolio Himay Studio mana pun (dicek terhadap 23 repo yang ada).

**Kode tugas produk:** `DRP-<nomor>`, contoh `DRP-142`. Dipakai konsisten di semua view dan wajib dirender dengan font mono.

**Penulisan:** selalu **Derap** dengan D kapital, sisanya kecil. Bukan DERAP, bukan deRap. Di judul halaman aplikasi cukup `Derap`, tanpa embel embel.

---

## 4. Cek realisme kategori (wajib, tidak boleh dilewat)

Skill Brand Strategist menuntut jawaban jujur atas tiga pertanyaan sebelum palet dikunci. Kategori ini bukan produk fisik, jadi pertanyaannya diterjemahkan ke bentuk yang setara. Yang dilarang di sini bukan botol kaca amber, melainkan **estetika SaaS generik** yang membuat produk terlihat seperti template.

**1. Bagaimana produk ini sebenarnya dikemas dan dijual?**
Software B2B tidak punya kemasan fisik. Kemasannya adalah **antarmuka itu sendiri**. Yang dilihat calon pembeli di halaman landing adalah tangkapan layar aplikasi asli, bukan ilustrasi. Maka kata kunci kemasan yang dibawa turun ke setiap prompt MEDIA.md adalah:

> **Kata kunci kemasan: "tangkapan layar antarmuka aplikasi web asli, padat data, latar netral terang, sudut siku tanpa lengkung, tanpa mockup laptop mengambang, tanpa bayangan tebal"**

Artinya: aset visual utama produk ini adalah UI yang dirender rapi. Bukan foto orang rapat sambil tertawa, bukan render 3D isometrik, bukan ilustrasi bergaya Corporate Memphis dengan orang berlengan panjang.

**2. Rak mana yang saya tempati, dan 2 kompetitor nyata itu tampilannya seperti apa?**
- **Trello**: papan Kanban berwarna cerah, kartu berlengkung, latar papan bergambar. Ramah tapi terasa mainan saat data bertambah.
- **Asana**: putih bersih, aksen jingga dan ungu lembut, banyak ruang kosong, ilustrasi lembut di halaman kosong. Rapi tapi lapang, kurang efisien untuk tabel panjang.
- **Linear** (rujukan silang dari luar Indonesia): gelap, sangat padat, tipografi presisi, hampir tanpa dekorasi. Inilah tingkat kepadatan yang kita tuju, tapi Derap tampil terang karena penggunanya bekerja di kantor terang dan sering memakai laptop layar biasa.

Derap berdiri di antara Asana dan Linear: **seterang Asana, sepadat Linear, dengan bahasa dan bentuk yang sepenuhnya Indonesia.**

**3. Apakah palet saya cocok dengan mood kategori, atau saya cuma default ke sesuatu karena kelihatan mahal?**
Jawaban jujur: palet ini **sengaja tenang dan dingin**, dan itu keputusan yang dibela oleh kategorinya, bukan default estetis.

Aplikasi padat data dipakai berjam jam setiap hari. Warna di layar seperti itu punya tugas fungsional: memberi tahu mana yang gawat. Kalau permukaan aplikasi sendiri sudah penuh warna, badge Telat berwarna merah kehilangan daya kejutnya. Maka:
- **Netral abu kebiruan yang tenang** untuk seluruh kanvas dan permukaan, dengan pemisahan permukaan yang jelas lewat garis, bukan lewat bayangan.
- **Satu warna brand pekat** (nila tinta) yang hanya muncul di tempat yang berarti: menu aktif, tombol aksi utama, fokus keyboard, seri data pertama pada grafik.
- **Warna semantik hanya untuk status**, tidak pernah untuk dekorasi.

Yang secara sadar **dihindari**: gradien ungu ke biru muda ala template SaaS 2021, mode gelap sebagai identitas utama (penggunanya di kantor terang), warna hangat earthy (salah kategori total untuk software), dan aksen neon.

---

## 5. Arah kemasan dan visual (dibawa turun ke MEDIA.md)

Baris ini disalin apa adanya oleh Webapp Architect dan Media Producer ke setiap prompt aset.

> **Arah kemasan Derap:** tangkapan layar antarmuka aplikasi web asli, padat data, latar netral terang `#F4F6F9`, sudut siku radius 0, garis pemisah tipis, aksen nila tinta `#2440BE` hanya pada elemen aktif. Tanpa mockup perangkat mengambang, tanpa bayangan tebal, tanpa gradien ungu, tanpa ilustrasi orang bergaya korporat, tanpa render 3D.

Detail lengkap ada di `ART-DIRECTION.md`.

---

## 6. Nada bicara dan persona

### Persona
Derap berbicara seperti **manajer proyek senior yang tenang**. Sudah lama di lapangan, tidak panik saat tenggat mepet, dan lebih suka menunjukkan angka daripada menyemangati dengan kata kata.

Bukan asisten yang ceria. Bukan robot yang kaku. Rekan kerja yang bisa diandalkan.

### Nada bicara
- **Tenang dan lugas.** Kalimat pendek. Kata kerja jelas. Tidak ada tanda seru kecuali benar benar perlu.
- **Bahasa Indonesia yang wajar**, bukan terjemahan harfiah. Pakai "Tenggat", bukan "Deadline". Pakai "Beban kerja", bukan "Workload". Pakai "Tugas", bukan "Task".
- **Istilah teknis yang sudah jadi milik umum boleh tetap** karena memaksakan padanan justru membingungkan: Kanban, Sprint, Timeline, Backlog. Ini keputusan sadar, konsisten di seluruh aplikasi.
- **Angka lebih dipercaya daripada kata sifat.** Tulis "Telat 3 hari", bukan "Sedikit terlambat".
- **Tidak menyalahkan pengguna.** Pesan galat menjelaskan apa yang terjadi dan apa langkah berikutnya.

### Contoh penerapan
| Konteks | Tulis begini | Jangan begini |
| --- | --- | --- |
| Status proyek telat | Telat 3 hari | Waduh, proyek ini sudah lewat tenggat nih! |
| Keadaan kosong | Belum ada tugas di sprint ini. Tambahkan tugas pertama untuk mulai. | Kosong melompong |
| Beban berlebih | 42 jam dari kapasitas 40 jam | Overload banget |
| Tombol aksi | Tambah Tugas | Yuk Bikin Tugas Baru |
| Konfirmasi hapus | Hapus tugas ini. Riwayat aktivitasnya ikut terhapus. | Apakah Anda yakin ingin melakukan penghapusan? |
| Login demo | Masuk sebagai demo | Silakan login untuk melanjutkan |

### Yang dilarang keras
- **Em dash dan en dash, dalam bentuk apa pun** (R11 dan R58). Termasuk semua entity HTML yang menghasilkannya: bentuk bernama (mdash, ndash) maupun bentuk numerik desimal dan heksadesimalnya. Pakai koma, titik, atau kurung. Verifikasi dilakukan pada teks TER-RENDER, bukan cuma grep source.
- Bahasa gaul berlebihan (nih, dong, banget) di antarmuka aplikasi.
- Huruf kapital semua untuk penekanan, kecuali pada label kolom tabel dan badge yang memang memakai gaya `micro` (lihat DESIGN.md).
- Kata sifat pemasaran di dalam aplikasi (revolusioner, canggih, terbaik).

---

## 7. Do dan Don't

### Do
- Pakai satu warna brand untuk satu makna: **elemen aktif dan aksi utama**.
- Pisahkan permukaan dengan **garis**, bukan bayangan. Bayangan hanya untuk lapisan mengambang (dropdown, modal, popover).
- Tampilkan angka dengan **tabular figures** supaya kolom angka lurus.
- Beri setiap status **teks**, bukan hanya warna. Buta warna harus tetap bisa membaca papan Kanban.
- Sudut siku di semua tempat, radius 0 (R10). Termasuk **avatar berbentuk persegi**, bukan lingkaran.
- Simpan pilihan view terakhir pengguna di localStorage.

### Don't
- Jangan pakai warna semantik (hijau, kuning, merah) sebagai warna dekorasi. Warna itu punya arti.
- Jangan taruh tombol aksi utama di pojok kanan atas. Tombol aksi utama ada di **kiri**, konsisten di semua halaman.
- Jangan pakai avatar bulat, chip bulat, atau tombol pil. Radius 0.
- Jangan pakai `<select>` bawaan browser (R12). Semua dropdown harus komponen kustom beranimasi dan bisa diakses keyboard.
- Jangan pakai input teks bebas untuk tanggal (R21). Wajib date picker kustom.
- Jangan menaruh overlay layar penuh di dalam `<header>` yang punya `backdrop-filter` atau `transform` (R53). Render sebagai sibling atau portal ke `document.body`.
- Jangan pakai ilustrasi stok, foto orang rapat, atau maskot.

---

## 8. Ringkasan yang diwariskan ke stage berikutnya

| Stage | Yang wajib diambil dari dokumen ini |
| --- | --- |
| 2 Asset Forge | Konsep logo dan prompt siap pakai di `ART-DIRECTION.md`, termasuk **dua varian wajib** (primary untuk latar terang, knockout putih untuk latar gelap, R43) |
| 3 Webapp Architect | Token CSS lengkap di `DESIGN.md`, skala data dense, aturan bentuk radius 0, penempatan tombol aksi di kiri |
| 4 Media Producer | Kata kunci kemasan di bagian 5, dan aturan anti generik di `ART-DIRECTION.md` |
| 5 Frontend Builder | Nada bicara di bagian 6, tabel do dan don't di bagian 7, kode tugas `DRP-<nomor>` |
| 6 QA Deploy | Angka kontras terhitung di `DESIGN.md` sebagai acuan verifikasi R20 |

---

*Dokumen ini disusun oleh Brand Strategist (Stage 1) untuk HIM-286. Dibuat oleh Himay Studio.*
