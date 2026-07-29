import type { Anggota } from './types';

/**
 * 14 anggota. Avatar adalah blok inisial persegi di atas warna seri grafik,
 * bukan foto orang, jadi modul ini tidak bergantung pada aset yang digenerate.
 * Semua warna seri sudah lolos AA terhadap teks putih (DESIGN.md 2.7).
 */
export const team: Anggota[] = [
  { id: 'u01', slug: 'rangga-prasetyo',   nama: 'Rangga Prasetyo',   inisial: 'RP', peran: 'Manajer Proyek',     email: 'rangga@derap.id',   warna: 1, kapasitasJam: 40, bergabung: '2023-02-06', lokasi: 'Jakarta' },
  { id: 'u02', slug: 'kirana-maheswari',  nama: 'Kirana Maheswari',  inisial: 'KM', peran: 'Product Owner',      email: 'kirana@derap.id',   warna: 4, kapasitasJam: 40, bergabung: '2023-04-17', lokasi: 'Bandung' },
  { id: 'u03', slug: 'ayu-lestari',       nama: 'Ayu Lestari',       inisial: 'AL', peran: 'Lead Desainer',      email: 'ayu@derap.id',      warna: 5, kapasitasJam: 40, bergabung: '2022-11-14', lokasi: 'Bandung' },
  { id: 'u04', slug: 'gita-anindya',      nama: 'Gita Anindya',      inisial: 'GA', peran: 'UI Designer',        email: 'gita@derap.id',     warna: 2, kapasitasJam: 36, bergabung: '2024-01-08', lokasi: 'Yogyakarta' },
  { id: 'u05', slug: 'lukman-hakim',      nama: 'Lukman Hakim',      inisial: 'LH', peran: 'Motion Designer',    email: 'lukman@derap.id',   warna: 6, kapasitasJam: 32, bergabung: '2024-06-03', lokasi: 'Jakarta' },
  { id: 'u06', slug: 'bimo-nugroho',      nama: 'Bimo Nugroho',      inisial: 'BN', peran: 'Frontend Engineer',  email: 'bimo@derap.id',     warna: 1, kapasitasJam: 40, bergabung: '2023-07-24', lokasi: 'Surabaya' },
  { id: 'u07', slug: 'hendra-kusuma',     nama: 'Hendra Kusuma',     inisial: 'HK', peran: 'Fullstack Engineer', email: 'hendra@derap.id',   warna: 3, kapasitasJam: 40, bergabung: '2022-09-05', lokasi: 'Jakarta' },
  { id: 'u08', slug: 'citra-halimah',     nama: 'Citra Halimah',     inisial: 'CH', peran: 'Backend Engineer',   email: 'citra@derap.id',    warna: 4, kapasitasJam: 40, bergabung: '2023-10-02', lokasi: 'Bandung' },
  { id: 'u09', slug: 'joko-purnomo',      nama: 'Joko Purnomo',      inisial: 'JP', peran: 'Backend Engineer',   email: 'joko@derap.id',     warna: 2, kapasitasJam: 40, bergabung: '2024-03-11', lokasi: 'Semarang' },
  { id: 'u10', slug: 'dimas-saputra',     nama: 'Dimas Saputra',     inisial: 'DS', peran: 'QA Engineer',        email: 'dimas@derap.id',    warna: 5, kapasitasJam: 40, bergabung: '2023-05-22', lokasi: 'Surabaya' },
  { id: 'u11', slug: 'fajar-ramadhan',    nama: 'Fajar Ramadhan',    inisial: 'FR', peran: 'DevOps',             email: 'fajar@derap.id',    warna: 6, kapasitasJam: 40, bergabung: '2022-12-12', lokasi: 'Jakarta' },
  { id: 'u12', slug: 'erika-wijaya',      nama: 'Erika Wijaya',      inisial: 'EW', peran: 'Content Strategist', email: 'erika@derap.id',    warna: 3, kapasitasJam: 32, bergabung: '2024-02-19', lokasi: 'Jakarta' },
  { id: 'u13', slug: 'indah-permata',     nama: 'Indah Permata',     inisial: 'IP', peran: 'Account Manager',    email: 'indah@derap.id',    warna: 5, kapasitasJam: 40, bergabung: '2023-01-16', lokasi: 'Jakarta' },
  { id: 'u14', slug: 'maya-sari',         nama: 'Maya Sari',         inisial: 'MS', peran: 'Data Analyst',       email: 'maya@derap.id',     warna: 2, kapasitasJam: 36, bergabung: '2024-08-05', lokasi: 'Yogyakarta' },
];

/** Pengguna yang sedang masuk pada demo. */
export const penggunaSaatIni = team[0];

export const anggotaById = (id: string | null | undefined): Anggota | undefined =>
  id ? team.find((a) => a.id === id) : undefined;

export const anggotaBySlug = (slug: string): Anggota | undefined =>
  team.find((a) => a.slug === slug);
