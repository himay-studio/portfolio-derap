import type { Label, Prioritas, StatusKolom, Workspace } from './types';

/**
 * Kolom status bisa disesuaikan lewat halaman Pengaturan, jadi seluruh aplikasi
 * membaca daftar ini dan tidak pernah menuliskan nama status secara harfiah.
 * Papan Kanban membangun kolomnya dari sini.
 */
export const statuses: StatusKolom[] = [
  { id: 'backlog',  nama: 'Backlog',          tone: 'neutral', urutan: 1, selesai: false, batasWip: null },
  { id: 'siap',     nama: 'Siap Dikerjakan',  tone: 'brand',   urutan: 2, selesai: false, batasWip: 12 },
  // Sengaja diset 10 sementara isinya 11, supaya peringatan batas kerja
  // berjalan benar benar terlihat sekali di demo. Kolom lain dibuat longgar,
  // karena papan yang SETIAP kolomnya merah terbaca seperti build yang rusak,
  // bukan seperti fitur.
  { id: 'jalan',    nama: 'Sedang Berjalan',  tone: 'info',    urutan: 3, selesai: false, batasWip: 10 },
  { id: 'review',   nama: 'Review',           tone: 'warning', urutan: 4, selesai: false, batasWip: 6 },
  { id: 'blokir',   nama: 'Diblokir',         tone: 'danger',  urutan: 5, selesai: false, batasWip: 4 },
  { id: 'selesai',  nama: 'Selesai',          tone: 'success', urutan: 6, selesai: true,  batasWip: null },
];

export const statusById = (id: string): StatusKolom | undefined =>
  statuses.find((s) => s.id === id);

export const statusUrut = [...statuses].sort((a, b) => a.urutan - b.urutan);

/** Prioritas selalu dirender sebagai ikon PLUS teks, tidak pernah ikon saja. */
export const prioritas: Prioritas[] = [
  { id: 'tinggi', nama: 'Tinggi', tone: 'danger',  arah: 'naik',  urutan: 1 },
  { id: 'sedang', nama: 'Sedang', tone: 'warning', arah: 'datar', urutan: 2 },
  { id: 'rendah', nama: 'Rendah', tone: 'neutral', arah: 'turun', urutan: 3 },
];

export const prioritasById = (id: string): Prioritas | undefined =>
  prioritas.find((p) => p.id === id);

export const labels: Label[] = [
  { id: 'lb01', nama: 'Desain',      tone: 'brand' },
  { id: 'lb02', nama: 'Frontend',    tone: 'info' },
  { id: 'lb03', nama: 'Backend',     tone: 'success' },
  { id: 'lb04', nama: 'QA',          tone: 'warning' },
  { id: 'lb05', nama: 'Riset',       tone: 'neutral' },
  { id: 'lb06', nama: 'Konten',      tone: 'brand' },
  { id: 'lb07', nama: 'Infrastruktur', tone: 'neutral' },
  { id: 'lb08', nama: 'Klien',       tone: 'info' },
  { id: 'lb09', nama: 'Perbaikan',   tone: 'danger' },
  { id: 'lb10', nama: 'Dokumentasi', tone: 'neutral' },
];

export const labelById = (id: string): Label | undefined =>
  labels.find((l) => l.id === id);

export const workspace: Workspace = {
  nama: 'Studio Derap',
  slug: 'studio-derap',
  zonaWaktu: 'Asia/Jakarta, GMT+7',
  awalMinggu: 'senin',
  jamKerjaPerHari: 8,
  hariKerja: ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'],
  mataUang: 'Rupiah, IDR',
  bahasa: 'Bahasa Indonesia',
};
