/**
 * Bentuk data Derap.
 *
 * Aturan R42 dipegang di sini: dimensi varian adalah ATRIBUT, bukan record
 * baru. Prioritas, status, dan label adalah atribut pada Tugas. Tidak ada
 * entitas "Tugas Prioritas Tinggi" yang berdiri sendiri.
 *
 * Semua tanggal disimpan sebagai string ISO `YYYY-MM-DD` supaya static export
 * tidak pernah menghasilkan markup yang berbeda antara server dan klien.
 */

export type Tone = 'neutral' | 'brand' | 'info' | 'success' | 'warning' | 'danger';

/* -------------------------------------------------------------------------- */
/* Tim                                                                        */
/* -------------------------------------------------------------------------- */

export type PeranTim =
  | 'Manajer Proyek'
  | 'Product Owner'
  | 'Lead Desainer'
  | 'UI Designer'
  | 'Motion Designer'
  | 'Frontend Engineer'
  | 'Backend Engineer'
  | 'Fullstack Engineer'
  | 'QA Engineer'
  | 'DevOps'
  | 'Content Strategist'
  | 'Account Manager'
  | 'Data Analyst';

export interface Anggota {
  id: string;
  slug: string;
  nama: string;
  /** Dua huruf. Avatar Derap adalah blok inisial persegi, bukan foto. */
  inisial: string;
  peran: PeranTim;
  email: string;
  /** Token `--chart-1` sampai `--chart-6`. Semua lolos AA terhadap teks putih. */
  warna: 1 | 2 | 3 | 4 | 5 | 6;
  /** Kapasitas jam per minggu. */
  kapasitasJam: number;
  bergabung: string;
  lokasi: string;
}

/* -------------------------------------------------------------------------- */
/* Pengaturan: kolom status dan label, keduanya bisa disesuaikan pengguna     */
/* -------------------------------------------------------------------------- */

export interface StatusKolom {
  id: string;
  nama: string;
  tone: Tone;
  /** Urutan kolom di papan Kanban. */
  urutan: number;
  /** Tugas di kolom ini dianggap selesai untuk perhitungan progres. */
  selesai: boolean;
  /** Batas jumlah tugas yang wajar dalam kolom ini, dipakai Kanban. */
  batasWip: number | null;
}

export interface Label {
  id: string;
  nama: string;
  tone: Tone;
}

export type PrioritasId = 'tinggi' | 'sedang' | 'rendah';

export interface Prioritas {
  id: PrioritasId;
  nama: string;
  tone: Tone;
  /** Arah panah indikator: naik, datar, turun. Ikon tidak pernah berdiri sendiri. */
  arah: 'naik' | 'datar' | 'turun';
  urutan: number;
}

/* -------------------------------------------------------------------------- */
/* Proyek                                                                     */
/* -------------------------------------------------------------------------- */

/** Kesehatan proyek dihitung dari tenggat dan progres, tidak diisi manual. */
export type Kesehatan = 'on_track' | 'at_risk' | 'late';

export interface Proyek {
  id: string;
  slug: string;
  kode: string;
  nama: string;
  klien: string;
  deskripsi: string;
  mulai: string;
  tenggat: string;
  pemilikId: string;
  anggotaIds: string[];
  /** Anggaran jam untuk seluruh proyek, dipakai halaman Timesheet. */
  anggaranJam: number;
  arsip: boolean;
}

/* -------------------------------------------------------------------------- */
/* Sprint                                                                     */
/* -------------------------------------------------------------------------- */

export type StatusSprint = 'selesai' | 'berjalan' | 'akan_datang';

export interface Sprint {
  id: string;
  slug: string;
  nama: string;
  proyekId: string;
  mulai: string;
  selesai: string;
  status: StatusSprint;
  sasaran: string;
}

/* -------------------------------------------------------------------------- */
/* Tugas                                                                      */
/* -------------------------------------------------------------------------- */

export interface SubTugas {
  id: string;
  judul: string;
  selesai: boolean;
}

export interface ItemCeklis {
  id: string;
  judul: string;
  selesai: boolean;
}

export interface KomentarTugas {
  id: string;
  penulisId: string;
  waktu: string;
  isi: string;
}

export type JenisAktivitas =
  | 'buat'
  | 'pindah_status'
  | 'ganti_penanggung_jawab'
  | 'ganti_tenggat'
  | 'komentar'
  | 'lampiran'
  | 'catat_jam';

export interface Aktivitas {
  id: string;
  tugasId: string;
  pelakuId: string;
  jenis: JenisAktivitas;
  waktu: string;
  ringkas: string;
}

export interface Lampiran {
  id: string;
  nama: string;
  /** Mock. Tidak ada berkas nyata, tidak ada gambar yang perlu digenerate. */
  jenis: 'pdf' | 'gambar' | 'dokumen' | 'lembar';
  ukuran: string;
}

export interface Tugas {
  id: string;
  /** Kode produk `DRP-<nomor>`, wajib dirender dengan font mono. */
  kode: string;
  judul: string;
  deskripsi: string;
  proyekId: string;
  sprintId: string | null;
  penanggungJawabId: string | null;
  statusId: string;
  prioritas: PrioritasId;
  labelIds: string[];
  /** Tanggal mulai dipakai view Timeline. */
  mulai: string;
  /** Tenggat dipakai view Kalender dan perhitungan telat. */
  tenggat: string;
  estimasiJam: number;
  jamTercatat: number;
  subtugas: SubTugas[];
  ceklis: ItemCeklis[];
  komentar: KomentarTugas[];
  lampiran: Lampiran[];
  /** Urutan di dalam kolom Kanban. Dipakai drag and drop. */
  urutan: number;
}

/* -------------------------------------------------------------------------- */
/* Timesheet                                                                  */
/* -------------------------------------------------------------------------- */

export interface CatatanJam {
  id: string;
  tugasId: string;
  anggotaId: string;
  tanggal: string;
  jam: number;
  catatan: string;
  /** Jam yang bisa ditagihkan ke klien. */
  ditagihkan: boolean;
}

/* -------------------------------------------------------------------------- */
/* Pengaturan workspace                                                       */
/* -------------------------------------------------------------------------- */

export interface Workspace {
  nama: string;
  slug: string;
  zonaWaktu: string;
  awalMinggu: 'senin' | 'minggu';
  jamKerjaPerHari: number;
  hariKerja: string[];
  mataUang: string;
  bahasa: string;
}
