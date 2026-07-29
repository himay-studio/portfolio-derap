import type { Sprint } from './types';

/** Sprint dua mingguan. Hari acuan aplikasi demo adalah 29 Juli 2026. */
export const sprints: Sprint[] = [
  {
    id: 's01',
    slug: 'wpr-sprint-11',
    nama: 'WPR Sprint 11',
    proyekId: 'p02',
    mulai: '2026-07-20',
    selesai: '2026-07-31',
    status: 'berjalan',
    sasaran: 'Mode luring kasir stabil dan sinkronisasi transaksi lolos uji lapangan di 5 warung mitra.',
  },
  {
    id: 's02',
    slug: 'wpr-sprint-10',
    nama: 'WPR Sprint 10',
    proyekId: 'p02',
    mulai: '2026-07-06',
    selesai: '2026-07-17',
    status: 'selesai',
    sasaran: 'Cetak struk dan katalog produk selesai, termasuk pemindai kode batang.',
  },
  {
    id: 's03',
    slug: 'tal-sprint-08',
    nama: 'TAL Sprint 08',
    proyekId: 'p05',
    mulai: '2026-07-13',
    selesai: '2026-07-24',
    status: 'selesai',
    sasaran: 'Peta armada waktu nyata dan tabel riwayat perjalanan siap ditinjau klien.',
  },
  {
    id: 's04',
    slug: 'tal-sprint-09',
    nama: 'TAL Sprint 09',
    proyekId: 'p05',
    mulai: '2026-07-27',
    selesai: '2026-08-07',
    status: 'berjalan',
    sasaran: 'Turunkan waktu muat dasbor di bawah 2 detik pada koneksi 4G lambat.',
  },
  {
    id: 's05',
    slug: 'nus-gelombang-3',
    nama: 'NUS Gelombang 3',
    proyekId: 'p01',
    mulai: '2026-07-20',
    selesai: '2026-08-07',
    status: 'berjalan',
    sasaran: 'Panduan merek versi cetak dan set kemasan untuk tiga lini produk disetujui klien.',
  },
  {
    id: 's06',
    slug: 'ksh-migrasi-tahap-2',
    nama: 'KSH Migrasi Tahap 2',
    proyekId: 'p06',
    mulai: '2026-07-27',
    selesai: '2026-08-14',
    status: 'berjalan',
    sasaran: 'Pindahkan 90 ribu rekam pasien cabang Bandung dengan nol kehilangan data.',
  },
  {
    id: 's07',
    slug: 'adk-sprint-01',
    nama: 'ADK Sprint 01',
    proyekId: 'p07',
    mulai: '2026-08-03',
    selesai: '2026-08-14',
    status: 'akan_datang',
    sasaran: 'Kerangka portal, alur lamaran dasar, dan halaman detail lowongan.',
  },
  {
    id: 's08',
    slug: 'mjy-penutupan',
    nama: 'MJY Penutupan',
    proyekId: 'p08',
    mulai: '2026-07-06',
    selesai: '2026-07-17',
    status: 'selesai',
    sasaran: 'Ekspor penggajian dan serah terima dokumentasi ke tim operasional klien.',
  },
];

export const sprintById = (id: string | null | undefined): Sprint | undefined =>
  id ? sprints.find((s) => s.id === id) : undefined;

export const sprintBySlug = (slug: string): Sprint | undefined =>
  sprints.find((s) => s.slug === slug);
