import type { Aktivitas, JenisAktivitas } from './types';

type Baris = [tugasId: string, pelakuId: string, jenis: JenisAktivitas, waktu: string, ringkas: string];

/** Riwayat aktivitas, dipakai di panel detail tugas dan umpan dasbor. */
const baris: Baris[] = [
  ['t027', 'u07', 'pindah_status', '2026-07-29 09:12', 'memindahkan tugas ke Sedang Berjalan'],
  ['t041', 'u04', 'catat_jam', '2026-07-29 08:55', 'mencatat 3,5 jam'],
  ['t036', 'u09', 'catat_jam', '2026-07-29 08:40', 'mencatat 5,5 jam'],
  ['t011', 'u10', 'ganti_tenggat', '2026-07-29 08:05', 'mengubah tenggat menjadi 5 Agustus 2026'],
  ['t007', 'u07', 'komentar', '2026-07-28 13:22', 'menambahkan komentar'],
  ['t007', 'u10', 'komentar', '2026-07-28 10:05', 'menambahkan komentar'],
  ['t008', 'u06', 'pindah_status', '2026-07-28 15:10', 'memindahkan tugas ke Diblokir'],
  ['t031', 'u11', 'komentar', '2026-07-28 17:05', 'menambahkan komentar'],
  ['t002', 'u03', 'komentar', '2026-07-28 16:40', 'menambahkan komentar'],
  ['t002', 'u04', 'pindah_status', '2026-07-28 09:30', 'memindahkan tugas ke Review'],
  ['t024', 'u04', 'pindah_status', '2026-07-28 09:22', 'memindahkan tugas ke Review'],
  ['t027', 'u02', 'komentar', '2026-07-28 08:30', 'menambahkan komentar'],
  ['t001', 'u03', 'lampiran', '2026-07-27 15:48', 'melampirkan panduan-merek-v4.pdf'],
  ['t001', 'u03', 'komentar', '2026-07-27 11:02', 'menambahkan komentar'],
  ['t001', 'u01', 'komentar', '2026-07-27 09:14', 'menambahkan komentar'],
  ['t035', 'u08', 'pindah_status', '2026-07-27 09:05', 'memindahkan tugas ke Sedang Berjalan'],
  ['t032', 'u14', 'pindah_status', '2026-07-27 08:50', 'memindahkan tugas ke Sedang Berjalan'],
  ['t046', 'u07', 'komentar', '2026-07-27 14:12', 'menambahkan komentar'],
  ['t047', 'u13', 'buat', '2026-07-27 08:15', 'membuat tugas'],
  ['t028', 'u07', 'pindah_status', '2026-07-24 17:30', 'memindahkan tugas ke Selesai'],
  ['t029', 'u09', 'pindah_status', '2026-07-24 16:10', 'memindahkan tugas ke Selesai'],
  ['t031', 'u11', 'pindah_status', '2026-07-24 11:20', 'memindahkan tugas ke Diblokir'],
  ['t015', 'u10', 'ganti_penanggung_jawab', '2026-07-24 09:40', 'menetapkan Dimas Saputra sebagai penanggung jawab'],
  ['t009', 'u06', 'pindah_status', '2026-07-17 16:55', 'memindahkan tugas ke Selesai'],
  ['t044', 'u09', 'pindah_status', '2026-07-17 15:30', 'memindahkan tugas ke Selesai'],
  ['t045', 'u02', 'pindah_status', '2026-07-17 14:05', 'memindahkan tugas ke Selesai'],
];

export const activity: Aktivitas[] = baris.map(([tugasId, pelakuId, jenis, waktu, ringkas], i) => ({
  id: `ak${String(i + 1).padStart(3, '0')}`,
  tugasId,
  pelakuId,
  jenis,
  waktu,
  ringkas,
}));

export const aktivitasTugas = (tugasId: string): Aktivitas[] =>
  activity.filter((a) => a.tugasId === tugasId);
