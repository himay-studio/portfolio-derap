import type { PrioritasId, SubTugas, Tugas } from './types';

/**
 * Data tugas demo.
 *
 * Bentuknya sengaja ditulis lewat satu penolong `mk` supaya Stage 5 bisa
 * menambah puluhan baris lagi tanpa menyalin sepuluh field kosong tiap kali
 * (semangat R41). Field yang membedakan satu tugas dari yang lain tetap
 * ditulis eksplisit per baris.
 */

type Spec = {
  n: number;
  judul: string;
  deskripsi: string;
  proyekId: string;
  sprintId?: string | null;
  pj?: string | null;
  status: string;
  prio: PrioritasId;
  labels: string[];
  mulai: string;
  tenggat: string;
  est: number;
  jam: number;
  sub?: string[];
  subSelesai?: number;
  ceklis?: string[];
  ceklisSelesai?: number;
  komentar?: { p: string; w: string; i: string }[];
  lampiran?: { n: string; j: 'pdf' | 'gambar' | 'dokumen' | 'lembar'; u: string }[];
};

let urutanCounter: Record<string, number> = {};

function mk(s: Spec): Tugas {
  const id = `t${String(s.n).padStart(3, '0')}`;
  const subJudul = s.sub ?? [];
  const subDone = s.subSelesai ?? 0;
  const subtugas: SubTugas[] = subJudul.map((judul, i) => ({
    id: `${id}-s${i + 1}`,
    judul,
    selesai: i < subDone,
  }));
  const ceklisJudul = s.ceklis ?? [];
  const ceklisDone = s.ceklisSelesai ?? 0;

  urutanCounter[s.status] = (urutanCounter[s.status] ?? 0) + 1;

  return {
    id,
    kode: `DRP-${100 + s.n}`,
    judul: s.judul,
    deskripsi: s.deskripsi,
    proyekId: s.proyekId,
    sprintId: s.sprintId ?? null,
    penanggungJawabId: s.pj ?? null,
    statusId: s.status,
    prioritas: s.prio,
    labelIds: s.labels,
    mulai: s.mulai,
    tenggat: s.tenggat,
    estimasiJam: s.est,
    jamTercatat: s.jam,
    subtugas,
    ceklis: ceklisJudul.map((judul, i) => ({
      id: `${id}-c${i + 1}`,
      judul,
      selesai: i < ceklisDone,
    })),
    komentar: (s.komentar ?? []).map((k, i) => ({
      id: `${id}-k${i + 1}`,
      penulisId: k.p,
      waktu: k.w,
      isi: k.i,
    })),
    lampiran: (s.lampiran ?? []).map((l, i) => ({
      id: `${id}-l${i + 1}`,
      nama: l.n,
      jenis: l.j,
      ukuran: l.u,
    })),
    urutan: urutanCounter[s.status],
  };
}

const specs: Spec[] = [
  /* ---------------- p01, Rebranding Nusantara Kopi ---------------- */
  {
    n: 1, judul: 'Finalisasi panduan merek versi cetak',
    deskripsi: 'Susun panduan 48 halaman berisi aturan logo, ruang aman, palet, tipografi, dan contoh penerapan di papan nama cabang.',
    proyekId: 'p01', sprintId: 's05', pj: 'u03', status: 'jalan', prio: 'tinggi',
    labels: ['lb01', 'lb10'], mulai: '2026-07-20', tenggat: '2026-08-04', est: 32, jam: 19,
    sub: ['Aturan ruang aman logo', 'Contoh papan nama cabang', 'Aturan penggunaan yang dilarang', 'Ekspor berkas cetak'],
    subSelesai: 2,
    ceklis: ['Cek warna pada kertas uncoated', 'Cek ukuran minimum logo di 16mm'], ceklisSelesai: 1,
    komentar: [
      { p: 'u01', w: '2026-07-27 09:14', i: 'Halaman aturan papan nama tolong tambah contoh untuk cabang di dalam mal, ukurannya beda.' },
      { p: 'u03', w: '2026-07-27 11:02', i: 'Sudah dicatat. Saya tambahkan dua contoh, kanopi luar dan papan gantung dalam mal.' },
    ],
    lampiran: [{ n: 'panduan-merek-v4.pdf', j: 'pdf', u: '12,4 MB' }],
  },
  {
    n: 2, judul: 'Desain kemasan lini kopi susu',
    deskripsi: 'Tiga varian rasa dalam satu sistem kemasan, memakai grid yang sama supaya rak terlihat rapi.',
    proyekId: 'p01', sprintId: 's05', pj: 'u04', status: 'review', prio: 'tinggi',
    labels: ['lb01'], mulai: '2026-07-14', tenggat: '2026-07-30', est: 24, jam: 22,
    sub: ['Varian gula aren', 'Varian pandan', 'Varian original'], subSelesai: 3,
    komentar: [{ p: 'u03', w: '2026-07-28 16:40', i: 'Varian pandan hijaunya masih terlalu terang di bawah lampu toko. Turunkan satu tingkat.' }],
  },
  {
    n: 3, judul: 'Riset persepsi merek di lima cabang',
    deskripsi: 'Wawancara singkat 60 pelanggan di lima cabang dengan trafik tertinggi, fokus pada ingatan terhadap nama dan warna.',
    proyekId: 'p01', sprintId: null, pj: 'u12', status: 'selesai', prio: 'sedang',
    labels: ['lb05'], mulai: '2026-05-18', tenggat: '2026-06-12', est: 40, jam: 44,
    sub: ['Susun panduan wawancara', 'Kunjungan lapangan', 'Rekap temuan'], subSelesai: 3,
    lampiran: [{ n: 'rekap-wawancara.lembar', j: 'lembar', u: '820 KB' }],
  },
  {
    n: 4, judul: 'Animasi logo untuk konten media sosial',
    deskripsi: 'Tiga durasi, 2 detik untuk bumper, 5 detik untuk pembuka video, dan versi diam untuk cetak.',
    proyekId: 'p01', sprintId: 's05', pj: 'u05', status: 'siap', prio: 'rendah',
    labels: ['lb01'], mulai: '2026-08-03', tenggat: '2026-08-12', est: 16, jam: 0,
  },
  {
    n: 5, judul: 'Presentasi hasil ke jajaran direksi',
    deskripsi: 'Sesi 45 menit, menunjukkan arah identitas dan rencana peluncuran bertahap per wilayah.',
    proyekId: 'p01', sprintId: null, pj: 'u01', status: 'siap', prio: 'tinggi',
    labels: ['lb08'], mulai: '2026-08-05', tenggat: '2026-08-14', est: 12, jam: 0,
    ceklis: ['Kunci tanggal dengan sekretaris direksi', 'Siapkan cetakan contoh kemasan'], ceklisSelesai: 1,
  },
  {
    n: 6, judul: 'Audit penerapan logo di material lama',
    deskripsi: 'Inventarisasi seluruh material cetak dan digital yang masih memakai logo lama, dikelompokkan per cabang.',
    proyekId: 'p01', sprintId: null, pj: 'u13', status: 'backlog', prio: 'rendah',
    labels: ['lb05', 'lb08'], mulai: '2026-08-10', tenggat: '2026-08-21', est: 20, jam: 0,
  },

  /* ---------------- p02, Aplikasi Kasir Warung Pintar ---------------- */
  {
    n: 7, judul: 'Sinkronisasi transaksi luring ke daring',
    deskripsi: 'Antrean transaksi disimpan lokal saat sinyal hilang, lalu dikirim berurutan saat koneksi kembali. Wajib tahan terhadap kirim ganda.',
    proyekId: 'p02', sprintId: 's01', pj: 'u07', status: 'jalan', prio: 'tinggi',
    labels: ['lb03'], mulai: '2026-07-20', tenggat: '2026-07-31', est: 40, jam: 27,
    sub: ['Antrean lokal dengan IndexedDB', 'Penanda idempoten per transaksi', 'Penyelesaian bentrok stok', 'Uji beban 2.000 transaksi'],
    subSelesai: 2,
    ceklis: ['Uji cabut kabel saat kirim', 'Uji jam perangkat mundur'], ceklisSelesai: 1,
    komentar: [
      { p: 'u10', w: '2026-07-28 10:05', i: 'Saat perangkat kehabisan baterai di tengah kirim, satu transaksi masuk dua kali. Sudah saya catat langkah ulangnya.' },
      { p: 'u07', w: '2026-07-28 13:22', i: 'Penanda idempoten belum dipasang di jalur ulang kirim. Saya kerjakan hari ini.' },
    ],
  },
  {
    n: 8, judul: 'Perbaikan struk tercetak terpotong di kertas 58mm',
    deskripsi: 'Struk terpotong pada baris total saat memakai printer termal 58mm. Terjadi hanya di perangkat Android 11 ke bawah.',
    proyekId: 'p02', sprintId: 's01', pj: 'u06', status: 'blokir', prio: 'tinggi',
    labels: ['lb02', 'lb09'], mulai: '2026-07-22', tenggat: '2026-07-30', est: 8, jam: 6,
    komentar: [{ p: 'u06', w: '2026-07-28 15:10', i: 'Menunggu pinjaman printer 58mm dari klien untuk uji ulang. Diperkirakan datang 30 Juli.' }],
  },
  {
    n: 9, judul: 'Katalog produk dengan pemindai kode batang',
    deskripsi: 'Pemindaian memakai kamera perangkat, jatuh ke input manual kalau kamera ditolak izinnya.',
    proyekId: 'p02', sprintId: 's02', pj: 'u06', status: 'selesai', prio: 'tinggi',
    labels: ['lb02'], mulai: '2026-07-06', tenggat: '2026-07-17', est: 28, jam: 31,
    sub: ['Akses kamera', 'Pembacaan EAN-13', 'Input manual cadangan'], subSelesai: 3,
  },
  {
    n: 10, judul: 'Laporan penjualan harian per warung',
    deskripsi: 'Rekap omzet, jumlah transaksi, dan produk terlaris, bisa diunduh sebagai lembar kerja.',
    proyekId: 'p02', sprintId: 's01', pj: 'u08', status: 'review', prio: 'sedang',
    labels: ['lb03'], mulai: '2026-07-21', tenggat: '2026-08-03', est: 20, jam: 18,
  },
  {
    n: 11, judul: 'Uji lapangan di lima warung mitra',
    deskripsi: 'Dampingi kasir selama satu hari penuh di lima lokasi berbeda, catat setiap kali kasir ragu atau salah tekan.',
    proyekId: 'p02', sprintId: 's01', pj: 'u10', status: 'siap', prio: 'tinggi',
    labels: ['lb04', 'lb08'], mulai: '2026-07-30', tenggat: '2026-08-05', est: 32, jam: 0,
    ceklis: ['Jadwalkan lima lokasi', 'Siapkan lembar observasi', 'Siapkan perangkat cadangan'], ceklisSelesai: 2,
  },
  {
    n: 12, judul: 'Manajemen stok masuk dan keluar',
    deskripsi: 'Pencatatan stok masuk dari pemasok dan penyesuaian manual dengan alasan yang wajib diisi.',
    proyekId: 'p02', sprintId: null, pj: 'u08', status: 'backlog', prio: 'sedang',
    labels: ['lb03'], mulai: '2026-08-10', tenggat: '2026-08-28', est: 36, jam: 0,
  },
  {
    n: 13, judul: 'Halaman pengaturan pajak dan diskon',
    deskripsi: 'Pengaturan tarif pajak per warung dan aturan diskon berjenjang, termasuk pratinjau perhitungan.',
    proyekId: 'p02', sprintId: null, pj: 'u06', status: 'backlog', prio: 'rendah',
    labels: ['lb02'], mulai: '2026-08-17', tenggat: '2026-09-04', est: 24, jam: 0,
  },
  {
    n: 14, judul: 'Pipeline rilis otomatis ke Play Store internal',
    deskripsi: 'Setiap penggabungan ke main menghasilkan build bertanda dan naik ke jalur uji internal.',
    proyekId: 'p02', sprintId: 's01', pj: 'u11', status: 'jalan', prio: 'sedang',
    labels: ['lb07'], mulai: '2026-07-23', tenggat: '2026-08-04', est: 16, jam: 9,
  },
  {
    n: 15, judul: 'Uji regresi alur pembayaran tunai dan QRIS',
    deskripsi: 'Lima puluh skenario uji, mencakup kembalian, pembatalan, dan pembayaran gabungan.',
    proyekId: 'p02', sprintId: 's01', pj: 'u10', status: 'jalan', prio: 'tinggi',
    labels: ['lb04'], mulai: '2026-07-24', tenggat: '2026-07-31', est: 24, jam: 15,
  },
  {
    n: 16, judul: 'Dokumentasi API untuk tim mitra',
    deskripsi: 'Referensi endpoint sinkronisasi dan contoh muatan, ditulis dalam Bahasa Indonesia dan Inggris.',
    proyekId: 'p02', sprintId: null, pj: 'u02', status: 'backlog', prio: 'rendah',
    labels: ['lb10'], mulai: '2026-08-24', tenggat: '2026-09-11', est: 18, jam: 0,
  },

  /* ---------------- p03, Situs Korporat Bumi Sentosa ---------------- */
  {
    n: 17, judul: 'Kerangka informasi dan peta situs dua bahasa',
    deskripsi: 'Susun struktur halaman untuk versi Indonesia dan Inggris, termasuk aturan tautan silang antarbahasa.',
    proyekId: 'p03', sprintId: null, pj: 'u12', status: 'selesai', prio: 'tinggi',
    labels: ['lb05', 'lb06'], mulai: '2026-06-01', tenggat: '2026-06-19', est: 24, jam: 26,
    sub: ['Inventaris konten lama', 'Peta situs versi baru', 'Aturan penamaan URL'], subSelesai: 3,
  },
  {
    n: 18, judul: 'Desain halaman ruang investor',
    deskripsi: 'Halaman berisi laporan tahunan, laporan kuartalan, dan jadwal paparan publik dengan pencarian per tahun.',
    proyekId: 'p03', sprintId: null, pj: 'u04', status: 'jalan', prio: 'tinggi',
    labels: ['lb01'], mulai: '2026-07-13', tenggat: '2026-08-06', est: 28, jam: 12,
    sub: ['Daftar laporan dengan penyaring tahun', 'Halaman detail laporan', 'Tampilan mobile'], subSelesai: 1,
  },
  {
    n: 19, judul: 'Audit aksesibilitas WCAG AA menyeluruh',
    deskripsi: 'Periksa kontras, urutan fokus, penanda ARIA, dan navigasi papan ketik di seluruh rute. Ini syarat rilis, bukan tambahan.',
    proyekId: 'p03', sprintId: null, pj: 'u10', status: 'siap', prio: 'tinggi',
    labels: ['lb04'], mulai: '2026-08-17', tenggat: '2026-09-04', est: 32, jam: 0,
    ceklis: ['Sapuan kontras terprogram di semua rute', 'Uji pembaca layar NVDA', 'Uji navigasi papan ketik penuh'], ceklisSelesai: 0,
  },
  {
    n: 20, judul: 'Penulisan ulang profil sembilan anak usaha',
    deskripsi: 'Ringkas profil lama yang rata rata 900 kata menjadi 350 kata dengan struktur yang sama untuk semua.',
    proyekId: 'p03', sprintId: null, pj: 'u12', status: 'jalan', prio: 'sedang',
    labels: ['lb06'], mulai: '2026-07-20', tenggat: '2026-08-14', est: 36, jam: 14,
  },
  {
    n: 21, judul: 'Integrasi pusat unduhan laporan tahunan',
    deskripsi: 'Unggah berkas oleh tim korporat, lengkap dengan versi, tanggal terbit, dan penghitung unduhan.',
    proyekId: 'p03', sprintId: null, pj: 'u06', status: 'backlog', prio: 'sedang',
    labels: ['lb02', 'lb03'], mulai: '2026-08-10', tenggat: '2026-09-08', est: 30, jam: 0,
  },

  /* ---------------- p04, Kampanye Ramadan Sari Rasa ---------------- */
  {
    n: 22, judul: 'Konsep besar kampanye dan garis cerita',
    deskripsi: 'Satu gagasan utama yang bisa dipakai di televisi, media sosial, dan material toko tanpa terasa ditempel.',
    proyekId: 'p04', sprintId: null, pj: 'u03', status: 'selesai', prio: 'tinggi',
    labels: ['lb01', 'lb06'], mulai: '2026-06-22', tenggat: '2026-07-03', est: 20, jam: 24,
  },
  {
    n: 23, judul: 'Produksi tiga video pendek 15 detik',
    deskripsi: 'Tiga potongan untuk kanal vertikal, memakai stok rekaman yang sudah dilisensikan klien.',
    proyekId: 'p04', sprintId: null, pj: 'u05', status: 'jalan', prio: 'tinggi',
    labels: ['lb01'], mulai: '2026-07-20', tenggat: '2026-08-03', est: 30, jam: 17,
    sub: ['Papan cerita disetujui', 'Penyuntingan kasar', 'Gradasi warna', 'Teks terjemahan'], subSelesai: 2,
  },
  {
    n: 24, judul: 'Materi cetak untuk 340 titik toko',
    deskripsi: 'Poster gantung, penanda rak, dan spanduk pintu masuk dalam tiga ukuran standar toko modern.',
    proyekId: 'p04', sprintId: null, pj: 'u04', status: 'review', prio: 'sedang',
    labels: ['lb01'], mulai: '2026-07-13', tenggat: '2026-07-31', est: 26, jam: 24,
  },
  {
    n: 25, judul: 'Halaman promo dengan penghitung mundur',
    deskripsi: 'Halaman berumur enam minggu, ada penghitung mundur ke akhir promo dan pencari toko terdekat.',
    proyekId: 'p04', sprintId: null, pj: 'u06', status: 'siap', prio: 'sedang',
    labels: ['lb02'], mulai: '2026-07-30', tenggat: '2026-08-07', est: 18, jam: 0,
  },
  {
    n: 26, judul: 'Laporan hasil kampanye untuk klien',
    deskripsi: 'Rekap jangkauan, interaksi, dan penjualan selama periode promo, dibandingkan dengan tahun lalu.',
    proyekId: 'p04', sprintId: null, pj: 'u13', status: 'backlog', prio: 'rendah',
    labels: ['lb08'], mulai: '2026-08-10', tenggat: '2026-08-21', est: 12, jam: 0,
  },

  /* ---------------- p05, Dasbor Logistik Trans Andalan ---------------- */
  {
    n: 27, judul: 'Turunkan waktu muat dasbor di bawah 2 detik',
    deskripsi: 'Saat ini 5,4 detik pada koneksi 4G lambat. Sumbernya muatan awal 2,1 MB dan 11 permintaan berantai.',
    proyekId: 'p05', sprintId: 's04', pj: 'u07', status: 'jalan', prio: 'tinggi',
    labels: ['lb02', 'lb09'], mulai: '2026-07-27', tenggat: '2026-08-07', est: 32, jam: 11,
    sub: ['Pecah bundel per rute', 'Gabungkan permintaan berantai', 'Muat peta secara malas', 'Ukur ulang di 4G lambat'],
    subSelesai: 1,
    komentar: [{ p: 'u02', w: '2026-07-28 08:30', i: 'Klien memakai tablet lawas di pos jaga. Tolong ukur juga di perangkat kelas bawah, bukan cuma jaringan lambat.' }],
  },
  {
    n: 28, judul: 'Peta armada waktu nyata',
    deskripsi: 'Menampilkan 400 kendaraan dengan pembaruan tiap 30 detik, memakai pengelompokan penanda supaya tetap ringan.',
    proyekId: 'p05', sprintId: 's03', pj: 'u07', status: 'selesai', prio: 'tinggi',
    labels: ['lb02'], mulai: '2026-07-13', tenggat: '2026-07-24', est: 40, jam: 46,
    sub: ['Aliran data telemetri', 'Pengelompokan penanda', 'Panel detail kendaraan'], subSelesai: 3,
  },
  {
    n: 29, judul: 'Tabel riwayat perjalanan dengan penyaring lanjutan',
    deskripsi: 'Penyaring gabungan berdasarkan armada, sopir, rentang tanggal, dan status pengiriman.',
    proyekId: 'p05', sprintId: 's03', pj: 'u09', status: 'selesai', prio: 'sedang',
    labels: ['lb03'], mulai: '2026-07-13', tenggat: '2026-07-24', est: 28, jam: 30,
  },
  {
    n: 30, judul: 'Peringatan dini kendaraan menyimpang dari rute',
    deskripsi: 'Deteksi penyimpangan lebih dari 3 km dari rute rencana, kirim notifikasi ke pengawas wilayah.',
    proyekId: 'p05', sprintId: 's04', pj: 'u09', status: 'siap', prio: 'tinggi',
    labels: ['lb03'], mulai: '2026-07-30', tenggat: '2026-08-07', est: 24, jam: 0,
  },
  {
    n: 31, judul: 'Sertifikat TLS kedaluwarsa di lingkungan uji',
    deskripsi: 'Lingkungan uji menolak koneksi sejak 24 Juli. Perpanjangan otomatis gagal karena catatan DNS lama.',
    proyekId: 'p05', sprintId: 's04', pj: 'u11', status: 'blokir', prio: 'tinggi',
    labels: ['lb07', 'lb09'], mulai: '2026-07-24', tenggat: '2026-07-28', est: 6, jam: 4,
    komentar: [{ p: 'u11', w: '2026-07-28 17:05', i: 'Menunggu akses panel DNS dari tim IT klien. Sudah diminta sejak 25 Juli, belum ada balasan.' }],
  },
  {
    n: 32, judul: 'Analisis pola keterlambatan pengiriman',
    deskripsi: 'Cari pola keterlambatan berdasarkan wilayah, jam berangkat, dan jenis muatan selama enam bulan terakhir.',
    proyekId: 'p05', sprintId: 's04', pj: 'u14', status: 'jalan', prio: 'sedang',
    labels: ['lb05'], mulai: '2026-07-27', tenggat: '2026-08-11', est: 30, jam: 8,
  },
  {
    n: 33, judul: 'Ekspor laporan bulanan ke format lembar kerja',
    deskripsi: 'Satu berkas berisi tab per armada, dengan rekap jarak tempuh dan konsumsi bahan bakar.',
    proyekId: 'p05', sprintId: null, pj: 'u09', status: 'backlog', prio: 'rendah',
    labels: ['lb03'], mulai: '2026-08-10', tenggat: '2026-08-28', est: 16, jam: 0,
  },
  {
    n: 34, judul: 'Uji beban 400 kendaraan aktif bersamaan',
    deskripsi: 'Simulasi telemetri penuh selama dua jam untuk memastikan tidak ada antrean data yang menumpuk.',
    proyekId: 'p05', sprintId: 's04', pj: 'u10', status: 'siap', prio: 'sedang',
    labels: ['lb04'], mulai: '2026-08-03', tenggat: '2026-08-07', est: 20, jam: 0,
  },

  /* ---------------- p06, Migrasi Data Klinik Sehat ---------------- */
  {
    n: 35, judul: 'Pemetaan skema rekam medis lama ke baru',
    deskripsi: 'Sistem lama menyimpan 214 kolom, sistem baru 168. Tiga puluh kolom butuh keputusan klinis sebelum dipindahkan.',
    proyekId: 'p06', sprintId: 's06', pj: 'u08', status: 'jalan', prio: 'tinggi',
    labels: ['lb03', 'lb10'], mulai: '2026-07-27', tenggat: '2026-08-11', est: 36, jam: 13,
    sub: ['Inventaris kolom lama', 'Pemetaan satu ke satu', 'Daftar kolom yang butuh keputusan klinis'], subSelesai: 2,
  },
  {
    n: 36, judul: 'Migrasi 90 ribu rekam pasien cabang Bandung',
    deskripsi: 'Dijalankan di luar jam praktik, dengan titik pulih tiap 10 ribu rekam supaya bisa diulang sebagian.',
    proyekId: 'p06', sprintId: 's06', pj: 'u09', status: 'siap', prio: 'tinggi',
    labels: ['lb03'], mulai: '2026-08-05', tenggat: '2026-08-14', est: 28, jam: 0,
    ceklis: ['Cadangan penuh sebelum jalan', 'Uji coba di lingkungan salinan', 'Rencana pulih bila gagal'], ceklisSelesai: 2,
  },
  {
    n: 37, judul: 'Validasi keutuhan data setelah migrasi',
    deskripsi: 'Bandingkan jumlah rekam, nilai kunci, dan berkas lampiran antara sistem lama dan baru, nol selisih yang bisa diterima.',
    proyekId: 'p06', sprintId: 's06', pj: 'u14', status: 'backlog', prio: 'tinggi',
    labels: ['lb04'], mulai: '2026-08-14', tenggat: '2026-08-21', est: 24, jam: 0,
  },
  {
    n: 38, judul: 'Pelatihan staf pendaftaran cabang Bandung',
    deskripsi: 'Dua sesi masing masing 3 jam untuk 18 staf, plus panduan singkat satu halaman yang ditempel di meja.',
    proyekId: 'p06', sprintId: null, pj: 'u01', status: 'backlog', prio: 'sedang',
    labels: ['lb10', 'lb08'], mulai: '2026-08-17', tenggat: '2026-08-26', est: 14, jam: 0,
  },
  {
    n: 39, judul: 'Migrasi tahap satu cabang Jakarta',
    deskripsi: 'Sembilan puluh ribu rekam pasien cabang Jakarta, dijalankan pada akhir pekan pertama Juli.',
    proyekId: 'p06', sprintId: null, pj: 'u09', status: 'selesai', prio: 'tinggi',
    labels: ['lb03'], mulai: '2026-06-22', tenggat: '2026-07-10', est: 32, jam: 35,
  },

  /* ---------------- p07, Portal Karier Grup Adhikara ---------------- */
  {
    n: 40, judul: 'Alur lamaran yang bisa dilacak pelamar',
    deskripsi: 'Pelamar melihat posisi lamarannya di lima tahap, dari diterima sampai keputusan akhir.',
    proyekId: 'p07', sprintId: 's07', pj: 'u06', status: 'backlog', prio: 'tinggi',
    labels: ['lb02'], mulai: '2026-08-03', tenggat: '2026-08-21', est: 34, jam: 0,
  },
  {
    n: 41, judul: 'Kerangka desain portal dan halaman lowongan',
    deskripsi: 'Halaman daftar lowongan dengan penyaring anak usaha, lokasi, dan jenis pekerjaan.',
    proyekId: 'p07', sprintId: 's07', pj: 'u04', status: 'jalan', prio: 'tinggi',
    labels: ['lb01'], mulai: '2026-07-27', tenggat: '2026-08-11', est: 30, jam: 7,
  },
  {
    n: 42, judul: 'Struktur data lowongan dan lamaran',
    deskripsi: 'Rancang tabel lowongan, lamaran, dan riwayat tahap, termasuk aturan retensi data pelamar.',
    proyekId: 'p07', sprintId: 's07', pj: 'u08', status: 'siap', prio: 'sedang',
    labels: ['lb03'], mulai: '2026-08-03', tenggat: '2026-08-14', est: 22, jam: 0,
  },
  {
    n: 43, judul: 'Penulisan deskripsi 40 lowongan contoh',
    deskripsi: 'Deskripsi lowongan dengan struktur seragam untuk sembilan anak usaha, dipakai saat peluncuran.',
    proyekId: 'p07', sprintId: null, pj: 'u12', status: 'backlog', prio: 'rendah',
    labels: ['lb06'], mulai: '2026-08-24', tenggat: '2026-09-15', est: 26, jam: 0,
  },

  /* ---------------- p08, Aplikasi Absensi Mandiri Jaya ---------------- */
  {
    n: 44, judul: 'Ekspor rekap lembur ke sistem penggajian',
    deskripsi: 'Berkas ekspor bulanan dengan format yang diminta tim penggajian klien, termasuk kode pusat biaya.',
    proyekId: 'p08', sprintId: 's08', pj: 'u09', status: 'selesai', prio: 'tinggi',
    labels: ['lb03'], mulai: '2026-07-06', tenggat: '2026-07-17', est: 20, jam: 21,
  },
  {
    n: 45, judul: 'Serah terima dokumentasi ke tim operasional klien',
    deskripsi: 'Dokumen operasional, panduan pemulihan, dan daftar kontak eskalasi, diserahkan dalam satu sesi.',
    proyekId: 'p08', sprintId: 's08', pj: 'u02', status: 'selesai', prio: 'sedang',
    labels: ['lb10', 'lb08'], mulai: '2026-07-13', tenggat: '2026-07-17', est: 10, jam: 12,
  },
  {
    n: 46, judul: 'Absensi gagal terkirim di lokasi tanpa sinyal',
    deskripsi: 'Di tiga titik proyek terpencil absensi tidak terkirim dan tidak tersimpan lokal. Dilaporkan mandor 21 Juli.',
    proyekId: 'p08', sprintId: null, pj: 'u07', status: 'blokir', prio: 'tinggi',
    labels: ['lb09'], mulai: '2026-07-21', tenggat: '2026-07-27', est: 12, jam: 5,
    komentar: [{ p: 'u07', w: '2026-07-27 14:12', i: 'Perlu contoh perangkat dari lokasi. Yang di kantor tidak bisa mengulang kejadiannya.' }],
  },
  {
    n: 47, judul: 'Perpanjangan dukungan operasional tiga bulan',
    deskripsi: 'Penawaran dukungan pasca rilis, mencakup pemantauan dan perbaikan galat dengan waktu tanggap satu hari kerja.',
    proyekId: 'p08', sprintId: null, pj: 'u13', status: 'siap', prio: 'rendah',
    labels: ['lb08'], mulai: '2026-07-27', tenggat: '2026-08-07', est: 8, jam: 2,
  },

  /* ---------------- Kedalaman waktu, Stage 5 (HIM-304) ----------------
     47 tugas Stage 3 semuanya berkumpul di Mei sampai Agustus. Burndown,
     timeline, kalender, dan beban tim semuanya terlihat palsu kalau tanggal
     menumpuk di satu jendela sempit, jadi tugas tambahan ini sengaja
     menjangkau balik ke Februari (sejalan dengan mulainya proyek MJY dan TAL)
     dan maju sampai September, dan mengisi sprint tambahan di sprints.ts
     supaya sprint yang SUDAH SELESAI juga punya isi nyata, bukan cangkang
     kosong. */

  /* NUS Gelombang 1 dan 2, s09 dan s10, sudah selesai */
  {
    n: 48, judul: 'Wawancara pemangku kepentingan internal Nusantara Kopi',
    deskripsi: 'Sepuluh sesi dengan pemilik cabang dan tim operasional, mengumpulkan alasan tiap cabang mempertahankan nama lama.',
    proyekId: 'p01', sprintId: 's09', pj: 'u12', status: 'selesai', prio: 'sedang',
    labels: ['lb05'], mulai: '2026-05-11', tenggat: '2026-05-22', est: 20, jam: 22,
    sub: ['Susun daftar pertanyaan', 'Jadwalkan sepuluh sesi', 'Rekap temuan'], subSelesai: 3,
  },
  {
    n: 49, judul: 'Tiga konsep awal arah identitas',
    deskripsi: 'Tiga arah visual berbeda dipresentasikan ke klien, satu di antaranya dikembangkan lebih jauh di gelombang berikutnya.',
    proyekId: 'p01', sprintId: 's10', pj: 'u03', status: 'selesai', prio: 'tinggi',
    labels: ['lb01'], mulai: '2026-06-01', tenggat: '2026-06-15', est: 28, jam: 30,
    sub: ['Konsep warisan warung', 'Konsep modern minimalis', 'Konsep warna berani'], subSelesai: 3,
    komentar: [{ p: 'u01', w: '2026-06-16 10:00', i: 'Klien pilih arah modern minimalis dengan sentuhan warna dari konsep warisan warung.' }],
  },
  {
    n: 50, judul: 'Uji nama dan tagline ke lima kelompok fokus',
    deskripsi: 'Uji resonansi nama baru dan tiga opsi tagline di lima kota berbeda sebelum dikunci.',
    proyekId: 'p01', sprintId: 's10', pj: 'u12', status: 'selesai', prio: 'sedang',
    labels: ['lb05'], mulai: '2026-06-08', tenggat: '2026-06-19', est: 24, jam: 25,
  },

  /* WPR Sprint 09, s11, sudah selesai */
  {
    n: 51, judul: 'Migrasi basis data transaksi ke skema baru',
    deskripsi: 'Skema lama menyimpan diskon sebagai teks bebas, skema baru memisahkan jenis dan nilai diskon supaya laporan bisa dihitung otomatis.',
    proyekId: 'p02', sprintId: 's11', pj: 'u08', status: 'selesai', prio: 'tinggi',
    labels: ['lb03'], mulai: '2026-06-22', tenggat: '2026-07-03', est: 32, jam: 34,
  },
  {
    n: 52, judul: 'Uji regresi cetak struk di sepuluh model printer',
    deskripsi: 'Sepuluh model printer termal populer di warung mitra, memastikan format struk konsisten di semua model.',
    proyekId: 'p02', sprintId: 's11', pj: 'u10', status: 'selesai', prio: 'sedang',
    labels: ['lb04'], mulai: '2026-06-24', tenggat: '2026-07-01', est: 20, jam: 19,
  },

  /* BSE Sprint 01 selesai, Sprint 02 belum mulai */
  {
    n: 53, judul: 'Susun pedoman gaya penulisan dua bahasa',
    deskripsi: 'Aturan nada bicara, istilah baku, dan penanganan istilah teknis yang tidak diterjemahkan, dipakai seluruh tim penulis konten.',
    proyekId: 'p03', sprintId: 's12', pj: 'u12', status: 'selesai', prio: 'sedang',
    labels: ['lb06', 'lb10'], mulai: '2026-06-01', tenggat: '2026-06-12', est: 16, jam: 17,
  },
  {
    n: 54, judul: 'Rencana pengujian aksesibilitas menyeluruh',
    deskripsi: 'Daftar periksa lengkap sebelum audit dimulai, mencakup kontras, urutan fokus, ARIA, dan navigasi papan ketik di 40 rute.',
    proyekId: 'p03', sprintId: 's13', pj: 'u10', status: 'backlog', prio: 'tinggi',
    labels: ['lb04'], mulai: '2026-09-01', tenggat: '2026-09-08', est: 12, jam: 0,
  },
  {
    n: 55, judul: 'Perbaikan seluruh temuan audit aksesibilitas',
    deskripsi: 'Menunggu hasil audit selesai sebelum bisa dimulai, diperkirakan cukup besar karena situs belum pernah diaudit sebelumnya.',
    proyekId: 'p03', sprintId: 's13', pj: 'u06', status: 'backlog', prio: 'tinggi',
    labels: ['lb02', 'lb04'], mulai: '2026-09-08', tenggat: '2026-09-11', est: 24, jam: 0,
  },

  /* SRR Gelombang Peluncuran, s14, sudah selesai */
  {
    n: 56, judul: 'Casting dan izin talent iklan video pendek',
    deskripsi: 'Tiga talent lokal, kontrak penggunaan gambar untuk televisi dan media sosial selama satu tahun.',
    proyekId: 'p04', sprintId: 's14', pj: 'u13', status: 'selesai', prio: 'sedang',
    labels: ['lb01', 'lb08'], mulai: '2026-06-22', tenggat: '2026-06-29', est: 12, jam: 14,
  },
  {
    n: 57, judul: 'Lokasi syuting dan perizinan pasar tradisional',
    deskripsi: 'Izin syuting di dua pasar tradisional, termasuk kompensasi untuk pedagang yang lapaknya terekam.',
    proyekId: 'p04', sprintId: 's14', pj: 'u13', status: 'selesai', prio: 'sedang',
    labels: ['lb08'], mulai: '2026-06-24', tenggat: '2026-07-01', est: 10, jam: 11,
  },

  /* TAL Sprint 07, s15, sudah selesai jauh di belakang */
  {
    n: 58, judul: 'Kerangka arsitektur dasbor dan pilihan tumpukan teknologi',
    deskripsi: 'Bandingkan tiga pendekatan render peta, pilih yang paling ringan untuk 400 penanda bergerak sekaligus.',
    proyekId: 'p05', sprintId: 's15', pj: 'u07', status: 'selesai', prio: 'tinggi',
    labels: ['lb02'], mulai: '2026-03-16', tenggat: '2026-03-27', est: 24, jam: 26,
    sub: ['Uji render 400 penanda', 'Uji pembaruan tiap 30 detik', 'Putuskan pendekatan final'], subSelesai: 3,
  },
  {
    n: 59, judul: 'Aliran data telemetri pertama dari 20 kendaraan percontohan',
    deskripsi: 'Uji coba dengan 20 kendaraan sebelum digulirkan ke seluruh 400 armada, memastikan format data konsisten.',
    proyekId: 'p05', sprintId: 's15', pj: 'u09', status: 'selesai', prio: 'tinggi',
    labels: ['lb03'], mulai: '2026-03-20', tenggat: '2026-04-03', est: 28, jam: 29,
  },

  /* KSH Migrasi Tahap 1, s16, sudah selesai (rujukan t039 di gelombang lama) */
  {
    n: 60, judul: 'Uji coba migrasi cabang Jakarta di lingkungan salinan',
    deskripsi: 'Simulasi penuh sebelum migrasi sungguhan, memastikan skrip pemetaan 168 kolom berjalan tanpa galat.',
    proyekId: 'p06', sprintId: 's16', pj: 'u08', status: 'selesai', prio: 'tinggi',
    labels: ['lb03', 'lb04'], mulai: '2026-06-22', tenggat: '2026-06-29', est: 20, jam: 21,
  },
  {
    n: 61, judul: 'Pelatihan staf pendaftaran cabang Jakarta',
    deskripsi: 'Dua sesi untuk 22 staf sebelum migrasi tahap satu, memastikan tidak ada kepanikan di hari pertama sistem baru.',
    proyekId: 'p06', sprintId: 's16', pj: 'u01', status: 'selesai', prio: 'sedang',
    labels: ['lb10', 'lb08'], mulai: '2026-06-24', tenggat: '2026-07-01', est: 14, jam: 13,
  },

  /* MJY Sprint 01, s17, jauh di belakang, Februari */
  {
    n: 62, judul: 'Purwarupa absensi lokasi di titik proyek percontohan',
    deskripsi: 'Uji akurasi deteksi lokasi di satu titik proyek sebelum digulirkan ke 22 titik lainnya.',
    proyekId: 'p08', sprintId: 's17', pj: 'u07', status: 'selesai', prio: 'tinggi',
    labels: ['lb02'], mulai: '2026-02-09', tenggat: '2026-02-20', est: 24, jam: 25,
    sub: ['Uji akurasi GPS dalam ruangan', 'Uji akurasi GPS luar ruangan', 'Putuskan radius toleransi'], subSelesai: 3,
  },
  {
    n: 63, judul: 'Desain awal alur absensi mandor dan pekerja harian',
    deskripsi: 'Dua peran berbeda, mandor mencatat kehadiran rombongan, pekerja harian mencatat kehadiran sendiri.',
    proyekId: 'p08', sprintId: 's17', pj: 'u04', status: 'selesai', prio: 'sedang',
    labels: ['lb01'], mulai: '2026-02-12', tenggat: '2026-02-27', est: 20, jam: 22,
  },

  /* ADK Sprint 02, s18, belum mulai, backlog jauh ke depan */
  {
    n: 64, judul: 'Rancangan halaman detail lowongan dan formulir lamaran',
    deskripsi: 'Formulir lamaran singkat, maksimal lima langkah, dengan opsi unggah CV atau isi profil manual.',
    proyekId: 'p07', sprintId: 's18', pj: 'u04', status: 'backlog', prio: 'sedang',
    labels: ['lb01'], mulai: '2026-08-17', tenggat: '2026-08-28', est: 24, jam: 0,
  },
  {
    n: 65, judul: 'Integrasi verifikasi nomor telepon pelamar',
    deskripsi: 'Kode OTP lewat SMS sebelum lamaran bisa dikirim, mengurangi lamaran spam dari akun palsu.',
    proyekId: 'p07', sprintId: 's18', pj: 'u08', status: 'backlog', prio: 'sedang',
    labels: ['lb03'], mulai: '2026-08-24', tenggat: '2026-09-04', est: 18, jam: 0,
  },

  /* Dua tugas jauh ke depan, September, belum terikat sprint mana pun,
     supaya Timeline dan Kalender tetap punya isi setelah semua sprint di
     atas berakhir. */
  {
    n: 66, judul: 'Perencanaan peluncuran bertahap identitas baru per wilayah',
    deskripsi: 'Sembilan wilayah, dimulai dari cabang dengan trafik tertinggi, jarak dua minggu antar gelombang wilayah.',
    proyekId: 'p01', sprintId: null, pj: 'u13', status: 'backlog', prio: 'sedang',
    labels: ['lb08'], mulai: '2026-08-24', tenggat: '2026-09-18', est: 20, jam: 0,
  },
  {
    n: 67, judul: 'Evaluasi enam bulan pertama dasbor logistik bersama klien',
    deskripsi: 'Sesi evaluasi penuh membandingkan target awal proyek dengan kondisi nyata setelah enam bulan berjalan.',
    proyekId: 'p05', sprintId: null, pj: 'u02', status: 'backlog', prio: 'rendah',
    labels: ['lb08'], mulai: '2026-09-14', tenggat: '2026-09-25', est: 10, jam: 0,
  },
];

urutanCounter = {};
export const tasks: Tugas[] = specs.map(mk);

export const tugasById = (id: string | null | undefined) =>
  id ? tasks.find((t) => t.id === id) : undefined;

export const tugasByKode = (kode: string) =>
  tasks.find((t) => t.kode.toLowerCase() === kode.toLowerCase());
