import type { CatatanJam } from './types';

type Baris = [tugasId: string, anggotaId: string, tanggal: string, jam: number, catatan: string, ditagihkan: boolean];

/**
 * Catatan jam dua minggu terakhir, 20 sampai 31 Juli 2026.
 * Kolom `jam` memakai desimal, bukan format jam menit, supaya rekap per orang
 * dan per proyek bisa dijumlahkan langsung tanpa parsing.
 */
const baris: Baris[] = [
  ['t007', 'u07', '2026-07-20', 6.5, 'Rancang antrean transaksi lokal', true],
  ['t007', 'u07', '2026-07-21', 7.0, 'Implementasi antrean IndexedDB', true],
  ['t007', 'u07', '2026-07-27', 6.0, 'Penanda idempoten dan uji kirim ganda', true],
  ['t007', 'u07', '2026-07-28', 7.5, 'Telusuri laporan transaksi ganda dari QA', true],
  ['t008', 'u06', '2026-07-22', 3.0, 'Ulangi galat struk terpotong di emulator', true],
  ['t008', 'u06', '2026-07-23', 3.0, 'Cari beda perilaku driver termal Android 11', true],
  ['t010', 'u08', '2026-07-21', 5.0, 'Kueri rekap penjualan harian', true],
  ['t010', 'u08', '2026-07-22', 6.5, 'Ekspor lembar kerja dan format kolom', true],
  ['t010', 'u08', '2026-07-27', 6.5, 'Perbaikan zona waktu pada rekap harian', true],
  ['t014', 'u11', '2026-07-23', 4.5, 'Konfigurasi jalur rilis internal', true],
  ['t014', 'u11', '2026-07-28', 4.5, 'Penandatanganan build otomatis', true],
  ['t015', 'u10', '2026-07-24', 5.0, 'Susun 50 skenario uji pembayaran', true],
  ['t015', 'u10', '2026-07-27', 5.0, 'Jalankan uji tunai dan kembalian', true],
  ['t015', 'u10', '2026-07-28', 5.0, 'Jalankan uji QRIS dan pembayaran gabungan', true],
  ['t001', 'u03', '2026-07-20', 6.0, 'Susun bab aturan logo dan ruang aman', true],
  ['t001', 'u03', '2026-07-21', 6.5, 'Contoh papan nama cabang', true],
  ['t001', 'u03', '2026-07-27', 3.5, 'Revisi contoh papan nama dalam mal', true],
  ['t001', 'u03', '2026-07-28', 3.0, 'Siapkan ekspor berkas cetak', true],
  ['t002', 'u04', '2026-07-20', 7.0, 'Varian gula aren dan pandan', true],
  ['t002', 'u04', '2026-07-21', 6.0, 'Varian original dan penyelarasan grid', true],
  ['t002', 'u04', '2026-07-22', 5.0, 'Perbaikan warna hijau varian pandan', true],
  ['t004', 'u05', '2026-07-28', 2.0, 'Riset referensi animasi logo', false],
  ['t018', 'u04', '2026-07-23', 6.0, 'Rancang daftar laporan investor', true],
  ['t018', 'u04', '2026-07-24', 6.0, 'Penyaring tahun dan tampilan mobile', true],
  ['t020', 'u12', '2026-07-20', 5.0, 'Ringkas profil tiga anak usaha', true],
  ['t020', 'u12', '2026-07-27', 5.0, 'Ringkas profil tiga anak usaha berikutnya', true],
  ['t020', 'u12', '2026-07-28', 4.0, 'Selaraskan struktur antarprofil', true],
  ['t023', 'u05', '2026-07-20', 6.0, 'Penyuntingan kasar video satu dan dua', true],
  ['t023', 'u05', '2026-07-21', 6.0, 'Penyuntingan kasar video tiga', true],
  ['t023', 'u05', '2026-07-27', 5.0, 'Gradasi warna video satu', true],
  ['t024', 'u04', '2026-07-27', 4.0, 'Penanda rak tiga ukuran', true],
  ['t024', 'u04', '2026-07-28', 4.0, 'Spanduk pintu masuk dan revisi klien', true],
  ['t027', 'u07', '2026-07-29', 5.0, 'Ukur muatan awal dan permintaan berantai', true],
  ['t027', 'u07', '2026-07-28', 6.0, 'Pecah bundel per rute', true],
  ['t031', 'u11', '2026-07-24', 2.0, 'Telusuri kegagalan perpanjangan sertifikat', true],
  ['t031', 'u11', '2026-07-28', 2.0, 'Kejar akses panel DNS ke tim IT klien', false],
  ['t032', 'u14', '2026-07-27', 4.0, 'Tarik data enam bulan dan bersihkan', true],
  ['t032', 'u14', '2026-07-28', 4.0, 'Analisis awal pola keterlambatan', true],
  ['t035', 'u08', '2026-07-27', 6.5, 'Inventaris 214 kolom sistem lama', true],
  ['t035', 'u08', '2026-07-28', 6.5, 'Pemetaan satu ke satu 168 kolom', true],
  ['t041', 'u04', '2026-07-28', 3.5, 'Kerangka halaman daftar lowongan', true],
  ['t041', 'u04', '2026-07-29', 3.5, 'Penyaring anak usaha dan lokasi', true],
  ['t046', 'u07', '2026-07-21', 2.5, 'Ulangi galat absensi tanpa sinyal', true],
  ['t046', 'u07', '2026-07-22', 2.5, 'Cek penyimpanan lokal di perangkat uji', true],
  ['t047', 'u13', '2026-07-27', 2.0, 'Susun draf penawaran dukungan', false],
  ['t011', 'u10', '2026-07-29', 3.0, 'Siapkan lembar observasi uji lapangan', true],
  ['t019', 'u10', '2026-07-29', 2.0, 'Susun daftar periksa audit aksesibilitas', true],
  ['t036', 'u09', '2026-07-29', 5.5, 'Uji coba migrasi di lingkungan salinan', true],
  ['t030', 'u09', '2026-07-28', 4.0, 'Rancang aturan deteksi penyimpangan rute', true],
];

export const timesheet: CatatanJam[] = baris.map(
  ([tugasId, anggotaId, tanggal, jam, catatan, ditagihkan], i) => ({
    id: `ts${String(i + 1).padStart(3, '0')}`,
    tugasId,
    anggotaId,
    tanggal,
    jam,
    catatan,
    ditagihkan,
  }),
);
