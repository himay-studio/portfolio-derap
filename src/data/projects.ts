import type { Proyek } from './types';

/**
 * 8 proyek berjalan. Kesehatan proyek TIDAK disimpan di sini, karena
 * dihitung dari tenggat dan progres nyata (BRAND.md bagian 2). Lihat
 * `src/lib/derived.ts`.
 */
export const projects: Proyek[] = [
  {
    id: 'p01',
    slug: 'rebranding-nusantara-kopi',
    kode: 'NUS',
    nama: 'Rebranding Nusantara Kopi',
    klien: 'Nusantara Kopi',
    deskripsi:
      'Identitas baru untuk jaringan kedai kopi 24 cabang, mencakup logo, kemasan, dan panduan merek. Peluncuran bertahap mulai kuartal empat.',
    mulai: '2026-05-11',
    tenggat: '2026-08-21',
    pemilikId: 'u01',
    anggotaIds: ['u01', 'u03', 'u04', 'u05', 'u12', 'u13'],
    anggaranJam: 640,
    arsip: false,
  },
  {
    id: 'p02',
    slug: 'aplikasi-kasir-warung-pintar',
    kode: 'WPR',
    nama: 'Aplikasi Kasir Warung Pintar',
    klien: 'Warung Pintar Group',
    deskripsi:
      'Aplikasi kasir untuk 1.200 warung mitra, jalan luring saat sinyal hilang lalu menyinkronkan transaksi saat kembali daring.',
    mulai: '2026-04-06',
    tenggat: '2026-07-31',
    pemilikId: 'u02',
    anggotaIds: ['u02', 'u06', 'u07', 'u08', 'u10', 'u11'],
    anggaranJam: 980,
    arsip: false,
  },
  {
    id: 'p03',
    slug: 'situs-korporat-bumi-sentosa',
    kode: 'BSE',
    nama: 'Situs Korporat Bumi Sentosa',
    klien: 'Bumi Sentosa Tbk',
    deskripsi:
      'Situs korporat dua bahasa dengan pusat laporan tahunan dan ruang investor. Wajib lolos audit aksesibilitas sebelum rilis.',
    mulai: '2026-06-01',
    tenggat: '2026-09-11',
    pemilikId: 'u01',
    anggotaIds: ['u01', 'u04', 'u06', 'u12', 'u14'],
    anggaranJam: 520,
    arsip: false,
  },
  {
    id: 'p04',
    slug: 'kampanye-ramadan-sari-rasa',
    kode: 'SRR',
    nama: 'Kampanye Ramadan Sari Rasa',
    klien: 'Sari Rasa Food',
    deskripsi:
      'Kampanye musiman lintas kanal, mencakup materi toko, iklan video pendek, dan halaman promo yang berumur enam minggu.',
    mulai: '2026-06-22',
    tenggat: '2026-08-07',
    pemilikId: 'u13',
    anggotaIds: ['u03', 'u05', 'u12', 'u13'],
    anggaranJam: 300,
    arsip: false,
  },
  {
    id: 'p05',
    slug: 'dasbor-logistik-trans-andalan',
    kode: 'TAL',
    nama: 'Dasbor Logistik Trans Andalan',
    klien: 'Trans Andalan Logistik',
    deskripsi:
      'Dasbor pemantauan armada 400 kendaraan, memakai data telemetri yang masuk tiap 30 detik. Fokus pada kecepatan muat halaman.',
    mulai: '2026-03-16',
    tenggat: '2026-07-24',
    pemilikId: 'u02',
    anggotaIds: ['u02', 'u07', 'u09', 'u10', 'u14'],
    anggaranJam: 760,
    arsip: false,
  },
  {
    id: 'p06',
    slug: 'migrasi-data-klinik-sehat',
    kode: 'KSH',
    nama: 'Migrasi Data Klinik Sehat',
    klien: 'Klinik Sehat Bersama',
    deskripsi:
      'Pindah rekam medis 180 ribu pasien dari sistem lama ke basis data baru, tanpa jeda layanan di jam praktik.',
    mulai: '2026-05-25',
    tenggat: '2026-08-28',
    pemilikId: 'u01',
    anggotaIds: ['u01', 'u08', 'u09', 'u11', 'u14'],
    anggaranJam: 440,
    arsip: false,
  },
  {
    id: 'p07',
    slug: 'portal-karier-grup-adhikara',
    kode: 'ADK',
    nama: 'Portal Karier Grup Adhikara',
    klien: 'Grup Adhikara',
    deskripsi:
      'Portal lowongan internal dan eksternal untuk sembilan anak usaha, dengan alur lamaran yang bisa dilacak pelamar.',
    mulai: '2026-07-06',
    tenggat: '2026-10-02',
    pemilikId: 'u13',
    anggotaIds: ['u04', 'u06', 'u08', 'u12', 'u13'],
    anggaranJam: 580,
    arsip: false,
  },
  {
    id: 'p08',
    slug: 'aplikasi-absensi-mandiri-jaya',
    kode: 'MJY',
    nama: 'Aplikasi Absensi Mandiri Jaya',
    klien: 'Mandiri Jaya Konstruksi',
    deskripsi:
      'Absensi lapangan berbasis lokasi untuk 22 titik proyek, termasuk rekap lembur dan ekspor ke sistem penggajian.',
    mulai: '2026-02-09',
    tenggat: '2026-07-17',
    pemilikId: 'u02',
    anggotaIds: ['u02', 'u07', 'u09', 'u10', 'u11'],
    anggaranJam: 690,
    arsip: false,
  },
];

export const proyekById = (id: string | null | undefined): Proyek | undefined =>
  id ? projects.find((p) => p.id === id) : undefined;

export const proyekBySlug = (slug: string): Proyek | undefined =>
  projects.find((p) => p.slug === slug);
